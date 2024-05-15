import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { StandardService } from 'src/app/_shared/services/standard.service';
import { Standard } from 'src/app/_shared/models/standard.model';
import { StandardSpec } from 'src/app/_shared/models/state.model';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'standards',
  templateUrl: './standard-detail.component.html',
})
export class StandardDetailComponent implements OnInit, OnDestroy {
  id: any;
  isEdit = false;
  displayedColumns: string[] = ['punto', 'contenido', 'actions'];
  selectedSpec?: StandardSpec;
  standardSpecs: StandardSpec[] = [];
  dataSource: MatTableDataSource<StandardSpec> = new MatTableDataSource();
  standard: Standard = {
    idNorma: 0,
    nombre: '',
    descripcion: '',
    idUsuario: 0,
    idEstatus: 1
  };

  standardForm!: FormGroup;
  standardSpecForm!: FormGroup;
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
      exceptos: new FormControl('', [Validators.required]),
      active: new FormControl(false, [Validators.required])
    });

    this.standardSpecForm = new FormGroup({
      punto: new FormControl({ value: '', disabled: true }, []),
      contenido: new FormControl('', [Validators.required])
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

  initDetailsTable(specs: StandardSpec[], setPartida?: boolean) {
    const sortedReceipts = specs.sort((a, b) => a.punto > b.punto ? 1 : -1);
    if (setPartida) {
      sortedReceipts.forEach((item, i) => {
        item.punto = i + 1;
      });
    }

    this.dataSource = new MatTableDataSource(sortedReceipts);
  }
  editDetail(spec: StandardSpec): void {
    this.selectedSpec = spec;
    this.standardSpecs = this.standardSpecs.filter(d => d.punto !== spec.punto);
    this.initDetailsTable(this.standardSpecs);
    this.standardSpecForm.patchValue({
      idNormaPunto: spec.idNormaPunto,
      contenido: spec.contenido
    });
  }

  showConfirmDeleteDialog(spec: StandardSpec): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: `¿Esta seguro que desea eliminar el punto ${spec.punto}?`,
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.standardSpecs = this.standardSpecs.filter(d => d.punto !== spec.punto);
          this.initDetailsTable(this.standardSpecs, true);
        }
      });
  }

  onCancelEdit(): void {
    if (this.selectedSpec) {
      this.standardSpecs.push(this.selectedSpec);
      this.initDetailsTable(this.standardSpecs);
      this.standardSpecForm.reset({ active: false });
      this.selectedSpec = undefined;
    }
  }

  onSubmitDetail(): void {
    this.standardSpecForm.markAllAsTouched();
    if (!this.standardSpecForm.valid) return;

    const spec = this.standardSpecForm.getRawValue();

    if (this.isEdit && this.selectedSpec) {
      this.selectedSpec.punto = spec.punto;
      this.selectedSpec.contenido = spec.cantidad;

      this.standardSpecs.push(this.selectedSpec);
    } else {
      spec.partida = spec.punto == 0 ? this.standardSpecs.length + 1 : spec.punto;
      this.standardSpecs.push(spec);
    }
    this.selectedSpec = undefined;
    this.initDetailsTable(this.standardSpecs, true);
    this.standardSpecForm.reset({ active: false });
  }

  updateForm(standard: Standard): void {
    this.standardForm.patchValue({
      idNorma: standard.idNorma,
      nombre: standard.nombre,
      descripcion: standard.descripcion,
      puntos: standard.puntos,
      exceptos: standard.puntos,
      active: (standard.idEstatus && standard.idEstatus === 1) || false
    });
    this.standard = standard;
  }

  onSubmit(): void {
    this.standardForm.markAllAsTouched();
    if (!this.standardForm.valid) return;

    const standardRequest = this.standardForm.getRawValue();
    standardRequest.idEstatus = standardRequest.active ? 1 : 3;

    this.standardService.save(standardRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `La norma ${standardRequest.idNorma} fue guardada con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.router.navigate([`/secure/standards`]);
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar la norma ${standardRequest.idNorma}` },
          });
          console.error('Error trying to save standard');
        }
      });
  }

  loadFile(files: any) {
    if (this.standardSpecs.length > 0) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: 'Al cargar el archivo todas las especificaciones de norma seran reemplazadas por el contenido del archivo',
      })
        .afterClosed()
        .subscribe((confirmed: Boolean) => {
          if (confirmed) {
            this.processFile(files);
          }
        });
    } else {
      this.processFile(files);
    }
  }

  processFile(files: any) {
    const file = files[0] as File;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const specs = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).map((row: any) => row[0]);
      this.standardSpecs = [];

      specs.filter(spec => spec && spec.trim() !== '').forEach(contenido => {
        const idNormaPunto = 0;
        const punto = this.standardSpecs.length + 1;

        this.standardSpecs.push({ idNormaPunto, punto, contenido });
      })
      this.selectedSpec = undefined;
      this.initDetailsTable(this.standardSpecs, true);
      this.standardSpecForm.reset();
    };
    reader.readAsArrayBuffer(file);
  }

  get form() {
    return this.standardForm.controls;
  }

  get formSpec() {
    return this.standardSpecForm.controls;
  }
}