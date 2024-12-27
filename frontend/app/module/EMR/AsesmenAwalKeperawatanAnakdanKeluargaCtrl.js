define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperawatanAnakdanKeluargaCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'ModelItem',
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
            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            if (chacePeriode != undefined) {
                debugger
                //var arrPeriode = chacePeriode.split(':');
                $scope.item.noMr = chacePeriode[0]
                nocm_str = chacePeriode[0]
                $scope.item.namaPasien = chacePeriode[1]
                $scope.item.jenisKelamin = chacePeriode[2]
                $scope.item.noregistrasi = chacePeriode[3]
                noRegistrasi = chacePeriode[3]
                $scope.item.umur = chacePeriode[4]
                $scope.item.kelompokPasien = chacePeriode[5]
                $scope.item.tglRegistrasi = chacePeriode[6]
                norec_apd = chacePeriode[7]
                norec_pd = chacePeriode[8]
                $scope.item.idKelas = chacePeriode[9]
                $scope.item.kelas = chacePeriode[10]
                $scope.item.idRuangan = chacePeriode[11]
                $scope.item.namaRuangan = chacePeriode[12]
                $scope.header.DataNoregis = chacePeriode[13]
                if ($scope.header.DataNoregis == undefined) {
                    $scope.header.DataNoregis = false;
                }

            }
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
                        { "id": 9, "nama": "Diagnosa medik", "type": "diagnosa" },
                        { "id": 10, "nama": "berat badan", "type": "textbox","grid":"grid_6" },
                        { "id": 11, "nama": "Jenis Kelamin", "type": "label","grid":"grid_2" },
                        { "id": 12, "nama": "Laki-laki", "type": "checkbox","grid":"grid_2" },
                        { "id": 13, "nama": "Perempuan", "type": "checkbox","grid":"grid_2" },
                        { "id": 14, "nama": "Tinggi Badan", "type": "textbox","grid":"grid_6" },                        
                        // { "id": 15, "nama": "Status Perkawinan", "type": "label","grid":"grid_2" },
                        // { "id": 16, "nama": "Kawin", "type": "checkbox","grid":"grid_1" },
                        // { "id": 17, "nama": "Tidak Kawin", "type": "checkbox","grid":"grid_1" },
                        // { "id": 18, "nama": "Duda/Janda", "type": "checkbox","grid":"grid_2" },
                        { "id": 20, "nama": "Alamat", "type": "textbox","grid":"grid_6" },
                        { "id": 21, "nama": "Agama", "type": "textbox","grid":"grid_6" },
                        // { "id": 22, "nama": "Kondisi saat masuk", "type": "label","grid":"grid_2" },
                        // { "id": 23, "nama": "Mandiri", "type": "checkbox","grid":"grid_1" },
                        // { "id": 24, "nama": "Kursi Roda", "type": "checkbox","grid":"grid_1" },
                        // { "id": 25, "nama": "Dipapah", "type": "checkbox","grid":"grid_1" },
                        // { "id": 26, "nama": "Tempat tidur", "type": "checkbox","grid":"grid_1" },                        
                        { "id": 27, "nama": "Nama Ayah", "type": "textbox","grid":"grid_6" },
                        { "id": 28, "nama": "Nama Ibu", "type": "textbox","grid":"grid_6" },                
                        { "id": 29, "nama": "Data diperolehdari", "type": "label","grid":"grid_2" },
                        { "id": 30, "nama": "Anak", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 31, "nama": "Orang tua/Wali/Orang terdekat", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 32, "nama": "enter", "type": "enter","grid":"grid_1" },  
                        // { "id": 33, "nama": "Yang dapat dihubungi", "type": "textbox","grid":"grid_6" },  
                        // { "id": 34, "nama": "enter", "type": "enter","grid":"grid_1" },  
                        // { "id": 35, "nama": "Hubungan", "type": "textbox","grid":"grid_6" },   
                        // { "id": 36, "nama": "Asal Pasien", "type": "label","grid":"grid_1" },
                        // { "id": 37, "nama": "Poliklinik", "type": "checkbox","grid":"grid_2" }, 
                        // { "id": 38, "nama": "IGD", "type": "checkbox","grid":"grid_2" }, 
                        // { "id": 39, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                        // { "id": 40, "nama": "No telp pj", "type": "textbox","grid":"grid_6" },  
                        { "id": 41, "nama": "Bahasa yang digunakan", "type": "textbox","grid":"grid_6" },
                        { "id": 42, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                        { "id": 43, "nama": "Data yang di proleh dari pemberi informasi", "type": "label","grid":"grid_2" },
                        { "id": 44, "nama": "Sebagian", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 45, "nama": "Seluruh", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 46, "nama": "enter", "type": "enter","grid":"grid_1" }, 

                    ]
                }
            ]
             $scope.listAnamnesis1 = [
                { "id": 2, "nama": "Data Umum", "detail": 
                    [
                        { "id": 47, "nama": "Keluhan Utama (Alasan masuk Rumah sakit)" , "type": "textarea","grid":"grid_12"}, 
                        { "id": 48, "nama": "Keluhan yang menyertai" , "type": "textarea","grid":"grid_12"}, 
                        { "id": 49, "nama": "Riwayat Penyakit Sekarang" , "type": "textarea","grid":"grid_12"}, 
                        { "id": 50, "nama": "Waktu dan tempat pengobatan terakhir" , "type": "textarea","grid":"grid_12"},
                        { "id": 51, "nama": "Ada obat-obat yang rutin diberikan selama ini :" , "type": "label","grid":"grid_4"}, 
                        { "id": 52, "nama": "Tidak ada", "type": "checkbox","grid":"grid_2" },
                        { "id": 53, "nama": "Ada, Sebutkan", "type": "checkbox","grid":"grid_2" },
                        { "id": 54, "nama": "", "type": "textboxtanpalabel","grid":"grid_2"}, 
                        { "id": 55, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 56, "nama": "Riwayat Alergi :   ", "type": "label","grid":"grid_1" },
                        { "id": 57, "nama": "Tidak ada", "type": "checkbox","grid":"grid_2" },
                        { "id": 58, "nama": "Makanan", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 59, "nama": "", "type": "textboxtanpalabel","grid":"grid_2","style": "margin-left: 18px;" },  
                        { "id": 60, "nama": "Obat", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 61, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },  
                        { "id": 62, "nama": "Plester", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 63, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },
                        { "id": 64, "nama": "Lain-lain", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 65, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },
                        { "id": 66, "nama": "Reaksi", "type": "textbox","grid":"grid_10" },                          
                        { "id": 67, "nama": "Pernah dirawat :", "type": "label","grid":"grid_12" }, 
                        { "id": 68, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },  
                        { "id": 69, "nama": "Ya :", "type": "checkbox","grid":"grid_1" },
                       
                        { "id": 71, "nama": "Kapan", "type": "textbox","grid":"grid_3" }, 
                        { "id": 72, "nama": "Dimana", "type": "textbox","grid":"grid_3" }, 
                        { "id": 73, "nama": "Sakit Apa", "type": "textbox","grid":"grid_3" }, 
                        { "id": 74, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                        { "id": 75, "nama": "Pernah Operasi :", "type": "label","grid":"grid_12" }, 
                        { "id": 76, "nama": "Tidak", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 77, "nama": "Ya :", "type": "checkbox","grid":"grid_1" },
                        { "id": 78, "nama": "Kapan", "type": "textbox","grid":"grid_3" }, 
                        { "id": 79, "nama": "Dimana", "type": "textbox","grid":"grid_3" }, 
                        { "id": 80, "nama": "Sakit Apa", "type": "textbox","grid":"grid_3" }, 
                        { "id": 81, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                        { "id": 82, "nama": "Riwayat Penyakit keluarga", "type": "textarea","grid":"grid_12" }, 
                       
                        
                        
                        { "id": 83, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 84, "nama": "Riwayat imunokompromais", "type": "label","grid":"grid_12" }, 
                        { "id": 85, "nama": "Infeksi telinga baru sebanyak 8 (delapan) kali atau lebih dalam setahun", "type": "checkbox","grid":"grid_12" },
                        { "id": 86, "nama": "Infeksi berat pada sinus sebanyak 2 (dua) kali atau lebih dalam setahun", "type": "checkbox","grid":"grid_12" },
                        { "id": 87, "nama": "Penggunaan antibiotika tanpa dampak selama 2 (dua) bulan atau lebih", "type": "checkbox","grid":"grid_12" },
                        { "id": 88, "nama": "Pneumonia sebanyak 2 (dua) kali atau lebih dalam setahun", "type": "checkbox","grid":"grid_12" },
                        { "id": 89, "nama": "Gagal tumbuh pada bayi", "type": "checkbox","grid":"grid_12" },
                        { "id": 90, "nama": "Adanya abses dalam atau berulang pada kulit atau organ lainnya", "type": "checkbox","grid":"grid_12" },
                        { "id": 91, "nama": "Adanya sariawan yang menetap atau luka pada kulit", "type": "checkbox","grid":"grid_12" },
                        { "id": 92, "nama": "Memerlukan antibiotika intravena untuk infeksi", "type": "checkbox","grid":"grid_12" },
                        { "id": 93, "nama": "Terdapat 2 (dua) atau lebih infeksi dalam (misalnya meningitis, osteomielitis, selulitis, sepsis)", "type": "checkbox","grid":"grid_12" },
                        { "id": 94, "nama": "Adanya riwayat keluarga terhadap imunodefisiensi primer", "type": "checkbox","grid":"grid_12" },
                        { "id": 95, "nama": "Adanya infeksi yang tidak berespon dengan terapi antibiotika", "type": "checkbox","grid":"grid_12" },
                        { "id": 96, "nama": "Adanya proses pemulihan yang terlambat atau tak sempurna", "type": "checkbox","grid":"grid_12" },
                        { "id": 97, "nama": "Adanya jenis kanker (misalnya sarkoma Kaposi atau limfoma Non-Hodgkins)", "type": "checkbox","grid":"grid_12" },
                        { "id": 98, "nama": "Adanya infeksi oportunistik (misalnya pneumonia Pneumocystis carinii atau infeksi jamur berulang)", "type": "checkbox","grid":"grid_12" },
                        { "id": 99, "nama": "Jika ada satu yang dicentang, lanjut ke 'Asesmen Pasien dengan Daya Imun yang Dilemahkan.Imunosupresi(RM.C.24)'", "type": "label","grid":"grid_12" }, 
                    ]
                }
            ] 
            $scope.listnyeri22 = [
                { "id": 3, "nama": "nyeri", "detail": 
                    [
                    { "id": 100, "nama": "Nyeri :", "type": "label","grid":"grid_1" },
                    { "id": 101, "nama": "Ya   ", "type": "checkbox","grid":"grid_1" },
                    { "id": 102, "nama": "Tidak  ", "type": "checkbox","grid":"grid_1" },
                    { "id": 103, "nama": "Tidak bisa dinilai ", "type": "checkbox","grid":"grid_4" },

                    { "id": 104, "nama": "enter", "type": "enter","grid":"grid_1" },

                    { "id": 105, "nama": "Jenis :", "type": "label","grid":"grid_1" },
                    { "id": 106, "nama": "Akut ", "type": "checkbox","grid":"grid_1" },
                    { "id": 107, "nama": "Kronis ", "type": "checkbox","grid":"grid_1" },
                    
                    ]
                }
            ]

            $scope.ambilPengkajianMedisIGD = function() {
                $scope.dokter = false;
                medifirstService.get('emr/get-pengkajian-awal-medis-igd?noRegistrasi=' + $scope.item.noregistrasi).then(function(dat) {
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        $scope.item.obj[49] = " Riwayat penyakit sekarang " + pengkajianmedis[i].value
                    }
                })
            }

            $scope.listskrining = [
                { "id": 4, "nama": "Kesimpulan :", "detail": 
                    [
                    { "id": 108, "nama": "Kesimpulan : Skor Nyeri :", "type": "label","grid":"grid_2" },
                    { "id": 109, "nama": "Tidak Nyeri (0)", "type": "checkbox","grid":"grid_2" },
                    { "id": 110, "nama": "Ringan (1-3) ", "type": "checkbox","grid":"grid_2" },
                    { "id": 111, "nama": "Sedang (4-6)", "type": "checkbox","grid":"grid_2" },
                    { "id": 112, "nama": "Berat (7-10) ", "type": "checkbox","grid":"grid_2" },
                    ]
                }
            ]
            $scope.listnyeri23 = [
                { "id": 3, "nama": "nyeri", "detail": 
                    [
                    { "id": 124, "nama": "Nyeri :", "type": "label","grid":"grid_1" },
                    { "id": 125, "nama": "Ya   ", "type": "checkbox","grid":"grid_1" },
                    { "id": 126, "nama": "Tidak  ", "type": "checkbox","grid":"grid_1" },
                    { "id": 127, "nama": "Tidak bisa dinilai ", "type": "checkbox","grid":"grid_4" },

                    { "id": 128, "nama": "enter", "type": "enter","grid":"grid_1" },

                    { "id": 129, "nama": "Jenis :", "type": "label","grid":"grid_1" },
                    { "id": 130, "nama": "Akut ", "type": "checkbox","grid":"grid_1" },
                    { "id": 131, "nama": "Kronis ", "type": "checkbox","grid":"grid_1" },
                    
                    ]
                }
            ]
            $scope.listNyeriAnak = [{
                "id": 10,
                "nama": "Hurts",
                "detail": [{ "id": 132, "nama": "No Hurt", "descNilai": 4 },
                    { "id": 133, "nama": "Hurts Little Bit", "descNilai": 6 }, { "id": 3, "nama": "Hurts Little More", "descNilai": 0 },
                    { "id": 134, "nama": "Hurts Even More", "descNilai": 8 }, { "id": 5, "nama": "Hurts Whole Lot", "descNilai": 2 },
                    { "id": 135, "nama": "Hurts whorts", "descNilai": 10 }
                ]
            }]
              $scope.listSkorWong = [{
                "id": 10,
                "nama": "Score Nyeri :",
                "detail": [
                    { "id": 114, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                    { "id": 115, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                    { "id": 116, "nama": "4 - 5", "type": "checkbox", "ket": "= Ringan" },
                    { "id": 117, "nama": "6 - 7", "type": "checkbox", "ket": "= Sedang" },
                    { "id": 118, "nama": "8 - 9", "type": "checkbox", "ket": "= Berat" },
                    { "id": 119, "nama": "10", "type": "checkbox", "ket": "= Sangat Berat" },
                ]
            }
        ]
        $scope.listNyeriAnak2 = [{
            "id": 10,
            "nama": "Kesimpulan :",
            "detail": [
                { "id": 114, "nama": "0", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                { "id": 115, "nama": "2", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                { "id": 116, "nama": "4", "type": "checkbox", "ket": "= Ringan" },
                { "id": 117, "nama": "6", "type": "checkbox", "ket": "= Sedang" },
                { "id": 118, "nama": "8", "type": "checkbox", "ket": "= Berat" },
                { "id": 119, "nama": "10", "type": "checkbox", "ket": "= Sangat Berat" },
            ]
        }
    ]
        $scope.listKesimpulan= [
            { "id": 11, "nama": "Kesimpulan", "detail": 
                [ 
                    { "id": 166, "nama": "Resiko jatuh rendah (7-11)", "type": "checkbox","grid":"grid_2" },
                    { "id": 167, "nama": "Risiko Jatuh Tinggi (>12)", "type": "checkbox","grid":"grid_2" },
                    { "id": 168, "nama": "", "type": "enter","grid":"grid_1" },

                    { "id": 169, "nama": "Jika Skor > 12 Maka :", "type": "label","grid":"grid_2" },
                    { "id": 170, "nama": "Pasang Pin Kuning Pada Gelang", "type": "checkbox","grid":"grid_2" },
                    { "id": 171, "nama": "Lakukan Tindakan Pencegahan jatuh yang terdapat pada formulir MONITORING", "type": "checkbox","grid":"grid_6" },
                ]
            }
        ]

             $scope.listkesadaran = [
                { "id": 12, "nama": "Kesadaran", "detail": 
                    [ 
                        { "id": 193, "nama": "Kesadaran", "type": "label","grid":"grid_2" },  
                        { "id": 194, "nama": "CM", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 195, "nama": "Apatis", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 196, "nama": "Somnolent", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 197, "nama": "Soporous", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 198, "nama": "Koma", "type": "checkbox","grid":"grid_1" }, 
                    ]
                }
            ]
            $scope.listFisik = [{
                "id": 11,
                "nama": "Kepala",
                "detail": [
                    { "id": 214, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 215, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 216, "nama": "Haematom", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 217, "nama": "lesi", "type": "checkbox","grid":"grid_1" }, 
                    { "id": 218, "nama": "lokasi :", "type": "checkbox","grid":"grid_1" },
                    { "id": 219, "nama": " ", "type": "textboxtanpalabel","grid":"grid_2" }
                ]
            },{
                "id": 12,
                "nama": "Rambut",
                "detail": [
                    { "id": 220, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 221, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 222, "nama": "Berminyak", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 223, "nama": "Kering", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 224, "nama": "Rontok", "type": "checkbox" ,"grid":"grid_1" },                 
                ]
            },{
                "id": 13,
                "nama": "Muka",
                "detail": [
                    { "id": 225, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 226, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_1" },                 
                ]
            },{
                "id": 14,
                "nama": "Mata",
                "detail": [
                    { "id": 227, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 228, "nama": "Gangguan Penglihatan", "type": "checkbox" ,"grid":"grid_2" },                     
                    { "id": 229, "nama": "Sklera Ikterik", "type": "checkbox" ,"grid":"grid_2" },                     
                    { "id": 230, "nama": "Konjungtiva merah", "type": "checkbox" ,"grid":"grid_2" },                     
                    { "id": 231, "nama": "Konjungtiva Anemis", "type": "checkbox" ,"grid":"grid_2" },   
                    { "id": 232, "nama": "enter", "type": "enter","grid":"grid_1" },
                    { "id": 232, "nama": "enter", "type": "enter","grid":"grid_1" },                    
                    { "id": 233, "nama": "Pupil :", "type": "checkbox" ,"grid":"grid_2" },                    
                    { "id": 234, "nama": "Anisokor ", "type": "checkbox" ,"grid":"grid_1" },                    
                    { "id": 235, "nama": "Midriasis ", "type": "checkbox" ,"grid":"grid_1" },                    
                    { "id": 236, "nama": "Miosis", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 237, "nama": "enter", "type": "enter","grid":"grid_1" }, 
                    { "id": 237, "nama": "enter", "type": "enter","grid":"grid_1" },   
                    { "id": 238, "nama": "Refleksi Cahaya :", "type": "checkbox" ,"grid":"grid_2" },                    
                    { "id": 239, "nama": "Positif ", "type": "checkbox" ,"grid":"grid_1" },                    
                    { "id": 240, "nama": "Negatif ", "type": "checkbox" ,"grid":"grid_1" },                     
                ]
            },{
                "id": 15,
                "nama": "Telinga",
                "detail": [
                    { "id": 241, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 242, "nama": "Berdengung", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 243, "nama": "Penurunan Pendengaran", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 244, "nama": "Keluar Cairan", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 245, "nama": "Serumen", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 246, "nama": "Nyeri", "type": "checkbox" ,"grid":"grid_1" },
                    { "id": 247, "nama": "Memakai alat bantu dengar", "type": "checkbox" ,"grid":"grid_3" },                 
                ]
            },{
                "id": 15,
                "nama": "Hidung",
                "detail": [
                    { "id": 248, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 249, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 250, "nama": "Epistaksis", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 251, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_3" },                
                ]
            },{
                "id": 17,
                "nama": "Mulut",
                "detail": [
                    { "id": 252, "nama": "Simetrsis ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 253, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 254, "nama": "Pucat", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 255, "nama": "Sianosis", "type": "checkbox" ,"grid":"grid_1" }               
                ]
            },{
                "id": 18,
                "nama": "Gigi",
                "detail": [
                    { "id": 256, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 257, "nama": "Karies", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 258, "nama": "Goyang", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 259, "nama": "Tambal", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 260, "nama": "Gigi Palsu", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 261, "nama": "Geraham Asiemtris", "type": "checkbox" ,"grid":"grid_2" },
                    { "id": 262, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_3" },                 
                ]
            },{
                "id": 19,
                "nama": "Lidah",
                "detail": [
                    { "id": 263, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 602, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 264, "nama": "Mukosa Kering", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 265, "nama": "Deviasi Lateral/Asimetris", "type": "checkbox" ,"grid":"grid_2" }, 
                ]
            },{
                "id": 20,
                "nama": "Tenggorokan",
                "detail": [
                    { "id": 266, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 267, "nama": "Faring merah", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 268, "nama": "Sakit menelan", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 269, "nama": "Tonsil membesar", "type": "checkbox" ,"grid":"grid_1" }, 
                ]
            },{
                "id": 21,
                "nama": "Leher",
                "detail": [
                    { "id": 270, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 271, "nama": "Pembesaran Tiroid", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 272, "nama": "Bendungan vena jugularis", "type": "checkbox" ,"grid":"grid_2" }, 
                    { "id": 273, "nama": "Kaku kuduk", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 274, "nama": "Keterbatasan", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 275, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_3" }, 
                ]
            },{
                "id": 22,
                "nama": "Dada",
                "detail": [
                    { "id": 276, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 278, "nama": "Asimetris", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 279, "nama": "Retraksi", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 280, "nama": "Ronchi", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 281, "nama": "Rales", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 282, "nama": "Wheezing", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 283, "nama": "Murmur", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 284, "nama": "Nyeri Dada", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 285, "nama": "Aritmia", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 286, "nama": "Takikardia", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 287, "nama": "Bradikardia", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 288, "nama": "Palpitasi", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 289, "nama": "Lain-lai", "type": "textbox" ,"grid":"grid_2" }, 
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                ]
            },{
                "id": 23,
                "nama": "Abdomen",
                "detail": [
                    { "id": 290, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 291, "nama": "Kembung", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 292, "nama": "Ascites", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 293, "nama": "Benjnolan/masa", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 294, "nama": "Lokasi", "type": "textboxt" ,"grid":"grid_3" },  
                    { "id": 295, "nama": "Bising usus", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 296, "nama": "", "type": "textboxtanpalabel" ,"grid":"grid_2" },  
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                ]
            },
            // {
            //     "id": 5,
            //     "nama": "Genetalia",
            //     "detail": [
            //     ]
            // },
            {
                "id": 24,
                "nama": "Wanita",
                "detail": [
                    { "id": 297, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 298, "nama": "sekret", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 299, "nama": "warna", "type": "textbox" ,"grid":"grid_3" },  
                    { "id": 300, "nama": "Porlaps uteri", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 301, "nama": "Fistual anal", "type": "textboxt" ,"grid":"grid_4" },  
                    { "id": 302, "nama": "Haemoroid", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 303, "nama": "Hamil", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 304, "nama": "Ya", "type": "checkbox" ,"grid":"grid_1" }, 
                    { "id": 305, "nama": "Tidak", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 306, "nama": "Menopause", "type": "checkbox" ,"grid":"grid_1" },  
                    { "id": 307, "nama": "Menstruasi terakhir", "type": "textbox" ,"grid":"grid_4" },                      
                    { "id": 308, "nama": "Keluhan menstruasi", "type": "checkbox" ,"grid":"grid_1" },             
                    { "id": 309, "nama": "tidak", "type": "checkbox" ,"grid":"grid_1" },             
                    { "id": 310, "nama": "ya,sebutkan", "type": "textbox" ,"grid":"grid_4" },       
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                ]
            },{
                "id": 25,
                "nama": "Pria",
                "detail": [
                { "id": 311, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 312, "nama": "Phimosis", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 313, "nama": "Hernia", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 314, "nama": "Haemoroid", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 315, "nama": "Orchitis", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 316, "nama": "Sekret warna", "type": "textbox" ,"grid":"grid_4" }, 
                    
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                ]
            },{
                "id": 26,
                "nama": "Integumen",
                "detail": [
                { "id": 317, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 318, "nama": "Turgor Jelek", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 319, "nama": "Dingin", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 320, "nama": "Bullae", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 321, "nama": "Fistula", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 322, "nama": "Iketrik", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 323, "nama": "Diofersi", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 324, "nama": "Pucat", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 325, "nama": "Dekubitus,Derajat", "type": "textbox" ,"grid":"grid_4" }, 
                { "id": 326, "nama": "Lokasi", "type": "textbox" ,"grid":"grid_2" }, 
                { "id": 327, "nama": "Luka", "type": "label" ,"grid":"grid_1" }, 
                { "id": 328, "nama": "Tidak ada", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 329, "nama": "Lokasi", "type": "textbox" ,"grid":"grid_2" },  
                { "id": 330, "nama": "Kondisi", "type": "label" ,"grid":"grid_1" }, 
                { "id": 331, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 332, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 333, "nama": "jahitan luka", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 334, "nama": "ada", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 335, "nama": "tidak ada", "type": "checkbox" ,"grid":"grid_1" },
                { "id": 336, "nama": "Balutan", "type": "label" ,"grid":"grid_1" }, 
                { "id": 337, "nama": "Bersih", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 338, "nama": "Kotor", "type": "checkbox" ,"grid":"grid_1" },   
                    
                    // { "id": 3502, "nama": "", "type": "checkbox" ,"grid":"grid_1" }, 
                ]
            },{
                "id": 27,
                "nama": "Extremitas",
                "detail": [
                { "id": 339, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 340, "nama": "Kelemahan otot", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 341, "nama": "Kejang", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 342, "nama": "Tremor", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 343 ,"nama": "Plegi di", "type": "textbox" ,"grid":"grid_2" }, 
                { "id": 344, "nama": "Parase di", "type": "textbox" ,"grid":"grid_2" },  
                { "id": 345, "nama": "indkoordinasi", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 346, "nama": "Kelinan kogenital", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 347, "nama": "Deformitas/atropi", "type": "textbox" ,"grid":"grid_4" }, 
                { "id": 348, "nama": "Fraktur,Lokasi", "type": "textbox" ,"grid":"grid_4" }, 
                { "id": 349, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_3" }, 
                ]
            },{
                "id": 28,
                "nama": "Eliminasi",
                "detail": [
                { "id": 350, "nama": "t.a.k ", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 351, "nama": "Diare", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 352, "nama": "Konstipasi", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 353, "nama": "Inkonentia alvi/Uri", "type": "checkbox" ,"grid":"grid_1" }, 
                { "id": 354, "nama": "Colostomi", "type": "textbox" ,"grid":"grid_3" }, 
                { "id": 355, "nama": "Retensia Urine", "type": "textbox" ,"grid":"grid_4" },  
                { "id": 356, "nama": "Hematuri", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 357, "nama": "Anuria", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 358, "nama": "Dysuria", "type": "textbox" ,"grid":"grid_3" }, 
                { "id": 359, "nama": "Kandung kemih", "type": "textbox" ,"grid":"grid_4" },  
                { "id": 360, "nama": "Penuh", "type": "checkbox" ,"grid":"grid_1" },   
                { "id": 361, "nama": "Kosong", "type": "checkbox" ,"grid":"grid_1" },  
                { "id": 362, "nama": "Lain-lain", "type": "textbox" ,"grid":"grid_2" }, 
                ]
            }]

            $scope.listObat = [
                { "id": 29, "nama": "Obat-obatan di rumah(daftar obat,dosis,frekuensi,kapan terakhir kali dikonsumsi)", "detail": 
                    [ 
                        { "id": 363, "nama": "Nama Obat", "type": "label","grid":"grid_4" },  
                        { "id": 364, "nama": "Dosis / Frekuensi", "type": "label","grid":"grid_4" }, 
                        { "id": 365, "nama": "Kapan terakhir kali diberikan", "type": "label","grid":"grid_4" }, 
                        { "id": 366, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 367, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 368, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 369, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 370, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 371, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 372, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 373, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 374, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 375, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 376, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 377, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 378, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 379, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 380, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 381, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 382, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 383, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 384, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 385, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 386, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 387, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 388, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                        { "id": 389, "nama": " ", "type": "textbox","grid":"grid_4" }, 
                    ]
                }
            ]
            $scope.listprenatal = [
                { "id": 30, "nama": "Riwayat Natal :", "detail":  
                    [ 
                        { "id": 396, "nama": "Persalinan : ", "type": "label","grid":"grid_1" },
                        { "id": 397, "nama": "Spontan", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 398, "nama": "SC", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 399, "nama": "FE", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 400, "nama": "VE", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 401, "nama": "", "type": "enter","grid":"grid_1" },  
                        { "id": 402, "nama": "Penyulit Persalinan : ", "type": "label","grid":"grid_2" },
                        { "id": 403, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 404, "nama": "Ya, Sebutkan :", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 405, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },
                      
                    ]
                }
            ]
            $scope.lispostnatal = [
                { "id": 31, "nama": "Riawayat Post Natal :", "detail":  
                    [ 
                        { "id": 406, "nama": "Prematur", "type": "checkbox","grid":"grid_1" },
                        { "id": 407, "nama": "Aterm", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 408, "nama": "Post matur", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 409, "nama": "KMK", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 410, "nama": "SMK", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 411, "nama": "BMK", "type": "checkbox","grid":"grid_1" },
                        { "id": 412, "nama": "", "type": "enter","grid":"grid_1" },  
                        { "id": 413, "nama": "Paska NICU/PICU", "type": "checkbox","grid":"grid_3" }, 
                        
                      
                    ]
                }
            ]
            $scope.listimunisasi = [
                { "id": 32, "nama": "Riawayat Post Natal :", "detail":  
                    [ 
                        { "id": 414, "nama": "Hep BI", "type": "checkbox","grid":"grid_1" },
                        { "id": 415, "nama": "Hep II", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 416, "nama": "Hep III", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 417, "nama": "Hep IV", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 418, "nama": "Hep V", "type": "checkbox","grid":"grid_1" },

                        { "id": 419, "nama": "", "type": "enter","grid":"grid_1" },

                        { "id": 420, "nama": "DPT I", "type": "checkbox","grid":"grid_1" },
                        { "id": 421, "nama": "DPT II", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 422, "nama": "DPT III", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 423, "nama": "BCG ", "type": "checkbox","grid":"grid_1" }, 

                        { "id": 424, "nama": "", "type": "enter","grid":"grid_1" },

                        { "id": 425, "nama": "Booster I", "type": "checkbox","grid":"grid_1" },
                        { "id": 426, "nama": "Booster II", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 427, "nama": "Booster III", "type": "checkbox","grid":"grid_1" }, 

                        { "id": 428, "nama": "", "type": "enter","grid":"grid_1" },

                        { "id": 429, "nama": "Polio I", "type": "checkbox","grid":"grid_1" },
                        { "id": 430, "nama": "Polio II", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 431, "nama": "Polio III", "type": "checkbox","grid":"grid_1" }, 

                        { "id": 432, "nama": "", "type": "enter","grid":"grid_1" },

                        { "id": 433, "nama": "Booster I", "type": "checkbox","grid":"grid_1" },
                        { "id": 434, "nama": "Booster II", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 435, "nama": "Booster III", "type": "checkbox","grid":"grid_1" }, 

                        { "id": 435, "nama": "", "type": "enter","grid":"grid_1" },

                        { "id": 436, "nama": "HIB I", "type": "checkbox","grid":"grid_1" },
                        { "id": 437, "nama": "HIB II", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 438, "nama": "HIB III", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 438, "nama": "HIB IV", "type": "checkbox","grid":"grid_1" }, 

                        { "id": 439, "nama": "", "type": "enter","grid":"grid_1" },

                        { "id": 440, "nama": "Campak", "type": "checkbox","grid":"grid_1" },
                        { "id": 441, "nama": "MMR", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 442, "nama": "Varilrix", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 443, "nama": "Typhim", "type": "checkbox","grid":"grid_1" },

                        { "id": 444, "nama": "", "type": "enter","grid":"grid_1" },

                        { "id": 445, "nama": "Hep AI", "type": "checkbox","grid":"grid_1" },
                        { "id": 446, "nama": "Hep AII", "type": "checkbox","grid":"grid_1" }, 
                    ]
                }
            ]
            //  $scope.listAgama = [{
            //     "id": 1,
            //     "nama": "Agama",
            //     "detail": [
            //         { "id": 310, "nama": "Khatolik ", "type": "checkbox" },
            //         { "id": 311, "nama": "Islam", "type": "checkbox" }, 
            //         { "id": 312, "nama": "Protestan", "type": "checkbox" },
            //         { "id": 313, "nama": "Hindu", "type": "checkbox" },
            //         { "id": 314, "nama": "Budha", "type": "checkbox" },
            //         { "id": 315, "nama": "Kong Hu Cu", "type": "checkbox" }, 
            //     ]
            // },{
            //     "id": 2,
            //     "nama": "Status Perkawinan",
            //     "detail": [
            //         { "id": 316, "nama": "Kawin ", "type": "checkbox" },
            //         { "id": 317, "nama": "Belum Kawin", "type": "checkbox" }, 
            //         { "id": 318, "nama": "Duda", "type": "checkbox" },
            //         { "id": 319, "nama": "Janda", "type": "checkbox" }                     
            //     ]
            // }]
              $scope.listKomunikasi= [
                { 
                    "id": 33, "nama": "", "detail": 
                    [ 
                        { "id": 471, "nama": "Bicara", "type": "label","grid":"grid_2" },
                        { "id": 472, "nama": "normal", "type": "checkbox","grid":"grid_2" },
                        { "id": 473, "nama": "gangguan bicara, jelaskan", "type": "checkbox","grid":"grid_2" },
                        { "id": 474, "nama": "x", "type": "textboxtanpalabel","grid":"grid_2" },
                        { "id": 475, "nama": "", "type": "enter","grid":"grid_2" },                        
                        { "id": 476, "nama": "Perlu penterjemaah:", "type": "label","grid":"grid_2" },
                        { "id": 477, "nama": "tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 478, "nama": "ya", "type": "checkbox","grid":"grid_1" },
                        { "id": 479, "nama": "Bahasa", "type": "textbox","grid":"grid_3" },
                        { "id": 480, "nama": "Bahasa isyarat:", "type": "label","grid":"grid_2" },
                        { "id": 481, "nama": "tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 482, "nama": "ya", "type": "checkbox","grid":"grid_1" },
                        { "id": 483, "nama": "ya", "type": "enter","grid":"grid_1" },

                        
                        { "id": 484, "nama": "Hambatan belajar", "type": "label","grid":"grid_2" },
                        { "id": 485, "nama": "tidak", "type": "checkbox","grid":"grid_2" },
                        { "id": 486, "nama": "ya,Sebutkan hambatannya(boleh mencentang lebih dari satu pilihan)", "type": "checkbox","grid":"grid_8" },
                        { "id": 487, "nama": "pendengar", "type": "checkbox","grid":"grid_2" },
                        { "id": 488, "nama": "penglihatan", "type": "checkbox","grid":"grid_2" },
                        { "id": 489, "nama": "kognitif", "type": "checkbox","grid":"grid_2" },
                        { "id": 490, "nama": "fisik", "type": "checkbox","grid":"grid_2" },
                        { "id": 491, "nama": "Budaya", "type": "checkbox","grid":"grid_2" },
                        { "id": 492, "nama": "Agama", "type": "checkbox","grid":"grid_2" },
                        { "id": 493, "nama": "Emosi", "type": "checkbox","grid":"grid_2" },
                        { "id": 494, "nama": "Bahasa", "type": "checkbox","grid":"grid_2" },
                        { "id": 495, "nama": "Lainya", "type": "textbox","grid":"grid_4" },
                        { "id": 496, "nama": "Kebutuhan pembelajaran(pilih topik pembelajaran pada kotak yang tersedia)", "type": "label","grid":"grid_12" },
                        { "id": 497, "nama": "Pasien/keluarga menginginkan informasi tentang :", "type": "label","grid":"grid_12" },
                        { "id": 498, "nama": "Proses penyakit", "type": "checkbox","grid":"grid_2" },
                        { "id": 499, "nama": "Terapi/Obat", "type": "checkbox","grid":"grid_2" },
                        { "id": 500, "nama": "Diet dan nutrisi", "type": "checkbox","grid":"grid_2" },
                        { "id": 501, "nama": "Rehabilitasi", "type": "checkbox","grid":"grid_2" },
                        { "id": 502, "nama": "Manajemen nyeri", "type": "checkbox","grid":"grid_2" },
                        
                        { "id": 503, "nama": "Lainya :", "type": "textbox","grid":"grid_10" },
                    ]
                } 
                
            ]
           
             $scope.listekonomi= [{ 
                "id": 2, "nama": "Penanggung Jawab", "detail": 
                    [  
                        { "id": 504, "nama": "Pribadi", "type": "checkbox","grid":"grid_2" },
                        { "id": 505, "nama": "Asuransi :", "type": "checkbox","grid":"grid_1" },
                        { "id": 506, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },
                        { "id": 507, "nama": "Tanggungan :", "type": "checkbox","grid":"grid_1" },
                        { "id": 508, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },
                    ]
                }]
              $scope.listriwayat= [{ 
                    "id": 1, "nama": "tinggal bersama", "detail": 
                        [ 
                            { "id": 508, "nama": "Keluarga", "type": "checkbox","grid":"grid_2" },
                            { "id": 509, "nama": "Orang tua", "type": "checkbox","grid":"grid_2" },
                            { "id": 510, "nama": "Anak", "type": "checkbox","grid":"grid_2" },
                            { "id": 511, "nama": "Mertua", "type": "checkbox","grid":"grid_2" },
                            { "id": 512, "nama": "Teman", "type": "checkbox","grid":"grid_2" },
                            { "id": 513, "nama": "Sendiri", "type": "checkbox","grid":"grid_2" },
                            { "id": 514, "nama": "Panti asuhan", "type": "checkbox","grid":"grid_2" },
                            { "id": 515, "nama": "Panti Jompo", "type": "checkbox","grid":"grid_2" },
                        ]
                    },{ 
                    "id": 2, "nama": "Pekerjaan orang tua/wali", "detail": 
                        [ 
                            { "id": 516, "nama": "Wiraswasta", "type": "checkbox","grid":"grid_2" },
                            { "id": 517, "nama": "Pegawai", "type": "checkbox","grid":"grid_2" },
                            { "id": 518, "nama": "Tidak Bekerja", "type": "checkbox","grid":"grid_2" },
                            { "id": 519, "nama": "Siswa/Mahasiswa", "type": "checkbox","grid":"grid_2" },
                            { "id": 520, "nama": "Pensiun", "type": "checkbox","grid":"grid_2" },
                            { "id": 521, "nama": "Lainya :", "type": "textbox","grid":"grid_4" },
                        ]
                    },{ 
                    "id": 3, "nama": "Keluarga Terdekat", "detail": 
                        [ 
                            { "id": 522, "nama": "Nama", "type": "textbox","grid":"grid_3" },
                            { "id": 523, "nama": "Hubungan", "type": "textbox","grid":"grid_3" },
                            { "id": 524, "nama": "Telepon", "type": "textbox","grid":"grid_3" }, 
                        ]
                    },
                    // { 
                    // "id": 2, "nama": "Status Emosional ", "detail": 
                    //     [ 
                    //         { "id": 377, "nama": "Kooperatif", "type": "checkbox","grid":"grid_2" },
                    //         { "id": 378, "nama": "Cemas", "type": "checkbox","grid":"grid_2" },
                    //         { "id": 379, "nama": "Depresi", "type": "checkbox","grid":"grid_2" }, 
                    //         { "id": 380, "nama": "Ingin mengakhiri hidup", "type": "checkbox","grid":"grid_2" }, 
                    //         { "id": 381, "nama": "Lainya", "type": "textbox","grid":"grid_4" }, 
                    //     ]
                    // },{ 
                    // "id": 2, "nama": "Status Mental ", "detail": 
                    //     [ 
                    //         { "id": 382, "nama": "Kooperatif", "type": "checkbox","grid":"grid_2" },
                    //         { "id": 383, "nama": "Tidak Kooperatif", "type": "checkbox","grid":"grid_2" },
                    //         { "id": 383, "nama": "Gelisah atau delirium dan berontak", "type": "checkbox","grid":"grid_2" }, 
                    //         { "id": 384, "nama": "Ketidakmampuan dalam mengikuti perintah untuk tidak meninggalkan RS", "type": "checkbox","grid":"grid_2" }, 
                            
                    //     ]
                    // },
                    { 
                    "id": 4, "nama": "Restrain", "detail": 
                        [ 
                            { "id": 524, "nama": "Tidak", "type": "checkbox","grid":"grid_2" },
                            { "id": 525, "nama": "Ya, lanjutkan ke 'pengkajian dan monitoring Restraint (RM.C.13)'", "type": "checkbox","grid":"grid_10" },
                            
                        ]
                    },{ 
                    "id": 5, "nama": "Curiga penganiayaan/penelantaran", "detail": 
                        [ 
                            { "id": 526, "nama": "Tidak", "type": "checkbox","grid":"grid_2" },
                            { "id": 527, "nama": "Ya, lanjutkan ke 'Asesmen Pasien Korban Kekerasan/Penelantaran(RM.G.17)'", "type": "checkbox","grid":"grid_10" },
                            
                        ]
                    },
                    { 
                    "id": 6, "nama": "Respon Keluarga terhadap Sakit :", "detail": 
                        [ 
                            { "id": 528, "nama": "Baik", "type": "checkbox","grid":"grid_2" },
                            { "id": 529, "nama": "Tidak baik", "type": "checkbox","grid":"grid_2" },
                            { "id": 5299, "nama": "", "type": "textboxtanpalabel","grid":"grid_6" },

                            
                        ]
                    },
                    { 
                    "id": 7, "nama": "Pengertian Keluarga tentang penyakit dan alasan dirawat :", "detail": 
                        [ 
                            { "id": 530, "nama": "", "type": "textboxtanpalabel","grid":"grid_10" },
                            
                            
                        ]
                    },
                    { 
                        "id": 8, "nama": "Pengaruh dirawat terhadap keluarga :", "detail": 
                        [ 
                            { "id": 531, "nama": "", "type": "textboxtanpalabel","grid":"grid_10" },
                        ]
                    },
                ]

                // $scope.listaktivitas= [{ 
                // "id": 2, "nama": "Merokok", "detail": 
                //     [  
                //         { "id": 532, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                //         { "id": 534, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                //         { "id": 535, "nama": "", "type": "textboxtanpalabel","grid":"grid_1" },
                //         { "id": 536, "nama": "btg/bks/hari,", "type": "label","grid":"grid_1" },
                //         { "id": 537, "nama": "enter", "type": "enter","grid":"grid_1" },
                //         { "id": 538, "nama": "Selama", "type": "textbox","grid":"grid_3" },
                //         { "id": 539, "nama": "th", "type": "label","grid":"grid_1" },
                //     ]
                // },{ 
                // "id": 2, "nama": "Penggunaan Obat tidur", "detail": 
                //     [  
                //         { "id": 396, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                //         { "id": 397, "nama": "Ya", "type": "checkbox","grid":"grid_4" }, 
                //     ]
                // },{ 
                // "id": 2, "nama": "Olahraga", "detail": 
                //     [  
                //         { "id": 398, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                //         { "id": 399, "nama": "Ya", "type": "checkbox","grid":"grid_1" }, 
                //         { "id": 400, "nama": "Jenis", "type": "textbox","grid":"grid_3" }, 
                //         { "id": 401, "nama": "frekuensi", "type": "textbox","grid":"grid_3" }, 
                //         { "id": 402, "nama": "x/minggu", "type": "label","grid":"grid_1" }, 
                //     ]
                // }]
                $scope.listpola= [{ 
                "id": 2, "nama": "Merokok", "detail": 
                    [  
                        { "id": 532, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 534, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                        { "id": 535, "nama": "", "type": "textboxtanpalabel","grid":"grid_1" },
                        { "id": 536, "nama": "btg/bks/hari,", "type": "label","grid":"grid_1" },
                        { "id": 537, "nama": "enter", "type": "enter","grid":"grid_1" },
                        { "id": 538, "nama": "Selama", "type": "textbox","grid":"grid_3" },
                        { "id": 539, "nama": "th", "type": "label","grid":"grid_1" },
                    ]
                },{ 
                "id": 2, "nama": "Kopi", "detail": 
                    [  
                        { "id": 540, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 541, "nama": "Ya", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 542, "nama": "", "type": "textboxtanpalabel","grid":"grid_1" },
                        { "id": 543, "nama": "gelas/hari,", "type": "label","grid":"grid_1" },
                    ]
                }]
                $scope.listketergantungan= [{ 
                "id": 2, "nama": "Alkohol", "detail": 
                    [  
                        { "id": 544, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                        { "id": 545, "nama": "Ya", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 546, "nama": "", "type": "textboxtanpalabel","grid":"grid_1" },
                        { "id": 547, "nama": "gelas/hari,", "type": "label","grid":"grid_1" },
                        // { "id": 409, "nama": "lain-lain", "type": "textbox","grid":"grid_4" },
                    ]
                },{ 
                "id": 2, "nama": "Obat-obatan", "detail": 
                    [  
                        { "id": 547, "nama": "Tidak", "type": "checkbox","grid":"grid_12" },
                        { "id": 548, "nama": "Ya", "type": "checkbox","grid":"grid_1" },
                        { "id": 549, "nama": "Metadon", "type": "checkbox","grid":"grid_1" },
                        { "id": 550, "nama": "Kokain", "type": "checkbox","grid":"grid_1" },
                        { "id": 551, "nama": "Heroin", "type": "checkbox","grid":"grid_1" },
                        { "id": 552, "nama": "Amfetamin", "type": "checkbox","grid":"grid_1" }, 
                        { "id": 553, "nama": "Opiat lain/Analgesik", "type": "checkbox","grid":"grid_2" }, 
                        { "id": 554, "nama": "Lain-lain", "type": "textbox","grid":"grid_4" }, 
                    ]
                }]
                $scope.listpenunjang= [{ 
                "id": 2, "nama": "", "detail": 
                    [  
                        { "id": 555, "nama": "a", "type": "textbox","grid":"grid_10" },
                        { "id": 556, "nama": "b", "type": "textbox","grid":"grid_10" },
                        { "id": 557, "nama": "c", "type": "textbox","grid":"grid_10" },
                        // { "id": , "nama": "lain-lain", "type": "textbox","grid":"grid_4" },
                    ]
                } ]
                $scope.listorientasi= [{ 
                    "id": 2, "nama": "", "detail": 
                        [  
                            { "id": 558, "nama": "Ruangan/Kamar", "type": "checkbox","grid":"grid_2" },
                            { "id": 559, "nama": "Pengaturan tempat tidur", "type": "checkbox","grid":"grid_2" },
                            { "id": 560, "nama": "Lemari", "type": "checkbox","grid":"grid_2" },
                            { "id": 561, "nama": "WC/Kamar mandi", "type": "checkbox","grid":"grid_2" },
                            { "id": 562, "nama": "Sistem bel", "type": "checkbox","grid":"grid_2" },
                            { "id": 563, "nama": "Pengaman tempat tidur", "type": "checkbox","grid":"grid_2" },
                            { "id": 564, "nama": "TV dan remote control", "type": "checkbox","grid":"grid_2" },
                            { "id": 565, "nama": "Telepon", "type": "checkbox","grid":"grid_2" },
                            { "id": 566, "nama": "Korang untuk VIP", "type": "checkbox","grid":"grid_2" },
                            // { "id": , "nama": "lain-lain", "type": "textbox","grid":"grid_4" },
                        ]
                    } ]
                    $scope.listinfopasien= [{ 
                        "id": 2, "nama": "", "detail": 
                            [  
                                { "id": 567, "nama": "Perawat yang melakukan perawatan", "type": "checkbox","grid":"grid_3" },
                                { "id": 568, "nama": "Waktu dokter dan visite dan konsultasi", "type": "checkbox","grid":"grid_3" },
                                { "id": 569, "nama": "Jam berkunjung", "type": "checkbox","grid":"grid_3" },
                                // { "id": , "nama": "lain-lain", "type": "checkbox","grid":"grid_4" },
                            ]
                        } ]
                        $scope.listalat= [{ 
                            "id": 2, "nama": "", "detail": 
                                [  
                                    { "id": 570, "nama": "Tidak", "type": "checkbox","grid":"grid_1" },
                                    { "id": 571, "nama": "Ya :", "type": "checkbox","grid":"grid_1" },
                                    { "id": 572, "nama": "", "type": "enter","grid":"grid_1" },
                                    { "id": 573, "nama": "Infus :", "type": "checkbox","grid":"grid_1" },
                                    { "id": 574, "nama": "Tgl Pasang", "type": "textbox","grid":"grid_4" },
                                    { "id": 575, "nama": "", "type": "enter","grid":"grid_1" },
                                    { "id": 576, "nama": "Kateter", "type": "checkbox","grid":"grid_1" },
                                    { "id": 577, "nama": "Tgl Pasang", "type": "textbox","grid":"grid_4" },
                                    { "id": 578, "nama": "", "type": "enter","grid":"grid_1" },
                                    { "id": 579, "nama": "NGT", "type": "checkbox","grid":"grid_1" },
                                    { "id": 580, "nama": "Tgl Pasang", "type": "textbox","grid":"grid_4" },

                                    
                                ]
                            } ]
                        $scope.listmasalah= [{ 
                            "id": 2, "nama": "", "detail": 
                            [  
                                { "id": 581, "nama": "Ansietas", "type": "checkbox","grid":"grid_4" },
                                { "id": 582, "nama": "Keterbatasan / Intolerasi aktifitas", "type": "checkbox","grid":"grid_4" },
                                { "id": 583, "nama": "Risti /kekurangan /kelebihan cairan", "type": "checkbox","grid":"grid_4" },
                                { "id": 584, "nama": "Bersihan jalan napas tidak efektif", "type": "checkbox","grid":"grid_4" },
                                { "id": 585, "nama": "Kurang pengetahuan", "type": "checkbox","grid":"grid_4" },
                                { "id": 586, "nama": "Infeksi", "type": "checkbox","grid":"grid_4" },
                                { "id": 587, "nama": "Perubahan nutrisi : kurang/lebih", "type": "checkbox","grid":"grid_4" },
                                { "id": 588, "nama": "Defisit perawatan diri", "type": "checkbox","grid":"grid_4" },
                                { "id": 589, "nama": "Penurunan curah jantung", "type": "checkbox","grid":"grid_4" },
                                { "id": 590, "nama": "Gangguan Perfungsi jaringan cerebral", "type": "checkbox","grid":"grid_4" },
                                { "id": 591, "nama": "Depresi", "type": "checkbox","grid":"grid_4" },
                                { "id": 592, "nama": "Perubahan eliminasi : Uri/Alvi", "type": "checkbox","grid":"grid_4" },
                                { "id": 593, "nama": "Gangguan pertukaran gas", "type": "checkbox","grid":"grid_4" },
                                { "id": 594, "nama": "Nyeri", "type": "checkbox","grid":"grid_4" },
                                { "id": 595, "nama": "Risti jatuh / Cedera", "type": "checkbox","grid":"grid_4" },
                                { "id": 596, "nama": "Risti kerusakan intergritas kulit", "type": "checkbox","grid":"grid_4" },
                                { "id": 597, "nama": "Risiko pendarahan", "type": "checkbox","grid":"grid_4" },
                                { "id": 598, "nama": "Lainnya :", "type": "checkbox","grid":"grid_1" },
                                { "id": 598, "nama": "", "type": "textboxtanpalabel","grid":"grid_2" },
                                { "id": 600, "nama": "Hipertermi", "type": "checkbox","grid":"grid_4" },
                                { "id": 601, "nama": "Risiko cedera pada janin", "type": "checkbox","grid":"grid_4" },
                                ]
                            } 
                        ]

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
                    var objectfk = "AAKADK";
                    var noregistrasifk = $state.params.noRec;
                    var status = "t"; 
                    medifirstService.get("emr/get-data-rekam-medis?noregistrasifk=" + noregistrasifk + '&objectfk=' + objectfk +
                        '&riwayatfk=' + $scope.noRecPap).then(function(e) {
                        $scope.dataEdukasi = e.data.data;
                        if ($scope.dataEdukasi.length != 0) {
                           for (var i = 0; i < $scope.dataEdukasi.length; i++) { 
                                var res = $scope.dataEdukasi[i].objectfk.substring(9);                                
                                var noregistrasifk = $scope.dataEdukasi[i].noregistrasifk;                                
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
    
    
                 $scope.$watch('item.obj[602]', function(nilai) {
    
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
                           
                        }else if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date) {
                            debugger
                            var nilai = $scope.item.obj[parseInt(arrobj[i])];
                            var jenis = "datetime";
                            var satuan = "-";
                        }
                        else{
                            var nilai = $scope.item.obj[parseInt(arrobj[i])].namaruangan;
                            if(nilai == undefined){
                                var nilai2 = $scope.item.obj[parseInt(arrobj[i])].namalengkap;
                                if(nilai2 == undefined) {
                                    nilai = $scope.item.obj[parseInt(arrobj[i])].diagnosa;
                                } else {
                                    nilai = nilai2;
                                }
                            }
                            var jenis = "combobox"
                            var satuan = $scope.item.obj[parseInt(arrobj[i])].id;
                        }
                        var urutan = arrobj[i]
                        var object = "AAKADK000"+urutan  
                        // var norectmp = "AAKADK000"+urutan    
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
                        objecthead: "AAKADK"
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

                $scope.printPdf = function(){ 
                    $scope.popUpCetak.center().open();
                }
    
    
                //***********************************
            }
        ]);
    });