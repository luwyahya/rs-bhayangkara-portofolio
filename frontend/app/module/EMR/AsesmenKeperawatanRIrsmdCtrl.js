define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('AsesmenKeperawatanRIrsmdCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'ModelItem',
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
                { "id": 1, "nama": "Data Umum", "detail": 
                    [
                        { "id": 5, "nama": "Tgl Masuk" , "type": "textbox","grid":"grid_6"}, 
                        { "id": 6, "nama": "pendidikan", "type": "textbox","grid":"grid_6" },
                        { "id": 7, "nama": "Tgl/Jam Pengkajian", "type": "textbox","grid":"grid_6" },
                        { "id": 8, "nama": "Pekerjaan", "type": "textbox","grid":"grid_6" },
                        { "id": 9, "nama": "Diagnosa mediak", "type": "diagnosa" },
                        { "id": 10, "nama": "berat badan", "type": "textbox","grid":"grid_6" },
                        { "id": 11, "nama": "Jenis Kelamin", "type": "label","grid":"grid_2" },
                        { "id": 12, "nama": "Laki-laki", "type": "checkbox","grid":"grid_2" },
                        { "id": 13, "nama": "Perempuan", "type": "checkbox","grid":"grid_2" },
                        { "id": 14, "nama": "Tinggi Badan", "type": "textbox","grid":"grid_6" },                        
                        { "id": 15, "nama": "Status Perkawinan", "type": "label","grid":"grid_2" },
                        { "id": 16, "nama": "Kawin", "type": "checkbox","grid":"grid_1" },
                        { "id": 17, "nama": "Tidak Kawin", "type": "checkbox","grid":"grid_1" },
                        { "id": 18, "nama": "Duda/Janda", "type": "checkbox","grid":"grid_2" },
                        { "id": 20, "nama": "Agama", "type": "textbox","grid":"grid_6" },
                        { "id": 21, "nama": "Alamat", "type": "textbox","grid":"grid_6" },
                        { "id": 22, "nama": "Kondisi saat masuk", "type": "label","grid":"grid_2" },
                        { "id": 23, "nama": "Mandiri", "type": "checkbox","grid":"grid_1" },
                        { "id": 24, "nama": "Kursi Roda", "type": "checkbox","grid":"grid_1" },
                        { "id": 25, "nama": "Dipapah", "type": "checkbox","grid":"grid_1" },
                        { "id": 26, "nama": "Tempat tidur", "type": "checkbox","grid":"grid_1" },                        
                        { "id": 27, "nama": "Lainya", "type": "textbox","grid":"grid_6" },
                        { "id": 28, "nama": "No telp", "type": "textbox","grid":"grid_6" },                
                        { "id": 29, "nama": "Data diperolehdari", "type": "label","grid":"grid_2" },
                        { "id": 30, "nama": "pasien", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 31, "nama": "orang lain", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 32, "nama": "enter", "type": "enter","grid":"grid_1" },  
                        { "id": 33, "nama": "Yang dapat dihubungi", "type": "textbox","grid":"grid_6" },  
                        { "id": 34, "nama": "enter", "type": "enter","grid":"grid_1" },  
                        { "id": 35, "nama": "Hubungan", "type": "textbox","grid":"grid_6" },   
                        { "id": 36, "nama": "Asal Pasien", "type": "label","grid":"grid_1" },
                        { "id": 37, "nama": "Poliklinik", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 38, "nama": "IGD", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 39, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                        { "id": 40, "nama": "No telp pj", "type": "textbox","grid":"grid_6" },  
                        { "id": 41, "nama": "Bahasa yang digunakan", "type": "textbox","grid":"grid_6" },  
                    ]
                }
            ]
             $scope.listAnamnesis1 = [
                { "id": 1, "nama": "Data Umum", "detail": 
                    [
                        { "id": 42, "nama": "Keluhan" , "type": "textarea","grid":"grid_12"}, 
                        { "id": 43, "nama": "Keluhan yang menyertai" , "type": "textarea","grid":"grid_12"}, 
                        { "id": 44, "nama": "Riwayat Penyakit Sekarang" , "type": "textarea","grid":"grid_12"}, 
                        { "id": 45, "nama": "Riwayat Alergi", "type": "label","grid":"grid_1" },
                        { "id": 46, "nama": "Tidak ada", "type": "checkbox","grid":"grid_2" },
                        { "id": 47, "nama": "Makanan", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 48, "nama": "", "type": "textboxtanpalabel","grid":"grid_2","style": "margin-left: 20px;" },  
                        { "id": 49, "nama": "Obat", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 50, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },  
                        { "id": 51, "nama": "Reaksi", "type": "textbox","grid":"grid_12" },                          
                        { "id": 52, "nama": "Riwayat penyakit dahulu:", "type": "label","grid":"grid_12" }, 
                        { "id": 53, "nama": "Penyakit jantung", "type": "checkbox","grid":"grid_3" },  
                        { "id": 54, "nama": "TB", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 55, "nama": "Ginjal", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 56, "nama": "Gangguan Jiwa", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 57, "nama": "Kanker", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 58, "nama": "Stroke", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 59, "nama": "Asma", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 60, "nama": "Gangguan Hematologi", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 61, "nama": "Hipertensi", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 62, "nama": "Infark", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 63, "nama": "Hepatitis", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 64, "nama": "Miokard", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 65, "nama": "Lain-lain:", "type": "checkbox","grid":"grid_4" }, 
                        { "id": 66, "nama": "", "type": "textboxtanpalabel","grid":"grid_9" },           
                        { "id": 67, "nama": "Riwayat imunokompromais", "type": "label","grid":"grid_12" }, 
                        { "id": 68, "nama": "Infeksi telinga baru sebanyak 8 (delapan) kali atau lebih dalam setahun", "type": "checkbox","grid":"grid_12" },
                        { "id": 69, "nama": "Infeksi berat pada sinus sebanyak 2 (dua) kali atau lebih dalam setahun", "type": "checkbox","grid":"grid_12" },
                        { "id": 70, "nama": "Penggunaan antibiotika tanpa dampak selama 2 (dua) bulan atau lebih", "type": "checkbox","grid":"grid_12" },
                        { "id": 71, "nama": "Pneumonia sebanyak 2 (dua) kali atau lebih dalam setahun", "type": "checkbox","grid":"grid_12" },
                        { "id": 72, "nama": "Adanya abses dalam atau berulang pada kulit atau organ lainnya", "type": "checkbox","grid":"grid_12" },
                        { "id": 73, "nama": "Adanya sariawan yang menetap atau luka pada kulit", "type": "checkbox","grid":"grid_12" },
                        { "id": 74, "nama": "Memerlukan antibiotika intravena untuk infeksi", "type": "checkbox","grid":"grid_12" },
                        { "id": 75, "nama": "Terdapat 2 (dua) atau lebih infeksi dalam (misalnya meningitis, osteomielitis, selulitis, sepsis)", "type": "checkbox","grid":"grid_12" },
                        { "id": 76, "nama": "Adanya riwayat keluarga terhadap imunodefisiensi primer", "type": "checkbox","grid":"grid_12" },
                        { "id": 77, "nama": "Adanya infeksi yang tidak berespon dengan terapi antibiotika", "type": "checkbox","grid":"grid_12" },
                        { "id": 78, "nama": "Adanya proses pemulihan yang terlambat atau tak sempurna", "type": "checkbox","grid":"grid_12" },
                        { "id": 79, "nama": "Adanya jenis kanker (misalnya sarkoma Kaposi atau limfoma Non-Hodgkins)", "type": "checkbox","grid":"grid_12" },
                        { "id": 80, "nama": "Adanya infeksi oportunistik (misalnya pneumonia Pneumocystis carinii atau infeksi jamur berulang)", "type": "checkbox","grid":"grid_12" },
                        { "id": 81, "nama": "Jika ada satu yang dicentang, lanjut ke 'Asesmen Pasien dengan Daya Imun yang Dilemahkan.Imunosupresi(RM.C.24)'", "type": "label","grid":"grid_12" }, 
                        { "id": 82, "nama": "Riwayat penyakit keluarga", "type": "label","grid":"grid_12" },  
                        { "id": 83, "nama": "Penyakit jantung ", "type": "checkbox","grid":"grid_3" },  
                        { "id": 84, "nama": "TB ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 85, "nama": "Ginjal ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 86, "nama": "Gangguan Jiwa ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 87, "nama": "Kanker ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 88, "nama": "Stroke ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 89, "nama": "Asma ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 90, "nama": "Gangguan Hematologi ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 91, "nama": "Hipertensi ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 92, "nama": "Infark ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 93, "nama": "Hepatitis ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 94, "nama": "Miokard ", "type": "checkbox","grid":"grid_3" }, 
                        { "id": 95, "nama": "Lain-lain: ", "type": "checkbox","grid":"grid_4" }, 
                         { "id": 96, "nama": "Pernah dirawat:", "type": "label","grid":"grid_2" },                           
                        { "id": 97, "nama": "ya  ", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 98, "nama": "tidak  ", "type": "checkbox","grid":"grid_1" },
                        { "id": 99, "nama": "", "type": "enter","grid":"grid_1" }, 
                        { "id": 100, "nama": "Kapan", "type": "textbox","grid":"grid_4" },  
                        { "id": 101, "nama": "Dimana", "type": "textbox","grid":"grid_4" },  
                        { "id": 102, "nama": "Sakit Apa", "type": "textbox","grid":"grid_4" },  
                        
                         { "id": 103, "nama": "Pernah dioperasi:", "type": "label","grid":"grid_2" },                           
                        { "id": 104, "nama": "ya   ", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 105, "nama": "tidak   ", "type": "checkbox","grid":"grid_1" },
                        { "id": 106, "nama": "", "type": "enter","grid":"grid_1" }, 
                        { "id": 107, "nama": "Kapan ", "type": "textbox","grid":"grid_4" },  
                        { "id": 108, "nama": "Dimana ", "type": "textbox","grid":"grid_4" },  
                        { "id": 109, "nama": "Sakit Apa ", "type": "textbox","grid":"grid_4" },  
                  
                    ]
                }
            ]
             $scope.listNyeriAnak = [{
                "id": 10,
                "nama": "Hurts",
                "detail": [{ "id": 110, "nama": "No Hurt", "descNilai": 4 },
                    { "id": 111, "nama": "Hurts Little Bit", "descNilai": 6 }, { "id": 3, "nama": "Hurts Little More", "descNilai": 0 },
                    { "id": 112, "nama": "Hurts Even More", "descNilai": 8 }, { "id": 5, "nama": "Hurts Whole Lot", "descNilai": 2 },
                    { "id": 113, "nama": "Hurts whorts", "descNilai": 10 }
                ]
            }]
              $scope.listSkorWong = [{
                "id": 119,
                "nama": "Score ",
                "detail": [
                    { "id": 114, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                    { "id": 115, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                    { "id": 116, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
                    { "id": 117, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
                    { "id": 118, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
                    { "id": 119, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
                ]
            }]

             $scope.listkesadaran = [
                { "id": 1, "nama": "Kesadaran", "detail": 
                    [ 
                        { "id": 120, "nama": "Kesadaran", "type": "label","grid":"grid_2" },  
                        { "id": 121, "nama": "CM", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 122, "nama": "Apatis", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 123, "nama": "Somnolent", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 124, "nama": "Soporous", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 125, "nama": "Koma", "type": "checkbox","grid":"grid_1" }, 
                      
                    ]
                }
            ]
             $scope.listFisik = [{
                "id": 4,
                "nama": "Kepala",
                "detail": [
                    { "id": 126, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 127, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 128, "nama": "Haematom lokasi", "type": "checkbox" ,"grid":"grid_3" },  
                    { "id": 129, "nama": " ", "type": "textboxtanpalabel","grid":"grid_2" }, 
                    { "id": 130, "nama": "lesi, lokasi", "type": "checkbox","grid":"grid_2" },  
                    { "id": 131, "nama": " ", "type": "textboxtanpalabel","grid":"grid_2" }
                ]
            },{
                "id": 5,
                "nama": "Rambut",
                "detail": [
                   { "id": 132, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 133, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 134, "nama": "Berminyak", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 135, "nama": "Kering", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 136, "nama": "Rontok", "type": "checkbox" ,"grid":"grid_1" },                 
                ]
            },{
                "id": 5,
                "nama": "Muka",
                "detail": [
                   { "id": 137, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 138, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_1" },                 
                ]
            },{
                "id": 5,
                "nama": "Mata",
                "detail": [
                   { "id": 139, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 140, "nama": "Gangguan Penglihatan", "type": "checkbox" ,"grid":"grid_3" },                     
                    { "id": 141, "nama": "Sklera Ikterik", "type": "checkbox" ,"grid":"grid_2" },                     
                    { "id": 142, "nama": "Konjungtiva merah", "type": "checkbox" ,"grid":"grid_3" },                     
                    { "id": 143, "nama": "Konjungtiva Anemis", "type": "checkbox" ,"grid":"grid_3" },   
                    { "id": 144, "nama": "enter", "type": "enter","grid":"grid_1" },                    
                    { "id": 145, "nama": "Pupil :", "type": "checkbox" ,"grid":"grid_2" },                    
                    { "id": 146, "nama": "Anisokor ", "type": "checkbox" ,"grid":"grid_2" },                    
                    { "id": 147, "nama": "Midriasis ", "type": "checkbox" ,"grid":"grid_2" },                    
                    { "id": 148, "nama": "Miosis", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 149, "nama": "enter", "type": "enter","grid":"grid_1" },    
                     { "id": 150, "nama": "Refleksi Cahaya :", "type": "checkbox" ,"grid":"grid_2" },                    
                    { "id": 151, "nama": "Positif ", "type": "checkbox" ,"grid":"grid_1" },                    
                    { "id": 152, "nama": "Negatif ", "type": "checkbox" ,"grid":"grid_1" },                     
                ]
            },{
                "id": 5,
                "nama": "Telinga",
                "detail": [
                   { "id": 153, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 154, "nama": "Berdengung", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 155, "nama": "Penurunan Pendengaran", "type": "checkbox" ,"grid":"grid_3" }, 
                    { "id": 156, "nama": "Keluar Cairan", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 157, "nama": "Serumen", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 158, "nama": "Nyeri", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 159, "nama": "Memakai alat bantu dengar", "type": "checkbox" ,"grid":"grid_3" },                 
                ]
            },{
                "id": 5,
                "nama": "Hidung",
                "detail": [
                   { "id": 160, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 161, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 162, "nama": "Epistaksis", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 163, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" },                
                ]
            },{
                "id": 5,
                "nama": "Mulut",
                "detail": [
                   { "id": 164, "nama": "Simetrsis ", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 165, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 166, "nama": "Pucat", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 167, "nama": "Sianosis", "type": "checkbox" ,"grid":"grid_1" }               
                ]
            },{
                "id": 5,
                "nama": "Gigi",
                "detail": [
                   { "id": 168, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 169, "nama": "Karies", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 170, "nama": "Goyang", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 171, "nama": "Tambal", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 172, "nama": "Gigi Palsu", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 173, "nama": "Geraham Asiemtris", "type": "checkbox" ,"grid":"grid_3" },
                    { "id": 174, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" },                 
                ]
            },{
                "id": 5,
                "nama": "Lidah",
                "detail": [
                   { "id": 175, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 176, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 177, "nama": "Mukosa Kering", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 178, "nama": "Deviasi Lateral/Asimetris", "type": "checkbox" ,"grid":"grid_3" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Tenggorokan",
                "detail": [
                   { "id": 179, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 180, "nama": "Faring merah", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 181, "nama": "Sakit menelan", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 182, "nama": "Tonsil membesar", "type": "checkbox" ,"grid":"grid_2" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Leher",
                "detail": [
                   { "id": 183, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 184, "nama": "Pembesaran Tiroid", "type": "checkbox" ,"grid":"grid_3" }, 
                    { "id": 185, "nama": "Bendungan vena jugularis", "type": "checkbox" ,"grid":"grid_3" }, 
                    { "id": 186, "nama": "Kaku kuduk", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 187, "nama": "Keterbatasan", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 188, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Dada",
                "detail": [
                   { "id": 189, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 190, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 191, "nama": "Retraksi", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 192, "nama": "Ronchi", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 193, "nama": "Rales", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 194, "nama": "Wheezing", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 195, "nama": "Murmur", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 196, "nama": "Nyeri Dada", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 197, "nama": "Aritmia", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 198, "nama": "Takikardia", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 199, "nama": "Bradikardia", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 200, "nama": "Palpitasi", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 201, "nama": "Lain-lai", "type": "textbox" ,"grid":"grid_4" }, 
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Abdomen",
                "detail": [
                   { "id": 202, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 203, "nama": "Kembung", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 204, "nama": "Ascites", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 205, "nama": "Benjnolan/masa", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 206, "nama": "Lokasi", "type": "textboxt" ,"grid":"grid_1" },  
                    { "id": 207, "nama": "Bising usus", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 208, "nama": "", "type": "textboxtanpalabel" ,"grid":"grid_2" },  
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Genetalia, Anus dan Rectum :",
                "detail": [
                   
                ]
            },{
                "id": 5,
                "nama": "Wanita",
                "detail": [
                   { "id": 209, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 210, "nama": "sekret", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 211, "nama": "warna", "type": "textbox" ,"grid":"grid_3" },  
                    { "id": 212, "nama": "Porlaps uteri", "type": "checkbox" ,"grid":"grid_2" },  
                    { "id": 213, "nama": "Fistual anal", "type": "textbox" ,"grid":"grid_5" },  
                    { "id": 214, "nama": "Haemoroid", "type": "checkbox" ,"grid":"grid_3" }, 
                    { "id": 215, "nama": "Hamil", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 216, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 217, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 218, "nama": "Menopause", "type": "checkbox" ,"grid":"grid_3" },  
                    { "id": 219, "nama": "Menstruasi terakhir", "type": "textbox" ,"grid":"grid_10" },                      
                    { "id": 220, "nama": "Keluhan menstruasi", "type": "checkbox" ,"grid":"grid_3" },             
                    { "id": 221, "nama": "tidak", "type": "checkbox" ,"grid":"grid_1" },             
                    { "id": 222, "nama": "ya,sebutkan", "type": "textbox" ,"grid":"grid_4" },       
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Pria",
                "detail": [
                   { "id": 223, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 224, "nama": "Phimosis", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 225, "nama": "Hernia", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 226, "nama": "Haemoroid", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 227, "nama": "Orchitis", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 228, "nama": "Sekret warna", "type": "textbox" ,"grid":"grid_5" }, 
                    
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Integumen",
                "detail": [
                   { "id": 229, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 230, "nama": "Turgor Jelek", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 231, "nama": "Dingin", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 232, "nama": "Bullae", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 233, "nama": "Fistula", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 234, "nama": "Iketrik", "type": "checkbox" ,"grid":"grid_1" },  
                   { "id": 235, "nama": "Diofersi", "type": "checkbox" ,"grid":"grid_2" },  
                   { "id": 236, "nama": "Pucat", "type": "checkbox" ,"grid":"grid_1" },  
                   { "id": 237, "nama": "Dekubitus,Derajat", "type": "textbox" ,"grid":"grid_6" }, 
                   { "id": 238, "nama": "Lokasi", "type": "textbox" ,"grid":"grid_6" }, 
                   { "id": 3007, "nama": "", "type": "enter","grid":"grid_12" },
                   { "id": 239, "nama": "Luka : ", "type": "label" ,"grid":"grid_1" }, 
                   { "id": 240, "nama": "Tidak ada", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 241, "nama": "Lokasi", "type": "textbox" ,"grid":"grid_9" },
                   { "id": 3008, "nama": "", "type": "enter","grid":"grid_12" },  
                   { "id": 242, "nama": "Kondisi :", "type": "label" ,"grid":"grid_1" }, 
                   { "id": 243, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 244, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },  
                   { "id": 245, "nama": "jahitan luka", "type": "checkbox" ,"grid":"grid_2" },  
                   { "id": 246, "nama": "ada", "type": "checkbox" ,"grid":"grid_1" },  
                   { "id": 247, "nama": "tidak ada", "type": "checkbox" ,"grid":"grid_2" },
                   { "id": 248, "nama": "Balutan", "type": "label" ,"grid":"grid_1" }, 
                   { "id": 249, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 250, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },   
                    
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Extremitas",
                "detail": [
                   { "id": 251, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 252, "nama": "Kelemahan otot", "type": "checkbox" ,"grid":"grid_3" }, 
                   { "id": 253, "nama": "Kejang", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 254, "nama": "Tremor", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 3009, "nama": "", "type": "enter","grid":"grid_12" },
                   { "id": 255, "nama": "Plegi di", "type": "textbox" ,"grid":"grid_6" }, 
                   { "id": 3010, "nama": "", "type": "enter","grid":"grid_12" },
                   { "id": 256, "nama": "Parase di", "type": "textbox" ,"grid":"grid_6" }, 
                   { "id": 3011, "nama": "", "type": "enter","grid":"grid_12" },
                   { "id": 257, "nama": "indkoordinasi", "type": "checkbox" ,"grid":"grid_2" },  
                   { "id": 258, "nama": "Kelinan kogenital", "type": "checkbox" ,"grid":"grid_3" }, 
                   { "id": 3012, "nama": "", "type": "enter","grid":"grid_12" }, 
                   { "id": 259, "nama": "Deformitas/atropi", "type": "textbox" ,"grid":"grid_7" }, 
                   { "id": 260, "nama": "Fraktur,Lokasi", "type": "textbox" ,"grid":"grid_6" }, 
                   { "id": 261, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" }, 
                      
                    
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                              
                ]
            },{
                "id": 5,
                "nama": "Eliminasi",
                "detail": [
                   { "id": 262, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 263, "nama": "Diare", "type": "checkbox" ,"grid":"grid_1" }, 
                   { "id": 264, "nama": "Konstipasi", "type": "checkbox" ,"grid":"grid_2" }, 
                   { "id": 265, "nama": "Inkonentia alvi/Uri", "type": "checkbox" ,"grid":"grid_3" }, 
                   { "id": 266, "nama": "Colostomi", "type": "textbox" ,"grid":"grid_5" }, 
                   { "id": 267, "nama": "Retensia Urine", "type": "textbox" ,"grid":"grid_7" },  
                   { "id": 268, "nama": "Hematuri", "type": "checkbox" ,"grid":"grid_5" },  
                   { "id": 269, "nama": "Anuria", "type": "checkbox" ,"grid":"grid_6" },  
                   { "id": 270, "nama": "Dysuria", "type": "textbox" ,"grid":"grid_6" }, 
                   { "id": 271, "nama": "Kandung kemih", "type": "textbox" ,"grid":"grid_5" },  
                   { "id": 272, "nama": "Penuh", "type": "checkbox" ,"grid":"grid_1" },   
                   { "id": 273, "nama": "Kosong", "type": "checkbox" ,"grid":"grid_1" },  
                   { "id": 274, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" }, 
                      
                    
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                              
                ]
            }]

            $scope.listObat = [
                { "id": 1, "nama": "Obat-obatan di rumah(daftar obat,dosis,frekuensi,kapan terakhir kali dikonsumsi)", "detail": 
                    [ 
                        { "id": 275, "nama": "Nama Obat", "type": "label","grid":"grid_4" },  
                        { "id": 276, "nama": "Dosis / Frekuensi", "type": "label","grid":"grid_4" }, 
                        { "id": 277, "nama": "Kapan terakhir kali diberikan", "type": "label","grid":"grid_4" }, 
                        { "id": 278, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 279, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 280, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 281, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 282, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 283, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 284, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 285, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 286, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 287, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 288, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 289, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 290, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 291, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 292, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 293, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 294, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 295, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 296, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 297, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 298, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 299, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 300, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 301, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                      
                    ]
                }
            ]
             $scope.listKesimpulan= [
                { "id": 1, "nama": "Kesimpulan", "detail": 
                    [ 
                        { "id": 302, "nama": "Ketergantungan total(0-20)", "type": "checkbox","grid":"grid_2" },
                        { "id": 303, "nama": "Ketergantungan berat(25-40)", "type": "checkbox","grid":"grid_2" },
                        { "id": 304, "nama": "Ketergantungan sedang(45-50)", "type": "checkbox","grid":"grid_2" },
                        { "id": 305, "nama": "Ketergantungan ringan(60-95)", "type": "checkbox","grid":"grid_2" },
                        { "id": 306, "nama": "Mandiri(100)", "type": "checkbox","grid":"grid_2" },
                        { "id": 307, "nama": "", "type": "enter","grid":"grid_12" },
                        { "id": 308, "nama": "Perlu bantuan,sebutkan", "type": "textbox","grid":"grid_12" },
                        { "id": 309, "nama": "Alat bantu jalan,sebutkan", "type": "textbox","grid":"grid_12" },

                    ]
                }
            ]
             $scope.listAgama = [{
                "id": 1,
                "nama": "Agama",
                "detail": [
                    { "id": 310, "nama": "Khatolik ", "type": "checkbox" },
                    { "id": 311, "nama": "Islam", "type": "checkbox" }, 
                    { "id": 312, "nama": "Protestan", "type": "checkbox" },
                    { "id": 313, "nama": "Hindu", "type": "checkbox" },
                    { "id": 314, "nama": "Budha", "type": "checkbox" },
                    { "id": 315, "nama": "Kong Hu Cu", "type": "checkbox" }, 
                ]
            },{
                "id": 2,
                "nama": "Status Perkawinan",
                "detail": [
                    { "id": 316, "nama": "Kawin ", "type": "checkbox" },
                    { "id": 317, "nama": "Belum Kawin", "type": "checkbox" }, 
                    { "id": 318, "nama": "Duda", "type": "checkbox" },
                    { "id": 319, "nama": "Janda", "type": "checkbox" }                     
                ]
            }]
              $scope.listKomunikasi= [
                { 
                    "id": 1, "nama": "Kesimpulan", "detail": 
                    [ 
                        { "id": 320, "nama": "Bicara", "type": "label","grid":"grid_2" },
                        { "id": 321, "nama": "normal", "type": "checkbox","grid":"grid_2" },
                        { "id": 322, "nama": "gangguan bicara, jelaskan", "type": "checkbox","grid":"grid_2" },
                        { "id": 323, "nama": "x", "type": "textboxtanpalabel","grid":"grid_2" },
                        { "id": 324, "nama": "", "type": "enter","grid":"grid_2" },                        
                        { "id": 325, "nama": "Perlu penterjemaah:", "type": "label","grid":"grid_2" },
                        { "id": 326, "nama": "tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 327, "nama": "ya", "type": "checkbox","grid":"grid_1" },
                        { "id": 328, "nama": "Bahasa", "type": "textbox","grid":"grid_3" },
                        { "id": 329, "nama": "Bahasa isyarat:", "type": "label","grid":"grid_2" },
                        { "id": 330, "nama": "tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 331, "nama": "ya", "type": "checkbox","grid":"grid_1" },
                        { "id": 332, "nama": "ya", "type": "enter","grid":"grid_1" },

                        
                        { "id": 333, "nama": "Hambatan belajar", "type": "label","grid":"grid_2" },
                        { "id": 334, "nama": "tidak", "type": "checkbox","grid":"grid_2" },
                        { "id": 335, "nama": "ya,Sebutkan hambatannya(boleh mencentang lebih dari satu pilihan)", "type": "checkbox","grid":"grid_8" },
                        { "id": 336, "nama": "pendengar", "type": "checkbox","grid":"grid_2" },
                        { "id": 337, "nama": "penglihatan", "type": "checkbox","grid":"grid_2" },
                        { "id": 338, "nama": "kognitif", "type": "checkbox","grid":"grid_2" },
                        { "id": 339, "nama": "fisik", "type": "checkbox","grid":"grid_2" },
                        { "id": 340, "nama": "Budaya", "type": "checkbox","grid":"grid_2" },
                        { "id": 341, "nama": "Agama", "type": "checkbox","grid":"grid_2" },
                        { "id": 342, "nama": "Emosi", "type": "checkbox","grid":"grid_2" },
                        { "id": 343, "nama": "Bahasa", "type": "checkbox","grid":"grid_2" },
                        { "id": 344, "nama": "Lainya", "type": "textbox","grid":"grid_4" },
                        { "id": 345, "nama": "Kebutuhan pembelajaran(pilih topik pembelajaran pada kotak yang tersedia)", "type": "label","grid":"grid_12" },
                        { "id": 346, "nama": "Pasien/keluarga menginginkan informasi tentang :", "type": "label","grid":"grid_12" },
                        { "id": 347, "nama": "Proses penyakit", "type": "checkbox","grid":"grid_2" },
                        { "id": 348, "nama": "Terapi/Obat", "type": "checkbox","grid":"grid_2" },
                        { "id": 349, "nama": "Diet dan nutrisi", "type": "checkbox","grid":"grid_2" },
                        { "id": 350, "nama": "Rehabilitasi", "type": "checkbox","grid":"grid_2" },
                        { "id": 351, "nama": "Manajemen nyeri", "type": "checkbox","grid":"grid_2" },
                        
                        { "id": 352, "nama": "Lainya", "type": "textbox","grid":"grid_12" },
                    ]
                },  { 
                "id": 2, "nama": "XI.RIWAYAT PSIKOSOSIAL DAN SPIRITUAL ", "detail": 
                    [ 
                        { "id": 353, "nama": "Tingaal bersama", "type": "label","grid":"grid_2" },
                        { "id": 354, "nama": "Pribadi", "type": "checkbox","grid":"grid_2" },
                        // { "id": 355, "nama": "Asuransi", "type": "textbox","grid":"grid_4" },
                        // { "id": 356, "nama": "Tanggungan", "type": "textbox","grid":"grid_4" },
                    ]
                }
            ]
             $scope.listekonomi= [{ 
                "id": 2, "nama": "Penanggung Jawab", "detail": 
                    [  
                        { "id": 357, "nama": "Pribadi", "type": "checkbox","grid":"grid_2" },
                        // { "id": 358, "nama": "Asuransi", "type": "textbox","grid":"grid_4" },
                        // { "id": 359, "nama": "Tanggungan", "type": "textbox","grid":"grid_4" },
                    ]
                }]
              $scope.listriwayat= [{ 
                    "id": 2, "nama": "tinggal bersama", "detail": 
                        [ 
                            { "id": 360, "nama": "Keluarga", "type": "checkbox","grid":"grid_2" },
                            { "id": 361, "nama": "Orang tua", "type": "checkbox","grid":"grid_2" },
                            { "id": 362, "nama": "Anak", "type": "checkbox","grid":"grid_2" },
                            { "id": 363, "nama": "Mertua", "type": "checkbox","grid":"grid_2" },
                            { "id": 364, "nama": "Teman", "type": "checkbox","grid":"grid_2" },
                            { "id": 365, "nama": "Sendiri", "type": "checkbox","grid":"grid_2" },
                            { "id": 366, "nama": "Panti asuhan", "type": "checkbox","grid":"grid_2" },
                            { "id": 367, "nama": "Panti Jompo", "type": "checkbox","grid":"grid_2" },
                        ]
                    },{ 
                    "id": 2, "nama": "Pekerjaan", "detail": 
                        [ 
                            { "id": 368, "nama": "Wiraswasta", "type": "checkbox","grid":"grid_2" },
                            { "id": 369, "nama": "Pegawai", "type": "checkbox","grid":"grid_2" },
                            { "id": 370, "nama": "Tidak Bekerja", "type": "checkbox","grid":"grid_2" },
                            { "id": 371, "nama": "Siswa/Mahasiswa", "type": "checkbox","grid":"grid_2" },
                            { "id": 372, "nama": "Pensiun", "type": "checkbox","grid":"grid_2" },
                            { "id": 373, "nama": "Lainya", "type": "textbox","grid":"grid_4" },
                        ]
                    },{ 
                    "id": 2, "nama": " ", "detail": 
                        [ 
                            { "id": 374, "nama": "Keluarga terdekat", "type": "textbox","grid":"grid_4" },
                            { "id": 375, "nama": "Hubungan", "type": "textbox","grid":"grid_4" },
                            { "id": 376, "nama": "Telepon", "type": "textbox","grid":"grid_4" }, 
                        ]
                    },{ 
                    "id": 2, "nama": "Status Emosional ", "detail": 
                        [ 
                            { "id": 377, "nama": "Kooperatif", "type": "checkbox","grid":"grid_2" },
                            { "id": 378, "nama": "Cemas", "type": "checkbox","grid":"grid_2" },
                            { "id": 379, "nama": "Depresi", "type": "checkbox","grid":"grid_2" }, 
                            { "id": 380, "nama": "Ingin mengakhiri hidup", "type": "checkbox","grid":"grid_2" }, 
                            { "id": 381, "nama": "Lainya", "type": "textbox","grid":"grid_4" }, 
                        ]
                    },{ 
                    "id": 2, "nama": "Status Mental ", "detail": 
                        [ 
                            { "id": 382, "nama": "Kooperatif", "type": "checkbox","grid":"grid_2" },
                            { "id": 383, "nama": "Tidak Kooperatif", "type": "checkbox","grid":"grid_2" },
                            { "id": 3830, "nama": "Gelisah atau delirium dan berontak", "type": "checkbox","grid":"grid_2" }, 
                            { "id": 384, "nama": "Ketidakmampuan dalam mengikuti perintah untuk tidak meninggalkan RS", "type": "checkbox","grid":"grid_2" }, 
                            
                        ]
                    },{ 
                    "id": 2, "nama": "Restrain", "detail": 
                        [ 
                            { "id": 385, "nama": "Tidak", "type": "checkbox","grid":"grid_2" },
                            { "id": 386, "nama": "Ya, lanjutkan ke 'pengkajian dan monitoring Restraint'", "type": "checkbox","grid":"grid_10" },
                            
                        ]
                    },{ 
                    "id": 2, "nama": "Curiga penganiayaan/penelantaran", "detail": 
                        [ 
                            { "id": 387, "nama": "Tidak", "type": "checkbox","grid":"grid_2" },
                            { "id": 388, "nama": "Ya, lanjutkan ke 'Asesmen Pasien Korban Kekerasan/Penelantaran(RM.G.17)'", "type": "checkbox","grid":"grid_10" },
                            
                        ]
                    },{ 
                    "id": 2, "nama": "Hubungan pasien dengan anggota keluarha", "detail": 
                        [ 
                            { "id": 389, "nama": "Baik", "type": "checkbox","grid":"grid_2" },
                            { "id": 390, "nama": "Tidak baik", "type": "checkbox","grid":"grid_10" },
                            
                        ]
                    },{ 
                    "id": 2, "nama": "Spiritual,perlu dibantu dalam ibadah", "detail": 
                        [ 
                            { "id": 391, "nama": "Tidak", "type": "checkbox","grid":"grid_2" },
                            { "id": 392, "nama": "Ya Sebitkan", "type": "textbox","grid":"grid_10" },
                            
                        ]
                    },
                ]

                $scope.listaktivitas= [{ 
                "id": 2, "nama": "Istirahat/tidur", "detail": 
                    [  
                        { "id": 393, "nama": "T.a.k", "type": "checkbox","grid":"grid_1" },
                        { "id": 394, "nama": "insomnia", "type": "checkbox","grid":"grid_2" },
                        { "id": 395, "nama": "lain-lain", "type": "textbox","grid":"grid_3" },
                    ]
                },{ 
                "id": 2, "nama": "Penggunaan Obat tidur", "detail": 
                    [  
                        { "id": 396, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 397, "nama": "Ya", "type": "checkbox","grid":"grid_4" }, 
                    ]
                },{ 
                "id": 2, "nama": "Olahraga", "detail": 
                    [  
                        { "id": 398, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 399, "nama": "Ya", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 400, "nama": "Jenis", "type": "textbox","grid":"grid_3" }, 
                        { "id": 401, "nama": "frekuensi", "type": "textbox","grid":"grid_3" }, 
                        { "id": 402, "nama": "x/minggu", "type": "label","grid":"grid_1" }, 
                    ]
                }]
                $scope.listpola= [{ 
                "id": 2, "nama": "Merokok", "detail": 
                    [  
                        { "id": 403, "nama": "Tidak", "type": "checkbox","grid":"grid_2" },
                        { "id": 404, "nama": "ya", "type": "textbox","grid":"grid_4" },
                        // { "id": 40, "nama": "lain-lain", "type": "textbox","grid":"grid_4" },
                    ]
                },{ 
                "id": 2, "nama": "Kopi", "detail": 
                    [  
                        { "id": 405, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 406, "nama": "Ya", "type": "checkbox","grid":"grid_4" }, 
                    ]
                }]
                $scope.listketergantungan= [{ 
                "id": 2, "nama": "Alkohol", "detail": 
                    [  
                        { "id": 407, "nama": "Tidak", "type": "checkbox","grid":"grid_2" },
                        { "id": 408, "nama": "ya", "type": "textbox","grid":"grid_4" },
                        // { "id": 409, "nama": "lain-lain", "type": "textbox","grid":"grid_4" },
                    ]
                },{ 
                "id": 2, "nama": "Obat-obatan", "detail": 
                    [  
                        { "id": 410, "nama": "Tidak", "type": "checkbox","grid":"grid_12" },
                        { "id": 411, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                        { "id": 412, "nama": "Metadon", "type": "checkbox","grid":"grid_1" },
                        { "id": 413, "nama": "Kokain", "type": "checkbox","grid":"grid_1" },
                        { "id": 414, "nama": "Heroin", "type": "checkbox","grid":"grid_1" },
                        { "id": 415, "nama": "Amfetamin", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 416, "nama": "Opiat lain/Analgesik", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 417, "nama": "Lain-lain", "type": "textbox","grid":"grid_3" }, 
                    ]
                }]
                  $scope.listpenunjang= [{ 
                "id": 2, "nama": "", "detail": 
                    [  
                        { "id": 418, "nama": "a", "type": "textbox","grid":"grid_12" },
                        { "id": 419, "nama": "b", "type": "textbox","grid":"grid_12" },
                        { "id": 420, "nama": "c", "type": "textbox","grid":"grid_12" },
                        // { "id": 6, "nama": "lain-lain", "type": "textbox","grid":"grid_4" },
                    ]
                } ]

                //421 diagnosa
                

            var getTotal = function(id) {
                var skorAwal = 0;
                if(id == 'a'){
                    $scope.arrNIPS.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor = skorAwal
                }else if(id == 'b'){
                    $scope.arrNIPSb.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor2 = skorAwal
                } else if(id == 'c'){
                    $scope.arrNIPSc.forEach(function(data) {
                        skorAwal += parseInt(data.descNilai);
                    })
                    $scope.totalSkor3 = skorAwal
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
                var objectfk = "AKRI";
                var noregistrasifk = $state.params.noRec;
                var status = "t"; 
                medifirstService.get("emr/get-data-rekam-medis?noregistrasifk=" + noregistrasifk + '&objectfk=' + objectfk +
                    '&riwayatfk=' + $scope.noRecPap).then(function(e) {
                    $scope.dataEdukasi = e.data.data;
                    if ($scope.dataEdukasi.length != 0) {
                       for (var i = 0; i < $scope.dataEdukasi.length; i++) { 
                            var res = $scope.dataEdukasi[i].objectfk.substring(7);                                
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
                    var object = "AKRI000"+urutan  
                    // var norectmp = "AKRI000"+urutan    
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
                    objecthead: "AKRI"
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