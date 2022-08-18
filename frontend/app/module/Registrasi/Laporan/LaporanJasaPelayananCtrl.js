define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanJasaPelayananCtrl', ['$scope', 'DateHelper', 'MedifirstService',
        function ($scope, DateHelper, medifirstService) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.isLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            LoadCombo();
            var details = [];
            var tglsbm = 'false';
            $scope.isListDep = false
            $scope.isDep = true
            $scope.isRu = true
            $scope.isPetugas = true
            $scope.isDepPenun = false
            $scope.withDisc = false
            $scope.withOutDisc = true
            var onlyDok = false;
            var notintindakan = false;
            var topenunjang = false;
            var jaskep = false;
            $scope.selectedProdukPelayanan = [];
            $scope.selectedDepartemen = [];
            $scope.selectedDokter = [];
            // var noId='';
            // LoadData();
            // $scope.dataSourceLaporanLayananService = []
            // $scope.item.tglawal = $scope.now;
            // $scope.item.tglakhir = $scope.now;
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.nonbpjs = { id: 153, kelompokpasien: "Non BPJS" };
            // LoadData();
            function LoadCombo() {
                $scope.ListKondisi = [
                    {
                        id: 1,
                        kondisi: "Jam Kerja"
                    }, {
                        id: 2,
                        kondisi: "Luar Jam Kerja"
                    }, {
                        id: 3,
                        kondisi: "Pasien Pulang"
                    }
                ]
                medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
                    var datas = data.data;
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    if ($scope.listKelompokPasien != undefined) {
                        $scope.listKelompokPasien.push($scope.nonbpjs)
                    }
                    $scope.listPegawai = data.data.dokter;
                    $scope.listKelas = data.data.kelas;
                    $scope.listPetugasPel = data.data.petugaspe;
                });

                medifirstService.getPart("registrasi/laporan/get-produk-part", true, true, 20).then(function (data) {
                    $scope.listProduk = data;
                });

            }

            $scope.mainGroupOptLaporanLayananDokter = {
                pageable: {
                    pageSize: 10,
                    // previousNext: false,
                },
                columns: $scope.columnLaporanLayananDokter,
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                    showIndexes: true,
                },

            }
            $scope.LoadData = function () {
                debugger
                var listProduk = []
                if ($scope.selectedProdukPelayanan.length != 0) {
                    var a = ""
                    var b = ""
                    // var array = []
                    for (var i = $scope.selectedProdukPelayanan.length - 1; i >= 0; i--) {
                        var c = $scope.selectedProdukPelayanan[i].id
                        b = "," + c
                        a = a + b
                    }
                    listProduk = a.slice(1, a.length)
                }
                var listDepartemen = []
                if ($scope.selectedDepartemen.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDepartemen.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDepartemen[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDepartemen = a.slice(1, a.length)
                }
                var listDokter = []
                if ($scope.selectedDokter.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDokter.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDokter[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDokter = a.slice(1, a.length)
                }
                var tglSekarang = new moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm')
                var tglAkhir = new moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var dept = "";
                if ($scope.item.departement != undefined)
                    dept = $scope.item.departement.id
                // var deptP = "";
                // if ($scope.item.departementP != undefined)
                //     deptP = $scope.item.departementP.id
                var ruangan = "";
                if ($scope.item.ruangan != undefined || ruangan == null)
                    ruangan = $scope.item.ruangan.id
                var kelompok = "";
                if ($scope.item.namaPenjamin != undefined || kelompok == null)
                    kelompok = $scope.item.namaPenjamin.id
                var dokter = ""
                if ($scope.item.namaDokter != undefined || dokter == null)
                    dokter = $scope.item.namaDokter.id
                var tindakan = ""
                if ($scope.item.produk != undefined || tindakan == null)
                    tindakan = $scope.item.produk.id
                var kondisi = ""
                if ($scope.item.Kondisi != undefined || kondisi == null)
                    kondisi = $scope.item.Kondisi.id
                var kelas = ""
                if ($scope.item.kelas != undefined || kelas == null)
                    kelas = $scope.item.kelas.id
                var petugaspe = ""
                if ($scope.item.PetugasPel != undefined || petugaspe == null)
                    petugaspe = $scope.item.PetugasPel.id
                var penunjang = "";
                if ($scope.item.departementP != undefined)
                    penunjang = $scope.item.departementP.id
                var semua = false
                if ($scope.item.cekpilihSemua == true)
                    semua = true
                $scope.isRouteLoading = true;
                debugger
                $scope.dataSourceLaporanLayananService = medifirstService.get('registrasi/laporan/get-detail-jaspel-cianjur?'
                    + 'tglAwal=' + tglSekarang
                    + '&tglAkhir=' + tglAkhir
                    + '&idDept=' + dept
                    + '&idRuangan=' + ruangan
                    + '&idKelompok=' + kelompok
                    + '&listDepartemen=' + listDepartemen
                    + '&idDokter=' + dokter
                    + '&tindakan=' + tindakan
                    + '&kondisi=' + kondisi
                    + '&kelas=' + kelas
                    + '&PetugasPe=' + petugaspe
                    + '&tglSbm=' + tglsbm
                    + '&listProduk=' + listProduk
                    + '&listDokter=' + listDokter
                    + '&onlyDok=' + onlyDok
                    + '&notInTindakan=' + notintindakan
                    + '&toPenunjang=' + topenunjang
                    + '&Penunjang=' + penunjang
                    + '&jaskep=' + jaskep
                    + '&semua=' + semua
                    // + '&deptP=' + deptP
                ).then(function (dat) {
                    details = dat.data.data;
                    $scope.dataSourceLaporanPelayananDokter = new kendo.data.DataSource({
                        data: dat.data.data,
                        selectable: true,
                        refresh: true,
                        serverPaging: false,
                        // scrollable: false,
                        // pageSize: 5

                    })
                    $scope.isRouteLoading = false;
                });
            }

            $scope.selectProdukPelayanan = {
                dataTextField: "namaproduk",
                dataValueField: "id",
                filter: "contains"
            };

            $scope.selectDepartemen = {
                dataTextField: "departemen",
                dataValueField: "id",
                filter: "contains"
            };

            $scope.selectDokter = {
                dataTextField: "namalengkap",
                dataValueField: "id",
                filter: "contains"
            };

            $scope.JadwalDokter = function () {
                $scope.isRouteLoading = true;
                var tglSekarang = new moment($scope.item.tglawal).format('M')
                var tglAkhir = new moment($scope.item.tglakhir).format('M');
                var bulan = "";
                switch (tglSekarang) {
                    case "1": { bulan = "Januari"; break; }
                    case "2": { bulan = "Februari"; break; }
                    case "3": { bulan = "Maret"; break; }
                    case "4": { bulan = "April"; break; }
                    case "5": { bulan = "Mei"; break; }
                    case "6": { bulan = "Juni"; break; }
                    case "7": { bulan = "Juli"; break; }
                    case "8": { bulan = "Agustus"; break; }
                    case "9": { bulan = "September"; break; }
                    case "10": { bulan = "Oktober"; break; }
                    case "11": { bulan = "November"; break; }
                    case "12": { bulan = "Desember"; break; }
                    default: { bulan = ""; }
                }
                var ruangan = "";
                if ($scope.item.ruangan != undefined || ruangan == null)
                    ruangan = $scope.item.ruangan.id
                var dokter = ""
                if ($scope.item.namaDokter != undefined || dokter == null)
                    dokter = $scope.item.namaDokter.id
                medifirstService.get("registrasi/laporan/get-data-jadwaldokter-lap?"
                    + "namabulan=" + bulan
                    // + '&tglAkhir=' + tglAkhir
                    + '&idDokter=' + dokter, true).then(function (dat) {
                        details = dat.data.data;
                        $scope.winDialog.center().open();
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < details.length; i++) {
                            details[i].no = i + 1
                        }
                        $scope.dataGridDokter = new kendo.data.DataSource({
                            data: dat.data.data,
                            selectable: true,
                            refresh: true,
                            serverPaging: false,
                            // scrollable: false,
                            // pageSize: 5

                        })
                    });
            }

            // $scope.dataSourceLaporanLayanan = [
            //     {no:1, tglpelayanan:'11/01/12',nocm: 111,namapasien:'Sulo',dokter:'Refel', inap:'y', rekanan:'KIS', unit:'1', ruangan:'Melati',layanan:'kasur',tarif:50000+'/hari',jumlah:1,statusbayar:'y'},
            //     {no:2, tglpelayanan:'11/01/12',nocm: 112,namapasien:'Aan',dokter:'Rubi', inap:'y', rekanan:'BPJS', unit:'1', ruangan:'Mawar',layanan:'kasur',tarif:100000+'/hari',jumlah:1,statusbayar:'y'},
            //     {no:3, tglpelayanan:'11/01/14',nocm: 113,namapasien:'Sandi',dokter:'Dhana', inap:'n', rekanan:'Pribadi', unit:'2', ruangan:'Anggrek',layanan:'kasur',tarif:500000+'/hari',jumlah:1,statusbayar:'n'},
            //     {no:4, tglpelayanan:'11/01/16',nocm: 114,namapasien:'Roki',dokter:'Dhana', inap:'y', rekanan:'Asuransi lain', unit:'1',ruangan:'Puspa',layanan:'kasur',tarif:250000+'/hari',jumlah:1,statusbayar:'y'},
            //     {no:5, tglpelayanan:'11/01/18',nocm: 115,namapasien:'Asman',dokter:'Rudi', inap:'n', rekanan:'Pribadi', unit:'1',ruangan:'Melati',layanan:'kasur',tarif:50000+'/hari',jumlah:1,statusbayar:'y'},
            //     {no:6, tglpelayanan:'11/01/20',nocm: 116,namapasien:'Jajang',dokter:'Sukmawan', inap:'y', rekanan:'BPJS', unit:'4',ruangan:'Delima',layanan:'kasur',tarif:100000+'/hari',jumlah:1,statusbayar:'y'},            
            // ]
            $scope.mainGroupOptionsLapLayananDok = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanLayanan.xlsx",
                    allPages: true,
                },
                pageable: {
                    // pageSize: 5,
                    // previousNext: false,
                    messages: {
                        display: "Showing {0} - {1} from {2} data items",
                    },
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Laporan Layanan";

                    var myHeaders = [

                        {
                            value: "Laporan Layanan",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                columns: $scope.columnLaporanLayananDokter,
                // dataSource:$scope.dataSourceLaporanLayanan,            
                selectable: true,
                refresh: true,
                scrollable: false,
                // dataSource: $scope.dataSourceLaporanLayanan2,
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                    showIndexes: true,
                },
            };

            $scope.columnLaporanLayananDokter = [
                {
                    "field": "tglpelayanan",
                    "title": "Tanggal"
                },
                {
                    "field": "nocm",
                    "title": "No. RM"
                },
                {
                    "field": "noregistrasi",
                    "title": "Noregistrasi"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien"
                },
                {
                    "field": "dokter",
                    "title": "Nama Dokter"
                },
                {
                    "field": "jenispetugaspe",
                    "title": "Jenis Petugas"
                },
                {
                    "field": "iddokter",
                    "title": "ID Dokter"
                },
                {
                    "field": "inap",
                    "title": "Inap"
                },
                {
                    "field": "namakelas",
                    "title": "Nama Kelas"
                },
                {
                    "field": "rekanan",
                    "title": "Perusahaan Penjamin"
                },
                {
                    "field": "ruangan",
                    "title": "Ruangan"
                },
                {
                    "field": "layanan",
                    "title": "Layanan"
                },
                {
                    "field": "tarif",
                    "title": "Tarif"
                },
                {
                    "field": "analis",
                    "title": "Saran"
                },
                {
                    "field": "jasars",
                    "title": "Jasa RS",
                    "width": "30px",
                },
                {
                    "field": "penunjangumum",
                    "title": "Penunjang Umum"
                },
                {
                    "field": "jasamedis",
                    "title": "Jasa Medis"
                },
                {
                    "field": "bhp",
                    "title": "BHP"
                },
                {
                    "field": "jasadoklab",
                    "title": "Jasa Dok Lab"
                },
                {
                    "field": "anestesi",
                    "title": "Anestesi"
                },
                {
                    "field": "jasaPerawat",
                    "title": "Jasa Perawat"
                },
                {
                    "field": "perawatAnestesi",
                    "title": "Perawat Anestesi"
                },
                {
                    "field": "radiografer",
                    "title": "Radiografer"
                },
                {
                    "field": "jasaUmum",
                    "title": "Jasa Umum"
                },
                {
                    "field": "perawatBedah",
                    "title": "Perawat Bedah"
                },
                {
                    "field": "jasaDokterUmum",
                    "title": "Jasa Dokter Umum"
                },
                {
                    "field": "ahliGizi",
                    "title": "Ahli Gizi"
                },
                {
                    "field": "pramusaji",
                    "title": "Pramusaji"
                },
                {
                    "field": "jasa",
                    "title": "Jasa"
                },
                {
                    "field": "dokterOperator",
                    "title": "Dokter Operator"
                },
                {
                    "field": "sopir",
                    "title": "Sopir"
                },
                {
                    "field": "penunjangMedis",
                    "title": "Penunjang Medis"
                },
                {
                    "field": "perawatIgd",
                    "title": "Perawat IGD"
                },
                {
                    "field": "perawatRj",
                    "title": "Perawat RJ"
                },
                {
                    "field": "jasaDokterPenunjang",
                    "title": "Jasa Dokter Penunjang"
                },
                {
                    "field": "jasaDokterAnak",
                    "title": "Jasa Dokter Anak"
                }
            ];

            $scope.columnLaporanLayananDokterWithDisc = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "columnLaporanLayananDokterWithDisc.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:N1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Layanan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                // dataBound: onDataBound,
                pageable: true,
                // sortable: true,
                // resizable: true,
                columns: [
                    {
                        "field": "tglpelayanan",
                        "title": "Tanggal"
                    },
                    {
                        "field": "nocm",
                        "title": "No. RM"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien"
                    },
                    {
                        "field": "dokter",
                        "title": "Nama Dokter"
                    },
                    {
                        "field": "iddokter",
                        "title": "ID Dokter"
                    },
                    {
                        "field": "inap",
                        "title": "Inap"
                    },
                    {
                        "field": "namakelas",
                        "title": "Nama Kelas"
                    },
                    {
                        "field": "rekanan",
                        "title": "Perusahaan Penjamin"
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan"
                    },
                    {
                        "field": "layanan",
                        "title": "Layanan"
                    },
                    {
                        "field": "tarif",
                        "title": "Tarif"
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah"
                    },
                    {
                        "field": "statusbayar",
                        "title": "Paid"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Discount"
                    }
                ]
            };

            $scope.columnGridDokter = [
                {
                    "field": "no",
                    "title": "No"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter"
                },
                {
                    "field": "tanggal",
                    "title": "Tanggal"
                },
                {
                    "field": "namahari",
                    "title": "Hari"
                },
                {
                    "field": "namabulan",
                    "title": "Bulanr"
                },
                {
                    "field": "jammasuk",
                    "title": "Jam Masuk"
                },
                {
                    "field": "jampulang",
                    "title": "Jam Pulang"
                }
            ];

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
            //sdm service hanya sementara, nanti harus diganti pake service kasir !!

            // ManageSdm.getItem("service/list-generic/?view=Ruangan&select=id,namaRuangan").then(function(dat) {
            // $scope.listRuangan = dat.data;
            // });

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            // ManageSdm.getItem("service/list-generic/?view=Pegawai&select=id,namaLengkap", true).then(function (dat) {
            //     $scope.listPegawai = dat.data;
            // });
            // ManageSdm.getItem("service/list-generic/?view=KelompokPasien&select=*").then(function(dat) {
            // $scope.listPasien = dat.data;
            // });npm 
            // manageLogistikPhp.getDataTableTransaksi("kasir/laporan-penerimaan-kasir-datacombo", true).then(function(dat){
            //     debugger;
            //     //$scope.listPegawai = dat.data.dataDokter;
            //     $scope.listRuangan = dat.data.dataruangan;
            //     //$scope.listPegawaiKasir = dat.data.datakasir;
            //     //$scope.dataLogin = dat.data.datalogin[0];
            //     $scope.listKelompokPasien = dat.data.datakelompokpasien;
            // });

            $scope.$watch('item.namaPenjamin', function (e) {
                // debugger;
                if (e === undefined) return;
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (data) {
                        $scope.sourceDataRekanan = data.data.rekananan
                        $scope.item.institusiAsalPasien = $scope.sourceDataRekanan;
                    });
                if (e.id == 5 || e.id == 3) {
                    $scope.Perusahaan = true
                } else {
                    $scope.Perusahaan = false
                    $scope.item.institusiAsalPasien = ""
                }
            })

            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [
                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }
            ];

            // debugger;
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.Cetak = function () {
                // if($scope.item.format == undefined){
                // 	alert('format file harus dipilih terlebih dahulu !!!')
                // }
                // debugger;
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                if ($scope.item.namaPenjamin == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.namaPenjamin.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.namaDokter == undefined)
                    var namaPegawai = "";
                else
                    var namaPegawai = $scope.item.namaDokter.id;

                if ($scope.item.produk == undefined)
                    var layanan = "";
                else
                    var layanan = $scope.item.produk.id;
                if ($scope.item.Kondisi == undefined)
                    var kondisi = "";
                else
                    var kondisi = $scope.item.Kondisi.id;
                // if (noId != '') {
                //     var stt = 'false'
                //         if (confirm('View Laporan Rekap Layanan Dokter? ')){
                //             stt='true';
                //         }else {
                //             stt='false'
                //         }
                //         var client = new HttpClient();        
                //              client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-rekaplayanan='+$scope.dataLogin.id+'&tglAwal='+tglawal+'&tglAkhir='+tglakhir+'&idlaporan='+noId+'&strIdDepartement='+departement+'&strIdRuangan='+ruangan+'&strIdKelompokPasien='+kelompokPasien+'&layanan='+layanan+'&strIdPegawai='+namaPegawai+'&view='+ stt, function(response) {
                //                      // http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&idlaporan=PP18070001&strIdDepartement=16&strIdRuangan=18&strIdKelompokPasien=2&strIdPegawai=1&strIdPerusahaan=&view=true

                //         });
                //         noId ='';
                // }else{
                var data2 = details
                var TempData = []
                for (var i = 0; i < data2.length; i++) {
                    // if (details[i].rekananfk != null && details[i].statusbarang == null){
                    TempData.push(data2[i])
                    // }    
                }
                var data =
                {
                    tglawal: tglawal,
                    tglakhir: tglakhir,
                    details: TempData
                }
                medifirstService.post('registrasi/laporan/post-laporan-layanan', data).then(function (e) {
                    $scope.isRouteLoading = false;
                    var noId = e.data.noId
                    var stt = 'false'
                    if (confirm('View Laporan Rekap Layanan Dokter? ')) {
                        stt = 'true';
                    } else {
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-rekaplayanan=' + $scope.dataLogin.id + '&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&idlaporan=' + noId + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&layanan=' + layanan + '&strIdPegawai=' + namaPegawai + '&view=' + stt, function (response) {
                        // http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&idlaporan=PP18070001&strIdDepartement=16&strIdRuangan=18&strIdKelompokPasien=2&strIdPegawai=1&strIdPerusahaan=&view=true                   
                    });
                });

                // }        
            }

            $scope.ceklispilihManual = function (bool) {
                if (bool) {
                    tglsbm = 'true';
                } else {
                    tglsbm = 'false';
                }
            }
            $scope.ceklispilihManual2 = function (bool) {
                if (bool) {
                    $scope.isListDep = true
                    $scope.isDep = false
                    $scope.isRu = false
                    $scope.pilihManual2 = true
                    $scope.item.ruangan = null
                    $scope.item.departement = null
                } else {
                    $scope.isListDep = false
                    $scope.isDep = true
                    $scope.isRu = true
                    $scope.pilihManual2 = false
                    $scope.selectedDepartemen = []
                }
            }
            $scope.ceklispilihManual3 = function (bool) {
                if (bool) {
                    onlyDok = true
                    $scope.isPetugas = false
                } else {
                    onlyDok = false
                    $scope.isPetugas = true
                }
            }
            $scope.ceklispilihManual4 = function (bool) {
                if (bool) {
                    notintindakan = true
                } else {
                    notintindakan = false
                }
            }
            $scope.ceklispilihManual5 = function (bool) {
                if (bool) {
                    topenunjang = true
                    $scope.isRu = false
                    $scope.isDepPenun = true
                } else {
                    if ($scope.isListDep == false) {
                        $scope.isRu = true
                    }
                    $scope.item.departementP = null
                    topenunjang = false
                    $scope.isDepPenun = false
                }
            }
            $scope.ceklispilihManual6 = function (bool) {
                if (bool) {
                    $scope.withDisc = true
                    $scope.withOutDisc = false
                } else {
                    $scope.withDisc = false
                    $scope.withOutDisc = true
                }
            }
            $scope.ceklispilihManual7 = function (bool) {
                if (bool) {
                    jaskep = true
                } else {
                    jaskep = false
                }
            }
            $scope.CetakDetail = function () {
                // if($scope.item.format == undefined){
                //  alert('format file harus dipilih terlebih dahulu !!!')
                // }
                // debugger;
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                if ($scope.item.namaPenjamin == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.namaPenjamin.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.namaDokter == undefined || $scope.item.namaDokter.id == undefined)
                    var namaPegawai = "";
                else
                    var namaPegawai = $scope.item.namaDokter.id;
                if ($scope.item.produk == undefined)
                    var layanan = "";
                else
                    var layanan = $scope.item.produk.id;
                if ($scope.item.Kondisi == undefined)
                    var kondisi = "";
                else
                    var kondisi = $scope.item.Kondisi.id;
                // if (noId != '') {
                //     var stt = 'false'
                //         if (confirm('View Laporan Detail Layanan Dokter? ')){
                //             stt='true';
                //         }else {
                //             stt='false'
                //         }
                //         var client = new HttpClient();        
                //             client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-detaillayanan='+$scope.dataLogin.id+'&tglAwal='+tglawal+'&tglAkhir='+tglakhir+'&idlaporan='+noId+'&strIdDepartement='+departement+'&strIdRuangan='+ruangan+'&strIdKelompokPasien='+kelompokPasien+'&layanan='+layanan+'&strIdPegawai='+namaPegawai+'&view='+ stt, function(response) {
                //                      // http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&idlaporan=PP18070001&strIdDepartement=16&strIdRuangan=18&strIdKelompokPasien=2&strIdPegawai=1&strIdPerusahaan=&view=true
                //              noId ='';
                //         });
                // }else{
                var data2 = details

                var TempData = []
                for (var i = 0; i < data2.length; i++) {
                    // if (details[i].rekananfk != null && details[i].statusbarang == null){
                    TempData.push(data2[i])
                    // }    
                }
                var data =
                {
                    tglawal: tglawal,
                    tglakhir: tglakhir,
                    details: TempData
                }
                medifirstService.post('registrasi/laporan/post-laporan-layanan', data).then(function (e) {
                    $scope.isRouteLoading = false;
                    var noId = e.data.noId
                    var stt = 'false'
                    if (confirm('View Laporan Detail Layanan Dokter? ')) {
                        stt = 'true';
                    } else {
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-detaillayanan=' + $scope.dataLogin.id + '&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&idlaporan=' + noId + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&layanan=' + layanan + '&strIdPegawai=' + namaPegawai + '&view=' + stt, function (response) {
                        // http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&idlaporan=PP18070001&strIdDepartement=16&strIdRuangan=18&strIdKelompokPasien=2&strIdPegawai=1&strIdPerusahaan=&view=true                        
                    });

                });

                // }

            }
        }
    ]);
});