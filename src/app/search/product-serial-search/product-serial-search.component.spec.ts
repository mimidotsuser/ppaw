import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSerialSearchComponent } from './product-serial-search.component';

describe('ProductSerialSearchComponent', () => {
  let component: ProductSerialSearchComponent;
  let fixture: ComponentFixture<ProductSerialSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSerialSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSerialSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
