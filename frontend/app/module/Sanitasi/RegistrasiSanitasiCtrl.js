define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RegistrasiSanitasiCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglTerima = new Date();
            $scope.item.tglFaktur = new Date();
            $scope.item.TglJatuhTempo = new Date();
            $scope.item.tglKK = new Date();
            $scope.item.tglAwal = new Date();
            $scope.item.tglUsulan = new Date();
            $scope.item.tahun = moment($scope.now).format('YYYY');
            $scope.isRouteLoading = false;
            var NorecCetak = '';
            $scope.kaskecilShow = false;
            var noOrder = '';
            var pegawaiUser = {}
            var norec_Realisasi = '';
            var norec_RealisasiKontrak = '';
            var norecRR = '';
            var keltrans = '';
            var verifikasifk = '';
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var NoOrderFk = undefined;
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data2R = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var nilai = 0
            var kelTrans = '';
            var qty = 0
            var hrgsatuan = 0
            var ppn = 0
            var hargadiskon = 0
            var ppnprs = 0
            var hargadiskonprs = 0
            var sppb = '';
            var ttlTotal = 0;
            var ttlDiskon = 0;
            var ttlPpn = 0;
            var grandTotal = 0;
            var norecTerima = ''
            var norecSPPB = ''
            var loadSPK = 'tidak'
            var loadSPPB = 'tidak'
            var loadSPPBDetail = 'tidak'
            var dataIN = '';
            var subTtlSetelahDiskon = 0
            $scope.disableSppb = false;
            // ComboLoad()
            LoadCache();

            function LoadCache() {
                // $scope.item.noTerima = 'RS/' + moment(new Date()).format('YYMM')+'____'
                // $scope.item.noBuktiKK = '____' + '/KK/' + moment(new Date()).format('MM/YY')
                var chacePeriode = cacheHelper.get('RegistrasiLinenCtrl');
                if (chacePeriode != undefined) {
                    norecTerima = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    norecSPPB = chacePeriode[2]
                    dataIN = chacePeriode[3]

                    init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('RegistrasiLinenCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
                $scope.item.DataJabatan1 = undefined;
                $scope.item.DataPegawai1 = undefined;
                $scope.item.DataJabatan2 = undefined;
                $scope.item.DataPegawai2 = undefined;
                $scope.item.DataJabatan3 = undefined;
                $scope.item.DataPegawai3 = undefined;
                window.history.back();
            }

            $scope.CetakAh = function () {

                var jabatan1 = ''
                if ($scope.item.DataJabatan1 != undefined) {
                    jabatan1 = $scope.item.DataJabatan1.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai1 != undefined) {
                    pegawai1 = $scope.item.DataPegawai1.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan2 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai2 = $scope.item.DataPegawai2.id;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatan3 != undefined) {
                    jabatan3 = $scope.item.DataJabatan3.namajabatan;
                }

                var pegawai3 = ''
                if ($scope.item.DataPegawai3 != undefined) {
                    pegawai3 = $scope.item.DataPegawai3.id;
                }


                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing! NorecCetak
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + NorecCetak + '&pegawaiPenerima=' + pegawai2 + '&pegawaiPenyerahan=' + pegawai1 + '&pegawaiMengetahui=' + pegawai3
                    + '&jabatanPenerima=' + jabatan2 + '&jabatanPenyerahan=' + jabatan1 + '&jabatanMengetahui=' + jabatan3 + '&view=' + stt + '&user=' + pegawaiUser.namalengkap, function (response) {
                        //aadc=response; 

                    });
                $scope.popUp.close();
                // window.history.back(); 
                $scope.saveShow = false;
            }


            $scope.getProduk = function () {
                medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                    $scope.listProduk = dat.data.produk;
                })

            }

            $scope.Generate = function (data) {

                if (data === true) {
                    var AsalPro = ''
                    if ($scope.item.asalproduk != undefined) {
                        AsalPro = $scope.item.asalproduk.id
                    }
                    medifirstService.get("logistik/get-nomor-terima?asalproduk=" + AsalPro, true).then(function (dat) {
                        var datas = dat.data
                        if (datas.noStruk != "") {
                            $scope.item.noTerima = datas.noStruk
                        } else {
                            $scope.item.noTerima = ""
                        }

                        if (datas.noBuktiKK != "") {
                            $scope.item.noBuktiKK = datas.noBuktiKK
                        } else {
                            $scope.item.noBuktiKK = ""
                        }
                    })
                } else {
                    $scope.item.noTerima = '';
                    $scope.item.noBuktiKK = '';
                }
            };

            $scope.Generate1 = function (data) {

                if (data === true) {
                    var AsalPro = ''
                    if ($scope.item.asalproduk != undefined) {
                        AsalPro = $scope.item.asalproduk.id
                    }
                    medifirstService.get("logistik/get-nomor-terima?asalproduk=" + AsalPro, true).then(function (dat) {
                        var datas = dat.data
                        if (datas.noStruk != "") {
                            $scope.item.noTerima = datas.noStruk
                        } else {
                            $scope.item.noTerima = ""
                        }

                        if (datas.noBuktiKK != "") {
                            $scope.item.noBuktiKK = datas.noBuktiKK
                        } else {
                            $scope.item.noBuktiKK = ""
                        }
                    })
                } else {
                    $scope.item.noTerima = '';
                    $scope.item.noBuktiKK = '';
                }
            };

            function init() {
                medifirstService.get('laundry/get-combo-laundry').then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listKelompokProduk = dataCombo.kelompokproduk;
                    $scope.item.kelompokproduk = { id: 44, kelompokproduk: 'Barang Sanitasi' }
                    $scope.listmataAnggaran = dataCombo.mataanggaran;
                    $scope.listKoordinator = dataCombo.jenisusulan;
                    $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' };
                    $scope.listRuangan = dataCombo.ruanganall;
                    $scope.listRuanganKK = dataCombo.ruanganall;

                    medifirstService.get("sysadmin/general/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                        $scope.listProduk = dat.data.produk;
                    });

                    // $scope.item.ruanganPenerima = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.item.ruanganKK = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.listPegawai = [{ id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap }]
                    $scope.item.pegawaiPenerima = { id: $scope.listPegawai[0].id, namalengkap: $scope.listPegawai[0].namalengkap }
                    if (noOrder != '') {
                        $scope.isRouteLoading = true;
                        if (noOrder == 'EditTerima') {
                            $scope.disableSppb = true;
                            medifirstService.get("laundry/get-detail-registrasi-linen?norec=" + norecTerima, true).then(function (data_ih) {
                                $scope.isRouteLoading = false;
                                NoOrderFk = data_ih.data.detailterima.noorderfk
                                $scope.item.noTerima = data_ih.data.detailterima.nostruk
                                // $scope.item.noUsulan = data_ih.data.detailterima.nousulan
                                // $scope.item.noOrder = data_ih.data.detailterima.nosppb
                                // $scope.item.noKontrak = data_ih.data.detailterima.nokontrak
                                $scope.item.tglTerima = moment(data_ih.data.detailterima.tglstruk).format('DD-MM-YYYY HH:mm');//data_ih.data.detailterima.tglstruk
                                // $scope.item.tglUsulan = data_ih.data.detailterima.tglrealisasi
                                // $scope.item.tglAwal = data_ih.data.detailterima.tgldokumen
                                // $scope.item.ketTerima = data_ih.data.detailterima.keteranganambil
                                // $scope.item.namaPengadaan = data_ih.data.detailterima.namapengadaan
                                $scope.item.keterangan1 = data_ih.data.detailterima.keteranganlainnya
                                // $scope.item.tahun = moment(data_ih.data.detailterima.tglstruk).format('YYYY');
                                $scope.item.kelompokproduk = { id: data_ih.data.pelayananPasien[0].kpid, kelompokproduk: data_ih.data.pelayananPasien[0].kelompokproduk }
                                // $scope.item.asalproduk = { id: data_ih.data.pelayananPasien[0].asalprodukfk, asalProduk: data_ih.data.pelayananPasien[0].asalproduk }
                                $scope.item.ruanganPenerima = { id: data_ih.data.detailterima.id, namaruangan: data_ih.data.detailterima.namaruangan }
                                $scope.item.pegawaiPenerima = { id: data_ih.data.detailterima.pgid, namalengkap: data_ih.data.detailterima.namalengkap }
                                // $scope.item.pegawaiPembuat = { id: data_ih.data.detailterima.objectpegawaipenanggungjawabfk, namalengkap: data_ih.data.detailterima.penanggungjawab }
                                // $scope.item.tglFaktur = moment(data_ih.data.detailterima.tglfaktur).format('DD-MM-YYYY HH:mm');//data_ih.data.detailterima.tglfaktur
                                // $scope.item.noFaktur = data_ih.data.detailterima.nofaktur
                                // $scope.item.namaRekanan = { id: data_ih.data.detailterima.objectrekananfk, namarekanan: data_ih.data.detailterima.namarekanan }
                                // norec_Realisasi = data_ih.data.detailterima.norecrealisasi;
                                // $scope.item.mataAnggaran = { norec: data_ih.data.detailterima.mataanggranid, mataanggaran: data_ih.data.detailterima.namamataanggaran }
                                // $scope.item.TglJatuhTempo = moment(data_ih.data.detailterima.tgljatuhtempo).format('DD-MM-YYYY HH:mm');
                                kelTrans = 6
                                data2 = data_ih.data.pelayananPasien
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });
                                // ttlTotal = 0;
                                // ttlDiskon = 0;
                                // ttlPpn = 0;
                                // grandTotal = 0;

                                // for (var i = data2.length - 1; i >= 0; i--) {
                                //     ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                //     ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                //     ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                                // }
                                // $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                // $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                // $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                // grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                // $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                            $scope.columnGrid = [
                                {
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Nama Produk",
                                    "width": "120px",
                                },
                                {
                                    "field": "satuanstandar",
                                    "title": "Satuan",
                                    "width": "50px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "50px",
                                },
                                {
                                    "field": "hargasatuan",
                                    "title": "Harga Satuan",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                                },
                                {
                                    "field": "ppn",
                                    "title": "Ppn",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                                },
                                {
                                    "field": "hargadiscount",
                                    "title": "Harga Discount",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                                },
                                {
                                    "field": "total",
                                    "title": "SubTotal",
                                    "width": "100px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                                },
                                {
                                    "field": "nobatch",
                                    "title": "No Batch",
                                    "width": "50px",
                                },
                                {
                                    "field": "tglkadaluarsa",
                                    "title": "Tgl Kadaluarsa",
                                    "width": "100px",
                                    "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                                }
                            ];

                        }

                    } else {

                    }
                });

            }
            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "120px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "50px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "50px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                },

            ];
            $scope.getChangeAP = function () {
                if ($scope.item.asalproduk.asalProduk == "Kas Kecil") {
                    $scope.kaskecilShow = true
                } else {
                    $scope.kaskecilShow = false
                }

            }
            $scope.getSatuan = function () {
                GETKONVERSI(0)
            }

            function GETKONVERSI(jml) {
                if ($scope.item.produk == undefined) {
                    return
                }
                if ($scope.item.produk == "") {
                    return
                }
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                $scope.item.jumlah = 0;
                // $scope.item.hargaSatuan = 0;
                // $scope.item.ppn = 0;
                $scope.item.ppnpersen = 0;
                $scope.item.hargaDiskon = 0;
                $scope.item.hargaDiskonPersen = 0;
                $scope.item.subTotaltxt = 0;

                // $scope.item.keterangan = '-';
                $scope.item.keterangan = $scope.item.produk.spesifikasi;
                $scope.item.nobatch = '-';
                $scope.item.tglkadaluarsa = new Date();
                // if ($scope.item.ruangan == undefined) {
                //     //toastr.error("Pilih Ruangan terlebih dahulu!!")
                //     return;
                // }
                // medifirstService.get("logistik/get-data-harga?" +
                //     "produkfk=" + $scope.item.produk.id +
                //     "&ruanganfk=50", true).then(function (dat) {
                //         dataProdukDetail = dat.data.detail;
                //         $scope.item.hargaSatuan = 0
                //         $scope.item.hargadiskon = 0
                //         $scope.item.hargaNetto = 0
                //         $scope.item.total = 0
                //         $scope.item.jumlah = 0
                //         $scope.item.hargaSatuan = dat.data.detail[0].harga
                //     });
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
                $scope.item.jumlah = 0
                // medifirstService.get("logistik/get-data-harga?" +
                //     "produkfk=" + $scope.item.produk.id +
                //     "&ruanganfk=50", true).then(function (dat) {
                //         dataProdukDetail = dat.data.detail;
                //         $scope.item.hargaSatuan = 0
                //         $scope.item.hargadiskon = 0
                //         $scope.item.hargaNetto = 0
                //         $scope.item.total = 0
                //         $scope.item.jumlah = 0
                //         $scope.item.hargaSatuan = dat.data.detail[0].hargapenerimaan
                //     });
            }

            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)

                    }
                }
            });



            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {

                // if ($scope.item.subTotaltxt == 0) {
                //     toastr.error("SubTotal harus di isi!")
                //     return;
                // }
                if ($scope.item.jumlah == 0) {
                    toastr.error("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.produk == undefined) {
                    toastr.error("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    toastr.error("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asalproduk == undefined) {
                //     toastr.error("Pilih Sumber Dana Dahulu!!")
                //     return;
                // }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};

                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            // data.hargasatuan = String($scope.item.hargaSatuan)
                            data.ruanganfk = $scope.item.ruanganPenerima.id
                            // data.asalprodukfk = $scope.item.asalproduk.id
                            // data.asalproduk = $scope.item.asalproduk.asalProduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jumlah = $scope.item.jumlah
                            // data.hargadiscount = String($scope.item.hargaDiskon)
                            // data.persendiscount = String($scope.item.hargaDiskonPersen)
                            // data.ppn = String($scope.item.ppn)
                            // data.persenppn = String($scope.item.ppnpersen)
                            // data.total = $scope.item.subTotaltxt
                            data.keterangan = $scope.item.keterangan
                            // data.nobatch = $scope.item.nobatch
                            // data.tglkadaluarsa = $scope.item.tglkadaluarsa

                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2,
                                group: $scope.group,
                                pageSize: 100,
                                total: data2.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                    }
                                }
                            });
                        }
                    }
                } else {
                    data = {
                        no: nomor,
                        // hargasatuan: String($scope.item.hargaSatuan),
                        ruanganfk: $scope.item.ruanganPenerima.id,
                        // asalprodukfk: $scope.item.asalproduk.id,
                        // asalproduk: $scope.item.asalproduk.asalProduk,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jumlah: $scope.item.jumlah,
                        // hargadiscount: String($scope.item.hargaDiskon),
                        // persendiscount: String($scope.item.hargaDiskonPersen),
                        // ppn: String($scope.item.ppn),
                        // persenppn: String($scope.item.ppnpersen),
                        // total: $scope.item.subTotaltxt,
                        keterangan: $scope.item.keterangan,
                        // nobatch: $scope.item.nobatch,
                        // tglkadaluarsa: $scope.item.tglkadaluarsa
                    }
                    data2.push(data)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {
                            }
                        }
                    });
                }
                Kosongkan()
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                $scope.item.no = dataSelected.no

                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                $scope.listSatuan = [{ ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }]//dataProduk.konversisatuan

                $scope.item.jumlah = dataSelected.jumlah

                $scope.item.keterangan = dataSelected.keterangan

                if (dataSelected.nilaikonversi == null) {
                    $scope.item.nilaiKonversi = 1;
                } else {
                    $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                }
                $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }

            }
            function Kosongkan() {
                $scope.item.produk = ''
                // $scope.item.asal =''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.hargaSatuan = 0
                $scope.item.jumlah = 0
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.ppn = 0
                $scope.item.hargaDiskon = 0
                $scope.item.subTotaltxt = 0
            }
            $scope.batal = function () {
                Kosongkan()
                // $scope.popUp.center().open();
            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali = function () {
                window.history.back();
                //$scope.popUp.center().open();
            }

            $scope.SavePenerimaan = function () {
                $scope.saveShow = false;
               
                var kelTrans = ""
                if (kelTrans == '') {
                    kelTrans = 6;
                }
             
                var norecOrder = '';
                var jenisusulan = null;
                var jenisusulanfk = null;
                    
                var ketTerima = '';
                if ($scope.item.ketTerima != undefined) {
                    ketTerima = $scope.item.ketTerima
                }
        
                var noOrder = '-';
                if ($scope.item.noOrder != undefined) {
                    noOrder = $scope.item.noOrder
                }

                var struk = {
                    nostruk: norecTerima,
                    noorder: noOrder,
                    // rekananfk: $scope.item.namaRekanan.id,
                    // namarekanan: $scope.item.namaRekanan.namarekanan,
                    ruanganfk: $scope.item.ruanganPenerima.id,
                    namaruangan: $scope.item.ruanganPenerima.namaruangan,
                    // nokontrak: nokontrak,
                    // nofaktur: $scope.item.noFaktur,
                    // tglfaktur: $scope.item.tglFaktur, //moment($scope.item.tglFaktur).format('YYYY-MM-DD HH:mm'),
                    tglstruk: $scope.item.tglTerima, //moment($scope.item.tglTerima).format('YYYY-MM-DD HH:mm'),
                    // tglorder: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm'),
                    // tglrealisasi: $scope.item.tglTerima,//moment($scope.item.tglTerima).format('YYYY-MM-DD HH:mm'),
                    // tglkontrak: moment($scope.item.tglUsulan).format('YYYY-MM-DD HH:mm'),
                    // objectpegawaipenanggungjawabfk: pegawaiPembuat,
                    pegawaimenerimafk: $scope.item.pegawaiPenerima.id,
                    namapegawaipenerima: $scope.item.pegawaiPenerima.namalengkap,
                    qtyproduk: data2.length,
                    // totalharusdibayar: grandTotal,
                    // totalppn: ttlPpn,
                    // totaldiscount: ttlDiskon,
                    // totalhargasatuan: ttlTotal,
                    // asalproduk: parseFloat($scope.item.asalproduk.id),
                    // ruanganfkKK: rkk,
                    // tglKK: tglkk,
                    // pegawaifkKK: pegkk,
                    // norecsppb: norecSPPB,
                    kelompoktranskasi: kelTrans,
                    // norecrealisasi: norec_Realisasi,
                    // nousulan: usulan,
                    // norec:norec,
                    // objectmataanggaranfk: mataanggaran,
                    noterima: $scope.item.noTerima,
                    // noBuktiKK: $scope.item.noBuktiKK,
                    ketterima: ketTerima,
                    // jenisusulan: jenisusulan,
                    // jenisusulanfk: jenisusulanfk,
                    // namapengadaan: namapengadaan,
                    norecOrder: norecOrder,
                    // tgljatuhtempo: $scope.item.TglJatuhTempo,//moment($scope.item.TglJatuhTempo).format('YYYY-MM-DD HH:mm'),
                }
                var objSave = {
                    struk: struk,
                    details: data2
                }

                medifirstService.post('laundry/save-registrasi-linen', objSave).then(function (e) {
                    NorecCetak = e.data.data.norec
                    var forSave = {
                        struk: struk,
                        norec: NorecCetak,
                        details: data2
                    }
                    // $scope.popUp.center().open();
                })
            }

            $scope.simpan = function () {

                if ($scope.item.ruanganPenerima == undefined) {
                    toastr.error("Pilih Ruangan Penerima!!")
                    return
                }
                if ($scope.item.pegawaiPenerima == undefined) {
                    toastr.error("Pilih Pegawai Penerima!!")
                    return
                }

                if (data2.length == 0) {
                    toastr.error("Pilih Produk terlebih dahulu!!")
                    return
                }

                $scope.SavePenerimaan();

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

            $scope.hapus = function () {
                if ($scope.item.jumlah == 0) {
                    toastr.error("Jumlah harus di isi!")
                    return;
                }
               
                if ($scope.item.produk == undefined) {
                    toastr.error("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    toastr.error("Pilih Satuan terlebih dahulu!!")
                    return;
                }
             
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {

                            data2.splice(i, 1);
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                        }

                    }

                }
                Kosongkan()
            }

            $scope.loadComboProduk = function () {
                medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                    $scope.listProduk = dat.data.produk;
                });
            }

            $scope.KlikFakturOtomatis = function (data) {
                if (data === true) {
                    /* Format No Faktur PB/BLN-THN/APT/NO URUT (APT = BLU, BG = Hibah,  KK = Kas  Kecil) */
                    var asalproduk = '';
                    if ($scope.item.asalproduk != undefined) {
                        asalproduk = $scope.item.asalproduk.asalProduk
                    }
                    var nows = moment(new Date()).format('MM-YY')
                    if (asalproduk.indexOf('Badan Layanan') > -1 || asalproduk == '')
                        $scope.item.noFaktur = 'PB/' + nows + '/APT/____'
                    else if (asalproduk.indexOf('Hibah') > -1)
                        $scope.item.noFaktur = 'PB/' + nows + '/BG/____'
                    else if (asalproduk.indexOf('Kas Kecil') > -1)
                        $scope.item.noFaktur = 'PB/' + nows + '/KK/____'

                } else {
                    delete $scope.item.noFaktur
                }
            };
            //***********************************
        }
    ]);
});
