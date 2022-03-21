import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../../shared/shared.module';
import { WidgetsModule as ProductWidgetsModule } from '../widgets/widgets.module';
import { MachinesComponent } from './machines.component';


@NgModule({
  declarations: [
    MachinesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: MachinesComponent}]),
    SharedModule,
    NgbDropdownModule,
    FontAwesomeModule,
    ProductWidgetsModule
  ]
})
export class MachinesModule {}
