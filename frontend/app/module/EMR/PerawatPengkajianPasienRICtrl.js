define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('PerawatPengkajianPasienRICtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'DateHelper', '$parse',
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
            $scope.PegawaiLogin2 = {};
            LoadCacheHelper();

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
             
             $scope.columnDaftarPengkajian = [{
                    "field": "caption",
                    "title": "Caption",
                    "width": "20px"
                },
                
            ];
            function loadGrid() {
                debugger
                $scope.isRouteLoading = true
                    // if (namaemrfix != undefined) {
                  
                // medifirstService.get('emr/get-pengkajianpasienri/' + $scope.noCM + '/' + $state.params.nomorEMR).then(function(data) {
                    medifirstService.get('emr/get-pengkajianpasienriallperawat/' + $scope.noCM ).then(function(data) {  
                        $scope.isRouteLoading = false
                        var arrNoregistrasi = [];
                        var arrPAP = [];
                        var arrNoregistrasii = {};
                        var arrPAPP = {};
                        for (var i = 0; i < data.data.data.length; i++) {
                            if (arrNoregistrasii.noregistrasi != data.data.data[i].noregistrasi) {
                                for (var x = 0; x < data.data.data.length; x++) {
                                    if (data.data.data[i].noregistrasi == data.data.data[x].noregistrasi) {
                                        arrPAPP = {
                                            idruangangrid: data.data.data[x].idruangangrid,
                                            kdpap: data.data.data[x].kdpap,
                                            namalengkap: data.data.data[x].namalengkap,
                                            namapasien: data.data.data[x].namapasien,
                                            namaruangan: data.data.data[x].namaruangan,
                                            nocm: data.data.data[x].nocm,
                                            norec: data.data.data[x].norec,
                                            noregistrasi: data.data.data[x].noregistrasi,
                                            objectnoregistrasifk: data.data.data[x].objectnoregistrasifk,
                                            objectpasienfk: data.data.data[x].objectpasienfk,
                                            pegawaifk: data.data.data[x].pegawaifk,
                                            tglinput: data.data.data[x].tglinput,
                                            tglregistrasi: data.data.data[x].tglregistrasi,
                                            caption: data.data.data[x].caption,
                                            url: data.data.data[x].url,
                                            idemr: data.data.data[x].idemr,
                                            kodeexternal: data.data.data[x].kodeexternal,
                                            
                                        };
                                        arrPAP.push(arrPAPP)
                                    }
                                }
                                arrNoregistrasii = {
                                    noregistrasi: data.data.data[i].noregistrasi,
                                    tglregistrasi: data.data.data[i].tglregistrasi,
                                    namaruangan: data.data.data[i].namaruangan,
                                    //  caption: data.data.data[x].caption,
                                    kodepap: arrPAP
                                };
                                arrNoregistrasi.push(arrNoregistrasii)
                                arrPAP = [];
                            }
                        }
                        $scope.dataSource2 = arrNoregistrasi;
                        $scope.sourcePAP = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 10,
                        });
                    })
            }


            function init() {
                loadGrid()

                $scope.PegawaiLogin2 = JSON.parse(localStorage.getItem('pegawai'))

                $scope.treeSourceRuangan = [];
                // medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=pengkajianpasienRI").then(function(e) {


                //     var datasss = e.data.data;
                //     for (var i = 0; i < datasss.length; i++) {
                //         if (datasss[i].id == 522) {
                //             if ($scope.item.Askep == true) {
                //                 datasss[i].expanded = true;
                //             } else {
                //                 datasss[i].expanded = false;
                //             }
                //         } else {
                //             datasss[i].expanded = true;
                //         }
                //     }


                //     var inlineDefault = new kendo.data.HierarchicalDataSource({
                //         data: datasss,
                //         schema: {
                //             model: {
                //                 children: "child",
                //                 expanded: "expanded",
                //                 imageUrl: "namaexternal"
                //             }
                //         }
                //     });

                //     ;

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
                if (current.objectnoregistrasifk != $state.params.noRec) { $scope.isEdit = false }
                $scope.norecAPD = current.objectnoregistrasifk;
                $scope.current = current;
                $state.params.kdPap = current.kdpap;
                $state.params.noRecRiwayatPap = current.norec;
                $scope.noRecRiwayatPap = $scope.current.norec;
                $scope.pasienId = $scope.current.objectpasienfk

                $state.go("RekamMedis.PerawatPengkajianPasienRI");
                
            }
            $scope.Lihat = function() {
                debugger
                $state.params.noRecRiwayatPap = dataSelected.norec;
                if($scope.current.kodeexternal == "isortho"){
                    $scope.isOrtho = true 
                    $scope.isUro = false
                    $scope.isJantung = false
                    $scope.isAnak = false
                    $scope.isDalam = false
                }else if($scope.current.kodeexternal == "isuro"){
                      $scope.isOrtho = false 
                    $scope.isUro = true
                    $scope.isJantung = false
                    $scope.isAnak = false
                    $scope.isDalam = false
                }else if($scope.current.kodeexternal == "isjantung"){
                      $scope.isOrtho = false 
                    $scope.isUro = false
                    $scope.isJantung = true
                    $scope.isAnak = false
                    $scope.isDalam = false
                }else if($scope.current.kodeexternal == "isanak"){
                      $scope.isOrtho = false 
                    $scope.isUro = false
                    $scope.isJantung = false
                    $scope.isAnak = true
                    $scope.isDalam = false
                }else if($scope.current.kodeexternal == "isdalam"){
                     $scope.isOrtho = false 
                    $scope.isUro = false
                    $scope.isJantung = false
                    $scope.isAnak = false
                    $scope.isDalam = true
                }
                cacheHelper.set('noRecPapNew', $scope.noRecRiwayatPap);
                if ($scope.noRecRiwayatPap) {
                    debugger


                    $scope.myVar = 2
                    var noemr2 = '-'
                    if ($scope.dataSelected != undefined) {
                        noemr2 = $scope.dataSelected.noemr
                    }
                    var url = $scope.current.url;

                    cacheHelper.set('dataVOloaded', true);
                    $state.params.dataVOloaded = true
                    $state.go(url, {
                        namaEMR: $scope.current.idemr,
                        nomorEMR: $scope.current.idemr,
                        norecAPD: $state.params.noRec,
                        noRec: $state.params.noRec,
                        dataVOloaded: true
                    });
                    $scope.myVar = 1
                    var arrStr = {
                        0: noemr2
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                } else {
                    window.messageContainer.error('Riwayat PAP belum dipilih')
                }



            }
            
             $scope.munculpopup = function() {
                  medifirstService.get('emr/get-daftarpengkajianrawatinap?namaexternal=perawatri').then(function(data) {   
                  
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
            $scope.str_replace = function(search, replace, subject) {
                return subject.split(search).join(replace);
            };
            
            $scope.create = function() {
                $scope.isEdit = true;
                $scope.isSemua = true;
            debugger
                cacheHelper.set('dataVOloaded', true);
                var tmp = {
                    "norec": '',
                    "tglregistrasi": DateHelper.getPeriodeFormatted(new Date()),
                    "nocm": $scope.noCM,
                    "objectruanganfk": $scope.idRuangan,
                    "noregistrasifk": $scope.str_replace('-new', '', $state.params.noRec), // Perbaikan di sini
                    "pegawaifk": $scope.PegawaiLogin2.id,
                    "emrfk": $scope.pilihpengkajian.id
                };
            
            
                
                medifirstService.post('emr/save-pengkajianpasien', tmp).then(function(response) {
                    cacheHelper.set('noRecPapNew', response.data.pap.norec);
                   

                    // $scope.myVar = 2
                    // var noemr2 = '-'
                    // $state.go("RekamMedis.PengkajianPasienRI.AsesmenRI", {
                    //     namaEMR: 94,
                    //     nomorEMR: noemr2
                    // });
                    //;
                    // var namaemr = $state.params.namaEMR;
                    // var url = $state.current.name;
                    var url = $scope.pilihpengkajian.reportdisplay
                    $state.params.dataVOloaded = true
                    $state.go(url, {
                        namaEMR:  $scope.pilihpengkajian.id,
                        nomorEMR: $scope.pilihpengkajian.id,
                        norecAPD: $scope.str_replace('-new', '', $state.params.noRec),
                        noRec: $scope.str_replace('-new', '', $state.params.noRec),
                        dataVOloaded: true
                    });

                    var arrStr = {
                        0: $scope.pilihpengkajian.id
                    }
                    
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    $scope.popuppengkajian.close()
                    loadGrid()
                })

            }


            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }




            $scope.mainGridOptions = {
                pageable: true,
                columns: [{
                        "field": "kdpap",
                        "title": "Kode PAP",
                        "width": "15%"
                    }, {
                        "field": "tglinput",
                        "title": "Tgl Pengkajian Awal",
                        "width": "20%",
                        template: "#= new moment(tglinput).format(\'DD-MM-YYYY HH:mm\') #",
                    }, {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "15%"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "25%"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas",
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
            $scope.columnNoregistrasi = [{
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50%"
                }, {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "20%",
                    template: "#= new moment(tglregistrasi).format(\'DD-MM-YYYY HH:mm\') #",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "25%"
                },
                // {
                //     "command": [{
                //         text: "Hapus",
                //         click: hapusData,
                //         imageClass: "k-icon k-delete"
                //     }],
                //     title: "",
                //     width: "100px",
                // }
                
            ];
            $scope.data2 = function(dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.kodepap
                    }),
                    pageable: true,
                    columns: [{
                            "field": "kdpap",
                            "title": "Kode PAP",
                            "width": "15%"
                        }, {
                            "field": "tglinput",
                            "title": "Tgl Pengkajian Awal",
                            "width": "20%",
                            template: "#= new moment(tglinput).format(\'DD-MM-YYYY HH:mm\') #",
                        }, {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "15%"
                        },{
                            "field": "caption",
                            "title": "Pengkajian",
                            "width": "25%"
                        },
                        {
                            "field": "namaruangan",
                            "title": "Ruangan",
                            "width": "25%"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Petugas",
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
                }
            };
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
            $scope.onChange = function() {

            }
            $scope.getListRuanganByDp = function() {
                ;
                $scope.listRuangan = $scope.item.departemen.ruangan
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
                var data3 = e.sender.dataSource._data
                ;
                // var itm = findObjectByKey(data3, 'uid', "245421fd-68db-4d25-8afc-dbe1d20a2056");
                var uid_select = e.node.dataset.uid
                var idTree = '';
                var urlTrue = null;
                for (var i = data3.length - 1; i >= 0; i--) {
                    if (uid_select == data3[i].uid) {
                        ;
                        idTree = data3[i].id
                        urlTrue = data3[i].reportdisplay
                        if (data3[i].id == 522) {
                            ;
                            $scope.item.Askep = true;
                            init();
                            $scope.myVar = 2;
                            ;
                        }
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