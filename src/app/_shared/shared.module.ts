import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './components/error-message/mat-error-message.component';
import { ExcelService } from './services/excel.service';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from './services/client.service';
import { WarehouseService } from './services/warehouse.service';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './components/guards/auth.guard';
import { ScreenService } from './services/screen.service';
import { UsersService } from './services/user.service';
import { CountryService } from './services/country.service';
import { StandardService } from './services/standard.service';
import { ClientContactService } from './services/client-contact.service';
import { StateService } from './services/state.service';
import { PromoterService } from './services/promoter.service';
import { ClientRepresentativeService } from './services/client-representative.service';
import { ClientAddressService } from './services/client-address.service';

@NgModule({
  declarations: [ErrorMessageComponent, ConfirmationDialogComponent, SimpleDialogComponent, UploadButtonComponent],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  exports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    ConfirmationDialogComponent,
    SimpleDialogComponent,
    UploadButtonComponent
  ],
  providers: [
    ExcelService,
    ClientService,
    AuthService,
    AuthGuard,
    WarehouseService,
    ScreenService,
    UsersService,
    CountryService,
    StandardService,
    ClientContactService,
    StateService,
    PromoterService,
    ClientRepresentativeService,
    ClientAddressService
  ],
})
export class SharedModule { }

