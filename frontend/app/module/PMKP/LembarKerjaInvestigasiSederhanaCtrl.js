
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LembarKerjaInvestigasiSederhanaCtrl', ['$rootScope', '$scope', 'ModelItem', '$mdDialog', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $mdDialog, $state, dateHelper, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pegawai = ModelItem.getPegawai();
            var idKeluhan = '';
            var kpid = '';
            var noOrder = '';
            var norec = '';
            var norecInsiden = '';
            LoadCombo()
            LoadCache()

            function LoadCache() {
                var chacePeriode = cacheHelper.get('LembarKerjaInvestigasiSederhanaCtrl');
                if (chacePeriode != undefined) {
                    kpid = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    norecInsiden = chacePeriode[2]
                    init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('LembarKerjaInvestigasiSederhanaCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            function init() {
                if (noOrder != '') {
                	if (noOrder == 'EditLembar') {
                			$scope.isRouteLoading=true;
                	   		medifirstService.get("pmkp/get-form-lembar-kerja-investigasi?"+"laporaninsidenfk="+kpid, true).then(function(dat){
                            $scope.isRouteLoading=false;                            
                            var datas = dat.data[0];
                            $scope.item.PenyebabInsiden = datas.penyebabinsidenlangsung
                            $scope.item.Melatarbelangkangi = datas.latarbelakanginsiden
                            $scope.item.RekomendasiSatu = datas.rekomendasi
                            $scope.item.Pegawai = {id:datas.penanggungjawabfk, namalengkap:datas.penanggungjawab}
                            $scope.item.TanggalSatu = new Date(datas.tanggalrekomendasi)
                            $scope.item.RekomendasiDua = datas.tindakan
                            $scope.item.PegawaiDua = {id:datas.pegawaifk, namalengkap:datas.pegawai}
                            $scope.item.TanggalDua = new Date(datas.tanggaltindakan)
                            $scope.item.Nama = {id:datas.namakepalafk, namalengkap:datas.namakepalaa}
                            $scope.item.TanggalMulai = new Date(datas.tanggalmulai)
                            $scope.item.TanggalSelesai = new Date(datas.tanggalakhir)
                            $scope.item.Investigasi = datas.investigasilengkap
                            $scope.item.InvestigasiLanjut = datas.investigasilanjutan
                            $scope.item.Regrading = {regrading:datas.regrading}
                            norecInsiden = kpid
                            norec = datas.noreclki                            
                        });
                	} else if (noOrder == 'VerifLembar') {
                            $scope.isRouteLoading=true;
                            medifirstService.get("pmkp/get-data-investigasi-sederhana?"+"Norec="+kpid, true).then(function(dat){
                            $scope.isRouteLoading=false;                            
                            var datas = dat.data.data[0];
                            $scope.item.PenyebabInsiden = datas.penyebabinsidenlangsung
                            $scope.item.Melatarbelangkangi = datas.latarbelakanginsiden
                            $scope.item.RekomendasiSatu = datas.rekomendasi
                            $scope.item.Pegawai = {id:datas.penanggungjawabfk, namalengkap:datas.penanggungjawab}
                            $scope.item.TanggalSatu = new Date(datas.tanggalrekomendasi)
                            $scope.item.RekomendasiDua = datas.tindakan
                            $scope.item.PegawaiDua = {id:datas.pegawaifk, namalengkap:datas.pegawai}
                            $scope.item.TanggalDua = new Date(datas.tanggaltindakan)
                            $scope.item.Nama = datas.namakepala
                            $scope.item.TanggalMulai = new Date(datas.tanggalmulai)
                            $scope.item.TanggalSelesai = new Date(datas.tanggalakhir)
                            $scope.item.Investigasi = datas.investigasilengkap
                            $scope.item.InvestigasiLanjut = datas.investigasilanjutan
                            $scope.item.Regrading = datas.regrading
                            norec = kpid                            
                        });
                    }
                    else if (noOrder == 'TindakLanjut') {
                        $scope.Insidenfk =  kpid
                    }
                }        
            }

            function LoadCombo() {
                var nomor = 1;
                $scope.item.TanggalSatu = new Date();
                $scope.item.TanggalDua = new Date();
                $scope.item.TanggalMulai = new Date();
                $scope.item.TanggalSelesai = new Date();
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDataPegawai = data;
                    $scope.listNama = data;
                });

                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {                    
                    $scope.listKeselamatanInput = e.data.insidenkeselamtanpasien;
                    $scope.listDataRegrading = e.data.regrading;
                });
            }

            $scope.CariPasien = function () {
                $scope.isRouteLoading = true;
                // medifirstService.get("humas/get-data-detail-pasien?nocm="+$scope.item.noRm, true).then(function(data_ih){
                // 	$scope.isRouteLoading=false;
                // 	var datas = data_ih.data;
                //     var tanggal = $scope.now;
                //     var tanggalLahir = new Date(datas.tgllahir);
                //     var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                //     var usia = umurzz.year
                //     $scope.item.noRm = datas.nocm
                //     $scope.item.namaPasien = datas.namapasien
                //     $scope.item.jenisKelamin = {id:datas.jkid,jenisKelamin:datas.jeniskelamin}                    
                //     $scope.item.umur = usia
                //     $scope.item.noTlp = datas.notelepon
                //     $scope.item.alamatLengkap = datas.alamatlengkap
                //     $scope.item.email = datas.alamatemail
                //     $scope.item.pekerjaan = {id:datas.pekerjaanid,pekerjaan:datas.pekerjaan}
                // })
            }
            
            $scope.keluhan = function () {
                $state.go('DaftarKeluhanPelangganRev');
            }

            $scope.Save = function () {   
                // if ($scope.item.Regrading == undefined) {
                //     toastr.error('Peringatan, Regrading Tidak Boleh Kosong ! ')
                // }
                
                var confirm = $mdDialog.confirm()
                    .title('Peringatan!')
                    .textContent('Apakah anda yakin akan menyimpan data ini?')
                    .ariaLabel('Lucky day')
                    .ok('Ya')
                    .cancel('Tidak')

                    $mdDialog.show(confirm).then(function() {
                        $scope.Simpan();
                    })
            };


            $scope.reset = function () {
                kosong();
            }

            function Kosong() {
                $scope.item = {};
            }

            $scope.Simpan = function () {
                var insidenfk = null
                if ($scope.Insidenfk != undefined) {
                    insidenfk = $scope.Insidenfk
                }
                var listRawRequired = [
                    "item.PenyebabInsiden|ng-model|Penyebab Insiden",
                    "item.Melatarbelangkangi|ng-model|Penyebab Yang Melatarbelangkangi masalah insiden",
                    // "item.RekomendasiSatu|ng-model|Rekomendasi",
                    // "item.Pegawai|k-ng-model|Penanggung Jawab",
                    // "item.TanggalSatu|k-ng-model|Tanggal",
                    // "item.RekomendasiDua|ng-model|Tindakan yang akan dilakukan",
                    // "item.PegawaiDua|k-ng-model|Penanggung Jawab",
                    // "item.RekomendasiDua|ng-model|Tindakan yang akan dilakukan",
                    // "item.PegawaiDua|k-ng-model|Penanggung Jawab",
                    // "item.TanggalDua|k-ng-model|Tanggal",
                    // "item.Nama|ng-model|Nama Kepala Bagian",
                    "item.TanggalMulai|k-ng-model|Tanggal Mulai",
                    "item.TanggalSelesai|k-ng-model|Tanggal Selesai",
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var dataSave = {
                        "norec": norec != undefined ? norec : '',
                        "insidenfk": norecInsiden,
                        "penyebabinsidenlangsung": $scope.item.PenyebabInsiden != undefined ? $scope.item.PenyebabInsiden : '',
                        "latarbelakanginsiden": $scope.item.Melatarbelangkangi != undefined ? $scope.item.Melatarbelangkangi : '',
                        "rekomendasi": $scope.item.RekomendasiSatu != undefined ? $scope.item.RekomendasiSatu : '',
                        "penanggungjawabfk": $scope.item.Pegawai != undefined ? $scope.item.Pegawai.id : '',
                        "tanggalrekomendasi": $scope.item.TanggalSatu != undefined ? moment($scope.item.TanggalSatu).format('YYYY-MM-DD HH:mm') : null,
                        "tindakan": $scope.item.RekomendasiDua != undefined ? $scope.item.RekomendasiDua : '',
                        "pegawaifk": $scope.item.PegawaiDua != undefined ? $scope.item.PegawaiDua.id : '',
                        "namakepalafk": $scope.item.Nama != undefined ? $scope.item.Nama.id : '',
                        "tanggalmulai": $scope.item.TanggalMulai != undefined ? moment($scope.item.TanggalMulai).format('YYYY-MM-DD HH:mm') : null,
                        "tanggalakhir": $scope.item.TanggalSelesai != undefined ? moment($scope.item.TanggalSelesai).format('YYYY-MM-DD HH:mm') : null,
                        "tanggaltindakan": $scope.item.TanggalDua != undefined ? moment($scope.item.TanggalDua).format('YYYY-MM-DD HH:mm') : null,
                        "investigasilengkap": $scope.item.Investigasi != undefined ? $scope.item.Investigasi : '',
                        "investigasilanjutan": $scope.item.InvestigasiLanjut != undefined ? $scope.item.InvestigasiLanjut : '',
                        "regrading": $scope.item.Regrading != undefined ? $scope.item.Regrading.regrading : '',
                        "regradingfk": $scope.item.Regrading != undefined ? $scope.item.Regrading.id : '',
                    }
                    var objSave = {
                        data: dataSave,
                    }
                    medifirstService.post('pmkp/save-data-lembar-investigasi', objSave).then(function (e) {
                        Kosong();
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }

            //** BATAS SUCI */
        }
    ]);
});