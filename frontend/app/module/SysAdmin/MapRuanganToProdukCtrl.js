
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapRuanganToProdukCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.now = new Date();
            $scope.treeDataMenu = [];
            $scope.chkBool = true;
            $scope.showIdMenu = true;
            $scope.active = true;            
            FormLoad();

            function FormLoad() {
                medifirstService.get("sysadmin/master/get-data-combo-master", true).then(function (dat) {
                    $scope.listDepartement = dat.data.departemen;
                });
                var idKlmpokProduk = "";
                medifirstService.get("sysadmin/master/get-kelompok-produk?idKlmpokProduk=" + idKlmpokProduk, true).then(function (dat) {
                    $scope.item.idModul = dat.data[0].id;
                    $scope.item.kelompokproduk = dat.data[0].kelompokproduk;
                    $scope.listkelompok = dat.data;

                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: dat.data,
                        schema: {
                            model: {
                                children: ""
                            }
                        }
                    });
                    $scope.treeDataMenu = inlineDefault
                    $scope.mainTreeViewOption = {
                        dataTextField: ["kelompokproduk"],
                        select: onSelect,
                        dragAndDrop: true
                    }

                });                           
            }

            $scope.RuanganToDepartement = function () {
                $scope.listruangan = $scope.item.departemen.ruangan                
            }

            $scope.null = function () {
                $scope.item = {};
            }
            
            // $scope.ruangan = function () {                
            //     medifirstService.get("sysadmin/master/get-produkbyIdformap?idruang=" + $scope.item.ruangan.id, true).then(function (dat) {                    
            //         var daftarProduk = dat.data;                    
            //         for (var i = 0; i < daftarProduk.length; i++) {
            //             var idx = daftarProduk[i].id;
            //             for (var y = 0; y < $scope.dataSource._data.length; y++) {
            //                 if ($scope.dataSource._data[y].id != idx) {
            //                     $scope.dataSource._data[y].statCheckbox = false;
            //                 }
            //             }
            //         }

            //         //Run To statcheckbox = True
            //         var TempValidasi = [];
            //         for (var i = 0; i < daftarProduk.length; i++) {
            //             var idx = daftarProduk[i].id;
            //             for (var y = 0; y < $scope.dataSource._data.length; y++) {
            //                 //debugger
            //                 if ($scope.dataSource._data[y].id == idx) {
            //                     $scope.dataSource._data[y].statCheckbox = true;
            //                     var hello = $scope.dataSource._data[y].statCheckbox;
            //                     var dataTemp = {
            //                         "status": hello,
            //                         "idStatus": $scope.dataSource._data[y].id
            //                     }
            //                     TempValidasi.push(dataTemp)
            //                 }

            //             }
            //         }
            //         $scope.TempValidasi = TempValidasi;
            //         UbahGrid($scope.dataSource._data);
            //     });
            // }
            
            $scope.detailjenisToProduk = function () {               
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

            $scope.Cari = function () {                
                $scope.KondisiCariSimpan = true;
                var NamaProduk;
                if ($scope.item.Produk === undefined) {
                    NamaProduk = "";
                } else {
                    NamaProduk = $scope.item.Produk
                }//produk/list-produk?nmProduk=
                medifirstService.get('sysadmin/master/list-produk?nmProduk=' + NamaProduk).then(function (e) {                 
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].statCheckbox = false;
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: e.data,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    kdproduk: { editable: false, type: "number" },
                                    kdbarcode: { editable: false, type: "number" },
                                    deskripsiproduk: { editable: false, type: "string" },
                                    namaproduk: { editable: false, type: "string" }
                                }
                            }
                        },
                        pageSize: 20,
                    });

                    if ($scope.item.Produk != undefined) {
                        $scope.active = false
                    } else {
                        $scope.active = true
                    }

                    if ($scope.item.ruangan != undefined) {
                        $scope.ruangan();
                    }
                })

            }

            $scope.CariKodeProduk = function () {                
                $scope.KondisiCariSimpan = true;
                var IdProduk;
                if ($scope.item.IdProduk === undefined) {
                    IdProduk = "";
                } else {
                    IdProduk = $scope.item.IdProduk
                }//produk/list-produk?nmProduk=
                medifirstService.get('sysadmin/master/list-produk?kdProduk=' + IdProduk).then(function (e) {                 
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].statCheckbox = false;
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: e.data,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    kdproduk: { editable: false, type: "number" },
                                    kdbarcode: { editable: false, type: "number" },
                                    deskripsiproduk: { editable: false, type: "string" },
                                    namaproduk: { editable: false, type: "string" }
                                }
                            }
                        },
                        pageSize: 20,
                    });

                    if ($scope.item.Produk != undefined) {
                        $scope.active = false
                    } else {
                        $scope.active = true
                    }

                    if ($scope.item.ruangan != undefined) {
                        $scope.ruangan();
                    }
                })

            }

            $scope.mainGridOptions = {
                editable: "popup",
                pageable: true,
                //scrollable: true,
                height: 300,
                selectable: "row",
                columns: $scope.columnProduk,
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startsWith: "Cari Produk",
                            // eq: "Is equal to",
                            // neq: "Is not equal to"
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
                    "title": "<center style='font-size: 14px; font-weight: bold'>Id Produk</center>",
                    "width": "85px"

                },
                {
                    "field": "namaproduk",
                    "title": "<center style='font-size: 14px; font-weight: bold'>Nama Produk</center>",
                    "width": "350px"

                }
            ];           

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

                UbahGrid($scope.dataSource._data);

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
                UbahGrid(tempData);
            }

            function UbahGrid(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: false,
                });

                var grid = $('#kGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();
                $scope.dataVOloaded = true;
            }

            $scope.jenis = function () {
                medifirstService.get("sysadmin/master/get-jenis-produk?kelompokProdukfk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                    $scope.listjenisProduk = dat.data;
                })
            }

            $scope.detailjenis = function () {            
                medifirstService.get("sysadmin/master/get-detail-jenis-produk?jenisProdukId=" + $scope.item.jenis.id, true).then(function (dat) {
                    $scope.listdetailjenisProduk = dat.data;
                })
            }                      

            function onSelect(e) {
                $scope.data4 = [];
                medifirstService.get("sysadmin/master/get-detail-jenis-produk?jenisProdukId=" + $scope.item.idModul, true).then(function (dat) {                                    
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1;
                    }
                    $scope.data4 = dat.data;
                    $scope.showIdMenu = true
                });
            }


            $scope.Simpan = function () {               
                var data = [];
                for (var i = 0; i < $scope.dataSource._data.length; i++) {
                    if ($scope.KondisiCariSimpan == true && $scope.TempValidasi != 0 && $scope.TempValidasi != undefined) {
                        for (var y = 0; y < $scope.TempValidasi.length; y++) {
                            ////debugger
                            if ($scope.TempValidasi[y].idStatus == $scope.dataSource._data[i].id && $scope.dataSource._data[i].statCheckbox == false) {
                                alert("Simpan Gagal, Tidak Boleh Uncheck yang sudah di mapping melalui pencarian!")
                                $scope.item.kelompokproduk = "";
                                $scope.item.jenis = "";
                                $scope.item.detailjenis = "";
                                return $scope.ruangan();
                            } else {
                                if ($scope.dataSource._data[i].statCheckbox) {
                                    data.push({
                                        "idproduk": $scope.dataSource._data[i].id,
                                        "idruangan": $scope.item.ruangan.id,
                                        "kodeexternal": $scope.item.kodeExternal != undefined ? $scope.item.kodeExternal : ''
                                    })
                                }
                            }
                        }
                    } else {
                        if ($scope.dataSource._data[i].statCheckbox) {
                            data.push({
                                "idproduk": $scope.dataSource._data[i].id,
                                "idruangan": $scope.item.ruangan.id,
                                "kodeexternal": $scope.item.kodeExternal != undefined ? $scope.item.kodeExternal : ''
                            })
                        }
                    }
                }

                if ($scope.KondisiCariSimpan == false) {
                    // manageLogistikPhp.saveDataProduk(data, "produk/add-produktoruangan").then(function (e) {
                    //     
                    // });
                    var objSave = {
                        'is_search' : null,
                        'data' : data
                    }

                    medifirstService.post('sysadmin/master/save-data-mapproduktoruangan', objSave).then(function (e) {
                        console.log(e.data);
                    })
                } else {

                    var objSave = {
                        'is_search' : 1,
                        'data' : data
                    }

                    medifirstService.post('sysadmin/master/save-data-mapproduktoruangan', objSave).then(function (e) {
                        console.log(e.data);
                    })
                    // manageLogistikPhp.saveDataProduk(data, "produk/add-produktoruangan/1").then(function (e) {
                    //     console.log(e.data);
                    // });
                }
            }

            $scope.reset = function () {
                var AllRowsToBeDel = $scope.dataSource._data == "";
                UbahGrid(AllRowsToBeDel);
                $scope.active = true;
                $scope.null();
            }
        }
    ]);
});

