define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanReleaseDviCtrl', ['$mdDialog','CacheHelper', '$scope', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.isRouteLoading = true;
        $scope.now = new Date();

        loadCombo()
        loadData()

        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisBencana = dat.data.jenisbencana2
            })
        }
        function loadData() {
            var jenisbencana = '';
            if ($scope.item.jenisbencana != undefined) {
                jenisbencana = 'jenisbencana=' + $scope.item.jenisbencana.id
            } else {
                jenisbencana = ''
            }

            medifirstService.get('jenazah/dvi/get-release-dvi?' + jenisbencana).then(function(data) {
                debugger
                for (var i = 0; i < data.data.length; i++) {
                var tanggal = $scope.now;
                var tanggalLahir = new Date(data.data[i].tgllahir);
                var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                data.data[i].umurs = umurs.year + ' Tahun '
                }
                $scope.isRouteLoading = false;
                var laporan = data.data
                $scope.sourceLaporanRelease = new kendo.data.DataSource({
                    data: laporan,
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
            })
        }
        
        $scope.formatTanggal = function(tanggal){
            return moment(tanggal).format('DD-MMM-YYYY');
        }
        $scope.columnLaporanRelease = {
            toolbar: [
                "excel",
            ],
            excel: {
                fileName: "LaporanPenerimaanRelease.xlsx",
                allPages: true,
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                sheet.frozenRows = 2;
                sheet.mergedCells = ["A1:I1"];
                sheet.name = "Laporan";

                var myHeaders = [
                    {
                        value: "LAPORAN RELEASE",
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                    }
                ];
                sheet.rows.splice(0,0, {cells: myHeaders, type: "header", height: 50});
            },
            scrollable: true,
            selectable: "row",
            pageable: true,
            columns: [
                {
                    "field": "tglteridentifikasi",
                    "title": "Tgl Teridentifikasi",
                    "width": "50px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglteridentifikasi #')}}</span>"
                },
                {
                    "field": "tglrelease",
                    "title": "Tgl Release",
                    "width": "50px",
                    // "template": "<span class='style-right'>{{formatTanggal('#: tglrelease #')}}</span>"
                },
                {
                    "field": "noregistrasiantemortem",
                    "title": "No Registrasi",
                    "width": "50px",
                },
                {
                    "field": "namabin",
                    "title": "Nama",
                    "width": "50px",
                },
                {
                    "field": "umurs",
                    "title": "Umur",
                    "width": "50px",
                },
                {
                    "field": "keluarga",
                    "title": "Keluarga",
                    "width": "50px",
                },
                {
                    "field": "notelepon",
                    "title": "No Telepon",
                    "width": "50px",
                },
                {
                    "field": "tujuan",
                    "title": "Tujuan",
                    "width": "50px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "50px",
                },
            ]
        }
        $scope.cari = function () {
            loadData()
        }
        /*Batas Suci*/
    }
])
})