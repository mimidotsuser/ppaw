import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.scss']
})
export class ActivityTimelineComponent<T> implements OnInit {
  /**
   * model: { remarks: string, created_at: string, created_by: UserModel }[]
   */
  @Input() model: any[];
  @Input() formatTitle: (T) => any;

  constructor() { }

  ngOnInit(): void {
  }

}
