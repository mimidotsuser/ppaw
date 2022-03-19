import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UnauthenticatedInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(catchError((selector, caught) => {
        if (selector instanceof HttpErrorResponse && selector.status === 401 &&
          window.location.pathname !== '/' && //ignore login page
          !window.location.pathname.toLowerCase().includes('/login')) {
          const src = window.location.href.replace(window.location.origin, '');
          this.router.navigateByUrl(`/login?src=${src}`, {replaceUrl: true});
        }
        return throwError(selector);
      }))
  }
}
