import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { MetaService } from '../../core/services/meta.service';
import { StorageService } from '../../core/services/storage.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private _subscriptions: Subscription[] = [];
  flashMessage: null | string = null;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,24}$';
  submitting = false;

  constructor(private meta: MetaService, private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, private http: HttpService,
              private storageService: StorageService) {
    this.meta.title = 'Login'
    this.form = this.fb.group({
      username: new FormControl('',
        {validators: [Validators.required, Validators.pattern(this.emailPattern)]}),
      password: new FormControl('', {validators: [Validators.required]})
    })
  }

  ngOnInit(): void {
    this.storageService.user = null;
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }


  login($evt: Event) {
    $evt.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}
    this.flashMessage = null;
    this.submitting = true;

    this.http.get('/csrf-cookie').subscribe({
      next: () => {
        this.subSink = this.http.post('/auth/login', this.form.value)
          .subscribe(
            {
              next: (res: { data: UserModel }) => {
                this.storageService.user = res.data;
                if (this.route.snapshot.queryParamMap.get('src')) {
                  this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('src')!);
                } else {
                  this.router.navigateByUrl('/main')
                }
              },
              error: (err) => {
                this.submitting = false;
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
        this.submitting = false;
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
