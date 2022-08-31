define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('PRBCtrl', ['$scope', '$state', 'MedifirstService',
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
            $scope.dataSelectedRow = {};
            var data2 = [];
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

            $scope.findInsertPRB = function (data) {
                $scope.isRouteLoading = true;
                // if (data2.length == 1) {
                //     var x = {
                //         "data":
                //         {
                //             "kdObat": data2[0].kdObat,
                //             "signa1": data2[0].signa1,
                //             "signa2": data2[0].signa2,
                //             "jmlObat": data2[0].qty
                //         }
                //     };
                // }
                var x = [];
                data2.forEach(function (e) {
                    if (e.value == data) {
                        e.isChecked = true
                        var dataid = {
                            "kdObat": e.kdObat,
                            "signa1": e.signa1,
                            "signa2": e.signa2,
                            "jmlObat": e.qty
                        }
                        x.push(dataid)
                    }
                })
                var dataSend = {
                    "data": {
                        "request": {
                            "t_prb":
                            {
                                "noSep": $scope.item.noSEP,
                                "noKartu": $scope.item.noKartu,
                                "alamat": $scope.item.alamat,
                                "email": $scope.item.email,
                                "programPRB": $scope.item.programPRB.kode,
                                "kodeDPJP": $scope.item.dokterDPJP.kode,
                                "keterangan": $scope.item.keterangan,
                                "saran": $scope.item.saran,
                                "user": $scope.item.pegawaiLogin.namaLengkap,
                                "obat":

                                    x
                                // {
                                //     "kdObat": "00196120124",
                                //     "signa1": "1",
                                //     "signa2": "1",
                                //     "jmlObat": "11"
                                // },
                                // {
                                //     "kdObat": "00011220018",
                                //     "signa1": "1",
                                //     "signa2": "1",
                                //     "jmlObat": "10"
                                // }

                            }
                        }
                    }
                };
                medifirstService.postNonMessage('bridging/bpjs/insert-prb', dataSend).then(function (e) {
                    document.getElementById("jsonInsertPRB").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: {
                        data: $scope.gridPetugasPelaksana._data,
                        filter: { field: "idParent", operator: "eq", value: dataItem.rowNumber }
                    },
                    columns: [
                        {
                            field: "jenisPetugas.jenisPelaksana",
                            title: "Jenis Pelaksana",
                            width: "100px",
                            template: "#= jenisPetugas.jenisPelaksana #"
                        },
                        {
                            field: "listPetugas[0].namalengkap",
                            title: "Nama Pegawai",
                            width: "200px",
                            template: multiSelectArrayToString
                        }
                    ]
                };
            };
            var onChange = function (e) {
                var grid = $(this).data("mainGridOptions");

            }
            $scope.mainGridOptions = {
                sortable: true,
                autoSync: true,
                change: onChange,
                batch: true,
                selectable: 'row',
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [
                    {
                        "field": "Obat",
                        "title": "<h3 align=center>Obat</h3>",
                        "width": "300px"
                    },
                    {
                        "field": "signa1",
                        "title": "<h3 align=center>Signa 1</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "signa2",
                        "title": "<h3 align=center>Signa 2</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "qty",
                        "title": "<h3 align=center>Qty</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        command: {
                            text: "Hapus",
                            width: "50px",
                            align: "center",
                            attributes: { align: "center" },
                            click: removeRowTindakan,
                            imageClass: "k-icon k-delete"
                        },
                        title: "",
                        width: "80px",
                    }
                ],

            };
            function removeRowTindakan(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                if (!dataItem) return

                // grid.removeRow(row);
                $scope.dataTindakan.remove(dataItem);
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].rowNumber == dataItem.rowNumber) {

                        data2.splice(i, 1);
                        // var subTotal = 0;
                        for (var j = data2.length - 1; j >= 0; j--) {
                            // subTotal = subTotal + parseFloat(data2[j].subTotal)
                            // data2[j].rowNumber = j + 1
                        }
                        // $scope.dataTindakan = new kendo.data.DataSource({
                        //   data: data2
                        // });
                        for (var j = bacot.length - 1; j >= 0; j--) {
                            if (bacot[j].id_indikator == dataItem.id_indikator) {
                                bacot.splice(j, 1);
                            }
                        }

                    }
                }


                var subTotal = 0;
                for (var i = data2.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat(data2[i].subTotal)
                }
                $scope.item.totalAlls = $scope.formatRupiah(subTotal, 'Rp.')

                var gridPetugas = $scope.gridPetugasPelaksana._data;
                if (gridPetugas.length != 0) {
                    for (var i = gridPetugas.length - 1; i >= 0; i--) {
                        if (gridPetugas[i].idParent == dataItem.rowNumber) {
                            gridPetugas.splice(i, 1);
                            $scope.gridPetugasPelaksana.add(gridPetugas);
                        }
                    }
                }





            }
            $scope.tambahTindakan = function () {
                $scope.tambahTindakans(false);
            }
            $scope.tambahTindakans = function () {
                var nomor = 0
                if ($scope.dataTindakan == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};

                data = {
                    rowNumber: nomor,
                    Obat: $scope.item.obat.nama,
                    kdObat: $scope.item.obat.kode,
                    signa1: $scope.item.signa1,
                    signa2: $scope.item.signa2,
                    qty: $scope.item.jumlahObat
                }
                data2.push(data)

                $scope.dataTindakan = new kendo.data.DataSource({
                    data: data2
                });

                $scope.show = true;
                kosongkan();
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
                medifirstService.post("bridging/bpjs/mjkn/antrian/updatejadwal", dataMasuk

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
                medifirstService.post("bridging/bpjs/mjkn/antrian/batalantrian", bokking

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
                medifirstService.post("bridging/bpjs/mjkn/antrian/waktuTaskid", bokking
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
                medifirstService.post("bridging/bpjs/mjkn/antrian/updateantrian", data
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
                medifirstService.post("bridging/bpjs/mjkn/antrian/tambahantrian", bokking
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
                medifirstService.post("bridging/bpjs/mjkn/antrian/dashboardPerTgl"

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
                medifirstService.post("bridging/bpjs/mjkn/antrian/dashboardPerBln"

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

                // medifirstService.getPart("laboratorium/poli-bpjs").then(function (data) {
                //     $scope.listStatusKlaim = data;
                // });
                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + 10
                ).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDPJP = e.data.response.list;
                    }
                })
                medifirstService.getPart("bridging/bpjs2/get-poli-part", true, true, 10).then(function (data) {
                    $scope.listPoli = data;

                });
                medifirstService.get("bridging/bpjs2/get-programPRB").then(function (data) {
                    $scope.listprogramPRB = data.data.response.list;
                });
                medifirstService.getPart("bridging/bpjs2/get-obatprb", true, true, 10).then(function (data) {
                    $scope.listObat = data;
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