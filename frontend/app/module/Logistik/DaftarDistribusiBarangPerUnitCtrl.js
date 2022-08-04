define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarDistribusiBarangPerUnitCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarDistribusiBarangPerUnitCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                } else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }

            function loadCombo() {
                $scope.listJenisKirim = [{ id: 1, jenis: 'Amprahan' }, { id: 2, jenis: 'Transfer' }]
                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    var dataCombo = data.data;
                    $scope.listRuanganAsal = dataCombo.ruanganall;
                    $scope.listRuangan = dataCombo.ruanganall;
                    $scope.listKelompokBarang = dataCombo.kelompokproduk;
                    $scope.listJenisProduk = dataCombo.jenisproduk;
                    $scope.listAsalProduk = dataCombo.asalproduk;

                });
            }
            $scope.getJenisProduk = function () {
                var data = []
                for (let i = 0; i < $scope.listJenisProduk.length; i++) {
                    const element = $scope.listJenisProduk[i];
                    if (element.objectkelompokprodukfk == $scope.item.kelompokBarang.id) {
                        data.push(element)
                    }
                }

                $scope.listJenisBarang = data
            }
            function init() {
                $scope.isRouteLoading = true;
                var ra = ""
                if ($scope.item.RuanganAsal != undefined) {
                    var ra = "&ruanganasalfk=" + $scope.item.RuanganAsal.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangantujuanfk=" + $scope.item.ruangan.id
                }
                var namaProduk = ""
                if ($scope.item.NamaBarang != undefined) {
                    var namaProduk = "&namaproduk=" + $scope.item.NamaBarang
                }

                //*Filter Baru

                var AsalProduk = ""
                if ($scope.item.AsalProduk != undefined) {
                    var AsalProduk = "&AsalProduk=" + $scope.item.AsalProduk.id
                }
                var kelompokProduk = ""
                if ($scope.item.kelompokProduk != undefined) {
                    var kelompokProduk = "&kelompokProduk=" + $scope.item.kelompokProduk.id
                }
                var jenisProduk = ""
                if ($scope.item.jenisProduk != undefined) {
                    var jenisProduk = "&jenisProduk=" + $scope.item.jenisProduk.id
                }
                //*End Filter Baru
                var KdSirs1 = ""
                if ($scope.item.KdSirs1 != undefined) {
                    KdSirs1 = "&KdSirs1=" + $scope.item.KdSirs1
                }
                var KdSirs2 = ""
                if ($scope.item.KdSirs2 != undefined) {
                    KdSirs2 = "&KdSirs2=" + $scope.item.KdSirs2
                }
                var jenisPengirim = ""
                if ($scope.item.jenisKirim != undefined) {
                    var jenisPengirim = "&jenisPengirim=" + $scope.item.jenisKirim.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-distribusi-barang-perunit?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nokirim=" + $scope.item.struk + ra + rg + AsalProduk + KdSirs1 + KdSirs2 +
                    kelompokProduk + jenisProduk + namaProduk + jenisPengirim
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data;
                        var jenistransfer = '';
                        var subtotal = 0;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                            // datas[i].statCheckbox = false;
                            if (datas[i].jenispermintaanfk == 1) {
                                jenistransfer = "Amprahan";
                            } else {
                                jenistransfer = "Transfer";
                            }
                            datas[i].jenispermintaan = jenistransfer;
                            subtotal = parseFloat(datas[i].total) + subtotal
                        }
                        $scope.subTotals = subtotal
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 100,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
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
                cacheHelper.set('DaftarDistribusiBarangPerUnitCtrl', chacePeriode);


            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
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

            $scope.group = {
                field: "ruanganasal",
                aggregates: [
                    {
                        field: "ruanganasal",
                        aggregate: "count"
                    }
                ]
            };
            $scope.aggregate = [
                {
                    field: "ruanganasal",
                    aggregate: "count"
                }
            ]

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Laporan Distribusi Barang Per Unit  " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglAkhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Rekap Pengeluaran Barang Gudang",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 20 });
                },
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglkirim",
                        "title": "Tanggal",
                        "width": "60px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkirim #', '')}}</span>"
                    },
                    {
                        "field": "nokirim",
                        "title": "No Pengeluaran",
                        "width": "80px",
                    },
                    {
                        "field": "ruangantujuan",
                        "title": "Ruangan Tujuan",
                        "width": "80px",
                    },
                    {
                        hidden: true,
                        "field": "ruanganasal",
                        "title": "Ruangan Asal",
                        "width": "80px",
                    },
                    {
                        "field": "kodebarang",
                        "title": "Kode Produk",
                        "width": "70px"
                    },
                    {
                        "field": "kdsirs",
                        "title": "Kode Sirs",
                        "width": "70px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Barang",
                        "width": "100px",
                    },
                    {
                        "field": "jenispermintaan",
                        "title": "Jenis Pengeluaran",
                        "width": "60px",
                    },

                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "80px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty",
                        "width": "50px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "90px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp. ')}}</span>",
                    },
                    {
                        "field": "total",
                        "title": "Nilai",
                        "width": "120px",
                        // aggregates:["sum"],
                        template: "<span class='style-right'>{{formatRupiah('#: total #', 'Rp. ')}}</span>",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah(subTotals,'Rp. ')}}</span>" 
                    },
                    // {
                    //     hidden: true,
                    //     field: "namaruangan",
                    //     title: "Nama Ruangan",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                    // }
                ]
            }

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

            $scope.formatRupiah = function (value, number) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, ",");
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

            $scope.CetakDaftar = function(){
                var user = medifirstService.getPegawaiLogin();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59:59');
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = $scope.item.ruangan.id
                }

                var ra = ""
                if ($scope.item.RuanganAsal != undefined) {
                    var ra = $scope.item.RuanganAsal.id
                }

                var jenisPengirim = ""
                if ($scope.item.jenisKirim != undefined) {
                    var jenisPengirim = $scope.item.jenisKirim.id
                }

                var stt = 'false'
                if (confirm('View Daftar Pengeluaran Barang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-daftar-pengeluaran-barang=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuanganAsal=' + ra +'&idRuanganTuj=' + rg + '&jenisPengiriman=' + jenisPengirim + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                    //aadc=response;
                });
            }

            //***********************************
        }
    ]);
});
