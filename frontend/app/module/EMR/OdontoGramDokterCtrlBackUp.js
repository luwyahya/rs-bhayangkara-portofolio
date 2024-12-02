define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OdontoGramDokterCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$window', '$location',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $window, $location) {
            //kangge atur resolusi
            if (window.location.href != $location.$$absUrl) {
                window.location.href = $location.$$absUrl
                window.location.reload()
            }

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
            var kdColorTambalanLogam = "#F544ED"
            var kdColorTambalanNonLogam = "#82D9D9"
            var kdColorMahkotaLogam = "#014C0A"
            var kdColorMerah = "Red"
            var kdColorMahkotaNonLogam = "#40F5F9"
            var typeIsian = ""

            var dataLoad = []
            $scope.item.obj = []
            $scope.BelumErupsi = function () {
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
            }
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
                console.log(x, y);
                elements.forEach(function (element) {
                    if (y > element.top + 165 && y < element.top + 165 + element.height && x > element.left && x < element.left + element.width) {
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
                if (typeIsian == "GigiTiruanLepas2") {
                    context.beginPath();
                    // context.moveTo(element.left - 15, element.top);
                    // context.lineTo(element.left + 20, element.top - 30); 
                    // context.moveTo(element.left + 45, element.top);
                    // context.lineTo(element.left, element.top - 30);
                    context.moveTo(element.left - 15, element.top);
                    context.lineTo(element.left - 15 + 60, element.top); //kanan bawah
                    // context.lineTo(element.left - 15 + 60 - 15, element.top - 15); //kanan atas
                    // context.lineTo(element.left - 15 + 60 - 15 - 30, element.top - 15); //kiri atas
                    context.lineTo(element.left - 15 + 60 - 15 - 15, element.top - 25);
                    context.lineTo(element.left - 15, element.top); // kiri bawa
                    context.closePath();
                    context.lineWidth = "5";
                    context.strokeStyle = "black";
                    context.stroke();
                    context.fillStyle = "black";
                    context.fill();
                }
                if (typeIsian == "GigiTiruanLepas3") {
                    context.beginPath();
                    // context.moveTo(element.left, element.top);
                    context.lineTo(element.left + 45, element.top - 15);
                    context.lineTo(element.left + 45, element.top + 45);
                    context.lineTo(element.left - 15 , element.top + 45);
                    context.lineTo(element.left - 15 , element.top - 15);
                    context.closePath();
                    context.lineWidth = "5";
                    // context.strokeStyle = "black";
                    context.stroke();
                    context.fillStyle = transparent ;
                    context.fill();
                }
                if (typeIsian == "GigiTiruanLepas4") {
                    context.beginPath(); 
                    context.moveTo(element.left , element.top);
                    context.roundRect(element.left - 13 , element.top - 15,55,55,50);
                    context.closePath();
                    context.lineWidth = "5"; 
                    context.stroke();  
           
                }

              
                
                if (typeIsian == "selai") {
                    if (element.seg == 1) {
                        context.beginPath();
                        context.moveTo(element.left - 15, element.top);
                        context.lineTo(element.left - 15 + 60, element.top);
                        context.lineTo(element.left - 15 + 60 - 15, element.top + 15);
                        context.lineTo(element.left - 15 + 60 - 15 - 30, element.top + 15);
                        context.lineTo(element.left - 15, element.top);
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    }
                    if (element.seg == 2) {
                        context.beginPath();
                        context.moveTo(element.left + 15, element.top - 15);
                        context.lineTo(element.left + 15, element.top - 15 + 60);
                        context.lineTo(element.left + 15 - 15, element.top - 15 + 60 - 15);
                        context.lineTo(element.left + 15 - 15, element.top - 15 + 60 - 15 - 30);
                        context.lineTo(element.left + 15, element.top - 15);
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    }
                    if (element.seg == 3) {
                        context.beginPath();
                        context.moveTo(element.left - 15, element.top + 15);
                        context.lineTo(element.left, element.top);
                        context.lineTo(element.left + 30, element.top);
                        context.lineTo(element.left + 30 + 15, element.top + 15);
                        context.lineTo(element.left - 15, element.top + 15);
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    }
                    if (element.seg == 4) {
                        context.beginPath();
                        context.moveTo(element.left, element.top - 15);
                        context.lineTo(element.left + 15, element.top - 15 + 15);
                        context.lineTo(element.left + 15, element.top - 15 + 15 + 30);
                        context.lineTo(element.left + 15 - 15, element.top - 15 + 15 + 30 + 15);
                        context.lineTo(element.left, element.top - 15);
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    }
                    if (element.seg == 5) {
                        context.beginPath();
                        context.moveTo(element.left, element.top);
                        context.lineTo(element.left + 30, element.top);
                        context.lineTo(element.left + 30, element.top + 30);
                        context.lineTo(element.left, element.top + 30);
                        context.lineTo(element.left, element.top);
                        context.closePath();
                        context.lineWidth = "1";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = isianColor;
                        context.fill();
                    }
                    element.type = typeIsian
                    element.color = isianColor
                }
                if (element.seg == 5 && typeIsian != "selai") {
                    
                    if (typeIsian == "segitiga") {
                        context.beginPath(); 
                        context.moveTo(element.left - 18, element.top + 50);
                        context.lineTo(element.left - 38, element.top + 70);  
                        context.lineTo(element.left + 2, element.top + 70);
                       
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = "black";
                        context.fill();
                    }
                    if (typeIsian == "segitiga2") {
                        context.beginPath();
                        context.moveTo(element.left + 48, element.top + 50);
                        context.lineTo(element.left + 63, element.top + 70);
                        context.lineTo(element.left + 33, element.top + 70);

                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();
                        context.fillStyle = "black";
                        context.fill();
                    }
                    if (typeIsian == "sambungakar") {
                        context.beginPath();
                        context.moveTo(element.left +15, element.top + 80); //bawah kiri
                        context.lineTo(element.left + 15, element.top + 50); // atas kiri
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 145, element.top + 80); // bawah kanan
                        context.lineTo(element.left + 145, element.top + 50); // atas kanan 
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.lineTo(element.left + 145, element.top + 80); // bawah kanan
                        context.lineTo(element.left + 15, element.top + 80); //bawah kiri
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    }
                    if (typeIsian == "sambungakar2") {
                        context.beginPath();
                        context.moveTo(element.left + 15, element.top + 80); //bawah kanan
                        context.lineTo(element.left + 15, element.top + 50); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.lineTo(element.left - 115, element.top + 80); // bawah kiri
                        context.lineTo(element.left - 115, element.top + 50); // atas kiri 
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.lineTo(element.left - 115, element.top + 80); // bawah kiri
                        context.lineTo(element.left + 15, element.top + 80); //bawah kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();
                    }
                    if (typeIsian == "metal") {
                        context.beginPath();
                        context.moveTo(element.left + 15, element.top - 50); //bawah kanan
                        context.lineTo(element.left + 15, element.top - 20); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.lineTo(element.left - 50, element.top - 50); // bawah kiri
                        context.lineTo(element.left - 50, element.top - 20); // atas kiri 
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.lineTo(element.left - 50, element.top - 50); // bawah kiri
                        context.lineTo(element.left + 15, element.top - 50); //bawah kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();
                    }
                    if (typeIsian == "pager") {
                        context.beginPath();
                        context.moveTo(element.left + 15, element.top + 40); //bawah kanan
                        context.lineTo(element.left + 25, element.top - 10); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left +5, element.top + 40); //bawah kanan
                        context.lineTo(element.left + 15, element.top - 10); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left - 5, element.top + 10); //bawah kanan
                        context.lineTo(element.left + 35, element.top + 10); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();

                        context.beginPath();
                        context.moveTo(element.left - 5, element.top + 20); //bawah kanan
                        context.lineTo(element.left + 35, element.top + 20); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke();
                    }
                    if (typeIsian == "segitigabawah") {
                        context.beginPath();
                        context.moveTo(element.left +15 , element.top + 70);
                        context.lineTo(element.left + 38, element.top + 50);
                        context.lineTo(element.left - 10, element.top + 50);

                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    }
                    if (typeIsian == "v") {
                        context.beginPath();
                        context.moveTo(element.left -15, element.top -15 ); //bawah kanan
                        context.lineTo(element.left + 15, element.top + 45); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 

                        context.beginPath();
                        context.moveTo(element.left + 45, element.top - 15); //bawah kanan
                        context.lineTo(element.left + 15, element.top + 45); // atas kanan
                        context.closePath();
                        context.lineWidth = "5";
                        context.strokeStyle = "black";
                        context.stroke(); 
                    }
                    if (typeIsian == "kali") {
                        context.beginPath();
                        context.moveTo(element.left - 15, element.top -15); 
                        context.lineTo(element.left + 45, element.top +45); 
                        context.closePath();

                      
                        context.lineWidth = "5";
                        context.stroke();
                        context.beginPath();
                        context.moveTo(element.left + 45, element.top - 15);
                        context.lineTo(element.left - 15, element.top + 45);
                        context.closePath();
                        context.lineWidth = "5";
                        context.stroke();

                    }
                    if (typeIsian == "UE") {
                        context.font = "20px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("UE", element.left + 3, element.top + 24);
                    }
                    if (typeIsian == "ipx") {
                        context.font = "20px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("IPX", element.left + 3, element.top - 24);
                    }
                    if (typeIsian == "PE") {
                        context.font = "20px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("PE", element.left + 3, element.top + 24);
                    }
                    if (typeIsian == "A") {
                        context.font = "20px Tahoma";
                        context.fillStyle = "green";
                        context.fillText("A", element.left + 8, element.top + 24);
                    }
                    if (typeIsian == "/") {
                        context.font = "25px Tahoma";
                        context.fillStyle = "red";
                        context.fillText("/", element.left + 10, element.top + 24);
                    }
                    if (typeIsian == "SisaAkar") {
                        context.font = "25px Tahoma";
                        context.fillStyle = "blue";
                        context.fillText("√", element.left + 4, element.top + 27);
                    }
                    if (typeIsian == "gigiHilang") {
                        context.font = "35px Tahoma";
                        context.fillStyle = "Red";
                        context.fillText("X", element.left + 3, element.top + 28);
                    }
                    if (typeIsian == "Jembatan") {
                        context.beginPath();
                        context.lineWidth = "7";
                        context.strokeStyle = "green";
                        context.moveTo(element.left + 2, element.top + 20);
                        context.lineTo(element.left + 28, element.top + 20);
                        context.stroke();
                    }
                    if (typeIsian == "GigiTiruanLepas") {
                        context.beginPath();
                        context.lineWidth = "7";
                        context.strokeStyle = "#EED63F";
                        context.moveTo(element.left + 2, element.top + 20);
                        context.lineTo(element.left + 28, element.top + 20);
                        context.stroke();
                    }
                    if (typeIsian == "non") {
                        context.font = "20px Tahoma";
                        context.fillStyle = "black";
                        context.fillText("Non", element.left + 3, element.top - 24);
                    }
                    
                    element.type = typeIsian
                    element.color = "black"
                }
                if (element.type != '') {
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

            $scope.save = function () {
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

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/formvb/rawat-jalan?form-odontogram' + '&norec_apd=' + norec_apd + '&DokterId=' + dokter + '&idUser=' + idUser, function (response) {
                    // do something with response
                });
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