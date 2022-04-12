import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerSearchModule } from '../../../search/customer-search/customer-search.module';


@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),
    SharedModule,
    NgbDropdownModule,
    NgbPopoverModule,
    CustomerSearchModule,
    FontAwesomeModule,
  ]
})
export class ActivitiesModule {}
