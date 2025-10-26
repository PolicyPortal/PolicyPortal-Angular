import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { InsuranceService } from '../../../core/Services/insurance.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-two-wheeler',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-wheeler.html',
  styleUrl: './two-wheeler.scss'
})
export class TwoWheeler {
insuranceForm!: FormGroup;
  isFormReady = false;
  collapseState: { [key: string]: boolean } = {};
  
  isCalculating = false;
  premiumAmount: number | null = null;
  premiumStatus: string | null = null;
  
  financers : string[] = []; 

  constructor(private fb: FormBuilder, private insuranceService: InsuranceService) {}

  ngOnInit() {
    this.initializeForm();
    this.setupConditionalLogic();
    this.getFinancers();
  }
  
  /**
   * Initializes the form by creating form controls statically.
   */
  initializeForm(): void {

    const today = new Date().toISOString().slice(0, 10);

    this.insuranceForm = this.fb.group({
      // Coverage Details
      bodyType: [null, Validators.required],
      isNewVehicle: ['No', Validators.required],
      policyType: [null, Validators.required],
      previousPolicyExpired: [null, Validators.required],
      claimInPreviousYear: [null, Validators.required],
      previousYearNCB: [null, Validators.required],
      insurer: [null, Validators.required],
      riskStartDate: [today, Validators.required],
      // Vehicle Details
      registrationDate: ['', Validators.required],
      manufacturingYear: [null, Validators.required],
      rto : ['', Validators.required],
      vehiclePincode : ['', Validators.required],
      vehicleCity : ['', Validators.required],
      vehicleState : ['', Validators.required],
      // manufacturer: ['', Validators.required],
      // model: ['', Validators.required],
      manufacturer: [null, Validators.required],
      model: [null, Validators.required],
      cc : [null, Validators.required],
      engineNumber: ['', Validators.required],
      chassisNumber: ['', Validators.required],
      haveRegistrationNumber: ['No', Validators.required],
      vehicleNumber: ['', Validators.required],
      // registrationNumber: ['', Validators.required],
      exShowroomPrice: [null, Validators.required],
      idv: [null, Validators.required],
      // Add Ons
      nilDep: [false],
      handicapped: [false],
      paToUnnamed: [false],
      electricalAccessories: [false],
      nonElectricalAccessories: [false],
      rti: [false],
      consumables: [false],
      engineProtect: [false],
      // Hypothecation Details
      isHypothecated: ['No', Validators.required],
      financier: [null, Validators.required],
      branchLocation : ['', Validators.required],
      ifFinancierNotListed: ['', Validators.required],

      // Customer Details
      customerType: ['individual', Validators.required],

      // Individual Details
      gender : [null, Validators.required],
      salutation : [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      customerAadhar: [null, Validators.required], // Regex for a valid 12-digit Aadhaar number
      customerPAN: [null], // Regex for a valid PAN number
      customerForm16: [null],
      
      companyName: ['', Validators.required],
      dateOfIncorporation: ['', Validators.required],
      gstin: [''],
      
      mobile : ['', [Validators.required,Validators.pattern("^[1-9]\\d{9}$") ]],// Regex for a 10-digit Indian mobile number
      email : ['', [Validators.required, Validators.email]],
      
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      addressLine3: [''],
      customerPincode: ['', Validators.required],
      customerCity: ['', Validators.required],
      customerState: ['', Validators.required],
      // Nominee Details
      nomineeName: ['', Validators.required],
      nomineeRelation: [null, Validators.required],
      nomineeAge: [null, Validators.required],
      nomineeGender: [null, Validators.required],
    },{
      validators: this.panOrForm16RequiredValidator.bind(this)
    });

    // Initialize collapse states
    ['Coverage Details', 'Vehicle Details', 'Hypothecation Details', 'Customer Details', 'Nominee Details'].forEach(title => {
        this.collapseState[title] = false;
    });
    // ['Coverage Details'].forEach(title => {
    //     this.collapseState[title] = false;
    // });

    this.isFormReady = true;
  }
  
  /**
   * Custom validator to check if either PAN or Form16 is provided for individuals.
   */
  panOrForm16RequiredValidator(group: AbstractControl): ValidationErrors | null {
    const customerType = group.get('customerType')?.value;
    const pan = group.get('customerPAN');
    const form16 = group.get('customerForm16');
  
    // Only apply logic if customer is 'individual' and controls exist
    if (customerType === 'individual' && pan && form16) {
      // This validator runs when controls are enabled.
      // The `customerType$` logic will disable them for 'company', so this is safe.
      const panValue = pan.value;
      const form16Value = form16.value;
  
      if (!panValue && !form16Value) {
        // Both are empty. Return a group-level error.
        return { eitherOrRequired: true };
      }
    }
  
    // Not individual, or at least one has a value.
    return null;
  }

  /**
   * Sets up listeners for form controls that have conditional visibility logic.
   */
  setupConditionalLogic(): void {
    const isNewVehicle$ = this.insuranceForm.get('isNewVehicle')!.valueChanges;
    const claimInPreviousYear$ = this.insuranceForm.get('claimInPreviousYear')!.valueChanges;
    const isHypothecated$ = this.insuranceForm.get('isHypothecated')!.valueChanges;
    const customerType$ = this.insuranceForm.get('customerType')!.valueChanges;
    const ifFinancierNotListed$ = this.insuranceForm.get('ifFinancierNotListed')!.valueChanges;

    isNewVehicle$.subscribe(value => {
        // this.updateControl('policyType', value === 'Yes');
        this.updateControl('previousPolicyExpired', value === 'No');
        this.updateControl('claimInPreviousYear', value === 'No');
        // this.updateControl('insurer', value === 'No');
    });

    claimInPreviousYear$.subscribe(value => {
        this.updateControl('previousYearNCB', this.insuranceForm.get('isNewVehicle')?.value === 'No' && value === 'no');
    });

    
    // customerType$.subscribe(value => {
    //   this.updateControl('individualName', value === 'individual');
    //   this.updateControl('dob', value === 'individual');
    //   this.updateControl('customerAadhar', value === 'individual');
    //   this.updateControl('customerPAN', value === 'individual');
    //   this.updateControl('customerForm16', value === 'individual');

    //   this.updateControl('companyName', value === 'company');
    //   this.updateControl('dateOfIncorporation', value === 'company');
    // });
    


    customerType$.subscribe(value => {
      const isIndividual = (value === 'individual');
      const isCompany = (value === 'company');

      // Individual fields
      ['gender', 'salutation', 'firstName', 'lastName', 'dob', 'customerAadhar'] // Removed PAN/Form16
        .forEach(name => this.updateControl(name, isIndividual));

      // UPDATED: Handle PAN/Form16 separately to not add Validators.required
      this.updateControl('customerPAN', isIndividual, false); // isRequired = false
      this.updateControl('customerForm16', isIndividual, false); // isRequired = false

      // // Company fields
      ['companyName', 'dateOfIncorporation', 'gstin']
        .forEach(name => this.updateControl(name, isCompany, name === 'gstin' ? false : true)); // gstin is optional

      // Re-validate the whole form to apply the new custom validator status
      this.insuranceForm.updateValueAndValidity();
    });


    // isHypothecated$.subscribe(value => {
    //     this.updateControl('financier', value === 'Yes');
    // });

    // ifFinancierNotListed$.subscribe(value => {
    //     this.updateControl('financier', this.insuranceForm.get('ifFinancierNotListed')?.value.trim() === '');
    //             // this.insuranceForm.get('financier')?.setValue('not Listed');

    // });


    // Initial check
    this.insuranceForm.get('isNewVehicle')?.updateValueAndValidity({ emitEvent: true });
    this.insuranceForm.get('claimInPreviousYear')?.updateValueAndValidity({ emitEvent: true });
    this.insuranceForm.get('isHypothecated')?.updateValueAndValidity({ emitEvent: true });
    this.insuranceForm.get('customerType')?.updateValueAndValidity({ emitEvent: true });
    // this.insuranceForm.get('ifFinancierNotListed')?.updateValueAndValidity({ emitEvent: true });
  }

  /**
   * Updates the validation and enabled/disabled state of a control.
   */
  // updateControl(controlName: string, isEnabled: boolean, isRequired: boolean = true): void {
  //   const control = this.insuranceForm.get(controlName);
  //   if (control) {
  //       if (isEnabled) {
  //           control.enable();
  //           control.setValidators(isRequired ? Validators.required : null); // or more complex validators if needed
  //       } else {
  //           control.disable();
  //           control.clearValidators();
  //           control.reset();
  //       }
  //       control.updateValueAndValidity();
  //   }
  // }

  /**
   * Updates the validation and enabled/disabled state of a control.
   */
  updateControl(controlName: string, isEnabled: boolean, isRequired: boolean = true) {
    const control = this.insuranceForm.get(controlName);
    if (control) {
        if (isEnabled) {
            control.enable();
            if (isRequired) {
              control.setValidators(Validators.required);
            } else {
              control.clearValidators(); // Clear validators if enabled but not required (like PAN)
            }
        } else {
            control.disable();
            control.clearValidators();
            control.reset();
        }
        control.updateValueAndValidity();
    }
  }



  /**
   * Toggles the collapsed state of a form section.
   */
  toggleCollapse(sectionTitle: string): void {
    this.collapseState[sectionTitle] = !this.collapseState[sectionTitle];
  }
  
  /**
   * Simulates calculating the premium.
   */
  calculatePremium(): void {
    this.isCalculating = true;
    this.premiumAmount = null;
    this.premiumStatus = null;
    setTimeout(() => {
        this.premiumAmount = Math.random() * 5000 + 2000;
        this.premiumStatus = 'Quote Calculated Successfully';
        this.isCalculating = false;
    }, 1500);
  }

  // Method to fetch financers data using the service
  getFinancers(): void {
    {
    this.insuranceService.getAllFinancer().subscribe(
      (data) => {
        this.financers = data.data.map((financer: any) => financer.financer_name);
        console.log('Financers fetched successfully:', this.financers);
      },
      (error) => {
        console.error('Error fetching financers:', error);
        }
      );
    }
  }

  /**
   * Handles the form submission event.
   */
  onSubmit(): void {
    if (this.insuranceForm.valid) {
      console.log('Form Submitted!', this.insuranceForm.getRawValue());
      // In a real app, you would replace this alert with a modal or toast notification.
      alert('Form submitted successfully! Check the console for the form data.');
    } else {
      // Show which fields are invalid
      const invalidFields = Object.keys(this.insuranceForm.controls).filter(field => this.insuranceForm.get(field)?.invalid);
      console.log('Invalid Fields:', invalidFields);


      console.error('Form is invalid.');
      this.insuranceForm.markAllAsTouched();
    }
  }
}

