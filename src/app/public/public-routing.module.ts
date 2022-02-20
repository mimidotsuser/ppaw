import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { LoginModule } from './login/login.module';

const routes: Routes = [
  {
    path: '', component: PublicComponent, children: [
      {
        path: '',
        loadChildren: () => LoginModule
      },
      {path: 'login', redirectTo: '', pathMatch: 'full'},
      {
        path: 'password-reset',
        loadChildren: () => import('./password-reset/password-reset.module').then(m => m.PasswordResetModule)
      },
      {
        path: '**',
        loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
