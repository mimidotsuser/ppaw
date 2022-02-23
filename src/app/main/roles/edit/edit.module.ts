import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EditComponent } from './edit.component';
import { SharedModule } from '../../../shared/shared.module';
import { RoleWidgetsModule } from '../role-widgets/role-widgets.module';

@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: EditComponent}]),
    SharedModule,
    RoleWidgetsModule
  ]
})
export class EditModule {}
