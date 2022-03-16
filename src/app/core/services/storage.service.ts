import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user.model';

@Injectable()
export class StorageService {

  constructor() { }

  get user(): UserModel | null {
    const u = window.localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  /**
   *
   * @param user
   */
  set user(user: UserModel | null) {
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
  }
}
