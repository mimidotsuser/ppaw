import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ProductSerialModel } from '../../models/product-serial.model';

/***
 * Check if a serial num
 * @param serials
 */
export function uniqueProductSerial(serials: () => ProductSerialModel[])
  : (x: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {return null}
    const psm = control.value as ProductSerialModel;
    return serials().filter((v) => v.id === psm.id)
      .length < 2 ? null : {duplicated: true};
  }
}
