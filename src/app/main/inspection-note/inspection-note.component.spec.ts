import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionNoteComponent } from './inspection-note.component';

describe('Inspection Note Component', () => {
  let component: InspectionNoteComponent;
  let fixture: ComponentFixture<InspectionNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
