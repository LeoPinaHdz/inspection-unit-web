import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Request } from 'src/app/_shared/models/request.model';
import { RequestService } from 'src/app/_shared/services/request.service';

@Component({
  selector: 'requests',
  templateUrl: './request-list.component.html'
})

export class RequestsComponent implements OnInit {
  displayedColumns: string[] = [
    'idSolicitud',
    'pedimento',
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Request> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private requestService: RequestService
  ) { }

  ngOnInit() {
    this.loadAllRequests();
  }

  loadAllRequests() {
    this.requestService.getAll().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get request list');
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
}