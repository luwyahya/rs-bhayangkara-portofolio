define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('MenuSEPCtrl', ['$rootScope', '$scope', '$state', 'ModelItem', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, ModelItem, DateHelper, medifirstService) {
            $scope.now = new Date();
            var dataKabupaten = '';
            var dataKecamatan = '';
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }

            $scope.approval = {};
            $scope.pengajuan = {};
            $scope.model = {};
            $scope.suplesi = {};
            $scope.item = {};

            $scope.isShowPembuatanSep = true;
            $scope.isShowPotensi = false;
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
            $scope.item.lakalantas = false;

            $scope.jenisPelayanan = [{
                "idjenispelayanan": 1, "jenispelayanan": "Rawat Inap"
            }, {
                "idjenispelayanan": 2, "jenispelayanan": "Rawat Jalan"
            }];
            $scope.jenisPengajuan = [{
                "idjenispengajuan": 16, "jenispengajuan": "pengajuan backdate"
            }, {
                "idjenispengajuan": 27, "jenispengajuan": "pengajuan finger print"
            }];
            $scope.listPost = [{
                "id": 12, "name": "INSERT"
            }, {
                "id": 13, "name": "UPDATE"
            }];
            $scope.kelasRawat = [{
                "idkelas": 3, "namakelas": "Kelas I", "value": 1
            }, {
                "idkelas": 4, "namakelas": "Kelas II", "value": 2
            }, {
                "idkelas": 5, "namakelas": "Kelas III", "value": 3
            }];
            $scope.lakaLantas = [{
                "idlakalantas": 6, "lakalantas": "Ya", "value": 1
            }, {
                "idlakalantas": 7, "lakalantas": "Tidak", "value": 0
            }];
            $scope.asalRujukan = [{
                "idasalrujukan": 8, "asalrujukan": "Faskes 1", "value": 1
            }, {
                "idasalrujukan": 9, "asalrujukan": "Faskes 2 (RS)", "value": 2
            }];
            $scope.poliEksekutif = [{
                "id": 10, "eks": "Eksekutif", "value": 0
            }, {
                "id": 11, "eks": "Reguler", "value": 1
            }];

            // "penjamin": "{penjamin lakalantas -> 1=Jasa raharja PT, 2=BPJS Ketenagakerjaan, 3=TASPEN PT, 4=ASABRI PT} jika lebih dari 1 isi -> 1,2 (pakai delimiter koma)",

            $scope.penjamin = [{
                "id": 12, "name": "Jasa Raharja PT", "value": 1
            }, {
                "id": 13, "name": "BPJS Ketenagakerjaan", "value": 2
            }, {
                "id": 14, "name": "TASPEN PT", "value": 3
            }, {
                "id": 15, "name": "ASABRI PT", "value": 4
            }];

            $scope.isRouteLoading = true;
            $scope.clear = function () {
                $scope.item = {};

                $scope.suplesi = {
                    tglSep: $scope.now,
                };
                $scope.approval = {
                    tglSep: $scope.now,
                }
                $scope.integ = {};
                $scope.pengajuan = {
                    tglSep: $scope.now,
                }
                $scope.tglplg = {
                    tglPulang: $scope.now,
                }
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                var tanggals = DateHelper.getDateTimeFormatted3($scope.now);
                $scope.item = {
                    tglSep: $scope.now,
                };
                $scope.item.tglRujukan = tanggals + " 00:00";
                $scope.item.asalRujukan = $scope.asalRujukan[1];
                $scope.item.jenisPelayanan = $scope.jenisPelayanan[1];
                $scope.item.kelasRawat = $scope.kelasRawat[0];
                // $scope.item.lakaLantas = $scope.lakaLantas[1];
                $scope.item.poliEksekutif = $scope.poliEksekutif[1];
                $scope.item.cekNomorPeserta = true;

            };
            $scope.clear();
            $scope.findDataBySep = function (data) {
                $scope.isRouteLoading = true;
                manageServicePhp.cariSep(data).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }


            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            // *** CREATE SEP


            $scope.checkKepesertaanByNoBpjs = function () {
                if (!$scope.item.cekNomorPeserta) return;
                if ($scope.item.noKepesertaan === '' || $scope.item.noKepesertaan === undefined) return;
                $scope.isLoadingNoKartu = true;
                medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + $scope.item.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.item.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.item.namaPeserta = e.data.response.peserta.nama;
                        $scope.item.tglLahir = tglLahir;
                        $scope.item.noIdentitas = e.data.response.peserta.nik;
                        $scope.item.kelasBridg = {
                            id: parseInt(e.data.response.peserta.hakKelas.kode),
                            kdKelas: e.data.response.peserta.hakKelas.kode,
                            nmKelas: e.data.response.peserta.hakKelas.keterangan,
                            namakelas: e.data.response.peserta.hakKelas.keterangan,
                        };

                        $scope.item.kelasRawat = { idkelas: $scope.item.kelasBridg.id, namakelas: $scope.item.kelasBridg.nmKelas }
                        $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                        $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                        $scope.item.ppkRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;

                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });

                var arrKdPpkRUjukan = $scope.item.namaAsalRujukan.split(' - ');
                if (arrKdPpkRUjukan != undefined) {
                    var kdPpkRujukan = arrKdPpkRUjukan[0];
                    var namaPpkRujukan = arrKdPpkRUjukan[1];
                }

            }


            $scope.currentListPenjamin = [];
            $scope.addListPenjamin = function (data) {
                var index = $scope.currentListPenjamin.indexOf(data);
                if (_.filter($scope.currentListPenjamin, {
                    id: data.id
                }).length === 0)
                    $scope.currentListPenjamin.push(data);
                else {
                    $scope.currentListPenjamin.splice(index, 1);
                }

            }
            $scope.clear();
            $scope.$watch('item.jenisPelayanan', function (e) {
                if (!e) return;
                if (e.jenispelayanan.indexOf('Inap') >= 0) {
                    medifirstService.get("bridging/bpjs2/get-ruangan-ri").then(function (data) {
                        $scope.ruangans = data.data.data;
                    })
                } else {
                    medifirstService.get("bridging/bpjs2/get-ruangan-rj").then(function (data) {
                        $scope.ruangans = data.data.data;
                    })
                    $scope.item.kelasRawat = $scope.kelasRawat[2];
                }
            })
            $scope.$watch('item.lakaLantas', function (e) {
                if (!e) return;
                if (e.lakalantas.indexOf('Ya') >= 0) {
                    $scope.LakaYa = true;
                    $scope.disableLokasi = false;
                    $scope.item.lokasiLaka = undefined;
                } else {
                    $scope.LakaYa = false;
                    $scope.disableLokasi = true;
                }
            })

            $scope.generateSep = function () {
                if (!$scope.item.tipe) {
                    messageContainer.error('Pilih Tipe Post');
                    return;
                } else {

                    if ($scope.item.tipe.id === 12) {
                        $scope.status = 'Insert';
                        $scope.generateSepss();
                    } else {
                        $scope.status = 'Update';
                        $scope.generateSepss();
                    }
                }
            }
            $scope.generateSepss = function (data) {
                var listRawRequired = [
                    "item.noCm|ng-model|Nomor CM",
                    "item.noKepesertaan|ng-model|Nomor kartu",
                    "item.tglSep|k-ng-model|Tanggal Sep",
                    // "item.noRujukan|ng-model|Nomor Rujukan",
                    "item.tglRujukan|k-ng-model|Tanggal Rujukan",
                    // "item.jenisPelayanan|ng-model|Jenis Pelayanan",
                    "item.poliTujuan|k-ng-model|Poli Tujuan",
                    "item.diagnosa|ng-model|Diagnosa Awal",
                    // "item.kelasRawat|ng-model|Kelas Rawat",
                    // "item.lakaLantas|ng-model|Laka Lantas",
                ];
                if ($scope.item.lakalantas === true) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.currentListPenjamin.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjamin[i].value
                        b = "," + c
                        a = a + b
                    }
                    var listPenjamin = a.slice(1, a.length)

                }
                var kdPpkRujukan = "";
                if ($scope.item.faskesRujukan == true) {
                    if ($scope.item.namaAsalRujukanBrid != undefined) {
                        var arrKdPpkRUjukanBrid = $scope.item.namaAsalRujukanBrid.split(' - ');
                        kdPpkRujukan = arrKdPpkRUjukanBrid[0];
                    }
                } else {
                    if ($scope.item.namaAsalRujukan != undefined) {
                        var arrKdPpkRUjukan = $scope.item.namaAsalRujukan.split(' - ');
                        kdPpkRujukan = arrKdPpkRUjukan[0];
                    }
                }
                var kdDiagnoosa = "";
                if ($scope.item.diagnosa != undefined) {
                    var arrkdDiag = $scope.item.diagnosa.split(' - ');
                    kdDiagnoosa = arrkdDiag[0];
                }


                var poliTujuans = ""
                if ($scope.item.poliTujuan != undefined) {
                    poliTujuans = $scope.item.poliTujuan.kdinternal
                }
                var kdPropinsi = ""
                if ($scope.item.propinsi != undefined)
                    kdPropinsi = $scope.item.propinsi.kode

                var kdKabupaten = ""
                if ($scope.item.kabupaten != undefined)
                    kdKabupaten = $scope.item.kabupaten.kode

                var kdKecamatan = ""
                if ($scope.item.kecamatan != undefined)
                    kdKecamatan = $scope.item.kecamatan.kode

                // if(data.lakaLantas.value === 1)
                //     listRawRequired.push("item.lokasiLaka|ng-model|Lokasi Laka Lantas");
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.isRouteLoading = true;

                    var dataUpdate = {
                        "nosep": $scope.item.noSep === undefined ? "" : $scope.item.noSep,
                        "kelasrawat": $scope.item.kelasRawat.value,
                        "nomr": $scope.item.noCm,
                        "asalrujukan": $scope.item.asalRujukan.value,
                        "tglrujukan": new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                        "norujukan": $scope.item.noRujukan === undefined ? 0 : $scope.item.noRujukan,
                        "ppkrujukan": kdPpkRujukan,
                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                        "diagnosaawal": kdDiagnoosa,
                        // "politujuan": poliTujuans,
                        "eksekutif": $scope.item.poliEksekutif.value,
                        "cob": $scope.item.cob === true ? "1" : "0",
                        "katarak": $scope.item.katarak === true ? "1" : "0",
                        "lakalantas": $scope.item.lakalantas === true ? "1" : "0",
                        "penjamin": listPenjamin,
                        "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                        "tglKejadian": new moment($scope.item.tglKejadian).format('YYYY-MM-DD'),
                        "suplesi": $scope.item.suplesi === true ? "1" : "0",
                        "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                        "kdPropinsi": kdPropinsi,
                        "kdKabupaten": kdKabupaten,
                        "kdKecamatan": kdKecamatan,
                        "noSurat": $scope.item.skdp != undefined ? $scope.item.skdp : "",
                        "kodeDPJP": $scope.item.dokterDPJP != undefined ? $scope.item.dokterDPJP.kode : "",
                        "notelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,

                    };


                    var dataInsert = {
                        "nokartu": $scope.item.noKepesertaan,
                        "tglsep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                        "jenispelayanan": $scope.item.jenisPelayanan.idjenispelayanan,
                        "kelasrawat": $scope.item.kelasRawat.value,
                        "nomr": $scope.item.noCm,
                        "asalrujukan": $scope.item.asalRujukan.value,
                        "tglrujukan": new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                        "norujukan": $scope.item.noRujukan === undefined ? 0 : $scope.item.noRujukan,
                        "ppkrujukan": kdPpkRujukan,
                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                        "diagnosaawal": kdDiagnoosa,
                        "politujuan": poliTujuans,
                        "eksekutif": $scope.item.poliEksekutif.value,
                        "cob": $scope.item.cob === true ? "1" : "0",
                        "katarak": $scope.item.katarak === true ? "1" : "0",
                        "lakalantas": $scope.item.lakalantas === true ? "1" : "0",
                        "penjamin": listPenjamin,
                        "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                        "tglKejadian": new moment($scope.item.tglKejadian).format('YYYY-MM-DD'),
                        "suplesi": $scope.item.suplesi === true ? "1" : "0",
                        "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                        "kdPropinsi": kdPropinsi,
                        "kdKabupaten": kdKabupaten,
                        "kdKecamatan": kdKecamatan,
                        "noSurat": $scope.item.skdp != undefined ? $scope.item.skdp : "",
                        "kodeDPJP": $scope.item.dokterDPJP != undefined ? $scope.item.dokterDPJP.kode : "",
                        "notelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,
                    };
                    if ($scope.status == 'Insert') {
                        medifirstService.postNonMessage("bridging/bpjs2/insert-sep-v1.1", dataInsert).then(function (e) {
                            // manageServicePhp.generateSEP(dataGen).then(function (e) {
                            document.getElementById("jsonCreateSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                            window.messageContainer.error(e.data.metaData.message)
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        })
                    } else {
                        medifirstService.putNonMessage("bridging/bpjs2/update-sep-v1.1", dataUpdate).then(function (e) {
                            document.getElementById("jsonCreateSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                            window.messageContainer.error(e.data.metaData.message)
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        })
                    }


                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }


            $scope.getPpkRujukan = function () {
                if ($scope.item.namaAsalRujukanBrid.length >= 3) {
                    medifirstService.get("bridging/bpjs2/get-ref-faskes?kdNamaFaskes="
                        + $scope.item.namaAsalRujukanBrid
                        + "&jenisFakses="
                        + "2"

                    )
                        .then(function (e) {
                            if (e.statResponse) {
                                if (e.data.metaData.code == 200) {
                                    var result = e.data.response.faskes;
                                    for (var x = 0; x < result.length; x++) {
                                        var element = result[x];
                                        element.nama = element.kode + ' - ' + element.nama
                                    }
                                    $scope.listPpkRujukan = result;
                                }
                            }

                        })
                }
            }

            $scope.getDiagnosa = function () {
                if ($scope.item.diagnosa.length >= 3) {
                    medifirstService.get("bridging/bpjs2/get-ref-diagnosa?kdNamaDiagnosa="
                        + $scope.item.diagnosa
                    )
                        .then(function (e) {
                            if (e.data.metaData.code == 200) {
                                $scope.listDiagnosa = e.data.response.diagnosa;
                            }
                            document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                        })
                }
            }
            // *** END CREATE SEP

            // // ** PERTANYAAN HAPUS SEP
            // $scope.pertanyaanHapusDataSep = function (data) {
            //     debugger;
            //     $scope.isRouteLoading = true;
            //     data
            //     // medifirstService.deleteNonMessage("bridging/bpjs2/delete-sep?nosep=" + data).then(function (e) {
            //     //     document.getElementById("jsonHapusSep").innerHTML = JSON.stringify(e.data, undefined, 4);
            //     // }).then(function () {
            //     //     $scope.isRouteLoading = false;
            //     // });
            // }
            // // **

            //delete sep
            $scope.DeleteSep = function () {
                // hapusSep()
                $scope.popUpPassword2.center().open();
            }
            $scope.hapusSEP = function () {
                debugger
                if ($scope.item.password2 != "kueapem") {
                    toastr.error('Password Salah !')
                    return
                } else {
                    $scope.popUpPassword2.close();
                    $scope.item.password2 = undefined
                    $scope.hapusDataSep($scope.item.data)
                }
            }


            // ** HAPUS SEP
            $scope.hapusDataSep = function (data) {
                debugger
                $scope.isRouteLoading = true;
                medifirstService.deleteNonMessage("bridging/bpjs2/delete-sep?nosep=" + data).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        debugger
                        $scope.saveLogging('Hapus SEP', 'no SEP', data, 'Hapus No SEP ' + data + ' melalui BPJS Tools pada sistem Transmedic');
                    }
                    debugger
                    document.getElementById("jsonHapusSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    // if (e.data.metaData.code === "200") {
                    //     $scope.saveLogging('Hapus SEP', 'no SEP', data, 'Hapus No SEP ' + data + ' melalui BPJS Tools pada sistem Transmedic');
                    //     // $scope.model.generateNoSEP = false;
                    //     // $scope.disableSEP = false;
                    //     // $scope.model.noSep = '';
                    // }
                    $scope.isRouteLoading = false;
                });
            }
            // **

            // ** Cari SEP
            $scope.findDataBySep = function (data) {
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + data).then(function (e) {
                    document.getElementById("jsonCekSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // **

            // ** Cari SUPLESI
            $scope.findSuplesi = function (data) {
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs2/get-suplesi-jasaraharja?noKartu=" + data.noKartu
                    + "&tglPelayanan=" + moment(data.tglSep).format('YYYY-MM-DD')).then(function (e) {
                        document.getElementById("jsonSuplesiJasa").innerHTML = JSON.stringify(e.data, undefined, 4);
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    });
            }
            // ** POST APROVAL
            $scope.postPengajuanSep = function () {
                $scope.isRouteLoading = true;
                var postjenisPengajuan = ""
                if ($scope.pengajuan.jenisPengajuan.idjenispengajuan == 16) {
                    postjenisPengajuan = 1
                } else if ($scope.pengajuan.jenisPengajuan.idjenispengajuan == 27) {
                    postjenisPengajuan = 2
                }
                var dataGen = {
                    nokartu: $scope.approval.noKepesertaan,
                    tglsep: new moment($scope.approval.tglSep).format('YYYY-MM-DD'),
                    jenispelayanan: $scope.approval.jenisPelayanan.idjenispelayanan,
                    postjenisPengajuan: postjenisPengajuan,
                    keterangan: $scope.approval.keterangan === undefined ? "" : $scope.approval.keterangan
                };

                medifirstService.postNonMessage('bridging/bpjs2/post-aprovalSEP', dataGen).then(function (e) {
                    document.getElementById("jsonResApproval").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }
            $scope.postPengajuan = function () {
                $scope.isRouteLoading = true;
                var postjenisPengajuan = ""
                if ($scope.pengajuan.jenisPengajuan.idjenispengajuan == 16) {
                    postjenisPengajuan = 1
                } else if ($scope.pengajuan.jenisPengajuan.idjenispengajuan == 27) {
                    postjenisPengajuan = 2
                }
                var dataGen = {
                    nokartu: $scope.pengajuan.noKepesertaan,
                    tglsep: new moment($scope.pengajuan.tglSep).format('YYYY-MM-DD'),
                    jenispelayanan: $scope.pengajuan.jenisPelayanan.idjenispelayanan,
                    postjenisPengajuan: postjenisPengajuan,
                    keterangan: $scope.pengajuan.keterangan === undefined ? "" : $scope.pengajuan.keterangan
                };

                medifirstService.postNonMessage('bridging/bpjs2/post-pengajuan', dataGen).then(function (e) {
                    document.getElementById("jsonResApprovalPengajuan").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }
            // **update PULANG
            $scope.updateTglPulang = function (data) {
                $scope.isRouteLoading = true;
                // var dateGenerate = {
                //     nosep: data.noSep,
                //     tglpulang: new moment(data.tglPulang).format('YYYY-MM-DD')
                // }
                var dateGenerate = {
                    'data': {
                        "request":
                        {
                            "t_sep":
                            {
                                "noSep": data.noSep,
                                "tglPulang": new moment(data.tglPulang).format('YYYY-MM-DD'),
                                "user": "ramdan"
                            }
                        }

                    }
                }

                medifirstService.putNonMessage('bridging/bpjs2/update-tglpulang', dateGenerate).then(function (e) {
                    document.getElementById("jsonTglPulang").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.IntegrasiInaCBG = function (data) {
                $scope.isRouteLoading = true;
                medifirstService.get('bridging/bpjs2/get-integrasi-inacbg?noSEP=' + data).then(function (e) {
                    document.getElementById("jsonInteg").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.checkKepesertaanByNoSep = function () {
                if (!$scope.item.cekNomorSep) return;
                if ($scope.item.noSep === '' || $scope.item.noSep === undefined) return;
                $scope.isLoadingNoKartu = true;
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.item.noSep).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.item.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.item.namaPeserta = e.data.response.peserta.nama;
                        $scope.item.tglLahir = tglLahir;
                        $scope.item.noIdentitas = e.data.response.peserta.nik;
                        $scope.item.kelasBridg = {
                            id: parseInt(e.data.response.peserta.hakKelas.kode),
                            kdKelas: e.data.response.peserta.hakKelas.kode,
                            nmKelas: e.data.response.peserta.hakKelas.keterangan,
                            namakelas: e.data.response.peserta.hakKelas.keterangan,
                        };

                        $scope.item.kelasRawat = { idkelas: $scope.item.kelasBridg.id, namakelas: $scope.item.kelasBridg.nmKelas }
                        $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                        $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                        $scope.item.ppkRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;

                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });

                var arrKdPpkRUjukan = $scope.item.namaAsalRujukan.split(' - ');
                if (arrKdPpkRUjukan != undefined) {
                    var kdPpkRujukan = arrKdPpkRUjukan[0];
                    var namaPpkRujukan = arrKdPpkRUjukan[1];
                }

            }
            $scope.checkKepesertaanByNoReg = function () {
                if (!$scope.item.cekNoRegistrasi) return;
                if ($scope.item.noRegistrasi === '' || $scope.item.noRegistrasi === undefined) return;
                $scope.isLoadingNoReg = true;
                medifirstService.get("bridging/bpjs2/get-sep-bynoregistrasi?noRegistrasi="
                    + $scope.item.noRegistrasi)
                    .then(function (dat) {
                        if (dat.data.data.length > 0) {
                            toastr.info('Sukses', 'Info')
                            $scope.item.noSep = dat.data.data[0].nosep;
                            $scope.item.noRujukan = dat.data.data[0].norujukan;
                            var tglRujukan = new Date(dat.data.data[0].tglrujukan)
                            $scope.item.tglRujukan = tglRujukan;
                            $scope.item.noCm = dat.data.data[0].nocm;
                            $scope.item.ppkRujukan = dat.data.data[0].kdprovider + " - " + dat.data.data[0].nmprovider;
                            // $scope.item.ppkRujukan=dat.data.data[0].nmprovider;
                            $scope.item.kdPpkRujukan = dat.data.data[0].kdprovider;

                            if (dat.data.data[0].israwatinap == 'true') {
                                isRawatInap = 'true';
                                $scope.item.jenisPelayanan = $scope.jenisPelayanan[0];
                            } else {
                                isRawatInap = 'false';
                                $scope.item.jenisPelayanan = $scope.jenisPelayanan[1];
                            }

                            $scope.ruangans = ([{ id: dat.data.data[0].objectruanganlastfk, namaruangan: dat.data.data[0].namaruangan }])
                            $scope.item.poliTujuan = {
                                id: dat.data.data[0].objectruanganlastfk,
                                namaruangan: dat.data.data[0].namaruangan,
                                kdinternal: dat.data.data[0].kdinternal
                            };
                            if (dat.data.data[0].jenispelayanan == "REGULER") {
                                $scope.item.poliEksekutif = $scope.poliEksekutif[1]
                            } else {
                                $scope.item.poliEksekutif = $scope.poliEksekutif[0]
                            }
                            // $scope.item.poliEksekutif={value:parseInt(dat.data.data[0].objectjenispelayananfk),eks:dat.data.data[0].jenispelayanan}

                            if (dat.data.data[0].namakelas == 'Kelas I') {
                                $scope.item.kelasRawat = $scope.kelasRawat[0];
                            } else if (dat.data.data[0].namakelas == 'Kelas II') {
                                $scope.item.kelasRawat = $scope.kelasRawat[1];
                            } else if (dat.data.data[0].namakelas == 'Kelas III') {
                                $scope.item.kelasRawat = $scope.kelasRawat[2];
                            } else {
                                $scope.item.kelasRawat = $scope.kelasRawat[2];
                            }

                            $scope.item.diagnosa = dat.data.data[0].kddiagnosa;
                            $scope.item.noTelp = dat.data.data[0].notelepon
                        } else
                            toastr.error('Data Tidak Ada', 'Info')

                        $scope.isLoadingNoReg = false;
                    }, function (err) {
                        $scope.isLoadingNoReg = false;
                    });

            }
            medifirstService.getPart("bridging/bpjs2/get-ref-faskes", true, true, 10).then(function (data) {
                $scope.listFaskesRujukan = data;
            });

            medifirstService.getPart("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + $scope.model.rawatInap == true ? "1" : "2"
                + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + 10, true, true, 10).then(function (data) {
                    $scope.listDPJP = data;
                });

            medifirstService.getPart("bridging/bpjs2/get-ref-propinsi", true, true, 10).then(function (data) {
                $scope.listPropinsi = data;
            });
            var kodePropinsi = "";
            var kodeKab = "";
            $scope.$watch('item.propinsi', function (e) {
                if (e === undefined) return;
                kodePropinsi = e.kode
                medifirstService.getPart("bridging/bpjs2/get-ref-kabupaten?kodePropinsi=" + kodePropinsi, true, true, 10).then(function (data) {
                    $scope.listKabupaten = data;
                    if (dataKabupaten != '')
                        $scope.item.kabupaten = dataKabupaten
                });
            })

            $scope.$watch('item.kabupaten', function (e) {
                if (e === undefined) return;
                kodeKab = e.kode
                medifirstService.getPart("bridging/bpjs2/get-ref-kecamatan?kodeKabupaten=" + kodeKab, true, true, 10).then(function (data) {
                    $scope.listKecamatan = data;
                    if (dataKecamatan != '')
                        $scope.item.kecamatan = dataKecamatan
                });
            })


        }
    ]);
});