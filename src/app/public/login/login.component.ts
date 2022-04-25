import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { MetaService } from '../../core/services/meta.service';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  flashMessage: null | string = null;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,24}$';
  formSubmissionBusy = false;
  revealPassword = false;
  private _subscriptions: Subscription[] = [];
  form: FormGroup;

  constructor(private meta: MetaService, private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, private httpService: HttpService,
              private authService: AuthService) {
    this.meta.title = 'Login'
    this.form = this.fb.group({
      username: this.fb.control('',
        {validators: [Validators.required, Validators.pattern(this.emailPattern)]}),
      password: this.fb.control('', {validators: [Validators.required]})
    })
  }

  ngOnInit(): void {
    this.authService.user = null;
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }


  login($evt: Event) {
    $evt.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}
    this.flashMessage = null;
    this.formSubmissionBusy = true;

    this.subSink = this.httpService.get(this.httpService.endpoint.csrf).subscribe({
      next: () => {
        this.subSink = this.httpService.post(this.httpService.endpoint.login, this.form.value)
          .subscribe(
            {
              next: (res: { data: UserModel }) => {
                this.authService.user = res.data;
                this.authService.redirectToMainSystemPage();
              },
              error: (err) => {
                this.formSubmissionBusy = false;
                if (err.status === 401) {
                  this.flashMessage = 'Incorrect email/password combination';
                } else {
                  this.flashMessage = 'Something went wrong. Please try again.'
                }
                this.form.get('password')?.reset();
              }
            });
      },
      error: (err) => {
        this.formSubmissionBusy = false;
        if (err.status === 0 && window.navigator && !window.navigator.onLine) {
          this.flashMessage = 'Check you internet connection';
        } else {
          this.flashMessage = 'Something went wrong. Please try again'
        }
      }
    });

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}
