import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemSearchComponent } from './product-item-search.component';

describe('ProductSerialSearchComponent', () => {
  let component: ProductItemSearchComponent;
  let fixture: ComponentFixture<ProductItemSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductItemSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
