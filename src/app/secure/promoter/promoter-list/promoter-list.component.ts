import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Promoter } from 'src/app/_shared/models/promoter.model';
import { PromoterService } from 'src/app/_shared/services/promoter.service';

@Component({
  selector: 'promoters',
  templateUrl: './promoter-list.component.html'
})

export class PromotersComponent implements OnInit {
  displayedColumns: string[] = [
    'idPromotor',
    'nombre',
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Promoter> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private promoterService: PromoterService
  ) { }

  ngOnInit() {
    this.loadAllPromoters();
  }

  loadAllPromoters() {
    this.promoterService.getAll().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get promoter list');
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