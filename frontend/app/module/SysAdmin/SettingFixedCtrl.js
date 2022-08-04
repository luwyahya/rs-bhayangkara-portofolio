define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SettingFixedCtrl', ['$scope', '$mdDialog', 'MedifirstService',
        function ($scope, $mdDialog, medifirstService) {

            $scope.item = {};
            loadData();


            $scope.search = function () {
                loadData()
            }
            $scope.clear = function () {
                clearItemSearch()
                loadData()
            }
            function clearItemSearch() {
                delete $scope.filterKeterangan
                delete $scope.filterNama
                delete $scope.filterNilai
            }

            function loadData() {
                $scope.isRouteLoading = true;

                var ketFungsi = "";
                if ($scope.filterKeterangan != undefined) {
                    ketFungsi = "&ketFungsi=" + $scope.filterKeterangan
                }
                var namaFild = "";
                if ($scope.filterNama != undefined) {
                    namaFild = "&namaFild=" + $scope.filterNama
                }

                var nilaiField = "";
                if ($scope.filterNilai != undefined) {
                    nilaiField = "&nilaiField=" + $scope.filterNilai
                }
                medifirstService.get("sysadmin/settingdatafixed/get-settingdatafixed?"
                    + nilaiField
                    + ketFungsi
                    + namaFild).then(function (data) {
                        let array = data.data.settingdatafixed
                        if (array.length > 0) {
                            $scope.item.status = []
                            $scope.listGrid = []
                            for (let i = 0; i < array.length; i++) {
                                array[i].no = i + 1
                                let datas = []
                                $scope.listGrid.push(array[i])
                                datas.push(array[i].statusenabled)
                                $scope.item.status[array[i].id] = array[i].statusenabled
                                // console.log(    $scope.item.status)
                            }
                        }

                        $scope.isRouteLoading = false;
                        $scope.dataSource = new kendo.data.DataSource({
                            data: array,
                            pageSize: 10,
                            total: array.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        statusenabled: { type: "boolean" },
                                    }
                                }
                            }
                        });
                    }, function (error) {
                        $scope.isRouteLoading = false;
                    })
            }

            $scope.optionGrid = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="add()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                }],
                selectable: 'row',
                pageable: true,

                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: 15,
                    },
                    {
                        field: "namafield",
                        title: "Nama Field",
                        width: 110,
                    },
                    {
                        field: "nilaifield",
                        title: "Nilai Field",
                        width: 110,
                    },
                    {
                        field: "keteranganfungsi",
                        title: "Deskripsi",
                        width: 100,
                    },
                    {
                        field: "statusenabled",
                        title: "Status Enabled",
                        width: 50,
                        template: "<md-switch  ng-model='#if (statusenabled) { # true # } #'  class='md-primary' aria-label='Switch' />",

                    },
                    {
                        command: [
                            {
                                name: "edit",
                                text: "Edit",
                                click: editData
                            },
                            {
                                text: "Hapus",
                                click: hapus,
                                imageClass: "k-icon k-delete"
                            }
                        ],
                        title: "&nbsp;",
                        width: 60
                    }
                ],
            };
            function editData(e) {
                $scope.item = {}
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                medifirstService.get('sysadmin/settingdatafixed/get-settingdatafixed?idDataFixed=' + dataItem.id).then(function (e) {
                    let data = e.data.settingdatafixed[0]
                    $scope.item.id = data.id
                    $scope.item.namaField = data.namafield
                    $scope.item.nilaiField = data.nilaifield
                    $scope.item.keteranganFungsi = data.keteranganfungsi
                    $scope.item.tabelRelasi = data.tabelrelasi
                    $scope.item.typeField = data.typefield
                    $scope.dialogPopup.center().open()
                })

                // $scope.item.id = dataItem.id
                // $scope.item.namaField = dataItem.namafield
                // $scope.item.nilaiField = dataItem.nilaifield
                // $scope.item.keteranganFungsi = dataItem.keteranganfungsi
                // $scope.item.tabelRelasi = dataItem.tabelrelasi
                // $scope.item.typeField = dataItem.typefield
                $scope.dialogPopup.center().open()
            }
            $scope.editData = function(dataItem) {
                // $scope.item = {}
                // e.preventDefault();
                // var grid = this;
                // var row = $(e.currentTarget).closest("tr");
                // var tr = $(e.target).closest("tr");
                // var dataItem = this.dataItem(tr);
                medifirstService.get('sysadmin/settingdatafixed/get-settingdatafixed?idDataFixed=' + dataItem.id).then(function (e) {
                    let data = e.data.settingdatafixed[0]
                    $scope.item.id = data.id
                    $scope.item.namaField = data.namafield
                    $scope.item.nilaiField = data.nilaifield
                    $scope.item.keteranganFungsi = data.keteranganfungsi
                    $scope.item.tabelRelasi = data.tabelrelasi
                    $scope.item.typeField = data.typefield
                    $scope.dialogPopup.center().open()
                })

                // $scope.item.id = dataItem.id
                // $scope.item.namaField = dataItem.namafield
                // $scope.item.nilaiField = dataItem.nilaifield
                // $scope.item.keteranganFungsi = dataItem.keteranganfungsi
                // $scope.item.tabelRelasi = dataItem.tabelrelasi
                // $scope.item.typeField = dataItem.typefield
                $scope.dialogPopup.center().open()
            }
            $scope.enabledDisabled = function(e){
                medifirstService.get('sysadmin/settingdatafixed/update-status-enabled?id=' + e.id
                +'&statusenabled='+ e.statusenabled).then(function (e) {
                })
            }
            function hapus(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                var objSave = {
                    'id': dataItem.id,
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda Yakin Menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('sysadmin/settingdatafixed/delete', objSave).then(function (e) {
                        $scope.item = {}
                        loadData()
                    }, function (error) {

                    })
                })


            }
           $scope.hapus= function (dataItem) {
                // e.preventDefault();
                // var tr = $(e.target).closest("tr");
                // var dataItem = this.dataItem(tr);
                var objSave = {
                    'id': dataItem.id,
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda Yakin Menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('sysadmin/settingdatafixed/delete', objSave).then(function (e) {
                        $scope.item = {}
                        loadData()
                    }, function (error) {

                    })
                })


            }
            $scope.add = function () {
                $scope.item = {}
                $scope.dialogPopup.center().open()
            }
            $scope.batal = function () {
                $scope.dialogPopup.close()
            }

            $scope.save = function () {
                if ($scope.item.namaField == undefined) {
                    toastr.error("Nama Field harus di isi!")
                    return
                }
                if ($scope.item.nilaiField == undefined) {
                    toastr.error("Nilai Field harus di isi!")
                    return
                }

                var id = "";
                if ($scope.item.id != undefined) {
                    id = $scope.item.id
                }

                var ketFungsi = "";
                if ($scope.item.ketFungsi != undefined) {
                    ketFungsi = $scope.item.ketFungsi
                }

                var tabelRelasi = "";
                if ($scope.item.tabelRelasi != undefined)
                    tabelRelasi = $scope.item.tabelRelasi

                var typeField = "";
                if ($scope.item.typeField != undefined) {
                    typeField = $scope.item.typeField
                }

                var ket = "";
                if ($scope.item.keteranganFungsi != undefined) {
                    ket = $scope.item.keteranganFungsi
                }
                var data = {
                    "iddatafixed": id,
                    "namafield": $scope.item.namaField,
                    "nilai": $scope.item.nilaiField,
                    "tabelrelasi": tabelRelasi,
                    "kodeexternal": null,
                    "namaexternal": null,
                    "reportdisplay": null,
                    "fieldkeytabelrelasi": null,
                    "fieldreportdisplaytabelrelasi": null,
                    "keteranganfungsi": ketFungsi,
                    "typefield": typeField,
                }

                var objSave =
                {
                    datafixed: data
                }

                medifirstService.post('sysadmin/settingdatafixed/post-settingdatafixe', objSave).then(function (e) {
                    loadData()
                    $scope.item = {};

                });
            }
        }
    ]);
});
