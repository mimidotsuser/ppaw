import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditComponent } from './edit.component';
import { SharedModule } from '../../../shared/shared.module';
import { WidgetsModule as CustomerContractWidgetsModule } from '../widgets/widgets.module';


@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: EditComponent}]),
    SharedModule,
    CustomerContractWidgetsModule
  ]
})
export class EditModule {}
