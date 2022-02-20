import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFormComponent } from './role-form/role-form.component';


@NgModule({
  declarations: [
    RoleFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [RoleFormComponent]
})
export class FormsModule {}
