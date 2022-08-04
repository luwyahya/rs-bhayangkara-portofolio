define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CallAntrianCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem', '$mdDialog',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem, $mdDialog) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
            $scope.item.tglakhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 6
            }
            $scope.item.jenis1 = 'A (UMUM BARU)';
            $scope.item.jenis2 = 'B (BPJS BARU)';
            $scope.item.jenis3 = 'C (UMUM LAMA)';
            $scope.item.jenis4 = 'D (BPJS LAMA)';
            $scope.item.jenis5 = 'E (FINGER PRINT)';
            $scope.item.jenis6 = 'F';
            $scope.item.jenis7 = 'G';
            $scope.item.jenis8 = 'H';
            $scope.item.jenis9 = 'I';
            $scope.item.jenis10 = 'K';

            loadData()
            $scope.pasienBaru = function () {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }
            $scope.panggil = function () {
                // debugger;
                if ($scope.item.jenis == undefined || $scope.item.jenis == "") {
                    toastr.error('Pilih Jenis Pasien', 'Info');
                    return
                }
                if ($scope.item.loket == undefined || $scope.item.loket == "") {
                    toastr.error('Pilih Loket Pasien', 'Info');
                    return
                }
                var post = {
                    "loket": $scope.item.loket,
                    "jenis": $scope.item.jenis,
                    "tglAwal": moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss'),
                    "tglAkhir": moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss')
                }
                medifirstService.post('registrasi/post-callantrian', post).then(function (e) {
                    if (e.data.message == 'Antrian Habis') {
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('ANTRIAN HABIS')
                            .ariaLabel('Lucky day')
                            // .cancel('Tidak')
                            .ok('Ok')
                        $mdDialog.show(confirm).then(function () {

                        })
                    }
                    // loadData();
                    $scope.item.sekarang1 = 0;
                    $scope.item.sekarang2 = 0;
                    $scope.item.sekarang3 = 0;
                    $scope.item.sekarang4 = 0;
                    $scope.item.sekarang5 = 0;
                    $scope.item.sekarang6 = 0;
                    $scope.item.sekarang7 = 0;
                    $scope.item.sekarang8 = 0;
                    $scope.item.sekarang9 = 0;
                    $scope.item.sekarang10 = 0;
                    $scope.item.sisa1 = 0;
                    $scope.item.sisa2 = 0;
                    $scope.item.sisa3 = 0;
                    $scope.item.sisa4 = 0;
                    $scope.item.sisa5 = 0;
                    $scope.item.sisa6 = 0;
                    $scope.item.sisa7 = 0;
                    $scope.item.sisa8 = 0;
                    $scope.item.sisa9 = 0;
                    $scope.item.sisa10 = 0;
                    var infolast = e.data.datas;
                    var infosekarang = e.data.data;
                    for (var i = 0; i < infosekarang.length; i++) {
                        infosekarang[i].no = i + 1
                        if (infosekarang[i].jenis == 'A') {
                            $scope.item.sekarang1 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'B') {
                            $scope.item.sekarang2 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'C') {
                            $scope.item.sekarang3 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'D') {
                            $scope.item.sekarang4 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'E') {
                            $scope.item.sekarang5 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'F') {
                            $scope.item.sekarang6 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'G') {
                            $scope.item.sekarang7 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'H') {
                            $scope.item.sekarang8 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'I') {
                            $scope.item.sekarang9 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'K') {
                            $scope.item.sekarang10 = infosekarang[i].last
                        }
                    }
                    for (var i = 0; i < infolast.length; i++) {
                        infolast[i].no = i + 1
                        if (infolast[i].jenis == 'A') {
                            $scope.item.sisa1 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'B') {
                            $scope.item.sisa2 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'C') {
                            $scope.item.sisa3 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'D') {
                            $scope.item.sisa4 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'E') {
                            $scope.item.sisa5 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'F') {
                            $scope.item.sisa6 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'G') {
                            $scope.item.sisa7 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'H') {
                            $scope.item.sisa8 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'I') {
                            $scope.item.sisa9 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'K') {
                            $scope.item.sisa10 = infolast[i].sisa
                        }
                    }

                })
            }

            $scope.panggilUlang = function () {
                // debugger;
                if ($scope.item.jenis == undefined || $scope.item.jenis == "") {
                    toastr.error('Pilih Jenis Pasien', 'Info');
                    return
                }
                if ($scope.item.loket == undefined || $scope.item.loket == "") {
                    toastr.error('Pilih Loket Pasien', 'Info');
                    return
                }
                var post = {
                    "loket": $scope.item.loket,
                    "jenis": $scope.item.jenis,
                    "tglAwal": moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss'),
                    "tglAkhir": moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss'),
                    "noantrian": $scope.item.noUlang,
                }
                medifirstService.post('registrasi/post-callantrian-ulang', post).then(function (e) {
                    debugger;
                    if (e.data.message == 'Antrian Habis') {
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('ANTRIAN HABIS')
                            .ariaLabel('Lucky day')
                            // .cancel('Tidak')
                            .ok('Ok')
                        $mdDialog.show(confirm).then(function () {

                        })
                    }
                    // loadData();
                    $scope.item.sekarang1 = 0;
                    $scope.item.sekarang2 = 0;
                    $scope.item.sekarang3 = 0;
                    $scope.item.sekarang4 = 0;
                    $scope.item.sekarang5 = 0;
                    $scope.item.sekarang6 = 0;
                    $scope.item.sekarang7 = 0;
                    $scope.item.sekarang8 = 0;
                    $scope.item.sekarang9 = 0;
                    $scope.item.sekarang10 = 0;
                    $scope.item.sisa1 = 0;
                    $scope.item.sisa2 = 0;
                    $scope.item.sisa3 = 0;
                    $scope.item.sisa4 = 0;
                    $scope.item.sisa5 = 0;
                    $scope.item.sisa6 = 0;
                    $scope.item.sisa7 = 0;
                    $scope.item.sisa8 = 0;
                    $scope.item.sisa9 = 0;
                    $scope.item.sisa10 = 0;
                    var infolast = e.data.datas;
                    var infosekarang = e.data.data;
                    for (var i = 0; i < infosekarang.length; i++) {
                        infosekarang[i].no = i + 1
                        if (infosekarang[i].jenis == 'A') {
                            $scope.item.sekarang1 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'B') {
                            $scope.item.sekarang2 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'C') {
                            $scope.item.sekarang3 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'D') {
                            $scope.item.sekarang4 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'E') {
                            $scope.item.sekarang5 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'F') {
                            $scope.item.sekarang6 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'G') {
                            $scope.item.sekarang7 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'H') {
                            $scope.item.sekarang8 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'I') {
                            $scope.item.sekarang9 = infosekarang[i].last
                        }
                        if (infosekarang[i].jenis == 'K') {
                            $scope.item.sekarang10 = infosekarang[i].last
                        }
                    }
                    for (var i = 0; i < infolast.length; i++) {
                        infolast[i].no = i + 1
                        if (infolast[i].jenis == 'A') {
                            $scope.item.sisa1 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'B') {
                            $scope.item.sisa2 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'C') {
                            $scope.item.sisa3 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'D') {
                            $scope.item.sisa4 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'E') {
                            $scope.item.sisa5 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'F') {
                            $scope.item.sisa6 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'G') {
                            $scope.item.sisa7 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'H') {
                            $scope.item.sisa8 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'I') {
                            $scope.item.sisa9 = infolast[i].sisa
                        }
                        if (infolast[i].jenis == 'K') {
                            $scope.item.sisa10 = infolast[i].sisa
                        }
                    }

                })
            }

            function loadData() {

                $scope.isRouteLoading = true;
                $scope.item.sekarang1 = 0;
                $scope.item.sekarang2 = 0;
                $scope.item.sekarang3 = 0;
                $scope.item.sekarang4 = 0;
                $scope.item.sekarang5 = 0;
                $scope.item.sekarang6 = 0;
                $scope.item.sekarang7 = 0;
                $scope.item.sekarang8 = 0;
                $scope.item.sekarang9 = 0;
                $scope.item.sekarang10 = 0;
                $scope.item.sisa1 = 0;
                $scope.item.sisa2 = 0;
                $scope.item.sisa3 = 0;
                $scope.item.sisa4 = 0;
                $scope.item.sisa5 = 0;
                $scope.item.sisa6 = 0;
                $scope.item.sisa7 = 0;
                $scope.item.sisa8 = 0;
                $scope.item.sisa9 = 0;
                $scope.item.sisa10 = 0;

                medifirstService.get("registrasi/get-callantrian?" + "tglAwal=" + moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss') +
                    "&tglAkhir=" + moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss'))
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        debugger;
                        // $scope.item.sekarang1 =
                        var infolast = data.data.datas;
                        var infosekarang = data.data.data;

                        for (var i = 0; i < infosekarang.length; i++) {
                            infosekarang[i].no = i + 1
                            if (infosekarang[i].jenis == 'A') {
                                $scope.item.sekarang1 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'B') {
                                $scope.item.sekarang2 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'C') {
                                $scope.item.sekarang3 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'D') {
                                $scope.item.sekarang4 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'E') {
                                $scope.item.sekarang5 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'F') {
                                $scope.item.sekarang6 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'G') {
                                $scope.item.sekarang7 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'H') {
                                $scope.item.sekarang8 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'I') {
                                $scope.item.sekarang9 = infosekarang[i].last
                            }
                            if (infosekarang[i].jenis == 'K') {
                                $scope.item.sekarang10 = infosekarang[i].last
                            }
                        }
                        for (var i = 0; i < infolast.length; i++) {
                            infolast[i].no = i + 1
                            if (infolast[i].jenis == 'A') {
                                $scope.item.sisa1 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'B') {
                                $scope.item.sisa2 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'C') {
                                $scope.item.sisa3 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'D') {
                                $scope.item.sisa4 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'E') {
                                $scope.item.sisa5 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'F') {
                                $scope.item.sisa6 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'G') {
                                $scope.item.sisa7 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'H') {
                                $scope.item.sisa8 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'I') {
                                $scope.item.sisa9 = infolast[i].sisa
                            }
                            if (infolast[i].jenis == 'K') {
                                $scope.item.sisa10 = infolast[i].sisa
                            }
                        }

                    });

            };








        }
    ]);
});