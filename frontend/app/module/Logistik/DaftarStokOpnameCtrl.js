define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarStokOpnameCtrl', ['$scope', '$state', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function ($scope, $state, DateHelper, medifirstService, cacheHelper) {


            $scope.item = {};
            $scope.now = new Date();
            $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
            $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')
            $scope.isRouteLoading = false;

            $scope.selectOptionsDetailJenis = {
                // placeholder: "Pilih Detail Jenis Produk...",
                dataTextField: "detailjenisproduk",
                dataValueField: "id",
                filter: "contains"
            };
            $scope.selectOptJenisProduk = {
                // placeholder: "Pilih Jenis Produk...",
                dataTextField: "jenisproduk",
                dataValueField: "id",
                filter: "contains"
            };
            $scope.selectedJenisProduk = []
            $scope.selectedDetailJenis = []

            LoadCache()
            function LoadCache() {
                var chacePeriode = cacheHelper.get('daftarSO');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);

                }
                else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'))
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    // $scope.cari()
                }
            }

            medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {

                $scope.listJenisProduk = dat.data.jenisproduk
                $scope.listDetailJenis = dat.data.detailjenisproduk
                $scope.listRuangan = dat.data.ruangan

            });





            $scope.cari = function () {

                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');;


                var kelBarang, jenBarang, barangId, ruanganId;
                if ($scope.item.kelompokBarang === undefined) {
                    kelBarang = "";
                } else {
                    kelBarang = $scope.item.kelompokBarang.id
                }

                if ($scope.item.jenisProduk === undefined) {
                    jenBarang = "";
                } else {
                    jenBarang = $scope.item.jenisProduk.id
                }

                if ($scope.item.namaproduk === undefined) {
                    barangId = "";
                } else {
                    barangId = $scope.item.namaproduk
                }
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                } else {
                    ruanganId = ""
                }
                var listJenisProd = ""
                if ($scope.selectedJenisProduk.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedJenisProduk.length - 1; i >= 0; i--) {
                        var c = $scope.selectedJenisProduk[i].id
                        b = "," + c
                        a = a + b
                    }
                    listJenisProd = a.slice(1, a.length)
                }
                var listDetailJenis = ""
                if ($scope.selectedDetailJenis.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDetailJenis.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDetailJenis[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDetailJenis = a.slice(1, a.length)

                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,

                }
                cacheHelper.set('daftarSO', chacePeriode);

                $scope.isRouteLoading = true;
                medifirstService.get('logistik/get-daftar-so?' +
                    'tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir +
                    '&jeniskprodukid=' + listJenisProd +
                    '&ruanganfk=' + ruanganId +
                    '&namaproduk=' + barangId +
                    "&detailjenisprodukfk=" + listDetailJenis
                ).then(function (data) {
                    $scope.isRouteLoading = false;

                    $scope.dataStokOpname = new kendo.data.DataSource({
                        data: data.data.data,
                        serverPaging: false,
                        pageSize: 10,


                    });
                }, function (error) {
                    $scope.isRouteLoading = false;
                })
            }
            $scope.kl = function (current) {
                $scope.current = current;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatTanggalS = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.optionsDataStokOpname = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Stok Opname",
                    allPages: true,
                },
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Contains",
                            startswith: "Starts with"
                        }
                    }
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [
                    {
                        "field": "tglclosing",
                        "title": "Tanggal SO",
                        template: "<span class='style-left'>{{formatTanggal('#: tglclosing #')}}</span>",
                        "width": 100,
                    },
                    {
                        "field": "kdproduk",
                        "title": "Kode Barang",
                        "width": 80,
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Barang",
                        "width": 250,
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        width: 100,
                        filterable: false
                    },
                    {
                        "field": "qtyprodukreal",
                        "title": "Jumlah Sebelum SO",
                        width: 50,
                        filterable: false
                    },{
                        "field": "qtyproduksystem",
                        "title": "Jumlah Setelah SO",
                        width: 50,
                        filterable: false
                    },{
                        "field": "qtyprodukinext",
                        "title": "Selisih",
                        width: 50,
                        filterable: false
                    },
                    {
                        "field": "harga",
                        "title": "Harga Satuan",
                        "template": "<span class='style-right'>{{formatRupiah('#: harga #','Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                        width: 100,
                        filterable: false
                    },

                    {
                        "field": "total",
                        "title": "Total",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #','Rp. ')}}</span>",
                        attributes: { style: "text-align:right;" },
                        width: 100,
                        filterable: false
                    },

                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        width: 150,

                    },
                     {
                        "field": "adjustmen",
                        "title": "Keterangan",
                        width: 150,

                    },
                ],

            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }



            /***END Upload TXT */
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                manageLogistikPhp.getDataTableTransaksi("logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.columnLaporan = {
                toolbar: ["excel"],
                excel: {
                    fileName: "DataStokOpname.xls",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px"
                    },
                    {
                        "field": "tglclosing",
                        "title": "Tgl Closing",
                        "width": "90px",
                        "template": "<span class='style-left'>#: tglclosing #</span>"
                    },
                    {
                        "field": "kdproduk",
                        "title": "Kode Produk",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kdproduk #</span>"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "180px",

                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "100px"
                    },
                    {
                        "field": "farmasi",
                        "title": "Farmasi",
                        "width": "100px",
                        "template": "<span class='style-right'>#: farmasi #</span>"
                    },
                    {
                        "field": "deporajal",
                        "title": "Depo Rajal",
                        "width": "100px",
                        "template": "<span class='style-right'>#: deporajal #</span>"
                    },
                    {
                        "field": "depoinap",
                        "title": "Depo Inap",
                        "width": "100px",
                        "template": "<span class='style-right'>#: depoinap #</span>"
                    },
                    {
                        "field": "depoigd",
                        "title": "Depo IGD",
                        "width": "100px",
                        "template": "<span class='style-right'>#: depoigd #</span>"
                    },
                    {
                        "field": "depoibs",
                        "title": "Depo IBS",
                        "width": "100px",
                        "template": "<span class='style-right'>#: depoibs #</span>"
                    },
                    {
                        "field": "qtyseluruh",
                        "title": "Qty Obat",
                        "width": "150px",
                        "template": "<span class='style-right'>#: qtyseluruh #</span>"
                    },
                    {
                        "field": "harganetto1",
                        "title": "Harga Satuan",
                        "width": "100px",
                        "template": "<span class='style-right'>#: harganetto1 #</span>"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>#: total #</span>"
                    }
                ]
            };

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
            $scope.LaporanStokOpname = function () {

                    var tglawal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00');
                    var tglakhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59');
                    if ($scope.item.ruangan == undefined)
                        var ruangan = "";
                    else
                        var ruangan = $scope.item.ruangan.id;
    
                    var stt = 'false'
                    if (confirm('View Laporan Stok Opname? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // old
                    // var client = new HttpClient();        
                    // client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokopname=1&tglAwal='+tglawal+'&tglAkhir='+tglakhir+'&ruangan='+ruangan+'&view='+ stt+'&user='+ $scope.dataLogin.namaLengkap, function(response) {
                    // });
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokopname2=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&ruangan='
                     + ruangan + '&view=' + stt + '&user=' + medifirstService.getPegawaiLogin().namaLengkap, function (response) {
                    });
            
    
                // $scope.isRouteLoading = true;                
                // var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                // var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');;

                // var chacePeriode = {
                //     0: tglAwal,
                //     1: tglAkhir
                // }
                // cacheHelper.set('DaftarStokOpnameCtrl', chacePeriode);
                // medifirstService.get("logistik/get-daftar-so-detail?"
                //     + "tglAwal=" + tglAwal
                //     + "&tglAkhir=" + tglAkhir).then(function (data) {
                //         // $scope.isLoadingData = false;                        
                //         var datas = data.data.data;
                //         $scope.popup_Laporan.center().open();
                //         var data2 = [];
                //         for (var i = datas.length - 1; i >= 0; i--) {
                //             datas[i].no = i + 1
                //         }
                //         $scope.sourceLaporan = new kendo.data.DataSource({
                //             data: datas,
                //             pageSize: 10,
                //             total: data.length,
                //             serverPaging: false,
                //             schema: {
                //                 model: {
                //                     fields: {
                //                     }
                //                 }
                //             }
                //         });
                //     })

            }

        }
    ]);
});