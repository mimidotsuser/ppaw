import { Component, OnDestroy, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { RoleService } from '../services/role.service';
import { Subscription } from 'rxjs';
import { PermissionModel } from '../../../models/permission.model';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from '../../../models/role.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  model!: RoleModel;
  private _permissions: PermissionModel[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private permissionService: PermissionService,
              private roleService: RoleService, private router: Router) {

    this.subSink = this.roleService.findRoleById(this.route.snapshot.params[ 'id' ])
      .subscribe((role) => this.model = role);

    this.subSink = this.permissionService.fetchAll
      .subscribe((v) => this._permissions = v);

  }

  ngOnInit(): void {
  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get permissions(): PermissionModel[] {
    return this._permissions;
  }

  update(form: FormGroup) {

    form.markAllAsTouched();
    if (form.invalid) {return;}
    const data = form.value;

    data.permissions = (data.permissions as [{ id: string, selected: boolean }])
      .filter((c) => c.selected)
      .map((selected) => ({id: selected.id}));

    this.subSink = this.roleService.update(this.model.id, data)
      .subscribe(() => {
        this.router.navigate(['../../'], {relativeTo: this.route.parent})
      })

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
