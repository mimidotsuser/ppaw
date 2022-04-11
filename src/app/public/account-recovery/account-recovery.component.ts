import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../core/services/http.service';
import { matchValues } from '../../utils/validators/match-values';
import { MetaService } from '../../core/services/meta.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.component.html',
  styleUrls: ['./account-recovery.component.scss']
})
export class AccountRecoveryComponent implements OnInit {
  private _subscriptions: Subscription[] = [];
  form: FormGroup;
  passwordPattern = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d][\\w~@#$%^&*+=`|{}:;!.?\\"()\\[\\]-]{8,}$'
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,24}$';
  validationStatus = {lengthOk: false, hasLetters: false, hasNumbers: false}
  submitting = false;
  resetPasswordComplete = false;
  flashErrorMessage: null | string = null;
  formTitle = 'Account Password Recovery';
  submitButtonLabel = 'Reset Password'

  constructor(private meta: MetaService, private fb: FormBuilder, private route: ActivatedRoute,
              private httpService: HttpService, private router: Router) {

    this.meta.title = 'Password Reset'
    this.form = this.fb.group({
      username: this.fb.control(this.route.snapshot.queryParams[ 'email' ],
        {validators: [Validators.required, Validators.pattern(this.emailPattern)]}),
      password: this.fb.control('',
        {
          validators: [Validators.required, Validators.minLength(8),
            Validators.maxLength(17),
            Validators.pattern(this.passwordPattern)]
        }),
      password_confirmation: this.fb.control('',
        {validators: [Validators.required, matchValues('password')]})
    })
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams[ 'invite' ]) {
      this.formTitle = 'Setup Account Password';
      this.submitButtonLabel = 'Set Password'
    }

    this.form.get('password')!.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        this.validationStatus.hasNumbers = /(?=.*\d)/.test(value);
        this.validationStatus.hasLetters = /(?=.*[A-Za-z])/.test(value);
        this.validationStatus.lengthOk = value.length >= 8;
      })
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  recoverPassword() {
    this.form.markAllAsTouched();
    this.form.get('confirm_password')?.updateValueAndValidity();
    if (this.form.invalid) {return}

    this.submitting = true;
    this.subSink = this.httpService.get(this.httpService.endpoint.csrf)
      .subscribe({
        next: () => {
          const token = this.route.snapshot.params[ 'token' ];
          this.subSink = this.httpService
            .post(`${this.httpService.endpoint.resetPassword}/${token}`, this.form.value)
            .subscribe({
              next: () => {
                this.submitting = false;
                this.resetPasswordComplete = true;
                setTimeout(() => this.router.navigateByUrl('login'), 3000);
              },
              error: (err) => {
                this.submitting = false;
                this.flashErrorMessage = 'Password reset token invalid';
                if (err.status !== 422) {
                  this.flashErrorMessage = 'Something went wrong. Please try again.'
                }
              }
            });
        }, error: () => {
          this.submitting = false;
          this.flashErrorMessage = 'Something went wrong. Please try again.'
        }
      });
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
