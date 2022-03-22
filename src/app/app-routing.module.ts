import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicModule } from './public/public.module';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'main',
    canActivate: [AuthGuard],
    data: {title: 'Home'},
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {path: '', loadChildren: () => PublicModule},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
