import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RoleService } from '../services/role.service';
import { SearchService } from '../../../shared/services/search.service';
import { RoleModel } from '../../../models/role.model';
import { debounceTime, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [SearchService]
})
export class IndexComponent implements OnInit {

  columns = [
    {id: 'name', title: 'Name', display: true},
    {id: 'description', title: 'Description', display: true},
    {id: 'permissions', title: 'Permissions', display: true},
  ];

  filteredRoles: Observable<RoleModel[]> = new Observable<RoleModel[]>();
  roleFilterControl = new FormControl('');

  constructor(private roleService: RoleService, private roleSearch: SearchService<RoleModel>) {
    this.roleSearch.setFields(['name', 'description', 'permissions.name'])
  }

  ngOnInit(): void {
    this.filteredRoles = this.roleFilterControl.valueChanges
      .pipe(debounceTime(200),
        switchMap((value) => this.roleSearch.find(value, this.roles)))
  }

  get roles(): Observable<RoleModel[]> {
    return this.roleService.roles;
  }

  get isSearching() {
    return this.roleFilterControl.value.trim().length > 0;
  }
}
