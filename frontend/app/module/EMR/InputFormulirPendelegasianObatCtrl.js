define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InputFormulirPendelegasianObatCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$mdDialog',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $mdDialog) {
            var norecAPD = $state.params.noRec;
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.item.tglresep = $scope.now;
            $scope.item.tglresepAkhir = $scope.now;
            $scope.riwayatForm = false
            $scope.riwayatFormResep = true
            $scope.riwayatRekap = false
            $scope.InputDelegasi = false//false
            $scope.item.nilaiKonversi = 0
            $scope.item.jumlah = 1
            $scope.item.totalSubTotal = 0
            $scope.item.stok = 0
            $scope.item.hargaSatuan = 0
            $scope.item.total = 0
            $scope.showButton = false
            $scope.showButton1 = false
            $scope.showSpace = true
            $scope.norecOrder = ''
            var norec_apd = '';
            var norec_pd = '';
            var nocm_str = '';
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data3 = [];
            var data4 = [];
            var dataDetail = [];
            $scope.currentAturanPakai = []
            var hrg1 = 0
            var hrgsdk = 0
            var detail = ''
            $scope.item.TglDelegasi = $scope.now
            $scope.item.TglDelegasi2 = $scope.now
            LoadCacheHelper();
            FormLoad();
            // LoadCache();/
            init();

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('InputFormulirPendelegasianObatCtrl');
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
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.item.ceklisNoRegis = chacePeriode[13]
                }
                loadRiwayat()
            }

            function init() {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo-resep-emr", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.listRuangan = dat.data.ruanganfarmasi;
                    $scope.listJenisKemasan = dat.data.jeniskemasan;
                    $scope.listProduk = dat.data.produk;
                    $scope.listAsalProduk = dat.data.asalproduk;
                    $scope.listAturanPakai = dat.data.signa;
                    $scope.listJenisRacikan = dat.data.jenisracikan;
                    $scope.item.ruangan = dat.data.ruanganfarmasi[1];
                    $scope.item.jenisKemasan = dat.data.jeniskemasan[1];
                    $scope.listRouteFarmasi = dat.data.route;
                });
            }

            function FormLoad() {
                $scope.KelompokUser = medifirstService.getKelompokUser();
                if (($scope.KelompokUser == 'farmasi') || ($scope.KelompokUser == 'apotik') || ($scope.KelompokUser == 'pmkp')){
                    $scope.showButton = true
                    $scope.showSpace = false
                    $scope.InputDelegasi = true
                }
                medifirstService.get("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawaiFarmasi = data;
                    $scope.listPerawatPelaksana = data;
                });

                medifirstService.get("tatarekening/get-data-login", true, true, 20).then(function (data) {
                    if (data.data.kelompokuser[0].kelompokuser == 'farmasi') {
                        medifirstService.get("emr/get-pegawai-parts?id=" + data.data.pegawailoginfk.objectpegawaifk, true, true, 20).then(function (data) {
                            $scope.item.PegawaiFarmasi = data.data[0];
                        });
                    }
                });



                // medifirstService.get('emr/get-pegawai-parts?id=' + medifirstService.getPegawaiLogin().id).then(function (e) {
                //     $scope.listPenulisResep.add(e.data[0])
                //     $scope.item.PerawatPelaksana = { id: e.data[0].id, namalengkap: e.data[0].namalengkap }
                // });

                // medifirstService.getPart('emr/get-pegawai-parts', true, 10).then(function (e) {
                //     $scope.listPenulisResep = e
                // })

                medifirstService.get("emr/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                    let group = [];
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                        }
                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    noresep: array[i].noresep,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    count: array[i].count,
                                    details: dataDetail0
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridResep = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                });
                $scope.riwayatForm = true
                $scope.riwayatFormResep = true
                $scope.riwayatRekap = false
                $scope.inputObatOrder = false;
            }

            $scope.hapus1 = function () {

                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }

                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }

                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1
                            }
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                }
                Kosongkan()
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {

                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }

                if ($scope.item.aturanpakaitxt.substring(2) == '') {
                    alert("Isi dosis terlebih dahulu!!")
                    return;
                }

                if ($scope.item.Route == undefined) {
                    alert("Pilih Rute terlebih dahulu!!")
                    return;
                }

                if ($scope.item.chkp + $scope.item.chks + $scope.item.chksr + $scope.item.chkm == 0){
                    alert("Pilih Waktu Minum terlebih dahulu!!")
                    return;
                }

                if ($scope.item.aturanpakaitxt.includes(',')){
                    alert('Mohon format penulisan dosis tidak menggunakan koma!!')
                    return;
                }
                // if ($scope.item.chkp + $scope.item.chks + $scope.item.chksr + $scope.item.chkm > 1 ) {
                //     alert("Mohon inputnya per setiap waktu minum. Misal pagi dan sore, pagi dulu ditambahkan setelah itu baru sore ditambahkan.")
                //     return;
                // }

                var dosis = 1;
                if ($scope.item.aturanpakaitxt != undefined) {
                    dosis = $scope.item.aturanpakaitxt.substring(2)
                }

                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = nomor + 1
                } else {
                    nomor = data2.length + 1
                }

                var waktuminum = ''


                var data = {};
                    if ($scope.item.no != undefined) {
                        //edit
                        for (var i = data2.length - 1; i >= 0; i--) {
                            if (data2[i].no == $scope.item.no) {
                                data.no = $scope.item.no;
                                data.produkfk = $scope.item.produk.id,
                                    data.namaproduk = $scope.item.produk.namaproduk,
                                    data.dosis = dosis;
                                data.routefk = $scope.item.Route.id;
                                data.route = $scope.item.Route.name;
                                data.ispagi = $scope.item.chkp;
                                data.issiang = $scope.item.chks;
                                data.issore = $scope.item.chksr;
                                data.ismalam = $scope.item.chkm;
                                if ($scope.item.chkp == 1){
                                    data.waktuminum = 'P'
                                } if ($scope.item.chks == 1){
                                    data.waktuminum = 'S'
                                } if ($scope.item.chksr == 1){
                                    data.waktuminum = 'SR'
                                } if ($scope.item.chkm == 1){
                                    data.waktuminum = 'M'
                                }
                                data2[i] = data;
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });
                            }
                        }
                    } else {
                        //add
                        if ($scope.item.chkp == 1){
                        waktuminum = 'P'

                        
                            //add new
                            data = {
                                no: nomor,
                                produkfk: $scope.item.produk.id,
                                namaproduk: $scope.item.produk.namaproduk,
                                dosis: dosis,
                                routefk: $scope.item.Route.id,
                                route: $scope.item.Route.name,
                                ispagi: $scope.item.chkp,
                                issiang: 0,
                                issore: 0,
                                ismalam: 0,
                                waktuminum: waktuminum,
                            }
                            data2.push(data)
                            nomor = nomor + 1
                    } if ($scope.item.chks == 1){
                        waktuminum = 'S'

                        
                            //add new
                            data = {
                                no: nomor,
                                produkfk: $scope.item.produk.id,
                                namaproduk: $scope.item.produk.namaproduk,
                                dosis: dosis,
                                routefk: $scope.item.Route.id,
                                route: $scope.item.Route.name,
                                ispagi: 0,
                                issiang: $scope.item.chks,
                                issore: 0,
                                ismalam: 0,
                                waktuminum: waktuminum,
                            }
                            data2.push(data)
                            nomor = nomor + 1
                        
                    } if ($scope.item.chksr == 1){
                        waktuminum = 'SR'
                        
                            //add new
                            data = {
                                no: nomor,
                                produkfk: $scope.item.produk.id,
                                namaproduk: $scope.item.produk.namaproduk,
                                dosis: dosis,
                                routefk: $scope.item.Route.id,
                                route: $scope.item.Route.name,
                                ispagi: 0,
                                issiang: 0,
                                issore: $scope.item.chksr,
                                ismalam: 0,
                                waktuminum: waktuminum,
                            }
                            data2.push(data)
                            nomor = nomor + 1
                        
                    } if ($scope.item.chkm == 1){
                        waktuminum = 'M'
                        
                            //add new
                            data = {
                                no: nomor,
                                produkfk: $scope.item.produk.id,
                                namaproduk: $scope.item.produk.namaproduk,
                                dosis: dosis,
                                routefk: $scope.item.Route.id,
                                route: $scope.item.Route.name,
                                ispagi: 0,
                                issiang: 0,
                                issore: 0,
                                ismalam: $scope.item.chkm,
                                waktuminum: waktuminum,
                            }
                            data2.push(data)
                            nomor = nomor + 1
                        
                    }

                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                }


                
                
                Kosongkan();
                //clear();
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                $scope.item.no = dataSelected.no
                //$scope.item.dosis = dataSelected.dosis
                $scope.item.aturanpakaitxt = '1x'+dataSelected.dosis
                $scope.item.produk = { id: dataSelected.produkfk, namaproduk: dataSelected.namaproduk }
                $scope.item.Route = { id: dataSelected.routefk, name: dataSelected.route }
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                let sp = false
                if (dataSelected.ispagi != "0") {
                    sp = true
                    $scope.item.chkp = 1
                }
                let ss = false
                if (dataSelected.issiang != "0") {
                    ss = true
                    $scope.item.chks = 1
                }
                let sr = false
                if (dataSelected.issore != "0") {
                    sr = true
                    $scope.item.chksr = 1
                }
                let sm = false
                if (dataSelected.ismalam != "0") {
                    sm = true
                    $scope.item.chkm = 1
                }
                $scope.listDataSigna = [
                    {
                        "id": 1,
                        "nama": "Aturan Pakai",
                        "detail": [
                            { "id": 1, "nama": "P", 'isChecked': sp },
                            { "id": 2, "nama": "S", 'isChecked': ss },
                            { "id": 3, "nama": "Sr", 'isChecked': sr },
                            { "id": 4, "nama": "M", 'isChecked': sm }
                        ]
                    }
                ];
            }

            $scope.klikGrids = function (dataSelectedDelegasi) {
                if (dataSelectedDelegasi != undefined) {
                    $scope.dataSelectedDelegasi = dataSelectedDelegasi;
                }
            }

            function Kosongkan() {
                //$scope.item.produk = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 1
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                $scope.item.KeteranganPakai = undefined;
                $scope.item.dosis = undefined;
                //$scope.item.Route = undefined;
                //$scope.item.aturanpakaitxt = undefined;
            }

            function clear() {
                $scope.item.Route = {};
                $scope.item.Route = undefined;
            }

            function cleargrid() {
                for (var i = 0; i < data2.length; i++) {
                    data2.splice(i, 1);
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    $scope.item.totalSubTotal = subTotal
                }
            }

            $scope.batal1 = function () {
                Kosongkan();
                clear();
            }

            $scope.batal = function () {
                Kosongkan();
                clear();
                cleargrid();
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                {
                    "field": "route",
                    "title": "Rute",
                    "width": "80px",
                },
                {
                    "field": "dosis",
                    "title": "Jml/Dosis",
                    "width": "70px",
                },
                {
                    "field": "waktuminum",
                    "title": "WM",
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
                            width: "200px"
                        },
                        {
                            "field": "route",
                            "title": "Rute",
                            "width": "80px",
                        },
                        {
                            "field": "jmldosis",
                            "title": "Jml/Dosis",
                            "width": "70px",
                        }
                    ]
                };
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.kembali = function () {
                LoadCacheHelper();
                FormLoad();
                init();
            }

            $scope.save = function () {
                if ($scope.dataGridRiwayat != undefined && $scope.dataGridRiwayat._data.length > 0 && $scope.norecOrder == '') {
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Apakah Anda Yakin Akan Menyimpan Data ?')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('OK')
                    $mdDialog.show(confirm).then(function () {
                        $scope.simpan();
                    })
                } else {
                    $scope.simpan();
                }

            }

            $scope.simpan = function () {
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }

                if ($scope.item.PegawaiFarmasi == undefined) {
                    alert("Pilih Pegawai Farmasi terlebih dahulu!!")
                    return
                }

                // if ($scope.item.PerawatPelaksana == undefined) {
                //     alert("Pilih Perawat Pelaksana terlebih dahulu!!")
                //     return
                // }

                var alergi = 'tidak'
                if ($scope.item.Alergi != undefined) {
                    alergi = $scope.item.Alergi
                    // return
                }

                if ($scope.item.PerawatPelaksana == undefined) {
                    var strukorder = {
                        norec: $scope.norecOrder,
                        norec_pd: norec_pd,
                        norec_apd: norec_apd,
                        nocmfk: nocm_str,
                        tglpelayanan: moment($scope.item.TglDelegasi).format('YYYY-MM-DD HH:mm'),
                        tglpelayanan2: moment($scope.item.TglDelegasi2).format('YYYY-MM-DD 23:59'),
                        pegawaifarmasifk: $scope.item.PegawaiFarmasi.id,
                        perawatfk: null,
                        alergi: alergi,
                    }
                } else {
                    var strukorder = {
                        norec: $scope.norecOrder,
                        norec_pd: norec_pd,
                        norec_apd: norec_apd,
                        nocmfk: nocm_str,
                        tglpelayanan: moment($scope.item.TglDelegasi).format('YYYY-MM-DD HH:mm'),
                        tglpelayanan2: moment($scope.item.TglDelegasi2).format('YYYY-MM-DD 23:59'),
                        pegawaifarmasifk: $scope.item.PegawaiFarmasi.id,
                        perawatfk: $scope.item.PerawatPelaksana.id,
                        alergi: alergi,
                    }
                }

                var objSave = [
                    {
                        strukorder: strukorder,
                        detail: data2
                    }
                ]
                medifirstService.post('emr/save-data-delegasi-obat', objSave).then(function (e) {
                    $scope.item.resep == undefined
                    $scope.norecOrder = ''
                    // medifirstService.postLogging('Pendelegasian Pemberi Obat', 'Norec formulirobat_t', e.data.noresep.norec,
                    //     'Order Resep No Order - ' + e.data.noresep.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                    //     })                    
                    loadRiwayat();
                    editOrder();
                    $scope.batal();
                })
            }

            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.riwayatFormResep = false;
                $scope.InputDelegasi = false;
                $scope.riwayatRekap = false
                loadRiwayat();
            }

            function loadRiwayat(params) {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-daftar-delegasi?noRM=" + $scope.item.noMr, + "&Noreg=" + $scope.item.noregistrasi, true).then(function (dat) {
                    var datas = dat.data.daftar;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].statCheckbox = false;
                        datas[i].no = i + 1;
                        datas[i].tgldelegasi = moment(datas[i].tglpelayanan).format('DD-MM-YYYY');
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataGridDelegasi = new kendo.data.DataSource({
                        data: datas
                    });
                });
            }

            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    loadRiwayat('noReg=' + $scope.item.noregistrasi)
                }
                else {
                    loadRiwayat('nocm=' + $scope.item.noMr)
                }
            }

            $scope.columnGridResep = [
                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                }
            ];

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "200px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "80px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "jumlah",
                            "title": "Qty",
                            "width": "40px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",
                        }

                    ]
                }
            };

            $scope.columnGridDelegasi = {
                columns: [
                    // {
                    //     "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    //     template: "# if (statCheckbox) { #" +
                    //         "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    //         "# } else { #" +
                    //         "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    //         "# } #",
                    //     width: "20px"
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "35px",
                    },
                    {
                        "field": "tgldelegasi",
                        "title": "Tgl Pendelegasian",
                        "width": "90px",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No.Registrasi",
                        "width": "100px",
                    },
                    {
                        "field": "nocm",
                        "title": "No. Rm",
                        "width": "100px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px",
                    },
                    {
                        "field": "pegawaifarmasi",
                        "title": "Petugas Apotik",
                        "width": "120px",
                    }
                ]
            }

            function checkValue(obj, param) {
                var res = "";
                var data = undefined;

                if (param.length > 1) {
                    if (obj[param[0]] != undefined)
                        data = obj[param[0]][param[1]];
                }
                else {
                    data = obj[param[0]];
                }

                if (data != undefined)
                    var res = data;

                return res;
            }

            $scope.selectRow = function (dataItem) {

                var dataSelect = _.find($scope.dataGridDelegasi._data, function (data) {
                    return data.no == dataItem.no;
                });


                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;
                var tempData = $scope.dataGridDelegasi._data;

            }

            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGridDelegasi._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }
                // reloadDataGrid(tempData);
            }

            $scope.cekData = function () {
                var tempData = $scope.dataGrid._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < 5; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }
            }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    _data: ds,
                    pageSize: 50,
                    total: ds.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    }
                });

                var grid = $('#kGrid').data("kendoGrid");
                grid.setDataSource(newDs);
                grid.refresh();

            }

            $scope.selectRowD = function (dataItemD) {
                  var datagrid =[]
                  for (let i = 0; i < $scope.dataGridDelegasi._data.length; i++) {
                        const element = $scope.dataGridDelegasi._data[i];
                        for (let o = 0; o < element.details.length; o++) {
                            const elementD = element.details[o];
                            datagrid.push(elementD)
                        }
                    }
                var dataSelect = _.find(datagrid, function (data) {
                    return data.norec == dataItemD.norec;
                });

                if (dataSelect.statCheckboxD) {
                    dataSelect.statCheckboxD = false;
                    for (let i = 0; i < dataDetail.length; i++) {
                        if (dataSelect.norec ==dataDetail[i].norec) {
                             dataDetail.splice([i], 1)
                            break
                        }
                    }
                }
                else {
                    dataSelect.statCheckboxD = true;
                    dataDetail.push(dataSelect)
                }
                console.log(dataDetail)
                // for (let i = 0; i < $scope.dataGridDelegasi._data.length; i++) {
                //     const element = $scope.dataGridDelegasi._data[i];
                //     for (let o = 0; o dataDetail< element.details.length; o++) {
                //         const elementD = element.details[o];
                //         dataDetail.push(elementD)
                //     }
                // }
                // var dataSelect = _.find(dataDetail, function (data) {
                //     return data.no == dataItemD.no;
                // });


                // if (dataSelect.statCheckboxD) {
                //     dataSelect.statCheckboxD = false;
                // }
                // else {
                //     dataSelect.statCheckboxD = true;
                // }

                // $scope.tempCheckbox = dataSelect.statCheckboxD;
                // var tempData = dataDetail;

            }

            var isCheckAllD = false
            $scope.selectUnselectAllRowD = function () {
                dataDetail = [];
                for (let i = 0; i < $scope.dataGridDelegasi._data.length; i++) {
                    const element = $scope.dataGridDelegasi._data[i];
                    for (let o = 0; o < element.details.length; o++) {
                        const elementD = element.details[o];
                        dataDetail.push(elementD)
                    }
                }
                var tempData = dataDetail

                if (isCheckAllD) {
                    isCheckAllD = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckboxD = false;
                    }
                }
                else {
                    isChisCheckAllDeckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckboxD = true;
                    }
                }
                // reloadDataGrid(tempData);
            }

            $scope.cekDataD = function () {
                var tempData = $scope.dataGrid._data;

                if (isCheckAllD) {
                    isCheckAllD = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckboxD = false;
                    }
                }
                else {
                    isCheckAllD = true;
                    for (var i = 0; i < 5; i++) {
                        tempData[i].statCheckboxD = true;
                    }
                }
            }

            $scope.data4 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].statCheckboxD = false;
                    dataItem.details[i].no = i + 1
                    dataItem.details[i].jamdelegasi = moment(dataItem.tglpelayanan).format('HH:mm:ss');
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,
                    }),
                    columns: [
                        {
                           //"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRowD()' />",
                            template: "# if (statCheckboxD) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowD(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowD(dataItem)' />" +
                                "# } #",
                            width: "20px"
                        },
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "150px",
                        },
                        {
                            "field": "route",
                            "title": "Rute",
                            "width": "80px",
                        },
                        {
                            "field": "dosis",
                            "title": "Dosis",
                            "width": "70px",
                        },
                        {
                            "field": "waktuminum",
                            "title": "Waktu Minum",
                            "width": "70px",
                        },
                        {
                            "field": "perawat",
                            "title": "Perawat",
                            "width": "70px",
                        },
                        {
                            "field": "jamperawatdelegasi",
                            "title": "Jam Pemberian Obat",
                            "width": "70px",
                        },
                        {
                            "field": "keterangan",
                            "title": "Ket",
                            "width": "70px",
                        }
                    ]
                }
            };

            $scope.klikDetail = function (dataSelectedResepDetail) {
                if (dataSelectedResepDetail != undefined) {
                    $scope.dataSelectedResepDetail = dataSelectedResepDetail;
                    $scope.item.produk = { id: $scope.dataSelectedResepDetail.produkfk, namaproduk: $scope.dataSelectedResepDetail.namaproduk };
                    $scope.item.chkp = 0
                    $scope.item.chks = 0
                    $scope.item.chksr = 0
                    $scope.item.chkm = 0
                    let sp = false
                    if (dataSelectedResepDetail.ispagi != "0") {
                        sp = true
                        $scope.item.chkp = 1
                    }
                    let ss = false
                    if (dataSelectedResepDetail.issiang != "0") {
                        ss = true
                        $scope.item.chks = 1
                    }
                    let sr = false
                    if (dataSelectedResepDetail.issore != "0") {
                        sr = true
                        $scope.item.chksr = 1
                    }
                    let sm = false
                    if (dataSelectedResepDetail.ismalam != "0") {
                        sm = true
                        $scope.item.chkm = 1
                    }
                    $scope.listDataSigna = [
                        {
                            "id": 1,
                            "nama": "Aturan Pakai",
                            "detail": [
                                { "id": 1, "nama": "P", 'isChecked': sp },
                                { "id": 2, "nama": "S", 'isChecked': ss },
                                { "id": 3, "nama": "Sr", 'isChecked': sr },
                                { "id": 4, "nama": "M", 'isChecked': sm }
                            ]
                        }
                    ];
                    $scope.item.aturanpakaitxt = dataSelectedResepDetail.aturanpakai;
                    $scope.item.dosis = dataSelectedResepDetail.aturanpakai.substring(2)
                }
            }

            $scope.newOrder = function () {
                $scope.riwayatFormResep = true;
                $scope.InputDelegasi = true;
                $scope.riwayatRekap = false
                // $scope.riwayatFormResep = false
                // $scope.riwayatForm = false
                // $scope.inputObatOrder = true;
            }

            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('InputFormulirPendelegasianObatCtrl');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }

            $scope.resep = function () {
                var arrStr = cacheHelper.get('InputFormulirPendelegasianObatCtrl');
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }

            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('InputFormulirPendelegasianObatCtrl')

                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,

                });
            }

            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('InputFormulirPendelegasianObatCtrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }

            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('InputFormulirPendelegasianObatCtrl')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }

            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('InputFormulirPendelegasianObatCtrl');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }

            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('InputFormulirPendelegasianObatCtrl');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
            }

            $scope.editOrder = function () {
                if ($scope.dataSelectedDelegasi == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.norecOrder = $scope.dataSelectedDelegasi.norec;
                medifirstService.get("emr/get-delegasi-obat?Norec=" + $scope.dataSelectedDelegasi.norec, true).then(function (dat) {
                    var datas = dat.data.daftar[0];
                    $scope.isRouteLoading = false;
                    $scope.item.TglDelegasi = new Date(datas.tglpelayanan)
                    $scope.item.TglDelegasi2 = new Date(datas.tglpelayanan)
                    $scope.item.PegawaiFarmasi = { id: datas.pegawaifarmasifk, namalengkap: datas.pegawaifarmasi }
                    $scope.item.PerawatPelaksana = { id: datas.perawatfk, namalengkap: datas.perawat }
                    $scope.item.Alergi = datas.alergi;
                    for (let i = 0; i < dat.data.detail.length; i++) {
                        dat.data.detail[i].no = i + 1;
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: dat.data.detail
                    });
                    data2 = dat.data.detail
                    $scope.riwayatFormResep = true
                    $scope.riwayatForm = false
                    $scope.riwayatRekap = false
                    $scope.InputDelegasi = true;
                });
            }

            $scope.listDataSigna = [
                {
                    "id": 1,
                    "nama": "Aturan Pakai",
                    "detail": [
                        { "id": 1, "nama": "P", 'isChecked': false },
                        { "id": 2, "nama": "S", 'isChecked': false },
                        { "id": 3, "nama": "Sr", 'isChecked': false },
                        { "id": 4, "nama": "M", 'isChecked': false }
                    ]
                }
            ];
            $scope.item.chkp = 0
            $scope.item.chks = 0
            $scope.item.chksr = 0
            $scope.item.chkm = 0
            $scope.addListAturanPakai = function (bool, data) {
                let jml = 0
                var index = $scope.currentAturanPakai.indexOf(data);
                if (bool == true) {
                    $scope.currentAturanPakai.push(data);
                    if (data.id == 1) {
                        $scope.item.chkp = 1
                        // jml =jml +1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 1
                        // jml =jml +1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 1
                        // jml =jml +1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 1
                        // jml =jml +1
                    }
                } else {
                    $scope.currentAturanPakai.splice(index, 1);
                    if (data.id == 1) {
                        $scope.item.chkp = 0
                        // jml =jml -1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 0
                        // jml =jml -1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 0
                        // jml =jml -1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 0
                        // jml =jml -1
                    }
                }
                if ($scope.item.chkp == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chks == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chksr == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chkm == 1) {
                    jml = jml + 1
                }

                // if ($scope.item.aturanpakaitxt == undefined || $scope.item.aturanpakaitxt == ''){
                //     $scope.item.aturanpakaitxt = jml + 'x1'
                // } else {
                    $scope.item.aturanpakaitxt = jml + 'x' + $scope.item.aturanpakaitxt.substring(2)
                // }
                
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1' 
                if (jml == 0) {
                    $scope.item.aturanpakaitxt = ''
                }
                $scope.item.dosis = $scope.item.aturanpakaitxt.substring(2)
            }

            $scope.hapusOrder = function () {
                if ($scope.dataSelectedDelegasi == undefined) {
                    toastr.error("Data Belum Dipilih")
                }

                var stt = '';
                if (confirm('Yakin Mau Menghapus data? ')) {
                    stt = 'true';
                } else {
                    return;
                }

                medifirstService.post('emr/hapus-delegasi-obat', { norec: $scope.dataSelectedDelegasi.norec }).then(function (e) {
                    loadRiwayat();
                })
            }

            $scope.klikExist = function (dataSelectedResepExist) {
                var dataProduk = []
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelectedResepExist.id) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk
                $scope.getSatuan()
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

            $scope.cetakDelegasi = function () {
                if ($scope.item.noregistrasi == undefined) {
                    toastr.error('Data Belum Ada')
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-formulir-delegasi-pemberi-obat' + '&Noreg=' + $scope.item.noregistrasi + '&view=true', function (response) {

                });
            }

            $scope.klikGridD2 = function (e) {
                $scope.dataSelectedDelegasiDetail = e
            }
            $scope.inputKeterangan = function () {
                if ($scope.dataSelectedDelegasiDetail == undefined) {
                    toastr.error('Pilih data detail dulu')
                    return
                }
                $scope.item.Keterangan = $scope.dataSelectedDelegasiDetail.keterangan
                //$scope.dataSelectedDelegasiDetailnorec = dataSelectedDelegasiDetail.norec
                $scope.popUpInputKeterangan.center().open();
            }

            $scope.inputPerawat = function () {
                var data = [];
                var dataPush = {};
                for (var i = 0; i < dataDetail.length; i++) {
                    if (dataDetail[i].statCheckboxD == true) {
                        // if(dataDetail[i].jamperawatdelegasi !=null){
                        //     $scope.item.jamperawatdelegasi = new Date(moment(new Date()).format('YYYY-MM-DD '+ dataDetail[i].jamperawatdelegasi))
                        // }
                        $scope.item.jamperawatdelegasi = new Date()
                        if (dataDetail[i].perawatfk != null) {
                            $scope.item.PerawatPelaksana = { id: dataDetail[i].perawatfk, namalengkap: dataDetail[i].perawat }
                            // var DateNow = new Date();
                            // $scope.item.jamperawatdelegasi = DateNow
                        } else {
                            medifirstService.get("tatarekening/get-data-login", true, true, 20).then(function (data) {
                                // if (data.data.kelompokuser[0].kelompokuser == 'suster') {
                                    medifirstService.get("emr/get-pegawai-parts?id=" + data.data.pegawailoginfk.objectpegawaifk, true, true, 20).then(function (data) {
                                        $scope.item.PerawatPelaksana = { id: data.data[0].id, namalengkap: data.data[0].namalengkap }
                                        // var DateNow = new Date();
                                        // $scope.item.jamperawatdelegasi = DateNow
                                    });
                                // }
                            });
                        }
                        dataPush = {
                            no: dataDetail[i].no,
                            norec: dataDetail[i].norec,
                            waktuminum: dataDetail[i].waktuminum
                        }
                        data4.push(dataPush)
                    }
                }

                // if ($scope.dataSelectedDelegasiDetail == undefined) {
                if (data4 == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.popUpInputPerawat.center().open();
            }

            // $scope.inputPerawat = function () {
            //     if ($scope.dataSelectedDelegasiDetail == undefined) {
            //         toastr.error('Pilih data dulu')
            //         return
            //     }
            //     if ($scope.dataSelectedDelegasiDetail.perawatfk != null){
            //         $scope.item.PerawatPelaksana = {id: $scope.dataSelectedDelegasiDetail.perawatfk, namalengkap: $scope.dataSelectedDelegasiDetail.perawat}
            //     } else {
            //         medifirstService.get("tatarekening/get-data-login", true, true, 20).then(function (data) {
            //             if (data.data.kelompokuser[0].kelompokuser == 'suster'){
            //                  medifirstService.get("emr/get-pegawai-parts?id="+data.data.pegawailoginfk.objectpegawaifk, true, true, 20).then(function (data) {
            //                     $scope.item.PerawatPelaksana = {id: data.data[0].id, namalengkap: data.data[0].namalengkap}
            //                 });
            //             }
            //         });
            //     }
                
            //     $scope.popUpInputPerawat.center().open();
            // }

            // $scope.inputPerawatP = function () {
            //     var data = [];
            //     var dataPush = {};
            //     for (var i = 0; i < $scope.dataGridDelegasi._data.length; i++) {
            //         if ($scope.dataGridDelegasi._data[i].statCheckbox == true) {
            //             if ($scope.dataGridDelegasi._data[i].perawatfk != null) {
            //                 $scope.item.PerawatPelaksanaP = { id: $scope.dataSelectedDelegasiDetail.perawatfk, namalengkap: $scope.dataSelectedDelegasiDetail.perawat }
            //             } else {
            //                 medifirstService.get("tatarekening/get-data-login", true, true, 20).then(function (data) {
            //                     if (data.data.kelompokuser[0].kelompokuser == 'suster') {
            //                         medifirstService.get("emr/get-pegawai-parts?id=" + data.data.pegawailoginfk.objectpegawaifk, true, true, 20).then(function (data) {
            //                             $scope.item.PerawatPelaksanaP = { id: data.data[0].id, namalengkap: data.data[0].namalengkap }
            //                         });
            //                     }
            //                 });
            //             }
            //             dataPush = {
            //                 no: $scope.dataGridDelegasi._data[i].no,
            //                 norec: $scope.dataGridDelegasi._data[i].norec
            //             }
            //             data3.push(dataPush)
            //         }
            //     }

            //     // if ($scope.dataSelectedDelegasiDetail == undefined) {
            //     if (data3 == undefined) {
            //         toastr.error('Pilih data dulu')
            //         return
            //     }
            //     $scope.popUpInputPerawatPelaksana.center().open();
            // }

            $scope.saveKeteranganDetail = function () {

                var keterangan = ''
                if ($scope.item.Keterangan != undefined) {
                    keterangan = $scope.item.Keterangan
                }


                var objSave =
                {
                    norec: $scope.dataSelectedDelegasiDetail.norec,
                    keterangan: keterangan
                }

                medifirstService.post('emr/save-keterangan-delegasi-obat-detail', objSave).then(function (e) {
                    $scope.popUpInputPerawat.close();
                    loadRiwayat();
                })
            }

            // $scope.savePerawat = function () {

            //     var perawat = ''
            //     if ($scope.item.PerawatPelaksanaP != undefined) {
            //         perawat = $scope.item.PerawatPelaksanaP.id
            //     }


            //     var objSave =
            //     {
            //         // norec: $scope.dataSelectedDelegasi.norec,
            //         data: data3,
            //         perawat: perawat
            //     }

            //     medifirstService.post('emr/save-perawat-delegasi-obat', objSave).then(function (e) {
            //         $scope.popUpInputPerawatPelaksana.close();
            //         loadRiwayat();
            //     })
            // }
            function addZero(i) {
              if (i < 10) {
                i = "0" + i;
              }
              return i;
            }

            $scope.savePerawatDetail = function () {

                var perawat = ''
                if ($scope.item.PerawatPelaksana != undefined) {
                    perawat = $scope.item.PerawatPelaksana.id
                }

                var dateperawat = new Date()
                var tahunperawat = dateperawat.getFullYear()
                var bulanperawat = addZero(dateperawat.getMonth() + 1)
                var tanggalperwat = dateperawat.getDate()
                var jamperawat = addZero($scope.item.jamperawatdelegasi.getHours())+':'+addZero($scope.item.jamperawatdelegasi.getMinutes())
                var objSave =
                {
                    // norec: $scope.dataSelectedDelegasiDetail.norec,
                    data: data4,
                    // waktuminum : $scope.dataSelectedDelegasiDetail.waktuminum,
                    perawat: perawat,
                    jamperawatdelegasi: tahunperawat + '-' + bulanperawat + '-' + tanggalperwat + ' ' + jamperawat
                }

                medifirstService.post('emr/save-perawat-delegasi-obat-detail', objSave).then(function (e) {
                    $scope.popUpInputPerawat.close();
                    loadRiwayat();
                    loadRekap();
                })
            }

            $scope.rekap = function () {
                $scope.riwayatForm = false
                $scope.riwayatRekap = true
                $scope.riwayatFormResep = false;
                $scope.InputDelegasi = false;
                $scope.showButton1 = true
                loadRiwayat();
                loadRekap();
            }

            function loadRekap(params) {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-rekap-delegasi-obat?noreg=" + $scope.item.noregistrasi, true).then(function (dat) {
                    var datas = dat.data.data;
                    var ix = 0;
                    for (var i = 0; i < datas.length; i++) {
                        if (i>0){
                            if (datas[i].namaproduk == datas[ix].namaproduk){
                                datas[i].namaproduk = ''
                            } else {
                                ix = i
                            }
                        }

                        if (datas[i].rute == 'TETES HIDUNG') {
                            datas[i].rute = 'TH'
                        } if (datas[i].rute == 'TETES TELINGA') {
                            datas[i].rute = 'TT'
                        } if (datas[i].rute == 'TETES MATA') {
                            datas[i].rute = 'TM'
                        }

                       datas[i].no = i + 1 
                       if (datas[i].a1 == null){
                        datas[i].a1 = '-'
                       }
                       if (datas[i].a2 == null){
                        datas[i].a2 = '-'
                       }
                       if (datas[i].a3 == null){
                        datas[i].a3 = '-'
                       }
                       if (datas[i].a4 == null){
                        datas[i].a4 = '-'
                       }
                       if (datas[i].a5 == null){
                        datas[i].a5 = '-'
                       }
                       if (datas[i].a6 == null){
                        datas[i].a6 = '-'
                       }
                       if (datas[i].a7 == null){
                        datas[i].a7 = '-'
                       }
                       if (datas[i].a8 == null){
                        datas[i].a8 = '-'
                       }
                       if (datas[i].a9 == null){
                        datas[i].a9 = '-'
                       }
                       if (datas[i].a10 == null){
                        datas[i].a10 = '-'
                       }
                       if (datas[i].a11 == null){
                        datas[i].a11 = '-'
                       }
                       if (datas[i].a12 == null){
                        datas[i].a12 = '-'
                       }
                       if (datas[i].a13 == null){
                        datas[i].a13 = '-'
                       }
                       if (datas[i].a14 == null){
                        datas[i].a14 = '-'
                       }
                       if (datas[i].a15 == null){
                        datas[i].a15 = '-'
                       }
                       if (datas[i].a16 == null){
                        datas[i].a16 = '-'
                       }
                       if (datas[i].a17 == null){
                        datas[i].a17 = '-'
                       }
                       if (datas[i].a18 == null){
                        datas[i].a18 = '-'
                       }
                       if (datas[i].a19 == null){
                        datas[i].a19 = '-'
                       }
                       if (datas[i].a20 == null){
                        datas[i].a20 = '-'
                       }
                       if (datas[i].a21 == null){
                        datas[i].a21 = '-'
                       }
                       if (datas[i].a22 == null){
                        datas[i].a22 = '-'
                       }
                       if (datas[i].a23 == null){
                        datas[i].a23 = '-'
                       }
                       if (datas[i].a24 == null){
                        datas[i].a24 = '-'
                       }
                       if (datas[i].a25 == null){
                        datas[i].a25 = '-'
                       }
                       if (datas[i].a26 == null){
                        datas[i].a26 = '-'
                       }
                       if (datas[i].a27 == null){
                        datas[i].a27 = '-'
                       }
                       if (datas[i].a28 == null){
                        datas[i].a28 = '-'
                       }
                       if (datas[i].a29 == null){
                        datas[i].a29 = '-'
                       }
                       if (datas[i].a30 == null){
                        datas[i].a30 = '-'
                       }
                       if (datas[i].a31 == null){
                        datas[i].a31 = '-'
                       }

                       if (datas[i].b1 == null){
                        datas[i].b1 = '-'
                       }
                       if (datas[i].b2 == null){
                        datas[i].b2 = '-'
                       }
                       if (datas[i].b3 == null){
                        datas[i].b3 = '-'
                       }
                       if (datas[i].b4 == null){
                        datas[i].b4 = '-'
                       }
                       if (datas[i].b5 == null){
                        datas[i].b5 = '-'
                       }
                       if (datas[i].b6 == null){
                        datas[i].b6 = '-'
                       }
                       if (datas[i].b7 == null){
                        datas[i].b7 = '-'
                       }
                       if (datas[i].b8 == null){
                        datas[i].b8 = '-'
                       }
                       if (datas[i].b9 == null){
                        datas[i].b9 = '-'
                       }
                       if (datas[i].b10 == null){
                        datas[i].b10 = '-'
                       }
                       if (datas[i].b11 == null){
                        datas[i].b11 = '-'
                       }
                       if (datas[i].b12 == null){
                        datas[i].b12 = '-'
                       }
                       if (datas[i].b13 == null){
                        datas[i].b13 = '-'
                       }
                       if (datas[i].b14 == null){
                        datas[i].b14 = '-'
                       }
                       if (datas[i].b15 == null){
                        datas[i].b15 = '-'
                       }
                       if (datas[i].b16 == null){
                        datas[i].b16 = '-'
                       }
                       if (datas[i].b17 == null){
                        datas[i].b17 = '-'
                       }
                       if (datas[i].b18 == null){
                        datas[i].b18 = '-'
                       }
                       if (datas[i].b19 == null){
                        datas[i].b19 = '-'
                       }
                       if (datas[i].b20 == null){
                        datas[i].b20 = '-'
                       }
                       if (datas[i].b21 == null){
                        datas[i].b21 = '-'
                       }
                       if (datas[i].b22 == null){
                        datas[i].b22 = '-'
                       }
                       if (datas[i].b23 == null){
                        datas[i].b23 = '-'
                       }
                       if (datas[i].b24 == null){
                        datas[i].b24 = '-'
                       }
                       if (datas[i].b25 == null){
                        datas[i].b25 = '-'
                       }
                       if (datas[i].b26 == null){
                        datas[i].b26 = '-'
                       }
                       if (datas[i].b27 == null){
                        datas[i].b27 = '-'
                       }
                       if (datas[i].b28 == null){
                        datas[i].b28 = '-'
                       }
                       if (datas[i].b29 == null){
                        datas[i].b29 = '-'
                       }
                       if (datas[i].b30 == null){
                        datas[i].b30 = '-'
                       }
                       if (datas[i].b31 == null){
                        datas[i].b31 = '-'
                       }

                       if (datas[i].c1 == null){
                        datas[i].c1 = '-'
                       }
                       if (datas[i].c2 == null){
                        datas[i].c2 = '-'
                       }
                       if (datas[i].c3 == null){
                        datas[i].c3 = '-'
                       }
                       if (datas[i].c4 == null){
                        datas[i].c4 = '-'
                       }
                       if (datas[i].c5 == null){
                        datas[i].c5 = '-'
                       }
                       if (datas[i].c6 == null){
                        datas[i].c6 = '-'
                       }
                       if (datas[i].c7 == null){
                        datas[i].c7 = '-'
                       }
                       if (datas[i].c8 == null){
                        datas[i].c8 = '-'
                       }
                       if (datas[i].c9 == null){
                        datas[i].c9 = '-'
                       }
                       if (datas[i].c10 == null){
                        datas[i].c10 = '-'
                       }
                       if (datas[i].ca11 == null){
                        datas[i].c11 = '-'
                       }
                       if (datas[i].c12 == null){
                        datas[i].c12 = '-'
                       }
                       if (datas[i].c13 == null){
                        datas[i].c13 = '-'
                       }
                       if (datas[i].c14 == null){
                        datas[i].c14 = '-'
                       }
                       if (datas[i].c15 == null){
                        datas[i].c15 = '-'
                       }
                       if (datas[i].c16 == null){
                        datas[i].c16 = '-'
                       }
                       if (datas[i].c17 == null){
                        datas[i].c17 = '-'
                       }
                       if (datas[i].c18 == null){
                        datas[i].c18 = '-'
                       }
                       if (datas[i].c19 == null){
                        datas[i].c19 = '-'
                       }
                       if (datas[i].c20 == null){
                        datas[i].c20 = '-'
                       }
                       if (datas[i].c21 == null){
                        datas[i].c21 = '-'
                       }
                       if (datas[i].c22 == null){
                        datas[i].c22 = '-'
                       }
                       if (datas[i].c23 == null){
                        datas[i].c23 = '-'
                       }
                       if (datas[i].c24 == null){
                        datas[i].c24 = '-'
                       }
                       if (datas[i].c25 == null){
                        datas[i].c25 = '-'
                       }
                       if (datas[i].c26 == null){
                        datas[i].c26 = '-'
                       }
                       if (datas[i].c27 == null){
                        datas[i].c27 = '-'
                       }
                       if (datas[i].c28 == null){
                        datas[i].c28 = '-'
                       }
                       if (datas[i].c29 == null){
                        datas[i].c29 = '-'
                       }
                       if (datas[i].c30 == null){
                        datas[i].c30 = '-'
                       }
                       if (datas[i].c31 == null){
                        datas[i].c31 = '-'
                       }
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataGridRekapTitle = new kendo.data.DataSource({
                        data: datas
                    });
                    $scope.dataGridRekap = new kendo.data.DataSource({
                        data: datas
                    });
                });
            }

            $scope.GridRekapTitle = {
                // toolbar: [
                //     "excel",
                // ],
                // excel: {
                //     fileName: "DaftarPasienRawatInap.xlsx",
                //     allPages: true,
                // },
                // excelExport: function (e) {
                //     var sheet = e.workbook.sheets[0];
                //     sheet.frozenRows = 2;
                //     sheet.mergedCells = ["A1:M1"];
                //     sheet.name = "Sheet";

                //     var myHeaders = [{
                //         value: "Daftar Pasien Rawat Inap",
                //         fontSize: 20,
                //         textAlign: "center",
                //         background: "#ffffff",
                //         // color:"#ffffff"
                //     }];

                //     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                // },
                width: 'auto',
                selectable: 'row',
                pageable: true,
                columns: [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "15px",
                            },
                            {
                                "field": "namaproduk",
                                "title": "Nama Obat",
                                "width": "100px",
                            },
                            {
                                "field": "rute",
                                "title": "Rute",
                                "width": "15px",
                            },
                            {
                                "field": "dosis",
                                "title": "Dosis",
                                "width": "20px",
                            },
                            {
                                "field": "waktuminum",
                                "title": "WM",
                                "width": "15px",
                            }
                        ]
            };

            $scope.GridRekap = {
                // toolbar: [
                //     "excel",
                // ],
                // excel: {
                //     fileName: "DaftarPasienRawatInap.xlsx",
                //     allPages: true,
                // },
                // excelExport: function (e) {
                //     var sheet = e.workbook.sheets[0];
                //     sheet.frozenRows = 2;
                //     sheet.mergedCells = ["A1:M1"];
                //     sheet.name = "Sheet";

                //     var myHeaders = [{
                //         value: "Daftar Pasien Rawat Inap",
                //         fontSize: 20,
                //         textAlign: "center",
                //         background: "#ffffff",
                //         // color:"#ffffff"
                //     }];

                //     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                // },
                selectable: 'row',
                pageable: true,
                columns: [
                {
                    "title": "<span class='style-center'>Bulan Pertama</span>",
                    columns: [
                        {
                            "field": "a1",
                            "title": "1",
                            "width": "50px",
                            "attributes": {"class" : "# if(a1 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a2",
                            "title": "2",
                            "width": "50px",
                            "attributes": {"class" : "# if(a2 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a3",
                            "title": "3",
                            "width": "50px",
                            "attributes": {"class" : "# if(a3 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a4",
                            "title": "4",
                            "width": "50px",
                            "attributes": {"class" : "# if(a4 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a5",
                            "title": "5",
                            "width": "50px",
                            "attributes": {"class" : "# if(a5 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a6",
                            "title": "6",
                            "width": "50px",
                            "attributes": {"class" : "# if(a6 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a7",
                            "title": "7",
                            "width": "50px",
                            "attributes": {"class" : "# if(a7 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a8",
                            "title": "8",
                            "width": "50px",
                            "attributes": {"class" : "# if(a8 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a9",
                            "title": "9",
                            "width": "50px",
                            "attributes": {"class" : "# if(a9 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a10",
                            "title": "10",
                            "width": "50px",
                            "attributes": {"class" : "# if(a10 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a11",
                            "title": "11",
                            "width": "50px",
                            "attributes": {"class" : "# if(a11 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a12",
                            "title": "12",
                            "width": "50px",
                            "attributes": {"class" : "# if(a12 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a13",
                            "title": "13",
                            "width": "50px",
                            "attributes": {"class" : "# if(a13 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a14",
                            "title": "14",
                            "width": "50px",
                            "attributes": {"class" : "# if(a14 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a15",
                            "title": "15",
                            "width": "50px",
                            "attributes": {"class" : "# if(a15 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a16",
                            "title": "16",
                            "width": "50px",
                            "attributes": {"class" : "# if(a16 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a17",
                            "title": "17",
                            "width": "50px",
                            "attributes": {"class" : "# if(a17 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a18",
                            "title": "18",
                            "width": "50px",
                            "attributes": {"class" : "# if(a18 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a19",
                            "title": "19",
                            "width": "50px",
                            "attributes": {"class" : "# if(a19 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a20",
                            "title": "20",
                            "width": "50px",
                            "attributes": {"class" : "# if(a20 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a21",
                            "title": "21",
                            "width": "50px",
                            "attributes": {"class" : "# if(a21 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a22",
                            "title": "22",
                            "width": "50px",
                            "attributes": {"class" : "# if(a22 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a23",
                            "title": "23",
                            "width": "50px",
                            "attributes": {"class" : "# if(a23 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a24",
                            "title": "24",
                            "width": "50px",
                            "attributes": {"class" : "# if(a24 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a25",
                            "title": "25",
                            "width": "50px",
                            "attributes": {"class" : "# if(a25 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a26",
                            "title": "26",
                            "width": "50px",
                            "attributes": {"class" : "# if(a26 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a27",
                            "title": "27",
                            "width": "50px",
                            "attributes": {"class" : "# if(a27 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a28",
                            "title": "28",
                            "width": "50px",
                            "attributes": {"class" : "# if(a28 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a29",
                            "title": "29",
                            "width": "50px",
                            "attributes": {"class" : "# if(a29 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a30",
                            "title": "30",
                            "width": "50px",
                            "attributes": {"class" : "# if(a30 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "a31",
                            "title": "31",
                            "width": "50px",
                            "attributes": {"class" : "# if(a31 == '-') {# greycell #} else {# greencell #} #"}
                        }
                    ]
                },
                {
                    "title": "<span class='style-center'>Bulan Kedua</span>",
                    "columns": 
                    [
                        {
                            "field": "b1",
                            "title": "1",
                            "width": "50px",
                            "attributes": {"class" : "# if(b1 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b2",
                            "title": "2",
                            "width": "50px",
                            "attributes": {"class" : "# if(b2 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b3",
                            "title": "3",
                            "width": "50px",
                            "attributes": {"class" : "# if(b3 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b4",
                            "title": "4",
                            "width": "50px",
                            "attributes": {"class" : "# if(b4 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b5",
                            "title": "5",
                            "width": "50px",
                            "attributes": {"class" : "# if(b5 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b6",
                            "title": "6",
                            "width": "50px",
                            "attributes": {"class" : "# if(b6 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b7",
                            "title": "7",
                            "width": "50px",
                            "attributes": {"class" : "# if(b7 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b8",
                            "title": "8",
                            "width": "50px",
                            "attributes": {"class" : "# if(b8 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b9",
                            "title": "9",
                            "width": "50px",
                            "attributes": {"class" : "# if(b9 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b10",
                            "title": "10",
                            "width": "50px",
                            "attributes": {"class" : "# if(b10 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b11",
                            "title": "11",
                            "width": "50px",
                            "attributes": {"class" : "# if(b11 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b12",
                            "title": "12",
                            "width": "50px",
                            "attributes": {"class" : "# if(b12 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b13",
                            "title": "13",
                            "width": "50px",
                            "attributes": {"class" : "# if(b13 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b14",
                            "title": "14",
                            "width": "50px",
                            "attributes": {"class" : "# if(b14 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b15",
                            "title": "15",
                            "width": "50px",
                            "attributes": {"class" : "# if(b15 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b16",
                            "title": "16",
                            "width": "50px",
                            "attributes": {"class" : "# if(b16 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b17",
                            "title": "17",
                            "width": "50px",
                            "attributes": {"class" : "# if(b17 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b18",
                            "title": "18",
                            "width": "50px",
                            "attributes": {"class" : "# if(b18 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b19",
                            "title": "19",
                            "width": "50px",
                            "attributes": {"class" : "# if(b19 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b20",
                            "title": "20",
                            "width": "50px",
                            "attributes": {"class" : "# if(b20 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b21",
                            "title": "21",
                            "width": "50px",
                            "attributes": {"class" : "# if(b21 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b22",
                            "title": "22",
                            "width": "50px",
                            "attributes": {"class" : "# if(b22 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b23",
                            "title": "23",
                            "width": "50px",
                            "attributes": {"class" : "# if(b23 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b24",
                            "title": "24",
                            "width": "50px",
                            "attributes": {"class" : "# if(b24 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b25",
                            "title": "25",
                            "width": "50px",
                            "attributes": {"class" : "# if(b25 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b26",
                            "title": "26",
                            "width": "50px",
                            "attributes": {"class" : "# if(b26 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b27",
                            "title": "27",
                            "width": "50px",
                            "attributes": {"class" : "# if(b27 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b28",
                            "title": "28",
                            "width": "50px",
                            "attributes": {"class" : "# if(b28 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b29",
                            "title": "29",
                            "width": "50px",
                            "attributes": {"class" : "# if(b29 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b30",
                            "title": "30",
                            "width": "50px",
                            "attributes": {"class" : "# if(b30 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "b31",
                            "title": "31",
                            "width": "50px",
                            "attributes": {"class" : "# if(b31 == '-') {# greycell #} else {# greencell #} #"}
                        }
                    ]
                },
                {
                    "title": "<span class='style-center'>Bulan Ketiga</span>",
                    "columns": 
                    [
                        {
                            "field": "c1",
                            "title": "1",
                            "width": "50px",
                            "attributes": {"class" : "# if(c1 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c2",
                            "title": "2",
                            "width": "50px",
                            "attributes": {"class" : "# if(c2 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c3",
                            "title": "3",
                            "width": "50px",
                            "attributes": {"class" : "# if(c3 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c4",
                            "title": "4",
                            "width": "50px",
                            "attributes": {"class" : "# if(c4 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c5",
                            "title": "5",
                            "width": "50px",
                            "attributes": {"class" : "# if(c5 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c6",
                            "title": "6",
                            "width": "50px",
                            "attributes": {"class" : "# if(c6 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c7",
                            "title": "7",
                            "width": "50px",
                            "attributes": {"class" : "# if(c7 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c8",
                            "title": "8",
                            "width": "50px",
                            "attributes": {"class" : "# if(c8 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c9",
                            "title": "9",
                            "width": "50px",
                            "attributes": {"class" : "# if(c9 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c10",
                            "title": "10",
                            "width": "50px",
                            "attributes": {"class" : "# if(c10 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c11",
                            "title": "11",
                            "width": "50px",
                            "attributes": {"class" : "# if(c11 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c12",
                            "title": "12",
                            "width": "50px",
                            "attributes": {"class" : "# if(c12 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c13",
                            "title": "13",
                            "width": "50px",
                            "attributes": {"class" : "# if(c13 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c14",
                            "title": "14",
                            "width": "50px",
                            "attributes": {"class" : "# if(c14 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c15",
                            "title": "15",
                            "width": "50px",
                            "attributes": {"class" : "# if(c15 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c16",
                            "title": "16",
                            "width": "50px",
                            "attributes": {"class" : "# if(c16 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c17",
                            "title": "17",
                            "width": "50px",
                            "attributes": {"class" : "# if(c17 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c18",
                            "title": "18",
                            "width": "50px",
                            "attributes": {"class" : "# if(c18 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c19",
                            "title": "19",
                            "width": "50px",
                            "attributes": {"class" : "# if(c19 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c20",
                            "title": "20",
                            "width": "50px",
                            "attributes": {"class" : "# if(c20 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c21",
                            "title": "21",
                            "width": "50px",
                            "attributes": {"class" : "# if(c21 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c22",
                            "title": "22",
                            "width": "50px",
                            "attributes": {"class" : "# if(c22 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c23",
                            "title": "23",
                            "width": "50px",
                            "attributes": {"class" : "# if(c23 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c24",
                            "title": "24",
                            "width": "50px",
                            "attributes": {"class" : "# if(c24 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c25",
                            "title": "25",
                            "width": "50px",
                            "attributes": {"class" : "# if(c25 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c26",
                            "title": "26",
                            "width": "50px",
                            "attributes": {"class" : "# if(c26 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c27",
                            "title": "27",
                            "width": "50px",
                            "attributes": {"class" : "# if(c27 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c28",
                            "title": "28",
                            "width": "50px",
                            "attributes": {"class" : "# if(c28 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c29",
                            "title": "29",
                            "width": "50px",
                            "attributes": {"class" : "# if(c29 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c30",
                            "title": "30",
                            "width": "50px",
                            "attributes": {"class" : "# if(c30 == '-') {# greycell #} else {# greencell #} #"}
                        },
                        {
                            "field": "c31",
                            "title": "31",
                            "width": "50px",
                            "attributes": {"class" : "# if(c31 == '-') {# greycell #} else {# greencell #} #"}
                        }
                    ]
                }
                ]
            };

            //***********************************

        }
    ]);
});

