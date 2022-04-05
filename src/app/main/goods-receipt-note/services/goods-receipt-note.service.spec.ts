import { TestBed } from '@angular/core/testing';

import { GoodsReceiptNoteService } from './goods-receipt-note.service';

describe('GoodsReceiptNoteService', () => {
  let service: GoodsReceiptNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsReceiptNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
