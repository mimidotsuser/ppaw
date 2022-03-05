import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqSearchComponent } from './rfq-search.component';

describe('RfqSearchComponent', () => {
  let component: RfqSearchComponent;
  let fixture: ComponentFixture<RfqSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
