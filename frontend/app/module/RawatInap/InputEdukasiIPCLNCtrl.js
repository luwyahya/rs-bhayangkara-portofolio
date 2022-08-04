
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('InputEdukasiIPCLNCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout) {
            $scope.titleButton = 'Input Edukasi'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var datana = []
            var data_head = []
            var dataARR = []
            FormLoad();

            function FormLoad() {
                $scope.item.bulan = $scope.now;
                $scope.monthOnly = {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                };
                LoadCombo();
            }

            function LoadCombo() {
                medifirstService.getPart('sysadmin/general/get-ruangan-part', true, true, 10).then(function (e) {
                    $scope.listRuangan = e;
                });

                medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                    $scope.listPegawai = e.data
                });

                //medifirstService.get('sdm-pegawai/get-data-combo').then(function (e) {
                //     $scope.listShift = e.data.shiftkerja;
                // });

                datana = [
                    {
                        'no': '1', 'jeniskegiatan': 'Surveilans'
                    },
                    {
                        'no': '2', 'jeniskegiatan': 'Memberikan edukasi pengunjung apabila terdapat potensi KLB'
                    },
                    {
                        'no': '3', 'jeniskegiatan': 'Memberikan motivasi dan mengingatkan staf ruangan mengenal standar PPI'
                    },
                    {
                        'no': '4', 'jeniskegiatan': 'Memonitor staf di ruangan dalam penerapan kewaspadaan isolasi'
                    },
                    {
                        'no': '5', 'jeniskegiatan': 'Melapor kepada IPCN apabila ada kecurigaan HAIs pada pasien'
                    },
                    {
                        'no': '6', 'jeniskegiatan': 'Memantau atau memberikan penyuluhan bagi pasien'
                    }
                ]
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
                if ($scope.isInput) {
                    $scope.titleButton = 'Hide Input Edukasi'
                    $scope.generateTable()
                } else
                    $scope.titleButton = 'Input Edukasi'

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
                        "title": "<h3 align=center>Jenis Kegiatan<h3>",
                        "width": "410px",
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
                for (let i = 0; i < datana.length; i++) {
                    const element = datana[i];
                    element.listTgl = []

                }
                dataARR = []
                dataARR = datana
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: datana,
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
                    data_head = [];
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx > 1) {
                        var colDateIdx = colIdx - 1;
                        var no = grid.dataItem(row).no;
                        // var selectedDatas = grid.dataItem(row);

                        if (no != 2 && no != 6) {
                            e.currentTarget.innerText = '✔'
                            var colDateIdx = colIdx - 1;
                            var colName = $('#gridBulan tr').eq(1).find('th').eq(colDateIdx).text();
                            if (colName.length === 1) {
                                colName = "0" + colName;
                            }
                            if (colName.length <= 2) {
                                // var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName; 
                                $scope.selectedData.listTgl = date;
                                var tgl = dateHelper.getFormatMonthPicker($scope.item.bulan);
                                var Tglset = "";
                                if (colDateIdx.length > 1) {
                                    Tglset = colDateIdx
                                } else {
                                    Tglset = '0' + colDateIdx
                                }
                                $scope.selectedData.listTgl = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset;
                                var date = $scope.selectedData.listTgl
                                $scope.pushKeArray($scope.selectedData.no, $scope.selectedData.jeniskegiatan, $scope.selectedData.listTgl, date, e.currentTarget.innerText);
                            }
                        } else {
                            var person = prompt("Masukan Jumlah Peserta", "");
                            e.currentTarget.innerText = person
                            var colDateIdx = colIdx - 1;
                            var colName = $('#gridBulan tr').eq(1).find('th').eq(colDateIdx).text();
                            if (colName.length == 1) {
                                colName = "0" + colName;
                            }
                            if (colName.length <= 2) {
                                // var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName;  
                                var tgl = dateHelper.getFormatMonthPicker($scope.item.bulan);
                                var Tglset = "";
                                if (colDateIdx.length > 1) {
                                    Tglset = colDateIdx
                                } else {
                                    Tglset = '0' + colDateIdx
                                }
                                $scope.selectedData.listTgl = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset;
                                var date = $scope.selectedData.listTgl
                                $scope.pushKeArray($scope.selectedData.no, $scope.selectedData.jeniskegiatan, $scope.selectedData.listTgl, date, e.currentTarget.innerText);
                            }
                        }
                    }
                });
            }

            $scope.batal = function () {
                $scope.item.jumlahPengunjung = undefined;
            }

            $scope.pushKeArray = function (id, nama, list, date, isi) {
                for (let i = 0; i < dataARR.length; i++) {
                    const element = dataARR[i];
                    if (isi == '') {
                        if (element.no == id) {
                            for (let e = 0; e < element.listTgl.length; e++) {
                                // const element2 = element.listTgl[e];
                                if (element.listTgl[e] == date) {
                                    element.listTgl.splice([e])
                                }
                            }

                        }
                    } else {
                        if (element.no == id) {
                            // element.listTgl.push(date)
                            // element.isi.push(isi)
                            for (var o = dataARR.length - 1; o >= 0; o--) {
                                if (dataARR[o].no == id) {
                                    dataARR[o].isi = isi;
                                    dataARR[o].listTgl = date;
                                }
                            }
                        }
                    }
                }
            }

            $scope.save = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error('Ruangan Tidak Boleh Kosong')
                    return
                }

                if ($scope.item.pegawai == undefined) {
                    toastr.error('Pegawai Tidak Boleh Kosong')
                    return
                }


                var data2 = []
                for (let i = 0; i < dataARR.length; i++) {
                    var isi = '';
                    if (dataARR[i].isi == '✔') {
                        isi = '01'
                    } else {
                        isi = dataARR[i].isi
                    }
                    // for (let j = 0; j < dataARR[i].listTgl.length; j++) {
                    data2.push({
                        'tgl': dataARR[i].listTgl,
                        'isi': isi,
                        'jeniskegiatan': dataARR[i].jeniskegiatan
                    })
                    // }


                }
                // console.log('save data :' + data2)
                var objSave = {
                    'ruanganfk': $scope.item.ruangan.id,
                    'pegawaifk': $scope.item.pegawai.id,
                    'data': data2
                }
                medifirstService.post('rawatinap/save-data-edukasi', objSave).then(function (e) {
                    searchData()
                })
            }

            function searchData() {
                var dataGrid = [];
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var ruangId = ''
                if ($scope.item.ruangan != undefined) {
                    ruangId = '&idRuangan=' + $scope.item.ruangan.id
                }
                var pegawaiId = ''
                if ($scope.item.pegawai != undefined) {
                    pegawaiId = '&idPegawai=' + $scope.item.pegawai.id
                }
                $scope.isRouteLoading = true;
                var dataGrid = [];
                medifirstService.get('rawatinap/get-data-ipcln?bulan=' + bln
                    + pegawaiId + ruangId).then(function (e) {
                        $scope.isRouteLoading = false
                        $scope.datasSearch = e.data
                        for (var i = $scope.datasSearch.length - 1; i >= 0; i--) {
                            $scope.datasSearch[i].no = i + 1
                            if ($scope.datasSearch[i].isi == '01') {
                                $scope.datasSearch[i].isian = '✔'
                            } else {
                                $scope.datasSearch[i].isian = $scope.datasSearch[i].isi
                            }
                        }

                        if (!$scope.datasSearch) {
                            return toastr.success('Data tidak ditemukan', 'Info');
                        };

                        $scope.datasSearch.forEach(function (element) {
                            var customData = {};
                            for (var key in element) {
                                switch (key) {
                                    case "tgl":
                                        // var lisObjek = element.jeniskegiatan;
                                        var tgl = element.tgl;
                                        var key = tgl.slice(-1);
                                        if (key[0] === "0") {
                                            customData[key] = element.isian;
                                        } else {
                                            customData[key] = element.isian;
                                        }

                                        // lisObjek.forEach(function(subElement){
                                        //     var tgl = subElement.tanggal;
                                        //     var key = tgl.slice(-2);
                                        //     if(key[0] === "0"){
                                        //         key = key.slice(-1);
                                        //         customData[key] = subElement["count"];
                                        //     } else {
                                        //         customData[key] = subElement["count"];
                                        //     };
                                        // });
                                        break;
                                    default:
                                        customData[key] = element[key];
                                        break;
                                }
                            };
                            dataGrid.push(customData);
                        });
                        $scope.mainGridOption = {
                            dataSource: {
                                data: dataGrid,
                                aggregate: [
                                    { field: "totalTindakan", aggregate: "sum" },
                                    { field: "pointQty", aggregate: "sum" }
                                ]
                            },
                            toolbar: [
                                "excel",
                            ],
                            excel: {
                                fileName: "laporanipcln.xlsx",
                                allPages: true,
                            },
                            excelExport: function (e) {
                                // var sheet = e.workbook.sheets[0];
                                // sheet.frozenRows = 2;
                                // sheet.mergedCells = ["A1:AK1"];
                                // sheet.name = "Orders";

                                // var myHeaders = [{
                                //     value:"Logbook " + $scope.item.pegawai.namaLengkap + $scope.item.pegawai.namaLengkap  + " ( Periode " + dateHelper.getFormatMonthPicker($scope.item.periode) +" )",
                                //     fontSize: 20,
                                //     textAlign: "center",
                                //     background:"#ffffff",
                                //  // color:"#ffffff"
                                // }];

                                // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                            },
                            editable: false,
                            scrollable: true,
                            selectable: "row",
                            columns: [
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
                                    field: "isian",
                                    "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                                    "columns": $scope.generateGridColumn(),
                                    "filterable": false,
                                    attributes: {
                                        "class": "table-cell",
                                        style: "text-align: center;"
                                    }
                                }
                            ]
                        };
                        $scope.dataSource = new kendo.data.DataSource({
                            data: dataGrid
                        });
                    })
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

            /////////////////////////////// // ///////
        }
    ]);

});