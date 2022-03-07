import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { PurchasedProductsComponent } from './purchased-products.component';


@NgModule({
  declarations: [
    PurchasedProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: PurchasedProductsComponent, children: [
          {
            path: 'create',
            loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
          }
        ]
      },
    ]),
  ]
})
export class PurchasedProductsModule {}
