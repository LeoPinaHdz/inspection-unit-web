import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Contract } from 'src/app/_shared/models/contract.model';
import { ContractService } from 'src/app/_shared/services/contract.service';

@Component({
  selector: 'contracts',
  templateUrl: './contract-list.component.html'
})

export class ContractsComponent implements OnInit {
  displayedColumns: string[] = [
    'idContrato',
    'folio',
    'idEstatus',
    'action'
  ];
  dataSource: MatTableDataSource<Contract> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.loadAllContracts();
  }

  loadAllContracts() {
    this.contractService.getAll().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get contract list');
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