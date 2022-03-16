import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  constructor(private meta: MetaService, private httpService: HttpService) {
    this.meta.title = 'Password Reset'
    this.emailFormControl = new FormControl('',
      {validators: [Validators.email, Validators.required]});
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

    this.subSink = this.httpService.get('/csrf-cookie')
      .subscribe(() => {
        this.subSink = this.httpService.post('/auth/forgot-password',
          {username: this.emailFormControl.value})
          .subscribe(() => {
            this.passwordResetInitiated = true
          })
      });
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}
