import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create.component';


const routes: Routes = [
  { path: '', component: CreateComponent }
];

@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CreateModule { }
