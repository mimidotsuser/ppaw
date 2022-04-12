import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    IndexComponent,
    ShowComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: ':id', component: ShowComponent},
      {path: '', component: IndexComponent},
    ]),
    SharedModule,
    NgbDropdownModule
  ]
})
export class HistoryModule {}
