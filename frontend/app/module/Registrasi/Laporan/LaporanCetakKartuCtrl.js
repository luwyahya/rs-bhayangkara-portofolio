define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanCetakKartuCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable ]\
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.istempatLaporan = true;
            $scope.listStatus = [{ id: 1, status: 'BARU' }, { id: 2, status: 'LAMA' }]
            LoadDataCombo()
            LoadData()

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

            function LoadDataCombo() {
                //sdm service hanya sementara, nanti harus diganti pake service kasir !!
                medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {
                    $scope.listPegawai = dat.data.pegawai;
                    $scope.listPasien = dat.data.kelompokpasien;
                    $scope.listDepartemen = dat.data.departemen;
                });


                // ManageSdm.getItem("service/list-generic/?view=Departemen&select=*").then(function (dat) {
                //     $scope.listDepartemen = dat.data;
                // });


                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;

                //debugger;
                $scope.date = new Date();
                var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

                //Tanggal Default
                $scope.item.tglawal = tanggals + " 00:00";
                $scope.item.tglakhir = tanggals + " 23:59";

                // Tanggal Inputan
                $scope.tglawal = $scope.item.tglawal;
                $scope.tglakhir = $scope.item.tglakhir;
                $scope.pegawai = medifirstService.getPegawai();
            }

            $scope.CetakPasienDaftar = function () {
                // if($scope.item.format == undefined){
                // 	alert('format file harus dipilih terlebih dahulu !!!')
                // }
                //debugger;
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");

                if ($scope.item.KelompokPasien == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.KelompokPasien.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                var stt = 'false'
                if (confirm('View Laporan Pasien Daftar? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdRuangan=' + ruangan + '&strIdDepartement=' + departement + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&view=' + stt, function (response) {
                    // do something with response
                });
                // if(client.status==0){
                //     if($scope.item.format == undefined){
                //         alert('format file harus dipilih terlebih dahulu !!!');
                //     }else{
                //         var urlLaporan = ReportPelayanan.open('preporting/lapPelayananPasien?startDate=''+tglawal+'+tglawal+'&tglAkhir='+tglakhir+'&strIdRuangan='+ruangan+'&strIdDepartement='+departement+'&strIdKelompokPasien='+kelompokPasien+'&strIdDokter='+namaPegawai+'&format='+$scope.item.format.format);
                //         window.open(urlLaporan, '_blank');
                //     }
                // }   
            };


            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData()

            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                //debugger;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }

                var status = "";
                if ($scope.item.Status != undefined) {
                    status = "&StatusPasien=" + $scope.item.Status.status;
                }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanCetakKartuCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-cetak-kartu?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir)
                    // + tempDepartemenId
                    // + tempRuanganId
                    // + tempKelPasienId
                    // + status)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas
                        });
                    })
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm:ss');
            }
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm:ss');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }
            $scope.detailcetakkartu = function () {
                debugger
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                // var norec = $scope.dataPasienSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["tglawal", "tglakhir"],
                    "paramValue": [tglAwal.toString(), tglAkhir.toString()], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/detailcetakkartu.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1003/generic/report/detailcetakkartu.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/detailcetakkartu.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1003/generic/report/detailcetakkartu.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1003/generic/report/detailcetakkartu.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/detailcetakkartu.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.optionsGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Daftar Cetak Kartu Pasien" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [{
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    // "template": "<span class='style-left'>{{formatTanggal('#: namapasien #')}}</span>",
                    // "width": 120,
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                },
                {
                    "field": "namalengkap",
                    "title": "Petugas Cetak",
                },
                {
                    "field": "tanggal",
                    "title": "Tanggal Cetak",
                    "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>",
                    // "width": 120,
                },

                ],

            };

        }
    ]);
});