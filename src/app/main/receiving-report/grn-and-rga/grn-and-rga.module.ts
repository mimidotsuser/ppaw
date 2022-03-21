import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    CreateComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: IndexComponent},
      {path: 'create', component: CreateComponent}
    ]),
  ]
})
export class GrnAndRgaModule {}
