define(['initialize', 'Configuration'], function(initialize, config) {
    'use strict';
    initialize.controller('PemeriksaanDokterForensikCtrl', ['$rootScope', '$state', '$q', '$scope', '$window', 'CacheHelper', 'MedifirstService', 'DateHelper',
        function($rootScope, $state, $q, $scope, window, cacheHelper, medifirstService, DateHelper) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.norecpd = '';
            $scope.item = {};
            $scope.user = {};
            $scope.model = {};
            $scope.itemPA = {}
            $scope.isRouteLoading = true;
            $scope.item.tanggalluar = new Date(moment($scope.now));
            $scope.item.tanggalpermintaan = new Date(moment($scope.now));
            $scope.item.tanggaldalam = new Date(moment($scope.now));
            $scope.isInput = false
            $scope.pegawai2 = false
            $scope.pegawai3 = false
            $scope.pegawaidalam2 = false
            $scope.pegawaidalam3 = false
            $scope.btnpegawaidalam2 = true
            $scope.tambahpegawai2 = true
            $scope.tambahpegawai3 = true
            $scope.tambahpegawaidalam2 = true
            $scope.tambahpegawaidalam3 = true
            $scope.model.cekpilihManual = undefined
            $scope.model.cekpilihManual2 = undefined
            $scope.model.cekpilihManualdalam = undefined
            $scope.model.cekpilihManualdalam2 = undefined
            $scope.item.tanggalttd = new Date(moment($scope.now));
            $scope.istempatLaporan = true;

            LoadCache();
            loadCombo()
            loadData()
            loadPDF()
                // loadTemplate()



            function LoadCache() {
                var chacePeriode = cacheHelper.get('PemeriksaanDokterForensik');
                if (chacePeriode != undefined) {
                    $scope.norecpd = chacePeriode[0]
                } else {

                }
            }

            function loadCombo() {
                medifirstService.get('registrasi/laporan/get-pegawai-all').then(function(e) {
                    debugger;
                    $scope.listOleh = e.data.pegawai

                    $scope.listPangkat = e.data.pangkat
                    $scope.listGizi = e.data.gizi
                    $scope.listZakar = e.data.zakar
                        // $scope.listWmb = e.data.wmb
                    $scope.listMulut = e.data.mulut
                    $scope.listLidah = e.data.lidah
                    $scope.listDengan = e.data.dengan
                    $scope.listBertuliskan = e.data.bertuliskan
                    $scope.listKekakuan = e.data.kekakuan
                    $scope.listLebam = e.data.lebam
                })
            }

            function loadData() {
                medifirstService.get("registrasi/laporan/get-pasien-pemeriksaan-kedokteran-forensik?norec_pd=" + $scope.norecpd).then(function(dat) {
                    debugger;
                    var pasien = dat.data[0]
                    var umur2 = dat.data
                    for (var i = 0; i < umur2.length; i++) {
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(umur2[i].tgllahir);
                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                        umur2[i].umur = umur.year + ' Tahun '


                    }

                    $scope.item.noregistrasi = pasien.noregistrasi
                    $scope.item.nocm = pasien.nocm
                    $scope.item.namapasien = pasien.namapasien
                    $scope.item.tglregistrasi = pasien.tglregistrasi
                    $scope.item.jeniskelamin = pasien.jeniskelamin
                    $scope.item.tgllahir = pasien.tgllahir
                    $scope.item.alamat = pasien.alamatlengkap
                    $scope.item.kelas = pasien.namakelas
                    $scope.item.ruangan = pasien.namaruangan
                    $scope.item.pendidikan = pasien.pendidikan
                    $scope.item.jenispelayanan = pasien.jenispelayanan

                    $scope.isRouteLoading = false;

                    $scope.item.umur = umur.year + ' Tahun';
                    $scope.item.pekerjaan = pasien.pekerjaan

                    $scope.generateTable = function() {
                        debugger;
                        $scope.column = [{
                            // title: $scope.getBulan(),
                            columns: $scope.createColumn(),
                            // title: $scope.createColumntit(),
                        }]
                        debugger;
                        $scope.mainGridOptionss = {
                            selectable: "cell",
                            dataBound: $scope.onDataBound,
                            columns: $scope.column

                        }

                        var grid = $("#gridBulan").data("kendoGrid");
                        if (grid != undefined) {
                            grid.destroy();
                            $("#gridBulan").empty().kendoGrid({
                                dataSource: $scope.sourceJadwalBulanan,
                                columns: $scope.column,
                                selectable: "cell",
                                dataBound: $scope.onDataBound,
                            });
                        }
                        // for (let i = 0; i < $scope.arrDokter.length; i++) {
                        //     const element = $scope.arrDokter[i];
                        //     element.listTgl = []

                        // }
                        dataARR = []
                        dataARR = $scope.item.namapasien
                        $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                            data: $scope.item.namapasien,
                        });
                    }

                })


            }
            $scope.ceklispilihManual = function(bool) {
                if (bool) {
                    $scope.pegawailuar2 = true
                } else {
                    $scope.pegawailuar2 = false
                }
            }
            $scope.ceklispilihManual2 = function(bool) {
                if (bool) {
                    $scope.pegawailuar3 = true
                } else {
                    $scope.pegawailuar3 = false
                }
            }
            $scope.ceklispilihManualdalam = function(bool) {
                if (bool) {
                    $scope.pegawaidalam2 = true
                } else {
                    $scope.pegawaidalam2 = false
                }
            }
            $scope.ceklispilihManualdalam2 = function(bool) {
                if (bool) {
                    $scope.pegawaidalam3 = true
                } else {
                    $scope.pegawaidalam3 = false
                }
            }
            $scope.ceklispilihManual3 = function(bool) {
                if (bool) {
                    $scope.dengan = true
                } else {
                    $scope.tanpa = false
                }
            }
            $scope.ceklispilihManual4 = function(bool) {
                if (bool) {
                    $scope.tanpa = true
                } else {
                    $scope.dengan = false
                }
            }
            $scope.showNav = function() {
                $rootScope.isShowNavDokpol = !$rootScope.isShowNavDokpol

                $scope.showNavigasiTree = false

            }
            $scope.showNavDalam = function() {
                $rootScope.isShowNavDalam = !$rootScope.isShowNavDalam

                $scope.showNavigasiTree = true

            }
            $scope.isdalam = function() {
                $rootScope.dalam = !$rootScope.dalam

                $scope.showNavigasiTree = false

            }
            $scope.isgambar = function() {
                $rootScope.gambar = !$rootScope.gambar

                $scope.showNavigasiTree = false

            }
            $scope.isgambartes = function() {
                $rootScope.gambartes = !$rootScope.gambartes

                $scope.showNavigasiTree = false

            }
            $scope.isgambar1 = function() {
                $rootScope.gambar1 = !$rootScope.gambar1

                $scope.showNavigasiTree = false

            }

            $scope.inputGigi = function() {
                    $scope.isInput = !$scope.isInput
                    if ($scope.isInput) {
                        $scope.titleButton = 'Hide Input Gigi'
                        $scope.generateTable()
                    } else
                        $scope.titleButton = 'Input Gigi'

                }
                // $scope.generateTable = function () {
                //     debugger;
                //     $scope.column = [{
                //         // title: "Nama Lengkap", width: "150px"
                //     },
                //     {
                //         // title: $scope.getBulan(),
                //         columns: $scope.createColumn(),
                //         // title: $scope.createColumntit(),
                //     }]
                //     $scope.mainGridOptionss =
                //         {
                //             selectable: "cell",
                //             dataBound: $scope.onDataBound,                        
                //             columns: $scope.column

            //         }
            //     var grid = $("#gridBulan").data("kendoGrid");
            //     if (grid != undefined) {
            //         grid.destroy();                    
            //         $("#gridBulan").empty().kendoGrid({
            //             dataSource: $scope.sourceJadwalBulanan,
            //             columns: $scope.column,
            //             selectable: "cell",
            //             dataBound: $scope.onDataBound,
            //         });
            //     }
            //     // for (let i = 0; i < $scope.arrDokter.length; i++) {
            //     //     const element = $scope.arrDokter[i];
            //     //     element.listTgl = []

            //     // }
            //     dataARR = []
            //     dataARR = $scope.arrDokter
            //     $scope.sourceJadwalBulanan = new kendo.data.DataSource({
            //         data: $scope.arrDokter,
            //     });
            // }
            // $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")
            // $scope.getBulan = function () {
            //     $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
            //     return "<center>" + $scope.bulanString + "</center>";
            // }
            $scope.createColumn = function() {
                    debugger;
                    // var year = parseInt(moment($scope.item.bulan).format("Y"))
                    // var month = parseInt(moment($scope.item.bulan).format("M"))
                    // var tempDate = new Date(year, month, 0);
                    // var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&#39;at', 'Sabtu']
                    // // var week = parseInt(moment($scope.item.bulan).format("W"))
                    // var date = new Date()
                    // var days = date.getDate()
                    // // var thisDay = date.getDay()
                    // var weekday = new Array(7)
                    // var date = new Date()
                    // var n = date.getDay()

                    // var day = date.getDate()

                    // var thisDay = date.getDay()

                    var list = ['8', '7', '6', '5', '4', '3', '2', '1', '1', '2', '3', '4', '5', '6', '7', '8'];
                    var list2 = []

                    debugger;
                    for (var i = 0; i < list.length; i++) {
                        var data = {
                            field: "[" + (i + 1) + "]",
                            title: list[i],
                            // title: "[" + weekday[i] + "]",
                            format: "{0:n1}",
                            width: "50px"
                        };

                        list2.push(data);
                    }

                    return list2;
                }
                // $scope.createColumntit = function () {
                //     debugger;
                //     var date = new Date()
                //     var days = date.getDate()
                //     var weekday = new Array(7)
                //     var n = date.getDay()
                //     var list = [];

            //     if(days>7) {
            //         days = days - 7
            //     }
            //     if(days>7) {
            //         days = days - 7
            //     }
            //     if(days>7) {
            //         days = days - 7
            //     }
            //     if(days>7) {
            //         days = days - 7
            //     }
            //     if(n>7) {
            //         n = n - 7
            //     }
            //     if(n>7) {
            //         n = n - 7
            //     }
            //     if(n>7) {
            //         n = n - 7
            //     }
            //     if(n>7) {
            //         n = n - 7
            //     }
            //     if(n>7) {
            //         n = n - 7
            //     }

            //     var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            //     debugger;
            //     // n = n - 1
            //     for (var i = days; i < days+7; i++) {


            //         list = list + "--------------" + weekday[n] + "--------------"
            //         n = n + 1
            //     }

            //     return list;
            // }
            $scope.pegawai2 = function() {
                debugger;
                $scope.pegawaidalam2 = true
                $scope.btnpegawaidalam2 = false
            }
            $scope.pegawai3 = function() {
                $scope.pegawaidalam3 = true
            }

            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"
                ],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };


            $scope.SearchEnterDetail = function() {
                debugger;
                var key = window.event.keyCode;
                // $var1 = "Line 1 info blah blah <br /> Line 2 info blah blah";
                // $var1 = str_replace("<br />", "\n", $var1);
                // If the user has pressed enter
                if (key === 13) {
                    document.getElementById("txtArea").value = document.getElementById("txtArea").value + "\n*";
                    return false;
                } else {
                    return true;
                }
            }


            $scope.save = function() {
                debugger;
                // kendo.drawing.drawDOM($("#surface"))
                //     .then(function (group) {
                //         debugger;
                //         // Render the result as a SVG document
                //         return kendo.drawing.exportImage(group);
                //     })
                //     .done(function (data) {
                //         debugger
                //         // Save the SVG document
                //         if ($scope.isTTD == true) {
                //             var objectfk = "RI-APKTTP"
                //         } else {
                //             objectfk = "RI-APKTTD"
                //         }
                // var objHead = {}
                // debugger;
                // objHead = {
                //     'noregistrasifk': $state.params.noRec,
                //     'file': data,
                //     'objectfile': $scope.item.noregistrasi + '.PNG',
                //     'riwayatpapfk': $scope.noRecPap,
                //     'objectfk': objectfk,
                //     'norec_pd': $scope.norecpd,
                // }
                // var objsave = {}
                // objsave = {
                //     'head': objHead
                // }
                //postpost
                // managePhp.postData2(objsave, 'registrasi/laporan/save-pemeriksaan-dokter-forensik').then(function (e) {
                //     init();

                //     surface.clear();

                // });
                // medifirstService.post("registrasi/laporan/save-pemeriksaan-dokter-forensik", objHead).then(function (e) {
                //     init();

                //     surface.clear();
                // })

                // kendo.saveAs({
                //     dataURI: data,
                //     fileName: "signature.svg",
                //     // proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                // });
                //     var poto = data
                // });

                var rambutkepala1 = ""
                if ($scope.model.rambutkepala == true) {
                    rambutkepala1 = "Hitam, "
                } else if ($scope.model.rambutkepala == false) {
                    rambutkepala1 = ""
                } else {
                    rambutkepala1 = ""
                }
                var rambutkepala3 = ""
                if ($scope.model.rambutkepala2 == true) {
                    rambutkepala3 = "Putih, "
                } else if ($scope.model.rambutkepala2 == false) {
                    rambutkepala3 = ""
                } else {
                    rambutkepala3 = ""
                }
                var rambutkepala4 = ""
                if ($scope.model.rambutkepala3 == true) {
                    rambutkepala4 = "Lurus, "
                } else if ($scope.model.rambutkepala3 == false) {
                    rambutkepala4 = ""
                } else {
                    rambutkepala4 = ""
                }
                var rambutkepala5 = ""
                if ($scope.model.rambutkepala4 == true) {
                    rambutkepala5 = "Ikal, "
                } else if ($scope.model.rambutkepala4 == false) {
                    rambutkepala5 = ""
                } else {
                    rambutkepala5 = ""
                }
                var rambutkepala6 = ""
                if ($scope.model.rambutkepala5 == true) {
                    rambutkepala6 = "Lebat, "
                } else if ($scope.model.rambutkepala5 == false) {
                    rambutkepala6 = ""
                } else {
                    rambutkepala6 = ""
                }
                var rambutkepala7 = ""
                if ($scope.model.rambutkepala6 == true) {
                    rambutkepala7 = "Jarang, "
                } else if ($scope.model.rambutkepala6 == false) {
                    rambutkepala7 = ""
                } else {
                    rambutkepala7 = ""
                }
                var alismata1 = ""
                if ($scope.model.alismata == true) {
                    alismata1 = "Hitam, "
                } else if ($scope.model.alismata == false) {
                    alismata1 = ""
                } else {
                    alismata1 = ""
                }
                var alismata3 = ""
                if ($scope.model.alismata2 == true) {
                    alismata3 = "Putih, "
                } else if ($scope.model.alismata2 == false) {
                    alismata3 = ""
                } else {
                    alismata3 = ""
                }
                var alismata4 = ""
                if ($scope.model.alismata3 == true) {
                    alismata4 = "Lurus, "
                } else if ($scope.model.alismata3 == false) {
                    alismata4 = ""
                } else {
                    alismata4 = ""
                }
                var alismata5 = ""
                if ($scope.model.alismata4 == true) {
                    alismata5 = "Ikal, "
                } else if ($scope.model.alismata4 == false) {
                    alismata5 = ""
                } else {
                    alismata5 = ""
                }
                var alismata6 = ""
                if ($scope.model.alismata5 == true) {
                    alismata6 = "Lebat, "
                } else if ($scope.model.alismata5 == false) {
                    alismata6 = ""
                } else {
                    alismata6 = ""
                }
                var alismata7 = ""
                if ($scope.model.alismata6 == true) {
                    alismata7 = "Jarang, "
                } else if ($scope.model.alismata6 == false) {
                    alismata7 = ""
                } else {
                    alismata7 = ""
                }
                var bulumata1 = ""
                if ($scope.model.bulumata == true) {
                    bulumata1 = "Hitam, "
                } else if ($scope.model.bulumata == false) {
                    bulumata1 = ""
                } else {
                    bulumata1 = ""
                }
                var bulumata3 = ""
                if ($scope.model.bulumata2 == true) {
                    bulumata3 = "Putih, "
                } else if ($scope.model.bulumata2 == false) {
                    bulumata3 = ""
                } else {
                    bulumata3 = ""
                }
                var bulumata4 = ""
                if ($scope.model.bulumata3 == true) {
                    bulumata4 = "Lurus, "
                } else if ($scope.model.bulumata3 == false) {
                    bulumata4 = ""
                } else {
                    bulumata4 = ""
                }
                var bulumata5 = ""
                if ($scope.model.bulumata4 == true) {
                    bulumata5 = "Lentik, "
                } else if ($scope.model.bulumata4 == false) {
                    bulumata5 = ""
                } else {
                    bulumata5 = ""
                }
                var bulumata6 = ""
                if ($scope.model.bulumata5 == true) {
                    bulumata6 = "Lebat, "
                } else if ($scope.model.bulumata5 == false) {
                    bulumata6 = ""
                } else {
                    bulumata6 = ""
                }
                var bulumata7 = ""
                if ($scope.model.bulumata6 == true) {
                    bulumata7 = "Jarang, "
                } else if ($scope.model.bulumata6 == false) {
                    bulumata7 = ""
                } else {
                    bulumata7 = ""
                }
                var kumis1 = ""
                if ($scope.model.kumis == true) {
                    kumis1 = "Hitam, "
                } else if ($scope.model.kumis == false) {
                    kumis1 = ""
                } else {
                    kumis1 = ""
                }
                var kumis3 = ""
                if ($scope.model.kumis2 == true) {
                    kumis3 = "Putih, "
                } else if ($scope.model.kumis2 == false) {
                    kumis3 = ""
                } else {
                    kumis3 = ""
                }
                var kumis4 = ""
                if ($scope.model.kumis3 == true) {
                    kumis4 = "Lurus, "
                } else if ($scope.model.kumis3 == false) {
                    kumis4 = ""
                } else {
                    kumis4 = ""
                }
                var kumis5 = ""
                if ($scope.model.kumis4 == true) {
                    kumis5 = "Ikal, "
                } else if ($scope.model.kumis4 == false) {
                    kumis5 = ""
                } else {
                    kumis5 = ""
                }
                var kumis6 = ""
                if ($scope.model.kumis5 == true) {
                    kumis6 = "Lebat, "
                } else if ($scope.model.kumis5 == false) {
                    kumis6 = ""
                } else {
                    kumis6 = ""
                }
                var kumis7 = ""
                if ($scope.model.kumis6 == true) {
                    kumis7 = "Jarang, "
                } else if ($scope.model.kumis6 == false) {
                    kumis7 = ""
                } else {
                    kumis7 = ""
                }
                var jenggot1 = ""
                if ($scope.model.jenggot == true) {
                    jenggot1 = "Hitam, "
                } else if ($scope.model.jenggot == false) {
                    jenggot1 = ""
                } else {
                    jenggot1 = ""
                }
                var jenggot3 = ""
                if ($scope.model.jenggot2 == true) {
                    jenggot3 = "Putih, "
                } else if ($scope.model.jenggot2 == false) {
                    jenggot3 = ""
                } else {
                    jenggot3 = ""
                }
                var jenggot4 = ""
                if ($scope.model.jenggot3 == true) {
                    jenggot4 = "Lurus, "
                } else if ($scope.model.jenggot3 == false) {
                    jenggot4 = ""
                } else {
                    jenggot4 = ""
                }
                var jenggot5 = ""
                if ($scope.model.jenggot4 == true) {
                    jenggot5 = "Ikal, "
                } else if ($scope.model.jenggot4 == false) {
                    jenggot5 = ""
                } else {
                    jenggot5 = ""
                }
                var jenggot6 = ""
                if ($scope.model.jenggot5 == true) {
                    jenggot6 = "Lebat, "
                } else if ($scope.model.jenggot5 == false) {
                    jenggot6 = ""
                } else {
                    jenggot6 = ""
                }
                var jenggot7 = ""
                if ($scope.model.jenggot6 == true) {
                    jenggot7 = "Jarang, "
                } else if ($scope.model.jenggot6 == false) {
                    jenggot7 = ""
                } else {
                    jenggot7 = ""
                }
                var gigikananatas1 = ""
                var gigikananatas1n = ""
                if ($scope.model.gigikananatas == true) {
                    gigikananatas1 = 1
                } else if ($scope.model.gigikananatas == false) {
                    gigikananatas1 = 0
                    gigikananatas1n = "Pertama, "
                } else {
                    gigikananatas1 = 0
                    gigikananatas1n = "Pertama, "
                }
                var gigikananatas2 = ""
                var gigikananatas2n = ""
                if ($scope.model.gigikananatas2 == true) {
                    gigikananatas2 = 1
                } else if ($scope.model.gigikananatas2 == false) {
                    gigikananatas2 = 0
                    gigikananatas2n = "Kedua, "
                } else {
                    gigikananatas2 = 0
                    gigikananatas2n = "Kedua, "
                }
                var gigikananatas7 = ""
                var gigikananatas7n = ""
                if ($scope.model.gigikananatas7 == true) {
                    gigikananatas7 = 1
                } else if ($scope.model.gigikananatas7 == false) {
                    gigikananatas7 = 0
                    gigikananatas7n = "Ketujuh, "
                } else {
                    gigikananatas7 = 0
                    gigikananatas7n = "Ketujuh, "
                }
                var gigikananatas3 = ""
                var gigikananatas3n = ""
                if ($scope.model.gigikananatas3 == true) {
                    gigikananatas3 = 1
                } else if ($scope.model.gigikananatas3 == false) {
                    gigikananatas3 = 0
                    gigikananatas3n = "Ketiga, "
                } else {
                    gigikananatas3 = 0
                    gigikananatas3n = "Ketiga, "
                }
                var gigikananatas4 = ""
                var gigikananatas4n = ""
                if ($scope.model.gigikananatas4 == true) {
                    gigikananatas4 = 1
                } else if ($scope.model.gigikananatas4 == false) {
                    gigikananatas4 = 0
                    gigikananatas4n = "Keempat, "
                } else {
                    gigikananatas4 = 0
                    gigikananatas4n = "Keempat, "
                }
                var gigikananatas5 = ""
                var gigikananatas5n = ""
                if ($scope.model.gigikananatas5 == true) {
                    gigikananatas5 = 1
                } else if ($scope.model.gigikananatas5 == false) {
                    gigikananatas5 = 0
                    gigikananatas5n = "Kelima, "
                } else {
                    gigikananatas5 = 0
                    gigikananatas5n = "Kelima, "
                }
                var gigikananatas6 = ""
                var gigikananatas6n = ""
                if ($scope.model.gigikananatas6 == true) {
                    gigikananatas6 = 1
                } else if ($scope.model.gigikananatas6 == false) {
                    gigikananatas6 = 0
                    gigikananatas6n = "Keenam, "
                } else {
                    gigikananatas6 = 0
                    gigikananatas6n = "Keenam, "
                }
                var gigikananatas8 = ""
                var gigikananatas8n = ""
                if ($scope.model.gigikananatas8 == true) {
                    gigikananatas8 = 1
                } else if ($scope.model.gigikananatas8 == false) {
                    gigikananatas8 = 0
                    gigikananatas8n = "Kedelapan, "
                } else {
                    gigikananatas8 = 0
                    gigikananatas8n = "Kedelapan, "
                }
                debugger
                var gigikiriatas1 = ""
                var gigikiriatas1n = ""
                if ($scope.model.gigikiriatas == true) {
                    gigikiriatas1 = 1
                } else if ($scope.model.gigikiriatas == false) {
                    gigikiriatas1 = 0
                    gigikiriatas1n = "Pertama, "
                } else {
                    gigikiriatas1 = 0
                    gigikiriatas1n = "Pertama, "
                }
                var gigikiriatas2 = ""
                var gigikiriatas2n = ""
                if ($scope.model.gigikiriatas2 == true) {
                    gigikiriatas2 = 1
                } else if ($scope.model.gigikiriatas2 == false) {
                    gigikiriatas2 = 0
                    gigikiriatas2n = "Kedua, "
                } else {
                    gigikiriatas2 = 0
                    gigikiriatas2n = "Kedua, "
                }
                var gigikiriatas7 = ""
                var gigikiriatas7n = ""
                if ($scope.model.gigikiriatas7 == true) {
                    gigikiriatas7 = 1
                } else if ($scope.model.gigikiriatas7 == false) {
                    gigikiriatas7 = 0
                    gigikiriatas7n = "Ketujuh, "
                } else {
                    gigikiriatas7 = 0
                    gigikiriatas7n = "Ketujuh, "
                }
                var gigikiriatas3 = ""
                var gigikiriatas3n = ""
                if ($scope.model.gigikiriatas3 == true) {
                    gigikiriatas3 = 1
                } else if ($scope.model.gigikiriatas3 == false) {
                    gigikiriatas3 = 0
                    gigikiriatas3n = "Ketiga, "
                } else {
                    gigikiriatas3 = 0
                    gigikiriatas3n = "Ketiga, "
                }
                var gigikiriatas4 = ""
                var gigikiriatas4n = ""
                if ($scope.model.gigikiriatas4 == true) {
                    gigikiriatas4 = 1
                } else if ($scope.model.gigikiriatas4 == false) {
                    gigikiriatas4 = 0
                    gigikiriatas4n = "Keempat, "
                } else {
                    gigikiriatas4 = 0
                    gigikiriatas4n = "Keempat, "
                }
                var gigikiriatas5 = ""
                var gigikiriatas5n = ""
                if ($scope.model.gigikiriatas5 == true) {
                    gigikiriatas5 = 1
                } else if ($scope.model.gigikiriatas5 == false) {
                    gigikiriatas5 = 0
                    gigikiriatas5n = "Kelima, "
                } else {
                    gigikiriatas5 = 0
                    gigikiriatas5n = "Kelima, "
                }
                var gigikiriatas6 = ""
                var gigikiriatas6n = ""
                if ($scope.model.gigikiriatas6 == true) {
                    gigikiriatas6 = 1
                } else if ($scope.model.gigikiriatas6 == false) {
                    gigikiriatas6 = 0
                    gigikiriatas6n = "Keenam, "
                } else {
                    gigikiriatas6 = 0
                    gigikiriatas6n = "Keenam, "
                }
                var gigikiriatas8 = ""
                var gigikiriatas8n = ""
                if ($scope.model.gigikiriatas8 == true) {
                    gigikiriatas8 = 1
                } else if ($scope.model.gigikiriatas8 == false) {
                    gigikiriatas8 = 0
                    gigikiriatas8n = "Kedelapan, "
                } else {
                    gigikiriatas8 = 0
                    gigikiriatas8n = "Kedelapan, "
                }
                var gigikananbawah1 = ""
                var gigikananbawah1n = ""
                if ($scope.model.gigikananbawah == true) {
                    gigikananbawah1 = 1
                } else if ($scope.model.gigikananbawah == false) {
                    gigikananbawah1 = 0
                    gigikananbawah1n = "Pertama, "
                } else {
                    gigikananbawah1 = 0
                    gigikananbawah1n = "Pertama, "
                }
                var gigikananbawah2 = ""
                var gigikananbawah2n = ""
                if ($scope.model.gigikananbawah2 == true) {
                    gigikananbawah2 = 1
                } else if ($scope.model.gigikananbawah2 == false) {
                    gigikananbawah2 = 0
                    gigikananbawah2n = "Kedua, "
                } else {
                    gigikananbawah2 = 0
                    gigikananbawah2n = "Kedua, "
                }
                var gigikananbawah7 = ""
                var gigikananbawah7n = ""
                if ($scope.model.gigikananbawah7 == true) {
                    gigikananbawah7 = 1
                } else if ($scope.model.gigikananbawah7 == false) {
                    gigikananbawah7 = 0
                    gigikananbawah7n = "Ketujuh, "
                } else {
                    gigikananbawah7 = 0
                    gigikananbawah7n = "Ketujuh, "
                }
                var gigikananbawah3 = ""
                var gigikananbawah3n = ""
                if ($scope.model.gigikananbawah3 == true) {
                    gigikananbawah3 = 1
                } else if ($scope.model.gigikananbawah3 == false) {
                    gigikananbawah3 = 0
                    gigikananbawah3n = "Ketiga, "
                } else {
                    gigikananbawah3 = 0
                    gigikananbawah3n = "Ketiga, "
                }
                var gigikananbawah4 = ""
                var gigikananbawah4n = ""
                if ($scope.model.gigikananbawah4 == true) {
                    gigikananbawah4 = 1
                } else if ($scope.model.gigikananbawah4 == false) {
                    gigikananbawah4 = 0
                    gigikananbawah4n = "Keempat, "
                } else {
                    gigikananbawah4 = 0
                    gigikananbawah4n = "Keempat, "
                }
                var gigikananbawah5 = ""
                var gigikananbawah5n = ""
                if ($scope.model.gigikananbawah5 == true) {
                    gigikananbawah5 = 1
                } else if ($scope.model.gigikananbawah5 == false) {
                    gigikananbawah5 = 0
                    gigikananbawah5n = "Kelima, "
                } else {
                    gigikananbawah5 = 0
                    gigikananbawah5n = "Kelima, "
                }
                var gigikananbawah6 = ""
                var gigikananbawah6n = ""
                if ($scope.model.gigikananbawah6 == true) {
                    gigikananbawah6 = 1
                } else if ($scope.model.gigikananbawah6 == false) {
                    gigikananbawah6 = 0
                    gigikananbawah6n = "Keenam, "
                } else {
                    gigikananbawah6 = 0
                    gigikananbawah6n = "Keenam, "
                }
                var gigikananbawah8 = ""
                var gigikananbawah8n = ""
                if ($scope.model.gigikananbawah8 == true) {
                    gigikananbawah8 = 1
                } else if ($scope.model.gigikananbawah8 == false) {
                    gigikananbawah8 = 0
                    gigikananbawah8n = "Kedelapan, "
                } else {
                    gigikananbawah8 = 0
                    gigikananbawah8n = "Kedelapan, "
                }
                var gigikiribawah1 = ""
                var gigikiribawah1n = ""
                if ($scope.model.gigikiribawah == true) {
                    gigikiribawah1 = 1
                } else if ($scope.model.gigikiribawah == false) {
                    gigikiribawah1 = 0
                    gigikiribawah1n = "Pertama, "
                } else {
                    gigikiribawah1 = 0
                    gigikiribawah1n = "Pertama, "
                }
                var gigikiribawah2 = ""
                var gigikiribawah2n = ""
                if ($scope.model.gigikiribawah2 == true) {
                    gigikiribawah2 = 1
                } else if ($scope.model.gigikiribawah2 == false) {
                    gigikiribawah2 = 0
                    gigikiribawah2n = "Kedua, "
                } else {
                    gigikiribawah2 = 0
                    gigikiribawah2n = "Kedua, "
                }
                var gigikiribawah7 = ""
                var gigikiribawah7n = ""
                if ($scope.model.gigikiribawah7 == true) {
                    gigikiribawah7 = 1
                } else if ($scope.model.gigikiribawah7 == false) {
                    gigikiribawah7 = 0
                    gigikiribawah7n = "Ketujuh, "
                } else {
                    gigikiribawah7 = 0
                    gigikiribawah7n = "Ketujuh, "
                }
                var gigikiribawah3 = ""
                var gigikiribawah3n = ""
                if ($scope.model.gigikiribawah3 == true) {
                    gigikiribawah3 = 1
                } else if ($scope.model.gigikiribawah3 == false) {
                    gigikiribawah3 = 0
                    gigikiribawah3n = "Ketiga, "
                } else {
                    gigikiribawah3 = 0
                    gigikiribawah3n = "Ketiga, "
                }
                var gigikiribawah4 = ""
                var gigikiribawah4n = ""
                if ($scope.model.gigikiribawah4 == true) {
                    gigikiribawah4 = 1
                } else if ($scope.model.gigikiribawah4 == false) {
                    gigikiribawah4 = 0
                    gigikiribawah4n = "Keempat, "
                } else {
                    gigikiribawah4 = 0
                    gigikiribawah4n = "Keempat, "
                }
                var gigikiribawah5 = ""
                var gigikiribawah5n = ""
                if ($scope.model.gigikiribawah5 == true) {
                    gigikiribawah5 = 1
                } else if ($scope.model.gigikiribawah5 == false) {
                    gigikiribawah5 = 0
                    gigikiribawah5n = "Kelima, "
                } else {
                    gigikiribawah5 = 0
                    gigikiribawah5n = "Kelima, "
                }
                var gigikiribawah6 = ""
                var gigikiribawah6n = ""
                if ($scope.model.gigikiribawah6 == true) {
                    gigikiribawah6 = 1
                } else if ($scope.model.gigikiribawah6 == false) {
                    gigikiribawah6 = 0
                    gigikiribawah6n = "Keenam, "
                } else {
                    gigikiribawah6 = 0
                    gigikiribawah6n = "Keenam, "
                }
                var gigikiribawah8 = ""
                var gigikiribawah8n = ""
                if ($scope.model.gigikiribawah8 == true) {
                    gigikiribawah8 = 1
                } else if ($scope.model.gigikiribawah8 == false) {
                    gigikiribawah8 = 0
                    gigikiribawah8n = "Kedelapan, "
                } else {
                    gigikiribawah8 = 0
                    gigikiribawah8n = "Kedelapan, "
                }
                debugger
                if ($scope.item.pegawailuar == undefined) {
                    $scope.item.pegawailuar = ''
                }
                if ($scope.item.pegawailuar2 == undefined) {
                    $scope.item.pegawailuar2 = ''
                }
                if ($scope.item.pegawailuar3 == undefined) {
                    $scope.item.pegawailuar3 = ''
                }
                if ($scope.item.pegawaidalam == undefined) {
                    $scope.item.pegawaidalam = ''
                }
                if ($scope.item.pegawaidalam2 == undefined) {
                    $scope.item.pegawaidalam2 = ''
                }
                if ($scope.item.pegawaidalam3 == undefined) {
                    $scope.item.pegawaidalam3 = ''
                }
                if ($scope.item.dengan == undefined) {
                    $scope.item.dengan = ''
                }
                if ($scope.item.bertuliskan == undefined) {
                    $scope.item.bertuliskan = ''
                }
                if ($scope.item.kekakuan == undefined) {
                    $scope.item.kekakuan = ''
                }
                if ($scope.item.lebam2 == undefined) {
                    $scope.item.lebam2 = ''
                }
                if ($scope.item.gizi == undefined) {
                    $scope.item.gizi = ''
                }
                if ($scope.item.zakar == undefined) {
                    $scope.item.zakar = ''
                }
                if ($scope.item.mulut == undefined) {
                    $scope.item.mulut = ''
                }
                if ($scope.item.lidah == undefined) {
                    $scope.item.lidah = ''
                }
                kendo.drawing.drawDOM($(".surface"))
                    .then(function(group) {
                        debugger;
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group);
                    }).done(function(data) {


                        debugger;
                        var objSave = {
                            jumlahgigikananatas: gigikananatas1 + gigikananatas2 + gigikananatas3 + gigikananatas4 + gigikananatas5 + gigikananatas6 + gigikananatas7 + gigikananatas8,
                            gigikananatas: gigikananatas1n + gigikananatas2n + gigikananatas3n + gigikananatas4n + gigikananatas5n + gigikananatas6n + gigikananatas7n + gigikananatas8n,
                            jumlahgigikiriatas: gigikiriatas1 + gigikiriatas2 + gigikiriatas3 + gigikiriatas4 + gigikiriatas5 + gigikiriatas6 + gigikiriatas7 + gigikiriatas8,
                            gigikiriatas: gigikiriatas1n + gigikiriatas2n + gigikiriatas3n + gigikiriatas4n + gigikiriatas5n + gigikiriatas6n + gigikiriatas7n + gigikiriatas8n,
                            jumlahgigikananbawah: gigikananbawah1 + gigikananbawah2 + gigikananbawah3 + gigikananbawah4 + gigikananbawah5 + gigikananbawah6 + gigikananbawah7 + gigikananbawah8,
                            gigikananbawah: gigikananbawah1n + gigikananbawah2n + gigikananbawah3n + gigikananbawah4n + gigikananbawah5n + gigikananbawah6n + gigikananbawah7n + gigikananbawah8n,
                            jumlahgigikiribawah: gigikiribawah1 + gigikiribawah2 + gigikiribawah3 + gigikiribawah4 + gigikiribawah5 + gigikiribawah6 + gigikiribawah7 + gigikiribawah8,
                            gigikiribawah: gigikiribawah1n + gigikiribawah2n + gigikiribawah3n + gigikiribawah4n + gigikiribawah5n + gigikiribawah6n + gigikiribawah7n + gigikiribawah8n,
                            // tes3: gigikiriatas6n,
                            'file': data,
                            keterangangambar: $scope.item.keterangangambar,
                            pegawailuar1: $scope.item.pegawailuar.id,
                            pegawailuar2: $scope.item.pegawailuar2.id,
                            pegawailuar3: $scope.item.pegawailuar3.id,
                            norec_pd: $scope.norecpd, //
                            tglpemeriksaanluar: $scope.item.tanggalluar,
                            tglpermintaan: $scope.item.tanggalpermintaan,
                            nomor: $scope.item.nomor,
                            ditandatangani: $scope.item.tandatangan,
                            pangkat: $scope.item.pangkat,
                            ataspermintaan: $scope.item.ataspermintaan,
                            keterangantkp: $scope.item.keterangan,
                            bangsa: $scope.item.bangsa,
                            status: $scope.item.status,
                            label: $scope.item.label,
                            terbuat: $scope.item.terbuatdari,
                            dengan: $scope.item.dengan.dengan,
                            bertuliskan: $scope.item.bertuliskan.bertuliskan,
                            bungkusmayat: $scope.item.bungkusmayat,
                            perhiasanmayat: $scope.item.perhiasan,
                            pakaianmayat: $scope.item.pakaian,
                            bendamayat: $scope.item.benda,
                            kakumayat: $scope.item.kaku,
                            kekakuan: $scope.item.kekakuan.kekakuan,
                            lebammayat: $scope.item.lebam,
                            warnalebam: $scope.item.warnalebam,
                            lebam: $scope.item.lebam2.lebam,
                            rasbangsa: $scope.item.rasbangsa,
                            kulit: $scope.item.kulit,
                            gizi: $scope.item.gizi.gizi,
                            panjangtubuh: $scope.item.panjangtubuh,
                            berattubuh: $scope.item.berattubuh,
                            zakar: $scope.item.zakar.zakar,
                            identitaskhusus: $scope.item.identitaskhusus,
                            rambutkepala: rambutkepala1 + rambutkepala3 + rambutkepala4 + rambutkepala5 + rambutkepala6 + rambutkepala7,
                            panjangrambut: $scope.item.panjangrambut,
                            alismata: alismata1 + alismata3 + alismata4 + alismata5 + alismata6 + alismata7,
                            panjangalis: $scope.item.panjangalis,
                            bulumata: bulumata1 + bulumata3 + bulumata4 + bulumata5 + bulumata6 + bulumata7,
                            panjangbulumata: $scope.item.panjangbulumata,
                            kumis: kumis1 + kumis3 + kumis4 + kumis5 + kumis6 + kumis7,
                            panjangkumis: $scope.item.panjangkumis,
                            jenggot: jenggot1 + jenggot3 + jenggot4 + jenggot5 + jenggot6 + jenggot7,
                            panjangjenggot: $scope.item.panjangjenggot,
                            kelopakmatakanan: $scope.item.kelopakmatakanan,
                            kelopakmatakiri: $scope.item.kelopakmatakiri,
                            selaputbeningmatakanan: $scope.item.selaputbeningmatakanan,
                            selaputbeningmatakiri: $scope.item.selaputbeningmatakiri,
                            telengmatakanan: $scope.item.telengmatakanan,
                            telengmatakiri: $scope.item.telengmatakiri,
                            warnatiraimatakanan: $scope.item.warnatiraimatakanan,
                            warnatiraimatakiri: $scope.item.warnatiraimatakiri,
                            selaputbolamatakanan: $scope.item.selaputbolamatakanan,
                            selaputbolamatakiri: $scope.item.selaputbolamatakiri,
                            selaputkelopakmatakanan: $scope.item.selaputkelopakmatakanan,
                            selaputkelopakmatakiri: $scope.item.selaputkelopakmatakiri,
                            hidung: $scope.item.hidung,
                            telinga: $scope.item.telinga,
                            mulut: $scope.item.mulut.mulut,
                            mulutterbuka: $scope.item.mulutterbuka,
                            lidah: $scope.item.lidah.lidah,
                            lubangmulutkeluar: $scope.item.mulutkeluar,
                            lubanghidungkeluar: $scope.item.hidungkeluar,
                            lubangtelingakanankeluar: $scope.item.telingakanankeluar,
                            lubangtelingakirikeluar: $scope.item.telingakirikeluar,
                            lubangkemaluankeluar: $scope.item.kemaluankeluar,
                            lubangpelepasankeluar: $scope.item.pelepasankeluar,
                            lukaluka: $scope.item.lukaluka,
                            patahtulang: $scope.item.patahtulang,
                            lainlainluar: $scope.item.lainlainluar,
                            tglpemeriksaandalam: $scope.item.tanggaldalam,
                            warnajaringanlemak: $scope.item.warnajaringan,
                            tebaljaringanlemak: $scope.item.tebaljaringan,
                            warnaotot: $scope.item.warnaotot,
                            tebalotot: $scope.item.tebalotot,
                            tinggironggadadakanan: $scope.item.sekatkanan,
                            tinggironggadadakiri: $scope.item.sekatkiri,
                            tulangdada: $scope.item.tulangdada,
                            tulangiga: $scope.item.tulangiga,
                            dalamronggakanan: $scope.item.ronggakanan,
                            dalamronggakiri: $scope.item.ronggakiri,
                            kandungjantung: $scope.item.kandungjantung,
                            jarikeduaparu: $scope.item.jarikeduaparu,
                            jaringanikatbawah: $scope.item.kulitleher,
                            ototleher: $scope.item.ototleher,
                            selaputdindingperut: $scope.item.dindingperut,
                            ototdindingperut: $scope.item.ototdindingperut,
                            ronggaperut: $scope.item.ronggaperut,
                            warnalidah: $scope.item.warnalidah,
                            penampanglidah: $scope.item.penampanglidah,
                            tulanglidah: $scope.item.tulanglidah,
                            rawangondok: $scope.item.rawangondok,
                            rawancincin: $scope.item.rawancincin,
                            warnakelenjargondok: $scope.item.warnakelenjar,
                            perabaangondok: $scope.item.perabaangondok,
                            penampangkelenjargondok: $scope.item.penampanggondok,
                            kelenjarkacangan: $scope.item.kelenjarkacangan,
                            kerongkongan: $scope.item.kerongkongan,
                            batangtenggorokan: $scope.item.batangtenggorokan,
                            besarjantung: $scope.item.besarjantung,
                            warnajantung: $scope.item.warnajantung,
                            batangtenggorokanjantung: $scope.item.batangtenggorokanjantung,
                            perabaanjantung: $scope.item.perabaanjantung,
                            lingkarankatupkanan: $scope.item.katupkanan,
                            lingkarankatupkiri: $scope.item.katupkiri,
                            pembuluhnadiparu: $scope.item.pembuluhnadiparu,
                            batangnadi: $scope.item.batangnadi,
                            tebalototbilikkanan: $scope.item.bilikkanan,
                            tebalototbilikkiri: $scope.item.bilikkiri,
                            beratjantung: $scope.item.beratjantung,
                            pembuluhnadijantung: $scope.item.nadijantung,
                            dindingsekatjantung: $scope.item.dindingsekatjantung,
                            parukanan: $scope.item.parukanan,
                            warnaparukanan: $scope.item.warnaparukanan,
                            perabaanparukanan: $scope.item.perabaanparukanan,
                            warnapenampangparukanan: $scope.item.warnapenampangparukanan,
                            pemilijitanparukanan: $scope.item.pemilijitanparukanan,
                            beratpemilijitanparukanan: $scope.item.beratparukanan,
                            parukiri: $scope.item.parukiri,
                            warnaparukiri: $scope.item.warnaparukiri,
                            perabaanparukiri: $scope.item.perabaanparukiri,
                            warnapenampangparukiri: $scope.item.warnapenampangparukiri,
                            pemilijitanparukiri: $scope.item.pemilijitanparukiri,
                            beratpemilijitanparukiri: $scope.item.beratparukiri,
                            warnalimpa: $scope.item.warnalimpa,
                            permukaanlimpa: $scope.item.permukaanlimpa,
                            tepilimpa: $scope.item.tepilimpa,
                            perabaanlimpa: $scope.item.perabaanlimpa,
                            warnapenampanglimpa: $scope.item.warnapenampanglimpa,
                            gambaranlimpa: $scope.item.gambaranlimpa,
                            pengikisanlimpa: $scope.item.pengikisanlimpa,
                            beratlimpa: $scope.item.beratlimpa,
                            warnahati: $scope.item.warnahati,
                            permukaanhati: $scope.item.permukaanhati,
                            tepihati: $scope.item.tepihati,
                            perabaanhati: $scope.item.perabaanhati,
                            warnapenampanghati: $scope.item.warnapenampanghati,
                            gambaranhati: $scope.item.gambaranhati,
                            berathati: $scope.item.berathati,
                            kandungempedu: $scope.item.kandungempeduberisi,
                            selaputlendir: $scope.item.selaputlendir,
                            saluranempedu: $scope.item.saluranempedu,
                            warnaliurperut: $scope.item.warnaperut,
                            permukaanliurperut: $scope.item.permukaanperut,
                            perabaanliurperut: $scope.item.perabaanperut,
                            warnapenampangliurperut: $scope.item.warnapenampangperut,
                            gambarankelenjarliur: $scope.item.gambaranperut,
                            beratkelenjarliur: $scope.item.beratperut,
                            isilambung: $scope.item.isilambung,
                            selaputlendirlambung: $scope.item.selaputlendirlambung,
                            ususduabelasjari: $scope.item.ususduabelasjari,
                            usushalus: $scope.item.usushalus,
                            ususbesar: $scope.item.ususbesar,
                            kelenjarginjalkanan: $scope.item.bentukginjalkanan,
                            warnakelenjarginjalkanan: $scope.item.warnaginjalkanan,
                            penampangkelenjarginjalkanan: $scope.item.penampangginjalkanan,
                            beratkelenjarginjalkanan: $scope.item.beratginjalkanan,
                            kelenjarginjalkiri: $scope.item.bentukginjalkiri,
                            warnakelenjarginjalkiri: $scope.item.warnaginjalkiri,
                            penampangkelenjarginjalkiri: $scope.item.penampangginjalkiri,
                            beratkelenjarginjalkiri: $scope.item.beratginjalkiri,
                            simpaiginjalkanan: $scope.item.lemakginjalkanan,
                            permukaanginjalkanan: $scope.item.permukaanginjalkanan,
                            warnaginjalkanan: $scope.item.warnalemakginjalkanan,
                            warnapenampangginjalkanan: $scope.item.warnapenampangginjalkanan,
                            gambaranginjalkanan: $scope.item.gambaranginjalkanan,
                            pialaginjalkanan: $scope.item.pialaginjalkanan,
                            kemihginjalkanan: $scope.item.kemihginjalkanan,
                            beratginjalkanan: $scope.item.beratginjalkanan2,
                            simpaiginjalkiri: $scope.item.lemakginjalkiri,
                            permukaanginjalkiri: $scope.item.permukaanginjalkiri,
                            warnaginjalkiri: $scope.item.warnalemakginjalkiri,
                            warnapenampangginjalkiri: $scope.item.warnapenampangginjalkiri,
                            gambaranginjalkiri: $scope.item.gambaranginjalkiri,
                            pialaginjalkiri: $scope.item.pialaginjalkiri,
                            kemihginjakiri: $scope.item.kemihginjalkiri,
                            beratginjalkiri: $scope.item.beratginjalkiri2,
                            kandungkemih: $scope.item.isikandungkemih,
                            selaputlendirkemih: $scope.item.selaputlendirkandungkemih,
                            indungtelurkanan: $scope.item.indungtelurkanan,
                            indungtelurkiri: $scope.item.indungtelurkiri,
                            rahim: $scope.item.rahim,
                            kulitkepaladalam: $scope.item.kulitkepaladalam,
                            tulangtengkorak: $scope.item.tulangtengkorak,
                            selaputkerasotak: $scope.item.selaputkerasotak,
                            selaputlunakotak: $scope.item.selaputlunakotak,
                            otakbesar: $scope.item.otakbesar,
                            otakkecil: $scope.item.otakkecil,
                            batangotak: $scope.item.batangotak,
                            bilikotak: $scope.item.bilikotak,
                            beratotak: $scope.item.beratotak,
                            saluranluka: $scope.item.saluranluka,
                            toksikologi: $scope.item.toksikologi,
                            histologiforensik: $scope.item.histologiforensik,
                            lainlaindalam: $scope.item.lainlaindalam,
                            kesimpulan: $scope.item.kesimpulan,
                            pemeriksaandalam: $scope.item.pemeriksaandalam,
                            pegawaidalam1: $scope.item.pegawaidalam.id,
                            pegawaidalam2: $scope.item.pegawaidalam2.id,
                            pegawaidalam3: $scope.item.pegawaidalam3.id,
                            tanggalttd: $scope.item.tanggalttd,
                            nomorsurat: $scope.item.nomorsurat,
                            pemeriksaanluar: $scope.item.pemeriksaanluar,
                            norec: $scope.norecPDF
                        }

                        medifirstService.post("registrasi/laporan/save-pemeriksaan-dokter-forensik", objSave).then(function(e) {

                            loadPDF()
                        });
                    })
            }

            function loadPDF() {
                medifirstService.get("registrasi/laporan/get-pemeriksaan-dokter-forensik?norec_pd=" + $scope.norecpd).then(function(dat) {
                    debugger;
                    if (dat.data.length > 0) {
                        $scope.user.poto = dat.data[0].foto
                        $scope.user.poto2 = dat.data[0].foto2
                        $scope.user.poto3 = dat.data[0].foto3
                        $scope.user.poto4 = dat.data[0].foto4
                            // $scope.item.keterangangambar = dat.data[0].keterangangambar
                            // if(dat.data[0].pegawailuar2 != null || dat.data[0].pegawailuar2 != '0'){
                            //     $scope.model.cekpilihManual = true
                            //     $scope.pegawailuar2 = true
                            // } else {
                            //     $scope.model.cekpilihManual = false
                            //     $scope.pegawailuar2 = false
                            // }
                            // if(dat.data[0].pegawailuar3 != null || dat.data[0].pegawailuar3 != '0'){
                            //     $scope.model.cekpilihManual2 = true
                            //     $scope.pegawailuar3 = true
                            // } else {
                            //     $scope.model.cekpilihManual = false
                            //     $scope.pegawailuar2 = false
                            // }
                            // if(dat.data[0].pegawaidalam2 != null || dat.data[0].pegawaidalam2 != 0){
                            //     $scope.model.cekpilihManualdalam = true
                            //     $scope.pegawaidalam2 = true
                            // } else {
                            //     $scope.model.cekpilihManual = false
                            //     $scope.pegawailuar2 = false
                            // }
                            // if(dat.data[0].pegawaidalam3 != null || dat.data[0].pegawaidalam3 != 0){
                            //     $scope.model.cekpilihManualdalam2 = true
                            //     $scope.pegawaidalam3 = true
                            // } else {
                            //     $scope.model.cekpilihManual = false
                            //     $scope.pegawailuar2 = false
                            // }
                        $scope.norecPDF = dat.data[0].norec
                            // $scope.item.foto=dat.data[0].foto
                        $scope.item.tanggalttd = dat.data[0].tanggalttd
                        $scope.item.tanggalluar = dat.data[0].tglpemeriksaanluar
                        $scope.item.tanggalpermintaan = dat.data[0].tanggalpermintaan
                        $scope.item.nomorsurat = dat.data[0].nomorsurat
                            // $scope.item.foto2=dat.data[0].foto
                        $scope.item.pegawailuar = { id: dat.data[0].pegawailuar1, namalengkap: dat.data[0].namapegawailuar1 }
                            // $scope.item.pegawailuar2={ id: dat.data[0].pegawailuar2, namalengkap: dat.data[0].namalengkap}
                            // $scope.item.pegawailuar3={ id: dat.data[0].pegawailuar3, namalengkap: dat.data[0].namalengkap}
                            // $scope.item.pegawaidalam={ id: dat.data[0].pegawaidalam1, namalengkap: dat.data[0].namalengkap}
                            // $scope.item.pegawaidalam2={ id: dat.data[0].pegawaidalam2, namalengkap: dat.data[0].namalengkap}
                            // $scope.item.pegawaidalam3={ id: dat.data[0].pegawaidalam3, namalengkap: dat.data[0].namalengkap}
                            // $scope.item.tanggalluar=dat.data[0].tglpemeriksaanluar
                            // $scope.item.tanggalpermintaan=dat.data[0].tanggalpermintaan
                        $scope.item.nomor = dat.data[0].nomor2
                        $scope.item.tandatangan = dat.data[0].ditandatangani
                        $scope.item.pangkat = dat.data[0].pangkat
                        $scope.item.ataspermintaan = dat.data[0].ataspermintaan
                            // $scope.item.keterangan=dat.data[0].keterangantkp
                            // $scope.item.bangsa=dat.data[0].bangsa
                            // $scope.item.status=dat.data[0].status
                        $scope.item.label = dat.data[0].label
                        $scope.item.terbuatdari = dat.data[0].terbuat
                            // $scope.item.dengan={ id: dat.data[0].id, dengan: dat.data[0].dengan}
                            // $scope.item.bertuliskan={ id: dat.data[0].id, bertuliskan: dat.data[0].bertuliskan}
                        $scope.item.bungkusmayat = dat.data[0].bungkusmayat
                        $scope.item.perhiasan = dat.data[0].perhiasanmayat
                        $scope.item.pakaian = dat.data[0].pakaianmayat
                        $scope.item.benda = dat.data[0].bendamayat
                        $scope.item.kaku = dat.data[0].kakumayat
                        $scope.item.mayat = dat.data[0].mayat
                            // $scope.item.kekakuan= {id: dat.data[0].id, kekakuan: dat.data[0].kekauan }
                            // $scope.item.lebam=dat.data[0].lebammayat
                            // $scope.item.warnalebam=dat.data[0].warnalebam
                            // $scope.item.lebam2={ id: dat.data[0].id, lebam: dat.data[0].lebam}
                            // $scope.item.rasbangsa=dat.data[0].rasbangsa
                            // $scope.item.kulit=dat.data[0].kulit
                            // $scope.item.gizi={ gizi: dat.data[0].gizi, id: dat.data[0].id }
                            // $scope.item.panjangtubuh=dat.data[0].panjangtubuh
                            // $scope.item.berattubuh=dat.data[0].berattubuh
                            // $scope.item.zakar={ zakar: dat.data[0].zakar, id: dat.data[0].id }
                        $scope.item.identitaskhusus = dat.data[0].identitaskhusus
                        $scope.item.rambut = dat.data[0].rambutkepala
                            // $scope.item.warnarambut=dat.data[0].rambutkepala
                            // if (dat.data[0].rambutkepala == 'Hitam, ' || dat.data[0].rambutkepala == 'Hitam, Ikal, ' || dat.data[0].rambutkepala == 'Hitam, Lurus, '|| dat.data[0].rambutkepala == 'Hitam, Lurus, Jarang, ' || dat.data[0].rambutkepala == 'Hitam, Lurus, Lebat, '  || dat.data[0].rambutkepala == 'Hitam, Ikal, Lebat, ' || dat.data[0].rambutkepala == 'Hitam, Ikal, Jarang, ' || dat.data[0].rambutkepala == 'Hitam, Lebat, ' || dat.data[0].rambutkepala == 'Hitam, Jarang, ') {
                            //     $scope.model.rambutkepala = true
                            // } else {
                            //     $scope.model.rambutkepala = false
                            // }
                            // if (dat.data[0].rambutkepala == 'Putih, ' || dat.data[0].rambutkepala == 'Putih, Ikal, ' || dat.data[0].rambutkepala == 'Putih, Lurus, '|| dat.data[0].rambutkepala == 'Putih, Lurus, Jarang, ' || dat.data[0].rambutkepala == 'Putih, Lurus, Lebat, '   || dat.data[0].rambutkepala == 'Putih, Ikal, Lebat, ' || dat.data[0].rambutkepala == 'Putih, Ikal, Jarang, ' || dat.data[0].rambutkepala == 'Putih, Lebat, ' || dat.data[0].rambutkepala == 'Putih, Jarang, ') {
                            //     $scope.model.rambutkepala2 = true
                            // } else {
                            //     $scope.model.rambutkepala2 = false
                            // }
                            // if (dat.data[0].rambutkepala == 'Lurus, ' || dat.data[0].rambutkepala == 'Hitam, Lurus, '|| dat.data[0].rambutkepala == 'Hitam, Lurus, Jarang, ' || dat.data[0].rambutkepala == 'Hitam, Lurus, Lebat, '   || dat.data[0].rambutkepala == 'Putih, Lurus, Jarang, ' || dat.data[0].rambutkepala == 'Putih, Lurus, Lebat, '  || dat.data[0].rambutkepala == 'Putih, Lurus, ') {
                            //     $scope.model.rambutkepala3 = true
                            // } else {
                            //     $scope.model.rambutkepala3 = false
                            // }
                            // if (dat.data[0].rambutkepala == 'Ikal, ' || dat.data[0].rambutkepala == 'Hitam, Ikal, ' || dat.data[0].rambutkepala == 'Hitam, Ikal, Lebat, ' || dat.data[0].rambutkepala == 'Hitam, Ikal, Jarang, ' || dat.data[0].rambutkepala == 'Putih, Ikal, ' || dat.data[0].rambutkepala == 'Putih, Ikal, Lebat, ' || dat.data[0].rambutkepala == 'Putih, Ikal, Jarang, ') {
                            //     $scope.model.rambutkepala4 = true
                            // } else {
                            //     $scope.model.rambutkepala4 = false
                            // }
                            // if (dat.data[0].rambutkepala == 'Lebat, ' || dat.data[0].rambutkepala == 'Hitam, Lurus, Lebat, '  || dat.data[0].rambutkepala == 'Putih, Lurus, Lebat, '  || dat.data[0].rambutkepala == 'Hitam, Ikal, Lebat, ' || dat.data[0].rambutkepala == 'Hitam, Lebat, ' || dat.data[0].rambutkepala == 'Putih, Ikal, Lebat, ' || dat.data[0].rambutkepala == 'Putih, Lebat, ') {
                            //     $scope.model.rambutkepala5 = true
                            // } else {
                            //     $scope.model.rambutkepala5 = false
                            // }
                            // if (dat.data[0].rambutkepala == 'Jarang, ' || dat.data[0].rambutkepala == 'Hitam, Ikal, Jarang, ' || dat.data[0].rambutkepala == 'Hitam, Lurus, Jarang, ' || dat.data[0].rambutkepala == 'Putih, Lurus, Jarang, ' || dat.data[0].rambutkepala == 'Hitam, Jarang, ' || dat.data[0].rambutkepala == 'Putih, Ikal, Jarang, ' || dat.data[0].rambutkepala == 'Putih, Jarang, ') {
                            //     $scope.model.rambutkepala6 = true
                            // } else {
                            //     $scope.model.rambutkepala6 = false
                            // }
                            // $scope.item.panjangrambut=dat.data[0].panjangrambut
                            // if (dat.data[0].alismata == 'Hitam, ' || dat.data[0].alismata == 'Hitam, Ikal, ' || dat.data[0].alismata == 'Hitam, Lurus, '|| dat.data[0].alismata == 'Hitam, Lurus, Jarang, ' || dat.data[0].alismata == 'Hitam, Lurus, Lebat, '  || dat.data[0].alismata == 'Hitam, Ikal, Lebat, ' || dat.data[0].alismata == 'Hitam, Ikal, Jarang, ' || dat.data[0].alismata == 'Hitam, Lebat, ' || dat.data[0].alismata == 'Hitam, Jarang, ') {
                            //     $scope.model.alismata = true
                            // } else {
                            //     $scope.model.alismata = false
                            // }
                            // if (dat.data[0].alismata == 'Putih, ' || dat.data[0].alismata == 'Putih, Ikal, ' || dat.data[0].alismata == 'Putih, Lurus, '|| dat.data[0].alismata == 'Putih, Lurus, Jarang, ' || dat.data[0].alismata == 'Putih, Lurus, Lebat, '   || dat.data[0].alismata == 'Putih, Ikal, Lebat, ' || dat.data[0].alismata == 'Putih, Ikal, Jarang, ' || dat.data[0].alismata == 'Putih, Lebat, ' || dat.data[0].alismata == 'Putih, Jarang, ') {
                            //     $scope.model.alismata2 = true
                            // } else {
                            //     $scope.model.alismata2 = false
                            // }
                            // if (dat.data[0].alismata == 'Lurus, ' || dat.data[0].alismata == 'Hitam, Lurus, '|| dat.data[0].alismata == 'Hitam, Lurus, Jarang, ' || dat.data[0].alismata == 'Hitam, Lurus, Lebat, '   || dat.data[0].alismata == 'Putih, Lurus, Jarang, ' || dat.data[0].alismata == 'Putih, Lurus, Lebat, '  || dat.data[0].alismata == 'Putih, Lurus, ') {
                            //     $scope.model.alismata3 = true
                            // } else {
                            //     $scope.model.alismata3 = false
                            // }
                            // if (dat.data[0].alismata == 'Ikal, ' || dat.data[0].alismata == 'Hitam, Ikal, ' || dat.data[0].alismata == 'Hitam, Ikal, Lebat, ' || dat.data[0].alismata == 'Hitam, Ikal, Jarang, ' || dat.data[0].alismata == 'Putih, Ikal, ' || dat.data[0].alismata == 'Putih, Ikal, Lebat, ' || dat.data[0].alismata == 'Putih, Ikal, Jarang, ') {
                            //     $scope.model.alismata4 = true
                            // } else {
                            //     $scope.model.alismata4 = false
                            // }
                            // if (dat.data[0].alismata == 'Lebat, ' || dat.data[0].alismata == 'Hitam, Lurus, Lebat, '  || dat.data[0].alismata == 'Putih, Lurus, Lebat, '  || dat.data[0].alismata == 'Hitam, Ikal, Lebat, ' || dat.data[0].alismata == 'Hitam, Lebat, ' || dat.data[0].alismata == 'Putih, Ikal, Lebat, ' || dat.data[0].alismata == 'Putih, Lebat, ') {
                            //     $scope.model.alismata5 = true
                            // } else {
                            //     $scope.model.alismata5 = false
                            // }
                            // if (dat.data[0].alismata == 'Jarang, ' || dat.data[0].alismata == 'Hitam, Ikal, Jarang, ' || dat.data[0].alismata == 'Hitam, Lurus, Jarang, ' || dat.data[0].alismata == 'Putih, Lurus, Jarang, ' || dat.data[0].alismata == 'Hitam, Jarang, ' || dat.data[0].alismata == 'Putih, Ikal, Jarang, ' || dat.data[0].alismata == 'Putih, Jarang, ') {
                            //     $scope.model.alismata6 = true
                            // } else {
                            //     $scope.model.alismata6 = false
                            // }
                            // // $scope.item.alismata=dat.data[0].alismata
                            // $scope.item.panjangalis=dat.data[0].panjangalis
                            // if (dat.data[0].bulumata == 'Hitam, ' || dat.data[0].bulumata == 'Hitam, Lentik, ' || dat.data[0].bulumata == 'Hitam, Lurus, '|| dat.data[0].bulumata == 'Hitam, Lurus, Jarang, ' || dat.data[0].bulumata == 'Hitam, Lurus, Lebat, '  || dat.data[0].bulumata == 'Hitam, Lentik, Lebat, ' || dat.data[0].bulumata == 'Hitam, Lentik, Jarang, ' || dat.data[0].bulumata == 'Hitam, Lebat, ' || dat.data[0].bulumata == 'Hitam, Jarang, ') {
                            //     $scope.model.bulumata = true
                            // } else {
                            //     $scope.model.bulumata = false
                            // }
                            // if (dat.data[0].bulumata == 'Putih, ' || dat.data[0].bulumata == 'Putih, Lentik, ' || dat.data[0].bulumata == 'Putih, Lurus, '|| dat.data[0].bulumata == 'Putih, Lurus, Jarang, ' || dat.data[0].bulumata == 'Putih, Lurus, Lebat, '   || dat.data[0].bulumata == 'Putih, Lentik, Lebat, ' || dat.data[0].bulumata == 'Putih, Lentik, Jarang, ' || dat.data[0].bulumata == 'Putih, Lebat, ' || dat.data[0].bulumata == 'Putih, Jarang, ') {
                            //     $scope.model.bulumata2 = true
                            // } else {
                            //     $scope.model.bulumata2 = false
                            // }
                            // if (dat.data[0].bulumata == 'Lurus, ' || dat.data[0].bulumata == 'Hitam, Lurus, '|| dat.data[0].bulumata == 'Hitam, Lurus, Jarang, ' || dat.data[0].bulumata == 'Hitam, Lurus, Lebat, '   || dat.data[0].bulumata == 'Putih, Lurus, Jarang, ' || dat.data[0].bulumata == 'Putih, Lurus, Lebat, '  || dat.data[0].bulumata == 'Putih, Lurus, ') {
                            //     $scope.model.bulumata3 = true
                            // } else {
                            //     $scope.model.bulumata3 = false
                            // }
                            // if (dat.data[0].bulumata == 'Lentik, ' || dat.data[0].bulumata == 'Hitam, Lentik, ' || dat.data[0].bulumata == 'Hitam, Lentik, Lebat, ' || dat.data[0].bulumata == 'Hitam, Lentik, Jarang, ' || dat.data[0].bulumata == 'Putih, Lentik, ' || dat.data[0].bulumata == 'Putih, Lentik, Lebat, ' || dat.data[0].bulumata == 'Putih, Lentik, Jarang, ') {
                            //     $scope.model.bulumata4 = true
                            // } else {
                            //     $scope.model.bulumata4 = false
                            // }
                            // if (dat.data[0].bulumata == 'Lebat, ' || dat.data[0].bulumata == 'Hitam, Lurus, Lebat, '  || dat.data[0].bulumata == 'Putih, Lurus, Lebat, '  || dat.data[0].bulumata == 'Hitam, Lentik, Lebat, ' || dat.data[0].bulumata == 'Hitam, Lebat, ' || dat.data[0].bulumata == 'Putih, Lentik, Lebat, ' || dat.data[0].bulumata == 'Putih, Lebat, ') {
                            //     $scope.model.bulumata5 = true
                            // } else {
                            //     $scope.model.bulumata5 = false
                            // }
                            // if (dat.data[0].bulumata == 'Jarang, ' || dat.data[0].bulumata == 'Hitam, Lentik, Jarang, ' || dat.data[0].bulumata == 'Hitam, Lurus, Jarang, ' || dat.data[0].bulumata == 'Putih, Lurus, Jarang, ' || dat.data[0].bulumata == 'Hitam, Jarang, ' || dat.data[0].bulumata == 'Putih, Lentik, Jarang, ' || dat.data[0].bulumata == 'Putih, Jarang, ') {
                            //     $scope.model.bulumata6 = true
                            // } else {
                            //     $scope.model.bulumata6 = false
                            // }
                            // // $scope.item.bulumata=dat.data[0].bulumata
                            // $scope.item.panjangbulumata=dat.data[0].panjangbulumata
                            // if (dat.data[0].kumis == 'Hitam, ' || dat.data[0].kumis == 'Hitam, Ikal, ' || dat.data[0].kumis == 'Hitam, Lurus, '|| dat.data[0].kumis == 'Hitam, Lurus, Jarang, ' || dat.data[0].kumis == 'Hitam, Lurus, Lebat, '  || dat.data[0].kumis == 'Hitam, Ikal, Lebat, ' || dat.data[0].kumis == 'Hitam, Ikal, Jarang, ' || dat.data[0].kumis == 'Hitam, Lebat, ' || dat.data[0].kumis == 'Hitam, Jarang, ') {
                            //     $scope.model.kumis = true
                            // } else {
                            //     $scope.model.kumis = false
                            // }
                            // if (dat.data[0].kumis == 'Putih, ' || dat.data[0].kumis == 'Putih, Ikal, ' || dat.data[0].kumis == 'Putih, Lurus, '|| dat.data[0].kumis == 'Putih, Lurus, Jarang, ' || dat.data[0].kumis == 'Putih, Lurus, Lebat, '   || dat.data[0].kumis == 'Putih, Ikal, Lebat, ' || dat.data[0].kumis == 'Putih, Ikal, Jarang, ' || dat.data[0].kumis == 'Putih, Lebat, ' || dat.data[0].kumis == 'Putih, Jarang, ') {
                            //     $scope.model.kumis2 = true
                            // } else {
                            //     $scope.model.kumis2 = false
                            // }
                            // if (dat.data[0].kumis == 'Lurus, ' || dat.data[0].kumis == 'Hitam, Lurus, '|| dat.data[0].kumis == 'Hitam, Lurus, Jarang, ' || dat.data[0].kumis == 'Hitam, Lurus, Lebat, '   || dat.data[0].kumis == 'Putih, Lurus, Jarang, ' || dat.data[0].kumis == 'Putih, Lurus, Lebat, '  || dat.data[0].kumis == 'Putih, Lurus, ') {
                            //     $scope.model.kumis3 = true
                            // } else {
                            //     $scope.model.kumis3 = false
                            // }
                            // if (dat.data[0].kumis == 'Ikal, ' || dat.data[0].kumis == 'Hitam, Ikal, ' || dat.data[0].kumis == 'Hitam, Ikal, Lebat, ' || dat.data[0].kumis == 'Hitam, Ikal, Jarang, ' || dat.data[0].kumis == 'Putih, Ikal, ' || dat.data[0].kumis == 'Putih, Ikal, Lebat, ' || dat.data[0].kumis == 'Putih, Ikal, Jarang, ') {
                            //     $scope.model.kumis4 = true
                            // } else {
                            //     $scope.model.kumis4 = false
                            // }
                            // if (dat.data[0].kumis == 'Lebat, ' || dat.data[0].kumis == 'Hitam, Lurus, Lebat, '  || dat.data[0].kumis == 'Putih, Lurus, Lebat, '  || dat.data[0].kumis == 'Hitam, Ikal, Lebat, ' || dat.data[0].kumis == 'Hitam, Lebat, ' || dat.data[0].kumis == 'Putih, Ikal, Lebat, ' || dat.data[0].kumis == 'Putih, Lebat, ') {
                            //     $scope.model.kumis5 = true
                            // } else {
                            //     $scope.model.kumis5 = false
                            // }
                            // if (dat.data[0].kumis == 'Jarang, ' || dat.data[0].kumis == 'Hitam, Ikal, Jarang, ' || dat.data[0].kumis == 'Hitam, Lurus, Jarang, ' || dat.data[0].kumis == 'Putih, Lurus, Jarang, ' || dat.data[0].kumis == 'Hitam, Jarang, ' || dat.data[0].kumis == 'Putih, Ikal, Jarang, ' || dat.data[0].kumis == 'Putih, Jarang, ') {
                            //     $scope.model.kumis6 = true
                            // } else {
                            //     $scope.model.kumis6 = false
                            // }
                            // // $scope.item.kumis=dat.data[0].kumis
                            // $scope.item.panjangkumis=dat.data[0].panjangkumis
                            // if (dat.data[0].jenggot == 'Hitam, ' || dat.data[0].jenggot == 'Hitam, Ikal, ' || dat.data[0].jenggot == 'Hitam, Lurus, '|| dat.data[0].jenggot == 'Hitam, Lurus, Jarang, ' || dat.data[0].jenggot == 'Hitam, Lurus, Lebat, '  || dat.data[0].jenggot == 'Hitam, Ikal, Lebat, ' || dat.data[0].jenggot == 'Hitam, Ikal, Jarang, ' || dat.data[0].jenggot == 'Hitam, Lebat, ' || dat.data[0].jenggot == 'Hitam, Jarang, ') {
                            //     $scope.model.jenggot = true
                            // } else {
                            //     $scope.model.jenggot = false
                            // }
                            // if (dat.data[0].jenggot == 'Putih, ' || dat.data[0].jenggot == 'Putih, Ikal, ' || dat.data[0].jenggot == 'Putih, Lurus, '|| dat.data[0].jenggot == 'Putih, Lurus, Jarang, ' || dat.data[0].jenggot == 'Putih, Lurus, Lebat, '   || dat.data[0].jenggot == 'Putih, Ikal, Lebat, ' || dat.data[0].jenggot == 'Putih, Ikal, Jarang, ' || dat.data[0].jenggot == 'Putih, Lebat, ' || dat.data[0].jenggot == 'Putih, Jarang, ') {
                            //     $scope.model.jenggot2 = true
                            // } else {
                            //     $scope.model.jenggot2 = false
                            // }
                            // if (dat.data[0].jenggot == 'Lurus, ' || dat.data[0].jenggot == 'Hitam, Lurus, '|| dat.data[0].jenggot == 'Hitam, Lurus, Jarang, ' || dat.data[0].jenggot == 'Hitam, Lurus, Lebat, '   || dat.data[0].jenggot == 'Putih, Lurus, Jarang, ' || dat.data[0].jenggot == 'Putih, Lurus, Lebat, '  || dat.data[0].jenggot == 'Putih, Lurus, ') {
                            //     $scope.model.jenggot3 = true
                            // } else {
                            //     $scope.model.jenggot3 = false
                            // }
                            // if (dat.data[0].jenggot == 'Ikal, ' || dat.data[0].jenggot == 'Hitam, Ikal, ' || dat.data[0].jenggot == 'Hitam, Ikal, Lebat, ' || dat.data[0].jenggot == 'Hitam, Ikal, Jarang, ' || dat.data[0].jenggot == 'Putih, Ikal, ' || dat.data[0].jenggot == 'Putih, Ikal, Lebat, ' || dat.data[0].jenggot == 'Putih, Ikal, Jarang, ') {
                            //     $scope.model.jenggot4 = true
                            // } else {
                            //     $scope.model.jenggot4 = false
                            // }
                            // if (dat.data[0].jenggot == 'Lebat, ' || dat.data[0].jenggot == 'Hitam, Lurus, Lebat, '  || dat.data[0].jenggot == 'Putih, Lurus, Lebat, '  || dat.data[0].jenggot == 'Hitam, Ikal, Lebat, ' || dat.data[0].jenggot == 'Hitam, Lebat, ' || dat.data[0].jenggot == 'Putih, Ikal, Lebat, ' || dat.data[0].jenggot == 'Putih, Lebat, ') {
                            //     $scope.model.jenggot5 = true
                            // } else {
                            //     $scope.model.jenggot5 = false
                            // }
                            // if (dat.data[0].jenggot == 'Jarang, ' || dat.data[0].jenggot == 'Hitam, Ikal, Jarang, ' || dat.data[0].jenggot == 'Hitam, Lurus, Jarang, ' || dat.data[0].jenggot == 'Putih, Lurus, Jarang, ' || dat.data[0].jenggot == 'Hitam, Jarang, ' || dat.data[0].jenggot == 'Putih, Ikal, Jarang, ' || dat.data[0].jenggot == 'Putih, Jarang, ') {
                            //     $scope.model.jenggot6 = true
                            // } else {
                            //     $scope.model.jenggot6 = false
                            // }
                            // // $scope.item.jenggot=dat.data[0].jenggot
                            // $scope.item.panjangjenggot=dat.data[0].	panjangjenggot
                        $scope.item.kelopak = dat.data[0].kelopakmatakanan
                            // $scope.item.kelopakmatakanan=dat.data[0].kelopakmatakanan
                            // $scope.item.kelopakmatakiri=dat.data[0].kelopakmatakiri
                            // $scope.item.selaputbeningmatakanan=dat.data[0].selaputbeningmatakanan
                            // $scope.item.selaputbeningmatakiri=dat.data[0].selaputbeningmatakiri
                            // $scope.item.telengmatakanan=dat.data[0].telengmatakanan
                            // $scope.item.telengmatakiri=dat.data[0].telengmatakiri
                            // $scope.item.warnatiraimatakanan=dat.data[0].warnatiraimatakanan
                            // $scope.item.warnatiraimatakiri=dat.data[0].warnatiraimatakiri
                            // $scope.item.selaputbolamatakanan=dat.data[0].selaputbolamatakanan
                            // $scope.item.selaputbolamatakiri=dat.data[0].selaputbolamatakiri
                            // $scope.item.selaputkelopakmatakanan=dat.data[0].selaputkelopakmatakanan
                            // $scope.item.selaputkelopakmatakiri=dat.data[0].selaputkelopakmatakiri
                        $scope.item.hidung = dat.data[0].hidung
                        $scope.item.gigi = dat.data[0].gigikananatas
                            // $scope.item.telinga=dat.data[0].telinga
                        $scope.item.mulut = dat.data[0].mulut
                            // $scope.item.mulutterbuka=dat.data[0].mulutterbuka
                            // $scope.item.lidah={ lidah:dat.data[0].lidah, id:dat.data[0].id }
                            // $scope.item.mulutkeluar=dat.data[0].lubangmulutkeluar
                            // $scope.item.hidungkeluar=dat.data[0].lubanghidungkeluar
                            // $scope.item.telingakanankeluar=dat.data[0].lubangtelingakanankeluar
                            // $scope.item.telingakirikeluar=dat.data[0].lubangtelingakirikeluar
                            // $scope.item.kemaluankeluar=dat.data[0].lubangkemaluankeluar
                            // $scope.item.pelepasankeluar=dat.data[0].lubangpelepasankeluar
                        $scope.item.lukaluka = dat.data[0].lukaluka
                        $scope.item.patahtulang = dat.data[0].patahtulang
                        $scope.item.lainlain = dat.data[0].lainlainluar
                        $scope.item.tanggaldalam = dat.data[0].tglpemeriksaandalam
                        $scope.item.jaringanlemak = dat.data[0].warnajaringanlemak
                        $scope.item.jaringanikat = dat.data[0].tebaljaringanlemak
                        $scope.item.selaputdinding = dat.data[0].warnaotot
                        $scope.item.lidah = dat.data[0].tebalotot
                        $scope.item.jantung = dat.data[0].tulangdada
                        $scope.item.paru = dat.data[0].tulangiga
                        $scope.item.limpa = dat.data[0].jarikeduaparu
                        $scope.item.hati = dat.data[0].ototleher
                        $scope.item.kandungempedu = dat.data[0].selaputdindingperut
                        $scope.item.kelenjarliur = dat.data[0].ototdindingperut
                        $scope.item.lambung = dat.data[0].ronggaperut
                        $scope.item.kelenjaranakginjal = dat.data[0].warnalidah
                        $scope.item.ginjal = dat.data[0].penampanglidah
                        $scope.item.kandungkemih = dat.data[0].tulanglidah
                        $scope.item.indung = dat.data[0].rawangondok
                        $scope.item.kulitkepala = dat.data[0].rawancincin
                        $scope.item.saluranluka = dat.data[0].saluranluka
                        $scope.item.pemeriksaanlab = dat.data[0].perabaangondok
                        $scope.item.kesimpulan = dat.data[0].kerongkongan
                        $scope.item.keterangangambar = dat.data[0].keterangangambar
                        $scope.item.keterangangambar2 = dat.data[0].keterangangambar2
                        $scope.item.keterangangambar3 = dat.data[0].keterangangambar3
                        $scope.item.keterangangambar4 = dat.data[0].keterangangambar4
                            // $scope.item.tebaljaringan=dat.data[0].tebaljaringanlemak
                            // $scope.item.warnaotot=dat.data[0].warnaotot
                            // $scope.item.tebalotot=dat.data[0].tebalotot
                            // $scope.item.sekatkanan=dat.data[0].tinggironggadadakanan
                            // $scope.item.sekatkiri=dat.data[0].tinggironggadadakiri
                            // $scope.item.tulangdada=dat.data[0].tulangdada
                            // $scope.item.tulangiga=dat.data[0].tulangiga
                            // $scope.item.ronggakanan=dat.data[0].dalamronggakanan
                            // $scope.item.ronggakiri=dat.data[0].dalamronggakiri
                            // $scope.item.kandungjantung=dat.data[0].kandungjantung
                            // $scope.item.jarikeduaparu=dat.data[0].jarikeduaparu
                            // $scope.item.kulitleher=dat.data[0].jaringanikatbawah
                            // $scope.item.ototleher=dat.data[0].ototleher
                            // $scope.item.dindingperu=dat.data[0].selaputdindingperut
                            // $scope.item.ototdindingperut=dat.data[0].ototdindingperut
                            // $scope.item.ronggaperut=dat.data[0].ronggaperut
                            // $scope.item.warnalidah=dat.data[0].warnalidah
                            // $scope.item.penampanglidah=dat.data[0].penampanglidah
                            // $scope.item.tulanglidah=dat.data[0].tulanglidah
                            // $scope.item.rawangondok=dat.data[0].rawangondok
                            // $scope.item.rawancincin=dat.data[0].rawancincin
                            // $scope.item.warnakelenjar=dat.data[0].warnakelenjargondok
                            // $scope.item.perabaangondok=dat.data[0].perabaangondok
                            // $scope.item.penampanggondok=dat.data[0].penampangkelenjargondok
                            // $scope.item.kelenjarkacangan=dat.data[0].kelenjarkacangan
                            // $scope.item.kerongkongan=dat.data[0].kerongkongan
                            // $scope.item.batangtenggorokan=dat.data[0].batangtenggorokan
                            // $scope.item.besarjatung=dat.data[0].besarjantung
                            // $scope.item.warnajantung=dat.data[0].warnajantung
                            // $scope.item.batangtenggorokanjantung=dat.data[0].batangtenggorokanjantung
                            // $scope.item.perabaanjantung=dat.data[0].perabaanjantung
                            // $scope.item.katupkanan=dat.data[0].lingkarankatupkanan
                            // $scope.item.katupkiri=dat.data[0].lingkarankatupkiri
                            // $scope.item.pembuluhnadiparu=dat.data[0].pembuluhnadiparu
                            // $scope.item.batangnadi=dat.data[0].batangnadi
                            // $scope.item.bilikkanan=dat.data[0].tebalototbilikkanan
                            // $scope.item.bilikkiri=dat.data[0].tebalototbilikkiri
                            // $scope.item.beratjantung=dat.data[0].beratjantung
                            // $scope.item.nadijantung=dat.data[0].pembuluhnadijantung
                            // $scope.item.dindingsekatjantung=dat.data[0].dindingsekatjantung
                            // $scope.item.parukanan=dat.data[0].parukanan
                            // $scope.item.warnaparukanan=dat.data[0].warnaparukanan
                            // $scope.item.perabaanparukanan=dat.data[0].perabaanparukanan
                            // $scope.item.warnapenampangparukanan=dat.data[0].warnapenampangparukanan
                            // $scope.item.pemilijitanparukanan=dat.data[0].pemilijitanparukanan
                            // $scope.item.beratpemilijitianparukanan=dat.data[0].beratpemilijitianparukanan
                            // $scope.item.parukiri=dat.data[0].parukiri
                            // $scope.item.warnaparukiri=dat.data[0].warnaparukiri
                            // $scope.item.perabaanparukiri=dat.data[0].perabaanparukiri
                            // $scope.item.warnapenampangparukiri=dat.data[0].warnapenampangparukiri
                            // $scope.item.pemilijitanparukiri=dat.data[0].pemilijitanparukiri
                            // $scope.item.beratpemilijitanparukiri=dat.data[0].beratpemilijitanparukiri
                            // $scope.item.warnalimpa=dat.data[0].warnalimpa
                            // $scope.item.permukaanlimpa=dat.data[0].permukaanlimpa
                            // $scope.item.tepilimpa=dat.data[0].tepilimpa
                            // $scope.item.perabaanlimpa=dat.data[0].perabaanlimpa
                            // $scope.item.warnapenampanglimpa=dat.data[0].warnapenampanglimpa
                            // $scope.item.gambaranlimpa=dat.data[0].gambaranlimpa
                            // $scope.item.pengikisanlimpa=dat.data[0].pengikisanlimpa
                            // $scope.item.beratlimpa=dat.data[0].beratlimpa
                            // $scope.item.warnahati=dat.data[0].warnahati
                            // $scope.item.permukaanhati=dat.data[0].permukaanhati
                            // $scope.item.tepihati=dat.data[0].tepihati
                            // $scope.item.perabaanhati=dat.data[0].perabaanhati
                            // $scope.item.warnapenampanghati=dat.data[0].warnapenampanghati
                            // $scope.item.gambaranhati=dat.data[0].gambaranhati
                            // $scope.item.berathati=dat.data[0].berathati
                            // $scope.item.kandungempeduberisi=dat.data[0].kandungempedu
                            // $scope.item.selaputlendir=dat.data[0].selaputlendir
                            // $scope.item.saluranempedu=dat.data[0].saluranempedu
                            // $scope.item.warnaperut=dat.data[0].warnaliurperut
                            // $scope.item.permukaanperut=dat.data[0].permukaanliurperut
                            // $scope.item.perabaanperut=dat.data[0].perabaanliurperut
                            // $scope.item.warnapenampangperut=dat.data[0].warnapenampangliurperut
                            // $scope.item.gambaranperut=dat.data[0].gambarankelenjarliur
                            // $scope.item.beratperut=dat.data[0].beratkelenjarliur
                            // $scope.item.isilambung=dat.data[0].isilambung
                            // $scope.item.selaputlendirlambung=dat.data[0].selaputlendirlambung
                            // $scope.item.ususduabelasjari=dat.data[0].ususduabelasjari
                            // $scope.item.usushalus=dat.data[0].usushalus
                            // $scope.item.ususbesar=dat.data[0].ususbesar
                            // $scope.item.bentukginjalkanan=dat.data[0].kelenjarginjalkanan
                            // $scope.item.warnaginjalkanan=dat.data[0].warnakelenjarginjalkanan
                            // $scope.item.penampangginjalkanan=dat.data[0].penampangkelenjarginjalkanan
                            // $scope.item.beratginjalkanan=dat.data[0].beratkelenjarginjalkanan
                            // $scope.item.bentukginjalkiri=dat.data[0].kelenjarginjalkiri
                            // $scope.item.warnaginjalkiri=dat.data[0].warnakelenjarginjalkiri
                            // $scope.item.penampangginjalkiri=dat.data[0].penampangkelenjarginjalkiri
                            // $scope.item.beratginjalkiri=dat.data[0].beratkelenjarginjalkiri
                            // $scope.item.lemakginjalkanan=dat.data[0].simpaiginjalkanan
                            // $scope.item.permukaanginjalkanan=dat.data[0].permukaanginjalkanan
                            // $scope.item.warnalemakginjalkanan=dat.data[0].warnaginjalkanan
                            // $scope.item.warnapenampangginjalkanan=dat.data[0].warnapenampangginjalkanan
                            // $scope.item.gambaranginjalkanan=dat.data[0].gambaranginjalkanan
                            // $scope.item.pialaginjalkanan=dat.data[0].pialaginjalkanan
                            // $scope.item.kemihginjalkanan=dat.data[0].kemihginjalkanan
                            // $scope.item.beratginjalkanan2=dat.data[0].beratginjalkanan
                            // $scope.item.lemakginjalkiri=dat.data[0].simpaiginjalkiri
                            // $scope.item.permukaanginjalkiri=dat.data[0].permukaanginjalkiri
                            // $scope.item.warnalemakginjalkiri=dat.data[0].warnaginjalkiri
                            // $scope.item.warnapenampangginjalkiri=dat.data[0].warnapenampangginjalkiri
                            // $scope.item.gambaranginjalkiri=dat.data[0].gambaranginjalkiri
                            // $scope.item.pialaginjalkiri=dat.data[0].pialaginjalkiri
                            // $scope.item.kemihginjalkiri=dat.data[0].kemihginjakiri
                            // $scope.item.beratginjalkiri2=dat.data[0].beratginjalkiri
                            // $scope.item.isikandungkemih=dat.data[0].kandungkemih
                            // $scope.item.selaputlendirkandungkemih=dat.data[0].selaputlendirkemih
                            // $scope.item.indungtelurkanan=dat.data[0].indungtelurkanan
                            // $scope.item.indungtelurkiri=dat.data[0].indungtelurkiri
                            // $scope.item.rahim=dat.data[0].rahim
                            // $scope.item.kulitkepaladalam=dat.data[0].kulitkepaladalam
                            // $scope.item.tulangtengkorak=dat.data[0].tulangtengkorak
                            // $scope.item.selaputkerasotak=dat.data[0].selaputkerasotak
                            // $scope.item.selaputlunakotak=dat.data[0].selaputlunakotak
                            // $scope.item.otakbesar=dat.data[0].otakbesar
                            // $scope.item.otakkecil=dat.data[0].otakkecil
                            // $scope.item.batangotak=dat.data[0].batangotak
                            // $scope.item.bilikotak=dat.data[0].bilikotak
                            // $scope.item.beratotak=dat.data[0].beratotak
                            // $scope.item.saluranluka=dat.data[0].saluranluka
                            // $scope.item.toksikologi=dat.data[0].toksikologi
                            // $scope.item.histologiforensik=dat.data[0].histologiforensik
                            // $scope.item.lainlaindalam=dat.data[0].lainlaindalam
                            // $scope.item.kesimpulan=dat.data[0].kesimpulan
                            // $scope.item.pemeriksaandalam=dat.data[0].pemeriksaandalam
                            // $scope.item.pemeriksaanluar=dat.data[0].pemeriksaanluar



                    } else {
                        $scope.item.kaku = "Kaku mayat terdapat pada : ... Lebam mayat terdapat pada : ..."
                        $scope.item.mayat = "Mayat adalah seorang ..."
                        $scope.item.rambut = "Rambut kepala berwarna : ... Alis mata berwarna : ... Bulu mata berawarna : ... Kumis Berwarna : ... Jenggot Berwarna : ..."
                        $scope.item.kelopak = "Kedua kelopak mata : ... Kedua selaput bening mata : ... Kedua teleng mata : ... Kedua tirai mata : ... Kedua selaput bola mata berwarna : ... Kedua selaput kelopak mata : ..."
                        $scope.item.hidung = "Hidung : ... Telinga : ... Mulut : ... Lidah : ..."
                        $scope.item.gigi = "Gigi geligi : ... Pada rahang atas sisi kiri : ... Pada rahang atas sisi kanan : ... Pada rahang bawah sisi kiri : ... Pada rahang bawah sisi kanan : ..."
                        $scope.item.jaringanlemak = "Jaringan lemak bawah kulit berwarna :.................. daerah dada setebal ...............mm\n\nOtot - otot berwarna ....................................... pada daerah dada setebal ................mm. Sekat rongga dada setinggi.................. kiri setinggi............................" +
                            "\n\nTulang dada :...........................\n\nTulang iga :...........................\n\nDalam rongga dada kanan terdapat :.................. sebelah kiri.............. kandung jantung tampak......... jari diantara kedua paru, berisi....................."
                        $scope.item.jaringanikat = "Jaringan ikat bawah kulit leher ...............................\nOtot Leher :"
                        $scope.item.selaputdinding = "Selaput dinding perut :\n\nOtot dinding perut :\n\nRongga perut :"
                        $scope.item.lidah = "Lidah berwarna.................................. penampang...........................\n\nTulang lidah :\n\nRawan gondok :\n\nRawan cincin :\n\nKelenjar gondok berwarna.........................perabaan.................penampang.................\n\nKelenjar kacangan :\n\nKerongkongan\n\nBatang tenggorokan :"
                        $scope.item.jantung = "Jantung sebesar...........kali tinju kanan mayat, berwarna..................perabaan............lingkaran katup serambi kanan..... sentimeter, kiri......sentimeter pembuluh nadi paru........sentimeter, batang nadi..... sentimeter, Tebal otot bilik kanan...... milimeter, bilik kiri.......milimeter, Berat jantung...... gram.\n\nPembuluh nadi jantung............\n\nDinding dan sekat jantung.............."
                        $scope.item.paru = "Paru kanan............baga, berwarna..................... perabaan.................. penampang berwarna............... pada pemijitan keluar................... berat......... gram. Paru kiri...............baga, berwarna..............., perabaan.........penampang berwarna..................pada pemilijitan keluar.............. berat................ gram."
                        $scope.item.limpa = "Limpa berwarna................permukaan...............tepi..............perabaan............penampang berwarna.................gambaran hati................berat.............gram."
                        $scope.item.hati = "Hati berwarna.......................... permukaan....................tepi.................perabaan..............penampang berwarna..............gambaran hati.....................berat.............gram."
                        $scope.item.kandungempedu = "Kandung empedu berisi.......................... selaput lendir................. saluran empedu.................."
                        $scope.item.kelenjarliur = "Kelenjar liur perut berwarna.....................permukaan...............perabaan................penampang berwarna........................gambaran kelenjar..................berat...............gram"
                        $scope.item.lambung = "Lambung berisi............................selaput lendir..............................\n\nUsus dua belas jari:\n\nUsus halus :\n\nUsus besar :"
                        $scope.item.kelenjaranakginjal = "Kelenjar anak ginjal kanan berbentuk................... warna................ penampang...............berat..................gram. Kiri berbentuk..............warna..................penampang..................berat................gram."
                        $scope.item.ginjal = "Ginjal kanan, simpai lemak.................simpai ginjal....................permukaan ginjal.................warna........................penampnag berwarna......................gambaran ginjal....................piala ginjal..................saluran kemih.................berat.................gram" +
                            "\n\nGinjal kiri, simpai lemak...........................simpai ginjal............................permukaan ginjal.....................warna.........................penampang berwarna............gambaran ginjal..............piala ginjal................saluran kemih..................berat.....................gram."
                        $scope.item.kandungkemih = "Kandung kemih berisi................ selaput lendir....................."
                        $scope.item.indung = "Indung telur kanan :\n\nIndung telur kiri :\n\n Rahim :\n\n"
                        $scope.item.kulitkepala = "Kulit kepala bagian dalam :\n\nTulang tengkorak :\n\nSelaput keras otak :\n\nSelaput lunak otak :\n\nOtak besar :\n\nOtak kecil :\n\nBatang otak :\n\nBilik otak :..............................Berat otak........................gram."
                        $scope.item.saluranluka = "Saluran luka :"
                        $scope.item.pemeriksaanlab = "Pemeriksaan laboratorium :\n\nToksikologi :\n\nHistologi forensik\n\nLain - lain :"

                        medifirstService.get('sysadmin/general/get-daftar-template?id=30').then(function(res) {
                            if (res.data.data.length > 0)
                                $scope.user.poto = res.data.data[0].template

                        })
                        medifirstService.get('sysadmin/general/get-daftar-template?id=31').then(function(res) {
                            if (res.data.data.length > 0)
                                $scope.user.poto2 = res.data.data[0].template

                        })

                        medifirstService.get('sysadmin/general/get-daftar-template?id=32').then(function(res) {
                            if (res.data.data.length > 0)
                                $scope.user.poto3 = res.data.data[0].template

                        })
                        medifirstService.get('sysadmin/general/get-daftar-template?id=33').then(function(res) {
                                if (res.data.data.length > 0)
                                    $scope.user.poto4 = res.data.data[0].template

                            })
                            // debugger;
                            // $scope.user.poto2 = ""
                    }
                })
            }

            // $scope.Upload = function () {
            //     debugger;
            //     kendo.drawing.drawDOM($("#surface"))
            //         .then(function (group) {
            //             debugger;
            //             // Render the result as a SVG document
            //             return kendo.drawing.exportImage(group);
            //         })
            //         .done(function (data) {
            //             // debugger
            //             // // Save the SVG document
            //             // if ($scope.isTTD == true) {
            //             //     var objectfk = "RI-APKTTP"
            //             // } else {
            //             //     objectfk = "RI-APKTTD"
            //             // }
            //             // var objHead = {}
            //             // debugger;
            //             // objHead = {
            //             //     'noregistrasifk': $state.params.noRec,
            //             //     'file': data,
            //             //     'objectfile': $scope.item.noregistrasi + '.PNG',
            //             //     'riwayatpapfk': $scope.noRecPap,
            //             //     'objectfk': objectfk,
            //             //     'norec_pd': $scope.norecpd,
            //             //     'norec': $scope.norecPDF
            //             // }
            //             // var objsave = {}
            //             // objsave = {
            //             //     'head': objHead
            //             // }
            //             // //postpost
            //             // // managePhp.postData2(objsave, 'registrasi/laporan/save-pemeriksaan-dokter-forensik').then(function (e) {
            //             // //     init();

            //             // //     surface.clear();

            //             // // });
            //             // medifirstService.post("registrasi/laporan/save-pemeriksaan-dokter-forensik", objHead).then(function (e) {
            //             //     init();

            //             //     surface.clear();
            //             // })

            //             // kendo.saveAs({
            //             //     dataURI: data,
            //             //     fileName: "signature.svg",
            //             //     // proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
            //             // });
            //         });
            // }

            $scope.cetak = function() {
                debugger
                if ($scope.norecPDF != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-forensik?norec=" + $scope.norecPDF + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }
            $scope.cetakGambar = function() {
                debugger
                if ($scope.norecPDF != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-gambar-forensik?norec=" + $scope.norecPDF + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }
            $scope.saveNew = function() {
                debugger
                if ($scope.item.pegawailuar == undefined) {
                    $scope.item.pegawailuar = {
                        id: null
                    };
                }
                if ($scope.item.pegawailuar2 == undefined) {
                    $scope.item.pegawailuar2 = {
                        id: null
                    };
                }
                if ($scope.item.pegawailuar3 == undefined) {
                    $scope.item.pegawailuar3 = {
                        id: null
                    };
                }
                if ($scope.item.pegawaidalam == undefined) {
                    $scope.item.pegawaidalam = {
                        id: null
                    };
                }
                if ($scope.item.pegawaidalam2 == undefined) {
                    $scope.item.pegawaidalam2 = {
                        id: null
                    };
                }
                if ($scope.item.pegawaidalam3 == undefined) {
                    $scope.item.pegawaidalam3 = {
                        id: null
                    };
                }
                kendo.drawing.drawDOM($(".surface"))
                    .then(function(group) {
                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group);
                    }).done(function(data) {
                        kendo.drawing.drawDOM($(".surface2"))
                            .then(function(group) {
                                // Render the result as a SVG document
                                return kendo.drawing.exportImage(group);
                            }).done(function(data2) {
                                kendo.drawing.drawDOM($(".surface3"))
                                    .then(function(group) {
                                        // Render the result as a SVG document
                                        return kendo.drawing.exportImage(group);
                                    }).done(function(data3) {
                                        kendo.drawing.drawDOM($(".surface4"))
                                            .then(function(group) {
                                                // Render the result as a SVG document
                                                return kendo.drawing.exportImage(group);
                                            }).done(function(data4) {
                                                debugger
                                                if ($scope.norecPDF == undefined) {
                                                    $scope.norecPDF = '';
                                                }
                                                var save = {
                                                    tglttd: moment($scope.item.tglttd).format('YYYY-MM-DD HH:mm:ss'),
                                                    nomorsurat: $scope.item.nomorsurat,
                                                    tanggalluar: moment($scope.item.tanggalluar).format('YYYY-MM-DD HH:mm:ss'),
                                                    pegawailuar: $scope.item.pegawailuar.id,
                                                    pegawailuar2: $scope.item.pegawailuar2.id,
                                                    pegawailuar3: $scope.item.pegawailuar3.id,
                                                    tanggalpermintaan: moment($scope.item.tanggalpermintaan).format('YYYY-MM-DD HH:mm:ss'),
                                                    ataspermintaan: $scope.item.ataspermintaan,
                                                    nomor: $scope.item.nomor,
                                                    tandatangan: $scope.item.tandatangan,
                                                    pangkat: $scope.item.pangkat,
                                                    label: $scope.item.label,
                                                    bungkusmayat: $scope.item.bungkusmayat,
                                                    perhiasan: $scope.item.perhiasan,
                                                    pakaian: $scope.item.pakaian,
                                                    benda: $scope.item.benda,
                                                    kaku: $scope.item.kaku,
                                                    mayat: $scope.item.mayat,
                                                    identitaskhusus: $scope.item.identitaskhusus,
                                                    rambut: $scope.item.rambut,
                                                    kelopak: $scope.item.kelopak,
                                                    hidung: $scope.item.hidung,
                                                    gigi: $scope.item.gigi,
                                                    mulut: $scope.item.mulut,
                                                    lukaluka: $scope.item.lukaluka,
                                                    patahtulang: $scope.item.patahtulang,
                                                    lainlain: $scope.item.lainlain,
                                                    //dalam
                                                    tanggaldalam: moment($scope.item.tanggaldalam).format('YYYY-MM-DD HH:mm:ss'),
                                                    pegawaidalam: $scope.item.pegawaidalam.id,
                                                    pegawaidalam2: $scope.item.pegawaidalam2.id,
                                                    pegawaidalam3: $scope.item.pegawaidalam3.id,
                                                    jaringanlemak: $scope.item.jaringanlemak,
                                                    jaringanikat: $scope.item.jaringanikat,
                                                    selaputdinding: $scope.item.selaputdinding,
                                                    lidah: $scope.item.lidah,
                                                    jantung: $scope.item.jantung,
                                                    paru: $scope.item.paru,
                                                    limpa: $scope.item.limpa,
                                                    hati: $scope.item.hati,
                                                    kandungempedu: $scope.item.kandungempedu,
                                                    kelenjarliur: $scope.item.kelenjarliur,
                                                    lambung: $scope.item.lambung,
                                                    kelenjaranakginjal: $scope.item.kelenjaranakginjal,
                                                    ginjal: $scope.item.ginjal,
                                                    kandungkemih: $scope.item.kandungkemih,
                                                    indung: $scope.item.indung,
                                                    kulitkepala: $scope.item.kulitkepala,
                                                    saluranluka: $scope.item.saluranluka,
                                                    pemeriksaanlab: $scope.item.pemeriksaanlab,
                                                    kesimpulan: $scope.item.kesimpulan,
                                                    // foto1: $scope.user.poto,
                                                    'file': data,
                                                    'file2': data2,
                                                    'file3': data3,
                                                    'file4': data4,
                                                    keterangangambar: $scope.item.keterangangambar,
                                                    keterangangambar2: $scope.item.keterangangambar2,
                                                    keterangangambar3: $scope.item.keterangangambar3,
                                                    keterangangambar4: $scope.item.keterangangambar4,
                                                    norecpd: $scope.norecpd,
                                                    norec: $scope.norecPDF
                                                }
                                                medifirstService.post('jenazah/save-forensik-new', save).then(function(e) {
                                                    loadPDF()
                                                })
                                            })
                                    })
                            })
                    })
            }
            $scope.cetakJasper = function() {
                debugger;
                var dokterluar = "";
                if ($scope.item.pegawailuar != undefined && $scope.item.pegawailuar2 == undefined && $scope.item.pegawailuar3 == undefined) {
                    dokterluar = $scope.item.pegawailuar.namalengkap
                } else if ($scope.item.pegawailuar != undefined && $scope.item.pegawailuar2 != undefined && $scope.item.pegawailuar3 == undefined) {
                    dokterluar = $scope.item.pegawailuar.namalengkap + ", " + $scope.item.pegawailuar2.namalengkap
                } else if ($scope.item.pegawailuar != undefined && $scope.item.pegawailuar2 != undefined && $scope.item.pegawailuar3 != undefined) {
                    dokterluar = $scope.item.pegawailuar.namalengkap + ", " + $scope.item.pegawailuar2.namalengkap + ", " + $scope.item.pegawailuar3.namalengkap
                } else {
                    dokterluar = "";
                }
                medifirstService.get('jenazah/get-format-tanggal-cuy?tanggal=' + moment($scope.item.tanggalpermintaan).format('YYYY-MM-DD HH:mm:ss')).then(function(dat) {
                    debugger
                    var tglpermintaan = dat.data.tglpermintaan
                    var tglsekarang = dat.data.tglsekarang
                    var title = "Kami yang bertanda tangan dibawah ini " + dokterluar + " di Rumah Sakit Bhayangkara Tk. I R. Said Sukanto, berdasarkan permintaan tertulis dari " +
                        $scope.item.ataspermintaan + " dengan surat nomor " + $scope.item.nomor + ", tertanggal " + tglpermintaan + " perihal permintaan Visum " +
                        "et Repertum, maka dengan ini menerangkan bahwa pada tanggal " + tglsekarang + " Waktu Indonesia Barat, bertempat di " +
                        "Ruang Otopsi Rumah Sakit Bhayangkara Tk. I R. Said Sukanto telah melakukan pemeriksaan luar atas jenazah yang menurut surat permintaan visum tersebut memiliki identitas sebagai berikut"
                    var temp11 = title.length;

                    $scope.isRouteLoading = true;
                    var data = {
                        "gambarLogo": "Lambang_Polri.jpg",
                        "paramKey": ["norec", "title"], //,"temp","nama","ttl","agama","jeniskelamin","warganegara","pekerjaan"
                        "paramValue": [$scope.norecPDF, title], //,temp,angkanama,angkattl,angkaagama,angkajeniskelamin,angkawarganegara,angkapekerjaan
                        "paramType": ["", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            console.log(this.response, typeof this.response);
                            //var res = this.response
                            //var file = new Blob( [res], {type: 'application/pdf'});
                            debugger;
                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }
                    if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/forensiknew.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:1002/generic/report/forensiknew.pdf');
                    } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/forensiknew.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:1002/generic/report/forensiknew.pdf');
                    } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                        xhr.open('POST', 'http://36.92.186.59:1002/generic/report/forensiknew.pdf');
                    } else if (window.location.hostname.indexOf('172.10.3.68') > -1) {
                        xhr.open('POST', 'http://172.10.3.68:1002/generic/report/forensiknew.pdf');
                    } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                        xhr.open('POST', 'http://103.93.237.70:1002/generic/report/forensiknew.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/forensiknew.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    $scope.isRouteLoading = false;

                })
            }

        }

    ])
})