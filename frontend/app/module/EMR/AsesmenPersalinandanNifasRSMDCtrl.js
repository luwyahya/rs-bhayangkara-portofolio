define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenPersalinandanNifasRSMDCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'ModelItem',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService, ModelItem) {
            $scope.item = {};
            $scope.item.skalaNyeri = 0;
            $scope.listDataumum11 = {};
            $scope.skrining = {};
            $scope.dataForm = {};
            $scope.dataFormNyeri = {};
            $scope.dataFormRisiko = {};
            $scope.arrPengkajianSkrining = [];
            $scope.arrPengkajianNyeri = [];
            $scope.arrPengkajianRisiko = [];
            $scope.ItemFRD = {};
            $scope.ItemAnti = {};
            // $scope.dataVOloaded = cacheHelper.get('dataVOloaded');
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
                medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
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

            $scope.showAndHide = function () {
                $('#contentDiagnosa').fadeToggle("fast", "linear");
            }

            $scope.showAndHidee = function () {
                $('#contentDiagnosaa').fadeToggle("fast", "linear");
            }

            $scope.showAndHideee = function () {
                $('#contentDiagnosaaa').fadeToggle("fast", "linear");
            }

            $scope.showAndHideeee = function () {
                $('#contentDiagnosaaaa').fadeToggle("fast", "linear");
            }

            $scope.showAndHideCD = function () {
                $('#contentCD').fadeToggle("fast", "linear");
            }

            $scope.showAndHideOperasi = function () {
                $('#contentOperasi').fadeToggle("fast", "linear");
            }

            $scope.showAndHideAnti = function () {
                $('#contentAnti').fadeToggle("fast", "linear");
            }

            $scope.showAndHideAntii = function () {
                $('#contentAntii').fadeToggle("fast", "linear");
            }

            $scope.showAndHideBio = function () {
                $('#contentBio').fadeToggle("fast", "linear");
            }

            $scope.showAndHideKeb = function () {
                $('#contentKeb').fadeToggle("fast", "linear");
            }

            $scope.showAndHideNutrisi = function () {
                $('#contentNutrisi').fadeToggle("fast", "linear");
            }

            $scope.showAndHidePengkajian = function () {
                $('#contentPengkajian').fadeToggle("fast", "linear");
            }
            $scope.formatJam242 = {
                value: new Date(), //set default value
                // format: "dd-MM-yyyy HH:mm", //set date format
                // timeFormat: "HH:mm",        //set drop down time format to 24 hours
            }
            // $scope.listNyeriAnak = [
            // //     { "id": 1, "nama": "Hurts", "detail": [{ "id": 1, "nama": "No 0Hurt", "descNilai": "0  " }, { "id": 2, "nama": "Hurts Little Bit", "descNilai": "2  " }, { "id": 3, "nama": "Hurts Little More", "descNilai": "4  " }, { "id": 4, "nama": "Hurts Even More", "descNilai": "6  " }, { "id": 5, "nama": "Hurts Whole Lot", "descNilai": "8  " }, { "id": 6, "nama": "Hurts whorts", "descNilai": "10  " }] }       
            // ]
            $scope.listDataumum = [
                {
                    "id": 1, "nama": "Data Umum Pasien", "detail":
                        [
                            { "id": 223, "nama": "Agama", "type": "textbox", "grid": "grid_8" },
                            { "id": 224, "nama": "Suku Bangsa", "type": "textbox", "grid": "grid_8" },
                            { "id": 225, "nama": "Pekerjaan", "type": "textbox", "grid": "grid_8" },
                            { "id": 226, "nama": "Alamat", "type": "textbox", "grid": "grid_8" },
                            { "id": 227, "nama": "No. Telpon", "type": "textbox", "grid": "grid_8" },
                        ]
                }
            ]
            $scope.listDataumum2 = [
                {
                    "id": 1, "nama": "Identitas Suami", "detail":
                        [
                            { "id": 6, "nama": "Nama Lengkap", "type": "textbox", "grid": "grid_8" },
                            { "id": 7, "nama": "Umur", "type": "textbox", "grid": "grid_8" },
                            { "id": 8, "nama": "Agama", "type": "textbox", "grid": "grid_8" },
                            { "id": 9, "nama": "Suku Bangsa", "type": "textbox", "grid": "grid_8" },
                            { "id": 10, "nama": "Pendidikan", "type": "textbox", "grid": "grid_8" },
                            { "id": 11, "nama": "Pekerjaan", "type": "textbox", "grid": "grid_8" },
                            { "id": 12, "nama": "Alamat", "type": "textbox", "grid": "grid_8" },
                            { "id": 13, "nama": "No. Telpon", "type": "textbox", "grid": "grid_8" },
                        ]
                }
            ]
            $scope.listDataumum3 = [
                {
                    "id": 1, "nama": "B. CATATAN MENJELANG PERSALINAN", "detail":
                        [

                            { "id": 14, "nama": "Tanggal Masuk Dan Jam", "type": "textbox", "grid": "grid_6" },
                            { "id": 15, "nama": "Diterima Oleh Bidan", "type": "textbox", "grid": "grid_6" },
                        ]
                }
            ]

            $scope.listDataumum4 = [
                {
                    "id": 1, "nama": "a. Keadaan Waktu datang :", "detail":
                        [
                            { "id": 16, "nama": "Mulai his sejak tanggal / jam :", "type": "textbox", "grid": "grid_12" },
                            { "id": 17, "nama": "Pengeluaran :", "type": "textbox", "grid": "grid_7" },
                            { "id": 18, "nama": "G :", "type": "textbox", "grid": "grid_1" },
                            { "id": 19, "nama": "P :", "type": "textbox", "grid": "grid_1" },
                            { "id": 20, "nama": "A :", "type": "textbox", "grid": "grid_1" },
                            { "id": 21, "nama": "Meninggal", "type": "textbox", "grid": "grid_7" },
                            { "id": 22, "nama": "Keluhan - keluhan lain :", "type": "textbox", "grid": "grid_7" },
                            { "id": 23, "nama": "Tindakan pengobatan yang diberikan", "type": "textbox", "grid": "grid_7" },
                            { "id": 24, "nama": "Antenatal Care :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 26, "nama": "Puskemas", "type": "checkbox", "grid": "grid_2" },
                            { "id": 27, "nama": "Bidan Praktik", "type": "checkbox", "grid": "grid_2" },
                            { "id": 28, "nama": "Dokter", "type": "checkbox", "grid": "grid_2" },
                        ]
                }
            ]

            $scope.listDataumum5 = [
                {
                    "id": 1, "nama": "b. Pemeriksaan :", "detail":
                        [
                            { "id": 29, "nama": "Keadaan umum :", "type": "textbox", "grid": "grid_6" },
                            { "id": 30, "nama": "Tinggi fundus uteri :", "type": "textbox", "grid": "grid_6" },
                            { "id": 31, "nama": "Usia kehamilan :", "type": "textbox", "grid": "grid_6" },
                            { "id": 32, "nama": "Letak anak :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 33, "nama": "Kepala :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 34, "nama": "Bokong :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 35, "nama": "Lintang :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 36, "nama": "TD :", "type": "textbox", "grid": "grid_6" },
                            { "id": 37, "nama": "Hb :", "type": "textbox", "grid": "grid_6" },
                            { "id": 38, "nama": "Suhu :", "type": "textbox", "grid": "grid_6" },
                            { "id": 39, "nama": "Protein Urine :", "type": "textbox", "grid": "grid_6" },
                            { "id": 40, "nama": "Golongan darah :", "type": "textbox", "grid": "grid_6" },
                            { "id": 41, "nama": "Edema :", "type": "textbox", "grid": "grid_6" },
                        ]
                }
            ]

            $scope.listDataumum6 = [
                {
                    "id": 1, "nama": "c. Bunyi jantung janin", "detail":
                        [

                            { "id": 42, "nama": "Bunyi jantung", "type": "textbox", "grid": "grid_5" },
                            { "id": 43, "nama": "Teratur", "type": "checkbox", "grid": "grid_2" },
                            { "id": 44, "nama": "Tidak teratur", "type": "checkbox", "grid": "grid_4" },
                            { "id": 45, "nama": "Tidak terdenganr", "type": "checkbox", "grid": "grid_4" },
                            { "id": 46, "nama": "Pemeriksaan dilakukan dengan :", "type": "checkbox", "grid": "grid_12" },
                            { "id": 47, "nama": "Doppler", "type": "checkbox", "grid": "grid_4" },
                            { "id": 48, "nama": "Statoskop laennec", "type": "checkbox", "grid": "grid_4" },
                        ]
                }
            ]

            $scope.listDataumum7 = [
                {
                    "id": 1, "nama": "d. Pemeriksaan Dalam :", "detail":
                        [
                            { "id": 49, "nama": "Pembukaan :", "type": "textbox", "grid": "grid_6" },
                            { "id": 50, "nama": "Bagian Terendah :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 51, "nama": "Kepala", "type": "checkbox", "grid": "grid_2" },
                            { "id": 52, "nama": "Bokong", "type": "checkbox", "grid": "grid_2" },
                            { "id": 53, "nama": "Tangan", "type": "checkbox", "grid": "grid_2" },

                            { "id": 54, "nama": "Keadaan bagian terendah bayi :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 55, "nama": "Hordge I", "type": "checkbox", "grid": "grid_2" },
                            { "id": 56, "nama": "Hordge II", "type": "checkbox", "grid": "grid_2" },
                            { "id": 57, "nama": "Hordge III", "type": "checkbox", "grid": "grid_2" },
                            { "id": 58, "nama": "Hordge IV", "type": "checkbox", "grid": "grid_2" },

                            { "id": 59, "nama": "Ketuban :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 60, "nama": "Positif", "type": "checkbox", "grid": "grid_2" },
                            { "id": 61, "nama": "Negatif,Jelaskan", "type": "checkbox", "grid": "grid_1" },
                            { "id": 62, "nama": "", "type": "textbox", "grid": "grid_5" },
                        ]
                }
            ]


            $scope.listDataumum8 = [
                {
                    "id": 1, "nama": "e. Rencana Tindakan :", "detail":
                        [
                            { "id": 63, "nama": "Partus spontan", "type": "checkbox", "grid": "grid_2" },
                            { "id": 64, "nama": "SC", "type": "checkbox", "grid": "grid_2" },
                            { "id": 65, "nama": "Induksi", "type": "checkbox", "grid": "grid_2" },
                        ]
                }
            ]

            $scope.listDataumum9 = [

                {
                    "id": 1, "nama": "1. Partograft melewati garis waspada :", "detail":
                        [
                            { "id": 66, "nama": "Tidak", "type": "checkbox", "grid": "grid_1" },
                            { "id": 67, "nama": "Ya", "type": "checkbox", "grid": "grid_1" },
                            { "id": 68, "nama": "", "type": "textbox", "grid": "grid_10" },
                            { "id": 69, "nama": "Penyebab :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 70, "nama": "KPD", "type": "checkbox", "grid": "grid_1" },
                            { "id": 71, "nama": "Partus tidak maju", "type": "checkbox", "grid": "grid_2" },
                            { "id": 72, "nama": "Ring Bundle", "type": "checkbox", "grid": "grid_2" },
                            { "id": 73, "nama": "Lain-lain:", "type": "checkbox", "grid": "grid_1" },
                            { "id": 74, "nama": "", "type": "textbox", "grid": "grid_4" },
                        ]
                }
            ]
            $scope.listDataumum10 = [
                {
                    "id": 1, "nama": "2. Penatalaksanaan :", "detail":
                        [
                            { "id": 75, "nama": "VE", "type": "checkbox", "grid": "grid_1" },
                            { "id": 76, "nama": "FE", "type": "checkbox", "grid": "grid_1" },
                            { "id": 77, "nama": "SC", "type": "checkbox", "grid": "grid_1" },
                            { "id": 78, "nama": "Lain-lain:", "type": "checkbox", "grid": "grid_1" },
                            { "id": 79, "nama": "", "type": "textbox", "grid": "grid_4" },
                        ]
                }
            ]
            $scope.listDataumum11 = [

                {
                    "id": 1, "nama": "3.Episotomi :", "detail":
                        [
                            { "id": 81, "nama": "Tidak", "type": "checkbox", "grid": "grid_1" },
                            { "id": 82, "nama": "Ya", "type": "checkbox", "grid": "grid_1" },
                            { "id": 83, "nama": "Jika Ya, Indikasi :", "type": "checkbox", "grid": "grid_1" },
                            { "id": 84, "nama": "Perenium Pendek", "type": "checkbox", "grid": "grid_3" },
                            { "id": 85, "nama": "Perenium Kaku", "type": "checkbox", "grid": "grid_3" },
                            { "id": 86, "nama": "Perenium Sikatrik", "type": "checkbox", "grid": "grid_3" },
                            { "id": 87, "nama": "Jahitan Luka :", "type": "checkbox", "grid": "grid_3" },
                            { "id": 88, "nama": "Tidak", "type": "checkbox", "grid": "grid_1" },
                            { "id": 89, "nama": "Jelujur", "type": "checkbox", "grid": "grid_2" },
                            { "id": 90, "nama": "Luar dalam", "type": "checkbox", "grid": "grid_3" },
                        ]
                }
            ]
            $scope.listDataumum12 = [

                {
                    "id": 1, "nama": "4. Pendampingan saat Persalinan :", "detail":
                        [
                            { "id": 91, "nama": "Suami", "type": "checkbox", "grid": "grid_2" },
                            { "id": 92, "nama": "Keluarga", "type": "checkbox", "grid": "grid_2" },
                            { "id": 94, "nama": "Teman", "type": "checkbox", "grid": "grid_2" },
                            { "id": 95, "nama": "Bidan", "type": "checkbox", "grid": "grid_2" },
                            { "id": 96, "nama": "Tidak ada", "type": "checkbox", "grid": "grid_2" },
                        ]
                }
            ]
            $scope.listDataumum13 = [

                {
                    "id": 1, "nama": "5. Gawat janin :", "detail":
                        [

                            { "id": 97, "nama": "Tidak (DJA:", "type": "checkbox", "grid": "grid_1" },
                            { "id": 98, "nama": "", "type": "textbox", "grid": "grid_3" },
                            { "id": 99, "nama": "Ya (DJA:", "type": "checkbox", "grid": "grid_1" },
                            { "id": 100, "nama": "", "type": "textbox", "grid": "grid_3" },
                            { "id": 101, "nama": "tindakan yang di lakukan :", "type": "checkbox", "grid": "grid_3" },
                            { "id": 102, "nama": "Beri oksigen", "type": "checkbox", "grid": "grid_6" },
                            { "id": 103, "nama": "Anjurkan Pasien mriring ke kiri", "type": "checkbox", "grid": "grid_4" },
                            { "id": 104, "nama": "Observasi DJA tiap 15 menit", "type": "checkbox", "grid": "grid_4" },
                            { "id": 105, "nama": "Persiapkan opersasi", "type": "checkbox", "grid": "grid_4" },
                            { "id": 106, "nama": "Lain-lain :", "type": "checkbox", "grid": "grid_8" },
                            { "id": 107, "nama": "", "type": "textboxtanpalabel", "grid": "grid_6" },
                        ]
                }
            ]

            $scope.listDataumum14 = [
                {
                    "id": 1, "nama": "6. Inisiasi menyusi dini :", "detail":
                        [
                            { "id": 108, "nama": "Ya,", "type": "checkbox", "grid": "grid_2" },
                            { "id": 109, "nama": "Tidak/alasannya :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 110, "nama": "", "type": "textbox", "grid": "grid_4" },
                            { "id": 111, "nama": "7. Lama Kala III :", "type": "textbox", "grid": "grid_6" },
                        ]
                }
            ]
            $scope.listDataumum15 = [
                {
                    "id": 1, "nama": "8. Pemberian Oksitosin 10 Unit 1M :", "detail":
                        [
                            { "id": 112, "nama": "Ya, waktu", "type": "checkbox", "grid": "grid_1" },
                            { "id": 113, "nama": "", "type": "textbox", "grid": "grid_4" },
                            { "id": 114, "nama": "Tidak,alasan :", "type": "checkbox", "grid": "grid_1" },
                            { "id": 115, "nama": "", "type": "textbox", "grid": "grid_4" },
                        ]
                }]
            $scope.listDataumum16 = [
                {
                    "id": 1, "nama": "9. Pemberian Oksitosin Kedua :", "detail":
                        [
                            { "id": 116, "nama": "Ya, waktu :", "type": "checkbox", "grid": "grid_1" },
                            { "id": 117, "nama": "", "type": "textbox", "grid": "grid_4" },
                            { "id": 118, "nama": "Tidak,alasan :", "type": "checkbox", "grid": "grid_1" },
                            { "id": 119, "nama": "", "type": "textbox", "grid": "grid_4" },
                        ]
                }
            ]
            $scope.listDataumum17 = [
                {
                    "id": 1, "nama": "10. Penegangan tali pusat terkendali :", "detail":
                        [

                            { "id": 120, "nama": "Ya", "type": "checkbox", "grid": "grid_1" },
                            { "id": 121, "nama": "Tidak, alasannya", "type": "checkbox", "grid": "grid_1" },
                            { "id": 122, "nama": "", "type": "textbox", "grid": "grid_4" },
                            { "id": 123, "nama": "11. Penjepitan tali pusat :", "type": "textbox", "grid": "grid_12" },
                            { "id": 124, "nama": "menit sesudah persalinan", "type": "textbox", "grid": "grid_12" },
                        ]
                }
            ]

            $scope.listDataumum18 = [
                {
                    "id": 1, "nama": "12. Masase fundus uteri :", "detail":
                        [
                            { "id": 125, "nama": "Ya", "type": "textbox", "grid": "grid_3" },
                            { "id": 126, "nama": "Tidak,alasannya :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 127, "nama": "", "type": "textbox", "grid": "grid_4" },
                        ]
                }
            ]
            $scope.listDataumum19 = [
                {
                    "id": 1, "nama": "13. Plasenta lahir :", "detail":
                        [
                            { "id": 128, "nama": "Manual", "type": "checkbox", "grid": "grid_4" },
                            { "id": 129, "nama": "TTidak Spontan", "type": "checkbox", "grid": "grid_4" },
                            { "id": 130, "nama": "Lengkap", "type": "checkbox", "grid": "grid_4" },
                            { "id": 131, "nama": "Kelainan pada plasenta :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 132, "nama": "Tidak ada", "type": "checkbox", "grid": "grid_4" },
                            { "id": 133, "nama": "Ada,Sebutkan :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 134, "nama": "", "type": "textbox", "grid": "grid_4" },
                            { "id": 135, "nama": "Berat plasenta :", "type": "textbox", "grid": "grid_6" },
                            { "id": 136, "nama": "Segar", "type": "checkbox", "grid": "grid_2" },
                            { "id": 137, "nama": "Layu", "type": "checkbox", "grid": "grid_2" },
                            { "id": 138, "nama": "Plasenta tidak lahir > 30 Menit :", "type": "checkbox", "grid": "grid_6" },
                            { "id": 139, "nama": "Ya, tindakan yang dilakukan :", "type": "checkbox", "grid": "grid_6" },
                            { "id": 140, "nama": "a. ", "type": "textbox", "grid": "grid_10" },
                            { "id": 141, "nama": "b. ", "type": "textbox", "grid": "grid_10" },
                            { "id": 142, "nama": "c. ", "type": "textbox", "grid": "grid_10" },
                        ]
                }
            ]
            $scope.listDataumum20 = [
                {
                    "id": 1, "nama": "14. Laserasi", "detail":
                        [
                            { "id": 143, "nama": "Tidak ", "type": "checkbox", "grid": "grid_2" },
                            { "id": 144, "nama": "Ya, dimana", "type": "checkbox", "grid": "grid_6" },
                            { "id": 145, "nama": "", "type": "textbox", "grid": "grid_6" },
                        ]
                }
            ]
            $scope.listDataumum21 = [
                {
                    "id": 1, "nama": "15. Laserasi perineium,", "detail":
                        [
                            { "id": 146, "nama": "Tidak", "type": "checkbox", "grid": "grid_2" },
                            { "id": 147, "nama": "Ya, derajat :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 148, "nama": "1", "type": "checkbox", "grid": "grid_2" },
                            { "id": 149, "nama": "2", "type": "checkbox", "grid": "grid_2" },
                            { "id": 150, "nama": "3", "type": "checkbox", "grid": "grid_2" },
                            { "id": 151, "nama": "4", "type": "checkbox", "grid": "grid_2" },
                        ]
                }
            ]
            $scope.listDataumum22 = [
                {
                    "id": 1, "nama": "16. Atonia uteri,", "detail":
                        [
                            { "id": 152, "nama": "Tidak", "type": "checkbox", "grid": "grid_2" },
                            { "id": 153, "nama": "Ya, tindakan yang dilakukan", "type": "checkbox", "grid": "grid_6" },
                            { "id": 154, "nama": "a. ", "type": "textbox", "grid": "grid_12" },
                            { "id": 155, "nama": "b. ", "type": "textbox", "grid": "grid_12" },
                            { "id": 156, "nama": "c. ", "type": "textbox", "grid": "grid_12" },
                            { "id": 157, "nama": "17. Jumlah pendarahan :", "type": "textbox", "grid": "grid_12" },
                            { "id": 158, "nama": "18. Masalah lain sebutkan :", "type": "textbox", "grid": "grid_12" },
                            { "id": 159, "nama": "19. Penatalaksanaan masalah tersebut :", "type": "textbox", "grid": "grid_12" },
                            { "id": 160, "nama": "Hasilnya,", "type": "textbox", "grid": "grid_12" },
                            { "id": 161, "nama": "20. Masalah Kala IV :", "type": "textbox", "grid": "grid_12" },
                            { "id": 162, "nama": "Penatalaksanaan masalah tersebut :", "type": "textbox", "grid": "grid_12" },
                            { "id": 163, "nama": "Hasilnya,", "type": "textbox", "grid": "grid_12" },

                        ]

                }
            ]

            $scope.listDataumum23 = [
                {
                    "id": 1, "nama": "BAYI BARU LAHIR", "detail":
                        [
                            { "id": 164, "nama": "21. Tanggal dan Jam :", "type": "textbox", "grid": "grid_8" },
                            { "id": 165, "nama": "Berat badan", "type": "textbox", "grid": "grid_4" },
                            { "id": 166, "nama": "Panjang", "type": "checkbox", "grid": "grid_4" },
                            { "id": 167, "nama": "Jenis Kelamin", "type": "text", "grid": "grid_4" },
                            { "id": 168, "nama": "Laki - laki", "type": "checkbox", "grid": "grid_4" },
                            { "id": 169, "nama": "Perempuan", "type": "checkbox", "grid": "grid_4" },
                            { "id": 170, "nama": "Lingkar kepala", "type": "checkbox", "grid": "grid_4" },
                            { "id": 171, "nama": "SB (Circumferentia suboccipito-brematica :", "type": "textbox", "grid": "grid_12" },
                            { "id": 172, "nama": "FO (Circumferentia fronto-occipitalis :", "type": "textbox", "grid": "grid_12" },
                            { "id": 173, "nama": "MO (Circumferentia mento-occipitalis :", "type": "textbox", "grid": "grid_12" },
                            { "id": 174, "nama": "lingkar Dada :", "type": "textbox", "grid": "grid_12" },
                        ]
                }
            ]
            $scope.listDataumum24 = [
                {
                    "id": 1, "nama": "22 Penilaian bayi baru lahir :", "detail":
                        [
                            { "id": 175, "nama": "Baik", "type": "checkbox", "grid": "grid_1" },
                            { "id": 176, "nama": "Ada penyulit", "type": "checkbox", "grid": "grid_2" },
                            { "id": 177, "nama": "Skor APGAR", "type": "checkbox", "grid": "grid_2" },
                            { "id": 178, "nama": "", "type": "textbox", "grid": "grid_5" },
                        ]
                }
            ]
            $scope.listDataumum25 = [
                {
                    "id": 1, "nama": "23 Bayi Baru Lahir :", "detail":
                        [
                            { "id": 179, "nama": "Normal, yang di lakukan :", "type": "checkbox", "grid": "grid_12" },
                            { "id": 180, "nama": "Mengerikan", "type": "checkbox", "grid": "grid_2" },
                            { "id": 181, "nama": "Menghangatkan", "type": "checkbox", "grid": "grid_2" },
                            { "id": 182, "nama": "Rangsangan Taktil", "type": "checkbox", "grid": "grid_4" },
                            { "id": 183, "nama": "Selimuti bayi dan tempatkan di sisi Ibu", "type": "checkbox", "grid": "grid_6" },

                            { "id": 184, "nama": "Asfiksia Ringan :", "type": "checkbox", "grid": "grid_6" },
                            { "id": 185, "nama": "Pucat", "type": "checkbox", "grid": "grid_2" },
                            { "id": 186, "nama": "Biru", "type": "checkbox", "grid": "grid_2" },
                            { "id": 187, "nama": "Lemas, tindakan :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 188, "nama": "", "type": "textbox", "grid": "grid_4" },
                            { "id": 189, "nama": "Mengerikan", "type": "checkbox", "grid": "grid_4" },
                            { "id": 190, "nama": "Menghangatkan", "type": "checkbox", "grid": "grid_2" },
                            { "id": 191, "nama": "Rangsangan Taktil", "type": "checkbox", "grid": "grid_4" },
                            { "id": 192, "nama": "beri pakaian/selimuti bayi dan tempatkan di sisi Ibu", "type": "checkbox", "grid": "grid_12" },
                            { "id": 193, "nama": "Lain-lain, sebutkan", "type": "checkbox", "grid": "grid_4" },
                            { "id": 194, "nama": "", "type": "textbox", "grid": "grid_4" },

                            { "id": 194, "nama": "Masalah :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 195, "nama": "T.a.k", "type": "checkbox", "grid": "grid_2" },
                            { "id": 196, "nama": "BBLR", "type": "checkbox", "grid": "grid_2" },
                            { "id": 197, "nama": "Prematur", "type": "checkbox", "grid": "grid_2" },
                            { "id": 198, "nama": "Ketuban Meco", "type": "checkbox", "grid": "grid_2" },
                            { "id": 199, "nama": "Lain-lain :", "type": "checkbox", "grid": "grid_2" },
                            { "id": 200, "nama": "", "type": "textbox", "grid": "grid_4" },

                            { "id": 201, "nama": "Cacat bawaan :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 202, "nama": "Tidak ada", "type": "checkbox", "grid": "grid_4" },
                            { "id": 203, "nama": "Labio/Plato schizis", "type": "checkbox", "grid": "grid_4" },
                            { "id": 204, "nama": "Polidaktili", "type": "checkbox", "grid": "grid_4" },

                            { "id": 205, "nama": "Hiportemi", "type": "checkbox", "grid": "grid_4" },
                            { "id": 206, "nama": "Tidak ada", "type": "checkbox", "grid": "grid_4" },
                            { "id": 207, "nama": "Ya, tindakan :", "type": "checkbox", "grid": "grid_4" },
                            { "id": 208, "nama": "a. ", "type": "textbox", "grid": "grid_10" },
                            { "id": 209, "nama": "b. ", "type": "textbox", "grid": "grid_10" },
                            { "id": 210, "nama": "c. ", "type": "textbox", "grid": "grid_10" },
                        ]
                }
            ]
            $scope.listDataumum26 = [
                {
                    "id": 1, "nama": "24 Pemberi ASI :", "detail":
                        [

                            { "id": 211, "nama": "Ya, Waktu :", "type": "textbox", "grid": "grid_5" },
                            { "id": 212, "nama": "tidak, alasannya :", "type": "checkbox", "grid": "grid_5" },
                            { "id": 213, "nama": "", "type": "textboxtanpalabel", "grid": "grid_6" },
                        ]
                }
            ]
            $scope.listDataumum27 = [
                {
                    "id": 1, "nama": "D. LAPORAN PERSALINAN / TINDAKAN", "detail":
                        [
                            { "id": 214, "nama": "", "type": "textarea", "grid": "grid_12" },
                        ]
                }
            ]

            $scope.listDataumum28 = [
                {
                    "id": 1, "nama": "Jenis Persalinan :", "detail":
                        [
                            { "id": 216, "nama": "Normal", "type": "checkbox", "grid": "grid_3" },
                            { "id": 217, "nama": "Vacum", "type": "checkbox", "grid": "grid_3" },
                            { "id": 218, "nama": "Forcep", "type": "checkbox", "grid": "grid_3" },
                            { "id": 219, "nama": "SC", "type": "checkbox", "grid": "grid_3" },
                        ]
                }
            ]
            $scope.listDataumum29 = [
                {
                    "id": 1, "nama": "Penolong Persalinan :", "detail":
                        [
                            { "id": 220, "nama": "Dokter :", "type": "combobox", "grid": "grid_10" },
                            { "id": 222, "nama": "Bidan :", "type": "combobox1", "grid": "grid_12" },
                        ]
                }
            ]

            var getTotal = function () {
                var skorAwal = 0;
                $scope.arrNIPS.forEach(function (data) {
                    skorAwal += parseInt(data.descNilai);
                })
                $scope.totalSkor = skorAwal
            };
            $scope.cekSkor = function (id, idparent, descnilai, value) {
                var result = $.grep($scope.arrNIPS, function (e) {

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
                    for (var i = 0; i < $scope.arrNIPS.length; i++) {
                        if ($scope.arrNIPS[i].idParent === idparent) {
                            // if ($scope.arrNIPS[i].id && $scope.arrNIPS[i].id === id) {
                            $scope.arrNIPS.splice(i, 1);
                            x = false
                            break;
                        }
                    }
                    if (x == true) {
                        $scope.arrNIPS.push(tempData);
                    }

                }
                getTotal();
            }


            function init() {
                var objectfk = "APDN";
                $scope.item.tglpengkajian = $scope.now;
                var noregistrasifk = $state.params.noRec;
                var status = "t";
                medifirstService.get("emr/get-data-rekam-medis?noregistrasifk=" + noregistrasifk + '&objectfk=' + objectfk +
                    '&riwayatfk=' + $scope.noRecPap).then(function (e) {
                        $scope.dataEdukasi = e.data.data;
                        if ($scope.dataEdukasi.length != 0) {
                            for (var i = 0; i < $scope.dataEdukasi.length; i++) {
                                var res = $scope.dataEdukasi[i].objectfk.substring(7);
                                if ($scope.dataEdukasi[i].jenisobject == 'checkbox') {
                                    var chekedd = false
                                    if ($scope.dataEdukasi[i].nilai == '1') {
                                        chekedd = true
                                    }
                                    $scope.item.obj[res] = chekedd
                                    $scope.item.norecval[res] = $scope.dataEdukasi[i].norec
                                } else if ($scope.dataEdukasi[i].jenisobject == 'combobox') {
                                    if (res == 1) {
                                        $scope.item.obj[res] = { id: $scope.dataEdukasi[i].satuan, namaruangan: $scope.dataEdukasi[i].nilai }
                                    } else {
                                        $scope.item.obj[res] = { id: $scope.dataEdukasi[i].satuan, namalengkap: $scope.dataEdukasi[i].nilai }
                                    };

                                    $scope.item.norecval[res] = $scope.dataEdukasi[i].norec

                                }
                                else {
                                    $scope.item.obj[res] =  $scope.dataEdukasi[i].nilai
                                    $scope.item.norecval[res] = $scope.dataEdukasi[i].norec
                                }
                            }
                        }
                    })
            }




            $scope.batalFRD = function () {
                ClearDataFRD();
                $scope.popUpFRD.close();
            }





            $scope.formatTanggal = function (tanggal) {
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



            $scope.back = function () {
                window.history.back();
            }

            $scope.Batal = function () { }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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
            $scope.Simpan = function () {
                if ($state.params.noRec == undefined) {
                    window.messageContainer.error("Pilih Pasien Dahulu!");
                    return;
                }
                var arrobj = Object.keys($scope.item.obj)
                
                var arrSave = [];
                var tempData = [];
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (typeof $scope.item.obj[parseInt(arrobj[i])] === 'string') {

                        var nilai = $scope.item.obj[parseInt(arrobj[i])];
                        var jenis = "textbox"
                        var satuan = "-"

                    } else if (typeof $scope.item.obj[parseInt(arrobj[i])] === 'boolean') {
                        var nilai = $scope.item.obj[parseInt(arrobj[i])];
                        var jenis = "checkbox"
                        var satuan = "-"

                    } else {

                        var nilai = $scope.item.obj[parseInt(arrobj[i])].namaruangan;
                        if(nilai == undefined){
                            nilai = $scope.item.obj[parseInt(arrobj[i])].namalengkap;
                        }
                        var jenis = "combobox"
                        var satuan = $scope.item.obj[parseInt(arrobj[i])].id;
                    }
                    var urutan = arrobj[i]
                    var object = "APDN000" + urutan
                    // var norectmp = "APDN000"+urutan    
                    var tmpDataEdukasi = {
                        norec: null,
                        objectfk: object,
                        nilai: nilai,
                        satuan: satuan,
                        jenisobject: jenis
                    }
                    tempData.push(tmpDataEdukasi);
                }
                debugger;


                for (var i = tempData.length - 1; i >= 0; i--) {
                    if (tempData[i].norec == undefined) {
                        tempData[i].norec = '-'
                    }
                    if (tempData[i].nilai == undefined) {
                        debugger
                        tempData.splice([i], 1)
                    }

                }

                var jsonSave = {
                    data: tempData,
                    noregistrasifk: $state.params.noRec,
                    riwayatpapfk: $scope.noRecPap,
                    objecthead: "APDN"
                }
                medifirstService.post('emr/save-data-rekam-medis', jsonSave).then(function (e) {
                    $scope.currentStatus = [];

                    // MedifirstService.post('Pengkajian Keperawatan', 'Norec Antrian Pasien Diperiksa', $state.params.noRec, 'Pengkajian Keperawatan Kupang').then(function(res) {})
                });
            }

            $scope.Batal = function () {
                ClearAll();
                $scope.myVar = 1;
            }

            $scope.klikChange = function (data, stat) {
                ;
                // $scope.pasienDewasa.perluKonsultasi.detail.forEach(function(items){
                // 	items.value = null
                // })
                // stat.value = "true";
                var result = $.grep($scope.arrPengkajianSkrining, function (e) {
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