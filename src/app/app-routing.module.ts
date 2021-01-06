import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineComponent } from './Page/online/online.component';
import { TrackingComponent } from './Page/tracking/tracking.component';

const routes: Routes = [
  { path: 'online', component: OnlineComponent },
  { path: 'tracking', component: TrackingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
