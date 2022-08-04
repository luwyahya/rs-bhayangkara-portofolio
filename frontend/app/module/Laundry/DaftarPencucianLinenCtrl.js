define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPencucianLinenCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var datas = [];
            var data3 = [];
            var etos = [];
            var dataCheck = [];
            $scope.dataAh = [];
            var norecKirim = '';
            var noKirim = '';
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPencucianLinenCtrl');
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
                    $scope.listNamaBarang = dat.data.produk
                });
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
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
                medifirstService.get("laundry/get-daftar-cuci-laundry?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nokirim=" + $scope.item.struk + rg + produkfk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data.daftar
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
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
                cacheHelper.set('DaftarPencucianLinenCtrl', chacePeriode);
                var jenispermintaanfk = '';
                var objSave = {
                    jenispermintaanfk: jenispermintaanfk,
                    tglAwal: tglAwal,
                    tglAkhir: tglAkhir
                }


            }

            $scope.klikGrid = function (data) {
                if (data != undefined) {
                    etos = data.details;
                }

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

            $scope.NewKirim = function () {
                $state.go('PenerimaanLaundry')
            }

            $scope.EditKirim = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Pilih yg akan di ubah!!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: '',
                    2: 'EditKirim',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PenerimaanLaundryCtrl', chacePeriode);
                $state.go('PenerimaanLaundry')
            }

            function GetprodukBatal() {
                var noorderfk = '';
                if ($scope.dataSelected.noorderfk != undefined) {
                    noorderfk = $scope.dataSelected.noorderfk;
                }

                var noorderfk = '';
                if ($scope.dataSelected.noorderfk != undefined) {
                    noorderfk = $scope.dataSelected.noorderfk;
                }
                medifirstService.get("laundry/get-daftar-barang-batal-laundry?nokirimfk=" + $scope.dataSelected.norec
                    + "&ruanganfk=" + $scope.dataSelected.rutujuanid
                    , true).then(function (dat) {

                        datas = dat.data;
                        var jumlah = 0;
                        for (var i = 0; i < datas.length; i++) {
                            for (var j = 0; j < etos.length; j++) {
                                if (etos[j].objectprodukfk == datas[i].kdeproduk) {
                                    if (etos[j].qtyproduk <= datas[i].qtyproduk) {
                                        jumlah = i + 1;
                                    }
                                }
                            }
                        }
                        if (etos.length <= jumlah) {

                            var strukkirim = {

                                nokrim: $scope.dataSelected.nostruk,
                                noreckirim: $scope.dataSelected.norec,
                                tglpelayanan: $scope.dataSelected.tglstruk,
                                ruanganasal: $scope.dataSelected.namaruanganasal,
                                objectruanganasal: $scope.dataSelected.ruasalid,
                                ruangantujuan: $scope.dataSelected.namaruangantujuan,
                                obejectruangantujuan: $scope.dataSelected.rutujuanid,
                                noorderfk: noorderfk,
                                jenispermintaanfk: $scope.dataSelected.jenispermintaanfk,
                                keterangan: $scope.item.alasanBatal

                            }
                            var objSave = {
                                strukkirim: strukkirim,
                                detail: etos
                            }

                            medifirstService.post('laundry/batal-kirim-terima-laundry', objSave).then(function (e) {
                                // medifirstService.post('sysadmin/general/hapus-jurnal-amprahan-barang', objSave).then(function (e) {
                                    init();
                                // }, function (error) {
                                    // init();
                                // });
                            });

                            $scope.item.alasanBatal = "";
                            $scope.winDialog.close();

                        } else {
                            toastr.error("Stok Telah Terpakai, Tidak Bisa Dibatalkan!!!")
                            $scope.winDialog.close();
                            return;
                        }

                    });

            }

            $scope.lanjutBatal = function () {
                if ($scope.item.alasanBatal == undefined) {
                    toastr.error("Alasan Batal Belum Diisi!!")
                    return;
                }
                GetprodukBatal()
            }


            $scope.lanjutBatal1 = function () {
                if ($scope.item.alasanBatal1 == undefined) {
                    toastr.error("Alasan Batal Belum Diisi!!")
                    $scope.item.alasanBatal = "";
                    return;
                }

                GetprodukBatal1()
            }

            function GetprodukBatal1() {
                var noorderfk = '';
                if ($scope.dataGrid._data[0].noorderfk != undefined) {
                    noorderfk = $scope.dataGrid._data[0].noorderfk;
                }
                var dataIn = '';
                var dataOn = '';
                var norec = '';
                for (var i = 0; i < $scope.dataGrid._data[0].details.length; i++) {
                    if ($scope.dataGrid._data[0].details[i].statCheckbox == true) {
                        if (dataOn == '') {
                            dataOn = $scope.dataGrid._data[0].details[i].objectprodukfk;
                            dataIn = dataOn;
                        } else {
                            dataIn = $scope.dataGrid._data[0].details[i].objectprodukfk;
                            dataOn = dataOn + ',' + dataIn
                        }
                    }
                }

                if ($scope.dataGrid._data[0].jeniskirim == 'Amprahan') {
                    var strukkirim = {

                        nokrim: $scope.dataGrid._data[0].nostruk,
                        noreckirim: $scope.dataGrid._data[0].norec,
                        tglpelayanan: $scope.dataGrid._data[0].tglstruk,
                        ruanganasal: $scope.dataGrid._data[0].namaruanganasal,
                        objectruanganasal: $scope.dataGrid._data[0].ruasalid,
                        ruangantujuan: $scope.dataGrid._data[0].namaruangantujuan,
                        obejectruangantujuan: $scope.dataGrid._data[0].rutujuanid,
                        noorderfk: noorderfk,
                        jenispermintaanfk: $scope.dataGrid._data[0].jenispermintaanfk,
                        keterangan: $scope.item.alasanBatal1,
                        dataproduk: dataOn,
                    }
                    data3 = [];
                    for (var i = 0; i < $scope.dataGrid._data[0].details.length; i++) {
                        if ($scope.dataGrid._data[0].details[i].statCheckbox == true) {
                            data3.push({
                                "objectprodukfk": $scope.dataGrid._data[0].details[i].objectprodukfk,
                                "namaproduk": $scope.dataGrid._data[0].details[i].namaproduk,
                                "satuanstandar": $scope.dataGrid._data[0].details[i].satuanstandar,
                                "qtyproduk": $scope.dataGrid._data[0].details[i].qtyproduk,
                            })
                        }
                    }

                    var objSave = {
                        strukkirim: strukkirim,
                        detail: data3
                    }

                    medifirstService.post('logistik/batal-kirim-terima-barang-peritem', objSave).then(function (e) {
                        // medifirstService.post('sysadmin/general/update-jurnal-batalkirim-peritem',objSave).then(function (e) {
                        //     init();
                        // }, function (error) {
                        //     init();
                        // });
                        init();
                    });

                    $scope.item.alasanBatal1 = "";
                    $scope.winDialogBatalPerItem.close();

                } else {
                    medifirstService.get("logistik/get-daftar-barang-batal?nokirimfk=" + $scope.dataGrid._data[0].norec
                        + "&ruanganfk=" + $scope.dataGrid._data[0].rutujuanid
                        + "&objectprodukfk=" + dataOn
                        , true).then(function (dat) {

                            datas = dat.data;
                            var datBatal = [];
                            datBatal = $scope.dataGrid._data[0].details;
                            var jumlah = 0;
                            var Cek = 0
                            var ceklis = 0
                            for (var i = 0; i < datas.length; i++) {
                                for (var j = 0; j < datBatal.length; j++) {
                                    if (datBatal[j].statCheckbox === true) {
                                        ceklis = j + 1
                                        if (datBatal[j].objectprodukfk == datas[i].kdeproduk) {
                                            if (datBatal[j].qtyproduk <= datas[i].qtyproduk || datBatal[j].qtyproduk == 0) {
                                                jumlah = i + 1;
                                                Cek = j + 1;
                                            }
                                        }
                                    }
                                }
                            }
                            if (ceklis = jumlah) {
                                data3 = [];
                                for (var i = 0; i < $scope.dataGrid._data[0].details.length; i++) {
                                    if ($scope.dataGrid._data[0].details[i].statCheckbox == true) {
                                        data3.push({
                                            "objectprodukfk": $scope.dataGrid._data[0].details[i].objectprodukfk,
                                            "namaproduk": $scope.dataGrid._data[0].details[i].namaproduk,
                                            "satuanstandar": $scope.dataGrid._data[0].details[i].satuanstandar,
                                            "qtyproduk": $scope.dataGrid._data[0].details[i].qtyproduk,
                                        })
                                    }
                                }

                                var strukkirim = {

                                    nokrim: $scope.dataGrid._data[0].nostruk,
                                    noreckirim: $scope.dataGrid._data[0].norec,
                                    tglpelayanan: $scope.dataGrid._data[0].tglstruk,
                                    ruanganasal: $scope.dataGrid._data[0].namaruanganasal,
                                    objectruanganasal: $scope.dataGrid._data[0].ruasalid,
                                    ruangantujuan: $scope.dataGrid._data[0].namaruangantujuan,
                                    obejectruangantujuan: $scope.dataGrid._data[0].rutujuanid,
                                    noorderfk: noorderfk,
                                    jenispermintaanfk: $scope.dataGrid._data[0].jenispermintaanfk,
                                    keterangan: $scope.item.alasanBatal1,
                                    dataproduk: dataOn,
                                }

                                var objSave = {
                                    strukkirim: strukkirim,
                                    // norec:e.data.nokirim.norec,
                                    detail: data3
                                }

                                medifirstService.post('logistik/batal-kirim-terima-barang-peritem', objSave).then(function (e) {
                                    // medifirstService.post('sysadmin/general/update-jurnal-batalkirim-peritem',objSave).then(function (e) {
                                    //     init();
                                    // }, function (error) {
                                    //     init();
                                    // });
                                    init();
                                });

                                $scope.item.alasanBatal1 = "";
                                $scope.winDialogBatalPerItem.close();

                            } else {
                                toastr.error("Stok Telah Terpakai, Tidak Bisa Dibatalkan!!!")
                                $scope.winDialogBatalPerItem.close();
                                $scope.item.alasanBatal1 = "";
                                return;
                            }
                        });

                }
            }

            $scope.BatalKirim = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Pilih yg akan di hapus!!")
                    return;
                }
                $scope.winDialog.center().open();
            }

            $scope.BatalPeritem = function () {
                if ($scope.dataGrid == undefined) {
                    toastr.error("Pilih yg akan di hapus!!")
                    return;
                }
                $scope.winDialogBatalPerItem.center().open();
            }

            $scope.batalBatal = function () {
                $scope.item.alasanBatal = "";
                $scope.winDialog.close();
            }

            $scope.batalBatal1 = function () {
                $scope.item.alasanBatal1 = "";
                $scope.winDialogBatalPerItem.close();
            }

            $scope.Cetak = function () {
                $scope.popUp.center().open();
            }

            $scope.CetakAh = function () {
                var jabatan1 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan1 = $scope.item.DataJabatan.namajabatan;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan1 != undefined) {
                    jabatan2 = $scope.item.DataJabatan1.namajabatan;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan3 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai = ''
                if ($scope.item.DataPegawai != undefined) {
                    pegawai = $scope.item.DataPegawai.id;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai1 != undefined) {
                    pegawai1 = $scope.item.DataPegawai1.id;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai2 = $scope.item.DataPegawai2.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Kirim? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-pengeluaran=1&nores=' + $scope.dataSelected.norec + '&pegawaiPenyerah=' + pegawai + '&pegawaiPenerima=' + pegawai1 + '&pegawaiMegetahui=' + pegawai2
                    + '&JabatanPenyerah=' + jabatan1 + '&JabatanPenerima=' + jabatan2 + '&jabatanMengetahui=' + jabatan3 + '&view=' + stt + '&user=' + pegawaiUser[0].namalengkap, function (response) {
                        //aadc=response; 

                    });
                $scope.popUp.close();
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
                    "field": "status",
                    "title": "Status",
                    "width": "60px"
                },
                {
                    "field": "tglcuci",
                    "title": "Tgl Cuci",
                    "width": "50px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglcuci #', '')}}</span>"
                },
                {
                    "field": "tglstruk",
                    "title": "Tgl Struk",
                    "width": "50px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "NoTerima",
                    "width": "80px",
                },

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
                    "width": "100px",
                },
                {
                    "field": "petugas",
                    "title": "Petugas",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                }
            ];

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataGrid._data[0].details, function (data) {
                    return data.no == dataItem.no;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;
                var tempData = $scope.dataGrid._data[0].details;
                reloadDataGrid(tempData);

            }

            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGrid._data[0].details;
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
                reloadDataGrid(tempData);
            }

            $scope.cekData = function () {
                var tempData = $scope.dataGrid._data[0].details;

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
                reloadDataGrid(tempData);
            }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    _data: ds,
                    // pageSize: 50,
                    // total:  ds.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    }
                });


                var grid = $('#kGridDetail').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].statCheckbox = false;
                    dataItem.details[i].no = i + 1
                }
                dataCheck = dataItem.details;
                $scope.dataAh = dataItem.details;
                $scope.dataGrid1 = dataItem.details;
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                            "template": "# if (statCheckbox) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                                "# } #",
                            "width": "20px"
                        },
                        {
                            "field": "no",
                            "title": "No",
                            "width": "45px",
                        },
                        {
                            "field": "kdproduk",
                            "title": "Kd Produk",
                            "width": "100px",
                        },
                        {
                            "field": "kdsirs",
                            "title": "Kd Sirs",
                            "width": "100px",
                        },
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
                        },
                        // {
                        //     "field": "qtyprodukretur",
                        //     "title": "Qty Retur",
                        //     "width": "30px",
                        // }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
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
            $scope.kirimKeRuangan = function(){

            }
            //***********************************
        }
    ]);
});
