define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterTargetKinerjaCtrl', ['$q', '$rootScope', '$scope', '$state', '$timeout', 'ModelItem', 'MedifirstService',
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
                    { "field": "pelayanan", "title": "Pelayanan" },
                    { "field": "targetvolume", "title": "Target Volume" ,        "template": "<span class='style-right'>{{formatRupiah('#: targetvolume #', '')}}</span>",},
                    { "field": "targetrupiah", "title": "Target Rupiah" ,        "template": "<span class='style-right'>{{formatRupiah('#: targetrupiah #', 'Rp.')}}</span>",},
                    { "field": "tahun", "title": "Tahun", width: 100 },
                    { "command": [{ name: "edit", text: "Edit" }, { text: "Hapus", click: deleteRow }], width: 160 }
                ],
                selectable: "row",
                editable: "popup",
                save: function (e) {
                    $scope.Save(e.model);
                }
            };
            
            $scope.formatRupiah = function (value, currency) {
                if (value == "null")
                    value = 0
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $q.all([
                medifirstService.get('sdm/get-combo-jadwal')
            ]).then(function (res) {

                $scope.listKelompokShift = res[0].data.shiftkerja;
                $scope.refresh();
            });
            $scope.refresh = function () {
                $scope.items = {};
                var grid = $("#gridDaftarShift").data("kendoGrid"), listData = [];
                medifirstService.get("bendaharapenerimaan/get-list-target-kinerja", true).then(function (dat) {
                    //var filteredData = _.filter(dat.data.data, function(o) { 
                    //    return o.statusEnabled == true; 
                    //});
                    for (var i = 0; i < dat.data.data.length; i++) {
                        listData.push({
                            "id": dat.data.data[i].id,
                            "pelayanan": dat.data.data[i].pelayanan,
                            "targetvolume": dat.data.data[i].targetvolume,
                            "targetrupiah": dat.data.data[i].targetrupiah,
                            "tahun": dat.data.data[i].tahun,
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
                                    pelayanan: { editable: true },
                                    targetvolume: { editable: true },
                                    targetrupiah: { editable: true },
                                    tahun: { editable: true },
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
                    "pelayanan": data.pelayanan,
                    "targetvolume": data.targetvolume,
                    "targetrupiah": data.targetrupiah,
                    "statusenabled": true,
                    "tahun": data.tahun,
                }
                medifirstService.post("bendaharapenerimaan/save-target-kinerja", data).then(function (e) {
                    $scope.refresh();
                });
            }
            $scope.Batal = function () {
                $scope.item = undefined;
            }
            var timeoutPromise;
            // $scope.$watch('items.kodeKerja', function (newVal, oldVal) {
            //     $timeout.cancel(timeoutPromise);
            //     timeoutPromise = $timeout(function () {
            //         if (newVal && newVal !== oldVal) {
            //             applyFilter('kode', newVal)
            //         }
            //     }, 800)
            // });
            $scope.$watch('items.Pelayanan', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('pelayanan', newVal)
                    }
                }, 800)
            });
            
            // $scope.$watch('items.kelompokShift', function (newVal, oldVal) {
            //     $timeout.cancel(timeoutPromise);
            //     timeoutPromise = $timeout(function () {
            //         if (newVal && newVal !== oldVal) {
            //             applyFilter('idkelompokshift', newVal)
            //         }
            //     })
            // });
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
                medifirstService.post("sdm/save-jam-kerja", datasend).then(function (e) {
                    $scope.refresh();
                });
            }
        }
    ])
});
