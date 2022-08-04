
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('SensusBulananInsidenKeselamatanPasienCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout',
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
            var dataBulan = [];
            var dataGrid = [];
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade",
                format: "yyyy",
            }
            FormLoad();

            function FormLoad() {
                $scope.item.tahun = $scope.now;
                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                    dataGrid = e.data.insidenkeselamtanpasien;
                    for (let i = 0; i < dataGrid.length; i++) {
                        dataGrid[i].no = i + 1;
                        dataGrid[i].January = '';
                        dataGrid[i].February = '';
                        dataGrid[i].March = '';
                        dataGrid[i].April = '';
                        dataGrid[i].May = '';
                        dataGrid[i].June = '';
                        dataGrid[i].July = '';
                        dataGrid[i].August = '';
                        dataGrid[i].September = '';
                        dataGrid[i].October = '';
                        dataGrid[i].November = '';
                        dataGrid[i].December = '';
                    }
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

            $scope.mainGridOption = {
                dataSource: {
                    data: dataGrid,
                    group: { field: "jeniskeselamatan" },
                },
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "laporansensusbulananinsidenkeselamatanpasien.xlsx",
                    allPages: true,
                },
                excelExport: function (e) { },
                editable: false,
                scrollable: true,
                selectable: "row",
                columns: [
                    {
                        "field": "no",
                        "title": "<h3 align=center>NO<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "keselamatan",
                        "title": "<h3 align=center><h3>",
                        "width": "410px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "January",
                        "title": "<h3 align=center>JAN<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "February",
                        "title": "<h3 align=center>FEB<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "March",
                        "title": "<h3 align=center>MAR<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "April",
                        "title": "<h3 align=center>APRIL<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "May",
                        "title": "<h3 align=center>MEI<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "June",
                        "title": "<h3 align=center>JUNI<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "July",
                        "title": "<h3 align=center>JULI<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "August",
                        "title": "<h3 align=center>AGS<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "September",
                        "title": "<h3 align=center>SEP<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "October",
                        "title": "<h3 align=center>OKT<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "November",
                        "title": "<h3 align=center>NOV<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "December",
                        "title": "<h3 align=center>DES<h3>",
                        "width": "50px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    }
                ]
            };

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

            $scope.generateTable = function () {
                $scope.column = [
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
                        "title": "<h3 align=center><h3>",
                        "width": "210px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                        "columns": $scope.createColumn(),
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    }
                ]
                $scope.mainGridOptionss = {
                    selectable: "cell",
                    dataBound: $scope.onDataBound,
                    // change: onChange,
                    columns: $scope.column
                }

                var grid = $("#gridBulan").data("kendoGrid");
                if (grid != undefined) {
                    grid.destroy();
                    // grid.setDataSource( $scope.sourceJadwalBulanan);
                    $("#gridBulan").empty().kendoGrid({
                        dataSource: $scope.sourceJadwalBulanan,
                        columns: $scope.column,
                        selectable: "cell",
                        dataBound: $scope.onDataBound,
                        // options: $scope.mainGridOptionss
                    });
                }
                for (let i = 0; i < datana[0].length; i++) {
                    const element = datana[0][i];
                    element.listTgl = []
                    element.detail = [];

                }
                dataARR = []
                dataARR = datana[0]
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: datana[0],
                });
            }

            $scope.bulanSelected = moment($scope.item.tahun).format("YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.tahun).format("YYYY")
                return "<center>" + $scope.bulanString + "</center>";
            }

            function getHeader() {
                var kolomTitle = "Capaian : " + DateHelper.getBulanFormatted(new Date($scope.item.bulan));
                return kolomTitle;
            }

            $scope.createColumn = function () {
                var year = parseInt(moment($scope.item.tahun).format("Y"))
                var month = parseInt(moment($scope.item.tahun).format("M"))
                var date = new Date($scope.item.tahun)
                var tempDate = date.getMonth();//new Date(year, month, 0);
                var list = [];
                debugger;
                for (var i = 0; i < tempDate.getMonth(); i++) {
                    var data = {
                        field: "[" + (i) + "]",
                        title: (i).toString(),
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
                var bln = moment($scope.item.tahun).format('YYYY')
                var idDept = ''
                if ($scope.item.Departemen != undefined) {
                    idDept = '&idDept=' + $scope.item.Departemen.objectdepartemenfk
                }
                $scope.isRouteLoading = true;
                var dataGrid = [];
                medifirstService.get('pmkp/get-data-insiden-keselamatan-pasien?bln=' + bln + idDept).then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.datasSearch = e.data
                    if (!$scope.datasSearch) {
                        return toastr.success('Data tidak ditemukan', 'Info');
                    };
                    var Data = e.data;
                    var Datas = $scope.dataSource._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            var str = Data[j].bulan.trim();
                            for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                var Tutu = Object.keys(Datas[i])[k]
                                if (str == Tutu) {
                                    var jumlah = 0
                                    if (parseFloat(Datas[i].id) == parseFloat(Data[j].keselamatanfk)) {
                                        Datas[i][Tutu] = parseFloat(jumlah) + parseFloat(Data[j].jumlah);
                                    }
                                    // else{
                                    //     Datas[i][Tutu] = jumlah
                                    // }
                                } else {
                                    if (Tutu == 'January') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'February') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'March') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'April') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'May') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'June') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'July') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'August') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'September') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'October') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'November') {
                                        Datas[i][Tutu] = 0
                                    } else if (Tutu == 'December') {
                                        Datas[i][Tutu] = 0
                                    }
                                }
                            }
                        }
                    }
                    dataChart1 = e.data.data
                    maxData = e.data.maxdata
                    $(document).ready(createChart);
                    $(document).bind("kendo:skinChange", createChart);
                    $scope.gridShow = false
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

            $scope.generateGridColumn = function () {
                // var year = $scope.item.tahun.getYear();
                // var month = $scope.item.tahun.getMonth();                
                var date = new Date($scope.item.tahun);
                var year = date.getFullYear();
                var month = date.getMonth();
                var dateInMonth = new Date(year, month + 1, 0);
                var listDay = [];
                var listMont = [
                    {
                        'id': '1', 'bulan': 'JAN'
                    },
                    {
                        'no': '2', 'bulan': 'FEB'
                    },
                    {
                        'no': '3', 'bulan': 'MAR'
                    },
                    {
                        'no': '4', 'bulan': 'APRIL'
                    },
                    {
                        'id': '5', 'bulan': 'MEI'
                    },
                    {
                        'no': '6', 'bulan': 'JUNI'
                    },
                    {
                        'no': '7', 'bulan': 'JULI'
                    },
                    {
                        'no': '8', 'bulan': 'AGS'
                    },
                    {
                        'no': '9', 'bulan': 'SEP'
                    },
                    {
                        'no': '10', 'bulan': 'OKT'
                    },
                    {
                        'no': '11', 'bulan': 'NOV'
                    },
                    {
                        'no': '12', 'bulan': 'DES'
                    }
                ];
                for (var i = 0; i < listMont.length; i++) {
                    var data = {
                        field: listMont[i].bulan,
                        title: (listMont[i].bulan).toString(),
                        width: "50px", attributes: { style: "text-align: right;" },
                        headerAttributes: { style: "text-align: center;  " }
                    };
                    listDay.push(data);
                }
                return listDay;
            }
            //** BATAS SUCI */
        }
    ]);

});