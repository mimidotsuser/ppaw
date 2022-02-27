import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidePopupComponent } from './components/side-popup/side-popup.component';
import { MrfLogsTimelineComponent } from './components/mrf-logs-timeline/mrf-logs-timeline.component';

@NgModule({
  declarations: [
    ContentHeaderComponent,
    SidePopupComponent,
    MrfLogsTimelineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  exports: [
    ContentHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    SidePopupComponent,
    FontAwesomeModule,
    MrfLogsTimelineComponent
  ],
})
export class SharedModule {}
