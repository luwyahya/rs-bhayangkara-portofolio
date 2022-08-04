define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DetailRegistrasiCtrl', ['$state', '$q', '$scope', '$window', 'CacheHelper', 'MedifirstService',
        function ($state, $q, $scope, window, cacheHelper, medifirstService) {
            // debugger;
            $scope.now = new Date();

            $scope.cboDokter = false;
            $scope.cboUbahDokter = true;

            $scope.dataParams = JSON.parse($state.params.dataPasien);
            // debugger;
            $scope.showBilling = false;
            //$scope.urlBilling = $sce.trustAsResourceUrl(manageTataRekening.openPageBilling($scope.dataParams.noRegistrasi));

            $scope.item = {};
            $scope.konsul = {}
            $scope.isRouteLoading = false;
            var status = '';
            $scope.listJenisOrder = [{ id: 1, jenisorder: 'Ambulance' }, { id: 2, jenisorder: 'Pemulasaraan Jenazah' }]

            //  manageTataRekening.getDataTableTransaksi("akutansi/get-terakhir-posting", true).then(function(dat){
            //     var tgltgltgltgl = dat.data.data[0].max
            //     $scope.startDateOptions = {
            //         min: new Date(tgltgltgltgl),
            //         max: new Date($scope.now)
            //     };
            // })
            medifirstService.get("tatarekening/tindakan/get-tanggal-posting", true).then(function (dat) {
                var tgltgltgltgl = dat.data.mindate[0].max
                var tglkpnaja = dat.data.datedate
                $scope.minDate = new Date(tgltgltgltgl);
                $scope.maxDate = new Date($scope.now);
                $scope.startDateOptions = {
                    disableDates: function (date) {
                        var disabled = tglkpnaja;
                        if (date && disabled.indexOf(date.getDate()) > -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            });
            //$scope.Pegawai=modelItemAkuntansi.getPegawai();

            LoadData();
            $scope.UbahDokter = function () {
                if (!$scope.currentRowData) {
                    messageContainer.error('Data belum dipilih')
                } else {
                    $scope.cboDokter = true
                    $scope.cboUbahDokter = false
                }
            }
            $scope.batal = function () {
                $scope.cboDokter = false
                $scope.cboUbahDokter = true
            }
            $scope.UbahRekanan = function () {
                $scope.cboRekanan = true
                $scope.cboUbahDokter = false
            }
            $scope.batalRekanan = function () {
                $scope.cboRekanan = false
                $scope.cboUbahDokter = true
            }

            // $scope.listStatus = manageKasir.getStatus();

            $scope.CariNoreg = function () {
                if ($scope.item.noRegistrasi == '') {
                    return;
                }
                if ($scope.item.noRegistrasi == '0') {
                    return;
                }
                if ($scope.item.noRegistrasi == undefined) {
                    return;
                }
                $scope.isRouteLoading = true;

                cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.item.noRegistrasi)
                //add Akomodasi
                var objSave = {
                    noregistrasi: $scope.item.noRegistrasi
                }

                medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
                    $q.all([
                        medifirstService.getServiceArray("tatarekening/get-detail_apd?noregistrasi=" + $scope.item.noRegistrasi),
                        medifirstService.getServiceArray("tatarekening/get-combo-detail-regis")
                    ])
                        .then(function (data) {

                            if (data[0].statResponse) {
                                $scope.item = data[0][0];
                                $scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
                                $scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
                                $scope.item.Noverifikasi = $scope.item.strukfk;

                            }
                            if (data[1].statResponse) {
                                $scope.listDokter = data[1].dokter;
                                $scope.listRuanganDokter = data[1].ruangan;
                                $scope.listRuanganKonsul = data[1].dataRuanganKonsul;
                                $scope.listRekanan = data[1].rekanan;
                                $scope.listKelompokPasien = data[1].kelompokpasien;
                                $scope.listKelas = data[1].kelas
                            }
                            $scope.isRouteLoading = false;
                        });

                })
                //end akomodasi
                medifirstService.get("tatarekening/get-detail-pasien?noregistrasi=" + $scope.item.noRegistrasi).then(function (e) {

                    for (var i = e.data.length - 1; i >= 0; i--) {
                        if (e.data[i].israwatgabung == 1) {
                            e.data[i].israwatgabung == "YA"
                        }
                    }
                    $scope.dataRincianTagihan = new kendo.data.DataSource({
                        data: e.data
                    });
                })

                medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" + chacePeriode).then(function (e) {
                    status = e.data.status;
                });
            }
            $scope.TambahObat = function () {
                //             if ($scope.item.Noverifikasi != null) {
                // 	window.messageContainer.error("Data sudah Diverifikasi");
                //                 return;
                // }

                // * Validasi Untuk Sekali Bayar
                // if(status==true){
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
                //return;
                // }
                // * Validasi Untuk Sekali Bayar

                var arrStr = {
                    0: $scope.item.noCm,
                    1: $scope.item.namaPasien,
                    2: $scope.item.jenisKelamin,
                    3: $scope.item.noRegistrasi,
                    4: '-', //$scope.item.umur,
                    5: $scope.item.klsid2, //$scope.item.kelas.id,
                    6: $scope.item.kelasRawat, //$scope.item.kelas.namakelas,
                    7: $scope.item.tglMasuk,
                    8: $scope.dataSelected.norec,
                    9: '',
                    10: $scope.item.namaPenjamin,
                    11: $scope.item.jenisPasien,
                    12: 0, //$scope.item.beratBadan,
                    13: '-' //$scope.item.AlergiYa
                }
                if (arrStr != null) {
                    cacheHelper.set('InputResepApotikCtrl', arrStr);
                    cacheHelper.set('cachePemakaianOA', arrStr);
                    $state.go('InputResepApotik')
                }

            }

            function LoadData() {
                // debugger;
                var chacePeriode = ''
                chacePeriode = cacheHelper.get('AntrianPasienDiperiksaNOREG');
                if (chacePeriode == '') {
                    return
                }
                if (chacePeriode == undefined) {
                    return
                }

                $scope.isRouteLoading = true;
                //add Akomodasi
                var objSave = {
                    noregistrasi: $scope.item.noRegistrasi
                }

                medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
                    $q.all([
                        medifirstService.getServiceArray("tatarekening/get-detail_apd?noregistrasi=" + chacePeriode),
                        medifirstService.getServiceArray("tatarekening/get-combo-detail-regis")
                    ])
                        .then(function (data) {

                            if (data[0].statResponse) {
                                $scope.item = data[0][0];
                                $scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
                                $scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
                                $scope.item.Noverifikasi = $scope.item.strukfk;

                                $scope.item.ubahpenjamin = { id: $scope.item.objectkelompokpasienlastfk, penjamin: $scope.item.jenisPasien };
                                $scope.item.ubahrekanan = { id: $scope.item.objectrekananfk, namarekanan: $scope.item.namaPenjamin };
                                $scope.item.ubahjaminankhusus = { id: $scope.item.objectjaminankhusus, namaexternal: $scope.item.jaminanKhusus };

                                // $scope.dataRincianTagihan = new kendo.data.DataSource({
                                // 	data: data[0].details
                                // });
                            }
                            if (data[1].statResponse) {
                                $scope.listDokter = data[1].dokter;
                                $scope.listRuanganDokter = data[1].ruangan;
                                $scope.listRuanganKonsul = data[1].dataRuanganKonsul;
                                $scope.listRekanan = data[1].rekanan;
                                $scope.listKelompokPasien = data[1].kelompokpasien;
                                $scope.listKelas = data[1].kelas
                            }
                            $scope.isRouteLoading = false;
                        });
                })
                //end akomodasi	
                medifirstService.get("tatarekening/get-detail-pasien?noregistrasi=" + chacePeriode).then(function (e) {
                    $scope.TglMeninggal = e.data[0].tglmeninggal
                    $scope.dataRincianTagihan = new kendo.data.DataSource({
                        data: e.data
                    });
                })
                medifirstService.get("tatarekening/get-data-master").then(function (e) {
                    $scope.listJenisPetugas = e.data.JenisPetugasPelaksana;
                    $scope.listPetugas = e.data.Pegawai;
                    $scope.listRuangan = e.data.Ruangan;
                });
                medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" + chacePeriode).then(function (e) {
                    status = e.data.status;
                });

                // manageTataRekening.postData('rensar/post-tindakan-nicu').then(function (e) {

                // });
                //           	medifirstService.get("tatarekening/get-daftar-registrasi-pasien?noReg="+chacePeriode, false).then(function(data) {
                //     $scope.item.Noverifikasi = data.data.nostruk;
                // })

            }


            $scope.dataVOloaded = true;
            $scope.now = new Date();


            $scope.rowNumber = 0;
            $scope.renderNumber = function () {
                return ++$scope.rowNumber;
            }



            $scope.columnRincianTagihan = [
                /*{
                    "field": "no",
                    "title": "No",
                    "width":"50px",
                    "template": "<span> {{renderNumber()}} </span>"
                },*/
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "150px",
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "150px",
                },
                {
                    "field": "namakelas",
                    "title": "Kelas",
                    "width": "80px",
                },
                {
                    "field": "namakamar",
                    "title": "Kamar",
                    "width": "80px",
                },
                {
                    "field": "nobed",
                    "title": "Bed",
                    "width": "100px"
                },
                // {
                // 	"field": "israwatgabung",
                // 	"title": "Rawat Gabung",
                // 	"width":"80px"
                // },
                {
                    "field": "tglmasuk",
                    "title": "Tgl Masuk",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                },
                {
                    "field": "tglkeluar",
                    "title": "Tgl Keluar",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
                },
                {
                    "field": "israwatgabung",
                    "title": "Rawat Gabung",
                    "width": "100px",
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
                },
                {
                    "field": "israwattitipan",
                    "title": "Rawat Titipan",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"updateStatusTitipan(dataItem)\"  style=\"margin:0 0 5px\">#:  israwattitipan #</button> ",
                }
            ];

            $scope.updateStatusTitipan = function (data) {
                debugger
                if (data.objectdepartemenfk != 16) {
                    toastr.error("Instalasi Rawat Jalan Tidak Bisa Diupdate Rawat Titipan")
                    return;
                }
                var status = false
                if (data.israwattitipan == false)
                    status = true
                var dataKonsul = {
                    "norec_apd": data.norec,
                    "statustitipan": status,
                }
                medifirstService.post('tatarekening/update-rawat-titipan', dataKonsul).then(function (e) {
                    LoadData();
                    $scope.saveLogKonsul();
                    $scope.batalKonsul();

                })
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.InputTindakan = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih pelayanan dahulu!");
                    return;
                }
                // if ($scope.dataSelected.nostruklastfk != null 
                // 	&&
                // 	$scope.dataSelected.rpp != null 
                // 	) {
                // 	window.messageContainer.error("Data sudah Diverifikasi");
                //                 return;
                // }

                // * Validasi Untuk Sekali Bayar
                // if(status==true){
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
                //return;
                // }
                // * Validasi Untuk Sekali Bayar

                if ($scope.item) {
                    $state.go('dashboardpasien.InputBilling', {
                        noRec: $scope.currentRowData.norec,
                        noAntrianPasien: $scope.currentRowData.norec,
                        noRegister: $scope.item.norec_pd
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }
            $scope.Detail = function () {
                if ($scope.item.noRegistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.item.noRegistrasi
                    }
                    cacheHelper.set('statusOtomatis', "YA");
                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
            }
            $scope.klik = function (rowClick) {
                $scope.currentRowData = rowClick;
            }

            $scope.DaftarRuangan = function () {
                if ($scope.currentRowData === undefined) {
                    messageContainer.error("Pilih data terlebih dahulu");
                    return
                } else {

                    $scope.konsul.kelas = $scope.listKelas[3]

                    $scope.cboDokter = false;
                    $scope.cboUbahDokter = false;
                    $scope.cboKonsul = true;
                    $scope.showUbahTanggal = false;
                }
            }
            $scope.getKelas = function (ruangan) {
                if (ruangan != undefined && ruangan.namaruangan.indexOf('Bedah') > -1) {
                    $scope.konsul.kelas = { id: $scope.currentRowData.kelasid, namakelas: $scope.currentRowData.namakelas }
                }
            }

            $scope.getKelasKon = function (id) {
                $scope.konsul.kelas = ""
                $scope.item.kelasKonsul = "";

                var ruanganId = $scope.konsul.ruangan.id;
                medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function (dat) {
                        $scope.listKelasKon = dat.data.kelas;

                    });
            }

            $scope.simpanKonsul = function () {
                var current = $scope.currentRowData;
                var length = $scope.dataRincianTagihan._data.length + 1;
                if ($scope.konsul.kelas == undefined) {
                    alert("Pilih Kelas dahulu!");
                    return;
                }
                var dataKonsul = {
                    "asalrujukanfk": current.objectasalrujukanfk,
                    "kelasfk": $scope.konsul.kelas.id, //6,//nonKelas current.kelasid,
                    "noantrian": length,
                    "norec_pd": $scope.item.norec_pd,
                    "dokterfk": $scope.konsul.namaDokter.id,
                    "objectruangantujuanfk": $scope.konsul.ruangan.id,
                    "objectruanganasalfk": current.ruid_asal
                }
                medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function (e) {
                    LoadData();
                    $scope.saveLogKonsul();
                    $scope.batalKonsul();

                })
            }
            //#save Log Konsul
            $scope.saveLogKonsul = function () {
                medifirstService.get("sysadmin/logging/save-log-konsul?norec_pd=" +
                    $scope.item.norec_pd +
                    "&dokterfk=" +
                    $scope.konsul.namaDokter.id +
                    "&kelasfk=" +
                    $scope.currentRowData.kelasid +
                    "&objectruangantujuanfk=" +
                    $scope.konsul.ruangan.id).then(function (data) { })
            }
            $scope.saveLogUbahRekanan = function () {
                medifirstService.get("sysadmin/logging/save-log-ubah-rekanan?norec_pd=" +
                    $scope.item.norec_pd
                ).then(function (data) { })
            }
            //end log
            $scope.batalKonsul = function () {
                $scope.cboUbahDokter = true;
                $scope.cboKonsul = false;

            }
            $scope.simpan = function () {
                var current = $scope.currentRowData;
                var length = $scope.dataRincianTagihan._data.length + 1;
                var updateDokter = {
                    "norec_apd": current.norec,
                    "objectpegawaifk": $scope.item.namaDokter.id
                }
                medifirstService.post('tatarekening/save-update-dokter_apd', updateDokter).then(function (e) {
                    LoadData();
                    $scope.batal();
                })
            }
            $scope.simpanRekanan = function () {
                if ($scope.item.kelompokPasien == undefined) {
                    window.messageContainer.error("Pilih Kelompok Pasien dahulu!");
                    return;
                }
                var rekanan = null
                if ($scope.item.namaRekanan != undefined) {
                    rekanan = $scope.item.namaRekanan.id
                }
                var current = $scope.currentRowData;
                var length = $scope.dataRincianTagihan._data.length + 1;
                var updateDokter = {
                    "norec_pd": $scope.item.norec_pd,
                    "objectrekananfk": rekanan,
                    "objectkelompokpasienlastfk": $scope.item.kelompokPasien.id
                }
                medifirstService.post('tatarekening/save-update-rekanan_pd', updateDokter).then(function (e) {
                    LoadData();
                    $scope.saveLogUbahRekanan();
                    $scope.batalRekanan();
                })
            }
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function (data) {

                })
            }
            $scope.HapusRegistrasiPush = function () {
                if ($scope.item.password != "donatelo") {
                    toastr.error("Password Salah!")
                    return;
                }
                var dataJson = {
                    norec_apd: $scope.currentRowData.norec
                }
                medifirstService.post('tatarekening/hapus-antrian-pasien', dataJson).then(function (e) {
                    if (e.status == 201) {
                        $scope.saveLogging('Hapus Konsul', 'norec Pasien Daftar',
                            $scope.item.norec_pd, $scope.currentRowData.namaruangan)
                    }
                    $scope.popupMergePendaftaran.close();
                    LoadData();
                    // $scope.batalKonsul();
                })
            }
            $scope.HapusRegistrasi = function () {
                $scope.item.password = "";
                if (!$scope.currentRowData) {
                    window.messageContainer.error('Data belum dipilih');
                    return;
                    // } else if ($scope.currentRowData.objectdepartemenfk == 16 || $scope.currentRowData.objectdepartemenfk == 25) {
                    // 	window.messageContainer.error('Data Antrian Rawat Inap Tidak Bisa Dihapus, Harap Hubungi IT!');
                    // 	return;
                } else if ($scope.currentRowData.objectdepartemenfk == 25) {
                    window.messageContainer.error('Data Antrian Rawat Inap Tidak Bisa Dihapus, Harap Hubungi IT!');
                    return;
                } else {
                    $scope.popupMergePendaftaran.center().open();
                }
            }

            $scope.EditRegistrasi = function () {
                $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                    noCm: $scope.item.noCm
                });
                var cacheSet = $scope.item.norec_pd +
                    "~" + $scope.item.noRegistrasi +
                    "~" + $scope.dataSelected.norec;
                cacheHelper.set('CacheRegistrasiPasien', cacheSet);
            }
            $scope.InputTindakanBeta = function () {

                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }

                // if ($scope.dataSelected.strukfk != ' / ') {
                // 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                //return;
                // }

                // * Validasi Untuk Sekali Bayar
                // if(status==true){
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
                //return;
                // }
                // * Validasi Untuk Sekali Bayar

                if ($scope.item) {
                    $state.go('InputTindakan', {
                        norecPD: $scope.item.norec_pd,
                        norecAPD: $scope.currentRowData.norec,

                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.PindahPulang = function () {
                if ($scope.item.tglPulang != "Invalid date") {
                    toastr.error('Pasien Sudah Di Pulangkan', 'Informasi');
                } else {
                    // medifirstService.get("pindahpasien/get-ruangan-last?norec_pd="+$scope.item.norec_pd).then(function (e) {
                    //  $scope.item.ruanganLast=e.data.data[0].objectruanganlastfk
                    // if ($scope.item.ruanganLast !=undefined){
                    medifirstService.get('registrasi/get-norec-apd?noreg=' + $scope.item.noRegistrasi +
                        '&namaRuangan=' + $scope.item.lastRuangan).then(function (e) {
                            if (e.data.length > 0) {
                                $state.go('PindahPulangPasien', {
                                    norecPD: $scope.item.norec_pd,
                                    norecAPD: e.data[0].norec_apd
                                });
                                var CachePindah = $scope.item.ruanganLast
                                cacheHelper.set('CachePindah', CachePindah);
                            }
                        })
                    // }
                    // })	
                }
            }
            medifirstService.get("tatarekening/get-combo-penjamin").then(function (dat) {
                $scope.listUbahPenjamin = dat.data.penjamin;
                $scope.listUbahRekanan = dat.data.rekanan;
                $scope.listUbahJaminanKhusus = dat.data.jaminankhusus;
            })
            $scope.UbahPenjamin = function () {
                // debugger;
                $scope.popUpUbahPenjamin.center().open();
            }

            $scope.SaveUbahPenjamin = function () {
                debugger;
                if ($scope.item.ubahpenjamin == undefined) {
                    toastr.error('Penjamin belum dipilih !', 'Warning !')
                    return;
                }
                if ($scope.item.ubahrekanan == undefined) {
                    toastr.error('Rekanan belum dipilih !', 'Warning !')
                    return;
                }
                let tglcsr = null;
                let jaminankhusus = 0;
                let namajaminankhusus = "Bukan CSR"
                if ($scope.item.ubahjaminankhusus == undefined) {
                    // toastr.error('Jaminan Khusus belum dipilih !', 'Warning !')
                    // return;
                    tglcsr = null;
                } else {
                    namajaminankhusus = $scope.item.ubahjaminankhusus.namaexternal;
                    jaminankhusus = $scope.item.ubahjaminankhusus.id;
                    tglcsr = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
                }
                if ($scope.item.password2 != "ubahpenjamin") {
                    toastr.error("Password Salah !")
                    return;
                }
                // var penjamin = ""
                // if ($scope.item.ubahpenjamin) {
                // }

                // var 
                var dataJson = {
                    noregistrasi: $scope.item.noRegistrasi,
                    norec_pd: $scope.item.norec_pd,
                    penjamin: $scope.item.ubahpenjamin.id,
                    rekanan: $scope.item.ubahrekanan.id,
                    jaminankhusus: jaminankhusus,
                    tglcsr: tglcsr
                }
                medifirstService.post('tatarekening/save-update-penjamin', dataJson).then(function (e) {

                    $scope.saveLogging('Ubah Penjamin', 'No Registrasi Pasien',
                        $scope.item.noRegistrasi, `${$scope.item.noRegistrasi} Jaminan khusus ${namajaminankhusus}, Penjamin ${$scope.item.ubahpenjamin.penjamin}, Rekanan ${$scope.item.ubahrekanan.namarekanan}`)

                    LoadData();

                    $scope.popUpUbahPenjamin.close();
                })
            }

            $scope.UbahTanggal = function () {
                if ($scope.currentRowData === undefined) {
                    messageContainer.error("Pilih data terlebih dahulu");
                } else {
                    $scope.item.tglRegiss = new Date();
                    $scope.item.tglMasuks = new Date();
                    $scope.item.tglKeluars = new Date();
                    $scope.item.tglPulangs = new Date();
                    $scope.cboDokter = false;
                    $scope.cboUbahDokter = false;
                    $scope.showUbahTanggal = true;
                    $scope.item.cekTglRegis = false;
                    $scope.item.cekTglMasuk = false;
                    $scope.item.cekTglKeluar = false;
                    $scope.item.cekTglPulang = false;
                }
            }
            $scope.batalUbahTanggal = function () {
                $scope.cboUbahDokter = true;
                $scope.showUbahTanggal = false;

            }

            function simpanTanggal() {
                var tglregistrasis = "";
                if ($scope.item.cekTglRegis) {
                    tglregistrasis = moment($scope.item.tglRegiss).format('YYYY-MM-DD HH:mm:ss')
                }
                var tglmasuks = "";
                if ($scope.item.cekTglMasuk) {
                    tglmasuks = moment($scope.item.tglMasuks).format('YYYY-MM-DD HH:mm:ss')
                }
                var tglkeluars = "";
                if ($scope.item.cekTglKeluar) {
                    tglkeluars = moment($scope.item.tglKeluars).format('YYYY-MM-DD HH:mm:ss')
                }
                var tglpulangs = "";
                if ($scope.item.cekTglPulang) {
                    tglpulangs = moment($scope.item.tglPulangs).format('YYYY-MM-DD HH:mm:ss')
                }

                var id = medifirstService.getPegawaiLogin().id


                var id = medifirstService.getPegawaiLogin().id
                if (tglpulangs != '') {
                    if (id === 890 || id === 320263) {
                        var dataJson = {
                            noregistrasi: $scope.item.noRegistrasi,
                            norec_pd: $scope.item.norec_pd,
                            ruanganasal: $scope.currentRowData.ruid_asal,
                            norec_apd: $scope.currentRowData.norec,
                            tglregistrasi: tglregistrasis,
                            tglmasuk: tglmasuks,
                            tglkeluar: tglkeluars,
                            tglpulang: tglpulangs
                        }
                        medifirstService.post('tatarekening/ubah-tgl-detailregistrasi', dataJson).then(function (e) {
                            if (e.status = 201) {
                                $scope.saveLogging('Ubah Tgl Detail Registrasi', 'norec Antrian Pasien Diperiksa',
                                    $scope.currentRowData.norec, 'Ubah Tgl di Detail Registrasi pada No Registrasi ' + $scope.item.noRegistrasi)

                                LoadData();

                                $scope.batalUbahTanggal();
                            }
                            $scope.popupUbahTanggal.close();
                        })

                    }
                } else {
                    var dataJson = {
                        noregistrasi: $scope.item.noRegistrasi,
                        norec_pd: $scope.item.norec_pd,
                        ruanganasal: $scope.currentRowData.ruid_asal,
                        norec_apd: $scope.currentRowData.norec,
                        tglregistrasi: tglregistrasis,
                        tglmasuk: tglmasuks,
                        tglkeluar: tglkeluars
                    }
                    medifirstService.post('tatarekening/ubah-tgl-detailregistrasi', dataJson).then(function (e) {
                        if (e.status = 201) {
                            $scope.saveLogging('Ubah Tgl Detail Registrasi', 'norec Antrian Pasien Diperiksa',
                                $scope.currentRowData.norec, 'Ubah Tgl di Detail Registrasi pada No Registrasi ' + $scope.item.noRegistrasi)

                            LoadData();

                            $scope.batalUbahTanggal();
                        }
                        $scope.popupUbahTanggal.close();
                    })
                }
            }


            $scope.simpanTanggal = function () {
                // debugger;
                medifirstService.get("tatarekening/tindakan/get-tanggal-posting").then(function (dat) {
                    var mindate = dat.data.mindatee[0].max
                    debugger;
                    var tglregistrasis = "";
                    if ($scope.item.cekTglRegis) {
                        tglregistrasis = moment($scope.item.tglRegiss).format('YYYY-MM-DD HH:mm:ss')
                    }
                    var tglmasuks = "";
                    if ($scope.item.cekTglMasuk) {
                        tglmasuks = moment($scope.item.tglMasuks).format('YYYY-MM-DD HH:mm:ss')
                    }
                    var tglkeluars = "";
                    if ($scope.item.cekTglKeluar) {
                        tglkeluars = moment($scope.item.tglKeluars).format('YYYY-MM-DD HH:mm:ss')
                    }
                    var tglpulangs = "";
                    if ($scope.item.cekTglPulang) {
                        tglpulangs = moment($scope.item.tglPulangs).format('YYYY-MM-DD HH:mm:ss')
                    }
                    // if (mindate > tglmasuks && tglmasuks != ""){
                    // 	$scope.popupUbahTanggal.center().open();
                    // 	return;
                    // } else if (mindate > tglkeluars && tglkeluars != ""){
                    // 	$scope.popupUbahTanggal.center().open();
                    // 	return;
                    // } else if (mindate > tglregistrasis && tglregistrasis != ""){
                    // 	$scope.popupUbahTanggal.center().open();
                    // 	return;
                    // } else if (mindate > tglpulangs && tglpulangs != ""){
                    // 	$scope.popupUbahTanggal.center().open();
                    // 	return;
                    // }

                    let user = medifirstService.getPegawaiLogin();
                    var id = medifirstService.getPegawaiLogin().id
                    if (tglpulangs != '') {
                        if (id === 890 || id === 320263 || id === 25093 || id === 25496 || id === 27382 || id === 27233 || user.ruangan.id == 809) {
                            var dataJson = {
                                noregistrasi: $scope.item.noRegistrasi,
                                norec_pd: $scope.item.norec_pd,
                                ruanganasal: $scope.currentRowData.ruid_asal,
                                norec_apd: $scope.currentRowData.norec,
                                tglregistrasi: tglregistrasis,
                                tglmasuk: tglmasuks,
                                tglkeluar: tglkeluars,
                                tglpulang: tglpulangs
                            }
                            medifirstService.post('tatarekening/ubah-tgl-detailregistrasi', dataJson).then(function (e) {
                                if (e.status = 201) {
                                    $scope.saveLogging('Ubah Tgl Detail Registrasi', 'norec Antrian Pasien Diperiksa',
                                        $scope.currentRowData.norec, 'Ubah Tgl di Detail Registrasi pada No Registrasi ' + $scope.item.noRegistrasi)
                                    LoadData();
                                    $scope.batalUbahTanggal();
                                }
                            })
                        } else {
                            window.messageContainer.error("Tidak Bisa Merubah Tanggal Pulang!");
                            return;
                        }
                    } else {
                        var dataJson = {
                            noregistrasi: $scope.item.noRegistrasi,
                            norec_pd: $scope.item.norec_pd,
                            ruanganasal: $scope.currentRowData.ruid_asal,
                            norec_apd: $scope.currentRowData.norec,
                            tglregistrasi: tglregistrasis,
                            tglmasuk: tglmasuks,
                            tglkeluar: tglkeluars
                        }
                        medifirstService.post('tatarekening/ubah-tgl-detailregistrasi', dataJson).then(function (e) {
                            if (e.status = 201) {
                                $scope.saveLogging('Ubah Tgl Detail Registrasi', 'norec Antrian Pasien Diperiksa',
                                    $scope.currentRowData.norec, 'Ubah Tgl di Detail Registrasi pada No Registrasi ' + $scope.item.noRegistrasi)

                                LoadData();

                                $scope.batalUbahTanggal();
                            }
                            $scope.popupUbahTanggal.close();
                        })
                    }
                });
            }

            $scope.ubahTanggalPush = function () {
                debugger;
                if ($scope.item.password != "gantitanggal") {
                    toastr.error("Password Salah !")
                    return;
                } else {
                    simpanTanggal();
                }
            }

            $scope.pisahFaktur = function () {
                debugger
                if ($scope.currentRowData === undefined) {
                    messageContainer.error("Pilih data terlebih dahulu");
                } else {
                    var rekananId = 581492;
                    var kelompokPasienId = 13;
                    if ($scope.currentRowData.iscovid != 19) {
                        var rekananId = 581367;
                        var kelompokPasienId = 2;
                        // messageContainer.error("Ruangan Ini Bukan Zona Merah");
                        // return
                    }
                    var kelasId = "";
                    if ($scope.currentRowData.kelasid == undefined || $scope.currentRowData.kelasid == "") {
                        kelasId = null;
                    } else
                        kelasId = $scope.currentRowData.kelasid;

                    var dokterId = "";
                    if ($scope.currentRowData.pgid == undefined || $scope.currentRowData.pgid == "") {
                        dokterId = null;
                    } else
                        dokterId = $scope.currentRowData.pgid;

                    var kamarIds = "";
                    if ($scope.currentRowData.objectkamarfk == undefined || $scope.currentRowData.objectkamarfk == "") {
                        kamarIds = null;
                    } else
                        kamarIds = $scope.currentRowData.objectkamarfk;


                    var nomorTempatTidurs = "";
                    if ($scope.currentRowData.idnobed == undefined || $scope.currentRowData.idnobed == "" || $scope.currentRowData.idnobed != null) {
                        // if ($scope.model.rawatInap != undefined) {
                        // 	messageContainer.error("Nomor Tempat Tidur Harus Di isi / Bed Penuh")
                        // 	return
                        // } else {
                        nomorTempatTidurs = null;
                        // }
                    } else
                        nomorTempatTidurs = $scope.currentRowData.idnobed;

                    var noRegistrasi = "";

                    var norec_PasienDaftar = $scope.item.norec_pd;

                    var norec_Antrian = $scope.currentRowData.norec;
                    var jenisPel = 1;
                    var isRawatInap = "true"
                    if (nomorTempatTidurs == null) {
                        isRawatInap = "false"
                    }
                    var jaminankhusus = null;

                    var catatan = null;

                    var noRegistrasizz = ""


                    var statusPasien = ''
                    var isRegisOnline = '';
                    var pasiendaftar = {
                        tglregistrasi: moment($scope.currentRowData.tglmasuk).format('YYYY-MM-DD HH:mm:ss'),
                        tglregistrasidate: moment($scope.currentRowData.tglmasuk).format('YYYY-MM-DD'),
                        tglpulang: moment($scope.currentRowData.tglkeluar).format('YYYY-MM-DD HH:mm:ss'),
                        nocmfk: $scope.item.nocmfk,
                        objectruanganfk: $scope.currentRowData.objectruanganfk,
                        objectdepartemenfk: $scope.currentRowData.objectdepartemenfk,
                        objectkelasfk: kelasId,
                        objectkelompokpasienlastfk: kelompokPasienId,
                        objectrekananfk: rekananId,
                        tipelayanan: jenisPel,
                        objectpegawaifk: dokterId,
                        noregistrasi: noRegistrasizz,
                        norec_pd: norec_PasienDaftar,
                        israwatinap: isRawatInap,
                        statusschedule: isRegisOnline,
                        statuspasien: statusPasien,
                        istelemedicine: "false",
                        jaminankhusus: jaminankhusus,
                        catatan: catatan,
                    }
                    var antrianpasiendiperiksa = {
                        norec_apd: norec_Antrian,
                        tglregistrasi: moment($scope.currentRowData.tglmasuk).format('YYYY-MM-DD HH:mm:ss'),
                        objectruanganfk: $scope.currentRowData.objectruanganfk,
                        objectkelasfk: kelasId,
                        objectpegawaifk: dokterId,
                        objectkamarfk: kamarIds,
                        nobed: nomorTempatTidurs,
                        objectdepartemenfk: $scope.currentRowData.objectdepartemenfk,
                        objectasalrujukanfk: 2,
                        israwatgabung: 0,
                    }
                    var objSave = {
                        pasiendaftar: pasiendaftar,
                        antrianpasiendiperiksa: antrianpasiendiperiksa
                    }
                    medifirstService.post('registrasi/save-registrasipisahfaktur', objSave).then(function (e) {
                        $scope.resultAPD = e.data.dataAPD;
                        debugger
                        // responData = e.data;
                        $scope.resultPD = e.data.dataPD;
                        $scope.Noregistrasi = e.data.dataPD.noregistrasi;
                        $scope.cacheNoRegistrasi = e.data.dataPD.noregistrasi;
                        debugger
                        medifirstService.get("sysadmin/logging/save-log-pendaftaran-pasien?norec_pd=" +
                            e.data.dataPD.norec
                        ).then(function (data) {
                            LoadData();
                        })
                    }, function (error) {
                        // throw error;
                        $scope.isSimpan = false;
                        $scope.isBatal = false;
                        if (error.data.message == "Pasien Belum Dipulangkan") {
                            // alert(error.data.message)
                            // return;
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Pasien Masih Terdaptar di Rawat Inap/ Pasien Belum Dipulangkan')
                                .ariaLabel('Lucky day')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                return;
                            })
                        }
                    })
                }
            }

            $scope.GantiRuanganTerakhir = function () {
                $scope.isRouteLoading = true
                if ($scope.currentRowData === undefined) {
                    toastr.warning('Pilih Data Yang Akan Dipindah, Peringatan!');
                    return;
                }
                var norReg = "noReg=" + $scope.item.noRegistrasi;
                medifirstService.get("registrasi/get-antrian-pasien-diperiksa-by-noreg?" +
                    norReg
                ).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.listRuangAPD = dat.data.data
                    $scope.item.ruangTujuanPindah = { id: $scope.listRuangAPD[0].objectruanganfk, namaruangan: $scope.listRuangAPD[0].namaruangan }
                    $scope.popGantiRuangan.center().open();
                });
            }

            $scope.GantiRuanganTerakhir2 = function () {
                $scope.isRouteLoading = true
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                var objDelete = {
                    "noregistrasi": $scope.item.noRegistrasi,
                    "ruangantujuan": $scope.item.ruangTujuanPindah.details[0].objectruanganfk
                };
                medifirstService.post('tatarekening/ganti-ruangan-terakhir', objDelete).then(function (e) {
                    //  managePasien.hapusTindakan(tempData).then(function(e){
                    if (e.status === 201) {
                        LoadData();
                        $scope.popGantiRuangan.close();
                    }
                    $scope.isRouteLoading = false
                    // LoadData();
                })
            }

            $scope.PindahTindakan = function () {
                $scope.isRouteLoading = true
                if ($scope.currentRowData === undefined) {
                    toastr.warning('Pilih Data Yang Akan Dipindah, Peringatan!');
                    return;
                }
                var norReg = "noReg=" + $scope.item.noRegistrasi;
                medifirstService.get("registrasi/get-antrian-pasien-diperiksa-by-noreg?" +
                    norReg
                ).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.listRuangAPD = dat.data.data
                    $scope.item.ruangTujuanPindah = { id: $scope.listRuangAPD[0].objectruanganfk, namaruangan: $scope.listRuangAPD[0].namaruangan }
                    $scope.popPindahTindakn.center().open();
                });
            }

            $scope.PindahTindakan2 = function () {
                $scope.isRouteLoading = true
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                var objDelete = {
                    "norec_apd": $scope.currentRowData.norec,
                    "norec_apd_tujuan": $scope.item.ruangTujuanPindah.details[0].norec_apd,
                    "alasan": $scope.item.alasanPindah,
                    "pegawai": nama
                };
                medifirstService.post('tatarekening/pindah-pelayanan-pasien', objDelete).then(function (e) {
                    //  managePasien.hapusTindakan(tempData).then(function(e){
                    if (e.status === 201) {
                        LoadData();
                        $scope.popPindahTindakn.close();
                    }
                    $scope.isRouteLoading = false
                    // LoadData();
                })
            }
            $scope.PindahTindakanBedaNomorRegistrasi = function () {
                $scope.isRouteLoading = true
                if ($scope.currentRowData === undefined) {
                    toastr.warning('Pilih Data Yang Akan Dipindah, Peringatan!');
                    return;
                }
                $scope.popPindahTindakanBedaNomorRegistrasi.center().open();
                $scope.isRouteLoading = false
            }
            $scope.cariNoRegistrasi = function () {
                $scope.isRouteLoading = true
                var norReg = "noReg=" + $scope.item.noregistrasiTujuan;
                medifirstService.get("registrasi/get-antrian-pasien-diperiksa-by-noreg?" +
                    norReg
                ).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.listRuangAPDBedaNoRegistrasi = dat.data.data
                    $scope.item.ruangTujuanPindahBedaNoRegistrasi = { id: $scope.listRuangAPDBedaNoRegistrasi[0].objectruanganfk, namaruangan: $scope.listRuangAPDBedaNoRegistrasi[0].namaruangan }
                    $scope.popPindahTindakanBedaNomorRegistrasi.center().open();
                });
            }
            $scope.PindahTindakanBedaNomorRegistrasi2 = function () {
                $scope.isRouteLoading = true
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                var objDelete = {
                    "norec_apd": $scope.currentRowData.norec,
                    "norec_pd_tujuan": $scope.item.ruangTujuanPindahBedaNoRegistrasi.norec,
                    "alasan": $scope.item.alasanPindah,
                    "pegawai": nama
                };
                medifirstService.post('tatarekening/pindah-history-apd', objDelete).then(function (e) {
                    //  managePasien.hapusTindakan(tempData).then(function(e){
                    if (e.status === 201) {

                        LoadData();
                        $scope.popPindahTindakanBedaNomorRegistrasi.close();
                    }
                    $scope.isRouteLoading = false
                    // LoadData();
                })
            }

            $scope.orderPenunjang = function () {
                // * Validasi Untuk Sekali Bayar
                //if(status==true){
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
                //return;
                // }
                // * Validasi Untuk Sekali Bayar
                debugger

                if ($scope.currentRowData != undefined) {
                    $state.go('OrderPenunjang', {
                        norecPD: $scope.item.norec_pd,
                        norecAPD: $scope.currentRowData.norec,
                    });
                } else {
                    window.messageContainer.error("Data Belum diPilih!!");
                    return;
                }
            }

            $scope.NonLayanan = function () {
                $scope.popUp.center().open();
            }

            $scope.OrderNonLayanan = function () {
                if ($scope.item.jenisOrder == undefined) {
                    window.messageContainer.error("Jenis Order Harus Di isi!");
                    return;
                }

                if ($scope.item.jenisOrder.id == 2) {
                    if ($scope.TglMeninggal == undefined && $scope.item.tglPulang == undefined || $scope.item.tglPulang == "Invalid date") {
                        toastr.error('Pasien Masih Hidup, Tidak Bisa Melakukan Order Jenazah', 'Informasi');
                        return
                    }

                    if ($scope.currentRowData != undefined) {
                        $state.go('OrderJenazah', {
                            norecPD: $scope.item.norec_pd,
                            norecAPD: $scope.currentRowData.norec,
                        });
                    }
                } else if ($scope.item.jenisOrder.id == 1) {
                    if ($scope.currentRowData != undefined) {
                        $state.go('OrderAmbulan', {
                            norecPD: $scope.item.norec_pd,
                            norecAPD: $scope.currentRowData.norec,
                        });
                    }
                }
            }

            $scope.batalOrder = function () {
                $scope.item.jenisOrder = undefined;
                $scope.popUp.close();
            }

            $scope.rekapBilling = function () {
                var chacePeriode = ''
                chacePeriode = cacheHelper.get('AntrianPasienDiperiksaNOREG');
                if (chacePeriode == '') {
                    return
                }
                if (chacePeriode == undefined) {
                    return
                }
                var obj = {
                    noRegistrasi: chacePeriode
                }

                $state.go('RekapTagihan', {
                    dataPasien: JSON.stringify(obj)
                });
            }
        }
    ]);
});