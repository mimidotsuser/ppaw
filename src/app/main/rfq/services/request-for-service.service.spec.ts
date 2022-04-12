import { TestBed } from '@angular/core/testing';

import { RequestForQuotationService } from './request-for-quotation.service';

describe('RqfService', () => {
  let service: RequestForQuotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestForQuotationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
