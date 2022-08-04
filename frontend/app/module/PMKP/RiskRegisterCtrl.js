
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RiskRegisterCtrl', ['$rootScope', '$scope', 'ModelItem', '$mdDialog', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $mdDialog, $state, dateHelper, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pegawai = ModelItem.getPegawai();
            var idKeluhan = '';
            var kpid = '';
            var noOrder = '';
            var norec = '';
            var norecHead = '';
            var norecTran = '';            
            LoadCombo();
            LoadCache();
           
            function LoadCache() {
                var chacePeriode = cacheHelper.get('RiskRegisterCtrl');
                if (chacePeriode != undefined) {
                    kpid = chacePeriode[0]
                    noOrder = chacePeriode[1]
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
                    cacheHelper.set('RiskRegisterCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            function init() {
                if (noOrder != '') {
                    if (noOrder == 'EditRisk') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-risk-register?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            norec = kpid
                            // norecHead
                            // norecTran
                            var dataLoad = dat.data.data[0];                            
                            norecTran = dataLoad.identifikasiresikodetailfk;
                            norecHead = dataLoad.identifikasiresikofk;
                            $scope.item.ObyekPenilaianRisiko = dataLoad.jenisrisiko;
                            $scope.item.Tujuan = dataLoad.tujuan;
                            $scope.item.Lokasi = dataLoad.lokasi;
                            $scope.item.PemilikRisiko = dataLoad.pemilikrisiko;
                            $scope.item.PegawaiPenilai = { id:dataLoad.penilaifk , namalengkap:dataLoad.penilai };
                            $scope.item.PegawaiEvaluasi = { id:dataLoad.pengevaluasifk , namalengkap:dataLoad.pengevaluasi };
                            $scope.item.PegawaiPenyetujui = { id:dataLoad.pengevaluasifk , namalengkap:dataLoad.pengevaluasi };
                            $scope.item.tglPenilai = moment(dataLoad.tglpenilaian).format('YYYY-MM-DD HH:mm');
                            $scope.item.tglEvaluasi = moment(dataLoad.tglsetujui).format('YYYY-MM-DD HH:mm');
                            $scope.item.tglPenyetujui = moment(dataLoad.tglsetujui).format('YYYY-MM-DD HH:mm');
                            $scope.item.DeskRisiko = dataLoad.deskripsirisiko;
                            $scope.item.DampakRisiko = dataLoad.dampak;
                            $scope.item.PenyRisiko = dataLoad.penyebab;
                            $scope.item.Upaya = dataLoad.upayakontrol;
                            $scope.item.Efektifitas = dataLoad.efektifitas;
                            $scope.item.Dampak = dataLoad.dampakrisiko;
                            $scope.item.Kemungkinan = dataLoad.kemungkinan
                            $scope.item.Level = dataLoad.level;       
                            $scope.item.RencanaKegiatan = dataLoad.rencanakegiatan;
                            $scope.item.PgwJawab = {id:dataLoad.penanggungjwabfk , namalengkap:dataLoad.penanggungjawab}                            
                            $scope.item.Jadwal = dataLoad.jadwal;                            
                            $scope.item.Tanggal = moment(dataLoad.tanggal).format('YYYY-MM-DD HH:mm');
                            $scope.item.LapSingkat = dataLoad.laporansingkat
                            $scope.item.LevelAkhir = dataLoad.ketlevel

                            if (dataLoad.evaluasirisiko == "Avoid Risk") {
                               $scope.item.AvoidRisk = true
                            }else if (dataLoad.evaluasirisiko == "Accept Risk") {
                                $scope.item.AcceptRisk = true
                            }else if (dataLoad.evaluasirisiko == "Mitigate Risk") {
                                $scope.item.MitigateRisk = true
                            }else if (dataLoad.evaluasirisiko == "Transfer Risk") {
                                $scope.item.TransferRisk = true
                            }
                                                        
                            if (dataLoad.statusjaminan == "Insured") {
                                $scope.item.Insured = true
                            }else if (dataLoad.statusjaminan == "Insurable") {
                                $scope.item.Insurable = true
                            }
                        });
                    } if (noOrder == 'TindakLanjut') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-detail-identifikasi-risiko?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;                            
                            var dataLoad = dat.data[0];
                            norec = '';
                            norecHead = dataLoad.identifikasirisikofk
                            norecTran = dataLoad.norec                            
                            $scope.item.ObyekPenilaianRisiko = dataLoad.jenisrisiko;
                            $scope.item.tglPenilai = new Date($scope.now);
                            $scope.item.tglEvaluasi = new Date($scope.now);
                            $scope.item.tglPenyetujui = new Date($scope.now);
                            $scope.item.Tanggal = new Date($scope.now);
                            $scope.item.Lokasi = dataLoad.namadepartemen;
                            $scope.item.Dampak = dataLoad.keparahan;
                            $scope.item.Kemungkinan = dataLoad.kemungkinan
                        });
                    }
                }
            }

            function LoadCombo() {
                var nomor = 1;
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDataPegawai = data;
                });
            }

            $scope.Save = function () {
                var confirm = $mdDialog.confirm()
                    .title('Peringatan!')
                    .textContent('Apakah anda yakin akan menyimpan data ini?')
                    .ariaLabel('Lucky day')
                    .ok('Ya')
                    .cancel('Tidak')

                $mdDialog.show(confirm).then(function () {
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
                var evaluasiResiko = ''
                if ($scope.item.AvoidRisk == true) {
                    evaluasiResiko = "Avoid Risk"
                }else if ($scope.item.AcceptRisk == true) {
                    evaluasiResiko = "Accept Risk"
                }else if ($scope.item.MitigateRisk == true) {
                    evaluasiResiko = "Mitigate Risk"
                }else if ($scope.item.TransferRisk == true) {
                    evaluasiResiko = "Transfer Risk"
                }
                
                var statusjaminan = '';
                if ($scope.item.Insured == true) {
                    statusjaminan = "Insured"
                }else if ($scope.item.Insurable == true) {
                    statusjaminan = "Insurable"
                }
                
                // var listRawRequired = [
                //     "item.Tujuan|ng-model|Tujuan",
                //     "item.tglPenilai|k-ng-model|Tgl Penilaian",
                //     "item.PegawaiPenilai|k-ng-model|Penilai",
                //     "item.Lokasi|ng-model|Lokasi",
                //     "item.tglEvaluasi|k-ng-model|Tgl Evalusi",
                //     "item.PegawaiEvaluasi|k-ng-model|Pegawai Pengevaluasi",
                //     "item.PemilikRisiko|ng-model|Pemilik Risiko",                   
                //     "item.tglPenyetujui|k-ng-model|Tgl Disetujui",
                //     "item.PegawaiPenyetujui|k-ng-model|Pegawai Penyetujui",
                //     "item.DeskRisiko|ng-model|Deskripsi Resiko",
                //     "item.DampakRisiko|ng-model|Dampak Resiko",
                //     "item.PenyRisiko|ng-model|Penyebab",
                //     "item.Upaya|ng-model|Upaya Kontrol Yang Saat Ini Dilakukan",
                //     "item.Efektifitas|ng-model|Efektifitas",
                //     "item.RencanaKegiatan|ng-model|Rencana Kegiatan",
                //     "item.PgwJawab|k-ng-model|Penanggung Jawab",
                //     "item.Tanggal|k-ng-model|Tanngal",
                //     "item.Jadwal|ng-model|Jadwal",
                //     "item.LapSingkat|ng-model|Lap Singkat",
                //     "item.LevelAkhir|ng-model|Levell Akhir",
                // ]
                
                // var isValid = medifirstService.setValidation($scope, listRawRequired);
                // if (isValid.status) {
                    var dataSave = {
                        "norec" : norec,
                        "identifikasiresikofk"  : norecHead,
                        "identifikasiresikodetailfk" : norecTran,
                        "tujuan" : $scope.item.Tujuan != undefined ? $scope.item.Tujuan : '',
                        "lokasi" : $scope.item.Lokasi != undefined ? $scope.item.Lokasi : '',
                        "pemilikrisiko" : $scope.item.PemilikRisiko != undefined ? $scope.item.PemilikRisiko : '',
                        "penilaifk" : $scope.item.PegawaiPenilai != undefined ? $scope.item.PegawaiPenilai.id : null,
                        "pengevaluasifk" : $scope.item.PegawaiEvaluasi != undefined ? $scope.item.PegawaiEvaluasi.id : null,
                        "penyetujuifk" : $scope.item.PegawaiPenyetujui != undefined ? $scope.item.PegawaiPenyetujui.id : null,
                        "tglpenilaian" : $scope.item.tglPenilai != undefined ? moment($scope.item.tglPenilai).format('YYYY-MM-DD HH:mm') : null,
                        "tglevaluasi" : $scope.item.tglEvaluasi != undefined ? moment($scope.item.tglEvaluasi).format('YYYY-MM-DD HH:mm') : null,
                        "tglsetujui" : $scope.item.tglPenyetujui != undefined ? moment($scope.item.tglPenyetujui).format('YYYY-MM-DD HH:mm') : null,
                        "deskripsirisiko" : $scope.item.DeskRisiko != undefined ? $scope.item.DeskRisiko : '',
                        "dampak" : $scope.item.DampakRisiko != undefined ? $scope.item.DampakRisiko : '',
                        "penyebab" : $scope.item.PenyRisiko != undefined ? $scope.item.PenyRisiko : '',
                        "upayakontrol" : $scope.item.Upaya != undefined ? $scope.item.Upaya : '',
                        "efektifitas" : $scope.item.Efektifitas != undefined ? $scope.item.Efektifitas : '',
                        "dampakrisiko" : $scope.item.Dampak != undefined ? $scope.item.Dampak : '',
                        "kemungkinan" : $scope.item.Kemungkinan != undefined ? $scope.item.Kemungkinan : '',
                        "level" : $scope.item.Level != undefined ? $scope.item.Level : '',
                        "evaluasirisiko" : evaluasiResiko, // $scope.item.Tujuan != undefined ? $scope.item.Tujuan :
                        "tujuansasaran" : '',//$scope.item.Tujuan != undefined ? $scope.item.Tujuan : '',
                        "rencanakegiatan" : $scope.item.RencanaKegiatan != undefined ? $scope.item.RencanaKegiatan : '',
                        "penanggungjwabfk" : $scope.item.PgwJawab != undefined ? $scope.item.PgwJawab.id : null,
                        "jadwal" : $scope.item.Jadwal != undefined ? $scope.item.Jadwal : '', 
                        "statusjaminan" : statusjaminan,//$scope.item.Tujuan != undefined ? $scope.item.Tujuan : '',
                        "tanggal" : $scope.item.Tanggal != undefined ? moment($scope.item.Tanggal).format('YYYY-MM-DD HH:mm') : null,
                        "laporansingkat" : $scope.item.LapSingkat != undefined ? $scope.item.LapSingkat : '',
                        "ketlevel" : $scope.item.LevelAkhir != undefined ? $scope.item.LevelAkhir : ''
                    }
                    var objSave = {
                        data: dataSave,
                    }
                    medifirstService.post('pmkp/save-data-risk-register', objSave).then(function (e) {
                        Kosong();
                    });
                // } else {
                //     medifirstService.showMessages(isValid.messages);
                // }
            }
            //** BATAS SUCI */
        }
    ]);
});