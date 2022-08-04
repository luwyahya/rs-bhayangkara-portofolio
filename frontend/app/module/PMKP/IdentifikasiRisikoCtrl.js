
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('IdentifikasiRisikoCtrl', ['$rootScope', '$scope', 'ModelItem', '$mdDialog', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $mdDialog, $state, dateHelper, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pegawai = ModelItem.getPegawai();
            var kpid = '';
            var noOrder = '';
            var norec = '';
            var norecHead = '';
            var data2 = [];
            var skor = [
                {
                    id: 1,
                    skor: 1
                },
                {
                    id: 2,
                    skor: 2
                },
                {
                    id: 3,
                    skor: 3
                },
                {
                    id: 4,
                    skor: 4
                },
                {
                    id: 5,
                    skor: 5
                }
            ]
            LoadCombo();
            LoadCache();

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "jenisrisiko",
                    "title": "Jenis Risiko",
                    "width": "200px",
                },
                {
                    "field": "keparahan",
                    "title": "Keparahan",
                    "width": "75px",
                },
                {
                    "field": "kemungkinan",
                    "title": "Kemungkinan",
                    "width": "75px",
                },
                {
                    "field": "skor",
                    "title": "Skor",
                    "width": "75px",
                },
                {
                    "field": "rangkingrisiko",
                    "title": "Rangking Risiko",
                    "width": "100px",
                },
                {
                    "field": "pengendalian",
                    "title": "Pengendalian",
                    "width": "140px",
                },
                {
                    "field": "rangkingaction",
                    "title": "Rangking For Action",
                    "width": "150px",
                }
            ];

            function LoadCache() {
                $scope.dataGrid = new kendo.data.DataSource({
                    data: []
                });
                var chacePeriode = cacheHelper.get('IdentifikasiRisikoCtrl');
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
                    cacheHelper.set('IdentifikasiRisikoCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            $scope.tambah = function () {

                if ($scope.item.KategoryRisiko == undefined) {
                    alert("Kategory Risiko Belum Diisi!!")
                    return;
                }

                if ($scope.item.JenisRisiko == undefined) {
                    alert("Jenis Risiko Belum Diisi!!")
                    return;
                }

                if ($scope.item.Keparahan == undefined) {
                    alert("Keparahan Belum Di isi!")
                    return;
                }

                if ($scope.item.Kemungkinan == undefined) {
                    alert("Kemungkinan Belum di isi!!")
                    return;
                }

                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }

                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.norec = norec
                            data.jenisrisiko = $scope.item.JenisRisiko
                            data.keparahan = $scope.item.Keparahan.skor
                            data.kemungkinan = $scope.item.Kemungkinan.skor
                            data.skor = $scope.item.Skor
                            data.rangkingrisiko = $scope.item.RangkingRisiko
                            data.pengendalian = $scope.item.Pengendalian
                            data.rangkingaction = $scope.item.Rangking != undefined ? $scope.item.Rangking : ''

                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            Kosongkan();
                        }
                    }
                } else {
                    data = {
                        no: nomor,
                        norec: norec,
                        jenisrisiko: $scope.item.JenisRisiko,
                        keparahan: $scope.item.Keparahan.skor,
                        kemungkinan: $scope.item.Kemungkinan.skor,
                        skor: $scope.item.Skor,
                        rangkingrisiko: $scope.item.RangkingRisiko != undefined ? $scope.item.RangkingRisiko : '',
                        pengendalian: $scope.item.Pengendalian != undefined ? $scope.item.Pengendalian : '',
                        rangkingaction: $scope.item.Rangking != undefined ? $scope.item.Rangking : ''
                    }
                    data2.push(data)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    Kosongkan();
                }
            }

            $scope.$watch('item.Keparahan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var kemungkinan = 0;
                    if ($scope.item.Kemungkinan == undefined) {
                        $scope.item.Skor = parseFloat($scope.item.Keparahan.skor) * parseFloat(kemungkinan)
                    } else {
                        $scope.item.Skor = parseFloat($scope.item.Keparahan.skor) * parseFloat($scope.item.Kemungkinan.skor)
                    }
                }
            });

            $scope.$watch('item.Kemungkinan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var kemungkinan = 0;
                    if ($scope.item.Keparahan == undefined) {
                        $scope.item.Skor = parseFloat($scope.item.Keparahan.skor) * parseFloat(kemungkinan)
                    } else {
                        $scope.item.Skor = parseFloat($scope.item.Keparahan.skor) * parseFloat($scope.item.Kemungkinan.skor)
                    }
                }
            });

            function Kosongkan() {
                $scope.item.JenisRisiko = undefined
                $scope.item.Keparahan = undefined;
                $scope.item.Kemungkinan = undefined;
                $scope.item.Skor = undefined;
                $scope.item.RangkingRisiko = undefined;
                $scope.item.Pengendalian = undefined;
                $scope.item.Rangking = undefined;
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected
                    $scope.item.no = $scope.dataSelected.no
                    $scope.item.JenisRisiko = $scope.dataSelected.jenisrisiko
                    $scope.item.Keparahan = { id: $scope.dataSelected.keparahan, skor: $scope.dataSelected.keparahan };
                    $scope.item.Kemungkinan = { id: $scope.dataSelected.kemungkinan, skor: $scope.dataSelected.kemungkinan };
                    $scope.item.Skor = $scope.dataSelected.skor;
                    $scope.item.RangkingRisiko = $scope.dataSelected.rangkingrisiko;
                    $scope.item.Pengendalian = $scope.dataSelected.pengendalian;
                    $scope.item.Rangking = $scope.dataSelected.rangkingaction;
                }
            }

            $scope.hapus = function () {

                if ($scope.item.KategoryRisiko == undefined) {
                    alert("Kategory Risiko Belum Diisi!!")
                    return;
                }

                if ($scope.item.JenisRisiko == undefined) {
                    alert("Jenis Risiko Belum Diisi!!")
                    return;
                }

                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1
                            }
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                }
                Kosongkan()
            }

            $scope.batal = function () {
                $scope.item.JenisRisiko = undefined;
                $scope.item.Keparahan = undefined;
                $scope.item.Kemungkinan = undefined;
                $scope.item.Skor = undefined;
                $scope.item.RangkingRisiko = undefined;
                $scope.item.Pengendalian = undefined;
                $scope.item.Rangking = undefined;
            }

            function init() {
                if (noOrder != '') {
                    if (noOrder == 'EditRisk') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-identifikasi-risiko?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            var DataLoad = dat.data.data[0];
                            norec = DataLoad.norec;
                            $scope.UnitKerja = { objectdepartemenfk: DataLoad.departemenfk, departemen: DataLoad.departemen };
                            $scope.item.tanggal = new Date(DataLoad.tanggal);
                            $scope.item.KategoryRisiko = { id: DataLoad.kategoririsikofk, kategoryrisiko: DataLoad.kategoryrisiko };                        
                            $scope.item.KaInstalasi = { id: DataLoad.kainstalasifk, namalengkap: DataLoad.kainstalasi };
                            $scope.item.KplaBidang = { id: DataLoad.kepalabidangfk, namalengkap: DataLoad.kabidang };
                            $scope.item.Direktur = { id: DataLoad.direkturfk, namalengkap: DataLoad.direktur };
                            data2 = DataLoad.details
                            for (let i = 0; i < data2.length; i++) {
                                const element = data2[i];
                                element.no = i + 1;
                            }
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2,
                                // group: $scope.group,
                                pageSize: 100,
                                total: data2.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                    }
                                }
                            });
                        });
                    }
                }
            }

            function LoadCombo() {
                $scope.listKemungkinan = skor;
                $scope.listKeparahan = skor;
                $scope.item.tanggal = moment($scope.now).format('YYYY-MM-DD HH:mm');
                var dataDept = medifirstService.getMapLoginUserToRuangan();
                $scope.listDepartemen = dataDept;
                $scope.UnitKerja = { objectdepartemenfk: dataDept[0].objectdepartemenfk, departemen: dataDept[0].departemen }
                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                    $scope.listKategoryRisiko = e.data.kategoryrisiko;
                });
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                });
            }

            $scope.Save = function () {

                if ($scope.item.KategoryRisiko == undefined) {
                    toastr.error("Kategory Risiko Belum Di Isi")
                    return;
                }

                if ($scope.item.UnitKerja == undefined) {
                    toastr.error("Unit Kerja Belum Di Isi")
                    return;
                }

                if ($scope.item.tanggal == undefined) {
                    toastr.error("Tanggal Tidak Boleh Kosong")
                    return;
                }

                if (data2 == undefined) {
                    toastr.error("Data Tidak Boleh Kosong")
                    return;
                }

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
                var objSave = {
                    norec: norecHead,
                    kategoririsikofk: $scope.item.KategoryRisiko.id,
                    departemenfk: $scope.item.UnitKerja.objectdepartemenfk,
                    tanggal: moment($scope.item.tanggal).format('YYYY-MM-DD HH:mm'),
                    instalasi: $scope.item.KaInstalasi != undefined ? $scope.item.KaInstalasi.id : null,
                    kplabidang: $scope.item.KplaBidang != undefined ? $scope.item.KplaBidang.id : null,
                    direktur: $scope.item.Direktur != undefined ? $scope.item.Direktur.id : null,
                    details: data2,
                }

                medifirstService.post('pmkp/save-data-identifikasi-risiko', objSave).then(function (e) {
                    Kosong();
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: []
                    });
                });
            }
            //** BATAS SUCI */
        }
    ]);
});