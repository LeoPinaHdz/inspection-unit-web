import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { PromoterService } from 'src/app/_shared/services/promoter.service';
import { Promoter } from 'src/app/_shared/models/promoter.model';

@Component({
  selector: 'promoters',
  templateUrl: './promoter-detail.component.html',
})
export class PromoterDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  currentUser = JSON.parse(sessionStorage.getItem('currentPromoter') || '{}');
  promoter: Promoter = { idPromotor: 0 };
  promoterForm!: FormGroup;
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private promoterService: PromoterService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.promoterForm = new FormGroup({
      idPromotor: new FormControl({ value: '', disabled: true }, []),
      nombre: new FormControl('', [Validators.required]),
      active: new FormControl(false)
    });

    if (this.id) {
      this.isEdit = true;

      this.promoterService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del promotor ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/promoters`]);
              });
            console.error('Error trying to get promoter detail');
          }
        });
    }
  }

  updateForm(promoter: Promoter): void {
    this.promoterForm.patchValue({
      idPromotor: promoter.idPromotor,
      nombre: promoter.nombre,
      active: (promoter.idEstatus && promoter.idEstatus === 1) || false
    });
  }

  onSubmit(): void {
    this.promoterForm.markAllAsTouched();
    if (!this.promoterForm.valid) return;

    const promoterRequest = this.promoterForm.getRawValue();
    promoterRequest.idEstatus = promoterRequest.active ? 1 : 3;

    this.promoterService.save(promoterRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El promotor ${promoterRequest.idPromotor} fue guardado con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/promoters`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el promotor ${promoterRequest.idPromotor}` },
          });
          console.error('Error trying to save promoter');
        }
      });
  }
}