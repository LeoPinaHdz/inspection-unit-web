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
  { path: 'receipts', component: ReceiptsComponent, canActivate: [AuthGuard], data: {role: 'RECIBOS'} },
  { path: 'receipt-new', component: ReceiptDetailComponent, canActivate: [AuthGuard], data: {role: 'RECIBOS'} },
  { path: 'receipt-detail/:id', component: ReceiptDetailComponent, canActivate: [AuthGuard], data: {role: 'RECIBOS'} },
  { path: 'outbounds', component: OutboundsComponent, canActivate: [AuthGuard], data: {role: 'SALIDAS'} },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard], data: {role: 'REPORTES'} },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard], data: {role: 'PEDIDOS'} },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'} },
  { path: 'user/new', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'}},
  { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard], data: {role: 'USUARIOS'}},
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard], data: {role: 'INVENTARIO'} }
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
