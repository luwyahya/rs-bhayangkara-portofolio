define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('FarmasiRekonsiliasiCtrl', ['$q', '$scope', 'ModelItem', '$state', 'MedifirstService', '$timeout', 'CacheHelper', '$rootScope', '$mdDialog',
        function ($q, $scope, ModelItem, $state, medifirstService, $timeout, cacheHelper, $rootScope, $mdDialog) {
            $scope.isRouteLoading = false;
            $scope.item = {
                tglresume: $scope.now
            } // set defined object
            $scope.isGrid = true
            $scope.isNext = true
            $scope.isTambah = 0;
            $scope.isObatDirawat = 0;
            $scope.cc = {}
            var noregistrasi = '';
            $scope.item.norec_pp = '';
            // $qrcodedokter = ''
            $scope.statusSelesaiPeriksaPp = false
            $scope.istempatLaporan = true
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.norecAPD = $state.params.noRec
            $scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))
            var cookie = document.cookie.split(';')
            var kelompokUser = cookie[0].split('=')
            var getCache = cacheHelper.get('cacheRekamMedis')
            debugger
            if (getCache != undefined) {
                $scope.nocm = getCache[0]
                $scope.noregistrasi = getCache[3]
                $scope.norecPd = getCache[8]
                $scope.tglregistrasi = getCache[6]
                $scope.objectpegawaifk = getCache[17]
                $scope.namadokter = getCache[16]
                if (!$scope.norecAPD)
                    $scope.norecAPD = getCache[7]
                $scope.objectruanganfk = getCache[11]
                $scope.namaruangan = getCache[12]
                $scope.item.namaruangan = getCache[12]
            }


            //--ash 03-08-2023---------------------------
            //INIT---------------------------------------
            loadRekonsialisasi()
            LoadCacheHelper()
            $scope.item.obj = []
            $scope.now = new Date()
            $scope.item.tglpengkajian = $scope.now
            $scope.item.tglpengkajianmeso = $scope.now

            $scope.item.obj[411011] = $scope.now



            function loadRmPp(norec_pp) {
                medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
                    $scope.statusSelesaiPeriksaRm = rmpp.data.isrm;
                });
            }

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRMelektronik');
                if (chacePeriode != undefined) {
                    $scope.cc.nocm = chacePeriode[0]
                    $scope.cc.namapasien = chacePeriode[1]
                    $scope.cc.jeniskelamin = chacePeriode[2]
                    $scope.cc.noregistrasi = chacePeriode[3]
                    $scope.cc.umur = chacePeriode[4]
                    $scope.cc.kelompokpasien = chacePeriode[5]
                    $scope.cc.tglregistrasi = chacePeriode[6]
                    $scope.cc.norec = chacePeriode[7]
                    $scope.cc.norec_pd = chacePeriode[8]
                    $scope.cc.objectkelasfk = chacePeriode[9]
                    $scope.cc.namakelas = chacePeriode[10]
                    $scope.cc.objectruanganfk = chacePeriode[11]
                    $scope.cc.namaruangan = chacePeriode[12]
                    $scope.cc.DataNoregis = chacePeriode[13]
                    $scope.cc.objectkelompokpasienfk = chacePeriode[19]
                    $scope.cc.norec_emr = '-'
                }
            }

            //ash -- 03-08-2023
            $scope.listPasien = [
                { "id": 1, "nama": "PASIEN BARU" },
                { "id": 2, "nama": "ANTAR RUANGAN" },
                { "id": 3, "nama": "PASIEN PULANG" }
            ]

            $scope.listRiwayatAlergi = [
                { "id": 1, "nama": "TIDAK MEMILIKI RIWAYAT ALERGI" },
                { id: '2', nama: 'YA' }
            ]

            $scope.listObatDirawat = [
                { "id": 1, "nama": "TIDAK MENGGUNAKAN OBAT SEBELUM DIRAWAT" },
                { "id": 2, "nama": "YA, DENGAN RINCIAN SEBAGAI BERIKUT" }
            ]

            $scope.listBawaObat = [
                { "id": 1, "nama": "YA" },
                { "id": 2, "nama": "TIDAK" }
            ]
            $scope.listObatLayak = [
                { "id": 1, "nama": "YA" },
                { "id": 2, "nama": "TIDAK" }
            ]

            $scope.listTindakLanjut = [
                { "id": 1, "nama": "LANJUT ATURAN PAKAI SAMA" },
                { "id": 2, "nama": "LANJUT ATURAN PAKAI BERUBAH" },
                { "id": 3, "nama": "STOP" }
            ]
            function loadRekonsialisasi() {
                medifirstService.get('emr/get-rekonsiliasi-pasien?norec=' + $scope.norecPd).then(function (dat) {
                    for (let i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                    }
                    $scope.sourceResumeHead = new kendo.data.DataSource({
                        data: dat.data,
                        length: dat.data.length,
                        pageSize: 20
                    });
                })
            }
            function loadObat() {
                //if($scope.modelGrid!=undefined || $scope.modelGrid!=null ) {
                var norec = ""
                if ($scope.modelGrid != undefined || $scope.modelGrid != "") var norec = $scope.modelGrid.norec
                else if ($scope.norecmeso != undefined || $scope.norecmeso != "") var norec = $scope.norecmeso

                if (norec != "") {
                    medifirstService.get('emr/get-rekonsiliasi-obat-pasien?norec=' + norec).then(function (dat) {
                        for (let i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataGridObat = new kendo.data.DataSource({
                            data: dat.data,
                            length: dat.data.length,
                            pageSize: 20
                        });
                    })
                } else {
                    $scope.dataGridObat = new kendo.data.DataSource({
                        data: "",
                        length: 0,
                        pageSize: 20
                    });

                }
                //}
            }

            function loadObatAfter(norecAfterSave) {
                //if($scope.modelGrid!=undefined || $scope.modelGrid!=null ) {
                var norec = ""
                if ($scope.modelGrid != undefined || $scope.modelGrid != "") var norec = $scope.modelGrid.norec
                else if ($scope.norecmeso != undefined || $scope.norecmeso != "") var norec = $scope.norecmeso

                if (norec != "") {
                    medifirstService.get('emr/get-rekonsiliasi-obat-pasien?norec=' + norecAfterSave).then(function (dat) {
                        for (let i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataGridObat = new kendo.data.DataSource({
                            data: dat.data,
                            length: dat.data.length,
                            pageSize: 20
                        });
                    })
                } else {
                    $scope.dataGridObat = new kendo.data.DataSource({
                        data: "",
                        length: 0,
                        pageSize: 20
                    });

                }
                //}
            }

            function loadObatMandiri() {
                //if($scope.modelGrid!=undefined || $scope.modelGrid!=null ) {
                var norec = ""
                if ($scope.modelGrid != undefined || $scope.modelGrid != "") var norec = $scope.modelGrid.norec
                else if ($scope.norecmeso != undefined || $scope.norecmeso != "") var norec = $scope.norecmeso

                if (norec != "") {
                    medifirstService.get('emr/get-rekonsiliasi-obat-mandiri-pasien?norec=' + norec).then(function (dat) {
                        console.log("Yang Salah")
                        for (let i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataGridObatMandiri = new kendo.data.DataSource({
                            data: dat.data,
                            length: dat.data.length,
                            pageSize: 20
                        });
                    })
                } else {
                    $scope.dataGridObatMandiri = new kendo.data.DataSource({
                        data: "",
                        length: 0,
                        pageSize: 20
                    });

                }
                //}
            }

            $scope.GridObat = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Obat</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 30 },
                    { field: "obat", title: "Nama Obat", width: 100 },
                    { field: "dosis", title: "Dosis", width: 150 },
                    { field: "waktupemberian", title: "Waktu Pemberian", width: 150 },
                    { field: "tindaklanjut", title: "Tindak Lanjut Oleh DPJP", width: 100 },
                    { field: "perubahanaturanpakai", title: "Perubahan Aturan Pakai", width: 100 },
                    { field: "sumberobat", title: "Sumber Obat", width: 100 }
                ],

            };
            $scope.GridObatMandiri = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="inputBaruMandiri()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Obat Mandiri</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 30 },
                    { field: "obat", title: "Nama Obat", width: 100 },
                    { field: "dosis", title: "Dosis", width: 150 },
                    { field: "waktupemberian", title: "Waktu Pemberian", width: 150 },
                    { field: "hari1", title: "Hari ke 1", width: 100, template: "<span class='style-left'>{{formatHariKe1('#: hari1 #')}}</span>" },
                    { field: "hari2", title: "Hari ke 2", width: 100, template: "<span class='style-left'>{{formatHariKe2('#: hari2 #')}}</span>" },
                    { field: "hari3", title: "Hari ke 3", width: 100, template: "<span class='style-left'>{{formatHariKe3('#: hari3 #')}}</span>" },
                    { field: "hari4", title: "Hari ke 4", width: 100, template: "<span class='style-left'>{{formatHariKe4('#: hari4 #')}}</span>" },
                    { field: "hari5", title: "Hari ke 5", width: 100, template: "<span class='style-left'>{{formatHariKe5('#: hari5 #')}}</span>" },
                    { field: "hari6", title: "Hari ke 6", width: 100, template: "<span class='style-left'>{{formatHariKe6('#: hari6 #')}}</span>" },
                    { field: "hari7", title: "Hari ke 7", width: 100, template: "<span class='style-left'>{{formatHariKe7('#: hari7 #')}}</span>" },
                    { field: "hari8", title: "Hari ke 8", width: 100, template: "<span class='style-left'>{{formatHariKe8('#: hari8 #')}}</span>" },
                ],
            };

            $scope.hapusObat = function () {
                debugger
                if ($scope.modelObat == null || $scope.modelObat == 'undefined') {
                    toastr.error("Pilih data obat yang akan dihapus");
                    return;
                }

                var item = {
                    "norec": $scope.modelObat.norec
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Anda yakin akan menghapus data obat yang dipilih?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('emr/delete-rekonsiliasi-detail-pasien/delete', item).then(function (e) {
                        loadObat()
                    });
                })

            };

            $scope.hapusObatMandiri = function () {
                debugger
                if ($scope.modelObatMandiri == null || $scope.modelObatMandiri == 'undefined') {
                    toastr.error("Pilih data obat mandiri yang akan dihapus");
                    return;
                }

                var item = {
                    "norec": $scope.modelObatMandiri.norec
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Anda yakin akan menghapus data obat mandiri yang dipilih?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('emr/delete-rekonsiliasi-detail-mandiri-pasien/delete', item).then(function (e) {
                        loadObatMandiri()
                    });
                })

            };


            $scope.$watch('item.obatdirawat', function (e) {
                if (e.id == '2') {
                    $scope.isObatDirawat = true
                } else {
                    $scope.isObatDirawat = false
                }
            })


            $scope.inputBaru = function () {

                if ($scope.item.tglpengkajian == undefined || $scope.item.tglpengkajian == null || $scope.item.tglpengkajian == "") {
                    toastr.error("Masukkan tanggal pengkajian");
                    return;
                }
                if ($scope.item.pasien == undefined || $scope.item.pasien == null || $scope.item.pasien == "") {
                    toastr.error("Pasien harus diisi");
                    return;
                }

                $scope.item.obatobat = ""
                $scope.item.obatdosis = ""
                $scope.item.waktupemberian = ""
                $scope.item.tindaklanjut = ""
                $scope.item.pemberiaturanpakai = ""
                $scope.item.sumberobat = ""
                $scope.popUpTambah.center().open()
            }

            $scope.inputBaruMandiri = function () {

                if ($scope.item.tglpengkajian == undefined || $scope.item.tglpengkajian == null || $scope.item.tglpengkajian == "") {
                    toastr.error("Masukkan tanggal pengkajian");
                    return;
                }
                if ($scope.item.pasien == undefined || $scope.item.pasien == null || $scope.item.pasien == "") {
                    toastr.error("Pasien harus diisi");
                    return;
                }

                $scope.item.obatobatmandiri = ""
                $scope.item.obatdosismandiri = ""
                $scope.item.waktupemberianmandiri = ""
                $scope.hari1 = false
                $scope.hari2 = false
                $scope.hari3 = false
                $scope.hari4 = false
                $scope.hari5 = false
                $scope.hari6 = false
                $scope.hari7 = false
                $scope.hari8 = false
                $scope.popUpTambahMandiri.center().open()
            }

            $scope.tutupObat = function () {
                $scope.popUpTambah.close()
            }
            $scope.tutupObatMandiri = function () {
                $scope.popUpTambahMandiri.close()
            }

            function clear() {
                $scope.item = {}

            }

            var data2 = []
            $scope.tambah = function () {
                var nomor = 0
                if ($scope.dataGridR == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var rke = 0
                if ($scope.dataGridR == undefined) {
                    rke = 1
                } else {
                    rke = data2.length + 1
                }


                if ($scope.item.namaPaket == undefined || $scope.item.namaPaket == null || $scope.item.namaPaket == "") {
                    alert("Masukkan Nama Paket terlebih dahulu!!")
                    return;
                }
                if ($scope.item.jeniskemasan == undefined) {
                    alert("Jenis Kemasan Wajib Diisi!!")
                    return;
                }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.aturanpakai == undefined) {
                    alert("Aturan Pakai Wajib Diisi!!")
                    return;
                }
                // debugger
                if ($scope.item.qty == undefined || $scope.item.qty == null || $scope.item.qty == "") {
                    alert("Qty Obat Wajib Diisi!!")
                    return;
                }

                var keterangan = null;
                if ($scope.item.KeteranganPakai != undefined) {
                    keterangan = $scope.item.KeteranganPakai;
                }
                // debugger
                var jumlah = null;
                if ($scope.item.jumlah != undefined) {
                    jumlah = $scope.item.jumlah;
                }

                var dosis = null;
                if ($scope.item.dosis != undefined) {
                    dosis = $scope.item.dosis;
                }

                var kekuatan = null;
                if ($scope.item.kekuatan != undefined) {
                    kekuatan = $scope.item.kekuatan;
                }

                $scope.disabledRuangan = true;
                var data = {};
                // debugger
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.aturanpakaifk = $scope.item.aturanpakai.id
                            data.aturanpakai = $scope.item.aturanpakai.name
                            data.routefk = $scope.item.route.id
                            data.route = $scope.item.route.name
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.qty = $scope.item.qty
                            data.rke = rke
                            data.jeniskemasan = $scope.item.jeniskemasan.jeniskemasan
                            data.jeniskemasanfk = $scope.item.jeniskemasan.id
                            data.keterangan = $scope.item.waktuminum.waktuminum
                            data.jumlah = jumlah
                            data.dosis = dosis
                            data.kekuatan = kekuatan
                            data2[i] = data;
                            $scope.dataGridR = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        aturanpakaifk: $scope.item.aturanpakai.id,
                        aturanpakai: $scope.item.aturanpakai.name,
                        routefk: $scope.item.route.id,
                        route: $scope.item.route.name,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        qty: $scope.item.qty,
                        rke: rke,
                        jeniskemasan: $scope.item.jeniskemasan.jeniskemasan,
                        jeniskemasanfk: $scope.item.jeniskemasan.id,
                        keterangan: $scope.item.waktuminum.waktuminum,
                        waktuminumfk: $scope.item.waktuminum.id,
                        jumlah: jumlah,
                        dosis: dosis,
                        kekuatan: kekuatan
                    }
                    data2.push(data)
                    $scope.dataGridR = new kendo.data.DataSource({
                        data: data2
                    });
                    Kosongkan()
                }
            }


            $scope.hapusGrid = function () {

                if ($scope.modelGrid == null || $scope.modelGrid == 'undefined') {
                    toastr.error("Pilih data yang akan dihapus");
                    return;
                }

                var item = {
                    "norec": $scope.modelGrid.norec
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Peringatan, Anda yakin akan menghapus pengkajian yang dipilih?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('emr/delete-rekonsiliasi-pasien/delete', item).then(function (e) {
                        clear()
                        init();
                        loadRekonsialisasi()
                    });
                })

            }


            $scope.cetakjs = function () {

                if ($scope.modelGrid == null || $scope.modelGrid == 'undefined') {
                    toastr.error("Pilih data yang akan dicetak");
                    return;
                }

                var item = {
                    "norec": $scope.modelGrid.norec
                }


            }


            $scope.editGrid = function () {
                debugger
                $scope.norecmeso = ""
                $scope.isTambah = 2;
                $scope.item.obj = []
                if ($scope.modelGrid == null || $scope.modelGrid == 'undefined') {
                    toastr.error("Pilih data yang akan diedit");
                    return;
                }

                var norec = $scope.modelGrid.norec

                medifirstService.get('emr/get-edit-rekonsiliasi-pasien?norec=' + norec).then(function (dat) {
                    console.log(dat.data)
                    $scope.item.tglpengkajian = dat.data[0].tglpengkajian

                    if (dat.data[0].pasien == 1) $scope.item.pasien = { id: '1', nama: 'PASIEN BARU' }
                    else if (dat.data[0].pasien == 2) $scope.item.pasien = { id: '2', nama: 'ANTAR RUANGAN' }
                    else $scope.item.pasien = { id: '3', nama: 'PASIEN PULANG' }

                    $scope.item.ruanganasal = { id: dat.data[0].ruanganasalfk, nama: dat.data[0].ruanganasal }
                    $scope.item.ruanganbaru = { id: dat.data[0].ruanganbarufk, nama: dat.data[0].ruanganbaru }

                    $scope.item.tglmasuk = dat.data[0].tglmasuk

                    if (dat.data[0].riwayatalergi == 1) $scope.item.riwayatalergi = { id: '1', nama: 'TIDAK MEMILIKI RIWAYAT ALERGI OBAT' }
                    else if (dat.data[0].riwayatalergi == 2) $scope.item.riwayatalergi = { id: '2', nama: 'YA' }

                    if (dat.data[0].obatsebelumdirawat == 1) $scope.item.obatdirawat = { id: '1', nama: 'TIDAK MENGGUNAKAN OBAT SEBELUM DIRAWAT' }
                    else if (dat.data[0].obatsebelumdirawat == 2) $scope.item.obatdirawat = { id: '2', nama: 'YA' }


                    if (dat.data[0].obatdarirumah == 1) $scope.item.bawaobat = { id: '1', nama: 'YA' }
                    else if (dat.data[0].obatdarirumah == 2) $scope.item.bawaobat = { id: '2', nama: 'TIDAK' }


                    if (dat.data[0].obatlayak == 1) $scope.item.obatlayak = { id: '1', nama: 'YA' }
                    else if (dat.data[0].obatlayak == 2) $scope.item.obatlayak = { id: '2', nama: 'TIDAK' }


                    $scope.item.rekomendasidpjp = dat.data[0].rekomendasidpjp
                    $scope.item.edukasiapoteker = dat.data[0].edukasiapoteker
                    $scope.item.apoteker = { id: dat.data[0].apotekerfk, nama: dat.data[0].apoteker }
                    $scope.item.dokter = { id: dat.data[0].dokterfk, nama: dat.data[0].dokter }
                    if (dat.data[0].pasien == 1) {
                        $scope.isEditPB = true
                    } else if (dat.data[0].pasien == 2) {
                        $scope.isEditAR = true
                    } else {
                        $scope.isEditPP = true
                    }
                })

                loadObat()
                loadObatMandiri()
                loadQr()

                $scope.isGrid = false
                $scope.isButtonTambah = false
                $scope.isButtonEdit = true
            }

            function loadQr() {
                if ($scope.item.apoteker) {
                    medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent($scope.item.apoteker.nama))
                        .then(function (et) {
                            $scope.item.qr = et.data.data;
                        })
                        .catch(function (error) {
                            console.error("QR Error:", error);
                        });
                }
                if ($scope.item.dokter) {
                    medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent($scope.item.dokter.nama))
                        .then(function (et) {
                            $scope.item.qr2 = et.data.data;
                        })
                        .catch(function (error) {
                            console.error("QR Error:", error);
                        });
                }
            }

            $scope.simpanObat = function () {
                $scope.norec = ""
                let obatobat = ""
                let obatdosis = ""
                let waktupemberian = ""
                let tindaklanjutfk = ""
                let tindaklanjut = ""
                let pemberiaturanpakai = ""
                let sumberobat = ""

                if ($scope.item.obatobat != undefined) {
                    obatobat = $scope.item.obatobat
                }
                if ($scope.item.obatdosis != undefined) {
                    obatdosis = $scope.item.obatdosis
                }
                if ($scope.item.waktupemberian != undefined) {
                    waktupemberian = moment($scope.item.waktupemberian).format('YYYY-MM-DD HH:mm')
                }
                if ($scope.item.tindaklanjut != undefined) {
                    tindaklanjutfk = $scope.item.tindaklanjut.id
                    tindaklanjut = $scope.item.tindaklanjut.nama
                }
                if ($scope.item.pemberiaturanpakai != undefined) {
                    pemberiaturanpakai = $scope.item.pemberiaturanpakai
                }
                if ($scope.item.sumberobat != undefined) {
                    sumberobat = $scope.item.sumberobat
                }
                if ($scope.isTambah == 2) {
                    if ($scope.modelGrid.norec != undefined) $scope.norec = $scope.modelGrid.norec
                    else if ($scope.norecmeso != undefined) $scope.norec = $scope.norecmeso
                } else {
                    let tglpengkajian = ''
                    let tglmasuk = ''
                    let pasien = 0
                    let ruanganasalfk = 0
                    let ruanganbarufk = 0
                    let ruanganasal = ''
                    let ruanganbaru = ''
                    let riwayatalergi = 0
                    let obatdirawat = 0
                    let bawaobat = 0
                    let obatlayak = 0
                    let rekomendasidpjp = ""
                    let edukasiapoteker = ""
                    let apotekerfk = 0
                    let apoteker = ''

                    if ($scope.item.tglpengkajian != undefined) {
                        tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD HH:mm')
                    }
                    if ($scope.item.tglmasuk != undefined) {
                        tglmasuk = moment($scope.item.tglmasuk).format('YYYY-MM-DD HH:mm')
                    }
                    if ($scope.item.pasien != undefined) {
                        pasien = $scope.item.pasien.id
                    }
                    if ($scope.item.ruanganasal != undefined) {
                        ruanganasalfk = $scope.item.ruanganasal.id
                        ruanganasal = $scope.item.ruanganasal.nama
                    }
                    if ($scope.item.ruanganbaru != undefined) {
                        ruanganbarufk = $scope.item.ruanganbaru.id
                        ruanganbaru = $scope.item.ruanganbaru.nama
                    }
                    if ($scope.item.riwayatalergi != undefined) {
                        riwayatalergi = $scope.item.riwayatalergi.id
                    }

                    if ($scope.item.obatdirawat != undefined) {
                        obatdirawat = $scope.item.obatdirawat.id
                    }
                    if ($scope.item.bawaobat != undefined) {
                        bawaobat = $scope.item.bawaobat.id
                    }
                    if ($scope.item.obatlayak != undefined) {
                        obatlayak = $scope.item.obatlayak.id
                    }
                    if ($scope.item.rekomendasidpjp != undefined) {
                        rekomendasidpjp = $scope.item.rekomendasidpjp
                    }
                    if ($scope.item.edukasiapoteker != undefined) {
                        edukasiapoteker = $scope.item.edukasiapoteker
                    }
                    if ($scope.item.apoteker != undefined) {
                        apotekerfk = $scope.item.apoteker.id
                        apoteker = $scope.item.apoteker.nama
                    }
                    let objSave = {
                        tglpengkajian: tglpengkajian,
                        tglmasuk: tglmasuk,
                        pasien: pasien,
                        ruanganasalfk: ruanganasalfk,
                        ruanganbarufk: ruanganbarufk,
                        ruanganasal: ruanganasal,
                        ruanganbaru: ruanganbaru,
                        riwayatalergi: riwayatalergi,
                        obatdirawat: obatdirawat,
                        bawaobat: bawaobat,
                        obatlayak: obatlayak,
                        rekomendasidpjp: rekomendasidpjp,
                        edukasiapoteker: edukasiapoteker,
                        apotekerfk: apotekerfk,
                        apoteker: apoteker,
                        noregistrasifk: $scope.norecPd
                    }
                    medifirstService.post('emr/save-rekonsiliasi-pasien', objSave).then(function (e) {
                        if (e.status == 201) {
                            $scope.norecmeso = e.data.nilainorec;
                            var norecObatAfterSave = e.data.nilainorec
                            let objSavex = {
                                norec: e.data.nilainorec,
                                obatobat: obatobat,
                                obatdosis: obatdosis,
                                waktupemberian: waktupemberian,
                                tindaklanjutfk: tindaklanjutfk,
                                tindaklanjut: tindaklanjut,
                                pemberiaturanpakai: pemberiaturanpakai,
                                sumberobat: sumberobat
                            }
                            medifirstService.post('emr/save-rekonsiliasi-obat-pasien', objSavex).then(function (ex) {
                                if (ex.status == 201) {
                                    loadObatAfter(norecObatAfterSave)
                                    $scope.isTambah = 2
                                    $scope.isButtonTambah = false
                                    $scope.isButtonEdit = true
                                    $scope.popUpTambah.close()
                                }
                            })

                        }
                    })
                    $scope.norec = $scope.norecmeso
                    //-----------------------------------------------
                }

                if ($scope.isTambah == 2) {
                    if ($scope.norec != undefined || $scope.norec != null || $scope.norec != "") {
                        let objSave = {
                            norec: $scope.norec,
                            obatobat: obatobat,
                            obatdosis: obatdosis,
                            waktupemberian: waktupemberian,
                            tindaklanjutfk: tindaklanjutfk,
                            tindaklanjut: tindaklanjut,
                            pemberiaturanpakai: pemberiaturanpakai,
                            sumberobat: sumberobat
                        }
                        medifirstService.post('emr/save-rekonsiliasi-obat-pasien', objSave).then(function (e) {
                            if (e.status == 201) {
                                $scope.popUpTambah.close()
                                $scope.isTambah = 2
                                loadObat()
                            }
                        })
                    }
                }
            }

            $scope.simpanObatMandiri = function () {
                $scope.isRouteLoading = true;
                $scope.norec = ""
                let obatobatmandiri = ""
                let obatdosismandiri = ""
                let waktupemberianmandiri = ""
                let hari1 = false
                let hari2 = false
                let hari3 = false
                let hari4 = false
                let hari5 = false
                let hari6 = false
                let hari7 = false
                let hari8 = false

                if ($scope.item.obatobatmandiri != undefined) {
                    obatobatmandiri = $scope.item.obatobatmandiri
                }
                if ($scope.item.obatdosismandiri != undefined) {
                    obatdosismandiri = $scope.item.obatdosismandiri
                }
                if ($scope.item.waktupemberianmandiri != undefined) {
                    waktupemberianmandiri = moment($scope.item.waktupemberianmandiri).format('YYYY-MM-DD HH:mm')
                }
                if ($scope.item.hari1 == '1') {
                    hari1 = true
                }
                if ($scope.item.hari2 == '1') {
                    hari2 = true
                }
                if ($scope.item.hari3 == '1') {
                    hari3 = true
                }
                if ($scope.item.hari4 == '1') {
                    hari4 = true
                }
                if ($scope.item.hari5 == '1') {
                    hari5 = true
                }
                if ($scope.item.hari6 == '1') {
                    hari6 = true
                }
                if ($scope.item.hari7 == '1') {
                    hari7 = true
                }
                if ($scope.item.hari8 == '1') {
                    hari8 = true
                }

                if ($scope.isTambah == 2) {
                    if ($scope.modelGrid.norec != undefined) $scope.norec = $scope.modelGrid.norec
                    else if ($scope.norecmeso != undefined) $scope.norec = $scope.norecmeso
                } else {
                    //-----------------------------------------------
                    let tglpengkajian = ''
                    let tglmasuk = ''
                    let pasien = 0
                    let ruanganasalfk = 0
                    let ruanganbarufk = 0
                    let ruanganasal = ''
                    let ruanganbaru = ''
                    let riwayatalergi = 0
                    let obatdirawat = 0
                    let bawaobat = 0
                    let obatlayak = 0
                    let rekomendasidpjp = ""
                    let edukasiapoteker = ""
                    let apotekerfk = 0
                    let apoteker = ''

                    if ($scope.item.tglpengkajian != undefined) {
                        tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD HH:mm')
                    }
                    if ($scope.item.tglmasuk != undefined) {
                        tglmasuk = moment($scope.item.tglmasuk).format('YYYY-MM-DD HH:mm')
                    }
                    if ($scope.item.pasien != undefined) {
                        pasien = $scope.item.pasien.id
                    }
                    if ($scope.item.ruanganasal != undefined) {
                        ruanganasalfk = $scope.item.ruanganasal.id
                        ruanganasal = $scope.item.ruanganasal.nama
                    }
                    if ($scope.item.ruanganbaru != undefined) {
                        ruanganbarufk = $scope.item.ruanganbaru.id
                        ruanganbaru = $scope.item.ruanganbaru.nama
                    }
                    if ($scope.item.riwayatalergi != undefined) {
                        riwayatalergi = $scope.item.riwayatalergi.id
                    }

                    if ($scope.item.obatdirawat != undefined) {
                        obatdirawat = $scope.item.obatdirawat.id
                    }
                    if ($scope.item.bawaobat != undefined) {
                        bawaobat = $scope.item.bawaobat.id
                    }
                    if ($scope.item.obatlayak != undefined) {
                        obatlayak = $scope.item.obatlayak.id
                    }
                    if ($scope.item.rekomendasidpjp != undefined) {
                        rekomendasidpjp = $scope.item.rekomendasidpjp
                    }
                    if ($scope.item.edukasiapoteker != undefined) {
                        edukasiapoteker = $scope.item.edukasiapoteker
                    }
                    if ($scope.item.apoteker != undefined) {
                        apotekerfk = $scope.item.apoteker.id
                        apoteker = $scope.item.apoteker.nama
                    }
                    let objSave = {
                        tglpengkajian: tglpengkajian,
                        tglmasuk: tglmasuk,
                        pasien: pasien,
                        ruanganasalfk: ruanganasalfk,
                        ruanganbarufk: ruanganbarufk,
                        ruanganasal: ruanganasal,
                        ruanganbaru: ruanganbaru,
                        riwayatalergi: riwayatalergi,
                        obatdirawat: obatdirawat,
                        bawaobat: bawaobat,
                        obatlayak: obatlayak,
                        rekomendasidpjp: rekomendasidpjp,
                        edukasiapoteker: edukasiapoteker,
                        apotekerfk: apotekerfk,
                        apoteker: apoteker,
                        noregistrasifk: $scope.norecPd
                    }
                    medifirstService.post('emr/save-rekonsiliasi-pasien', objSave).then(function (e) {
                        if (e.status == 201) {
                            $scope.norecmeso = e.data.nilainorec;

                            var norecAfterSave = e.data.nilainorec
                            let objSavex = {
                                norec: e.data.nilainorec,
                                obatobatmandiri: obatobatmandiri,
                                obatdosismandiri: obatdosismandiri,
                                waktupemberianmandiri: waktupemberianmandiri,
                                hari1: hari1,
                                hari2: hari2,
                                hari3: hari3,
                                hari4: hari4,
                                hari5: hari5,
                                hari6: hari6,
                                hari7: hari7,
                                hari8: hari8
                            }
                            medifirstService.post('emr/save-rekonsiliasi-obat-mandiri-pasien', objSavex).then(function (ex) {
                                if (ex.status == 201) {
                                    $scope.isTambah = 2
                                    $scope.isButtonTambah = false
                                    $scope.isButtonEdit = true
                                    $scope.popUpTambahMandiri.close()
                                }
                                loadObatMandiriAfter(norecAfterSave)
                                $scope.isRouteLoading = false;
                            });
                        }
                    });
                    $scope.norec = $scope.norecmeso
                    //-----------------------------------------------
                }

                if ($scope.isTambah == 2) {
                    if ($scope.norec != undefined || $scope.norec != null || $scope.norec != "") {
                        let objSave = {
                            norec: $scope.norec,
                            obatobatmandiri: obatobatmandiri,
                            obatdosismandiri: obatdosismandiri,
                            waktupemberianmandiri: waktupemberianmandiri,
                            hari1: hari1,
                            hari2: hari2,
                            hari3: hari3,
                            hari4: hari4,
                            hari5: hari5,
                            hari6: hari6,
                            hari7: hari7,
                            hari8: hari8
                        }
                        medifirstService.post('emr/save-rekonsiliasi-obat-mandiri-pasien', objSave).then(function (e) {
                            if (e.status == 201) {
                                $scope.popUpTambahMandiri.close()
                                $scope.isTambah = 2
                            }
                        }).then(function () {
                            loadObatMandiri()
                        })
                    }
                }
            }

            function loadObatMandiriAfter(norecSave) {
                //if($scope.modelGrid!=undefined || $scope.modelGrid!=null ) {
                var norec = ""
                if ($scope.modelGrid != undefined || $scope.modelGrid != "") var norec = $scope.modelGrid.norec
                else if ($scope.norecmeso != undefined || $scope.norecmeso != "") var norec = $scope.norecmeso

                if (norecSave != undefined || norecSave != "" || norecSave != null) {
                    medifirstService.get('emr/get-rekonsiliasi-obat-mandiri-pasien?norec=' + norecSave).then(function (dat) {
                        console.log("Yang Bener")
                        for (let i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataGridObatMandiri = new kendo.data.DataSource({
                            data: dat.data,
                            length: dat.data.length,
                            pageSize: 20
                        });
                    })
                } else {
                    $scope.dataGridObatMandiri = new kendo.data.DataSource({
                        data: "",
                        length: 0,
                        pageSize: 20
                    });

                }
                //}
            }

            $scope.simpanRekonsiliasi = function () {
                let tglpengkajian = ''
                let tglmasuk = ''
                let pasien = 0
                let ruanganasalfk = 0
                let ruanganbarufk = 0
                let ruanganasal = ''
                let ruanganbaru = ''
                let riwayatalergi = 0
                let obatdirawat = 0
                let bawaobat = 0
                let obatlayak = 0
                let rekomendasidpjp = ""
                let edukasiapoteker = ""
                let apotekerfk = 0
                let apoteker = ''
                let dokterfk = 0
                let dokter = ''
                if ($scope.item.tglpengkajian != undefined) {
                    tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD HH:mm')
                }
                if ($scope.item.tglmasuk != undefined) {
                    tglmasuk = moment($scope.item.tglmasuk).format('YYYY-MM-DD HH:mm')
                }
                if ($scope.item.pasien != undefined) {
                    pasien = $scope.item.pasien.id
                }
                if ($scope.item.ruanganasal != undefined) {
                    ruanganasalfk = $scope.item.ruanganasal.id
                    ruanganasal = $scope.item.ruanganasal.nama
                }
                if ($scope.item.ruanganbaru != undefined) {
                    ruanganbarufk = $scope.item.ruanganbaru.id
                    ruanganbaru = $scope.item.ruanganbaru.nama
                }
                if ($scope.item.riwayatalergi != undefined) {
                    riwayatalergi = $scope.item.riwayatalergi.id
                }

                if ($scope.item.obatdirawat != undefined) {
                    obatdirawat = $scope.item.obatdirawat.id
                }
                if ($scope.item.bawaobat != undefined) {
                    bawaobat = $scope.item.bawaobat.id
                }
                if ($scope.item.obatlayak != undefined) {
                    obatlayak = $scope.item.obatlayak.id
                }
                if ($scope.item.rekomendasidpjp != undefined) {
                    rekomendasidpjp = $scope.item.rekomendasidpjp
                }
                if ($scope.item.edukasiapoteker != undefined) {
                    edukasiapoteker = $scope.item.edukasiapoteker
                }
                if ($scope.item.apoteker != undefined) {
                    apotekerfk = $scope.item.apoteker.id
                    apoteker = $scope.item.apoteker.nama
                }
                if ($scope.item.dokter != undefined) {
                    dokterfk = $scope.item.dokter.id
                    dokter = $scope.item.dokter.nama
                }
                let objSave = {
                    tglpengkajian: tglpengkajian,
                    tglmasuk: tglmasuk,
                    pasien: pasien,
                    ruanganasalfk: ruanganasalfk,
                    ruanganbarufk: ruanganbarufk,
                    ruanganasal: ruanganasal,
                    ruanganbaru: ruanganbaru,
                    riwayatalergi: riwayatalergi,
                    obatdirawat: obatdirawat,
                    bawaobat: bawaobat,
                    obatlayak: obatlayak,
                    rekomendasidpjp: rekomendasidpjp,
                    edukasiapoteker: edukasiapoteker,
                    apotekerfk: apotekerfk,
                    apoteker: apoteker,
                    dokterfk: dokterfk,
                    dokter: dokter,
                    noregistrasifk: $scope.norecPd
                }
                medifirstService.post('emr/save-rekonsiliasi-pasien', objSave).then(function (e) {
                    if (e.status == 201) {
                        $scope.isEditPB = false
                        $scope.isEditAR = false
                        $scope.isEditPP = false
                        $scope.isGrid = true
                        loadRekonsialisasi()
                        init();
                        loadQr()
                    }
                })
            }


            $scope.simpanMesoTambah = function () {
                let tglpengkajian = ''
                let eso = 0
                let penyakitutama = ''
                let kondisi = ''
                let jeniskelamin = 0
                let hamil = 0
                let gangguanginjal = false
                let gangguanhati = false
                let alergi = false
                let kondisimedis = false
                let factorindustri = false
                let kimia = false
                let tgleso = ''
                let bentukeso = ''
                let tindakaneso = ''
                let reaksieso = 0
                let asalruangan = 0
                let apoteker = 0
                debugger
                if ($scope.item.tglpengkajian != undefined) {
                    tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD hh:mm')
                }
                if ($scope.item.obj[411000] != undefined) {
                    eso = $scope.item.obj[411000].id
                }
                if ($scope.item.obj[411001] != undefined) {
                    penyakitutama = $scope.item.obj[411001]
                }
                if ($scope.item.obj[411002] != undefined) {
                    kondisi = $scope.item.obj[411001].id
                }
                if ($scope.item.obj[411003] != undefined) {
                    jeniskelamin = $scope.item.obj[411003].id
                }
                if ($scope.item.obj[411004] != undefined) {
                    hamil = $scope.item.obj[411004].id
                }
                if ($scope.item.obj[411005] != undefined) {
                    gangguanginjal = $scope.item.obj[411005]
                }
                if ($scope.item.obj[411006] != undefined) {
                    gangguanhati = $scope.item.obj[411006]
                }
                if ($scope.item.obj[411007] != undefined) {
                    alergi = $scope.item.obj[411007]
                }
                if ($scope.item.obj[411008] != undefined) {
                    kondisimedis = $scope.item.obj[411008]
                }
                if ($scope.item.obj[411009] != undefined) {
                    factorindustri = $scope.item.obj[411009]
                }
                if ($scope.item.obj[411010] != undefined) {
                    kimia = $scope.item.obj[411010]
                }
                if ($scope.item.obj[411011] != undefined) {
                    tgleso = moment($scope.item.obj[411011]).format('YYYY-MM-DD hh:mm')
                }
                if ($scope.item.obj[411012] != undefined) {
                    bentukeso = $scope.item.obj[411012]
                }
                if ($scope.item.obj[411013] != undefined) {
                    tindakaneso = $scope.item.obj[411013]
                }

                if ($scope.item.obj[411014] != undefined) {
                    reaksieso = $scope.item.obj[411014].id
                }
                if ($scope.item.obj[411015] != undefined) {
                    asalruangan = $scope.item.obj[411015].id
                }
                if ($scope.item.obj[411016] != undefined) {
                    apoteker = $scope.item.obj[411016].id
                }
                let objSave = {
                    tglpengkajian: tglpengkajian,
                    eso: eso,
                    penyakitutama: penyakitutama,
                    kondisi: kondisi,
                    jeniskelamin: jeniskelamin,
                    hamil: hamil,
                    gangguanginjal: gangguanginjal,
                    gangguanhati: gangguanhati,
                    alergi: alergi,
                    kondisimedis: kondisimedis,
                    factorindustri: factorindustri,
                    kimia: kimia,
                    tgleso: tgleso,
                    bentukeso: bentukeso,
                    tindakaneso: tindakaneso,
                    reaksieso: reaksieso,
                    asalruangan: asalruangan,
                    apoteker: apoteker,
                    noregistrasifk: $scope.norecPd
                }
                medifirstService.post('emr/save-meso-pasien', objSave).then(function (e) {
                    if (e.status == 201) {
                        $scope.norecmeso = e.nilainorec;
                    }
                })
            }


            $scope.UpdateRekonsiliasi = function () {

                let tglpengkajian = ''
                let tglmasuk = ''
                let pasien = 0
                let ruanganasalfk = 0
                let ruanganbarufk = 0
                let ruanganasal = ''
                let ruanganbaru = ''
                let riwayatalergi = 0
                let obatdirawat = 0
                let bawaobat = 0
                let obatlayak = 0
                let rekomendasidpjp = ""
                let edukasiapoteker = ""
                let apotekerfk = 0
                let apoteker = ''
                let dokterfk = 0
                let dokter = ''
                debugger
                if ($scope.item.tglpengkajian != undefined) {
                    tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD HH:mm')
                }
                if ($scope.item.tglmasuk != undefined) {
                    tglmasuk = moment($scope.item.tglmasuk).format('YYYY-MM-DD HH:mm')
                }
                if ($scope.item.pasien != undefined) {
                    pasien = $scope.item.pasien.id
                }
                if ($scope.item.ruanganasal != undefined) {
                    ruanganasalfk = $scope.item.ruanganasal.id
                    ruanganasal = $scope.item.ruanganasal.nama
                }
                if ($scope.item.ruanganbaru != undefined) {
                    ruanganbarufk = $scope.item.ruanganbaru.id
                    ruanganbaru = $scope.item.ruanganbaru.nama
                }
                if ($scope.item.riwayatalergi != undefined) {
                    riwayatalergi = $scope.item.riwayatalergi.id
                }

                if ($scope.item.obatdirawat != undefined) {
                    obatdirawat = $scope.item.obatdirawat.id
                }
                if ($scope.item.bawaobat != undefined) {
                    bawaobat = $scope.item.bawaobat.id
                }
                if ($scope.item.obatlayak != undefined) {
                    obatlayak = $scope.item.obatlayak.id
                }
                if ($scope.item.rekomendasidpjp != undefined) {
                    rekomendasidpjp = $scope.item.rekomendasidpjp
                }
                if ($scope.item.edukasiapoteker != undefined) {
                    edukasiapoteker = $scope.item.edukasiapoteker
                }
                if ($scope.item.apoteker != undefined) {
                    apotekerfk = $scope.item.apoteker.id
                    apoteker = $scope.item.apoteker.nama
                }
                if ($scope.item.dokter != undefined) {
                    dokterfk = $scope.item.dokter.id
                    dokter = $scope.item.dokter.nama
                }
                let objSave = {
                    tglpengkajian: tglpengkajian,
                    tglmasuk: tglmasuk,
                    pasien: pasien,
                    ruanganasalfk: ruanganasalfk,
                    ruanganbarufk: ruanganbarufk,
                    ruanganasal: ruanganasal,
                    ruanganbaru: ruanganbaru,
                    riwayatalergi: riwayatalergi,
                    obatdirawat: obatdirawat,
                    bawaobat: bawaobat,
                    obatlayak: obatlayak,
                    rekomendasidpjp: rekomendasidpjp,
                    edukasiapoteker: edukasiapoteker,
                    apotekerfk: apotekerfk,
                    apoteker: apoteker,
                    dokterfk: dokterfk,
                    dokter: dokter,
                    noregistrasifk: $scope.norecPd,
                    norec: $scope.norecmeso || $scope.modelGrid.norec,
                }
                medifirstService.post('emr/update-rekonsiliasi-pasien', objSave).then(function (e) {
                    if (e.status == 201) {
                        loadRekonsialisasi()
                        init();
                        loadQr()
                    }
                })
            }

            //tabel meso
            $scope.resumeOptHead = {
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tglpengkajian", title: "Tgl Pengkajian", width: 150 },
                    { field: "pasien", title: "Jenis Pasien", width: 150 },
                    { field: "ruanganasal", title: "Ruangan Asal", width: 150 },
                    { field: "ruanganbaru", title: "Ruangan Baru", width: 150 },
                    { field: "tglmasuk", title: "Tgl Masuk", width: 150 },
                    { field: "apoteker", title: "Apoteker", width: 150 }
                ],

            };

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        { field: "no", title: "No", width: 40 },
                        { field: "namaobat", title: "Nama Obat", width: 200 },
                        { field: "jumlah", title: "Jumlah", width: 120 },
                        { field: "dosis", title: "Dosis", width: 120 },
                        { field: "frekuensi", title: "Frekuensi", width: 120 },
                        { field: "carapemberian", title: "Cara Pemberian", width: 150 },
                    ]
                }
            };

            $scope.batal = function () {
                $scope.popUp.close()
            }
            init();

            $scope.showInput = function (flag) {
                if (flag == 'Pasien Baru') {
                    $scope.modelGrid = []
                    $scope.isTambah = 1;
                    $scope.iChecked1 = false;
                    $scope.iChecked2 = false;
                    $scope.iChecked3 = false;
                    $scope.iChecked4 = false;
                    $scope.iChecked5 = false;
                    $scope.iChecked6 = false;
                    $scope.item = {}
                    $scope.item.obj = []
                    $scope.item.pasien = { id: 1, nama: 'PASIEN BARU' }
                    $scope.now = new Date();
                    $scope.item.tglpengkajian = $scope.now
                    $scope.item.tglmasuk = $scope.now
                    // $scope.item.apoteker = { id: $scope.objectpegawaifk, nama: $scope.namadokter }
                    $scope.item.ruanganasal = { id: $scope.objectruanganfk, nama: $scope.namaruangan }
                    noregistrasi = $scope.noregistrasi
                    loadObat()
                    loadObatMandiri()
                    $scope.isEditPB = true
                    $scope.isGrid = false
                    $scope.isButtonTambah = true
                    $scope.isButtonEdit = false
                } else if (flag == 'Antar Ruangan') {
                    $scope.modelGrid = []
                    $scope.isTambah = 1;
                    $scope.iChecked1 = false;
                    $scope.iChecked2 = false;
                    $scope.iChecked3 = false;
                    $scope.iChecked4 = false;
                    $scope.iChecked5 = false;
                    $scope.iChecked6 = false;
                    $scope.item = {}
                    $scope.item.obj = []
                    $scope.item.pasien = { id: 2, nama: 'ANTAR RUANGAN' }
                    $scope.now = new Date();
                    $scope.item.tglpengkajian = $scope.now
                    $scope.item.tglmasuk = $scope.now
                    // $scope.item.apoteker = { id: $scope.objectpegawaifk, nama: $scope.namadokter }
                    $scope.item.ruanganasal = { id: $scope.objectruanganfk, nama: $scope.namaruangan }
                    noregistrasi = $scope.noregistrasi
                    loadObat()
                    loadObatMandiri()
                    $scope.isEditAR = true
                    $scope.isGrid = false
                    $scope.isButtonTambah = true
                    $scope.isButtonEdit = false
                } else {
                    $scope.modelGrid = []
                    $scope.isTambah = 1;
                    $scope.iChecked1 = false;
                    $scope.iChecked2 = false;
                    $scope.iChecked3 = false;
                    $scope.iChecked4 = false;
                    $scope.iChecked5 = false;
                    $scope.iChecked6 = false;
                    $scope.item = {}
                    $scope.item.obj = []
                    $scope.item.pasien = { id: 3, nama: 'PASIEN PULANG' }
                    $scope.now = new Date();
                    $scope.item.tglpengkajian = $scope.now
                    $scope.item.tglmasuk = $scope.now
                    // $scope.item.apoteker = { id: $scope.objectpegawaifk, nama: $scope.namadokter }
                    $scope.item.ruanganasal = { id: $scope.objectruanganfk, nama: $scope.namaruangan }
                    noregistrasi = $scope.noregistrasi
                    loadObat()
                    loadObatMandiri()
                    $scope.isEditPP = true
                    $scope.isGrid = false
                    $scope.isButtonTambah = true
                    $scope.isButtonEdit = false
                }
            }

            $scope.Back = function () {
                $scope.isEditPB = false
                $scope.isEditAR = false
                $scope.isEditPP = false
                $scope.isGrid = true
                init()
                loadRekonsialisasi()
            }






            function init() {
                debugger
                //$scope.isEdit = false
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo-meso").then(function (e) {
                    $scope.listDokter = e.data.dokter
                    $scope.listDokterAsli = e.data.dokterAsli
                    $scope.listRuanganAsal = e.data.ruangan
                    $scope.listRuanganBaru = e.data.ruangan
                    $scope.listobatobat = e.data.dataProduk
                })

            };




            $scope.kembali = function () {
                debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.norecAPD,
                    emr: 'LaporanOperasi',
                });
            }



            function kosongkan() {
                delete $scope.item.no
                delete $scope.item.namaobat
                delete $scope.item.jumlah
                delete $scope.item.dosis
                delete $scope.item.frekuensi
                delete $scope.item.carapemberian
            }

            $scope.formatHariKe1 = function (hari1) {
                if (hari1 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

            $scope.formatHariKe2 = function (hari2) {
                if (hari2 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

            $scope.formatHariKe3 = function (hari3) {
                if (hari3 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

            $scope.formatHariKe4 = function (hari4) {
                if (hari4 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

            $scope.formatHariKe5 = function (hari5) {
                if (hari5 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

            $scope.formatHariKe6 = function (hari6) {
                if (hari6 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

            $scope.formatHariKe7 = function (hari7) {
                if (hari7 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

            $scope.formatHariKe8 = function (hari8) {
                if (hari8 == 1) {
                    return "Iya";
                }
                return "Tidak";
            };

        }
    ]);
});