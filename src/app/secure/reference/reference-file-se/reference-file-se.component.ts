import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReferenceService } from 'src/app/_shared/services/reference.service';
import { formatDateString } from 'src/app/_shared/utils/date.utils';
import { saveFile } from 'src/app/_shared/utils/file.utils';

@Component({
  selector: 'reference-file-se',
  templateUrl: './reference-file-se.component.html',
})

export class ReferenceFileSEComponent implements OnInit {
  searchForm!: FormGroup;

  constructor(
    private referenceService: ReferenceService,
    private dialog: MatDialog 
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      fechaFolio: new FormControl({ value: new Date(), disabled: true }, []),
      otra: new FormControl(false, []),
      cancelar: new FormControl(false, [])
    });
  }

  onSubmit() {
    const request = this.searchForm.getRawValue();

    request.fechaFolio = request.fechaFolio ? formatDateString(request.fechaFolio) : '';
    request.cancelar = request.cancelar == true ? 1 : 0;

    this.referenceService.download(request).subscribe(response => {
      saveFile(response.body, response.headers.get('filename') || `Archivo S.E..xlsx`,
        response.headers.get('Content-Type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  }

  assignDate(): void {
    if (this.searchForm.get('otra')!.value) {
      this.searchForm.get('fechaFolio')!.enable();
    } else {
      this.searchForm.get('fechaFolio')!.disable();
      this.searchForm.get('fechaFolio')!.setValue(new Date());
    }
  }
  
  get form() {
    return this.searchForm.controls;
  }
}