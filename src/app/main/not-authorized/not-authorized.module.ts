import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotAuthorizedComponent } from './not-authorized.component';


@NgModule({
  declarations: [
    NotAuthorizedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: NotAuthorizedComponent}])
  ]
})
export class NotAuthorizedModule {}
