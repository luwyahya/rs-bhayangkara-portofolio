
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('JadwalKerjaPegawaiCtrl', ['$scope', 'DateHelper', 'MedifirstService', '$timeout',
        function ($scope, dateHelper, medifirstService, $timeout) {
            $scope.titleButton = 'Input Jadwal'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
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
                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuangan = data;                    
                });                                 

                medifirstService.get('sdm/get-combo-pegawai-jadwal-all').then(function (e) {                   
                    $scope.listDokter = e.data
                    $scope.listDokterCari = e.data
                });                
                
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    $scope.listShift = dataCombo.shiftkerja;
                    $scope.listUnitkerja = dataCombo.dataunitkerja;
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

            $scope.mainGridOptions = {
                pageable: true,
                toolbar: [
                    "excel",
                    {
                        name: "Create", text: "Create",
                        template: '<button ng-click="hapusJadwal()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-delete"></span>Hapus</button>'
                    },

                ],
                excel: {
                    fileName: "JadwalPraktekDokter.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:F1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Jadwal Dokter",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                columns: [
                    {
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: 3
                    },
                    {
                        field: "no",
                        title: "No",
                        width: 3
                    },
                    {
                        field: "namalengkap",
                        title: "Nama Lengkap",
                        width: 30
                    },
                    {
                        field: "unitkerja",
                        title: "Unit Kerja",
                        hidden: false,
                        width: 30
                    },
                    {
                        field: "tgljadwal",
                        title: "Tgl Jadwal",
                        hidden: false,
                        template: "<span class='style-left'>{{formatTanggal('#: tgljadwal #')}}</span>",
                        width: 15
                    },
                    {
                        field: "jammulai",
                        title: "Jam Mulai",
                        width: 10
                    },
                    {
                        field: "jamselesai",
                        title: "Jam Selesai",
                        width: 10
                    }
                ],
                selectable: "row",
                sortable: true
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
                    $scope.titleButton = 'Hide Input Jadwal'
                    $scope.generateTable()
                } else
                    $scope.titleButton = 'Input Jadwal'

            }

            $scope.generateTable = function () {
                $scope.column = [{
                    field: "namalengkap", title: "Nama Lengkap", width: "150px"
                },
                {
                    title: $scope.getBulan(),
                    columns: $scope.createColumn(),
                }]
                $scope.mainGridOptionss =
                    {
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
                for (let i = 0; i < $scope.arrDokter.length; i++) {
                    const element = $scope.arrDokter[i];
                    element.listTgl = []

                }
                dataARR = []
                dataARR = $scope.arrDokter
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: $scope.arrDokter,
                });
            }

            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return "<center>" + $scope.bulanString + "</center>";
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

            var dataARR = []
            $scope.onDataBound = function (e) {
                var grid = $("#gridBulan").data("kendoGrid");

                $(grid.tbody).on("dblclick", "td", function (e) {
                    // if (e.currentTarget.innerText === "") return; // disable show popup on empty cell date value
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    var row = $(this).closest("tr");
                    var selectedData = grid.dataItem(row);

                    if (colIdx >= 1) {
                        if (e.currentTarget.innerText == '')
                            e.currentTarget.innerText = '✔'
                        else
                            e.currentTarget.innerText = ''
                        // if (selectedData == undefined) break
                        var colDateIdx = colIdx - 1;
                        var colName = $('#gridBulan tr').eq(1).find('th').eq(colDateIdx).text();

                        if (colName.length === 1) {
                            colName = "0" + colName;
                        }
                        if (colName.length <= 2) {
                            // show detail on date cell click only
                            var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName;
                            // dataARR.push(date)
                            // selectedData.listTgl.push(date)
                            $scope.pushKeArray(selectedData.id, selectedData.namalengkap, selectedData.listTgl, date, e.currentTarget.innerText);
                        }                       
                    }
                });
            }

            $scope.pushKeArray = function (id, nama, list, date, isi) {
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
                            element.listTgl.push(date)
                        }
                    }
                }
            }

            $scope.save = function () {

                if ($scope.item.ruangan == undefined) {
                    toastr.error('Ruangan Tidak Boleh Kosong')
                    return
                }

                if ($scope.item.Shift == undefined) {
                    toastr.error('Shift Kerja Tidak Boleh Kosong')
                    return
                }

                if ($scope.item.jamMulai == undefined || $scope.item.jamMulai == "") {
                    toastr.error('Jam Mulai Tidak Boleh Kosong')
                    return
                }

                if ($scope.item.jamSelesai == undefined || $scope.item.jamMulai == "") {
                    toastr.error('Jam Selesai Tidak Boleh Kosong')
                    return
                }

                var data2 = []
                for (let i = 0; i < dataARR.length; i++) {
                    for (let j = 0; j < dataARR[i].listTgl.length; j++) {
                        data2.push({
                            'idpegawai': dataARR[i].id,
                            'namalengkap': dataARR[i].namalengkap,
                            'tgl': dataARR[i].listTgl[j],
                            'tglmulai': dataARR[i].listTgl[j] + ' ' + moment($scope.item.jamMulai).format('HH:mm'),
                            'tglselesai': dataARR[i].listTgl[j] + ' ' + moment($scope.item.jamSelesai).format('HH:mm'),
                        })
                    }


                }
                // console.log('save data :' + data2)
                var json = {
                    'ruanganfk': $scope.item.ruangan.id,
                    'jammulai': moment($scope.item.jamMulai).format('HH:mm'),
                    'jamselesai': moment($scope.item.jamSelesai).format('HH:mm'),
                    // 'tglmulai': moment('')
                    'shiftkerja' : $scope.item.Shift.id,
                    'keterangan': '-',
                    'data': data2
                }
                medifirstService.post('sdm/save-jadwal-perbulan-pegawai', json).then(function (e) {
                    $scope.search()
                })
            }

            $scope.search = function () {
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var ruangId = ''
                if ($scope.item.ruangan != undefined) {
                    ruangId = '&idRuangan=' + $scope.item.ruangan.id
                }
                var pegawaiId = ''
                if ($scope.arrDokter.length > 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.arrDokter.length - 1; i >= 0; i--) {
                        var c = $scope.arrDokter[i].id
                        b = "," + c
                        a = a + b
                    }
                    pegawaiId = a.slice(1, a.length)
                    pegawaiId = '&idPegawai=' + pegawaiId
                }
                $scope.isRouteLoading = true
                medifirstService.get('sdm/get-jadwal-perbulan-pegawai?bulan=' + bln
                    + pegawaiId + ruangId).then(function (e) {
                        $scope.isRouteLoading = false
                        for (let i = 0; i < e.data.length; i++) {
                            const element = e.data[i];
                            element.no = i + 1
                            element.statCheckbox = false

                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: e.data,
                            pageSize: 20
                        });
                    }, function error() {
                        $scope.isRouteLoading = false
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
                medifirstService.post('sdm/hapus-jadwal-perbulan-pegawai', json).then(function (e) {
                    $scope.search()
                }, function error() {

                })
            }

/////////////////////////////// // ///////
        }
    ]);

});