
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('RekapSensusHarianMutuCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout',
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
            var jenis = '';
            var norec = '';
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade",
                format: "yyyy",
            }
            FormLoad();

            function FormLoad() {
                $scope.item.tahun = $scope.now;
                datana = [
                    {
                        'no': '1', 'jeniskegiatan': 'TARGET', 'January': '', 'February': '', 'March': '', 'April': '', 'May': '', 'June': '', 'July': '', 'August': '', 'September': '', 'October': '', 'November': '', 'December': ''
                    },
                    {
                        'no': '2', 'jeniskegiatan': 'CAPAIAN', 'January': '', 'February': '', 'March': '', 'April': '', 'May': '', 'June': '', 'July': '', 'August': '', 'September': '', 'October': '', 'November': '', 'December': ''
                    },
                    {
                        'no': '3', 'jeniskegiatan': 'NUMERATOR', 'January': '', 'February': '', 'March': '', 'April': '', 'May': '', 'June': '', 'July': '', 'August': '', 'September': '', 'October': '', 'November': '', 'December': ''
                    },
                    {
                        'no': '4', 'jeniskegiatan': 'DENUMERATOR', 'January': '', 'February': '', 'March': '', 'April': '', 'May': '', 'June': '', 'July': '', 'August': '', 'September': '', 'October': '', 'November': '', 'December': ''
                    }
                ]
                $scope.dataSource = new kendo.data.DataSource({
                    data: datana,
                    total: datana,
                    // group: { field: "group" },
                    schema: {
                        model: {
                        }
                    }
                });
                LoadCombo();
            }

            $scope.mainGridOption = {
                dataSource: {
                    data: datana,
                    // aggregate: [
                    //     { field: "totalTindakan", aggregate: "sum" },
                    //     { field: "pointQty", aggregate: "sum" }
                    // ]
                },
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "rekapsensuspengukuranmutu.xlsx",
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
                        "field": "jeniskegiatan",
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
                medifirstService.getPart('sysadmin/general/get-ruangan-part', true, true, 10).then(function (e) {
                    $scope.listRuangan = e;
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listDepartemen = data;
                });
            }

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataSourceGrid._data, function (data) {
                    return data.id == dataItem.id;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                    for (let i = 0; i < $scope.selectedData.length; i++) {
                        if (dataSelect.norec == $scope.selectedData[i].norec) {
                            $scope.selectedData.splice([i], 1)
                            break
                        }
                    }
                }
                else {
                    dataSelect.statCheckbox = true;
                    $scope.selectedData.push(dataSelect)
                }
                console.log($scope.selectedData)
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
            var series1 = [];
            var series2 = [];
            function searchData() {
                var jenis = 'Column'
                var dataGrid = [];
                var bln = moment($scope.item.tahun).format('YYYY')
                var idDept = ''
                if ($scope.item.Departemen != undefined) {
                    idDept = '&idDept=' + $scope.item.Departemen.value
                }
                $scope.isRouteLoading = true;
                var dataGrid = [];
                medifirstService.get('pmkp/get-data-sasaran-mutu-bulanan?tahun=' + bln + idDept).then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.datasSearch = e.data.data;
                    var dataAnalisa = e.data.analisa[0];
                    if (dataAnalisa != undefined) {
                        norec = dataAnalisa.norec;
                        $scope.item.Analisa = dataAnalisa.analisa;
                        $scope.item.TindakLanjut = dataAnalisa.tindaklanjut;
                    }
                    if (!$scope.datasSearch) {
                        return toastr.success('Data tidak ditemukan', 'Info');
                    };
                    var Data = e.data.data;
                    var Datas = $scope.dataSource._data                                   
                    var target = 0;
                    var capaian = 0;
                    var numerator = 0;
                    var denumerator = 0;
                    var target = 0;
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            var str = Data[j].bulan.trim();
                            for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                var Tutu = Object.keys(Datas[i])[k]
                                if (str == Tutu) {
                                    if (Datas[i].jeniskegiatan == 'TARGET') {
                                        Datas[i][Tutu] = parseFloat(Data[j].target)
                                    } else if (Datas[i].jeniskegiatan == 'CAPAIAN') {
                                        Datas[i][Tutu] = parseFloat(Data[j].capaian)
                                    } else if (Datas[i].jeniskegiatan == 'NUMERATOR') {
                                        Datas[i][Tutu] = parseFloat(Data[j].numerator)
                                    } else if (Datas[i].jeniskegiatan == 'DENUMERATOR') {
                                        Datas[i][Tutu] = parseFloat(Data[j].denumerator)
                                    }
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

                    for (let l = 0; l < Data.length; l++) {
                        const element =Data[l]; 

                        if (element.bulan == 'January') {
                            series1[0] = element.capaian
                            series2[0] = element.target
                        } else if (element.bulan == 'February') {
                            series1[1] = element.capaian
                            series2[1] = element.target
                        } else if (element.bulan == 'March') {
                            series1[2] = element.capaian
                            series2[2] = element.target
                        } else if (element.bulan == 'April') {
                            series1[3] = element.capaian
                            series2[3] = element.target
                        } else if (element.bulan == 'May') {
                            series1[4] = element.capaian
                            series2[4] = element.target
                        } else if (element.bulan == 'June') {
                            series1[5] = element.capaian
                            series2[5] = element.target
                        } else if (element.bulan == 'July') {
                            series1[6] = element.capaian
                            series2[6] = element.target
                        } else if (element.bulan == 'August') {
                            series1[7] = element.capaian
                            series2[7] = element.target
                        } else if (element.bulan == 'September') {
                            series1[8] = element.capaian
                            series2[8] = element.target
                        } else if (element.bulan == 'October') {
                            series1[9] = element.capaian
                            series2[9] = element.target
                        } else if (element.bulan == 'November') {
                            series1[10] = element.capaian
                            series2[10] = element.target
                        } else if (element.bulan == 'December') {
                            series1[11] = element.capaian
                            series2[11] = element.target
                        }                        
                    }
                    for (let i = 0; i < series1.length; i++) {  
                        if (series1[i] != undefined) {
                            series1[i] = parseFloat(series1[i])
                        }else{
                            series1[i] = 0 
                        }                                          
                    }
                    for (let i = 0; i < series2.length; i++) {
                        if (series2[i] != undefined) {
                            series2[i] = parseFloat(series2[i])
                        }else{
                            series2[i] = 0
                        }
                        // series2[i] = parseFloat(series2[i])
                    }                            

                    $("#chart").kendoChart({
                        title: {
                            text: "Tanda Tanda Vital"
                        },
                        legend: {
                            position: "top"
                        },
                        series: [
                            {
                                type: "line",
                                data: series1,
                                name: "capaian",
                                color: "#ec5e0a",
                                axis: ""
                            },
                            {
                                type: "line",
                                data: series2,
                                name: "target",
                                color: "#4e4141",
                                axis: ""
                            }
                        ],
                        valueAxes: [{
                            title: { text: "Persentase" },
                            min: 0,
                            max: 120
                        }],
                        categoryAxis: {
                            categories: ['JAN', 'FEB', 'MAR', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'],
                            axisCrossingValues: [0, 0, 10, 10]
                        }
                    });
                })
            }

            // function createChart() {
            //     $("#chart").kendoChart({
            //         legend: {
            //             position: "bottom"
            //         },
            //         seriesDefaults: {
            //             type: "Column"
            //         },
            //         series: dataChart1,
            //         seriesColors: ["#F91717", "#F9E417", "#28F917", "#1769F9", "#F617F9",
            //             "#F98817", "#38C176", "#6F1BCD", "#F756A2", "#AE1006"],
            //         valueAxis: {
            //             labels: {
            //                 format: "{0%}",
            //                 template: "#= series.name #: #= value #"
            //             },
            //             line: {
            //                 visible: false
            //             },
            //             axisCrossingValue: 0
            //         },
            //         valueAxes: [{
            //             name: "capaian",
            //             color: "#007eff",
            //             min: 0,
            //             max: maxData + (maxData * 30 / 100)
            //         }],
            //         categoryAxis: {
            //             categories: [''],
            //             line: {
            //                 visible: false
            //             }
            //         },
            //         tooltip: {
            //             visible: true,
            //             format: "{0}",
            //             template: "#= series.name #: #= value #"
            //         },
            //         seriesClick: onSeriesClick,
            //     });
            // }

            $("#chart").kendoChart({
                title: {
                    text: "Grafik Target dan Pencapaian"
                },
                legend: {
                    position: "top"
                },
                series: [
                    {
                        type: "line",
                        data: series1,
                        name: "capaian",
                        color: "#ec5e0a",
                        axis: ""
                    },
                    {
                        type: "line",
                        data: series2,
                        name: "target",
                        color: "#4e4141",
                        axis: ""
                    }
                ],
                valueAxes: [{
                    title: { text: "Persentase" },
                    min: 0,
                    max: 120
                }],
                categoryAxis: {
                    categories: ['JAN', 'FEB', 'MAR', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'],
                    axisCrossingValues: [0, 0, 10, 10]
                }
            });

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

            $scope.Save = function(){                
                var listRawRequired = [
                    "item.tahun|k-ng-model|Tahun",
                    "item.Departemen|k-ng-model|Departemen",                                      
                ]
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var objSave = {                        
                        "norec" : norec != undefined ? norec : '',
                        "tindaklanjut" : $scope.item.TindakLanjut != undefined ? $scope.item.TindakLanjut : '',
                        "departemenfk" : $scope.item.Departemen.value,
                        "tahun" :  moment($scope.item.tahun).format('YYYY'),
                        "analisa" : $scope.item.Analisa != undefined ? $scope.item.Analisa : '',                    
                    }                
                    medifirstService.post('pmkp/save-data-analisa-sasaran-mutu', objSave).then(function (e) {
                        $scope.item.TindakLanjut = undefined;
                        $scope.item.Analisa = undefined;
                        norec = '';
                    });
                }else {
                    medifirstService.showMessages(isValid.messages);
                }                
            }

            $scope.reset = function(){
                $scope.item.TindakLanjut = undefined;
                $scope.item.Analisa = undefined;
                norec = '';
            }

            //** BATAS SUCI */
        }
    ]);

});