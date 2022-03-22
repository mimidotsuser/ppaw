import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RoleModel } from '../../../models/role.model';
import { HttpService } from '../../../core/services/http.service';
import { RolesModule } from '../roles.module';

@Injectable({
  providedIn: RolesModule
})
export class RoleService {


  constructor(private httpService: HttpService) {}

  get fetchAll(): Observable<RoleModel[]> {
    return this.httpService.get(this.httpService.endpoint.roles, {params: {include: 'permissions'}})
      .pipe(map((res: { data: RoleModel[] }) => res.data))
  }

  createRole(data: { name: string, description: string, permissions: string[] }): Observable<RoleModel> {
    return this.httpService.post(this.httpService.endpoint.roles, data)
      .pipe(map((res: { data: RoleModel }) => res.data))
  }

  findRoleById(id: string): Observable<RoleModel | null> {
    return this.httpService.get(`${this.httpService.endpoint.roles}/${id}`)
      .pipe(map((res: { data: RoleModel }) => res.data))
  }
}
