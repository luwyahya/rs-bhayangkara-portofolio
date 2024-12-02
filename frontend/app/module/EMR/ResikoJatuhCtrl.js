define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('ResikoJatuhCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'DateHelper', '$parse',
        function($q, $rootScope, $scope, $state, cacheHelper, medifirstService, DateHelper, $parse) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglOperasi = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            var namaemrfix = $state.params.namaEMR;
            var data2 = [];
            var nyariUrl = ''
            $scope.PegawaiLogin2 = {};
            LoadCacheHelper();
            $scope.isEdit = false

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRekamMedis');
                if (chacePeriode != undefined) {
                    $scope.noCM = chacePeriode[0]
                    $scope.namaPasien = chacePeriode[1]
                    $scope.jenisKelamin = chacePeriode[2]
                    $scope.noregistrasi = chacePeriode[3]
                    $scope.umur = chacePeriode[4]
                    $scope.kelompokPasien = chacePeriode[5]
                    $scope.tglRegistrasi = chacePeriode[6]
                    $scope.norec_pd = chacePeriode[8]
                    $scope.idKelas = chacePeriode[9]
                    $scope.kelas = chacePeriode[10]
                    $scope.idRuangan = chacePeriode[11]
                    $scope.namaRuangan = chacePeriode[12]

                }

                init()
            }

            function loadGrid() {
                $scope.isRouteLoading = true
                medifirstService.get('emr/get-resiko-jatuh/' + $scope.noCM  ).then(function(data) {
                    $scope.isRouteLoading = false
                    $scope.sourcePAP = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                    });
                })

            }

   
             $scope.munculpopup = function() {
                  medifirstService.get('emr/get-risk-down?namaexternal=resikojatuh').then(function(data) {   
                  
                        $scope.datapengkajian = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 10,
                        });
                    });   
                $scope.popuppengkajian.center().open()
             }
               $scope.columnDaftarPengkajian = [{
                    "field": "caption",
                    "title": "Caption",
                    "width": "20px"
                },
                
            ];
        
            function init() {
                loadGrid()

                $scope.PegawaiLogin2 = JSON.parse(localStorage.getItem('pegawai'))

                // $scope.treeSourceRuangan = [];
                // medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=pengkajianpasienigd").then(function(e) {
                //     var inlineDefault = new kendo.data.HierarchicalDataSource({
                //         data: e.data.data,
                //         schema: {
                //             model: {
                //                 children: "child",
                //                 expanded: true
                //             }
                //         }
                //     });
                //     $scope.treeSourceBedah = inlineDefault
                //     $scope.mainTreeViewBedahOption = {
                //             dataTextField: ["caption"],
                //             datakKeyField: ["id"],
                //             select: onSelect,
                //             dragAndDrop: true,
                //             checkboxes: false
                //         }
                //         // var treeview = $("#treeview").data("kendoTreeView");
                //         // .expandPath([2, 5])
                // })



            }

            $scope.kl = function(current) {
                $scope.isEdit = false
                $scope.isSemua = true
                if (current.idruangangrid == $scope.idRuangan) { $scope.isEdit = true }

                $scope.norecAPD = current.objectnoregistrasifk;
                $scope.current = current;
                $state.params.kdPap = current.kdpap;
                $state.params.noRecRiwayatPap = current.norec;
                $scope.noRecRiwayatPap = $scope.current.norec;
                $scope.pasienId = $scope.current.objectpasienfk
                $state.go("RekamMedis.ResikoJatuh");
            }

            $scope.Lihat = function() {
                medifirstService.get('emr/get-risk-down-pengkajian?id=' + $scope.current.emrfk  ).then(function(data) {
                    nyariUrl = data.data.data[0].reportdisplay

                    cacheHelper.set('noRecPapNew', $scope.noRecRiwayatPap);
                    if ($scope.noRecRiwayatPap) {
                        $scope.myVar = 2
                        var noemr2 = '-'
                        if ($scope.dataSelected != undefined) {
                            noemr2 = $scope.dataSelected.noemr
                        }
                        var url = nyariUrl;

                        cacheHelper.set('dataVOloaded', true);
                        $state.params.dataVOloaded = true
                        $state.go(url, {
                            namaEMR: $state.params.nomorEMR,
                            nomorEMR: $state.params.nomorEMR,
                            norecAPD: $state.params.noRec,
                            noRec: $state.params.noRec,
                            dataVOloaded: true
                        });

                        var arrStr = {
                            0:  $scope.current.noregistrasi
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                    } else {
                        window.messageContainer.error('Riwayat PAP belum dipilih')
                    }
                }).catch(function(error) {
                    toastr.error('Error:', error);
                    window.messageContainer.error('Terjadi kesalahan saat mengambil data');
                });
            }

            $scope.munculpopup = function() {
                medifirstService.get('emr/get-risk-down?namaexternal=resikojatuh').then(function(data) {   
                    $scope.datapengkajian = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                    });
                });   
                $scope.popuppengkajian.center().open()
            }

            $scope.klikpengkajian = function(pilihpengkajian) {
                
                $scope.pilihpengkajian = pilihpengkajian;
               
            }
            $scope.create = function() {
                // $scope.isEdit = true
                // $scope.isHemodialisa = false
                // $scope.isTHT = false
                // $scope.isKulit = false
                // $scope.isAnak = false
                // $scope.isJantung = false
                // $scope.isKebidanan = false
                // $scope.isSaraf = false
                // $scope.isNotSaraf = true
                // $scope.isSemua = true
                // $scope.isRehab = false
                // $scope.isMata = false
                // $scope.isGigi = false
                // $scope.isIGD = false
                // if ($scope.idRuangan == 12 || $scope.idRuangan == 97 || $scope.idRuangan == 5 || $scope.idRuangan == 17 || $scope.idRuangan == 89 || $scope.idRuangan == 319 || $scope.idRuangan == 461 || $scope.idRuangan == 555 || $scope.idRuangan == 130) { $scope.isHemodialisa = true }
                // if ($scope.idRuangan == 446 || $scope.idRuangan == 13 || $scope.idRuangan == 3 || $scope.idRuangan == 33) { $scope.isJantung = true }
                // if ($scope.idRuangan == 26) { $scope.isTHT = true }
                // if ($scope.idRuangan == 19) { $scope.isSaraf = true, $scope.isNotSaraf = false }
                // if ($scope.idRuangan == 25) { $scope.isKulit = true }
                // if ($scope.idRuangan == 7) { $scope.isAnak = true }
                // if ($scope.idRuangan == 552 || $scope.idRuangan == 14 || $scope.idRuangan == 595) { $scope.isKebidanan = true, $scope.isSemua = false }
                // if ($scope.idRuangan == 28) { $scope.isRehab = true }
                // if ($scope.idRuangan == 8) { $scope.isMata = true }
                // if ($scope.idRuangan == 27 || $scope.idRuangan == 461 || $scope.idRuangan == 607) { $scope.isGigi = true }
                // if ($scope.idRuangan == 29 || $scope.idRuangan == 309) { $scope.isIGD = true }
                var tmp = {
                    "norec": '',
                    "tglregistrasi": DateHelper.getPeriodeFormatted(new Date()),
                    "nocm": $scope.noCM,
                    "objectruanganfk": $scope.idRuangan,
                    "noregistrasifk": $state.params.noRec,
                    "pegawaifk": $scope.PegawaiLogin2.id,
                    "emrfk":  $scope.pilihpengkajian.id,
                }

                medifirstService.post('emr/save-pengkajianpasien', tmp).then(function(response) {
                    cacheHelper.set('noRecPapNew', response.data.pap.norec);
                    loadGrid()

                    var flag = 'new'
                    $scope.myVar = 2
                    var noemr2 = '-'
                     var url = $scope.pilihpengkajian.reportdisplay;
                    $state.go(url, {
                        namaEMR: $state.params.nomorEMR,
                        nomorEMR: $state.params.nomorEMR,
                        norecAPD: $state.params.noRec,
                        noRec: $state.params.noRec + '-' + flag,
                        dataVOloaded: true,
                    });
                    var arrStr = {
                        0:  $scope.noregistrasi
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    
                    $scope.popuppengkajian.close()
                    cacheHelper.set('cacheNomorEMR', arrStr);

                })

            }


            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }




            $scope.mainGridOptions = {
                pageable: true,
                columns: [{
                        "field": "noemr",
                        "title": "No EMR",
                        "width": "20%"
                    }, 
                    {
                        "field": "tglemr",
                        "title": "Tgl Resiko Jatuh",
                        "width": "20%",
                        // template: "#= new moment(tglinput).format(\'DD-MM-YYYY HH:mm\') #",
                    }, {
                        "field": "noregistrasifk",
                        "title": "No Registrasi",
                        "width": "15%"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "35%"
                    },
                     {
                        "field": "caption",
                        "title": "Jenis Resiko Jatuh",
                        "width": "25%"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas EMR",
                        "width": "25%"
                    },
                    {
                        "command": [{
                            text: "Hapus",
                            click: hapusData,
                            imageClass: "k-icon k-delete"
                        }],
                        title: "",
                        width: "100px",
                    }
                ]
            };

            function hapusData(e) {
                // if (loginITI ==false){
                // 	toastr.error('Tidak Bisa Menghapus Data','Info')
                // 	return
                // }
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var itemDelete = {
                    "norec": dataItem.norec
                }

                medifirstService.post('emr/hapus-pengkajianpasien', itemDelete).then(function(e) {
                    if (e.status === 201) {
                        loadGrid()

                        grid.removeRow(row);
                    }
                })

            }
            $scope.detailGridOptions = function(dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "300px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        }
                    ]
                };
            };
            $scope.back = function() {
                window.history.back();
            }
            $scope.order = function() {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function() {

            }

            $scope.klikGrid = function(dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                for (var i = $scope.listLayanan.length - 1; i >= 0; i--) {
                    if ($scope.listLayanan[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listLayanan[i]
                        break;
                    }
                }
                $scope.item.layanan = dataProduk; //{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 

                $scope.item.qty = dataSelected.qtyproduk
                $scope.item.pemeriksaanKeluar = dataSelected.pemeriksaanluar == 1 ? true : false
            }

            function onSelect(e) {
                // ;
                var data3 = e.sender.dataSource._data
                    // var itm = findObjectByKey(data3, 'uid', "245421fd-68db-4d25-8afc-dbe1d20a2056");
                var uid_select = e.node.dataset.uid
                var idTree = '';
                var urlTrue = null;
                for (var i = data3.length - 1; i >= 0; i--) {

                    if (uid_select == data3[i].uid) {
                        idTree = data3[i].id
                        urlTrue = data3[i].reportdisplay
                        break;
                    }
                    if (data3[i].child != undefined) {
                        for (var ii = data3[i].child.length - 1; ii >= 0; ii--) {
                            if (uid_select == data3[i].child[ii].uid) {
                                idTree = data3[i].child[ii].id
                                urlTrue = data3[i].child[ii].reportdisplay
                                break;
                            }
                            if (data3[i].child[ii].child != undefined) {
                                for (var iii = data3[i].child[ii].child.length - 1; iii >= 0; iii--) {
                                    if (uid_select == data3[i].child[ii].child[iii].uid) {
                                        idTree = data3[i].child[ii].child[iii].id
                                        urlTrue = data3[i].child[ii].child[iii].reportdisplay
                                        break;
                                    }
                                    for (var iiii = data3[i].child[ii].child[iii].child.length - 1; iiii >= 0; iiii--) {
                                        if (uid_select == data3[i].child[ii].child[iii].child[iiii].uid) {
                                            idTree = data3[i].child[ii].child[iii].child[iiii].id
                                            urlTrue = data3[i].child[ii].child[iii].child[iiii].reportdisplay
                                            break;
                                        }
                                    }
                                }
                            }

                        }
                    }

                }
                var noemr = '-'
                if ($scope.dataSelected != undefined) {
                    noemr = $scope.dataSelected.noemr
                }
                if (urlTrue == null) {
                    // $state.go("RekamMedis.PengkajianPasienNew.PengkajianPasienNewDetail", {
                    //     namaEMR: idTree,
                    //     nomorEMR: noemr
                    // });
                } else {
                    // $scope.currentState = state;
                    var arrStr = {
                            0: $scope.header.nocm,
                            1: $scope.header.namapasien,
                            2: $scope.header.jeniskelamin,
                            3: $scope.header.tgllahir,
                            4: $scope.header.umur,
                            5: $scope.header.alamatlengkap,
                            6: $scope.header.notelepon,
                        }
                        // cacheHelper.set('RekamMedisIGDCtrl', arrStr);   

                    $scope.myVar = 2
                    var noemr2 = idTree

                    $state.go(urlTrue, {
                        namaEMR: noemr2,
                        nomorEMR: noemr2,
                        norecAPD: $state.params.noRec,
                        noRec: $state.params.noRec,
                    });

                    var arrStr = {
                        0: noemr2
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                }




            }
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1