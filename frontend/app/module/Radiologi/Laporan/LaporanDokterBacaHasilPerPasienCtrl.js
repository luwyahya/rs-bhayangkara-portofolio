define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('LaporanDokterBacaHasilPerPasienCtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper', '$window',
        function ($scope, medifirstService, $state, cacheHelper, DateHelper, $window) {
            $scope.item = {};
            // $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isLoading = false;
            var norec_apd = ''
            var norec_pd = ''
            var norecPPas = ''
            var aaa = [];
            $scope.dataPasienSelected = {};
            $scope.istempatLaporan = true;
            $scope.cboUbahDokter = true;
            var norec_so = ''
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var departemenfk = ''
            var tglpulang = ''
            var norecpp_array = [];
            var arrPush = []
            $scope.beforeedit = {};
            $scope.ruanganasaldirujuk = "";

            $scope.item = {
                tglInput: new Date(),
                tglInputCetak: new Date()
            };
            var urlHasilVansLab = ''
            medifirstService.get('sysadmin/settingdatafixed/get/urlHasilVansLab').then(function (dat) {
                urlHasilVansLab = dat.data

            })
            LoadCache();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('RincianTagihanPenunjang');
                if (chacePeriode != undefined) {
                    //
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.kelompokPasien = chacePeriode[13]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{
                        id: chacePeriode[5],
                        namakelas: chacePeriode[6]
                    }])
                    $scope.item.kelas = {
                        id: chacePeriode[5],
                        namakelas: chacePeriode[6]
                    }
                    $scope.item.tglRegistrasi = chacePeriode[7]
                    $scope.item.dokter = chacePeriode[14]
                    norec_apd = chacePeriode[8]
                    namaRuangan = chacePeriode[9]
                    namaRuanganFk = chacePeriode[10]
                    norec_pd = chacePeriode[11]
                    norec_so = chacePeriode[12]
                    departemenfk = chacePeriode[16]
                    $scope.item.jenisPenjamin = chacePeriode[17]
                    $scope.item.golonganDarah = chacePeriode[19]
                    tglpulang = chacePeriode[20]
                    $scope.ruanganasaldirujuk = {
                        id: chacePeriode[21],
                        namaruangan: chacePeriode[22]
                    }

                    //  ** cek status closing
                    // medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                    //     if (rese.data.status == true) {
                    //         toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                    //         $scope.isSelesaiPeriksa = true
                    //     }
                    // })




                    $scope.item.ruanganAsal = namaRuangan;

                    // medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                    //     $scope.item.noregistrasi, true).then(function (dat) {
                    //     $scope.item.statusVerif = dat.data.status
                    // });

                    init()

                } else {

                }

                var chacePeriode = cacheHelper.get('DaftarPasienPenunjang');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.namaPasien = chacePeriode[2];

                    init();
                } else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }

            }
            loadEditor()

            function init() {

                $scope.isLoading = true;

                medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                    $scope.listruangan = dat.data.ruangan;
                    // $scope.listLayanan = dat.data.produk;
                    $scope.listDokter = dat.data.dokter;
                    $scope.listTemplate = dat.data.datatemplet;
                })
                // if (norec_apd != null) {
                // noregistrasifk=" + norec_apd 
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var namaPasien = $scope.item.namaPasien
                medifirstService.get("radiologi/get-laporan-dokter-baca?" +
                    "namaPasien=" + namaPasien +
                    "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {

                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }

                        // for (var i = 0; i < dat.data.data.length; i++) {
                        //     //
                        //     dat.data.data[i].no = i + 1
                        //     dat.data.data[i].statCheckbox = false;
                        //     if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                        //         dat.data.data[i].statusbridging = "✔";
                        //         // ✅
                        //         // ✔
                        //     } else {
                        //         dat.data.data[i].statusbridging = "✘";
                        //         // ✘
                        //         // ❎
                        //     }
                        //     if (dat.data.data[i].iscito == "1") {
                        //         dat.data.data[i].statuscito = "✔";
                        //         // ✅
                        //         // ✔
                        //     } else {
                        //         dat.data.data[i].statuscito = "✘";
                        //         // ✘
                        //         // ❎
                        //     }
                        //     if (dat.data.data[i].statusperiksa == 1) {
                        //         dat.data.data[i].statusperiksa = "✔";
                        //     } else {
                        //         dat.data.data[i].statusperiksa = "✘";
                        //     }

                        // }
                        if (dat.data.data.length > 0) {
                            if (dat.data.data[0].objectdepartemenfk == 3)
                                $scope.disableRad = true
                            // $scope.disableDna = true
                            if (dat.data.data[0].objectdepartemenfk == 27)
                                $scope.disableLab = true
                            // $scope.disableDna = true
                            if (dat.data.data[0].objectruanganfk == 575)
                                $scope.disablePenjamin = true
                        }
                        $scope.isLoading = false;
                        debugger
                        arrPush = []
                        for (var i = 0; i <= dat.data.data.length - 1; i++) {
                            arrPush.push({
                                no: dat.data.data[i].no,
                                tanggalekpertise: dat.data.data[i].tanggalekpertise,
                                namapasien: dat.data.data[i].namapasien,
                                nofoto: dat.data.data[i].nofoto,
                                kelompokpasien: dat.data.data[i].kelompokpasien,
                                dokterbaca: dat.data.data[i].dokterbaca,
                            })
                        }

                        $scope.dataGrid = {
                            data: dat.data.data,
                            _data: dat.data.data,
                            pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.data.length,
                            serverPaging: false,
                            aggregate: [{
                                field: 'total',
                                aggregate: 'sum'
                            },]

                        };

                        if (dat.data.data[0].objectdepartemenfk == 27) {
                            $scope.showRadiologi = true;
                        }

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
                // } else {
                // $scope.isLoading = false;
                // }


            }
            medifirstService.get("tatarekening/get-combo-penjamin").then(function (dat) {
                $scope.listUbahPenjamin = dat.data.penjamin;
                $scope.listUbahRekanan = dat.data.rekanan;
            })


            $scope.SaveUbahPenjamin = function () {
                //;
                if ($scope.item.ubahpenjamin == undefined) {
                    toastr.error('Penjamin belum dipilih !', 'Warning !')
                    return;
                }
                if ($scope.item.password2 != "ubahpenjamin") {
                    toastr.error("Password Salah !")
                    return;
                }
                // var 
                var dataJson = {
                    noregistrasi: $scope.item.noregistrasi,
                    penjamin: $scope.item.ubahpenjamin.id,
                }
                var ubahPenjamin = {
                    noregistrasi: $scope.item.noregistrasi,
                    penjamin: $scope.item.ubahpenjamin.penjamin,
                    penjaminasal: $scope.item.kelompokPasien

                }
                medifirstService.post('tatarekening/save-update-penjamin-lab', dataJson).then(function (e) {



                    $scope.popupUbahPenjamin.close();
                })
                medifirstService.post('rawatinap/save-logging-ubah-penjamin', ubahPenjamin).then(function (dat) {

                })
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            // $("#kGrid").kendoGrid({
            //     toolbar: ["excel"],
            //     // , "pdf"],

            //     excel: {
            //         fileName: "LaporanWaktuTungguRadiologi.xlsx",
            //         allPages: true,

            //         // },
            //         // pdf: {
            //         //     fileName: "LaporanPasienMasuk.pdf",
            //         //     allPages: true,
            //         // },

            //         // dataSource: $scope.dataExcel,
            //         sortable: true,
            //         // reorderable: true,
            //         // filterable: true,
            //         pageable: true,
            //         // groupable: true,
            //         // columnMenu: true,
            //         resizable: true,
            //     },

            //     excelExport: function (e) {
            //         var sheet = e.workbook.sheets[0];
            //         sheet.frozenRows = 2;
            //         sheet.mergedCells = ["A1:J1"];
            //         sheet.name = "LAPORAN";

            //         var myHeaders = [

            //             {
            //                 value: "LAPORAN WAKTU TUNGGU HASIL RADIOLOGIxx " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY h:m:s') + ' SAMPAI ' +
            //                     DateHelper.formatDate($scope.item.tglAkhir, 'DD-MM-YY h:m:s'),
            //                 fontSize: 15,
            //                 textAlign: "center",
            //                 background: "#c1d2d2",
            //                 // color:"#ffffff"
            //             }
            //         ];

            //         sheet.rows.splice(0, 0, {
            //             cells: myHeaders,
            //             type: "header",
            //             height: 50
            //         });
            //     },
            //     columns: [{
            //             "field": "no",
            //             "title": "No",
            //             "width": "30px",
            //             attributes: {
            //                 // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
            //             },
            //         },
            //         {
            //             "field": "tglpelayanan",
            //             "title": "Hari/Tanggal ",
            //             "width": "90px",
            //             attributes: {
            //                 // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
            //             },
            //         },
            //         {
            //             "field": "namapasien",
            //             "title": "Nama Pasien",
            //             "width": "120px",
            //             attributes: {
            //                 // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
            //             },
            //         },
            //         {
            //             "field": "nocm",
            //             "title": "No. Mr",
            //             "width": "120px",
            //             attributes: {
            //                 // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
            //             },
            //         },
            //         {
            //             "field": "namaexternal",
            //             "title": "Layanan",
            //             "width": "160px",
            //             attributes: {
            //                 // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
            //             },
            //         },
            //         {
            //             "field": "jampelayanan",
            //             "title": "Jam Pendaftaran",
            //             "width": "100px"

            //         },

            //         {
            //             "field": "jampelayanan",
            //             "title": "Jam Seleesai Pemeriksaan",
            //             "width": "100px"

            //         },
            //         {
            //             "field": "jamekpertise",
            //             "title": "Jam Ekpretise Hasil",
            //             "width": "100px"

            //         },
            //         {
            //             "field": "tanggalekpertise",
            //             "title": "Tanggal Ekpertise Hasil",
            //             "width": "100px"

            //         }

            //     ],

            // });
            $scope.columnGrid = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Waktu Tunggu Radiologi.xlsx",
                    allPages: true,

                    // },
                    // pdf: {
                    //     fileName: "LaporanPasienMasuk.pdf",
                    //     allPages: true,
                    // },

                    // dataSource: $scope.dataExcel,
                    sortable: true,
                    // reorderable: true,
                    // filterable: true,
                    pageable: true,
                    // groupable: true,
                    // columnMenu: true,
                    resizable: true,
                },

                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:I1"];
                    sheet.name = "LAPORAN";
                    var nama = ''
                    if ($scope.item.namaPasien != '' || $scope.item.namaPasien != undefined) {
                        nama = ' ATAS NAMA ' + $scope.item.namaPasien

                    }


                    var myHeaders = [

                        {
                            // value: "LAPORAN WAKTU TUNGGU HASIL RADIOLOGIxx " + DateHelper.formatDate($scope.item.tglAwal, 'DD-MM-YY') + ' SAMPAI ' +
                            //     DateHelper.formatDate($scope.item.tglAkhir, 'DD-MM-YY') + nama,
                            value: "Laporan Dokter Baca Hasil PerPasien",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 50
                    });
                },
                columns: [
                    // {
                    //     "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    //     template: "# if (statCheckbox) { #" +
                    //         "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    //         "# } else { #" +
                    //         "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    //         "# } #",
                    //     width: "30px",
                    //     attributes: {
                    //         // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    {
                        "field": "no",
                        "title": "No.",
                        "width": "10px",
                        attributes: {
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    // {
                    //     "field": "tglpendaftaran",
                    //     "title": "Hari/Tanggal ",
                    //     "width": "90px",
                    //     attributes: {
                    //         // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    {
                        "field": "tanggalekpertise",
                        "title": "Tanggal Baca",
                        "width": "60px"

                    },
                    {
                        "field": "nocm",
                        "title": "Medrec",
                        "width": "60px"

                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px",
                        attributes: {
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "nofoto",
                        "title": "No Foto",
                        "width": "60px",
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Customer",
                        "width": "120px",
                    },
                    {
                        "field": "dokterbaca",
                        "title": "Dokter Yang Membaca",
                        "width": "120px",
                    },

                    // {
                    //     "field": "ruanganasal",
                    //     "title": "Asal Pasien",
                    //     "width": "120px",
                    //     attributes: {
                    //         // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },

                    // {
                    //     "field": "produkfk",
                    //     "title": "Kode",
                    //     "width" : "70px",
                    // },
                    // {
                    //     "field": "namaexternal",
                    //     "title": "Jenis Permintaan Rontgen",
                    //     "width": "160px",
                    //     attributes: {
                    //         // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "dokter",
                    //     "title": "Dokter Pemeriksa",
                    //     "width": "140px",
                    //     attributes: {
                    //         // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     hidden = true,
                    //     "field": "dokterid",
                    //     "title": "idDokterPemeriksa",
                    //     "width": "100px",
                    //  },
                    // {
                    //     "field": "dokterpengirim",
                    //     "title": "Dokter Pengririm",
                    //     "width": "140px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "jumlah",
                    //     "title": "Qty",
                    //     "width": "40px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "hargasatuan",
                    //     "title": "Harga Satuan",
                    //     "width": "100px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "hargadiscount",
                    //     "title": "Diskon",
                    //     "width": "80px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                    //     // footerTemplate: "<span class='style-center'>Total</span>",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "jasa",
                    //     "title": "Jasa Cito",
                    //     "width": "80px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                    //     footerTemplate: "<span class='style-center'>Total</span>",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "total",
                    //     "title": "Total",
                    //     "width": "100px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                    //     aggregates: ["sum"],
                    //     groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                    //     footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "noorder",
                    //     "title": "No Order",
                    //     "width": "100px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "nostruk",
                    //     "title": "No Struk",
                    //     "width": "80px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "statusbridging",
                    //     "title": "Status Kirim",
                    //     "width": "50px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "statusperiksa",
                    //     "title": "Status Periksa",
                    //     "width": "100px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },

                    // },

                    // {
                    //     "field": "jampendaftaran",
                    //     "title": "Jam Pendaftaran",
                    //     "width": "100px"

                    // },

                    // {
                    //     "field": "jampelayanan",
                    //     "title": "Jam Seleesai Pemeriksaan",
                    //     "width": "100px"

                    // },
                    // {
                    //     "field": "jamekpertise",
                    //     "title": "Jam Ekpretise Hasil",
                    //     "width": "100px"

                    // },

                    // {
                    //     "field": "statuscito",
                    //     "title": "Status Cito",
                    //     "width": "100px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },
                    // },
                    // {
                    //     "field": "nofoto",
                    //     "title": "No Foto",
                    //     "width": "100px",
                    //     attributes: {
                    //         class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //     },

                    // }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                // ,
                // pageable:{
                //     messages: {
                //         display: "Menampilkan {0} - {1} data dari {2} data"
                //     },
                //     refresh: true,
                //     pageSizes: true,
                //     buttonCount: 5

                // }
            }




            // $scope.selectRow = function (dataItem) {
            //     var dataSelect = _.find($scope.dataGrid._data, function (data) {
            //         // aaa = {
            //         //         'produkfk' : dataItem.produkfk
            //         // }
            //         // return data.produkfk == dataItem.produkfk;
            //         return data.norec_pp == dataItem.norec_pp;
            //     });

            //     if (dataSelect.statCheckbox) {
            //         dataSelect.statCheckbox = false;
            //     } else {
            //         dataSelect.statCheckbox = true;
            //     }

            //     $scope.tempCheckbox = dataSelect.statCheckbox;

            //     reloadDataGrid($scope.dataGrid._data);

            // }
            // var isCheckAll = false
            // $scope.selectUnselectAllRow = function () {
            //     //
            //     var tempData = $scope.dataGrid._data;

            //     if (isCheckAll) {
            //         isCheckAll = false;
            //         for (var i = 0; i < tempData.length; i++) {
            //             tempData[i].statCheckbox = false;
            //         }
            //     } else {
            //         isCheckAll = true;
            //         for (var i = 0; i < tempData.length; i++) {
            //             tempData[i].statCheckbox = true;
            //         }
            //     }

            //     reloadDataGrid(tempData);
            // }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    _data: ds,
                    // pageSize: 10,
                    total: ds.length,
                    serverPaging: false,
                    aggregate: [{
                        field: 'total',
                        aggregate: 'sum'
                    },]

                });

                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }


            $scope.cariFilter = function () {

                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.item.namaPasien,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPasienPenunjang', chacePeriode);
            }



            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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




            var handleFileSelect = function (evt) {
                //
                var files = evt.target.files;
                var file = files[0];
                if (file.type != "application/pdf") {
                    toastr.error('Mohon Pilih File Pdf (.pdf)')
                    return
                }
                var a = evt.target.files[0].name;

                // var ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png"];
                // var extension = evt.target.files[0].indexOf(extension);
                // if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                //     toastr.error('Mohon Pilih File Gambar (.jpg, .jpeg, .png)')
                //     e.preventDefault();
                //     // return
                // }

                if (files && file) {
                    var reader = new FileReader();

                    reader.onload = function (readerEvt) {
                        var binaryString = readerEvt.target.result;
                        document.getElementById("base64textarea").value = btoa(binaryString);
                        document.getElementById("base64textarea").name = a;
                    };

                    reader.readAsBinaryString(file);
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }






            function dynamicEditor(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="hasil" data-bind="value:hasil">');
                input.appendTo(container);
                // }
            };

            $("#editor").kendoEditor({
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"
                ],
                resizable: {
                    content: true,
                    toolbar: true
                }
            });
            $scope.itemdok = {}
            $scope.model = {}



            $scope.clickD = function (dataDokterSelected) {
                if (dataDokterSelected != undefined) {
                    medifirstService.get("tatarekening/get-pegawai-saeutik?namapegawai=" + dataDokterSelected.namalengkap, true, true, 10)
                        .then(function (data) {

                            $scope.listPegawaiPemeriksa.add(data.data[0])
                            $scope.model.pegawais = data.data[0];

                        })
                    $scope.model.jenisPelaksana = {
                        id: dataDokterSelected.jpp_id,
                        jenisPetugasPelaksana: dataDokterSelected.jenispetugaspe
                    }

                }
            }
            $scope.itemPA = {}


            $scope.batalPA = function () {
                $scope.norecPA = ''
                $scope.itemPA = {}
                // $scope.findBy = 1
                // $scope.itemPA.tglInput = new Date()
                $scope.popUpPA.close();
            }

            $scope.saveLabPa = function () {


                // return
                // if ($scope.itemdok.NoPa == undefined) {
                //     window.messageContainer.error("Nomor Pa Tidak Boleh Kosong!");
                //     return;
                // }

                // if ($scope.itemPA.tglInput == undefined) {
                //     window.messageContainer.error("Tanggal Tidak Boleh Kosong!");
                //     return;
                // }
                // if ($scope.itemPA.dokter == undefined) {
                //     window.messageContainer.error("Dokter Tidak Boleh Kosong!");
                //     return;
                // }
                if ($scope.itemPA.hasilPA == undefined) {
                    window.messageContainer.error("Hasil Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.itemPA.dokterluar == "") {
                    $scope.itemPA.dokterluar = null
                }
                //;
                var objSave = {

                    noregistrasi: $scope.item.noregistrasi,
                    tglterima: moment($scope.item.tglterima).format('YYYY-MM-DD HH:mm'),
                    tgljawab: moment($scope.item.tgljawab).format('YYYY-MM-DD HH:mm'),
                    topografi: $scope.item.topografi.kddiagnosa,
                    morfologi: $scope.item.morfologi.kddiagnosa,
                    nopa: $scope.item.nopa,
                    tgltransaksi: moment($scope.item.tgltransaksi).format('YYYY-MM-DD HH:mm'),
                    dokterperujuk: $scope.itemPA.dokterperujukpa.id,
                    pegawaifk: $scope.dataSelected.dokterid,
                    dokterperujukluar: $scope.itemPA.dokterluar,
                    // tglinput: moment($scope.itemPA.tglInput).format('YYYY-MM-DD HH:mm'),
                    // dokterid: $scope.itemPA.dokter.id,
                    // nomor: $scope.itemdok.NoPa,
                    // keterangan: $scope.itemPA.keterangan.replace(/\n/ig,'~'),
                    pelayananpasienfk: $scope.dataSelected.norec_pp,
                    //tglpulang: moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss'),
                    // jenis: $scope.findBy == 1 ? 'sitologi' : 'pa',
                    // isDokterLuar: $scope.itemPA.dokterLuar,
                    // dokterpengirim1: $scope.itemPA.dokterPengirim1 != undefined ?$scope.itemPA.dokterPengirim1.id :null,
                    // dokterpengirim2: $scope.itemPA.dokterPengirim2 != undefined ? $scope.itemPA.dokterPengirim2 : null,
                    // diagnosaklinik: $scope.itemPA.diagnosaKlinik != undefined ? $scope.itemPA.diagnosaKlinik : null,
                    // keteranganklinik: $scope.itemPA.ketKlinik != undefined ? $scope.itemPA.ketKlinik : null,
                    // diagnosapb: $scope.itemPA.diagnosaPB != undefined ? $scope.itemPA.diagnosaPB : null,
                    // keteranganpb: $scope.itemPA.ketPB != undefined ? $scope.itemPA.ketPB : null,
                    // topografi: $scope.itemPA.topografi != undefined ? $scope.itemPA.topografi : null,
                    // morfologi: $scope.itemPA.morfologi != undefined ? $scope.itemPA.morfologi : null,
                    // makroskopik: $scope.itemPA.makroskopik != undefined ? $scope.itemPA.makroskopik.replace(/\n/ig, '~') : null,
                    // mikroskopik: $scope.itemPA.mikroskopik != undefined ? $scope.itemPA.mikroskopik.replace(/\n/ig, '~') : null,
                    // kesimpulan: $scope.itemPA.kesimpulan != undefined ? $scope.itemPA.kesimpulan.replace(/\n/ig, '~') : null,
                    // anjuran: $scope.itemPA.anjuran != undefined ? $scope.itemPA.anjuran.replace(/\n/ig, '~') : null,
                    // jaringanasal: $scope.itemPA.jaringanAsal != undefined ? $scope.itemPA.jaringanAsal : null,
                    norec_pd: norec_pd,
                    norec: $scope.norecPA,
                    expertise: $scope.itemPA.hasilPA
                }

                $scope.hideExper = true
                medifirstService.post('laboratorium/save-hasil-lab-pa', objSave).then(function (e) {
                    init();
                    $scope.hideExper = false
                    $scope.popUpPA.close();
                },

                    function (error) {
                        $scope.hideExper = false
                    })
                $scope.cetakLabPA = function () {
                    //
                    if ($scope.norecPA != '') {

                        var local = JSON.parse(localStorage.getItem('profile'))
                        // var local =JSON.parse(localStorage.getItem('profile')) 
                        var user = medifirstService.getPegawaiLogin().namaLengkap

                        // var profile = 0;//local.id;
                        // if($scope.findBy == 0){
                        if (local != null) {
                            var profile = local.id;
                            window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.norecPA + '&kdprofile=' + profile +
                                '&user=' + user + '&jenis=his', '_blank');
                        }
                        // }else{
                        //      window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" +$scope.dataSelected.norec_pp+'&kdprofile='+profile 
                        //         +'&user='+user+'&jenis=sitologi',  '_blank');
                        // }
                    }



                }
            }
            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"
                ],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };

            function loadEditor() {

            }

            $scope.cetakLabPA = function () {
                if ($scope.norecPA != '') {

                    // var local =JSON.parse(localStorage.getItem('profile')) 
                    var user = medifirstService.getPegawaiLogin().namaLengkap

                    var profile = 0; //local.id;
                    // if($scope.findBy == 0){
                    window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.norecPA + '&kdprofile=' + profile +
                        '&user=' + user + '&jenis=his', '_blank');
                    // }else{
                    //      window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" +$scope.dataSelected.norec_pp+'&kdprofile='+profile 
                    //         +'&user='+user+'&jenis=sitologi',  '_blank');
                    // }
                }



            }


            $scope.cetakPdf = function () {


                init()


                debugger
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});

                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                // if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                //     xhr.open('POST', 'http://192.168.0.62:1002/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiigd.pdf');
                // } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                //     xhr.open('POST', '/jasper1/generic/report/evaluasiigd.pdf');
                // } else {
                //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/evaluasiigd.pdf');
                // }
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporandokterbaca.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/laporandokterbaca.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }


            //***********************************

        }
    ]);
});