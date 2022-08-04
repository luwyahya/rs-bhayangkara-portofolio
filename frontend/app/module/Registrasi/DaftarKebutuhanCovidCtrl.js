define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarKebutuhanCovidCtrl', ['$q', '$scope', 'ModelItem', 'MedifirstService',
        function ($q, $scope, ModelItem, medifirstService) {
            $scope.title = "Daftar Bayi Baru Lahir";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pasien = {}
            $scope.model = {};
            $scope.isPushOnClick = true;
            $scope.item = {
                from: new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00')),
                until: new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59')),
                from2: new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00')),
                until2: new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59')),
                from3: new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00')),
                until3: new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59')),
                rows: 100
            }
            $scope.tglregistrasi = true
            $scope.tglkembali = false
            $scope.setSourceRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }
            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    $scope.tglregistrasi = false
                    $scope.tglkembali = true
                    $scope.item.tglkembaliawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'))
                    $scope.item.tglkembaliakhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                } else {
                    $scope.tglregistrasi = true
                    $scope.tglkembali = false
                    $scope.item.from = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'))
                    $scope.item.until = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                }
            }
            $scope.tambah = function (){
                $scope.dialogPopup.center().open();
            }
            $scope.batal = function (){
                $scope.dialogPopup.close();
            }
            $scope.tambah2 = function (){
                $scope.dialogPopup2.center().open();
            }
            $scope.batalAlkes = function (){
                $scope.dialogPopup2.close();
            }
            $scope.save = function (){
                $scope.isRouteLoading = true;
                var json = {
                    'id_kebutuhan': $scope.item.SDM.id_kebutuhan,
                    'jumlah_eksisting': $scope.item.jumlahEksisting,
                    'jumlah': $scope.item.jumlahKebutuhan,
                    'jumlah_diterima': $scope.item.jumlahDiterima,
                }
                var objSave = {
                    "data": json
                }

                medifirstService.post('bridging/sisrute/post-sdm', objSave).then(function (e) {
                    medifirstService.post('bridging/sisrute/put-sdm', objSave).then(function (e) {
                        $scope.findData()
                        $scope.isRouteLoading = false;
                    }, function error(e) {
                        $scope.isRouteLoading = false;
                    })
                    // $scope.findData()
                    // $scope.isRouteLoading = false;
                }, function error(e) {
                    $scope.isRouteLoading = false;
                })
            }

            $scope.saveAlkes = function (){
                $scope.isRouteLoading = true;
                var json = {
                    'id_kebutuhan': $scope.item.alkes.id_kebutuhan,
                    'jumlah_eksisting': $scope.item.jumlahEksistingAlkes,
                    'jumlah': $scope.item.jumlahKebutuhanAlkes,
                    'jumlah_diterima': $scope.item.jumlahDiterimaAlkes,
                }
                var objSave = {
                    "data": json
                }

                medifirstService.post('bridging/sisrute/post-alkes', objSave).then(function (e) {
                    medifirstService.post('bridging/sisrute/put-alkes', objSave).then(function (e) {
                        $scope.findData3()
                        $scope.isRouteLoading = false;
                    }, function error(e) {
                        $scope.isRouteLoading = false;
                    })
                    // $scope.findData()
                    // $scope.isRouteLoading = false;
                }, function error(e) {
                    $scope.isRouteLoading = false;
                })
            }

            function loadCombo() {
                medifirstService.get("bridging/sisrute/get-combo-sdm").then(function (data) {
                    $scope.listSDM = data.data.kebutuhan_sdm;

                });
                medifirstService.get("bridging/sisrute/get-combo-alkes").then(function (data) {
                    $scope.listAlkes = data.data.kebutuhan_apd;

                });
            }
            loadCombo()
            $scope.refresh = function () {
                $scope.item = {
                    from: $scope.now,
                    until: $scope.now,
                    rows: 100
                };
                $scope.findData()
            }
            $scope.refreshData = function () {
                $scope.pasien = {}
                loadDataPasien()
            }
            $scope.SearchDatatab = function () {
                $scope.findData()
            }
            $scope.SearchDatatabb = function () {
                $scope.findData3()
            }
          
            function loadDataPasien() {

                $scope.isRouteLoading = true;


                var rm = ""
                if ($scope.pasien.noRM != undefined) {
                    rm = "&norm=" + $scope.pasien.noRM
                }

                var pasien = ""
                if ($scope.pasien.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.pasien.namaPasien
                }
                var ayah = ""
                if ($scope.pasien.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.pasien.namaAyah
                }
                var almat = ""
                if ($scope.pasien.alamat != undefined) {
                    almat = "&alamat=" + $scope.pasien.alamat
                }

                var tglLahirs = ""
                if ($scope.pasien.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + dateHelper.formatDate($scope.pasien.tglLahir, 'YYYY-MM-DD');
                }

                medifirstService.get("registrasipasien/get-pasien?" +
                    tglLahirs +
                    rm +
                    pasien +
                    ayah +
                    almat)
                    .then(function (data) {
                        $scope.isRouteLoading = false;

                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.daftar,
                            // pageSize: 10,

                        });
                    });

            };

            $scope.findData = function () {
                $scope.isRouteLoading = true;

                debugger;

                medifirstService.get("bridging/sisrute/get-combo-data-sdm").then(function (e) {
                    // debugger;
                    $scope.isRouteLoading = false;
                    $scope.dataPasienBatal = new kendo.data.DataSource({
                        data: e.data.sdm,
                        serverPaging: false,
                    });
                })
            }

            
            function f3() {
                $scope.isRouteLoading = true;

                medifirstService.get("bridging/sisrute/get-combo-data-alkes").then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.dataPasienBatal2 = new kendo.data.DataSource({
                            data: e.data.apd,
                            serverPaging: false,
                        });
                    })
            }
            $scope.findData3 = function () {
                f3();

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.findData();
            $scope.findData3();
            $scope.selectedData = [];
            $scope.selectedData2 = [];
          
           
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Kebutuhan SDM Covid-19.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Kebutuhan SDM Covid-19",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },

                selectable: 'row',

                columns: [

                    {
                        field: "tglupdate",
                        title: "Tgl Update",
                        template: "<span class='style-left'>{{formatTanggal('#: tglupdate #')}}</span>"
                    },

                    {
                        field: "id_kebutuhan",
                        title: "ID",
                        hidden: false
                    },
                    {
                        field: "kebutuhan",
                        title: "Kebutuhan",
                        hidden: false
                    },
                    {
                        field: "jumlah_eksisting",
                        title: "jumlah eksisting",
                        hidden: false
                    },
                    {
                        field: "jumlah",
                        title: "jumlah kebutuhan"
                    },
                    {
                        field: "jumlah_diterima",
                        title: "jumlahditerima"
                    },
                ],
                selectable: "row"
            }

            $scope.mainGridOptions2 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DAFTAR KEBUTUHAN ALKES COVID-19.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:I1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "DAFTAR KEBUTUHAN ALKES COVID-19",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,

                columns: [
                    {
                        field: "tglupdate",
                        title: "Tgl Update",
                        template: "<span class='style-left'>{{formatTanggal('#: tglupdate #')}}</span>"
                    },
                    {
                        field: "id_kebutuhan",
                        title: "ID",
                        hidden: false
                    },
                    {
                        field: "kebutuhan",
                        title: "kebutuhan",
                        hidden: false,
                        width: 200,
                    },
                    {
                        field: "jumlah_eksisting",
                        title: "jumlah eksisting",
                        hidden: false
                    },
                    {
                        field: "jumlah",
                        title: "jumlah Kebutuhan"
                    },
                    {
                        field: "jumlah_diterima",
                        title: "jumlah diterima"
                    }
                ],
                selectable: "row"
            }
          
          
          
         

            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'))
            $scope.ruanganLogin = JSON.parse(window.localStorage.getItem('mapLoginUserToRuangan'))
         

           
          
          
            
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
            $scope.cetakLabel = function () {
                var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-labelpasien-satubynocm=1&nocm='+$scope.dataSelected.nocm , function(response) {
                //       // aadc=response;

                // });
                client.get(' http://127.0.0.1:1237/printvb/rekammedis?cetak-labelpasien-satubynocm=1&norec=' + $scope.dataSelected.nocm + '&view=false&qty=1', function (response) {
                    // aadc=response;
                });
            }

            $scope.cetakFormKunjungan = function () {

                var client = new HttpClient();

                client.get(' http://127.0.0.1:1237/printvb/Pendaftaran?cetak-form-kunjungan-pasien-byNorecPd=1&norec=' + $scope.dataSelected.norecpd + '&view=1', function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakFormKunjungan2 = function () {

                var client = new HttpClient();

                client.get(' http://127.0.0.1:1237/printvb/Pendaftaran?cetak-form-kunjungan-pasien-byNorecPd=1&norec=' + $scope.dataSelected2.norecpd + '&view=1', function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakTracer = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih Dulu NoRegistrasi Pasien')
                    return
                }
                if ($scope.dataSelected.noregistrasi != undefined) {

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataSelected.noregistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.cetakTracer2 = function () {
                if ($scope.dataSelected2 == undefined) {
                    toastr.error('Pilih Dulu NoRegistrasi Pasien')
                    return
                }
                if ($scope.dataSelected2.noregistrasi != undefined) {

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataSelected2.noregistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }

            

            function panggilsemua() {
                $scope.findData();
                f3();
            }
        }
    ]);

});