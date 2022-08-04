define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarNonLayananKasirCtrl', ['CacheHelper', '$timeout', '$state', '$q', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $timeout, $state, $q, $scope, dateHelper, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataPasienSelected = {};
            $scope.showBayar = false;
            function showButton() {
                // $scope.showBtnBayarTagihan = true;
                // $scope.showBtnPerbaharui = true;
                // $scope.showBtnDetail = true;
            }
            FormLoad();

            function FormLoad() {
                showButton();
                $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
                $scope.item.periodeAkhir = dateHelper.setJamAkhir(new Date());
                $q.all([
                    medifirstService.get("kasir/daftar-tagihan-non-layanan?namaPelanggan=" + $scope.item.namaPelanggan + "&status=" + $scope.item.status + "&tglAwal=" + moment($scope.item.periodeAwal).format('YYYY-MM-DD') + "&tglAkhir=" + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')),
                    medifirstService.get("kasir/get-data-combo-kasir")]).then(function (data) {  

                        $scope.listKelompokTransaksi = data[1].data.kelfix
                        $scope.KelompokUserDiklit = data[1].data.diklit;
                        $scope.KelompokUser = medifirstService.getKelompokUser();               
                        if (data[0].statResponse) {
                            var dataFilter = []                            
                            for (var i = 0; i < data[0].data.length; i++) {
                                if (data[0][i].data.jenisTagihanId != 70) {
                                    if (data[0][i].data.jenisTagihanId != 71) {
                                        if (data[0][i].data.jenisTagihanId != 62) {
                                            dataFilter.push(data[0].data[i])
                                        }
                                    }
                                }
                            }
                            $scope.dataDaftarNonLayanan = new kendo.data.DataSource({
                                data: dataFilter,
                                pageSize: 10,
                                total: dataFilter.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                            tglTransaksi: { type: "date" }
                                        }
                                    }
                                }
                            });
                            // $scope.listKelompokTransaksi = data[1];
                            // $scope.listKelompokTransaksi = data[1].kelompoktransaksi;
                        }

                        $scope.listStatus = [
                            { id: 1, namaExternal: "Lunas" },
                            { id: 2, namaExternal: "Belum Bayar" }
                        ]
                        var data = cacheHelper.get('DaftarNonLayananKasirCtrl');
                        if (data !== undefined) {
                            var splitResultData = data.split("#");
                            $scope.item.periodeAwal = dateHelper.setJamAwal(new Date(splitResultData[0]));
                            $scope.item.periodeAkhir = dateHelper.setJamAkhir(new Date(splitResultData[1]));
                        }
                        $timeout($scope.SearchData, 500);                        
                        if ($scope.KelompokUser != $scope.KelompokUserDiklit) {
                               $scope.showBayar = true
                        }else{
                            $scope.showBayar = false                       
                        }
                    });

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            function formatRupiah(value, currency) {
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
                    "title": "Kelompok Transaksi",
                    "width": "150px",
                    "template": "<span class='style-center'>#: jenisTagihan #</span>"
                },
                {
                    "field": "total",
                    "title": "Jumlah",
                    "width": "150px"//,
                    //"template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>"
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

            $scope.Bayar = function () {                
                if ($scope.dataPasienSelected.statusBayar == "Lunas") {

                    var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        "Tagihan sudah Lunas", "Ok");

                    $mdDialog.show(alertDialog).then(function () {

                    });
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
                    var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        "Silahkan pilih data terlebih dahulu", "Ok");

                    $mdDialog.show(alertDialog).then(function () {

                    });
                }
            }

            $scope.changePage = function (stateName) {
                if ($scope.dataPasienSelected.noRec != undefined) {
                    $state.go(stateName, {
                        //ataPasien: JSON.stringify($scope.dataPasienSelected)
                    });
                } else {
                    alert("Silahkan pilih data pasien terlebih dahulu");
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
                $state.go('InputTagihanNonLayanan')
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
                cacheHelper.set('DaftarNonLayananKasirCtrl', tempCache);
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
                medifirstService.get("kasir/daftar-tagihan-non-layanan?namaPelanggan=" + a + "&status=" + b + "&tglAwal=" + c + "&tglAkhir=" + d + "&jenisTagihanId=" + e).then(function (data) {                 
                    var dataFilter = []
                    var data = data.data;
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
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih")
                    return
                }

                if ($scope.dataPasienSelected.statusBayar == "Lunas") {
                    toastr.error('Status sudah lunas, tidak bisa diedit')
                }else{
                    var chacePeriode = {
                        0: $scope.dataPasienSelected.noRec,
                        1: 'EditTagihan',
                        2: $scope.dataPasienSelected.nostruk,
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('InputTagihanNonLayananCtrl', chacePeriode);
                    $state.go('InputTagihanNonLayanan')   
                }
            
            }

            $scope.EditKelompokTransaksi = function(){
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih")
                    return
                }


                $scope.popupEditKelompokTransaksi.center().open();
                $scope.item.noRec =  $scope.dataPasienSelected.noRec
                $scope.item.nostruk =  $scope.dataPasienSelected.nostruk


                medifirstService.get("kasir/get-data-combo-kasir").then(function (data) {  
                    $scope.listKelompokTransaksi = data[1].data.kelfix
                });
            }            

            
            $scope.batalKelompokTransaksi = function () {            
                $scope.popupEditKelompokTransaksi.close();   
            }
            $scope.saveKelompokTransaksi = function () {        
                var objSave = 
                    {
                        norec : $scope.dataPasienSelected.noRec,
                        nostruk : $scope.dataPasienSelected.nostruk,
                        idKelompokTransaksi : $scope.item.kelompokTransaksiEdit.id
                    }
                medifirstService.post('kasir/save-kelompok-transaksi-kasir',objSave).then(function(e) {
                    $scope.popupEditKelompokTransaksi.close();
                    FormLoad()
                })    
                   
            }
        // BATAS //
        }
    ]);
});