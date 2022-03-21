import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { WidgetsModule as ProductWidgetsModule } from '../widgets/widgets.module';
import { SparesComponent } from './spares.component';


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
