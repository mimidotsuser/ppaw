import { TestBed } from '@angular/core/testing';

import { StandbySpareCheckinService } from './standby-spare-checkin.service';

describe('StandySpareCheckinService', () => {
  let service: StandbySpareCheckinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandbySpareCheckinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
