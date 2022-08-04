define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapKelompokTransaksiToBkuCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.item.jmlRow = 100;
            $scope.arrayProdukTemp = []
            $scope.isRouteLoading = false;

            loadData();
            $scope.Search = function () {
                loadData()
            }
            $scope.Clear = function () {
                $scope.item = {
                    jmlRow: 100
                }
                $scope.popUp = {}

                loadData()

            }
            $scope.SearchEnter = function () {
                loadData()
            }
            medifirstService.get("sysadmin/get-combo-mkttbku").then(function (data) {
                $scope.listPaket = data.data.paket;
                $scope.listProduk = data.data.produk;
                $scope.listProdukDefault = data.data.produk;
                $scope.listKlmpkTransaksi =  data.data.produk;
            })

            function loadData() {
                $scope.isRouteLoading = true;

                var paketId = ""
                if ($scope.item.namaPaket != undefined) {
                    paketId = "&idBku=" + $scope.item.namaPaket.id
                }
                var namaProduk = ""
                if ($scope.item.KlmpkTrans != undefined) {
                    namaProduk = "&idTransaksi=" + $scope.item.KlmpkTrans.id
                }

                medifirstService.get("sysadmin/get-mapping-mkttbku?"
                    + paketId
                    + namaProduk

                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    // $scope.listDiagnosaKep = data.data.data
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        group: $scope.group,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                })
            }
            // $scope.getProdukByPaket = function (paket) {
            //     $scope.arrayProdukTemp = []
            //     medifirstService.get("sysadmin/get-mapping-mkttbku?paketId="
            //         + paket.id).then(function (e) {
            //             var data = []
            //             for (let i = 0; i < e.data.data.length; i++) {
            //                 const element = e.data.data[i];
            //                 data.push({ id: element.kelompoktransaksifk, namaproduk: element.kelompoktransaksi })

            //             }
            //             $scope.listProduk = []

            //             $scope.arrayProdukTemp = data
            //             $scope.listProduk = $scope.listProdukDefault
            //             if ($scope.arrayProdukTemp.length > 0) {
            //                 for (let i = 0; i < $scope.listProduk.length; i++) {
            //                     const element = $scope.listProduk[i];
            //                     element.isChecked = false
            //                     for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
            //                         const elements = $scope.arrayProdukTemp[j];
            //                         if (element.id == elements.id) {
            //                             element.isChecked = true
            //                             element.style = "bold-produk"
            //                         }
            //                     }
            //                 }
            //             }
            //         })
            // }

            $scope.group = {
                field: "bku",
            };
            $scope.selectedData = [];
            $scope.onClick = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrids").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData, function (e) {
                        return e.id == dataItem.id;
                    });
                    if (result.length == 0) {
                        $scope.selectedData.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData.length; i++)
                            if ($scope.selectedData[i].id === dataItem.id) {
                                $scope.selectedData.splice(i, 1);
                                break;
                            }
                        $scope.selectedData.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData.length; i++)
                        if ($scope.selectedData[i].id === dataItem.id) {
                            $scope.selectedData.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.columnGrid = {
                selectable: 'row',
                pageable: true,
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },
                    {
                        name: "delete", text: "Hapus",
                        template: '<button ng-click="hapusData()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-cancel"></span>Hapus</button>'
                    },
                ],
                columns: [
                    {
                        "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                        "width": "7%",
                        "title": "✔"
                    },
                    {
                        "field": "bku",
                        "title": "Nama BKU",
                        "width": "40%"
                    },
                    {

                        "field": "kelompoktransaksi",
                        "title": "Transaksi",
                        "width": "80%"
                    },                    
                ]
            };

            $scope.Tambah = function () {
                $scope.arrayProdukTemp = []
                $scope.arrayKelasCek = []
                $scope.popUps.center().open();
            }
            $scope.save = function () {

                if ($scope.popUp.namaPaket == undefined) {
                    toastr.error('Nama BKU belum dipilih')
                    return
                }
                
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Kelompok Transaksi belum di pilih')
                    return
                }            

                var objSave = {
                    "idBku": $scope.popUp.namaPaket.id,                    
                    "details": $scope.arrayProdukTemp
                }
                medifirstService.post('sysadmin/save-data-mkttbku', objSave).then(function (e) {
                    loadData();
                    $scope.arrayProdukTemp = []
                    $scope.listProduk = $scope.listProdukDefault
                    $scope.arrayKelasCek = []
                    $scope.Clear();
                })

            }

            $scope.hapusData = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error('Ceklis data yang mau dihapus')
                    return
                }
                var data = []
                for (let i = 0; i < $scope.selectedData.length; i++) {
                    const element = $scope.selectedData[i];
                    data.push({id:element.id})
                }
                var itemDelete = {
                    "data": data
                }
                medifirstService.post('sysadmin/delete-data-mkttbku', itemDelete).then(function (e) {

                    loadData();

                })
            }

            function hapusData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var itemDelete = {
                    "id": dataItem.id
                }

                managePhp.postData2('sysadmin/delete-data-mkttbku', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })

            }

            $scope.tutup = function () {
                for (let i = 0; i < $scope.listProduk.length; i++) {
                    const element = $scope.listProduk[i];
                    element.isChecked = false

                }
                $scope.arrayProdukTemp = []
                $scope.popUps.close();
            }

            $scope.cekAll = function (bool) {
                $scope.arrayProdukTemp = []
                if (bool) {
                    $scope.listProduk.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrayProdukTemp.push(e)
                    })
                } else {
                    $scope.listProduk.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrayProdukTemp = []
                    })
                }
                console.log($scope.arrayProdukTemp)
            }
            $scope.cariProduk = function () {

                if ($scope.popUp.cariProduk == undefined || $scope.popUp.cariProduk == "") {
                    $scope.listProduk = $scope.listProdukDefault
                    return
                }

                $scope.listTempProduk = []
                var name = $scope.popUp.cariProduk.toLowerCase()
                for (let i = 0; i < $scope.listProdukDefault.length; i++) {
                    var arr = $scope.listProdukDefault[i].kelompoktransaksi.toLowerCase()
                    if (arr.indexOf(name) != -1) {
                        $scope.listTempProduk.push($scope.listProdukDefault[i])
                    }
                }
                $scope.listProduk = []
                $scope.listProduk = $scope.listTempProduk
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listProduk.length; i++) {
                        const element = $scope.listProduk[i];
                        element.isChecked = false
                        for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
                            const elements = $scope.arrayProdukTemp[j];
                            if (element.id == elements.id) {
                                element.isChecked = true
                            }
                        }
                    }
                }

            }
            $scope.clearProduk = function () {
                delete $scope.popUp.cariProduk
                $scope.listProduk = []
                $scope.listProduk = $scope.listProdukDefault
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listProduk.length; i++) {
                        const element = $scope.listProduk[i];
                        element.isChecked = false
                        for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
                            const elements = $scope.arrayProdukTemp[j];
                            if (element.id == elements.id) {
                                element.isChecked = true
                            }
                        }
                    }
                }
            }
                        
            $scope.ceklisOne = function (bool, data) {
                if (bool) {
                    $scope.listProduk.forEach(function (e) {
                        if (data.id == e.id && bool == e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                    })
                } else {
                    $scope.listProduk.forEach(function (e) {
                        if (data.id== e.id && bool == e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                    })
                }

                // }
                console.log($scope.arrayProdukTemp)
            }
            $scope.arrayKelasCek = []
            $scope.ceklisOneKelas = function (bool, data) {
                if (bool) {
                    $scope.listKelas.forEach(function (e) {
                        if (data.id == e.id && bool == e.isChecked) {
                            e.isChecked = false
                            $scope.arrayKelasCek.splice(e, 1);

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = true
                            $scope.arrayKelasCek.push(e)

                        }
                    })
                } else {
                    $scope.listKelas.forEach(function (e) {
                        if (data.id == e.id && bool == e.isChecked) {
                            e.isChecked = true
                            $scope.arrayKelasCek.push(e)

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = false
                            $scope.arrayKelasCek.splice(e, 1);

                        }
                    })
                }

                // }
                console.log($scope.arrayKelasCek)
            }
            // intervensi

        }
    ]);
});