import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { WidgetsModule as UserWidgetsModule } from '../widgets/widgets.module';
import { IndexComponent } from './index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),
    NgbDropdownModule,
    SharedModule,
    UserWidgetsModule
  ],
})
export class IndexModule {}
