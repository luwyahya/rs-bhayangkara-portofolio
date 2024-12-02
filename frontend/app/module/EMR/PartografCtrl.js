define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PartografCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            $scope.item = {};
            $scope.item.obj = []
            var nomorEMRSS = '';
            var nomorEMR = '-'
            var paramSearch = ''
            $scope.cc.emrfk = 2018
            var dataLoad = []

            var seriesSuhu = []
            var sesiesJantung = []
            var seriesNadi = []
            var seriesTd = []
            loadChart()

            LoadCacheHelper()

            
            $scope.listJantungJanin = [
                {'id' : 10, 'nama': '0'},
                {'id' : 11, 'nama': '30'},
                {'id' : 12, 'nama': '60'},
                {'id' : 13, 'nama': '90'},
                {'id' : 14, 'nama': '120'},
                {'id' : 15, 'nama': '150'},
                {'id' : 16, 'nama': '180'},
                {'id' : 17, 'nama': '210'},
                {'id' : 18, 'nama': '240'},
                {'id' : 19, 'nama': '270'},
                {'id' : 20, 'nama': '300'},
                {'id' : 21, 'nama': '330'},
                {'id' : 22, 'nama': '360'},
                {'id' : 23, 'nama': '390'},
                {'id' : 24, 'nama': '420'},
                {'id' : 25, 'nama': '450'}
            ];

            $scope.listJantungJanin2 = [
                {'id' : 26, 'nama': '480'},
                {'id' : 27, 'nama': '510'},
                {'id' : 28, 'nama': '540'},
                {'id' : 29, 'nama': '570'},
                {'id' : 30, 'nama': '600'},
                {'id' : 31, 'nama': '630'},
                {'id' : 32, 'nama': '660'},
                {'id' : 33, 'nama': '690'},
                {'id' : 34, 'nama': '720'},
                {'id' : 35, 'nama': '750'},
                {'id' : 36, 'nama': '780'},
                {'id' : 37, 'nama': '810'},
                {'id' : 38, 'nama': '840'},
                {'id' : 39, 'nama': '870'},
                {'id' : 40, 'nama': '900'},
                {'id' : 41, 'nama': '930'},
            ];

            $scope.listKetuban = [
                {'id': 42, 'type' : 'satu'},
                {'id': 43, 'type' : 'satu'},
                {'id': 44, 'type' : 'satu'},
                {'id': 45, 'type' : 'satu'},
                {'id': 46, 'type' : 'satu'},
                {'id': 47, 'type' : 'satu'},
                {'id': 48, 'type' : 'satu'},
                {'id': 49, 'type' : 'satu'},
                {'id': 50, 'type' : 'satu'},
                {'id': 51, 'type' : 'satu'},
                {'id': 52, 'type' : 'satu'},
                {'id': 53, 'type' : 'satu'},
                {'id': 54, 'type' : 'satu'},
                {'id': 55, 'type' : 'satu'},
                {'id': 56, 'type' : 'satu'},
                {'id': 57, 'type' : 'satu'},
            ]

            $scope.listKetuban2 = [
                {'id': 58, 'type' : 'dua'},
                {'id': 59, 'type' : 'dua'},
                {'id': 60, 'type' : 'dua'},
                {'id': 61, 'type' : 'dua'},
                {'id': 62, 'type' : 'dua'},
                {'id': 63, 'type' : 'dua'},
                {'id': 64, 'type' : 'dua'},
                {'id': 65, 'type' : 'dua'},
                {'id': 66, 'type' : 'dua'},
                {'id': 67, 'type' : 'dua'},
                {'id': 68, 'type' : 'dua'},
                {'id': 69, 'type' : 'dua'},
                {'id': 70, 'type' : 'dua'},
                {'id': 71, 'type' : 'dua'},
                {'id': 72, 'type' : 'dua'},
                {'id': 73, 'type' : 'dua'},
            ]

            $scope.listPembukaan = []
            $scope.listPembukaan1 = []
            $scope.listPembukaan2 = []
            $scope.listPembukaan3 = []
            $scope.listPembukaan4 = []
            $scope.listPembukaan5 = []
            $scope.listPembukaan6 = []
            $scope.listPembukaan7 = []
            $scope.listPembukaan8 = []
            $scope.listPembukaan9 = []
            $scope.listPembukaan10 = []
            
            for ( let xp = 74; xp <= 425; xp++) {
                if(xp <= 105) {
                    $scope.listPembukaan10.push({ 'id': xp, 'type': '10', 'text': '' })
                } else if (xp > 105 && xp <= 137) {
                    $scope.listPembukaan9.push({ 'id': xp, 'type': '9', 'text': '' })
                } else if (xp > 137 && xp <= 169) {
                    $scope.listPembukaan8.push({ 'id': xp, 'type': '8', 'text': '' })
                } else if (xp > 169 && xp <= 201) {
                    $scope.listPembukaan7.push({ 'id': xp, 'type': '7', 'text': '' })
                } else if (xp > 201 && xp <= 233) {
                    $scope.listPembukaan6.push({ 'id': xp, 'type': '6', 'text': '' })
                } else if (xp > 233 && xp <= 265) {
                    $scope.listPembukaan5.push({ 'id': xp, 'type': '5', 'text': '' })
                } else if (xp > 265 && xp <= 297) {
                    $scope.listPembukaan4.push({ 'id': xp, 'type': '4', 'text': '' })
                } else if (xp > 297 && xp <= 329) {
                    $scope.listPembukaan3.push({ 'id': xp, 'type': '3', 'text': '' })
                } else if (xp > 329 && xp <= 361) {
                    $scope.listPembukaan2.push({ 'id': xp, 'type': '2', 'text': '' })
                } else if (xp > 361 && xp <= 393) {
                    $scope.listPembukaan1.push({ 'id': xp, 'type': '1', 'text': '' })
                } else if (xp > 393) {
                    if(xp % 2 == 0) {
                        $scope.listPembukaan.push({ 'id': xp, 'type': 'label', 'text': 'X' })
                    } else {
                        $scope.listPembukaan.push({ 'id': xp, 'type': 'label', 'text': 'O' })
                    }
                    
                }
                
            }
            

            $scope.listJam1 = []
            for ( let jp = 426; jp <= 441; jp++) {
                $scope.listJam1.push({ 'id': jp, 'nama': 'jam'+jp})
            }
            var style1 = 'background-color: white; width:40px';
            var style2 = 'display : none'
            var style3 = 'display : inline-dlex;'
            var style4 = `background-color: #ffffff; width:40px;
                        background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`
            var style5 = `background-color: #ffffff; width:40px;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
            var style6 = 'background-color: #000000; width:40px'

            
            $scope.listKonstraksi1 = []
            for ( let lk = 442; lk <= 473; lk++) {
                $scope.listKonstraksi1.push({ 'id': lk, 'nama': 'kst'+lk, 'style' : style1, 'style2' : style2})
            }

            $scope.listKonstraksi2 = []
            for ( let lk = 474; lk <= 505; lk++) {
                $scope.listKonstraksi2.push({ 'id': lk, 'nama': 'kst'+lk, 'style' : style1, 'style2' : style2})
            }

            $scope.listKonstraksi3 = []
            for ( let lk = 506; lk <= 537; lk++) {
                $scope.listKonstraksi3.push({ 'id': lk, 'nama': 'kst'+lk, 'style' : style1, 'style2' : style2})
            }

            $scope.listKonstraksi4 = []
            for ( let lk = 538; lk <= 569; lk++) {
                $scope.listKonstraksi4.push({ 'id': lk, 'nama': 'kst'+lk, 'style' : style1, 'style2' : style2})
            }

            $scope.listKonstraksi5 = []
            for ( let lk = 570; lk <= 601; lk++) {
                $scope.listKonstraksi5.push({ 'id': lk, 'nama': 'kst'+lk, 'style' : style1, 'style2' : style2})
            }

            $scope.listOksitosin = [
                {
                    "id": 1, "nama": "Baris 1", "detail":
                        [
                            { "id": 602, "nama": "Jam", "type": "textbox" },
                            { "id": 603, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 604, "nama": "Tetes", "type": "textbox" },
                        ]
                },
                {
                    "id": 2, "nama": "Baris 2", "detail":
                        [
                            { "id": 605, "nama": "Jam", "type": "textbox" },
                            { "id": 606, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 607, "nama": "Tetes", "type": "textbox" },
                        ]
                },
                {
                    "id": 3, "nama": "Baris 3", "detail":
                        [
                            { "id": 608, "nama": "Jam", "type": "textbox" },
                            { "id": 609, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 610, "nama": "Tetes", "type": "textbox" },
                        ]
                },
                {
                    "id": 4, "nama": "Baris 4", "detail":
                        [
                            { "id": 611, "nama": "Jam", "type": "textbox" },
                            { "id": 612, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 613, "nama": "Tetes", "type": "textbox" },
                        ]
                },
                {
                    "id": 5, "nama": "Baris 5", "detail":
                        [
                            { "id": 614, "nama": "Jam", "type": "textbox" },
                            { "id": 615, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 616, "nama": "Tetes", "type": "textbox" },
                        ]
                },
                {
                    "id": 6, "nama": "Baris 6", "detail":
                        [
                            { "id": 627, "nama": "Jam", "type": "textbox" },
                            { "id": 628, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 629, "nama": "Tetes", "type": "textbox" },
                        ]
                },
                {
                    "id": 7, "nama": "Baris 7", "detail":
                        [
                            { "id": 630, "nama": "Jam", "type": "textbox" },
                            { "id": 631, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 632, "nama": "Tetes", "type": "textbox" },
                        ]
                },
                {
                    "id": 8, "nama": "Baris 8", "detail":
                        [
                            { "id": 633, "nama": "Jam", "type": "textbox" },
                            { "id": 634, "nama": "Oksitosin", "type": "textbox" },
                            { "id": 635, "nama": "Tetes", "type": "textbox" },
                        ]
                }
            ]


            $scope.listObat = [
                {
                    "id": 1, "nama": "Baris 1", "detail":
                        [
                            { "id": 617, "nama": "Jam", "type": "textbox" },
                            { "id": 618, "nama": "Obat", "type": "textare" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 1", "detail":
                        [
                            { "id": 619, "nama": "Jam", "type": "textbox" },
                            { "id": 620, "nama": "Obat", "type": "textare" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 1", "detail":
                        [
                            { "id": 621, "nama": "Jam", "type": "textbox" },
                            { "id": 622, "nama": "Obat", "type": "textare" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 1", "detail":
                        [
                            { "id": 623, "nama": "Jam", "type": "textbox" },
                            { "id": 624, "nama": "Obat", "type": "textare" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 1", "detail":
                        [
                            { "id": 625, "nama": "Jam", "type": "textbox" },
                            { "id": 626, "nama": "Obat", "type": "textare" },
                        ]
                },
            ]

            $scope.listNadi1 = []
            for ( let lk = 636; lk <= 651; lk++) {
                $scope.listNadi1.push({ 'id': lk, 'nama': 'nadi1'+lk})
            }

            $scope.listNadi2 = []
            for ( let lk = 652; lk <= 667; lk++) {
                $scope.listNadi2.push({ 'id': lk, 'nama': 'nadi2'+lk})
            }

            $scope.listNadi3 = []
            for ( let lk = 668; lk <= 683; lk++) {
                $scope.listNadi3.push({ 'id': lk, 'nama': 'nadi3'+lk})
            }

            $scope.listNadi4 = []
            for ( let lk = 684; lk <= 699; lk++) {
                $scope.listNadi4.push({ 'id': lk, 'nama': 'nadi4'+lk})
            }

            $scope.listTd1 = []
            for ( let lk = 700; lk <= 715; lk++) {
                $scope.listTd1.push({ 'id': lk, 'nama': 'td1'+lk})
            }

            $scope.listTd2 = []
            for ( let lk = 716; lk <= 731; lk++) {
                $scope.listTd2.push({ 'id': lk, 'nama': 'td2'+lk})
            }

            $scope.listSuhu1 = []
            for ( let lk = 732; lk <= 747; lk++) {
                $scope.listSuhu1.push({ 'id': lk, 'nama': 'suhu1'+lk})
            }

            $scope.listSuhu2 = []
            for ( let lk = 748; lk <= 763; lk++) {
                $scope.listSuhu2.push({ 'id': lk, 'nama': 'suhu2'+lk})
            }
            
            $scope.listUrin = [
                {
                    "id": 1, "nama": "Baris 1", "detail":
                        [
                            { "id": 764, "nama": "Jam", "type": "textbox" },
                            { "id": 765, "nama": "Volume", "type": "textbox" },
                            { "id": 766, "nama": "Protein", "type": "textbox" },
                            { "id": 767, "nama": "Aseton", "type": "textbox" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 2", "detail":
                        [
                            { "id": 768, "nama": "Jam", "type": "textbox" },
                            { "id": 769, "nama": "Volume", "type": "textbox" },
                            { "id": 770, "nama": "Protein", "type": "textbox" },
                            { "id": 771, "nama": "Aseton", "type": "textbox" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 3", "detail":
                        [
                            { "id": 772, "nama": "Jam", "type": "textbox" },
                            { "id": 773, "nama": "Volume", "type": "textbox" },
                            { "id": 774, "nama": "Protein", "type": "textbox" },
                            { "id": 775, "nama": "Aseton", "type": "textbox" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 4", "detail":
                        [
                            { "id": 776, "nama": "Jam", "type": "textbox" },
                            { "id": 777, "nama": "Volume", "type": "textbox" },
                            { "id": 778, "nama": "Protein", "type": "textbox" },
                            { "id": 779, "nama": "Aseton", "type": "textbox" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 5", "detail":
                        [
                            { "id": 780, "nama": "Jam", "type": "textbox" },
                            { "id": 781, "nama": "Volume", "type": "textbox" },
                            { "id": 782, "nama": "Protein", "type": "textbox" },
                            { "id": 783, "nama": "Aseton", "type": "textbox" },
                        ]
                },
                {
                    "id": 1, "nama": "Baris 6", "detail":
                        [
                            { "id": 784, "nama": "Jam", "type": "textbox" },
                            { "id": 785, "nama": "Volume", "type": "textbox" },
                            { "id": 786, "nama": "Protein", "type": "textbox" },
                            { "id": 787, "nama": "Aseton", "type": "textbox" },
                        ]
                },
            ]
            
            
            let indexSelectedItem = -1
            $scope.showInput = function (id) {
                let dataTarget      = $scope.listKonstraksi1.filter((lks) => (lks.id === id))[0]
                indexSelectedItem   = $scope.listKonstraksi1.indexOf(dataTarget)
                $scope.listKonstraksi1[indexSelectedItem].style2 = style3
                indexSelectedItem = -1
            }

            let indexInputItem = -1
            $scope.setBg = function (id) {
                let dataTarget      = $scope.listKonstraksi1.filter((lks) => (lks.id === id))[0]
                indexInputItem      = $scope.listKonstraksi1.indexOf(dataTarget)
                debugger
                if ($scope.item.obj[id] == 1)  {
                    $scope.listKonstraksi1[indexInputItem].style = style5
                    $scope.listKonstraksi1[indexInputItem].style2 = style2
                } else if ( $scope.item.obj[id] == 2) {
                    $scope.listKonstraksi1[indexInputItem].style = style4
                    $scope.listKonstraksi1[indexInputItem].style2 = style2
                } else if ($scope.item.obj[id] == 3) {
                    $scope.listKonstraksi1[indexInputItem].style = style6
                    $scope.listKonstraksi1[indexInputItem].style2 = style2
                } else if ($scope.item.obj[id] > 3) {
                    window.messageContainer.error("Inputan salah, anda hanya bisa mengingput angka 1, 2 dan 3 sesuai petunjuk !");
                    $scope.item.obj[id] = ''
                    $scope.listKonstraksi1[indexInputItem].style = style1
                    $scope.listKonstraksi1[indexInputItem].style2 = style2
                } else {
                    $scope.listKonstraksi1[indexInputItem].style = style1
                    $scope.listKonstraksi1[indexInputItem].style2 = style2
                }
                indexInputItem = -1
            }

            let indexSelectedItem2 = -1
            $scope.showInput2 = function (id) {
                let dataTarget      = $scope.listKonstraksi2.filter((lks) => (lks.id === id))[0]
                indexSelectedItem2   = $scope.listKonstraksi2.indexOf(dataTarget)
                $scope.listKonstraksi2[indexSelectedItem2].style2 = style3
                indexSelectedItem2 = -1
            }

            let indexInputItem2 = -1
            $scope.setBg2 = function (id) {
                let dataTarget      = $scope.listKonstraksi2.filter((lks) => (lks.id === id))[0]
                indexInputItem2      = $scope.listKonstraksi2.indexOf(dataTarget)

                if ($scope.item.obj[id] == 1)  {
                    $scope.listKonstraksi2[indexInputItem2].style = style5
                    $scope.listKonstraksi2[indexInputItem2].style2 = style2
                } else if ( $scope.item.obj[id] == 2) {
                    $scope.listKonstraksi2[indexInputItem2].style = style4
                    $scope.listKonstraksi2[indexInputItem2].style2 = style2
                } else if ($scope.item.obj[id] == 3) {
                    $scope.listKonstraksi2[indexInputItem2].style = style6
                    $scope.listKonstraksi2[indexInputItem2].style2 = style2
                } else if ($scope.item.obj[id] > 3) {
                    window.messageContainer.error("Inputan salah, anda hanya bisa mengingput angka 1, 2 dan 3 sesuai petunjuk !");
                    $scope.item.obj[id] = ''
                    $scope.listKonstraksi2[indexInputItem2].style = style1
                    $scope.listKonstraksi2[indexInputItem2].style2 = style2
                } else {
                    $scope.listKonstraksi2[indexInputItem2].style = style1
                    $scope.listKonstraksi2[indexInputItem2].style2 = style2
                }
                indexInputItem2 = -1
            }


            let indexSelectedItem3 = -1
            $scope.showInput3 = function (id) {
                let dataTarget      = $scope.listKonstraksi3.filter((lks) => (lks.id === id))[0]
                indexSelectedItem3   = $scope.listKonstraksi3.indexOf(dataTarget)
                $scope.listKonstraksi3[indexSelectedItem3].style2 = style3
                indexSelectedItem3 = -1
            }

            let indexInputItem3 = -1
            $scope.setBg3 = function (id) {
                let dataTarget      = $scope.listKonstraksi3.filter((lks) => (lks.id === id))[0]
                indexInputItem3      = $scope.listKonstraksi3.indexOf(dataTarget)

                if ($scope.item.obj[id] == 1)  {
                    $scope.listKonstraksi3[indexInputItem3].style = style5
                    $scope.listKonstraksi3[indexInputItem3].style2 = style2
                } else if ( $scope.item.obj[id] == 2) {
                    $scope.listKonstraksi3[indexInputItem3].style = style4
                    $scope.listKonstraksi3[indexInputItem3].style2 = style2
                } else if ($scope.item.obj[id] == 3) {
                    $scope.listKonstraksi3[indexInputItem3].style = style6
                    $scope.listKonstraksi3[indexInputItem3].style2 = style2
                } else if ($scope.item.obj[id] > 3) {
                    window.messageContainer.error("Inputan salah, anda hanya bisa mengingput angka 1, 2 dan 3 sesuai petunjuk !");
                    $scope.item.obj[id] = ''
                    $scope.listKonstraksi3[indexInputItem3].style = style1
                    $scope.listKonstraksi3[indexInputItem3].style2 = style2
                } else {
                    $scope.listKonstraksi3[indexInputItem3].style = style1
                    $scope.listKonstraksi3[indexInputItem3].style2 = style2
                }
                indexInputItem3 = -1
            }


            let indexSelectedItem4 = -1
            $scope.showInput4 = function (id) {
                let dataTarget      = $scope.listKonstraksi4.filter((lks) => (lks.id === id))[0]
                indexSelectedItem4   = $scope.listKonstraksi4.indexOf(dataTarget)
                $scope.listKonstraksi4[indexSelectedItem4].style2 = style3
                indexSelectedItem4 = -1
            }

            let indexInputItem4 = -1
            $scope.setBg4 = function (id) {
                let dataTarget      = $scope.listKonstraksi4.filter((lks) => (lks.id === id))[0]
                indexInputItem4      = $scope.listKonstraksi4.indexOf(dataTarget)

                if ($scope.item.obj[id] == 1)  {
                    $scope.listKonstraksi4[indexInputItem4].style = style5
                    $scope.listKonstraksi4[indexInputItem4].style2 = style2
                } else if ( $scope.item.obj[id] == 2) {
                    $scope.listKonstraksi4[indexInputItem4].style = style4
                    $scope.listKonstraksi4[indexInputItem4].style2 = style2
                } else if ($scope.item.obj[id] == 3) {
                    $scope.listKonstraksi4[indexInputItem4].style = style6
                    $scope.listKonstraksi4[indexInputItem4].style2 = style2
                } else if ($scope.item.obj[id] > 3) {
                    window.messageContainer.error("Inputan salah, anda hanya bisa mengingput angka 1, 2 dan 3 sesuai petunjuk !");
                    $scope.item.obj[id] = ''
                    $scope.listKonstraksi4[indexInputItem4].style = style1
                    $scope.listKonstraksi4[indexInputItem4].style2 = style2
                } else {
                    $scope.listKonstraksi4[indexInputItem4].style = style1
                    $scope.listKonstraksi4[indexInputItem4].style2 = style2
                }
                indexInputItem4 = -1
            }


            let indexSelectedItem5 = -1
            $scope.showInput5 = function (id) {
                let dataTarget      = $scope.listKonstraksi5.filter((lks) => (lks.id === id))[0]
                indexSelectedItem5   = $scope.listKonstraksi5.indexOf(dataTarget)
                $scope.listKonstraksi5[indexSelectedItem5].style2 = style3
                indexSelectedItem5 = -1
            }

            let indexInputItem5 = -1
            $scope.setBg5 = function (id) {
                let dataTarget      = $scope.listKonstraksi5.filter((lks) => (lks.id === id))[0]
                indexInputItem5      = $scope.listKonstraksi5.indexOf(dataTarget)

                if ($scope.item.obj[id] == 1)  {
                    $scope.listKonstraksi5[indexInputItem5].style = style5
                    $scope.listKonstraksi5[indexInputItem5].style2 = style2
                } else if ( $scope.item.obj[id] == 2) {
                    $scope.listKonstraksi5[indexInputItem5].style = style4
                    $scope.listKonstraksi5[indexInputItem5].style2 = style2
                } else if ($scope.item.obj[id] == 3) {
                    $scope.listKonstraksi5[indexInputItem5].style = style6
                    $scope.listKonstraksi5[indexInputItem5].style2 = style2
                } else if ($scope.item.obj[id] > 3) {
                    window.messageContainer.error("Inputan salah, anda hanya bisa mengingput angka 1, 2 dan 3 sesuai petunjuk !");
                    $scope.item.obj[id] = ''
                    $scope.listKonstraksi5[indexInputItem5].style = style1
                    $scope.listKonstraksi5[indexInputItem5].style2 = style2
                } else {
                    $scope.listKonstraksi5[indexInputItem5].style = style1
                    $scope.listKonstraksi5[indexInputItem5].style2 = style2
                }
                indexInputItem5 = -1
            }

            
            function loadChart() {
                $("#chartJantung").kendoChart({
                    
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: sesiesJantung,
                            name: "Jantung Janin",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "Jantung Janin / Menit" },
                        min: 80,
                        max: 200,
                        majorUnit: 10
                    },
                        
                    ],
                    categoryAxis: {
                        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartNadi").kendoChart({
                    
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesNadi,
                            name: "Nadi",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "Nadi / Menit" },
                        min: 80,
                        max: 200,
                        majorUnit: 10
                    },
                        
                    ],
                    categoryAxis: {
                        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartTd").kendoChart({
                    
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesTd,
                            name: "Tekanan Darah",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "Tekanan Darah / Menit" },
                        min: 10,
                        max: 200,
                        majorUnit: 20
                    },
                        
                    ],
                    categoryAxis: {
                        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],

                        axisCrossingValues: [0, 35]
                    }
                });
                $("#chartSuhu").kendoChart({
                    
                    title: {
                        text: "Grafik Suhu"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: seriesSuhu,
                        name: "Suhu",
                        color: "#0328fc",

                    }
                        
                    ],
                    valueAxes: [
                        
                        {
                            title: { text: "Suhu Tubuh" },
                            min: 32,
                            max: 42,
                            majorUnit: 1
                        }
                    ],
                    categoryAxis: {
                        categories: [ 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24, 6, 12, 18, 24],

                        axisCrossingValues: [0, 35]
                    }
                });
            }
            
           

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
                    $scope.cc.jenisemr = "partograf"
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    init()
                }
            }

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=partograf", true).then(function(dat) {
                    $scope.isRouteLoading = false
                    if (dat.data.data.length > 0) {
                        $scope.noemr = dat.data.data[0].noemr
                        $scope.cc.norec_emr = dat.data.data[0].noemr
                        nomorEMRSS = ''
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
    
                        }
                        nomorEMRSS = dat.data.data[0].noemr
                        nomorEMR = nomorEMRSS
                        $scope.cc.emrfk = 2018;
                        setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } 
                })
            }

            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-partograf-wirasakti?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isLoading = false
                    var chekedd = false
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    // $scope.item.obj[68] = $scope.now
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
    
                            if (dataLoad[i].type == "textbox") {
                                if(dataLoad[i].emrdfk == 2) {
                                    $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                } else {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value

                                    if(dataLoad[i].emrdfk >= 442 && dataLoad[i].emrdfk <= 473) {
                                        $scope.setBg(dataLoad[i].emrdfk)
                                    } else if (dataLoad[i].emrdfk >= 474 && dataLoad[i].emrdfk <= 505) {
                                        $scope.setBg2(dataLoad[i].emrdfk)
                                    } else if (dataLoad[i].emrdfk >= 506 && dataLoad[i].emrdfk <= 537) {
                                        $scope.setBg3(dataLoad[i].emrdfk)
                                    } else if (dataLoad[i].emrdfk >= 538 && dataLoad[i].emrdfk <= 569) {
                                        $scope.setBg4(dataLoad[i].emrdfk)
                                    } else if (dataLoad[i].emrdfk >= 570 && dataLoad[i].emrdfk <= 601) {
                                        $scope.setBg5(dataLoad[i].emrdfk)
                                    }
                                }
                            }
                        }
    
                    }

                    var arrobj = Object.keys($scope.item.obj)

                    for (var i = arrobj.length - 1; i >= 0; i--) {

                        for (let z = 0; z < 31; z++) {
                            if (arrobj[i] == 10 + z)
                            sesiesJantung[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        } 

                        for (let z = 0; z < 16; z++) {
                            if (arrobj[i] == 652 + z)
                            seriesNadi[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        }

                        for (let z = 0; z < 16; z++) {
                            if (arrobj[i] == 684 + z)
                            seriesNadi[z+16] = $scope.item.obj[parseFloat(arrobj[i])]
                        }

                        for (let z = 0; z < 16; z++) {
                            if (arrobj[i] == 716 + z)
                            seriesTd[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        }

                        for (let z = 0; z < 16; z++) {
                            if (arrobj[i] == 748 + z)
                            seriesSuhu[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        }
                        
                    }

                    console.log(seriesNadi)
                    loadChart()
                })
            }

            
            

            $scope.Batal = function () {
                $scope.item.obj = []
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                var user = medifirstService.getPegawaiLogin();

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'partograf'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    init()
                    var jsonLog = {
                        'jenislog': 'Simpan Pengkajian Partograf',
                        'referensi': 'noregistrasi',
                        'noreff': $scope.cc.noregistrasi,
                        'keterangan': 'Simpan Pengkajian Partograf ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi,
                        'data': arrSave,
                        'jenisemr': $scope.cc.jenisemr,
                        'emrfk': $scope.cc.emrfk
                    }
                    medifirstService.postLoggingEMR(jsonLog).then(function(e) {
                        
                    })

                });
            }

        }
    ]);
});