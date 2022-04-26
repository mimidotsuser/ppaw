import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterBarComponent } from './filter-bar/filter-bar.component';


@NgModule({
  declarations: [
    FilterBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [
    FilterBarComponent
  ]
})
export class WidgetsModule {}
