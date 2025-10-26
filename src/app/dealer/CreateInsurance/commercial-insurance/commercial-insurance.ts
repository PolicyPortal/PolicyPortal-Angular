import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsuranceService } from '../../../core/Services/insurance.service';

@Component({
  selector: 'app-commercial-insurance',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './commercial-insurance.html',
  styleUrl: './commercial-insurance.scss'
})
export class CommercialInsurance {
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
      manufacturer: ['', Validators.required],
      model: ['', Validators.required],
      cc : [null, Validators.required],
      engineNumber: ['', Validators.required],
      chassisNumber: ['', Validators.required],
      haveRegistrationNumber: ['No', Validators.required],    
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
      ifFinancierNotListed: ['', Validators.required],
      // Customer Details
      customerType: ['individual', Validators.required],

      // Individual Details
      gender : [null, Validators.required],
      salutation : [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      
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
    });

    // Initialize collapse states
    ['Coverage Details', 'Vehicle Details', 'Hypothecation Details', 'Customer Details', 'Nominee Details'].forEach(title => {
        this.collapseState[title] = false;
    });
    // ['Coverage Details'].forEach(title => {
    //     this.collapseState[title] = false;
    // });

    // this.isFormReady = true;
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

    
    customerType$.subscribe(value => {
      this.updateControl('individualName', value === 'individual');
      this.updateControl('dob', value === 'individual');
      this.updateControl('companyName', value === 'company');
      this.updateControl('dateOfIncorporation', value === 'company');
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
  updateControl(controlName: string, isEnabled: boolean) {
    const control = this.insuranceForm.get(controlName);
    if (control) {
        if (isEnabled) {
            control.enable();
            control.setValidators(Validators.required); // or more complex validators if needed
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
        this.premiumStatus = 'Quote Generated Successfully';
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
      console.error('Form is invalid.');
      this.insuranceForm.markAllAsTouched();
    }
  }
}

