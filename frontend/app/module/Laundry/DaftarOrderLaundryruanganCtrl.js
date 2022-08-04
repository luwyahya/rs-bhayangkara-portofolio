define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarOrderLaundryruanganCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarOrderLaundryruanganCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }
           
            function loadCombo() {
                $scope.dataLogin = medifirstService.getPegawaiLogin();
                medifirstService.get("laundry/get-combo-laundry", true).then(function (dat) {
                    $scope.listNamaBarang = dat.produk
                });
                
                // medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                //     var dataCombo = dat.data;
                //     $scope.listDataJabatan = dataCombo.jabatan;
                // });

                // medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                //     $scope.ListDataPegawai = data;
                // });
            }

            $scope.newOrder = function () {
                $state.go('OrderBarangLaundry')
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();            
            }

            $scope.deleteOrder = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.statusorder != '') {
                    toastr.error("Sudah di kirim tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                var objSave =
                {
                    norecorder: $scope.dataSelected.norec
                }

                medifirstService.post('laundry/delete-order-laundry-ruangan',objSave).then(function (e) {
                    init()
                })
            }

            function init() {
                $scope.isRouteLoading = true;
                // var ins =""
                // if ($scope.item.instalasi != undefined){
                //     var ins ="&dpid=" +$scope.item.instalasi.id
                // }
                var rg = ""
                if ($scope.item.namaruangantujuan != undefined) {
                    var rg = "&ruangantujuanfk=" + $scope.item.namaruangantujuan
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("laundry/get-daftar-order-laundry-ruangan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noorder=" + $scope.item.struk + rg + produkfk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        // for (var i = 0; i < dat.data.daftar.length; i++) {
                        //     dat.data.daftar[i].no = i + 1                           
                        // }
                        var data2 = dat.data.daftar;                       
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                            for (let e = 0; e < data2[i].details.length; e++) {
                                data2[i].details[e].no = e + 1;                            
                            }
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });
                        // $scope.dataGrid = dat.data.daftar;
                        pegawaiUser = dat.data.datalogin
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarOrderLaundryruanganCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }            

            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.EditOrder = function () {
                if ($scope.dataSelected.status == 'Terima Order Barang') {
                    toastr.error('Tidak bisa mengubah order ini!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    toastr.error('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditOrder',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('OrderBarangLaundryCtrl', chacePeriode);
                $state.go('OrderBarangLaundry')
            }

            $scope.KirimBarang = function () {
                // if ($scope.dataSelected.status != 'Terima Order Barang') {
                //     toastr.error('Tidak bisa mengirim ke ruangan Sendiri!')
                //     return;
                // }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    toastr.error('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: '',
                    1: $scope.dataSelected.norec,
                    2: 'KirimBarang',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangLaundryCtrl', chacePeriode);
                $state.go('KirimBarangLaundry')
            }           
           
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "35px",
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "60px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglorder #', '')}}</span>"
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "100px",
                },
                // {
                //     "field": "jeniskirim",
                //     "title": "Jenis Order",
                //     "width": "80px",
                // },
                {
                    "field": "jmlitem",
                    "title": "Item",
                    "width": "35px",
                    "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
                },
                {
                    "field": "namaruanganasal",
                    "title": "Nama Ruangan Asal",
                    "width": "100px",
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Nama Ruangan Tujuan",
                    "width": "120px",
                },
                // {
                //     "field": "petugas",
                //     "title": "Petugas",
                //     "width": "100px",
                // },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "statusorder",
                    "title": "Status Order",
                    "width": "100px",
                }
            ];

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "35px",
                        },
                        {
                            "field": "kdproduk",
                            "title": "Kd Produk",
                            "width": "70px",
                        },
                        // {
                        //     "field": "kdsirs",
                        //     "title": "Kd Sirs",
                        //     "width": "70px",
                        // },
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "100px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "30px",
                        },
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width": "30px",
                        }
                    ]
                }
            };
           
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
                   
            $scope.cetak = function () {               
                $scope.popUp.center().open();
            }

            $scope.CetakAh = function () {

                var jabatan1 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan1 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai1 = $scope.item.DataPegawai2.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan2 = $scope.item.DataJabatan.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai != undefined) {
                    pegawai2 = $scope.item.DataPegawai.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-order=1&nores=' + $scope.dataSelected.norec + '&pegawaiMegetahui=' + pegawai1 + '&pegawaiMeminta=' + pegawai2
                    + '&jabatanMengetahui=' + jabatan1 + '&jabatanMeminta=' + jabatan2 + '&view=' + stt + '&user=' + pegawaiUser[0].namalengkap, function (response) {
                        //aadc=response; 

                    });                
                $scope.popUp.close();
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
