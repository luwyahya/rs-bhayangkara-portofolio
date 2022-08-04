define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ObjekModulAplikasiCtrl', ['$scope', '$timeout', 'MedifirstService',
        function ($scope, $timeout, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = true;
            function modulAplikasiHeadDropdown(container, options) {
                $('<input style="width:240px" name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: "objekmodulaplikasi",
                        dataValueField: "id",
                        dataSource: $scope.listModulAplikasi,
                        filter: "contains"
                    });
            }
            function noUrutEditor(container, options) {
                $('<input name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoNumericTextBox({
                        decimals: 0
                    });
            }
            function textareaNameEditor(container, options) {
                $('<textarea name="' + options.field + '" cols="20" row="4" style="line-height: 1.4em;"></textarea>')
                    .appendTo(container)
            }
            $scope.optionGrid = {
                toolbar: [{
                    name: "create", text: "Input Baru"
                }],
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},

                    { field: "objekmodulaplikasi", title: "Nama Objek Modul Aplikasi " },
                    {
                        field: "objekModulAplikasiHead", title: "Objek Modul Aplikasi Head",
                        editor: modulAplikasiHeadDropdown,
                        "template": "# if (objekModulAplikasiHead != undefined) {# #= objekModulAplikasiHead.objekmodulaplikasi # #} else {# #= '-' # #}#"
                    },
                    { field: "alamaturlform", title: "Alamat Web", attributes: { style: "text-align:right; padding-right: 15px;" } },
                    { field: "keterangan", title: "Deskripsi Objek", editor: textareaNameEditor },
                    { field: "fungsi", title: "Fungsi Objek", editor: textareaNameEditor },
                    { field: "nourut", title: "No Urut" },
                    // { field: "statusenabled", title: "Status Enabled", width: 100, attributes: { style: "text-align:right; padding-right: 15px;"}},
                    { command: [{ name: "destroy", text: "Hapus" }, { name: "edit", text: "Edit" }], title: "&nbsp;", width: 160 }
                ],
                editable: "popup",
                save: function (e) {
                    $scope.Save(e.model);
                },
                edit: function (e) {
                    e.sender.columns.forEach(function (element, index /*, array */) {
                        if (element.hideMe) {
                            e.container.find(".k-edit-label:eq(" + index + "), "
                                + ".k-edit-field:eq( " + index + ")"
                            ).hide();
                        }
                    });
                }
            };
            init();
            // $scope.Cancel = function(){
            // 	delete $scope.item;
            // 	$scope.item = {};
            // }
            // $scope.Delete = function(){
            // 	ManageSdm.getOrderList("/jabatan/delete-jabatan/?id=" + $scope.item.id, true).then(function (dat) {        
            // 		init();
            // 	});
            // };
            function init() {
                $scope.item = {}; // set defined object
                medifirstService.get("sysadmin/menu/get-daftar-objek-modul-aplikasi", true).then(function (dat) {
                    $scope.listModulAplikasi = dat.data.data
                    var data2 = $scope.listModulAplikasi
                    var data = $scope.listModulAplikasi
                    for (let i = 0; i < data.length; i++) {
                        // data[i].modulAplikasiHead = []
                        for (let z = 0; z < data2.length; z++) {
                            if (data[i].kdobjekmodulaplikasihead == data2[z].id) {
                                data[i].objekModulAplikasiHead = data2[z]
                                break
                            }

                        }
                    }
                    console.log(data)
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data,
                        // sort: {
                        // 	field: "namaJabatan", 
                        // 	dir: "asc"
                        // },
                        pageSize: 20,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: { editable: false },
                                    objekmodulaplikasi: {
                                        editable: true, validation: {
                                            validasimodulaplikasi: function (input) {
                                                if (input.is("[name='objekmodulaplikasi']") && input.val() === "") {
                                                    return false;
                                                }
                                                return true;
                                            }
                                        }
                                    },
                                    nourut: { editable: true,
                                        // type: "number"
                                      },
                                    alamaturlform: { editable: true },
                                    fungsi: { editable: true },
                                    keterangan: { editable: true },
                                    objekModulAplikasiHead: {
                                        editable: true
                                    },
                                    // jumlahch: { type: "number" },
                                }
                            }
                        },
                        change: function (e) {
            
                            if (e.action == "itemchange") {
                                e.items[0].objekModulAplikasiHead = e.items[0].objekModulAplikasiHead.id ? e.items[0].objekModulAplikasiHead.id : e.items[0].objekModulAplikasiHead;
                            }
                            if (e.action === "remove") {
                                var item = e.items[0];
                                if (item.objekmodulaplikasi !== "") {
                                    item.action = e.action;
                                    item.objekModulAplikasiHead = item.objekModulAplikasiHead!= undefined ? item.objekModulAplikasiHead.id : item.objekModulAplikasiHead;
                                    $scope.Save(item);
                                    //$scope.Disabling(e.items[0]);
                                } else {
                                    $scope.dataSource.sync(); // call sync function to auto update row number w/o click on grid
                                }
                            }
                        }
                    });

                    $scope.isRouteLoading = false;
                }, (error) => {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            };

            $scope.Save = function (data) {
                var item = {
                    id: data.id,
                    statusenabled: true,
                    objekModulAplikasiHead: data.objekModulAplikasiHead,
                    objekmodulaplikasi: data.objekmodulaplikasi,
                    alamaturlform: data.alamaturlform !='' ?  data.alamaturlform : null,
                    fungsi: data.fungsi ,
                    keterangan: data.keterangan,
                    nourut: parseInt(data.nourut),
                }
                if (data.action && data.action === "remove") item.statusenabled = false;
                medifirstService.post('sysadmin/menu/save-objek-modul-aplikasi', item).then(function (e) {
                    // delete $scope.item;
                    // $scope.item = {};
                    init();
                }, function(error){
                    init();
                });
            };

            var timeoutPromise;
            $scope.$watch('item.modulAplikasiHead', function (newVal, oldVal) {
                if (newVal && newVal.id && newVal !== oldVal) {
                    applyFilter("modulAplikasiHead", newVal)
                }
            })
            $scope.$watch('item.modulAplikasi', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("objekmodulaplikasi", newVal)
                    }
                }, 500)
            })
            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridID").data("kendoGrid");
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
                var dataGrid = $("#gridID").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item = {};
            }
        }
    ]);
});