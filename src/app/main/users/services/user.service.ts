import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { HttpService } from '../../../core/services/http.service';
import { UsersModule } from '../users.module';

@Injectable({providedIn: UsersModule})
export class UserService {

  private users$ = new BehaviorSubject<UserModel[]>([]);

  constructor(private http: HttpService) {
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
