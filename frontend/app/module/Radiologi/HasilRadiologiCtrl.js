define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('HasilRadiologiCtrl', ['$scope', '$state', 'MedifirstService', 'CacheHelper',
        function ($scope, $state, medifirstService, cacheHelper) {

            $scope.isRouteLoading = false;
            $scope.norecPD = $state.params.norecPd
            $scope.norecAPD = $state.params.norecApd
            // $scope.shows = 0;
            $scope.item = {
                tglInput : new Date()
            };

            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('chaceHasilRadiologi');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]

                    //    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                    //         $scope.showTombol = true
                    //    }
                }
                // init()
            }
            $scope.noRegistrasi = $state.params.noRegistrasi;
            $scope.noOrder = $state.params.noOrder;


            $scope.result = function () {
                //belum di rapihkan, 2 view yang berbeda
                ///grid untuk di modul app lab khusus
                $scope.group = {
                    field: "Pemeriksaan"
                };

                $scope.ColumnResult = {
                    toolbar: [
                        "excel",
                        {
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Ekspertise</button>'
                }

                    ],
                    excel: {
                        fileName: "HasilLab.xlsx",
                        allPages: true,
                    },

                    excelExport: function (e) {

                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:H1"];
                        sheet.name = "Hasil";

                        var myHeaders = [

                            {
                                value: "Hasil Laboratorium",
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    columns: [{
                        field: "no",
                        title: "No",
                        width: "5%"
                    }, {
                        field: "noFotoRad",
                        title: "No. Foto",
                        width: "15%",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        }
                    }, {
                        field: "tglRadiologi",
                        title: "Tanggal",
                        width: "15%"
                    }, {
                        field: "keteranganRadiologi",
                        title: "Keterangan",
                        width: "50%"
                    }]
                };

              medifirstService.get("laboratorium/get-hasil-lab?noorder=" + $scope.noOrder).then(function (data) {
                    var sourceGrid = []
                    if (data.statResponse == true && data.data.length > 0) {
                        sourceGrid = data.data
                    } else
                        toastr.info('Data Hasil tidak ada', 'Info')

                    $scope.resultGrids = new kendo.data.DataSource({
                        data: sourceGrid,
                        // group: {
                        //     field: "paket"
                        // },
                        sort: { field: "urutan", dir: "asc" }
                    });
                });
            }

             $scope.inputBaru = function () {
                $scope.popUp.center().open()
            }
            $scope.batal = function () {
                $scope.popUp.close()
            }


            $scope.result();

        }
    ]);
});