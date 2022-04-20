import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandbySpareCheckinComponent } from './standby-spare-checkin.component';

describe('StandbySpareCheckinComponent', () => {
  let component: StandbySpareCheckinComponent;
  let fixture: ComponentFixture<StandbySpareCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandbySpareCheckinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandbySpareCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
