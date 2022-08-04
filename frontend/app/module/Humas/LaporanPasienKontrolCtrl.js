define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPasienKontrolCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.cekTglPulang = false;

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
          
            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [

                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }

            ]

            //debugger;
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.CetakPasienDaftar = function () {
                // if($scope.item.format == undefined){
                // 	alert('format file harus dipilih terlebih dahulu !!!')
                // }
                //debugger;
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");

                if ($scope.item.KelompokPasien == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.KelompokPasien.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                var stt = 'false'
                if (confirm('View Laporan Pasien Daftar? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdRuangan=' + ruangan + '&strIdDepartement=' + departement + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&view=' + stt, function (response) {
                    // do something with response
                });
                // if(client.status==0){
                //     if($scope.item.format == undefined){
                //         alert('format file harus dipilih terlebih dahulu !!!');
                //     }else{
                //         var urlLaporan = ReportPelayanan.open('preporting/lapPelayananPasien?startDate=''+tglawal+'+tglawal+'&tglAkhir='+tglakhir+'&strIdRuangan='+ruangan+'&strIdDepartement='+departement+'&strIdKelompokPasien='+kelompokPasien+'&strIdDokter='+namaPegawai+'&format='+$scope.item.format.format);
                //         window.open(urlLaporan, '_blank');
                //     }
                // }   
            };

            medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {
           
                $scope.listDepartemen = dat.data.departemen;
                $scope.listJenisPelayanan = [
                                                {id: "16", jenispelayanan: "Rawat Inap"},
                                                {id: "18", jenispelayanan: "Rawat Jalan"},
                                                {id: "24", jenispelayanan: "Gawat Darurat"},
                                            ]
            });
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData()

            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                //debugger;

                var nama = "";
                if ($scope.item.nama != undefined) {
                    nama = "&nama=" + $scope.item.nama;
                }
                var norm = "";
                if ($scope.item.norm != undefined) {
                    norm = "&norm=" + $scope.item.norm;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPasienDaftarCtrl', chacePeriode);

                medifirstService.get("humas/laporan-pasien-kontrol?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + nama
                    + norm).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i+1
                            if (datas[i].tglkontrolterakhir == null){
                                datas[i].tglkontrolterakhir = ''
                            }
                            if (datas[i].ruangankontrolterakhir == null){
                                datas[i].ruangankontrolterakhir = ''
                            }
                        }
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            total: datas.length,
                            serverPaging: false,
                            model: {
                                  schema: {
                                  fields: {
                                    }
                                }
                            }
                        });

                        $scope.dataExcel = datas;
                    })
            }


            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanPasienKontrol.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Pasien Kontrol", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "50px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "100px"
                    }, 
                    {
                        "field": "tglkontrol",
                        "title": "Tgl Kontrol",
                        "width": "50px"
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "60px"
                    },
                    {
                        "field": "nohp",
                        "title": "No Telepon",
                        "width": "80px"
                    },
                    {
                        "field": "alamat",
                        "title": "Alamat",
                        "width": "280px"
                    }
                    // {
                    //     "field": "tglkontrolterakhir",
                    //     "title": "Tgl Kunjungan Terakhir",
                    //     "width": "50px"
                    // },
                    // {
                    //     "field": "ruangankontrolterakhir",
                    //     "title": "Ruangan Kunjungan Terakhir",
                    //     "width": "80px"
                    // },
                    // {
                    //     "field": "tglpulang",
                    //     "title": "Tgl Kunjungan Terakhir",
                    //     "width": "50px"
                    // },
                    // {
                    //     "field": "ruanganlast",
                    //     "title": "Ruangan Rawat Inap",
                    //     "width": "80px"
                    // },
                    // {
                    //     "field": "tglkontrolterakhir",
                    //     "title": "Tgl Kontrol Terakhir",
                    //     "width": "50px"
                    // },
                    // {
                    //     "field": "ruangankontrolterakhir",
                    //     "title": "Ruangan Kontrol Terakhir",
                    //     "width": "80px"
                    // },
                    // {
                    //     "field": "penanggungjawab",
                    //     "title": "Nama PJ",
                    //     "width": "100px"
                    // },  
                ]
            });




            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }
            
            
            //* BATAS//
        }
    ]);
});