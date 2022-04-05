import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule
  ]
})
export class CreateModule {}
