import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ProductWidgetsModule } from '../product-widgets/product-widgets.module';
import { SparesComponent } from './spares.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    SparesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: SparesComponent}]),
    SharedModule,
    FontAwesomeModule,
    NgbDropdownModule,
    ProductWidgetsModule
  ]
})
export class SparesModule {}
