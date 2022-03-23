import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faAngleRight, faAngleUp, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { RoleService } from '../services/role.service';
import { RoleModel } from '../../../models/role.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: []
})
export class IndexComponent implements OnInit, OnDestroy {

  private _roles: RoleModel[] = [];
  private _subscriptions: Subscription[] = [];
  searchControl: FormControl;
  faAngleRight = faAngleRight;
  faAngleUp = faAngleUp;
  faEllipsisV = faEllipsisV;
  pagination = {
    page: 1,
    limit: 15,
    total: 0
  };

  constructor(private roleService: RoleService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.subSink = this.roleService.fetchAll
      .subscribe((roles) => this._roles = roles);
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get roles(): RoleModel[] {
    return this._roles;
  }

  get isSearching() {
    return this.searchControl.value.trim().length > 0;
  }


  deleteRole(role: RoleModel) {
    this.subSink = this.roleService.destroy(role.id)
      .subscribe({
        next: () => {
          const index = this.roles.findIndex((row) => row.id === role.id);
          if (index > -1) {
            this.roles.splice(index, 1);
          }
        },
        error: (err) => {}
      })
  }

  togglePermissions($event: Event) {
    const target = ($event.target as HTMLButtonElement).closest('tr');
    const sibling = target?.nextElementSibling;
    if (!sibling) {return}

    if (target.closest('tbody')?.rows) { //hide any opened row
      const rows = target.closest('tbody')!.rows!;
      for (let i = 0; i < rows.length; i++) {
        rows.item(0)?.classList.remove('show')
      }
    }

    if (sibling.classList.contains('show')) {
      sibling.classList.remove('show');
      target.classList.remove('permissions-expanded')
    } else {
      sibling.classList.add('show');
      target.classList.add('permissions-expanded')
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}
