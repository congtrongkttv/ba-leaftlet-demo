import { TwoColumnComponent } from './Page/Report/BaseReport/two-column/two-column.component';
import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ReportDriversComponent } from './Page/Report/report-drivers/report-drivers.component';
import {
  ExcelModule,
  GridModule,
  PDFModule,
} from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OneColumnComponent } from './Page/Report/BaseReport/one-column/one-column.component';
import { ReportUsersComponent } from './Page/Report/report-users/report-users.component';
import { FilterPipePipe } from './pipe/filter-pipe.pipe';
import { DriverEditComponent } from './Page/Report/report-drivers/driver-edit/driver-edit.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NumberDirective } from './Directives/number-only.directive';
import { MaxLengthDirective } from './Directives/max-length.directive';
import { UserEditComponent } from './Page/Report/report-users/user-edit/user-edit.component';
import { GridDetailComponent } from './Page/Report/BaseReport/grid-detail/grid-detail.component';

export let AppInjector: Injector;

@NgModule({
  declarations: [
    AppComponent,
    OnlineComponent,
    TrackingComponent,
    LeftpanelComponent,
    TimePipe,
    SortPipe,
    FilterPipePipe,
    VehiclePopupComponent,
    ReportDriversComponent,
    ReportUsersComponent,
    TwoColumnComponent,
    OneColumnComponent,
    DriverEditComponent,
    NumberDirective,
    MaxLengthDirective,
    UserEditComponent,
    GridDetailComponent,
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
    GridModule,
    BrowserAnimationsModule,
    ExcelModule,
    PDFModule,
    DropDownsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private inject: Injector) {
    AppInjector = inject;
  }
}
