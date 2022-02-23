import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountRecoveryComponent } from './account-recovery.component';


@NgModule({
  declarations: [
    AccountRecoveryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AccountRecoveryComponent}]),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountRecoveryModule {}
