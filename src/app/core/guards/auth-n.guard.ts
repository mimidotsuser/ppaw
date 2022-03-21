import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpService} from "../services/http.service";
import {HttpResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthNGuard implements CanActivate {
    constructor(private httpService: HttpService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean |
        UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.httpService.post('/auth/is-authenticated', {},
            {observe: 'response'})
            .pipe(map((res: HttpResponse<Object>) => res.status == 200))
            .pipe(catchError(x => of(this.router.parseUrl(`/login?src=${state.url}`))));
    }

}
