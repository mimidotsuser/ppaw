import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { RoleModel } from '../../../models/role.model';
import { PermissionService } from './permission.service';
import { PermissionModel } from '../../../models/permission.model';
import { HttpService } from '../../../core/services/http.service';
import { RolesModule } from '../roles.module';

@Injectable({
  providedIn: RolesModule
})
export class RoleService {

  private roles$ = new BehaviorSubject<RoleModel[]>([])

  constructor(private permissionService: PermissionService, private http: HttpService) {
    this.roles$.next([
      {
        id: 'fLJqYgH2yEOHjNz8',
        name: 'System admin',
        description: 'The overall admin',
        permissions: this.perms
      },
      {
        id: 'ImaMkvtYJ8aGhd9b',
        name: 'Field Engineer',
        description: 'The field engineer',
        permissions: this.perms,
      },
    ])
  }

  protected get perms(): PermissionModel[] {

    const t = this.permissionService.permissions.getValue().length;
    return this.permissionService.permissions.getValue().slice(0, Math.floor(Math.random() * (t)));
  }

  get roles(): Observable<RoleModel[]> {
    return this.roles$;
  }

  createRole(data: { name: string, description: string, permissions: string[] }): Observable<RoleModel> {
    return this.http.put('/roles', data);
  }

  findRoleById(id: string): Observable<RoleModel | null> {
    return this.roles$.pipe(map((roles: RoleModel[]) => roles.filter((role: RoleModel) => role.id === id)))
      .pipe(map((v) => v.length > 0 ? v[ 0 ] : null))
  }
}
