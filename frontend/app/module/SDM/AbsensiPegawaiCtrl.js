
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('AbsensiPegawaiCtrl', ['$scope', 'DateHelper', 'MedifirstService', '$timeout',
        function ($scope, dateHelper, medifirstService, $timeout) {
            $scope.titleButton = 'Input Jadwal'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.popup = {}
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var data2 = []
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
            medifirstService

            function LoadCombo() {
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                });

                medifirstService.get('sdm/get-combo-pegawai-jadwal-all').then(function (e) {
                    $scope.listDokter = e.data
                    $scope.listDokterCari = e.data
                });

                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listUnitKerja = dataCombo.dataunitkerja;
                    $scope.ListKedudukanPegawai = dataCombo.statuspegawai;
                    $scope.ListStatusPegawai = dataCombo.kategorypegawai;
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
            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.cari = function () {
                if ($scope.item.qBulan == undefined) {
                    toastr.error('Bulan Harus di isi')
                    return
                }
                if ($scope.item.qPegawai == undefined) {
                    toastr.error('Pegawai Harus di pilih')
                    return
                }
                var bln = ''
                if ($scope.item.qBulan != undefined) {
                    bln = moment($scope.item.qBulan).format('YYYY-MM')
                }
                var pegawaiId = ''
                if ($scope.item.qPegawai != undefined) {
                    pegawaiId = '&idPegawai=' + $scope.item.qPegawai.id
                }
                $scope.isRouteLoading = true
                data2 = []

                // generateTable()
                medifirstService.get('sdm/get-absensi-pegawai?bulan=' + bln + pegawaiId).then(function (e) {
                    $scope.isRouteLoading = false
                    for (let i = 0; i < e.data.length; i++) {
                        const element = e.data[i];
                        element.no = i + 1
                    }
                    var dataBack = e.data.data

                    var date = $scope.item.qBulan;
                    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    var loppHari = getMonths(moment(firstDay).format('YYYY-MM-DD'), moment(lastDay).format('YYYY-MM-DD'))

                    for (let x = 0; x < loppHari.length; x++) {
                        const element = loppHari[x];

                        data2.push({
                            'no': x + 1,
                            'tanggal': element.str,
                            'tglabsen':element.tglabsen,// moment(element.firstDay).format('YYYY-MM-DD'),
                            'jammasuk': null,
                            'jampulang': null,
                            'mesinmasuk': null,
                            'mesinpulang': null,
                            'status': null,
                            'kwk': null,
                        })
                    }
                    if (dataBack.length > 0) {
                        for (let z = 0; z < data2.length; z++) {
                            const element = data2[z];
                            for (let x = 0; x < dataBack.length; x++) {
                                const element2 = dataBack[x];
                                if (element.tglabsen == moment(new Date(element2.jammasuk)).format('YYYY-MM-DD')) {
                                    element.jammasuk = moment(new Date(element2.jammasuk)).format('HH:mm')
                                    element.jampulang = moment(new Date(element2.jamkeluar)).format('HH:mm')
                                    element.mesinpulang = element2.mesinpulang
                                    element.mesinmasuk = element2.mesinmasuk
                                    element.status = element2.status
                                    if (element2.kwk)
                                        element.kwk = parseInt(element2.kwk)
                                    break
                                }

                            }
                        }

                    }

                    $scope.dataSourceGrid = new kendo.data.DataSource({
                        data: data2,
                        batch: true,
                        schema: {
                            model: {
                            }
                        }
                    });
                }, function error() {
                    $scope.isRouteLoading = false
                })

            }

            $scope.mainGridOptions = {
                pageable: true,

                excel: {
                    fileName: "Absensi Pegawai.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Absensi";

                    var myHeaders = [{
                        value: "Absensi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                columns: [

                    {
                        field: "no",
                        title: "No",
                        width: "20px"
                    },
                    {
                        field: "tanggal",
                        title: "Tanggal",
                        width: "80px"
                    },
                    {
                        title: "Absen",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jammasuk",
                                title: "Jam Masuk",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "mesinmasuk",
                                title: "Mesin Masuk",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "jampulang",
                                title: "Jam Pulang",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "mesinpulang",
                                title: "Mesin Pulang",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        field: "status",
                        title: "Status",
                        hidden: false,
                        width: "50px"
                    },
                    {
                        field: "kwk",
                        title: "KWK (Menit)",
                        hidden: false,
                        width: "50px"
                    },
                    {
                        width: "50px",
                        "command": [
                            { text: "Edit", click: showDetails, imageClass: "k-icon k-i-pencil" },

                        ],

                    },

                ],
                selectable: "cell",
                sortable: true
            }
            function showDetails(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get('sdm/get-monitoring-absensi-pegawai?norec=asa').then(function () {

                })
                $scope.popup = {}
                $scope.popup = dataItem
                $scope.winDialogBaru.center().open()
            }
            $scope.update = function () {
                for (let i = 0; i < data2.length; i++) {
                    const element = data2[i];
                    if ($scope.popup.no == element.no) {
                        element.jammasuk = $scope.popup.jammasuk != undefined ? moment($scope.popup.jammasuk).format('HH:mm') : null
                        element.jampulang = $scope.popup.jampulang != undefined ? moment($scope.popup.jampulang).format('HH:mm') : null
                        element.mesinmasuk = $scope.popup.mesinmasuk
                        element.mesinpulang = $scope.popup.mesinpulang
                        element.kwk = $scope.popup.kwk
                        element.status = $scope.popup.status
                        break
                    }
                }
                $scope.dataSourceGrid = new kendo.data.DataSource({
                    data: data2,
                    batch: true,
                    schema: {
                        model: {
                        }
                    }
                });
                $scope.popup = {}
                $scope.winDialogBaru.close()

            }
            $scope.Simpan = function () {
                var data = {
                    'pegawaifk': $scope.item.qPegawai,
                    'absen': data2

                }
                medifirstService.post('sdm/save-absensi-pegawai', data).then(function () {

                })
            }
            $scope.cancel = function () {
                $scope.popup = {}
                $scope.winDialogBaru.close()
            }

            //  $scope.mainGridOptions = {
            //     pageable: true,
            //     dataBound: $scope.onDataBound,
            //     excel: {
            //         fileName: "Absensi Pegawai.xlsx",
            //         allPages: true,
            //     },
            //     excelExport: function (e) {
            //         var sheet = e.workbook.sheets[0];
            //         sheet.frozenRows = 2;
            //         sheet.mergedCells = ["A1:H1"];
            //         sheet.name = "Absensi";

            //         var myHeaders = [{
            //             value: "Absensi",
            //             fontSize: 20,
            //             textAlign: "center",
            //             background: "#ffffff",
            //             // color:"#ffffff"
            //         }];

            //         sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
            //     },
            //     columns: [

            //         {
            //             field: "no",
            //             title: "No",
            //             width: "20px"
            //         },
            //         {
            //             field: "tanggal",
            //             title: "Tanggal",
            //             width: "80px"
            //         },
            //         {
            //             title: "Absen",
            //             headerAttributes: { style: "text-align : center" },
            //             columns: [
            //                 {
            //                     field: "jammasuk",
            //                     title: "Jam Masuk",
            //                     width: "80px",
            //                     headerAttributes: { style: "text-align : center" }
            //                 },
            //                 {
            //                     field: "mesinmasuk",
            //                     title: "Mesin Masuk",
            //                     width: "100px",
            //                     headerAttributes: { style: "text-align : center" },
            //                 },
            //                 {
            //                     field: "jampulang",
            //                     title: "Jam Pulang",
            //                     width: "80px",
            //                     headerAttributes: { style: "text-align : center" }
            //                 },
            //                 {
            //                     field: "mesinpulang",
            //                     title: "Mesin Pulang",
            //                     width: "100px",
            //                     headerAttributes: { style: "text-align : center" },
            //                 }

            //             ]
            //         },
            //         {
            //             field: "status",
            //             title: "Status",
            //             hidden: false,
            //             width: "50px"
            //         },
            //         {
            //             field: "kwk",
            //             title: "KWK (Menit)",
            //             hidden: false,

            //             width: "50px"
            //         },

            //     ],
            //     selectable: "cell",
            //     sortable: true
            // }
            // $("#kGrid").kendoGrid({                      
            //     dataSource: $scope.dataSourceGrid,
            //     pageable: true,
            //     height: 550,
            //     toolbar: ["create"],
            //     columns: [
            //         {
            //             field: "no",
            //             title: "No",
            //             width: "20px"
            //         },
            //         {
            //             field: "tanggal",
            //             title: "Tanggal",
            //             width: "80px"
            //         },
            //         {
            //             title: "Absen",
            //             headerAttributes: { style: "text-align : center" },
            //             columns: [
            //                 {
            //                     field: "jammasuk",
            //                     title: "Jam Masuk",
            //                     width: "80px",
            //                     headerAttributes: { style: "text-align : center" }
            //                 },
            //                 {
            //                     field: "mesinmasuk",
            //                     title: "Mesin Masuk",
            //                     width: "100px",
            //                     headerAttributes: { style: "text-align : center" },
            //                 },
            //                 {
            //                     field: "jampulang",
            //                     title: "Jam Pulang",
            //                     width: "80px",
            //                     headerAttributes: { style: "text-align : center" }
            //                 },
            //                 {
            //                     field: "mesinpulang",
            //                     title: "Mesin Pulang",
            //                     width: "100px",
            //                     headerAttributes: { style: "text-align : center" },
            //                 }

            //             ]
            //         },
            //         {
            //             field: "status",
            //             title: "Status",
            //             hidden: false,
            //             width: "50px"
            //         },
            //         {
            //             field: "kwk",
            //             title: "KWK (Menit)",
            //             hidden: false,

            //             width: "50px"
            //         },

            //     ],
            //     editable: "popup",
            //     dataBound: onDataBound
            //   });
            function onDataBound() {
                var grid = this;

                grid.element.on('dblclick', 'tbody tr[data-uid]', function (e) {
                    grid.editRow($(e.target).closest('tr'));
                })
            }
            var getMonths = function (startDate, endDate) {
                var resultList = [];
                var date = new Date(startDate);
                var endDate = new Date(endDate);
                var hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
                var monthNameList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

                while (date <= endDate) {
                    // var _hari = date.getDay();
                    // var hari = hari[_hari]
                    var stringDate = hariList[date.getDay()] + ', ' + date.getDate() + ' ' + monthNameList[date.getMonth()] + " " + date.getFullYear();

                    //get first and last day of month
                    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                    resultList.push({
                        str: stringDate,
                        first: firstDay,
                        tglabsen: moment(date).format('YYYY-MM-DD'),
                        last: lastDay,
                    });
                    date.setDate(date.getDate() + 1);
                }
                return resultList;
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
                var grid = $("#kGrid").data("kendoGrid");

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
                        var colName = $('#kGrid tr').eq(1).find('th').eq(colDateIdx).text();

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
                    'ruanganfk': $scope.item.ruangan.value,
                    'jammulai': moment($scope.item.jamMulai).format('HH:mm'),
                    'jamselesai': moment($scope.item.jamSelesai).format('HH:mm'),
                    // 'tglmulai': moment('')
                    'shiftkerja': $scope.item.Shift.id,
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
                    ruangId = '&idRuangan=' + $scope.item.ruangan.value
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