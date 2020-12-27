import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OnlineComponent } from './online/online.component';
import { TrackingComponent } from './tracking/tracking.component';
import { LeftpanelComponent } from './leftpanel/leftpanel.component';
import { HttpClientModule } from '@angular/common/http';
import { AgVirtualScrollModule } from 'ag-virtual-scroll';

@NgModule({
  declarations: [
    AppComponent,
    OnlineComponent,
    TrackingComponent,
    LeftpanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    FormsModule,
    HttpClientModule,
    AgVirtualScrollModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
