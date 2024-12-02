define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('AsesmenPengkajianNeonatusRSMDCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'ModelItem',
        function($q, $rootScope, $scope, $state, cacheHelper, medifirstService, ModelItem) {
            $scope.item = {};
            $scope.item.skalaNyeri = 0;
            $scope.skrining = {};
            $scope.dataForm = {};
            $scope.dataFormNyeri = {};
            $scope.dataFormRisiko = {};
            $scope.arrPengkajianSkrining = [];
            $scope.arrPengkajianNyeri = [];
            $scope.arrPengkajianRisiko = [];
            $scope.ItemFRD = {};
            $scope.ItemAnti = {};
            $scope.dataVOloaded = cacheHelper.get('dataVOloaded');
            $scope.now = new Date();
            $scope.item.periodeAwal = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            $scope.PegawaiLogin2 = {};
            var norecSurveilans = ''
            var dataFRD = [];
            var dataAntiBio = [];
            var dataHead = [];
            $scope.item.norecval = [];
            $scope.item.obj=[];
            $scope.NorecSurveilans = "";
            $scope.pasienAnak = {};
            $scope.arrSkriningGiziAnak = [];
            var noRegistrasi = ''
            $scope.isTTP = true
            $scope.noRecPap = cacheHelper.get('noRecPapNew'); // noRecPap
            LoadCacheHelper();
            LoadCombo();
            init()
            
            function LoadCombo() {
                medifirstService.get('emr/get-combo').then(function (dat) {
                    $scope.listPerawat = dat.data.pegawai
                    $scope.listDokter = dat.data.pegawai
                    $scope.listRuangan = dat.data.ruangan
                })

                medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {

                    $scope.listDiagnosa = data;
                });
                 medifirstService.get("rawatinap/get-dokters-combos", false).then(function(data) {
                    $scope.listDokter = data.data.dokter;
                });
            }

           


            function ClearAll() {
                $scope.item = {};
                $scope.ItemFRD = {};
                $scope.ItemAnti = {};
                $scope.gridFRD = new kendo.data.DataSource({
                    data: []
                })
                $scope.gridAntibiotika = new kendo.data.DataSource({
                    data: []
                })
            };

            function LoadCacheHelper() {
                $scope.disableCD = true;
                $scope.disableOperasi = true;
                $scope.disableCU = true;
                $scope.disableCP = true;
                $scope.disableFR = true;
                $scope.IsInfeksi = true;
                // var chacePeriode = cacheHelper.get('cacheRekamMedis');
                // if (chacePeriode != undefined) {
                //     //var arrPeriode = chacePeriode.split(':');
                //     $scope.item.noMr = chacePeriode[0]
                //     nocm_str = chacePeriode[0]
                //     $scope.item.namaPasien = chacePeriode[1]
                //     $scope.item.jenisKelamin = chacePeriode[2]
                //     $scope.item.noregistrasi = chacePeriode[3]
                //     noRegistrasi = chacePeriode[3]
                //     $scope.item.umur = chacePeriode[4]
                //     $scope.item.kelompokPasien = chacePeriode[5]
                //     $scope.item.tglRegistrasi = chacePeriode[6]
                //     norec_apd = chacePeriode[7]
                //     norec_pd = chacePeriode[8]
                //     $scope.item.idKelas = chacePeriode[9]
                //     $scope.item.kelas = chacePeriode[10]
                //     $scope.item.idRuangan = chacePeriode[11]
                //     $scope.item.namaRuangan = chacePeriode[12]
                //     $scope.header.DataNoregis = chacePeriode[13]
                //     if ($scope.header.DataNoregis == undefined) {
                //         $scope.header.DataNoregis = false;
                //     }

                // }
            }


            $scope.showAndHide = function() {
                $('#contentDiagnosa').fadeToggle("fast", "linear");
            }

            $scope.showAndHidee = function() {
                $('#contentDiagnosaa').fadeToggle("fast", "linear");
            }

            $scope.showAndHideee = function() {
                $('#contentDiagnosaaa').fadeToggle("fast", "linear");
            }

            $scope.showAndHideeee = function() {
                $('#contentDiagnosaaaa').fadeToggle("fast", "linear");
            }

            $scope.showAndHideCD = function() {
                $('#contentCD').fadeToggle("fast", "linear");
            }

            $scope.showAndHideOperasi = function() {
                $('#contentOperasi').fadeToggle("fast", "linear");
            }

            $scope.showAndHideAnti = function() {
                $('#contentAnti').fadeToggle("fast", "linear");
            }

            $scope.showAndHideAntii = function() {
                $('#contentAntii').fadeToggle("fast", "linear");
            }

            $scope.showAndHideBio = function() {
                $('#contentBio').fadeToggle("fast", "linear");
            }

            $scope.showAndHideKeb = function() {
                $('#contentKeb').fadeToggle("fast", "linear");
            }

            $scope.showAndHideNutrisi = function() {
                $('#contentNutrisi').fadeToggle("fast", "linear");
            }

            $scope.showAndHidePengkajian = function() {
                $('#contentPengkajian').fadeToggle("fast", "linear");
            }
            $scope.listDataumum = [
                { "id": 1, "nama": "", "detail": 
                    [
                        { "id": 5, "nama": "Nama Anak :" , "type": "textbox","grid":"grid_5"},
                        { "id": 6, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 7, "nama": "Nama Ibu :", "type": "textbox","grid":"grid_5" },
                        { "id": 8, "nama": "Umur:", "type": "textbox","grid":"grid_3" },
                        { "id": 9, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 10, "nama": "Nama Ayah :", "type": "textbox" ,"grid":"grid_5" },
                        { "id": 11, "nama": "Umur", "type": "textbox" ,"grid":"grid_3" },
                        { "id": 12, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 13, "nama": "Alamat :", "type": "textbox","grid":"grid_5" },
                        { "id": 14, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 15, "nama": "Jenis Kelamin :" , "type": "label","grid":"grid_1"},
                        { "id": 16, "nama": "Laki - laki", "type": "checkbox","grid":"grid_1" },
                        { "id": 17, "nama": "Perempuan", "type": "checkbox","grid":"grid_1" },
                        { "id": 18, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 19, "nama": "Berat Badan :", "type": "textbox","grid":"grid_3" },
                        { "id": 20, "nama": "Gram", "type": "label","grid":"grid_1" },
                        { "id": 21, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 22, "nama": "SP02 :", "type": "textbox","grid":"grid_3" },
                        { "id": 22, "nama": "%", "type": "label","grid":"grid_1" },
                        { "id": 23, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 24, "nama": "Panjang Badan :", "type": "textbox","grid":"grid_3" },
                        { "id": 25, "nama": "cm", "type": "label","grid":"grid_1" },
                        { "id": 26, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 27, "nama": "Lingkar Dada :", "type": "textbox","grid":"grid_3" },
                        { "id": 28, "nama": "cm", "type": "label","grid":"grid_1" },
                        { "id": 29, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 30, "nama": "Lingkar Perut :", "type": "textbox","grid":"grid_3" },
                        { "id": 31, "nama": "cm", "type": "label","grid":"grid_1" },
                        { "id": 32, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 33, "nama": "Lingkar kepala", "type": "textbox","grid":"grid_3" },
                        { "id": 34, "nama": "cm", "type": "label","grid":"grid_1" },
                        { "id": 35, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 36, "nama": "Diagnosa Medik :", "type": "textbox","grid":"grid_3" },
                        
                        
                    ]
                },{
                
                    "id": 1, 
                    "nama": "RIWAYAT PERSALINAN",
                    "detail": 
                [
                    { "id": 37, "nama": "G:", "type": "texbox" ,"grid":"grid_1" }, 
                    { "id": 38, "nama": "P:", "type": "texbox" ,"grid":"grid_1" },  
                    { "id": 39, "nama": "A:", "type": "texbox" ,"grid":"grid_1" },  
                    { "id": 40, "nama": "M:", "type": "texbox" ,"grid":"grid_1" }, 
                    { "id": 41, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 42, "nama": "Jenis Peralinan :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 43, "nama": "Spontan", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 44, "nama": "VE", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 45, "nama": "FF", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 46, "nama": "SC", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 47, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 48, "nama": "Ketuban : ", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 49, "nama": "Dipecahkan", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 50, "nama": "Pecah sendiri Jam :", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 51, "nama": "", "type": "textboxtanpalabel" ,"grid":"grid_2" }, 
                    { "id": 52, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 53, "nama": "Kondisi Air ketuban :", "type": "textbox" ,"grid":"grid_6" }, 
                    { "id": 54, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 55, "nama": "Penolong :", "type": "textbox" ,"grid":"grid_6" },
                ]
            }  
        ]

        $scope.listPenyakit = [
            { "id": 1, "nama": "", "detail": 
                [
                { "id": 56, "nama": "Masalah Utaman :", "type": "textarea" ,"grid":"grid_10" }, 
                { "id": 57, "nama": "Tanda dan gejala yang menyertai :", "type": "textarea" ,"grid":"grid_10" },
                { "id": 58, "nama": "Riwayat penyakit :", "type": "textarea" ,"grid":"grid_10" },
                ]
            }
        ]
        $scope.listFisik = [
            {
                "id": 1,
                "nama": "PERNAFASAN",
                "detail": [
                    { "id": 59, "nama": "Spontan :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 60, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 61, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 62, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 63, "nama": "Frekuensi :", "type": "textbox" ,"grid":"grid_3" },  
                    { "id": 64, "nama": "kali/menit", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 65, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 66, "nama": "Oksigen :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 67, "nama": "Nasal", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 68, "nama": "Masker", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 69, "nama": "Kotak oksigen", "type": "checkbox","grid":"grid_1"},
                    { "id": 70, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 71, "nama": "Saturasi oksigen :", "type": "textbox" ,"grid":"grid_3" },
                    { "id": 72, "nama": "%", "type": "label" ,"grid":"grid_1" },
                    { "id": 73, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 74, "nama": "Keadaan saat ini :", "type": "label" ,"grid":"grid_1" },
                    { "id": 75, "nama": "Lendir", "type": "checkbox","grid":"grid_1" },
                    { "id": 76, "nama": "Sesak", "type": "checkbox","grid":"grid_1" },
                    { "id": 77, "nama": "Retraksi", "type": "checkbox","grid":"grid_1" },
                    { "id": 78, "nama": "Sianosis", "type": "checkbox","grid":"grid_1" },
                    { "id": 79, "nama": "Wheezing", "type": "checkbox","grid":"grid_1" },
                    { "id": 80, "nama": "Ronchi", "type": "checkbox","grid":"grid_1" },
                    { "id": 81, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 82, "nama": "Alat bantu nafas :", "type": "label" ,"grid":"grid_1" },
                    { "id": 83, "nama": "ETT", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 84, "nama": "Ventilator", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 85, "nama": "CPAP", "type": "checkbox" ,"grid":"grid_1" },
                ]
            },{
                "id": 1,
                "nama": "SIRKULASI",
                "detail": [
                    { "id": 86, "nama": "Nadi", "type": "textbox" ,"grid":"grid_2" }, 
                    { "id": 87, "nama": "x/Menit :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 88, "nama": "Teratur", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 89, "nama": "Tidak teratur", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 90, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 91, "nama": "Pengisian kembali kapiler", "type": "textbox" ,"grid":"grid_5" }, 
                    { "id": 92, "nama": "detik", "type": "label" ,"grid":"grid_1" },
                    { "id": 93, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 94, "nama": "Ekstremitas :", "type": "label" ,"grid":"grid_1" },
                    { "id": 95, "nama": "Hangat", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 96, "nama": "Dingin", "type": "checkbox","grid":"grid_1" },
                    { "id": 97, "nama": "Sianosis", "type": "checkbox","grid":"grid_1" },
                    { "id": 98, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 99, "nama": "Perdarahan :", "type": "label" ,"grid":"grid_1" },
                    { "id": 100, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 101, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                    { "id": 102, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 103, "nama": "Keadaan saat ini :", "type": "label" ,"grid":"grid_1" },
                    { "id": 104, "nama": "Edma", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 105, "nama": "Lemah", "type": "checkbox","grid":"grid_1" },
                    { "id": 106, "nama": "Pucat", "type": "checkbox","grid":"grid_1" },
                    { "id": 107, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 108, "nama": "Keterangan :", "type": "textbox","grid":"grid_6" }, 
                ]
            },{
                "id": 1,
                "nama": "MAKANAN DAN CAIRAN",
                "detail": [
                    { "id": 109, "nama": "Umur:", "type": "textbox" ,"grid":"grid_2" }, 
                    { "id": 110, "nama": "hari", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 111, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 112, "nama": "Diet:", "type": "textbox" ,"grid":"grid_2" },  
                    { "id": 113, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 114, "nama": "Berat badan lahir", "type": "textbox" ,"grid":"grid_2" },
                    { "id": 115, "nama": "gram", "type": "label" ,"grid":"grid_1" },
                    { "id": 116, "nama": "enter", "type": "enter","grid":"grid_1" },    
                    { "id": 117, "nama": "Berat badan masuk", "type": "textbox" ,"grid":"grid_2" },  
                    { "id": 118, "nama": "gram", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 119, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 120, "nama": "Reflek Menelan :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 121, "nama": "Ada", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 122, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                    { "id": 123, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 124, "nama": "Reflek Routing :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 125, "nama": "Ada", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 126, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                    { "id": 127, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 128, "nama": "Keadan saat ini :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 129, "nama": "Muntah", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 130, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                    { "id": 131, "nama": "Labioschizis", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 132, "nama": "Palatoschizis", "type": "checkbox","grid":"grid_1" },
                    { "id": 133, "nama": "Labioschizis Palatoschizis", "type": "checkbox","grid":"grid_1" },
                    { "id": 134, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 135, "nama": "Abdomen :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 136, "nama": "Supel", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 137, "nama": "Kembung", "type": "checkbox","grid":"grid_1" },
                    { "id": 138, "nama": "Tegang", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 139, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 140, "nama": "Lidah :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 141, "nama": "Lembab", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 142, "nama": "kering", "type": "checkbox","grid":"grid_1" },
                    { "id": 143, "nama": "kotor", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 144, "nama": "Lain-lain", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 145, "nama": "", "type": "textboxtanpalabel" ,"grid":"grid_1" },
                    { "id": 146, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 147, "nama": "Turgor :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 148, "nama": "Baik", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 149, "nama": "Sedang", "type": "checkbox","grid":"grid_1" },
                    { "id": 150, "nama": "Buruk", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 151, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 152, "nama": "Anus :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 153, "nama": "Ada", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 154, "nama": "Tidak ada", "type": "checkbox","grid":"grid_1" },
                    { "id": 155, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 156, "nama": "Keterangan :", "type": "textbox","grid":"grid_6" }, 
                    

                ]
            },{
                "id": 1,
                "nama": "NEUROSENSORI",
                "detail": [
                    { "id": 157, "nama": "Tingkat Kesadaran :", "type": "label" ,"grid":"grid_2" },     
                    { "id": 158, "nama": "Berespon terhadap nyeri", "type": "checkbox" ,"grid":"grid_3" },
                    { "id": 159, "nama": "tidak ada respon terhadap nyeri", "type": "checkbox" ,"grid":"grid_3" },
                    { "id": 160, "nama": "enter", "type": "enter","grid":"grid_1" },  
                    { "id": 161, "nama": "Reflek morro :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 162, "nama": "Baik", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 163, "nama": "Tidak ada", "type": "checkbox","grid":"grid_1" },
                    { "id": 164, "nama": "enter", "type": "enter","grid":"grid_1" },  
                    { "id": 165, "nama": "Tangisan :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 166, "nama": "Kuat", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 167, "nama": "Kurang kuat", "type": "checkbox","grid":"grid_1" },
                    { "id": 168, "nama": "Melengking", "type": "checkbox","grid":"grid_1" },
                    { "id": 169, "nama": "Merintih", "type": "checkbox","grid":"grid_1" },
                    { "id": 170, "nama": "enter", "type": "enter","grid":"grid_1" },  
                    { "id": 171, "nama": "Ubun - ubun :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 172, "nama": "Datar", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 173, "nama": "Cekung", "type": "checkbox","grid":"grid_1" },
                    { "id": 174, "nama": "Cembung", "type": "checkbox","grid":"grid_1" },
                    { "id": 175, "nama": "enter", "type": "enter","grid":"grid_1" },  
                    { "id": 176, "nama": "Pupil :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 177, "nama": "Isokor", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 178, "nama": "Anisokor", "type": "checkbox","grid":"grid_1" },
                    { "id": 179, "nama": "Tidak bereaksi terhadap cahaya", "type": "checkbox","grid":"grid_2" },
                    { "id": 180, "nama": "Dilatasi", "type": "checkbox","grid":"grid_1" },
                    { "id": 181, "nama": "enter", "type": "enter","grid":"grid_1" },   
                    { "id": 182, "nama": "Keterangan :", "type": "textbox","grid":"grid_6" },             
                ]
            },{
                "id": 2,
                "nama": "KEBERSIHAN KULIT",
                "detail": [
                    { "id": 183, "nama": "Warna kulit :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 184, "nama": "Kemerahan", "type": "checkbox" ,"grid":"grid_1" },                     
                    { "id": 185, "nama": "Pucat", "type": "checkbox" ,"grid":"grid_1" },                     
                    { "id": 186, "nama": "Ikterius", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 187, "nama": "enter", "type": "enter","grid":"grid_1" },                     
                    { "id": 188, "nama": "Suhu :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 189, "nama": "Hangat", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 190, "nama": "Dingin", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 191, "nama": "Naik Turun", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 192, "nama": "enter", "type": "enter","grid":"grid_1" },                    
                    { "id": 193, "nama": "Turgor :", "type": "label" ,"grid":"grid_1" },                    
                    { "id": 194, "nama": "Baik", "type": "checkbox" ,"grid":"grid_1" },                    
                    { "id": 195, "nama": "Buruk", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 196, "nama": "enter", "type": "enter","grid":"grid_1" },                     
                    { "id": 197, "nama": "Integritas :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 198, "nama": "Lesi", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 199, "nama": "Mengelupas", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 200, "nama": "Kemerahan", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 201, "nama": "Rash", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 202, "nama": "Utuh", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 203, "nama": "Kering", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 204, "nama": "enter", "type": "enter","grid":"grid_1" },  
                    { "id": 205, "nama": "Kuku :", "type": "label" ,"grid":"grid_1" },
                    { "id": 206, "nama": "Pendek", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 207, "nama": "Panjang", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 208, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 209, "nama": "Kepala :", "type": "label" ,"grid":"grid_1" },
                    { "id": 210, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 211, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 212, "nama": "Bau", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 213, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 214, "nama": "Mata", "type": "textbox" ,"grid":"grid_2" },
                    { "id": 215, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 216, "nama": "Sekret :", "type": "label" ,"grid":"grid_1" },
                    { "id": 217, "nama": "Ada", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 218, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 219, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 220, "nama": "Tali Pusat :", "type": "label" ,"grid":"grid_1" },
                    { "id": 221, "nama": "Ada", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 222, "nama": "Tidak ada", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 223, "nama": "Kering", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 224, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 225, "nama": "Puntung umbilikal :", "type": "label" ,"grid":"grid_1" },
                    { "id": 226, "nama": "Kering", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 227, "nama": "Bau Busuk", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 228, "nama": "Basah", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 229, "nama": "Kemerahan", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 230, "nama": "Pus", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 231, "nama": "enter", "type": "enter","grid":"grid_1" },  
                    { "id": 232, "nama": "Abdomen :", "type": "label" ,"grid":"grid_1" },     
                    { "id": 233, "nama": "Kolostomi", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 234, "nama": "Luka Operasi", "type": "checkbox","grid":"grid_2" },
                    { "id": 235, "nama": "enter", "type": "enter","grid":"grid_1" },   
                    { "id": 236, "nama": "Keterangan :", "type": "textbox","grid":"grid_6" },             
                ]
            },{
                "id": 2,
                "nama": "PEREMPUAN",
                "detail": [
                    { "id": 237, "nama": "Vagina :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 238, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 239, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 240, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 241, "nama": "Peseudo mestruasi", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 242, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 243, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 244, "nama": "enter", "type": "enter","grid":"grid_1" },  
                    { "id": 245, "nama": "kateter", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 246, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 247, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },   
                    { "id": 248, "nama": "enter", "type": "enter","grid":"grid_1" },   
                    { "id": 249, "nama": "Keterangan :", "type": "textbox","grid":"grid_6" },          
                ]
            },{
                "id": 2,
                "nama": "LAKI - LAKI",
                "detail": [
                    { "id": 250, "nama": "Penis :", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 251, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 252, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 253, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 254, "nama": "Prepotium", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 255, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 256, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 257, "nama": "Hipospadia", "type": "label" ,"grid":"grid_1" }, 
                    { "id": 258, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 259, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },   
                    { "id": 260, "nama": "enter", "type": "enter","grid":"grid_1" },   
                    { "id": 261, "nama": "Keterangan :", "type": "textbox","grid":"grid_6" },                  
                ]
            },{
                "id": 2,
                "nama": "ELIMINASI",
                "detail": [
                        { "id": 262, "nama": "BUANG AIR KECIL" , "type": "label","grid":"grid_"}, 
                        { "id": 263, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 264, "nama": "Frekunesi BAK :" , "type": "textbox","grid":"grid_3"}, 
                        { "id": 265, "nama": "x/Hari", "type": "label","grid":"grid_1" },
                        { "id": 266, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 267, "nama": "Keadaan saat ini :", "type": "label","grid":"grid_1" },
                        { "id": 268, "nama": "Retensio Urine", "type": "checkbox","grid":"grid_1" },
                        { "id": 269, "nama": "Inkonstinentia", "type": "checkbox","grid":"grid_1" },
                        { "id": 270, "nama": "Jernih", "type": "checkbox","grid":"grid_1" },
                        { "id": 271, "nama": "Pekat", "type": "checkbox","grid":"grid_1" },
                        { "id": 272, "nama": "Hematuri", "type": "checkbox","grid":"grid_1" },
                        { "id": 273, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 274, "nama": "Buang Air Besar" , "type": "label","grid":"grid_1"},
                        { "id": 275, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 276, "nama": "Anus :", "type": "label","grid":"grid_1" },
                        { "id": 277, "nama": "Ada", "type": "checkbox" ,"grid":"grid_1" },
                        { "id": 278, "nama": "Tidak ada", "type": "checkbox" ,"grid":"grid_1" },
                        { "id": 279, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 280, "nama": "Frekunesi BAB :" , "type": "textbox","grid":"grid_3"}, 
                        { "id": 281, "nama": "x/Hari", "type": "label","grid":"grid_1" },
                        { "id": 282, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 283, "nama": "Keadaan saat ini :", "type": "label","grid":"grid_2" },
                        { "id": 284, "nama": "Kembung", "type": "checkbox","grid":"grid_1" },
                        { "id": 285, "nama": "Konstipasi", "type": "checkbox","grid":"grid_1" },
                        { "id": 286, "nama": "Lain - lain", "type": "checkbox","grid":"grid_1" },
                        { "id": 287, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 288, "nama": "Keterangan :", "type": "textarea","grid":"grid_5" },
                ]        
            },{
            
                "id": 2, 
                "nama": "KEAMANAN / MOBILITAS",
                "detail": 
            [
                { "id": 289, "nama": "Gerakan :", "type": "label" ,"grid":"grid_1" }, 
                { "id": 290, "nama": "Aktif", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 291, "nama": "Tidak Aktif", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 292, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 293, "nama": "Keadan saat ini :", "type": "label" ,"grid":"grid_1" }, 
                { "id": 294, "nama": "Kejang", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 295, "nama": "Lemah", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 296, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 297, "nama": "Keterangan :", "type": "textarea" ,"grid":"grid_5" }, 
            ]
        },{
            
            "id": 2,
            "nama": "RASA NAYAMAN",
            "detail": 
        [
            { "id": 298, "nama": "Saat tidak di sentuh/di sentuh menangis :", "type": "label" ,"grid":"grid_3" }, 
            { "id": 299, "nama": "Keras", "type": "checkbox" ,"grid":"grid_1" },  
            { "id": 300, "nama": "Melengking", "type": "checkbox" ,"grid":"grid_1" },  
            { "id": 301, "nama": "Merintih", "type": "checkbox" ,"grid":"grid_1" },  
            { "id": 302, "nama": "Tidak Menangis", "type": "checkbox" ,"grid":"grid_2" }, 
        ]
    }
    ]
        $scope.listPsikososial = [
            { "id": 1, "nama": "", "detail": 
                [
                { "id": 303, "nama": "Presepsi orang tua terhadap klien saat ini :", "type": "textarea" ,"grid":"grid_12" }, 
                { "id": 304, "nama": "Harapan orang tua terhadap pelayanan keperawatan dan pengobatan saat ini :", "type": "textarea" ,"grid":"grid_12" },
                { "id": 305, "nama": "Keterangan :", "type": "textarea" ,"grid":"grid_12" },
                { "id": 306, "nama": "Curiga penganiayaan/penelantaran :", "type": "label" ,"grid":"grid_2" }, 
                { "id": 307, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 308, "nama": "Ya, Lanjutakan ke 'Asesmen Pasien Korban Kekerasan/Penelantaran ","type": "checkbox" ,"grid":"grid_5" },  

                ]
            }
        ]
    $scope.listSosialekonomi = [
        { "id": 1, "nama": "", "detail": 
            [
                { "id": 309, "nama": "Biaya Perawata :" , "type": "label","grid":"grid_1"}, 
                { "id": 310, "nama": "Pribadi", "type": "checkbox","grid":"grid_1" },
                { "id": 311, "nama": "Tanggungan Perusahaan", "type": "checkbox","grid":"grid_2" },
                { "id": 312, "nama": "Lain - lain :", "type": "checkbox","grid":"grid_1" },
                { "id": 313, "nama": "", "type": "textboxtanpalabel","grid":"grid_2","style": "margin-left: 20px;" },  
                { "id": 314, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 315, "nama": "Status Anak :", "type": "label","grid":"grid_1" },
                { "id": 316, "nama": "Diharapkan", "type": "checkbox","grid":"grid_2" },
                { "id": 317, "nama": "Tidak di harapkan", "type": "checkbox","grid":"grid_2" }, 
                { "id": 318, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 319, "nama": "Orang tua :", "type": "textbox","grid":"grid_5" }, 
                { "id": 320, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 321, "nama": "Berkunjung :", "type": "label","grid":"grid_1" }, 
                { "id": 322, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                { "id": 323, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                { "id": 324, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 325, "nama": "Kontak mata :", "type": "label","grid":"grid_1" }, 
                { "id": 326, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                { "id": 327, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                { "id": 328, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 329, "nama": "Menyentuh :", "type": "label","grid":"grid_1" }, 
                { "id": 330, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                { "id": 331, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                { "id": 332, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 333, "nama": "Berbicara :", "type": "label","grid":"grid_1" }, 
                { "id": 334, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                { "id": 335, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                { "id": 336, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 337, "nama": "Menggendong :", "type": "label","grid":"grid_1" }, 
                { "id": 338, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                { "id": 339, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                { "id": 340, "nama": "enter", "type": "enter","grid":"grid_1" },
                { "id": 341, "nama": "Yang merawat bayi di rumah :", "type": "label","grid":"grid_2" }, 
                { "id": 342, "nama": "Ibu", "type": "checkbox","grid":"grid_1" },
                { "id": 343, "nama": "Ayah", "type": "checkbox","grid":"grid_1" },
                { "id": 344, "nama": "Nenek", "type": "checkbox","grid":"grid_1" },
                { "id": 345, "nama": "Pengasuh", "type": "checkbox","grid":"grid_1" },
            ]
        },{
            "id": 1,
            "nama": "DATA PENUNJANG (Lab, Radiologi, EKG, dll)",
            "detail": 
        [
            { "id": 346, "nama": "", "type": "textarea" ,"grid":"grid_10" }, 
        ]
    }
]
    $scope.listRumus = [
            { "id": 1, "nama": "Rumusan Masalah", "detail": 
                [
                    { "id": 347, "nama": "Pola Nafas tidak", "type": "checkbox","grid":"grid_2" },
                    { "id": 348, "nama": "Bersihan Jalan Nafas ", "type": "checkbox","grid":"grid_2" },
                    { "id": 349, "nama": "Risti perubahan suhu", "type": "checkbox","grid":"grid_2" },
                    { "id": 350, "nama": "Risti infeksi", "type": "checkbox","grid":"grid_2" },
                    { "id": 351, "nama": "Risti cidera", "type": "checkbox","grid":"grid_2" },
                    { "id": 352, "nama": "Perubahan nutrisi", "type": "checkbox","grid":"grid_2" },
                    { "id": 353, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 354, "nama": "", "type": "checkbox","grid":"grid_1" },
                    { "id": 355, "nama": "", "type": "textboxtanpalabel","grid":"grid_1"},
                    { "id": 356, "nama": "", "type": "checkbox","grid":"grid_1" },
                    { "id": 357, "nama": "", "type": "textboxtanpalabel","grid":"grid_1"},
                    { "id": 358, "nama": "", "type": "checkbox","grid":"grid_1" },
                    { "id": 359, "nama": "", "type": "textboxtanpalabel","grid":"grid_1"},

                    { "id": 360, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 361, "nama": "Tanggal", "type": "textbox","grid":"grid_3" },
                    { "id": 362, "nama": "Perawat yang melakukan pengkajian :", "type": "combobox","grid":"grid_6" },

                    { "id": 363, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 364, "nama": "Tanggal", "type": "textbox","grid":"grid_3" },
                    { "id": 365, "nama": "Perawat yang melengkapi pengkajian :", "type": "combobox","grid":"grid_6" },
                ]
            }
        ]

                //421 diagnosa
                

            var getTotal = function(id) {
                var skorAwal = 0;
                var skorTotal = 0;
                if(id == 'a'){
                    $scope.arrNIPS.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor = skorAwal
                    skorTotal += $scope.totalSkor
                }else if(id == 'b'){
                    $scope.arrNIPSb.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor2 = skorAwal
                    skorTotal += $scope.totalSkor2
                } else if(id == 'c'){
                    $scope.arrNIPSc.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor3 = skorAwal
                    skorTotal += $scope.totalSkor3
                } else if(id == 'd'){
                    $scope.arrNIPSd.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor4 = skorAwal
                } else if(id == 'e'){
                    $scope.arrNIPSe.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor5 = skorAwal
                } else if(id == 'f'){
                    $scope.arrNIPSf.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor6 = skorAwal
                }else{
                    $scope.arrNIPSg.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor7 = skorAwal
                }

                jumlahTotal = skorTotal

            };
            $scope.arrNIPS = []; 
            $scope.arrNIPSb = [];
            $scope.arrNIPSc = [];
            $scope.arrNIPSd = [];
            $scope.arrNIPSe = [];
            $scope.arrNIPSf = [];
            $scope.arrNIPSg = [];
            $scope.cekSkor = function(id, idparent, descnilai, value) {
               
                if(id == 'a'){
                    var result = $.grep($scope.arrNIPS, function(e) { 
                        return e.id == id;
                    });
                    var tempData = {
                        "id": id,
                        "idParent": idparent,
                        "descNilai": descnilai,
                        "value": value
                    }
                    if (result.length == 0) {
                        $scope.arrNIPS.push(tempData);
                    } else {
                        var x = true;
                        for (var i = 0; i < $scope.arrNIPS.length; i++){
                            if ( $scope.arrNIPS[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                                $scope.arrNIPS.splice(i, 1);
                                x = false
                                break;
                            }
                        }
                        if(x == true){
                            $scope.arrNIPS.push(tempData);
                        }
                        
                    }
                }else if(id == 'b'){
                    var result = $.grep($scope.arrNIPSb, function(e) { 
                        return e.id == id;
                    });
                    var tempData = {
                        "id": id,
                        "idParent": idparent,
                        "descNilai": descnilai,
                        "value": value
                    }
                    if (result.length == 0) {
                        $scope.arrNIPSb.push(tempData);
                    } else {
                        var x = true;
                        for (var i = 0; i < $scope.arrNIPSb.length; i++){
                            if ( $scope.arrNIPSb[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                                $scope.arrNIPSb.splice(i, 1);
                                x = false
                                break;
                            }
                        }
                        if(x == true){
                            $scope.arrNIPSb.push(tempData);
                        }
                        
                    }
                }else if(id == 'c'){
                    var result = $.grep($scope.arrNIPSc, function(e) { 
                        return e.id == id;
                    });
                    var tempData = {
                        "id": id,
                        "idParent": idparent,
                        "descNilai": descnilai,
                        "value": value
                    }
                    if (result.length == 0) {
                        $scope.arrNIPSc.push(tempData);
                    } else {
                        var x = true;
                        for (var i = 0; i < $scope.arrNIPSc.length; i++){
                            if ( $scope.arrNIPSc[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                                $scope.arrNIPSc.splice(i, 1);
                                x = false
                                break;
                            }
                        }
                        if(x == true){
                            $scope.arrNIPSc.push(tempData);
                        }
                        
                    }
                }else if(id == 'd'){
                    var result = $.grep($scope.arrNIPSd, function(e) { 
                        return e.id == id;
                    });
                    var tempData = {
                        "id": id,
                        "idParent": idparent,
                        "descNilai": descnilai,
                        "value": value
                    }
                    if (result.length == 0) {
                        $scope.arrNIPSd.push(tempData);
                    } else {
                        var x = true;
                        for (var i = 0; i < $scope.arrNIPSd.length; i++){
                            if ( $scope.arrNIPSd[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                                $scope.arrNIPSd.splice(i, 1);
                                x = false
                                break;
                            }
                        }
                        if(x == true){
                            $scope.arrNIPSd.push(tempData);
                        }
                        
                    }
                }else if(id == 'e'){
                    var result = $.grep($scope.arrNIPSe, function(e) { 
                        return e.id == id;
                    });
                    var tempData = {
                        "id": id,
                        "idParent": idparent,
                        "descNilai": descnilai,
                        "value": value
                    }
                    if (result.length == 0) {
                        $scope.arrNIPSe.push(tempData);
                    } else {
                        var x = true;
                        for (var i = 0; i < $scope.arrNIPSe.length; i++){
                            if ( $scope.arrNIPSe[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                                $scope.arrNIPSe.splice(i, 1);
                                x = false
                                break;
                            }
                        }
                        if(x == true){
                            $scope.arrNIPSe.push(tempData);
                        }
                        
                    }
                }else if(id == 'f'){
                    var result = $.grep($scope.arrNIPSf, function(e) { 
                        return e.id == id;
                    });
                    var tempData = {
                        "id": id,
                        "idParent": idparent,
                        "descNilai": descnilai,
                        "value": value
                    }
                    if (result.length == 0) {
                        $scope.arrNIPSf.push(tempData);
                    } else {
                        var x = true;
                        for (var i = 0; i < $scope.arrNIPSf.length; i++){
                            if ( $scope.arrNIPSf[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                                $scope.arrNIPSf.splice(i, 1);
                                x = false
                                break;
                            }
                        }
                        if(x == true){
                            $scope.arrNIPSf.push(tempData);
                        }
                        
                    }
                } else{
                     var result = $.grep($scope.arrNIPSg, function(e) { 
                        return e.id == id;
                    });
                    var tempData = {
                        "id": id,
                        "idParent": idparent,
                        "descNilai": descnilai,
                        "value": value
                    }
                    if (result.length == 0) {
                        $scope.arrNIPSg.push(tempData);
                    } else {
                        var x = true;
                        for (var i = 0; i < $scope.arrNIPSg.length; i++){
                            if ( $scope.arrNIPSg[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                                $scope.arrNIPSg.splice(i, 1);
                                x = false
                                break;
                            }
                        }
                        if(x == true){
                            $scope.arrNIPSg.push(tempData);
                        }
                        
                    }
                }
               
                getTotal(id);
            }
            
            function init() {
                var objectfk = "APNEO";
                var noregistrasifk = $state.params.noRec;
                var status = "t"; 
                medifirstService.get("emr/get-data-rekam-medis?noregistrasifk=" + noregistrasifk + '&objectfk=' + objectfk +
                    '&riwayatfk=' + $scope.noRecPap).then(function(e) {
                    $scope.dataEdukasi = e.data.data;
                    debugger
                    if ($scope.dataEdukasi.length != 0) {
                       for (var i = 0; i < $scope.dataEdukasi.length; i++) { 
                            var res = $scope.dataEdukasi[i].objectfk.substring(8);                                
                            if( $scope.dataEdukasi[i].jenisobject == 'checkbox'){
                                                            
                                var chekedd = false
                                if ($scope.dataEdukasi[i].nilai == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[res] = chekedd
                                $scope.item.norecval[res] = $scope.dataEdukasi[i].norec
                            }else if($scope.dataEdukasi[i].jenisobject == 'combobox'){
                                if(res == 1){
                                    $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , namaruangan:$scope.dataEdukasi[i].nilai} 
                                }else{
                                     $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , namalengkap:$scope.dataEdukasi[i].nilai}  
                                } 
                                $scope.item.norecval[res] = $scope.dataEdukasi[i].norec 
                          
                            }else{
                                $scope.item.obj[res] =  $scope.dataEdukasi[i].nilai
                                    $scope.item.norecval[res] = $scope.dataEdukasi[i].norec
                            }                            
                         } 
                    }
                })
            }




            $scope.batalFRD = function() {
                ClearDataFRD();
                $scope.popUpFRD.close();
            }


             $scope.$watch('item.obj[422]', function(nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[114] = true
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = true
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = true
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                 if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = true
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = true
                    $scope.item.obj[119] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = true
                }
            });
              $scope.getSkalaNyeri = function(data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[114] = true
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = true
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = true
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                 if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = true
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = true
                    $scope.item.obj[119] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[114] = false
                    $scope.item.obj[115] = false
                    $scope.item.obj[116] = false
                    $scope.item.obj[117] = false
                    $scope.item.obj[118] = false
                    $scope.item.obj[119] = true
                }

            }
           

            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "tglsurveilans",
                        "title": "Tgl Input",
                        "width": "85px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglsurveilans #')}}</span>"
                    },
                    {
                        "field": "nosurvailens",
                        "title": "Id Surveilans",
                        "width": "85px"
                    },
                    {
                        "field": "nocmregis",
                        "title": "No RM / Noregistrasi",
                        "width": "120px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px"
                    }
                ]
            };

           

            $scope.back = function() {
                window.history.back();
            }

            $scope.Batal = function() {}

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
                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }






            $scope.Simpan = function() {
                debugger;
                 if ($state.params.noRec == undefined) {
                    window.messageContainer.error("Pilih Pasien Dahulu!");
                    return;
                }
                 var arrobj = Object.keys($scope.item.obj)
                var arrSave = [];
                var tempData = [];
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if(typeof $scope.item.obj[parseInt(arrobj[i])] === 'string') {
                        
                        var nilai = $scope.item.obj[parseInt(arrobj[i])];
                        var jenis = "textbox"
                        var satuan = "-"
                         
                    }else if (typeof $scope.item.obj[parseInt(arrobj[i])] === 'boolean'){
                          var nilai = $scope.item.obj[parseInt(arrobj[i])];
                        var jenis = "checkbox"
                        var satuan = "-"
                       
                    }else{
                        var nilai = $scope.item.obj[parseInt(arrobj[i])].namaruangan;
                        if(nilai == undefined){
                            nilai = $scope.item.obj[parseInt(arrobj[i])].namalengkap;
                        }
                        var jenis = "combobox"
                        var satuan = $scope.item.obj[parseInt(arrobj[i])].id;
                    }
                    var urutan = arrobj[i]
                    var object = "APNEO000"+urutan  
                    // var norectmp = "APNEO000"+urutan    
                    var tmpDataEdukasi = {
                        norec: null,
                        objectfk: object,
                        nilai:  nilai,
                        satuan:satuan,
                        jenisobject: jenis
                    }
                    tempData.push(tmpDataEdukasi);                   
                }
                debugger;
                

                for (var i = tempData.length - 1; i >= 0; i--) {
                    if (tempData[i].nilai == undefined) {
                        tempData.splice([i], 1)
                    }
                    if (tempData[i].norec == undefined) {
                        tempData[i].norec = '-'
                    }
                }

                var jsonSave = {
                    data: tempData,
                    noregistrasifk: $state.params.noRec,
                    riwayatpapfk: $scope.noRecPap,
                    objecthead: "APNEO"
                }
                medifirstService.post('emr/save-data-rekam-medis', jsonSave).then(function(e) {
                    $scope.currentStatus = [];
                    
                    // MedifirstService.post('Pengkajian Keperawatan', 'Norec Antrian Pasien Diperiksa', $state.params.noRec, 'Pengkajian Keperawatan Kupang').then(function(res) {})
                });
            }

            $scope.Batal = function() {
                ClearAll();
                $scope.myVar = 1;
            }

            $scope.klikChange = function(data, stat) {
                ;
                // $scope.pasienDewasa.perluKonsultasi.detail.forEach(function(items){
                // 	items.value = null
                // })
                // stat.value = "true";
                var result = $.grep($scope.arrPengkajianSkrining, function(e) {
                    return e.idParent == data.id;
                });
                var tempData = {
                    "id": stat.id,
                    "idParent": data.id,
                    "descNilai": stat.descNilai,
                    "namaDetail": stat.namaDetail,
                    "value": "true"
                }
                if (result.length == 0) {
                    ;
                    $scope.arrPengkajianSkrining.push(tempData);
                    // console.log(JSON.stringify($scope.arrayDetilPengkajianAwal));
                } else {
                    for (var i = 0; i < $scope.arrPengkajianSkrining.length; i++)
                        if ($scope.arrPengkajianSkrining[i].idParent && $scope.arrPengkajianSkrining[i].idParent === data.id) {
                            $scope.arrPengkajianSkrining.splice(i, 1);
                            break;
                        }
                    $scope.arrPengkajianSkrining.push(tempData);
                    console.log(JSON.stringify($scope.arrPengkajianSkrining));
                    ;
                }
            }


            //***********************************
        }
    ]);
});