import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  emailFormControl: FormControl;
  passwordResetInitiated = false;

  constructor(private meta: MetaService) {
    this.meta.title = 'Password Reset'
    this.emailFormControl = new FormControl('',
      {validators: [Validators.email, Validators.required]});
  }

  ngOnInit(): void {
  }

  resetPassword($event: Event) {
    $event.preventDefault();
    if (!this.emailFormControl.invalid) {
      this.passwordResetInitiated = true;
    }
  }

}
