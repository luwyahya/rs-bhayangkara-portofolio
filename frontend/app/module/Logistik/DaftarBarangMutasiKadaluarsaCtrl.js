define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarBarangMutasiKadaluarsaCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var datas = [];
            var etos = [];
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarBarangMutasiKadaluarsaCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                }
                else {
                    $scope.item.tglAwal = $scope.now;
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            function loadCombo() {
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });                              
            }

            function init() {
                $scope.isRouteLoading = true;
                var rg = ""
                if ($scope.item.namaruangantujuan != undefined) {
                    var rg = "&ruangantujuanfk=" + $scope.item.namaruangantujuan.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-mutasi-barang-expired?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nokirim=" + $scope.item.struk + rg + produkfk
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
                cacheHelper.set('DaftarBarangMutasiKadaluarsaCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.NewKirim = function () {
                $state.go('KirimBarangLogistik')
            }

            $scope.EditKirim = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di ubah!!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: '',
                    2: 'EditKirim',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                $state.go('KirimBarangLogistik')
            }

            function GetprodukBatal() {
                if ($scope.item.alasanBatal == undefined) {
                    alert("Alasan Batal Belum Diisi!!")
                    return;
                }

                var noorderfk = '';
                if ($scope.dataSelected.noorderfk != undefined) {
                    noorderfk = $scope.dataSelected.noorderfk;
                }
                medifirstService.get("logistik-stok/get-daftar-barang-batal?nokirimfk=" + $scope.dataSelected.norec +
                    "&ruanganfk=" + $scope.dataSelected.rutujuanid, true).then(function (dat) {                        
                        datas = dat.data;
                        var jumlah = 0;
                        for (var i = 0; i < datas.length; i++) {
                            if (datas[i].jumlah <= datas[i].qtyproduk) {
                                jumlah = i + 1;
                            }
                        }
                        if (etos.length <= jumlah) {

                            var strukkirim = {
                                nokrim: $scope.dataSelected.nostruk,
                                noreckirim: $scope.dataSelected.norec,
                                tglpelayanan: $scope.dataSelected.tglstruk,
                                ruanganasal: $scope.dataSelected.namaruanganasal,
                                objectruanganasal: $scope.dataSelected.ruasalid,
                                ruangantujuan: $scope.dataSelected.namaruangantujuan,
                                obejectruangantujuan: $scope.dataSelected.rutujuanid,
                                noorderfk: noorderfk,
                                jenispermintaanfk: $scope.dataSelected.jenispermintaanfk,
                                keterangan: $scope.item.alasanBatal
                            }
                            var objSave = {
                                strukkirim: strukkirim,
                                detail: etos
                            }

                            manageLogistikPhp.batalkirimbarang(objSave).then(function (e) {
                                init();
                            });

                            $scope.item.alasanBatal = "";
                            $scope.winDialog.close();

                        } else {
                            alert("Stok Telah Terpakai, Tidak Bisa Dibatalkan!!!")
                            $scope.winDialog.close();
                            return;
                        }
                    });
            }

            $scope.lanjutBatal = function () {
                GetprodukBatal()
            }

            $scope.BatalKirim = function () {                
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                $scope.winDialog.center().open();
            }

            $scope.batalBatal = function () {
                $scope.item.alasanBatal = "";
                $scope.winDialog.close();
            }

            $scope.Cetak = function () {
                var stt = 'false'
                if (confirm('View Bukti Kirim? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-pengeluaran=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "60px"
                },
                {
                    "field": "tglstruk",
                    "title": "Tgl Struk",
                    "width": "50px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "NoTerima",
                    "width": "80px",
                },
                {
                    "field": "jeniskirim",
                    "title": "Jenis Kirim",
                    "width": "80px",
                },
                {
                    "field": "namaruanganasal",
                    "title": "Nama Ruangan Asal",
                    "width": "100px",
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Nama Ruangan Tujuan",
                    "width": "100px",
                },
                {
                    "field": "petugas",
                    "title": "Petugas",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                }
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
