import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

// Helper types for the backend data
type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'date' | 'time' | 'tel' | 'email' | 'number';
  options?: string[];
  placeholder?: string;
  required: boolean;
  colSpan?: string;
};

type DocConfig = {
  id: string;
  label: string;
  required: boolean;
  tooltip: string;
};

type ReasonConfig = {
  label: string;
  fields: FieldConfig[];
  documents: DocConfig[];
  guidance: string;
};

type BackendData = {
  endorsementReasons: { [key: string]: ReasonConfig };
  financeTicketTypes: { [key: string]: ReasonConfig };
  claimTypes: { [key: string]: ReasonConfig };
  cancellationReasons: { [key: string]: ReasonConfig };
};

// New type for Policy
type Policy = {
  id: string;
  policyNumber: string;
  customerName: string;
  vehicleRegNo: string;
};
@Component({
  selector: 'app-tickets',
  imports: [],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss'
})
export class Tickets {
   // --- STATE ---
  activeTab = signal<'endorsement' | 'finance' | 'cancellation' | 'claims'>('endorsement');
  isAdmin = signal(false);

  selectedEndorsementReason = signal('');
  selectedFinanceType = signal('');
  selectedCancellationReason = signal('');
  selectedClaimType = signal('');
  selectedClaimPaymentType = signal('');
  
  // --- New Policy State ---
  readonly policies: Policy[] = [
    { id: 'p1', policyNumber: '2214033124P118998217', customerName: 'Suryamani Rout', vehicleRegNo: 'OD05BV6015' },
    { id: 'p2', policyNumber: '9876543210P987654321', customerName: 'John Doe', vehicleRegNo: 'MH12AB1234' },
    { id: 'p3', policyNumber: '1234567890P123456789', customerName: 'Jane Smith', vehicleRegNo: 'KA01CD5678' },
  ];
  selectedPolicyId = signal(this.policies[0].id); // Default to the first policy
  selectedPolicyData = computed(() => {
    return this.policies.find(p => p.id === this.selectedPolicyId()) || this.policies[0];
  });

  // --- BACKEND DATA (Simulated) ---
  readonly backendData: BackendData = {
    // --- Endorsement Reasons ---
    endorsementReasons: {
      "personal_details": {
        label: "Personal Details",
        fields: [
          { id: "custSalutation", label: "Salutation", type: "select", options: ["Mr.", "Mrs.", "Ms."], required: true },
          { id: "custFirstName", label: "First Name", type: "text", placeholder: "Enter first name", required: true },
          { id: "custLastName", label: "Last Name", type: "text", placeholder: "Enter last name", required: true },
          { id: "custType", label: "Customer Type", type: "select", options: ["Individual", "Company"], required: true },
          { id: "custMobile", label: "Mobile Number", type: "tel", placeholder: "Enter 10-digit mobile", required: true },
          { id: "custEmail", label: "Email", type: "email", placeholder: "Enter email address", required: true },
          { id: "custDob", label: "Date of Birth", type: "date", required: true },
        ],
        documents: [
          { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload self-attested Aadhar card (PDF, JPG, PNG)." },
          { id: "docPan", label: "PAN Card", required: false, tooltip: "Upload PAN card (optional)." }
        ],
        guidance: `
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-semibold text-blue-700">Instructions for Personal Details Update</h4>
            <ul class="list-disc list-inside mt-2 text-sm text-blue-600">
              <li>Ensure all details match the provided Aadhar card.</li>
              <li>Mobile number will be verified via OTP (simulated).</li>
            </ul>
          </div>`
      },
      "vehicle_details": {
        label: "Vehicle Details",
        fields: [
          { id: "vehicleRegNo", label: "Registration Number", type: "text", placeholder: "e.g., OD05AB1234", required: true },
          { id: "vehicleChassisNo", label: "Chassis Number", type: "text", placeholder: "Enter full chassis number", required: true },
          { id: "vehicleEngineNo", label: "Engine Number", type: "text", placeholder: "Enter full engine number", required: true },
          { id: "vehicleMake", label: "Make", type: "text", placeholder: "e.g., HONDA", required: true },
          { id: "vehicleModel", label: "Model", type: "text", placeholder: "e.g., UNICORN 160", required: true },
          { id: "vehicleRegDate", label: "Date of Registration", type: "date", required: true },
        ],
        documents: [
          { id: "docRC", label: "Registration Certificate (RC)", required: true, tooltip: "Upload clear copy of the new RC." },
        ],
        guidance: `
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-semibold text-blue-700">Instructions for Vehicle Details Update</h4>
            <p class="text-sm text-blue-600">A new RC copy is mandatory for updating vehicle details.</p>
          </div>`
      },
      "hypothecation": {
        label: "Hypothecation Details",
        fields: [
          { id: "hypothecated", label: "Hypothecated Vehicle?", type: "select", options: ["Yes", "No"], required: true },
          { id: "hypFinancierName", label: "Financier Name", type: "text", placeholder: "Enter financier name", required: true },
          { id: "hypFinancierAddress", label: "Financier Address", type: "textarea", placeholder: "Enter financier full address", required: true },
        ],
        documents: [
          { id: "docForm34", label: "Form 34 (Signed)", required: true, tooltip: "Upload Form 34 signed by both owner and financier." },
          { id: "docBankLetter", label: "Bank Letter", required: true, tooltip: "Upload official letter from the financing bank." }
        ],
        guidance: ""
      },
      "nominee_details": {
        label: "Nominee Details",
        fields: [
          { id: "nomineeGender", label: "Nominee Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
          { id: "nomineeName", label: "Nominee Name", type: "text", placeholder: "Enter nominee's full name", required: true },
          { id: "nomineeAge", label: "Nominee Age", type: "number", placeholder: "Enter age", required: true },
          { id: "nomineeRelation", label: "Nominee Relation", type: "text", placeholder: "e.g., Mother, Spouse", required: true },
        ],
        documents: [
          { id: "docNomineeProof", label: "Nominee ID Proof", required: false, tooltip: "Optional: Aadhar or Voter ID of nominee." }
        ],
        guidance: ""
      },
      "idv_change": {
        label: "IDV Change",
        fields: [
          { id: "newIdv", label: "Proposed New IDV (₹)", type: "number", placeholder: "Enter new IDV amount", required: true },
          { id: "idvReason", label: "Reason for Change", type: "textarea", placeholder: "Justify the change in IDV...", required: true },
        ],
        documents: [
          { id: "docInvoice", label: "Vehicle Invoice Copy", required: true, tooltip: "Required for IDV increase." },
          { id: "docDeclaration", label: "Declaration on Letterhead", required: true, tooltip: "Upload declaration with Seal and Sign.\nAccepted formats: PDF, PNG, JPG." }
        ],
        guidance: `
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 class="font-semibold text-yellow-700">Important Note</h4>
            <p class="text-sm text-yellow-600">IDV changes are subject to approval by the underwriting team. Additional premium may be applicable.</p>
            <a href="#" class="text-sm text-blue-600 font-medium mt-2 inline-block hover:underline">Download Sample Declaration Form</a>
          </div>`
      },
      // "address_correction": { label: "Address Correction", fields: [], documents: [], guidance: "" },
      // "mobile_update": { label: "Mobile Update", fields: [], documents: [], guidance: "" },
    },

    // --- Finance Ticket Types ---
    financeTicketTypes: {
      "hyp_addition": {
        label: "Hypothecation Addition",
        fields: [ /* See 'hypothecation' in endorsements */ ],
        documents: [ /* See 'hypothecation' in endorsements */ ],
        guidance: "<p>Same as Endorsement > Hypothecation Details.</p>"
      },
      "hyp_removal": {
        label: "Hypothecation Removal",
        fields: [
          { id: "finBankName", label: "Financier Bank Name", type: "text", placeholder: "Enter bank name", required: true },
          { id: "finLoanClosureDate", label: "Loan Closure Date", type: "date", required: true },
        ],
        documents: [
          { id: "docNOC", label: "Bank NOC (Form 35)", required: true, tooltip: "Upload the No Objection Certificate (NOC) / Form 35 from the financier." },
          { id: "docPaymentProof", label: "Final Payment Proof", required: false, tooltip: "Optional: Final loan closure statement." }
        ],
        guidance: `
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-semibold text-blue-700">Instructions for Hypothecation Removal</h4>
            <p class="text-sm text-blue-600">The Bank NOC is mandatory for removing hypothecation from the policy and RC.</p>
          </div>`
      },
      "payment_query": {
        label: "Payment Status Query",
        fields: [
          { id: "finTransactionId", label: "Transaction ID", type: "text", placeholder: "Enter payment transaction ID (if any)", required: false },
          { id: "finPaymentDate", label: "Payment Date", type: "date", required: true },
          { id: "finAmount", label: "Amount (₹)", type: "number", placeholder: "Enter amount paid", required: true },
          { id: "finQueryDetails", label: "Query Details", type: "textarea", placeholder: "Describe your payment issue...", required: true },
        ],
        documents: [
          { id: "docScreenshot", label: "Payment Screenshot", required: true, tooltip: "Upload screenshot of payment debit (showing transaction ID)." }
        ],
        guidance: ""
      }
    },
    
    // --- Claim Types ---
    claimTypes: {
      "od_claim": {
        label: "OD Claim",
        fields: [
          { id: "claimLossDate", label: "Date of Loss", type: "date", required: true, colSpan: "md:col-span-1" },
          { id: "claimLossTime", label: "Time of Loss", type: "time", required: true, colSpan: "md:col-span-1" },
          { id: "claimLossArea", label: "Area of Accident (Landmark)", type: "text", placeholder: "Enter landmark", required: true, colSpan: "md:col-span-1" },
          { id: "claimDriverName", label: "Driver Name", type: "text", placeholder: "Enter driver's name", required: true, colSpan: "md:col-span-1" },
          { id: "claimLicenseNo", label: "Driver License No.", type: "text", placeholder: "Enter license number", required: true, colSpan: "md:col-span-1" },
          { id: "claimLicenseExpiry", label: "License Expiry Date", type: "date", required: true, colSpan: "md:col-span-1" },
          { id: "claimAccidentDesc", label: "Accident Description (Min 30 letters)", type: "textarea", placeholder: "Describe how the accident happened...", required: true, colSpan: "md:col-span-3" },
          { id: "claimWorkshopName", label: "Workshop Name", type: "text", placeholder: "Enter workshop name", required: true, colSpan: "md:col-span-1" },
          { id: "claimWorkshopAddress", label: "Workshop Address", type: "text", placeholder: "Enter workshop address", required: true, colSpan: "md:col-span-2" },
          { id: "claimWorkshopCity", label: "Workshop City", type: "text", placeholder: "Enter city", required: true, colSpan: "md:col-span-1" },
          { id: "claimWorkshopPin", label: "Workshop Pin Code", type: "text", placeholder: "Enter pin code", required: true, colSpan: "md:col-span-1" },
          { id: "claimWorkshopMobile", label: "Workshop Mobile", type: "tel", placeholder: "Enter mobile", required: true, colSpan: "md:col-span-1" },
          { id: "claimFirReported", label: "FIR Reported?", type: "select", options: ["Yes", "No"], required: true, colSpan: "md:col-span-1" },
          { id: "claimTPLoss", label: "Any Third Party Loss/Injury?", type: "select", options: ["Yes", "No"], required: true, colSpan: "md:col-span-1" },
          { id: "claimTPLossDetails", label: "Third Party Loss Details", type: "textarea", placeholder: "Enter details of TP loss (if yes)", required: false, colSpan: "md:col-span-3" },
          { id: "claimEstCost", label: "Estimated Cost (Rs.)", type: "number", placeholder: "Enter estimated repair cost", required: true, colSpan: "md:col-span-1" },
          { id: "claimPaymentType", label: "Claim Payment Type", type: "select", options: ["Cashless", "Customer Reimbursement"], required: true, colSpan: "md:col-span-1" },
        ],
        documents: [
          { id: "docClaimForm", label: "Claim Form (Signed)", required: true, tooltip: "Upload customer-signed claim form." },
          { id: "docEstimate", label: "Estimate Copy (with Seal)", required: true, tooltip: "Upload repair estimate from workshop." },
          { id: "docRCFront", label: "Registration Copy Front", required: true, tooltip: "Upload RC front side." },
          { id: "docRCBack", label: "Registration Copy Back", required: true, tooltip: "Upload RC back side." },
          { id: "docDLFront", label: "Driving License Front", required: true, tooltip: "Upload DL front side." },
          { id: "docDLBack", label: "Driving License Back", required: true, tooltip: "Upload DL back side." },
          { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload customer's Aadhar card." },
          { id: "docPan", label: "PAN Card / Form 60", required: true, tooltip: "Upload PAN or Form 60." },
          { id: "docCheque", label: "Cancelled Cheque/Passbook", required: false, tooltip: "Required for Reimbursement cases." },
          { id: "docGST", label: "GST Certificate", required: false, tooltip: "If GST is applicable." },
        ],
        guidance: `
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-semibold text-blue-700">Instructions for OD Claim</h4>
            <ul class="list-disc list-inside mt-2 text-sm text-blue-600">
              <li>Ensure all details are filled accurately.</li>
              <li>Cancelled Cheque is mandatory for reimbursement.</li>
            </ul>
          </div>`
      },
      "theft_claim": {
        label: "Theft Claim",
         fields: [
          { id: "claimTheftDate", label: "Date of Theft", type: "date", required: true, colSpan: "md:col-span-1" },
          { id: "claimTheftTime", label: "Time of Theft", type: "time", required: true, colSpan: "md:col-span-1" },
          { id: "claimTheftPlace", label: "Place of Theft", type: "textarea", placeholder: "Enter detailed place of theft", required: true, colSpan: "md:col-span-3" },
          { id: "claimFirNo", label: "FIR Number", type: "text", placeholder: "Enter FIR No.", required: true, colSpan: "md:col-span-1" },
          { id: "claimPoliceStation", label: "Police Station", type: "text", placeholder: "Enter police station name", required: true, colSpan: "md:col-span-1" },
          { id: "claimFirDate", label: "FIR Date", type: "date", required: true, colSpan: "md:col-span-1" },
          { id: "claimRtoIntimationDate", label: "Date of RTO Intimation", type: "date", required: true, colSpan: "md:col-span-1" },
          { id: "claimPaymentType", label: "Claim Payment Type", type: "select", options: ["Customer Reimbursement"], required: true, colSpan: "md:col-span-1" },
        ],
        documents: [
          { id: "docClaimForm", label: "Claim Form (Signed)", required: true, tooltip: "Upload customer-signed claim form." },
          { id: "docFirCopy", label: "FIR Copy", required: true, tooltip: "Upload clear copy of the First Information Report." },
          { id: "docRCFront", label: "Registration Copy Front", required: true, tooltip: "Upload RC front side." },
          { id: "docRCBack", label: "Registration Copy Back", required: true, tooltip: "Upload RC back side." },
          { id: "docRtoIntimation", label: "RTO Intimation Letter", required: true, tooltip: "Letter submitted to RTO informing of theft." },
          { id: "docKeys", label: "All Original Keys", required: true, tooltip: "Upload image of all original keys." },
          { id: "docNonTraceable", label: "Non-Traceable Certificate", required: false, tooltip: "Upload once received from police." },
          { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload customer's Aadhar card." },
          { id: "docPan", label: "PAN Card / Form 60", required: true, tooltip: "Upload PAN or Form 60." },
          { id: "docCheque", label: "Cancelled Cheque/Passbook", required: true, tooltip: "Mandatory for payment." },
        ],
        guidance: `
          <div class="p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 class="font-semibold text-red-700">Instructions for Theft Claim</h4>
            <ul class="list-disc list-inside mt-2 text-sm text-red-600">
              <li>FIR must be filed immediately after theft.</li>
              <li>All original keys must be surrendered.</li>
            </ul>
          </div>`
      }
    },

    // --- Cancellation Reasons ---
    cancellationReasons: {
      "sale_vehicle": {
        label: "Sale of Vehicle",
        fields: [
          { id: "canSaleDate", label: "Date of Sale", type: "date", required: true },
        ],
        documents: [
          { id: "docSaleDeed", label: "Sale Deed / Form 29/30", required: true, tooltip: "Upload proof of sale." },
          { id: "docSurrenderReceipt", label: "RC Surrender Receipt", required: false, tooltip: "Optional: Receipt of RC surrender at RTO." }
        ],
        guidance: "<p>Refund will be pro-rata based on the date of sale.</p>"
      },
      "double_insurance": {
        label: "Double Insurance",
        fields: [
          { id: "canOtherPolicyNo", label: "Other Policy Number", type: "text", placeholder: "Enter the other policy number", required: true },
          { id: "canOtherInsurer", label: "Other Insurer Name", type: "text", placeholder: "Enter other insurer's name", required: true },
        ],
        documents: [
          { id: "docOtherPolicy", label: "Other Policy Copy", required: true, tooltip: "Upload copy of the other active insurance policy." }
        ],
        guidance: "<p>Cancellation will be processed as per 'double insurance' rules.</p>"
      },
      "other": {
        label: "Other",
        fields: [
          { id: "canOtherReason", label: "Please specify reason", type: "textarea", placeholder: "Describe the reason for cancellation...", required: true },
        ],
        documents: [
          { id: "docSupport", label: "Supporting Document", required: false, tooltip: "Upload any relevant supporting document." }
        ],
        guidance: ""
      }
    }
  };

  // --- COMPUTED OPTIONS ---
  endorsementOptions = computed(() => 
    Object.keys(this.backendData.endorsementReasons).map(key => ({
      key,
      label: this.backendData.endorsementReasons[key].label
    }))
  );
  financeOptions = computed(() => 
    Object.keys(this.backendData.financeTicketTypes).map(key => ({
      key,
      label: this.backendData.financeTicketTypes[key].label
    }))
  );
  cancellationOptions = computed(() => 
    Object.keys(this.backendData.cancellationReasons).map(key => ({
      key,
      label: this.backendData.cancellationReasons[key].label
    }))
  );
  claimOptions = computed(() => 
    Object.keys(this.backendData.claimTypes).map(key => ({
      key,
      label: this.backendData.claimTypes[key].label
    }))
  );

  // --- COMPUTED CONFIGS ---
  currentEndorsementConfig = computed(() => this.backendData.endorsementReasons[this.selectedEndorsementReason()]);
  currentFinanceConfig = computed(() => this.backendData.financeTicketTypes[this.selectedFinanceType()]);
  currentCancellationConfig = computed(() => this.backendData.cancellationReasons[this.selectedCancellationReason()]);
  currentClaimConfig = computed(() => this.backendData.claimTypes[this.selectedClaimType()]);
  
  showClaimBankDetails = computed(() => 
    (this.selectedClaimType() === 'od_claim' && this.selectedClaimPaymentType() === 'customer reimbursement') ||
    (this.selectedClaimType() === 'theft_claim')
  );

  // --- EVENT HANDLERS ---
  onAdminToggle(event: Event) {
    this.isAdmin.set((event.target as HTMLInputElement).checked);
  }

  onPolicyChange(event: Event) {
    this.selectedPolicyId.set((event.target as HTMLSelectElement).value);
  }

  onEndorsementReasonChange(event: Event) {
    this.selectedEndorsementReason.set((event.target as HTMLSelectElement).value);
  }

  onFinanceTypeChange(event: Event) {
    this.selectedFinanceType.set((event.target as HTMLSelectElement).value);
  }

  onCancellationReasonChange(event: Event) {
    this.selectedCancellationReason.set((event.target as HTMLSelectElement).value);
  }

  onClaimTypeChange(event: Event) {
    this.selectedClaimType.set((event.target as HTMLSelectElement).value);
    this.selectedClaimPaymentType.set(''); // Reset payment type
  }
  
  onClaimPaymentTypeChange(event: Event, fieldId: string) {
    if (fieldId === 'claimPaymentType') {
      this.selectedClaimPaymentType.set((event.target as HTMLSelectElement).value);
    }
  }
  
  // Helper function for grid spans
  getColClass(colSpan: string | undefined): string {
    if (colSpan === 'md:col-span-2') return 'col-md-8';
    if (colSpan === 'md:col-span-3') return 'col-md-12';
    return 'col-md-4';
  }
}