define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarRegistrasiPasienAmbulanCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
        function($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {
            // DaftarRegistrasiPasienAmbulanCtrl
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = false;
            $scope.isRouteLoading = false;
            $scope.cboUbahSEP = true;
            $scope.cboSep = false;
            $scope.item.jmlRows = 50
            $scope.tombolSimpanVis = true;
            loadCombo();
            loadData();

            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienAmbulanCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.noReg = arrPeriode[2];
                    $scope.item.noRm = arrPeriode[3];
                    $scope.item.nama = arrPeriode[4];
                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:00'));
                    // $scope.item.tglpulang = $scope.now;					
                }
                medifirstService.get("ambulance/get-data-combo-operator", false).then(function(data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listDokter = data.data.dokter;
                    $scope.listDokter2 = data.data.dokter;
                    $scope.listRuanganBatal = data.data.ruanganall;
                    // $scope.listRuanganApd = data.data.ruanganall;
                    $scope.listDataJenisKelamin = data.data.jeniskelamin;
                    $scope.listPembatalan = data.data.pembatalan;
                    $scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
                    $scope.item.jenisDiagnosis = { id: data.data.jenisdiagnosa[1].id, jenisdiagnosa: data.data.jenisdiagnosa[1].jenisdiagnosa };

                });
                medifirstService.getPart("ambulance/get-data-diagnosa", true, true, 20).then(function(data) {
                    $scope.sourceDiagnosisPrimer = data;
                });
            }
            $scope.getIsiComboRuangan = function() {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnDaftarPasien = {
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "NoReg",
                        "width": "90px"
                    },
                    {
                        "field": "nocm",
                        "title": "NoRM",
                        "width": "70px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namapasien #</span>"
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "85px",
                        "template": "<span class='style-left'>#: jeniskelamin #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'

                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Kelompok Pasien",
                        "width": "100px",
                        "template": "<span class='style-left'>#: kelompokpasien #</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Penjamin",
                        "width": "100px",
                        "template": '# if( namarekanan==null) {# - # } else {# #= namarekanan # #} #'
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": '# if( tglpulang==null) {# - # } else {# #= tglpulang # #} #'

                    },
                    {
                        "field": "alamatlengkap",
                        "title": "Alamat",
                        "width": "100px",
                        "template": '# if( alamatlengkap==null) {# - # } else {# #= alamatlengkap # #} #'
                    },

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        // display: "Menampilkan {2} data"
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    }
                }
            }


            $scope.SearchData = function() {
                loadData()
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }
                var cacheNoreg = ""
                if ($scope.item.noReg != undefined) {
                    cacheNoreg = $scope.item.noReg
                }
                var cacheNoRm = ""
                if ($scope.item.noRm != undefined) {
                    cacheNoRm = $scope.item.noRm
                }
                var cacheNama = ""
                if ($scope.item.nama != undefined) {
                    cacheNama = $scope.item.nama
                }
                var jmlRow = ""
                if ($scope.item.jmlRows != undefined) {
                    jmlRow = "&jmlRows=" + $scope.item.jmlRows
                }

                $q.all([
                    // medifirstService.get("ambulance/get-data-pasien-ambulan?" +
                    medifirstService.get("ambulance/get-data-registrasi-pasien-ambulan?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk +
                        jmlRow),
                ]).then(function(data) {
                    $scope.isRouteLoading = false;
                    var result = data[0].data //.data;
                    for (var i = 0; i < result.length; i++) {
                        result[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(result[i].tgllahir);
                        var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                        result[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                    }
                    $scope.dataDaftarPasien = {
                        data: result,
                        pageSize: 10,
                        // total: data.length,
                        // serverPaging: false,
                        selectable: true,
                        refresh: true,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                        aggregate: [
                            { field: 'noregistrasi', aggregate: 'count' },
                        ]
                    }
                    var chacePeriode = tglAwal + "~" + tglAkhir + "~" + cacheNoreg + "~" + cacheNoRm + "~" + cacheNama;
                    cacheHelper.set('DaftarRegistrasiPasienAmbulanCtrl', chacePeriode);
                });


            };

            $scope.klikGrid = function(dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
                    $scope.dataPasienSelected = dataPasienSelected
                    $scope.noRekamMedis = dataPasienSelected.nocm;
                    // $scope.item.ruanganAntrian = {id:dataPasienSelected.objectruanganlastfk,namaruangan:dataPasienSelected.namaruangan}
                }
            }

            var status = '';
            $scope.popUpInputTindakan = function() {
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }

                medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function(e) {
                    status = e.data.status;
                    if (status == true) {
                        toastr.error('Data Sudah Diclosing, Hubungi Tatarekening', 'Info');
                        return;

                    }
                    medifirstService.get("sysadmin/general/get-apd-general?noregistrasi=" +
                        $scope.dataPasienSelected.noregistrasi
                    ).then(function(data) {
                        $scope.listRuanganApd = data.data.ruangan;
                        $scope.item.ruanganAntrian = {
                            id: $scope.listRuanganApd[0].id,
                            namaruangan: $scope.listRuanganApd[0].namaruangan,
                            norec_apd: $scope.listRuanganApd[0].norec_apd
                        }
                    })
                    $scope.popupAntrians.center().open();
                    $scope.showInputTindakan = true;
                    $scope.showBuktiLayanan = false;
                });


            }


            $scope.pegawai = ModelItem.getPegawai();

            $scope.transaksiPelayanan = function() {

                medifirstService.get("ambulance/get-data-for-combo", true).then(function(dat) {
                    $scope.listRuanganApd = dat.data.ruanganambulan;
                    $scope.item.ruanganAntrian = $scope.listRuanganApd[0];
                    $scope.popupAntrians.center().open();
                })
            }
            $scope.showRincian = function() {
                medifirstService.get("sysadmin/general/get-apd-general?noregistrasi=" +
                    $scope.dataPasienSelected.noregistrasi
                ).then(function(data) {
                    $scope.daftarApd = data.data.ruangan;
                    if ($scope.daftarApd.length > 0) {
                        var status = false
                        var norec_apd = ''
                        for (var i = 0; i < $scope.daftarApd.length; i++) {
                            status = false
                            if ($scope.daftarApd[i].id == $scope.item.ruanganAntrian.id) {
                                status = true
                                norec_apd = $scope.daftarApd[i].norec_apd
                                break
                            }
                        }
                        if (status == true) {
                            $scope.lihatRincian(norec_apd)
                        } else {
                            $scope.saveKonsul()
                        }
                    }
                })


            }
            $scope.saveKonsul = function(argument) {
                $scope.tombolSimpanVis = false;
                var dataKonsul = {
                    "asalrujukanfk": 5, //datang sendiri
                    "norec_pd": $scope.dataPasienSelected.norec_pd,
                    "dokterfk": $scope.item.dokter,
                    "objectruangantujuanfk": $scope.item.ruanganAntrian.id,
                    "objectruanganasalfk": $scope.dataPasienSelected.objectruanganlastfk,
                    "tglregistrasidate": moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
                }
                medifirstService.post('ambulance/save-apd', dataKonsul).then(function(e) {
                    $scope.tombolSimpanVis = true;
                    var norec_apd = e.data.data.norec
                    var arrStr = {
                        0: $scope.dataPasienSelected.nocm,
                        1: $scope.dataPasienSelected.namapasien,
                        2: $scope.dataPasienSelected.jeniskelamin,
                        3: $scope.dataPasienSelected.noregistrasi,
                        4: $scope.dataPasienSelected.umur,
                        5: $scope.dataPasienSelected.objectkelasfk,
                        6: $scope.dataPasienSelected.namakelas,
                        7: $scope.dataPasienSelected.tglregistrasi,
                        8: norec_apd, //NOREC ANTRIAN
                        9: $scope.dataPasienSelected.namaruangan,
                        10: $scope.dataPasienSelected.objectruanganlastfk,
                        11: $scope.dataPasienSelected.norec,
                        12: "", //nor
                        13: $scope.dataPasienSelected.kelompokpasien,
                        14: $scope.dataPasienSelected.pgid,
                        15: $scope.item.ruanganAntrian.id,
                        16: $scope.item.ruanganAntrian.objectdepartemenfk,
                        17: $scope.dataPasienSelected.rekanan,
                        18: $scope.dataPasienSelected.idjenispelayanan,
                        19: $scope.dataPasienSelected.jenispelayanan
                    }
                    cacheHelper.set('RincianPelayananAmbulanCtrl', arrStr);
                    // $state.go('RincianPelayananAmbulan')
                    RincianTagihan();
                }, function(error) {
                    $scope.tombolSimpanVis = true;
                })
            }

            function RincianTagihan() {
                var obj = {
                    noRegistrasi: $scope.dataPasienSelected.noregistrasi
                }
                var statusOtomatis = "YA"
                cacheHelper.set('statusOtomatis', statusOtomatis);
                $state.go('RincianTagihan', {
                    dataPasien: JSON.stringify(obj)
                });
            }
            $scope.registrasiJenazah = function() {
                debugger;
                cacheHelper.set('CacheRegistrasiPasien', undefined);
                cacheHelper.set('cacheStatusPasien', 'BARU');
                cacheHelper.set('isJenazah', true);
                $state.go('RegistrasiPelayananAmbulance', {
                    noCm: $scope.dataPasienSelected.nocm
                });
            }

            $scope.lihatRincian = function(norec_apd) {
                var idKelas = 0;
                var namaKelas = '';
                if ($scope.dataPasienSelected.objectkelasfk != 6) {
                    idKelas = 6;
                    namaKelas = "Non Kelas";
                } else {
                    idKelas = $scope.dataPasienSelected.objectkelasfk;
                    namaKelas = $scope.dataPasienSelected.namakelas;
                }
                debugger;

                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umur,
                    5: idKelas, //$scope.dataPasienSelected.objectkelasfk,
                    6: namaKelas, //$scope.dataPasienSelected.namakelas,
                    7: $scope.dataPasienSelected.tglregistrasi,
                    8: norec_apd, //NOREC ANTRIAN
                    9: $scope.dataPasienSelected.namaruangan,
                    10: $scope.dataPasienSelected.objectruanganlastfk,
                    11: $scope.dataPasienSelected.norec_pd,
                    12: "", //nor
                    13: $scope.dataPasienSelected.kelompokpasien,
                    14: $scope.dataPasienSelected.pgid,
                    15: $scope.item.ruanganAntrian.id,
                    16: $scope.item.ruanganAntrian.objectdepartemenfk,
                    17: $scope.dataPasienSelected.rekanan,
                    18: $scope.dataPasienSelected.idjenispelayanan,
                    19: $scope.dataPasienSelected.jenispelayanan
                }
                cacheHelper.set('RincianPelayananAmbulanCtrl', arrStr);
                // $state.go('RincianPelayananAmbulan')
                RincianTagihan();
            }

            $scope.BatalJk = function() {
                $scope.item.JenisKelamin = {};
                $scope.item.JenisKelamin = undefined;
                $scope.popUp.close();
            }

            $scope.UbahJk = function() {

                $scope.popUp.center().open();
            }

            // $scope.SimpanJk = function () {
            // 	if ($scope.item.JenisKelamin == undefined) {
            // 		window.messageContainer.error("Jenis Kelamin Tidak Boleh Kosong!");
            // 		return;
            // 	}

            // 	var objSave = {
            // 		norm: $scope.noRekamMedis,
            // 		jeniskelamin: $scope.item.JenisKelamin.id
            // 	}

            // 	manageTataRekening.postData('pelayanan/update-jeniskelamin-pasien', objSave).then(function (e) {
            // 		$scope.item.JenisKelamin = {};
            // 		$scope.item.JenisKelamin = undefined;
            // 		$scope.popUp.close();
            // 		loadData();
            // 	})
            // }
            /* END */
        }
    ]);
});