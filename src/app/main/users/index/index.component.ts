import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { UserAccountStatus, UserModel } from '../../../models/user.model';
import { UserService } from '../services/user.service';
import { RoleService } from '../../roles/services/role.service';
import { RoleModel } from '../../../models/role.model';
import { PaginationModel } from '../../../models/pagination.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;

  showUserFormPopup = false;
  loadingMainContent = false;
  formSubmissionBusy = false;
  selectedModel: UserModel | null = null;
  pagination: PaginationModel = {limit: 25, total: 0, page: 1};
  private _users: UserModel[] = [];
  private _roles: RoleModel[] = [];
  private _subscriptions: Subscription[] = [];
  searchControl: FormControl;

  constructor(private userService: UserService, private roleService: RoleService,
              private fb: FormBuilder, private toastService: ToastService) {
    this.searchControl = this.fb.control('');
    this.loadUsers();
  }

  ngOnInit(): void {
    this.subSink = this.roleService.fetchAll
      .subscribe((roles) => this._roles = roles)

    this.subSink = this.searchControl.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((v: string) => {
        this._users = [];  //very important
        this.pagination.total = 0;
        this.loadUsers();
      })
  }

  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get users() {
    return this._users
  }

  get roles(): RoleModel[] {
    return this._roles;
  }

  get statuses() {
    return UserAccountStatus;
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  loadUsers() {
    if (this.tableCountEnd <= this._users.length) {return;}
    let params = {}
    if (this.searchControl?.value && this.searchControl.value.trim()) {
      params = {search: this.searchControl.value.trim()};
    }

    this.loadingMainContent = true;
    this.subSink = this.userService.fetch({...this.pagination, ...params, include: 'role'})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this._users = this._users.concat(res.data);
          this.pagination.total = res.total;
        },
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          this.toastService.show({message, type: 'danger'})
        }
      })
  }

  resolveUserStatus(code: keyof typeof UserAccountStatus): string {
    return this.statuses[ code ] || 'Unknown';
  }

  resolveStatusIconClass(status: keyof typeof UserAccountStatus) {
    if (status == 'SUSPENDED') {
      return 'bg-danger'
    }
    if (status == 'ACTIVE') {
      return 'bg-success'
    }
    if (status == 'PENDING_ACTIVATION') {
      return 'bg-warning'
    }
    return 'bg-secondary';
  }

  showCreateUserPopup() {
    this.selectedModel = null;
    this.showUserFormPopup = true;
  }

  showEditForm(model: UserModel) {
    this.selectedModel = {...model};
    this.showUserFormPopup = true;
  }

  closeFormPopup(form: FormGroup) {
    if (form.dirty && !window.confirm('You will loose all unsaved data.')) {
      return;
    }
    form.reset();
    this.showUserFormPopup = false;
  }


  submitUserForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {return}

    this.formSubmissionBusy = true;
    if (this.selectedModel?.id) {
      this.subSink = this.userService.update(this.selectedModel!.id, form.value)
        .pipe(finalize(() => this.formSubmissionBusy = false))
        .subscribe({
          next: (user) => {
            const index = this.users.findIndex((u) => u.id === user.id);
            if (index > -1) {
              this.users[ index ] = user;
            }
            form.reset();
            this.showUserFormPopup = false;
            this.toastService.show({message: 'User account updated successfully', delay: 3000})
          }, error: (err) => {
            let message = 'Unexpected error encountered. Please try again';
            if (err.status && err.status == 403) {
              message = 'You do not have required permissions to perform the action';
            }
            if (err.status && err.status == 422) {
              message = err?.error && err.error?.message ? err.error.message : message;
            }

            this.toastService.show({message, type: 'danger'})
          }
        });
      return;
    }

    this.subSink = this.userService.create(form.value)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: (user) => {
          this.users.unshift(user);
          form.reset();
          this.showUserFormPopup = false;
          this.toastService.show({message: 'User account created successfully', delay: 3000})
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

  resendInvite(user: UserModel) {
    this.subSink = this.userService.resendInvite(user)
      .subscribe({
        next: () => {this.toastService.show({message: 'Invite sent successfully'})},
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          this.toastService.show({message, type: 'danger'})
        }
      })
  }

  updateStatus(model: UserModel, suspend = true) {
    model.status = suspend ? 'SUSPENDED' : 'ACTIVE';
    this.subSink = this.userService.update(model.id, model)
      .subscribe({
        next: (user) => {
          const index = this.users.findIndex((u) => u.id === user.id);
          if (index > -1) {
            this.users[ index ] = user;
          }
          this.toastService.show({message: 'User account status updated successfully', delay: 3000})
        },
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          this.toastService.show({message, type: 'danger'})
        }
      })
  }

  deleteUser(model: UserModel) {
    this.subSink = this.userService.destroy(model.id)
      .subscribe({
        next: () => {
          const index = this.users.findIndex((u) => u.id === model.id);
          if (index > -1) {
            this.users.splice(index, 1);
          }
          this.toastService.show({message: 'User account deleted successfully'});
        },
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          this.toastService.show({message, type: 'danger'})
        }
      })
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }


}
