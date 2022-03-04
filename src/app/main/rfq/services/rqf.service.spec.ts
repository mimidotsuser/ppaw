import { TestBed } from '@angular/core/testing';

import { RqfService } from './rqf.service';

describe('RqfService', () => {
  let service: RqfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RqfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
