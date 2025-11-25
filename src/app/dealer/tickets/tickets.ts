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
  // --- Core Identifiers ---
  id: string;
  policyNumber: string;
  customerName: string;
  vehicleRegNo: string;

  // --- Customer Details ---
  salutation: string;
  custFirstName: string;
  custLastName?: string; // Marked optional (required: false)
  custType: string;      // "Individual" | "Company"
  custMobile: string;
  gender: string;
  custEmail: string;
  custDob: string;       // ISO Date string "YYYY-MM-DD"
  address: string;
  pincode: string;
  city: string;
  state: string;

  // --- Vehicle Details ---
  insurer: string;
  policyType: string;
  make: string;
  model: string;
  variant: string;
  rto: string;
  engineNo: string;
  chassisNo: string;
  regNo?: string;        // Marked optional
  mfgYear: string;
  regDate: string;
  riskDate: string;
  idv: string;
  isHypothecated: string; // "Yes" | "No"
  financierName: string;
  financierAddress: string;

  // --- Nominee Details ---
  nomineeGender: string;
  nomineeName: string;
  nomineeAge: string;    // Kept as string to match form input value "50"
  nomineeRelation: string;

  // --- Documents & Status ---
  claimStatus?: string;   // Marked optional
  vehicleStatus?: string; // Marked optional
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
    {
  id: "p1",
  policyNumber: "2214033124P118998217",
  customerName: "Suryamani Rout",
  vehicleRegNo: "OD05BV6015",

  salutation: "Mr.",
  custFirstName: "Suryamani",
  custLastName: "ROUT",
  custType: "Individual",
  custMobile: "8018805871",
  gender: "Male",
  custEmail: "somanathhonda@gmail.com",
  custDob: "2005-10-02",
  address: "KARADIBANDHA KARADIBANDHA BADAMBA",
  pincode: "754031",
  city: "CUTTACK",
  state: "ODISHA",

  insurer: "United India Insurance Company",
  policyType: "Od1tp5",
  make: "HONDA",
  model: "UNICORN 160",
  variant: "UNICORN 160",
  rto: "OD05, CUTTACK, ODISHA",
  engineNo: "KC40EG4022551",
  chassisNo: "ME4KC407BSG02223",
  regNo: "",
  mfgYear: "2025",
  regDate: "2025-02-26",
  riskDate: "2025-02-26",
  idv: "113697",
  isHypothecated: "Yes",
  financierName: "101059~CHOLAMANDALAM INV...",
  financierAddress: "CUTTACK",

  nomineeGender: "Female",
  nomineeName: "PRAVASINI ROUT",
  nomineeAge: "50",
  nomineeRelation: "Mother",

  claimStatus: "No",
  vehicleStatus: "Delivered"
},
    { id: 'p2', 
      policyNumber: '9876543210P987654321', 
      customerName: 'John Doe', 
      vehicleRegNo: 'MH12AB1234',
      
      salutation: "Mr.",
      custFirstName: "John",
      custLastName: "Doe",
      custType: "Individual",
      custMobile: "9000000000",
      gender: "Male",
      custEmail: "john.doe@example.com",
      custDob: "1980-01-01",
      address: "123 Main St",
      pincode: "123456",
      city: "Mumbai",
      state: "Maharashtra",
      insurer: "ABC Insurance Co.",
      policyType: "Comprehensive",
      make: "Toyota",
      model: "Corolla",
      variant: "2020",
      rto: "MH12, Mumbai, Maharashtra",
      engineNo: "ENG123456789",
      chassisNo: "CHS987654321",
      regNo: "MH12AB1234",
      mfgYear: "2020",
      regDate: "2020-05-15",
      riskDate: "2020-05-15",
      idv: "1500000",
      isHypothecated: "No",
      financierName: "",
      financierAddress: "",
      nomineeGender: "Male",
      nomineeName: "John Doe",
      nomineeAge: "45",
      nomineeRelation: "Spouse",
      claimStatus: "No",
      vehicleStatus: "Delivered"

    }
  ];
  
  selectedPolicyId = signal(this.policies[0].id);
  selectedPolicyData = computed(() => {
    console.log("Selected Policy ID:", this.selectedPolicyId());
    console.log("Selected Policy Data:", this.policies.find(p => p.id === this.selectedPolicyId()));
    return this.policies.find(p => p.id === this.selectedPolicyId()) || this.policies[0];
  });

  // --- BACKEND DATA (Now Reactive) ---
backendData = computed((): BackendData => {
  // 1. Capture the current policy data here so the signal tracks dependencies
  const data = this.selectedPolicyData(); 

  return {
    // --- Endorsement Reasons ---
    endorsementReasons: {
      "personal_details": {
        label: "Personal Details",
        sections: [
          {
            title: "Customer Details",
            fields: [
              // 2. Use 'data' variable here instead of this.selectedPolicyData()
              { id: "salutation", label: "Salutation", type: "select", options: ["Mr.", "Mrs.", "Ms."], value: data.salutation, required: true, disabled: false },
              { id: "custFirstName", label: "Customer First Name", type: "text", value: data.customerName.split(' ')[0] || "", required: true, disabled: false },
              { id: "custLastName", label: "Customer Last Name", type: "text", value: data.customerName.split(' ')[1] || "", required: false, disabled: false },
              { id: "custType", label: "Customer Type", type: "select", options: ["Individual", "Company"], value: data.custType, required: true, disabled: true },
              { id: "custMobile", label: "Mobile Number", type: "tel", value: data.custMobile, required: true, disabled: false },
              { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female"], value: data.gender, required: true, disabled: false },
              { id: "custEmail", label: "Email", type: "email", value: data.custEmail, required: true, disabled: false },
              { id: "custDob", label: "Date Of Birth", type: "date", value: data.custDob, required: true, disabled: false },
              { id: "address", label: "Address", type: "text", value: data.address, required: true, disabled: false },
              { id: "pincode", label: "Pincode", type: "text", value: data.pincode, required: true, disabled: false },
              { id: "city", label: "City", type: "text", value: data.city, required: true, disabled: true },
              { id: "state", label: "State", type: "text", value: data.state, required: true, disabled: true }
            ]
          },
          {
            title: "Vehicle Details",
            fields: [
              { id: "insurer", label: "Insurer", type: "text", value: data.insurer, required: true, disabled: true },
              { id: "policyType", label: "Policy Type", type: "text", value: data.policyType, required: true, disabled: true },
              { id: "make", label: "Make", type: "text", value: data.make, required: true, disabled: true },
              { id: "model", label: "Model", type: "text", value: data.model, required: true, disabled: true },
              { id: "variant", label: "Vehicle Variant", type: "text", value: data.variant, required: true, disabled: true },
              { id: "rto", label: "Select RTO", type: "text", value: data.rto, required: true, disabled: true },
              { id: "engineNo", label: "Engine Number", type: "text", value: data.engineNo, required: true, disabled: true },
              { id: "chassisNo", label: "Chassis Number", type: "text", value: data.chassisNo, required: true, disabled: true },
              { id: "regNo", label: "Registration Number", type: "text", placeholder: "Enter Registration Number", value: data.regNo, required: false, disabled: true }, // Added value
              { id: "mfgYear", label: "Year of Manufacturing", type: "text", value: data.mfgYear, required: true, disabled: true },
              { id: "regDate", label: "Date Of Registration", type: "date", value: data.regDate, required: true, disabled: true },
              { id: "riskDate", label: "Risk Start Date", type: "date", value: data.riskDate, required: true, disabled: true },
              { id: "idv", label: "IDV Vehicle", type: "text", value: data.idv, required: true, disabled: true },
              { id: "isHypothecated", label: "Hypothecated Vehicle", type: "radio", options: ["Yes", "No"], value: data.isHypothecated, required: true, disabled: true },
              { id: "financierName", label: "Financier Name", type: "text", value: data.financierName, required: true, disabled: true },
              { id: "financierAddress", label: "Financier Address", type: "text", value: data.financierAddress, required: true, disabled: true }
            ]
          },
          {
            title: "Nominee Details",
            fields: [
              { id: "nomineeGender", label: "Nominee Gender", type: "radio", options: ["Male", "Female"], value: data.nomineeGender, required: true, disabled: false },
              { id: "nomineeName", label: "Nominee Name", type: "text", value: data.nomineeName, required: true, disabled: false },
              { id: "nomineeAge", label: "Nominee Age", type: "number", value: data.nomineeAge, required: true, disabled: false },
              { id: "nomineeRelation", label: "Nominee Relation", type: "select", options: ["Mother"], value: data.nomineeRelation, required: true, disabled: false }
            ]
          },
          {
            title: "Required Documents",
            fields: [
              { id: "claimStatus", label: "Claim Status", type: "radio", options: ["Yes", "No"], value: data.claimStatus, required: false, disabled: false },
              { id: "vehicleStatus", label: "Vehicle Status", type: "radio", options: ["In the stock yard", "Delivered"], value: data.vehicleStatus, required: false, disabled: false }
            ]
          }
        ],
        documents: [
          { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload self-attested Aadhar card (PDF, JPG, PNG)." },
          { id: "docPan", label: "PAN Card", required: false, tooltip: "Upload PAN card (optional)." }
        ],
        guidance: `...` // Truncated for brevity, keep your original string
      },
      "vehicle_details": {
        label: "Vehicle Details",
        sections: [
        //   {
        //     title: "Registration Details",
        //     fields: [
        //       { id: "vehicleRegNo", label: "Registration Number", type: "text", placeholder: "e.g., OD05AB1234", required: true, disabled: false },
        //       { id: "vehicleRegDate", label: "Date of Registration", type: "date", required: true, disabled: false },
        //     ]
        //   },
        //   {
        //     title: "Technical Specifications",
        //     fields: [
        //       { id: "vehicleMake", label: "Make", type: "text", placeholder: "e.g., HONDA", required: true, disabled: false },
        //       { id: "vehicleModel", label: "Model", type: "text", placeholder: "e.g., UNICORN 160", required: true, disabled: false },
        //       { id: "vehicleChassisNo", label: "Chassis Number", type: "text", placeholder: "Enter full chassis number", required: true, disabled: false },
        //       { id: "vehicleEngineNo", label: "Engine Number", type: "text", placeholder: "Enter full engine number", required: true, disabled: false },
        //     ]
        //   }
        ],
        documents: [
          // { id: "docRC", label: "Registration Certificate (RC)", required: true, tooltip: "Upload clear copy of the new RC." },
        ],
        guidance: ""
      },
      "hypothecation": {
        label: "Hypothecation Details",
        sections: [
          // {
          //   fields: [
          //     { id: "hypothecated", label: "Hypothecated Vehicle?", type: "select", options: ["Yes", "No"], required: true, disabled: false },
          //     { id: "hypFinancierName", label: "Financier Name", type: "text", placeholder: "Enter financier name", required: true, disabled: false },
          //     { id: "hypFinancierAddress", label: "Financier Address", type: "textarea", placeholder: "Enter financier full address", required: true, disabled: false },
          //   ]
          // }
        ],
        documents: [
          // { id: "docForm34", label: "Form 34 (Signed)", required: true, tooltip: "Upload Form 34 signed by both owner and financier." },
          // { id: "docBankLetter", label: "Bank Letter", required: true, tooltip: "Upload official letter from the financing bank." }
        ],
        guidance: ""
      },
      "nominee_details": {
        label: "Nominee Details",
        sections: [
          // {
          //   fields: [
          //     { id: "nomineeGender", label: "Nominee Gender", type: "select", options: ["Male", "Female", "Other"], required: true, disabled: false },
          //     { id: "nomineeName", label: "Nominee Name", type: "text", placeholder: "Enter nominee's full name", required: true, disabled: false },
          //     { id: "nomineeAge", label: "Nominee Age", type: "number", placeholder: "Enter age", required: true, disabled: false },
          //     { id: "nomineeRelation", label: "Nominee Relation", type: "text", placeholder: "e.g., Mother, Spouse", required: true, disabled: false },
          //   ]
          // }
        ],
        documents: [
          // { id: "docNomineeProof", label: "Nominee ID Proof", required: false, tooltip: "Optional: Aadhar or Voter ID of nominee." }
        ],
        guidance: ""
      },
      "idv_change": {
        label: "IDV Change",
        sections: [
          // {
          //   fields: [
          //     { id: "newIdv", label: "Proposed New IDV (₹)", type: "number", placeholder: "Enter new IDV amount", required: true, disabled: false },
          //     { id: "idvReason", label: "Reason for Change", type: "textarea", placeholder: "Justify the change in IDV...", required: true, disabled: false },
          //   ]
          // }
        ],
        documents: [
          // { id: "docInvoice", label: "Vehicle Invoice Copy", required: true, tooltip: "Required for IDV increase." },
          // { id: "docDeclaration", label: "Declaration on Letterhead", required: true, tooltip: "Upload declaration with Seal and Sign.\nAccepted formats: PDF, PNG, JPG." }
        ],
        guidance: ""
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
        guidance: ""
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
        guidance: ""
      }
    },
  };
});

// --- COMPUTED OPTIONS ---
// Note: this.backendData() <-- brackets added
endorsementOptions = computed(() => 
  Object.keys(this.backendData().endorsementReasons).map(key => ({
    key,
    label: this.backendData().endorsementReasons[key].label
  }))
);

claimOptions = computed(() => 
  Object.keys(this.backendData().claimTypes).map(key => ({
    key,
    label: this.backendData().claimTypes[key].label
  }))
);

// --- COMPUTED CONFIGS ---
// Note: this.backendData() <-- brackets added
currentEndorsementConfig = computed(() => 
  this.backendData().endorsementReasons[this.selectedEndorsementReason()]
);

currentClaimConfig = computed(() => 
  this.backendData().claimTypes[this.selectedClaimType()]
);

  // --- BACKEND DATA (Same as before, relying on CSS shims for guidance HTML) ---
//   readonly backendData: BackendData = {
    
//     // --- Endorsement Reasons ---
//     endorsementReasons: {
//       "personal_details": {
//         label: "Personal Details",
//         sections: [
//   // {
//   //   title: "Endorsement Reason",
//   //   fields: [
//   //     { id: "endorsementReason", label: "Endorsement Reason", type: "select", options: ["Personal Details"], required: false, disabled: false }
//   //   ]
//   // },
//   {
//     title: "Customer Details",
//     fields: [
//       { id: "salutation", label: "Salutation", type: "select", options: ["Mr.", "Mrs.", "Ms."], value: this.selectedPolicyData().salutation, required: true, disabled: false },
//       { id: "custFirstName", label: "Customer First Name", type: "text", value:  this.selectedPolicyData().customerName.split(' ')[0] || "", required: true, disabled: false },
//       { id: "custLastName", label: "Customer Last Name", type: "text", value: this.selectedPolicyData().customerName.split(' ')[1] || "", required: false, disabled: false },
//       { id: "custType", label: "Customer Type", type: "select", options: ["Individual", "Company"], value: this.selectedPolicyData().custType, required: true, disabled: true },
//       { id: "custMobile", label: "Mobile Number", type: "tel", value: this.selectedPolicyData().custMobile, required: true, disabled: false },
//       { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female"], value: this.selectedPolicyData().gender, required: true, disabled: false },
//       { id: "custEmail", label: "Email", type: "email", value: this.selectedPolicyData().custEmail, required: true, disabled: false },
//       { id: "custDob", label: "Date Of Birth", type: "date", value: this.selectedPolicyData().custDob, required: true, disabled: false },
//       { id: "address", label: "Address", type: "text", value: this.selectedPolicyData().address, required: true, disabled: false },
//       { id: "pincode", label: "Pincode", type: "text", value: this.selectedPolicyData().pincode, required: true, disabled: false },
//       { id: "city", label: "City", type: "text", value: this.selectedPolicyData().city, required: true, disabled: true },
//       { id: "state", label: "State", type: "text", value: this.selectedPolicyData().state, required: true, disabled: true }
//     ]
//   },
//   {
//     title: "Vehicle Details",
//     fields: [
//       { id: "insurer", label: "Insurer", type: "text", value: this.selectedPolicyData().insurer, required: true, disabled: true },
//       { id: "policyType", label: "Policy Type", type: "text", value: this.selectedPolicyData().policyType, required: true, disabled: true },
//       { id: "make", label: "Make", type: "text", value: this.selectedPolicyData().make, required: true, disabled: true },
//       { id: "model", label: "Model", type: "text", value: this.selectedPolicyData().model, required: true, disabled: true },
//       { id: "variant", label: "Vehicle Variant", type: "text", value: this.selectedPolicyData().variant, required: true, disabled: true },
//       { id: "rto", label: "Select RTO", type: "text", value: this.selectedPolicyData().rto, required: true, disabled: true },
//       { id: "engineNo", label: "Engine Number", type: "text", value: this.selectedPolicyData().engineNo, required: true, disabled: true },
//       { id: "chassisNo", label: "Chassis Number", type: "text", value: this.selectedPolicyData().chassisNo, required: true, disabled: true },
//       { id: "regNo", label: "Registration Number", type: "text", placeholder: "Enter Registration Number", required: false, disabled: true },
//       { id: "mfgYear", label: "Year of Manufacturing", type: "text", value: this.selectedPolicyData().mfgYear, required: true, disabled: true },
//       { id: "regDate", label: "Date Of Registration", type: "date", value: this.selectedPolicyData().regDate, required: true, disabled: true },
//       { id: "riskDate", label: "Risk Start Date", type: "date", value: this.selectedPolicyData().riskDate, required: true, disabled: true },
//       { id: "idv", label: "IDV Vehicle", type: "text", value: this.selectedPolicyData().idv, required: true, disabled: true },
//       { id: "isHypothecated", label: "Hypothecated Vehicle", type: "radio", options: ["Yes", "No"], value: this.selectedPolicyData().isHypothecated, required: true, disabled: true },
//       { id: "financierName", label: "Financier Name", type: "text", value: this.selectedPolicyData().financierName, required: true, disabled: true },
//       { id: "financierAddress", label: "Financier Address", type: "text", value: this.selectedPolicyData().financierAddress, required: true, disabled: true }
//     ]
//   },
//   {
//     title: "Nominee Details",
//     fields: [
//       { id: "nomineeGender", label: "Nominee Gender", type: "radio", options: ["Male", "Female"], value: this.selectedPolicyData().nomineeGender, required: true, disabled: false },
//       { id: "nomineeName", label: "Nominee Name", type: "text", value: this.selectedPolicyData().nomineeName, required: true, disabled: false },
//       { id: "nomineeAge", label: "Nominee Age", type: "number", value: this.selectedPolicyData().nomineeAge, required: true, disabled: false },
//       { id: "nomineeRelation", label: "Nominee Relation", type: "select", options: ["Mother"], value: this.selectedPolicyData().nomineeRelation, required: true, disabled: false }
//     ]
//   },
//   {
//     title: "Required Documents",
//     fields: [
//       // { id: "docInvoice", label: "Invoice Copy with Seal and Sign", type: "file", required: true, disabled: false },
//       // { id: "docAadhar", label: "Aadhar", type: "file", required: true, disabled: false },
//       // { id: "docDeclaration", label: "Declaration on Letterhead with Seal and Sign", type: "file", required: true, disabled: false },
//       { id: "claimStatus", label: "Claim Status", type: "radio", options: ["Yes", "No"], value: this.selectedPolicyData().claimStatus, required: false, disabled: false },
//       { id: "vehicleStatus", label: "Vehicle Status", type: "radio", options: ["In the stock yard", "Delivered"], value: this.selectedPolicyData().vehicleStatus, required: false, disabled: false }
//     ]
//   }
// ],
//         // sections: [
//         //   {
//         //     title: "Identity Information",
//         //     fields: [
//         //       { id: "custSalutation", label: "Salutation", type: "select", options: ["Mr.", "Mrs.", "Ms."], required: true , disabled: false},
//         //       { id: "custFirstName", label: "First Name", type: "text", placeholder: "Enter first name", required: true, disabled: false },
//         //       { id: "custLastName", label: "Last Name", type: "text", placeholder: "Enter last name", required: true, disabled: false },
//         //       { id: "custType", label: "Customer Type", type: "select", options: ["Individual", "Company"], required: true, disabled: false },
//         //       { id: "custDob", label: "Date of Birth", type: "date", required: true, disabled: false },
//         //     ]
//         //   },
//         //   {
//         //     title: "Contact Details",
//         //     fields: [
//         //       { id: "custMobile", label: "Mobile Number", type: "tel", placeholder: "Enter 10-digit mobile", required: true, disabled: false },
//         //       { id: "custEmail", label: "Email", type: "email", placeholder: "Enter email address", required: true, disabled: false },
//         //     ]
//         //   }
//         // ],
//         documents: [
//           { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload self-attested Aadhar card (PDF, JPG, PNG)." },
//           { id: "docPan", label: "PAN Card", required: false, tooltip: "Upload PAN card (optional)." }
//         ],
//         guidance: `
//           <!--<div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
//             <h4 class="font-semibold text-blue-700 text-sm">Instructions for Personal Details Update</h4>
//             <ul class="list-disc list-inside mt-2 text-sm text-blue-600">
//               <li>Ensure all details match the provided Aadhar card.</li>
//               <li>Mobile number will be verified via OTP (simulated).</li>
//             </ul>
//           </div>-->
//           `
//       },
//       "vehicle_details": {
//         label: "Vehicle Details",
//         sections: [
//           {
//             title: "Registration Details",
//             fields: [
//               { id: "vehicleRegNo", label: "Registration Number", type: "text", placeholder: "e.g., OD05AB1234", required: true, disabled: false },
//               { id: "vehicleRegDate", label: "Date of Registration", type: "date", required: true, disabled: false },
//             ]
//           },
//           {
//             title: "Technical Specifications",
//             fields: [
//               { id: "vehicleMake", label: "Make", type: "text", placeholder: "e.g., HONDA", required: true, disabled: false },
//               { id: "vehicleModel", label: "Model", type: "text", placeholder: "e.g., UNICORN 160", required: true, disabled: false },
//               { id: "vehicleChassisNo", label: "Chassis Number", type: "text", placeholder: "Enter full chassis number", required: true, disabled: false },
//               { id: "vehicleEngineNo", label: "Engine Number", type: "text", placeholder: "Enter full engine number", required: true, disabled: false },
//             ]
//           }
//         ],
//         documents: [
//           { id: "docRC", label: "Registration Certificate (RC)", required: true, tooltip: "Upload clear copy of the new RC." },
//         ],
//         guidance: ""
//       },
//       "hypothecation": {
//         label: "Hypothecation Details",
//         sections: [
//           {
//             fields: [
//               { id: "hypothecated", label: "Hypothecated Vehicle?", type: "select", options: ["Yes", "No"], required: true, disabled: false },
//               { id: "hypFinancierName", label: "Financier Name", type: "text", placeholder: "Enter financier name", required: true, disabled: false },
//               { id: "hypFinancierAddress", label: "Financier Address", type: "textarea", placeholder: "Enter financier full address", required: true, disabled: false },
//             ]
//           }
//         ],
//         documents: [
//           { id: "docForm34", label: "Form 34 (Signed)", required: true, tooltip: "Upload Form 34 signed by both owner and financier." },
//           { id: "docBankLetter", label: "Bank Letter", required: true, tooltip: "Upload official letter from the financing bank." }
//         ],
//         guidance: ""
//       },
//       "nominee_details": {
//         label: "Nominee Details",
//         sections: [
//           {
//             fields: [
//               { id: "nomineeGender", label: "Nominee Gender", type: "select", options: ["Male", "Female", "Other"], required: true, disabled: false },
//               { id: "nomineeName", label: "Nominee Name", type: "text", placeholder: "Enter nominee's full name", required: true, disabled: false },
//               { id: "nomineeAge", label: "Nominee Age", type: "number", placeholder: "Enter age", required: true, disabled: false },
//               { id: "nomineeRelation", label: "Nominee Relation", type: "text", placeholder: "e.g., Mother, Spouse", required: true, disabled: false },
//             ]
//           }
//         ],
//         documents: [
//           { id: "docNomineeProof", label: "Nominee ID Proof", required: false, tooltip: "Optional: Aadhar or Voter ID of nominee." }
//         ],
//         guidance: ""
//       },
//       "idv_change": {
//         label: "IDV Change",
//         sections: [
//           {
//             fields: [
//               { id: "newIdv", label: "Proposed New IDV (₹)", type: "number", placeholder: "Enter new IDV amount", required: true, disabled: false },
//               { id: "idvReason", label: "Reason for Change", type: "textarea", placeholder: "Justify the change in IDV...", required: true, disabled: false },
//             ]
//           }
//         ],
//         documents: [
//           { id: "docInvoice", label: "Vehicle Invoice Copy", required: true, tooltip: "Required for IDV increase." },
//           { id: "docDeclaration", label: "Declaration on Letterhead", required: true, tooltip: "Upload declaration with Seal and Sign.\nAccepted formats: PDF, PNG, JPG." }
//         ],
//         guidance: ""
//       },
//     },
    
//     // --- Claim Types ---
//     claimTypes: {
//       "od_claim": {
//         label: "OD Claim",
//         sections: [
//           {
//             title: "Incident Overview",
//             fields: [
//               { id: "claimLossDate", label: "Date of Loss", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimLossTime", label: "Time of Loss", type: "time", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimLossArea", label: "Area of Accident (Landmark)", type: "text", placeholder: "Enter landmark", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimAccidentDesc", label: "Accident Description (Min 30 letters)", type: "textarea", placeholder: "Describe how the accident happened...", required: true, colSpan: "md:col-span-3", disabled: false },
//               { id: "claimFirReported", label: "FIR Reported?", type: "select", options: ["Yes", "No"], required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimTPLoss", label: "Any Third Party Loss/Injury?", type: "select", options: ["Yes", "No"], required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimTPLossDetails", label: "Third Party Loss Details", type: "textarea", placeholder: "Enter details of TP loss (if yes)", required: false, colSpan: "md:col-span-3", disabled: false },
//             ]
//           },
//           {
//             title: "Driver Information",
//             fields: [
//               { id: "claimDriverName", label: "Driver Name", type: "text", placeholder: "Enter driver's name", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimLicenseNo", label: "Driver License No.", type: "text", placeholder: "Enter license number", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimLicenseExpiry", label: "License Expiry Date", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
//             ]
//           },
//           {
//             title: "Repair & Estimation",
//             fields: [
//               { id: "claimWorkshopName", label: "Workshop Name", type: "text", placeholder: "Enter workshop name", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimWorkshopMobile", label: "Workshop Mobile", type: "tel", placeholder: "Enter mobile", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimWorkshopCity", label: "Workshop City", type: "text", placeholder: "Enter city", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimWorkshopAddress", label: "Workshop Address", type: "text", placeholder: "Enter workshop address", required: true, colSpan: "md:col-span-2", disabled: false },
//               { id: "claimWorkshopPin", label: "Workshop Pin Code", type: "text", placeholder: "Enter pin code", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimEstCost", label: "Estimated Cost (Rs.)", type: "number", placeholder: "Enter estimated repair cost", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimPaymentType", label: "Claim Payment Type", type: "select", options: ["Cashless", "Customer Reimbursement"], required: true, colSpan: "md:col-span-1", disabled: false },
//             ]
//           }
//         ],
//         documents: [
//           { id: "docClaimForm", label: "Claim Form (Signed)", required: true, tooltip: "Upload customer-signed claim form." },
//           { id: "docEstimate", label: "Estimate Copy (with Seal)", required: true, tooltip: "Upload repair estimate from workshop." },
//           { id: "docRCFront", label: "Registration Copy Front", required: true, tooltip: "Upload RC front side." },
//           { id: "docRCBack", label: "Registration Copy Back", required: true, tooltip: "Upload RC back side." },
//           { id: "docDLFront", label: "Driving License Front", required: true, tooltip: "Upload DL front side." },
//           { id: "docDLBack", label: "Driving License Back", required: true, tooltip: "Upload DL back side." },
//           { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload customer's Aadhar card." },
//           { id: "docPan", label: "PAN Card / Form 60", required: true, tooltip: "Upload PAN or Form 60." },
//           { id: "docCheque", label: "Cancelled Cheque/Passbook", required: false, tooltip: "Required for Reimbursement cases." },
//           { id: "docGST", label: "GST Certificate", required: false, tooltip: "If GST is applicable." },
//         ],
//         guidance: ""
//       },
//       "theft_claim": {
//         label: "Theft Claim",
//          sections: [
//           {
//             title: "Theft Details",
//             fields: [
//               { id: "claimTheftDate", label: "Date of Theft", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimTheftTime", label: "Time of Theft", type: "time", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimTheftPlace", label: "Place of Theft", type: "textarea", placeholder: "Enter detailed place of theft", required: true, colSpan: "md:col-span-3", disabled: false },
//             ]
//           },
//           {
//             title: "Police Report (FIR)",
//             fields: [
//               { id: "claimFirNo", label: "FIR Number", type: "text", placeholder: "Enter FIR No.", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimFirDate", label: "FIR Date", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimPoliceStation", label: "Police Station", type: "text", placeholder: "Enter police station name", required: true, colSpan: "md:col-span-1", disabled: false },
//               { id: "claimRtoIntimationDate", label: "Date of RTO Intimation", type: "date", required: true, colSpan: "md:col-span-1", disabled: false },
//             ]
//           },
//           {
//             title: "Settlement",
//             fields: [
//               { id: "claimPaymentType", label: "Claim Payment Type", type: "select", options: ["Customer Reimbursement"], required: true, colSpan: "md:col-span-1", disabled: false },
//             ]
//           }
//         ],
//         documents: [
//           { id: "docClaimForm", label: "Claim Form (Signed)", required: true, tooltip: "Upload customer-signed claim form." },
//           { id: "docFirCopy", label: "FIR Copy", required: true, tooltip: "Upload clear copy of the First Information Report." },
//           { id: "docRCFront", label: "Registration Copy Front", required: true, tooltip: "Upload RC front side." },
//           { id: "docRCBack", label: "Registration Copy Back", required: true, tooltip: "Upload RC back side." },
//           { id: "docRtoIntimation", label: "RTO Intimation Letter", required: true, tooltip: "Letter submitted to RTO informing of theft." },
//           { id: "docKeys", label: "All Original Keys", required: true, tooltip: "Upload image of all original keys." },
//           { id: "docNonTraceable", label: "Non-Traceable Certificate", required: false, tooltip: "Upload once received from police." },
//           { id: "docAadhar", label: "Aadhar Card", required: true, tooltip: "Upload customer's Aadhar card." },
//           { id: "docPan", label: "PAN Card / Form 60", required: true, tooltip: "Upload PAN or Form 60." },
//           { id: "docCheque", label: "Cancelled Cheque/Passbook", required: true, tooltip: "Mandatory for payment." },
//         ],
//         guidance: ""
//       }
//     },
//   };

  // --- COMPUTED OPTIONS ---
  // endorsementOptions = computed(() => 
  //   Object.keys(this.backendData.endorsementReasons).map(key => ({
  //     key,
  //     label: this.backendData.endorsementReasons[key].label
  //   }))
  // );
  
  // claimOptions = computed(() => 
  //   Object.keys(this.backendData.claimTypes).map(key => ({
  //     key,
  //     label: this.backendData.claimTypes[key].label
  //   }))
  // );

  // --- COMPUTED CONFIGS ---
  // currentEndorsementConfig = computed(() => this.backendData.endorsementReasons[this.selectedEndorsementReason()]);
  // currentClaimConfig = computed(() => this.backendData.claimTypes[this.selectedClaimType()]);
  
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