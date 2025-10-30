// create-insurance.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms'; // Import NgForm here
import { InsuranceService } from '../../core/Services/insurance.service';
import { routes } from '../../app.routes';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-create-insurance',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './create-insurance.html',
  styleUrls: ['./create-insurance.scss']
})
export class CreateInsurance implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public insuranceActive = false

  // Function to handle routing when an insurance type is selected configured in route.ts
  //  selectInsurance(type: string): void {
  //   // Navigate to the child route (e.g., 'car') relative to the current route.
  //   // This is the modern and recommended way to handle nested routing.
  //   this.insuranceActive = true;
  //   this.router.navigate([`/app/create-insurance/${type}`], { relativeTo: this.route });
  // }

   // The form group to manage the radio button state
  insuranceForm: FormGroup;

  // Updated data array with a 'value' for the radio input
  insuranceOptions = [
    {
      value: 'car',
      title: 'Car',
      iconClasses: 'fas fa-car fa-1x icon-color mb-3'
    },
    {
      value: 'two-wheeler',
      title: 'Two Wheeler',
      iconClasses: 'fas fa-motorcycle fa-1x icon-color mb-3'
    },
    {
      value: 'commercial',
      title: 'Commercial',
      iconClasses: 'fas fa-truck fa-1x icon-color mb-3'
    }
  ];
  // Data model for the form
  formData = {
    coverageDetails: {
      registrationType: '',
      isNewVehicle: 'yes',
      vehicleCategory: '',
      policyType: '',
      previousPolicyExpired: '',
      claimInPreviousYear: null,
      previousYearNCB: '',
      insurer: '',
      riskStartDate: ''
    },
    vehicleDetails: {
      registrationDate: '',
      manufacturingYear: '',
      manufacturer: '',
      model: '',
      engineNumber: '',
      chassisNumber: '',
      rto: '',
      state: '',
      cc: '',
      city: '',
      hasRegNo: '',
      exShowroomPrice: '',
      idv: '',
    },
    addons: {
      nilDep: 'no',
      handicapped: 'no',
      paToUnnamed: 'no',
      electricalAccessories: 'no',
      nonElectricalAccessories: 'no',
      rti: 'no',
      consumables: 'no',
      engineProtect: 'no'
    },
    hypothecationDetails: {
      isHypothecated: 'no',
      financer: ''
    },
    customerDetails: {
      customerType: 'individual',
      name: '',
      dob: '',
      companyName: '',
      dateOfIncorporation: '',
      mobile: '',
      email: '',
      gstin: '',
      address1: '',
      address2: '',
      address3: '',
      pincode: '',
      state: '',
      city: ''
    },
    nomineeDetails: {
      nomineeName: '',
      nomineeRelation: '',
      nomineeAge: '',
      nomineeGender: ''
    }
  };

  // State for collapsing cards
  collapseState: { [key: string]: boolean } = {
    coverageDetails: false,
    vehicleDetails: true,
    hypothecationDetails: true,
    customerDetails: true,
    nomineeDetails: true
  };

  premiumAmount: number = 0;
  premiumStatus: string = '';
  financers: string[] = []; // This will hold the list of financers

constructor(private fb: FormBuilder,private insuranceService: InsuranceService) {

  this.insuranceForm = this.fb.group({
      insuranceType: ['car'] // Sets 'Car' as the default selection
    });
}

  ngOnInit(): void {
    // Set initial collapse state
    this.collapseState = {
      coverageDetails: false, // false means not collapsed, so it's open
      vehicleDetails: true,
      hypothecationDetails: true,
      customerDetails: true,
      nomineeDetails: true
    };
    
    // Set initial radio button values from the formData object
    this.formData.customerDetails.customerType = 'individual';
    this.formData.coverageDetails.isNewVehicle = 'yes';
    this.formData.hypothecationDetails.isHypothecated = 'no';
    this.formData.coverageDetails.claimInPreviousYear = null;

    // this.financers = ['DECFDPGWN', 'ABC Bank', 'XYZ Credit', 'LMN Financialaaa'];
    //Initialize financers from database data

    // this.getFinancers();


    //the values are not visible in dropdown
    // console.log('Financers:', this.financers);
    //The data is showing blank here
    // this.financers = ['DECFDPGWN', 'ABC Bank', 'XYZ Credit', 'LMN Financialaaa'];

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
    }}

  // Method to toggle the collapse state of a card
  toggleCollapse(cardName: string): void {
    this.collapseState[cardName] = !this.collapseState[cardName];
  }

  // Handle changes for "New Vehicle" radio buttons
  onIsNewVehicleChange(): void {
    // Reset policy type and other fields when vehicle type changes
    this.formData.coverageDetails.policyType = '';
    if (this.formData.coverageDetails.isNewVehicle === 'yes') {
      this.formData.coverageDetails.previousPolicyExpired = '';
      this.formData.coverageDetails.claimInPreviousYear = null;
      this.formData.coverageDetails.previousYearNCB = '';
    }
  }

  // Handle changes for "Claim in Previous Year" radio buttons
  onClaimInPreviousYearChange(): void {
    if (this.formData.coverageDetails.claimInPreviousYear === 'yes') {
      this.formData.coverageDetails.previousYearNCB = '0';
    } else {
      this.formData.coverageDetails.previousYearNCB = '';
    }
  }

  // Handle changes for "Customer Type" radio buttons
  onCustomerTypeChange(): void {
    // Reset individual or company details when the type changes
    if (this.formData.customerDetails.customerType === 'individual') {
      this.formData.customerDetails.companyName = '';
      this.formData.customerDetails.dateOfIncorporation = '';
    } else {
      this.formData.customerDetails.name = '';
      this.formData.customerDetails.dob = '';
    }
  }

  // Handle changes for "Hypothecated" radio buttons
  onHypothecatedChange(): void {
    if (this.formData.hypothecationDetails.isHypothecated === 'no') {
      this.formData.hypothecationDetails.financer = '';
    }
  }

  // Placeholder for the "Calculate premium" button logic
  calculatePremium(): void {
    console.log('Calculating premium...');
    // You would implement your premium calculation logic here
    // Example: this.premiumAmount = calculate(this.formData);
    // this.premiumStatus = 'Sufficient Balance'; // or 'Insufficient Balance'
    this.premiumAmount = 5400000;
    this.premiumStatus = '(Insufficient Balance)';
  }

  // Function to send data to backend
  onSubmit(form: NgForm): void {
    if (form.valid) {
      // This is the object that you will send to your backend API
      const dataToSend = this.formData;

      // Log the data to the console to see the final structure
      console.log('Form Data to be sent to backend:', dataToSend);

      // TODO: Implement your backend API call here
    } else {
      // Handle invalid form state
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}