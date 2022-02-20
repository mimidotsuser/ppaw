import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: '',
        loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
