define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ResikoJatuhDewasaCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window', '$stateParams',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window, $stateParams) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.dataSelectedTambah = {}
        $scope.cc = {};
        $scope.item.obj = []
        const dataTambah = []
        var dataLoad = []
        $scope.cc.emrfk = 882;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        // var nomorEMR = '-'
        var nomorEMR = ''
        $scope.lainnya = false;
        $scope.nilai = false;
        $scope.privasi = false;
        $scope.lihat = false;
        $scope.ya = false;
        $scope.sebutkan = false;
        $scope.lainnyaketergantungan = false;
        $scope.lainnyakebiasaan = false
        var lanjut = false;
        var totalNilai = 0;
        $scope.TidakBerisiko = false;
        $scope.Berisiko = false;
        LoadCacheHelper()
        loadCombo()
        // loadRekon()
        
        //1
        $scope.$watch('item.obj[2794]', function(e) {
            if (e == true) {
                $scope.item.obj[2795] = false
            }
        })
        $scope.$watch('item.obj[2795]', function(e) {
            if (e == true) {
                $scope.item.obj[2794] = false
            }
        })

        //2
        $scope.$watch('item.obj[2796]', function(e) {
            if (e == true) {
                $scope.item.obj[2797] = false               
            }
        })
        $scope.$watch('item.obj[2797]', function(e) {
            if (e == true) {
                $scope.item.obj[2796] = false               
            }
        })

        //3
        $scope.$watch('item.obj[2798]', function(e) {
            if (e == true) {
                $scope.item.obj[2799] = false                
                $scope.item.obj[2800] = false                
            }
        })
        $scope.$watch('item.obj[2799]', function(e) {
            if (e == true) {
                $scope.item.obj[2798] = false                
                $scope.item.obj[2800] = false                
            }
        })
        $scope.$watch('item.obj[2800]', function(e) {
            if (e == true) {
                $scope.item.obj[2798] = false                
                $scope.item.obj[2799] = false                
            }
        })

        //4
        $scope.$watch('item.obj[2801]', function(e) {
            if (e == true) {
                $scope.item.obj[2802] = false              
            }
        })
        $scope.$watch('item.obj[2802]', function(e) {
            if (e == true) {
                $scope.item.obj[2801] = false             
            }
        })

        //5
        $scope.$watch('item.obj[2803]', function(e) {
            if (e == true) {
                $scope.item.obj[2804] = false                
                $scope.item.obj[2805] = false                
            }
        })
        $scope.$watch('item.obj[2804]', function(e) {
            if (e == true) {
                $scope.item.obj[2803] = false                
                $scope.item.obj[2805] = false                
            }
        })
        $scope.$watch('item.obj[2805]', function(e) {
            if (e == true) {
                $scope.item.obj[2803] = false                
                $scope.item.obj[2804] = false                
            }
        })

        //6
        $scope.$watch('item.obj[2806]', function(e) {
            if (e == true) {
                $scope.item.obj[2807] = false              
            }
        })
        $scope.$watch('item.obj[2807]', function(e) {
            if (e == true) {
                $scope.item.obj[2806] = false             
            }
        })
       

        function loadCombo() {
            // medifirstService.get('emr/get-combo-diagnosa-pengkajian?').then(function(dat) {
            //     $scope.listDiagnosa = dat.data.diagnosa
            // })
            //debugger
            if ($scope.cc.objectruanganfk == 8 || $scope.cc.objectruanganfk == 250 || $scope.cc.objectruanganfk == 268 || $scope.cc.objectruanganfk == 130 || $scope.cc.objectruanganfk == 446 || $scope.cc.objectruanganfk == 97 || $scope.cc.objectruanganfk == 89 || $scope.cc.objectruanganfk == 459) {
                medifirstService.get("emr/get-combo-diagnosa-keperawatan-new?idRuangan=" + $scope.cc.objectruanganfk).then(function(data) {
                    $scope.listDiagnosa = data.data;
                })
            } else {
                medifirstService.getPart("emr/get-combo-diagnosa-keperawatan", true, true, 10).then(function(data) {
                    $scope.listDiagnosa = data;
                })
            }
        //     medifirstService.getPart("emr/get-combo-diagnosa-keperawatan-new?idRuangan=" + $scope.cc.objectruanganfk, true, true, 10).then(function(data) {
        //         //debugger
        //         if (data.length > 0) {
        //             $scope.listDiagnosa = data;
        //         } else {
        //             medifirstService.getPart("emr/get-combo-diagnosa-keperawatan", true, true, 10).then(function(data) {
        //                 $scope.listDiagnosa = data;
        //             })
        //         }
        //    });                  
            medifirstService.get('emr/get-combo-anyar-hehe').then(function(dat) {
                //debugger
                $scope.listAgama = dat.data.agama
                $scope.listPendidikan = dat.data.pendidikan
                $scope.listPekerjaan = dat.data.pekerjaan
            })
        }

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
                $scope.cc.jenisemr = "resikojatuhdewasa"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                //debugger
                $scope.item.obj[2793] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                // $scope.item.obj[2450] = moment($scope.cc.tglregistrasi).format('YYYY-MM-DD')
                // $scope.item.obj[2451] = moment($scope.now).format('HH:mm')
                init()             
            }
        }
        
        function init() {
            var flag = $stateParams.noRec
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            if (!flag.includes('-new')) {
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=resikojatuhdewasa", true).then(function(dat) {
                $scope.isRouteLoading = false
                //debugger
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'resikojatuhdewasa') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 882;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {
                        // cekDiagnosa()
                    }
                    // if (dat.data.data[0].jenisemr == 'pengkajianawal') {
                    //     $scope.noemr = dat.data.data[0].noemr
                    //     $scope.cc.norec_emr = dat.data.data[0].noemr
                    //         nomorEMRSS = ''
                    //         nomorEMRSS = dat.data.data[0].noemr
                    //         nomorEMR = nomorEMRSS
                    //         $scope.cc.emrfk = 674;
                    //         setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    // } else {
                    //     cekDiagnosa()
                    // }
                } else {
                    // cekDiagnosa()
                }
            })
        } else {
                
        }
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                //debugger
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
                            if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisi(datass)
                            }


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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2452") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2471") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "890") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "891") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2539") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2540") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2541") {
                            //debugger
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2550") {
                            //debugger
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], pekerjaan: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2549") {
                            //debugger
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], pendidikan: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "2548") {
                            //debugger
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], agama: str }

                        }
                        // if (dataLoad[i].type == "combobox") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        // }
                        if (dataLoad[i].type == "photo") {
                            $scope.user.poto = dataLoad[i].value
                        }                        
                        if (dataLoad[i].emrdfk == "2703") {
                            debugger
                            totalcost2[0].value = dataLoad[i].value
                            if(totalcost2[0].value > 0){
                                $scope.TidakBerisiko = true
                                $scope.Berisiko = false
                            }
                            // if(totalcost2[0].value > 11){
                            //     $scope.Berisiko = true
                            //     $scope.TidakBerisiko = false
                            // }
                        }
                    }

                }
            })
            
        }
        $scope.Save = function() {
            //debugger
            var user = medifirstService.getPegawaiLogin();
            // $scope.item.obj[2640] = moment($scope.now).format('YYYY-MM-DD')
            // $scope.item.obj[2641] = moment($scope.now).format('HH:mm:ss')
            // $scope.item.obj[2537] = user.namaLengkap
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {                  
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
            }          
            if (totalcost2[0].value != "") {
                arrSave.push ({ id: "2807", values: totalcost2[0].value})
            }
            $scope.cc.jenisemr = 'resikojatuhdewasa'
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
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
        }
        $scope.Cetak = function () {
            //debugger
            if (nomorEMR == '') return
            var arrPush = []
            for (var i = 1147; i <= 1236 - 1; i++) {
                arrPush.push({ emrdfk: i.toString(), value: "" })
            }
            for (let i = 0; i <= dataLoad.length - 1; i++) {
                if (dataLoad[i].type == "date") {
                    dataLoad[i].value = moment(dataLoad[i].value).format('YYYY-MM-DD')
                }
                if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                    for (var x = 0; x <= arrPush.length - 1; x++) {
                        if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                            arrPush[x].value = dataLoad[i].value
                        }
                    }
                }
            }

                var nama = $scope.cc.namapasien
                var nocm = $scope.cc.nocm
                var tgllahir = $scope.cc.tglLahir
                var jk = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan

            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["dataLoad","nomorEMR","noregistrasi","ruanganfk","nama","nocm","tgllahir","jeniskelamin","umur","ruangan"],
                "paramValue": [arrPush,nomorEMR,$scope.cc.noregistrasi,$scope.cc.objectruanganfk,nama,nocm,tgllahir,jk,umur,ruangan],
                "paramType" : ["","","","","","","","","",""] // "paramType" : ["","date"] selain date, isinya kosong saja
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    //this.response is what you're looking for
                    // handler(this.response);
                    console.log(this.response, typeof this.response);
                    //var res = this.response
                    //var file = new Blob( [res], {type: 'application/pdf'});
                    //debugger;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            }
            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/PengkajianAwalKeperawatan.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/PengkajianAwalKeperawatan.pdf');
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