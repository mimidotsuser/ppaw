import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequestSearchComponent } from './material-request-search.component';

describe('MaterialRequestSearchComponent', () => {
  let component: MaterialRequestSearchComponent;
  let fixture: ComponentFixture<MaterialRequestSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRequestSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequestSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
