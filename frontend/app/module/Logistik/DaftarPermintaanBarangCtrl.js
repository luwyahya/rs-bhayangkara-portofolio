define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPermintaanBarangCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.button = false
            var pegawaiUser = {}
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPermintaanBarangCtrl');
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
            $scope.Tambah = function () {
                $state.go('UsulanPelaksanaanKegiatan')
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-permintaaan-barang-ruangan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur +
                    "&namarekanan=" + $scope.item.namarekanan
                    + produkfk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
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
                cacheHelper.set('DaftarPermintaanBarangCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.newSPPB = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'BuatSPPB',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('OrderBarangSPPBCtrl', chacePeriode);
                $state.go('OrderBarangSPPB', {
                    norec: $scope.dataSelected.norec,
                    noOrder: 'BuatSPPB'
                });
            }

            $scope.CetakRincian = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rincian-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }
            $scope.CetakBukti = function () {
                var stt = 'false'
                if (confirm('View Bukti UPK? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }
            $scope.Cetak = function () {
                var stt = 'false'
                if (confirm('View Bukti UPK? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-usulanpelaksanaankegiatan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt, function (response) {
                    //aadc=response;
                });
            }

            $scope.pph = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PenentuanPpndanPphCtrl', chacePeriode);
                $state.go('PenentuanPpndanPph')
            }

            $scope.EditTerima = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'BuatSPK',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InputSPKCtrl', chacePeriode);
                $state.go('InputSPK', {
                    norec: $scope.dataSelected.norec,
                    noOrder: 'BuatSPK'
                });
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
                manageLogistikPhp.get("penerimaan-suplier/delete-terima-barang-suplier?" + "norec_sp=" + $scope.dataSelected.norec, true).then(function (dat) {
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
                    "width": "35px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Usulan",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglorder #', '')}}</span>"
                },
                {
                    "field": "tglkebutuhan",
                    "title": "Tgl Kebutuhan",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglkebutuhan #', '')}}</span>"
                },
                {
                    "field": "noorder",
                    "title": "No Usulan",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Jenis Usulan",
                    "width": "120px",
                },
                {
                    "field": "koordinator",
                    "title": "Koordinator Barang",
                    "width": "60px",
                },
                {
                    "field": "ruangan",
                    "title": "Unit Pengusul",
                    "width": "120px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Unit Tujuan",
                    "width": "120px",
                },
                {
                    "field": "penanggungjawab",
                    "title": "Penanggung Jawab",
                    "width": "100px",
                },
                {
                    "field": "mengetahui",
                    "title": "Mengetahui",
                    "width": "100px",
                },
                // {
                //     "field": "noverifikasi",
                //     "title": "No Confirm",
                //     "width": "100px",
                //     // "template": '# if( noverifikasi==null) {#<span class="center">-<span># } #',

                // },
                // {
                //     "field": "noorderhps",
                //     "title": "No Confirm HPS",
                //     "width": "100px",
                //     // "template": '# if( noverifikasi==null) {#<span class="center">-<span># } #',

                // },
                // {
                //     "field": "tglverifikasi",
                //     "title": "Tgl Verifikasi",
                //     "width": "100px",
                //     "template": '# if( tglverifikasi==null) {#<span class="center">-<span># } else {#<span>#= kendo.toString(new Date(tglverifikasi), "dd-MM-yyyy HH:mm") #<span>#} #',
                //     // "template": "<span class='style-right'>{{formatTanggal('#: tglverifikasi #', '')}}</span>"
                // }
            ];
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "tglkebutuhan",
                            "title": " Kebutuhan",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatTanggal('#: tglkebutuhan #', '')}}</span>"
                        },
                        {
                            "field": "prid",
                            "title": "Kode Produk",
                            "width": "40px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "90px",
                        },
                        {
                            "field": "spesifikasi",
                            "title": "Spesifikasi",
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
                            "width": "20px",
                        },
                        {
                            "field": "qtyprodukkonfirmasi",
                            "title": "Qty Confirm",
                            "width": "40px",
                        },
                        {
                            "field": "hargasatuan",
                            "title": "Harga Satuan",
                            "width": "40px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                        },
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        },
                        {
                            "field": "hargasatuanquo",
                            "title": "Harga Konfirmasi",
                            "width": "40px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuanquo #', '')}}</span>"
                        },
                        {
                            "field": "hargappnquo",
                            "title": "ppn Konfirmasi",
                            "width": "40px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargappnquo #', '')}}</span>"
                        },
                        {
                            "field": "hargadiscountquo",
                            "title": "Diskon Konfirmasi",
                            "width": "40px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargadiscountquo #', '')}}</span>"
                        },
                        {
                            "field": "totalkonfirmasi",
                            "title": "Total Confirm",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: totalkonfirmasi #', '')}}</span>"
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
