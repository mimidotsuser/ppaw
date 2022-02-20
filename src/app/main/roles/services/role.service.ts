import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { RolesModule } from '../roles.module';
import { RoleModel } from '../../../models/role.model';
import { PermissionService } from './permission.service';
import { PermissionModel } from '../../../models/permission.model';

@Injectable({
  providedIn: RolesModule
})
export class RoleService {

  private roles$ = new BehaviorSubject<RoleModel[]>([])

  constructor(private permissionService: PermissionService) {
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

}
