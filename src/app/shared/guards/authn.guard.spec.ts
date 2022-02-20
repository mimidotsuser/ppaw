import { TestBed } from '@angular/core/testing';

import { AuthnGuard } from './authn.guard';

describe('AuthnGuard', () => {
  let guard: AuthnGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthnGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
