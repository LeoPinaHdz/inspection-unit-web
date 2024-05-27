import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ContractService } from 'src/app/_shared/services/contract.service';
import { Contract } from 'src/app/_shared/models/contract.model';
import { ClientService } from 'src/app/_shared/services/client.service';
import { ClientRepresentativeService } from 'src/app/_shared/services/client-representative.service';
import { OfficialService } from 'src/app/_shared/services/official.service';
import { addMonths } from 'src/app/_shared/utils/date.utils';

@Component({
  selector: 'contracts',
  templateUrl: './contract-detail.component.html',
})
export class ContractDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  contract: Contract = { idContrato: 0 };
  contractForm!: FormGroup;
  clients: any[] = [];
  representatives: any[] = [];
  officials: any[] = [];
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService,
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

    this.contractForm = new FormGroup({
      idContrato: new FormControl({ value: '', disabled: true }, []),
      folio: new FormControl('', [Validators.required]),
      idCliente: new FormControl('', [Validators.required]),
      fContrato: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      fVigencia: new FormControl({ value: addMonths(new Date(), 1), disabled: true }, [Validators.required]),
      idRepresentante: new FormControl('', [Validators.required]),
      idFuncionario: new FormControl('', [Validators.required]),
      observaciones: new FormControl(''),
      active: new FormControl(false)
    });

    this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          if (response.length > 0) this.contractForm.get('idCliente')!.setValue(this.clients[0].idCliente);

          this.loadRepresentatives();
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });

    this.contractForm.get('idCliente')!.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.loadRepresentatives();
      });

    this.officialService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.officials = response;
          if (response.length > 0) this.contractForm.get('idFuncionario')!.setValue(this.officials[0].idFuncionario);
        },
        error: () => {
          console.error('Error trying to get officialss');
        }
      });

    if (this.id) {
      this.isEdit = true;

      this.contractService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del contrato ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/contracts`]);
              });
            console.error('Error trying to get contract detail');
          }
        });
    }
  }

  loadRepresentatives() {
    this.clientRepresentativeService.getAllActive(this.contractForm.get('idCliente')!.value)
      .pipe()
      .subscribe({
        next: (response) => {
          this.representatives = response;
          if (response.length > 0) this.contractForm.get('idRepresentante')!.setValue(this.representatives[0].idRepresentante);
        },
        error: () => {
          console.error('Error trying to get representatives');
        }
      });
  }

  updateForm(contract: Contract): void {
    this.contractForm.patchValue({
      idContrato: contract.idContrato,
      folio: contract.folio,
      idCliente: contract.idCliente,
      fContrato: contract.fContrato,
      fVigencia: contract.fVigencia,
      idRepresentante: contract.idRepresentante,
      idFuncionario: contract.idFuncionario,
      observaciones: contract.observaciones,
      active: (contract.idEstatus && contract.idEstatus === 1) || false
    });

    this.loadRepresentatives();
  }

  onSubmit(): void {
    this.contractForm.markAllAsTouched();
    if (!this.contractForm.valid) return;

    const contractRequest = this.contractForm.getRawValue();
    contractRequest.idEstatus = contractRequest.active ? 1 : 3;

    this.contractService.save(contractRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El contrato ${contractRequest.idContrato} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/contracts`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el contrato ${contractRequest.idContrato}` },
          });
          console.error('Error trying to save contract');
        }
      });
  }

  get form() {
    return this.contractForm.controls;
  }
}