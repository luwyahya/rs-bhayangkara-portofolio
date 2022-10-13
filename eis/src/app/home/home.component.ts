import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import * as Prism from 'prismjs';
import { AppService } from '../shared/app.service';
import { Chart, Highcharts, MapChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as moment from 'moment';
// declare var $:JQueryStatic;

import * as $ from 'jquery';

// var $ = require('jquery');
// require('jvectormap-next')($);
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})


export class HomeComponent implements AfterViewInit, OnInit {
    tglPencarian: any = new Date()
    apiTimer: any;
    counter = 10;
    colorNyieun = ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
        '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
        '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
        '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
        '#13ec30', '#7faf7a', '#408055', '#09790e'];
    // colorNyieun = ['#C71585'];
    // colorNyieun = ['#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
    //     '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
    //     '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
    //     '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
    //     '#FF0000', '#FF0000', '#FF0000', '#FF0000'];
    // ['#7cb5ec', '#FF0000', '#C71585', '#434348', '#90ed7d', '#f7a35c',
    // '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b',
    // '#91e8e1', '#CD5C5C', '#FF69B4', '#FF8C00', '#9370DB', '#ADFF2F',
    // '#00FF00', '#9ACD32', '#66CDAA', '#00FFFF', '#4682B4', '#800000',
    // '#CD853F', '#191970', '#1E90FF', '#00CED1']
    colorPenjadwalan = ['#00FF00', '#00CED1', '#6495ED', '#D2B48C', '#9932CC'];
    displayedColumns = ['namaruangan', 'total', 'belumperiksa', 'diperiksa', 'batalregistrasi'];
    dataSource: MatTableDataSource<dataGridInfoRuangan>;
    // displayedColumnsBor = ['bulan', 'bor', 'alos', 'bto', 'toi', 'gdr', 'ndr'];
    // dataSourceBor: MatTableDataSource<dataGridBorLos>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // @ViewChild(MatPaginator) paginator2: MatPaginator;
    // @ViewChild(MatSort) sort2: MatSort;
    dataPasien: any;
    countRajal: any;
    countIgd: any;
    countRanap: any;
    countRadiologi: any;
    countLab: any;
    countBedah: any;
    countRehab: any;
    countTotal: any;
    countGeriatri: any;
    countCeweDewasa: any;
    countAnakLaki: any;
    countAnakCewe: any;
    countBalitaLaki: any;
    countBalitaCewe: any;
    ttKelas1: any;
    ttKelas2: any;
    ttKelas3: any;
    ttVipA: any;
    ttVipB: any;
    ttNonKelas: any;
    ttJumlah: any;
    ttJumlahCovid: any;
    ttKelas1a: any;
    ttKelas2a: any;
    ttKelas3a: any;
    ttVipAa: any;
    ttVipBa: any;
    ttJumlahVip: any
    ttJumlahVipKosong: any;
    ttJumlahVipPakai: any
    ttJumlahVVip: any
    ttJumlahVVipKosong: any
    ttJumlahVVipPakai: any
    ttNonKelasa: any;
    ttJumlaha: any;
    ttJumlahaCovid: any;
    ttKelas1b: any;
    ttKelas2b: any;
    ttKelas3b: any;
    ttVipAb: any;
    ttVipBb: any;
    ttNonKelasb: any;
    ttJumlahb: any;
    ttJumlahbCovid: any;
    gridInfoKedatangan: any;
    gridBorLos: any;
    tempatTidurTerpakai: any;
    tempatTidurKosong: any;
    tempatTidurKosongCovid: any;
    trendKunjungan: any;
    ttJumlahsiap: any;
    ttJumlahsiapCovid: any;
    trenKunjunganCovid: any;
    trenKunjunganCovidPulang: any;
    public now: Date = new Date();
    tanggal = new Date().toLocaleDateString();
    arr = this.tanggal.split('/');
    series = [];
    categories = [];
    data1 = [];
    data2 = [];
    data3 = [];
    data4 = [];
    data5 = [];
    countLakiDewasa: any
    countGeriLaki: any
    colors = Highcharts.getOptions().colors;
    dataChartKunjunganRs: any;
    resChartKunjunganRs: any;
    chartKunjunganRs: any;
    chart: any;
    chartCovid: any;
    chartCovidPulang: any;
    chartPerbulan: any;
    chartKunjungnJenisPasien: any;
    datachartKunjungnJenisPasien: any;
    chartKunjungnJenisPasienRekanan: any;
    datachartKunjungnJenisPasienRekanan: any;
    chartKunjungnJenisPasienGolongan: any;
    datachartKunjungnJenisPasienGolongan: any;
    chartKunjungnJenisPasienGolonganCovid: any;
    datachartKunjungnJenisPasienGolonganCovid: any;
    chartKunjungnJenisPasienCsr: any;
    datachartKunjungnJenisPasienCsr: any;
    data10PerujukBpjs: any;
    chart10PerujukBpjs: any;
    chart10Diagnosa: any;
    data10Diagnosa: any;
    dataKunjunganRanap: any;
    chartKunjunganRanap: any;
    dataKunjunganSatker: any;
    chartKunjunganSatker: any;
    chartJenisPelayanan: any;
    dataJenisPelayanan: any;
    chartJenisPenjadwalanPie: any;
    dataJenisPenjadwalanPie: any;
    chartJenisPenjadwalanLine: any;
    datajenisPenjadwalanLine: any;
    dataPenjadwalan: any;
    tahun: any;
    JmlBulan: number;
    JmlBOR: string;
    JmlLOS: string;
    JmlTOI: string;
    JmlNDR: string;
    JmlGDR: string;
    JmlBTO: string;
    chartCaraDaftarRajal: any;
    chartCaraDaftarRanap: any;
    chartCaraDaftarIgd: any;
    chartCaraDaftarRehab: any;
    chartCaraDaftarLab: any;
    chartCaraDaftarRad: any;
    isShowTrend = false;
    isShowTrendCovid = false;
    isShowTrendCovidPulang = false;
    isShowTrendshowPerbulan = false;
    isShowTrendshowPerbulanx = false;
    isShowCaraDaftar = false;
    mapChartDKI: any;
    dataMap: any;
    lat: number = 51.678418;
    lng: number = 7.809007;
    chartDetailKelompokPasien: any;
    chartDetailKelompokPasienRekanan: any;
    chartDetailKelompokPasienGolongan: any;
    chartDetailKelompokPasienGolonganCovid: any;
    chartDetailKelompokPasienCsr: any;
    showRawatJalan: boolean = false;
    showIGD: boolean = false;
    showRawatInap: boolean = false;
    showLab: boolean = false;
    showRad: boolean = false;
    showRehab: boolean = false;
    dataTableRajal: any;
    dataTableFarmasi: any;
    totalRecords: any;
    idRuanganSearch: any;
    items: any;
    showTerlayani: boolean = false
    showFarmasi: boolean = false;
    showMendaftar: boolean = true;
    dataPasienTerlayni: any;
    countRajalTerlayani: number = 0;
    countIgdTerlayani: number = 0;
    countRanapTerlayani: number = 0;
    countRadiologiTerlayani: number = 0;
    countLabTerlayani: number = 0;
    countBedahTerlayani: number = 0;
    countRehabTerlayani: number = 0;
    countTotalTerlayani: number = 0;
    countFarmasiTerlayani: number = 0;
    countMasihDirawatTerlayani: number = 0;
    types: any[];
    chartDemografi: any;
    colsRegister: any
    dataSourceRegister: any
    dataSourceAnggaran: any;
    rowGroupRegister: any;
    chartKunjunganBerdasarkan: any
    listNamaKunjungan: any = [{ nama: 'Asal Rujukan' }, { nama: 'Diagnosa' }, { nama: 'Tindakan' }, { nama: 'Wilayah' }]
    listBukuRegister: any = [{ nama: 'Ruangan' }, { nama: 'Instalasi' }]
    listAnggaran: any = [{ nama: 'Program Dukungan Manajemen' }, { nama: 'Program Modernisasi Almatsus dan Sarana Prasarana Polri' }]
    itemBerdasarkan: any
    item: any = {
        tgl: new Date()
    }
    carieuy: any = {
        tgl: new Date(),
        tglLast: new Date()
    }
    dataSourceFusion: Object
    listPropinsi: any
    listKabupaten: any
    listKecamatan: any
    chartDemografiDiagnosa: any
    chartBarberJohn: any
    listGambar: any = ['assets/img/icon-pasien.png', 'assets/img/icon-pasien-emergency.png',
        'assets/img/icon-pasien-rawat-inap.png', 'assets/img/icon-radiologi.png', 'assets/img/icon-laboratorium.png',
        'assets/img/icon-pasien.png', 'assets/img/icon-pasien-emergency.png',
        'assets/img/icon-pasien-rawat-inap.png', 'assets/img/icon-radiologi.png', 'assets/img/icon-laboratorium.png',
        'assets/img/icon-pasien.png', 'assets/img/icon-pasien-emergency.png',
        'assets/img/icon-pasien-rawat-inap.png', 'assets/img/icon-radiologi.png', 'assets/img/icon-laboratorium.png',
        'assets/img/icon-pasien.png', 'assets/img/icon-pasien-emergency.png',
        'assets/img/icon-pasien-rawat-inap.png', 'assets/img/icon-radiologi.png', 'assets/img/icon-laboratorium.png',
        'assets/img/icon-pasien.png', 'assets/img/icon-pasien-emergency.png',
        'assets/img/icon-pasien-rawat-inap.png', 'assets/img/icon-radiologi.png', 'assets/img/icon-laboratorium.png',]
    listCountPengunjung: any = []
    listCountKunjungan: any = []
    // listWarna: any = [
    //     'bg-aqua-gradient', 'bg-green-gradient', 'bg-blue-active', 'bg-yellow-gradient', 'bg-red-gradient',
    //     'bg-light-blue-gradient', 'bg-maroon-gradient', 'bg-purple-gradient', 'bg-teal-gradient',
    //     'bg-aqua-gradient', 'bg-green-gradient', 'bg-blue-active', 'bg-yellow-gradient', 'bg-red-gradient',
    //     'bg-light-blue-gradient', 'bg-maroon-gradient', 'bg-purple-gradient', 'bg-teal-gradient',
    //     'bg-aqua-gradient', 'bg-green-gradient', 'bg-blue-active', 'bg-yellow-gradient', 'bg-red-gradient',
    //     'bg-light-blue-gradient', 'bg-maroon-gradient', 'bg-purple-gradient', 'bg-teal-gradient',]
    listWarna: any = [
        'bg-aqua-gradient', 'bg-green-gradient',
        'bg-blue-active', 'bg-blue-active', 'bg-green-gradient',
        'bg-green-gradient', 'bg-maroon-gradient', 'bg-maroon-gradient', 'bg-red-gradient',
        'bg-red-gradient', 'bg-green-gradient', 'bg-green-active', 'bg-green-gradient', 'bg-green-gradient',
        'bg-light-blue-gradient', 'bg-blue-gradient', 'bg-aqua-gradient', 'bg-aqua-active', 'bg-yellow-gradient', 'bg-yellow-gradient',
        'bg-yellow-gradient', 'bg-aqua-gradient', 'bg-purple-gradient',
        'bg-light-blue-gradient', 'bg-maroon-gradient', 'bg-purple-gradient', 'bg-teal-gradient',]
    constructor(public appservice: AppService) {
        this.types = [
            { label: 'Kunjungan', value: this.showTerlayani = true, icon: 'fa fa-fw fa-users' },
            { label: 'Pengunjung', value: this.showTerlayani = false, icon: 'fa fa-fw fa-user' },

        ];
        // this.addMaps()
        // this.appservice.getTransaksi('eis/get-combo-address').subscribe(data => {
        //     var result: any = data
        //     this.listPropinsi = result.propinsi
        //     this.listKabupaten = result.kotakabupaten
        //     this.listKecamatan = result.kecamatan
        // })
    }
    searchPropinsi(event) {
        this.appservice.getTransaksi('eis/get-propinsi?params=' + event.query).subscribe(data => {
            this.listPropinsi = data
        })
    }
    searchKota(event) {
        this.appservice.getTransaksi('eis/get-kota?params=' + event.query).subscribe(data => {
            this.listKabupaten = data
        })
    }
    searchKecamatan(event) {
        this.appservice.getTransaksi('eis/get-kecamatan?params=' + event.query).subscribe(data => {
            this.listKecamatan = data
        })
    }


    ngOnInit() {
        // this.colsRegister = [
        //     { field: 'vin', header: 'Vin' },
        //     { field: 'year', header: 'Year' },
        //     { field: 'brand', header: 'Brand' },
        //     { field: 'color', header: 'Color' }
        // ];

        this.apiTimer = setInterval(() => {
            let tglPencarian = `&tgl=${moment(this.carieuy.tgl).format('YYYY-MM-DD')}&tglAkhir=${moment(this.carieuy.tglLast).format('YYYY-MM-DD')}`
            this.getAllChartData(tglPencarian)

        }, (this.counter * 30000)); //60 detik

        this.items = [
            {
                label: 'Pasien Daftar', icon: 'fa fa-refresh', command: () => {
                    // this.update();
                }
            },
            {
                label: 'Antrian', icon: 'fa fa-close', command: () => {
                    // this.delete();
                }
            }
        ];
        this.countRajal = 0;
        this.countIgd = 0;
        this.countRanap = 0;
        this.countRadiologi = 0;
        this.countLab = 0;
        this.countBedah = 0;
        this.countRehab = 0;
        this.countTotal = 0;
        this.countGeriatri = 0;
        this.countCeweDewasa = 0;
        this.countAnakLaki = 0;
        this.countAnakCewe = 0;
        this.countBalitaLaki = 0;
        this.countBalitaCewe = 0;
        this.ttKelas1 = 0;
        this.ttKelas2 = 0;
        this.ttKelas3 = 0;
        this.ttVipA = 0;
        this.ttVipB = 0;
        this.ttNonKelas = 0;
        this.ttJumlah = 0;
        this.ttJumlahCovid = 0;
        this.ttKelas1a = 0;
        this.ttKelas2a = 0;
        this.ttKelas3a = 0;
        this.ttVipAa = 0;
        this.ttVipBa = 0;
        this.ttNonKelasa = 0;
        this.ttJumlaha = 0;
        this.ttJumlahaCovid = 0;
        this.ttKelas1b = 0;
        this.ttKelas2b = 0;
        this.ttKelas3b = 0;
        this.ttVipAb = 0;
        this.ttVipBb = 0;
        this.ttNonKelasb = 0;
        this.ttJumlahb = 0;
        this.ttJumlahbCovid = 0;
        this.ttJumlahVipKosong = 0
        this.ttJumlahVipPakai = 0
        this.ttJumlahVVip = 0
        this.ttJumlahVVipKosong = 0
        this.ttJumlahVVipPakai = 0
        this.ttJumlahsiap = 0;
        this.ttJumlahsiapCovid = 0;
        this.countLakiDewasa = 0
        this.countGeriLaki = 0
        // this.item.bukuRegisTipe = this.listBukuRegister[0]
        // this.item.berdasarkan = this.listNamaKunjungan[0]
        let tglPenc = `&tgl=${moment(this.carieuy.tgl).format('YYYY-MM-DD')}&tglAkhir=${moment(this.carieuy.tglLast).format('YYYY-MM-DD')}`
        this.getAllChartData(tglPenc)
        // this.getWilayah()
    }
    getCariTgl(e) {
        debugger
        let tglPencarian = `&tgl=${moment(this.carieuy.tgl).format('YYYY-MM-DD')}&tglAkhir=${moment(this.carieuy.tglLast).format('YYYY-MM-DD')}`
        this.getAllChartData(tglPencarian)
    }
    getAllChartData(tgl) {
        this.item.berdasarkan = this.listNamaKunjungan[0]
        this.item.bukuRegisTipe = this.listBukuRegister[0]

        this.getCountPasienDaftar(tgl);
        this.getCountTerlayani(tgl);
        this.getTempatTidur(tgl)
        this.getBorLos(tgl)
        this.getTrendRajal()
        this.getChartPenjadwalan(tgl)
        this.getKunjunganRsandJenisPasien(tgl)
        this.getDiagnosaAsalPerujuk(tgl)
        this.getRegisterPendaftaran(this.item.bukuRegisTipe, tgl)
        this.getKunjunganBerdasarkan(this.item.berdasarkan, tgl)
        this.getTrendCovid()
        this.getTrendCovidPulang()
        // this.getChartBarberJohnson(tgl)

    }
    getChartBarberJohnson(tgl, databor) {


        this.chartBarberJohn = new Chart({
            title: {
                text: ''
            },
            xAxis: {
                min: 1,
                max: 10,
                title: {
                    text: 'TOI'
                }
            },
            yAxis: {
                min: 0,
                max: 30,
                title: {
                    text: ':LOS'
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true,
                borderRadius: 5,
                borderWidth: 1
            },
            series: [{
                type: 'line',
                name: 'BOR ' + databor[0].bor + '%',
                data: [[0,], [4, 1.33], [8, 2.66]],
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        lineWidth: 0
                    }
                },
                enableMouseTracking: false

            },
            {
                type: 'line',
                name: 'BTO ' + databor[0].bto,
                data: [[1, 1], [2, 2], [4, 4]],
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        lineWidth: 0
                    }
                },
                enableMouseTracking: false

            }
                //     , {
                //     type: 'scatter',
                //     name: '',
                //     data: [4, 1.33],
                //     marker: {
                //         radius: 4
                //     }
                // }
            ]
        });
    }
    changeBerdasarkan(event) {
        let tglPencarian = '&tgl=' + moment(this.carieuy.tgl).format('YYYY-MM-DD')
        this.getKunjunganBerdasarkan(event.value, tglPencarian)
    }
    changebukuRegister(event) {
        let tglPencarian = '&tgl=' + moment(this.carieuy.tgl).format('YYYY-MM-DD')
        this.getRegisterPendaftaran(event.value, tglPencarian)
    }
    changeAnggaran(event) {
        let tglPencarian = '&tahun=' + moment(this.carieuy.tgl).format('YYYY')
        let bln = '&bulan=' + moment(this.carieuy.tgl).format('MM')
        this.getAnggaran(event.value, tglPencarian, bln)
    }
    getKunjunganBerdasarkan(data, tgl) {

        this.appservice.getTransaksi('eis/get-kunjungan-berdasarkan-param?params=' + data.nama + tgl).subscribe(data => {
            var result = data;

            let pie1 = 2;
            let series = [];
            let categories = [];
            let loopIndex = 0;
            for (let i in result) {
                categories.push(result[i].name);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(result[i].jumlah),
                    color: this.colors[i]
                });
                if (loopIndex < 15)
                    series.push({
                        name: result[i].name,
                        data: dataz2
                    });
                loopIndex++;

            }
            this.chartKunjunganBerdasarkan = new Chart({
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Jumlah "],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien <br/>';
                        return s;

                    }
                    // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    // footerFormat: '</table>',
                    // shared: true,
                    // useHTML: true
                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        })
    }
    getWilayah() {


        // this.dataSourceFusion = {
        //     chart: {
        //         animation: "0",
        //         showbevel: "0",
        //         usehovercolor: "1",
        //         canvasbordercolor: "FFFFFF",
        //         bordercolor: "FFFFFF",
        //         showlegend: "1",
        //         legendposition: "BOTTOM",
        //         legendborderalpha: "0",
        //         legendbordercolor: "ffffff",
        //         legendallowdrag: "0",
        //         legendshadow: "0",
        //         caption: "Website Visits for the month of March 2018",
        //         connectorcolor: "000000",
        //         fillalpha: "80",
        //         hovercolor: "CCCCCC",
        //         showborder: 0,
        //         theme: "fusion"
        //       },
        //       colorrange: {
        //         minvalue: "0",
        //         startlabel: "Low",
        //         endlabel: "High",
        //         code: "e44a00",
        //         gradient: "1",
        //         color: [
        //           { maxvalue: "2500", code: "f8bd19" },
        //           { maxvalue: "5000", code: "6baa01" }
        //         ]
        //       },
        //       data: [
        //         { id: "001", value: 2834 },
        //         { id: "003", value: 3182 },
        //         { id: "005", value: 3280 },
        //         { id: "007", value: 911 },
        //         { id: "009", value: 292 },
        //         { id: "011", value: 530 },
        //         { id: "013", value: 2515 },
        //         { id: "015", value: 728 },
        //         { id: "017", value: 1974 },
        //         { id: "019", value: 848 },
        //         { id: "021", value: 3278 },
        //         { id: "023", value: 4463 },
        //         { id: "025", value: 1198 },
        //         { id: "027", value: 378 },
        //         { id: "029", value: 2610 },
        //         { id: "031", value: 1200 },
        //         { id: "033", value: 3820 },
        //         { id: "035", value: 940 },
        //         { id: "037", value: 3416 },
        //         { id: "039", value: 4004 },
        //         { id: "041", value: 1604 },
        //         { id: "043", value: 4011 },
        //         { id: "045", value: 3203 },
        //         { id: "047", value: 3775 },
        //         { id: "049", value: 2721 },
        //         { id: "051", value: 3417 },
        //         { id: "053", value: 1530 },
        //         { id: "055", value: 412 },
        //         { id: "057", value: 3434 },
        //         { id: "059", value: 1670 },
        //         { id: "061", value: 1274 },
        //         { id: "063", value: 4339 },
        //         { id: "065", value: 2073 },
        //         { id: "067", value: 1018 },
        //         { id: "069", value: 3967 },
        //         { id: "071", value: 3401 },
        //         { id: "073", value: 3307 },
        //         { id: "075", value: 1938 },
        //         { id: "077", value: 489 },
        //         { id: "079", value: 3207 },
        //         { id: "081", value: 2295 },
        //         { id: "083", value: 2747 },
        //         { id: "085", value: 1114 },
        //         { id: "087", value: 3400 },
        //         { id: "089", value: 784 },
        //         { id: "091", value: 1673 },
        //         { id: "093", value: 4274 },
        //         { id: "095", value: 4509 },
        //         { id: "097", value: 3862 },
        //         { id: "099", value: 1356 },
        //         { id: "101", value: 4126 },
        //         { id: "103", value: 1314 },
        //         { id: "105", value: 1807 },
        //         { id: "107", value: 4026 },
        //         { id: "109", value: 3456 },
        //         { id: "111", value: 1393 },
        //         { id: "113", value: 1500 },
        //         { id: "115", value: 2218 }
        //       ]
        //   };
        // render the map
        var gdpData = {
            'AF': 16.63,
            'AL': 11.58,
            'DZ': 158.97,
            // ...
        }

        // debugger
        // $('#world-map-markers').vectorMap({
        //     map: 'indonesia',
        //     series: {
        //         regions: [{
        //             values: gdpData,
        //             scale: ['#C8EEFF', '#0071A4'],
        //             normalizeFunction: 'polynomial'
        //         }]
        //     },
        //     onRegionTipShow: function (e, el, code) {
        //         el.html(el.html() + ' (GDP - ' + gdpData[code] + ')');
        //     }
        // });
        // $('#world-map-markers').vectorMap({
        //     map: 'indonesia',
        //     normalizeFunction: 'polynomial',
        //     hoverOpacity: 0.9,
        //     hoverColor: true,
        //     backgroundColor: 'transparent',
        //     onRegionTipShow: function (e, tip, code) {
        //         e.preventDefault();
        //     },
        //     regionLabelStyle: {
        //         initial: {
        //             fill: '#B90E32'
        //         },
        //         hover: {
        //             fill: 'black'
        //         }
        //     },
        //     regionStyle: {
        //         initial: {
        //             fill: 'rgba(210, 214, 222, 1)',
        //             'fill-opacity': 0.7,
        //             stroke: 'none',
        //             'stroke-width': 0,
        //             'stroke-opacity': 1
        //         },
        //         hover: {
        //             'fill-opacity': 0.6,
        //             cursor: 'pointer'
        //         },
        //         selected: {
        //             fill: "#2A3F52"
        //         }
        //     }
        // });
    };
    changeProp(event) {

    }
    cariDiagnosa(tgl) {

        var propId = ''
        var namaPro = ''
        if (this.item.propinsi != undefined && this.item.propinsi != '') {
            propId = this.item.propinsi.id
            namaPro = this.item.propinsi.namapropinsi
        }
        var kotaId = ''
        var namaKota = ''
        if (this.item.kabupaten != undefined && this.item.kabupaten != '') {
            kotaId = this.item.kabupaten.id
            namaKota = this.item.kabupaten.namakotakabupaten
        }
        var kecId = ''
        var namaKec = ''
        if (this.item.kecamatan != undefined && this.item.kecamatan != '') {
            kecId = this.item.kecamatan.id
            namaKec = this.item.kecamatan.namakecamatan
        }
        this.appservice.getTransaksi('eis/get-topten-diagnosa?propinsiId=' + propId
            + '&kotaId=' + kotaId + '&kecamatanId=' + kecId + tgl).subscribe(data => {
                this.data10Diagnosa = data;

                let pie1 = 2;
                let series = [];
                let categories = [];
                let loopIndex = 0;
                for (let i in this.data10Diagnosa) {
                    categories.push(this.data10Diagnosa[i].kddiagnosa);
                    let dataz2 = [];
                    dataz2.push({
                        y: parseFloat(this.data10Diagnosa[i].jumlah),
                        color: this.colors[i]
                    });
                    if (loopIndex < 10)
                        series.push({
                            name: this.data10Diagnosa[i].kddiagnosa,
                            data: dataz2
                        });
                    loopIndex++;

                }
                this.chart10Diagnosa = new Chart({
                    chart: {
                        type: 'column',
                    },

                    title: {
                        text: namaPro + ' - ' + namaKota + ' - ' + namaKec
                    },
                    xAxis: {
                        categories: ["Jumlah "],
                        labels: {
                            align: 'center',
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Kunjungan Pasien'
                        }
                    },
                    plotOptions: {
                        column: {
                            // url:"#",
                            cursor: 'pointer',

                            dataLabels: {
                                enabled: true,
                                color: this.colors[1],

                                formatter: function () {
                                    return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                                }
                            },
                            showInLegend: true
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            let point = this.point,
                                s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien <br/>';
                            return s;

                        }
                        // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                        // footerFormat: '</table>',
                        // shared: true,
                        // useHTML: true
                    },
                    series: series,
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: true,
                        borderRadius: 5,
                        borderWidth: 1
                    },

                })
            })
    }
    GetData(region) {
        var panelKecamatan = $('#listKecamatan');
        panelKecamatan.empty();
        // var getWilayah = dashboardService.getKecamatan(region);
        // getWilayah.then(function (dataKecamatan) {

        //     $scope.kecamatan = dataKecamatan.data;
        //     var boxData = angular.element('<tr ng-repeat="row in kecamatan"  ng-click="getTopDiagnosa(row)"><td>{{row.Kecamatan}}</td><tr>');
        //     var compiledQuery = $compile(boxData);
        //     var element = compiledQuery($scope);
        //     panelKecamatan.append(element);
        // });
    };

    getRegisterPendaftaran(data, tgl) {
        this.appservice.getTransaksi('eis/get-regiter-summary?tipe=' + data.nama + tgl).subscribe(data => {
            this.dataSourceRegister = data;
            this.updateRowGroupRegister();
        })

    }
    getAnggaran(data, tgl, bln) {
        let nama = data.nama;
        this.appservice.getTransaksi('eis/get-laporan-realisasi?kelompok=' + data.nama + tgl + bln).subscribe(data => {

            this.appservice.getTransaksi('eis/get-data-realisasi?kelompok=' + nama + tgl).subscribe(data => {
                this.dataSourceAnggaran = data;
                //this.updateRowGroupRegister();
            })

        })
    }
    onSort() {
        this.updateRowGroupRegister();
    }

    updateRowGroupRegister() {
        this.rowGroupRegister = {};
        if (this.dataSourceRegister) {
            for (let i = 0; i < this.dataSourceRegister.length; i++) {
                let rowData = this.dataSourceRegister[i];
                let namaruangan = rowData.namaruangan;
                if (i == 0) {
                    this.rowGroupRegister[namaruangan] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = this.dataSourceRegister[i - 1];
                    let previousRowGroup = previousRowData.namaruangan;
                    if (namaruangan === previousRowGroup)
                        this.rowGroupRegister[namaruangan].size++;
                    else
                        this.rowGroupRegister[namaruangan] = { index: i, size: 1 };
                }
            }
        }
    }
    getCountPasienDaftar(tgl) {
        this.listCountPengunjung = []
        this.appservice.getTransaksi('eis/get-count-pasien?' + tgl).subscribe(data => {
            this.dataPasien = data;
            this.listCountPengunjung = []
            let total = 0;
            for (let i = 0; i < this.dataPasien.length; i++) {
                const element = this.dataPasien[i];
                element.warna = this.listWarna[i]
                element.gambar = this.listGambar[i]
                total = total + parseFloat(element.jumlah)
                element.namadepartemen = element.namadepartemen.replace('Instalasi Gawat Darurat', 'Pengunjung Gawat Darurat')
                element.namadepartemen = element.namadepartemen.replace('Instalasi Rawat Inap', 'Pasien Masuk Rawat Inap Hari ini')
                element.namadepartemen = element.namadepartemen.replace('Instalasi Radiologi', 'Pengunjung Radiologi dari Luar Hari ini')
                element.namadepartemen = element.namadepartemen.replace('Instalasi Laboratorium', 'Pengunjung Laboratorium dari Luar Hari ini')
                element.namadepartemen = element.namadepartemen.replace('Instalasi Rawat Jalan', 'Poliklinik')
                element.namadepartemen = element.namadepartemen.replace('Instalasi Rehabilitasi Medik', 'Pasien Masuk Rehabilitasi Medik Hari ini')
                element.namadepartemen = element.namadepartemen.replace('Instalasi', 'Pasien ')
            }
            // this.dataPasien.push({
            //     "id": null,
            //     "namadepartemen": "TOTAL PASIEN",
            //     "jumlah": total,
            //     "warna": 'total',
            //     "gambar": 'assets/img/icon-pasien.png'
            // })
            this.listCountPengunjung = this.dataPasien
            // this.countRajal = this.dataPasien.rawat_jalan;
            // this.countIgd = this.dataPasien.igd;
            // this.countRanap = this.dataPasien.rawat_inap;
            // this.countRadiologi = this.dataPasien.radiologi;
            // this.countLab = this.dataPasien.laboratorium;
            // this.countBedah = this.dataPasien.operasi;
            // this.countRehab = this.dataPasien.rehab_medik;
            // this.countTotal = this.dataPasien.jumlah;
        })
    }
    getCountTerlayani(tgl) {
        this.listCountKunjungan = []
        this.appservice.getTransaksi('eis/get-count-pasien-terlayani?' + tgl).subscribe(data => {
            let datas: any = data;
            // this.countRajalTerlayani = this.dataPasienTerlayni.data.rawat_jalan;
            // this.countIgdTerlayani = this.dataPasienTerlayni.data.igd;
            // this.countRanapTerlayani = this.dataPasienTerlayni.rawat_inap;
            // this.countRadiologiTerlayani = this.dataPasienTerlayni.data.radiologi;
            // this.countLabTerlayani = this.dataPasienTerlayni.data.laboratorium;
            // this.countBedahTerlayani = this.dataPasienTerlayni.data.operasi;
            // this.countRehabTerlayani = this.dataPasienTerlayni.data.rehab_medik;
            // this.countTotalTerlayani = this.dataPasienTerlayni.data.jumlah;
            // this.countFarmasiTerlayani = this.dataPasienTerlayni.farmasi;
            // this.countMasihDirawatTerlayani = this.dataPasienTerlayni.masihDirawat;

            this.listCountKunjungan = []
            let total = 0;
            for (let i = 0; i < datas.length; i++) {
                const element = datas[i];
                element.warna = this.listWarna[i]
                element.gambar = this.listGambar[i]
                total = total + parseFloat(element.jumlah)
                element.namadepartemen = element.namadepartemen.replace('Instalasi Rawat Jalan', 'Poliklinik')
            }
            // datas.push({
            //     "id": null,
            //     "namadepartemen": "TOTAL PASIEN",
            //     "jumlah": total,
            //     "warna": 'total',
            //     "gambar": 'assets/img/icon-pasien.png'
            // })
            this.listCountKunjungan = datas
        })

    }
    getTempatTidur(tgl) {
        this.appservice.getTransaksi('eis/get-tempattidur-terpakai?' + tgl).subscribe(data2 => {
            this.tempatTidurTerpakai = data2;
            this.countGeriatri = this.tempatTidurTerpakai.geriatri;
            this.countCeweDewasa = this.tempatTidurTerpakai.perempuandewasa;
            this.countAnakLaki = this.tempatTidurTerpakai.anaklaki;
            this.countAnakCewe = this.tempatTidurTerpakai.anakperempuan;
            this.countBalitaLaki = this.tempatTidurTerpakai.balitalaki;
            this.countBalitaCewe = this.tempatTidurTerpakai.balitaperempuan;
            this.countLakiDewasa = this.tempatTidurTerpakai.lakidewasa;
            this.countGeriLaki = this.tempatTidurTerpakai.geriatrilaki;
        })
        this.appservice.getTransaksi('eis/get-tempattidur-perkelas?' + tgl).subscribe(data => {
            this.tempatTidurKosong = data;
            this.ttJumlahb = 0
            this.ttJumlah = 0
            this.ttJumlaha = 0
            this.ttJumlahsiap = 0
            for (let i = 0; i < this.tempatTidurKosong.length; i++) {
                const element = this.tempatTidurKosong[i];
                this.ttJumlahb = this.ttJumlahb + parseFloat(element.jml)
                this.ttJumlah = this.ttJumlah + parseFloat(element.kosong)
                this.ttJumlaha = this.ttJumlaha + parseFloat(element.terpakai)
                this.ttJumlahsiap = this.ttJumlahsiap + parseFloat(element.siap)
            }
            // this.ttJumlahb = this.tempatTidurKosong.jumlahb;
            // this.ttKelas1 = this.tempatTidurKosong.kelas_1;
            // this.ttKelas2 = this.tempatTidurKosong.kelas_2;
            // this.ttKelas3 = this.tempatTidurKosong.kelas_3;
            // this.ttVipA = this.tempatTidurKosong.vip_a;
            // this.ttVipB = this.tempatTidurKosong.vip_b;
            // this.ttNonKelas = this.tempatTidurKosong.non_kelas;
            // this.ttJumlah = this.tempatTidurKosong.jumlah;

            // this.ttKelas1a = this.tempatTidurKosong.kelas_1a;
            // this.ttKelas2a = this.tempatTidurKosong.kelas_2a;
            // this.ttKelas3a = this.tempatTidurKosong.kelas_3a;
            // this.ttVipAa = this.tempatTidurKosong.vip_aa;
            // this.ttVipBa = this.tempatTidurKosong.vip_ba;
            // this.ttNonKelasa = this.tempatTidurKosong.non_kelasa;
            // this.ttJumlaha = this.tempatTidurKosong.jumlaha;

            // this.ttKelas1b = this.tempatTidurKosong.kelas_1b;
            // this.ttKelas2b = this.tempatTidurKosong.kelas_2b;
            // this.ttKelas3b = this.tempatTidurKosong.kelas_3b;
            // this.ttVipAb = this.tempatTidurKosong.vip_ab;
            // this.ttVipBb = this.tempatTidurKosong.vip_bb;
            // this.ttNonKelasb = this.tempatTidurKosong.non_kelasb;
            // this.ttJumlahb = this.tempatTidurKosong.jumlahb;


            // this.ttJumlahVVip = this.tempatTidurKosong.vvvip_bb;
            // this.ttJumlahVVipKosong = this.tempatTidurKosong.vvip;
            // this.ttJumlahVVipPakai = this.tempatTidurKosong.vvip_aa;

            // this.ttJumlahVip = this.tempatTidurKosong.vvip_bb;
            // this.ttJumlahVipKosong = this.tempatTidurKosong.vip;
            // this.ttJumlahVipPakai = this.tempatTidurKosong.vvip_bb;

        })
        this.appservice.getTransaksi('eis/get-tempattidur-perkelas-covid?' + tgl).subscribe(data => {
            this.tempatTidurKosongCovid = data;
            this.ttJumlahbCovid = 0
            this.ttJumlahCovid = 0
            this.ttJumlahaCovid = 0
            this.ttJumlahsiapCovid = 0
            for (let i = 0; i < this.tempatTidurKosongCovid.length; i++) {
                const element = this.tempatTidurKosongCovid[i];
                this.ttJumlahbCovid = this.ttJumlahbCovid + parseFloat(element.jml)
                this.ttJumlahCovid = this.ttJumlahCovid + parseFloat(element.kosong)
                this.ttJumlahaCovid = this.ttJumlahaCovid + parseFloat(element.terpakai)
                this.ttJumlahsiapCovid = this.ttJumlahsiapCovid + parseFloat(element.siap)
            }
        })
        this.appservice.getTransaksi('eis/get-info-kunjungan-rawatjalan?' + tgl).subscribe(data3 => {
            this.gridInfoKedatangan = data3;
            this.dataSource = new MatTableDataSource(this.gridInfoKedatangan);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

        })
    }
    getBorLos(tgl) {
        this.appservice.getTransaksi('eis/get-borlostoi?' + tgl).subscribe(data => {
            this.gridBorLos = data;
            this.getChartBarberJohnson(tgl, this.gridBorLos)
            // let tahun;
            let Bulan = 0;
            let BOR = 0;
            let LOS = 0;
            let TOI = 0;
            let NDR = 0;
            let GDR = 0;
            let BTO = 0;
            for (let i in this.gridBorLos) {
                this.tahun = this.gridBorLos[i].tahun
                Bulan += 1;
                BOR += this.gridBorLos[i].bor;
                LOS += this.gridBorLos[i].alos;
                TOI += this.gridBorLos[i].toi;
                NDR += this.gridBorLos[i].ndr;
                GDR += this.gridBorLos[i].gdr;
                BTO += this.gridBorLos[i].bto;
            }
            this.JmlBOR = (BOR / Bulan).toFixed(2);
            this.JmlLOS = (LOS / Bulan).toFixed(2);
            this.JmlTOI = (TOI / Bulan).toFixed(2);
            this.JmlNDR = (NDR / Bulan).toFixed(2);
            this.JmlGDR = (GDR / Bulan).toFixed(2);
            this.JmlBTO = (BTO / Bulan).toFixed(2);


            // this.dataSourceBor = new MatTableDataSource(this.gridBorLos);
            // this.dataSourceBor.paginator = this.paginator2;
            // this.dataSourceBor.sort = this.sort2;

        })
    }
    getTrendRajal() {
        this.isShowTrend = true;
        this.appservice.getTransaksi('eis/get-trend-kunjungan-rawatjalan').subscribe(data => {
            this.isShowTrend = false;
            let trend = data;
            let data1 = []
            let data2 = []
            let data3 = []
            let data4 = []
            let categories = []
            for (let i in trend) {
                data1.push({
                    y: parseFloat(trend[i].totalterdaftar),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                data2.push({
                    y: parseFloat(trend[i].diperiksa),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                data3.push({
                    y: parseFloat(trend[i].belumperiksa),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                data4.push({
                    y: parseFloat(trend[i].batalregistrasi),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                categories.push(trend[i].tanggal);
            }
            // console.log(this.categories);
            this.chart = new Chart({
                chart: {
                    zoomType: 'x',
                    spacingRight: 20
                },
                title: {
                    text: ''
                },

                xAxis: {
                    categories: categories,
                    crosshair: true,
                    // type: 'datetime',
                    //  maxZoom: 24 * 3600 * 1000, // fourteen days
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1,
                    // backgroundColor:undefined
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0])]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: true
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    },
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    },
                    //line: {
                    //    cursor: 'pointer',

                    //    dataLabels: {
                    //        enabled: true,
                    //        color: colors[0],
                    //        style: {
                    //            fontWeight: 'bold'
                    //        },
                    //        formatter: function () {
                    //            return Highcharts.numberFormat(this.y, 0, '.', ',');
                    //        }
                    //    },
                    //    showInLegend: true
                    //}
                },
                credits: {
                    enabled: false
                },

                series: [{
                    type: 'column',
                    name: 'Total Terdaftar',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data1,

                },
                {
                    type: 'line',
                    name: 'Sudah Diperiksa',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data2,
                },
                {
                    type: 'line',
                    name: 'Belum Diperiksa',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data3,
                },
                {
                    type: 'line',
                    name: 'Batal Registrasi',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data4,
                }
                ]

            })

        })
    }
    getTrendCovid() {
        this.isShowTrendCovid = true;
        this.appservice.getTransaksi('eis/get-trend-kunjungan-covid').subscribe(data => {
            this.isShowTrendCovidPulang = false;
            this.trenKunjunganCovid = data
            let trend = this.trenKunjunganCovid.data10Month
            let data1 = []
            let data2 = []
            let data3 = []
            let data4 = []
            let categories = []
            for (let i in trend) {
                data1.push({
                    y: parseFloat(trend[i].totalterdaftar),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                categories.push(`${trend[i].tglpelayanan} <br> ${trend[i].totalterdaftar} Pasien`);
            }
            // console.log(this.categories);
            this.chartCovid = new Chart({
                chart: {
                    zoomType: 'x',
                    spacingRight: 20
                },
                title: {
                    text: ''
                },

                xAxis: {
                    categories: categories,
                    crosshair: true,
                    // type: 'datetime',
                    //  maxZoom: 24 * 3600 * 1000, // fourteen days
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1,
                    // backgroundColor:undefined
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0])]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: true
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    },
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    },
                },
                credits: {
                    enabled: false
                },

                series: [{
                    type: 'line',
                    name: 'Total Terdaftar',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data1,

                },
                ]

            })

        })
    }
    getTrendCovidPulang() {
        this.isShowTrendCovidPulang = true;
        this.appservice.getTransaksi('eis/get-trend-kunjungan-covid-pulang').subscribe(data => {
            this.isShowTrendCovidPulang = false;
            this.trenKunjunganCovidPulang = data
            let trend = this.trenKunjunganCovidPulang.data10Month
            let data1 = []
            let data2 = []
            let data3 = []
            let data4 = []
            let categories = []
            for (let i in trend) {
                data1.push({
                    y: parseFloat(trend[i].totalterdaftar),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                data2.push({
                    y: parseFloat(trend[i].meninggal),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                data3.push({
                    y: parseFloat(trend[i].hidup),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                categories.push(`${trend[i].tglpelayanan} <br> ${trend[i].totalterdaftar} Pasien`);
            }
            // console.log(this.categories);
            this.chartCovidPulang = new Chart({
                chart: {
                    zoomType: 'x',
                    spacingRight: 20
                },
                title: {
                    text: ''
                },

                xAxis: {
                    categories: categories,
                    crosshair: true,
                    // type: 'datetime',
                    //  maxZoom: 24 * 3600 * 1000, // fourteen days
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1,
                    // backgroundColor:undefined
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0])]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: true
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    },
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    },
                },
                credits: {
                    enabled: false
                },

                series: [{
                    type: 'line',
                    name: 'Total Pulang',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data1,

                }, {
                    type: 'line',
                    name: 'Pulang Meninggal',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data2,
                },
                {
                    type: 'line',
                    name: 'Pulang Hidup',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data3,
                },
                ]

            })

        })
    }
    getTrendPerbulan(idDep) {
        this.isShowTrendshowPerbulan = true;
        this.isShowTrendshowPerbulanx = true
        this.appservice.getTransaksi('eis/get-trend-Perbulan?idRuangan=' + idDep).subscribe(data => {
            this.isShowTrendshowPerbulan = false;
            debugger
            let trend = data;
            let data1 = []
            let data2 = []
            let data3 = []
            let data4 = []
            let categories = []
            for (let i in trend) {
                data1.push({
                    y: parseFloat(trend[i].totalterdaftar),
                    color: this.colorNyieun[i]
                });
            }
            for (let i in trend) {
                categories.push(trend[i].tglpelayanan);
            }
            // console.log(this.categories);
            this.chartPerbulan = new Chart({
                chart: {
                    zoomType: 'x',
                    spacingRight: 20
                },
                title: {
                    text: ''
                },

                xAxis: {
                    categories: categories,
                    crosshair: true,
                    // type: 'datetime',
                    //  maxZoom: 24 * 3600 * 1000, // fourteen days
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1,
                    // backgroundColor:undefined
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0])]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: true
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    },
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    },
                },
                credits: {
                    enabled: false
                },

                series: [{
                    type: 'column',
                    name: 'Total Terdaftar',
                    // pointInterval: 24 * 3600 * 1000,
                    // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
                    data: data1,

                },
                ]

            })

        })
    }
    getChartPenjadwalan(tgl) {
        // chart jenis penjadwalan pie
        this.isShowCaraDaftar = true;
        this.appservice.getTransaksi('eis/get-pasien-perjenis-penjadwalan?' + tgl).subscribe(data => {
            this.dataPenjadwalan = data;
            this.isShowCaraDaftar = false;
            let series = [];
            let categories = [];
            let loopIndex = 0;
            let dataPie = [];
            let ranap = [];
            let rajal = [];
            let rehab = [];
            let igd = [];
            let lab = [];
            let rad = [];
            for (let i in this.dataPenjadwalan.data) {
                categories.push(this.dataPenjadwalan.data[i].keterangan);
                let dataz2 = [];
                let dataRajal = [];
                let dataRanap = [];
                let dataRehab = [];
                let dataIGD = [];
                let dataLab = [];
                let dataRad = [];
                dataz2.push({
                    y: parseFloat(this.dataPenjadwalan.data[i].jumlah),
                    color: this.colors[i]
                });
                dataRajal.push({
                    y: parseFloat(this.dataPenjadwalan.data[i].rawatjalan),
                    color: this.colors[i]
                });
                dataRanap.push({
                    y: parseFloat(this.dataPenjadwalan.data[i].rawat_inap),
                    color: this.colors[i]
                });
                dataRehab.push({
                    y: parseFloat(this.dataPenjadwalan.data[i].rehab_medik),
                    color: this.colors[i]
                });
                dataIGD.push({
                    y: parseFloat(this.dataPenjadwalan.data[i].igd),
                    color: this.colors[i]
                });
                dataLab.push({
                    y: parseFloat(this.dataPenjadwalan.data[i].laboratorium),
                    color: this.colors[i]
                });
                dataRad.push({
                    y: parseFloat(this.dataPenjadwalan.data[i].radiologi),
                    color: this.colors[i]
                });
                // asupkeun kabeh data

                dataPie.push([
                    this.dataPenjadwalan.data[i].keterangan,
                    parseFloat(this.dataPenjadwalan.data[i].jumlah)
                ]);
                series.push({
                    name: this.dataPenjadwalan.data[i].keterangan,
                    data: dataz2
                });
                rajal.push({
                    name: this.dataPenjadwalan.data[i].keterangan,
                    data: dataRajal
                });
                ranap.push({
                    name: this.dataPenjadwalan.data[i].keterangan,
                    data: dataRanap
                });
                igd.push({
                    name: this.dataPenjadwalan.data[i].keterangan,
                    data: dataIGD
                });
                rehab.push({
                    name: this.dataPenjadwalan.data[i].keterangan,
                    data: dataRehab
                });
                lab.push({
                    name: this.dataPenjadwalan.data[i].keterangan,
                    data: dataLab
                });
                rad.push({
                    name: this.dataPenjadwalan.data[i].keterangan,
                    data: dataRad
                });
                //end  asupkeun kabeh data

            }
            // console.log(dataPie);
            this.chartJenisPenjadwalanPie = new Chart({
                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45
                    }
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },
                plotOptions: {
                    pie: {
                        innerSize: 100,
                        depth: 45,
                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: [{
                    name: 'Jumlah Kunjungan',
                    data: dataPie
                    // [
                    //     ['Bananas', 8],
                    //     ['Kiwi', 3],
                    //     ['Mixed nuts', 1],
                    //     ['Oranges', 6],
                    //     ['Apples', 8],
                    //     ['Pears', 4],
                    //     ['Clementines', 4],
                    //     ['Reddish (bag)', 1],
                    //     ['Grapes (bunch)', 1]
                    // ]
                }]
            })

            // line
            this.chartJenisPenjadwalanLine = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: series,
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                // responsive: {
                //     rules: [{
                //         condition: {
                //             maxWidth: 500
                //         },
                //         chartOptions: {
                //             legend: {
                //                 layout: 'horizontal',
                //                 align: 'center',
                //                 verticalAlign: 'bottom'
                //             }
                //         }
                //     }]
                // }
            })
            // rawat jalan
            this.chartCaraDaftarRajal = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: rajal,
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

            })
            // end rajal
            // rawat inap
            this.chartCaraDaftarRanap = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: ranap,
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

            })
            // end ranap
            // rehab
            this.chartCaraDaftarRehab = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: rehab,
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

            })
            // end rehab
            // igd
            this.chartCaraDaftarIgd = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: igd,
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

            })
            // end igd
            // lab
            this.chartCaraDaftarLab = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: lab,
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

            })
            // end lab
            // rad
            this.chartCaraDaftarRad = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },

                series: rad,
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

            })
            // end rad
        })
        // end pie
    }
    getKunjunganRsandJenisPasien(tgl) {

        this.appservice.getTransaksi('eis/get-kunjungan-rs?' + tgl).subscribe(data => {
            this.resChartKunjunganRs = data;
            this.chartKunjunganRs = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Jumlah'],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    borderRadius: 5,
                    borderWidth: 1,
                    // layout: 'vertical',
                    // align: 'right',
                    // verticalAlign: 'middle'
                },
                series: [
                    {
                        name: 'Instalasi Rawat Jalan',
                        data: [this.resChartKunjunganRs.rawatjalan]
                    },
                    {
                        name: 'Instalasi Rawat Inap',
                        data: [this.resChartKunjunganRs.rawatinap]
                    }, {
                        name: 'Instalasi Gawat Darurat',
                        data: [this.resChartKunjunganRs.igd]
                    },
                    {
                        name: 'Instalasi Rehabilitasi Medik',
                        data: [this.resChartKunjunganRs.rehabmedik]
                    },

                ]
            })

        })
        //   chart kunjungan berdasarkan jenispasien
        this.appservice.getTransaksi('eis/get-kunjungan-perjenispasien?' + tgl).subscribe(data => {
            this.datachartKunjungnJenisPasien = data;

            let dataz = [];
            let slice = true;
            let jmlPasien = 0;
            for (let i in this.datachartKunjungnJenisPasien.dataAll) {
                // let sum = _.reduce( this.datachartKunjungnJenisPasien[i],
                //     function (memo, num) {
                //         return memo + Number(num.SumPatient);
                //     }, 0);
                dataz.push({
                    name: this.datachartKunjungnJenisPasien.dataAll[i].kelompokpasien,
                    y: parseFloat(this.datachartKunjungnJenisPasien.dataAll[i].jumlah),
                    sliced: slice,
                    selected: slice
                });
                slice = false;
                jmlPasien = jmlPasien + parseFloat(this.datachartKunjungnJenisPasien.dataAll[i].jumlah)
            }
            this.chartKunjungnJenisPasien = new Chart({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '',

                },
                // tooltip: {
                //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                // },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return this.percentage.toFixed(2) + ` % = ${this.y} Pasien`;
                            }
                        },
                        showInLegend: true
                    },

                },
                credits: {
                    text: 'Total Pasien ' + jmlPasien,
                    // enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [{
                    type: 'pie',
                    name: 'Persentase Pengunjung Pasien',
                    // colorByPoint: true,
                    data: dataz

                }]
            })

            let categoriesss = [];
            let bpjs = [];
            let asuransi = [];
            let umum = [];
            let tahanan = [];
            let atensi = [];
            for (let i in this.datachartKunjungnJenisPasien.data) {
                categoriesss.push(this.datachartKunjungnJenisPasien.data[i].namadepartemen);
                bpjs.push(
                    parseFloat(this.datachartKunjungnJenisPasien.data[i].jmlBPJS)
                );
                asuransi.push(
                    parseFloat(this.datachartKunjungnJenisPasien.data[i].jmlAsuransiLain)
                );
                umum.push(
                    parseFloat(this.datachartKunjungnJenisPasien.data[i].jmlUmum)
                );
                tahanan.push(
                    parseFloat(this.datachartKunjungnJenisPasien.data[i].jmlTahanan)
                );
                atensi.push(
                    parseFloat(this.datachartKunjungnJenisPasien.data[i].jmlAtensi)
                );
            }
            this.chartDetailKelompokPasien = new Chart({
                chart: {
                    type: 'column'
                },

                title: {
                    text: ''
                },

                xAxis: {
                    categories: categoriesss//['REGULER', 'EKSEKUTIF']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    }
                },
                // plotOptions: {
                //     column: {
                //         stacking: 'normal'
                //     }
                // },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    reversed: false,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [
                    {
                        name: 'BPJS',
                        data: bpjs
                    },
                    {
                        name: 'Umum/Pribadi',
                        data: umum
                    },
                    {
                        name: 'Tahanan',
                        data: tahanan
                    },
                    {
                        name: 'Asuransi Lain',
                        data: asuransi
                    },
                    {
                        name: 'Atensi',
                        data: atensi
                    }

                ]
            })
        })
        this.appservice.getTransaksi('eis/get-kunjungan-perjenispasienrekanan?' + tgl).subscribe(data => {
            this.datachartKunjungnJenisPasienRekanan = data;

            let dataz = [];
            let slice = true;
            let jmlPasien = 0;
            for (let i in this.datachartKunjungnJenisPasienRekanan.dataAll) {
                // let sum = _.reduce( this.datachartKunjungnJenisPasien[i],
                //     function (memo, num) {
                //         return memo + Number(num.SumPatient);
                //     }, 0);
                dataz.push({
                    name: this.datachartKunjungnJenisPasienRekanan.dataAll[i].namarekanan,
                    y: parseFloat(this.datachartKunjungnJenisPasienRekanan.dataAll[i].jumlah),
                    sliced: slice,
                    selected: slice
                });
                slice = false;
                jmlPasien = jmlPasien + parseFloat(this.datachartKunjungnJenisPasienRekanan.dataAll[i].jumlah)
            }
            this.chartKunjungnJenisPasienRekanan = new Chart({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '',

                },
                // tooltip: {
                //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                // },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return this.percentage.toFixed(2) + ` % = ${this.y} Pasien`;
                            }
                        },
                        showInLegend: true
                    },

                },
                credits: {
                    text: 'Total Pasien ' + jmlPasien,
                    // enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [{
                    type: 'pie',
                    name: 'Persentase Pengunjung Pasien',
                    // colorByPoint: true,
                    data: dataz

                }]
            })

            let categoriesss = [];
            let PasienBpjsPol = [];
            let PasienBpjsNonPol = [];
            let PasienBpjsNonPolPBI = [];
            let PasienBpjsNonPolPBICSR = [];
            let PasienPTT = [];
            let PasienUmum = [];
            let PasienTagihan = [];
            for (let i in this.datachartKunjungnJenisPasienRekanan.data) {
                categoriesss.push(this.datachartKunjungnJenisPasienRekanan.data[i].namadepartemen);
                PasienBpjsPol.push(
                    parseFloat(this.datachartKunjungnJenisPasienRekanan.data[i].jmlPasienBpjsPol)
                );
                PasienBpjsNonPol.push(
                    parseFloat(this.datachartKunjungnJenisPasienRekanan.data[i].jmlPasienBpjsNonPol)
                );
                PasienBpjsNonPolPBI.push(
                    parseFloat(this.datachartKunjungnJenisPasienRekanan.data[i].jmlPasienBpjsNonPolPBI)
                );
                PasienBpjsNonPolPBICSR.push(
                    parseFloat(this.datachartKunjungnJenisPasienRekanan.data[i].jmlPasienBpjsNonPolPBICSR)
                );
                PasienPTT.push(
                    parseFloat(this.datachartKunjungnJenisPasienRekanan.data[i].jmlPasienPTT)
                );
                PasienUmum.push(
                    parseFloat(this.datachartKunjungnJenisPasienRekanan.data[i].jmlPasienUmum)
                );
                PasienTagihan.push(
                    parseFloat(this.datachartKunjungnJenisPasienRekanan.data[i].jmlPasienTagihan)
                );
            }
            this.chartDetailKelompokPasienRekanan = new Chart({
                chart: {
                    type: 'column'
                },

                title: {
                    text: ''
                },

                xAxis: {
                    categories: categoriesss//['REGULER', 'EKSEKUTIF']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    }
                },
                // plotOptions: {
                //     column: {
                //         stacking: 'normal'
                //     }
                // },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    reversed: false,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [
                    {
                        name: 'BPJS Pol',
                        data: PasienBpjsPol
                    },
                    {
                        name: 'BPJS Non Pol',
                        data: PasienBpjsNonPol
                    },
                    {
                        name: 'BPJS Non Pol (PBI)',
                        data: PasienBpjsNonPolPBI
                    },
                    {
                        name: 'BPJS Non Pol (PBI CSR)',
                        data: PasienBpjsNonPolPBICSR
                    },
                    {
                        name: 'PTT',
                        data: PasienPTT
                    },
                    {
                        name: 'UMUM',
                        data: PasienUmum
                    },
                    {
                        name: 'Tagihan',
                        data: PasienTagihan
                    }

                ]
            })
        })
        this.appservice.getTransaksi('eis/get-kunjungan-perjenispasiengolongan?' + tgl).subscribe(data => {
            this.datachartKunjungnJenisPasienGolongan = data;

            let dataz = [];
            let slice = true;
            let jmlPasien = 0;
            for (let i in this.datachartKunjungnJenisPasienGolongan.dataAll) {
                // let sum = _.reduce( this.datachartKunjungnJenisPasien[i],
                //     function (memo, num) {
                //         return memo + Number(num.SumPatient);
                //     }, 0);
                dataz.push({
                    name: this.datachartKunjungnJenisPasienGolongan.dataAll[i].jeniskelompokpasien,
                    y: parseFloat(this.datachartKunjungnJenisPasienGolongan.dataAll[i].jumlah),
                    sliced: slice,
                    selected: slice
                });
                slice = false;
                jmlPasien = jmlPasien + parseFloat(this.datachartKunjungnJenisPasienGolongan.dataAll[i].jumlah)
            }
            this.chartKunjungnJenisPasienGolongan = new Chart({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '',

                },
                // tooltip: {
                //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                // },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return this.percentage.toFixed(2) + ` % = ${this.y} Pasien`;
                            }
                        },
                        showInLegend: true
                    },

                },
                credits: {
                    text: 'Total Pasien ' + jmlPasien,
                    // enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [{
                    type: 'pie',
                    name: 'Persentase Pengunjung Pasien',
                    // colorByPoint: true,
                    data: dataz

                }]
            })

            let categoriesss = [];
            let P1 = [];
            let P2 = [];
            let P3 = [];
            let P4 = [];
            let P5 = [];
            let P6 = [];
            let P7 = [];
            let P8 = [];
            let P9 = [];
            let P10 = [];
            let P11 = [];
            let P12 = [];
            let P13 = [];
            let P14 = [];
            let P15 = [];
            let P16 = [];
            let P17 = [];
            let P18 = [];
            let P19 = [];
            let P20 = [];
            let P21 = [];
            let P22 = [];
            let PKosong = [];
            for (let i in this.datachartKunjungnJenisPasienGolongan.data) {
                categoriesss.push(this.datachartKunjungnJenisPasienGolongan.data[i].namadepartemen);
                P1.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP1)
                );
                P2.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP2)
                );
                P3.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP3)
                );
                P4.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP4)
                );
                P5.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP5)
                );
                P6.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP6)
                );
                P7.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP7)
                );
                P8.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP8)
                );
                P9.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP9)
                );
                P10.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP10)
                );
                P11.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP11)
                );
                P12.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP12)
                );
                P13.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP13)
                );
                P14.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP14)
                );
                P15.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP15)
                );
                P16.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP16)
                );
                P17.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP17)
                );
                P18.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP18)
                );
                P19.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP19)
                );
                P20.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP20)
                );
                P21.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP21)
                );
                P22.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlP22)
                );
                PKosong.push(
                    parseFloat(this.datachartKunjungnJenisPasienGolongan.data[i].jmlKosong)
                );
            }
            this.chartDetailKelompokPasienGolongan = new Chart({
                chart: {
                    type: 'column'
                },

                title: {
                    text: ''
                },

                xAxis: {
                    categories: categoriesss//['REGULER', 'EKSEKUTIF']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    }
                },
                // plotOptions: {
                //     column: {
                //         stacking: 'normal'
                //     }
                // },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    reversed: false,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [
                    {
                        name: 'ANGGOTA POLRI',
                        data: P1
                    },
                    {
                        name: 'ANGGOTA PNS',
                        data: P2
                    },
                    {
                        name: 'KELUARGA ANGGOTA POLRI',
                        data: P3
                    },
                    {
                        name: 'PTT',
                        data: P4
                    },
                    {
                        name: 'ANGGOTA SISWA DIKBANG',
                        data: P5
                    },
                    {
                        name: 'ANGGOTA SISWA DIKTUK',
                        data: P6
                    },
                    {
                        name: 'ANGGOTA SISWA DIKJUR',
                        data: P7
                    },
                    {
                        name: 'KELUARGA ANGGOTA PNS',
                        data: P8
                    },
                    {
                        name: 'KELUARGA PTT',
                        data: P9
                    },
                    {
                        name: 'PNS SISWA DIKBANG',
                        data: P10
                    },
                    {
                        name: 'PNS SISWA DIKJUR',
                        data: P11
                    },
                    {
                        name: 'TAHANAN KEPOLISIAN',
                        data: P12
                    },
                    {
                        name: 'TAHANAN KPK',
                        data: P13
                    },
                    {
                        name: 'TAHANAN BNN',
                        data: P14
                    },
                    {
                        name: 'TAHANAN KEJAKSAAN',
                        data: P15
                    },
                    {
                        name: 'TAHANAN LAPAS',
                        data: P16
                    },
                    {
                        name: 'PNS SISWA DIKTUK',
                        data: P17
                    },
                    {
                        name: 'AVRIST ASSURANCE, PT',
                        data: P18
                    },
                    {
                        name: 'BNP2TKI',
                        data: P19
                    },
                    {
                        name: 'JASA RAHARJA, PT (UMUM)',
                        data: P20
                    },
                    {
                        name: 'YANKESTU',
                        data: P22
                    },
                    {
                        name: 'Kosong',
                        data: PKosong
                    },

                ]
            })
        })
        this.appservice.getTransaksi('eis/get-kunjungan-perjenispasiengolongancovid?' + tgl).subscribe(data => {
            this.datachartKunjungnJenisPasienGolonganCovid = data;

            let dataz = [];
            let slice = true;
            let jmlPasien = 0;
            for (let i in this.datachartKunjungnJenisPasienGolonganCovid.dataAll) {
                // let sum = _.reduce( this.datachartKunjungnJenisPasien[i],
                //     function (memo, num) {
                //         return memo + Number(num.SumPatient);
                //     }, 0);
                dataz.push({
                    name: this.datachartKunjungnJenisPasienGolonganCovid.dataAll[i].jeniskelompokpasien,
                    y: parseFloat(this.datachartKunjungnJenisPasienGolonganCovid.dataAll[i].jumlah),
                    sliced: slice,
                    selected: slice
                });
                slice = false;
                jmlPasien = jmlPasien + parseFloat(this.datachartKunjungnJenisPasienGolonganCovid.dataAll[i].jumlah)
            }
            this.chartKunjungnJenisPasienGolonganCovid = new Chart({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '',

                },
                // tooltip: {
                //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                // },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return this.percentage.toFixed(2) + ` % = ${this.y} Pasien`;
                            }
                        },
                        showInLegend: true
                    },

                },
                credits: {
                    text: 'Total Pasien ' + jmlPasien,
                    // enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [{
                    type: 'pie',
                    name: 'Persentase Pengunjung Pasien',
                    // colorByPoint: true,
                    data: dataz

                }]
            })
        })
        this.appservice.getTransaksi('eis/get-kunjungan-perjenispasiencsr?' + tgl).subscribe(data => {
            this.datachartKunjungnJenisPasienCsr = data;

            let dataz = [];
            let slice = true;
            let jmlPasien = 0;
            for (let i in this.datachartKunjungnJenisPasienCsr.dataAll) {
                // let sum = _.reduce( this.datachartKunjungnJenisPasien[i],
                //     function (memo, num) {
                //         return memo + Number(num.SumPatient);
                //     }, 0);
                dataz.push({
                    name: this.datachartKunjungnJenisPasienCsr.dataAll[i].namaexternal,
                    y: parseFloat(this.datachartKunjungnJenisPasienCsr.dataAll[i].jumlah),
                    sliced: slice,
                    selected: slice
                });
                slice = false;
                jmlPasien = jmlPasien + parseFloat(this.datachartKunjungnJenisPasienCsr.dataAll[i].jumlah)
            }
            this.chartKunjungnJenisPasienCsr = new Chart({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '',

                },
                // tooltip: {
                //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                // },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return this.percentage.toFixed(2) + ` % = ${this.y} Pasien`;
                            }
                        },
                        showInLegend: true
                    },

                },
                credits: {
                    text: 'Total Pasien ' + jmlPasien,
                    // enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [{
                    type: 'pie',
                    name: 'Persentase Pengunjung Pasien',
                    // colorByPoint: true,
                    data: dataz

                }]
            })

            let categoriesss = [];
            let csr1 = [];
            let csr2 = [];
            let csr3 = [];
            let csr4 = [];
            let csr5 = [];
            let csr6 = [];
            let csr7 = [];
            let csr8 = [];
            let csr9 = [];
            let csr10 = [];
            let csr11 = [];
            let csr12 = [];
            let csr13 = [];
            let csr14 = [];
            let csr15 = [];
            for (let i in this.datachartKunjungnJenisPasienCsr.data) {
                categoriesss.push(this.datachartKunjungnJenisPasienCsr.data[i].namadepartemen);
                csr1.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP1)
                );
                csr2.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP2)
                );
                csr3.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP3)
                );
                csr4.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP4)
                );
                csr5.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP5)
                );
                csr6.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP6)
                );
                csr7.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP7)
                );
                csr8.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP8)
                );
                csr9.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP9)
                );
                csr10.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP10)
                );
                csr11.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP11)
                );
                csr12.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP12)
                );
                csr13.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP13)
                );
                csr14.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP14)
                );
                csr15.push(
                    parseFloat(this.datachartKunjungnJenisPasienCsr.data[i].csrP15)
                );
            }
            this.chartDetailKelompokPasienCsr = new Chart({
                chart: {
                    type: 'column'
                },

                title: {
                    text: ''
                },

                xAxis: {
                    categories: categoriesss//['REGULER', 'EKSEKUTIF']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    }
                },
                // plotOptions: {
                //     column: {
                //         stacking: 'normal'
                //     }
                // },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    reversed: false,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [
                    {
                        name: 'CSR',
                        data: csr1
                    },
                    {
                        name: 'ATENSI',
                        data: csr2
                    },
                    {
                        name: 'CSR - FKTP NON POLRI',
                        data: csr3
                    },
                    {
                        name: 'CSR - USIA 21 TAHUN',
                        data: csr4
                    },
                    {
                        name: 'CSR - TINDAKAN TIDAK DITANGGUNG',
                        data: csr5
                    },
                    {
                        name: 'CSR - PENYAKIT TIDAK DITANGGUNG',
                        data: csr6
                    },
                    {
                        name: 'CSR - PNS LAIN',
                        data: csr7
                    },
                    {
                        name: 'CSR - TNI/PURNAWIRAWAN TNI',
                        data: csr8
                    },
                    {
                        name: 'CSR - PEGAWAI SWASTA',
                        data: csr9
                    },
                    {
                        name: 'CSR - RUJUKAN TIDAK ADA',
                        data: csr10
                    },
                    {
                        name: 'CSR - PENANGGUHAN PESERTA',
                        data: csr11
                    },
                    {
                        name: 'CSR - NIK GANDA',
                        data: csr12
                    },
                    {
                        name: 'CSR - POLDA LAIN',
                        data: csr13
                    },
                    {
                        name: 'CSR - COVID 19',
                        data: csr14
                    },
                    {
                        name: 'CSR - ANAK KE-4',
                        data: csr15
                    },
                ]
            })
        })
        // end
    }
    getDiagnosaAsalPerujuk(tgl) {
        //   chart 10 Besar Asal Perujuk Pasien BPJS
        this.appservice.getTransaksi('eis/get-topten-asalperujuk-bpjs?' + tgl).subscribe(data => {
            this.data10PerujukBpjs = data;

            let pie1 = 2;
            let series = [];
            let categories = [];
            let loopIndex = 0;
            for (let i in this.data10PerujukBpjs) {
                categories.push(this.data10PerujukBpjs[i].ppkrujukan);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(this.data10PerujukBpjs[i].jumlah),
                    color: this.colors[i]
                });
                if (loopIndex < 10)
                    series.push({
                        name: this.data10PerujukBpjs[i].ppkrujukan,
                        data: dataz2
                    });
                loopIndex++;

            }
            this.chart10PerujukBpjs = new Chart({
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Jumlah "],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien <br/>';
                        return s;

                    }
                    // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    // footerFormat: '</table>',
                    // shared: true,
                    // useHTML: true
                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        })
        // end
        //   chart 10 Besar Diagnosa
        this.appservice.getTransaksi('eis/get-topten-diagnosa?' + tgl).subscribe(data => {
            this.data10Diagnosa = data;

            let pie1 = 2;
            let series = [];
            let categories = [];
            let loopIndex = 0;
            for (let i in this.data10Diagnosa) {
                categories.push(this.data10Diagnosa[i].kddiagnosa);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(this.data10Diagnosa[i].jumlah),
                    color: this.colors[i]
                });
                if (loopIndex < 10)
                    series.push({
                        name: this.data10Diagnosa[i].kddiagnosa,
                        data: dataz2
                    });
                loopIndex++;

            }
            this.chart10Diagnosa = new Chart({
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Jumlah "],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Kunjungan Pasien'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien <br/>';
                        return s;

                    }
                    // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    // footerFormat: '</table>',
                    // shared: true,
                    // useHTML: true
                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        })
        // end

        this.appservice.getTransaksi('eis/get-kunjungan-jenis-pelayanan?' + tgl).subscribe(data => {
            this.dataJenisPelayanan = data;
            let categories = [];
            let dataz2 = [];
            let dataz1 = [];
            for (let i in this.dataJenisPelayanan.data) {
                categories.push(this.dataJenisPelayanan.data[i].namadepartemen);
                dataz2.push(
                    parseFloat(this.dataJenisPelayanan.data[i].reguler)

                );
                dataz1.push(
                    parseFloat(this.dataJenisPelayanan.data[i].eksekutif)

                );
            }
            this.chartJenisPelayanan = new Chart({
                chart: {
                    type: 'column'
                },

                title: {
                    text: ''
                },

                xAxis: {
                    categories: categories//['REGULER', 'EKSEKUTIF']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],
                            style: {
                                fontWeight: 'none'
                            },
                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',');
                            }
                        },
                        showInLegend: true
                    }
                },
                // plotOptions: {
                //     column: {
                //         stacking: 'normal'
                //     }
                // },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    reversed: false,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [
                    {
                        name: 'REGULER',
                        data: dataz2
                    },
                    {
                        name: 'EKSEKUTIF',
                        data: dataz1
                    }

                ]
            })
            // this.chartJenisPelayanan = new Chart({
            //     chart: {
            //         type: 'column'
            //     },
            //     title: {
            //         text: ''
            //     },
            //     xAxis: {
            //         categories: ['Jumlah ' + this.dataJenisPelayanan.total],
            //         labels: {
            //             align: 'center',
            //             style: {
            //                 fontSize: '13px',
            //                 fontFamily: 'Verdana, sans-serif'
            //             }
            //         }
            //     },
            //     yAxis: {
            //         title: {
            //             text: 'Kunjungan Pasien'
            //         }
            //     },
            //     credits: {
            //         enabled: false
            //     },
            //     plotOptions: {
            //         column: {
            //             cursor: 'pointer',

            //             dataLabels: {
            //                 enabled: true,
            //                 color: this.colors[1],
            //                 style: {
            //                     fontWeight: 'none'
            //                 },
            //                 formatter: function () {
            //                     return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
            //                 }
            //             },
            //             showInLegend: true
            //         }
            //     },
            //     legend: {
            //         enabled: true,
            //         borderRadius: 5,
            //         borderWidth: 1
            //     },
            //     series: [
            //         {
            //             name: 'REGULER',
            //             data: [this.dataJenisPelayanan.reguler]
            //         },
            //         {
            //             name: 'EKSEKUTIF',
            //             data: [this.dataJenisPelayanan.eksekutif]
            //         },

            //     ]
            // })


        })

        //   chart kunjungan Pasien Rawat Inap
        this.appservice.getTransaksi('eis/get-kunjungan-rawatinap?' + tgl).subscribe(data => {
            this.dataKunjunganRanap = data;

            let series = [];
            let categories = [];
            let jumlah = 0;
            for (let i in this.dataKunjunganRanap) {
                categories.push(this.dataKunjunganRanap[i].namaruangan);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(this.dataKunjunganRanap[i].jumlah),
                    color: this.colors[i]
                });
                jumlah = jumlah + parseFloat(this.dataKunjunganRanap[i].jumlah);
                // if (loopIndex > 0)
                series.push({
                    name: this.dataKunjunganRanap[i].namaruangan,
                    data: dataz2
                });
                // loopIndex++;

            }
            this.chartKunjunganRanap = new Chart({
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Jumlah " + jumlah],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + '<br/>';
                        return s;

                    }
                    // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    // footerFormat: '</table>',
                    // shared: true,
                    // useHTML: true
                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        })
        // end
        this.appservice.getTransaksi('eis/get-kunjungan-satker?' + tgl).subscribe(data => {
            this.dataKunjunganSatker = data;

            let series = [];
            let categories = [];
            let jumlah = 0;
            for (let i in this.dataKunjunganSatker.dataAll) {
                categories.push(this.dataKunjunganSatker.dataAll[i].satuankerjapasien);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(this.dataKunjunganSatker.dataAll[i].jumlah),
                    color: this.colors[i]
                });
                jumlah = jumlah + parseFloat(this.dataKunjunganSatker.dataAll[i].jumlah);
                // if (loopIndex > 0)
                series.push({
                    name: this.dataKunjunganSatker.dataAll[i].satuankerjapasien,
                    data: dataz2
                });
                // loopIndex++;

            }
            this.chartKunjunganSatker = new Chart({
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Jumlah " + jumlah],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pasien'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + '<br/>';
                        return s;

                    }
                    // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    // footerFormat: '</table>',
                    // shared: true,
                    // useHTML: true
                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        })
    }
    getChartDemografi() {



    }
    // get Service detail Pasien Mendaftar
    klikDetails(idDep, terlayani) {
        if (idDep == null) return
        // let tglPencarian = '&tgl=' + moment(this.carieuy.tgl).format('YYYY-MM-DD')
        let tglPencarian = `&tgl=${moment(this.carieuy.tgl).format('YYYY-MM-DD')}&tglAkhir=${moment(this.carieuy.tglLast).format('YYYY-MM-DD')}`
        this.appservice.getTransaksi('eis/get-count-pasien?' + tglPencarian).subscribe(data => {
            this.dataPasien = data;
            // this.countRajal = this.dataPasien.rawat_jalan;
            // this.countIgd = this.dataPasien.igd;
            // this.countRanap = this.dataPasien.rawat_inap;
            // this.countRadiologi = this.dataPasien.radiologi;
            // this.countLab = this.dataPasien.laboratorium;
            // this.countBedah = this.dataPasien.operasi;
            // this.countRehab = this.dataPasien.rehab_medik;
            // this.countTotal = this.dataPasien.jumlah;
            this.listCountPengunjung = []
            let total = 0;
            for (let i = 0; i < this.dataPasien.length; i++) {
                const element = this.dataPasien[i];
                element.warna = this.listWarna[i]
                element.gambar = this.listGambar[i]
                total = total + parseFloat(element.jumlah)
                element.namadepartemen = element.namadepartemen.replace('Instalasi', 'Pengunjung ')
            }
            // this.dataPasien.push({
            //     "id": null,
            //     "namadepartemen": "TOTAL PASIEN",
            //     "jumlah": total,
            //     "warna": 'total',
            //     "gambar": 'assets/img/icon-pasien.png'
            // })
            this.listCountPengunjung = this.dataPasien
        })

        this.appservice.getTransaksi('eis/get-count-pasien-terlayani?' + tglPencarian).subscribe(data => {
            // this.dataPasienTerlayni = data;
            let datas: any = data
            // this.countRajalTerlayani = this.dataPasienTerlayni.data.rawat_jalan;
            // this.countIgdTerlayani = this.dataPasienTerlayni.data.igd;
            // this.countRanapTerlayani = this.dataPasienTerlayni.rawat_inap;
            // this.countRadiologiTerlayani = this.dataPasienTerlayni.data.radiologi;
            // this.countLabTerlayani = this.dataPasienTerlayni.data.laboratorium;
            // this.countBedahTerlayani = this.dataPasienTerlayni.data.operasi;
            // this.countRehabTerlayani = this.dataPasienTerlayni.data.rehab_medik;
            // this.countTotalTerlayani = this.dataPasienTerlayni.data.jumlah;
            // this.countFarmasiTerlayani = this.dataPasienTerlayni.farmasi;
            // this.countMasihDirawatTerlayani = this.dataPasienTerlayni.masihDirawat;
            this.listCountKunjungan = []
            let total = 0;
            for (let i = 0; i < datas.length; i++) {
                const element = datas[i];
                element.warna = this.listWarna[i]
                element.gambar = this.listGambar[i]

                total = total + parseFloat(element.jumlah)
                element.namadepartemen = element.namadepartemen.replace('Instalasi', 'Kunjungan ')
            }
            // datas.push({
            //     "id": null,
            //     "namadepartemen": "TOTAL PASIEN",
            //     "jumlah": total,
            //     "warna": 'total',
            //     "gambar": 'assets/img/icon-pasien.png'
            // })
            this.listCountKunjungan = datas

        })
        if (idDep == 14 && terlayani == true) {
            this.showFarmasi = true;
            this.getServicePasienTerlayani(idDep, tglPencarian);
        } else if (terlayani == true) {
            this.getServicePasienTerlayani(idDep, tglPencarian);
            this.showRawatJalan = true;
        } else {
            this.getServiceTableMoreInfo(idDep, tglPencarian);
            this.showRawatJalan = true;
        }
    }
    klikDetailss(idDep, terlayani) {
        if (idDep == 1001 || idDep == 19 || idDep == 717 || idDep == 24 || idDep == 16
            || idDep == 18 || idDep == 277 || idDep == 27 || idDep == 1000 || idDep == 999 || idDep == 3 || idDep == 575
            || idDep == 453 || idDep == 4533 || idDep == 28 || idDep == 12 || idDep == 322 || idDep == 448 || idDep == 496
            || idDep == 44 || idDep == 320 || idDep == 251 || idDep == 5) {
            this.getTrendPerbulan(idDep)
        } else {
            this.isShowTrendshowPerbulanx = false
        }
    }
    getServiceTableMoreInfo(idDep, tgl) {
        this.dataTableRajal = [];
        this.appservice.getTransaksi('eis/detail-pasien-rj?idRuangan=' + idDep + tgl).subscribe(table => {
            this.dataTableRajal = [];
            this.dataTableRajal = table;
            if (idDep == 16) {
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

                for (let i = 0; i < this.dataTableRajal.data.length; i++) {
                    const element = this.dataTableRajal.data[i];
                    const firstDate: any = new Date(element.tglregistrasi);
                    var plg = new Date()
                    if (element.tglpulang != null)
                        plg = new Date(element.tglpulang)
                    const secondDate: any = plg

                    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    element.lamarawat = diffDays + ' hari'
                }
            }

            this.totalRecords = this.dataTableRajal.count;
            this.dataTableRajal = this.dataTableRajal.data;
        });
    }

    // end detail Pasien Mendaftar

    // get Service detail Pasien Terlayani

    getServicePasienTerlayani(idDep, tgl) {
        this.dataTableRajal = [];
        this.dataTableFarmasi = [];
        this.appservice.getTransaksi('eis/detail-pasien-teralayani/' + idDep + '?' + tgl).subscribe(table => {
            this.dataTableRajal = [];
            this.dataTableFarmasi = [];
            let datas: any = table
            if (idDep == 16 || idDep == 999) {
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

                for (let i = 0; i < datas.data.length; i++) {
                    const element = datas.data[i];
                    const firstDate: any = new Date(element.tglregistrasi);
                    var plg = new Date()
                    if (element.tglpulang != null)
                        plg = new Date(element.tglpulang)
                    const secondDate: any = plg

                    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                    element.lamarawat = diffDays + ' hari'
                }
            }
            if (idDep == 14) {
                this.dataTableFarmasi = datas;
                this.totalRecords = this.dataTableFarmasi.count;
                this.dataTableFarmasi = this.dataTableFarmasi.data;
            } else {
                this.dataTableRajal = datas;
                this.totalRecords = this.dataTableRajal.count;
                this.dataTableRajal = this.dataTableRajal.data;
            }

        });
    }

    // end detail Pasien Terlayani
    togglePasienMendaftar() {
        this.showTerlayani = true;
        this.showMendaftar = false;
        // this.getServiceTableMoreInfo(18);
    }


    /**
     * @method ngAfterViewInit
     */
    ngAfterViewInit() {
        Prism.highlightAll();
        // $('#map1').vectorMap({
        //     map: 'world_mill_en',
        //     panOnDrag: true,
        //     focusOn: {
        //       x: 0.5,
        //       y: 0.5,
        //       scale: 2,
        //       animate: true
        //     },
        //     series: {
        //       regions: [{
        //         scale: ['#C8EEFF', '#0071A4'],
        //         normalizeFunction: 'polynomial',
        //         values: {
        //           "AF": 16.63,
        //           "AL": 11.58,
        //           "DZ": 158.97,
        //           "AO": 85.81,
        //           "AG": 1.1,
        //           "AR": 351.02,
        //           "AM": 8.83,
        //           "AU": 1219.72,
        //           "AT": 366.26,
        //           "AZ": 52.17,
        //           "BS": 7.54,
        //           "BH": 21.73,
        //           "BD": 105.4,
        //           "BB": 3.96,
        //           "BY": 52.89,
        //           "BE": 461.33,
        //           "BZ": 1.43,
        //           "BJ": 6.49,
        //           "BT": 1.4,
        //           "BO": 19.18,
        //           "BA": 16.2,
        //           "BW": 12.5,
        //           "BR": 2023.53,
        //           "BN": 11.96,
        //           "BG": 44.84,
        //           "BF": 8.67,
        //           "BI": 1.47,
        //           "KH": 11.36,
        //           "CM": 21.88,
        //           "CA": 1563.66,
        //           "CV": 1.57,
        //           "CF": 2.11,
        //           "TD": 7.59,
        //           "CL": 199.18,
        //           "CN": 5745.13,
        //           "CO": 283.11,
        //           "KM": 0.56,
        //           "CD": 12.6,
        //           "CG": 11.88,
        //           "CR": 35.02,
        //           "CI": 22.38,
        //           "HR": 59.92,
        //           "CY": 22.75,
        //           "CZ": 195.23,
        //           "DK": 304.56,
        //           "DJ": 1.14,
        //           "DM": 0.38,
        //           "DO": 50.87,
        //           "EC": 61.49,
        //           "EG": 216.83,
        //           "SV": 21.8,
        //           "GQ": 14.55,
        //           "ER": 2.25,
        //           "EE": 19.22,
        //           "ET": 30.94,
        //           "FJ": 3.15,
        //           "FI": 231.98,
        //           "FR": 2555.44,
        //           "GA": 12.56,
        //           "GM": 1.04,
        //           "GE": 11.23,
        //           "DE": 3305.9,
        //           "GH": 18.06,
        //           "GR": 305.01,
        //           "GD": 0.65,
        //           "GT": 40.77,
        //           "GN": 4.34,
        //           "GW": 0.83,
        //           "GY": 2.2,
        //           "HT": 6.5,
        //           "HN": 15.34,
        //           "HK": 226.49,
        //           "HU": 132.28,
        //           "IS": 12.77,
        //           "IN": 1430.02,
        //           "ID": 695.06,
        //           "IR": 337.9,
        //           "IQ": 84.14,
        //           "IE": 204.14,
        //           "IL": 201.25,
        //           "IT": 2036.69,
        //           "JM": 13.74,
        //           "JP": 5390.9,
        //           "JO": 27.13,
        //           "KZ": 129.76,
        //           "KE": 32.42,
        //           "KI": 0.15,
        //           "KR": 986.26,
        //           "KW": 117.32,
        //           "KG": 4.44,
        //           "LA": 6.34,
        //           "LV": 23.39,
        //           "LB": 39.15,
        //           "LS": 1.8,
        //           "LR": 0.98,
        //           "LY": 77.91,
        //           "LT": 35.73,
        //           "LU": 52.43,
        //           "MK": 9.58,
        //           "MG": 8.33,
        //           "MW": 5.04,
        //           "MY": 218.95,
        //           "MV": 1.43,
        //           "ML": 9.08,
        //           "MT": 7.8,
        //           "MR": 3.49,
        //           "MU": 9.43,
        //           "MX": 1004.04,
        //           "MD": 5.36,
        //           "MN": 5.81,
        //           "ME": 3.88,
        //           "MA": 91.7,
        //           "MZ": 10.21,
        //           "MM": 35.65,
        //           "NA": 11.45,
        //           "NP": 15.11,
        //           "NL": 770.31,
        //           "NZ": 138,
        //           "NI": 6.38,
        //           "NE": 5.6,
        //           "NG": 206.66,
        //           "NO": 413.51,
        //           "OM": 53.78,
        //           "PK": 174.79,
        //           "PA": 27.2,
        //           "PG": 8.81,
        //           "PY": 17.17,
        //           "PE": 153.55,
        //           "PH": 189.06,
        //           "PL": 438.88,
        //           "PT": 223.7,
        //           "QA": 126.52,
        //           "RO": 158.39,
        //           "RU": 1476.91,
        //           "RW": 5.69,
        //           "WS": 0.55,
        //           "ST": 0.19,
        //           "SA": 434.44,
        //           "SN": 12.66,
        //           "RS": 38.92,
        //           "SC": 0.92,
        //           "SL": 1.9,
        //           "SG": 217.38,
        //           "SK": 86.26,
        //           "SI": 46.44,
        //           "SB": 0.67,
        //           "ZA": 354.41,
        //           "ES": 1374.78,
        //           "LK": 48.24,
        //           "KN": 0.56,
        //           "LC": 1,
        //           "VC": 0.58,
        //           "SD": 65.93,
        //           "SR": 3.3,
        //           "SZ": 3.17,
        //           "SE": 444.59,
        //           "CH": 522.44,
        //           "SY": 59.63,
        //           "TW": 426.98,
        //           "TJ": 5.58,
        //           "TZ": 22.43,
        //           "TH": 312.61,
        //           "TL": 0.62,
        //           "TG": 3.07,
        //           "TO": 0.3,
        //           "TT": 21.2,
        //           "TN": 43.86,
        //           "TR": 729.05,
        //           "TM": 0,
        //           "UG": 17.12,
        //           "UA": 136.56,
        //           "AE": 239.65,
        //           "GB": 2258.57,
        //           "US": 14624.18,
        //           "UY": 40.71,
        //           "UZ": 37.72,
        //           "VU": 0.72,
        //           "VE": 285.21,
        //           "VN": 101.99,
        //           "YE": 30.02,
        //           "ZM": 15.69,
        //           "ZW": 5.57
        //         }
        //       }]
        //     }
        //   });
        // $('#world-map').vectorMap();
        // $('#world-map-markers').vectorMap({
        //     map: [],
        //     normalizeFunction: 'polynomial',
        //     hoverOpacity: 0.9,
        //     hoverColor: true,
        //     backgroundColor: 'transparent',
        //     onRegionTipShow: function (e, tip, code) {
        //         e.preventDefault();
        //     },
        //     regionLabelStyle: {
        //         initial: {
        //             fill: '#B90E32'
        //         },
        //         hover: {
        //             fill: 'black'
        //         }
        //     },
        //     regionStyle: {
        //         initial: {
        //             fill: 'rgba(210, 214, 222, 1)',
        //             'fill-opacity': 0.7,
        //             stroke: 'none',
        //             'stroke-width': 0,
        //             'stroke-opacity': 1
        //         },
        //         hover: {
        //             'fill-opacity': 0.6,
        //             cursor: 'pointer'
        //         },
        //         selected: {
        //             fill: "#2A3F52"
        //         }
        //     }
        // });
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
    // applyFilterss(filterValue: string) {
    //     filterValue = filterValue.trim(); // Remove whitespace
    //     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //     this.dataSourceBor.filter = filterValue;
    // }



    addMaps() {


    }
}
// function createNewUser(id: number): UserData {
//     const name =
//         NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//         NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//     return {
//       id: id.toString(),
//       name: name,
//       progress: Math.round(Math.random() * 100).toString(),
//       color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//     };
//   }

/** Constants used to fill up our data base. */
//   const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//     'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
//   const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//     'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//     'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface dataGridInfoRuangan {
    namaruangan: string;
    belumperiksa: string;
    diperiksa: string;
    batalregistrasi: string;
    total: string;
}

// export interface dataGridBorLos {
//     bulan: string;
//     bor: string;
//     alos: string;
//     bto: string;
//     toi: string;
//     gdr: string;
//     ndr: string;
// }

