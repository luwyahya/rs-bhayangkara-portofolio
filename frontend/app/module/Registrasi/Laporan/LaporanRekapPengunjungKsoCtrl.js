define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapPengunjungKsoCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.model = {};
            var TempDatax = [];
            var dataall = [];
            var details = [];
            var tempdata = [];
            var detailsx = [];
            var datax = {};
            var data2 = [];
            $scope.isRuanganRJ = true
            $scope.PilihManual1 = true
            $scope.PilihManual2 = true
            // $scope.PilihManual3 = true
            $scope.PilihManual4 = true
            $scope.PilihManual5 = true
            $scope.model.cekpilihManual = undefined
            $scope.model.cekpilihManual2 = undefined
            // $scope.model.cekPilihManual3 = undefined
            $scope.model.cekPilihManual4 = undefined
            $scope.model.cekPilihManual5 = undefined
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tahun = $scope.now.getFullYear();
            $scope.listbulan = [
                { id: 1, mm: '01', name: 'Januari' },
                { id: 2, mm: '02', name: 'Februari' },
                { id: 3, mm: '03', name: 'Maret' },
                { id: 4, mm: '04', name: 'April' },
                { id: 5, mm: '05', name: 'Mei' },
                { id: 6, mm: '06', name: 'Juni' },
                { id: 7, mm: '07', name: 'Juli' },
                { id: 8, mm: '08', name: 'Agustus' },
                { id: 9, mm: '09', name: 'September' },
                { id: 10, mm: '10', name: 'Oktober' },
                { id: 11, mm: '11', name: 'November' },
                { id: 12, mm: '12', name: 'Desember' }
            ]

            $scope.CariLapPasienPulang = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }
            $scope.CariKso = function () {
                $scope.isRouteLoading = true;
                LoadDataMonitoring()
            }
            $scope.CariKso2 = function () {
                $scope.isRouteLoading = true;
                LoadDataMonitoring2()
            }
            function LoadDataMonitoring2() {
                var lengthakhir = new Date($scope.item.tahun, $scope.item.bulan.mm, 0).getDate();
                var tglAwal = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-01 ' + '00:00';
                debugger;
                if ($scope.item.tahun == "2021" && $scope.item.bulan.mm == '02') {
                    var tglAwal = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-19 ' + '00:00';
                }
                var tglAkhir = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-' + lengthakhir + ' 23:59';
                data2 = [];
                medifirstService.get("registrasi/laporan/get-Laporan-Monitoring-Klaim?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir).then(function (data) {
                        debugger;
                        tempdata = data.data.data;
                        datax.namaRuangan = tempdata;
                        $scope.isRouteLoading = false;
                        data2.push(datax);
                        detailsx = data2;
                        $scope.dataMonitoring2 = {
                            data: tempdata,
                            pageSize: 10,
                            total: tempdata.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                            aggregate: [
                                { field: 'tarifRS', aggregate: 'sum' },
                                { field: 'diabayarbpjs', aggregate: 'sum' },
                                { field: 'topup', aggregate: 'sum' },
                                { field: 'tarifPending', aggregate: 'sum' },
                                { field: 'dataTidakDiklaim', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }

            function LoadDataMonitoring() {
                var lengthakhir = new Date($scope.item.tahun, $scope.item.bulan.mm, 0).getDate();
                var tglAwal = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-01 ' + '00:00';
                debugger;
                if ($scope.item.tahun == "2021" && $scope.item.bulan.mm == '02') {
                    var tglAwal = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-19 ' + '00:00';
                }
                var tglAkhir = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-' + lengthakhir + ' 23:59';
                data2 = [];
                medifirstService.get("registrasi/laporan/get-ksononbpjs?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir).then(function (data) {
                        debugger;
                        tempdata = data.data.data;
                        datax.dataKsoCSRFix = tempdata[0].dataKsoCSRFix;
                        datax.ksotagihanri = tempdata[0].ksotagihanri;
                        datax.ksotagihan = tempdata[0].ksotagihan;
                        datax.ksocsrri = tempdata[0].ksocsrri;
                        datax.ksocsr = tempdata[0].ksocsr;
                        datax.ksoumum = tempdata[0].ksoumum;
                        datax.ksoumumri = tempdata[0].ksoumumri;
                        datax.dataKsoTagihanFix = tempdata[0].dataKsoTagihanFix;
                        datax.dataKsoTagihanriFix = tempdata[0].dataKsoTagihanriFix;
                        datax.dataKsoCSRriFix = tempdata[0].dataKsoCSRriFix;
                        datax.dataKsoCSRFix = tempdata[0].dataKsoCSRFix;
                        datax.dataKsoUmumFix = tempdata[0].dataKsoUmumFix;
                        datax.dataKsoUmumriFix = tempdata[0].dataKsoUmumriFix;
                        // data2.push(datax);
                        medifirstService.get("registrasi/laporan/get-kso?" +
                            "tglAwal=" + tglAwal +
                            "&tglAkhir=" + tglAkhir).then(function (data) {
                                tempdata = data.data.data;
                                datax.ksorj = tempdata[0].ksorj;
                                datax.ksori = tempdata[0].ksori;
                                datax.dataKsoRIFix = tempdata[0].dataKsoRIFix;
                                datax.dataKsoRJFix = tempdata[0].dataKsoRJFix;
                                datax.countdataKlaimRJ10Murni = tempdata[0].countdataKlaimRJ10Murni;
                                datax.dataKlaimRJ10Murni = tempdata[0].dataKlaimRJ10Murni;
                                datax.countdataBandingkanKSORJMurniTidakAda = tempdata[0].countdataBandingkanKSORJMurniTidakAda;
                                datax.dataBandingkanKSORJMurniTidakAda = tempdata[0].dataBandingkanKSORJMurniTidakAda;
                                datax.countdataKlaimRI10Murni = tempdata[0].countdataKlaimRI10Murni;
                                datax.dataKlaimRI10Murni = tempdata[0].dataKlaimRI10Murni;
                                datax.countdataBandingkanKSORIMurniTidakAda = tempdata[0].countdataBandingkanKSORIMurniTidakAda;
                                datax.dataBandingkanKSORIMurniTidakAda = tempdata[0].dataBandingkanKSORIMurniTidakAda;
                                datax.cekSelisihRJ = tempdata[0].cekSelisihRJ;
                                datax.countcekSelisihRJ = tempdata[0].countcekSelisihRJ;
                                datax.cekSelisihRJTidakAda = tempdata[0].cekSelisihRJTidakAda;
                                datax.countcekSelisihRJTidakAda = tempdata[0].countcekSelisihRJTidakAda;
                                datax.cekSelisihRI = tempdata[0].cekSelisihRI;
                                datax.countcekSelisihRI = tempdata[0].countcekSelisihRI;
                                datax.cekSelisihRITidakAda = tempdata[0].cekSelisihRITidakAda;
                                datax.countcekSelisihRITidakAda = tempdata[0].countcekSelisihRITidakAda;
                                data2.push(datax);

                                $scope.isRouteLoading = false;
                                detailsx = data2;
                                $scope.dataMonitoring = {
                                    data: data2,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    },
                                    aggregate: [
                                        // { field: 'jmlPasienBaru', aggregate: 'sum' },
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienTagihanRj = {
                                    data: data2[0].dataKsoTagihanFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienTagihanRi = {
                                    data: data2[0].dataKsoTagihanriFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienCsrRj = {
                                    data: data2[0].dataKsoCSRFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienCsrRi = {
                                    data: data2[0].dataKsoCSRriFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienUmumRj = {
                                    data: data2[0].dataKsoUmumFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienUmumRi = {
                                    data: data2[0].dataKsoUmumriFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKso = {
                                    data: data2[0].dataKsoRJFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKso2 = {
                                    data: data2[0].dataKsoRIFix,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKlaimRj = {
                                    data: data2[0].dataKlaimRJ10,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKlaimRi = {
                                    data: data2[0].dataKlaimRI10,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienPendingRj = {
                                    data: data2[0].dataPendingRJ10,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienPendingRi = {
                                    data: data2[0].dataPendingRI10,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasiendataBandingkanKSOPraud = {
                                    data: data2[0].dataBandingkanKSOPraud,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasiendataBandingkanKSOPraudRI = {
                                    data: data2[0].dataBandingkanKSOPraudRI,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasiendataBandingkanKSOPraudTidakAda = {
                                    data: data2[0].dataBandingkanKSOPraudTidakAda,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasiendataBandingkanKSOPraudTidakAdaRI = {
                                    data: data2[0].dataBandingkanKSOPraudTidakAdaRI,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKlaimRjAda = {
                                    data: data2[0].dataKlaimRJ10Murni,
                                    pageSize: 100,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKlaimRjAda2 = {
                                    data: data2[0].dataBandingkanKSORJMurniTidakAda,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasiencekSelisihRJ = {
                                    data: data2[0].cekSelisihRJTidakAda,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasiencekSelisihRI = {
                                    data: data2[0].cekSelisihRITidakAda,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKlaimRiAda = {
                                    data: data2[0].dataKlaimRI10Murni,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                $scope.dataPasienKlaimRiTidakAda = {
                                    data: data2[0].dataBandingkanKSORIMurniTidakAda,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {

                                            }
                                        }
                                    },
                                    aggregate: [

                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                            })
                    })

            }
            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.PilihManual2 = false
                    $scope.PilihManual5 = false
                    // $scope.PilihManual3 = false
                    $scope.PilihManual4 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.isRuanganRJ = true
                    $scope.PilihManual2 = true
                    $scope.PilihManual5 = true
                    // $scope.PilihManual3 = true
                    $scope.PilihManual4 = true
                }
            }
            $scope.ceklispilihManual2 = function (bool) {
                if (bool) {
                    $scope.PilihManual1 = false
                    // $scope.PilihManual3 = false
                    $scope.PilihManual4 = false
                    $scope.PilihManual5 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.isRuanganRJ = true
                    $scope.PilihManual1 = true
                    $scope.PilihManual5 = true
                    // $scope.PilihManual3 = true
                    $scope.PilihManual4 = true
                }
            }
            // $scope.ceklispilihManual3 = function (bool) {
            //     
            //     if (bool) {
            //         $scope.PilihManual1 = false
            //         $scope.PilihManual2 = false
            //         $scope.PilihManual4 = false
            //         $scope.isRuanganRJ = false
            //         $scope.item.ruangan = undefined
            //         $scope.item.departement = undefined
            //     } else {
            //         $scope.PilihManual1 = true
            //         $scope.PilihManual2 = true
            //         $scope.isRuanganRJ = true
            //         $scope.PilihManual4 = true
            //     }
            // }
            $scope.ceklispilihManual4 = function (bool) {

                if (bool) {
                    $scope.PilihManual1 = false
                    $scope.PilihManual2 = false
                    $scope.PilihManual5 = false
                    // $scope.PilihManual3 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.PilihManual1 = true
                    $scope.PilihManual2 = true
                    $scope.PilihManual5 = true
                    // $scope.PilihManual3 = true
                    $scope.isRuanganRJ = true
                }
            }
            $scope.ceklispilihManual5 = function (bool) {

                if (bool) {
                    $scope.PilihManual1 = false
                    $scope.PilihManual2 = false
                    $scope.PilihManual4 = false
                    // $scope.PilihManual3 = false
                    $scope.isRuanganRJ = false
                    $scope.item.ruangan = undefined
                    $scope.item.departement = undefined
                } else {
                    $scope.PilihManual1 = true
                    $scope.PilihManual2 = true
                    $scope.PilihManual4 = true
                    // $scope.PilihManual3 = true
                    $scope.isRuanganRJ = true
                }
            }

            function LoadData() {
                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }
                // var isRJ = "";
                // if($scope.isRuanganRJ==false){
                //     isRJ="&isRJ=" + true
                // }
                // var isRJ2 = "";
                // if ($scope.isRuanganRJ == true) {
                //     isRJ2 = "&isRJ2=" + true
                // }
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""



                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""

                if (isRJ == '' && isRJ2 == '' && isRI == '' && isIGD == '') {
                    alert('Ceklis Instalasi !!!');

                    $scope.isRouteLoading = false;
                    return;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRekapPengunjungCtrl', chacePeriode);
                debugger
                if ($scope.item.departement == undefined) {
                    // medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-kso?"
                    if (tglAkhir < '2021-08-01 00:00:00') {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-ksoverif?" +
                            "tglAwal=" + tglAwal +
                            "&tglAkhir=" + tglAkhir +
                            tempRuanganId +
                            tempDepartemen +
                            isRJ +
                            isRJ2 +
                            isIGD +
                            isRI).then(function (data) {

                                $scope.isRouteLoading = false;
                                details = data.data;
                                $scope.dataPasienPulang = {
                                    data: data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    },
                                    aggregate: [
                                        { field: 'jmlPasienBaru', aggregate: 'sum' },
                                        { field: 'jmlPasienLama', aggregate: 'sum' },
                                        { field: 'jmlPasien', aggregate: 'sum' },
                                        { field: 'jmlPasienTracer', aggregate: 'sum' },
                                        { field: 'jmlPasienNonTracer', aggregate: 'sum' },
                                        { field: 'jmlPasienKonsul', aggregate: 'sum' },
                                        { field: 'jmlPasienKunjungan', aggregate: 'sum' },
                                        { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                                        { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                                        { field: 'jmlPasienPTT', aggregate: 'sum' },
                                        { field: 'jmlPasienUmum', aggregate: 'sum' },
                                        { field: 'jmlPasienTagihan', aggregate: 'sum' },
                                        { field: 'jmlPasienPembayaran', aggregate: 'sum' },
                                        { field: 'jmlPasienSendiri', aggregate: 'sum' },
                                        { field: 'jmlPasienRujukan', aggregate: 'sum' },
                                        { field: 'jmlPasienPasca', aggregate: 'sum' },
                                        { field: 'jmlPasienKedatangan', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungRegister', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungPulang', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungRawat', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungKonsul', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungRujuk', aggregate: 'sum' },
                                        // { field: 'jmlPulangPengunjungBatal', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjung', aggregate: 'sum' },
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                // });
                            })
                    } else {
                        medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-ksoverifv2?" +
                            "tglAwal=" + tglAwal +
                            "&tglAkhir=" + tglAkhir +
                            tempRuanganId +
                            tempDepartemen +
                            isRJ +
                            isRJ2 +
                            isIGD +
                            isRI).then(function (data) {

                                $scope.isRouteLoading = false;
                                details = data.data;
                                $scope.dataPasienPulang = {
                                    data: data.data,
                                    pageSize: 10,
                                    total: data.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    },
                                    aggregate: [
                                        { field: 'jmlPasienBaru', aggregate: 'sum' },
                                        { field: 'jmlPasienLama', aggregate: 'sum' },
                                        { field: 'jmlPasien', aggregate: 'sum' },
                                        { field: 'jmlPasienTracer', aggregate: 'sum' },
                                        { field: 'jmlPasienNonTracer', aggregate: 'sum' },
                                        { field: 'jmlPasienKonsul', aggregate: 'sum' },
                                        { field: 'jmlPasienKunjungan', aggregate: 'sum' },
                                        { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                                        { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                                        { field: 'jmlPasienPTT', aggregate: 'sum' },
                                        { field: 'jmlPasienUmum', aggregate: 'sum' },
                                        { field: 'jmlPasienTagihan', aggregate: 'sum' },
                                        { field: 'jmlPasienPembayaran', aggregate: 'sum' },
                                        { field: 'jmlPasienSendiri', aggregate: 'sum' },
                                        { field: 'jmlPasienRujukan', aggregate: 'sum' },
                                        { field: 'jmlPasienPasca', aggregate: 'sum' },
                                        { field: 'jmlPasienKedatangan', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungRegister', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungPulang', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungRawat', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungKonsul', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjungRujuk', aggregate: 'sum' },
                                        // { field: 'jmlPulangPengunjungBatal', aggregate: 'sum' },
                                        { field: 'jmlPulangPengunjung', aggregate: 'sum' },
                                    ],
                                    refresh: true,
                                    selectable: true,
                                    refresh: true,
                                    groupable: true,
                                    allowCopy: true,
                                }
                                // });
                            })
                    }

                } else {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-kso?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        tempRuanganId +
                        tempDepartemen +
                        isRJ +
                        isRJ2 +
                        isRI).then(function (data) {

                            $scope.isRouteLoading = false;
                            details = data.data;
                            // var doubleTotal = 0;
                            // var doubleKarcis = 0;
                            // for (var i = 0; i < data.data.length; i++) {
                            //     doubleTotal = doubleTotal + parseFloat(data.data[i].total)
                            //     doubleKarcis = doubleKarcis + parseFloat(data.data[i].karcis)
                            // }
                            // $scope.item.karcis = doubleKarcis
                            // $scope.item.total = doubleTotal
                            $scope.dataPasienPulang = {
                                // new kendo.data.DataSource({
                                data: data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {}
                                    }
                                },
                                aggregate: [
                                    { field: 'jmlPasienBaru', aggregate: 'sum' },
                                    { field: 'jmlPasienLama', aggregate: 'sum' },
                                    { field: 'jmlPasien', aggregate: 'sum' },
                                    { field: 'jmlPasienTracer', aggregate: 'sum' },
                                    { field: 'jmlPasienNonTracer', aggregate: 'sum' },
                                    { field: 'jmlPasienKonsul', aggregate: 'sum' },
                                    { field: 'jmlPasienKunjungan', aggregate: 'sum' },
                                    { field: 'jmlPasienBpjsPol', aggregate: 'sum' },
                                    { field: 'jmlPasienBpjsNonPol', aggregate: 'sum' },
                                    { field: 'jmlPasienPTT', aggregate: 'sum' },
                                    { field: 'jmlPasienUmum', aggregate: 'sum' },
                                    { field: 'jmlPasienTagihan', aggregate: 'sum' },
                                    { field: 'jmlPasienPembayaran', aggregate: 'sum' },
                                    { field: 'jmlPasienSendiri', aggregate: 'sum' },
                                    { field: 'jmlPasienRujukan', aggregate: 'sum' },
                                    { field: 'jmlPasienPasca', aggregate: 'sum' },
                                    { field: 'jmlPasienKedatangan', aggregate: 'sum' },
                                    { field: 'jmlPulangPengunjungRegister', aggregate: 'sum' },
                                    { field: 'jmlPulangPengunjungPulang', aggregate: 'sum' },
                                    { field: 'jmlPulangPengunjungRawat', aggregate: 'sum' },
                                    { field: 'jmlPulangPengunjungKonsul', aggregate: 'sum' },
                                    { field: 'jmlPulangPengunjungRujuk', aggregate: 'sum' },
                                    // { field: 'jmlPulangPengunjungBatal', aggregate: 'sum' },
                                    { field: 'jmlPulangPengunjung', aggregate: 'sum' },
                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                            // });
                        })
                }
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                if (value == "null") {
                    value = "0";
                }
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.columnMonitoring = {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "LaporanRekapKunjungan.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapKunjungan.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA KUNJUNGAN " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "title": "KSO",
                    "width": "180px",
                    headerAttributes: { style: "text-align : center" },
                    columns: [{
                        "field": "ksorj",
                        "title": "Klaim KSO RJ",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickKlaimKso(dataItem)\" style=\"margin:0 0 5px\">#: ksorj #</button>",
                    }, {
                        "field": "ksori",
                        "title": "Klaim KSO RI",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickKlaimKso2(dataItem)\" style=\"margin:0 0 5px\">#: ksori #</button>",
                    }]
                },
                {
                    "title": "SEP Tidak Disimpan Di SIMRS RJ",
                    "width": "180px",
                    headerAttributes: { style: "text-align : center" },
                    columns: [{
                        "field": "countdataKlaimRJ10Murni",
                        "title": "KLAIM KSO RJ YANG DIBAYAR BPJS",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataKlaimRJ10Murni(dataItem)\" style=\"margin:0 0 5px\">#: countdataKlaimRJ10Murni #</button>",
                    },
                    {
                        "field": "countdataBandingkanKSORJMurniTidakAda",
                        "title": "Pembayarn Klaim Yang Tidak Ada Di KSO",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataKlaimRJ10Murni2(dataItem)\" style=\"margin:0 0 5px\">#: countdataBandingkanKSORJMurniTidakAda #</button>",
                    },
                    {
                        "field": "countcekSelisihRJTidakAda",
                        "title": "Selisih Klaim KSO RJ & Klaim KSO RJ yang dibayar",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickcekSelisihRJ(dataItem)\" style=\"margin:0 0 5px\">#: countcekSelisihRJTidakAda #</button>",
                    },
                        // {
                        //     "field": "KlaimRJ",
                        //     "title": "SEP Tidak Disimpan Di SIMRS RJ",
                        //     "width": "100px",
                        //     "template": "<button class=\"k-button custom-button\" ng-click=\"clickKlaimBpjsRj(dataItem)\" style=\"margin:0 0 5px\">#: KlaimRJ #</button>",
                        // },
                        // {
                        // "field": "countdataBandingkanKSOPraud",
                        // "title": "SEP Tidak Disimpan Di SIMRS(Bandingkan Data KSO RJ dan Klaim)",
                        // "width": "100px",
                        // "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataBandingkanKSOPraud(dataItem)\" style=\"margin:0 0 5px\">#: countdataBandingkanKSOPraud #</button>",
                        // },
                        // {
                        //     "field": "countdataBandingkanKSOPraudTidakAda",
                        //     "title": "Pembayarn Klaim Yang Tidak Ada Di KSO(Noregistrasi Tidak Ada)",
                        //     "width": "100px",
                        //     "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataBandingkanKSOPraudTidakAda(dataItem)\" style=\"margin:0 0 5px\">#: countdataBandingkanKSOPraudTidakAda #</button>",
                        // },
                    ]
                },
                {
                    "title": "SEP Tidak Disimpan Di SIMRS RI",
                    "width": "180px",
                    headerAttributes: { style: "text-align : center" },
                    columns: [{
                        "field": "countdataKlaimRI10Murni",
                        "title": "KLAIM KSO RI YANG DIBAYAR BPJS",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataKlaimRI10Murni(dataItem)\" style=\"margin:0 0 5px\">#: countdataKlaimRI10Murni #</button>",
                    },
                    {
                        "field": "countdataBandingkanKSORIMurniTidakAda",
                        "title": "Pembayarn Klaim Yang Tidak Ada Di KSO",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataKlaimRI10MurniTidakAda(dataItem)\" style=\"margin:0 0 5px\">#: countdataBandingkanKSORIMurniTidakAda #</button>",
                    },
                    {
                        "field": "countcekSelisihRITidakAda",
                        "title": "Selisih Klaim KSO RI & Klaim KSO RI yang dibayar",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickcekSelisihRI(dataItem)\" style=\"margin:0 0 5px\">#: countcekSelisihRITidakAda #</button>",
                    },
                        // {
                        //     "field": "KlaimRI",
                        //     "title": "SEP Tidak Disimpan Di SIMRS RJ",
                        //     "width": "100px",
                        //     "template": "<button class=\"k-button custom-button\" ng-click=\"clickKlaimBpjsRi(dataItem)\" style=\"margin:0 0 5px\">#: KlaimRI #</button>",
                        // },
                        // {
                        //     "field": "countdataBandingkanKSOPraudRI",
                        //     "title": "SEP Tidak Disimpan Di SIMRS(Bandingkan Data KSO RI dan Klaim)",
                        //     "width": "100px",
                        //     "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataBandingkanKSOPraudRI(dataItem)\" style=\"margin:0 0 5px\">#: countdataBandingkanKSOPraudRI #</button>",
                        // },
                        // {
                        //     "field": "countdataBandingkanKSOPraudTidakAdaRI",
                        //     "title": "SEP Tidak Disimpan Di SIMRS(Bandingkan Data KSO RJ dan Klaim)",
                        //     "width": "100px",
                        //     "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataBandingkanKSOPraudTidakAdaRI(dataItem)\" style=\"margin:0 0 5px\">#: countdataBandingkanKSOPraudTidakAdaRI #</button>",
                        // },
                    ]
                },
                {
                    "title": "Tagihan",
                    "width": "180px",
                    headerAttributes: { style: "text-align : center" },
                    columns: [{
                        "field": "ksotagihan",
                        "title": "RJ & IGD",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataTagihanRJ(dataItem)\" style=\"margin:0 0 5px\">#: ksotagihan #</button>",
                    }, {
                        "field": "ksotagihanri",
                        "title": "RI",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataTagihanRI(dataItem)\" style=\"margin:0 0 5px\">#: ksotagihanri #</button>",
                    },

                    ]
                },
                {
                    "title": "Atensi/CSR",
                    "width": "180px",
                    headerAttributes: { style: "text-align : center" },
                    columns: [{
                        "field": "ksocsr",
                        "title": "RJ & IGD",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataAtensiRJ(dataItem)\" style=\"margin:0 0 5px\">#: ksocsr #</button>",
                    }, {
                        "field": "ksocsrri",
                        "title": "RI",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataAtensiRI(dataItem)\" style=\"margin:0 0 5px\">#: ksocsrri #</button>",
                    },

                    ]
                },
                {
                    "title": "Umum",
                    "width": "180px",
                    headerAttributes: { style: "text-align : center" },
                    columns: [{
                        "field": "ksoumum",
                        "title": "RJ & IGD",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataUmumRJ(dataItem)\" style=\"margin:0 0 5px\">#: ksoumum #</button>",
                    }, {
                        "field": "ksoumumri",
                        "title": "RI",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"clickdataUmumRI(dataItem)\" style=\"margin:0 0 5px\">#: ksoumumri #</button>",
                    },

                    ]
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.clickNamaRuangan = function (dataPasienSelected) {
                debugger
                $scope.dataPasienNamaRuangan = {
                    data: dataPasienSelected.detailTarifRS,
                    pageSize: 10,
                    total: dataPasienSelected.detailTarifRS.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {

                            }
                        }
                    },
                    aggregate: [
                        { field: 'biayabysetujui', aggregate: 'sum' },
                        { field: 'biayabytarifrs', aggregate: 'sum' },
                        { field: 'tarifrstidakdiklaim', aggregate: 'sum' },
                    ],
                    refresh: true,
                    selectable: true,
                    refresh: true,
                    groupable: true,
                    allowCopy: true,
                }
                $scope.totalKlaim = dataPasienSelected.detailTarifRS.biayabysetujui;
                $scope.popUpDetailNamaRuangan.center().open();
            }
            $scope.aggregate = [{
                field: "tarifRS",
                aggregate: "sum"
            }]
            $scope.columnMonitoring2 = {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "LaporanRekapKunjungan.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapKunjungan.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA KUNJUNGAN " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "title": "Ruangan",
                    "width": "180px",
                    "field": "namaruangan",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"clickNamaRuangan(dataItem)\" style=\"margin:0 0 5px\">#: namaruangan #</button>",
                }, {
                    "title": "KLAIM",
                    "width": "180px",
                    headerAttributes: { style: "text-align : center" },
                    columns: [{
                        "title": "Tarif RS Yang Diajukan",
                        "width": "180px",
                        "field": "tarifRS",
                        "template": "<span class='style-right'>Rp {{formatRupiah('#: tarifRS #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.tarifRS.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.tarifRS.sum #', 'Rp.')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }, {
                        "title": "Ini Adalah Biaya Yang Disetujui Akan Diabayar Sama BPJS",
                        "width": "180px",
                        "field": "diabayarbpjs",
                        "template": "<span class='style-right'>Rp {{formatRupiah('#: diabayarbpjs #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.diabayarbpjs.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.diabayarbpjs.sum #', 'Rp.')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }, {
                        "title": "Top Up",
                        "width": "180px",
                        "field": "topup",
                        "template": "<span class='style-right'>Rp {{formatRupiah('#: topup #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.topup.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.topup.sum #', 'Rp.')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    }]
                }, {
                    "title": "Ini Yang Diajukan Tapi Dipending Sama BPJS",
                    "width": "180px",
                    "field": "tarifPending",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: tarifPending #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "#: data.tarifPending.sum #",
                    footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.tarifPending.sum #', 'Rp.')}}</span>",
                    footerAttributes: { style: "text-align: right;" }
                }, {
                    "title": "Ini Tarif RS Yang Tidak Diajukan Klaim",
                    "width": "180px",
                    "field": "dataTidakDiklaim",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: dataTidakDiklaim #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "#: data.dataTidakDiklaim.sum #",
                    footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.dataTidakDiklaim.sum #', 'Rp.')}}</span>",
                    footerAttributes: { style: "text-align: right;" }
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienNamaRuangan = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "50px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tanggal Registrasi",
                    "width": "50px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50px"
                },
                {
                    "field": "pesertanomr",
                    "title": "No RM",
                    "width": "50px"
                },
                {
                    "field": "pesertanama",
                    "title": "Nama Pasien",
                    "width": "50px"
                },
                {
                    "field": "biayabytarifrs",
                    "title": "Biaya Tarif RS",
                    "width": "50px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: biayabytarifrs #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "#: data.biayabytarifrs.sum #",
                    footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.biayabytarifrs.sum #', 'Rp.')}}</span>",
                    footerAttributes: { style: "text-align: right;" }
                },
                {
                    "field": "biayabysetujui",
                    "title": "Biaya Setujui BPJS",
                    "width": "50px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: biayabysetujui #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "#: data.biayabysetujui.sum #",
                    footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.biayabysetujui.sum #', 'Rp.')}}</span>",
                    footerAttributes: { style: "text-align: right;" }
                },
                {
                    "field": "tarifrstidakdiklaim",
                    "title": "Ini Tarif RS Yang Tidak Diajukan Klaim",
                    "width": "50px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: tarifrstidakdiklaim #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "#: data.tarifrstidakdiklaim.sum #",
                    footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.tarifrstidakdiklaim.sum #', 'Rp.')}}</span>",
                    footerAttributes: { style: "text-align: right;" }
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienKso = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "50px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tanggal Registrasi",
                    "width": "50px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50px"
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "50px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "50px"
                },
                {
                    "field": "ruanganasal",
                    "title": "Ruangan Asal",
                    "width": "50px"
                },
                {
                    "field": "namarekanan",
                    "title": "Rekanan",
                    "width": "50px"
                },
                {
                    "field": "jaminankhusus",
                    "title": "Jaminan Khusus",
                    "width": "50px"
                },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "50px"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienKso2 = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "50px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tanggal Registrasi",
                    "width": "50px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50px"
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "50px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "50px"
                },
                {
                    "field": "ruanganasal",
                    "title": "Ruangan Asal",
                    "width": "50px"
                },
                {
                    "field": "namarekanan",
                    "title": "Rekanan",
                    "width": "50px"
                },
                {
                    "field": "jaminankhusus",
                    "title": "Jaminan Khusus",
                    "width": "50px"
                },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "50px"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columncekSelisih = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "50px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tanggal Registrasi",
                    "width": "50px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50px"
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "50px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "50px"
                },
                {
                    "field": "ruanganasal",
                    "title": "Ruangan Asal",
                    "width": "50px"
                },
                {
                    "field": "namarekanan",
                    "title": "Rekanan",
                    "width": "50px"
                },
                    // {
                    //     "field": "jaminankhusus",
                    //     "title": "Jaminan Khusus",
                    //     "width": "50px"
                    // },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienKlaimRj = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                // {
                // 	"field": "INACBGNAMA",
                // 	"title": "Nama Inacbg",
                // 	"width": "20%",
                // 	"template": "<span class='style-center'>#: INACBGNAMA #</span>"
                // },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                // {
                // 	"field": "BIAYAKELASRAWAT",
                // 	"title": "Kelas Rawat",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYAKELASRAWAT #</span>"
                // },
                // {
                // 	"field": "PESERTASTATUS",
                // 	"title": "Status",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: PESERTASTATUS #</span>"
                // },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Tarif RS Yang Diajukan",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                // {
                // 	"field": "BIAYABYPENGAJUAN",
                // 	"title": "Biaya Pengajuan",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYABYPENGAJUAN #</span>"
                // },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Ini Adalah Biaya Yang Disetujui Akan Diabayar Sama BPJS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienKlaimRjAda = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Biaya Tarif RS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Biaya Setujui",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                },
                {
                    "field": "statusKSO",
                    "title": "Status KSO",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusKSO #</span>"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienKlaimRi = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                // {
                // 	"field": "INACBGNAMA",
                // 	"title": "Nama Inacbg",
                // 	"width": "20%",
                // 	"template": "<span class='style-center'>#: INACBGNAMA #</span>"
                // },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                // {
                // 	"field": "BIAYAKELASRAWAT",
                // 	"title": "Kelas Rawat",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYAKELASRAWAT #</span>"
                // },
                // {
                // 	"field": "PESERTASTATUS",
                // 	"title": "Status",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: PESERTASTATUS #</span>"
                // },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Biaya Tarif RS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                // {
                // 	"field": "BIAYABYPENGAJUAN",
                // 	"title": "Biaya Pengajuan",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYABYPENGAJUAN #</span>"
                // },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Biaya Setujui",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienPendingRj = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                // {
                // 	"field": "INACBGNAMA",
                // 	"title": "Nama Inacbg",
                // 	"width": "20%",
                // 	"template": "<span class='style-center'>#: INACBGNAMA #</span>"
                // },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                // {
                // 	"field": "BIAYAKELASRAWAT",
                // 	"title": "Kelas Rawat",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYAKELASRAWAT #</span>"
                // },
                // {
                // 	"field": "PESERTASTATUS",
                // 	"title": "Status",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: PESERTASTATUS #</span>"
                // },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Biaya Tarif RS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                // {
                // 	"field": "BIAYABYPENGAJUAN",
                // 	"title": "Biaya Pengajuan",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYABYPENGAJUAN #</span>"
                // },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Biaya Setujui",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienPendingRi = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                // {
                // 	"field": "INACBGNAMA",
                // 	"title": "Nama Inacbg",
                // 	"width": "20%",
                // 	"template": "<span class='style-center'>#: INACBGNAMA #</span>"
                // },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                // {
                // 	"field": "BIAYAKELASRAWAT",
                // 	"title": "Kelas Rawat",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYAKELASRAWAT #</span>"
                // },
                // {
                // 	"field": "PESERTASTATUS",
                // 	"title": "Status",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: PESERTASTATUS #</span>"
                // },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Biaya Tarif RS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                // {
                // 	"field": "BIAYABYPENGAJUAN",
                // 	"title": "Biaya Pengajuan",
                // 	"width": "100px",
                // 	"template": "<span class='style-left'>#: BIAYABYPENGAJUAN #</span>"
                // },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Biaya Setujui",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasiendataBandingkanKSOPraud = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Biaya Tarif RS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Biaya Setujui",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                },
                {
                    "field": "statusKSO",
                    "title": "Status KSO",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusKSO #</span>"
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasiendataBandingkanKSOPraudTidakAda = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Biaya Tarif RS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Biaya Setujui",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                },
                {
                    "field": "statusKSO",
                    "title": "Status KSO",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusKSO #</span>"
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasiendataKlaimRJ10Murni = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "BIAYANOSEP",
                    "title": "NOSEP",
                    "width": "10%"
                },
                {
                    "field": "noregistrasi",
                    "title": "NOREGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "statusenabledDaftar",
                    "title": "STATUS DAFTAR",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusenabledDaftar #</span>"
                },
                {
                    "field": "BIAYANOFPK",
                    "title": "NO FPK",
                    "width": "10%"
                },
                {
                    "field": "PESERTANAMA",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: PESERTANAMA #</span>"
                },
                {
                    "field": "PESERTANOKARTU",
                    "title": "Nokartu",
                    "width": "150px",
                    "template": "<span class='style-left'>#: PESERTANOKARTU #</span>"
                },
                {
                    "field": "PESERTANOMR",
                    "title": "NOMR",
                    "width": "15%",
                    "template": "<span class='style-left'>#: PESERTANOMR #</span>"
                },
                {
                    "field": "PESERTAPOLI",
                    "title": "Ruangan Inacbg",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTAPOLI #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan SIMRS",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                {
                    "field": "BIAYABYTARIFRS",
                    "title": "Biaya Tarif RS",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYTARIFRS #', '')}}</span>"
                },
                {
                    "field": "BIAYABYSETUJUI",
                    "title": "Biaya Setujui",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: BIAYABYSETUJUI #', '')}}</span>"


                },
                {
                    "field": "tglregistrasi",
                    "title": "TGL REGISTRASI",
                    "width": "10%"
                },
                {
                    "field": "PESERTATGLSEP",
                    "title": "Tanggal SEP",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLSEP #</span>"
                },
                {
                    "field": "PESERTATGLPULANG",
                    "title": "Tanggal Pulang",
                    "width": "100px",
                    "template": "<span class='style-left'>#: PESERTATGLPULANG #</span>"
                },
                {
                    "field": "TGLNOFPK",
                    "title": "Tanggal NoFpk",
                    "width": "100px",
                    "template": "<span class='style-left'>#: TGLNOFPK #</span>"
                },
                {
                    "field": "statusKSO",
                    "title": "Status KSO",
                    "width": "100px",
                    "template": "<span class='style-left'>#: statusKSO #</span>"
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            $scope.clickKlaimKso = function (dataPasienSelected) {
                $scope.totalKlaim = dataPasienSelected.ksorj * 13500;
                $scope.popUpKso.center().open();
            }
            $scope.clickKlaimKso2 = function (dataPasienSelected) {
                $scope.totalKlaim = dataPasienSelected.ksori * 55000;
                $scope.popUpKso2.center().open();
            }
            $scope.clickKlaimBpjsRj = function (x) {
                $scope.totalKlaim = x.KlaimRJ * 13500;
                $scope.popUpKlaimRj.center().open();
            }
            $scope.clickKlaimBpjsRi = function (x) {
                $scope.totalKlaim = x.KlaimRI * 55000;
                $scope.popUpKlaimRi.center().open();
            }
            $scope.clickpendingRJ = function (x) {
                $scope.popUpPendingRj.center().open();
            }
            $scope.clickpendingRI = function (x) {
                $scope.popUpPendingRi.center().open();
            }
            $scope.clickdataBandingkanKSOPraud = function (x) {
                $scope.totalKlaim = x.countdataBandingkanKSOPraud * 13500;
                $scope.popUpdataBandingkanKSOPraud.center().open();
            }
            $scope.clickdataKlaimRJ10Murni = function (x) {
                $scope.totalKlaim = x.countdataKlaimRJ10Murni * 13500;
                $scope.popUpKlaimRjAda.center().open();
            }
            $scope.clickdataKlaimRJ10Murni2 = function (x) {
                $scope.totalKlaim = x.countdataBandingkanKSORJMurniTidakAda * 13500;
                $scope.popUpKlaimRjAda2.center().open();
            }
            $scope.clickdataBandingkanKSOPraudTidakAda = function (x) {
                $scope.totalKlaim = x.countdataBandingkanKSOPraudTidakAda * 13500;
                $scope.popUpdataBandingkanKSOPraudTidakAda.center().open();
            }
            $scope.clickdataKlaimRI10Murni = function (x) {
                $scope.totalKlaim = x.countdataKlaimRI10Murni * 55000;
                $scope.popUpKlaimRiAda.center().open();
            }
            $scope.clickdataKlaimRI10MurniTidakAda = function (x) {
                $scope.totalKlaim = x.countdataBandingkanKSORIMurniTidakAda * 55000;
                $scope.popUpKlaimRiAda2.center().open();
            }
            $scope.clickdataBandingkanKSOPraudRI = function (x) {
                $scope.totalKlaim = x.countdataBandingkanKSOPraudRI * 13500;
                $scope.popUpdataBandingkanKSOPraudRI.center().open();
            }
            $scope.clickdataBandingkanKSOPraudTidakAdaRI = function (x) {
                $scope.totalKlaim = x.countdataBandingkanKSOPraudRI * 13500;
                $scope.popUpdataBandingkanKSOPraudTidakAdaRI.center().open();
            }
            $scope.clickcekSelisihRJ = function (x) {
                $scope.totalKlaim = x.countcekSelisihRJTidakAda * 13500;
                $scope.popUpcekSelisihRJ.center().open();
            }
            $scope.clickcekSelisihRI = function (x) {
                $scope.totalKlaim = x.countcekSelisihRITidakAda * 55000;
                $scope.popUpcekSelisihRI.center().open();
            }

            $scope.clickdataTagihanRJ = function (x) {
                $scope.totalKlaim = x.ksotagihan * 13500;
                $scope.popUpKsoTagihanRj.center().open();
            }
            $scope.clickdataTagihanRI = function (x) {
                $scope.totalKlaim = x.ksotagihanri * 55000;
                $scope.popUpKsoTagihanRi.center().open();
            }
            $scope.clickdataAtensiRJ = function (x) {
                $scope.totalKlaim = x.ksocsr * 13500;
                $scope.popUpKsoCsrRj.center().open();
            }
            $scope.clickdataAtensiRI = function (x) {
                $scope.totalKlaim = x.ksocsrri * 55000;
                $scope.popUpKsoCsrRi.center().open();
            }
            $scope.clickdataUmumRJ = function (x) {
                $scope.totalKlaim = x.ksoumum * 13500;
                $scope.popUpKsoUmumRj.center().open();
            }
            $scope.clickdataUmumRI = function (x) {
                $scope.totalKlaim = x.ksoumumri * 55000;
                $scope.popUpKsoUmumRi.center().open();
            }


            $scope.columnPasienPulang = {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "LaporanRekapKunjungan.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanRekapKunjungan.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "REKAPITULASI POLIKLINIK BERDASARKAN DATA KUNJUNGAN " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [
                    // {
                    //     "field": "nomor",
                    //     "title": "No",
                    //     "width": "20px"
                    // },
                    {
                        "field": "namaruangan",
                        "title": "POLIKLINIK",
                        "width": "180px"
                    },
                    // {
                    //     "title": "PASIEN",
                    //     "width": "180px",
                    //     headerAttributes: { style: "text-align : center" },
                    //     columns:
                    //     [
                    //         {
                    //             "field": "jmlPasienBaru",
                    //             "title": "BARU",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienBaru #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBaruDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienBaru #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: "#:data.jmlPasienBaru.sum  #"
                    //             // "footerTemplate": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBaruDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#:data.jmlPasienBaru.sum  #</button>" 
                    //         },
                    //         {
                    //             "field": "jmlPasienLama",
                    //             "title": "LAMA",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienLama #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienLamaDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienLama #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPasienLama.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPasien",
                    //             "title": "TOTAL",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasien #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTotalDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasien #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: "#:data.jmlPasien.sum  #"
                    //         }
                    //     ]
                    // },
                    // {
                    //     "title": "PENGUNJUNG",
                    //     "width": "180px",
                    //     headerAttributes: { style: "text-align : center" },
                    //     columns:
                    //     [
                    //         {
                    //             "field": "jmlPasienTracer",
                    //             "title": "TRACER",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienTracer #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTracerDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienTracer #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: "#:data.jmlPasienTracer.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPasienNonTracer",
                    //             "title": "NON TRACER",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienNonTracer #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienNonTracerDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienNonTracer #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPasienNonTracer.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPasienKonsul",
                    //             "title": "KONSUL",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienKonsul #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKonsulDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienKonsul #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPasienKonsul.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPasienKunjungan",
                    //             "title": "TOTAL",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienKunjungan #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKunjunganDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienKunjungan #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: "#:data.jmlPasienKunjungan.sum  #"
                    //         }
                    //     ]
                    // },
                    {
                        "title": "PEMBAYARAN",
                        "width": "180px",
                        headerAttributes: { style: "text-align : center" },
                        columns: [{
                            "field": "jmlPasienBpjsPol",
                            "title": "BPJS POLRI",
                            "width": "100px",
                            // template: "<span class='style-center'>#: jmlPasienBpjsPol #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBpjsPolDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienBpjsPol #</button>",
                            aggregates: ["sum"],
                            // footerTemplate: "#:data.jmlPasienBpjsPol.sum  #"
                            footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"jmlPasienBpjsPolDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#: data.jmlPasienBpjsPol.sum #</button>",
                        },
                        {
                            "field": "jmlPasienBpjsNonPol",
                            "title": "BPJS NONPOL",
                            "width": "100px",
                            // template: "<span class='style-center'>#: jmlPasienBpjsNonPol #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienBpjsNonPolDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienBpjsNonPol #</button>",
                            aggregates: ["sum"],
                            // footerTemplate: "#:data.jmlPasienBpjsNonPol.sum  #"
                            footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"jmlPasienBpjsNonPolDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#: data.jmlPasienBpjsNonPol.sum #</button>",
                        },
                        {
                            "field": "jmlPasienTagihan",
                            "title": "TAGIHAN",
                            "width": "100px",
                            // template: "<span class='style-center'>#: jmlPasienTagihan #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienTagihanDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienTagihan #</button>",
                            aggregates: ["sum"],
                            // footerTemplate: " #:data.jmlPasienTagihan.sum  #"
                            footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"jmlPasienTagihanDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#: data.jmlPasienTagihan.sum #</button>",
                        },
                        {
                            "field": "jmlPasienPTT",
                            "title": "ATENSI / CSR",
                            "width": "100px",
                            // template: "<span class='style-center'>#: jmlPasienPTT #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienPTTDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienPTT #</button>",
                            aggregates: ["sum"],
                            // footerTemplate: "#:data.jmlPasienPTT.sum  #"
                            footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"jmlPasienPTTDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#: data.jmlPasienPTT.sum #</button>",
                        },
                        {
                            "field": "jmlPasienUmum",
                            "title": "UMUM",
                            "width": "100px",
                            // template: "<span class='style-center'>#: jmlPasienUmum #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienUmumDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienUmum #</button>",
                            aggregates: ["sum"],
                            // footerTemplate: " #:data.jmlPasienUmum.sum  #"
                            footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"jmlPasienUmumDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#: data.jmlPasienUmum.sum #</button>",
                        },
                        {
                            "field": "jmlPasienPembayaran",
                            "title": "TOTAL",
                            "width": "100px",
                            // template: "<span class='style-center'>#: jmlPasienPembayaran #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienPembayaranDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienPembayaran #</button>",
                            aggregates: ["sum"],
                            // footerTemplate: " #:data.jmlPasienPembayaran.sum  #"
                            footerTemplate: "<button class=\"k-button custom-button-total\" ng-click=\"jmlPasienPembayaranDetailTotal(dataItem)\" style=\"margin:0 0 5px\">#: data.jmlPasienPembayaran.sum #</button>",
                        }
                        ]
                    },
                    // {
                    //     "title": "KEDATANGAN",
                    //     "width": "180px",
                    //     headerAttributes: { style: "text-align : center" },
                    //     columns:
                    //     [
                    //         {
                    //             "field": "jmlPasienSendiri",
                    //             "title": "SENDIRI",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienSendiri #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienSendiriDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienSendiri #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPasienSendiri.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPasienRujukan",
                    //             "title": "RUJUKAN",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienRujukan #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienRujukanDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienRujukan #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPasienRujukan.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPasienPasca",
                    //             "title": "PASCA RAWAT",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienPasca #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienPascaDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienPasca #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPasienPasca.sum #"
                    //         },
                    //         {
                    //             "field": "jmlPasienKedatangan",
                    //             "title": "TOTAL",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPasienKedatangan #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPasienKedatanganDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasienKedatangan #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPasienKedatangan.sum #"
                    //         }
                    //     ]
                    // },
                    // {
                    //     "title": "KEPULANGAN",
                    //     "width": "180px",
                    //     headerAttributes: { style: "text-align : center" },
                    //     columns:
                    //     [
                    //         {
                    //             "field": "jmlPulangPengunjungRegister",
                    //             "title": "REG",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPulangPengunjungRegister #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungRegisterDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungRegister #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPulangPengunjungRegister.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPulangPengunjungPulang",
                    //             "title": "PLG",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPulangPengunjungPulang #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungPulangDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungPulang #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPulangPengunjungPulang.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPulangPengunjungRawat",
                    //             "title": "RWT",
                    //             "width": "100px",
                    //             //template: "<span class='style-center'>#: jmlPulangPengunjungRawat #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungRawatDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungRawat #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPulangPengunjungRawat.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPulangPengunjungKonsul",
                    //             "title": "KSL",
                    //             "width": "100px",
                    //             //template: "<span class='style-center'>#: jmlPulangPengunjungKonsul #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungKonsulDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungKonsul #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPulangPengunjungKonsul.sum  #"
                    //         },
                    //         {
                    //             "field": "jmlPulangPengunjungRujuk",
                    //             "title": "RJK",
                    //             "width": "100px",
                    //             //template: "<span class='style-center'>#: jmlPulangPengunjungRujuk #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungRujukDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjungRujuk #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPulangPengunjungRujuk.sum  #"
                    //         },
                    //         // {
                    //         //     "field": "jmlPulangPengunjungBatal",
                    //         //     "title": "BTL",
                    //         //     "width": "100px",
                    //         //     template: "<span class='style-center'>#: jmlPulangPengunjungBatal #</span>",
                    //         //     aggregates: ["sum"],
                    //         //     footerTemplate: " #:data.jmlPulangPengunjungBatal.sum  #"
                    //         // },
                    //         {
                    //             "field": "jmlPulangPengunjung",
                    //             "title": "TOTAL",
                    //             "width": "100px",
                    //             // template: "<span class='style-center'>#: jmlPulangPengunjung #</span>",
                    //             "template": "<button class=\"k-button custom-button\" ng-click=\"jmlPulangPengunjungDetail(dataItem)\" style=\"margin:0 0 5px\">#: jmlPulangPengunjung #</button>",
                    //             aggregates: ["sum"],
                    //             footerTemplate: " #:data.jmlPulangPengunjung.sum  #"
                    //         }
                    //     ]
                    // },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            $scope.columnPasienDetail = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "50px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tanggal Registrasi",
                    "width": "50px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50px"
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "50px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "50px"
                },
                {
                    "field": "ruanganasal",
                    "title": "Ruangan Asal",
                    "width": "50px"
                },
                {
                    "field": "namarekanan",
                    "title": "Rekanan",
                    "width": "50px"
                },
                {
                    "field": "jaminankhusus",
                    "title": "Jaminan Khusus",
                    "width": "50px"
                },
                {
                    "field": "statuspulang",
                    "title": "Status Pulang",
                    "width": "50px"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            $scope.columnPasienDetail2 = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Laporan Rekap Pengunjung Detail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "LAPORAN REKAP PENGUNJUNG DETAIL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "nocm",
                    "title": "NoCM",
                    "width": "50px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50px"
                },
                {
                    "field": "namainstalasi",
                    "title": "Instalasi Lama",
                    "width": "50px"
                },
                {
                    "field": "namainstalasilama",
                    "title": "instalasibaru",
                    "width": "50px"
                },
                {
                    "field": "penjamin",
                    "title": "penjamin lama",
                    "width": "50px"
                },
                {
                    "field": "penjaminbaru",
                    "title": "penjamin baru",
                    "width": "50px"
                },
                {
                    "field": "penjaminkhusus",
                    "title": "jaminankhususlama",
                    "width": "50px"
                },
                {
                    "field": "penjaminkhususbaru",
                    "title": "jaminankhususbaru",
                    "width": "50px"
                }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            $scope.jmlPasienBaruDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=1";
                $scope.isRouteLoading = true;
                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })
            }
            $scope.jmlPasienLamaDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=2";
                $scope.isRouteLoading = true;
                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })
            }
            $scope.jmlPasienTotalDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=3";
                $scope.isRouteLoading = true;
                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })
            }
            $scope.jmlPasienTracerDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=4";
                $scope.isRouteLoading = true;
                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })
            }
            $scope.jmlPasienNonTracerDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=5";
                $scope.isRouteLoading = true;
                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })
            }
            $scope.jmlPasienKonsulDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=6";
                $scope.isRouteLoading = true;
                debugger
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }

            }
            $scope.jmlPasienKunjunganDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=7";
                $scope.isRouteLoading = true;

                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }

            }
            $scope.jmlPasienBpjsPolDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=8";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienBpjsPolDetailTotal = function () {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=37";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienBpjsNonPolDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=9";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienBpjsNonPolDetailTotal = function () {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                // var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"

                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=38";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienTagihanDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=10";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""

                $scope.isRouteLoading = true;
                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienTagihanDetailTotal = function () {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=39";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""

                $scope.isRouteLoading = true;
                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienPTTDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=11";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienPTTDetailTotal = function () {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                // var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=36";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienUmumDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=12";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienUmumDetailTotal = function () {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=40";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienPembayaranDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=13";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    ruanganId +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienPembayaranDetailTotal = function () {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=41";
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""

                var isNotLab = ""
                if ($scope.model.cekpilihManual3 == true && $scope.isRuanganRJ == false)
                    isNotLab = "&isNotLab=" + true
                else if ($scope.model.cekpilihManual3 == undefined)
                    isNotLab = ""

                else
                    isNotLab = ""

                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""
                $scope.isRouteLoading = true;


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    setParam + isRJ + isRJ2 + isNotLab + isRI + isIGD).then(function (data) {

                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        details = data.data.data;
                        $scope.dataPasienDetail = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            $scope.jmlPasienSendiriDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=14";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPasienRujukanDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=15";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPasienPascaDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=16";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPasienKedatanganDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=17";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPulangPengunjungRegisterDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=18";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPulangPengunjungPulangDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=19";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPulangPengunjungRawatDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=20";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPulangPengunjungKonsulDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=21";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPulangPengunjungRujukDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=22";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }
            $scope.jmlPulangPengunjungDetail = function (dataPasienSelected) {

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                if (tglAwal == "2021-02-01 00:00") {
                    tglAwal = "2021-02-19 00:00"
                }
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
                var setParam = "&setParam=23";
                $scope.isRouteLoading = true;
                if ($scope.item.departement.id == 16) {
                    medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2-ri?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                } else {
                    medifirstService.get(link +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        ruanganId +
                        setParam).then(function (data) {

                            $scope.popUpDetail.center().open();
                            $scope.isRouteLoading = false;
                            details = data.data.data;
                            $scope.dataPasienDetail = {
                                data: data.data.data,
                                pageSize: 10,
                                total: data.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {

                                        }
                                    }
                                },
                                aggregate: [

                                ],
                                refresh: true,
                                selectable: true,
                                refresh: true,
                                groupable: true,
                                allowCopy: true,
                            }
                        })
                }
            }

            $scope.Perbaharui = function () {

                $scope.ClearSearch();

            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPasienPulang();
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            //sdm service hanya sementara, nanti harus diganti pake service kasir !!

            // ManageSdm.getItem("service/list-generic/?view=Ruangan&select=id,namaRuangan").then(function(dat) {
            // $scope.listRuangan = dat.data;
            // });
            medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
                $scope.listDepartemen = data.data.departemen;
                // $scope.kelompokPasiens = e.data.data
                $scope.listKelompokPasien = data.data.kelompokpasien;
            })

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            // ManageSdm.getItem("service/list-generic/?view=KelompokPasien&select=*").then(function(dat) {
            // $scope.listPasien = dat.data;
            // });
            // manageLogistikPhp.getDataTableTransaksi("kasir/laporan-penerimaan-kasir-datacombo", true).then(function(dat){
            //     
            //     //$scope.listPegawai = dat.data.dataDokter;
            //     $scope.listRuangan = dat.data.dataruangan;
            //     //$scope.listPegawaiKasir = dat.data.datakasir;
            //     //$scope.dataLogin = dat.data.datalogin[0];
            //     $scope.listKelompokPasien = dat.data.datakelompokpasien;
            // });

            $scope.$watch('item.namaPenjamin', function (e) {
                // 
                if (e === undefined) return;
                findPasien.getDataRekanan(e.id).then(function (data) {
                    $scope.sourceDataRekanan = data.data.data.listData;
                    $scope.item.institusiAsalPasien = $scope.sourceDataRekanan;
                });
                if (e.id == 5 || e.id == 3) {
                    $scope.Perusahaan = true
                } else {
                    $scope.Perusahaan = false
                    $scope.item.institusiAsalPasien = ""
                }
            })

            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [{
                "id": 1,
                "format": "pdf"
            },
            {
                "id": 2,
                "format": "xls"
            }
            ];


            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.unverif = function () {
                $scope.popUpclosing2.center().open();
            }
            $scope.unverif2 = function () {
                debugger
                if ($scope.item.password != "jhorlindangilbert") {
                    toastr.error("Password Salah!")
                    return;
                }
                var r = confirm("Yakin Hapus?");
                if (r == false) {
                    return;
                }

                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&instalasi=18,52,3,27,28"
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&instalasi=18,52,3,27,28"
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""



                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&instalasi=16"
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&instalasi=24"
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""

                if (isRJ == '' && isRJ2 == '' && isRI == '' && isIGD == '') {
                    alert('Ceklis Instalasi !!!');

                    $scope.isRouteLoading = false;
                    return;
                }

                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var bulan = moment($scope.item.tglakhir).format("MM");
                var tahun = moment($scope.item.tglakhir).format("YYYY");
                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detailverifdelete?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&tglverif=" + tglAkhir + "&bulan=" + bulan + "&tahun=" + tahun + isRJ +
                    isRJ2 +
                    isIGD +
                    isRI).then(function (data) {

                        $scope.popUpclosing2.center().open();
                        $scope.isRouteLoading = false;
                    })
            }
            $scope.verif = function () {
                $scope.popUpclosing.center().open();
            }
            $scope.verif2 = function () {
                if ($scope.item.password != "jhorlindangilbert") {
                    toastr.error("Password Salah!")
                    return;
                }
                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var bulan = moment($scope.item.tglakhir).format("MM");
                var tahun = moment($scope.item.tglakhir).format("YYYY");
                var isRJ = ""
                if ($scope.model.cekpilihManual == true && $scope.isRuanganRJ == false)
                    isRJ = "&isRJ=" + true
                else if ($scope.model.cekpilihManual == undefined)
                    isRJ = ""

                else
                    isRJ2 = ""

                var isRJ2 = ""
                if ($scope.model.cekpilihManual2 == true && $scope.isRuanganRJ == false)
                    isRJ2 = "&isRJ2=" + true
                else if ($scope.model.cekpilihManual2 == undefined)
                    isRJ2 = ""

                else
                    isRJ2 = ""



                var isRI = ""
                if ($scope.model.cekpilihManual4 == true && $scope.isRuanganRJ == false)
                    isRI = "&isRI=" + true
                else if ($scope.model.cekpilihManual4 == undefined)
                    isRI = ""

                else
                    isRI = ""

                var isIGD = ""
                if ($scope.model.cekpilihManual5 == true && $scope.isRuanganRJ == false)
                    isIGD = "&isIGD=" + true
                else if ($scope.model.cekpilihManual5 == undefined)
                    isIGD = ""

                else
                    isIGD = ""

                medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detailverifcek?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&tglverif=" + tglAkhir + "&bulan=" + bulan + "&tahun=" + tahun + isRJ +
                    isRJ2 +
                    isIGD +
                    isRI).then(function (data) {

                        if (data.data.data != "y") {
                            var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detailverif?"
                            // var setParam = "&setParam=1";
                            $scope.isRouteLoading = true;
                            medifirstService.get(link +
                                "tglAwal=" + tglAwal +
                                "&tglAkhir=" + tglAkhir +
                                "&setParam=36" + "&tglverif=" + tglAkhir + isRJ +
                                isRJ2 +
                                isIGD +
                                isRI).then(function (data) {

                                    medifirstService.get(link +
                                        "tglAwal=" + tglAwal +
                                        "&tglAkhir=" + tglAkhir +
                                        "&setParam=37" + "&tglverif=" + tglAkhir + isRJ +
                                        isRJ2 +
                                        isIGD +
                                        isRI).then(function (data) {
                                            medifirstService.get(link +
                                                "tglAwal=" + tglAwal +
                                                "&tglAkhir=" + tglAkhir +
                                                "&setParam=38" + "&tglverif=" + tglAkhir + isRJ +
                                                isRJ2 +
                                                isIGD +
                                                isRI).then(function (data) {

                                                    medifirstService.get(link +
                                                        "tglAwal=" + tglAwal +
                                                        "&tglAkhir=" + tglAkhir +
                                                        "&setParam=39" + "&tglverif=" + tglAkhir + isRJ +
                                                        isRJ2 +
                                                        isIGD +
                                                        isRI).then(function (data) {

                                                            medifirstService.get(link +
                                                                "tglAwal=" + tglAwal +
                                                                "&tglAkhir=" + tglAkhir +
                                                                "&setParam=40" + "&tglverif=" + tglAkhir + isRJ +
                                                                isRJ2 +
                                                                isIGD +
                                                                isRI).then(function (data) {
                                                                    $scope.isRouteLoading = false;
                                                                    $scope.popUpclosing.center().open()
                                                                })
                                                        })

                                                })

                                        })


                                })




                            // medifirstService.get(link
                            //     + "tglAwal=" + tglAwal
                            //     + "&tglAkhir=" + tglAkhir 
                            //     + "&setParam=41"  + "&tglverif=" + tglAkhir ).then(function (data) {
                            //         $scope.isRouteLoading = false;
                            // })
                        } else {
                            alert('Bulan ' + moment($scope.item.tglakhir).format('MMMM - YYYY,') + " Sudah Di verifikasi")

                            return;
                        }
                    });
            }
            $scope.lihat = function () {



                lihatdetail();

                // tampiling();

                $scope.popupselisih.center().open();

            }
            // $scope.lihat = function () {   
            //     lihatdetail();
            //     // tampiling();

            //     $scope.popupselisih.center().open();

            // }

            function lihatdetail() {
                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var bulan = moment($scope.item.tglakhir).format("MM");
                var tahun = moment($scope.item.tglakhir).format("YYYY");
                // medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2verifdeletetemp?"
                // + "tglAwal=" + tglAwal
                // + "&tglAkhir=" + tglAkhir 
                // + "&tglverif=" + tglAkhir + "&bulan=" + bulan + "&tahun=" + tahun  ).then(function (data) {
                //     var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2veriftemp?"
                //     // var setParam = "&setParam=1";
                //     $scope.isRouteLoading = true;
                //     medifirstService.get(link
                //         + "tglAwal=" + tglAwal
                //         + "&tglAkhir=" + tglAkhir 
                //         + "&setParam=36"  + "&tglverif=" + tglAkhir  ).then(function (data) {

                //     })
                //     medifirstService.get(link
                //         + "tglAwal=" + tglAwal
                //         + "&tglAkhir=" + tglAkhir 
                //         + "&setParam=37"  + "&tglverif=" + tglAkhir ).then(function (data) {

                //     })
                //     medifirstService.get(link
                //         + "tglAwal=" + tglAwal
                //         + "&tglAkhir=" + tglAkhir 
                //         + "&setParam=38" + "&tglverif=" + tglAkhir  ).then(function (data) {

                //     })
                //     medifirstService.get(link
                //         + "tglAwal=" + tglAwal
                //         + "&tglAkhir=" + tglAkhir 
                //         + "&setParam=39"  + "&tglverif=" + tglAkhir ).then(function (data) {

                //     })
                //     medifirstService.get(link
                //         + "tglAwal=" + tglAwal
                //         + "&tglAkhir=" + tglAkhir 
                //         + "&setParam=40" + "&tglverif=" + tglAkhir ).then(function (data) {

                //     })
                //     medifirstService.get(link
                //         + "tglAwal=" + tglAwal
                //         + "&tglAkhir=" + tglAkhir 
                //         + "&setParam=41"  + "&tglverif=" + tglAkhir ).then(function (data) {
                //             $scope.isRouteLoading = false;
                //     })
                tampiling();
                // })
            }

            function tampiling() {
                debugger;
                var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var bulan = moment($scope.item.tglakhir).format("MM");
                var tahun = moment($scope.item.tglakhir).format("YYYY");
                medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detailverifcariselisih?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&tglverif=" + tglAkhir + "&bulan=" + bulan + "&tahun=" + tahun).then(function (data) {
                        $scope.dataPasienDetail2 = {
                            data: data.data.data,
                            pageSize: 10,
                            total: TempDatax.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            },
                            aggregate: [

                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                    })

            }
            // function lihatdetail() {

            //     var tglAwal = moment($scope.item.tglakhir).format('YYYY-MM-01 00:00');
            //     var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
            //     var bulan =moment($scope.item.tglakhir).format("MM"); 
            //     var tahun =moment($scope.item.tglakhir).format("YYYY"); 
            //     TempDatax = [];
            //     medifirstService.get("registrasi/laporan/get-laporan-rekap-pengunjung-detail2verifcari?"
            //         + "tglAwal=" + tglAwal
            //         + "&tglAkhir=" + tglAkhir 
            //         + "&tglverif=" + tglAkhir + "&bulan=" + bulan + "&tahun=" + tahun  ).then(function (data) {
            //         dataall = data.data.data;
            //         if(data.data.data != "y"){                      
            //             var link = "registrasi/laporan/get-laporan-rekap-pengunjung-detail2?"
            //             // var setParam = "&setParam=1";
            //             $scope.isRouteLoading = true;
            //             medifirstService.get(link
            //                 + "tglAwal=" + tglAwal
            //                 + "&tglAkhir=" + tglAkhir 
            //                 + "&setParam=36"  + "&tglverif=" + tglAkhir  ).then(function (data) {
            //                      details = data.data.data;                               

            //                     for (var i = 0; i < details.length; i++) {
            //                        var $status = true;
            //                         for (var x = 0; x < dataall.length; x++) {
            //                             // if(details[i].noregistrasi == '2108017941' && dataall[x].noregistrasi =='2108017941'  ){

            //                                 if(details[i].noregistrasi == dataall[x].noregistrasi){
            //                                     if(details[i].id_departemen != dataall[x].instalasi || details[i].namarekanan != dataall[x].penjamin ||details[i].jaminankhusus != dataall[x].penjaminkhusus ){
            //                                         data = {
            //                                             nocm: details[i].nocm,  
            //                                             noregistrasi: details[i].noregistrasi,  
            //                                             instalasilama: details[i].id_departemen,  
            //                                             instalasibaru: dataall[x].instalasi,  
            //                                             namarekananlama:  details[i].namarekanan,  
            //                                             namarekananbaru: dataall[x].penjamin,  
            //                                             jaminankhususlama: details[i].jaminankhusus,    
            //                                             jaminankhususbaru: dataall[x].penjaminkhusus               
            //                                         }
            //                                         TempDatax.push(data)
            //                                         tampiling();
            //                                         break;
            //                                     }
            //                                 }
            //                             // }
            //                         }
            //                     } 

            //             })
            //             medifirstService.get(link
            //                 + "tglAwal=" + tglAwal
            //                 + "&tglAkhir=" + tglAkhir 
            //                 + "&setParam=37"  + "&tglverif=" + tglAkhir ).then(function (data) {
            //                      details = data.data.data;                               

            //                     for (var i = 0; i < details.length; i++) {
            //                        var $status = true;
            //                         for (var x = 0; x < dataall.length; x++) {
            //                             // if(details[i].noregistrasi == '2108017941' && dataall[x].noregistrasi =='2108017941'  ){

            //                                 if(details[i].noregistrasi == dataall[x].noregistrasi){
            //                                     if(details[i].id_departemen != dataall[x].instalasi || details[i].namarekanan != dataall[x].penjamin ||details[i].jaminankhusus != dataall[x].penjaminkhusus ){
            //                                         data = {
            //                                             nocm: details[i].nocm,  
            //                                             noregistrasi: details[i].noregistrasi,  
            //                                             instalasilama: details[i].id_departemen,  
            //                                             instalasibaru: dataall[x].instalasi,  
            //                                             namarekananlama:  details[i].namarekanan,  
            //                                             namarekananbaru: dataall[x].penjamin,  
            //                                             jaminankhususlama: details[i].jaminankhusus,    
            //                                             jaminankhususbaru: dataall[x].penjaminkhusus               
            //                                         }
            //                                         TempDatax.push(data)
            //                                         tampiling();
            //                                         break;
            //                                     }
            //                                 }
            //                             // }
            //                         }
            //                     } 

            //             })
            //             medifirstService.get(link
            //                 + "tglAwal=" + tglAwal
            //                 + "&tglAkhir=" + tglAkhir 
            //                 + "&setParam=38" + "&tglverif=" + tglAkhir  ).then(function (data) {
            //                     details = data.data.data;                               

            //                     for (var i = 0; i < details.length; i++) {
            //                        var $status = true;
            //                         for (var x = 0; x < dataall.length; x++) {
            //                             // if(details[i].noregistrasi == '2108017941' && dataall[x].noregistrasi =='2108017941'  ){

            //                                 if(details[i].noregistrasi == dataall[x].noregistrasi){
            //                                     if(details[i].id_departemen != dataall[x].instalasi || details[i].namarekanan != dataall[x].penjamin ||details[i].jaminankhusus != dataall[x].penjaminkhusus ){
            //                                         data = {
            //                                             nocm: details[i].nocm,  
            //                                             noregistrasi: details[i].noregistrasi,  
            //                                             instalasilama: details[i].id_departemen,  
            //                                             instalasibaru: dataall[x].instalasi,  
            //                                             namarekananlama:  details[i].namarekanan,  
            //                                             namarekananbaru: dataall[x].penjamin,  
            //                                             jaminankhususlama: details[i].jaminankhusus,    
            //                                             jaminankhususbaru: dataall[x].penjaminkhusus               
            //                                         }
            //                                         TempDatax.push(data)
            //                                         tampiling();
            //                                         break;
            //                                     }
            //                                 }
            //                             // }
            //                         }
            //                     } 

            //             })
            //             medifirstService.get(link
            //                 + "tglAwal=" + tglAwal
            //                 + "&tglAkhir=" + tglAkhir 
            //                 + "&setParam=39"  + "&tglverif=" + tglAkhir ).then(function (data) {
            //                      details = data.data.data;                               

            //                     for (var i = 0; i < details.length; i++) {
            //                        var $status = true;
            //                         for (var x = 0; x < dataall.length; x++) {
            //                             // if(details[i].noregistrasi == '2108017941' && dataall[x].noregistrasi =='2108017941'  ){

            //                                 if(details[i].noregistrasi == dataall[x].noregistrasi){
            //                                     if(details[i].id_departemen != dataall[x].instalasi || details[i].namarekanan != dataall[x].penjamin ||details[i].jaminankhusus != dataall[x].penjaminkhusus ){
            //                                         data = {
            //                                             nocm: details[i].nocm,  
            //                                             noregistrasi: details[i].noregistrasi,  
            //                                             instalasilama: details[i].id_departemen,  
            //                                             instalasibaru: dataall[x].instalasi,  
            //                                             namarekananlama:  details[i].namarekanan,  
            //                                             namarekananbaru: dataall[x].penjamin,  
            //                                             jaminankhususlama: details[i].jaminankhusus,    
            //                                             jaminankhususbaru: dataall[x].penjaminkhusus               
            //                                         }
            //                                         TempDatax.push(data)
            //                                         tampiling();
            //                                         break;
            //                                     }
            //                                 }
            //                             // }
            //                         }
            //                     } 

            //             })
            //             medifirstService.get(link
            //                 + "tglAwal=" + tglAwal
            //                 + "&tglAkhir=" + tglAkhir 
            //                 + "&setParam=40" + "&tglverif=" + tglAkhir ).then(function (data) {
            //                      details = data.data.data;                               

            //                     for (var i = 0; i < details.length; i++) {
            //                        var $status = true;
            //                         for (var x = 0; x < dataall.length; x++) {
            //                             // if(details[i].noregistrasi == '2108017941' && dataall[x].noregistrasi =='2108017941'  ){

            //                                 if(details[i].noregistrasi == dataall[x].noregistrasi){
            //                                     if(details[i].id_departemen != dataall[x].instalasi || details[i].namarekanan != dataall[x].penjamin ||details[i].jaminankhusus != dataall[x].penjaminkhusus ){
            //                                         data = {
            //                                             nocm: details[i].nocm,  
            //                                             noregistrasi: details[i].noregistrasi,  
            //                                             instalasilama: details[i].id_departemen,  
            //                                             instalasibaru: dataall[x].instalasi,  
            //                                             namarekananlama:  details[i].namarekanan,  
            //                                             namarekananbaru: dataall[x].penjamin,  
            //                                             jaminankhususlama: details[i].jaminankhusus,    
            //                                             jaminankhususbaru: dataall[x].penjaminkhusus               
            //                                         }
            //                                         TempDatax.push(data)
            //                                         tampiling();
            //                                         break;
            //                                     }
            //                                 }
            //                             // }
            //                         }
            //                     } 

            //             })
            //             medifirstService.get(link
            //                 + "tglAwal=" + tglAwal
            //                 + "&tglAkhir=" + tglAkhir 
            //                 + "&setParam=41"  + "&tglverif=" + tglAkhir ).then(function (data) {
            //                      details = data.data.data;                               

            //                     for (var i = 0; i < details.length; i++) {
            //                        var $status = true;
            //                         for (var x = 0; x < dataall.length; x++) {
            //                             // if(details[i].noregistrasi == '2108017941' && dataall[x].noregistrasi =='2108017941'  ){

            //                                 if(details[i].noregistrasi == dataall[x].noregistrasi){
            //                                     if(details[i].id_departemen != dataall[x].instalasi || details[i].namarekanan != dataall[x].penjamin ||details[i].jaminankhusus != dataall[x].penjaminkhusus ){
            //                                         data = {
            //                                             nocm: details[i].nocm,  
            //                                             noregistrasi: details[i].noregistrasi,  
            //                                             instalasilama: details[i].id_departemen,  
            //                                             instalasibaru: dataall[x].instalasi,  
            //                                             namarekananlama:  details[i].namarekanan,  
            //                                             namarekananbaru: dataall[x].penjamin,  
            //                                             jaminankhususlama: details[i].jaminankhusus,    
            //                                             jaminankhususbaru: dataall[x].penjaminkhusus               
            //                                         }
            //                                         TempDatax.push(data)
            //                                         tampiling();
            //                                         break;
            //                                     }
            //                                 }
            //                             // }
            //                         }
            //                     } 
            //                     $scope.isRouteLoading = false;
            //             })
            //         }else{
            //             alert('Bulan '+  moment($scope.item.tglakhir).format('MMMM - YYYY,')  +" Sudah Di verifikasi")

            //             return;
            //         }
            //     });
            // }
            $scope.Cetak = function () {
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                if ($scope.item.namaPenjamin == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.namaPenjamin.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.institusiAsalPasien == undefined || $scope.item.institusiAsalPasien.id == undefined)
                    var perusahaan = "";
                else
                    var perusahaan = $scope.item.institusiAsalPasien.id;


                var data2 = details

                var TempData = []
                for (var i = 0; i < data2.length; i++) {
                    // if (details[i].rekananfk != null && details[i].statusbarang == null){
                    TempData.push(data2[i])
                    // }    
                }
                var data = {
                    details: TempData
                }
                medifirstService.post('registrasi/laporan/post-laporan-pasien-pulang', data).then(function (e) {
                    $scope.isRouteLoading = false;
                    var noId = e.data.noId
                    var stt = 'false'
                    if (confirm('View Laporan Pasien Pulang? ')) {
                        stt = 'true';
                    } else {
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&idlaporan=' + noId + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&strIdPerusahaan=' + perusahaan + '&view=' + stt, function (response) {
                        // http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&idlaporan=PP18070001&strIdDepartement=16&strIdRuangan=18&strIdKelompokPasien=2&strIdPegawai=1&strIdPerusahaan=&view=true
                    });
                });
            }

        }
    ]);
});