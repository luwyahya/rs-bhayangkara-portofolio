
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarMapRuanganToProdukCtrl', ['$state', '$scope', '$mdDialog', 'MedifirstService',
        function ($state, $scope, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.now = new Date();
            $scope.chkBool = true;
            $scope.showIdMenu = true
            DataCombo()
            $scope.null = function () {
                $scope.item = {};
            }

            function DataCombo() {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/master/get-data-combo-master", true).then(function (dat) {
                    $scope.listDepartement = dat.data.departemen;
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-produk", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });                       

                $scope.isRouteLoading = false;
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var ins = ""
                var tempInstalasiIdArr = {};
                if ($scope.item.departemen != undefined) {
                    var ins = "&deptId=" + $scope.item.departemen.id
                    tempInstalasiIdArr = { id: $scope.item.departemen.id, departemen: $scope.item.departemen.departemen }
                }

                var ruanganId = ""
                var tempRuanganIdArr = {};
                if ($scope.item.ruangan != undefined) {
                    var ruanganId = "&ruangan=" + $scope.item.ruangan.id
                    tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
                }

                var kdproduk = "";
                if ($scope.item.Produk !== undefined) {
                    kdproduk = "&kdproduk=" + $scope.item.Produk;
                }

                var isEksekutif = ''
                if ($scope.item.Eksekutif == true) {
                    isEksekutif = "&isExsekutif=" + " E";
                }

                medifirstService.get("sysadmin/master/get-data-mapping-ruangan-to-produk?"
                    + ins + ruanganId + kdproduk + isEksekutif, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                            datas[i].statCheckbox = false;
                        }
                        $scope.dataSource = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.RuanganToDepartement = function () {
                $scope.listruangan = $scope.item.departemen.ruangan
            }

            $scope.active = true;
            $scope.detailjenisToProduk = function () {
                ////debugger
                $scope.KondisiCariSimpan = false;
                medifirstService.get("sysadmin/master/get-produkbyIdformap?iddjenis=" + $scope.item.detailjenis.id, true).then(function (dat) {
                    $scope.daftarProduk = dat.data;
                    var daftarProduk = dat.data;
                    for (var i = 0; i < daftarProduk.length; i++) {
                        daftarProduk[i].statCheckbox = false;
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        pageSize: 50,
                        data: daftarProduk,
                        $scrollable: true,
                        total: daftarProduk.length
                    });
                    var grid = $('#kGrid').data("kendoGrid");
                    grid.setDataSource($scope.dataSource);
                    grid.refresh();
                    if ($scope.item.detailjenis.id != undefined) {
                        $scope.active = false
                    } else {
                        $scope.active = true
                    }
                    if ($scope.item.ruangan != undefined) {
                        $scope.ruangan();
                    }

                });
            }

            $scope.SearchData = function () {
                LoadData();
            }

            $scope.mainGridOptions = {
                editable: "popup",
                pageable: true,
                //scrollable: true,
                // height: 300,
                selectable: "row",
                columns: $scope.columnProduk,
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startsWith: "Cari Produk",                            
                        }
                    }
                },
            };

            $scope.columnProduk = [
                {
                    "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    template: "# if (statCheckbox) { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                        "# } else { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                        "# } #",
                    width: "50px"
                },
                {
                    "field": "id",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Id</center>",
                    "width": "85px"

                },
                {
                    "field": "idproduk",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Id Produk</center>",
                    "width": "85px"

                },
                {
                    "field": "statusenabled",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Statusenabled</center>",
                    "width": "100px",
                    "template": '# if( statusenabled==1) {# Aktif # } else {# Tidak Aktif #} #'

                },
                {
                    "field": "namaproduk",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Nama Produk</center>",
                    "width": "350px"

                },
                {
                    "field": "namaruangan",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Nama Ruangan</center>",
                    "width": "350px"

                }
            ];

            $scope.enableData = function () {
                var data = [];
                for (var i = 0; i < $scope.dataSource._data.length; i++) {
                    if ($scope.dataSource._data[i].statCheckbox) {
                        data.push({
                            "id": $scope.dataSource._data[i].id,
                            "statusenabled": true,
                        })
                    }
                }

                var data = {
                    "data": data,
                }

                medifirstService.post('sysadmin/master/mapping-ruangan-to-produk-disable', data).then(function (e) {
                    LoadData();
                })

            }
            $scope.disableData = function () {
                var data = [];
                for (var i = 0; i < $scope.dataSource._data.length; i++) {
                    if ($scope.dataSource._data[i].statCheckbox) {
                        data.push({
                            "id": $scope.dataSource._data[i].id,
                            "statusenabled": false,
                        })
                    }
                }

                var data = {
                    "data": data,
                }

                medifirstService.post('sysadmin/master/mapping-ruangan-to-produk-disable', data).then(function (e) {
                    LoadData();
                })

            }

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataSource._data, function (data) {
                    return data.id == dataItem.id;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }
                $scope.tempCheckbox = dataSelect.statCheckbox;                
            }


            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataSource._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }
                // UbahGrid(tempData);
                reloaddataSourceGrid(tempData);
            }

            function reloaddataSourceGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: true,
                });
                var grid = $('#kGrid').data("kendoGrid");
                grid.setDataSource(newDs);
                grid.refresh();
            }            

            // function onSelect(e) {
            //     $scope.data4 = [];
            //     manageLogistikPhp.getDataTableMaster("produk/jenis-produk/" + $scope.item.idModul, true).then(function (dat) {
            //         //debugger //if (dat.data.length != 0) {
            //         for (var i = 0; i < dat.data.length; i++) {
            //             dat.data[i].no = i + 1;
            //         }
            //         $scope.data4 = dat.data;
            //         $scope.showIdMenu = true
            //     });
            // }


            $scope.delete = function () {
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah anda yakin akan menghapus data tsb?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    SokDelete();
                })

            }

            function SokDelete() {
                var data = [];
                for (var i = 0; i < $scope.dataSource._data.length; i++) {
                    if ($scope.dataSource._data[i].statCheckbox) {
                        data.push({
                            "id": $scope.dataSource._data[i].id,
                            "idproduk": $scope.dataSource._data[i].idproduk,
                            "namaproduk": $scope.dataSource._data[i].namaproduk,
                            "ruanganid": $scope.dataSource._data[i].ruanganid,
                            "namaruangan": $scope.dataSource._data[i].namaruangan,
                            "kodeexternal": $scope.dataSource._data[i].kodeexternal,
                        })
                    }
                }

                var data = {
                    "data": data,
                }

                medifirstService.post('sysadmin/master/delete-mapping-ruangan-to-produk',data).then(function (e) {
                    LoadData();
                    // kosongkan();
                });
            }

            function kosongkan() {
                $scope.item.departemen = undefined;
                $scope.item.ruangan = undefined;
                $scope.item.Produk = undefined;
            }

            $scope.ClearData = function () {
                kosongkan()
            }

            $scope.reset = function () {
                var AllRowsToBeDel = $scope.dataSource._data == "";
                UbahGrid(AllRowsToBeDel);
                $scope.active = true;
                $scope.null();
            }

            $scope.NewMapping = function () {
                $state.go('MapRuanganToProduk');
            }
        }
    ]);
});

