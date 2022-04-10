import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContractFormComponent } from './customer-contract-form.component';

describe('CustomerContractFormComponent', () => {
  let component: CustomerContractFormComponent;
  let fixture: ComponentFixture<CustomerContractFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerContractFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerContractFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
