import { TestBed } from '@angular/core/testing';

import { StockLedgerService } from './stock-ledger.service';

describe('StockLedgerService', () => {
  let service: StockLedgerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockLedgerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
