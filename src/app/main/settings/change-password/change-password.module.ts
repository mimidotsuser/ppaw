import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';


@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ChangePasswordComponent}])
  ]
})
export class ChangePasswordModule {}
