define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterSiklusGiziRevCtrl', ['$scope', 'MedifirstService',
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
                // $scope.popUp = {}

                loadData()

            }
            $scope.SearchEnter = function () {
                loadData()
            }
           medifirstService.get("sysadmin/master/get-combo-siklus-gizi").then(function (data) {
                $scope.listJenisDiet = data.data.jenisdiet
                $scope.listBentukProduk = data.data.bentukproduk
                $scope.listKategory = data.data.kategorydiet
                $scope.listJenisWaktu = data.data.jeniswaktu
                $scope.listKelas = data.data.kelas
                $scope.listProduk = data.data.produk
                $scope.listProdukDefault = data.data.produk
            })

            function loadData() {
                $scope.isRouteLoading = true;

                var kelasId = ""
                if ($scope.item.kelas != undefined) {
                    kelasId = "&kelasId=" + $scope.item.kelas.id
                }
                var jenisDietId = ""
                if ($scope.item.jenisDiet != undefined) {
                    jenisDietId = "&jenisDietId=" + $scope.item.jenisDiet.id
                }
                var jenisWaktuId = ""
                if ($scope.item.jenisWaktu != undefined) {
                    jenisWaktuId = "&jenisWaktuId=" + $scope.item.jenisWaktu.id
                }
                var namaProduk = ""
                if ($scope.item.produk != undefined) {
                    namaProduk = "&namaProduk=" + $scope.item.produk
                }
                var jmlRow = ""
                if ($scope.item.jmlRow != undefined) {
                    jmlRow = "&jmlRow=" + $scope.item.jmlRow
                }
                var siklusKe = ""
                if ($scope.item.siklusKe != undefined) {
                    siklusKe = "&siklusKe=" + $scope.item.siklusKe
                }

               medifirstService.get("sysadmin/master/get-daftar-siklus-gizi?"
                    + siklusKe
                    + kelasId
                    + jenisDietId
                    + jenisWaktuId
                    + namaProduk
                    + jmlRow
                    + siklusKe
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

            $scope.group = {
                field: "sikluske",

            };

            $scope.columnGrid = {
                selectable: 'row',
                pageable: true,
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "20px",
                    //     "attributes": { align: "center" }

                    // },
                    {
                        "field": "sikluske",
                        "title": "Siklus Ke",
                        "width": "20px"
                    }, {
                        "field": "jeniswaktu",
                        "title": "Jenis Waktu",
                        "width": "40px"
                    }, {

                        "field": "namaproduk",
                        "title": "Produk",
                        "width": "50px"
                    },
                    {

                        "field": "namakelas",
                        "title": "Kelas",
                        "width": "40px"
                    },
                    {

                        "field": "jenisdiet",
                        "title": "Jenis Diet",
                        "width": "40px"
                    },
                    {

                        "field": "kategorydiet",
                        "title": "Kategory Diet",
                        "width": "40px"
                    },
                    {

                        "field": "namabentukproduk",
                        "title": "Bentuk Produk",
                        "width": "40px"
                    },
                    {
                        "command": [
                            //     {
                            //     text: "Edit",
                            //     click: editData,
                            //     imageClass: "k-icon k-i-pencil"
                            // },
                            {
                                text: "Hapus",
                                click: hapusData,
                                imageClass: "k-icon k-delete"
                            }],
                        title: "",
                        width: "20px",
                    }

                ]
            };

            $scope.Tambah = function () {
                $scope.arrayProdukTemp = []
                $scope.popUps.center().open();
            }
            $scope.save = function () {

                if ($scope.popUp.siklusKe == undefined) {
                    toastr.error('Siklus Ke harus di isi')
                    return
                }
                if ($scope.popUp.jenisDiet == undefined) {
                    toastr.error('Jenis Diet belum di pilih')
                    return
                }
                if ($scope.popUp.jensiWaktu == undefined) {
                    toastr.error('Jenis Waktu belum di pilih')
                    return
                }
                if ($scope.arrayKelasCek.length == 0) {
                    toastr.error('Kelas belum di pilih')
                    return
                }
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Produk belum di pilih')
                    return
                }
                var arraySave = []
                for (let i = 0; i < $scope.arrayProdukTemp.length; i++) {
                    const element = $scope.arrayProdukTemp[i];
                    for (let j = 0; j < $scope.arrayKelasCek.length; j++) {
                        const elements = $scope.arrayKelasCek[j];
                        arraySave.push({
                            "produkfk": element.id,
                            "kelasfk": elements.id
                        })
                    }
                }
                console.log(arraySave)
                // return

                var objSave = {
                    "sikluske": $scope.popUp.siklusKe,
                    "objectjenisdietfk": $scope.popUp.jenisDiet.id,
                    // "objectkelasfk": $scope.popUp.kelas.id,
                    "objectjeniswaktufk": $scope.popUp.jensiWaktu.id,
                    "objectkategoryprodukfk": $scope.popUp.kategory != undefined ? $scope.popUp.kategory.id : null,
                    "objectbentukprodukfk": $scope.popUp.bentukProduk != undefined ? $scope.popUp.bentukProduk.id : null,
                    "details": arraySave
                }
                medifirstService.post('sysadmin/master/save-siklus-gizi', objSave).then(function (e) {
                    loadData();
                    $scope.arrayProdukTemp = []
                    $scope.listProduk = $scope.listProdukDefault
                    $scope.arrayKelasCek = []
                    $scope.Clear();
                     $scope.popUp.siklusKe=undefined ;
                    $scope.popUp.jenisDiet=undefined ;
                     $scope.popUp.jensiWaktu=undefined ;
                     $scope.popUp.kategory = undefined ;
                   $scope.popUp.bentukProduk = undefined ;
                   $scope.clearProdukGet();

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

                medifirstService.post('sysadmin/master/delete-siklus-gizi', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })

            }

            $scope.tutup = function () {
                $scope.arrayProdukTemp = []
                $scope.popUps.close();
                $scope.clearProdukGet();
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
                            else{
                                element.isChecked = false
                            }
                        }
                    }
                }
            }
            $scope.clearProdukGet = function () {
                delete $scope.popUp.cariProduk
                $scope.listProduk = []

                $scope.popUp.cekAll = false
                $scope.listProduk = $scope.listProdukDefault
             
                    for (let i = 0; i < $scope.listProduk.length; i++) {
                        const element = $scope.listProduk[i];
                        element.isChecked = false
                        
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
                        if (data.id == e.id && bool == e.isChecked) {
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