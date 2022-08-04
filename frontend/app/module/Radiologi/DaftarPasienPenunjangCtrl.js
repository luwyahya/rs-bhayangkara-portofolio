define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarPasienPenunjangCtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper',
        function($scope, medifirstService, $state, cacheHelper, dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.item.jmlRow = 50

            loadCombo();
            LoadCache();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienPenunjang');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.namaPasien = chacePeriode[2];
                    $scope.item.noMr = chacePeriode[3];
                    $scope.item.noReg = chacePeriode[4];

                    init();
                } else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }

            function loadCombo() {
                $scope.listHasil = [
                    { "id": 0, "hasil": "Belum" },
                    { "id": 1, "hasil": "Sudah" },

                ]
                medifirstService.get("radiologi/get-combo", true).then(function(dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listDataJenisKelamin = dat.data.jeniskelamin;
                    $scope.listGolDarah = dat.data.golongandarah;
                });


            }
            $scope.DaftarRuangan = function() {
                // if ($scope.dataSelected.norec_br == "Pasien Batal") {
                // 	// window.messageContainer.error('Pasien Sudah Batal');
                // 	alert("Pasien Sudah Batal!!!")
                // 	return;
                // }

                if ($scope.dataSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataSelected.noregistrasi
                    }


                    cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataSelected.noregistrasi);
                    // cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
                    $state.go('DetailRegistrasi', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
            }

            function init() {
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokPasien.id
                }

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noregistrasi=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    var rm = "&nocm=" + $scope.item.noMr
                }
                var nm = ""
                if ($scope.item.namaPasien != undefined) {
                    var nm = "&namapasien=" + $scope.item.namaPasien
                }
                var jmlRow = ""
                if ($scope.item.jmlRow != undefined) {
                    jmlRow = "&jmlRow=" + $scope.item.jmlRow
                }
                var filter = ""
                if ($scope.item.filterradiologi != undefined) {
                    filter = "&filter=" + $scope.item.filterradiologi.id
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                medifirstService.get("radiologi/get-daftar-pasien-penunjang?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    reg +
                    rm +
                    nm +
                    ins + rg + kp + jmlRow + filter, true).then(function(dat) {
                    $scope.listRuangan = dat.data.ruanganlogin;
                    // $scope.item.ruangan = {id:  $scope.listRuangan[0].id,namaruangan:  $scope.listRuangan[0].namaruangan};
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                        var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                        dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
                    }
                    $scope.dataGrid = dat.data.data;

                    $scope.isRouteLoading = false;
                });




            }
            $scope.getRuangan = function() {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function() {

                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.item.namaPasien,
                    3: $scope.item.noMr,
                    4: $scope.item.noReg,
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPasienPenunjang', chacePeriode);
            }

            $scope.klikGrid = function(dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                    $scope.noRekamMedis = dataSelected.nocm;
                }
            }

            $scope.TransaksiPelayanan = function() {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pasien Belum di pilih', 'Peringatan!')
                    return;
                }
                // if($scope.dataSelected.ruid==575 && $scope.dataSelected.objectdepartemenfk==16 && $scope.dataSelected.tglpulang!=null){
                // 	toastr.error('Pasien Rawat Inap ini sudah Pulang', 'Peringatan!')
                // 	return;
                // }
                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.klid,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec,
                    9: $scope.dataSelected.namaruangan,
                    10: $scope.dataSelected.ruid,
                    11: $scope.dataSelected.norec_pd,
                    12: "", //nor
                    13: $scope.dataSelected.kelompokpasien,
                    16: $scope.dataSelected.objectdepartemenfk,
                    18: $scope.dataSelected.nostruklastfk,
                    19: $scope.dataSelected.golongandarah,
                    20: $scope.dataSelected.tglpulang,
                    21: $scope.dataSelected.idruanganasal,
                    22: $scope.dataSelected.namaruanganasal
                }
                cacheHelper.set('RincianTagihanPenunjang', arrStr);
                $state.go('RincianTagihanPenunjang')
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },

                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "80px",
                },
                {
                    "field": "nocm",
                    "title": "No MR",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "130px",
                },
                {
                    "field": "namaruanganasal",
                    "title": "Nama Ruangan Asal",
                    "width": "130px",
                },
                {
                    "field": "nama",
                    "title": "Dokter",
                    "width": "130px",
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "70px",
                },
                {
                    "field": "golongandarah",
                    "title": "Gol Darah",
                    "width": "50px",
                },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "100px"
                },
                // {
                //     "field": "tgllahir",
                //     "title": "Tgl Lahir",
                //     "width" : "100px"
                // },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width": "100px",
                },
                {
                    "field": "namarekanan",
                    "title": "namarekanan",
                    "width": "100px", //
                },
                {
                    "field": "namakelas",
                    "title": "Nama Kelas",
                    "width": "80px",
                },
                {
                    "field": "tglmasuk",
                    "title": "Tgl Masuk",
                    "width": "100px",
                },
                // {
                //     "field": "tglpulang",
                //     "title": "Tgl Pulang",
                //     "width" : "100px",
                // }
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px",
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "100px",
                },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "100px",
                }
            ];
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {

                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn ' // + bln + ' bln'
            }

            $scope.Rincian = function() {

            }

            $scope.UbahJk = function() {

                $scope.popUp.center().open();
            }

            $scope.BatalJk = function() {
                $scope.dataItem.JenisKelamin = {}
                $scope.item.JenisKelamin = undefined
                $scope.popUp.close();
            }

            // $scope.BatalJk = function(){
            //     $scope.dataItem.JenisKelamin = {}
            //     $scope.popUp.close();
            // }

            $scope.SimpanJk = function() {
                if ($scope.item.JenisKelamin == undefined) {
                    window.messageContainer.error("Jenis Kelamin Tidak Boleh Kosong!");
                    return;
                }

                var objSave = {
                    norm: $scope.noRekamMedis,
                    jeniskelamin: $scope.item.JenisKelamin.id
                }

                medifirstService.post('radiologi/update-jenis-kelamin', objSave).then(function(e) {
                    $scope.item.JenisKelamin = {}
                    $scope.item.JenisKelamin = undefined
                    $scope.popUp.close();
                    init();
                }, function(error) {
                    $scope.saveShow = true;
                });
            }
            $scope.UbahGolDar = function() {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.popUpGolDarah.center().open();
            }

            $scope.BatalGol = function() {

                $scope.item.golonganDarah = undefined
                $scope.popUpGolDarah.close();
            }

            $scope.SimpanGol = function() {
                if ($scope.item.golonganDarah == undefined) {
                    window.messageContainer.error("Golongan Darah Tidak Boleh Kosong!");
                    return;
                }

                var objSave = {
                    norm: $scope.noRekamMedis,
                    golongandarahfk: $scope.item.golonganDarah.id
                }

                medifirstService.post('radiologi/update-gol-darah', objSave).then(function(e) {

                    $scope.item.golonganDarah = undefined
                    $scope.popUpGolDarah.close();
                    init();
                }, function(error) {

                });
            }
            $scope.pengkajianMedis = function() {
                    if ($scope.dataSelected == undefined) {
                        window.messageContainer.error("Pilih Dahulu Pasien!")
                        return
                    }
                    // debugger;
                    var arrStr = {
                        0: $scope.dataSelected.nocm,
                        1: $scope.dataSelected.namapasien,
                        2: $scope.dataSelected.jeniskelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.dataSelected.umur,
                        5: $scope.dataSelected.kelompokpasien,
                        6: $scope.dataSelected.tglregistrasi,
                        7: $scope.dataSelected.norec_apd,
                        8: $scope.dataSelected.norec_pd,
                        9: $scope.dataSelected.klid,
                        10: $scope.dataSelected.namakelas,
                        11: $scope.dataSelected.ruid,
                        12: $scope.dataSelected.namaruangan + '`'
                    }
                    cacheHelper.set('cacheRMelektronik', arrStr);
                    $state.go('RekamMedis', {
                        norecAPD: $scope.dataSelected.norec_apd,
                        noRec: $scope.dataSelected.norec_apd
                    })
                }
                //***********************************

        }
    ]);
});