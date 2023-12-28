define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPersediaanCtrl', ['$scope', 'ModelItem', 'DateHelper', 'MedifirstService', '$q', '$rootScope',
        function ($scope, ModelItem, dateHelper, medifirstService, $q, $rootScope) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.istempatLaporan = true;
            $scope.selectedNamaPenjamin = [];
            $scope.isRouteLoading = false;
            FormLoad();
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
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

            function FormLoad() {
                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;

                $scope.listDataFormat = [

                    {
                        "id": 1,
                        "format": "pdf"
                    },
                    {
                        "id": 2,
                        "format": "xls"
                    }

                ]

                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    $scope.listRuangan = data.data.ruangan;
                    $scope.listRuangann = data.data.ruanganall;
                });
                $scope.date = new Date();
                var tanggals = dateHelper.getDateTimeFormatted3($scope.date);
                //Tanggal Default
                $scope.item.tglawal = tanggals + " 00:00";
                $scope.item.tglakhir = tanggals + " 23:59";
                $scope.pegawai = medifirstService.getPegawaiLogin();
            }
            medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
                $scope.sourceDataDepartemen = data.data.departemen;
                // $scope.kelompokPasiens = e.data.datarekanan
                debugger
                $scope.listKelompokPasien = data.data.kelompokpasien;
                $scope.sourceDataRekanan = data.data.rekanan;
            })
            // $scope.$watch('item.namaPenjamin', function (e) {
            //     // debugger;
            //     if (e === undefined) return;
            //     findPasien.getDataRekanan(e.id).then(function (data) {
            //         $scope.sourceDataRekanan = data.data.data.listData;
            //         $scope.item.institusiAsalPasien = $scope.sourceDataRekanan;
            //     });
            //     if (e.id == 5 || e.id == 3) {
            //         $scope.Perusahaan = true
            //     } else {
            //         $scope.Perusahaan = false
            //         $scope.item.institusiAsalPasien = ""
            //     }
            // })
            $scope.selectnamaPenjamin = {
                dataTextField: "kelompokpasien",
                dataValueField: "id",
                filter: "contains"
            };
            $scope.Cetak = function () {
                var tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                var stt = 'false'
                if (confirm('View txt Persediaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/simakbmn?cetak-simak-txt=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&view=' + stt, function (response) { });
            };

            $scope.CetakRiwayatPersediaan = function () {
                var tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruangan = "";
                if ($scope.item.ruangan != undefined) {
                    ruangan = $scope.item.ruangan.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Persediaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rekappersediaan=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdRuangan=' + ruangan + '&view=' + stt + '&user=' + $scope.dataLogin.namaLengkap, function (response) { });
            };
            $scope.cetakembalase = function () {
                var tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                var ruangan = "";
                if ($scope.item.ruangan != undefined) {
                    ruangan = $scope.item.ruangan.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Persediaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rekapjasaresep=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdRuangan=' + ruangan + '&view=' + stt + '&user=' + $scope.dataLogin.namaLengkap, function (response) { });
            };
            // $scope.cetaklaporanobattap = function () {
            //     var tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
            //     var tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
            //     var ruangan = "";
            //     if ($scope.item.ruangan != undefined) {
            //         ruangan = $scope.item.ruangan.id;
            //     }
            //     var stt = 'false'
            //     if (confirm('View Laporan Persediaan? ')) {
            //         // Save it!
            //         stt = 'true';
            //     } else {
            //         // Do nothing!
            //         stt = 'false'
            //     }

            //     var client = new HttpClient(); 
            //     $scope.isRouteLoading = false;      
            //     client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-laporanobattap='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
            //                 + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId +  '&view='+ stt, function(response) {

            //     });
            // };
            $scope.CetakLapDetail = function () {
                $scope.popUpTap = false;
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }
                var tempRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    debugger
                    tempRekanan = $scope.item.rekanan.id;
                }
                var tempDepart = "";
                if ($scope.item.Departemen != undefined) {
                    tempDepart = $scope.item.Departemen.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }


                var client = new HttpClient();
                $scope.isRouteLoading = false;

                // $scope.popUpObatDetail.center().open();
                // manageTataRekening.getDataTableTransaksi("logistik-stok/get-DetailPenjualanObat?"
                //     + 'tglawal='+ tglAwal 
                //     + '&tglakhir='+ tglAkhir 
                //     + '&ruanganfk=' + tempRuanganId 
                //     + '&strIdKelompokPasien=' + tempKelompokPasienId 
                //     + '&strIdPegawai=' + tempDokterId
                //     + '&rekanan='+ tempRekanan
                //     ).then(function(data) {
                //           $scope.dataSourceObatDetail = data.data;

                // })  

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&rekanan=' + tempRekanan + '&departement=' + tempDepart + '&view=' + stt,
                    function (response) {
                        // do something with response

                    });
            }
            $scope.CetakLapRekapPerRuangan = function () {
                $scope.popUpTap = false;
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }
                var tempRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    debugger
                    tempRekanan = $scope.item.rekanan.id;
                }
                var tempDepart = "";
                if ($scope.item.Departemen != undefined) {
                    tempDepart = $scope.item.Departemen.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }


                var client = new HttpClient();
                $scope.isRouteLoading = false;

                // $scope.popUpObatDetail.center().open();
                // manageTataRekening.getDataTableTransaksi("logistik-stok/get-DetailPenjualanObat?"
                //     + 'tglawal='+ tglAwal 
                //     + '&tglakhir='+ tglAkhir 
                //     + '&ruanganfk=' + tempRuanganId 
                //     + '&strIdKelompokPasien=' + tempKelompokPasienId 
                //     + '&strIdPegawai=' + tempDokterId
                //     + '&rekanan='+ tempRekanan
                //     ).then(function(data) {
                //           $scope.dataSourceObatDetail = data.data;

                // })  

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObatPerRuangan=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&rekanan=' + tempRekanan + '&view=' + stt + '&depart=' + tempDepart,
                    function (response) {
                        // do something with response

                    });
            }
            $scope.CetakJasaResep = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');

                var ruanganPilih = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganPilih = $scope.item.ruangan.id;
                } else {
                    toastr.warning('Ruangan Dipilih Terlebihdahulu, Peringatan!');
                    return;
                }
                var departpilih = ""
                if ($scope.item.Departemen != undefined) {
                    departpilih = $scope.item.Departemen.id;
                }
                var penjaminpilih = ""
                if ($scope.item.namaPenjamin != undefined) {
                    penjaminpilih = $scope.item.namaPenjamin.id;
                }
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "tglAwal", "tglAkhir", "objectruanganfk", "instalasi", "penjamin"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR".toString(), "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211".toString(), tglAwal, tglAkhir, ruanganPilih.toString(), departpilih.toString(), penjaminpilih.toString()],
                    "paramType": ["", "", "", "", "", "", ""]
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
                if (window.location.hostname.indexOf('localhost') > -1) {
                   xhr.open('POST', 'http://127.0.0.1:8797/generic/report/RekapPemberianResepDanJasa.pdf');
                } else  {
                    xhr.open('POST', '/jasper1/generic/report/RekapPemberianResepDanJasa.pdf');
                }  
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;


            }
            $scope.formatRupiah = function(value, currency) {
              return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.findData = function () {
              $scope.isRouteLoading = true;
              var tglAwal = moment($scope.item.tglawal).format("YYYY-MM-DD HH:mm:ss");
              var tglAkhir = moment($scope.item.tglakhir).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              debugger;
              var ruanganPilih = "";
              if ($scope.item.ruangan != undefined) {
                ruanganPilih = $scope.item.ruangan.id;
              } else {
                  toastr.warning('Ruangan Wajib Dipilih Terlebih dahulu!');
                  $scope.isRouteLoading = false;
                  return;
              }
              var departpilih = "";
              if ($scope.item.Departemen != undefined) {
                departpilih = $scope.item.Departemen.id;
              }
              var penjaminpilih = "";
              if ($scope.selectedNamaPenjamin.length != 0) {
                for (var i = $scope.selectedNamaPenjamin.length - 1; i >= 0; i--) {
                    var c = $scope.selectedNamaPenjamin[i].id
                    if (penjaminpilih == "") {
                        penjaminpilih = $scope.selectedNamaPenjamin[i].id
                    } else {
                        penjaminpilih = penjaminpilih + "," + $scope.selectedNamaPenjamin[i].id
                    }
                }
              }
              medifirstService
                .get(
                  "rawatjalan/get-laporan-persediaan?idRuangan=" +
                    ruanganPilih +
                    "&tglAwal=" +
                    tglAwal +
                    "&tglAkhir=" +
                    tglAkhir +
                    "&idDept=" +
                    departpilih +
                    "&idPenjamin=" +
                    penjaminpilih
                )
                .then(function (e) {
                  $scope.isRouteLoading = false;
                  debugger;
                  var datas = e.data.data;
                  $scope.GridPasien = new kendo.data.DataSource({
                    data: datas,
                    group: $scope.group,
                    pageSize: 400,
                    total: datas.length,
                    serverPaging: false,
                    schema: {
                      model: {
                        fields: {},
                      },
                    },
                    aggregate: [
                      { field: "total", aggregate: "sum" },
                      { field: "hargajual", aggregate: "sum" },
                      { field: "jasa", aggregate: "sum" },
                      { field: "diskon", aggregate: "sum" },
                    ],
                    refresh: true,
                    selectable: true,
                    groupable: true,
                    allowCopy: true,
                  });
                });
            };
            $scope.mainGridOptions = {
              toolbar: ["excel"],
              excel: {
                fileName: "LaporanPersediaan.xlsx",
                allPages: true,
              },
              excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                sheet.frozenRows = 2;
                sheet.mergedCells = ["A1:M1"];
                sheet.name = "LAPORAN";
      
                var myHeaders = [
                  {
                    value: "Daftar Laporan Persediaan",
                    fontSize: 20,
                    textAlign: "center",
                    background: "#ffffff",
                    // color:"#ffffff"
                  },
                ];
      
                sheet.rows.splice(0, 0, {
                  cells: myHeaders,
                  type: "header",
                  height: 70,
                });
              },
              scrollable: true,
              // dataBound: onDataBound,
              columns: [
                {
                  field: "tglresep",
                  title: "Tgl Resep",
                  width: "120px",
                },
                {
                  field: "noresep",
                  title: "No Resep",
                  width: "120px",
      
                  // "template": "<button class=\"k-button custom-button\" ng-click=\"setstatuspulang(dataItem)\"  style=\"margin:0 0 5px\">#:  statuspulang #</button> ",
                },
                {
                  field: "nocm",
                  title: "No RM",
                  width: "120px",
      
                  // "template": "<button class=\"k-button custom-button\" ng-click=\"setstatuspulang(dataItem)\"  style=\"margin:0 0 5px\">#:  statuspulang #</button> ",
                },
                {
                  field: "namapasien",
                  title: "Nama Pasien",
                  width: "180px",
      
                  // "template": "<button class=\"k-button custom-button\" ng-click=\"setNamaKendali(dataItem)\"  style=\"margin:0 0 5px\">#:  namekendali #</button> ",
                },
                {
                  field: "namalengkap",
                  title: "Nama Dokter",
                  width: "180px",
                },
                {
                  field: "namaproduk",
                  title: "Produk",
                  width: "180px",
                  // groupFooterTemplate: "<span>TOTAL</span>",
                  // groupFooterAttributes: { style: "text-align: right;"},
                },
                {
                  field: "hargajual",
                  title: "Harga",
                  width: "120px",
                  aggregates: ["sum"],
                  template:
                    "<span class='style-right'>{{formatRupiah('#: data.hargajual#', 'Rp.')}}</span>",
                  // groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargajual.sum #', 'Rp.')}}</span>",
                  // groupFooterAttributes: { style: "text-align: right;"}
                },
                {
                  field: "jumlah",
                  title: "Jumlah",
                  width: "80px",
                  aggregates: ["sum"],
                  // groupFooterTemplate: "<span>#:data.jumlah.sum #</span>",
                  // groupFooterAttributes: { style: "text-align: right;"}
                },
                {
                  field: "jasa",
                  title: "Jasa",
                  width: "120px",
                  aggregates: ["sum"],
                  template:
                    "<span class='style-right'>{{formatRupiah('#: data.jasa#', 'Rp.')}}</span>",
                  // groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasa.sum #', 'Rp.')}}</span>",
                  // groupFooterAttributes: { style: "text-align: right;"}
                },
                {
                  field: "diskon",
                  title: "Diskon",
                  width: "120px",
                  aggregates: ["sum"],
                  template:
                    "<span class='style-right'>{{formatRupiah('#: data.diskon#', 'Rp.')}}</span>",
                  // groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.diskon.sum #', 'Rp.')}}</span>",
                  // groupFooterAttributes: { style: "text-align: right;"}
                },
                {
                  field: "total",
                  title: "Total",
                  width: "120px",
                  aggregates: ["sum"],
                  template:
                    "<span class='style-right'>{{formatRupiah('#: data.total#', 'Rp.')}}</span>",
                  // groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                  // groupFooterAttributes: { style: "text-align: right;"},
                  // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                  // footerAttributes: { style: "text-align: right;"}
                },
      
                // {
                //     hidden: true,
                //     field: "namaruangan",
                //     title: "Nama Ruangan",
                //     aggregates: ["count"],
                //     groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                // }
              ],
            };
            $scope.CetakLapRekap = function () {
                $scope.popUpTap = false;
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }
                var tempRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    debugger
                    tempRekanan = $scope.item.rekanan.namarekanan;
                }
                var tempRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    debugger
                    tempRekanan = $scope.item.rekanan.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt + '&rekanan=' + tempRekanan,
                    function (response) {
                        // do something with response

                    });
            }
            $scope.CetakLapRekapJumlah = function () {
                $scope.popUpTap = false;
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }
                var tempRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    debugger
                    tempRekanan = $scope.item.rekanan.namarekanan;
                }
                var tempRekanan = "";
                if ($scope.item.rekanan != undefined) {
                    debugger
                    tempRekanan = $scope.item.rekanan.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Rekap Pengeluaran Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPengeluaranObat=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt + '&rekanan=' + tempRekanan,
                    function (response) {
                        // do something with response

                    });
            }
            $scope.CetakPasienpulang = function () {
                $scope.popUpTap = false;
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                // if ($scope.item.dokter != undefined) {
                //     tempDokterId = $scope.item.dokter.id;
                // }

                var tempKelompokPasienId = "";
                if ($scope.item.namaPenjamin != undefined) {
                    tempKelompokPasienId = $scope.item.namaPenjamin.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }
                // var tempRekanan = "";
                // if ($scope.item.rekanan != undefined) {
                //     debugger
                //     tempRekanan = $scope.item.rekanan.namarekanan;
                // }  
                var tempRekanan = "";
                if ($scope.item.institusiAsalPasien != undefined) {
                    debugger
                    tempRekanan = $scope.item.institusiAsalPasien.id;
                }
                var tempDepart = "";
                if ($scope.item.Departemen != undefined) {
                    debugger
                    tempDepart = $scope.item.Departemen.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Rekap Pengeluaran Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-Laporanpasienpulangapotik=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt + '&rekanan=' + tempRekanan + '&depart=' + tempDepart,
                    function (response) {
                        // do something with response

                    });
            }
            $scope.CetakPasienpulangBlok = function () {
                $scope.popUpTap = false;
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                // if ($scope.item.dokter != undefined) {
                //     tempDokterId = $scope.item.dokter.id;
                // }

                var tempKelompokPasienId = "";
                if ($scope.item.namaPenjamin != undefined) {
                    tempKelompokPasienId = $scope.item.namaPenjamin.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                } else {
                    toastr.warning('Ruangan Dipilih Terlebihdahulu, Peringatan!');
                    return;
                }
                // var tempRekanan = "";
                // if ($scope.item.rekanan != undefined) {
                //     debugger
                //     tempRekanan = $scope.item.rekanan.namarekanan;
                // }  
                var tempRekanan = "";
                if ($scope.item.institusiAsalPasien != undefined) {
                    debugger
                    tempRekanan = $scope.item.institusiAsalPasien.id;
                }
                var tempDepart = "";
                if ($scope.item.Departemen != undefined) {
                    debugger
                    tempDepart = $scope.item.Departemen.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Rekap Pengeluaran Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                $scope.isRouteLoading = false;
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LaporanpasienpulangapotikBlok=' + $scope.namaLengkap + '&tglAwal=' + tglAwal +
                    '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId +
                    '&strIdPegawai=' + tempDokterId + '&view=' + stt + '&rekanan=' + tempRekanan + '&depart=' + tempDepart,
                    function (response) {
                        // do something with response

                    });
            }
            $scope.rekappengeluaranobat = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var x = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var y = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                var ruanganPilih = "";
                var namaruangan = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganPilih = $scope.item.ruangan.id;
                    namaruangan = $scope.item.ruangan.namaruangan;
                } else {
                    toastr.warning('Ruangan Dipilih Terlebihdahulu, Peringatan!');
                    return;
                }

                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };
                var ruangantujuan = '';
                if ($scope.item.ruangann != undefined) {
                    ruangantujuan = $scope.item.ruangann.id
                }
                var kondisi = "   (kirimproduk_t.tglpelayanan BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "'  and CAST(kirimproduk_t.objectruanganfk AS TEXT) ilike '%" + ruangantujuan + "%' )"
                var kondisi3 = "   (sr.tglresep BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "'  and CAST(apd.objectruanganfk AS TEXT) ilike '%" + ruangantujuan + "%' )"
                var kondisi2 = "   (sr.tglresep BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "'  and CAST(apd.objectruanganfk AS TEXT) ilike '%" + ruangantujuan + "%' )"
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "objectruanganfk", "tglawal", "tglakhir", "x", "y", "kondisi", "namaruangan", "kondisi2", "kondisi3"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", ruanganPilih, tglAwal.toString(), tglAkhir.toString(), x.toString(), y.toString(), kondisi, namaruangan, kondisi2, kondisi3],
                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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
                if (window.location.hostname.indexOf('localhost') > -1) {
                   xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekappengeluaranobat.pdf');

                } else   {
                    xhr.open('POST', '/jasper1/generic/report/rekappengeluaranobat.pdf');
                }  
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            debugger
            $scope.pasienpulangblok = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var ruanganPilih = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganPilih = $scope.item.ruangan.id;
                } else {
                    toastr.warning('Ruangan Dipilih Terlebihdahulu, Peringatan!');
                    return;
                }
                var departpilih = ""
                if ($scope.item.Departemen != undefined) {
                    departpilih = $scope.item.Departemen.departemen;
                }
                debugger
                var penjaminpilih = ""
                // if ($scope.item.namaPenjamin != undefined) {
                //     penjaminpilih = $scope.item.namaPenjamin.kelompokpasien;
                // }
                if ($scope.selectedNamaPenjamin.length != 0) {
                    for (var i = $scope.selectedNamaPenjamin.length - 1; i >= 0; i--) {
                        var c = $scope.selectedNamaPenjamin[i].id
                        if (penjaminpilih == "") {
                            penjaminpilih = $scope.selectedNamaPenjamin[i].id
                        } else {
                            penjaminpilih = penjaminpilih + "," + $scope.selectedNamaPenjamin[i].id
                        }
                    }
                }
                var rekananpilih = ""
                if ($scope.item.institusiAsalPasien != undefined) {
                    rekananpilih = $scope.item.institusiAsalPasien.id;
                }

                $scope.isRouteLoading = true;
                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };

                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "objectruanganfk", "instalasi", "penjamin", "rekanan", "tglawal", "tglakhir"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", ruanganPilih, departpilih.toString(), penjaminpilih.toString(), rekananpilih.toString(), tglAwal.toString(), tglAkhir.toString()],
                    "paramType": ["", "", "", "", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/pasienpulangblok.pdf');

                } else   {
                    xhr.open('POST', '/jasper1/generic/report/pasienpulangblok.pdf');
                } 
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.laporandetailobatpernoresep = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');
                var ruanganPilih = "";
                var namaruanganPilih = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganPilih = $scope.item.ruangan.id;
                    namaruanganPilih = $scope.item.ruangan.namaruangan;
                } else {
                    toastr.warning('Ruangan Dipilih Terlebihdahulu, Peringatan!');
                    return;
                }
                var departpilih = ""
                if ($scope.item.Departemen != undefined) {
                    departpilih = $scope.item.Departemen.departemen;
                }
                var penjaminpilih = "";
                if ($scope.selectedNamaPenjamin.length != 0) {
                  for (var i = $scope.selectedNamaPenjamin.length - 1; i >= 0; i--) {
                      var c = $scope.selectedNamaPenjamin[i].id
                      if (penjaminpilih == "") {
                          penjaminpilih = $scope.selectedNamaPenjamin[i].id
                      } else {
                          penjaminpilih = penjaminpilih + "," + $scope.selectedNamaPenjamin[i].id
                      }
                  }
                }
                debugger
                var rekananpilih = ""
                if ($scope.item.institusiAsalPasien != undefined) {
                    rekananpilih = $scope.item.institusiAsalPasien.id;
                }

                // medifirstService.get("bedah/get-data-rinciankomponen?" + 'norecapd=' + $scope.item.norec_apd).then(function (e) {
                // var bayar = "Rp. " + parseFloat($scope.dataSelected11.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var nobukti =  $scope.dataSelected11.notukarfaktur +" - Tanggal " + $scope.dataSelected11.waktupembuatan
                // var catatan = "";
                // if($scope.dataSelected11.catatan !== null){
                //    catatan= $scope.dataSelected11.catatan.toString()
                // };
                // var kondisi1 = "   (sr.tglresep BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "' and CAST(apd.objectruanganfk AS TEXT) ilike '%" + $scope.item.ruangann.id + "%')"
                var kondisi1 = "   (sr.tglresep BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')"
                var kondisi2 = "   (sp.tglstruk BETWEEN '" + tglAwal + "' AND '" + tglAkhir + "')"
                var qPenjaminPilih = ''
                if (penjaminpilih) {
                  qPenjaminPilih = "AND (pd.objectkelompokpasienlastfk = '"+ penjaminpilih.toString() +"')"
                }
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "objectruanganfk", "instalasi", "penjamin", "rekanan", "tglawal", "tglakhir", "kondisi", "kondisi2", "ruanganapotik"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", ruanganPilih, departpilih.toString(), qPenjaminPilih, rekananpilih.toString(), tglAwal.toString(), tglAkhir.toString(), kondisi1, kondisi2, namaruanganPilih],
                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", ""]
                };
                debugger;
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        // cetakttd();
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
                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/laporandetailobatpernoresep.pdf');
                
                } else   {
                        xhr.open('POST', '/jasper1/generic/report/laporandetailobatpernoresep.pdf');
                }  
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.cetaklaporanobattap = function () {
                // $scope.popUpTap.center().open();
                $scope.popUpTap = true;
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var client = new HttpClient();

                $scope.popUpTap = true;
                medifirstService.get("logistik/get-laporanobattap?" +
                    'tglawal=' + tglAwal +
                    '&tglakhir=' + tglAkhir +
                    '&ruanganfk=' + tempRuanganId +
                    '&IdPegawai=' + tempDokterId
                ).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.dataSourceTap = new kendo.data.DataSource({
                        data: dat.data.result,
                        pageSize: 10,
                        total: dat.data.length,
                        serverPaging: false,
                        // sort:[
                        //     {
                        //         field: "namaproduk",
                        //         dir:"asc"
                        //     }
                        // ],

                    });
                    // CetakLapTaps($('#kGrid'));



                })

                $scope.columnEka = {
                    toolbar: [
                        "excel"
                    ],
                    excel: {
                        fileName: "Laporan Pemakaina Obat Tap " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-" +
                            moment($scope.item.tglAwal).format('DD/MMM/YYYY') + ".xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:H1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value: "Laporan Pemakaina Obat Tap",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
                            // color:"#ffffff"
                        }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    },
                    // toolbar: ["pdf"],
                    // pdf: {
                    //     allPages: true,
                    //     avoidLinks: true,
                    //     paperSize: "A4",
                    //     margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    //     landscape: true,
                    //     repeatHeaders: true,
                    //     template: $("#page-template").html(),
                    //     scale: 0.8
                    // },
                    sortable: false,
                    reorderable: true,
                    filterable: false,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,
                    selectable: 'row',
                    columns: [
                        // {
                        //     "field": "no", "title": "No", "width": "30px", 
                        // },
                        {
                            "field": "tglpelayanan",
                            "title": "Tanggal Pelayanan",
                            "width": "150px"
                        },
                        {
                            "field": "noresep",
                            "title": "No Resep",
                            "width": "200px",
                            // template: "#= kendo.toString(new Date(tglStruk), 'MM-dd-yyyy') #", 
                        },
                        {
                            "field": "namapasien",
                            "title": "Nama Pasien",
                            "width": "200px",
                            // template: "#= kendo.toString(new Date(tglStruk), 'MM-dd-yyyy') #", 
                        },
                        {
                            "field": "dpjp",
                            "title": "DPJP",
                            "width": "200px"
                        },
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "200px",
                            // template: "#= kendo.toString(new Date(tglStruk), 'MM-dd-yyyy') #", 
                        },
                        {
                            "field": "namaruangan",
                            "title": "Ruangan",
                            "width": "100px",
                            // template: "#= kendo.toString(new Date(tglStruk), 'MM-dd-yyyy') #", 
                        },
                        {
                            "field": "harga",
                            "title": "Harga",
                            "width": "100px",
                            "template": "<span class='style-right'>{{formatRupiah('#: harga #', 'Rp')}}</span>"
                        },
                        {
                            "field": "jumlah",
                            "title": "Jumlah",
                            "width": "50px",
                            // template: "#= kendo.toString(new Date(tglStruk), 'MM-dd-yyyy') #", 
                        },
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "100px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp')}}</span>"
                        }



                    ],
                    // sortable: {
                    //     mode: "single",
                    //     allowUnsort: false,
                    // },
                    // pageable: {
                    //     messages: {
                    //         display: "Menampilkan {0} - {1} data dari {2} data"
                    //     },
                    //     refresh: true,
                    //     pageSizes: true,
                    //     buttonCount: 5
                    // }
                };


                // var stt = 'false'
                // if (confirm('View Laporan Rekap Penjualan Obat? ')){
                //     // Save it!
                //     stt='true';
                // }else {
                //     // Do nothing!
                //     stt='false'
                // }





                // var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                // client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-laporanobattap='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                //             + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId +  '&view='+ stt, function(response) {

                // });

            }
        }

    ]);
});