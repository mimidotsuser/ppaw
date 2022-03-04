import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
    }]),
  ]
})
export class VendorsModule {}
