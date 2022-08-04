define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OrderPelayananAmbulanCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.currentNorecPD = $state.params.norecPD;
            $scope.currentNorecAPD = $state.params.norecAPD;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var psid = ''
            var nocm_str = '';
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.riwayatForm = false
            $scope.inputOrder = true
            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            $scope.item.tglRegistrasi = $scope.now;
            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                if (chacePeriode != undefined) {                    
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    namaRuanganFk = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                    medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            $scope.item.statusVerif = dat.data.status
                        });                   
                }
                init()
            }

            function init() {
                $scope.isRouteLoading = true;
                $scope.SaveDis = false;
                var dataLogin = medifirstService.getPegawaiLogin();
                $scope.listDokter = dataLogin
                $scope.PegawaiLogin2 = dataLogin;
                $scope.item.dokter = { id: dataLogin.id, namalengkap: dataLogin.namaLengkap }
                medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganambulan;
                    $scope.isRouteLoading = false;
                })
                if ($scope.header.DataNoregis == true) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)
                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }
            }

            $scope.getLayanan = function () {
                if ($scope.item.ruangan != undefined) {
                    medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan="
                        + $scope.item.ruangan.id
                        + "&idKelas="
                        + $scope.IdKelas
                        + "&idJenisPelayanan="
                        + $scope.JenisLayananFk
                        , true, 10, 10)
                        .then(function (x) {
                            $scope.listLayanan = x;
                        });
                }
            }

            $scope.getQty = function () {
                if ($scope.item.layanan != undefined) {
                    $scope.item.qty = 1;
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
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
                    "width": "30px",
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
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
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
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px",
                },
                
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                }
            ];

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
            }            

            $scope.back = function () {
                window.history.back();
            }

            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            
            $scope.Batal = function () {
                $scope.SaveDis = false;
            }
            
            $scope.kembali = function () {
                window.history.back();
            }

            $scope.add = function () {
                $scope.SaveDis = false;
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangan == undefined) {
                    alert("Pilih Ruangan terlebih dahulu!!")
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
                            data.objectruanganfk = $scope.item.ruangan.id
                            data.objectkelasfk = 6

                            data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                    $scope.item.qty = undefined
                    $scope.item.no = undefined
                    $scope.item.layanan = undefined

                } else {
                    data = {
                        no: nomor,
                        produkfk: $scope.item.layanan.id,
                        namaproduk: $scope.item.layanan.namaproduk,
                        qtyproduk: parseFloat($scope.item.qty),
                        objectruanganfk: $scope.item.ruangan.id,
                        objectkelasfk: 6
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: data2
                    });
                    $scope.item.qty = undefined
                    $scope.item.no = undefined
                    $scope.item.layanan = undefined
                }
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
                $scope.item.layanan = dataProduk;
                $scope.item.qty = dataSelected.qtyproduk
            }

            $scope.klikGridRiwayat = function (dataSelectedRiwayat) {
                if (dataSelectedRiwayat != undefined) {
                    $scope.dataSelectedRiwayat = dataSelectedRiwayat;
                }
            }

            $scope.hapus = function () {
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangan == undefined) {
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
                $scope.item.qty = undefined
                $scope.item.no = undefined
                $scope.item.layanan = undefined
            }

            $scope.batal = function () {
                $scope.item.qty = undefined
                $scope.item.no = undefined
                $scope.item.layanan = undefined
            }

            $scope.BatalOrder = function () {
                data2 = []
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: data2
                });
                $scope.CmdOrderPelayanan = true;
                $scope.OrderPelayanan = false;
            }

            function ClearSave() {
                $scope.item.dokter = undefined;
                $scope.item.ruangan = undefined;
                $scope.item.layanan = undefined;
                $scope.item.qty = 0;
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: []
                });

            }

            $scope.Simpan = function () {
                if ($scope.item.ruangan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return
                }

                if (data2.length == 0) {
                    alert("Pilih layanan terlebih dahulu!!")
                    return
                }

                var objSave = {
                    norec_pd: norec_pd,
                    norec_so: "",
                    qtyproduk: data2.length,
                    objectruanganfk: $scope.item.idRuangan,
                    objectruangantujuanfk: $scope.item.ruangan.id,
                    departemenfk: $scope.item.ruangan.objectdepartemenfk,
                    pegawaiorderfk: $scope.item.dokter.id,
                    details: data2
                }

                medifirstService.post('ambulance/save-order-pelayanan-ambulan', objSave).then(function (e) {
                    medifirstService.postLogging('Order Pelayanan Ambulan', 'Norec strukorder_t', e.data.strukorder.norec,
                        'Order Pelayanan Ambulan No Order-' + e.data.strukorder.noorder + ' No Registrasi ' + $scope.item.noregistrasi
                    ).then(function (res) { })
                    ClearSave();
                })
            }

            function loadRiwayat(params) {
                medifirstService.get('ambulance/get-riwayat-order-ambulan?' + params).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
            }

            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)
                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }
            }

            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.inputOrder = false;
            }

            $scope.newOrder = function () {
                $scope.riwayatForm = false
                $scope.inputOrder = true;
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
                medifirstService.post('emr/delete-order-pelayanan', data)
                    .then(function (e) {
                        init()

                    })
            }

            //***********************************
        }
    ]);
});
