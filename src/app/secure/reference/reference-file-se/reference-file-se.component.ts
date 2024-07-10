import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Client } from 'src/app/_shared/models/client.model';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReferenceService } from 'src/app/_shared/services/reference.service';
import { formatDateString } from 'src/app/_shared/utils/date.utils';
import { saveFile } from 'src/app/_shared/utils/file.utils';

@Component({
  selector: 'reference-file-se',
  templateUrl: './reference-file-se.component.html',
  //styleUrls: ['./contract-list.component.scss']
})

export class ReferenceFileSEComponent implements OnInit, OnDestroy, OnChanges {
  @Input() clients: Client[] = [];
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  _onDestroy = new Subject<void>();
  searchForm!: FormGroup;

  constructor(
    private referenceService: ReferenceService,
    private dialog: MatDialog 
  ) { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      cliente: new FormControl('', []),
      clientFilter: new FormControl('', []),
      folioIni: new FormControl('', []),
      folioFin: new FormControl('', []),
      fechaIni: new FormControl(new Date(), []),
      fechaFin: new FormControl(new Date(), []),
      cancelar: new FormControl(false, [])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.clients && this.clients.length > 0) {
      this.filteredClients.next(this.clients.slice());
      this.searchForm.get('clientFilter')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterClients();
        });
    }
  }

  onSubmit() {
    const request = this.searchForm.getRawValue();

    request.fechaIni = request.fechaIni ? formatDateString(request.fechaIni) : '';
    request.fechaFin = request.fechaFin ? formatDateString(request.fechaFin) : '';
    request.folioIni = request.folioIni || 0;
    request.folioFin = request.folioFin || 0;
    request.cliente = request.cliente || 0;
    request.cancelar = request.cancelar == true ? 1 : 0;

    this.referenceService.download(request).subscribe(response => {
      saveFile(response.body, response.headers.get('filename') || `Archivo S.E..xlsx`,
        response.headers.get('Content-Type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  }

  private filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.searchForm.get('clientFilter')!.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clients.filter(client => client.nombre!.toLowerCase().indexOf(search) > -1)
    );
  }
}