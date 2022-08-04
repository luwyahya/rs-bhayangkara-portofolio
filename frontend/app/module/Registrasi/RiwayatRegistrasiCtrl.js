define(['initialize'], function (initialize, pasienServices) {
    'use strict';
    initialize.controller('RiwayatRegistrasiCtrl', ['$q', '$scope', 'ModelItem', '$state', 'MedifirstService',
        function ($q, $scope, ModelItem, $state, medifirstService) {
            $scope.isRouteLoading = false;
            4
            var currentParams;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.dataSelected1 = {};
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            }
            $scope.isRouteLoading = false;
            $scope.items = {};
            $scope.popUp = {}

            if ($state.params != undefined) {
                if ($state.params.nocm != '-' && $state.params.noregistrasi != '-'){
                    $scope.item.noCm = $state.params.nocm;
                    $scope.item.noRegistrasi = $state.params.noregistrasi;
                    loadData()
                    loadDatas()
                }
                    
            }
            medifirstService.get("registrasi/get-combo-riwayat-regis", false).then(function (data) {
                $scope.listDepartemen = data.data.deptrirj;
                if($state.params.noregistrasi == '-')
                     $scope.item.departement = { id: $scope.listDepartemen[0].id, namadepartemen: $scope.listDepartemen[0].namadepartemen }
                $scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
                $scope.sourceJenisDiagnosisPrimer1 = data.data.jenisdiagnosa;
            })
            $scope.batal = function () {
                $scope.from = $scope.until = $scope.now;
                // delete $scope.item.noRegistrasi;
            }

            $scope.getIsiComboRuangan = function () {
				$scope.listRuanganfilter = $scope.item.departement.ruangan
			}
            $scope.showMasterDiagnosa = function () {
                $state.go("DiagnosaTindakanEdit")
            }

            $scope.showMasterDiagnosaTindakan = function () {
                $state.go("DiagnosaEdit")
            }
            $scope.listRegistrasiDetil = [];
            $scope.batal();
            $scope.findByRegistrasi = function () {

                loadDatas()

            }


         


            $scope.findBynoCM = function () {

                loadData()
                $scope.cboDiagnosa = false;
                $scope.cboDiagnosa1 = false;
                $scope.cboInputDiagnosa = true;
            }

            function loadData() {
                $scope.isRouteLoading = true;

                var noCm = ""
                if ($scope.item.noCm != undefined) {
                    var noCm = "noCm=" + $scope.item.noCm
                }

                var noReg = ""
                if ($scope.item.noRegistrasi != undefined) {
                    var noReg = "noReg=" + $scope.item.noRegistrasi
                }

                $q.all([
                    medifirstService.get("registrasi/get-pasien-by-nocm-riwayat-regis?"
                        + noCm),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data[0].data.datas;
                    $scope.item.namaPasien = datas.namapasien;
                    $scope.item.tempatLahir = datas.tempatlahir;
                    $scope.item.tglLahir = datas.tgllahir;
                    $scope.item.alamatLengkap = datas.alamatlengkap;
                    //$scope.item.noTelepon = datas.notelepon;
                    $scope.item.noHp = datas.nohp;
                    $scope.item.namaKeluarga = datas.namakeluarga;
                    $scope.item.namaIbu = datas.namaibu;
                    $scope.item.jeniskelamin = datas.jeniskelamin;
                });

                loadDatas()
            }

            $scope.SearchEnterPasien = function () {
                loadData();
            }

            function loadDatas() {

                var noReg = ""
                if ($scope.item.noRegistrasi != undefined) {
                    var noReg = "&noReg=" + $scope.item.noRegistrasi
                }

                var noCm = ""
                if ($scope.item.noCm != undefined) {
                    var noCm = "&noCm=" + $scope.item.noCm
                }

                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }

                var tempRuangan = "";
                if ($scope.item.namaRuanganfilter != undefined) {
                    tempRuangan = "&idRuangan=" + $scope.item.namaRuanganfilter.id;
                }
                debugger;

                $q.all([
                    medifirstService.get("registrasi/get-antrian-by-nocm-rev?"
                        + noReg
                        + noCm
                        + tempDepartemen
                        + tempRuangan),
                ]).then(function (data) {
                    //debugger;
                    var dot = data[0].data.datas;
                    for (var i = 0; i < dot.length; i++) {
                        dot[i].no = i + 1
                        if (dot[i].details.length > 0) {
                            for (let x = 0; x < dot[i].details.length; x++) {
                                const element = dot[i].details[x];
                                if (element.kddiagnosa == '-') {
                                    dot[i].status = '✔ '
                                    break
                                } else {
                                    dot[i].status = '✔';
                                    break
                                }
                            }

                        } else {
                            dot[i].status = '✖';
                        }

                    }
                    $scope.listRegistrasi = new kendo.data.DataSource({
                        data: dot,
                        pageSize: 5,
                        total: dot.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    // $scope.isRouteLoading=false;
                    // $scope.listRegistrasi = dot;
                });
            };

            var onDataBound = function (e) {
                $('td').each(function () {
                    if ($(this).text() == '✖') { $(this).addClass('red') }
                    if ($(this).text() == '✔') { $(this).addClass('green') }
                    if ($(this).text() == '✔ ') { $(this).addClass('koneng') }
                })
            }

            $scope.gridRegistrasi = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: 35
                    },
                    {
                        field: "noregistrasi",
                        title: "No. Registrasi",
                        aggregates: ["count"],
                        width: 120
                    },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Registrasi",
                        template: "#if (tglregistrasi) {# #= new moment(tglregistrasi).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                        width: 130
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan Pelayanan",
                        aggregates: ["count"],
                        groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)",
                        width: 250
                    },
                    {
                        field: "namalengkap",
                        title: "Dokter"
                    },
                    {
                        field: "tglpulang",
                        title: "Tgl Pulang",
                        template: "#if (tglpulang) {# #= new moment(tglpulang).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                        width: 130
                    },
                    {
                        field: "status",
                        title: "Status",
                        width: 85
                    }
                ]
            }



            medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {

                $scope.sourceDiagnosisPrimer = data;
            });


            // get diagnosa icd9
            // ModelItem.getDataDummyGeneric("DiagnosaTindakan", true, true, 50).then(function(data) {
            //     $scope.sourceDiagnosisTindakan = data;
            // }); 

            medifirstService.getPart("registrasi/get-icd-9", true, true, 10).then(function (data) {
                $scope.sourceDiagnosisPrimer1 = data;

            });




            $scope.addDataDiagnosisPrimer = function () {
                var listRawRequired = [
                    "item.jenisDiagnosis|k-ng-model|Jenis Diagnosa",
                    "item.diagnosisPrimer|k-ng-model|Diagnosa",
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.listInputDiagnosis.add({
                        "jenisDiagnosis": $scope.item.jenisDiagnosis,
                        "diagnosisPrimer": $scope.item.diagnosisPrimer,
                        "namaRuangan": $scope.item.namaRuangan
                    });
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.namaRuangan;
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.removeDiagnosa = function (e) {
                e = $scope.klikGrid.norec_dp;

                // e.preventDefault();
                // var grid = this;
                // var row = $(e.currentTarget).closest("tr");

                // var selectedItem = grid.dataItem(row);

                // $scope.dataDiagnosisPrimer.remove(selectedItem);
            }
            $scope.listInputDiagnosis = new kendo.data.DataSource({
                data: [],
                change: function (e) {
                    var row = e.index;
                    e.items.forEach(function (data) {
                        data.rowNumber = ++row;
                    })
                }
            });
            $scope.detilGridOptions = {
                sortable: true,
                selectable: "row",
                columns: [{
                    title: "#",
                    template: "{{listRegistrasiDetil.indexOf(dataItem) + 1}}",
                    width: 35
                }, {
                    field: "noRegistrasi",
                    title: "No. Registrasi",
                    aggregates: ["count"],
                    width: 120
                }, {
                    field: "tglRegistrasi",
                    title: "Tgl Registrasi",
                    template: "#if (tglRegistrasi) {# #= new moment(tglRegistrasi).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                    width: 130
                }, {
                    field: "tglRegistrasiPasienDaftar",
                    title: "Tgl Daftar",
                    template: "#if (tglRegistrasiPasienDaftar) {# #= new moment(tglRegistrasiPasienDaftar).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                    width: 130
                }, {
                    field: "namaRuangan",
                    title: "Ruangan Pelayanan"
                }, {
                    field: "namaRuanganAsal",
                    title: "Ruangan Asal"
                }, {
                    field: "namaRuanganLast",
                    title: "Ruangan Last"
                }, {
                    field: "tglMasuk",
                    title: "Tgl Masuk",
                    template: "#if (tglMasuk) {# #= new moment(tglMasuk).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                    width: 120
                }, {
                    field: "tglPulang",
                    title: "Tgl Pulang",
                    template: "#if (tglPulang) {# #= new moment(tglPulang).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #"
                }, {
                    field: "statusKendaliDokumen",
                    title: "Status"
                }, {
                    field: "namaDokter",
                    title: "Dokter"
                }, {
                    field: "namaDokterDpjp",
                    title: "Dokter DPJP"
                }, {
                    field: "namaDokterPemeriksa",
                    title: "Dokter Pemeriksa",
                    template: "#if (namaDokterPemeriksa) {# #= namaDokterPemeriksa # #} else {# - #} #"
                }],
                pageable: true
            }
            $scope.gridIcd9 = {
                sortable: true,
                selectable: "row",
                toolbar: [{
                    name: "create",
                    template: '<a class="k-button" data-ng-click="toogleKlikIcd(\'Icd9\')">Input ICD-9</a>'
                }],
                columns: [{
                    title: "Diagnosa",
                    columns: [{
                        field: "kdDiagnosa",
                        title: "Kode",
                        width: 80
                    }, {
                        field: "namaDiagnosa",
                        title: "Nama",
                        width: 250
                    }]
                }, {
                    field: "namaRuangan",
                    title: "Nama Ruangan",
                }, {
                    field: "idRuangan",
                    title: "ID Ruangan",
                    hidden: true
                }]
            }
            $scope.gridIcd10 = {
                sortable: true,
                selectable: "row",
                toolbar: [{
                    name: "create",
                    template: '<a class="k-button" data-ng-click="toogleKlikIcd(\'icd10\')">Input ICD-10</a>'
                }],
                columns: [{
                    title: "Diagnosa",
                    columns: [{
                        field: "jenisDiagnosa",
                        title: "Jenis",
                        width: 120
                    }, {
                        field: "kdDiagnosa",
                        title: "Kode",
                        width: 80
                    }, {
                        field: "namaDiagnosa",
                        title: "Nama",
                        width: 250
                    }, {
                        field: "idDiagnosa",
                        title: "ID Diagnosa",
                        hidden: true
                    }]
                }, {
                    field: "namaRuangan",
                    title: "Nama Ruangan",
                }, {
                    field: "idRuangan",
                    title: "ID Ruangan",
                    hidden: true
                }]
            }
            $scope.gridDaftarInputIcd9 = {
                sortable: true,
                selectable: "row",
                columns: [{
                    title: "#",
                    template: "{{daftarInputIcd9.indexOf(dataItem) + 1}}",
                    width: 35
                }, {
                    title: "Diagnosa",
                    columns: [{
                        field: "diagnosisTindakan.kdDiagnosaTindakan",
                        title: "Kode",
                        width: 80
                    }, {
                        field: "diagnosisTindakan.namaDiagnosaTindakan",
                        title: "Nama",
                        width: 250
                    }]
                }, {
                    field: "keterangan",
                    title: "Keterangan",
                }]
            }
            $scope.gridDaftarInputIcd10 = {
                sortable: true,
                selectable: "row",
                columns: [{
                    title: "#",
                    template: "{{daftarInputIcd10.indexOf(dataItem) + 1}}",
                    width: 35
                }, {
                    field: "jenisDiagnosis.jenisDiagnosa",
                    title: "Jenis Diagnosa",
                    width: 120
                }, {
                    title: "Diagnosa",
                    columns: [{
                        field: "diagnosis.kdDiagnosa",
                        title: "Kode",
                        width: 80
                    }, {
                        field: "diagnosis.namaDiagnosa",
                        title: "Nama",
                        width: 250
                    }, {
                        field: "diagnosis.idDiagnosa",
                        title: "ID Diagnosa",
                        hidden: true
                    }]
                }, {
                    field: "keterangan",
                    title: "Keterangan",
                }]
            }


            $scope.toggleDetail = function (currentData) {
                if (currentData !== currentParams)
                    $scope.showDetail = !$scope.showDetail;
            }

            function loaaaaaaad() {
                var norReg = ""
                if ($scope.currentAntrian.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.currentAntrian.noregistrasi;
                }
                // manageSarprasPhp.getDataTableTransaksi("pasien/get-pasienbynoreg?"
                //     + norReg
                // ).then(function (dat) {
                //     $scope.listRuangan = dat.data.data;
                // });

                medifirstService.get("registrasi/get-diagnosa-10-by-noreg?"
                    + norReg
                ).then(function (data) {
                    var dataTea = data.data.datas;

                    $scope.listGridDiagnosa = new kendo.data.DataSource({
                        data: data.data.datas,
                        //pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });

                // $scope.dataSelected = data.data.datas;
                medifirstService.get("registrasi/get-diagnosa-9-by-noreg?"
                    + norReg
                ).then(function (data) {
                    $scope.listGridDiagnosa1 = new kendo.data.DataSource({
                        data: data.data.datas,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                    // $scope.dataSelected = data.data.datas;
                });


            }


            // function LoadData() {
            $scope.kl = function (data) {

                if ($scope.klikInputDiagnosis) return;
                $scope.currentAntrian = data;


                var norReg = ""
                if ($scope.currentAntrian.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.currentAntrian.noregistrasi;
                }
                medifirstService.get("registrasi/get-antrian-pasien-diperiksa-by-noreg?"
                    + norReg
                ).then(function (dat) {
                    $scope.listRuangan = dat.data.data
                    $scope.item.namaRuangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.listRuangan1 = dat.data.data
                    $scope.item.namaRuangan1 = { id: $scope.listRuangan1[0].id, namaruangan: $scope.listRuangan1[0].namaruangan }

                });
                $scope.popUp = data
                // manageSarprasPhp.getDataTableTransaksi("pasien/get-diagnosapasienbynoreg?"
                //     + norReg
                // ).then(function (dat) {
                //     $scope.listRuangan = dat.data.data
                //     $scope.item.namaRuangan = {id:$scope.listRuangan[0].id,namaruangan:$scope.listRuangan[0].namaruangan}
                //     $scope.listRuangan1 = dat.data.data
                //     $scope.item.namaRuangan1 = {id:$scope.listRuangan1[0].id,namaruangan:$scope.listRuangan1[0].namaruangan}

                // });

                loaaaaaaad();
            }

            $scope.gridDiagnosa =
                // {
                // columns: 
                [
                    {
                        "title": "#",
                        "template": "{{listGridDiagnosa.indexOf(dataItem) + 1}}",
                        "width": 35
                    },
                    {
                        "field": "tglinputdiagnosa",
                        "title": "Tgl. Input",
                        "width": "85px",
                    },
                    {
                        "field": "jenisdiagnosa",
                        "title": "Jenis Diagnosis",
                        "width": 150
                    }, {
                        "field": "kddiagnosa",
                        "title": "Kode Diagnosa",
                        "width": 150
                    }, {
                        "field": "namadiagnosa",
                        "title": "Nama Diagnosa"
                    }, {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": 150
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": 150
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas",
                        "width": "150px",
                    }

                ];
            // }
            // }
            // LoadData();

            $scope.gridDiagnosa1 =
                // {
                // columns: 
                [
                    {
                        "title": "#",
                        "template": "{{listGridDiagnosa1.indexOf(dataItem) + 1}}",
                        "width": 35
                    },
                    {
                        "field": "tglinputdiagnosa",
                        "title": "Tgl. Input",
                        "width": "85px",
                    },
                    {
                        "field": "kddiagnosatindakan",
                        "title": "Kode Diagnosa",
                        "width": 150
                    }, {
                        "field": "namadiagnosatindakan",
                        "title": "Nama Diagnosa"
                    }, {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": 150
                    },
                    {
                        "field": "keterangantindakan",
                        "title": "Keterangan",
                        "width": "100px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas",
                        "width": "150px",
                    }
                    // ,
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width" : "30px",
                    // },
                    // {
                    //     "field": "jenisDiagnosis.jenisDiagnosa",
                    //     "title": "Jenis Diagnosis",
                    //     "width": 150
                    // }, {
                    //     "field": "diagnosisPrimer.kdDiagnosa",
                    //     "title": "Kode Diagnosa",
                    //     "width": 150
                    // }, {
                    //     "field": "diagnosisPrimer.namaDiagnosa",
                    //     "title": "Nama Diagnosa"
                    // }, {
                    //     "field": "namaRuangan.namaruangan",
                    //     "title": "Ruangan",
                    //     "width": 150
                    // },
                    // {
                    //     command: {
                    //         text: "Hapus",
                    //         click: $scope.removeDiagnosa
                    //     },
                    //     title: "&nbsp;",
                    //     width: "100px"
                    // }
                ];

            $scope.cboInputDiagnosa = true;
            $scope.showInputDiagnosa = function () {

                if ($scope.currentAntrian == undefined) {
                    alert("Pilih data Pasien terlebih dahulu !")
                    return;
                }

                $scope.cboDiagnosa = true
                $scope.cboDiagnosa1 = true
                $scope.cboInputDiagnosa = false
                $scope.findBy = "0";
                $scope.findBy1 = "0";
                loaaaaaaad();
            }
            $scope.batal = function () {
                $scope.cboDiagnosa = false
                $scope.cboDiagnosa1 = false
                $scope.cboInputDiagnosa = true
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosisPrimer;
                delete $scope.item.namaRuangan;
                loaaaaaaad();
            }

            $scope.batal1 = function () {
                $scope.cboDiagnosa = false
                $scope.cboDiagnosa1 = false
                $scope.cboInputDiagnosa = true
                // delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosisPrimer1;
                delete $scope.item.namaRuangan1;
                loaaaaaaad();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.hapusDiagnosa = function () {

                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataSelected.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien', objDelete).then(function (e) {
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.keterangan;
                    // delete $scope.item.KodeDiagnosa;
                    delete $scope.item.namaRuangan;
                    // window.history.back();
                    $scope.dataSelected = {};
                    loaaaaaaad()
                })
                // loaaaaaaad();
            }

            $scope.hapusDiagnosa1 = function () {

                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataSelected1.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    // delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer1;
                    // delete $scope.item.keterangan1;
                    // delete $scope.item.KodeDiagnosa;
                    delete $scope.item.namaRuangan1;
                    // window.history.back();
                    $scope.dataSelected1 = {};
                    loaaaaaaad()
                })
                // loaaaaaaad();
            }

            $scope.SaveDiagnosa = function () {
                if ($scope.item.jenisDiagnosis == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.namaRuangan.objectruanganfk == undefined) {
                    alert("Pilih Nama Ruangan ulang!!")
                    return
                }
                // if ($scope.item.NamaDiagnosa == undefined) {
                //     alert("Pilih  Nama Diagnosa terlebih dahulu!!")
                //     return
                // }
                var norecDiagnosaPasien = "";
                if ($scope.dataSelected.norec_diagnosapasien != undefined) {
                    norecDiagnosaPasien = $scope.dataSelected.norec_diagnosapasien
                }

                var keterangan = "";
                if ($scope.item.keterangan == undefined) {
                    keterangan = "-"
                }
                else {
                    keterangan = $scope.item.keterangan
                }
                $scope.now = new Date();
                var norec_apd
                if ($scope.item.namaRuangan.norec_apd == undefined){
                    norec_apd = $scope.item.namaRuangan.details[0].norec_apd
                } else {
                    norec_apd = $scope.item.namaRuangan.norec_apd
                }
                norec_apd
                var detaildiagnosapasien = {
                    norec_dp: norecDiagnosaPasien,
                    // noregistrasifk: $scope.item.namaRuangan.details.norec_apd,
                    noregistrasifk: $scope.item.namaRuangan.details != undefined ? $scope.item.namaRuangan.details[0].norec_apd : norec_apd,
                    tglregistrasi: $scope.currentAntrian.tglregistrasi,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
                }
                var objSave =
                {
                    detaildiagnosapasien: detaildiagnosapasien,
                }

                medifirstService.post('registrasi/save-diagnosa-pasien', objSave).then(function (e) {
                    if($scope.item.jenisDiagnosis.id == 1){
                        medifirstService.post('tatarekening/sync-trandata-new', { noregistrasi: $scope.currentAntrian.noregistrasi }).then(function (e) {
                        }, function (err) {
                        })
                    }
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.keterangan;
                    // delete $scope.item.KodeDiagnosa;
                    // delete $scope.item.namaRuangan;
                    $scope.dataSelected = {};
                    loaaaaaaad()
                    loadDatas()

                    // window.history.back();
                })

            }

            $scope.SaveDiagnosa1 = function () {
                // if ($scope.item.jenisDiagnosis1 == undefined) {
                //     alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                //     return
                // }
                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.namaRuangan1.objectruanganfk == undefined) {
                    alert("Pilih Nama Ruangan ulang!!")
                    return
                }
                // if ($scope.item.NamaDiagnosa == undefined) {
                //     alert("Pilih  Nama Diagnosa terlebih dahulu!!")
                //     return
                // }
                var norecDiagnosaTindakanPasien = "";
                if ($scope.dataSelected1.norec_diagnosapasien != undefined) {
                    norecDiagnosaTindakanPasien = $scope.dataSelected1.norec_diagnosapasien
                }
                var keteranganTindakan = "-";
                if ($scope.item.keteranganTindakan != undefined) {
                    keteranganTindakan = $scope.item.keteranganTindakan
                }
                var norec_apd
                if ($scope.item.namaRuangan1.norec_apd == undefined){
                    norec_apd = $scope.item.namaRuangan1.details[0].norec_apd
                } else {
                    norec_apd = $scope.item.namaRuangan1.norec_apd
                }
                $scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    norec_dp: norecDiagnosaTindakanPasien,
                    noregistrasifk: $scope.item.namaRuangan1.details != undefined ? $scope.item.namaRuangan1.details[0].norec_apd : norec_apd,
                    objectpasienfk: $scope.item.namaRuangan1.details != undefined ? $scope.item.namaRuangan1.details[0].norec_apd : norec_apd,//$scope.listRuangan1[0].details[0].norec_apd,
                    tglpendaftaran: $scope.currentAntrian.tglregistrasi,
                    objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
                    keterangantindakan: keteranganTindakan,
                    // objectjenisdiagnosafk: $scope.item.jenisDiagnosis1.id,
                    // tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    // keterangan: $scope.item.keterangan
                }
                var objSave =
                {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
                }

                medifirstService.post('registrasi/save-diagnosa-tindakan-pasien', objSave).then(function (e) {
                    // delete $scope.item.jenisDiagnosis1;
                    delete $scope.item.diagnosisPrimer1;
                    // delete $scope.item.diagnosisPrimer22;
                    // delete $scope.item.keterangan1;
                    // delete $scope.item.KodeDiagnosa;
                    // delete $scope.item.namaRuangan;
                    $scope.dataSelected1 = {};
                    loaaaaaaad()
                    // window.history.back();
                })

            }

            $scope.simpanDiagnosa = function () {
                var norReg = ""
                if ($scope.currentAntrian.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.currentAntrian.noregistrasi;
                }
                var kddiagnosa = ""
                if ($scope.item.diagnosisPrimer != undefined) {
                    kddiagnosa = "&kddiagnosa=" + $scope.item.diagnosisPrimer.kdDiagnosa;
                }
                $scope.SaveDiagnosa();

            }

            $scope.simpanDiagnosa1 = function () {
                var norReg = ""
                if ($scope.currentAntrian.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.currentAntrian.noregistrasi;
                }
                var kddiagnosa = ""
                if ($scope.item.diagnosisPrimer1 != undefined) {
                    kddiagnosa = "&kddiagnosatindakan=" + $scope.item.diagnosisPrimer1.kdDiagnosaTindakan;
                }
                $scope.SaveDiagnosa1();

            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.sourceDiagnosisPrimer.add({
                        id: dataSelected.objectdiagnosafk,
                        kdDiagnosa: dataSelected.kddiagnosa,
                        namaDiagnosa: dataSelected.namadiagnosa,
                        noregistrasi: dataSelected.noregistrasi,
                        tglregistrasi: dataSelected.tglregistrasi,
                        objectruanganfk: dataSelected.objectruanganfk,
                        namaruangan: dataSelected.namaruangan,
                        norec_apd: dataSelected.norec_apd,
                        objectdiagnosafk: dataSelected.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected.norec_detaildpasien,
                        id: dataSelected.id,
                        kdprofile: dataSelected.kdprofile,
                        statusenabled: dataSelected.statusenabled,
                        kodeexternal: dataSelected.kodeexternal,
                        namaexternal: dataSelected.namaexternal,
                        norec: dataSelected.norec,
                        reportdisplay: dataSelected.reportdisplay,
                        objectjeniskelaminfk: dataSelected.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected.qdiagnosa
                    })
                    $scope.item.jenisDiagnosis = { id: dataSelected.objectjenisdiagnosafk, jenisDiagnosa: dataSelected.jenisdiagnosa }
                    $scope.item.diagnosisPrimer = {
                        id: dataSelected.objectdiagnosafk,
                        kdDiagnosa: dataSelected.kddiagnosa,
                        namaDiagnosa: dataSelected.namadiagnosa,
                        noregistrasi: dataSelected.noregistrasi,
                        tglregistrasi: dataSelected.tglregistrasi,
                        objectruanganfk: dataSelected.objectruanganfk,
                        namaruangan: dataSelected.namaruangan,
                        norec_apd: dataSelected.norec_apd,
                        objectdiagnosafk: dataSelected.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected.norec_detaildpasien,
                        id: dataSelected.id,
                        kdprofile: dataSelected.kdprofile,
                        statusenabled: dataSelected.statusenabled,
                        kodeexternal: dataSelected.kodeexternal,
                        namaexternal: dataSelected.namaexternal,
                        norec: dataSelected.norec,
                        reportdisplay: dataSelected.reportdisplay,
                        objectjeniskelaminfk: dataSelected.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected.qdiagnosa
                    }
                    $scope.item.diagnosisPrimer2 = { id: dataSelected.objectdiagnosafk, namaDiagnosa: dataSelected.namadiagnosa }
                    $scope.item.namaRuangan = ''
                    $scope.item.namaRuangan = {
                        noregistrasi: dataSelected.noregistrasi,
                        objectruanganfk: dataSelected.objectruanganfk,
                        namaruangan: dataSelected.namaruangan,
                        norec_apd: dataSelected.norec_apd,
                        keterangan: dataSelected.keterangan
                    }//  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                }

            }

            $scope.klikGrid1 = function (dataSelected1) {
                if (dataSelected1 != undefined) {
                    $scope.sourceDiagnosisPrimer1.add({
                        id: dataSelected1.objectdiagnosafk,
                        kdDiagnosaTindakan: dataSelected1.kddiagnosatindakan,
                        namaDiagnosaTindakan: dataSelected1.namadiagnosatindakan,
                        noregistrasi: dataSelected1.noregistrasi,
                        tglregistrasi: dataSelected1.tglregistrasi,
                        objectruanganfk: dataSelected1.objectruanganfk,
                        namaruangan: dataSelected1.namaruangan,
                        norec_apd: dataSelected1.norec_apd,
                        objectdiagnosafk: dataSelected1.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected1.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected1.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected1.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected1.norec_detaildpasien,
                        id: dataSelected1.id,
                        kdprofile: dataSelected1.kdprofile,
                        statusenabled: dataSelected1.statusenabled,
                        kodeexternal: dataSelected1.kodeexternal,
                        namaexternal: dataSelected1.namaexternal,
                        norec: dataSelected1.norec,
                        reportdisplay: dataSelected1.reportdisplay,
                        objectjeniskelaminfk: dataSelected1.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected1.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected1.qdiagnosa,
                        keterangantindakan: dataSelected1.keterangantindakan
                    })

                    $scope.item.jenisDiagnosis1 = { id: dataSelected1.objectjenisdiagnosafk, jenisDiagnosa: dataSelected1.jenisdiagnosa }
                    $scope.item.diagnosisPrimer1 = {
                        id: dataSelected1.objectdiagnosafk,
                        kdDiagnosaTindakan: dataSelected1.kdDiagnosaTindakan,
                        namaDiagnosaTindakan: dataSelected1.namaDiagnosaTindakan,
                        noregistrasi: dataSelected1.noregistrasi,
                        tglregistrasi: dataSelected1.tglregistrasi,
                        objectruanganfk: dataSelected1.objectruanganfk,
                        namaruangan: dataSelected1.namaruangan,
                        norec_apd: dataSelected1.norec_apd,
                        objectdiagnosafk: dataSelected1.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected1.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected1.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected1.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected1.norec_detaildpasien,
                        id: dataSelected1.id,
                        kdprofile: dataSelected1.kdprofile,
                        statusenabled: dataSelected1.statusenabled,
                        kodeexternal: dataSelected1.kodeexternal,
                        namaexternal: dataSelected1.namaexternal,
                        norec: dataSelected1.norec,
                        reportdisplay: dataSelected1.reportdisplay,
                        objectjeniskelaminfk: dataSelected1.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected1.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected1.qdiagnosa,
                        keterangantindakan: dataSelected1.keterangantindakan
                    }

                    $scope.item.diagnosisPrimer2 = { id: dataSelected1.objectdiagnosafk, namaDiagnosaTindakan: dataSelected1.namaDiagnosaTindakan }
                    $scope.item.namaRuangan1 = ''
                    $scope.item.namaRuangan1 = {
                        noregistrasi: dataSelected1.noregistrasi,
                        objectruanganfk: dataSelected1.objectruanganfk,
                        namaruangan: dataSelected1.namaruangan,
                        norec_apd: dataSelected1.norec_apd
                    }//  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                    $scope.item.keteranganTindakan = dataSelected1.keterangantindakan
                }

            }

            $scope.toogleKlikIcd = function (current) {
                if ($scope.currentAntrian) {
                    if (current) {
                        if (current.indexOf('9') >= 0) {
                            $scope.daftarInputIcd9 = new kendo.data.DataSource({
                                data: [],
                                pageSize: 15,
                                change: function (e) {
                                    if (e.items.length > 0) {
                                        $scope.showSimpanIcd9 = true;
                                    } else {
                                        $scope.showSimpanIcd9 = false;
                                    }
                                }
                            });
                            $scope.pilihIcd9 = true;
                        } else if (current.indexOf('10') >= 0) {
                            $scope.daftarInputIcd10 = new kendo.data.DataSource({
                                data: [],
                                pageSize: 15,
                                change: function (e) {
                                    if (e.items.length > 0) {
                                        $scope.showSimpanIcd10 = true;
                                    } else {
                                        $scope.showSimpanIcd10 = false;
                                    }
                                }
                            });
                            $scope.pilihIcd10 = true;
                        }
                    } else {
                        delete $scope.pilihIcd9;
                        delete $scope.pilihIcd10;
                    }
                    $scope.klikInputDiagnosis = !$scope.klikInputDiagnosis;
                } else {
                    messageContainer.error('Antrian belum dipilih');
                }
            }

            $scope.tambahDataBaruDiagnosa = function (page) {
                if (page === 'icd9') {
                    var listRawRequired = [
                        "item.diagnosisTindakan|k-ng-model|Diagnosa"
                    ]
                    var isValid = ModelItem.setValidation($scope, listRawRequired);
                    if (isValid.status) {
                        $scope.daftarInputIcd9.add({
                            diagnosisTindakan: $scope.item.diagnosisTindakan,
                            keterangan: $scope.item.keteranganDiagnosis
                        })
                        delete $scope.item.diagnosisTindakan;
                        delete $scope.item.keteranganDiagnosis;
                    } else {
                        ModelItem.showMessages(isValid.messages);
                    }
                } else if (page === 'icd10') {
                    var listRawRequired = [
                        "item.jenisDiagnosis|k-ng-model|Jenis Diagnosa",
                        "item.diagnosisPrimer|k-ng-model|Nama Diagnosa"
                    ]
                    var isValid = ModelItem.setValidation($scope, listRawRequired);
                    if (isValid.status) {
                        $scope.daftarInputIcd10.add({
                            jenisDiagnosis: $scope.item.jenisDiagnosis,
                            diagnosis: $scope.item.diagnosisPrimer,
                            keterangan: $scope.item.keteranganDiagnosis
                        })
                        delete $scope.item.jenisDiagnosis;
                        delete $scope.item.diagnosisPrimer;
                        delete $scope.item.keteranganDiagnosis;
                    } else {
                        ModelItem.showMessages(isValid.messages);
                    }
                }
            }


            $scope.setToLocalGrid = function (page, items) {
                var grid;
                if (page.indexOf('9') > 0) {
                    grid = $scope.listIcd9
                } else if (page.indexOf('10') > 0) {
                    grid = $scope.listIcd10
                }
                items.forEach(function (elemen) {
                    grid.add(elemen);
                    grid.sync();
                })
            }

            $scope.Anamnesis = function () {
                medifirstService.get("registrasi/get-anamnesis?norec_pd=" + $scope.currentAntrian.norec_pd
                    , true).then(function (dat) {
                        let array = dat.data.data;
                        $scope.sourceAnamnesis = new kendo.data.DataSource({
                            data: array
                        });
                    })
                $scope.popUpAnamnesis.center().open()
            }
            $scope.gridAnamnesis = {
                pageable: true,
                columns: [
                    {
                        "field": "tglinput",
                        "title": "Tgl / Jam",
                        "width": "100px"
                    }, {
                        "field": "namalengkap",
                        "title": "Petugas",
                        "width": "150px"
                    }, {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "150px"
                    }, {
                        "field": "anamnesisdokter",
                        "title": "Anamnesis",
                        "width": "400px"
                    }
                ]
            };
            $scope.resumeMedis = function () {
                $q.all([
                    medifirstService.get("registrasi/get-resume-medis-inap/" + $scope.currentAntrian.nocm)
                ]).then(function (res) {
                    if (res[0].statResponse) {
                        var result = res[0].data.data
                        if (result.length > 0) {
                            for (let index = 0; index < result.length; index++) {
                                result[index].no = index + 1
                            }
                        }

                        $scope.sourceResumeHead = new kendo.data.DataSource({
                            data: result,
                            pageSize: 20,

                        });
                    }

                    $scope.isRouteLoading = false;
                }, (error) => {
                    $scope.isRouteLoading = false;
                    throw error;
                })
                $scope.popUpResume.center().open()

            }
            $scope.tutupPop = function () {
                $scope.popUpResume.close()
                $scope.popUpAnamnesis.close()
            }
            $scope.resumeOptHead = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="showInput()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                // },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tglresume", title: "Tgl Resume", width: 150 },
                    { field: "koderesume", title: "Kode Resume", width: 150 },
                    { field: "noregistrasi", title: "No Registrasi", width: 150 },
                    { field: "namaruangan", title: "Ruangan", width: 150 },
                    { field: "namadokter", title: "Pegawai", width: 150 },
                    { field: "ringkasanriwayatpenyakit", title: "Ringkasan Riwayat Penyakit", width: 250 },
                    { field: "pemeriksaanfisik", title: "Pemerisaan Fisik", width: 250 },
                    { field: "pemeriksaanpenunjang", title: "Pemerisaan Penunjang", width: 250 },
                    { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 250 },
                    { field: "diagnosisawal", title: "Diagnosi Awal", width: 150 },
                    { field: "diagnosissekunder", title: "Diagnosis Sekunder", width: 150 },
                    { field: "diet", title: "Diet", width: 150 },
                    { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 150 },
                    { field: "hasillab", title: "Hasil Lab", width: 150 },
                    { field: "instruksianjuran", title: "Intruksi", width: 150 },
                    { field: "kondisiwaktukeluar", title: "Kondisi Keluar", width: 150 },
                    { field: "pengobatandilanjutkan", title: "Pengobatan Dilanjutkan", width: 150 },
                    { field: "tindakanprosedur", title: "Tindakan Prosedur", width: 150 },
                    { field: "terapi", title: "Terapi", width: 120 },

                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusHead }, { name: "edit", text: "Edit", click: editHead }], title: "&nbsp;", width: 120 }
                ],

            };

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        { field: "no", title: "No", width: 40 },
                        { field: "namaobat", title: "Nama Obat", width: 200 },
                        { field: "jumlah", title: "Jumlah", width: 120 },
                        { field: "dosis", title: "Dosis", width: 120 },
                        { field: "frekuensi", title: "Frekuensi", width: 120 },
                        { field: "carapemberian", title: "Cara Pemberian", width: 150 },
                    ]
                }
            };
            // ****ENDDDDDD

        }
    ]);
});