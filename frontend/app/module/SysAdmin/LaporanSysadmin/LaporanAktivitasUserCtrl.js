define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanAktivitasUserCtrl', ['$scope', 'ModelItem', 'CacheHelper', 'MedifirstService',
        function ($scope, ModelItem, cacheHelper, medifirstService) {
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglawal = new Date();
            $scope.item.tglakhir = new Date();
            $scope.pegawai = medifirstService.getPegawai();
            $scope.item.jmlRows = 100
            FormLoad()

            function FormLoad() {
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listUser = data;
                });                
                medifirstService.get('sysadmin/logging/get-data-combo').then(function (e) {
                    $scope.listJenisPegawai = e.data.jenispegawai;
                });
            }

            $scope.listJenisLog = [
                {
                    id: 1,
                    jenis: 'Pendaftaran Pasien'
                },
                {
                    id: 2,
                    jenis: 'Konsul Ruangan'
                },
                {
                    id: 3,
                    jenis: 'Input Resep Apotik'
                },
                {
                    id: 4,
                    jenis: 'Input Tindakan'
                },
                {
                    id: 5,
                    jenis: 'Verifikasi TataRekening'
                },
                {
                    id: 6,
                    jenis: 'Unverifikasi TataRekening'
                },
                {
                    id: 7,
                    jenis: 'Hapus Resep Apotik'
                },
                {
                    id: 8,
                    jenis: 'Batal Bayar Kasir'
                },
                {
                    id: 9,
                    jenis: 'Pasien Pindah'
                },
                {
                    id: 10,
                    jenis: 'Pasien Pulang'
                },
                {
                    id: 11,
                    jenis: 'Retur Resep Apotik'
                },
                {
                    id: 12,
                    jenis: 'Hapus Layanan'
                },
                {
                    id: 13,
                    jenis: 'Ubah Tgl Pelayanan'
                },
                {
                    id: 14,
                    jenis: 'Diskon Layanan'
                },
                {
                    id: 15,
                    jenis: 'Input/Ubah Petugas Layanan'
                },
                {
                    id: 16,
                    jenis: 'Hapus Konsul'
                },
                {
                    id: 17,
                    jenis: 'Ubah Tgl Detail Registrasi'
                },
                {
                    id: 18,
                    jenis: 'Edit Registrasi'
                },
                {
                    id: 19,
                    jenis: 'Stok Opname'
                },
                {
                    id: 20,
                    jenis: 'Batal Kirim'
                },
                {
                    id: 21,
                    jenis: 'Login User'
                },


            ]
            Load();

            function Load() {
                var chacePeriode = cacheHelper.get('DaftarLoggingUserCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.tglawal = new Date(arrPeriode[0]);
                    $scope.item.tglakhir = new Date(arrPeriode[1]);

                } else {

                    $scope.item.tglawal = $scope.now;
                    $scope.item.tglakhir = $scope.now;
                }

            }

            function GetData() {               
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm:ss');                
                var UserId = "";
                if ($scope.item.User !== undefined) {
                    UserId = "&UserId=" + $scope.item.User.id
                }
                var jenisPegawai = "";
                if ($scope.item.jenisPegawai !== undefined) {
                    jenisPegawai = "&jenisPegawaiId=" + $scope.item.jenisPegawai.id
                }
                medifirstService.get("sysadmin/logging/get-aktivitas-user?"
                    + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + UserId + jenisPegawai).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                        }

                        $scope.DataKeluhan = {
                            data: datas,
                            total: datas.length,
                            pageSize: 10,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        }
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('DaftarLoggingUserCtrl', chacePeriode);

                    });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.SearchData = function (e) {
                GetData()
            }

            $scope.ClearData = function () {
                $scope.item.tglawal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = new moment($scope.now).format('YYYY-MM-DD HH:mm');
                delete $scope.item.JenisLog
                delete $scope.item.User
                delete $scope.item.jenisPegawai
            }

            $scope.CariKeluhan = function (dataSource) {
                var q = dataSource;
                var grid = $("#kGrid").data("kendoGrid");
                grid.dataSource.query({
                    page: 1,
                    pageSize: 20,
                    filter: {
                        logic: "or",
                        filters: [{ field: "namaPasien", operators: "contains", value: q },
                        { field: "umur", operators: "contains", value: q },
                        { field: "email", operators: "contains", value: q }]
                    }
                })
            }

            //          $scope.OnInit = function(){
            //      $scope.SearchData();
            // }
            // $scope.OnInit();

            $scope.batal = function () {
                $scope.item = {};
            }

            $scope.kl = function (current) {
                // toastr.info(current.namapasien+" Terpilih");
                $scope.current = current;
                $scope.item.keluhan = current.keluhan;
                $scope.item.saran = current.saran;
                $scope.item.namaPasien = current.namapasien;
                $scope.item.email = current.email;
                $scope.item.idKeluhan = current.kpid;
                $scope.item.pegawai = { id: current.pegawaiid, namalengkap: current.namalengkap };
                $scope.item.idKeluhan = current.kpid;
                console.log(JSON.stringify($scope.item.idKeluhan));
            }

            $scope.group = {
                field: "jenislog",
                aggregates: [{
                    field: "jenislog",
                    aggregate: "count"
                }]
            };
            $scope.aggregate = [{
                field: "jenislog",
                aggregate: "count"
            }]
            $scope.optionsDataKeluhan = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Logging User " + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": 20,

                    },
                    {
                        "field": "namalengkap",
                        "title": "Pegawai",
                        "width": 180,
                    },
                    {
                        "field": "jenispegawai",
                        "title": "Jenis Pegawai",
                        "width": 120,
                    },
                    {
                        "field": "jumlahaktivitas",
                        "title": "Jumlah Aktivitas",
                        "width": 80,
                    }
                ],

            };
        }
    ]);
});