define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarPasienSentraVisumCtrl', ['$mdDialog', '$state', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function($mdDialog, $state, cacheHelper, $scope, medifirstService, dateHelper) {
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.dataSelectedVisum = {};
            $scope.now = new Date();
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.show1 = false;
            $scope.show2 = false;
            $scope.buttonsearch = true;
            $scope.pegawaidalam = false
            $scope.pegawaidalam2 = false
            $scope.pegawaidalam3 = false
            $scope.tambahpegawaidalam = true
            $scope.tambahpegawaidalam2 = false
            $scope.tambahpegawaidalam3 = false
            var tampungannorec = '';
            var tampungannoregistrasi = '';
            var tampungancatatan = '';
            var temppegawai = '';
            getPasienSentraVisum();
            LoadCombo();

            $scope.Cari = function() {
                $scope.isRouteLoading = true;
                getPasienSentraVisum();

            }
            $scope.ceklispilihManualdalam = function(bool) {
                if (bool) {
                    $scope.pegawaidalam2 = true
                    $scope.tambahpegawaidalam3 = true
                    $scope.tambahpegawaidalam2 = false
                } else {
                    $scope.pegawaidalam2 = false
                }
            }
            $scope.ceklispilihManualdalam2 = function(bool) {
                if (bool) {
                    $scope.pegawaidalam3 = true
                    $scope.tambahpegawaidalam3 = false
                } else {
                    $scope.pegawaidalam3 = false
                }
            }
            $scope.ceklispilihManualdalam3 = function(bool) {
                if (bool) {
                    $scope.pegawaidalam = true
                    $scope.tambahpegawaidalam2 = true
                    $scope.tambahpegawaidalam = false
                } else {
                    $scope.pegawaidalam = false
                    $scope.tambahpegawaidalam2 = false
                    $scope.tambahpegawaidalam = true
                }
            }

            function LoadCombo() {
                medifirstService.get('registrasi/get-data-combo?').then(function(dat) {
                    $scope.listJenisKekerasan = dat.data.jeniskekerasan
                    $scope.listDokter = dat.data.dokter
                })
            }
            $scope.cariTemplate = function() {
                if ($scope.item.jeniskekerasan.id == 8) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=KFD').then(function(dat) {
                        debugger
                        // $scope.item.kllvisum = dat.data.data[0].template
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else if ($scope.item.jeniskekerasan.id == 4) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=KLL').then(function(dat) {
                        debugger
                        // $scope.item.kllvisum = dat.data.data[0].template
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else if ($scope.item.jeniskekerasan.id == 2) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=KDRT').then(function(dat) {
                        debugger
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else if ($scope.item.jeniskekerasan.id == 1) {
                    medifirstService.get('sysadmin/general/get-daftar-template?kodeexternal=SEKSUAL').then(function(dat) {
                        debugger
                        $scope.item.riwayatkejadian = dat.data.data[0].template
                        $scope.item.hasilpemeriksaan = dat.data.data[1].template
                        $scope.item.kesimpulan = dat.data.data[2].template
                    })
                    $scope.show1 = true;
                    $scope.buttonsearch = false;
                } else {
                    alert('Hehe')
                    return
                }

            }
            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"
                ],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };

            function getPasienSentraVisum() {
                debugger
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var noreg = ''
                if ($scope.item.noregistrasi != undefined) {
                    noreg = "&noreg=" + $scope.item.noregistrasi
                } else {
                    noreg = ''
                }
                var nocm = ''
                if ($scope.item.nocm != undefined) {
                    nocm = "&nocm=" + $scope.item.nocm
                } else {
                    nocm = ''
                }
                var nama = ''
                if ($scope.item.namapasien != undefined) {
                    nama = "&nama=" + $scope.item.namapasien
                } else {
                    nama = ''
                }
                var pegawai = ''
                temppegawai = medifirstService.getPegawaiLogin().id
                debugger
                if (temppegawai == 25655 || temppegawai == 25393 || temppegawai == 25715 || temppegawai == 25137 || temppegawai == 320261213) {
                    pegawai = "&idPegawai=" + temppegawai
                        // pegawai = ''
                } else {
                    pegawai = ''
                }

                medifirstService.get("registrasi/get-data-pasien-masuk-sentra-visum?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noreg +
                    nocm +
                    nama +
                    pegawai).then(function(data) {
                    debugger
                    $scope.isRouteLoading = false;
                    var datas = data.data
                    for (var i = 0; i < datas.length; i++) {
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datas[i].tgllahir);
                        var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                        datas[i].umurs = umurs.year + ' Tahun '
                    }
                    $scope.sourceLaporanVisum = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 50,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }
                    });
                    // $(document).ready(function () {
                    //     $("#grid").kendoGrid({
                    //         dataSource: {
                    //             data: datas,
                    //             pageSize: 50,
                    //             total: data.length,
                    //             serverPaging: false,
                    //             schema: {
                    //                 model: {
                    //                     fields: {

                    //                     }
                    //                 }
                    //             }
                    //         },


                    $scope.columnLaporanVisum = {
                            scrollable: true,
                            selectable: "row",
                            pageable: true,
                            columns: [{
                                    "field": "status",
                                    "title": "Status Hasil",
                                    "width": "50px",
                                    // "template": "<button class=\"k-button custom-button\" ng-click=\"status(dataItem)\" style=\"margin:0 0 5px\">#: status #</button>",
                                    "template": "# if (status == 'Terdaftar Di Visum2') { # <button class=\"k-button buttonTerdaftar\" ng-click=\"status(dataItem)\" style=\"margin:0 0 5px\">#: status #</button> # }  else { # <button class=\"k-button custom-button\" ng-click=\"status(dataItem)\" style=\"margin:0 0 5px\">#: status #</button> # }#"
                                },
                                {
                                    "title": "Riwayat Hasil",
                                    "width": "50px",
                                    "template": "<button class=\"k-button custom-button23\" ng-click=\"riwayat(dataItem)\" style=\"margin:0 0 5px\">Riwayat</button>",
                                },
                                {
                                    "field": "tglregistrasi",
                                    "title": "Tgl Registrasi",
                                    "width": "50px",
                                },
                                {
                                    "field": "noregistrasi",
                                    "title": "No Registrasi",
                                    "width": "50px",
                                },
                                {
                                    "field": "nocm",
                                    "title": "No RM",
                                    "width": "50px",
                                },
                                {
                                    "field": "namapasien",
                                    "title": "Nama Pasien",
                                    "width": "50px",
                                },
                                {
                                    "field": "jeniskelamin",
                                    "title": "Jenis Kelamin",
                                    "width": "50px",
                                },
                                {
                                    "field": "umurs",
                                    "title": "Umur",
                                    "width": "50px",
                                },
                                // {
                                //     "field": "statuspasien",
                                //     "title": "Status",
                                //     "width": "50px",
                                // },
                                {
                                    "field": "namalengkap",
                                    "title": "Dokter DPJP",
                                    "width": "50px",
                                },
                                {
                                    "field": "dokterkonsultan",
                                    "title": "Dokter Konsulen 1",
                                    "width": "50px",
                                    attributes: {
                                        class: "#=dokterkonsultan == 'Belum Input Dokter Konsulen' ? 'red' : 'green' #"
                                    },
                                },
                                {
                                    "field": "dokterkonsultan2",
                                    "title": "Dokter Konsulen 2",
                                    "width": "50px",
                                    attributes: {
                                        class: "#=dokterkonsultan2 == 'Belum Input Dokter Konsulen' ? 'red' : 'green' #"
                                    },
                                },
                                {
                                    "field": "dokterkonsultan3",
                                    "title": "Dokter Konsulen 3",
                                    "width": "50px",
                                    attributes: {
                                        class: "#=dokterkonsultan3 == 'Belum Input Dokter Konsulen' ? 'red' : 'green' #"
                                    },
                                },
                                {
                                    "field": "kelompokpasien",
                                    "title": "Penjamin",
                                    "width": "50px",
                                },
                                {
                                    "field": "namarekanan",
                                    "title": "Rekanan",
                                    "width": "50px",
                                },
                            ]
                        }
                        // });
                });
                // debugger
                // $("#kGrid").kendoTooltip({
                //     filter: "td:nth-child(11)",
                //     content: function(e) {return e.target.html();}
                // });
                // })
            }
            $scope.resumeMedis = function() {
                if ($scope.dataSelectedVisum == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                debugger;
                medifirstService.get('registrasi/get-apd?noregistrasi=' + $scope.dataSelectedVisum.noregistrasi +
                    '&objectruanganlastfk=' + 251).then(function(e) {
                    if (e.data.data.length > 0) {

                        var arrrStr = {
                            0: $scope.dataSelectedVisum.nocm,
                            1: $scope.dataSelectedVisum.namapasien,
                            2: $scope.dataSelectedVisum.jeniskelamin,
                            3: $scope.dataSelectedVisum.noregistrasi,
                            // 4: $scope.dataSelectedVisum.umur,
                            5: $scope.dataSelectedVisum.kelompokpasien,
                            6: $scope.dataSelectedVisum.tglregistrasi,
                            7: $scope.dataSelectedVisum.norec_apd,
                            8: $scope.dataSelectedVisum.norec,
                            // 9: $scope.dataSelectedVisum.objectkelasfk,
                            // 10: $scope.dataSelectedVisum.namakelas,
                            11: '251',
                            12: 'Sentra Visum'
                        }
                        cacheHelper.set('cacheRekamMedis', arrrStr);
                        if ($scope.dataSelectedVisum.objectdepartemenfk == 16 || $scope.dataSelectedVisum.objectdepartemenfk == 25) {
                            $state.go('RekamMedis.EmrVisum', {
                                noRec: e.data.data[0].norec_apd
                            })
                        } else {
                            $state.go('RekamMedis.EmrVisum', {
                                noRec: e.data.data[0].norec_apd
                            })
                        }
                    }
                })

            }
            $scope.status = function(dataSelectedVisum) {
                debugger;

                if (dataSelectedVisum.status == "Terdaftar Di Visum") {
                    var simpan = {
                        norec_pd: dataSelectedVisum.norec_pd,
                        noregistrasi: dataSelectedVisum.noregistrasi,
                    }
                    medifirstService.post('registrasi/save-pasien-to-draft?', simpan).then(function(dat) {
                        getPasienSentraVisum();
                    })
                } else if (dataSelectedVisum.status == "Draft Penulis") {
                    debugger
                    tampungannorec = dataSelectedVisum.norec
                    tampungannoregistrasi = dataSelectedVisum.noregistrasi
                    tampungancatatan = dataSelectedVisum.catatan
                    if (dataSelectedVisum.draftriwayatkejadian != null) {
                        medifirstService.get('registrasi/get-draft-visum?noregistrasi=' + dataSelectedVisum.noregistrasi).then(function(dat) {
                            debugger
                            $scope.show1 = true;
                            $scope.buttonsearch = false;
                            if (dat.data[0].dokterkonsultanfk != null) {
                                $scope.pegawaidalam = true;
                                $scope.tambahpegawaidalam = false;
                                $scope.item.konsulen = { id: dat.data[0].dokterkonsultanfk, namalengkap: dat.data[0].dokterkonsultan }
                            }
                            if (dat.data[0].dokterkonsultan2fk != null) {
                                $scope.pegawaidalam2 = true;
                                $scope.tambahpegawaidalam2 = false;
                                $scope.item.konsulen2 = { id: dat.data[0].dokterkonsultan2fk, namalengkap: dat.data[0].dokterkonsultan2 }
                            }
                            if (dat.data[0].dokterkonsultan3fk != null) {
                                $scope.pegawaidalam3 = true;
                                $scope.tambahpegawaidalam3 = false;
                                $scope.item.konsulen3 = { id: dat.data[0].dokterkonsultan3fk, namalengkap: dat.data[0].dokterkonsultan3 }
                            }
                            debugger
                            $scope.item.jeniskekerasan = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                            $scope.item.penulis = dat.data[0].penulis
                            $scope.item.tgltulis = dat.data[0].tgltulis
                            $scope.item.dokter = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                            $scope.item.dokterkonsultan = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                            $scope.item.nosurat = dat.data[0].nosurat
                            $scope.item.permintaandari = dat.data[0].permintaan
                            $scope.item.nosuratpermintaan = dat.data[0].nosuratpermintaan
                                // $scope.item.kllvisum = dat.data[0].draftvisum
                            $scope.item.riwayatkejadian = dat.data[0].draftriwayatkejadian
                            $scope.item.hasilpemeriksaan = dat.data[0].drafthasilpemeriksaan
                            $scope.item.kesimpulan = dat.data[0].draftkesimpulan
                            $scope.item.tglminta = dat.data[0].tglpermintaan
                            $scope.item.norec_pd11 = dat.data[0].norec_pd
                            $scope.item.noregistrasi11 = dat.data[0].noregistrasi
                            $scope.item.catatan44 = dat.data[0].catatan
                            $scope.popUpHasilPemeriksaan.center().open();
                        })
                    } else {
                        var user = medifirstService.getPegawaiLogin().namaLengkap;
                        $scope.item.penulis = user
                        $scope.item.tgltulis = moment($scope.now).format('YYYY-MM-DD HH:mm');
                        $scope.item.dokter = { id: dataSelectedVisum.iddokter, namalengkap: dataSelectedVisum.namalengkap };
                        $scope.item.nosurat = "R /  / VER-PPT- /  / 2021 / Rumkit Bhay Tk. I"
                        $scope.item.norec_pd11 = dataSelectedVisum.norec_pd
                        $scope.item.noregistrasi11 = dataSelectedVisum.noregistrasi
                        $scope.popUpHasilPemeriksaan.center().open();
                    }
                } else if (dataSelectedVisum.status == "Koreksi I") {
                    medifirstService.get('registrasi/get-detail-pasien-sentra-visum?norec=' + dataSelectedVisum.norec_pd).then(function(dat) {
                        debugger
                        var teing = dat.data[0]
                        $scope.item.jeniskekerasan2 = { id: teing.jeniskekerasanfk, jeniskekerasan: teing.jeniskekerasan }
                        $scope.item.penulis2 = teing.penulis
                        $scope.item.tgltulis2 = teing.tgltulis
                        $scope.item.dokter2 = { id: teing.iddokter, namalengkap: teing.dokter }
                        $scope.item.dokterkonsultan2 = { id: teing.iddokterkonsultan, namalengkap: teing.dokterkonsultan }
                        $scope.item.nosurat2 = teing.nosurat
                        $scope.item.permintaandari2 = teing.permintaan
                        $scope.item.nosuratpermintaan2 = teing.nosuratpermintaan
                            // $scope.item.riwayat2 = teing.riwayatkejadiani
                            // $scope.item.hasilpemeriksaan = teing.kllvisum
                        $scope.item.riwayatkejadian2 = teing.riwayatkejadiani
                        $scope.item.hasilpemeriksaan2 = teing.hasilpemeriksaani
                        $scope.item.kesimpulan2 = teing.kesimpulani
                        $scope.item.tglminta2 = teing.tglpermintaan
                        $scope.item.norec2 = teing.norec
                        $scope.item.norec_pd2 = teing.norec_pd
                        $scope.item.noregistrasi2 = teing.noregistrasi
                        $scope.popUpLihatHasilPemeriksaan.center().open();
                    })
                } else if (dataSelectedVisum.status == "Koreksi Spesialis") {
                    medifirstService.get('registrasi/get-detail-pasien-sentra-visum?norec=' + dataSelectedVisum.norec_pd).then(function(dat) {
                        debugger
                        var teing = dat.data[0]
                        $scope.item.jeniskekerasan4 = { id: teing.jeniskekerasanfk, jeniskekerasan: teing.jeniskekerasan }
                        $scope.item.penulis4 = teing.penulis
                        $scope.item.tgltulis4 = teing.tgltulis
                        $scope.item.dokter4 = { id: teing.iddokter, namalengkap: teing.dokter }
                        $scope.item.dokterkonsultan4 = { id: teing.iddokterkonsultan, namalengkap: teing.dokterkonsultan }
                        $scope.item.nosurat4 = teing.nosurat
                        $scope.item.permintaandari4 = teing.permintaan
                        $scope.item.nosuratpermintaan4 = teing.nosuratpermintaan
                            // $scope.item.riwayat4 = teing.riwayatkejadiani
                            // $scope.item.hasilpemeriksaan4 = teing.kllvisum2
                        $scope.item.riwayatkejadian3 = teing.riwayatkejadianii
                        $scope.item.hasilpemeriksaan3 = teing.hasilpemeriksaanii
                        $scope.item.kesimpulan3 = teing.kesimpulanii
                        $scope.item.tglminta4 = teing.tglpermintaan
                        $scope.item.norec4 = teing.norec
                        $scope.item.norec_pd4 = teing.norec_pd
                        $scope.item.noregistrasi4 = teing.noregistrasi
                        $scope.popUpLihatHasilPemeriksaan2.center().open();
                    })
                } else if (dataSelectedVisum.status == "Koreksi Forensik") {
                    medifirstService.get('registrasi/get-detail-pasien-sentra-visum?norec=' + dataSelectedVisum.norec_pd).then(function(dat) {
                        debugger
                        var teing = dat.data[0]
                        $scope.item.jeniskekerasan7 = { id: teing.jeniskekerasanfk, jeniskekerasan: teing.jeniskekerasan }
                        $scope.item.penulis7 = teing.penulis
                        $scope.item.tgltulis7 = teing.tgltulis
                        $scope.item.dokter7 = { id: teing.iddokter, namalengkap: teing.dokter }
                        $scope.item.dokterkonsultan7 = { id: teing.iddokterkonsultan, namalengkap: teing.dokterkonsultan }
                        $scope.item.nosurat7 = teing.nosurat
                        $scope.item.permintaandari7 = teing.permintaan
                        $scope.item.nosuratpermintaan7 = teing.nosuratpermintaan
                        $scope.item.riwayat7 = teing.riwayatkejadiani
                        $scope.item.hasilpemeriksaan7 = teing.kllvisum3
                        $scope.item.tglminta7 = teing.tglpermintaan
                        $scope.item.norec7 = teing.norec
                        $scope.item.norec_pd7 = teing.norec_pd
                        $scope.item.noregistrasi7 = teing.noregistrasi
                        $scope.item.riwayatkejadian4 = teing.riwayatkejadianiii
                        $scope.item.hasilpemeriksaan4 = teing.hasilpemeriksaaniii
                        $scope.item.kesimpulan4 = teing.kesimpulaniii
                        $scope.popUpLihatHasilPemeriksaan3.center().open();
                    })
                } else if (dataSelectedVisum.status == "Koreksi K.A Instalasi") {
                    medifirstService.get('registrasi/get-detail-pasien-sentra-visum?norec=' + dataSelectedVisum.norec_pd).then(function(dat) {
                        debugger
                        var teing = dat.data[0]
                        $scope.item.jeniskekerasan9 = { id: teing.jeniskekerasanfk, jeniskekerasan: teing.jeniskekerasan }
                        $scope.item.penulis9 = teing.penulis
                        $scope.item.tgltulis9 = teing.tgltulis
                        $scope.item.dokter9 = { id: teing.iddokter, namalengkap: teing.dokter }
                        $scope.item.dokterkonsultan9 = { id: teing.iddokterkonsultan, namalengkap: teing.dokterkonsultan }
                        $scope.item.nosurat9 = teing.nosurat
                        $scope.item.permintaandari9 = teing.permintaan
                        $scope.item.nosuratpermintaan9 = teing.nosuratpermintaan
                        $scope.item.riwayat9 = teing.riwayatkejadiani
                        $scope.item.hasilpemeriksaan9 = teing.kllvisum4
                        $scope.item.tglminta9 = teing.tglpermintaan
                        $scope.item.norec9 = teing.norec
                        $scope.item.norec_pd9 = teing.norec_pd
                        $scope.item.noregistrasi9 = teing.noregistrasi
                        $scope.item.riwayatkejadian5 = teing.riwayatkejadianiv
                        $scope.item.hasilpemeriksaan5 = teing.hasilpemeriksaaniv
                        $scope.item.kesimpulan5 = teing.kesimpulaniv
                        $scope.show1 = true;
                        $scope.buttonsearch = false;
                        if (teing.iddokterkonsultan != null) {
                            $scope.pegawaidalam = true;
                            $scope.tambahpegawaidalam = false;
                            $scope.item.konsulen = { id: teing.iddokterkonsultan, namalengkap: teing.dokterkonsultan }
                        } else {
                            $scope.pegawaidalam = false;
                            $scope.tambahpegawaidalam = true;
                        }
                        if (teing.iddokterkonsultan2 != null) {
                            $scope.pegawaidalam2 = true;
                            $scope.tambahpegawaidalam2 = false;
                            $scope.item.konsulen2 = { id: teing.iddokterkonsultan2, namalengkap: teing.dokterkonsultan2 }
                        } else {
                            $scope.pegawaidalam2 = false;
                            $scope.tambahpegawaidalam2 = true;
                        }
                        if (teing.iddokterkonsultan3 != null) {
                            $scope.pegawaidalam3 = true;
                            $scope.tambahpegawaidalam3 = false;
                            $scope.item.konsulen3 = { id: teing.iddokterkonsultan3, namalengkap: teing.dokterkonsultan3 }
                        } else {
                            $scope.pegawaidalam3 = false;
                            $scope.tambahpegawaidalam3 = true;
                        }
                        $scope.popUpLihatHasilPemeriksaan4.center().open();
                    })
                } else {
                    alert('Hehe')
                    return
                }
            }
            $scope.saveHasilPemeriksaan = function() {
                debugger
                if ($scope.item.konsulen == undefined) {
                    $scope.item.konsulen = {
                        id: null
                    }
                }
                if ($scope.item.konsulen2 == undefined) {
                    $scope.item.konsulen2 = {
                        id: null
                    }
                }
                if ($scope.item.konsulen3 == undefined) {
                    $scope.item.konsulen3 = {
                        id: null
                    }
                }
                debugger;
                var save = {
                    norec: $scope.item.norec_pd11,
                    noregistrasi: $scope.item.noregistrasi11,
                    jeniskekerasanfk: $scope.item.jeniskekerasan.id,
                    penulisfk: medifirstService.getPegawaiLogin().id,
                    tgltulis: $scope.item.tgltulis,
                    dokterfk: $scope.item.dokter.id,
                    dokterkonsultanfk: $scope.item.konsulen.id,
                    dokterkonsultan2fk: $scope.item.konsulen2.id,
                    dokterkonsultan3fk: $scope.item.konsulen3.id,
                    nosurat: $scope.item.nosurat,
                    permintaandari: $scope.item.permintaandari,
                    nosuratpermintaan: $scope.item.nosuratpermintaan,
                    riwayatkejadian: $scope.item.riwayatkejadian,
                    hasilpemeriksaan: $scope.item.hasilpemeriksaan,
                    kesimpulan: $scope.item.kesimpulan,
                    tglminta: moment($scope.item.tglminta).format('YYYY-MM-DD HH:mm:ss'),
                    kllvisum: $scope.item.riwayatkejadian + $scope.item.hasilpemeriksaan + $scope.item.kesimpulan
                }
                $scope.popUpHasilPemeriksaan.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function() {

                    medifirstService.post('registrasi/save-hasil-satu-visum', save).then(function(e) {
                        getPasienSentraVisum();
                    })
                })
            }
            $scope.tutupTulisHasilPemeriksaan = function() {
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.buttonsearch = true;
                $scope.item.jeniskekerasan = undefined;
                $scope.item.tgltulis = undefined;
                $scope.item.dokter = undefined;
                $scope.item.dokterkonsultan = undefined;
                $scope.item.nosurat = undefined;
                $scope.item.permintaandari = undefined;
                $scope.item.nosuratpermintaan = undefined;
                $scope.item.tglminta = undefined;
                $scope.item.kllvisum = undefined;
                $scope.item.riwayatkejadian = undefined;
                $scope.item.hasilpemeriksaan = undefined;
                $scope.item.kesimpulan = undefined;
                $scope.popUpHasilPemeriksaan.close();
            }
            $scope.tutupLihatHasil = function() {
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.buttonsearch = true;
                $scope.item.jeniskekerasan2 = undefined;
                $scope.item.tgltulis2 = undefined;
                $scope.item.dokter2 = undefined;
                $scope.item.dokterkonsultan2 = undefined;
                $scope.item.nosurat2 = undefined;
                $scope.item.permintaandari2 = undefined;
                $scope.item.nosuratpermintaan2 = undefined;
                $scope.item.tglminta2 = undefined;
                $scope.item.hasilpemeriksaan = undefined;
                $scope.popUpLihatHasilPemeriksaan.close();
            }
            $scope.simpanDanKirimKeKoreksiII = function() {
                debugger
                var save = {
                    norec: $scope.item.norec2,
                    riwayatkejadian2: $scope.item.riwayatkejadian2,
                    hasilpemeriksaan2: $scope.item.hasilpemeriksaan2,
                    kesimpulan2: $scope.item.kesimpulan2,
                    kllvisum: $scope.item.riwayatkejadian2 + $scope.item.hasilpemeriksaan2 + $scope.item.kesimpulan2,
                    noregistrasi: $scope.item.noregistrasi2,
                    norec_pd: $scope.item.norec_pd2
                }
                medifirstService.post('registrasi/save-to-koreksi-ii', save).then(function(dat) {
                    getPasienSentraVisum();
                    $scope.popUpLihatHasilPemeriksaan.close();
                })
            }
            $scope.tutupLihatHasil2 = function() {
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.buttonsearch = true;
                $scope.item.jeniskekerasan4 = undefined;
                $scope.item.tgltulis4 = undefined;
                $scope.item.dokter4 = undefined;
                $scope.item.dokterkonsultan4 = undefined;
                $scope.item.nosurat4 = undefined;
                $scope.item.permintaandari4 = undefined;
                $scope.item.nosuratpermintaan4 = undefined;
                $scope.item.tglminta4 = undefined;
                $scope.item.hasilpemeriksaan4 = undefined;
                $scope.item.riwayatkejadian3 = undefined
                $scope.item.hasilpemeriksaan3 = undefined
                $scope.item.kesimpulan3 = undefined
                $scope.popUpLihatHasilPemeriksaan2.close();
            }
            $scope.lihatKoreksiI = function() {
                debugger
                medifirstService.get('registrasi/get-koreksi-i?norec=' + $scope.item.norec4).then(function(dat) {
                    debugger
                    $scope.item.jeniskekerasan6 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                    $scope.item.penulis6 = dat.data[0].penulis
                    $scope.item.tgltulis6 = dat.data[0].tgltulis
                    $scope.item.dokter6 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                    $scope.item.dokterkonsultan6 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                    $scope.item.nosurat6 = dat.data[0].nosurat
                    $scope.item.permintaandari6 = dat.data[0].permintaan
                    $scope.item.nosuratpermintaan6 = dat.data[0].nosuratpermintaan
                    $scope.item.hasilpemeriksaan6 = dat.data[0].kllvisum
                    $scope.item.tglminta6 = dat.data[0].tglpermintaan
                    $scope.popUpLihatKoreksiI.center().open();
                })
            }
            $scope.tutupKoreksiI = function() {
                $scope.item.jeniskekerasan6 = undefined
                $scope.item.penulis6 = undefined
                $scope.item.tgltulis6 = undefined
                $scope.item.dokter6 = undefined
                $scope.item.dokterkonsultan6 = undefined
                $scope.item.nosurat6 = undefined
                $scope.item.permintaandari6 = undefined
                $scope.item.nosuratpermintaan6 = undefined
                $scope.item.riwayat6 = undefined
                $scope.item.hasilpemeriksaan6 = undefined
                $scope.item.tglminta6 = undefined
                $scope.popUpLihatKoreksiI.close();
            }
            $scope.kirimspesialis = function() {
                var save = {
                    norec: $scope.item.norec4,
                    riwayatkejadian3: $scope.item.riwayatkejadian3,
                    hasilpemeriksaan3: $scope.item.hasilpemeriksaan3,
                    kesimpulan3: $scope.item.kesimpulan3,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    kllvisum: $scope.item.riwayatkejadian3 + $scope.item.hasilpemeriksaan3 + $scope.item.kesimpulan3,
                    norec_pd: $scope.item.norec_pd4
                }
                medifirstService.post('registrasi/save-to-spesialis', save).then(function(e) {
                    getPasienSentraVisum();
                    $scope.popUpLihatHasilPemeriksaan2.close();
                })
            }
            $scope.kiriminstalasi = function() {
                debugger;
                var save = {
                    norec: $scope.item.norec7,
                    riwayatkejadian4: $scope.item.riwayatkejadian4,
                    hasilpemeriksaan4: $scope.item.hasilpemeriksaan4,
                    kesimpulan4: $scope.item.kesimpulan4,
                    noregistrasi: $scope.dataSelectedVisum.noregistrasi,
                    kllvisum: $scope.item.riwayatkejadian4 + $scope.item.hasilpemeriksaan4 + $scope.item.kesimpulan4,
                    norec_pd: $scope.item.norec_pd7
                }
                medifirstService.post('registrasi/save-to-ka-instalasi?', save).then(function(dat) {
                    getPasienSentraVisum();
                    $scope.item.jeniskekerasan7 = undefined
                    $scope.item.penulis7 = undefined
                    $scope.item.tgltulis7 = undefined
                    $scope.item.dokter7 = undefined
                    $scope.item.dokterkonsultan7 = undefined
                    $scope.item.nosurat7 = undefined
                    $scope.item.permintaandari7 = undefined
                    $scope.item.nosuratpermintaan7 = undefined
                    $scope.item.riwayat7 = undefined
                    $scope.item.hasilpemeriksaan7 = undefined
                    $scope.item.tglminta7 = undefined
                    $scope.popUpLihatHasilPemeriksaan3.close();
                })
            }
            $scope.tutupLihatHasil3 = function() {
                $scope.item.jeniskekerasan7 = undefined
                $scope.item.penulis7 = undefined
                $scope.item.tgltulis7 = undefined
                $scope.item.dokter7 = undefined
                $scope.item.dokterkonsultan7 = undefined
                $scope.item.nosurat7 = undefined
                $scope.item.permintaandari7 = undefined
                $scope.item.nosuratpermintaan7 = undefined
                $scope.item.riwayat7 = undefined
                $scope.item.hasilpemeriksaan7 = undefined
                $scope.item.tglminta7 = undefined
                $scope.item.riwayatkejadian4 = undefined
                $scope.item.hasilpemeriksaan4 = undefined
                $scope.item.kesimpulan4 = undefined
                $scope.popUpLihatHasilPemeriksaan3.close();
            }
            $scope.tutupLihatHasil4 = function() {
                $scope.item.jeniskekerasan9 = undefined
                $scope.item.penulis9 = undefined
                $scope.item.tgltulis9 = undefined
                $scope.item.dokter9 = undefined
                $scope.item.dokterkonsultan9 = undefined
                $scope.item.nosurat9 = undefined
                $scope.item.permintaandari9 = undefined
                $scope.item.nosuratpermintaan9 = undefined
                $scope.item.riwayat9 = undefined
                $scope.item.hasilpemeriksaan9 = undefined
                $scope.item.tglminta9 = undefined
                $scope.item.riwayatkejadian5 = undefined
                $scope.item.hasilpemeriksaan5 = undefined
                $scope.item.kesimpulan5 = undefined
                $scope.popUpLihatHasilPemeriksaan4.close();
            }
            $scope.kirimprint = function() {
                if ($scope.item.konsulen == undefined) {
                    $scope.item.konsulen = {
                        id: null
                    }
                }
                if ($scope.item.konsulen2 == undefined) {
                    $scope.item.konsulen2 = {
                        id: null
                    }
                }
                if ($scope.item.konsulen3 == undefined) {
                    $scope.item.konsulen3 = {
                        id: null
                    }
                }
                var save = {
                    norec: $scope.item.norec9,
                    riwayatkejadianprint: $scope.item.riwayatkejadian5,
                    hasilpemeriksaanprint: $scope.item.hasilpemeriksaan5,
                    kesimpulanprint: $scope.item.kesimpulan5,
                    kllvisum: $scope.item.riwayatkejadian5 + $scope.item.hasilpemeriksaan5 + $scope.item.kesimpulan5,
                    noregistrasi: $scope.item.noregistrasi9,
                    norec_pd: $scope.item.norec_pd9,
                    dokter: $scope.item.dokter9.id,
                    konsultan: $scope.item.konsulen.id,
                    konsultan2: $scope.item.konsulen2.id,
                    konsultan3: $scope.item.konsulen3.id
                }
                medifirstService.post('registrasi/save-to-print-admin', save).then(function(dat) {
                    getPasienSentraVisum();

                    $scope.item.jeniskekerasan9 = undefined
                    $scope.item.penulis9 = undefined
                    $scope.item.tgltulis9 = undefined
                    $scope.item.dokter9 = undefined
                    $scope.item.dokterkonsultan9 = undefined
                    $scope.item.nosurat9 = undefined
                    $scope.item.permintaandari9 = undefined
                    $scope.item.nosuratpermintaan9 = undefined
                    $scope.item.riwayat9 = undefined
                    $scope.item.hasilpemeriksaan9 = undefined
                    $scope.item.tglminta9 = undefined
                    $scope.item.konsulen = undefined
                    $scope.item.konsulen2 = undefined
                    $scope.item.konsulen3 = undefined
                    $scope.popUpLihatHasilPemeriksaan4.close();
                })
            }
            $scope.formatTanggal = function(tanggal) {
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                }
                //registrasi/get-detail-pasien-sentra-visum?norec='
            $scope.riwayat = function(dataSelectedVisum) {
                debugger
                medifirstService.get('registrasi/get-logging-sentra-visum?norec_pd=' + dataSelectedVisum.norec_pd).then(function(dat) {
                    debugger
                    var datas = dat.data
                    if (datas.length > 0) {
                        $scope.popUpLogging.center().open();
                    } else {
                        alert('Pasien Ini Belum Memiliki Riwayat Hasil !')
                        return;
                    }
                    $scope.sourceLoggingVisum = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 50,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }
                    });
                    $scope.columnLoggingVisum = {
                        scrollable: true,
                        selectable: "row",
                        pageable: true,
                        columns: [{
                                "field": "namalengkap",
                                "title": "Pegawai",
                                "width": "50px",
                            },
                            {
                                "field": "jenislog",
                                "title": "Status Hasil",
                                "width": "50px",
                            },
                            {
                                "field": "tanggal",
                                "title": "Tanggal",
                                "width": "50px",
                                "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
                            },
                        ]
                    }
                })
            }
            $scope.tutupLoggingUser = function() {
                $scope.popUpLogging.close();
            }
            $scope.lihatKoreksiII = function() {
                debugger
                medifirstService.get('registrasi/get-koreksi-i?norec=' + $scope.item.norec7).then(function(dat) {
                    debugger
                    $scope.item.jeniskekerasan6 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                    $scope.item.penulis6 = dat.data[0].penulis
                    $scope.item.tgltulis6 = dat.data[0].tgltulis
                    $scope.item.dokter6 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                    $scope.item.dokterkonsultan6 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                    $scope.item.nosurat6 = dat.data[0].nosurat
                    $scope.item.permintaandari6 = dat.data[0].permintaan
                    $scope.item.nosuratpermintaan6 = dat.data[0].nosuratpermintaan
                    $scope.item.hasilpemeriksaan6 = dat.data[0].kllvisum2
                    $scope.item.tglminta6 = dat.data[0].tglpermintaan
                    $scope.popUpLihatKoreksiI.center().open();
                })
            }
            $scope.lihatKoreksiSpesialis = function() {
                debugger
                medifirstService.get('registrasi/get-koreksi-i?norec=' + $scope.item.norec9).then(function(dat) {
                    debugger
                    $scope.item.jeniskekerasan6 = { id: dat.data[0].jeniskekerasanfk, jeniskekerasan: dat.data[0].jeniskekerasan }
                    $scope.item.penulis6 = dat.data[0].penulis
                    $scope.item.tgltulis6 = dat.data[0].tgltulis
                    $scope.item.dokter6 = { id: dat.data[0].iddokter, namalengkap: dat.data[0].dokter }
                    $scope.item.dokterkonsultan6 = { id: dat.data[0].iddokterkonsultan, namalengkap: dat.data[0].dokterkonsultan }
                    $scope.item.nosurat6 = dat.data[0].nosurat
                    $scope.item.permintaandari6 = dat.data[0].permintaan
                    $scope.item.nosuratpermintaan6 = dat.data[0].nosuratpermintaan
                    $scope.item.hasilpemeriksaan6 = dat.data[0].kllvisum3
                    $scope.item.tglminta6 = dat.data[0].tglpermintaan
                    $scope.popUpLihatKoreksiI.center().open();
                })
            }
            $scope.saveDraft = function() {
                if ($scope.item.konsulen == undefined) {
                    $scope.item.konsulen = {
                        id: null
                    }
                }
                if ($scope.item.konsulen2 == undefined) {
                    $scope.item.konsulen2 = {
                        id: null
                    }
                }
                if ($scope.item.konsulen3 == undefined) {
                    $scope.item.konsulen3 = {
                        id: null
                    }
                }
                debugger
                var save = {
                    norec: $scope.item.norec_pd11,
                    noregistrasi: $scope.item.noregistrasi11,
                    jeniskekerasanfk: $scope.item.jeniskekerasan.id,
                    penulisfk: medifirstService.getPegawaiLogin().id,
                    tgltulis: $scope.item.tgltulis,
                    dokterfk: $scope.item.dokter.id,
                    dokterkonsultanfk: $scope.item.konsulen.id,
                    dokterkonsultan2fk: $scope.item.konsulen2.id,
                    dokterkonsultan3fk: $scope.item.konsulen3.id,
                    nosurat: $scope.item.nosurat,
                    permintaandari: $scope.item.permintaandari,
                    nosuratpermintaan: $scope.item.nosuratpermintaan,
                    tglminta: moment($scope.item.tglminta).format('YYYY-MM-DD HH:mm:ss'),
                    draft: $scope.item.kllvisum,
                    draftriwayatkejadian: $scope.item.riwayatkejadian,
                    drafthasilpemeriksaan: $scope.item.hasilpemeriksaan,
                    draftkesimpulan: $scope.item.kesimpulan
                }
                $scope.popUpHasilPemeriksaan.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin Simpan ke Draft ? Pastikan data yang diisi sudah sesuai')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function() {

                    medifirstService.post('registrasi/save-draft-visum', save).then(function(e) {
                        // loadData()
                        getPasienSentraVisum();
                    })
                })
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.buttonsearch = true;
                $scope.item.jeniskekerasan = undefined;
                $scope.item.tgltulis = undefined;
                $scope.item.dokter = undefined;
                $scope.item.dokterkonsultan = undefined;
                $scope.item.nosurat = undefined;
                $scope.item.permintaandari = undefined;
                $scope.item.nosuratpermintaan = undefined;
                $scope.item.tglminta = undefined;
                $scope.item.kllvisum = undefined;
            }
            $scope.Catatan = function() {
                debugger
                $scope.item.catatan44 = tampungancatatan
                $scope.popUpCatatan.center().open();
            }
            $scope.keluarCatatan = function() {
                $scope.item.catatan44 = undefined
                $scope.popUpCatatan.close()
            }
            $scope.simpanCatatan = function() {
                debugger
                var save = {
                    norec: tampungannorec,
                    catatan: $scope.item.catatan44,
                    noregistrasi: tampungannoregistrasi
                }
                medifirstService.post('registrasi/save-catatan', save).then(function(e) {
                    $scope.popUpCatatan.close()
                })
            }
            $scope.lihatCatatan2 = function() {
                lihatCatatan()
                $scope.popUpLihatCatatan.center().open()
            }

            function lihatCatatan() {
                medifirstService.get('registrasi/get-catatan-visum?norec=' + $scope.dataSelectedVisum.norec).then(function(dat) {
                    $scope.item.catatan45 = dat.data[0].catatan
                })
            }
            $scope.keluarCatatan2 = function() {
                $scope.item.catatan45 = undefined
                $scope.popUpLihatCatatan.close()
            }
        }
    ])
})