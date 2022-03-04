import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequestSearchComponent } from './purchase-request-search.component';

describe('PurchaseRequestSearchComponent', () => {
  let component: PurchaseRequestSearchComponent;
  let fixture: ComponentFixture<PurchaseRequestSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseRequestSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequestSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
