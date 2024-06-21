import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Certificate } from 'src/app/_shared/models/certificate.model';
import { CertificateService } from 'src/app/_shared/services/certificate.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Client } from 'src/app/_shared/models/client.model';
import { ClientService } from 'src/app/_shared/services/client.service';
import { formatDateString } from 'src/app/_shared/utils/date.utils';

@Component({
  selector: 'certificates',
  templateUrl: './certificate-list.component.html'
})

export class CertificatesComponent implements OnInit {
  displayedColumns: string[] = [
    'NoFolio',
    'Cliente',
    'Solicitud',
    'NoOficio',
    'FIniActa',
    'action'
  ];
  _onDestroy = new Subject<void>();
  searchForm!: FormGroup;
  clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  dataSource: MatTableDataSource<Certificate> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private certificateService: CertificateService,
    private clientService: ClientService
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      cliente: new FormControl('', []),
      clientFilter: new FormControl('', []),
      fechaDel: new FormControl('', []),
      fechaAl: new FormControl('', [])
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

    this.certificateService.search(request).
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error certificate to get certificate list');
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