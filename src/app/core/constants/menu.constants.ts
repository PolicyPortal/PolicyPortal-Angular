export const MENU_ITEMS_DEALER = [
  {
    label: 'DASHBOARD',
    icon: 'bi bi-house-door',
    route: '/app/dashboard', 
    isHeader: true
  },
  {
    label: 'CREATE INSURANCE',
    icon: 'bi bi-plus-square',
    route: '/app/selectinsurance',
  },
  {
    label: 'VIEW POLICIES',
    icon: 'bi bi-file-earmark-text',
    route: '/app/view-policies',
  },
  {
    label: 'WALLET',
    icon: 'bi bi-wallet2',
    route: '/app/wallet',
  },
  {
    label: 'INVOICE',
    icon: 'bi bi-receipt',
    route: '/app/invoice',  
  },
  {
    label: 'TICKETS',
    icon: 'bi bi-ticket-perforated',
    route: '/app/tickets',
  },  
];


export const MENU_ITEMS_ADMIN = [
  {
    label: 'DASHBOARD',
    icon: 'bi bi-house-door',
    route: '/app/admin-dashboard',
    isHeader: true
  },
  // {
  //   label: 'FORM MANAGEMENT',
  //   icon: 'bi bi-file-earmark-text',
  //   route: '/app/form-management',
  // },
  {
    label: 'DEALER MANAGEMENT',
    icon: 'bi bi-person-badge',
    route: '/app/dealer-management',
  },
  {
    label: 'WALLET MANAGEMENT',
    icon: 'bi bi-wallet2',
    route: '/app/wallet-management',
  },
  {
    label: 'INVOICE MANAGEMENT',
    icon: 'bi bi-receipt',
    route: '/app/invoice-management',  
  },
  {
    label: 'TICKETS MANAGEMENT',
    icon: 'bi bi-ticket-perforated',
    route: '/app/tickets-management',
  },
];
