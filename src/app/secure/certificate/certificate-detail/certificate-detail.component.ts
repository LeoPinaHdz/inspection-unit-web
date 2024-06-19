import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { CertificateService } from 'src/app/_shared/services/certificate.service';
import { Certificate } from 'src/app/_shared/models/certificate.model';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Client } from 'src/app/_shared/models/client.model';

@Component({
  selector: 'certificates',
  templateUrl: './certificate-detail.component.html',
})
export class CertificateDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  certificate: Certificate = { idActa: 0 };
  clients: Client[] = [];
  certificateForm!: FormGroup;
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private certificateService: CertificateService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.certificateForm = new FormGroup({
      idActa: new FormControl({ value: '', disabled: true }, []),
      folio: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idOficio: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idSolicitud: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      fIniActa: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      hIniActa: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      fFinActa: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      hFinActa: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      otroServicio: new FormControl(false),
      cual: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      tipoLote: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      cantidad: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      instrumento: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      estadoInstrumento: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      observaciones: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      active: new FormControl(false)
    });

    if (this.id) {
      this.isEdit = true;

      this.certificateService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del acta ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/certificates`]);
              });
            console.error('Error trying to get certificate detail');
          }
        });
    }
    try {
      this.clients = await lastValueFrom(this.clientService.getAllActive());
      if (this.clients.length > 0) this.certificateForm.get('idCliente')!.setValue(this.clients[0].idCliente);
    } catch (error) {
      console.error('Error trying to get clients');
    }
  }

  updateForm(certificate: Certificate): void {
    this.certificateForm.patchValue({
      idActa: certificate.idActa,
      folio: certificate.folio,
      idCliente: certificate.idCliente,
      idOficio: certificate.idOficio,
      idSolicitud: certificate.idSolicitud,
      fIniActa: certificate.fIniActa,
      hIniActa: certificate.hIniActa,
      fFinActa: certificate.fFinActa,
      hFinActa: certificate.hFinActa,
      otroServicio: certificate.otroServicio,
      cual: certificate.cual,
      tipoLote: certificate.tipoLote,
      cantidad: certificate.cantidad,
      instrumento: certificate.instrumento,
      estadoInstrumento: certificate.estadoInstrumento,
      observaciones: certificate.observaciones,
      active: (certificate.idEstatus && certificate.idEstatus === 1) || false
    });
  }

  onSubmit(): void {
    this.certificateForm.markAllAsTouched();
    if (!this.certificateForm.valid) return;

    const certificateRequest = this.certificateForm.getRawValue();;
    certificateRequest.idEstatus = certificateRequest.active ? 1 : 3;

    this.certificateService.save(certificateRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El acta ${certificateRequest.idActa} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/certificates`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el acta ${certificateRequest.idActa}` },
          });
          console.error('Error trying to save certificate');
        }
      });
  }

  get form() {
    return this.certificateForm.controls;
  }
}