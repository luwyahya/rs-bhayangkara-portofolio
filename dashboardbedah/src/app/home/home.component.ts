import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild, Inject } from '@angular/core';
import * as Prism from 'prismjs';
import { AppService } from '../shared/app.service';
import { Chart, Highcharts, MapChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxAutoScroll } from "ngx-auto-scroll";
import { HostListener, ElementRef } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { TableModule } from 'primeng/table';
// import {Injectable, Provider} from 'angular2/core';
// import {window} from 'angular2/src/facade/browser';
// import {unimplemented} from 'angular2/src/facade/exceptions';


let $;
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [
        trigger('scrollAnimation', [
            state('show', style({
                opacity: 1,
                transform: "translateX(0)"
            })),
            state('hide', style({
                opacity: 0,
                transform: "translateX(-100%)"
            })),
            transition('show => hide', animate('700ms ease-out')),
            transition('hide => show', animate('700ms ease-in'))
        ])
    ]
})



export class HomeComponent implements AfterViewInit, OnInit {
    // @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;
    state = 'hide'
    // public forceScrollDown(): void {
    //     this.ngxAutoScroll.forceScrollDown();
    // }
    apiTimer: any;
    counter = 10;
    public now: Date = new Date();
    tanggal = new Date().toLocaleDateString();
    arr = this.tanggal.split('/');
    colors = Highcharts.getOptions().colors;
    dataKamar: any;
    item: any = {}
    colorNyieun = ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
        '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
        '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
        '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
        '#13ec30', '#7faf7a', '#408055', '#09790e'];
    color2 = ['#7cb5ec', '#FF0000', '#C71585', '#ea5f5a', '#90ed7d', '#f7a35c',
        '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b',
        '#91e8e1', '#CD5C5C', '#FF69B4', '#FF8C00', '#9370DB', '#ADFF2F',
        '#00FF00', '#9ACD32', '#66CDAA', '#00FFFF', '#4682B4', '#cdff00',
        '#CD853F', '#ffd6b1', '#1E90FF', '#00CED1'];
    jumlahTempatTidur: any = 0;
    JumlahIsi: any = 0;
    JumlahKosong: any = 0;
    constructor(
        public appservice: AppService,
        @Inject(Window) private window: Window,
        public el: ElementRef) {
    }

    ngOnInit() {
        this.getData();
        // this.apiTimer = setInterval(() => {
        //     this.gotoElement('bottom')
        // }, (this.counter * 500)); //5 detik
        // this.apiTimer = setInterval(() => {
        //     this.gotoElement('top')
        // }, (this.counter * 600)); //5 detik

        this.apiTimer = setInterval(() => {
            this.getData()
        }, (this.counter * 6000)); //60 detik

    }
    getData() {
        this.appservice.getTransaksi('laboratorium/get-all-permintaan-operasi-jkn4').subscribe(e => {
            this.item = e;
            var data: any = this.item[0];
            this.jumlahTempatTidur = data.rencana;
            this.JumlahIsi = data.terlayani;
            // this.JumlahKosong = data.kamarkosong;
            // this.jumlahTempatTidur=this.jumlahTempatTidur.kamartotal
        })
        this.appservice.getTransaksi('laboratorium/get-all-permintaan-operasi-jkn5').subscribe(e => {
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
                    idtempattidur: data[i].norec,
                    idruangan: data[i].kodebooking,
                    namaruangan: data[i].namapoli,
                    tanggaloperasi: data[i].tanggaloperasi,
                    jenistindakan: data[i].jenistindakan,
                    nopeserta: data[i].nopeserta,
                    nocm: data[i].nocm,
                    namapeserta: data[i].namapeserta
                };
                arrTT.push(arrayM)
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
            for (let i = 0; i < arrTT.length; i++) {
                arrTT[i].warna = warna[i]
                if (arrTT[i].namaruangan.indexOf('Rawat Sehari') > -1)
                    arrTT[i].namaruangan = 'RRS Bedah'
            }

            console.log(arrTT)
            this.dataKamar = arrTT
        })
    }

    @HostListener('window:scroll', ['$event'])




    /**
     * @method ngAfterViewInit
     */
    ngAfterViewInit() {
        Prism.highlightAll();
    }
}