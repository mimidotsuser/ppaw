import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrfLogsTimelineComponent } from './mrf-logs-timeline.component';

describe('MrfLogsTimelineComponent', () => {
  let component: MrfLogsTimelineComponent;
  let fixture: ComponentFixture<MrfLogsTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrfLogsTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrfLogsTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
