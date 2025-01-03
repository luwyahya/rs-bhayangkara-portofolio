define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InputResepApotikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.item = {};
            $scope.data = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.isRouteLoading = false;
            $scope.tombolSimpanVis = true
            $scope.disabledRuangan = false;
            $scope.statusConsis = false;
            $scope.item.hargaNetto = 0;
            var statusTambah = true
            var pegawaiUser = {}
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data2kronis = [];
            var data2R = [];
            var dataOK = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var strStatus = 0
            var tarifJasa = 0
            var isPemakaianObatAlkes = false;
            var norecSkrining = "";
            $scope.item.aturanPakai = "";
            $scope.checkDonasi = false;
            $scope.item.dosis = 1;
            $scope.item.jumlahxmakan = 0;
            $scope.item.jumlah = 0;
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            //* SKRINING */
            $scope.currentPrinsipBesar = [];
            $scope.currentAturanPakai = [];
            $scope.listDataPenulis = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataTanggal = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataRM = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataPasien = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataLahir = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataBerat = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataDokter = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataRuang = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataStatus = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataObat = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataKekuatan = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataJumlah = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataStabilitas = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataAturan = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataIndikasi = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];

            $scope.listDataAlergi = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataKonsumsi = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataDuplikat = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataInteraksi = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataAntibiotik = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataPoli = [{
                name: "Ya",
                id: 1
            },
            {
                name: "Tidak",
                id: 2
            }
            ];
            $scope.listDataCek = [{
                name: "Tidak Semua",
                id: 1
            },
            {
                name: "Ada Semua",
                id: 2
            }
            ];

            $scope.listPrinsipBesar = [{
                "id": 1,
                "nama": "Ceklis Prinsip 7 Benar",
                "detail": [{
                    "id": 1,
                    "nama": "Benar Pasien"
                },
                {
                    "id": 2,
                    "nama": "Benar Indikasi"
                },
                {
                    "id": 3,
                    "nama": "Benar Obat"
                },
                {
                    "id": 4,
                    "nama": "Benar Dosis"
                },
                {
                    "id": 5,
                    "nama": "Benar Cara Pemberian"
                },
                {
                    "id": 6,
                    "nama": "Benar Waktu Pemberian"
                },
                {
                    "id": 7,
                    "nama": "Benar Dokumentasi"
                },
                ]
            }]
            $scope.listDataSigna = [{
                "id": 1,
                "nama": "Aturan Pakai",
                "detail": [{
                    "id": 1,
                    "nama": "Pagi",
                    'isChecked': false
                },
                {
                    "id": 2,
                    "nama": "Siang",
                    'isChecked': false
                },
                {
                    "id": 3,
                    "nama": "Sore",
                    'isChecked': false
                },
                {
                    "id": 4,
                    "nama": "Malam",
                    'isChecked': false
                }
                ]
            }];
            $scope.item.chkp = 0
            $scope.item.chks = 0
            $scope.item.chksr = 0
            $scope.item.chkm = 0
            $scope.model = function () {
                pagi = '';
            }
            $scope.addListAturanPakai = function (bool, data) {
                let jml = 0
                var index = $scope.currentAturanPakai.indexOf(data);
                if (bool == true) {
                    // $scope.currentAturanPakai.push(data);
                    if (data.id == 1) {
                        $scope.item.chkp = 1
                        // jml =jml +1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 1
                        // jml =jml +1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 1
                        // jml =jml +1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 1
                        // jml =jml +1
                    }
                } else {
                    // $scope.currentAturanPakai.splice(index, 1);
                    if (data.id == 1) {
                        $scope.item.chkp = 0
                        // jml =jml -1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 0
                        // jml =jml -1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 0
                        // jml =jml -1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 0
                        // jml =jml -1
                    }
                }
                if ($scope.item.chkp == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chks == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chksr == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chkm == 1) {
                    jml = jml + 1
                }
                // $scope.item.aturanPakai = ''
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1'
                // if (jml == 0) {
                //     $scope.item.aturanPakai = ''
                // }

            }

            $scope.addListPrinsipBesar = function (bool, data) {
                var index = $scope.currentPrinsipBesar.indexOf(data);
                if (_.filter($scope.currentPrinsipBesar, {
                    id: data.id
                }).length === 0)
                    $scope.currentPrinsipBesar.push(data);
                else {
                    $scope.currentPrinsipBesar.splice(index, 1);
                }

            }
            //* SKRINING */
            LoadCache();
            loadDefaultSkrining();

            function LoadCache() {
                // medifirstService.getDataTableTransaksi("akutansi/get-terakhir-posting", true).then(function(dat){
                //     var tgltgltgltgl = dat.data.data[0].max
                //     $scope.startDateOptions = {
                //         min: new Date(tgltgltgltgl),
                //         max: new Date($scope.now)
                //     };
                // })
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                });
                var chacePeriode2 = cacheHelper.get('cacheanuaing');
                if (chacePeriode2 != undefined) {
                    $scope.item.ruangan = chacePeriode2[0];
                    // $scope.item.aturanPakai = chacePeriode2[1];
                    $scope.item.jenisKemasan = chacePeriode2[2];
                }
                var chacePeriode = cacheHelper.get('InputResepApotikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.nocm = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noRegistrasi = chacePeriode[3]

                    $scope.item.umur = chacePeriode[4]

                    $scope.listKelas = ([{
                        id: chacePeriode[5],
                        namakelas: chacePeriode[6]
                    }])
                    $scope.item.kelas = {
                        id: chacePeriode[5],
                        namakelas: chacePeriode[6]
                    }
                    $scope.item.tglregistrasi = moment(chacePeriode[7]).format('YYYY-MM-DD HH:mm:ss')
                    norec_apd = chacePeriode[8]
                    noOrder = chacePeriode[9]
                    $scope.item.jenisPenjamin = chacePeriode[10]
                    $scope.item.kelompokPasien = chacePeriode[11]
                    $scope.item.beratBadan = chacePeriode[12]
                    $scope.item.AlergiYa = chacePeriode[13]
                    norecResep = chacePeriode[14]
                    $scope.item.penulisResep = chacePeriode[15]
                    $scope.item.kdkelompokPasien = chacePeriode[16]
                    $scope.item.tglmasuk = chacePeriode[17]
                    $scope.item.tglkeluar = chacePeriode[18]
                    $scope.item.objectdepartemenfk = chacePeriode[19]
                    $scope.item.namaruangan = chacePeriode[20]
                    if (chacePeriode[21] != null) {
                        $scope.item.tglAwal = chacePeriode[21];
                    } else {
                        $scope.item.tglAwal = new Date($scope.now);
                    }
                    $scope.item.resep = '-';

                    init()
                } else {

                }
                var cachePemakaianOA = cacheHelper.get('cachePemakaianOA');
                if (cachePemakaianOA != undefined) {
                    isPemakaianObatAlkes = true
                    cacheHelper.set('cachePemakaianOA', undefined);
                }
            }
            loadAlamat()

            function loadAlamat() {
                medifirstService.get("farmasi/get-alamat?noregistrasi=" + $scope.item.noRegistrasi).then(function (e) {
                    if ($scope.item.jenisPenjamin == undefined)
                        $scope.item.jenisPenjamin = e.data.kelompokpasien
                    $scope.item.alamatPasien = e.data.alamatlengkap
                })
            }

            function loadDefaultSkrining() {
                $scope.data.Penulis = 2;
                $scope.data.Tanggal = 2;
                $scope.data.DataRM = 2;
                $scope.data.Pasien = 2;
                $scope.data.DataLahir = 2;
                $scope.data.Berat = 2;
                $scope.data.DataDokter = 2;
                $scope.data.DataRuang = 2;
                $scope.data.DataStatus = 2;
                $scope.data.Obat = 2;
                $scope.data.DataKekuatan = 2;
                $scope.data.DataJumlah = 2;
                $scope.data.DataStabilitas = 2;
                $scope.data.DataAturan = 2;
                $scope.data.DataIndikasi = 2;
                $scope.data.DataAlergi = 2;
                $scope.data.DataKonsumsi = 2;
                $scope.data.DataDuplikat = 2;
                $scope.data.DataInteraksi = 2;
                $scope.data.DataAntibiotik = 2;
                $scope.data.DataPoli = 2;
            }

            $scope.getCheckResepPulang = function (checkResepPulang) {
                if (checkResepPulang != undefined) {
                    $scope.checkResepPulang = checkResepPulang
                }
            }
            $scope.getCheckDonasi = function (checkDonasi) {
                if (checkDonasi != undefined) {
                    $scope.checkDonasi = checkDonasi
                }
            }

            function init() {
                $scope.isRouteLoading = true;
                // 
                medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false;
                    $scope.listPenulisResep = dat.data.penulisresep;
                    $scope.listRuangan = dat.data.ruangan;
                    $scope.listJenisKemasan = dat.data.jeniskemasan;
                    $scope.listProduk = dat.data.produk;
                    $scope.listAsalProduk = dat.data.asalproduk;
                    $scope.listRoute = dat.data.route;
                    $scope.listAturanPakai = dat.data.signa;
                    $scope.listwaktuminum = dat.data.waktuminum;
                    $scope.listJenisRacikan = dat.data.jenisracikan;
                    pegawaiUser = dat.data.detaillogin[0];
                    $scope.item.tarifadminresep = dat.data.tarifadminresep.nilaifield
                    $scope.item.tarifjasaresepracikan = dat.data.tarifjasaresepracikan.nilaifield
                    $scope.item.tarifjasaresepnonracikan = dat.data.tarifjasaresepnonracikan.nilaifield

                    $scope.listsbsm = [{
                        id: 1,
                        name: 'Sebelum Makan'
                    }, {
                        id: 2,
                        name: 'Bersama'
                    }, {
                        id: 3,
                        name: 'Sesudah Makan'
                    }]

                    // $scope.item.ruangan = {id:$scope.listRuangan[0].id,namaruangan:$scope.listRuangan[0].namaruangan}
                    // $scope.item.penulisResep = {id:data_ih.data.detailresep.pgid,namalengkap:data_ih.data.detailresep.namalengkap}

                    if (noOrder != '') {
                        if (noOrder == 'EditResep') {
                            medifirstService.get("farmasi/get_detail-resep?norecResep=" + norecResep, true).then(function (data_ih) {
                                $scope.isRouteLoading = false;
                                LoadSkrining();
                                $scope.disabledRuangan = true;
                                $scope.item.resep = data_ih.data.detailresep.noresep
                                $scope.item.ruangan = {
                                    id: data_ih.data.detailresep.id,
                                    namaruangan: data_ih.data.detailresep.namaruangan
                                }
                                $scope.item.penulisResep = {
                                    id: data_ih.data.detailresep.pgid,
                                    namalengkap: data_ih.data.detailresep.namalengkap
                                }
                                if (data_ih.data.detailresep.isreseppulang == '1') {
                                    $scope.checkResepPulang = true;
                                } else {
                                    $scope.checkResepPulang = false;
                                }

                                data2 = data_ih.data.pelayananPasien
                                dataOK = data_ih.data.pelayananPasienkronis
                                $scope.item.rke = data2.length + 1;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    data2[i].noregistrasifk = norec_apd //$scope.item.noRegistrasi
                                    data2[i].tglregistrasi = $scope.item.tglregistrasi
                                    data2[i].kelasfk = $scope.item.kelas.id
                                }
                                for (var i = dataOK.length - 1; i >= 0; i--) {
                                    dataOK[i].noregistrasifk = norec_apd //$scope.item.noRegistrasi
                                    dataOK[i].tglregistrasi = $scope.item.tglregistrasi
                                    dataOK[i].kelasfk = $scope.item.kelas.id
                                }

                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });
                                $scope.dataGridStok = new kendo.data.DataSource({
                                    data: dataOK
                                });


                                // $scope.dataGrid = dat.data.orderpelayanan
                                // $scope.item.ruangan = {id:dat.data.strukorder.id,namaruangan:dat.data.strukorder.namaruangan}
                                // $scope.item.penulisResep = {id:dat.data.strukorder.pgid,namalengkap:dat.data.strukorder.namalengkap}
                                var subTotal = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    subTotal = subTotal + parseFloat(data2[i].total)
                                }
                                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        } else {
                            medifirstService.get("farmasi/get-detail-order?noorder=" + noOrder, true).then(function (dat) {
                                $scope.isRouteLoading = false;
                                $scope.disabledRuangan = false;
                                $scope.item.ruangan = {
                                    id: dat.data.strukorder.id,
                                    namaruangan: dat.data.strukorder.namaruangan
                                }
                                debugger
                                $scope.item.no = dat.data.strukorder.noorder;

                                $scope.item.penulisResep = {
                                    id: dat.data.strukorder.pgid,
                                    namalengkap: dat.data.strukorder.namalengkap
                                }
                                if (dat.data.strukorder.isreseppulang == '1') {
                                    $scope.checkResepPulang = true;
                                } else {
                                    $scope.checkResepPulang = false;
                                }
                                data2 = dat.data.orderpelayanan
                                dataPulang = dat.data.orderpelayanan;
                                for (var i = 0; i < dataPulang.length; i++) {
                                 if (dataPulang[i].isobatpulang === "1") {
                                 $scope.obatpulang = true;
                                break;  // Hentikan loop jika sudah ditemukan satu yang bernilai 1
                                     }
                                }
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    // data.no = $scope.item.no
                                    // medifirstService.getDataTableTransaksi("logistik/get-produkdetail?"+
                                    //     "produkfk="+ data2[i].produkfk +
                                    //     "&ruanganfk="+ $scope.item.ruangan.id , true).then(function(dat){
                                    //         //dataProdukDetail =dat.data.detail;
                                    //         // data2[i].jmlstok =dat.data.jmlstok / data2[i].nilaiKonversi
                                    //         // data2[i].jumlah =dat.data.detail.jumlah//parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.dataSelected.nilaikonversi)
                                    //         // $scope.item.hargaSatuan =0
                                    //         // $scope.item.hargadiskon =0
                                    //         // $scope.item.total =0
                                    //         // $scope.item.jumlahxmakan =1
                                    //         // $scope.item.dosis =dat.data.detail.dosis
                                    //         // $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)

                                    //         // $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                                    //         // $scope.item.satuan = {ssid:$scope.dataSelected.satuanviewfk,satuanstandar:$scope.dataSelected.satuanview}
                                    //         for (var i = 0; i < dat.data.detail.length; i++) {
                                    //             if (parseFloat(data2[i].jumlah * parseFloat(data2[i].nilaikonversi) ) <= parseFloat(dat.data.detail[i].qtyproduk) ){
                                    //                 hrg1 = parseFloat(dat.data.detail[i].hargajual)* parseFloat(data2[i].nilaikonversi)
                                    //                 hrgsdk = parseFloat(dat.data.detail[i].hargadiscount) * parseFloat(data2[i].nilaikonversi)
                                    //                 data2[i].hargasatuan = hrg1
                                    //                 data2[i].hargadiscount = hrgsdk
                                    //                 data2[i].total = parseFloat(data2[i].jumlah) * (hrg1-hrgsdk)
                                    //                 data2[i].nostrukterimafk = dat.data.detail[i].norec
                                    //                 data2[i].asalproduk=dat.data.detail[i].asalproduk
                                    //                 data2[i].asalprodukfk=dat.data.detail[i].objectasalprodukfk
                                    //                 break;
                                    //             }
                                    //         }
                                    //         // data2[i].hargasatuan =dat.data.detail.hargajual
                                    //         // data2[i].hargadiscount = dat.data.detail.hargadiscount
                                    //         // data2[i].total = (dat.data.detail.hargajual-dat.data.detail.hargadiscount)*data2[i].jumlah
                                    // });

                                    data2[i].noregistrasifk = norec_apd //$scope.item.noRegistrasi
                                    data2[i].tglregistrasi = $scope.item.tglregistrasi
                                    // data.generik = null
                                    //data2[i].hargajual = $scope.item.hargaSatuan
                                    // data.jenisobatfk = null
                                    data2[i].kelasfk = $scope.item.kelas.id
                                    //data2[i].stock = $scope.item.stok
                                    //data2[i].harganetto = $scope.item.hargaSatuan
                                    //data2[i].nostrukterimafk = noTerima
                                    // data.ruanganfk = $scope.item.ruangan.id

                                    // data.rke = $scope.item.rke
                                    // data.jeniskemasanfk = $scope.item.jenisKemasan.id
                                    // data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                                    // data2[i].aturanpakaifk = $scope.item.aturanPakai.id
                                    // data2[i].aturanpakai = $scope.item.aturanPakai.nama
                                    // data.routefk = $scope.item.route.id
                                    // data.route = $scope.item.route.name
                                    //data2[i].asalprodukfk = $scope.item.asal.id
                                    //data2[i].asalproduk = $scope.item.asal.asalproduk
                                    // data.produkfk = $scope.item.produk.id
                                    // data.namaproduk = $scope.item.produk.namaproduk
                                    // data.nilaikonversi = $scope.item.nilaiKonversi
                                    // data.satuanstandarfk = $scope.item.satuan.id
                                    // data.satuanstandar = $scope.item.satuan.satuanstandar
                                    // data.satuanviewfk = $scope.item.satuan.ssid
                                    // data.satuanview = $scope.item.satuan.satuanstandar
                                    //data2[i].jmlstok = $scope.item.stok
                                    // data.jumlah = $scope.item.jumlah
                                    //data2[i].hargasatuan = $scope.item.hargaSatuan
                                    //data2[i].hargadiscount = $scope.item.hargadiskon
                                    //data2[i].total = $scope.item.total
                                    if (data2[i].obatkronis == "1") {
                                        var qtyOK = 0;
                                        data2[i].jumlahreal = parseFloat(data2[i].jumlah);
                                        qtyOK = (parseFloat(data2[i].jumlah) * 7) / 30
                                        data2[i].jumlah = qtyOK;
                                        data2[i].jumlahobat = qtyOK;
                                        data2[i].jumlahcetak = parseFloat(data2[i].jumlahreal) - qtyOK;
                                        data2[i].total = (parseFloat(qtyOK) * (parseFloat(data2[i].hargasatuan) - parseFloat(data2[i].hargadiscount)) * parseFloat(data2[i].nilaikonversi)) + parseFloat(data2[i].jasa);
                                        dataOK.push(data2[i]);
                                    }
                                }
                             
                                // for (let x = 0; x < dataOK.length; x++) {
                                //     const element = dataOK[x];
                                //     element.no = x + 1;
                                // }

                                // $scope.dataGrid.add($scope.dataSelected)
                                debugger
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });
                                // $scope.dataGrid = dat.data.orderpelayanan

                                var subTotal = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    subTotal = subTotal + parseFloat(data2[i].total)
                                }
                                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        }
                    }
                });

            }

            function LoadSkrining() {
                medifirstService.get("farmasi/get-histori-skrining?norecResep=" + norecResep, true).then(function (data_ih) {
                    var datas = data_ih.data[0]
                    $scope.data.Penulis = datas.rpenulis;
                    $scope.data.Tanggal = datas.rtanggalresep;
                    $scope.data.DataRM = datas.rmr;
                    $scope.data.Pasien = datas.rpasien;
                    $scope.data.DataLahir = datas.rtanggallahir;
                    $scope.data.Berat = datas.rberatbedan;
                    $scope.data.DataDokter = datas.rdokter;
                    $scope.data.DataRuang = datas.rruang;
                    $scope.data.DataStatus = datas.rstatusjamin;
                    $scope.data.Obat = datas.robat;
                    $scope.data.DataKekuatan = datas.rkekuatan;
                    $scope.data.DataJumlah = datas.rjumlahobat;
                    $scope.data.DataStabilitas = datas.rstabilitas;
                    $scope.data.DataAturan = datas.raturan;
                    $scope.data.DataIndikasi = datas.rindikasiobat;
                    $scope.data.DataAlergi = datas.ralergi;
                    $scope.data.DataKonsumsi = datas.rkonsumsi;
                    $scope.data.DataDuplikat = datas.rduplikat;
                    $scope.data.DataInteraksi = datas.rinteraksi;
                    $scope.data.DataAntibiotik = datas.rantibiotik;
                    $scope.data.DataPoli = datas.rpolifarmasi;
                    $scope.data.PenyekriningResep = datas.namapenyekriningresep;
                    $scope.data.Peracik = datas.namaperacik;
                    $scope.data.Pengecek = datas.Pengecek;
                    $scope.data.Penyerah = datas.namapenyrahobat;
                    $scope.data.Penerima = datas.namapenerimaobat;

                    $scope.data.KetPoli = datas.ketpolifarmasi;
                    $scope.data.KetAntibiotik = datas.ketantibiotik;
                    $scope.data.KetInteraksi = datas.ketinteraski;
                    $scope.data.KetDuplikat = datas.ketduplikasi;
                    $scope.data.KetKonsumsi = datas.ketkonsumsi;
                    $scope.data.KetAlergi = datas.ketalergi;
                    $scope.data.KetIndikasi = datas.ketindikasi;
                    $scope.data.KetAturan = datas.ketaturan;
                    $scope.data.KetStabilitas = datas.ketstabilitas;
                    $scope.data.KetJumlah = datas.ketjumlah;
                    $scope.data.KetKekuatan = datas.ketkekuatan;
                    $scope.data.KetObat = datas.ketobat;
                    $scope.data.KetStatus = datas.ketstatus;
                    $scope.data.KetRuang = datas.ketruang;
                    $scope.data.KetDokter = datas.ketdokter;
                    $scope.data.KetBerat = datas.ketberat;
                    $scope.data.KetLahir = datas.kettanggallahir;
                    $scope.data.KetPasien = datas.ketpasien;
                    $scope.data.KetRM = datas.ketrm;
                    $scope.data.KetTanggal = datas.kettanggal;
                    $scope.data.KetPenulis = datas.ketpenulis;
                    $scope.data.DataCek = datas.rcek;
                    if (datas.prinsipbesar != '' || datas.prinsipbesar != null) {
                        var prinsipbesar = datas.prinsipbesar.split(',')
                        prinsipbesar.forEach(function (data) {
                            $scope.listPrinsipBesar.forEach(function (e) {
                                for (let i in e.detail) {
                                    if (e.detail[i].id == data) {
                                        e.detail[i].isChecked = true
                                        var dataid = {
                                            "id": e.detail[i].id,
                                            "nama": e.detail[i].nama,
                                            "value": e.detail[i].id,
                                        }
                                        $scope.currentPrinsipBesar.push(dataid)
                                    }
                                }
                            })
                        })
                    }

                });
            }

            $scope.getSatuan = function () {

                /* info stok all ruangan */
                // medifirstService.get("farmasi/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                //     .then(function (e) {
                //         $scope.item.namaProduks = $scope.item.produk.namaproduk;
                //         for (var i = 0; i < e.data.infostok.length; i++) {
                //             e.data.infostok[i].no = i + 1
                //         }
                //         $scope.dataGridStok = new kendo.data.DataSource({
                //             data: e.data.infostok,
                //             pageable: true,
                //             pageSize: 5,
                //             total: e.data.infostok.length,
                //             serverPaging: false,
                //             schema: {
                //                 model: {
                //                     fields: {
                //                     }
                //                 }
                //             }
                //         })
                //     })
                /* end info stok all ruangan */

                GETKONVERSI()
            }

            function GETKONVERSI() {
                if ($scope.item.produk == undefined) {
                    return
                }
                if ($scope.item.produk == "") {
                    return
                }
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{
                        ssid: $scope.item.produk.ssid,
                        satuanstandar: $scope.item.produk.satuanstandar
                    }])
                }
                $scope.item.satuan = {
                    ssid: $scope.item.produk.ssid,
                    satuanstandar: $scope.item.produk.satuanstandar
                }
                $scope.item.nilaiKonversi = 1 // $scope.item.satuan.nilaikonversi
                if ($scope.item.ruangan == undefined) {
                    //alert("Pilih Ruangan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     //alert("Pilih asal terlebih dahulu!!")
                //     return;
                // }


                if ($scope.item.jenisKemasan.id != 3) {
                    $scope.item.jumlah = 0
                    $scope.item.jumlahbulat = 0;
                    $scope.item.dosis = 1
                    $scope.item.jumlahxmakan = 1

                }

                statusTambah = false
                medifirstService.get("farmasi/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id +
                    "&kelompokpasien=" + $scope.item.kdkelompokPasien, true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
                        $scope.item.kekuatan = dat.data.kekuatan
                        $scope.item.sediaan = dat.data.sediaan
                        $scope.consis = dat.data.consis;
                        $scope.item.dosisobat = dat.data.dosisobat
                        medifirstService.get("logistik/get-cekstok?" +
                            "produkfk=" + $scope.item.produk.id +
                            "&ruanganfk=" + $scope.item.ruangan.id, true).then(function (dat2) {

                                var currentDate = '';
                                if (parseFloat($scope.item.stok) != parseFloat(dat2.data.kartustoklast[0].saldoawal)) {
                                    if (dat2.data.kartustoksebelum.length == 0) {
                                        currentDate = dat2.data.kartustoklast[0].created_at;
                                    } else {
                                        currentDate = dat2.data.kartustoksebelum[0].created_at;
                                    }
                                    var objSave = {
                                        "ruanganfk": $scope.item.ruangan.id,
                                        "produkfk": $scope.item.produk.id,
                                        "tglawal": moment(currentDate).format('YYYY-MM-DD 00:00:00')
                                    }
                                    medifirstService.postNonMessage('logistik/save-perbaiki-kartu-stok', objSave).then(function (e) {
                                        // alert('yoyoyyy');
                                    })
                                }
                            });

                        //parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.dataSelected.nilaikonversi)
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        // $scope.item.jumlahxmakan =1
                        if ($scope.dataSelected != undefined) {
                            $scope.item.jumlah = 0
                            $scope.item.jumlah = $scope.dataSelected.jumlahobat
                            $scope.item.jumlahbulat = $scope.dataSelected.jumlah; //Math.ceil($scope.dataSelected.jumlah);
                            $scope.item.dosis = $scope.dataSelected.dosis
                            $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                            $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                            $scope.item.satuan = {
                                ssid: $scope.dataSelected.satuanviewfk,
                                satuanstandar: $scope.dataSelected.satuanview
                            }
                            $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                            $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                            $scope.item.hargaNetto = $scope.dataSelected.harganetto
                            $scope.item.total = $scope.dataSelected.total
                        }
                        statusTambah = true


                    });

                    medifirstService.get("farmasi/get-produkdata?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id +
                    "&noregis=" + $scope.item.noRegistrasi, true).then(function(dat) {
                    $scope.data = dat.data.data;
                    debugger;
                });

            }
            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }
            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0 //parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.jumlahbulat = 0;
                        $scope.item.hargaSatuan = 0 //hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0 //hrgsdk * parseFloat(newValue)
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0 // parseFloat(newValue) *
                        // (hrg1-hrgsdk)
                        // $scope.item.jumlahxmakan =1
                        // $scope.item.dosis =1
                    }
                }
            });
            $scope.$watch('item.rke', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (tarifJasa == 0) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            tarifJasa = parseFloat($scope.item.tarifadminresep) //800
                            if (data2[i].rke == $scope.item.rke) {
                                tarifJasa = 0
                                break;
                            }

                        }
                    }
                }
            });
            // $scope.$watch('item.tglAwal', function(newValue, oldValue) {
            //     statusPosting == true
            //     if (newValue != oldValue  ) {
            //         statusPosting == true
            //         var tgltgl = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
            //         medifirstService.getDataTableTransaksi("akutansi/get-sudah-posting?tgl="+
            //             tgltgl, true).then(function(dat){
            //                 statusPosting = dat.data.status
            //                 if (statusPosting == true) {
            //                     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
            //                 }
            //             }
            //         )
            //     }
            //     $scope.tombolSimpanVis = true
            // });
            $scope.$watch('item.jumlahxmakan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                            $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                            $scope.item.jumlah = Math.ceil($scope.item.jumlah);
                            if ($scope.item.jumlah == undefined) {
                                $scope.item.jumlah = 0;
                            }
                            $scope.item.jumlahbulat = $scope.item.jumlah //Math.ceil($scope.item.jumlah);
                        }

                    }
                }
            });
            $scope.$watch('item.kekuatan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                        if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                            $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                            if ($scope.item.jumlah == NaN) {
                                $scope.item.jumlah = 0;
                            }
                            $scope.item.jumlah = Math.ceil($scope.item.jumlah);

                            $scope.item.jumlahbulat = $scope.item.jumlah //Math.ceil($scope.item.jumlah);
                        }
                    }
                }
            });
            $scope.$watch('item.dosis', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                        if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                            $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                            $scope.item.jumlah = Math.ceil($scope.item.jumlah);
                            $scope.item.jumlahbulat = $scope.item.jumlah //Math.ceil($scope.item.jumlah);
                        }
                    }
                }
            });
            $scope.$watch('item.jenisKemasan.jeniskemasan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue == 'Racikan') {
                        $scope.showRacikanDose = true
                    } else {
                        $scope.showRacikanDose = false
                    }
                    // if (newValue == 'Racikan') {
                    //    $scope.showInputObat =false
                    //    $scope.showRacikan = true
                    // }else{

                    //    $scpoe.showInputObat =true
                    //    $scope.showRacikan = false
                    // }
                }
            });

            $scope.$watch('item.hargadiskon', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.hargadiskon != 0 || $scope.item.hargadiskon != undefined) {
                        if ($scope.item.persen == 'persen') {
                            hrgsdk = parseFloat($scope.item.hargaSatuan) * parseFloat($scope.item.hargadiskon) / 100;
                        } else {
                            hrgsdk = $scope.item.hargadiskon
                        }
                    }
                    $scope.item.total = (parseFloat($scope.item.jumlahbulat) * (hrg1 - hrgsdk)) + parseFloat(tarifJasa)
                }
            })

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.jenisKemasan == undefined) {
                        return
                    }
                    // if (racikan == 'Racikan') {
                    //     hrg1 = parseFloat($scope.item.totalSubTotalR)
                    //     hrgsdk = parseFloat($scope.item.totalDiskonR)
                    //     $scope.item.hargaSatuan =hrg1
                    //     $scope.item.hargadiskon =hrgsdk
                    //     $scope.item.total = parseFloat($scope.item.jumlah) * (hrg1-hrgsdk)
                    //     noTerima = null
                    // }else{
                    if ($scope.item.stok == 0) {
                        $scope.item.jumlah = 0
                        //alert('Stok kosong')

                        return;
                    }
                    var qty20 = 0
                    // tarifJasa = parseFloat($scope.item.tarifadminresep) //800
                    // if ($scope.item.objectdepartemenfk == 18 || $scope.item.objectdepartemenfk == 24) {
                    //     if ($scope.item.kdkelompokPasien == 1) {
                    //         if ($scope.item.rke == 1) {
                    //             if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    //                 tarifJasa = tarifJasa + parseFloat($scope.item.tarifjasaresepracikan);
                    //             } else {
                    //                 tarifJasa = tarifJasa + parseFloat($scope.item.tarifjasaresepnonracikan);

                    //             }
                    //         }
                    //     }
                    // }
                    if ($scope.item.kdkelompokPasien == 1) {
                        if ($scope.item.produk.objectkelompokprodukbpjsfk == 16) {
                            tarifJasa = 2000;
                        } else {
                            tarifJasa = 4000;
                        }
                    }

                    // if (parseFloat(tarifJasa) != 0) {
                    //     if ($scope.item.jenisKemasan.id == 2) {
                    //         tarifJasa = parseFloat($scope.item.tarifadminresep) //800
                    //     }
                    //     if ($scope.item.jenisKemasan.id == 1) {
                    //         qty20 = Math.floor(parseFloat($scope.item.jumlah) / 20)
                    //         if (parseFloat($scope.item.jumlah) % 20 == 0) {
                    //             qty20 = qty20
                    //         } else {
                    //             qty20 = qty20 + 1
                    //         }

                    //         if (qty20 != 0) {
                    //             tarifJasa = tarifJasa * qty20
                    //         }


                    //     }
                    //     if ($scope.item.jenisKemasan.id == 3) {
                    //         //@allz
                    //         //ditutup dulu
                    //         if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    //             // if ($scope.item.produk.namaproduk.match(/KAPSUL.*/)) {
                    //             // tarifJasa= (parseFloat(tarifJasa)*parseFloat($scope.item.jumlahbulat));
                    //             // }else{
                    //             tarifJasa = 3500;
                    //             // }
                    //         }
                    //     }

                    // }
                    // if ($scope.item.no == undefined) {
                    //     for (var i = data2.length - 1; i >= 0; i--) {
                    //         if (data2[i].rke == $scope.item.rke) {
                    //             tarifJasa = 0
                    //         }
                    //     }
                    // }
                    // tarifJasa =
                    $scope.item.jumlahbulat = $scope.item.jumlah; //Math.ceil($scope.item.jumlah);
                    var ada = false;
                    for (var i = 0; i < dataProdukDetail.length; i++) {
                        ada = false
                        if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi)) <= parseFloat(dataProdukDetail[i].qtyproduk)) {
                            hrg1 = Math.round(parseFloat(dataProdukDetail[i].hargajual) * parseFloat($scope.item.nilaiKonversi))
                            hrgsdk = parseFloat(dataProdukDetail[i].hargadiscount) * parseFloat($scope.item.nilaiKonversi)
                            $scope.item.hargaSatuan = hrg1
                            $scope.item.hargaNetto = Math.round(parseFloat(dataProdukDetail[i].harganetto) * parseFloat($scope.item.nilaiKonversi))
                            if ($scope.item.hargadiskon == 0) {
                                $scope.item.hargadiskon = hrgsdk
                            } else {
                                hrgsdk = $scope.item.hargadiskon
                            }


                            $scope.item.total = (parseFloat($scope.item.jumlahbulat) * (hrg1 - hrgsdk)) + parseFloat(tarifJasa)

                            noTerima = dataProdukDetail[i].norec
                            $scope.item.asal = {
                                id: dataProdukDetail[i].objectasalprodukfk,
                                asalproduk: dataProdukDetail[i].asalproduk
                            }
                            ada = true;
                            break;
                        }
                    }
                    if (ada == false) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0

                        noTerima = ''
                        if (dataProdukDetail.length > 1) {
                            var stt = 'false'
                            if (confirm('Struk Penerimaan berbeda, merge/satukan stok? ')) {
                                var objSave = {
                                    produkfk: $scope.item.produk.id,
                                    ruanganfk: $scope.item.ruangan.id
                                }

                                $scope.tombolSimpanVis = false;
                                medifirstService.post('farmasi/save-stock-merger', objSave).then(function (e) {
                                    Kosongkan()
                                    $scope.tombolSimpanVis = true;
                                })
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }

                        }
                    }
                    if ($scope.item.jumlah == 0) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargaNetto = 0
                    }
                    // }
                    // if ($scope.item.stok > 0) {
                    //     $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
                    // }
                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm:ss');
            }

            $scope.tambah = function () {
                debugger
                document.getElementById("x").focus();

                if (statusTambah == false) {
                    return
                }

                if ($scope.item.penulisResep == undefined || $scope.item.penulisResep.id == null || $scope.item.penulisResep.namalengkap == '-' || $scope.item.penulisResep.id == 1) {
                    alert("Penulis Resep Belum Diisi!")
                    return;
                }

                if ($scope.item.ruangan == undefined) {
                    alert("Ruangan Belum Diisi!!")

                    return;
                }
                if ($scope.item.jumlah == 0 && $scope.checkDonasi == false && $scope.item.stok != 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                debugger;
                 if ($scope.model.kronis != false && $scope.model.kronis != undefined || $scope.model.kronisall != false && $scope.model.kronisall != undefined) {
                    if ($scope.data == true) {
                    alert("Obat Ini Kurang Dari 1 Bulan!")
                    return;
                    }
                }
                if ($scope.item.hargaSatuan == 0 && $scope.checkDonasi == false && $scope.item.stok != 0) {
                    alert("Harga Satuan tidak memiliki harga!")
                    return;
                }
                if ($scope.item.total == 0 && $scope.checkDonasi == false) {
                    alert("Stok tidak ada harus di isi!")
                    return;
                }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                if (noTerima == '') {
                    $scope.item.jumlah = 0
                    alert("Jumlah blm di isi!!")
                    return;
                }
                if ($scope.item.produk == undefined || $scope.item.produk == null) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.aturanPakai == undefined) {
                    alert("Aturan Pakai Belum Diisi!!")
                    return;
                }
                if ($scope.checkDonasi == true) {
                    $scope.item.hargaSatuan = 0;
                    $scope.item.total = 800;
                    $scope.item.hargaNetto = 0;
                }
                var KetPakai = "";
                if ($scope.item.KeteranganPakai) {
                    KetPakai = $scope.item.KeteranganPakai;
                }

                var jRacikan = null
                if ($scope.item.jenisRacikan != undefined) {
                    jRacikan = $scope.item.jenisRacikan.id
                }
                var waktuminum = null
                if ($scope.item.waktuminum != undefined) {
                    waktuminum = $scope.item.waktuminum.id
                }
                // var aturanpakai = null
                // if ($scope.item.aturanPakai != undefined) {
                //     aturanpakai = $scope.item.aturanPakai.id
                // }
                // // ini buat penjagaan
                // if ($scope.item.route == undefined || $scope.item.route == null) {
                //     alert("Route Pemakaian Belum Dipilih");
                //     return;
                // }
                if ($scope.item.aturanPakai == undefined || $scope.item.aturanPakai == null || $scope.item.aturanPakai == "") {
                    alert("Aturan Pakai Belum Dipilih");
                    return;
                }

                var dosis = 1;
                if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    // if ($scope.item.produk.namaproduk.match(/KAPSUL.*/)) {
                    //     tarifJasa = tarifJasa * $scope.item.jumlah
                    // } else {
                    //     tarifJasa = 0;
                    // }
                    var objSavexx = {
                        id: $scope.item.produk.id,
                        kekuatan: $scope.item.dosis //$scope.dataGrid._data
                    }
                    medifirstService.postNonMessage("sysadmin/master/updatekekuatan", objSavexx).then(function (e) {
                        debugger;
                    })
                    dosis = $scope.item.dosis
                    $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                } else {
                    $scope.item.jumlahxmakan = $scope.item.jumlah
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var ketobatpulang = 'Obat';
                var isobatpulang = 'false';
                if ($scope.model.isObatPulang == true) {
                    isobatpulang = 'true';
                    ketobatpulang = 'Obat Pulang';
                }
                var kronis = false
                if ($scope.model.kronis == undefined) {
                    kronis = false
                } else {
                    kronis = $scope.model.kronis
                }
                var kronisall = false
                if ($scope.model.kronisall == undefined) {
                    kronisall = false
                } else {
                    kronisall = $scope.model.kronisall
                }
                $scope.disabledRuangan = true;
                var data = {};
                var datax = {};
                if ($scope.item.hargadiskon != 0 || $scope.item.hargadiskon != undefined) {
                    if ($scope.item.persen == 'persen') {

                        $scope.item.hargadiskon = ((parseFloat($scope.item.jumlahbulat) * parseFloat($scope.item.hargaSatuan)) + parseFloat(tarifJasa)) * $scope.item.hargadiskon / 100;
                    }
                }
                if ($scope.item.no != undefined) {
                    debugger
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.noregistrasifk = norec_apd //$scope.item.noRegistrasi
                            data.tglregistrasi = moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss')
                            data.generik = null
                            data.hargajual = String($scope.item.hargaSatuan)
                            data.jenisobatfk = jRacikan
                            data.kelasfk = $scope.item.kelas.id
                            data.stock = String($scope.item.stok)
                            data.harganetto = String($scope.item.hargaNetto)
                            data.nostrukterimafk = noTerima
                            data.ruanganfk = $scope.item.ruangan.id

                            data.rke = $scope.item.rke
                            data.jeniskemasanfk = $scope.item.jenisKemasan.id
                            data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                            // data.aturanpakaifk = $scope.item.aturanPakai.id
                            data.aturanpakai = $scope.item.aturanPakai.name
                            // data.aturanpakai = $scope.item.aturanPakai //+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name
                            data.ispagi = $scope.item.chkp
                            data.issiang = $scope.item.chks
                            data.issore = $scope.item.chksr
                            data.ismalam = $scope.item.chkm
                            // data.aturanpakai2 = $scope.item.aturanPakai2
                            // data.sbsmid = $scope.item.sbsm.id
                            // data.sbsmname = $scope.item.sbsm.name
                            data.routefk = $scope.item.route != undefined ? $scope.item.route.id : null
                            data.route = $scope.item.route != undefined ? $scope.item.route.name : null
                            data.asalprodukfk = $scope.item.asal.id
                            data.asalproduk = $scope.item.asal.asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = String($scope.item.stok)
                            data.jumlah = $scope.item.jumlahbulat
                            data.jumlahobat = $scope.item.jumlah
                            data.dosis = dosis
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.hargadiscount = String($scope.item.hargadiskon)
                            data.total = $scope.item.total
                            data.jmldosis = String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan)
                            data.jasa = tarifJasa
                            data.keterangan = $scope.item.waktuminum.waktuminum
                            data.kronis = kronis
                            data.dosisobat = $scope.item.dosisobat
                            data.waktuminum = $scope.item.waktuminum.waktuminum
                            data.ketobatpulang = ketobatpulang
                            data.isobatpulang = isobatpulang
                            // data2[i] = data;


                            if (kronisall == true) {
                                var qtyOK = 0;
                                data.jumlahreal = parseFloat($scope.item.jumlah);
                                qtyOK = (parseFloat(data.jumlah))
                                qtyOK = Math.ceil(qtyOK);
                                // Math.ceil = Math.round(qtyOK);
                                data.total = ((parseFloat(data.jumlahobat)) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount))) + parseFloat(data.jasa);

                                // data2[i] = data;
                                data.jumlah = qtyOK;
                                data.jumlahobat = qtyOK;
                                data.jumlahcetak = qtyOK;
                                data.harga = parseFloat(data.hargasatuan);
                                data.totalok = (parseFloat(qtyOK) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount)) * parseFloat(data.nilaikonversi));
                                dataOK[i] = data;
                            } else if (kronis == true) {
                                var qtyOK = 0;
                                data.jumlahreal = parseFloat($scope.item.jumlah);
                                qtyOK = (parseFloat($scope.item.jumlah) * 7) / 30
                                qtyOK = Math.ceil(qtyOK);
                                // Math.ceil = Math.round(qtyOK);
                                data.total = ((parseFloat(data.jumlahobat) - (parseFloat(qtyOK))) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount))) + parseFloat(data.jasa);

                                data2[i] = data;
                                data.jumlah = qtyOK;
                                data.jumlahobat = qtyOK;
                                data.jumlahcetak = parseFloat(data.jumlahreal) - qtyOK;
                                data.harga = parseFloat(data.hargasatuan);
                                data.totalok = (parseFloat(qtyOK) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount)) * parseFloat(data.nilaikonversi));
                                dataOK[i] = data;
                            } else {
                                data2[i] = data;
                                for (var i = dataOK.length - 1; i >= 0; i--) {
                                    if (dataOK[i].no == $scope.item.no) {
                                        dataOK.splice(i, 1);
                                        var subTotal = 0;
                                        for (var i = dataOK.length - 1; i >= 0; i--) {
                                            subTotal = subTotal + parseFloat(dataOK[i].total)
                                            dataOK[i].no = i + 1
                                        }
                                    }
                                }

                            }



                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            $scope.dataGridStok = new kendo.data.DataSource({
                                data: dataOK
                            });

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                } else {
                    // for (var i = data2.length - 1; i >= 0; i--) {
                    //     if (data2[i].namaproduk == $scope.item.produk.namaproduk) {
                    //         $scope.item.rke = data2[i].rke;
                    //         $scope.item.no = data2[i].no;
                    //         data2.splice(i, 1);


                    //     }
                    // }
                    data = {
                        no: nomor,
                        noregistrasifk: norec_apd, //$scope.item.noRegistrasi,
                        tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                        generik: null,
                        hargajual: String($scope.item.hargaSatuan),
                        jenisobatfk: jRacikan,
                        kelasfk: $scope.item.kelas.id,
                        stock: String($scope.item.stok),
                        harganetto: String($scope.item.hargaNetto),
                        nostrukterimafk: noTerima,
                        ruanganfk: $scope.item.ruangan.id, //£££
                        rke: $scope.item.rke,
                        jeniskemasanfk: $scope.item.jenisKemasan.id,
                        jeniskemasan: $scope.item.jenisKemasan.jeniskemasan,
                        // aturanpakaifk:$scope.item.aturanPakai.id,
                        aturanpakai: $scope.item.aturanPakai.name,
                        // aturanpakai: $scope.item.aturanPakai, //+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name,
                        ispagi: $scope.item.chkp,
                        issiang: $scope.item.chks,
                        issore: $scope.item.chksr,
                        ismalam: $scope.item.chkm,
                        // aturanpakai2: $scope.item.aturanPakai2 ,
                        // sbsmid: $scope.item.sbsm.id,
                        // sbsmname: $scope.item.sbsm.name,
                        routefk: $scope.item.route != undefined ? $scope.item.route.id : null,
                        route: $scope.item.route != undefined ? $scope.item.route.name : null,
                        asalprodukfk: $scope.item.asal.id,
                        asalproduk: $scope.item.asal.asalproduk,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jmlstok: String($scope.item.stok),
                        jumlah: $scope.item.jumlahbulat,
                        jumlahobat: $scope.item.jumlah,
                        dosis: dosis,
                        hargasatuan: String($scope.item.hargaSatuan),
                        hargadiscount: String($scope.item.hargadiskon),
                        total: $scope.item.total,
                        jmldosis: String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan),
                        jasa: tarifJasa,
                        kronis: kronis,
                        keterangan: $scope.item.waktuminum.waktuminum,
                        dosisobat: $scope.item.dosisobat,
                        waktuminum: $scope.item.waktuminum.waktuminum,
                        isobatpulang: isobatpulang,
                        ketobatpulang: ketobatpulang,
                    }

                    if (kronisall == true) {
                        var qtyOK = 0;
                        // data.jumlahreal = parseFloat(data.jumlah);
                        // if (data.jumlahreal == 1) {
                        //     qtyOK = 0
                        //     data.jumlah = 0
                        //     data.jumlahobat = 0
                        // } else {
                        //     qtyOK = (parseFloat(data.jumlah) * 7) / 30
                        // }
                        qtyOK = (parseFloat(data.jumlah))
                        qtyOK = Math.ceil(qtyOK);
                        data.total = ((parseFloat(data.jumlahobat)) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount))) + parseFloat(data.jasa);
                        // data2.push(data);
                        data.jumlah = qtyOK;
                        data.jumlahobat = qtyOK;
                        data.jumlahcetak = qtyOK;
                        data.harga = parseFloat(data.hargasatuan);
                        data.totalok = (parseFloat(qtyOK) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount)) * parseFloat(data.nilaikonversi));
                        dataOK.push(data);
                    } else if (kronis == true) {

                        var qtyOK = 0;
                        data.jumlahreal = parseFloat(data.jumlah);
                        if (data.jumlahreal == 1) {
                            qtyOK = 0
                            data.jumlah = 0
                            data.jumlahobat = 0
                        } else {
                            qtyOK = (parseFloat(data.jumlah) * 7) / 30
                        }

                        qtyOK = Math.ceil(qtyOK);
                        data.total = ((parseFloat(data.jumlahobat) - (parseFloat(qtyOK))) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount))) + parseFloat(data.jasa);
                        data2.push(data);
                        data.jumlah = qtyOK;
                        data.jumlahobat = qtyOK;
                        data.jumlahcetak = parseFloat(data.jumlahreal) - qtyOK;
                        data.harga = parseFloat(data.hargasatuan);
                        data.totalok = (parseFloat(qtyOK) * (parseFloat(data.hargasatuan) - parseFloat(data.hargadiscount)) * parseFloat(data.nilaikonversi));
                        dataOK.push(data);
                    } else {
                        data2.push(data)
                    }
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    $scope.dataGridStok = new kendo.data.DataSource({
                        data: dataOK
                    });

                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }
                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                    $scope.item.rke = parseFloat($scope.item.rke) + 1
                }
                if ($scope.consis == 1) {
                    $scope.statusConsis = true;
                }
                var objSave = {
                    produkfk: $scope.item.produk.id,
                    dosis: $scope.item.dosisobat //$scope.dataGrid._data
                }
                medifirstService.postNonMessage('logistik/save-updatedosis', objSave).then(function (e) { })
                // alert('yoyoyyy');
                // 26  0   t       jasa produksi non steril
                // 27  0   t       jasa pelayanan TPN
                // 28  0   t       jasa pelayanan handling cytotoxic
                // 29  0   t       jasa pelayanan IV Admixture
                // 30  0   t       jasa pelayanan Repacking obat injeksi
                // strStatus= $scope.item.produk.id

                Kosongkan()
                racikan = ''
                // statusTambah = false
            }
            $scope.diskon = function () {
                var diskon = 0;
                var total = 0;
                var temptotal = 0;
                diskon = $scope.item.diskonRpTagihan;
                for (var i = data2.length - 1; i >= 0; i--) {
                    data2[i].total = (parseFloat(data2[i].jumlah) * (data2[i].hargajual)) + parseFloat(data2[i].jasa)
                    total = data2[i].total + total;
                }
                // if(parseFloat(diskon) > parseFloat(total)){
                //     alert('diskon tidak boleh melebihi total biaya!')
                //     $scope.item.diskonRpTagihan = 0;
                //     return
                // }              
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (diskon > 0) {
                        temptotal = parseFloat(data2[i].total) - parseFloat(data2[i].jasa);
                        if (parseFloat(diskon) < parseFloat(temptotal)) {
                            // temptotal = parseFloat(data2[i].total) ;

                            data2[i].hargadiscount = parseFloat(diskon) / parseFloat(data2[i].jumlah);
                            data2[i].total = (parseFloat(data2[i].jumlah) * (data2[i].hargajual - data2[i].hargadiscount)) + parseFloat(data2[i].jasa)
                            diskon = 0;
                        } else {
                            // temptotal = parseFloat(data2[i].total) ;
                            data2[i].hargadiscount = parseFloat(temptotal) / parseFloat(data2[i].jumlah);
                            data2[i].total = (parseFloat(data2[i].jumlah) * (data2[i].hargajual - data2[i].hargadiscount)) + parseFloat(data2[i].jasa)
                            diskon = parseFloat(diskon) - parseFloat(temptotal)
                        }


                    } else if (parseFloat(diskon) <= 0) {
                        data2[i].hargadiscount = diskon;
                        data2[i].total = (parseFloat(data2[i].jumlah) * (data2[i].hargajual - data2[i].hargadiscount)) + parseFloat(data2[i].jasa)
                        diskon == parseFloat(diskon) - parseFloat(data2[i].total)
                    }
                }

                var subTotal = 0;
                for (var i = data2.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat(data2[i].total)
                    data2[i].no = i + 1
                }
                // data2.length = data2.length -1
                $scope.dataGrid = new kendo.data.DataSource({
                    data: data2
                });

                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            }

            $scope.klikGrid = function (dataSelected) {
                debugger
                if (statusTambah == false)
                    return
                var dataProduk = [];
                var kronis;
                $scope.item.jumlah = 0
                //no:no,
                debugger
                $scope.item.no = dataSelected.no
                $scope.item.rke = dataSelected.rke
                medifirstService.get("farmasi/get-jenis-obat?jrid=" + dataSelected.jenisobatfk, true).then(function (JR) {
                    $scope.item.jenisRacikan = {
                        id: JR.data.data[0].id,
                        jenisracikan: JR.data.data[0].jenisracikan
                    }
                });
                debugger
                $scope.item.produk = {
                    id: dataSelected.produkfk,
                    namaproduk: dataSelected.namaproduk
                }

                $scope.item.waktuminum = {
                    waktuminum: dataSelected.keterangan
                }

                $scope.item.jenisKemasan = {
                    id: dataSelected.jeniskemasanfk,
                    jeniskemasan: dataSelected.jeniskemasan
                }

                // $scope.item.waktuminum = {
                //     waktuminum: dataSelected.waktuminum
                // }
                debugger
                // if (dataSelected.kekuatan == undifined || dataSelected.kekuatan == '' || dataSelected.kekuatan == null) {
                //     $kekuatan = 0
                // } else {
                //     $kekuatan = dataSelected.kekuatan
                // }

                $scope.item.aturanPakai = {
                    name: dataSelected.aturanpakai,
                    id: dataSelected.aturanpakaifk

                }

                // $scope.item.aturanPakai = dataSelected.aturanpakai
                // $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($kekuatan)
                // jumlahxmakan
                // $scope.item.waktuminum = 

                // $x = dataSelected.waktuminum
                $scope.item.dosisobat = dataSelected.dosisobat
                $scope.item.jumlah = dataSelected.jumlah
                $scope.currentAturanPakai = []
                if (dataSelected.isobatpulang == 'true') {
                    $scope.model.isObatPulang = true
                } else {
                    $scope.model.isObatPulang = false
                }
                debugger
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                let sp = false
                if (dataSelected.ispagi != "0") {
                    sp = true
                    $scope.item.chkp = 1
                }
                let ss = false
                if (dataSelected.issiang != "0") {
                    ss = true
                    $scope.item.chks = 1
                }
                let sr = false
                if (dataSelected.issore != "0") {
                    sr = true
                    $scope.item.chksr = 1
                }
                let sm = false
                if (dataSelected.ismalam != "0") {
                    sm = true
                    $scope.item.chkm = 1
                }
                if (dataSelected.kronis == '1' || dataSelected.kronis == true) {
                    kronis = true
                } else {
                    kronis = false
                }
                $scope.model.kronis = kronis
                // let sp = dataSelected.ispagi
                // let ss = dataSelected.issiang
                // let sm = dataSelected.ismalam
                $scope.listDataSigna = [{
                    "id": 1,
                    "nama": "Aturan Pakai",
                    "detail": [{
                        "id": 1,
                        "nama": "Pagi",
                        'isChecked': sp
                    },
                    {
                        "id": 2,
                        "nama": "Siang",
                        'isChecked': ss
                    },
                    {
                        "id": 3,
                        "nama": "Sore",
                        'isChecked': sr
                    },
                    {
                        "id": 4,
                        "nama": "Malam",
                        'isChecked': sm
                    }
                    ]
                }];
                // let jml = 0
                // if (sp == true) {
                //     jml = jml+1
                // }
                // if (ss == true) {
                //     jml = jml+1
                // }
                // if (sm == true) {
                //     jml = jml+1
                // }
                // $scope.item.aturanPakai = jml + 'x1'
                // $scope.item.aturanPakai2 = dataSelected.aturanpakai2
                // $scope.item.sbsm = {id:dataSelected.sbsmid,name:dataSelected.sbsmname}
                $scope.item.route = {
                    id: dataSelected.routefk,
                    name: dataSelected.route
                }
                if (dataSelected.asalprodukfk != 0) {
                    $scope.item.asal = {
                        id: dataSelected.asalprodukfk,
                        asalproduk: dataSelected.asalproduk
                    }
                }
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk //{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi

                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = $scope.item.jumlah; //Math.ceil($scope.item.jumlah);
                tarifJasa = dataSelected.jasa
                // tarifJasa = 800;
                // if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan'){
                //     $scope.item.jumlahxmakan = dataSelected.jumlahxmakan
                //     $scope.item.dosis = dataSelected.dosis
                // }
                // $scope.item.dosis = dataSelected.dosis
                GETKONVERSI()
                // $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                // $scope.item.satuan = {ssid:dataSelected.satuanviewfk,satuanstandar:dataSelected.satuanview}


                // // $scope.item.jumlah = dataSelected.jumlah
                // $scope.item.hargaSatuan = dataSelected.hargasatuan
                // $scope.item.hargadiskon = dataSelected.hargadiscount
                // $scope.item.total = dataSelected.total
            }

            function Kosongkan() {
                // $scope.item.produk = ''
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = $scope.item.jumlah; // Math.ceil($scope.item.jumlah);
                $scope.item.dosis = 1
                $scope.item.jumlahxmakan = 1
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.hargaNetto = 0
                $scope.item.aturanPakai = undefined;
                $scope.dataSelected = undefined
                $scope.item.KeteranganPakai = undefined
                $scope.item.dosisobat = ''
                $scope.item.waktuminum = undefined
                $scope.listDataSigna = [{
                    "id": 1,
                    "nama": "Aturan Pakai",
                    "detail": [{
                        "id": 1,
                        "nama": "Pagi",
                        'isChecked': false
                    },
                    {
                        "id": 2,
                        "nama": "Siang",
                        'isChecked': false
                    },
                    {
                        "id": 3,
                        "nama": "Sore",
                        'isChecked': false
                    },
                    {
                        "id": 4,
                        "nama": "Malam",
                        'isChecked': false
                    }
                    ]
                }];
                $scope.dataSelected = undefined
                GETKONVERSI()
            }
            $scope.batal = function () {
                var chacePeriode = {
                    0: $scope.item.ruangan,
                    1: $scope.item.aturanPakai,
                    2: $scope.item.jenisKemasan,
                    3: '',
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: ''
                }
                cacheHelper.set('cacheanuaing', chacePeriode);
                Kosongkan()
            }

            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "30px",
            },
            {
                "field": "rke",
                "title": "R/ke",
                "width": "40px",
            },
            {
                "field": "jeniskemasan",
                "title": "Kemasan",
                "width": "70px",
            },
            {
                "field": "jmldosis",
                "title": "Jml/Dss/kkuatan",
                "width": "90px",
            },
            {
                "field": "namaproduk",
                "title": "Deskripsi",
                "width": "200px",
            },
            {
                "field": "aturanpakai",
                "title": "Aturan Pakai",
                "width": "100px",
            },
            {
                "field": "keterangan",
                "title": "Keterangan Pakai",
                "width": "120px",
            },
            {
                "field": "satuanstandar",
                "title": "Satuan",
                "width": "80px",
            },
            {
                "field": "jumlah",
                "title": "Qty ,",
                "width": "50px",
            },
            {
                "field": "jumlahobat",
                "title": "Qty o",
                "width": "50px",
            },
            {
                "field": "hargasatuan",
                "title": "Harga Satuan",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            },
            {
                "field": "jasa",
                "title": "Tuslah",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
            },
            {
                "field": "hargadiscount",
                "title": "Harga Discount",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            },
            {
                "field": "total",
                "title": "Total",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            }
            ];
            // $scope.columnGridR = [
            // {
            //     "field": "no",
            //     "title": "No",
            //     "width" : "30px",
            // },
            // {
            //     "field": "rke",
            //     "title": "R/ke",
            //     "width" : "40px",
            // },
            // {
            //     "field": "jeniskemasan",
            //     "title": "Kemasan",
            //     "width" : "70px",
            // },
            // {
            //     "field": "asalproduk",
            //     "title": "Asal Produk",
            //     "width" : "100px",
            // },
            // {
            //     "field": "namaproduk",
            //     "title": "Deskripsi",
            //     "width" : "200px",
            // },
            // {
            //     "field": "satuanstandar",
            //     "title": "Satuan",
            //     "width" : "80px",
            // },
            // {
            //     "field": "jumlah",
            //     "title": "Qty",
            //     "width" : "70px",
            // },
            // {
            //     "field": "hargasatuan",
            //     "title": "Harga Satuan",
            //     "width" : "100px",
            //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            // },
            // {
            //     "field": "hargadiscount",
            //     "title": "Harga Discount",
            //     "width" : "100px",
            //     "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            // },
            // {
            //     "field": "total",
            //     "title": "Total",
            //     "width" : "100px",
            //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            // }
            // ];
            // $scope.mainGridOptions = {
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.simpan = function () {
                // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                //     $scope.item.noRegistrasi, true).then(function(dat){
                //     if (dat.data.status == true) {
                //         alert('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                //         return;
                //     }
                // });
                // if ($scope.item.penulisResep == undefined) {
                //     alert("Pilih Penulis Resep terlebih dahulu!!")
                //     return
                // }
                // if (confirm('Hitung Embalase? ')) {
                //         // Save it!
                //         stt='true';
                //     } else {
                //         // Do nothing!
                //         stt='false'
                //     }
                var checkRP = 0;
                if ($scope.checkResepPulang == true) {
                    checkRP = 1;
                }

                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }

                debugger

                // var tglkeluar = Date($scope.item.tglkeluar);
                // var tglkeluar = tglkeluar.getTime();
                if ($scope.item.tglmasuk != undefined) {
                    if ($scope.item.objectdepartemenfk != '18') {
                        if ($scope.item.objectdepartemenfk != '24') {
                            if ($scope.item.objectdepartemenfk != '25') {
                                $scope.item.tglresep = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                                $scope.item.tglkeluars = Date.parse($scope.item.tglkeluar) / 1000;
                                $scope.item.tglmasuks = Date.parse($scope.item.tglmasuk) / 1000;
                                $scope.item.tglreseps = Date.parse($scope.item.tglresep) / 1000;
                                // $scope.item.tglresep = $scope.item.tglresep.Date();
                                // $scope.item.tglresep = $scope.item.tglresep.getTime();
                                if ($scope.item.tglreseps < $scope.item.tglmasuks) {
                                    alert("Resep Hanya Bisa Diinput di Ruangan " + $scope.item.namaruangan + " Antara Waktu Masuk " + $scope.item.tglmasuk + " Sampai Waktu Keluar " + $scope.item.tglkeluar)
                                    return
                                }
                                if ($scope.item.tglkeluar != null) {
                                    if ($scope.item.tglreseps > $scope.item.tglkeluars && $scope.item.tglmasuks != $scope.item.tglkeluars) {
                                        alert("Resep Hanya Bisa Diinput di Ruangan " + $scope.item.namaruangan + " Antara Waktu Masuk " + $scope.item.tglmasuk + " Sampai Waktu Keluar " + $scope.item.tglkeluar)
                                        return
                                    }
                                }
                            }
                        }
                    }

                    if ($scope.item.objectdepartemenfk === '24') {
                        $scope.item.tglresep = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                        $scope.item.tglkeluars = Date.parse($scope.item.tglregistrasi) / 1000;
                        $scope.item.tglmasuks = Date.parse($scope.item.tglmasuk) / 1000;
                        $scope.item.tglreseps = Date.parse($scope.item.tglresep) / 1000;
                        // $scope.item.tglresep = $scope.item.tglresep.Date();
                        // $scope.item.tglresep = $scope.item.tglresep.getTime();
                        if ($scope.item.tglreseps < $scope.item.tglmasuks) {
                            alert("Resep Hanya Bisa Diinput di Ruangan " + $scope.item.namaruangan + " Antara Waktu Masuk " + $scope.item.tglmasuk + " Sampai Waktu Keluar " + $scope.item.tglregistrasi)
                            return
                        }
                        if ($scope.item.tglmasuks != $scope.item.tglkeluars) {
                            if ($scope.item.tglreseps > $scope.item.tglkeluars) {
                                alert("Resep Hanya Bisa Diinput di Ruangan " + $scope.item.namaruangan + " Antara Waktu Masuk " + $scope.item.tglmasuk + " Sampai Waktu Keluar " + $scope.item.tglregistrasi)
                                return
                            }
                        }
                    }
                }

                // for (var i = data2.length - 1; i >= 0; i--) {
                //     if (data2[i].hargasatuan == 0) {
                //         alert("Terdapat obat dengan harga kosong, kemungkinan stock kosong!!")
                //         return
                //     }

                // }
                debugger
                var r = confirm("Yakin Simpan?");
                if (r == false) {
                    return;
                }
                $scope.tombolSimpanVis = false;
                $scope.IsSave = false;
                var strukresep = {
                    tglresep: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                    pasienfk: norec_apd, //
                    nocm: $scope.item.nocm,
                    namapasien: $scope.item.namaPasien,
                    penulisresepfk: $scope.item.penulisResep != undefined ? $scope.item.penulisResep.id : null, //req nenden
                    ruanganfk: $scope.item.ruangan.id,
                    noorder: noOrder,
                    status: strStatus,
                    norecResep: norecResep,
                    noresep: $scope.item.resep,
                    retur: '-',
                    isobatalkes: isPemakaianObatAlkes,
                    isreseppulang: checkRP != undefined ? checkRP : null
                }
                var objSave = {
                    strukresep: strukresep,
                    pelayananpasien: data2 //$scope.dataGrid._data
                }
                // medifirstService.post("logistik/cekstoksebelumsimpan",objSave).then(function(e) {
                //    if(e.data.message != "berhasil"){
                //        alert(e.data.message);
                //        $scope.tombolSimpanVis = true;
                //        return;
                //    }else{

                $scope.tombolSimpanVis = false;
                medifirstService.post('farmasi/save-pelayananobat', objSave).then(function (e) {
                    $scope.tombolSimpanVis = true;
                    $scope.item.resep = e.data.noresep.norec
                    if (dataOK.length > 0) {
                        var objSave = {
                            strukresep: strukresep,
                            norecresep: $scope.item.resep,
                            pelayananpasienobatkronis: dataOK,
                        }
                        medifirstService.post('farmasi/save-pelayanan-obat-kronis', objSave).then(function (e) {
                            medifirstService.get("sysadmin/logging/save-log-input-resep?norec_apd=" +
                                norec_apd +
                                "&penulisresepfk=" +
                                $scope.item.penulisResep.id +
                                "&ruanganfk=" +
                                $scope.item.ruangan.id +
                                "&tglresep=" +
                                moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss') +
                                "&norecresep=" +
                                e.data.noresep.norec
                            ).then(function (data) {

                                window.history.back();
                            })
                        });
                    } else {
                        medifirstService.get("sysadmin/logging/save-log-input-resep?norec_apd=" +
                            norec_apd +
                            "&penulisresepfk=" +
                            $scope.item.penulisResep.id +
                            "&ruanganfk=" +
                            $scope.item.ruangan.id +
                            "&tglresep=" +
                            moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss') +
                            "&norecresep=" +
                            e.data.noresep.norec
                        ).then(function (data) {

                            window.history.back();
                        })
                    }





                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + e.data.noresep.norec + '&view=' + 'true' + '&user=' + '', function (response) {
                        // aadc=response;
                    });
                    //##save Logging user


                }, function (error) {
                    $scope.tombolSimpanVis = true;
                })
                //     }
                // });
                var chacePeriode = {
                    0: $scope.item.ruangan,
                    1: $scope.item.aturanPakai,
                    2: $scope.item.jenisKemasan,
                    3: '',
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: ''
                }
                cacheHelper.set('cacheanuaing', chacePeriode);

                // $state.go("TransaksiPelayananApotik")

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
            $scope.BatalR = function () {
                $scope.showInputObat = true
                $scope.showRacikan = false
                $scope.item.jenisKemasan = ''

                racikan = ''
            }
            $scope.hapus = function () {
                // if ($scope.item.jumlah == 0) {
                //     alert("Jumlah harus di isi!")
                //     return;
                // }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     alert("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // var nomor =0
                // if ($scope.dataGrid == undefined) {
                //     nomor = 1
                // }else{
                //     nomor = data2.length+1
                // }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            data2.splice(i, 1);

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1
                            }
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            $scope.dataGridStok = new kendo.data.DataSource({
                                data: dataOK
                            });

                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            // }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }
                    for (var i = dataOK.length - 1; i >= 0; i--) {
                        if (dataOK[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            dataOK.splice(i, 1);

                            var subTotal = 0;
                            for (var i = dataOK.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(dataOK[i].total)
                                dataOK[i].no = i + 1
                            }
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            $scope.dataGridStok = new kendo.data.DataSource({
                                data: dataOK
                            });

                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            // }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                }
                Kosongkan()
            }
            $scope.columnGridStok = [{
                "field": "no",
                "title": "No",
                "width": "25px",
            },
            {
                "field": "namaproduk",
                "title": "Nama Produk",
                "width": "150px",
            },
            {
                "field": "jumlahcetak",
                "title": "Jumlah",
                "width": "80px",
            },
            {
                "field": "hargasatuan",
                "title": "Harga",
                "width": "50px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            },
            {
                "field": "total",
                "title": "Total",
                "width": "150px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            }



            ];

            $scope.simpanSkrining = function () {
                if ($scope.item.ruangan == undefined) {
                    alert("Ruangan tidak boleh kosong!")
                    return;
                }
                var listPrinsipBesar = ""
                var a = ""
                var b = ""
                for (var i = $scope.currentPrinsipBesar.length - 1; i >= 0; i--) {
                    var c = $scope.currentPrinsipBesar[i].id
                    b = "," + c
                    a = a + b
                }
                listPrinsipBesar = a.slice(1, a.length)
                var penulis = ""
                if ($scope.data.KetPenulis != undefined) {
                    var penulis = $scope.data.KetPenulis
                }
                var ketTanggal = ""
                if ($scope.data.KetTanggal != undefined) {
                    var ketTanggal = $scope.data.KetTanggal
                }
                var ketRM = ""
                if ($scope.data.KetRM != undefined) {
                    var ketRM = $scope.data.KetRM
                }
                var KetPasien = ""
                if ($scope.data.KetPasien != undefined) {
                    var KetPasien = $scope.data.KetPasien
                }
                var KetLahir = ""
                if ($scope.data.KetLahir != undefined) {
                    var KetLahir = $scope.data.KetLahir
                }
                var KetBerat = ""
                if ($scope.data.KetBerat != undefined) {
                    var KetBerat = $scope.data.KetBerat
                }
                var KetDokter = ""
                if ($scope.data.KetDokter != undefined) {
                    var KetDokter = $scope.data.KetDokter
                }
                var KetRuang = ""
                if ($scope.data.KetRuang != undefined) {
                    var KetRuang = $scope.data.KetRuang
                }
                var KetStatus = ""
                if ($scope.data.KetStatus != undefined) {
                    var KetStatus = $scope.data.KetStatus
                }
                var KetObat = ""
                if ($scope.data.KetObat != undefined) {
                    var KetObat = $scope.data.KetObat
                }
                var KetKekuatan = ""
                if ($scope.data.KetKekuatan != undefined) {
                    var KetKekuatan = $scope.data.KetKekuatan
                }
                var KetJumlah = ""
                if ($scope.data.KetJumlah != undefined) {
                    var KetJumlah = $scope.data.KetJumlah
                }
                var KetStabilitas = ""
                if ($scope.data.KetStabilitas != undefined) {
                    var KetStabilitas = $scope.data.KetStabilitas
                }
                var KetAturan = ""
                if ($scope.data.KetAturan != undefined) {
                    var KetAturan = $scope.data.KetAturan
                }
                var KetIndikasi = ""
                if ($scope.data.KetIndikasi != undefined) {
                    var KetIndikasi = $scope.data.KetIndikasi
                }
                var KetAlergi = ""
                if ($scope.data.KetAlergi != undefined) {
                    var KetAlergi = $scope.data.KetAlergi
                }
                var KetKonsumsi = ""
                if ($scope.data.KetKonsumsi != undefined) {
                    var KetKonsumsi = $scope.data.KetKonsumsi
                }
                var KetDuplikat = ""
                if ($scope.data.KetDuplikat != undefined) {
                    var KetDuplikat = $scope.data.KetDuplikat
                }
                var KetInteraksi = ""
                if ($scope.data.KetInteraksi != undefined) {
                    var KetInteraksi = $scope.data.KetInteraksi
                }
                var KetAntibiotik = ""
                if ($scope.data.KetAntibiotik != undefined) {
                    var KetAntibiotik = $scope.data.KetAntibiotik
                }
                var KetPoli = ""
                if ($scope.data.KetPoli != undefined) {
                    var KetPoli = $scope.data.KetPoli
                }
                var PenyekriningResep = ""
                if ($scope.data.PenyekriningResep != undefined) {
                    var PenyekriningResep = $scope.data.PenyekriningResep
                }
                var Peracik = ""
                if ($scope.data.Peracik != undefined) {
                    var Peracik = $scope.data.Peracik
                }
                var Pengecek = ""
                if ($scope.data.Pengecek != undefined) {
                    var Pengecek = $scope.data.Pengecek
                }
                var Penyerah = ""
                if ($scope.data.Penyerah != undefined) {
                    var Penyerah = $scope.data.Penyerah
                }
                var Penerima = ""
                if ($scope.data.Penerima != undefined) {
                    var Penerima = $scope.data.Penerima
                }

                var objSave = {
                    "norec": norecSkrining,
                    "norec_apd": norec_apd,
                    "objectruanganfk": $scope.item.ruangan.id,
                    "rpenulis": $scope.data.Penulis,
                    "rtanggalresep": $scope.data.Tanggal,
                    "rmr": $scope.data.DataRM,
                    "rpasien": $scope.data.Pasien,
                    "rtanggallahir": $scope.data.DataLahir,
                    "rberatbedan": $scope.data.Berat,
                    "rdokter": $scope.data.DataDokter,
                    "rruang": $scope.data.DataRuang,
                    "rstatusjamin": $scope.data.DataStatus,
                    "robat": $scope.data.Obat,
                    "rkekuatan": $scope.data.DataKekuatan,
                    "rjumlahobat": $scope.data.DataJumlah,
                    "rstabilitas": $scope.data.DataStabilitas,
                    "raturan": $scope.data.DataAturan,
                    "rindikasiobat": $scope.data.DataIndikasi,
                    "ralergi": $scope.data.DataAlergi,
                    "rkonsumsi": $scope.data.DataKonsumsi,
                    "rduplikat": $scope.data.DataDuplikat,
                    "rinteraksi": $scope.data.DataInteraksi,
                    "rantibiotik": $scope.data.DataAntibiotik,
                    "rpolifarmasi": $scope.data.DataPoli,
                    "namapenyekriningresep": PenyekriningResep,
                    "namaperacik": Peracik,
                    "namapengecek": Pengecek,
                    "namapenyrahobat": Penyerah,
                    "namapenerimaobat": Penerima,
                    "prinsipbesar": listPrinsipBesar,
                    "strukresepfk": norecResep != undefined ? norecResep : null,
                    // "noresepfk" : ,
                    "ketpenulis": penulis,
                    "kettanggal": ketTanggal,
                    "ketrm": ketRM,
                    "ketpasien": KetPasien,
                    "kettanggallahir": KetLahir,
                    "ketberat": KetBerat,
                    "ketdokter": KetDokter,
                    "ketruang": KetRuang,
                    "ketstatus": KetStatus,
                    "ketobat": KetObat,
                    "ketkekuatan": KetKekuatan,
                    "ketjumlah": KetJumlah,
                    "ketstabilitas": KetStabilitas,
                    "ketaturan": KetAturan,
                    "ketalergi": KetAlergi,
                    "ketkonsumsi": KetKonsumsi,
                    "ketduplikasi": KetDuplikat,
                    "ketinteraski": KetInteraksi,
                    "ketantibiotik": KetAntibiotik,
                    "ketpolifarmasi": KetPoli,
                    "ketindikasi": KetIndikasi,
                    "rcek": $scope.data.DataCek
                }

                medifirstService.post('farmasi/save-data-skrining-farmasi', objSave).then(function (e) {
                    window.history.back();
                })
            }

            $scope.BatalSkring = function () {
                $scope.data = {}
                $scope.data.Penulis = 2;
                $scope.data.Tanggal = 2;
                $scope.data.DataRM = 2;
                $scope.data.Pasien = 2;
                $scope.data.DataLahir = 2;
                $scope.data.Berat = 2;
                $scope.data.DataDokter = 2;
                $scope.data.DataRuang = 2;
                $scope.data.DataStatus = 2;
                $scope.data.Obat = 2;
                $scope.data.DataKekuatan = 2;
                $scope.data.DataJumlah = 2;
                $scope.data.DataStabilitas = 2;
                $scope.data.DataAturan = 2;
                $scope.data.DataIndikasi = 2;
                $scope.data.DataAlergi = 2;
                $scope.data.DataKonsumsi = 2;
                $scope.data.DataDuplikat = 2;
                $scope.data.DataInteraksi = 2;
                $scope.data.DataAntibiotik = 2;
                $scope.data.DataPoli = 2;
            }

            $scope.kembaliSKiring = function () {
                window.history.back();
            }
            $scope.showDiagnosa = function () {
                loadDiagnosa()

            }

            function loadDiagnosa(noreg) {
                medifirstService.get("sysadmin/general/get-diagnosa-pasien?noReg=" + $scope.item.noRegistrasi).then(function (data) {
                    $scope.popUpDiagnosa.center().open()
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
            //***********************************

        }
    ]);
});