import { TestBed } from '@angular/core/testing';

import { InspectionNoteService } from './inspection-note.service';

describe('Inspection Note Service', () => {
  let service: InspectionNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
