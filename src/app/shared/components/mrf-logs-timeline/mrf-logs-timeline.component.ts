import { Component, Input, OnInit } from '@angular/core';
import { MRFLog, MRFStage } from '../../../models/m-r-f.model';

@Component({
  selector: 'mrf-logs-timeline[model]',
  templateUrl: './mrf-logs-timeline.component.html',
  styleUrls: ['./mrf-logs-timeline.component.scss']
})
export class MrfLogsTimelineComponent implements OnInit {

  @Input() model: MRFLog[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
