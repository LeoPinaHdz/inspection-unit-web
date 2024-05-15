import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/_shared/components/simple-dialog/simple-dialog.component';
import { ExcelService } from 'src/app/_shared/services/excel.service';
import { ClientService } from 'src/app/_shared/services/client.service';
import { Warehouse, WarehouseService } from 'src/app/_shared/services/warehouse.service';
import { Client } from 'src/app/_shared/models/client.model';
import { ReportsService } from 'src/app/_shared/services/reports.service';
import { ReportType } from 'src/app/_shared/models/reports.model';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {
  formReports!: FormGroup;
  reportTypes: ReportType[] = [];
  currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  clients: Client[] = [];
  warehouses: Warehouse[] = [];

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog,
    private clientService: ClientService,
    private warehouseService: WarehouseService,
    private excelService: ExcelService
  ) {}


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

    this.clientService.getClients(this.currentUser.idUsuario)
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

    this.warehouseService.getWarehouses(this.currentUser.idUsuario)
    .pipe()
    .subscribe({
      next: (response) => {
        this.warehouses = response;
        if (this.warehouses.length) {
          this.formReports.get('idBodega')!.setValue(this.warehouses[0].idBodega);
          if (this.warehouses.length === 1) this.formReports.get('idBodega')!.disable();
        }
      },
      error: () => {
        console.error('Error trying to get warehouses');
      }
    });
  }

  onSubmit(): void {
    this.formReports.markAllAsTouched();
    if (!this.formReports.valid) return;

    const reportParameters = this.formReports.getRawValue();

    this.reportsService.getReport(reportParameters)
    .pipe()
    .subscribe({
      next: (response) => {
        let message;
        if (!response.length) {
          message = 'No se encontraron resultados';
        } else {
          this.excelService.exportAsExcelFile(response, 'Reporte');
          message = 'El reporte fue generado con éxito';
        }
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'success', message},
        });
      },
      error: () => {
        this.dialog.open(SimpleDialogComponent, {
          data: {type: 'error', message: `Error al generar el reporte`},
        });
        console.error('Error trying to get report');
      }
    });
  }

  get form() {
    return this.formReports.controls;
  }
}
