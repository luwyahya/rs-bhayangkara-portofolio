define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('FormulirFisioterapiCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.cc = {};
        $scope.item.obj = []
        var dataLoad = []
        $scope.cc.emrfk = 891;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = '-'
        $scope.lainnya = false;      
        var lanjut = false;
        $scope.kooperatif = false;
        $scope.tidakkooperatif = false;
        $scope.show = true;
        var totalNilai = 0;
        LoadCacheHelper()
        loadCombo()


        $scope.$watch('item.obj[2191]', function(e) {
            if (e == true) {
                $scope.item.obj[2192] = undefined              
            }           
        })
        $scope.$watch('item.obj[2192]', function(e) {
            if (e == true) {
                $scope.item.obj[2191] = undefined              
            }             
        })

        function loadCombo() {
            medifirstService.getPart("emr/get-combo-diagnosa-pengkajian", true, true, 10).then(function(data) {
                $scope.listDiagnosa = data;
           }); 
           medifirstService.get('emr/get-combo?').then(function(dat) {
            $scope.listDokter = dat.data.dokter;
            $scope.listPegawai = dat.data.pegawai2;
            });         
            
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
                $scope.cc.jenisemr = "formulirfisioterapi"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                $scope.item.obj[2221] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[2225] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[2229] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[2233] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[2237] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[2241] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                debugger
                $scope.item.obj[2236] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[2224] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[2228] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[2232] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[2240] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                $scope.item.obj[2244] = {value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap}
                init()
               
            }
        }
        
        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=formulirfisioterapi", true).then(function(dat) {
                $scope.isRouteLoading = false
                debugger
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'formulirfisioterapi') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 891;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } 
                } 
              
            })
            $scope.tambah1 = function () {
                $scope.show = false;
                $scope.show2 = true;
                $scope.showlah2 = true;
            };
            $scope.hapus2 = function () {
                $scope.show = true;
                $scope.show2 = false;
                $scope.showlah2 = false;
            };
            $scope.tambah2 = function () {
                $scope.show2 = false;
                $scope.show3 = true;
                $scope.showlah3 = true;
            };
            $scope.hapus3 = function () {
                $scope.show2 = true;
                $scope.show3 = false;
                $scope.showlah3 = false;
            };
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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1501") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str }

                        }
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1168") {
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
                        if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1259") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str }

                        }
                        // if (dataLoad[i].type == "combobox") {
                        //     var str = dataLoad[i].value
                        //     var res = str.split("~");
                        //     // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                        //     $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        // }
                        // if (dataLoad[i].type == "photo") {
                        //     $scope.user.poto = dataLoad[i].value
                        // }
                        // if (dataLoad[i].emrdfk == "1188") {
                        //     debugger
                        //     // totalNilai = dataLoad[i].value
                        //     // $scope.item.obj[1188] = parseInt(dataLoad[i].value)
                        //     totalcost[0].value = dataLoad[i].value
                        // }
                    }

                }
            })

        }
        $scope.Save = function() {
            debugger
            // var user = medifirstService.getPegawaiLogin();
            // $scope.item.obj[2221] = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            // $scope.item.obj[2225] = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            // $scope.item.obj[2229] = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            // $scope.item.obj[2233] = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            // $scope.item.obj[2203] = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            // $scope.item.obj[1500] = moment($scope.now).format('')
            // $scope.item.obj[1234] = user.namaLengkap
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 2236 || arrobj[i] == 2224 || arrobj[i] == 2228 || arrobj[i] == 2232 || arrobj[i] == 2240 || arrobj[i] == 2244) {
                         arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                // if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                //     if (arrobj[i] == 2236 || arrobj[i] == 2224 || arrobj[i] == 2228 || arrobj[i] == 2232) {
                //         arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                //     } 
                    // else if (arrobj[i] == 1168) {
                    //     arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    // } else if (arrobj[i] == 1259) {
                    //     arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
                    // } 
                    // else {
                        
                    // } 
                // }
            }
        
            $scope.cc.jenisemr = 'formulirfisioterapi'
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
        
        
        
    }
])
})