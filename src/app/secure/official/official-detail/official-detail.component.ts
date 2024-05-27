import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { OfficialService } from 'src/app/_shared/services/official.service';
import { Official } from 'src/app/_shared/models/official.model';

@Component({
  selector: 'officials',
  templateUrl: './official-detail.component.html',
})
export class OfficialDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  official: Official = { idFuncionario: 0 };
  officialForm!: FormGroup;
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private officialService: OfficialService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.officialForm = new FormGroup({
      idFuncionario: new FormControl({ value: '', disabled: true }, []),
      nombre: new FormControl('', [Validators.required]),
      cargo: new FormControl('', [Validators.required]),
      active: new FormControl(false)
    });

    if (this.id) {
      this.isEdit = true;

      this.officialService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del funcionario ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/officials`]);
              });
            console.error('Error trying to get official detail');
          }
        });
    }
  }

  updateForm(official: Official): void {
    this.officialForm.patchValue({
      idFuncionario: official.idFuncionario,
      nombre: official.nombre,
      cargo: official.cargo,
      active: (official.idEstatus && official.idEstatus === 1) || false
    });
  }

  onSubmit(): void {
    this.officialForm.markAllAsTouched();
    if (!this.officialForm.valid) return;

    const officialRequest = this.officialForm.getRawValue();;
    officialRequest.idEstatus = officialRequest.active ? 1 : 3;

    this.officialService.save(officialRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El funcionario ${officialRequest.idFuncionario} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/officials`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el funcionario ${officialRequest.idFuncionario}` },
          });
          console.error('Error trying to save official');
        }
      });
  }
}