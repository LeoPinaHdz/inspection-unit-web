import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Client, ClientService } from 'src/app/_shared/services/client.service';

@Component({
  selector: 'client-list',
  templateUrl: './client-list.component.html'
})  

export class ClientListComponent implements OnInit{  
  displayedColumns: string[] = [
    'idCliente', 
    'nombre',
    'rfc', 
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Client> = new MatTableDataSource();
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private clientService: ClientService
  ) {  }

  ngOnInit() {
    this.loadAllClients();
  }

  loadAllClients() {
    this.clientService.getAll().
    pipe()
    .subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.error('Error trying to get client list');
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