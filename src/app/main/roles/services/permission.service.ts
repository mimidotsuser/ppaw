import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { PermissionModel } from '../../../models/permission.model';
import { RolesModule } from '../roles.module';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: RolesModule
})
export class PermissionService {

  constructor(private httpService: HttpService) {
  }

  get fetchAll(): Observable<PermissionModel[]> {
    return this.httpService.get(this.httpService.endpoint.permissions)
      .pipe(map((res: { data: PermissionModel[] }) => res.data));
  }

}
