
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('SensusHarianInsidenKeselamatanPasienCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout) {
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var datana = [];
            var data_head = [];
            var dataARR = [];
            var norecSasaran = '';
            var dataTea = [];
            var dataGrid = [];
            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            FormLoad();

            function FormLoad() {
                dataGrid = [];
                $scope.item.bulan = $scope.now;
                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                    dataGrid = e.data.insidenkeselamtanpasien;
                    for (let i = 0; i < dataGrid.length; i++) {
                        dataGrid[i].no = i + 1;
                    }

                    // $scope.mainGridOption = {

                    $("#gridOrder").kendoGrid({
                        dataSource: {
                            data: dataGrid,
                            // aggregate: [
                            //     { field: "totalTindakan", aggregate: "sum" },
                            //     { field: "pointQty", aggregate: "sum" }
                            // ]
                        },
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "sensusharianinsidenkeselamatanapasien.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        editable: false,
                        scrollable: true,
                        selectable: "row",
                        // sortable: true,
                        columns: [
                            // {
                            //     "field": "no",
                            //     "title": "<h3 align=center>NO<h3>",
                            //     "width": "50px",
                            //     "filterable": false,
                            //     attributes: {
                            //         "class": "table-cell",
                            //         style: "text-align: left;"
                            //     }
                            // },
                            {
                                "field": "keselamatan",
                                "title": "<h3 align=center>Insiden Keselamatan Pasien<h3>",
                                "width": "600px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            },
                            {
                                "title": "<h3 align=center>Tanggal<h3>",
                                "columns": $scope.createColumn(),
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: center;"
                                }
                            },
                            {
                                "field": "total",
                                "title": "<h3 align=center>Total<h3>",
                                "width": "95px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            }
                        ]
                    })

                    $scope.dataSource = new kendo.data.DataSource({
                        data: dataGrid,
                        total: dataGrid.length,
                        group: { field: "jeniskeselamatan" },
                        schema: {
                            model: {
                            }
                        }
                    });
                    LoadCombo();
                })
            }

            $scope.$watch('item.bulan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.bulanSelected = moment(newValue).format("MMMM YYYY")
                    medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                        dataGrid = [];
                        dataGrid = e.data.insidenkeselamtanpasien;
                        for (let i = 0; i < dataGrid.length; i++) {
                            dataGrid[i].no = i + 1;
                        }

                        $scope.dataSource = new kendo.data.DataSource({
                            data: [],
                        });                        
                        $scope.mainGridOption = {
                            // $("#gridOrder").kendoGrid({
                            dataSource: {
                                data: dataGrid,

                            },
                            toolbar: [
                                "excel",
                            ],
                            excel: {
                                fileName: "sensusharianinsidenkeselamatanapasien.xlsx",
                                allPages: true,
                            },
                            excelExport: function (e) { },
                            editable: false,
                            scrollable: true,
                            selectable: "row",
                            // sortable: true,
                            columns: [
                                // {
                                //     "field": "no",
                                //     "title": "<h3 align=center>NO<h3>",
                                //     "width": "50px",
                                //     "filterable": false,
                                //     attributes: {
                                //         "class": "table-cell",
                                //         style: "text-align: left;"
                                //     }
                                // },
                                {
                                    "field": "keselamatan",
                                    "title": "<h3 align=center>Insiden Keselamatan Pasien<h3>",
                                    "width": "600px",
                                    "filterable": false,
                                    attributes: {
                                        "class": "table-cell",
                                        style: "text-align: left;"
                                    }
                                },
                                {
                                    "title": "<h3 align=center>Tanggal<h3>",
                                    "columns": $scope.createColumn(),
                                    "filterable": false,
                                    attributes: {
                                        "class": "table-cell",
                                        style: "text-align: center;"
                                    }
                                },
                                {
                                    "field": "total",
                                    "title": "<h3 align=center>Total<h3>",
                                    "width": "95px",
                                    "filterable": false,
                                    attributes: {
                                        "class": "table-cell",
                                        style: "text-align: left;"
                                    }
                                }
                            ]
                        }
                        // )
                        var timeEditGrid = $("#gridOrder").kendoGrid($scope.mainGridOption).data("kendoGrid");
                        $scope.dataSource = new kendo.data.DataSource({
                            data: dataGrid,
                            total: dataGrid.length,
                            group: { field: "jeniskeselamatan" },
                            schema: {
                                model: {
                                }
                            }
                        });
                    })
                }
            })

            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return $scope.bulanString;
            }

            function LoadCombo() {
                var dataDept = medifirstService.getMapLoginUserToRuangan();
                $scope.listDepartemen = dataDept;
            }

            $scope.formatTanggal = function (tanggal) {
                if (tanggal != "null")
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                else
                    return '-'
            }

            $scope.createColumn = function () {
                var list = [];
                var year = parseInt(moment($scope.item.bulan).format("Y"))
                var month = parseInt(moment($scope.item.bulan).format("M"))
                var tempDate = new Date(year, month, 0);
                for (var i = 0; i < tempDate.getDate(); i++) {
                    var data = {
                        field: "[" + (i + 1) + "]",
                        title: (i + 1).toString(),
                        format: "{0:n1}",
                        width: "50px"
                    };
                    list.push(data);
                }
                return list;
            }

            $scope.batal = function () {
                $scope.item.jumlahPengunjung = undefined;
            }

            function searchData() {
                var dataGrid = [];
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var idDept = ''
                if ($scope.item.Departemen != undefined) {
                    idDept = '&idDept=' + $scope.item.Departemen.objectdepartemenfk
                }
                $scope.isRouteLoading = true;
                var dataGrid = [];
                medifirstService.get('pmkp/get-data-insiden-keselamatan-pasien?bln=' + bln + idDept).then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.datasSearch = e.data.data
                    for (var i = $scope.datasSearch.length - 1; i >= 0; i--) {
                        $scope.datasSearch[i].no = i + 1                        
                        if ($scope.datasSearch[i].jumlah != 0) {
                            $scope.datasSearch[i].isian = $scope.datasSearch[i].jumlah
                        } else {
                            $scope.datasSearch[i].isian = 0
                        }
                    }

                    if (!$scope.datasSearch) {
                        return toastr.success('Data tidak ditemukan', 'Info');
                    };
                    
                    var Data = e.data.data;
                    var Datas = $scope.dataSource._data
                    $scope.datasSearch.forEach(function (element) {
                        var customData = {};
                        debugger;
                        for (var key in element) {
                            switch (key) {
                                case "tgl":                                    
                                    var tgl = element.tgl;
                                    var key = tgl.slice(-1);
                                    if (key[0] === "0") {
                                        customData[key] = element.isian;
                                    } else {
                                        customData[key] = element.isian;
                                    }                                    
                                    break;
                                default:
                                    customData[key] = element[key];
                                    break;
                            }
                        };
                        dataGrid.push(customData);
                    });
                                        
                    $scope.mainGridOption = {
                        // $("#gridOrder").kendoGrid({
                        dataSource: {
                            data: dataGrid,

                        },
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "sensusharianinsidenkeselamatanapasien.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        editable: false,
                        scrollable: true,
                        selectable: "row",
                        // sortable: true,
                        columns: [
                            // {
                            //     "field": "no",
                            //     "title": "<h3 align=center>NO<h3>",
                            //     "width": "50px",
                            //     "filterable": false,
                            //     attributes: {
                            //         "class": "table-cell",
                            //         style: "text-align: left;"
                            //     }
                            // },
                            {
                                "field": "keselamatan",
                                "title": "<h3 align=center>Insiden Keselamatan Pasien<h3>",
                                "width": "600px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            },
                            {
                                "field": "jumlah",
                                "title": "<h3 align=center>Tanggal<h3>",
                                "columns": $scope.createColumn(),
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: center;"
                                }
                            },
                            {
                                "field": "total",
                                "title": "<h3 align=center>Total<h3>",
                                "width": "600px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            },
                        ]
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: dataGrid,
                        group: { field: "jeniskeselamatan" },
                    });
                })
            }

            $scope.cari = function () {
                searchData();
            }

            $scope.generateTables = function () {
                $scope.columns = [
                    {
                        "field": "no",
                        "title": "<h3 align=center>No.<h3>",
                        "width": "48px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "jeniskegiatan",
                        "title": "<h3 align=center>Jenis Kegiatan<h3>",
                        "width": "410px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "isian",
                        "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                        "columns": $scope.createColumn(),
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                        // title: $scope.getBulan(),
                        // columns: $scope.createColumn(),
                    }
                ]
            }
            //** BATAS SUCI */
        }
    ]);

});