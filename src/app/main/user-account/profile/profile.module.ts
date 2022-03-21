import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: 'edit', component: EditComponent}])
  ]
})
export class ProfileModule {}
