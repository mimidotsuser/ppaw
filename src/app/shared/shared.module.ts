import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidePopupComponent } from './components/side-popup/side-popup.component';
import {
  ActivityTimelineComponent
} from './components/activity-timeline/activity-timeline.component';
import { FilterPipe } from './pipes/filter.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatePipe } from './pipes/paginate.pipe';

@NgModule({
  declarations: [
    SidePopupComponent,
    ActivityTimelineComponent,
    FilterPipe,
    PaginatePipe,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbPaginationModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    SidePopupComponent,
    FontAwesomeModule,
    ActivityTimelineComponent,
    FilterPipe,
    PaginatePipe,
    PaginationComponent
  ],
})
export class SharedModule {}
