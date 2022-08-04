define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PerhitunganIndexPostRemunCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.itm = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.item.jmlRows = 100
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0

            var dataSave = []
            var dataPegawaiAll = []
            var data3 = []

            loadData()

            $scope.formatTanggal = function (tanggal) {
                if(tanggal =='null')
                return '-'
                if(tanggal =='')
                return '-'
                else
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.SearchData = function () {
                loadData()
            }
            function loadData() {
                $scope.isRouteLoading = true;
                // var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                // var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.namapegawai != undefined) {
                    var nm = "&namalengkap=" + $scope.item.namapegawai
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                $q.all([
                    medifirstService.get("remunerasi/get-daftar-index-pegawai?" +
                        reg + rm + nm + ins + rg + kp + dk
                        + '&jmlRows=' + jmlRows),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // data1 = data[0].data.data1
                    data3 = data[0].data.datapersen
                    for (var i = 0; i < data[0].data.data.length; i++) {
                        var element = data[0].data.data[i];
                        element.totalindex = parseFloat(element.totalindex).toFixed(2)
                        if(element.poinjpu!=null)
                        element.poinjpu = parseFloat(element.poinjpu).toFixed(4)
                        for (var key in element) {
                            if (element[key] == null )
                               element[key]  = ''
                        }
                    }
                    $scope.data1 = new kendo.data.DataSource({
                        data: data[0].data.data,
                        pageSize: 10,
                        // group: $scope.group,
                        // total:data1.data,
                        serverPaging: false,
                    });
                    // var chacePeriode = tglAwal + "~" + tglAkhir;
                    // cacheHelper.set('PerhitunganIndexPostRemunCtrl', chacePeriode);
                });

            };
            $scope.columnData1 = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "idpegawai",
                        "title": "ID",
                        "width": "80px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Lengkap",
                        "width": "250px"
                    },
                    {
                        "field": "poinjpu",
                        "title": "Point JPU",
                        "width": "100px"
                    },
                    {
                        "field": "namajabatan",
                        "title": "Jabatan",
                        "width": "200px"
                    },
                   
                    {
                        "field": "golongan",
                        "title": "Golongan",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: golongan #'}}</span>"
                    },
                    {
                        "field": "pendidikan",
                        "title": "Pendidikan",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: pendidikan #'}}</span>"
                    },
                    {
                        "field": "unitkerja",
                        "title": "Unit Kerja",
                        "width": "200px",
                        "template": "<span class='style-center'>{{'#: unitkerja #'}}</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Sub Unit Kerja",
                        "width": "200px",
                        "template": "<span class='style-center'>{{'#: namaruangan #'}}</span>"
                    },
                    {
                        "field": "petugasdiklat",
                        "title": "Diklat",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: petugasdiklat #'}}</span>"
                    },
                    {
                        "field": "tglmasuk",
                        "title": "Tgl Masuk",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        "field": "poinjb",
                        "title": "Point Jabatan",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poinjb #'}}</span>"
                    },
                    {
                        "field": "poingol",
                        "title": "Point Golongan",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poingol #'}}</span>"
                    },
                    {
                        "field": "poinpdd",
                        "title": "Point Pendidikan",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poinpdd #'}}</span>"
                    },
                    {
                        "field": "poinru",
                        "title": "Point Ruangan ",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poinru #'}}</span>"
                    },
                    {
                        "field": "poindiklat",
                        "title": "Point Diklat",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poindiklat #'}}</span>"
                    },
                    {
                        "field": "poinmasakerja",
                        "title": "Point Masa Kerja",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poinmasakerja #'}}</span>"
                    },
                    {
                        "field": "totalindex",
                        "title": "Total Point JPT",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poinmasakerja #'}}</span>"
                    },
                   
                ]
            };
            // $scope.columnData1 = {
            //     selectable: 'row',
            //     pageable: true,
            //     columns: [
            //         {
            //             "field": "idpegawai",
            //             "title": "ID",
            //             "width": "80px"
            //         },
            //         {
            //             "field": "namakaryawan",
            //             "title": "Nama Karyawan",
            //             "width": "250px"
            //         },
            //         {
            //             "field": "jabatan",
            //             "title": "Jabatan",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "statuskerja",
            //             "title": "Status Kerja",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "golongan",
            //             "title": "Golongan",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: golongan #'}}</span>"
            //         },
            //         {
            //             "field": "skpertamamasukrs",
            //             "title": "Tgl SK",
            //             "width": "100px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: skpertamamasukrs #')}}</span>"
            //         },
            //         {
            //             "field": "basicindex",
            //             "title": "Basic Index",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: basicindex #'}}</span>"
            //         },
            //         {
            //             "field": "pendidikan",
            //             "title": "Pendidikan",
            //             "width": "130px"
            //         },
            //         {
            //             "field": "cidx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: cidx #'}}</span>"
            //         },
            //         {
            //             "field": "crating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: crating #'}}</span>"
            //         },
            //         {
            //             "field": "competencyindex",
            //             "title": "CompetencyIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: competencyindex #'}}</span>"
            //         },
            //         {
            //             "field": "unitkerja",
            //             "title": "Unit Kerja",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "risk",
            //             "title": "Risk",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: risk #'}}</span>"
            //         },
            //         {
            //             "field": "ridx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: ridx #'}}</span>"
            //         },
            //         {
            //             "field": "rrating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: rrating #'}}</span>"
            //         },
            //         {
            //             "field": "riskindex",
            //             "title": "Risk Index",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: riskindex #'}}</span>"
            //         },
            //         {
            //             "field": "emergency",
            //             "title": "Emergency",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: emergency #'}}</span>"
            //         },
            //         {
            //             "field": "eidx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: eidx #'}}</span>"
            //         },
            //         {
            //             "field": "erating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: erating #'}}</span>"
            //         },
            //         {
            //             "field": "emergencyindex",
            //             "title": "EmergencyIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: emergencyindex #'}}</span>"
            //         },
            //         {
            //             "field": "pidx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: pidx #'}}</span>"
            //         },
            //         {
            //             "field": "prating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: prating #'}}</span>"
            //         },
            //         {
            //             "field": "positionindex",
            //             "title": "PositionIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: positionindex #'}}</span>"
            //         },
            //         {
            //             "field": "performanceindex",
            //             "title": "PerformanceIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: performanceindex #'}}</span>"
            //         },
            //         {
            //             "field": "totalindex",
            //             "title": "Total Index",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: totalindex #'}}</span>"
            //         },
            //         // {
            //         // 	"field": "nostrukpagu",
            //         // 	"title": "Nostrukpagu",
            //         // 	"width":"100px"
            //         // },
            //         //         	{
            //         // 	"field": "periodeawal",
            //         // 	"title": "Tgl Pelayanan",
            //         // 	"width":"100px",
            //         // 	"template": "<span class='style-left'>{{formatTanggal('#: periodeawal #')}}</span>"
            //         // }
            //     ]
            // };
            // $scope.$watch('item.namapegawai', function(newValue, oldValue) {
            //           if (newValue != oldValue  ) {
            //           	if (oldValue.length == 4) {

            //           	}

            //           	if (oldValue.length == 2) {

            //           	}
            //           	var str = newValue
            //               if (str.length == 2) {
            //               	$scope.item.namapegawai = newValue + '-'
            //               }
            //               if (str.length == 5) {
            //               	$scope.item.namapegawai = newValue + '-'
            //               }
            //           }
            //       });

            $scope.ubahDataIndex = function () {
                $scope.popupDetailIndex.center().open();
                $scope.itm = $scope.data1Selected
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
            $scope.cetakKartu = function () {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataPasienSelected.tglpulang == undefined) {
                    window.messageContainer.error("Pasien Belum Dipulangkan!!!");
                    return;
                }
                if ($scope.dataPasienSelected.noregistrasi == undefined)
                    var noReg = "";
                else
                    var noReg = $scope.dataPasienSelected.noregistrasi;
                var stt = 'false'
                if (confirm('View Kartu Pulang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }
            // END ################

        }
    ]);
});