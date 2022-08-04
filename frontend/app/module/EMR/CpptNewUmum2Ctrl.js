define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CpptNewUmum2Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 514
            var dataLoad = []
             $scope.isCetak = true
            var norecEMR = ''
            var peagawaiLogin = medifirstService.getPegawaiLogin()
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if(cacheNoREC!= undefined){
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                $scope.cc.norec_emr = nomorEMR
            }
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            $scope.cetakPdf = function () {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cppt&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
             })
            medifirstService.getPart('emr/get-datacombo-part-kelas', true, true, 20).then(function (data) {
                $scope.listKelas = data

             })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data
            
             })
            // medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-general", true, true, 20).then(function (data) {
            //         $scope.listJenisPegawai = data;
            //     });
            medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-cppt", true, true, 20).then(function (data) {
                    $scope.listJenisPegawai = data;
                });
            

           
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
            }

            // var chacePeriode = cacheHelper.get('cacheHeader');
            // if (chacePeriode != undefined) {

            //     chacePeriode.umur = dateHelper.CountAge(new Date(chacePeriode.tgllahir), new Date());
            //     var bln = chacePeriode.umur.month,
            //         thn = chacePeriode.umur.year,
            //         day = chacePeriode.umur.day


            //     chacePeriode.umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '
            //     $scope.cc.nocm = chacePeriode.nocm
            //     $scope.cc.namapasien = chacePeriode.namapasien;
            //     $scope.cc.jeniskelamin = chacePeriode.jeniskelamin;
            //     $scope.cc.tgllahir = chacePeriode.tgllahir;
            //     $scope.cc.umur = chacePeriode.umur;
            //     $scope.cc.alamatlengkap = chacePeriode.alamatlengkap;
            //     $scope.cc.notelepon = chacePeriode.notelepon;

            // }
            
            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            if (chacePeriode != undefined) {
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[12]
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                dataLoad = dat.data.data
                $scope.item.obj[115915]=$scope.cc.tglregistrasi
                $scope.item.obj[115916]={ value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp }
                $scope.item.obj[115917]={ value: $scope.cc.objectruanganfk, text: $scope.cc.namaruangan }
                $scope.item.obj[115918]={ value: $scope.cc.objectkelasfk, text: $scope.cc.namakelas }
                for (let i = 0; i < dataLoad.length; i++) {
                    const element = dataLoad[i];
                    element.nourut = parseInt(element.nourut)
                }
                dataLoad.sort(function (a, b) {
                    if (a.nourut < b.nourut) { return -1; }
                    if (a.nourut > b.nourut) { return 1; }
                    return 0;
                })
                // console.log(dataLoad)
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            // if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                            //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            // }
                            


                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "datetime2") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "checkboxtextarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox2") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }   
                            // var res = str.split("~");
                            // // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            // $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }   
                            // var res = str.split("~");
                            // // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            // $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                   
                        if (dataLoad[i].type == "combobox3") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }   
                            // var res = str.split("~");
                            // // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            // $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }

                    }

                }
                // setTimeout(function(){medifirstService.setDisableAllInputElement()  }, 2000);
            })
            // tanggal isian otomatis
            $scope.$watch('item.obj[115796]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115796] !=null && $scope.item.obj[115795]==undefined){
                          $scope.item.obj[115795] =$scope.now
                      }

                       
                    }
                })

            
            $scope.$watch('item.obj[115806]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115806] !=null && $scope.item.obj[115805]==undefined){
                          $scope.item.obj[115805] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115816]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115816] !=null && $scope.item.obj[115815]==undefined){
                          $scope.item.obj[115815] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115826]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115826] !=null && $scope.item.obj[115825]==undefined){
                          $scope.item.obj[115825] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115836]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115836] !=null && $scope.item.obj[115835]==undefined){
                          $scope.item.obj[115835] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115846]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115846] !=null && $scope.item.obj[115845]==undefined){
                          $scope.item.obj[115845] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115856]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115856] !=null && $scope.item.obj[115855]==undefined){
                          $scope.item.obj[115855] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115866]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115866] !=null && $scope.item.obj[115865]==undefined){
                          $scope.item.obj[115865] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115876]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115876] !=null && $scope.item.obj[115875]==undefined){
                          $scope.item.obj[115875] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115886]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115886] !=null && $scope.item.obj[115885]==undefined){
                          $scope.item.obj[115885] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115896]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115896] !=null && $scope.item.obj[115895]==undefined){
                          $scope.item.obj[115895] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115920]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115920] !=null && $scope.item.obj[115919]==undefined){
                          $scope.item.obj[115919] =$scope.now
                      }

                       
                    }
                })
            
            $scope.$watch('item.obj[115930]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115930] !=null && $scope.item.obj[115929]==undefined){
                          $scope.item.obj[115929] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115940]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115940] !=null && $scope.item.obj[115939]==undefined){
                          $scope.item.obj[115939] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115950]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115950] !=null && $scope.item.obj[115949]==undefined){
                          $scope.item.obj[115949] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115960]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115960] !=null && $scope.item.obj[115959]==undefined){
                          $scope.item.obj[115959] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[116006]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116006] !=null && $scope.item.obj[116005]==undefined){
                          $scope.item.obj[116005] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115980]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[111764] !=null && $scope.item.obj[111763]==undefined){
                          $scope.item.obj[111763] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[115966]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115966] !=null && $scope.item.obj[115965]==undefined){
                          $scope.item.obj[115965] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[116000]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116000] !=null && $scope.item.obj[115999]==undefined){
                          $scope.item.obj[115999] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[116010]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116010] !=null && $scope.item.obj[116009]==undefined){
                          $scope.item.obj[116009] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[116020]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116020] !=null && $scope.item.obj[116019]==undefined){
                          $scope.item.obj[116019] =$scope.now
                      }

                       
                    }
                })
            $scope.$watch('item.obj[116030]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116030] !=null && $scope.item.obj[116029]==undefined){
                          $scope.item.obj[116029] =$scope.now
                      }

                       
                    }
                })
            
            

            // Pegawai isian otomatis
            $scope.$watch('item.obj[115797]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115797] !=null && $scope.item.obj[115798]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115798] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115807]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115807] !=null && $scope.item.obj[115808]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115808] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115817]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115817] !=null && $scope.item.obj[115818]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115818] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115827]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115827] !=null && $scope.item.obj[115828]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115828] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115837]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115837] !=null && $scope.item.obj[115838]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115838] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115847]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115847] !=null && $scope.item.obj[115848]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115848] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115857]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115857] !=null && $scope.item.obj[115858]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115858] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115867]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115867] !=null && $scope.item.obj[115868]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115868] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115877]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115877] !=null && $scope.item.obj[115878]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115878] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115887]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115887] !=null && $scope.item.obj[115888]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115888] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115897]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115897] !=null && $scope.item.obj[115898]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115898] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115907]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115907] !=null && $scope.item.obj[115908]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115908] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115921]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115921] !=null && $scope.item.obj[115922]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115922] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115931]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115931] !=null && $scope.item.obj[115932]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115932] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115941]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115941] !=null && $scope.item.obj[115942]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115942] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115951]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115951] !=null && $scope.item.obj[115952]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115952] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115961]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115961] !=null && $scope.item.obj[115962]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115962] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115971]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115971] !=null && $scope.item.obj[115972]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115972] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115981]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115981] !=null && $scope.item.obj[115982]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115982] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115991]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115991] !=null && $scope.item.obj[115992]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115992] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[116001]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116001] !=null && $scope.item.obj[116002]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116002] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[116011]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116011] !=null && $scope.item.obj[116012]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116012] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[116021]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116021] !=null && $scope.item.obj[116022]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116022] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[116031]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116031] !=null && $scope.item.obj[116032]==undefined){

                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116032] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            //notice otomatis
            $scope.$watch('item.obj[116039]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116039] !=null && $scope.item.obj[115799]==undefined){
                        $scope.item.obj[115799] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115800] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116040]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116040] !=null && $scope.item.obj[115809]==undefined){
                        $scope.item.obj[115809] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115810] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                }) 
                $scope.$watch('item.obj[116041]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116041] !=null && $scope.item.obj[115819]==undefined){
                        $scope.item.obj[115819] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115820] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116042]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116042] !=null && $scope.item.obj[115829]==undefined){
                        $scope.item.obj[115829] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115830] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116043]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116043] !=null && $scope.item.obj[115839]==undefined){
                        $scope.item.obj[115839] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115840] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                }) 
                $scope.$watch('item.obj[116044]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116044] !=null && $scope.item.obj[115849]==undefined){
                        $scope.item.obj[115849] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115850] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                }) 
                $scope.$watch('item.obj[116045]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116045] !=null && $scope.item.obj[115859]==undefined){
                        $scope.item.obj[115859] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115860] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })  
                $scope.$watch('item.obj[116046]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116046] !=null && $scope.item.obj[115869]==undefined){
                        $scope.item.obj[115869] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115870] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116047]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116047] !=null && $scope.item.obj[115879]==undefined){
                        $scope.item.obj[115879] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115880] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                }) 
                $scope.$watch('item.obj[116048]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116048] !=null && $scope.item.obj[115889]==undefined){
                        $scope.item.obj[115889] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115890] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116049]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116049] !=null && $scope.item.obj[115899]==undefined){
                        $scope.item.obj[115899] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115900] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                }) 
                $scope.$watch('item.obj[116050]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116050] !=null && $scope.item.obj[115909]==undefined){
                        $scope.item.obj[115909] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115910] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })

                $scope.$watch('item.obj[116051]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116051] !=null && $scope.item.obj[115923]==undefined){
                        $scope.item.obj[115923] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115924] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                }) 
                $scope.$watch('item.obj[116052]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116052] !=null && $scope.item.obj[115933]==undefined){
                        $scope.item.obj[115933] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115934] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116053]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116053] !=null && $scope.item.obj[115943]==undefined){
                        $scope.item.obj[115943] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115944] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                }) 
                $scope.$watch('item.obj[116054]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116054] !=null && $scope.item.obj[115953]==undefined){
                        $scope.item.obj[115953] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115954] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116055]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116055] !=null && $scope.item.obj[115963]==undefined){
                        $scope.item.obj[115963] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115964] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116056]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116056] !=null && $scope.item.obj[115973]==undefined){
                        $scope.item.obj[115973] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115974] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116057]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116057] !=null && $scope.item.obj[115983]==undefined){
                        $scope.item.obj[115983] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115984] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116058]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116058] !=null && $scope.item.obj[115993]==undefined){
                        $scope.item.obj[115993] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115994] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116059]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116059] !=null && $scope.item.obj[116003]==undefined){
                        $scope.item.obj[116003] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116004] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116060]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116060] !=null && $scope.item.obj[116013]==undefined){
                        $scope.item.obj[116013] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116014] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116061]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116061] !=null && $scope.item.obj[116023]==undefined){
                        $scope.item.obj[116023] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116024] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
                $scope.$watch('item.obj[116062]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116062] !=null && $scope.item.obj[116033]==undefined){
                        $scope.item.obj[116033] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116034] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            // tanggal Verifikasi otomatis
            $scope.$watch('item.obj[115802]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115802] !=null && $scope.item.obj[115803]==undefined){
                          $scope.item.obj[115803] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115804] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115842]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115842] !=null && $scope.item.obj[115843]==undefined){
                          $scope.item.obj[115843] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115844] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115882]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115882] !=null && $scope.item.obj[115883]==undefined){
                          $scope.item.obj[115883] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115884] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115926]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115926] !=null && $scope.item.obj[115927]==undefined){
                          $scope.item.obj[115927] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115928] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[115966]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[115966] !=null && $scope.item.obj[115967]==undefined){
                          $scope.item.obj[115967] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[115968] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            $scope.$watch('item.obj[116006]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116006] !=null && $scope.item.obj[116007]==undefined){
                          $scope.item.obj[116007] =$scope.now
                          let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                          $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                          $scope.item.obj[116008] = { value: pegawai.id, text: pegawai.namaLengkap }

                      }
                      

                       
                    }
                })
            // END tanggal Verifikasi otomatis
            // verifikasi otomatis
            // $scope.$watch('item.obj[111363]', function(newValue,oldValue){
            //         if(newValue!=oldValue){
                
            //           if($scope.item.obj[111363] !=null && $scope.item.obj[111355] == undefined && $scope.item.obj[111354] == undefined){
            //               $scope.item.obj[111355] = $scope.item.obj[111363]
            //           }
                      

                       
            //         }
            //     })
            // $scope.$watch('item.obj[111371]', function(newValue,oldValue){
            //         if(newValue!=oldValue){
                
            //           if($scope.item.obj[111371] !=null && $scope.item.obj[111355]==undefined && $scope.item.obj[111363] == undefined){
            //               $scope.item.obj[111355] = $scope.item.obj[111371]
            //               $scope.item.obj[111363] = $scope.item.obj[111371]
            //           }
            //           if($scope.item.obj[111371] !=null && $scope.item.obj[111363] == undefined){
            //               $scope.item.obj[111363] = $scope.item.obj[111371]
            //           }
                      

                       
            //         }
            //     })
            // $scope.$watch('item.obj[111379]', function(newValue,oldValue){
            //         if(newValue!=oldValue){
                
            //           if($scope.item.obj[111379] !=null && $scope.item.obj[111355]==undefined 
            //             && $scope.item.obj[111363] == undefined && $scope.item.obj[111371] == undefined){
            //               $scope.item.obj[111355] = $scope.item.obj[111379]
            //               $scope.item.obj[111363] = $scope.item.obj[111379]
            //               $scope.item.obj[111371] = $scope.item.obj[111379]
            //           }
            //           if($scope.item.obj[111379] !=null && $scope.item.obj[111363] == undefined 
            //             && $scope.item.obj[111371] == undefined){
            //               $scope.item.obj[111363] = $scope.item.obj[111379]
            //               $scope.item.obj[111371] = $scope.item.obj[111379]
            //           }
            //           if($scope.item.obj[111379] !=null && $scope.item.obj[111371] == undefined){
            //               $scope.item.obj[111371] = $scope.item.obj[111379]
            //           }
                      

                       
            //         }
            //     })






            // $scope.idpegawai=peagawaiLogin.id;
            // $scope.namapegawai=peagawaiLogin.namaLengkap
            // $scope.rubah = false
            // $scope.rubahid = ""

            // $scope.$watch('item.obj[111350]', function(newValue,oldValue){
            //         if(newValue!=oldValue){
                
            //           $scope.rubahid = 111351
            //           if($scope.item.obj[111350] !=null){
            //             if($scope.item.obj[111351] == undefined){
                        
            //               $scope.item.obj[111351] = { text:$scope.namapegawai}
            //               $scope.rubah = true
            //             }
            //           }else{
            //               $scope.item.obj[111351] = null
            //           }
                       
            //         if ($scope.rubah == true){
            //             $scope.item.obj[$scope.rubahid] ={ value:$scope.idpegawai,text:$scope.namapegawai}
            //         }   
            //         }

            //     })
            // $scope.$watch('item.obj[111358]', function(newValue,oldValue){
            //         if(newValue!=oldValue){
            //         $scope.rubahid = 111359
            //           if($scope.item.obj[111358] !=null){
            //             if ($scope.item.obj[111359] == undefined){
            //               $scope.item.obj[111359] = { text:$scope.namapegawai}
            //               $scope.rubah = true
                          
            //             }
            //           }else{
            //               $scope.item.obj[111359] = null
            //           }

            //         if ($scope.rubah == true){
            //             $scope.item.obj[$scope.rubahid] ={ value:$scope.idpegawai,text:$scope.namapegawai}
            //         }   
            //         }

                    
            //     })

           
        
            
            

            $scope.Batal =function(){
                $scope.item.obj=[]
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                
                // $scope.item.obj[111351] ={ value:$scope.idpegawai1,text:$scope.namapegawai1}
                // $scope.item.obj[111359] ={ value:$scope.idpegawai2,text:$scope.namapegawai2}
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'umum'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                    $rootScope.loadRiwayat()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'Cppt rawat inap new umum' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    // var arrStr = {
                    //     0: e.data.data.noemr
                    // }
                    // cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});