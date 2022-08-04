define(['initialize', 'Configuration'], function(initialize, configuration) {
    'use strict';
    initialize.controller('InputTindakanDiagnosaCtrl', ['$scope', '$parse', '$state', 'MedifirstService', 'CacheHelper', 'ModelItem',
        function($scope, $parse, $state, medifirstService, cacheHelper, ModelItem) {
            $scope.now = new Date();
            $scope.currentNorecPD = $state.params.norecPD;
            $scope.currentNorecAPD = $state.params.norecAPD;
            $scope.item = {};
            $scope.item.tglPelayanan = $scope.now;
            $scope.isNext = true;
            $scope.isKembali = true;
            $scope.item.pasiens = [];
            $scope.isBatal = true;
            $scope.flag = '';
            $scope.pesan = '';
            $scope.item.tidakDitemukan = false;
            $scope.item.poneksudah = false;
            $scope.lanjutPetugas = false;
            $scope.listPertanyaan = [];
            $scope.isShowPembuatanSep = true
            var bacot = [];

            if ($scope.currentNorecPD == undefined) {
                var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
                if (chacePeriode != undefined) {
                    $scope.currentNorecPD = chacePeriode[8]
                    $scope.currentNorecAPD = chacePeriode[7]
                    $scope.hideEMR = true
                }
            } else {
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', undefined)
            }


            var cookie = document.cookie.split(';');
            cookie = cookie[0].split('=');
            if (cookie[1] === 'laborat') {
                $scope.showLab = true
            }
            // $scope.listKomponen =[];
            var data2 = [];
            $scope.item.pasien = {
                objectruanganfk: null
            }
            $scope.item.pasien.objectkelasfk = null
            loadPertama();
            LoadCombo();
            $scope.listCito = [
                { "id": 1, "nama": "Status Cito", "detail": [{ "id": 1, "nama": "Tidak" }, { "id": 2, "nama": "Ya" }] }
            ]

            $scope.getSkor = function(data, stat) {
                $scope.item.JasaCito = 0;
                if ($scope.item.Cito != undefined) {
                    if ($scope.item.Cito == "1") {
                        $scope.item.StatusCito = parseFloat($scope.item.Cito)
                    } else if ($scope.item.Cito == "2") {
                        $scope.item.StatusCito = parseFloat($scope.item.Cito)
                        $scope.item.JasaCito = parseFloat($scope.item.hargaTindakan) * $scope.item.nilaiStatusCito
                    }
                }
            }

            function LoadCombo() {
                $scope.isLoadingDiagnosis = true;
                medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function(data) {
                    $scope.listDiagnosaTindakan = data;
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function(data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.get('emr/get-combo-diagnosis').then(function(data) {
                    $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
                });
                medifirstService.getServiceArray("tatarekening/get-combo-detail-regis").then(function(data) {
                    $scope.listRuanganDokter = data.ruangan;
                    $scope.listRuanganRajal = data.ruanganrajal;
                    $scope.listRuanganKonsul = data.dataRuanganKonsul;
                    $scope.listKelas = data.kelas
                    $scope.listDokter = data.dokter;
                    $scope.item.kelas = { id: $scope.item.pasien.objectkelasfk, namakelas: $scope.item.pasien.namakelas }
                });
            }
            $scope.showPembuatanSep = function() {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showDiagnosap = function() {
                $scope.isShowDiagnosap = !$scope.isShowDiagnosap;
            }
            $scope.showRuangan = function() {
                $scope.isShowRuangan = !$scope.isShowRuangan;
            }
            $scope.getKelas = function(id) {
                $scope.item.kelas = ""
                $scope.item.kelasKonsul = "";

                var ruanganId = $scope.konsul.ruangan.id;
                medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function(dat) {
                        $scope.listKelas = dat.data.kelas;

                    });
            }

            $scope.klikIcd9 = function(dataIcd9Selected) {
                $scope.item.diagnosaTindakan = {
                    id: dataIcd9Selected.id,
                    namaDiagnosaTindakan: dataIcd9Selected.namadiagnosatindakan,
                    kodeNama: dataIcd9Selected.kddiagnosatindakan + ' - ' + dataIcd9Selected.namadiagnosatindakan,
                    kdDiagnosaTindakan: dataIcd9Selected.kddiagnosatindakan
                }
                $scope.item.ketTindakan = dataIcd9Selected.keterangantindakan
                $scope.findBy = "1";
            }
            $scope.klikIcd10 = function(dataIcd10Selected) {
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
                $scope.item.penyakitponekigd = dataIcd10Selected.penyakitponekigd
                $scope.item.keterangan = dataIcd10Selected.keterangan
                if (dataIcd10Selected.iskasusbaru == '1') {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
                $scope.findBy = "1";
            }

            $scope.tidakDitemukan = function(stat) {
                if (stat == false) {
                    $scope.listPertanyaan = [];
                    $scope.item.tidakDitemukan = true;
                } else {
                    $scope.listPertanyaan = $scope.listPertanyaancache;
                    $scope.item.tidakDitemukan = false;
                }
            }

            $scope.checkboxClicked = function(dat) {
                if ($scope.item.kasusbaru == true) {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
            }

            $scope.checkboxClicked2 = function(dat) {
                if ($scope.item.kasuslama == false) {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
            }

            function loadDiagnosa() {
                $scope.isRouteLoading = true;
                var param = ""
                    // if($scope.dataParams.noRegistrasi == true)
                param = "noReg=" + $scope.item.pasien.noregistrasi;
                // else
                //   param = "noCm=" + $scope.item.noCm;

                medifirstService.get("emr/get-diagnosapasienbynoregicd9?" +
                    param
                ).then(function(data) {
                    $scope.isRouteLoading = false;
                    var dataICD9 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: dataICD9,
                        pageSize: 10
                    });
                });

                medifirstService.get("emr/get-diagnosapasienbynoreg?" +
                    param
                ).then(function(data) {
                    let penyakitponekigd = data.data.datas.filter(item => item.penyakitponekigd == 'gynaecology' || item.penyakitponekigd == 'obstetric');
                    if (penyakitponekigd.length > 0) {
                        $scope.item.poneksudah = true;
                    } else {
                        $scope.item.poneksudah = false;
                    }

                    var dataICD10 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                        data: dataICD10,
                        pageSize: 10
                    });
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

            $scope.saveIcd10 = function() {
                if ($scope.item.pasien.objectruanganfk == 309 || $scope.item.pasien.objectruanganfk == 715) {
                    if ($scope.item.penyakitponekigd == null && $scope.item.jenisDiagnosis.id == 1) {
                        toastr.error('Jenis Penyakit Harus diPilih !')
                        return
                    }
                }
                validasiIcd10();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function(e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr
                    ).then(function(res) {})
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    delete $scope.item.penyakitponekigd;
                    loadDiagnosa()
                })
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
                        keterangan = "-"
                    } else {
                        keterangan = $scope.item.keterangan
                    }

                    $scope.now = new Date();
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        noregistrasifk: $scope.currentNorecAPD,
                        tglregistrasi: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.item.diagnosa.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglinputdiagnosa: tglinput,
                        keterangan: keterangan,
                        kasusbaru: $scope.item.kasusbaru,
                        kasuslama: $scope.item.kasuslama,
                        penyakitponekigd: $scope.item.penyakitponekigd
                    }

                    $scope.objSave = {
                        detaildiagnosapasien: data,
                    }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            $scope.deleteIcd10 = function() {
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
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function(e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                        'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function(res) {})
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    delete $scope.item.penyakitponekigd;
                    loadDiagnosa()


                })
            }

            $scope.back = function() {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.batal = function() {
                delete $scope.item.diagnosaTindakan;
                delete $scope.item.ketTindakan;
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosa;
                delete $scope.item.keterangan;
            }

            $scope.saveIcd9 = function() {
                validasi();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function(e) {

                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function(res) {})
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected;
                    loadDiagnosa()
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
                        objectpasienfk: $scope.currentNorecAPD,
                        tglpendaftaran: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
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

            $scope.simpanDiagnosaFreText = function() {
                var dataJson = {
                    "noregistrasifk": $scope.currentNorecPD,
                    "diagnosa": $scope.popUpDiagnosa.ket,
                };
                medifirstService.post('rawatjalan/update-diagnosa-fretext', dataJson)
                    .then(function(e) {
                        loadData();
                    });
            }

            $scope.simpanKonsul = function() {
                if ($scope.konsul.ruangan === undefined || $scope.konsul.ruangan === null || $scope.konsul.ruangan === "") {
                    messageContainer.error("Dokter Belum Di Pilih")
                    return
                }
                if ($scope.item.kelas === undefined || $scope.item.kelas === null || $scope.item.kelas === "") {
                    messageContainer.error("Kelas Belum Di Pilih")
                    return
                }
                if ($scope.konsul.namaDokter === undefined || $scope.konsul.namaDokter === null || $scope.konsul.namaDokter === "") {
                    messageContainer.error("Dokter Belum Di Pilih")
                    return
                }
                if ($scope.konsul.ruangan.id === '44' || $scope.konsul.ruangan.id === '20') {
                    $scope.item.kelas.id = $scope.item.pasien.objectkelasfk;
                }
                // var length = 0
                // var dataKonsul = {
                //     "asalrujukanfk": $scope.item.pasien.objectasalrujukanfk,
                //     "kelasfk": $scope.item.kelas.id,
                //     "noantrian": length,
                //     "norec_pd": $scope.currentNorecPD,
                //     "dokterfk": $scope.konsul.namaDokter.id,
                //     "objectruangantujuanfk": $scope.konsul.ruangan.id,
                //     "objectruanganasalfk": $scope.item.pasien.objectruanganfk
                // }
                // medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function (e) {
                //     // LoadData();
                //     // $scope.saveLogKonsul();
                //     debugger;
                //     var dokterId = "";
                //     if ($scope.konsul.namaDokter.id == undefined || $scope.item.dokter == "") {
                //         dokterId = null;
                //     } else
                //         dokterId = $scope.konsul.namaDokter.id;
                //     var json = {
                //         'noregistrasi': $scope.item.pasien.noregistrasi,
                //         'jenispasien': $scope.item.pasien.objectkelompokpasienlastfk,
                //         'idruangan': $scope.konsul.ruangan.id,
                //         'norec_apd': e.data.data.norec,
                //         'idpegawai': dokterId
                //     }
                //     medifirstService.post('registrasi/save-biaya-konsul', json).then(function (e) {
                //         // 
                //     });
                //     $scope.now = new Date();
                //     var data = {
                //         "norec_kdr": '',
                //         "objectruangantujuanfk": $scope.konsul.ruangan.id,
                //         "objectruanganasalfk": $scope.item.pasien.objectruanganfk,
                //         "tglupdate": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'), //items.tglUpdate,//.getTime(), 
                //         "objectstatuskendalidokumenfk": 2,
                //         "nocmfk": $scope.item.pasien.nocmfk,
                //         "tglkeluar": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                //         "catatan": "",
                //         "noregistrasifk": e.data.data.norec
                //         //"tglkembali": tglkembali
                //     };
                //     medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen', data).then(function (e) {

                //     });
                // })
                if ($scope.item.pasien.objectdepartemenfk == 16 || $scope.item.pasien.objectruanganfk == 545 || $scope.item.pasien.objectruanganfk == 453 || $scope.item.pasien.objectruanganfk == 575 || $scope.item.pasien.objectruanganfk == 576 || $scope.item.pasien.objectruanganfk == 44 || $scope.item.pasien.objectruanganfk == 251 || $scope.item.pasien.objectruanganfk == 20 || $scope.item.pasien.objectruanganfk == 322 || $scope.item.pasien.objectruanganfk == 569) {
                    var length = 0
                    var dataKonsul = {
                        "asalrujukanfk": $scope.item.pasien.objectasalrujukanfk,
                        "kelasfk": $scope.item.kelas.id,
                        "noantrian": length,
                        "norec_pd": $scope.currentNorecPD,
                        "dokterfk": $scope.konsul.namaDokter.id,
                        "objectruangantujuanfk": $scope.konsul.ruangan.id,
                        "objectruanganasalfk": $scope.item.pasien.objectruanganfk
                    }
                    medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function(e) {
                        // LoadData();
                        // $scope.saveLogKonsul();
                        var dokterId = "";
                        if ($scope.konsul.namaDokter.id == undefined || $scope.item.dokter == "") {
                            dokterId = null;
                        } else
                            dokterId = $scope.konsul.namaDokter.id;
                        var json = {
                            'noregistrasi': $scope.item.pasien.noregistrasi,
                            'jenispasien': $scope.item.pasien.objectkelompokpasienlastfk,
                            'idruangan': $scope.konsul.ruangan.id,
                            'norec_apd': e.data.data.norec,
                            'idpegawai': dokterId,
                            'keteranganlain': 'Karcis Otomatis Input Tindakan Diagnosa'
                        }
                        medifirstService.post('registrasi/save-biaya-konsul', json).then(function(x) {
                            // 
                        });
                        $scope.now = new Date();
                        var data = {
                            "norec_kdr": '',
                            "objectruangantujuanfk": $scope.konsul.ruangan.id,
                            "objectruanganasalfk": $scope.item.pasien.objectruanganfk,
                            "tglupdate": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'), //items.tglUpdate,//.getTime(), 
                            "objectstatuskendalidokumenfk": 2,
                            "nocmfk": $scope.item.pasien.nocmfk,
                            "tglkeluar": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                            "catatan": "",
                            "noregistrasifk": e.data.data.norec
                                //"tglkembali": tglkembali
                        };
                        medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen', data).then(function(e) {

                        });
                    })
                }
                if ($scope.dataSourceDiagnosaIcd10._data.length == 0) {
                    toastr.error('Tidak Bisa Konsul Ruangan Jika Diagnosa Utama/Primary Belum Diinput !')
                    return
                }
                if ($scope.dataSourceDiagnosaIcd10._data) {
                    for (let p = 0; p < $scope.dataSourceDiagnosaIcd10._data.length; p++) {
                        if ($scope.dataSourceDiagnosaIcd10._data[p].objectjenisdiagnosafk == 1) {
                            var length = 0
                            var dataKonsul = {
                                "asalrujukanfk": $scope.item.pasien.objectasalrujukanfk,
                                "kelasfk": $scope.item.kelas.id,
                                "noantrian": length,
                                "norec_pd": $scope.currentNorecPD,
                                "dokterfk": $scope.konsul.namaDokter.id,
                                "objectruangantujuanfk": $scope.konsul.ruangan.id,
                                "objectruanganasalfk": $scope.item.pasien.objectruanganfk
                            }
                            medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function(e) {
                                // LoadData();
                                // $scope.saveLogKonsul();
                                var dokterId = "";
                                if ($scope.konsul.namaDokter.id == undefined || $scope.item.dokter == "") {
                                    dokterId = null;
                                } else
                                    dokterId = $scope.konsul.namaDokter.id;
                                var json = {
                                    'noregistrasi': $scope.item.pasien.noregistrasi,
                                    'jenispasien': $scope.item.pasien.objectkelompokpasienlastfk,
                                    'idruangan': $scope.konsul.ruangan.id,
                                    'norec_apd': e.data.data.norec,
                                    'idpegawai': dokterId
                                }
                                medifirstService.post('registrasi/save-biaya-konsul', json).then(function(e) {
                                    // 
                                });
                                $scope.now = new Date();
                                var data = {
                                    "norec_kdr": '',
                                    "objectruangantujuanfk": $scope.konsul.ruangan.id,
                                    "objectruanganasalfk": $scope.item.pasien.objectruanganfk,
                                    "tglupdate": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'), //items.tglUpdate,//.getTime(), 
                                    "objectstatuskendalidokumenfk": 2,
                                    "nocmfk": $scope.item.pasien.nocmfk,
                                    "tglkeluar": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                                    "catatan": "",
                                    "noregistrasifk": e.data.data.norec
                                        //"tglkembali": tglkembali
                                };
                                medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen', data).then(function(e) {

                                });
                            })
                            return
                        } else {

                        }
                    }
                }
                if ($scope.dataSourceDiagnosaIcd10._data) {
                    for (let p = 0; p < $scope.dataSourceDiagnosaIcd10._data.length; p++) {
                        if ($scope.dataSourceDiagnosaIcd10._data[p].objectjenisdiagnosafk != 1) {
                            toastr.error('Tidak Bisa Konsul Ruangan Jika Diagnosa Utama/Primary Belum Diinput !')
                            return
                        }
                    }
                } else {

                }
            }

            $scope.saveTemuanPonek = function() {
                if ($scope.item.penyakitponekigd == undefined) {
                    toastr.error('Jenis Penyakit Ponek IGD Harus diPilih !')
                    return
                }
                if ($scope.item.pasien.objectruanganfk != 309) {
                    toastr.error('Ruangan Harus Ponek IGD !')
                    return
                }
                let data = {
                    "norec_pd": $scope.item.pasien.norec_pd,
                    "noregistrasi": $scope.item.pasien.noregistrasi,
                    "penyakitponekigd": $scope.item.penyakitponekigd
                }
                medifirstService.post('tatarekening/save-update-penyakit-ponek-igd', data).then(function(e) {});
            }

            $scope.deleteIcd9 = function() {
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
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function(e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
                        'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function(res) {})
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected
                    loadDiagnosa()

                })
            }


            function loadPertama() {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function(dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglmax = dat.data.maxdate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date(tglmax);
                    $scope.startDateOptions = {
                        disableDates: function(date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                })
                medifirstService.get("tatarekening/tindakan/get-pasien-bynorec/" +
                        $scope.currentNorecPD +
                        "/" +
                        $scope.currentNorecAPD)
                    .then(function(e) {
                        $scope.isRouteLoading = false;
                        for (let i = 0; i < e.data.length; i++) {
                            $scope.item.pasiens[i] = e.data[i];
                        }
                        $scope.item.pasien = e.data[0];
                        loadDiagnosa()
                            //  ** cek status closing
                        medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.pasien.noregistrasi, false).then(function(rese) {
                            if (rese.data.status == true) {
                                toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                                $scope.isSelesaiPeriksa = true
                            }
                        })
                        var kelastindakan = ""
                        if ($scope.item.pasien.objectkelompokpasienlastfk == 2 && $scope.item.pasien.israwattitipan == true) {
                            kelastindakan = $scope.item.pasien.kelastanggunganfk
                        } else {
                            kelastindakan = $scope.item.pasien.objectkelasfk
                        }

                        $scope.ponek = false;
                        if ($scope.item.pasien.objectruanganfk == 309 || $scope.item.pasien.objectruanganfk == 715) {
                            $scope.ponek = true;
                        }

                        medifirstService.getDataDummyPHPV2("tatarekening/tindakan/get-tindakan?idRuangan=" +
                                $scope.item.pasien.objectruanganfk +
                                "&idKelas="
                                // + $scope.item.pasien.objectkelasfk
                                +
                                kelastindakan +
                                "&idJenisPelayanan=" +
                                $scope.item.pasien.objectjenispelayananfk, true, 10, 10)
                            .then(function(x) {
                                $scope.listProduk = x;
                            })
                    });
            }

            // var a = false;
            $scope.getHargaTindakan = function() {
                // let dua = x;
                // let satu = 1;
                // if(a == false) {
                //     a = true;
                getKomponenHarga();
                // satu = satu + dua;
                // }
            }

            function getKomponenHarga() {
                $scope.lanjutPetugas = false;
                $scope.listPertanyaan = [];
                $scope.listKomponen = [];
                // mapping tindakan darisini
                var model = $parse("dataSource"); // 5-5 asar
                // $scope.selectedPegawai = [];
                // $scope.item.jenisPelaksana = '';
                // $scope.item.dataSource = []; // 5-5 asar
                // $scope.gridPetugasPelaksana = []; // 5-5 asar
                $scope.listPegawai = new kendo.data.DataSource({ // 5-5 asar
                    data: [] // 5-5 asar
                }); // 5-5 asar
                // model.assign($scope, $scope.listPegawai); // 5-5 asar

                medifirstService.get("tatarekening/tindakan/get-combo-map?objectkelompokprodukbpjsfk=" + $scope.item.namaProduk.objectkelompokprodukbpjsfk)
                    .then(function(da) {
                        // $scope.listJenisPelaksana = da.data.jenispelaksana;
                        // for (var i = da.data.jenispelaksana.length - 1; i >= 0; i--) {
                        //  var elem= da.data.jenispelaksana[i]
                        //  if(elem.jenispetugaspe.indexOf('Dokter Pemeriksa') > -1){
                        //    $scope.item.jenisPelaksana= elem
                        //    $scope.init()
                        //    break
                        //  }
                        // }

                        $scope.item.nilaiStatusCito = parseFloat(da.data.tarifcito.nilaifield);
                    })
                    // sampe sini


                $scope.item.hargaTindakan = 0
                $scope.item.jumlah = 0
                var kelastindakan = ""
                $scope.item.Kelas = $scope.item.pasien.namakelas
                if ($scope.item.pasien.objectkelasfk == "9") {
                    kelastindakan = $scope.item.pasien.objectkelasfk
                } else if ($scope.item.pasien.objectkelompokpasienlastfk == 2 && $scope.item.pasien.israwattitipan == true) {
                    kelastindakan = $scope.item.pasien.kelastanggunganfk
                    $scope.item.Kelas = $scope.item.pasien.namakelastanggungan
                } else {
                    kelastindakan = $scope.item.pasien.objectkelasfk
                }

                $scope.listKomponen = []
                if ($scope.item.namaProduk != undefined) {
                    medifirstService.get("tatarekening/tindakan/get-komponenharga?idRuangan=" +
                        $scope.item.pasien.objectruanganfk +
                        "&idKelas=" + kelastindakan +
                        "&idProduk=" + $scope.item.namaProduk.id +
                        "&idJenisPelayanan=" + $scope.item.pasien.objectjenispelayananfk +
                        "&idDepartemen=" + $scope.item.pasien.objectdepartemenfk +
                        "&norecApd=" + $scope.item.pasien.norec_apd
                        // +"&idKelas="
                        // +$scope.item.pasien.objectkelasfk
                        // +"&idJenisPelayanan="
                        // + $scope.item.pasien.objectjenispelayananfk
                    ).then(function(dat) {
                        // a = false;
                        $scope.listKomponen = dat.data.data;
                        $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                        if (dat.data.data3.length > 0) {
                            for (var i = 0; i < dat.data.data3.length; i++) {
                                if (dat.data.data3[i].flag == '1') {
                                    dat.data.data3[i].flagtrue = false;
                                    dat.data.data3[i].flagfalse = true;
                                } else {
                                    dat.data.data3[i].flagtrue = true;
                                    dat.data.data3[i].flagfalse = false;
                                }
                            }
                            $scope.item.tidakDitemukan = false;
                            $scope.listPertanyaan = dat.data.data3;
                            $scope.listPertanyaancache = dat.data.data3;
                            $scope.item.indikator = dat.data.data3[0].indikator;
                            for (var i = 0; i < bacot.length; i++) {
                                if (bacot[i].id_indikator == dat.data.data3[0].id_indikator) {
                                    $scope.listPertanyaan = []
                                }
                            }
                            // if ($scope.listPertanyaan.length > 0) {
                            //     bacot.push({
                            //         "id_indikator": $scope.listPertanyaan[0].id_indikator
                            //     });
                            // }
                        }

                        $scope.lanjutPetugas = true;
                        $scope.item.jumlah = 1;
                    })
                }
            }

            $scope.tambahTindakan = function() {
                debugger
                if ($scope.listPertanyaan.length > 0) {
                    if ($scope.listPertanyaan[0].id_indikator == '90') {
                        $scope.biasa = true;
                        $scope.operasi = false;
                    } else {
                        $scope.biasa = false;
                        $scope.operasi = true;
                    }
                    debugger
                    if ($scope.item.pasien.objectdepartemenfk == 25) {
                        // $scope.item.indikator = '-';
                        $scope.tambahTindakans(false);
                    } else {
                        $scope.popupPilihanIndikator.center().open();
                    }
                } else {
                    $scope.item.indikator = '-';
                    $scope.tambahTindakans(false);
                }
            }

            $scope.tutupPopUpIndikator = function() {
                debugger
                toastr.error('Pop Up ini Tidak Bisa diClose, Isi Lalu Simpan');
                setTimeout(function() { $scope.popupPilihanIndikator.center().open(); }, 500);
                // $scope.tambahTindakan()
                // $scope.popupPilihanIndikator.center().open()
            }

            function getPegawaiById(id, input, output) {
                debugger
                var selectedData = $parse(output);
                selectedData.assign($scope, []);
                var model = $parse(input);
                medifirstService.get("tatarekening/tindakan/get-pegawaibyjenispetugas-map?idJenisPetugas=" + id +
                    "&objectkelompokprodukbpjsfk=" + $scope.item.namaProduk.objectkelompokprodukbpjsfk, true).then(function(dat) {
                    $scope.listPegawai = new kendo.data.DataSource({
                        data: dat.data.jenispelaksana
                    });
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    model.assign($scope, $scope.listPegawai);

                    var cookie = document.cookie.split(';');
                    cookie = cookie[0].split('=');
                    if (cookie[1] == 'dokter')
                        $scope.selectedPegawai = [({ id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap })]

                });
            }

            // ini yg asli
            medifirstService.get("tatarekening/tindakan/get-combo")
                .then(function(da) {
                    $scope.listJenisPelaksana = da.data.jenispelaksana;
                    // for (var i = da.data.jenispelaksana.length - 1; i >= 0; i--) {
                    //  var elem= da.data.jenispelaksana[i]
                    //  if(elem.jenispetugaspe.indexOf('Dokter Pemeriksa') > -1){
                    //    $scope.item.jenisPelaksana= elem
                    //    $scope.init()
                    //    break
                    //  }
                    // }

                    $scope.item.nilaiStatusCito = parseFloat(da.data.tarifcito.nilaifield);
                })

            function getPegawaiById(id, input, output) {
                var selectedData = $parse(output);
                selectedData.assign($scope, []);
                var model = $parse(input);
                medifirstService.get("tatarekening/tindakan/get-pegawaibyjenispetugas?idJenisPetugas=" + id, true).then(function(dat) {
                    $scope.listPegawai = new kendo.data.DataSource({
                        data: dat.data.jenispelaksana
                    });
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    model.assign($scope, $scope.listPegawai);

                    var cookie = document.cookie.split(';');
                    cookie = cookie[0].split('=');
                    if (cookie[1] == 'dokter')
                        $scope.selectedPegawai = [({ id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap })]

                });
            }

            $scope.listYaTidak = [{
                    "id": 1,
                    "name": "Ya"
                },
                {
                    "id": 0,
                    "name": "Tidak"
                }
            ]
            $scope.dataPetugas = []; // data untus petugas Set

            $scope.dataSelectedRow = {};
            $scope.dataTindakan = new kendo.data.DataSource({
                autoSync: false,
                aggregate: [
                    { field: "subTotal", aggregate: "sum" }
                ],
                editable: true,
                schema: {
                    model: {
                        rowNumber: "id",
                        fields: {
                            rowNumber: { editable: false },
                            tglPelayanan: { editable: false, defaultValue: $scope.now },
                            produk: {
                                validation: {
                                    productnamevalidation: function(input) {
                                        if (input.is("[name='produk']") && input.val() === "") {
                                            return false;
                                        }
                                        return true;
                                    }
                                }
                            },
                            hargaSatuan: { type: "number", editable: false },
                            qty: {
                                type: "number",
                                validation: {
                                    productqtyvalidation: function(input) {
                                        if (input.is("[name='qty']") && input.val() === "0") {
                                            return false;
                                        }
                                        return true;
                                    }
                                }
                            },
                            subTotal: { type: "number", editable: false }
                        }
                    }
                }
            });


            $scope.tambahTindakans = function() {
                    var ada = false;
                    var statVariable = false;
                    var persentase = 0;
                    // if ($scope.listPertanyaan.length > 0) {
                    //     bacot.push({
                    //         "id_indikator": $scope.listPertanyaan[0].id_indikator
                    //     });
                    // }
                    if ($scope.listPertanyaan.length > 0) {
                        bacot.push({
                            "id_indikator": $scope.listPertanyaan[0].id_indikator
                        });
                        for (var i = 0; i < $scope.listPertanyaan.length; i++) {
                            if ($scope.listPertanyaan[i].status == true) {
                                ada = true;
                                persentase = persentase + parseInt($scope.listPertanyaan[i].bobot);
                            } else {
                                $scope.listPertanyaan[i].status == false;
                            }
                            if ($scope.item.tidakDitemukan == false) {
                                if (persentase >= 50) {
                                    statVariable = true;
                                }
                            }
                        }
                    }

                    if ($scope.item.indikator != '-') {
                        if ($scope.item.pasien.objectdepartemenfk == 25) {

                        } else {
                            if (ada == false && $scope.item.tidakDitemukan == false) {
                                toastr.error('Pertanyaan harus di isi')
                                return
                            } else {
                                $scope.popupPilihanIndikator.close();
                            }
                        }
                    }
                    if ($scope.isSelesaiPeriksa == true) {
                        messageContainer.error("Data sudah di closing, tidak bisa input tindakan ")
                        return
                    }
                    if ($scope.item.namaProduk == undefined) {
                        messageContainer.error("Tindakan harus di isi")
                        return
                    }
                    if ($scope.item.jumlah == 0) {
                        messageContainer.error("Jumlah tidak boleh nol")
                        return
                    }

                    // if($scope.item.paramedis != true){
                    if ($scope.item.jenisPelaksana == undefined) {
                        messageContainer.error("Jenis Pelaksana harus di isi")
                        return
                    }
                    if ($scope.selectedPegawai.length == 0) {
                        toastr.error('Petugas Pelaksana harus di isi')
                        return
                    }
                    // }

                    if ($scope.item.jenisPelaksana2) {
                        for (let i = 0; i < $scope.selectedPegawai.length; i++) {
                            for (let j = 0; j < $scope.selectedPegawai2.length; j++) {
                                if ($scope.item.jenisPelaksana.jenispetugaspe == $scope.item.jenisPelaksana2.jenispetugaspe &&
                                    $scope.selectedPegawai[i].namalengkap == $scope.selectedPegawai2[j].namalengkap) {
                                    toastr.error('Dokter Pemeriksa yg sama tidak boleh lebih dari 2 kali')
                                    return
                                }
                            }
                        }
                    }

                    if ($scope.item.pasien.objectdepartemenfk === '16') {
                        $scope.pesan = "";
                        $scope.flag = false;
                        var flagp = 0
                        debugger
                        for (let i = 0; i < $scope.item.pasiens.length; i++) {
                            if (i > 0) {
                                $scope.pesan = $scope.pesan + " /";
                            }
                            $scope.item.tglPelayanan = moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss');
                            $scope.item.pasien.tgl_keluars = Date.parse($scope.item.pasiens[i].tgl_keluar2) / 1000;
                            // $scope.item.pasien.tgl_keluar2 = $scope.item.pasiens[i].tgl_keluar2;
                            $scope.item.pasien.tgl_masuks = Date.parse($scope.item.pasiens[i].tgl_masuk2) / 1000;
                            // $scope.item.pasien.tgl_masuk2 = $scope.item.pasiens[i].tgl_masuk2;
                            $scope.item.tglPelayanans = Date.parse($scope.item.tglPelayanan) / 1000;
                            $scope.pesan = $scope.pesan + "\nWaktu Masuk " + $scope.item.pasiens[i].tgl_masuk2 + " Sampai Waktu Keluar " + $scope.item.pasiens[i].tgl_keluar2;
                            if ($scope.item.pasiens[i].tgl_keluar2 === null) {
                                if ($scope.item.tglPelayanans > $scope.item.pasien.tgl_masuks || $scope.item.tglPelayanans < $scope.item.pasien.tgl_keluars) {
                                    $scope.flag = true;
                                } else {
                                    $scope.flag = false;
                                }
                            }
                        }
                        for (let i = 0; i < $scope.item.pasiens.length; i++) {
                            if ($scope.flag === false) {
                                $scope.item.tglPelayanan = moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss');
                                $scope.item.pasien.tgl_keluars = Date.parse($scope.item.pasiens[i].tgl_keluar2) / 1000;
                                $scope.item.pasien.tgl_masuks = Date.parse($scope.item.pasiens[i].tgl_masuk2) / 1000;
                                $scope.item.tglPelayanans = Date.parse($scope.item.tglPelayanan) / 1000;
                                if ($scope.item.tglPelayanans < $scope.item.pasien.tgl_masuks) {
                                    flagp = flagp + 1
                                    if (flagp == $scope.item.pasiens.length) {
                                        alert("Pasien Hanya Bisa Mendapatkan Tindakan di Ruang " + $scope.item.pasien.namaruangan + " Antara " + $scope.pesan)
                                        return
                                    }
                                }
                                if ($scope.item.pasien.tglpulang != null) {
                                    if ($scope.item.tglPelayanans > $scope.item.pasien.tgl_keluars) {
                                        flagp = flagp + 1
                                        if (flagp == $scope.item.pasiens.length) {
                                            alert("Pasien Hanya Bisa Mendapatkan Tindakan di Ruang " + $scope.item.pasien.namaruangan + " Antara " + $scope.pesan)
                                            return
                                        }
                                    }
                                }
                            }
                        }

                        // ini yg lama
                        // $scope.item.tglPelayanan = moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss');
                        // $scope.item.pasien.tglkeluars = Date.parse($scope.item.pasien.tglkeluar)/1000;
                        // $scope.item.pasien.tglmasuks = Date.parse($scope.item.pasien.tglmasuk)/1000;
                        // $scope.item.tglPelayanans = Date.parse($scope.item.tglPelayanan)/1000;
                        // // $scope.item.tglresep = $scope.item.tglresep.Date();
                        // // $scope.item.tglresep = $scope.item.tglresep.getTime();
                        // if ($scope.item.tglPelayanans < $scope.item.pasien.tglmasuks) {
                        //     // alert("Pasien Ruangan " + $scope.item.pasien.namaruangan_asal + " Hanya Bisa Mendapatkan Tindakan " + $scope.item.pasien.namaruangan + " Antara Waktu Masuk " + $scope.item.pasien.tglmasuk + " Sampai Waktu Keluar " + $scope.item.pasien.tglkeluar)
                        //     // return
                        //     alert("Tindakan Hanya Bisa Diinput di Ruangan " + $scope.item.pasien.namaruangan + " Antara Waktu Masuk " + $scope.item.pasien.tglmasuk + " Sampai Waktu Keluar " + $scope.item.pasien.tglkeluar)
                        //     return
                        // }
                        // if ($scope.item.pasien.tglkeluar != null) {
                        //   if ($scope.item.tglPelayanans > $scope.item.pasien.tglkeluars) {
                        //       // alert("Pasien Ruangan " + $scope.item.pasien.namaruangan_asal + " Hanya Bisa Mendapatkan Tindakan " + $scope.item.pasien.namaruangan + " Antara Waktu Masuk " + $scope.item.pasien.tglmasuk + " Sampai Waktu Keluar " + $scope.item.pasien.tglkeluar)
                        //       // return
                        //     alert("Tindakan Hanya Bisa Diinput di Ruangan " + $scope.item.pasien.namaruangan + " Antara Waktu Masuk " + $scope.item.pasien.tglmasuk + " Sampai Waktu Keluar " + $scope.item.pasien.tglkeluar)
                        //     return
                        //   }
                        // }
                    }


                    // var diskonKomponen = 0
                    // if($scope.item.diskonKomponen != undefined){
                    //   diskonKomponen =$scope.item.diskonKomponen 
                    // }

                    var statuscito = "";
                    if ($scope.item.Cito == "2") {
                        statuscito = "✔";
                        $scope.item.StatusCito = parseFloat($scope.item.Cito);
                        $scope.item.JasaCito = parseFloat($scope.item.hargaTindakan) * $scope.item.nilaiStatusCito;
                        $scope.item.NilaiCito = $scope.item.nilaiStatusCito;
                    } else {
                        statuscito = "";
                        $scope.item.StatusCito = parseFloat($scope.item.Cito);
                        $scope.item.JasaCito = 0;
                        $scope.item.NilaiCito = 0;
                    }

                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].produk.id == $scope.item.namaProduk.id) {
                            alert("Data sudah ditambahkan!!");
                            return;
                        }
                    }


                    var nomor = 0
                    if ($scope.dataTindakan == undefined) {
                        nomor = 1
                    } else {
                        nomor = data2.length + 1
                    }
                    var data = {};

                    if ($scope.listPertanyaan.length > 0) {
                        data = {
                            rowNumber: nomor,
                            tglPelayanan: $scope.item.tglPelayanan,
                            produk: $scope.item.namaProduk, //$scope.item.noRegistrasi,
                            qty: $scope.item.jumlah,
                            hargaSatuan: $scope.item.hargaTindakan,
                            hargadiskon: 0,
                            subTotal: ($scope.item.hargaTindakan) * ($scope.item.jumlah),
                            listKomponen: $scope.listKomponen,
                            statuscito: statuscito,
                            cito: $scope.item.StatusCito,
                            jasacito: $scope.item.JasaCito,
                            isparamedis: $scope.item.paramedis,
                            jenispelayananfk: $scope.item.pasien.objectjenispelayananfk,
                            nilaicito: $scope.item.NilaiCito,
                            namaIndikator: $scope.listPertanyaan[0].indikator,
                            arrayIndikator: $scope.listPertanyaan,
                            id_indikator: $scope.listPertanyaan[0].id_indikator,
                            statVariable: statVariable,
                            mipfk: $scope.listPertanyaan[0].mipfk
                        }
                    } else {
                        data = {
                            rowNumber: nomor,
                            tglPelayanan: $scope.item.tglPelayanan,
                            produk: $scope.item.namaProduk, //$scope.item.noRegistrasi,
                            qty: $scope.item.jumlah,
                            hargaSatuan: $scope.item.hargaTindakan,
                            hargadiskon: 0,
                            subTotal: ($scope.item.hargaTindakan) * ($scope.item.jumlah),
                            listKomponen: $scope.listKomponen,
                            statuscito: statuscito,
                            cito: $scope.item.StatusCito,
                            jasacito: $scope.item.JasaCito,
                            isparamedis: $scope.item.paramedis,
                            jenispelayananfk: $scope.item.pasien.objectjenispelayananfk,
                            nilaicito: $scope.item.NilaiCito
                        }
                    }
                    // data = {
                    //   rowNumber: nomor,
                    //   tglPelayanan: $scope.item.tglPelayanan,
                    //   produk: $scope.item.namaProduk,//$scope.item.noRegistrasi,
                    //   qty: $scope.item.jumlah,
                    //   hargaSatuan: $scope.item.hargaTindakan,
                    //   hargadiskon: 0,
                    //   subTotal: ($scope.item.hargaTindakan) * ($scope.item.jumlah),
                    //   listKomponen: $scope.listKomponen,
                    //   statuscito: statuscito,
                    //   cito: $scope.item.StatusCito,
                    //   jasacito: $scope.item.JasaCito,
                    //   isparamedis: $scope.item.paramedis,
                    //   jenispelayananfk: $scope.item.pasien.objectjenispelayananfk,
                    //   nilaicito: $scope.item.NilaiCito,
                    // }
                    data2.push(data)


                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataTindakan = new kendo.data.DataSource({
                        data: data2
                    });
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].subTotal)
                    }
                    $scope.item.totalAlls = $scope.formatRupiah(subTotal, 'Rp.') //parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                    // $scope.item.totalAlls=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    // detail grid goes here
                    if ($scope.item.jenisPelaksana && $scope.selectedPegawai) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                    }
                    if ($scope.item.jenisPelaksana2 && $scope.selectedPegawai2) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana2.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana2.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai2
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana2 = false;
                        // delete $scope.item.jenisPelaksana2;
                    }
                    if ($scope.item.jenisPelaksana3 && $scope.selectedPegawai3) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana3.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana3.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai3
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana3 = false;
                        // delete $scope.item.jenisPelaksana3;
                    }
                    if ($scope.item.jenisPelaksana4 && $scope.selectedPegawai4) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana4.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana4.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai4
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana4 = false;
                        // delete $scope.item.jenisPelaksana4;
                    }
                    if ($scope.item.jenisPelaksana5 && $scope.selectedPegawai5) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana5.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana5.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai5
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana5 = false;
                        // delete $scope.item.jenisPelaksana5;
                    }
                    if ($scope.item.jenisPelaksana6 && $scope.selectedPegawai6) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana6.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana6.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai6
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana6 = false;
                        // delete $scope.item.jenisPelaksana6;
                    }
                    if ($scope.item.jenisPelaksana7 && $scope.selectedPegawai7) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana7.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana7.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai7
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana7 = false;
                        // delete $scope.item.jenisPelaksana7;
                    }
                    if ($scope.item.jenisPelaksana8 && $scope.selectedPegawai8) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana8.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana8.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai8
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana8 = false;
                        // delete $scope.item.jenisPelaksana8;
                    }
                    if ($scope.item.jenisPelaksana9 && $scope.selectedPegawai9) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana9.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana9.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai9
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana9 = false;
                        // delete $scope.item.jenisPelaksana9;
                    }
                    if ($scope.item.jenisPelaksana10 && $scope.selectedPegawai10) {
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.item.jenisPelaksana10.id,
                                "jenisPelaksana": $scope.item.jenisPelaksana10.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawai10
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                        // $scope.showJenisPelaksana10 = false;
                        // delete $scope.item.jenisPelaksana10;
                    }
                    // console.log(JSON.stringify(data));
                    $scope.show = true;
                    kosongkan();
                    $scope.item.Cito = undefined;


                }
                // });
            $scope.gridPetugasPelaksana = new kendo.data.DataSource({
                data: []
            })

            var onChange = function(e) {
                //var inputId = this.element.attr("id");
                //  console.log(inputId);
                var grid = $(this).data("mainGridOptions");

            }
            $scope.mainGridOptions = {
                sortable: true,
                // toolbar: [{
                //     name: "create",
                //     text: "Tambah"
                // }],
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
                    // {
                    //   "field": "rowNumber",
                    //   "title": "<h3 align=center>#</h3>",
                    //   "width": 20
                    // },
                    {
                        "field": "tglPelayanan",
                        "title": "<h3 align=center>Tanggal</h3>",
                        "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY') #",
                        "width": "60px"
                    },
                    {
                        "field": "tglPelayanan",
                        "title": "<h3 align=center>Jam</h3>",
                        "template": "#= new moment(new Date(tglPelayanan)).format('HH:mm') #",
                        "width": "40px"
                    },
                    {
                        "field": "produk.namaproduk",
                        "title": "<h3 align=center>Tindakan</h3>",
                        "width": "300px"
                    },
                    {
                        "field": "hargaSatuan",
                        "title": "<h3 align=center>Harga Netto</h3>",
                        "width": "150px",
                        // "template": "#= kendo.toString(hargaSatuan, 'n0')#",
                        "template": "{{formatRupiah('#: hargaSatuan #', 'Rp.')}}",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "qty",
                        "title": "<h3 align=center>Qty</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "subTotal",
                        "title": "<h3 align=center>SubTotal</h3>",
                        "width": "150px",
                        // "template": "#= kendo.toString(subTotal, 'n0')#",
                        "template": "{{formatRupiah('#: subTotal #', 'Rp.')}}",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "statuscito",
                        "title": "<h3 align=center>Cito</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "namaIndikator",
                        "title": "<h3 align=center>Indikator</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    // { title: "<h3 align=center>Action<h3>",width : "100px",template : "<button class='btnHapus' ng-click='disableData()'>Disbled</button>"}
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
                        // template: "<a class='k-button k-grid-delete'><span class='glyphicon glyphicon-remove'></span></a>"
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

                // $scope.item.totalAlls=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                //parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                var gridPetugas = $scope.gridPetugasPelaksana._data;
                if (gridPetugas.length != 0) {
                    for (var i = gridPetugas.length - 1; i >= 0; i--) {
                        if (gridPetugas[i].idParent == dataItem.rowNumber) {
                            gridPetugas.splice(i, 1);
                            // for (var j = gridPetugas.length - 1; j >= 0; j--) {

                            //   gridPetugas[j].idParent = j + 1
                            // }
                            $scope.gridPetugasPelaksana.add(gridPetugas);
                            // $scope.gridPetugasPelaksana = new kendo.data.DataSource({
                            // data: gridPetugas
                            // });
                        }
                    }
                }





            }

            $scope.hapusAll = function() {
                data2 = [];
                bacot = [];
                $scope.dataTindakan = new kendo.data.DataSource({
                    data: data2
                });
                var pushData = [];
                $scope.gridPetugasPelaksana = new kendo.data.DataSource({
                    data: pushData
                });
                $scope.item.StatusCito = undefined;
                $scope.item.JasaCito = 0;
                $scope.item.NilaiCito = 0;

            };
            $scope.detailGridOptions = function(dataItem) {
                return {
                    dataSource: {
                        data: $scope.gridPetugasPelaksana._data,
                        filter: { field: "idParent", operator: "eq", value: dataItem.rowNumber }
                    },
                    columns: [{
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

            function multiSelectArrayToString(item) {
                if (item.listPetugas !== "") {
                    return item.listPetugas.map(function(elem) {
                        return elem.namalengkap
                    }).join(", ");
                }
            };
            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            $scope.isInArray = function(value, array) {
                return array.indexOf(value) > -1;
            }

            $scope.listIdPetugas = [13827, 176873]
            $scope.init = function() {
                var id = $scope.item.jenisPelaksana.id;
                var model = 'dataSource';
                var listArray = 'selectedPegawai';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai = [];
            $scope.init2 = function() {
                var id = $scope.item.jenisPelaksana2.id;
                var model = 'dataSource2';
                var listArray = 'selectedPegawai2';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai2 = [];
            $scope.init3 = function() {
                var id = $scope.item.jenisPelaksana3.id;
                var model = 'dataSource3';
                var listArray = 'selectedPegawai3';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai3 = [];
            $scope.init4 = function() {
                var id = $scope.item.jenisPelaksana4.id;
                var model = 'dataSource4';
                var listArray = 'selectedPegawai4';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai4 = [];
            $scope.init5 = function() {
                var id = $scope.item.jenisPelaksana5.id;
                var model = 'dataSource5';
                var listArray = 'selectedPegawai5';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai5 = [];
            $scope.init6 = function() {
                var id = $scope.item.jenisPelaksana6.id;
                var model = 'dataSource6';
                var listArray = 'selectedPegawai6';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai6 = [];
            $scope.init7 = function() {
                var id = $scope.item.jenisPelaksana7.id;
                var model = 'dataSource7';
                var listArray = 'selectedPegawai7';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai7 = [];
            $scope.init8 = function() {
                var id = $scope.item.jenisPelaksana8.id;
                var model = 'dataSource8';
                var listArray = 'selectedPegawai8';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai8 = [];
            $scope.init9 = function() {
                var id = $scope.item.jenisPelaksana9.id;
                var model = 'dataSource9';
                var listArray = 'selectedPegawai9';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai9 = [];
            $scope.init10 = function() {
                var id = $scope.item.jenisPelaksana10.id;
                var model = 'dataSource10';
                var listArray = 'selectedPegawai10';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };
            $scope.selectedPegawai10 = [];
            $scope.showTambah1 = true;
            $scope.show = true;
            $scope.tambah = function() {
                $scope.showJenisPelaksana2 = true;
                $scope.show = false;
                $scope.show2 = true;
            };
            $scope.hapus = function() {
                $scope.show = true;
                $scope.show2 = false;
                $scope.showJenisPelaksana2 = false;
                $scope.item.jenisPelaksana2 = "";
                $scope.selectedPegawai2 = [];
            };

            $scope.tambah2 = function() {
                $scope.showJenisPelaksana3 = true;
                $scope.show3 = true;
                $scope.show2 = false;
            }
            $scope.hapus2 = function() {
                $scope.showJenisPelaksana3 = false;
                $scope.show2 = true;
                $scope.show3 = false;
                $scope.item.jenisPelaksana3 = "";
                $scope.selectedPegawai3 = [];
            };

            $scope.tambah3 = function() {
                $scope.showJenisPelaksana4 = true;
                $scope.show3 = false;
                $scope.show4 = true;
            }
            $scope.hapus3 = function() {
                $scope.showJenisPelaksana4 = false;
                $scope.show3 = true;
                $scope.show4 = false;
                $scope.item.jenisPelaksana4 = "";
                $scope.selectedPegawai4 = [];
            };

            $scope.tambah4 = function() {
                $scope.showJenisPelaksana5 = true;
                $scope.show4 = false;
                $scope.show5 = true;
            }
            $scope.hapus4 = function() {
                $scope.showJenisPelaksana5 = false;
                $scope.show4 = true;
                $scope.show5 = false;
                $scope.item.jenisPelaksana5 = "";
                $scope.selectedPegawai5 = [];
            };

            $scope.tambah5 = function() {
                $scope.showJenisPelaksana6 = true;
                $scope.show5 = false;
                $scope.show6 = true;
            }
            $scope.hapus5 = function() {
                $scope.showJenisPelaksana6 = false;
                $scope.show5 = true;
                $scope.show6 = false;
                $scope.item.jenisPelaksana5 = "";
                $scope.selectedPegawai5 = [];
            };

            $scope.tambah6 = function() {
                $scope.showJenisPelaksana7 = true;
                $scope.show6 = false;
                $scope.show7 = true;
            }
            $scope.hapus6 = function() {
                $scope.showJenisPelaksana7 = false;
                $scope.show6 = true;
                $scope.show7 = false;
                $scope.item.jenisPelaksana6 = "";
                $scope.selectedPegawai6 = [];
            };

            $scope.tambah7 = function() {
                $scope.showJenisPelaksana8 = true;
                $scope.show7 = false;
                $scope.show8 = true;
            }
            $scope.hapus7 = function() {
                $scope.showJenisPelaksana8 = false;
                $scope.show7 = true;
                $scope.show8 = false;
                $scope.item.jenisPelaksana7 = "";
                $scope.selectedPegawai7 = [];
            };

            $scope.tambah8 = function() {
                $scope.showJenisPelaksana9 = true;
                $scope.show8 = false;
                $scope.show9 = true;
            }
            $scope.hapus8 = function() {
                $scope.showJenisPelaksana9 = false;
                $scope.show8 = true;
                $scope.item.jenisPelaksana8 = "";
                $scope.selectedPegawai8 = [];
            };

            $scope.tambah9 = function() {
                $scope.showJenisPelaksana10 = true;
                $scope.show9 = false;
                $scope.show10 = true;
            }
            $scope.hapus9 = function() {
                $scope.showJenisPelaksana10 = false;
                $scope.show9 = true;
                $scope.show10 = false;
                $scope.item.jenisPelaksana9 = "";
                $scope.selectedPegawai9 = [];
            };


            $scope.selectOptions = {
                placeholder: "Pilih Pegawai...",
                dataTextField: "namaLengkap",
                dataValueField: "id",
                filter: "contains"
            };



            function kosongkan() {
                $scope.item.namaProduk = undefined;
                $scope.item.hargaTindakan = "";
                $scope.item.jumlah = undefined;
                // $scope.item.jenisPelaksana = undefined;
                // $scope.item.petugasPelaksana = undefined;
                // $scope.item.jenisPelaksana2 = undefined;
                // $scope.item.petugasPelaksana2 = undefined;
                // $scope.item.jenisPelaksana3 = undefined;
                // $scope.item.petugasPelaksana3 = undefined;
                // $scope.item.jenisPelaksana4 = undefined;
                // $scope.item.petugasPelaksana4 = undefined;
                // $scope.selectedPegawai = [];
                // $scope.selectedPegawai1 = [];
                // $scope.selectedPegawai2 = [];
                // $scope.selectedPegawai3 = [];
                // $scope.selectedPegawai4 = [];
                // $scope.selectedPegawai5 = [];
            }


            // function simpan tindakan
            $scope.Save = function() {
                debugger
                // if($scope.item.pasien.objectruanganfk == 309) {
                //     if($scope.item.poneksudah == false) {
                //         toastr.error('Jenis Penyakit Ponek IGD Belum Diinput !')
                //         return
                //     }
                // }
                // if ($scope.dataSourceDiagnosaIcd10._data[i].objectjenisdiagnosafk != 1) {
                //     toastr.error('Diagnosa Utama/Primary Belum Diinput !')
                //     return
                // }
                // if ($scope.dataTindakan._data.length == 0) {
                //   toastr.error('Tindakan belum di isi')
                //   return
                // }
                // var dataTindakanFix = [];
                // $scope.dataTindakan._data.forEach(function (e) {

                //   if (e.listKomponen.length <= 0) {
                //     window.messageContainer.error("Simpan Gagal, Komponen Tindakan tidak ada");
                //     return
                //   }
                //   else {
                //     var petugasLayanan = [];
                //     $scope.gridPetugasPelaksana._data.forEach(function (a) {
                //       if (e.rowNumber === a.idParent) {
                //         petugasLayanan.push({
                //           "objectjenispetugaspefk": a.jenisPetugas.id,
                //           // "objectpegawaifk": a.jenisPetugas.id
                //           "listpegawai": a.listPetugas
                //         });
                //       }
                //     })
                //     var statusCitto = 0
                //     if (e.cito == 2) {
                //       statusCitto = 1;
                //     }
                //     var nilaiCito = 0
                //     var nilaijasaCito = 0
                //     if (e.jasacito != 0) {
                //       nilaiCito = e.jasacito;
                //       nilaijasaCito = e.nilaicito;
                //     }


                //     // if ( $scope.listKomponen.length>0)
                //     // {
                //     dataTindakanFix.push({
                //       "noregistrasifk": $scope.currentNorecAPD,
                //       "tglregistrasi": $scope.item.pasien.tglregistrasi,
                //       "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                //       "ruangan": e.ruangan,
                //       "produkfk": e.produk.id,
                //       "hargasatuan": e.hargaSatuan,
                //       "diskon": e.hargadiskon,
                //       "hargajual": e.hargaSatuan,
                //       "harganetto": e.hargaSatuan,
                //       "jumlah": e.qty,
                //       "kelasfk": $scope.item.pasien.objectkelasfk,
                //       "pelayananpetugas": petugasLayanan,
                //       "komponenharga": e.listKomponen,
                //       "keterangan": $scope.item.pemeriksaanKeluar === true ? 'Pemeriksaan Keluar' : '-',
                //       "iscito": statusCitto,
                //       "jasacito": nilaiCito,
                //       "isparamedis": e.isparamedis,
                //       "jenispelayananfk": e.jenispelayananfk,
                //       "nilaicito": nilaijasaCito,
                //       "noregistrasi": $scope.item.pasien.noregistrasi,
                //       "idpengirim":""
                //     });

                //   }
                // })
                // var objSave = {
                //   pelayananpasien: dataTindakanFix

                // }
                // $scope.hideSimpan = true
                // // medifirstService.post('tatarekening/tindakan/cektindakan',JSON.stringify(objSave)).then(function(x){
                // //  debugger;
                // //  if(x.data.data == 'lolos'){
                // medifirstService.post('tatarekening/tindakan/save-tindakan', JSON.stringify(objSave)).then(function (e) {
                //   //  $scope.isSimpan = true;
                //   // $scope.isNext = true;
                //   medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function (data) {
                //   })
                //   // $scope.savePanggilDokter()
                //   $scope.hapusAll();
                //   $scope.hideSimpan = false
                //   // if ($scope.hideEMR != true) {
                //   //   window.history.back()
                //   // }

                // }, function (error) {
                //   // $scope.isNext = false;
                //   $scope.hideSimpan = false
                // })
                // //   }else{
                // //     $scope.hideSimpan = false
                // //     alert(x.data.data);
                // //     return;
                // //   }                       
                // // })

                // // $scope.SaveLogUser=function(){
                // // }
                // // break;
                if ($scope.item.pasien.objectdepartemenfk == 16 || $scope.item.pasien.objectdepartemenlastfk == 16 || $scope.item.pasien.objectruanganfk == 545 || $scope.item.pasien.objectruanganfk == 453 || $scope.item.pasien.objectruanganfk == 575 || $scope.item.pasien.objectruanganfk == 576 || $scope.item.pasien.objectruanganfk == 44 || $scope.item.pasien.objectruanganfk == 251 || $scope.item.pasien.objectruanganfk == 20 || $scope.item.pasien.objectruanganfk == 322 || $scope.item.pasien.objectruanganfk == 569 || $scope.item.pasien.objectruanganfk == 277 || $scope.item.pasien.objectruanganfk == 309 || $scope.item.pasien.objectruanganfk == 72) {
                    if ($scope.dataTindakan._data.length == 0) {
                        toastr.error('Tindakan belum di isi')
                        return
                    }
                    var dataTindakanFix = [];
                    $scope.dataTindakan._data.forEach(function(e) {

                        if (e.listKomponen.length <= 0) {
                            window.messageContainer.error("Simpan Gagal, Komponen Tindakan tidak ada");
                            return
                        } else {
                            var petugasLayanan = [];
                            $scope.gridPetugasPelaksana._data.forEach(function(a) {
                                if (e.rowNumber === a.idParent) {
                                    petugasLayanan.push({
                                        "objectjenispetugaspefk": a.jenisPetugas.id,
                                        // "objectpegawaifk": a.jenisPetugas.id
                                        "listpegawai": a.listPetugas
                                    });
                                }
                            })
                            var statusCitto = 0
                            if (e.cito == 2) {
                                statusCitto = 1;
                            }
                            var nilaiCito = 0
                            var nilaijasaCito = 0
                            if (e.jasacito != 0) {
                                nilaiCito = e.jasacito;
                                nilaijasaCito = e.nilaicito;
                            }


                            // if ( $scope.listKomponen.length>0)
                            // {
                            if (e.arrayIndikator != undefined) {
                                if (e.arrayIndikator.length > 0) {
                                    dataTindakanFix.push({
                                        "noregistrasifk": $scope.currentNorecAPD,
                                        "tglregistrasi": $scope.item.pasien.tglregistrasi,
                                        "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                                        "ruangan": e.ruangan,
                                        "produkfk": e.produk.id,
                                        "hargasatuan": e.hargaSatuan,
                                        "diskon": e.hargadiskon,
                                        "hargajual": e.hargaSatuan,
                                        "harganetto": e.hargaSatuan,
                                        "objectkelompokpasien": $scope.item.pasien.objectkelompokpasienlastfk,
                                        "jumlah": e.qty,
                                        "kelasfk": $scope.item.pasien.objectkelasfk,
                                        "pelayananpetugas": petugasLayanan,
                                        "komponenharga": e.listKomponen,
                                        "keterangan": $scope.item.pemeriksaanKeluar === true ? 'Pemeriksaan Keluar' : '-',
                                        "iscito": statusCitto,
                                        "jasacito": nilaiCito,
                                        "isparamedis": e.isparamedis,
                                        "jenispelayananfk": e.jenispelayananfk,
                                        "nilaicito": nilaijasaCito,
                                        "noregistrasi": $scope.item.pasien.noregistrasi,
                                        "idpengirim": null,
                                        "indikator": e.namaIndikator,
                                        "id_indikator": e.id_indikator,
                                        "mipfk": e.mipfk,
                                        "objectruanganfk": $scope.item.pasien.objectruanganfk,
                                        "objectdepartemenfk": $scope.item.pasien.objectdepartemenfk,
                                        "arrayIndikator": e.arrayIndikator,
                                        "statVariable": e.statVariable
                                    });
                                } else {
                                    dataTindakanFix.push({
                                        "noregistrasifk": $scope.currentNorecAPD,
                                        "tglregistrasi": $scope.item.pasien.tglregistrasi,
                                        "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                                        "ruangan": e.ruangan,
                                        "produkfk": e.produk.id,
                                        "hargasatuan": e.hargaSatuan,
                                        "diskon": e.hargadiskon,
                                        "hargajual": e.hargaSatuan,
                                        "harganetto": e.hargaSatuan,
                                        "objectkelompokpasien": $scope.item.pasien.objectkelompokpasienlastfk,
                                        "jumlah": e.qty,
                                        "kelasfk": $scope.item.pasien.objectkelasfk,
                                        "pelayananpetugas": petugasLayanan,
                                        "komponenharga": e.listKomponen,
                                        "keterangan": $scope.item.pemeriksaanKeluar === true ? 'Pemeriksaan Keluar' : '-',
                                        "iscito": statusCitto,
                                        "jasacito": nilaiCito,
                                        "isparamedis": e.isparamedis,
                                        "jenispelayananfk": e.jenispelayananfk,
                                        "nilaicito": nilaijasaCito,
                                        "noregistrasi": $scope.item.pasien.noregistrasi,
                                        "idpengirim": null,
                                        "id_indikator": null
                                    });
                                }
                            } else {
                                dataTindakanFix.push({
                                    "noregistrasifk": $scope.currentNorecAPD,
                                    "tglregistrasi": $scope.item.pasien.tglregistrasi,
                                    "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                                    "ruangan": e.ruangan,
                                    "produkfk": e.produk.id,
                                    "hargasatuan": e.hargaSatuan,
                                    "diskon": e.hargadiskon,
                                    "hargajual": e.hargaSatuan,
                                    "harganetto": e.hargaSatuan,
                                    "objectkelompokpasien": $scope.item.pasien.objectkelompokpasienlastfk,
                                    "jumlah": e.qty,
                                    "kelasfk": $scope.item.pasien.objectkelasfk,
                                    "pelayananpetugas": petugasLayanan,
                                    "komponenharga": e.listKomponen,
                                    "keterangan": $scope.item.pemeriksaanKeluar === true ? 'Pemeriksaan Keluar' : '-',
                                    "iscito": statusCitto,
                                    "jasacito": nilaiCito,
                                    "isparamedis": e.isparamedis,
                                    "jenispelayananfk": e.jenispelayananfk,
                                    "nilaicito": nilaijasaCito,
                                    "noregistrasi": $scope.item.pasien.noregistrasi,
                                    "idpengirim": null,
                                    "id_indikator": null
                                });
                            }
                            // });
                        }
                    })
                    var objSave = {
                        pelayananpasien: dataTindakanFix

                    }


                    //   $scope.hideSimpan = true
                    //   // medifirstService.post('tatarekening/tindakan/cektindakan',JSON.stringify(objSave)).then(function(x){
                    //   //  debugger;
                    //   //  if(x.data.data == 'lolos'){
                    //   medifirstService.post('tatarekening/tindakan/save-tindakan', JSON.stringify(objSave)).then(function (e) {
                    //     //  $scope.isSimpan = true;
                    //     // $scope.isNext = true;
                    //     medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function (data) {
                    //     })
                    //     // $scope.savePanggilDokter()
                    //     $scope.hapusAll();
                    //     $scope.hideSimpan = false
                    //     // if ($scope.hideEMR != true) {
                    //     //   window.history.back()
                    //     // }

                    //   }, function (error) {
                    //     // $scope.isNext = false;
                    //     $scope.hideSimpan = false
                    //   })
                    //   //   }else{
                    //   //     $scope.hideSimpan = false
                    //   //     alert(x.data.data);
                    //   //     return;
                    //   //   }                       
                    //   // })

                    //   // $scope.SaveLogUser=function(){
                    //   // }
                    //   // break;
                    // return;

                    //dari trisno
                    $scope.hideSimpan = true
                    debugger;
                    medifirstService.post('tatarekening/tindakan/cektindakan', JSON.stringify(objSave)).then(function(x) {
                        debugger;
                        if (x.data.data == 'lolos') {
                            medifirstService.post('tatarekening/tindakan/save-tindakan', JSON.stringify(objSave)).then(function(e) {
                                //  $scope.isSimpan = true;
                                // $scope.isNext = true;
                                if (e.data.PP.length > 0) {
                                    var objSaves = {
                                        "datas": e.data.PP,
                                        'norec_apd': $scope.currentNorecAPD
                                    }
                                    medifirstService.postNonMessage('tatarekening/tindakan/save-tindakan-ppi', objSaves).then(function(data) {
                                        bacot = [];
                                    })
                                }
                                medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function(data) {})
                                    // $scope.savePanggilDokter()
                                $scope.hapusAll();
                                $scope.hideSimpan = false
                                    // if ($scope.hideEMR != true) {
                                    //   window.history.back()
                                    // }

                            }, function(error) {
                                // $scope.isNext = false;
                                $scope.hideSimpan = false
                            })
                        } else {
                            $scope.hideSimpan = false
                            alert(x.data.data);
                            return;
                        }
                    })
                    return;

                } else {

                }
                if ($scope.dataSourceDiagnosaIcd10._data.length == 0) {
                    toastr.error('Diagnosa Utama/Primary Belum Diinput !')
                    return
                }
                if ($scope.dataSourceDiagnosaIcd10._data) {
                    for (let i = 0; i < $scope.dataSourceDiagnosaIcd10._data.length; i++) {
                        if ($scope.dataSourceDiagnosaIcd10._data[i].objectjenisdiagnosafk == 1) {
                            if ($scope.dataTindakan._data.length == 0) {
                                toastr.error('Tindakan belum di isi')
                                return
                            }
                            var dataTindakanFix = [];
                            $scope.dataTindakan._data.forEach(function(e) {

                                if (e.listKomponen.length <= 0) {
                                    window.messageContainer.error("Simpan Gagal, Komponen Tindakan tidak ada");
                                    return
                                } else {
                                    var petugasLayanan = [];
                                    $scope.gridPetugasPelaksana._data.forEach(function(a) {
                                        if (e.rowNumber === a.idParent) {
                                            petugasLayanan.push({
                                                "objectjenispetugaspefk": a.jenisPetugas.id,
                                                // "objectpegawaifk": a.jenisPetugas.id
                                                "listpegawai": a.listPetugas
                                            });
                                        }
                                    })
                                    var statusCitto = 0
                                    if (e.cito == 2) {
                                        statusCitto = 1;
                                    }
                                    var nilaiCito = 0
                                    var nilaijasaCito = 0
                                    if (e.jasacito != 0) {
                                        nilaiCito = e.jasacito;
                                        nilaijasaCito = e.nilaicito;
                                    }


                                    // if ( $scope.listKomponen.length>0)
                                    // {
                                    dataTindakanFix.push({
                                        "noregistrasifk": $scope.currentNorecAPD,
                                        "tglregistrasi": $scope.item.pasien.tglregistrasi,
                                        "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                                        "ruangan": e.ruangan,
                                        "produkfk": e.produk.id,
                                        "hargasatuan": e.hargaSatuan,
                                        "diskon": e.hargadiskon,
                                        "hargajual": e.hargaSatuan,
                                        "harganetto": e.hargaSatuan,
                                        "objectkelompokpasien": $scope.item.pasien.objectkelompokpasienlastfk,
                                        "jumlah": e.qty,
                                        "kelasfk": $scope.item.pasien.objectkelasfk,
                                        "pelayananpetugas": petugasLayanan,
                                        "komponenharga": e.listKomponen,
                                        "keterangan": $scope.item.pemeriksaanKeluar === true ? 'Pemeriksaan Keluar' : '-',
                                        "iscito": statusCitto,
                                        "jasacito": nilaiCito,
                                        "isparamedis": e.isparamedis,
                                        "jenispelayananfk": e.jenispelayananfk,
                                        "nilaicito": nilaijasaCito,
                                        "noregistrasi": $scope.item.pasien.noregistrasi,
                                        "idpengirim": null
                                    });

                                }
                            })
                            var objSave = {
                                pelayananpasien: dataTindakanFix

                            }


                            //     $scope.hideSimpan = true
                            //     // medifirstService.post('tatarekening/tindakan/cektindakan',JSON.stringify(objSave)).then(function(x){
                            //     //  debugger;
                            //     //  if(x.data.data == 'lolos'){
                            //     medifirstService.post('tatarekening/tindakan/save-tindakan', JSON.stringify(objSave)).then(function (e) {
                            //       //  $scope.isSimpan = true;
                            //       // $scope.isNext = true;
                            //       medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function (data) {
                            //       })
                            //       // $scope.savePanggilDokter()
                            //       $scope.hapusAll();
                            //       $scope.hideSimpan = false
                            //       // if ($scope.hideEMR != true) {
                            //       //   window.history.back()
                            //       // }

                            //     }, function (error) {
                            //       // $scope.isNext = false;
                            //       $scope.hideSimpan = false
                            //     })
                            //     //   }else{
                            //     //     $scope.hideSimpan = false
                            //     //     alert(x.data.data);
                            //     //     return;
                            //     //   }                       
                            // //   }                       
                            //     //   }                       
                            //     // })

                            //     // $scope.SaveLogUser=function(){
                            //     // }
                            //     // break;
                            //     return;

                            // penjagaan tindakan dari trisno
                            $scope.hideSimpan = true
                            debugger;
                            medifirstService.post('tatarekening/tindakan/cektindakan', JSON.stringify(objSave)).then(function(x) {
                                debugger;
                                if (x.data.data == 'lolos') {
                                    medifirstService.post('tatarekening/tindakan/save-tindakan', JSON.stringify(objSave)).then(function(e) {
                                        //  $scope.isSimpan = true;
                                        // $scope.isNext = true;
                                        medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function(data) {})
                                            // $scope.savePanggilDokter()
                                        $scope.hapusAll();
                                        $scope.hideSimpan = false
                                            // if ($scope.hideEMR != true) {
                                            //   window.history.back()
                                            // }

                                    }, function(error) {
                                        // $scope.isNext = false;
                                        $scope.hideSimpan = false
                                    })
                                } else {
                                    $scope.hideSimpan = false
                                    alert(x.data.data);
                                    return;
                                }
                            })
                            return;
                        } else {

                        }
                    }
                }
                if ($scope.dataSourceDiagnosaIcd10._data) {
                    for (let i = 0; i < $scope.dataSourceDiagnosaIcd10._data.length; i++) {
                        if ($scope.dataSourceDiagnosaIcd10._data[i].objectjenisdiagnosafk != 1) {
                            toastr.error('Diagnosa Utama/Primary Belum Diinput !')
                            return
                        } else {

                        }
                    }
                }

                // if ($scope.dataTindakan._data.length == 0) {
                //   toastr.error('Tindakan belum di isi')
                //   return
                // }
                // var dataTindakanFix = [];
                // $scope.dataTindakan._data.forEach(function (e) {

                //   if (e.listKomponen.length <= 0) {
                //     window.messageContainer.error("Simpan Gagal, Komponen Tindakan tidak ada");
                //     return
                //   }
                //   else {
                //     var petugasLayanan = [];
                //     $scope.gridPetugasPelaksana._data.forEach(function (a) {
                //       if (e.rowNumber === a.idParent) {
                //         petugasLayanan.push({
                //           "objectjenispetugaspefk": a.jenisPetugas.id,
                //           // "objectpegawaifk": a.jenisPetugas.id
                //           "listpegawai": a.listPetugas
                //         });
                //       }
                //     })
                //     var statusCitto = 0
                //     if (e.cito == 2) {
                //       statusCitto = 1;
                //     }
                //     var nilaiCito = 0
                //     var nilaijasaCito = 0
                //     if (e.jasacito != 0) {
                //       nilaiCito = e.jasacito;
                //       nilaijasaCito = e.nilaicito;
                //     }


                //     // if ( $scope.listKomponen.length>0)
                //     // {
                //     dataTindakanFix.push({
                //       "noregistrasifk": $scope.currentNorecAPD,
                //       "tglregistrasi": $scope.item.pasien.tglregistrasi,
                //       "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                //       "ruangan": e.ruangan,
                //       "produkfk": e.produk.id,
                //       "hargasatuan": e.hargaSatuan,
                //       "diskon": e.hargadiskon,
                //       "hargajual": e.hargaSatuan,
                //       "harganetto": e.hargaSatuan,
                //       "jumlah": e.qty,
                //       "kelasfk": $scope.item.pasien.objectkelasfk,
                //       "pelayananpetugas": petugasLayanan,
                //       "komponenharga": e.listKomponen,
                //       "keterangan": $scope.item.pemeriksaanKeluar === true ? 'Pemeriksaan Keluar' : '-',
                //       "iscito": statusCitto,
                //       "jasacito": nilaiCito,
                //       "isparamedis": e.isparamedis,
                //       "jenispelayananfk": e.jenispelayananfk,
                //       "nilaicito": nilaijasaCito,
                //       "noregistrasi": $scope.item.pasien.noregistrasi,
                //       "idpengirim":""
                //     });

                //   }
                // })
                // var objSave = {
                //   pelayananpasien: dataTindakanFix

                // }
                // $scope.hideSimpan = true
                // // medifirstService.post('tatarekening/tindakan/cektindakan',JSON.stringify(objSave)).then(function(x){
                // //  debugger;
                // //  if(x.data.data == 'lolos'){
                // medifirstService.post('tatarekening/tindakan/save-tindakan', JSON.stringify(objSave)).then(function (e) {
                //   //  $scope.isSimpan = true;
                //   // $scope.isNext = true;
                //   medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function (data) {
                //   })
                //   // $scope.savePanggilDokter()
                //   $scope.hapusAll();
                //   $scope.hideSimpan = false
                //   // if ($scope.hideEMR != true) {
                //   //   window.history.back()
                //   // }

                // }, function (error) {
                //   // $scope.isNext = false;
                //   $scope.hideSimpan = false
                // })
                // //   }else{
                // //     $scope.hideSimpan = false
                // //     alert(x.data.data);
                // //     return;
                // //   }                       
                // // })

                // // $scope.SaveLogUser=function(){
                // // }

            }
            $scope.savePanggilDokter = function() {
                var kelompokUser = medifirstService.getKelompokUser()
                var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
                if (kelompokUser == 'dokter' && chacePeriode != undefined) {
                    var data = {
                        "norec_apd": $scope.currentNorecAPD,
                        "kelompokUser": kelompokUser
                    }
                    medifirstService.postNonMessage('rawatjalan/save-panggil', data)
                        .then(function(res) {

                        })
                }
            }
            $scope.Back = function() {
                window.history.back();
            }
            $scope.cekParamedis = function(bool) {
                if (bool) {
                    // $scope.show = false
                    // $scope.item.jenisPelaksana = undefined;
                    // $scope.item.jenisPelaksana2 = undefined;
                    // $scope.item.jenisPelaksana3 = undefined;
                    // $scope.item.jenisPelaksana4 = undefined
                    // $scope.selectedPegawai = [];
                    // $scope.selectedPegawai1 = [];
                    // $scope.selectedPegawai2 = [];
                    // $scope.selectedPegawai3 = [];
                    // $scope.selectedPegawai4 = [];
                    // $scope.selectedPegawai5 = [];
                } else {
                    // $scope.show = true
                }

            }
            $scope.paket = {}
            $scope.cekPaket = function(bool) {
                if (bool) {
                    $scope.popUpPaket.center().open()
                    medifirstService.get('sysadmin/general/get-paket-tindakan').then(function(e) {
                        $scope.sourcePaket = new kendo.data.DataSource({
                            data: e.data,
                            pageSize: 10,
                        });
                    })

                } else {

                }

            }
            $scope.optionsPaket = {
                // dataBound: function () {
                //     this.expandRow(this.tbody.find("tr.k-master-row"));
                // },
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "namapaket", title: "Nama Paket", width: 120, },
                    { field: "jml", title: "Jumlah Tindakan", width: 80 },
                ],
            };
            $scope.data2 = function(dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        { field: "namaproduk", title: "Nama Pelayanan", width: 120 }
                    ]
                }
            };
            $scope.tutupPaket = function() {
                var model = $parse("dataSource"); // 6-5 asar
                $scope.selectedPegawai = [];
                $scope.item.jenisPelaksana = '';
                $scope.listPegawai = new kendo.data.DataSource({ // 6-5 asar
                    data: [] // 6-5 asar
                }); // 6-5 asar
                model.assign($scope, $scope.listPegawai); // 6-5 asar
                kosongkanPaket()
                $scope.item.paket = false
                $scope.popUpPaket.close()
            }

            var timeoutPromise;
            $scope.$watch('paket.namaPaket', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    applyFilter("namapaket", newVal)
                }
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridPaket").data("kendoGrid");
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
            $scope.resetFilterPaket = function() {
                var dataGrid = $("#gridPaket").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.paket = {};
            }
            $scope.klikPaket = function(select) {
                $scope.totalHargaDefault = 0
                var arr = select.details

                for (var i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    $scope.listKomponen = []

                    medifirstService.get("sysadmin/general/get-komponenharga-paket?idRuangan=" +
                        $scope.item.pasien.objectruanganfk +
                        "&idKelas=" + $scope.item.pasien.objectkelasfk +
                        "&idProduk=" + element.objectprodukfk +
                        "&idJenisPelayanan=" + $scope.item.pasien.objectjenispelayananfk
                    ).then(function(dat) {
                        if (dat.data.data.length == 0) {
                            return
                        }
                        $scope.totalHargaDefault = $scope.totalHargaDefault + parseFloat(dat.data.data2[0].hargasatuan)

                    })
                }
            }
            $scope.tambahPaket = function() {
                if ($scope.dataPaketSelect == undefined) {
                    toastr.error('Pilih Paket dulu')
                    return
                }
                if ($scope.paket.jenisPelaksana == undefined) {
                    toastr.error("Jenis Pelaksana harus di isi")
                    return
                }
                if ($scope.selectedPegawaiPaket.length == 0) {
                    toastr.error('Petugas Pelaksana harus di isi')
                    return
                }

                var arr = $scope.dataPaketSelect.details

                for (var i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    $scope.listKomponen = []

                    medifirstService.get("sysadmin/general/get-komponenharga-paket?idRuangan=" +
                        $scope.item.pasien.objectruanganfk +
                        "&idKelas=" + $scope.item.pasien.objectkelasfk +
                        "&idProduk=" + element.objectprodukfk +
                        "&idJenisPelayanan=" + $scope.item.pasien.objectjenispelayananfk
                    ).then(function(dat) {
                        if (dat.data.data.length == 0) {
                            toastr.error('Mapping tindakan belum ada, Hubungi IT', 'Error')
                            return
                        }
                        var hargasatuan = parseFloat(dat.data.data2[0].hargasatuan)
                        if ($scope.dataPaketSelect.hargapaket != 0 &&
                            $scope.dataPaketSelect.hargapaket < $scope.totalHargaDefault) { // ** mun paketna lebih murah */
                            // debugger
                            hargasatuan = $scope.dataPaketSelect.hargapaket / $scope.totalHargaDefault * hargasatuan

                            //** Kompoonen */
                            for (let j = 0; j < dat.data.data.length; j++) {
                                const element = dat.data.data[j];
                                element.hargasatuan = hargasatuan / parseFloat(dat.data.data2[0].hargasatuan) * parseFloat(element.hargasatuan)
                                    // debugger
                                element.hargasatuan = element.hargasatuan.toFixed(2)
                            }
                        }

                        // console.log( hargasatuan )
                        // console.log( $scope.listKomponen )
                        $scope.listKomponen = dat.data.data;
                        // $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;

                        var nomor = 0
                        if ($scope.dataTindakan == undefined) {
                            nomor = 1
                        } else {
                            nomor = data2.length + 1
                        }
                        var data = {};
                        data = {
                            rowNumber: nomor,
                            tglPelayanan: $scope.item.tglPelayanan,
                            produk: { id: element.objectprodukfk, namaproduk: element.namaproduk }, //$scope.item.noRegistrasi,
                            qty: 1,
                            hargaSatuan: hargasatuan.toFixed(2),
                            hargadiskon: 0,
                            subTotal: (hargasatuan.toFixed(2)) * (1),
                            listKomponen: $scope.listKomponen,
                            statuscito: "",
                            cito: "",
                            jasacito: 0,
                            // isparamedis: $scope.item.paramedis,
                            jenispelayananfk: $scope.item.pasien.objectjenispelayananfk,
                            nilaicito: 0,


                        }
                        data2.push(data)
                            // $scope.dataGrid.add($scope.dataSelected)
                        $scope.dataTindakan = new kendo.data.DataSource({
                            data: data2
                        });
                        var subTotal = 0;
                        for (var i = data2.length - 1; i >= 0; i--) {
                            subTotal = subTotal + parseFloat(data2[i].subTotal)
                        }
                        $scope.item.totalAlls = $scope.formatRupiah(subTotal, 'Rp.') //parseFloat(subTotal).to
                        var pushData = {
                            "idParent": data.rowNumber,
                            "jenisPetugas": {
                                "id": $scope.paket.jenisPelaksana.id,
                                "jenisPelaksana": $scope.paket.jenisPelaksana.jenispetugaspe
                            },
                            "listPetugas": $scope.selectedPegawaiPaket
                        }
                        $scope.gridPetugasPelaksana.add(pushData);
                    })


                }
            }

            function kosongkanPaket() {
                $scope.selectedPegawaiPaket = []
                delete $scope.paket.jenisPelaksana
                delete $scope.paket.namaPaket
            }
            $scope.selectedPegawaiPaket = []
            $scope.getPegawaiByJenis = function() {
                var id = $scope.paket.jenisPelaksana.id;
                var model = 'dataSource';
                var listArray = 'selectedPegawaiPaket';
                var isInList = $scope.isInArray(id, $scope.listIdPetugas);
                if (isInList) {
                    getGenericPegawai(model, listArray);
                } else {
                    getPegawaiById(id, model, listArray);
                }
            };




        }
    ]);
});