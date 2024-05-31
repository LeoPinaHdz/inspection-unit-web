import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { LetterService } from 'src/app/_shared/services/letter.service';
import { Letter } from 'src/app/_shared/models/letter.model';
import { ClientService } from 'src/app/_shared/services/client.service';
import { ClientRepresentativeService } from 'src/app/_shared/services/client-representative.service';
import { OfficialService } from 'src/app/_shared/services/official.service';
import { addMonths } from 'src/app/_shared/utils/date.utils';
import { saveFile } from 'src/app/_shared/utils/file.utils';

@Component({
  selector: 'letters',
  templateUrl: './letter-detail.component.html',
})
export class LetterDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  letter: Letter = { idOficio: 0 };
  letterForm!: FormGroup;
  clients: any[] = [];
  representatives: any[] = [];
  officials: any[] = [];
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private letterService: LetterService,
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

    this.letterForm = new FormGroup({
      idOficio: new FormControl({ value: '', disabled: true }, []),
      folio: new FormControl('', [Validators.required]),
      idCliente: new FormControl('', [Validators.required]),
      fOficio: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      idFuncionario: new FormControl('', [Validators.required]),
      idRepresentante: new FormControl('', [Validators.required]),
      active: new FormControl(false)
    });

    this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          if (response.length > 0) this.letterForm.get('idCliente')!.setValue(this.clients[0].idCliente);

          this.loadRepresentatives();
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });

    this.letterForm.get('idCliente')!.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.loadRepresentatives();
      });

    this.officialService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.officials = response;
          if (response.length > 0) this.letterForm.get('idFuncionario')!.setValue(this.officials[0].idFuncionario);
        },
        error: () => {
          console.error('Error trying to get officialss');
        }
      });

    if (this.id) {
      this.isEdit = true;

      this.letterService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del oficio ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/letters`]);
              });
            console.error('Error trying to get letter detail');
          }
        });
    }
  }

  loadRepresentatives() {
    this.clientRepresentativeService.getAllActive(this.letterForm.get('idCliente')!.value)
      .pipe()
      .subscribe({
        next: (response) => {
          this.representatives = response;
          if (response.length > 0) this.letterForm.get('idRepresentante')!.setValue(this.representatives[0].idRepresentante);
        },
        error: () => {
          console.error('Error trying to get representatives');
        }
      });
  }

  updateForm(letter: Letter): void {
    this.letterForm.patchValue({
      idOficio: letter.idOficio,
      folio: letter.folio,
      idCliente: letter.idCliente,
      fOficio: letter.fOficio,
      idRepresentante: letter.idRepresentante,
      idFuncionario: letter.idFuncionario,
      active: (letter.idEstatus && letter.idEstatus === 1) || false
    });

    this.letter = letter;
    this.loadRepresentatives();
  }

  onSubmit(): void {
    this.letterForm.markAllAsTouched();
    if (!this.letterForm.valid) return;

    const letterRequest = this.letterForm.getRawValue();
    letterRequest.idEstatus = letterRequest.active ? 1 : 3;

    this.letterService.save(letterRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El oficio ${letterRequest.idOficio} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/letters`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el oficio ${letterRequest.idOficio}` },
          });
          console.error('Error trying to save letter');
        }
      });
  }

  downloadPdf(): void {
    this.letterService.download(this.id, 2).subscribe(response => {
      saveFile(response.body, response.headers.get('filename') || `${this.letter.folio}.pdf`,
        response.headers.get('Content-Type') || 'application/pdf; charset=utf-8');
    });
  }

  downloadWord(): void {
    this.letterService.download(this.id, 1).subscribe(response => {
      saveFile(response.body, response.headers.get('filename') || `${this.letter.folio}.doc`,
        response.headers.get('Content-Type') || 'application/msword; charset=utf-8');
    });
  }

  get form() {
    return this.letterForm.controls;
  }
}