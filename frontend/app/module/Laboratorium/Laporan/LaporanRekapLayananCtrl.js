define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapLayananCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            loadCombo();
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
           
                // $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                // $scope.listPegawaiKasir = dat.data.kasir;
                //$scope.dataLogin = dat.data.datalogin[0];
                $scope.listPasien = dat.data.kelompokpasien;
                // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
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

                var kp = ""
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
				}
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPemeriksaanLabCtrl', chacePeriode);

                medifirstService.get("laboratorium/get-laporan-lab-all-rekap?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + kp
                    ).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas
                        });
                        $scope.dataExcel = data.data;
                    })
            }


            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanTindakan.xlsx",
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
                        cells: [{ value: "Laporan Rekap Tindakan", background: "#fffff" }]
                    });
                },
                columns: [
                   
                    {
                        "field": "kelompokpasien",
                        "title": "Jenis Pasien",
                        "width": "180px",

                    },
                    {
                        "field": "detailjenisproduk",
                        "title": "jenis produk",
                        "width": "100px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "nama produk",
                        "width": "150px"
                    },
                    {
                        "field": "jumlah",
                        "title": "jumlah",
                        "width": "100px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    }
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
            
            $scope.RincianPelayanan = function(){
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }      
                var isTglPulang = ''
                if($scope.item.cekTglPulang != undefined){
                    isTglPulang ="&isTglPulang="+ $scope.item.cekTglPulang 
                }          
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPasienDaftarCtrl', chacePeriode);
                medifirstService.get("registrasi/laporan/get-data-lap-rincian-pelayanan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    +isTglPulang).then(function (data) {
                        $scope.isLoadingData = false;
                        $scope.popup_Laporan.center().open();                        
                        var datas = data.data;
                        for (let i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            var umur = DateHelper.CountAge(new Date(datas[i].tgllahirReal), new Date(datas[i].tglregistrasiReal));
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            datas[i].umur = thn + ' thn ' + bln + ' bln ' + day + ' hr ' 
                        }
                        $scope.sourceLaporanSatu = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 1000,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });                        
                    })
            }

            $scope.columnLaporanSatu = {
                toolbar:["excel"],
                excel: {
                    fileName:"DataLaporanRincianPelayanan.xls",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "90px",
                        "template": "<span class='style-left'>#: tglregistrasi #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "90px",
                        "template": "<span class='style-center'>#: tglpulang #</span>"
                    },                    
                    {
                        "field": "jamperiksa",
                        "title": "Jam Periksa",
                        "width": "90px",
                        "template": "<span class='style-center'>#: jamperiksa #</span>"
                    }, 
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px"
                    },    
                    {
                        "field": "ruanganakhir",
                        "title": "Ruangan Akhir",
                        "width": "120px"
                    },                                      
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "100px",
                        "template": "<span class='style-center'>#: dokter #</span>"
                    },
                    {
                        "field": "tipepasien",
                        "title": "Tipe Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: tipepasien #</span>"
                    },
                    {
                        "field": "jenispasien",
                        "title": "Jenis Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jenispasien #</span>"
                    },                                       
                    // {
                    //     "field": "carabayar",
                    //     "title": "Cara Bayar",
                    //     "width": "100px",
                    //     "template": "<span class='style-center'>#: carabayar #</span>"
                    // },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi",
                        "width": "100px",
                        "template": "<span class='style-center'>#: noregistrasi #</span>"
                    },                                      
                    {
                        "field": "nocm",
                        "title": "No. Rm",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        "template": "<span class='style-center'>#: namapasien #</span>"
                    },                                      
                    {
                        "field": "nohp",
                        "title": "No Telepon",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nohp #</span>"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "100px",
                        "template": "<span class='style-center'>#: tgllahir #</span>"
                    },                                                                          
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px",
                        "template": "<span class='style-center'>#: umur #</span>"
                    },  
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },                                    
                    {
                        "field": "agama",
                        "title": "Agama",
                        "width": "100px",
                        "template": "<span class='style-center'>#: agama #</span>"
                    },
                    {
                        "field": "pendidikan",
                        "title": "Pendidikan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: pendidikan #</span>"
                    },                                     
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: pekerjaan #</span>"
                    },
                    {
                        "field": "statusperkawinan",
                        "title": "Status Perkawinan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: statusperkawinan #</span>"
                    },
                    {
                        "field": "alamat",
                        "title": "Alamat",
                        "width": "100px",
                        "template": "<span class='style-center'>#: alamat #</span>"
                    },                                     
                    {
                        "field": "kelurahan",
                        "title": "Kelurahan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kelurahan #</span>"
                    },
                    {
                        "field": "kecamatan",
                        "title": "Kecamatan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kecamatan #</span>"
                    },
                    {
                        "field": "kabupaten",
                        "title": "Kabupaten",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kabupaten #</span>"
                    },
                    {
                        "field": "kodepenyakit",
                        "title": "Kode Penyakit",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kodepenyakit #</span>"
                    },
                ]
            };
          

            function loadCombo() {
			
				medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
					
					$scope.listKelompokPasien = data.data.kelompokpasien;
					
				});

			}
           
            //* BATAS//
        }
    ]);
});