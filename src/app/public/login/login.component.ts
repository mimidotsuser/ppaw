import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, private http: HttpService) {
    this.form = this.fb.group({
      email: new FormControl('', {validators: [Validators.email, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]})
    })
  }

  ngOnInit(): void {
  }

  login($evt: Event) {
    $evt.stopPropagation();
    //TODO: login then route to main or src

    if (this.route.snapshot.queryParamMap.get('src')) {
      this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('src')!);
    } else {
      this.router.navigateByUrl('/main')
    }
  }

}
