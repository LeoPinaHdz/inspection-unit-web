import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientContactService } from 'src/app/_shared/services/client-contact.service';
import { ClientContact } from 'src/app/_shared/models/client-contact.model';
import { Client } from 'src/app/_shared/models/client.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ContactTypeService } from 'src/app/_shared/services/contact-type.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'client-contact',
  templateUrl: './client-contact.component.html'
})

export class ClientContactComponent implements OnInit, OnChanges {
  @Input() client: Client = { idCliente: 0 };
  isListMode = true;
  contactTypes: any[] = [];
  displayedColumns: string[] = [
    'nombre',
    'idEstatus',
    'telefono',
    'action'
  ];
  dataSource: MatTableDataSource<ClientContact> = new MatTableDataSource();
  clientContactForm!: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private clientContactService: ClientContactService,
    private dialog: MatDialog,
    private contactTypeService: ContactTypeService
  ) { }

  async ngOnInit() {
    this.clientContactForm = new FormGroup({
      idContacto: new FormControl({ value: '', disabled: true }, []),
      nombre: new FormControl('', [Validators.required]),
      puesto: new FormControl(''),
      telefono: new FormControl(''),
      extension: new FormControl(''),
      email: new FormControl(''),
      idTipo: new FormControl('', [Validators.required]),
      active: new FormControl(false, [Validators.required])
    });

    try {
      this.contactTypes = await lastValueFrom(this.contactTypeService.getAll());
      if (this.contactTypes.length > 0) this.clientContactForm.get('idTipo')!.setValue(this.contactTypes[0].idTipo);
    } catch (error) {
      console.error('Error trying to get contact types');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client && this.client.idCliente !== 0) {
      this.loadAllClientContacts(this.client.idCliente);
    }
  }

  loadAllClientContacts(id: number) {
    this.clientContactService.getAll(id).
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get client-contact list');
        }
      });
  }

  onSubmit(): void {
    this.clientContactForm.markAllAsTouched();
    console.log(this.clientContactForm);
    console.log(this.clientContactForm.valid);
    if (!this.clientContactForm.valid) return;

    const clientContactRequest = this.clientContactForm.getRawValue();
    clientContactRequest.idEstatus = clientContactRequest.active ? 1 : 4;
    clientContactRequest.idCliente = clientContactRequest.idCliente || this.client.idCliente;

    this.clientContactService.save(clientContactRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El contacto ${clientContactRequest.idContacto} fue guardada con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.isListMode = !this.isListMode;
              this.clientContactForm.reset({ active: false });
              this.loadAllClientContacts(this.client.idCliente);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el contacto ${clientContactRequest.idContacto}` },
          });
          console.error('Error trying to save clientContact');
        }
      });
  }

  onCancel(): void {
    this.isListMode = true;
    this.clientContactForm.reset({ active: false });
  }

  onEditContact(clientContact: ClientContact): void {
    this.updateForm(clientContact);
    this.isListMode = !this.isListMode;
  }

  updateForm(clientContact: ClientContact): void {
    this.clientContactForm.patchValue({
      idContacto: clientContact.idContacto,
      idCliente: clientContact.idCliente,
      nombre: clientContact.nombre,
      puesto: clientContact.puesto,
      telefono: clientContact.telefono,
      extension: clientContact.extension,
      email: clientContact.email,
      idTipo: clientContact.idTipo,
      active: (clientContact.idEstatus && clientContact.idEstatus === 1) || false
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}