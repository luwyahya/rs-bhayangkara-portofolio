define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DashboardCtrl', ['$rootScope', '$scope', '$state', 'MedifirstService',
        function ($rootScope, $scope, $state, medifirstService) {
            $scope.now = new Date();
            $scope.myVar = 0;
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                // console.log($scope.currentState);
            }
            $scope.isRouteLoading = false
            $scope.item = {}
            $scope.isShowPotensi = true;

            $scope.listWaktu = [
                {
                    id: 1,
                    waktu: "Waktu tunggu admisi"
                },
                {
                    id: 2,
                    waktu: "Waktu layan admisi"
                },
                {
                    id: 3,
                    waktu: "Waktu tunggu poli"
                },
                {
                    id: 4,
                    waktu: "Waktu layan poli"
                },
                {
                    id: 5,
                    waktu: "Waktu tunggu farmasi"
                },
                {
                    id: 6,
                    waktu: "Waktu layan farmasi"
                }
            ]

            // $scope.dataset = [
            //   {
            //         "kdppk": "1311R002",
            //         "waktu_task1": 0,
            //         "avg_waktu_task4": 0.0,
            //         "jumlah_antrean": 1,
            //         "avg_waktu_task3": 0.0,
            //         "namapoli": "BEDAH",
            //         "avg_waktu_task6": 0.0,
            //         "avg_waktu_task5": 0.0,
            //         "nmppk": "RSU AISYIYAH",
            //         "avg_waktu_task2": 0.0,
            //         "avg_waktu_task1": 0.0,
            //         "kodepoli": "BED",
            //         "waktu_task5": 0,
            //         "waktu_task4": 0,
            //         "waktu_task3": 0,
            //         "insertdate": 1627873951000,
            //         "tanggal": "2021-04-16",
            //         "waktu_task2": 0,
            //         "waktu_task6": 0
            //     }
            // ]

            // $scope.dataset2 = [
            //   {
            //         "kdppk": "1311R002",
            //         "waktu_task1": 0,
            //         "avg_waktu_task4": 0.0,
            //         "jumlah_antrean": 1,
            //         "avg_waktu_task3": 0.0,
            //         "namapoli": "BEDAH",
            //         "avg_waktu_task6": 0.0,
            //         "avg_waktu_task5": 0.0,
            //         "nmppk": "RSU AISYIYAH",
            //         "avg_waktu_task2": 0.0,
            //         "avg_waktu_task1": 0.0,
            //         "kodepoli": "BED",
            //         "waktu_task5": 0,
            //         "waktu_task4": 0,
            //         "waktu_task3": 0,
            //         "insertdate": 1627873951000,
            //         "tanggal": "2021-04-16",
            //         "waktu_task2": 0,
            //         "waktu_task6": 0
            //     }
            // ]

            function initPerTanggal() {
                // console.log($scope.bulan)
                if ($scope.now === undefined) {
                    toastr.error('Tanggal belum diset')
                    return
                }

                var tanggal = new moment($scope.now).format('YYYY-MM-DD')
                // var waktu = $scope.waktu.id
                var json = {
                    "tanggal": tanggal,
                    "waktu": 'server'
                }
                medifirstService.post('bridging/bpjs2/mjkn/antrian/dashboardPerTgl', json).then(function (data) {

                    // medifirstService.get(`bridging/bpjs/antrean/v2/get-dashboard-per-tanggal?tanggal=${tanggal}&waktu=${waktu}`, false).then(function (data) {
                    // console.log(data)

                    var result = []
                    if (data.data.metadata.code == 200) {
                        for (var i = data.data.response.length - 1; i >= 0; i--) {
                            data.data.response.list[i].insertdate = moment(new Date(data.data.response.list[i].insertdate)).format('YYYY-MM-DD')
                        }
                        result = data.data.response.list

                    }

                    $scope.daftarPerTanggal = new kendo.data.DataSource({ data: result })
                })
            }

            $scope.columnDaftarPerTanggal = {
                columns: [
                    {
                        "field": "kdppk",
                        "title": "Kode Faskes",
                        "width": "80px"
                    },
                    {
                        "field": "nmppk",
                        "title": "Faskes",
                        "width": "200px"
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px"
                    },
                    {
                        "field": "jumlah_antrean",
                        "title": "Jumlah Antrean",
                        "width": "100px"
                    },

                    {
                        "field": "namapoli",
                        "title": "Poli",
                        "width": "200px"
                    },

                    {
                        "field": "waktu_task1",
                        "title": "Waktu tunggu admisi",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task1",
                        "title": "Rata2 Waktu tunggu admisi",
                        "width": "100px"
                    },
                    {
                        "field": "waktu_task2",
                        "title": "Waktu layan admisi",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task2",
                        "title": "Rata2 Waktu layan admisi",
                        "width": "100px"
                    },

                    {
                        "field": "waktu_task3",
                        "title": "Waktu tunggu poli",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task3",
                        "title": "Rata2 Waktu tunggu poli",
                        "width": "100px"
                    },

                    {
                        "field": "waktu_task4",
                        "title": "Waktu layan poli",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task4",
                        "title": "Rata2 Waktu layan Poli",
                        "width": "100px"
                    },

                    {
                        "field": "waktu_task5",
                        "title": "Waktu layan poli",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task5",
                        "title": "Rata2 Waktu tunggu farmasi",
                        "width": "100px"
                    },
                    {
                        "field": "waktu_task6",
                        "title": "Waktu layan farmasi",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task6",
                        "title": "Rata2 Waktu layan farmasi",
                        "width": "100px"
                    },

                    {
                        "field": "insertdate",
                        "title": "Update",
                        "width": "100px"
                    },

                ]
            }

            $scope.cariPerTanggal = function () {
                initPerTanggal()
            }


            // ::PER BULAN                =========================================


            $scope.awalBulanClosing = new Date()
            $scope.akhirBulanClosing = new Date()
            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }

            function initPerBulan() {
                if ($scope.bulan === undefined) {
                    toastr.error('Bulan belum diset')
                    return
                }

                // if ($scope.waktuPerBulan === undefined) {
                //     toastr.error('Jenis Waktu belum diset')
                //     return
                // }

                var bulan = new moment($scope.bulan).format('MM')
                var tahun = new moment($scope.bulan).format('YYYY')
                // var waktu2 = $scope.waktuPerBulan.id

                var json = {
                    "bulan": bulan,
                    "tahun": tahun,
                    "waktu": "server"
                }
                medifirstService.post('bridging/bpjs2/mjkn/antrian/dashboardPerBln', json).then(function (data) {
                    // medifirstService.get(`bridging/bpjs/antrean/v2/get-dashboard-per-bulan?bulan=${bulan}&waktu=${waktu2}&tahun=${tahun}`, false).then(function (data) {
                    // console.log(data)

                    var result = []
                    if (data.data.metadata.code == 200) {
                        for (var i = data.data.response.length - 1; i >= 0; i--) {
                            data.data.response.list[i].insertdate = moment(new Date(data.data.response.list[i].insertdate)).format('YYYY-MM-DD')
                        }
                        result = data.data.response.list
                    }

                    $scope.daftarPerBulan = new kendo.data.DataSource({ data: result })
                })
            }

            $scope.columnDaftarPerBulan = {
                columns: [
                    {
                        "field": "kdppk",
                        "title": "Kode Faskes",
                        "width": "80px"
                    },
                    {
                        "field": "nmppk",
                        "title": "Faskes",
                        "width": "200px"
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px"
                    },
                    {
                        "field": "jumlah_antrean",
                        "title": "Jumlah Antrean",
                        "width": "100px"
                    },

                    {
                        "field": "namapoli",
                        "title": "Poli",
                        "width": "200px"
                    },

                    {
                        "field": "waktu_task1",
                        "title": "Waktu tunggu admisi",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task1",
                        "title": "Rata2 Waktu tunggu admisi",
                        "width": "100px"
                    },
                    {
                        "field": "waktu_task2",
                        "title": "Waktu layan admisi",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task2",
                        "title": "Rata2 Waktu layan admisi",
                        "width": "100px"
                    },

                    {
                        "field": "waktu_task3",
                        "title": "Waktu tunggu poli",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task3",
                        "title": "Rata2 Waktu tunggu poli",
                        "width": "100px"
                    },

                    {
                        "field": "waktu_task4",
                        "title": "Waktu layan poli",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task4",
                        "title": "Rata2 Waktu layan Poli",
                        "width": "100px"
                    },

                    {
                        "field": "waktu_task5",
                        "title": "Waktu layan poli",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task5",
                        "title": "Rata2 Waktu tunggu farmasi",
                        "width": "100px"
                    },
                    {
                        "field": "waktu_task6",
                        "title": "Waktu layan farmasi",
                        "width": "100px"
                    },
                    {
                        "field": "avg_waktu_task6",
                        "title": "Rata2 Waktu layan farmasi",
                        "width": "100px"
                    },

                    {
                        "field": "insertdate",
                        "title": "Update",
                        "width": "100px"
                    },

                ]
            }

            $scope.cariPerBulan = function () {
                initPerBulan()
            }

        }
    ]);
});