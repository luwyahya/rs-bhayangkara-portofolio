define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ShiftKerjaCtrl', ['$q', '$rootScope', '$scope', '$state', '$timeout', 'ModelItem', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, $timeout, modelItem, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.mainGridOptions = {
                dataSource: {
                    data: []
                },
                toolbar: [
                    { name: "create", text: "Tambah" }
                ],
                pageable: true,
                columns: [
                    { "field": "kodeexternal", "title": "Kode Shift", width: 80 },
                    { "field": "namashift", "title": "Nama Shift" },
                    { "field": "kelompokshift", "title": "Kelompok Shift", editor: dropDownKelompokShift, "template": "#= kelompokshift.kelompokshiftkerja #" },
                    {
                        "title": "Jadwal", columns: [
                            { "field": "jammasuk", "title": "Jam Masuk", width: 80 },
                            { "field": "jampulang", "title": "Jam Keluar", width: 80 },
                            { "field": "waktuistirahat", "title": "Istirahat<br/>(menit)", width: 80 },
                        ]
                    },
                    { "field": "factorrate", "title": "Operator FR" },
                    { "command": [{ name: "edit", text: "Edit" }, { text: "Hapus", click: deleteRow }], width: 160 }
                ],
                selectable: "row",
                editable: "popup",
                save: function (e) {
                    $scope.Save(e.model);
                }
            };
            $q.all([
                medifirstService.get('sdm/get-combo-jadwal')
            ]).then(function (res) {

                $scope.listKelompokShift = res[0].data.shiftkerja;
                $scope.refresh();
            });
            $scope.refresh = function () {
                $scope.items = {};
                var grid = $("#gridDaftarShift").data("kendoGrid"), listData = [];
                medifirstService.get("sdm/get-list-shift-kerja", true).then(function (dat) {
                    //var filteredData = _.filter(dat.data.data, function(o) { 
                    //    return o.statusEnabled == true; 
                    //});
                    for (var i = 0; i < dat.data.data.length; i++) {
                        listData.push({
                            "id": dat.data.data[i].id,
                            "kodeexternal": dat.data.data[i].kodeexternal,
                            "namashift": dat.data.data[i].namashift,
                            "kelompokshift": {
                                "id": dat.data.data[i].objectkelompokshiftfk,
                                "kelompokshiftkerja": dat.data.data[i].kelompokshiftkerja,
                            },
                            "idkelompokshift": dat.data.data[i].objectkelompokshiftfk,
                            "factorrate": dat.data.data[i].factorrate,
                            "jammasuk": dat.data.data[i].jammasuk,
                            "jampulang": dat.data.data[i].jampulang,
                            "waktuistirahat": dat.data.data[i].waktuistirahat,
                        })
                    }

                    var dataSource = new kendo.data.DataSource({
                        pageSize: 20,
                        data: listData,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { editable: false },
                                    kodeexternal: { editable: true },
                                    namashift: { editable: true },
                                    kelompokshift: { editable: true, defaultValue: { id: 0, name: "Pilih--" } },
                                    factorrate: { editable: true, type: "number" },
                                    jammasuk: { editable: true },
                                    jampulang: { editable: true },
                                    waktuistirahat: { editable: true, type: "number" },
                                }
                            }
                        }
                    });

                    // reload and bind to grid dataSource
                    grid.setDataSource(dataSource);
                    grid.dataSource.read();
                });

            }
            $scope.addZeroBefore = function (n) {
                return (n < 10 ? '0' : '') + n;
            };
            function dropDownKelompokShift(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: "kelompokshiftkerja",
                        dataValueField: "id",
                        dataSource: $scope.listKelompokShift
                    });
            }
            $scope.Save = function (data) {
                var data = {
                    "id": data.id ? data.id : "",
                    "kodeexternal": data.kodeexternal,
                    "namashift": data.namashift,
                    "kelompokshift": data.kelompokshift,
                    "factorrate": data.factorrate,
                    "statusenabled": true,
                    "jammasuk": data.jammasuk,
                    "jampulang": data.jampulang,
                    "waktuistirahat": data.waktuistirahat
                }
                medifirstService.post("sdm/save-shift-kerja", data).then(function (e) {
                    $scope.refresh();
                });
            }
            $scope.Batal = function () {
                $scope.item = undefined;
            }
            var timeoutPromise;
            $scope.$watch('items.namaShift', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('namashift', newVal)
                    }
                }, 800)
            });
            $scope.$watch('items.kodeShift', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('kodeexternal', newVal)
                    }
                }, 800)
            });
            
            $scope.$watch('items.kelompokShift', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('idkelompokshift', newVal)
                    }
                })
            });
            function applyFilter(filterField, filterValue) {
                var gridData = $("#gridDaftarShift").data("kendoGrid");
                var currFilterObj = gridData.dataSource.filter();
                var currentFilters = currFilterObj ? currFilterObj.filters : [];

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
                    });
                }

                gridData.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilters = function () {
                var gridData = $("#gridDaftarShift").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.items = {};
            }
            function deleteRow(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    "statusenabled": false,
                    "id": dataItem.id
                };
                medifirstService.post("sdm/save-shift-kerja", datasend).then(function (e) {
                    $scope.refresh();
                });
            }
        }
    ])
});
