define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('PemeriksaanPsikologisCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.user = {};
        $scope.cc = {};
        $scope.cc.emrfk = 892;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = '-'
        var dataLoad = []
        $scope.istempatLaporan = true;
        $scope.ada = false;
        $scope.ruanglainnya = false;
        $scope.lainnya1 = false;
        $scope.lainnya2 = false;
        $scope.lainnya3 = false;
        $scope.lainnya4 = false;
        $scope.lainnya5 = false;
        $scope.lainnya6 = false;
        $scope.lainnya7 = false;
        $scope.lainnya8 = false;
        $scope.lainnya9 = false;
        $scope.lainnya10 = false;
        $scope.lainnya11 = false;
        $scope.lainnya12 = false;
        LoadCombo()
        LoadCacheHelper()

        function LoadCombo() {
            medifirstService.get('emr/get-combo?').then(function(dat) {
                $scope.listDokter = dat.data.dokter
                $scope.ListPekerjaan = dat.data.pekerjaan
            })
        }

        $scope.$watch('item.obj[1511]', function(e) {
            if (e == true) {
                $scope.item.obj[1512] = undefined              
            }           
        })
        $scope.$watch('item.obj[1512]', function(e) {
            if (e == true) {
                $scope.item.obj[1511] = undefined              
                $scope.item.obj[1511] = undefined              
            }             
        })

        $scope.$watch('item.obj[1535]', function(e) {
            if (e == true) {
                $scope.item.obj[1536] = undefined
                $scope.item.obj[1537] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1536]', function(e) {
            if (e == true) {
                $scope.item.obj[1537] = undefined
                $scope.item.obj[1535] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1537]', function(e) {
            if (e == true) {
                $scope.item.obj[1536] = undefined
                $scope.item.obj[1535] = undefined              
            }             
        })

        $scope.$watch('item.obj[1538]', function(e) {
            if (e == true) {
                $scope.item.obj[1539] = undefined
                $scope.item.obj[1540] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1539]', function(e) {
            if (e == true) {
                $scope.item.obj[1540] = undefined
                $scope.item.obj[1538] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1540]', function(e) {
            if (e == true) {
                $scope.item.obj[1539] = undefined
                $scope.item.obj[1538] = undefined              
            }             
        })

        $scope.$watch('item.obj[1541]', function(e) {
            if (e == true) {
                $scope.item.obj[1543] = undefined
                $scope.item.obj[1542] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1542]', function(e) {
            if (e == true) {
                $scope.item.obj[1543] = undefined
                $scope.item.obj[1541] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1543]', function(e) {
            if (e == true) {
                $scope.item.obj[1541] = undefined
                $scope.item.obj[1542] = undefined              
            }             
        })

        $scope.$watch('item.obj[1544]', function(e) {
            if (e == true) {
                $scope.item.obj[1545] = undefined
                $scope.item.obj[1546] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1545]', function(e) {
            if (e == true) {
                $scope.item.obj[1546] = undefined
                $scope.item.obj[1544] = undefined                              
            }           
        })
        $scope.$watch('item.obj[1546]', function(e) {
            if (e == true) {
                $scope.item.obj[1545] = undefined
                $scope.item.obj[1544] = undefined              
            }             
        })

        //1
        $scope.$watch('item.obj[1517]', function(e) {
            if (e == true) {
                $scope.lainnya1 = true;
                $scope.item.obj[1516] = undefined
                $scope.item.obj[1515] = undefined
                $scope.item.obj[1514] = undefined
            } else {
                $scope.lainnya1 = false;
            }
        })
        $scope.$watch('item.obj[1516]', function(e) {
            if (e == true) {
                $scope.item.obj[1517] = undefined
                $scope.item.obj[1515] = undefined
                $scope.item.obj[1514] = undefined
            } 
        })
        $scope.$watch('item.obj[1515]', function(e) {
            if (e == true) {
                $scope.item.obj[1517] = undefined
                $scope.item.obj[1516] = undefined
                $scope.item.obj[1514] = undefined
            } 
        })
        $scope.$watch('item.obj[1514]', function(e) {
            if (e == true) {
                $scope.item.obj[1517] = undefined
                $scope.item.obj[1515] = undefined
                $scope.item.obj[1516] = undefined
            } 
        })

        //2
        $scope.$watch('item.obj[1523]', function(e) {
            if (e == true) {
                $scope.lainnya2 = true;
                $scope.item.obj[1522] = undefined
                $scope.item.obj[1521] = undefined
                $scope.item.obj[1520] = undefined
                $scope.item.obj[1519] = undefined
            } else {
                $scope.lainnya2 = false;
            }
        })
        $scope.$watch('item.obj[1522]', function(e) {
            if (e == true) {
                $scope.item.obj[1523] = undefined
                $scope.item.obj[1521] = undefined
                $scope.item.obj[1520] = undefined
                $scope.item.obj[1519] = undefined
            } 
        })
        $scope.$watch('item.obj[1521]', function(e) {
            if (e == true) {
                $scope.item.obj[1523] = undefined
                $scope.item.obj[1522] = undefined
                $scope.item.obj[1520] = undefined
                $scope.item.obj[1519] = undefined
            } 
        })
        $scope.$watch('item.obj[1520]', function(e) {
            if (e == true) {
                $scope.item.obj[1523] = undefined
                $scope.item.obj[1522] = undefined
                $scope.item.obj[1521] = undefined
                $scope.item.obj[1519] = undefined
            } 
        })
        $scope.$watch('item.obj[1519]', function(e) {
            if (e == true) {
                $scope.item.obj[1523] = undefined
                $scope.item.obj[1522] = undefined
                $scope.item.obj[1521] = undefined
                $scope.item.obj[1520] = undefined
            } 
        })

        //3
        $scope.$watch('item.obj[1528]', function(e) {
            if (e == true) {
                $scope.lainnya3 = true;
                $scope.item.obj[1527] = undefined              
            } else {
                $scope.lainnya3 = false;
            }
        })
        $scope.$watch('item.obj[1527]', function(e) {
            if (e == true) {
                $scope.lainnya12 = true;
                $scope.item.obj[1528] = undefined              
            } else {
                $scope.lainnya12 = false;
            }
        })

        //4
        $scope.$watch('item.obj[1531]', function(e) {
            if (e == true) {
                $scope.lainnya4 = true;
                $scope.item.obj[1530] = undefined              
            } else {
                $scope.lainnya4 = false;
            }
        })
        $scope.$watch('item.obj[1530]', function(e) {
            if (e == true) {
                $scope.item.obj[1531] = undefined               
            } 
        })

         //5
         $scope.$watch('item.obj[1548]', function(e) {
            if (e == true) {
                $scope.lainnya5 = true;
                $scope.item.obj[1547] = undefined              
            } else {
                $scope.lainnya5 = false;
            }
        })
        $scope.$watch('item.obj[1547]', function(e) {
            if (e == true) {
                $scope.item.obj[1548] = undefined               
            } 
        })

        //6
        $scope.$watch('item.obj[1558]', function(e) {
            if (e == true) {
                $scope.lainnya6 = true;
                $scope.item.obj[1557] = undefined              
            } else {
                $scope.lainnya6 = false;
            }
        })
        $scope.$watch('item.obj[1557]', function(e) {
            if (e == true) {
                $scope.item.obj[1558] = undefined               
            } 
        })

          //7
          $scope.$watch('item.obj[1562]', function(e) {
            if (e == true) {
                $scope.lainnya7 = true;
                $scope.item.obj[1561] = undefined              
            } else {
                $scope.lainnya7 = false;
            }
        })
        $scope.$watch('item.obj[1561]', function(e) {
            if (e == true) {
                $scope.item.obj[1562] = undefined               
            } 
        })

        //8
        $scope.$watch('item.obj[1566]', function(e) {
            if (e == true) {
                $scope.lainnya8 = true;
                $scope.item.obj[1565] = undefined              
            } else {
                $scope.lainnya8 = false;
            }
        })
        $scope.$watch('item.obj[1565]', function(e) {
            if (e == true) {
                $scope.item.obj[1566] = undefined               
            } 
        })

        //9
        $scope.$watch('item.obj[1569]', function(e) {
            if (e == true) {
                $scope.lainnya9 = true;
                $scope.item.obj[1568] = undefined              
            } else {
                $scope.lainnya9 = false;
            }
        })
        $scope.$watch('item.obj[1568]', function(e) {
            if (e == true) {
                $scope.item.obj[1569] = undefined               
            } 
        })

        //10
        $scope.$watch('item.obj[1573]', function(e) {
            if (e == true) {
                $scope.lainnya10 = true;
                $scope.item.obj[1572] = undefined              
            } else {
                $scope.lainnya10 = false;
            }
        })
        $scope.$watch('item.obj[1572]', function(e) {
            if (e == true) {
                $scope.item.obj[1573] = undefined               
            } 
        })

        //11
        $scope.$watch('item.obj[1577]', function(e) {
            if (e == true) {
                $scope.lainnya11 = true;
                $scope.item.obj[1576] = undefined              
            } else {
                $scope.lainnya11 = false;
            }
        })
        $scope.$watch('item.obj[1576]', function(e) {
            if (e == true) {
                $scope.item.obj[1577] = undefined               
            } 
        })
        
        $scope.listAnakKe = [
            { text: "1", value: 1 },
            { text: "2", value: 2 },
            { text: "3", value: 3 },
            { text: "4", value: 4 },
            { text: "5", value: 5 },
            { text: "6", value: 6 },
            { text: "7", value: 7 },
            { text: "8", value: 8 },
            { text: "9", value: 9 },
            { text: "10", value: 10 },
            { text: "11", value: 11 },
            { text: "12", value: 12 },
            { text: "13", value: 13 },
            { text: "14", value: 14 },
            { text: "15", value: 15 },
            { text: "16", value: 16 },
            { text: "17", value: 17 },
            { text: "18", value: 18 },
            { text: "19", value: 19 },
            { text: "20", value: 20 }            
        ];

        $scope.listJumlahBersaudara = [
            { text: "1", value: 1 },
            { text: "2", value: 2 },
            { text: "3", value: 3 },
            { text: "4", value: 4 },
            { text: "5", value: 5 },
            { text: "6", value: 6 },
            { text: "7", value: 7 },
            { text: "8", value: 8 },
            { text: "9", value: 9 },
            { text: "10", value: 10 },
            { text: "11", value: 11 },
            { text: "12", value: 12 },
            { text: "13", value: 13 },
            { text: "14", value: 14 },
            { text: "15", value: 15 },
            { text: "16", value: 16 },
            { text: "17", value: 17 },
            { text: "18", value: 18 },
            { text: "19", value: 19 },
            { text: "20", value: 20 }            
        ];

        function LoadCacheHelper() {
            var chacePeriode = cacheHelper.get('cacheRMelektronik');
            if (chacePeriode != undefined) {
                //var arrPeriode = chacePeriode.split(':');
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
                $scope.cc.DataNoregis = chacePeriode[13]
                $scope.cc.tglLahir = chacePeriode[14]
                $scope.cc.norec_emr = '-'
                $scope.cc.jenisemr = "soaprj"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                init()
            }
        }
        function clearAll() {
            $scope.item = {}
        }
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pemeriksaanpsikologis", true).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                if (dat.data.data.length > 0) {
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    nomorEMRSS = ''
                    nomorEMRSS = dat.data.data[0].noemr
                    nomorEMR = nomorEMRSS
                    $scope.cc.emrfk = 892;
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                } else {
                    medifirstService.get('emr/get-image-from-jenis-surat?').then(function(dat) {
                        debugger
                        $scope.user.poto = dat.data[0].template
                        $scope.user.poto2 = dat.data[1].template
                    })
                }
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                debugger
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[68] = $scope.now
                dataLoad = dat.data.data
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
                            // $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            // if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                            //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            // }
                            // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            // if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkorNutrisi(datass)
                            // }


                        }
                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        // if (dataLoad[i].emrdfk == "1270") {
                        //     $scope.user.poto = dataLoad[i].value
                        // }
                        // if (dataLoad[i].emrdfk == "1271") {
                        //     $scope.user.poto2 = dataLoad[i].value
                        // }
                        debugger
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1580") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        debugger
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1617") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], pekerjaan: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1618") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], pekerjaan: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1615") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1616") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                    }

                }
            })
        }       
        
        $scope.simpan = function() {
            debugger
            var user = medifirstService.getPegawaiLogin();
            $scope.item.obj[1504] = moment($scope.now).format('YYYY-MM-DD')           
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 1580) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].namalengkap })                   
                    } else if (arrobj[i] == 1617) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].pekerjaan })
                    } else if (arrobj[i] == 1618) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].pekerjaan })
                    } else if (arrobj[i] == 1615) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else if (arrobj[i] == 1616) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }

            
            $scope.cc.jenisemr = 'pemeriksaanpsikologis'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                        init()
                        // init2()
                        // init3()
                    //     init()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
        }
        $scope.cetak = function() {
            debugger
                if (nomorEMR == '') return
                var kiri = $scope.user.poto;
                var kanan = $scope.user.poto2;
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 1261; i <= 1270 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 1272; i <= 1275 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                arrPush[x].value = dataLoad[i].value
                            }
                        }
                    }

                }
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norm","dataLoad","namaPasien","jeniskelamin","umur","ruangan","kiri","kanan"],
                    "paramValue": [$scope.cc.nocm,arrPush,$scope.cc.namapasien,$scope.cc.jeniskelamin,$scope.cc.umur,$scope.cc.namaruangan,kiri,kanan],
                    "paramType" : ["","","","","","","",""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200){
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/poli-jiwa.pdf');
                }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/poli-jiwa.pdf');
                }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/poli-jiwa.pdf');
                }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/poli-jiwa.pdf');
                }else{
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/poli-jiwa.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));	
        }
    }
])
})