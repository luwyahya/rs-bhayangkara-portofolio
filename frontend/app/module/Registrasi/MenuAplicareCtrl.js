define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('MenuAplicareCtrl', ['$rootScope', '$scope', '$state', 'MedifirstService',
        function ($rootScope, $scope, $state, medifirstService) {
            $scope.now = new Date();
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            $scope.item = {}
            $scope.item.start = 1
            $scope.item.limit = 10
            $scope.isShowPembuatanSep = false;
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            var ppkRumahSakit = ''
            medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
                ppkRumahSakit = dat.data

            })
            $scope.showPembuatanSep = function () {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }
            $scope.showApproval = function () {
                $scope.isShowApproval = !$scope.isShowApproval;
            }
            $scope.showTglPulang = function () {
                $scope.isShowTglPulang = !$scope.isShowTglPulang;
            }
            $scope.showIntegrasi = function () {
                $scope.isShowIntegrasi = !$scope.isShowIntegrasi;
            }

            $scope.findKamar = function () {
                $scope.isRouteLoading = true
                medifirstService.get('bridging/bpjs2/aplicaresws/rest/ref/kelas').then(function (e) {
                    if (e.statResponse) {
                        document.getElementById("jsonKamar").innerHTML = JSON.stringify(e.data.response, undefined, 4);
                    }

                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.onTabChanges = function (value) {
                if (value === 3) {
                    $scope.findKamar()
                }
                if (value === 2) {
                    loadKetersediaan()
                }
            };
            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "5%",
                "attributes": { align: "center" }

            },
            {
                "field": "kodekelas",
                "title": "Kode Kelas",
                "width": "30%"
            },
            {
                "field": "namakelas",
                "title": "Nama Kelas",
                "width": "30%"
            },
            {
                "field": "koderuang",
                "title": "Kode Ruang",
                "width": "30%"
            }, {

                "field": "namaruang",
                "title": "Nama Ruang ",
                "width": "40%"
            },
            {

                "field": "kapasitas",
                "title": "Kapasitas",
                "width": "10%"
            },
            {

                "field": "tersedia",
                "title": "Tersedia",
                "width": "10%"
            },
            {

                "field": "tersediapria",
                "title": "Tersedia Pria",
                "width": "10%"
            },
            {

                "field": "tersediawanita",
                "title": "Tersedia Wanita",
                "width": "10%"
            },
            {

                "field": "tersediapriawanita",
                "title": "Tersedia Pria & Wanita",
                "width": "10%"
            }
            ]
            $scope.cari = function () {
                loadData()
            }
            loadData()
            function loadData() {
                $scope.isRouteLoading = true;

                var ruang = ""
                if ($scope.item.namaRuangan != undefined) {
                    ruang = "namaruangan=" + $scope.item.namaRuangan
                }
                var kelas = ""
                if ($scope.item.kelas != undefined) {
                    kelas = "&kelas=" + $scope.item.kelas
                }
                kelas
                medifirstService.get("bridging/bpjs2/aplicaresws/get-tt?"
                    + ruang
                    + kelas
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].no = i + 1
                    }
                    // $scope.listDiagnosaKep = data.data.data
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 10,
                        // total: data.data.data.length,
                        serverPaging: false,


                    });



                })
            }
            $scope.create = function () {
                $scope.isRouteLoading = true
                for (let i = 0; i < $scope.dataSource._data.length; i++) {
                    const element = $scope.dataSource._data[i];
                    let data = {
                        "json": {
                            "kodekelas": element.kodekelas,
                            "koderuang": element.koderuang,
                            "namaruang": element.namaruang,
                            "kapasitas": element.kapasitas,
                            "tersedia": element.tersedia,
                            "tersediapria": element.tersediapria,
                            "tersediawanita": element.tersediawanita,
                            "tersediapriawanita": element.tersediapriawanita,
                        }

                    }
                    medifirstService.postNonMessage('bridging/bpjs2/aplicaresws/rest/bed/create/' + ppkRumahSakit, data).then(function (e) {
                        if (e.data.metadata.code == 1) {
                            toastr.success(e.data.metadata.message, 'Info')
                        } else {
                            toastr.error(e.data.metadata.message, 'Info')
                        }
                        $scope.isRouteLoading = false
                    }, function (error) {
                        $scope.isRouteLoading = false
                    })
                }

            }
            $scope.update = function () {
                $scope.isRouteLoading = true

                for (let i = 0; i < $scope.dataSource._data.length; i++) {
                    const element = $scope.dataSource._data[i];
                    var tersedia = (element.tersedia.valueOf() < 0 ? 0 : element.tersedia);
                    var tersediapria = (element.tersediapria.valueOf() < 0 ? 0 : element.tersediapria);
                    var tersediawanita = (element.tersediawanita.valueOf() < 0 ? 0 : element.tersediawanita);
                    var tersediapriawanita = (element.tersediapriawanita.valueOf() < 0 ? 0 : element.tersediapriawanita);
                    let data = {
                        "json": {
                            "kodekelas": element.kodekelas,
                            "koderuang": element.koderuang,
                            "namaruang": element.namaruang,
                            "kapasitas": element.kapasitas,
                            "tersedia": tersedia,
                            "tersediapria": tersediapria,
                            "tersediawanita": tersediawanita,
                            "tersediapriawanita": tersediapriawanita,
                        }
                    }
                    //console.log(data);
                    medifirstService.postNonMessage('bridging/bpjs2/aplicaresws/rest/bed/update/' + ppkRumahSakit, data).then(function (e) {
                        if (e.data.metadata.code == 1) {
                            toastr.success(e.data.metadata.message, 'Info')
                        } else {
                            toastr.error(e.data.metadata.message, 'Info')
                        }
                        $scope.isRouteLoading = false
                    }, function (error) {
                        $scope.isRouteLoading = false
                    })
                }

            }
            $scope.hapus = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data yang mau dihapus', 'Info')
                    return
                }
                $scope.isRouteLoading = true
                // for (let index = 0; index <  $scope.dataSourceBrid._data.length; index++) {
                //     const element =  $scope.dataSourceBrid._data[index];
                let data = {
                    "json": {
                        "kodekelas": $scope.dataSelected.kodekelas,
                        "koderuang": $scope.dataSelected.koderuang
                    }
                }


                medifirstService.postNonMessage('bridging/bpjs2/aplicaresws/rest/bed/delete/' + ppkRumahSakit, data).then(function (e) {
                    if (e.data.metadata.code == 1) {
                        toastr.success(e.data.metadata.message, 'Info')
                        loadKetersediaan()
                    } else {
                        toastr.error(e.data.metadata.message, 'Info')
                    }
                    $scope.isRouteLoading = false
                }, function (error) {
                    $scope.isRouteLoading = false
                })
                // }

            }


            $scope.cariBrid = function () {
                loadKetersediaan()
            }

            function loadKetersediaan() {
                var start = 1
                if ($scope.item.start != undefined) {
                    start = $scope.item.start
                }
                var limit = 10
                if ($scope.item.limit != undefined) {
                    limit = $scope.item.limit
                }
                $scope.isRouteLoading = true
                medifirstService.get('bridging/bpjs2/aplicaresws/rest/bed/read/' + ppkRumahSakit + '/' + start + '/' + limit).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metadata != undefined && e.data.metadata.code == 1) {
                        for (var i = 0; i < e.data.response.list.length; i++) {
                            e.data.response.list[i].no = i + 1
                        }
                        // $scope.listDiagnosaKep = data.data.data
                        $scope.dataSourceBrid = new kendo.data.DataSource({
                            data: e.data.response.list,
                            pageSize: 10,
                            // total: data.data.data.length,
                            serverPaging: false,


                        });
                    } else {
                        toastr.info(e.data.metadata.message, 'Info')
                    }



                })
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(new Date(tanggal)).format("DD MMM YYYY HH:mm")
            }
            $scope.columnGridBrid = [{
                "field": "no",
                "title": "No",
                "width": "20px",
                "attributes": { align: "center" }

            },
            {
                "field": "kodekelas",
                "title": "Kode Kelas",
                "width": "50px",
            },
            {
                "field": "namakelas",
                "title": "Nama Kelas",
                "width": "80px",
            },
            {
                "field": "koderuang",
                "title": "Kode Ruang",
                "width": "50px",
            }, {

                "field": "namaruang",
                "title": "Nama Ruang ",
                "width": "100px",
            },
            {

                "field": "kapasitas",
                "title": "Kapasitas",
                "width": "60px",
            },
            {

                "field": "tersedia",
                "title": "Tersedia",
                "width": "60px",
            },
            {

                "field": "tersediapria",
                "title": "Tersedia Pria",
                "width": "60px",
            },
            {

                "field": "tersediawanita",
                "title": "Tersedia Wanita",
                "width": "60px",
            },
            {

                "field": "tersediapriawanita",
                "title": "Tersedia Pria & Wanita",
                "width": "60px",
            },
            {

                "field": "rownumber",
                "title": "Row",
                "width": "60px",
            },
            {

                "field": "lastupdate",
                "title": "Tgl Update",
                "width": "100px",
                "width": "80px",
                "template": "<span class='style-left'>{{formatTanggal('#: lastupdate #')}}</span>"
            }
            ]


        }
    ]);
});