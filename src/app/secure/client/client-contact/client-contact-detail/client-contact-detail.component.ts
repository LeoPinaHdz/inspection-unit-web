import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ClientContact, ClientContactService } from 'src/app/_shared/services/client-contact.service';

@Component({
  selector: 'clientContacts',
  templateUrl: './client-contact-detail.component.html',
  styleUrls: ['./client-contact-detail.component.scss'],
})
export class ClientContactDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  active = false;
  clientContact: ClientContact = {
    idContacto: 0,
    idCliente: 0,
    nombre: '',
    idTipo: 0,
    fCaptura: '',
    fModificacion: '',
    idUsuario: 0,
    idEstatus: 0
  };

  clientContactForm!: FormGroup;
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientContactService: ClientContactService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.clientContactForm = new FormGroup({
      idContacto: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      puesto: new FormControl(''),
      telefono: new FormControl(''),
      extension: new FormControl(''),
      email: new FormControl(''),
      idTipo: new FormControl('', [Validators.required])
    });

    if (this.id) {
      this.isEdit = true;

      this.clientContactService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del contacto con ID: ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/clientContacts`]);
              });
            console.error(`Error trying to get clientContact detail with ID: ${this.id}`);
          }
        });
    }
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
      idTipo: clientContact.idTipo
    });
    this.active = (clientContact.idEstatus && clientContact.idEstatus === 1) || false;
    this.clientContact = clientContact;
  }

  onSubmit(): void {
    this.clientContactForm.markAllAsTouched();
    if (!this.clientContactForm.valid) return;

    let clientContactRequest: ClientContact;

    if (this.isEdit) {
      const clientContactForm = this.clientContactForm.getRawValue();

      this.clientContact.nombre = clientContactForm.nombre;
      this.clientContact.puesto = clientContactForm.puesto;
      this.clientContact.telefono = clientContactForm.telefono;
      this.clientContact.extension = clientContactForm.extension;
      this.clientContact.email = clientContactForm.email;

      clientContactRequest = this.clientContact;
    } else {
      clientContactRequest = this.clientContactForm.getRawValue();
    }

    clientContactRequest.idEstatus = this.active ? 1 : 4;

    this.clientContactService.save(clientContactRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El contacto con ID: ${clientContactRequest.idContacto} fue guardada con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/clientContacts`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el contacto con ID: ${clientContactRequest.idContacto}` },
          });
          console.error('Error trying to save clientContact');
        }
      });
  }

}