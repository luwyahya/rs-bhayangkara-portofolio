define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterMenuGiziCtrl', ['$scope', 'MedifirstService',
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
                // $scope.listJenisDiet = data.data.jenisdiet
                $scope.listBentukProduk = data.data.produk 
                // $scope.listKategory = data.data.kategorydiet
                // $scope.listJenisWaktu = data.data.jeniswaktu
                // $scope.listKelas = data.data.kelas
                $scope.listProduk =data.data.produkmenu 
                $scope.listProdukDefault = data.data.produkmenu 
            })

            function loadData() {
                $scope.isRouteLoading = true;
                var menu = "";
                if($scope.item.produk == undefined)
                {
                    menu = "" ;
                }else{
                    menu = $scope.item.produk;
                }
                
              
               medifirstService.get("sysadmin/master/get-daftar-menu-gizi?menu=" + menu ).then(function (data) {
                    $scope.isRouteLoading = false;
                    // for (var i = 0; i < data.data.data.length; i++) {
                    //     data.data.data[i].no = i + 1
                    // }
                    // $scope.listDiagnosaKep = data.data.data
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        group: $scope.group,
                        pageSize: 20,
                        total: data.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    Menu: { editable: false, type: "string" },
                                }
                            }
                        }
                    });

                })
            }
            function dynamicEditors(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="berat" data-bind="value:berat">');
                input.appendTo(container);
                // }
            };


            $scope.group = {
                field: "Menu",
                "title": "Menu",
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
                editable: true,
                columns: [
                 
                    {
                        "field": "id",
                        "title": "id",
                        "width": "20px"
                    }, {
                        "field": "Menu",
                        "title": "Menu",
                        "width": "40px"
                    }, {

                        "field": "Bahan",
                        "title": "Produk",
                        "width": "50px"
                        
                    },{

                        "field": "berat",
                        "title": "Berat Kotor",
                        "width": "50px",
                        editor: dynamicEditors
                    },{

                        "field": "Satuan",
                        "title": "Satuan Kecil",
                        "width": "50px"
                    },
                    {
                        "command": [
                            {
                                text: "Hapus",
                                click: hapusData,
                                imageClass: "k-icon k-delete"
                            },{
                                text: "Simpan",
                                click: update,
                                imageClass: "k-icon k-update"
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

                if ($scope.popUp.bentukProduk == undefined || $scope.popUp.bentukProduk == ""){
                    toastr.error('Menu belum di pilih')
                    return
                }
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Produk belum di pilih')
                    return
                }
                var arraySave = []
                for (let i = 0; i < $scope.arrayProdukTemp.length; i++) {
                    const element = $scope.arrayProdukTemp[i];
                   
                        arraySave.push({
                            "produkfk": element.id
                        })
                  
                }
                console.log(arraySave)
                // return

                var objSave = {
                    "satatusenabled": 1,
                    "produkdetailfk": $scope.popUp.bentukProduk != undefined ? $scope.popUp.bentukProduk.id : null, 
                                     
                    "details": arraySave
                    // id, satatusenabled, kodeexternal, namaexternal, produkdetailfk, produkheadfk
                }
                medifirstService.post('sysadmin/master/save-menu-gizi', objSave).then(function (e) {
                    loadData();
                    $scope.arrayProdukTemp = []
                    $scope.listProduk = $scope.listProdukDefault
                    $scope.Clear();
                    $scope.clearProdukGet();
                //      $scope.popUp.siklusKe=undefined ;
                //     $scope.popUp.jenisDiet=undefined ;
                //      $scope.popUp.jensiWaktu=undefined ;
                //      $scope.popUp.kategory = undefined ;
                //    $scope.popUp.bentukProduk = undefined ;
                    

                })

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

                medifirstService.post('sysadmin/master/delete-Menu-gizi', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })

            }
                function update(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var objSave = {
                    "id": dataItem.id,
                    "berat" : dataItem.berat
                }

                medifirstService.post('sysadmin/master/updateberat-menu-gizi', objSave).then(function (e)  {
                    if (e.status === 201) {
                        loadData();
                        // grid.removeRow(row);
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