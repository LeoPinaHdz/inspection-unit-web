import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Official } from 'src/app/_shared/models/official.model';
import { OfficialService } from 'src/app/_shared/services/official.service';

@Component({
  selector: 'officials',
  templateUrl: './official-list.component.html'
})

export class OfficialsComponent implements OnInit {
  displayedColumns: string[] = [
    'idFuncionario',
    'nombre',
    'cargo',
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Official> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private officialService: OfficialService
  ) { }

  ngOnInit() {
    this.loadAllOfficials();
  }

  loadAllOfficials() {
    this.officialService.getAll().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get official list');
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