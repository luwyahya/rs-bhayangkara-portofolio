define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict'
    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('SipStrExpiredCtrl', ['$scope', 'DateHelper', '$timeout', 'MedifirstService',
        function ($scope, dateHelper, $timeout, medifirstService) {
            $scope.item = {};
            $scope.itemSip = {};
            $scope.itemStr = {};
            $scope.yearSelected = {
                format: "MMMM yyyy",
                start: "year",
                depth: "month"
            };
            loadCombo()
            FormLoad()

            function FormLoad() {
                $scope.isRouteLoading = true;
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                    // loadDataSip();
                });
            }
            function loadCombo() {
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function(dat) {
                    $scope.listRuangan = dat.data.ruangan
                })
            }


            $scope.loadDataSip = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("sdm/get-data-sip").then(function (res) {
                    $scope.datagridSip = new kendo.data.DataSource({
                        data: res.data.data,
                        pageSize: 10,
                        schema: {
                            model: {
                                fields: {
                                    "berakhirsip": { type: "date" },
                                    "berakhirstr": { type: "date" },
                                    "namapegawai": { type: "string" }

                                }
                            }
                        },
                    });
                    $scope.isRouteLoading = false;
                    $scope.datagridSipTemp = $scope.datagridSip
                }, (err) => {
                    $scope.isRouteLoading = false;
                });
                $scope.tabActive = 'masaBerlakuSip';
            };
            $scope.loadDataStr = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("sdm/get-data-str").then(function (res) {

                    $scope.datagridStr = new kendo.data.DataSource({
                        data: res.data.data,
                        pageSize: 10,
                        schema: {
                            model: {
                                fields: {
                                    "tglberakhir": { type: "date" },
                                    "namapegawai": { type: "string" }

                                }
                            }
                        },
                        // group: {
                        //     field: "tglberakhir",
                        //     format: "{0:MMM yyyy}",
                        //     aggregates: [{
                        //         field: "tglberakhir",
                        //         format: "{0:MMM yyyy}",
                        //         aggregate: "count"
                        //     }]
                        // },
                        // aggregate: [ { field: "tglberakhir", format: "{0:MMM yyyy}",aggregate: "count" }]

                    });
                    $scope.isRouteLoading = false;
                    $scope.datagridStrTemp = $scope.datagridStr
                }, (error) => {
                    $scope.isRouteLoading = false;
                });
                $scope.tabActive = 'masaBerlakuStr';
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.onTabChanges = function (value) {
                if (value === 1) {
                    if (!$scope.datagridSip) {
                        $scope.loadDataSip();
                    }
                } else if (value === 2) {
                    if (!$scope.datagridStr) {
                        $scope.loadDataStr();
                    }
                }
            };
            function monthDiff(d1, d2) {
                var months;
                months = (d2.getFullYear() - d1.getFullYear()) * 12;
                months -= d1.getMonth() + 1;
                months += d2.getMonth();
                return months <= 0 ? 0 : months;
            }


            var onDataBound = function (e) {

                var kendoGrid = $("#gridSip").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows

                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var dateNow = new Date();

                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var berakhirsip = kendoGrid.dataItem(row).berakhirsip;
                    var berakhirstr = kendoGrid.dataItem(row).berakhirstr;
                    if (berakhirsip != null) {
                        var dateEx = new Date(berakhirsip);
                        var diffDays = monthDiff(
                            dateNow,
                            dateEx, // November 4th, 2008
                              // March 12th, 2010
                        );
                        if (diffDays <= 6) {
                            $(row.cells[3]).addClass("red");
                        }
                    }
                    if (berakhirstr != null) {
                        var dateExx = new Date(berakhirstr);
                        var diffDayss = monthDiff(
                           // November 4th, 2008
                            dateNow,  // March 12th, 2010,
                            dateExx
                        );
                        if (diffDayss <= 6) {
                            $(row.cells[6]).addClass("red");
                        }
                    }
                }
            }
            $scope.opsiGridSip = {
                dataBound: onDataBound,
                toolbar: [
                    {
                        text: "export", name: "Export detail",
                        template: '<button ng-click="exportDetailSTR()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export to Excel</button>'
                    },

                    {
                        name: "create", text: "Buat SIP / STR",
                        template: '<button ng-click="createSip()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat SIP / STR</button>'
                    },

                ],
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startswith: "Dimulai dengan",
                            contains: "mengandung kata",
                            neq: "Tidak mengandung kata"
                        }
                    }
                },
                // excel: {
                //     fileName: "Daftar SIP / STR Pegawai.xlsx",
                //     allPages: true,
                // },
                // excelExport: function (e) {
                //     var sheet = e.workbook.sheets[0];
                //     sheet.frozenRows = 2;
                //     sheet.mergedCells = ["A1:G1"];
                //     sheet.name = "Orders";

                //     var myHeaders = [{
                //         value: "Daftar SIP Pegawai",
                //         fontSize: 20,
                //         textAlign: "center",
                //         background: "#ffffff",
                //         // color:"#ffffff"
                //     }];

                //     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                // },
                pageable: true,
                selectable: "row",
                scrollable: false,
                // filterable:true,
                // filterable:{
                //     operators:{
                //         date:{
                //             gte:"dari tanggal",
                //             lte:"sampai tanggal"
                //         }
                //     }
                // },
                columns: [
                    { field: "nippns", title: "NIP", "width": 180 },
                    { field: "namapegawai", title: "Nama", "width": 280 },
                    { field: "ruangankerja", title: "Ruangan Kerja", "width": 280 },
                    { field: "jenispegawai", title: "Jenis Pegawai" ,"width": 280 },
                    // { field: "subunit", title: "Sub-Unit Kerja"},
                    { field: "nosip", title: "Nomor SIP", "width": 280 },
                    { field: "terbitsip", title: "Tgl Mulai SIP", template: "<span class='style-left'>{{formatTanggal('#: terbitsip #')}}</span>", width: 150 },
                    { field: "namafilesip", title: "File SIP", "width": 330 },
                    { field: "nostr", title: "Nomor STR", "width": 280 },
                    { field: "terbitstr", title: "Tgl Mulai STR", template: "<span class='style-left'>{{formatTanggal('#: terbitstr #')}}</span>", width: 150 },
                    { field: "namafilestr", title: "File STR", "width": 330 },
                    { field: "berakhirstr", title: "Tgl Berakhir SIP & STR", template: "<span class='style-left'>{{formatTanggal('#: berakhirstr #')}}</span>", width: 180 },
                    { field: "keteranganstr", title: "Keterangan STR", "width": "280px" },
                    {
                        "command": [{
                            text: "Download",
                            click: downloadSipStr,
                            imageClass: "k-icon k-i-pencil"
                        },
                        {
                            text: "View",
                            click: view,
                            imageClass: "k-icon k-i-eye"
                        },{
                            text: "Hapus",
                            click: HapusSip,
                            imageClass: "k-icon k-delete"
                        }
                        ],
                        title: "",
                        width: 300,
                    },
                    // { field: "tglberakhir", title: "Tanggal Berakhir"  
                    //  , aggregates: ["count"]
                    //  , groupHeaderTemplate: "Tanggal Berakhir SIP [#= kendo.toString(value) #] (Total: #= count#)" }

                ]
            };

            $scope.exportDetailSTR = function () {
                var tempDataExport = [];
                var rows = [
                    {
                        cells: [
                            { value: "NIP" },
                            { value: "Nama" },
                            { value: "Unit Kerja" },
                            { value: "No. SIP" },
                            { value: "Tanggal Berakhir" },
                            { value: "No. STR" },
                            { value: "Tanggal Berakhir" }
                        ]
                    }
                ];

                tempDataExport = $scope.datagridSip;
                tempDataExport.fetch(function () {
                    var data = this.data();
                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        //push single row for every record
                        rows.push({
                            cells: [
                                { value: data[i].nipPns },
                                { value: data[i].namapegawai },
                                { value: data[i].unitkerja },
                                { value: data[i].nosip },
                                { value: moment(new Date(data[i].berakhirsip)).format('DD-MM-YYYY') },
                                { value: data[i].nostr },
                                { value: moment(new Date(data[i].berakhirstr)).format('DD-MM-YYYY') },
                            ]
                        })
                    }
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: [
                            {
                                freezePane: {
                                    rowSplit: 1
                                },
                                columns: [
                                    // Column settings (width)
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true }
                                ],
                                // Title of the sheet
                                title: "SIP",
                                // Rows of the sheet
                                rows: rows
                            }
                        ]
                    });
                    //save the file as Excel file with extension xlsx
                    kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "Daftar Masa Berlaku SIP STR -" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY') + ".xlsx" });
                });
            };
            $scope.opsiGridStr = {
                toolbar: [
                    {
                        name: "create", text: "Buat STR",
                        template: '<button ng-click="createStr()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat STR</button>'
                    },
                    "excel",
                ],
                excel: {
                    fileName: "Daftar STR Pegawai.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar STR Pegawai",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                selectable: "row",
                scrollable: false,
                columns: [
                    { field: "nippns", title: "NIP", "width": "180px" },
                    { field: "namapegawai", title: "Nama", "width": "280px" },
                    { field: "ruangankerja", title: "Ruangan Kerja", "width": "280px" },
                    // { field: "unitkerja", title: "Unit Kerja" },
                    // { field: "subunit", title: "Sub-Unit Kerja" },
                    { field: "nomor", title: "Nomor STR", "width": "280px" },
                    { field: "tglberakhir", title: "Tanggal Berakhir", template: "<span class='style-left'>{{formatTanggal('#: tglberakhir #')}}</span>" },
                    { field: "keteranganstr", title: "Keterangan STR", "width": "280px" },
                    { field: "namafileupload", title: "File STR", "width": "280px" },
                    {
                        "command": [{
                            text: "Download",
                            click: downloadSipStr,
                            imageClass: "k-icon k-delete"
                        }
                            , {
                            text: "Hapus",
                            click: HapusStr,
                            imageClass: "k-icon k-i-pencil"
                        }
                        ],
                        title: "",
                        width: "280px",
                    },
                    // { field: "tglberakhir", title: "Tanggal Berakhir"  
                    //  , aggregates: ["count"]
                    //  , groupHeaderTemplate: "Tanggal Berakhir SIP [#= kendo.toString(value) #] (Total: #= count#)" }

                ]
            };

            function lastday(y, m) {
                return new Date(y, m + 1, 0).getDate();
            }
            function applyFiterKu(tgl, data, jenisSurat, jenisFilter) {

                var array = []
                var data = data._data
                if (jenisFilter == "awal") {
                    tgl = new Date(tgl.setDate(1))

                    // var data =  $scope.datagridSip._data
                    for (var i = 0; i < data.length; i++) {
                        if (tgl <= new Date(data[i].tglberakhir)) {
                            array.push(data[i])
                        }
                    }
                }

                if (jenisFilter == "akhir") {
                    var last = lastday(tgl.getYear(), tgl.getMonth())
                    tgl = new Date(moment(tgl.setDate(last)).format('YYYY-MM-DD 23:59:59'))

                    for (var i = 0; i < data.length; i++) {
                        if (tgl >= new Date(data[i].tglberakhir)) {
                            array.push(data[i])
                        }
                    }
                }

                $scope.datagridS = new kendo.data.DataSource({
                    data: array,
                    //  pageSize: 10,
                    group: {
                        field: "tglberakhir",
                        aggregates: [{
                            field: "tglberakhir",
                            aggregate: "count"
                        }]
                    },
                    aggregate: [{ field: "tglberakhir", aggregate: "count" }]
                });

                if (jenisSurat == "sip") {
                    $scope.datagridSip = $scope.datagridS;
                } else {
                    $scope.datagridStr = $scope.datagridS;
                }
            }

            var timeoutPromise;
            $scope.$watch('item.tglAwalSip', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterDate("#gridSip", "berakhirsip", "gte", newVal)
                        // applyFiterKu(newVal,$scope.datagridSip, "sip", "awal")
                    }
                }, 500);
            });

            $scope.$watch('item.tglAkhirSip', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterDate("#gridSip", "berakhirsip", "lte", newVal)
                        // applyFiterKu(newVal,$scope.datagridSip, "sip", "akhir")
                    }
                }, 500);
            });

            $scope.$watch('item.tglAwalStr', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterDate("#gridSip", "berakhirstr", "gte", newVal)
                        // applyFiterKu(newVal,$scope.datagridStr, "str", "awal")
                    }
                }, 500);
            });
            $scope.$watch('item.tglAkhirStr', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterDate("#gridSip", "berakhirstr", "lte", newVal)
                        // applyFiterKu(newVal,$scope.datagridStr, "str", "akhir")
                    }
                }, 500);
            });

            $scope.$watch('item.qnamaPegawaiSip', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridSip", "namapegawai", newVal);
                    }
                }, 500)
            });

            $scope.$watch('item.qnamaPegawaiStr', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridStr", "namapegawai", newVal);
                    }
                }, 500)
            });

            $scope.$watch('item.ruangansip.namaruangan', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridSip", "ruangankerja", newVal);
                    }
                }, 500)
            });

            $scope.$watch('item.ruanganstr.namaruangan', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridStr", "ruangankerja", newVal);
                    }
                }, 500)
            });

            function applyFilterSS(gridId, filterField, filterValue) {
                debugger
                var dataGrid = $(gridId).data("kendoGrid");
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

                if (filterField === "namapegawai") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                }
                if (filterField === "ruangankerja") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });

            }

            function applyFilterDate(gridId, filterField, filterOperator, filterValue) {
                var gridData = $(gridId).data("kendoGrid");
                var currFilterObj = gridData.dataSource.filter();
                // var currFilterObj = gridData.data.filter();
                var currentFilters = currFilterObj ? currFilterObj.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField && currentFilters[i].operator == filterOperator) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue !== "") {
                    var tgl;
                    if (filterOperator === "gte") {
                        tgl = dateHelper.setJamAwal(new Date(filterValue));
                    } else if (filterOperator === "lte") {
                        tgl = dateHelper.setJamAkhir(new Date(filterValue));
                    }
                    currentFilters.push({
                        field: filterField,
                        operator: filterOperator,
                        value: tgl
                    });

                }

                gridData.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });
            };
            $scope.resetFilter = function (gridId) {
                var gridData = $(gridId).data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item = {};
            };



            $scope.createSip = function () {
                $scope.popUpSip.center().open();
                var actions = $scope.popUpSip.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpSip.setOptions({ actions: actions });
            }

            // $scope.$watch('itemSip.namaPeg', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
            //         $scope.itemSip.idPeg = $scope.itemSip.namaPeg.id;
            //     }
            // });

            $scope.batalSip = function () {
                $scope.itemSip = {};
                $scope.itemStr = {};
                document.getElementById("coba2").reset();
                document.getElementById("coba").reset();
                $scope.popUpSip.close();
            }

            $scope.simpanSip = function () {

                if ($scope.itemSip.namaPeg == undefined) {
                    toastr.error('Nama Pegawai Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemSip.nomor == undefined) {
                    toastr.error('Nomor Sip Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemSip.terbit == undefined) {
                    toastr.error('Terbit Sip Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemSip.berakhir == undefined) {
                    toastr.error('Berakhir Sip Tidak Boleh Kosong')
                    return;
                }

                if ($scope.itemStr.nomor == undefined) {
                    toastr.error('Nomor STR Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemStr.terbit == undefined) {
                    toastr.error('Terbit STR Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemStr.berakhir == undefined) {
                    toastr.error('Berakhir STR Tidak Boleh Kosong')
                    return;
                }


                var nR = ""
                if ($scope.itemSip.norec != undefined) {
                    nR = $scope.itemSip.norec
                }


                const url = baseTransaksi + 'sdm/upload-data-sipstr'

                const form = document.querySelector('form')

                const formData = new FormData()
                const fileSIP = document.querySelectorAll('[type=file]')[0].files[0]
                const fileSTR = document.querySelectorAll('[type=file]')[1].files[0]
                if (fileSIP != "" && fileSIP != undefined) {
                    if (fileSIP.size > 1000000 || fileSIP.type != "application/pdf") { //dalam bytes
                        toastr.error('Maksimum Ukuran File SIP adalah 1 MB dalam Format PDF')
                        return;
                    }
                }
                if (fileSTR != "" && fileSTR != undefined) {
                    if (fileSTR.size > 1000000 || fileSTR.type != "application/pdf") {
                        toastr.error('Maksimum Ukuran File STR adalah 1 MB dalam Format PDF')
                        return;
                    }
                }

                formData.append('filesip', fileSIP)
                formData.append('filestr', fileSTR)
                formData.append('norec', nR)
                formData.append('idPegawai', $scope.itemSip.namaPeg.id)
                formData.append('nomorsip', $scope.itemSip.nomor)
                formData.append('terbitsip', moment($scope.itemSip.terbit).format('YYYY-MM-DD'))
                formData.append('berakhirsip', moment($scope.itemSip.berakhir).format('YYYY-MM-DD'))
                formData.append('nomorstr', $scope.itemStr.nomor)
                formData.append('terbitstr', moment($scope.itemStr.terbit).format('YYYY-MM-DD'))
                formData.append('berakhirstr', moment($scope.itemStr.berakhir).format('YYYY-MM-DD'))
                formData.append('keteranganstr',$scope.itemStr.keteranganStr)


                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    // console.log(response)
                    if (response.status == 201)
                        toastr.info('Sukses');
                    else
                        toastr.info('Simpan Gagal');
                    $scope.loadDataSip();
                    $scope.batalSip();
                })
                // managePhp.postData2('sdm-pegawai/upload-data-sipstr-rev',formData).then(function(res){
                //     $scope.loadDataSip();
                // })

            }

            $scope.createStr = function () {
                $scope.popUpStr.center().open();
                var actions = $scope.popUpStr.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpStr.setOptions({ actions: actions });
            }

            // $scope.$watch('itemStr.namaPeg', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
            //         $scope.itemStr.idPeg = $scope.itemStr.namaPeg.id;
            //     }
            // });

            $scope.batalStr = function () {
                $scope.itemStr = {};
                document.getElementById("coba2").reset();
                $scope.popUpStr.close();
            }

            $scope.simpanStr = function () {
                if ($scope.itemStr.idPeg == "" || $scope.itemStr.idPeg == undefined) {
                    toastr.error('Id Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemStr.namaPeg == "" || $scope.itemStr.namaPeg == undefined) {
                    toastr.error('Nama Pegawai Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemStr.noSip == "" || $scope.itemStr.noSip == undefined) {
                    toastr.error('Nomor STR Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemStr.tglStrAkhir == "" || $scope.itemStr.tglStrAkhir == undefined) {
                    toastr.error('Tanggal Berakhir STR Tidak Boleh Kosong')
                    return;
                }



                var nR = ""
                if ($scope.itemStr.norec != undefined) {
                    nR = $scope.itemStr.norec
                }

                var tglStrAkhir = moment($scope.itemStr.tglStrAkhir).format('YYYY-MM-DD 00:00')

                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.itemStr.idPeg,
                    "nomorSurat": $scope.itemStr.noSip,
                    "tglBerakhir": tglStrAkhir,
                    "jenismasaberlakufk": 2,
                }

                const url = baseTransaksi + 'sdm/upload-data-sipstr'
                // const url = baseTransaksi +'sdm-pegawai/upload-data-sipstr'
                // 'http://localhost:8000/service/transaksi/sdm-pegawai/upload-data-sipstr'
                const form = document.querySelector('form')
                const formData = new FormData()

                // const file = document.getElementById("coba2").files[0]
                const file = document.querySelector(".myStr").files[0]
                // const file = document.querySelector('[type=file]').files[0]
                if (file == "" || file == undefined) {
                    toastr.error('Silahkan Upload File STR')
                    return;
                }
                if (file.size > 3145728 || file.type != "application/pdf") {
                    toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                    return;
                }
                formData.append('file', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('nomorSurat', objSave.nomorSurat)
                formData.append('tglBerakhir', objSave.tglBerakhir)
                formData.append('jenismasaberlakufk', objSave.jenismasaberlakufk)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    if (response.status == 201)
                        toastr.info('Sukses');
                    else
                        toastr.info('Simpan Gagal');
                    $scope.loadDataStr();
                    $scope.batalStr();
                })
            }

            function downloadSipStr(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                 if (dataItem.namafilesip == null && dataItem.namafilestr  == null) {
                     toastr.error('File SIP/STR belum di upload')
                     return
                 }
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if (dataItem.namafilesip != null) {
                    str1 = strBACKEND + 'storage/sdm/sip-str/' + dataItem.norec + '/' + dataItem.namafilesip
                }
                if (dataItem.namafilestr != null) {
                    if (str1 != '')
                        str1 = str1 + ';' + strBACKEND + 'storage/sdm/sip-str/' + dataItem.norec + '/' + dataItem.namafilestr
                    else
                        str1 = strBACKEND + 'storage/sdm/sip-str/' + dataItem.norec + '/' + dataItem.namafilestr
                }
                for (var i = 0; i < str1.split(';').length; i++) {
                    window.open(str1.split(';')[i], '_blank');
                }
                // medifirstService.get('sdm/download-sip-str?name=SipStr-' + dataItem.namapegawai + '&norec=' + dataItem.norec).then(function (data) {

                // })

                // medifirstService.get('sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload).then(function (data) {

                //     // var url=baseTransaksi+data;
                //     // downloadURI(url);

                // });

            }

            function downloadURI(url) {
                var link = document.createElement('a');
                document.body.appendChild(link);
                link.href = url;
                link.click();
            }
            function view(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                 if (dataItem.namafilesip == null && dataItem.namafilestr  == null) {
                     toastr.error('File SIP/STR belum di upload')
                     return
                 }
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if (dataItem.namafilesip != null) {
                    str1 = strBACKEND + 'storage/sdm/sip-str-view?norec=' + dataItem.norec + '&namafile=' + dataItem.namafilesip
                }
                if (dataItem.namafilestr != null) {
                    if (str1 != '')
                        str1 = str1 + ';' + strBACKEND + 'storage/sdm/sip-str-view?norec=' + dataItem.norec + '&namafile=' + dataItem.namafilestr
                    else
                        str1 = strBACKEND + 'storage/sdm/sip-str-view?norec=' + dataItem.norec + '&namafile=' + dataItem.namafilestr
                }
                for (var i = 0; i < str1.split(';').length; i++) {
                    window.open(str1.split(';')[i], '_blank');
                }
                // window.open(configuration.baseApiBackend() + 'sipstr-view/' + dataItem.norec, '_blank');
            }

            function HapusSip(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                    "namafile": dataItem.namafileupload,
                }

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataSip();
                    }
                })
            }

            function HapusStr(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                    "namafile": dataItem.namafileupload,
                }

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataStr();
                    }
                })
            }

            $scope.klikGrid = function (datagridSipSelected) {
                $scope.datagridSipSelected = datagridSipSelected
            }

            $scope.editSIP = function(){
                $scope.item.editSIP = $scope.datagridSipSelected.nosip
                $scope.item.editSTR = $scope.datagridSipSelected.nostr
                $scope.item.edittglmulaisip = $scope.datagridSipSelected.terbitsip
                $scope.item.edittglmulaistr = $scope.datagridSipSelected.terbitstr
                $scope.item.editKeteranganaSTR = $scope.datagridSipSelected.keteranganstr

                $scope.item.edittglberakhirsipstr = $scope.datagridSipSelected.berakhirsip
                $scope.popUpEdit.center().open()
            }

            $scope.editSTR = function(){
                $scope.item.editSTR = $scope.datagridSipSelected.nostr
                $scope.popUpEditSTR.center().open()
            }

            $scope.updateSIP = function(){
                var itemUpdate = {
                    "norec": $scope.datagridSipSelected.norec,
                    "nosip": $scope.item.editSIP,
                    "terbitsip": $scope.item.edittglmulaisip,
                    "nostr": $scope.item.editSTR,
                    "terbitstr": $scope.item.edittglmulaistr,
                    "berakhirsip": $scope.item.edittglberakhirsipstr,
                    "berakhirstr": $scope.item.edittglberakhirsipstr,
                    "keteranganstr":$scope.item.editKeteranganaSTR
                }

                medifirstService.post('sdm/update-sip-str', itemUpdate).then(function (e) {
                    if (e.data.status === 201) {
                        $scope.loadDataSip();
                        $scope.popUpEditSIP.close()
                    }
                })
            }

            $scope.updateSTR = function(){
                var itemUpdate = { 
                    "norec": $scope.datagridSipSelected.norec,
                    "nostr": $scope.item.editSTR
                }

                medifirstService.post('sdm/update-str', itemUpdate).then(function (e) {
                    if (e.data.status === 201) {
                        $scope.loadDataSip();
                        $scope.popUpEditSTR.close()
                    }
                })
            }

        }
    ]);
});