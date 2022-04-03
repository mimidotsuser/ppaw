import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionNoteRoutingModule } from './inspection-note-routing.module';
import { InspectionNoteComponent } from './inspection-note.component';


@NgModule({
  declarations: [
    InspectionNoteComponent
  ],
  imports: [
    CommonModule,
    InspectionNoteRoutingModule
  ]
})
export class InspectionNoteModule { }
