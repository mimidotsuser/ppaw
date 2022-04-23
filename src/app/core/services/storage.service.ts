import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class StorageService {

  private _userAccountCleared: Subject<boolean> = new Subject<boolean>();
  private cache: { [ key: string ]: any } = {};

  constructor() {
    this.storageChangesListener();
  }

  get user(): UserModel | null {
    if (this.cache[ 'user' ]) {return this.cache[ 'user' ]}
    const u = window.localStorage.getItem('user');

    if (u) {
      this.cache[ 'user' ] = JSON.parse(u);
      return this.cache[ 'user' ];
    }
    return null;
  }

  /**
   *
   * @param user
   */
  set user(user: UserModel | null) {
    this.cache[ 'user' ] = user;
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
