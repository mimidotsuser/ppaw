import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MetaService } from '../../core/services/meta.service';
import { HttpService } from '../../core/services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit, OnDestroy {

  emailFormControl: FormControl;
  passwordResetInitiated = false;
  private _subscriptions: Subscription[] = [];
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,24}$';
  submitting = false;
  flashMessage: null | string = null;

  constructor(private meta: MetaService, private httpService: HttpService, private fb: FormBuilder) {
    this.meta.title = 'Password Reset'
    this.emailFormControl = this.fb.control('',
      {validators: [Validators.pattern(this.emailPattern), Validators.required]});
  }

  ngOnInit(): void {
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  resetPassword($event: Event) {
    $event.preventDefault();
    this.emailFormControl.markAllAsTouched();
    if (this.emailFormControl.invalid) {
      return;
    }
    this.submitting = true;
    this.subSink = this.httpService.get(this.httpService.endpoint.csrf)
      .subscribe({
        next: () => {
          this.subSink = this.httpService.post(this.httpService.endpoint.forgotPassword,
            {username: this.emailFormControl.value})
            .subscribe({
              next: () => {
                this.passwordResetInitiated = true
              },
              error: (err) => {
                this.submitting = false;
                this.emailFormControl.setErrors({'404': 'Email not found on our records'})
                if (err.status !== 422) {
                  this.flashMessage = 'Something went wrong. Please try again.'
                }
              }
            });
        }, error: () => {
          this.submitting = false;
          this.flashMessage = 'Something went wrong. Please try again.'
        }
      });
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}
