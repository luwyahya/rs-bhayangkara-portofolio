define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianAwalKeperawatanKebidananIgdCtrl', ['$mdDialog', '$timeout', '$parse', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
    function ($mdDialog, $timeout, $parse, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
        $scope.item = {}
        $scope.item.obj = {};
        $scope.cc = {};
        $scope.vd = {};
        $scope.cc.emrfk = 2000;
        $scope.now = new Date();
        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = ''
        var noCm = ''
        let sum2 = 0;
        let sumMst = 0;
        let sumRd = 0;
        var lanjut = false;
        var dataLoad = []
        $scope.tombolSimpanVis = true;
        $scope.noRecPap = cacheHelper.get('noRecPapNew');
        loadCombo()
        LoadCacheHelper()
        

        function loadCombo() {
            medifirstService.get('emr/get-combo').then(function(dat) {
                $scope.listDokter = dat.data.dokter
                $scope.listBidan = dat.data.perawatBidan
            })

            $scope.listPenyakitKeluarga = [
                { text: "Hipertensi", value: 1 },
                { text: "Jantung", value: 2 },
                { text: "Paru", value: 3 },
                { text: "DM", value: 4 },
                { text: "Ginjal", value: 5 },
                { text: "Lainnya", value: 6 },
            ];

            $scope.listKetergantungan = [
                { text: "Obat-obatan", value: 1 },
                { text: "Rokok", value: 2 },
                { text: "Alkohol", value: 3 },
                { text: "Lainnya", value: 4 },
            ];

            $scope.listRiwayatAlergi = [
                { text: "Tidak", value: 1 },
                { text: "Ya", value: 2 },
                { text: "Obat", value: 3 },
                { text: "Makanan", value: 4 },
                { text: "Lainnya", value: 5 },
            ];

            $scope.listKb = [
                { text: "Pil", value: 1 },
                { text: "Suntik 1 bulan", value: 2 },
                { text: "Suntik 3 bulan", value: 3 },
                { text: "Implant", value: 4 },
                { text: "IUD", value: 5 },
            ];

            $scope.listTahun = [
                { text: "1", value: 1 },
                { text: "2", value: 2 },
                { text: "3", value: 3 },
                { text: "4", value: 4 },
                { text: "5", value: 5 },
                { text: "6", value: 6 },
                { text: "7", value: 7 }
            ];

            $scope.listPernikahan = [
                { text: "Single", value: 1 },
                { text: "Bercerai", value: 2 },
                { text: "Menikah", value: 3 },
                { text: "Janda / Duda", value: 4 }
            ];

            $scope.listRiwayatGinekologi = [
                { text: "Infertilitas", value: 1 },
                { text: "Infeksi virus", value: 2 },
                { text: "PMS", value: 3 },
                { text: "Endometriosis", value: 4 },
                { text: "Myoma", value: 5 },
                { text: "Polyp cervix", value: 6 },
                { text: "Kanker", value: 7 }
            ];

            $scope.listTempatPartus = [
                { text: "RS", value: 1},
                { text: "PKM", value: 2},
                { text: "Bidan", value: 3},
                { text: "Dukun", value: 4}
            ];

            $scope.listJenisPersalinan = [
                { text: "Normal", value: 1},
                { text: "SC", value: 2},
                { text: "Vakum", value: 3}
            ];

            $scope.listJk = [
                { text: "Laki-laki", value: 1},
                { text: "Perempuan", value: 2},
            ];

            $scope.listKeadaanAnak = [
                { text: "Sehat", value: 1},
                { text: "Meninggal", value: 2},
            ];

            $scope.listKondisiAnak = [
                { text: "Normal", value: 1},
                { text: "Cacat", value: 2},
            ];

            $scope.listNyeriAnak = [
                {
                    "id": 6, "nama": "Hurts", "detail": [
                    { "id": 74, "nama": "No Hurt", "descNilai": 4 },
                    { "id": 75, "nama": "Hurts Little Bit", "descNilai": 6 }, 
                    { "id": 3, "nama": "Hurts Little More", "descNilai": 0 },
                    { "id": 76, "nama": "Hurts Even More", "descNilai": 8 }, 
                    { "id": 5, "nama": "Hurts Whole Lot", "descNilai": 2 },
                    { "id": 77, "nama": "Hurts whorts", "descNilai": 10 }]
                }
            ]
            $scope.listSkorWong = [{
                "id": 7, "nama": "Score ",
                "detail": [
                    { "id": 1207, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                    { "id": 1208, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                    { "id": 1209, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
                    { "id": 1210, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
                    { "id": 1211, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
                    { "id": 1212, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
                ]
            }]


            $scope.listKesadaran = [
                { text: "Compos Mentis", value: 1 },
                { text: "Apatis", value: 2 },
                { text: "Delirium", value: 3 },
                { text: "Somnolent", value: 4 },
                { text: "Sopor", value: 5 },
                { text: "Semi Coma", value: 6 },
                { text: "Coma", value: 7 }
            ];

            $scope.listKeadaanUmum = [
                { text: "Baik", value: 1},
                { text: "Sedang", value: 2},
                { text: "Buruk", value: 3}
            ]
            $scope.listGcs = [
                { text: "E", value: 1},
                { text: "M", value: 2},
                { text: "V", value: 3}
            ];
            $scope.listGcsE = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4}
            ];
            $scope.listGcsM = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "6", value: 6}
            ];
            $scope.listGcsV = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5}
            ];

            $scope.listStatus = [
                { text: "Positif", value: 1},
                { text: "Negatif", value: 2}
            ];
        }

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
                { "id": 6136, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" },                
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
                { "id": 5267, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 5268, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 5269, "nama": "Menopause", "type": "checkbox" ,"grid":"grid_3" },  
                { "id": 5270, "nama": "Menstruasi terakhir", "type": "textbox" ,"grid":"grid_10" },                      
                { "id": 5271, "nama": "Keluhan menstruasi", "type": "checkbox" ,"grid":"grid_3" },             
                { "id": 5272, "nama": "tidak", "type": "checkbox" ,"grid":"grid_1" },             
                { "id": 5273, "nama": "ya,sebutkan", "type": "textbox" ,"grid":"grid_4" },       
                // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                          
            ]
        },{
            "id": 5,
            "nama": "Pria",
            "detail": [
               { "id": 5274, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5275, "nama": "Phimosis", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5276, "nama": "Hernia", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5277, "nama": "Haemoroid", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5278, "nama": "Orchitis", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5279, "nama": "Sekret warna", "type": "textbox" ,"grid":"grid_5" }, 
                
                // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                          
            ]
        },{
            "id": 5,
            "nama": "Integumen",
            "detail": [
               { "id": 5280, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5281, "nama": "Turgor Jelek", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5282, "nama": "Dingin", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5283, "nama": "Bullae", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5284, "nama": "Fistula", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5285, "nama": "Iketrik", "type": "checkbox" ,"grid":"grid_1" },  
               { "id": 5286, "nama": "Diofersi", "type": "checkbox" ,"grid":"grid_2" },  
               { "id": 5287, "nama": "Pucat", "type": "checkbox" ,"grid":"grid_1" },  
               { "id": 5288, "nama": "Dekubitus,Derajat", "type": "textbox" ,"grid":"grid_6" }, 
               { "id": 5289, "nama": "Lokasi", "type": "textbox" ,"grid":"grid_6" }, 
               { "id": 5290, "nama": "", "type": "enter","grid":"grid_12" },
               { "id": 5291, "nama": "Luka : ", "type": "label" ,"grid":"grid_1" }, 
               { "id": 5292, "nama": "Tidak ada", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5293, "nama": "Lokasi", "type": "textbox" ,"grid":"grid_9" },
               { "id": 5294, "nama": "", "type": "enter","grid":"grid_12" },  
               { "id": 5295, "nama": "Kondisi :", "type": "label" ,"grid":"grid_1" }, 
               { "id": 5296, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5297, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },  
               { "id": 5298, "nama": "jahitan luka", "type": "checkbox" ,"grid":"grid_2" },  
               { "id": 5299, "nama": "ada", "type": "checkbox" ,"grid":"grid_1" },  
               { "id": 5300, "nama": "tidak ada", "type": "checkbox" ,"grid":"grid_2" },
               { "id": 5301, "nama": "Balutan", "type": "label" ,"grid":"grid_1" }, 
               { "id": 5302, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5303, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },   
                
                // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                          
            ]
        },{
            "id": 5,
            "nama": "Extremitas",
            "detail": [
               { "id": 5304, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5305, "nama": "Kelemahan otot", "type": "checkbox" ,"grid":"grid_3" }, 
               { "id": 5306, "nama": "Kejang", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5307, "nama": "Tremor", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5308, "nama": "", "type": "enter","grid":"grid_12" },
               { "id": 5309, "nama": "Plegi di", "type": "textbox" ,"grid":"grid_6" }, 
               { "id": 5310, "nama": "", "type": "enter","grid":"grid_12" },
               { "id": 5311, "nama": "Parase di", "type": "textbox" ,"grid":"grid_6" }, 
               { "id": 5312, "nama": "", "type": "enter","grid":"grid_12" },
               { "id": 5313, "nama": "indkoordinasi", "type": "checkbox" ,"grid":"grid_2" },  
               { "id": 5314, "nama": "Kelinan kogenital", "type": "checkbox" ,"grid":"grid_3" }, 
               { "id": 5315, "nama": "", "type": "enter","grid":"grid_12" }, 
               { "id": 5316, "nama": "Deformitas/atropi", "type": "textbox" ,"grid":"grid_7" }, 
               { "id": 5317, "nama": "Fraktur,Lokasi", "type": "textbox" ,"grid":"grid_6" }, 
               { "id": 5318, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" }, 
                  
                
                // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                          
            ]
        },{
            "id": 5,
            "nama": "Eliminasi",
            "detail": [
               { "id": 5319, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5320, "nama": "Diare", "type": "checkbox" ,"grid":"grid_1" }, 
               { "id": 5321, "nama": "Konstipasi", "type": "checkbox" ,"grid":"grid_2" }, 
               { "id": 5322, "nama": "Inkonentia alvi/Uri", "type": "checkbox" ,"grid":"grid_3" }, 
               { "id": 5323, "nama": "Colostomi", "type": "textbox" ,"grid":"grid_5" }, 
               { "id": 5324, "nama": "Retensia Urine", "type": "textbox" ,"grid":"grid_7" },  
               { "id": 5325, "nama": "Hematuri", "type": "checkbox" ,"grid":"grid_5" },  
               { "id": 5326, "nama": "Anuria", "type": "checkbox" ,"grid":"grid_6" },  
               { "id": 5327, "nama": "Dysuria", "type": "textbox" ,"grid":"grid_6" }, 
               { "id": 5328, "nama": "Kandung kemih", "type": "textbox" ,"grid":"grid_5" },  
               { "id": 5329, "nama": "Penuh", "type": "checkbox" ,"grid":"grid_1" },   
               { "id": 5330, "nama": "Kosong", "type": "checkbox" ,"grid":"grid_1" },  
               { "id": 5331, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_4" }, 
                  
                
                // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                          
            ]
        }]

        $scope.getSkalaNyeri = function (data, stat) {
            debugger
            $scope.item.obj[1215] = undefined
            $scope.activeStatus = stat.descNilai
            var nilai = stat.descNilai
            if (nilai >= 0 && nilai <= 1) {
                $scope.item.obj[1207] = true
                $scope.item.obj[1215] = '0 - 1' 
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 2 && nilai <= 3) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = true
                $scope.item.obj[1215] = '2 - 3' 
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 4 && nilai <= 5) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = true
                $scope.item.obj[1215] = '4 - 5' 
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 6 && nilai <= 7) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = true
                $scope.item.obj[1215] = '6 - 7' 
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = false
            }
            if (nilai >= 8 && nilai <= 9) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = true
                $scope.item.obj[1215] = '8 - 9' 
                $scope.item.obj[1212] = false
            }

            if (nilai == 10) {
                $scope.item.obj[1207] = false
                $scope.item.obj[1208] = false
                $scope.item.obj[1209] = false
                $scope.item.obj[1210] = false
                $scope.item.obj[1211] = false
                $scope.item.obj[1212] = true
                $scope.item.obj[1215] = '10' 
            }

        }

        $scope.$watch('item.obj[26]', function(e) {
            if (e == true) {
                $scope.item.obj[27] = false
            } 
        })

        $scope.$watch('item.obj[27]', function(e) {
            if (e == true) {
                $scope.item.obj[26] = false
            } 
        })

        $scope.$watch('item.obj[28]', function(e) {
            if (e == true) {
                $scope.item.obj[29] = false
            } 
        })

        $scope.$watch('item.obj[29]', function(e) {
            if (e == true) {
                $scope.item.obj[28] = false
            } 
        })

        $scope.$watch('item.obj[41]', function(e) {
            if (e == true) {
                $scope.item.obj[42] = false
            } 
        })

        $scope.$watch('item.obj[42]', function(e) {
            if (e == true) {
                $scope.item.obj[41] = false
            } 
        })

        $scope.rpl = false;
        $scope.$watch('item.obj[2]', function(e) {
            if (e == true) {
                $scope.rpl = true;
                $scope.item.obj[1] = false
            } else {
                $scope.rpl = false;
                $scope.item.obj[113] = ''
            }
        })

        $scope.$watch('item.obj[1]', function(e) {
            if (e == true) {
                $scope.item.obj[2] = false
            } 
        })

        $scope.pdr = false;
        $scope.$watch('item.obj[4]', function(e) {
            if (e == true) {
                $scope.pdr = true;
                $scope.item.obj[3] = false
            } else {
                $scope.pdr = false;
            }
        })

        $scope.$watch('item.obj[3]', function(e) {
            if (e == true) {
                $scope.item.obj[4] = false
            } 
        })

        $scope.pdo = false;
        $scope.$watch('item.obj[6]', function(e) {
            if (e == true) {
                $scope.pdo = true;
                $scope.item.obj[5] = false
            } else {
                $scope.pdo = false;
            }
        })

        $scope.$watch('item.obj[5]', function(e) {
            if (e == true) {
                $scope.item.obj[6] = false
            } 
        })

        $scope.mdp = false;
        $scope.$watch('item.obj[8]', function(e) {
            if (e == true) {
                $scope.mdp = true;
                $scope.item.obj[7] = false
            } else {
                $scope.mdp = false;
            }
        })

        $scope.$watch('item.obj[7]', function(e) {
            if (e == true) {
                $scope.item.obj[8] = false
            } 
        })

        $scope.rpk = false;
        $scope.rpkl = false;
        $scope.$watch('item.obj[10]', function(e) {
            if (e == true) {
                $scope.rpk = true;
                $scope.item.obj[9] = false
            } else {
                $scope.rpk = false;
                $scope.item.obj[147] = {value: null, text: ''}
            }
        })

        $scope.$watch('item.obj[9]', function(e) {
            if (e == true) {
                $scope.item.obj[10] = false
                $scope.rpkl = false;
            } 
        })

        $scope.$watch('item.obj[147]', function(e) {
            if (e.value == 6) {
                $scope.rpkl = true;
            } else {
                $scope.rpkl = false;
                $scope.item.obj[142] = ''
            }
        })

        $scope.ktzt = false;
        $scope.$watch('item.obj[12]', function(e) {
            if (e == true) {
                $scope.ktzt = true;
                $scope.item.obj[11] = false
            } 
            // else {
            //     $scope.ktzt = false;
            //     $scope.item.obj[478] = {value: null, text: ''}
            // }
        })

        $scope.$watch('item.obj[11]', function(e) {
            if (e == true) {
                $scope.item.obj[12] = false
                $scope.rpkl = false;
            } 
        })

        $scope.rpkj = false;
        $scope.$watch('item.obj[14]', function(e) {
            if (e == true) {
                $scope.rpkj = true;
                $scope.item.obj[13] = false
            } else {
                $scope.rpkj = false;
                $scope.item.obj[143] = ''
            }
        })

        $scope.$watch('item.obj[13]', function(e) {
            if (e == true) {
                $scope.item.obj[14] = false
                $scope.rpkl = false;
            } 
        })

        $scope.ral = false;
        $scope.rat = false;
        $scope.$watch('item.obj[148]', function(e) {
            if( e.value == 5 ) {
                $scope.ral = true;
                $scope.rat = true;
            } else if( e.value == 2 ||  e.value == 3 || e.value == 4) {
                $scope.ral = false;
                $scope.item.obj[144] = ''
                $scope.rat = true;
            }  else {
                $scope.ral = false;
                $scope.rat = false;
                $scope.item.obj[144] = ''
                $scope.item.obj[241] = ''
            }
        })

        $scope.menikah = false;
        $scope.$watch('item.obj[214]', function(e) {
            if( e.value == 3 ) {
                $scope.menikah = true;
            }  else {
                $scope.menikah = false;
                $scope.item.obj[145] = ''
            }
        })

        $scope.kht = false;
        $scope.$watch('item.obj[18]', function(e) {
            if (e == true) {
                $scope.kht = true;
                $scope.item.obj[17] = false
            } else {
                $scope.kht = false;
                $scope.item.obj[164] = ''
            }
        })

        $scope.$watch('item.obj[17]', function(e) {
            if (e == true) {
                $scope.item.obj[18] = false
            } 
        })

        $scope.rpg = false;
        $scope.$watch('item.obj[25]', function(e) {
            if (e == true) {
                $scope.rpg = true;
                $scope.item.obj[24] = false
            } 
            // else {
            //     $scope.rpg = false;
            //     $scope.item.obj[224] = {value: null, text: ''}
            // }
        })

        $scope.$watch('item.obj[24]', function(e) {
            if (e == true) {
                $scope.item.obj[25] = false
            } 
        })

        function LoadCacheHelper() {
            var chacePeriode = cacheHelper.get('cacheRMelektronik');
            if (chacePeriode != undefined) {
                //var arrPeriode = chacePeriode.split(':');
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[13]
                $scope.cc.tglLahir = chacePeriode[14]
                $scope.cc.norec_emr = '-'
                $scope.cc.jenisemr = "pengkajianawalkebidanan"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                $scope.item.obj[2346] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[2363] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[7070] = moment($scope.now).format('YYYY-MM-DD HH:mm')

                $scope.vd.nocm = chacePeriode[0]
                $scope.vd.namapasien = chacePeriode[1]
                $scope.vd.jeniskelamin = chacePeriode[2]
                $scope.vd.noregistrasi = chacePeriode[3]
                $scope.vd.umur = chacePeriode[4]
                $scope.vd.kelompokpasien = chacePeriode[5]
                $scope.vd.tglregistrasi = chacePeriode[6]
                $scope.vd.norec = chacePeriode[7]
                $scope.vd.norec_pd = chacePeriode[8]
                $scope.vd.objectkelasfk = chacePeriode[9]
                $scope.vd.namakelas = chacePeriode[10]
                $scope.vd.objectruanganfk = chacePeriode[11]
                $scope.vd.namaruangan = chacePeriode[12]
                $scope.vd.DataNoregis = chacePeriode[13]
                $scope.vd.norec_emr = '-'

                init()
                init2()
                cekVitalSign()
            }
        }

        function getBioPasien() {
            medifirstService.get("emr/get-bio-pasien-byCm?noCm=" + $scope.cc.nocm, true)
                .then(function (res) {
                    var bio = res.data.data
                    $scope.item.obj[19] = bio.namatitle +'.' + bio.namapasien
                    $scope.item.obj[20] = bio.pendidikan
                    $scope.item.obj[21] = bio.pangkat
                    $scope.item.obj[22] = bio.pekerjaan
                    $scope.item.obj[32] = bio.agama 
                    $scope.item.obj[33] = bio.suku
                    $scope.item.obj[34] = bio.golongandarah
                    $scope.item.obj[35] = bio.notelepon
                    $scope.item.obj[36] = bio.alamatlengkap

                    debugger
                })

        }

        function init() {
            $scope.isRouteLoading = true
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianawalkeperawatankebidanan", true).then(function(dat) {
                $scope.isRouteLoading = false
                
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'pengkajianawalkeperawatankebidanan') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 2000;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    }
                } else {
                    getBioPasien()
                }
            })
        }
        
        function init2() {
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

        
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                debugger;
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            if (dataLoad[i].emrdfk == "6746") {
                                $scope.item.obj[dataLoad[i].emrdfk] = sum2
                            }

                            if (dataLoad[i].emrdfk == "6815") {
                                $scope.item.obj[dataLoad[i].emrdfk] = sumMst
                            }

                            if (dataLoad[i].emrdfk == "6840") {
                                $scope.item.obj[dataLoad[i].emrdfk] = sumRd
                            }

                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisi(datass)
                            }


                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }

                        if(dataLoad[i].type == "combobox") {
                            if (dataLoad[i].emrdfk == "2364") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }

                            } else if (dataLoad[i].emrdfk == "2377") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }
                            } else {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                            }
                        }

                        if (dataLoad[i].emrdfk == "1188") {
                            debugger
                            // totalNilai = dataLoad[i].value
                            // $scope.item.obj[1188] = parseInt(dataLoad[i].value)
                            totalcost[0].value = dataLoad[i].value
                        }

                        
                    }

                }
                
            })
            cekVitalSign()
        }

        function cekVitalSign() {
            medifirstService.get('emr/get-vital-sign-pengkajian?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
                debugger
                if (dat.data.length > 0) {
                    for (let i = 0; i < dat.data.length; i++) {
                        if (dat.data[i].caption == 'Tekanan Darah') {
                            $scope.item.obj[1169] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Tinggi badan') {
                            $scope.item.obj[1174] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Berat Badan') {
                            $scope.item.obj[1175] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Suhu') {
                            $scope.item.obj[1172] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Nadi') {
                            $scope.item.obj[1170] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Pernapasan') {
                            $scope.item.obj[1173] = dat.data[i].value
                        } else if (dat.data[i].caption == 'Kesadaran') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1168] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang E') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1259] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang M') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1502] = { value: res[0], text: res[1] }
                        } else if (dat.data[i].caption == 'emv yang V') {
                            var str = dat.data[i].value
                            var res = str.split("~");
                            $scope.item.obj[1503] = { value: res[0], text: res[1] }
                        }
                    }
                }
            })
        }

        $('.sf').on('change', function() {
            if ($(this).prop('checked')) {
                var checkedValue = Number($(this).val());
                var currentTotal = Number($('#totalSkorSF').val());
                var newTotal = currentTotal + checkedValue;
                $('#totalSkorSF').val(newTotal.toFixed(0));
                UpdateCost();
            } else {
                var uncheckedValue = Number($(this).val());
                var currentTotal = Number($('#totalSkorSF').val());
                var newTotal = currentTotal - uncheckedValue;
                $('#totalSkorSF').val(newTotal.toFixed(0));
                UpdateCost();
            }
        });

        function UpdateCost() {
            sum2 = newTotal
        }

        $('.mst').on('change', function() {
            if ($(this).prop('checked')) {
                var checkedValueMst = Number($(this).val());
                var currentTotalMst = Number($('#totalSkorMST').val());
                var newTotalMst = currentTotalMst + checkedValueMst;
                $('#totalSkorMST').val(newTotalMst.toFixed(0));
                UpdateCost2();
            } else {
                var uncheckedValueMst = Number($(this).val());
                var currentTotalMst = Number($('#totalSkorMST').val());
                var newTotalMst = currentTotalMst - uncheckedValueMst;
                $('#totalSkorMST').val(newTotalMst.toFixed(0));
                UpdateCost2();
            }
        });

        function UpdateCost2() {
            sumMst = newTotalMst
        }

        $('.rd').on('change', function() {
            if ($(this).prop('checked')) {
                var checkedValueRD = Number($(this).val());
                var currentTotalRD = Number($('#totalSkorRD').val());
                var newTotalRD = currentTotalRD + checkedValueRD;
                $('#totalSkorRD').val(newTotalRD.toFixed(0));
                UpdateCost3();
            } else {
                var uncheckedValueRD = Number($(this).val());
                var currentTotalRD = Number($('#totalSkorRD').val());
                var newTotalRD = currentTotalRD - uncheckedValueRD;
                $('#totalSkorRD').val(newTotalRD.toFixed(0));
                UpdateCost3();
            }
        });

        function UpdateCost3() {
            sumRd = newTotalRD
        }

        $scope.Save = function() {
            var user = medifirstService.getPegawaiLogin();
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            var arrVital = []
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined || $scope.item.obj[parseInt(arrobj[i])] != '' || $scope.item.obj[parseInt(arrobj[i])] != null || $scope.item.obj[parseInt(arrobj[i])] != false) {
                    if (arrobj[i] == 6466 || arrobj[i] == 6476 || arrobj[i] == 6486 || arrobj[i] == 6496 || arrobj[i] == 6506 || arrobj[i] == 6516 || arrobj[i] == 6468 || arrobj[i] == 6478 || arrobj[i] == 6488 || arrobj[i] == 6498
                        || arrobj[i] == 6508 || arrobj[i] == 6518 || arrobj[i] == 6470 || arrobj[i] == 6480 || arrobj[i] == 6492 || arrobj[i] == 6500 || arrobj[i] == 6512 || arrobj[i] == 6522 || arrobj[i] == 6470) {

                        if(($scope.item.obj[parseInt(arrobj[i])].value != undefined || $scope.item.obj[parseInt(arrobj[i])].value != 'undefined')
                         && ($scope.item.obj[parseInt(arrobj[i])].text != undefined || $scope.item.obj[parseInt(arrobj[i])].text != 'undefined')) {
                            arrSave.push({id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].value  + '~' + $scope.item.obj[parseInt(arrobj[i])].text})
                        }
                    
                    } else if (arrobj[i] == 2364) {
                        arrSave.push({id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id  + '~' + $scope.item.obj[parseInt(arrobj[i])].namalengkap})
                    } else if (arrobj[i] == 2377) {
                        arrSave.push({id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id  + '~' + $scope.item.obj[parseInt(arrobj[i])].namalengkap})
                    } else if (arrobj[i] == 6746) {
                        arrSave.push({id: arrobj[i], values: sum2})
                    } else if (arrobj[i] == 6815) {
                        arrSave.push({id: arrobj[i], values: sumMst})
                    } else if (arrobj[i] == 6840) {
                        arrSave.push({id: arrobj[i], values: sumRd})
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }

            $scope.cc.jenisemr = 'pengkajianawalkeperawatankebidanan'
            var jsonSave = {
                head: $scope.cc,
                data: arrSave
            }

            $scope.vd.jenisemr = 'navigasi'
            $scope.vd.emrfk = 147;

            var jsonSave2 = {
                head: $scope.vd,

                data: arrVital//$scope.item.obj
            }
            debugger;
            medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                nomorEMR = e.data.data.noemr
                medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                medifirstService.post('emr/save-emr-dinamis', jsonSave2).then(function (e) {

                })
                    init()
                    // init2()
                    // init3()
                //     init()
                var arrStr = {
                    0: e.data.data.noemr
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            });

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
                })
        }


    }
])
})