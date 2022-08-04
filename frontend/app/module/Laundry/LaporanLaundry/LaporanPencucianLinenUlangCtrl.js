define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPencucianLinenUlangCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var datas = [];
            var data3 = [];
            var etos = [];
            var dataCheck = [];
            $scope.dataAh = [];
            var norecKirim = '';
            var noKirim = '';
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('LaporanPencucianLinenUlangCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }


            function loadCombo() {
                $scope.dataLogin = medifirstService.getPegawaiLogin();

                medifirstService.get("laundry/get-combo-laundry", true).then(function (dat) {
                    $scope.listNamaBarang = dat.data.produk
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuangan = data;
                    $scope.listRuanganT = data;
                });
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
            }

            function init() {
                $scope.isRouteLoading = true;                
                var rg = ""
                if ($scope.item.ruanganAsal != undefined) {
                    var rg = "&ruanganTujuanfk=" + $scope.item.ruanganAsal.value
                }                
                var ra = ""
                if ($scope.item.ruanganTujuan != undefined) {
                    var ra = "&ruanganAsalfk=" + $scope.item.ruanganTujuan.value
                }                
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("laundry/get-data-laporan-pencucian-linen?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    rg + ra, true).then(function (dat) {
                        $scope.isRouteLoading = false;                        
                        var data2 = dat.data.daftar
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                            if (data2[i].tglcuci != null)
                                data2[i].statuscuci = '✔'
                            else
                                data2[i].statuscuci = '-'
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            // group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });

                        // pegawaiUser = dat.data.datalogin
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('LaporanPencucianLinenUlangCtrl', chacePeriode);
                var jenispermintaanfk = '';
                var objSave = {
                    jenispermintaanfk: jenispermintaanfk,
                    tglAwal: tglAwal,
                    tglAkhir: tglAkhir
                }
            }

            $scope.klikGrid = function (data) {
                if (data != undefined) {
                    etos = data.details;
                }

            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanPencucianUlangLinen.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pencucian Ulang Linen",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "status",
                        "title": "Jenis",
                        "width": "60px"
                    },
                    {
                        "field": "tglkirim",
                        "title": "Tgl Struk",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkirim #', '')}}</span>"
                    },
                    {
                        "field": "nokirim",
                        "title": "NoTerima",
                        "width": "110px",
                    },
                    {
                        "field": "ruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                    },
                    {
                        "field": "ruangantujuan",
                        "title": "Ruangan Tujuan",
                        "width": "120px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas",
                        "width": "100px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Linen",
                        "width": "170px",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "95px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty Linen",
                        "width": "95px",
                    },
                    {
                        "field": "statuscuci",
                        "title": "Cuci",
                        "width": "70px",
                    },
                    // {
                    //     "field": "statuskirim",
                    //     "title": "Status",
                    //     "width": "70px",
                    // },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "100px",
                    }
                ]
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
            //***********************************
        }
    ]);
});
