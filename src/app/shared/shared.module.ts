import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidePopupComponent } from './components/side-popup/side-popup.component';
import {
  ActivityTimelineComponent
} from './components/activity-timeline/activity-timeline.component';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    SidePopupComponent,
    ActivityTimelineComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    SidePopupComponent,
    FontAwesomeModule,
    ActivityTimelineComponent,
    FilterPipe
  ],
})
export class SharedModule {}
