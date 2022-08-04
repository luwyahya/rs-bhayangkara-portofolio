define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanProduksiObatCtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper',
        function ($scope, medifirstService, $state, cacheHelper, dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('LaporanProduksiObatCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
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
                // manageLogistikPhp.getDataTableTransaksi("logistik/get-datacombo_dp", true).then(function(dat){
                //     pegawaiUser = dat.data.datalogin
                // });
                // $scope.listJenisRacikan = [{id:1,jenisracikan:'Puyer'}]
            }
            $scope.Tambah = function () {
                $state.go('PenerimaanBarangSuplier')
            }
            $scope.tambahProduksi = function () {
                $state.go('ProduksiObat')
            }
            $scope.InputSisa = function () {
                $state.go('ProduksiObatInputSisa')
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
                // var Jra =""
                // if ($scope.item.jenisRacikan != undefined){
                //     var Jra ="&jenisobatfk=" +$scope.item.jenisRacikan.id
                // }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/produksi/get-daftar-produksi-obat-detail?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur +
                    "&namarekanan=" + $scope.item.namarekanan, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            // var tanggal = $scope.now;
                            // var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                            // var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            // dat.data.daftar[i].umur =umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
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
                cacheHelper.set('LaporanProduksiObatCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
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
            $scope.EditTerima = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                $state.go('PenerimaanBarangSuplier')
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanProduksiObatCtrl.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Produksi Obat",
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
                        "width": "55px",
                    },
                    {
                        "field": "tglstruk",
                        "title": "Tgl Produksi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                    },
                    {
                        "field": "nostruk",
                        "title": "NoProduksi",
                        "width": "100px",
                    },                    
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan Penerima",
                        "width": "125px",
                    },
                    {
                        "field": "namapenerima",
                        "title": "Nama Penerima",
                        "width": "125px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "125px",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "100px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty",
                        "width": "85px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Discount",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                    },
                    {
                        "field": "hargappn",
                        "title": "PPn",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                    },
                    {
                        "field": "tglkadaluarsa",
                        "title": "Tgl Kadaluarsa",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                    },
                    {
                        "field": "nobatch",
                        "title": "nobatch",
                        "width": "100px"
                    }
                ]
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

            $scope.HapusBarangProduksi = function (current) {
                if ($scope.dataSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var data =
                {
                    norec: $scope.dataSelected.norec,
                    nostruk: $scope.dataSelected.nostruk,
                    // norecmonitoring:$scope.dataSelected.norecmonitoring,
                    // norecmonitoringdetail:$scope.dataSelected.norecmonitoringdetail, 
                    // verifikasifk: $scope.dataSelected.verifikasifk,            
                    // tglpengajuan : moment($scope.dataSelected.tglpengajuan).format('YYYY-MM-DD HH:mm'),
                    // tglsiklusawal : moment($scope.dataSelected.tglsiklusawal).format('YYYY-MM-DD HH:mm'),
                    // tglsiklusakhir : moment($scope.dataSelected.tglsiklusakhir).format('YYYY-MM-DD HH:mm')
                }

                var objSave = {
                    data: data,
                }

                medifirstService.post('farmasi/produksi/hapus-produksi-barang', objSave).then(function (e) {
                    init();
                });
            }
            //***********************************

        }
    ]);
});
