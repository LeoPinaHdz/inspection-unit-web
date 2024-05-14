import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Executive } from 'src/app/_shared/models/executive.model';
import { ExecutiveService } from 'src/app/_shared/services/executive.service';

@Component({
  selector: 'executives',
  templateUrl: './executive-list.component.html'
})

export class ExecutivesComponent implements OnInit {
  displayedColumns: string[] = [
    'idEjecutivo',
    'nombre',
    'email',
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Executive> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private executiveService: ExecutiveService
  ) { }

  ngOnInit() {
    this.loadAllExecutives();
  }

  loadAllExecutives() {
    this.executiveService.getAll().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get executive list');
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