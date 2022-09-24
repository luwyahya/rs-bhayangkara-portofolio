define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('MasterPegawaiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper', '$window',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper, $window) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.itemKeluarga = {};
            $scope.itemPendidikan = {};
            $scope.itemDikJur = {};
            $scope.itemPelatihan = {};
            $scope.itemLogin = {};
            $scope.itemLogin.idlogin = undefined;
            $scope.itemLogin.pegawaiId = undefined;
            $scope.itemJabatan = {};
            $scope.itemSip = {};
            var sip = {};
            var str = {};
            $scope.itemStr = {};
            $scope.itemTelp = [];
            $scope.kta = false;
            $scope.item.no = undefined;
            $scope.item.idPegawai = undefined;
            $scope.item.PasswordDefault = undefined;
            $scope.item.image = "../app/images/avatar.jpg"
            $scope.now = new Date();
            var dataKeluarga = [];
            var dataPegawai = [];
            var dataPhoto = [];
            var dataRiwayatPendidikan = [];
            var dataRiwayatJabatan = [];
            var dataSip = [];
            var dataStr = [];
            var dataNoTelp = [];
            var objSave = [];
            var objUpload = [];
            var dataRiwayatPelatihan = [];
            var jenisCache = "";
            $scope.loginDisabled = false;
            var pdf = [];
            var pdf2 = [];
            var pdf3 = [];
            var pdf4 = [];
            var pdf5 = [];
            var pdf6 = [];
            var pdf7 = [];
            var pdf8 = [];
            var pdf9 = [];
            var pdf10 = [];
            var pdf11 = [];
            var pdf12 = [];
            var pdf13 = [];
            var pdf14 = [];
            var pdf15 = [];
            var pdf16 = [];
            var namafilepdf7 = "";
            var tampungankosong = "";
            var tampungruanganlogin = {};
            var fotoprofile = [];
            $scope.images2 = [];
            $scope.monthSelectorOptions = function () {
                return {
                    start: "decade",
                    depth: "decade",
                }
            }
            FormLoad();
            // LoadCache();

            function ClearAll() {
                $scope.item = {};
            };

            function ClearDataKeluarga() {
                $scope.itemKeluarga = {};
                pdf3 = [];
                pdf4 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");				
            };

            function ClearDataRiwayatPendidikan() {
                $scope.itemPendidikan = {};
                pdf = [];
                pdf2 = [];
                pdf13 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataRiwayatPelatihan() {
                $scope.itemPelatihan = {};
                pdf5 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataRiwayatJabatan() {
                $scope.itemPendidikan = {};
                pdf6 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataUserLogin() {
                $scope.itemLogin = {};
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataSip() {
                $scope.itemSip = {};
                pdf7 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataStr() {
                $scope.itemStr = {};
                pdf8 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };
            function ClearDataSpkk() {
                $scope.itemSpkk = {};
                pdf9 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };
            function ClearDataSeminar() {
                $scope.itemSeminar = {};
                pdf10 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataTelp() {
                dataNoTelp = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataDikjur() {
                $scope.itemDikJur = {};
                pdf11 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };
            function ClearDataTandaJasa() {
                $scope.itemTandaJasa = {};
                pdf12 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };
            function ClearDataKecakapanBahasa() {
                $scope.itemkecakapanBahasa = {};
                pdf14 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };
            function ClearDataOrganisasiProfesi() {
                $scope.itemOrganisasiProfesi = {};
                pdf16 = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function FormLoad() {
                $scope.isRouteLoading = true;
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPgw = data;
                });
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    $scope.ListJenisKelamin = dataCombo.jeniskelamin;
                    $scope.ListAgama = dataCombo.agama;
                    $scope.ListStatusKawin = dataCombo.statuskawin;
                    $scope.ListPendidikan = dataCombo.pendidikan;
                    // $scope.UsiaPensiun =dataCombo.usiapensiun.nilaifield;
                    $scope.ListKedudukanPegawai = dataCombo.kedudukan;
                    $scope.ListKategoriPegawai = dataCombo.kategorypegawai;
                    $scope.ListJabatanFungsional = dataCombo.jabatan;
                    $scope.ListGolonganPegawai = dataCombo.golonganpegawai;
                    $scope.ListDetilKelompokJabatan = dataCombo.kelompokjabatan;
                    $scope.ListEselon = dataCombo.eselon;
                    $scope.ListPolaKerja = dataCombo.shiftkerja;
                    $scope.ListTanggungan = dataCombo.tanggungan;
                    $scope.ListPekerjaan = dataCombo.pekerjaan;
                    $scope.ListHubunganKeluarga = dataCombo.hubungankeluarga;
                    $scope.listJenisJabatan = dataCombo.datajabatan;
                    $scope.listKelompokuser = dataCombo.kelompokuser;
                    $scope.item.PasswordDefault = dataCombo.passwordawal.nilaifield;
                    $scope.itemLogin.kataKunciPass = $scope.item.PasswordDefault;
                    $scope.itemLogin.kataKunciConfirm = $scope.item.PasswordDefault;
                    $scope.ListJenisMasaBerlaku = dataCombo.datamasaberlaku;
                    $scope.ListUnitKerja = dataCombo.dataunitkerja;
                    $scope.ListProvider = dataCombo.jenisprovider;
                    $scope.ListJenisPegawai = dataCombo.jenispegawai;
                    $scope.ListRuangan = dataCombo.ruangan;
                    $scope.ListGPP = dataCombo.golonganpajakpegawai;
                    $scope.ListPangkatPolisi = dataCombo.pangkatpolisi;
                    $scope.ListGolonganDarah = dataCombo.golongandarah;
                    $scope.ListJenisBahasa = dataCombo.jenisbahasa;
                    // $scope.ListSubUnitKerja = dataCombo.subunitkerja;
                    LoadCache();
                });

                medifirstService.get("sdm/get-petugas-diklat", true, true, 20).then(function (data) {
                    $scope.ListPetugasDiklat = data.data.data;
                });
                medifirstService.get("sdm/get-foto-default?id=34").then(function (dat) {
                    debugger
                    var foto = dat.data[0].template
                    $scope.images2.push({
                        dataURL2: foto
                    })
                })
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('MasterPegawaiCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.idPegawai = chacePeriode[0];
                    jenisCache = chacePeriode[1];
                    $scope.itemLogin.kataKunciPass = undefined;
                    $scope.itemLogin.kataKunciConfirm = undefined;
                    $scope.item.PasswordDefault = undefined;
                    init();
                } else {
                    init();
                }
            }

            function init() {
                if (jenisCache != '') {
                    if (jenisCache == 'EditPegawai') {
                        medifirstService.get("sdm/get-data-detail-pegawai?idPegawai=" + $scope.item.idPegawai, true).then(function (dat) {
                            debugger;
                            $scope.ShowLogin = false;
                            var dataCache = dat.data;
                            var dataCachePegawai = dataCache.datapegawai[0];
                            var dataCacheKeluarga = dataCache.datakeluarga;
                            var dataCachePendidikan = dataCache.datapendidikan;
                            var dataCachePelatihan = dataCache.datapelatihan;
                            var dataCacheJabatan = dataCache.datajabatan;
                            var dataCacheSip = dataCache.datasip;
                            var dataCacheStr = dataCache.datastr;
                            var dataCacheTelp = dataCache.datatelp;

                            // Data Pegawai
                            $scope.item.idPegawai = dataCachePegawai.id;
                            $scope.item.nipPns = dataCachePegawai.nippns;
                            $scope.item.namaLengkap = dataCachePegawai.namalengkap;
                            $scope.item.gelarDepan = dataCachePegawai.gelardepan;
                            $scope.item.gelarBelakang = dataCachePegawai.gelarbelakang;
                            $scope.item.nama = dataCachePegawai.nama;
                            $scope.item.tempatLahir = dataCachePegawai.tempatlahir;
                            $scope.item.ruangan = { id: dataCachePegawai.idruangan, namaruangan: dataCachePegawai.namaruangan };
                            $scope.item.nrp = dataCachePegawai.nrp;
                            $scope.item.gpp = { id: dataCachePegawai.objectpajakpegawai, golonganpajakpegawai: dataCachePegawai.golonganpajakpegawai };
                            $scope.item.nik = dataCachePegawai.nik_intern;
                            $scope.item.nobpjs = dataCachePegawai.nobpjs;
                            $scope.item.nocm = dataCachePegawai.nocm;
                            $scope.item.golongandarah = { id: dataCachePegawai.objectgolongandarahfk, golongandarah: dataCachePegawai.golongandarah };
                            $scope.item.email = dataCachePegawai.email
                            if (dataCachePegawai.photo != null) {
                                if ($scope.images2.length > 0) {
                                    $scope.images2.splice($scope.images2, 1)
                                }
                                var foto = dataCachePegawai.photo
                                $scope.images2.push({
                                    dataURL2: foto
                                })
                                fotoprofile.push(foto)
                            } else {
                                fotoprofile.push(null)
                            }

                            if (dataCachePegawai.tgllahir)
                                $scope.item.tglLahir = moment(dataCachePegawai.tgllahir).format('YYYY-MM-DD HH:mm');
                            if ($scope.item.tglLahir != undefined) {
                                $scope.item.tglPensiun = moment(dataCachePegawai.tgllahir).add(58, 'years').format('YYYY-MM-DD HH:mm');
                            }
                            if (dataCachePegawai.unitkerja)
                                $scope.item.unitKerja = { id: dataCachePegawai.objectunitkerjapegawaifk, name: dataCachePegawai.unitkerja };
                            $scope.item.jenisKelamin = { id: dataCachePegawai.objectjeniskelaminfk, jeniskelamin: dataCachePegawai.jeniskelamin };
                            $scope.item.pendidikan = { id: dataCachePegawai.objectpendidikanterakhirfk, pendidikan: dataCachePegawai.pendidikan };
                            $scope.item.statusPerkawinanPegawai = { id: dataCachePegawai.objectstatusperkawinanpegawaifk, statusperkawinan: dataCachePegawai.statusperkawinan };
                            $scope.item.npwp = dataCachePegawai.npwp
                            $scope.item.agama = { id: dataCachePegawai.objectagamafk, agama: dataCachePegawai.agama };
                            if (dataCachePegawai.tglmeninggal)
                                $scope.item.tglMeninggal = moment(dataCachePegawai.tglmeninggal).format('YYYY-MM-DD HH:mm');
                            debugger
                            $scope.item.noKta = parseInt(dataCachePegawai.nokta);
                            if (dataCachePegawai.kta != null) {
                                pdf15.push(dataCachePegawai.kta)
                                $scope.kta = true;
                            }
                            // End Data Pegawai

                            // Data Rekening
                            $scope.item.bankRekeningNomor = dataCachePegawai.bankrekeningnomor;
                            $scope.item.bankRekeningAtasNama = dataCachePegawai.bankrekeningatasnama;
                            $scope.item.bankRekeningNama = dataCachePegawai.bankrekeningnama;
                            $scope.item.salary = dataCachePegawai.salary;
                            // End Data Rekening

                            // Data Alamat
                            $scope.item.alamat = dataCachePegawai.alamat;
                            $scope.item.kodePos = dataCachePegawai.kodepos;
                            if (dataCachePegawai.poinjpt != null) {
                                $scope.item.poinjpt = parseFloat(dataCachePegawai.poinjpt).toFixed(4);
                            }
                            if (dataCachePegawai.namaexternal == 'dl') {
                                $scope.item.dl = true;
                            }
                            // End Alamat

                            // Data Status Kepegawaian\
                            if (dataCachePegawai.tglmasuk)
                                $scope.item.tglMasuk = moment(dataCachePegawai.tglmasuk).format('YYYY-MM-DD HH:mm');
                            if (dataCachePegawai.tglkeluar)
                                $scope.item.tglkeluar = moment(dataCachePegawai.tglkeluar).format('YYYY-MM-DD HH:mm');
                            $scope.item.pensiun = parseInt(dataCachePegawai.pensiun);
                            if (dataCachePegawai.tglpensiun)
                                $scope.item.tglPensiun = moment(dataCachePegawai.tglpensiun).format('YYYY-MM-DD HH:mm');
                            $scope.item.kategoryPegawai = { id: dataCachePegawai.kategorypegawai, kategorypegawai: dataCachePegawai.namakategorypegawai };
                            $scope.item.pangkatpolisi = { id: dataCachePegawai.id_pp, pangkatpolisi: dataCachePegawai.pangkatpolisi };
                            $scope.item.kedudukan = { id: dataCachePegawai.kedudukanfk, name: dataCachePegawai.kedudukan };
                            $scope.item.golonganPegawai = { id: dataCachePegawai.objectgolonganfk, name: dataCachePegawai.golongan };
                            $scope.item.jabatanFungsional = { id: dataCachePegawai.objectjabatanfungsionalfk, namajabatan: dataCachePegawai.jbfungsional };
                            $scope.item.detailKelompokJabatan = { id: dataCachePegawai.objectkelompokjabatanfk, detailkelompokjabatan: dataCachePegawai.detailkelompokjabatan };
                            if (dataCachePegawai.grade)
                                $scope.item.grade = parseFloat(dataCachePegawai.grade);
                            $scope.item.eselon = { id: dataCachePegawai.objecteselonfk, eselon: dataCachePegawai.eselon };
                            $scope.item.idFinger = dataCachePegawai.idfinger;
                            $scope.item.shiftKerja = { id: dataCachePegawai.objectshiftkerja, kelompokshiftkerja: dataCachePegawai.kelompokshiftkerja };
                            $scope.item.JenisPegawai = { id: dataCachePegawai.objectjenispegawaifk, jenispegawai: dataCachePegawai.jenispegawai };
                            $scope.item.petugasdiklat = { id: dataCachePegawai.idpetugasdiklat, petugasdiklat: dataCachePegawai.petugasdiklat };
                            if (dataCachePegawai.nilaijabatan)
                                $scope.item.nilaiJabatan = parseFloat(dataCachePegawai.nilaijabatan);
                            // End Data Status Kepegawaian

                            // Data Keluarga
                            dataKeluarga = dataCacheKeluarga;
                            for (var i = 0; i < dataKeluarga.length; i++) {
                                dataKeluarga[i].no = i + 1
                            }
                            $scope.gridKeluarga = new kendo.data.DataSource({
                                data: dataKeluarga
                            });
                            // End Data Keluarga

                            // Data Pendidikan
                            dataRiwayatPendidikan = dataCachePendidikan;
                            for (var i = 0; i < dataRiwayatPendidikan.length; i++) {
                                dataRiwayatPendidikan[i].no = i + 1
                            }
                            $scope.gridRiwayatPendidikan = new kendo.data.DataSource({
                                data: dataRiwayatPendidikan
                            })
                            // End Data Pendidikan   

                            // Data Riwayat Jabatan
                            dataRiwayatJabatan = dataCacheJabatan;
                            for (var i = 0; i < dataRiwayatJabatan.length; i++) {
                                dataRiwayatJabatan[i].no = i + 1;
                            }
                            $scope.gridRiwayatJabatan = new kendo.data.DataSource({
                                data: dataRiwayatJabatan
                            })

                            dataSip = dataCacheSip;
                            for (var i = 0; i < dataSip.length; i++) {
                                dataSip[i].no = i + 1;
                            }
                            $scope.gridSip = new kendo.data.DataSource({
                                data: dataSip
                            })

                            dataStr = dataCacheStr;
                            for (var i = 0; i < dataStr.length; i++) {
                                dataStr[i].no = i + 1;
                            }
                            $scope.gridStr = new kendo.data.DataSource({
                                data: dataStr
                            })

                            // Data Pelatihan
                            dataRiwayatPelatihan = dataCachePelatihan;
                            for (var i = 0; i < dataRiwayatPelatihan.length; i++) {
                                dataRiwayatPelatihan[i].no = i + 1
                            }
                            $scope.gridRiwayatPelatihan = new kendo.data.DataSource({
                                data: dataRiwayatPelatihan
                            })
                            // End Data Pendidikan  

                            // Data Phone
                            dataNoTelp = dataCacheTelp;
                            if (dataNoTelp.length > 1) {
                                $scope.item.nomor1 = dataNoTelp[0].nomor;
                                $scope.item.norecTelp1 = dataNoTelp[0].norec;
                                $scope.item.provider1 = { id: dataNoTelp[0].providerfk, namaprovider: dataNoTelp[0].namaprovider };
                                $scope.item.nomor2 = dataNoTelp[1].nomor;
                                $scope.item.norecTelp2 = dataNoTelp[1].norec;
                                $scope.item.provider2 = { id: dataNoTelp[1].providerfk, namaprovider: dataNoTelp[1].namaprovider };
                            } else if (dataNoTelp.length == 1) {
                                $scope.item.nomor1 = dataNoTelp[0].nomor;
                                $scope.item.norecTelp1 = dataNoTelp[0].norec;
                                $scope.item.provider1 = { id: dataNoTelp[0].providerfk, namaprovider: dataNoTelp[0].namaprovider };
                            }

                            // End Phone

                            medifirstService.get('sdm/get-login-user?idPegawai=' + $scope.item.idPegawai).then(function (dat) {
                                debugger
                                tampungruanganlogin = dat.data
                            })


                            // End Data Riwayat Jabatan

                            // Data Login User
                            ClearDataUserLogin()
                            // End Data Login User

                            $scope.isRouteLoading = false;
                        });
                        $scope.loadDataSip();
                        $scope.loadDataStr();
                        $scope.loadDataSeminar();
                        $scope.loadDataSpkk();
                        $scope.loadDataDikJur();
                        $scope.loadDataTandaJasa();
                        $scope.loadDataKecakapanBahasa();
                        $scope.loadDataOrganisasiProfesi();
                    }
                } else {
                    $scope.isRouteLoading = false;
                    $scope.ShowLogin = true;
                }

                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran foto tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase64(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase64(file) {
                    debugger

                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        //    tes.push(reader)
                        if (pdf.length > 0) {
                            pdf.splice(pdf, 1)
                        }
                        console.log(reader.result);
                        pdf.push(reader.result);
                    };
                    reader.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker2').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase642(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker2').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase642(file) {
                    debugger

                    var reader2 = new FileReader();
                    reader2.readAsDataURL(file);
                    reader2.onload = function () {
                        //    tes.push(reader)
                        if (pdf2.length > 0) {
                            pdf2.splice(pdf2, 1)
                        }
                        console.log(reader2.result);
                        pdf2.push(reader2.result);
                    };
                    reader2.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker3').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase643(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker3').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase643(file) {
                    debugger

                    var reader3 = new FileReader();
                    reader3.readAsDataURL(file);
                    reader3.onload = function () {
                        //    tes.push(reader)
                        if (pdf3.length > 0) {
                            pdf3.splice(pdf3, 1)
                        }
                        console.log(reader3.result);
                        pdf3.push(reader3.result);
                    };
                    reader3.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker4').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase644(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker4').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase644(file) {
                    debugger

                    var reader4 = new FileReader();
                    reader4.readAsDataURL(file);
                    reader4.onload = function () {
                        //    tes.push(reader)
                        if (pdf4.length > 0) {
                            pdf4.splice(pdf4, 1)
                        }
                        console.log(reader4.result);
                        pdf4.push(reader4.result);
                    };
                    reader4.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker5').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase645(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker5').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase645(file) {
                    debugger

                    var reader5 = new FileReader();
                    reader5.readAsDataURL(file);
                    reader5.onload = function () {
                        //    tes.push(reader)
                        if (pdf5.length > 0) {
                            pdf5.splice(pdf5, 1)
                        }
                        console.log(reader5.result);
                        pdf5.push(reader5.result);
                    };
                    reader5.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker6').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase646(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker6').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase646(file) {
                    debugger

                    var reader6 = new FileReader();
                    reader6.readAsDataURL(file);
                    reader6.onload = function () {
                        //    tes.push(reader)
                        if (pdf6.length > 0) {
                            pdf6.splice(pdf6, 1)
                        }
                        console.log(reader6.result);
                        pdf6.push(reader6.result);
                    };
                    reader6.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker7').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase647(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker7').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase647(file) {
                    debugger

                    var reader7 = new FileReader();
                    reader7.readAsDataURL(file);
                    reader7.onload = function () {
                        //    tes.push(reader)
                        if (pdf7.length > 0) {
                            pdf7.splice(pdf7, 1)
                        }
                        console.log(reader7.result);
                        pdf7.push(reader7.result);
                        namafilepdf7 = file.name
                    };
                    reader7.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker8').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase648(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker8').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase648(file) {
                    debugger

                    var reader8 = new FileReader();
                    reader8.readAsDataURL(file);
                    reader8.onload = function () {
                        //    tes.push(reader)
                        if (pdf8.length > 0) {
                            pdf8.splice(pdf8, 1)
                        }
                        console.log(reader8.result);
                        pdf8.push(reader8.result);
                    };
                    reader8.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker9').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase649(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker9').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase649(file) {
                    debugger

                    var reader9 = new FileReader();
                    reader9.readAsDataURL(file);
                    reader9.onload = function () {
                        //    tes.push(reader)
                        if (pdf9.length > 0) {
                            pdf9.splice(pdf9, 1)
                        }
                        console.log(reader9.result);
                        pdf9.push(reader9.result);
                    };
                    reader9.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker10').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6410(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker10').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6410(file) {
                    debugger

                    var reader10 = new FileReader();
                    reader10.readAsDataURL(file);
                    reader10.onload = function () {
                        //    tes.push(reader)
                        if (pdf10.length > 0) {
                            pdf10.splice(pdf10, 1)
                        }
                        console.log(reader10.result);
                        pdf10.push(reader10.result);
                    };
                    reader10.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker11').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 2097152) {
                            alert('Ukuran foto tidak boleh lebih dari 2 MB !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6411(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker11').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6411(file) {
                    debugger

                    var reader11 = new FileReader();
                    reader11.readAsDataURL(file);
                    reader11.onload = function () {
                        //    tes.push(reader)
                        if (fotoprofile.length > 0) {
                            fotoprofile.splice(fotoprofile, 1)
                        }
                        console.log(reader11.result);
                        fotoprofile.push(reader11.result);
                    };
                    reader11.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker12').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6412(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker12').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6412(file) {
                    debugger

                    var reader12 = new FileReader();
                    reader12.readAsDataURL(file);
                    reader12.onload = function () {
                        //    tes.push(reader)
                        if (pdf11.length > 0) {
                            pdf11.splice(pdf11, 1)
                        }
                        console.log(reader12.result);
                        pdf11.push(reader12.result);
                    };
                    reader12.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker13').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6413(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker13').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6413(file) {
                    debugger

                    var reader13 = new FileReader();
                    reader13.readAsDataURL(file);
                    reader13.onload = function () {
                        //    tes.push(reader)
                        if (pdf12.length > 0) {
                            pdf12.splice(pdf12, 1)
                        }
                        console.log(reader13.result);
                        pdf12.push(reader13.result);
                    };
                    reader13.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker14').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6414(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker14').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6414(file) {
                    debugger

                    var reader14 = new FileReader();
                    reader14.readAsDataURL(file);
                    reader14.onload = function () {
                        //    tes.push(reader)
                        if (pdf13.length > 0) {
                            pdf13.splice(pdf13, 1)
                        }
                        console.log(reader14.result);
                        pdf13.push(reader14.result);
                    };
                    reader14.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker15').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6415(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker15').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6415(file) {
                    debugger

                    var reader15 = new FileReader();
                    reader15.readAsDataURL(file);
                    reader15.onload = function () {
                        //    tes.push(reader)
                        if (pdf14.length > 0) {
                            pdf14.splice(pdf14, 1)
                        }
                        console.log(reader15.result);
                        pdf14.push(reader15.result);
                    };
                    reader15.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker16').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6416(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker16').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6416(file) {
                    debugger

                    var reader16 = new FileReader();
                    reader16.readAsDataURL(file);
                    reader16.onload = function () {
                        //    tes.push(reader)
                        if (pdf15.length > 0) {
                            pdf15.splice(pdf15, 1)
                        }
                        console.log(reader16.result);
                        pdf15.push(reader16.result);
                    };
                    reader16.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
                var handleFileSelect = function (file) {
                    var files = document.getElementById('filePicker17').files;
                    debugger
                    for (var i = 0; i < files.length; i++) {
                        //cek filenya
                        debugger
                        if (files[i].size > 1048576) {
                            alert('Ukuran file tidak boleh lebih dari 1 MB !')
                            return
                        }
                        if (files[i].type != "application/pdf") {
                            alert('Tipe file wajib PDF !')
                            return
                        }
                    }
                    if (files.length > 0) {
                        for (var i = 0; i < files.length; i++) {
                            getBase6417(files[i]);
                        }
                    }
                };

                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    document.getElementById('filePicker17').addEventListener('change', handleFileSelect, false);
                } else {
                    alert('The File APIs are not fully supported in this browser.');
                }
                function getBase6417(file) {
                    debugger

                    var reader17 = new FileReader();
                    reader17.readAsDataURL(file);
                    reader17.onload = function () {
                        //    tes.push(reader)
                        if (pdf16.length > 0) {
                            pdf16.splice(pdf16, 1)
                        }
                        console.log(reader17.result);
                        pdf16.push(reader17.result);
                    };
                    reader17.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                }
            }

            medifirstService.get("tatarekening/get-data-master").then(function (e) {
                debugger;
                // var idlogin = e.data.datalogin.userData.id
                var idKelompok = e.data.kelompokuser[0].id
                if (idKelompok != 48) {
                    $scope.salary = true
                    $scope.namabank = true
                    $scope.namarekening = true
                    $scope.norekening = true
                    $scope.valuenorekening = false
                }
            });


            $scope.ubah = function () {
                if ($scope.itemJabatan.jenisJabatan != undefined || $scope.itemJabatan.jenisJabatan != "") {
                    $scope.ListJabatan = $scope.itemJabatan.jenisJabatan.jabatan;
                }
            }
            $scope.$watch('itemSip.unitKerja', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.ListSubUnitKerja = newValue.subunit;
                }
            });
            $scope.$watch('itemStr.unitKerja', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.ListSubUnitKerja = newValue.subunit;
                }
            });
            $scope.$watch('item.tglLahir', function (value) {
                debugger
                $scope.item.tglPensiun = moment($scope.item.tglLahir).add(58, 'years').format('YYYY-MM-DD HH:mm');
                $scope.item.pensiun = moment($scope.item.tglPensiun).format('YYYY') - moment($scope.item.tglLahir).format('YYYY')
            })

            $scope.getGradeJbtn = function (e) {
                // if (!e.id) return;
                // $scope.item.grade = e.grade;
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatTahun = function (tanggal) {
                return moment(tanggal).format('YYYY');
            }

            $scope.opsiGridKeluarga = {
                toolbar: [

                    {
                        name: "create",
                        text: "Buat Data Keluarga",
                        template: '<button ng-click="createNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Keluarga</button>'
                    }
                ],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "5%"
                },
                {
                    "field": "namalengkap",
                    "title": "Nama",
                    "width": "20%"
                },
                {
                    "field": "hubungankeluarga",
                    "title": "Hubungan Keluarga",
                    "width": "20%"
                },
                {
                    "field": "statustanggungan",
                    "title": "Tertanggung",
                    "width": "20%"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "20%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                {
                    "field": "pendidikan",
                    "title": "Pendidikan Terakhir",
                    "width": "20%"
                },
                {
                    "field": "pekerjaan",
                    "title": "Pekerjaan",
                    "width": "20%"
                },
                {
                    "command": [
                        { text: "Edit", click: Edit, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: Hapus, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat Kartu Keluarga", click: LihatKartuKeluarga, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat KTP", click: LihatKTP, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }

            $scope.opsiGridRiwayatPendidikan = {
                toolbar: [{
                    name: "create",
                    text: "Buat Riwayat Pendidikan",
                    template: '<button ng-click="createPendNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Pendidikan</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "5%"
                },
                {
                    "field": "pendidikan",
                    "title": "Pendidikan",
                    "width": "20%"
                },
                {
                    "field": "namatempatpendidikan",
                    "title": "Institusi Pendidikan",
                    "width": "20%"
                },
                {
                    "field": "alamattempatpendidikan",
                    "title": "Alamat",
                    "width": "20%"
                },
                {
                    "field": "tglmasuk",
                    "title": "Tahun Masuk",
                    "width": "20%",
                    "template": "<span class='style-left'>{{formatTahun('#: tglmasuk #')}}</span>"
                },
                {
                    "field": "tgllulus",
                    "title": "Tahun Lulus",
                    "width": "27%",
                    "template": "<span class='style-left'>{{formatTahun('#: tgllulus #')}}</span>"
                },
                {
                    "command": [
                        { text: "Edit", click: EditPendidikan, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusPendidikan, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat Ijazah", click: LihatIjazahPendidikan, imageClass: "k-icon k-i-read" },
                        { text: "Lihat Surat Dikti", click: LihatDiktiPendidikan, imageClass: "k-icon k-i-read" },
                        { text: "Lihat Surat Akreditasi", click: LihatAkreditasiPendidikan, imageClass: "k-icon k-i-read" },
                    ],
                    title: "",
                    width: "685px",
                }
                ]
            }

            $scope.opsiGridRiwayatPelatihan = {
                toolbar: [{
                    name: "create",
                    text: "Buat Riwayat Pelatihan",
                    template: '<button ng-click="createPelatihanNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Pelatihan</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "7%"
                },
                {
                    "field": "instansipenyelenggara",
                    "title": "Penyelenggara",
                    "width": "25%"
                },
                {
                    "field": "lokasipelatihan",
                    "title": "Lokasi",
                    "width": "18%"
                },
                {
                    "field": "namapelatihan",
                    "title": "Nama Pelatihan",
                    "width": "35%"
                },
                {
                    "field": "tglmulai",
                    "title": "Tgl Mulai",
                    "width": "15%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglmulai #')}}</span>"
                },
                {
                    "field": "tglakhir",
                    "title": "Tgl Selesai",
                    "width": "15%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglakhir #')}}</span>"
                },
                {
                    "field": "durasi",
                    "title": "Durasi(jam)",
                    "width": "15%"
                },
                {
                    "field": "nosertifikat",
                    "title": "No Sertifikat",
                    "width": "20%"
                },
                {
                    "field": "keterangan",
                    "title": "Ket",
                    "width": "20%"
                },
                {
                    "command": [
                        { text: "Edit", click: EditPelatihan, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusPelatihan, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat Sertifikat", click: LihatSertifikatPelatihan, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }

            $scope.opsiGridRiwayatJabatan = {
                toolbar: [{
                    name: "create",
                    text: "Buat Riwayat Jabatan",
                    template: '<button ng-click="createJabatanNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Jabatan</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "5%"
                },
                {
                    "field": "nosk",
                    "title": "No SK",
                    "width": "20%"
                },
                {
                    "field": "tglsk",
                    "title": "Tanggal SK",
                    "width": "20%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglsk #')}}</span>"
                },
                {
                    "field": "jenisjabatan",
                    "title": "Jenis Jabatan",
                    "width": "20%"
                },
                {
                    "field": "namajabatan",
                    "title": "Jabatan",
                    "width": "20%"
                },
                {
                    "field": "pegawaipenanggungjawab",
                    "title": "Penanda Tangan SK",
                    "width": "20%"
                },
                {
                    "command": [
                        { text: "Edit", click: EditJabatan, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusJabatan, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat Sprint", click: LihatSprint, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }

            $scope.opsiGridSip = {
                toolbar: [{
                    name: "create",
                    text: "Buat SIP",
                    template: '<button ng-click="createSip()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat SIP</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "5%"
                },
                //             {
                //                 "field": "namaLengkap",
                //                 "title": "Nama",
                //                 "width": "20%"
                //             },	                
                // {
                //     "field": "unitkerja",
                //     "title": "Unit Kerja",
                //     "width": "20%",

                // },
                // {
                // 	"field": "subunit",
                //     "title": "Sub-Unit Kerja",
                //     "width": "20%"
                // },
                {
                    "field": "nosip",
                    "title": "Nomor SIP",
                    "width": "20%"
                },
                {
                    "field": "berakhirsip",
                    "title": "Tanggal Berakhir",
                    "width": "20%",
                    "template": "<span class='style-left'>{{formatTanggal('#: berakhirsip #')}}</span>"
                },
                {
                    "field": "namafilesip",
                    "title": "File SIP",
                    "width": "30%"
                },
                {
                    "command": [
                        // { text: "Edit", click: EditSip, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusSipNew, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat", click: downloadSipStr, imageClass: "k-icon k-delete" }
                    ],
                    title: "",
                    width: "22%",
                }
                ]
            }

            $scope.opsiGridStr = {
                toolbar: [{
                    name: "create",
                    text: "Buat STR",
                    template: '<button ng-click="createStr()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat STR</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "5%"
                },
                //             {
                //                 "field": "namaLengkap",
                //                 "title": "Nama",
                //                 "width": "20%"
                //             },	                
                // {
                //     "field": "unitkerja",
                //     "title": "Unit Kerja",
                //     "width": "20%",
                // },
                // {
                // 	"field": "subunit",
                //     "title": "Sub-Unit Kerja",
                //     "width": "20%"
                // },
                {
                    "field": "nostr",
                    "title": "Nomor STR",
                    "width": "20%"
                },
                {
                    "field": "berakhirstr",
                    "title": "Tanggal Berakhir",
                    "width": "20%",
                    "template": "<span class='style-left'>{{formatTanggal('#: berakhirstr #')}}</span>"
                },
                {
                    "field": "namafilestr",
                    "title": "File STR",
                    "width": "30%"
                },
                {
                    "command": [
                        // { text: "Edit", click: EditStr, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusStrNew, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat", click: downloadSipStr2, imageClass: "k-icon k-delete" }
                    ],
                    title: "",
                    width: "22%",
                }
                ]
            }
            $scope.opsiGridSpkk = {
                toolbar: [{
                    name: "create",
                    text: "Buat STR",
                    template: '<button ng-click="createSpkk()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat SPKK</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "5%"
                },
                //             {
                //                 "field": "namaLengkap",
                //                 "title": "Nama",
                //                 "width": "20%"
                //             },	                
                // {
                //     "field": "unitkerja",
                //     "title": "Unit Kerja",
                //     "width": "20%",
                // },
                // {
                // 	"field": "subunit",
                //     "title": "Sub-Unit Kerja",
                //     "width": "20%"
                // },
                {
                    "field": "nospkk",
                    "title": "Nomor SPKK",
                    "width": "20%"
                },
                {
                    "field": "tglberlaku",
                    "title": "Tanggal Berlaku",
                    "width": "20%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglberlaku #')}}</span>"
                }, {
                    "field": "tglberakhir",
                    "title": "Tanggal Berakhir",
                    "width": "20%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglberakhir #')}}</span>"
                },
                {
                    "field": "levelspkk",
                    "title": "Level SPKK",
                    "width": "30%"
                },
                {
                    "command": [
                        { text: "Hapus", click: HapusSpkkNew, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat", click: lihatSpkk, imageClass: "k-icon k-delete" }
                    ],
                    title: "",
                    width: "22%",
                }
                ]
            }
            $scope.opsiGridRiwayatSeminar = {
                toolbar: [{
                    name: "create",
                    text: "Buat Riwayat Seminar",
                    template: '<button ng-click="createSeminar()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Seminar</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "7%"
                },
                {
                    "field": "namapenyelenggara",
                    "title": "Penyelenggara",
                    "width": "25%"
                },
                {
                    "field": "lokasi",
                    "title": "Lokasi",
                    "width": "18%"
                },
                {
                    "field": "namaseminar",
                    "title": "Nama Pelatihan",
                    "width": "35%"
                },
                {
                    "field": "tglmulai",
                    "title": "Tgl Mulai",
                    "width": "15%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglmulai #')}}</span>"
                },
                {
                    "field": "tglselesai",
                    "title": "Tgl Selesai",
                    "width": "15%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglselesai #')}}</span>"
                },
                {
                    "field": "durasi",
                    "title": "Durasi(jam)",
                    "width": "15%"
                },
                {
                    "field": "nosertifikat",
                    "title": "No Sertifikat",
                    "width": "20%"
                },
                {
                    "field": "keterangan",
                    "title": "Ket",
                    "width": "20%"
                },
                {
                    "command": [
                        // { text: "Edit", click: EditPelatihan, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusSeminar, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat Sertifikat", click: LihatSertifikatSeminar, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }


            $scope.$watch('item.gelarDepan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.gelarDepan) {
                        if ($scope.item.gelarDepan && $scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama + ', ' + $scope.item.gelarBelakang;
                        } else if ($scope.item.gelarDepan && !$scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama;
                        } else if (!$scope.item.gelarDepan && $scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.nama + ', ' + $scope.item.gelarBelakang;
                        } else {
                            $scope.item.namaLengkap = $scope.item.nama;
                        }
                    }
                }
            });

            $scope.$watch('item.nama', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.nama) {
                        var user = $scope.item.nama.replace(" ", ".")
                        $scope.itemLogin.namaUser = user.toLowerCase();
                        if ($scope.item.gelarDepan && $scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama + ', ' + $scope.item.gelarBelakang;
                        } else if ($scope.item.gelarDepan && !$scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama;
                        } else if (!$scope.item.gelarDepan && $scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.nama + ', ' + $scope.item.gelarBelakang;
                        } else {
                            $scope.item.namaLengkap = $scope.item.nama;
                        }
                    }
                }
            });

            $scope.$watch('item.gelarBelakang', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.gelarBelakang) {
                        if ($scope.item.gelarDepan && $scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama + ', ' + $scope.item.gelarBelakang;
                        } else if ($scope.item.gelarDepan && !$scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama;
                        } else if (!$scope.item.gelarDepan && $scope.item.gelarBelakang) {
                            $scope.item.namaLengkap = $scope.item.nama + ', ' + $scope.item.gelarBelakang;
                        } else {
                            $scope.item.namaLengkap = $scope.item.nama;
                        }
                    }
                }
            });

            function Edit(e) {

                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                $scope.item.id = dataItem.id;
                $scope.item.no = dataItem.no;
                $scope.itemKeluarga.namaAnggotaKeluarga = dataItem.namalengkap;
                $scope.itemKeluarga.hubunganKeluarga = { id: dataItem.objectkdhubunganfk, hubungankeluarga: dataItem.hubungankeluarga };
                $scope.itemKeluarga.tglLahir = moment(dataItem.tgllahir).format('YYYY-MM-DD');
                $scope.itemKeluarga.jenisKelaminKl = { id: dataItem.objectjeniskelaminfk, jeniskelamin: dataItem.jeniskelamin };
                $scope.itemKeluarga.namaAyah = dataItem.namaayah;
                $scope.itemKeluarga.namaIbu = dataItem.namaibu;
                $scope.itemKeluarga.statusPerkawinanPegawaiKL = { id: dataItem.objectstatusperkawinanpegawaifk, statusperkawinan: dataItem.statusperkawinan };
                $scope.itemKeluarga.PekerjaanKL = { id: dataItem.objectpekerjaanfk, pekerjaan: dataItem.pekerjaan };
                $scope.itemKeluarga.nipIstriSuami = dataItem.nipistrisuami;
                $scope.itemKeluarga.statusTanggungan = { id: dataItem.statustanggunganfk, reportdisplay: dataItem.statustanggungan };
                $scope.itemKeluarga.noSuratKuliah = dataItem.noSuratKuliah;
                $scope.itemKeluarga.tglsuratKuliah = moment(dataItem.tglsuratkuliah).format('YYYY-MM-DD');
                $scope.itemKeluarga.alamat = dataItem.alamat;
                $scope.itemKeluarga.keterangan = dataItem.keterangan;
                $scope.itemKeluarga.pendidikan = { id: dataItem.objectpendidikanterakhirfk, pendidikan: dataItem.pendidikan };
                if (dataItem.kartukeluarga != null) {
                    pdf3.push(dataItem.kartukeluarga)
                }
                if (dataItem.ktp != null) {
                    pdf4.push(dataItem.ktp)
                }
                $scope.popUpDataKeluarga.center().open();
            }

            function Hapus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataKeluarga.length - 1; i >= 0; i--) {
                    if (dataKeluarga[i].no == dataItem.no) {
                        dataKeluarga.splice(i, 1);
                    }
                }
                var itemDelete = {
                    "id": dataItem.id
                }

                medifirstService.post('sdm/delete-data-keluarga-pegawai', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }
            function LihatKartuKeluarga(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.kartukeluarga == null) {
                    toastr.error("Kartu Keluarga Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.kartukeluarga + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            function LihatKTP(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.ktp == null) {
                    toastr.error("Kartu Keluarga Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.ktp + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }

            function EditPendidikan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                $scope.item.norecPend = dataItem.norec;
                $scope.item.nomor = dataItem.no;
                $scope.itemPendidikan.pendidikan = { id: dataItem.objectpendidikanfk, pendidikan: dataItem.pendidikan };
                $scope.itemPendidikan.NamaInstitusi = dataItem.namatempatpendidikan;
                $scope.itemPendidikan.alamat = dataItem.alamattempatpendidikan;
                $scope.itemPendidikan.jurusan = dataItem.jurusan;
                $scope.itemPendidikan.tglMasukPend = moment(dataItem.tglmasuk).format('YYYY-MM-DD');;
                $scope.itemPendidikan.tglLulus = moment(dataItem.tgllulus).format('YYYY-MM-DD');;
                $scope.itemPendidikan.ipk = parseFloat(dataItem.nilaiipk);
                $scope.itemPendidikan.noIjasah = dataItem.noijazah;
                $scope.itemPendidikan.tglIjasah = moment(dataItem.tglijazah).format('YYYY-MM-DD');
                $scope.itemPendidikan.akreditasi = dataItem.akreditasikampus;
                debugger
                if (dataItem.ijazah != null) {
                    pdf.push(dataItem.ijazah)
                } else {
                    pdf = []
                }
                if (dataItem.suratdikti != null) {
                    pdf2.push(dataItem.suratdikti)
                } else {
                    pdf2 = []
                }
                if (dataItem.akreditasi != null) {
                    pdf13.push(dataItem.akreditasi)
                } else {
                    pdf13 = []
                }
                $scope.popUpRiwayatPendidikan.center().open();

            }

            function HapusPendidikan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataRiwayatPendidikan.length - 1; i >= 0; i--) {
                    if (dataRiwayatPendidikan[i].no == dataItem.no) {
                        dataRiwayatPendidikan.splice(i, 1);
                    }
                }
                grid.removeRow(row);
            }
            function LihatIjazahPendidikan(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.ijazah == null) {
                    toastr.error("Ijazah Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.ijazah + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            function LihatDiktiPendidikan(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.suratdikti == null) {
                    toastr.error("Surat Dikti Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.suratdikti + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            function LihatAkreditasiPendidikan(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.akreditasi == null) {
                    toastr.error("Surat Akreditasi Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.akreditasi + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }

            function EditPelatihan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                $scope.item.norecPel = dataItem.norec;
                $scope.item.nomor = dataItem.no;
                // $scope.itemPelatihan.jenisPelatihan={id:dataItem.objectpelatihanfk,jenispelatihan:dataItem.jenispelatihan};
                $scope.itemPelatihan.namaInstitusi = dataItem.instansipenyelenggara;
                $scope.itemPelatihan.lokasi = dataItem.lokasipelatihan;
                $scope.itemPelatihan.namaPelatihan = dataItem.namapelatihan;
                $scope.itemPelatihan.tglMulaiPel = moment(dataItem.tglmulai).format('YYYY-MM-DD');;
                $scope.itemPelatihan.tglSelesaiPel = moment(dataItem.tglakhir).format('YYYY-MM-DD');;
                $scope.itemPelatihan.durasi = parseInt(dataItem.durasi);
                $scope.itemPelatihan.noSertifikat = dataItem.nosertifikat;
                $scope.itemPelatihan.keterangan = dataItem.keterangan;
                $scope.popUpRiwayatPelatihan.center().open();
                if (dataItem.sertifikat != null) {
                    pdf5.push(dataItem.sertifikat)
                }

            }
            function LihatSertifikatPelatihan(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.sertifikat == null) {
                    toastr.error("Sertifikat Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.sertifikat + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            function LihatSertifikatSeminar(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.sertifikat == null) {
                    toastr.error("Sertifikat Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.sertifikat + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }

            function HapusPelatihan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataRiwayatPelatihan.length - 1; i >= 0; i--) {
                    if (dataRiwayatPelatihan[i].no == dataItem.no) {
                        dataRiwayatPelatihan.splice(i, 1);
                    }
                }

                var itemDelete = {
                    "norec": dataItem.norec
                }

                medifirstService.post('sdm/delete-data-pelatihan', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }
            function HapusSeminar(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                }

                medifirstService.post('sdm/pelatihan/delete-data-seminar', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataSeminar();
                    }
                })
            }

            function EditJabatan(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                $scope.item.norecJab = dataItem.norec;
                $scope.item.nomorId = dataItem.no;
                $scope.itemJabatan.jenisJabatan = { id: dataItem.objectjenisjabatanfk, jenisjabatan: dataItem.jenisjabatan };
                $scope.itemJabatan.jabatan = { id: dataItem.objectjabatanfk, namajabatan: dataItem.namajabatan };
                $scope.itemJabatan.noSK = dataItem.nosk;
                $scope.itemJabatan.tglSK = moment(dataItem.tglsk).format('YYYY-MM-DD HH:mm');
                $scope.itemJabatan.ttdSK = { id: dataItem.objectpegawaittdfk, namalengkap: dataItem.pegawaittd };
                $scope.itemJabatan.jabatanTtd = { id: dataItem.objectjabatanttdfk, namajabatan: dataItem.namajabatanttd };
                if (dataItem.sprint != null) {
                    pdf6.push(dataItem.sprint)
                }
                $scope.popUpRiwayatJabatan.center().open();
            }

            function HapusJabatan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataRiwayatJabatan.length - 1; i >= 0; i--) {
                    if (dataRiwayatJabatan[i].no == dataItem.no) {
                        dataRiwayatJabatan.splice(i, 1);
                    }
                }
                grid.removeRow(row);
            }
            function LihatSprint(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.sprint == null) {
                    toastr.error("Sprint Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.sprint + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }

            function EditSip(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                $scope.item.norecSip = dataItem.norec;
                $scope.item.noIdSip = dataItem.no;
                var unitKerja = []
                for (var i = 0; i < $scope.ListUnitKerja.length; i++) {
                    if ($scope.ListUnitKerja[i].id == dataItem.unitkerjafk) {
                        unitKerja = $scope.ListUnitKerja[i]
                        break
                    }

                }
                $scope.itemSip.unitKerja = unitKerja //{id:dataItem.unitkerjafk,name:dataItem.unitkerja};
                $scope.itemSip.subUnitKerja = { id: dataItem.subunitkerjafk, name: dataItem.subunit };
                $scope.itemSip.noSip = dataItem.nomor;
                $scope.itemSip.tglSipAkhir = moment(dataItem.tglberakhir).format('YYYY-MM-DD HH:mm');
                $scope.popUpSip.center().open();
            }

            function HapusSip(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataSip.length - 1; i >= 0; i--) {
                    if (dataSip[i].no == dataItem.no) {
                        dataSip.splice(i, 1);
                    }
                }

                var itemDelete = {
                    "norec": dataItem.norec
                }

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }

            function EditStr(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var unitKerja = []
                for (var i = 0; i < $scope.ListUnitKerja.length; i++) {
                    if ($scope.ListUnitKerja[i].id == dataItem.unitkerjafk) {
                        unitKerja = $scope.ListUnitKerja[i]
                        break
                    }
                }
                $scope.item.norecStr = dataItem.norec;
                $scope.item.noIdStr = dataItem.no;
                $scope.itemStr.unitKerja = unitKerja //{id:dataItem.unitkerjafk,name:dataItem.unitkerja};
                $scope.itemStr.subUnitKerja = { id: dataItem.subunitkerjafk, name: dataItem.subunit };
                $scope.itemStr.noStr = dataItem.nomor;
                $scope.itemStr.tglStrAkhir = moment(dataItem.tglberakhir).format('YYYY-MM-DD HH:mm');
                $scope.popUpStr.center().open();
            }

            function HapusStr(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataStr.length - 1; i >= 0; i--) {
                    if (dataStr[i].no == dataItem.no) {
                        dataStr.splice(i, 1);
                    }
                }

                var itemDelete = {
                    "norec": dataItem.norec
                }

                // managePhp.postData2('sdm-pegawai/delete-data-sipstr', itemDelete).then(function (e) {
                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }

            $scope.createPendNew = function () {
                $scope.item.norecPend = "";
                $scope.item.nomor = undefined;
                $scope.popUpRiwayatPendidikan.center().open();
                var actions = $scope.popUpRiwayatPendidikan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatPendidikan.setOptions({ actions: actions });
            }

            $scope.createPelatihanNew = function () {
                $scope.item.norecPel = "";
                $scope.item.nomor = undefined;
                $scope.popUpRiwayatPelatihan.center().open();
                var actions = $scope.popUpRiwayatPelatihan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatPelatihan.setOptions({ actions: actions });
            }

            $scope.createNew = function () {
                $scope.item.id = "";
                $scope.item.no = undefined;
                $scope.popUpDataKeluarga.center().open();
                var actions = $scope.popUpDataKeluarga.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpDataKeluarga.setOptions({ actions: actions });
            }

            $scope.createJabatanNew = function () {
                $scope.item.norecJab = "";
                $scope.item.nomorId = undefined;
                $scope.popUpRiwayatJabatan.center().open();
                var actions = $scope.popUpRiwayatJabatan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatJabatan.setOptions({ actions: actions });
            }

            $scope.createSip = function () {
                $scope.item.norecSip = "";
                $scope.item.nomorId = undefined;
                $scope.popUpSip.center().open();
                var actions = $scope.popUpSip.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpSip.setOptions({ actions: actions });
            }

            $scope.createStr = function () {
                $scope.item.norecStr = "";
                $scope.item.nomorId = undefined;
                $scope.popUpStr.center().open();
                var actions = $scope.popUpStr.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpStr.setOptions({ actions: actions });
            }
            $scope.createSpkk = function () {
                $scope.item.norecSpkk = "";
                $scope.item.nomorId = undefined;
                $scope.popUpSpkk.center().open();
                var actions = $scope.popUpSpkk.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpSpkk.setOptions({ actions: actions });
            }
            $scope.createSeminar = function () {
                $scope.item.norecSeminar = "";
                $scope.item.nomorId = undefined;
                $scope.popUpRiwayatSeminar.center().open();
                var actions = $scope.popUpRiwayatSeminar.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpSpkk.setOptions({ actions: actions });

            }

            $scope.batalDataKeluarga = function () {
                ClearDataKeluarga();
                $scope.popUpDataKeluarga.close();
            }

            $scope.batalRiwayatPendidikan = function () {
                ClearDataRiwayatPendidikan();
                $scope.popUpRiwayatPendidikan.close();
            }

            $scope.batalRiwayatPelatihan = function () {
                ClearDataRiwayatPelatihan();
                $scope.popUpRiwayatPelatihan.close();
            }

            $scope.batalRiwayatJabatan = function () {
                ClearDataRiwayatJabatan();
                $scope.popUpRiwayatJabatan.close();
            }

            $scope.batalSip = function () {
                ClearDataSip();
                document.getElementById("coba").reset();
                $scope.popUpSip.close();
            }

            $scope.batalStr = function () {
                ClearDataStr();
                document.getElementById("coba2").reset();
                $scope.popUpStr.close();
            }
            $scope.batalSpkk = function () {
                ClearDataSpkk();
                document.getElementById("coba2").reset();
                $scope.popUpSpkk.close();
            }
            $scope.batalRiwayatSeminar = function () {
                ClearDataSeminar();
                document.getElementById("coba2").reset();
                $scope.popUpRiwayatSeminar.close();
            }

            $scope.batalRiwayatDikJur = function () {
                ClearDataDikjur();
                document.getElementById("coba2").reset();
                $scope.popUpRiwayatDikJur.close();
            }
            $scope.batalTandaJasa = function () {
                ClearDataTandaJasa();
                document.getElementById("coba2").reset();
                $scope.popUpTandaJasa.close();
            }
            $scope.batalKecakapanBahasa = function () {
                ClearDataKecakapanBahasa();
                document.getElementById("coba2").reset();
                $scope.popUpKecakapanBahasa.close();
            }
            $scope.batalOrganisasiProfesi = function () {
                ClearDataOrganisasiProfesi();
                document.getElementById("coba2").reset();
                $scope.popUpOrganisasiProfesi.close();
            }

            $scope.tambahDataKeluarga = function () {
                var listRawRequired = [
                    "itemKeluarga.namaAnggotaKeluarga|ng-model|Nama Anggota Keluarga",
                    "itemKeluarga.hubunganKeluarga|ng-model|Hubungan Keluarga",
                    "itemKeluarga.tglLahir|k-ng-model|Tgl Lahir Anggota Keluarga",
                    "itemKeluarga.jenisKelaminKl|k-ng-model|Jenis Kelamin Anggota Keluarga",
                    // "itemKeluarga.namaAyah|ng-model|Nama Ayah",
                    // "itemKeluarga.namaIbu|ng-model|Nama Ibu",
                    //"itemKeluarga.statusPerkawinanPegawaiKL|k-ng-model|Status Perkawinan Anggota Keluarga",
                    "itemKeluarga.PekerjaanKL|k-ng-model|Pekerjaan Anggota Keluarga",
                    //"itemKeluarga.nipIstriSuami|ng-model|Nip Istri / Suami",
                    //"itemKeluarga.statusTanggungan|k-ng-model|Status Tanggungan",
                    //"itemKeluarga.alamat|ng-model|Alamat Anggota Keluarga",
                    //"itemKeluarga.pendidikan|k-ng-model|Pendidikan Terkahir"
                ];

                var noSuratKuliah = "-";
                if ($scope.itemKeluarga.noSuratKuliah != undefined) {
                    noSuratKuliah = $scope.itemKeluarga.noSuratKuliah
                }

                var tglsuratKuliah = null
                if ($scope.itemKeluarga.tglsuratKuliah != undefined) {
                    tglsuratKuliah = $scope.itemKeluarga.tglsuratKuliah;
                }
                if ($scope.itemKeluarga.tglsuratKuliah == "Invalid date") {
                    tglsuratKuliah = null
                }

                var keterangan = "-"
                if ($scope.itemKeluarga.keterangan != undefined) {
                    keterangan = $scope.itemKeluarga.keterangan;
                }

                var nipsuamiistri = "-"
                if ($scope.itemKeluarga.nipIstriSuami != undefined) {
                    nipsuamiistri = $scope.itemKeluarga.nipIstriSuami;
                }

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var nomor = 0
                    if ($scope.gridKeluarga == undefined) {
                        nomor = 1
                    } else {
                        nomor = dataKeluarga.length + 1
                    }
                    var data = {};
                    if ($scope.item.no != undefined) {
                        for (var i = dataKeluarga.length - 1; i >= 0; i--) {
                            if (dataKeluarga[i].no == $scope.item.no) {
                                data.no = $scope.item.no
                                data.namalengkap = $scope.itemKeluarga.namaAnggotaKeluarga
                                data.objectkdhubunganfk = $scope.itemKeluarga.hubunganKeluarga.id
                                data.hubungankeluarga = $scope.itemKeluarga.hubunganKeluarga.hubungankeluarga
                                data.tgllahir = moment($scope.itemKeluarga.tglLahir).format('YYYY-MM-DD HH:mm')
                                data.objectjeniskelaminfk = $scope.itemKeluarga.jenisKelaminKl.id
                                data.jeniskelamin = $scope.itemKeluarga.jenisKelaminKl.jeniskelamin
                                data.namaayah = $scope.itemKeluarga.namaAyah != undefined ? $scope.itemKeluarga.namaAyah : null
                                data.namaibu = $scope.itemKeluarga.namaIbu != undefined ? $scope.itemKeluarga.namaIbu : null
                                data.objectstatusperkawinanpegawaifk = $scope.itemKeluarga.statusPerkawinanPegawaiKL != undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.id : null
                                data.statusperkawinan = $scope.itemKeluarga.statusPerkawinanPegawaiKL != undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.statusperkawinan : null
                                data.pekerjaan = $scope.itemKeluarga.PekerjaanKL.pekerjaan
                                data.objectpekerjaanfk = $scope.itemKeluarga.PekerjaanKL.id
                                data.nipistrisuami = nipsuamiistri
                                data.statustanggungan = $scope.itemKeluarga.statusTanggungan != undefined ? $scope.itemKeluarga.statusTanggungan.reportdisplay : null
                                data.statustanggunganfk = $scope.itemKeluarga.statusTanggungan != undefined ? $scope.itemKeluarga.statusTanggungan.id : null
                                data.nosuratkuliah = noSuratKuliah
                                data.tglsuratkuliah = tglsuratKuliah
                                data.keterangan = keterangan
                                data.alamat = $scope.itemKeluarga.alamat != undefined ? $scope.itemKeluarga.alamat : null
                                data.id = $scope.item.id
                                data.objectpendidikanterakhirfk = $scope.itemKeluarga.pendidikan != undefined ? $scope.itemKeluarga.pendidikan.id : null
                                data.pendidikan = $scope.itemKeluarga.pendidikan != undefined ? $scope.itemKeluarga.pendidikan.pendidikan : null
                                data.kartukeluarga = pdf3[0]
                                data.ktp = pdf4[0]

                                dataKeluarga[i] = data;
                                $scope.gridKeluarga = new kendo.data.DataSource({
                                    data: dataKeluarga
                                });
                            }
                        }

                    } else {
                        debugger
                        data = {
                            no: nomor,
                            namalengkap: $scope.itemKeluarga.namaAnggotaKeluarga,
                            objectkdhubunganfk: $scope.itemKeluarga.hubunganKeluarga != undefined ? $scope.itemKeluarga.hubunganKeluarga.id : null,
                            hubungankeluarga: $scope.itemKeluarga.hubunganKeluarga != undefined ? $scope.itemKeluarga.hubunganKeluarga.hubungankeluarga : null,
                            tgllahir: moment($scope.itemKeluarga.tglLahir).format('YYYY-MM-DD HH:mm'),
                            objectjeniskelaminfk: $scope.itemKeluarga.jenisKelaminKl.id,
                            jeniskelamin: $scope.itemKeluarga.jenisKelaminKl.jeniskelamin,
                            namaayah: $scope.itemKeluarga.namaAyah != undefined ? $scope.itemKeluarga.namaAyah : null,
                            namaibu: $scope.itemKeluarga.namaIbu != undefined ? $scope.itemKeluarga.namaIbu : null,
                            objectstatusperkawinanpegawaifk: $scope.itemKeluarga.statusPerkawinanPegawaiKL != undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.id : null,
                            statusperkawinan: $scope.itemKeluarga.statusPerkawinanPegawaiKL != undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.id : null,
                            pekerjaan: $scope.itemKeluarga.PekerjaanKL.pekerjaan,
                            objectpekerjaanfk: $scope.itemKeluarga.PekerjaanKL.id,
                            nipistrisuami: nipsuamiistri,
                            statustanggungan: $scope.itemKeluarga.statusTanggungan != undefined ? $scope.itemKeluarga.statusTanggungan.reportdisplay : null,
                            statustanggunganfk: $scope.itemKeluarga.statusTanggungan != undefined ? $scope.itemKeluarga.statusTanggungan.id : null,
                            nosuratkuliah: noSuratKuliah,
                            tglsuratkuliah: tglsuratKuliah,
                            keterangan: keterangan,
                            id: $scope.item.id,
                            alamat: $scope.itemKeluarga.alamat != undefined ? $scope.itemKeluarga.alamat : null,
                            objectpendidikanterakhirfk: $scope.itemKeluarga.pendidikan != undefined ? $scope.itemKeluarga.pendidikan.id : null,
                            pendidikan: $scope.itemKeluarga.pendidikan != undefined ? $scope.itemKeluarga.pendidikan.pendidikan : null,
                            kartukeluarga: pdf3[0],
                            ktp: pdf4[0]

                        }

                        dataKeluarga.push(data)

                        $scope.gridKeluarga = new kendo.data.DataSource({
                            data: dataKeluarga
                        });
                    }
                    ClearDataKeluarga();
                    $scope.popUpDataKeluarga.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.tambahRiwayatPendidikan = function () {
                debugger
                if (pdf[0] == undefined) {
                    toastr.error('Ijazah Wajib di Upload !')
                    return
                }
                var listRawRequired = [
                    "itemPendidikan.pendidikan|k-ng-model|Pendidikan",
                    "itemPendidikan.NamaInstitusi|ng-model|Nama Institusi",
                    "itemPendidikan.alamat|ng-model|Alamat Institusi",
                    // "itemPendidikan.tglLulus|k-ng-model|Tgl Lulus",
                    // "itemPendidikan.ipk|ng-model|IPK Kelulusan",                                                      
                ];

                var jurusan = "-";
                if ($scope.itemPendidikan.jurusan != undefined) {
                    jurusan = $scope.itemPendidikan.jurusan
                }

                var noIjasah = "-";
                if ($scope.itemPendidikan.noIjasah != undefined) {
                    noIjasah = $scope.itemPendidikan.noIjasah;
                }

                var tglIjasah = null;
                if ($scope.itemPendidikan.tglIjasah != undefined) {
                    tglIjasah = moment($scope.itemPendidikan.tglIjasah).format('YYYY-MM-DD HH:mm');
                }
                if ($scope.itemPendidikan.tglIjasah == "Invalid date") {
                    tglIjasah = null;
                }

                var tglMasuk = null;
                if ($scope.itemPendidikan.tglMasukPend != undefined) {
                    tglMasuk = moment($scope.itemPendidikan.tglMasukPend).format('YYYY-MM-DD HH:mm');
                }
                if ($scope.itemPendidikan.tglMasukPend == "Invalid date") {
                    tglMasuk = null;
                }

                var tglLulus = null;
                if ($scope.itemPendidikan.tglLulus != undefined) {
                    tglLulus = moment($scope.itemPendidikan.tglLulus).format('YYYY-MM-DD HH:mm');
                }
                if ($scope.itemPendidikan.tglLulus == "Invalid date") {
                    tglLulus = null;
                }

                var ipk = 0;
                if ($scope.itemPendidikan.ipk != undefined) {
                    ipk = $scope.itemPendidikan.ipk;
                }
                var akreditasikampus = "-"
                if ($scope.itemPendidikan.akreditasi != undefined) {
                    akreditasikampus = $scope.itemPendidikan.akreditasi;
                }

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var nomor = 0
                    if ($scope.gridRiwayatPendidikan == undefined) {
                        nomor = 1
                    } else {
                        nomor = dataRiwayatPendidikan.length + 1
                    }
                    var data = {};
                    if ($scope.item.nomor != undefined) {
                        for (var i = dataRiwayatPendidikan.length - 1; i >= 0; i--) {
                            if (dataRiwayatPendidikan[i].no == $scope.item.nomor) {
                                data.no = $scope.item.nomor
                                data.objectpendidikanfk = $scope.itemPendidikan.pendidikan.id
                                data.pendidikan = $scope.itemPendidikan.pendidikan.pendidikan
                                data.namatempatpendidikan = $scope.itemPendidikan.NamaInstitusi
                                data.alamattempatpendidikan = $scope.itemPendidikan.alamat
                                // data.tglmasuk = $scope.itemPendidikan.tglMasukPend != undefined || $scope.itemPendidikan.tglMasukPend != "Invalid date" ? moment($scope.itemPendidikan.tglMasukPend).format('YYYY-MM-DD HH:mm') : null,
                                //     data.tgllulus = $scope.itemPendidikan.tglLulus != undefined || $scope.itemPendidikan.tglLulus != "Invalid date" ? moment($scope.itemPendidikan.tglLulus).format('YYYY-MM-DD HH:mm') : null,
                                data.tglmasuk = tglMasuk
                                data.tgllulus = tglLulus
                                data.nilaiipk = ipk
                                data.jurusan = jurusan
                                data.noijazah = noIjasah
                                data.tglijazah = tglIjasah
                                data.norec = $scope.item.norecPend
                                data.akreditasikampus = akreditasikampus
                                data.ijazah = pdf[0]
                                data.suratdikti = pdf2[0]
                                data.akreditasi = pdf13[0]

                                dataRiwayatPendidikan[i] = data;
                                $scope.gridRiwayatPendidikan = new kendo.data.DataSource({
                                    data: dataRiwayatPendidikan
                                });
                            }
                        }

                    } else {

                        data = {
                            no: nomor,
                            objectpendidikanfk: $scope.itemPendidikan.pendidikan.id,
                            pendidikan: $scope.itemPendidikan.pendidikan.pendidikan,
                            namatempatpendidikan: $scope.itemPendidikan.NamaInstitusi,
                            alamattempatpendidikan: $scope.itemPendidikan.alamat,
                            tglmasuk: $scope.itemPendidikan.tglMasukPend != undefined ? moment($scope.itemPendidikan.tglMasukPend).format('YYYY-MM-DD HH:mm') : null,
                            tgllulus: $scope.itemPendidikan.tglLulus != undefined ? moment($scope.itemPendidikan.tglLulus).format('YYYY-MM-DD HH:mm') : null,
                            nilaiipk: ipk,
                            jurusan: jurusan,
                            noijazah: noIjasah,
                            tglijazah: tglIjasah,
                            norec: $scope.item.norecPend,
                            akreditasikampus: akreditasikampus,
                            ijazah: pdf[0],
                            suratdikti: pdf2[0],
                            akreditasi: pdf13[0]
                        }

                        dataRiwayatPendidikan.push(data)
                        $scope.gridRiwayatPendidikan = new kendo.data.DataSource({
                            data: dataRiwayatPendidikan
                        });
                    }
                    ClearDataRiwayatPendidikan();
                    $scope.popUpRiwayatPendidikan.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.tambahRiwayatPelatihan = function () {
                var listRawRequired = [
                    "itemPelatihan.namaInstitusi|ng-model|Nama Penyelenggara",
                    "itemPelatihan.namaPelatihan|k-ng-model|Nama Pelatihan",
                    "itemPelatihan.lokasi|ng-model|Lokasi Pelatihan",
                    "itemPelatihan.tglMulaiPel|k-ng-model|Tgl Masuk",
                    "itemPelatihan.tglSelesaiPel|k-ng-model|Tgl Lulus",
                ];


                var noSertifikat = "-";
                if ($scope.itemPelatihan.noSertifikat != undefined) {
                    noSertifikat = $scope.itemPelatihan.noSertifikat;
                }

                var keterangan = "-";
                if ($scope.itemPelatihan.keterangan != undefined) {
                    keterangan = $scope.itemPelatihan.keterangan;
                }

                var skp = "-";
                if ($scope.itemPelatihan.skp != undefined) {
                    skp = $scope.itemPelatihan.skp;
                }

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var nomor = 0
                    if ($scope.gridRiwayatPelatihan == undefined) {
                        nomor = 1
                    } else {
                        nomor = dataRiwayatPelatihan.length + 1
                    }
                    var data = {};
                    if ($scope.item.nomor != undefined) {
                        for (var i = dataRiwayatPelatihan.length - 1; i >= 0; i--) {
                            if (dataRiwayatPelatihan[i].no == $scope.item.nomor) {
                                data.no = $scope.item.nomor
                                data.instansipenyelenggara = $scope.itemPelatihan.namaInstitusi
                                data.namapelatihan = $scope.itemPelatihan.namaPelatihan
                                data.lokasipelatihan = $scope.itemPelatihan.lokasi
                                data.tglmulai = moment($scope.itemPelatihan.tglMulaiPel).format('YYYY-MM-DD HH:mm')
                                data.tglakhir = moment($scope.itemPelatihan.tglSelesaiPel).format('YYYY-MM-DD HH:mm')
                                data.durasi = $scope.itemPelatihan.durasi
                                data.nosertifikat = noSertifikat
                                data.keterangan = keterangan
                                data.norec = $scope.item.norecPel
                                data.sertifikat = pdf5[0]
                                data.skp = skp

                                dataRiwayatPelatihan[i] = data;
                                $scope.gridRiwayatPelatihan = new kendo.data.DataSource({
                                    data: dataRiwayatPelatihan
                                });
                            }
                        }

                    } else {

                        data = {
                            no: nomor,
                            instansipenyelenggara: $scope.itemPelatihan.namaInstitusi,
                            namapelatihan: $scope.itemPelatihan.namaPelatihan,
                            lokasipelatihan: $scope.itemPelatihan.lokasi,
                            tglmulai: moment($scope.itemPelatihan.tglMulaiPel).format('YYYY-MM-DD HH:mm'),
                            tglakhir: moment($scope.itemPelatihan.tglSelesaiPel).format('YYYY-MM-DD HH:mm'),
                            durasi: $scope.itemPelatihan.durasi,
                            nosertifikat: noSertifikat,
                            keterangan: keterangan,
                            sertifikat: pdf5[0],
                            norec: $scope.item.norecPel,
                            skp: skp
                        }

                        dataRiwayatPelatihan.push(data)
                        $scope.gridRiwayatPelatihan = new kendo.data.DataSource({
                            data: dataRiwayatPelatihan
                        });
                    }
                    ClearDataRiwayatPelatihan();
                    $scope.popUpRiwayatPelatihan.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.tambahRiwayatJabatan = function () {
                debugger
                var listRawRequired = [
                    "itemJabatan.jenisJabatan|k-ng-model|Jenis Jabatan",
                    "itemJabatan.jabatan|k-ng-model|Nama Jabatan",
                    "itemJabatan.noSK|ng-model|Nomor SK",
                    "itemJabatan.tglSK|k-ng-model|Tgl SK",
                    // "itemJabatan.ttdSK|k-ng-model|Penandatangan SK",
                    // "itemJabatan.jabatanTtd|k-ng-model|Penandatangan Jabatan",
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var nomorId = 0
                    if ($scope.dataRiwayatJabatan == undefined) {
                        nomorId = 1
                    } else {
                        nomorId = dataRiwayatJabatan.length + 1
                    }
                    var data = {};
                    if ($scope.item.nomorId != undefined) {
                        for (var i = dataRiwayatJabatan.length - 1; i >= 0; i--) {
                            if (dataRiwayatJabatan[i].no == $scope.item.nomorId) {

                                data.no = $scope.item.nomorId
                                data.objectjenisjabatanfk = $scope.itemJabatan.jenisJabatan.id
                                data.jenisjabatan = $scope.itemJabatan.jenisJabatan.jenisjabatan
                                data.objectjabatanfk = $scope.itemJabatan.jabatan.id
                                data.namajabatan = $scope.itemJabatan.jabatan.namajabatan
                                data.nosk = $scope.itemJabatan.noSK
                                data.tglsk = moment($scope.itemJabatan.tglSK).format('YYYY-MM-DD HH:mm')
                                data.objectpegawaittdfk = $scope.itemJabatan.ttdSK != undefined ? $scope.itemJabatan.ttdSK.id : null
                                data.pegawaittd = $scope.itemJabatan.ttdSK != undefined ? $scope.itemJabatan.ttdSK.namalengkap : null
                                data.objectjabatanttdfk = $scope.itemJabatan.jabatanTtd != undefined ? $scope.itemJabatan.jabatanTtd.id : null
                                data.namajabatanttd = $scope.itemJabatan.jabatanTtd != undefined ? $scope.itemJabatan.jabatanTtd.namajabatan : null
                                data.pegawaipenanggungjawab = $scope.itemJabatan.ttdSK != undefined ? $scope.itemJabatan.ttdSK.namalengkap + " / " + $scope.itemJabatan.jabatanTtd.namajabatan : null
                                data.sprint = pdf6[0]
                                data.norec = $scope.item.norecJab

                                dataRiwayatJabatan[i] = data;
                                $scope.gridRiwayatJabatan = new kendo.data.DataSource({
                                    data: dataRiwayatJabatan
                                });
                            }
                        }

                    } else {

                        data = {
                            no: nomorId,
                            objectjenisjabatanfk: $scope.itemJabatan.jenisJabatan.id,
                            jenisjabatan: $scope.itemJabatan.jenisJabatan.jenisjabatan,
                            objectjabatanfk: $scope.itemJabatan.jabatan.id,
                            namajabatan: $scope.itemJabatan.jabatan.namajabatan,
                            nosk: $scope.itemJabatan.noSK,
                            tglsk: moment($scope.itemJabatan.tglSK).format('YYYY-MM-DD HH:mm'),
                            // objectpegawaittdfk: $scope.itemJabatan.ttdSK.id,
                            // pegawaittd: $scope.itemJabatan.ttdSK.namalengkap,
                            // objectjabatanttdfk: $scope.itemJabatan.jabatanTtd.id,
                            // namajabatanttd: $scope.itemJabatan.jabatanTtd.namajabatan,
                            objectpegawaittdfk: $scope.itemJabatan.ttdSK != undefined ? $scope.itemJabatan.ttdSK.id : null,
                            pegawaittd: $scope.itemJabatan.ttdSK != undefined ? $scope.itemJabatan.ttdSK.namalengkap : null,
                            objectjabatanttdfk: $scope.itemJabatan.jabatanTtd != undefined ? $scope.itemJabatan.jabatanTtd.id : null,
                            namajabatanttd: $scope.itemJabatan.jabatanTtd != undefined ? $scope.itemJabatan.jabatanTtd.namajabatan : null,
                            pegawaipenanggungjawab: $scope.itemJabatan.ttdSK != undefined ? $scope.itemJabatan.ttdSK.namalengkap + " / " + $scope.itemJabatan.jabatanTtd.namajabatan : null,
                            sprint: pdf6[0],
                            norec: $scope.item.norecJab
                        }

                        dataRiwayatJabatan.push(data)
                        $scope.gridRiwayatJabatan = new kendo.data.DataSource({
                            data: dataRiwayatJabatan
                        });
                    }
                    ClearDataRiwayatJabatan();
                    $scope.popUpRiwayatJabatan.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.tambahSip = function () {
                var listRawRequired = [
                    // "itemSip.unitKerja|k-ng-model|Unit Kerja",
                    // "itemSip.subUnitKerja|k-ng-model|Sub Unit Kerja",
                    "itemSip.noSip|ng-model|Nomor SIP",
                    "itemSip.tglSipAkhir|k-ng-model|Tanggal Berakhir",
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var noIdSip = 0
                    if ($scope.gridSip == undefined) {
                        noIdSip = 1
                    } else {
                        noIdSip = dataSip.length + 1
                    }
                    var data = {};
                    if ($scope.item.noIdSip != undefined) {
                        for (var i = gridSip.length - 1; i >= 0; i--) {
                            if (gridSip[i].no == $scope.item.noIdSip) {

                                data.no = $scope.item.noIdSip
                                data.unitkerjafk = $scope.itemSip.unitKerja.id
                                data.unitkerja = $scope.itemSip.unitKerja.name
                                data.subunitkerjafk = $scope.itemSip.subUnitKerja.subunit.id
                                data.subunit = $scope.itemSip.subUnitKerja.subunit.name
                                data.nomor = $scope.itemSip.noSip
                                data.tglberakhir = moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD HH:mm')
                                data.norec = $scope.item.norecSip
                                data.filesip = pdf7[0]
                                jenismasaberlakufk = 1

                                dataSip[i] = data;
                                $scope.gridSip = new kendo.data.DataSource({
                                    data: dataSip
                                });
                            }
                        }

                    } else {

                        data = {
                            no: noIdSip,
                            unitkerjafk: $scope.itemSip.unitKerja.id,
                            unitkerja: $scope.itemSip.unitKerja.name,
                            subunitkerjafk: $scope.itemSip.subUnitKerja.id,
                            subunit: $scope.itemSip.subUnitKerja.name,
                            nomor: $scope.itemSip.noSip,
                            tglberakhir: moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD HH:mm'),
                            norec: $scope.item.norecSip,
                            filesip: pdf7[0],
                            jenismasaberlakufk: 1,
                        }

                        dataSip.push(data)
                        $scope.gridSip = new kendo.data.DataSource({
                            data: dataSip
                        });
                    }
                    ClearDataSip();
                    $scope.popUpSip.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.tambahStr = function () {
                var listRawRequired = [
                    // "itemStr.unitKerja|k-ng-model|Unit Kerja",
                    // "itemStr.subUnitKerja|k-ng-model|Sub Unit Kerja",
                    "itemStr.noStr|ng-model|Nomor SIP",
                    "itemStr.tglStrAkhir|k-ng-model|Tanggal Berakhir",
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var noIdStr = 0
                    if ($scope.gridStr == undefined) {
                        noIdStr = 1
                    } else {
                        noIdStr = dataStr.length + 1
                    }
                    var data = {};
                    if ($scope.item.noIdStr != undefined) {
                        for (var i = gridStr.length - 1; i >= 0; i--) {
                            if (gridStr[i].no == $scope.item.noIdStr) {

                                data.no = $scope.item.noIdStr
                                data.unitkerjafk = $scope.itemStr.unitKerja.id
                                data.unitkerja = $scope.itemStr.unitKerja.name
                                data.subunitkerjafk = $scope.itemStr.subUnitKerja.subunit.id
                                data.subunit = $scope.itemStr.subUnitKerja.subunit.name
                                data.nomor = $scope.itemStr.noStr
                                data.tglberakhir = moment($scope.itemStr.tglStrAkhir).format('YYYY-MM-DD HH:mm')
                                data.norec = $scope.item.norecStr

                                dataStr[i] = data;
                                $scope.gridStr = new kendo.data.DataSource({
                                    data: dataStr
                                });
                            }
                        }

                    } else {

                        data = {
                            no: noIdStr,
                            unitkerjafk: $scope.itemStr.unitKerja.id,
                            unitkerja: $scope.itemStr.unitKerja.name,
                            subunitkerjafk: $scope.itemStr.subUnitKerja.id,
                            subunit: $scope.itemStr.subUnitKerja.name,
                            nomor: $scope.itemStr.noStr,
                            tglberakhir: moment($scope.itemStr.tglStrAkhir).format('YYYY-MM-DD HH:mm'),
                            norec: $scope.item.norecStr,
                        }

                        dataStr.push(data)
                        $scope.gridStr = new kendo.data.DataSource({
                            data: dataStr
                        });
                    }
                    ClearDataStr();
                    $scope.popUpStr.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }


            $scope.simpan = function () {
                //
                debugger
                if (jenisCache == 'EditPegawai') {
                    if ($scope.item.JenisPegawai.id == 1 || $scope.item.JenisPegawai.id == 2) {
                        if (tampungruanganlogin.length > 0) {
                            for (var i = 0; i < tampungruanganlogin.length; i++) {
                                if (tampungruanganlogin[i].objectruanganfk == 757 || tampungruanganlogin[i].objectruanganfk == 744 || tampungruanganlogin[i].objectruanganfk == 742 || tampungruanganlogin[i].objectruanganfk == 722) {
                                    if (str.length == 0) {
                                        toastr.error('STR Wajib Diinput !')
                                        return
                                    }
                                    if (sip.length == 0) {
                                        toastr.error('SIP Wajib Diinput !')
                                        return
                                    }
                                } else {

                                }
                            }
                        } else {

                        }
                    }
                }
                // if (jenisCache == 'EditPegawai') {
                //     if($scope.item.JenisPegawai.id == 1 || $scope.item.JenisPegawai.id == 2) {
                // if (str.length == 0) {
                //     toastr.error('STR Wajib Diinput !')
                //     return
                // }
                // if (sip.length == 0) {
                //     toastr.error('SIP Wajib Diinput !')
                //     return
                // }
                //     }
                // }
                var listRawRequired = [

                    // Data Pegawai
                    "item.nama|ng-model|Nama Pegawai",
                    "item.tempatLahir|ng-model|Tempat Lahir",
                    // "item.tglLahir|k-ng-model|Tgl Lahir Pegawai",
                    "item.jenisKelamin|k-ng-model|Jenis Kelamin Pegawai",
                    "item.pendidikan|k-ng-model|Pendidikan Terakhir",
                    "item.statusPerkawinanPegawai|k-ng-model|Status Perkawinan",
                    "item.agama|k-ng-model|Agama",
                    // Data Pegawai

                    // Data Rekening Bank
                    // "item.bankRekeningNomor|ng-model|Nomor Rekening Pegawai",
                    // "item.bankRekeningAtasNama|ng-model|Nama Pemilik Rekening",
                    // "item.bankRekeningNama|ng-model|Nama Bank Rekening",
                    // Data Rekening Bank

                    // Data Alamat
                    // "item.alamat|ng-model|Alamat Pegawai",
                    // "item.kodePos|ng-model|Kode Pos",
                    // Data Alamat

                    // Data Phone
                    // "item.nomor1|ng-model|Nomor Telpon 1",
                    // "item.provider1|k-ng-model|Provider Nomor Telpon 1",
                    // "item.nomor2|ng-model|Nomor Telpon 2",
                    // "item.provider2|k-ng-model|Provider Nomor Telpon 2",
                    // Data Phone

                    // Data Status Pegawai
                    // "item.tglMasuk|k-ng-model|Tgl Masuk Pegawai",
                    // "item.kategoryPegawai|k-ng-model|Status Pegawai",
                    // "item.kedudukan|k-ng-model|Kedudukan Pegawai",
                    // "item.golonganPegawai|k-ng-model|Golongan Pegawai",
                    // "item.jabatanFungsional|k-ng-model|Jabatan Pegawai",
                    // "item.detailKelompokJabatan|k-ng-model|Kelompok Jabatan Pegawai",
                    // "item.eselon|k-ng-model|Eselon Pegawai",
                    // "item.idFinger|ng-model|ID Finger Print",
                    // "item.shiftKerja|k-ng-model|Shift Pegawai",
                    "item.JenisPegawai|k-ng-model|Jenis Pegawai|"
                    // Data Status Pegawai

                    // Data Login Pegawai
                    // "itemLogin.kelompokUser|k-ng-model|Kelompok User",  
                    // Data Login Pegawai
                ];

                var id = "";
                if ($scope.item.idPegawai != undefined) {
                    id = $scope.item.idPegawai
                }

                var nipPns = "-";
                if ($scope.item.nipPns != undefined) {
                    nipPns = $scope.item.nipPns
                }

                var gelarDepan = "";
                if ($scope.item.gelarDepan != undefined) {
                    gelarDepan = $scope.item.gelarDepan;
                }

                var gelarBelakang = "";
                if ($scope.item.gelarBelakang != undefined) {
                    gelarBelakang = $scope.item.gelarBelakang;
                }

                var Npwp = "-";
                if ($scope.item.npwp != undefined) {
                    Npwp = $scope.item.npwp;
                }

                var tglKeluar = null;
                if ($scope.item.tglkeluar != undefined) {
                    tglKeluar = moment($scope.item.tglkeluar).format('YYYY-MM-DD HH:mm');
                }

                var tglPensiun = null;
                if ($scope.item.tglPensiun != undefined) {
                    tglPensiun = moment($scope.item.tglPensiun).format('YYYY-MM-DD HH:mm');
                }

                var NilaiJabatan = null
                if ($scope.item.nilaiJabatan != undefined) {
                    NilaiJabatan = $scope.item.nilaiJabatan
                }

                var Grade = null
                var grade = parseFloat(Grade);
                if ($scope.item.grade != undefined) {
                    Grade = parseFloat($scope.item.grade);
                }

                var bankRekeningNomor = "-"
                if ($scope.item.bankRekeningNomor != undefined) {
                    bankRekeningNomor = $scope.item.bankRekeningNomor
                }

                var NamaRekening = "-"
                if ($scope.item.bankRekeningAtasNama != undefined) {
                    NamaRekening = $scope.item.bankRekeningAtasNama
                }

                var NamaBank = "-"
                if ($scope.item.bankRekeningNama != undefined) {
                    NamaBank = $scope.item.bankRekeningNama
                }
                var Salary = null
                if ($scope.item.salary != undefined) {
                    Salary = $scope.item.salary
                }

                var pensiun = null;
                if ($scope.item.pensiun != undefined) {
                    var pensiun = $scope.item.pensiun
                }

                var tglMeninggal = null;
                if ($scope.item.tglMeninggal != undefined) {
                    tglMeninggal = moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm');
                }

                var idFinger = null;
                if ($scope.item.idFinger != undefined) {
                    idFinger = $scope.item.idFinger;
                }
                var petugasdiklat = "";
                if ($scope.item.petugasdiklat != undefined && $scope.item.petugasdiklat != "") {
                    if ($scope.item.petugasdiklat.id != undefined) {
                        petugasdiklat = $scope.item.petugasdiklat.id;
                    }

                }
                var Nrp = "-";
                if ($scope.item.nrp != undefined) {
                    Nrp = $scope.item.nrp;
                }
                var Nik = null;
                if ($scope.item.nik != undefined) {
                    Nik = $scope.item.nik;
                }
                var Nobpjs = null;
                if ($scope.item.nobpjs != undefined) {
                    Nobpjs = $scope.item.nobpjs;
                }
                var Nocm = null;
                if ($scope.item.nocm != undefined) {
                    Nocm = $scope.item.nocm;
                }

                var golonganpajakpegawai = "";
                if ($scope.item.gpp != undefined && $scope.item.gpp != "") {
                    if ($scope.item.gpp.id != undefined) {
                        golonganpajakpegawai = $scope.item.gpp.id;
                    }
                }
                var golongandarah = "";
                if ($scope.item.golongandarah != undefined && $scope.item.golongandarah != "") {
                    if ($scope.item.golongandarah.id != undefined) {
                        golongandarah = $scope.item.golongandarah.id
                    }
                }
                var email = null;
                if ($scope.item.email != undefined) {
                    email = $scope.item.email
                }

                var nokta = null;
                if ($scope.item.noKta != undefined) {
                    nokta = $scope.item.noKta
                }

                var kta = null;
                if (pdf15[0] != undefined) {
                    kta = pdf15[0]
                }

                var dl = "";
                if ($scope.item.dl != undefined && $scope.item.dl != "") {
                    // if ($scope.item.dl != undefined) {
                    //     golonganpajakpegawai = $scope.item.gpp.id;
                    // }
                    dl = "dl";
                }
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {

                    // if ($scope.item.idPegawai == "" && $scope.itemLogin.kelompokUser == undefined) {
                    // 	toastr.error('Kelompok User Tidak Boleh Kosong')
                    // 	return;
                    // }

                    dataPegawai = {
                        // Data Pegawai
                        id: id,
                        nippns: nipPns,
                        namalengkap: $scope.item.namaLengkap,
                        gelardepan: gelarDepan,
                        gelarbelakang: gelarBelakang,
                        nama: $scope.item.nama,
                        tempatlahir: $scope.item.tempatLahir,
                        tgllahir: $scope.item.tglLahir != undefined ? moment($scope.item.tglLahir).format('YYYY-MM-DD 00:00:00') : null,
                        jeniskelamin: $scope.item.jenisKelamin.id,
                        pendidikan: $scope.item.pendidikan.id,
                        statusperkawinan: $scope.item.statusPerkawinanPegawai.id,
                        npwp: Npwp,
                        agama: $scope.item.agama.id,
                        tglmeninggal: tglMeninggal,
                        unitkerjafk: $scope.item.unitKerja != undefined ? $scope.item.unitKerja.id : null,
                        pangkatpolisifk: $scope.item.pangkatpolisi != undefined ? $scope.item.pangkatpolisi.id : null,
                        nrp: Nrp,
                        gpp: golonganpajakpegawai,
                        nik: Nik,
                        nobpjs: Nobpjs,
                        nocm: Nocm,
                        golongandarah: $scope.item.golongandarah != undefined ? $scope.item.golongandarah.id : null,
                        email: email,
                        dl: dl,
                        //
                        foto: fotoprofile[0],
                        // Data Pegawai

                        // Data Rekening Bank
                        nomorrekening: bankRekeningNomor,
                        namarekening: NamaRekening,
                        namabank: NamaBank,
                        salary: Salary,
                        // Data Rekening Bank

                        // Data Alamat
                        alamat: $scope.item.alamat != undefined ? $scope.item.alamat : '-',
                        kodepos: $scope.item.kodePos,
                        poinjpt: $scope.item.poinjpt,
                        // Data Alamat



                        // Data Status Pegawai
                        tglmasuk: $scope.item.tglMasuk != undefined ? moment($scope.item.tglMasuk).format('YYYY-MM-DD 00:00:00') : null, //moment().format('YYYY-MM-DD 00:00'),
                        tglkeluar: tglKeluar,
                        pensiun: pensiun,
                        tglpensiun: tglPensiun,
                        statuspegawai: $scope.item.kategoryPegawai != undefined ? $scope.item.kategoryPegawai.id : null,
                        kedudukan: $scope.item.kedudukan != undefined ? $scope.item.kedudukan.id : null,
                        golongan: $scope.item.golonganPegawai != undefined ? $scope.item.golonganPegawai.id : null,
                        jabatan: $scope.item.jabatanFungsional != undefined ? $scope.item.jabatanFungsional.id : null,
                        kelompokjabatan: $scope.item.detailKelompokJabatan != undefined ? $scope.item.detailKelompokJabatan.id : null,
                        eselon: $scope.item.eselon != undefined ? $scope.item.eselon.id : null,
                        idfinger: idFinger, //$scope.item.idFinger,
                        shiftkerja: $scope.item.shiftKerja != undefined ? $scope.item.shiftKerja.id : null,
                        nilaijabatan: NilaiJabatan,
                        grade: Grade,
                        jenispegawai: $scope.item.JenisPegawai.id,
                        petugasdiklat: petugasdiklat,
                        idruangan: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                        nokta: nokta,
                        kta: kta
                        // Data Status Pegawai
                    }

                    // var data ={};
                    // $scope.itemTelp.push($scope.item.provider1);
                    // $scope.itemTelp[0].nomor=$scope.item.nomor1;
                    // $scope.itemTelp.push($scope.item.provider2);
                    // $scope.itemTelp[1].nomor=$scope.item.nomor2;

                    if (fotoprofile.length == 0) {
                        dataPhoto.push({
                            id: id,
                            foto: 'null'
                        })
                    } else {
                        dataPhoto.push({
                            id: id,
                            foto: fotoprofile[0]
                        })
                    }

                    var dataTel1 = ''
                    if ($scope.item.nomor1 != undefined && $scope.item.provider1 != undefined && $scope.item.norecTelp1 != undefined && $scope.item.norecTelp1 != "") {
                        dataTel1 = {
                            'norec': $scope.item.norecTelp1,
                            'noTelp': $scope.item.nomor1 != undefined ? $scope.item.nomor1 : '',
                            'providerfk': null
                        }
                    } else {
                        dataTel1 = {
                            'norec': '',
                            'noTelp': $scope.item.nomor1 != undefined ? $scope.item.nomor1 : '',
                            'providerfk': null
                        }
                    };

                    var dataTel2 = ''
                    if ($scope.item.nomor2 != undefined && $scope.item.provider2 != undefined && $scope.item.norecTelp2 != undefined && $scope.item.norecTelp2 != "") {
                        dataTel2 = {
                            'norec': $scope.item.norecTelp2,
                            'noTelp': $scope.item.nomor2 != undefined ? $scope.item.nomor2 : '', //$scope.item.nomor2,
                            'providerfk': null //$scope.item.provider2.id
                        }
                    } else {
                        dataTel2 = {
                            'norec': '',
                            'noTelp': $scope.item.nomor2 != undefined ? $scope.item.nomor2 : '',
                            'providerfk': null
                        }
                    };

                    ClearDataTelp();
                    if (dataTel1 != '')
                        dataNoTelp.push(dataTel1)
                    if (dataTel2 != '')
                        dataNoTelp.push(dataTel2)

                    //      	for (var i = 0; i < $scope.itemTelp.length; i++) {
                    // 	data.nomor=$scope.itemTelp[i].nomor
                    // 	data.providerfk=$scope.itemTelp[i].id

                    // 	dataNoTelp[i]=data
                    // }

                    debugger
                    objSave = {
                        datapegawai: dataPegawai,
                        datakeluarga: dataKeluarga,
                        riwayatpendidikan: dataRiwayatPendidikan,
                        riwayatpelatihan: dataRiwayatPelatihan,
                        riwayatjabatan: dataRiwayatJabatan,
                        dataphoto: dataPhoto,
                        // simpansip:dataSip,
                        // simpanstr:dataStr,
                        simpantelp: dataNoTelp,
                    }

                    // if (dataKeluarga.length == 0 || dataRiwayatPendidikan.length == 0 || dataRiwayatJabatan.length == 0 || dataSip.length == 0 || dataStr.length == 0 || dataRiwayatPelatihan.length == 0 || dataNoTelp.length==0) {
                    if (dataKeluarga.length == 0 || dataRiwayatPendidikan.length == 0 || dataRiwayatJabatan.length == 0 || dataRiwayatPelatihan.length == 0 || dataNoTelp.length == 0) {
                        if (dataKeluarga.length == 0) {
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Data Keluarga Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                RealSave();
                            });
                        } else if (dataRiwayatPendidikan.length == 0) {
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Data Riwayat Pendidikan Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                RealSave();
                            });
                        } else if (dataRiwayatPelatihan.length == 0) {
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Data Riwayat Pelatihan Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                RealSave();
                            });
                        } else if (dataRiwayatJabatan.length == 0) {
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Data Riwayat Jabatan Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                RealSave();
                            });
                            //    }else if (dataSip.length ==0) {
                            //  			var confirm = $mdDialog.confirm()
                            //         .title('Peringatan')
                            //         .textContent('Data SIP Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
                            //         .ariaLabel('Lucky day')
                            //         .cancel('Tidak')
                            //         .ok('Ya')
                            //     $mdDialog.show(confirm).then(function () {
                            //         RealSave();
                            //     });	
                            // }else if (dataStr.length ==0) {
                            //  			var confirm = $mdDialog.confirm()
                            //         .title('Peringatan')
                            //         .textContent('Data STR Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
                            //         .ariaLabel('Lucky day')
                            //         .cancel('Tidak')
                            //         .ok('Ya')
                            //     $mdDialog.show(confirm).then(function () {
                            //         RealSave();
                            //     });	
                        } else if (dataNoTelp.length == 0) {
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Data No Telpon Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                RealSave();
                            });
                        }
                    } else {
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Apakah Anda Yakin Menyimpan Data?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            RealSave();
                        });
                    }
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.kembali = function () {
                $state.go('DataPegawai')
            }

            function saveLogin() {
                var waktuBerakhir = undefined;
                var idlogin = "";
                if ($scope.itemLogin.idlogin != undefined) {
                    idlogin = $scope.itemLogin.idlogin;
                }

                var objSaveLogin = {
                    'id': idlogin,
                    'katasandi': $scope.itemLogin.kataKunciPass,
                    'namauser': $scope.itemLogin.namaUser,
                    'objectkelompokuserfk': $scope.itemLogin.kelompokUser.id,
                    'objectpegawaifk': $scope.itemLogin.pegawaiId,
                    'waktuberakhir': waktuBerakhir
                }

                medifirstService.post('sysadmin/menu/save-new-user', objSaveLogin).then(function (e) {

                    ClearDataUserLogin();
                    LoadCache();
                    // FormLoad();

                }, function (error) {
                    toastr.error(JSON.stringify(error.message), 'Error')
                });
            }

            function RealSave() {
                medifirstService.post('sdm/save-rekam-data-pegawai', objSave).then(function (e) {
                    var dataHasilSave = e.data
                    if ($scope.item.idPegawai == undefined || $scope.item.idPegawai == "") {
                        $scope.itemLogin.pegawaiId = dataHasilSave.idpegawai;
                        // saveLogin();
                    }
                    ClearAll();
                    LoadCache();
                    // FormLoad();
                });
            }

            $scope.batal = function () {
                $scope.showEdit = false;
                $scope.item = {};
            }

            $scope.simpanSipNew = function () {
                // if ($scope.item.idPegawai == "" || $scope.item.idPegawai == undefined) {
                // 	toastr.error('Id Tidak Boleh Kosong')
                // 	return;
                // }
                if ($scope.itemSip.noSip == "" || $scope.itemSip.noSip == undefined) {
                    toastr.error('Nomor Sip Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemSip.tglSipAkhir == "" || $scope.itemSip.tglSipAkhir == undefined) {
                    toastr.error('Tanggal Berakhir SIP Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemSip.tglSipTerbit == "" || $scope.itemSip.tglSipTerbit == undefined) {
                    toastr.error('Tanggal Terbit SIP Tidak Boleh Kosong')
                    return;
                }

                var nR = ""
                if ($scope.itemSip.norec != undefined) {
                    nR = $scope.itemSip.norec
                }

                var tglSipAkhir = moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD 00:00')
                var tglSipTerbit = moment($scope.itemSip.tglSipTerbit).format('YYYY-MM-DD 00:00')
                debugger
                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    // "nomorSurat": $scope.itemSip.noSip,
                    "nomorsip": $scope.itemSip.noSip,
                    // "tglBerakhir": tglSipAkhir,
                    "terbitsip": tglSipTerbit,
                    "berakhirsip": tglSipAkhir,
                    "filesip2": pdf7[0],
                    "jenismasaberlakufk": 1,
                }

                const url = baseTransaksi + 'sdm/upload-data-sipstr'
                const formData = new FormData()
                const file = document.querySelector(".mySip").files[0]
                if (file == "" || file == undefined) {
                    toastr.error('Silahkan Upload File SIP')
                    return;
                }
                if (file.size > 3145728 || file.type != "application/pdf") {
                    toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                    return;
                }
                formData.append('filesip', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('nomorsip', objSave.nomorsip)
                formData.append('terbitsip', objSave.terbitsip)
                formData.append('berakhirsip', objSave.berakhirsip)
                formData.append('namafileupload', file.name)
                formData.append('jenismasaberlakufk', objSave.jenismasaberlakufk)
                formData.append('filesip2', objSave.filesip2)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan Sip berhasil");
                    $scope.loadDataSip();
                    $scope.batalSip();
                })

            }
            // $scope.simpanSipNew = function() {
            //     debugger
            //     if ($scope.itemSip.noSip == "" || $scope.itemSip.noSip == undefined) {
            //         toastr.error('Nomor Sip Tidak Boleh Kosong')
            //         return;
            //     }
            //     if ($scope.itemSip.tglSipAkhir == "" || $scope.itemSip.tglSipAkhir == undefined) {
            //         toastr.error('Tanggal Berakhir SIP Tidak Boleh Kosong')
            //         return;
            //     }
            //     if ($scope.itemSip.tglSipTerbit == "" || $scope.itemSip.tglSipTerbit == undefined) {
            //         toastr.error('Tanggal Terbit SIP Tidak Boleh Kosong')
            //         return;
            //     }
            //     var tglSipAkhir = moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD 00:00')
            //     var tglSipTerbit = moment($scope.itemSip.tglSipTerbit).format('YYYY-MM-DD 00:00')
            //     var objSave = {
            //         // "norec": nR,
            //         "idPegawai": $scope.item.idPegawai,
            //         // "nomorSurat": $scope.itemSip.noSip,
            //         "nomorsip": $scope.itemSip.noSip,
            //         // "tglBerakhir": tglSipAkhir,
            //         "terbitsip": tglSipTerbit,
            //         "berakhirsip": tglSipAkhir,
            //         "filesip": pdf7[0],
            //         "namafile": namafilepdf7,
            //         "jenismasaberlakufk": 1,
            //     }
            //     medifirstService.post('sdm/save-sip', objSave).then(function(e) {
            //         $scope.loadDataSip();
            //         $scope.popUpSip.close();
            //     })
            // }

            $scope.simpanStrNew = function () {
                // if ($scope.item.idPegawai == "" || $scope.item.idPegawai == undefined) {
                // 	toastr.error('Id Tidak Boleh Kosong')
                // 	return;
                // }
                if ($scope.itemStr.noStr == "" || $scope.itemStr.noStr == undefined) {
                    toastr.error('Nomor STR Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemStr.tglStrTerbit == "" || $scope.itemStr.tglStrTerbit == undefined) {
                    toastr.error('Tanggal Terbit STR Tidak Boleh Kosong')
                    return;
                }
                if ($scope.itemStr.tglStrAkhir == "" || $scope.itemStr.tglStrAkhir == undefined) {
                    toastr.error('Tanggal Berakhir STR Tidak Boleh Kosong')
                    return;
                }

                var nR = ""
                if ($scope.itemStr.norec != undefined) {
                    nR = $scope.itemStr.norec
                }

                var tglStrAkhir = moment($scope.itemStr.tglStrAkhir).format('YYYY-MM-DD 00:00')
                var tglStrTerbit = moment($scope.itemStr.tglStrTerbit).format('YYYY-MM-DD 00:00')

                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "nomorSurat": $scope.itemStr.noStr,
                    "tglBerakhir": tglStrAkhir,
                    "tglTerbit": tglStrTerbit,
                    "jenismasaberlakufk": 2,
                    "filestr2": pdf8[0]
                }

                const url = baseTransaksi + 'sdm/upload-data-sipstr'
                const formData = new FormData()
                const file = document.querySelector(".myStr").files[0]
                if (file == "" || file == undefined) {
                    toastr.error('Silahkan Upload File STR')
                    return;
                }
                if (file.size > 3145728 || file.type != "application/pdf") {
                    toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                    return;
                }
                formData.append('filestr', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('nomorstr', objSave.nomorSurat)
                formData.append('berakhirstr', objSave.tglBerakhir)
                formData.append('terbitstr', objSave.tglTerbit)
                formData.append('jenismasaberlakufk', objSave.jenismasaberlakufk)
                formData.append('filestr2', objSave.filestr2)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan Str berhasil");
                    $scope.loadDataStr();
                    $scope.batalStr();
                })

            }
            $scope.simpanSpkk = function () {
                debugger
                if ($scope.itemSpkk.noSpkk == "" || $scope.itemSpkk.noSpkk == undefined) {
                    toastr.error('Nomor SPKK boleh kosong !')
                    return
                }
                if ($scope.itemSpkk.tglSpkkBerlaku == "" || $scope.itemSpkk.tglSpkkBerlaku == undefined) {
                    toastr.error('Tanggal berlaku tidak boleh kosong !')
                    return
                }
                if ($scope.itemSpkk.tglSpkkBerakhir == "" || $scope.itemSpkk.tglSpkkBerakhir == undefined) {
                    toastr.error('Tanggal berakhir tidak boleh kosong !')
                    return
                }
                if ($scope.itemSpkk.levelSpkk == undefined) {
                    alert('Level SPKK tidak boleh kosong dan hanya boleh diisi diantara 0 sampai 5 !')
                    return
                }
                if ($scope.itemSpkk.levelSpkk > 5) {
                    alert('Level SPKK Hanya Boleh Diantara 0 Sampai 5 !')
                    return
                }
                var nR = "";
                if ($scope.itemSpkk.norec != undefined) {
                    nR = $scope.itemSpkk.norec
                }

                var tglSpkkBerlaku = moment($scope.itemSpkk.tglSpkkBerlaku).format('YYYY-MM-DD 00:00')
                var tglSpkkBerakhir = moment($scope.itemSpkk.tglSpkkBerakhir).format('YYYY-MM-DD 00:00')
                debugger
                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "nomorSurat": $scope.itemSpkk.noSpkk,
                    "tglBerakhir": tglSpkkBerakhir,
                    "tglBerlaku": tglSpkkBerlaku,
                    "levelspkk": $scope.itemSpkk.levelSpkk,
                    "filespkk2": pdf9[0]
                }
                const url = baseTransaksi + 'sdm/upload-data-spkk'
                const formData = new FormData()
                const file = document.querySelector(".mySpkk").files[0]
                if (file == "" || file == undefined) {
                    toastr.error('Silahkan Upload File STR')
                    return;
                }
                if (file.size > 3145728 || file.type != "application/pdf") {
                    toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                    return;
                }
                formData.append('filespkk', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('nomorSpkk', objSave.nomorSurat)
                formData.append('tglBerakhir', objSave.tglBerakhir)
                formData.append('tglBerlaku', objSave.tglBerlaku)
                formData.append('levelSpkk', objSave.levelspkk)
                formData.append('filespkk2', objSave.filespkk2)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan Spkk berhasil");
                    $scope.loadDataSpkk();
                    $scope.batalStr();
                })
            }
            $scope.simpanRiwayatSeminar = function () {
                debugger
                if ($scope.itemSeminar.namaInstitusi == "" || $scope.itemSeminar.namaInstitusi == undefined) {
                    toastr.error('Nama Penyelenggara Harus Diisi !')
                    return
                }
                if ($scope.itemSeminar.lokasi == "" || $scope.itemSeminar.lokasi == undefined) {
                    toastr.error('Lokasi Seminar Harus Diisi !')
                    return
                }
                if ($scope.itemSeminar.namaSeminar == "" || $scope.itemSeminar.namaSeminar == undefined) {
                    toastr.error('Nama Seminar Harus Diisi !')
                    return
                }
                if ($scope.itemSeminar.tglMulaiPel == "" || $scope.itemSeminar.tglMulaiPel == undefined) {
                    $scope.itemSeminar.tglMulaiPel = ""
                }
                if ($scope.itemSeminar.tglSelesaiPel == "" || $scope.itemSeminar.tglSelesaiPel == undefined) {
                    $scope.itemSeminar.tglSelesaiPel = ""
                }
                if ($scope.itemSeminar.durasi == "" || $scope.itemSeminar.durasi == undefined) {
                    $scope.itemSeminar.durasi = ""
                }
                if ($scope.itemSeminar.noSertifikat == "" || $scope.itemSeminar.noSertifikat == undefined) {
                    $scope.itemSeminar.noSertifikat = ""
                }
                if ($scope.itemSeminar.keterangan == "" || $scope.itemSeminar.keterangan == undefined) {
                    $scope.itemSeminar.keterangan = ""
                }
                if (pdf10.length == 0) {
                    pdf10.push(tampungankosong)
                }
                var nR = "";
                if ($scope.itemSeminar.norec != undefined) {
                    nR = $scope.itemSeminar.norec
                }
                var tglMulai = ""
                if ($scope.itemSeminar.tglMulaiPel != "") {
                    tglMulai = moment($scope.itemSeminar.tglMulaiPel).format('YYYY-MM-DD HH:mm:ss')
                }
                var tglSelesai = ""
                if ($scope.itemSeminar.tglSelesaiPel != "") {
                    var tglSelesai = moment($scope.itemSeminar.tglSelesaiPel).format('YYYY-MM-DD HH:mm:ss')
                }
                var skp = "-"
                if ($scope.itemSeminar.skp != undefined) {
                    skp = $scope.itemSeminar.skp
                }
                debugger
                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "penyelenggara": $scope.itemSeminar.namaInstitusi,
                    "lokasi": $scope.itemSeminar.lokasi,
                    "namaseminar": $scope.itemSeminar.namaSeminar,
                    "mulai": tglMulai,
                    "selesai": tglSelesai,
                    "durasi": $scope.itemSeminar.durasi,
                    "nosertifikat": $scope.itemSeminar.noSertifikat,
                    "keterangan": $scope.itemSeminar.keterangan,
                    "sertifikat": pdf10[0],
                    "skp": skp
                }
                const url = baseTransaksi + 'sdm/upload-data-seminar'
                const formData = new FormData()
                const file = document.querySelector(".mySeminar").files[0]
                // if (file == "" || file == undefined) {
                //     toastr.error('Silahkan Upload File STR')
                //     return;
                // }
                // if (file.size > 3145728 || file.type != "application/pdf") {
                //     toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                //     return;
                // }
                // formData.append('filespkk', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('namapenyelenggara', objSave.penyelenggara)
                formData.append('lokasi', objSave.lokasi)
                formData.append('namaseminar', objSave.namaseminar)
                formData.append('tglmulai', objSave.mulai)
                formData.append('tglselesai', objSave.selesai)
                formData.append('durasi', objSave.durasi)
                formData.append('nosertifikat', objSave.nosertifikat)
                formData.append('keterangan', objSave.keterangan)
                formData.append('sertifikat', objSave.sertifikat)
                formData.append('skp', objSave.skp)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan Seminar berhasil");
                    $scope.loadDataSeminar();
                    $scope.batalRiwayatSeminar();
                })
            }

            $scope.loadDataSip = function () {
                medifirstService.get("sdm/get-data-sip-pegawai?idPegawai=" + $scope.item.idPegawai).then(function (res) {
                    var datas = res.data.data;
                    sip = datas
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridSip = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataStr = function () {
                medifirstService.get("sdm/get-data-str-pegawai?idPegawai=" + $scope.item.idPegawai).then(function (res) {
                    debugger
                    var datas = res.data.data;
                    str = datas
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridStr = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataSpkk = function () {
                medifirstService.get("sdm/get-data-spkk?idPegawai=" + $scope.item.idPegawai).then(function (res) {
                    debugger
                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridSpkk = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataSeminar = function () {
                medifirstService.get("sdm/get-data-seminar?idPegawai=" + $scope.item.idPegawai).then(function (res) {
                    debugger
                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridRiwayatSeminar = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataDikJur = function () {
                medifirstService.get("sdm/get-data-dikjur?idPegawai=" + $scope.item.idPegawai).then(function (res) {

                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridRiwayatDikJur = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataTandaJasa = function () {
                medifirstService.get("sdm/get-data-tanda-jasa?idPegawai=" + $scope.item.idPegawai).then(function (res) {

                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridTandaJasa = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataKecakapanBahasa = function () {
                medifirstService.get("sdm/get-data-kecakapan-bahasa?idPegawai=" + $scope.item.idPegawai).then(function (res) {

                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridKecakapanBahasa = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataOrganisasiProfesi = function () {
                medifirstService.get("sdm/get-data-organisasi-profesi?idPegawai=" + $scope.item.idPegawai).then(function (res) {

                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridOrganisasiProfesi = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }


            function HapusSipNew(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                    "namafile": dataItem.namafileupload,
                }

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataSip();
                    }
                })
            }

            function HapusStrNew(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                    "namafile": dataItem.namafileupload,
                }

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataStr();
                    }
                })
            }
            function HapusSpkkNew(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                }

                medifirstService.post('sdm/delete-data-spkk', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataSpkk();
                    }
                })
            }

            function downloadSipStr(e) {
                // debugger
                // e.preventDefault();
                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                // if (!dataItem) {
                //     toastr.error("Data Tidak Ditemukan");
                //     return;
                // }

                // medifirstService.get('sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload).then(function(data) {
                //     window.open(baseTransaksi + 'sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload);
                //     // var url=baseTransaksi+data;
                //     // downloadURI(url);
                // })
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.filesip2 == null) {
                    toastr.error("Sprint Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.filesip2 + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            function downloadSipStr2(e) {
                // debugger
                // e.preventDefault();
                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                // if (!dataItem) {
                //     toastr.error("Data Tidak Ditemukan");
                //     return;
                // }

                // medifirstService.get('sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload).then(function(data) {
                //     window.open(baseTransaksi + 'sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload);
                //     // var url=baseTransaksi+data;
                //     // downloadURI(url);
                // })
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.filestr2 == null) {
                    toastr.error("Sprint Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.filestr2 + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            function lihatSpkk(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.filespkk == null) {
                    toastr.error("File Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.filespkk + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }

            $scope.$watch('item.tglMasuk', function (newValue, oldValue) {
                debugger
                if (newValue != oldValue) {
                    if ($scope.item.tglkeluar != undefined) {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglkeluar));
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    } else if ($scope.item.tglPensiun != undefined && $scope.item.tglMasuk != undefined) {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglPensiun));
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    } else {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date());
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    }
                } else {
                    $scope.item.MasaKerja = ""
                }
            });

            $scope.$watch('item.tglkeluar', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.tglkeluar != undefined) {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglkeluar));
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    } else if ($scope.item.tglPensiun != undefined) {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglPensiun));
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    } else {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date());
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    }
                }
            });

            $scope.$watch('item.tglPensiun', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.tglkeluar != undefined) {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglkeluar));
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    } else if ($scope.item.tglPensiun != undefined) {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglPensiun));
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    } else {
                        let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date());
                        $scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    }
                }
            });
            $scope.showPopUp = function () {
                $scope.popUpUpload.center().open()
            }
            $scope.TutupPopUp = function () {

                if ($scope.urlImage != undefined)
                    $scope.item.image = "../app/images/avatar.jpg"
                $scope.urlImage = undefined
                $scope.popUpUpload.close()
            }
            $scope.UploadPhoto = function () {
                // if ($scope.urlImage != undefined) {
                //     // saveImageToDirsaveImageToDir($scope.urlImage,'0182781')
                //     $scope.item.image = $scope.urlImage
                //     $scope.popUpUpload.close()
                // } else {
                //     toastr.info('Gambar belum di pilih')
                //     return
                // }
                debugger
                // $scope.images2 = [];
                if ($scope.images2.length > 0) {
                    $scope.images2.splice($scope.images2, 1)
                }
                var foto = fotoprofile[0]
                $scope.images2.push({
                    dataURL2: foto
                })
                $scope.popUpUpload.close();
            }
            $scope.opsiGridRiwayatDikJur = {
                toolbar: [{
                    name: "create",
                    text: "Buat Riwayat DikJur",
                    template: '<button ng-click="createDikJur()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat DikJur</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "7%"
                },
                {
                    "field": "namapenyelenggara",
                    "title": "Penyelenggara",
                    "width": "25%"
                },
                {
                    "field": "tglmulai",
                    "title": "Tgl Mulai",
                    "width": "15%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglmulai #')}}</span>"
                },
                {
                    "field": "tglselesai",
                    "title": "Tgl Selesai",
                    "width": "15%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglselesai #')}}</span>"
                },
                {
                    "command": [
                        // { text: "Edit", click: EditPelatihan, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusDikjur, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat", click: LihatSertifikatDikjur, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }
            $scope.createDikJur = function () {
                $scope.item.norecDikJur = "";
                $scope.item.nomorId = undefined;
                $scope.popUpRiwayatDikJur.center().open();
                var actions = $scope.popUpRiwayatDikJur.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatDikJur.setOptions({ actions: actions });

            }
            $scope.simpanRiwayatDikJur = function () {
                debugger
                if ($scope.itemDikJur.namaInstitusi == "" || $scope.itemDikJur.namaInstitusi == undefined) {
                    toastr.error('Nama Penyelenggara Harus Diisi !')
                    return
                }
                var lokasi = ""
                if ($scope.itemDikJur.lokasi != undefined) {
                    lokasi = $scope.itemDikJur.lokasi
                }
                var namadikjur = ""
                if ($scope.itemDikJur.namaDikJur != undefined) {
                    namadikjur = $scope.itemDikJur.namaDikJur
                }
                var durasi = ""
                if ($scope.itemDikJur.durasi != undefined) {
                    durasi = $scope.itemDikJur.durasi
                }
                var nosertifikat = ""
                if ($scope.itemDikJur.noSertifikat != undefined) {
                    nosertifikat = $scope.itemDikJur.noSertifikat
                }
                var keterangan = ""
                if ($scope.itemDikJur.keterangan != undefined) {
                    keterangan = $scope.itemDikJur.keterangan
                }

                if ($scope.itemDikJur.tglMulaiPel == "" || $scope.itemDikJur.tglMulaiPel == undefined) {
                    $scope.itemDikJur.tglMulaiPel = ""
                }
                if ($scope.itemDikJur.tglSelesaiPel == "" || $scope.itemDikJur.tglSelesaiPel == undefined) {
                    $scope.itemDikJur.tglSelesaiPel = ""
                }
                if (pdf11.length == 0) {
                    pdf11.push(tampungankosong)
                }
                var nR = "";
                if ($scope.itemDikJur.norec != undefined) {
                    nR = $scope.itemDikJur.norec
                }
                var tglMulai = ""
                if ($scope.itemDikJur.tglMulaiPel != "") {
                    tglMulai = moment($scope.itemDikJur.tglMulaiPel).format('YYYY-MM-DD HH:mm:ss')
                }
                var tglSelesai = ""
                if ($scope.itemDikJur.tglSelesaiPel != "") {
                    var tglSelesai = moment($scope.itemDikJur.tglSelesaiPel).format('YYYY-MM-DD HH:mm:ss')
                }
                debugger
                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "penyelenggara": $scope.itemDikJur.namaInstitusi,
                    "mulai": tglMulai,
                    "selesai": tglSelesai,
                    "sertifikat": pdf11[0],
                    "lokasi": lokasi,
                    "namadikjur": namadikjur,
                    "durasi": durasi,
                    "nosertifikat": nosertifikat,
                    "keterangan": keterangan
                }
                const url = baseTransaksi + 'sdm/upload-data-dikjur'
                const formData = new FormData()
                const file = document.querySelector(".mySeminar").files[0]
                // if (file == "" || file == undefined) {
                //     toastr.error('Silahkan Upload File STR')
                //     return;
                // }
                // if (file.size > 3145728 || file.type != "application/pdf") {
                //     toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                //     return;
                // }
                // formData.append('filespkk', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('namapenyelenggara', objSave.penyelenggara)
                formData.append('tglmulai', objSave.mulai)
                formData.append('tglselesai', objSave.selesai)
                formData.append('sertifikat', objSave.sertifikat)
                formData.append('lokasi', objSave.lokasi)
                formData.append('namadikjur', objSave.namadikjur)
                formData.append('durasi', objSave.durasi)
                formData.append('nosertifikat', objSave.nosertifikat)
                formData.append('keterangan', objSave.keterangan)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan DikJur berhasil");
                    $scope.loadDataDikJur();
                    $scope.batalRiwayatDikJur();
                })
            }
            function HapusDikjur(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                }

                medifirstService.post('sdm/pelatihan/delete-data-dikjur', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataDikJur();
                    }
                })
            }
            function LihatSertifikatDikjur(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.sertifikat == null) {
                    toastr.error("Sertifikat Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.sertifikat + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            $scope.opsiGridTandaJasa = {
                toolbar: [{
                    name: "create",
                    text: "Buat Tanda Jasa",
                    template: '<button ng-click="createTandaJasa()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Tanda Jasa</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "7%"
                },
                {
                    "field": "tandajasa",
                    "title": "Tanda Jasa",
                    "width": "25%"
                },
                {
                    "command": [
                        // { text: "Edit", click: EditPelatihan, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusTandaJasa, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat", click: LihatSertifikatTandaJasa, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }
            $scope.createTandaJasa = function () {
                $scope.item.norecTandajasa = "";
                $scope.item.nomorId = undefined;
                $scope.popUpTandaJasa.center().open();
                var actions = $scope.popUpTandaJasa.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpTandaJasa.setOptions({ actions: actions });

            }
            $scope.simpanTandaJasa = function () {
                debugger
                if ($scope.itemTandaJasa.tandaJasa == "" || $scope.itemTandaJasa.tandaJasa == undefined) {
                    toastr.error('Nama Tanda Jasa Harus Diisi !')
                    return
                }
                if (pdf12.length == 0) {
                    pdf12.push(tampungankosong)
                }
                var nR = "";
                if ($scope.itemTandaJasa.norec != undefined) {
                    nR = $scope.itemTandaJasa.norec
                }
                debugger
                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "tandajasa": $scope.itemTandaJasa.tandaJasa,
                    "sertifikat": pdf12[0]
                }
                const url = baseTransaksi + 'sdm/upload-data-tanda-jasa'
                const formData = new FormData()
                // const file = document.querySelector(".mySeminar").files[0]
                // if (file == "" || file == undefined) {
                //     toastr.error('Silahkan Upload File STR')
                //     return;
                // }
                // if (file.size > 3145728 || file.type != "application/pdf") {
                //     toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                //     return;
                // }
                // formData.append('filespkk', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('tandajasa', objSave.tandajasa)
                formData.append('sertifikat', objSave.sertifikat)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan DikJur berhasil");
                    $scope.loadDataTandaJasa();
                    $scope.batalTandaJasa();
                })
            }
            function HapusTandaJasa(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                }

                medifirstService.post('sdm/pelatihan/delete-data-tanda-jasa', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataTandaJasa();
                    }
                })
            }
            function LihatSertifikatTandaJasa(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.sertifikat == null) {
                    toastr.error("Sertifikat Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.sertifikat + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            $scope.opsiGridKecakapanBahasa = {
                toolbar: [{
                    name: "create",
                    text: "Buat Kecakapan Bahasa",
                    template: '<button ng-click="createKecakapanBahasa()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Kecakapan Bahasa</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "7%"
                },
                {
                    "field": "jenisbahasa",
                    "title": "Jenis Bahasa",
                    "width": "25%"
                },
                {
                    "field": "bahasa",
                    "title": "Bahasa",
                    "width": "25%"
                },
                {
                    "command": [
                        // { text: "Edit", click: EditPelatihan, imageClass: "k-icon k-i-pencil" },
                        { text: "Hapus", click: HapusKecakapanBahasa, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat", click: LihatSertifikatBahasa, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }
            $scope.createKecakapanBahasa = function () {
                $scope.item.norecKecakapanBahasa = "";
                $scope.item.nomorId = undefined;
                $scope.popUpKecakapanBahasa.center().open();
                var actions = $scope.popUpKecakapanBahasa.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpKecakapanBahasa.setOptions({ actions: actions });

            }
            $scope.simpanKecakapanBahasa = function () {
                debugger
                if ($scope.itemkecakapanBahasa.jenisBahasa == "" || $scope.itemkecakapanBahasa.jenisBahasa == undefined) {
                    toastr.error('Jenis Bahasa Harus Diisi !')
                    return
                }
                if ($scope.itemkecakapanBahasa.bahasa == "" || $scope.itemkecakapanBahasa.bahasa == undefined) {
                    toastr.error('Bahasa Harus Diisi !')
                    return
                }
                var nR = "";
                if ($scope.itemkecakapanBahasa.norec != undefined) {
                    nR = $scope.itemkecakapanBahasa.norec
                }
                var sertifikat = "";
                if (pdf14[0] != undefined) {
                    sertifikat = pdf14[0]
                }
                debugger
                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "jenisbahasa": $scope.itemkecakapanBahasa.jenisBahasa.jenisbahasa,
                    "bahasa": $scope.itemkecakapanBahasa.bahasa,
                    "sertifikat": sertifikat,
                }
                const url = baseTransaksi + 'sdm/upload-data-kecakapan-bahasa'
                const formData = new FormData()
                // const file = document.querySelector(".mySeminar").files[0]
                // if (file == "" || file == undefined) {
                //     toastr.error('Silahkan Upload File STR')
                //     return;
                // }
                // if (file.size > 3145728 || file.type != "application/pdf") {
                //     toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
                //     return;
                // }
                // formData.append('filespkk', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('jenisbahasa', objSave.jenisbahasa)
                formData.append('bahasa', objSave.bahasa)
                formData.append('sertifikat', objSave.sertifikat)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan Kecakapan Bahasa berhasil");
                    $scope.loadDataKecakapanBahasa();
                    $scope.batalKecakapanBahasa();
                })
            }
            function HapusKecakapanBahasa(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                }

                medifirstService.post('sdm/pelatihan/delete-data-kecakapan-bahasa', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataKecakapanBahasa();
                    }
                })
            }
            function LihatSertifikatBahasa(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.sertifikat == null) {
                    toastr.error("Sertifikat Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.sertifikat + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            $scope.lihatKTA = function () {
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + pdf15[0] + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }
            $scope.createOrganisasiProfesi = function () {
                $scope.item.norecOrganisasiProfesi = "";
                $scope.item.nomorId = undefined;
                $scope.popUpOrganisasiProfesi.center().open();
                var actions = $scope.popUpOrganisasiProfesi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpOrganisasiProfesi.setOptions({ actions: actions });

            }
            $scope.opsiGridOrganisasiProfesi = {
                toolbar: [{
                    name: "create",
                    text: "Buat Organisasi Profesi",
                    template: '<button ng-click="createOrganisasiProfesi()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Organisasi Profesi</button>'
                }],
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "7%"
                },
                {
                    "field": "nokta",
                    "title": "No KTA",
                    "width": "25%"
                },
                {
                    "command": [
                        { text: "Hapus", click: HapusOrganisasiProfesi, imageClass: "k-icon k-i-delete" },
                        { text: "Lihat", click: LihatOrganisasiProfesi, imageClass: "k-icon k-i-delete" },
                    ],
                    title: "",
                    width: "185px",
                }
                ]
            }
            $scope.simpanOrganisasiProfesi = function () {
                debugger
                if ($scope.itemOrganisasiProfesi.noKta == undefined) {
                    toastr.error('No KTA Wajib Diinput !')
                    return
                }
                if (pdf16[0] == undefined) {
                    toastr.error('KTA wajib diupload')
                    return
                }
                var tampung = "";
                for (var i = 0; i < $scope.itemOrganisasiProfesi.noKta.length; i++) {
                    if (i <= 3) {
                        tampung = tampung + $scope.itemOrganisasiProfesi.noKta[i]
                    }
                }
                if (tampung != 3172) {
                    alert('Nomor KTA tidak sesuai dengan format RS POLRI ! \nHarap perbaharui nomor KTA Anda !')
                    return
                }
                var noKta = "";
                if ($scope.itemOrganisasiProfesi.noKta != undefined) {
                    noKta = $scope.itemOrganisasiProfesi.noKta
                }
                var kta = "";
                if (pdf16[0] != undefined) {
                    kta = pdf16[0]
                }
                var nR = "";
                if ($scope.itemOrganisasiProfesi.norec != undefined) {
                    nR = $scope.itemOrganisasiProfesi.norec
                }

                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "nokta": noKta,
                    "kta": kta,
                }
                const url = baseTransaksi + 'sdm/upload-data-organisasi-profesi'
                const formData = new FormData()
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('nokta', objSave.nokta)
                formData.append('kta', objSave.kta)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    toastr.info("Simpan Organisasi Profesi berhasil");
                    $scope.loadDataOrganisasiProfesi();
                    $scope.batalOrganisasiProfesi();
                })
            }
            function HapusOrganisasiProfesi(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                var itemDelete = {
                    "norec": dataItem.norec,
                }

                medifirstService.post('sdm/pelatihan/delete-data-organisasi-profesi', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        $scope.loadDataOrganisasiProfesi();
                    }
                })
            }
            function LihatOrganisasiProfesi(e) {
                debugger
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.kta == null) {
                    toastr.error("KTA Tidak Ditemukan!")
                    return;
                };
                const win = window.open("", "_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="' + dataItem.kta + '" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                    win.document.write(html);
                }, 0);
            }


            //* BATAS SUCI *//			
        }
    ]);
});