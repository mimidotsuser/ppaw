import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSearchInputComponent } from './client-search-input.component';

describe('ClientSearchInputComponent', () => {
  let component: CustomerSearchInputComponent;
  let fixture: ComponentFixture<CustomerSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSearchInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
