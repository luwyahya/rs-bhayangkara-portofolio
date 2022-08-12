define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('HasilSentraVisumCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper) {
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.dataSelectedVisum = {};
            $scope.istempatLaporan = true;
            $scope.show1 = false;
            $scope.show2 = false;
            $scope.buttonsearch = true;
            $scope.pegawaidalam = false
            $scope.pegawaidalam2 = false
            $scope.pegawaidalam3 = false
            $scope.tambahpegawaidalam = true
            $scope.tambahpegawaidalam2 = false
            $scope.tambahpegawaidalam3 = false
            $scope.hehe = true;
            getDraftPasienSentraVisum();
            getKoreksiIPasienSentraVisum();
            getKoreksiIIPasienSentraVisum();
            getSpesialisPasienSentraVisum();
            getKaInstalasiPasienSentraVisum()
            getPrintPasienSentraVisum()
            getDiserahkanPasienSentraVisum()
            LoadCombo();

            $scope.Cari = function () {
                $scope.isRouteLoading = true;
                getDraftPasienSentraVisum();
                getKoreksiIPasienSentraVisum();
                getKoreksiIIPasienSentraVisum();
                getSpesialisPasienSentraVisum();
                getKaInstalasiPasienSentraVisum()
                getPrintPasienSentraVisum()
                getDiserahkanPasienSentraVisum()
            }
            $scope.ceklispilihManualdalam = function (bool) {
                if (bool) {
                    $scope.pegawaidalam2 = true
                    $scope.tambahpegawaidalam3 = true
                    $scope.tambahpegawaidalam2 = false
                } else {
                    $scope.pegawaidalam2 = false
                }
            }
            $scope.ceklispilihManualdalam2 = function (bool) {
                if (bool) {
                    $scope.pegawaidalam3 = true
                    $scope.tambahpegawaidalam3 = false
                } else {
                    $scope.pegawaidalam3 = false
                }
            }
            $scope.ceklispilihManualdalam3 = function (bool) {
                if (bool) {
                    $scope.pegawaidalam = true
                    $scope.tambahpegawaidalam2 = true
                    $scope.tambahpegawaidalam = false
                } else {
                    $scope.pegawaidalam = false
                    $scope.tambahpegawaidalam2 = false
                    $scope.tambahpegawaidalam = true
                }
            }

            function LoadCombo() {
                medifirstService.get('registrasi/get-data-combo?').then(function (dat) {
                    $scope.listJenisKekerasan = dat.data.jeniskekerasan
                    $scope.listDokter = dat.data.dokter
                    $scope.listPegawai = dat.data.pegawai
                })
            }

            function getDraftPasienSentraVisum() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }

                medifirstService.get("registrasi/get-draft-pasien-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var draft = data.data
                        for (var i = 0; i < draft.length; i++) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(draft[i].tgllahir);
                            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                            draft[i].umurs = umurs.year + ' Tahun '
                        }
                        $scope.sourceDraftVisum = new kendo.data.DataSource({
                            data: draft,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.columnDraftVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                "field": "tglregistrasi",
                                "title": "Tgl Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px",
                            },
                            {
                                "field": "jeniskelamin",
                                "title": "Jenis Kelamin",
                                "width": "50px",
                            },
                            {
                                "field": "umurs",
                                "title": "Umur",
                                "width": "50px",
                            },
                            {
                                "field": "statuspasien",
                                "title": "Status",
                                "width": "50px",
                            },
                            {
                                "field": "namalengkap",
                                "title": "Dokter",
                                "width": "50px",
                            },
                            {
                                "field": "kelompokpasien",
                                "title": "Penjamin",
                                "width": "50px",
                            },
                            {
                                "field": "namarekanan",
                                "title": "Rekanan",
                                "width": "50px",
                            },
                            ]
                        }
                    })
            }

            function getKoreksiIPasienSentraVisum() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }

                medifirstService.get("registrasi/get-koreksi-i-pasien-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var draft = data.data
                        for (var i = 0; i < draft.length; i++) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(draft[i].tgllahir);
                            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                            draft[i].umurs = umurs.year + ' Tahun '
                        }
                        $scope.sourceKoreksiVisum = new kendo.data.DataSource({
                            data: draft,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.columnKoreksiVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                "field": "tglregistrasi",
                                "title": "Tgl Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px",
                            },
                            {
                                "field": "jeniskelamin",
                                "title": "Jenis Kelamin",
                                "width": "50px",
                            },
                            {
                                "field": "umurs",
                                "title": "Umur",
                                "width": "50px",
                            },
                            {
                                "field": "statuspasien",
                                "title": "Status",
                                "width": "50px",
                            },
                            {
                                "field": "namalengkap",
                                "title": "Dokter",
                                "width": "50px",
                            },
                            {
                                "field": "kelompokpasien",
                                "title": "Penjamin",
                                "width": "50px",
                            },
                            {
                                "field": "namarekanan",
                                "title": "Rekanan",
                                "width": "50px",
                            },
                            ]
                        }
                    })
            }

            function getKoreksiIIPasienSentraVisum() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }

                medifirstService.get("registrasi/get-koreksi-ii-pasien-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var draft = data.data
                        for (var i = 0; i < draft.length; i++) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(draft[i].tgllahir);
                            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                            draft[i].umurs = umurs.year + ' Tahun '
                        }
                        $scope.sourceKoreksiiVisum = new kendo.data.DataSource({
                            data: draft,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.columnKoreksiiVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                "field": "tglregistrasi",
                                "title": "Tgl Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px",
                            },
                            {
                                "field": "jeniskelamin",
                                "title": "Jenis Kelamin",
                                "width": "50px",
                            },
                            {
                                "field": "umurs",
                                "title": "Umur",
                                "width": "50px",
                            },
                            {
                                "field": "statuspasien",
                                "title": "Status",
                                "width": "50px",
                            },
                            {
                                "field": "namalengkap",
                                "title": "Dokter",
                                "width": "50px",
                            },
                            {
                                "field": "kelompokpasien",
                                "title": "Penjamin",
                                "width": "50px",
                            },
                            {
                                "field": "namarekanan",
                                "title": "Rekanan",
                                "width": "50px",
                            },
                            ]
                        }
                    })
            }

            function getSpesialisPasienSentraVisum() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }

                medifirstService.get("registrasi/get-spesialis-pasien-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var draft = data.data
                        for (var i = 0; i < draft.length; i++) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(draft[i].tgllahir);
                            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                            draft[i].umurs = umurs.year + ' Tahun '
                        }
                        $scope.sourceKonsultanVisum = new kendo.data.DataSource({
                            data: draft,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.columnKonsultanVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                "field": "tglregistrasi",
                                "title": "Tgl Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px",
                            },
                            {
                                "field": "jeniskelamin",
                                "title": "Jenis Kelamin",
                                "width": "50px",
                            },
                            {
                                "field": "umurs",
                                "title": "Umur",
                                "width": "50px",
                            },
                            {
                                "field": "statuspasien",
                                "title": "Status",
                                "width": "50px",
                            },
                            {
                                "field": "namalengkap",
                                "title": "Dokter",
                                "width": "50px",
                            },
                            {
                                "field": "kelompokpasien",
                                "title": "Penjamin",
                                "width": "50px",
                            },
                            {
                                "field": "namarekanan",
                                "title": "Rekanan",
                                "width": "50px",
                            },
                            ]
                        }
                    })
            }

            function getKaInstalasiPasienSentraVisum() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }

                medifirstService.get("registrasi/get-ka-instalasi-pasien-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var draft = data.data
                        for (var i = 0; i < draft.length; i++) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(draft[i].tgllahir);
                            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                            draft[i].umurs = umurs.year + ' Tahun '
                        }
                        $scope.sourceInstalasiVisum = new kendo.data.DataSource({
                            data: draft,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.columnInstalasiVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                "field": "tglregistrasi",
                                "title": "Tgl Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px",
                            },
                            {
                                "field": "jeniskelamin",
                                "title": "Jenis Kelamin",
                                "width": "50px",
                            },
                            {
                                "field": "umurs",
                                "title": "Umur",
                                "width": "50px",
                            },
                            {
                                "field": "statuspasien",
                                "title": "Status",
                                "width": "50px",
                            },
                            {
                                "field": "namalengkap",
                                "title": "Dokter",
                                "width": "50px",
                            },
                            {
                                "field": "kelompokpasien",
                                "title": "Penjamin",
                                "width": "50px",
                            },
                            {
                                "field": "namarekanan",
                                "title": "Rekanan",
                                "width": "50px",
                            },
                            ]
                        }
                    })
            }

            function getPrintPasienSentraVisum() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }

                medifirstService.get("registrasi/get-print-pasien-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var draft = data.data
                        for (var i = 0; i < draft.length; i++) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(draft[i].tgllahir);
                            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                            draft[i].umurs = umurs.year + ' Tahun '
                        }
                        $scope.sourcePrintVisum = new kendo.data.DataSource({
                            data: draft,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.columnPrintVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                "field": "tglregistrasi",
                                "title": "Tgl Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "50px",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "50px",
                            },
                            {
                                "field": "jeniskelamin",
                                "title": "Jenis Kelamin",
                                "width": "50px",
                            },
                            {
                                "field": "umurs",
                                "title": "Umur",
                                "width": "50px",
                            },
                            {
                                "field": "statuspasien",
                                "title": "Status",
                                "width": "50px",
                            },
                            {
                                "field": "namalengkap",
                                "title": "Dokter",
                                "width": "50px",
                            },
                            {
                                "field": "kelompokpasien",
                                "title": "Penjamin",
                                "width": "50px",
                            },
                            {
                                "field": "namarekanan",
                                "title": "Rekanan",
                                "width": "50px",
                            },
                            ]
                        }
                    })
            }

            function getDiserahkanPasienSentraVisum() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }

                medifirstService.get("registrasi/get-diserahkan-pasien-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama).then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var draft = data.data
                        for (var i = 0; i < draft.length; i++) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(draft[i].tgllahir);
                            var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                            draft[i].umurs = umurs.year + ' Tahun '
                        }
                        $scope.sourceDiserahkanVisum = new kendo.data.DataSource({
                            data: draft,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.columnDiserahkanVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                "field": "statusambil",
                                "title": "Status Ambil",
                                "width": "50px",
                                "template": "<button class=\"k-button custom-button\" ng-click=\"statusambil(dataItem)\" style=\"margin:0 0 5px\">#: statusambil #</button>",
                            },
                            {
                                "field": "nosurat",
                                "title": "Nomor Surat",
                                "width": "50px",
                            },
                            {
                                "field": "tglregistrasi",
                                "title": "Tgl Registrasi",
                                "width": "50px",
                            },
                            {
                                "field": "penerima",
                                "title": "Penerima Surat",
                                "width": "50px",
                            },
                            {
                                "field": "pemberi",
                                "title": "Pemberi Surat",
                                "width": "50px",
                            },
                            {
                                "field": "tglambil",
                                "title": "Tgl Ambil",
                                "width": "50px",
                                "template": "<span class='style-left'>{{formatTanggal('#: tglambil #')}}</span>"
                            },
                            ]
                        }
                    })
            }
            $scope.cariTemplate = function () {
                if ($scope.item.jeniskekerasan.id == 8) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=KFD').then(function (dat) {
                        debugger
                        // $scope.item.kllvisum = dat.data.data[0].template
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else if ($scope.item.jeniskekerasan.id == 4) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=KLL').then(function (dat) {
                        debugger
                        // $scope.item.kllvisum = dat.data.data[0].template
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else if ($scope.item.jeniskekerasan.id == 2) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=KDRT').then(function (dat) {
                        debugger
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else if ($scope.item.jeniskekerasan.id == 1) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=SEKSUAL').then(function (dat) {
                        debugger
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else {

                }

            }
            $scope.tulis = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return
                }
                debugger
                if ($scope.dataSelectedVisum.catatani != null && $scope.dataSelectedVisum.catatanspesialis == null) {
                    medifirstService.get("registrasi/get-hasil-i-pasien-sentra-visum?norec=" + $scope.dataSelectedVisum.norec).then(function (dat) {
                        debugger
                        var ea = dat.data[0]

                        $scope.item.jeniskekerasan3 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                        $scope.item.penulis3 = dat.data[0].penulis
                        $scope.item.tgltulis3 = dat.data[0].tgltulis
                        $scope.item.dokter3 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                        $scope.item.dokterkonsultan3 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                        $scope.item.nosurat3 = dat.data[0].nosurat
                        $scope.item.permintaandari3 = dat.data[0].permintaan
                        $scope.item.nosuratpermintaan3 = dat.data[0].nosuratpermintaan
                        $scope.item.riwayat3 = dat.data[0].riwayatkejadiani
                        $scope.item.hasilpemeriksaan3 = dat.data[0].hasilpemeriksaani
                        $scope.item.kesimpulan3 = dat.data[0].kesimpulani
                        $scope.popUpHasilSatuPemeriksaan.center().open();
                    })
                } else if ($scope.dataSelectedVisum.catatanspesialis != null) {
                    medifirstService.get("registrasi/get-hasil-spesialis-pasien-sentra-visum?norec=" + $scope.dataSelectedVisum.norec).then(function (dat) {
                        debugger
                        var ea = dat.data[0]

                        $scope.item.jeniskekerasan8 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                        $scope.item.penulis8 = dat.data[0].penulis
                        $scope.item.tgltulis8 = dat.data[0].tgltulis
                        $scope.item.dokter8 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                        $scope.item.dokterkonsultan8 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                        $scope.item.nosurat8 = dat.data[0].nosurat
                        $scope.item.permintaandari8 = dat.data[0].permintaan
                        $scope.item.nosuratpermintaan8 = dat.data[0].nosuratpermintaan
                        $scope.item.riwayat8 = dat.data[0].riwayatkejadianii
                        $scope.item.hasilpemeriksaan8 = dat.data[0].hasilpemeriksaanii
                        $scope.item.kesimpulan8 = dat.data[0].kesimpulanii
                        $scope.popUpHasilSpeisalisPemeriksaan8.center().open();
                    })
                } else if ($scope.dataSelectedVisum.draftriwayatkejadian != null) {
                    medifirstService.get('registrasi/get-draft-visum?noregistrasi=' + $scope.dataSelectedVisum.noregistrasi).then(function (dat) {
                        debugger
                        $scope.show1 = true;
                        $scope.buttonsearch = false;
                        if (dat.data[0].dokterkonsultanfk != null) {
                            $scope.pegawaidalam = true;
                            $scope.tambahpegawaidalam = false;
                            $scope.item.konsulen = { id: dat.data[0].dokterkonsultanfk, namalengkap: dat.data[0].dokterkonsultan }
                        }
                        if (dat.data[0].dokterkonsultan2fk != null) {
                            $scope.pegawaidalam2 = true;
                            $scope.tambahpegawaidalam2 = false;
                            $scope.item.konsulen2 = { id: dat.data[0].dokterkonsultan2fk, namalengkap: dat.data[0].dokterkonsultan2 }
                        }
                        if (dat.data[0].dokterkonsultan3fk != null) {
                            $scope.pegawaidalam3 = true;
                            $scope.tambahpegawaidalam3 = false;
                            $scope.item.konsulen3 = { id: dat.data[0].dokterkonsultan3fk, namalengkap: dat.data[0].dokterkonsultan3 }
                        }
                        $scope.item.jeniskekerasan = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                        $scope.item.penulis = dat.data[0].penulis
                        $scope.item.tgltulis = dat.data[0].tgltulis
                        $scope.item.dokter = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                        $scope.item.dokterkonsultan = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                        $scope.item.nosurat = dat.data[0].nosurat
                        $scope.item.permintaandari = dat.data[0].permintaan
                        $scope.item.nosuratpermintaan = dat.data[0].nosuratpermintaan
                        // $scope.item.kllvisum = dat.data[0].draftvisum
                        $scope.item.riwayatkejadian = dat.data[0].draftriwayatkejadian
                        $scope.item.hasilpemeriksaan = dat.data[0].drafthasilpemeriksaan
                        $scope.item.kesimpulan = dat.data[0].draftkesimpulan
                        $scope.item.tglminta = dat.data[0].tglpermintaan
                        $scope.popUpHasilPemeriksaan.center().open();
                    })
                } else {
                    var user = medifirstService.getPegawaiLogin().namaLengkap;
                    $scope.item.penulis = user
                    $scope.item.tgltulis = moment($scope.now).format('YYYY-MM-DD HH:mm');
                    $scope.item.dokter = { id: $scope.dataSelectedVisum.iddokter, namalengkap: $scope.dataSelectedVisum.namalengkap };
                    $scope.item.nosurat = "R /  / VER-PPT- /  / 2021 / Rumkit Bhay Tk. I"
                    $scope.popUpHasilPemeriksaan.center().open();
                }
            }
            $scope.tutupTulisHasilPemeriksaan = function () {
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.pegawaidalam = false;
                $scope.pegawaidalam2 = false;
                $scope.pegawaidalam3 = false;
                $scope.buttonsearch = true;
                $scope.item.jeniskekerasan = undefined;
                $scope.item.tgltulis = undefined;
                $scope.item.dokter = undefined;
                $scope.item.dokterkonsultan = undefined;
                $scope.item.nosurat = undefined;
                $scope.item.permintaandari = undefined;
                $scope.item.nosuratpermintaan = undefined;
                $scope.item.tglminta = undefined;
                $scope.item.kllvisum = undefined;
                $scope.item.riwayatkejadian = undefined;
                $scope.item.hasilpemeriksaan = undefined;
                $scope.item.kesimpulan = undefined;
                $scope.popUpHasilPemeriksaan.close();
            }
            $scope.lihatCatatanHasilPemeriksaan = function () {
                medifirstService.get("registrasi/get-hasil-i-pasien-sentra-visum?norec=" + $scope.dataSelectedVisum.norec).then(function (dat) {
                    debugger
                    var ea = dat.data[0]

                    $scope.item.catatan2 = dat.data[0].catatani
                    $scope.popUpLihatCatatanHasilPemeriksaan.center().open();
                })
            }
            $scope.tutupCatatanHasilPemeriksaan = function () {
                $scope.popUpLihatCatatanHasilPemeriksaan.close();
                $scope.item.catatan2 = undefined
            }
            $scope.tutupHasilPemeriksaan = function () {
                $scope.popUpHasilSatuPemeriksaan.close();
            }
            $scope.lihat = function () {
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return
                }
                $scope.item.jeniskekerasan2 = { id: $scope.dataSelectedVisum.jeniskekerasanfk, jeniskekerasan: $scope.dataSelectedVisum.jeniskekerasan }
                $scope.item.penulis2 = $scope.dataSelectedVisum.penulis
                $scope.item.tgltulis2 = $scope.dataSelectedVisum.tgltulis
                $scope.item.dokter2 = { id: $scope.dataSelectedVisum.iddokter, namalengkap: $scope.dataSelectedVisum.dokter }
                $scope.item.dokterkonsultan2 = { id: $scope.dataSelectedVisum.iddokterkonsultan, namalengkap: $scope.dataSelectedVisum.dokterkonsultan }
                $scope.item.nosurat2 = $scope.dataSelectedVisum.nosurat
                $scope.item.permintaandari2 = $scope.dataSelectedVisum.permintaan
                $scope.item.nosuratpermintaan2 = $scope.dataSelectedVisum.nosuratpermintaan
                $scope.item.riwayatkejadian2 = $scope.dataSelectedVisum.riwayatkejadiani
                $scope.item.hasilpemeriksaan2 = $scope.dataSelectedVisum.hasilpemeriksaani
                $scope.item.kesimpulan2 = $scope.dataSelectedVisum.kesimpulani
                $scope.item.hasilpemeriksaan = $scope.dataSelectedVisum.kllvisum
                $scope.item.tglminta2 = $scope.dataSelectedVisum.tglpermintaan
                // $scope.item.tglminta2 = $scope.dataSelectedVisum.tglpermintaan
                $scope.popUpLihatHasilPemeriksaan.center().open();
            }
            $scope.preview = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return;
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 4) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kll-visum?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }

                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 8) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kfd-visum?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 1 || $scope.dataSelectedVisum.jeniskekerasanfk == 2) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-ksd-visum?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
            }
            $scope.tutupLihatHasil = function () {
                $scope.item.jeniskekerasan2 = undefined
                $scope.item.penulis2 = undefined
                $scope.item.tgltulis2 = undefined
                $scope.item.dokter2 = undefined
                $scope.item.dokterkonsultan2 = undefined
                $scope.item.nosurat2 = undefined
                $scope.item.permintaandari2 = undefined
                $scope.item.nosuratpermintaan2 = undefined
                $scope.item.riwayat2 = undefined
                $scope.item.hasilpemeriksaan = undefined
                $scope.item.tglminta2 = undefined
                $scope.popUpLihatHasilPemeriksaan.close();
            }
            $scope.simpanDanKirimKeKoreksiII = function () {
                var save = {
                    norec: $scope.dataSelectedVisum.norec,
                    riwayatkejadian2: $scope.item.riwayatkejadian2,
                    hasilpemeriksaan2: $scope.item.hasilpemeriksaan2,
                    kesimpulan2: $scope.item.kesimpulan2,
                    kllvisum: $scope.item.riwayatkejadian2 + $scope.item.hasilpemeriksaan2 + $scope.item.kesimpulan2,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi
                }
                medifirstService.post('registrasi/save-to-koreksi-ii', save).then(function (dat) {
                    getDraftPasienSentraVisum()
                    getKoreksiIPasienSentraVisum();
                    getKoreksiIIPasienSentraVisum();
                    getSpesialisPasienSentraVisum()
                    getKaInstalasiPasienSentraVisum()
                    getPrintPasienSentraVisum()
                    getDiserahkanPasienSentraVisum()

                    $scope.popUpLihatHasilPemeriksaan.close();
                    $scope.item.jeniskekerasan2 = undefined
                    $scope.item.penulis2 = undefined
                    $scope.item.tgltulis2 = undefined
                    $scope.item.dokter2 = undefined
                    $scope.item.dokterkonsultan2 = undefined
                    $scope.item.nosurat2 = undefined
                    $scope.item.permintaandari2 = undefined
                    $scope.item.nosuratpermintaan2 = undefined
                    $scope.item.riwayat2 = undefined
                    $scope.item.hasilpemeriksaan = undefined
                    $scope.item.tglminta2 = undefined
                })
            }
            $scope.lihat2 = function () {
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return
                }
                $scope.item.jeniskekerasan4 = { id: $scope.dataSelectedVisum.id, jeniskekerasan: $scope.dataSelectedVisum.jeniskekerasan }
                $scope.item.penulis4 = $scope.dataSelectedVisum.penulis
                $scope.item.tgltulis4 = $scope.dataSelectedVisum.tgltulis
                $scope.item.dokter4 = { id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokter }
                $scope.item.dokterkonsultan4 = { id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokterkonsultan }
                $scope.item.nosurat4 = $scope.dataSelectedVisum.nosurat
                $scope.item.permintaandari4 = $scope.dataSelectedVisum.permintaan
                $scope.item.nosuratpermintaan4 = $scope.dataSelectedVisum.nosuratpermintaan
                // $scope.item.hasilpemeriksaan4 = $scope.dataSelectedVisum.kllvisum2
                $scope.item.riwayatkejadian3 = $scope.dataSelectedVisum.riwayatkejadianii
                $scope.item.hasilpemeriksaan3 = $scope.dataSelectedVisum.hasilpemeriksaanii
                $scope.item.kesimpulan3 = $scope.dataSelectedVisum.kesimpulanii
                $scope.item.tglminta4 = $scope.dataSelectedVisum.tglpermintaan
                $scope.popUpLihatHasilPemeriksaan2.center().open();
            }
            $scope.tutupLihatHasil2 = function () {
                $scope.item.jeniskekerasan4 = undefined
                $scope.item.penulis4 = undefined
                $scope.item.tgltulis4 = undefined
                $scope.item.dokter4 = undefined
                $scope.item.dokterkonsultan4 = undefined
                $scope.item.nosurat4 = undefined
                $scope.item.permintaandari4 = undefined
                $scope.item.nosuratpermintaan4 = undefined
                $scope.item.riwayat4 = undefined
                $scope.item.hasilpemeriksaan4 = undefined
                $scope.item.riwayatkejadian3 = undefined
                $scope.item.hasilpemeriksaan3 = undefined
                $scope.item.kesimpulan3 = undefined
                $scope.item.tglminta4 = undefined
                $scope.popUpLihatHasilPemeriksaan2.close();
            }
            $scope.lihatKoreksiI = function () {
                debugger
                medifirstService.get('registrasi/get-koreksi-i?norec=' + $scope.dataSelectedVisum.norec).then(function (dat) {
                    debugger
                    $scope.item.jeniskekerasan6 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                    $scope.item.penulis6 = dat.data[0].penulis
                    $scope.item.tgltulis6 = dat.data[0].tgltulis
                    $scope.item.dokter6 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                    $scope.item.dokterkonsultan6 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                    $scope.item.nosurat6 = dat.data[0].nosurat
                    $scope.item.permintaandari6 = dat.data[0].permintaan
                    $scope.item.nosuratpermintaan6 = dat.data[0].nosuratpermintaan
                    $scope.item.hasilpemeriksaan6 = dat.data[0].kllvisum
                    $scope.item.tglminta6 = dat.data[0].tglpermintaan
                    $scope.popUpLihatKoreksiI.center().open();
                })
            }
            $scope.lihatKoreksiII = function () {
                debugger
                medifirstService.get('registrasi/get-koreksi-i?norec=' + $scope.dataSelectedVisum.norec).then(function (dat) {
                    debugger
                    $scope.item.jeniskekerasan6 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                    $scope.item.penulis6 = dat.data[0].penulis
                    $scope.item.tgltulis6 = dat.data[0].tgltulis
                    $scope.item.dokter6 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                    $scope.item.dokterkonsultan6 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                    $scope.item.nosurat6 = dat.data[0].nosurat
                    $scope.item.permintaandari6 = dat.data[0].permintaan
                    $scope.item.nosuratpermintaan6 = dat.data[0].nosuratpermintaan
                    $scope.item.hasilpemeriksaan6 = dat.data[0].kllvisum2
                    $scope.item.tglminta6 = dat.data[0].tglpermintaan
                    $scope.popUpLihatKoreksiI.center().open();
                })
            }
            $scope.lihatKoreksiSpesialis = function () {
                debugger
                medifirstService.get('registrasi/get-koreksi-i?norec=' + $scope.dataSelectedVisum.norec).then(function (dat) {
                    debugger
                    $scope.item.jeniskekerasan6 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                    $scope.item.penulis6 = dat.data[0].penulis
                    $scope.item.tgltulis6 = dat.data[0].tgltulis
                    $scope.item.dokter6 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                    $scope.item.dokterkonsultan6 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                    $scope.item.nosurat6 = dat.data[0].nosurat
                    $scope.item.permintaandari6 = dat.data[0].permintaan
                    $scope.item.nosuratpermintaan6 = dat.data[0].nosuratpermintaan
                    $scope.item.hasilpemeriksaan6 = dat.data[0].kllvisum3
                    $scope.item.tglminta6 = dat.data[0].tglpermintaan
                    $scope.popUpLihatKoreksiI.center().open();
                })
            }
            $scope.tutupKoreksiI = function () {
                $scope.item.jeniskekerasan6 = undefined
                $scope.item.penulis6 = undefined
                $scope.item.tgltulis6 = undefined
                $scope.item.dokter6 = undefined
                $scope.item.dokterkonsultan6 = undefined
                $scope.item.nosurat6 = undefined
                $scope.item.permintaandari6 = undefined
                $scope.item.nosuratpermintaan6 = undefined
                $scope.item.riwayat6 = undefined
                $scope.item.hasilpemeriksaan6 = undefined
                $scope.item.tglminta6 = undefined
                $scope.popUpLihatKoreksiI.close();
            }
            $scope.kirimspesialis = function () {
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return;
                }
                var save = {
                    norec: $scope.dataSelectedVisum.norec,
                    riwayatkejadian3: $scope.item.riwayatkejadian3,
                    hasilpemeriksaan3: $scope.item.hasilpemeriksaan3,
                    kesimpulan3: $scope.item.kesimpulan3,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    kllvisum: $scope.item.riwayatkejadian3 + $scope.item.hasilpemeriksaan3 + $scope.item.kesimpulan3
                }
                medifirstService.post('registrasi/save-to-spesialis', save).then(function (e) {
                    getDraftPasienSentraVisum()
                    getKoreksiIPasienSentraVisum();
                    getKoreksiIIPasienSentraVisum();
                    getSpesialisPasienSentraVisum()
                    getKaInstalasiPasienSentraVisum()
                    getPrintPasienSentraVisum()
                    getDiserahkanPasienSentraVisum()
                    $scope.popUpLihatHasilPemeriksaan2.close();
                    $scope.item.jeniskekerasan6 = undefined
                    $scope.item.penulis6 = undefined
                    $scope.item.tgltulis6 = undefined
                    $scope.item.dokter6 = undefined
                    $scope.item.dokterkonsultan6 = undefined
                    $scope.item.nosurat6 = undefined
                    $scope.item.permintaandari6 = undefined
                    $scope.item.nosuratpermintaan6 = undefined
                    $scope.item.riwayat6 = undefined
                    $scope.item.hasilpemeriksaan6 = undefined
                    $scope.item.tglminta6 = undefined
                    $scope.item.riwayatkejadian3 = undefined
                    $scope.item.hasilpemeriksaan3 = undefined
                    $scope.item.kesimpulan3 = undefined
                })
            }
            $scope.previewKoreksiII = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return;
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 4) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kll-visum-koreksi-ii?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 8) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kfd-visum-koreksi-ii?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 1 || $scope.dataSelectedVisum.jeniskekerasanfk == 2) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-ksd-visum?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
            }
            $scope.catatanHasilPemeriksaan = function () {
                $scope.popUpCatatanHasilPemeriksaan.center().open();
            }
            $scope.batalCatatanHasilPemeriksaan = function () {
                $scope.popUpCatatanHasilPemeriksaan.close();
                $scope.item.catatan = undefined
            }
            $scope.saveHasilPemeriksaan = function () {
                debugger
                if ($scope.item.konsulen == undefined) {
                    $scope.item.konsulen = {
                        id: null
                    }
                }
                if ($scope.item.konsulen2 == undefined) {
                    $scope.item.konsulen2 = {
                        id: null
                    }
                }
                if ($scope.item.konsulen3 == undefined) {
                    $scope.item.konsulen3 = {
                        id: null
                    }
                }
                // if (arrobj[j].ttd == "") {
                //     arrobj[j].ttd = {
                //         namalengkap: ""
                //     }
                // }
                var save = {
                    norec: $scope.dataSelectedVisum.norec_pd,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    jeniskekerasanfk: $scope.item.jeniskekerasan.id,
                    penulisfk: medifirstService.getPegawaiLogin().id,
                    tgltulis: $scope.item.tgltulis,
                    dokterfk: $scope.item.dokter.id,
                    dokterkonsultanfk: $scope.item.konsulen.id,
                    dokterkonsultan2fk: $scope.item.konsulen2.id,
                    dokterkonsultan3fk: $scope.item.konsulen3.id,
                    nosurat: $scope.item.nosurat,
                    permintaandari: $scope.item.permintaandari,
                    nosuratpermintaan: $scope.item.nosuratpermintaan,
                    riwayatkejadian: $scope.item.riwayatkejadian,
                    hasilpemeriksaan: $scope.item.hasilpemeriksaan,
                    kesimpulan: $scope.item.kesimpulan,
                    tglminta: moment($scope.item.tglminta).format('YYYY-MM-DD HH:mm:ss'),
                    kllvisum: $scope.item.riwayat + $scope.item.hasilpemeriksaan + $scope.item.kesimpulan
                }
                $scope.popUpHasilPemeriksaan.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {

                    medifirstService.post('registrasi/save-hasil-satu-visum', save).then(function (e) {
                        // loadData()
                        getDraftPasienSentraVisum()
                        getKoreksiIPasienSentraVisum();
                        getKoreksiIIPasienSentraVisum();
                        getSpesialisPasienSentraVisum()
                        getKaInstalasiPasienSentraVisum()
                        getPrintPasienSentraVisum()
                        getDiserahkanPasienSentraVisum()
                    })
                })
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.buttonsearch = true;
                $scope.item.jeniskekerasan = undefined;
                $scope.item.tgltulis = undefined;
                $scope.item.dokter = undefined;
                $scope.item.dokterkonsultan = undefined;
                $scope.item.nosurat = undefined;
                $scope.item.permintaandari = undefined;
                $scope.item.nosuratpermintaan = undefined;
                $scope.item.tglminta = undefined;
                $scope.item.kllvisum = undefined;
            }
            $scope.saveHasilPemeriksaan2 = function () {
                debugger
                var save = {
                    norec: $scope.dataSelectedVisum.norec_pd,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    jeniskekerasanfk: $scope.item.jeniskekerasan3.id,
                    penulisfk: medifirstService.getPegawaiLogin().id,
                    tgltulis: $scope.item.tgltulis3,
                    dokterfk: $scope.item.dokter3.id,
                    dokterkonsultanfk: $scope.item.dokterkonsultan3.id,
                    nosurat: $scope.item.nosurat3,
                    permintaandari: $scope.item.permintaandari3,
                    nosuratpermintaan: $scope.item.nosuratpermintaan3,
                    riwayatkejadian: $scope.item.riwayat3,
                    hasilpemeriksaan: $scope.item.hasilpemeriksaan3,
                    kesimpulan: $scope.item.kesimpulan3
                }
                $scope.popUpHasilSatuPemeriksaan.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {

                    medifirstService.post('registrasi/save-hasil-dua-visum', save).then(function (e) {
                        // loadData()
                        getDraftPasienSentraVisum()
                        getKoreksiIPasienSentraVisum();
                        getKoreksiIIPasienSentraVisum();
                        getSpesialisPasienSentraVisum()
                        getKaInstalasiPasienSentraVisum()
                        getPrintPasienSentraVisum()
                        getDiserahkanPasienSentraVisum()
                    })
                })
            }
            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"
                ],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };
            $scope.simpanCatatanHasilPemeriksaan = function () {
                var catatan = {
                    norec: $scope.dataSelectedVisum.norec,
                    catatan: $scope.item.catatan,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi
                }
                $scope.popUpCatatanHasilPemeriksaan.close();
                $scope.popUpLihatHasilPemeriksaan.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {

                    medifirstService.post('registrasi/save-catatan-visum', catatan).then(function (e) {
                        // loadData()
                        getDraftPasienSentraVisum()
                        getKoreksiIPasienSentraVisum();
                        getKoreksiIIPasienSentraVisum();
                        getSpesialisPasienSentraVisum()
                        getKaInstalasiPasienSentraVisum()
                        getPrintPasienSentraVisum()
                        getDiserahkanPasienSentraVisum()
                    })
                })
                // $mdDialog.show(!confirm).then(function () {

                //     $scope.popUpCatatanHasilPemeriksaan.center().open();
                //     $scope.$scope.popUpLihatHasilPemeriksaan.center().open();
                // })
            }

            $scope.lihatSpesialis = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return
                }
                // if ($scope.dataSelectedVisum.hasilpemeriksaaniii == null) {
                //     $scope.item.jeniskekerasan7 = {id: $scope.dataSelectedVisum.id, jeniskekerasan: $scope.dataSelectedVisum.jeniskekerasan}
                //     $scope.item.penulis7 = $scope.dataSelectedVisum.penulis
                //     $scope.item.tgltulis7 = $scope.dataSelectedVisum.tgltulis
                //     $scope.item.dokter7 = {id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokter}
                //     $scope.item.dokterkonsultan7 = {id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokterkonsultan}
                //     $scope.item.nosurat7 = $scope.dataSelectedVisum.nosurat
                //     $scope.item.permintaandari7 = $scope.dataSelectedVisum.permintaan
                //     $scope.item.nosuratpermintaan7 = $scope.dataSelectedVisum.nosuratpermintaan
                //     $scope.item.tglminta7 = $scope.dataSelectedVisum.tglpermintaan
                //     $scope.item.hasilpemeriksaan7 = $scope.dataSelectedVisum.kllvisum3
                //     $scope.popUpLihatHasilPemeriksaan3.center().open();
                // } else {
                //     $scope.item.jeniskekerasan7 = {id: $scope.dataSelectedVisum.id, jeniskekerasan: $scope.dataSelectedVisum.jeniskekerasan}
                //     $scope.item.penulis7 = $scope.dataSelectedVisum.penulis
                //     $scope.item.tgltulis7 = $scope.dataSelectedVisum.tgltulis
                //     $scope.item.dokter7 = {id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokter}
                //     $scope.item.dokterkonsultan7 = {id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokterkonsultan}
                //     $scope.item.nosurat7 = $scope.dataSelectedVisum.nosurat
                //     $scope.item.permintaandari7 = $scope.dataSelectedVisum.permintaan
                //     $scope.item.nosuratpermintaan7 = $scope.dataSelectedVisum.nosuratpermintaan
                //     $scope.item.riwayat7 = $scope.dataSelectedVisum.riwayatkejadianiii
                //     $scope.item.hasilpemeriksaan7 = $scope.dataSelectedVisum.hasilpemeriksaaniii
                //     $scope.item.kesimpulan7 = $scope.dataSelectedVisum.kesimpulaniii
                //     $scope.popUpLihatHasilPemeriksaan3.center().open();
                // }
                $scope.item.jeniskekerasan7 = { id: $scope.dataSelectedVisum.id, jeniskekerasan: $scope.dataSelectedVisum.jeniskekerasan }
                $scope.item.penulis7 = $scope.dataSelectedVisum.penulis
                $scope.item.tgltulis7 = $scope.dataSelectedVisum.tgltulis
                $scope.item.dokter7 = { id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokter }
                $scope.item.dokterkonsultan7 = { id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokterkonsultan }
                $scope.item.nosurat7 = $scope.dataSelectedVisum.nosurat
                $scope.item.permintaandari7 = $scope.dataSelectedVisum.permintaan
                $scope.item.nosuratpermintaan7 = $scope.dataSelectedVisum.nosuratpermintaan
                $scope.item.tglminta7 = $scope.dataSelectedVisum.tglpermintaan
                // $scope.item.hasilpemeriksaan7 = $scope.dataSelectedVisum.kllvisum3
                $scope.item.riwayatkejadian4 = $scope.dataSelectedVisum.riwayatkejadianiii
                $scope.item.hasilpemeriksaan4 = $scope.dataSelectedVisum.hasilpemeriksaaniii
                $scope.item.kesimpulan4 = $scope.dataSelectedVisum.kesimpulaniii
                $scope.popUpLihatHasilPemeriksaan3.center().open();
            }
            $scope.previewKoreksiSpesialis = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return;
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 4) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kll-visum-koreksi-spesialis?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 8) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kfd-visum-koreksi-spesialis?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 1 || $scope.dataSelectedVisum.jeniskekerasanfk == 2) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-ksd-visum-koreksi-spesialis?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
            }
            $scope.kiriminstalasi = function () {
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return;
                }
                var save = {
                    norec: $scope.dataSelectedVisum.norec,
                    riwayatkejadian4: $scope.item.riwayatkejadian4,
                    hasilpemeriksaan4: $scope.item.hasilpemeriksaan4,
                    kesimpulan4: $scope.item.kesimpulan4,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    kllvisum: $scope.item.riwayatkejadian4 + $scope.item.hasilpemeriksaan4 + $scope.item.kesimpulan4
                }
                medifirstService.post('registrasi/save-to-ka-instalasi?', save).then(function (dat) {
                    getDraftPasienSentraVisum()
                    getKoreksiIPasienSentraVisum();
                    getKoreksiIIPasienSentraVisum();
                    getSpesialisPasienSentraVisum()
                    getKaInstalasiPasienSentraVisum()
                    getPrintPasienSentraVisum()
                    getDiserahkanPasienSentraVisum()
                    $scope.popUpLihatHasilPemeriksaan3.close();
                })
            }

            $scope.tutupLihatHasil3 = function () {
                $scope.item.jeniskekerasan7 = undefined
                $scope.item.penulis7 = undefined
                $scope.item.tgltulis7 = undefined
                $scope.item.dokter7 = undefined
                $scope.item.dokterkonsultan7 = undefined
                $scope.item.nosurat7 = undefined
                $scope.item.permintaandari7 = undefined
                $scope.item.nosuratpermintaan7 = undefined
                $scope.item.riwayat7 = undefined
                $scope.item.hasilpemeriksaan7 = undefined
                $scope.item.tglminta7 = undefined
                $scope.item.riwayatkejadian4 = undefined
                $scope.item.hasilpemeriksaan4 = undefined
                $scope.item.kesimpulan4 = undefined
                $scope.popUpLihatHasilPemeriksaan3.close();
            }
            $scope.catatanHasilPemeriksaan3 = function () {
                $scope.popUpCatatanHasilPemeriksaan3.center().open();
            }
            $scope.simpanCatatanHasilPemeriksaan3 = function () {
                var catatan = {
                    norec: $scope.dataSelectedVisum.norec,
                    catatan: $scope.item.catatan,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi
                }
                $scope.popUpCatatanHasilPemeriksaan3.close();
                $scope.popUpLihatHasilPemeriksaan3.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {

                    medifirstService.post('registrasi/save-spesialis-visum', catatan).then(function (e) {
                        // loadData()
                        getDraftPasienSentraVisum()
                        getKoreksiIPasienSentraVisum();
                        getKoreksiIIPasienSentraVisum();
                        getSpesialisPasienSentraVisum()
                        getKaInstalasiPasienSentraVisum()
                        getPrintPasienSentraVisum()
                        getDiserahkanPasienSentraVisum()
                    })
                })
                // $mdDialog.show(!confirm).then(function () {

                //     $scope.popUpCatatanHasilPemeriksaan.center().open();
                //     $scope.$scope.popUpLihatHasilPemeriksaan.center().open();
                // })
            }
            $scope.tutupHasilPemeriksaan8 = function () {
                $scope.popUpHasilSpeisalisPemeriksaan8.close()
            }
            $scope.saveHasilPemeriksaan8 = function () {
                debugger
                var save = {
                    norec: $scope.dataSelectedVisum.norec_pd,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    jeniskekerasanfk: $scope.item.jeniskekerasan8.id,
                    penulisfk: medifirstService.getPegawaiLogin().id,
                    tgltulis: $scope.item.tgltulis8,
                    dokterfk: $scope.item.dokter8.id,
                    dokterkonsultanfk: $scope.item.dokterkonsultan8.id,
                    nosurat: $scope.item.nosurat8,
                    permintaandari: $scope.item.permintaandari8,
                    nosuratpermintaan: $scope.item.nosuratpermintaan8,
                    riwayatkejadian: $scope.item.riwayat8,
                    hasilpemeriksaan: $scope.item.hasilpemeriksaan8,
                    kesimpulan: $scope.item.kesimpulan8
                }
                $scope.popUpLihatCatatanSpesialis.close();
                $scope.popUpHasilSpeisalisPemeriksaan8.close()
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {

                    medifirstService.post('registrasi/save-hasil-spesialis-visum', save).then(function (e) {
                        // loadData()
                        getDraftPasienSentraVisum()
                        getKoreksiIPasienSentraVisum();
                        getKoreksiIIPasienSentraVisum();
                        getSpesialisPasienSentraVisum()
                        getKaInstalasiPasienSentraVisum()
                        getPrintPasienSentraVisum()
                        getDiserahkanPasienSentraVisum()
                    })
                })
            }
            $scope.lihatHasilPemeriksaan8 = function () {
                medifirstService.get('registrasi/get-koreksi-i?norec=' + $scope.dataSelectedVisum.norec).then(function (dat) {
                    debugger;
                    $scope.item.catatan8 = dat.data[0].catatanspesialis
                    $scope.popUpLihatCatatanSpesialis.center().open();
                })
            }
            $scope.tutupCatatanHasilPemeriksaanSpesialis = function () {
                $scope.popUpLihatCatatanSpesialis.close();
            }

            $scope.koreksiIToKoreksiSpesialis = function () {
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Pilih Data Dahulu', 'Peringatan !')
                    return;
                }
                // $scope.item.jeniskekerasan2 = {id: $scope.dataSelectedVisum.id, jeniskekerasan: $scope.dataSelectedVisum.jeniskekerasan}
                // $scope.item.penulis2 = $scope.dataSelectedVisum.penulis
                // $scope.item.tgltulis2 = $scope.dataSelectedVisum.tgltulis
                // $scope.item.dokter2 = {id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokter}
                // $scope.item.dokterkonsultan2 = {id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokterkonsultan}
                // $scope.item.nosurat2 = $scope.dataSelectedVisum.nosurat
                // $scope.item.permintaandari2 = $scope.dataSelectedVisum.permintaan
                // $scope.item.nosuratpermintaan2 = $scope.dataSelectedVisum.nosuratpermintaan
                // $scope.item.riwayat2 = $scope.dataSelectedVisum.riwayatkejadiani
                // $scope.item.hasilpemeriksaan2 = $scope.dataSelectedVisum.hasilpemeriksaani
                // $scope.item.kesimpulan2 = $scope.dataSelectedVisum.kesimpulani
                // $scope.item.tglminta2 = $scope.dataSelectedVisum.tglpermintaan
                debugger;
                $scope.popUpLihatHasilPemeriksaan.close();
                var save = {
                    norec: $scope.dataSelectedVisum.norec,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    jeniskekerasanfk: $scope.item.jeniskekerasan2.id,
                    penulisfk: $scope.item.penulis2,
                    tgltulis: $scope.item.tgltulis2,
                    dokterfk: $scope.item.dokter2.id,
                    dokterkonsultanfk: $scope.item.dokterkonsultan2.id,
                    nosurat: $scope.item.nosurat2,
                    permintaandari: $scope.item.permintaandari2,
                    nosuratpermintaan: $scope.item.nosuratpermintaan2,
                    riwayatkejadian: $scope.item.riwayat2,
                    hasilpemeriksaan: $scope.item.hasilpemeriksaan2,
                    kesimpulan: $scope.item.kesimpulan2,
                    tglminta: $scope.item.tglminta2
                }
                medifirstService.post('registrasi/save-koreksi-i-to-spesialis?', save).then(function (dat) {
                    getDraftPasienSentraVisum()
                    getKoreksiIPasienSentraVisum();
                    getKoreksiIIPasienSentraVisum();
                    getSpesialisPasienSentraVisum()
                    getKaInstalasiPasienSentraVisum()
                    getPrintPasienSentraVisum()
                    getDiserahkanPasienSentraVisum()
                })
            }
            $scope.lihatKoreksiInstalasi = function () {
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Pilih Data Dahulu', 'Peringatan !')
                    return;
                }
                medifirstService.get('registrasi/get-draft-visum?noregistrasi=' + $scope.dataSelectedVisum.noregistrasi).then(function (dat) {
                    debugger
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                    if (dat.data[0].dokterkonsultanfk != null) {
                        $scope.pegawaidalam = true;
                        $scope.tambahpegawaidalam = false;
                        $scope.item.konsulen = { id: dat.data[0].dokterkonsultanfk, namalengkap: dat.data[0].dokterkonsultan }
                    }
                    if (dat.data[0].dokterkonsultan2fk != null) {
                        $scope.pegawaidalam2 = true;
                        $scope.tambahpegawaidalam2 = false;
                        $scope.item.konsulen2 = { id: dat.data[0].dokterkonsultan2fk, namalengkap: dat.data[0].dokterkonsultan2 }
                    }
                    if (dat.data[0].dokterkonsultan3fk != null) {
                        $scope.pegawaidalam3 = true;
                        $scope.tambahpegawaidalam3 = false;
                        $scope.item.konsulen3 = { id: dat.data[0].dokterkonsultan3fk, namalengkap: dat.data[0].dokterkonsultan3 }
                    }
                })
                $scope.item.jeniskekerasan9 = { id: $scope.dataSelectedVisum.id, jeniskekerasan: $scope.dataSelectedVisum.jeniskekerasan }
                $scope.item.penulis9 = $scope.dataSelectedVisum.penulis
                $scope.item.tgltulis9 = $scope.dataSelectedVisum.tgltulis
                $scope.item.dokter9 = { id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokter }
                $scope.item.dokterkonsultan9 = { id: $scope.dataSelectedVisum.id, namalengkap: $scope.dataSelectedVisum.dokterkonsultan }
                $scope.item.nosurat9 = $scope.dataSelectedVisum.nosurat
                $scope.item.permintaandari9 = $scope.dataSelectedVisum.permintaan
                $scope.item.nosuratpermintaan9 = $scope.dataSelectedVisum.nosuratpermintaan
                $scope.item.tglminta9 = $scope.dataSelectedVisum.tglpermintaan
                // $scope.item.hasilpemeriksaan9 = $scope.dataSelectedVisum.kllvisum4
                $scope.item.riwayatkejadian5 = $scope.dataSelectedVisum.riwayatkejadianiv
                $scope.item.hasilpemeriksaan5 = $scope.dataSelectedVisum.hasilpemeriksaaniv
                $scope.item.kesimpulan5 = $scope.dataSelectedVisum.kesimpulaniv
                $scope.popUpLihatHasilPemeriksaan4.center().open();
            }
            $scope.tutupLihatHasil4 = function () {
                $scope.item.jeniskekerasan9 = undefined
                $scope.item.penulis9 = undefined
                $scope.item.tgltulis9 = undefined
                $scope.item.dokter9 = undefined
                $scope.item.dokterkonsultan9 = undefined
                $scope.item.nosurat9 = undefined
                $scope.item.permintaandari9 = undefined
                $scope.item.nosuratpermintaan9 = undefined
                $scope.item.riwayat9 = undefined
                $scope.item.hasilpemeriksaan9 = undefined
                $scope.item.tglminta9 = undefined
                $scope.item.riwayatkejadian5 = undefined
                $scope.item.hasilpemeriksaan5 = undefined
                $scope.item.kesimpulan5 = undefined
                $scope.popUpLihatHasilPemeriksaan4.close();
            }
            $scope.previewKoreksiInstalasi = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return;
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 4) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kll-visum-koreksi-instalasi?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 8) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-kfd-visum-koreksi-instalasi?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 1 || $scope.dataSelectedVisum.jeniskekerasanfk == 2) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-ksd-visum-koreksi-instalasi?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
            }
            $scope.kirimprint = function () {
                if ($scope.item.konsulen == undefined) {
                    $scope.item.konsulen = {
                        id: null
                    }
                }
                if ($scope.item.konsulen2 == undefined) {
                    $scope.item.konsulen2 = {
                        id: null
                    }
                }
                if ($scope.item.konsulen3 == undefined) {
                    $scope.item.konsulen3 = {
                        id: null
                    }
                }
                var save = {
                    norec: $scope.dataSelectedVisum.norec,
                    riwayatkejadianprint: $scope.item.riwayatkejadian5,
                    hasilpemeriksaanprint: $scope.item.hasilpemeriksaan5,
                    kesimpulanprint: $scope.item.kesimpulan5,
                    kllvisum: $scope.item.riwayatkejadian5 + $scope.item.hasilpemeriksaan5 + $scope.item.kesimpulan5,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    dokter: $scope.item.dokter9.id,
                    konsultan: $scope.item.konsulen.id,
                    konsultan2: $scope.item.konsulen2.id,
                    konsultan3: $scope.item.konsulen3.id,
                    //penambahan
                    tgltulis: $scope.item.tgltulis9,
                    nosurat: $scope.item.nosurat9,
                    permintaan: $scope.item.permintaandari9,
                    nosuratpermintaan: $scope.item.nosuratpermintaan9,
                    tglsurat: $scope.item.tglminta9,
                }
                medifirstService.post('registrasi/save-to-print-admin', save).then(function (dat) {
                    getDraftPasienSentraVisum()
                    getKoreksiIPasienSentraVisum();
                    getKoreksiIIPasienSentraVisum();
                    getSpesialisPasienSentraVisum()
                    getKaInstalasiPasienSentraVisum()
                    getPrintPasienSentraVisum()
                    getDiserahkanPasienSentraVisum()

                    $scope.item.konsulen = undefined
                    $scope.item.konsulen2 = undefined
                    $scope.item.konsulen3 = undefined
                    $scope.popUpLihatHasilPemeriksaan4.close();
                })
            }
            $scope.cetakBlade = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return;
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 4) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-visum?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 8) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-visum-kfd?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
                if ($scope.dataSelectedVisum.jeniskekerasanfk == 1 || $scope.dataSelectedVisum.jeniskekerasanfk == 2) {
                    if ($scope.dataSelectedVisum.noregistrasi != '') {
                        var local = JSON.parse(localStorage.getItem('profile'))
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-visum-ksd?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi + '&kdprofile=' + profile +
                                '&jenis=his', '_blank');
                        }
                    }
                }
            }
            $scope.cetakHasilPemeriksaan = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return
                    //moment($scope.now).format('YYYY-MM-DD 00:00');
                }
                medifirstService.get('registrasi/get-angka-titik?variabel=namapasien')
                var arr = $scope.dataSelectedVisum.namapasien
                var temp11 = '';
                temp11 = arr.length;
                medifirstService.get('registrasi/get-angka-titik?variabel=namapasien' + "&length=" + temp11).then(function (dat) {
                    debugger
                    var temp = '';
                    if (dat.data.length > 0) {
                        temp = parseInt(dat.data[0].angka)
                    } else {
                        temp = 40
                    }

                    // debugger
                    medifirstService.get('registrasi/get-detail-pasien-sentra-visum?norec=' + $scope.dataSelectedVisum.norec_pd).then(function (dat) {
                        debugger;
                        var ea = dat.data[0]

                        var arrriwayat = ea.riwayatkejadianprint
                        var tempriwayat = '';
                        if (arrriwayat.length >= 390) {
                            tempriwayat = 143
                        } else {
                            tempriwayat = 140
                        }

                        var arrhasil = ea.hasilpemeriksaanprint
                        var temphasil = '';
                        if (arrhasil.length >= 830) {
                            temphasil = 143
                        } else {
                            temphasil = 140
                        }

                        var arrkesimpulan = ea.kesimpulanprint
                        var tempkesimpulan = '';
                        if (arrkesimpulan.length >= 510) {
                            tempkesimpulan = 133
                        } else {
                            tempkesimpulan = 130
                        }
                        var konsultan = ''
                        if (ea.dokterkonsultan != null && ea.dokterkonsultan2 == null && ea.dokterkonsultan3 == null) {
                            konsultan = " dan diketahui oleh " + ea.dokterkonsultan + ", sebagai konsultan forensik, "
                        }
                        if (ea.dokterkonsultan != null && ea.dokterkonsultan2 != null && ea.dokterkonsultan3 == null) {
                            konsultan = " dan diketahui oleh " + ea.dokterkonsultan + ", " + ea.dokterkonsultan2 + ", sebagai konsultan forensik, "
                        }
                        if (ea.dokterkonsultan != null && ea.dokterkonsultan2 != null && ea.dokterkonsultan3 != null) {
                            konsultan = " dan diketahui oleh " + ea.dokterkonsultan + ", " + ea.dokterkonsultan2 + ", " + ea.dokterkonsultan3 + ", sebagai konsultan forensik, "
                        }
                        var tanggal = moment(ea.tglpermintaan).add(-1, 'day').format('YYYY-MM-DD HH:mm:ss');
                        var tglpermintaan = ''
                        var tglnow = ''
                        var tglsekarang = "Jakarta, " + moment($scope.now).format('DD-MM-YYYY');
                        medifirstService.get("registrasi/git-tinggil-hirif?tanggal=" + tanggal).then(function (dat) {
                            debugger;
                            tglpermintaan = dat.data.tglpermintaan;
                            tglnow = dat.data.tglsekarang;




                            var title = ''
                            //Title KFD
                            if ($scope.dataSelectedVisum.jeniskekerasanfk == '8') {
                                title = "Saya yang bertanda tangan di bawah ini " + ea.dokter + ", dokter di Rumah Sakit Bhayangkara Tk. I. R. Said Sukanto" + konsultan +
                                    " berdasarkan permintaan tertulis dari " + ea.permintaan + " dengan surat nomor " + ea.nosuratpermintaan + " tertanggal " + tglpermintaan +
                                    " mengenai permintaan visum tersebut diatas, maka dengan ini menerangkan bahwa pada tanggal " + tglnow + " Waktu Indonesia bagian Barat, bertempat di Ruang Sentra Visum dan Medikolegal " +
                                    "Rumah Sakit Bhayangkara TK. I R Said Sukanto telah melakukan pemeriksaan seorang korban yang menurut surat permintaan visum tersebut adalah"
                                //Title KDRT dan Seksual
                            } else if ($scope.dataSelectedVisum.jeniskekerasanfk == '2' || $scope.dataSelectedVisum.jeniskekerasanfk == '1') {
                                title = "Saya yang bertanda tangan di bawah ini " + ea.dokter + ", dokter di Rumah Sakit Bhayangkara Tk. I. R. Said Sukanto" + konsultan +
                                    " berdasarkan permintaan tertulis dari " + ea.permintaan + " dengan surat nomor " + ea.nosuratpermintaan + " tertanggal " + tglpermintaan +
                                    " mengenai permintaan visum tersebut diatas, maka dengan ini menerangkan bahwa pada tanggal " + tglnow + " Waktu Indonesia bagian Barat, bertempat di Ruang Pemeriksaan Pusat Pelayanan Perempuan dan Anak Terpadu " +
                                    "Rumah Sakit Bhayangkara TK. I R Said Sukanto telah melakukan pemeriksaan seorang korban yang menurut surat permintaan visum tersebut adalah"
                                //Title KLL
                            } else if ($scope.dataSelectedVisum.jeniskekerasanfk == '4') {
                                title = "Saya yang bertanda tangan di bawah ini " + ea.dokter + ", dokter di Rumah Sakit Bhayangkara Tk. I. R. Said Sukanto" + konsultan +
                                    " berdasarkan permintaan tertulis dari " + ea.permintaan + " dengan surat nomor " + ea.nosuratpermintaan + " tertanggal " + tglpermintaan +
                                    " mengenai permintaan visum tersebut diatas, maka dengan ini menerangkan bahwa pada tanggal " + tglnow + " Waktu Indonesia bagian Barat, bertempat di Ruang Pemeriksaan Pusat Pelayanan Terpadu " +
                                    "Rumah Sakit Bhayangkara TK. I R Said Sukanto telah melakukan pemeriksaan seorang korban yang menurut surat permintaan visum tersebut adalah"
                            } else {

                            }
                            debugger
                            var arrtitle = title
                            var temptitle = '';
                            if (arrtitle.length >= 695) {
                                temptitle = 115
                            } else if (arrtitle.length >= 690) {
                                temptitle = 118
                            } else if (arrtitle.length >= 685) {
                                temptitle = 122
                            } else if (arrtitle.length >= 680) {
                                temptitle = 125
                            } else if (arrtitle.length >= 675) {
                                temptitle = 128
                            }
                            // else if (arrtitle.length >= 660) {
                            //     temptitle = 125
                            // }  else if (arrtitle.length >= 655) {
                            //     temptitle = 80
                            // } else if (arrtitle.length >= 652) {
                            //     temptitle = 2
                            // } else if (arrtitle.length == 651) {
                            //     temptitle = 7
                            // } 
                            else {
                                temptitle = 110
                            }
                            var qrcode = ''
                            qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-visum-new?noregistrasi=" + $scope.dataSelectedVisum.noregistrasi;
                            // if ($scope.dataSelectedVisum.jeniskekerasanfk == '8') {
                            //     qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-visum-kfd?noregistrasi="+$scope.dataSelectedVisum.noregistrasi;
                            // } else if ($scope.dataSelectedVisum.jeniskekerasanfk == '2' || $scope.dataSelectedVisum.jeniskekerasanfk == '1') {
                            //     qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-visum-ksd?noregistrasi="+$scope.dataSelectedVisum.noregistrasi;
                            // } else if ($scope.dataSelectedVisum.jeniskekerasanfk == '4') {
                            //     qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-visum?noregistrasi="+$scope.dataSelectedVisum.noregistrasi;
                            // } else {

                            // }
                            debugger;
                            var data = {
                                "gambarLogo": "Lambang_Polri.png",
                                "paramKey": ["title", "noregistrasi", "tglsekarang", "qrcode", "int", "temptitle", "tempriwayat", "temphasil", "tempkesimpulan"], //,"int"
                                "paramValue": [title, $scope.dataSelectedVisum.noregistrasi, tglsekarang, qrcode, temp, temptitle, tempriwayat, temphasil, tempkesimpulan], //,temp
                                "paramType": ["", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                            };
                            // var data = {
                            //     "gambarLogo": "Lambang_Polri.png",
                            //     "paramKey": ["contohTitik","contohLagi"],
                            //     "paramValue": ["TES ASU", "TES WOI TESSS"],
                            //     "paramType" : ["",""] // "paramType" : ["","date"] selain date, isinya kosong saja
                            // };
                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
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

                                    debugger;
                                    var save = {
                                        norec: $scope.dataSelectedVisum.norec_pd,
                                        noregistrasi: $scope.dataSelectedVisum.noregistrasi
                                    }
                                    medifirstService.post('registrasi/save-to-diserahkan', save).then(function (dat) {
                                        getDraftPasienSentraVisum()
                                        getKoreksiIPasienSentraVisum();
                                        getKoreksiIIPasienSentraVisum();
                                        getSpesialisPasienSentraVisum()
                                        getKaInstalasiPasienSentraVisum()
                                        getPrintPasienSentraVisum()
                                        getDiserahkanPasienSentraVisum()
                                    })
                                }
                            }
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1002/generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1002/generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.0.624') > -1) {
                                xhr.open('POST', 'http://192.168.0.624:1002/generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('127.0.0.1') > -1) {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                                xhr.open('POST', 'http://36.92.186.59:1002/generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                                xhr.open('POST', 'http://103.93.237.70:1002/generic/report/visum2.pdf');
                            } else if (window.location.hostname.indexOf('172.10.3.68') > -1) {
                                xhr.open('POST', 'http://172.10.3.68:8797/generic/report/visum2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/visum2.pdf');
                            }
                            // set `Content-Type` header
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                            xhr.responseType = 'blob';
                            // send rquest with JSON payload
                            xhr.send(JSON.stringify(data));
                        })
                    })
                })
            }
            $scope.statusambil = function (dataItem) {
                debugger;
                if (dataItem.statusambil == "Belum Diambil") {
                    $scope.item.nosurat11 = dataItem.nosurat
                    $scope.item.norec_pd11 = dataItem.norec_pd
                    $scope.item.noregistrasi11 = dataItem.noregistrasi
                    $scope.item.tgldiambil11 = moment($scope.now).format('YYYY-MM-DD HH:mm');
                    $scope.popUpAmbilSurat.center().open();
                } else {
                    alert('Hehe')
                    return
                }
            }
            $scope.tutupambilsurat = function () {
                $scope.item.nosurat11 = undefined
                $scope.item.penerima11 = undefined
                $scope.item.pemberisurat11 = undefined
                $scope.item.tgldiambil11 = undefined

                $scope.popUpAmbilSurat.close();
            }
            $scope.simpanambilsurat = function () {
                var save = {
                    norec: $scope.item.norec_pd11,
                    noregistrasi: $scope.item.noregistrasi11,
                    penerima: $scope.item.penerima11,
                    pemberi: $scope.item.pemberisurat11.id,
                    tgldiambil: $scope.item.tgldiambil11
                }
                medifirstService.post('registrasi/save-data-diserahkan', save).then(function (dat) {
                    $scope.item.nosurat11 = undefined
                    $scope.item.penerima11 = undefined
                    $scope.item.pemberisurat11 = undefined
                    $scope.item.tgldiambil11 = undefined
                    $scope.popUpAmbilSurat.close();
                    getDraftPasienSentraVisum()
                    getKoreksiIPasienSentraVisum();
                    getKoreksiIIPasienSentraVisum();
                    getSpesialisPasienSentraVisum()
                    getKaInstalasiPasienSentraVisum()
                    getPrintPasienSentraVisum()
                    getDiserahkanPasienSentraVisum()

                })
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.cetakBuktiAmbil = function () {
                debugger
                if ($scope.dataSelectedVisum.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return
                }
                if ($scope.dataSelectedVisum.penerima == null) {
                    toastr.error('Data Pengambilan Belum Diisi !', 'Peringatan !')
                    return
                }
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norec_pd"],
                    "paramValue": [$scope.dataSelectedVisum.norec_pd],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
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
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/buktiambil.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/buktiambil.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/buktiambil.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/buktiambil.pdf');
                } else if (window.location.hostname.indexOf('192.168.0.624') > -1) {
                    xhr.open('POST', 'http://192.168.0.624:8797/generic/report/buktiambil.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/buktiambil.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.saveDraft = function () {
                if ($scope.item.konsulen == undefined) {
                    $scope.item.konsulen = {
                        id: null
                    }
                }
                if ($scope.item.konsulen2 == undefined) {
                    $scope.item.konsulen2 = {
                        id: null
                    }
                }
                if ($scope.item.konsulen3 == undefined) {
                    $scope.item.konsulen3 = {
                        id: null
                    }
                }
                var save = {
                    norec: $scope.dataSelectedVisum.norec_pd,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    jeniskekerasanfk: $scope.item.jeniskekerasan.id,
                    penulisfk: medifirstService.getPegawaiLogin().id,
                    tgltulis: $scope.item.tgltulis,
                    dokterfk: $scope.item.dokter.id,
                    dokterkonsultanfk: $scope.item.konsulen.id,
                    dokterkonsultan2fk: $scope.item.konsulen2.id,
                    dokterkonsultan3fk: $scope.item.konsulen3.id,
                    nosurat: $scope.item.nosurat,
                    permintaandari: $scope.item.permintaandari,
                    nosuratpermintaan: $scope.item.nosuratpermintaan,
                    tglminta: moment($scope.item.tglminta).format('YYYY-MM-DD HH:mm:ss'),
                    // draft: $scope.item.kllvisum
                    draftriwayatkejadian: $scope.item.riwayatkejadian,
                    drafthasilpemeriksaan: $scope.item.hasilpemeriksaan,
                    draftkesimpulan: $scope.item.kesimpulan
                }
                $scope.popUpHasilPemeriksaan.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ke Draft ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {

                    medifirstService.post('registrasi/save-draft-visum', save).then(function (e) {
                        // loadData()
                        getDraftPasienSentraVisum()
                        getKoreksiIPasienSentraVisum();
                        getKoreksiIIPasienSentraVisum();
                        getSpesialisPasienSentraVisum()
                        getKaInstalasiPasienSentraVisum()
                        getPrintPasienSentraVisum()
                        getDiserahkanPasienSentraVisum()
                    })
                })
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.buttonsearch = true;
                $scope.item.jeniskekerasan = undefined;
                $scope.item.tgltulis = undefined;
                $scope.item.dokter = undefined;
                $scope.item.dokterkonsultan = undefined;
                $scope.item.nosurat = undefined;
                $scope.item.permintaandari = undefined;
                $scope.item.nosuratpermintaan = undefined;
                $scope.item.tglminta = undefined;
                $scope.item.kllvisum = undefined;
            }
            $scope.Catatan = function () {
                $scope.item.catatan44 = $scope.dataSelectedVisum.catatan
                $scope.popUpCatatan.center().open();
            }
            $scope.keluarCatatan = function () {
                $scope.item.catatan44 = undefined
                $scope.popUpCatatan.close()
            }
            $scope.simpanCatatan = function () {
                debugger
                var save = {
                    norec: $scope.dataSelectedVisum.norec,
                    catatan: $scope.item.catatan44,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi
                }
                medifirstService.post('registrasi/save-catatan', save).then(function (e) {
                    $scope.popUpCatatan.close()
                })
            }
            $scope.lihatCatatan2 = function () {
                lihatCatatan()
                $scope.popUpLihatCatatan.center().open()
            }

            function lihatCatatan() {
                medifirstService.get('registrasi/get-catatan-visum?norec=' + $scope.dataSelectedVisum.norec).then(function (dat) {
                    $scope.item.catatan45 = dat.data[0].catatan
                })
            }
            $scope.keluarCatatan2 = function () {
                $scope.item.catatan45 = undefined
                $scope.popUpLihatCatatan.close()
            }
        }
    ])
})