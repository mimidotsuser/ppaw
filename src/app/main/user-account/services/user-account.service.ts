import { Injectable } from '@angular/core';
import { UserAccountModule } from '../user-account.module';
import { HttpService } from '../../../core/services/http.service';
import { map, Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';

@Injectable({
  providedIn: UserAccountModule
})
export class UserAccountService {

  constructor(private httpService: HttpService) { }

  fetch(id: number): Observable<UserModel> {
    return this.httpService.get(`${this.httpService.endpoint.userProfile}/${id}`)
      .pipe(map((res: { data: UserModel }) => res.data));
  }

  update(id: number, payload: { first_name: string, last_name?: string }): Observable<UserModel> {
    return this.httpService.patch(`${this.httpService.endpoint.userProfile}/${id}`, payload)
      .pipe(map((res: { data: UserModel }) => res.data));
  }

  changePassword(id: number, payload: object): Observable<null> {
    return this.httpService.patch(`${this.httpService.endpoint.accountPassword}/${id}`, payload)
  }

}
