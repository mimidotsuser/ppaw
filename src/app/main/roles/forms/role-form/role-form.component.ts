import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { map, Observable } from 'rxjs';
import { PermissionModel } from '../../../../models/permission.model';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  constructor(private permissionService: PermissionService) { }

  ngOnInit(): void {
  }

  get permissions(): Observable<{ group: string, permissions: PermissionModel[] }[]> {
    return this.permissionService.permissions.pipe(map((p: PermissionModel[]) => {
      return p.reduce((acc: { group: string, permissions: PermissionModel[] }[], value) => {
        const obj = acc.find((p) => p.group === value.group);
        if (obj) {
          obj.permissions.push(value);
        } else {
          acc.push({group: value.group, permissions: [value]})
        }
        return acc
      }, [])
    }))
  }
}
