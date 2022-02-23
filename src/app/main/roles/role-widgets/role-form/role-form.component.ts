import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleModel } from '../../../../models/role.model';
import { PermissionModel } from '../../../../models/permission.model';

@Component({
  selector: 'app-role-form[permissions]',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit, OnDestroy {

  @Input() permissions!: Observable<PermissionModel[]>;
  @Input() model!: RoleModel;

  form!: FormGroup;

  private permissionSubscription: Subscription | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (!this.model) {
      this.model = {
        id: '',
        name: '',
        permissions: [],
        description: ''
      }
    }

    this.form = this.fb.group({
      name: new FormControl(this.model.name, {validators: [Validators.required]}),
      description: new FormControl(this.model.description),
      permissions: this.fb.array([])
    });

    this.permissionSubscription = this.permissions.subscribe((m) => {
      m.map((permission) => {
        this.addPermissionControl(permission, this.permissionIsSelected(permission))
      })
    });
  }

  get _permissions(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  createPermissionGroup(permission: PermissionModel, selected = false): FormGroup {
    return this.fb.group({
      id: [permission.id, Validators.required],
      selected: [selected,],
      title: [permission.name],
      group: [permission.group],
      description: [permission.description]
    });
  }

  addPermissionControl(permission: PermissionModel, selected = false) {
    const group = this.createPermissionGroup(permission, selected);
    (this.form.get('permissions') as FormArray).push(group);
    return group;
  }

  /**
   * Check if a permission exists on current model
   * @param permission
   */
  permissionIsSelected(permission: PermissionModel) {
    return this.model.permissions.findIndex((x) => x.id === permission.id) > -1;
  }

  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }
}
