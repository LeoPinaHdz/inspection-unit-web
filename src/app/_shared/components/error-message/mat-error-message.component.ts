/* tslint:disable */
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'error-message',
  template: `
    <span *ngIf="shouldShowErrors()">
      {{ listOfErrors() }}
    </span>
  `,
})
export class ErrorMessageComponent {
  @Input()
  public control: any;
  @Input()
  public nomCampo: any;

  // tslint:disable-next-line
  private static readonly errorMessages = {
    required: (params: any, nomCampo: any) =>
      `El campo ${nomCampo} es requerido`,
    minlength: (params: any, nomCampo: any) =>
      `${nomCampo} debe tener minimo ${params.requiredLength} caracteres.`,
    maxlength: (params: any, nomCampo: any) =>
      `${nomCampo} debe tener máximo ${params.requiredLength} caracteres.`,
    pattern: (params: any, nomCampo: any) =>
      `${nomCampo} contiene caracteres no válidos.`,
    max: (params: any, nomCampo: any) =>
      `${nomCampo}  debe ser un valor máximo de ${params.max}.`,
    min: (params: any, nomCampo: any) =>
      `${nomCampo} debe ser un valor minimo de ${params.min}.`,
    defaultValue: (params: any, nomCampo: any) =>
      `Este valor es requerido`,
    equalValidator: (params: any, nomCampo: any) =>
      `${nomCampo} debe ser igual a ${params}.`,
    email: (params: any, nomCampo: any) => `El ${nomCampo} no es válido.`,
    passwordValidator: (params: any, nomCampo: any) =>
      `8 caracteres,1 mayúscula,1 minúsculay 1 número.`,
    horaValidator: (params: any, nomCampo: any) => `Debe seleccionar una hora.`,
    codigoValidator: (params: any, nomCampo: any) =>
      `Ingrese un  ${nomCampo} válido`,
  };

  shouldShowErrors(): boolean {
    return (
      this.control &&
      this.control.errors &&
      (this.control.dirty ||
        this.control.touched
        // this.control.parent.invalid
      )
    );
  }

  listOfErrors(): any {
    return Object.keys(this.control.errors).map((field) =>
      this.getMessage(field, this.control.errors[field], this.nomCampo)
    );
  }

  private getMessage(type: string, params: any, nomCampo: string) {
    switch (type) {
      case 'required':
        return ErrorMessageComponent.errorMessages.required(params, nomCampo);
        break;
      case 'minlength':
        return ErrorMessageComponent.errorMessages.minlength(params, nomCampo);
        break;
      case 'maxlength':
        return ErrorMessageComponent.errorMessages.maxlength(params, nomCampo);
        break;
      case 'max':
        return ErrorMessageComponent.errorMessages.max(params, nomCampo);
        break;
      case 'min':
        return ErrorMessageComponent.errorMessages.min(params, nomCampo);
        break;
      case 'defaultValue':
        return ErrorMessageComponent.errorMessages.defaultValue(
          params,
          nomCampo
        );
        break;
      case 'equalValidator':
        return ErrorMessageComponent.errorMessages.equalValidator(
          params,
          nomCampo
        );
      case 'email':
        return ErrorMessageComponent.errorMessages.email(params, nomCampo);
      case 'passwordValidator':
        return ErrorMessageComponent.errorMessages.passwordValidator(
          params,
          nomCampo
        );
      case 'horaValidator':
        return ErrorMessageComponent.errorMessages.horaValidator(
          params,
          nomCampo
        );
        break;
      default:
        return ErrorMessageComponent.errorMessages.codigoValidator(
          params,
          nomCampo
        );
        break;
    }
  }
}
