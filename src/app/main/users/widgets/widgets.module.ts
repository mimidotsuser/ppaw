import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UserFormComponent } from './user-form/user-form.component';


@NgModule({
  declarations: [
    UserFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [UserFormComponent]
})
export class WidgetsModule {}
