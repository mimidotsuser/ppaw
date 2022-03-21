import { TestBed } from '@angular/core/testing';

import { StockBalanceService } from './stock-balance.service';

describe('StockLedgerService', () => {
  let service: StockBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
