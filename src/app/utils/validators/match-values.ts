import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchValues(matchTo: string): (x: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    return !!control.parent && !!control.parent.value &&
    control.value === (control.parent.controls as { [ key: string ]: AbstractControl })
      [ matchTo ].value ? null : {noMatch: true}
  }
}
