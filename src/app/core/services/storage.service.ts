import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class StorageService {

  private _userAccountCleared: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.storageChangesListener();
  }

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

  get userAccountCleared(): Observable<boolean> {
    return this._userAccountCleared;
  }

  private storageChangesListener() {
    window.addEventListener('storage', () => {
      if (!this.user) {
        this._userAccountCleared.next(false);
      } else {
        this._userAccountCleared.next(true);
      }
    })
  }
}
