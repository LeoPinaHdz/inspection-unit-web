import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HomeComponent } from './home/home.component';
import { SecureRoutingModule } from './secure-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NgChartsModule } from 'ng2-charts';
import { ClientListComponent } from './client/client-list/client-list.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientTabsComponent } from './client/client-tabs/client-tabs.component';
import { StandardsComponent } from './standards/standard-list/standards.component';
import { StandardDetailComponent } from './standards/standard-detail/standard-detail.component';
import { ClientComponent } from './client/client.component';
import { ClientContactComponent } from './client/client-contact/client-contact.component';
import { ClientRepresentativeComponent } from './client/client-representative/client-representative.component';
import { ClientAddressComponent } from './client/client-address/client-address.component';
import { ClientNotarialDataComponent } from './client/client-notarial-data/client-notarial-data.component';
import { ExecutivesComponent } from './executive/executive-list/executive-list.component';
import { ExecutiveDetailComponent } from './executive/executive-detail/executive-detail.component';
import { PromotersComponent } from './promoter/promoter-list/promoter-list.component';
import { PromoterDetailComponent } from './promoter/promoter-detail/promoter-detail.component';
import { OfficialsComponent } from './official/official-list/official-list.component';
import { OfficialDetailComponent } from './official/official-detail/official-detail.component';
import { ContractsComponent } from './contract/contract-list/contract-list.component';
import { ContractDetailComponent } from './contract/contract-detail/contract-detail.component';
import { LettersComponent } from './letter/letter-list/letter-list.component';
import { LetterDetailComponent } from './letter/letter-detail/letter-detail.component';
import { RequestsComponent } from './request/request-list/request-list.component';
import { RequestDetailComponent } from './request/request-detail/request-detail.component';
import { ReferenceTabsComponent } from './reference/reference-tabs/reference-tabs.component';
import { ReferenceFileMComponent } from './reference/reference-file-m/reference-file-m.component';
import { ReferenceCreateComponent } from './reference/reference-create/reference-create.component';

@NgModule({
  declarations: [
    HomeComponent,
    ReportsComponent,
    UsersComponent,
    UserDetailComponent,
    ClientListComponent,
    ClientDetailComponent,
    ClientTabsComponent,
    StandardsComponent,
    StandardDetailComponent,
    ClientComponent,
    ClientContactComponent,
    ClientRepresentativeComponent,
    ClientAddressComponent,
    ClientNotarialDataComponent,
    ExecutivesComponent,
    ExecutiveDetailComponent,
    PromotersComponent,
    PromoterDetailComponent,
    OfficialsComponent,
    OfficialDetailComponent,
    ContractsComponent,
    ContractDetailComponent,
    LettersComponent,
    LetterDetailComponent,
    RequestsComponent,
    RequestDetailComponent,
    ReferenceTabsComponent,
    ReferenceFileMComponent,
    ReferenceCreateComponent
  ],
  imports: [
    SecureRoutingModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    SharedModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatRadioModule,
    NgChartsModule,
    MatTabsModule
  ],
  providers: [
    NativeDateAdapter,
  ],
  exports: [
  ],
})
export class SecureModule { }
