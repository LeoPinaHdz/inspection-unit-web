import { AbstractControl, ValidationErrors } from "@angular/forms";

export function noSpacesValidator(control: AbstractControl) : ValidationErrors | null {

  if((control.value.toString()).indexOf(' ') >= 0) {
      return { noSpaces: true}
  }

  return null;
};
