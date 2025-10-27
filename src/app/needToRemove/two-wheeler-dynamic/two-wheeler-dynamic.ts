// src/app/pages/main-app/create-insurance/two-wheeler/two-wheeler.ts (UPDATED)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// IMPORTANT: Make sure your import includes the new interfaces
import { FormConfig, FormFieldConfig, SectionConfig, LayoutRow, LayoutColumn } from '../../core/models/form-control';
import { FormConfigService } from '../../core/Services/form-config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-two-wheeler-dynamic',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './two-wheeler-dynamic.html',
  styleUrls: ['./two-wheeler-dynamic.scss']
})
export class TwoWheelerDynamic implements OnInit {
  
  formConfig: FormConfig | undefined;
  insuranceForm: FormGroup;
  isFormReady = false;
  collapseState: { [key: string]: boolean } = {};

  isCalculating = false;
  premiumAmount: number | null = null;
  premiumStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private formConfigService: FormConfigService,
    private http: HttpClient
  ) {
    this.insuranceForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.formConfigService.getFormConfig('two-wheeler-insurance').subscribe(config => {
      // NOTE: We don't need the migration logic here, as we assume the config
      // is already saved in the new format by the builder.
      this.formConfig = config;
      this.initializeCollapseState(config);
      this.buildForm(config);
      this.isFormReady = true;
    });
  }
  
  // REFACTORED: Iterate through the new nested structure to set collapse states.
  initializeCollapseState(config: FormConfig): void {
    if (!config || !config.rows) return;
    
    config.rows.forEach((row: LayoutRow) => {
      row.columns.forEach((col: LayoutColumn) => {
        col.sections.forEach((sec: SectionConfig) => {
          this.collapseState[sec.sectionTitle] = false; // Default to not collapsed
        });
      });
    });
  }

  toggleCollapse(sectionTitle: string): void {
    this.collapseState[sectionTitle] = !this.collapseState[sectionTitle];
  }

  // REFACTORED: Use flatMap to easily get all controls from the new nested structure.
  buildForm(config: FormConfig) {
    if (!config || !config.rows) return;

    // This is the key logic change:
    const allControls = config.rows.flatMap(row => 
      row.columns.flatMap(col => 
        col.sections.flatMap(sec => sec.controls)
      )
    );

    allControls.forEach((control: FormFieldConfig) => {
      // The logic for creating each individual control remains the same.
      const formControl = new FormControl(control.value || '');
      const validators = [];
      if (control.validators?.required) {
        validators.push(Validators.required);
      }
      formControl.setValidators(validators);
      this.insuranceForm.addControl(control.name, formControl);
    });
  }
  
  // =======================================================
  // NO CHANGES NEEDED FOR THE METHODS BELOW THIS LINE
  // They operate on the 'insuranceForm' which is already flat,
  // or are self-contained business logic.
  // =======================================================

  isControlVisible(control: FormFieldConfig): boolean {
    if (!control.condition) {
      return true;
    }
    const dependentControl = this.insuranceForm.get(control.condition.fieldName);
    if (!dependentControl) {
      return true;
    }

    switch (control.condition.operator) {
      case 'equals':
        return dependentControl.value == control.condition.value; // Use '==' for loose comparison (e.g., 'true' vs true)
      case 'notEquals':
        return dependentControl.value != control.condition.value;
      default:
        return true;
    }
  }

  calculatePremium() {
    this.isCalculating = true;
    setTimeout(() => {
      const form = this.insuranceForm.value;
      const basePremium = 1000;
      const engineCC = Number(form.engineCC) || 0; // Example field
      const isComprehensive = form.policyType === 'comprehensive'; // Example field
      this.premiumAmount = basePremium + (engineCC * 2) + (isComprehensive ? 500 : 0);
      this.premiumStatus = 'Calculated';
      this.isCalculating = false;
    }, 700);
  }

  onSubmit() {
    this.insuranceForm.markAllAsTouched();
    if (this.insuranceForm.valid) {
      console.log('Form Submitted!', this.insuranceForm.value);
      alert('Two Wheeler Policy Submitted! Check the console.');
    } else {
      alert('Form is invalid. Please check all fields.');
    }
  }
}