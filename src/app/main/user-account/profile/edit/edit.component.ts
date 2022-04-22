import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserAccountService } from '../../services/user-account.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];
  form: FormGroup;

  constructor(private userAccountService: UserAccountService, private fb: FormBuilder,
              private authService: AuthService) {
    this.form = this.fb.group({
      first_name: this.fb.control(null),
      last_name: this.fb.control(null),
      email: this.fb.control({value: '', disabled: true}),
      role: this.fb.control({value: '', disabled: true}),
    });

    this.subSink = this.userAccountService.fetch(this.authService.user?.id || 0)
      .subscribe({
        next: (model) => {
          this.form.patchValue({
            first_name: model.first_name,
            last_name: model.last_name,
            email: model.email,
            role: model.role?.name,
          })
        }
      })
  }

  ngOnInit(): void {
  }


  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.form.dirty) {return}
    this.subSink = this.userAccountService.update(this.authService.user?.id || 0, {
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name
    }).subscribe({
      next: (model) => {
        const user = this.authService.user;
        if (user) {
          user.first_name = model.first_name;
          user.last_name = model.last_name;
          this.authService.user = user;
        }

        alert('Account updated successfully')
      }
    })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
