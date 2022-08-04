define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPiutangKasirCtrl', ['CacheHelper', '$state', '$scope', '$mdDialog', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $state, $scope, $mdDialog, dateHelper, medifirstService) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataPasienSelected = {};
            showButton();
            FormLoad();
            loadData();

            function FormLoad() {
                //GET DATA RUANGAN
                var chacePeriode = cacheHelper.get('DaftarPiutangKasir');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split(':');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                }

                medifirstService.get('kasir/get-data-combo-kasir').then(function (dat) {
                    $scope.listPenjamin = dat.data.kelompokpasien;
                    $scope.listRuangan = dat.data.ruangan
                });
            }

            function showButton() {
                $scope.showBtnBayarTagihan = true;
                $scope.showBtnTutup = true;
            }

            function loadData() {
                //FITER
                var tglAwal1 = dateHelper.formatDate($scope.item.periodeAwal, "YYYY-MM-DD");
                var tglAkhir1 = dateHelper.formatDate($scope.item.periodeAkhir, "YYYY-MM-DD");
                var nm = "&namaPasien=" + $scope.item.nama;
                if ($scope.item.nama == undefined) {
                    var nm = "";
                };
                var noReg = "";
                if ($scope.item.noRegistrasi != undefined) {
                    var noReg = "&noregistrasi=" + $scope.item.noRegistrasi;
                };
                var pj = "";
                if ($scope.item.penjamin != undefined) {
                    var pj = "&penjaminID=" + $scope.item.penjamin.id;
                };
                var rg = "";
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruanganId=" + $scope.item.ruangan.id;
                };
                // debugger;   
                medifirstService.get("kasir/daftar-piutang-layanan?" +
                    "tglAwal=" + tglAwal1 +
                    "&tglAkhir=" + tglAkhir1 +
                    nm +
                    pj +
                    noReg +
                    rg).then(function (data) {
                        $scope.dataSource = data;
                        for (var x = 0; x < $scope.dataSource.data.length; x++) {
                            var element = $scope.dataSource.data[x];
                            element.sisaBayar = element.totalBilling - element.totalKlaim - element.totalBayar - element.deposit
                        }
                        for (var i = 0; i < data.length; i++) {
                            Things[i]
                        }


                    });
                var chacePeriode = tglAwal1 + ":" + tglAkhir1;
                cacheHelper.set('DaftarPiutangKasir', chacePeriode);

            };

            $scope.formatTanggal = function (tanggal) {
                if (tanggal != "null") {
                    return moment(tanggal).format('DD-MMM-YYYY');
                } else {
                    return "-";
                }
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
            }

            $scope.columnDaftarPiutang = [{
                "field": "tglTransaksi",
                "title": "Tanggal Masuk",
                "width": "50px",
                "template": "<span class='style-left'>{{formatTanggal('#: tglTransaksi #')}}</span>"
            },
            {
                "field": "umur",
                "title": "Umur Piutang",
                "template": "<span class='style-left'>{{('#: umur #')}}</span>",
                "width": "100px"
            },
            {
                "field": "noRegistrasi",
                "title": "No Registrasi",
                "width": "50px"
            },
            {
                "field": "namaPasien",
                "title": "Nama Pasien",
                "width": "150px"
            },
            {
                "field": "ruangan",
                "title": "Ruangan",
                "width": "150px"
            },
            {
                "field": "jenisPasien",
                "title": "Nama Penjamin",
                "width": "100px"
            },
            {
                "field": "totalBilling",
                "title": "Total Tagihan",
                "template": "<span class='style-right'>{{formatRupiah('#: totalBilling #', 'Rp.')}}</span>",
                "width": "100px"
            },
            {
                "field": "totalBayar",
                "title": "Total Bayar",
                "template": "<span class='style-right'>{{formatRupiah('#: totalBayar #', 'Rp.')}}</span>",
                "width": "100px"
            },
            {
                "field": "sisaBayar",
                "title": "Sisa",
                "template": "<span class='style-right'>{{formatRupiah('#: sisaBayar #', 'Rp.')}}</span>",
                "width": "100px"
            },
            {
                "field": "status",
                "title": "Status",
                "width": "100px"
            }
            ];

            $scope.mainGridOptions = {
                pageable: true,
                sortable: true,
                columns: $scope.columnDaftarPiutang,
                editable: "popup",
                selectable: "row",
                scrollable: false
            };

            $scope.BayarTagihan = function () {
                $state.go('PembayaranPiutangPasien', {
                    /*noCM: $scope.noCM,
                    tanggal: $state.params.TglRegistrasi*/
                });
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.periodeAwal = $scope.now;
                $scope.item.periodeAkhir = $scope.now;
                $scope.item.penjamin = { namaExternal: "" };
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                var namaAtauNoReg = undefinedChecker($scope.item.nama);
                var idPenjamin = undefinedCheckerObject($scope.item.penjamin);
                var idRuangan = undefinedCheckerObject($scope.item.ruangan);
                init(namaAtauNoReg, idPenjamin, tglAwal, tglAkhir, idRuangan);
            }

            $scope.cariData = function () {
                loadData()
            }

            function undefinedCheckerObject(data) {
                var temp = "";

                if (!_.isUndefined(data)) {
                    temp = data.id;
                }
                return temp;
            }

            //PENGECEKAN UNTUK DATA/PARAMETER KOSONG
            function undefinedChecker(data) {
                var temp = "";

                if (!_.isUndefined(data)) {
                    temp = data;
                }
                return temp;
            }

            $scope.klik = function (current) {

                $scope.current = current;
                $scope.item.norecSPP = current.norecSPP;
            };

            $scope.bayarTagihan = function () {
                $scope.changePage("PembayaranPiutangPasien");
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.DetailBiaya = function () {
                $scope.changePage("DetailTagihanKasir");
            }

            $scope.changePage = function (stateName) {
                if ($scope.dataPasienSelected.noRec != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noRec
                    }

                    $state.go(stateName, {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    var alertDialog = medifirstService.showAlertDialog("Informasi",
                        "Silahkan pilih data pasien terlebih dahulu", "Ok");

                    $mdDialog.show(alertDialog).then(function () {

                    });
                }
            }
            //////////////////////////////////      END     //////////////////////////////////////////
        }
    ]);
});