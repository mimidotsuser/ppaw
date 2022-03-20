import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicModule } from './public/public.module';
import { AuthnGuard } from './core/guards/authn.guard';

const routes: Routes = [
  {
    path: 'main',
    canActivate: [AuthnGuard],
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {path: '', loadChildren: () => PublicModule},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
