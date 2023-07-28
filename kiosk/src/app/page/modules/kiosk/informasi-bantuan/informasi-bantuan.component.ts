import { Component, OnInit, Inject, forwardRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import $ from "jquery";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient, AlertService } from 'src/app/helper';
import { Http } from '@angular/http';
import * as moment from 'moment'
import { SelectItem } from 'primeng/primeng';
import {Configuration} from 'src/app/helper/config'
@Component({
  selector: 'app-informasi-bantuan',
  templateUrl: './informasi-bantuan.component.html',
  styleUrls: ['./informasi-bantuan.component.scss']
})
export class InformasiBantuanComponent implements OnInit {
  formGroup: FormGroup;
  formGroupSep: FormGroup;
  showKeluhan: boolean
  showKontak: boolean
  showPrintUlang: boolean
  showGantiDokter: boolean
  listDokterMelayani: SelectItem[]
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private toastr: AlertService,
    private service: Http,) {

  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      'noRm': new FormControl(null),
      'namaPasien': new FormControl(null),
      'noHp': new FormControl(null),
      'keluhan': new FormControl(null),
      'saran': new FormControl(null),

    });
    this.formGroupSep = this.fb.group({
      'noregistrasi': new FormControl(null),
      'dokterDPJPMelayani': new FormControl(''),
    });

    this.httpService.get("medifirst2000/bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1
      + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + null).subscribe(data => {
        if (data.metaData.code == 200) {
          this.listDokterMelayani = [];
          this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
          data.response.list.forEach(response => {
            this.listDokterMelayani.push({
              label: response.nama, value: {
                'kode': response.kode,
                'nama': response.nama
              }
            });
          });

        } else {
          this.listDokterMelayani = [];
        }

      });

  }
  cetakSep() {
    if (!this.formGroupSep.get('noregistrasi').value && !this.formGroupSep.get('noregistrasi').value) {
      this.toastr.error('Warn', 'Isi No Registrasi')
      return
    }
    if (this.formGroupSep.get('noregistrasi').value.length < 9) {
      this.toastr.error('Warn', 'Isi No Registrasi atau SEP')
      return
    }
    let a = this.formGroupSep.get('noregistrasi').value
    // this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + a + '&view=false').subscribe(e => {
    //   // do something with response
    // });
    
     window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-sep?noregistrasi='
        + a + '&kdprofile=1', '_blank');
  }
  batalRegistrasi() {
    if (!this.formGroupSep.get('noregistrasi').value && !this.formGroupSep.get('noregistrasi').value) {
      this.toastr.error('Warn', 'Isi No Registrasi')
      return
    }
    let a = this.formGroupSep.get('noregistrasi').value
    let push =
    {
      "noregistrasi": a,
    }
    this.httpService.post('medifirst2000/registrasi/batal-periksa-kiosk', push).subscribe(e => {
      debugger
      let x = e.nosep
      this.httpService.delete("medifirst2000/bridging/bpjs/delete-sep?nosep=" + x).subscribe(e => {

      })
    })
  }
  simpan() {

    if (!this.formGroup.get('noRm').value && !this.formGroup.get('namaPasien').value) {
      this.toastr.error('Warn', 'Isi No RM atau Nama Pasien')
      return
    }
    if (!this.formGroup.get('keluhan').value) {
      this.toastr.error('Warn', 'Keluhan harus di isi')
      return
    }
    let data =
    {
      "id": '',
      "alamat": null,
      "email": null,
      "keluhan": this.formGroup.get('keluhan').value,
      "namapasien": this.formGroup.get('namaPasien').value,
      "norm": this.formGroup.get('noRm').value,
      "notlp": this.formGroup.get('noHp').value,
      "objectruanganfk": null,
      "saran": this.formGroup.get('saran').value,
      "objectpekerjaanfk": null,
      "umur": null,
      "tglkeluhan": moment(new Date()).format('YYYY-MM-DD HH:mm'),
      "tglorder": null,
      "notlpkntr": null,
      "objectjeniskelaminfk": null
    }
    let objSave = {
      data: data,

    }
    
    this.httpService.post('medifirst2000/humas/save-keluhan-pelanggan', objSave).subscribe(e => {

    })
  }

  saveGantiDokter() {

    if (!this.formGroupSep.get('noregistrasi').value) {
      this.toastr.error('Warn', 'Isi No Registrasi')
      return
    }
    if (!this.formGroupSep.get('dokterDPJPMelayani').value) {
      this.toastr.error('Warn', 'Dokter Melayani')
      return
    }

    let data =
    {
      'noregistrasi': this.formGroupSep.get('noregistrasi').value,
      'kodedpjpmelayani': this.formGroupSep.get('dokterDPJPMelayani').value.kode,
      'namadjpjpmelayani': this.formGroupSep.get('dokterDPJPMelayani').value.nama,
    }
    let objSave = {
      data: data,

    }
    this.httpService.post('medifirst2000/registrasi/save-dokter-melayani', objSave).subscribe(e => {

    })
  }

}
