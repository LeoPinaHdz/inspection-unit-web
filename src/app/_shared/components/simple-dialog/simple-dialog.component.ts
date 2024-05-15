import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
})
export class SimpleDialogComponent {

constructor(
    public dialog: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    getTitle() {
      switch (this.data.type) {
        case 'error': return 'Error';
        case 'success': return 'Operación exitosa';
        case 'warning': return 'Atención';
        default: return 'Alerta';
      }
    }
}