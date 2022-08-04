define(['initialize', 'Configuration'], function(initialize, config) {
    'use strict';
    initialize.controller('TransaksiDiagnosaCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$window',
        function($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $window) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
                // var pegawaiUser = {}

            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var jenisPelayananId = ''
                // $scope.item.tglAwal = $scope.now;
                // $scope.item.tglAkhir = $scope.now;
            var detail = ''
            $scope.header.DataNoregis = true
            LoadCacheHelper();

            function LoadCacheHelper() {
                debugger;
                var chacePeriode = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    namaRuanganFk = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                        // if ($scope.header.DataNoregis == undefined) {
                        //     $scope.header.DataNoregis = false;
                        // }
                    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        $scope.showTombol = true
                    }
                    // medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
                    //     $scope.item.noregistrasi, true).then(function (dat) {
                    //         $scope.item.statusVerif = dat.data.status
                    //     });
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function(rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        }
                    })
                    medifirstService.get('sysadmin/general/get-jenis-pelayanan/' + norec_pd).then(function(e) {
                            jenisPelayananId = e.data.jenispelayanan
                            init()
                        })
                        //** */
                }

            }
            //    modelItemAkuntansi.getDataDummyPHP('pelayanan/get-produk-penunjang-part',true,10,10).then(function(e){
            //     $scope.listLayanan = e
            //    })
            $scope.getProduk = function(ruangan) {
                    var RuangRanap = "&Ruangan=" + $scope.item.namaRuangan;
                    medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan=" +
                            ruangan.id +
                            "&idKelas=" +
                            6 +
                            RuangRanap +
                            "&idJenisPelayanan=" +
                            jenisPelayananId, true, 10, 10)
                        .then(function(x) {
                            $scope.listLayanan = x;
                            //    $scope.isRouteLoading = false;

                        })
                }
                // $scope.$watch('item.ruangantujuan', function (newValue, oldValue) {
                //     var RuangRanap = "&Ruangan=" + $scope.item.namaRuangan;
                //     if (newValue != undefined && jenisPelayananId != '' && $scope.item.namaRuangan!= undefined) {

            //         medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan="
            //             + newValue.id
            //             + "&idKelas="
            //             + 6
            //             + RuangRanap
            //             + "&idJenisPelayanan="
            //             + jenisPelayananId, true, 10, 10)
            //             .then(function (x) {
            //                 $scope.listLayanan = x;
            //                 //    $scope.isRouteLoading = false;

            //             })

            //         //  modelItemAkuntansi.getDataDummyPHPV2('pelayanan/get-produk-penunjang-part?idRuangan='+newValue.id,true,10,10).then(function(e){
            //         //      $scope.listLayanan = e
            //         //  })
            //     }

            // })
            //  LoadCache();
            //  function LoadCache(){
            //      var chacePeriode = cacheHelper.get('TransaksiPelayananRadiologiCtrl');
            //      if(chacePeriode != undefined){
            //          norec_apd = chacePeriode[0]
            //          nocm_str = chacePeriode[1]
            //          // $scope.item.ruanganAsal = namaRuangan;
            //          // medifirstService.get("logistik/get_detailPD?norec_apd="+norec_apd, true).then(function(data_ih){
            //          //     $scope.item.jenisPenjamin = data_ih.data.detailPD[0].namarekanan
            //          //     $scope.item.kelompokPasien = data_ih.data.detailPD[0].kelompokpasien
            //          //     $scope.item.beratBadan = data_ih.data.detailPD[0].beratbadan
            //          // });
            //          init()
            //     }else{

            //     }

            // }
            $scope.setRuangan = function() {
                $scope.listRuanganTujuan = $scope.item.instalasi.ruangan
            }

            function init() {
                debugger;
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()

                medifirstService.get("emr/get-diagnosa?noregistrasi=" + $scope.item.noregistrasi, true).then(function(dat) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.isLoading = false;

                        debugger
                        $scope.dataGridRadio = {
                            data: dat.data,
                            _data: dat.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]

                        };
                    },
                    function(error) {
                        $scope.isLoading = false;
                    });


            }

            function loadRiwayat(params) {
                medifirstService.get('emr/get-riwayat-order-radiologi?' + params).then(function(e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
            }
            $rootScope.getRekamMedisCheck = function(bool) {
                if (bool) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)
                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }
            }
            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "ruangan",
                    "title": "Nama Ruangan",
                    "width": "140px"
                },
                {
                    "field": "produkfk",
                    "title": "Kode",
                    "width": "40px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "80px"
                }
            ];

            $scope.columnGridOrder = [{
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty",
                    "width": "40px",
                }
            ];
            $scope.columnGridRiwayat = [{
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                }
            ];
            $scope.detailGridOptions = function(dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                            field: "no",
                            title: "No",
                            width: "30px"
                        },
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "300px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        },
                        {
                            "command": [{
                                    text: "Expertise",
                                    click: experTise,
                                    imageClass: "k-icon k-i-pencil"
                                },
                                {
                                    text: "Lihat Hasil",
                                    click: hasil,
                                    imageClass: "k-icon k-i-download"
                                },
                                {
                                    text: "Cetak",
                                    click: cetakHasil,
                                    imageClass: "k-icon k-i-search"
                                }
                            ],
                            title: "",
                            width: "150px",
                        }
                    ]
                };
            };



            $scope.kembali = function() {
                debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: norec_apd,
                    emr: 'LaporanOperasi',
                });
            }


            medifirstService.get("radiologi/get-data-combo-labrad").then(function(dat) {

                $scope.listDokter = dat.data.dokter;
            })




            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            // $scope.click = function(dataSelectedRiwayat) {
            //     if (dataSelectedRiwayat != undefined) {
            //         $scope.noOrder = dataSelectedRiwayat.noorder;
            //         medifirstService.get("sysadmin/general/get-acc-number-radiologi?noOrder=" + $scope.noOrder)
            //             .then(function(e) {
            //                 $scope.dataRisOrder = e.data.data[0]

            //             })
            //     }
            // }






            $scope.columnGridRadio = {
                scrollable: true,
                selectable: false,
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        // attributes: {
                        //     // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        // },
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "90px",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No registrasi",
                        "width": "90px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "90px",
                    },
                    {
                        "field": "jenisdiagnosa",
                        "title": "Jenis",
                        "width": "90px",
                    },
                    {
                        "field": "kddiagnosa",
                        "title": "Kode Diagnosa",
                        "width": "90px",
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Nama Diagnosa",
                        "width": "90px",
                    }
                ]
            }

            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1