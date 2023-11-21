import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service'; 
import { SocketService } from '../service/socket.service'; 
import { Howl, Howler } from 'howler';
import * as moment from 'moment';
@Component({
    selector: 'app-antrianapotik',
    templateUrl: './antrianapotik.component.html',
    styleUrls: ['./antrianapotik.component.scss']
})

export class AntrianApotikComponent implements OnInit {
  focus: any;
  focus1: any;
  test : Date = new Date();
  dataracikan: any = {};
  datanonracikan: any = {};
  soracewe={};
  dipanggilN: boolean = false;
  dipanggilR: boolean = false;
  sound: any = null;
  item: any=[] ;
  listAntri:any;
  audio = new Audio;
constructor(
  private http: HttpClient,
  private apiService: ApiService,
  private socket: SocketService){ 
  this.socket.on('tampilkan-antrian-apotik', (data: any) => {  
    let result = JSON.parse(data) 
    debugger;
    if(result.jenis=='Racikan'){
      this.item.r = result.nama;
    }else{
      this.item.nr = result.nama;
    }
     
    this.playAudio('Panggilan atas nama, '+ result.nama.toLowerCase() +', obat anda sudah selesai silahkan di ambil ' ); 
     this.getdata(); 
  });
  this.socket.on('reload-antriancoy', (data: any) => {   
     this.getdata(); 
  });


  
}
public data: string[] = ['Cricket', 'Football', 'Rugby', 'Snooker', 'Tennis'];
  ngOnInit():void { 
    
    this.item.r ='-';
    this.item.nr ='-';
    this.item.tglAwal = new Date(moment(new Date()).format('YYYY-MM-DD 00:00'));
    this.item.tglAkhir = new Date(moment(new Date()).format('YYYY-MM-DD 23:59'));
    this.getdata();     
    // this.panggiltes();           
  }
  public getdata(){  
    var tglAwal = moment(this.item.tglAwal).format('YYYY-MM-DD');
    var tglAkhir = moment(this.item.tglAkhir).format('YYYY-MM-DD');
    this.apiService.get('farmasi/get-daftar-pasien-farmasi-antrian-belum?tglAwal='+tglAwal+'&tglAkhir='+ tglAkhir +'&jenis=Non%20Racikan').subscribe(e => {
      this.datanonracikan = e 
      for (let i = 0; i < this.datanonracikan.length; i++) {
          const element = this.datanonracikan[i];
          if(this.datanonracikan[i].statuspanggil == 1){
            element.status = 'Belum Dipanggil'
          }else{
            element.status = 'Sudah Dipanggil'
          }
        }
    
    });
    this.apiService.get('farmasi/get-daftar-pasien-farmasi-antrian-belum?tglAwal='+tglAwal+'&tglAkhir='+ tglAkhir +'&jenis=Racikan').subscribe(e => {
      this.dataracikan = e 
      for (let i = 0; i < this.dataracikan.length; i++) {
          const element = this.dataracikan[i];
          if(this.dataracikan[i].statuspanggil == 1){
            element.status = 'Belum Dipanggil'
          }else{
            element.status = 'Sudah Dipanggil'
          }
        }
    });
    debugger;
  }  
  public panggiltes(){
    this.sound = new Howl({
      src: ['assets/sound/in.wav'],
      autoplay: true
    });
  }
  public panggil(){
  debugger;
   let namaloket = ''
  let jenis = 'C'
  let angka: any 
  let loket: any
  let namaSoundAngka: any
  this.listAntri = 234;
  loket = 2;
  this.item.antriTerakhir = "b-133";
  this.sound = new Howl({
            src: ['assets/sound/in.wav'],
            autoplay: true,
            onend: () => {
              this.sound = new Howl({
                src: ['assets/sound/nomorantrian.wav'],
                autoplay: true,
                onend: () => {
                  this.sound = new Howl({
                    src: ['assets/sound/' + jenis + '.mp3'],
                    autoplay: true,
                    onend: () => {
                      angka = parseInt(this.item.antriTerakhir.split('-')[1])
                      namaSoundAngka = ''
                      var cariNol = this.item.antriTerakhir.includes("00");
                      if (cariNol == true) {
                        namaSoundAngka = 'nolnol'
                      } else {
                        var cariNol2 = this.item.antriTerakhir.includes("0");
                        if (cariNol2 == true) {
                          namaSoundAngka = 'nol'
                        }
                      }




                      namaloket = '1'  

                      let belas = false
                      let puluh = false
                      let ratus = false

                      if (angka > 199 && angka < 1000) ratus = true
                      if (angka > 99 && angka < 200) {
                        namaSoundAngka = 'seratus'
                        angka = angka - 100
                      }
                      if (angka > 19 && angka < 100) puluh = true

                      if (angka < 20 && angka > 11) {
                        angka = angka - 10
                        belas = true
                      }

                      if (angka.toString().length == 2 && angka == 10) {
                        namaSoundAngka += ' sepuluh'
                        namaSoundAngka = namaSoundAngka.trim()
                        namaSoundAngka = namaSoundAngka.split(' ')
                        if (namaSoundAngka.length == 1) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });
                        }
                        if (namaSoundAngka.length == 2) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                                autoplay: true,
                                onend: () => {
                                  this.goLoket(loket)
                                }
                              });

                            }
                          });
                        }
                        if (namaSoundAngka.length == 3) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                                autoplay: true,
                                onend: () => {
                                  this.sound = new Howl({
                                    src: ['assets/sound/' + namaSoundAngka[2] + '.wav'],
                                    autoplay: true,
                                    onend: () => {
                                      this.goLoket(loket)
                                    }
                                  });
                                }
                              });

                            }
                          });
                        }


                        return
                      }
                      if (angka.toString().length == 2 && angka == 11) {
                        namaSoundAngka += ' sebelas'
                        namaSoundAngka = namaSoundAngka.trim()
                        namaSoundAngka = namaSoundAngka.split(' ')
                        if (namaSoundAngka.length == 1) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });
                        }
                        if (namaSoundAngka.length == 2) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                                autoplay: true,
                                onend: () => {
                                  this.goLoket(loket)
                                }
                              });

                            }
                          });
                        }
                        if (namaSoundAngka.length == 3) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                                autoplay: true,
                                onend: () => {
                                  this.sound = new Howl({
                                    src: ['assets/sound/' + namaSoundAngka[2] + '.wav'],
                                    autoplay: true,
                                    onend: () => {
                                      this.goLoket(loket)
                                    }
                                  });
                                }
                              });

                            }
                          });
                        }


                        return
                      }
                      if (angka.toString().length == 3 && angka == 100) {
                        namaSoundAngka = 'seratus'
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka + '.wav'],
                          autoplay: true,
                          onend: () => {
                            this.goLoket(loket)
                          }
                        });
                        return
                      }


                      if (angka.toString().length == 4 && angka == 1000) {
                        namaSoundAngka = 'seribu'
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka + '.wav'],
                          autoplay: true,
                          onend: () => {
                            this.goLoket(loket)
                          }
                        });
                        return
                      }

                      for (let i = 0; i < angka.toString().length; i++) {

                        //if (ratus == false && angka > 200 && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) == 10) {
                        if (ratus == false && angka > 200 && (parseInt(angka.toString().substr(1, 2))) == 10) {
                        
                        namaSoundAngka += 'sepuluh'
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });
                        }

                        //if (ratus == false && angka > 200 && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) == 11) {
                          if (ratus == false && angka > 200 && (parseInt(angka.toString().substr(1, 2))) == 11) {
                        
                          namaSoundAngka += 'sebelas'
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka + '.wav'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });
 
                        }
                        if (ratus == false && angka > 200) {
                          //if ((parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) > 19 && puluh == false) {
                            if ((parseInt(angka.toString().substr(1, 2))) > 19 && puluh == false) {
                          
                            puluh = true
                          } else {
                            puluh = false
                          }
                        }
                        //if (ratus == false && angka > 200
                        //  && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) < 20
                        //  && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) > 11) {
                        if (ratus == false && angka > 200
                              && (parseInt(angka.toString().substr(1, 2))) < 20
                              && (parseInt(angka.toString().substr(1, 2))) > 11) {
                                
                            switch (angka) {
                            case 12:
                              namaSoundAngka += ' 2'
                              namaSoundAngka += ' belas'
                              break;
                            case 13:
                              namaSoundAngka += ' 3'
                              namaSoundAngka += ' belas'
                              break;
                            case 14:
                              namaSoundAngka += ' 4'
                              namaSoundAngka += ' belas'
                              break;
                            case 15:
                              namaSoundAngka += ' 5'
                              namaSoundAngka += ' belas'
                              break;
                            case 16:
                              namaSoundAngka += ' 6'
                              namaSoundAngka += ' belas'
                              break;
                            case 17:
                              namaSoundAngka += ' 7'
                              namaSoundAngka += ' belas'
                              break;
                            case 18:
                              namaSoundAngka += ' 8'
                              namaSoundAngka += ' belas'
                              break;
                            case 19:
                              namaSoundAngka += ' 9'
                              namaSoundAngka += ' belas'
                              break;
                            default:
                          }
                        }
                        //switch ((parseInt(angka.toString().substr(i, 1)) == NaN ? 0 : parseInt(angka.toString().substr(i, 1)))) {
                          switch ((parseInt(angka.toString().substr(i, 1)))) {
                            
                          case 1:
                            namaSoundAngka += ' 1'
                            break;
                          case 2:
                            namaSoundAngka += ' 2'
                            break;
                          case 3:
                            namaSoundAngka += ' 3'
                            break;
                          case 4:
                            namaSoundAngka += ' 4'
                            break;
                          case 5:
                            namaSoundAngka += ' 5'
                            break;
                          case 6:
                            namaSoundAngka += ' 6'
                            break;
                          case 7:
                            namaSoundAngka += ' 7'
                            break;
                          case 8:
                            namaSoundAngka += ' 8'
                            break;
                          case 9:
                            namaSoundAngka += ' 9'
                            break;
                          default:
                        }

                        if (belas == true) { namaSoundAngka += ' belas' }
                        if (puluh == true) { namaSoundAngka += ' puluh' }
                        if (angka > 19 && angka < 100) { puluh = false }
                        if (ratus == true) {
                          namaSoundAngka += ' ratus'
                          ratus = false
                        }
                      }
                      namaSoundAngka = namaSoundAngka.trim()
                      namaSoundAngka = namaSoundAngka.split(' ')
                      if (namaSoundAngka.length == 1) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                          autoplay: true,
                          onend: () => {
                            this.goLoket(loket)
                          }
                        });
                      }
                      if (namaSoundAngka.length == 2) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                              autoplay: true,
                              onend: () => {
                                this.goLoket(loket)
                              }
                            });

                          }
                        });
                      }
                      if (namaSoundAngka.length == 3) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                              autoplay: true,
                              onend: () => {
                                this.sound = new Howl({
                                  src: ['assets/sound/' + namaSoundAngka[2] + '.wav'],
                                  autoplay: true,
                                  onend: () => {
                                    this.goLoket(loket)
                                  }
                                });
                              }
                            });

                          }
                        });
                      }
                      if (namaSoundAngka.length == 4) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                              autoplay: true,
                              onend: () => {
                                this.sound = new Howl({
                                  src: ['assets/sound/' + namaSoundAngka[2] + '.wav'],
                                  autoplay: true,
                                  onend: () => {
                                    this.sound = new Howl({
                                      src: ['assets/sound/' + namaSoundAngka[3] + '.wav'],
                                      autoplay: true,
                                      onend: () => {
                                        this.goLoket(loket)
                                      }
                                    });
                                  }
                                });
                              }
                            });

                          }
                        });
                      }
                      if (namaSoundAngka.length == 5) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.wav'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.wav'],
                              autoplay: true,
                              onend: () => {
                                this.sound = new Howl({
                                  src: ['assets/sound/' + namaSoundAngka[2] + '.wav'],
                                  autoplay: true,
                                  onend: () => {
                                    this.sound = new Howl({
                                      src: ['assets/sound/' + namaSoundAngka[3] + '.wav'],
                                      autoplay: true,
                                      onend: () => {
                                        this.sound = new Howl({
                                          src: ['assets/sound/' + namaSoundAngka[4] + '.wav'],
                                          autoplay: true,
                                          onend: () => {
                                            this.goLoket(loket)
                                          }
                                        });
                                      }
                                    });
                                  }
                                });
                              }
                            });

                          }
                        });
                      }

                    }
                  });
                }
              });
            }
          });
}
 goLoket(loket) {
    this.sound = new Howl({
      src: ['assets/sound/loket.wav'],
      autoplay: true,
      onend: () => {
        this.sound = new Howl({
          src: ['assets/sound/' + loket + '.wav'],
          autoplay: true,
          onend: () => {
            // this.dipanggil = false
          }
        });
      }
    });
  }
  
playAudio(nomor) {

    // setTimeout(() => {
//  this.sound = new Howl({
//       src: ['assets/sound/in.wav'],
//       autoplay: true
//     });
      var synthesis = window.speechSynthesis;
      // Get the first `en` language voice in the list
      var voice = synthesis.getVoices().filter(function (voice) {
        return voice.lang === 'id-ID';
      })[1];
      var x = window.speechSynthesis.getVoices()
      for (let i = 0; i < x.length; i++) {
        const element = x[i];
        if(
          element.voiceURI == "Google Bahasa Indonesia"
        ){
          voice = element;
        }        
      }
      // var voices = this.getVoices();
      // Create an utterance object
      var utterance = new SpeechSynthesisUtterance(nomor);
      // Set utterance properties 
      utterance.voice = voice;
      utterance.lang = 'id-ID';
      // utterance.text = document.querySelector("textarea").value;
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 2;
      // Speak the utterance
      synthesis.speak(utterance);
      this.audio.pause();
    // }, (15000)); //4 detik
    

  }
}
