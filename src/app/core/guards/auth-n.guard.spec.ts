import { TestBed } from '@angular/core/testing';

import { AuthNGuard } from './auth-n.guard';

describe('AuthNGuard', () => {
  let guard: AuthNGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
