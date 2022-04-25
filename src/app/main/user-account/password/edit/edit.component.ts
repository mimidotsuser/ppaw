import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, Subscription } from 'rxjs';
import { UserAccountService } from '../../services/user-account.service';
import { AuthService } from '../../../../core/services/auth.service';
import { matchValues } from '../../../../utils/validators/match-values';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  revealOldPassword = false;
  revealPassword = false;
  revealConfirmPassword = false;
  formSubmissionBusy = false;
  validationStatus = {lengthOk: false, hasLetters: false, hasNumbers: false}
  private _subscriptions: Subscription[] = [];
  private _passwordPattern = '^(?=.*[A-Za-z])(?=.*\\d)[@+}{,)(#.-=/!A-Za-z\\d]{8,}$'
  form: FormGroup;

  constructor(private fb: FormBuilder, private userAccountService: UserAccountService,
              private authService: AuthService) {
    this.form = this.fb.group({
      old_password: this.fb.control(null, {validators: [Validators.required]}),
      password: this.fb.control(null, {
        validators: [Validators.required, Validators.minLength(8),
          Validators.maxLength(17),
          Validators.pattern(this._passwordPattern)]
      }),
      password_confirmation: this.fb.control(null,
        {validators: [Validators.required, matchValues('password')]}),
    })
  }

  ngOnInit(): void {
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

  get passwordInvalid() {
    return this.form.get('password')?.touched && this.form.get('password')?.hasError('pattern')
  }

  submitForm() {
    this.form.markAllAsTouched();
    this.form.get('confirm_password')?.updateValueAndValidity();
    if (this.form.invalid) {return}
    this.formSubmissionBusy = true;
    this.subSink = this.userAccountService
      .changePassword(this.authService.user?.id || 0, this.form.value)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.form.reset();
          this.validationStatus = {lengthOk: false, hasLetters: false, hasNumbers: false}

          alert('Password updated successfully');
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
