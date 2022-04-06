import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Actions, Resources } from '../../utils/permissions';
import { UserModel } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storageService: StorageService) {
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
}
