define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RujukanKhususCtrl', ['$scope', '$state', 'MedifirstService',
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
            // $scope
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
            // $scope.isShowPembuatanSep = false;
            $scope.isShowRujukan = true;
            $scope.isShowSpesialis = false;
            // $scope.isShowTglPulang = false;
            // $scope.isShowIntegrasi = false;

            var onChange = function (e) {
                var grid = $(this).data("mainGridOptions");

            }

            $scope.showRujukan = function () {
                $scope.isShowRujukan = !$scope.isShowRujukan;
            }
            $scope.showSpesialis = function () {
                $scope.isShowSpesialis = !$scope.isShowSpesialis;
            }

            $scope.gridDiagnosa = [
                {
                    "title": "#",
                    "field": "no",
                    "width": 15
                },
                {
                    "field": "kddiagnosa",
                    "title": "Kode",
                    "width": 35
                },
                {
                    "field": "namadiagnosa",
                    "title": "Diagnosa",
                    "width": 150
                },
                {
                    "field": "jenis",
                    "title": "Jenis Diagnosa",
                    "width": 50
                },
                {
                    command: {
                        text: "Hapus",
                        width: "40px",
                        align: "center",
                        attributes: { align: "center" },
                        click: removeData2
                    },
                    title: "",
                    width: "40px"
                }
            ];

            function removeData2(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.tempDataTindakan = $scope.listGridDiagnosa
                    .filter(function (el) {
                        return el.name !== grid[0].name;
                    });
                grid.removeRow(row);
                var data = {};
                if (dataItem != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == dataItem.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {

                                data2[i].no = i + 1
                            }
                            $scope.listGridDiagnosa = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                }
            }

            $scope.insert = function () {
                // if (data2.length === 0) {
                //     toastr.error('Diagnosa Tindakan/Procedure Belum Diisi', 'Peringatan');
                //     return;
                // }

                // if (datatindakan.length === 0) {
                //     toastr.error('Diagnosa Belum Diisi', 'Peringatan');
                //     return;
                // }

                // $scope.isRouteLoading = true;
                // // let data = {
                // //     noRujukan: $scope.item.noRujukan,
                // //     diagnosa: data2,
                // //     procedure: datatindakan,
                // //     user: "Coba Ws"
                // // }
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

                // let dataSend = {
                //     "data": {
                //         "noRujukan": "0113R0011021B000103",
                //         "diagnosa": [
                //                 {"kode": "P;N18"},
                //                 {"kode": "S;N18.1"}
                //         ],
                //         "procedure":  [
                //                 {"kode": "39.95"}
                //         ],
                //         "user": "Coba Ws"
                //     }
                // }
                // let dataDone = {insert: data}
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

            // $scope.selectListSarana = function () {
            //     debugger
            //     // let year = parseInt(moment(bulan).format("Y"))
            //     // let month = parseInt(moment(bulan).format("M"))
            //     let date = moment($scope.item.tanggal).format('YYYY-MM-DD');
            //     $scope.isLoadingNoKartu = true;
            //     medifirstService.get("bridging/bpjs2/list-sasaran-v2?objectrujukanfk=" + $scope.item.faskesss.kode).then(function (e) {
            //         if (e.data.metaData.code === "200") {
            //             document.getElementById("jsonListSarana").innerHTML = JSON.stringify(e.data, undefined, 4);
            //         } else {
            //             window.messageContainer.error(e.data.metaData.message);
            //         }
            //         $scope.isLoadingNoKartu = false;
            //     }, function (err) {
            //         $scope.isLoadingNoKartu = false;
            //     });
            // }

            $scope.deleteRujukanKhusus = function (norujukan) {
                debugger
            }

            $scope.gridDiagnosaTindakan = [
                {
                    "title": "#",
                    "field": "no",
                    "width": 15
                },
                {
                    "field": "kddiagnosatindakan",
                    "title": "Kode",
                    "width": 80
                }, {
                    "field": "namadiagnosatindakan",
                    "title": "Procedure/tindakan",
                    "width": 150
                }, {
                    command: {
                        text: "Hapus",
                        width: "40px",
                        align: "center",
                        attributes: { align: "center" },
                        click: removeData4
                    },
                    title: "",
                    width: "40px"
                }
            ];

            function removeData4(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.tempDataTindakanSS = $scope.listGridDiagnosaTindakan
                    .filter(function (el) {
                        return el.name !== grid[0].name;
                    });
                grid.removeRow(row);
                var data = {};
                if (dataItem != undefined) {
                    for (var i = datatindakan.length - 1; i >= 0; i--) {
                        if (datatindakan[i].no == dataItem.no) {
                            datatindakan.splice(i, 1);
                            for (var i = datatindakan.length - 1; i >= 0; i--) {

                                datatindakan[i].no = i + 1
                            }
                            $scope.listGridDiagnosaTindakan = new kendo.data.DataSource({
                                data: datatindakan
                            });
                        }
                    }
                }
            }

            $scope.Tambah = function () {
                debugger
                let nomor = 0
                if ($scope.listGridDiagnosa == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                let kdDiagnosa = "";
                let namaDiagnosa = "";
                if ($scope.item.diagnosa != undefined) {
                    kdDiagnosa = $scope.item.diagnosa.kode
                    namaDiagnosa = $scope.item.diagnosa.nama;
                }
                else {
                    messageContainer.error("Diagnosa Harus Di isi")
                    return
                }
                let stat = 'S';
                if ($scope.model.diagnosaUtama === true) {
                    stat = 'P';
                }

                let dataDiagnosa = {};
                dataDiagnosa = {
                    kode: `${stat};${kdDiagnosa}`,
                    no: nomor,
                    kddiagnosa: kdDiagnosa,
                    namadiagnosa: namaDiagnosa,
                    utama: $scope.model.diagnosaUtama === true ? 1 : 2,
                    jenis: $scope.model.diagnosaUtama === true ? "Primer" : "Sekunder",
                }
                data2.push(dataDiagnosa)
                $scope.listGridDiagnosa = new kendo.data.DataSource({
                    data: data2
                });
                $scope.item.diagnosa = undefined;
            }

            $scope.Tambah2 = function () {

                let nomor = 0
                if ($scope.listGridDiagnosaTindakan == undefined) {
                    nomor = 1
                } else {
                    nomor = datatindakan.length + 1
                }
                let kdDiagnosa = "";
                let namaDiagnosa = ";"
                if ($scope.item.diagnosaTindakan != undefined) {
                    kdDiagnosa = $scope.item.diagnosaTindakan.kode
                    namaDiagnosa = $scope.item.diagnosaTindakan.nama;
                }
                else {
                    messageContainer.error("Diagnosa Tindakan Harus Di isi")
                    return
                }

                let dataDiagnosaTin = {};
                dataDiagnosaTin = {
                    kode: kdDiagnosa,
                    no: nomor,
                    kddiagnosatindakan: kdDiagnosa,
                    namadiagnosatindakan: namaDiagnosa,
                }
                datatindakan.push(dataDiagnosaTin)
                $scope.listGridDiagnosaTindakan = new kendo.data.DataSource({
                    data: datatindakan
                });

                $scope.item.diagnosaTindakan = undefined;

            }

            $scope.$watch('item.jenisRujukan', function (e) {
                if (e === undefined) return;
                medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes="
                    + e, true, 10, 10)
                    .then(function (x) {
                        $scope.listFaskess = x;
                    })
            })

            // $scope.$watch('item.jenisRujukans', function (e) {
            //     debugger
            //     if (e === undefined) return;
            //     medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes="
            //     + e, true, 10, 10)
            //     .then(function (x) {
            //         $scope.listFaskesss = x;
            //     })
            // })

            function LoadCombo() {
                $scope.listJenisRujukan = [{ 'id': 1, 'name': 'Faskes 1' }, { 'id': 2, 'name': 'Faskes 2' }]
                $scope.listJenisRujukans = [{ 'ids': 1, 'name': 'Faskes 1' }, { 'ids': 2, 'name': 'Faskes 2' }]
                medifirstService.getPart("bridging/bpjs2/get-ref-diagnosa-part", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.getPart("bridging/bpjs2/get-ref-diagnosatindakan-part", true, true, 10).then(function (data) {
                    $scope.listDiagnosaTindakan = data;
                });
                // medifirstService.get("bridging/bpjs2/get-ref-spesialistik"
                // ).then(function (e) {
                //     if (e.data.metaData.code == 200) {
                //       $scope.listSpesialis = e.data.response.list;
                //     }
                // });
                // medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes="
                // + e, true, 10, 10)
                // .then(function (x) {
                //     $scope.listFaskess = x;
                // })
                // medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part", true, true, 10).then(function (data) {
                //     debugger
                //     $scope.listFaskess = data;
                // });
            }
        }
    ]);
});