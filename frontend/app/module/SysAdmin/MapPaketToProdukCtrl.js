define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapPaketToProdukCtrl', ['$scope', 'MedifirstService',
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
            medifirstService.get("sysadmin/get-combo-paket").then(function (data) {
                $scope.listPaket = data.data.paket
                $scope.listProduk = data.data.produk
                $scope.listProdukDefault = data.data.produk
            })

            function loadData() {
                $scope.isRouteLoading = true;

                var paketId = ""
                if ($scope.item.namaPaket != undefined) {
                    paketId = "&paketId=" + $scope.item.namaPaket.id
                }
                var namaProduk = ""
                if ($scope.item.produk != undefined) {
                    namaProduk = "&namaProduk=" + $scope.item.produk
                }

                medifirstService.get("sysadmin/get-mapping-paket?"
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
            $scope.getProdukByPaket = function (paket) {
                $scope.arrayProdukTemp = []
                medifirstService.get("sysadmin/get-mapping-paket?paketId="
                    + paket.id).then(function (e) {

                        // $scope.listTempProduk = []
                        // var name = $scope.popUp.cariProduk.toLowerCase()
                        // for (let i = 0; i < $scope.listProdukDefault.length; i++) {
                        //     var arr = $scope.listProdukDefault[i].namaproduk.toLowerCase()
                        //     if (arr.indexOf(name) != -1) {
                        //         $scope.listTempProduk.push($scope.listProdukDefault[i])
                        //     }
                        // }
                        var data = []
                        for (let i = 0; i < e.data.data.length; i++) {
                            const element = e.data.data[i];
                            data.push({ id: element.objectprodukfk, namaproduk: element.namaproduk })

                        }
                        $scope.listProduk = []

                        $scope.arrayProdukTemp = data
                        $scope.listProduk = $scope.listProdukDefault
                        if ($scope.arrayProdukTemp.length > 0) {
                            for (let i = 0; i < $scope.listProduk.length; i++) {
                                const element = $scope.listProduk[i];
                                element.isChecked = false
                                for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
                                    const elements = $scope.arrayProdukTemp[j];
                                    if (element.id == elements.id) {
                                        element.isChecked = true
                                        element.style = "bold-produk"
                                    }
                                }
                            }
                        }
                    })

            }

            $scope.group = {
                field: "namapaket",

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
                        "width": "2%",
                        "title": "✔"
                    },
                    {
                        "field": "namapaket",
                        "title": "Nama Paket",
                        "width": "40%"
                    },
                    {

                        "field": "namaproduk",
                        "title": "Produk",
                        "width": "50%"
                    },
                    // {
                    //     "command": [

                    //         {
                    //             text: "Hapus",
                    //             click: hapusData,
                    //             imageClass: "k-icon k-delete"
                    //         }],
                    //     title: "",
                    //     width: "20px",
                    // }

                ]
            };

            $scope.Tambah = function () {
                $scope.arrayProdukTemp = []
                $scope.popUps.center().open();
            }
            $scope.save = function () {

                if ($scope.popUp.namaPaket == undefined) {
                    toastr.error('Nama Paket belum dipilih')
                    return
                }
                // if ($scope.popUp.jenisDiet == undefined) {
                //     toastr.error('Jenis Diet belum di pilih')
                //     return
                // }
                // if ($scope.popUp.jensiWaktu == undefined) {
                //     toastr.error('Jenis Waktu belum di pilih')
                //     return
                // }
                // if ($scope.arrayKelasCek.length == 0) {
                //     toastr.error('Kelas belum di pilih')
                //     return
                // }
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Produk belum di pilih')
                    return
                }
                // var arraySave = []
                // for (let i = 0; i < $scope.arrayProdukTemp.length; i++) {
                //     const element = $scope.arrayProdukTemp[i];
                //     for (let j = 0; j < $scope.arrayKelasCek.length; j++) {
                //         const elements = $scope.arrayKelasCek[j];
                //         arraySave.push({
                //             "produkfk": element.id,
                //             "kelasfk": elements.id
                //         })
                //     }
                // }
                // console.log(arraySave)
                // return

                var objSave = {
                    "paketId": $scope.popUp.namaPaket.id,
                    // "objectjenisdietfk": $scope.popUp.jenisDiet.id,
                    // "objectkelasfk": $scope.popUp.kelas.id,
                    // "objectjeniswaktufk": $scope.popUp.jensiWaktu.id,
                    // "objectkategoryprodukfk": $scope.popUp.kategory != undefined ? $scope.popUp.kategory.id : null,
                    // "objectbentukprodukfk": $scope.popUp.bentukProduk != undefined ? $scope.popUp.bentukProduk.id : null,
                    "details": $scope.arrayProdukTemp
                }
                medifirstService.post('sysadmin/save-map-paket-to-produk', objSave).then(function (e) {
                     medifirstService.postLogging('Paket Tindakan', 'norec idpaket', e.data.data.objectpaketfk,
                        'Simpan Paket ' + ' dengan No Id Paket - ' + e.data.data.objectpaketfk + ' pada Id Map '
                        + e.data.data.id).then(function (res) {
                        })

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
                var data2 =''
                for (let i = 0; i < $scope.selectedData.length; i++) {
                    const element = $scope.selectedData[i];
                    data.push({id:element.id})
                    data2 = data2 +', '+element.namaproduk +'('+ element.namapaket+')';
                }
                var itemDelete = {
                    "data": data
                }
                medifirstService.post('sysadmin/delete-map-paket-to-produk', itemDelete).then(function (e) {
                     medifirstService.postLogging('Paket Tindakan', 'norec idpaket','',
                        'Hapus Paket ' + ' dengan Paket - ' +data2).then(function (res) {
                        })
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

                managePhp.postData2('sysadmin/delete-map-paket-to-produk', itemDelete).then(function (e) {
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
                    var arr = $scope.listProdukDefault[i].namaproduk.toLowerCase()
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
            // $scope.ceklisOne = function (bool, data) {
            //     var index = $scope.arrayProdukTemp.indexOf(data);
            //     if (_.filter($scope.arrayProdukTemp, {
            //         id: data.id
            //     }).length === 0 && bool)

            //         $scope.arrayProdukTemp.push(data);
            //     else
            //         $scope.arrayProdukTemp.splice(index, 1);
            //     // }
            // }
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