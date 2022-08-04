define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('JamKerjaCtrl', ['$q', '$rootScope', '$scope', '$state', '$timeout', 'ModelItem', 'MedifirstService',
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
                    { "field": "kode", "title": "Kode", width: 100 },
                    { "field": "jamkerja", "title": "Jam Kerja" },
                    // { "field": "kelompokshift", "title": "Kelompok Shift", editor: dropDownKelompokShift, "template": "#= kelompokshift.kelompokshiftkerja #" },
                    {
                        "title": "Jadwal", columns: [
                            { "field": "jammasuk", "title": "Jam Masuk", width: 80 },
                            { "field": "jampulang", "title": "Jam Keluar", width: 80 },
                        ]
                    },
                    { "field": "deskripsi", "title": "Deskripsi" },
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
                medifirstService.get("sdm/get-list-jam-kerja", true).then(function (dat) {
                    //var filteredData = _.filter(dat.data.data, function(o) { 
                    //    return o.statusEnabled == true; 
                    //});
                    for (var i = 0; i < dat.data.data.length; i++) {
                        listData.push({
                            "id": dat.data.data[i].id,
                            "kode": dat.data.data[i].kode,
                            "jamkerja": dat.data.data[i].jamkerja,
                            "deskripsi": dat.data.data[i].deskripsi,
                            "jammasuk": dat.data.data[i].jammasuk,
                            "jampulang": dat.data.data[i].jampulang,
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
                                    kode: { editable: true },
                                    jamkerja: { editable: true },
                                    deskripsi: { editable: true },
                                    jammasuk: { editable: true },
                                    jampulang: { editable: true },
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
            // function dropDownKelompokShift(container, options) {
            //     $('<input required name="' + options.field + '"/>')
            //         .appendTo(container)
            //         .kendoDropDownList({
            //             dataTextField: "kelompokshiftkerja",
            //             dataValueField: "id",
            //             dataSource: $scope.listKelompokShift
            //         });
            // }
            $scope.Save = function (data) {
                var data = {
                    "id": data.id ? data.id : "",
                    "kode": data.kode,
                    "jamkerja": data.jamkerja,
                    "deskripsi": data.deskripsi,
                    "statusenabled": true,
                    "jammasuk": data.jammasuk,
                    "jampulang": data.jampulang,
                }
                medifirstService.post("sdm/save-jam-kerja", data).then(function (e) {
                    $scope.refresh();
                });
            }
            $scope.Batal = function () {
                $scope.item = undefined;
            }
            var timeoutPromise;
            $scope.$watch('items.kodeKerja', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('kode', newVal)
                    }
                }, 800)
            });
            $scope.$watch('items.jamKerja', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('jamkerja', newVal)
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
