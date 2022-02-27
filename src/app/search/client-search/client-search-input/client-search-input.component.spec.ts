import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSearchInputComponent } from './client-search-input.component';

describe('ClientSearchInputComponent', () => {
  let component: ClientSearchInputComponent;
  let fixture: ComponentFixture<ClientSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSearchInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
