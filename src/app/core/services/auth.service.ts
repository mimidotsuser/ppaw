import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Actions, Resources } from '../../utils/permissions';
import { UserModel } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storageService: StorageService, private route: ActivatedRoute,
              private router: Router) {
    this.storageService.userAccountCleared.subscribe({
      next: (exists) => {
        if (!exists) {
          //navigate to login
          this.redirectToSystemLoginPage(this.router.url)
        } else {
          //if on login page, redirect to main
          if (window.location.pathname == '/' || window.location.pathname.length == 0) {
            this.redirectToMainSystemPage();
          }
        }
      }
    })
  }

  set user(model) {
    this.storageService.user = model;
  }

  get user(): UserModel | null {
    return this.storageService.user;
  }

  can(resource: keyof typeof Resources, action: keyof typeof Actions): boolean {
    if (!this.user?.role?.permissions) {return false}
    return this.user?.role.permissions
      .findIndex((perm) => perm.name === `${resource}.${action}`) > -1
  }

  redirectToSystemLoginPage(previousPath?: string) {
    this.router.navigateByUrl(`/login?src=${previousPath || ''}`);
  }

  redirectToMainSystemPage() {
    if (this.route.snapshot.queryParamMap.get('src')) {
      this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('src')!);
    } else {
      this.router.navigateByUrl('/main')
    }
  }
}
