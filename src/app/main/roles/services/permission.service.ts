import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RolesModule } from '../roles.module';
import { PermissionModel } from '../../../models/permission.model';

@Injectable({
  providedIn: RolesModule
})
export class PermissionService {

  private _permissions$ = new BehaviorSubject<PermissionModel[]>([])

  constructor() {
    this._permissions$.next([
      {
        id: 'Z53oe794irZnOtZ5',
        group: 'Roles',
        name: 'can_add_role',
        description: 'Can create new role'
      },
      {id: 'Z53oe794irdwOtZ5', group: 'Roles', name: 'can_edit_role', description: 'Can edit role'},
      {id: 'Z53oe794irdwdetZ5', group: 'Roles', name: 'can_delete_role', description: ''},
      {
        id: 'IYm0BCU4ci0eP2Dd',
        group: 'Users',
        name: 'can_add_user',
        description: 'Can create staff account'
      },
      {id: 'IYm0BCU4cq0eP2ed', group: 'Users', name: 'can_edit_user', description: ''},
      {id: 'hqB5UbDoX8oW30Pe', group: 'Products', name: 'can_add_product', description: ''},
    ])
  }

  get permissions(): BehaviorSubject<PermissionModel[]> {
    return this._permissions$;
  }

}
