define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PenerimaanSanitasiCtrl', ['$scope', 'CacheHelper', '$mdDialog', 'MedifirstService',
        function ($scope, cacheHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglAwal = new Date();
            $scope.title ='Penerimaan Sanitasi'
            $scope.titleTambahan ='Terima'
            $scope.disableKirimBalik =false
            var pegawaiUser = {}
            var norecCetak = '';
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
            var noreckirim = ''
            var norecOrder = '';
            var statusLoad = ''
            var kelompoktransaksi = 119
            var statuskirim = '-'
            var jenis ='terima'
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;           
            LoadCache();

            // init();
            function LoadCache() {
                ComboLoad();
                var chacePeriode = cacheHelper.get('PenerimaanSanitasiCtrl');
                if (chacePeriode != undefined) {
                    noreckirim = chacePeriode[0]
                    norecOrder = chacePeriode[1]
                    statusLoad = chacePeriode[2]
                    // init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('PenerimaanSanitasiCtrl', chacePeriode);
                } else {
                    // init()
                }
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
            }

            function ComboLoad() {                
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPelapor = data;
                }); 
                medifirstService.get("sanitasi/get-combo-sanitasi", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listPenulisResep = medifirstService.getPegawaiLogin();
                    $scope.listRuangan = dataCombo.ruanganall;
                    $scope.listJenisKirim = [{ id: 1, jenis: 'Amprahan' }, { id: 2, jenis: 'Transfer' }]
                    $scope.listAsalProduk = dataCombo.asalproduk;
                    $scope.listRuanganTujuan = dataCombo.ruanganlaundry// medifirstService.getMapLoginUserToRuangan();
                    $scope.item.ruanganTujuan = { id: $scope.listRuanganTujuan[0].id, namaruangan: $scope.listRuanganTujuan[0].namaruangan }
                    // $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.item.jenisKirim = { id: 2, jenis: 'Transfer' }
                    $scope.listDataJabatan = dataCombo.jabatan;
                    $scope.listProduk = dataCombo.produk;
                    init();
                });



            }

            function init() {
                if (statusLoad != '') {
                    if (statusLoad == 'EditKirim') {
                        medifirstService.get("laundry/get-detail-kirim-laundry-ruangan?norec=" + noreckirim, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            $scope.item.noKirim = data_ih.data.head.nokirim
                            $scope.item.tglAwal = new Date(data_ih.data.head.tglkirim)
                            $scope.item.ruangan = { id: data_ih.data.head.id, namaruangan: data_ih.data.head.namaruangan }
                            $scope.item.ruanganTujuan = { id: data_ih.data.head.ruid2, namaruangan: data_ih.data.head.namaruangan2 }
                            $scope.item.Keterangan = data_ih.data.head.keterangan;
                            data2 = data_ih.data.detail

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
                        });
                    }
                    if (statusLoad == 'KirimBalik') {
                        $scope.title = 'Kirim Laundry'
                        $scope.titleTambahan ='Kirim'
                        jenis = 'kirim'
                        $scope.disableKirimBalik =true
                        medifirstService.get("laundry/get-detail-kirim-laundry-ruangan?norec=" + noreckirim, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            // $scope.item.noKirim = data_ih.data.head.nokirim
                            $scope.item.tglAwal = new Date(data_ih.data.head.tglkirim)

                            var ruanganAsal = $scope.listRuanganTujuan
                            var ruanganTuju = $scope.listRuangan
                            $scope.listRuangan = ruanganAsal
                            $scope.listRuanganTujuan = ruanganTuju

                            $scope.item.ruanganTujuan = { id: data_ih.data.head.id, namaruangan: data_ih.data.head.namaruangan }
                            $scope.item.ruangan = { id: data_ih.data.head.ruid2, namaruangan: data_ih.data.head.namaruangan2 }
                            $scope.item.Keterangan = data_ih.data.head.keterangan;
                            data2 = data_ih.data.detail

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
                        });

                    }

                }
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
                GETKONVERSI(0)
            }

            $scope.columnGridStok = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Stok",
                    "width": "50px",
                }

            ];

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
                if ($scope.item.ruangan == undefined) {
                    //toastr.error("Pilih Ruangan terlebih dahulu!!")
                    return;
                }

                $scope.item.jumlah = jml
                medifirstService.get("laundry/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id, true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
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
                        $scope.item.total = 0// parseFloat(newValue) * 
                        // (hrg1-hrgsdk)
                    }
                }
            });

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    // if ($scope.item.jenisKemasan == undefined) {
                    //     return
                    // }
                    if ($scope.item.stok == 0) {
                        $scope.item.jumlah = 0
                        // toastr.error('Stok kosong')
                        // return;
                    }

                    $scope.item.hargaSatuan = 0
                    $scope.item.hargadiskon = 0
                    $scope.item.total = 1//parseFloat($scope.item.jumlah) * (0)
                    noTerima = 'as@epic'
                    $scope.item.asal = { id: 1, asalproduk: 'as@epic' }


                    var ada = false;
                    ada = true;
                    if (ada == false) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.total = 0

                        noTerima = ''
                    }
                    if ($scope.item.jumlah == 0) {
                        $scope.item.hargaSatuan = 0
                    }
                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if ($scope.item.jumlah == 0) {
                    toastr.error("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.stok == 0) {
                    toastr.error("Stok Tidak Ada!")
                    return;
                }
                if (noTerima == '') {
                    $scope.item.jumlah = 0
                    toastr.error("Jumlah blm di isi!!")
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
                            // data.hargajual = String($scope.item.hargaSatuan)
                            data.stock = String($scope.item.stok)
                            // data.harganetto = String($scope.item.hargaSatuan)
                            data.nostrukterimafk = noTerima
                            data.ruanganfk = $scope.item.ruangan.id
                            data.asalprodukfk = $scope.item.asal.id
                            data.asalproduk = $scope.item.asal.asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.kdproduk = $scope.item.produk.kdproduk
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = String($scope.item.stok)
                            data.jumlah = $scope.item.jumlah
                            data.qtyorder = data2[i].qtyorder
                            // data.hargasatuan = String($scope.item.hargaSatuan)
                            // data.hargadiscount = String($scope.item.hargadiskon)
                            // data.total = $scope.item.total

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
                            // var subTotal = 0;
                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal = subTotal + parseFloat(data2[i].total)
                            // }
                            // $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                } else {
                    data = {
                        no: nomor,
                        // hargajual: String($scope.item.hargaSatuan),
                        stock: String($scope.item.stok),
                        // harganetto: String($scope.item.hargaSatuan),
                        nostrukterimafk: noTerima,
                        ruanganfk: $scope.item.ruangan.id,//£££                       
                        asalprodukfk: $scope.item.asal.id,
                        asalproduk: $scope.item.asal.asalproduk,
                        produkfk: $scope.item.produk.id,
                        kdproduk: $scope.item.produk.kdproduk,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jmlstok: String($scope.item.stok),
                        jumlah: $scope.item.jumlah,
                        qtyorder: 0,
                        // hargasatuan: String($scope.item.hargaSatuan),
                        // hargadiscount: String($scope.item.hargadiskon),
                        // total: $scope.item.total
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
                    // var subTotal = 0;
                    // for (var i = data2.length - 1; i >= 0; i--) {
                    //     subTotal = subTotal + parseFloat(data2[i].total)
                    // }
                    // $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }
                Kosongkan()
                racikan = ''
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
                $scope.item.produk = dataProduk
                $scope.item.jumlah = 0
                GETKONVERSI(dataSelected.jumlah)
                $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }
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
                    "field": "produkfk",
                    "title": "Kd Produk",
                    "width": "70px",
                },
                {
                    "field": "namaproduk",
                    "title": "Produk",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jmlstok",
                    "title": "Stok",
                    "width": "70px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "70px",
                }
            ];

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }
            var noorderfk = null
            if (norecOrder != '') {
                noorderfk = norecOrder
            }

            $scope.SaveKirim = function () {
                $scope.saveShow = false
                var Keterangan = ''
                if ($scope.item.Keterangan != undefined) {
                    Keterangan = $scope.item.Keterangan
                }

                if (statusLoad == 'KirimBalik') {
                    noorderfk = noreckirim
                    noreckirim = ''
                    kelompoktransaksi = 120
                 
                }
                var strukkirim = {
                    jenis: jenis,
                    objectpegawaipengirimfk: medifirstService.getPegawaiLogin().id,
                    objectruanganfk: $scope.item.ruangan.id,
                    objectruangantujuanfk: $scope.item.ruanganTujuan.id,
                    // jenispermintaanfk: $scope.item.jenisKirim.id,
                    keteranganlainnyakirim: Keterangan,
                    qtydetailjenisproduk: 0,
                    qtyproduk: data2.length,
                    tglkirim: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                    totalhargasatuan: 0,
                    norecOrder: noorderfk,
                    noreckirim: noreckirim,
                    norec_apd: 0,
                    kelompoktransaksi: kelompoktransaksi,
                    status: statuskirim
                }
                var objSave =
                {
                    strukkirim: strukkirim,
                    details: data2
                }

                medifirstService.post('laundry/save-terima-laundry', objSave).then(function (e) {
                    $scope.item.noKirim = e.data.nokirim.nokirim
                    norecCetak = $scope.item.noKirim;
                    Kosongkan();
                    $scope.saveShow = true;
                    // $scope.popUp.center().open();
                }, function (error) {
                    $scope.saveShow = true;
                });
            }

            $scope.tes = function () {
                $scope.popUp.center().open();
            }

            $scope.CetakAh = function () {

                var jabatan1 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan1 = $scope.item.DataJabatan.namajabatan;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan1 != undefined) {
                    jabatan2 = $scope.item.DataJabatan1.namajabatan;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan3 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai = ''
                if ($scope.item.DataPegawai != undefined) {
                    pegawai = $scope.item.DataPegawai.id;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai1 != undefined) {
                    pegawai1 = $scope.item.DataPegawai1.id;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai2 = $scope.item.DataPegawai2.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Kirim? ')) {
                    stt = 'true';
                } else {
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-pengeluaran=1&nores=' + norecCetak + '&pegawaiPenyerah=' + pegawai + '&pegawaiPenerima=' + pegawai1 + '&pegawaiMegetahui=' + pegawai2
                    + '&JabatanPenyerah=' + jabatan1 + '&JabatanPenerima=' + jabatan2 + '&jabatanMengetahui=' + jabatan3 + '&view=' + stt + '&user=' + pegawaiUser.namalengkap, function (response) {
                        //aadc=response; 
                    });
                $scope.popUp.close();
            }

            $scope.simpan = function () {

                if ($scope.item.ruangan == undefined) {
                    toastr.error("Pilih Ruanganan Pengirim!!")
                    return
                }
                if ($scope.item.ruanganTujuan == undefined) {
                    toastr.error("Pilih Ruanganan Tujuan!!")
                    return
                }

                if ($scope.item.jenisKirim == undefined) {
                    toastr.error("Pilih Jenis Kiriman!!")
                    return
                }
                if (data2.length == 0) {
                    toastr.error("Pilih Produk terlebih dahulu!!")
                    return
                }
                var objSave =
                {
                    objectruanganfk: $scope.item.ruangan.id,
                    kelompoktransaksi: 119,
                    details: data2
                }

                medifirstService.postNonMessage('laundry/cek-terima-laundry', objSave).then(function (dat) {
                    var datax = dat.data.data;
                    var datacek = data2;
                    var sama = false
                    var groupingData2 = []
                    var jumlah = 0;
                    for (var x = 0; x < data2.length; x++) {
                        sama = false
                        for (var y = 0; y < groupingData2.length; y++) {
                            if (groupingData2[y].produkfk == data2[x].produkfk) {
                                sama = true;
                                groupingData2[y].jumlah = parseFloat(groupingData2[y].jumlah) + parseFloat(data2[x].jumlah)
                            }
                        }
                        if (sama == false) {
                            var result = {
                                produkfk: data2[x].produkfk,
                                jumlah: data2[x].jumlah,
                            }
                            groupingData2.push(result)
                        }
                    }

                    for (var i = 0; i < datax.length; i++) {
                        for (var j = 0; j < groupingData2.length; j++) {
                            if (groupingData2[j].produkfk == datax[i].produkfk) {
                                if (parseFloat(datax[i].stok) >= parseFloat(groupingData2[j].jumlah)) {
                                    jumlah = i + 1;
                                }
                            }
                        }
                    }

                    if (groupingData2.length == jumlah) {


                        $scope.SaveKirim();


                    } else {
                        toastr.error("Stok Tidak Ada, Tidak Bisa Dikirim!!!")

                        return;
                    }

                });

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
                if ($scope.item.jumlah == 0) {
                    toastr.error("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.total == 0) {
                    toastr.error("Stok tidak ada harus di isi!")
                    return;
                }
                // if ($scope.item.jenisKemasan == undefined) {
                //     toastr.error("Pilih Jenis Kemasan terlebih dahulu!!")
                //     return;
                // }
                // if ($scope.item.asal == undefined) {
                //     toastr.error("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }
                if ($scope.item.produk == undefined) {
                    toastr.error("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    toastr.error("Pilih Satuan terlebih dahulu!!")
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

            //***********************************
        }
    ]);
});
