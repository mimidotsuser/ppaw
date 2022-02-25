import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareFormComponent } from './spare-form.component';

describe('SpareFormComponent', () => {
  let component: SpareFormComponent;
  let fixture: ComponentFixture<SpareFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpareFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
