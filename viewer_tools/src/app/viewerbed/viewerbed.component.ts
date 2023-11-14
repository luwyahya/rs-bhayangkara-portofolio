import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service'; 
import { SocketService } from '../service/socket.service'; 
import { Howl, Howler } from 'howler';  
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";
import * as moment from 'moment';
@Component({
    selector: 'app-viewerbed',
    templateUrl: './viewerbed.component.html',
    styleUrls: ['./viewerbed.component.scss']
})

export class ViewerBedComponent implements OnInit {
  focus: any;
  focus1: any;
  test : Date = new Date();
  kasurupan: any = {};  
  kasurupanrekap: any = {};
  dipanggilN: boolean = false;
  dipanggilR: boolean = false;
  sound: any = null;
  item: any=[] ;
  listAntri:any;
  tablebed:any;
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
   setInterval(this.autoScroll,100)
    // this.socket.emit('panggil-antrian', { no:222 });
    this.getdata();
    // this.panggil();     
             
  }
   autoScroll(){
     var top = Math.ceil(document.getElementById("tablebed").scrollTop);
    var hei = document.getElementById("tablebed").scrollHeight;
    var ofh = document.getElementById("tablebed").offsetHeight;
    if (top < hei - ofh) {
      -1;
      document.getElementById("tablebed").scrollTop =
        document.getElementById("tablebed").scrollTop + 1;
    } else {
      document.getElementById("tablebed").scrollTop = 0;
    }
  }
  public getdata(){
    debugger
    //this.apiService.get('rawatinap/get-daftar-viewer-bed').subscribe(e => {
    this.apiService.get('rawatinap/get-daftar-viewer-bed-new').subscribe(e => {
      var data = e.data;
	
      var no = 0;
      for (var i = 0; i < data.length; i++) {
        no = no + 1;
        data[i].no = no;
      }
      var arrRuang = [];
      var arrKamar = [];
      var arrTT = [];
      var arrayS = {};
      var arrayK = {};
      var arrayM = {};
      var stt=true;
      for (var i = 0; i < data.length; i++) {
        // debugger;
        arrayM={idtempattidur:data[i].idtempattidur,
            idruangan:data[i].idruangan,
            namaruangan:data[i].namaruangan,
            idkamar:data[i].idkamar,
            namakamar:data[i].namakamar,
            reportdisplay:data[i].reportdisplay,
            nomorbed:data[i].nomorbed,
            idstatusbed:data[i].idstatusbed,
            statusbed:data[i].statusbed,
            kondisibed:data[i].kondisibed};
        arrTT.push(arrayM)
      }

      for (var i = 0; i < data.length; i++) {
        stt=true;
        for (var j = 0; j < arrKamar.length; j++) {
          if (data[i].idkamar == arrKamar[j].idkamar) {
            arrKamar[j].qtyBed = arrKamar[j].qtyBed +1;
            if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
              arrKamar[j].isi = arrKamar[j].isi +1;
              arrKamar[j].sp = arrKamar[j].sp + 1;
            }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
              arrKamar[j].isi = arrKamar[j].isi +1;
              arrKamar[j].rs = arrKamar[j].rs + 1;
            }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
              arrKamar[j].isi = arrKamar[j].isi +1;
              arrKamar[j].db = arrKamar[j].db + 1 ;
            }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
              arrKamar[j].kosong = arrKamar[j].kosong +1;
              arrKamar[j].sp = arrKamar[j].sp + 1;
            }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
              arrKamar[j].kosong = arrKamar[j].kosong +1;
              arrKamar[j].rs = arrKamar[j].rs + 1;
            }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
              // arrKamar[j].kosong = arrKamar[j].kosong +1;
              arrKamar[j].db = arrKamar[j].db + 1 ;
            }else{
              arrKamar[j].kosong = arrKamar[j].kosong +1;
            }
            stt=false;
          }
        }
        // debugger;
        if (stt == true) {
          var arrTTT = [];
          for (var j = 0; j < arrTT.length; j++) {
            if (arrTT[j].idkamar == data[i].idkamar) {
              arrTTT.push(arrTT[j]);
            }
          }
          
          
          if (data[i].idstatusbed == 1 ) {
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                isi:1,
                kosong:0,
                
                tempattidur:arrTTT};
          }else{
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                isi:0,
                kosong:1,
                
                tempattidur:arrTTT};
          }
          if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                isi:1,
                kosong:0,
                sp:1,
                    rs:0,
                db:0,
                tempattidur:arrTTT};
          }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                // isi:1,
                // kosong:0,
                sp:0,
                    rs:1,
                db:0,
                tempattidur:arrTTT};
          }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                // isi:1,
                // kosong:0,
                sp:0,
                    rs:0,
                db:1,
                tempattidur:arrTTT};
          }
          else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                isi:0,
                kosong:1,
                sp:1,
                    rs:0,
                db:0,
                tempattidur:arrTTT};
          }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                // isi:0,
                // kosong:1,
                sp:0,
                    rs:1,
                db:0,
                tempattidur:arrTTT};
          }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
            arrayK={idruangan:data[i].idruangan,
                idkamar:data[i].idkamar,
                namakamar:data[i].namakamar,
                idkelas:data[i].idkelas,
                namakelas:data[i].namakelas,
                qtyBed:1,
                isi:0,
                // kosong:1,
                sp:0,
                    rs:0,
                db:1,
                tempattidur:arrTTT};
          }
          arrKamar.push(arrayK);
        }
        
      }
        

      // debugger;
      for (var i = 0; i < data.length; i++) {
        stt=true;
        // debugger
        for (var j = 0; j < arrRuang.length; j++) {
          if (data[i].idruangan == arrRuang[j].idruangan) {
            arrRuang[j].qtyBed = arrRuang[j].qtyBed +1;
            if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
              arrRuang[j].isi = arrRuang[j].isi +1;
              arrRuang[j].sp = arrRuang[j].sp +1;
            }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
              arrRuang[j].isi = arrRuang[j].isi +1;
              arrRuang[j].rs = arrRuang[j].rs  +1;
            }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
              arrRuang[j].isi = arrRuang[j].isi +1;
              arrRuang[j].db = arrRuang[j].db  +1 ;
            }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
              arrRuang[j].kosong = arrRuang[j].kosong +1;
              arrRuang[j].sp = arrRuang[j].sp +1;
            }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
              // arrRuang[j].kosong = arrRuang[j].kosong +1;
              arrRuang[j].rs = arrRuang[j].rs  +1;
            }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
              // arrRuang[j].kosong = arrRuang[j].kosong +1;
              arrRuang[j].db = arrRuang[j].db  +1 ;
            }else
            {
              // arrRuang[j].kosong = arrRuang[j].kosong +1;
              // arrRuang[j].db = arrRuang[j].db  +1 ;
            }
            stt=false;
          }
        }
        if (stt == true) {
          // debugger;
          var arrTTT = [];
          for (var j = 0; j < arrKamar.length; j++) {
            if (arrKamar[j].idruangan == data[i].idruangan) {
              arrTTT.push(arrKamar[j]);
            }
          }

          if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 5) {
            arrayS={idruangan:data[i].idruangan,
                namaruangan:data[i].namaruangan,
                qtyBed:1,
                isilp:1,
                kosong:0,
                sp:1,
                    rs:0,
                db:0,
                kamar:arrTTT};
          }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 6) {
            arrayS={idruangan:data[i].idruangan,
                namaruangan:data[i].namaruangan,
                qtyBed:1,
                isi:0,
                kosong:0,
                sp:0,
                    rs:1,
                db:0,
                kamar:arrTTT};
          }else if (data[i].idstatusbed == 1 && data[i].objectstatusbedfktriger == 7) {
            arrayS={idruangan:data[i].idruangan,
                namaruangan:data[i].namaruangan,
                qtyBed:1,
                isi:0,
                kosong:0,
                sp:0,
                    rs:0,
                db:1,
                kamar:arrTTT};
          } else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
            arrayS={idruangan:data[i].idruangan,
                namaruangan:data[i].namaruangan,
                qtyBed:1,
                isi:0,
                kosong:1,
                sp:1,
                    rs:0,
                db:0,
                kamar:arrTTT};
            }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
              arrayS={idruangan:data[i].idruangan,
                  namaruangan:data[i].namaruangan,
                  qtyBed:1,
                  isi:0,
                  kosong:0,
                  sp:0,
                  rs:1,
                  db:0,
                  kamar:arrTTT};
              }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
                arrayS={idruangan:data[i].idruangan,
                    namaruangan:data[i].namaruangan,
                    qtyBed:1,
                    isi:0,
                    kosong:0,
                    sp:0,
                    rs:0,
                    db:1,
                    kamar:arrTTT}
                }
          else{
          // if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 5) {
          // 	arrayS={idruangan:data[i].idruangan,
          // 			namaruangan:data[i].namaruangan,
          // 			qtyBed:0,
          // 			isi:0,
          // 			kosong:1,
          // 			sp:1,
          // 	        rs:0,
          // 			db:0,
          // 			kamar:arrTTT};
          // }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 6) {
          // 	arrayS={idruangan:data[i].idruangan,
          // 			namaruangan:data[i].namaruangan,
          // 			qtyBed:0,
          // 			isi:0,
          // 			kosong:1,
          // 			sp:0,
          // 	        rs:1,
          // 			db:0,
          // 			kamar:arrTTT};
          // }else if (data[i].idstatusbed == 2 && data[i].objectstatusbedfktriger == 7) {
            arrayS={idruangan:data[i].idruangan,
                namaruangan:data[i].namaruangan,
                qtyBed:1,
                isi:0,
                kosong:0,
                sp:0,
                    rs:0,
                db:0,
                kamar:arrTTT};
          }
          
          arrRuang.push(arrayS);
        }
        
      }

      
      console.log(arrRuang);
      var arrRuangS = {};
      var arrRuangSA = [];
      var tempkamar="";
      
      var namaruangan=""
      var deskkelas=""
      var kapasitas:Number;
      var rusak:Number;
      var dibersihkan:Number;
      var isilp:Number;
      var kosonglp:Number;

      var k=0;
    
      for (var i = arrRuang.length - 1; i >= 0; i--) {
        tempkamar="";
        

        for(var j = arrRuang[i].kamar.length - 1; j>=0; j--) {
          if(tempkamar!=arrRuang[i].kamar[j].namakelas) {
            if(k>0) {
              arrRuangS={
                namaruangan : namaruangan,
                deskkelas : deskkelas,
                kapasitas : Number(kapasitas),
                rusak : Number(rusak),
                dibersihkan : Number(dibersihkan),
                isilp :Number(isilp),
                kosonglp :Number(kosonglp)
              }
              arrRuangSA.push(arrRuangS);
            }
            namaruangan = arrRuang[i].namaruangan,
            deskkelas=arrRuang[i].kamar[j].namakelas
            kapasitas=Number(arrRuang[i].kamar[j].qtyBed)
            rusak=Number(arrRuang[i].kamar[j].rs)
            dibersihkan=Number(arrRuang[i].kamar[j].db)
            isilp=Number(arrRuang[i].kamar[j].isi)
            kosonglp=Number(arrRuang[i].kamar[j].kosong)

            tempkamar=arrRuang[i].kamar[j].namakelas
            
          } else {
            namaruangan = arrRuang[i].namaruangan,
            deskkelas=arrRuang[i].kamar[j].namakelas
            kapasitas=Number(kapasitas) + Number(arrRuang[i].kamar[j].qtyBed)
            rusak= Number(rusak) + Number(arrRuang[i].kamar[j].rs)
            dibersihkan= Number(dibersihkan) + Number(arrRuang[i].kamar[j].db)
            isilp = Number(isilp) + Number(arrRuang[i].kamar[j].isi)
            kosonglp = Number(kosonglp) + Number(arrRuang[i].kamar[j].kosong)
          }

          k++;
        }
      }
      
      arrRuangS={
        namaruangan : namaruangan,
        deskkelas : deskkelas,
        kapasitas : Number(kapasitas),
        rusak : Number(rusak),
        dibersihkan : Number(dibersihkan),
        isilp :Number(isilp),
        kosonglp :Number(kosonglp)
      }
      arrRuangSA.push(arrRuangS);
      console.log(arrRuangSA);

      arrRuangSA.sort((a,b)=> (a.namaruangan.localeCompare(b.namaruangan) || a.deskkelas.localeCompare(b.deskkelas)));

      console.log(arrRuangSA);
      
      var namaruangan=""
      var deskkelas=""
      var kapasitasx:Number;
      var rusakx:Number;
      var dibersihkanx:Number;
      var isilpx:Number;
      var kosonglpx:Number;

      var arrBed = {};
      var arrBedA = [];
      var tempruangan="";
      var tempkelas="";
      var ka=0;
      var intensive=0;
      var kelasi=0;
      var kelasii=0;
      var kelasiii=0;
      var nonkelas=0;
      var vip=0;
      var vvip=0;
      var hcu=0;

      for (var i = 0 ; i<arrRuangSA.length; i++) {

        if(tempruangan!=arrRuangSA[i].namaruangan) {
          
          if(ka>0) {
            arrBed={
              namaruangan : namaruangan,
              deskkelas : deskkelas,
              kapasitas : Number(kapasitasx),
              rusak : Number(rusakx),
              dibersihkan : Number(dibersihkanx),
              isilp :Number(isilpx),
              kosonglp :Number(kosonglpx)
            }
            arrBedA.push(arrBed);

            
            tempkelas=""
            tempruangan=""
          }

          namaruangan = arrRuangSA[i].namaruangan
          deskkelas= arrRuangSA[i].deskkelas
          kapasitasx= Number(arrRuangSA[i].kapasitas)
          rusakx= Number(arrRuangSA[i].rusak)
          dibersihkanx= Number(arrRuangSA[i].dibersihkan)
          isilpx = Number(arrRuangSA[i].isilp)
          kosonglpx = Number(arrRuangSA[i].kosonglp)

          tempkelas=arrRuangSA[i].deskkelas
          tempruangan=arrRuangSA[i].namaruangan

        } else {
          if(tempkelas!=arrRuangSA[i].deskkelas) {
            if(ka>0) {
              arrBed={
                namaruangan : namaruangan,
                deskkelas : deskkelas,
                kapasitas : Number(kapasitasx),
                rusak : Number(rusakx),
                dibersihkan : Number(dibersihkanx),
                isilp :Number(isilpx),
                kosonglp :Number(kosonglpx)
              }
              arrBedA.push(arrBed);

              
              tempkelas=""
              tempruangan=""
            }

            namaruangan = arrRuangSA[i].namaruangan
            deskkelas= arrRuangSA[i].deskkelas
            kapasitasx= Number(arrRuangSA[i].kapasitas)
            rusakx= Number(arrRuangSA[i].rusak)
            dibersihkanx= Number(arrRuangSA[i].dibersihkan)
            isilpx = Number(arrRuangSA[i].isilp)
            kosonglpx = Number(arrRuangSA[i].kosonglp)

            tempkelas=arrRuangSA[i].deskkelas
            tempruangan=arrRuangSA[i].namaruangan

            
          } else {
            
            namaruangan = arrRuangSA[i].namaruangan
            deskkelas = arrRuangSA[i].deskkelas
            kapasitasx = Number(kapasitasx) + Number(arrRuangSA[i].kapasitas)
            rusakx = Number(rusakx) + Number(arrRuangSA[i].rusak)
            dibersihkanx = Number(dibersihkanx) + Number(arrRuangSA[i].dibersihkan)
            isilpx = Number(isilpx) + Number(arrRuangSA[i].isilp)
            kosonglpx = Number(kosonglpx) + Number(arrRuangSA[i].kosonglp)

            

            tempkelas =arrRuangSA[i].deskkelas
            tempruangan=arrRuangSA[i].namaruangan
          }
          
        }
        ka++

        if(arrRuangSA[i].deskkelas=="Intensive") intensive += Number(arrRuangSA[i].kapasitas)
        else if(arrRuangSA[i].deskkelas=="Kelas I") kelasi += Number(arrRuangSA[i].kapasitas)
        else if(arrRuangSA[i].deskkelas=="Kelas II") kelasii += Number(arrRuangSA[i].kapasitas)
        else if(arrRuangSA[i].deskkelas=="Kelas III") kelasiii += Number(arrRuangSA[i].kapasitas)
        else if(arrRuangSA[i].deskkelas=="Non Kelas") nonkelas += Number(arrRuangSA[i].kapasitas)
        else if(arrRuangSA[i].deskkelas=="VIP") vip += Number(arrRuangSA[i].kapasitas)
        else if(arrRuangSA[i].deskkelas=="VVIP") vvip += Number(arrRuangSA[i].kapasitas)
        else if(arrRuangSA[i].deskkelas=="HCU") hcu += Number(arrRuangSA[i].kapasitas)

      }

      arrBed={
        namaruangan : namaruangan,
        deskkelas : deskkelas,
        kapasitas : Number(kapasitasx),
        rusak : Number(rusakx),
        dibersihkan : Number(dibersihkanx),
        isilp :Number(isilpx),
        kosonglp :Number(kosonglpx)
      }
      arrBedA.push(arrBed);

      var arrBeddetail={};
      var arrBedAdetail=[];
      if(intensive>0) {
        arrBeddetail={
          deskkelas:"Intensive",
          total:intensive
        }
        arrBedAdetail.push(arrBeddetail);
      }
      if(kelasi>0) {
        arrBeddetail={
          deskkelas:"Kelas I",
          total:kelasi
        }
        arrBedAdetail.push(arrBeddetail);
      }
      if(kelasii>0) {
        arrBeddetail={
          deskkelas:"Kelas II",
          total:kelasii
        }
        arrBedAdetail.push(arrBeddetail);
      }
      if(kelasiii>0) {
        arrBeddetail={
          deskkelas:"Kelas III",
          total:kelasiii
        }
        arrBedAdetail.push(arrBeddetail);
      }
      if(nonkelas>0) {
        arrBeddetail={
          deskkelas:"Non Kelas",
          total:nonkelas
        }
        arrBedAdetail.push(arrBeddetail);
      }
      if(vip>0) {
        arrBeddetail={
          deskkelas:"VIP",
          total:vip
        }
        arrBedAdetail.push(arrBeddetail);
      }
      if(vvip>0) {
        arrBeddetail={
          deskkelas:"VVIP",
          total:vvip
        }
        arrBedAdetail.push(arrBeddetail);
      }
      if(hcu>0) {
        arrBeddetail={
          deskkelas:"HCU",
          total:hcu
        }
        arrBedAdetail.push(arrBeddetail);
      }

        debugger
        this.kasurupan = arrBedA
        this.kasurupanrekap = arrBedAdetail
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
