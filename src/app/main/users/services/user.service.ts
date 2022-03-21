import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { HttpService } from '../../../core/services/http.service';
import { UsersModule } from '../users.module';

@Injectable({providedIn: UsersModule})
export class UserService {

  private users$ = new BehaviorSubject<UserModel[]>([]);

  constructor(private http: HttpService) {
    this.users$.next([
      {
        id: Math.random().toString(32).substr(3),
        first_name: 'James',
        last_name: 'Mokami',
        email: 'james@email.com',
        role: {
          id: 'fLJqYgH2yEOHjNz8',
          name: 'System admin',
          description: 'The overall admin',
          permissions: []
        },
        role_id: 'fLJqYgH2yEOHjNz8',
        status: 1
      },
      {
        id: Math.random().toString(32).substr(3),
        first_name: 'Leonard',
        last_name: 'Wachira',
        email: 'eachira@email.com',
        role: {
          id: 'ImaMkvtYJ8aGhd9b',
          name: 'Field Engineer',
          description: 'The field engineer',
          permissions: [],
        },
        role_id: 'ImaMkvtYJ8aGhd9b',
        status: 0
      },
      {
        id: Math.random().toString(32).substr(3),
        first_name: 'Jane',
        last_name: 'Waithera',
        email: 'janew@email.com',
        role: {
          id: 'ImaMkvtYJ8aGhd9b',
          name: 'Field Engineer',
          description: 'The field engineer',
          permissions: [],
        },
        role_id: 'ImaMkvtYJ8aGhd9b',
        status: 2
      },
    ])
  }

  get users(): Observable<UserModel[]> {
    return this.users$;
  }

  resolveUserStatus(d: number): string {
    if (d === 0) {
      return 'Pending Activation'
    }
    if (d === 1) {
      return 'Active'
    }
    if (d === 2) {
      return 'Suspended'
    }
    return 'Unknown'
  }
}
