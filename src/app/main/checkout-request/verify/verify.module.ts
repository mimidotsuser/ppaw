import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VerifyComponent } from './verify.component';


@NgModule({
  declarations: [
    VerifyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: VerifyComponent}])
  ]
})
export class VerifyModule {}
