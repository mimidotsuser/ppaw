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

  resolveStage(stage: number) {
    if (stage === MRFStage.CREATE) {
      return 'Request Application Stage';
    }
    if (stage === MRFStage.VERIFY) {
      return 'Request Verification Stage';
    }
    if (stage === MRFStage.APPROVE) {
      return 'Request Approval Stage';
    }
    if (stage === MRFStage.CHECKOUT) {
      return 'Request Checkout';
    }
    return 'Request Stage Unknown';
  }
}
