define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('ResumeRICtrl', ['$q', '$scope', 'ModelItem', '$state', 'MedifirstService', '$timeout', 'CacheHelper', '$rootScope',
        function ($q, $scope, ModelItem, $state, medifirstService, $timeout, cacheHelper, $rootScope) {
            $scope.isRouteLoading = false;
            $scope.now = new Date()
            $scope.item = {
                tglresume: $scope.now
            } // set defined object
            $scope.isGrid = true
            $scope.isNext = true
            var noregistrasi = '';
            $scope.item.norec_pp = '';
            // $qrcodedokter = ''
            $scope.statusSelesaiPeriksaPp = false
            $scope.istempatLaporan = true
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            var data2 = []
            var datalabstat = []
            var datalab = []
            var datalabs = []
            var dataRow = {}
            var umurDay = '';
            var tglpelayanan = ''
            var norecAPD = ''
            var norecPP = ''
            var tglhasil = ''
            var tglcetak = ''
            var ruangan = ''
            var ruanganasal = ''
            var dokterpemeriksa = ''
            var dokterpengirim = ''
            var popc = true;
            $scope.norecAPD = $state.params.noRec
            $scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))
            var cookie = document.cookie.split(';')
            var kelompokUser = cookie[0].split('=')
            var getCache = cacheHelper.get('cacheRekamMedis')
            if (getCache != undefined) {
                $scope.nocm = getCache[0]
                $scope.noregistrasi = getCache[3]
                $scope.norecPd = getCache[8]
                $scope.tglregistrasi = getCache[6]
                $scope.objectpegawaifk = getCache[17]
                $scope.namadokter = getCache[16]
                if (!$scope.norecAPD)
                    $scope.norecAPD = getCache[7]
                $scope.item.namaruangan = getCache[12]
            }
            $scope.item.pemeriksaanPenunjangLab = '';

            function loadRmPp(norec_pp) {
                medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
                    $scope.statusSelesaiPeriksaRm = rmpp.data.isrm;
                });
            }

            function loadClaimPp(norec_pp) {
                medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
                    $scope.statusSelesaiPeriksaPp = rmpp.data.isrm;
                });
            }
            $scope.loadClaimPpLuar = function (dataItem) {
                // function loadClaimPpLuar(dataItem) {
                // var noregistrasi = dataItem.noregistrasi
                var norec_pp = dataItem.norec_pp;
                var noregistrasifk = dataItem.norec_pd;
                var noregistrasi = dataItem.noregistrasi;
                var objectruanganfk = dataItem.objectruanganfk;
                var rmstat
                if (dataItem.rm == "Hapus") {
                    rmstat = false
                } else {
                    rmstat = true
                    umurDay = dataItem.umur
                    tglpelayanan = dataItem.tglpelayanan
                    tglhasil = dataItem.tglhasil
                    tglcetak = dataItem.tglcetak
                    norecPP = "'" + dataItem.norec_pp + "'"
                    norecAPD = dataItem.norec_apd
                    ruangan = dataItem.ruangan
                    ruanganasal = dataItem.namaruanganasal
                    dokterpemeriksa = dataItem.dokterpemeriksa
                    dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    // loadClaimPp($scope.item.norec_pp)
                    norec_pp = "'" + dataItem.norec_pp + "'"
                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) '
                    medifirstService.get("emr/get-hasil-lab?norecapd=" + x + "&umur=" + umurDay + "&jeniskelamin=" + $scope.item.objectjeniskelaminfk).then(function (x) {
                        if ($scope.item.pemeriksaanPenunjangLab == undefined) {
                            $scope.item.pemeriksaanPenunjangLab = x.data[0].tglpelayanan + ' : ' + x.data[0].detailjenisproduk + ' : '
                        } else {
                            $scope.item.pemeriksaanPenunjangLab = $scope.item.pemeriksaanPenunjangLab + ' ' + x.data[0].tglpelayanan + ' : ' + x.data[0].detailjenisproduk + ' : '
                        }
                        for (var i = 0; i < x.data.length; i++) {
                            if ($scope.item.pemeriksaanPenunjangLab == undefined) {
                                $scope.item.pemeriksaanPenunjangLab = x.data[i].detailpemeriksaan + '/' + x.data[i].hasil + ' '
                            } else {
                                $scope.item.pemeriksaanPenunjangLab = $scope.item.pemeriksaanPenunjangLab + '  ' + x.data[i].detailpemeriksaan + '/' + x.data[i].hasil;
                            }
                        }

                    });
                }
                // var norec_ppc = ''
                // norec_ppc = $scope.item.norec_pp
                var json = {
                    'norec': dataItem.norec_pp,
                    'isrm': rmstat
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-rm', json).then(function (e) {
                        // 	})
                        // loadClaimPp(norec_ppc)
                        medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + dataItem.norec_pp).then(function (rmpp) {
                            $scope.statusSelesaiPeriksaPp = rmpp.data.isrm;
                            loadClaimGridPp(noregistrasifk, objectruanganfk);
                            loadDaftarRmPp(noregistrasi);



                        });
                    }
                })
            }

            function loadClaimGridPp(noregistrasifk, objectruanganfk) {
                medifirstService.get("radiologi/get-lab-inacbg-grid-rm?noregistrasifk=" + noregistrasifk + "&objectruanganfk=" + objectruanganfk, true).then(function (dat) {
                    // if (dat.data.data.length > 0) {
                    // }
                    datalabstat = dat.data.data;
                    popUps();

                    // $scope.dataGrid = {
                    // 	data: dat.data.data,
                    // 	_data: dat.data.data,
                    // 	// pageSize: 10,
                    // 	selectable: true,
                    // 	refresh: true,
                    // 	total: dat.data.data.length,
                    // 	serverPaging: false,
                    // 	aggregate: [
                    // 		{ field: 'total', aggregate: 'sum' },
                    // 	]
                    // };
                });
            }
            // function loadRmPp(norec_pp) {
            // 	medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
            // 		$scope.statusSelesaiPeriksaRm = rmpp.data.isrm;
            // 	});
            // 	debugger
            // }

            function popUps(datalab) {
                // var datafin = []
                // datalab.forEach()
                if (datalab != undefined || datalab != null) {
                    datalabs = datalab
                }
                if (datalabs.length != 0) {
                    for (var i = 0; i < datalabs.length; i++) {
                        datalabs[i].rm = datalabstat[i].rm;
                        // datalabs[i].splice(0, 1, datalabstat[i])
                    }
                    // $scope.dataGrid = {
                    // 	data: datalabs,
                    // 	_data: datalabs,
                    // 	// pageSize: 10,
                    // 	selectable: true,
                    // 	refresh: true,
                    // 	total: datalabs.length,
                    // 	serverPaging: false,
                    // 	aggregate: [
                    // 		{ field: 'total', aggregate: 'sum' },
                    // 	]
                    // };
                    if (popc == true) {
                        if (datalabs[0].objectruanganfk == 576) {
                            $scope.dataGridRadio = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [{
                                    field: 'total',
                                    aggregate: 'sum'
                                },]
                            };
                            $scope.popUpPelayananRadio.center().open();
                            popc == false;
                        } else if (datalabs[0].objectruanganfk == 575) {
                            $scope.dataGrid = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: false,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [{
                                    field: 'total',
                                    aggregate: 'sum'
                                },]
                            };
                            $scope.popUpPelayanan.center().open();
                            popc == false;
                        }
                    }
                }
            }

            function popUps(datalab) {
                if (datalab != undefined || datalab != null) {
                    datalabs = datalab
                }
                if (datalabs.length != 0) {
                    for (var i = 0; i < datalabs.length; i++) {
                        datalabs[i].rm = datalabstat[i].rm;
                        // datalabs[i].splice(0, 1, datalabstat[i])
                    }

                    if (popc == true) {
                        if (datalabs[0].objectruanganfk == 576) {
                            $scope.dataGridRadio = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [{
                                    field: 'total',
                                    aggregate: 'sum'
                                },]
                            };
                            $scope.popUpPelayananrad.center().open();
                            popc == false;
                        } else if (datalabs[0].objectruanganfk == 575) {
                            $scope.dataGrid = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: false,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [{
                                    field: 'total',
                                    aggregate: 'sum'
                                },]
                            };
                            $scope.popUpPelayanan.center().open();
                            popc == false;
                        }
                    }
                }
            }

            function loadDaftarRmPp(noregistrasi) {
                medifirstService.get("registrasi/daftar-registrasi/get-daftar-rm-pp?noregistrasi=" + noregistrasi).then(function (dat) {
                    if (dat.data.data.length > 0) {
                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                    }
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].no = i + 1
                        dat.data.data[i].statCheckbox = false;
                        if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                            dat.data.data[i].statusbridging = "✔";
                            // ✅
                            // ✔
                        } else {
                            dat.data.data[i].statusbridging = "✘";
                            // ✘
                            // ❎
                        }
                        if (dat.data.data[i].iscito == "1") {
                            dat.data.data[i].statuscito = "✔";
                            // ✅
                            // ✔
                        } else {
                            dat.data.data[i].statuscito = "✘";
                            // ✘
                            // ❎
                        }
                        if (dat.data.data[i].statusperiksa == 1) {
                            dat.data.data[i].statusperiksa = "✔";
                        } else {
                            dat.data.data[i].statusperiksa = "✘";
                        }

                    }
                    if (dat.data.data.length > 0) {
                        if (dat.data.data[0].objectdepartemenfk == 3)
                            $scope.disableRad = true
                        if (dat.data.data[0].objectdepartemenfk == 27)
                            $scope.disableLab = true
                    }
                    $scope.isLoading = false;

                    $scope.dataGridRm = {
                        data: dat.data.data,
                        _data: dat.data.data,
                        // pageSize: 10,
                        selectable: true,
                        refresh: true,
                        total: dat.data.data.length,
                        serverPaging: false,
                        aggregate: [{
                            field: 'total',
                            aggregate: 'sum'
                        },]
                    };

                },
                    function (error) {
                        $scope.isLoading = false;
                    });
            }

            $scope.listKondisi = [{
                "id": 1,
                "nama": "Kondisi Waktu Keluar",
                "detail": [{
                    "id": 1,
                    "nama": "Sembuh"
                },
                {
                    "id": 2,
                    "nama": "Pindah"
                },
                {
                    "id": 3,
                    "nama": "Pulang atas Permintaan Sendiri"
                },
                {
                    "id": 4,
                    "nama": "Meninggal"
                },
                ]
            }]
            $scope.listPengobatan = [{
                "id": 2,
                "nama": "Pengobatan Dilanjutkan",
                "detail": [{
                    "id": 1,
                    "nama": "Poliklinik RS ini"
                },
                {
                    "id": 2,
                    "nama": "RS Lain"
                },
                {
                    "id": 3,
                    "nama": "PUSKESMAS"
                },
                {
                    "id": 4,
                    "nama": "Dokter Luar"
                },
                ]
            }]

            $scope.resumeOpt = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                // },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    // { field: "no", title: "No", width: 40 },
                    {
                        field: "namaobat",
                        title: "Nama Obat",
                        width: 350
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: 50
                    },
                    {
                        field: "dosisobat",
                        title: "Dosis",
                        width: 50
                    },
                    {
                        field: "frekuensi",
                        title: "Frekuensi",
                        width: 50
                    },
                    {
                        field: "carapemberian",
                        title: "Cara Pemberian",
                        width: 100
                    },
                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusData2 }, { name: "edit", text: "Edit", click: editData2 }], title: "&nbsp;", width: 120 }
                    // {command: [{name: "destroy", text: "Hapus"},{name: "edit", text: "Edit"}], title: "&nbsp;", width: 120 }
                ],

            };

            // $scope.resumeOpt = {
            //     editable: true,
            //     columns: [{
            //         field: "namaobat",
            //         title: "Nama Prodak",
            //         width: "70%"
            //     },
            //     {
            //         field: "jumlah",
            //         title: "Jumlah",
            //         width: "70%"
            //     },
            //     {
            //         field: "dosisobat",
            //         title: "Dosis Obat",
            //         width: "30%",
            //         editor: dynamicEditor
            //     },
            //     {
            //         field: "carapemberian",
            //         title: "Cara Pemberian",
            //         width: "70%"
            //     },
            // ]
            // };
            $scope.resumeOptRm = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="AddHasilKonsul(575)" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Hasil Laboratorium</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    {
                        field: "no",
                        title: "No",
                        width: 30
                    },
                    {
                        field: "tglpelayanan",
                        title: "Tgl Pelayanan",
                        width: 100
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: 150
                    },
                    {
                        field: "namaruanganasal",
                        title: "Ruangan Asal",
                        width: 150
                    },
                    {
                        field: "dokterpemeriksa",
                        title: "Dokter Pemeriksa",
                        width: 150
                    },
                    {
                        field: "namaproduk",
                        title: "Layanan",
                        width: 150
                    },
                    {
                        field: "dokterpengirim",
                        title: "Dokter Pengirim",
                        width: 150
                    },
                    {
                        field: "tglhasil",
                        title: "Tgl Hasil",
                        width: 100
                    },
                    {
                        field: "tglcetak",
                        title: "Tgl Cetak",
                        width: 100
                    },
                    {
                        command: [{
                            text: "Hapus",
                            click: simpanDeletePpRm
                        }],
                        title: "&nbsp;",
                        width: 80
                    }
                    // {command: [{name: "destroy", text: "Hapus"},{name: "edit", text: "Edit"}], title: "&nbsp;", width: 120 }
                ],

            };
            $scope.resumeOptHead = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="AddObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                // },],
                selectable: "row",
                // scrollable: true,
                pageable: true,
                scrollable: true,
                columns: [{
                    field: "no",
                    title: "No",
                    width: 40
                },
                {
                    field: "tglresume",
                    title: "Tgl Resume",
                    width: 150
                },
                {
                    field: "koderesume",
                    title: "Kode Resume",
                    width: 150
                },
                {
                    field: "noregistrasi",
                    title: "No Registrasi",
                    width: 150
                },
                {
                    field: "namaruangan",
                    title: "Ruangan",
                    width: 150
                },
                {
                    field: "tglkontrolpoli",
                    title: "Tgl Kontrol Poliklinik",
                    width: 150
                },
                {
                    field: "namadokter",
                    title: "Pegawai",
                    width: 150
                },
                {
                    field: "ringkasanriwayatpenyakit",
                    title: "Ringkasan Riwayat Penyakit",
                    width: 250
                },
                {
                    field: "pemeriksaanfisik",
                    title: "Pemerisaan Fisik",
                    width: 250
                },
                {
                    field: "pemeriksaanpenunjangaddlab",
                    title: "Pemerisaan Penunjang",
                    width: 250
                },
                {
                    field: "hasilkonsultasi",
                    title: "Hasil Konsultasi",
                    width: 250
                },
                {
                    field: "diagnosisawal",
                    title: "Diagnosi Awal",
                    width: 150
                },
                {
                    field: "diagnosissekunder",
                    title: "Diagnosis Sekunder",
                    width: 150
                },
                {
                    field: "diet",
                    title: "Diet",
                    width: 150
                },
                // { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 150 },
                {
                    field: "hasillab",
                    title: "Hasil Lab",
                    width: 150
                },
                {
                    field: "instruksianjuran",
                    title: "Intruksi",
                    width: 150
                },
                {
                    field: "kondisiwaktukeluar",
                    title: "Kondisi Keluar",
                    width: 150
                },
                {
                    field: "pengobatandilanjutkan",
                    title: "Pengobatan Dilanjutkan",
                    width: 150
                },
                {
                    field: "tindakanprosedur",
                    title: "Tindakan Prosedur",
                    width: 150
                },
                {
                    field: "terapi",
                    title: "Terapi",
                    width: 120
                },
                {
                    field: "alasanrawat",
                    title: "Alasan diRawat",
                    width: 150
                },
                {
                    field: "kondisiklinis",
                    title: "Kondisi Klinis",
                    width: 150
                },
                {
                    field: "obatobatakhir",
                    title: "Obat Pulang",
                    width: 150
                },
                {
                    field: "pasienkeluarga",
                    title: "Pasien Keluarga",
                    width: 250
                },

                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusHead }, { name: "edit", text: "Edit", click: editHead }], title: "&nbsp;", width: 120 }
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
                    columns: [{
                        field: "no",
                        title: "No",
                        width: 40
                    },
                    {
                        field: "namaobat",
                        title: "Nama Obat",
                        width: 200
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: 120
                    },
                    {
                        field: "dosis",
                        title: "Dosis",
                        width: 120
                    },
                    {
                        field: "frekuensi",
                        title: "Frekuensi",
                        width: 120
                    },
                    {
                        field: "carapemberian",
                        title: "Cara Pemberian",
                        width: 150
                    },
                    ]
                }
            };
            $scope.inputBaru = function () {
                $scope.popUp.center().open()
            }
            $scope.batal = function () {
                $scope.popUp.close()
            }
            init();
            $scope.showInput = function () {
                // noregistrasi = $scope.modelGrid.noregistrasi
                // loadDaftarRmPp(noregistrasi);
                // loadDiagnosa(noregistrasi);
                // init();
                $scope.isEdit = true
                $scope.isGrid = false
                $scope.item = {}
                $scope.item.dokter = {
                    id: $scope.objectpegawaifk,
                    namalengkap: $scope.namadokter
                }
                data2 = []
                noregistrasi = $scope.noregistrasi
                loadDaftarRmPp(noregistrasi);
                loadDiagnosa(noregistrasi);
                loadObatResepAkhir(noregistrasi);
                loadObatObat(noregistrasi);
                editDosisObat(noregistrasi);
                editDosisObatPulang(noregistrasi);
                // statusDosisObat(noregistrasi);
                init();
                $scope.sourceResume = new kendo.data.DataSource({
                    data: data2
                });

            }
            $scope.Back = function () {
                $scope.isEdit = false
                $scope.isGrid = true
                init()
            }

            function hapusData2(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].no == dataItem.no) {
                        data2.splice(i, 1);
                    }
                }
                grid.removeRow(dataItem);

            }

            function simpanDeletePpRm(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                var norec_pp = ''
                norec_pp = dataItem.norec_pp
                var json = {
                    'norec': norec_pp,
                    'isrm': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        loadDaftarRmPp(noregistrasi);


                    }
                })

            }

            function simpanDeleteObat(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                // var norec_pp = ''
                var isrm = false;
                if (dataItem.isrm == 'Tambah') {
                    var isrm = true;
                }
                var produkfk = dataItem.produkfk
                var json = {
                    'noregistrasi': $scope.noregistrasi,
                    'produkfk': produkfk,
                    'isrm': isrm
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-obat-rm', json).then(function (e) {
                    if (e.status === 201) {
                        editDosisObat(noregistrasi);
                        editDosisObatPop($scope.noregistrasi);
                    }
                })

            }

            function simpanDeleteObatPulang(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                debugger
                // var norec_pp = ''
                var ispulang = false;
                if (dataItem.ispulang == 'Tambah') {
                    var ispulang = true;
                }
                var produkfk = dataItem.produkfk
                var json = {
                    'norec_pp': dataItem.norec_pp,
                    'noregistrasi': $scope.noregistrasi,
                    'produkfk': produkfk,
                    'ispulang': ispulang
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-obat-rm-pulang', json).then(function (e) {
                    if (e.status === 201) {
                        editDosisObatPulang(noregistrasi);
                        editDosisObatPulangPop($scope.noregistrasi);
                    }
                })

            }
            // function hapusHead(e) {
            //     e.preventDefault();
            //     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            //     if (!dataItem) {
            //         toastr.error("Data Tidak Ditemukan");
            //         return
            //     }


            // }
            $scope.editGrid = function () {
                noregistrasi = $scope.modelGrid.noregistrasi
                loadDaftarRmPp(noregistrasi);
                loadDiagnosa(noregistrasi);
                loadObatObat(noregistrasi);
                editDosisObat(noregistrasi);
                editDosisObatPulang(noregistrasi);
                // statusDosisObat(noregistrasi);
                init();
                $scope.item.norec = $scope.modelGrid.norec
                // $scope.item.obatobat = $scope.modelGrid.obatobat
                $scope.item.riwayatPenyakit = $scope.modelGrid.ringkasanriwayatpenyakit
                $scope.item.pemeriksaanFisik = $scope.modelGrid.pemeriksaanfisik
                $scope.item.pemeriksaanPenunjang = $scope.modelGrid.pemeriksaanpenunjang
                $scope.item.pemeriksaanPenunjangLab = $scope.modelGrid.pemeriksaanpenunjanglab
                $scope.item.hasilKonsultasi = $scope.modelGrid.hasilkonsultasi
                $scope.item.alasanRawat = $scope.modelGrid.alasanrawat
                $scope.item.kondisiKlinis = $scope.modelGrid.kondisiklinis
                $scope.item.terapi = $scope.modelGrid.terapi
                $scope.item.diagnosaUtama = $scope.modelGrid.diagnosisawal
                $scope.item.diagnosisSekunder = $scope.modelGrid.diagnosissekunder
                $scope.item.tindakanProsedur = $scope.modelGrid.tindakanprosedur
                $scope.item.alergi = $scope.modelGrid.alergi
                $scope.item.diet = $scope.modelGrid.diet
                $scope.item.intruksi = $scope.modelGrid.instruksianjuran
                $scope.item.hasilLab = $scope.modelGrid.hasillab
                $scope.item.tgllahir = $scope.modelGrid.tgllahir
                $scope.item.kondisi = $scope.modelGrid.kondisiwaktukeluar
                $scope.item.pengobatan = $scope.modelGrid.pengobatandilanjutkan
                $scope.item.tglresume = $scope.modelGrid.tglresume
                $scope.item.tglkontrolpoli = $scope.modelGrid.tglkontrolpoli
                $scope.norecAPD = $scope.modelGrid.noregistrasifk
                $scope.item.dokter = {
                    id: $scope.modelGrid.objectpegawaifk,
                    namalengkap: $scope.modelGrid.namadokter
                }
                debugger
                data2 = $scope.modelGrid.details
                $scope.item.pasienKeluarga = $scope.modelGrid.pasienkeluarga
                for (let index = 0; index < data2.length; index++) {
                    data2[index].no = index + 1;
                }
                $scope.sourceResume = new kendo.data.DataSource({
                    data: data2
                });
                $scope.isGrid = false
                $scope.isEdit = true
            }
            // function editHead(e) {
            //     e.preventDefault();
            //     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            //     if (!dataItem) {
            //         toastr.error("Data Tidak Ditemukan");
            //         return
            //     }
            //     $scope.item.norec = dataItem.norec
            //     $scope.item.riwayatPenyakit = dataItem.ringkasanriwayatpenyakit
            //     $scope.item.pemeriksaanFisik = dataItem.pemeriksaanfisik
            //     $scope.item.pemeriksaanPenunjang = dataItem.pemeriksaanpenunjang
            //     $scope.item.hasilKonsultasi = dataItem.hasilkonsultasi
            //     $scope.item.terapi = dataItem.terapi
            //     $scope.item.diagnosaUtama = dataItem.diagnosisutama
            //     $scope.item.diagnosisSekunder = dataItem.diagnosissekunder
            //     $scope.item.tindakanProsedur = dataItem.tindakanprosedur
            //     $scope.item.alergi = dataItem.alergi
            //     $scope.item.diet = dataItem.diet
            //     $scope.item.intruksi = dataItem.instruksianjuran
            //     $scope.item.hasilLab = dataItem.hasillab
            //     $scope.item.kondisi = dataItem.kondisiwaktukeluar
            //     $scope.item.pengobatan = dataItem.pengobatandilanjutkan
            //     data2 = dataItem.details
            //     $scope.sourceResume = new kendo.data.DataSource({
            //         data: data2
            //     });
            //     $scope.isGrid = false
            //     $scope.isEdit = true


            // }
            function editData2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                $scope.item.no = dataItem.no
                $scope.item.namaobat = dataItem.namaobat
                $scope.item.jumlah = dataItem.jumlah
                $scope.item.dosis = dataItem.dosis
                $scope.item.frekuensi = dataItem.frekuensi
                $scope.item.carapemberian = dataItem.carapemberian

                $scope.popUp.center().open()

            }

            function init() {
                $scope.item.pemeriksaanFisik = "KU : \nKES : \nGCS :        , E :        , M :        , V : \nTD :        , N :        , P :        , SO2 :        , T : \n\nKEPALA / LEHER : \n\nTHORAK : \n\nABDOMEN : \n\nEKSTREMITAS :";
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo").then(function (e) {
                    $scope.listDokter = e.data.dokter
                    $scope.listReouteFarmasi = e.data.reouteFarmasi
                })

                $q.all([
                    medifirstService.get("emr/get-resume-medis-inap-noregistrasi/" + $scope.noregistrasi)
                ]).then(function (res) {
                    debugger
                    if (res[0].statResponse) {
                        var result = res[0].data.data
                        debugger
                        for (var i = 0; i < result[0].details.length; i++) {
                            if (result[0].details[i].carapemberian == null) {
                                var dataTemp = {
                                    id: "-",
                                    text: "-"
                                }
                            } else {
                                var dataTemp = {
                                    id: result[0].details[i].carapemberian,
                                    text: result[0].details[i].carapemberian
                                }
                            }
                            result[0].details.carapemberian = dataTemp;
                        }

                        if (result.length > 0) {
                            for (let index = 0; index < result.length; index++) {
                                result[index].no = index + 1
                            }
                        }

                        $scope.sourceResumeHead = new kendo.data.DataSource({
                            // data: result,
                            // pageSize: 20,

                            data: result,
                            _data: result,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: result.length,
                            serverPaging: false,

                        });
                    }

                    $scope.isRouteLoading = false;
                }, (error) => {
                    $scope.isRouteLoading = false;
                    throw error;
                })

                $scope.isLoadingDiagnosis = true;
                medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                    $scope.listDiagnosaTindakan = data;
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
                    $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
                });
            };

            $scope.saveIcd10 = function () {
                // if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
                //     toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
                //     return
                // }
                validasiIcd10();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {

                    $scope.savePeriksaDokter()
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr
                    ).then(function (res) { })
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    loadDiagnosa(noregistrasi)
                })
            }

            $scope.deleteIcd10 = function () {
                if ($scope.item.diagnosa == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                        'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected
                    loadDiagnosa(noregistrasi)


                })
            }

            function deleteIcd10(norec_diagnosapasien) {
                var diagnosa = {
                    norec_dp: norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                    // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                    //     'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                    //     + '/ ' + $scope.item.noMr

                    // ).then(function (res) {
                    // })
                    // delete $scope.item.jenisDiagnosis;
                    // delete $scope.item.diagnosa;
                    // delete $scope.item.keterangan;
                    // delete $scope.dataIcd10Selected
                    loadDiagnosa(noregistrasi)


                })
            }

            $scope.saveIcd9 = function () {
                //  if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
                //     toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
                //     return
                // }
                validasi();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {

                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected;
                    loadDiagnosa(noregistrasi)
                })
            }

            function validasi() {
                var listRawRequired = [
                    "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    if ($scope.dataIcd9Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
                    }
                    var ketTindakans = "";
                    if ($scope.item.ketTindakan != undefined) {
                        ketTindakans = $scope.item.ketTindakan
                    }
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        objectpasienfk: $scope.norecAPD,
                        tglpendaftaran: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
                        keterangantindakan: ketTindakans
                    }

                    $scope.objSave = {
                        detaildiagnosatindakanpasien: data,
                    }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }
            $scope.deleteIcd9 = function () {
                if ($scope.item.diagnosaTindakan == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
                        'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected
                    loadDiagnosa(noregistrasi)

                })
            }

            function deleteIcd9(norec_diagnosapasien) {
                var diagnosa = {
                    norec_dp: norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                    //     'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                    //     + '/ ' + $scope.item.noMr

                    // ).then(function (res) {
                    // })
                    // delete $scope.item.jenisDiagnosis;
                    // delete $scope.item.diagnosa;
                    // delete $scope.item.keterangan;
                    // delete $scope.dataIcd10Selected
                    loadDiagnosa(noregistrasi)


                })
            }

            $scope.savePeriksaDokter = function () {

                var kelompokUser = medifirstService.getKelompokUser()
                // var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
                if (kelompokUser == 'dokter') {
                    var data = {
                        "norec_apd": norec_apd,
                        "kelompokUser": kelompokUser
                    }
                    medifirstService.postNonMessage('rawatjalan/save-periksa', data)
                        .then(function (res) {

                        })
                }
            }
            $scope.isidiganosa = function (index) {
                debugger;
                $scope.data.namea[index].keterangan = $scope.data.namea[0].kddiagnosa.namaDiagnosa;
            }
            $scope.isidiganosay = function (index) {
                debugger;
                $scope.data.namey[index].keterangan = $scope.data.namey[0].kddiagnosa.namaDiagnosa;
            }
            $scope.isidiganosas = function (index) {
                debugger;
                $scope.data.names[index].keterangan = $scope.data.names[0].kddiagnosa.namaDiagnosa;
            }
            $scope.isidiganosaz = function (index) {
                debugger;
                $scope.data.namez[index].keterangan = $scope.data.namez[0].kddiagnosatindakan.namaDiagnosaTindakan;
            }
            $scope.klikIcd9 = function (dataIcd9Selected) {
                $scope.item.diagnosaTindakan = {
                    id: dataIcd9Selected.id,
                    namaDiagnosaTindakan: dataIcd9Selected.namadiagnosatindakan,
                    kodeNama: dataIcd9Selected.kddiagnosatindakan + ' - ' + dataIcd9Selected.namadiagnosatindakan,
                    kdDiagnosaTindakan: dataIcd9Selected.kddiagnosatindakan
                }
                $scope.item.ketTindakan = dataIcd9Selected.keterangantindakan
                $scope.findBy = "1";
            }
            $scope.klikIcd10 = function (dataIcd10Selected) {
                $scope.item.jenisDiagnosis = {
                    id: dataIcd10Selected.objectjenisdiagnosafk,
                    jenisDiagnosa: dataIcd10Selected.jenisdiagnosa
                }

                $scope.item.diagnosa = {
                    id: dataIcd10Selected.id,
                    namaDiagnosa: dataIcd10Selected.namadiagnosa,
                    kdDiagnosa: dataIcd10Selected.kddiagnosa,
                    kodeNama: dataIcd10Selected.kddiagnosa + ' - ' + dataIcd10Selected.namadiagnosa
                }
                $scope.item.keterangan = dataIcd10Selected.keterangan
                if (dataIcd10Selected.iskasusbaru == '1') {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
                // if (dataIcd10Selected.iskasuslama = '1') {
                //     $scope.item.kasuslama = true
                //     $scope.item.kasusbaru = false
                // }else{
                //     $scope.item.kasuslama = false
                //     $scope.item.kasusbaru = true
                // }

                $scope.findBy = "1";
            }

            function validasiIcd10() {
                var listRawRequired = [
                    "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
                    "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    var tglinput = "";
                    if ($scope.dataIcd10Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
                        tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
                    } else {
                        tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    }
                    var keterangan = "";
                    if ($scope.item.keterangan == undefined) {
                        keterangan = "-";
                    } else {
                        keterangan = $scope.item.keterangan
                    }

                    $scope.now = new Date();
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        noregistrasifk: $scope.norecAPD,
                        tglregistrasi: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.item.diagnosa.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglinputdiagnosa: tglinput,
                        keterangan: keterangan,
                        kasusbaru: $scope.item.kasusbaru,
                        kasuslama: $scope.item.kasuslama
                    }

                    $scope.objSave = {
                        detaildiagnosapasien: data,
                    }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    $scope.isRouteLoading = true;
                    var param = "noReg=" + $scope.item.noregistrasi;
                    medifirstService.get("emr/get-diagnosapasienbynoregicd9?" +
                        param
                    ).then(function (data) {
                        $scope.isRouteLoading = false;
                        var dataICD9 = data.data.datas;
                        $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                            data: dataICD9,
                            pageSize: 10
                        });
                    });

                    medifirstService.get("emr/get-diagnosapasienbynoreg?" +
                        param
                    ).then(function (data) {
                        // $scope.isRouteLoading = false;
                        var dataICD10 = data.data.datas;
                        $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                            data: dataICD10,
                            pageSize: 10
                        });
                    });
                } else {
                    $scope.isRouteLoading = true;
                    var param = "noCm=" + $scope.item.noMr;
                    medifirstService.get("emr/get-diagnosapasienbynoregicd9?" +
                        param
                    ).then(function (data) {
                        $scope.isRouteLoading = false;
                        var dataICD9 = data.data.datas;
                        $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                            data: dataICD9,
                            pageSize: 10
                        });
                    });

                    medifirstService.get("emr/get-diagnosapasienbynoreg?" +
                        param
                    ).then(function (data) {
                        // $scope.isRouteLoading = fals e;
                        var dataICD10 = data.data.datas;
                        $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                            data: dataICD10,
                            pageSize: 10
                        });
                    });

                }
            }

            // loadDiagnosa();
            function loadDiagnosa(noregistrasi) {
                $scope.isLoading = true;
                $scope.isRouteLoading = true;
                $scope.data = {
                    names: [],
                    namey: [],
                    namez: [],
                    namea: []
                };

                $scope.isRouteLoading = true;
                var param = ""
                // if($scope.dataParams.noRegistrasi == true)
                param = "noReg=" + noregistrasi;
                // else
                //   param = "noCm=" + $scope.item.noCm;

                medifirstService.get("emr/get-diagnosapasienbynoregicd9-rm?" +
                    param
                ).then(function (data) {
                    var indez = 1;
                    // $scope.isRouteLoading = false;
                    if (data.data.datas.length > 0) {
                        // setRow();
                        for (var i = 0; i < data.data.datas.length; i++) {
                            if (data.data.datas[i].kddiagnosatindakan == null || data.data.datas[i].kddiagnosatindakan == "") {
                                var name = {
                                    kddiagnosatindakan: {
                                        id: data.data.datas[i].id,
                                        kdDiagnosaTindakan: data.data.datas[i].kddiagnosatindakan
                                    },
                                    keterangan: data.data.datas[i].keterangantindakan,
                                    norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                    norec_apd: data.data.datas[i].norec_apd,
                                    objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                    tglregistrasi: $scope.tglregistrasi,
                                    iskasusbaru: 1,
                                    iskasusulama: 0,
                                    tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                };
                            } else {
                                var name = {
                                    kddiagnosatindakan: {
                                        id: data.data.datas[i].id,
                                        kdDiagnosaTindakan: data.data.datas[i].kddiagnosatindakan
                                    },
                                    keterangan: data.data.datas[i].namadiagnosatindakan,
                                    norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                    norec_apd: data.data.datas[i].norec_apd,
                                    objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                    tglregistrasi: $scope.tglregistrasi,
                                    iskasusbaru: 1,
                                    iskasusulama: 0,
                                    tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                };
                            }
                            $scope.data.namez.splice(indez + 1, i, name);
                            indez = indez + 1
                        }
                        // } else {
                        //     var name = {kddiagnosatindakan:{id: null, kdDiagnosaTindakan: ""}, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')};
                        //     if($scope.data.namez.length <= indey+1){
                        //          $scope.data.namez.splice(indey+1,0,name);
                        //      }
                        //     // $scope.data.names[0].kddiagnosa = 0
                        //     // $scope.data.names[0].keterangan = 0
                    }
                    if (indez == 1) {
                        var name = {
                            kddiagnosatindakan: {
                                id: null,
                                kdDiagnosaTindakan: ""
                            },
                            keterangan: "",
                            norec_diagnosapasien: "",
                            norec_apd: $scope.norecAPD,
                            objectjenisdiagnosafk: "",
                            tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                            iskasusbaru: 1,
                            iskasusulama: 0,
                            tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                        };
                        // if($scope.data.namez.length <= indey+1){
                        $scope.data.namez.splice(indez + 1, 0, name);
                        //  }
                    }
                    // $scope.isRouteLoading = false;
                    var dataICD9 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: dataICD9,
                        pageSize: 10
                    });
                });

                medifirstService.get("emr/get-diagnosapasienbynoreg-rm?" +
                    param
                ).then(function (data) {
                    var index = 1;
                    var indey = 1;
                    var indea = 1;

                    // $scope.isRouteLoading = false;
                    if (data.data.datas.length > 0) {
                        // setRow();
                        debugger
                        for (var i = 0; i < data.data.datas.length; i++) {
                            if (data.data.datas[i].objectjenisdiagnosafk == 1) {
                                if (data.data.datas[i].kddiagnosa == null || data.data.datas[i].kddiagnosa == "") {
                                    var name = {
                                        kddiagnosa: {
                                            id: data.data.datas[i].id,
                                            kdDiagnosa: data.data.datas[i].kddiagnosa
                                        },
                                        keterangan: data.data.datas[i].keterangan,
                                        norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                        norec_apd: data.data.datas[i].norec_apd,
                                        objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                        tglregistrasi: $scope.tglregistrasi,
                                        iskasusbaru: 1,
                                        iskasusulama: 0,
                                        tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                    };
                                } else {
                                    var name = {
                                        kddiagnosa: {
                                            id: data.data.datas[i].id,
                                            kdDiagnosa: data.data.datas[i].kddiagnosa
                                        },
                                        keterangan: data.data.datas[i].namadiagnosa,
                                        norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                        norec_apd: data.data.datas[i].norec_apd,
                                        objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                        tglregistrasi: $scope.tglregistrasi,
                                        iskasusbaru: 1,
                                        iskasusulama: 0,
                                        tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                    };
                                }
                                $scope.data.names.splice(index + 1, i, name);
                                index = index + 1
                            } else if (data.data.datas[i].objectjenisdiagnosafk == 2) {
                                if (data.data.datas[i].kddiagnosa == null || data.data.datas[i].kddiagnosa == "") {
                                    var name = {
                                        kddiagnosa: {
                                            id: data.data.datas[i].id,
                                            kdDiagnosa: data.data.datas[i].kddiagnosa
                                        },
                                        keterangan: data.data.datas[i].keterangan,
                                        norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                        norec_apd: data.data.datas[i].norec_apd,
                                        objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                        tglregistrasi: $scope.tglregistrasi,
                                        iskasusbaru: 1,
                                        iskasusulama: 0,
                                        tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                    };
                                } else {
                                    var name = {
                                        kddiagnosa: {
                                            id: data.data.datas[i].id,
                                            kdDiagnosa: data.data.datas[i].kddiagnosa
                                        },
                                        keterangan: data.data.datas[i].namadiagnosa,
                                        norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                        norec_apd: data.data.datas[i].norec_apd,
                                        objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                        tglregistrasi: $scope.tglregistrasi,
                                        iskasusbaru: 1,
                                        iskasusulama: 0,
                                        tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                    };
                                }
                                $scope.data.namey.splice(indey + 1, i, name);
                                indey = indey + 1
                            } else if (data.data.datas[i].objectjenisdiagnosafk == 5) {
                                if (data.data.datas[i].kddiagnosa == null || data.data.datas[i].kddiagnosa == "") {
                                    var name = {
                                        kddiagnosa: {
                                            id: data.data.datas[i].id,
                                            kdDiagnosa: data.data.datas[i].kddiagnosa
                                        },
                                        keterangan: data.data.datas[i].keterangan,
                                        norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                        norec_apd: data.data.datas[i].norec_apd,
                                        objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                        tglregistrasi: $scope.tglregistrasi,
                                        iskasusbaru: 1,
                                        iskasusulama: 0,
                                        tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                    };
                                } else {
                                    var name = {
                                        kddiagnosa: {
                                            id: data.data.datas[i].id,
                                            kdDiagnosa: data.data.datas[i].kddiagnosa
                                        },
                                        keterangan: data.data.datas[i].namadiagnosa,
                                        norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien,
                                        norec_apd: data.data.datas[i].norec_apd,
                                        objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk,
                                        tglregistrasi: $scope.tglregistrasi,
                                        iskasusbaru: 1,
                                        iskasusulama: 0,
                                        tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa
                                    };
                                }
                                $scope.data.namea.splice(indea + 1, i, name);
                                indea = indea + 1
                            }
                        }
                    }
                    if (index == 1) {
                        var name = {
                            kddiagnosa: {
                                id: null,
                                kdDiagnosa: ""
                            },
                            keterangan: "",
                            norec_diagnosapasien: "",
                            norec_apd: $scope.norecAPD,
                            objectjenisdiagnosafk: "",
                            tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                            iskasusbaru: 1,
                            iskasusulama: 0,
                            tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                        };
                        if ($scope.data.names.length <= index + 1) {
                            $scope.data.names.splice(index + 1, 0, name);
                        }
                    }
                    if (indey == 1) {
                        var name = {
                            kddiagnosa: {
                                id: null,
                                kdDiagnosa: ""
                            },
                            keterangan: "",
                            norec_diagnosapasien: "",
                            norec_apd: $scope.norecAPD,
                            objectjenisdiagnosafk: "",
                            tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                            iskasusbaru: 1,
                            iskasusulama: 0,
                            tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                        };
                        if ($scope.data.namey.length <= indey + 1) {
                            $scope.data.namey.splice(indey + 1, 0, name);
                        }
                    }
                    if (indea == 1) {
                        var name = {
                            kddiagnosa: {
                                id: null,
                                kdDiagnosa: ""
                            },
                            keterangan: "",
                            norec_diagnosapasien: "",
                            norec_apd: $scope.norecAPD,
                            objectjenisdiagnosafk: "",
                            tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                            iskasusbaru: 1,
                            iskasusulama: 0,
                            tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                        };
                        if ($scope.data.namea.length <= indea + 1) {
                            $scope.data.namea.splice(indea + 1, 0, name);
                        }
                    }
                    var dataICD10 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                        data: dataICD10,
                        pageSize: 10
                    });

                    // setTimeout(function() {
                    //     for (var x = 0; x < data.data.datas.length; x++) {
                    //     // $scope.data.names[x].kddiagnosa = {id: data.data.datas[x].kddiagnosa, namalengkap: data.data.datas[x].kddiagnosa}
                    //     $scope.data.names[x].keterangan = data.data.datas[x].keterangan
                    //     // var name = {kddiagnosa:data.data.datas[i].kddiagnosa, keterangan:data.data.datas[i].keterangan};
                    //     // $scope.data.names.splice(index + 1,0,name);
                    //     // index = index + 1
                    //     }
                    // }, 0);
                    // medifirstService.get("emr/get-diagnosapasienbynoreg?"
                    //     + param
                    // ).then(function (asd) {
                    //     for (var x = 0; x < asd.data.datas.length; x++) {
                    //     // $scope.data.names[x].kddiagnosa = {id: data.data.datas[x].kddiagnosa, namalengkap: data.data.datas[x].kddiagnosa}
                    //     $scope.data.names[x].keterangan = asd.data.datas[x].keterangan
                    //     // var name = {kddiagnosa:data.data.datas[i].kddiagnosa, keterangan:data.data.datas[i].keterangan};
                    //     // $scope.data.names.splice(index + 1,0,name);
                    //     // index = index + 1
                    //     }
                    // // if($scope.data.names.length <= index + 1 && i == j && j == k && k == l){
                    // //     $scope.data.names.splice(index + 1,0,name);
                    // //     index = index + 1
                    // // }
                    // icd10(param);
                    // });
                    // icd10(param);
                    $scope.isLoading = false;
                    $scope.isRouteLoading = false;
                });
            }

            $scope.columnDiagnosaIcd9 = [{
                "title": "No",
                "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
                "width": "30px"
            },
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px"
            }, {
                "field": "kddiagnosatindakan",
                "title": "Kode ICD 9",
                "width": "100px"
            }, {
                "field": "namadiagnosatindakan",
                "title": "Nama ICD 9",
                "width": "300px"
            }, {
                "field": "keterangantindakan",
                "title": "Keterangan",
                "width": "200px"
            }, {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "200px"
            },
            {
                "field": "namalengkap",
                "title": "Penginput",
                "width": "200px"
            },
            {
                "field": "tglinputdiagnosa",
                "title": "Tgl Input",
                "width": "200px"
            }
            ];
            $scope.columnDiagnosaIcd10 = [{
                "title": "No",
                "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
                "width": "30px"
            },
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px"
            }, {
                "field": "jenisdiagnosa",
                "title": "Jenis Diagnosis",
                "width": "150px"
            }, {
                "field": "kddiagnosa",
                "title": "Kode ICD 10",
                "width": "100px"
            }, {
                "field": "namadiagnosa",
                "title": "Nama ICD 10",
                "width": "300px"
            }, {
                "field": "keterangan",
                "title": "Keterangan",
                "width": "200px"
            }, {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "150px"
            },
            {
                "field": "namalengkap",
                "title": "Penginput",
                "width": "200px"
            },
            {
                "field": "tglinputdiagnosa",
                "title": "Tgl Input",
                "width": "200px"
            }
            ];

            $scope.Save = function (data) {
                debugger
                var dataDiagnosaD10 = [];
                var dataDiagnosaD9 = [];
                for (var i = 0; i < $scope.data.names.length; i++) {
                    if ($scope.data.names[i].keterangan == null || $scope.data.names[i].keterangan == "") {
                        messageContainer.error("Diagnosa Utama Harus Diisi!!");
                        return;
                    }
                    var datanames = {
                        norec_dp: $scope.data.names[i].norec_diagnosapasien,
                        noregistrasifk: $scope.data.names[i].norec_apd,
                        tglregistrasi: moment($scope.data.names[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.data.names[i].kddiagnosa.id,
                        objectjenisdiagnosafk: "1",
                        tglinputdiagnosa: moment($scope.data.names[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
                        keterangan: $scope.data.names[i].keterangan,
                        kasusbaru: undefined,
                        kasuslama: undefined
                    }
                    dataDiagnosaD10.push(datanames);
                }
                for (var i = 0; i < $scope.data.namey.length; i++) {
                    if ($scope.data.namey[i].keterangan == null || $scope.data.namey[i].keterangan == "") {
                        messageContainer.error("Diagnosa Sekunder Harus Diisi!!");
                        return;
                    }
                    var datanamey = {
                        norec_dp: $scope.data.namey[i].norec_diagnosapasien,
                        noregistrasifk: $scope.data.namey[i].norec_apd,
                        tglregistrasi: moment($scope.data.namey[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.data.namey[i].kddiagnosa.id,
                        objectjenisdiagnosafk: "2",
                        tglinputdiagnosa: moment($scope.data.namey[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
                        keterangan: $scope.data.namey[i].keterangan,
                        kasusbaru: undefined,
                        kasuslama: undefined
                    }
                    dataDiagnosaD10.push(datanamey);
                }
                for (var i = 0; i < $scope.data.namea.length; i++) {
                    if ($scope.data.namea[i].keterangan == null || $scope.data.namea[i].keterangan == "") {
                        messageContainer.error("Diagnosa Awal Harus Diisi!!");
                        return;
                    }
                    var datanamea = {
                        norec_dp: $scope.data.namea[i].norec_diagnosapasien,
                        noregistrasifk: $scope.data.namea[i].norec_apd,
                        tglregistrasi: moment($scope.data.namea[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.data.namea[i].kddiagnosa.id,
                        objectjenisdiagnosafk: "5",
                        tglinputdiagnosa: moment($scope.data.namea[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
                        keterangan: $scope.data.namea[i].keterangan,
                        kasusbaru: undefined,
                        kasuslama: undefined
                    }
                    dataDiagnosaD10.push(datanamea);
                }

                for (var i = 0; i < $scope.data.namez.length; i++) {
                    if ($scope.data.namez[i].keterangan == null || $scope.data.namez[i].keterangan == "") {
                        messageContainer.error("Tindakan / Prosedur Harus Diisi!!");
                        return;
                    }
                    var datanamez = {
                        norec_dp: $scope.data.namez[i].norec_diagnosapasien,
                        objectpasienfk: $scope.data.namez[i].norec_apd,
                        tglpendaftaran: moment($scope.data.namez[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosatindakanfk: $scope.data.namez[i].kddiagnosatindakan.id,
                        objectjenisdiagnosafk: "2",
                        tglinputdiagnosa: moment($scope.data.namez[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
                        keterangantindakan: $scope.data.namez[i].keterangan,
                        kasusbaru: undefined,
                        kasuslama: undefined
                    }
                    // var data = {
                    //     norec_dp: norec_diagnosapasien,
                    //     objectpasienfk: $scope.norecAPD,
                    //     tglpendaftaran: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                    //     objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
                    //     keterangantindakan: ketTindakans
                    // }
                    dataDiagnosaD9.push(datanamez);
                }

                var objSaveD10 = {
                    dataDiagnosaD10: dataDiagnosaD10
                }

                var objSaveD9 = {
                    dataDiagnosaD9: dataDiagnosaD9
                }

                medifirstService.post('emr/save-diagnosa-pasien-rm', JSON.stringify(objSaveD10)).then(function (e) {
                    // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                    //     'Input Diagnosis ICD 10 ( ' + $scope.data.namey[i].keterangan, + ' )' + ' No Registrasi ' + $scope.noregistrasi
                    //     + '/ ' + $scope.nocm
                    // ).then(function (res) {
                    // })
                })

                medifirstService.post('emr/save-diagnosa-tindakan-pasien-rm', JSON.stringify(objSaveD9)).then(function (e) {
                    // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                    //     'Input Diagnosis ICD 10 ( ' + $scope.data.namey[i].keterangan, + ' )' + ' No Registrasi ' + $scope.noregistrasi
                    //     + '/ ' + $scope.nocm
                    // ).then(function (res) {
                    // })
                })

                var item = {
                    "norec": $scope.item.norec != undefined ? $scope.item.norec : "",
                    "ringkasanriwayatpenyakit": $scope.item.riwayatPenyakit != undefined ? $scope.item.riwayatPenyakit : "",
                    "pemeriksaanfisik": $scope.item.pemeriksaanFisik != undefined ? $scope.item.pemeriksaanFisik : "",
                    "pemeriksaanpenunjang": $scope.item.pemeriksaanPenunjang != undefined ? $scope.item.pemeriksaanPenunjang : "",
                    "pemeriksaanpenunjanglab": $scope.item.pemeriksaanPenunjangLab != undefined ? $scope.item.pemeriksaanPenunjangLab : "",
                    "pasienkeluarga": $scope.item.pasienKeluarga != undefined ? $scope.item.pasienKeluarga : "",
                    "hasilkonsultasi": $scope.item.hasilKonsultasi != undefined ? $scope.item.hasilKonsultasi : "",
                    "terapi": $scope.item.terapi != undefined ? $scope.item.terapi : null,
                    "alasanrawat": $scope.item.alasanRawat != undefined ? $scope.item.alasanRawat : null,
                    "kondisiklinis": $scope.item.kondisiKlinis != undefined ? $scope.item.kondisiKlinis : null,
                    "diagnosisutama": $scope.item.diagnosaUtama != undefined ? $scope.item.diagnosaUtama : "",
                    "diagnosissekunder": $scope.item.diagnosisSekunder != undefined ? $scope.item.diagnosisSekunder : "",
                    "tindakanprosedur": $scope.item.tindakanProsedur != undefined ? $scope.item.tindakanProsedur : "",
                    "alergi": $scope.item.alergi != undefined ? $scope.item.alergi : "",
                    "diet": $scope.item.diet != undefined ? $scope.item.diet : "",
                    "instruksianjuran": $scope.item.intruksi != undefined ? $scope.item.intruksi : "",
                    "hasillab": $scope.item.hasilLab != undefined ? $scope.item.hasilLab : "",
                    "kondisiwaktukeluar": $scope.item.kondisi != undefined ? $scope.item.kondisi : "",
                    "pengobatandilanjutkan": $scope.item.pengobatan != undefined ? $scope.item.pengobatan : $scope.item.pengobatanLain,
                    "tglkontrolpoli": $scope.item.tglkontrolpoli != undefined ? moment($scope.item.tglkontrolpoli).format('YYYY-MM-DD') : moment($scope.item.tglKontrolPoli).format('YYYY-MM-DD'),
                    "tglresume": $scope.item.tglresume != undefined ? moment($scope.item.tglresume).format('YYYY-MM-DD') : moment($scope.item.tglResume).format('YYYY-MM-DD'),
                    "objectpegawaifk": $scope.item.dokter.id != undefined ? $scope.item.dokter.id : $scope.item.dokter.id,
                    "noregistrasifk": $scope.norecAPD,
                    "noregistrasi": $scope.noregistrasi,
                    "detail": data2
                }


                medifirstService.post('emr/post-resume-medis-inap/save', item).then(function (e) {
                    // delete $scope.item;
                    // clear()
                    // init();
                    medifirstService.postLogging('Resume Medis', 'Norec resumemedis_t', e.data.resume.norec, 'Resume RI').then(function (res) {
                        $scope.isEdit = false
                        $scope.isGrid = true
                        init()
                    })
                });
            };

            function loadObatResepAkhir(noregistrasi) {
                $scope.isRouteLoading = true;
                var noresep = '';
                var param = ""
                // if($scope.dataParams.noRegistrasi == true)
                param = "noReg=" + noregistrasi;
                // else
                //   param = "noCm=" + $scope.item.noCm;

                medifirstService.get("emr/get-obat-resep-akhir?" +
                    param
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    // for (var i = 0; i < data.data.datas.length; i++) {
                    //     // data.data.datas[i].no = i + 1
                    //     data.data.datas[i].total = parseFloat(data.data.datas[i].jumlah) * (parseFloat(data.data.datas[i].hargasatuan) - parseFloat(data.data.datas[i].hargadiscount))
                    //     data.data.datas[i].total = parseFloat(data.data.datas[i].total) + parseFloat(data.data.datas[i].jasa)
                    // }
                    // $scope.isRouteLoading = false;
                    var dataObat = data.data.datas;
                    noresep = data.data.datas[0].noresep;
                    $scope.sourceResume = new kendo.data.DataSource({
                        data: dataObat,
                        pageSize: 10

                        // schema: {
                        //     model: {
                        //         id: "id",
                        //         fields: {
                        //             namaobat: { editable: false, type: "string" },
                        //             jumlah: { editable: false, type: "string" },
                        //             dosisobat: { editable: (dynamicEditor) },
                        //             carapemberian: { editable: false, type: "string" },
                        //         }
                        //     }
                        // },
                    });
                    // $scope.dataGridDosisObat = new kendo.data.DataSource({data: dat.data,
                    //     // group: [
                    //     //     { field: "detailjenisproduk" },
                    //     //     // { field: "namaproduk" }
                    //     // ],
                    //     // sort: { field: "nourutdetail", dir: "asc" },
                    //     schema: {
                    //         model: {
                    //             id: "id",
                    //             fields: {
                    //                 namaproduk: { editable: false, type: "string" },
                    //                 dosisobat: { editable: (dynamicEditor) },
                    //             }
                    //         }
                    //     },
                    // });
                });

            }

            function loadObatObat(noregistrasi) {
                debugger;
                $scope.isRouteLoading = true;
                var noresep = '';
                var param = ""
                // if($scope.dataParams.noRegistrasi == true)
                param = "noReg=" + noregistrasi;
                // else
                //   param = "noCm=" + $scope.item.noCm;

                medifirstService.get("emr/get-obat-obat?" +
                    param
                ).then(function (data) {
                    $scope.item.obatobat = data.data.datas;
                });
                $scope.isRouteLoading = false;
            }

            function editDosisObat(noregistrasi) {

                $scope.isLoading = true;

                var ruid = 575;
                datalabs = []
                medifirstService.get("farmasi/get-transaksi-dosis-rm?noReg=" + noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;
                    $scope.dataGridDosisObat = new kendo.data.DataSource({
                        data: dat.data,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    namaproduk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    dosisobat: {
                                        editable: (dynamicEditor)
                                    },
                                    frekuensi: {
                                        editable: (dynamicEditors)
                                    },
                                }
                            }
                        },
                    });
                });
            }

            function editDosisObatPulang(noregistrasi) {

                $scope.isLoading = true;

                medifirstService.get("farmasi/get-transaksi-dosis-pulang-rm?noReg=" + noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    debugger
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;

                    debugger
                    var result = dat.data
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].carapemberian == null) {
                            var dataTemp = {
                                id: "-",
                                text: "-"
                            }
                        } else {
                            var dataTemp = {
                                id: result[i].carapemberian,
                                text: result[i].carapemberian
                            }
                        }
                        result[i].carapemberian = dataTemp;
                    }

                    $scope.dataGridDosisObatPulang = new kendo.data.DataSource({
                        data: result,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    // { field: "namaobat", title: "Nama Obat", width: 350 },
                                    // { field: "jumlah", title: "Jumlah", width: 50 },
                                    // { field: "dosisobat", title: "Dosis", width: 50 },
                                    // { field: "frekuensi", title: "Frekuensi", width: 50 },
                                    // { field: "carapemberian", title: "Cara Pemberian", width: 100 },
                                    produkfk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    dosisobat: {
                                        editable: true,
                                        type: "string"
                                    },
                                    namaproduk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    jumlah: {
                                        editable: false,
                                        type: "string"
                                    },
                                    frekuensi: {
                                        editable: true,
                                        type: "string"
                                    },
                                    ispulang: {
                                        editable: false,
                                        type: "string"
                                    },
                                    text: {
                                        editable: 'incell',
                                        type: "string"
                                    },
                                }
                            }
                        },
                    });
                });
            }


            function editDosisObatPop(noregistrasi) {
                $scope.isLoading = true;
                debugger

                var ruid = 575;
                datalabs = []
                medifirstService.get("farmasi/get-transaksi-dosis-rm-pop?noReg=" + $scope.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;
                    $scope.dataGridDosisObatPop = new kendo.data.DataSource({
                        data: dat.data,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    namaproduk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    dosisobat: {
                                        editable: false,
                                        type: "string"
                                    },
                                    frekuensi: {
                                        editable: false,
                                        type: "string"
                                    },
                                    // dosisobat: { editable: (dynamicEditor) },
                                }
                            }
                        },
                    });
                });
                // $scope.popUpDosisObat.center().open();
            }

            function editDosisObatPulangPop(noregistrasi) {
                $scope.isLoading = true;
                debugger

                var ruid = 575;
                datalabs = []
                medifirstService.get("farmasi/get-transaksi-dosis-pulang-rm-pop?noReg=" + $scope.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;
                    $scope.dataGridDosisObatPopPulang = new kendo.data.DataSource({
                        data: dat.data,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    produkfk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    dosisobat: {
                                        editable: false,
                                        type: "string"
                                    },
                                    namaproduk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    jumlah: {
                                        editable: false,
                                        type: "string"
                                    },
                                    frekuensi: {
                                        editable: false,
                                        type: "string"
                                    },
                                    ispulang: {
                                        editable: false,
                                        type: "string"
                                    },
                                    carapemberian: {
                                        editable: false,
                                        type: "string"
                                    },
                                    // dosisobat: { editable: (dynamicEditor) },
                                }
                            }
                        },
                    });
                });
                // $scope.popUpDosisObat.center().open();
            }
            $scope.editDosisObat = function () {
                editDosisObatPop($scope.noregistrasi);
                $scope.popUpDosisObat.center().open();
            }

            $scope.editDosisObatPulang = function () {
                editDosisObatPulangPop($scope.noregistrasi);
                $scope.popUpDosisObatPulang.center().open();
            }

            function statusDosisObat(noregistrasi) {

                $scope.isLoading = true;
                debugger

                var ruid = 575;
                datalabs = []
                medifirstService.get("farmasi/get-transaksi-status-dosis-rm?noReg=" + $scope.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;
                    $scope.dataGridDosisObat = new kendo.data.DataSource({
                        data: dat.data,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    namaproduk: {
                                        editable: false,
                                        type: "string"
                                    },
                                    dosisobat: {
                                        editable: (dynamicEditor)
                                    },
                                    frekuensi: {
                                        editable: (dynamicEditors)
                                    },
                                }
                            }
                        },
                    });
                });
            }

            $scope.cetakjs = function () {

                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                // var user = medifirstService.getPegawaiLogin();

                // var billing = "Rp " + parseFloat($scope.item.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var deposit = "Rp " + parseFloat($scope.item.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // $scope.isRouteLoading = true;
                // medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {

                // 	for (var i = 0; i < dat.data.details.length; i++)
                // 	{	
                // 		if(dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter=="-" )
                // 		{
                // 			if(dat.data.details[i].norec != null){
                // 				alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' +  dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' +  dat.data.details[i].tglPelayanan)
                // 				return
                // 			}
                // 		}
                // 	}
                // medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                debugger;

                // $qrcodedokter = '';
                // var qrcodedokter = $scope.modelGrid.namadokter;

                var tglresume = '';
                //nambahin wisnu
                var signature = '';
                if ($scope.modelGrid.signature == null) {
                    signature = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAZABkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKAP/2Q==';
                } else {
                    signature = $scope.modelGrid.signature.substring(22);
                }
                // var signature = $scope.modelGrid.signature.substring(22);
                tglresume = moment($scope.modelGrid.tglresume).format('DD-MM-YYYY')
                var namadokter = $scope.modelGrid.namadokter;
                var noresep = $scope.modelGrid.noresep;
                var qrcodedokter = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-dokter?reg=" + $scope.modelGrid.noregistrasi;
                var qrcodepasien = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-pasien?reg=" + $scope.modelGrid.noregistrasi;

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["gambarLogo", "namaRS", "tgllahirRS", "alamatRS", "noregistrasi", "nocm", "namapasien", "namaruangan", "jeniskelamin", "tgllahir", "tglregistrasi", "tglpulang", "kelompokpasien", "diagnosisawal", "alergi", "hasillab", "diet", "instruksianjuran", "kondisiwaktukeluar", "pengobatandilanjutkan", "tglkontrolpoli", "ringkasanriwayatpenyakit", "pemeriksaanfisik", "pemeriksaanpenunjang", "alasanrawat", "kondisiklinis", "terapi", "hasilkonsultasi", "norec", "namadiagnosaprimary", "kddiagnosaprimary", "namadiagnosasecondary", "kddiagnosasecondary", "namadiagnosatindakan", "kddiagnosatindakan", "qrcodedokter", "qrcodepasien", "namadokter", "obatobat", "tglresume", "noresep", "pasienkeluarga", "obatobatakhir", "namaobat", "jumlah", "dosis", "frekuensi", "carapemberian", "signature", "asalrujukan"],
                    "paramValue": ["logodokkes.jpg", "RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.modelGrid.noregistrasi,
                        $scope.modelGrid.nocm, $scope.modelGrid.namapasien, $scope.modelGrid.namaruangan, $scope.modelGrid.jeniskelamin, $scope.modelGrid.tgllahir, $scope.modelGrid.tglregistrasi, $scope.modelGrid.tglpulang, $scope.modelGrid.kelompokpasien, $scope.modelGrid.diagnosisawal, $scope.modelGrid.alergi, $scope.modelGrid.hasillab, $scope.modelGrid.diet, $scope.modelGrid.instruksianjuran, $scope.modelGrid.kondisiwaktukeluar, $scope.modelGrid.pengobatandilanjutkan, $scope.modelGrid.tglkontrolpoli, $scope.modelGrid.ringkasanriwayatpenyakit, $scope.modelGrid.pemeriksaanfisik, $scope.modelGrid.pemeriksaanpenunjangaddlab, $scope.modelGrid.alasanrawat, $scope.modelGrid.kondisiklinis, $scope.modelGrid.terapi, $scope.modelGrid.hasillab, $scope.modelGrid.norec, $scope.modelGrid.namadiagnosaprimary, $scope.modelGrid.kddiagnosaprimary, $scope.modelGrid.namadiagnosasecondary, $scope.modelGrid.kddiagnosasecondary, $scope.modelGrid.namadiagnosatindakan, $scope.modelGrid.kddiagnosatindakan, qrcodedokter, qrcodepasien, namadokter, $scope.modelGrid.obatobat, tglresume, noresep, $scope.modelGrid.pasienkeluarga, $scope.modelGrid.obatobatakhir, $scope.modelGrid.namaobat, $scope.modelGrid.jumlah, $scope.modelGrid.dosis, $scope.modelGrid.frekuensi, $scope.modelGrid.carapemberian, signature, $scope.modelGrid.asalrujukan
                    ],
                    "paramType": ["", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('192.168.1.116') > -1) {
                    xhr.open('POST', 'http://192.168.1.116:1002/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                    xhr.open('POST', 'http://36.92.186.59:1002/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/resumemedis.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/resumemedis.pdf');
                }
                // if($scope.item.jenisPasien=="BPJS" ){
                // 		if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 			xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 			xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 			xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 			xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 			xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 		}else{
                // 			xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 		}
                // }
                // else if($scope.item.jenisPasien=="Umum/Pribadi" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }else if($scope.item.jenisPasien=="KEMENKES RI" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }
                // else if($scope.item.namaPenjamin =="JASA RAHARJA, PT (BPJS KESEHATAN)" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }
                // else if($scope.item.namaPenjamin =="JASA RAHARJA, PT (UMUM)" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }

                // else
                // {
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}
                // }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
                // })
                // })
            }


            $scope.TutupPopUpPelayanan = function () {
                $scope.popUpPelayanan.center().close();
            }

            $scope.AddHasilKonsul = function (ruangan) {
                $scope.isLoading = true;

                // var noregistrasi = ''
                // noregistrasi = dataItem.norec_apd
                var ruid = ruangan;
                datalabs = []
                loadClaimGridPp($scope.norecPd, ruid);
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm?noregistrasi=" + $scope.noregistrasi + "&ruid=" + ruid
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            dat.data.data[i].statCheckbox = false;
                            if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                                dat.data.data[i].statusbridging = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statusbridging = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].iscito == "1") {
                                dat.data.data[i].statuscito = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statuscito = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].statusperiksa == 1) {
                                dat.data.data[i].statusperiksa = "✔";
                            } else {
                                dat.data.data[i].statusperiksa = "✘";
                            }

                        }
                        if (dat.data.data.length > 0) {
                            if (dat.data.data[0].objectdepartemenfk == 3)
                                $scope.disableRad = true
                            if (dat.data.data[0].objectdepartemenfk == 27)
                                $scope.disableLab = true
                        }
                        $scope.isLoading = false;

                        $scope.dataGrid = {
                            data: dat.data.data,
                            _data: dat.data.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.data.length,
                            serverPaging: false,
                            aggregate: [{
                                field: 'total',
                                aggregate: 'sum'
                            },]
                        };

                        // $scope.popUpPelayanan.center().open();
                        debugger
                        datalab = dat.data.data;
                        popUps(datalab)

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
                // loadEditor()
                //     if(dataItem.ruid === '576') {
                //         $scope.isLoading = true;

                //         // medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                //         // 	$scope.listruangan = dat.data.ruangan;
                //         // 	// $scope.listLayanan = dat.data.produk;
                //         // 	$scope.listDokter = dat.data.dokter;
                //         // })
                //         // if (norec_apd != null) {

                //         medifirstService.get("radiologi/get-rincian-pelayanan-inacbg?noregistrasifk=" + dataItem.norec_apd + "&ruid=" + dataItem.ruid
                // // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                //         , true).then(function (dat) {
                //             if (dat.data.data.length > 0) {
                //                 $scope.item.tgllahir = dat.data.data[0].tgllahir
                //                 $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                //             }
                //             $scope.statusSelesaiPeriksa = dat.data.data[0].isclaim
                //             for (var i = 0; i < dat.data.data.length; i++) {
                //                 dat.data.data[i].no = i + 1
                //                 dat.data.data[i].statCheckbox = false;
                //                 if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                //                     dat.data.data[i].statusbridging = "✔";
                //                     // ✅
                //                     // ✔
                //                 } else {
                //                     dat.data.data[i].statusbridging = "✘";
                //                     // ✘
                //                     // ❎
                //                 }
                //                 if (dat.data.data[i].iscito == "1") {
                //                     dat.data.data[i].statuscito = "✔";
                //                     // ✅
                //                     // ✔
                //                 } else {
                //                     dat.data.data[i].statuscito = "✘";
                //                     // ✘
                //                     // ❎
                //                 }
                //                 if( dat.data.data[i].statusperiksa == 1)
                //                 {
                //                     dat.data.data[i].statusperiksa = "✔";
                //                 }else
                //                 {
                //                     dat.data.data[i].statusperiksa = "✘";
                //                 }

                //             }
                //             if (dat.data.data.length > 0) {
                //                 if (dat.data.data[0].objectdepartemenfk == 3)
                //                     $scope.disableRad = true
                //                 if (dat.data.data[0].objectdepartemenfk == 27)
                //                     $scope.disableLab = true
                //             }
                //             $scope.isLoading = false;


                //             $scope.dataGridRadio = {
                //                 data: dat.data.data,
                //                 _data: dat.data.data,
                //                 // pageSize: 10,
                //                 selectable: true,
                //                 refresh: true,
                //                 total: dat.data.data.length,
                //                 serverPaging: false,
                //                 aggregate: [
                //                     { field: 'total', aggregate: 'sum' },
                //                 ]

                //             };

                //             $scope.popUpPelayananRadio.center().open();

                //         },
                //         function (error) {
                //             $scope.isLoading = false;
                //         });
                //     }
            }

            $scope.AddHasilKonsul = function (ruangan) {
                $scope.isLoading = true;

                var ruid = ruangan;
                datalabs = []
                loadClaimGridPp($scope.norecPd, ruid);
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm?noregistrasi=" + $scope.noregistrasi + "&ruid=" + ruid
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            dat.data.data[i].statCheckbox = false;
                            if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                                dat.data.data[i].statusbridging = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statusbridging = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].iscito == "1") {
                                dat.data.data[i].statuscito = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statuscito = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].statusperiksa == 1) {
                                dat.data.data[i].statusperiksa = "✔";
                            } else {
                                dat.data.data[i].statusperiksa = "✘";
                            }

                        }
                        if (dat.data.data.length > 0) {
                            if (dat.data.data[0].objectdepartemenfk == 3)
                                $scope.disableRad = true
                            if (dat.data.data[0].objectdepartemenfk == 27)
                                $scope.disableLab = true
                        }
                        $scope.isLoading = false;

                        $scope.dataGrid = {
                            data: dat.data.data,
                            _data: dat.data.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.data.length,
                            serverPaging: false,
                            aggregate: [{
                                field: 'total',
                                aggregate: 'sum'
                            },]
                        };

                        // $scope.popUpPelayanan.center().open();
                        debugger
                        if (ruid == 575) {
                            datalab = dat.data.data;
                            popUps(datalab)
                        } else {
                            datalab = dat.data.data;
                            popUps(datalab)
                        }

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
            }

            // $scope.editDosisObat = function () {
            //     $scope.isLoading = true;
            //     debugger

            //     var ruid = 575;
            //     datalabs = []
            //     medifirstService.get("farmasi/get-transaksi-dosis-rm-pop?noReg=" + $scope.noregistrasi, true).then(function (dat) {
            //         $scope.isRouteLoading = false;
            //         for (var i = 0; i < dat.data.length; i++) {
            //             dat.data[i].no = i + 1
            //             dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
            //             dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
            //         }
            //         // $scope.dataGridDosisObat = dat.data;
            //         $scope.dataGridDosisObatPop = new kendo.data.DataSource({data: dat.data,
            //             // group: [
            //             //     { field: "detailjenisproduk" },
            //             //     // { field: "namaproduk" }
            //             // ],
            //             // sort: { field: "nourutdetail", dir: "asc" },
            //             schema: {
            //                 model: {
            //                     id: "id",
            //                     fields: {
            //                         namaproduk: { editable: false, type: "string" },
            //                         dosisobat: { editable: (dynamicEditor) },
            //                     }
            //                 }
            //             },
            //         });
            //     });
            //     $scope.popUpDosisObat.center().open();
            // }

            $scope.simpanDosisObat = function () {
                var dataArray = [];
                for (var i = $scope.dataGridDosisObat._data.length - 1; i >= 0; i--) {
                    if ($scope.dataGridDosisObat._data[i].dosisobat != null || $scope.dataGridDosisObat._data[i].dosisobat != '')
                        dataArray.push({
                            "produkfk": $scope.dataGridDosisObat._data[i].produkfk,
                            "namaproduk": $scope.dataGridDosisObat._data[i].namaproduk,
                            "dosisobat": $scope.dataGridDosisObat._data[i].dosisobat,
                            "frekuensi": $scope.dataGridDosisObat._data[i].frekuensi,
                        });
                }

                if (dataArray.length !== 0) {
                    var objSave = {
                        "noregistrasi": $scope.noregistrasi,
                        "dosisobat": dataArray
                    }
                    debugger
                    medifirstService.post('farmasi/save-transaksi-dosis-rm', objSave).then(function (e) {
                        if (e.status == 201) {
                            loadObatResepAkhir(noregistrasi);
                            editDosisObat(noregistrasi);
                            // loadObatObat(noregistrasi);
                            // $scope.popUpDosisObat.center().close();
                        }
                    })
                }
            }

            $scope.simpanCaraPemberian = function () {
                var dataArray = [];
                debugger
                for (var i = $scope.dataGridDosisObatPulang._data.length - 1; i >= 0; i--) {
                    if ($scope.dataGridDosisObatPulang._data[i].dosisobat != null || $scope.dataGridDosisObatPulang._data[i].dosisobat != '')
                        dataArray.push({
                            "produkfk": $scope.dataGridDosisObatPulang._data[i].produkfk,
                            "norec_pp": $scope.dataGridDosisObatPulang._data[i].norec_pp,
                            "carapemberian": $scope.dataGridDosisObatPulang._data[i].carapemberian.text,
                            "namaproduk": $scope.dataGridDosisObatPulang._data[i].namaproduk,
                            "dosisobat": $scope.dataGridDosisObatPulang._data[i].dosisobat,
                            "frekuensi": $scope.dataGridDosisObatPulang._data[i].frekuensi,
                        });
                }
                debugger
                if (dataArray.length !== 0) {
                    var objSave = {
                        "noregistrasi": $scope.noregistrasi,
                        "dosisobat": dataArray
                    }
                    debugger
                    medifirstService.post('farmasi/save-transaksi-dosis-pulang-rm', objSave).then(function (e) {
                        if (e.status == 201) {
                            editDosisObatPulang(noregistrasi);
                            // editDosisObat(noregistrasi);
                            // loadObatObat(noregistrasi);
                            // $scope.popUpDosisObat.center().close();
                        }
                    })
                }
            }

            $scope.columnGrid = {
                columns: [
                    // {
                    // 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // 	template: "# if (statCheckbox) { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    // 		"# } else { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    // 		"# } #",
                    // 	width: "30px",
                    // 	attributes: {
                    // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //    },
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    // {
                    //     "field": "namaproduk",
                    //     "title": "Layanan",
                    //     "width": "160px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    //     attributes: {
                    //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    //     },
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        // "field": "claim",
                        "title": "Resume Medis",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    },
                    {
                        "field": "tglhasil",
                        "title": "Tgl Hasil",
                        "width": "90px",
                    },
                    {
                        "field": "tglcetak",
                        "title": "Tgl Cetak",
                        "width": "90px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "40px",
                    },
                    // {
                    // 	"field": "hargasatuan",
                    // 	"title": "Harga Satuan",
                    // 	"width": "100px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    // },
                    // {
                    // 	"field": "hargadiscount",
                    // 	"title": "Diskon",
                    // 	"width": "80px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                    // 	// footerTemplate: "<span class='style-center'>Total</span>",
                    // },
                    // {
                    // 	"field": "jasa",
                    // 	"title": "Jasa Cito",
                    // 	"width": "80px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                    // 	footerTemplate: "<span class='style-center'>Total</span>",
                    // },
                    // {
                    // 	"field": "total",
                    // 	"title": "Total",
                    // 	"width": "100px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                    // 	aggregates: ["sum"],
                    // 	groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                    // 	footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
                    // },
                    {
                        "field": "noorder",
                        "title": "No Order",
                        "width": "100px",
                    },
                    {
                        "field": "nostruk",
                        "title": "No Struk",
                        "width": "80px"
                    },
                    {
                        "field": "statusbridging",
                        "title": "Status Kirim",
                        "width": "50px",
                    },
                    {
                        "field": "statusperiksa",
                        "title": "Status Periksa",
                        "width": "100px",

                    },
                    {
                        "field": "statuscito",
                        "title": "Status Cito",
                        "width": "100px",
                    },
                    {
                        "field": "nofoto",
                        "title": "No Foto",
                        "width": "100px",
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }

            $scope.columnGridrad = {
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "ruangan",
                    "title": "Ruangan",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                    // "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "dokterpemeriksa",
                    "title": "Dokter Pemeriksa",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "dokterpengirim",
                    "title": "Dokter Pengririm",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    // "field": "claim",
                    "title": "Resume Medis",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"Cetakexpertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",

                    // "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                },
                {
                    "field": "tglhasil",
                    "title": "Tgl Hasil",
                    "width": "90px",
                },

                {
                    "field": "nofoto",
                    "title": "No Foto",
                    "width": "100px",
                }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            $scope.Cetakexpertise = function (dataItem) {
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + dataItem.norec_pp + '&idproduk=' + dataItem.produkfk).then(function (e) {
                    debugger;
                    var kalimat = e.data[0].keterangan;
                    // var panjang = kalimat.length;
                    // var temukan = kalimat.indexOf("kesan");
                    // if (temukan < 0) {
                    //     var temukan = kalimat.indexOf("Kesan");
                    // }
                    // var filter = kalimat.slice(temukan, panjang);
                    var filter = kalimat;

                    filter = filter.replace(/(<([^>]+)>)/gi, " ");
                    if ($scope.item.pemeriksaanPenunjang == "" || $scope.item.pemeriksaanPenunjang == undefined) {

                        $scope.item.pemeriksaanPenunjang = filter.replace(/&nbsp;/g, " ");
                    } else {

                        $scope.item.pemeriksaanPenunjang = $scope.item.pemeriksaanPenunjang + "\n" + filter.replace(/&nbsp;/g, " ");
                    }
                    $scope.popUpPelayananrad.close();
                })

            }

            $scope.CetakLabKlinikLangsung = function (dataItem) {
                debugger
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + dataItem.noregistrasi).then(function (data) {
                    debugger
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }
                    }
                });

                if (dataItem.tglhasil == null) {
                    alert("Hasil Tidak Ditersedia.");
                    return;
                } else {
                    umurDay = dataItem.umur
                    tglpelayanan = dataItem.tglpelayanan
                    tglhasil = dataItem.tglhasil
                    tglcetak = dataItem.tglcetak
                    norecPP = "'" + dataItem.norec_pp + "'"
                    norecAPD = dataItem.norec_apd
                    ruangan = dataItem.ruangan
                    ruanganasal = dataItem.namaruanganasal
                    dokterpemeriksa = dataItem.dokterpemeriksa
                    dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    // loadClaimPp($scope.item.norec_pp)
                    norec_pp = "'" + dataItem.norec_pp + "'"

                    debugger
                    // var a = dataItem
                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        catatan = $scope.item.catatan;
                    }

                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + dataItem.noregistrasi
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["", "RS BHAYANGKARA TK IV CIANJUR", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211, Telp. (0751)8465000, Psw. 177", user.namaLengkap,
                            x, umurDay, $scope.item.objectjeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            console.log(this.response, typeof this.response);
                            //var res = this.response
                            //var file = new Blob( [res], {type: 'application/pdf'});
                            debugger;
                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                    if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                //     tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                //     var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                //     var statusUpdate =1;
                //     if($scope.item.cekUpdate == true)
                //     {
                //        statusUpdate = 2
                //     }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        LoadData()
                //    });
            }

            $scope.detailHasilLab = function (dataItem) {
                $scope.resultGridsHasilLab = new kendo.data.DataSource({
                    data: []
                })

                $scope.isRouteLoading = true
                var norec_pp = ''
                $scope.item.norec_pp = dataItem.norec_pp;
                norec_pp = "'" + dataItem.norec_pp + "'"
                medifirstService.get("laboratorium/get-hasil-lab-manual?norec_apd=" + dataItem.norec_apd +
                    '&objectjeniskelaminfk=' + dataItem.objectjeniskelaminfk + '&umur=' + dataItem.umur + '&norec=' + norec_pp + '&tgl=' + Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'))).then(function (data) {
                        // var sourceGrid = []
                        $scope.isRouteLoading = false;
                        if (data.statResponse == true && data.data.data.length > 0) {
                            // if (data.status === 201) {
                            // debugger;
                            // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                            // 	})
                            loadRmPp($scope.item.norec_pp);
                            loadDaftarRmPp(noregistrasi);
                            // }
                            // loadRmPp(norec_pp);
                            // sourceGrid = data.data.data
                            $scope.item.tglpelayanan = new Date(moment(data.data.data[0].tglpelayanan).format('YYYY-MM-DD HH:mm'));
                            $scope.item.tglhasil = new Date(moment(data.data.data[0].tglhasil).format('YYYY-MM-DD HH:mm'));
                            $scope.item.DataPegawai = {
                                namalengkap: data.data.data[0].namalengkap,
                                id: data.data.data[0].id
                            };
                            $scope.item.catatan = data.data.data[0].catatancetak;
                            for (let i = 0; i < data.data.data.length; i++) {
                                const element = data.data.data[i];
                                $scope.item.catatan = data.data.data[i].catatancetak;
                            }
                            $scope.resultGridsHasilLab = new kendo.data.DataSource({
                                data: data.data.data,
                                group: [{
                                    field: "detailjenisproduk"
                                },
                                    // { field: "namaproduk" }
                                ],
                                sort: {
                                    field: "nourutdetail",
                                    dir: "asc"
                                },
                                schema: {
                                    model: {
                                        id: "id",
                                        fields: {
                                            detailjenisproduk: {
                                                editable: false,
                                                type: "string"
                                            },
                                            detailpemeriksaan: {
                                                editable: false,
                                                type: "string"
                                            },
                                            memohasil: {
                                                editable: false,
                                                type: "string"
                                            },
                                            namaproduk: {
                                                editable: false,
                                                type: "string"
                                            },
                                            satuanstandar: {
                                                editable: false,
                                                type: "string"
                                            },
                                            // detailpemeriksaan: { editable: false, type: "string" },
                                            nilaimax: {
                                                editable: false,
                                                type: "string"
                                            },
                                            nilaimin: {
                                                editable: false,
                                                type: "string"
                                            },
                                            hasil: {
                                                editable: false,
                                                type: "string"
                                            },
                                            nourutdetail: {
                                                editable: false,
                                                type: "number"
                                            },
                                            nilaitext: {
                                                editable: false,
                                                type: "string"
                                            }
                                        }
                                    }
                                }
                            });

                            $scope.popUpDetailLab.center().open();
                        } else {
                            toastr.info('Data Hasil tidak ada', 'Info')
                        }
                    });

            }

            $scope.ColumnResultHasilLab = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "HasilLab.xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: true,

                // dataBound: onDataBound,
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Hasil";

                    var myHeaders = [

                        {
                            value: "Hasil Laboratorium",
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
                columns: [{
                    field: "namaproduk",
                    title: "Nama Pemeriksaan",
                    width: "20%"
                },
                {
                    field: "detailpemeriksaan",
                    title: "Detail Pemeriksaan",
                    width: "20%"
                }, {
                    field: "hasil",
                    title: "Hasil Pemeriksaan",
                    width: "15%",
                    attributes: {
                        class: "#=flag != 'N' ? 'red' : 'green' #"
                    },
                }, {
                    field: "nilaitext",
                    title: "Nilai Normal",
                    width: "15%"
                },
                // {
                //     field: "tipedata",
                //     title: "tipedata",
                //     width: "0%"

                // },
                {
                    field: "satuanstandar",
                    title: "Satuan Hasil",
                    width: "20%"
                },
                {
                    field: "Metode",
                    title: "Metode",
                    width: "20%"
                },
                {
                    field: "hasil_s",
                    title: "S",
                    width: "5%"
                },
                {
                    field: "hasil_i",
                    title: "I",
                    width: "5%"
                },
                {
                    field: "catatan",
                    title: "Catatan",
                    width: "5%"
                },
                {
                    hidden: true,
                    field: "detailjenisproduk",
                    title: "Jenis Pemeriksaan"
                },

                {
                    hidden: true,
                    field: "nourutdetail"

                }
                ]
            };

            $scope.TutupPopUpDetail = function () {
                $scope.popUpDetailLab.center().close();
            }

            $scope.kembali = function () {
                debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.norecAPD,
                    emr: 'LaporanOperasi',
                });
            }

            $scope.dosisObat = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="editDosisObat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Terapi Rawat</button>'
                },],
                editable: true,
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "70%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "20%",
                    editor: dynamicEditor
                }, {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%",
                    editor: dynamicEditors
                },
                {
                    command: [{
                        text: "Hapus",
                        click: simpanDeleteObat
                    }],
                    title: "&nbsp;",
                    width: "10%"
                }
                    // {
                    //     // field: "namaproduk",
                    //     title: "",
                    //     width: "10%",
                    //     template: "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(namaproduk)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // }
                    // {
                    //     // "field": "claim",
                    //     "title": "Resume Medis",
                    //     "width": "100px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // },
                ]
            };
            $scope.dropDownReouteFarmasi = function (container, options) {
                debugger;
                var editor = $('<input kendo-combo-box required k-data-text-field="\'text\'" k-data-value-field="\'text\'" k-filter="\'contains\'" k-data-source="listReouteFarmasi" data-bind="value:' + options.field + '"/>')
                    .appendTo(container);
            };
            $scope.dosisObatPulang = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="editDosisObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Terapi Pulang</button>'
                },],
                // editable: true,
                editable: "incell",
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "60%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "10%"
                },
                {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%"
                },
                {
                    field: "jumlah",
                    title: "Jumlah",
                    width: "5%"
                },
                {
                    field: "carapemberian",
                    title: "Cara Pemberian",
                    width: "10%",
                    editor: $scope.dropDownReouteFarmasi,
                    template: "#=carapemberian.text#"
                },
                // {
                //     field: "carapemberian",
                //     title: "Cara Pemberian",
                //     width: "15%"
                // },
                {
                    command: [{
                        text: "Hapus",
                        click: simpanDeleteObatPulang
                    }],
                    title: "&nbsp;",
                    width: "10%"
                },
                    // { 
                    //     field: "carapemberians", 
                    //     title: "Cara Pemberian", 
                    //     width: "15%",
                    //     editor: $scope.dropDownReouteFarmasi, 
                    //     template: "#=carapemberians.text#"
                    // },
                ]
            };



            $scope.dosisObatPulangPop = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="editDosisObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Terapi Rawat</button>'
                // },],
                editable: true,
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "60%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "10%"
                },
                {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%"
                },
                {
                    field: "jumlah",
                    title: "Jumlah",
                    width: "5%"
                },
                {
                    field: "carapemberian",
                    title: "Cara Pemberian",
                    width: "15%"
                },
                {
                    command: [{
                        text: "Tambah",
                        click: simpanDeleteObatPulang
                    }],
                    title: "&nbsp;",
                    width: "10%"
                }
                ]
            };

            $scope.dosisObatPop = {
                editable: true,
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "70%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "10%",
                    editor: dynamicEditor
                }, {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%",
                    editor: dynamicEditors
                },
                {
                    command: [{
                        text: "Tambah",
                        click: simpanDeleteObat
                    }],
                    title: "&nbsp;",
                    width: "10%"
                }
                    // {
                    //     // field: "namaproduk",
                    //     title: "",
                    //     width: "10%",
                    //     template: "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(namaproduk)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // }
                    // {
                    //     // "field": "claim",
                    //     "title": "Resume Medis",
                    //     "width": "100px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // },
                ]
            };


            function dynamicEditor(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="dosisobat" data-bind="value:dosisobat">');
                input.appendTo(container);
                // }
            };

            function dynamicEditors(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="frekuensi" data-bind="value:frekuensi">');
                input.appendTo(container);
                // }
            };

            $scope.simpanAddPp = function () {
                // if ($scope.item.password != "diclaim") {
                // 	toastr.error("Password Salah!")
                // 	return;
                // }
                var norec_pp = ''
                norec_pp = $scope.item.norec_pp
                var json = {
                    'norec': $scope.item.norec_pp,
                    'isrm': true
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                        // 	})
                        loadRmPp(norec_pp);
                        loadDaftarRmPp(noregistrasi);
                        init();
                    }
                })
                // loadClaimPp(norec_ppc)
                // $scope.popUpDetailLab.close()
            }

            $scope.simpanDeletePp = function () {
                debugger
                var norec_pp = ''
                norec_pp = $scope.item.norec_pp
                var json = {
                    'norec': $scope.item.norec_pp,
                    'isrm': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        loadRmPp(norec_pp);
                        loadDaftarRmPp(noregistrasi);
                        init();
                    }
                })
                // $scope.popUpClaim.close()
            }


            // function simpanDeletePpRm () {
            //     debugger
            //     $scope.item.norec_pp = dataItem.norec_pp;
            // 	var norec_pp = ''
            // 	norec_pp = $scope.item.norec_pp
            // 	var json = {
            // 	'norec': $scope.item.norec_pp,
            // 	'isrm': false
            // 	}
            // 	medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) { 
            // 		if (e.status === 201) {
            // 			loadRmPp(norec_pp);
            // 		}
            // 	})
            // 	$scope.popUpClaim.close()
            // }

            function clear() {
                $scope.item = {}

            }
            $scope.hapusGrid = function () {
                var item = {
                    "norec": $scope.modelGrid.norec
                }
                medifirstService.post('emr/post-resume-medis-inap/delete', item).then(function (e) {
                    clear()
                    init();
                });
            }

            function categoryDropDownEditor(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: "jenisJabatan",
                        dataValueField: "id",
                        dataSource: $scope.listJenisJabatan
                    });
            }
            var timeoutPromise;
            $scope.$watch('item.filterRiwayat', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    applyFilter("ringkasanriwayatpenyakit", newVal)
                }
            })
            $scope.$watch('item.filterPemeriksaanfisik', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pemeriksaanfisik", newVal)
                    }
                }, 500)
            })
            $scope.$watch('item.filterPemeriksaanPenunjang', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pemeriksaanpenunjang", newVal)
                    }
                }, 500)
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridResumeHead").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter = function () {
                var dataGrid = $("#gridResume").data("kendoGrid");
                dataGrid.dataSource.filter({});
                delete $scope.item.filterRiwayat
                delete $scope.item.filterPemeriksaanfisik
                delete $scope.item.filterPemeriksaanPenunjang
            }

            $scope.cetak = function () {
                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if (confirm('View Resume? ')) {
                    var stt = 'true';
                } else {
                    var stt = 'false'
                }
                // Do nothing!
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-resume-ri=' + $scope.nocm +
                    '&noRec=' + $scope.modelGrid.norec +
                    '&view=' + stt,
                    function (response) { });
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
            $scope.dataICD10 = {
                names: [{
                    idtkh: "151",
                    tkh: "",
                    idtgl: "149",
                    tgl: "",
                    iddg: "150",
                    dg: "",
                    idpg: "152",
                    pg: "",
                    norec: "",
                    norectgl: "",
                    norectkh: "",
                    norecdg: "",
                    norecpg: ""
                }]
            };

            $scope.TambahD10 = function (index) {
                debugger;
                var name = {
                    kddiagnosa: {
                        id: null,
                        kdDiagnosa: ""
                    },
                    keterangan: "",
                    norec_diagnosapasien: "",
                    norec_apd: $scope.norecAPD,
                    objectjenisdiagnosafk: "",
                    tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    iskasusbaru: 1,
                    iskasusulama: 0,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                }
                if ($scope.data.namey.length <= index + 1) {
                    $scope.data.namey.splice(index + 1, 0, name);
                }
            }
            $scope.HapusD10 = function (index) {
                debugger;
                var norec_diagnosapasien = $scope.data.namey[index].norec_diagnosapasien;
                if (norec_diagnosapasien != "") {
                    deleteIcd10(norec_diagnosapasien)
                }
                $scope.data.namey.splice(index, 1);

                // var name = {kddiagnosa:{id:"", kdDiagnosa:""}, keterangan:""};
                // if($scope.data.names.length <= index+1){
                //      $scope.data.names.splice(index+1,0,name);
                //  }
            }

            $scope.TambahD9 = function (index) {
                debugger
                var name = {
                    kddiagnosatindakan: {
                        id: null,
                        kdDiagnosaTindakan: ""
                    },
                    keterangan: "",
                    norec_diagnosapasien: "",
                    norec_apd: $scope.norecAPD,
                    objectjenisdiagnosafk: "",
                    tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    iskasusbaru: 1,
                    iskasusulama: 0,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                }
                if ($scope.data.namez.length <= index + 1) {
                    $scope.data.namez.splice(index + 1, 0, name);
                }
            }
            $scope.HapusD9 = function (index) {
                debugger
                var norec_diagnosapasien = $scope.data.namez[index].norec_diagnosapasien;
                if (norec_diagnosapasien != "") {
                    deleteIcd9(norec_diagnosapasien)
                }
                $scope.data.namez.splice(index, 1);
                // var name = {kddiagnosa:{id:"", kdDiagnosa:""}, keterangan:""};
                // if($scope.data.names.length <= index+1){
                //      $scope.data.names.splice(index+1,0,name);
                //  }
            }

            $scope.HapusUtama = function (index) {
                debugger;
                $scope.data.names.splice(index, 1);
                // var name = {kddiagnosa:{id:"", kdDiagnosa:""}, keterangan:""};
                // if($scope.data.names.length <= index+1){
                //      $scope.data.names.splice(index+1,0,name);
                //  }
            }
            $scope.Tambah = function () {
                var nomor = 0
                if ($scope.sourceResume == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.namaobat = $scope.item.namaobat
                            data.jumlah = $scope.item.jumlah
                            data.dosis = $scope.item.dosis
                            data.frekuensi = $scope.item.frekuensi
                            data.carapemberian = $scope.item.carapemberian

                            data2[i] = data;
                            $scope.sourceResume = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                } else {
                    data = {
                        no: nomor,
                        namaobat: $scope.item.namaobat,
                        jumlah: $scope.item.jumlah,
                        dosis: $scope.item.dosis,
                        frekuensi: $scope.item.frekuensi,
                        carapemberian: $scope.item.carapemberian,
                    }
                    data2.push(data)
                    $scope.sourceResume = new kendo.data.DataSource({
                        data: data2
                    });

                }
                kosongkan()
            }

            function kosongkan() {
                delete $scope.item.no
                delete $scope.item.namaobat
                delete $scope.item.jumlah
                delete $scope.item.dosis
                delete $scope.item.frekuensi
                delete $scope.item.carapemberian
            }

        }
    ]);
});