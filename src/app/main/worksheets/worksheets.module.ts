import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorksheetsRoutingModule } from './worksheets-routing.module';
import { WorksheetsComponent } from './worksheets.component';


@NgModule({
  declarations: [
    WorksheetsComponent
  ],
  imports: [
    CommonModule,
    WorksheetsRoutingModule
  ]
})
export class WorksheetsModule { }
