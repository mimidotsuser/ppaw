import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { RoleService } from '../services/role.service';
import { Observable } from 'rxjs';
import { PermissionModel } from '../../../models/permission.model';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleModel } from '../../../models/role.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  model: Observable<RoleModel | null>;

  constructor(private route: ActivatedRoute, private permissionService: PermissionService,
              private roleService: RoleService) {
    this.model = this.roleService.findRoleById(this.route.snapshot.params[ 'id' ]);
  }

  ngOnInit(): void {
  }

  get permissions(): Observable<PermissionModel[]> {
    return this.permissionService.permissions;
  }

  update(form: FormGroup) {

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
