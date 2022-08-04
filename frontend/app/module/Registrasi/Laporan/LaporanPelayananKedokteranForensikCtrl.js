define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('LaporanPelayananKedokteranForensikCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
    function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
        $scope.dataVOloaded = true;
        $scope.now = new Date();
        $scope.dataPasienSelected = {};
        $scope.item = {};
        // $scope.item.tanggalRegistrasiAwal = $scope.now;
        // $scope.item.tanggalRegistrasiAkhir = new Date();
        $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
        $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
        
        $scope.isRouteLoading = false;
        LoadCombo();
        loadData();

        $scope.getIsiComboRuangan = function () {
            debugger;
            $scope.listRuangan = $scope.item.instalasi.ruangan
          }
    
          $scope.getIsiComboRekanan = function () {
            debugger;
            $scope.listRekanan = $scope.item.kelompokpasien.rekanan
          }


        function LoadCombo() {
            debugger
            medifirstService.get("tatarekening/get-combo-detail-regis", false).then(function (dat) {
              $scope.listDepartemen = dat.data.departemen;
              $scope.listKelompokPasien = dat.data.rekanana;
            //   dataLogin = medifirstService.getUserLogin();
            })
            medifirstService.get("tatarekening/get-kedokteran-forensik-combo").then(function (data) {
                $scope.listJenisKekerasan = data.data.jeniskekerasan;
                $scope.listJenisKekerasan2 = data.data.jeniskekerasan;
                $scope.listRujukanDokter = data.data.jenisrujukan;
                $scope.listPermintaanPolres = data.data.permintaanpolres;
                
            })
            $scope.listStatus = [{ "id": "1", "namaExternal": "Semua" }, { "id": "2", "namaExternal": "Belum Verifikasi" }, { "id": "3", "namaExternal": "Verifikasi" }, { "id": "4", "namaExternal": "Lunas" }]
          };

        $scope.Search = function () {
            $scope.isRouteLoading = true;
            loadData()
        }
        $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
        $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));

        function loadData() {
            debugger

            var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
            var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');

        // if ($scope.item.tanggalRegistrasiAwal == undefined){
        //     var tanggalawal = ""
        // } else {
        //     var tanggalawal = "&tglregistrasiawal=" + $scope.item.tanggalRegistrasiAwal
        // }
        // if ($scope.item.tanggalRegistrasiAkhir == undefined){
        //     var tanggalakhir = ""
        // } else {
        //     var tanggalakhir = "&tglregistrasiakhir=" + $scope.item.tanggalRegistrasiAkhir
        // }
        if ($scope.item.instalasi == undefined){
            var instalasi = ""
        } else {
            var instalasi = "&departemen=" + $scope.item.instalasi.id
        }
        if ($scope.item.ruangan == undefined){
            var ruangan = ""
        } else {
            var ruangan = "&ruangan=" + $scope.item.ruangan.id
        }
        if ($scope.item.kelompokpasien == undefined){
            var kp = ""
        } else {
            var kp = "&kelompok=" + $scope.item.kelompokpasien.id
        }
        if ($scope.item.rekanan == undefined){
            var rk = ""
        } else {
            var rk = "&rekanan=" + $scope.item.rekanan.id
        }
        if ($scope.item.jeniskekerasan == undefined){
            var jk = ""
        } else {
            var jk = "&jeniskekerasan=" + $scope.item.jeniskekerasan.id
        }

        medifirstService.get("tatarekening/get-pasien-kedokteran-forensik?"
        + "tglAwal=" + tglAwal
        + "&tglAkhir=" + tglAkhir
        + instalasi + ruangan + kp + rk + jk
        ).then(function (data) {
            debugger;
            var data = data.data 
            for (var i = 0; i < data.length; i++) {
                var tanggal = $scope.now;
                var tanggalLahir = new Date(data[i].tgllahir);
                var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                data[i].umur = umur.year + ' Tahun '
            }
            $scope.isRouteLoading = false;
            $scope.dataKedokteranForensik = new kendo.data.DataSource({
                
                data: data,
                pageSize: 10,
                total: data.length,
                serverPaging: false
            });
        })
    }
        $scope.formatTanggal = function (tanggal) {
            return moment(tanggal).format('DD-MMM-YYYY HH:mm');
        }

        $scope.columnKedokteranForensik = {

            toolbar: ["excel"],

            excel: {
                fileName: "Laporan Pelayanan Kedokteran Forensik.xlsx",
                allPages: true,
            },

            excelExport: function (e) {
                var rows = e.workbook.sheets[0].rows;
                rows.unshift({
                    cells: [{ value : "LAPORAN PELAYANAN KEDOKTERAN FORENSIK", background: "#fffff"}]

                });
            },

            scrollable: true,
            selectable: 'row',
            pageable: true,
            columns: [
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "130px",
                    "template": "<span class='style-left'>#: noregistrasi #</span>"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "130px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "No CM",
                    "width": "130px",
                    "template": "<span class='style-left'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "130px",
                    "template": "<span class='style-left'>#: namapasien #</span>"
                },
                {
                    "field": "tgllahir",
                    "title": "Tgl Lahir",
                    "width": "130px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "130px",
                    "template": "<span class='style-left'>#: umur #</span>"
                },
                {
                    "field": "pekerjaan",
                    "title": "Pekerjaan",
                    "width": "130px",
                    "template": "<span class='style-left'>#: pekerjaan #</span>"
                },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "130px",
                    "template": "<span class='style-left'>#: alamatlengkap #</span>"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "130px",
                    "template": "<span class='style-left'>#: jeniskelamin #</span>"
                },
                {
                    "field": "ruanganasal",
                    "title": "Ruangan Asal",
                    "width": "130px",
                    "template": "<span class='style-left'>#: ruanganasal #</span>"
                },
                {
                    "field": "ruanganlast",
                    "title": "Ruangan Terakhir",
                    "width": "130px",
                    "template": "<span class='style-left'>#: ruanganlast #</span>"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Penjamin",
                    "width": "130px",
                    "template": "<span class='style-left'>#: kelompokpasien #</span>"
                },
                {
                    "field": "namarekanan",
                    "title": "Rekanan Penjamin",
                    "width": "130px",
                    "template": "<span class='style-left'>#: namarekanan #</span>"
                },
                {
                    "field": "forensik",
                    "title": "Kedokteran Forensik",
                    "width": "130px",
                    "template": "<span class='style-left'>#: forensik #</span>"
                },
                {
                    "field": "jeniskekerasan2",
                    "title": "Jenis Kekerasan",
                    "width": "130px",
                    "template": "<span class='stye-left'>#: jeniskekerasan #</span>"
                },
                {
                    "field": "jenisrujukan",
                    "title": "Rujukan Dokter",
                    "width": "130px",
                    "template": "<span class='style-left'>#: jenisrujukan #</span>"
                },
                {
                    "field": "permintaanpolres",
                    "title": "Permintaan Polres",
                    "width": "130px",
                    "template": "<span class='style-left'>#: permintaanpolres #</span>"
                },
            ]
        }
        $scope.Input = function () {
            debugger;
            if ($scope.dataPasienSelected.noregistrasi == undefined){
                toastr.error('Pilih Data Dulu !')
                return;
            }
            $scope.popUpInput.center().open();
        }
        $scope.Simpan = function () {
            if($scope.item.jeniskekerasan2 == undefined){
                toastr.error('Jenis Kekerasan Belum Diinput !')
                return;
            }
            if($scope.item.rujukandokter == undefined){
                toastr.error('Rujukan Dokter Belum Diinput !')
                return;
            }
            if($scope.item.permintaanpolres == undefined){
                toastr.error('Permintaan Polres Belum Diinput !')
                return
            }
            debugger
            var simpan = {
                jeniskekerasanfk: $scope.item.jeniskekerasan2.id,
                rujukandokterforensikfk: $scope.item.rujukandokter.id,
                permintaanpolresfk: $scope.item.permintaanpolres.id,
                norec_pd: $scope.dataPasienSelected.norec_pd
            }
            medifirstService.post('tatarekening/save-kedokteran-forensik', simpan).then(function (e) {

            })
            $scope.popUpInput.close();
            loadData()
        }
    }
]);
});