import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReportsComponent } from './reports/reports.component';
import { AuthGuard } from '../_shared/components/guards/auth.guard';
import { UsersComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { ClientTabsComponent } from './client/client-tabs/client-tabs.component';
import { StandardsComponent } from './standards/standard-list/standards.component';
import { StandardDetailComponent } from './standards/standard-detail/standard-detail.component';
import { ExecutivesComponent } from './executive/executive-list/executive-list.component';
import { ExecutiveDetailComponent } from './executive/executive-detail/executive-detail.component';
import { PromotersComponent } from './promoter/promoter-list/promoter-list.component';
import { PromoterDetailComponent } from './promoter/promoter-detail/promoter-detail.component';
import { OfficialsComponent } from './official/official-list/official-list.component';
import { OfficialDetailComponent } from './official/official-detail/official-detail.component';
import { ContractsComponent } from './contract/contract-list/contract-list.component';
import { ContractDetailComponent } from './contract/contract-detail/contract-detail.component';
import { LettersComponent } from './letter/letter-list/letter-list.component';
import { RequestsComponent } from './request/request-list/request-list.component';
import { ReferenceTabsComponent } from './reference/reference-tabs/reference-tabs.component';
import { CreateRequestComponent } from './request/create-request/create-request.component';
import { CreateLetterComponent } from './letter/create-letter/create-letter.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'} },
  { path: 'client/new', component: ClientTabsComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},
  { path: 'client/:id', component: ClientTabsComponent, canActivate: [AuthGuard], data: {role: 'CLIENTES'}},

  { path: 'standards', component: StandardsComponent, canActivate: [AuthGuard], data: {role: 'NORMAS'} },
  { path: 'standards/new', component: StandardDetailComponent, canActivate: [AuthGuard], data: {role: 'NORMAS'}},
  { path: 'standards/:id', component: StandardDetailComponent, canActivate: [AuthGuard], data: {role: 'NORMAS'}},

  { path: 'executives', component: ExecutivesComponent, canActivate: [AuthGuard], data: {role: 'EJECUTIVOS'} },
  { path: 'executive/new', component: ExecutiveDetailComponent, canActivate: [AuthGuard], data: {role: 'EJECUTIVOS'}},
  { path: 'executive/:id', component: ExecutiveDetailComponent, canActivate: [AuthGuard], data: {role: 'EJECUTIVOS'}},

  { path: 'promoters', component: PromotersComponent, canActivate: [AuthGuard], data: {role: 'PROMOTORES'} },
  { path: 'promoter/new', component: PromoterDetailComponent, canActivate: [AuthGuard], data: {role: 'PROMOTORES'}},
  { path: 'promoter/:id', component: PromoterDetailComponent, canActivate: [AuthGuard], data: {role: 'PROMOTORES'}},

  { path: 'officials', component: OfficialsComponent, canActivate: [AuthGuard], data: {role: 'FUNCIONARIOS'} },
  { path: 'official/new', component: OfficialDetailComponent, canActivate: [AuthGuard], data: {role: 'FUNCIONARIOS'}},
  { path: 'official/:id', component: OfficialDetailComponent, canActivate: [AuthGuard], data: {role: 'FUNCIONARIOS'}},
  
  { path: 'conversions', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CONVERSION'} },
  { path: 'conversion/new', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CONVERSION'}},
  { path: 'conversion/:id', component: UsersComponent, canActivate: [AuthGuard], data: {role: 'CONVERSION'}},
  
  { path: 'contracts', component: ContractsComponent, canActivate: [AuthGuard], data: {role: 'CONTRATOS'} },
  { path: 'contract/new', component: ContractDetailComponent, canActivate: [AuthGuard], data: {role: 'CONTRATOS'}},
  { path: 'contract/:id', component: ContractDetailComponent, canActivate: [AuthGuard], data: {role: 'CONTRATOS'}},
  
  { path: 'references', component: ReferenceTabsComponent, canActivate: [AuthGuard], data: {role: 'FOLIOS'} },
  
  { path: 'requests', component: RequestsComponent, canActivate: [AuthGuard], data: {role: 'SOLICITUDES'} },
  { path: 'request/new', component: CreateRequestComponent, canActivate: [AuthGuard], data: {role: 'SOLICITUDES'}},
  { path: 'request/:id', component: CreateRequestComponent, canActivate: [AuthGuard], data: {role: 'SOLICITUDES'}},
  
  { path: 'letters', component: LettersComponent, canActivate: [AuthGuard], data: {role: 'OFICIOS'} },
  { path: 'letter/new', component: CreateLetterComponent, canActivate: [AuthGuard], data: {role: 'OFICIOS'}},
  { path: 'letter/:id', component: CreateLetterComponent, canActivate: [AuthGuard], data: {role: 'OFICIOS'}},
  
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
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard], data: {role: 'REPORTES'} }
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
