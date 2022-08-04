define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPenerimaanJenazahDviCtrl', ['$mdDialog','CacheHelper', '$scope', '$state', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, $state, medifirstService, dateHelper, $window) {
        $scope.dataVOloaded = true;
        $scope.item = {};
        $scope.dataSelectedJenazah = {};
        $scope.isRouteLoading = true;

        loadCombo()

        function loadCombo() {
            medifirstService.get('jenazah/get-data-for-combo').then(function(dat) {
                $scope.listJenisBencana = dat.data.jenisbencana
                $scope.item.jenisbencana = { id: dat.data.jenisbencana[0].id, jenisbencana: dat.data.jenisbencana[0].jenisbencana }
                loadData()
            })
        }
        $scope.cari = function () {
            loadData()
        }
        function loadData() {
            var jenisbencana = '';
            if ($scope.item.jenisbencana != undefined) {
                jenisbencana = "jenisbencana=" + $scope.item.jenisbencana.id
            } else {
                jenisbencana = '';
            }
            medifirstService.get('jenazah/dvi/get-laporan-penerimaan-jenazah-dvi?' + jenisbencana).then(function(data) {
                $scope.isRouteLoading = false;
                var laporan = data.data
                $scope.sourceLaporanJenazah = new kendo.data.DataSource({
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
            $scope.formatTanggal = function(tanggal){
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.columnLaporanJenazah = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanPenerimaanJenazah.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:F1"];
                    sheet.name = "Laporan";

                    var myHeaders = [
                        {
                            value: "LAPORAN PENERIMAAN JENAZAH",
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
                        "field": "nojenazah",
                        "title": "No Jenazah",
                        "width": "50px",
                    },
                    {
                        "field": "nobodybag",
                        "title": "No Body Bag",
                        "width": "50px",
                    },
                    {
                        "field": "bodybag",
                        "title": "Body Bag",
                        "width": "50px",
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "50px",
                    },
                    {
                        "field": "jenisbencana",
                        "title": "Jenis Bencana",
                        "width": "50px",
                    },
                    {
                        "field": "tglterima",
                        "title": "Tgl Terima",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglterima #')}}</span>"
                    },
                ]
            }
        }
    }
])
})