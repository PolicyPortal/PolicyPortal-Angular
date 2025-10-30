import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InsuranceService } from '../../core/Services/insurance.service';

@Component({
  selector: 'app-commercials',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './commercials.html',
  styleUrl: './commercials.scss'
})
export class Commercials {

  constructor(private insuranceService: InsuranceService) {
    this.getFinancers();
  }

formData = {
    coverageDetails: {
      registrationType: 'Private',
      isNewVehicle: 'yes',
      policyType: '',
      previousPolicyExpired: '',
      claimInPreviousYear: null,
      previousYearNCB: '',
      insurer: '',
      riskStartDate: '',
    },
    vehicleDetails: {
      registrationDate: '',
      manufacturingYear: null,
      manufacturer: '',
      model: '',
      engineNumber: '',
      chassisNumber: '',
      exShowroomPrice: null,
      idv: null,
    },
    addons: {
      nilDep: false,
      handicapped: false,
      paToUnnamed: false,
      electricalAccessories: false,
      nonElectricalAccessories: false,
      rti: false,
      consumables: false,
      engineProtect: false,
    },
    hypothecationDetails: {
      isHypothecated: 'no',
      financer: '',
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
      pincode: '',
      city: '',
      state: '',
    },
    nomineeDetails: {
      nomineeName: '',
      nomineeRelation: '',
      nomineeAge: null,
      nomineeGender: 'Male',
    },
  };

  financers = [];
  premiumAmount = '';
  premiumStatus = '';

  // State for controlling collapsible sections
  // false = expanded, true = collapsed
  collapseState: { [key: string]: boolean } = {
    coverageDetails: false,
    vehicleDetails: false,
    hypothecationDetails: false,
    customerDetails: false,
    nomineeDetails: false,
  };

  // Toggles the collapsed state for a given section
  toggleCollapse(section: string): void {
    this.collapseState[section] = !this.collapseState[section];
  }

  onIsNewVehicleChange(): void {
    this.formData.coverageDetails.policyType = '';
    this.formData.coverageDetails.previousPolicyExpired = '';
    this.formData.coverageDetails.claimInPreviousYear = null;
    this.formData.coverageDetails.previousYearNCB = '';
  }

  onClaimInPreviousYearChange(): void {
    if (this.formData.coverageDetails.claimInPreviousYear === 'yes') {
      this.formData.coverageDetails.previousYearNCB = '';
    }
  }

  onHypothecatedChange(): void {
    if (this.formData.hypothecationDetails.isHypothecated === 'no') {
      this.formData.hypothecationDetails.financer = '';
    }
  }

  onCustomerTypeChange(): void {
    this.formData.customerDetails.name = '';
    this.formData.customerDetails.dob = '';
    this.formData.customerDetails.companyName = '';
    this.formData.customerDetails.dateOfIncorporation = '';
  }

  calculatePremium(): void {
    console.log('Calculating premium with data:', this.formData);
    // Dummy premium calculation logic
    this.premiumAmount = (Math.random() * 5000 + 2000).toFixed(2);
    this.premiumStatus = 'Available';
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form Submitted!', this.formData);
      // Here you would typically send the data to a server
    } else {
      console.error('Form is invalid');
    }
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

}
