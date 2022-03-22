import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadSearchInputComponent } from './typeahead-search-input.component';

describe('Typeahead Search Input', () => {
  let component: TypeaheadSearchInputComponent<string>;
  let fixture: ComponentFixture<TypeaheadSearchInputComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeaheadSearchInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeaheadSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
