import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { UsersModule } from '../users.module';
import { UserModel } from '../../../models/user.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({providedIn: UsersModule})
export class UserService {

  private users$ = new BehaviorSubject<UserModel[]>([]);

  constructor(private http: HttpService) {
    this.users$.next([
      {id: '7LjKQIz7QB3ncq',}
    ])
  }

  get users(): Observable<UserModel[]> {
    return this.users$;
  }
}
