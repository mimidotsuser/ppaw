import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountComponent } from './user-account.component';

const routes: Routes = [
  {
    path: '', component: UserAccountComponent,
    children: [
      {
        path: 'password',
        loadChildren: () => import('./password/password.module').then(m => m.PasswordModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule {}
