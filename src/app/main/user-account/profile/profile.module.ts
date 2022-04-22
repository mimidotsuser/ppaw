import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: 'edit', component: EditComponent,
      data: {
        title: 'Edit My Profile', breadcrumb: 'Edit user account'
      }
    }]),
    SharedModule
  ]
})
export class ProfileModule {}
