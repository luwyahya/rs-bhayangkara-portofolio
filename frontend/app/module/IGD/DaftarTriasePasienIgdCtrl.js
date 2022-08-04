define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarTriasePasienIgdCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'DateHelper',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, dateHelper) {
            //Inisial Variable             
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.isRouteLoading = false;
            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }

            // loadFirst();
            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarTriasePasienIgdCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    var awal = new Date(arrPeriode[0]);
                    var akhir = new Date(arrPeriode[1]);
                    $scope.item.tglAwal = moment(awal).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment(akhir).format('YYYY-MM-DD 23:59');
                } else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }
            loadData()
            $scope.SearchData = function () {
                loadData()
            }

            $scope.SearchEnter = function () {
                loadData()
            }

            $scope.SearchNoRm = function () {
                loadData()
            }

            $scope.SearchTglLahir = function () {
                loadData()
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
                var rm = ""
                if ($scope.item.noRM != undefined) {
                    rm = "&norm=" + $scope.item.noRM
                }

                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.item.namaPasien
                }

                var tglLahirs = ""
                if ($scope.item.tglLahir != undefined) {
                    tglLahirs = "&tglLahir=" + DateHelper.formatDate($scope.item.tglLahir, 'YYYY-MM-DD');
                }

                medifirstService.get("emr/get-data-riwayat-emr?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tglLahirs + rm + pasien).then(function (data) {
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            var result = datas[i];
                            var umur = dateHelper.CountAge(new Date(result.tgllahir), $scope.now);
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                            datas[i].umur = umur
                        }
                        $scope.isRouteLoading = false;
                        $scope.dataSourceGrid = datas;
                    });
            };

            $scope.columnGrid = [
                {
                    "field": "nocm",
                    "title": "No Rekam Medis",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                    // "template": "<span class='style-center'>#: namapasien #</span>"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "200px",

                },
                {
                    "field": "notelepon",
                    "title": "No Telepon",
                    "width": "80px",
                    "template": '# if( notelepon==null) {# - # } else {# #= notelepon # #} #'
                },
                {
                    "field": "noemr",
                    "title": "No EMR",
                    "width": "80px",
                },
                {
                    "field": "tglemr",
                    "title": "Tgl EMR",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "Noregistrasi",
                    "width": "80px",
                }
            ];

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm
                    $scope.idPasien = dataPasienSelected.id
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal
                    $scope.Noregistrasi = dataPasienSelected.noregistrasi
                    $scope.dataPasienSelected = dataPasienSelected
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }
            })


            $scope.RegistrasiPasien = function () {
                var nocmTriage = $scope.nocm.substring(0, 1);
                var InisiasiTriage = "E";
                if ($scope.Noregistrasi != undefined) {
                    toastr.warning('Pasien Sudah Terdaftar, Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }

                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }

                if ($scope.nocm != undefined) {

                    if ($scope.nocm != "-") {
                        $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                            noCm: $scope.nocm
                        })
                        var cacheSet = undefined;
                        cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                        var cacheSetss = undefined;
                        cacheHelper.set('CacheRegisOnline', cacheSetss);
                        var noEmr = $scope.dataPasienSelected.noemr
                        cacheHelper.set('CacheRegisTriage', noEmr);
                    } else {
                        if ($scope.dataPasienSelected != undefined) {
                            var header = {
                                nocm: $scope.nocm,
                                namaPasien: $scope.dataPasienSelected.namapasien,
                                jkid: $scope.dataPasienSelected.objectjeniskelaminfk,
                                jk: $scope.dataPasienSelected.jeniskelamin,
                                alamatlengkap: $scope.dataPasienSelected.alamatlengkap,
                                tgllahir: moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY HH:mm'),
                                notelepon: $scope.dataPasienSelected.notelepon,
                                noemr: $scope.dataPasienSelected.noemr
                            }
                            cacheHelper.set('CacheRegisTriage', header);
                            $state.go('RegistrasiPasienBaru', {
                                noRec: 0,
                                idPasien: $scope.idPasien,
                            })
                        }
                    }

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.InputTriage = function (dataPasienSelected) {
            
                var datas = dataPasienSelected;
                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Input Triage, Peringatan !')
                    return
                }

                if ($scope.nocm != undefined) {
                    
                    var header = {
                        nocm: $scope.nocm,
                        namapasien: $scope.dataPasienSelected.namapasien,
                        jeniskelamin: $scope.dataPasienSelected.jeniskelamin,
                        tgllahir: $scope.dataPasienSelected.tgllahir,
                        umur: $scope.dataPasienSelected.umur,
                        alamatlengkap: $scope.dataPasienSelected.alamatlengkap,
                        notelepon: $scope.dataPasienSelected.notelepon
                    }
                    cacheHelper.set("cacheHeader", header)
                    $state.go("RekamMedisIGD.EmrGawatDarurat")
                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.EditPasien = function () {
                if ($scope.nocm != undefined) {
                    // var isMenuDinamis = JSON.parse(localStorage.getItem('isMenuDinamis'))
                    // if(isMenuDinamis && isMenuDinamis == true){                        
                    cacheHelper.set('CacheRegisBayi', undefined);
                    $state.go('RegistrasiPasienBaru', {
                        noRec: 0,
                        idPasien: $scope.idPasien
                    })
                    // }else{
                    //     $state.go("EditPasien",{
                    //         noCm:$scope.nocm
                    //     })
                    // }

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.HapusPasien = function () {
                if ($scope.idPasien != undefined) {
                    var item = {
                        idpasien: $scope.idPasien
                    }

                    manageServicePhp.disablePasien(item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }
        }
    ]);
});