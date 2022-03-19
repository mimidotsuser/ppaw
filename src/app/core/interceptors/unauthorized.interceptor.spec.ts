import { TestBed } from '@angular/core/testing';

import { UnauthenticatedInterceptor } from './unauthenticated-interceptor.service';

describe('UnauthorizedInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UnauthenticatedInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UnauthenticatedInterceptor = TestBed.inject(UnauthenticatedInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
