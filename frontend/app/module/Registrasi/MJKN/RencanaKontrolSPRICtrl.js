define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RencanaKontrolSPRICtrl', ['$scope', '$state', 'MedifirstService',
        function ($scope, $state, medifirstService) {
            $scope.now = new Date();
            $scope.nav = function (state) {
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            $scope.isLoadingRujukan = false;
            $scope.histori = {}
            $scope.ReferensiDokter = {};
            $scope.klaim = {};
            $scope.raharja = {};
            $scope.model = {};
            $scope.mjkn = {};
            $scope.mjkn1 = {};
            $scope.item = {};
            var datatindakan = [];
            $scope.item.bulan = $scope.now;
            $scope.item.bulan2 = $scope.now;
            $scope.item.tglRencanaKontrol = $scope.now
            $scope.item.tglRencanaKontrolupdate = $scope.now
            $scope.item.tglRencanaKontrolspri = $scope.now
            $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();
            $scope.item.tanggal = new Date(moment($scope.now).format('yyyy-MM-dd'));
            $scope.dataSelectedRow = {};
            var data2 = [];
            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }
            LoadCombo()
            $scope.isShowRujukanKontrol = true;
            $scope.isShowSPRI = false;

            var onChange = function (e) {
                var grid = $(this).data("mainGridOptions");
            }

            $scope.showRujukanKontrol = function () {
                $scope.isShowRujukanKontrol = !$scope.isShowRujukanKontrol;
            }
            $scope.showSPRI = function () {
                $scope.isShowSPRI = !$scope.isShowSPRI;
            }


            $scope.insert = function () {
                let x = [];
                data2.forEach(function (e) {
                    e.isChecked = true
                    let dataid = {
                        "kode": e.kode,
                    }
                    x.push(dataid)
                })
                let y = [];
                datatindakan.forEach(function (e) {
                    e.isChecked = true
                    let indakanid = {
                        "kode": e.kode,
                    }
                    y.push(indakanid)
                })
                var dataSend = {
                    "data": {
                        "noRujukan": $scope.item.noRujukan,
                        "diagnosa": x,
                        "procedure": y,
                        "user": "Coba Ws"
                    }
                };
                medifirstService.postNonMessage("bridging/bpjs2/insert-rujukan-khusus-v2", dataSend).then(function (e) {
                    if (e.data.metaData.code === "201") {
                        document.getElementById("jsonInsert").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }

            $scope.selectListRujukan = function (bulan) {
                let year = parseInt(moment(bulan).format("Y"))
                let month = parseInt(moment(bulan).format("M"))
                let bulan1 = bulan;
                $scope.isLoadingNoKartu = true;
                medifirstService.get("bridging/bpjs2/list-rujukan-khusus-v2?month=" + month + "&year=" + year).then(function (e) {
                    if (e.data.metaData.code === "200") {

                        document.getElementById("jsonListRujukan").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });
            }

            $scope.selectListSpesialistikRujukan = function () {
                debugger
                let date = moment($scope.item.tanggal).format('YYYY-MM-DD');
                $scope.isLoadingNoKartu = true;
                medifirstService.get("bridging/bpjs2/list-spesialistik-rujukan-khusus-v2?objectrujukanfk=" + $scope.item.faskess.kode + "&date=" + date).then(function (e) {
                    if (e.data.metaData.code === "200") {

                        document.getElementById("jsonListRujukan").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });

                medifirstService.get("bridging/bpjs2/list-sasaran-v2?objectrujukanfk=" + $scope.item.faskess.kode).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        document.getElementById("jsonListSarana").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });
            }

            $scope.clearDelete = function () {
                delete $scope.item.noRujukanKontrol;
            }

            $scope.cariNoRencanaKontrol = function (noRujukanKontrol) {
                medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + noRujukanKontrol).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        document.getElementById("jsonCariRencanaKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });
            }

            $scope.cariNoSEP = function (noSEP) {
                debugger
                medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-sep-v2?noSEP=" + noSEP).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        document.getElementById("jsonCariNoSEP").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });
            }

            $scope.hapusNoRencanaKontrol = function (noRujukanKontrol) {
                medifirstService.deleteNonMessage("bridging/bpjs2/hapus-rencana-kontrol-v2?noRujukanKontrol=" + noRujukanKontrol).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        document.getElementById("jsonHapusRencanaKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });
            }

            $scope.insertRencanaKontrol = function () {
                debugger
                var dataSend = {
                    data: {
                        request: {
                            noSEP: $scope.item.noSEP,
                            kodeDokter: $scope.item.dokterDPJP.kode,
                            poliKontrol: $scope.item.poli.kode,
                            tglRencanaKontrol: moment($scope.item.tanggalRencanaKontrol).format('YYYY-MM-DD'),
                            user: "Coba Ws"
                        }
                    }
                };

                medifirstService.postNonMessage("bridging/bpjs2/insert-rencana-kontrol-v2", dataSend).then(function (e) {
                    if (e.data.metaData.code === "201") {
                        document.getElementById("jsonInsertRencanaKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        document.getElementById("jsonInsertRencanaKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }

            $scope.insertSPRI = function () {
                debugger
                var dataSend = {
                    data: {
                        request: {
                            noKartu: $scope.item.noKartu,
                            kodeDokter: $scope.item.dokterDPJP.kode,
                            poliKontrol: $scope.item.poli.kode,
                            tglRencanaKontrol: moment($scope.item.tanggalSPRI).format('YYYY-MM-DD'),
                            user: "Coba Ws"
                        }
                    }
                };

                medifirstService.postNonMessage("bridging/bpjs2/insert-spri-v2", dataSend).then(function (e) {
                    if (e.data.metaData.code === "201") {
                        document.getElementById("jsonInsertSPRI").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }

            $scope.updateSPRI = function () {
                debugger
                // let date = moment($scope.item.tanggal).format('YYYY-MM-DD');
                var dataSend = {
                    data: {
                        request: {
                            noSPRI: $scope.item.noSPRI,
                            kodeDokter: $scope.item.dokterDPJP.kode,
                            poliKontrol: $scope.item.poli.kode,
                            tglRencanaKontrol: moment($scope.item.tanggalSPRI).format('YYYY-MM-DD'),
                            user: "Coba Ws"
                        }
                    }
                };

                medifirstService.postNonMessage("bridging/bpjs2/update-spri-v2", dataSend).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        document.getElementById("jsonUpdateSPRI").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }

            $scope.updateRencanaKontrol = function () {
                debugger
                // let date = moment($scope.item.tanggal).format('YYYY-MM-DD');
                var dataSend = {
                    data: {
                        request: {
                            noSuratKontrol: $scope.item.noRencanaKontrol,
                            noSEP: $scope.item.noSEP,
                            kodeDokter: $scope.item.dokterDPJP.kode,
                            poliKontrol: $scope.item.poli.kode,
                            tglRencanaKontrol: moment($scope.item.tanggalRencanaKontrol).format('YYYY-MM-DD'),
                            user: "Coba Ws"
                        }
                    }
                };

                // medifirstService.putNonMessage("bridging/bpjs2/update-sep-v1.1", dataUpdate).then(function (e) {
                // //     document.getElementById("jsonCreateSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                // //     window.messageContainer.error(e.data.metaData.message)
                // // }).then(function () {
                // //     $scope.isRouteLoading = false;
                // // })
                medifirstService.putNonMessage("bridging/bpjs2/update-rencana-kontrol-v2", dataSend).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        document.getElementById("jsonUpdateRencanaKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }

            function LoadCombo() {
                medifirstService.getPart("bridging/bpjs2/get-poli-part", true, true, 10).then(function (data) {
                    debugger
                    $scope.listPoli = data;
                });

                let dept = 1;
                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + dept
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + 10
                ).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDPJP = e.data.response.list;
                    }
                })
                // medifirstService.getPart("bridging/bpjs2/get-ref-diagnosa-part", true, true, 10).then(function (data) {
                //     $scope.listDiagnosa = data;
                // });
                // medifirstService.getPart("bridging/bpjs2/get-ref-diagnosatindakan-part", true, true, 10).then(function (data) {
                //     $scope.listDiagnosaTindakan = data;
                // });
            }
        }
    ]);
});