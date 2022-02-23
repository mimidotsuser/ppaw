import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PermissionModel } from '../../../models/permission.model';
import { FormGroup } from '@angular/forms';
import { RoleService } from '../services/role.service';
import { RoleModel } from '../../../models/role.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private permissionService: PermissionService, private roleService: RoleService) { }

  ngOnInit(): void {
  }

  get permissions(): Observable<PermissionModel[]> {
    return this.permissionService.permissions;
  }

  submit(form: FormGroup) {

    form.markAllAsTouched();
    if (form.valid) {
      const data = form.value;
      data.permissions = (data.permissions as [{ title: string, id: string, selected: boolean }])
        .filter((c) => c.selected)
        .reduce((a: string[], v: { title: string, id: string, selected: boolean }) => {
          a.push(v.id);
          return a;
        }, []);


      //TODO submit the data
     // this.roleService.createRole(data)

    }

  }
}
