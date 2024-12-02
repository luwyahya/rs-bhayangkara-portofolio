define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('AsesmenTerminalRSMDCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'ModelItem',
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
       
            $scope.listNyeriAnak = [
                { "id": 22, "nama": "Hurts", "detail": [{ "id": 1, "nama": "0", "descNilai": "0  " }, { "id": 2, "nama": "2", "descNilai": "2  " }, { "id": 3, "nama": "4", "descNilai": "4  " }, { "id": 4, "nama": "6", "descNilai": "6  " }, { "id": 5, "nama": "8", "descNilai": "8  " }, { "id": 6, "nama": "10", "descNilai": "10  " }] }       
            ]
                $scope.listDataumum = [
                { "id": 1, "nama": "A. Pernafasaan", "detail": 
                    [
                        { "id": 1, "nama": "Irama nafas tidak teratur" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 2, "nama": "Nafas cepat (dewasa >20/mt; anak >30x/mt)" , "type": "checkbox","grid":"grid_12"},
                        { "id": 3, "nama": "Nafas lambat (dewasa <12/mt; anak <15x/mt)" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 4, "nama": "Suara nafas tambahan" , "type": "checkbox","grid":"grid_12"}, 
                                { "id": 5, "nama": "Crackeles" , "type": "checkbox","grid":"grid_2"}, 
                                { "id": 6, "nama": "Wheezing" , "type": "checkbox","grid":"grid_2"},
                                { "id": 7, "nama": "Ronchi" , "type": "checkbox","grid":"grid_2"},
                                { "id": 8, "nama": "Mengi" , "type": "checkbox","grid":"grid_2"},  
                                { "id": 9, "nama": "Friction rub" , "type": "checkbox","grid":"grid_2"},  
                        { "id": 10, "nama": "Sesak nafas" , "type": "checkbox","grid":"grid_12"},
                        { "id": 11, "nama": "Batuk" , "type": "checkbox","grid":"grid_12"},
                        { "id": 12, "nama": "Sekret" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 13, "nama": "Alat bantu nafas" , "type": "checkbox","grid":"grid_12"},
                    ]
                }
             ]

            $scope.listDataumum3= [
                { "id": 1, "nama": "B. Kardiovaskuler", "detail": 
                    [
                        { "id": 14, "nama": "Irama Jantung tidak teratur" , "type": "checkbox","grid":"grid_12"},
                        { "id": 15, "nama": "Akral dingin" , "type": "checkbox","grid":"grid_12"},
                        { "id": 16, "nama": "Pendarahan, lokasi" , "type": "checkbox","grid":"grid_4"},
                        { "id": 17, "nama": "" , "type": "textbox","grid":"grid_4"},
                        { "id": 18, "nama": "Tekanan darah menurun" , "type": "checkbox","grid":"grid_12"},
                        { "id": 19, "nama": "Nadi lemah dan lambat" , "type": "checkbox","grid":"grid_12"},
                     ] 
                 } 
             ]

            $scope.listDataumum5 = [
                { "id": 1, "nama": "C. Persyarafan", "detail": 
                    [
                        { "id": 20, "nama": "GCS:" , "type": "textbox","grid":"grid_3"},
                        { "id": 21, "nama": "E:" , "type": "textbox","grid":"grid_3"},
                        { "id": 22, "nama": "M:" , "type": "textbox","grid":"grid_3"},
                        { "id": 23, "nama": "F:" , "type": "textbox","grid":"grid_3"},
                        { "id": 24, "nama": "Kesadaran :" , "type": "checkbox","grid":"grid_12"},
                            { "id": 25, "nama": "Composmentis" , "type": "checkbox","grid":"grid_3"},
                            { "id": 26, "nama": "Apatis" , "type": "checkbox","grid":"grid_2"},
                            { "id": 27, "nama": "Somnolent" , "type": "checkbox","grid":"grid_2"},
                            { "id": 28, "nama": "Soporous" , "type": "checkbox","grid":"grid_2"},
                            { "id": 29, "nama": "Soporocoma" , "type": "checkbox","grid":"grid_2"},
                            { "id": 30, "nama": "Coma" , "type": "checkbox","grid":"grid_2"},
                        { "id": 31, "nama": "Peningkatan TIK :" , "type": "checkbox","grid":"grid_12"},
                            { "id": 32, "nama": "Ukuran pupil berbeda :" , "type": "checkbox","grid":"grid_6"},
                            { "id": 33, "nama": "Reaksi pupil lambat","type": "checkbox","grid":"grid_6"},
                        ]
                    }
                ]

            $scope.listDataumum7 = [
                { "id": 1, "nama": "D. Eliminasi", "detail": 
                    [
                        { "id": 34, "nama": "Konstipasi" , "type": "checkbox","grid":"grid_12"},
                        { "id": 35, "nama": "Oliguri" , "type": "checkbox","grid":"grid_12"},
                        { "id": 36, "nama": "Retensi urine" , "type": "checkbox","grid":"grid_12"},
                        { "id": 37, "nama": "Inkontenesia fekal" , "type": "checkbox","grid":"grid_12"},
                        { "id": 38, "nama": "Inkontenesia urinet" , "type": "checkbox","grid":"grid_12"},
                        { "id": 39, "nama": "Diare" , "type": "checkbox","grid":"grid_12"},

                                ]
                            }
                        ]

            $scope.listDataumum9 = [
                { "id": 1, "nama": "E. Nutrisi dan Cairan", "detail": 
                    [                               

                        { "id": 40, "nama": "Berat badan Menurun" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 41, "nama": "Muntah" , "type": "checkbox","grid":"grid_12"},
                        { "id": 42, "nama": "Kesulitan menelan" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 43, "nama": "Bibir kering dan pecah-pecah" , "type": "checkbox","grid":"grid_12"},
                        { "id": 44, "nama": "Mual" , "type": "checkbox","grid":"grid_12"},
                        { "id": 45, "nama": "Dehidrasi" , "type": "checkbox","grid":"grid_12"},
                        { "id": 46, "nama": "Anoreksia" , "type": "checkbox","grid":"grid_12"},
                    ]
                }
            ]

            $scope.listDataumum11 = [
                { "id": 1, "nama": "F. Nyeri", "detail": 
                    [
                        { "id": 47, "nama": "Tidak nyeri (0)" , "type": "checkbox","grid":"grid_4"},
                        { "id": 48, "nama": "Ringan (2)" , "type": "checkbox","grid":"grid_4"},
                        { "id": 49, "nama": "Berat (4)" , "type": "checkbox","grid":"grid_4"},
                        { "id": 50, "nama": "Sedikit nyeri (6)" , "type": "checkbox","grid":"grid_4"},
                        { "id": 51, "nama": "Sedang (8)" , "type": "checkbox","grid":"grid_4"},
                        { "id": 52, "nama": "Sangat berat (10)" , "type": "checkbox","grid":"grid_4"},

                        { "id": 53, "nama": "Meringis" , "type": "checkbox","grid":"grid_12"},
                        { "id": 54, "nama": "Menangis" , "type": "checkbox","grid":"grid_12"},
                        { "id": 55, "nama": "Ambang nyeri menurun    " , "type": "checkbox","grid":"grid_12"},
                    ]
                }
            ]
                        

            $scope.listDataumum13 = [
                { "id": 1, "nama": "G. Muskuloskeletal", "detail": 
                    [                   
                        { "id": 56, "nama": "kemampuan pegerakan sendi" , "type": "checkbox","grid":"grid_12"},
                        { "id": 57, "nama": "kontraktur" , "type": "checkbox","grid":"grid_12"},
                        { "id": 58, "nama": "Fraktur, Lokasi" , "type": "checkbox","grid":"grid_3"},
                        { "id": 59, "nama": "" , "type": "textbox","grid":"grid_4   "},
                        { "id": 60, "nama": "Lain-lain" , "type": "checkbox","grid":"grid_12"},
                    ]
                }
            ]

            $scope.listDataumum15 = [
                { "id": 1, "nama": "H. Kulit", "detail": 
                    [                   
                        { "id": 61, "nama": "Kulit Kering, Lokasi" , "type": "checkbox","grid":"grid_12"},
                        { "id": 62, "nama": "Oedema" , "type": "checkbox","grid":"grid_12"},
                        { "id": 63, "nama": "Decubitus" , "type": "checkbox","grid":"grid_12"},
                        { "id": 64, "nama": "Luka" , "type": "checkbox","grid":"grid_12"},
                    ]
                }
            ]

            $scope.listDataumum17 = [
                { "id": 1, "nama": "II. PSIKOLOGIS", "detail": 
                    [
                        { "id": 65, "nama": "Marah" , "type": "checkbox","grid":"grid_4"},
                        { "id": 66, "nama": "Sedih" , "type": "checkbox","grid":"grid_4"},
                        { "id": 67, "nama": "Tenang" , "type": "checkbox","grid":"grid_2"},
                        { "id": 68, "nama": "Kesenjangan Komunikasi" , "type": "checkbox","grid":"grid_4"},
                        { "id": 69, "nama": "Menarik diri" , "type": "checkbox","grid":"grid_4"},
                        { "id": 70, "nama": "Putus asa" , "type": "checkbox","grid":"grid_4"},
                        { "id": 71, "nama": "Hilang kontrol diri" , "type": "checkbox","grid":"grid_4"},
                        { "id": 72, "nama": "Ketergantungan" , "type": "checkbox","grid":"grid_4"},
                        { "id": 73, "nama": "Cemas" , "type": "checkbox","grid":"grid_4"},
                        { "id": 74, "nama": "Takut" , "type": "checkbox","grid":"grid_4"},
                    ]
                }
            ]

            $scope.listDataumum19 = [
                { "id": 1, "nama": "III. SOSIAL", "detail": 
                    [

                        { "id": 75, "nama": "Mudah tersinggung" , "type": "checkbox","grid":"grid_12"},
                        { "id": 76, "nama": "Tidak ingin berkomunikasi" , "type": "checkbox","grid":"grid_12"},
                        { "id": 77, "nama": "Sering bertanya tentang penyakitnya" , "type": "checkbox","grid":"grid_12"},
                        { "id": 78, "nama": "Mengisolasi diri" , "type": "checkbox","grid":"grid_12"},

                    ]
                }
            ]

            $scope.listDataumum21 = [
                { "id": 1, "nama": "IV. SPRITUAL", "detail": 
                    [

                        { "id": 79, "nama": "Permintaan kehadiran Keluarga" , "type": "checkbox","grid":"grid_12"},
                        { "id": 80, "nama": "Permintaan kehadiran rohaniawan" , "type": "checkbox","grid":"grid_12"},
                        { "id": 81, "nama": "Permintaan ritual keaagamaan/budaya khusus" , "type": "checkbox","grid":"grid_12"},
                    ]
                        
                }
            ]

            $scope.listDataumum23 = [
                { "id": 1, "nama": "V. KELUARGA", "detail": 
                    [       

                        { "id": 82, "nama": "Pnejelasang tentang tindakan medis dan alat yang di gunakan" , "type": "checkbox","grid":"grid_12"},
                        { "id": 83, "nama": "Penjelasan tentang kondisi pasien" , "type": "checkbox","grid":"grid_12"},
                        
                    ]
                }
            ]
             $scope.listDataumum2 = [
                { "id": 1, "nama": "A. Pernafasan", "detail": 
                    [   
                        
                        { "id": 84, "nama": "Observasi pernafasan", "type": "checkbox","grid":"grid_12" }, 
                        { "id": 85, "nama": "Atur/Ubah Posisi pasien" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 86, "nama": "Ajarkan pada pasien teknik batuk efecktif" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 87, "nama": "Ajarkan pada pasien teknik relaksasi nafas dalam" , "type": "checkbox","grid":"grid_12"}, 
                        { "id": 88, "nama": "Lakukan Fisio terapi dada", "type": "checkbox","grid":"grid_12" },
                        { "id": 89, "nama": "Lakukan suction", "type": "checkbox","grid":"grid_12" },
                        { "id": 90, "nama": "Beri terapi ekspektoran", "type": "checkbox","grid":"grid_12" }, 
                        { "id": 91, "nama": "Berikan terapi Nebulizer", "type": "checkbox","grid":"grid_12" } ,
                        { "id": 92, "nama": "Beri oksigen sesuai kebutuhan", "type": "checkbox","grid":"grid_12" },
                        { "id": 93, "nama": "Pasang alat bantu nafas (bila perlu)", "type": "checkbox","grid":"grid_12" },

                    ]
                }
            ]

             $scope.listDataumum4 = [
                { "id": 1, "nama": "B. Kardiovaskuler", "detail": 
                    [  
                        { "id": 94, "nama": "Obeservasi tanda-tanda Vital", "type": "checkbox","grid":"grid_12" },
                        { "id": 95, "nama": "Cek AGD", "type": "checkbox","grid":"grid_12" },
                        { "id": 96, "nama": "Beri oksigen sesuai kebutuhan", "type": "checkbox","grid":"grid_12" },
                        { "id": 97, "nama": "Pertahankan keadekuatan alur infus", "type": "checkbox","grid":"grid_12" },
                    ]
                }
            ]

             $scope.listDataumum6 = [
                        { "id": 1, "nama": "C. Persyarafan", "detail":  
                        [                
                        { "id": 98, "nama": "Obeservasi tingkat kesadaran dan GCS", "type": "checkbox","grid":"grid_12" },
                        { "id": 99, "nama": "Pantau tanda-tanda vital dan pupil", "type": "checkbox","grid":"grid_12" },
                        { "id": 100, "nama": "Tinggikan posisi kepala 15-45°", "type": "checkbox","grid":"grid_12" },
                        { "id": 101, "nama": "Berikan oksigen sesuai kebutuhan", "type": "checkbox","grid":"grid_12" },
                        { "id": 102, "nama": "Lakukan suction", "type": "checkbox","grid":"grid_12" },
                        { "id": 103, "nama": "Cek AGD dan elektronik", "type": "checkbox","grid":"grid_12" },
                        { "id": 104, "nama": "Pasang alat bantu nafas (bila perlu)", "type": "checkbox","grid":"grid_12" },
                    ]
                }
            ]


             $scope.listDataumum8 = [
                        { "id": 1, "nama": "D. Eliminasi", "detail":
                        [

                        { "id": 105, "nama": "Monitor intake-output cairan", "type": "checkbox","grid":"grid_12" },
                        { "id": 106, "nama": "Beri terapi pencahar", "type": "checkbox","grid":"grid_12" },
                        { "id": 107, "nama": "Pasang keteter urine", "type": "checkbox","grid":"grid_12" },
                        { "id": 108, "nama": "Pasang underpad/diaper", "type": "checkbox","grid":"grid_12" },
                        { "id": 109, "nama": "Ukur intake/output", "type": "checkbox","grid":"grid_12" },
                        ]
                    }
                ]

             $scope.listDataumum10 = [
                        { "id": 1, "nama": "E. Nutri dan Cairan", "detail":
                        [   
                        { "id": 110, "nama": "Beri nutrisi dan cairan yang adekuat", "type": "checkbox","grid":"grid_12" },
                        { "id": 111, "nama": "Beri nutrisi dan cairan melalui NGT", "type": "checkbox","grid":"grid_12" },
                        { "id": 112, "nama": "Kolaborasi dengan ahli gizi", "type": "checkbox","grid":"grid_12" },

                        { "id": 113, "nama": "Ajarkan teknik relaksasi", "type": "checkbox","grid":"grid_12" },
                        { "id": 114, "nama": "Ciptakan lingkungan yang nyaman", "type": "checkbox","grid":"grid_12" },
                        { "id": 115, "nama": "Pemberian terapi analgetik :", "type": "checkbox","grid":"grid_12"},
                        { "id": 116, "nama": "Terapi oral : ", "type": "textbox","grid":"grid_6" },
                        // { "id": 117, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },
                        { "id": 118, "nama": "Terapi injeksi : ", "type": "textbox","grid":"grid_6" },
                        // { "id": 119, "nama": "", "type": "textboxtanpalabel","grid":"grid_6" },
                    ]
                }
            ]


             $scope.listDataumum12 = [
                        { "id": 1, "nama": "G. Muskuloskeletal", "detail":
                        [
                        { "id": 120, "nama": "Bantu aktivitas pasien", "type": "checkbox","grid":"grid_12" },
                        { "id": 121, "nama": "Libatkan keluarga dalam aktifitas pasien", "type": "checkbox","grid":"grid_12" },
                        { "id": 122, "nama": "Bantu Pasien dalam latihan gerak aktif/pasif pada ekstremitas", "type": "checkbox","grid":"grid_12" },
                        ]
                    }
                ]


             $scope.listDataumum14 = [
                        { "id": 1, "nama": "H. Kulit", "detail":
                        [
                        { "id": 123, "nama": "Lakukan aktifitas hygiene", "type": "checkbox","grid":"grid_12" },
                        { "id": 124, "nama": "Ganti dan bersihkan alas tempat tidur jika basah/kotor", "type": "checkbox","grid":"grid_12" },
                        { "id": 125, "nama": "Lakukan pijatan dengan minyak pada area tertekan", "type": "checkbox","grid":"grid_12" },
                        { "id": 126, "nama": "Pasang tilam angin", "type": "checkbox","grid":"grid_12" },
                        { "id": 127, "nama": "Ubah posisi tiap 2 jam", "type": "checkbox","grid":"grid_12" },
                        ]
                    }
                ]


             $scope.listDataumum16 = [
                        { "id": 1, "nama": "II. PSIKOLOGIS", "detail":
                        [
                        { "id": 128, "nama": "Beri dukungan mental", "type": "checkbox","grid":"grid_12" },
                        { "id": 129, "nama": "Berikan privasi/waktu bagi pasien untuk melakukan praktik keagamaan", "type": "checkbox","grid":"grid_12" },
                        { "id": 130, "nama": "Dampingi pasien dan keluarga", "type": "checkbox","grid":"grid_12" },
                        { "id": 131, "nama": "Beri waktu bagi keluarga untuk mendapingi pasien", "type": "checkbox","grid":"grid_12" },
                        { "id": 132, "nama": "Beri penjelasan pada keluarga pasien tentang kondisi pasien dan tindakan/alat medik yang digunakan", "type": "checkbox","grid":"grid_12" },
                        { "id": 133, "nama": "Ciptakan suasana yang tenang", "type": "checkbox","grid":"grid_12" },
                        { "id": 134, "nama": "Penuhi kebutuhan spritual", "type": "checkbox","grid":"grid_12" },
                        { "id": 135, "nama": "Kolaborasi dengan bagian pastoral/rohaniawan", "type": "checkbox","grid":"grid_12" },
                        { "id": 136, "nama": "Libatkan keluarga dalam perawatan pasien", "type": "checkbox","grid":"grid_12" },
                

                        

                  
                    ]
                }
            ]
            
              var getTotal = function() {
                var skorAwal = 0;
                $scope.arrNIPS.forEach(function(data) {
                    skorAwal += parseInt(data.descNilai);
                })
                $scope.totalSkor = skorAwal
            };
            $scope.cekSkor = function(id, idparent, descnilai, value) {
                var result = $.grep($scope.arrNIPS, function(e) {
                  
                    // return e.idParent == idparent;
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
                getTotal();
            }
            function init() {
                var objectfk = "ATRS";
                $scope.item.tglpengkajian=$scope.now;
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
                                if(res == 150){
                                    $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , namaruangan:$scope.dataEdukasi[i].nilai}                                        
                                };
                                if(res == 151){
                                    $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , namalengkap:$scope.dataEdukasi[i].nilai}                                        
                                };

                                if(res == 153){
                                    $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , namalengkap:$scope.dataEdukasi[i].nilai}                                        
                                };
                                if(res == 3000){
                                    $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , namalengkap:$scope.dataEdukasi[i].nilai}                                        
                                };
                                if(res == 3560){
                                    $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , diagnosa:$scope.dataEdukasi[i].nilai}                                        
                                }; 

                                if(res == 154){
                                    $scope.item.obj[res] =  {id:$scope.dataEdukasi[i].satuan , diagnosa:$scope.dataEdukasi[i].nilai}                                        
                                }; 

                                $scope.item.norecval[res] = $scope.dataEdukasi[i].norec
                                
                            }
                            else{
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
                            if(nilai == undefined){
                                nilai = $scope.item.obj[parseInt(arrobj[i])].diagnosa;
                            }
                        }
                        var jenis = "combobox"
                        var satuan = $scope.item.obj[parseInt(arrobj[i])].id;
                    }
                    var urutan = arrobj[i]
                    var object = "ATRS000"+urutan  
                    // var norectmp = "ATRS000"+urutan    
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
                        break;
                    }
                    if (tempData[i].norec == undefined) {
                        tempData[i].norec = '-'
                    }
                }

                var jsonSave = {
                    data: tempData,
                    noregistrasifk: $state.params.noRec,
                    riwayatpapfk: $scope.noRecPap,
                    objecthead: "ATRS"
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