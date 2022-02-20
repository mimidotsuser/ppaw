import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicModule } from './public/public.module';

const routes: Routes = [
  {path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule)},
  {path: '', loadChildren: () => PublicModule},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
