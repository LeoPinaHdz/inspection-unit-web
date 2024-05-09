import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { StandardService } from 'src/app/_shared/services/standard.service';
import { Standard } from 'src/app/_shared/models/standard.model';

@Component({
  selector: 'standards',
  templateUrl: './standard-detail.component.html',
  styleUrls: ['./standard-detail.component.scss'],
})
export class StandardDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  active = false;
  standard: Standard = {
    idNorma: 0,
    nombre: '',
    descripcion: '',
    fCaptura: '',
    fModificacion: '',
    idUsuario: 0,
    idEstatus: 1
  };

  standardForm!: FormGroup;
  _onDestroy = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private standardService: StandardService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.standardForm = new FormGroup({
      idNorma: new FormControl({ value: '', disabled: true }, []),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      puntos: new FormControl('', [Validators.required]),
      exceptos: new FormControl('', [Validators.required])
    });

    if (this.id) {
      this.isEdit = true;

      this.standardService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.updateForm(response);
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos de la norma con ID: ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/standards`]);
              });
            console.error(`Error trying to get standard detail with ID: ${this.id}`);
          }
        });
    }
  }

  updateForm(standard: Standard): void {
    this.standardForm.patchValue({
      idNorma: standard.idNorma,
      nombre: standard.nombre,
      descripcion: standard.descripcion,
      puntos: standard.puntos,
      exceptos: standard.puntos
    });    
    this.active = (standard.idEstatus && standard.idEstatus === 1) || false;
    this.standard = standard;
  }

  onSubmit(): void {
    this.standardForm.markAllAsTouched();
    if (!this.standardForm.valid) return;

    let standardRequest: Standard;

    if (this.isEdit) {
      const standardForm = this.standardForm.getRawValue();

      this.standard.nombre = standardForm.nombre;
      this.standard.descripcion = standardForm.descripcion;
      this.standard.puntos = standardForm.puntos;
      this.standard.exceptos = standardForm.exceptos;

      standardRequest = this.standard;
    } else {
      standardRequest = this.standardForm.getRawValue();
    }

    standardRequest.idEstatus = this.active ? 1 : 4;

    this.standardService.save(standardRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `La norma con ID: ${standardRequest.idNorma} fue guardada con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/standards`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar la norma con ID: ${standardRequest.idNorma}` },
          });
          console.error('Error trying to save standard');
        }
      });
  }

}