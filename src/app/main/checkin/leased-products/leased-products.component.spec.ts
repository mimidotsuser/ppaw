import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasedProductsComponent } from './leased-products.component';

describe('LeasedProductsComponent', () => {
  let component: LeasedProductsComponent;
  let fixture: ComponentFixture<LeasedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeasedProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
