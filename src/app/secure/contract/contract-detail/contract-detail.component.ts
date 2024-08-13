import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, lastValueFrom, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ContractService } from 'src/app/_shared/services/contract.service';
import { Contract } from 'src/app/_shared/models/contract.model';
import { ClientService } from 'src/app/_shared/services/client.service';
import { ClientRepresentativeService } from 'src/app/_shared/services/client-representative.service';
import { OfficialService } from 'src/app/_shared/services/official.service';
import { addYears } from 'src/app/_shared/utils/date.utils';
import { saveFile } from 'src/app/_shared/utils/file.utils';
import { UtilitiesService } from 'src/app/_shared/services/utilities.service';
import { Client } from 'src/app/_shared/models/client.model';
import { DocumentService } from 'src/app/_shared/services/documents.service';

@Component({
  selector: 'contracts',
  templateUrl: './contract-detail.component.html',
})
export class ContractDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  contract: Contract = { idContrato: 0, idEstatus: 1 };
  contractForm!: FormGroup;
  clients: any[] = [];
  representatives: any[] = [];
  officials: any[] = [];
  baseKey = '';
  defaultKey = '';
  defaultNumber = 0;
  _onDestroy = new Subject<void>();
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private clientService: ClientService,
    private clientRepresentativeService: ClientRepresentativeService,
    private officialService: OfficialService,
    private documentService: DocumentService,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.contractForm = new FormGroup({
      idContrato: new FormControl({ value: '', disabled: true }, []),
      folio: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(1), Validators.max(999999)]),
      clave: new FormControl({ value: '', disabled: true }, [Validators.required]),
      idCliente: new FormControl('', [Validators.required]),
      clientFilter: new FormControl('', []),
      fContrato: new FormControl(new Date(), [Validators.required]),
      fVigencia: new FormControl(addYears(new Date(), 1), [Validators.required]),
      idRepresentante: new FormControl('', [Validators.required]),
      idFuncionario: new FormControl('', [Validators.required]),
      observaciones: new FormControl(''),
      active: new FormControl(true, [Validators.required]),
      assign: new FormControl(false)
    });

    try {
      this.clients = await lastValueFrom(this.clientService.getAllActive());
      if (this.clients.length > 0) this.contractForm.get('idCliente')!.setValue(this.clients[0].idCliente);
      this.filteredClients.next(this.clients.slice());

      this.contractForm.get('idCliente')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.loadRepresentatives();
        });

      this.contractForm.get('clientFilter')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterClients();
        });
      this.loadRepresentatives();
    } catch (error) {
      console.error('Error trying to get clients');
    }

    try {
      this.officials = await lastValueFrom(this.officialService.getAll());
      if (this.officials.length > 0) this.contractForm.get('idFuncionario')!.setValue(this.officials[0].idFuncionario);
    } catch (error) {
      console.error('Error trying to get officials');
    }

    if (this.id) {
      this.isEdit = true;

      try {
        const response = await lastValueFrom(this.contractService.getById(this.id));
        this.updateForm(response);
      } catch (error) {
        this.dialog.open(SimpleDialogComponent, {
          data: { type: 'error', message: `Error al obtener los datos del contrato ${this.id}` },
        })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate([`/secure/contracts`]);
          });
        console.error('Error trying to get contract detail');
      }
    } else {
      this.utilitiesService.getFolio('CONTRATOS').pipe().subscribe({
        next: (response) => {
          this.defaultKey = response.clave;
          this.baseKey = response.prefijo;
          this.defaultNumber = response.folio;
          this.contractForm.get('folio')!.setValue(this.defaultNumber);
          this.contractForm.get('clave')!.setValue(this.defaultKey);
        },
        error: () => {
          console.error('Error trying to get contract detail');
        }
      });
    }
  }

  assignNumber(): void {
    if (this.contractForm.get('assign')!.value) {
      this.contractForm.get('clave')!.enable();
    } else {
      this.contractForm.get('folio')!.disable();
      this.contractForm.get('clave')!.setValue(this.defaultKey);
      this.contractForm.get('folio')!.setValue(this.defaultNumber);
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
      clave: contract.clave,
      idCliente: contract.idCliente,
      fContrato: contract.fContrato,
      fVigencia: contract.fVigencia,
      idRepresentante: contract.idRepresentante,
      idFuncionario: contract.idFuncionario,
      active: (contract.idEstatus && contract.idEstatus === 1) || false,
      observaciones: contract.observaciones
    });

    this.contract = contract;
    this.loadRepresentatives();
  }

  onSubmit(): void {
    this.contractForm.markAllAsTouched();
    if (!this.contractForm.valid) return;

    const contractRequest = { ...this.contract, ...this.contractForm.getRawValue() };
    contractRequest.idEstatus = contractRequest.active ? 1 : 4;

    this.contractService.save(contractRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          let alertMessage = `El contrato ${contractRequest.idContrato} fue guardado con éxito.`;

          if (this.isEdit && response.contratosActivos === 0) {
            alertMessage = `${alertMessage} No Existen Contratos Activos`;
          }

          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: alertMessage },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/contracts`]);
            });
        },
        error: (err) => {
          const errMessage = err.error && err.error.Message ? err.error.Message : `Error al guardar el contrato ${contractRequest.idContrato}`;
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: errMessage },
          });
          console.error('Error trying to save contract');
        }
      });
  }

  downloadFile(type: number): void {
    this.documentService.downloadContract(this.id, type).subscribe(response => {
      saveFile(response.body, this.documentService.getAttachmentFilename(`Contrato-${this.contract.folio}.pdf`, response.headers.get('Content-Disposition')),
        response.headers.get('Content-Type') || 'application/octet-stream');
    });
  }

  private filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.contractForm.get('clientFilter')!.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clients.filter(client => client.nombre!.toLowerCase().indexOf(search) > -1)
    );
  }

  get form() {
    return this.contractForm.controls;
  }
}