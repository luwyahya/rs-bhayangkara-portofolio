define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterRuanganCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
        function ($rootScope, $scope, medifirstService, $window, $timeout) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.dept = {};
            $scope.isRouteLoading = false;

            loadCombo();
            // loadData();
            $scope.Search = function () {
                loadData()
            }
            $scope.SearchDept = function () {
                loadDataDept()
            }
            $scope.Search = function () {
                loadData()
            }
            $scope.SearchNakes = function () {
                loadNakes()
            }
            $scope.onTabChanges = function (e) {
                if (e == 1) {
                    loadDataDept()
                } else if (e == 2) {
                    loadData()
                } else {
                    loadNakes()
                }
            }

            $scope.Clear = function () {
                delete $scope.item.id
                delete $scope.item.kdRuangan
                delete $scope.item.namaRuangan
                delete $scope.item.Departemen
                delete $scope.popUp.id
                delete $scope.popUp.Ruangan
                delete $scope.popUp.Departemen
                delete $scope.popUp.namaEksternal
            }


            function loadCombo() {
                medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listdataDepartemen = data;
                });
            }
            function loadData() {
                $scope.isRouteLoading = true;
                var id = ""
                if ($scope.item.id != undefined) {
                    id = "&id=" + $scope.item.id
                }
                var kdRuangan = ""
                if ($scope.item.kdRuangan != undefined) {
                    kdRuangan = "&kdRuangan=" + $scope.item.kdRuangan
                }
                var namaRuangan = ""
                if ($scope.item.namaRuangan != undefined) {
                    namaRuangan = "&namaRuangan=" + $scope.item.namaRuangan
                }
                var idDept = ""
                if ($scope.item.Departemen != undefined) {
                    idDept = "&idDept=" + $scope.item.Departemen.value
                }
                medifirstService.get("sysadmin/master/get-daftar-master-ruangan?"
                    + kdRuangan
                    + namaRuangan
                    + idDept
                    + id).then(function (data) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < data.data.data.length; i++) {
                            data.data.data[i].no = i + 1
                        }
                        $scope.dataSource = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 10,
                            total: data.data.data.length,
                            serverPaging: false,


                        });



                    })
            }
            $scope.columnGrid = {
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],

                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "<h3 align=center>No</h3>",
                    "width": "23px",
                    "attributes": { align: "center" }

                },
                // {
                //     "field": "id",
                //     "title": "<h3 align=center>ID</h3>",
                //     "width": "50px"
                // },
                // {
                //     "field": "statusenabled",
                //     "title": "<h3 align=center>Statusenabled</h3>",
                //     "width": "80px"
                // },
                // {
                // 	"field": "kdkategorydiet",
                // 	"title": "<h3 align=center>Kode Kategory Diet</h3>",
                // 	"width": "80px"
                // },

                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "150px"
                },
                {
                    "field": "namadepartemen",
                    "title": "Departemen",
                    "width": "100px"
                },
                {
                    "field": "namaexternal",
                    "title": "Nama Eksternal",
                    "width": "80px"
                },
                {
                    "field": "ihs_id",
                    "title": "IHS ID",
                    "width": "150px"
                },
                {
                    "command": [{
                        text: "Hapus",
                        click: hapusData,
                        imageClass: "k-icon k-delete"
                    }, {
                        text: "Edit",
                        click: editData,
                        imageClass: "k-icon k-i-pencil"
                    }, {
                        text: "IHS",
                        click: sendIHS,
                        imageClass: "k-icon fa fa-send"
                    }],
                    title: "",
                    width: "130px",
                }

                ]
            };
            function sendIHS(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                // if (dataItem.ihs_id != null) {
                //     toastr.error('Data Sudah di kirim ke IHS')
                //     return
                // }
                let json = {
                    "id_ru": dataItem.id
                }
                $scope.isRouteLoading = true
                medifirstService.postNonMessage('bridging/ihs/Location', json).then(function (z) {
                    $scope.isRouteLoading = false
                    // toastr.info(JSON.stringify(z.data))
                    loadData()
                })
            }

            $scope.toolsIHSRu = function (e) {
                $scope.isRouteLoading = true;
                if (e.ihs_id == null) return
                let data = {
                    "url": "Location/" + e.ihs_id,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.toolsIHS = function (e) {
                $scope.isRouteLoading = true;
                if (e.ihs_id == null) return
                let data = {
                    "url": "Organization/" + e.ihs_id,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.tutupJson = function () {
                $scope.popUpJson.close()
            }
            $scope.Tambah = function () {
                $scope.popUp.center().open();
            }

            $scope.save = function () {
                var id = ""
                if ($scope.popUp.id != undefined)
                    id = $scope.popUp.id

                var namaEksternal = ""
                if ($scope.popUp.namaEksternal != undefined)
                    namaEksternal = $scope.popUp.namaEksternal

                var namaRuangan = ""
                if ($scope.popUp.Ruangan != undefined)
                    namaRuangan = $scope.popUp.Ruangan


                var idDept = null
                if ($scope.popUp.Departemen != undefined)
                    idDept = $scope.popUp.Departemen.value

                var objSave = {
                    "id": id,
                    // "kdkategorydiet" :kodeKategoryDiet,
                    "namaexternal": namaEksternal,
                    "namaruangan": namaRuangan,
                    "objectdepartemenfk": idDept,
                    "ihs_id": $scope.popUp.ihs_id ? $scope.popUp.ihs_id : null
                }
                medifirstService.post('sysadmin/master/save-data-master-ruangan', objSave).then(function (res) {
                    loadData();
                    $scope.Clear();
                })

            }

            // $scope.klikGrid= function(dataSelected){
            // 	// $scope.popUp.id =dataSelected.id
            // 	// $scope.popUp.kdJenisDiet =dataSelected.kdjenisdiet
            // 	// $scope.popUp.jenisDiet= dataSelected.jenisidiet
            // 	// $scope.popUp.kelompokProduk={id:dataSelected.objectkelompokprodukfk,kelompokproduk:dataSelected.kelompokproduk}
            // 	// $scope.popUp.Keterangan= dataSelected.keterangan


            // }

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

                medifirstService.post('sysadmin/master/delete-data-master-ruangan', itemDelete).then(function (res) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })

            }

            function editData(e) {
                $scope.Clear();
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                medifirstService.get("sysadmin/master/get-daftar-master-ruangan?id=" + dataItem.id).then(function (e) {

                })
                $scope.popUp.id = dataItem.id
                $scope.popUp.Ruangan = dataItem.namaruangan
                $scope.popUp.namaEksternal = dataItem.namaexternal
                $scope.popUp.ihs_id = dataItem.ihs_id
                if (dataItem.objectdepartemenfk != null) {
                    $scope.popUp.Departemen = { value: dataItem.objectdepartemenfk, namadepartemen: dataItem.namadepartemen }
                }


                $scope.popUp.center().open();

            }

            $scope.tutup = function () {
                $scope.popUp.close();

            }
            function loadDataDept() {
                $scope.isRouteLoading = true;

                var qDept = ""
                if ($scope.item.qDept != undefined) {
                    qDept = "&namaDepartemen=" + $scope.item.qDept
                }
                medifirstService.get("sysadmin/master/get-daftar-master-departemen?"
                    + qDept
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataSourceDept = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        total: data.data.data.length,
                        serverPaging: false,

                    });

                })
            }

            $scope.columnGridDept = {
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="Tambahdept()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],


                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },
                {
                    "field": "namadepartemen",
                    "title": "Nama Departemen",
                    "width": "150px"
                },
                {
                    "field": "namaexternal",
                    "title": "Nama External",
                    "width": "100px"
                },
                {
                    "field": "ihs_id",
                    "title": "IHS ID",
                    "width": "150px"
                },
                {
                    "command": [{
                        text: "Hapus",
                        click: hapusDataDept,
                        imageClass: "k-icon k-delete"
                    }, {
                        text: "Edit",
                        click: editDataDept,
                        imageClass: "k-icon k-i-pencil"
                    }, {
                        text: "IHS",
                        click: sendIHSDept,
                        imageClass: "k-icon fa fa-send"
                    }],
                    title: "",
                    width: "130px",
                }

                ]
            };
            function sendIHSDept(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                // if (dataItem.ihs_id != null) {
                //     toastr.error('Data Sudah di kirim ke IHS')
                //     return
                // }
                let json = {
                    "id_dept": dataItem.id
                }
                $scope.isRouteLoading = true
                medifirstService.postNonMessage('bridging/ihs/Organization', json).then(function (z) {
                    // toastr.info(JSON.stringify(z.data))
                    $scope.isRouteLoading = false
                    loadDataDept()
                })
            }

            function hapusDataDept(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var itemDelete = {
                    "id": dataItem.id
                }

                medifirstService.post('sysadmin/master/delete-data-master-departemen', itemDelete).then(function (res) {
                    if (e.status === 201) {
                        loadDataDept();
                        grid.removeRow(row);
                    }
                })

            }

            function editDataDept(e) {
                $scope.Clear();
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                medifirstService.get("sysadmin/master/get-daftar-master-departemen?id=" + dataItem.id).then(function (e) {

                })
                $scope.dept.idDept = dataItem.id
                $scope.dept.namadepartemen = dataItem.namadepartemen
                $scope.dept.namaexternal = dataItem.namaexternal
                $scope.dept.ihs_id = dataItem.ihs_id
                $scope.popUpDept.center().open();

            }
            $scope.saveDept = function () {
                if (!$scope.dept.namadepartemen) {
                    toastr.error('Departemen harus di isi')
                    return
                }
                var objSave = {
                    "id": $scope.dept.idDept ? $scope.dept.idDept : '',
                    "namadepartemen": $scope.dept.namadepartemen,
                    "namaexternal": $scope.dept.namaexternal ? $scope.dept.namaexternal : null,
                    "ihs_id": $scope.dept.ihs_id ? $scope.dept.ihs_id : null
                }
                medifirstService.post('sysadmin/master/save-data-master-departemen', objSave).then(function (res) {
                    loadDataDept();
                    $scope.dept = {}
                })
            }
            $scope.tutupDept = function () {
                $scope.popUpDept.close();
            }
            $scope.Tambahdept = function () {
                delete $scope.dept.idDept
                $scope.popUpDept.center().open();
            }
            $scope.columnGridNakes = {

                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },
                {
                    "field": "namalengkap",
                    "title": "Nama ",
                    "width": "150px"
                },
                {
                    "field": "noidentitas",
                    "title": "No Identitas",
                    "width": "100px"
                },
                {
                    "field": "jenispegawai",
                    "title": "Jenis Pegawai",
                    "width": "100px"
                },
                {
                    "field": "ihs_id",
                    "title": "IHS ID",
                    "width": "150px"
                },
                {
                    "command": [{
                        text: "Edit",
                        click: editDataNakes,
                        imageClass: "k-icon k-i-pencil"
                    }, {
                        text: "IHS",
                        click: sendIHSNakes,
                        imageClass: "k-icon fa fa-send"
                    }],
                    title: "",
                    width: "100px",
                }

                ]
            };
            $scope.nakes = {}
            function editDataNakes(e) {
                $scope.Clear();
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                medifirstService.get("sysadmin/master/get-daftar-master-departemen?id=" + dataItem.id).then(function (e) {

                })
                $scope.nakes.idPeg = dataItem.id
                $scope.nakes.namalengkap = dataItem.namalengkap
                $scope.nakes.noidentitas = dataItem.noidentitas
                $scope.nakes.ihs_id = dataItem.ihs_id
                $scope.popUpNakes.center().open();

            }
            $scope.saveNakes = function () {
                if (!$scope.nakes.idPeg) {
                    toastr.error('Pegawai harus di isi')
                    return
                }
                var objSave = {
                    "id": $scope.nakes.idPeg,
                    "noidentitas": $scope.nakes.noidentitas,
                    "ihs_id": $scope.nakes.ihs_id ? $scope.nakes.ihs_id : null
                }
                medifirstService.post('sysadmin/master/save-data-master-pegawai', objSave).then(function (res) {
                    loadNakes();
                    $scope.nakes = {}
                })
            }
            $scope.tutupNkaes = function () {
                $scope.popUpNakes.close();
            }

            function sendIHSNakes(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.ihs_id != null) {
                    toastr.error('Data Sudah di kirim ke IHS')
                    return
                }
                let json = {
                    "id_nakes": dataItem.id
                }
                $scope.isRouteLoading = true
                medifirstService.postNonMessage('bridging/ihs/Practitioner', json).then(function (z) {
                    toastr.info(JSON.stringify(z.data))
                    $scope.isRouteLoading = false
                    loadNakes()
                })
            }
            function loadNakes() {
                $scope.isRouteLoading = true;

                var qid = ""
                if ($scope.item.qid != undefined) {
                    qid = "&id_ihs=" + $scope.item.qid
                }
                var qpegawai = ""
                if ($scope.item.qpegawai != undefined) {
                    qpegawai = "&namalengkap=" + $scope.item.qpegawai
                }
                var qnik = ""
                if ($scope.item.qnik != undefined) {
                    qnik = "&nik=" + $scope.item.qnik
                }
                medifirstService.get("sysadmin/master/get-daftar-master-pegawai?"
                    + qpegawai
                    + qid
                    + qnik
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataSourceNakes = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        total: data.data.data.length,
                        serverPaging: false,

                    });

                })
            }


        }
    ]);
});

