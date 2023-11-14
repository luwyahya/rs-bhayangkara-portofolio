import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service'; 
import { SocketService } from '../service/socket.service'; 
import { Howl, Howler } from 'howler';  
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";
import * as moment from 'moment';
@Component({
    selector: 'app-pemanggilanapotik',
    templateUrl: './pemanggilanapotik.component.html',
    styleUrls: ['./pemanggilanapotik.component.scss']
})

export class PemanggilanApotikComponent implements OnInit {
  focus: any;
  focus1: any;
  test : Date = new Date();
  dataracikan: any = {};
  dipanggilN: boolean = false;
  dipanggilR: boolean = false;
  sound: any = null;
  item: any=[] ;
  listAntri:any;
listData: any[];
dtoption:DataTables.Settings={};
 
  datanonracikan: any = {};
constructor(
  private http: HttpClient,
  private apiService: ApiService,
  private socket: SocketService){ 
    
}
public exampleData: Array<Select2OptionData>;
  public options: Options;
  public options2: Options;

public data: string[] = ['Cricket', 'Football', 'Rugby', 'Snooker', 'Tennis'];
  ngOnInit():void {
    this.dtoption={
      pagingType:'full_number',
      scrollX: true,
    scrollY: 200,
    }
    this.exampleData = [
      {
        id: "opt1",
        text: "Options 1"
      },
      {
        id: "opt2",
        text: "Options 2"
      },
      {
        id: "opt3",
        text: "Options 3"
      },
      {
        id: "opt4",
        text: "Options 4"
      }
    ];

    this.options = {
      theme: "classic",
      width: "300"
    };
    this.socket.emit('panggil-antrian', { no:222 });
    this.getdata();
    // this.panggil();     
             
  }
  
  public getdata(){
    var tglAwal = moment(this.item.tglAwal).format('YYYY-MM-DD');
    var tglAkhir = moment(this.item.tglAkhir).format('YYYY-MM-DD');
    this.apiService.get('farmasi/get-daftar-pasien-farmasi-antrian?tglAwal='+tglAwal+'&tglAkhir='+ tglAkhir +'&jenis=Non%20Racikan').subscribe(e => {
      this.datanonracikan = e 
      for (let i = 0; i < this.datanonracikan.length; i++) {
          const element = this.datanonracikan[i];
          if(this.datanonracikan[i].statuspanggil = 1){
            element.status = 'Belum Dipanggil'
          }
        }
    
    });
    this.apiService.get('farmasi/get-daftar-pasien-farmasi-antrian?tglAwal='+tglAwal+'&tglAkhir='+ tglAkhir +'&jenis=Racikan').subscribe(e => {
      this.dataracikan = e 
      for (let i = 0; i < this.dataracikan.length; i++) {
          const element = this.dataracikan[i];
          if(this.dataracikan[i].statuspanggil = 1){
            element.status = 'Belum Dipanggil'
          }
        }
    });
  }  
 
  public panggiltes(){
  this.sound = new Howl({
            src: ['assets/sound/in.wav'],
            autoplay: true});
  }
   panggil(x,jenis){
    console.log(x)
    var arrayS: any = {};
    arrayS = {
      no: x.noantrian,
      tes: x,
      jenis: jenis
    };
    this.socket.emit('panggil-antrian',  arrayS );
   }

}
