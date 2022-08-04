define(['initialize'], function (initialize) {
    'use strict';

    initialize.controller('DerajatNyeriIGDCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, dateHelper, medifirstService) {
            // indikator harap tunggu
            $scope.dataVOloaded = true;
            $scope.tombolSimpanVis = true
            $scope.item = {};
            $scope.noCM = $state.params.noCM;
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 27
            var dataLoad = []
            $scope.listKeterangan = [
                { "id": 1, "nama": "Nyeri Ringan", "descNilai": "1-3" },
                { "id": 2, "nama": "Nyeri Sedang", "descNilai": "4-7" },
                { "id": 3, "nama": "Nyeri Berat", "descNilai": "8-10" },
            ]
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }
            $scope.listNyeriAnak = [
                {
                    "id": 7, "nama": "Hurts", "detail": [{ "id": 1, "nama": "Tidak Nyeri", "descNilai": "0  " }, { "id": 2, "nama": "", "descNilai": "2  " }, { "id": 3, "nama": "Nyeri", "descNilai": "4  " },
                    { "id": 4, "nama": "Mengganggu", "descNilai": "6  " }, { "id": 5, "nama": "", "descNilai": "8  " }, { "id": 6, "nama": "Nyeri Berat", "descNilai": "10  " }]
                }
            ]
            $scope.getSkalaNyeri = function (data, stat) {
                $scope.item.obj[1096] = stat.descNilai;
            }

            $scope.listKetNyeri = [
                { nama: 'Tidak Nyeri' }, { nama: 'Nyeri Mengganggu' }, { nama: 'Nyeri Berat' }
            ]
            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
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
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor(datass)
                            }

                            // if(dataLoad[i].type == "datetime") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            // }

                            // if(dataLoad[i].type == "checkboxtextbox") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            //     $scope.item.obj2[dataLoad[i].emrdfk] = true
                            // }
                            // if(dataLoad[i].type == "textarea") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            // }
                        }

                    }
                })
            }
            var chacePeriode = cacheHelper.get('cacheHeader');
            if(chacePeriode != undefined){
                  $scope.cc.nocm = chacePeriode.nocm
                  $scope.cc.namapasien = chacePeriode.namapasien;
                  $scope.cc.jeniskelamin = chacePeriode.jeniskelamin;
                  $scope.cc.tgllahir = moment(chacePeriode.tgllahir).format('YYYY-MM-DD');
                  $scope.cc.umur = chacePeriode.umur;
                  $scope.cc.alamatlengkap = chacePeriode.alamatlengkap;
                  $scope.cc.notelepon = chacePeriode.notelepon;
                  if (nomorEMR == '') {
                     $scope.cc.norec_emr = ''
                  }else{
                     $scope.cc.norec_emr = nomorEMR       
                  }
            }
            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'igd'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }


        }
    ]);
});