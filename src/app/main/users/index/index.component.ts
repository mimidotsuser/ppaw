import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { UserAccountStatus, UserModel } from '../../../models/user.model';
import { UserService } from '../services/user.service';
import { RoleService } from '../../roles/services/role.service';
import { RoleModel } from '../../../models/role.model';
import { finalize, Subscription } from 'rxjs';
import { PaginationModel } from '../../../models/pagination.model';

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
  pagination: PaginationModel = {limit: 15, total: 0, page: 1};
  private _users: UserModel[] = [];
  private _roles: RoleModel[] = [];
  private _subscriptions: Subscription[] = [];
  searchControl: FormControl;

  constructor(private userService: UserService, private roleService: RoleService,
              private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
    this.loadUsers();
  }

  ngOnInit(): void {
    this.subSink = this.roleService.fetchAll
      .subscribe((roles) => this._roles = roles)
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

    this.loadingMainContent = true;
    this.subSink = this.userService.fetchAll
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((users) => this._users = users)
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


  saveUserForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {return}

    this.formSubmissionBusy = true;
    if (this.selectedModel?.id) {
      this.subSink = this.userService.update(this.selectedModel!.id, form.value)
        .pipe(finalize(() => this.formSubmissionBusy = false))
        .subscribe((user) => {
          const index = this.users.findIndex((u) => u.id === user.id);
          if (index > -1) {
            this.users[ index ] = user;
          }
          form.reset();
          this.showUserFormPopup = false;
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
        }
      })
  }

  resendInvite(user: UserModel) {
    this.subSink = this.userService.resendInvite(user)
      .subscribe({
        next: () => {alert('Invite sent successfully')}
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

          alert('User status updated successfully');
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

          alert('User account deleted successfully');
        }
      })
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }


}
