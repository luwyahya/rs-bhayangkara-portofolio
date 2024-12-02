define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('RiOrthopediCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'DateHelper', '$parse',
        function($q, $rootScope, $scope, $state, cacheHelper, medifirstService, DateHelper, $parse) {
            $scope.item = {};
            $scope.skrining = {};
            $scope.dataForm = {};
            $scope.arrPengkajianSkrining = [];
            $scope.ItemFRD = {};
            $scope.ItemAnti = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglOperasi = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.isLihat = false
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            $scope.PegawaiLogin2 = {};
            $scope.item.obj = []
            var norecSurveilans = ''
            var dataFRD = [];
            var dataAntiBio = [];
            var dataHead = [];
            $scope.NorecSurveilans = "";
            $scope.pasienAnak = {};
            var noRegistrasi = ''
            $scope.item.listDiagnostik = ''
            $scope.item.listDiagnostik2 = ''
            var photo = undefined
            var photo2 = undefined
            var photo3 = undefined
            var photo4 = undefined
            var photo5 = undefined
            var photo6 = undefined
            function panggildiagnosa() {
               medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function(data) {

                    $scope.listDiagnosa = data;
                });
            }
            panggildiagnosa();
            function pengkajianperawat() {
                 $scope.item.ketCampak = $scope.item.umur;
                  
                medifirstService.get('emr/get-pengkajianpasienrj/' + $scope.noCM + '/' + 710).then(function(data) {
                    ;
                    if(data.data.data.length > 0){

                   
                        medifirstService.get("emr/get-data-rekam-medis?noregistrasifk=" + data.data.data[0].objectnoregistrasifk + '&objectfk=PKN-PRT'  +
                        '&riwayatfk=' + data.data.data[0].norec).then(function(e) {
                            ;
                            $scope.pengkajian = e.data.data;
                            for (var i = 0; i < $scope.pengkajian.length; i++) {  
                                var chekedd = false                
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT00029") {
                                        if ($scope.pengkajian[i].nilai == '1') {
                                            chekedd = true
                                        }
                                        $scope.item.obj[1] = chekedd
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT00030") {
                                        if ($scope.pengkajian[i].nilai == '1') {
                                            chekedd = true
                                        }
                                        $scope.item.obj[2] = chekedd
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT0007") {
                                        if ($scope.pengkajian[i].nilai == '1') {
                                            chekedd = true
                                        }
                                        $scope.item.obj[5] = chekedd
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT0008") {
                                        if ($scope.pengkajian[i].nilai == '1') {
                                            chekedd = true
                                        }
                                        $scope.item.obj[6] = chekedd
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT066") {                                  
                                        $scope.item.suhu = $scope.pengkajian[i].nilai;                                    
                                }
                            
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT070") {                                  
                                        $scope.item.ketSejak3 = $scope.pengkajian[i].nilai;      
                                        $scope.item.ketLK = parseFloat($scope.pengkajian[i].nilai);   
                                                                    
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT071") {                                  
                                        $scope.item.ketBB = $scope.pengkajian[i].nilai;                                    
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT069") {                                  
                                        $scope.item.tekananDarah = $scope.pengkajian[i].nilai;                                    
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT318") {                                  
                                        $scope.item.kesadaran = $scope.pengkajian[i].nilai;                                    
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT067") {                                  
                                        $scope.item.nadi = $scope.pengkajian[i].nilai;                                    
                                }
                                if ( $scope.pengkajian[i].objectfk == "PKN-PRT068") {                                  
                                        $scope.item.pernapasan = $scope.pengkajian[i].nilai;                                    
                                } 
                            }
                            medifirstService.get('emr/get-getpenunjang?noregistrasi=' +  $scope.item.noregistrasi ).then(function(data) {
                            var lab="";
                            var rad="";
                            var farm="";
                                for (var i = 0; i < data.data.data.lab.length; i++){
                                    if (lab==""){
                                        lab= data.data.data.lab[i].namaproduk;
                                    }else{
                                        lab= lab + '\n' + data.data.data.lab[i].namaproduk;
                                    };
                                }
                                for (var i = 0; i < data.data.data.rad.length; i++){
                                    if (rad==""){
                                        rad= data.data.data.rad[i].namaproduk;
                                    }else{
                                        rad= rad + '\n' + data.data.data.rad[i].namaproduk;
                                    };
                                }
                                for (var i = 0; i < data.data.data.farm.length; i++){
                                    if (farm==""){
                                        farm= data.data.data.lab[i].namaproduk;
                                    }else{
                                        farm= farm + '\n' + data.data.data.lab[i].namaproduk;
                                    };
                                }
                                //radiologi
                                $scope.item.sensory = lab;
                                $scope.item.Palpasi = rad; 
                                $scope.item.makanantiga = farm;
                            })
                            init()
                        
                        }) 
                    }else{
                         init()
                    }
                }); 
            }
            $scope.noRecPap = cacheHelper.get('noRecPapNew'); // noRecPap
            LoadCacheHelper();
            pengkajianperawat()
            // init()
 

            $scope.listOperasi = [
                { "id": 3, "nama": "Riwayat Operasi", "detail": [{ "id": 999, "nama": "Allo " }, { "id": 998, "nama": "Auto " }] }
            ]
            
            $scope.currentAlo = [];
            $scope.addListAlo = function(bool, data) {
                var index = $scope.currentAlo.indexOf(data);
                if (_.filter($scope.currentAlo, {
                        id: data.id
                    }).length === 0)
                    $scope.currentAlo.push(data);
                else {
                    $scope.currentAlo.splice(index, 1);
                } 
            }

            medifirstService.get("rawatinap/get-dokters-combos", false).then(function(data) {
                $scope.listDokter = data.data.dokter;
            });
           
           
            $scope.listKeluhan = [
                { "id": 1, "nama": "Riwayat Alergi", "detail": [{ "id": 1, "nama": "Tidak" }, { "id": 2, "nama": "Ya" }] }
            ]
            $scope.listKeluhan2 = [
                { "id": 125, "nama": "Resiko Jatuh", "detail": [{ "id": 3, "nama": " Tidak" }, { "id": 4, "nama": " Ya" }] }
            ]
              $scope.listKeluhan3 = [
                { "id": 126, "nama": "Resiko nyeri", "detail": [{ "id": 5, "nama": "  Tidak" }, { "id": 6, "nama": "  Ya" }] }
            ]

            //
            
          

            $scope.listPenyakit = [{
                "id": 2,
                "nama": "Riwayat Penyakit",
                "detail": [{ "id": 1, "nama": "Hipertensi" }, { "id": 2, "nama": "Jantung" }, { "id": 3, "nama": "Stroke" }, { "id": 4, "nama": "Dialysis" }, { "id": 5, "nama": "Asma" }, { "id": 6, "nama": "Kejang" }, { "id": 7, "nama": "Liver" }, { "id": 8, "nama": "TBC" }, { "id": 9, "nama": "Glaukoma" }, { "id": 10, "nama": "Pendarahan" }, { "id": 11, "nama": "DM" }, { "id": 12, "nama": "Kanker" }, { "id": 13, "nama": "Lainnya" }]
            }]


            $scope.listTransfusi = [
                { "id": 4, "nama": "Riwayat Transfusi", "detail": [{ "id": 1, "nama": "Tidak  " }, { "id": 2, "nama": "Ya  " }] }
            ]

            $scope.listReaksiTransfusi = [
                { "id": 5, "nama": "Reaksi Transfusi", "detail": [{ "id": 1, "nama": "Tidak   " }, { "id": 2, "nama": "Ya   " }, { "id": 3, "nama": "Lainnya " }] }
            ]

            $scope.listKeadaan = [{
                "id": 6,
                "nama": "Kesadaran",
                "detail": [{ "id": 1, "nama": "CM" }, { "id": 2, "nama": "Apatis" }, { "id": 3, "nama": "Somnolent" }, { "id": 4, "nama": "Sopor" }, { "id": 5, "nama": "Soporo Koma" }, { "id": 6, "nama": "Koma" }, { "id": 7, "nama": "Sulit dinilai" }]
            }]

            $scope.listResusitasi = [
                { "id": 6, "nama": "Tindakan Resusitasi", "detail": [{ "id": 1, "nama": "Tidak    " }, { "id": 2, "nama": "Ya    " }] }
            ]

            $scope.listMata = [
                { "id": 7, "nama": "Mata", "detail": [{ "id": 1, "nama": "Anemis" }, { "id": 2, "nama": "Ikterus" }, { "id": 3, "nama": "Isikor" }, { "id": 4, "nama": "Anisokor" }, { "id": 5, "nama": "Reflek pupil +/- ukuran" }, { "id": 6, "nama": "Normal " }] }
            ]

            $scope.listTHT = [
                { "id": 8, "nama": "THT", "detail": [{ "id": 1, "nama": "Normal  " }, { "id": 2, "nama": "Tonsil" }] }
            ]
            $scope.listTHTt = [
                { "id": 9, "nama": "Mata", "detail": [{ "id": 1, "nama": "Pharing" }] }
            ]
            $scope.listTHTtt = [
                { "id": 10, "nama": "Mata", "detail": [{ "id": 1, "nama": "Lidah" }] }
            ]
            $scope.listTHTttt = [
                { "id": 11, "nama": "Mata", "detail": [{ "id": 1, "nama": "Bibir" }] }
            ]

            $scope.listLeher = [
                { "id": 12, "nama": "Leher", "detail": [{ "id": 1, "nama": "JVP" }, { "id": 2, "nama": "Pembesaran Kelenjar" }, { "id": 3, "nama": "Thyrlod" }, { "id": 4, "nama": "Parathyroid" }, { "id": 5, "nama": "Normal   " }] }
            ]
            $scope.listCor = [
                { "id": 13, "nama": "Cor :", "detail": [{ "id": 1, "nama": "S1S2 tunggal reguler" }, { "id": 2, "nama": "S1S2 tunggal ireguler" }, { "id": 3, "nama": "Murmur" }, { "id": 4, "nama": "Bising" }, { "id": 5, "nama": "Gallop" }] }
            ]

            $scope.listPulmo = [
                { "id": 14, "nama": "Pulmo :", "detail": [{ "id": 1, "nama": "Suara Napas" }] }
            ]
            $scope.listPulmoo = [
                { "id": 15, "nama": "Pulmo :", "detail": [{ "id": 1, "nama": "Ronchi" }] }
            ]
            $scope.listPulmooo = [
                { "id": 16, "nama": "Pulmo :", "detail": [{ "id": 1, "nama": "Wheezing" }] }
            ]
            $scope.listAbdomen = [
                { "id": 17, "nama": "Hepar", "detail": [{ "id": 1, "nama": "Tidak Membesar" }, { "id": 2, "nama": "Membesar" }] }
            ]
            $scope.listLien = [
                { "id": 18, "nama": "Lien", "detail": [{ "id": 1, "nama": "Tidak Membesar " }, { "id": 2, "nama": "Membesar " }] }
            ]
            $scope.listEkstre = [
                { "id": 19, "nama": "EKstremitas", "detail": [{ "id": 1, "nama": "Hangat" }, { "id": 2, "nama": "Dingin" }, { "id": 3, "nama": "Edema" }, { "id": 4, "nama": "CRT" }] }
            ]
            $scope.listTanda = [
                { "id": 20, "nama": "", "detail": [{ "id": 1, "nama": "Kaku duduk" }, { "id": 2, "nama": "Kernig sign" }, { "id": 3, "nama": "Brudzinki's neck sign" }, { "id": 4, "nama": "Lainnya  " }] }
            ]
            $scope.listEfforessensi = [{
                "id": 21,
                "nama": "Efforesensi pada kulit",
                "detail": [{ "id": 1, "nama": "makula" }, { "id": 2, "nama": "papula" }, { "id": 3, "nama": "vesikula" }, { "id": 4, "nama": "bullaa" }, { "id": 5, "nama": "nodula" }, { "id": 6, "nama": "pustula" }, { "id": 7, "nama": "urtikaria" }, { "id": 8, "nama": "skuama" }, { "id": 9, "nama": "erosi" }, { "id": 10, "nama": "krusta" }, { "id": 11, "nama": "ulkus" }, { "id": 12, "nama": "sikatrik" }]
            }]
            $scope.listLaki = [{
                "id": 22,
                "nama": "Laki-laki",
                "detail": [{ "id": 1, "nama": "ecolement" }, { "id": 2, "nama": "funiculitis" }, { "id": 3, "nama": "balanitiss" }, { "id": 4, "nama": "epidymitis " }, { "id": 5, "nama": "posthitis" }, { "id": 6, "nama": "orchitis" }, { "id": 7, "nama": "prostatis" }, { "id": 8, "nama": "affectio gen" }, { "id": 9, "nama": "vesikulitis" }]
            }]
            $scope.listPerempuan = [
                { "id": 23, "nama": "Perempuan", "detail": [{ "id": 1, "nama": "fluoralbus" }, { "id": 2, "nama": "bartholonitys" }, { "id": 3, "nama": "vulvitis" }, { "id": 4, "nama": "cervicitis  " }, { "id": 5, "nama": "affectio gen " }, { "id": 6, "nama": "vaginitis" }] }
            ]
            $scope.listImunisasi = [
                { "id": 24, "nama": "Riwayat Imunisasi", "detail": [{ "id": 1, "nama": "BCG" }] }
            ]
            $scope.listImunisasii = [
                { "id": 25, "nama": "", "detail": [{ "id": 1, "nama": "Polio" }] }
            ]
            $scope.listImunisasiii = [
                { "id": 26, "nama": "", "detail": [{ "id": 1, "nama": "HepatitisB" }] }
            ]
            $scope.listImunisasiiii = [
                { "id": 27, "nama": "", "detail": [{ "id": 1, "nama": "DPT" }] }
            ]
            $scope.listImunisasiiiii = [
                { "id": 28, "nama": "", "detail": [{ "id": 1, "nama": "Campak" }] }
            ]
            $scope.listImunisasiiiiii = [
                { "id": 29, "nama": "", "detail": [{ "id": 1, "nama": "Lainnya   " }] }
            ]
            $scope.listPersalinan = [
                { "id": 30, "nama": "Riwayat Persalinan", "detail": [{ "id": 1, "nama": "Normal" }, { "id": 2, "nama": "Vakum" }, { "id": 3, "nama": "Forceps" }, { "id": 4, "nama": "SC" }] }
            ]
            $scope.listDitolong = [
                { "id": 31, "nama": "Ditolong Oleh", "detail": [{ "id": 1, "nama": "Dokter" }, { "id": 2, "nama": "Bidan" }, { "id": 3, "nama": "Lainnya    " }] }
            ]
            $scope.listLahir = [
                { "id": 32, "nama": "Keadaan saat lahir", "detail": [{ "id": 1, "nama": "Segera menangis" }, { "id": 2, "nama": "Tidak segera menangis" }] }
            ]
            $scope.listNutrisi = [
                { "id": 33, "nama": "Riwayat Nutrisi:", "detail": [{ "id": 1, "nama": "ASI" }, { "id": 2, "nama": "Susu formula" }, { "id": 3, "nama": "Bubur Susu" }, { "id": 4, "nama": "Nasi Tim" }, { "id": 5, "nama": "Makanan dewasa" }] }
            ]
            $scope.listKeadaanUmum = [
                { "id": 34, "nama": "Kesadaran", "detail": [{ "id": 1, "nama": "Tampak Sehat" }, { "id": 2, "nama": "Sakit Ringan" }, { "id": 3, "nama": "Sakit Sedang" }, { "id": 4, "nama": "Sakit Berat" }] }
            ]

            $scope.opsiYaTidak = [
                // maipulasi data detil skrining obstetri
                { "id": 35, "nama": "Tidak      ", "descNilai": "0", "value": false },
                { "id": 36, "nama": "Ya           ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak2 = [
                // maipulasi data detil skrining obstetri
                { "id": 37, "nama": "Tidak       ", "descNilai": "0", "value": false },
                { "id": 38, "nama": "Ya            ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak3 = [
                // maipulasi data detil skrining obstetri
                { "id": 39, "nama": "Tidak        ", "descNilai": "0", "value": false },
                { "id": 40, "nama": "Ya             ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak4 = [
                // maipulasi data detil skrining obstetri
                { "id": 41, "nama": "Tidak         ", "descNilai": "0", "value": false },
                { "id": 42, "nama": "Ya              ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak5 = [
                // maipulasi data detil skrining obstetri
                { "id": 43, "nama": "Tidak          ", "descNilai": "0", "value": false },
                { "id": 44, "nama": "Ya               ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak6 = [
                // maipulasi data detil skrining obstetri
                { "id": 45, "nama": "Tidak           ", "descNilai": "0", "value": false },
                { "id": 46, "nama": "Ya                ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak7 = [
                // maipulasi data detil skrining obstetri
                { "id": 47, "nama": "Tidak            ", "descNilai": "0", "value": false },
                { "id": 48, "nama": "Ya                 ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak8 = [
                // maipulasi data detil skrining obstetri
                { "id": 49, "nama": "Tidak             ", "descNilai": "0", "value": false },
                { "id": 50, "nama": "Ya                  ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak9 = [
                // maipulasi data detil skrining obstetri
                { "id": 51, "nama": "Tidak              ", "descNilai": "0", "value": false },
                { "id": 52, "nama": "Ya                   ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak10 = [
                // maipulasi data detil skrining obstetri
                { "id": 53, "nama": "Tidak               ", "descNilai": "0", "value": false },
                { "id": 54, "nama": "Ya                    ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak11 = [
                // maipulasi data detil skrining obstetri
                { "id": 55, "nama": "Tidak                ", "descNilai": "0", "value": false },
                { "id": 56, "nama": "Ya                     ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak12 = [
                // maipulasi data detil skrining obstetri
                { "id": 57, "nama": "Tidak                 ", "descNilai": "0", "value": false },
                { "id": 58, "nama": "Ya                      ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak13 = [
                // maipulasi data detil skrining obstetri
                { "id": 59, "nama": "Tidak                  ", "descNilai": "0", "value": false },
                { "id": 60, "nama": "Ya                       ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak14 = [
                // maipulasi data detil skrining obstetri
                { "id": 61, "nama": "Tidak                   ", "descNilai": "0", "value": false },
                { "id": 62, "nama": "Ya                        ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak15 = [
                // maipulasi data detil skrining obstetri
                { "id": 63, "nama": "Tidak                    ", "descNilai": "0", "value": false },
                { "id": 64, "nama": "Ya                         ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak16 = [
                // maipulasi data detil skrining obstetri
                { "id": 65, "nama": "Tidak                     ", "descNilai": "0", "value": false },
                { "id": 66, "nama": "Ya                          ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak17 = [
                // maipulasi data detil skrining obstetri
                { "id": 67, "nama": "Tidak                      ", "descNilai": "0", "value": false },
                { "id": 68, "nama": "Ya                           ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak18 = [
                // maipulasi data detil skrining obstetri
                { "id": 69, "nama": "Tidak                       ", "descNilai": "0", "value": false },
                { "id": 70, "nama": "Ya                            ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak19 = [
                // maipulasi data detil skrining obstetri
                { "id": 71, "nama": "Tidak                        ", "descNilai": "0", "value": false },
                { "id": 72, "nama": "Ya                             ", "descNilai": "1", "value": true }
            ];
            $scope.opsiYaTidak20 = [
                // maipulasi data detil skrining obstetri
                { "id": 73, "nama": "Tidak                         ", "descNilai": "0", "value": false },
                { "id": 74, "nama": "Ya                              ", "descNilai": "1", "value": true }
            ];

            $scope.listMataKebidanan = [
                { "id": 75, "nama": "Mata: konjunctiva", "detail": [{ "id": 1, "nama": "pucat" }, { "id": 2, "nama": "normal Sclera" }, { "id": 3, "nama": "putih" }, { "id": 4, "nama": "kuning" }, { "id": 5, "nama": "merah" }] }
            ]
            $scope.listLeherKebidanan = [
                { "id": 75, "nama": "Leher: Thyroid", "detail": [{ "id": 1, "nama": "teraba" }, { "id": 2, "nama": "tidak teraba" }] }
            ]
            $scope.listBentuk = [
                { "id": 76, "nama": "bentuk", "detail": [{ "id": 1, "nama": "simetris" }, { "id": 2, "nama": "asimetris" }] }
            ]
            $scope.listPuting = [
                { "id": 77, "nama": "Puting susu", "detail": [{ "id": 1, "nama": "menonjol" }, { "id": 2, "nama": "datar" }, { "id": 3, "nama": "masuk" }] }
            ]
            $scope.listPengeluaran = [
                { "id": 78, "nama": "Pengeluaran", "detail": [{ "id": 1, "nama": "Tidak ada" }, { "id": 2, "nama": "ada" }, { "id": 3, "nama": "clostrum" }, { "id": 4, "nama": "ASI" }, { "id": 5, "nama": "nanah/darah" }] }
            ]
            $scope.listKebersihan = [
                { "id": 79, "nama": "Kebersihan", "detail": [{ "id": 1, "nama": "cukup" }, { "id": 2, "nama": "kurang" }, { "id": 3, "nama": "kelainan" }, { "id": 4, "nama": "lecet" }, { "id": 5, "nama": "bengkak" }, { "id": 6, "nama": "lainnya     " }] }
            ]
            $scope.listExtremitas = [
                { "id": 80, "nama": "Extremitas: Tungkai :", "detail": [{ "id": 1, "nama": "simetris " }, { "id": 2, "nama": "asimetris " }, { "id": 3, "nama": "edema reflex" }] }
            ]
            $scope.listLuka = [
                { "id": 81, "nama": "Luka bekas operasi", "detail": [{ "id": 1, "nama": "Tidak ada " }, { "id": 2, "nama": "ada " }] }
            ]
            $scope.listKelainan = [
                { "id": 82, "nama": "Kelainan", "detail": [{ "id": 1, "nama": "Tidak ada  " }, { "id": 2, "nama": "ada  " }, { "id": 3, "nama": "bandie" }, { "id": 4, "nama": "distensi uteri" }] }
            ]
            $scope.listPunggung = [
                { "id": 83, "nama": "Letak punggung", "detail": [{ "id": 1, "nama": "Kanan" }, { "id": 2, "nama": "Kiri" }] }
            ]
            $scope.listPresentasi = [
                { "id": 84, "nama": "Presentasi", "detail": [{ "id": 1, "nama": "kepala" }, { "id": 2, "nama": "bokong" }] }
            ]
            $scope.listTerendah = [
                { "id": 85, "nama": "", "detail": [{ "id": 1, "nama": "perlimaan" }, { "id": 2, "nama": "osborn test" }] }
            ]
            $scope.listKontraksi = [
                { "id": 86, "nama": "Kontraksi uterus", "detail": [{ "id": 1, "nama": "Tidak ada   " }, { "id": 2, "nama": "ada   " }, { "id": 3, "nama": "Baik" }, { "id": 4, "nama": "Lembek" }] }
            ]
            $scope.listKelainan2 = [
                { "id": 87, "nama": "Kelainan", "detail": [{ "id": 1, "nama": "nyeri tekan" }, { "id": 2, "nama": "cekung pada perut" }, { "id": 3, "nama": "blass penuh" }] }
            ]
            $scope.listTaraba = [
                { "id": 88, "nama": "Taraba massa", "detail": [{ "id": 1, "nama": "Tidak ada    " }, { "id": 2, "nama": "ada    " }, { "id": 3, "nama": "solid" }, { "id": 4, "nama": "kistik" }] }
            ]
            $scope.listAuskultasi = [
                { "id": 89, "nama": "Auskultasi", "detail": [{ "id": 1, "nama": "bising usus" }, { "id": 2, "nama": "tidak ada" }, { "id": 3, "nama": "ada     " }, { "id": 4, "nama": "DJJ" }] }
            ]
            $scope.listPervaginam = [
                { "id": 90, "nama": "Pengeluaran pervaginam", "detail": [{ "id": 1, "nama": "Tidak ada     " }, { "id": 2, "nama": "ada     " }, { "id": 3, "nama": "darah" }, { "id": 4, "nama": "lendir" }, { "id": 5, "nama": "nanah" }] }
            ]
            $scope.listMataNew = [
                { "id": 91, "nama": "Mata", "detail": [{ "id": 1, "nama": "Anemia" }, { "id": 2, "nama": "Ikterus " }, { "id": 3, "nama": "Isikor " }, { "id": 4, "nama": "Anisokor " }, { "id": 5, "nama": "Reflek pupil +/- ukuran mm" }] }
            ]
            $scope.listTHTmata = [
                { "id": 92, "nama": "THT", "detail": [{ "id": 1, "nama": "tonsil" }, { "id": 2, "nama": "pharing" }, { "id": 3, "nama": "lidah" }, { "id": 4, "nama": "bibir" }] }
            ]
            $scope.listLeherMata = [
                { "id": 93, "nama": "Leher", "detail": [{ "id": 1, "nama": "JVP " }, { "id": 2, "nama": "Pembesaran Kelenjar " }, { "id": 3, "nama": "Thyrlod " }] }
            ]
            $scope.listThorax = [
                { "id": 94, "nama": "Thoraks", "detail": [{ "id": 1, "nama": "simetris  " }, { "id": 2, "nama": "asimetris  " }] }
            ]
            $scope.listCorMata = [
                { "id": 95, "nama": "Cor :", "detail": [{ "id": 1, "nama": "S1S2 tunggal reguler " }, { "id": 2, "nama": "S1S2 tunggal ireguler " }] }
            ]
            $scope.listCorMata1 = [
                { "id": 96, "nama": "Cor :", "detail": [{ "id": 1, "nama": "murmur " }] }
            ]
            $scope.listCorMata2 = [
                { "id": 97, "nama": "Cor :", "detail": [{ "id": 1, "nama": "bising " }] }
            ]
            $scope.listCorMata3 = [
                { "id": 98, "nama": "Cor :", "detail": [{ "id": 1, "nama": "gallop " }] }
            ]
            $scope.listPulmoMata = [
                { "id": 99, "nama": "Pulmo :", "detail": [{ "id": 1, "nama": "suara napas " }, { "id": 2, "nama": "ronchi" }, { "id": 3, "nama": "whezing" }] }
            ]
            $scope.listEkstreMata = [
                { "id": 100, "nama": "EKstremitas", "detail": [{ "id": 1, "nama": "Hangat " }, { "id": 2, "nama": "Dingin " }, { "id": 3, "nama": "Edema " }, { "id": 4, "nama": "CRT " }] }
            ]
            $scope.listTandaMata = [
                { "id": 101, "nama": "", "detail": [{ "id": 1, "nama": "Kaku duduk " }, { "id": 2, "nama": "Kernig sign " }, { "id": 3, "nama": "Brudzinki's neck sign " }, { "id": 4, "nama": "Lainnya      " }] }
            ]
            $scope.opsiEkstremitas = [
                // maipulasi data detil skrining obstetri
                { "id": 102, "nama": "Bow leg", "descNilai": "0", "value": false },
                { "id": 103, "nama": "CTEV", "descNilai": "1", "value": true },
                { "id": 104, "nama": "Lain-lain", "descNilai": "2", "value": true }
            ];
            $scope.opsiPubertas = [
                // maipulasi data detil skrining obstetri
                { "id": 105, "nama": "I", "descNilai": "0", "value": false },
                { "id": 106, "nama": "II", "descNilai": "1", "value": true },
                { "id": 107, "nama": "III", "descNilai": "2", "value": true },
                { "id": 108, "nama": "IV", "descNilai": "3", "value": true },
                { "id": 109, "nama": "V", "descNilai": "4", "value": true }
            ];
            $scope.listAlergi = [
                { "id": 110, "nama": "Riwayat Alergi", "detail": [{ "id": 1, "nama": "Tidak" }, { "id": 2, "nama": "Ya                               " }] }
            ]
            $scope.listTulangBelakang = [
                { "id": 111, "nama": "Bentuk tulang belakang", "detail": [{ "id": 1, "nama": "Kiposis" }, { "id": 2, "nama": "Lordosis" }, { "id": 3, "nama": "Scoliosis" }] }
            ]
            $scope.listTulangDada = [
                { "id": 112, "nama": "Bentuk tulang dada", "detail": [{ "id": 1, "nama": "Barrel Chest" }, { "id": 2, "nama": "Pigeon" }] }
            ]
            $scope.listJenisPernapasan = [
                { "id": 113, "nama": "Jenis pernapasan", "detail": [{ "id": 1, "nama": "Dispnoe" }, { "id": 2, "nama": "Orthopnoe" }] }
            ]
            $scope.listPerkusi = [
                { "id": 114, "nama": "Perkusi :", "detail": [{ "id": 1, "nama": "sonor" }, { "id": 2, "nama": "redup" }, { "id": 3, "nama": "hipersonor" }, { "id": 4, "nama": "pekak" }] }
            ]
            $scope.listAuskultasiGeriatri = [
                { "id": 115, "nama": "Auskultasi :", "detail": [{ "id": 1, "nama": "suara nafas" }, { "id": 2, "nama": "rochi" }, { "id": 3, "nama": "wheesing" }] }
            ]
            $scope.listEkstreGeriatri = [
                { "id": 116, "nama": "Ekstremitas :", "detail": [{ "id": 1, "nama": "Akral hangat" }, { "id": 2, "nama": "Akral dingin" }, { "id": 3, "nama": "Akral edema" }, { "id": 4, "nama": "Piting edema" }, { "id": 5, "nama": "CRT <2 detik" }, { "id": 6, "nama": "CRT >2 detik" }] }
            ]
            $scope.listUterus = [
                { "id": 117, "nama": "Uterus   Teraba Masa :", "detail": [{ "id": 1, "nama": "Tidak                           " }, { "id": 2, "nama": "Solid" }, { "id": 3, "nama": "Kistik" }, { "id": 4, "nama": "Uk" }] }
            ]
            $scope.listAnogenital = [
                { "id": 118, "nama": "Anogenital Pengeluaran Pervaginam :", "detail": [{ "id": 1, "nama": "Tidak ada      " }, { "id": 2, "nama": "Ada      " }, { "id": 3, "nama": "Darah" }, { "id": 4, "nama": "Lendir" }, { "id": 5, "nama": "Nanah" }] }
            ]

            $scope.listPertanyaan = [
                { id: 1, nama: "Usia Ibu diatas 35 tahun" },
                { id: 2, nama: "Pneyakit hematologi" },
                { id: 3, nama: "Neural tube defect" },
                { id: 4, nama: "Down sindrom" },
                { id: 5, nama: "" },
                { id: 6, nama: "Mascular distropia" },
                { id: 7, nama: "Cystic fibrosis" },
                { id: 8, nama: "Huntington graves" },
                { id: 9, nama: "Retardasi mental" },
                { id: 10, nama: "Kelainan Kromosom" },
                { id: 11, nama: "Riwayat lahir cacat" },
                { id: 12, nama: "Riwayat abortus pada trimester 1 dan KIDR" },
                { id: 13, nama: "Riwayat Narkoba" },
                { id: 14, nama: "Lainnya" },
                { id: 15, nama: "Risiko HIV" },
                { id: 16, nama: "Risiko Hepatitis" },
                { id: 17, nama: "Tinggal bersama penderita TB/infeksi kronis" },
                { id: 18, nama: "" },
                { id: 19, nama: "" },
                { id: 20, nama: "" },
            ];


            $scope.listSkorWong = [{
                "id": 119,
                "nama": "Score ",
                "detail": [
                    { "id": 119, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                    { "id": 120, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                    { "id": 121, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
                    { "id": 122, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
                    { "id": 123, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
                    { "id": 124, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
                ]
            }]
            $scope.currentSkorWong = [];
            $scope.addListSkorWong = function(bool, data) {
                var index = $scope.currentSkorWong.indexOf(data);
                if (_.filter($scope.currentSkorWong, {
                        id: data.id
                    }).length === 0)
                    $scope.currentSkorWong.push(data);
                else {
                    $scope.currentSkorWong.splice(index, 1);
                }

                if (data.id === 13 & bool == true) {
                    $scope.isKasJelas = true;
                } else if (data.id === 13 & bool == false) {
                    $scope.isKasJelas = false;
                }
            }

            $scope.listNyeriAnak = [{
                "id": 10,
                "nama": "Hurts",
                "detail": [{ "id": 6000, "nama": "No Hurt", "descNilai": 4 },
                    { "id": 6001, "nama": "Hurts Little Bit", "descNilai": 6 }, { "id": 3, "nama": "Hurts Little More", "descNilai": 0 },
                    { "id": 6002, "nama": "Hurts Even More", "descNilai": 8 }, { "id": 5, "nama": "Hurts Whole Lot", "descNilai": 2 },
                    { "id": 6003, "nama": "Hurts whorts", "descNilai": 10 }
                ]
            }]
            $scope.$watch('item.obj[111256]', function(nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[119] = true
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = true
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = true
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = true
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = true
                    $scope.item.obj[124] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = true
                }
            });
            $scope.getSkalaNyeri = function(data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[119] = true
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = true
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = true
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = true
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = true
                    $scope.item.obj[124] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[119] = false
                    $scope.item.obj[120] = false
                    $scope.item.obj[121] = false
                    $scope.item.obj[122] = false
                    $scope.item.obj[123] = false
                    $scope.item.obj[124] = true
                }

            }
            $scope.setSoal = function() {
                $scope.listPertanyaan.forEach(function(items) {
                    if (items.id == 1) {
                        $scope.masalahGenetika1 = items
                    }
                    if (items.id == 2) {
                        $scope.masalahGenetika2 = items
                    }
                    if (items.id == 3) {
                        $scope.masalahGenetika3 = items
                    }
                    if (items.id == 4) {
                        $scope.masalahGenetika4 = items
                    }
                    if (items.id == 5) {
                        $scope.masalahGenetika5 = items
                    }
                    if (items.id == 6) {
                        $scope.masalahGenetika6 = items
                    }
                    if (items.id == 7) {
                        $scope.masalahGenetika7 = items
                    }
                    if (items.id == 8) {
                        $scope.masalahGenetika8 = items
                    }
                    if (items.id == 9) {
                        $scope.masalahGenetika9 = items
                    }
                    if (items.id == 10) {
                        $scope.masalahGenetika10 = items
                    }
                    if (items.id == 11) {
                        $scope.masalahGenetika11 = items
                    }
                    if (items.id == 12) {
                        $scope.masalahGenetika12 = items
                    }
                    if (items.id == 13) {
                        $scope.masalahGenetika13 = items
                    }
                    if (items.id == 14) {
                        $scope.masalahGenetika14 = items
                    }
                    if (items.id == 15) {
                        $scope.riwayatInfeksi1 = items
                    }
                    if (items.id == 16) {
                        $scope.riwayatInfeksi2 = items
                    }
                    if (items.id == 17) {
                        $scope.riwayatInfeksi3 = items
                    }
                    if (items.id == 18) {
                        $scope.riwayatInfeksi4 = items
                    }
                    if (items.id == 19) {
                        $scope.riwayatInfeksi5 = items
                    }
                    if (items.id == 20) {
                        $scope.riwayatInfeksi6 = items
                    }
                })
            }
            $scope.setSoal();
            $scope.arrSoalKebidanan = [];
            $scope.cekSkor = function(data, stat) {
                var result = $.grep($scope.arrSoalKebidanan, function(e) {
                    return e.idParent == data.id;
                });
                var tempData = {
                    "id": stat.id,
                    "idParent": data.id,
                    "descNilai": stat.descNilai,
                    "value": stat.value
                }
                if (result.length == 0) {
                    $scope.arrSoalKebidanan.push(tempData);
                } else {
                    for (var i = 0; i < $scope.arrSoalKebidanan.length; i++)
                        if ($scope.arrSoalKebidanan[i].idParent && $scope.arrSoalKebidanan[i].idParent === data.id) {
                            $scope.arrSoalKebidanan.splice(i, 1);
                            break;
                        }
                    $scope.arrSoalKebidanan.push(tempData);
                }
            }

            $scope.arrSoalKebidananInfeksi = [];
            $scope.cekSkorInfeksi = function(data, stat) {
                var result = $.grep($scope.arrSoalKebidananInfeksi, function(e) {
                    return e.idParent == data.id;
                });
                var tempData = {
                    "id": stat.id,
                    "idParent": data.id,
                    "descNilai": stat.descNilai,
                    "value": stat.value
                }
                if (result.length == 0) {
                    $scope.arrSoalKebidananInfeksi.push(tempData);
                } else {
                    for (var i = 0; i < $scope.arrSoalKebidananInfeksi.length; i++)
                        if ($scope.arrSoalKebidananInfeksi[i].idParent && $scope.arrSoalKebidananInfeksi[i].idParent === data.id) {
                            $scope.arrSoalKebidananInfeksi.splice(i, 1);
                            break;
                        }
                    $scope.arrSoalKebidananInfeksi.push(tempData);
                }
            }

            $scope.isKasJelas = false;
            $scope.currentRiwayatPenyakit = [];
            $scope.addListRiwayatPenyakit = function(bool, data) {
                var index = $scope.currentRiwayatPenyakit.indexOf(data);
                if (_.filter($scope.currentRiwayatPenyakit, {
                        id: data.id
                    }).length === 0)
                    $scope.currentRiwayatPenyakit.push(data);
                else {
                    $scope.currentRiwayatPenyakit.splice(index, 1);
                }



            }


            $scope.currentUterus = [];
            $scope.addListUterus = function(bool, data) {
                var index = $scope.currentUterus.indexOf(data);
                if (_.filter($scope.currentUterus, {
                        id: data.id
                    }).length === 0)
                    $scope.currentUterus.push(data);
                else {
                    $scope.currentUterus.splice(index, 1);
                }

            }

            $scope.currentAnogenital = [];
            $scope.addListAnogenital = function(bool, data) {
                var index = $scope.currentAnogenital.indexOf(data);
                if (_.filter($scope.currentAnogenital, {
                        id: data.id
                    }).length === 0)
                    $scope.currentAnogenital.push(data);
                else {
                    $scope.currentAnogenital.splice(index, 1);
                }

            }

            $scope.currentPerkusi = [];
            $scope.addListPerkusi = function(bool, data) {
                var index = $scope.currentPerkusi.indexOf(data);
                if (_.filter($scope.currentPerkusi, {
                        id: data.id
                    }).length === 0)
                    $scope.currentPerkusi.push(data);
                else {
                    $scope.currentPerkusi.splice(index, 1);
                }

            }

            $scope.currentAuskultasi = [];
            $scope.addListAuskultasi = function(bool, data) {
                var index = $scope.currentAuskultasi.indexOf(data);
                if (_.filter($scope.currentAuskultasi, {
                        id: data.id
                    }).length === 0)
                    $scope.currentAuskultasi.push(data);
                else {
                    $scope.currentAuskultasi.splice(index, 1);
                }

            }

            $scope.currentEkstreGeriatri = [];
            $scope.addListEkstreGeriatri = function(bool, data) {
                var index = $scope.currentEkstreGeriatri.indexOf(data);
                if (_.filter($scope.currentEkstreGeriatri, {
                        id: data.id
                    }).length === 0)
                    $scope.currentEkstreGeriatri.push(data);
                else {
                    $scope.currentEkstreGeriatri.splice(index, 1);
                }

            }

            $scope.currentKeadaan = [];
            $scope.addListKeadaan = function(bool, data) {
                var index = $scope.currentKeadaan.indexOf(data);
                if (_.filter($scope.currentKeadaan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentKeadaan.push(data);
                else {
                    $scope.currentKeadaan.splice(index, 1);
                }

            }

            $scope.currentMata = [];
            $scope.addListMata = function(bool, data) {
                var index = $scope.currentMata.indexOf(data);
                if (_.filter($scope.currentMata, {
                        id: data.id
                    }).length === 0)
                    $scope.currentMata.push(data);
                else {
                    $scope.currentMata.splice(index, 1);
                }

            }

            $scope.currentTHT = [];
            $scope.addListTHT = function(bool, data) {
                var index = $scope.currentTHT.indexOf(data);
                if (_.filter($scope.currentTHT, {
                        id: data.id
                    }).length === 0)
                    $scope.currentTHT.push(data);
                else {
                    $scope.currentTHT.splice(index, 1);
                }

            }

            $scope.currentTHTt = [];
            $scope.addListTHTt = function(bool, data) {
                var index = $scope.currentTHTt.indexOf(data);
                if (_.filter($scope.currentTHTt, {
                        id: data.id
                    }).length === 0)
                    $scope.currentTHTt.push(data);
                else {
                    $scope.currentTHTt.splice(index, 1);
                }

            }

            $scope.currentTHTtt = [];
            $scope.addListTHTtt = function(bool, data) {
                var index = $scope.currentTHTtt.indexOf(data);
                if (_.filter($scope.currentTHTtt, {
                        id: data.id
                    }).length === 0)
                    $scope.currentTHTtt.push(data);
                else {
                    $scope.currentTHTtt.splice(index, 1);
                }

            }

            $scope.currentTHTttt = [];
            $scope.addListTHTttt = function(bool, data) {
                var index = $scope.currentTHTttt.indexOf(data);
                if (_.filter($scope.currentTHTttt, {
                        id: data.id
                    }).length === 0)
                    $scope.currentTHTttt.push(data);
                else {
                    $scope.currentTHTttt.splice(index, 1);
                }

            }

            $scope.currentLeher = [];
            $scope.addListLeher = function(bool, data) {
                var index = $scope.currentLeher.indexOf(data);
                if (_.filter($scope.currentLeher, {
                        id: data.id
                    }).length === 0)
                    $scope.currentLeher.push(data);
                else {
                    $scope.currentLeher.splice(index, 1);
                }

            }

            $scope.currentCor = [];
            $scope.addListCor = function(bool, data) {
                var index = $scope.currentCor.indexOf(data);
                if (_.filter($scope.currentCor, {
                        id: data.id
                    }).length === 0)
                    $scope.currentCor.push(data);
                else {
                    $scope.currentCor.splice(index, 1);
                }

            }

            $scope.currentPulmo = [];
            $scope.addListPulmo = function(bool, data) {
                var index = $scope.currentPulmo.indexOf(data);
                if (_.filter($scope.currentPulmo, {
                        id: data.id
                    }).length === 0)
                    $scope.currentPulmo.push(data);
                else {
                    $scope.currentPulmo.splice(index, 1);
                }

            }
            $scope.currentPulmoo = [];
            $scope.addListPulmoo = function(bool, data) {
                var index = $scope.currentPulmoo.indexOf(data);
                if (_.filter($scope.currentPulmoo, {
                        id: data.id
                    }).length === 0)
                    $scope.currentPulmoo.push(data);
                else {
                    $scope.currentPulmoo.splice(index, 1);
                }

            }
            $scope.currentPulmooo = [];
            $scope.addListPulmooo = function(bool, data) {
                var index = $scope.currentPulmooo.indexOf(data);
                if (_.filter($scope.currentPulmooo, {
                        id: data.id
                    }).length === 0)
                    $scope.currentPulmooo.push(data);
                else {
                    $scope.currentPulmooo.splice(index, 1);
                }

            }

            $scope.currentEkstre = [];
            $scope.addListEkstre = function(bool, data) {
                var index = $scope.currentEkstre.indexOf(data);
                if (_.filter($scope.currentEkstre, {
                        id: data.id
                    }).length === 0)
                    $scope.currentEkstre.push(data);
                else {
                    $scope.currentEkstre.splice(index, 1);
                }

            }

            $scope.currentEkstreMata = [];
            $scope.addListEkstreMata = function(bool, data) {
                var index = $scope.currentEkstreMata.indexOf(data);
                if (_.filter($scope.currentEkstreMata, {
                        id: data.id
                    }).length === 0)
                    $scope.currentEkstreMata.push(data);
                else {
                    $scope.currentEkstreMata.splice(index, 1);
                }

            }

            $scope.currentTanda = [];
            $scope.addListTanda = function(bool, data) {
                var index = $scope.currentTanda.indexOf(data);
                if (_.filter($scope.currentTanda, {
                        id: data.id
                    }).length === 0)
                    $scope.currentTanda.push(data);
                else {
                    $scope.currentTanda.splice(index, 1);
                }

            }

            $scope.currentTandaMata = [];
            $scope.addListTandaMata = function(bool, data) {
                var index = $scope.currentTandaMata.indexOf(data);
                if (_.filter($scope.currentTandaMata, {
                        id: data.id
                    }).length === 0)
                    $scope.currentTandaMata.push(data);
                else {
                    $scope.currentTandaMata.splice(index, 1);
                }

            }

            $scope.currentEfforessensi = [];
            $scope.addListEfforessensi = function(bool, data) {
                var index = $scope.currentEfforessensi.indexOf(data);
                if (_.filter($scope.currentEfforessensi, {
                        id: data.id
                    }).length === 0)
                    $scope.currentEfforessensi.push(data);
                else {
                    $scope.currentEfforessensi.splice(index, 1);
                }

            }

            $scope.currentLaki = [];
            $scope.addListLaki = function(bool, data) {
                var index = $scope.currentLaki.indexOf(data);
                if (_.filter($scope.currentLaki, {
                        id: data.id
                    }).length === 0)
                    $scope.currentLaki.push(data);
                else {
                    $scope.currentLaki.splice(index, 1);
                }

            }

            $scope.currentPerempuan = [];
            $scope.addListPerempuan = function(bool, data) {
                var index = $scope.currentPerempuan.indexOf(data);
                if (_.filter($scope.currentPerempuan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentPerempuan.push(data);
                else {
                    $scope.currentPerempuan.splice(index, 1);
                }

            }

            $scope.currentImunisasi = [];
            $scope.addListImunisasi = function(bool, data) {
                var index = $scope.currentImunisasi.indexOf(data);
                if (_.filter($scope.currentImunisasi, {
                        id: data.id
                    }).length === 0)
                    $scope.currentImunisasi.push(data);
                else {
                    $scope.currentImunisasi.splice(index, 1);
                }

            }
            $scope.currentImunisasii = [];
            $scope.addListImunisasii = function(bool, data) {
                var index = $scope.currentImunisasii.indexOf(data);
                if (_.filter($scope.currentImunisasii, {
                        id: data.id
                    }).length === 0)
                    $scope.currentImunisasii.push(data);
                else {
                    $scope.currentImunisasii.splice(index, 1);
                }

            }
            $scope.currentImunisasiii = [];
            $scope.addListImunisasiii = function(bool, data) {
                var index = $scope.currentImunisasiii.indexOf(data);
                if (_.filter($scope.currentImunisasiii, {
                        id: data.id
                    }).length === 0)
                    $scope.currentImunisasiii.push(data);
                else {
                    $scope.currentImunisasiii.splice(index, 1);
                }

            }
            $scope.currentImunisasiiii = [];
            $scope.addListImunisasiiii = function(bool, data) {
                var index = $scope.currentImunisasiiii.indexOf(data);
                if (_.filter($scope.currentImunisasiiii, {
                        id: data.id
                    }).length === 0)
                    $scope.currentImunisasiiii.push(data);
                else {
                    $scope.currentImunisasiiii.splice(index, 1);
                }

            }
            $scope.currentImunisasiiiii = [];
            $scope.addListImunisasiiiii = function(bool, data) {
                var index = $scope.currentImunisasiiiii.indexOf(data);
                if (_.filter($scope.currentImunisasiiiii, {
                        id: data.id
                    }).length === 0)
                    $scope.currentImunisasiiiii.push(data);
                else {
                    $scope.currentImunisasiiiii.splice(index, 1);
                }

            }
            $scope.currentImunisasiiiiii = [];
            $scope.addListImunisasiiiiii = function(bool, data) {
                var index = $scope.currentImunisasiiiiii.indexOf(data);
                if (_.filter($scope.currentImunisasiiiiii, {
                        id: data.id
                    }).length === 0)
                    $scope.currentImunisasiiiiii.push(data);
                else {
                    $scope.currentImunisasiiiiii.splice(index, 1);
                }

            }
            $scope.currentPersalinan = [];
            $scope.addListPersalinan = function(bool, data) {
                var index = $scope.currentPersalinan.indexOf(data);
                if (_.filter($scope.currentPersalinan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentPersalinan.push(data);
                else {
                    $scope.currentPersalinan.splice(index, 1);
                }

            }
            $scope.currentDitolong = [];
            $scope.addListDitolong = function(bool, data) {
                var index = $scope.currentDitolong.indexOf(data);
                if (_.filter($scope.currentDitolong, {
                        id: data.id
                    }).length === 0)
                    $scope.currentDitolong.push(data);
                else {
                    $scope.currentDitolong.splice(index, 1);
                }

            }
            $scope.currentNutrisi = [];
            $scope.addListNutrisi = function(bool, data) {
                var index = $scope.currentNutrisi.indexOf(data);
                if (_.filter($scope.currentNutrisi, {
                        id: data.id
                    }).length === 0)
                    $scope.currentNutrisi.push(data);
                else {
                    $scope.currentNutrisi.splice(index, 1);
                }

            }

            $scope.currentMataNew = [];
            $scope.addListMataNew = function(bool, data) {
                var index = $scope.currentMataNew.indexOf(data);
                if (_.filter($scope.currentMataNew, {
                        id: data.id
                    }).length === 0)
                    $scope.currentMataNew.push(data);
                else {
                    $scope.currentMataNew.splice(index, 1);
                }

            }
            $scope.currentTHTmata = [];
            $scope.addListTHTmata = function(bool, data) {
                var index = $scope.currentTHTmata.indexOf(data);
                if (_.filter($scope.currentTHTmata, {
                        id: data.id
                    }).length === 0)
                    $scope.currentTHTmata.push(data);
                else {
                    $scope.currentTHTmata.splice(index, 1);
                }

            }
            $scope.currentLeherMata = [];
            $scope.addListLeherMata = function(bool, data) {
                var index = $scope.currentLeherMata.indexOf(data);
                if (_.filter($scope.currentLeherMata, {
                        id: data.id
                    }).length === 0)
                    $scope.currentLeherMata.push(data);
                else {
                    $scope.currentLeherMata.splice(index, 1);
                }

            }

            $scope.currentCorMata = [];
            $scope.addListCorMata = function(bool, data) {
                var index = $scope.currentCorMata.indexOf(data);
                if (_.filter($scope.currentCorMata, {
                        id: data.id
                    }).length === 0)
                    $scope.currentCorMata.push(data);
                else {
                    $scope.currentCorMata.splice(index, 1);
                }

            }
            $scope.currentCorMata1 = [];
            $scope.addListCorMata1 = function(bool, data) {
                var index = $scope.currentCorMata1.indexOf(data);
                if (_.filter($scope.currentCorMata1, {
                        id: data.id
                    }).length === 0)
                    $scope.currentCorMata1.push(data);
                else {
                    $scope.currentCorMata1.splice(index, 1);
                }

            }
            $scope.currentCorMata2 = [];
            $scope.addListCorMata2 = function(bool, data) {
                var index = $scope.currentCorMata2.indexOf(data);
                if (_.filter($scope.currentCorMata2, {
                        id: data.id
                    }).length === 0)
                    $scope.currentCorMata2.push(data);
                else {
                    $scope.currentCorMata2.splice(index, 1);
                }

            }
            $scope.currentCorMata3 = [];
            $scope.addListCorMata3 = function(bool, data) {
                var index = $scope.currentCorMata3.indexOf(data);
                if (_.filter($scope.currentCorMata3, {
                        id: data.id
                    }).length === 0)
                    $scope.currentCorMata3.push(data);
                else {
                    $scope.currentCorMata3.splice(index, 1);
                }

            }

            $scope.currentPulmoMata = [];
            $scope.addListPulmoMata = function(bool, data) {
                var index = $scope.currentPulmoMata.indexOf(data);
                if (_.filter($scope.currentPulmoMata, {
                        id: data.id
                    }).length === 0)
                    $scope.currentPulmoMata.push(data);
                else {
                    $scope.currentPulmoMata.splice(index, 1);
                }

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
                var chacePeriode = cacheHelper.get('kanggepoto');
                if (chacePeriode != undefined) {
                    $scope.isOrtho = chacePeriode[0]
                    $scope.isUro = chacePeriode[1]
                    $scope.isJantung = chacePeriode[2]
                    $scope.isAnak = chacePeriode[3]
                    $scope.isDalam = chacePeriode[4]

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
            $scope.showAndHideAntiiii = function() {
                $('#contentAntiiii').fadeToggle("fast", "linear");
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

            $scope.tampungListDiagnosaMedis = function(index) {
                let tampung = $scope.data.names[index].item.diagnostik.namadiagnosa

                $scope.item.listDiagnostik = $scope.item.listDiagnostik + tampung + "\n"
                toastr.success('Berhasil tambah Diagnosa Kerja/Medis!', 'Success !')
            }

            $scope.tampungListDiagnosaBanding = function(index) {
                let tampung2 = $scope.data.names[index].item.diagnostik2.namadiagnosa

                $scope.item.listDiagnostik2 = $scope.item.listDiagnostik2 + tampung2 + "\n"
                toastr.success('Berhasil tambah Diagnosa Kerja/Banding!', 'Success !')
            }

            $scope.ambilPengkajianMedisIGD = function() {
                medifirstService.get('emr/get-pengkajian-awal-medis-igd?noRegistrasi=' + $scope.item.noregistrasi).then(function(dat) {
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        $scope.item.ketPenyakit = pengkajianmedis[i].value
                    }
                    toastr.success('Berhasil ambil dari Anamnesis Pengkajian Medis IGD!', 'Success !')
                })
            }

            // $scope.ambilPengkajianMedisIGDTataLaksana = function() {
            //     medifirstService.get('emr/get-pengkajian-awal-medis-igd-tata-laksana?noRegistrasi=' + $scope.item.noregistrasi).then(function(dat) {
            //         let tampung8 = ''
            //         let tampung9 = ''
            //         let pengkajianmedis = dat.data
            //         for (let i = 0; i < pengkajianmedis.length; i++) {
            //             if (pengkajianmedis[i].emrdfk == 2638) {
            //                 tampung8 = " Oksigen: " + pengkajianmedis[i].value + "\n"
            //             }
            //             if (pengkajianmedis[i].emrdfk == 2639) {
            //                 tampung9 = " Konsultasi Dokter: " + pengkajianmedis[i].value + "\n"
            //             }
            //             $scope.item.pemeriksaanjantung = $scope.item.pemeriksaanjantung + tampung8 + tampung9 
            //             tampung8 = ''
            //             tampung9 = ''
            //         }
            //     })
            // }

            $scope.ambilPengkajianMedisIGDTataLaksana = function() {
                medifirstService.get('emr/get-pengkajian-awal-medis-igd-tata-laksana?noRegistrasi=' + $scope.item.noregistrasi).then(function(dat) {
                    let tampung = ''
                    let tampung2 = ''
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        if (pengkajianmedis[i].emrdfk == 2638) {
                            tampung = "Terapi Dokter IGD : " + pengkajianmedis[i].value + "\n"
                        }
                        if (pengkajianmedis[i].emrdfk == 2639) {
                            tampung2 = tampung + "Terapi Dokter Spesialis : " + pengkajianmedis[i].value + "\n"
                        }
                        $scope.item.pemeriksaanjantung = tampung2
                    }
                    toastr.success('Berhasil ambil dari Tatalaksana/Terapi Pengkajian Medis IGD!', 'Success !')
                })
            }

            $scope.ambilPengkajianMedisIGDTataLaksanaOUJS = function() {
                medifirstService.get('emr/get-pengkajian-awal-medis-igd-tata-laksana?noRegistrasi=' + $scope.item.noregistrasi).then(function(dat) {
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        $scope.item.tatalaksana = pengkajianmedis[i].value
                    }
                    toastr.success('Berhasil ambil dari Tatalaksana/Terapi Pengkajian Medis IGD!', 'Success !')
                })
            }

            $scope.ambilPengkajianMedisIGDTataLaksanaKebidanan = function() {
                medifirstService.get('emr/get-pengkajian-awal-medis-igd-tata-laksana?noRegistrasi=' + $scope.item.noregistrasi).then(function(dat) {
                    let pengkajianmedis = dat.data
                    for (let i = 0; i < pengkajianmedis.length; i++) {
                        $scope.item.lainlain13 = pengkajianmedis[i].value
                    }
                    toastr.success('Berhasil ambil dari Tatalaksana/Terapi Pengkajian Medis IGD!', 'Success !')
                })
            }

            function init() {
                
                $scope.item.tglpengkajian = moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.item.tglselesai = $scope.item.tglpengkajian;
               
                $scope.user = {};
                if ($scope.isOrtho == true) {
                    $scope.user.poto = "data:image/jpeg;base64,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"
                    photo = $scope.user.poto;
                     $scope.item.orto  = "background-image:url("+ $scope.user.poto +");height: 240px; width: 210px"
                }
                if ($scope.isUro == true) {
                    $scope.user.poto2 = "data:image/png;base64,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"
                    photo2 = $scope.user.poto2;
                     $scope.item.uro  = "background-image:url("+ $scope.user.poto2 +"); height: 240px; width: 410px"
                }
                if ($scope.isJantung == true) {
                    $scope.user.poto3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAADnCAIAAABt8V9LAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADX5SURBVHhe7d1Zlx1V/f9xL732SXjJo/D+9wD0xoX/C5csRV1OuFQUlyASYgTUJAxhyGSSDukmMySQeU6AhExmhISEQAizovB/1f6crhyTSohCd0537/dFrV1Vu3btqvp89ve765w+/aVPK5XKVVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHVRjVCodVGNUKh1UY1QqHUxFY3zyySf/Kvz73//OKrLrauz6+OOPUx9X1EwLFwtnzpx5o/Duu+++//77Krd18NFHHymnEeTAysAyRY1BptSp8M9//vNCYX9hz549L7744vbt2zdv3vzyyy+zhDpEbBl6TYxil8rPFJYuXbqqsG/fvg0bNmzcuHH37t0HDx48X0hlLVRjTAimqDEs33vvvZdeemnt2rWUjRiDjnft2nXkyJETJ04Q9969e9Uk4qgZpYHLCBTDw8OvFrZt23ayoL6gwXvnzp3bsWPHSEHLzlv9MFGYosY4evSooX3Lli2U3dta+OCDDyjYkM8ex44dW716NX23wzxaZcddKm/duvXNwiuvvHK6oBGoKa0SdrSDRYsWaUoI+nuB94SR/tbSYGVAmIrGOHz48LPPPmtoJ1Bxgzrxj4LM6u233+YKqRTtGu8lVw5JHfCGVSJWVhBSVDteYIwy17hogqFZHjh16hTnJJ7ItbhFgHq+IEa98MILzz33nNCEpluVQWIqGoMf6J4NDhw4QLIJBXQcjOtGfSM9TSusXLlSXpQRHbEHtKOFZcuWvfXWW+IPtHapYHuM8frrr2uEPbBp0yazF+lZzMOWWhA01hRYUf3Su8pAUI1RjVHpoBqjGqPSwVQ0BlmvW7futddeO3PmzO7du+kexRTNy1myJtydO3euWLHCLHz//v0vvfRS78jROXeg+9gmb7RMMz4chbssTWYYLx9uPPHEE+vXr+cEbeKdd97RDSdSASMjI/rTa7cyAExFY+DQoUPGabPhY8eOGbwRYxCrJW+cPXuWN1hCeHn66aeFheDYJl6UiMFUJty0LrxAIbtMvu21FC6YJ8b46U9/SvpOpxoyy9e+FsAYDNb0rDIYTNGIYTg3flP/m2++eaRgCM8oHtiDJfbu3Zs3VC0ELWgk9Vq9erVcy3jPAGAbgQJpx6rIcO7cuRjvueeeE1LUb/z38cdso32rawv9QakyCExRY1gap2X8gkYSIUM7SNbekg19SN/0ygy8sWMUIk7cMJdgLWX5EonDIWyD5lOMDz7gOrMOFbKXi7QvLDQzlU8+YRWNI8aI00rvKgPBFDUGFVKwGYIRnXaRKbJJs+0Z+CVU1G8eIp5keg0xZPny5UzFFRAubMkHfA4pc+9LXMEkEicRQ8vm3KB+LTu1UyA5lWmMhAq9nlUGhik6x6BRS4M9cbdDOAidvtnGEE7f6lhScPkEr0HK5CgocI6owglaA7nHGCXefKgpEUOIkERB2HEWh8RgoseWLVtUKN25PG+pDAhTNGLQvSXRG/4TMQK507Rd8QaomdaT9kD0sBoRMwNjWJI78o1aaEHLWpOhiRuJRdzlKOaJwVhLvHJUDnGW9K0yIEzRiBHpKxi29xRIHBKnixcvZm+I4m0JDrGF7u1iCVsshQWkPnIIe1y4cEGDkX44ceKELXj22WdlcVprolWZzVdvDBRTNGJQMwUrCwJbC9kV1aoQHUeyaDxRUE6upQW0W8AP2ZhV2KWFlLPXankHdmTNmjU51pagnD5UBoGpO/m2VN62bVveSjUfR1+8aBQ3jW730qtCP+SL1hgpWCIGgFjBBlf4RKGc/NMYY926dVkN2nSu3kplAJiKxoiyFcwW5s2bZ1qMfMuVMSRUNB2ltk5oiT2grJFIPzaQPoUc3lZuwkFpSn05WOqsWrXq7Nmz6QxUKF2rDApTwhhRZ29l9GsdDGDmbY5hfozmbyaOHTMrsCuKL6puDBD1B3ttVFAnu8QZco/iExyyCzmRJTIjTwsw/x4aGtJU9kI5u65Pr/ZVRuptveF2KtenGqMao9JBNUY1RqWDKWeMFMywn3jiCTPg06dPl++CvJ7PMUwPoi3iTn1lG8k6RHaWXHTmzBnlkydPNh9MHD9uY/Px3qVLJiqxlqWNjVoL/WVWXLJkycsvv1xO0liRkVK+Dg7UGS0rxHtwLDfamF229GpXPgdTcfLNAGLF/v3733jjjcOHD+cDuIisiLYhBoBCVBvee+89flCBFrdv384G4sDugspshoPldw+sRqalvcufVJQXwmeOHj3KnCMjI81MvHwbtz3jddCCNtXsr2yj1ZwiVuztqHwOJrkxioT+bQhHvv5NjosWLXr++ecZgzrPnj2bYb5RfSGHKMQPyhF0sIWXdu7cSaDxgDCSD8VVS1Ymeqhptf9A5bRsXIctcrm5c+c2Xy85fNiqXaXi9WgbQS4K69ev37Nnj26kt5a92pXPwaQyRhQTOdI6+a4u5Bvj5Q+E9s2ePXvevHmCBoekPgPEAxFWK75st2pp7hFEDI2fOHFi7969dm3cuNEcIxHj7bffzheuxB/VLB2YpkLaLz39lH90T+VlhfT5BtGIIJMfswJ/stauXbt6u8sEZu3atblq9oP2/6tTVCaVMSJumDNQzKFDh5q/CTp/nowMqPmkYtWqVZR04MABJmGeVruRTrCqkbhCWcuvjrJt2zaKt92sXUYkUIhC5Yeptms2DnGIxolVtf72LTWbVUeJG/rzWCGfadw4Yl35dm+DVa099dRTvOG69JDzOZN1oZ9wduTYyo0wCVMpKsnXuZWLTXpZ/oKC2YVxWrggHW6xPXWi17TQD49RWwwGQn/xxRd5gysYj/rNwssf4b1CrPGecESRdG+obs+u8ZwoaEdN1cQNtN9JuUGEwaRtsMoS1K97zKknw8PDNpbXbMcSN9KHcmjlhpgkxshTpzasW7dO6q9Al2X60Pw6gS1PF6iWXEwwFMwTcngLwxCWvUIBP9Aum8mg8sersOvdd9/ljSNHjggLlK3lJkXbt8/ekkmdzKTcUoTRZizXM0SxBASx7NUgli5dWs7fTavpFHhe3Ctvhhu0+dxzz+lk6sijOE0hsaL5VL9kWY7VjWqPG2QCGyOCI+72YRMxHn30UcKVUWzatCnjJeVt2LAhY7Mx3mBvyKdvh9BTvl2b30GjMBLnCock3WIz2ZHwEgQQznEUtbGZhE0OM7NgJv1CQehgm8QlpG/prYLeIvZg0Sbd2bs3P6qQmv3kqKC+pY0mNvqWCtB5V6eQ+6DDOqDwbKF5BVZeK9ubRhipdKHB9konE9gY/Y+W/qhZmoTHH39cKmUMzswbQ0NDM2bMKEPz/iQwsiAFCYz6GVPNoZHW+nEKEmeY4CiuMBKPjIxQJB9q0/gNxsiEgVuk/raTr2ytbacEjF7EUNAO/2SvuTLLpdxJLAGBiIEVRLzgSgWo7BWIXLuTcn7zJ7Nr12a703G1yKkdS6vl5lVjXJMJn0plQgyZTCKGp247ndnVfPB2/DgD/O1vf4uMBBN1GINhCLcVB5nCFqIXIuiPW4zoH5S/4yO1QIXqsITpSg7M6SB25c+7ueLBBx+84447aFTlfsupTJdQOVmQTkJr7Jc6/US+OYWeiH4JDrqazBDKqWkpmrkVCswvdKCJhnv2GDVcV+InF7V9rlyLgTCGh9qOiMGTQ7uxXW2hrZKDNI/fBLTopydxNclO/kD9gVYIKGUZC73KslKfKCOXZEESLa3xDykrSKWoXJRIy6BmQWbhwoXCAkUmkSuhaL9m0wg72aUDZKraooKsJhPlFldhXA87duxwITbqfHshLbbwuRY0aFWc0WxGAdjiqCzVaf+CXN/QzLEuXRIu7M21pxFtXn2iSstAGENqkefU0tsxOhCm4NEGq+KDVBtU5cEnOYlnFAiCsgm6mQufPEn3+ewCy5YtM13WAokbfSX3NIdykg7oTB1aD7YIQdOnTxcK9MFefWgmuVu2KJfYcJEP2cNJRSd70z6fUK1krLzR3S330wGtWUJ9fisnvIyLim3kTtp/p3wfXlk7LiQXC3fGUiPMzzDMb7wQJZIiNsG0TLfETJmV0KFm7mHlOlRjVGNUOqjGqMaodDAQxsjTpeaUkaydqjxRj5nabEzlICknTVAYpVJMvBFXePYmD0ePHo2wzBPINO+O6MbhjiIjKmmbdTgU9CRSs6pgC8U373cKDjQJfuqpp4aGhpyLzZKyw4nmFmj3/PnzGmckOb1Tgzp1iUP0Cq7LLhJXGTpm/s3JzObS7AW3bC/ogAvUc4e4G87rdOkw0km2cbvUMU2CU58txKvmGEYBRlXTpWmhXOXlAahyBYNijBQ85mii+dG/HTtOlx/ApBUDLXEb/6yC9D1j28EDlOpABe0EFWxEY5R//Yu2jPH8A2cRYQiajnPG1MmBkQuUs9FSNUEj6AbNmXxHhRRvb15GcVrzAmjPHnNc0tRP/T9X/ogcPGzUp3XKRqb45ui5Ih1jMGOBxu3KrJofcqwIY2ruqHwP19Wh8URBJ3Ptdl0HbtQIh+iew3tbK9dgUIxBf56xYZXiM7AFu2C8JBdCzPhKXvPnz28+bd6378MPPyRKHkjQAFlbGix37twZFcoinnjiibZB4ibTlGODltRJwVKvUja0hxzojALC6tWrncWq6IGtW7cma9L/JF3pUvkqyXllWyiyjONnaZ1P1Gyi3oEDPG8LU6XD+SzSANGkaFu2sE17eIyKpruF3LosrWYvyp1r/hsg5JO6JyiNjIw4KT+7n0i1tIMcWMFAGCP6Iyai720qeGYEQQ32KqtmyISxlrhJEwZLW9oKIQOqpb0wUkbQMAxLSCICh7Rk77WIQJHEyUgvYggRkh/HJpgIcUcKvGG851Vn0Rk9Qc6S8waXJv9JcBC+jOj85iYIIMl/eL5XddSrubq0ZktIhaBNF2gEkTiFxF4jiGbdCnudzlTEheRaeq1UV/wnA5RKCRfkWzKg5j87IjrI3sgrW6yaQCf/pn7jcT7WTR31lelAZtLMc3fvfvzxxw3GzZk+/VRuQ9NphBras2RvPzbaG8XQazCKWyVoQ692NG414hOXMgwTHGmmtxnjkXOlQWSj1eZM18DeVMshWU25V6Pg2s3sjRF864bokrMLSjoJe6FX0s5EIaGDe/tb7jVU6WMgjOHZGPUNYzKK8rc355J+eK4ZNT3CKL4ovwkFHn9GRIO34ZaXUgcREGMQR/MeqoQXJsm51DeHVsdJVbZsBHINY0BNZQNtEHwaKX3yibSKkyUnepiaixYtKlOMPQZmlyOBUS2dgXKaDaWNZm9vfTQmpGA72kKuKxUsXQKVu6igG+6G2OVKxRnxiu6FiDLn35wMkG9tN17oSc5SuT6DYgwP3gBsTmyejZKSHPH4M/skNTrzUCMUijfNkBHBagShUBTYfOdCZXVkJs27rf37NWs+kOGc98wHnLS01ODsSE+uRaQJQpSK2MKNw8PDmtVg6mg8Ksw0Q6/UT5eQOjdIuoReF4t/mF+c5ExDvkLGDthuFOAE0YAtnVroMMrkTpYpzAE5aqKrdhLE2mYrnQyEMTxaSzoQK5oJdflOK5YvX25p2BM6pOCG4cxNbX/00Ufz4DOzNJZTYcTkqWtHfQrO4yejJUuWGGhBtWvWrLk0+sPM6pcu3CjSJLpUcGA6QIJMAlNk2RRYkSvUlMOIJ8VQvZ9W+N+gfqMGy2nTTdCm0+VWgOjdMZfsJhw+fFgUdcdcvgECbBAYxjhy+vRpDf63Vz0FGZTJd2SaZQvRGwKlAexBFh55prmeLgXQCpgqUYUIIkGQDgMYR8vneycN6vmt2LSvHc0qZLUZz294RCcpmZiEXtlZlKdPn56URh8yD+EcGmXLGCMH/g9Qf1omdOFIbwVGHhCpZs6cWYaOBibMjVq1apWgIcy6cFfUvHYoSR0YQ4OiqAFCIK3G+EwGxRienKfV0ttRoA+P3GSXH4gA1CY9iGisMgll8ENEQEBWjd8G2njGaGpct4QGtUPQjJQTXX3Gq0md4BRsRl7ZLkToG6yW1Oa8/EoHjO7K5egOGo8W0mYK2c5auTRaz/U6Iz/Mmzdv4cKFOa+LTZaIxYsX8wk3ignOqLKbaakPKANF89OgRgqNqKY+0+a8pS+Xr6706PLcBsqpM9UYlDmGZ9A/bHuQoC15gvGSNzxjWyIUT1oKYZoBZWooWUMvbdCOoTpRJXBRO3tJ+wZaw6dCnv1nPv7UgdNZdS7e0DFlHZPaQbnMYl6TzYsY+plDmuOvwnZddfZGtqVNZWY2BAiDjb3Onxcfmvdu27dzGtELfYInS7st3J524MDMxXfu3Jn7ZuCwzEAQ8zjEHVOB2QQN9y3HXt09rcE9hMK1+j/pGZSIkQdgnDMfQPO+acMGz/LEiROUl1EwSoKa5peHCgxAMXIGYs3jLE1+SlUyikziaYsmnixk6uzAiEObxVPNx2c3gn6mtw6Ut5ApHe8u2GsLiFh/zGd0VeW2z1eghVZ2hnP92bZtm4s1/8nlGxTEB/Srk+ddL2M3n6oUnCvbHZ7AyGBsH1PlDqgm/WMPHTY9c1fLrWrSLRYq73XfYWanzrkskc6X0045qjGqMaoxOqjGqMaoxuhgIIzh7nsMJgMmkZGvRwjPzPO2VCEPqTFH+aIHGXmKUKYqytZCtlCSnJtA1eEHWJX6m3oifnDUypUrbVROm6Ujn42ztN2wSqN0xmygaTMZ8GRbU7cVQg60RGmsea9VPvloXri5UldhPkC7lI3Ugfp2mVfEA9BaFA/HGh2y3bWb7XCI7YYVFGc1N2Tu3Ll33nnnrFmzTFTMZDIv4j2Tk8y+zJqC6U1aa/s5BRmUyTcB0YfHmem1eS08cmpTwRNS58yZM3kfCruaqWX53MN2EYABbMSuXbsIJQe2WOUf/PnPfzbG22JMHR4evkKpn4ma5so5yqpAQXPZRWRHC1ltaTxRIgwbCH1NeCoBSmA0qy6fvzXf43Lg0qVLjeuxHJzCbYm1RkZGZs+e/fTTT7tMFkqFYKQncXLPqkilGulnIMjvM8BwY7DQ4QTkvJbIIcFZXBqrO9wpchYbs3eqMUARw1gu+eltKhCBAYyYDO3054lagkrYRiTBqVOnjP1Wib53WMGwrSa5gA6iCag5f/58j18dFUgz9W+QiDVykZCsWLFCIaMyY9ibayl1/wNH2aVQ3kJ9bISW9uh/Uf6/pEZ6YkRITd6AatkLl6AC/+uzY92Q3o6SOqpso0tTsGoUmDFjxr0FLcNRDCOsiTmM1Kam6Wq6nXdZVp3Ls0hoTftTkAEyhmGeDRTytLLdaEpzBGEo3bp1K3HA4CdJyFhL8a0lktIkdEivqSHvPSXQ/Q/YqlghzijLOugJ2fWZpKsKBlSNkLLhP2kJ5bV1Ugi5okiWXcsXWZq/N7LKnxqBrpa6PdtEtdAUnMLp+FAFq+6S/K2YosHGdElS5HKaVsq3HvMxfBn6m//q78B0gzeUcyJOyBa0ZQOQ2IU0NTUZFGPksZm2Ntnuc8+Vz+XezPP2wKTdixcvlmsRHxTmzJlDKNEKqF9kyDhHE0bEHHstjJqSjcwxMp/JVDUJGH1EcFdje1rWSYmKgjPmswJlu64+b66OCnWSq0XFBMb4nFVgtW35OlAtD8+bN09qlHkI5GDJzaAz6ZWmlhQME9C4+6kDLplPRM4y335HH9xetoQByLBiKcVyc5B2SsNTjgGKGNFimU8eMQ2AJ7pnzx42oAbPNZVhHmlXb6X8S2Ihwnyjt14gRBYqOf/RLVu2qB/LadZSkDHY85tMLPVjM+dS/1quaCFHNRWcmoAi/ZbUuQIqlPIlWYIuUWdb+UZcAXXo2HXx0kOjPPzww6xiOFCB6M3+c68yi3iqIECZell1J5lf5y0h3jrEKowOboixST8zf+NDt7GcecoxEMZAG+uz2oT2jz4ywhEuSWUjpAogqd56UZiH3S9lslAhSXlGTQWyKHPRfXQvFaEk2nJSsk5KlmOFGg1KysnFaqdYRRu5EFVpYWhoiNadPcpuC72qBU3BIS7HanIn8xwXaFUfcu2l7megWoKDQ4g4ELe7pM/5nq+hJKOGmnAiqCaYCKq6ob4Uq/nOyfr15jk2ZhiCjrlvmYCBK1xOylONQYkYnnTKHgaKWi6/nInUMjxDBaslGBw15S21mmyK4rFw4cKkNwbIvMA1e5EhJBaBgLiLWD11Z+EiEBMYQ1NCBwE5JC2nA8GqgKMRBWOzmgqRoL1qwpa2svbTK121hUCbd6jlLapyewq7XFQOySrS1BXos+32xm8wabaqJzNnzuRS10vuuUWQc8JAoNsu0z0U7hzlSpE7kJrtIWju/ui313qbphiDEjGuwANDnkr0YVCkpESSVIhJEk+Mgqa/FA+WUKc9HFZJMBCHmCAhUaHVBAyToJ5MPBzCcmiTn2A8di4F1rrOlD3aVWBRyQmUnXrBggXNa7IdO5xFzCFTZ0TeBDhElwi0ufjyd1dNW5+Fo7RsOHjggQdiDHGslbWZNJyi/2Irn8mAGoOwQBwerVXZy9KlSykpe2HMplGoI1N6+umne8IvM0gV6MCutBO1ZZINe61q2S5LZaQmVVG8HKMNHZRtYkrHwdivNbNn/dF+05Wr0E520StFZqOmNCuwZPLtLFo2Mcgqq6jZfq8xIShDwI2gpqiYC9eapnJ1SAW3SxixS7m9cGRv5WoG1BjtY/MISURkkABkF6jfZJEaQLVmEQZ7iZNsCg6UKjgqvgLdW+0dPBqOUrA3qy22k5FYYZjPKLt169YkJDCB4RnRKSpsldePNi0Pld+N1oJRHHIzB7anU0Gsc4qS6q83+XEhYtH27dvNrUszvXb+K1ypE4muCg7vb8FkOjPsbGxM09X5ShhQY9ATPDlLGs0wT0/N2P7xx+bK7UsqMqInWY3EPa9cZVykZuyPMqBalqHdmHIKLZGL7VTr1PTNlnKeYFd/f6B+aa93lhTYhgpl/8oiA1g3h1j2F9QBY6hjSdMuJ4fkNS7cBEstd0o527PkCncg25s5xPvvZ7AQcm1RwV3ScjqG1j9ou1RBNcbl7SHis70aYypTjXF5e4j4bK/GmMoM9OTbFIJWPMts9HSJHp631TzObD9afq2svL89KqHP4S3l6P8FMxMTWWrrrY9Ob5xXs5QUYRW3NgVbYIYzMjKSL6qYGkXlyiqQeOoop37bQ0fF4XRspp7JevMJy4EDqdAMFV1vlrSjgqUxYmhoyE2zcf/+/foJNxAKWnYKu8ygFi9erGOZtul56ULz2bxl02JlwCffUXlWLQ3hxm94fq2k7LIsB10mez3pa4npRmjEXn5Ll/HKqRrWrFmTd0dO0bZcOnt5xDVZp2aFDz74gKlMsvNOOXVCDtFgW7BRHeLeVn54Ds6uDJpOZ5rWu9CC5ZYtW/LNFE545plnEjHK/uZaNKjz7p5VZ1EBQl86ANuzrGCgI4aB1iPMY9uzZ0++9QCP2d5sRyq3BaSaLVFhVv9btMOZ68o/OpIaBaO41XwMov1SsfcBn4LBGGJa+kCFO3bsaLpYKHV7l4Yr+tau2pWckB+yy4XL3zLed6Jxx0r5ZF86OTw83FbuP3WCkktg6ZzOHWan9KetaXu25KipyYAawwOGR5gHfO7cOWrzOPPwqDCPcKwhzQyx5UO5Brq3qgN0Q0C6oVA69YkcRnwAM6dOviPYNHQVRXhXeruNCZl4OLx5IV1SI9Mbd+M6QcOkSwUn3bBhQ3KktFz03wg9vbWdzfITRLAqU+U6xNtqus/KyABk4xRkQI2RT9OkBFmVRGXy2sjnxn71/vNDGQTEmfSkEJLaodVcViGmJfPJqtSl/XTvahrNFpmmgJSJ0vzbgTh48GB2ZXSg3TZm9pNb4f4IbrK+fHhiS45NJxVUsz02a1OpNJhA58BYOodgHG7ywDKgxpDHY2f5vrTV3bt3k0t2Bc8sD763PgZcunQpyjbqG4aDJCqnzrINYhDTDNt5XWavhD5DcieuyyFFfg3iAxswVb4TmXb4oczbX6DgM2fOvPvuu7zhqF4T/4nJuttl4m6e7ezpXlvZquFfb/Wf4W0vIfniyMhIe2ONRHKwrKqc+tk1BRlQY5R3jM3vUno8Vnft2vX30R8ag+dKTOW5j6ExjL4Z/um7fPukIbuiPKQDmX4YsEvi0wzJNMcYKugneSG9TeeRLfaW9pr/8y0Hc5TtVsv3mw6aM5AppEZmyYzBIdrMIS1pUAXGYCfdyM0pHexVVrClrYxsFwC1mWHIqsOXLFkicc3e9qgpyIAaI29yDJCGUqsUebj8gbJHnqeuXJ7vGD42eUWMYZrRixflf2z3kw6UN6L7+veSdabOtFV8cXl2lAotuSIBgaDZQ8QQIkRI5F0WRAPti2DMljP2Y4uzGDhMrNVZvHhxe+B1KN1pmmKJJql65plkiVa1YFBAqThFGVBjREyklsdT3l72/mQCeaJjTWsMp24mp4XsasmQnD9mMDXPRjDGFS5qhVgs/46WGYDcs5oKCq63NY/Gg5m3gLB///7+U/QjELldvETf15+jt6Tl1CzfY3yV6yRaVnW+/K3u8qttPHUYUGME2pJQKRizzb89yGxvC2OK0VdyoiCV2jtKdkXibaF8kvZsuxcURliy9t56QWQw9mcST3w8MDQ01DZrb64regWtK0M7CSaZhV+BPrQK1qb6KV+fEqiaDyjb+u4wr2Y1vRKCsmsKMtDGkI3kzaPxbOvWrR4kEUSLlo1kxtIh77//Prk7qYG8mQIXktqlDy3ZlVkQqM1RAg41G8XLV0lekg1KloiveRFbGhGItG/mgBx4HUxdrjjp56S5j6P3MNiow/m2S7bwtjuf1eaYUnBpKU9uBtoYHhJJKZgUShIILtvHBwowZBr7Caj5a9RCXmii1Ype5e1qGx/Uj3o46kj59zew10RCxOANSHgyJWgEWELEzRJcaw9lHXaf29nF66+/7pITjnQPCWLZO7mpxrgmdFCN4ZKrMQaOaoxxoBqjkwE1hqeFc+fOmVpY9WxWr16d1BztgxxrdpWfnFEoXwdpyLf00HZAP6kc7cfSttCQnttoalH+EL35S/TyDna3asg02nUFxrDM4eNPudkNyofK1+zbO7xhw4aMTelnW23SM9DGMHQZiYnMFhPxfJEbnlk2jjXG+43lh27Lx8QN+mNV386Wf34pppFL3uSSfrqtwt69e7ko2roWLqGt0B54c9Ef3XCNca8tBqP+GDJud/6mM9CplMj+bPnbbmXpB5lme55fymPKG2+8QfHyh4yX4BMj6Lx58x544AECmjNnzowZM/5SULnIu+kYw/CGAhm1GwefGFWgXldw4Xruzidup8JEuZbPyUBHDPm9QJE/Kjh58mT/NzLGYdzKWbZt25bPUgLRTJs2bcmSJSYMVmVEQseWAiU5BLZLjeR+jK2ca2kOHnja/ud77+zt5nsKkivX0l5OqTvJGVBjUCSM0Dt37sxrftNW0SN7x4dIxLz54MGD2QLiWLt27RXiSDBhjKgnew8cOCCbSoWJgkvOGw7DENasWSMMehCSRoki7KrGuJm4+5BEma2Smi2nT582KmdvJDvW5CxvvfWWsT9bgqFUNmUoNeeR3b366qtvFpYtW2ZLOxHSfzNX8mpXkfLAkk5yQgorVqxw/0+dOiU8lr80WcH/vaqTnYGeY3gM0qdEDPrLN5cwDsZo9aG8a9euu/u44447vve97/3+97+/9dZbv/zlL99yyy0/L3znO9+xEUNDQ/ljOj0XXi4VNGUwzjKj8gCie+5te3vNv5nB5Pv48eObCuJndk16Bt0YprB5s/naa6+Nc8SgEihQ+cxRXij/vkxSt3jxYvON4eFhe8tMdZ3peP5Xiwk6b9x3331ii27zBlozNF9ML68TBhYjQuxhduFali5dKidsvlj/xhti4MC6+otl0I3hkeRdoUFLWM/26HWsyVmcN29sQ6tpWm/fkgWKaf7bytKlgoZp64ULF2bPnp3PAdCGO7JDygNIGQ16WHXtRoHnym9+IpGwrZnCpGSgjfHP8s3zZO2khmzHODwVpzh//ryYYDphphHoXtCwy0Y5hoBG5QwMh+gwnnzyyWnTpi1fvlys++tf/0pYED3yzflUHp+g9/kxR9L59evXG54gq8wfwaMa46ZBZEas/EHZwYMHx/lPMmh3zZo1+eQ76RBMQ2V0+ZjvnXfeeeyxx46O/jfKNg6ID9Lx6dOnz58//8MPP8ynHC+++CKFtZcwUYzBw6tXr968eXM+8pNNmXW4+cFVDHL0+zxUY1yTfG9cQcjKZ9uIFBTyKpYHxIfyLup1XbILzGCINbLef//9wkvzR7rnz5uBuATeKC9Ce6+qJgSiojzQ9cKswz3JFdklexzw+dL/TDXGNanGCNUYA0c1xiBQjTFwuOkS+nzT2+Ppfws0DsZwxn2j/5eVpoNVdrXUsa1bt5qBYEOBJdgG+sbMtpiQmGnwM06cOHHfffftH/1J2VPlV2pSGQpWBxP3wZzK9eJ4+a+cuWq7csmT8gXuoBuD+PK61qAVMWF8lMQGRkfDpKjldC3UECkQx4IFC7Zv326OjvYvVKP1V155xRT873//ez7ceOuttwjrnnvuiarUT9xIZW1a5vBBQ+gTIXkDrmj37t3Nb6KM/hYe3JNeaRIx0Mb4xz/+wQ/5gM8AnJwKUWfKYwSZigwypZdffrlIt4eNGSbzypUZKD6vMq0yDNruOZYZNIJZs2apyWN3FbhOumUwzulyVMqDRv7gPh9i/vKXv3yx/GYCco25Lak5mRj0iEFJ+XatJ3Hx4kXqgSfxPxvD4VF2b738ogeaP7a4ePG1114zkCvY3l/HISHS14GmH1dJORuDyrYcPXq0+SrFpk0G3YceesgWwsKMGTMkVzIrAQfatOsKhWmkV7qpuDlixc7CT37yEzFwVcHTaTzxOZ7FIDPQxjAeewDJ6UUMk9roMntvhGg0Dy9P0Wpa4DeqFZEy/pU/s9u1Z88eG7mRdlVOI5+T5rcEy7+DMU3/v//7v6cLK1euNPrK0zYXpGT5y9h0siUt3ETSDb01wcP999/PHvmA/80332xvb6/2JGKgjSE/8Uhy6w1a+ZptuMFRKk8OzFAecfMdPtsN1cuXL5fqJBy1SJAkPIbw9usnXxRkNGfOnFtuueVrBZZgwh/84AePFUxIpCvm6MyvcrqKHHvTWbRoUSLbH//4x5GRkacKIp5dOlkjxvgRNSeIs4ctlGTOmr0exg3GjbSDtuwpesBCBAmyAW+ID2jexT7/fALIsWPH7PqidNkIvDQlAFL/vMLdd9/NBrY8UHjwwQedVJZiUm760R5y00k3VqxYYbyAgktIWtWGuNzeScaAGkP6BDfdY6AYW2Q4JrLZa3ubGoVsz1E8w1GxQaDyVIC8RZsKEgODn2mxyT0chbaptvD50VXoRlaTs82fP19asnr16rzh+cpXvvLVr3512bJljMo2zW8VrlyZqQ7KJTZjgXayZdxwUkuJk3uFWbNmPf74448U8vIaX+C9GhwG1BiRgsLx48fJSCHRI+NWqdKrQ3BSrEOHDslMIjL1zRBihtShJ/Hh1YIxj3n27t27bt265C1jTfFmzxU6kwK364kpeBgeHuaKn/3sZzNnzuSHdNX15t1uDqHRtp1xI2fkUokTFi9eLIkqb6fXtBGjVJxsDPQcw1MhYoEiZvBg8ulYnpYlDPwqmDOwhFQEEVOG/xJCmrm77YY6XLhwQXnt6H8DK6N5g/KYklM4aePUIiazDinc7MI999wjhSM1I/Htt9/OMzD/yate1fIhSQ4cf0SMs4UlS5a4/83HmRs25KHcFLuOAwMdMRLHjZ0mGBGWsACTgTY7knuYGjKG2JL3P/AIs7eFf2RQoLZVq1aJP9rXZuOtQq/eGNA7QSHXFexi2vJt+lco7+c//7lEReddoNAB85BcDjOLb+2/odGOZa+VMbaK9nVSype/Q1ywYMHu3bszPL1e/hzA3vRnkjHQxmhG8lE/8EZ2gRkSyhPNzWI9J3LPm1C2kUrJgLlFygQ5yZNPPplHK1FR01FaZjzkXKXh8SNX11spX8cSMRjjd7/7nQB4pmCy8b2C5P5c+e051xUV6vZHoyinkbHA6YwyjNFE3n/+U5dkrVbxxhtvtHVSmExUY1RjXI9qjMEiYi2+qMaoxrgJDLQxkM8TwBvbt2/v7S6/mVm+vLOOXNpZoI3glsywjx071rzDKh/Ybd68ubis+WcXfBI9edK2eK7j/2hzUuTqslHPV65cyR73FRg4LxJ+85vfmJ3zuQvZtGmTzqtcTNHgKnL4GGHccdL0c/bs2aZ8eTfw4Ycf5paiV3USMaDGaEXTLm3kDZpG/+cS5qYbN25cv3493TS/7lT+aWoww7YRYkj7yYbtpo+G59TJRmR13Cgy+w/SB/3ctWtXPlpmBiM0zM5J88c//vHDDz+cl1T9lzmmutQx/WFILsWf//xnA00iM0/aOyldgQE1Rj/ufoZ25Qh97dq1xq3sDcL6vn37yteONktFyIhVIKGCFnr1CmIFq/T/5gjG3x45aVt2gZZZTSolGM4viB7Lli07fvz4X/7ylx/96Ecu3wXmdRbaw9NafztfCPI34Zcl4NTCmmEFSeG+8NMNCBPAGMFT79fNI488Qhw4ceLEFbmEmp5Wf1TB+fPnk3rJTLLFpMUQ2H5XyiHIWRTG/2E7Y+v/IFdpvrh35Mgzzzzz+9///t5775XVCJi/+MUv5s6dm0QfZlz5pDLd/mJ77oY4+9GjR39ZOFl+Qbh8jtr7e4ybcq/GgQljDBiiAjUPDw/n8SxfvtxE3NMyqjWT8ddek2YIIKaMykY7SNyNtWpi4cKFbR4lmGgneXy2eMatN7Jl3GgUXXBqfUBvR4mHLP3EE0/wBicYF+bMmTN9FJfjGuPwL7zbly5dYkV3+HcFWwRktxrK6W2pONmYMMbwAAyokc57773nURk+QdzSbqOmxEOgh3mhJcXzg6EOlGQiXr7TcIIHZO0qmIWLKh5882HVs88mDdNyTsd+ThSTZMtY05ohhaCHCX1igtxvw4YNLHH33XcbudNt3HnnnUuWLCHffOLmRqXPzZ0a7Xxb+ExyVLDqrsrWHnroIXEDHoEw69bBXj2sxrjJRCh5YFTCGMwAxpAUUX+vXqlp6RHm24egLTPIfCfUFMVoZ2q7YMECTmAt812YX0KzopCYk3OxR3TWkgbHDWdHrsjZGVt8WLx4sdCRV0NwRXfddde0adMEk73lB+CaOzVqqv4WbgQ1XXVpoBE94xl3xNvcbXfMll7VSc1EihitLj/66CMiSJrEEqRsabAvby8/yhO1evr06fLRxSVC93STMjFSsnYi4wSP2UQc2evZK3MaI2VQhAabBK4wnt5wrpy0X9l6ZRTXSaN4+NOf/nTq1Cna/e1vfysSMn/Sqkba5VYgx94g7bmkcBKnkZGRBx54IPF5aGio/WbK5GbCGINKWjx4yiZfeFpEbzrBEhGBWAHGMM2IMWw8fvw4S0BiwEgG3fyVtu0yLiwqyElmzpw5f/58ypPWswdxOGOvE+NLLhbKkXjKlrFukFzJ/t0BMVDoyOu4/LQKEjdS/kxyCsusCq0C1IMPPljSqAaTNNE1eyc3E8kYls0YWMZvQ2OZFGw+dOiQcGHINJR6ouCEqEFkyAd8Fy9e5J/ygueI+hn5SEc72pSYobz5fEUAMUBKo01R5s6d+9hjjz3yyCM2lulJQ7/I9ESvoiRY7e34gtByudxeszlX+ox8xRW8ocM//OEP9d9tuf3225ctW6bQvIgo3wyAA/UwLSAbr0bjOV1uIIMZHf7whz+Y3pj6QwC5zuGTiQljDHhsea4wklEwInQDfx4qIh11uCURg+6ZJ6kX9YgYf/vb32xPUzkqp6AGdTZt2iS2mLJzglPMmjWr92cTM2YYNQUo01xt5hCkhVZ5va1jQ/FgcyKXGUy7dUmI+/a3vy2Psvr973+fMWKb8sFP7z8h5SjXmDLSZourUEFB8glxld8effRRhScLmd9PBSbSHMMzy+NUfvfdd/kB27Zty/tE5eave159VQYl//EICUJCDClB8iXQijyE6KVbaTOyDtGKbEFrRkcuEohkZfnOFUhETi/gSPSt8pgTaQTp55iie22Hc1K4CsMEJ5sy3Xrrra5RDPnud7+bj8/zaY+uljvX3DqHKPRa/E/SoEK5tQfuvPPOL33pS1/72tdkaIYS2HWtYycZ1RjVGJdJgwrl1lZjTASqMaB7bYdzUlRjjAUTbPIdlCkjZU/a9PrkyZNsQKbwRDMvN1uwEWTBG5mMfjT6I8Ra0A57RA3KiCzSuJbNMajKHJT6A0Nq1jR06dKltLh8+XKizOn4jZFgrl/O8AWQXvVWyqpeKeh2dsGqCY/R4cKFCy6fJRYtWqQz3yksKeQNr6NKM5fJ4aFtzf00RcE999wzc+bMadOmzZ8/31CC/vqTm4k0+e7kcz6qIoaG3voo/RvPnTvXBIvCxo0bDx8+zCG7d+82GX3ooYeOHDmSz0DAfjADFm1UFqyIrBneR23cT/9JUy7nbMgh6F9VSGX0l4MTPfPMM7Yz82233UbWewqxx6pVq0zQ143+/kPcBc1aNufoG2tcY74y+Ktf/Wp4eJg3bEmdkGqTmwlvjLEjkaTVUDDoHj16lOilcLwxffr0WbNmkQ5+8YtfSLGggoyufTUspMCA7Si2kelBVKHRGxQZyerJFd7oJ53UPk8qiJ+33357jCGtwje/+c3Vq1efOnVqxYoV+QX/0G8Mp1DWQ/HwjsLChQuVHdJ+KnKdPkwyqjGuCREQXHFHL9FClASypiEJjOBgJMa8efN673RnzHj00Uc5RA6jQr5MQayyLG5pPg05ccL4Le1xrMEYzYvk8im+XcJR3pa+/fbbzoKc8VroVZtfmQLlY2/zjR8W4kMp39e//nX5ntmXOraUQxsc3isVV8ydO/c3v/lNrO6KXIU+2+UU+Ef5jkkqT26qMa5JMUKP3qZrDN4UDJrOlCZWMdAyhhF3QUFZ6m9mvKwwZ84csxdCLDOXBhm8ZTwjHEGFZwsmOTStsjrR/RXQq6VdZj7tJ9PNnzjNm/eHglWR7Vvf+pYIlu8NiC0wZTLpSgeElzVr1phw33vvvTmWhbjXlTKDS0bmNml/clONMSYY7030BQqT4Kicss2ABZC83jGdFVWMys1v+hWeeuopspZxydCEDhBr3rNpylLAkRRRqtiSXC7YfuzYMTMcE4mM7hRsKZHD/ysIEQxw1113feMb3xBMlBOjdIk9ErVMJ8y2v//97z/22GPKODj6W4NTkGqML54rIkziCZXTetIq0HHkyCpo/lJk+fKRkRFR5eGHH/5LQSE/x6b817/+VZBhnscff1zqb8iPK2CkJ26Nvzf6nXmcO3cuXzHMHxhxiI2CicPNN6ZNm9Z8oWr9esGNGx8siBXmFXYxmMORpqYm1RhfPMyQdMuy8w0pjNmXLl0iPoN9oGyxQmDhkyg+kxDIqeRg8hzwhjhjUJcahfKr0A+IBuYGsqBf//rXCvRdXgQMORHKBKE3NxB2VMjvj0iubrvttvz2ggimcSdt+5yrSHmqUY0xVrRxI05IGVlFb/0q6FLqj+RjMLuQ9ggLsiCYxsjQuCWU1067UrZXADFRyazjatrzih44ffq0lhO1HPvWf/4uMLI6BanGmGAY/nlGqCmf6TeYkRM3b3ALhB1YNfaDqTJrL/9p9bzJBtvIrJqp9+jnLdnVO0GlUI0xuBiwkwLJZzJ+K1hV6NW4ChXEgSRpps5oPssok5ANGzaY2b/wwgtJ0k4W8o4rZ8GUTZyuphpjQtLvjVbNsQ2yen2K0XofgIRs6a1MeaoxJiT9Cq7GGAuqMSYk/QquxhgLqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpUOqjEqlQ6qMSqVDqoxKpWr+PTT/w8fzE8VP5ptmAAAAABJRU5ErkJggg=="
                    photo3 = $scope.user.poto3;
                     $scope.item.jantung  = "background-image:url("+ $scope.user.poto3 +"); height: 240px; width: 240px"
                }
                if ($scope.isAnak == true) {
                    $scope.user.poto4 = "data:image/png;base64,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"
                    photo4 = $scope.user.poto4;
                    $scope.item.anak  = "background-image:url("+ $scope.user.poto4 +"); height: 180px; width: 220px"
                }
                if ($scope.isDalam == true) {
                    $scope.user.poto5 = "data:image/png;base64,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"
                    photo5 = $scope.user.poto5;
                     $scope.item.dalam  = "background-image:url("+ $scope.user.poto5  +"); height: 180px; width: 440px"
                }
                if ($scope.isSaraf == true) {
                    $scope.user.poto6 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO8AAADuCAIAAABeTsdLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAIaeSURBVHhe7d33t1VVmi7+759xx73Vd/ToW9XV1a19y2tZZc6KAROiElQQySAKKAYwI4IJFURRQIyICURFDJgwISZMGNAygxFFy+q+t7v6+zn7Oc7adQ7ncDhpc9TnhzXmmmuuGd73mW9Ye+29/7//+hk/48eCn9n8M348+JnNP+PHg5/Z/NPCX/7yl//3//6f43/+53/+3wqc/sd//Ifjv/3bvymAq/Wtuxp+ZvNPC+Ex1J//LVAZvxW6KKF/ZvNPFCtWrJg2bdqIESMGDRp04oknnn/++ffcc8+3335bf7lroiuxmTeEf68gNR999NHrr79+3333vfDCC2+//bbTGBVHfhPKaaX5TxeMMWko/OlPf7rwwgsHV3Deeefdcsstd9xxx4033njSSSftueeeu+2229SpU7///nstiZqpduxC0utibI4f/O6772666aYjjjhiyJAhY8aMOeGEE84888zRo0d37969W7du48ePX7NmjWZRhsLPbCYKx4cffrhHjx4E9fzzz6e+Ghi/fPnyXr16bbPNNs8995yaBB5NhSWbIboSm0NlKtlll13GjRv30ksvETRD8uGHH77//vtfffXVunXrli1bxnXusccet956a+6Cn9kMt91224EHHrhy5cqc8m+s9Z///GdHgs1pLt1www1///d//+CDDyoj9M+2uZ1RZHrllVcefPDBL7/8sjIDM2PGjPnz58+dO5foH3300UsvvfTuu+92SdSx99579+/fX9mNtPWTJXQ4evPNN7PKn3zyiTJRsAJAqo0LEdQDDzzw3/7bf2OqldU7dgl0ATaTZgIGdve3v/3t5xXMnDnzrLPOuvPOOxlmPHZ10aJFq1atuvbaay+44IIlS5aw2Xh/2mmnucQC/TTZjJ2MLnGJyiQV9bXNOiuX4gMF0Gy5ws9sbk+QL0i3DzvssLfeektIJ0p+5513pk+f/sYbb4g3rr766vXr1w8dOtTpqFGjZOu33347ugs8dt99d5l7OklvPymEiBK+CMEOTwLdjDTcog3zAb///e+vv/76+gtdAV2AzTHMKIupzMaUKVO+/PJLNaKO2OAvvvgi6mGKTj/99GeffVaZkb7sssu+/vrr/fff31FN3Z746XHabhd02e1oSnoRZvNI4KEwefJk5iCVXQJdg81/+tOfDjjgAJHGpEmTXnnlFZUUIyJksF0trpAaVGostHB64YUXLl269PLLL1+wYIFTzX6CbB4/fry8ov5kEyHO/vWvf/3aa6/Vn2/26BpZIAaL/F544YUbb7zRKQZjM4foCIXN6rEZlRlszF6zZo24efHixb17906DnyCbJ06cKCeOiDZp+Rq765hjjrn//vtzmvrNGV2Dzffee6+kRKL9/vvvxw8irgIRF7cIysjtCBqomTdvng0gnXej058am0njkksuEWYQiLVv0vJzyxlnnDFr1iyn5LlJt9cEXYPNN910kzzmhhtuYHqTx7QQSHzRRRcNHDgwzz0K738i+O6778aNGyces/BN5aKd4Cg5OeussxRIfvOXXtdgsxTw5JNPvv3225U3yUgIORYtWjR27Nh8mPJTY7PlyzSEXln4JhE6zu3BBx9MdMeI/Mzm9gFGjhgxgmQJlJEoWuEN1RQ01pbKZ555ZsyYMUkEtU/9jxvkkDhBQjxy5MiPP/5YObFZGrDWKA7KRW7SjHfffffhhx9evXq1G9WrnDlzZs+ePdeuXVsn35/Z3C546aWXDjzwwLvuuotAC5sdow+gJ+WYk2poL+YeNWpU7DrvmXt/3LDGEHf69OmswKpVq8jB2tetW/fUU0+pvOqqq7g76cSyZcvSXv3ee++tfsaMGYK6Cy+8EKHJ88knnzz33HMJUJvG4t3c0AXYTI4sRLdu3ciUQLm8wkg6u+aaa6677ro83yi2pxp33333cccdR6PKG2zw40OdFf3P/0THoUOH4uKSJUtIDGQRpHHnnXdef/31eLxixYpLL72UTEjvgw8+yAPQYcOGuYWRVukSO63md7/7nZ2QzovwN0N0ATZLyU844YRTTjll/vz5Tom4CFQUwQ++9dZbUu8nnngildXQ2I077rgjjTql481ZGe2FOub+5S/kNnz48PPPP3/ixIkle37ooYcGDx4sNZTb3XPPPZdddllY69Jpp5222267XX755UceeeTixYvVEBcTvt122x1xxBGaRXQ5bp7oAmxmVrfffnvJdf15FUTS4sKVK1cOHDgwkXED0BPDTHPcK30kMqno+sfMaSy0cM5K6izSGD169Oeff564mdGdPXu2uOuiiy6S3sU2565nn3329NNPZxdeeOEFdj3PNHjF7t27T5kyRXnzF1oXYPOHH374+9//XkhXf/4DCFfOzti8+eabwjt6ahDYaZBg+o477hgyZIh+ork6Lv/Y2Rwuiij2228/Fnfp0qW5lIWLNx599FHGW2gRocVrffrpp1KUSsM6SP4Ykb322oul0GzzF1oXYDNB0wePmXIdEytiVY73DJwWM1MQpd58882sznfffdclHpq2HdaYhXNrxx57rHyDd5o7dy52ElGRAzEyBCWEcCnyRNxvv/2WVWbF+/Tpc9JJJ33zzTc63PxF1zWyQL5S7qLAAxZGRgfNgw5oyO3nnXee06gwl34K4JrOPPNM4cRXX331yiuvXHzxxahMIOF0voESYbrKdxEOELKWTz311GOPPdavX79FixZp4JbNX3RdgM0wY8YMKlEg+ri8FkoW9alhzJgxzLPTeNWfFIiOiWVclZ977rlp06YRHTF++eWXxCLJw+OFCxcOGjTovffei1TFFeI3BaIbO3bsww8/rBzSb+boGmyWl4j/1q1bt3r1aqeknPqNcppxctc+++xDVU7LjT8d3H///d26dVu+fHlij3PPPffFF19UIIrPPvts3rx5hx9+OEss61BJngSljavoO2vWrEMPPdROUL9RUW8O6AJsDgVFCxdccMH+++/PA6YS2FpCB2XacqzcUR8uy3VYHY7SvanvEippOyyTBIBrcrzkkkv69u37+eefuyRgi5tyKdK455578s6nlNrx2muvlTQrCDykKytWrFCu4/LPbG4XiPOoROTXu3dvFnrixIkqw2AgZeXUpADqv/7661/+8pcSoCFDhrz99ttdQhntiJC1RFaCivnz56uRF956663kk4eVH3/8sfAjhlklAaL+Bx984JQVID2FTQrtaosuwGZJiRRbgc246667RHUrV66slu+nn37KBicIKTj//PN5zG233TYvzXQJZbQXsv/lcH/84x+FxawvUZx99tkuffHFF7fddhtpoOzAgQP33HPP/v37CyfEG2JlbM430LQcPnz4Lbfcoia87xLoAmyu8LaOi2+88cakSZOEepdffnkuMSpDhw6dPHkylgsNyV2e7sjMqEf6E088UbPc/qNHlinwldthof2MuKwvN+VU9Pzss88ytLfffruWKPv4449PnTp1woQJV1xxxbJly4Qi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H/943HHHifyefvrp/BbEMcccIzvUDHJLF0JIM2nSJJufN2Md7Exss5ZHHnkksbLcQPpRad5ukAUKbOwWzs1pER0bYTgsb4sBahd0NpsRa/vtt08yASRCCo4CMlHg4MGDy5eC2gIdkuyf/vSno48++oMPPrA3jPj999/zy3HETFeemBaVdCFYGhfP7XAyF154IfoKKuxVy2Sb8/rr+eefb7Fp31644IILli1bJg9hoZ0mhAMalAiWbwzUEJ3H5vBGxpCPsmN9Hdlm+dkee+zhkgxdM5W52mroRLcsVq9evfJ+mRrSr3OZlU8cHn300fiHrshmePvtt/Oc8dhjj7WW6dOn58O5d99995ZbbrHAc889t5iMdkH6lA4+88wz+eGeSDKX+NtXX3210rCW6CQ2h0asY//+/UmcdSmsRbK8Qzd37tzy1mzboWdHydD111+fRxkmULjLYOfZVs2dY+swZ84ckYYVvfHGGxIyy5HgOhVcycnEGMcff3xStPob2gyysnMEFcIbEbma6s779etXXlJPTU3QSWyOV8o3W8mlEMvixQNiZd5q3Lhxbfw6YEG2ilEoYOLEicyYCSBu4a5IfejQoULA2kq/1bj00kvj7qGw1nodmepFixbF86SmXcAijBo1SoyeCM2I1W7NcOVXBSP81HcyOonNSVzoQPpltaRswVk5HqdNz549eat2EUR2i8RIpMGQsNCco56rLbHKBCHQLoN2Aso8sSe/fo3KQVndm2++OW3atAYPQNsOfvX000+/++67E9IQL+QScKoSQYXaSrKT2EyssO++++ZPBqqlTChEsH79+oMPPpiG6mvbBv3r9quvvhoxYoTdIh+S7KeyiPvUU08tX6PvEjB5rFWQ9uUftrOWsiIFDezkc845R+SmpppwrYZO9Al5Zi/JUVkGDXjXvfbaK4apwaXOROdlgRKI3XffvakfxUlCg9P1520D0TvKvvMv/kDNdfup8qQ2NSeccEL5Ra8uAZO3LqI75ZRT8uJ8Y97wgSpnz56dbze1C5szrsJxxx1naAVDVA+tLFykvnwFpl0GbR06j81XXHFFDAZiNV6w9EJeXF6payMowHHFihVjxoxRoAxhH8uRgCfgrPOzjl0FEZqwOL/5kv1ZuVIPrIrxvu+++w444AAFC6+mXetgXAMRYD490WED9WWIJUuWJHSuITqJzcR6xBFH5As/ZNFYxGz2gAED2pfNhFt+HiWoHvfGG28cOHBgym1XeScgBvLMM8986KGHPvvsM5vTinIpq7NqlZq5Onr06HXr1pUGbUE6Wbly5fbbby8Vqd4hynle9Pbbb8tMTjrpJHMI0qCT0UlsfvbZZ7fZZhuyiCAas0eSMXz48Lz/1XbEBktNqv82oQFeqPxnYUK9LgGr+PLLLy+66CLUSZIXfkOorFBWahvnOVrbEWHefPPNRx55pP4Lmx1dciotWbp06SWXXMK7ykFdapdd1Ap0EptvuOGG/v37l8/5GrMZ0at/67KNiFLPPffceyt/rVJ0XGACjAqXnccajeezGcIqPv30U7GTFPDhChp858DORKZ8enLiiSe+9957qW8jQk2Rep76JTSvXKl/8PrSSy9h85VXXrnLLrvkRed2GbcV6CQ2c+vz5s3L1ySJA5MiI8vO1v/iiy9GjhzZXllgOr/44ovFNsZi+J0SvbFwwtXwW06Tb6bUSvqbBJO0hL59++60007cuiREYHbddddldeKK8847Tz0beddddx111FHIbZltX1pkRX1Dhw5VSLzOJIOyrfXJJ5/cdtttU6dOzW8811CYncRme1fOy2A89dRTVisFzg6GCOutt94S6imoqdzRJqTPSy+99MEHH+QW/vjHP4o1JZoZF1x99dVX7Z/8xUG7DNrRyKLw9e/+7u8OP/xwG9Xq8sRzwYIFBCikPv744/k3DMvLVQjX9qUZVyevV368z57RZwxEvphsAnPnzn355Ze33nrr+++/P7fUCp3EZrjggguuueYaEslXMgNiIh2F+fPn5wlDqNZGRPGsxaRJk3SLyiNGjHjxxRcNBy7Rh62l8vnnn3eays0cFsXc4hDK7rjjjldddVV+kYyBENQyk/bqE088gVvWRYwcUfxeG1dnXJ0rnHzyyRlRt2rEHvl9n2nTpj3++ON9+vTJy6g1RCexmXCffvrp/fbbb3blZ1hFYCxlkfK777671VZb5U8a24XNxK2r++6779BDDyVruaCoIy/TuSrXRPQJEybkv1xVpn4zh0lm5wswCHDAgAEkOXPmzEMOOcR2jdywypITT6tpr3XFOshBe/ToEQOsc2GhxD1+78ADD1TO9GqITmJzjMSqVauYjWOOOUbgQRODBg1ikqFnz575tREms10UQNa6Apll3oYBpxyl0IKLEPYMGTKEtQ4JugSbq4GvBNi7d+9hw4ZZUb5PJVwmW5zruOW88847Uud8qZ4Nuvzyy8eOHWtHyUB4hp8Km21uS4VnnnmGUbGhSWHFihXiLd5qypQp2riK9KFXG2E4gZ3j6tWr+/XrJ/2XxNC9gbhL2feoUaNUasl3033XYrNtSVYKt9xyi8zsww8/ZK3FAKI4/s2q872eNG4vEFGeZhrisMMOs51WrlwpmB4/frzElJ0We8Rm1RCdxGayCKGVn3zySQnf9ttvf/XVV3NbzCeb7SoFOLYLsXSS3pQnTpzIhFC54FJBjMGA5dUZCkibroU6q/DDS4gWgtCnnnrqJZdckrSsvR5lbBAJoPMfFNddd51Yjo3IB9qbgzA7LwsMQmiy/uabb+Rn5S2WPGZqd5CvZH/nnXe+9957GWY7R5gRoXeQvjsTWQhah2Sdg8jtq6++uv7660877bR81p1LNcZ//df/D1KDwed2MfLzAAAAAElFTkSuQmCC"
                    photo6 = $scope.user.poto6;
                    $scope.item.saraf  = "background-image:url("+ $scope.user.poto6 +"); height: 240px; width: 240px"
                }
                $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();                   
                $scope.item.dokterpenanggungjawab = { id: parseFloat( $scope.item.pegawaiLogin.id), namalengkap:  $scope.item.pegawaiLogin.namaLengkap }
                var objectfk = "PKN-MED";
                var noregistrasifk = $state.params.noRec;
                var status = "t";
                if ($scope.isEdit == false) { noregistrasifk = $scope.norecAPD }
                
                medifirstService.get("emr/get-data-rekam-medis?noregistrasifk=" + noregistrasifk + '&objectfk=' + objectfk +
                    '&riwayatfk=' + $scope.noRecPap).then(function(e) {
                    $scope.dataEdukasi = e.data.data;
                    if ($scope.dataEdukasi.length != 0) {
                        for (var i = 0; i < $scope.dataEdukasi.length; i++) {                            
                                if($scope.dataEdukasi[i].objectfk.length > 10){
                                    var res = $scope.dataEdukasi[i].objectfk.substring(10);                                
                                    var chekedd = false
                                    if ($scope.dataEdukasi[i].nilai == '1') {
                                        chekedd = true
                                    }
                                    $scope.item.obj[res] = chekedd
                                }                            
                         }
                        for (var i = 0; i < $scope.dataEdukasi.length; i++) {
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED001") {
                                $scope.noRecketKeluhan = $scope.dataEdukasi[i].norec
                                $scope.item.ketKeluhan = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED002") {
                                $scope.noRecketPenyakit = $scope.dataEdukasi[i].norec
                                $scope.item.ketPenyakit = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED003") {
                                $scope.noRecketPengobatan = $scope.dataEdukasi[i].norec
                                $scope.item.ketPengobatan = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED004") {
                                $scope.noReckeluhan = $scope.dataEdukasi[i].norec
                                $scope.item.keluhan = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED005") {
                                $scope.noRecobatsatu = $scope.dataEdukasi[i].norec
                                $scope.item.obatsatu = $scope.dataEdukasi[i].nilai
                                $scope.showAlergi1 = true;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED006") {
                                $scope.noRecreaksisatu = $scope.dataEdukasi[i].norec
                                $scope.item.reaksisatu = $scope.dataEdukasi[i].nilai

                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED007") {
                                $scope.noRecobatdua = $scope.dataEdukasi[i].norec
                                $scope.item.obatdua = $scope.dataEdukasi[i].nilai
                                $scope.tambah();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED008") {
                                $scope.reaksidua = $scope.dataEdukasi[i].norec
                                $scope.item.reaksidua = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED009") {
                                $scope.noRecobattiga = $scope.dataEdukasi[i].norec
                                $scope.item.obattiga = $scope.dataEdukasi[i].nilai
                                $scope.tambah2();

                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED010") {
                                $scope.noRecreaksitiga = $scope.dataEdukasi[i].norec
                                $scope.item.reaksitiga = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED011") {
                                $scope.noRecmakanansatu = $scope.dataEdukasi[i].norec
                                $scope.item.makanansatu = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED012") {
                                $scope.noRecreaksiempat = $scope.dataEdukasi[i].norec
                                $scope.item.reaksiempat = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED013") {
                                $scope.noRecmakanandua = $scope.dataEdukasi[i].norec
                                $scope.item.makanandua = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED014") {
                                $scope.noRecreaksilima = $scope.dataEdukasi[i].norec
                                $scope.item.reaksilima = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED015") {
                                $scope.noRecmakanantiga = $scope.dataEdukasi[i].norec
                                $scope.item.makanantiga = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED016") {
                                $scope.noRecreaksienam = $scope.dataEdukasi[i].norec
                                $scope.item.reaksienam = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED017") {
                                $scope.noReclainlain = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED018") {
                                $scope.noRecreaksitujuh = $scope.dataEdukasi[i].norec
                                $scope.item.reaksitujuh = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED019") {
                                $scope.noRecPenyakitSatu = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED020") {
                                $scope.noRecPenyakitDua = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED021") {
                                $scope.noRecPenyakitTiga = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED022") {
                                $scope.noRecPenyakitEmpat = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED023") {
                                $scope.noRecPenyakitLima = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED024") {
                                $scope.noRecPenyakitEnam = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED025") {
                                $scope.noRecPenyakitTujuh = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED026") {
                                $scope.noRecPenyakitDelapan = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED027") {
                                $scope.noRecPenyakitSembilan = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED028") {
                                $scope.noRecPenyakitSepuluh = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED029") {
                                $scope.noRecPenyakitSebelas = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED030") {
                                $scope.noRecPenyakitDuabelas = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED031") {
                                $scope.noRecoperasi = $scope.dataEdukasi[i].norec
                                $scope.item.operasi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED032") {
                                $scope.noRecketOperasi = $scope.dataEdukasi[i].norec
                                $scope.item.ketOperasi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED033") {
                                $scope.noRectransfusi = $scope.dataEdukasi[i].norec
                                $scope.item.transfusi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED034") {
                                $scope.noRecreaksiTransfusi = $scope.dataEdukasi[i].norec
                                $scope.item.reaksiTransfusi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED035") {
                                $scope.noRecRiwayatPenyakitKeluarga = $scope.dataEdukasi[i].norec
                                $scope.item.RiwayatPenyakitKeluarga = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED036") {
                                $scope.noRecKeadaanSatu = $scope.dataEdukasi[i].norec
                                $scope.listKeadaan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentKeadaan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED037") {
                                $scope.noRecKeadaanDua = $scope.dataEdukasi[i].norec
                                $scope.listKeadaan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentKeadaan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED038") {
                                $scope.noRecKeadaanTiga = $scope.dataEdukasi[i].norec
                                $scope.listKeadaan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentKeadaan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED039") {
                                $scope.noRecKeadaanEmpat = $scope.dataEdukasi[i].norec
                                $scope.listKeadaan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentKeadaan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED040") {
                                $scope.noRecKeadaanLima = $scope.dataEdukasi[i].norec
                                $scope.listKeadaan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentKeadaan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED041") {
                                $scope.noRecKeadaanEnam = $scope.dataEdukasi[i].norec
                                $scope.listKeadaan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentKeadaan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED042") {
                                $scope.noRecKeadaanTujuh = $scope.dataEdukasi[i].norec
                                $scope.listKeadaan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentKeadaan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED043") {
                                $scope.noRecResusitasi = $scope.dataEdukasi[i].norec
                                $scope.item.resusitasi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED044") {
                                $scope.noRecoksigen = $scope.dataEdukasi[i].norec
                                $scope.item.oksigen = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED045") {
                                $scope.noRecMataSatu = $scope.dataEdukasi[i].norec
                                $scope.listMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED046") {
                                $scope.noRecMataDua = $scope.dataEdukasi[i].norec
                                $scope.listMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED047") {
                                $scope.noRecMataTiga = $scope.dataEdukasi[i].norec
                                $scope.listMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED048") {
                                $scope.noRecMataEmpat = $scope.dataEdukasi[i].norec
                                $scope.listMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED049") {
                                $scope.noRecMataLima = $scope.dataEdukasi[i].norec
                                $scope.listMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED050") {
                                $scope.noRecTHTSatu = $scope.dataEdukasi[i].norec
                                $scope.listTHT[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHT.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED051") {
                                $scope.noRecketTonsil = $scope.dataEdukasi[i].norec
                                $scope.item.ketTonsil = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED052") {
                                $scope.noRecTHTtSatu = $scope.dataEdukasi[i].norec
                                $scope.listTHTt[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHTt.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED053") {
                                $scope.noRecTHTttSatu = $scope.dataEdukasi[i].norec
                                $scope.listTHTtt[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHTtt.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED054") {
                                $scope.noRecketLidah = $scope.dataEdukasi[i].norec
                                $scope.item.ketLidah = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED055") {
                                $scope.noRecTHTtttSatu = $scope.dataEdukasi[i].norec
                                $scope.listTHTttt[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHTttt.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED056") {
                                $scope.noRecketBibir = $scope.dataEdukasi[i].norec
                                $scope.item.ketBibir = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED057") {
                                $scope.noRecLeherSatu = $scope.dataEdukasi[i].norec
                                $scope.listLeher[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeher.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED058") {
                                $scope.noRecLeherDua = $scope.dataEdukasi[i].norec
                                $scope.listLeher[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeher.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED059") {
                                $scope.noRecLeherTiga = $scope.dataEdukasi[i].norec
                                $scope.listLeher[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeher.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED060") {
                                $scope.noRecLeherEmpat = $scope.dataEdukasi[i].norec
                                $scope.listLeher[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeher.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED061") {
                                $scope.noRecCorSatu = $scope.dataEdukasi[i].norec
                                $scope.listCor[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCor.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED062") {
                                $scope.noRecCorDua = $scope.dataEdukasi[i].norec
                                $scope.listCor[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCor.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED063") {
                                $scope.noRecCorTiga = $scope.dataEdukasi[i].norec
                                $scope.listCor[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCor.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED064") {
                                $scope.noRecCorEmpat = $scope.dataEdukasi[i].norec
                                $scope.listCor[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCor.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED065") {
                                $scope.noRecOperasiSatu = $scope.dataEdukasi[i].norec
                                $scope.listOperasi[0].detail.forEach(function(e) {
                                    e.isChecked = false
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAlo.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED066") {
                                $scope.noRecOperasiDua = $scope.dataEdukasi[i].norec
                                $scope.listOperasi[0].detail.forEach(function(e) {
                                    debugger
                                    e.isChecked = false
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        debugger
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAlo.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED067") {
                                $scope.noRecsuara = $scope.dataEdukasi[i].norec
                                $scope.item.suara = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED068") {
                                $scope.noRecPulmooSatu = $scope.dataEdukasi[i].norec
                                $scope.listPulmoo[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPulmoo.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED069") {
                                $scope.noRecronci = $scope.dataEdukasi[i].norec
                                $scope.item.ronci = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED070") {
                                $scope.noRecPulmoooSatu = $scope.dataEdukasi[i].norec
                                $scope.listPulmooo[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPulmooo.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED071") {
                                $scope.noRecwheezing = $scope.dataEdukasi[i].norec
                                $scope.item.wheezing = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED072") {
                                $scope.noRecabdomen = $scope.dataEdukasi[i].norec
                                $scope.item.abdomen = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED073") {
                                $scope.noReclien = $scope.dataEdukasi[i].norec
                                $scope.item.lien = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED074") {
                                $scope.noReclainnya = $scope.dataEdukasi[i].norec
                                $scope.item.lainnya = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED075") {
                                $scope.noRecEkstreSatu = $scope.dataEdukasi[i].norec
                                $scope.listEkstre[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstre.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED076") {
                                $scope.noRecEkstreDua = $scope.dataEdukasi[i].norec
                                $scope.listEkstre[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstre.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED077") {
                                $scope.noRecEkstreTiga = $scope.dataEdukasi[i].norec
                                $scope.listEkstre[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstre.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED078") {
                                $scope.noRecEkstreEmpat = $scope.dataEdukasi[i].norec
                                $scope.listEkstre[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstre.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED079") {
                                $scope.noRecketEkstre = $scope.dataEdukasi[i].norec
                                $scope.item.ketEkstre = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED080") {
                                $scope.noRecTandaSatu = $scope.dataEdukasi[i].norec
                                $scope.listTanda[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTanda.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED081") {
                                $scope.noRecTandaDua = $scope.dataEdukasi[i].norec
                                $scope.listTanda[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTanda.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED082") {
                                $scope.noRecTandaTiga = $scope.dataEdukasi[i].norec
                                $scope.listTanda[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTanda.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED083") {
                                $scope.noRecTandaEmpat = $scope.dataEdukasi[i].norec
                                $scope.listTanda[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTanda.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED084") {
                                $scope.noRecketNeurologi = $scope.dataEdukasi[i].norec
                                $scope.item.ketNeurologi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED085") {
                                $scope.noRecE = $scope.dataEdukasi[i].norec
                                $scope.item.E = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED086") {
                                $scope.noRecM = $scope.dataEdukasi[i].norec
                                $scope.item.M = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED087") {
                                $scope.noRecV = $scope.dataEdukasi[i].norec
                                $scope.item.V = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED088") {
                                $scope.noRecdaunTelinga = $scope.dataEdukasi[i].norec
                                $scope.item.daunTelinga = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED089") {
                                $scope.noReckavum = $scope.dataEdukasi[i].norec
                                $scope.item.kavum = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED090") {
                                $scope.noRecorofaring = $scope.dataEdukasi[i].norec
                                $scope.item.orofaring = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED091") {
                                $scope.noRecliangTelinga = $scope.dataEdukasi[i].norec
                                $scope.item.liangTelinga = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED092") {
                                $scope.noRecinferior = $scope.dataEdukasi[i].norec
                                $scope.item.inferior = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED093") {
                                $scope.noRectonsil = $scope.dataEdukasi[i].norec
                                $scope.item.tonsil = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED094") {
                                $scope.noRecmembran = $scope.dataEdukasi[i].norec
                                $scope.item.membran = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED095") {
                                $scope.noRecmedis = $scope.dataEdukasi[i].norec
                                $scope.item.medis = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED096") {
                                $scope.noRecarkus = $scope.dataEdukasi[i].norec
                                $scope.item.arkus = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED097") {
                                $scope.noRecreflex = $scope.dataEdukasi[i].norec
                                $scope.item.reflex = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED098") {
                                $scope.noRecmedia = $scope.dataEdukasi[i].norec
                                $scope.item.media = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED099") {
                                $scope.noRecdinding = $scope.dataEdukasi[i].norec
                                $scope.item.dinding = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED100") {
                                $scope.noRecrinne = $scope.dataEdukasi[i].norec
                                $scope.item.rinne = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED101") {
                                $scope.noRecseptum = $scope.dataEdukasi[i].norec
                                $scope.item.septum = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED102") {
                                $scope.noRecweber = $scope.dataEdukasi[i].norec
                                $scope.item.weber = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED103") {
                                $scope.noRecscabach = $scope.dataEdukasi[i].norec
                                $scope.item.scabach = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED104") {
                                $scope.noRecnasofaring = $scope.dataEdukasi[i].norec
                                $scope.item.nasofaring = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED105") {
                                $scope.noRecaudimetri = $scope.dataEdukasi[i].norec
                                $scope.item.audimetri = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED106") {
                                $scope.noRechidungLainnya = $scope.dataEdukasi[i].norec
                                $scope.item.hidungLainnya = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED107") {
                                $scope.noRectimpanometri = $scope.dataEdukasi[i].norec
                                $scope.item.timpanometri = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED108") {
                                $scope.noRecfungsiTuba = $scope.dataEdukasi[i].norec
                                $scope.item.fungsiTuba = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED109") {
                                $scope.noRecstafedius = $scope.dataEdukasi[i].norec
                                $scope.item.stafedius = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED110") {
                                $scope.noReclaring = $scope.dataEdukasi[i].norec
                                $scope.item.laring = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED111") {
                                $scope.noRecidPegawai = $scope.dataEdukasi[i].norec
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED112") {
                                $scope.noRecPenyakitTigaBelas = $scope.dataEdukasi[i].norec
                                $scope.listPenyakit[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentRiwayatPenyakit.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED113") {
                                $scope.noRecEfforessensiSatu = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED114") {
                                $scope.noRecEfforessensiDua = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED115") {
                                $scope.noRecEfforessensiTiga = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED116") {
                                $scope.noRecEfforessensiEmpat = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED117") {
                                $scope.noRecEfforessensiLima = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED118") {
                                $scope.noRecEfforessensiEnam = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED119") {
                                $scope.noRecEfforessensiTujuh = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED120") {
                                $scope.noRecEfforessensiDelapan = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED121") {
                                $scope.noRecEfforessensiSembilan = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED122") {
                                $scope.noRecEfforessensiSepuluh = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED123") {
                                $scope.noRecEfforessensiSebelas = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED124") {
                                $scope.noRecEfforessensiDuabelas = $scope.dataEdukasi[i].norec
                                $scope.listEfforessensi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEfforessensi.push(dataid)
                                    }
                                })
                            }


                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED125") {
                                $scope.noRecLakiSatu = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED126") {
                                $scope.noRecLakiDua = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED127") {
                                $scope.noRecLakiTiga = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED128") {
                                $scope.noRecLakiEmpat = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED129") {
                                $scope.noRecLakiLima = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED130") {
                                $scope.noRecLakiEnam = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED131") {
                                $scope.noRecLakiTujuh = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED132") {
                                $scope.noRecLakiDelapan = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED133") {
                                $scope.noRecLakiSembilan = $scope.dataEdukasi[i].norec
                                $scope.listLaki[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLaki.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED134") {
                                $scope.noRecPerempuanSatu = $scope.dataEdukasi[i].norec
                                $scope.listPerempuan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerempuan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED135") {
                                $scope.noRecPerempuanDua = $scope.dataEdukasi[i].norec
                                $scope.listPerempuan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerempuan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED136") {
                                $scope.noRecPerempuanTiga = $scope.dataEdukasi[i].norec
                                $scope.listPerempuan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerempuan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED137") {
                                $scope.noRecPerempuanEmpat = $scope.dataEdukasi[i].norec
                                $scope.listPerempuan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerempuan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED138") {
                                $scope.noRecPerempuanLima = $scope.dataEdukasi[i].norec
                                $scope.listPerempuan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerempuan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED139") {
                                $scope.noRecPerempuanEnam = $scope.dataEdukasi[i].norec
                                $scope.listPerempuan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerempuan.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED140") {
                                $scope.noRecmukosa = $scope.dataEdukasi[i].norec
                                $scope.item.mukosa = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED141") {
                                $scope.noReclimfe = $scope.dataEdukasi[i].norec
                                $scope.item.limfe = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED142") {
                                $scope.noReckuku = $scope.dataEdukasi[i].norec
                                $scope.item.kuku = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED143") {
                                $scope.noRecrambut = $scope.dataEdukasi[i].norec
                                $scope.item.rambut = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED144") {
                                $scope.noRecsaraf = $scope.dataEdukasi[i].norec
                                $scope.item.saraf = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED145") {
                                $scope.noReclainlainKulit = $scope.dataEdukasi[i].norec
                                $scope.item.lainlainKulit = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED146") {
                                $scope.noRecRiwayatPribadi = $scope.dataEdukasi[i].norec
                                $scope.item.RiwayatPribadi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED147") {
                                $scope.noRecketPengobatanAnak = $scope.dataEdukasi[i].norec
                                $scope.item.ketPengobatanAnak = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED148") {
                                $scope.noRecImunisasiSatu = $scope.dataEdukasi[i].norec
                                $scope.listImunisasi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentImunisasi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED149") {
                                $scope.noRecImunisasiDua = $scope.dataEdukasi[i].norec
                                $scope.listImunisasii[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentImunisasii.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED150") {
                                $scope.noRecImunisasiTiga = $scope.dataEdukasi[i].norec
                                $scope.listImunisasiii[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentImunisasiii.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED151") {
                                $scope.noRecImunisasiEmpat = $scope.dataEdukasi[i].norec
                                $scope.listImunisasiiii[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentImunisasiiii.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED152") {
                                $scope.noRecImunisasiLima = $scope.dataEdukasi[i].norec
                                $scope.listImunisasiiiii[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentImunisasiiiii.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED153") {
                                $scope.noRecImunisasiEnam = $scope.dataEdukasi[i].norec
                                $scope.listImunisasiiiiii[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentImunisasiiiiii.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED154") {
                                $scope.noRecketPolio = $scope.dataEdukasi[i].norec
                                $scope.item.ketPolio = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED155") {
                                $scope.noRecketHepatitis = $scope.dataEdukasi[i].norec
                                $scope.item.ketHepatitis = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED156") {
                                $scope.noRecketDPT = $scope.dataEdukasi[i].norec
                                $scope.item.ketDPT = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED157") {
                                $scope.noRecketCampak = $scope.dataEdukasi[i].norec
                                $scope.item.ketCampak = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED158") {
                                $scope.noRecPersalinanSatu = $scope.dataEdukasi[i].norec
                                $scope.listPersalinan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPersalinan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED159") {
                                $scope.noRecPersalinanDua = $scope.dataEdukasi[i].norec
                                $scope.listPersalinan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPersalinan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED160") {
                                $scope.noRecPersalinanTiga = $scope.dataEdukasi[i].norec
                                $scope.listPersalinan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPersalinan.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED161") {
                                $scope.noRecPersalinanEmpat = $scope.dataEdukasi[i].norec
                                $scope.listPersalinan[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPersalinan.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED162") {
                                $scope.noRecDitolongSatu = $scope.dataEdukasi[i].norec
                                $scope.listDitolong[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentDitolong.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED163") {
                                $scope.noRecDitolongDua = $scope.dataEdukasi[i].norec
                                $scope.listDitolong[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentDitolong.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED164") {
                                $scope.noRecDitolongTiga = $scope.dataEdukasi[i].norec
                                $scope.listDitolong[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentDitolong.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED165") {
                                $scope.noRecketBB = $scope.dataEdukasi[i].norec
                                $scope.item.ketBB = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED166") {
                                $scope.noRecketPB = $scope.dataEdukasi[i].norec
                                $scope.item.ketPB = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED167") {
                                $scope.noRecketLK = $scope.dataEdukasi[i].norec
                                $scope.item.ketLK = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED168") {
                                $scope.noReclahir = $scope.dataEdukasi[i].norec
                                $scope.item.lahir = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED169") {
                                $scope.noRecNutrisiSatu = $scope.dataEdukasi[i].norec
                                $scope.listNutrisi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentNutrisi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED170") {
                                $scope.noRecNutrisiDua = $scope.dataEdukasi[i].norec
                                $scope.listNutrisi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentNutrisi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED171") {
                                $scope.noRecNutrisiTiga = $scope.dataEdukasi[i].norec
                                $scope.listNutrisi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentNutrisi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED172") {
                                $scope.noRecNutrisiEmpat = $scope.dataEdukasi[i].norec
                                $scope.listNutrisi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentNutrisi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED173") {
                                $scope.noRecNutrisiLima = $scope.dataEdukasi[i].norec
                                $scope.listNutrisi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentNutrisi.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED174") {
                                $scope.noRecketEksklusif = $scope.dataEdukasi[i].norec
                                $scope.item.ketEksklusif = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED175") {
                                $scope.noRecketEksklusif1 = $scope.dataEdukasi[i].norec
                                $scope.item.ketEksklusif1 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED176") {
                                $scope.noRecketSejak = $scope.dataEdukasi[i].norec
                                $scope.item.ketSejak = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED177") {
                                $scope.noRecketSejak2 = $scope.dataEdukasi[i].norec
                                $scope.item.ketSejak2 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED178") {
                                $scope.noRecketSejak3 = $scope.dataEdukasi[i].norec
                                $scope.item.ketSejak3 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED179") {
                                $scope.noRecketSejak4 = $scope.dataEdukasi[i].norec
                                $scope.item.ketSejak4 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED180") {
                                $scope.noRecketFrekuensi = $scope.dataEdukasi[i].norec
                                $scope.item.ketFrekuensi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED181") {
                                $scope.noRecketFrekuensi2 = $scope.dataEdukasi[i].norec
                                $scope.item.ketFrekuensi2 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED182") {
                                $scope.noRecketFrekuensi3 = $scope.dataEdukasi[i].norec
                                $scope.item.ketFrekuensi3 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED183") {
                                $scope.noRecketFrekuensi4 = $scope.dataEdukasi[i].norec
                                $scope.item.ketFrekuensi4 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED184") {
                                $scope.noRecketFrekuensi5 = $scope.dataEdukasi[i].norec
                                $scope.item.ketFrekuensi5 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED185") {
                                $scope.noRecketMenegakkan = $scope.dataEdukasi[i].norec
                                $scope.item.ketMenegakkan = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED186") {
                                $scope.noRecketMembalikan = $scope.dataEdukasi[i].norec
                                $scope.item.ketMembalikan = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED187") {
                                $scope.noRecketMerangkak = $scope.dataEdukasi[i].norec
                                $scope.item.ketMerangkak = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED188") {
                                $scope.noRecketBerdiri = $scope.dataEdukasi[i].norec
                                $scope.item.ketBerdiri = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED189") {
                                $scope.noRecketBerjalan = $scope.dataEdukasi[i].norec
                                $scope.item.ketBerjalan = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED190") {
                                $scope.noRecketBicara = $scope.dataEdukasi[i].norec
                                $scope.item.ketBicara = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED191") {
                                $scope.noRecketKulit = $scope.dataEdukasi[i].norec
                                $scope.item.ketKulit = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED192") {
                                $scope.noRecketGenitalia = $scope.dataEdukasi[i].norec
                                $scope.item.ketGenitalia = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED193") {
                                $scope.noRecketMensturasi = $scope.dataEdukasi[i].norec
                                $scope.item.ketMensturasi = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED194") {
                                $scope.noRecketPubis = $scope.dataEdukasi[i].norec
                                $scope.item.ketPubis = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED195") {
                                $scope.noRecketGlenpenis = $scope.dataEdukasi[i].norec
                                $scope.item.ketGlenpenis = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED196") {
                                $scope.noRecketPubis1 = $scope.dataEdukasi[i].norec
                                $scope.item.ketPubis1 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED197") {
                                $scope.noReckeadaanUmum = $scope.dataEdukasi[i].norec
                                $scope.item.keadaanUmum = $scope.dataEdukasi[i].nilai
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED198") {
                                $scope.noRecdataSoal1 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED199") {
                                $scope.noRecdataSoal2 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED200") {
                                $scope.noRecdataSoal3 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal3 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED201") {
                                $scope.noRecdataSoal4 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal4 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED202") {
                                $scope.noRecdataSoal5 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal5 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED203") {
                                $scope.noRecdataSoal6 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal6 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED204") {
                                $scope.noRecdataSoal7 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal7 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED205") {
                                $scope.noRecdataSoal8 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal8 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED206") {
                                $scope.noRecdataSoal9 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal9 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED207") {
                                $scope.noRecdataSoal10 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal10 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED208") {
                                $scope.noRecdataSoal11 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal11 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED209") {
                                $scope.noRecdataSoal12 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal12 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED210") {
                                $scope.noRecdataSoal13 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal13 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED211") {
                                $scope.noRecdataSoal14 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal14 = $scope.dataEdukasi[i].nilai;
                            }



                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED212") {
                                $scope.noRecketMasalahGenetika = $scope.dataEdukasi[i].norec;
                                $scope.item.ketMasalahGenetika = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED213") {
                                $scope.noRecdataSoal15 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal15 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED214") {
                                $scope.noRecdataSoal16 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal16 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED215") {
                                $scope.noRecdataSoal17 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal17 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED216") {
                                $scope.noRecdataSoal18 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal18 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED217") {
                                $scope.noRecdataSoal19 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal19 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED218") {
                                $scope.noRecdataSoal20 = $scope.dataEdukasi[i].norec;
                                $scope.item.dataSoal20 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED219") {
                                $scope.noRecketriwayatInfeksi1 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketriwayatInfeksi1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED220") {
                                $scope.noRecketriwayatInfeksi2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketriwayatInfeksi2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED221") {
                                $scope.noRecketriwayatInfeksi3 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketriwayatInfeksi3 = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED221") {
                                $scope.noRecketriwayatInfeksi3 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketriwayatInfeksi3 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED221") {
                                $scope.noRecketriwayatInfeksi3 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketriwayatInfeksi3 = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED222") {
                                $scope.noRecketSistemMotorik = $scope.dataEdukasi[i].norec;
                                $scope.item.ketSistemMotorik = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED223") {
                                $scope.noRecketKekuatan = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKekuatan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED224") {
                                $scope.noRecketFisiologis = $scope.dataEdukasi[i].norec;
                                $scope.item.ketFisiologis = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED225") {
                                $scope.noRecketPatalogis = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPatalogis = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED226") {
                                $scope.noRecketTonus = $scope.dataEdukasi[i].norec;
                                $scope.item.ketTonus = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED227") {
                                $scope.noRecketTrofix = $scope.dataEdukasi[i].norec;
                                $scope.item.ketTrofix = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED228") {
                                $scope.noRecketPrimitive = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPrimitive = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED229") {
                                $scope.noRecketDisorder = $scope.dataEdukasi[i].norec;
                                $scope.item.ketDisorder = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED230") {
                                $scope.noRecketSensorik = $scope.dataEdukasi[i].norec;
                                $scope.item.ketSensorik = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED231") {
                                $scope.noRecketLuhur = $scope.dataEdukasi[i].norec;
                                $scope.item.ketLuhur = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED232") {
                                $scope.noRecketSerebelum = $scope.dataEdukasi[i].norec;
                                $scope.item.ketSerebelum = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED233") {
                                $scope.noRecketOtonom = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOtonom = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED234") {
                                $scope.noRecketVerte = $scope.dataEdukasi[i].norec;
                                $scope.item.ketVerte = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED235") {
                                $scope.noRecketstatusNeurologi = $scope.dataEdukasi[i].norec;
                                $scope.item.ketstatusNeurologi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED236") {
                                $scope.noRecketCarnialis = $scope.dataEdukasi[i].norec;
                                $scope.item.ketCarnialis = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED237") {
                                $scope.noRecketKeadaan = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKeadaan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED238") {
                                $scope.noRecketKesadaran = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKesadaran = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED239") {
                                $scope.noRecsuhu = $scope.dataEdukasi[i].norec;
                                $scope.item.suhu = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED240") {
                                $scope.noRecnadi = $scope.dataEdukasi[i].norec;
                                $scope.item.nadi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED241") {
                                $scope.noRecsp02 = $scope.dataEdukasi[i].norec;
                                $scope.item.sp02 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED242") {
                                $scope.noRectekananDarah = $scope.dataEdukasi[i].norec;
                                $scope.item.tekananDarah = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED243") {
                                $scope.noRecmataKebidanan = $scope.dataEdukasi[i].norec;
                                $scope.item.mataKebidanan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED244") {
                                $scope.noRecleherKebidanan = $scope.dataEdukasi[i].norec;
                                $scope.item.leherKebidanan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED245") {
                                $scope.noRecdada = $scope.dataEdukasi[i].norec;
                                $scope.item.dada = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED246") {
                                $scope.noRecpulmoKebidanan = $scope.dataEdukasi[i].norec;
                                $scope.item.pulmoKebidanan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED247") {
                                $scope.noRecbentuk = $scope.dataEdukasi[i].norec;
                                $scope.item.bentuk = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED248") {
                                $scope.noRecputing = $scope.dataEdukasi[i].norec;
                                $scope.item.puting = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED249") {
                                $scope.noRecpengeluaran = $scope.dataEdukasi[i].norec;
                                $scope.item.pengeluaran = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED250") {
                                $scope.noReckebersihan = $scope.dataEdukasi[i].norec;
                                $scope.item.kebersihan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED251") {
                                $scope.noRecextremitas = $scope.dataEdukasi[i].norec;
                                $scope.item.extremitas = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED252") {
                                $scope.noRecluka = $scope.dataEdukasi[i].norec;
                                $scope.item.luka = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED253") {
                                $scope.noReckelainan = $scope.dataEdukasi[i].norec;
                                $scope.item.kelainan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED254") {
                                $scope.noRecfundus = $scope.dataEdukasi[i].norec;
                                $scope.item.fundus = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED255") {
                                $scope.noRecjanin = $scope.dataEdukasi[i].norec;
                                $scope.item.janin = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED256") {
                                $scope.noRecpanggul = $scope.dataEdukasi[i].norec;
                                $scope.item.panggul = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED257") {
                                $scope.noRecpunggung = $scope.dataEdukasi[i].norec;
                                $scope.item.punggung = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED258") {
                                $scope.noRecpresentasi = $scope.dataEdukasi[i].norec;
                                $scope.item.presentasi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED259") {
                                $scope.noRecterendah = $scope.dataEdukasi[i].norec;
                                $scope.item.terendah = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED260") {
                                $scope.noRecterendah2 = $scope.dataEdukasi[i].norec;
                                $scope.item.terendah2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED261") {
                                $scope.noRecterendah3 = $scope.dataEdukasi[i].norec;
                                $scope.item.terendah3 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED262") {
                                $scope.noReckontraksi = $scope.dataEdukasi[i].norec;
                                $scope.item.kontraksi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED263") {
                                $scope.noRecketHIS = $scope.dataEdukasi[i].norec;
                                $scope.item.ketHIS = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED264") {
                                $scope.noRecketLama = $scope.dataEdukasi[i].norec;
                                $scope.item.ketLama = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED265") {
                                $scope.noReckelainan2 = $scope.dataEdukasi[i].norec;
                                $scope.item.kelainan2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED266") {
                                $scope.noRectaraba = $scope.dataEdukasi[i].norec;
                                $scope.item.taraba = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED267") {
                                $scope.noRecketUk = $scope.dataEdukasi[i].norec;
                                $scope.item.ketUk = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED268") {
                                $scope.noRecketUk2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketUk2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED269") {
                                $scope.noRecauskultasi = $scope.dataEdukasi[i].norec;
                                $scope.item.auskultasi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED270") {
                                $scope.noRecpervaginam = $scope.dataEdukasi[i].norec;
                                $scope.item.pervaginam = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED271") {
                                $scope.noRecMataNewSatu = $scope.dataEdukasi[i].norec
                                $scope.listMataNew[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMataNew.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED272") {
                                $scope.noRecMataNewDua = $scope.dataEdukasi[i].norec
                                $scope.listMataNew[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMataNew.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED273") {
                                $scope.noRecMataNewTiga = $scope.dataEdukasi[i].norec
                                $scope.listMataNew[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMataNew.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED274") {
                                $scope.noRecMataNewEmpat = $scope.dataEdukasi[i].norec
                                $scope.listMataNew[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMataNew.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED275") {
                                $scope.noRecMataNewLima = $scope.dataEdukasi[i].norec
                                $scope.listMataNew[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMataNew.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED276") {
                                $scope.noRecketOd = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOd = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED277") {
                                $scope.noRecketOd2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOd2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED278") {
                                $scope.noRecketOs = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOs = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED279") {
                                $scope.noRecketOs2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOs2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED280") {
                                $scope.noRecketOd3 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOd3 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED281") {
                                $scope.noRecketOd4 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOd4 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED282") {
                                $scope.noRecketOs3 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOs3 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED283") {
                                $scope.noRecketOs4 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketOs4 = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED284") {
                                $scope.noRecketPalbera = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPalbera = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED285") {
                                $scope.noRecketPalbera2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPalbera2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED286") {
                                $scope.noRecketKonjungtiva = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKonjungtiva = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED287") {
                                $scope.noRecketKonjungtiva2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKonjungtiva2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED288") {
                                $scope.noRecketKornea = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKornea = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED289") {
                                $scope.noRecketKornea2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKornea2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED290") {
                                $scope.noRecketBilik = $scope.dataEdukasi[i].norec;
                                $scope.item.ketBilik = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED291") {
                                $scope.noRecketBilik2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketBilik2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED292") {
                                $scope.noRecketIris = $scope.dataEdukasi[i].norec;
                                $scope.item.ketIris = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED293") {
                                $scope.noRecketIris2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketIris2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED294") {
                                $scope.noRecketPupil = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPupil = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED295") {
                                $scope.noRecketPupil2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPupil2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED296") {
                                $scope.noRecketLensa = $scope.dataEdukasi[i].norec;
                                $scope.item.ketLensa = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED297") {
                                $scope.noRecketLensa2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketLensa2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED298") {
                                $scope.noRecketViterus = $scope.dataEdukasi[i].norec;
                                $scope.item.ketViterus = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED299") {
                                $scope.noRecketViterus2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketViterus2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED300") {
                                $scope.noRecketFunduskopi = $scope.dataEdukasi[i].norec;
                                $scope.item.ketFunduskopi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED301") {
                                $scope.noRecketFunduskopi2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketFunduskopi2 = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED302") {
                                $scope.noRecketHuman = $scope.dataEdukasi[i].norec;
                                $scope.item.ketHuman = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED303") {
                                $scope.noRecketAplanasi = $scope.dataEdukasi[i].norec;
                                $scope.item.ketAplanasi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED304") {
                                $scope.noRecketSchiotz = $scope.dataEdukasi[i].norec;
                                $scope.item.ketSchiotz = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED305") {
                                $scope.noRecketAnel = $scope.dataEdukasi[i].norec;
                                $scope.item.ketAnel = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED306") {
                                $scope.noRecTHTmataSatu = $scope.dataEdukasi[i].norec
                                $scope.listTHTmata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHTmata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED307") {
                                $scope.noRecTHTmataDua = $scope.dataEdukasi[i].norec
                                $scope.listTHTmata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHTmata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED308") {
                                $scope.noRecTHTmataTiga = $scope.dataEdukasi[i].norec
                                $scope.listTHTmata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHTmata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED309") {
                                $scope.noRecTHTmataEmpat = $scope.dataEdukasi[i].norec
                                $scope.listTHTmata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHTmata.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED310") {
                                $scope.noRecLeherMata1 = $scope.dataEdukasi[i].norec
                                $scope.listLeherMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeherMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED311") {
                                $scope.noRecLeherMata2 = $scope.dataEdukasi[i].norec
                                $scope.listLeherMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeherMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED312") {
                                $scope.noRecLeherMata3 = $scope.dataEdukasi[i].norec
                                $scope.listLeherMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeherMata.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED313") {
                                $scope.noRecthorax = $scope.dataEdukasi[i].norec;
                                $scope.item.thorax = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED314") {
                                $scope.noRecketThorax = $scope.dataEdukasi[i].norec;
                                $scope.item.ketThorax = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED315") {
                                $scope.noRecCorMata = $scope.dataEdukasi[i].norec
                                $scope.listCorMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCorMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED316") {
                                $scope.noRecCorMataa = $scope.dataEdukasi[i].norec
                                $scope.listCorMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCorMata.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED317") {
                                $scope.noRecCorMata1 = $scope.dataEdukasi[i].norec
                                $scope.listCorMata1[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCorMata1.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED318") {
                                $scope.noRecCorMata2 = $scope.dataEdukasi[i].norec
                                $scope.listCorMata2[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCorMata2.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED319") {
                                $scope.noRecCorMata3 = $scope.dataEdukasi[i].norec
                                $scope.listCorMata3[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentCorMata3.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED320") {
                                $scope.noRecketMurmur = $scope.dataEdukasi[i].norec;
                                $scope.item.ketMurmur = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED321") {
                                $scope.noRecketBising = $scope.dataEdukasi[i].norec;
                                $scope.item.ketBising = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED322") {
                                $scope.noRecPulmoMata1 = $scope.dataEdukasi[i].norec
                                $scope.listPulmoMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPulmoMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED323") {
                                $scope.noRecPulmoMata2 = $scope.dataEdukasi[i].norec
                                $scope.listPulmoMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPulmoMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED324") {
                                $scope.noRecPulmoMata3 = $scope.dataEdukasi[i].norec
                                $scope.listPulmoMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPulmoMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED325") {
                                $scope.noRecketPulmoMata = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPulmoMata = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED326") {
                                $scope.noRecEkstreMataSatu = $scope.dataEdukasi[i].norec
                                $scope.listEkstreMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED327") {
                                $scope.noRecEkstreMataDua = $scope.dataEdukasi[i].norec
                                $scope.listEkstreMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED328") {
                                $scope.noRecEkstreMataTiga = $scope.dataEdukasi[i].norec
                                $scope.listEkstreMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED329") {
                                $scope.noRecEkstreMataEmpat = $scope.dataEdukasi[i].norec
                                $scope.listEkstreMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreMata.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED330") {
                                $scope.noRecTandaMataSatu = $scope.dataEdukasi[i].norec
                                $scope.listTandaMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTandaMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED331") {
                                $scope.noRecTandaMataDua = $scope.dataEdukasi[i].norec
                                $scope.listTandaMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTandaMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED332") {
                                $scope.noRecTandaMataTiga = $scope.dataEdukasi[i].norec
                                $scope.listTandaMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTandaMata.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED333") {
                                $scope.noRecTandaMataEmpat = $scope.dataEdukasi[i].norec
                                $scope.listTandaMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTandaMata.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED334") {
                                $scope.noReckesadaranTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.kesadaranTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED335") {
                                $scope.noRectekananTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.tekananTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED336") {
                                $scope.noReccengeng = $scope.dataEdukasi[i].norec;
                                $scope.item.cengeng = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED337") {
                                $scope.noRecnadiTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.nadiTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED338") {
                                $scope.noRecemosi = $scope.dataEdukasi[i].norec;
                                $scope.item.emosi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED339") {
                                $scope.noRecpernafasan = $scope.dataEdukasi[i].norec;
                                $scope.item.pernafasan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED340") {
                                $scope.noRecintelektual = $scope.dataEdukasi[i].norec;
                                $scope.item.intelektual = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED341") {
                                $scope.noReclainTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.lainTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED342") {
                                $scope.noRecbentukTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.bentukTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED343") {
                                $scope.noRecrambutTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.rambutTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED344") {
                                $scope.noRectelingaTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.telingaTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED345") {
                                $scope.noRecbentukTumbuh2 = $scope.dataEdukasi[i].norec;
                                $scope.item.bentukTumbuh2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED346") {
                                $scope.noRecmembranTumbuh = $scope.dataEdukasi[i].norec;
                                $scope.item.membranTumbuh = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED347") {
                                $scope.noReckelainanLain = $scope.dataEdukasi[i].norec;
                                $scope.item.kelainanLain = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED348") {
                                $scope.noRecbentukMata = $scope.dataEdukasi[i].norec;
                                $scope.item.bentukMata = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED349") {
                                $scope.noReckatarak = $scope.dataEdukasi[i].norec;
                                $scope.item.katarak = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED350") {
                                $scope.noRecvisus = $scope.dataEdukasi[i].norec;
                                $scope.item.visus = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED351") {
                                $scope.noReckelainanMata = $scope.dataEdukasi[i].norec;
                                $scope.item.kelainanMata = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED352") {
                                $scope.noReckelainanHidung = $scope.dataEdukasi[i].norec;
                                $scope.item.kelainanHidung = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED353") {
                                $scope.noRecpharing = $scope.dataEdukasi[i].norec;
                                $scope.item.pharing = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED354") {
                                $scope.noReclidah = $scope.dataEdukasi[i].norec;
                                $scope.item.lidah = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED355") {
                                $scope.noRecgigi = $scope.dataEdukasi[i].norec;
                                $scope.item.gigi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED356") {
                                $scope.noReckelenjar = $scope.dataEdukasi[i].norec;
                                $scope.item.kelenjar = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED357") {
                                $scope.noRectiroid = $scope.dataEdukasi[i].norec;
                                $scope.item.tiroid = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED358") {
                                $scope.noRecbentukThorax = $scope.dataEdukasi[i].norec;
                                $scope.item.bentukThorax = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED359") {
                                $scope.noRecsimetris = $scope.dataEdukasi[i].norec;
                                $scope.item.simetris = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED360") {
                                $scope.noRecgerakan = $scope.dataEdukasi[i].norec;
                                $scope.item.gerakan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED361") {
                                $scope.noRecpembesaran = $scope.dataEdukasi[i].norec;
                                $scope.item.pembesaran = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED362") {
                                $scope.noRecirama = $scope.dataEdukasi[i].norec;
                                $scope.item.irama = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED363") {
                                $scope.noRecdj = $scope.dataEdukasi[i].norec;
                                $scope.item.dj = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED364") {
                                $scope.noRecsuaraJantung = $scope.dataEdukasi[i].norec;
                                $scope.item.suaraJantung = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED365") {
                                $scope.noRecbising = $scope.dataEdukasi[i].norec;
                                $scope.item.bising = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED366") {
                                $scope.noRecthrill = $scope.dataEdukasi[i].norec;
                                $scope.item.thrill = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED367") {
                                $scope.noRecsuaraNafas = $scope.dataEdukasi[i].norec;
                                $scope.item.suaraNafas = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED368") {
                                $scope.noRecronchi = $scope.dataEdukasi[i].norec;
                                $scope.item.ronchi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED369") {
                                $scope.noRecwheezingParu = $scope.dataEdukasi[i].norec;
                                $scope.item.wheezingParu = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED370") {
                                $scope.noRechati = $scope.dataEdukasi[i].norec;
                                $scope.item.hati = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED371") {
                                $scope.noReclimpa = $scope.dataEdukasi[i].norec;
                                $scope.item.limpa = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED372") {
                                $scope.noRecginjal = $scope.dataEdukasi[i].norec;
                                $scope.item.ginjal = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED373") {
                                $scope.noRectumor = $scope.dataEdukasi[i].norec;
                                $scope.item.tumor = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED374") {
                                $scope.noRecasites = $scope.dataEdukasi[i].norec;
                                $scope.item.asites = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED375") {
                                $scope.noRecbentukEkstremitas = $scope.dataEdukasi[i].norec;
                                $scope.item.bentukEkstremitas = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED376") {
                                $scope.noRecekstremitas = $scope.dataEdukasi[i].norec;
                                $scope.item.ekstremitas = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED377") {
                                $scope.noRecudema = $scope.dataEdukasi[i].norec;
                                $scope.item.udema = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED378") {
                                $scope.noReckanan = $scope.dataEdukasi[i].norec;
                                $scope.item.kanan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED379") {
                                $scope.noReckiri = $scope.dataEdukasi[i].norec;
                                $scope.item.kiri = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED380") {
                                $scope.noRecpenis = $scope.dataEdukasi[i].norec;
                                $scope.item.penis = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED381") {
                                $scope.noRecukuran = $scope.dataEdukasi[i].norec;
                                $scope.item.ukuran = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED382") {
                                $scope.noRectulang = $scope.dataEdukasi[i].norec;
                                $scope.item.tulang = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED383") {
                                $scope.noRecudem = $scope.dataEdukasi[i].norec;
                                $scope.item.udem = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED384") {
                                $scope.noRecpigmentasi = $scope.dataEdukasi[i].norec;
                                $scope.item.pigmentasi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED385") {
                                $scope.noReckelainanKulit = $scope.dataEdukasi[i].norec;
                                $scope.item.kelainanKulit = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED386") {
                                $scope.noReckelainanKulitlain = $scope.dataEdukasi[i].norec;
                                $scope.item.kelainanKulitlain = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED387") {
                                $scope.noRecpayudara = $scope.dataEdukasi[i].norec;
                                $scope.item.payudara = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED388") {
                                $scope.noRectestis = $scope.dataEdukasi[i].norec;
                                $scope.item.testis = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED389") {
                                $scope.noRecrambutPubis = $scope.dataEdukasi[i].norec;
                                $scope.item.rambutPubis = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED390") {
                                $scope.noRecrambutKetiak = $scope.dataEdukasi[i].norec;
                                $scope.item.rambutKetiak = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED391") {
                                $scope.noRectandaPubertas = $scope.dataEdukasi[i].norec;
                                $scope.item.tandaPubertas = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED392") {
                                $scope.noRecalergi = $scope.dataEdukasi[i].norec;
                                $scope.item.alergi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED393") {
                                $scope.noRecketAlergi = $scope.dataEdukasi[i].norec;
                                $scope.item.ketAlergi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED394") {
                                $scope.noRecD = $scope.dataEdukasi[i].norec;
                                $scope.item.D = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED395") {
                                $scope.noRecM = $scope.dataEdukasi[i].norec;
                                $scope.item.M = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED396") {
                                $scope.noRecF = $scope.dataEdukasi[i].norec;
                                $scope.item.F = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED397") {
                                $scope.noRecDMF = $scope.dataEdukasi[i].norec;
                                $scope.item.DMF = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED398") {
                                $scope.noRecd = $scope.dataEdukasi[i].norec;
                                $scope.item.d = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED399") {
                                $scope.noRece = $scope.dataEdukasi[i].norec;
                                $scope.item.e = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED400") {
                                $scope.noRecf = $scope.dataEdukasi[i].norec;
                                $scope.item.f = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED401") {
                                $scope.noRecdef = $scope.dataEdukasi[i].norec;
                                $scope.item.def = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED402") {
                                $scope.noRecPTI = $scope.dataEdukasi[i].norec;
                                $scope.item.PTI = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED403") {
                                $scope.noRecRTI = $scope.dataEdukasi[i].norec;
                                $scope.item.RTI = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED404") {
                                $scope.noRecdeskripsileher = $scope.dataEdukasi[i].norec;
                                $scope.item.deskripsileher = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED405") {
                                $scope.noRecobatempat = $scope.dataEdukasi[i].norec;
                                $scope.item.obatempat = $scope.dataEdukasi[i].nilai;
                                $scope.tambah3();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED406") {
                                $scope.noRecobatlima = $scope.dataEdukasi[i].norec;
                                $scope.item.obatlima = $scope.dataEdukasi[i].nilai;
                                $scope.tambah4();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED407") {
                                $scope.noRecobatenam = $scope.dataEdukasi[i].norec;
                                $scope.item.obatenam = $scope.dataEdukasi[i].nilai;
                                $scope.tambah5();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED408") {
                                $scope.noRecobattujuh = $scope.dataEdukasi[i].norec;
                                $scope.item.obattujuh = $scope.dataEdukasi[i].nilai;
                                $scope.tambah6();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED409") {
                                $scope.noRecobatdelapan = $scope.dataEdukasi[i].norec;
                                $scope.item.obatdelapan = $scope.dataEdukasi[i].nilai;
                                $scope.tambah7();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED410") {
                                $scope.noRecobatsembilan = $scope.dataEdukasi[i].norec;
                                $scope.item.obatsembilan = $scope.dataEdukasi[i].nilai;
                                $scope.tambah8();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED411") {
                                $scope.noRecobatsepuluh = $scope.dataEdukasi[i].norec;
                                $scope.item.obatsepuluh = $scope.dataEdukasi[i].nilai;
                                $scope.tambah9();
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED412") {
                                $scope.noRecreaksiempat1 = $scope.dataEdukasi[i].norec;
                                $scope.item.reaksiempat1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED413") {
                                $scope.noRecreaksilima1 = $scope.dataEdukasi[i].norec;
                                $scope.item.reaksilima1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED414") {
                                $scope.noRecreaksienam1 = $scope.dataEdukasi[i].norec;
                                $scope.item.reaksienam1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED415") {
                                $scope.noRecreaksitujuh1 = $scope.dataEdukasi[i].norec;
                                $scope.item.reaksitujuh1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED416") {
                                $scope.norecreaksidelapan1 = $scope.dataEdukasi[i].norec;
                                $scope.item.reaksidelapan1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED417") {
                                $scope.noRecreaksisembilan1 = $scope.dataEdukasi[i].norec;
                                $scope.item.reaksisembilan1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED418") {
                                $scope.noRecreaksisepuluh1 = $scope.dataEdukasi[i].norec;
                                $scope.item.reaksisepuluh1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED419") {
                                $scope.noRecdeskripsimata = $scope.dataEdukasi[i].norec;
                                $scope.item.deskripsimata = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED420") {
                                $scope.noRecdeskripsitht = $scope.dataEdukasi[i].norec;
                                $scope.item.deskripsitht = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED421") {
                                $scope.noRectulangBelakang = $scope.dataEdukasi[i].norec;
                                $scope.item.tulangBelakang = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED422") {
                                $scope.noRectulangDada = $scope.dataEdukasi[i].norec;
                                $scope.item.tulangDada = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED423") {
                                $scope.noRecjenisPernapasan = $scope.dataEdukasi[i].norec;
                                $scope.item.jenisPernapasan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED424") {
                                $scope.noRecketPalpasi = $scope.dataEdukasi[i].norec;
                                $scope.item.ketPalpasi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED425") {
                                $scope.listPerkusi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerkusi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED426") {
                                $scope.listPerkusi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerkusi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED427") {
                                $scope.listPerkusi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerkusi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED428") {
                                $scope.listPerkusi[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentPerkusi.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED429") {
                                $scope.listAuskultasiGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAuskultasi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED430") {
                                $scope.listAuskultasiGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAuskultasi.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED431") {
                                $scope.listAuskultasiGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAuskultasi.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED432") {
                                $scope.listEkstreGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreGeriatri.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED433") {
                                $scope.listEkstreGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreGeriatri.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED434") {
                                $scope.listEkstreGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreGeriatri.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED435") {
                                $scope.listEkstreGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreGeriatri.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED436") {
                                $scope.listEkstreGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreGeriatri.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED437") {
                                $scope.listEkstreGeriatri[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentEkstreGeriatri.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED438") {
                                $scope.listUterus[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentUterus.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED439") {
                                $scope.listUterus[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentUterus.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED440") {
                                $scope.listUterus[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentUterus.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED441") {
                                $scope.listUterus[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentUterus.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED442") {
                                $scope.noRecketUterus = $scope.dataEdukasi[i].norec;
                                $scope.item.ketUterus = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED443") {
                                $scope.noRecketUterus2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketUterus2 = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED444") {
                                $scope.listAnogenital[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAnogenital.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED445") {
                                $scope.listAnogenital[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAnogenital.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED446") {
                                $scope.listAnogenital[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAnogenital.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED447") {
                                $scope.listAnogenital[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAnogenital.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED448") {
                                $scope.listAnogenital[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentAnogenital.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED449") {
                                $scope.noRecketHisberg = $scope.dataEdukasi[i].norec;
                                $scope.item.ketHisberg = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED450") {
                                $scope.noRecketHisberg2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketHisberg2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED451") {
                                $scope.noRecketVisus = $scope.dataEdukasi[i].norec;
                                $scope.item.ketVisus = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED452") {
                                $scope.noRecketVisus2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketVisus2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED453") {
                                $scope.noRecketKacamata = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKacamata = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED454") {
                                $scope.noRecketKacamata2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketKacamata2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED455") {
                                $scope.noRecketTio = $scope.dataEdukasi[i].norec;
                                $scope.item.ketTio = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED456") {
                                $scope.noRecketTio2 = $scope.dataEdukasi[i].norec;
                                $scope.item.ketTio2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED457") {
                                $scope.noRecketTandaMata = $scope.dataEdukasi[i].norec;
                                $scope.item.ketTandaMata = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED461") {
                                $scope.noRectglpengkajian = $scope.dataEdukasi[i].norec;
                                $scope.item.tglpengkajian = moment($scope.dataEdukasi[i].nilai).format('YYYY-MM-DD HH:MM')
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED458") {
                                $scope.noRecMataLima = $scope.dataEdukasi[i].norec
                                $scope.listMata[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentMata.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED459") {
                                $scope.listTHT[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentTHT.push(dataid)
                                    }
                                })
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED460") {
                                $scope.listLeher[0].detail.forEach(function(e) {
                                    if (e.id == $scope.dataEdukasi[i].nilai) {
                                        e.isChecked = true
                                        var dataid = {
                                            "id": e.id,
                                            "nama": e.nama
                                        }
                                        $scope.currentLeher.push(dataid)
                                    }
                                })
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED700") {
                                $scope.isKasJelas = true;
                                $scope.noRecketRiwayatPenyakit = $scope.dataEdukasi[i].norec
                                $scope.item.ketRiwayatPenyakit = $scope.dataEdukasi[i].nilai
                            }


                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED462") {
                                $scope.item.obj[119] = true;
                                // $scope.item.tglpengkajian = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED463") {
                                $scope.noRectglpengkajian = $scope.dataEdukasi[i].norec;
                                $scope.item.tglpengkajian = moment($scope.dataEdukasi[i].nilai).format('YYYY-MM-DD HH:MM')
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED464") {
                                $scope.noRectglpengkajian = $scope.dataEdukasi[i].norec;
                                $scope.item.tglpengkajian = moment($scope.dataEdukasi[i].nilai).format('YYYY-MM-DD HH:MM')
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED465") {
                                $scope.noRectglpengkajian = $scope.dataEdukasi[i].norec;
                                $scope.item.tglpengkajian = moment($scope.dataEdukasi[i].nilai).format('YYYY-MM-DD HH:MM')
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED466") {
                                $scope.noRectglpengkajian = $scope.dataEdukasi[i].norec;
                                $scope.item.tglpengkajian = moment($scope.dataEdukasi[i].nilai).format('YYYY-MM-DD HH:MM')
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED467") {
                                $scope.noRectglpengkajian = $scope.dataEdukasi[i].norec;
                                $scope.item.tglpengkajian = moment($scope.dataEdukasi[i].nilai).format('YYYY-MM-DD HH:MM')
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED468") {
                                $scope.noReckeadaanumum = $scope.dataEdukasi[i].norec;
                                $scope.item.keadaanumum = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED469") {
                                $scope.noRectekananDarah = $scope.dataEdukasi[i].norec;
                                $scope.item.tekananDarah = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED470") {
                                $scope.noRecsuhu = $scope.dataEdukasi[i].norec;
                                $scope.item.suhu = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED471") {
                                $scope.noReckesadaran = $scope.dataEdukasi[i].norec;
                                $scope.item.kesadaran = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED472") {
                                $scope.noRecnadi = $scope.dataEdukasi[i].norec;
                                $scope.item.nadi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED473") {
                                $scope.noRecpernapasan = $scope.dataEdukasi[i].norec;
                                $scope.item.pernapasan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED474") {
                                $scope.noRecnormal1 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED475") {
                                $scope.noRecnormal2 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED476") {
                                $scope.noRecnormal3 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal3 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED477") {
                                $scope.noRecnormal4 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal4 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED478") {
                                $scope.noRecnormal5 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal5 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED479") {
                                $scope.noRecnormal6 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal6 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED480") {
                                $scope.noRecnormal7 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal7 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED481") {
                                $scope.noRecnormal8 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal8 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED482") {
                                $scope.noRecnormal9 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal9 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED483") {
                                $scope.noRecnormal10 = $scope.dataEdukasi[i].norec;
                                $scope.item.normal10 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED484") {
                                $scope.noRecpernapasan = $scope.dataEdukasi[i].norec;
                                $scope.item.pernapasan = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED485") {
                                $scope.noRectidaknormal1 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal1 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED486") {
                                $scope.noRectidaknormal2 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED487") {
                                $scope.noRectidaknormal3 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal3 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED488") {
                                $scope.noRectidaknormal4 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal4 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED489") {
                                $scope.noRectidaknormal5 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal5 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED490") {
                                $scope.noRectidaknormal6 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal6 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED491") {
                                $scope.noRectidaknormal7 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal7 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED492") {
                                $scope.noRectidaknormal8 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal8 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED493") {
                                $scope.noRectidaknormal9 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal9 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED494") {
                                $scope.noRectidaknormal10 = $scope.dataEdukasi[i].norec;
                                $scope.item.tidaknormal10 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED495") {
                                $scope.noRecinspeksi = $scope.dataEdukasi[i].norec;
                                $scope.item.inspeksi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED496") {
                                $scope.noRecPalpasi = $scope.dataEdukasi[i].norec;
                                $scope.item.Palpasi = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED497") {
                                $scope.noRecsensory = $scope.dataEdukasi[i].norec;
                                $scope.item.sensory = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED498") {
                                $scope.rom = $scope.dataEdukasi[i].norec;
                                $scope.item.rom = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED499") {
                                $scope.noRecdiagnostik = $scope.dataEdukasi[i].norec;
                                //   $scope.listDiagnosa =  
                                 $scope.listDiagnosa = [{ id: parseFloat($scope.dataEdukasi[i].nilai), diagnosa: $scope.dataEdukasi[i].satuan }];             
                                // $scope.item.diagnostik =$scope.dataEdukasi[i].satuan;
                                $scope.item.diagnostik = { id: parseFloat($scope.dataEdukasi[i].nilai), diagnosa: $scope.dataEdukasi[i].satuan };
                                panggildiagnosa();

                                $scope.item.listDiagnostik = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED500") {
                                $scope.noRecpemeriksaanpenunjang = $scope.dataEdukasi[i].norec;
                                $scope.item.pemeriksaanpenunjang = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED501") {
                                $scope.noRectatalaksana = $scope.dataEdukasi[i].norec;
                                $scope.item.tatalaksana = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED502") {
                                $scope.noRecrencana = $scope.dataEdukasi[i].norec;
                                $scope.item.rencana = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED503") {
                                $scope.noRectglselesai = $scope.dataEdukasi[i].norec;
                                $scope.item.tglselesai = moment($scope.dataEdukasi[i].nilai).format('YYYY-MM-DD');
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED504") {
                                $scope.noRecdokterpenanggungjawab = $scope.dataEdukasi[i].norec;
                                $scope.item.dokterpenanggungjawab = { id: parseFloat($scope.dataEdukasi[i].nilai), namalengkap: $scope.dataEdukasi[i].satuan }
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED505") {
                                $scope.noRecpoto = $scope.dataEdukasi[i].norec;
                                $scope.user.poto = $scope.dataEdukasi[i].nilai;
                                $scope.item.orto  = "background-image:url("+ $scope.user.poto +"); height: 180px; width: 220px";
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED506") {
                                $scope.noRecpoto2 = $scope.dataEdukasi[i].norec;
                                $scope.user.poto2 = $scope.dataEdukasi[i].nilai;
                                $scope.item.uro  = "background-image:url("+ $scope.user.poto2 +"); height: 240px; width: 410px";
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED507") {
                                $scope.noRecketerangan = $scope.dataEdukasi[i].norec;
                                $scope.item.keteranganpemeriksaan = $scope.dataEdukasi[i].nilai;
                            }

                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED508") {
                                $scope.noRecpoto3 = $scope.dataEdukasi[i].norec;
                                $scope.user.poto3 = $scope.dataEdukasi[i].nilai;
                                $scope.item.jantung  = "background-image:url("+ $scope.user.poto3 +"); height: 180px; width: 220px";
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED509") {
                                $scope.noRecketeranganjantung = $scope.dataEdukasi[i].norec;
                                $scope.item.keteranganjantung = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED510") {
                                $scope.noRecpoto4 = $scope.dataEdukasi[i].norec;
                                $scope.user.poto4 = $scope.dataEdukasi[i].nilai;
                                $scope.item.anak  = "background-image:url("+ $scope.user.poto4 +"); height: 180px; width: 220px";
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED511") {
                                $scope.noRecdiagnostik2 = $scope.dataEdukasi[i].norec;
                                $scope.item.diagnostik2 = { id: parseFloat($scope.dataEdukasi[i].nilai), diagnosa: $scope.dataEdukasi[i].satuan }

                                $scope.item.listDiagnostik2 = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED512") {
                                $scope.noRecpemeriksaanjantung = $scope.dataEdukasi[i].norec;
                                $scope.item.pemeriksaanjantung = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED513") {
                                $scope.noRecekg = $scope.dataEdukasi[i].norec;
                                $scope.item.ekg = $scope.dataEdukasi[i].nilai;
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED514") {
                                $scope.noRecpoto5 = $scope.dataEdukasi[i].norec;
                                $scope.user.poto5 = $scope.dataEdukasi[i].nilai;                                
                                $scope.item.dalam  = "background-image:url("+ $scope.user.poto5 +"); height: 180px; width: 440px";
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED515") {
                                $scope.noReclainlain1 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain1 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED516") {
                                $scope.noReclainlain2 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain2 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED517") {
                                $scope.noRecketKeluhan1 = $scope.dataEdukasi[i].norec
                                $scope.item.ketKeluhan1 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-ME518") {
                                $scope.noRecketKeluhan2 = $scope.dataEdukasi[i].norec
                                $scope.item.ketKeluhan2 = $scope.dataEdukasi[i].nilai
                            }
                            
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED519") {
                                $scope.noRecpoto6 = $scope.dataEdukasi[i].norec;
                                $scope.user.poto6 = $scope.dataEdukasi[i].nilai;                                
                                $scope.item.saraf  = "background-image:url("+ $scope.user.poto6 +"); height: 180px; width: 220px";
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED520") {
                                $scope.noReclainlain3 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain3 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED521") {
                                $scope.noReclainlain4 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain4 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED522") {
                                $scope.noReclainlain5 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain5 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED523") {
                                $scope.noReclainlain6 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain6 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED524") {
                                $scope.noReclainlain7 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain7 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED525") {
                                $scope.noReclainlain8 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain8 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED526") {
                                $scope.noReclainlain9 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain9 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED527") {
                                $scope.noReclainlain10 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain10 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED528") {
                                $scope.noReclainlain11 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain11 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED529") {
                                $scope.noReclainlain12 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain12 = $scope.dataEdukasi[i].nilai
                            }
                            if ($scope.dataEdukasi[i].objectfk == "PKN-MED530") {
                                $scope.noReclainlain13 = $scope.dataEdukasi[i].norec
                                $scope.item.lainlain13 = $scope.dataEdukasi[i].nilai
                            }
                        }
                    }
                })
                //  pengkajianperawat();
            }








            $scope.batalFRD = function() {
                ClearDataFRD();
                $scope.popUpFRD.close();
            }



            $scope.createNewAnti = function() {
                $scope.item.norecAnti = "";
                $scope.item.no = undefined;
                $scope.popUpAntibiotika.center().open();
                var actions = $scope.popUpAntibiotika.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpAntibiotika.setOptions({ actions: actions });
            }


            function EditAnti(e) {

                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                $scope.item.norecAnti = dataItem.norec;
                $scope.item.no = dataItem.no;
                $scope.ItemAnti.TindakanAntibiotik = { id: dataItem.idantibiotika, namaproduk: dataItem.antibiotika };
                $scope.ItemAnti.Dosis = dataItem.dosis;
                $scope.ItemAnti.tanggalMulaiAnti = moment(dataItem.tglmulai).format('YYYY-MM-DD');
                $scope.ItemAnti.tanggalAkhiraAnti = moment(dataItem.tglakhir).format('YYYY-MM-DD');
                $scope.ItemAnti.Pemberian = dataItem.metodepemberian;
                if (dataItem.idsah == 1) {
                    $scope.ItemAnti.SahAnti = true;
                } else {
                    $scope.ItemAnti.SahAnti = false;
                }
                if (dataItem.idbatal == 1) {
                    $scope.ItemAnti.BatalAnti = true
                } else {
                    $scope.ItemAnti.BatalAnti = false
                }
                $scope.status = dataItem.status
                $scope.popUpAntibiotika.center().open();
            }

            function HapusAnti(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataAntiBio.length - 1; i >= 0; i--) {
                    if (dataAntiBio[i].no == dataItem.no) {
                        dataAntiBio.splice(i, 1);
                    }
                }
                grid.removeRow(row);
            }


            function ClearDataAnti() {
                $scope.ItemAnti = {};
            };

            $scope.batalAnti = function() {
                ClearDataAnti();
                $scope.popUpAntibiotika.close();
            }

            $scope.createNewSurveilans = function() {
                ClearAll();
                $scope.myVar = 2
                var noemr2 = '-'
                var arrStr = {
                    0: noemr2
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }

            $scope.formatJam242 = {
                value: "00-00-0000 00:00", //set default value
                // format: "dd-MM-yyyy HH:mm", //set date format
                // timeFormat: "HH:mm",        //set drop down time format to 24 hours
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

            function hapusData(e) {}

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


            $scope.Lihat = function() {

                if ($state.params.noRec == undefined) {
                    window.messageContainer.error("Pilih Pasien Dahulu!");
                    return;
                }

            }



            $scope.Simpan = function(index) {

                if ($state.params.noRec == undefined) {
                    window.messageContainer.error("Pilih Pasien Dahulu!");
                    return;
                }
                var tempData = [];
                 var arrobj = Object.keys($scope.item.obj)
      
                ;
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    ;
                    var urutan = arrobj[i]
                    var object = "PKN-MED000"+urutan    
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPengkajiannn,
                        objectfk: object,
                        nilai:  $scope.item.obj[parseInt(arrobj[i])],
                        satuan: "-",
                        jenisobject: "checkbox"
                    }
                    tempData.push(tmpDataEdukasi);                   
                }
                if ($scope.item.ketKeluhan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKeluhan,
                        objectfk: "PKN-MED001",
                        nilai: $scope.item.ketKeluhan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPenyakit != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPenyakit,
                        objectfk: "PKN-MED002",
                        nilai: $scope.item.ketPenyakit,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPengobatan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPengobatan,
                        objectfk: "PKN-MED003",
                        nilai: $scope.item.ketPengobatan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.keluhan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckeluhan,
                        objectfk: "PKN-MED004",
                        nilai: $scope.item.keluhan.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatsatu != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatsatu,
                        objectfk: "PKN-MED005",
                        nilai: $scope.item.obatsatu,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksisatu != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksisatu,
                        objectfk: "PKN-MED006",
                        nilai: $scope.item.reaksisatu,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatdua != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatdua,
                        objectfk: "PKN-MED007",
                        nilai: $scope.item.obatdua,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksidua != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksidua,
                        objectfk: "PKN-MED008",
                        nilai: $scope.item.reaksidua,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obattiga != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobattiga,
                        objectfk: "PKN-MED009",
                        nilai: $scope.item.obattiga,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksitiga != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksitiga,
                        objectfk: "PKN-MED010",
                        nilai: $scope.item.reaksitiga,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.makanansatu != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmakanansatu,
                        objectfk: "PKN-MED011",
                        nilai: $scope.item.makanansatu,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksiempat != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksiempat,
                        objectfk: "PKN-MED012",
                        nilai: $scope.item.reaksiempat,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.makanandua != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmakanandua,
                        objectfk: "PKN-MED013",
                        nilai: $scope.item.makanandua,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksilima != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksilima,
                        objectfk: "PKN-MED014",
                        nilai: $scope.item.reaksilima,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.makanantiga != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmakanantiga,
                        objectfk: "PKN-MED015",
                        nilai: $scope.item.makanantiga,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksienam != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksienam,
                        objectfk: "PKN-MED016",
                        nilai: $scope.item.reaksienam,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lainlain != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain,
                        objectfk: "PKN-MED017",
                        nilai: $scope.item.lainlain,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksitujuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksitujuh,
                        objectfk: "PKN-MED018",
                        nilai: $scope.item.reaksitujuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentRiwayatPenyakit.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED019",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED020",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED021",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED022",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED023",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 6) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED024",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 7) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED025",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 8) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED026",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 9) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED027",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 10) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED028",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 11) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED029",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 12) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED030",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 13) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED112",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                if ($scope.item.operasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecoperasi,
                        objectfk: "PKN-MED031",
                        nilai: $scope.item.operasi,
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketOperasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOperasi,
                        objectfk: "PKN-MED032",
                        nilai: $scope.item.ketOperasi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketRiwayatPenyakit != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketRiwayatPenyakit,
                        objectfk: "PKN-MED700",
                        nilai: $scope.item.ketRiwayatPenyakit,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.transfusi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectransfusi,
                        objectfk: "PKN-MED033",
                        nilai: $scope.item.transfusi,
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksiTransfusi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksiTransfusi,
                        objectfk: "PKN-MED034",
                        nilai: $scope.item.reaksiTransfusi,
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.RiwayatPenyakitKeluarga != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecRiwayatPenyakitKeluarga,
                        objectfk: "PKN-MED035",
                        nilai: $scope.item.RiwayatPenyakitKeluarga,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentKeadaan.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED036",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED037",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED038",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED039",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED040",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 6) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED041",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 7) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED042",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.resusitasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecResusitasi,
                        objectfk: "PKN-MED043",
                        nilai: $scope.item.resusitasi,
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.oksigen != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecoksigen,
                        objectfk: "PKN-MED044",
                        nilai: $scope.item.oksigen,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentMata.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED045",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED046",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED047",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED048",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED049",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 6) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED458",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentTHT.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED050",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED459",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketTonsil != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketTonsil,
                        objectfk: "PKN-MED051",
                        nilai: $scope.item.ketTonsil,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentTHTt.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED052",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentTHTtt.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED053",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketLidah != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketLidah,
                        objectfk: "PKN-MED054",
                        nilai: $scope.item.ketLidah,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentTHTttt.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED055",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketBibir != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBibir,
                        objectfk: "PKN-MED056",
                        nilai: $scope.item.ketBibir,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentLeher.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED057",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED058",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED059",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED060",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED450",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentCor.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED061",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED062",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED063",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED064",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                   
                })

                $scope.currentAlo.forEach(function(data) {
                    ;
                    if (data.id === 998) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED065",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                     if (data.id === 999) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED066",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }

                })
                if ($scope.item.suara != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsuara,
                        objectfk: "PKN-MED067",
                        nilai: $scope.item.suara,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentPulmoo.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED068",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }

                })
                if ($scope.item.ronci != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecronci,
                        objectfk: "PKN-MED069",
                        nilai: $scope.item.ronci,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentPulmooo.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED070",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }

                })
                if ($scope.item.wheezing != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecwheezing,
                        objectfk: "PKN-MED071",
                        nilai: $scope.item.wheezing,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.abdomen != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecabdomen,
                        objectfk: "PKN-MED072",
                        nilai: $scope.item.abdomen,
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lien != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclien,
                        objectfk: "PKN-MED073",
                        nilai: $scope.item.lien,
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainnya != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainnya,
                        objectfk: "PKN-MED074",
                        nilai: $scope.item.lainnya,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentEkstre.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED075",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED076",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED077",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED078",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                if ($scope.item.ketEkstre != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketEkstre,
                        objectfk: "PKN-MED079",
                        nilai: $scope.item.ketEkstre,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentTanda.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED080",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED081",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED082",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED083",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketNeurologi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketNeurologi,
                        objectfk: "PKN-MED084",
                        nilai: $scope.item.ketNeurologi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.E != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecE,
                        objectfk: "PKN-MED085",
                        nilai: $scope.item.E,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.M != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecM,
                        objectfk: "PKN-MED086",
                        nilai: $scope.item.M,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.V != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecV,
                        objectfk: "PKN-MED087",
                        nilai: $scope.item.V,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.daunTelinga != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdaunTelinga,
                        objectfk: "PKN-MED088",
                        nilai: $scope.item.daunTelinga,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kavum != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckavum,
                        objectfk: "PKN-MED089",
                        nilai: $scope.item.kavum,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.orofaring != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecorofaring,
                        objectfk: "PKN-MED090",
                        nilai: $scope.item.orofaring,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.liangTelinga != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecliangTelinga,
                        objectfk: "PKN-MED091",
                        nilai: $scope.item.liangTelinga,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.inferior != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecinferior,
                        objectfk: "PKN-MED092",
                        nilai: $scope.item.inferior,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tonsil != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectonsil,
                        objectfk: "PKN-MED093",
                        nilai: $scope.item.tonsil,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.membran != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmembran,
                        objectfk: "PKN-MED094",
                        nilai: $scope.item.membran,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.medis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmedis,
                        objectfk: "PKN-MED095",
                        nilai: $scope.item.medis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.arkus != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecarkus,
                        objectfk: "PKN-MED096",
                        nilai: $scope.item.arkus,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reflex != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreflex,
                        objectfk: "PKN-MED097",
                        nilai: $scope.item.reflex,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.media != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmedia,
                        objectfk: "PKN-MED098",
                        nilai: $scope.item.media,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dinding != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdinding,
                        objectfk: "PKN-MED099",
                        nilai: $scope.item.dinding,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.rinne != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecrinne,
                        objectfk: "PKN-MED100",
                        nilai: $scope.item.rinne,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.septum != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecseptum,
                        objectfk: "PKN-MED101",
                        nilai: $scope.item.septum,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.weber != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecweber,
                        objectfk: "PKN-MED102",
                        nilai: $scope.item.weber,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.scabach != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecscabach,
                        objectfk: "PKN-MED103",
                        nilai: $scope.item.scabach,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.nasofaring != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnasofaring,
                        objectfk: "PKN-MED104",
                        nilai: $scope.item.nasofaring,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.audimetri != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecaudimetri,
                        objectfk: "PKN-MED105",
                        nilai: $scope.item.audimetri,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.hidungLainnya != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRechidungLainnya,
                        objectfk: "PKN-MED106",
                        nilai: $scope.item.hidungLainnya,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.timpanometri != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectimpanometri,
                        objectfk: "PKN-MED107",
                        nilai: $scope.item.timpanometri,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.fungsiTuba != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecfungsiTuba,
                        objectfk: "PKN-MED108",
                        nilai: $scope.item.fungsiTuba,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.stafedius != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecstafedius,
                        objectfk: "PKN-MED109",
                        nilai: $scope.item.stafedius,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.laring != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclaring,
                        objectfk: "PKN-MED110",
                        nilai: $scope.item.laring,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'))

                if ($scope.pegawai.namaLengkap != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecidPegawai,
                        objectfk: "PKN-MED111",
                        nilai: $scope.pegawai.id,
                        satuan: "-",
                        jenisobject: "IdPegawai"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentEfforessensi.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED113",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED114",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED115",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED116",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED117",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 6) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED118",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 7) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED119",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 8) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED120",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 9) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED121",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 10) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED122",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 11) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED123",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 12) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED124",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentLaki.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED125",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED126",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED127",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED128",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED129",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 6) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED130",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 7) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED131",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 8) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED132",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 9) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED133",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentPerempuan.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED134",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED135",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED136",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED137",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED138",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 6) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED139",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.mukosa != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmukosa,
                        objectfk: "PKN-MED140",
                        nilai: $scope.item.mukosa,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.limfe != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclimfe,
                        objectfk: "PKN-MED141",
                        nilai: $scope.item.limfe,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kuku != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckuku,
                        objectfk: "PKN-MED142",
                        nilai: $scope.item.kuku,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.rambut != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecrambut,
                        objectfk: "PKN-MED143",
                        nilai: $scope.item.rambut,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.saraf != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsaraf,
                        objectfk: "PKN-MED144",
                        nilai: $scope.item.saraf,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lainlainKulit != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlainKulit,
                        objectfk: "PKN-MED145",
                        nilai: $scope.item.lainlainKulit,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.RiwayatPribadi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecRiwayatPribadi,
                        objectfk: "PKN-MED146",
                        nilai: $scope.item.RiwayatPribadi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPengobatanAnak != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPengobatanAnak,
                        objectfk: "PKN-MED147",
                        nilai: $scope.item.ketPengobatanAnak,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentImunisasi.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED148",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentImunisasii.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED149",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentImunisasiii.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED150",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentImunisasiiii.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED151",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentImunisasiiiii.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED152",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentImunisasiiiiii.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED153",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketPolio != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPolio,
                        objectfk: "PKN-MED154",
                        nilai: $scope.item.ketPolio,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketHepatitis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketHepatitis,
                        objectfk: "PKN-MED155",
                        nilai: $scope.item.ketHepatitis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketDPT != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketDPT,
                        objectfk: "PKN-MED156",
                        nilai: $scope.item.ketDPT,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketCampak != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketCampak,
                        objectfk: "PKN-MED157",
                        nilai: $scope.item.ketCampak,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentPersalinan.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED158",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED159",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED160",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED161",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentDitolong.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED162",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED163",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED164",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                if ($scope.item.ketBB != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBB,
                        objectfk: "PKN-MED165",
                        nilai: $scope.item.ketBB,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPB != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPB,
                        objectfk: "PKN-MED166",
                        nilai: $scope.item.ketPB,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketLK != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketLK,
                        objectfk: "PKN-MED167",
                        nilai: $scope.item.ketLK,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lahir != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclahir,
                        objectfk: "PKN-MED168",
                        nilai: $scope.item.lahir.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentNutrisi.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED169",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED170",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED171",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED172",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED173",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketEksklusif != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketEksklusif,
                        objectfk: "PKN-MED174",
                        nilai: $scope.item.ketEksklusif,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketEksklusif1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketEksklusif1,
                        objectfk: "PKN-MED175",
                        nilai: $scope.item.ketEksklusif1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketSejak != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSejak,
                        objectfk: "PKN-MED176",
                        nilai: $scope.item.ketSejak,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketSejak2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSejak2,
                        objectfk: "PKN-MED177",
                        nilai: $scope.item.ketSejak2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketSejak3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSejak3,
                        objectfk: "PKN-MED178",
                        nilai: $scope.item.ketSejak3,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketSejak4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSejak4,
                        objectfk: "PKN-MED179",
                        nilai: $scope.item.ketSejak4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFrekuensi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFrekuensi,
                        objectfk: "PKN-MED180",
                        nilai: $scope.item.ketFrekuensi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFrekuensi2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFrekuensi2,
                        objectfk: "PKN-MED181",
                        nilai: $scope.item.ketFrekuensi2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFrekuensi3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFrekuensi3,
                        objectfk: "PKN-MED182",
                        nilai: $scope.item.ketFrekuensi3,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFrekuensi4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFrekuensi4,
                        objectfk: "PKN-MED183",
                        nilai: $scope.item.ketFrekuensi4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFrekuensi5 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFrekuensi5,
                        objectfk: "PKN-MED184",
                        nilai: $scope.item.ketFrekuensi5,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketMenegakkan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketMenegakkan,
                        objectfk: "PKN-MED185",
                        nilai: $scope.item.ketMenegakkan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketMembalikan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketMembalikan,
                        objectfk: "PKN-MED186",
                        nilai: $scope.item.ketMembalikan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketMerangkak != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketMerangkak,
                        objectfk: "PKN-MED187",
                        nilai: $scope.item.ketMerangkak,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketBerdiri != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBerdiri,
                        objectfk: "PKN-MED188",
                        nilai: $scope.item.ketBerdiri,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketBerjalan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBerjalan,
                        objectfk: "PKN-MED189",
                        nilai: $scope.item.ketBerjalan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketBicara != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBicara,
                        objectfk: "PKN-MED190",
                        nilai: $scope.item.ketBicara,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketKulit != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKulit,
                        objectfk: "PKN-MED191",
                        nilai: $scope.item.ketKulit,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketGenitalia != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketGenitalia,
                        objectfk: "PKN-MED192",
                        nilai: $scope.item.ketGenitalia,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketMensturasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketMensturasi,
                        objectfk: "PKN-MED193",
                        nilai: $scope.item.ketMensturasi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPubis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPubis,
                        objectfk: "PKN-MED194",
                        nilai: $scope.item.ketPubis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketGlenpenis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketGlenpenis,
                        objectfk: "PKN-MED195",
                        nilai: $scope.item.ketGlenpenis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPubis1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPubis1,
                        objectfk: "PKN-MED196",
                        nilai: $scope.item.ketPubis1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.keadaanUmum != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckeadaanUmum,
                        objectfk: "PKN-MED197",
                        nilai: $scope.item.keadaanUmum.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.dataSoal1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal1,
                        objectfk: "PKN-MED198",
                        nilai: $scope.item.dataSoal1.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal2,
                        objectfk: "PKN-MED199",
                        nilai: $scope.item.dataSoal2.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal3,
                        objectfk: "PKN-MED200",
                        nilai: $scope.item.dataSoal3.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal4,
                        objectfk: "PKN-MED201",
                        nilai: $scope.item.dataSoal4.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal5 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal5,
                        objectfk: "PKN-MED202",
                        nilai: $scope.item.dataSoal5.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal6 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal6,
                        objectfk: "PKN-MED203",
                        nilai: $scope.item.dataSoal6.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal7 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal7,
                        objectfk: "PKN-MED204",
                        nilai: $scope.item.dataSoal7.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal8 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal8,
                        objectfk: "PKN-MED205",
                        nilai: $scope.item.dataSoal8.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal9 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal9,
                        objectfk: "PKN-MED206",
                        nilai: $scope.item.dataSoal9.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal10 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal10,
                        objectfk: "PKN-MED207",
                        nilai: $scope.item.dataSoal10.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal11 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal11,
                        objectfk: "PKN-MED208",
                        nilai: $scope.item.dataSoal11.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal12 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal12,
                        objectfk: "PKN-MED209",
                        nilai: $scope.item.dataSoal12.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal13 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal13,
                        objectfk: "PKN-MED210",
                        nilai: $scope.item.dataSoal13.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal14 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal14,
                        objectfk: "PKN-MED211",
                        nilai: $scope.item.dataSoal14.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketMasalahGenetika != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketMasalahGenetika,
                        objectfk: "PKN-MED212",
                        nilai: $scope.item.ketMasalahGenetika,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.dataSoal15 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal15,
                        objectfk: "PKN-MED213",
                        nilai: $scope.item.dataSoal15.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal16 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal16,
                        objectfk: "PKN-MED214",
                        nilai: $scope.item.dataSoal16.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal17 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal17,
                        objectfk: "PKN-MED215",
                        nilai: $scope.item.dataSoal17.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal18 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal18,
                        objectfk: "PKN-MED216",
                        nilai: $scope.item.dataSoal18.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal19 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal19,
                        objectfk: "PKN-MED217",
                        nilai: $scope.item.dataSoal19.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dataSoal20 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdataSoal20,
                        objectfk: "PKN-MED218",
                        nilai: $scope.item.dataSoal20.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketriwayatInfeksi1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketriwayatInfeksi1,
                        objectfk: "PKN-MED219",
                        nilai: $scope.item.ketriwayatInfeksi1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketriwayatInfeksi2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketriwayatInfeksi2,
                        objectfk: "PKN-MED220",
                        nilai: $scope.item.ketriwayatInfeksi2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketriwayatInfeksi3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketriwayatInfeksi3,
                        objectfk: "PKN-MED221",
                        nilai: $scope.item.ketriwayatInfeksi3,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketSistemMotorik != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSistemMotorik,
                        objectfk: "PKN-MED222",
                        nilai: $scope.item.ketSistemMotorik,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKekuatan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKekuatan,
                        objectfk: "PKN-MED223",
                        nilai: $scope.item.ketKekuatan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFisiologis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFisiologis,
                        objectfk: "PKN-MED224",
                        nilai: $scope.item.ketFisiologis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPatalogis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPatalogis,
                        objectfk: "PKN-MED225",
                        nilai: $scope.item.ketPatalogis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketTonus != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketTonus,
                        objectfk: "PKN-MED226",
                        nilai: $scope.item.ketTonus,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketTrofix != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketTrofix,
                        objectfk: "PKN-MED227",
                        nilai: $scope.item.ketTrofix,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPrimitive != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPrimitive,
                        objectfk: "PKN-MED228",
                        nilai: $scope.item.ketPrimitive,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketDisorder != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketDisorder,
                        objectfk: "PKN-MED229",
                        nilai: $scope.item.ketDisorder,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketSensorik != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSensorik,
                        objectfk: "PKN-MED230",
                        nilai: $scope.item.ketSensorik,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketLuhur != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketLuhur,
                        objectfk: "PKN-MED231",
                        nilai: $scope.item.ketLuhur,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketSerebelum != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSerebelum,
                        objectfk: "PKN-MED232",
                        nilai: $scope.item.ketSerebelum,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketOtonom != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOtonom,
                        objectfk: "PKN-MED233",
                        nilai: $scope.item.ketOtonom,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketVerte != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketVerte,
                        objectfk: "PKN-MED234",
                        nilai: $scope.item.ketVerte,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketstatusNeurologi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketstatusNeurologi,
                        objectfk: "PKN-MED235",
                        nilai: $scope.item.ketstatusNeurologi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketCarnialis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketCarnialis,
                        objectfk: "PKN-MED236",
                        nilai: $scope.item.ketCarnialis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKeadaan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKeadaan,
                        objectfk: "PKN-MED237",
                        nilai: $scope.item.ketKeadaan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKesadaran != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKesadaran,
                        objectfk: "PKN-MED238",
                        nilai: $scope.item.ketKesadaran,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.suhu != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsuhu,
                        objectfk: "PKN-MED239",
                        nilai: $scope.item.suhu,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.nadi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnadi,
                        objectfk: "PKN-MED240",
                        nilai: $scope.item.nadi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.sp02 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsp02,
                        objectfk: "PKN-MED241",
                        nilai: $scope.item.sp02,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tekananDarah != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectekananDarah,
                        objectfk: "PKN-MED242",
                        nilai: $scope.item.tekananDarah,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.mataKebidanan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmataKebidanan,
                        objectfk: "PKN-MED243",
                        nilai: $scope.item.mataKebidanan.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.leherKebidanan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecleherKebidanan,
                        objectfk: "PKN-MED244",
                        nilai: $scope.item.leherKebidanan.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dada != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdada,
                        objectfk: "PKN-MED245",
                        nilai: $scope.item.dada,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pulmoKebidanan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpulmoKebidanan,
                        objectfk: "PKN-MED246",
                        nilai: $scope.item.pulmoKebidanan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.bentuk != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecbentuk,
                        objectfk: "PKN-MED247",
                        nilai: $scope.item.bentuk.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.puting != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecputing,
                        objectfk: "PKN-MED248",
                        nilai: $scope.item.puting.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pengeluaran != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpengeluaran,
                        objectfk: "PKN-MED249",
                        nilai: $scope.item.pengeluaran.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kebersihan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckebersihan,
                        objectfk: "PKN-MED250",
                        nilai: $scope.item.kebersihan.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.extremitas != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecextremitas,
                        objectfk: "PKN-MED251",
                        nilai: $scope.item.extremitas.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.luka != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecluka,
                        objectfk: "PKN-MED252",
                        nilai: $scope.item.luka.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kelainan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelainan,
                        objectfk: "PKN-MED253",
                        nilai: $scope.item.kelainan.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.fundus != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecfundus,
                        objectfk: "PKN-MED254",
                        nilai: $scope.item.fundus,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.janin != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecjanin,
                        objectfk: "PKN-MED255",
                        nilai: $scope.item.janin,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.panggul != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpanggul,
                        objectfk: "PKN-MED256",
                        nilai: $scope.item.panggul,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.punggung != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpunggung,
                        objectfk: "PKN-MED257",
                        nilai: $scope.item.punggung.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.presentasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpresentasi,
                        objectfk: "PKN-MED258",
                        nilai: $scope.item.presentasi.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.terendah != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecterendah,
                        objectfk: "PKN-MED259",
                        nilai: $scope.item.terendah,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.terendah2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecterendah2,
                        objectfk: "PKN-MED260",
                        nilai: $scope.item.terendah2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.terendah3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecterendah3,
                        objectfk: "PKN-MED261",
                        nilai: $scope.item.terendah3.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kontraksi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckontraksi,
                        objectfk: "PKN-MED262",
                        nilai: $scope.item.kontraksi.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketHIS != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketHIS,
                        objectfk: "PKN-MED263",
                        nilai: $scope.item.ketHIS,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketLama != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketLama,
                        objectfk: "PKN-MED264",
                        nilai: $scope.item.ketLama,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.kelainan2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelainan2,
                        objectfk: "PKN-MED265",
                        nilai: $scope.item.kelainan2.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.taraba != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectaraba,
                        objectfk: "PKN-MED266",
                        nilai: $scope.item.taraba.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketUk != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketUk,
                        objectfk: "PKN-MED267",
                        nilai: $scope.item.ketUk,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketUk2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketUk2,
                        objectfk: "PKN-MED268",
                        nilai: $scope.item.ketUk2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.auskultasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecauskultasi,
                        objectfk: "PKN-MED269",
                        nilai: $scope.item.auskultasi.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pervaginam != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpervaginam,
                        objectfk: "PKN-MED270",
                        nilai: $scope.item.pervaginam.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentMataNew.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED271",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED272",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED273",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED274",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED275",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketOd != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOd,
                        objectfk: "PKN-MED276",
                        nilai: $scope.item.ketOd,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketOd2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOd2,
                        objectfk: "PKN-MED277",
                        nilai: $scope.item.ketOd2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketOs != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOs,
                        objectfk: "PKN-MED278",
                        nilai: $scope.item.ketOs,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketOs2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOs2,
                        objectfk: "PKN-MED279",
                        nilai: $scope.item.ketOs2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketOd3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOd3,
                        objectfk: "PKN-MED280",
                        nilai: $scope.item.ketOd3,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketOd4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOd4,
                        objectfk: "PKN-MED281",
                        nilai: $scope.item.ketOd4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketOs3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOs3,
                        objectfk: "PKN-MED282",
                        nilai: $scope.item.ketOs,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketOs4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOs4,
                        objectfk: "PKN-MED283",
                        nilai: $scope.item.ketOs4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketOs4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketOs4,
                        objectfk: "PKN-MED283",
                        nilai: $scope.item.ketOs4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPalbera != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPalbera,
                        objectfk: "PKN-MED284",
                        nilai: $scope.item.ketPalbera,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPalbera2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPalbera2,
                        objectfk: "PKN-MED285",
                        nilai: $scope.item.ketPalbera2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKonjungtiva != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKonjungtiva,
                        objectfk: "PKN-MED286",
                        nilai: $scope.item.ketKonjungtiva,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKonjungtiva2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKonjungtiva2,
                        objectfk: "PKN-MED287",
                        nilai: $scope.item.ketKonjungtiva2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKornea != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKornea,
                        objectfk: "PKN-MED288",
                        nilai: $scope.item.ketKornea,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKornea2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKornea2,
                        objectfk: "PKN-MED289",
                        nilai: $scope.item.ketKornea2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketBilik != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBilik,
                        objectfk: "PKN-MED290",
                        nilai: $scope.item.ketBilik,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketBilik2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBilik2,
                        objectfk: "PKN-MED291",
                        nilai: $scope.item.ketBilik2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketIris != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketIris,
                        objectfk: "PKN-MED292",
                        nilai: $scope.item.ketIris,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketIris2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketIris2,
                        objectfk: "PKN-MED293",
                        nilai: $scope.item.ketIris2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPupil != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPupil,
                        objectfk: "PKN-MED294",
                        nilai: $scope.item.ketPupil,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPupil2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPupil2,
                        objectfk: "PKN-MED295",
                        nilai: $scope.item.ketPupil2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketLensa != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketLensa,
                        objectfk: "PKN-MED296",
                        nilai: $scope.item.ketLensa,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketLensa2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketLensa2,
                        objectfk: "PKN-MED297",
                        nilai: $scope.item.ketLensa2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketViterus != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketViterus,
                        objectfk: "PKN-MED298",
                        nilai: $scope.item.ketViterus,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketViterus2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketViterus2,
                        objectfk: "PKN-MED299",
                        nilai: $scope.item.ketViterus2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFunduskopi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFunduskopi,
                        objectfk: "PKN-MED300",
                        nilai: $scope.item.ketFunduskopi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketFunduskopi2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketFunduskopi2,
                        objectfk: "PKN-MED301",
                        nilai: $scope.item.ketFunduskopi2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketHuman != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketHuman,
                        objectfk: "PKN-MED302",
                        nilai: $scope.item.ketHuman,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.ketAplanasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketAplanasi,
                        objectfk: "PKN-MED303",
                        nilai: $scope.item.ketAplanasi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketSchiotz != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketSchiotz,
                        objectfk: "PKN-MED304",
                        nilai: $scope.item.ketSchiotz,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketAnel != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketAnel,
                        objectfk: "PKN-MED305",
                        nilai: $scope.item.ketAnel,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentTHTmata.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED306",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED307",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED308",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED309",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentLeherMata.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED310",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED311",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED312",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.thorax != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecthorax,
                        objectfk: "PKN-MED313",
                        nilai: $scope.item.thorax.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketThorax != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketThorax,
                        objectfk: "PKN-MED314",
                        nilai: $scope.item.ketThorax.toString(),
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentCorMata.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED315",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED316",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentCorMata1.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED317",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentCorMata2.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED318",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentCorMata3.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED319",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketMurmur != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketMurmur,
                        objectfk: "PKN-MED320",
                        nilai: $scope.item.ketMurmur,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketBising != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketBising,
                        objectfk: "PKN-MED321",
                        nilai: $scope.item.ketBising,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                $scope.currentPulmoMata.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED322",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED323",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED324",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                if ($scope.item.ketPulmoMata != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPulmoMata,
                        objectfk: "PKN-MED325",
                        nilai: $scope.item.ketPulmoMata,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentEkstreMata.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED326",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED327",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED328",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED329",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentTandaMata.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED330",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED331",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED332",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED333",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.kesadaranTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckesadaranTumbuh,
                        objectfk: "PKN-MED334",
                        nilai: $scope.item.kesadaranTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tekananTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectekananTumbuh,
                        objectfk: "PKN-MED335",
                        nilai: $scope.item.tekananTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.cengeng != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReccengeng,
                        objectfk: "PKN-MED336",
                        nilai: $scope.item.cengeng,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.nadiTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnadiTumbuh,
                        objectfk: "PKN-MED337",
                        nilai: $scope.item.nadiTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.emosi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecemosi,
                        objectfk: "PKN-MED338",
                        nilai: $scope.item.emosi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pernafasan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpernafasan,
                        objectfk: "PKN-MED339",
                        nilai: $scope.item.pernafasan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.intelektual != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecintelektual,
                        objectfk: "PKN-MED340",
                        nilai: $scope.item.intelektual,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lainTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainTumbuh,
                        objectfk: "PKN-MED341",
                        nilai: $scope.item.lainTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.bentukTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecbentukTumbuh,
                        objectfk: "PKN-MED342",
                        nilai: $scope.item.bentukTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.rambutTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecrambutTumbuh,
                        objectfk: "PKN-MED343",
                        nilai: $scope.item.rambutTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.telingaTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectelingaTumbuh,
                        objectfk: "PKN-MED344",
                        nilai: $scope.item.telingaTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.bentukTumbuh2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecbentukTumbuh2,
                        objectfk: "PKN-MED345",
                        nilai: $scope.item.bentukTumbuh2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.membranTumbuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecmembranTumbuh,
                        objectfk: "PKN-MED346",
                        nilai: $scope.item.membranTumbuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kelainanLain != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelainanLain,
                        objectfk: "PKN-MED347",
                        nilai: $scope.item.kelainanLain,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.bentukMata != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecbentukMata,
                        objectfk: "PKN-MED348",
                        nilai: $scope.item.bentukMata,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.katarak != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckatarak,
                        objectfk: "PKN-MED349",
                        nilai: $scope.item.katarak,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.visus != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecvisus,
                        objectfk: "PKN-MED350",
                        nilai: $scope.item.visus,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kelainanMata != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelainanMata,
                        objectfk: "PKN-MED351",
                        nilai: $scope.item.kelainanMata,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kelainanHidung != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelainanHidung,
                        objectfk: "PKN-MED352",
                        nilai: $scope.item.kelainanHidung,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pharing != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpharing,
                        objectfk: "PKN-MED353",
                        nilai: $scope.item.pharing,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lidah != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclidah,
                        objectfk: "PKN-MED354",
                        nilai: $scope.item.lidah,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.gigi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecgigi,
                        objectfk: "PKN-MED355",
                        nilai: $scope.item.gigi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kelenjar != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelenjar,
                        objectfk: "PKN-MED356",
                        nilai: $scope.item.kelenjar,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tiroid != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectiroid,
                        objectfk: "PKN-MED357",
                        nilai: $scope.item.tiroid,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.bentukThorax != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecbentukThorax,
                        objectfk: "PKN-MED358",
                        nilai: $scope.item.bentukThorax,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.simetris != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsimetris,
                        objectfk: "PKN-MED359",
                        nilai: $scope.item.simetris,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.gerakan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecgerakan,
                        objectfk: "PKN-MED360",
                        nilai: $scope.item.gerakan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pembesaran != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpembesaran,
                        objectfk: "PKN-MED361",
                        nilai: $scope.item.pembesaran,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.irama != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecirama,
                        objectfk: "PKN-MED362",
                        nilai: $scope.item.irama,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.dj != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdj,
                        objectfk: "PKN-MED363",
                        nilai: $scope.item.dj,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.suaraJantung != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsuaraJantung,
                        objectfk: "PKN-MED364",
                        nilai: $scope.item.suaraJantung,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.bising != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecbising,
                        objectfk: "PKN-MED365",
                        nilai: $scope.item.bising,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.thrill != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecthrill,
                        objectfk: "PKN-MED366",
                        nilai: $scope.item.thrill,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.suaraNafas != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsuaraNafas,
                        objectfk: "PKN-MED367",
                        nilai: $scope.item.suaraNafas,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ronchi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecronchi,
                        objectfk: "PKN-MED368",
                        nilai: $scope.item.ronchi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.wheezingParu != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecwheezingParu,
                        objectfk: "PKN-MED369",
                        nilai: $scope.item.wheezingParu,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.hati != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRechati,
                        objectfk: "PKN-MED370",
                        nilai: $scope.item.hati,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.limpa != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclimpa,
                        objectfk: "PKN-MED371",
                        nilai: $scope.item.limpa,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ginjal != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecginjal,
                        objectfk: "PKN-MED372",
                        nilai: $scope.item.ginjal,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tumor != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectumor,
                        objectfk: "PKN-MED373",
                        nilai: $scope.item.tumor,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.asites != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecasites,
                        objectfk: "PKN-MED374",
                        nilai: $scope.item.asites,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.bentukEkstremitas != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecbentukEkstremitas,
                        objectfk: "PKN-MED375",
                        nilai: $scope.item.bentukEkstremitas,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ekstremitas != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecekstremitas,
                        objectfk: "PKN-MED376",
                        nilai: $scope.item.ekstremitas.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.udema != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecudema,
                        objectfk: "PKN-MED377",
                        nilai: $scope.item.udema,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kanan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckanan,
                        objectfk: "PKN-MED378",
                        nilai: $scope.item.kanan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kiri != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckiri,
                        objectfk: "PKN-MED379",
                        nilai: $scope.item.kiri,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.penis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpenis,
                        objectfk: "PKN-MED380",
                        nilai: $scope.item.penis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ukuran != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecukuran,
                        objectfk: "PKN-MED381",
                        nilai: $scope.item.ukuran,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tulang != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectulang,
                        objectfk: "PKN-MED382",
                        nilai: $scope.item.tulang,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.udem != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecudem,
                        objectfk: "PKN-MED383",
                        nilai: $scope.item.udem,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pigmentasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpigmentasi,
                        objectfk: "PKN-MED384",
                        nilai: $scope.item.pigmentasi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kelainanKulit != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelainanKulit,
                        objectfk: "PKN-MED385",
                        nilai: $scope.item.kelainanKulit,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kelainanKulitlain != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckelainanKulitlain,
                        objectfk: "PKN-MED386",
                        nilai: $scope.item.kelainanKulitlain,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.payudara != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpayudara,
                        objectfk: "PKN-MED387",
                        nilai: $scope.item.payudara,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.testis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectestis,
                        objectfk: "PKN-MED388",
                        nilai: $scope.item.testis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.rambutPubis != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecrambutPubis,
                        objectfk: "PKN-MED389",
                        nilai: $scope.item.rambutPubis,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.rambutKetiak != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecrambutKetiak,
                        objectfk: "PKN-MED390",
                        nilai: $scope.item.rambutKetiak,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tandaPubertas != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectandaPubertas,
                        objectfk: "PKN-MED391",
                        nilai: $scope.item.tandaPubertas.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.alergi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecalergi,
                        objectfk: "PKN-MED392",
                        nilai: $scope.item.alergi.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketAlergi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketAlergi,
                        objectfk: "PKN-MED393",
                        nilai: $scope.item.ketAlergi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.D != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecD,
                        objectfk: "PKN-MED394",
                        nilai: $scope.item.D,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.M != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecM,
                        objectfk: "PKN-MED395",
                        nilai: $scope.item.M,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.F != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecF,
                        objectfk: "PKN-MED396",
                        nilai: $scope.item.F,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.DMF != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecDMF,
                        objectfk: "PKN-MED397",
                        nilai: $scope.item.DMF,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.d != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecd,
                        objectfk: "PKN-MED398",
                        nilai: $scope.item.d,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.e != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRece,
                        objectfk: "PKN-MED399",
                        nilai: $scope.item.e,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.f != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecf,
                        objectfk: "PKN-MED400",
                        nilai: $scope.item.f,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.def != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdef,
                        objectfk: "PKN-MED401",
                        nilai: $scope.item.e,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.PTI != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecPTI,
                        objectfk: "PKN-MED402",
                        nilai: $scope.item.PTI,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.RTI != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecRTI,
                        objectfk: "PKN-MED403",
                        nilai: $scope.item.RTI,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.deskripsileher != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdeskripsileher,
                        objectfk: "PKN-MED404",
                        nilai: $scope.item.deskripsileher,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatempat != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatempat,
                        objectfk: "PKN-MED405",
                        nilai: $scope.item.obatempat,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatlima != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatlima,
                        objectfk: "PKN-MED406",
                        nilai: $scope.item.obatlima,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatenam != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatenam,
                        objectfk: "PKN-MED407",
                        nilai: $scope.item.obatenam,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obattujuh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobattujuh,
                        objectfk: "PKN-MED408",
                        nilai: $scope.item.obattujuh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatdelapan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatdelapan,
                        objectfk: "PKN-MED409",
                        nilai: $scope.item.obatdelapan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatsembilan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatsembilan,
                        objectfk: "PKN-MED410",
                        nilai: $scope.item.obatsembilan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.obatsepuluh != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecobatsepuluh,
                        objectfk: "PKN-MED411",
                        nilai: $scope.item.obatsepuluh,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksiempat1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksiempat1,
                        objectfk: "PKN-MED412",
                        nilai: $scope.item.reaksiempat1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksilima1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksilima1,
                        objectfk: "PKN-MED413",
                        nilai: $scope.item.reaksilima1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksienam1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksienam1,
                        objectfk: "PKN-MED414",
                        nilai: $scope.item.reaksienam1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksitujuh1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksitujuh1,
                        objectfk: "PKN-MED415",
                        nilai: $scope.item.reaksitujuh1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksidelapan1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.norecreaksidelapan1,
                        objectfk: "PKN-MED416",
                        nilai: $scope.item.reaksidelapan1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksisembilan1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksisembilan1,
                        objectfk: "PKN-MED417",
                        nilai: $scope.item.reaksisembilan1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.reaksisepuluh1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecreaksisepuluh1,
                        objectfk: "PKN-MED418",
                        nilai: $scope.item.reaksisepuluh1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.deskripsimata != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdeskripsimata,
                        objectfk: "PKN-MED419",
                        nilai: $scope.item.deskripsimata,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.deskripsitht != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdeskripsitht,
                        objectfk: "PKN-MED420",
                        nilai: $scope.item.deskripsitht,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.tulangBelakang != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectulangBelakang,
                        objectfk: "PKN-MED421",
                        nilai: $scope.item.tulangBelakang.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tulangDada != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectulangDada,
                        objectfk: "PKN-MED422",
                        nilai: $scope.item.tulangDada.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.jenisPernapasan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecjenisPernapasan,
                        objectfk: "PKN-MED423",
                        nilai: $scope.item.jenisPernapasan.toString(),
                        satuan: "-",
                        jenisobject: "radio button"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketPalpasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketPalpasi,
                        objectfk: "PKN-MED424",
                        nilai: $scope.item.ketPalpasi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                $scope.currentPerkusi.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED425",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED426",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED427",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED428",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentAuskultasi.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED429",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED430",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED431",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })
                $scope.currentEkstreGeriatri.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED432",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED433",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED434",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED435",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED436",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 6) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED437",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                $scope.currentUterus.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED438",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED439",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED440",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED441",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketUterus != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketUterus,
                        objectfk: "PKN-MED442",
                        nilai: $scope.item.ketUterus,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketUterus2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketUterus2,
                        objectfk: "PKN-MED443",
                        nilai: $scope.item.ketUterus2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                $scope.currentAnogenital.forEach(function(data) {
                    if (data.id === 1) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED444",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 2) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED445",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 3) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED446",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 4) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED447",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                    if (data.id === 5) {
                        var tmpDataHambatan = {
                            norec: undefined,
                            objectfk: "PKN-MED448",
                            nilai: data.id.toString(),
                            satuan: "-",
                            jenisobject: "checkbox"
                        }
                        tempData.push(tmpDataHambatan);
                    }
                })

                if ($scope.item.ketHisberg != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketHisberg,
                        objectfk: "PKN-MED449",
                        nilai: $scope.item.ketHisberg,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketHisberg2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketHisberg2,
                        objectfk: "PKN-MED450",
                        nilai: $scope.item.ketHisberg2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketVisus != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketVisus,
                        objectfk: "PKN-MED451",
                        nilai: $scope.item.ketVisus,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketVisus2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketVisus2,
                        objectfk: "PKN-MED452",
                        nilai: $scope.item.ketVisus2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKacamata != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKacamata,
                        objectfk: "PKN-MED453",
                        nilai: $scope.item.ketKacamata,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKacamata2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKacamata2,
                        objectfk: "PKN-MED454",
                        nilai: $scope.item.ketKacamata2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketTio != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketTio,
                        objectfk: "PKN-MED455",
                        nilai: $scope.item.ketTio,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketTio2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketTio2,
                        objectfk: "PKN-MED456",
                        nilai: $scope.item.ketTio2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketTandaMata != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketTandaMata,
                        objectfk: "PKN-MED457",
                        nilai: $scope.item.ketTandaMata,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tglpengkajian != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectglpengkajian,
                        objectfk: "PKN-MED461",
                        nilai: moment($scope.item.tglpengkajian).format('YYYY-MM-DD HH:MM'),
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.obj[119] === true) {
                    var tmpDataHambatan = {
                        norec: undefined,
                        objectfk: "PKN-MED462",
                        nilai: true,
                        satuan: "-",
                        jenisobject: "checkbox"
                    }
                    tempData.push(tmpDataHambatan);
                }

                if ($scope.item.obj[120] === true) {
                    var tmpDataHambatan = {
                        norec: undefined,
                        objectfk: "PKN-MED463",
                        nilai: true,
                        satuan: "-",
                        jenisobject: "checkbox"
                    }
                    tempData.push(tmpDataHambatan);
                }

                if ($scope.item.obj[121] === true) {
                    var tmpDataHambatan = {
                        norec: undefined,
                        objectfk: "PKN-MED464",
                        nilai: true,
                        satuan: "-",
                        jenisobject: "checkbox"
                    }
                    tempData.push(tmpDataHambatan);
                }

                if ($scope.item.obj[122] === true) {
                    var tmpDataHambatan = {
                        norec: undefined,
                        objectfk: "PKN-MED465",
                        nilai: true,
                        satuan: "-",
                        jenisobject: "checkbox"
                    }
                    tempData.push(tmpDataHambatan);
                }

                if ($scope.item.obj[123] === true) {
                    var tmpDataHambatan = {
                        norec: undefined,
                        objectfk: "PKN-MED466",
                        nilai: true,
                        satuan: "-",
                        jenisobject: "checkbox"
                    }
                    tempData.push(tmpDataHambatan);
                }

                if ($scope.item.obj[124] === true) {
                    var tmpDataHambatan = {
                        norec: undefined,
                        objectfk: "PKN-MED467",
                        nilai: true,
                        satuan: "-",
                        jenisobject: "checkbox"
                    }
                    tempData.push(tmpDataHambatan);
                }

                if ($scope.item.keadaanumum != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckeadaanumum,
                        objectfk: "PKN-MED468",
                        nilai: $scope.item.keadaanumum,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tekananDarah != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectekananDarah,
                        objectfk: "PKN-MED469",
                        nilai: $scope.item.tekananDarah,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.suhu != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsuhu,
                        objectfk: "PKN-MED470",
                        nilai: $scope.item.suhu,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.kesadaran != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReckesadaran,
                        objectfk: "PKN-MED471",
                        nilai: $scope.item.kesadaran,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.nadi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnadi,
                        objectfk: "PKN-MED472",
                        nilai: $scope.item.nadi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pernapasan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpernapasan,
                        objectfk: "PKN-MED473",
                        nilai: $scope.item.pernapasan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.normal1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal1,
                        objectfk: "PKN-MED474",
                        nilai: $scope.item.normal1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal2,
                        objectfk: "PKN-MED475",
                        nilai: $scope.item.normal2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal3,
                        objectfk: "PKN-MED476",
                        nilai: $scope.item.normal3,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal4,
                        objectfk: "PKN-MED477",
                        nilai: $scope.item.normal4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal5 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal5,
                        objectfk: "PKN-MED478",
                        nilai: $scope.item.normal5,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal6 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal6,
                        objectfk: "PKN-MED479",
                        nilai: $scope.item.normal6,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal7 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal7,
                        objectfk: "PKN-MED480",
                        nilai: $scope.item.normal7,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal8 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal8,
                        objectfk: "PKN-MED481",
                        nilai: $scope.item.normal8,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal9 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal9,
                        objectfk: "PKN-MED482",
                        nilai: $scope.item.normal9,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.normal10 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecnormal10,
                        objectfk: "PKN-MED483",
                        nilai: $scope.item.normal10,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.pernapasan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpernapasan,
                        objectfk: "PKN-MED484",
                        nilai: $scope.item.pernapasan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.tidaknormal1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal1,
                        objectfk: "PKN-MED485",
                        nilai: $scope.item.tidaknormal1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal2,
                        objectfk: "PKN-MED486",
                        nilai: $scope.item.tidaknormal2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal3,
                        objectfk: "PKN-MED487",
                        nilai: $scope.item.tidaknormal3,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal4,
                        objectfk: "PKN-MED488",
                        nilai: $scope.item.tidaknormal4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal5 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal5,
                        objectfk: "PKN-MED489",
                        nilai: $scope.item.tidaknormal5,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal6 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal6,
                        objectfk: "PKN-MED490",
                        nilai: $scope.item.tidaknormal6,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal7 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal7,
                        objectfk: "PKN-MED491",
                        nilai: $scope.item.tidaknormal7,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal8 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal8,
                        objectfk: "PKN-MED492",
                        nilai: $scope.item.tidaknormal8,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal9 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal9,
                        objectfk: "PKN-MED493",
                        nilai: $scope.item.tidaknormal9,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.tidaknormal10 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectidaknormal10,
                        objectfk: "PKN-MED494",
                        nilai: $scope.item.tidaknormal10,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.inspeksi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecinspeksi,
                        objectfk: "PKN-MED495",
                        nilai: $scope.item.inspeksi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.Palpasi != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecPalpasi,
                        objectfk: "PKN-MED496",
                        nilai: $scope.item.Palpasi,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.sensory != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecsensory,
                        objectfk: "PKN-MED497",
                        nilai: $scope.item.sensory,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.rom != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecrom,
                        objectfk: "PKN-MED498",
                        nilai: $scope.item.rom,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                // if ($scope.item.diagnostik != undefined) {
                //     var tmpDataEdukasi = {
                //         norec: $scope.noRecdiagnostik,
                //         objectfk: "PKN-MED499",
                //         nilai: $scope.item.diagnostik.id,
                //         satuan: $scope.item.diagnostik.diagnosa,
                //         jenisobject: "combobox"
                //     }
                //     tempData.push(tmpDataEdukasi);
                // }

                if ($scope.item.listDiagnostik != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdiagnostik,
                        objectfk: "PKN-MED499",
                        nilai: $scope.item.listDiagnostik,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.pemeriksaanpenunjang != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpemeriksaanpenunjang,
                        objectfk: "PKN-MED500",
                        nilai: $scope.item.pemeriksaanpenunjang,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.tatalaksana != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectatalaksana,
                        objectfk: "PKN-MED501",
                        nilai: $scope.item.tatalaksana,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.rencana != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecrencana,
                        objectfk: "PKN-MED502",
                        nilai: $scope.item.rencana,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.tglselesai != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRectglselesai,
                        objectfk: "PKN-MED503",
                        nilai: moment($scope.item.tglselesai).format('YYYY-MM-DD HH:MM'),
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.dokterpenanggungjawab != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdokterpenanggungjawab,
                        objectfk: "PKN-MED504",
                        nilai: $scope.item.dokterpenanggungjawab.id,
                        satuan: $scope.item.dokterpenanggungjawab.namalengkap,
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if (photo != undefined) {
                    kendo.drawing.drawDOM($(".surface"))
                        .then(function(group) {

                            // Render the result as a SVG document
                            return kendo.drawing.exportImage(group);
                        }).done(function(data) {
                            photo = data
                            $scope.user.poto = photo
                            $scope.item.orto  = "background-image:url("+ $scope.user.poto +"); height: 180px; width: 220px";

                        })
                        debugger;
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpoto,
                        objectfk: "PKN-MED505",
                        nilai: photo,
                        satuan: "-",
                        jenisobject: "photo"
                    }
                    tempData.push(tmpDataEdukasi);
                }


                if (photo2 != undefined) {
                    kendo.drawing.drawDOM($(".surface2"))
                        .then(function(group) {

                            // Render the result as a SVG document
                            return kendo.drawing.exportImage(group);
                        }).done(function(data) {
                            photo2 = data
                            $scope.user.poto2 = photo2
                            $scope.item.uro  = "background-image:url("+ $scope.user.poto2 +"); height: 240px; width: 410px"

                        })
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpoto,
                        objectfk: "PKN-MED506",
                        nilai: photo2,
                        satuan: "-",
                        jenisobject: "photo"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.keteranganpemeriksaan != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketeranganpemeriksaan,
                        objectfk: "PKN-MED507",
                        nilai: $scope.item.keteranganpemeriksaan,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }


                if (photo3 != undefined) {
                    kendo.drawing.drawDOM($(".surface3"))
                        .then(function(group) {

                            // Render the result as a SVG document
                            return kendo.drawing.exportImage(group);
                        }).done(function(data) {
                            photo3 = data
                            $scope.user.poto3 = photo3;
                            $scope.item.jantung  = "background-image:url("+ $scope.user.poto3 +"); height: 180px; width: 220px";

                        })
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpoto3,
                        objectfk: "PKN-MED508",
                        nilai: photo3,
                        satuan: "-",
                        jenisobject: "photo"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.keteranganjantung != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketeranganjantung,
                        objectfk: "PKN-MED509",
                        nilai: $scope.item.keteranganjantung,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }


                if (photo4 != undefined) {
                    kendo.drawing.drawDOM($(".surface4"))
                        .then(function(group) {

                            // Render the result as a SVG document
                            return kendo.drawing.exportImage(group);
                        }).done(function(data) {
                            photo4 = data
                            $scope.user.poto4 = photo4;
                            $scope.item.anak  = "background-image:url("+ $scope.user.poto4 +"); height: 180px; width: 220px"

                        })
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpoto4,
                        objectfk: "PKN-MED510",
                        nilai: photo4,
                        satuan: "-",
                        jenisobject: "photo"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                // if ($scope.item.diagnostik2 != undefined) {
                //     var tmpDataEdukasi = {
                //         norec: $scope.noRecdiagnostik2,
                //         objectfk: "PKN-MED511",
                //         nilai: $scope.item.diagnostik2.id,
                //         satuan: $scope.item.diagnostik2.diagnosa,
                //         jenisobject: "textbox"
                //     }
                //     tempData.push(tmpDataEdukasi);
                // }
                if ($scope.item.listDiagnostik2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecdiagnostik2,
                        objectfk: "PKN-MED511",
                        nilai: $scope.item.listDiagnostik2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.pemeriksaanjantung != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpemeriksaanjantung,
                        objectfk: "PKN-MED512",
                        nilai: $scope.item.pemeriksaanjantung,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ekg != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecekg,
                        objectfk: "PKN-MED513",
                        nilai: $scope.item.ekg,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }


                if (photo5 != undefined) {
                    kendo.drawing.drawDOM($(".surface5"))
                        .then(function(group) {

                            // Render the result as a SVG document
                            return kendo.drawing.exportImage(group);
                        }).done(function(data) {
                            photo5 = data
                            $scope.user.poto5 = photo5 
                            $scope.item.dalam  = "background-image:url("+ $scope.user.poto5  +"); height: 180px; width: 440px"

                        })
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpoto5,
                        objectfk: "PKN-MED514",
                        nilai: photo5,
                        satuan: "-",
                        jenisobject: "photo"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lainlain1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain1,
                        objectfk: "PKN-MED515",
                        nilai: $scope.item.lainlain1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.lainlain2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain2,
                        objectfk: "PKN-MED516",
                        nilai: $scope.item.lainlain2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }


                if ($scope.item.ketKeluhan1 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKeluhan1,
                        objectfk: "PKN-MED517",
                        nilai: $scope.item.ketKeluhan1,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                if ($scope.item.ketKeluhan2 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noRecketKeluhan2,
                        objectfk: "PKN-MED518",
                        nilai: $scope.item.ketKeluhan2,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }
                 if (photo6 != undefined) {
                    kendo.drawing.drawDOM($(".surface6"))
                        .then(function(group) {

                            // Render the result as a SVG document
                            return kendo.drawing.exportImage(group);
                        }).done(function(data) {
                            photo6 = data
                            $scope.user.poto6 = photo6
                            $scope.item.saraf  = "background-image:url("+ $scope.user.poto6 +"); height: 240px; width: 240px"

                        })
                    var tmpDataEdukasi = {
                        norec: $scope.noRecpoto6,
                        objectfk: "PKN-MED519",
                        nilai: photo6,
                        satuan: "-",
                        jenisobject: "photo"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain3 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain3,
                        objectfk: "PKN-MED520",
                        nilai: $scope.item.lainlain3,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain4 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain4,
                        objectfk: "PKN-MED521",
                        nilai: $scope.item.lainlain4,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain5 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain5,
                        objectfk: "PKN-MED522",
                        nilai: $scope.item.lainlain5,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain6 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain6,
                        objectfk: "PKN-MED523",
                        nilai: $scope.item.lainlain6,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain7 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain7,
                        objectfk: "PKN-MED524",
                        nilai: $scope.item.lainlain7,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain8 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain8,
                        objectfk: "PKN-MED525",
                        nilai: $scope.item.lainlain8,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain9 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain9,
                        objectfk: "PKN-MED526",
                        nilai: $scope.item.lainlain9,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain10 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain10,
                        objectfk: "PKN-MED527",
                        nilai: $scope.item.lainlain10,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain11 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain11,
                        objectfk: "PKN-MED528",
                        nilai: $scope.item.lainlain11,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain12 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain12,
                        objectfk: "PKN-MED529",
                        nilai: $scope.item.lainlain12,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

                if ($scope.item.lainlain13 != undefined) {
                    var tmpDataEdukasi = {
                        norec: $scope.noReclainlain13,
                        objectfk: "PKN-MED530",
                        nilai: $scope.item.lainlain13,
                        satuan: "-",
                        jenisobject: "textbox"
                    }
                    tempData.push(tmpDataEdukasi);
                }

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
                    objecthead: "PKN-MED"
                }
                medifirstService.post('emr/save-data-rekam-medis', jsonSave).then(function(e) {
                    // $scope.getdata();
                    // managePhp.postLogging('Pengkajian Keperawatan', 'Norec Antrian Pasien Diperiksa', $state.params.noRec, 'Pengkajian Keperawatan Kupang').then(function(res) {})
                });
                var jsonSave = {
                    noregistrasi:$scope.item.noregistrasi,
                    td: $scope.item.tekananDarah,
                    nadi: $scope.item.nadi,
                    suhu: $scope.item.suhu,
                    pernafasan: $scope.item.pernapasan,
                    keluhanutama: $scope.item.ketKeluhan, 
                    riwayatpenyakit: $scope.item.ketPenyakit,
                    penyakitdahulu: $scope.item.ketPengobatan,
                    diagnosakerjamedis: $scope.item.listDiagnostik,
                    diagnosakerjabanding: $scope.item.listDiagnostik2,

                }
                medifirstService.post('emr/save-ttv', jsonSave).then(function (e) {
                    init();
                });

                
            }

            $scope.Batal = function() {
                ClearAll();
                $scope.myVar = 1;
            }
            $scope.tambah = function() {
                $scope.showAlergi1 = true;
                $scope.tutup1 = true;
            };


            $scope.tambah2 = function() {
                $scope.showAlergi2 = true;
                $scope.tutup1 = false;
                $scope.tutup2 = true;

            }
            $scope.tambah3 = function() {
                $scope.showAlergi3 = true;
                $scope.tutup2 = false;
                $scope.tutup3 = true;
            }
            $scope.tambah4 = function() {
                $scope.showAlergi4 = true;
                $scope.tutup3 = false;
                $scope.tutup4 = true;
            }
            $scope.tambah5 = function() {
                $scope.showAlergi5 = true;
                $scope.tutup4 = false;
                $scope.tutup5 = true;
            }
            $scope.tambah6 = function() {
                $scope.showAlergi6 = true;
                $scope.tutup5 = false;
                $scope.tutup6 = true;
            }
            $scope.tambah7 = function() {
                $scope.showAlergi7 = true;
                $scope.tutup6 = false;
                $scope.tutup7 = true;
            }
            $scope.tambah8 = function() {
                $scope.showAlergi8 = true;
                $scope.tutup7 = false;
                $scope.tutup8 = true;
            }
            $scope.tambah9 = function() {
                $scope.showAlergi9 = true;
                $scope.tutup8 = false;
                $scope.tutup9 = true;
            }


            $scope.hapus2 = function() {
                $scope.showAlergi1 = false;
                $scope.item.obatdua = undefined;
                $scope.item.reaksidua = undefined;


            };
            $scope.hapus3 = function() {
                $scope.showAlergi2 = false;
                $scope.tutup1 = true;

                $scope.item.obattiga = undefined;
                $scope.item.reaksitiga = undefined;
            };
            $scope.hapus4 = function() {
                $scope.showAlergi3 = false;
                $scope.tutup2 = true;

                $scope.item.obatempat = undefined;
                $scope.item.reaksiempat1 = undefined;
            };
            $scope.hapus5 = function() {
                $scope.showAlergi4 = false;
                $scope.tutup3 = true;

                $scope.item.obatlima = undefined;
                $scope.item.reaksilima1 = undefined;
            };
            $scope.hapus6 = function() {
                $scope.showAlergi5 = false;
                $scope.tutup4 = true;

                $scope.item.obatenam = undefined;
                $scope.item.reaksienam1 = undefined;
            };
            $scope.hapus7 = function() {
                $scope.showAlergi6 = false;
                $scope.tutup5 = true;

                $scope.item.obattujuh = undefined;
                $scope.item.reaksitujuh1 = undefined;
            };
            $scope.hapus8 = function() {
                $scope.showAlergi7 = false;
                $scope.tutup6 = true;

                $scope.item.obatdelapan = undefined;
                $scope.item.reaksidelapan1 = undefined;
            };
            $scope.hapus9 = function() {
                $scope.showAlergi8 = false;
                $scope.tutup7 = true;

                $scope.item.obatsembilan = undefined;
                $scope.item.reaksisembilan1 = undefined;
            };
            $scope.hapus10 = function() {
                $scope.showAlergi9 = false;
                $scope.tutup8 = true;

                $scope.item.obatsepuluh = undefined;
                $scope.item.reaksisepuluh1 = undefined;
            };

            $scope.klikChange = function(data, stat) {

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

                }
            }
          

            //***********************************
        }
    ]);
});