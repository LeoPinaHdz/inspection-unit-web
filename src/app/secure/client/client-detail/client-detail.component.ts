import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { Client, ClientService } from 'src/app/_shared/services/client.service';
import { CountryService } from 'src/app/_shared/services/country.service';

@Component({
  selector: 'client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
})
export class ClientDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() client: Client = { idCliente: 0 };
  @Input() isEdit: Boolean = false;
  id: any;
  countries: any[] = [];
  clientForm!: FormGroup;
  _onDestroy = new Subject<void>();
  allClientsSelected: boolean = false;
  allWarehousesSelected: boolean = false;
  allScreensSelected: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private countryService: CountryService,
    private dialog: MatDialog
  ) {
    this.clientForm = new FormGroup({
      idCliente: new FormControl({ value: '', disabled: true }, []),
      nombre: new FormControl('', [Validators.required]),
      rfc: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      exterior: new FormControl('', [Validators.required]),
      interior: new FormControl('', [Validators.required]),
      colonia: new FormControl('', [Validators.required]),
      cp: new FormControl('', [Validators.required]),
      municipio: new FormControl('', [Validators.required]),
      idEstado: new FormControl('', [Validators.required]),
      idPais: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      persona: new FormControl('', [Validators.required]),
      tipoMunicipio: new FormControl('', [Validators.required]),
      idPromotor: new FormControl('', [Validators.required]),
      idEjecutivo: new FormControl('', [Validators.required]),
      active: new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.countryService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.countries = response;
          if (!this.isEdit) this.clientForm.get('idPais')!.setValue(this.countries[0].idPais);
        },
        error: () => {
          console.error('Error trying to get countries');
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client) {
      this.updateForm(this.client);
    }
  }

  updateForm(client: Client): void {
    this.clientForm.patchValue({
      idCliente: client.idCliente,
      rfc: client.rfc,
      nombre: client.nombre,
      calle: client.calle,
      exterior: client.exterior,
      interior: client.interior,
      colonia: client.colonia,
      cp: client.cp,
      municipio: client.municipio,
      idEstado: client.idEstado,
      idPais: client.idPais,
      telefono: client.telefono,
      email: client.email,
      idEstatus: client.idEstatus,
      persona: client.persona,
      tipoMunicipio: client.tipoMunicipio ? 0 : 1,
      idPromotor: client.idPromotor,
      idEjecutivo: client.idEjecutivo,
      active: (client.idEstatus && client.idEstatus === 1) || false
    });
    this.client = client;
  }

  onSubmit(): void {
    this.clientForm.markAllAsTouched();

    console.log(this.clientForm);
    console.log(this.clientForm.valid);
    if (!this.clientForm.valid) return;

    const clientRequest = this.clientForm.getRawValue();
    clientRequest.idEstatus = clientRequest.active ? 1 : 2;
    clientRequest.tipoMunicipio = clientRequest.tipoMunicipio === '0';

    this.clientService.save(clientRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El cliente ${clientRequest.idUsuario} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/clients`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el cliente ${clientRequest.idUsuario}` },
          });
          console.error('Error trying to save client');
        }
      });
  }
}