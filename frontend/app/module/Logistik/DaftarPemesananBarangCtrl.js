define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPemesananBarangCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPemesananBarangCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            function loadCombo() {
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });
            }

            $scope.newOrder = function () {
                $state.go('OrderBarangSPPB')
            }
            
            $scope.terimaBarang = function () {
                if ($scope.dataSelected.status2 != 'Done') {
                    $state.go('PenerimaanBarangSuplier')
                    var chacePeriode = {
                        0: '',
                        1: 'SPPB',
                        2: $scope.dataSelected.norec,
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                    $state.go('PenerimaanBarangSuplier')
                } else {
                    alert('Permintaan sudah di terima!!')
                }

            }
            function init() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                medifirstService.get("logistik/get-daftar-sppb?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noorder=" + $scope.item.noSPPB +
                    "&noKontrak=" + $scope.item.noKontrak +
                    "&keterangan=" + $scope.item.keterangan +
                    "&rekanan=" + $scope.item.namaPerusahaan
                    + produkfk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            if (dat.data.daftar[i].status == 1) {
                                dat.data.daftar[i].status2 = "Done"
                            } else {
                                dat.data.daftar[i].status2 = ""
                            }
                        }
                        $scope.dataGrid = dat.data.daftar;
                        pegawaiUser = dat.data.datalogin
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
                cacheHelper.set('DaftarPemesananBarangCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.Cetak = function () {
                var stt = 'false'
                if (confirm('View SPPB? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-SPPB=1&norec=' + $scope.dataSelected.norec + '&view=true', function (response) {

                });
            }
            $scope.editOrder = function () {
                if ($scope.dataSelected.status2 != 'Done') {
                    // $state.go('OrderBarangSPPB')
                    var chacePeriode = {
                        0: $scope.dataSelected.norec,
                        1: 'EditOrder',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('OrderBarangSPPBCtrl', chacePeriode);
                    $state.go('OrderBarangSPPB', {
                        norec: $scope.dataSelected.norec,
                        noOrder: 'EditOrder'
                    });
                    // $state.go('OrderBarangSPPB')
                } else {
                    alert('Permintaan sudah di terima!!')
                }
            }
            $scope.KirimBarang = function () {
                if ($scope.dataSelected.status != 'Terima Order Barang') {
                    alert('Tidak bisa mengirim ke ruangan Sendiri!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: '',
                    1: $scope.dataSelected.norec,
                    2: 'KirimBarang',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                $state.go('KirimBarangLogistik')
            }

            $scope.HapusPenerimaan = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.nosbm != undefined) {
                    alert("Sudah di bayar tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }

                var objSave = {
                    "norec_sp": $scope.dataSelected.norec,
                }

                medifirstService.post('logistik/delete-terima-barang-suplier', objSave).then(function (e) {
                    init()
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "15px",
                },
                {
                    "field": "noorder",
                    "title": "No SPPB",
                    "width": "100px"
                },
                {
                    "field": "tglorder",
                    "title": "Tanggal",
                    "width": "35px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglorder #', '')}}</span>"
                },
                {
                    "field": "namarekanan",
                    "title": "Supplier",
                    "width": "100px",
                },
                {
                    "field": "jmlitem",
                    "title": "Item",
                    "width": "35px",
                    "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
                },
                // {
                //     "field": "keterangan",
                //     "title": "Keterangan",
                //     "width" : "80px",
                // },
                // {
                //     "field": "nokontrak",
                //     "title": "No Kontrak",
                //     "width" : "50px",
                // },
                // {
                //     "field": "tahunusulan",
                //     "title": "Tahun",
                //     "width" : "30px",
                // },
                // {
                //     "field": "totalhargasatuan",
                //     "title": "Total",
                //     "width" : "50px",
                //     "template": "<span class='style-right'>{{formatRupiah('#: totalhargasatuan #', '')}}</span>"
                // },
                {
                    "field": "petugas",
                    "title": "Pembuat PO",
                    "width": "100px",
                },
                // {
                //     "field": "status2",
                //     "title": "Status",
                //     "width" : "40px",
                // }
            ];
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
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
                            "template": "<span class='style-right'>{{formatRupiah('#: qtyproduk #', '')}}</span>"
                        },
                        {
                            "field": "qtyterimalast",
                            "title": "Sdh Terima",
                            "width": "30px",
                            "template": "<span class='style-right'>{{formatRupiah('#: qtyterimalast #', '')}}</span>"
                        },
                        // {
                        //     "field": "qtyprodukkonfirmasi",
                        //     "title": "Qty",
                        //     "width" : "30px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: qtyprodukkonfirmasi #', '')}}</span>"
                        // },
                        {
                            "field": "hargasatuan",
                            "title": "Harga Satuan",
                            "width": "30px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                        },
                        {
                            "field": "hargadiscount",
                            "title": "Disc%",
                            "width": "30px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                        },
                        {
                            "field": "hargappn",
                            "title": "Ppn%",
                            "width": "30px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                        },
                        // {
                        //     "field": "totalkonfirmasi",
                        //     "title": "Total",
                        //     "width" : "30px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: totalkonfirmasi #', '')}}</span>"
                        // },
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "30px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn '// + bln + ' bln'
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
