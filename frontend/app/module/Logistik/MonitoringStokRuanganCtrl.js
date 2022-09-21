define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('MonitoringStokRuanganCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', 'MedifirstService',
        function($rootScope, $scope, ModelItem, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.isReport = true;
            $scope.isSelected = false;
            formLoad();

            function formLoad() {
                $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                $scope.item.tglAkhir = $scope.now;

                if ($scope.item.kelUser === 'logistik' || $scope.item.kelUser === "bagianUmum") {
                    $scope.bukanLogistik = false;
                } else {
                    $scope.bukanLogistik = true;
                }

                $scope.listJenisPemeriksaan = [{ name: "Kelompok Produk", id: 1 }, { name: "Jenis Produk", id: 2 }];

                $scope.item.jmlRows = 10;

                medifirstService.get('logistik/get-combo-logistik').then(function(data) {
                    var dataCombo = data.data;
                    $scope.listKelompokBarang = dataCombo.kelompokproduk2

                    $scope.listJenisProduk = dataCombo.jenisbarang
                    $scope.listRuangan = dataCombo.ruanganall
                })
            }

            $scope.getJenisProduk = function() {
                    var data = []
                    for (let i = 0; i < $scope.listJenisProduk.length; i++) {
                        const element = $scope.listJenisProduk[i];
                        if (element.objectkelompokprodukfk == $scope.item.kelompokBarang.id) {
                            data.push(element)
                        }
                    }

                    $scope.listJenisBarang = data
                }
                // $scope.$watch('item.jenisPermintaan', function (e) {
                //     if (e === undefined) return;
                //     if (e.id === 1) {
                //         $scope.isSelected = true;
                //         $scope.listKelompokBarang = ModelItem.kendoHttpSource('/product/kelompok-produk-have-stok', true);
                //     }

            // })

            $scope.columnFast = [{
                    "field": "produkfk",
                    "title": "Kd Produk",
                    "width": "80px",
                    "template": "<span class='style-center'>#: produkfk #</span>"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Barang",
                    "width": "150px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "150px",
                    "template": "<span class='style-center'>#: namaruangan #</span>"
                },
                {
                    "field": "total",
                    "title": "Jumlah",
                    "width": "80px",
                    "template": "<span class='style-left'>#: total #</span>"
                }

            ];

            $scope.cariFast = function() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                var ruanganId = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var kelProdukId = "";
                if ($scope.item.kelompokBarang != undefined) {
                    kelProdukId = "&idKelProduk=" + $scope.item.kelompokBarang.id;
                }
                var jenisProdukId = "";
                if ($scope.item.jenisProduk != undefined) {
                    jenisProdukId = "&idJenisProduk=" + $scope.item.jenisProduk.id;
                }
                var namaProduk = "";
                if ($scope.item.namaproduk != undefined) {
                    namaProduk = "&namaProduk=" + $scope.item.namaproduk;
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                medifirstService.get('logistik/get-fast-moving?' +
                    "tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir + ruanganId +
                    kelProdukId + jenisProdukId + namaProduk + '&jmlRows=' + jmlRows).then(function(data) {
                    $scope.isRouteLoading = false;
                    var dataGrid = data.data.data;
                    $scope.dataFastMoving = new kendo.data.DataSource({
                        data: dataGrid,
                        group: $scope.group,
                        pageSize: 10,
                        total: dataGrid.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                })
            };

            $scope.mainGridOptions = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Monitoringbarangfastmoving.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Monitoring Barang Fast Moving",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
            }


            $scope.cariSlow = function() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var ruanganId = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var kelProdukId = "";
                if ($scope.item.kelompokBarang != undefined) {
                    kelProdukId = "&idKelProduk=" + $scope.item.kelompokBarang.id;
                }
                var jenisProdukId = "";
                if ($scope.item.jenisProduk != undefined) {
                    jenisProdukId = "&idJenisProduk=" + $scope.item.jenisProduk.id;
                }
                var namaProduk = "";
                if ($scope.item.namaproduk != undefined) {
                    namaProduk = "&namaProduk=" + $scope.item.namaproduk;
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                medifirstService.get('logistik/get-slow-moving?' +
                    "tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir +
                    ruanganId + kelProdukId + jenisProdukId + namaProduk + '&jmlRows=' + jmlRows).then(function(data) {
                    $scope.isRouteLoading = false;
                    var dataGrid = data.data.data;
                    $scope.dataSlowMoving = new kendo.data.DataSource({
                        data: dataGrid,
                        group: $scope.group,
                        pageSize: 10,
                        total: dataGrid.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
            };

            $scope.mainGridOptions2 = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Monitoringbarangslowmoving.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Monitoring Barang Slow Moving",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
            }

            $scope.kl = function(current) {
                $scope.current = current;
                console.log(current);
            };

            $scope.columnSlow = [{
                    "field": "produkfk",
                    "title": "Kd Produk",
                    "width": "80px",
                    "template": "<span class='style-center'>#: produkfk #</span>"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Barang",
                    "width": "150px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "150px",
                    "template": "<span class='style-center'>#: namaruangan #</span>"
                },
                {
                    "field": "total",
                    "title": "Jumlah",
                    "width": "80px",
                    "template": "<span class='style-left'>#: total #</span>"
                }

            ];

            $scope.cetak = function() {
                window.messageContainer.error('Fitur belum tersedia');
            }

            $scope.batal = function() {
                $scope.item = {};
                $scope.item.jmlRows = 10;

                $scope.item.tglAwal = $scope.now;
                $scope.item.tglAkhir = $scope.now;
            }

            $("#tabstrip").kendoTabStrip({
                animation: {
                    open: {
                        effects: "fadeIn"
                    }
                }
            });
            /////////////////////////////////////////////////////////////////////       END         ///////////////////////////////////////////////////////////
        }
    ]);
});