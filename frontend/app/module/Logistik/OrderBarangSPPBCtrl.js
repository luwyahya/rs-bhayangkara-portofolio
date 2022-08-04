define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OrderBarangSPPBCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglAwal = new Date();
            var pegawaiUser = {}
            var norec_Realisasi = '';
            var noOrder = '';
            var norecResep = '';
            var norecSppb
            var dataProdukDetail = [];
            var data2 = [];
            var hrg1 = 0
            var hrgsdk = 0
            var hrgPpn = 0
            var TotTotal = 0
            var norecrr = '';
            var norecrealisasi = '';
            var racikan ='';
            $scope.isRouteLoading = false;
            LoadCache();
            // Load();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('OrderBarangSPPBCtrl');
                if (chacePeriode != undefined) {
                    norecResep = chacePeriode[0]
                    noOrder = chacePeriode[1]

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
                    cacheHelper.set('OrderBarangSPPBCtrl', chacePeriode);
                } else {
                    init()
                }
            }
            function Load() {
                if ($state.params != undefined) {
                    norecResep = $state.params.norec;
                    noOrder = $state.params.noOrder;
                    init()
                } else {
                    init()
                }
            }

            function init() {

                $scope.isRouteLoading = true;

                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listProduk = data;
                })
                medifirstService.getPart("logistik/get-combo-rekanan-logistik", true, true, 20).then(function (data) {
                    $scope.listRekanan = data;
                })
                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.listPegawaiPembuat = data;
                })
                medifirstService.get("logistik/get-daftar-combo-anggaran", true).then(function(dat){
                    var data = dat.data;                    
                    $scope.listHeadSatu = data.headsatu;
                    $scope.listHeadDua = data.headdua;
                    $scope.listHeadTiga = data.headtiga;
                    $scope.listHeadEmpat = data.headempat;
                    $scope.listmataAnggaran = data.mataanggaran;
                    $scope.listPengendali = data.pengendali;
                    $scope.listAsalBarang = data.asalproduk;                    
                });
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listKoordinator = dataCombo.jenisusulan;
                    $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' };
                    $scope.listAsalProduk = dataCombo.asalproduk;
                    $scope.isRouteLoading = false;
                    $scope.item.tglUsulan = $scope.now;

                    if (noOrder != '') {
                        $scope.isRouteLoading = true;
                        if (noOrder == 'BuatSPPB') {
                            $scope.columnGrid = [
                                {
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Deskripsi",
                                    "width": "200px",
                                },
                                {
                                    "field": "satuanstandar",
                                    "title": "Satuan",
                                    "width": "80px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "70px",
                                },
                                {
                                    "field": "qtyprodukkonfirmasi",
                                    "title": "Qty Konfirmasi",
                                    "width": "70px",
                                },
                                {
                                    "field": "hargasatuan",
                                    "title": "Harga Satuan",
                                    "width": "100px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                                },
                                {
                                    "field": "hargadiscount",
                                    "title": "Disc%",
                                    "width": "50px"
                                },
                                {
                                    "field": "ppn",
                                    "title": "PPN%",
                                    "width": "50px"
                                },
                                {
                                    "field": "total",
                                    "title": "SubTotal",
                                    "width": "100px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                                }
                            ];
                            medifirstService.get("logistik/get-detail-sppb?norecOrder=" + norecResep, true).then(function (data_ih) {
                                $scope.isRouteLoading = false;
                                norecSppb = ''
                                $scope.item.noOrder = data_ih.data.detail.noorder
                                $scope.item.tglAwal = data_ih.data.detail.tglorder
                                $scope.item.keterangan = data_ih.data.detail.keterangan
                                $scope.item.pegawaiPembuat = { id: data_ih.data.detail.petugasid, namalengkap: data_ih.data.detail.petugas }
                                $scope.item.koordinator = { id: data_ih.data.detail.jenisusulanfk, jenisusulan: data_ih.data.detail.koordinator } //{id:1,jenisusulan:'Medis'} 
                                $scope.item.tglUsulan = data_ih.data.detail.tglusulan
                                $scope.item.noUsulan = data_ih.data.detail.nousulan
                                $scope.item.namaPengadaan = data_ih.data.detail.namapengadaan
                                $scope.item.noKontrak = data_ih.data.detail.nokontrak
                                $scope.item.tahun = data_ih.data.detail.tahunusulan                              
                                norecrr = data_ih.data.detail.norecrrsppb
                                norecrealisasi = data_ih.data.detail.norecrealisasi;
                                $scope.item.telpSupl = data_ih.data.detail.telp
                                $scope.item.suplier = { id: data_ih.data.detail.rekanansalesfk, namarekanan: data_ih.data.detail.namarekanansales }
                                $scope.item.alamatSupl = data_ih.data.detail.alamatrekanansales
                                $scope.item.telpSupl = 'Telp. ' + data_ih.data.detail.tlprekanansales + ' Fax. ' + data_ih.data.detail.faxrekanansales                                
                                $scope.item.asalProduk = { id: data_ih.data.details[0].asalprodukfk, asalproduk: data_ih.data.details[0].asalproduk }                                

                                data2 = data_ih.data.details
                                var subnyaTotal = 0;
                                var subTotal = 0;
                                var ppn = 0;
                                var discount = 0;
                                var totTpnn = 0;
                                var hargappn = 0;
                                var total = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    total = (parseFloat(data2[i].hargasatuan) * (data2[i].jumlah))
                                    totTpnn = total * (parseFloat(data2[i].ppn) / 100)


                                    // subTotal=subTotal+ parseFloat(data2[i].total)
                                    if (data2[i].hargadiscount == null) {
                                        discount = 0;
                                        data2[i].hargadiscount = discount;
                                    }
                                    if (data2[i].ppn == null) {
                                        ppn = 10;
                                        data2[i].ppn = ppn;
                                    }
                                    if (data2[i].total == null) {
                                        hargappn = totTpnn * 10 / 100
                                        subTotal = totTpnn + hargappn - discount;
                                        data2[i].total = subTotal
                                    } else {
                                        subTotal = total + totTpnn - discount;
                                        data2[i].total = subTotal
                                    }

                                    subnyaTotal = subnyaTotal + parseFloat(data2[i].total);
                                }
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });

                                $scope.item.totalSubTotal = parseFloat(subnyaTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.terbilang = terbilang(parseFloat(subnyaTotal))
                                TotTotal = parseFloat(subnyaTotal)

                            });
                        }
                    } else if (noOrder == 'EditOrder') {
                        $scope.columnGrid = [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "30px",
                            },
                            {
                                "field": "namaproduk",
                                "title": "Deskripsi",
                                "width": "200px",
                            },
                            {
                                "field": "satuanstandar",
                                "title": "Satuan",
                                "width": "80px",
                            },
                            {
                                "field": "jumlah",
                                "title": "Qty",
                                "width": "70px",
                            },
                            {
                                "field": "qtyprodukkonfirmasi",
                                "title": "Qty Konfirmasi",
                                "width": "70px",
                            },
                            {
                                "field": "hargasatuan",
                                "title": "Harga Satuan",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                            },
                            {
                                "field": "hargadiscount",
                                "title": "Disc%",
                                "width": "50px"
                            },
                            {
                                "field": "ppn",
                                "title": "PPN%",
                                "width": "50px"
                            },
                            {
                                "field": "total",
                                "title": "SubTotal",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                            }
                        ];
                        medifirstService.get("logistik/get-detail-sppb?norecOrder=" + norecResep, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            norecSppb = norecResep
                            $scope.item.noOrder = data_ih.data.detail.noorder
                            $scope.item.tglAwal = data_ih.data.detail.tglorder
                            $scope.item.keterangan = data_ih.data.detail.keterangan
                            $scope.item.pegawaiPembuat = { id: data_ih.data.detail.petugasid, namalengkap: data_ih.data.detail.petugas }
                            $scope.item.koordinator = { id: data_ih.data.detail.jenisusulanfk, jenisusulan: data_ih.data.detail.koordinator } //{id:1,jenisusulan:'Medis'} 
                            $scope.item.tglUsulan = data_ih.data.detail.tglusulan
                            $scope.item.noUsulan = data_ih.data.detail.nousulan
                            $scope.item.namaPengadaan = data_ih.data.detail.namapengadaan
                            $scope.item.noKontrak = data_ih.data.detail.nokontrak
                            $scope.item.tahun = data_ih.data.detail.tahunusulan                              
                            norecrr = data_ih.data.detail.norecrrsppb
                            norecrealisasi = data_ih.data.detail.norecrealisasi;
                            $scope.item.telpSupl = data_ih.data.detail.telp
                            $scope.item.suplier = { id: data_ih.data.detail.rekanansalesfk, namarekanan: data_ih.data.detail.namarekanansales }
                            $scope.item.alamatSupl = data_ih.data.detail.alamatrekanansales
                            $scope.item.telpSupl = 'Telp. ' + data_ih.data.detail.tlprekanansales + ' Fax. ' + data_ih.data.detail.faxrekanansales                                
                            $scope.item.asalProduk = { id: data_ih.data.details[0].asalprodukfk, asalproduk: data_ih.data.details[0].asalproduk }                                

                            data2 = data_ih.data.details
                            var subnyaTotal = 0;
                            var subTotal = 0;
                            var ppn = 0;
                            var discount = 0;
                            var totTpnn = 0;
                            var hargappn = 0;
                            var total = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                total = (parseFloat(data2[i].hargasatuan) * (data2[i].jumlah))
                                totTpnn = total * (parseFloat(data2[i].ppn) / 100)


                                // subTotal=subTotal+ parseFloat(data2[i].total)
                                if (data2[i].hargadiscount == null) {
                                    discount = 0;
                                    data2[i].hargadiscount = discount;
                                }
                                if (data2[i].ppn == null) {
                                    ppn = 10;
                                    data2[i].ppn = ppn;
                                }
                                if (data2[i].total == null) {
                                    hargappn = totTpnn * 10 / 100
                                    subTotal = totTpnn + hargappn - discount;
                                    data2[i].total = subTotal
                                } else {
                                    subTotal = total + totTpnn - discount;
                                    data2[i].total = subTotal
                                }

                                subnyaTotal = subnyaTotal + parseFloat(data2[i].total);
                            }
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });

                            $scope.item.totalSubTotal = parseFloat(subnyaTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.terbilang = terbilang(parseFloat(subnyaTotal))
                            TotTotal = parseFloat(subnyaTotal)

                        });
                    } else {
                        $scope.columnGrid = [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "30px",
                            },
                            {
                                "field": "namaproduk",
                                "title": "Deskripsi",
                                "width": "200px",
                            },
                            {
                                "field": "satuanstandar",
                                "title": "Satuan",
                                "width": "80px",
                            },
                            {
                                "field": "jumlah",
                                "title": "Qty",
                                "width": "70px",
                            },
                            {
                                "field": "hargasatuan",
                                "title": "Harga Satuan",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                            },
                            {
                                "field": "hargadiscount",
                                "title": "Disc%",
                                "width": "50px"
                            },
                            {
                                "field": "ppn",
                                "title": "PPN%",
                                "width": "50px"
                            },
                            {
                                "field": "total",
                                "title": "SubTotal",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                            }
                        ];
                    }
                });

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
                $scope.item.nilaiKonversi = 1
                $scope.item.jumlah = 0
                $scope.item.hargaSatuan = 0
                $scope.item.disc = 0
                $scope.item.ppn = 0
                $scope.item.total = 0
                medifirstService.get("logistik/get-data-harga?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=50", true).then(function (dat) {
                        dataProdukDetail = dat.data.detail[0];
                    });
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
                medifirstService.get("logistik/get-data-harga?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=50", true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        $scope.item.jumlah = 0
                        $scope.item.hargaSatuan = dataProdukDetail[0].hargapenerimaan
                    });
            }
            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0//hrgsdk * parseFloat(newValue)
                        $scope.item.total = 0// parseFloat(newValue) * 
                        // (hrg1-hrgsdk)
                    }
                }
            });
            // $scope.$watch('item.suplier', function(newValue, oldValue) {
            //     if (newValue != oldValue  ) {
            //        $scope.item.alamatSupl = $scope.item.suplier.alamatlengkap
            //        $scope.item.telpSupl = 'Telp. ' + $scope.item.suplier.telepon + ' Fax. ' + $scope.item.suplier.faksimile
            //     }
            // });
            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    hrg1 = parseFloat($scope.item.hargaSatuan)
                    hrgsdk = (hrg1 * parseFloat($scope.item.disc)) / 100
                    hrgPpn = ((hrg1 - hrgsdk) * parseFloat($scope.item.ppn)) / 100
                    $scope.item.subTotal = parseFloat($scope.item.jumlah) * ((hrg1 - hrgsdk) + hrgPpn)
                }
            });
            $scope.$watch('item.hargaSatuan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    hrg1 = parseFloat($scope.item.hargaSatuan)
                    hrgsdk = (hrg1 * parseFloat($scope.item.disc)) / 100
                    hrgPpn = ((hrg1 - hrgsdk) * parseFloat($scope.item.ppn)) / 100
                    $scope.item.subTotal = parseFloat($scope.item.jumlah) * ((hrg1 - hrgsdk) + hrgPpn)
                }
            });
            $scope.$watch('item.disc', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    hrg1 = parseFloat($scope.item.hargaSatuan)
                    hrgsdk = (hrg1 * parseFloat($scope.item.disc)) / 100
                    hrgPpn = ((hrg1 - hrgsdk) * parseFloat($scope.item.ppn)) / 100
                    $scope.item.subTotal = parseFloat($scope.item.jumlah) * ((hrg1 - hrgsdk) + hrgPpn)
                }
            });
            $scope.$watch('item.ppn', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    hrg1 = parseFloat($scope.item.hargaSatuan)
                    hrgsdk = (hrg1 * parseFloat($scope.item.disc)) / 100
                    hrgPpn = ((hrg1 - hrgsdk) * parseFloat($scope.item.ppn)) / 100
                    $scope.item.subTotal = parseFloat($scope.item.jumlah) * ((hrg1 - hrgsdk) + hrgPpn)
                }
            });
            $scope.$watch('item.asalProduk', function (newValue, oldValue) {
                // $scope.isRouteLoading=true;
                // manageLogistikPhp.getDataTableTransaksi("sppb/permintaan-pengiriman-barang/get-data-combo?produk=1", true).then(function(dat){
                //     $scope.listProduk = dat.data.produk;
                //     $scope.isRouteLoading=false;
                // });
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                // if ($scope.item.jenisKemasan == undefined) {
                //     alert("Pilih Jenis Kemasan terlebih dahulu!!")
                //     return;
                // }
                // if (noTerima == '') {
                //     $scope.item.jumlah = 0
                //     alert("Jumlah blm di isi!!")
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
                            data.hargajual = null
                            data.jenisobatfk = null
                            data.stock = null
                            data.harganetto = null
                            data.nostrukterimafk = null
                            data.ruanganfk = null
                            data.asalprodukfk = null
                            data.asalproduk = null
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = null
                            data.jumlah = $scope.item.jumlah
                            data.qtyprodukkonfirmasi = $scope.item.jumlah
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.hargadiscount = String($scope.item.disc)
                            data.ppn = String($scope.item.ppn)
                            data.total = $scope.item.subTotal
                            data.norec_op = data2[i].norec_op

                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.terbilang = terbilang(parseFloat(subTotal))
                            TotTotal = parseFloat(subTotal)
                        }
                        // break;
                    }

                } else {
                    data = {
                        no: nomor,
                        hargajual: null,
                        jenisobatfk: null,
                        stock: null,
                        harganetto: null,
                        nostrukterimafk: null,
                        ruanganfk: null,
                        asalprodukfk: null,
                        asalproduk: null,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jmlstok: null,
                        jumlah: $scope.item.jumlah,
                        qtyprodukkonfirmasi: $scope.item.jumlah,
                        hargasatuan: String($scope.item.hargaSatuan),
                        hargadiscount: String($scope.item.disc),
                        ppn: String($scope.item.ppn),
                        total: $scope.item.subTotal,
                        norec_op: null
                    }
                    data2.push(data)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.terbilang = terbilang(parseFloat(subTotal))

                    TotTotal = parseFloat(subTotal)
                }
                Kosongkan()
                racikan = ''
            }

            $scope.getIsiAlamat = function () {
                medifirstService.get("logistik/get-detail-rekanan?rekananid=" + $scope.item.suplier.id, true).then(function (dat) {
                    var datas = dat.data;
                    if ($scope.item.alamatSupl != undefined && $scope.item.telpSupl != undefined) {
                        return
                    } else {
                        $scope.item.alamatSupl = datas[0].alamatlengkap;
                        $scope.item.telpSupl = 'Telp. ' + datas[0].telepon + ' Fax. ' + datas[0].faksimile;
                    }
                });
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                $scope.item.no = dataSelected.no
                medifirstService.get("logistik/get-combo-barang-logistik?namaproduk=" + dataSelected.namaproduk, true, true, 20).then(function (data) {
                    $scope.listProduk.add(data.data[0])
                    $scope.item.produk = data.data[0];

                    $scope.item.jumlah = 0
                    GETKONVERSI(dataSelected.jumlah)
                    $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                    $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }

                    if (noOrder == 'EditOrder') {
                        $scope.item.jumlah = dataSelected.jumlah; //dataSelected.qtyprodukkonfirmasi
                        $scope.item.hargaSatuan = dataSelected.hargasatuan;//dataSelected.hargasatuanquo
                        $scope.item.disc = dataSelected.hargadiscount;//dataSelected.hargadiscountquo
                        $scope.item.ppn = dataSelected.ppn;//dataSelected.hargappnquo
                        $scope.item.subTotal = dataSelected.total;//dataSelected.totalkonfirmasi
                    } else {
                        $scope.item.jumlah = dataSelected.jumlah
                        $scope.item.hargaSatuan = dataSelected.hargasatuan
                        $scope.item.disc = dataSelected.hargadiscount
                        $scope.item.ppn = dataSelected.ppn
                        $scope.item.subTotal = dataSelected.total
                    }

                })

            }
            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.ppn = 0
                $scope.item.disc = 0
            }

            $scope.$watch('item.noOrder', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    medifirstService.get("logistik/get-nomor-sppb?NoSPPB=" + $scope.item.noOrder, true).then(function (data_ih) {
                        var datas = data_ih.data;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            if (datas[i].noorder == $scope.item.noOrder) {
                                alert("No SPPB Tidak Boleh Sama!")
                                // $scope.item.noOrder = "";
                                break
                            }
                        }
                        // if (datas == $scope.item.hps) {

                        // }
                    })

                }
            });


            $scope.batal = function () {
                Kosongkan()
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.simpan = function () {
                if ($scope.item.noOrder == undefined) {
                    alert("No SPPB Tidak Boleh Kosong!!")
                    return
                }
                if ($scope.item.koordinator == undefined) {
                    alert("Pilih Koordinator!!")
                    return
                }
                if ($scope.item.pegawaiPembuat == undefined) {
                    alert("Pilih Pegawai Pembuat Komitmen!!")
                    return
                }
                if ($scope.item.suplier == undefined) {
                    alert("Pilih Perusahaan!!")
                    return
                }
                if ($scope.item.asalProduk == undefined) {
                    alert("Pilih Sumber Dana!!")
                    return
                }
                if ($scope.item.tglUsulan == undefined) {
                    alert("Pilih Tgl Usulan!!")
                    return
                }
                if ($scope.item.tahun == undefined) {
                    alert("Isi Tahun Pengadaan!!")
                    return
                }
                var strAlamat = '';
                if ($scope.item.alamatSupl != undefined) {
                    strAlamat = $scope.item.alamatSupl
                }
                var qtyHari = 0;
                if ($scope.item.jmlHari != undefined) {
                    qtyHari = $scope.item.jmlHari
                }

                var mataanggaran = '';
                if ($scope.item.mataAnggaran != undefined) {
                    mataanggaran=$scope.item.mataAnggaran.norec
                }

                var Pengendali = null;
                if ($scope.item.Pengendali != undefined) {
                    Pengendali = $scope.item.Pengendali.id
                }

                var StaffPengendali = null;
                if ($scope.item.Pengendali != undefined) {
                    StaffPengendali = $scope.item.StaffPengendali.id
                }

                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                var strukorder = {
                    noorder: $scope.item.noOrder,
                    asalprodukfk: $scope.item.asalProduk.id,
                    pegawaiorderfk: $scope.item.pegawaiPembuat.id,
                    keteranganorder: $scope.item.keterangan,
                    qtyjenisproduk: data2.length,
                    tglorder: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                    alamat: strAlamat,
                    notelpmobile: $scope.item.telpSupl,
                    koordinator: $scope.item.koordinator.jenisusulan,
                    koordinatorid: $scope.item.koordinator.id,
                    tglusulan: moment($scope.item.tglUsulan).format('YYYY-MM-DD'),
                    nousulan: $scope.item.noUsulan,
                    namapengadaan: $scope.item.namaPengadaan,
                    nokontrak: $scope.item.noKontrak,
                    tahunusulan: $scope.item.tahun,
                    namarekanansales: $scope.item.suplier.namarekanan,
                    objectrekananfk: $scope.item.suplier.id,
                    total: TotTotal,
                    norec: norecResep,
                    norecsppb:norecSppb,
                    jmlHari: qtyHari,
                    norecrealisasi: norec_Realisasi,
                    objectmataanggaranfk: mataanggaran,
                    pengendali:Pengendali,
                    staffpengendali:StaffPengendali
                }

                var TempData = []
                for (var i = 0; i < data2.length; i++) {
                    if (data2[i] != undefined) {
                        TempData.push(data2[i])
                    }
                }

                var subTotal = 0;
                var ppn = 0;
                var subtotalwithppn = 0;
                for (var i = TempData.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat(TempData[i].total)
                    ppn = parseFloat((subTotal * 10) / 100)
                    subtotalwithppn = parseFloat(subTotal - ((subTotal * 10) / 100))
                }

                $scope.dataGrid._data = TempData;


                var objSave =
                {
                    strukorder: strukorder,
                    subTotal,
                    ppn,
                    subtotalwithppn,
                    details: TempData
                }
                
                medifirstService.post('logistik/save-data-sppb',objSave).then(function (e) {
                    $scope.item.noKirim = e.data.nokirim.nokirim
                    var stt = 'false'
                    if (confirm('View SPPB? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    //client.get('http://127.0.0.1:1237/printvb/printvb/logistik?cetak-SPPB=1&nores='+e.data.nokirim+'&view='+stt+'&user='+pegawaiUser.namalengkap, function(response) {
                    client.get('http://127.0.0.1:1237/printvb/logistik?cetak-SPPB=1&norec=' + e.data.nokirim + '&view=true', function (response) {
                        //aadc=response;
                    });
                    window.history.back();
                    $scope.saveShow = false;
                    Kosongkan();
                })

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
                // if ($scope.item.jenisKemasan == undefined) {
                //     alert("Pilih Jenis Kemasan terlebih dahulu!!")
                //     return;
                // }
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

            function terbilang(bilangan) {

                bilangan = String(bilangan);
                var angka = new Array('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
                var kata = new Array('', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan');
                var tingkat = new Array('', 'Ribu', 'Juta', 'Milyar', 'Triliun');

                var panjang_bilangan = bilangan.length;

                /* pengujian panjang bilangan */
                if (panjang_bilangan > 15) {
                    kaLimat = "Diluar Batas";
                    return kaLimat;
                }

                /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
                var i = 0
                var j = 0

                for (i = 1; i <= panjang_bilangan; i++) {
                    angka[i] = bilangan.substr(-(i), 1);
                }

                i = 1;
                j = 0;
                var kaLimat = "";
                var subkaLimat = "";
                kaLimat = "";


                /* mulai proses iterasi terhadap array angka */
                while (i <= panjang_bilangan) {

                    subkaLimat = "";
                    var kata1 = "";
                    var kata2 = "";
                    var kata3 = "";

                    /* untuk Ratusan */
                    if (angka[i + 2] != "0") {
                        if (angka[i + 2] == "1") {
                            kata1 = "Seratus";
                        } else {
                            kata1 = kata[angka[i + 2]] + " Ratus";
                        }
                    }

                    /* untuk Puluhan atau Belasan */
                    if (angka[i + 1] != "0") {
                        if (angka[i + 1] == "1") {
                            if (angka[i] == "0") {
                                kata2 = "Sepuluh";
                            } else if (angka[i] == "1") {
                                kata2 = "Sebelas";
                            } else {
                                kata2 = kata[angka[i]] + " Belas";
                            }
                        } else {
                            kata2 = kata[angka[i + 1]] + " Puluh";
                        }
                    }

                    /* untuk Satuan */
                    if (angka[i] != "0") {
                        if (angka[i + 1] != "1") {
                            kata3 = kata[angka[i]];
                        }
                    }

                    /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
                    if ((angka[i] != "0") || (angka[i + 1] != "0") || (angka[i + 2] != "0")) {
                        subkaLimat = kata1 + " " + kata2 + " " + kata3 + " " + tingkat[j] + " ";
                    }

                    /* gabungkan variabe sub kaLimat (untuk Satu blok 3 angka) ke variabel kaLimat */
                    kaLimat = subkaLimat + kaLimat;
                    i = i + 3;
                    j = j + 1;

                }

                /* mengganti Satu Ribu jadi Seribu jika diperlukan */
                if ((angka[5] == "0") && (angka[6] == "0")) {
                    kaLimat = kaLimat.replace("Satu Ribu", "Seribu");
                }

                return kaLimat + "Rupiah";
            }
            //***********************************

        }
    ]);
});
