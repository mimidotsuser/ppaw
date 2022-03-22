import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { ProductSearchModule } from '../../../search/product-search/product-search.module';
import { CustomerSearchModule } from '../../../search/customer-search/customer-search.module';
import { SearchWorksheetModule } from '../../../search/search-worksheet/search-worksheet.module';
import { CreateComponent } from './create.component';


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: CreateComponent}]),
    SharedModule,
    ProductSearchModule,
    CustomerSearchModule,
    SearchWorksheetModule,
    FontAwesomeModule,
    NgbDropdownModule,
  ]
})
export class CreateModule {}
