import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OnlineComponent } from './Page/online/online.component';
import { TrackingComponent } from './Page/tracking/tracking.component';
import { LeftpanelComponent } from './leftpanel/leftpanel.component';
import { HttpClientModule } from '@angular/common/http';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { TimePipe } from './pipe/time.pipe';
import { SortPipe } from './pipe/sort.pipe';
import { VehiclePopupComponent } from './Page/Modal/vehicle-popup/vehicle-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    OnlineComponent,
    TrackingComponent,
    LeftpanelComponent,
    TimePipe,
    SortPipe,
    VehiclePopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    FormsModule,
    HttpClientModule,
    VirtualScrollerModule,
    AutocompleteLibModule,
    SelectDropDownModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
