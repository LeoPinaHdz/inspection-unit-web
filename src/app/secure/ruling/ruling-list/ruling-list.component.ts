import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ruling } from 'src/app/_shared/models/ruling.model';
import { RulingService } from 'src/app/_shared/services/ruling.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Client } from 'src/app/_shared/models/client.model';
import { formatDateString } from 'src/app/_shared/utils/date.utils';

@Component({
  selector: 'rulings',
  templateUrl: './ruling-list.component.html'
})

export class RulingsComponent implements OnInit {
  displayedColumns: string[] = [
    'cliente',
    'dictamen',
    'solicitud',
    'pedimento',
    'estatus',
    'fDictamen',
    'tipo',
    'action'
  ];
  _onDestroy = new Subject<void>();
  searchForm!: FormGroup;
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  dataSource: MatTableDataSource<Ruling> = new MatTableDataSource();
  clients: Client[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private rulingService: RulingService,
    private clientService: ClientService,
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      cliente: new FormControl('', []),
      clientFilter: new FormControl('', []),
      tipo: new FormControl(false, []),
      tipoDictamen: new FormControl('', []),
      fechaDel: new FormControl('', []),
      fechaAl: new FormControl('', []),
      pedimento: new FormControl('', []),
      dictamenDe: new FormControl('', []),
      dictamenAl: new FormControl('', [])
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
              this.filterClients();
            });
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });
  }

  onSearch() {
    const request = this.searchForm.getRawValue();

    request.fechaDel = request.fechaDel ? formatDateString(request.fechaDel) : '';
    request.fechaAl = request.fechaAl ? formatDateString(request.fechaAl) : '';
    request.cliente = request.cliente || 0;
    request.tipo = request.tipo ? 1 : 0;

    this.rulingService.search(request).
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get ruling list');
        }
      });
  }

  private filterClients() {
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