import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  emailFormControl: FormControl;
  passwordResetInitiated = false;

  constructor() {
    this.emailFormControl = new FormControl('',
      {validators: [Validators.email, Validators.required]});
  }

  ngOnInit(): void {
  }

  resetPassword($event: Event) {
    $event.stopPropagation();
    if (!this.emailFormControl.invalid) {
      this.passwordResetInitiated = true;
    }
  }

}
