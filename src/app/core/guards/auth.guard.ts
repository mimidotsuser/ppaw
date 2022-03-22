import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpService } from '../services/http.service';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private httpService: HttpService, private router: Router,
              private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean |
    UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !!this.authService.user && this.httpService
      .post(this.httpService.endpoint.authenticated, {}, {observe: 'response'})
      .pipe(map((res: HttpResponse<Object>) => res.status == 200))
      .pipe(catchError(x => of(this.router.parseUrl(`/login?src=${state.url}`))));
  }


  canActivateChild(
    childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!childRoute.data[ 'resource' ] || !childRoute.data[ 'action' ]) {
      return true
    }
    return this.authService.can(childRoute.data[ 'resource' ], childRoute.data[ 'action' ])
      ? true : this.router.parseUrl('/main/not-authorized');
  }

}
