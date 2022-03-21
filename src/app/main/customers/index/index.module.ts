import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../../shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetsModule as ClientWidgetsModule } from '../widgets/widgets.module';
import { IndexComponent } from './index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),
    SharedModule,
    FontAwesomeModule,
    NgbDropdownModule,
    ClientWidgetsModule
  ]
})
export class IndexModule {}
