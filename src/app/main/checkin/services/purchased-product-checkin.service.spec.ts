import { TestBed } from '@angular/core/testing';

import { PurchasedProductCheckinService } from './purchased-product-checkin.service';

describe('PurchasedProductCheckinService', () => {
  let service: PurchasedProductCheckinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasedProductCheckinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
