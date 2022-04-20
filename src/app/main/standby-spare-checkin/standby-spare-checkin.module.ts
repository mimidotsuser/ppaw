import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StandbySpareCheckinRoutingModule } from './standby-spare-checkin-routing.module';
import { StandbySpareCheckinComponent } from './standby-spare-checkin.component';


@NgModule({
  declarations: [
    StandbySpareCheckinComponent
  ],
  imports: [
    CommonModule,
    StandbySpareCheckinRoutingModule
  ]
})
export class StandbySpareCheckinModule { }
