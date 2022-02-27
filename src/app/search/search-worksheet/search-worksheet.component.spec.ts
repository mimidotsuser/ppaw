import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWorksheetComponent } from './search-worksheet.component';

describe('SearchWorksheetComponent', () => {
  let component: SearchWorksheetComponent;
  let fixture: ComponentFixture<SearchWorksheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchWorksheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
