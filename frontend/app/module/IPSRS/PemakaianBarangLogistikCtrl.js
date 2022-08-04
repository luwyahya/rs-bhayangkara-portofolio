define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PemakaianBarangLogistikCtrl', ['$scope', 'CacheHelper', '$mdDialog', 'MedifirstService',
        function ($scope, cacheHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglAwal = new Date();
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
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;           
            LoadCache();

            // init();
            function LoadCache() {
                ComboLoad();
                $scope.item.jenisKirim = { id: 3, jenis: 'Pemakaian' }
                var chacePeriode = cacheHelper.get('KirimBarangLogistikCtrl');
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
                    cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                } else {
                    // init()
                }
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
            }

            function ComboLoad() {
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listPenulisResep = medifirstService.getPegawaiLogin();
                    $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                    $scope.listJenisKirim = [{ id: 1, jenis: 'Amprahan' }, { id: 2, jenis: 'Transfer' }, { id: 3, jenis: 'Pemakaian' }]
                    $scope.listAsalProduk = dataCombo.asalproduk;
                    $scope.listRuanganTujuan = dataCombo.ruanganall;
                    pegawaiUser = dataCombo.detaillogin[0];
                    $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.item.jenisKirim = { id: 2, jenis: 'Transfer' }
                    $scope.listDataJabatan = dataCombo.jabatan;
                    $scope.listProduk = dataCombo.produk;
                    init();
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });

            }

            function init() {
                if (statusLoad != '') {
                    if (statusLoad == 'EditKirim') {
                        medifirstService.get("logistik/get-detail-kirim-barang-ruangan?norec=" + noreckirim, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            $scope.item.noKirim = data_ih.data.head.nokirim
                            $scope.item.tglAwal = data_ih.data.head.tglkirim
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

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        });
                    }
                    if (statusLoad == 'KirimBarang') {
                        medifirstService.get("logistik/get-detail-order-for-kirim-barang?norecOrder=" + norecOrder, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm:ss') //data_ih.data.detail.tglorder
                            $scope.item.ruangan = { id: data_ih.data.detail.ruidtujuan, namaruangan: data_ih.data.detail.ruangantujuan };
                            $scope.item.ruanganTujuan = { id: data_ih.data.detail.ruidasal, namaruangan: data_ih.data.detail.ruanganasal };
                            $scope.item.jenisKirim = { id: data_ih.data.detail.jenisid, jenis: data_ih.data.detail.jenis }
                            data2 = data_ih.data.details;
                            $scope.item.Keterangan = data_ih.data.detail.keterangan;
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

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                if (data2[i].qtyorder == undefined) {
                                    data2[i].qtyorder = 0;
                                }
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        });
                    }
                }
            }

            $scope.getSatuan = function () {
                /* info stok all ruangan */
                medifirstService.get("farmasi/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        $scope.item.namaProduks = $scope.item.produk.namaproduk;
                        for (var i = 0; i < e.data.infostok.length; i++) {
                            e.data.infostok[i].no = i + 1
                        }
                        $scope.dataGridStok = new kendo.data.DataSource({
                            data: e.data.infostok,
                            pageable: true,
                            pageSize: 5,
                            total: e.data.infostok.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        })
                    })
                /* end info stok all ruangan */
                GETKONVERSI(0)
            }

            $scope.columnGridStok = [
                {
                    "field": "no",
                    "title": "No",
                    "width" : "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width" : "100px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Stok",
                    "width" : "50px",
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
                    //alert("Pilih Ruangan terlebih dahulu!!")
                    return;
                }

                $scope.item.jumlah = jml
                medifirstService.get("logistik/get-produkdetail?" +
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
                        // alert('Stok kosong')
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
                    alert("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.stok == 0) {
                    alert("Stok Tidak Ada!")
                    return;
                }
                if (noTerima == '') {
                    $scope.item.jumlah = 0
                    alert("Jumlah blm di isi!!")
                    return;
                }
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
                            data.hargajual = String($scope.item.hargaSatuan)
                            data.stock = String($scope.item.stok)
                            data.harganetto = String($scope.item.hargaSatuan)
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
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.hargadiscount = String($scope.item.hargadiskon)
                            data.total = $scope.item.total

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
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                } else {
                    data = {
                        no: nomor,
                        hargajual: String($scope.item.hargaSatuan),
                        stock: String($scope.item.stok),
                        harganetto: String($scope.item.hargaSatuan),
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
                        hargasatuan: String($scope.item.hargaSatuan),
                        hargadiscount: String($scope.item.hargadiskon),
                        total: $scope.item.total
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
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
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
                var Keterangan = 'Kirim Barang'
                if ($scope.item.Keterangan != undefined || $scope.item.Keterangan != '') {
                    Keterangan = $scope.item.Keterangan
                }

                var strukkirim = {
                    objectpegawaipengirimfk: pegawaiUser.id,
                    objectruanganfk: $scope.item.ruangan.id,
                    objectruangantujuanfk: $scope.item.ruanganTujuan.id,
                    jenispermintaanfk: $scope.item.jenisKirim.id,
                    keteranganlainnyakirim: Keterangan,
                    qtydetailjenisproduk: 0,
                    qtyproduk: data2.length,
                    tglkirim: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                    totalhargasatuan: 0,
                    norecOrder: noorderfk,
                    noreckirim: noreckirim,
                    norec_apd: 0
                }
                var objSave =
                {
                    strukkirim: strukkirim,
                    details: data2
                }

                medifirstService.post('logistik/save-kirim-barang-ruangan', objSave).then(function (e) {
                    $scope.item.noKirim = e.data.nokirim.norec
                    norecCetak = $scope.item.noKirim;
                    Kosongkan();
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
                    alert("Pilih Ruanganan Pengirim!!")
                    return
                }
                if ($scope.item.ruanganTujuan == undefined) {
                    alert("Pilih Ruanganan Tujuan!!")
                    return
                }
                if ($scope.item.Keterangan == undefined) {
                    alert("Keterangan Masih Kosong!!")
                    return
                }
                if ($scope.item.jenisKirim == undefined) {
                    alert("Pilih Jenis Kiriman!!")
                    return
                }
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                var objSave =
                {
                    objectruanganfk: $scope.item.ruangan.id,
                    details: data2
                }

                medifirstService.post('logistik/cek-kirim-barang-ruangan', objSave).then(function (dat) {
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

                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Apakah anda yakin akan kirim barang?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            $scope.SaveKirim();
                        })

                    } else {
                        alert("Stok Tidak Ada, Tidak Bisa Dikirim!!!")
                        $scope.winDialog.close();
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
                    alert("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.total == 0) {
                    alert("Stok tidak ada harus di isi!")
                    return;
                }
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

            //***********************************
        }
    ]);
});
