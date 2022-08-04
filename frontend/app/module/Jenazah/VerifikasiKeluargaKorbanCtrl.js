define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('VerifikasiKeluargaKorbanCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.model = {};
        $scope.dataSelectedVerifikasi = {};
        $scope.isRouteLoading = true;
        var norec = '';
        $scope.jenisbencana = true;
        loadData()
        loadCombo()

        $scope.ceklispilihManual = function (bool) {
            if (bool) {
                $scope.jenisbencana = false
                $scope.item.jenisbencana2 = undefined
            }else{
                $scope.jenisbencana = true
            }
        }

        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisBencana = dat.data.jenisbencana2
                $scope.listJenisBencana2 = dat.data.jenisbencana2
            })
        }
        $scope.cari = function () {
            $scope.isRouteLoading = true;
            loadData()
        }

        function loadData() {
            var jenisbencana = ""
            if ($scope.item.jenisbencana2 != undefined) {
                jenisbencana = "jenisbencana=" + $scope.item.jenisbencana2.id
            } else {
                jenisbencana = ""
            }

            var namakorban = ""
            if ($scope.item.namakorban != undefined) {
                namakorban = "&namakorban=" + $scope.item.namakorban
            } else if ($scope.item.namakorban == '') {
                namakorban = ""
            } else {
                namakorban = ""
            }
            var isNotVerif = ""
            if ($scope.model.cekpilihManual == true) {
                isNotVerif = "&isNotVerif=" + true
            } else {
                isNotVerif = ""
            }

            medifirstService.get('jenazah/dvi/get-verifikasi-keluarga?' + jenisbencana + namakorban + isNotVerif).then(function(dat) {
                $scope.isRouteLoading = false;
                var verifikasi = dat.data
                $scope.sourceVerifikasi = new kendo.data.DataSource({
                    data: verifikasi,
                    pageSize: 50,
                    total: dat.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
    
                            }
                        }
                    }
                });
            })
            $scope.columnVerifikasi = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "LaporanVerifikasiKeluargaKorban.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Verifikasi Keluarga Korban",
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
                        field: "namapelapor",
                        title: "Nama Pelapor",
                        width: "80px",
                    },
                    {
                        field: "tglinput",
                        title: "Tgl Input",
                        width: "80px",
                    },
                    {
                        field: "email",
                        title: "Email Pelapor",
                        width: "120px",
                    },
                    {
                        field: "hubungankeluarga",
                        title: "Hubungan Keluarga",
                        width: "50px",
                    },
                    {
                        field: "nohp",
                        title: "No Hp",
                        width: "80px",
                    },
                    {
                        field: "namakorban",
                        title: "Nama Korban",
                        width: "80px",
                    },
                    {
                        field: "namaalias",
                        title: "Nama Alias",
                        width: "80px",
                    },
                    {
                        field: "jeniskelamin",
                        title: "Jenis Kelamin",
                        width: "80px",
                    },
                    {
                        field: "tgllahir",
                        title: "Tgl lahir",
                        width: "80px",
                    },
                    {
                        field: "name",
                        title: "Kebangsaan",
                        width: "80px",
                    },
                    {
                        title: "Lihat Foto File",
                        width: "80px",
                        "template": "<button class=\"k-button custom-button btnBiru\" ng-click=\"lihatFoto(dataItem)\" style=\"margin:0 0 5px\"> Lihat Foto File</button>"
                    },
                    {
                        title: "Status",
                        width: "80px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"status(dataItem)\" style=\"margin:0 0 5px\"> #: status #</button>",
                    }
                ]
            }
        }
        $scope.status = function (dataItem) {
            debugger
            if (dataItem.status == "Belum di Verifikasi") {
                norec = dataItem.norec
                medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                    $scope.item.jenisbencana = {id: dat.data.jenisbencana[0].id, jenisbencana: dat.data.jenisbencana[0].jenisbencana}
                })
                $scope.popUpJenisBencana.center().open();
            } else {
                alert("Kode OTP : " + dataItem.status)
                return;
            }
        }
        $scope.simpan = function () {
            debugger
            var save = {
                jenisbencana: $scope.item.jenisbencana.id,
                norec: norec
            }
            medifirstService.post('jenazah/dvi/save-verifikasi-keluarga-korban', save).then(function(e) {
                loadData()
                $scope.popUpJenisBencana.close()
            })
        }
        $scope.lihatFoto = function (dataItem) {
            debugger
            if (dataItem.gambar == null) {
                toastr.error('Foto Tidak Ada')
                return;
            }
            $scope.images1 = [];
            $scope.images1.push({
                dataURL1: dataItem.gambar
            });
            $scope.popUpFoto.center().open();
        }
        $scope.tutupLihatFoto = function () {
            $scope.popUpFoto.close();
        }
        /* BATAS CUY */
    }
])
})