import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerModel } from '../../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  form!: FormGroup;

  @Input() set model(model: CustomerModel) {this.initForm(model)};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
  }

  initForm(model: CustomerModel) {

    this.form = this.fb.group({
      id: this.fb.control(model.id),
      parent: this.fb.control(model.parent),
      name: this.fb.control(model.name, {
        validators: [Validators.required, Validators.maxLength(200)]
      }),
      branch: this.fb.control(model.branch, {
        validators: [Validators.maxLength(200)]
      }),
      location: this.fb.control(model.location, {
        validators: [Validators.maxLength(200)]
      }),
      region: this.fb.control(model.region, {
        validators: [Validators.maxLength(200)]
      }),
    })
  }

  onParentSelect() {
    /**
     * Set the customer name if the input has not been touched or is blank
     */
    if ((this.form.get('name')?.touched && !this.form.get('name')?.value) ||
      !this.form.get('name')?.touched) {
      const parent = (this.form.get('parent')?.value as CustomerModel);
      this.form.get('name')?.patchValue(parent?.name || '');
    }
  }
}
