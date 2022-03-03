import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'activity-timeline[model]',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.scss']
})
export class ActivityTimelineComponent implements OnInit {
  /**
   * model: { remarks: string, created_at: string, created_by: UserModel }[]
   */
  @Input() model!: any[];
  @Input() formatTitle: (item: any) => any = (item) => {item.stage || ''}

  constructor() { }

  ngOnInit(): void {
  }

}
