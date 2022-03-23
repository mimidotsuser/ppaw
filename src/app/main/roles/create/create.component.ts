import { Component, OnDestroy, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { Subscription } from 'rxjs';
import { PermissionModel } from '../../../models/permission.model';
import { FormGroup } from '@angular/forms';
import { RoleService } from '../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  private _permissions: PermissionModel[] = [];

  constructor(private permissionService: PermissionService, private roleService: RoleService,
              private route: ActivatedRoute, private router: Router) {
    this.subSink = this.permissionService.fetchAll
      .subscribe((res) => {this._permissions = res})
  }

  ngOnInit(): void {
  }

  get permissions(): PermissionModel[] {
    return this._permissions;
  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  submit(form: FormGroup) {

    form.markAllAsTouched();
    if (form.invalid) {return}
    const data = form.value;

    data.permissions = (data.permissions as [{ id: string, selected: boolean }])
      .filter((c) => c.selected)
      .map((selected) => ({id: selected.id}));

    this.subSink = this.roleService.create(data)
      .subscribe(() => {
        this.router.navigate(['../'], {relativeTo: this.route.parent})
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
