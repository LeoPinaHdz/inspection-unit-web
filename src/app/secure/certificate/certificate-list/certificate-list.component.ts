import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Certificate } from 'src/app/_shared/models/certificate.model';
import { CertificateService } from 'src/app/_shared/services/certificate.service';

@Component({
  selector: 'certificates',
  templateUrl: './certificate-list.component.html'
})

export class CertificatesComponent implements OnInit {
  displayedColumns: string[] = [
    'folio',
    'cliente',
    'solicitud',
    'oficio',
    'fActa',
    'action'
  ];
  dataSource: MatTableDataSource<Certificate> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private certificateService: CertificateService
  ) { }

  ngOnInit() {
    this.loadAllCertificates();
  }

  loadAllCertificates() {
    this.certificateService.getAll().
      pipe()
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          console.error('Error trying to get certificate list');
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