import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/_shared/services/user.service';
import { User } from 'src/app/_shared/models/user.model';

@Component({
  selector: 'users',
  templateUrl: './users.component.html'
})  

export class UsersComponent implements OnInit{  
  displayedColumns: string[] = [
    'idUsuario', 
    'usuario',
    'nombre', 
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private userService: UsersService
  ) {  }

  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.userService.getAll().
    pipe()
    .subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.error('Error trying to get user list');
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