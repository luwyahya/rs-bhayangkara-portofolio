import { AuthGuard } from '../../helper';
import * as pMaster from './';

// import * as demo from '../../demo/index';


export const pathMaster = [

    { path: '', redirectTo: 'touchscreen', pathMatch: 'full' },
    //KIOS K
    { path: 'kiosk', redirectTo: 'touchscreen' },
    // { path: 'touchscreen', component: pMaster.TouchscreenComponent },
    { path: 'touchscreen', component: pMaster.TouchscreenV2Component },
    { path: 'touchscreen/antrian', component: pMaster.AntrianComponent },
    { path: 'touchscreen/antrian-online', component: pMaster.AntrianOnlineComponent },
    { path: 'touchscreen/antrian/jenispasien', component: pMaster.JenispasienComponent },
    { path: 'touchscreen/denah', component: pMaster.DenahComponent },
    { path: 'touchscreen/informasi', component: pMaster.InformasiComponent },
    { path: 'touchscreen/antrian/jenispasien/baru', component: pMaster.PasienbaruComponent },
    { path: 'touchscreen/antrian/jenispasien/lama', component: pMaster.PasienlamaComponent },

    { path: 'touchscreen/antrian-promoter', component: pMaster.AntrianPromoterComponent },
    { path: 'touchscreen/antrian-promoter/jenispasien', component: pMaster.JenispasienComponent },

    { path: 'touchscreen/self-regis', component: pMaster.SelfRegisComponent },
    { path: 'touchscreen/self-regis/verif-pasien', component: pMaster.VerifikasiPasienComponent },
    { path: 'touchscreen/self-regis/verif-pasien/poli', component: pMaster.PilihPoliComponent },
    { path: 'touchscreen/checkin', component: pMaster.CheckinComponent },

    { path: 'touchscreen/self-regis/verif-pasien-bpjs', component: pMaster.VerifikasiPasienBpjsComponent },
    { path: 'touchscreen/self-regis/verif-pasien-bpjs-nonpol', component: pMaster.VerifikasiPasienBpjsNonpolComponent },

    { path: 'informasi-profil', component: pMaster.InformasiProfilComponent },
    { path: 'informasi-pelayanan', component: pMaster.InformasiPelayananComponent },
    { path: 'informasi-kamar', component: pMaster.InformasiKamarComponent },
    { path: 'informasi-dokter', component: pMaster.InformasiDokterComponent },
    { path: 'informasi-promosi', component: pMaster.InformasiPromosiComponent },
    { path: 'informasi-bantuan', component: pMaster.InformasiBantuanComponent },

    { path: 'gallery', component: pMaster.GalleryComponent },
    //END KIOS K

    //Reservasi
    // { path: 'reservasi', component: pMaster.ReservasiOnlineComponent },
    //END Reservasi

    // { path: 'dashboard-app', component: pMaster.DashboardComponent },
    // { canActivate: [AuthGuard], path: 'empty', component: demo.EmptyDemoComponent },

    { canActivate: [AuthGuard], path: '404', component: pMaster.NotFoundComponent },
    { canActivate: [AuthGuard], path: '**', redirectTo: '/404' },

];