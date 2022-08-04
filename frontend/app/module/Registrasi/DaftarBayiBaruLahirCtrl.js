
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('DaftarBayiBaruLahirCtrl', ['MedifirstService', '$scope',
        function (medifirstService, $scope) {
            $scope.title = "Daftar Bayi Baru Lahir";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {
                from: $scope.now,
                until: $scope.now,
                rows: 100
            };
            $scope.refresh = function () {
                $scope.item = {
                    from: $scope.now,
                    until: $scope.now,
                    rows: 100
                };
                $scope.findData()
            }
            $scope.findData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noReg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&noCm=" + $scope.item.noRm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    var nama = "&namaPasien=" + $scope.item.namaPasien
                }
                var ibu = ""
                if ($scope.item.namaIbu != undefined) {
                    var ibu = "&namaIbu=" + $scope.item.namaIbu
                }

                var tglLahir = ""
                if ($scope.item.tglLahir != undefined) {
                    var tglLahir = "&tglLahir=" + $scope.item.tglLahir
                }
                var rows = ""
                if ($scope.item.rows != undefined) {
                    var rows = "&rows=" + $scope.item.rows
                }
                medifirstService.get("registrasi/get-bayi-baru-lahir?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + reg
                    + rm
                    + nama
                    + ibu
                    + tglLahir
                    + rows).then(function (e) {
                        $scope.isRouteLoading = false;

                        $scope.dataPasienBatal = new kendo.data.DataSource({
                            data: e.data.data,
                            // group: {
                            //     field: "tglmeninggal",
                            //     aggregates: [{
                            //         field: "noregistrasi",
                            //         aggregate: "count"
                            //     }, {
                            //         field: "namapasien",
                            //         aggregate: "count"
                            //     }]
                            // }
                        });
                    })

            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.findData();
            $scope.mainGridOptions = {
                pageable: true,
                selectable: 'row',
                sortable: true,
                columns: [
                    {
                        field: "tglregistrasi",
                        title: "Tgl Registrasi",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },

                    {
                        field: "noregistrasi",
                        title: "No Reg",
                        hidden: false
                    },
                    {
                        field: "nocm",
                        title: "No Rm",
                        hidden: false
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien"
                    },
                    {
                        field: "tgllahir",
                        title: "Tgl Lahir",
                        template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    },
                    {
                        field: "namaibu",
                        title: "Nama Ibu"
                    },
                    {
                        field: "namaayah",
                        title: "Nama Ayah"
                    },
                    {
                        field: "alamatlengkap",
                        title: "Alamat"
                    }
                ],
                selectable: "row",
                sortable: true
            }
        }
    ]);

});