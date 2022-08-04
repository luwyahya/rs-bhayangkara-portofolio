define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('SaldoBarangDetailPerhariCtrl', ['$scope', 'ModelItem', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function($scope, ModelItem, dateHelper, medifirstService, cacheHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            var details = [];
            $scope.selectedJenisProduk = []
            $scope.selectedDetailJenis = []
            LoadCache();

            $scope.selectOptionsDetailJenis = {
                // placeholder: "Pilih Detail Jenis Produk...",
                dataTextField: "detailjenisproduk",
                dataValueField: "id",
                filter: "contains"
            };
            $scope.selectOptJenisProduk = {
                // placeholder: "Pilih Jenis Produk...",
                dataTextField: "jenisproduk",
                dataValueField: "id",
                filter: "contains"
            };

            function LoadCache() {
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function(data) {
                    $scope.listKdSirs = data
                    $scope.listKdSirs1 = data
                    $scope.listProduk = data
                });

                medifirstService.get('logistik/get-combo-logistik').then(function(dat) {
                    var dataCombo = dat.data;
                    $scope.listRuangan = dataCombo.ruangan //ruanganall
                    $scope.listJenisProduk = dataCombo.databentuk
                    $scope.listDetailJenis = dataCombo.detailjenisproduk
                    $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    var chacePeriode = cacheHelper.get('SaldoBarangDetailCtrl');
                    if (chacePeriode != undefined) {
                        $scope.item.tglAwal = new Date(chacePeriode[0]);
                        $scope.item.tglAkhir = new Date(chacePeriode[1]);
                        init();
                    } else {
                        $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                        $scope.item.tglAkhir = $scope.now;
                        init();
                    }
                });
            }

            $scope.newOrder = function() {
                $state.go('OrderBarangLogistik')
            }

            function init() {

                $scope.isRouteLoading = true;
                // var ins =""
                // if ($scope.item.instalasi != undefined){
                //     var ins ="&dpid=" +$scope.item.instalasi.id
                // }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = +$scope.item.ruangan.id
                }

                var listJenisProd = ""
                if ($scope.selectedJenisProduk.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedJenisProduk.length - 1; i >= 0; i--) {
                        var c = $scope.selectedJenisProduk[i].id
                        b = "," + c
                        a = a + b
                    }
                    listJenisProd = a.slice(1, a.length)
                }
                var listDetailJenis = ""
                if ($scope.selectedDetailJenis.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDetailJenis.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDetailJenis[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDetailJenis = a.slice(1, a.length)

                }
                var KdSirs1 = ""
                if ($scope.item.KdSirs1 != undefined) {
                    KdSirs1 = "&KdSirs1=" + $scope.item.KdSirs1
                }
                var KdSirs2 = ""
                if ($scope.item.KdSirs2 != undefined) {
                    KdSirs2 = "&KdSirs2=" + $scope.item.KdSirs2
                }
                var IdProduk = ""
                if ($scope.item.Produk != undefined) {
                    IdProduk = "&IdProduk=" + $scope.item.Produk.id
                }


                //  var produkfk =""
                // if ($scope.item.namaBarang != undefined){
                //     var produkfk ="&produkfk=" + $scope.item.namaBarang.id
                // }
                var ttlsaldoawal = 0
                var ttlpenerimaan = 0
                var ttlpengeluaran = 0
                var ttlsaldoakhir = 0

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var start = new Date(tglAwal);
                var end = new Date(tglAkhir);
                $scope.dataGridv = new kendo.data.DataSource({
                    data: [],
                    pageSize: 20,
                    total: 0,
                    serverPaging: false,
                });
                $scope.dataGridv2 = new kendo.data.DataSource({
                    data: [],
                    pageSize: 20,
                    total: 0,
                    serverPaging: false,
                });

                var loop = new Date(start);
                while (loop <= end) {
                    // alert(loop);           


                    var tanggalawal = moment(loop).format('YYYY-MM-DD 00:00:00');
                    var tanggalakhir = moment(loop).format('YYYY-MM-DD 23:59:59');
                    medifirstService.get("logistik/get-daftar-stock-flowperhari?" +
                        "tglawal=" + tanggalawal +
                        "&tglakhir=" + tanggalakhir +
                        "&ruanganfk=" + rg +
                        "&jenisprodukfk=" + listJenisProd +
                        "&detailjenisprodukfk=" + listDetailJenis +
                        KdSirs1 + KdSirs2 + IdProduk, true).then(function(dat) {
                        details = dat.data.data;
                        // $scope.isRouteLoading = false;
                        // for (var i = 0; i < dat.data.data.length; i++) {
                        //     dat.data.data[i].no = i + 1
                        //     ttlsaldoawal = parseFloat(ttlsaldoawal) + parseFloat(dat.data.data[i].ttlawal)
                        //     ttlpenerimaan = parseFloat(ttlpenerimaan) + parseFloat(dat.data.data[i].ttlmasuk)
                        //     ttlpengeluaran = parseFloat(ttlpengeluaran) + parseFloat(dat.data.data[i].ttlkeluar)
                        //     ttlsaldoakhir = parseFloat(ttlsaldoakhir) + parseFloat(dat.data.data[i].ttlakhir)
                        // }

                        // $scope.item.ttlsaldoawal = parseFloat(ttlsaldoawal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlpenerimaan = parseFloat(ttlpenerimaan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlpengeluaran = parseFloat(ttlpengeluaran).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlsaldoakhir = parseFloat(ttlsaldoakhir).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");


                    });

                    var newDate = loop.setDate(loop.getDate() + 1);
                    loop = new Date(newDate);

                }
                var isnarkotika = ""
                if ($scope.item.narkotika == true) {
                    isnarkotika = "&isnarkotika=" + $scope.item.narkotika
                }
                var ispsikotropika = ""
                if ($scope.item.psikotropika == true) {
                    ispsikotropika = "&ispsikotropika=" + $scope.item.psikotropika
                }
                medifirstService.get("logistik/get-daftar-stock-flowperhariget?" +
                    "tglawal=" + tglAwal +
                    "&tglakhir=" + tglAkhir +
                    "&ruanganfk=" + rg +
                    "&jenisprodukfk=" + listJenisProd +
                    "&detailjenisprodukfk=" + listDetailJenis +
                    KdSirs1 + KdSirs2 + IdProduk + isnarkotika + ispsikotropika, true).then(function(dat) {
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].no = i + 1
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 20,
                        total: dat.data.data.length,
                        serverPaging: false,
                    });
                    $scope.dataGridv2 = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 20,
                        total: dat.data.data.length,
                        serverPaging: false,
                    });

                    $scope.dataExcel = dat.data.data;

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
                cacheHelper.set('SaldoBarangDetailCtrl', chacePeriode);


            }
            $scope.getRuangan = function() {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function() {
                // $scope.popUpCari.center().open()
                init();
            }

            $scope.cariFilternarkotika = function() {
                // $scope.popUpCari.center().open()
                initnarkotika();
            }
            $scope.cariFilterpsikotropika = function() {
                // $scope.popUpCari.center().open()
                initpiskotropika();
            }



            $scope.cariPopUp = function() {
                console.log($scope.selectedJenisProduk)
                init();
                $scope.popUpCari.close()
            }
            $scope.batal = function() {
                $scope.popUpCari.close()
            }

            // $scope.TransaksiPelayanan = function(){
            //     
            //     var arrStr ={ 0 : $scope.dataSelected.nocm ,
            //         1 : $scope.dataSelected.namapasien,
            //         2 : $scope.dataSelected.jeniskelamin,
            //         3 : $scope.dataSelected.noregistrasi, 
            //         4 : $scope.dataSelected.umur,
            //         5 : $scope.dataSelected.klid,
            //         6 : $scope.dataSelected.namakelas,
            //         7 : $scope.dataSelected.tglregistrasi,
            //         8 : $scope.dataSelected.norec_apd,
            //         9 : 'resep'
            //     }
            //     cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
            //     $state.go('TransaksiPelayananApotik')

            //     var arrStr2 ={ 0 : $scope.dataSelected.norec 
            //     }
            //     cacheHelper.set('DaftarResepCtrl', arrStr2);
            //     $state.go('DaftarResepCtrl')
            // }

            $scope.CetakBuktiLayanan = function() {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function(response) {
                    //aadc=response;
                });
            }
            $scope.EditOrder = function() {
                if ($scope.dataSelected.status == 'Terima Order Barang') {
                    alert('Tidak bisa mengubah order ini!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
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
                cacheHelper.set('OrderBarangLogistikCtrl', chacePeriode);
                $state.go('OrderBarangLogistik')
            }
            $scope.KirimBarang = function() {
                if ($scope.dataSelected.status != 'Terima Order Barang') {
                    alert('Tidak bisa mengirim ke ruangan Sendiri!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
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
                cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                $state.go('KirimBarangLogistik')
            }

            $scope.BatalStokOpname = function() {
                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUp.close();
            }

            $scope.closingPersediaan = function() {
                $scope.popUp.center().open();
            }

            $scope.lanjutkan = function() {
                var stt = 'false'
                if (confirm('Close Persediaan bulan "' + dateHelper.formatDate($scope.item.tglAkhir, "MMMM YYYY") + '"')) {
                    // Save it!
                    stt = 'true';
                    // var norec_tea = $scope.item.norecSaldo
                    // if ($scope.item.norecSaldo ==  undefined){
                    //     norec_tea ='-'
                    // }
                    stt = 'true';
                    // var norec_tea = $scope.item.norecSaldo
                    // if ($scope.item.norecSaldo ==  undefined){
                    //     norec_tea ='-'
                    // }\
                    var ayena = new Date();
                    var tgltgl = moment($scope.item.tglAkhir).format('YYYYMM');
                    var tanggal = moment(ayena).format('YYYY-MM-DD HH:mm:ss');
                    debugger;
                    var objSave = {
                        ym: tgltgl,
                        data: details,
                        tanggal: tanggal,
                        objectruangan: $scope.item.ruangan.id
                    }
                    medifirstService.post('logistik/save-closing-persediaan', objSave).then(function(e) {

                    })
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUp.close();
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "LaporanPersediaan " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                        moment($scope.item.tglAkhir).format('DD-MM-YYYY') + ".xlsx",
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:Z1"];
                    sheet.name = "KSM";

                    var myHeaders = [{
                        value: "Laporan Persediaan Tanggal " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                            moment($scope.item.tglAkhir).format('DD-MM-YYYY'),
                        fontSize: 20,
                        textAlign: "center",
                        background: "#c1d2d2",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "20px",
                    },
                    // {
                    //     field: "kodebmn",
                    //     title: "Kode",
                    //     width: "30px"
                    // },
                    // {
                    //     field: "kodeproduk",
                    //     title: "Kode Sirs",
                    //     width : "30px"
                    // },
                    {
                        field: "namaproduk",
                        title: "Nama Barang",
                        width: "90px"
                    },
                    // {
                    //     field: "satuanstandar",
                    //     title: "Satuan",
                    //     width: "20px",
                    // },
                    {
                        title: "1",
                        columns: [{
                                field: "awal1",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk1",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar1",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir1",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "2",
                        columns: [{
                                field: "awal2",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk2",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar2",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir2",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "3",
                        columns: [{
                                field: "awal3",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk3",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar3",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir3",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "4",
                        columns: [{
                                field: "awal4",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk4",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar4",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir4",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "5",
                        columns: [{
                                field: "awal5",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk5",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar5",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir5",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "6",
                        columns: [{
                                field: "awal6",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk6",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar6",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir6",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "7",
                        columns: [{
                                field: "awal7",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk7",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar7",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir7",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "8",
                        columns: [{
                                field: "awal8",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk8",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar8",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir8",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "9",
                        columns: [{
                                field: "awal9",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk9",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar9",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir9",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "10",
                        columns: [{
                                field: "awal10",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk10",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar10",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir10",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "11",
                        columns: [{
                                field: "awal11",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk11",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar11",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir11",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "12",
                        columns: [{
                                field: "awal12",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk12",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar12",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir12",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "13",
                        columns: [{
                                field: "awal13",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk13",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar13",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir13",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "14",
                        columns: [{
                                field: "awal14",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk14",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar14",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir14",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "15",
                        columns: [{
                                field: "awal15",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk15",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar15",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir15",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "16",
                        columns: [{
                                field: "awal16",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk16",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar16",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir16",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "17",
                        columns: [{
                                field: "awal17",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk17",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar17",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir17",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "18",
                        columns: [{
                                field: "awal18",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk18",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar18",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir18",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "19",
                        columns: [{
                                field: "awal19",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk19",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar19",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir19",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "20",
                        columns: [{
                                field: "awal20",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk20",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar20",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir20",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "21",
                        columns: [{
                                field: "awal21",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk21",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar21",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir21",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "22",
                        columns: [{
                                field: "awal22",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk22",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar22",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir22",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "23",
                        columns: [{
                                field: "awal23",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk23",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar23",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir23",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "24",
                        columns: [{
                                field: "awal24",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk24",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar24",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir24",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "25",
                        columns: [{
                                field: "awal25",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk25",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar25",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir25",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "26",
                        columns: [{
                                field: "awal26",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk26",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar26",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir26",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "27",
                        columns: [{
                                field: "awal27",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk27",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar27",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir27",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "28",
                        columns: [{
                                field: "awal28",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk28",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar28",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir28",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "29",
                        columns: [{
                                field: "awal29",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk29",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar29",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir29",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "30",
                        columns: [{
                                field: "awal30",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk30",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar30",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir30",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                    {
                        title: "31",
                        columns: [{
                                field: "awal31",
                                title: "awal",
                                width: "30px",
                            },
                            {
                                field: "masuk31",
                                title: "masuk",
                                width: "60px",
                            },
                            {
                                field: "keluar31",
                                title: "keluar",
                                width: "60px",
                            },
                            {
                                field: "akhir31",
                                title: "akhir",
                                width: "60px",
                            }
                        ],
                        width: "90px",
                    },
                ],

            };

            $scope.columnGridv2 = {
                toolbar: ["excel"],
                excel: {
                    fileName: "LaporanPersediaan " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                        moment($scope.item.tglAkhir).format('DD-MM-YYYY') + ".xlsx",
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:Z1"];
                    sheet.name = "KSM";

                    var myHeaders = [{
                        value: "Laporan Persediaan Tanggal " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                            moment($scope.item.tglAkhir).format('DD-MM-YYYY'),
                        fontSize: 20,
                        textAlign: "center",
                        background: "#c1d2d2",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "20px",
                    },
                    // {
                    //     field: "kodebmn",
                    //     title: "Kode",
                    //     width: "30px"
                    // },
                    // {
                    //     field: "kodeproduk",
                    //     title: "Kode Sirs",
                    //     width : "30px"
                    // },
                    {
                        field: "namaproduk",
                        title: "Nama Barang",
                        width: "90px"
                    }, {
                        field: "satuanstandar",
                        title: "Satuan",
                        width: "40px"
                    },
                    {
                        field: "awal1",
                        title: "Stok awal",
                        width: "90px"
                    },
                    {
                        field: "jumlahmasuk",
                        title: "masuk",
                        width: "90px"
                    },
                    // {
                    //     field: "satuanstandar",
                    //     title: "Satuan",
                    //     width: "20px",
                    // },
                    {
                        title: "1",
                        columns: [{
                            field: "keluar1",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "2",
                        columns: [{
                                field: "keluar2",
                                title: "keluar",
                                width: "60px",
                            }

                        ],
                        width: "90px",
                    },
                    {
                        title: "3",
                        columns: [{
                            field: "keluar3",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "4",
                        columns: [{
                            field: "keluar4",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "5",
                        columns: [{
                            field: "keluar5",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "6",
                        columns: [{
                            field: "keluar6",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "7",
                        columns: [{
                            field: "keluar7",
                            title: "masuk",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "8",
                        columns: [{
                            field: "keluar8",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "9",
                        columns: [{
                            field: "keluar9",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "10",
                        columns: [{
                            field: "keluar10",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "11",
                        columns: [{
                            field: "keluar11",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "12",
                        columns: [{
                            field: "keluar12",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "13",
                        columns: [{
                            field: "keluar13",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "14",
                        columns: [{
                            field: "keluar14",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "15",
                        columns: [{
                            field: "keluar15",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "16",
                        columns: [{
                            field: "keluar16",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "17",
                        columns: [{
                            field: "keluar17",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "18",
                        columns: [{
                            field: "keluar18",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "19",
                        columns: [{
                            field: "keluar19",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "20",
                        columns: [{
                            field: "keluar20",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "21",
                        columns: [{
                            field: "keluar21",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "22",
                        columns: [{
                            field: "keluar22",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "23",
                        columns: [{
                            field: "keluar23",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "24",
                        columns: [{
                            field: "keluar24",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "25",
                        columns: [{
                            field: "keluar25",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "26",
                        columns: [{
                            field: "keluar26",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "27",
                        columns: [{
                            field: "keluar27",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "28",
                        columns: [{
                            field: "keluar28",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "29",
                        columns: [{
                            field: "keluar29",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "30",
                        columns: [{
                            field: "keluar30",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        title: "31",
                        columns: [{
                            field: "keluar31",
                            title: "keluar",
                            width: "60px",
                        }],
                        width: "90px",
                    },
                    {
                        field: "jumlahkeluar",
                        title: "Jumlah",
                        width: "90px"
                    },
                    {
                        field: "total",
                        title: "Stok Akhir",
                        width: "90px"
                    },
                ],

            };

            // $("#kGrid").kendoGrid({
            //     toolbar: ["excel"],
            //         excel: {
            //             fileName: "SaldoPenerimaanDanPengeluaranBarang.xlsx",
            //             allPages: true,
            //         },

            //     dataSource: $scope.dataExcel,
            //     sortable: true,
            //     pageable: true,
            //     resizable: true,
            //     columns: [
            //         {
            //             field: "no",
            //             title: "No",
            //             width : "20px",
            //         },
            //         {
            //             field: "kodebmn",
            //             title: "Kode",
            //             width : "30px"
            //         },
            //         {
            //             field: "kodeproduk",
            //             title: "Kode Sirs",
            //             width : "50px"
            //         },
            //         {
            //             field: "namaproduk",
            //             title: "Nama Barang",
            //             width : "50px"
            //         },
            //         {
            //             field: "satuanstandar",
            //             title: "Satuan",
            //             width : "20px",
            //         },
            //         {
            //             field: "harga",
            //             title: "Harga Satuan",
            //             width : "40px",
            //             template: "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
            //         },
            //         {
            //             title: "Saldo Awal",
            //             columns : [
            //             {
            //                 field: "qtyawal",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlawal",
            //                 title: "Jumlah (Rp)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         },
            //         {
            //             title: "Penerimaan",
            //             columns : [
            //             {
            //                 field: "qtymasuk",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtymasuk #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlmasuk",
            //                 title: "Jumlah (RP)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlmasuk #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         },
            //         {
            //             title: "Pengeluaran",
            //             columns : [
            //             {
            //                 field: "qtykeluar",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtykeluar #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlkeluar",
            //                 title: "Jumlah (Rp)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlkeluar #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         },
            //         {
            //             title: "Saldo Akhir",
            //             columns : [
            //             {
            //                 field: "qtyakhir",
            //                 title: "Qty",
            //                 width : "30px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: qtyakhir #', '')}}</span>"
            //             },
            //             {
            //                 field: "ttlakhir",
            //                 title: "Jumlah (Rp)",
            //                 width : "60px",
            //                 template: "<span class='style-right'>{{formatRupiah('#: ttlakhir #', '')}}</span>"
            //             }],
            //             width : "90px",
            //         }
            //     ]

            // });

            // $scope.data2 = function(dataItem) {
            //     return {
            //         dataSource: new kendo.data.DataSource({
            //             data: dataItem.details
            //         }),
            //         columns: [
            //             {
            //                 "field": "namaproduk",
            //                 "title": "Nama Produk",
            //                 "width" : "100px",
            //             },
            //             {
            //                 "field": "satuanstandar",
            //                 "title": "Satuan",
            //                 "width" : "30px",
            //             },
            //             {
            //                 "field": "qtyproduk",
            //                 "title": "Qty",
            //                 "width" : "30px",
            //             }
            //         ]
            //     }
            // };  
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.columnGridNarkotika = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Laporan Narkotika " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                        moment($scope.item.tglAkhir).format('DD-MM-YYYY') + ".xlsx",
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:Z1"];
                    sheet.name = "KSM";

                    var myHeaders = [{
                        value: "Laporan Narkotika Tanggal " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                            moment($scope.item.tglAkhir).format('DD-MM-YYYY'),
                        fontSize: 20,
                        textAlign: "center",
                        background: "#c1d2d2",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "10px",
                    },

                    {
                        field: "tglresep",
                        title: "Tanggal Masuk Resep",
                        width: "45px"
                    },
                    {
                        field: "tglresep",
                        title: "Tanggal Serah Obat Resep",
                        width: "45px"
                    },
                    {
                        field: "namaruangan",
                        title: "Asal Resep",
                        width: "50px",
                    },

                    {
                        title: "Pasien",
                        columns: [{
                                field: "namapasien",
                                title: "Nama",
                                width: "80px",
                                // template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
                            },
                            {
                                field: "nocm",
                                title: "No RM",
                                width: "30px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            },
                            {
                                field: "alamatlengkap",
                                title: "Alamat",
                                width: "80px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            }
                        ],
                        width: "90px",
                    },
                    {
                        field: "namalengkap",
                        title: "Dokter",
                        width: "50px",
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Narkotika",
                        width: "50px",
                    },
                    {
                        field: "satuanstandar",
                        title: "Satuan",
                        width: "20px",
                    },
                    {
                        title: "Pemakaian",
                        columns: [{
                                field: "jumlah",
                                title: "R/",
                                width: "15px",
                                // template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
                            },
                            {
                                field: "",
                                title: "OK",
                                width: "15px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            },
                            {
                                field: "",
                                title: "Trolley Emergency",
                                width: "15px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            }
                        ],
                        width: "90px",
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: "20px",
                    },
                    {
                        field: "",
                        title: "Keterangan",
                        width: "10px",
                    },
                ],

            };
            $scope.columnGridPsikotropika = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Laporan Psikotopika " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                        moment($scope.item.tglAkhir).format('DD-MM-YYYY') + ".xlsx",
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:Z1"];
                    sheet.name = "KSM";

                    var myHeaders = [{
                        value: "Laporan Psikotropika Tanggal " + moment($scope.item.tglAwal).format('DD-MM-YYYY') + " sampai " +
                            moment($scope.item.tglAkhir).format('DD-MM-YYYY'),
                        fontSize: 20,
                        textAlign: "center",
                        background: "#c1d2d2",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "10px",
                    },

                    {
                        field: "tglresep",
                        title: "Tanggal Masuk Resep",
                        width: "45px"
                    },
                    {
                        field: "tglresep",
                        title: "Tanggal Serah Obat Resep",
                        width: "45px"
                    },
                    {
                        field: "namaruangan",
                        title: "Asal Resep",
                        width: "50px",
                    },

                    {
                        title: "Pasien",
                        columns: [{
                                field: "namapasien",
                                title: "Nama",
                                width: "80px",
                                // template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
                            },
                            {
                                field: "nocm",
                                title: "No RM",
                                width: "30px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            },
                            {
                                field: "alamatlengkap",
                                title: "Alamat",
                                width: "80px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            }
                        ],
                        width: "90px",
                    },
                    {
                        field: "namalengkap",
                        title: "Dokter",
                        width: "50px",
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Narkotika",
                        width: "50px",
                    },
                    {
                        field: "satuanstandar",
                        title: "Satuan",
                        width: "20px",
                    },
                    {
                        title: "Pemakaian",
                        columns: [{
                                field: "jumlah",
                                title: "R/",
                                width: "15px",
                                // template: "<span class='style-right'>{{formatRupiah('#: qtyawal #', '')}}</span>"
                            },
                            {
                                field: "",
                                title: "OK",
                                width: "15px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            },
                            {
                                field: "",
                                title: "Trolley Emergency",
                                width: "15px",
                                // template: "<span class='style-right'>{{formatRupiah('#: ttlawal #', '')}}</span>"
                            }
                        ],
                        width: "90px",
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: "20px",
                    },
                    {
                        field: "",
                        title: "Keterangan",
                        width: "10px",
                    },
                ],

            };
            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            $scope.CetakLap = function() {
                var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
                var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;

                var stt = 'false'
                if (confirm('View Laporan Stok Opname? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                // old
                // var client = new HttpClient();        
                // client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokopname=1&tglAwal='+tglawal+'&tglAkhir='+tglakhir+'&ruangan='+ruangan+'&view='+ stt+'&user='+ $scope.dataLogin.namaLengkap, function(response) {
                // });
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokopname2=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&ruangan=' + ruangan + '&view=' + stt + '&user=' + $scope.dataLogin.namaLengkap, function(response) {});
            };

            function initnarkotika() {

                $scope.isRouteLoading = true;

                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = +$scope.item.ruangan.id
                }

                var IdProduk = ""
                if ($scope.item.Produk != undefined) {
                    IdProduk = "&IdProduk=" + $scope.item.Produk.id
                }


                var ttlsaldoawal = 0
                var ttlpenerimaan = 0
                var ttlpengeluaran = 0
                var ttlsaldoakhir = 0

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var start = new Date(tglAwal);
                var end = new Date(tglAkhir);



                var status = "and isnarkotika=true"

                medifirstService.get("logistik/get-daftar-stock-getbarangharam?" +
                    "tglawal=" + tglAwal +
                    "&tglakhir=" + tglAkhir +
                    "&ruanganfk=" + rg +
                    "&status=" + status + IdProduk, true).then(function(dat) {
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].no = i + 1
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataGridNarkotika = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 20,
                        total: dat.data.data.length,
                        serverPaging: false,
                    });
                    $scope.dataExcel = dat.data.data;

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
                cacheHelper.set('SaldoBarangDetailCtrl', chacePeriode);


            }

            function initpiskotropika() {

                $scope.isRouteLoading = true;

                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = +$scope.item.ruangan.id
                }

                var IdProduk = ""
                if ($scope.item.Produk != undefined) {
                    IdProduk = "&IdProduk=" + $scope.item.Produk.id
                }


                var ttlsaldoawal = 0
                var ttlpenerimaan = 0
                var ttlpengeluaran = 0
                var ttlsaldoakhir = 0

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var start = new Date(tglAwal);
                var end = new Date(tglAkhir);



                var status = "and ispsikotropika=true"

                medifirstService.get("logistik/get-daftar-stock-getbarangharam?" +
                    "tglawal=" + tglAwal +
                    "&tglakhir=" + tglAkhir +
                    "&ruanganfk=" + rg +
                    "&status=" + status + IdProduk, true).then(function(dat) {
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].no = i + 1
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataGridPsikotropika = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 20,
                        total: dat.data.data.length,
                        serverPaging: false,
                    });
                    $scope.dataExcel = dat.data.data;

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
                cacheHelper.set('SaldoBarangDetailCtrl', chacePeriode);


            }


            //***********************************

        }
    ]);
});