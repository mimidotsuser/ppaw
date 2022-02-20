import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinApprovalComponent } from './checkin-approval.component';

describe('CheckinApprovalComponent', () => {
  let component: CheckinApprovalComponent;
  let fixture: ComponentFixture<CheckinApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
