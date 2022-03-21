import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { Actions, Resources } from '../../../utils/permissions';


@NgModule({
  declarations: [
    CreateComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: IndexComponent,
        data: {resource: Resources.receivingReport, action: Actions.approve}
      },
      {
        path: 'create', component: CreateComponent,
        data: {resource: Resources.receivingReport, action: Actions.approve}
      }
    ]),
  ]
})
export class GrnAndRgaModule {}
