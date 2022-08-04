define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ResepElektronikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.title = "Resep elektronik";
            $scope.dataVOloaded = true;
            $scope.item = {};
            $rootScope.isOpen = true;
            $scope.item.isTelemedicine = false;
            $scope.cekTelemedicine = function (bool) {
                if (bool) {
                    $scope.item.isTelemedicine = true
                    $scope.refresh();
                } else {
                    $scope.item.isTelemedicine = false
                    $scope.refresh();
                }
            }
            FormLoad();
            // $scope.item.namaPasien = "";
            // $scope.item.ruangan = "";
            // $scope.getIsiComboRuangan = function () {
            //     $scope.listRuangan = $scope.departemen.ruangan
            // }
            // $scope.notDetail = true;
            //define column untuk grid

            function FormLoad() {
                medifirstService.get('farmasi/get-datacombo_dp').then(function (e) {
                    $scope.listRuangan = e.data.ruanganpelayanan
                    $scope.listRuanganDepo = e.data.ruanganfarmasi
                })
            }

            $scope.arrColumnGridResepElektronik = [{
                    "field": "no",
                    "title": "No Antri",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",


                }, {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "50px",


                }, {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px",

                }, {
                    "field": "jeniskelamin",
                    "title": "JK",
                    "width": "30px",

                }, {
                    "field": "namaruanganrawat",
                    "title": "Ruang Rawat",
                    "width": "100px",

                }, {
                    template: "#= new moment(new Date(tglorder)).format('DD-MM-YYYY HH:mm:ss') #",
                    "field": "strukOrder.tglOrder",
                    "title": "Tgl Order",
                    "width": "60px",
                }, {
                    template: "#= new moment(new Date(tglresep)).format('DD-MM-YYYY HH:mm:ss') #",
                    "field": "strukOrder.tglresep",
                    "title": "Tgl Resep",
                    "width": "60px",

                }, {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px",

                }, {
                    "field": "kelompokpasien",
                    "title": "Tipe Pasien",
                    "width": "60px",

                }, {
                    hidden: true,
                    "field": "namaruangan",
                    "width": "70px",
                    "title": "Depo",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # "

                }, {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "60px",

                }, {
                    "field": "namapengambilorder",
                    "title": "Pengambil Obat",
                    "width": "80px",

                },
                {
                    "field": "caraambil",
                    "title": "Cara Ambil Obat",
                    "width": "80px",

                },
                {
                    "field": "noruangan",
                    "title": "No Ruang",
                    "width": "55px",

                },
                {
                    "field": "cekreseppulang",
                    "title": "R Pulang",
                    "width": "60px",

                },
                {
                    "field": "notelepon",
                    "title": "No Telp",
                    "width": "70px",
                },
                {
                    "field": "alamatdomisili",
                    "title": "Alamat",
                    "width": "150px",
                },
                {
                    hidden: true,
                    "field": "jenis",
                    "width": "70px",
                    "title": "Jenis",
                    aggregates: ["count"],
                    groupHeaderTemplate: " #= value # "

                },
            ];

            LoadCache();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('ResepElektronikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.startDate = new Date(chacePeriode[0]);
                    $scope.untilDate = new Date(chacePeriode[1]);
                    if (chacePeriode[2] != null)
                        $scope.noCm = chacePeriode[2]
                    if (chacePeriode[3] != null)
                        $scope.namaPasien = chacePeriode[3]
                    if (chacePeriode[4] != null)
                        $scope.noPesanan = chacePeriode[4]
                    if (chacePeriode[5] != null)
                        $scope.departemen = chacePeriode[5]


                } else {
                    $scope.item.startDate = $scope.now;
                    $scope.item.untilDate = $scope.now;
                }
            }

            // $scope.noCm = "";
            // $scope.startDate = new Date();
            // $scope.untilDate = new Date();
            $scope.ruanganId = "";
            $scope.group = {
                field: "jenis",
                aggregates: [{
                    field: "jenis",
                    aggregate: "count"
                }]
            };
            // $scope.arrColumnGridResepElektronik = [{
            //     "field": "strukOrder.noOrder",
            //     "title": "No Pesanan",


            // }, {
            //     "field": "pasien.noCm",
            //     "title": "No Rekam Medis",


            // }, {
            //     "field": "pasien.namaPasien",
            //     "title": "Nama Pasien",

            // }, {
            //     "field": "pasien.jenisKelamin.jenisKelamin",
            //     "title": "Jenis Kelamin",

            // }, {
            //     "field": "strukOrder.ruangan.namaRuangan",
            //     "title": "Ruang Rawat",

            // }, {
            //     template: "#= new moment(new Date(strukOrder.tglOrder)).format('DD-MM-YYYY HH:mm:ss') #",
            //     "field": "strukOrder.tglOrder",
            //     "title": "Tanggal/Jam Masuk",

            // }, {
            //     "field": "penulisResep.namaLengkap",
            //     "title": "Dokter",

            // }, {
            //     "field": "strukOrder.pasienDaftar.kelompokPasien.kelompokPasien",
            //     "title": "Tipe Pasien",

            // }, {
            //     hidden: true,
            //     "field": "strukOrder.ruanganTujuan.namaRuangan",
            //     "title": "Depo",
            //     aggregates: ["count"],
            //     groupHeaderTemplate: "Ruangan #= value # "

            // }, {
            //     "field": "statusAntrian",
            //     "title": "Status",

            // }, {
            //     "field": "strukOrder.namaPengambilOrder",
            //     "title": "Pengambil Obat",

            // }];

            // $scope.noCm = "";
            // $scope.startDate = new Date();
            // $scope.untilDate = new Date();
            // $scope.ruanganId = "";
            // $scope.group = {
            //     field: "strukOrder.ruanganTujuan.namaRuangan",
            //     aggregates: [{
            //         field: "strukOrder.ruanganTujuan.namaRuangan",
            //         aggregate: "count"
            //     }]
            // };
            $scope.listStatus = [{
                    id: 0,
                    status: 'Menunggu'
                },
                {
                    id: 1,
                    status: 'Produksi'
                },
                {
                    id: 2,
                    status: 'Packaging'
                },
                {
                    id: 3,
                    status: 'Selesai'
                },
                {
                    id: 4,
                    status: 'Penyerahan Obat'
                },
                {
                    id: 5,
                    status: 'Verifikasi'
                },
            ]
            $scope.selectOptionStatus = {
                placeholder: "Status...",
                dataTextField: "status",
                dataValueField: "id",
                // dataSource:{
                //     data: $scope.listRuangan
                // },
                autoBind: false,

            };
            $scope.refresh = function () {
                $scope.isRouteLoading = true
                // debugger;
                var nocm = ''
                if ($scope.noCm != undefined) {
                    nocm = '&nocm=' + $scope.noCm
                }
                var namaPasien = ''
                if ($scope.namaPasien != undefined) {
                    namaPasien = '&namaPasien=' + $scope.namaPasien
                }
                var noPesanan = ''
                if ($scope.noPesanan != undefined) {
                    noPesanan = '&noPesanan=' + $scope.noPesanan
                }
                var departemenId = ''
                if ($scope.departemen != undefined) {
                    departemenId = '&departemenId=' + $scope.departemen.id
                }
                var ruanganId = ''
                if ($scope.ruangan != undefined) {
                    ruanganId = '&ruanganId=' + $scope.ruangan.id
                }
                var depoId = ''
                if ($scope.depo != undefined) {
                    depoId = '&depoId=' + $scope.depo.id
                }
                // var status = ''
                // if ($scope.status != undefined) {
                //     status = '&statusId=' + $scope.status.id
                // }
                var status = ""
                if ($scope.status != undefined) {
                    if ($scope.status.length != 0) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.status.length - 1; i >= 0; i--) {
                            var c = $scope.status[i].id
                            b = "," + c
                            a = a + b
                        }
                        status = a.slice(1, a.length)
                    }
                }

                var tglAwal = moment($scope.startDate).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.untilDate).format('YYYY-MM-DD');
                medifirstService.get('farmasi/get-daftar-order?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + nocm + namaPasien + noPesanan + ruanganId + departemenId + '&statusId=' + status + depoId +
                    "&istelemedicine=" + $scope.item.isTelemedicine).then(function (e) {
                    // findPasien.findOrderObat($scope.noCm, $scope.ruanganId, $scope.startDate, $scope.untilDate).then(function(e) {
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(e.data[i].tgllahir);
                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                        e.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        //itungUsia(dat.data[i].tgllahir)                        
                        if (e.data[i].istelemedicine == '1') {
                            // e.data[i].isonline = e.data[i].notelepon
                            e.data[i].kelompokpasien = 'Telemedicine'
                            // e.data[i].tglregistrasi = e.data[i].tanggalreservasi
                        }
                        if (e.data[i].jeniskelamin == 'LAKI-LAKI') {
                            e.data[i].jeniskelamin = 'L'
                        } else {
                            e.data[i].jeniskelamin = 'P'
                        }

                        if (e.data[i].noorder == e.data[i].noresep) {
                            if (e.data[i].statusorder == 'Menunggu')
                                e.data[i].statusorder = 'Verifikasi'
                        }
                        if (e.data[i].reseppulang == '1') {
                            e.data[i].cekreseppulang = '✔'
                        } else {
                            e.data[i].cekreseppulang = '-'
                        }

                    }
                    $scope.isRouteLoading = false
                    e.data.sort(function (a, b) {
                        if (a.noantri < b.noantri) {
                            return -1;
                        }
                        if (a.noantri > b.noantri) {
                            return 1;
                        }
                        return 0;
                    })
                    $scope.patienGrids = new kendo.data.DataSource({
                        //data: ModelItem.beforePost(e.data.data, true),
                        data: ModelItem.beforePost(e.data, true),
                        group: $scope.group
                    });


                });
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.noCm != undefined ? $scope.noCm : null,
                    3: $scope.namaPasien != undefined ? $scope.namaPasien : null,
                    4: $scope.noPesanan != undefined ? $scope.noPesanan : null,
                    5: $scope.departemen != undefined ? $scope.departemen : null
                }
                cacheHelper.set('ResepElektronikCtrl', chacePeriode);
            };
            $scope.refresh();


            $scope.now = new Date();
            $scope.detailOrder = function () {

                //$state.go('ResepElektronikDetail', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });

                // *** OLD
                // var arrStr ={ 0 : $scope.item.nocm ,
                //     1 : $scope.item.namapasien,
                //     2 : $scope.item.jeniskelamin,
                //     3 : $scope.item.noregistrasi, 
                //     4 : $scope.item.umur,
                //     5 : $scope.item.klid,
                //     6 : $scope.item.namakelas,
                //     7 : $scope.item.tglregistrasi,
                //     8 : $scope.item.norec_apd,
                //     9 : 'detail'
                // }
                // cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                // $state.go('TransaksiPelayananApotik')
                var dataSet = []
                medifirstService.get("farmasi/get-detail-order?noorder=" + $scope.item.noorder, true).then(function (e) {
                    // medifirstService.get('farmasi/get-daftar-detail-order?norec_apd=' + $scope.item.norec_apd).then(function (e) {
                    $scope.item.tglorders = moment(new Date(e.data.strukorder.tglorder)).format('DD-MM-YYYY HH:mm')
                    $scope.item.noorders = $scope.item.noorder
                    $scope.item.dokters = $scope.item.namalengkap
                    $scope.item.statuss = $scope.item.statusorder
                    var dataGrids = e.data.orderpelayanan
                    for (let i = 0; i < dataGrids.length; i++) {
                        const element = dataGrids[i];
                        element.namaruangan = e.data.strukorder.namaruangan
                        if ($scope.item.reseppulang == '1') {
                            element.chekreseppulang = '✔'
                        } else {
                            element.chekreseppulang = '-'
                        }
                    }
                    // for (var i = e.data.orderpelayanan.length - 1; i >= 0; i--) {
                    //     e.data.orderpelayanan[i].no = i + 1
                    // for (let z = 0; z < e.data[i].details.length; z++) {
                    //     dataSet.push({
                    //         no: z + 1,
                    //         jeniskelamin: e.data[i].jeniskelamin,
                    //         kelompokpasien: e.data[i].kelompokpasien,
                    //         klid: e.data[i].klid,
                    //         namakelas: e.data[i].namakelas,
                    //         namalengkap: e.data[i].namalengkap,
                    //         namapasien: e.data[i].namapasien,
                    //         namapengambilorder: e.data[i].namapengambilorder,
                    //         namaruangan: e.data[i].namaruangan,
                    //         namaruanganrawat: e.data[i].namaruanganrawat,
                    //         nocm: e.data[i].nocm,
                    //         noorder: e.data[i].noorder,
                    //         norec: e.data[i].norec,
                    //         norec_apd: e.data[i].norec_apd,
                    //         noregistrasi: e.data[i].noregistrasi,
                    //         statusorder: e.data[i].statusorder,
                    //         tgllahir: e.data[i].tgllahir,
                    //         tglorder: e.data[i].tglorder,
                    //         tglregistrasi: e.data[i].tglregistrasi,
                    //         aturanpakai: e.data[i].details[z].aturanpakai,
                    //         hargasatuan: e.data[i].details[z].hargasatuan,
                    //         jeniskemasan: e.data[i].details[z].jeniskemasan,
                    //         jumlah: e.data[i].details[z].jumlah,
                    //         namaproduk: e.data[i].details[z].namaproduk,
                    //         noorder: e.data[i].details[z].noorder,
                    //         rke: e.data[i].details[z].rke,
                    //         satuanstandar: e.data[i].details[z].satuanstandar,
                    //         norecresep: e.data[i].details[z].norecresep,
                    //     })

                    // }
                    // }
                    // if (dataSet.length > 0) {
                    //     $scope.item.tglorders = dataSet[0].tglorder
                    //     $scope.item.noorders = dataSet[0].noorder
                    //     $scope.item.dokters = dataSet[0].namalengkap
                    //     $scope.item.statuss = dataSet[0].statusorder
                    // }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.orderpelayanan,
                        pageSize: 1000
                    });


                });
                $scope.popUp.center().open()
            }

            $scope.updateProduksi = function () {
                if ($scope.item.statusorder == 'Verifikasi') {
                    //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 1).then(function(e) {
                    //
                    //managePasien.updateStatusOrder($scope.item.noorder, 1).then(function(e) {
                    var strukresep = ""
                    if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                        strukresep = true
                    }

                    var objSave = {
                        noorder: $scope.item.noorder,
                        statusorder: 1,
                        tglambil: null,
                        namapengambil: null,
                        strukresep: strukresep
                    }
                    medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                        medifirstService.postLogging('Rubah Status Produksi Order Resep Elektronik', 'No Order Struk Order',
                            $scope.item.noorder, 'Rubah Status Produksi Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                            $scope.refresh();
                        })
                    });
                } else {
                    toastr.error("Status Data Belum Diverifikasi !!")
                    return;
                }
            }

            $scope.updatePackaging = function () {
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Produksi') {
                    //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 2).then(function(e) {
                    // managePasien.updateStatusOrder($scope.item.noorder, 2).then(function(e) {
                    //     $scope.refresh();
                    // });;
                    var strukresep = ""
                    if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                        strukresep = true
                    }

                    var objSave = {
                        noorder: $scope.item.noorder,
                        statusorder: 2,
                        tglambil: null,
                        namapengambil: null,
                        strukresep: strukresep
                    }
                    medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                        medifirstService.postLogging('Rubah Status Packaging Order Resep Elektronik', 'No Order Struk Order',
                            $scope.item.noorder, 'Rubah Status Packaging Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                            $scope.refresh();
                        })
                    });
                } else {
                    if ($scope.item.statusorder == 'Menunggu') {
                        toastr.error("Status Data Belum Diverifikasi !!")
                        return;
                    } else {
                        toastr.error("Status Data Belum Produksi !!")
                        return;
                    }
                }
            }
            $scope.updateDone = function () {
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging') {
                    //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 3).then(function(e) {
                    // managePasien.updateStatusOrder($scope.item.noorder, 3).then(function(e) {
                    //     $scope.refresh();
                    // });;
                    var strukresep = ""
                    if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                        strukresep = true
                    }
                    var objSave = {
                        noorder: $scope.item.noorder,
                        statusorder: 3,
                        tglambil: null,
                        namapengambil: null,
                        strukresep: strukresep
                    }
                    medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                        var userLogin = medifirstService.getPegawaiLogin();
                        var Norec = $scope.item.noresep;
                        var Noreg = $scope.item.noregistrasi;
                        if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai') {
                            var stt = 'false'
                            if (confirm('View Antrian Farmasi? ')) {
                                // Save it!
                                stt = 'true';
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + Norec + '&noregistrasi=' + Noreg + '&view=' + stt, function (response) {
                                // aadc=response;
                            });
                        }
                        medifirstService.postLogging('Rubah Status Selasai Order Resep Elektronik', 'No Order Struk Order',
                            $scope.item.noorder, 'Rubah Status Selasai Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                            $scope.refresh();
                        })
                    });
                } else {
                    if ($scope.item.statusorder == 'Menunggu') {
                        toastr.error("Status Data Belum Diverifikasi !!")
                        return;
                    } else {
                        toastr.error("Status Data Belum Packaging !!")
                        return;
                    }
                }
            }

            $scope.verifikasi = function () {
                // debugger;
                if ($scope.item.statusorder == 'Menunggu') {
                    //$state.go('ResepElektronikVerifikasi', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });
                    var arrStr = {
                        0: $scope.item.nocm,
                        1: $scope.item.namapasien,
                        2: $scope.item.jeniskelamin,
                        3: $scope.item.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.klid,
                        6: $scope.item.namakelas,
                        7: $scope.item.tglregistrasi,
                        8: $scope.item.norec_apd,
                        9: $scope.item.noorder,
                        10: $scope.item.jenisPenjamin,
                        11: $scope.item.kelompokPasien,
                        12: $scope.item.beratBadan,
                        13: $scope.item.AlergiYa,
                        14: ''
                    }
                    cacheHelper.set('InputResepApotikCtrl', arrStr);
                    $state.go('InputResepApotik')
                } else {
                    alert('Sudah di verifikasi!!')
                }
            }
            $scope.ambilObat = function () {
                if ($scope.item.statusorder == 'Selesai') {
                    // noresep
                    $scope.item.tglambil = new Date()
                    $scope.item.tglkontrol = new Date()
                    $scope.item.tglkontrol = new Date($scope.item.tglkontrol)
                    $scope.item.tglkontrol = new Date($scope.item.tglkontrol.setDate($scope.item.tglkontrol.getDate() + 30))
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:2905/printvb/Pendaftaran?displaykeun=1&noantri=' + $scope.item.noantri + '&namapasien=' + $scope.item.nocm + ', ' + $scope.item.namapasien + '&view=true', function (response) {
                        // do something with response
                    });
                    // if ( $scope.item.statusorder == 'Selesai') {
                    $scope.popup.center().open();
                    //$state.go('ResepElektronikAmbilObat', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });
                    // $state.go('ResepElektronikAmbilObat', { noOrder: $scope.item.noorder, noAntrianPasien: $scope.item.norec_apd });
                    // } else {
                    // alert('Status harus Selesai!!')
                    // }
                } else {
                    toastr.error("Status Data Harus Selesai !!")
                    return;
                }

            }

            $scope.saveambilobat = function () {
                var nm = ''
                if ($scope.item.namapengambil != undefined) {
                    nm = $scope.item.namapengambil
                }
                var strukresep = ""
                if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                    strukresep = true
                }
                var objSave = {
                    noorder: $scope.item.noorder,
                    statusorder: 4,
                    tglambil: moment($scope.item.tglambil).format('YYYY-MM-DD HH:mm'),
                    namapengambil: nm,
                    strukresep: strukresep,
                    tglkontrol: moment($scope.item.tglkontrol).format('YYYY-MM-DD HH:mm')
                }
                medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                    medifirstService.postLogging('Rubah Status Sudah Di Ambil Order Resep Elektronik', 'No Order Struk Order',
                        $scope.item.noorder, 'Rubah Status Sudah Di Ambil Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                        $scope.refresh();
                        $scope.popup.close()
                    })
                });
            }

            $scope.columnGridRiwayat = [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                // {
                //     "field": "tglorder",
                //     "title": "Tgl Order",
                //     "width" : "50px",
                // },
                // {
                //     "field": "noorder",
                //     "title": "No Order",
                //     "width" : "60px",
                // },
                {
                    field: "rke",
                    title: "Rke",
                    width: "50px",
                },
                {
                    field: "jeniskemasan",
                    title: "Jenis Kemasan",
                    width: "100px",
                },
                {
                    field: "namaproduk",
                    title: "Deskripsi",
                    width: "200px"
                },
                {
                    field: "satuanstandar",
                    title: "Satuan",
                    width: "100px"
                },
                {
                    field: "aturanpakai",
                    title: "Aturan Pakai",
                    width: "100px"
                },
                {
                    field: "jumlah",
                    title: "Qty",
                    width: "100px"
                },
                // {
                //     "field": "namalengkap",
                //     "title": "Dokter",
                //     "width" : "100px"
                // },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "chekreseppulang",
                    "title": "Resep Pulang",
                    "width": "70px",
                }
                // {
                //     "field": "statusorder",
                //     "title": "Status",
                //     "width" : "70px",
                // }
            ];
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
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                            field: "rke",
                            title: "Rke",
                            width: "30px",
                        },
                        {
                            field: "jeniskemasan",
                            title: "Jenis Kemasan",
                            width: "100px",
                        },
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "200px"
                        },
                        {
                            field: "satuanstandar",
                            title: "Satuan",
                            width: "100px"
                        },
                        {
                            field: "aturanpakai",
                            title: "Aturan Pakai",
                            width: "100px"
                        },
                        {
                            field: "jumlah",
                            title: "Qty",
                            width: "100px"
                        }
                    ]
                };
            };

            $scope.cetakLabeKecil = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var Norec = $scope.item.norecresep;
                    var stt = 'false'
                    if (confirm('View Label? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + Norec + '&view=' + stt + '&user=' + userLogin.userLogin, function (response) {
                        // aadc=response;
                    });
                }
            }


            $scope.CetakTelemedicine = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var Norec = $scope.item.norecresep;
                    var stt = 'false'
                    if (confirm('View Telemedicine? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiTelemedis=' + Norec + '&view=' + stt + '&user=' + userLogin.userLogin +
                        '&namapasien=' + $scope.item.namapasien + '&notelepon=' + $scope.item.notelepon + '&alamat=' + $scope.item.alamatdomisili,
                        function (response) {
                            // aadc=response;
                        });
                }
            }

            $scope.cetakLabelRekap = function () {
                var Norec = $scope.item.norecresep;
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + Norec).then(function (dat) {
                        $scope.datas = dat.data;
                        var JmlPagi = 0;
                        var JmlSiang = 0;
                        var JmlSore = 0;
                        var JmlMalam = 0;
                        var stt = 'false'
                        if (confirm('View Label resep? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }
                        $scope.datas.forEach(function (element) {
                            var customData = {};
                            for (var key in element) {
                                switch (key) {
                                    case "pagi":
                                        if (element.pagi != '-') {
                                            if (JmlPagi < 1) {
                                                JmlPagi = parseFloat(JmlPagi) + 1;
                                                // var stt = 'false'
                                                var isPagi = 'Pagi';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + userLogin, function (response) {});
                                            }
                                        }
                                        break;
                                    case "siang":
                                        if (element.siang != '-') {
                                            if (JmlSiang < 1) {
                                                JmlSiang = parseFloat(JmlSiang) + 1;
                                                // var stt = 'false'
                                                var isSiang = 'Siang';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + userLogin, function (response) {});
                                            }
                                        }
                                        break;
                                    case "sore":
                                        if (element.sore != '-') {
                                            if (JmlSore < 1) {
                                                JmlSore = parseFloat(JmlSore) + 1;
                                                // var stt = 'false'
                                                var isSore = 'Sore';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + userLogin, function (response) {});
                                            }
                                        }
                                        break;
                                    case "malam":
                                        if (element.malam != '-') {
                                            if (JmlMalam < 1) {
                                                JmlMalam = parseFloat(JmlMalam) + 1;
                                                // var stt = 'false'
                                                var isMalam = 'Malam';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + userLogin, function (response) {});
                                            }
                                        }
                                        break;
                                    default:
                                        customData[key] = element[key];
                                        break;
                                }
                            };
                        });
                    })
                }
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

            $scope.klikGridS = function (dataSelected) {
                $scope.dataSelected = dataSelected;
            }

            $scope.BatalVerifikasi = function () {
                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                //     return;
                // }

                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                //     return;
                // } else {
                if ($scope.item.norecresep == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.item.noorder == $scope.item.noresep) {
                    toastr.error('Tidak bisa Unverifikasi')
                    return
                }

                var stt = 'false'
                if (confirm('Yakin Mau Batal Verifikasi Resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                    stt = 'false'
                }

                if (stt) {
                    medifirstService.get('farmasi/get-nostruk-kasir?norecresep=' + $scope.item.norecresep).then(function (x) {
                        var nostruk = x.data[0].nostruk

                        if (nostruk != null) {
                            toastr.error('Tidak bisa batal verif karena sudah diverif kasir, harap hubungi kasir terlebih dahulu!')
                            return
                        } else {
                            var objDelete = {
                                norec: $scope.item.norecresep,
                                norec_order: $scope.item.norec_order,
                            }
                            medifirstService.post('farmasi/batal-verifikasi-order-resep', objDelete).then(function (e) {
                                medifirstService.post('farmasi/save-hapus-pelayananobat', objDelete).then(function (e) {
                                    $scope.refresh()
                                    medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep=" +
                                        $scope.item.norecresep).then(function (data) {
                                        // medifirstService.postLogging('Batal Verifikasi Order Resep Elektronik', 'Norec Struk Order', $state.params.noRec, 'Batal Verifikasi Order Resep Elektronik').then(function (res) {
                                        // })
                                    })
                                    // LoadCache()
                                })
                            });
                        }
                    })
                }

                //##save Logging user

                //##end 
                // }
            }

            $scope.cetakNomorAntrian = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                var Norec = $scope.item.noresep;
                var Noreg = $scope.item.noregistrasi;
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var stt = 'false'
                    if (confirm('View Antrian Farmasi? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + Norec + '&noregistrasi=' + Noreg + '&view=' + stt, function (response) {
                        // aadc=response;
                    });
                }
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function loadDiagnosa(noreg) {
                medifirstService.get("sysadmin/general/get-diagnosa-pasien?noReg=" + noreg).then(function (data) {
                    var dataICD10 = data.data.datas;
                    if (dataICD10.length > 0) {
                        var diagnosa = ''
                        var a = ""
                        var b = ""
                        for (let i = 0; i < dataICD10.length; i++) {
                            const element = dataICD10[i];
                            var c = element.kddiagnosa + '-' + element.namadiagnosa
                            b = ", " + c
                            a = a + b
                        }
                        diagnosa = a.slice(1, a.length)
                        $scope.item.diagnosa = diagnosa
                    }
                });
            }
            $scope.detailVerif = function () {
                if ($scope.item.norecresep == null)
                    return
                $scope.dataGridVerif = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });
                medifirstService.get("farmasi/get_detail-resep?norecResep=" + $scope.item.norecresep, true).then(function (e) {
                    // medifirstService.get('farmasi/get-daftar-detail-order?norec_apd=' + $scope.item.norec_apd).then(function (e) {
                    $scope.item.tglreseps = moment(new Date($scope.item.tglorder)).format('DD-MM-YYYY HH:mm')
                    $scope.item.noreseps = e.data.detailresep.noresep
                    $scope.item.dokters = $scope.item.namalengkap
                    $scope.item.statuss = $scope.item.statusorder
                    $scope.item.namaPasienVerif = $scope.item.namapasien
                    $scope.item.norm = $scope.item.nocm
                    $scope.item.namaruangan = e.data.detailresep.namaruangan
                    medifirstService.get("farmasi/get-alamat?noregistrasi=" + $scope.item.noregistrasi).then(function (e) {
                        $scope.item.alamat = e.data.alamatlengkap
                    })
                    loadDiagnosa($scope.item.noregistrasi)

                    var dataGrids = e.data.pelayananPasien
                    for (let i = 0; i < dataGrids.length; i++) {
                        const element = dataGrids[i];
                        element.namaruangan = $scope.item.namaruangan
                        if (element.isreseppulang == '1') {
                            element.chekreseppulang = '✔'
                        } else {
                            element.chekreseppulang = '-'
                        }
                    }

                    $scope.dataGridVerif = new kendo.data.DataSource({
                        data: dataGrids,
                        pageSize: 10
                    });


                });
                $scope.popUpDetailVerif.center().open()
            }


            $scope.columnGridVerif = [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },

                {
                    field: "rke",
                    title: "Rke",
                    width: "40px",
                },
                {
                    field: "jeniskemasan",
                    title: "Jenis Kemasan",
                    width: "100px",
                },
                {
                    field: "namaproduk",
                    title: "Deskripsi",
                    width: "200px"
                },
                {
                    field: "satuanstandar",
                    title: "Satuan",
                    width: "80px"
                },
                {
                    field: "aturanpakai",
                    title: "Aturan Pakai",
                    width: "100px"
                },
                {
                    field: "jumlah",
                    title: "Qty",
                    width: "60px"
                },
                // {
                //     "field": "namalengkap",
                //     "title": "Dokter",
                //     "width" : "100px"
                // },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "chekreseppulang",
                    "title": "Resep Pulang",
                    "width": "110px",
                }
                // {
                //     "field": "statusorder",
                //     "title": "Status",
                //     "width" : "70px",
                // }
            ];

            $scope.cetakLabelRekapRajal = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var Norec = $scope.item.norecresep;
                    var stt = 'false'
                    if (confirm('View Label? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-labelrekap-rajal=' + Norec + '&view=' + stt + '&user=' + userLogin.userLogin, function (response) {
                        // aadc=response;
                    });
                }
            }

            $scope.rekamMedisElektronik = function () {
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan + '`'
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedis.VitalSign', {
                    noRec: $scope.item.norec_apd
                })

            }
            //** BATAS SUCI */
        }
    ]);
});