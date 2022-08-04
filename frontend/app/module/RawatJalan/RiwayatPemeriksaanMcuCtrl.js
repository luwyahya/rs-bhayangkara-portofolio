define(['initialize', 'Configuration'], function(initialize, config) {
    'use strict';
    initialize.controller('RiwayatPemeriksaanMcuCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem', 
    function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
        $scope.dataVOloaded = true;
        $scope.now = new Date();
        $scope.dataPasienSelected = {};
        $scope.item = {};
        $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
        $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
        // $scope.buttonShow = true;
        $scope.bebasnarkoba = false
        
        $scope.isRouteLoading = false;

        $scope.Search = function () {
            $scope.isRouteLoading = true;
            loadData()
        }

        function loadData () {
            debugger

            var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
            var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');

            var norm = ""
				if ($scope.item.norm != undefined) {
					var norm  = "&norm=" + $scope.item.norm
				}

            var noreg = ""
				if ($scope.item.noregistrasi != undefined) {
					var noreg = "&noreg=" + $scope.item.noregistrasi
				}

            var np = ""
				if ($scope.item.namapasien != undefined) {
					var np = "&np=" + $scope.item.namapasien
				}

            medifirstService.get("laboratorium/get-riwayat-pemeriksaan-mcu?"
            + "tglAwal=" + tglAwal
            + "&tglAkhir=" + tglAkhir
            + noreg + norm + np).then(function (data) {
                debugger;
                $scope.isRouteLoading = false;
                $scope.dataPemeriksaanMcu = new kendo.data.DataSource({

                    data: data.data,
                    pageSize: 10,
                    total: data.data.length,
                    serverPaging: false
                });
            })
        }
        $scope.formatTanggal = function (tanggal) {
            return moment(tanggal).format('DD-MMM-YYYY HH:MM');
        }

        $scope.columnPemeriksaanMcu = {
            scrollable: true,
            selectable: 'row',
            pageable: true,
            columns: [
                {
                    "field": "tglregistrasi",
                    "title": "Tanggal Registrasi",
                    "width": "100px",
                    "template": "<span class='style-left'> {{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "50px",
                    "template": "<span class='style-left'>#: nocm #</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "50px",
                    "template": "<span class='style-left'>#: noregistrasi #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px",
                    "template": "<span class='style-left'>#: namapasien #</span>"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                    "template": "<span class='style-left'>#: keterangan #</span>"
                },
                {
                    "field": "tglcetak",
                    "title": "Tanggal Cetak",
                    "width": "100px",
                    "template": "<span class='style-left'>#: tglcetak #</span>"
                },
                {
                    "field": "nomorsurat",
                    "title": "Nomor Surat",
                    "width": "50px",
                    "template": "<span class='style-left'>#: nomorsurat #</span>"
                }
            ]
        }

        $scope.BadanSehat = function () {
            $scope.norecHPM = ''
            $scope.nomorsurat = ''
            if ($scope.dataPasienSelected.noregistrasi == undefined) {
                toastr.error('Pilih Data Dahulu')
                return;
            }
            if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Hasil Badan Sehat'){
                toastr.warning('Pasien ini tidak periksa badan sehat')
                return;
            }
            medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                debugger;
                $scope.listDokterMCU = dat.data
            });

            medifirstService.get('laboratorium/get-hasil-badan-sehat?nomorsurat=' + $scope.dataPasienSelected.nomorsurat).then(function (dat) {
                $scope.item.tinggibadan = dat.data[0].tinggibadan
                $scope.item.beratbadan = dat.data[0].beratbadan
                $scope.item.tensidarah = dat.data[0].tensidarah
                $scope.item.suhutubuh = dat.data[0].suhutubuh
                $scope.item.persyaratan = dat.data[0].persyaratan
                $scope.item.doktermcu =  { DokterPemeriksa: dat.data[0].namalengkap, id:dat.data[0].id }
                $scope.norecHPM = dat.data[0].norec
                $scope.nomorsurat = dat.data[0].nomor2
                $scope.popUpBadanSehat.center().open();
            })
        }
        $scope.saveBadanSehat = function () {
            debugger;
            var objSave = {
                norec_pd: $scope.dataPasienSelected.norec_pd,
                tinggibadan: $scope.item.tinggibadan,
                beratbadan: $scope.item.beratbadan,
                tensidarah: $scope.item.tensidarah,
                suhutubuh: $scope.item.suhutubuh,
                pegawaifk: $scope.item.doktermcu.id,
                persyaratan: $scope.item.persyaratan,
                norec: $scope.norecHPM,
                nomorsurat: $scope.nomorsurat
            }
            medifirstService.post('laboratorium/edit-hasil-badan-sehat', objSave).then(function (e) {
            })
            // loadData()
            $scope.buttonShow = false;
        }

        $scope.cetakBadanSehat = function () {
            debugger;
            if ($scope.norecHPM != ''){
                var local = JSON.parse(localStorage.getItem('profile'))
                    if(local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-badan-sehat?norec=" + $scope.norecHPM  + '&kdprofile=' + profile
                        + '&jenis=his', '_blank');
                    }
            }
        }
        $scope.KesehatanJiwa = function () {
            $scope.norecHPM = ''
            $scope.nomorsurat = ''
            medifirstService.get("rawatjalan/get-dokter-kesehatan-jiwa").then(function (dat) {
                debugger;
                $scope.listDokterPemeriksa = dat.data
            });
            if ($scope.dataPasienSelected.noregistrasi == undefined) {
                toastr.error('Pilih Data Dahulu')
                return;
            }
            if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Dokter Kesehatan Jiwa'){
                toastr.warning('Pasien ini tidak periksa kesehatan jiwa')
                return;
            }
            medifirstService.get('laboratorium/get-hasil-kesehatan-jiwa?nomorsurat=' + $scope.dataPasienSelected.nomorsurat).then(function(dat) {
                $scope.item.persyaratan2 = dat.data[0].persyaratan,
                $scope.item.DokterPemeriksa =  { DokterPemeriksa: dat.data[0].namalengkap, id:dat.data[0].id}
                $scope.norecHPM = dat.data[0].norec
                $scope.nomorsurat = dat.data[0].nomor2
                $scope.popUpKesehatanJiwa.center().open();
            })
        }
        $scope.saveKesehatanJiwa = function () {
            debugger;
            var objSave = {
                norec_pd: $scope.dataPasienSelected.norec_pd,
                pegawaifk: $scope.item.DokterPemeriksa.id,
                persyaratan: $scope.item.persyaratan2,
                norec: $scope.norecHPM,
                nomorsurat: $scope.nomorsurat
            }
            medifirstService.post('laboratorium/edit-hasil-kesehatan-jiwa', objSave).then(function (e) {
                
            })
        }
        $scope.cetakKesehatanJiwa = function () {
            debugger
            if ($scope.HPM  != ''){
                var local = JSON.parse(localStorage.getItem('profile'))
                    if(local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-kesehatan-jiwa?norec=" + $scope.norecHPM + '&kdprofile=' + profile
                        + '&jenis=his', '_blank');
                    }
            }
        }
        $scope.BebasPenyakitMenular = function () {
            $scope.norecHPM = ''
            $scope.nomorsurat = ''
            medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                debugger;
                $scope.listDokterPemeriksa = dat.data
            });
            if ($scope.dataPasienSelected.noregistrasi == undefined) {
                toastr.error('Pilih Data Dahulu')
                return;
            }
            if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Bebas Penyakit Menular'){
                toastr.warning('Pasien ini tidak periksa penyakit menular')
                return;
            }
            medifirstService.get('laboratorium/get-hasil-penyakit-menular?nomorsurat=' + $scope.dataPasienSelected.nomorsurat).then(function(dat) {
                $scope.item.persyaratan3 = dat.data[0].persyaratan,
                $scope.item.DokterPemeriksa2 =  { DokterPemeriksa: dat.data[0].namalengkap, id:dat.data[0].id}
                $scope.norecHPM = dat.data[0].norec,
                $scope.nomorsurat = dat.data[0].nomor2
                $scope.popUpPenyakitMenular.center().open();
            })
        }
        $scope.savePenyakitMenular = function () {
            debugger;
            var objSave = {
                norec_pd: $scope.dataPasienSelected.norec_pd,
                pegawaifk: $scope.item.DokterPemeriksa2.id,
                persyaratan: $scope.item.persyaratan3,
                norec: $scope.norecHPM,
                nomorsurat: $scope.nomorsurat
            }
            medifirstService.post('laboratorium/edit-hasil-penyakit-menular', objSave).then(function (e) {
                
            })
            // loadBPM1()
        }
        $scope.cetakPenyakitMenular = function () {
            debugger
            if ($scope.norecHPM != ''){
                var local = JSON.parse(localStorage.getItem('profile'))
                    if(local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-penyakit-menular?norec=" + $scope.norecHPM  + '&kdprofile=' + profile
                        + '&jenis=his', '_blank');
                    }
            }
        }

        $scope.BebasHIV = function () {
            $scope.norecHPM = ''
            $scope.nomorsurat = '' 
            medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                debugger;
                $scope.listDokterPemeriksa = dat.data
            });
            if ($scope.dataPasienSelected.noregistrasi == undefined) {
                toastr.error('Pilih Data Dahulu')
                return;
            }
            if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Bebas HIV'){
                toastr.warning('Pasien ini tidak periksa bebas hiv')
                return;
            }
            medifirstService.get('laboratorium/get-hasil-bebas-HIV?nomorsurat=' + $scope.dataPasienSelected.nomorsurat).then(function(dat) {
                $scope.item.persyaratan3 = dat.data[0].persyaratan,
                $scope.item.DokterPemeriksa2 =  { DokterPemeriksa: dat.data[0].namalengkap, id:dat.data[0].id }
                $scope.norecHPM = dat.data[0].norec,
                $scope.nomorsurat = dat.data[0].nomor2
                $scope.popUpBebasHIV.center().open();
            })
        }
        $scope.saveBebasHIV = function () {
            debugger;
            var objSave = {
                norec_pd: $scope.dataPasienSelected.norec_pd,
                pegawaifk: $scope.item.DokterPemeriksa2.id,
                persyaratan: $scope.item.persyaratan3,
                norec: $scope.norecHPM,
                nomorsurat: $scope.nomorsurat
            }
            medifirstService.post('laboratorium/edit-hasil-bebas-HIV', objSave).then(function (e) {
                
            })
            // loadBPM4()
        }
        $scope.cetakBebasHIV = function () {
            debugger
            if ($scope.norecHPM != ''){
                var local = JSON.parse(localStorage.getItem('profile'))
                    if(local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-HIV?norec=" + $scope.norecHPM  + '&kdprofile=' + profile
                        + '&jenis=his', '_blank');
                    }
            }
        }
        $scope.TidakHamil = function () {
            $scope.norecHPM = ''
            $scope.nomorsurat = '' 
            medifirstService.get("rawatjalan/get-dokter-MCU").then(function (dat) {
                debugger;
                $scope.listDokterPemeriksa = dat.data
            });
            if ($scope.dataPasienSelected.noregistrasi == undefined) {
                toastr.error('Pilih Data Dahulu')
                return;
            }
            if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Tidak Hamil'){
                toastr.warning('Pasien ini tidak periksa tidak hamil')
                return;
            }
            medifirstService.get('laboratorium/get-hasil-tidak-hamil?nomorsurat=' + $scope.dataPasienSelected.nomorsurat).then(function(dat) {

            $scope.item.persyaratan3 = dat.data[0].persyaratan,
            $scope.item.DokterPemeriksa2 =  { DokterPemeriksa: dat.data[0].namalengkap, id:dat.data[0].id}
            $scope.norecHPM = dat.data[0].norec,
            $scope.nomorsurat = dat.data[0].nomor2
            $scope.popUpTidakHamil.center().open();
        })
        }
        $scope.saveTidakHamil = function () {
            debugger;
            var objSave = {
                norec_pd: $scope.dataPasienSelected.norec_pd,
                pegawaifk: $scope.item.DokterPemeriksa2.id,
                persyaratan: $scope.item.persyaratan3,
                norec: $scope.norecHPM,
                nomorsurat: $scope.nomorsurat
            }
            medifirstService.post('laboratorium/edit-hasil-tidak-hamil', objSave).then(function (e) {
                
            })
            // loadBPM3()
        }
        $scope.cetakTidakHamil = function () {
            debugger
            if ($scope.norecHPM != ''){
                var local = JSON.parse(localStorage.getItem('profile'))
                    if(local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-hasil-tidak-hamil?norec=" + $scope.norecHPM  + '&kdprofile=' + profile
                        + '&jenis=his', '_blank');
                    }
            }
        }
        // $scope.BebasNarkoba = function () {
        //     $scope.norecHPM = ''
        //     $scope.nomorsurat = '' 
        //     if ($scope.dataPasienSelected.noregistrasi == undefined) {
        //         toastr.error('Pilih Data Dahulu')
        //         return;
        //     }
        //     if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Bebas Narkoba'){
        //         toastr.warning('Pasien ini tidak periksa bebas narkoba')
        //         return;
        //     }
        //     medifirstService.get('laboratorium/get-hasil-bebas-narkoba?nomorsurat=' + $scope.dataPasienSelected.nomorsurat).then(function(dat) {
        //         debugger;
        //         $scope.norecHPM = dat.data[0].norec,
        //         $scope.nomorsurat = dat.data[0].nomor2
        //         // $scope.bebasnarkoba = true;
        //         debugger
        //     var objSave = {
        //         norec_pd: $scope.dataPasienSelected.norec_pd,
        //         norec: $scope.norecHPM,
        //         nomorsurat: $scope.nomorsurat
        //     }
        //     medifirstService.post('laboratorium/edit-hasil-bebas-narkoba', objSave).then(function(e) {
        //         $scope.bebasnarkoba = true;
        //     })
        //     })
            
            
        // }
        $scope.BebasNarkoba = function () {
            debugger
            if ($scope.dataPasienSelected.noregistrasi == undefined) {
                toastr.error('Pilih Data Dahulu')
                return;
            }
            if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Bebas Narkoba'){
                toastr.warning('Pasien ini tidak periksa bebas narkoba')
                return;
            }
            if ($scope.dataPasienSelected.norec_pd != ''){
                var local = JSON.parse(localStorage.getItem('profile'))
                    if(local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-narkoba?norec=" + $scope.dataPasienSelected.norec_pd  + '&kdprofile=' + profile
                        + '&jenis=his', '_blank');
                    }
            }
        }
        $scope.BebasNarkobav2 = function () {
            debugger
            if ($scope.dataPasienSelected.noregistrasi == undefined) {
                toastr.error('Pilih Data Dahulu')
                return;
            }
            if ($scope.dataPasienSelected.keterangan != 'Surat Keterangan Bebas Narkoba v2'){
                toastr.warning('Pasien ini tidak periksa bebas narkoba')
                return;
            }
            if ($scope.dataPasienSelected.norec_pd != ''){
                var local = JSON.parse(localStorage.getItem('profile'))
                    if(local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-bebas-narkobav2?norec=" + $scope.dataPasienSelected.norec_pd  + '&kdprofile=' + profile
                        + '&jenis=his', '_blank');
                    }
            }
        }
    }
]);
});