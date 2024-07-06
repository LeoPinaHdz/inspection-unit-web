import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: number): string {
    switch(value) {
      case 1:
        return 'ACTIVO';
      case 2:
        return 'CONCLUIDO';
      case 3:
        return 'CANCELADO';
      case 4:
        return 'INACTIVO';
      case 5:
        return 'VALIDADO';
      default:
        return '';
    }
  }

}