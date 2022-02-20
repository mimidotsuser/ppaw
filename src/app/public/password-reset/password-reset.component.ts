import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  passwordResetInitiated = false;

  constructor() { }

  ngOnInit(): void {
  }

  resetPassword() {
    this.passwordResetInitiated = true;
  }

}
