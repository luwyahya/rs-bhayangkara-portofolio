define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('WaktuTungguCtrl', ['$rootScope', '$scope', '$state', 'MedifirstService',
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
                },
                {
                    id: 7,
                    waktu: "Waktu obat selesai dibuat"
                },
                {
                    id: 99,
                    waktu: "Tidak hadir/batal"
                }
            ]

            // $scope.dataset = [
            //     {
            //         "wakturs": "16-03-2021 11:32:49 WIB",
            //         "waktu": "24-03-2021 12:55:23 WIB",
            //         "taskname": "mulai waktu tunggu admisi",
            //         "taskid": 1,
            //         "kodebooking": "Y03-20#1617068533"
            //     }
            // ]

            $scope.submitUpdate = function () {
                if ($scope.kodebookingUpdate === undefined) {
                    toastr.error('Kode booking belum diset')
                    return
                }
                if ($scope.waktu === undefined) {
                    toastr.error('Jenis waktu belum diset')
                    return
                }
                $scope.isRouteLoading = true
                var json = {
                    "data": {
                        "kodebooking": $scope.kodebookingUpdate,
                        "taskid": $scope.waktu.id,
                        "waktu": new Date().getTime()
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId", json).then(function (e) {
                    if (e.data.metadata.code === 200) {
                        toastr.success(e.data.metadata.message)
                    } else {
                        toastr.error(e.data.metadata.message)
                    }
                    $scope.isRouteLoading = false
                })

                // var obj = {
                //     data: {
                //         kodebooking: $scope.kodebookingUpdate,
                //         taskid: $scope.waktu,
                //         waktu: new Date().getTime()
                //     }
                // }

                // medifirstService.post(`bridging/bpjs/antrean/v2/update-waktu`, obj).then(function (data) {

                //     toastr.info(`${data.data.metadata.code}: ${data.data.metadata.message}`)
                //     $scope.isRouteLoading = false

                // })
                // $scope.isRouteLoading = false
            }


            $scope.submitWaktuTaskId = function () {
                initWaktuTaskId()
            }

            function initWaktuTaskId() {
                if ($scope.kodebooking === undefined) {
                    toastr.error('Kode booking belum diset')
                    return
                }

                $scope.isRouteLoading = true
                var json = {
                    "data": {
                        "kodebooking": $scope.kodebooking
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs2/mjkn/antrian/waktuTaskid", json).then(function (e) {
                    if (e.data.metadata.code === 200) {
                        toastr.success(e.data.metadata.message)

                        var result = []
                        result = e.data.response
                        $scope.daftarWaktuTaskId = new kendo.data.DataSource({ data: result })
                    } else {
                        $scope.daftarWaktuTaskId = new kendo.data.DataSource({ data: null })
                        toastr.error(e.data.metaData.message)
                    }
                    $scope.isRouteLoading = false
                })
                // var obj = {
                //     data: {
                //         kodebooking: $scope.kodebooking
                //     }
                // }

                // medifirstService.post(`bridging/bpjs/antrean/v2/waktu-task-id`, obj).then(function (data) {

                //     toastr.info(`${data.data.metadata.code}: ${data.data.metadata.message}`)

                //     var result = []
                //     if (data.data.metadata.code == 200)
                //         result = data.data.response.list

                //     $scope.daftarWaktuTaskId = new kendo.data.DataSource({ data: result })
                //     $scope.isRouteLoading = false
                // })
                // $scope.isRouteLoading = false
            }

            $scope.columnWaktuTaskId = {
                columns: [
                    {
                        "field": "wakturs",
                        "title": "wakturs",
                        "width": "30%"
                    },
                    {
                        "field": "waktu",
                        "title": "waktu",
                        "width": "30%"
                    },
                    {
                        "field": "taskname",
                        "title": "taskname",
                        "width": "30%"
                    },
                    {
                        "field": "taskid",
                        "title": "taskid",
                        "width": "30%"
                    },
                    {
                        "field": "kodebooking",
                        "title": "kodebooking",
                        "width": "30%"
                    }
                ]
            }



        }
    ]);
});