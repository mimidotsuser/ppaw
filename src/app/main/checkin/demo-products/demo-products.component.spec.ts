import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoProductsComponent } from './demo-products.component';

describe('DemoProductsComponent', () => {
  let component: DemoProductsComponent;
  let fixture: ComponentFixture<DemoProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
