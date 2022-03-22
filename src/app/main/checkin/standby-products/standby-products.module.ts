import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { Actions, Resources } from '../../../utils/permissions';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: CreateComponent,
      data: {resource: Resources.checkin, action: Actions.create, title: 'Products CheckIn'}
    }]),
    SharedModule,
  ]
})
export class StandbyProductsModule {}
