import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { HttpService } from '../../../core/services/http.service';
import { UsersModule } from '../users.module';
import { HttpResponseModel } from '../../../models/response.model';

@Injectable({providedIn: UsersModule})
export class UserService {


  constructor(private httpService: HttpService) {
  }

  fetch(params: object = {include: 'role'}): Observable<HttpResponseModel<UserModel>> {
    return this.httpService
      .get(this.httpService.endpoint.users, {params: {...params}})
  }

  create(data: UserModel): Observable<UserModel> {
    return this.httpService.post(this.httpService.endpoint.users, data)
      .pipe(map((res: { data: UserModel }) => res.data))
  }

  update(id: number, data: UserModel): Observable<UserModel> {
    return this.httpService.patch(`${this.httpService.endpoint.users}/${id}`, data)
      .pipe(map((res: { data: UserModel }) => res.data))
  }

  resendInvite(user: UserModel) {
    const path = this.httpService.endpoint.resentInvite
      .replace(':id', user.id.toString());
    return this.httpService.post(path, {})
  }

  destroy(id: number) {
    return this.httpService.destroy(
      `${this.httpService.endpoint.users}/${id}`);
  }
}
