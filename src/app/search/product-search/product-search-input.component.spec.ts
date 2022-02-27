import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchInputComponent } from './product-search-input.component';

describe('ProductSearchInputComponent', () => {
  let component: ProductSearchInputComponent;
  let fixture: ComponentFixture<ProductSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSearchInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
