define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarNonLayananAmbulanCtrl', ['CacheHelper', '$timeout', '$state', '$q', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $timeout, $state, $q, $scope, dateHelper, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataPasienSelected = {};
            $scope.showBayar = false;
            $scope.KelUserLoginKasir = undefined;
            function showButton() {
                // $scope.showBtnBayarTagihan = true;
                // $scope.showBtnPerbaharui = true;
                // $scope.showBtnDetail = true;
            }
            ComboLoad();
            FormLoad();

            function ComboLoad(){
                medifirstService.get("ambulance/get-data-for-combo", true).then(function (data) {                    
                    showButton();
                    $scope.item.periodeAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                    var dataCombo = data.data;
                    $scope.listKelompokTransaksi = dataCombo.kelompoktransaksi;
                    $scope.item.kelompokTransaksi = dataCombo.kelompoktransaksi[0];          
                    $scope.KelompokUser = medifirstService.getKelompokUser(); 
                    $scope.KelUserLoginKasir = dataCombo.keluserkasir;
                    $scope.listStatus = [
                        { id: 1, namaExternal: "Lunas" },
                        { id: 2, namaExternal: "Belum Bayar" }
                    ]
                                       
                    // $timeout($scope.SearchData, 500);                        
                    if ($scope.KelompokUser == $scope.KelUserLoginKasir) {
                            $scope.showBayar = true
                    }else{
                        $scope.showBayar = false                       
                    } 
                });
            }

            function FormLoad() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                // var Jra =""
                // if ($scope.item.jenisRacikan != undefined){
                //     var Jra ="&jenisobatfk=" +$scope.item.jenisRacikan.id
                // }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-daftar-jual-bebas?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nocm=" + $scope.item.noMr +
                    "&namapasien=" + $scope.item.namaPasien
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1                        
                        }
                        var data2 = dat.data.daftar;
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            pageSize: 10,
                            total: data2[0].length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
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
                cacheHelper.set('DaftarResepBebasCtrl', chacePeriode);
            }

            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnDaftarNonLayanan = [
                {
                    "field": "tglTransaksi",
                    "title": "Tanggal",
                    "width": "150px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglTransaksi #')}}</span>"
                },
                {
                    "field": "namaPelanggan",
                    "title": "Nama Pelanggan",
                    "width": "150px",
                    "template": "<span class='style-left'>#: namaPelanggan #</span>"
                },
                {
                    "field": "jenisTagihan",
                    "title": "Jenis Tagihan",
                    "width": "150px",
                    "template": "<span class='style-center'>#: jenisTagihan #</span>"
                },
                {
                    "field": "total",
                    "title": "Jumlah",
                    "width": "150px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "150px",
                    "template": "<span class='style-left'>#: keterangan #</span>"
                },
                {
                    "field": "statusBayar",
                    "title": "Status",
                    "width": "150px",
                    "template": "<span class='style-center'>#: statusBayar #</span>"
                }
            ];

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "namaproduk",
                            "title": "Layanan",
                            "width": "130px",
                        },
                        {
                            "field": "keteranganlainnya",
                            "title": "Keterangan",
                            "width": "50px"
                        },                        
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width": "30px",
                        },
                        {
                            "field": "hargasatuan",
                            "title": "Harga",
                            "width": "100px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp.')}}</span>"
                        },
                        {
                            "field": "jasaperawat",
                            "title": "Jasa Perawat",
                            "width": "100px",
                            "template": "<span class='style-right'>{{formatRupiah('#: jasaperawat #', 'Rp.')}}</span>"
                        },
                        {
                            "field": "jasadokter",
                            "title": "Jasa Dokter",
                            "width": "100px",
                            "template": "<span class='style-right'>{{formatRupiah('#: jasadokter #', 'Rp.')}}</span>"
                        },                        
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "100px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>"
                        }
                    ]
                }
            };

            $scope.Bayar = function () {                
                if ($scope.dataPasienSelected.statusBayar == "Lunas") {
                    toastr.error("Informasi, Tagihan Sudah Lunas !")
                    return;
                    // var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                    //     "Tagihan sudah Lunas", "Ok");

                    // $mdDialog.show(alertDialog).then(function () {

                    // });
                }
                else {                    
                    $scope.changePage2("PembayaranTagihanNonLayananKasir");
                }
            }

            $scope.changePage2 = function (stateName) {                
                if ($scope.dataPasienSelected.noRec != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noRec
                    }
                    var tempCache = $scope.dataPasienSelected.noRec + "#0#DaftarNonLayananKasir";
                    cacheHelper.set('PembayaranTagihanNonLayananKasir', tempCache);
                    $state.go(stateName, {
                        dataPasien: JSON.stringify(obj)
                    });
                }
                else {
                    toastr.error("Informasi, Silahkan pilih data terlebih dahulu !");
                    return;
                    // var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                    //     "Silahkan pilih data terlebih dahulu", "Ok");

                    // $mdDialog.show(alertDialog).then(function () {

                    // });
                }
            }

            $scope.changePage = function (stateName) {
                if ($scope.dataPasienSelected.noRec != undefined) {
                    $state.go(stateName, {
                        //ataPasien: JSON.stringify($scope.dataPasienSelected)
                    });
                } else {
                    toastr.error("Informasi, Silahkan pilih data terlebih dahulu !");
                    return;
                }
            }

            function checkValue(obj, param) {
                var res = "";
                var data = undefined;

                if (param.length > 1) {
                    if (obj[param[0]] != undefined)
                        data = obj[param[0]][param[1]];
                } else {
                    data = obj[param[0]];
                }

                if (data != undefined)
                    var res = data;

                return res;
            }

            function isInt(value) {
                var er = /^-?[0-9]+$/;

                return er.test(value);
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
                $scope.item.periodeAkhir = dateHelper.setJamAkhir(new Date());

                $scope.SearchData();
            }

            $scope.Detail = function () {
                var tempCache = $scope.dataPasienSelected.noRec + "#1#DaftarNonLayananKasir";
                cacheHelper.set('PembayaranTagihanNonLayananKasir', tempCache);
                $state.go('PembayaranTagihanNonLayananKasir')//, {
                //     dataPasien: JSON.stringify(obj)
                // });
            }

            $scope.InputTagihan = function () {
                $state.go('InputTagihanNonLayananAmbulan')
            }

            //fungsi search data
            $scope.SearchData = function () {
                //kriteria pencarian
                var namaPelanggan = checkValue($scope.item, ["namaPelanggan"]);
                var tanggalAwal = checkValue($scope.item, ["periodeAwal"]);
                var tanggalAkhir = checkValue($scope.item, ["periodeAkhir"]);
                var status = checkValue($scope.item, ["status", "namaExternal"]);
                var jenisTagihan = checkValue($scope.item, ["kelompokTransaksi", "id"]);

                tanggalAwal = moment(tanggalAwal).format('YYYY-MM-DD HH:mm');
                tanggalAkhir = moment(tanggalAkhir).format('YYYY-MM-DD HH:mm');

                var tempCache = tanggalAwal + "#" + tanggalAkhir;
                cacheHelper.set('DaftarNonLayananAmbulanCtrl', tempCache);
                init(namaPelanggan, status, tanggalAwal, tanggalAkhir, jenisTagihan);
                /*if (tanggalAwal != "") {
                    //tanggalAwal = moment(tanggalAwal).format('DD-MM-YYYY')
                    //tanggalAwal = new Date(new Date(tanggalAwal)).getTime();
                }

                if (tanggalAkhir != "") {
                    //tanggalAkhir = moment(tanggalAkhir).format('DD-MM-YYYY')
                    //tanggalAkhir = new Date(c(tanggalAkhir)).getTime();
                }

                var kriteriaFilter = [
                    { text: "namaPelanggan", operator: "contains", value: namaPelanggan },
                    { text: "status.namaExternal", operator: "eq", value: status },
                    { text: "tglTransaksi", operator: "gte", value: tanggalAwal },
                    { text: "tglTransaksi", operator: "lte", value: tanggalAkhir }
                    ];*/

                //prosesSearch(kriteriaFilter);
            }

            /*function prosesSearch(kriteriaFilter) {
                var arrFilter = [];
                for (var i = 0; i < kriteriaFilter.length; i++) {
                    if (kriteriaFilter[i].value != "") {
                        var obj = {
                            field: kriteriaFilter[i].text,
                            operator: kriteriaFilter[i].operator,
                            value: kriteriaFilter[i].value
                        };

                        arrFilter.push(obj);
                    }
                }

                var grid = $("#kGrid").data("kendoGrid");
                grid.dataSource.query({
                    page: 1,
                    pageSize: 10,
                    filter: {
                        logic: "and",
                        filters: arrFilter
                    }
                });
            }*/

            var init = function (a, b, c, d, e) {
                $scope.isRouteLoading = true;
                medifirstService.get("ambulance/daftar-tagihan-non-layanan?namaPelanggan=" + a + "&status=" + b + "&tglAwal=" + c + "&tglAkhir=" + d + "&jenisTagihanId=" + e).then(function (data) {                 
                    var dataFilter = []
                    var data = data.data.daftar;
                    // for (var x=0;x < data.length;x++){
                    //      if (data[x].jenisTagihanId != 62){
                    //         dataFilter.push(data[x])
                    //     }                          
                    // }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].jenisTagihanId != 70) {
                            if (data[i].jenisTagihanId != 71) {
                                if (data[i].jenisTagihanId != 62) {
                                    dataFilter.push(data[i])
                                }

                            }
                        }
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataDaftarNonLayanan = new kendo.data.DataSource({
                        data: dataFilter,//data,
                        pageSize: 10,
                        //total: dat.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    tglTransaksi: { type: "date" }
                                }
                            }
                        }
                    });
                });
                return $scope.dataDaftarNonLayanan;
            }

            $scope.klikGrid = function(dataPasienSelected){
                if (dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih")
                    return
                }
                $scope.dataPasienSelected = dataPasienSelected;

            }

            $scope.Hapus = function(){
                if ($scope.dataPasienSelected.statusBayar == "Lunas") {
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Dihapus !")
                    return;                   
                }

                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih")
                    return
                }

                var objSave = {
                    norec: $scope.dataPasienSelected.noRec,
                    nostruk: $scope.dataPasienSelected.nostruk,
                }

                medifirstService.post('kasir/hapus-transaksi-non-layanan',objSave).then(function (data) {
					init();
				})
                FormLoad();
            }

            $scope.EditTagihan = function(){
                if ($scope.dataPasienSelected.statusBayar == "Lunas") {
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Dirubah !")
                    return;                   
                }

                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih")
                    return
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.noRec,
                    1: 'EditTagihan',
                    2: $scope.dataPasienSelected.nostruk,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('InputTagihanNonLayananAmbulanCtrl', chacePeriode);
                $state.go('InputTagihanNonLayananAmbulan')               
            }            

        // BATAS //
        }
    ]);
});