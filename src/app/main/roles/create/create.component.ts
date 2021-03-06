import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { PermissionModel } from '../../../models/permission.model';
import { RoleService } from '../services/role.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  formSubmissionBusy = false;
  private _subscriptions: Subscription[] = [];
  private _permissions: PermissionModel[] = [];

  constructor(private permissionService: PermissionService, private roleService: RoleService,
              private route: ActivatedRoute, private router: Router,
              private toastService: ToastService) {
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
    this.formSubmissionBusy = true;
    data.permissions = (data.permissions as [{ id: string, selected: boolean }])
      .filter((c) => c.selected)
      .map((selected) => ({id: selected.id}));

    this.subSink = this.roleService.create(data)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.router.navigate(['../'], {relativeTo: this.route.parent})
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
