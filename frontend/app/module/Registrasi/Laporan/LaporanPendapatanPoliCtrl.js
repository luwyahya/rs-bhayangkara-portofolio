define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPendapatanPoliCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            $scope.$watch('item.KelompokPasien', function (e) {
                if (e === undefined) return;
                if($scope.isLoadEdit == true){
                    $scope.nonUmum = true;
                    $scope.isLoadEdit = false;
                    return;
                }
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (z) {
                        $scope.listrekanan = z.data.rekanan;
                        if (e.kelompokpasien == 'Umum/Pribadi') {
                            $scope.item.Rekanan = '';
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }
                        }
                        else if (e.kelompokpasien.indexOf('BPJS') > -1) {
                            $scope.item.Rekanan = { id: $scope.listrekanan[0].id, namarekanan: $scope.listrekanan[0].namarekanan };
                            $scope.nonUmum = true;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

                        }
                        else if (e.kelompokpasien == 'Jamkesda') {
                            $scope.item.Rekanan = { id: $scope.listrekanan[0].id, namarekanan: $scope.listrekanan[0].namarekanan };
                            $scope.nonUmum = true;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

                        }
                        else if (e.kelompokpasien == 'Non Kuota') {
                            $scope.item.Rekanan = undefined
                            // $scope.item.rekanan = { id: $scope.listrekanan[0].id, namarekanan: $scope.listrekanan[0].namarekanan };
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

                        } else if (e.kelompokpasien == 'Telemedicine') {
                            $scope.item.Rekanan = '';
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }
                            $scope.isTelemedicine = 'true';

                        }
                        else {
                            $scope.nonUmum = true;
                            $scope.item.Rekanan = { id: $scope.listrekanan[0].id, namarekanan: $scope.listrekanan[0].namarekanan };
                            $scope.item.jenisPasien = {
                                id: $scope.listJenisPelayanan[1].id,
                                jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan
                            }


                        }
                        if ($scope.resultEdit != undefined)

                            $scope.item.jenisPasien = {
                                id: parseInt($scope.resultEdit.objectjenispelayananfk),
                                jenispelayanan: $scope.resultEdit.jenispelayanan
                            }

                    })
            });

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
             
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDepartemen=" + $scope.item.departement.id
                }
                var tempDokterId = "";
                if ($scope.item.namaPegawai != undefined) {
                    tempDokterId = "&idDokter=" + $scope.item.namaPegawai.id;
                }
                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }
                var tempRekananId = "";
                if ($scope.item.Rekanan != undefined) {
                    tempRekananId = "&rekanan=" + $scope.item.Rekanan.id;
                }
                var tempJenisKelompokId = "";
                if ($scope.item.JenisKelompokPasien != undefined) {
                    tempJenisKelompokId = "&jeniskelompokpasien=" + $scope.item.JenisKelompokPasien.id;
                }
                var tempJaminanId = "";
                if ($scope.item.JaminanKhusus != undefined) {
                    tempJaminanId = "&jaminankhusus=" + $scope.item.JaminanKhusus.id;
                }
                var tempNoRM = "";
                if ($scope.item.noCm != undefined) {
                    tempNoRM = "&nocm=" +$scope.item.noCm;
                }
                var tempNamaPasien = "";
                if ($scope.item.namapasien != undefined) {
                    tempNamaPasien = "&namapasien=" + $scope.item.namapasien
                }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPendapatanPoliCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-lap-pendapatan-poli?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempDokterId
                    + tempKelPasienId
                    + tempRekananId
                    + tempJenisKelompokId
                    + tempJaminanId
                    + tempNoRM
                    + tempNamaPasien).then(function (data) {
                        var doubleTotal = 0;
                        var doubleKarcis = 0;
                        for (var i = 0; i < data.data.data.length; i++) {
                            doubleTotal = doubleTotal + parseFloat(data.data.data[i].total)
                            doubleKarcis = doubleKarcis + parseFloat(data.data.data[i].karcis)
                        }
                        $scope.item.karcis = doubleKarcis
                        $scope.item.total = doubleTotal
                        $scope.ambildataexcel = data.data;
                        $scope.dataPendapatanPoli = {
                            data: data.data.data,
                            pageSize: 10,
                            total: data.data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }, aggregate: [
                                {field: 'total', aggregate: 'sum'},
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // $scope.dataExcel = data.data.data
                    })
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;
                //debugger;
            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnPendapatanPoli ={
                toolbar: ["excel"],

                excel: {
                    fileName: "LaporanPendapatanPoli.xlsx",
                    allPages: true,
                },

                // dataSource: $scope.dataExcel,
                // sortable: true,
                // reorderable: true,
                // filterable: true,
                // pageable: true,
                // // groupable: true,
                // columnMenu: true,
                // resizable: true,
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:X1"];
                        sheet.name = "LAPORAN PENDAPATAN POLI";

                        var myHeaders = [

                            {
                                value: "REKAPITULASI PENDAPATAN POLI BERDASARKAN TANGGAL " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                    DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl",
                        "width": "180px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No. Registrasi",
                        "width": "180px",
    
                    },
                    {
                        "field": "nocm",
                        "title": "No. RM",
                        "width": "180px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama",
                        "width": "180px"
                    },
    
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "180px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    },
                    {
                        "field": "statuskunjungan",
                        "title": "Status",
                        "width": "80px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "History Ruangan",
                        "width": "180px"
                    },
                    {
                        "field": "ruanganterakhir",
                        "title": "Ruangan Terakhir",
                        "width": "180px"
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Jaminan",
                        "width": "80px"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Rekanan",
                        "width": "100px"
                    },
                    {
                        "field": "jaminankhusus",
                        "title": "Jaminan Khusus",
                        "width": "180px"
                    },
                    {
                        "field": "jeniskelompokpasien",
                        "title": "Jenis Kelompok Pasien",
                        "width": "180px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Dokter",
                        "width": "180px"
                    },
                    {
                        "field": "jmlkarcis",
                        "title": "Vol",
                        "width": "40px",
                    },
                    {
                        "field": "karcis",
                        "title": "Karcis",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: karcis #','')}}</span>",
                    },
                    {
                        "field": "jmlembos",
                        "title": "Vol",
                        "width": "40px",
    
                    },
                    {
                        "field": "embos",
                        "title": "Embos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: embos #','')}}</span>",
                    },
                    {
                        "field": "jmlkonsul",
                        "title": "Vol",
                        "width": "40px",
    
                    },
                    {
                        "field": "konsul",
                        "title": "Konsultasi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: konsul #','')}}</span>",
                    },
                    {
                        "field": "jmltindakan",
                        "title": "Vol",
                        "width": "40px",
    
                    },
                    {
                        "field": "tindakan",
                        "title": "Tindakan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: tindakan #','')}}</span>",
                    },
                    {
                        "field": "jmlresep",
                        "title": "Vol",
                        "width": "40px",
    
                    },
                    {
                        "field": "resep",
                        "title": "Resep",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: resep #','')}}</span>",
                    },
                    {
                        "field": "diskon",
                        "title": "Diskon",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: diskon #','')}}</span>",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        template: "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate:  "#:data.total.sum  #"
                        
                    },

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                ,
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
                // [
                        // {
                        //     "field": "tglregistrasi",
                        //     "title": "Tgl",
                        //     "width": "150px",
                        //     "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                        // },
                        // {
                        //     "field": "noregistrasi",
                        //     "title": "No. Registrasi",
                        //     "width": "120px",
        
                        // },
                        // {
                        //     "field": "nocm",
                        //     "title": "No. RM",
                        //     "width": "100px",
                        //     "template": "<span class='style-center'>#: nocm #</span>"
                        // },
                        // {
                        //     "field": "namapasien",
                        //     "title": "Nama",
                        //     "width": "180px"
                        // },
        
                        // {
                        //     "field": "tgllahir",
                        //     "title": "Tgl Lahir",
                        //     "width": "150px",
                        //     "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                        // },
                        // {
                        //     "field": "statuskunjungan",
                        //     "title": "Status",
                        //     "width": "80px"
                        // },
                        // {
                        //     "field": "namaruangan",
                        //     "title": "Ruangan",
                        //     "width": "100px"
                        // },
                        // {
                        //     "field": "kelompokpasien",
                        //     "title": "Jaminan",
                        //     "width": "80px"
                        // },
                        // {
                        //     "field": "namarekanan",
                        //     "title": "Rekanan",
                        //     "width": "100px"
                        // },
                        // {
                        //     "field": "namalengkap",
                        //     "title": "Dokter",
                        //     "width": "180px"
                        // },
                        // {
                        //     "field": "jmlkarcis",
                        //     "title": "Vol",
                        //     "width": "40px",
                        // },
                        // {
                        //     "field": "karcis",
                        //     "title": "Karcis",
                        //     "width": "100px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: karcis #','')}}</span>",
                        // },
                        // {
                        //     "field": "jmlembos",
                        //     "title": "Vol",
                        //     "width": "40px",
        
                        // },
                        // {
                        //     "field": "embos",
                        //     "title": "Embos",
                        //     "width": "100px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: embos #','')}}</span>",
                        // },
                        // {
                        //     "field": "jmlkonsul",
                        //     "title": "Vol",
                        //     "width": "40px",
        
                        // },
                        // {
                        //     "field": "konsul",
                        //     "title": "Konsultasi",
                        //     "width": "100px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: konsul #','')}}</span>",
                        // },
                        // {
                        //     "field": "jmltindakan",
                        //     "title": "Vol",
                        //     "width": "40px",
        
                        // },
                        // {
                        //     "field": "tindakan",
                        //     "title": "Tindakan",
                        //     "width": "100px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: tindakan #','')}}</span>",
                        // },
                        // {
                        //     "field": "jmlresep",
                        //     "title": "Vol",
                        //     "width": "40px",
        
                        // },
                        // {
                        //     "field": "resep",
                        //     "title": "Resep",
                        //     "width": "100px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: resep #','')}}</span>",
                        // },
                        // {
                        //     "field": "diskon",
                        //     "title": "Diskon",
                        //     "width": "100px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: diskon #','')}}</span>",
                        // },
                        // {
                        //     "field": "total",
                        //     "title": "Total",
                        //     "width": "100px",
                        //     "template": "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        // },
                // ]
            
            
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
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
            medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
                $scope.listDepartemen = data.data.departemen;
                $scope.listKelompokPasien = data.data.kelompokpasien;
                $scope.listJaminanKhusus = data.data.jaminankhusus;
                $scope.listPegawai = data.data.dokter;
                $scope.listJenisKelompokPasien = data.data.jeniskelompokpasien;
            })

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }
            //
            //sdm service hanya sementara, nanti harus diganti pake service kasir !!
            // ManageSdm.getItem("service/list-generic/?view=Pegawai&select=id,namaLengkap", true).then(function (dat) {
            //     $scope.listPegawai = dat.data;
            // });

            // ManageSdm.getItem("service/list-generic/?view=Ruangan&select=id,reportDisplay").then(function(dat) {
            // $scope.listRuangan = dat.data;
            // });

            // ManageSdm.getItem("service/list-generic/?view=KelompokPasien&select=*").then(function(dat) {
            // $scope.listPasien = dat.data;
            // });

            // ManageSdm.getItem("service/list-generic/?view=Departemen&select=*").then(function(dat) {
            // $scope.listDepartemen = dat.data;
            // });


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

            
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.CetakSensusBPJS = function () {
                // if($scope.item.format == undefined){
                // 	alert('format file harus dipilih terlebih dahulu !!!')
                // }
          
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
                if ($scope.item.namaPegawai == undefined)
                    var namaPegawai = "";
                else
                    var namaPegawai = $scope.item.namaPegawai.id;
                var stt = 'false'
                if (confirm('View Laporan Pendapatan Poli? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }


                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-LaporanPendapatanPoli=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&strIdDokter=' + namaPegawai + '&strIdPegawai=' + $scope.pegawai.id + '&view=' + stt, function (response) {
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


        }
    ]);
});