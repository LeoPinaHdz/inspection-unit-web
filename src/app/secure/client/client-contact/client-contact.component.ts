import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientContact, ClientContactService } from 'src/app/_shared/services/client-contact.service';

@Component({
  selector: 'client-contact',
  templateUrl: './client-contact.component.html'
})  

export class ClientContactComponent implements OnInit{  
  displayedColumns: string[] = [
    'idContacto', 
    'idCliente',
    'nombre',
    'puesto', 
    'telefono',
    'extension',
    'email',
    'idTipo',
    'fCaptura',
    'fModificacion',
    'action'
  ];
  dataSource: MatTableDataSource<ClientContact> = new MatTableDataSource();
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private clientContactService: ClientContactService
  ) {  }

  ngOnInit() {
    this.loadAllClientContacts();
  }

  loadAllClientContacts() {
    this.clientContactService.getAll().
    pipe()
    .subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.error('Error trying to get client-contact list');
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