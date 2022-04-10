import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './index.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),
    SharedModule,
    NgbDropdownModule
  ]
})
export class IndexModule {}
