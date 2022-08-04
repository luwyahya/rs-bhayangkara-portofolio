define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarLaporanInsidenInternalCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.showFilter = false;
            $scope.tglMeninggal = '';
            var norecInsiden = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            loadCombo();
            loadFirst();
            loadData();
            loadKonsul();
            loadGridKonsul();


            function loadCombo() {
                medifirstService.get("pmkp/get-data-combo-pmkp")
                    .then(function (data) {                        
                        $scope.KelompokUser = medifirstService.getKelompokUser();
                        $scope.PegawaiLogin = medifirstService.getPegawaiLogin();
                        var datas = data.data;    //get-datacombo-ruangan                    
                        if (datas.kdUser == $scope.KelompokUser) {
                            $scope.showFilter = true;
                            loadKonsul();
                            medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                                $scope.listRuangan = data;
                            });
                        } else {
                            $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                            $scope.ruangan = $scope.listRuangan[0]['id']
                            $scope.item.ruangan = $scope.ruangan
                            loadData();
                        }
                    })
            }

            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarLaporanInsidenInternalCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }

            function loadData() {
                loadGridKonsul();
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.item.ruangan.value
                }

                if ($scope.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.ruangan
                }

                // var UsrPelapor = ""
                // if ($scope.PegawaiLogin != undefined) {
                //     UsrPelapor = "&idPelapor=" + $scope.PegawaiLogin.id
                // }

                medifirstService.get("pmkp/get-data-insiden-internal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    namaruangan).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i + 1
                            if (doto[i].lk_norec == null){
                                doto[i].status = '--'
                            }else {
                                doto[i].status = 'Tertindaklanjut'
                            }
                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: doto,
                            group: $scope.group,
                            pageSize: 50,
                            total: doto.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        // jumlah: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                // { field: 'jumlah', aggregate: 'sum' },
                            ]
                        })
                    });
            };

            $scope.SearchData = function () {
                loadData();
            }

            $scope.InsidenBaru = function () {
                loadGridKonsul();
                $scope.winKonsul.center().open()
            }

            function loadKonsul() {
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.item.ruangan.value
                }

                if ($scope.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.ruangan
                }

                // var UsrPelapor = ""
                // if ($scope.PegawaiLogin != undefined) {
                //     UsrPelapor = "&idPelapor=" + $scope.PegawaiLogin.id
                // }

                medifirstService.get("pmkp/get-data-insiden-internal-baru?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i + 1
                            if (doto[i].norec_lk != null) {
                                doto.splice([i], 1)
                            }
                            if (doto.length > 0) {
                                $scope.showNotif = true
                                $scope.lengthInsiden = doto.length
                            } else
                                $scope.showNotif = false
                        }
                    })
            }

            function loadGridKonsul() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.item.ruangan.value
                }

                if ($scope.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.ruangan
                }

                // var UsrPelapor = ""
                // if ($scope.PegawaiLogin != undefined) {
                //     UsrPelapor = "&idPelapor=" + $scope.PegawaiLogin.id
                // }

                medifirstService.get("pmkp/get-data-insiden-internal-baru?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    namaruangan).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i + 1
                            if (doto[i].lk_norec == null){
                                doto[i].status = '--'
                            }else {
                                doto[i].status = 'Tertindaklanjut'
                            }

                            if (doto.length > 0) {
                                $scope.showNotif = true
                                $scope.lengthInsiden = doto.length
                            } else {
                                $scope.showNotif = false
                            }
                        }
                        $scope.sourceKonsul = new kendo.data.DataSource({
                            data: doto,
                            group: $scope.group,
                            pageSize: 50,
                            total: doto.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        // jumlah: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                // { field: 'jumlah', aggregate: 'sum' },
                            ]
                        })
                    });




                // var tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                // var tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');                
                // medifirstService.get("pmkp/get-data-insiden-internal?" +
                //     "tglAwal=" + tglAwal +
                //     "&tglAkhir=" + tglAkhir).then(function (data) {
                //         var doto = data.data.data;
                //         if (doto.length > 0) {
                //             var j = 0
                //             for (var i = 0; i < doto.length; i++) {
                //                 doto[j].no = j + 1
                //                 if (doto[j].norec_lk == null) {
                //                     doto[j].status = 'Belum Ditindaklanjuti'
                //                     j++
                //                 }
                //                 else
                //                     result.splice(j, 1)
                //             }
                //         }                        
                //         $scope.sourceKonsul = new kendo.data.DataSource({
                //             data: doto,
                //             pageSize: 20,
                //         });
                //     }, (error) => {
                //         throw error;
                //     })
            }

            $scope.group = {
                field: "jeniskeselamatan",
                aggregates: [{
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }, {
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }]
            };
            $scope.aggregate = [{
                field: "jeniskeselamatan",
                aggregate: "count"
            }, {
                field: "jeniskeselamatan",
                aggregate: "count"
            }]
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == 'Tertindaklanjut') { $(this).addClass('green') }
                    if ($(this).text() == '--') { $(this).addClass('koneng') }
                })
            }
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarLaporanInsidenInternal.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Laporan Insiden Internal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                dataBound: onDataBound,
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "40px",
                    },
                    {
                        "field": "tglinsiden",
                        "title": "Tgl Insiden",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglinsiden #')}}</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "220px",
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "100px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "220px",
                    },
                    {
                        "field": "insiden",
                        "title": "Insiden",
                        "width": "220px",
                    },
                    {
                        "field": "keselamatan",
                        "title": "Keselamatan",
                        "width": "220px",
                    },
                    {
                        "field": "status",
                        "title": "Status Tindak Lanjut",
                        "width": "100px",
                    },
                    {
                        hidden: true,
                        field: "jeniskeselamatan",
                        title: "Jenis Keselamatan",
                        aggregates: ["count"],
                        // groupHeaderTemplate: "Tindakan #= value # (Jumlah: #= count#)"
                    }
                ]
            };

            //Grid Insiden Baru
            var onDataBoundBaru = function () {
                $('td').each(function () {
                    if ($(this).text() == 'Tertindaklanjut') { $(this).addClass('green') }
                    if ($(this).text() == '--') { $(this).addClass('koneng') }
                })
            }
            $scope.konsulOpt = {
                dataBound: onDataBoundBaru,
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    // "field": "tglinsiden",                    
                    {
                        "field": "no",
                        "title": "No",
                        "width": "40px",
                    },
                    {
                        "field": "tglinsiden",
                        "title": "Tgl Insiden",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglinsiden #')}}</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "220px",
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "100px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "220px",
                    },
                    {
                        "field": "insiden",
                        "title": "Insiden",
                        "width": "220px",
                    },
                    {
                        "field": "keselamatan",
                        "title": "Keselamatan",
                        "width": "220px",
                    },
                    {
                        "field": "status",
                        "title": "Status Tindak Lanjut",
                        "width": "100px",
                    }
                    // { field: "no", title: "No", width: 40 },
                    // {
                    //     "field": "tglinsiden",
                    //     "title": "Tgl Insiden",
                    //     "width": "95px",
                    //     "template": "<span class='style-left'>{{formatTanggal('#: tglinsiden #')}}</span>"
                    // },
                    // {
                    //     "field": "nocm",
                    //     "title": "No Rm",
                    //     "width": "220px",
                    // },
                    // {
                    //     "field": "namapasien",
                    //     "title": "Nama Pasien",
                    //     "width": "220px",
                    // },
                    // {
                    //     "field": "insiden",
                    //     "title": "Insiden",
                    //     "width": "220px",
                    // },
                    // { field: "status", title: "Status", width: 120 },
                    // { command: [{ name: "tindak lanjuti", text: "Tindak Lanjuti", click: verif }], title: "&nbsp;", width: 120 }
                ],
            };

            function verif(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.status != 'Belum Ditindaklanjuti') {
                    toastr.error('Sudah di Tindak Lanjuti')
                    return
                }

                var chacePeriode = {
                    0: dataItem.norec,
                    1: 'TindakLanjut',
                    2: dataItem.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('LembarKerjaInvestigasiSederhanaCtrl', chacePeriode);
                $state.go('LembarKerjaInvestigasiSederhana', {
                    kpid: dataItem.norec,
                    noOrder: 'TindakLanjut'
                });
            }

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.editData = function () {
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'EditInsiden',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'EditInsiden'
                });
            }

            $scope.hapusData = function () {
                if ($scope.dataPasienSelected.norec_lk != undefined) {
                    messageContainer.error("Insiden Telah Ditindaklanjuti Tidak Bisa Dihapus!")
                    return
                }

                if ($scope.dataPasienSelected != undefined) {
                    var item = {
                        norec: $scope.dataPasienSelected.norec
                    }

                    medifirstService.post('pmkp/delete-data-insiden-internal', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.Lanjut = function () {
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'TindakLanjut',
                    2: $scope.dataPasienSelected.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('LembarKerjaInvestigasiSederhanaCtrl', chacePeriode);
                $state.go('LembarKerjaInvestigasiSederhana', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'TindakLanjut'
                });
            }

            $scope.tambahData = function () {
                $state.go('InsidenInternal', {});
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.Cetak = function(){
                debugger;
                $scope.pegawai = medifirstService.getPegawaiLogin();
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih !")
                    return
                }
                
                var stt = 'false'
                if (confirm('View Insiden Internal? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();                
                client.get('http://127.0.0.1:1237/printvb/pmkp?cetak-lap-insiden-keomite-mutu&norec=' + $scope.dataPasienSelected.norec + '&view=' + stt, function (response) {
                    //aadc=response; 

                });
            }

            $scope.Lihat= function(){
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'LihatInsiden',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'LihatInsiden'
                });
            }

            //** BATAS SUCI */                    
        }
    ]);
});