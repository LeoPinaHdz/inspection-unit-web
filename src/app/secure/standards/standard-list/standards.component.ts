import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StandardService } from 'src/app/_shared/services/standard.service';
import { Standard } from 'src/app/_shared/models/standard.model';

@Component({
  selector: 'standards',
  templateUrl: './standards.component.html'
})  

export class StandardsComponent implements OnInit{  
  displayedColumns: string[] = [
    'idNorma', 
    'nombre',
    'descripcion', 
    'puntos',
    'exceptos',
    'action'
  ];
  dataSource: MatTableDataSource<Standard> = new MatTableDataSource();
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private standardService: StandardService
  ) {  }

  ngOnInit() {
    this.loadAllStandards();
  }

  loadAllStandards() {
    this.standardService.getAll().
    pipe()
    .subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.error('Error trying to get standard list');
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