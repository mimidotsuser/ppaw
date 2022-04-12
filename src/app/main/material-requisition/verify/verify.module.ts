import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [
    CreateComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: IndexComponent},
      {
        path: ':id', component: CreateComponent,
        data: {title: 'Material Requisition Verification', breadcrumb: 'Verify'}
      }
    ]),
    SharedModule,
  ]
})
export class VerifyModule {}
