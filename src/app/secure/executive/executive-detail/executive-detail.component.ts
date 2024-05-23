import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ExecutiveService } from 'src/app/_shared/services/executive.service';
import { Executive } from 'src/app/_shared/models/executive.model';
import { StandardService } from 'src/app/_shared/services/standard.service';
import { Standard } from 'src/app/_shared/models/standard.model';

@Component({
    selector: 'executives',
    templateUrl: './executive-detail.component.html',
  })
export class ExecutiveDetailComponent implements OnInit, OnDestroy{
  id: any;
  isEdit = false;
  currentUser = JSON.parse(sessionStorage.getItem('currentExecutive') || '{}');
  executive: Executive = {idEjecutivo: 0};
  standards: any[] = [];
  executiveForm!: FormGroup;
  _onDestroy = new Subject<void>();
  allStandardsSelected: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private executiveService: ExecutiveService,
    private standardService: StandardService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }  

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.standardService.getAllActive().
    pipe()
    .subscribe({
      next: (response) => {
        this.standards = response;

        if (this.executive.idEjecutivo !== 0) {
          this.standards.forEach(p => p.selected = this.isStandardAssigned(p.idNorma));
        }
      },
      error: () => {
        console.error('Error trying to get standard list');
      }      
    });

    this.executiveForm = new FormGroup({
      idEjecutivo: new FormControl({value: '', disabled: true}, []),
      nombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      active: new FormControl(false, [Validators.required]),
      signatario: new FormControl(false, [Validators.required]),
      inspector: new FormControl(false, [Validators.required])
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
      idEjecutivo: executive.idEjecutivo,
      nombre: executive.nombre,
      telefono: executive.telefono,
      email: executive.email,
      active: (executive.idEstatus && executive.idEstatus === 1) || false,
      signatario: executive.signatario,
      inspector: executive.inspector
    });

    this.executive = executive;
    this.standards.forEach(p => p.selected = this.isStandardAssigned(p.idNorma));
  }

  isStandardAssigned(key: Number): boolean {
    return this.executive.normaEjecutivo!.filter(p => p.idNorma === key).length > 0;
  }

  onSubmit(): void {
    this.executiveForm.markAllAsTouched();
    if (!this.executiveForm.valid) return;

    const executiveRequest = this.executiveForm.getRawValue();;
    executiveRequest.idEstatus = executiveRequest.active ? 1 : 3;
    executiveRequest.normaEjecutivo = this.standards.filter(t => t.selected).map(t => {
      return {idNorma: t.idNorma, idEjecutivo: executiveRequest.idEjecutivo || 0};
    });

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

  selectStandard() {
    this.allStandardsSelected = this.standards.every(t => t.selected);
  }

  someStandardsSelected(): boolean {
    return this.standards.filter(t => t.selected).length > 0 && !this.allStandardsSelected;
  }

  selectAllStandards(selected: boolean) {
    this.allStandardsSelected = selected;
    this.standards.forEach(t => (t.selected = selected));
  }
}