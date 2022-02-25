import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparesComponent } from './spares.component';

describe('SparesComponent', () => {
  let component: SparesComponent;
  let fixture: ComponentFixture<SparesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
