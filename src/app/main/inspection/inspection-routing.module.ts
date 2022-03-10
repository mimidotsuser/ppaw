import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionComponent } from './inspection.component';

const routes: Routes = [{
  path: 'purchased-products',
  component: InspectionComponent,
  children: [
    {
      path: ':id/create',
      loadChildren: () => import('./purchased-products/create/create.module').then(m => m.CreateModule)
    },
    {
      path: '',
      loadChildren: () => import('./purchased-products/index/index.module').then(m => m.IndexModule)
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule {}
