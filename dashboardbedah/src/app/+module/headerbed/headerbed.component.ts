import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-headerbed',
  templateUrl: './headerbed.component.html',
  styleUrls: ['./headerbed.component.css']
})
export class HeaderbedComponent implements OnInit {
  public now: Date = new Date();
  tanggal = new Date().toLocaleDateString();
  jumlahTempatTidur: any = 0;
  JumlahIsi: any = 0;
  JumlahKosong: any = 0;
  item: any = {}
  apiTimer: any;
  counter = 10;
  constructor(public appservice: AppService) {

  }

  ngOnInit() {
    this.getData();
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
  }

}
