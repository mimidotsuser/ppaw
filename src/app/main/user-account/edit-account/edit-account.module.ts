import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EditAccountComponent } from './edit-account.component';


@NgModule({
  declarations: [
    EditAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: EditAccountComponent}])
  ]
})
export class EditAccountModule {}
