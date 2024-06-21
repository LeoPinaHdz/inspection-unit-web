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

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  formReports!: FormGroup;
  reportTypes: ReportType[] = [];
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  clients: Client[] = [];
  currentReport: any;
  headers: string[] = [];
  totalsRow: number[] = [];
  values:(string | number)[][] = [[]];

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog,
    private clientService: ClientService,
    private excelService: ExcelService
  ) { }


  ngOnInit() {
    this.formReports = new FormGroup({
      idReporte: new FormControl('', [Validators.required]),
      Fecha: new FormControl(new Date(), [Validators.required]),
      FechaCierre: new FormControl(new Date(), [Validators.required]),
      ReciboIni: new FormControl('', []),
      ReciboFin: new FormControl('', []),
      ArticuloIni: new FormControl('', []),
      ArticuloFin: new FormControl('', []),
      idCliente: new FormControl('', [Validators.required]),
      idBodega: new FormControl('', [Validators.required]),
      MovimientosEnCero: new FormControl(1, [Validators.required]),
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

    this.clientService.getAllActive()
      .pipe()
      .subscribe({
        next: (response) => {
          this.clients = response;
          if (this.clients.length) {
            this.formReports.get('idCliente')!.setValue(this.clients[0].idCliente);
            if (this.clients.length === 1) this.formReports.get('idCliente')!.disable();
          }
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
    this.formReports.markAllAsTouched();
    if (!this.formReports.valid) return;

    this.clear();

    const reportParameters = this.formReports.getRawValue();
    reportParameters.Fecha = formatDateString(reportParameters.Fecha);
    reportParameters.FechaCierre = formatDateString(reportParameters.FechaCierre);

    this.reportsService.getReport(reportParameters)
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
    return this.formReports.controls;
  }
}
