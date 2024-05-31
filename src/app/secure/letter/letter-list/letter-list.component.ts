import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Letter } from 'src/app/_shared/models/letter.model';
import { LetterService } from 'src/app/_shared/services/letter.service';

@Component({
  selector: 'letters',
  templateUrl: './letter-list.component.html'
})

export class LettersComponent implements OnInit {
  displayedColumns: string[] = [
    'idOficio',
    'folio',
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Letter> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private letterService: LetterService
  ) { }

  ngOnInit() {
    this.loadAllLetters();
  }

  loadAllLetters() {
    this.letterService.getAll().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get letter list');
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