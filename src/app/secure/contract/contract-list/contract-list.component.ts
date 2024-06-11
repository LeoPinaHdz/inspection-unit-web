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

@Component({
  selector: 'contracts',
  templateUrl: './contract-list.component.html'
})

export class ContractsComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  _onDestroy = new Subject<void>();
  searchForm!: FormGroup;
  displayedColumns: string[] = [
    'clave',
    'nombreCliente',
    'idEstatus',
    'fContratoFmt',
    'fVigenciaFmt',
    'action'
  ];
  dataSource: MatTableDataSource<Contract> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private contractService: ContractService,
    private clientService: ClientService
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      idCliente: new FormControl('', []),
      clientFilter: new FormControl('', []),
      contrato: new FormControl('', []),
      fechaInicio: new FormControl('', []),
      fechaFin: new FormControl('', [])
    });

    this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          this.filteredClients.next(this.clients.slice());
          this.searchForm.get('clientFilter')!.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterArticles();
            });
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });
  }

  onSearch() {
    this.contractService.search(removeEmptyAttributes(this.searchForm.getRawValue())).
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get contract list');
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private filterArticles() {
    if (!this.clients) {
      return;
    }
    let search = this.searchForm.get('clientFilter')!.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clients.filter(client => client.nombre!.toLowerCase().indexOf(search) > -1)
    );
  }
}