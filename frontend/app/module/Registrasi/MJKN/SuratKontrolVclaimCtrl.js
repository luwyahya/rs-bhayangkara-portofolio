define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('SuratKontrolVclaimCtrl', ['$scope', '$state', 'MedifirstService',
        function ($scope, $state, medifirstService) {
            $scope.now = new Date();
            $scope.nav = function (state) {
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            $scope.histori = {}
            $scope.ReferensiDokter = {};
            $scope.klaim = {};
            $scope.raharja = {}
            $scope.mjkn = {}
            $scope.mjkn1 = {}
            $scope.item = {};
            $scope.item.tglRencanaKontrol = $scope.now
            $scope.item.tglRencanaKontrolupdate = $scope.now
            $scope.item.tglRencanaKontrolspri = $scope.now
            $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();
            $scope.clear = function () {

                $scope.isRouteLoading = false;



            };
            LoadCombo()
            $scope.isShowPembuatanSep = false;
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.showPembuatanSep = function () {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }
            $scope.showApproval = function () {
                $scope.isShowApproval = !$scope.isShowApproval;
            }
            $scope.showTglPulang = function () {
                $scope.isShowTglPulang = !$scope.isShowTglPulang;
            }
            $scope.showIntegrasi = function () {
                $scope.isShowIntegrasi = !$scope.isShowIntegrasi;
            }
            $scope.clear();
            $scope.jenisPelayananKunjungan = [{
                "id": 1, "nama": "Rawat Inap   "
            }, {
                "id": 2, "nama": "Rawat Jalan   "
            }];
            $scope.listPost = [{
                "id": 3, "name": "tanggal entri"
            }, {
                "id": 4, "name": "tanggal rencana kontrol"
            }];
            $scope.listJenisSurat = [{
                "id": 5, "name": "SPRI"
            }, {
                "id": 6, "name": "Rencana Kontrol"
            }];
            // ***

            $scope.findInsertSuratKontrol = function (data) {
                $scope.isRouteLoading = true;
                var dataSend = {
                    "data": {
                        "request": {
                            "noSEP": $scope.item.noSEP,
                            "kodeDokter": $scope.item.dokterDPJP.kode,
                            "poliKontrol": $scope.item.poli.kode,
                            "tglRencanaKontrol": new moment($scope.item.tglRencanaKontrol).format('YYYY-MM-DD'),
                            "user": "testing" //$scope.item.pegawaiLogin.namaLengkap
                        }
                    }
                };
                medifirstService.postNonMessage('bridging/bpjs/insert-surat-kontrol', dataSend).then(function (e) {
                    document.getElementById("jsonInsertSuratKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.saveJadwal = function (data) {

                $scope.isRouteLoading = true;
                debugger
                var jadwal = {
                    hari: $scope.mjkn.hari,
                    buka: "08:00",
                    tutup: "13:00"
                }
                var data = {
                    kodepoli: $scope.mjkn.ruanganDokter.kdpoli,
                    kodesubspesialis: $scope.mjkn.ruanganDokter.kdpoli,
                    kodedokter: $scope.mjkn.dokterUpdate.idhafis,
                    jadwal: [jadwal]

                };

                var dataMasuk = {
                    data

                }
                medifirstService.post("bridging/bpjs2/mjkn/antrian/updatejadwal", dataMasuk

                ).then(function (e) {
                    document.getElementById("jsonUpdateDokter").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.batalBoooking = function (data) {

                $scope.isRouteLoading = true;
                var bokking = {
                    kodebooking: $scope.booking.kodeBooking,
                    keterangan: $scope.booking.keterangan
                }
                // var array ={
                //     bokking
                // }
                medifirstService.post("bridging/bpjs2/mjkn/antrian/batalantrian", bokking

                ).then(function (e) {
                    document.getElementById("jsonBatalBooking").innerHTML = JSON.stringify(e, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.taskList = function (data) {

                $scope.isRouteLoading = true;
                var bokking = {
                    kodebooking: $scope.task.kodeBooking
                }
                // var array ={
                //     bokking
                // }
                medifirstService.post("bridging/bpjs2/mjkn/antrian/waktuTaskid", bokking
                ).then(function (e) {
                    document.getElementById("jsonWkatuTask").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.taskListUpdate = function (data) {

                $scope.isRouteLoading = true;
                var data = {
                    kodebooking: $scope.task.kodeBooking,
                    taskid: $scope.task.id,
                    // waktu:
                }
                // var array ={
                //     bokking
                // }
                medifirstService.post("bridging/bpjs2/mjkn/antrian/updateantrian", data
                ).then(function (e) {
                    document.getElementById("jsonWkatuTaskUpdate").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }


            $scope.isiAntrean = function (data) {

                $scope.isRouteLoading = true;
                var bokking = {
                    kodebooking: $scope.task.kodeBooking,
                    jenispasien: 'JKN',
                    nomorkartu: $scope.task.nomorkartu,
                    nik: $scope.task.nik,
                    nohp: $scope.task.noHp,
                    kodepoli: $scope.mjkn.ruanganDokter.nmpoli,
                    namapoli: $scope.mjkn.ruanganDokter.kdpoli,
                    pasienbaru: 0,
                    norm: $scope.task.nom,
                    tanggalperiksa: $scope.task.tgl,
                    kodedokter: $scope.task.dokterUpdate.idhafis,
                    namadokter: $scope.task.dokterUpdate.namahafis,
                    jampraktek: $scope.mjkn.jam,
                    jeniskunjungan: 1,
                    nomorreferensi: $scope.task.noRef,
                    nomorantrean: 'B-12',
                    angkaantrean: 12,
                    estimasidilayani: '1615869169000',
                    sisakuotajkn: 5,
                    kuotajkn: 30,
                    sisakuotanonjkn: 5,
                    kuotanonjkn: 30,
                    keterangan: 'Peserta harap 30 menit lebih awal guna pencatatan administrasi'

                };
                // var array ={
                //     bokking
                // }
                medifirstService.post("bridging/bpjs2/mjkn/antrian/tambahantrian", bokking
                ).then(function (e) {
                    document.getElementById("jsonAntrean").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.dasboardHarian = function (data) {

                $scope.isRouteLoading = true;

                // var array ={
                //     bokking
                // }
                medifirstService.post("bridging/bpjs2/mjkn/antrian/dashboardPerTgl"

                ).then(function (e) {
                    document.getElementById("jsonDasboarHarian").innerHTML = JSON.stringify(e, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.dasboardBulan = function (data) {

                $scope.isRouteLoading = true;

                // var array ={
                //     bokking
                // }
                medifirstService.post("bridging/bpjs2/mjkn/antrian/dashboardPerBln"

                ).then(function (e) {
                    document.getElementById("jsonDasboarBulan").innerHTML = JSON.stringify(e, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }


            // KLAIM

            $scope.jenisPelayananKlaim = [{
                "id": 1, "hari": "senin"
            }, {
                "id": 2, "hari": "selasa"
            }, {
                "id": 3, "hari": "rabu"
            }, {
                "id": 4, "hari": "kamis"
            }, {
                "id": 5, "hari": "jumat"
            }, {
                "id": 6, "hari": "sabtu"
            }];
            $scope.jam = [{
                "id": 1, "jam": "08:00"
            }, {
                "id": 2, "jam": "09:00"
            }, {
                "id": 3, "jam": "10:00"
            }, {
                "id": 4, "jam": "11:00"
            }, {
                "id": 5, "jam": "12:00"
            }];
            $scope.jam1 = [{
                "id1": 1, "jam1": "13:00"
            }, {
                "id1": 2, "jam1": "14:00"
            }, {
                "id1": 3, "jam1": "15:00"
            }, {
                "id1": 4, "jam1": "16:00"
            }, {
                "id1": 5, "jam1": "17:00"
            }];
            function LoadCombo() {

                medifirstService.getPart("laboratorium/poli-bpjs").then(function (data) {
                    $scope.listStatusKlaim = data;
                });
                medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + 10
                ).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDPJP = e.data.response.list;
                    }
                })
                medifirstService.getPart("bridging/bpjs/get-poli-part", true, true, 10).then(function (data) {
                    $scope.listPoli = data;

                });
            }

            $scope.findKlaim = function (data) {
                $scope.isRouteLoading = true;
                var data = {
                    jenispelayanan: data.jenisPel,
                    status: data.statusKlaim.value,
                    tglsep: new moment(data.tglSep).format('YYYY-MM-DD')
                }
                medifirstService.get("bridging/bpjs/get-monitoring-klaim?tglsep="
                    + data.tglsep
                    + "&jenispelayanan="
                    + data.jenispelayanan
                    + "&status="
                    + data.status
                ).then(function (e) {
                    document.getElementById("jsonKlaim").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // END KLAIM

            // HISTROI
            $scope.findHistori = function (data) {
                $scope.isRouteLoading = true;

                medifirstService.get("bridging/bpjs/get-monitoring-historipelayanan-peserta?noKartu="
                    + data.noKartu
                    + "&tglMulai="
                    + moment(data.tglAwal).format('YYYY-MMDD')
                    + "&tglAkhir="
                    + moment(data.tglAkhir).format('YYYY-MMDD')
                ).then(function (e) {
                    document.getElementById("jsonHistori").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // RAHARJA

            // HISTROI
            $scope.findRaharja = function (data) {
                $scope.isRouteLoading = true;

                medifirstService.get("bridging/bpjs/get-monitoring-klaim-jasaraharja?tglMulai="
                    + moment(data.tglAwal).format('YYYY-MMDD')
                    + "&tglAkhir="
                    + moment(data.tglAkhir).format('YYYY-MMDD')
                ).then(function (e) {
                    document.getElementById("jsonRaharja").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
        }
    ]);
});