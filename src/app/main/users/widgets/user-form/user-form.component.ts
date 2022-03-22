import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserModel } from '../../../../models/user.model';
import { RoleModel } from '../../../../models/role.model';

@Component({
  selector: 'app-user-form[roles]',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() roles!: Observable<RoleModel[]>;

  @Input() set model(model: UserModel | null) {this.setForm(model)}

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      'first_name': this.fb.control(''),
      'last_name': this.fb.control(''),
      'email': this.fb.control(''),
      'role_id': this.fb.control(''),
    });
  }

  ngOnInit(): void {
  }

  setForm(model: UserModel | null) {
    if (!model) {
      model = {
        status: 0,
        role_id: '',
        last_name: '',
        first_name: '',
        id: '',
        email: ''
      }
    }
    this.form = this.fb.group({
      'first_name': this.fb.control(model?.first_name,
        {validators: [Validators.required, Validators.maxLength(100)]}),
      'last_name': this.fb.control(model?.last_name,
        {validators: [Validators.maxLength(100)]}),
      'email': this.fb.control(model?.email,
        {
          validators: [Validators.required, Validators.email, Validators.maxLength(100)]
        }),
      'role_id': this.fb.control(model?.role_id,
        {validators: [Validators.required]}),
    });
  }


}
