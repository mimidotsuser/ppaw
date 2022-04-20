import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandbySpareCheckinComponent } from './standby-spare-checkin.component';
import { Actions, Resources } from '../../utils/permissions';

const routes: Routes = [{
  path: '', component: StandbySpareCheckinComponent,
  children: [
    {path: '', redirectTo: 'history', pathMatch: 'full'},
    {
      path: 'history',
      loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      data:{
        resource: Resources.standByCheckIn, action: Actions.view
      }
    },
    {
      path: 'create',
      loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      data: {
        title: 'Standby Spare Checkin', breadcrumb: 'Checkin Form',
        resource: Resources.standByCheckIn, action: Actions.create
      }
    }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandbySpareCheckinRoutingModule {}
