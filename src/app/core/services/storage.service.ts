import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  get token(): string {
    return window.localStorage.getItem('access_token') ?? '';
  }

  /**
   *
   * @param access_token
   */
  set token(access_token: string) {
    window.localStorage.setItem('access_token', access_token);
  }
}
