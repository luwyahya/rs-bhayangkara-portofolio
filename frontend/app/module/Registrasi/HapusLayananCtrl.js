define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('HapusLayananCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
      function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
          //Inisial Variable 
          $scope.isRouteLoading = false;
          $scope.dataVOloaded = true;
          $scope.now = new Date();
          $scope.dataSelected = {};
          $scope.item = {};
          $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
          //debugger
          $scope.LapCP = function () {
              $scope.isRouteLoading = true;
              LoadData()
          }


          function LoadData() {
              var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
              var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

              var chacePeriode = {
                  0: tglAwal,
                  1: tglAkhir
              }
              cacheHelper.set('HapusPel', chacePeriode);

              medifirstService.get("registrasi/get-hapus-pelayanan?"
                  + "tglAwal=" + tglAwal
                  + "&tglAkhir=" + tglAkhir
              ).then(function (data) {
                  var data = data
                  $scope.isRouteLoading = false;

                  //   debugger
                  $scope.ambildataexcel = data.data;
                  // $scope.panggil($scope.ambildataexcel);
                  $scope.dataLaporanCovid = new kendo.data.DataSource({
                      data: data.data,
                      pageSize: 10,
                      total: data.length,
                      serverPaging: false,
                      schema: {
                          model: {
                              fields: {
                              }
                          }
                      }
                  });


              })
          }
          // debugger;
          // $scope.panggil = function (cokot) {

              $("#kGrid").kendoGrid({
                  toolbar: ["excel"],
                  excel: {
                      fileName: "HapusPelayanan.xlsx",
                      filterable: true,
                      allPages: true,
                  },
                  dataSource: $scope.ambildataexcel,
                  // filterable: true,
                  resizable: true,
                  sortable: true,
                  // allPages: true,
                  // reorderable: true,
                  // filterable: true,
                  pageable: true,
                  // groupable: true,
                  // columnMenu: true,
                  // resizable: true,
                  columns: [
                    {
                        field: "nocm",
                        title: "No RM",
                        width: "60px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    // {
                    //     field: "namaruangan",
                    //     title: "Ruangan",
                    //     width: "100px",
                    //     template: "<span class='style-center'>#: namaruangan #</span>",
                    //     headerAttributes: { style: "text-align : center" },
                    //     rows: [
                    //         {
                    //             cells: [
                    //                 {
                    //                     value: "Border",
                    //                     borderTop: { color: "#ff0000", size: 3 }
                    //                 }]
                    //         }
                    //     ]

                    // },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "noregistrasi",
                        title: "No Registrasi",
                        width: "120px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Produk",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "harga",
                        title: "Harga",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "hargajasa",
                        title: "Harga Jasa",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "tglhapus",
                        title: "Tgl Hapus",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "namauser",
                        title: "Nama Penghapus",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "namaruangan",
                        title: "Nama Ruangan",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                  ]
              });
          // };

          // $scope.panggil();

          $scope.click = function (dataPasienSelected) {
              var data = dataPasienSelected;

          };
          $scope.formatTanggal = function (tanggal) {
              return moment(tanggal).format('DD-MMM-YYYY HH:mm');
          }
          $scope.formatRupiah = function (value, currency) {
              return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          }

          $scope.createColumn = function () {
              var list = [
                  {
                      "field": "jumlahLKH",
                      "title": "LK"
                  },
                  {
                      "field": "jumlahPRH",
                      "title": "LP"
                  }
              ];

              return list;
          };

          $scope.columnLaporanCovid = [

              {
                  "field": "kddiagnosa",
                  "title": "KODE ICD 10",
                  "width": "150px",
                  "align": "center"
              },
              {
                  "field": "namadiagnosa",
                  "title": "<center>DESKRIPSI</center>",
                  "width": "150px"
              },
              {
                  title: "<center>KASUS BARU MENURUT JENIS KELAMIN</center>",
                  columns: $scope.createColumn()

              },
              {
                  "field": "total",
                  "title": "Jumlah Kausu Baru (4+5)"
              },
              {
                  "field": "jumlah",
                  "title": "Jumlah Kunjungan",
                  "width": "180px"
              }
          ];

          $scope.Perbaharui = function () {
              $scope.ClearSearch();
          }

          //fungsi clear kriteria search
          $scope.ClearSearch = function () {
              $scope.item = {};
              $scope.item.tglawal = $scope.now;
              $scope.item.tglakhir = $scope.now;
              $scope.CariLapPasienPulang();
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

          //   manageTataRekening.getDataTableTransaksi("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
          //       $scope.listDepartemen = data.data.departemen;
          //       $scope.listKelompokPasien = data.data.kelompokpasien;
          //   })

          //   $scope.getIsiComboRuangan = function(){
          //       $scope.listRuangan = $scope.item.departement.ruangan
          //   }
          $scope.formatTanggal = function (tanggal) {
            return moment(tanggal).format('DD-MMM-YYYY');
          }
    
          $scope.formatTanggalJam = function (tanggal) {
            return moment(tanggal).format('DD-MMM-YYYY HH:mm');
          }
          $scope.formatRupiah = function (value, currency) {
            return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
          }

          
          $scope.$watch('item.namaPenjamin', function (e) {
              //debugger
              if (e === undefined) return;
              findPasien.getDataRekanan(e.id).then(function (data) {
                  $scope.sourceDataRekanan = data.data.data.listData;
                  $scope.item.institusiAsalPasien = $scope.sourceDataRekanan;
              });
              if (e.id == 5 || e.id == 3) {
                  $scope.Perusahaan = true
              } else {
                  $scope.Perusahaan = false
                  $scope.item.institusiAsalPasien = ""
              }
          })

          $scope.tglPelayanan = $scope.item.pelayanan;
          $scope.dokter = $scope.item.namaPegawai;

          $scope.listDataFormat = [
              {
                  "id": 1, "format": "pdf"
              },
              {
                  "id": 2, "format": "xls"
              }
          ];


          $scope.date = new Date();
          var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

          //Tanggal Default
          $scope.item.tglawal = tanggals + " 00:00";
          $scope.item.tglakhir = tanggals + " 12:59";

          // Tanggal Inputan
          $scope.tglawal = $scope.item.tglawal;
          $scope.tglakhir = $scope.item.tglakhir;
          $scope.pegawai = medifirstService.getPegawai();

          $scope.Cetak = function () {
              // if($scope.item.format == undefined){
              // 	alert('format file harus dipilih terlebih dahulu !!!')
              // }
              if ($scope.item.tglawal == $scope.tglawal)
                  var tglawal = $scope.item.tglawal;
              else
                  var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
              if ($scope.item.tglakhir == $scope.tglakhir)
                  var tglakhir = $scope.item.tglakhir;
              else
                  var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
              if ($scope.item.departement == undefined)
                  var departement = "";
              else
                  var departement = $scope.item.departement.id;
              if ($scope.item.namaPenjamin == undefined)
                  var kelompokPasien = "";
              else
                  var kelompokPasien = $scope.item.namaPenjamin.id;
              if ($scope.item.ruangan == undefined)
                  var ruangan = "";
              else
                  var ruangan = $scope.item.ruangan.id;
              if ($scope.item.institusiAsalPasien == undefined || $scope.item.institusiAsalPasien.id == undefined)
                  var perusahaan = "";
              else
                  var perusahaan = $scope.item.institusiAsalPasien.id;
              var stt = 'false'
              if (confirm('View Laporan Pasien Pulang? ')) {
                  // Save it!
                  stt = 'true';
              } else {
                  // Do nothing!
                  stt = 'false'
              }
              var client = new HttpClient();
              client.get('http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&strIdPerusahaan=' + perusahaan + '&view=' + stt, function (response) {
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
          }

      }
  ]);
});