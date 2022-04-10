import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShowComponent } from './show.component';


@NgModule({
  declarations: [
    ShowComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ShowComponent}])
  ]
})
export class ShowModule {}
