import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { shallowEqual } from '../utils';

/**
 *
 */
export function arrayUnique(): (x: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {return null}

    return !!control.parent && !!control.parent.parent &&
    !!control.parent.parent.controls &&
    isUnique(control, control.parent.parent.controls as AbstractControl[])
      ? null : {duplicated: true}
  }
}

function isUnique(control: AbstractControl, formArray: AbstractControl[]): boolean {
  if (formArray.length <= 1) {return true}
  const name = getControlName(control);

  //go through all form groups and filter where control value matches
  return formArray.filter((group: AbstractControl) => {
    return shallowEqual(group.get(name)?.value, control.value);
  }).length < 2; //if, only single match is found, then it's unique
}

function getControlName(control: AbstractControl): string {
  return Object.keys(control.parent!.controls)
    .find((name) => control === (control!.parent! as FormGroup).controls![ name ]) || '';
}
