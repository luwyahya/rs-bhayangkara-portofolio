define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PemakaianStokRuanganCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tgl = new Date();
            $scope.item.tglKK = new Date();
            $scope.kaskecilShow = false;
            var pegawaiUser = {}
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data2R = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0


            var qty = 0
            var hrgsatuan = 0
            var ppn = 0
            var hargadiskon = 0
            var ppnprs = 0
            var hargadiskonprs = 0

            var ttlTotal = 0;
            var ttlDiskon = 0;
            var ttlPpn = 0;
            var grandTotal = 0;
            var norecTerima = ''
            var norecSPPB = ''
            var tarifJasa = 0
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            // init();
            function LoadCache() {
                $scope.item.noTerima = 'RS/' + moment(new Date()).format('YYMM') + '____'
                $scope.item.noBuktiKK = '____' + '/KK/' + moment(new Date()).format('MM/YY')
                var chacePeriode = cacheHelper.get('PemakaianStokRuanganCtrl');
                if (chacePeriode != undefined) {
                    norecTerima = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    norecSPPB = chacePeriode[2]


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
                    cacheHelper.set('PemakaianStokRuanganCtrl', chacePeriode);
                } else {
                    init()
                }
            }
            $scope.getProduk = function () {
                medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                    $scope.listProduk = dat.data.produk;
                })
            }
            $scope.$watch('item.ruangan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("logistik/get-produk-by-ruangans?ruid="+newValue.id).then(function (dat) {
                       var dataCombo = dat.data;
                      $scope.listProduk = dataCombo.produk;
                    });
                }
            })
            function init() {
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    $scope.listKelompokProduk = dat.data.kelompokproduk;
                    $scope.item.kelompokproduk = { id: 24, kelompokproduk: 'Barang Persediaan' }
                    // medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    //     $scope.listProduk = data;
                    // })
                    $scope.listAsalBarang = dat.data.asalproduk;
                    $scope.listRuangan = medifirstService.getMapLoginUserToRuangan()// dat.data.ruanganall;
                    $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.listPegawai = dat.data.detaillogin;
                    $scope.item.pegawaiPenerima = { id: $scope.listPegawai[0].id, namalengkap: $scope.listPegawai[0].namalengkap }
                    pegawaiUser = dat.data.detaillogin[0];
                    if (noOrder != '') {
                        if (noOrder == 'EditPemakaian') {
                            medifirstService.get("logistik/get-detail-pemakaian-ruangan?norec=" + norecTerima, true).then(function (e) {
                                var head = e.data.struk
                                var details = e.data.details
                                $scope.isRouteLoading = false;
                                $scope.item.noPemakaian = head.nostruk
                                $scope.item.tgl = head.tglstruk
                                $scope.item.kelompokproduk = { id: details[0].kpid, kelompokproduk: details[0].kelompokproduk }
                                $scope.item.asal = { id: details[0].asalprodukfk, asalproduk: details[0].asalproduk }
                                $scope.item.ruangan = { id: head.objectruanganfk, namaruangan: head.namaruangan }
                                $scope.item.pegawaiPenerima = { id: head.pgid, namalengkap: head.namalengkap }
                                $scope.item.keterangan = head.keteranganlainnya
                                data2 = details
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });
                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        }
                    }
                });

            }
            $scope.getChangeAP = function () {
                if ($scope.item.asalproduk.asalproduk == "Kas Kecil") {
                    $scope.kaskecilShow = true
                } else {
                    $scope.kaskecilShow = false
                }

            }

            $scope.getSatuan = function () {
                GETKONVERSI();
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
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                if ($scope.item.ruangan == undefined) {
                    return;
                }

                $scope.item.jumlah = 0
                $scope.item.dosis = 1
                $scope.item.jumlahxmakan = 1
                 medifirstService.get("logistik/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id, true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        if (dat.data.jmlstok == 0) {
                            toastr.warning('Stok tidak ada')
                        }
                         medifirstService.get("logistik/get-cekstok?"+
                            "produkfk="+ $scope.item.produk.id +
                            "&ruanganfk="+ $scope.item.ruangan.id , true).then(function(dat2){
                                debugger;
                                var currentDate='';
                            if (parseFloat($scope.item.stok) != parseFloat(dat2.data.kartustoklast[0].saldoawal) ){
                                if(dat2.data.kartustoksebelum.length == 0){
                                    currentDate = dat2.data.kartustoklast[0].created_at;
                                }else{
                                    currentDate = dat2.data.kartustoksebelum[0].created_at;
                                }
                                var objSave = {
                                    "ruanganfk": $scope.item.ruangan.id,
                                    "produkfk": $scope.item.produk.id,
                                    "tglawal": moment(currentDate).format('YYYY-MM-DD 00:00:00')
                                }
                                 medifirstService.post('logistik/save-perbaiki-kartu-stok',objSave).then(function (e) {
                                    // alert('yoyoyyy');
                                })
                            }
                        });
                        $scope.item.stok = parseFloat(dat.data.jmlstok / $scope.item.nilaiKonversi)
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        if ($scope.dataSelected != undefined) {
                            $scope.item.jumlah = $scope.dataSelected.jumlah
                            $scope.item.dosis = $scope.dataSelected.dosis
                            $scope.item.jumlahxmakan = parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)
                            $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                            $scope.item.satuan = { ssid: $scope.dataSelected.satuanviewfk, satuanstandar: $scope.dataSelected.satuanview }
                            $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                            $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                            $scope.item.hargaNetto = $scope.dataSelected.harganetto
                            $scope.item.subTotaltxt = $scope.dataSelected.total
                        }
                    });
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }

            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0//hrgsdk * parseFloat(newValue)
                        $scope.item.subTotaltxt = 0// parseFloat(newValue) * 
                        // (hrg1-hrgsdk)
                    }
                }
            });

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok == 0) {
                        $scope.item.jumlah = 0
                        //alert('Stok kosong')

                        return;
                    }
                    var qty20 = 0
                    tarifJasa = 0//800
                    if (parseFloat(tarifJasa) != 0) {
                        if ($scope.item.jenisKemasan.id == 2) {
                            tarifJasa = 800
                        }
                        if ($scope.item.jenisKemasan.id == 1) {
                            qty20 = Math.floor(parseFloat($scope.item.jumlah) / 20)
                            if (parseFloat($scope.item.jumlah) % 20 == 0) {
                                qty20 = qty20
                            } else {
                                qty20 = qty20 + 1
                            }

                            if (qty20 != 0) {
                                tarifJasa = 800 * qty20
                            }

                        }
                    }
                    if ($scope.item.no == undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            if (data2[i].rke == $scope.item.rke) {
                                tarifJasa = 0
                            }
                        }
                    }

                    var ada = false;
                    var qtyInput = 0;
                    var qtyStok = 0;
                    qtyInput = parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi));
                   
                    for (var i = 0; i < dataProdukDetail.length; i++) {
                        ada = false
                       
                        if ( parseFloat(dataProdukDetail[i].qtyproduk) != 0) {
                            qtyStok= qtyStok +  parseFloat(dataProdukDetail[i].qtyproduk) ;
                            if ( qtyStok - qtyInput  >= 0)
                            {
                                hrg1 = Math.round(parseFloat(dataProdukDetail[i].harganetto) * parseFloat($scope.item.nilaiKonversi))
                                hrgsdk = parseFloat(dataProdukDetail[i].hargadiscount) * parseFloat($scope.item.nilaiKonversi)
                                $scope.item.hargaSatuan = hrg1
                                $scope.item.hargaNetto = Math.round(parseFloat(dataProdukDetail[i].harganetto) * parseFloat($scope.item.nilaiKonversi))
    
                                $scope.item.hargadiskon = hrgsdk
                                $scope.item.subTotaltxt = (parseFloat($scope.item.jumlah) * (hrg1 - hrgsdk)) + parseFloat(tarifJasa)
                                noTerima = dataProdukDetail[i].norec
                                $scope.item.asal = { id: dataProdukDetail[i].objectasalprodukfk, asalproduk: dataProdukDetail[i].asalproduk }
                                ada = true;
                                break;
                            }
                           
                        }
                    }
                    if (ada == false) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.subTotaltxt = 0

                        noTerima = ''
                    }
                    if ($scope.item.jumlah == 0) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargaNetto = 0
                    }
                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if ($scope.item.subTotaltxt == 0) {
                    toastr.error("SubTotal harus di isi!")
                    return;
                }
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
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.harganetto = String($scope.item.hargaSatuan)
                            data.nostrukterimafk = noTerima
                            data.ruanganfk = $scope.item.ruangan.id
                            data.asalprodukfk = $scope.item.asal.id
                            data.asalproduk = $scope.item.asal.asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = parseFloat($scope.item.nilaiKonversi)
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jumlah = parseFloat($scope.item.jumlah)
                            data.total = $scope.item.subTotaltxt
                            data.keterangan = $scope.item.keterangan
                            data.nobatch = $scope.item.nobatch
                            data.tglkadaluarsa = $scope.item.tglkadaluarsa

                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });

                            ttlTotal = 0;
                            ttlDiskon = 0;
                            ttlPpn = 0;
                            grandTotal = 0;

                            for (var i = data2.length - 1; i >= 0; i--) {
                                ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                            }
                            $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            grandTotal = ttlTotal + ttlPpn - ttlDiskon
                            $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        hargasatuan: String($scope.item.hargaSatuan),
                        nostrukterimafk: noTerima,
                        ruanganfk: $scope.item.ruangan.id,
                        asalprodukfk: $scope.item.asal.id,
                        asalproduk: $scope.item.asal.asalproduk,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jumlah: parseFloat($scope.item.jumlah),
                        total: parseFloat($scope.item.subTotaltxt),
                        keterangan: $scope.item.keterangan,
                        nobatch: $scope.item.nobatch,
                        tglkadaluarsa: $scope.item.tglkadaluarsa
                    }
                    data2.push(data)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });

                    ttlTotal = 0;
                    ttlDiskon = 0;
                    ttlPpn = 0;
                    grandTotal = 0;

                    for (var i = data2.length - 1; i >= 0; i--) {
                        ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                        ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                        ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                    }
                    $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                    grandTotal = ttlTotal + ttlPpn - ttlDiskon
                    $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }

                Kosongkan()
                racikan = ''
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no

                medifirstService.get("logistik/get-combo-barang-logistik?namaproduk=" + dataSelected.namaproduk, true, true, 20).then(function (data) {
                    $scope.listProduk.add(data.data[0])
                    $scope.item.produk = data.data[0];

                    $scope.item.jumlah = 0
                    GETKONVERSI()
                    $scope.item.nilaiKonversi = parseFloat(dataSelected.nilaikonversi)
                    $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }
                    $scope.item.jumlah = parseFloat(dataSelected.jumlah)
                    $scope.item.hargaSatuan = parseFloat(dataSelected.hargasatuan)
                    $scope.item.subTotaltxt = parseFloat(dataSelected.total)
                })
            }

            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.hargaSatuan = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.ppn = 0
                $scope.item.hargaDiskon = 0
                $scope.item.subTotaltxt = 0
                $scope.dataSelected = undefined
            }

            $scope.batal = function () {
                Kosongkan()
            }

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
                    "field": "total",
                    "title": "SubTotal",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                }
            ];

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.kembali = function () {
                window.history.back();
            }

            $scope.simpan = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Pilih Ruangan !!")
                    return
                }
                if ($scope.item.pegawaiPenerima == undefined) {
                    toastr.error("Pilih Pegawai !!")
                    return
                }
                if ($scope.item.keterangan == undefined) {
                    toastr.error("Isi keterangan!!")
                    return
                }
                if (data2.length == 0) {
                    toastr.error("Pilih Produk terlebih dahulu!!")
                    return
                }

                var struk = {
                    nostruk: norecTerima,
                    ruanganfk: $scope.item.ruangan.id,
                    namaruangan: $scope.item.ruangan.namaruangan,
                    tglstruk: moment($scope.item.tgl).format('YYYY-MM-DD HH:mm:ss'),
                    pegawaimenerimafk: $scope.item.pegawaiPenerima.id,
                    namapegawaipenerima: $scope.item.pegawaiPenerima.namalengkap,
                    keterangan: $scope.item.keterangan,
                    qtyproduk: data2.length,
                    total: ttlTotal
                }
                var objSave =
                {
                    struk: struk,
                    details: data2
                }

                medifirstService.post('logistik/save-pemakaian-ruangan', objSave).then(function (e) {
                    $scope.item.noTerima = e.data.noterima
                    var stt = 'false'
                    if (confirm('View Struk? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + e.data.data.norec + '&view=' + stt + '&user=' + pegawaiUser.namalengkap, function (response) {
                        //aadc=response;
                    });
                    window.history.back();
                    $scope.saveShow = false;
                    Kosongkan();
                })
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
                if ($scope.item.total == 0) {
                    toastr.error("Stok tidak ada harus di isi!")
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
                            var ttlTotal = 0;
                            var ttlDiskon = 0;
                            var ttlPpn = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                            }
                            $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            var grandTotal = 0;
                            grandTotal = ttlTotal + ttlPpn - ttlDiskon
                            $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        }
                    }
                }
                Kosongkan()
            }
            //***********************************
        }
    ]);
});
