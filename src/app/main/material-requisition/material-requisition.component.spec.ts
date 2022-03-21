import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequisitionComponent } from './material-requisition.component';

describe('CheckoutRequestComponent', () => {
  let component: MaterialRequisitionComponent;
  let fixture: ComponentFixture<MaterialRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRequisitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
