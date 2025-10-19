export interface Policy {
  [key: string]: any;
  id: number;
  customerName: string;
  mobileNumber: string;
  odExpiryDate: string;
  tpExpiryDate: string;
  previousPolicyType: string;
  amount: number;
}