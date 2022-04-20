import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create.component';
import { SharedModule } from '../../../shared/shared.module';
import {
  MaterialRequestSearchModule
} from '../../../search/material-request-search/material-request-search.module';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    MaterialRequestSearchModule
  ]
})
export class CreateModule {}
