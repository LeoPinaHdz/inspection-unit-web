import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ruling } from 'src/app/_shared/models/ruling.model';
import { RulingService } from 'src/app/_shared/services/ruling.service';

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
  dataSource: MatTableDataSource<Ruling> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private rulingService: RulingService
  ) { }

  ngOnInit() {
    this.loadAllRulings();
  }

  loadAllRulings() {
    this.rulingService.getAll().
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}