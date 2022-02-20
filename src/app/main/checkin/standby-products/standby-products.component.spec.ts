import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandbyProductsComponent } from './standby-products.component';

describe('StandbyProductsComponent', () => {
  let component: StandbyProductsComponent;
  let fixture: ComponentFixture<StandbyProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandbyProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandbyProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
