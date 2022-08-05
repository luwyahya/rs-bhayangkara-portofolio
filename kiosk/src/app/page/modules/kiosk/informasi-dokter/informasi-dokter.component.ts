import { Component, OnInit, Inject, forwardRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import $ from "jquery";
import { HttpClient } from 'src/app/helper';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import * as moment from 'moment'
@Component({
    selector: 'app-informasi-dokter',
    templateUrl: './informasi-dokter.component.html',
    styleUrls: ['./informasi-dokter.component.scss']
})
export class InformasiDokterComponent implements OnInit {
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
    dataSource: MatTableDataSource<gridPasiens>;
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
        var arrDetailRuangan = [];
        this.isShowKamar = true
        
        var arrDR = {};
        this.httpService.get('medifirst2000/kiosk/get-view-dpjp-ruangan').subscribe(e => {
            var data2: any = e
            console.log(data2)
            for(let y = 0; y < data2.length; y++){
                arrDR = {
                    jumlah :  data2[y].jumlah,
                    namaruangan :  data2[y].namaruangan,
                    objectpegawaifk :  data2[y].objectpegawaifk
                }
                arrDetailRuangan.push(arrDR)
            }
                          
        })

        this.httpService.get('medifirst2000/kiosk/get-view-dpjp').subscribe(e => {
            var data: any = e;
            var arrRuang = [];
            var DPR = [];
            
            var arrayM = {};
            var ruangan = [];
            var arrDPR = {};
            
            
            var stt = true;
            for (var i = 0; i < data.length; i++) {
            var DPR = [];
               for(var j=0; j < arrDetailRuangan.length; j++){
                
                if(data[i].iddpjp == arrDetailRuangan[j].objectpegawaifk){                    
               
                    arrDPR = {
                        namaruangan : arrDetailRuangan[j].namaruangan,
                        jumlah : arrDetailRuangan[j].jumlah
                    }
                   DPR.push(arrDPR)
                   // console.log(DPR)
                }                
                      
               }
                arrayM = {                    
                    iddpjp: data[i].iddpjp,
                    namalengkap: data[i].namalengkap,                    
                    qtyPasien: data[i].pasien,             
                    bg: 'bg-aqua-gradient',                       
                    dpr : DPR
                };
                arrRuang.push(arrayM)
            }


           
            
            this.isShowKamar = false
            console.log("arrRuang")
            console.log(arrRuang)
            this.dataKamar = arrRuang            
        })
    }
    lookDetail(iddpjp, namalengkap) {
        this.httpService.get("medifirst2000/rawatinap/get-daftar-pasien-masih-dirawat-dpjp?iddpjp=" + iddpjp).subscribe(e => {
            if (e.data.length == 0)
                return
            else {
                this.displayDialog = true
                this.ruangans = namalengkap
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

export interface gridPasiens {
    noregistrasi: string;
    tglregistrasi: string;


    nocm: string;
    namaruangan: string;
    namapasien: string;
    namakelas: string;
    namakamar: string;
    namabed: string;

}
