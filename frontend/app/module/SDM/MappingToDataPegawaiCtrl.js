define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MappingToDataPegawaiCtrl', ['$mdDialog', 'CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog, cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.now = new Date();
        $scope.dataSelectedMapping = {}
        $scope.dataSelectedMappingKalak = {}
        var mapping = [];
        loadData()
        loadDataKalak()
        loadCombo()
        loadKedudukan()

        function loadCombo() {
            medifirstService.get("sdm/get-data-combo-sdm").then(function(dat) {
                var combo = dat.data
                $scope.listPegawai = combo.pegawai
            })
        }
        function loadData() {
            medifirstService.get("sdm/get-vic-to-data-pegawai").then(function(data) {
                mapping = data.data
                for (var i = 0; i < mapping.length; i++) {
                    mapping[i].no = i + 1;
                }
                $scope.sourceMapping = new kendo.data.DataSource({
                    data: mapping,
                    pageSize: 50,
                    total: data.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }
                });
                $scope.columnMapping = {
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "50px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Nama VIC",
                            "width": "150px"
                        },
                        {
                            "command": [
                                { text: "Hapus", click: Hapus, imageClass: "k-icon k-i-delete" },
                            ],
                            title: "",
                            width: "185px",
                        }
                    ]
                }
            })
        }
        $scope.simpan = function() {
            debugger
            if ($scope.item.namapegawai == undefined) {
                alert('Isi dulu mas nama pegawainya')
                return
            }
            for (var i = 0; i < mapping.length; i++) {
                if ($scope.item.namapegawai.id == mapping[i].objectpegawaifk) {
                    alert('Pegawai ini udah jadi vic mas gausah diinput 2 kali')
                    return
                }
            }
            var objSave = {
                "idPegawai": $scope.item.namapegawai.id
            }
            medifirstService.post("sdm/save-mapping-vic", objSave).then(function(dat) {
                $scope.item.namapegawai = undefined
                loadData();
            })
        }
        function Hapus(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            debugger

            if (!dataItem) {
                toastr.error("Data Tidak Ditemukan");
                return;
            }

            var itemDelete = {
                "norec": dataItem.norec,
            }

            medifirstService.post('sdm/delete-vic', itemDelete).then(function(e) {
                if (e.status === 201) {
                    loadData();
                }
            })
        }
        function loadDataKalak() {
            var nama = ""
            if ($scope.item.namakalak != undefined) {
                nama = "nama=" + $scope.item.namakalak
            }
            medifirstService.get("sdm/get-kalak-ruangan?" + nama).then(function(data) {
                debugger
                var kalak = data.data.data
                for (var i = 0; i < kalak.length; i++) {
                    kalak[i].no = i + 1;
                }
                $scope.sourceMappingKalak = new kendo.data.DataSource({
                    data: kalak,
                    pageSize: 100,
                    total: data.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }
                });
                $scope.columnMappingKalak = {
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "50px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Nama Kalak",
                            "width": "150px"
                        },
                        {
                            "field": "namaruangan",
                            "title": "Ruangan",
                            "width": "150px"
                        },
                    ]
                }
            })
        }
        function loadAnggota () {
            medifirstService.get("sdm/get-anggota?idKalak=" + $scope.dataSelectedMappingKalak.idpegawai).then(function(data) {
                debugger
                var anggota = data.data
                for (var i = 0; i < anggota.length; i++) {
                    anggota[i].no = i + 1;
                }
                $scope.sourceAnggota = new kendo.data.DataSource({
                    data: anggota,
                    pageSize: 50,
                    total: data.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }
                });
                $scope.columnAnggota = {
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "50px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Nama Anggota",
                            "width": "150px"
                        },
                        {
                            "command": [
                                { text: "Hapus", click: HapusAnggota, imageClass: "k-icon k-i-delete" },
                            ],
                            title: "",
                            width: "185px",
                        }
                    ]
                }
            })
        }
        $scope.klik = function (dataSelectedMappingKalak) {
            loadAnggota()
        }
        $scope.tambahanggota = function() {
            if ($scope.dataSelectedMappingKalak.idpegawai == undefined) {
                toastr.error('Pilih Kalak Terlebih Dahulu !')
                return
            }
            if ($scope.item.namaanggota == undefined) {
                alert('Anggotanya belum dipilih mas')
                return
            }

            var objSave = {
                "idKalak": $scope.dataSelectedMappingKalak.idpegawai,
                "idAnggota": $scope.item.namaanggota.id
            }
            medifirstService.post("sdm/save-anggota-kalak", objSave).then(function(e) {
                loadAnggota()
                $scope.item.namaanggota = undefined
            })
        }
        function HapusAnggota(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            debugger

            if (!dataItem) {
                toastr.error("Data Tidak Ditemukan");
                return;
            }

            var itemDelete = {
                "norec": dataItem.norec,
            }

            medifirstService.post('sdm/delete-anggota', itemDelete).then(function(e) {
                if (e.status === 201) {
                    loadAnggota();
                }
            })
        }
        $scope.cariKalak = function () {
            loadDataKalak()
        }
        
        $scope.cariLah = function () {
            loadKedudukan()
        }
        function loadKedudukan() {

            var namapegawai = ''
            if ($scope.item.namaPegawai != undefined) {
                namapegawai = "&namaPegawai=" + $scope.item.namaPegawai
            }
            var namauser = ''
            if ($scope.item.namaUser != undefined) {
                namauser = "&namaUser=" + $scope.item.namaUser
            }

            medifirstService.get('sdm/get-kedudukan-pegawai?top=50' + namapegawai + namauser).then(function(dat) {
                var kedudukan = dat.data
                $scope.sourceKedudukan = new kendo.data.DataSource({
                    data: kedudukan,
                    pageSize: 50,
                    total: kedudukan.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }
                });
            })
            $scope.columnKedudukan = {
                scrollable: true,
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "namalengkap",
                        "width": "30%",
                        "title": "Nama Pegawai"
                    },
                    {
                        "field": "namauser",
                        "width": "30%",
                        "title": "Nama User"
                    },
                    {
                        "field": "kedudukan",
                        "width": "30%",
                        "title": "Kedudukan Pegawai"
                    }
                ]
            }
        }
        $scope.gaskeunlah = function () {
            if ($scope.dataSelectedKedudukan.idPegawai == undefined) {
                toastr.error('Pilih dulu lah datanya, masa iya gak dipilih')
                return
            }
            var objSave = {
                "idPegawai": $scope.dataSelectedKedudukan.idPegawai
            }
            medifirstService.post('sdm/save-kedudukan-pegawai', objSave).then(function(e) {
                loadKedudukan()
            })
        }
    }
])
})