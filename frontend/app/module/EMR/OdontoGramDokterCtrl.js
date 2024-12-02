define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OdontoGramDokterCtrl', ['$mdDialog', '$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$window', '$location',
        function ($mdDialog,$q, $rootScope, $scope, medifirstService, $state, cacheHelper, $window, $location) {
            //kangge atur resolusi
            /*if (window.location.href != $location.$$absUrl) {
                window.location.href = $location.$$absUrl
                window.location.reload()
            }*/

            $scope.item = {};
            $scope.dataVOloaded = false;
            $scope.now = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            var nomorEMRSS = '';
            var nomorEMR = '-'
            var paramSearch = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            var dokter = '';
            var idUser = '';
            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var detail = ''
            $scope.cc = {}

            var lanjut = false;
            $scope.cc.emrfk = 100
            var data2 = []
            var isianColor = "white"
            var kdColorKaries = "#B8B7B7"
            var kdColorTambalanLogam = "#000000"
            var kdColorTambalanNonLogam = "#82D9D9"
            var kdColorMahkotaLogam = "#014C0A"
            var kdColorMerah = "Red"
            var kdColorMahkotaNonLogam = "#40F5F9"
            var typeIsian = ""

            //-----------------------------------------
            var kdColorTambalanAmalgam = "#000000"
            var kdColorTambalanComposite = "#33a909"
            var kdColorFissureSealant = "#d36596"
            var kdColorNormal = "#ffffff"
            var kdColorLogamEmas = "#f30505"
            //-----------------------------------------

            var dataLoad = []
            $scope.item.obj = []

            
            //-----------------------------------------
            $scope.TambalanAmalgam = function () {
                isianColor = kdColorTambalanAmalgam
                typeIsian = "selai"
                $scope.activeStatus =50
            }
            $scope.TambalanGIF = function () {
                isianColor = kdColorTambalanComposite
                typeIsian = "selai"
                $scope.activeStatus =51
            }
            $scope.FissureSealant = function () {
                isianColor = kdColorFissureSealant
                typeIsian = "selai"
                $scope.activeStatus =52
            }
            $scope.GigiNonVital = function () {
                typeIsian = "nonvital"
                $scope.activeStatus =53
            }
            $scope.RCT = function () {
                typeIsian = "rct"
                $scope.activeStatus =54
            }
            $scope.NON = function () {
                typeIsian = "non"
                $scope.activeStatus =55
            }
            $scope.UNE = function () {
                typeIsian = "une"
                $scope.activeStatus =56
            }
            $scope.PRE = function () {
                typeIsian = "pre"
                $scope.activeStatus =57
            }
            $scope.Normal = function () {
                isianColor = kdColorNormal
                typeIsian = "selai"
                $scope.activeStatus =58
            }
            $scope.Anomali = function () {
                typeIsian = "ano"
                $scope.activeStatus =59
            }
            $scope.Caries = function () {
                isianColor = kdColorNormal
                typeIsian = "caries"
                $scope.activeStatus = 60
            }
            $scope.Fracture = function () {
                typeIsian = "fracture"
                $scope.activeStatus = 61
            }
            $scope.FMC = function () {
                isianColor = kdColorNormal
                typeIsian = "fmc"
                $scope.activeStatus = 62
            }
            $scope.POC = function () {
                typeIsian = "poc"
                $scope.activeStatus = 63
            }
            $scope.SisaAkar = function () {
                typeIsian = "SisaAkar"
                $scope.activeStatus = 64
            }
            $scope.MIS = function () {
                typeIsian = "mis"
                $scope.activeStatus = 65
            }
            $scope.IPX = function () {
                typeIsian = "ipx"
                $scope.activeStatus =66
            }
            $scope.GigiNonVitalAtas = function () {
                typeIsian = "nonvitalatas"
                $scope.activeStatus =67
            }
            $scope.RCTAtas = function () {
                typeIsian = "rctatas"
                $scope.activeStatus =68
            }
            $scope.PRD = function () {
                typeIsian = "prd"
                $scope.activeStatus =69
            }
            $scope.FLD = function () {
                typeIsian = "fld"
                $scope.activeStatus =70
            }
            //jembatan
            
            $scope.Jembatan1 = function () {
                typeIsian = "jembatan1"
                $scope.activeStatus =71
            }
            $scope.Jembatan2 = function () {
                typeIsian = "jembatan2"
                $scope.activeStatus =72
            }
            $scope.Jembatan3 = function () {
                typeIsian = "jembatan3"
                $scope.activeStatus =73
            }

            
            $scope.IMX = function () {
                typeIsian = "imx"
                $scope.activeStatus =74
            }
            $scope.MPM = function () {
                typeIsian = "mpm"
                $scope.activeStatus =75
            }

            
            $scope.TambalanLogamEmas = function () {
                isianColor = kdColorLogamEmas
                typeIsian = "selai"
                $scope.activeStatus =76
            }
            $scope.TambalanComposite = function () {
                typeIsian = "composite"
                $scope.activeStatus =77
            }

            
            $scope.PanahKiri = function () {
                typeIsian = "panahkiri"
                $scope.activeStatus =78
            }

            
            $scope.PanahKanan = function () {
                typeIsian = "panahkanan"
                $scope.activeStatus =79
            }

            
            $scope.RotasiKananAtas = function () {
                typeIsian = "rotasikananatas"
                $scope.activeStatus =80
            }
            $scope.RotasiKananBawah = function () {
                typeIsian = "rotasikananbawah"
                $scope.activeStatus =81
            }
            $scope.RotasiKiriAtas = function () {
                typeIsian = "rotasikiriatas"
                $scope.activeStatus =82
            }
            $scope.RotasiKiriBawah = function () {
                typeIsian = "rotasikiribawah"
                $scope.activeStatus =83
            }
            //-----------------------------------------





            /*$scope.BelumErupsi = function () {
                typeIsian = "UE"
                $scope.activeStatus =1
            }
            $scope.ErupsiSebagian = function () {
                typeIsian = "PE"
                $scope.activeStatus =2
            }
            $scope.AnomaliBentuk = function () {
                typeIsian = "A"
                $scope.activeStatus =3
            }
            $scope.NonVital = function () {
                typeIsian = "/"
                $scope.activeStatus =13
                
            }
            $scope.Karies = function () {
                isianColor = kdColorKaries
                typeIsian = "selai"
                $scope.activeStatus =4
            }
            $scope.TambalanLogam = function () {
                isianColor = kdColorTambalanLogam
                typeIsian = "selai"
                $scope.activeStatus =5
            }
            $scope.TambalanNonLogam = function () {
                isianColor = kdColorTambalanNonLogam
                typeIsian = "selai"
                $scope.activeStatus =6
            }
            $scope.MahkotaLogam = function () {
                isianColor = kdColorMahkotaLogam
                typeIsian = "selai"
                $scope.activeStatus =7
            }
            $scope.mahkotaNonLogam = function () {
                isianColor = kdColorMahkotaNonLogam
                typeIsian = "selai"
                $scope.activeStatus =8
            }
            $scope.SisaAkar = function () {
                typeIsian = "SisaAkar"
                $scope.activeStatus =9
            }
            $scope.gigiHilang = function () {
                typeIsian = "gigiHilang"
                $scope.activeStatus =10
            }
            $scope.Jembatan = function () {
                typeIsian = "Jembatan"
                $scope.activeStatus =11
            }
            $scope.GigiTiruanLepas = function () {
                typeIsian = "GigiTiruanLepas"
                $scope.activeStatus =12
            }
            $scope.GigiTiruanLepas2 = function () {
                typeIsian = "GigiTiruanLepas2"
                $scope.activeStatus = 15
            }
            $scope.GigiTiruanLepas3 = function () {
                typeIsian = "GigiTiruanLepas3"
                $scope.activeStatus = 16
            }

            $scope.GigiTiruanLepas4 = function () {
                isianColor = kdColorMerah;
                typeIsian = "selai"
                $scope.activeStatus = 17
            }
            $scope.buleud = function () { 
                typeIsian = "GigiTiruanLepas4"
                $scope.activeStatus = 18
            } 
            $scope.kali = function () {
                isianColor = kdColorMerah;
                typeIsian = "kali"
                $scope.activeStatus = 19
            }
            $scope.ipx = function () {
                typeIsian = "ipx"
                $scope.activeStatus = 20
            }

            $scope.segitiga = function () {
                typeIsian = "segitiga"
                $scope.activeStatus = 21
            }
            $scope.segitiga2 = function () {
                typeIsian = "segitiga2"
                $scope.activeStatus = 22
            }

            $scope.sambungakar = function () {
                typeIsian = "sambungakar"
                $scope.activeStatus = 23
            }

            $scope.sambungakar2 = function () {
                typeIsian = "sambungakar2"
                $scope.activeStatus = 24
            }

            $scope.non = function () {
                typeIsian = "non"
                $scope.activeStatus = 25
            }
            $scope.metal = function () {
                typeIsian = "metal"
                $scope.activeStatus = 26
            }

            $scope.pager = function () {
                typeIsian = "pager"
                $scope.activeStatus = 27
            }
            $scope.segitigabawah = function () {
                typeIsian = "segitigabawah"
                $scope.activeStatus = 28
            }

            $scope.v = function () {
                typeIsian = "v"
                $scope.activeStatus = 29
            }*/
            $scope.Clear = function () {
                isianColor = "white"
                typeIsian = "selai"
                $scope.activeStatus =14
            }

            //{//load kotak-kotak tea as@epic 2019-03-07
            var elem = document.getElementById('myCanvas'),
                elemLeft = elem.offsetLeft,
                elemTop = elem.offsetTop,
                context = elem.getContext('2d'),
                //context2 = elem.getContext('2d'),
                elements = [];



            // Add event listener for `click` events.
            elem.addEventListener('click', function (event) {
                var x = event.pageX - elemLeft,
                    y = event.pageY - elemTop;
                console.log('x:' + x + ' y:' + y);
                console.log('page x:' + event.pageX + ' y:' + event.pageY);
                console.log('elem x:' + elemLeft + ' y:' + elemTop);
                elements.forEach(function (element) {
                    if (y > element.top + 110 && y < element.top + 110 + element.height && x > element.left && x < element.left + element.width) {
                        
                        console.log('elem x:' + element.left + ' y:' + element.top + ' width:' + element.width + ' height:' + element.height);
                        isiColor(element)
                    }
                });

            }, false);

            var listSrc = [
                { id: 1, no: '18' },
                { id: 2, no: '17' },
                { id: 3, no: '16' },
                { id: 4, no: '15' },
                { id: 5, no: '14' },
                { id: 6, no: '13' },
                { id: 7, no: '12' },
                { id: 8, no: '11' },

                { id: 9, no: '21' },
                { id: 10, no: '22' },
                { id: 11, no: '23' },
                { id: 12, no: '24' },
                { id: 13, no: '25' },
                { id: 14, no: '26' },
                { id: 15, no: '27' },
                { id: 16, no: '28' },

                { id: 17, no: '55' },
                { id: 18, no: '54' },
                { id: 19, no: '53' },
                { id: 20, no: '52' },
                { id: 21, no: '51' },

                { id: 22, no: '61' },
                { id: 23, no: '62' },
                { id: 24, no: '63' },
                { id: 25, no: '64' },
                { id: 26, no: '65' },

                { id: 27, no: '85' },
                { id: 28, no: '84' },
                { id: 29, no: '83' },
                { id: 30, no: '82' },
                { id: 31, no: '81' },

                { id: 32, no: '71' },
                { id: 33, no: '72' },
                { id: 34, no: '73' },
                { id: 35, no: '74' },
                { id: 36, no: '75' },

                { id: 37, no: '48' },
                { id: 38, no: '47' },
                { id: 39, no: '46' },
                { id: 40, no: '45' },
                { id: 41, no: '44' },
                { id: 42, no: '43' },
                { id: 43, no: '42' },
                { id: 44, no: '41' },

                { id: 45, no: '31' },
                { id: 46, no: '32' },
                { id: 47, no: '33' },
                { id: 48, no: '34' },
                { id: 49, no: '35' },
                { id: 50, no: '36' },
                { id: 51, no: '37' },
                { id: 52, no: '38' }
            ]



            var nextKotak = 0
            var besarKotak = 65
            var spc = 0
            var ididKlik = 0
            var idSrc = 0

            //sayur kol 1
            for (var i = 0; i < 16; i++) {
                if (i == 8) {
                    spc = 20
                }
                context.moveTo(40 + (i * besarKotak) + spc, 40);
                context.lineTo(100 + (i * besarKotak) + spc, 40);
                context.lineTo(100 + (i * besarKotak) + spc, 100);
                context.lineTo(40 + (i * besarKotak) + spc, 100);
                context.lineTo(40 + (i * besarKotak) + spc, 40);

                context.lineTo(55 + (i * besarKotak) + spc, 55);
                context.lineTo(55 + (i * besarKotak) + spc, 85);
                context.lineTo(40 + (i * besarKotak) + spc, 100);

                context.moveTo(55 + (i * besarKotak) + spc, 85);
                context.lineTo(85 + (i * besarKotak) + spc, 85);
                context.lineTo(100 + (i * besarKotak) + spc, 100);

                context.moveTo(85 + (i * besarKotak) + spc, 85);
                context.lineTo(85 + (i * besarKotak) + spc, 55);
                context.lineTo(100 + (i * besarKotak) + spc, 40);

                context.moveTo(85 + (i * besarKotak) + spc, 55);
                context.lineTo(55 + (i * besarKotak) + spc, 55);

                context.stroke();


                context.font = "20px Tahoma";
                context.fillStyle = "black";
                context.fillText(listSrc[idSrc].no, 57 + (i * besarKotak) + spc, 120);

                idSrc = idSrc + 1

                elements.push(
                    //A1
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 40, left: 55 + (i * besarKotak) + spc,
                        id: ididKlik + 1,
                        brs: 1, kol: i + 1, seg: 1
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 55, left: 85 + (i * besarKotak) + spc,
                        id: ididKlik + 2,
                        brs: 1, kol: i + 1, seg: 2
                    },
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 85, left: 55 + (i * besarKotak) + spc,
                        id: ididKlik + 3,
                        brs: 1, kol: i + 1, seg: 3
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 55, left: 40 + (i * besarKotak) + spc,
                        id: ididKlik + 4,
                        brs: 1, kol: i + 1, seg: 4
                    },
                    {
                        colour: 'yellow',
                        width: 30, height: 30,
                        top: 55, left: 55 + (i * besarKotak) + spc,
                        id: ididKlik + 5,
                        brs: 1, kol: i + 1, seg: 5
                    }
                );
                ididKlik = ididKlik + 5
            }

            spc = 0
            //sayur kol 2
            for (var i = 0; i < 10; i++) {
                if (i == 5) {
                    spc = 20
                }
                context.moveTo(235 + (i * besarKotak) + spc, 150);
                context.lineTo(235 + (i * besarKotak) + spc, 210);
                context.lineTo(295 + (i * besarKotak) + spc, 210);
                context.lineTo(295 + (i * besarKotak) + spc, 150);
                context.lineTo(235 + (i * besarKotak) + spc, 150);

                context.moveTo(235 + (i * besarKotak) + spc, 150);
                context.lineTo(250 + (i * besarKotak) + spc, 165);
                context.lineTo(250 + (i * besarKotak) + spc, 195);
                context.lineTo(235 + (i * besarKotak) + spc, 210);

                context.moveTo(250 + (i * besarKotak) + spc, 195);
                context.lineTo(280 + (i * besarKotak) + spc, 195);
                context.lineTo(295 + (i * besarKotak) + spc, 210);

                context.moveTo(280 + (i * besarKotak) + spc, 195);
                context.lineTo(280 + (i * besarKotak) + spc, 165);
                context.lineTo(295 + (i * besarKotak) + spc, 150);

                context.moveTo(280 + (i * besarKotak) + spc, 165);
                context.lineTo(250 + (i * besarKotak) + spc, 165);

                context.stroke();

                context.font = "20px Tahoma";
                context.fillStyle = "black";
                context.fillText(listSrc[idSrc].no, 252 + (i * besarKotak) + spc, 230);

                idSrc = idSrc + 1

                elements.push(
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 150, left: 250 + (i * besarKotak) + spc,
                        id: ididKlik + 1,
                        brs: 2, kol: i + 1, seg: 1
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 165, left: 280 + (i * besarKotak) + spc,
                        id: ididKlik + 2,
                        brs: 2, kol: i + 1, seg: 2
                    },
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 195, left: 250 + (i * besarKotak) + spc,
                        id: ididKlik + 3,
                        brs: 2, kol: i + 1, seg: 3
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 165, left: 235 + (i * besarKotak) + spc,
                        id: ididKlik + 4,
                        brs: 2, kol: i + 1, seg: 4
                    },
                    {
                        colour: 'yellow',
                        width: 30, height: 30,
                        top: 165, left: 250 + (i * besarKotak) + spc,
                        id: ididKlik + 5,
                        brs: 2, kol: i + 1, seg: 5
                    }
                );
                ididKlik = ididKlik + 5
            }

            spc = 0
            //sayur kol 3
            for (var i = 0; i < 10; i++) {
                if (i == 5) {
                    spc = 20
                }
                context.moveTo(235 + (i * besarKotak) + spc, 260);
                context.lineTo(235 + (i * besarKotak) + spc, 320);
                context.lineTo(295 + (i * besarKotak) + spc, 320);
                context.lineTo(295 + (i * besarKotak) + spc, 260);
                context.lineTo(235 + (i * besarKotak) + spc, 260);

                context.moveTo(235 + (i * besarKotak) + spc, 260);
                context.lineTo(250 + (i * besarKotak) + spc, 275);
                context.lineTo(250 + (i * besarKotak) + spc, 305);
                context.lineTo(235 + (i * besarKotak) + spc, 320);

                context.moveTo(250 + (i * besarKotak) + spc, 305);
                context.lineTo(280 + (i * besarKotak) + spc, 305);
                context.lineTo(295 + (i * besarKotak) + spc, 320);

                context.moveTo(280 + (i * besarKotak) + spc, 305);
                context.lineTo(280 + (i * besarKotak) + spc, 275);
                context.lineTo(295 + (i * besarKotak) + spc, 260);

                context.moveTo(280 + (i * besarKotak) + spc, 275);
                context.lineTo(250 + (i * besarKotak) + spc, 275);

                context.stroke();

                context.font = "20px Tahoma";
                context.fillStyle = "black";
                context.fillText(listSrc[idSrc].no, 252 + (i * besarKotak) + spc, 340);

                idSrc = idSrc + 1


                elements.push(
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 260, left: 250 + (i * besarKotak) + spc,
                        id: ididKlik + 1,
                        brs: 3, kol: i + 1, seg: 1
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 275, left: 280 + (i * besarKotak) + spc,
                        id: ididKlik + 2,
                        brs: 3, kol: i + 1, seg: 2
                    },
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 305, left: 250 + (i * besarKotak) + spc,
                        id: ididKlik + 3,
                        brs: 3, kol: i + 1, seg: 3
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 275, left: 235 + (i * besarKotak) + spc,
                        id: ididKlik + 4,
                        brs: 3, kol: i + 1, seg: 4
                    },
                    {
                        colour: 'yellow',
                        width: 30, height: 30,
                        top: 275, left: 250 + (i * besarKotak) + spc,
                        id: ididKlik + 5,
                        brs: 3, kol: i + 1, seg: 5
                    }
                );
                ididKlik = ididKlik + 5
            }

            spc = 0
            //sayur kol 4
            for (var i = 0; i < 16; i++) {
                if (i == 8) {
                    spc = 20
                }
                context.moveTo(40 + (i * besarKotak) + spc, 430);
                context.lineTo(100 + (i * besarKotak) + spc, 430);
                context.lineTo(100 + (i * besarKotak) + spc, 370);
                context.lineTo(40 + (i * besarKotak) + spc, 370);
                context.lineTo(40 + (i * besarKotak) + spc, 430);

                context.moveTo(40 + (i * besarKotak) + spc, 370);
                context.lineTo(55 + (i * besarKotak) + spc, 385);
                context.lineTo(55 + (i * besarKotak) + spc, 415);
                context.lineTo(40 + (i * besarKotak) + spc, 430);

                context.moveTo(55 + (i * besarKotak) + spc, 415);
                context.lineTo(85 + (i * besarKotak) + spc, 415);
                context.lineTo(100 + (i * besarKotak) + spc, 430);

                context.moveTo(85 + (i * besarKotak) + spc, 415);
                context.lineTo(85 + (i * besarKotak) + spc, 385);
                context.lineTo(100 + (i * besarKotak) + spc, 370);

                context.moveTo(85 + (i * besarKotak) + spc, 385);
                context.lineTo(55 + (i * besarKotak) + spc, 385);

                context.stroke();

                context.font = "20px Tahoma";
                context.fillStyle = "black";
                context.fillText(listSrc[idSrc].no, 57 + (i * besarKotak) + spc, 450);

                idSrc = idSrc + 1

                elements.push(
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 370, left: 55 + (i * besarKotak) + spc,
                        id: ididKlik + 1,
                        brs: 3, kol: i + 1, seg: 1
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 385, left: 85 + (i * besarKotak) + spc,
                        id: ididKlik + 2,
                        brs: 3, kol: i + 1, seg: 2
                    },
                    {
                        colour: 'red',
                        width: 30, height: 15,
                        top: 415, left: 55 + (i * besarKotak) + spc,
                        id: ididKlik + 3,
                        brs: 3, kol: i + 1, seg: 3
                    },
                    {
                        colour: 'red',
                        width: 15, height: 30,
                        top: 385, left: 40 + (i * besarKotak) + spc,
                        id: ididKlik + 4,
                        brs: 3, kol: i + 1, seg: 4
                    },
                    {
                        colour: 'yellow',
                        width: 30, height: 30,
                        top: 385, left: 55 + (i * besarKotak) + spc,
                        id: ididKlik + 5,
                        brs: 3, kol: i + 1, seg: 5
                    }
                );
                ididKlik = ididKlik + 5

            }


            function isiColor(element) {         
                if (typeIsian == "selai") {
                    console.log(element.seg);
                    if (element.seg == 1) {
                        context.beginPath();
                        context.moveTo(element.left - 13, element.top + 1);
                        context.lineTo(element.left + 43, element.top + 1);
                        context.lineTo(element.left + 29, element.top + 15);
                        context.lineTo(element.left + 1, element.top + 15);
                        context.lineTo(element.left - 13, element.top + 1);
                        context.closePath();
                        context.lineWidth = "3";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    } else if (element.seg == 2) {
                        context.beginPath();
                        context.moveTo(element.left + 1, element.top + 1);
                        context.lineTo(element.left + 15, element.top - 13);
                        context.lineTo(element.left + 15, element.top + 43);
                        context.lineTo(element.left + 1, element.top + 29);
                        context.lineTo(element.left + 1, element.top + 1);
                        context.closePath();
                        context.lineWidth = "3";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    } else if (element.seg == 3) {
                        context.beginPath();
                        context.moveTo(element.left + 1, element.top + 1);
                        context.lineTo(element.left + 29, element.top + 1);
                        context.lineTo(element.left + 43, element.top + 15);
                        context.lineTo(element.left -13, element.top + 15);
                        context.lineTo(element.left + 1 , element.top + 1);
                        context.closePath();
                        context.lineWidth = "3";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    } else if (element.seg == 4) {
                        context.beginPath();
                        context.moveTo(element.left + 1, element.top - 13);
                        context.lineTo(element.left + 15, element.top + 1);
                        context.lineTo(element.left + 15, element.top + 29);
                        context.lineTo(element.left + 1, element.top + 43);
                        context.lineTo(element.left + 1, element.top - 13);
                        context.closePath();
                        context.lineWidth = "3";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    } else if (element.seg == 5) {
                        context.beginPath();
                        context.moveTo(element.left+1, element.top+1);
                        context.lineTo(element.left + 29, element.top+1);
                        context.lineTo(element.left + 29, element.top + 29);
                        context.lineTo(element.left+1, element.top + 29);
                        context.lineTo(element.left+1, element.top + 1);
                        context.closePath();
                        context.lineWidth = "3";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    }
                    element.type = typeIsian
                    element.color = isianColor
                } else if (element.seg == 5 && typeIsian != "selai" && typeIsian != "composite" ) {
                    
                    if (typeIsian == "nonvital") {
                        context.beginPath();
                        context.moveTo(element.left + 15 , element.top + 80);
                        context.lineTo(element.left + 30, element.top + 46);
                        context.lineTo(element.left , element.top + 46);

                        context.closePath();
                        context.lineWidth = "2";
                        context.strokeStyle = "black";
                        context.stroke(); 

                    } else if (typeIsian == "rct") {
                        context.beginPath();
                        context.moveTo(element.left + 15 , element.top + 80);
                        context.lineTo(element.left + 30, element.top + 46);
                        context.lineTo(element.left , element.top + 46);

                        context.closePath();
                        context.lineWidth = "2";
                        context.strokeStyle = "black";
                        context.stroke(); 
                        
                        context.fillStyle = "black";
                        context.fill();
                    } else if (typeIsian == "non") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("NON", element.left - 14, element.top - 22);
                    } else if (typeIsian == "une") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("UNE", element.left - 12, element.top - 22);
                    } else if (typeIsian == "pre") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("PRE", element.left - 10, element.top - 22);
                    } else if (typeIsian == "ano") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("ANO", element.left - 11, element.top - 22);
                    }  else if (typeIsian == "ipx") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("IPX", element.left - 8, element.top + 84);
                    }  else if (typeIsian == "prd") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("PRD", element.left - 8, element.top + 84);
                    } else if (typeIsian == "fld") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("FLD", element.left - 8, element.top + 84);
                    } else if (typeIsian == "imx") {
                        context.font = "bold 24px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("IMX", element.left - 8, element.top + 84);
                    } else if (typeIsian == "caries") {
                        context.beginPath();
                        context.moveTo(element.left+2, element.top+2);
                        context.lineTo(element.left + 28, element.top+2);
                        context.lineTo(element.left + 28, element.top + 28);
                        context.lineTo(element.left+2, element.top + 28);
                        context.lineTo(element.left+2, element.top + 2);
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();
                    } else if (typeIsian == "fracture") {
                        context.font = "bold 60px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("#", element.left - 9, element.top + 37);
                    } else if (typeIsian == "fmc") {
                        context.beginPath();
                        context.moveTo(element.left-15, element.top-15);
                        context.lineTo(element.left + 45, element.top-15);
                        context.lineTo(element.left + 45, element.top + 45);
                        context.lineTo(element.left-15, element.top + 45);
                        context.lineTo(element.left-15, element.top -15);
                        context.closePath();
                        context.lineWidth = "6";
                        context.strokeStyle = "black";
                        context.stroke();
                        //context.fillStyle = isianColor;
                        //context.fill();
                    } else if (typeIsian == "poc") {
                        context.beginPath();
                        context.moveTo(element.left-17, element.top-17);
                        context.lineTo(element.left + 47, element.top-17);
                        context.lineTo(element.left + 47, element.top + 47);
                        context.lineTo(element.left-17, element.top + 47);
                        context.lineTo(element.left-17, element.top -17);
                        context.closePath();
                        context.lineWidth = "10";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left - 9, element.top - 15); //bawah kiri
                        context.lineTo(element.left - 9, element.top + 45); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.moveTo(element.left - 3, element.top - 15); //bawah kiri
                        context.lineTo(element.left - 3, element.top + 45); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 3, element.top - 15); // bawah kanan
                        context.lineTo(element.left + 3, element.top + 45); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 9, element.top - 15); // bawah kanan
                        context.lineTo(element.left + 9, element.top + 45); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 15, element.top - 15); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 45); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 21, element.top - 15); // bawah kanan
                        context.lineTo(element.left + 21, element.top + 45); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 27, element.top - 15); // bawah kanan
                        context.lineTo(element.left + 27, element.top + 45); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 33, element.top - 15); // bawah kanan
                        context.lineTo(element.left + 33, element.top + 45); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 39, element.top - 15); // bawah kanan
                        context.lineTo(element.left + 39, element.top + 45); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
                        
                    } else if (typeIsian == "SisaAkar") {
                        context.beginPath();
                        context.moveTo(element.left - 9, element.top - 35); //bawah kiri
                        context.lineTo(element.left + 15, element.top + 55); // atas kiri
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.moveTo(element.left + 15, element.top + 55); //bawah kiri
                        context.lineTo(element.left + 41, element.top - 45); // atas kiri
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();                        
                    } else if (typeIsian == "mis") {
                        context.beginPath();
                        context.moveTo(element.left - 6, element.top - 26); //bawah kiri
                        context.lineTo(element.left + 38, element.top + 56); // atas kiri
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.moveTo(element.left + 38, element.top - 26); //bawah kiri
                        context.lineTo(element.left - 6, element.top + 56); // atas kiri
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();                      
                    } else if (typeIsian == "nonvitalatas") {
                        context.beginPath();
                        context.moveTo(element.left + 15 , element.top - 50);
                        context.lineTo(element.left + 30, element.top - 16);
                        context.lineTo(element.left , element.top + - 16);

                        context.closePath();
                        context.lineWidth = "2";
                        context.strokeStyle = "black";
                        context.stroke(); 

                    } else if (typeIsian == "rctatas") {
                        context.beginPath();
                        context.moveTo(element.left + 15 , element.top - 50);
                        context.lineTo(element.left + 30, element.top - 16);
                        context.lineTo(element.left , element.top + - 16);

                        context.closePath();
                        context.lineWidth = "2";
                        context.strokeStyle = "black";
                        context.stroke(); 
                        
                        context.fillStyle = "black";
                        context.fill();
                    }  else if (typeIsian == "jembatan1") {
                        context.beginPath();
                        context.moveTo(element.left + 15, element.top-15);
                        context.lineTo(element.left + 15, element.top-35);
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 



                        context.beginPath();
                        context.moveTo(element.left + 15, element.top-35);
                        context.lineTo(element.left + 47, element.top-35);
                        context.closePath();
                        context.lineWidth = "6";
                        context.strokeStyle = "black";
                        context.stroke();
                        //context.fillStyle = isianColor;
                        //context.fill();
                    }  else if (typeIsian == "jembatan2") {
                        context.beginPath();
                        context.moveTo(element.left - 17, element.top-35);
                        context.lineTo(element.left + 47, element.top-35);
                        context.closePath();
                        context.lineWidth = "6";
                        context.strokeStyle = "black";
                        context.stroke();
                        //context.fillStyle = isianColor;
                        //context.fill();
                    }  else if (typeIsian == "jembatan3") {
                        context.beginPath();
                        context.moveTo(element.left + 15, element.top-15);
                        context.lineTo(element.left + 15, element.top-35);
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 



                        context.beginPath();
                        context.moveTo(element.left + 15, element.top-35);
                        context.lineTo(element.left - 32, element.top-35);
                        context.closePath();
                        context.lineWidth = "6";
                        context.strokeStyle = "black";
                        context.stroke();
                    }  else if (typeIsian == "mpm") {
                        context.beginPath();
                        context.arc((element.left + 15), (element.top + 15), 30, 0, 2 * Math.PI);
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();
                    }  else if (typeIsian == "panahkiri") {
                        context.beginPath();
                        context.moveTo(element.left - 5, element.top-30);
                        context.lineTo(element.left + 35, element.top-30);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left - 5, element.top-30);
                        context.lineTo(element.left + 7, element.top- 37);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left - 5, element.top-30);
                        context.lineTo(element.left + 7, element.top-23);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();
                        //context.fillStyle = isianColor;
                        //context.fill();
                    }   else if (typeIsian == "panahkanan") {
                        context.beginPath();
                        context.moveTo(element.left - 5, element.top-30);
                        context.lineTo(element.left + 35, element.top-30);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left + 35, element.top-30);
                        context.lineTo(element.left + 23, element.top- 37);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left +35, element.top-30);
                        context.lineTo(element.left + 23, element.top-23);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();
                        //context.fillStyle = isianColor;
                        //context.fill();
                    }   else if (typeIsian == "rotasikananatas") {

                        context.beginPath();
                        context.moveTo(element.left, element.top-18);
                        context.lineTo(element.left, element.top-22);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left ,element.top - 22);
                        context.bezierCurveTo(element.left ,element.top - 37,element.left + 30,element.top -37,element.left + 32,element.top -37);
                        context.lineWidth=4;
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left + 35, element.top-37);
                        context.lineTo(element.left + 23, element.top- 42);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left +35, element.top-37);
                        context.lineTo(element.left + 23, element.top-30);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();
                        
                    }   else if (typeIsian == "rotasikananbawah") {

                        context.beginPath();
                        context.moveTo(element.left, element.top+ 58);
                        context.lineTo(element.left, element.top+ 62);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left ,element.top + 62);
                        context.bezierCurveTo(element.left ,element.top +77,element.left + 30,element.top +77,element.left + 32,element.top +77);
                        context.lineWidth=4;
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left + 35, element.top+77);
                        context.lineTo(element.left + 23, element.top+82);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left +35, element.top+77);
                        context.lineTo(element.left + 23, element.top+70);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();
                        
                    }   else if (typeIsian == "rotasikiriatas") {

                        context.beginPath();
                        context.moveTo(element.left + 30, element.top-18);
                        context.lineTo(element.left + 30, element.top-22);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left + 30,element.top - 22);
                        context.bezierCurveTo(element.left + 30,element.top - 37,element.left ,element.top -37,element.left -2,element.top -37);
                        context.lineWidth=4;
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left - 5, element.top-37);
                        context.lineTo(element.left + 7, element.top- 42);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left - 5, element.top-37);
                        context.lineTo(element.left + 7, element.top-30);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();
                        
                    }   else if (typeIsian == "rotasikiribawah") {

                        context.beginPath();
                        context.moveTo(element.left + 30, element.top+ 58);
                        context.lineTo(element.left + 30, element.top+ 62);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left + 30,element.top + 62);
                        context.bezierCurveTo(element.left + 30,element.top +77,element.left,element.top +77,element.left - 2,element.top +77);
                        context.lineWidth=4;
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left - 5, element.top+77);
                        context.lineTo(element.left + 7, element.top+82);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();

                        
                        context.beginPath();
                        context.moveTo(element.left - 5, element.top+77);
                        context.lineTo(element.left + 7, element.top+70);
                        context.closePath();
                        context.lineWidth = "4";
                        context.strokeStyle = "black";
                        context.stroke();
                        
                    } 
                    //-----------------------------------------------------------------------------------------


                    element.type = typeIsian
                    element.color = "black"
                } else if( typeIsian == "composite") {
                    console.log(element.seg);
                    if (element.seg == 1) {

                        context.beginPath();
                        context.moveTo(element.left - 9, element.top); //bawah kiri
                        context.lineTo(element.left - 9, element.top + 5); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.moveTo(element.left - 3, element.top); //bawah kiri
                        context.lineTo(element.left - 3, element.top + 10); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 3, element.top); // bawah kanan
                        context.lineTo(element.left + 3, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 9, element.top); // bawah kanan
                        context.lineTo(element.left + 9, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 15, element.top); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 21, element.top); // bawah kanan
                        context.lineTo(element.left + 21, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 27, element.top); // bawah kanan
                        context.lineTo(element.left + 27, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 33, element.top); // bawah kanan
                        context.lineTo(element.left + 33, element.top + 10); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 39, element.top); // bawah kanan
                        context.lineTo(element.left + 39, element.top + 5); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    } else if (element.seg == 2) {

                        context.beginPath();
                        context.moveTo(element.left + 10, element.top - 10); //bawah kiri
                        context.lineTo(element.left + 15, element.top - 10 ); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.moveTo(element.left + 4, element.top - 3); //bawah kiri
                        context.lineTo(element.left + 15, element.top - 3); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 3); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 3); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 9); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 9); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left , element.top + 15); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left , element.top + 21); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 21); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left , element.top + 27); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 27); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 4, element.top + 33); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 33); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 10, element.top + 39); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 39); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    } else if (element.seg == 3) {

                        context.beginPath();
                        context.moveTo(element.left - 9, element.top + 10); //bawah kiri
                        context.lineTo(element.left - 9, element.top + 15); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.moveTo(element.left - 3, element.top + 5); //bawah kiri
                        context.lineTo(element.left - 3, element.top + 15); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 3, element.top); // bawah kanan
                        context.lineTo(element.left + 3, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 9, element.top); // bawah kanan
                        context.lineTo(element.left + 9, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 15, element.top); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 21, element.top); // bawah kanan
                        context.lineTo(element.left + 21, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 27, element.top); // bawah kanan
                        context.lineTo(element.left + 27, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 33, element.top + 5); // bawah kanan
                        context.lineTo(element.left + 33, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 39, element.top + 10); // bawah kanan
                        context.lineTo(element.left + 39, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    } else if (element.seg == 4) {

                        context.beginPath();
                        context.moveTo(element.left, element.top - 10); //bawah kiri
                        context.lineTo(element.left + 5, element.top - 10 ); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.moveTo(element.left , element.top - 3); //bawah kiri
                        context.lineTo(element.left + 11, element.top - 3); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 3); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 3); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 9); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 9); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left , element.top + 15); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 15); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left , element.top + 21); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 21); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left , element.top + 27); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 27); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 33); // bawah kanan
                        context.lineTo(element.left + 11, element.top + 33); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 39); // bawah kanan
                        context.lineTo(element.left + 5, element.top + 39); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    } else if (element.seg == 5) {

                        context.beginPath();
                        context.moveTo(element.left, element.top + 7); //bawah kiri
                        context.lineTo(element.left + 7, element.top ); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.moveTo(element.left , element.top + 14); //bawah kiri
                        context.lineTo(element.left + 14, element.top); // atas kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 21); // bawah kanan
                        context.lineTo(element.left + 21, element.top ); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left, element.top + 28); // bawah kanan
                        context.lineTo(element.left + 28, element.top ); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        
                        context.beginPath();
                        context.lineTo(element.left + 5 , element.top + 30); // bawah kanan
                        context.lineTo(element.left + 30, element.top + 5); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 12, element.top + 30); // bawah kanan
                        context.lineTo(element.left + 30, element.top + 12); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 19, element.top + 30); // bawah kanan
                        context.lineTo(element.left + 30, element.top + 19); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
    
                        context.beginPath();
                        context.lineTo(element.left + 26, element.top + 30); // bawah kanan
                        context.lineTo(element.left + 30, element.top + 26); //bawah kiri
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    }
                    
                } else if (element.type != '') {
                    if (element.type != 'white') {
                        data2.push(element)
                    }
                }

            }


            // Render elements.
            // elements.forEach(function(element) {
            //     context.fillStyle = element.colour;
            //     context.fillRect(element.left, element.top, element.width, element.height);
            // });

            //}

            // $scope.dataTransaksi = [
            //     {
            //     "colour": "yellow",
            //     "width": 30,
            //     "height": 30,
            //     "top": 385,
            //     "left": 510,
            //     "id": 220,
            //     "brs": 3,
            //     "kol": 8,
            //     "seg": 5,
            //     "type": "SisaAkar",
            //     "color": "black"
            //     },
            //     {
            //     "colour": "yellow",
            //     "width": 30,
            //     "height": 30,
            //     "top": 385,
            //     "left": 250,
            //     "id": 200,
            //     "brs": 3,
            //     "kol": 4,
            //     "seg": 5,
            //     "type": "SisaAkar",
            //     "color": "black"
            //     },
            //     {
            //     "colour": "red",
            //     "width": 30,
            //     "height": 15,
            //     "top": 370,
            //     "left": 445,
            //     "id": 211,
            //     "brs": 3,
            //     "kol": 7,
            //     "seg": 1,
            //     "type": "selai",
            //     "color": "#F544ED"
            //     },
            //     {
            //     "colour": "red",
            //     "width": 30,
            //     "height": 15,
            //     "top": 415,
            //     "left": 445,
            //     "id": 213,
            //     "brs": 3,
            //     "kol": 7,
            //     "seg": 3,
            //     "type": "selai",
            //     "color": "#F544ED"
            //     },
            //     {
            //     "colour": "yellow",
            //     "width": 30,
            //     "height": 30,
            //     "top": 275,
            //     "left": 595,
            //     "id": 160,
            //     "brs": 3,
            //     "kol": 6,
            //     "seg": 5,
            //     "type": "UE",
            //     "color": "black"
            //     },
            //     {
            //     "colour": "yellow",
            //     "width": 30,
            //     "height": 30,
            //     "top": 275,
            //     "left": 660,
            //     "id": 165,
            //     "brs": 3,
            //     "kol": 7,
            //     "seg": 5,
            //     "type": "UE",
            //     "color": "black"
            //     }
            // ]


            function isikeunColor() {
                var eel = [];
                medifirstService.get('emr/get-data-odontogram?nocm=' + $scope.item.noMr).then(function (e) {
                    $scope.dataTransaksi = e.data.data
                    for (var i = 0; i < $scope.dataTransaksi.length; i++) {
                        typeIsian = $scope.dataTransaksi[i].type
                        isianColor = $scope.dataTransaksi[i].color
                        eel = $scope.dataTransaksi[i]
                        isiColor(eel)
                    }
                });


            }








            $scope.kliknol = function (data) {
                data.src = "images/odontogram/1.jpg"
            }



            /*var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }*/

            LoadCacheHelper();
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
                    $scope.cc.jenisemr = "asesmen"
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    $scope.item.obj[1147] = moment($scope.cc.tglregistrasi).format('YYYY-MM-DD')
                    $scope.item.obj[1148] = moment($scope.now).format('HH:mm')
                    $scope.item.obj[1239] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                    $scope.item.obj[1256] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                    $scope.item.obj[1257] = { value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap }
                    debugger
                    init()
                    // cekVitalSign()
                    // loadValue();
                }
                var chacePeriode = cacheHelper.get('OdontoGramDokterCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]

                    $scope.dat2Head = chacePeriode

                    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        $scope.showTombol = true
                    }
                    $scope.cc.norec_emr = '-'
                }
                isikeunColor()
            }

            
            $scope.save = function() {
                var confirm = $mdDialog.confirm()
                    .title('Konfirmasi')
                    .textContent('Anda yakin akan menyimpan data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.saveok();
                })
            } 

            $scope.saveok = function () {

                 



                var objHead = {}
                objHead = {
                    'norec_pd': norec_pd,
                    'nocm': $scope.item.noMr,
                    'namapasien': $scope.item.namaPasien,
                    'jeniskelamin': $scope.item.jenisKelamin,
                    'noregistrasi': $scope.item.noregistrasi,
                    'umur': $scope.item.umur,
                    'kelompokpasien': $scope.item.kelompokPasien,
                    'tglregistrasi': $scope.item.tglRegistrasi,
                    'norec': norec_apd,//norec_apd
                    'tglregistrasi': $scope.item.tglRegistrasi,
                    'namakelas': $scope.item.kelas,
                    'namaruangan': $scope.item.namaRuangan,
                     'emrfk' : 100,
                    'jenisemr' : 'odonto',
                    'norec_emr': $scope.cc.norec_emr
                }
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].type == undefined) {
                        data2[i].type = ''
                        data2[i].color = "black"
                    }
                }
                var objsave = {}
                objsave = {
                    'head': objHead,
                    'data': data2
                }


                var canvas = $scope.item.myCanvas;

                // Get the Base64-encoded data URL of the canvas content
                // var dataURL = canvas.toDataURL("image/png");

                // console.log(dataURL);

                //postpost
                medifirstService.post('emr/save-data-odontogram', objsave).then(function (e) {
                    var arrobj = Object.keys($scope.item.obj)
                    var arrSave = []
                    debugger
                    for (var i = arrobj.length - 1; i >= 0; i--) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                    $scope.cc.jenisemr = 'odonto'
                    var jsonSave = {
                        head: objHead,
                        data: arrSave,
                        image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null
                    }
                    medifirstService.post('emr/save-emr-dinamis-new', jsonSave).then(function (e) { 
                        var jsonLog = {
                            'jenislog': 'EMR',
                            'referensi': 'noregistrasi',
                            'noreff': $scope.cc.noregistrasi,
                            'keterangan': 'ODONTOGRAM' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                                + $scope.cc.noregistrasi,
                            'data': arrSave,
                            'jenisemr': $scope.cc.jenisemr,
                            'emrfk': $scope.cc.emrfk
                        }
                        medifirstService.postLoggingEMR(jsonLog).then(function (e) {

                        })
                        // });

                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);

                    });
                });
            }

            function init() {
                $scope.isRouteLoading = true
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=odonto", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    debugger
                    if (dat.data.data.length > 0) {
                        for (let i = 0; i < dat.data.data.length; i++) {
                            if (dat.data.data[i].jenisemr == 'odonto') {
                                lanjut = true;
                            }
                        }
                        if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 100;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                        }  
                         
                    }  
                    debugger
                    
                })

                //var client = new HttpClient();
                //client.get('http://127.0.0.1:1237/formvb/rawat-jalan?form-odontogram' + '&norec_apd=' + norec_apd + '&DokterId=' + dokter + '&idUser=' + idUser, function (response) {
                    // do something with response
                //});
            }
            function setobjectToModel(nomorEMRSS, emrfk) {
                medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    debugger
                    $scope.isLoading = false
                    var chekedd = false
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    // $scope.item.obj[68] = $scope.now
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }
                            
                        }

                    }
                }) 
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1