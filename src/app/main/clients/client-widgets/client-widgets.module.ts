import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientFormComponent } from './client-form/client-form.component';


@NgModule({
  declarations: [
    ClientFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ClientFormComponent
  ]
})
export class ClientWidgetsModule {}
