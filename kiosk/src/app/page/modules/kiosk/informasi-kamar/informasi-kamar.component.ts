import { Component, OnInit, Inject, forwardRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import $ from "jquery";
import { HttpClient } from 'src/app/helper';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import * as moment from 'moment'
@Component({
    selector: 'app-informasi-kamar',
    templateUrl: './informasi-kamar.component.html',
    styleUrls: ['./informasi-kamar.component.scss']
})
export class InformasiKamarComponent implements OnInit {
    dataKamar: any;
    jumlahTempatTidur: any = 0;
    JumlahIsi: any = 0;
    JumlahKosong: any = 0;
    totalKamar: any = 0
    isShowKamar: boolean
    apiTimer: any;
    counter = 10;
    loading: boolean = false
    displayDialog: boolean
    dataSource: MatTableDataSource<gridPasien>;
    ruangans: any

    displayedColumns = ['noregistrasi', 'tglregistrasi', 'nocm', 'namaruangan', 'namapasien', 'namakelas', 'namakamar', 'namabed'];
    // displayedColumnsBor = ['bulan', 'bor', 'alos', 'bto', 'toi', 'gdr', 'ndr'];
    // dataSourceBor: MatTableDataSource<dataGridBorLos>;
    showPoli: boolean
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(@Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpClient) {

    }

    ngOnInit() {
        this.apiTimer = setInterval(() => {
            this.getData()
        }, (this.counter * 18000)); //60 detik
        this.getData()
    }
    getData() {
        this.isShowKamar = true
        this.httpService.get('medifirst2000/kiosk/get-view-bed-tea').subscribe(e => {
            var data: any = e[0];
            this.jumlahTempatTidur = data.kamartotal;
            this.JumlahIsi = data.kamarisi;
            this.JumlahKosong = data.kamarkosong;
            // this.jumlahTempatTidur=this.jumlahTempatTidur.kamartotal
        })
        this.httpService.get('medifirst2000/kiosk/get-view-bed').subscribe(e => {
            var data: any = e;
            var arrRuang = [];
            var arrKamar = [];
            var arrTT = [];
            var arr = [];
            var arrayS = {};
            var arrayK = {};
            var arrayM = {};
            var stt = true;
            for (var i = 0; i < data.length; i++) {
                arrayM = {
                    idtempattidur: data[i].idtempattidur,
                    idruangan: data[i].idruangan,
                    namaruangan: data[i].namaruangan,
                    idkamar: data[i].idkamar,
                    namakamar: data[i].namakamar,
                    reportdisplay: data[i].reportdisplay,
                    nomorbed: data[i].nomorbed,
                    idstatusbed: data[i].idstatusbed,
                    statusbed: data[i].statusbed
                };
                arrTT.push(arrayM)
            }
            for (var i = 0; i < data.length; i++) {
                //kamar
                stt = true;
                for (var j = 0; j < arrKamar.length; j++) {
                    if (data[i].idkamar == arrKamar[j].idkamar) {
                        arrKamar[j].qtyBed = arrKamar[j].qtyBed + 1;
                        if (data[i].idstatusbed == 1) {
                            arrKamar[j].isi = arrKamar[j].isi + 1;
                        } else {
                            arrKamar[j].kosong = arrKamar[j].kosong + 1;
                        }
                        stt = false;
                    }
                }
                if (stt == true) {
                    var arrTTT = [];
                    for (var j = 0; j < arrTT.length; j++) {
                        if (arrTT[j].idkamar == data[i].idkamar) {
                            arrTTT.push(arrTT[j]);
                        }
                    }

                    if (data[i].idstatusbed == 1) {
                        arrayK = {
                            idruangan: data[i].idruangan,
                            idkamar: data[i].idkamar,
                            namakamar: data[i].namakamar,
                            idkelas: data[i].idkelas,
                            namakelas: data[i].namakelas,
                            qtyBed: 1,
                            isi: 1,
                            kosong: 0,
                            tempattidur: arrTTT
                        };
                    } else {
                        arrayK = {
                            idruangan: data[i].idruangan,
                            idkamar: data[i].idkamar,
                            namakamar: data[i].namakamar,
                            idkelas: data[i].idkelas,
                            namakelas: data[i].namakelas,
                            qtyBed: 1,
                            isi: 0,
                            kosong: 1,
                            tempattidur: arrTTT
                        };
                    }
                    arrKamar.push(arrayK);
                }


            }
            var sama = false
            var newAr = [];
            console.log(arrKamar)
            for (let i = 0; i < arrKamar.length; i++) {
                sama = false;
                for (let z = 0; z < newAr.length; z++) {
                    if (arrKamar[i].namakelas == newAr[z].namakelas && arrKamar[i].idruangan == newAr[z].idruangan) {
                        sama = true;
                        // newAr[z].namakelas = arrKamar[i].namakelas
                        newAr[z].qtyBed = newAr[z].qtyBed + arrKamar[i].qtyBed
                        newAr[z].kosong = newAr[z].kosong + arrKamar[i].kosong
                        newAr[z].isi = newAr[z].isi + arrKamar[i].isi
                    }
                }
                if (sama == false) {
                    var datas = {
                        namakelas: arrKamar[i].namakelas,
                        idruangan: arrKamar[i].idruangan,
                        qtyBed: arrKamar[i].qtyBed,
                        isi: arrKamar[i].isi,
                        kosong: arrKamar[i].kosong,
                    }
                    newAr.push(datas);
                }
            }
            console.log(newAr)

            for (var i = 0; i < data.length; i++) {
                //ruang
                stt = true;
                for (var j = 0; j < arrRuang.length; j++) {
                    if (data[i].idruangan == arrRuang[j].idruangan) {
                        arrRuang[j].qtyBed = arrRuang[j].qtyBed + 1;
                        if (data[i].idstatusbed == 1) {
                            arrRuang[j].isi = arrRuang[j].isi + 1;
                        } else {
                            arrRuang[j].kosong = arrRuang[j].kosong + 1;
                        }
                        stt = false;
                    }
                }
                if (stt == true) {
                    var arrTTT = [];
                    for (var j = 0; j < newAr.length; j++) {
                        if (newAr[j].idruangan == data[i].idruangan) {
                            arrTTT.push(newAr[j]);
                        }
                    }
                    if (data[i].idstatusbed == 1) {
                        arrayS = {
                            idruangan: data[i].idruangan,
                            namaruangan: data[i].namaruangan,
                            qtyBed: 1,
                            isi: 1,
                            kosong: 0,
                            kamar: arrTTT
                        };
                    } else {
                        arrayS = {
                            idruangan: data[i].idruangan,
                            namaruangan: data[i].namaruangan,
                            qtyBed: 1,
                            isi: 0,
                            kosong: 1,
                            kamar: arrTTT
                        };
                    }

                    arrRuang.push(arrayS);
                }

            }
            let warna = ['sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin',
                'warna1', 'warna2', 'warna3', 'warna4',
                'sales', 'views', 'users', 'checkin']
            for (let i = 0; i < arrRuang.length; i++) {
                arrRuang[i].warna = warna[i]
                if (arrRuang[i].qtyBed == arrRuang[i].isi)
                    arrRuang[i].bg = 'bg-maroon-gradient'
                else
                    arrRuang[i].bg = 'bg-aqua-gradient'

            }
            this.isShowKamar = false
            console.log(arrRuang)
            this.httpService.get('medifirst2000/kiosk/get-jumlah-bed-terisi').subscribe(e => {
                var data2: any = e.data
                console.log(data2)
                for(let x = 0; x < arrRuang.length; x++){
                    for(let y = 0; y < data2.length; y++){
                        if (arrRuang[x].idruangan == data2[y].idruangan){
                            arrRuang[x].isi = data2[y].isi
                            arrRuang[x].kosong = arrRuang[x].qtyBed - arrRuang[x].isi
                        }
                    }
                }
            })
            console.log(arrRuang)
            this.dataKamar = arrRuang
            this.totalKamar = arrRuang.length
        })
    }
    lookDetail(idRU, namaruangan) {
        this.httpService.get("medifirst2000/rawatinap/get-daftar-pasien-masih-dirawat?ruanganId=" + idRU).subscribe(e => {
            if (e.data.length == 0)
                return
            else {
                this.displayDialog = true
                this.ruangans = namaruangan
                for (let i = 0; i < e.data.length; i++) {
                    const element = e.data[i];
                    element.tglregistrasi = moment(new Date(element.tglregistrasi)).format('DD-MM-YYY HH:mm')
                }
                this.dataSource = new MatTableDataSource(e.data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }

        })
    }

}

export interface gridPasien {
    noregistrasi: string;
    tglregistrasi: string;


    nocm: string;
    namaruangan: string;
    namapasien: string;
    namakelas: string;
    namakamar: string;
    namabed: string;

}
