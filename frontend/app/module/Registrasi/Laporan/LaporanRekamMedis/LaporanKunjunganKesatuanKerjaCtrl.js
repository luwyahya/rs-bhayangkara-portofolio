define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanKunjunganKesatuanKerjaCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.$watch('item.kelompokpasien', function (e) {
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
                debugger;
                $scope.listDepartemen = dat.data.departemen;
                $scope.listKelompokPasien = dat.data.kelompokpasien;
                $scope.listJenisKelompok = dat.data.jeniskelompokpasien;
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
                var total = 0;
                var totalPersen = 0;
                medifirstService.get("registrasi/laporan/get-laporan-pasien-daftar-kesatuan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    ).then(function (data) {
                        debugger;
                        var datas = data.data;
                        for (let i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            total = parseFloat(total) + parseFloat(datas[i].Jumlah);
                            
                        }
                        for (let i = 0; i < datas.length; i++) {
                            datas[i].persen = 100 - (((parseFloat(total) - parseFloat(datas[i].Jumlah) )  / parseFloat(total) )  * 100);  
                            datas[i].persen =  datas[i].persen.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        }
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
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
                    fileName: "LaporanPasienDaftar.xlsx",
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
                        cells: [{ value: "Pasien Daftar", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        "field": "no",
                        "title": "No. ",
                        "width": "100px",
                       
                    },
                    {
                        "field": "kesatuanpasien",
                        "title": "Nama Pasien",
                        "width": "100px",
                       
                    },
                    {
                        "field": "Jumlah",
                        "title": "Jumlah",
                        "width": "100px",
                    
                    },
                    {
                        "field": "persen",
                        "title": "Persentase",
                        "width": "100px",
                    
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

            $scope.lihatBridging = function(){
                $scope.popUpBridging.center().open();
                var dateStartBridging = new Date()
                dateStartBridging.setMonth(dateStartBridging.getMonth() - 1)
                dateStartBridging.setDate(1)
                dateStartBridging.setHours(0,0,0)
                $scope.item.tglawalpopup = dateStartBridging

                 var dateEndBridging = new Date()
                dateEndBridging.setMonth(dateEndBridging.getMonth() - 1)
                dateEndBridging.setDate(31)
                dateEndBridging.setHours(23,59,59)
                $scope.item.tglakhirpopup = dateEndBridging
            }

            $scope.searchBridging = function(){
                var tglawalpopup = moment($scope.item.tglawalpopup).format('YYYY-MM-DD HH:mm');
                var tglakhirpopup = moment($scope.item.tglakhirpopup).format('YYYY-MM-DD HH:mm');
                medifirstService.get("registrasi/laporan/get-data-bridging-dinkes?tglAwal="+tglawalpopup+"&tglAkhir="+tglakhirpopup).then(function (dat) {
                   var data = dat.data
                   // $scope.item.bulan = data.bulan
                   // $scope.item.pasien_awal_0 = data.pasien_awal_0[0].jumlah


                    $scope.item.kd_hospital = data.kd_hospital;
                    $scope.item.tahun = data.tahun;
                    $scope.item.bulan = data.bulan;
                    $scope.item.pasien_awal_0 = data.pasien_awal_0[0].jumlah;
                    $scope.item.pasien_awal_1 = data.pasien_awal_1[0].jumlah;
                    $scope.item.pasien_masuk_0 = data.pasien_masuk_0[0].jumlah;
                    $scope.item.pasien_masuk_1 = data.pasien_masuk_1[0].jumlah;
                    $scope.item.pasien_keluar_hidup_0 = data.pasien_keluar_hidup_0[0].jumlah;
                    $scope.item.pasien_keluar_hidup_1 = data.pasien_keluar_hidup_1[0].jumlah;
                    $scope.item.keluar_mati_kurang48_0 = data.keluar_mati_kurang48_0[0].jumlah;
                    $scope.item.keluar_mati_kurang48_1 = data.keluar_mati_kurang48_1[0].jumlah;
                    $scope.item.keluar_mati_lebih48_0 = data.keluar_mati_lebih48_0[0].jumlah;
                    $scope.item.keluar_mati_lebih48_1 = data.keluar_mati_lebih48_1[0].jumlah;
                    $scope.item.lama_dirawat_0 = data.lama_dirawat_0[0].jumlah;
                    $scope.item.lama_dirawat_1 = data.lama_dirawat_1[0].jumlah;
                    $scope.item.pasien_akhir_0 = data.pasien_akhir_0[0].jumlah;
                    $scope.item.pasien_akhir_1 = data.pasien_akhir_1[0].jumlah;
                    $scope.item.hari_perawatan_0 = data.hari_perawatan_0;
                    $scope.item.hari_perawatan_1 = data.hari_perawatan_1;
                    $scope.item.pengunjung_baru_0 = data.pengunjung_baru_0[0].jumlah;
                    $scope.item.pengunjung_baru_1 = data.pengunjung_baru_1[0].jumlah;
                    $scope.item.pengunjung_lama_0 = data.pengunjung_lama_0[0].jumlah;
                    $scope.item.pengunjung_lama_1 = data.pengunjung_lama_1[0].jumlah;
                    $scope.item.kunj_baru_0 = data.kunj_baru_0[0].jumlah;
                    $scope.item.kunj_baru_1 = data.kunj_baru_1[0].jumlah;
                    $scope.item.kunj_lama_0 = data.kunj_lama_0[0].jumlah;
                    $scope.item.kunj_lama_1 = data.kunj_lama_1[0].jumlah;
                    $scope.item.pasien_ranap_0 = data.pasien_ranap_0[0].jumlah;
                    $scope.item.pasien_ranap_1 = data.pasien_ranap_1[0].jumlah;
                    $scope.item.pasien_rajal_0 = data.pasien_rajal_0[0].jumlah;
                    $scope.item.pasien_rajal_1 = data.pasien_rajal_1[0].jumlah;
                    $scope.item.dari_pkm_0 = data.dari_pkm_0[0].jumlah;
                    $scope.item.dari_pkm_1 = data.dari_pkm_1[0].jumlah;
                    $scope.item.dari_faskes_0 = data.dari_faskes_0[0].jumlah;
                    $scope.item.dari_faskes_1 = data.dari_faskes_1[0].jumlah;
                    $scope.item.dari_rs_0 = data.dari_rs_0[0].jumlah;
                    $scope.item.dari_rs_1 = data.dari_rs_1[0].jumlah;
                    $scope.item.pel_kes_jiwa_0 = data.pel_kes_jiwa_0[0].jumlah;
                    $scope.item.pel_kes_jiwa_1 = data.pel_kes_jiwa_1[0].jumlah;
                });
            }

            $scope.sendBridging = function(){
                var databridging = {
                                        "data": {
                                            "kd_hospital": "3372052",
                                            "tahun": $scope.item.tahun,
                                            "data":[
                                                {
                                                  "bulan": $scope.item.bulan,
                                                  "pasien_awal_0": $scope.item.pasien_awal_0,
                                                  "pasien_awal_1": $scope.item.pasien_awal_1,
                                                  "pasien_masuk_0": $scope.item.pasien_masuk_0,
                                                  "pasien_masuk_1": $scope.item.pasien_masuk_1,
                                                  "pasien_keluar_hidup_0": $scope.item.pasien_keluar_hidup_0,
                                                  "pasien_keluar_hidup_1": $scope.item.pasien_keluar_hidup_1,
                                                  "keluar_mati_kurang48_0": $scope.item.keluar_mati_kurang48_0,
                                                  "keluar_mati_kurang48_1": $scope.item.keluar_mati_kurang48_1,
                                                  "keluar_mati_lebih48_0": $scope.item.keluar_mati_lebih48_0,
                                                  "keluar_mati_lebih48_1": $scope.item.keluar_mati_lebih48_1,
                                                  "lama_dirawat_0": $scope.item.lama_dirawat_0,
                                                  "lama_dirawat_1": $scope.item.lama_dirawat_1,
                                                  "pasien_akhir_0": $scope.item.pasien_akhir_0,
                                                  "pasien_akhir_1": $scope.item.pasien_akhir_1,
                                                  "hari_perawatan_0": $scope.item.hari_perawatan_0,
                                                  "hari_perawatan_1": $scope.item.hari_perawatan_1,
                                                  "pengunjung_baru_0": $scope.item.pengunjung_baru_0,
                                                  "pengunjung_baru_1": $scope.item.pengunjung_baru_1,
                                                  "pengunjung_lama_0": $scope.item.pengunjung_lama_0,
                                                  "pengunjung_lama_1": $scope.item.pengunjung_lama_1,
                                                  "kunj_baru_0": $scope.item.kunj_baru_0,
                                                  "kunj_baru_1": $scope.item.kunj_baru_1,
                                                  "kunj_lama_0": $scope.item.kunj_lama_0,
                                                  "kunj_lama_1": $scope.item.kunj_lama_1,
                                                  "pasien_ranap_0": $scope.item.pasien_ranap_0,
                                                  "pasien_ranap_1": $scope.item.pasien_ranap_1,
                                                  "pasien_rajal_0": $scope.item.pasien_rajal_0,
                                                  "pasien_rajal_1": $scope.item.pasien_rajal_1,
                                                  "dari_pkm_0": $scope.item.dari_pkm_0,
                                                  "dari_pkm_1": $scope.item.dari_pkm_1,
                                                  "dari_faskes_0": $scope.item.dari_faskes_0,
                                                  "dari_faskes_1": $scope.item.dari_faskes_1,
                                                  "dari_rs_0": $scope.item.dari_rs_0,
                                                  "dari_rs_1": $scope.item.dari_rs_1,
                                                  "pel_kes_jiwa_0": $scope.item.pel_kes_jiwa_0,
                                                  "pel_kes_jiwa_1": $scope.item.pel_kes_jiwa_1
                                                }
                                            ]
                                        }
                                    }

                medifirstService.post("registrasi/laporan/send-data-bridging-dinkes", databridging).then(function (dat) {


                })
            }

            $scope.lihatBridgingPenyakit = function(){
                $scope.popUpBridgingPenyakit.center().open();
                var dateStartBridgingPenyakit = new Date()
                dateStartBridgingPenyakit.setMonth(dateStartBridgingPenyakit.getMonth() - 1)
                dateStartBridgingPenyakit.setDate(1)
                dateStartBridgingPenyakit.setHours(0,0,0)
                $scope.item.tglawalpopuppenyakit = dateStartBridgingPenyakit

                 var dateEndBridgingPenyakit = new Date()
                dateEndBridgingPenyakit.setMonth(dateEndBridgingPenyakit.getMonth() - 1)
                dateEndBridgingPenyakit.setDate(31)
                dateEndBridgingPenyakit.setHours(23,59,59)
                $scope.item.tglakhirpopuppenyakit = dateEndBridgingPenyakit

                $scope.listJenisPelayananPopUp = [
                                            {id: 18, jenispelayanan: 'RAJAL'},
                                            {id: 16, jenispelayanan: 'RANAP'}
                                          ]

                $scope.item.jenispelayananpopup = {id: 18, jenispelayanan: 'RAJAL'}
            }

            $scope.searchBridgingPenyakit = function() {

                $scope.isRouteLoading = true;

                var tglawalpopuppenyakit = moment($scope.item.tglawalpopuppenyakit).format('YYYY-MM-DD HH:mm');
                var tglakhirpopuppenyakit = moment($scope.item.tglakhirpopuppenyakit).format('YYYY-MM-DD HH:mm');
                //debugger;

                var tempDepartemenId = "";
                if ($scope.item.jenispelayananpopup != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.jenispelayananpopup.id;
                }
                $scope.datapenyakit = []
                medifirstService.get("registrasi/laporan/get-data-diagnosa-bridging?"
                    + "tglAwal=" + tglawalpopuppenyakit
                    + "&tglAkhir=" + tglakhirpopuppenyakit
                    + tempDepartemenId).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data;
                        $scope.item.tahunpenyakit = datas.tahun;
                        $scope.item.bulanpenyakit = datas.bulan; 
                        $scope.item.jenispelayananpenyakit = datas.jenis; 

                        for (var i=0; i<datas.result.length; i++){
                            $scope.datapenyakit.push({
                                "kd_penyakit": datas.result[i].kddiagnosa,
                                "jumlah": datas.result[i].jumlah
                            })
                        }

                        $scope.sourcePenyakit = new kendo.data.DataSource({
                            data: datas.result,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            model: {
                                  schema: {
                                  fields: {
                                    }
                                }
                            }
                        });

                        $scope.dataExcel = datas.data;
                    })
            }

            $("#kGridPenyakit").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanPasienDaftar.xlsx",
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
                        cells: [{ value: "Pasien Daftar", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        "field": "kddiagnosa",
                        "title": "Kode Penyakit",
                        "width": "50px",
                        "template": "<span class='style-center'>#: kddiagnosa #</span>"
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Nama Penyakit",
                        "width": "100px",
                        "template": "<span class='style-center'>#: namadiagnosa #</span>"
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "50px",
                        "template": "<span class='style-center'>#: jumlah #</span>"
                    }
                ]
            });

            $scope.sendBridgingPenyakit = function(){
                var databridgingpenyakit = {
                                        "data": {
                                            "kd_hospital": "3372052",
                                            "bulan": $scope.item.bulanpenyakit,
                                            "tahun": $scope.item.tahunpenyakit,
                                            "jenis": $scope.item.jenispelayananpenyakit,
                                            "data": $scope.datapenyakit
                                        }
                                    }

                medifirstService.post("registrasi/laporan/send-data-diagnosa-bridging-dinkes", databridgingpenyakit).then(function (dat) {


                })
            }

            $scope.lihatBridgingKebidanan = function(){
                $scope.popUpBridgingKebidanan.center().open();
                var dateStartBridgingKebidanan = new Date()
                dateStartBridgingKebidanan.setMonth(dateStartBridgingKebidanan.getMonth() - 1)
                dateStartBridgingKebidanan.setDate(1)
                dateStartBridgingKebidanan.setHours(0,0,0)
                $scope.item.tglawalpopupKebidanan = dateStartBridgingKebidanan

                 var dateEndBridgingKebidanan = new Date()
                dateEndBridgingKebidanan.setMonth(dateEndBridgingKebidanan.getMonth() - 1)
                dateEndBridgingKebidanan.setDate(31)
                dateEndBridgingKebidanan.setHours(23,59,59)
                $scope.item.tglakhirpopupKebidanan = dateEndBridgingKebidanan

                $scope.listJenisPelayananPopUp = [
                                            {id: 18, jenispelayanan: 'RAJAL'},
                                            {id: 16, jenispelayanan: 'RANAP'}
                                          ]

                $scope.item.jenispelayananpopup = {id: 18, jenispelayanan: 'RAJAL'}
            }

            $scope.lihatBridgingParinatologi = function(){
                $scope.popUpBridgingParinatologi.center().open();
                var dateStartBridgingKebidanan = new Date()
                dateStartBridgingKebidanan.setMonth(dateStartBridgingKebidanan.getMonth() - 1)
                dateStartBridgingKebidanan.setDate(1)
                dateStartBridgingKebidanan.setHours(0,0,0)
                $scope.item.tglawalpopupKebidanan = dateStartBridgingKebidanan

                 var dateEndBridgingKebidanan = new Date()
                dateEndBridgingKebidanan.setMonth(dateEndBridgingKebidanan.getMonth() - 1)
                dateEndBridgingKebidanan.setDate(31)
                dateEndBridgingKebidanan.setHours(23,59,59)
                $scope.item.tglakhirpopupKebidanan = dateEndBridgingKebidanan

                $scope.listJenisPelayananPopUp = [
                                            {id: 18, jenispelayanan: 'RAJAL'},
                                            {id: 16, jenispelayanan: 'RANAP'}
                                          ]

                $scope.item.jenispelayananpopup = {id: 18, jenispelayanan: 'RAJAL'}
            }

            $scope.lihatBridgingTransfusiDarah = function(){
                $scope.popUpBridgingTransfusiDarah.center().open();
            }

            //* BATAS//
        }
    ]);
});


                        
