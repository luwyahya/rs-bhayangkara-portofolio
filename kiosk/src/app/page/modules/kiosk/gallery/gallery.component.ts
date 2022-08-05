
import { Component, OnInit, Inject, forwardRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images: any[];
  images2: any[];
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute) {

  }


  ngOnInit() {
    this.images = [
      { source: 'assets/img/galeri/events/kunjungan_presiden/1.jpg', alt: 'Kunjungan Presiden RI', title: 'Events' },
      { source: 'assets/img/galeri/events/kunjungan_presiden/2.jpg', alt: 'Kunjungan Presiden RI', title: 'Events' },
      { source: 'assets/img/galeri/events/kunjungan_presiden/3.jpg', alt: 'Kunjungan Presiden RI', title: 'Events' },

      { source: 'assets/img/galeri/events/pameran_dilem_2019/1.jpg', alt: 'Pameran Di LEM 2019', title: 'Events' },
      { source: 'assets/img/galeri/events/pameran_dilem_2019/2.jpg', alt: 'Pameran Di LEM 2019', title: 'Events' },
      { source: 'assets/img/galeri/events/pameran_dilem_2019/3.jpg', alt: 'Pameran Di LEM 2019', title: 'Events' },
      { source: 'assets/img/galeri/events/pameran_dilem_2019/4.jpg', alt: 'Pameran Di LEM 2019', title: 'Events' },
      { source: 'assets/img/galeri/events/pameran_dilem_2019/5.jpg', alt: 'Pameran Di LEM 2019', title: 'Events' },

      { source: 'assets/img/galeri/events/pelatihan_bantuan_hidup_dasar_untuk_pramuwisata/1.jpg', alt: 'Pelatihan Bantuan Hidup Dasar Untuk Pramuwisata', title: 'Events' },
      { source: 'assets/img/galeri/events/pelatihan_bantuan_hidup_dasar_untuk_pramuwisata/2.jpg', alt: 'Pelatihan Bantuan Hidup Dasar Untuk Pramuwisata', title: 'Events' },
      { source: 'assets/img/galeri/events/pelatihan_bantuan_hidup_dasar_untuk_pramuwisata/3.jpg', alt: 'Pelatihan Bantuan Hidup Dasar Untuk Pramuwisata', title: 'Events' },
      { source: 'assets/img/galeri/events/pelatihan_bantuan_hidup_dasar_untuk_pramuwisata/4.jpg', alt: 'Pelatihan Bantuan Hidup Dasar Untuk Pramuwisata', title: 'Events' },
      { source: 'assets/img/galeri/events/pelatihan_bantuan_hidup_dasar_untuk_pramuwisata/5.jpg', alt: 'Pelatihan Bantuan Hidup Dasar Untuk Pramuwisata', title: 'Events' },
      { source: 'assets/img/galeri/events/pelatihan_bantuan_hidup_dasar_untuk_pramuwisata/6.jpg', alt: 'Pelatihan Bantuan Hidup Dasar Untuk Pramuwisata', title: 'Events' },
      { source: 'assets/img/galeri/events/pelatihan_bantuan_hidup_dasar_untuk_pramuwisata/7.jpg', alt: 'Pelatihan Bantuan Hidup Dasar Untuk Pramuwisata', title: 'Events' },

      { source: 'assets/img/galeri/events/pendampingan_PSC_119_MEMS_di_PORPROV_NTB/1.jpg', alt: 'Pendampingan PSC 119 MEMS Di PORPROV NTB', title: 'Events' },
      { source: 'assets/img/galeri/events/pendampingan_PSC_119_MEMS_di_PORPROV_NTB/2.jpg', alt: 'Pendampingan PSC 119 MEMS Di PORPROV NTB', title: 'Events' },
      { source: 'assets/img/galeri/events/pendampingan_PSC_119_MEMS_di_PORPROV_NTB/3.jpg', alt: 'Pendampingan PSC 119 MEMS Di PORPROV NTB', title: 'Events' },

      { source: 'assets/img/galeri/events/penyuluhan_geriatri_di_pantri_werdha/1.jpg', alt: 'Penyuluhan Geriatri Di Pantri Werdha', title: 'Events' },
      { source: 'assets/img/galeri/events/penyuluhan_geriatri_di_pantri_werdha/2.jpg', alt: 'Penyuluhan Geriatri Di Pantri Werdha', title: 'Events' },
  
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/1.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/2.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/3.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/4.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/5.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/6.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/7.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },
      { source: 'assets/img/galeri/events/peresmian_gedung_PSC_119_MEMS/8.jpg', alt: 'Peresmian Gedung PSC 119 MEMS', title: 'Events' },

      { source: 'assets/img/galeri/events/promo_khitan_2018/1.jpg', alt: 'Promo Khitan 2018', title: 'Events' },
      { source: 'assets/img/galeri/events/promo_khitan_2018/2.jpg', alt: 'Promo Khitan 2018', title: 'Events' },
  
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/1.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/2.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/3.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/4.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/5.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/6.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/7.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/8.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/9.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_dan_gempa_lombok/10.jpg', alt: 'PSC 119 MEMS dan gempa lombok', title: 'Events' },

      { source: 'assets/img/galeri/events/PSC_119_MEMS_goes_to_gelar_inovasi_NTB/1.jpg', alt: 'PSC 119 MEMS goes To Gelar Inovasi NTB', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_goes_to_gelar_inovasi_NTB/2.jpg', alt: 'PSC 119 MEMS goes To Gelar Inovasi NTB', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_goes_to_gelar_inovasi_NTB/3.jpg', alt: 'PSC 119 MEMS goes To Gelar Inovasi NTB', title: 'Events' },
      { source: 'assets/img/galeri/events/PSC_119_MEMS_goes_to_gelar_inovasi_NTB/4.jpg', alt: 'PSC 119 MEMS goes To Gelar Inovasi NTB', title: 'Events' },
     
      { source: 'assets/img/galeri/events/simulasi_pemadam_kebakaran/1.jpg', alt: 'Simulasi Pemadam Kebakaran', title: 'Events' },
      { source: 'assets/img/galeri/events/simulasi_pemadam_kebakaran/2.jpg', alt: 'Simulasi Pemadam Kebakaran', title: 'Events' },
      { source: 'assets/img/galeri/events/simulasi_pemadam_kebakaran/3.jpg', alt: 'Simulasi Pemadam Kebakaran', title: 'Events' },

      { source: 'assets/img/galeri/events/wall_of_arts/1.jpg', alt: 'Wall Of Arts', title: 'Events' },
      { source: 'assets/img/galeri/events/wall_of_arts/2.jpg', alt: 'Wall Of Arts', title: 'Events' },
      { source: 'assets/img/galeri/events/wall_of_arts/3.jpg', alt: 'Wall Of Arts', title: 'Events' },
      

    ];

    this.images2 = [
      { source: 'assets/img/galeri/pelayanan_fasilitas/BDRS/1.jpg', alt: 'Bank Darah RS', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/BDRS/2.jpg', alt: 'Bank Darah RS', title: 'Fasilitas & Pelayanan' },
     
      { source: 'assets/img/galeri/pelayanan_fasilitas/cathlab-PJT/1.jpg', alt: 'CathLab PJT', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/cathlab-PJT/2.jpg', alt: 'CathLab PJT', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/cathlab-PJT/2.jpg', alt: 'CathLab PJT', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/depan_rs/1.jpg', alt: 'Depan RS', title: 'Fasilitas & Pelayanan' },
  
      { source: 'assets/img/galeri/pelayanan_fasilitas/direktur_managemen/1.jpg', alt: 'Direktur Managemen', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/direktur_managemen/2.jpg', alt: 'Direksi', title: 'Fasilitas & Pelayanan' },
    
      { source: 'assets/img/galeri/pelayanan_fasilitas/fo/1.jpg', alt: 'Front Office', title: 'Fasilitas & Pelayanan' },
    
      { source: 'assets/img/galeri/pelayanan_fasilitas/hemodialisa/1.jpg', alt: 'Hemodialisa', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/hemodialisa/2.jpg', alt: 'Hemodialisa', title: 'Fasilitas & Pelayanan' },
    
      { source: 'assets/img/galeri/pelayanan_fasilitas/hyperbaric_chamber/1.jpg', alt: 'Hyperbaric Chamber', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/hyperbaric_chamber/2.jpg', alt: 'Hyperbaric Chamber', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/hyperbaric_chamber/3.jpg', alt: 'Hyperbaric Chamber', title: 'Fasilitas & Pelayanan' },
    
      { source: 'assets/img/galeri/pelayanan_fasilitas/inseminasi/1.jpg', alt: 'Inseminasi', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/inseminasi/2.jpg', alt: 'Inseminasi', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/inseminasi/3.jpg', alt: 'Inseminasi', title: 'Fasilitas & Pelayanan' },
    
      { source: 'assets/img/galeri/pelayanan_fasilitas/irna_1a/1.jpg', alt: 'IRNA 1A', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/irna_1a/2.jpg', alt: 'IRNA 1A', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/irna_1a/3.jpg', alt: 'IRNA 1A', title: 'Fasilitas & Pelayanan' },

      
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/1.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/2.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/3.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/4.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/5.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/6.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/7.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/8.jpg', alt: 'ILaboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/8.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/9.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/10.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/lab/11.jpg', alt: 'Laboratorium', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/loket/1.jpg', alt: 'Loket Pendaftaran', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/mesjid/1.jpg', alt: 'Mesjid', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/mesjid/2.jpg', alt: 'Mesjid', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/mesjid/3.jpg', alt: 'Mesjid', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/penerbangan/1.jpg', alt: 'Penerbangan', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/penerbangan/2.jpg', alt: 'Penerbangan', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/penerbangan/3.jpg', alt: 'Penerbangan', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/poli_eksekutif/1.jpg', alt: 'Poli Eksekutif', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/poli_eksekutif/2.jpg', alt: 'Poli Eksekutif', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/poli_eksekutif/3.jpg', alt: 'Poli Eksekutif', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/poli_geriatri/1.jpg', alt: 'Poli Geriatri', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/poli_geriatri/2.jpg', alt: 'Poli Geriatri', title: 'Fasilitas & Pelayanan' },
    
      { source: 'assets/img/galeri/pelayanan_fasilitas/PSC_119_MEMS/1.jpg', alt: 'PSC_119_MEMS', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/PSC_119_MEMS/2.jpg', alt: 'PSC_119_MEMS', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/PSC_119_MEMS/3.jpg', alt: 'PSC_119_MEMS', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/radiologi/1.jpg', alt: 'Radiologi', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/radiologi/2.jpg', alt: 'Radiologi', title: 'Fasilitas & Pelayanan' },
     
      { source: 'assets/img/galeri/pelayanan_fasilitas/rehabilitasi_medik/1.jpg', alt: 'Rehabilitasi Medik', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/rehabilitasi_medik/2.jpg', alt: 'Rehabilitasi Medik', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/rehabilitasi_medik/3.jpg', alt: 'Rehabilitasi Medik', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/rehabilitasi_medik/4.jpg', alt: 'Rehabilitasi Medik', title: 'Fasilitas & Pelayanan' },

      { source: 'assets/img/galeri/pelayanan_fasilitas/ruang_operasi/1.jpg', alt: 'Ruang Operasi', title: 'Fasilitas & Pelayanan' },
      { source: 'assets/img/galeri/pelayanan_fasilitas/ruang_operasi/2.jpg', alt: 'Ruang Operasi', title: 'Fasilitas & Pelayanan' },

    ];
  }

}
