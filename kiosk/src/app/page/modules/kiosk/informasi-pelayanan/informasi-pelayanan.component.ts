import { Component, OnInit, Inject, forwardRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import $ from "jquery";
import { HttpClient, AlertService } from 'src/app/helper';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-informasi-pelayanan',
  templateUrl: './informasi-pelayanan.component.html',
  styleUrls: ['./informasi-pelayanan.component.scss']
})
export class InformasiPelayananComponent implements OnInit {
  showFasilitasLayanan: boolean = false
  showTarif: boolean

  formGroup: FormGroup;
  listRuangan: any[]//SelectItem[]
  listJenisPel: any[]//SelectItem[]
  listKelas: any[]//SelectItem[]
  // dataSource: any[]
  loading: boolean = false
  dataSource: MatTableDataSource<gridTarif>;
  dataSourcePoli: MatTableDataSource<gridPoli>;
  displayedColumns = ['namaproduk', 'namakelas', 'jenispelayanan', 'namaruangan', 'hargalayanan'];
  // displayedColumnsBor = ['bulan', 'bor', 'alos', 'bto', 'toi', 'gdr', 'ndr'];
  // dataSourceBor: MatTableDataSource<dataGridBorLos>;
  showPoli: boolean
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  listPoli: any[]
  showPenunjang:boolean
  showDokter:boolean
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private toastr: AlertService) {

  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      'namaProduk': new FormControl(null),
      'kelas': new FormControl(null),
      'jenisPelayanan': new FormControl(null),
      'ruangan': new FormControl(null),

    });
    this.getCombo()
  }
  getCombo() {

    this.httpService.get("medifirst2000/kiosk/get-combo").subscribe(e => {
      this.listKelas = e.kelas
      this.listRuangan = e.ruangan
      // this.listRuangan.push({ label: '--Filter Ruangan --', value: null });
      // e.ruangan.forEach(response => {
      //   this.listRuangan.push({
      //     label: response.namaruangan, value: {
      //       id: response.id,
      //       namaruangan: response.namaruangan,
      //     }
      //   });
      // });
      // this.listKelas.push({ label: '--Filter Kelas --', value: null });
      // e.kelas.forEach(response => {
      //   this.listKelas.push({
      //     label: response.namakelas, value: {
      //       id: response.id,
      //       namakelas: response.namakelas,
      //     }
      //   });
      // });
    }, error => {
      this.listKelas = []
      this.listRuangan = []
    })

    this.listJenisPel = [{
      id: 1, jenispelayanan: 'Reguler',
    },
    {
      id: 2, jenispelayanan: 'Eksekutif',
    }]
    // this.listJenisPel = [
    //   {
    //     label: 'Reguler', value: {
    //       id: 1, jenispelayanan: 'Reguler',
    //     }
    //   },
    //   {
    //     label: 'Eksekutif', value: {
    //       id: 2, jenispelayanan: 'Eksekutif'
    //     }
    //   }
    // ]

  }
  getTarif() {

    this.showTarif = true
    this.cariTarif()
  }
  clearTarif() {
    this.formGroup.reset()
  }
  cariTarif() {
    this.loading = true
    let produk = ''
    if (this.formGroup.get('namaProduk').value)
      produk = this.formGroup.get('namaProduk').value

    let kelas = ''
    if (this.formGroup.get('kelas').value)
      kelas = this.formGroup.get('kelas').value.id
    let ruangan = ''
    if (this.formGroup.get('ruangan').value)
      ruangan = this.formGroup.get('ruangan').value.id

    let jenisPel = ''
    if (this.formGroup.get('jenisPelayanan').value)
      jenisPel = this.formGroup.get('jenisPelayanan').value.id

    this.httpService.get('medifirst2000/kiosk/get-tarif?produkId=&namaproduk='
      + produk + '&kelasId=' + kelas + '&jenispelayananId=' + jenisPel + '&ruanganId=' + ruangan).subscribe(e => {
        this.loading = false
        // this.dataSource = e.data
        for (let i = 0; i < e.data.length; i++) {
          const element = e.data[i];
          element.hargalayanan = this.formatRupiah(element.hargalayanan, 'Rp. ');

        }
        this.dataSource = new MatTableDataSource(e.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => {
        this.loading = false

      })
  }
  formatRupiah(value, currency) {
    return currency + "" + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  getJadwalPelayanan() {
    // this.toastr.warn('Info', 'Masih Dalam Perbaikan')
    let listdp = [3, 27,24]
    this.showPoli = true
    this.httpService.get('transaksi/registrasipasien/get-data-combo-new').subscribe(e => {
      for (let i = 0; i < e.ruanganrajal.length; i++) {
        const element = e.ruanganrajal[i];
        if (listdp.includes(e.ruanganrajal[i].objectdepartemenfk)  ) {
          e.ruanganrajal.splice([i], 1)
        }
      }
      this.listPoli = e.ruanganrajal
    })
  }
}

export interface gridTarif {
  namaproduk: string;
  namakelas: string;
  jenispelayanan: string;
  namaruangan: string;
  hargalayanan: number;
}

export interface gridPoli {
  namaruangan: string;

}
