import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { RequestService } from 'src/app/_shared/services/request.service';
import { Request } from 'src/app/_shared/models/request.model';
import { ClientService } from 'src/app/_shared/services/client.service';
import { ClientRepresentativeService } from 'src/app/_shared/services/client-representative.service';
import { OfficialService } from 'src/app/_shared/services/official.service';
import { addMonths } from 'src/app/_shared/utils/date.utils';
import { saveFile } from 'src/app/_shared/utils/file.utils';

@Component({
  selector: 'requests',
  templateUrl: './request-detail.component.html',
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  request: Request = { idSolicitud: 0 };
  requestForm!: FormGroup;
  clients: any[] = [];
  representatives: any[] = [];
  officials: any[] = [];
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private clientService: ClientService,
    private clientRepresentativeService: ClientRepresentativeService,
    private officialService: OfficialService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.requestForm = new FormGroup({
      idSolicitud: new FormControl({ value: '', disabled: true }, []),
      pedimento: new FormControl('', [Validators.required]),
      idCliente: new FormControl('', [Validators.required]),
      fSolicitud: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      fPrograma: new FormControl({ value: addMonths(new Date(), 1), disabled: true }, [Validators.required]),
      idRepresentante: new FormControl('', [Validators.required]),
      idFuncionario: new FormControl('', [Validators.required]),
      active: new FormControl(false)
    });

    this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          if (response.length > 0) this.requestForm.get('idCliente')!.setValue(this.clients[0].idCliente);

          this.loadRepresentatives();
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });

    this.requestForm.get('idCliente')!.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.loadRepresentatives();
      });

    this.officialService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.officials = response;
          if (response.length > 0) this.requestForm.get('idFuncionario')!.setValue(this.officials[0].idFuncionario);
        },
        error: () => {
          console.error('Error trying to get officialss');
        }
      });

    if (this.id) {
      this.isEdit = true;

      this.requestService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del solicitud ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/requests`]);
              });
            console.error('Error trying to get request detail');
          }
        });
    }
  }

  loadRepresentatives() {
    this.clientRepresentativeService.getAllActive(this.requestForm.get('idCliente')!.value)
      .pipe()
      .subscribe({
        next: (response) => {
          this.representatives = response;
          if (response.length > 0) this.requestForm.get('idRepresentante')!.setValue(this.representatives[0].idRepresentante);
        },
        error: () => {
          console.error('Error trying to get representatives');
        }
      });
  }

  updateForm(request: Request): void {
    this.requestForm.patchValue({
      idSolicitud: request.idSolicitud,
      folio: request.pedimento,
      idCliente: request.idCliente,
      fSolicitud: request.fSolicitud,
      fPrograma: request.fPrograma,
      idRepresentante: request.idRepresentante,
      idFuncionario: request.idFuncionario,
      active: (request.idEstatus && request.idEstatus === 1) || false
    });

    this.request = request;
    this.loadRepresentatives();
  }

  onSubmit(): void {
    this.requestForm.markAllAsTouched();
    if (!this.requestForm.valid) return;

    const requestRequest = this.requestForm.getRawValue();
    requestRequest.idEstatus = requestRequest.active ? 1 : 3;

    this.requestService.save(requestRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El solicitud ${requestRequest.idSolicitud} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/requests`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el solicitud ${requestRequest.idSolicitud}` },
          });
          console.error('Error trying to save request');
        }
      });
  }

  downloadPdf(): void {
    this.requestService.download(this.id, 2).subscribe(response => {
      saveFile(response.body, response.headers.get('filename') || `${this.request.pedimento}.pdf`,
        response.headers.get('Content-Type') || 'application/pdf; charset=utf-8');
    });
  }

  downloadWord(): void {
    this.requestService.download(this.id, 1).subscribe(response => {
      saveFile(response.body, response.headers.get('filename') || `${this.request.pedimento}.doc`,
        response.headers.get('Content-Type') || 'application/msword; charset=utf-8');
    });
  }

  get form() {
    return this.requestForm.controls;
  }
}