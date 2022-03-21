import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFormComponent } from './role-form/role-form.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    RoleFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    RoleFormComponent
  ]
})
export class WidgetsModule {}
