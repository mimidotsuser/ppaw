import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../../../models/user.model';
import { RoleModel } from '../../../../models/role.model';

@Component({
  selector: 'app-user-form[roles]',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() roles: RoleModel[] = [];

  @Input() set model(model: UserModel | null) {model ? this.updateFormValues(model) : ''}

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      first_name: this.fb.control(null,
        {validators: [Validators.required, Validators.maxLength(200)]}),
      last_name: this.fb.control(null,
        {validators: [Validators.maxLength(200)]}),
      email: this.fb.control(null,
        {
          validators: [Validators.required, Validators.email, Validators.maxLength(200)]
        }),
      role_id: this.fb.control(null, {validators: [Validators.required]}),
    });
  }

  ngOnInit(): void {
  }

  updateFormValues(model: UserModel) {
    this.form.patchValue(model)
  }


}
