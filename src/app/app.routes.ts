import { Routes } from '@angular/router';
import { AuthGuard } from './core/Services/auth.guard.service';
import { roleGuard } from './core/Services/role.guard.service';

export const routes: Routes = [
     {
          path: '',
          redirectTo: '/app/login',
          pathMatch: 'full'
     },
     {
          path: 'app/login',
          loadComponent: () => import('./pages/authPages/login/login').then(m => m.Login)
     },
     {
          path: 'app',
          canActivate: [AuthGuard],
          loadComponent: () => import('./pages/portal-layout/portal-layout').then(m => m.PortalLayout),
          children: [
               {
                    path: 'view-policies',
                    loadComponent: () => import('./dealer/view-policies/view-policies').then(m => m.ViewPolicies),
                    canActivate: [roleGuard], 
                    data: { roles: ['Admin', 'Dealer'] }
               },
               {
                    path: 'dashboard',
                    loadComponent: () => import('./dealer/dashboard/dashboard').then(m => m.Dashboard),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] }
               },
               {
                    path: 'selectinsurance',
                    loadComponent: () => import('./dealer/CreateInsurance/select-insurance/select-insurance').then(m => m.SelectInsurance),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] },
               //      children: [
               //      {
               //           path: '',
               //           loadComponent: () => import('./pages/main-app/create-insurance/select-insurance-for/select-insurance-for').then(m => m.SelectInsuranceFor)
               //      },
               //      {
               //          path: 'car', // This will now correctly match '/app/create-insurance/car'
               //          loadComponent: () => import('./pages/main-app/create-insurance/car/car').then(m => m.Car)
               //          // Note: You can often remove the guard here, as the parent guard already protects it.
               //      },
               //      {
               //          path: 'two-wheeler',
               //          loadComponent: () => import('./pages/main-app/create-insurance/two-wheeler/two-wheeler').then(m => m.TwoWheeler)
               //      },
               //      {
               //          path: 'commercial',
               //          loadComponent: () => import('./pages/main-app/create-insurance/commercials/commercials').then(m => m.Commercials)
               //      }
               //  ]
               },
               // {
               //      path: 'create-insurance/car',
               //      loadComponent: () => import('./pages/main-app/create-insurance/car/car').then(m => m.Car),
               //      canActivate: [roleGuard],
               //      data: { roles: ['Dealer'] }
               // },
               {
                    path: 'createinsurance/two-wheeler',
                    // loadComponent: () => import('./pages/main-app/create-insurance/two-wheeler-dynamic/two-wheeler-dynamic').then(m => m.TwoWheelerDynamic),
                    loadComponent: () => import('./dealer/CreateInsurance/two-wheeler/two-wheeler').then(m => m.TwoWheeler),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] }
               },
               {
                    path: 'createinsurance/car',
                    loadComponent: () => import('./dealer/CreateInsurance/car-insurance/car-insurance').then(m => m.CarInsurance),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] }
               },
               {
                    path: 'createinsurance/commercial',
                    loadComponent: () => import('./dealer/CreateInsurance/commercial-insurance/commercial-insurance').then(m => m.CommercialInsurance),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] }
               },
               // {
               //      path: 'create-insurance/commercial',
               //      loadComponent: () => import('./pages/main-app/create-insurance/commercials/commercials').then(m => m.Commercials),
               //      canActivate: [roleGuard],
               //      data: { roles: ['Dealer'] }
               // },
               {
                    path: 'wallet',
                    loadComponent: () => import('./dealer/wallet/wallet').then(m => m.WalletComponent),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] }
               },
               {
                    path: 'invoice',
                    loadComponent: () => import('./dealer/invoice/invoice').then(m => m.InvoiceComponent),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] }
               },
               {
                    path: 'tickets',
                    loadComponent: () => import('./dealer/tickets/tickets').then(m => m.Tickets),
                    canActivate: [roleGuard],
                    data: { roles: ['Dealer'] }
               },
               {
                    path: 'admin-dashboard',
                    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
                    canActivate: [roleGuard],
                    data: { roles: ['Admin'] }
               },
               {
                    path: 'dealer-management',
                    loadComponent: () => import('./admin/dealer-management/dealer-management').then(m => m.DealerManagement),
                    canActivate: [roleGuard],
                    data: { roles: ['Admin'] }
               },
               {
                    path: 'wallet-management',
                    loadComponent: () => import('./admin/wallet-management/wallet-management').then(m => m.WalletManagement),
                    canActivate: [roleGuard],
                    data: { roles: ['Admin'] }
               },
               {
                    path: 'invoice-management',
                    loadComponent: () => import('./admin/invoice-management/invoice-management').then(m => m.InvoiceManagement),
                    canActivate: [roleGuard],
                    data: { roles: ['Admin'] }
               },
               {
                    path: 'tickets-management',
                    loadComponent: () => import('./admin/tickets-management/tickets-management').then(m => m.TicketsManagement),
                    canActivate: [roleGuard],
                    data: { roles: ['Admin'] }
               },
               // =============================================================
               // ADD THIS NEW ROUTE FOR THE ADMIN FORM BUILDER
               // =============================================================
               {
                    path: 'form-management', // This is the new URL: /app/form-management
                    loadComponent: () => import('./needToRemove/form-management/form-management').then(m => m.FormManagement),
                    canActivate: [roleGuard],
                    data: { roles: ['Admin'] }
               },
               {
                    path: 'two-wheeler-formbuilder',
                    loadComponent: () => import('./needToRemove/two-wheeler-formbuilder/two-wheeler-formbuilder').then(m => m.TwoWheelerFormbuilder),
                    canActivate: [roleGuard],
                    data: { roles: ['Admin'] }
               }
               // =============================================================
          ]
     },
     {
          path: 'app/unauthorized',
          loadComponent: () => import('./pages/authPages/unauthorized-page/unauthorized-page').then(m => m.UnauthorizedPage),
     },
     
     
];
