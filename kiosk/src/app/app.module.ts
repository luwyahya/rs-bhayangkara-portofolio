import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutes, routes } from './app.routes';
import { AppComponent } from './app.component';

import { PrimeNgModule, AppComponents, materialModule } from '.';
import { HelperService, helperComponent, helperServices } from './helper';
import { DataHandler } from './helper/handler/DataHandler';
import { MatProgressBarModule, MatStepLabel, MatFormFieldModule, MatInputModule, MatDatepickerModule, MAT_DATE_LOCALE, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { RouterModule } from '@angular/router';

import { Http, HttpModule } from '@angular/http';
import { pagesAuth } from './page/auth';
import {
    ComponentMaster, ServiceMaster, TouchscreenComponent, AntrianComponent,
    JenispasienComponent, DenahComponent, InformasiComponent, PasienbaruComponent,
    PasienlamaComponent, SelfRegisComponent, CheckinComponent, VerifikasiPasienBpjsComponent,
    VerifikasiPasienComponent, InformasiProfilComponent, InformasiPelayananComponent, InformasiKamarComponent,
    InformasiPromosiComponent, InformasiBantuanComponent, NotFoundComponent, PilihPoliComponent, AntrianPromoterComponent,
    VerifikasiPasienBpjsNonpolComponent, AntrianOnlineComponent
} from './page/modules';
import { IKeyboardLayouts, keyboardLayouts, MAT_KEYBOARD_LAYOUTS, MatKeyboardModule } from '@ngx-material-keyboard/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import { ChangeDirective } from './helper/service/directive';
import { ThousandSeparator, TimeFormatter, CapitalizePipe, SafeHtmlPipe } from './helper/service/pipeService';
import { TouchscreenV2Component } from './page/modules/kiosk/touchscreen-v2/touchscreen-v2.component';
import { GalleryComponent } from './page/modules/kiosk/gallery/gallery.component';
import { InformasiDokterComponent } from './page/modules/kiosk/informasi-dokter/informasi-dokter.component';
import { ImageViewerModule } from "ngx-image-viewer";

// import { AntrianApotikComponent } from './antrian-apotik/antrian-apotik.component';
// import { AntrianPromoterComponent } from './page/modules/kiosk/antrian-promoter/antrian-promoter.component';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
const customLayouts: IKeyboardLayouts = {
    ...keyboardLayouts,
    'Tölles Läyout': {
        'name': 'Awesome layout',
        'keys': [
            [
                ['1', '!'],
                ['2', '@'],
                ['3', '#'],
            ],
            [   ['4', '$'],
                ['5', '$'],
                ['6', '$'],
               
            ],[  ['7', '$'],
                ['8', '$'],
                ['9', '$'],
            ],[['0']]
        ],
        'lang': ['de-CH']
    }
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        // NoopAnimationsModule,
        ...PrimeNgModule,
        ...materialModule,
        // ...ngxModule,
        MatButtonModule,
        MatKeyboardModule,
        MatMomentDateModule,

        // NgxMaterialTimepickerModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        HttpModule,
        ImageViewerModule
    ],
    declarations: [
        ...AppComponents,

        ...helperComponent,
        ...ComponentMaster,
        ...pagesAuth,

        TouchscreenComponent,
        AntrianComponent,
        JenispasienComponent,
        DenahComponent,
        InformasiComponent,
        PasienbaruComponent,
        PasienlamaComponent,
        SelfRegisComponent,
        CheckinComponent,
        VerifikasiPasienBpjsComponent,
        VerifikasiPasienComponent,
        InformasiProfilComponent,
        InformasiPelayananComponent,
        InformasiKamarComponent,
        InformasiDokterComponent,
        InformasiPromosiComponent,
        InformasiBantuanComponent,
        NotFoundComponent,

        ChangeDirective,
        ThousandSeparator,
        TimeFormatter,
        CapitalizePipe,
        SafeHtmlPipe,
        PilihPoliComponent,
        TouchscreenV2Component,
        GalleryComponent,
        AntrianPromoterComponent,
        VerifikasiPasienBpjsNonpolComponent,
        AntrianOnlineComponent,
        // AntrianApotikComponent
    ],
    providers: [
        { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'id-ID' },
        //{
        //   provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] 
        //},

        HelperService,

        ...helperServices,
        DataHandler,
        ServiceMaster],
    bootstrap: [AppComponent]
})
export class AppModule { }
