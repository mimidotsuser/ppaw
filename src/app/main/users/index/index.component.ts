import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../services/user.service';
import { SearchService } from '../../../shared/services/search.service';
import { RoleService } from '../../roles/services/role.service';
import { RoleModel } from '../../../models/role.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  usersSearchInput: FormControl;
  model: UserModel | null = null;
  showUserFormPopup = false;
  _users$!: Observable<UserModel[]>;

  constructor(private userService: UserService, private searchService: SearchService<UserModel>,
              private roleService: RoleService, private fb: FormBuilder) {
    this.searchService.setFields(['first_name', 'last_name', 'role.name']);
    this.usersSearchInput = this.fb.control('');
  }

  ngOnInit(): void {
    this._users$ = this.usersSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((value: any) => this.searchService.find(value, this.userService.users)))
  }

  get users() {
    return this._users$
  }

  get roles(): Observable<RoleModel[]> {
    return this.roleService.roles;
  }

  resolveUserStatus(id: number) {
    return this.userService.resolveUserStatus(id);
  }

  showCreateUserPopup() {
    this.showUserFormPopup = true;
    this.model = null;
  }

  showEditForm(model: UserModel) {
    this.model = {...model};
    this.showUserFormPopup = true;
  }

  closeFormPopup(form: FormGroup) {
    if (form.dirty) {
      //TODO warn the user
    }
    this.showUserFormPopup = false;
  }

  resendInvite(user: UserModel) {/*Todo*/}

  updateStatus(user: UserModel, suspend = true) {/*Todo*/}

  deleteUser(user: UserModel) {/*Todo*/}

  saveUserForm(form: FormGroup) { /*TODO*/}
}
