import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { RoleService } from '../services/role.service';
import { PermissionModel } from '../../../models/permission.model';
import { RoleModel } from '../../../models/role.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  formSubmissionBusy = false;
  private _permissions: PermissionModel[] = [];
  private _subscriptions: Subscription[] = [];
  model!: RoleModel;

  constructor(private route: ActivatedRoute, private permissionService: PermissionService,
              private roleService: RoleService, private router: Router,
              private toastService: ToastService) {

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
    this.formSubmissionBusy = true;
    data.permissions = (data.permissions as [{ id: string, selected: boolean }])
      .filter((c) => c.selected)
      .map((selected) => ({id: selected.id}));

    this.subSink = this.roleService.update(this.model.id, data)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.router.navigate(['../../'], {relativeTo: this.route.parent})
        },
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          if (err.status && err.status == 422) {
            message = err?.error && err.error?.message ? err.error.message : message;
          }

          this.toastService.show({message, type: 'danger'})
        }
      })

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
