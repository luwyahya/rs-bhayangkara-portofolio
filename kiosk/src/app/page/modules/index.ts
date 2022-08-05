
// home
// export * from './home/dashboard/dashboard.component';


// KIOSK
export * from './kiosk/touchscreen/touchscreen.component';
export * from './kiosk/antrian/antrian.component';
export * from './kiosk/antrian-online/antrian-online.component';
export * from './kiosk/antrian-promoter/antrian-promoter.component';
export * from './kiosk/jenispasien/jenispasien.component';
export * from './kiosk/denah/denah.component';
export * from './kiosk/informasi/informasi.component';
export * from './kiosk/pasienbaru/pasienbaru.component';
export * from './kiosk/pasienlama/pasienlama.component';
export * from './kiosk/self-regis/self-regis.component';
export * from './kiosk/checkin/checkin.component';
export * from './kiosk/verifikasi-pasien/verifikasi-pasien.component';
export * from './kiosk/pilih-poli/pilih-poli.component';
export * from './kiosk/verifikasi-pasien-bpjs/verifikasi-pasien-bpjs.component';
export * from './kiosk/informasi-profil/informasi-profil.component';
export * from './kiosk/informasi-pelayanan/informasi-pelayanan.component';
export * from './kiosk/informasi-kamar/informasi-kamar.component';
export * from './kiosk/informasi-dokter/informasi-dokter.component';
export * from './kiosk/informasi-promosi/informasi-promosi.component';
export * from './kiosk/informasi-bantuan/informasi-bantuan.component';
export * from './kiosk/gallery/gallery.component';
export * from './kiosk/touchscreen-v2/touchscreen-v2.component';
export * from './kiosk/verifikasi-pasien-bpjs-nonpol/verifikasi-pasien-bpjs-nonpol.component';
//RESERVASI ONLINE 



// not found
export * from './404/not-found.component';
import * as component from './';
var Cmp = [];
for (var key in component) {
  if (component[key]) {
    if (key.indexOf('Component') > 0) {
      Cmp.push(component[key]);
    }
  }
}

import * as service from './';
var Srv = [];
for (var k in service) {
  if (service[k]) {
    if (k.indexOf('Service') > 0) {
      Srv.push(service[k]);
    }
  }
}


import { pathMaster } from './path';
export const routerModule = pathMaster;
export const ComponentMaster = Cmp;
export const ServiceMaster = Srv;
