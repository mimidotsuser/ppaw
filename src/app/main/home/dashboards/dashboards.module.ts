import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardsComponent } from './dashboards.component';


@NgModule({
  declarations: [
    DashboardsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: DashboardsComponent}]),
    NgChartsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardsModule {}
