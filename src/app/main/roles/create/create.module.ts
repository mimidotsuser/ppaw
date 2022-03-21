import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { CreateComponent } from './create.component';
import { WidgetsModule as RoleWidgetsModule } from '../widgets/widgets.module';

@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    RoleWidgetsModule
  ]
})
export class CreateModule {}
