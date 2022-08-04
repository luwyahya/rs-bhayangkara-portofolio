
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('SensusPengukuranMutuCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout) {
            $scope.titleButton = 'Input Edukasi'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var dataGrid = [];
            var datana = [];
            var data_head = [];
            var dataARR = [];
            var norecSasaran = '';
            var dataTea = [];
            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }
            FormLoad();

            function FormLoad() {
                $scope.item.bulan = $scope.now;
                // $scope.monthOnly = {
                //     start: "year",
                //     depth: "year",
                //     format: "MMMM yyyy",
                // };
                LoadCombo();
            }

            function LoadCombo() {
                medifirstService.getPart('sysadmin/general/get-ruangan-part', true, true, 10).then(function (e) {
                    $scope.listRuangan = e;
                });

                medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                    $scope.listPegawai = e.data
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listDepartemen = data;
                });
            }


            $scope.cekAll = function (bool) {
                if (bool) {
                    $scope.listDokter.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrDokter.push(e)
                    })
                } else {
                    $scope.listDokter.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrDokter = []
                    })
                }

            }

            $("#calendar").kendoCalendar();
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataSourceGrid._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedData = []
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                        $scope.selectedData.push(tempData[i])
                    }
                }

                console.log($scope.selectedData)
                reloaddataSourceGrid(tempData);
            }

            function reloaddataSourceGrid(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,

                });

                var grid = $('#kGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

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

            $scope.cariDokter = function () {
                $scope.listTempDokter = []
                if ($scope.item.cariDokter != undefined) {
                    var textbox = $scope.item.cariDokter.toLowerCase()
                    for (let i = 0; i < $scope.listDokterCari.length; i++) {
                        var arr = $scope.listDokterCari[i].namalengkap.toLowerCase()
                        if (arr.indexOf(textbox) != -1) {
                            $scope.listTempDokter.push($scope.listDokterCari[i])
                        }
                    }
                    $scope.listDokter = []
                    $scope.listDokter = $scope.listTempDokter
                }
                if ($scope.item.cariDokter == "" || $scope.item.cariDokter == undefined)
                    $scope.listDokter = $scope.listDokterCari
            }


            $scope.inputJadwal = function () {
                $scope.isInput = !$scope.isInput
                // if ($scope.isInput) {
                //     $scope.titleButton = 'Hide Input Edukasi'                    
                // } else { $scope.titleButton = 'Input Edukasi' }                                   
                if ($scope.item.Departemen != undefined) {
                    medifirstService.get("pmkp/get-data-indikator-departemen?" + "idDept=" + $scope.item.Departemen.value).then(function (e) {
                        var datas = e.data.data
                        for (let i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }
                        datana.push(datas);
                        $scope.generateTable()
                    });
                } else {
                    window.messageContainer.error("Departemen Masih Kosong");
                }
            }

            $scope.Hide = function () {
                $scope.isInput = false;
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: [],
                });
                $scope.item.Departemen = undefined;
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
                        "field": "indikator",
                        "title": "<h3 align=center>Indikator<h3>",
                        "width": "210px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "keterangan",
                        "title": "<h3 align=center>Keterangan<h3>",
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
                        // title: $scope.getBulan(),
                        // columns: $scope.createColumn(),
                    },
                    {
                        "field": "num",
                        "title": "<h3 align=center>NUM (A)<h3>",
                        "width": "410px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        },
                    },
                    {
                        "field": "denum",
                        "title": "<h3 align=center>Denum (B)<h3>",
                        "width": "410px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
                        }
                    },
                    {
                        "field": "capaian",
                        "title": "<h3 align=center>Capaian (%)<h3>",
                        "width": "410px",
                        "filterable": false,
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: left;"
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
                $scope.kuntul = datana[0]
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: datana[0],
                });

            }

            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return "<center>" + $scope.bulanString + "</center>";
            }

            function getHeader() {
                var kolomTitle = "Capaian : " + DateHelper.getBulanFormatted(new Date($scope.item.bulan));
                return kolomTitle;
            }

            $scope.createColumn = function () {
                var year = parseInt(moment($scope.item.bulan).format("Y"))
                var month = parseInt(moment($scope.item.bulan).format("M"))
                var tempDate = new Date(year, month, 0);

                var list = [];

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

            $scope.addDokter = function (bool, data) {
                var index = $scope.arrDokter.indexOf(data);
                if (_.filter($scope.arrDokter, {
                    id: data.id
                }).length === 0 && bool)

                    $scope.arrDokter.push(data);
                else
                    $scope.arrDokter.splice(index, 1);
            }


            $scope.onDataBound = function (e) {
                data_head = [];
                var grid = $("#gridBulan").data("kendoGrid");
                $(grid.tbody).on("click", "td", function (e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    var num = 0;
                    var denum = 0;
                    var capaian = 0;
                    data_head = [];
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx > 2) {
                        var person = prompt("Masukan Nilai Sensus", "");
                        e.currentTarget.innerText = person
                        var colDateIdx = colIdx - 2;
                        if (colIdx > 30) {
                            var colMain = colIdx - 30
                            var colReal = 0;
                            if (colMain == 4) {
                                colReal = colMain + 1
                            } else if (colMain == 3) {
                                colReal = colMain + 2
                            } else if (colMain == 2) {
                                colReal = colMain + 3
                            } else {
                                colReal = colMain
                            }
                            var columns = grid.options.columns[colReal].title;
                            var field = grid.options.columns[colReal].field;
                            if (field == "num") {
                                var totNum = 0;
                                num = e.currentTarget.innerText
                                $scope.numerator = parseFloat(totNum) + parseFloat(num)
                            } else if (field == "denum") {
                                var totDen = 0;
                                denum = e.currentTarget.innerText
                                $scope.denumerator = parseFloat(totDen) + parseFloat(denum)
                            } else if (field == "capaian") {
                                var totCap = 0;
                                capaian = e.currentTarget.innerText
                                $scope.Capaian = parseFloat(totCap) + parseFloat(capaian)
                            }
                        }
                        var colName = $('#gridBulan tr').eq(1).find('th').eq(colDateIdx).text();
                        if (colName.length == 1) {
                            colName = "0" + colName;
                        }
                        if (colName.length <= 2) {
                            // var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName;  
                            var tgl = dateHelper.getFormatMonthPicker($scope.item.bulan);
                            var Tglset = "";
                            var tglTea = colDateIdx
                            if (tglTea.toString().length > 1) {
                                Tglset = colDateIdx
                            } else {
                                Tglset = '0' + colDateIdx
                            }
                            // $scope.selectedData.listTgl = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset;
                            var date = null;
                            if (colDateIdx < 31) {
                                var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset //$scope.selectedData.listTgl
                            }
                            $scope.pushKeArray($scope.selectedData.no, norecSasaran, $scope.selectedData.id, $scope.selectedData.indikator, $scope.selectedData.listTgl, date, e.currentTarget.innerText, num, denum, capaian, $scope.selectedData.keterangan);
                        }
                    }
                });
            }

            $scope.batal = function () {
                $scope.item.jumlahPengunjung = undefined;
            }

            $scope.pushKeArray = function (no, norec, id, indikator, list, date, isi, num, denum, capaian, keterangan) {
                for (let i = 0; i < dataARR.length; i++) {
                    const element = dataARR[i];
                    if (isi == '') {
                        if (element.id == id) {
                            for (let e = 0; e < element.listTgl.length; e++) {
                                // const element2 = element.listTgl[e];
                                if (element.listTgl[e] == date) {
                                    element.listTgl.splice([e])
                                }
                            }

                        }
                    } else {
                        if (element.id == id) {
                            // element.listTgl.push(date);
                            // var data = {
                            //     'norecSasaran': norec,
                            //     'isi': isi,
                            //     'tglnilai': date,
                            //     'tgl': date,
                            //     'num': num,
                            //     'denum': denum,
                            //     'capaian': capaian
                            // }
                            // element.detail.push(data)
                            for (var o = dataARR.length - 1; o >= 0; o--) {
                                if (dataARR[o].id == id) {
                                    var data = {
                                        'indikatorfk': id,
                                        'norecSasaran': norec,
                                        'isi': isi,
                                        'tglnilai': date,
                                        'tgl': date,
                                        'num': num,
                                        'denum': denum,
                                        'capaian': capaian,
                                        'keterangan': keterangan,
                                    }
                                    dataTea.push(data);
                                    // dataARR[o].norec = norecSasaran;
                                    // dataARR[o].isi = isi;                                   
                                    // dataARR[o].listTgl = date;
                                    // dataARR[o].tglnilai = date;
                                    // dataARR[o].num = num;
                                    // dataARR[o].denum = denum;
                                    // dataARR[o].capaian = capaian;
                                }
                            }
                            // dataTea.push(dataARR);                   
                        }
                    }
                }
            }

            $scope.save = function () {
                if ($scope.item.Departemen == undefined) {
                    toastr.error('Departemen Tidak Boleh Kosong')
                    return
                }
                var data2 = []
                // var isi = ' ';                
                // for (let i = 0; i < dataARR.length; i++) {
                //     for (let j = 0; j < dataARR[i].listTgl.length; j++) {
                //         for (let k = 0; k < dataARR[i].detail.length; j++) {
                //             data2.push({
                //                 'tgl': dataARR[i].listTgl[j],
                //                 'detail': dataARR[i].detail[k],
                //                 'indikatorfk': dataARR[i].id,
                //             })
                //         }
                //     }
                // }
                if (dataTea == undefined) {
                    // data2.push(dataTea);
                    toastr.error('Data Tidak Boleh Kosong')
                    return
                }
                var objSave = {
                    'departemenfk': $scope.item.Departemen.value,
                    'capaian': $scope.Capaian != undefined ? $scope.Capaian : 0,
                    'denumerator': $scope.denumerator != undefined ? $scope.denumerator : 0,
                    'numerator': $scope.numerator != undefined ? $scope.numerator : 0,
                    'data': dataTea
                }
                medifirstService.post('pmkp/save-data-sasaran-mutu', objSave).then(function (e) {
                    searchData()
                })
            }

            function searchData() {
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var idDept = ''
                if ($scope.item.Departemen != undefined) {
                    idDept = '&idDept=' + $scope.item.Departemen.value
                }
                $scope.isRouteLoading = true;
                //'pmkp/get-data-sasaran-mutu?bulan=' + bln + idDept
                //pmkp/get-data-indikator-departemen?" + "idDept=" + $scope.item.Departemen.value             
                medifirstService.get('pmkp/get-data-indikator-departemen?' + idDept).then(function (e) {
                    $scope.isRouteLoading = false;
                    dataGrid = e.data.data;
                    for (let i = 0; i < dataGrid.length; i++) {
                        dataGrid[i].no = i + 1;
                    }

                    $("#gridOrder").kendoGrid({
                        dataSource: {
                            data: dataGrid,
                        },
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "sensushariansasaranmutu.xlsx",
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
                                "field": "indikator",
                                "title": "<h3 align=center>Indikator<h3>",
                                "width": "600px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            },
                            {
                                "field": "keterangan",
                                "title": "<h3 align=center>Keterangan<h3>",
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
                                "field": "num",
                                "title": "<h3 align=center>NUM (A)<h3>",
                                "width": "410px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                },
                            },
                            {
                                "field": "denum",
                                "title": "<h3 align=center>Denum (B)<h3>",
                                "width": "410px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            },
                            {
                                "field": "capaian",
                                "title": "<h3 align=center>Capaian (%)<h3>",
                                "width": "410px",
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
                        // group: { field: "jeniskeselamatan" },
                        schema: {
                            model: {
                            }
                        }
                    });
                    GetLaporan();
                })
            }

            function GetLaporan() {
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var idDept = ''
                if ($scope.item.Departemen != undefined) {
                    idDept = '&idDept=' + $scope.item.Departemen.value
                }
                $scope.isRouteLoading = false;
                medifirstService.get('pmkp/get-data-sasaran-mutu?bulan=' + bln + idDept).then(function (e) {
                    $scope.datasSearch = e.data
                    for (var i = $scope.datasSearch.length - 1; i >= 0; i--) {
                        $scope.datasSearch[i].no = i + 1
                        if (parseFloat($scope.datasSearch[i].nilai) != 0) {
                            $scope.datasSearch[i].isian = parseFloat($scope.datasSearch[i].nilai)
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
                            fileName: "sensushariansasaranmutu.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        editable: false,
                        scrollable: true,
                        selectable: "row",
                        // sortable: true,
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
                                "title": "<h3 align=center>Insiden Keselamatan Pasien<h3>",
                                "width": "600px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            },
                            {
                                "field": "isian",
                                "title": "<h3 align=center>Tanggal<h3>",
                                "columns": $scope.createColumn(),
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: center;"
                                }
                            },
                            ,
                            {
                                "field": "num",
                                "title": "<h3 align=center>NUM (A)<h3>",
                                "width": "410px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                },
                            },
                            {
                                "field": "denum",
                                "title": "<h3 align=center>Denum (B)<h3>",
                                "width": "410px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            },
                            {
                                "field": "capaian",
                                "title": "<h3 align=center>Capaian (%)<h3>",
                                "width": "410px",
                                "filterable": false,
                                attributes: {
                                    "class": "table-cell",
                                    style: "text-align: left;"
                                }
                            }
                        ]
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: dataGrid,
                    });
                });
            }

            var timeoutPromise;
            $scope.$watch('item.cariDokters', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal)
                    }
                }, 500)
            })

            $scope.cariDokterGrid = function () {
                applyFilter("namalengkap", $scope.item.cariDokters)
            }

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#kGrid").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }

            $scope.resetFilter = function () {
                var dataGrid = $("#kGrid").data("kendoGrid");
                dataGrid.dataSource.filter({});
                delete $scope.item.cariDokters;
            }

            $scope.hapusJadwal = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error('Ceklis data yang mau dihapus')
                    return
                }
                var json = {
                    'data': $scope.selectedData
                }
                medifirstService.post('rawatinap/hapus-jadwal-perbulan-pegawai', json).then(function (e) {
                    searchData()
                }, function error() {

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
                var year = $scope.item.bulan.getYear();
                var month = $scope.item.bulan.getMonth();
                var dateInMonth = new Date(year, month + 1, 0);
                var listDay = [];
                for (var i = 0; i < dateInMonth.getDate(); i++) {
                    var data = {
                        field: "[" + (i + 1) + "]",
                        title: (i + 1).toString(),
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