import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EditComponent } from './edit.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '../forms/forms.module';

@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: EditComponent}]),
    SharedModule,
    FormsModule
  ]
})
export class EditModule {}
