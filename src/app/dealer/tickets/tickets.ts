import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// --- Types & Interfaces ---
type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'date' | 'time' | 'tel' | 'email' | 'number' | 'radio' ;
  options?: string[];
  value?: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
  colSpan?: string; // e.g., 'md:col-span-1', 'md:col-span-2'
};

type SectionConfig = {
  title?: string; // Optional section title
  fields: FieldConfig[];
};

type DocConfig = {
  id: string;
  label: string;
  required: boolean;
  tooltip: string;
};

type ReasonConfig = {
  label: string;
  sections: SectionConfig[]; // Changed from flat fields array to sections
  documents: DocConfig[];
  guidance: string;
};

type BackendData = {
  endorsementReasons: { [key: string]: ReasonConfig };
  claimTypes: { [key: string]: ReasonConfig };
};

type Policy = {
  id: string;
  policyNumber: string;
  customerName: string;
  vehicleRegNo: string;
};
@Component({
  selector: 'app-tickets',
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss'
})
export class Tickets {
 // --- STATE ---
  activeTab = signal<'endorsement' | 'claims'>('endorsement');
  isAdmin = signal(false);
  selectedEndorsementReason = signal('');
  selectedClaimType = signal('');
  selectedClaimPaymentType = signal('');
  toastMessage = signal<string | null>(null);

  // --- New Policy State ---
  readonly policies: Policy[] = [
    { id: 'p1', policyNumber: '2214033124P118998217', customerName: 'Suryamani Rout', vehicleRegNo: 'OD05BV6015' },
    { id: 'p2', policyNumber: '9876543210P987654321', customerName: 'John Doe', vehicleRegNo: 'MH12AB1234' },
    { id: 'p3', policyNumber: '1234567890P123456789', customerName: 'Jane Smith', vehicleRegNo: 'KA01CD5678' },
  ];
  
  selectedPolicyId = signal(this.policies[0].id);
  selectedPolicyData = computed(() => {
    return this.policies.find(p => p.id === this.selectedPolicyId()) || this.policies[0];
  });

  // --- BACKEND DATA (Same as before, relying on CSS shims for guidance HTML) ---
  readonly backendData: BackendData = {
    // --- Endorsement Reasons ---
    endorsementReasons: {
      "personal_details": {
        label: "Personal Details",
        sections: [
  {
    title: "Endorsement Reason",
    fields: [
      { id: "endorsementReason", label: "Endorsement Reason", type: "select", options: ["Personal Details"], required: false, disabled: false }
    ]
  },
  {
    title: "Customer Details",
    fields: [
      { id: "salutation", label: "Salutation", type: "select", options: ["Mr.", "Mrs.", "Ms."], required: true, disabled: false },
      { id: "custFirstName", label: "Customer First Name", type: "text", value: "SURYAMANI", required: true, disabled: false },
      { id: "custLastName", label: "Customer Last Name", type: "text", value: "ROUT", required: false, disabled: false },
      { id: "custType", label: "Customer Type", type: "select", options: ["Individual", "Company"], value: "Individual", required: true, disabled: true },
      { id: "custMobile", label: "Mobile Number", type: "tel", value: "8018805871", required: true, disabled: false },
      { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female"], value: "Male", required: true, disabled: false },
      { id: "custEmail", label: "Email", type: "email", value: "somanathhonda@gmail.com", required: true, disabled: false },
      { id: "custDob", label: "Date Of Birth", type: "date", value: "2005-10-02", required: true, disabled: false },
      { id: "address", label: "Address", type: "text", value: "KARADIBANDHA KARADIBANDHA BADAMBA", required: true, disabled: false },
      { id: "pincode", label: "Pincode", type: "text", value: "754031", required: true, disabled: false },
      { id: "city", label: "City", type: "text", value: "CUTTACK", required: true, disabled: true },
      { id: "state", label: "State", type: "text", value: "ODISHA", required: true, disabled: true }
    ]
  },
  {
    title: "Vehicle Details",
    fields: [
      { id: "insurer", label: "Insurer", type: "text", value: "United India Insurance Company", required: true, disabled: true },
      { id: "policyType", label: "Policy Type", type: "text", value: "Od1tp5", required: true, disabled: true },
      { id: "make", label: "Make", type: "text", value: "HONDA", required: true, disabled: true },
      { id: "model", label: "Model", type: "text", value: "UNICORN 160", required: true, disabled: true },
      { id: "variant", label: "Vehicle Variant", type: "text", value: "UNICORN 160", required: true, disabled: true },
      { id: "rto", label: "Select RTO", type: "text", value: "OD05, CUTTACK, ODISHA", required: true, disabled: true },
      { id: "engineNo", label: "Engine Number", type: "text", value: "KC40EG4022551", required: true, disabled: true },
      { id: "chassisNo", label: "Chassis Number", type: "text", value: "ME4KC407BSG02223", required: true, disabled: true },
      { id: "regNo", label: "Registration Number", type: "text", placeholder: "Enter Registration Number", required: false, disabled: true },
      { id: "mfgYear", label: "Year of Manufacturing", type: "text", value: "2025", required: true, disabled: true },
      { id: "regDate", label: "Date Of Registration", type: "date", value: "2025-02-26", required: true, disabled: true },
      { id: "riskDate", label: "Risk Start Date", type: "date", value: "2025-02-26", required: true, disabled: true },
      { id: "idv", label: "IDV Vehicle", type: "text", value: "113697", required: true, disabled: true },
      { id: "isHypothecated", label: "Hypothecated Vehicle", type: "radio", options: ["Yes", "No"], value: "Yes", required: true, disabled: true },
      { id: "financierName", label: "Financier Name", type: "text", value: "101059~CHOLAMANDALAM INV...", required: true, disabled: true },
      { id: "financierAddress", label: "Financier Address", type: "text", value: "CUTTACK", required: true, disabled: true }
    ]
  },
  {
    title: "Nominee Details",
    fields: [
      { id: "nomineeGender", label: "Nominee Gender", type: "radio", options: ["Male", "Female"], value: "Female", required: true, disabled: false },
      { id: "nomineeName", label: "Nominee Name", type: "text", value: "PRAVASINI ROUT", required: true, disabled: false },
      { id: "nomineeAge", label: "Nominee Age", type: "number", value: "50", required: true, disabled: false },
      { id: "nomineeRelation", label: "Nominee Relation", type: "select", options: ["Mother"], value: "Mother", required: true, disabled: false }
    ]
  },
  {
    title: "Required Documents",
    fields: [
      // { id: "docInvoice", label: "Invoice Copy with Seal and Sign", type: "file", required: true, disabled: false },
      // { id: "docAadhar", label: "Aadhar", type: "file", required: true, disabled: false },
      // { id: "docDeclaration", label: "Declaration on Letterhead with Seal and Sign", type: "file", required: true, disabled: false },
      { id: "claimStatus", label: "Claim Status", type: "radio", options: ["Yes", "No"], value: "No", required: false, disabled: false },
      { id: "vehicleStatus", label: "Vehicle Status", type: "radio", options: ["In the stock yard", "Delivered"], value: "Delivered", required: false, disabled: false }
    ]
  }
],
        // sections: [
        //   {
        //     title: "Identity Information",
        //     fields: [
        //       { id: "custSalutation", label: "Salutation", type: "select", options: ["Mr.", "Mrs.", "Ms."], required: true , disabled: false},
        //       { id: "custFirstName", label: "First Name", type: "text", placeholder: "Enter first name", required: true, disabled: false },
        //       { id: "custLastName", label: "Last Name", type: "text", placeholder: "Enter last name", required: true, disabled: false },
        //       { id: "custType", label: "Customer Type", type: "select", options: ["Individual", "Company"], required: true, disabled: false },
        //       { id: "custDob", label: "Date of Birth", type: "date", required: true, disabled: false },
        //     ]
        //   },
        //   {
        //     title: "Contact Details",
        //     fields: [
        //       { id: "custMobile", label: "Mobile Number", type: "tel", placeholder: "Enter 10-digit mobile", required: true, disabled: false },
        //       { id: "custEmail", label: "Email", type: "email", placeholder: "Enter email address", required: true, disabled: false },
        //     ]
        //   }
        // ],
        documents: [
          { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload self-attested Aadhar card (PDF, JPG, PNG)." },
          { id: "docPan", label: "PAN Card", required: false, tooltip: "Upload PAN card (optional)." }
        ],
        guidance: `
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-semibold text-blue-700 text-sm">Instructions for Personal Details Update</h4>
            <ul class="list-disc list-inside mt-2 text-sm text-blue-600">
              <li>Ensure all details match the provided Aadhar card.</li>
              <li>Mobile number will be verified via OTP (simulated).</li>
            </ul>
          </div>`
      },
      "vehicle_details": {
        label: "Vehicle Details",
        sections: [
          {
            title: "Registration Details",
            fields: [
              { id: "vehicleRegNo", label: "Registration Number", type: "text", placeholder: "e.g., OD05AB1234", required: true, disabled: false },
              { id: "vehicleRegDate", label: "Date of Registration", type: "date", required: true, disabled: false },
            ]
          },
          {
            title: "Technical Specifications",
            fields: [
              { id: "vehicleMake", label: "Make", type: "text", placeholder: "e.g., HONDA", required: true, disabled: false },
              { id: "vehicleModel", label: "Model", type: "text", placeholder: "e.g., UNICORN 160", required: true, disabled: false },
              { id: "vehicleChassisNo", label: "Chassis Number", type: "text", placeholder: "Enter full chassis number", required: true, disabled: false },
              { id: "vehicleEngineNo", label: "Engine Number", type: "text", placeholder: "Enter full engine number", required: true, disabled: false },
            ]
          }
        ],
        documents: [
          { id: "docRC", label: "Registration Certificate (RC)", required: true, tooltip: "Upload clear copy of the new RC." },
        ],
        guidance: `
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-semibold text-blue-700 text-sm">Instructions for Vehicle Details Update</h4>
            <p class="text-sm text-blue-600 mt-1">A new RC copy is mandatory for updating vehicle details.</p>
          </div>`
      },
      "hypothecation": {
        label: "Hypothecation Details",
        sections: [
          {
            fields: [
              { id: "hypothecated", label: "Hypothecated Vehicle?", type: "select", options: ["Yes", "No"], required: true, disabled: false },
              { id: "hypFinancierName", label: "Financier Name", type: "text", placeholder: "Enter financier name", required: true, disabled: false },
              { id: "hypFinancierAddress", label: "Financier Address", type: "textarea", placeholder: "Enter financier full address", required: true, disabled: false },
            ]
          }
        ],
        documents: [
          { id: "docForm34", label: "Form 34 (Signed)", required: true, tooltip: "Upload Form 34 signed by both owner and financier." },
          { id: "docBankLetter", label: "Bank Letter", required: true, tooltip: "Upload official letter from the financing bank." }
        ],
        guidance: ""
      },
      "nominee_details": {
        label: "Nominee Details",
        sections: [
          {
            fields: [
              { id: "nomineeGender", label: "Nominee Gender", type: "select", options: ["Male", "Female", "Other"], required: true, disabled: false },
              { id: "nomineeName", label: "Nominee Name", type: "text", placeholder: "Enter nominee's full name", required: true, disabled: false },
              { id: "nomineeAge", label: "Nominee Age", type: "number", placeholder: "Enter age", required: true, disabled: false },
              { id: "nomineeRelation", label: "Nominee Relation", type: "text", placeholder: "e.g., Mother, Spouse", required: true, disabled: false },
            ]
          }
        ],
        documents: [
          { id: "docNomineeProof", label: "Nominee ID Proof", required: false, tooltip: "Optional: Aadhar or Voter ID of nominee." }
        ],
        guidance: ""
      },
      "idv_change": {
        label: "IDV Change",
        sections: [
          {
            fields: [
              { id: "newIdv", label: "Proposed New IDV (₹)", type: "number", placeholder: "Enter new IDV amount", required: true, disabled: false },
              { id: "idvReason", label: "Reason for Change", type: "textarea", placeholder: "Justify the change in IDV...", required: true, disabled: false },
            ]
          }
        ],
        documents: [
          { id: "docInvoice", label: "Vehicle Invoice Copy", required: true, tooltip: "Required for IDV increase." },
          { id: "docDeclaration", label: "Declaration on Letterhead", required: true, tooltip: "Upload declaration with Seal and Sign.\nAccepted formats: PDF, PNG, JPG." }
        ],
        guidance: `
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 class="font-semibold text-yellow-700 text-sm">Important Note</h4>
            <p class="text-sm text-yellow-600 mt-1">IDV changes are subject to approval by the underwriting team. Additional premium may be applicable.</p>
            <a href="#" class="text-sm text-blue-600 font-medium mt-2 inline-block hover:underline">Download Sample Declaration Form</a>
          </div>`
      },
    },
    
    // --- Claim Types ---
    claimTypes: {
      "od_claim": {
        label: "OD Claim",
        sections: [
          {
            title: "Incident Overview",
            fields: [
              { id: "claimLossDate", label: "Date of Loss", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimLossTime", label: "Time of Loss", type: "time", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimLossArea", label: "Area of Accident (Landmark)", type: "text", placeholder: "Enter landmark", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimAccidentDesc", label: "Accident Description (Min 30 letters)", type: "textarea", placeholder: "Describe how the accident happened...", required: true, colSpan: "md:col-span-3", disabled: false },
              { id: "claimFirReported", label: "FIR Reported?", type: "select", options: ["Yes", "No"], required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimTPLoss", label: "Any Third Party Loss/Injury?", type: "select", options: ["Yes", "No"], required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimTPLossDetails", label: "Third Party Loss Details", type: "textarea", placeholder: "Enter details of TP loss (if yes)", required: false, colSpan: "md:col-span-3", disabled: false },
            ]
          },
          {
            title: "Driver Information",
            fields: [
              { id: "claimDriverName", label: "Driver Name", type: "text", placeholder: "Enter driver's name", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimLicenseNo", label: "Driver License No.", type: "text", placeholder: "Enter license number", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimLicenseExpiry", label: "License Expiry Date", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
            ]
          },
          {
            title: "Repair & Estimation",
            fields: [
              { id: "claimWorkshopName", label: "Workshop Name", type: "text", placeholder: "Enter workshop name", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimWorkshopMobile", label: "Workshop Mobile", type: "tel", placeholder: "Enter mobile", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimWorkshopCity", label: "Workshop City", type: "text", placeholder: "Enter city", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimWorkshopAddress", label: "Workshop Address", type: "text", placeholder: "Enter workshop address", required: true, colSpan: "md:col-span-2", disabled: false },
              { id: "claimWorkshopPin", label: "Workshop Pin Code", type: "text", placeholder: "Enter pin code", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimEstCost", label: "Estimated Cost (Rs.)", type: "number", placeholder: "Enter estimated repair cost", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimPaymentType", label: "Claim Payment Type", type: "select", options: ["Cashless", "Customer Reimbursement"], required: true, colSpan: "md:col-span-1", disabled: false },
            ]
          }
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
            <h4 class="font-semibold text-blue-700 text-sm">Instructions for OD Claim</h4>
            <ul class="list-disc list-inside mt-2 text-sm text-blue-600">
              <li>Ensure all details are filled accurately.</li>
              <li>Cancelled Cheque is mandatory for reimbursement.</li>
            </ul>
          </div>`
      },
      "theft_claim": {
        label: "Theft Claim",
         sections: [
          {
            title: "Theft Details",
            fields: [
              { id: "claimTheftDate", label: "Date of Theft", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimTheftTime", label: "Time of Theft", type: "time", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimTheftPlace", label: "Place of Theft", type: "textarea", placeholder: "Enter detailed place of theft", required: true, colSpan: "md:col-span-3", disabled: false },
            ]
          },
          {
            title: "Police Report (FIR)",
            fields: [
              { id: "claimFirNo", label: "FIR Number", type: "text", placeholder: "Enter FIR No.", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimFirDate", label: "FIR Date", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimPoliceStation", label: "Police Station", type: "text", placeholder: "Enter police station name", required: true, colSpan: "md:col-span-1", disabled: false },
              { id: "claimRtoIntimationDate", label: "Date of RTO Intimation", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
            ]
          },
          {
            title: "Settlement",
            fields: [
              { id: "claimPaymentType", label: "Claim Payment Type", type: "select", options: ["Customer Reimbursement"], required: true, colSpan: "md:col-span-1", disabled: false },
            ]
          }
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
            <h4 class="font-semibold text-red-700 text-sm">Instructions for Theft Claim</h4>
            <ul class="list-disc list-inside mt-2 text-sm text-red-600">
              <li>FIR must be filed immediately after theft.</li>
              <li>All original keys must be surrendered.</li>
            </ul>
          </div>`
      }
    },
  };

  // --- COMPUTED OPTIONS ---
  endorsementOptions = computed(() => 
    Object.keys(this.backendData.endorsementReasons).map(key => ({
      key,
      label: this.backendData.endorsementReasons[key].label
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
  currentClaimConfig = computed(() => this.backendData.claimTypes[this.selectedClaimType()]);
  
  showClaimBankDetails = computed(() => 
    (this.selectedClaimType() === 'od_claim' && this.selectedClaimPaymentType() === 'customer reimbursement') ||
    (this.selectedClaimType() === 'theft_claim')
  );

  // --- EVENT HANDLERS ---
  onPolicyChange(event: Event) {
    this.selectedPolicyId.set((event.target as HTMLSelectElement).value);
  }

  onEndorsementReasonChange(event: Event) {
    this.selectedEndorsementReason.set((event.target as HTMLSelectElement).value);
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
  
  // Helper for grid spans - Mapped to Bootstrap Grid
  getBootstrapColClass(colSpan: string | undefined): string {
    // Current data uses Tailwind keys like 'md:col-span-1'
    if (colSpan === 'md:col-span-2') return 'col-md-8';
    if (colSpan === 'md:col-span-3') return 'col-12';
    return 'col-md-4'; // Default to 1/3 width (approx md:col-span-1)
  }

  showSuccessMessage(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
  
  getRandomId() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}