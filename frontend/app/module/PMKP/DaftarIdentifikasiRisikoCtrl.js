define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarIdentifikasiRisikoCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.tglMeninggal = '';
            var norecHead = '';
            var norecTran = '';
            var norecInsiden = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            loadCombo();
            loadFirst();
            loadData();

            function loadCombo() {
                var dataDept = medifirstService.getMapLoginUserToRuangan();
                $scope.listDepartemen = dataDept;
            }

            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarIdentifikasiRisikoCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');
                var idDept = ''
                if ($scope.item.UnitKerja != undefined) {
                    idDept = "idDept=" + $scope.item.UnitKerja.id
                }
                medifirstService.get("pmkp/get-data-identifikasi-risiko?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    idDept).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i + 1
                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: doto,
                            group: $scope.group,
                            pageSize: 50,
                            total: doto.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        // jumlah: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                // { field: 'jumlah', aggregate: 'sum' },
                            ]
                        })
                    });
            };

            $scope.SearchData = function () {
                loadData();
            }

            $scope.group = {
                field: "kategoryrisiko",
                aggregates: [
                    {
                        field: "kategoryrisiko",
                        aggregate: "count"
                    }, {
                        field: "kategoryrisiko",
                        aggregate: "count"
                    }
                ]
            };
            $scope.aggregate = [
                {
                    field: "kategoryrisiko",
                    aggregate: "count"
                }, {
                    field: "kategoryrisiko",
                    aggregate: "count"
                }
            ]
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarIdentifikasiRisiko.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Laporan Identifikasi Risiko",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "60px",
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
                    },
                    {
                        "field": "kategoryrisiko",
                        "title": "Kategory Risiko",
                        "width": "220px",
                    }
                ]
            };

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "jenisrisiko",
                            "title": "Jenis Risiko",
                            "width": "100px",
                        },
                        {
                            "field": "keparahan",
                            "title": "Keparahan",
                            "width": "100px",
                        },
                        {
                            "field": "kemungkinan",
                            "title": "Kemungkinan",
                            "width": "100px",
                        },
                        {
                            "field": "skor",
                            "title": "Skor",
                            "width": "100px",
                        },
                        {
                            "field": "rangkingrisiko",
                            "title": "Rangking Risiko",
                            "width": "100px"
                        },
                        {
                            "field": "pengendalian",
                            "title": "Pengendalian",
                            "width": "100px"
                        },
                        {
                            "field": "rangkingaction",
                            "title": "Rangking Of Action",
                            "width": "100px",
                        }
                    ]
                }
            };

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            $scope.klikDetail = function (dataSelected2){
                if (dataSelected2 != undefined) {
                    $scope.dataSelected2 = dataSelected2;
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.editData = function () {
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'EditRisk',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('IdentifikasiRisikoCtrl', chacePeriode);
                $state.go('IdentifikasiRisiko', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'EditRisk'
                });
            }

            $scope.hapusData = function () {
                if ($scope.dataPasienSelected.lk_norec != undefined) {
                    messageContainer.error("Insiden Telah Ditindaklanjuti Tidak Bisa Dihapus!")
                    return
                }

                if ($scope.dataPasienSelected != undefined) {
                    var item = {
                        norec: $scope.dataPasienSelected.norec
                    }

                    medifirstService.post('pmkp/hapus-data-identifikasi-risiko', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.Lanjut = function () {
                if ($scope.dataSelected2 == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataSelected2.norec,
                    1: 'TindakLanjut',
                    2: $scope.dataSelected2.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('RiskRegisterCtrl', chacePeriode);
                $state.go('RiskRegister', {
                    kpid: $scope.dataSelected2.norec,
                    noOrder: 'TindakLanjut'
                });
            }

            $scope.tambahData = function () {
                $state.go('IdentifikasiRisiko', {});
            }
            //** BATAS SUCI */                    
        }
    ]);
});