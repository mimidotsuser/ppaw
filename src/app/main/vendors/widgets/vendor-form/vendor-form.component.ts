import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: this.fb.control(null, {validators: [Validators.required]}),
      email: this.fb.control(null, {validators: [Validators.email]}),
      address: this.fb.control(null),
      telephone: this.fb.control(null),
    })
  }

  ngOnInit(): void {
  }

}
