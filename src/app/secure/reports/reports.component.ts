import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ExcelService } from 'src/app/_shared/services/excel.service';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Client } from 'src/app/_shared/models/client.model';
import { ReportType } from 'src/app/_shared/models/reports.model';
import { ReportsService } from 'src/app/_shared/services/reports.service';
import { formatDateString } from 'src/app/_shared/utils/date.utils';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Standard } from 'src/app/_shared/models/standard.model';
import { StandardService } from 'src/app/_shared/services/standard.service';
import { removeEmptyAttributes } from 'src/app/_shared/utils/object.utils';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportsForm!: FormGroup;
  reportTypes: ReportType[] = [];
  clients: Client[] = [];
  standards: Standard[] = [];
  currentReport: any;
  headers: string[] = [];
  totalsRow: number[] = [];
  values: (string | number)[][] = [[]];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog,
    private clientService: ClientService,
    private standardService: StandardService,
    private excelService: ExcelService
  ) { }


  ngOnInit() {
    this.reportsForm = new FormGroup({
      idReporte: new FormControl('', [Validators.required]),
      fInicio: new FormControl(new Date()),
      fFinal: new FormControl(new Date()),
      idCliente: new FormControl(''),
      clientFilter: new FormControl(''),
      idNorma: new FormControl(''),
    });

    this.reportsService.getReportType()
      .pipe()
      .subscribe({
        next: (response) => {
          this.reportTypes = response;
        },
        error: () => {
          console.error('Error trying to get report types');
        }
      });

    this.standardService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.standards = response;
        },
        error: () => {
          console.error('Error trying to get standard list');
        }
      });

    this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          this.filteredClients.next(this.clients.slice());
          this.reportsForm.get('clientFilter')!.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterClients();
            });
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });
  }

  download(): void {
    this.excelService.exportAsExcelFile(this.currentReport, 'Reporte');
    this.dialog.open(SimpleDialogComponent, {
      data: { type: 'success', message: 'El reporte fue generado con éxito' },
    });
  }

  previewReport(): void {
    this.headers = Object.keys(this.currentReport[0]);
    this.values = this.currentReport.map((item: any) => Object.values(item));

    const sumColumns = this.headers.filter(h => h.startsWith('Cantidad'));

    if (sumColumns.length) {
      this.totalsRow = new Array(this.headers.length);

      sumColumns.forEach(c => {
        const index = this.headers.indexOf(c);
        const sum = this.values.map(d => Number(d[index]) || 0).reduce((acc, value) => acc + value, 0);

        this.totalsRow[index] = sum;
      });
    }
  }

  clear(): void {
    this.headers = [];
    this.totalsRow = [];
    this.currentReport = undefined;
    this.values = [[]];
  }

  onSubmit(): void {
    this.reportsForm.markAllAsTouched();
    if (!this.reportsForm.valid) return;

    this.clear();

    const reportParameters = this.reportsForm.getRawValue();
    reportParameters.fInicio = formatDateString(reportParameters.fInicio);
    reportParameters.fFinal = formatDateString(reportParameters.fFinal);

    this.reportsService.getReport(removeEmptyAttributes(reportParameters))
      .pipe()
      .subscribe({
        next: (response) => {
          if (!response.length) {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'success', message: 'No se encontraron resultados' },
            });
          } else {
            this.currentReport = response;
            this.previewReport();
          }
        },
        error: () => {
          this.dialog.open(SimpleDialogComponent, {
            data: { type: 'error', message: `Error al generar el reporte` },
          });
          console.error('Error trying to get report');
        }
      });
  }

  get form() {
    return this.reportsForm.controls;
  }

  protected filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.reportsForm.get('clientFilter')!.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clients.filter(client => client.nombre!.toLowerCase().indexOf(search!) > -1)
    );
  }
}
