import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ExecutiveService } from 'src/app/_shared/services/executive.service';
import { Executive } from 'src/app/_shared/models/executive.model';

@Component({
    selector: 'executives',
    templateUrl: './executive-detail.component.html',
    styleUrls: ['./executive-detail.component.scss'],
  })
export class ExecutiveDetailComponent implements OnInit, OnDestroy{
  id: any;
  isEdit = false;
  active = false;
  currentUser = JSON.parse(sessionStorage.getItem('currentExecutive') || '{}');
  executive: Executive = {idEjecutivo: 0};
  executiveForm!: FormGroup;
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private executiveService: ExecutiveService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }  

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.executiveForm = new FormGroup({
      idEjecutivo: new FormControl({value: '', disabled: true}, []),
      nombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      active: new FormControl(false, [Validators.required])
    });

    if (this.id) {
      this.isEdit = true;

      this.executiveService.getById(this.id)
      .pipe()
      .subscribe({
        next: (response) => {
          this.updateForm(response);
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: {type: 'error', message: `Error al obtener los datos del ejecutivo ${this.id}`},
          })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate([`/secure/executives`]);
          });
          console.error('Error trying to get executive detail');
        }
      });
    }
  }

  updateForm(executive: Executive): void {
    this.executiveForm.patchValue({
      idEjecutivo: executive.idUsuario,
      nombre: executive.nombre,
      telefono: executive.telefono,
      email: executive.email,
    });
    this.active = (executive.idEstatus && executive.idEstatus === 1) || false;
  }

  onSubmit(): void {
    this.executiveForm.markAllAsTouched();
    if (!this.executiveForm.valid) return;

    let executiveRequest: Executive;

    if (this.isEdit) {
      const executiveForm = this.executiveForm.getRawValue();

      this.executive.nombre = executiveForm.nombre;
      this.executive.telefono = executiveForm.telefono;
      this.executive.email = executiveForm.email;

      executiveRequest = this.executive;
    } else {
      executiveRequest = this.executiveForm.getRawValue();
    }

    executiveRequest.idEstatus = this.active ? 1 : 2;

    this.executiveService.save(executiveRequest)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'success', message: `El ejecutivo ${executiveRequest.idEjecutivo} fue guardado con éxito`},
        })
        .afterClosed()
        .subscribe((confirmado: Boolean) => {
          this.router.navigate([`/secure/executives`]);
        });
      },
      error: () => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'error', message: `Error al guardar el ejecutivo ${executiveRequest.idEjecutivo}`},
        });
        console.error('Error trying to save executive');
      }
    });
  }
}