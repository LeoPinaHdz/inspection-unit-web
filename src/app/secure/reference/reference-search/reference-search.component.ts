import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Contract } from 'src/app/_shared/models/contract.model';
import { ContractService } from 'src/app/_shared/services/contract.service';
import { Client } from 'src/app/_shared/models/client.model';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ClientService } from 'src/app/_shared/services/client.service';
import { FormControl, FormGroup } from '@angular/forms';
import { removeEmptyAttributes } from 'src/app/_shared/utils/object.utils';
import { ConfirmationDialogComponent } from 'src/app/_shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ReferenceService } from 'src/app/_shared/services/reference.service';

@Component({
  selector: 'reference-search',
  templateUrl: './reference-search.component.html'
})

export class ReferenceSearchComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  _onDestroy = new Subject<void>();
  displayedColumns: string[] = [
    'FolioFormato',
    'NomCliente',
    'Estatus',
    'NombreArchivo',
    'action'
  ];
  dataSource: MatTableDataSource<Contract> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private referenceService: ReferenceService,
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.onSearch();
  }
  
  onSearch() {
    this.referenceService.search().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get references');
        }
      });
  }
}