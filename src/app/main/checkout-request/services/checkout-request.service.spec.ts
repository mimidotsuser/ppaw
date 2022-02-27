import { TestBed } from '@angular/core/testing';

import { CheckoutRequestService } from './checkout-request.service';

describe('CheckoutRequestService', () => {
  let service: CheckoutRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
