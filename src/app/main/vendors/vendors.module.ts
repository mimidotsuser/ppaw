import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Actions, Resources } from '../../utils/permissions';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      loadChildren: () => import('./index/index.module').then(m => m.IndexModule),
      data: {resource: Resources.vendors, action: Actions.view}
    }]),
  ]
})
export class VendorsModule {}
