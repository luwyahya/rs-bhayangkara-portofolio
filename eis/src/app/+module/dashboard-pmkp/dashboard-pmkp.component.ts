import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import * as Prism from 'prismjs';

import { Chart, Highcharts, MapChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as moment from 'moment';
// declare var $:JQueryStatic;

import * as $ from 'jquery';
import { AppService } from '../../shared/app.service';

@Component({
  selector: 'app-dashboard-pmkp',
  templateUrl: './dashboard-pmkp.component.html',
  styleUrls: ['./dashboard-pmkp.component.css']
})
export class DashboardPmkpComponent implements OnInit {
  item: any = {
    tahun: new Date().getFullYear()
  }
  colors = Highcharts.getOptions().colors;
  chartInsiden: any
  chartGrading: any
  colorNyieun = ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
    '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
    '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
    '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
    '#13ec30', '#7faf7a', '#408055', '#09790e'];
  chartKepatuhan: any
  chartLaundry: any
  chartSanitasi: any
  chartIPSRS: any
  chartIT: any
  chartDiklat: any
  listKepatuhan: any[] = []
  chartGizi: any
  chartAsal: any
  chartJenisProduk: any
  constructor(public appservice: AppService) { }

  ngOnInit() {
    this.item.tglAwal = new Date(new Date().setMonth(new Date().getMonth() - 3))
    this.item.tglAkhir = new Date()
    this.loadData()
  }
  getDataByTglAwal() {
    this.loadData()
  }
  getDataByTglAkhir() {
    this.loadData()
  }
  loadData() {
    if (this.item.tglAwal != undefined && this.item.tglAkhir != undefined) {
      this.loadJenisInsiden(moment(this.item.tglAwal).format('YYYY-MM-DD 00:00'), moment(this.item.tglAkhir).format('YYYY-MM-DD 23:59'))
      this.loadGrading(moment(this.item.tglAwal).format('YYYY-MM-DD 00:00'), moment(this.item.tglAkhir).format('YYYY-MM-DD 23:59'))
      let dari = moment(this.item.tglAwal).format('YYYY-MM-DD 00:00')
      let sampai = moment(this.item.tglAkhir).format('YYYY-MM-DD 23:59')
      this.getPPI(dari, sampai)
      this.getLaundry(dari, sampai)
      this.getSanitasi(dari, sampai)
      this.getIPSRS(dari, sampai)
      this.getIT(dari, sampai)
      this.getDiklat(dari, sampai)
      this.getGizi(dari, sampai)
      this.getAsset()
    }
  }
  getAsset() {
    this.appservice.getTransaksi('eis/get-data-asset').subscribe(data => {
      let result: any = data
      let dataz = [];
      let slice = true;
      let jenisproduk =[]
      let jmlPasien = 0;
      let jmlJenis = 0;
      for (let i in result.asalproduk) {
        dataz.push({
          name: result.asalproduk[i].asalproduk,
          y: parseFloat(result.asalproduk[i].jumlah),
        });
        jmlPasien = jmlPasien + parseFloat(result.asalproduk[i].jumlah)
      }

      for (let i in result.jenisproduk) {
        jenisproduk.push({
          name: result.jenisproduk[i].jenis,
          y: parseFloat(result.jenisproduk[i].jumlah)
        });
        jmlJenis = jmlJenis + parseFloat(result.jenisproduk[i].jumlah)
      }
      this.chartAsal = new Chart({
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
                return this.percentage.toFixed(2) + ' %';
              }
            },
            showInLegend: true
          },

        },
        credits: {
          text: 'Total ' + jmlPasien,
          // enabled: false
        },
        legend: {
          enabled: true,
          borderRadius: 5,
          borderWidth: 1
        },
        series: [{
          type: 'pie',
          name: 'Persentase Jumlah',
          data: dataz

        }]
      })

      this.chartJenisProduk = new Chart({
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
                return this.percentage.toFixed(2) + ' %';
              }
            },
            showInLegend: true
          },

        },
        credits: {
          text: 'Total ' + jmlJenis,
          // enabled: false
        },
        legend: {
          enabled: true,
          borderRadius: 5,
          borderWidth: 1
        },
        series: [{
          type: 'pie',
          name: 'Persentase Jumlah',
          data: jenisproduk

        }]
      })
    })

  }
  getGizi(tglAwal, tglAkhir) {

    this.appservice.getTransaksi('eis/get-trend-gizi?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir
    ).subscribe(data => {

      let trend = data;
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []
      let categories = []
      for (let i in trend) {
        data1.push({
          y: parseFloat(trend[i].masuk),
          color: 'rgb(0, 192, 239)'
        });
      }

      // console.log(data1)
      for (let i in trend) {
        data2.push({
          y: parseFloat(trend[i].keluar),
          color: 'rgb(216, 27, 96)'//this.colorNyieun[i]
        });
      }
      // for (let i in trend) {
      //     data3.push({
      //         y: parseFloat(trend[i].trend),
      //         color: 'rgb(216, 27, 96)'//this.colorNyieun[i]
      //     });
      // }

      for (let i in trend) {
        categories.push(trend[i].tanggal);
      }
      this.chartGizi = new Chart({
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
            text: 'Jumlah'
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
          line: {
            cursor: 'pointer',

            dataLabels: {
              enabled: true,
              color: 'black',
              style: {
                fontWeight: 'bold'
              },
              formatter: function () {
                return Highcharts.numberFormat(this.y, 0, '.', ',');
              }
            },
            showInLegend: true
          }
        },
        credits: {
          enabled: false
        },

        series: [
          {
            type: 'column',
            name: 'Order',
            color: 'rgb(0, 192, 239)',
            data: data1,

          },
          {
            type: 'line',
            name: 'Kirim',
            color: 'rgb(216, 27, 96)',
            data: data2,
          },

        ]

      })

    })
  }
  getDiklat(tglAwal, tglAkhir) {

    this.appservice.getTransaksi('eis/get-trend-diklat?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir
    ).subscribe(data => {

      let trend = data;
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []
      let categories = []
      for (let i in trend) {
        data1.push({
          y: parseFloat(trend[i].masuk),
          color: 'rgb(0, 192, 239)'
        });
      }

      // // console.log(data1)
      // for (let i in trend) {
      //   data2.push({
      //     y: parseFloat(trend[i].keluar),
      //     color: 'rgb(255, 116, 116)'//this.colorNyieun[i]
      //   });
      // }
      // // for (let i in trend) {
      // //     data3.push({
      // //         y: parseFloat(trend[i].trend),
      // //         color: 'rgb(216, 27, 96)'//this.colorNyieun[i]
      // //     });
      // // }

      for (let i in trend) {
        categories.push(trend[i].tanggal);
      }
      this.chartDiklat = new Chart({
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
            text: 'Jumlah'
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
          line: {
            cursor: 'pointer',

            dataLabels: {
              enabled: true,
              color: 'black',
              style: {
                fontWeight: 'bold'
              },
              formatter: function () {
                return Highcharts.numberFormat(this.y, 0, '.', ',');
              }
            },
            showInLegend: true
          }
        },
        credits: {
          enabled: false
        },

        series: [
          {
            type: 'line',
            name: 'Penerimaan',
            color: 'rgb(0, 192, 239)',
            data: data1,
          },
        ]

      })

    })
  }
  getIT(tglAwal, tglAkhir) {

    this.appservice.getTransaksi('eis/get-trend-sanitasi?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir
      + '&jenis=it').subscribe(data => {

        let trend = data;
        let data1 = []
        let data2 = []
        let data3 = []
        let data4 = []
        let categories = []
        for (let i in trend) {
          data1.push({
            y: parseFloat(trend[i].masuk),
            color: 'rgb(169, 255, 150)'
          });
        }

        // console.log(data1)
        for (let i in trend) {
          data2.push({
            y: parseFloat(trend[i].keluar),
            color: 'rgb(255, 116, 116)'//this.colorNyieun[i]
          });
        }
        // for (let i in trend) {
        //     data3.push({
        //         y: parseFloat(trend[i].trend),
        //         color: 'rgb(216, 27, 96)'//this.colorNyieun[i]
        //     });
        // }

        for (let i in trend) {
          categories.push(trend[i].tanggal);
        }
        this.chartIT = new Chart({
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
              text: 'Jumlah'
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
            line: {
              cursor: 'pointer',

              dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                  fontWeight: 'bold'
                },
                formatter: function () {
                  return Highcharts.numberFormat(this.y, 0, '.', ',');
                }
              },
              showInLegend: true
            }
          },
          credits: {
            enabled: false
          },

          series: [
            {
              type: 'column',
              name: 'Permohonan',
              color: 'rgb(169, 255, 150)',
              // pointInterval: 24 * 3600 * 1000,
              // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
              data: data1,

            },
            {
              type: 'line',
              name: 'Rata-rata Respond / Menit',
              color: 'rgb(255, 116, 116)',
              // pointInterval: 24 * 3600 * 1000,
              // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
              data: data2,
            },
            // {
            //     type: 'line',
            //     name: 'Rekap Harian',
            //     color:'rgb(216, 27, 96)',
            //     data: data3,
            // },
            // {
            //     type: 'line',
            //     name: 'Batal Registrasi',
            //     // pointInterval: 24 * 3600 * 1000,
            //     // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
            //     data: data4,
            // }
          ]

        })

      })
  }
  getIPSRS(tglAwal, tglAkhir) {

    this.appservice.getTransaksi('eis/get-trend-sanitasi?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir
      + '&jenis=ipsrs').subscribe(data => {

        let trend = data;
        let data1 = []
        let data2 = []
        let data3 = []
        let data4 = []
        let categories = []
        for (let i in trend) {
          data1.push({
            y: parseFloat(trend[i].masuk),
            color: 'rgb(153, 158, 255)'
          });
        }

        // console.log(data1)
        for (let i in trend) {
          data2.push({
            y: parseFloat(trend[i].keluar),
            color: 'rgb(255, 116, 116)'//this.colorNyieun[i]
          });
        }
        // for (let i in trend) {
        //     data3.push({
        //         y: parseFloat(trend[i].trend),
        //         color: 'rgb(216, 27, 96)'//this.colorNyieun[i]
        //     });
        // }

        for (let i in trend) {
          categories.push(trend[i].tanggal);
        }
        this.chartIPSRS = new Chart({
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
              text: 'Jumlah'
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
            line: {
              cursor: 'pointer',

              dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                  fontWeight: 'bold'
                },
                formatter: function () {
                  return Highcharts.numberFormat(this.y, 0, '.', ',');
                }
              },
              showInLegend: true
            }
          },
          credits: {
            enabled: false
          },

          series: [
            {
              type: 'column',
              name: 'Permohonan',
              color: 'rgb(153, 158, 255)',
              // pointInterval: 24 * 3600 * 1000,
              // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
              data: data1,

            },
            {
              type: 'line',
              name: 'Rata-rata Respond / Menit',
              color: 'rgb(255, 116, 116)',
              // pointInterval: 24 * 3600 * 1000,
              // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
              data: data2,
            },
            // {
            //     type: 'line',
            //     name: 'Rekap Harian',
            //     color:'rgb(216, 27, 96)',
            //     data: data3,
            // },
            // {
            //     type: 'line',
            //     name: 'Batal Registrasi',
            //     // pointInterval: 24 * 3600 * 1000,
            //     // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
            //     data: data4,
            // }
          ]

        })

      })
  }
  getSanitasi(tglAwal, tglAkhir) {

    this.appservice.getTransaksi('eis/get-trend-sanitasi?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir
      + '&jenis=sanitasi').subscribe(data => {

        let trend = data;
        let data1 = []
        let data2 = []
        let data3 = []
        let data4 = []
        let categories = []
        for (let i in trend) {
          data1.push({
            y: parseFloat(trend[i].masuk),
            color: 'rgb(255, 188, 117)'
          });
        }

        // console.log(data1)
        for (let i in trend) {
          data2.push({
            y: parseFloat(trend[i].keluar),
            color: 'rgb(255, 116, 116)'//this.colorNyieun[i]
          });
        }
        // for (let i in trend) {
        //     data3.push({
        //         y: parseFloat(trend[i].trend),
        //         color: 'rgb(216, 27, 96)'//this.colorNyieun[i]
        //     });
        // }

        for (let i in trend) {
          categories.push(trend[i].tanggal);
        }
        this.chartSanitasi = new Chart({
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
              text: 'Jumlah'
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
            line: {
              cursor: 'pointer',

              dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                  fontWeight: 'bold'
                },
                formatter: function () {
                  return Highcharts.numberFormat(this.y, 0, '.', ',');
                }
              },
              showInLegend: true
            }
          },
          credits: {
            enabled: false
          },

          series: [
            {
              type: 'column',
              name: 'Permohonan',
              color: 'rgb(255, 188, 117)',
              // pointInterval: 24 * 3600 * 1000,
              // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
              data: data1,

            },
            {
              type: 'line',
              name: 'Rata-rata Respond / Menit',
              color: 'rgb(255, 116, 116)',
              // pointInterval: 24 * 3600 * 1000,
              // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
              data: data2,
            },
            // {
            //     type: 'line',
            //     name: 'Rekap Harian',
            //     color:'rgb(216, 27, 96)',
            //     data: data3,
            // },
            // {
            //     type: 'line',
            //     name: 'Batal Registrasi',
            //     // pointInterval: 24 * 3600 * 1000,
            //     // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
            //     data: data4,
            // }
          ]

        })

      })
  }
  getLaundry(tglAwal, tglAkhir) {

    this.appservice.getTransaksi('eis/get-trend-laundry?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir).subscribe(data => {

      let trend = data;
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []
      let categories = []
      for (let i in trend) {
        data1.push({
          y: parseFloat(trend[i].masuk),
          color: 'rgb(149, 206, 255)'
        });
      }

      // console.log(data1)
      for (let i in trend) {
        data2.push({
          y: parseFloat(trend[i].keluar),
          color: '#71db5f'//this.colorNyieun[i]
        });
      }
      // for (let i in trend) {
      //     data3.push({
      //         y: parseFloat(trend[i].trend),
      //         color: 'rgb(216, 27, 96)'//this.colorNyieun[i]
      //     });
      // }

      for (let i in trend) {
        categories.push(trend[i].tanggal);
      }
      this.chartLaundry = new Chart({
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
            text: 'Jumlah'
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
          line: {
            cursor: 'pointer',

            dataLabels: {
              enabled: true,
              color: 'black',
              style: {
                fontWeight: 'bold'
              },
              formatter: function () {
                return Highcharts.numberFormat(this.y, 0, '.', ',');
              }
            },
            showInLegend: true
          }
        },
        credits: {
          enabled: false
        },

        series: [
          {
            type: 'column',
            name: 'Penerimaan Linen',
            color: 'rgb(149, 206, 255)',
            // pointInterval: 24 * 3600 * 1000,
            // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
            data: data1,

          },
          {
            type: 'column',
            name: 'Distribusi Linen',
            color: '#71db5f',
            // pointInterval: 24 * 3600 * 1000,
            // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
            data: data2,
          },
          // {
          //     type: 'line',
          //     name: 'Rekap Harian',
          //     color:'rgb(216, 27, 96)',
          //     data: data3,
          // },
          // {
          //     type: 'line',
          //     name: 'Batal Registrasi',
          //     // pointInterval: 24 * 3600 * 1000,
          //     // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
          //     data: data4,
          // }
        ]

      })

    })
  }
  getPPI(dari, sampai) {


    this.item.totalAll = 0
    this.item.rata2All = 0
    this.appservice.getTransaksi('eis/get-kepatuhan-cuci-tangan?tglAwal=' + dari + '&tglAkhir=' + sampai).subscribe(data => {
      let datas: any = data
      for (let i = 0; i < datas.length; i++) {
        const element = datas[i];
        this.item.totalAll = this.item.totalAll + parseFloat(element.total)

      }
      this.item.rata2All = this.item.totalAll / datas.length
      this.item.rata2All = parseFloat(this.item.rata2All.toFixed(2))
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

  loadGrading(tglAwal, tglAkhir) {
    this.appservice.getTransaksi('pmkp/get-chart-grading?tglAwal=' + tglAwal
      + '&tglAkhir=' + tglAkhir
    ).subscribe(data => {
      let result = data;

      let series = [];
      let categories = [];
      let loopIndex = 0;
      //       BIRU
      // HIJAU
      // KUNING
      // MERAH
      for (let i in result) {
        categories.push(result[i].name);
        var warna = this.colors[i]
        if (result[i].name == 'BIRU')
          warna = 'rgb(149, 206, 255)'
        if (result[i].name == 'HIJAU')
          warna = 'rgb(144, 237, 125)'
        if (result[i].name == 'KUNING')
          warna = 'yellow'
        if (result[i].name == 'MERAH')
          warna = 'red'
        let dataz2 = [];
        dataz2.push({
          y: parseFloat(result[i].jumlah),
          color: warna
        });
        // if (loopIndex < 10)
        series.push({
          name: result[i].name,
          color: warna,
          data: dataz2
        });
        // loopIndex++;

      }
      this.chartGrading = new Chart({
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
            text: 'Grading'
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
  loadJenisInsiden(tglAwal, tglAkhir) {
    this.appservice.getTransaksi('pmkp/get-chart-jenis-keselamatan?tglAwal=' + tglAwal
      + '&tglAkhir=' + tglAkhir).subscribe(data => {
        let result = data;

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
          // if (loopIndex < 10)
          series.push({
            name: result[i].name,
            data: dataz2
          });
          // loopIndex++;

        }
        this.chartInsiden = new Chart({
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
              text: 'Jenis Insiden'
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

}
