import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function requiredIf(required: boolean): (x: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    return !required || (required && Validators.required(control) === null) ? null : {required: true}
  }
}
