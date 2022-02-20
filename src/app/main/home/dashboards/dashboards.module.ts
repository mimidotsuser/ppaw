import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardsComponent } from './dashboards.component';


@NgModule({
  declarations: [
    DashboardsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: DashboardsComponent}])
  ]
})
export class DashboardsModule {}
