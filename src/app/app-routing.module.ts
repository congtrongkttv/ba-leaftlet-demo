import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { OnlineComponent } from './Page/online/online.component';
import { TrackingComponent } from './Page/tracking/tracking.component';
import { ReportDriversComponent } from './Page/Report/report-drivers/report-drivers.component';
import { ReportUsersComponent } from './Page/Report/report-users/report-users.component';

export let route: Router;
const routes: Routes = [
  { path: 'online', component: OnlineComponent },
  { path: 'tracking', component: TrackingComponent },
  { path: 'report', component: ReportDriversComponent },
  { path: 'report1', component: ReportUsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private _router: Router) {
    route = _router;
  }
}
