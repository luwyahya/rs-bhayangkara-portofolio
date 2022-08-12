define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapLaporanSuplierCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            ComboLoad();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('RekapLaporanSuplierCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                } else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            function ComboLoad() {
                medifirstService.get('logistik/get-combo-logistik').then(function (dat) {
                    $scope.listDataJabatan = dat.data.jabatan;
                    $scope.ruanganUser = dat.data.ruangan[0].namaruangan;
                    init();
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });

                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });

                medifirstService.getPart("logistik/get-combo-rekanan-logistik", true, true, 20).then(function (data) {
                    $scope.listRekanan = data;
                });
                init();
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
                // $scope.item.DataJabatan1 = undefined;                 
                // $scope.item.DataPegawai1 = undefined;
                // $scope.item.DataJabatan2 = undefined;                 
                // $scope.item.DataPegawai2 = undefined;
                // $scope.item.DataJabatan3 = undefined;
                // $scope.item.DataPegawai3 = undefined
            }


            $scope.Tambah = function () {
                $state.go('PenerimaanBarangSuplier')
            }


            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var namaruangan = ""
                if ($scope.ruanganUser != undefined) {
                    var namaruangan = "&namaruangan=" + $scope.ruanganUser
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var noSppb = ""
                if ($scope.item.noSppb != undefined) {
                    noSppb = "&noSppb=" + $scope.item.noSppb
                }
                var namaRekanan = ""
                if ($scope.item.namarekanan != undefined) {
                    namaRekanan = "&namarekanan=" + $scope.item.namarekanan.namarekanan
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-laporan-rekap-penerimaan-suplier?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur +
                    namaRekanan +
                    produkfk +
                    noSppb +
                    namaruangan, true).then(function (data) {
                        $scope.isRouteLoading = false;
                        var data2 = data.data.daftarR;
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {}
                            }
                        });
                        pegawaiUser = data.datalogin
                        $scope.deleteShow = true;
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
                cacheHelper.set('RekapLaporanSuplierCtrl', chacePeriode);
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
                    fileName: "RekapLaporanSuplier.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: " RS BHAYANGKARA TK IV CIANJUR Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8465000 / 8090559",
                        // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8465000 / 8090559",
                        fontSize: 18,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "45px",
                },
                {
                    "field": "namarekanan",
                    "title": "Nama Penyedia",
                    "width": "100px",
                },
                {
                    "field": "jmlitem",
                    "title": "Jml. Satuan",
                    "width": "100px",
                },
                {
                    "field": "totalharusdibayar",
                    "title": "Total Barang Rp.",
                    "width": "100px",
                    template: "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp. ')}}</span>",
                },
                {
                    "field": "totalharusdibayar",
                    "title": "Total Difaktur Rp.",
                    "width": "100px",
                    template: "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp. ')}}</span>",
                }
                    // 'sp.tglstruk', 'sp.tglfaktur', 'sp.tgljatuhtempo'
                ]
            };
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "100px",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "30px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty",
                        "width": "30px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp')}}</span>"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Discount",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                    },
                    {
                        "field": "hargappn",
                        "title": "PPn",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp')}}</span>"
                    },
                    {
                        "field": "tglkadaluarsa",
                        "title": "Tgl Kadaluarsa",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                    },
                    {
                        "field": "nobatch",
                        "title": "nobatch",
                        "width": "50px"
                    }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatNumber = function (value, currency) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn ' // + bln + ' bln'
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