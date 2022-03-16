import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { MetaService } from '../../core/services/meta.service';
import { catchError, Subscription } from 'rxjs';
import { StorageService } from '../../core/services/storage.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private _subscriptions: Subscription[] = [];

  constructor(private meta: MetaService, private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, private http: HttpService,
              private storageService: StorageService) {
    this.meta.title = 'Login'
    this.form = this.fb.group({
      username: new FormControl('', {validators: [Validators.required, Validators.email]}),
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

    this.http.get('/csrf-cookie').subscribe(() => {
      this.subSink = this.http.post('/auth/login', this.form.value)
        .pipe(catchError((err) => {
          alert('Error encountered');
          return err;
        }))
        .subscribe((res: { data: UserModel }) => {
          this.storageService.user = res.data;
          if (this.route.snapshot.queryParamMap.get('src')) {
            this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('src')!);
          } else {
            this.router.navigateByUrl('/main')
          }
        })
    });

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }


}
