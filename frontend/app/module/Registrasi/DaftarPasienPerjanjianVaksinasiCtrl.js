define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienPerjanjianVaksinasiCtrl', ['CacheHelper', '$rootScope', '$scope', '$state', 'MedifirstService', '$mdDialog',
        function (cacheHelper, $rootScope, $scope, $state, medifirstService, $mdDialog) {
            //function (saveToWindow, $rootScope, $scope, ModelItem, $state, dateHelper, socket, $mdDialog, window, cetakHelper, medifirstService, cacheHelper, $q) {
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = false;
            $rootScope.isOpen = true;
            $scope.item = {};
            $scope.item.isTelemedicine = false;
            var dateNow = new Date();
            dateNow.setDate(dateNow.getDate() + 1);
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.now = new Date();
            $scope.from = $scope.now;
            $scope.until = $scope.now;

            LoadCombo();
            LoadData();



            $scope.listStatus = [
                { id: 1, nama: 'Confirm' },//#
                { id: 2, nama: 'Reservasi' },
            ]



            $scope.kodeReservasi = '';
            $scope.Column = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarReservasiOnlineVaksinasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:N1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "Daftar Reservasi Online Vaksinasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns:
                    [{
						"title": " ",
						"width": "130px",
						"template": "<button class=\"k-button custom-button\" ng-click=\"statuspulang(dataItem)\" style=\"margin:0 0 5px\">#: statuspulang #</button>",
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
					},{
                        field: "noantrian",
                        title: "No",
                        width: 50,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    },{
                        field: "noregistrasi",
                        title: "Kode Reservasi",
                        width: 100,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "nik",
                        title: "NIK",
                        width: 150,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "tglvaksin",
                        title: "Tanggal Reservasi Vaksin",

                        template: "<span class='style-left'>{{formatTanggal('#: tglvaksin #')}}</span>",
                        width: 120,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: 200,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "noantrian",
                        title: "No.Antrian",
                        width: 100,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "tgllahir",
                        title: "Tanggal Lahir",

                        template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>",
                        width: 120,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "nohp",
                        title: "No.Hp",
                        width: 100,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "vaksinke",
                        title: "Status",
                        width: 100,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    }, {
                        field: "namavaksin",
                        title: "Nama Vaksin",
                        width: 100,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    },
                    {
                        field: "jeniskelamin",
                        title: "Jenis Kelamin",
                        width: 200,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    },
                    {
                        field: "alamat",
                        title: "Alamat",
                        width: 200,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    },
                    {
                        field: "kodefaskes",
                        title: "Kode Faskes",
                        width: 200,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    },
                    {
                        field: "namafaskes",
                        title: "Nama Faskes",
                        width: 200,
                        attributes: {
							class: "#=statuspulang == 'Sudah Vaksin' ? 'ijo' : 'green' # || #=statuspulang == 'Batal Vaksin' ? 'red' : 'green' #"
						},
                    },
                    
                    ]
            };
            $scope.formatTanggal = function (tanggal) {
                if (tanggal != 'null')
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                else
                    return '-';
            }
            $scope.Page = {
                refresh: true//,
                //pageSizes: true//,
                //buttonCount: 5
            }
            function LoadCombo() {
                medifirstService.get("registrasi/get-combo-perjanjian").then(function (e) {
                    $scope.listRuangan = e.data.ruanganrajal
                    $scope.ListStatusPulang = e.data.statuspulang
                    $scope.ListStatusPulang2 = e.data.statuspulang2
                })
            }
            $scope.findData = function () {
                $scope.item.isTelemedicine = false
                LoadData()

            }

            $scope.cekTelemedicine = function (bool) {
                if (bool) {
                    $scope.item.isTelemedicine = true
                    LoadData()
                } else {
                    $scope.item.isTelemedicine = false
                    LoadData()
                }
            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.until).format('YYYY-MM-DD');
                if ($scope.tglinput == undefined || $scope.tglinput == null) {
                    var tglInput = undefined;
                } else {
                    var tglInput = moment($scope.tglinput).format('YYYY-MM-DD');
                }
                var statuspulang = ""
                if ($scope.item.statuspulang2 == undefined) {
                    var statuspulang = ""
                } else if ($scope.item.statuspulang2.id == 24) {
                    var statuspulang = "BelumVaksin"
                } else if ($scope.item.statuspulang2.id == 23) {
                    var statuspulang = "SudahVaksin"
                } else if ($scope.item.statuspulang2.id == 22) {
                    var statuspulang = "BatalVaksin"
                }

               
                // var namapasienpm = ''
                // var namapasienapr = ''
                // if ($scope.namaPasien != undefined) {
                //     namapasienpm = $scope.namaPasien;
                //     namapasienapr = $scope.namaPasien;
                // }


                medifirstService.get("registrasi/get-data-pasien-reservasi-vaksinasi?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kdReservasi=" + $scope.kodeReservasi
                    + "&nik=" + $scope.nik + "&statuspulang=" + statuspulang
                ).then(function (data) {
                    $scope.isRouteLoading = false;

                    $scope.listPasien = new kendo.data.DataSource({
                        data: data.data.data,
                        group: $scope.group,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    $scope.dataExcel = data.data;
                })
            }
            $scope.simpanVaksin = function (){
                var pertama=true
                var kedua=true
                if($scope.pertama==undefined || $scope.pertama==false){
                    pertama=false
                }
                if($scope.kedua==undefined || $scope.kedua==false){
                    kedua=false
                }
                medifirstService.post("reservasionline/simpan-vaksin-test", { "noregistrasi": $scope.item.noregistrasi, "pertama": pertama, "kedua": kedua })
                    .then(function (data) {
                        LoadData();
                    })
            }
            $scope.detail = function (){
                if($scope.item.jawab1==1){
                    $scope.item.jawaban1='Ya'
                }else{
                    $scope.item.jawaban1='Tidak'
                }
                if($scope.item.jawab2==1){
                    $scope.item.jawaban2='Ya'
                }else{
                    $scope.item.jawaban2='Tidak'
                }
                if($scope.item.jawab3==1){
                    $scope.item.jawaban3='Ya'
                }else{
                    $scope.item.jawaban3='Tidak'
                }
                if($scope.item.jawab4==1){
                    $scope.item.jawaban4='Ya'
                }else{
                    $scope.item.jawaban4='Tidak'
                }
                if($scope.item.jawab5==1){
                    $scope.item.jawaban5='Ya'
                }else{
                    $scope.item.jawaban5='Tidak'
                }
                if($scope.item.jawab6==1){
                    $scope.item.jawaban6='Ya'
                }else{
                    $scope.item.jawaban6='Tidak'
                }
                if($scope.item.jawab7==1){
                    $scope.item.jawaban7='Ya'
                }else{
                    $scope.item.jawaban7='Tidak'
                }
                if($scope.item.jawab8==1){
                    $scope.item.jawaban8='Ya'
                }else{
                    $scope.item.jawaban8='Tidak'
                }
                if($scope.item.jawab9==1){
                    $scope.item.jawaban9='Ya'
                }else{
                    $scope.item.jawaban9='Tidak'
                }
                if($scope.item.jawab10==1){
                    $scope.item.jawaban10='Ya'
                }else{
                    $scope.item.jawaban10='Tidak'
                }
                if($scope.item.jawab11==1){
                    $scope.item.jawaban11='Ya'
                }else{
                    $scope.item.jawaban11='Tidak'
                }
                if($scope.item.jawab12==1){
                    $scope.item.jawaban12='Ya'
                }else{
                    $scope.item.jawaban12='Tidak'
                }
                if($scope.item.jawab13==1){
                    $scope.item.jawaban13='Ya'
                }else{
                    $scope.item.jawaban13='Tidak'
                }
                if($scope.item.jawab14==1){
                    $scope.item.jawaban14='Ya'
                }else{
                    $scope.item.jawaban14='Tidak'
                }
                if($scope.item.jawab15==1){
                    $scope.item.jawaban15='Ya'
                }else{
                    $scope.item.jawaban15='Tidak'
                }
                if($scope.item.jawab16==1){
                    $scope.item.jawaban16='Ya'
                }else{
                    $scope.item.jawaban16='Tidak'
                }
                $scope.popupDetail.center().open()
            }

            $scope.reconfirm = function () {
                // window.isPerjanjian = $scope.item.noreservasi;
                // findPasien.CheckNoReconfirm($scope.item.noreservasi).then(function(e) {
                if ($scope.item.nocm == undefined || $scope.item.nocm == null) {

                    //  var data={
                    //          "noreservasi":  $scope.item.noreservasi,                                 
                    // }

                    // manageAkuntansi.postupdatestatusconfirm(data).then(function(e) {
                    //        LoadData();
                    var cahce = {
                        0: $scope.item,
                        1: 'Online',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    };
                    cacheHelper.set('CacheRegisOnline', cahce);
                    // var isMenuDinamis = JSON.parse(localStorage.getItem('isMenuDinamis'))
                    // if(isMenuDinamis && isMenuDinamis == true){
                    $state.go('RegistrasiPasienBaru', {
                        noRec: $scope.item.norec
                    });


                }
                else {
                    cacheHelper.set('cacheStatusPasien', 'LAMA');

                    var param = $scope.item.norec + "*" + $scope.item.nocm;

                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cahce = {
                        0: $scope.item,
                        1: 'Online',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    };
                    cacheHelper.set('CacheRegisOnline', cahce);
                    $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                        noCm: $scope.item.nocm
                    });
                    // })
                }
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

            $scope.CetakLaporan = function () {
                var tglAwal = moment($scope.from).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.until).format('YYYY-MM-DD 23:59');

                var status = "";
                if ($scope.status != undefined) {
                    status = $scope.status.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Reservasi Online? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-LaporanReservasiOnline=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&statusId=' + status + '&namaKasir=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }
            $scope.hapusReservasi = function () {
                if ($scope.item == undefined) {
                    toastr.error('silahkan pilih data ...')
                    return
                }
                if ($scope.item.status == 'Confirm') {
                    toastr.error('Pasien sudah di confirm, jadi tidak bisa di Tolak ...')
                    return
                }
                $scope.item.keteranganTolak = ""
                $scope.popupTolakPasien.center().open();
            }
           

            $scope.simpanTolakVaksin = function () {
                $scope.popupDetail.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah anda yakin akan menolak Reservasi Vaksin Pasien ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.confirmDeleteVaksin();
                })
            }

            $scope.confirmDeleteVaksin = function () {
                medifirstService.post("reservasionline/delete-vaksin", { "noregistrasi": $scope.item.noregistrasi, "keterangan": $scope.item.keteranganTolak })
                    .then(function (data) {
                        LoadData();
                    })
            }
            $scope.statuspulang = function (dataItem) {
                debugger;
                $scope.dataPasien = dataItem
                $scope.popupPulang.center().open();
            }
            $scope.simpanPulang = function () {
                if ($scope.item.statuspulang.id == 22) {
                    $scope.popupPulang.close();
                    $scope.item.noregistrasi = $scope.dataPasien.noregistrasi
                    $scope.simpanTolakVaksin();
                } else {
                 $scope.popupPulang.close();
                    var objSave = {
                        statuspulang : $scope.item.statuspulang.id,
                        noregistrasi : $scope.dataPasien.noregistrasi
                    }
                    medifirstService.post("reservasionline/sudah-vaksin", objSave).then(function (dat) {
                        LoadData();
                    })
                }
            }

        }
    ]);
});