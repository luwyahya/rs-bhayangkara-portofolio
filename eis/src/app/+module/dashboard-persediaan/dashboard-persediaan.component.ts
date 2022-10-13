import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Highcharts, Chart } from 'angular-highcharts';
import { AppService } from 'src/app/shared/app.service';
import * as Prism from 'prismjs';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService, Message, LazyLoadEvent } from 'primeng/api';
import * as moment from 'moment'
@Component({
  selector: 'app-dashboard-persediaan',
  templateUrl: './dashboard-persediaan.component.html',
  styleUrls: ['./dashboard-persediaan.component.css'], styles: [`
  /* Column Priorities */
  @media only all {
      th.ui-p-6,
      td.ui-p-6,
      th.ui-p-5,
      td.ui-p-5,
      th.ui-p-4,
      td.ui-p-4,
      th.ui-p-3,
      td.ui-p-3,
      th.ui-p-2,
      td.ui-p-2,
      th.ui-p-1,
      td.ui-p-1 {
          display: none;
      }
  }
  
  /* Show priority 1 at 320px (20em x 16px) */
  @media screen and (min-width: 20em) {
      th.ui-p-1,
      td.ui-p-1 {
          display: table-cell;
      }
  }
  
  /* Show priority 2 at 480px (30em x 16px) */
  @media screen and (min-width: 30em) {
      th.ui-p-2,
      td.ui-p-2 {
          display: table-cell;
      }
  }
  
  /* Show priority 3 at 640px (40em x 16px) */
  @media screen and (min-width: 40em) {
      th.ui-p-3,
      td.ui-p-3 {
          display: table-cell;
      }
  }
  
  /* Show priority 4 at 800px (50em x 16px) */
  @media screen and (min-width: 50em) {
      th.ui-p-4,
      td.ui-p-4 {
          display: table-cell;
      }
  }
  
  /* Show priority 5 at 960px (60em x 16px) */
  @media screen and (min-width: 60em) {
      th.ui-p-5,
      td.ui-p-5 {
          display: table-cell;
      }
  }
  
  /* Show priority 6 at 1,120px (70em x 16px) */
  @media screen and (min-width: 70em) {
      th.ui-p-6,
      td.ui-p-6 {
          display: table-cell;
      }
  }
`],
  providers: [MessageService]
})
export class DashboardPersediaanComponent implements OnInit, AfterViewInit {

  public now: Date = new Date();
  colors = Highcharts.getOptions().colors;
  loadingInfoStok: boolean;
  loadingPenerimaan: boolean;
  columnStok: any[];
  columnStokDetail: any[];
  columnPenerimaan: any[];
  columnPengeluaran: any[];
  resultDataStok: any;
  dataSourceStok: any;
  dataSourceDetailStok: any;
  showDetailStok: boolean = false;
  totalAll: any;
  dataSourcePenerimaan: any;
  dataSourcePengeluaran: any;
  loadingPengeluaran: any;
  totalPenerimaan: any;
  totalPengeluaran: any;
  totalPengeluaranQty: any;
  totalPengeluaranHarga: any;
  chart10PemakaianObat: any;
  dataSourcePemakaianObat: any
  totalPemakainObat: any = 0
  constructor(public httpservice: AppService, private messageService: MessageService) { }

  ngOnInit() {

    this.columnStok = [
      { field: 'namaproduk', header: 'Nama Produk' },
      { field: 'satuanstandar', header: 'Satuan' },
      { field: 'qtyproduk', header: 'Stok Tersedia' }
    ];

    this.columnStokDetail = [
      { field: 'namaruangan', header: 'Ruangan' },
      { field: 'namaproduk', header: 'Nama Barang' },
      { field: 'satuanstandar', header: 'Satuan' },
      { field: 'qtyproduk', header: 'Stok' }
    ];

    this.columnPenerimaan = [
      { field: 'nofaktur', header: 'No Dokumen' },
      { field: 'nosppb', header: 'No PO' },
      { field: 'tglstruk', header: 'Tanggal' },
      { field: 'namarekanan', header: 'Supplier' },
      { field: 'jmlitem', header: 'Jumlah Item' },
      { field: 'totalharusdibayar', header: 'Total Tagihan' }
    ];

    this.columnPengeluaran = [
      { field: 'tglkirim', header: 'Tanggal' },
      { field: 'nokirim', header: 'No Pengeluaran' },
      { field: 'ruanganasal', header: 'Ruang Asal' },
      { field: 'ruangantujuan', header: 'Ruang Tujuan' },
      // { field: 'kodebarang', header: 'Kd Barang' },
      // { field: 'kdsirs', header: 'Kd Sirs' },
      { field: 'namaproduk', header: 'Nama Barang' },
      { field: 'satuanstandar', header: 'Satuan' },
      { field: 'jenis', header: 'Jenis' },
      { field: 'qtyproduk', header: 'Qty' },
      { field: 'hargasatuan', header: 'Harga Satuan' },
      { field: 'total', header: 'Total' }
    ];
    this.getPemakaianObat()
    this.getInfoStok();
    this.getPenerimaanBarang();
    this.getPengeluaranBarang();
    this.getTrendPemakaianObat()
  }
  getPemakaianObat() {
    var tglAwal = moment(new Date()).format('YYYY-MM-DD 00:00')
    var tglakhir = moment(new Date()).format('YYYY-MM-DD 23:59')
    this.httpservice.getTransaksi('eis/get-laporan-obat').subscribe(data => {

      var datas: any = data
      this.totalPemakainObat = 0
      for (let i = 0; i < datas.data.length; i++) {
        const element = datas.data[i];

        this.totalPemakainObat = this.totalPemakainObat + parseFloat(element.total)
        element.total = 'Rp. ' + Highcharts.numberFormat(element.total, 0, '.', ',');
      }
      this.totalPemakainObat = 'Rp. ' + Highcharts.numberFormat(this.totalPemakainObat, 0, '.', ',');
      this.dataSourcePemakaianObat = datas.data
    })
  }
  formatRupiah(value, currency) {
    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  formatRpHighChart(value) {
    return Highcharts.numberFormat(value, 0, '.', ',')
  }
  selectedGridStok(row) {
    let data = this.resultDataStok.data
    let datas = []
    this.totalAll = 0;
    // this.jumlahna = 0
    for (let i in data) {
      if (row.namaproduk == data[i].namaproduk) {
        data[i].qtyproduk = parseFloat(data[i].qtyproduk)
        // this.jumlahna = this.jumlahna + parseFloat(data[i].jumlah)
        // data[i].total = parseFloat(data[i].jumlah) * parseFloat(data[i].tarif)
        // this.totalTotal = this.totalTotal + parseFloat(data[i].total)
        datas.push(data[i])
      }
    }

    // for (let a in datas) {
    //   datas[a].tariff = 'Rp.' + Highcharts.numberFormat(datas[a].tarif, 0, '.', ',')
    //   datas[a].totall = 'Rp.' + Highcharts.numberFormat(datas[a].total, 0, '.', ',')
    // }
    // this.totalAll = 'Rp.' + Highcharts.numberFormat(this.totalTotal, 0, '.', ',')
    // console.log(datas)
    // for (let i in datas) {
    //   datas[i].qtyproduk = Highcharts.numberFormat(datas[i].qtyproduk, 0, '.', ',')
    // }
    this.dataSourceDetailStok = datas
    this.showDetailStok = true
    this.messageService.add({ severity: 'info', summary: 'Selected :', detail: row.dokter });
  }
  getInfoStok() {
    this.loadingInfoStok = true;
    this.httpservice.getTransaksi('eis/get-info-stok').subscribe(data => {
      this.resultDataStok = data
      let array = this.resultDataStok.data
      let sama = false
      let groupingArr = []
      for (let i = 0; i < array.length; i++) {
        sama = false
        for (let x = 0; x < groupingArr.length; x++) {
          if (array[i].namaproduk == groupingArr[x].namaproduk) {
            sama = true;
            groupingArr[x].qtyproduk = parseFloat(array[i].qtyproduk) + parseFloat(groupingArr[x].qtyproduk)
          }
        }
        if (sama == false) {
          let result = {
            namaproduk: array[i].namaproduk,
            satuanstandar: array[i].satuanstandar,
            qtyproduk: parseFloat(array[i].qtyproduk),
          }
          groupingArr.push(result)
        }
      }
      console.log(groupingArr)
      for (let i in groupingArr) {
        groupingArr[i].qtyproduk = Highcharts.numberFormat(groupingArr[i].qtyproduk, 0, '.', ',')
      }
      this.loadingInfoStok = false;
      this.dataSourceStok = groupingArr
    })
  }
  formatDate(value) {
    if (value == null || value == undefined) {
      return null
    } else {
      let hari = ("0" + value.getDate()).slice(-2)
      let bulan = ("0" + (value.getMonth() + 1)).slice(-2)
      let tahun = value.getFullYear()
      let format = tahun + '-' + bulan + '-' + hari
      return format
    }
  }
  formatDateIndo(value) {
    if (value == null || value == undefined) {
      return null
    } else {
      let hari = ("0" + value.getDate()).slice(-2)
      let bulan = ("0" + (value.getMonth() + 1)).slice(-2)
      let tahun = value.getFullYear()
      let format = hari + '-' + bulan + '-' + tahun
      return format
    }
  }
  getPenerimaanBarang() {
    var tglAwal = this.formatDate(new Date()) + ' 00:00'
    var tglAkhir = this.formatDate(new Date()) + ' 23:59'
    this.loadingPenerimaan = true;
    this.httpservice.getTransaksi('eis/get-daftar-penerimaan?tglAwal=' +
      tglAwal + '&tglAkhir=' + tglAkhir).subscribe(data => {
        var result: any;
        result = data
        this.totalPenerimaan = 0
        for (let i in result.daftar) {
          this.totalPenerimaan = parseFloat(result.daftar[i].totalharusdibayar) + this.totalPenerimaan
          result.daftar[i].tglstruk = this.formatDateIndo(new Date(result.daftar[i].tglstruk))
          result.daftar[i].totalharusdibayar = 'Rp. ' + Highcharts.numberFormat(parseFloat(result.daftar[i].totalharusdibayar), 0, '.', ',')
          for (let z in result.daftar[i].details) {
            result.daftar[i].details[z].tglkadaluarsa = this.formatDateIndo(new Date(result.daftar[i].details[z].tglkadaluarsa))
            result.daftar[i].details[z].hargasatuan = 'Rp. ' + Highcharts.numberFormat(parseFloat(result.daftar[i].details[z].hargasatuan), 0, '.', ',')
            result.daftar[i].details[z].hargadiscount = 'Rp. ' + Highcharts.numberFormat(parseFloat(result.daftar[i].details[z].hargadiscount), 0, '.', ',')
            result.daftar[i].details[z].hargappn = 'Rp. ' + Highcharts.numberFormat(parseFloat(result.daftar[i].details[z].hargappn), 0, '.', ',')
            result.daftar[i].details[z].total = 'Rp. ' + Highcharts.numberFormat(parseFloat(result.daftar[i].details[z].total), 0, '.', ',')
          }
        }
        this.loadingPenerimaan = false;
        this.totalPenerimaan = 'Rp. ' + Highcharts.numberFormat(parseFloat(this.totalPenerimaan), 0, '.', ',')
        this.dataSourcePenerimaan = result.daftar
      })
  }
  getPengeluaranBarang() {
    var tglAwal = this.formatDate(new Date()) + ' 00:00'
    var tglAkhir = this.formatDate(new Date()) + ' 23:59'
    this.loadingPengeluaran = true;
    this.httpservice.getTransaksi('eis/get-daftar-distribusi-barang-perunit?tglAwal='
      + tglAwal + '&tglAkhir=' + tglAkhir).subscribe(data => {
        var result: any;
        result = data
        this.totalPengeluaran = 0
        this.totalPengeluaranQty = 0
        this.totalPengeluaranHarga = 0
        for (let i in result.data) {
          this.totalPengeluaran = this.totalPengeluaran + parseFloat(result.data[i].total)
          this.totalPengeluaranHarga = this.totalPengeluaranHarga + parseFloat(result.data[i].hargasatuan)
          this.totalPengeluaranQty = this.totalPengeluaranQty + parseFloat(result.data[i].qtyproduk)
          if (result.data[i].jenispermintaanfk == 1)
            result.data[i].jenis = 'Amprahan'
          else
            result.data[i].jenis = 'Transfer'
          result.data[i].tglkirim = this.formatDateIndo(new Date(result.data[i].tglkirim))
          result.data[i].hargasatuan = 'Rp. ' + Highcharts.numberFormat(parseFloat(result.data[i].hargasatuan), 0, '.', ',')
          result.data[i].total = 'Rp. ' + Highcharts.numberFormat(parseFloat(result.data[i].total), 0, '.', ',')
        }
        this.totalPengeluaranHarga = 'Rp. ' + Highcharts.numberFormat(parseFloat(this.totalPengeluaranHarga), 0, '.', ',')
        this.totalPengeluaran = 'Rp. ' + Highcharts.numberFormat(parseFloat(this.totalPengeluaran), 0, '.', ',')
        this.loadingPengeluaran = false;
        this.dataSourcePengeluaran = result.data
      })
  }
  getTrendPemakaianObat() {
    this.httpservice.getTransaksi('eis/get-pemakaianobat').subscribe(data => {
      var result: any = data;
      let series = [];
      let categories = [];
      let loopIndex = 0;
      for (let i in result.chart) {
        categories.push(result.chart[i].namaproduk);
        let dataz2 = [];
        dataz2.push({
          y: parseFloat(result.chart[i].jumlah),
          color: this.colors[i]
        });
        if (loopIndex < 10)
          series.push({
            name: result.chart[i].namaproduk,
            data: dataz2
          });
        loopIndex++;

      }
      this.chart10PemakaianObat = new Chart({
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
            text: 'Pemakaian Obat'
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
                return Highcharts.numberFormat(this.y, 0, '.', ',');
              }
            },
            showInLegend: true
          }
        },
        tooltip: {
          formatter: function () {
            let point = this.point,
              s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',')
            return s;
          }
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
  }
  /**
        * @method ngAfterViewInit
        */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}

