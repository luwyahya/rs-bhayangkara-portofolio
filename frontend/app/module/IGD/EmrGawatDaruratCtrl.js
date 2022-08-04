define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('EmrGawatDaruratCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService','$rootScope',
        function ($scope, $state, cacheHelper, medifirstService,$rootScope) {
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
            // $scope.header = {}
            var myVar = 0
            var detail = ''
            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            LoadCacheHelper();

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheHeader');
                if (chacePeriode != undefined) {
                    $scope.item.nocm = chacePeriode.nocm;
                    $scope.item.namaPasien = chacePeriode.namapasien;
                    $scope.item.jenisKelamin = chacePeriode.jeniskelamin;
                    $scope.item.tgllahir = moment( chacePeriode.tgllahir).format('YYYY-MM-DD');
                    $scope.item.umur = chacePeriode.umur;
                    $scope.item.alamatlengkap = chacePeriode.alamatlengkap;
                    $scope.item.notelepon = chacePeriode.notelepon;
                    init();
                } else {
                    init();
                }
            }

            function init() {
                medifirstService.get("emr/get-emr-transaksi?nocm=" + $scope.item.nocm + "&namapasien="+   $scope.item.namaPasien+
                "&tgllahir="+   $scope.item.tgllahir , true).then(function (dat) {
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });
                // managePhp.getData("get-detail-login", true).then(function(dat){
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin();
                // });

                // if ($scope.header.DataNoregis == true) {
                //     managePhp.getData('laporan/get-order-ok?noregistrasi='+$scope.item.noregistrasi).then(function(e) {
                //         for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                //             e.data.daftar[i].no=i+1
                //         }
                //         $scope.dataGridRiwayat = new kendo.data.DataSource({
                //             data: e.data.daftar,
                //             pageSize:10
                //         });

                //     });
                // }else{
                //     managePhp.getData('laporan/get-order-ok?NoCM='+$scope.item.noMr).then(function(e) {
                //         for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                //             e.data.daftar[i].no=i+1
                //         }
                //         $scope.dataGridRiwayat = new kendo.data.DataSource({
                //             data: e.data.daftar,
                //             pageSize:10
                //         });

                //     });
                // }
                $scope.treeSourceRuangan = [];
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=igd").then(function (e) {
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                children: "child",
                                expanded: true
                            }
                        }
                    });
                    $scope.treeSourceBedah = inlineDefault
                    $scope.mainTreeViewBedahOption = {
                        dataTextField: ["caption"],
                        datakKeyField: ["id"],
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: false
                    }
                })
            }

            $scope.Lihat = function () {
                if($scope.dataSelected == undefined){
                    toastr.error("Pilih data dulu")
                    return
                }
                $scope.myVar = 2
                var noemr2 = '-'
                if ($scope.dataSelected != undefined) {
                    noemr2 = $scope.dataSelected.noemr
                }
                $state.go("RekamMedisIGD.EmrGawatDarurat.EmrGawatDaruratDetail", {
                    namaEMR: 24,
                    nomorEMR: noemr2
                });

                var arrStr = {
                    0: noemr2
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }
            $rootScope.showRiwayat = function () {
                $scope.myVar = 0
                init()
            }
            $scope.create = function () {
                $scope.myVar = 2
                var noemr2 = '-'
                $state.go("RekamMedisIGD.EmrGawatDarurat.EmrGawatDaruratDetail", {
                    namaEMR: 24,
                    nomorEMR: noemr2
                });
                var arrStr = {
                    0: noemr2
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }
            $rootScope.loadRiwayat = function () {
                // debugger
                init()
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "90px",
                },
                {
                    "field": "ruangan",
                    "title": "Nama Ruangan",
                    "width": "140px"
                },
                {
                    "field": "produkfk",
                    "title": "Kode",
                    "width": "40px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "80px"
                }
            ];

            $scope.columnGridOrder = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty",
                    "width": "40px",
                }
            ];
            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                }
            ];
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
                }]
            };

            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        {
                            "field": "tglemr",
                            "title": "Tgl EMR",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                        },
                        {
                            "field": "noemr",
                            "title": "No EMR",
                            "width": "80px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Pegawai",
                            "width": "100px"
                        },
                        // {
                        //     "field": "noregistrasi",
                        //     "title": "NoRegistrasi",
                        //     "width":"150px",
                        //     "template": "<span class='style-left'>#: noregistrasi #</span>"
                        // },
                        // {
                        //     "field": "namaruangan",
                        //     "title": "Nama Ruangan",
                        //     "width":"150px",
                        //     "template": "<span class='style-left'>#: namaruangan #</span>"
                        // }
                    ]
            };
            function hapusData(e) {
                // // if (loginITI ==false){
                // //  toastr.error('Tidak Bisa Menghapus Data','Info')
                // //  return
                // // }
                // e.preventDefault();
                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                // if (!dataItem) {
                //     toastr.error("Data Tidak Ditemukan");
                //     return;
                // }
                // var itemDelete = {
                //     "norec": dataItem.norec
                // }

                // managePhp.postData(itemDelete, 'rekam-medis/hapus-pengkajianpasien').then(function (e) {
                //     if (e.status === 201) {
                //         loadGrid()

                //         grid.removeRow(row);
                //     }
                // })

            }
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "300px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        }]
                };
            };
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function () {

            }

            $scope.add = function () {
                if ($scope.item.statusVerif == true) {
                    toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                    return;
                }
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layanan == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGridOrder == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.produkfk = $scope.item.layanan.id
                            data.namaproduk = $scope.item.layanan.namaproduk
                            data.qtyproduk = parseFloat($scope.item.qty)
                            data.objectruanganfk = namaRuanganFk
                            data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                            data.pemeriksaanluar = $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                                data.objectkelasfk = $scope.item.idKelas

                            data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        produkfk: $scope.item.layanan.id,
                        namaproduk: $scope.item.layanan.namaproduk,
                        qtyproduk: parseFloat($scope.item.qty),
                        objectruanganfk: namaRuanganFk,
                        objectruangantujuanfk: $scope.item.ruangantujuan.id,
                        pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                        objectkelasfk: $scope.item.idKelas
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: data2
                    });
                }
                $scope.batal();
            }
            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                for (var i = $scope.listLayanan.length - 1; i >= 0; i--) {
                    if ($scope.listLayanan[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listLayanan[i]
                        break;
                    }
                }
                $scope.item.layanan = dataProduk;//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 

                $scope.item.qty = dataSelected.qtyproduk
                $scope.item.pemeriksaanKeluar = dataSelected.pemeriksaanluar == 1 ? true : false
            }
            $scope.hapus = function () {
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layanan == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            // data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                }
                $scope.batal();
            }
            $scope.batal = function () {
                $scope.item.layanan = ''
                $scope.item.qty = 1
                $scope.item.no = undefined
            }
            $scope.BatalOrder = function () {
                data2 = []
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: data2
                });
                $scope.CmdOrderPelayanan = true;
                $scope.OrderPelayanan = false;
            }
            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.inputOrder = false;
            }
            $scope.newOrder = function () {
                $scope.riwayatForm = false
                $scope.inputOrder = true;
            }
            $scope.Simpan = function () {
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return
                }
                if (data2.length == 0) {
                    alert("Pilih layanan terlebih dahulu!!")
                    return
                }
                var objSave = {
                    norec_so: '',
                    norec_apd: norec_apd,
                    norec_pd: norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: namaRuanganFk,
                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                    departemenfk: 25,
                    pegawaiorderfk: $scope.PegawaiLogin2.pegawai[0].id,
                    tgloperasi: moment($scope.item.tglOperasi).format('YYYY-MM-DD hh:mm'),
                    details: data2
                }

                managePhp.postOrderLaboratRad(objSave).then(function (e) {                    
                    $scope.BatalOrder();
                    managePhp.postLogging('Order Jadwal Bedah', 'Norec strukorder_t', e.data.strukorder.norec, 'Menu Dokter').then(function (res) {
                        init();
                    })
                })
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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

            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }

            $scope.resep = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }

            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,
                });
            }

            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }

            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }

            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }

            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
            }

            $scope.hapusOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data yang mau dihapus')
                    return
                }
                if ($scope.dataSelectedRiwayat.statusorder != 'PENDING') {
                    toastr.error('Tidak bisa dihapus')
                    return
                }
                var data = {
                    norec_order: $scope.dataSelectedRiwayat.norec
                }


            }


            function onSelect(e) {
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
                    $state.go("RekamMedisIGD.EmrGawatDarurat.EmrGawatDaruratDetail", {
                        namaEMR: idTree,
                        nomorEMR: noemr
                    });
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
                    $state.go(urlTrue, arrStr);
                }




            }
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1