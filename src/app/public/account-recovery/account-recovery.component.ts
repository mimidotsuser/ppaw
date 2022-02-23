import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../core/services/http.service';
import { matchValues } from '../../utils/validators/match-values';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.component.html',
  styleUrls: ['./account-recovery.component.scss']
})
export class AccountRecoveryComponent implements OnInit {
  form: FormGroup;

  constructor(private meta: MetaService, private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, private http: HttpService) {

    this.meta.title = 'Password Reset'

    this.form = this.fb.group({
      password: new FormControl('',
        {
          validators: [Validators.required, Validators.minLength(8),
            Validators.maxLength(17),
            Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]
        }),
      confirm_password: new FormControl('',
        {validators: [Validators.required, matchValues('password')]})
    })
  }

  ngOnInit(): void {
  }

  recoverPassword($evt: Event) {
    $evt.preventDefault();
    this.form.markAllAsTouched();
    this.form.get('confirm_password')?.updateValueAndValidity();
    if (this.form.invalid) {
      //Todo reset the password
    }
  }
}
