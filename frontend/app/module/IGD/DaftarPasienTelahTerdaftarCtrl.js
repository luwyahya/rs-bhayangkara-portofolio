define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienTelahTerdaftarCtrl', ['CacheHelper', '$scope', 'ModelItem', 'DateHelper', '$state', '$mdDialog', 'MedifirstService',
        function (cacheHelper, $scope, ModelItem, dateHelper, $state, $mdDialog, medifirstService) {
            //Inisial Variable             
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataitem = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            loadCombo();

            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarPasienTelahTerdaftarCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                }
            }

            function loadCombo() {
                medifirstService.get("igd/get-data-combo", true).then(function (data) {
                    var datas = data.data;
                    $scope.listDataJenisKelamin = datas.jeniskelamin;
                });
            }

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

            function ClearDataPasien() {
                $scope.dataitem = {};
            };

            function loadData() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.item.noRM != undefined) {
                    rm = "&norm=" + $scope.item.noRM
                }

                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.item.namaPasien
                }
                var ayah = ""
                if ($scope.item.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.item.namaAyah
                }
                var almat = ""
                if ($scope.item.alamat != undefined) {
                    almat = "&alamat=" + $scope.item.alamat
                }

                if ($scope.item.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.item.namaAyah
                } var tglLahirs = ""
                if ($scope.item.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + DateHelper.formatDate($scope.item.tglLahir, 'YYYY-MM-DD');
                }

                medifirstService.get("igd/get-data-pasien?" +
                    tglLahirs +
                    rm +
                    pasien +
                    ayah +
                    almat)
                    .then(function (data) {
                        for (var i = 0; i < data.data.daftar.length; i++) {
                            var result = data.data.daftar[i];
                            var umur = dateHelper.CountAge(new Date(result.tgllahir), $scope.now);
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            // departemen = result.objectdepartemenfk
                            umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                            data.data.daftar[i].umur = umur
                        }
                        $scope.isRouteLoading = false;
                        $scope.dataSourceGrid = data.data.daftar;
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
                    "field": "namaayah",
                    "title": "Nama Ayah Kandung",
                    "width": "100px",
                    "template": '# if( namaayah==null) {# - # } else {# #= namaayah # #} #'
                    // "template": "<span class='style-center'>#: namaayah #</span>"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                // {
                //     "field": "umurzz",
                //     "title": "Umur",
                //     "width":240

                // },
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
                    "field": "nohp",
                    "title": "No HP",
                    "width": "80px",
                    "template": '# if( nohp==null) {# - # } else {# #= nohp # #} #'
                }
            ];

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm
                    $scope.idPasien = dataPasienSelected.nocmfk
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal
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
                            $state.go("RegistrasiPelayananRev", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })


            $scope.RegistrasiPasien = function () {
                // if ($scope.tglMeninggal != undefined) {
                //     toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                //     return
                // }

                if ($scope.nocm != undefined) {
                    $state.go("RegistrasiPelayananRev", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.InputTriage = function (dataPasienSelected) {
                var datas = dataPasienSelected;
                // if ($scope.tglMeninggal != undefined) {
                //     toastr.warning('Pasien Sudah Meninggal Tidak Bisa Input Triage, Peringatan !')
                //     return
                // }

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
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Apakah anda ingin input triage pada pasien baru?')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                        InputPasienBaru();
                    });

                }
            }

            $scope.InputTriagePasienBaru = function () {
                $scope.popUpTriagePasienBaru.center().open();
            }

            function InputPasienBaru() {
                // var cache = "CacheRegisTriage"
                // cacheHelper.set('CacheRegisTriage', cache);
                // $state.go("RegistrasiPasienNewRev")
                $scope.popUpTriagePasienBaru.center().open();
                var actions = $scope.popUpTriagePasienBaru.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpTriagePasienBaru.setOptions({ actions: actions });
            }

            $scope.batal = function () {
                ClearDataPasien();
                $scope.popUpTriagePasienBaru.close();
            }

            $scope.simpanTriage = function () {
                var listRawRequired = [
                    "dataitem.namaPasien|ng-model|Nama Pasien",
                    "dataitem.tempatLahir|ng-model|Tempat Lahir",
                    "dataitem.tglLahir|k-ng-model|Tgl Lahir",
                    "dataitem.jenisKelamin|k-ng-model|Jenis Kelamin",
                    "dataitem.alamatLengkap|ng-model|Alamat Lengkap",
                    "dataitem.noTelepon|ng-model|Nomor Telepon"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var tglLahiran = moment($scope.dataitem.tglLahir).format('YYYY-MM-DD HH:mm');
                    var umur = dateHelper.CountAge(new Date(tglLahiran), $scope.now);
                    var bln = umur.month,
                        thn = umur.year,
                        day = umur.day
                    var usia = (umur.year * 12) + umur.month;
                    umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                    var noCm = "-"
                    if ($scope.nocm != undefined) {
                        noCm = $scope.nocm
                    }
                    var header = {
                        nocm: noCm,
                        namapasien: $scope.dataitem.namaPasien,
                        jeniskelamin: $scope.dataitem.jenisKelamin.jeniskelamin,
                        tgllahir: $scope.dataitem.tglLahir,
                        umur: umur,
                        alamatlengkap: $scope.dataitem.alamatLengkap,
                        notelepon: $scope.dataitem.noTelepon
                    }
                    cacheHelper.set("cacheHeader", header)
                    $state.go("RekamMedisIGD.EmrGawatDarurat")
                    ClearDataPasien();
                    $scope.popUpTriagePasienBaru.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
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