define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienApotikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {

            // initialize.controller('DaftarPasienApotikCtrl', ['$q', '$rootScope', '$scope', '$window' ,'medifirstService','$state','CacheHelper','DateHelper',
            //     function($q, $rootScope, $scope,window,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.isTask6 = false;
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienApotikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    if (chacePeriode[2] != undefined) {
                        $scope.listDepartemen = [chacePeriode[2]]
                        $scope.item.instalasi = chacePeriode[2]
                    }

                    if (chacePeriode[3] != undefined) {
                        $scope.listRuangan = [chacePeriode[3]]
                        $scope.item.ruangan = chacePeriode[3]
                    }

                    if (chacePeriode[4] != undefined) {
                        $scope.item.listKelompokPasien = [chacePeriode[4]]
                        $scope.item.kelompokPasien = chacePeriode[4]
                    }

                    if (chacePeriode[5] != undefined) {
                        $scope.item.noReg = chacePeriode[5]
                    }

                    if (chacePeriode[6] != undefined) {
                        $scope.item.noMr = chacePeriode[6]
                    }

                    if (chacePeriode[7] != undefined) {
                        $scope.item.namaPasien = chacePeriode[7]
                    }

                    init();
                } else {
                    $scope.item.tglAwal = $scope.now;
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }
            var combojenis = [{
                id: 1,
                jenis: "Non Racikan"
            },
            {
                id: 2,
                jenis: "Racikan"
            },
            ];
            var listloket = [{
                id: 1,
                loket: "1"
            },
            {
                id: 2,
                loket: "2"
            },
            {
                id: 3,
                loket: "3"
            },
            {
                id: 4,
                loket: "4"
            },
            {
                id: 5,
                loket: "5"
            },
            {
                id: 6,
                loket: "6"
            },
            {
                id: 7,
                loket: "7"
            },
            {
                id: 8,
                loket: "8"
            },
            {
                id: 9,
                loket: "9"
            },
            {
                id: 10,
                loket: "10"
            },

            ];

            function loadCombo() {
                medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listRuangandepo = dat.data.ruanganfarmasi;
                    $scope.listjenis = combojenis;
                    $scope.listloket = listloket;
                });
            }
            $scope.cariEnter = function () {
                init()
            }

            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                var tempInstalasi = [];
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                    tempInstalasi = {
                        id: $scope.item.instalasi.id,
                        departemen: $scope.item.instalasi.departemen
                    }
                }

                var rg = ""
                var tempRuangan = [];
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                    tempRuangan = {
                        id: $scope.item.ruangan.id,
                        ruangan: $scope.item.ruangan.ruangan
                    }
                }

                var kp = ""
                var tempKelompokPasien = [];
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kpid=" + $scope.item.kelompokPasien.id
                    tempKelompokPasien = {
                        id: $scope.item.kelompokPasien.id,
                        kelompokpasien: $scope.item.kelompokPasien.kelompokpasien
                    }
                }

                var tempNoReg = "";
                if ($scope.item.noReg != undefined) {
                    tempNoReg = $scope.item.noReg;
                }

                var tempnoMr = "";
                if ($scope.item.noMr != undefined) {
                    tempnoMr = $scope.item.noMr;
                }

                var tempNamaPasien = "";
                if ($scope.item.namaPasien != undefined) {
                    tempNamaPasien = $scope.item.namaPasien;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');
                medifirstService.get("farmasi/get-daftar-pasien-farmasi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noregistrasi=" + $scope.item.noReg +
                    "&nocm=" + $scope.item.noMr +
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + kp, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
                        }
                        $scope.dataGrid = dat.data;
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: tempInstalasi,
                    3: tempRuangan,
                    4: tempKelompokPasien,
                    5: tempNoReg,
                    6: tempnoMr,
                    7: tempNamaPasien
                }
                cacheHelper.set('DaftarPasienApotikCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.TransaksiPelayanan = function () {
                // if ($scope.dataSelected.nostruklastfk != null && $scope.dataSelected.rpp != null) {
                //     window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!")
                //     return
                // }
                debugger;
                if ($scope.dataSelected.statusschedule != "" && $scope.dataSelected.objectruanganfk == '796') {
                    // if ($scope.dataSelected.istaskantrol < 5) {
                    //     toastr.error('Input Obat Tidak Bisa Dilakukan, Task Id Pasien Masih ' + $scope.dataSelected.istaskantrol, 'Info')
                    //     return;
                    // } else {
                    //     var a = new Date();
                    //     var x = Date.parse(a);
                    //     var data = {
                    //         kodebooking: $scope.dataSelected.statusschedule,
                    //         taskid: 6,
                    //         waktu: x
                    //     }
                    //     var objSave = {
                    //         data: data
                    //     }
                    //     medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                    //         debugger
                    var arrStr = {
                        0: $scope.dataSelected.nocm,
                        1: $scope.dataSelected.namapasien,
                        2: $scope.dataSelected.jeniskelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.dataSelected.umur,
                        5: $scope.dataSelected.klid,
                        6: $scope.dataSelected.namakelas,
                        7: $scope.dataSelected.tglregistrasi,
                        8: $scope.dataSelected.norec,
                        9: '',
                        10: $scope.dataSelected.kpid,
                        11: $scope.dataSelected.statusschedule,
                    }
                    cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                    $state.go('TransaksiPelayananApotik')
                    // })
                    // }
                } else if ($scope.dataSelected.statusschedule != "" && $scope.dataSelected.objectdepartemenfk == 18) {
                    // if ($scope.dataSelected.istaskantrol < 5) {
                    //     toastr.error('Input Obat Tidak Bisa Dilakukan, Task Id Pasien Masih ' + $scope.dataSelected.istaskantrol, 'Info')
                    //     return;
                    // } else {
                    //     var a = new Date();
                    //     var x = Date.parse(a);
                    //     var data = {
                    //         kodebooking: $scope.dataSelected.statusschedule,
                    //         taskid: 6,
                    //         waktu: x
                    //     }
                    //     var objSave = {
                    //         data: data
                    //     }
                    //     medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                    //         debugger
                    var arrStr = {
                        0: $scope.dataSelected.nocm,
                        1: $scope.dataSelected.namapasien,
                        2: $scope.dataSelected.jeniskelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.dataSelected.umur,
                        5: $scope.dataSelected.klid,
                        6: $scope.dataSelected.namakelas,
                        7: $scope.dataSelected.tglregistrasi,
                        8: $scope.dataSelected.norec,
                        9: '',
                        10: $scope.dataSelected.kpid,
                        11: $scope.dataSelected.statusschedule,
                    }
                    cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                    $state.go('TransaksiPelayananApotik')
                    //     })
                    // }
                } else {
                    var arrStr = {
                        0: $scope.dataSelected.nocm,
                        1: $scope.dataSelected.namapasien,
                        2: $scope.dataSelected.jeniskelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.dataSelected.umur,
                        5: $scope.dataSelected.klid,
                        6: $scope.dataSelected.namakelas,
                        7: $scope.dataSelected.tglregistrasi,
                        8: $scope.dataSelected.norec,
                        9: '',
                        10: $scope.dataSelected.kpid,
                        11: $scope.dataSelected.statusschedule,
                    }
                    cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                    $state.go('TransaksiPelayananApotik')
                }
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "30px",
            },
            {
                "field": "namaruangan",
                "title": "Nama Ruangan",
                "width": "130px",
            },
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "80px",
            },
            {
                "field": "nocm",
                "title": "No MR",
                "width": "70px",
            },
            {
                "field": "namapasien",
                "title": "Nama Pasien",
                "width": "150px",
            },
            {
                "field": "jeniskelamin",
                "title": "Jenis Kelamin",
                "width": "70px",
            },
            {
                "field": "umur",
                "title": "Umur",
                "width": "100px"
            },
            {
                "field": "kelompokpasien",
                "title": "Kelompok Pasien",
                "width": "100px",
            },
            // {
            //     "field": "namarekanan",
            //     "title": "namarekanan",
            //     "width" : "100px"//,
            //     //"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            // },
            {
                "field": "namakelas",
                "title": "Nama Kelas",
                "width": "80px",
            },
            {
                "field": "tglregistrasi",
                "title": "Tgl Registrasi",
                "width": "100px",
            },
            {
                "field": "tglpulang",
                "title": "Tgl Pulang",
                "width": "100px",
            }
            ];
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn ' // + bln + ' bln'
            }
            $scope.antrian = function () {
                // $scope.item.ruangandepo = { id: $scope.listRuangandepo[0].id, namaruangan: $scope.listRuangandepo[0].namaruangan }
                // $scope.item.loket = { id: $scope.listloket[0].id, loket: $scope.listloket[0].loket }
                // if ($scope.dataSelected.statusschedule != "" && $scope.dataSelected.objectruanganfk == '796') {
                //     if ($scope.dataSelected.istaskantrol < 6) {
                //         toastr.error('Input Obat Tidak Bisa Dilakukan, Task Id Pasien Masih ' + $scope.dataSelected.istaskantrol, 'Info')
                //         return;
                //     } else {
                //         $scope.isTask6 = true;
                //         $scope.popupantrian.center().open();
                //     }
                // } else if ($scope.dataSelected.statusschedule != "" && $scope.dataSelected.objectdepartemenfk == 18) {
                //     if ($scope.dataSelected.istaskantrol < 6) {
                //         toastr.error('Input Obat Tidak Bisa Dilakukan, Task Id Pasien Masih ' + $scope.dataSelected.istaskantrol, 'Info')
                //         return;
                //     } else {
                //         $scope.isTask6 = true;
                //         $scope.popupantrian.center().open();
                //     }
                // } else {
                $scope.isTask6 = false;
                $scope.popupantrian.center().open();
                // }
            }
            $scope.saveantrian = function () {
                debugger;
                if ($scope.item.jenis.jenis == undefined) {
                    alert("Jenis Resep HARUS DI PILIH !!!!!!!!!!!!!!!!!!")
                    return;
                }
                // dimatikan dulu
                // if ($scope.isTask6 == true) {
                //     var a = new Date();
                //     var x = Date.parse(a);
                //     var data = {
                //         kodebooking: $scope.dataSelected.statusschedule,
                //         taskid: 7,
                //         waktu: x
                //     }
                //     var objSave = {
                //         data: data
                //     }
                //     medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                //         debugger
                //         init()
                //     })
                // }

                var objSave = {
                    norecapd: $scope.dataSelected.norec,
                    ruanganfk: $scope.item.ruangandepo.id,
                    jenis: $scope.item.jenis.jenis,
                    nocmfk: $scope.dataSelected.id,
                    loket: $scope.item.loket.id,
                }

                $scope.tombolSimpanVis = false;
                medifirstService.post('farmasi/save-antrian', objSave).then(function (e) {
                    $scope.popupantrian.center().close();
                })
            }
            $scope.InsidenInternal = function () {
                if ($scope.dataSelected.norec_pd == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec_pd,
                    1: 'InputInsidenInternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataSelected.norec_pd,
                    noOrder: 'InputInsidenInternal'
                });
            }
            //***********************************

        }
    ]);
});