import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientRepresentativeService } from 'src/app/_shared/services/client-representative.service';
import { ClientRepresentative } from 'src/app/_shared/models/client-representative.model';
import { Client } from 'src/app/_shared/models/client.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';

@Component({
  selector: 'client-representative',
  templateUrl: './client-representative.component.html'
})

export class ClientRepresentativeComponent implements OnInit, OnChanges {
  @Input() client: Client = { idCliente: 0 };
  isListMode = true;
  displayedColumns: string[] = [
    'nombre',
    'idEstatus',
    'telefono',
    'action'
  ];
  dataSource: MatTableDataSource<ClientRepresentative> = new MatTableDataSource();
  clientRepresentativeForm!: FormGroup;
  identifications = [{idIdentificacion: 1, nombre: 'Tipo'}]

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private clientRepresentativeService: ClientRepresentativeService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const sampleData = [{ idRepresentante: 1, nombre: 'Prueba', idEstatus: 1, telefono: '123' }] as ClientRepresentative[];
    this.dataSource = new MatTableDataSource(sampleData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.clientRepresentativeForm = new FormGroup({
      idRepresentante: new FormControl({ value: '', disabled: true }, []),
      idCliente: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      acta: new FormControl(''),
      telefono: new FormControl(''),
      notaria: new FormControl(''),
      email: new FormControl(''),
      notario: new FormControl(''),
      fNotaria: new FormControl(''),
      lugar: new FormControl(''),
      idIdentificacion: new FormControl(''),
      noIdentificacion: new FormControl(''),
      active: new FormControl('', [Validators.required])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client && this.client.idCliente !== 0) {
      this.loadAllClientRepresentatives(this.client.idCliente);
    }
  }

  loadAllClientRepresentatives(id: number) {
    this.clientRepresentativeService.getAll(id).
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get client-representative list');
        }
      });
  }

  onSubmit(): void {
    this.clientRepresentativeForm.markAllAsTouched();
    if (!this.clientRepresentativeForm.valid) return;

    const clientRepresentativeRequest = this.clientRepresentativeForm.getRawValue();
    clientRepresentativeRequest.idEstatus = clientRepresentativeRequest.active ? 1 : 4;

    this.clientRepresentativeService.save(clientRepresentativeRequest)
      .pipe()
      .subscribe({
        next: (response) => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'success', message: `El representativeo con ID: ${clientRepresentativeRequest.idRepresentativeo} fue guardada con éxito` },
          })
            .afterClosed()
            .subscribe((confirmado: Boolean) => {
              this.isListMode = !this.isListMode;
              this.clientRepresentativeForm.reset();
            });
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al guardar el representativeo con ID: ${clientRepresentativeRequest.idRepresentativeo}` },
          });
          console.error('Error trying to save clientRepresentative');
        }
      });
  }

  onCancel(): void {
    this.isListMode = true;
    this.clientRepresentativeForm.reset();
  }

  onEditRepresentative(clientRepresentative: ClientRepresentative): void {
    this.updateForm(clientRepresentative);
    this.isListMode = !this.isListMode;
  }

  updateForm(clientRepresentative: ClientRepresentative): void {
    this.clientRepresentativeForm.patchValue({
      idRepresentante: clientRepresentative.idRepresentante,
      idCliente: clientRepresentative.idCliente,
      nombre: clientRepresentative.nombre,
      acta: clientRepresentative.acta,
      telefono: clientRepresentative.telefono,
      notaria: clientRepresentative.notaria,
      notario: clientRepresentative.notario,
      fNotaria: clientRepresentative.fNotaria,
      lugar: clientRepresentative.lugar,
      idIdentificacion: clientRepresentative.idIdentificacion,
      email: clientRepresentative.email,
      noIdentificacion: clientRepresentative.noIdentificacion,
      active: (clientRepresentative.idEstatus && clientRepresentative.idEstatus === 1) || false
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  get form() {
    return this.clientRepresentativeForm.controls;
  }
}