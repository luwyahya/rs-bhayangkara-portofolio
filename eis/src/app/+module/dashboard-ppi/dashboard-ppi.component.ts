import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import * as Prism from 'prismjs';
import { Chart, Highcharts, MapChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import * as $ from 'jquery';
import { AppService } from '../../shared/app.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-dashboard-ppi',
  templateUrl: './dashboard-ppi.component.html',
  styleUrls: ['./dashboard-ppi.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})
export class DashboardPpiComponent implements OnInit {
  listKepatuhan = []
  item: any = {}
  colors = Highcharts.getOptions().colors;
  chartInsiden: any
  chartGrading: any
  chartKepatuhan: any
  date = new FormControl(moment());
  colorNyieun = ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
    '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
    '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
    '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
    '#13ec30', '#7faf7a', '#408055', '#09790e'];
  constructor(public appservice: AppService) { }
  chosenYearHandler(normalizedYear: _moment.Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.getData(this.date.value.year(), this.date.value.month())
  }
  ngOnInit() {
    this.item.totalAll = 0
    this.item.rata2All = 0
    this.getData(this.date.value.year(), this.date.value.month())
  }

  getData(tahun, bulan) {

    let bln = bulan + 1
    if (bln.toString().length == 1)
      bln = '0' + bln.toString()
    // console.log()
    let blnthn = tahun + '-' + bln
    this.item.totalAll = 0
    this.item.rata2All = 0
    this.appservice.getTransaksi('eis/get-kepatuhan-cuci-tangan?bulan=' + blnthn).subscribe(data => {
      let datas: any = data
      for (let i = 0; i < datas.length; i++) {
        const element = datas[i];
        this.item.totalAll = this.item.totalAll + parseFloat(element.total)

      }
      this.item.rata2All = this.item.totalAll / datas.length
      this.listKepatuhan = datas
      this.loadChart(this.listKepatuhan)

    })
  }
  loadChart(data) {
    let dataz = [];
    for (let i in data) {
      dataz.push({
        name: data[i].namaruangan,
        y: parseFloat(data[i].total),
      });
    }
    this.chartKepatuhan = new Chart({
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
              return this.y + ' %';
            }
          },
          showInLegend: true
        },

      },
      credits: {
        // text: 'Total Pasien ' ,
        enabled: false
      },
      legend: {
        enabled: true,
        borderRadius: 5,
        borderWidth: 1
      },
      series: [{
        type: 'pie',
        name: 'Persentase Kepatuhan ',
        // colorByPoint: true,
        data: dataz

      }]
    })



  }


}
