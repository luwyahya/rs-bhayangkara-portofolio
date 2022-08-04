define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TransaksiPelayananAmbulanCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var norec_apd = ''
            var norec_pd = ''
            var norec_so = ''
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.idJenisPelayanan = "";
            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''

            LoadCache();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('editOrderCache');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.kelompokPasien = chacePeriode[13]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{ id: chacePeriode[5], namakelas: chacePeriode[6] }])
                    $scope.item.kelas = { id: chacePeriode[5], namakelas: chacePeriode[6] }
                    $scope.item.tglRegistrasi = chacePeriode[7]
                    norec_apd = chacePeriode[8]
                    namaRuangan = chacePeriode[9]
                    namaRuanganFk = chacePeriode[10]
                    norec_pd = chacePeriode[11]
                    norec_so = chacePeriode[12]
                    $scope.idJenisPelayanan = chacePeriode[14]
                    $scope.item.JenisPelayanan = chacePeriode[15]

                    $scope.item.ruanganAsal = namaRuangan;
                    init()
                } else { }

            }
            function init() {
                $scope.isRouteLoading = true;
                medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                    $scope.listRuanganTujuan = dat.data.ruanganambulan;
                });
                medifirstService.get("ambulance/get-order-pelayanan-ambulan?norec_so=" + norec_so
                    + "&objectkelasfk=" + $scope.item.kelas.id, true).then(function (dat) {
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                        }
                        $scope.isRouteLoading = false;
                        $scope.dataGrid = dat.data.data;
                    });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDokter = data;
                });

            }

            $scope.getLayanan = function () {
                medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan="
                    + $scope.item.ruangantujuan.id
                    + "&idKelas="
                    + $scope.item.kelas.id
                    + "&idJenisPelayanan="
                    + $scope.idJenisPelayanan
                    , true, 10, 10)
                    .then(function (x) {
                        $scope.listLayanan = x;
                    });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "140px"
                },
                {
                    "field": "prid",
                    "title": "Kode",
                    "width": "40px",
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
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            function clearTambah() {
                // $scope.item.ruangantujuan = undefined;
                // $scope.item.dokter = undefined;
                $scope.item.no = undefined;
                $scope.item.layanan = undefined;
                $scope.item.qty = 0;
            }

            $scope.batal = function () {
                clearTambah();
            }
            $scope.add = function () {
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
                            data.objectkelasfk = $scope.item.kelas.id

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
                        objectkelasfk: $scope.item.kelas.id
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: data2
                    });
                }
                clearTambah();
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
                clearTambah();
            }
            // $scope.batal = function(){
            //     $scope.item.layanan =''
            //     $scope.item.qty =''
            //     $scope.item.no=undefined
            // }
            $scope.BatalOrder = function () {
                data2 = []
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: data2
                });
                $scope.CmdOrderPelayanan = true;
                $scope.OrderPelayanan = false;
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
                    norec_apd: norec_apd,
                    norec_pd: norec_pd,
                    norec_so: norec_so,
                    qtyproduk: data2.length,//
                    objectruanganfk: namaRuanganFk,
                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                    departemenfk: $scope.item.ruangantujuan.departemenfk,
                    pegawaiorderfk: $scope.item.dokter.id,
                    details: data2
                }

                medifirstService.post('ambulance/save-order-pelayanan-ambulan',objSave).then(function (e) {
                    init()
                    clearTambah();
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: []
                    });
                })
            }

            $scope.hapusTindakan = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih pelayanan dahulu!');
                    return;
                }

                var objDelete = {
                    "norec_op": $scope.dataSelected.norec_op,
                };
                medifirstService.get('ambulance/delete-order-pelayanan-ambulan',objDelete).then(function (e) {
                    init()
                })
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            
            $scope.cetakResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
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
            //***********************************

        }
    ]);
});