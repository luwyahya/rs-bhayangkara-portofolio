define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict'
    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('SuratKeputusanCtrl', ['$scope', 'DateHelper', '$timeout', 'MedifirstService',
        function ($scope, dateHelper, $timeout, medifirstService) {
            $scope.item = {
                tgl: new Date()
            };
            $scope.itemSip = {};
            $scope.itemStr = {};

            $scope.yearSelected = {
                format: "MMMM yyyy",
                start: "year",
                depth: "month"
            };
            FormLoad()

            function FormLoad() {

                medifirstService.get("sdm/get-combo-jadwal", true, true, 20).then(function (data) {
                    $scope.listJenis = data.data.jeniskeputusan;
                    // loadDataSip();
                });
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

            $scope.loadDataSip = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("sdm/get-data-sk").then(function (res) {
                    $scope.datagridSip = new kendo.data.DataSource({
                        data: res.data.data,
                        pageSize: 10,
                        schema: {
                            model: {
                                fields: {
                                    "tanggal": { type: "date" },

                                    "namask": { type: "string" }

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


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.opsiGridSip = {

                toolbar: [
                    {
                        text: "export", name: "Export detail",
                        template: '<button ng-click="exportDetailSTR()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export to Excel</button>'
                    },

                    {
                        name: "create", text: "Buat SK",
                        template: '<button ng-click="createSip()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat SK</button>'
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

                pageable: true,
                selectable: "row",
                scrollable: false,

                columns: [
                    { field: "jeniskeputusan", title: "Jenis SK", "width": 180 },
                    { field: "tgl", title: "Tanggal", template: "<span class='style-left'>{{formatTanggal('#: tgl #')}}</span>", width: 150 },
                    { field: "nosk", title: "No. SK", "width": 280 },
                    { field: "namask", title: "Nama SK", "width": 280 },
                    { field: "keteranganlainnya", title: "Keterangan", "width": 280 },

                    {
                        "command": [{
                            text: "Download",
                            click: downloadSipStr,
                            imageClass: "k-icon k-i-pencil"
                        }, {
                            text: "Hapus",
                            click: HapusSip,
                            imageClass: "k-icon k-delete"
                        }, {
                            text: "View",
                            click: viewSK,
                            imageClass: "k-icon k-i-download"
                        }
                        ],
                        title: "",
                        width: 280,
                    },


                ]
            };

            $scope.exportDetailSTR = function () {
                var tempDataExport = [];
                var rows = [
                    {
                        cells: [
                            { value: "Jenis Keputusan" },
                            { value: "Tanggal" },
                            { value: "No. Surat Keputusan" },
                            { value: "Surat Keputusan" },
                            { value: "Keterangan" },

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
                                { value: data[i].jeniskeputusan },
                                { value: moment(new Date(data[i].tgl)).format('DD-MM-YYYY') },
                                { value: data[i].nosk },
                                { value: data[i].namask },
                                { value: data[i].keteranganlainnya },

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
                                  
                                ],
                                // Title of the sheet
                                title: "SURAT KEPUTUSAN",
                                // Rows of the sheet
                                rows: rows
                            }
                        ]
                    });
                    //save the file as Excel file with extension xlsx
                    kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "Daftar Surat Keputusan -" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY') + ".xlsx" });
                });
            };


            var timeoutPromise;
            $scope.$watch('item.qNamaSK', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridSip", "namask", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.qNoSK', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridSip", "nosk", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.qKet', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridSip", "keteranganlainnya", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.qJenis', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilterSS("#gridSip", "jeniskeputusan", newVal);
                    }
                }, 500)
            });

            function applyFilterSS(gridId, filterField, filterValue) {
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

                if (filterField === "jeniskeputusan") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                }
                if (filterField === "keteranganlainnya") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                }
                if (filterField === "nosk") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                }
                if (filterField === "namask") {
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
                $scope.item = {
                    tgl: new Date()
                };
                var actions = $scope.popUpSip.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpSip.setOptions({ actions: actions });
            }


            $scope.batalSip = function () {
                $scope.item = {
                    tgl: new Date()
                };
                // document.getElementById("coba2").reset();
                document.getElementById("coba").reset();
                $scope.popUpSip.close();
            }

            $scope.simpanSip = function () {

                if ($scope.item.jenisKeputusan == undefined) {
                    toastr.error('Jenis Keputusan Tidak Boleh Kosong')
                    return;
                }

                if ($scope.item.nomorSK == undefined) {
                    toastr.error('No. SK Tidak Boleh Kosong')
                    return;
                }
                if ($scope.item.namaSK == undefined) {
                    toastr.error('Nama SK Tidak Boleh Kosong')
                    return;
                }

                var nR = ""
                if ($scope.item.id != undefined) {
                    nR = $scope.item.id
                }


                const url = baseTransaksi + 'sdm/save-data-sk'

                const formData = new FormData()
                const file = document.querySelector("[type=file]").files[0]
                if (file != "" && file != undefined) {
                    if (file.size > 2000000) { //dalam bytes
                        toastr.error('Maksimum Ukuran File  adalah 2 MB ')
                        return;
                    }
                }

                formData.append('file', file)
                formData.append('id', nR)
                formData.append('nosk', $scope.item.nomorSK)
                formData.append('namask', $scope.item.namaSK)
                formData.append('tgl', $scope.item.tgl != undefined ? moment($scope.item.tgl).format('YYYY-MM-DD') : null)
                formData.append('jenissk', $scope.item.jenisKeputusan.id)
                formData.append('keterangan', $scope.item.keterangan != undefined ? $scope.item.keterangan : '')

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
                    console.log(response)
                    if (response.status == 201)
                        toastr.success('Sukses');
                    else
                        toastr.error('Data Gagal Disimpan');
                    $scope.loadDataSip();
                    $scope.batalSip();
                })


            }


            function downloadSipStr(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if (dataItem.filename != null) {
                    str1 = strBACKEND + 'storage/sdm/sk/' + dataItem.id + '/' + dataItem.filename
                    window.open(str1, '_blank');
                }



            }
            function viewSK(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if (dataItem.filename != null) {
                    str1 = strBACKEND + 'storage/sdm/sk-view?id=' + dataItem.id + '&filename=' + dataItem.filename
                    window.open(str1, '_blank');
                }



            }
            


            function HapusSip(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "id": dataItem.id,
                    "namafile": dataItem.filename,
                }

                medifirstService.post('sdm/delete-data-sk', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataSip();
                    }
                })
            }



        }
    ]);
});