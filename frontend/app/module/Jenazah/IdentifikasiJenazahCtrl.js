define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('IdentifikasiJenazahCtrl', ['$mdDialog','CacheHelper', '$scope', '$state', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, $state, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.cari = true;
        $scope.identifikasi = false;
        loadCombo()

        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisBencana = dat.data.jenisbencana
            })
        }
        function loadAntemortem() {
            debugger
            medifirstService.get('jenazah/dvi/get-antemortem?jenisbencana='+ $scope.item.jenisbencana.id).then(function(dat) {
                debugger
                $scope.listNoregistrasi = dat.data
            })
        }
        function loadPostmortem() {
            medifirstService.get('jenazah/dvi/get-identifikasi-postmortem?jenisbencana='+ $scope.item.jenisbencana.id).then(function(dat) {
                debugger
                $scope.listLabelDvi = dat.data
            })
        }
        $scope.cari22 = function() {
            debugger
            if ($scope.item.jenisbencana == undefined) {
                toastr.error('Pilih Dahulu Jenis Bencana !')
                return
            }
            loadAntemortem()
            loadPostmortem()
            $scope.cari = false;
            $scope.identifikasi = true;
        }
        $scope.cariDataAntemortem = function() {
            medifirstService.get('jenazah/dvi/get-foto-identifikasi-antemortem?noregistrasi='+$scope.item.noregistrasi.noregistrasi).then(function(dat) {
                debugger 
                if (dat.data.length > 0) {
                    $scope.images3 = [];
                    var fotopostmortem = dat.data
                    for (let i = 0; i < fotopostmortem.length; i++) {
                        $scope.images3.push({
                            dataURL3: fotopostmortem[i].foto
                        });
                    }
                } else {
                    toastr.error('Foto tidak ada !')
                    // return
                }
                medifirstService.get('jenazah/dvi/get-data-identifikasi-antemortem?noregistrasi='+$scope.item.noregistrasi.noregistrasi).then(function(dat) {
                var antemortem = dat.data
                $scope.sourceAntemortem = new kendo.data.DataSource({
                    data: antemortem,
                    group: $scope.group,
                    pageSize: 50,
                    // total: laporan.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                });
                })
                $scope.columnAntemortem = {
                    toolbar: [
                        "excel",
                    ],
                    excel: { fileName: "LaporanAkhirDVI.xlsx", allPages: true, },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 3;
                        sheet.mergedCells = ["A1:F1"];
                        sheet.name = "Orders";
    
                        var myHeaders = [{
                            value: "Laporan Akhir DVI",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
                        }];
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    },
                    sortable: true,
                    pageable: true,
                    selectable: "row",
                    columns: [
    
                        // { field: "no", title: "No", width: "45px" },
                        {
                            field: "namadilaporkan",
                            title: "Nama Korban",
                            width: "50px",
                        },
                        {
                            field: "ciricirifisik",
                            title: "Ciri Ciri Fisik",
                            width: "50px",
                        },
                        {
                            field: "barangkepemilikan",
                            title: "Barang Kepemilikan",
                            width: "50px",
                        },
                        // {
                        //     field: "sumbersidikjari",
                        //     title: "Sumber Sidik Jari",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "uraiansidikjari",
                        //     title: "Uraian Sidik Jari",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "keterangansidikjari",
                        //     title: "Keterangan Sidik Jari",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "sumbergigi",
                        //     title: "Sumber Gigi",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "uraiangigi",
                        //     title: "Uraian Gigi",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "keterangangigi",
                        //     title: "Keterangan Gigi",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "sumberdna",
                        //     title: "Sumber DNA",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "uraiandna",
                        //     title: "Uraian DNA",
                        //     width: "50px",
                        // },
                        // {
                        //     field: "keterangandna",
                        //     title: "Keterangan DNA",
                        //     width: "50px",
                        // }
                    ]
                }
                $scope.fotoantemortem = true;
            })
        }
        $scope.cariDataPostmortem = function() {
            medifirstService.get('jenazah/dvi/get-foto-identifikasi-postmortem?labeldvi='+$scope.item.labeldvi.norec).then(function(dat) {
                debugger 
                if (dat.data.length > 0) {
                    $scope.images4 = [];
                    var fotopostmortem = dat.data
                    for (let i = 0; i < fotopostmortem.length; i++) {
                        $scope.images4.push({
                            dataURL4: fotopostmortem[i].foto
                        });
                    }
                } else {
                    toastr.error('Foto tidak ada !')
                    // return
                }
                medifirstService.get('jenazah/dvi/get-data-identifikasi-postmortem?norec='+$scope.item.labeldvi.norec).then(function(dat) {
                    var postmortem = dat.data
                    $scope.sourcePostmortem = new kendo.data.DataSource({
                        data: postmortem,
                        group: $scope.group,
                        pageSize: 50,
                        // total: laporan.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                    });
                    })
                    $scope.columnPostmortem = {
                        toolbar: [
                            "excel",
                        ],
                        excel: { fileName: "LaporanAkhirDVI.xlsx", allPages: true, },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 3;
                            sheet.mergedCells = ["A1:F1"];
                            sheet.name = "Orders";
        
                            var myHeaders = [{
                                value: "Laporan Akhir DVI",
                                fontSize: 20,
                                textAlign: "center",
                                background: "#ffffff",
                            }];
                            sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                        },
                        sortable: true,
                        pageable: true,
                        selectable: "row",
                        columns: [
        
                            // { field: "no", title: "No", width: "45px" },
                            {
                                field: "cirikhusus",
                                title: "Ciri Khusus",
                                width: "50px",
                            },
                            {
                                field: "barangbukti",
                                title: "Barang Bukti",
                                width: "50px",
                            },
                            {
                                field: "keterangan",
                                title: "Keterangan",
                                width: "50px",
                            },
                        ]
                    }
                $scope.fotopostmortem = true;
            })
        }
        $scope.simpan = function() {
            debugger
            var save = {
                noregistrasi: $scope.item.noregistrasi.noregistrasi,
                nolabeldvi: $scope.item.labeldvi.labeldvi,
                norecpostmortem: $scope.item.labeldvi.norec,
                keterangan: $scope.item.keterangan,
                jenisbencana: $scope.item.jenisbencana.id
            }
            medifirstService.post('jenazah/dvi/save-identifikasi-jenazah', save).then(function(e) {

            })
        }
        $scope.testing = function() {
            medifirstService.get('jenazah/dvi/get-laporan-akhir?').then(function(dat) {
                debugger;
            })
        }
        $scope.kembali = function() {
            $scope.cari = true;
            $scope.identifikasi = false;
            $state.go('IdentifikasiJenazah')
        }
        $scope.batal22 = function() {
            $scope.cari = true;
            $scope.identifikasi = false;
        }
    }
])
})