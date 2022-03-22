import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidePopupComponent } from './components/side-popup/side-popup.component';
import { ActivityTimelineComponent } from './components/activity-timeline/activity-timeline.component';

@NgModule({
  declarations: [
    SidePopupComponent,
    ActivityTimelineComponent,
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
    ActivityTimelineComponent
  ],
})
export class SharedModule {}
