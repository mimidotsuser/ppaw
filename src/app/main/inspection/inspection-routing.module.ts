import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionComponent } from './inspection.component';

const routes: Routes = [{
  path: '',
  component: InspectionComponent,
  children: [
    {
      path: 'purchased-products/create',
      loadChildren: () => import('./purchased-products/create/create.module').then(m => m.CreateModule)
    },
    {
      path: 'purchased-products',
      loadChildren: () => import('./purchased-products/index/index.module').then(m => m.IndexModule)
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule {}
