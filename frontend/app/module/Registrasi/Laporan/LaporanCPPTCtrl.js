define(['initialize'], function(initialize) {
    'use strict';
        initialize.controller('LaporanCPPTCtrl', ['$scope', 'DateHelper','$http','$state', 'MedifirstService','CacheHelper',
            function($scope, dateHelper, $http, $state, medifirstService,cacheHelper) {    	
                //Inisial Variable   
                $scope.isRouteLoading = false;
                $scope.item = {};                       
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');   
                $scope.dataSelected = {};
                $scope.item.jmlRows = 50;                     
                $scope.listStatus = [{ id: 1, status: 'BARU' }, { id: 2, status: 'LAMA' }]
                FormLoad();             
                let dataReal = [];
                firstLoad()
                function firstLoad(){
                    medifirstService.get("emr/get-combo").then(function (e) {
                        $scope.listDokter = e.data.dokter
                        $scope.listRuangan = e.data.ruanganrajal
                        $scope.listJenisKelamin = e.data.jeniskelamin
                        $scope.listPenjamin = e.data.rekanan
                    })
                }
                $scope.showAndHide = function () {
                    $('#contentPencarian').fadeToggle("fast", "linear");
                }
    
                function LoadCombo(){
                    // medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {                                                   
                    //     $scope.listRuangan = dat.data.ruanganfarmasi;
                    //     $scope.listDataDokter = dat.data.dokter; 
                    //     $scope.listKelompokPasien = dat.data.kelompokpasien;                    
                    //     $scope.namaLengkap = medifirstService.getPegawaiLogin();
                    // });
                }
    
                function init() {
                    dataReal = []
                    $scope.isRouteLoading = true;
                   
                    var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                    var status = "";
                    if ($scope.item.Status != undefined) {
                        status = "&StatusPasien=" + $scope.item.Status.status;
                    }
                    let filter = ''
                    if ($scope.item.dpjp !=  undefined){
                        filter = '&dokterfk=' + $scope.item.dpjp.id
                    } 
                    medifirstService.get("registrasi/laporan/get-laporan-sudah-isi-cppt-emr-new-2?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        status+ filter
                        , true).then(function (dat) {
                           // Buat objek untuk menyimpan data dari dataHit2
                           let dataHit1 = dat.data.dataHit1
                           let dataHit2 = dat.data.dataHit2
                            // Buat objek untuk menyimpan data dari dataHit2
                            let dataHit2Map = {};

                            // Isi objek dengan data dari dataHit2
                            for (let b = 0; b < dataHit2.length; b++) {
                                let key = dataHit2[b].noregistrasi + '_' + dataHit2[b].namaruangan;
                                dataHit2Map[key] = true;
                            }

                            // Lakukan iterasi pada dataHit1 dan tandai jika ditemukan pasangan yang sama di dataHit2
                            for (let a = 0; a < dataHit1.length; a++) {
                                let key = dataHit1[a].noregistrasi + '_' + dataHit1[a].namaruangan;
                                if (dataHit2Map[key]) {
                                    dataHit1[a].mark = 1;
                                } else {
                                    dataHit1[a].mark = 0; // atau nilai default lainnya jika tidak ditemukan
                                }
                            }

                            let array = []
                            for (let c = 0; c < dataHit1.length; c++) {
                                if (dataHit1[c].mark == 0){
                                    array.push(dataHit1[c])
                                }
                            }
                            let jumlahPerruangan = {};

                            // Iterasi melalui dataHit1 dan hitung jumlah untuk setiap namaruangan
                            for (let c = 0; c < array.length; c++) {
                                let ruangan = array[c].namaruangan;
                                
                                // Jika namaruangan sudah ada di jumlahPerruangan, tambahkan 1
                                if (jumlahPerruangan[ruangan]) {
                                    jumlahPerruangan[ruangan]++;
                                } else {
                                    // Jika belum ada, inisialisasi dengan 1
                                    jumlahPerruangan[ruangan] = 1;
                                }
                            }

                            // Ubah objek jumlahPerruangan menjadi array jika diperlukan
                            let jumlahPerruanganArray = Object.keys(jumlahPerruangan).map(key => ({
                                namaruangan: key,
                                jumlah: jumlahPerruangan[key]
                            }));
                            // debugger
                            let jumlahPerruanganMap = {};
                            for (let i = 0; i < jumlahPerruanganArray.length; i++) {
                                jumlahPerruanganMap[jumlahPerruanganArray[i].namaruangan] = jumlahPerruanganArray[i].jumlah;
                            }
                            
                            // Inisialisasi array dataReal
                            let dataReal = [];
                            
                            // Iterasi dan periksa kesamaan namaruangan

                            for (let i = 0; i < dat.data.data10.length; i++) {
                                let ruanganDitemukan = false;
                                for (let j = 0; j < dat.data.data11.length; j++) {
                                    if (dat.data.data10[i].namaruangan == dat.data.data11[j].namaruangan) {
                                        // Ambil jumlah dari peta
                                        let jmlBelumDiisi = jumlahPerruanganMap[dat.data.data10[i].namaruangan] || 0;

                                        // Push objek ke dataReal
                                        dataReal.push({
                                            namaruangan: dat.data.data10[i].namaruangan,
                                            jmlDokter: dat.data.data11[j].jmlDokter,
                                            jmlPerawat: dat.data.data11[j].jmlPerawat,
                                            jmlPasien: dat.data.data10[i].jmlPasien,
                                            jmlKunj: dat.data.data10[i].jmlKunj,
                                            jmlBelumDiisi: jmlBelumDiisi
                                        });

                                        ruanganDitemukan = true;
                                        break; // Keluar dari loop data11 karena ruangan sudah ditemukan
                                    }
                                }
                                if (!ruanganDitemukan) {
                                    // Ambil jumlah dari peta
                                    // let jmlBelumDiisi = jumlahPerruanganMap[dat.data.data10[i].namaruangan] || 0;

                                    // Push objek ke dataReal dengan jmlDokter dan jmlPerawat = 0
                                    dataReal.push({
                                        namaruangan: dat.data.data10[i].namaruangan,
                                        jmlDokter: 0,
                                        jmlPerawat: 0,
                                        jmlPasien: dat.data.data10[i].jmlPasien,
                                        jmlKunj: dat.data.data10[i].jmlKunj,
                                        jmlBelumDiisi: dat.data.data10[i].jmlKunj
                                    });
                                }
                            }
                            
                            $scope.isRouteLoading = false;
                            var data2 =  dat.data
                            for (var i = 0; i < dataReal.length; i++) {
                                dataReal[i].no = i + 1
                            } 
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: dataReal,
                                schema: {
                                    model: {
                                       
                                    }
                                },
                                pageSize: 200,
                                total: dataReal.length,
                                serverPaging: false,
                               
                            });                        
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
                    cacheHelper.set('LaporanCPPTCtrl', chacePeriode);
    
    
                }
    
                function FormLoad(){                
                   $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                   $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');               
                   LoadCombo();
                }                               
    
                $scope.ClearData = function () {
                   $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                   $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                   $scope.item.ruangan = undefined;
                   $scope.item.kelompokPasien = undefined;
                   $scope.item.dokter = undefined;
                }
    
                $scope.cariFilter = function () {
    
                    init();
                }
    
                $scope.formatRupiah = function(value, currency) {
                    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                }
    
                $scope.formatTanggal = function (tanggal) {
                    return moment(tanggal).format('DD-MM-YYYY');
                }
    
                $scope.formatRupiah = function(value, currency) {
                    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                }
    
                var HttpClient = function() {
                    this.get = function(aUrl, aCallback) {
                        var anHttpRequest = new XMLHttpRequest();
                        anHttpRequest.onreadystatechange = function() { 
                            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                                aCallback(anHttpRequest.responseText);
                        }
    
                        anHttpRequest.open( "GET", aUrl, true );            
                        anHttpRequest.send( null );
                    }
                }                                            
                 
                $scope.columnGrid = {
                    toolbar: [
                        "excel",
    
                    ],
                    excel: {
                        fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 4;
                        sheet.mergedCells = ["A1:M1"];
                        sheet.name = "Report";
    
                        var myHeaders = [{
                            value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                            // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                            fontSize: 18,
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
                            "field": "namaruangan",
                            "title": "Nama Poliklinik",
                            "width": "150px",
                            // "template": "<span class='style-center'>#: namaruangan #</span>",
                        },
                        {
                            "field": "jmlDokter",
                            "title": "Dokter",
                            "width": "50px",
                            // "template": "<span class='style-center'>#: dokter #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"detailDokter(dataItem)\" style=\"margin:0 0 5px\">#: jmlDokter #</button>",
                        },
                        {
                            "field": "jmlPerawat",
                            "title": "Perawat",
                            "width": "50px",
                            // "template": "<span class='style-center'>#: perawat #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"detailPerawat(dataItem)\" style=\"margin:0 0 5px\">#: jmlPerawat #</button>",
                        },
                        // {
                        //     "field": "total",
                        //     "title": "Jumlah Yang Sudah Di isi",
                        //     "width": "50px",
                        //     "template": "<span class='style-center'>#: total #</span>",
                        // },
                        {
                            "field": "jmlBelumDiisi",
                            "title": "Jumlah Belum Diisi",
                            "width": "50px",
                            // "template": "<span class='style-center'>#: totalpasien #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"detailBelumDiisi(dataItem)\" style=\"margin:0 0 5px\">#: jmlBelumDiisi #</button>",
                        },
                        {
                            "field": "jmlPasien",
                            "title": "Jumlah Pasien",
                            "width": "50px",
                            // "template": "<span class='style-center'>#: totalpasien #</span>",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"detailTotal(dataItem)\" style=\"margin:0 0 5px\">#: jmlPasien #</button>",
                        },
                        {
                            "field": "jmlKunj",
                            "title": "Jumlah Pasien kunjungan",
                            "width": "50px",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"detailTotalKunjungan(dataItem)\" style=\"margin:0 0 5px\">#: jmlKunj #</button>",
                        }
                      
                    ]                   
                };
                $scope.detailDokter = function(dataItem) {
                    debugger
                    let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
                    let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
                    let ruangan = dataItem.namaruangan

                    $scope.isRouteLoading = true;
                    let filter = ''
                    if ($scope.item.dpjp !=  undefined){
                        filter = '&dokterfk=' + $scope.item.dpjp.id
                    } 
                    medifirstService.get('emr/get-detail-dokter-cppt-new?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan+filter).then(function(dat) {
                        $scope.isRouteLoading = false;
                        debugger
                        let data = dat.data
                        for(let i = 0; i < data.length; i++) {
                            data[i].no = i + 1;
                        }
                        $scope.dataPasienDetail = new kendo.data.DataSource({
                            data: data,
                            schema: {
                                model: {
                                   
                                }
                            },
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                           
                        });  
                    })
                    $scope.columnPasienDetail = {
                        toolbar: [
                            "excel",
        
                        ],
                        excel: {
                            fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 4;
                            sheet.mergedCells = ["A1:M1"];
                            sheet.name = "Report";
        
                            var myHeaders = [{
                                value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                fontSize: 18,
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
                                "field": "no",
                                "title": "No",
                                "width": "4%",
                                "template": "<span class='style-center'>#: no #</span>",
                            },
                            {
                                "field": "namaruangan",
                                "title": "Nama Poliklinik",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namaruangan #</span>",
                            },
                            {
                                "field": "nocm",
                                "title": "No CM",
                                "width": "6%",
                                "template": "<span class='style-center'>#: nocm #</span>",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "10%",
                                "template": "<span class='style-center'>#: noregistrasi #</span>",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namapasien #</span>",
                            },
                            {
                                "field": "hasilpemeriksaan",
                                "title": "Hasil Pemeriksaan",
                                "width": "50%",
                                "template": "<span class='style-center'>#: hasilpemeriksaan #</span>",
                            },
                            // {
                            //     "field": "namalengkap",
                            //     "title": "Nama Dokter",
                            //     "width": "10%",
                            //     "template": "<span class='style-center'>#: namalengkap #</span>",
                            // }
                          
                        ]                   
                    };
                    $scope.popUpDetail.center().open();
                }
                $scope.detailPerawat = function(dataItem) {
                    debugger
                    let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
                    let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
                    let ruangan = dataItem.namaruangan

                    $scope.isRouteLoading = true;
                    let filter = ''
                    if ($scope.item.dpjp !=  undefined){
                        filter = '&dokterfk=' + $scope.item.dpjp.id
                    } 
                    medifirstService.get('emr/get-detail-perawat-cppt-new?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan+filter).then(function(dat) {
                        $scope.isRouteLoading = false;
                        debugger
                        let data = dat.data
                        for(let i = 0; i < data.length; i++) {
                            data[i].no = i + 1;
                        }
                        $scope.dataPasienDetail = new kendo.data.DataSource({
                            data: data,
                            schema: {
                                model: {
                                   
                                }
                            },
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                           
                        });  
                    })
                    $scope.columnPasienDetail = {
                        toolbar: [
                            "excel",
        
                        ],
                        excel: {
                            fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 4;
                            sheet.mergedCells = ["A1:M1"];
                            sheet.name = "Report";
        
                            var myHeaders = [{
                                value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                fontSize: 18,
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
                                "field": "no",
                                "title": "No",
                                "width": "4%",
                                "template": "<span class='style-center'>#: no #</span>",
                            },
                            {
                                "field": "namaruangan",
                                "title": "Nama Poliklinik",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namaruangan #</span>",
                            },
                            {
                                "field": "nocm",
                                "title": "No CM",
                                "width": "6%",
                                "template": "<span class='style-center'>#: nocm #</span>",
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "10%",
                                "template": "<span class='style-center'>#: noregistrasi #</span>",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namapasien #</span>",
                            },
                            {
                                "field": "hasilpemeriksaan",
                                "title": "Hasil Pemeriksaan",
                                "width": "50%",
                                "template": "<span class='style-center'>#: hasilpemeriksaan #</span>",
                            },
                            // {
                            //     "field": "namalengkap",
                            //     "title": "Nama Dokter",
                            //     "width": "10%",
                            //     "template": "<span class='style-center'>#: namalengkap #</span>",
                            // }
                          
                        ]                   
                    };
                    $scope.popUpDetail.center().open();
                }
                $scope.detailTotal = function(dataItem) {
                    let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
                    let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
                    let ruangan = dataItem.namaruangan
                    let filter = ''
                    if ($scope.item.dpjp !=  undefined){
                        filter = '&dokterfk=' + $scope.item.dpjp.id
                    }
                    medifirstService.get('emr/get-total-pasien-cppt?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan+ filter + '&cpptRj=1').then(function(dat) {
                        debugger
                        let data = dat.data
                        for(let i = 0; i < data.length; i++) {
                            data[i].no = i + 1;
                        }
                        $scope.dataPasienDetailPasien = new kendo.data.DataSource({
                            data: data,
                            schema: {
                                model: {
                                   
                                }
                            },
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                           
                        });  
                    })
                    $scope.columnPasienDetailPasien = {
                        toolbar: [
                            "excel",
        
                        ],
                        excel: {
                            fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 4;
                            sheet.mergedCells = ["A1:M1"];
                            sheet.name = "Report";
        
                            var myHeaders = [{
                                value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                fontSize: 18,
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
                                "field": "no",
                                "title": "No",
                                "width": "4%",
                                "template": "<span class='style-center'>#: no #</span>",
                            },
                            {
                                "field": "namaruangan",
                                "title": "Nama Poliklinik",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namaruangan #</span>",
                            },
                            {
                                "field": "nocm",
                                "title": "No CM",
                                "width": "6%",
                                "template": "<span class='style-center'>#: nocm #</span>",
                                attributes: {
                                    class: "#=isBelumCppt === 'true' ? 'red' : 'hejo2' #"
                                },
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "10%",
                                "template": "<span class='style-center'>#: noregistrasi #</span>",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namapasien #</span>",
                            },
                            // {
                            //     "field": "namalengkap",
                            //     "title": "Nama Dokter",
                            //     "width": "10%",
                            //     "template": "<span class='style-center'>#: namalengkap #</span>",
                            // }
                          
                        ]                   
                    };
                    $scope.popUpDetailPasien.center().open();
                }
                $scope.detailBelumDiisi = function(dataItem) {
                    
                    let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
                    let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
                    let ruangan = dataItem.namaruangan
                    let filter = ''
                    if ($scope.item.dpjp !=  undefined){
                        filter = '&dokterfk=' + $scope.item.dpjp.id
                    } 
                    let param = "&isBelumIsi="+ true
                    medifirstService.get('emr/get-total-pasien-kunjungan?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan+filter+ param).then(function(dat) {
                        
                        let data = dat.data
                        for(let i = 0; i < data.length; i++) {
                            data[i].no = i + 1;
                        }
                        $scope.dataPasienDetailPasienKunjungan = new kendo.data.DataSource({
                            data: data,
                            schema: {
                                model: {
                                   
                                }
                            },
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                           
                        });  
                    })
                    $scope.columnPasienDetailPasienKunjungan = {
                        toolbar: [
                            "excel",
        
                        ],
                        excel: {
                            fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 4;
                            sheet.mergedCells = ["A1:M1"];
                            sheet.name = "Report";
        
                            var myHeaders = [{
                                value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                fontSize: 18,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
        
                            sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                        },
                        selectable: true,
                        pageable: true,
                        columns: [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "4%",
                                "template": "<span class='style-center'>#: no #</span>",
                            },
                            {
                                "field": "nocm",
                                "title": "No CM",
                                "width": "6%",
                                "template": "<span class='style-center'>#: nocm #</span>",
                                attributes: {
                                    class: "#=isBelumCppt === 'true' ? 'red' : 'hejo2' #"
                                },
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "10%",
                                "template": "<span class='style-center'>#: noregistrasi #</span>",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namapasien #</span>",
                            },
                            {
                                "field": "namaruangan",
                                "title": "Nama Poliklinik",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namaruangan #</span>",
                            },
                            {
                                "field": "ruanganasal",
                                "title": "Nama Poliklinik Asal",
                                "width": "10%",
                                "template": "<span class='style-center'>#: ruanganasal #</span>",
                            },     
                            // {
                            //     "field": "namalengkap",
                            //     "title": "Nama Dokter",
                            //     "width": "10%",
                            //     "template": "<span class='style-center'>#: namalengkap #</span>",
                            // }                     
                        ]                   
                    };
                    $scope.popUpDetailPasienKunjungan.center().open();
                }
                $scope.detailTotalKunjungan = function(dataItem) {
                    
                    let tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
                    let tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')
                    let ruangan = dataItem.namaruangan
                    let filter = ''
                    if ($scope.item.dpjp !=  undefined){
                        filter = '&dokterfk=' + $scope.item.dpjp.id
                    } 
                    medifirstService.get('emr/get-total-pasien-kunjungan?tglAwal=' + tglAwal + "&tglAkhir=" + tglAkhir + "&namaruangan=" + ruangan+filter).then(function(dat) {
                        
                        let data = dat.data
                        for(let i = 0; i < data.length; i++) {
                            data[i].no = i + 1;
                        }
                        $scope.dataPasienDetailPasienKunjungan = new kendo.data.DataSource({
                            data: data,
                            schema: {
                                model: {
                                   
                                }
                            },
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                           
                        });  
                    })
                    $scope.columnPasienDetailPasienKunjungan = {
                        toolbar: [
                            "excel",
        
                        ],
                        excel: {
                            fileName: "Laporan Data Poliklinik Sudah isi CPPT.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 4;
                            sheet.mergedCells = ["A1:M1"];
                            sheet.name = "Report";
        
                            var myHeaders = [{
                                value: "PUSAT KEDOKTERAN DAN KESEHATAN POLRI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                // value: "Jl. Raya Bogor, Kramat Jati, Jakarta Timur - 13510 Telp. 021-8093288 / 8090559",
                                fontSize: 18,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
        
                            sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                        },
                        selectable: true,
                        pageable: true,
                        columns: [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "4%",
                                "template": "<span class='style-center'>#: no #</span>",
                            },
                            {
                                "field": "nocm",
                                "title": "No CM",
                                "width": "6%",
                                "template": "<span class='style-center'>#: nocm #</span>",
                                attributes: {
                                    class: "#=isBelumCppt === 'true' ? 'red' : 'hejo2' #"
                                },
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "10%",
                                "template": "<span class='style-center'>#: noregistrasi #</span>",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namapasien #</span>",
                            },
                            {
                                "field": "namaruangan",
                                "title": "Nama Poliklinik",
                                "width": "10%",
                                "template": "<span class='style-center'>#: namaruangan #</span>",
                            },
                            {
                                "field": "ruanganasal",
                                "title": "Nama Poliklinik Asal",
                                "width": "10%",
                                "template": "<span class='style-center'>#: ruanganasal #</span>",
                            },     
                            // {
                            //     "field": "namalengkap",
                            //     "title": "Nama Dokter",
                            //     "width": "10%",
                            //     "template": "<span class='style-center'>#: namalengkap #</span>",
                            // }                     
                        ]                   
                    };
                    $scope.popUpDetailPasienKunjungan.center().open();
                }
    //////////////////////////////////////////////////////////////      BATAS SUCI            /////////////////////////////////////////////////////////////////////////////////////       
            }
        ]);
    });