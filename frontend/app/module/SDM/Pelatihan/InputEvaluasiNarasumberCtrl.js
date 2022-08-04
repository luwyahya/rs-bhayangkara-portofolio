define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InputEvaluasiNarasumberCtrl', ['$scope', 'CacheHelper', 'MedifirstService',
        function ($scope, cacheHelper, medifirstService) {
            $scope.now = new Date();
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.titlePengkajian = "Detail Penilaian Evaluasi Narasumber";
            var NorecEvaluasiNarasumber = "";
            var NorecPlanning = "";
            var noOrder = "";
            $scope.arrParameter = [];
            $scope.currentPenguasaanMateri = [];
            $scope.currentKetetapanWaktu = [];
            $scope.currentSistematikaPenyajian = [];
            $scope.currentMetode = [];
            $scope.currentEmpati = [];
            $scope.currentBahasa = [];
            $scope.currentMotivasi = [];
            $scope.currentIsiMateri = [];
            $scope.currentPenyajianMateri = [];
            $scope.currentDiterapkan = [];
            $scope.currentTanyaJawab = [];
            $scope.currentPembelajaran = [];
            $scope.currentFasilitator = [];
            $scope.currentKerjasama = [];
            var data1 = 0;
            var data2 = 0;
            var data3 = 0;
            var data4 = 0;
            var data5 = 0;
            var data6 = 0;
            var data7 = 0;
            var data8 = 0;
            var data9 = 0;
            var data10 = 0;
            var data11 = 0;
            var data12 = 0;
            var data13 = 0;
            var data14 = 0;
            var totalRekap = 0;
            loadDataCombo();
            LoadCache();

            function loadDataCombo() {
                $scope.item.TglEvaluasi = moment($scope.now).format('YYYY-MM-DD HH:mm')
                medifirstService.get("sdm/pelatihan/get-combo-pelatihan?", true).then(function (dat) {
                    $scope.ListJenisPelatihan = dat.data.jenispelatihan;
                    $scope.listNarasumber = dat.data.narasumber;
                });
                $scope.item.PenguasaanMateri = 0;
                $scope.item.KetepatanWaktu = 0;
                $scope.item.SistematikaPenyajian = 0;
                $scope.item.PenggunaanMetode = 0;
                $scope.item.Empati = 0;
                $scope.item.PenggunaanBahasa = 0;
                $scope.item.PemberianMotivasi = 0;
                $scope.item.IsiMateri = 0;
                $scope.item.PenyajianMateri = 0;
                $scope.item.Diterapkan = 0;
                $scope.item.Kesempatan = 0;
                $scope.item.Pembelajaran = 0;
                $scope.item.Fasilitator = 0;
                $scope.item.Kerjasama = 0;
                $scope.item.Rekapitulasi = 0;
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('InputEvaluasiNarasumberCtrl');
                if (chacePeriode != undefined) {

                    NorecEvaluasiNarasumber = chacePeriode[0]
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
                    cacheHelper.set('InputEvaluasiNarasumberCtrl', chacePeriode);
                } else {
                    init();
                }
            }

            function init() {
                if (noOrder != '') {
                    if (noOrder == 'EditEvaluasi') {
                        medifirstService.get("sdm/pelatihan/get-detail-evaluasi-narasumber-kompetensi?norecOrder=" + NorecEvaluasiNarasumber, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            var data_head = data_ih.data.head[0];
                            NorecEvaluasiNarasumber = data_head.norec;
                            $scope.item.TglEvaluasi = data_head.tglevaluasi;
                            $scope.item.NamaFasilitator = data_head.fasilitator;
                            $scope.item.Materi = data_head.materi;
                            $scope.item.MateriPelatihan = data_head.keteranganpelatihan;
                            $scope.item.FasilitatorPelatihan = data_head.manfaatfasilitator;
                            $scope.item.SaranPelatihan = data_head.saran;
                            $scope.item.ManfaatPelatihan = data_head.manfaatpelatihan;
                            $scope.item.Narasumber = { id: data_head.narasumberfk, namalengkap: data_head.narasumber }
                            $scope.item.PenguasaanMateri = data_head.penguasaanmateri;
                            $scope.item.KetepatanWaktu = data_head.ketepatanwaktu;
                            $scope.item.SistematikaPenyajian = data_head.sistematikapenyajian;
                            $scope.item.PenggunaanMetode = data_head.penggunaanmetodedanalatbantu;
                            $scope.item.Empati = data_head.empati;
                            $scope.item.PenggunaanBahasa = data_head.penggunaanbahasa;
                            $scope.item.PemberianMotivasi = data_head.pemberianmotivasi;
                            $scope.item.IsiMateri = data_head.isimateri;
                            $scope.item.PenyajianMateri = data_head.penyajianmateri;
                            $scope.item.Diterapkan = data_head.dapatditerapkanklinik;
                            $scope.item.Kesempatan = data_head.kesempatantanyajawab;
                            $scope.item.Pembelajaran = data_head.pencapaiantujuanpembelajaran;
                            $scope.item.Fasilitator = data_head.penampilanfasilitator;
                            $scope.item.Kerjasama = data_head.kerjasamaantartimpengajar;                            

                        });
                    } else if (noOrder == 'EvaluasiNarasumber') {
                        medifirstService.get("sdm/pelatihan/get-detail-pengajuan-pelatihan?norecOrder=" + NorecEvaluasiNarasumber, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            var data_head = data_ih.data.head[0];
                            NorecPlanning = data_head.norec;
                            NorecEvaluasiNarasumber = '';
                            $scope.item.Narasumber = { id: data_head.narasumberfk, namalengkap: data_head.narasumber }
                            $scope.item.NamaFasilitator = data_head.deskripsiplanning;
                            $scope.item.Materi = data_head.namaplanning;                            
                        });
                    }
                }

            };            

            $scope.$watch('item.PenguasaanMateri', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.KetepatanWaktu', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.SistematikaPenyajian', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.PenggunaanMetode', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.Empati', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.PenggunaanBahasa', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.PemberianMotivasi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.IsiMateri', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.PenyajianMateri', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.Diterapkan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.Kesempatan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.Pembelajaran', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap);
                }
            });

            $scope.$watch('item.Fasilitator', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    data1 = parseFloat($scope.item.PenguasaanMateri);
                    data2 = parseFloat($scope.item.KetepatanWaktu);
                    data3 = parseFloat($scope.item.SistematikaPenyajian);
                    data4 = parseFloat($scope.item.PenggunaanMetode);
                    data5 = parseFloat($scope.item.Empati);
                    data6 = parseFloat($scope.item.PenggunaanBahasa);
                    data7 = parseFloat($scope.item.PemberianMotivasi);
                    data8 = parseFloat($scope.item.IsiMateri);
                    data9 = parseFloat($scope.item.PenyajianMateri);
                    data10 = parseFloat($scope.item.Diterapkan);
                    data11 = parseFloat($scope.item.Kesempatan);
                    data12 = parseFloat($scope.item.Pembelajaran);
                    data13 = parseFloat($scope.item.Fasilitator);
                    data14 = parseFloat($scope.item.Kerjasama);
                    totalRekap = (data1 + data2 + data3 + data4 + data5 + data6 + data7 + data8 + data9 + data10 + data11 + data12 + data13 + data14) / 14;
                    $scope.item.Rekapitulasi = parseFloat(totalRekap).toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }
            });

            $scope.$watch('item.Rekapitulasi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.Rekapitulasi <= 55) {
                        $scope.item.KeteranganRekapitulasi = "Kurang"
                    } else if ($scope.item.Rekapitulasi <= 75) {
                        $scope.item.KeteranganRekapitulasi = "Sedang"
                    } else if ($scope.item.Rekapitulasi <= 86) {
                        $scope.item.KeteranganRekapitulasi = "Baik"
                    } else if ($scope.item.Rekapitulasi > 86) {
                        $scope.item.KeteranganRekapitulasi = "Sangat Baik"
                    }
                }
            });


            function ClearAll() {
                $scope.item = {};
                $scope.arrParameter = [];
                $scope.item.Rekapitulasi = 0;
                // $scope.currentPenguasaanMateri=[];
                // $scope.currentKetetapanWaktu=[];
                // $scope.currentSistematikaPenyajian=[];
                // $scope.currentMetode=[];
                // $scope.currentEmpati=[];
                // $scope.currentBahasa =[];
                // $scope.currentMotivasi =[];
                // $scope.currentIsiMateri=[];
                // $scope.currentPenyajianMateri=[];
                // $scope.currentDiterapkan=[];
                // $scope.currentTanyaJawab=[];
                // $scope.currentPembelajaran=[];
                // $scope.currentFasilitator=[];
                // $scope.currentKerjasama=[];
            };

            $scope.reset = function () {
                ClearAll();
            };

            $scope.Save = function () {               
                if ($scope.item.TglEvaluasi == undefined) {
                    alert("Tgl Evaluasi Tidak Boleh Kosong!")
                    return;
                };

                if ($scope.item.NamaFasilitator == undefined) {
                    alert("Nama Fasilitator Tidak Boleh Kosong!")
                    return;
                };                

                if ($scope.item.SaranPelatihan == undefined) {
                    alert("Saran Perbaikan Tidak Boleh Kosong!")
                    return;
                };

                if ($scope.item.Narasumber == undefined) {
                    alert("Narasumber Tidak Boleh Kosong!")
                    return;
                };
                
                var listRawRequired = [
                    "item.PenguasaanMateri|k-ng-model|Penguasaan Materi",
                    "item.KetepatanWaktu|k-ng-model|Ketepatan Waktu",
                    "item.SistematikaPenyajian|k-ng-model|Sistematika Penyajian",
                    "item.PenggunaanMetode|k-ng-model|Penggunaan Metode dan Alat Bantu",
                    "item.Empati|k-ng-model|Empati, Gaya dan Sikap Terhadap Peserta",
                    "item.PenggunaanBahasa|k-ng-model|Penggunaan Bahasa dan Volume Suara",
                    "item.PemberianMotivasi|k-ng-model|Pemberian Motivasi Belajar Kepada Peserta",
                    "item.IsiMateri|k-ng-model|Isi Materi",
                    "item.PenyajianMateri|k-ng-model|Penyajian Materi",
                    "item.Diterapkan|k-ng-model|Dapat Diterapkan Diklinik",
                    "item.Kesempatan|k-ng-model|Kesempatan Tanya Jawab",
                    "item.Pembelajaran|k-ng-model|Pencapaian Tujuan Pembelajaran",
                    "item.Fasilitator|k-ng-model|Penampilan Fasilitator",
                    "item.Kerjasama|k-ng-model|Kerjasama Antar Tim Pengajar (Jika Tim)"
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data =
                    {
                        "norec": NorecEvaluasiNarasumber,
                        "norecplanning": NorecPlanning,
                        "tglevaluasi": moment($scope.item.TglEvaluasi).format('YYYY-MM-DD HH:mm'),
                        "fasilitator": $scope.item.NamaFasilitator,
                        // "materi": $scope.item.Materi,
                        // "keteranganpelatihan": $scope.item.MateriPelatihan,
                        // "manfaatpelatihan": $scope.item.ManfaatPelatihan,
                        // "manfaatfasilitator": $scope.item.FasilitatorPelatihan,
                        "saran": $scope.item.SaranPelatihan,
                        "narasumberfk": $scope.item.Narasumber.id,
                        "totalnilai": $scope.item.Rekapitulasi,

                        // nu diPake
                        "penguasaanmateri": $scope.item.PenguasaanMateri,
                        "ketepatanwaktu": $scope.item.KetepatanWaktu,
                        "sistematikapenyajian": $scope.item.SistematikaPenyajian,
                        "penggunaanmetodedanalatbantu": $scope.item.PenggunaanMetode,
                        "empati": $scope.item.Empati,
                        "penggunaanbahasa": $scope.item.PenggunaanBahasa,
                        "pemberianmotivasi": $scope.item.PemberianMotivasi,
                        "isimateri": $scope.item.IsiMateri,
                        "penyajianmateri": $scope.item.PenyajianMateri,
                        "dapatditerapkanklinik": $scope.item.Diterapkan,
                        "kesempatantanyajawab": $scope.item.Kesempatan,
                        "pencapaiantujuanpembelajaran": $scope.item.Pembelajaran,
                        "penampilanfasilitator": $scope.item.Fasilitator,
                        "kerjasamaantartimpengajar": $scope.item.Kerjasama
                        // End nu diPake

                        // Old
                        // "penguasaanmateri":listPenguasaanMateri,
                        // "ketepatanwaktu":listKetetapanWaktu,
                        // "sistematikapenyajian":listSistematikaPenyajian,
                        // "penggunaanmetodedanalatbantu":listMetode,
                        // "empati":listEmpati,
                        // "penggunaanbahasa":listBahasa,
                        // "pemberianmotivasi":listBahasa,
                        // "isimateri":listIsiMateri,
                        // "penyajianmateri":listPenyajianMateri,
                        // "dapatditerapkanklinik":listDiterapkan,
                        // "kesempatantanyajawab":listTanyaJawab,
                        // "pencapaiantujuanpembelajaran":listPembelajaran,
                        // "penampilanfasilitator":listFasilitator,
                        // "kerjasamaantartimpengajar":listKerjasama
                        // End Old
                    };

                    var objSave = {
                        data: data,
                    }

                    medifirstService.post('sdm/pelatihan/save-evaluasi-narasumber',objSave).then(function (e) {
                        ClearAll();
                    });

                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            };
            //** BATAS SUCI */
        }
    ]);
});