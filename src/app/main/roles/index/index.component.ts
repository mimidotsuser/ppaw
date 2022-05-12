import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, Subscription } from 'rxjs';
import { faAngleRight, faAngleUp, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { RoleService } from '../services/role.service';
import { RoleModel } from '../../../models/role.model';
import { PaginationModel } from '../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: []
})
export class IndexComponent implements OnInit, OnDestroy {

  faAngleRight = faAngleRight;
  faAngleUp = faAngleUp;
  faEllipsisV = faEllipsisV;
  loadingMainContent = false;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0};
  private _roles: RoleModel[] = [];
  private _subscriptions: Subscription[] = [];
  searchControl: FormControl;

  constructor(private roleService: RoleService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
    this.loadRoles();
  }

  ngOnInit(): void {
    this.subSink = this.searchControl.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((v: string) => {
        this._roles = [];  //very important
        this.pagination.total = 0;
        this.loadRoles();
      })
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get roles(): RoleModel[] {
    return this._roles;
  }


  loadRoles() {
    if (this.tableCountEnd <= this._roles.length
      || (this._roles.length === this.pagination.total && this.pagination.total !== 0)) {return;}

    let params = {}
    if (this.searchControl?.value && this.searchControl.value.trim()) {
      params = {search: this.searchControl.value.trim()};
    }

    this.loadingMainContent = true;
    this.subSink = this.roleService.fetch({...params, ...this.pagination})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((roles) => {
        this._roles = roles;
        this.pagination.total = roles.length;
      });
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
