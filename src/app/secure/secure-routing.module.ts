import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ReceiptDetailComponent } from './receipt-detail/receipt-detail.component';
import { OutboundsComponent } from './outbounds/outbounds.component';
import { ReportsComponent } from './reports/reports.component';
import { OrderComponent } from './order/order.component';
import { AuthGuard } from '../_shared/components/guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { InventoryComponent } from './inventory/intenvory.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'clients', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'} },
  { path: 'client/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},
  { path: 'client/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},

  { path: 'client/:clientId/notarials', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'} },
  { path: 'client/:clientId/notarial/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},
  { path: 'client/:clientId/notarial/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},

  { path: 'client/:clientId/addresses', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'} },
  { path: 'client/:clientId/address/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},
  { path: 'client/:clientId/address/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},

  { path: 'client/:clientId/representatives', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'} },
  { path: 'client/:clientId/representative/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},
  { path: 'client/:clientId/representative/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},

  { path: 'client/:clientId/contacts', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'} },
  { path: 'client/:clientId/contact/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},
  { path: 'client/:clientId/contact/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},

  { path: 'standars', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'NORMAS'} },
  { path: 'standar/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'NORMAS'}},
  { path: 'standar/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'NORMAS'}},
  
  { path: 'executives', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'EJECUTIVOS'} },
  { path: 'executive/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'EJECUTIVOS'}},
  { path: 'executive/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'EJECUTIVOS'}},
  
  { path: 'officers', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'FUNCIONARIOS'} },
  { path: 'officer/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'FUNCIONARIOS'}},
  { path: 'officer/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'FUNCIONARIOS'}},
  
  { path: 'conversions', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CONVERSION'} },
  { path: 'conversion/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CONVERSION'}},
  { path: 'conversion/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CONVERSION'}},
  
  { path: 'contracts', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CONTRATOS'} },
  { path: 'contract/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'CONTRATOS'}},
  { path: 'contract/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'CONTRATOS'}},
  
  { path: 'references', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'FOLIOS'} },
  { path: 'reference/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'FOLIOS'}},
  { path: 'reference/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'FOLIOS'}},
  
  { path: 'requests', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'SOLICITUDES'} },
  { path: 'request/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'SOLICITUDES'}},
  { path: 'request/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'SOLICITUDES'}},
  
  { path: 'letters', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'OFICIOS'} },
  { path: 'letter/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'OFICIOS'}},
  { path: 'letter/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'OFICIOS'}},
  
  { path: 'minutes', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'ACTAS'} },
  { path: 'minute/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'ACTAS'}},
  { path: 'minute/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'ACTAS'}},
  
  { path: 'lists', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'LISTAS'} },
  { path: 'list/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'LISTAS'}},
  { path: 'list/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'LISTAS'}},
  
  { path: 'decisions', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'DICTAMENES'} },
  { path: 'decision/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'DICTAMENES'}},
  { path: 'decision/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'DICTAMENES'}},
  
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'} },
  { path: 'user/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'}},
  { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'}},
  
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'} },
  { path: 'user/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'}},
  { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'}},
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard], data: {role: 'REPORTES'} },


  // TODO: remove unused paths
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard], data: {role: 'INVENTARIO'} },
  { path: 'receipts', component: ReceiptsComponent, canActivate: [AuthGuard], data: {role: 'RECIBOS'} },
  { path: 'receipt-new', component: ReceiptDetailComponent, canActivate: [AuthGuard], data: {role: 'RECIBOS'} },
  { path: 'receipt-detail/:id', component: ReceiptDetailComponent, canActivate: [AuthGuard], data: {role: 'RECIBOS'} },
  { path: 'outbounds', component: OutboundsComponent, canActivate: [AuthGuard], data: {role: 'SALIDAS'} },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard], data: {role: 'PEDIDOS'} }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SecureRoutingModule { }
