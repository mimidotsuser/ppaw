import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksheetsComponent } from './worksheets.component';

const routes: Routes = [{path: '', component: WorksheetsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorksheetsRoutingModule {}
