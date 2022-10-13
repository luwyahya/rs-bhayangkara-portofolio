import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { adminLteConf } from './admin-lte.conf';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from 'angular-admin-lte';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { AppService } from './shared/app.service';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,


} from '@angular/material';

import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './+login/login.module';
import { LoginComponent } from './+login/login.component';
import { ToastModule, Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { MenuItem } from 'primeng/api';                 //api
import { RawatinapComponent } from './+kunjungan/rawatinap/rawatinap.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InjectionToken, FactoryProvider } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
export const WINDOW = new InjectionToken<Window>('window');
import { AuthGuard } from './shared/auth.guard';
// Import PrimeNG modules
import { AutoCompleteModule, SidebarModule } from 'primeng/primeng';
import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CarouselModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TerminalModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DashboardPendapatanComponent } from './+module/dashboard-pendapatan/dashboard-pendapatan.component';
import { DashboardSdmComponent } from './+module/dashboard-sdm/dashboard-sdm.component';
import { DashboardPersediaanComponent } from './+module/dashboard-persediaan/dashboard-persediaan.component';
import * as drilldown from 'highcharts/modules/drilldown.src.js';


// Import angular-fusioncharts
// import { FusionChartsModule } from "angular-fusioncharts";

// // Import FusionCharts library and chart modules
// import * as FusionCharts from "fusioncharts";
// import * as FusionMaps from "fusioncharts/fusioncharts.maps";
// import * as World from "fusionmaps/maps/fusioncharts.world";
// import * as Maps from 'fusioncharts/fusioncharts.maps';
// import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// import * as California from "fusionmaps/maps/fusioncharts.california";
import { DashboardPmkpComponent } from './+module/dashboard-pmkp/dashboard-pmkp.component';
import { DashboardPpiComponent } from './+module/dashboard-ppi/dashboard-ppi.component';
// import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
// // Pass the fusioncharts library and chart modules
// FusionChartsModule.fcRoot(
//   FusionCharts,
//   FusionMaps,
//   California,
//   FusionTheme,
//   World
// );
const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};

export const WINDOW_PROVIDERS = [
  windowProvider
]
// FusionChartsModule.fcRoot(
//   FusionCharts,
//   FusionMaps,
//   Maps,
//   // World,
//   FusionTheme
// );
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    AppRoutingModule,
    CommonModule,
    CoreModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, MaterialBarModule,
    HttpClientModule,
    ChartModule,
    MatInputModule, MatTableModule, MatToolbarModule, MatPaginatorModule,
    LoginModule,
    ToastModule,
    AccordionModule,
    CalendarModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    // MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ProgressSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: '8i7Tf3wrAiuzmA4c16Sh'
    }),
    GMapModule,
    // prime ng module
    // prime ng module 
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    TableModule,
    SidebarModule,
    //  end prime ng
    // FusionChartsModule

  ],
  exports: [MatToolbarModule, MatInputModule, MatTableModule],
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardPendapatanComponent,
    DashboardSdmComponent,
    DashboardPersediaanComponent,
    DashboardPmkpComponent,
    DashboardPpiComponent,
    

  ],
  bootstrap: [AppComponent],
  providers: [
    AppService,
    MessageService,
    WINDOW_PROVIDERS,
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATs },
    // { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'id-ID' },
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [drilldown]
    },
    { provide: Window, useValue: window },
    AuthGuard

  ]
})
export class AppModule { }

