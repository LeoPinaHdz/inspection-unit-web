import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { RulingService } from 'src/app/_shared/services/ruling.service';
import { Ruling } from 'src/app/_shared/models/ruling.model';

@Component({
  selector: 'rulings',
  templateUrl: './ruling-detail.component.html',
})
export class RulingDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  ruling: Ruling = { idDictamen: 0 };
  rulingForm!: FormGroup;
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rulingService: RulingService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.rulingForm = new FormGroup({
      idDictamen: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      folio: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      dictaminacion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      fDictamen: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idPresentacion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idFuncionario: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      idEjecutivo: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      observaciones: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      active: new FormControl(false)
    });

    if (this.id) {
      this.isEdit = true;

      this.rulingService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del dictamen ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/rulings`]);
              });
            console.error('Error trying to get ruling detail');
          }
        });
    }
  }

  updateForm(ruling: Ruling): void {
    this.rulingForm.patchValue({
      idDictamen: ruling.idDictamen,
      idCliente: ruling.idCliente,
      folio: ruling.folio,
      dictaminacion: ruling.dictaminacion,
      fDictamen: ruling.fDictamen,
      idPresentacion: ruling.idPresentacion,
      idFuncionario: ruling.idFuncionario,
      idEjecutivo: ruling.idEjecutivo,
      observaciones: ruling.observaciones,
      active: (ruling.idEstatus && ruling.idEstatus === 1) || false
    });
  }

  onSubmit(): void {
    this.rulingForm.markAllAsTouched();
    if (!this.rulingForm.valid) return;

    const rulingRequest = this.rulingForm.getRawValue();;
    rulingRequest.idEstatus = rulingRequest.active ? 1 : 3;

    this.rulingService.save(rulingRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El dictamen ${rulingRequest.idDictamen} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/rulings`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el dictamen ${rulingRequest.idDictamen}` },
          });
          console.error('Error trying to save ruling');
        }
      });
  }
  
  get form() {
    return this.rulingForm.controls;
  }
}