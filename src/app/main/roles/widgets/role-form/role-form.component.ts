import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { RoleModel } from '../../../../models/role.model';
import { PermissionModel } from '../../../../models/permission.model';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-form[permissions]',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  providers: [FilterPipe, SlicePipe]
})
export class RoleFormComponent implements OnInit, OnDestroy {

  @Input() set model(val: RoleModel | null) {(this.role = val) && this.updateAllFormValues(val);};

  @Input() set permissions(val: PermissionModel[]) { this.updateFormPermissions(val)} ;

  form: FormGroup;
  searchControl: FormControl;
  role: RoleModel | null = null;
  pagination = {
    page: 1,
    limit: 10,
    total: 0
  }
  private _subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private filterPipe: FilterPipe<AbstractControl>,
              private slicePipe: SlicePipe) {
    this.searchControl = this.fb.control('');

    this.form = this.fb.group({
      name: this.fb.control(null, {validators: [Validators.required]}),
      description: this.fb.control(''),
      permissions: this.fb.array([])
    });
  }

  ngOnInit(): void {
  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get permissionArrayGroup(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  get filteredPermissionGroups(): FormGroup[] {
    let filtered = this.filterPipe.transform(this.permissionArrayGroup.controls,
      this.searchControl.value,
      ['value.title', 'value.description', 'value.searchStatus']);

    this.pagination.total = filtered.length;

    filtered = this.slicePipe.transform(filtered,
      (this.pagination.page - 1) * this.pagination.limit,
      this.pagination.page * this.pagination.limit);

    return filtered as FormGroup[];

  }

  updateAllFormValues(model: RoleModel | null) {
    if (!model) {return}
    //update basic role form details
    this.form.patchValue({name: model.name, description: model.description});
    if (!model.editable) {
      this.form.disable()
    }

    if (!model.permissions) {return;}
    //set permissions as selected
    model.permissions.map((permission) => {
      const group = this.permissionArrayGroup.controls
        .find((control) => control.get('id')?.value === permission.id);
      if (group) {
        group.get('selected')?.patchValue(true);
      }
    });
  }

  updateFormPermissions(permissions: PermissionModel[]) {
    permissions.map((permission) => {
      this.addPermissionControl(permission)
    });
  }

  createPermissionGroup(permission: PermissionModel): FormGroup {
    return this.fb.group({
      id: this.fb.control(permission.id),
      selected: this.fb.control(false),
      searchStatus: this.fb.control(''),
      title: this.fb.control(permission.name),
      group: this.fb.control(permission.group),
      description: this.fb.control(permission.description)
    });
  }

  addPermissionControl(permission: PermissionModel) {
    const group = this.createPermissionGroup(permission);
    this.permissionArrayGroup.push(group);

    //attach
    this.subSink = group.get('selected')!.valueChanges
      .subscribe((selected) => {
        group.get('searchStatus')?.patchValue(selected ? 'selected' : '');
      })
  }


  get selectedTotal() {
    return this.permissionArrayGroup.controls
      .filter((control) => control.get('selected')?.value === true).length
  }

  paginationShow(page: number) {
    this.pagination.page = page;
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
