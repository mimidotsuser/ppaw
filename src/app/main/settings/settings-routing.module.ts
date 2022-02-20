import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '', component: SettingsComponent,
    children: [
      {
        path: 'change-password',
        loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule)
      },
      {
        path: 'edit-account',
        loadChildren: () => import('./edit-account/edit-account.module').then(m => m.EditAccountModule)
      }
    ]
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
