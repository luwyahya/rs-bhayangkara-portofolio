define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarInformasiPasienDalamPerawatanCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('cachePerawatan');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00');
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function loadCombo() {
                medifirstService.get("humas/get-daftar-combo", false).then(function (data) {
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listRuangan = data.data.ruangan;
                })
            }

            function init() {
                $scope.isRouteLoading = true;
                var tglAwal = "&tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokPasien.id
                }
                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noregistrasi=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    var rm = "&nocm=" + $scope.item.noMr
                }
                var nm = ""
                if ($scope.item.namaPasien != undefined) {
                    var nm = "&namapasien=" + $scope.item.namaPasien
                }

                medifirstService.get("humas/get-data-informasi-pasien-dalam-perawatan?" +
                    tglAwal + tglAkhir + rg + rm + reg + kp + nm, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';

                            if (parseFloat(dat.data.data[i].totalkabeh) > 50000000) {
                                dat.data.data[i].myStyle = { 'background-color': '#FF0000', 'color': '#F0FFFF' };
                            }
                            dat.data.data[i].total = parseFloat(dat.data.data[i].total) +
                                parseFloat(dat.data.data[i].biayaadmin) + parseFloat(dat.data.data[i].biayamaterai)
                            dat.data.data[i].diskon = parseFloat(dat.data.data[i].diskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            dat.data.data[i].deposit = parseFloat(dat.data.data[i].deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            dat.data.data[i].totalkabeh = parseFloat(dat.data.data[i].totalkabeh).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            dat.data.data[i].total = parseFloat(dat.data.data[i].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

                        }

                        var data = dat.data.data
                        $scope.listDataPasien = new kendo.data.DataSource({
                            data: data
                        });
                        $scope.listDataPasien.fetch(function (e) {
                            var temp = [];
                            for (var key in this._data) {
                                if (this._data.hasOwnProperty(key)) {
                                    var element = this._data[key];
                                    if (angular.isFunction(element) === false && key !== "_events" && key !== "length")
                                        temp.push(element);
                                }
                            }
                            $scope.listPasien = temp;
                            cacheHelper.set('tempData', temp);
                        });
                    });

            }

            $scope.cariFilter = function () {
                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                }
                cacheHelper.set('cachePerawatan', chacePeriode);
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }
/////////////////////////////////////////////////////////////////////       END         ///////////////////////////////////////////////////////
        }
    ]);
});
