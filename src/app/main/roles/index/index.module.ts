import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { IndexComponent } from './index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),
    NgbPaginationModule,
    SharedModule,
    NgbDropdownModule,
  ]
})
export class IndexModule {}
