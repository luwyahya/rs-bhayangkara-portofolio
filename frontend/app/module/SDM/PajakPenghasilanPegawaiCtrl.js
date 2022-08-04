define(['initialize', 'Configuration'], function(initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('PajakPenghasilanPegawaiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.itemKeluarga = {};
            $scope.itemPendidikan = {};
            $scope.itemPelatihan = {};
            $scope.itemLogin = {};
            $scope.itemLogin.idlogin = undefined;
            $scope.itemLogin.pegawaiId = undefined;
            $scope.itemJabatan = {};
            $scope.itemSip = {};
            $scope.itemStr = {};
            $scope.itemTelp = [];
            $scope.model = {};
            $scope.model.kodeop = false;
            $scope.model.kodeop1 = false;
            $scope.model.pegawaitersebut = false;
            $scope.model.pegawaitersebut1 = false;
            $scope.model.pegawaitersebut2 = false;
            $scope.model.pegawaitersebut3 = false;
            $scope.model.pegawaitersebut4 = false;
            $scope.item.no = undefined;
            $scope.item.idPegawai = undefined;
            $scope.item.PasswordDefault = undefined;
            $scope.now = new Date();
            $scope.item.ttd = $scope.now;
            var dataKeluarga = [];
            var dataPegawai = [];
            var dataPemotonganPajak = [];
            var dataRiwayatPendidikan = [];
            var dataRiwayatJabatan = [];
            var dataSip = [];
            var dataStr = [];
            var dataNoTelp = [];
            // $scope.model.pegawaitersebut = false;
            // $scope.model.pegawaitersebut1 = false;
            // $scope.model.pegawaitersebut2 = false;
            // $scope.model.pegawaitersebut3 = false;
            var objSave = [];
            var objUpload = [];
            var dataRiwayatPelatihan = [];
            var jenisCache = "";
            $scope.loginDisabled = false;
            var OldCurStop = undefined;
            $scope.monthSelectorOptions = function() {
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
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");				
            };

            function ClearDataRiwayatPendidikan() {
                $scope.itemPendidikan = {};
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataRiwayatPelatihan() {
                $scope.itemPelatihan = {};
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataRiwayatJabatan() {
                $scope.itemPendidikan = {};
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataUserLogin() {
                $scope.itemLogin = {};
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataSip() {
                $scope.itemSip = {};
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataStr() {
                $scope.itemStr = {};
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function ClearDataTelp() {
                dataNoTelp = [];
                // $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
            };

            function FormLoad() {
                $scope.isRouteLoading = true;
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function(data) {
                    $scope.listPgw = data;
                });
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function(dat) {
                    var dataCombo = dat.data
                    $scope.ListJenisKelamin = dataCombo.jeniskelamin;
                    $scope.ListAgama = dataCombo.agama;
                    $scope.ListStatusKawin = dataCombo.statuskawin;
                    $scope.ListPendidikan = dataCombo.pendidikan;
                    // $scope.UsiaPensiun =dataCombo.usiapensiun.nilaifield;
                    $scope.ListKedudukanPegawai = dataCombo.kedudukan;
                    $scope.ListKategoriPegawai = dataCombo.kategorypegawai;
                    // $scope.ListJabatanFungsional = dataCombo.jabatans;
                    // $scope.ListGolonganPegawai = dataCombo.golonganpegawai;
                    $scope.ListGolonganPegawai = dataCombo.golonganPegawai;
                    $scope.ListDetilKelompokJabatan = dataCombo.jabatans;
                    $scope.ListDetilPangkatPegawai = dataCombo.pangkatpegawai;
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
                    // $scope.ListSubUnitKerja = dataCombo.subunitkerja;
                    LoadCache();
                });

                medifirstService.get("sdm/get-petugas-diklat", true, true, 20).then(function(data) {
                    $scope.ListPetugasDiklat = data.data.data;
                });
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('PajakPenghasilanPegawaiCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.idPegawai = chacePeriode[0];
                    $scope.item.tahunPajak = chacePeriode[2];
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
                        medifirstService.get("sdm/get-data-pajak-penghasilan-pegawai?idPegawai=" + $scope.item.idPegawai + "&tahunPajak=" + $scope.item.tahunPajak, true).then(function(dat) {
                            $scope.now = new Date();
                            $scope.item.ttd = $scope.now;
                            $scope.ShowLogin = false;
                            var dataCache = dat.data;
                            var dataCachePegawai = dataCache.datapegawai[0];
                            if (dataCache.datapemotonganpajak.length != 0) {
                                var dataCachePemotonganPajak = dataCache.datapemotonganpajak[0];
                            }
                            var dataCacheKeluarga = dataCache.datakeluarga;
                            var dataCachePendidikan = dataCache.datapendidikan;
                            var dataCachePelatihan = dataCache.datapelatihan;
                            var dataCacheBendahara = dataCache.dataBendahara[0];
                            var dataCacheJabatan = dataCache.datajabatan;
                            var dataCacheSip = dataCache.datasip;
                            var dataCacheStr = dataCache.datastr;
                            var dataCacheTelp = dataCache.datatelp;


                            if (dataCache.datapemotonganpajak.length != 0) {
                                // Data Pemotongan Pajak
                                $scope.item.ptpid = dataCachePemotonganPajak.ptpid;
                                $scope.item.gpp = dataCachePemotonganPajak.gpp;
                                $scope.item.ti = dataCachePemotonganPajak.ti;
                                $scope.item.ta = dataCachePemotonganPajak.ta;
                                $scope.item.jgtk = dataCachePemotonganPajak.jgtk;
                                $scope.item.tpp = dataCachePemotonganPajak.tpp;
                                $scope.item.tsf = dataCachePemotonganPajak.tsf;
                                $scope.item.tb = dataCachePemotonganPajak.tb;
                                $scope.item.dpapkpsd = dataCachePemotonganPajak.dpapkpsd;
                                $scope.item.tk = dataCachePemotonganPajak.tk;
                                $scope.item.tll = dataCachePemotonganPajak.tll;
                                $scope.item.pttlyptdpg = dataCachePemotonganPajak.pttlyptdpg;
                                $scope.item.jpb = dataCachePemotonganPajak.jpb;
                                $scope.item.bjbp = dataCachePemotonganPajak.bjbp;
                                $scope.item.ipai = dataCachePemotonganPajak.ipai;
                                $scope.item.jp = dataCachePemotonganPajak.jp;
                                $scope.item.jpn = dataCachePemotonganPajak.jpn;
                                $scope.item.jpnms = dataCachePemotonganPajak.jpnms;
                                $scope.item.jpnuppp = dataCachePemotonganPajak.jpnuppp;
                                $scope.item.ptkp = dataCachePemotonganPajak.ptkp;
                                $scope.item.pkpsd = dataCachePemotonganPajak.pkpsd;
                                $scope.item.ppapkpsd = dataCachePemotonganPajak.ppapkpsd;
                                $scope.item.ppytdms = dataCachePemotonganPajak.ppytdms;
                                $scope.item.ppt = dataCachePemotonganPajak.ppt;
                                $scope.item.ppytdd = dataCachePemotonganPajak.ppytdd;
                                $scope.item.agt = dataCachePemotonganPajak.agt;
                                $scope.item.apttlyptdpg = dataCachePemotonganPajak.apttlyptdpg;
                                $scope.item.nomorsurat = dataCachePemotonganPajak.nomorsurat;
                                $scope.item.masapp = dataCachePemotonganPajak.masapp;
                                $scope.item.nomor = '00.141.958.9-005.000';
                                $scope.item.sk = dataCachePemotonganPajak.sk;
                                $scope.item.skt = dataCachePemotonganPajak.skt;
                                $scope.item.shb = dataCachePemotonganPajak.shb;
                                // if($scope.item.pegawaitersebut == 'Dipindahkan') {
                                // 	$scope.model.pegawaitersebut = true;
                                // } else if($scope.item.pegawaitersebut == 'Pindah') {
                                // 	$scope.model.pegawaitersebut1 = true;
                                // }
                                $scope.item.kodeop = dataCachePemotonganPajak.kodeop;
                                if ($scope.item.kodeop == '21-100-01') {
                                    $scope.model.kodeop = true
                                } else if ($scope.item.kodeop == '21-100-02') {
                                    $scope.model.kodeop1 = true
                                } else {
                                    $scope.model.kodeop = true
                                }
                                $scope.item.pegawaitersebut = dataCachePemotonganPajak.pegawaitersebut;
                                if ($scope.item.pegawaitersebut == 'Dipindahkan') {
                                    $scope.model.pegawaitersebut = true
                                } else if ($scope.item.pegawaitersebut == 'Pindah') {
                                    $scope.model.pegawaitersebut1 = true
                                } else if ($scope.item.pegawaitersebut == 'Baru') {
                                    $scope.model.pegawaitersebut2 = true
                                } else if ($scope.item.pegawaitersebut == 'Pensium') {
                                    $scope.model.pegawaitersebut3 = true
                                } else if ($scope.item.pegawaitersebut == '-') {
                                    $scope.model.pegawaitersebut4 = true
                                } else {
                                    $scope.model.pegawaitersebut4 = true
                                }
                                $scope.item.ttd = dataCachePemotonganPajak.ttd;
                            } else {
                                $scope.item.ptpid = '';
                                $scope.item.ptpid = null;
                                $scope.item.gpp = null;
                                $scope.item.ti = null;
                                $scope.item.ta = null;
                                $scope.item.jgtk = null;
                                $scope.item.tpp = null;
                                $scope.item.tsf = null;
                                $scope.item.tb = null;
                                $scope.item.dpapkpsd = null;
                                $scope.item.tk = null;
                                $scope.item.tll = null;
                                $scope.item.pttlyptdpg = null;
                                $scope.item.jpb = null;
                                $scope.item.bjbp = null;
                                $scope.item.ipai = null;
                                $scope.item.jp = null;
                                $scope.item.jpn = null;
                                $scope.item.jpnms = null;
                                $scope.item.jpnuppp = null;
                                $scope.item.ptkp = null;
                                $scope.item.pkpsd = null;
                                $scope.item.ppapkpsd = null;
                                $scope.item.ppytdms = null;
                                $scope.item.ppt = null;
                                $scope.item.ppytdd = null;
                                $scope.item.agt = null;
                                $scope.item.apttlyptdpg = null;
                                $scope.item.nomorsurat = null;
                                $scope.item.masapp = null;
                                $scope.item.nomor = null;
                                $scope.item.sk = null;
                                $scope.item.skt = null;
                                $scope.item.shb = null;
                                $scope.item.kodeop = null;
                                $scope.item.pegawaitersebut = null;
                                // $scope.item.ttd = null;
                            }

                            // Data Bendahara
                            $scope.item.namabendahara = dataCacheBendahara.nama;
                            $scope.item.nipnrpbendahara = dataCacheBendahara.nip;
                            $scope.item.npwpbendahara = dataCacheBendahara.npwp;


                            // Data Pegawai
                            $scope.item.idPegawai = dataCachePegawai.id;
                            // $scope.item.nipPns = dataCachePegawai.nippns;
                            $scope.item.nip = dataCachePegawai.nip;
                            $scope.item.nrp = dataCachePegawai.nrp;
                            $scope.item.namaLengkap = dataCachePegawai.namalengkap;
                            $scope.item.gelarDepan = dataCachePegawai.gelardepan;
                            $scope.item.gelarBelakang = dataCachePegawai.gelarbelakang;
                            $scope.item.nama = dataCachePegawai.nama;
                            $scope.item.tempatLahir = dataCachePegawai.tempatlahir;
                            $scope.item.ruangan = { id: dataCachePegawai.idruangan, namaruangan: dataCachePegawai.namaruangan };

                            if (dataCachePegawai.tgllahir)
                                $scope.item.tglLahir = moment(dataCachePegawai.tgllahir).format('YYYY-MM-DD HH:mm');
                            if (dataCachePegawai.unitkerja)
                                $scope.item.unitKerja = { id: dataCachePegawai.objectunitkerjapegawaifk, name: dataCachePegawai.unitkerja };
                            $scope.item.jenisKelamin = { id: dataCachePegawai.objectjeniskelaminfk, jeniskelamin: dataCachePegawai.jeniskelamin };
                            $scope.item.pendidikan = { id: dataCachePegawai.objectpendidikanterakhirfk, pendidikan: dataCachePegawai.pendidikan };
                            $scope.item.statusPerkawinanPegawai = { id: dataCachePegawai.objectstatusperkawinanpegawaifk, statusperkawinan: dataCachePegawai.statusperkawinan };
                            $scope.item.npwp = dataCachePegawai.npwp
                            $scope.item.noidentitas = dataCachePegawai.noidentitas
                            $scope.item.agama = { id: dataCachePegawai.objectagamafk, agama: dataCachePegawai.agama };
                            if (dataCachePegawai.tglmeninggal)
                                $scope.item.tglMeninggal = moment(dataCachePegawai.tglmeninggal).format('YYYY-MM-DD HH:mm');
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
                            $scope.item.kedudukan = { id: dataCachePegawai.kedudukanfk, name: dataCachePegawai.kedudukan };
                            $scope.item.golonganPegawai = { id: dataCachePegawai.objectgolonganfk, name: dataCachePegawai.golongan };
                            $scope.item.jabatanFungsional = { id: dataCachePegawai.objectjabatanfungsionalfk, namajabatan: dataCachePegawai.jbfungsional };
                            $scope.item.detailKelompokJabatan = { id: dataCachePegawai.objectjabatanstrukturalfk, detailkelompokjabatan: dataCachePegawai.detailkelompokjabatan };
                            $scope.item.detailPangkatPegawai = { id: dataCachePegawai.objectpangkatfk, namapangkat: dataCachePegawai.namapangkat };
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


                            // End Data Riwayat Jabatan

                            // Data Login User
                            ClearDataUserLogin()
                                // End Data Login User

                            $scope.isRouteLoading = false;
                        });
                    }
                } else {
                    $scope.isRouteLoading = false;
                    $scope.ShowLogin = true;
                }
            }
            $scope.CariFiltergpp = function() {
                var gpp = $scope.item.gpp
                if (gpp.substring(0, 4) == "Rp. ") {
                    gpp = gpp.substring(4)
                    gpp = gpp.replace(/,/g, '');
                }
                $scope.item.gpp = formatRupiah(gpp, "");
                document.getElementById("ti").focus();
            }
            $scope.CariFilterti = function() {
                var ti = $scope.item.ti
                if (ti.substring(0, 4) == "Rp. ") {
                    ti = ti.substring(4)
                    ti = ti.replace(/,/g, '');
                }
                $scope.item.ti = formatRupiah(ti, "");
                document.getElementById("ta").focus();
            }
            $scope.CariFilterta = function() {
                var ta = $scope.item.ta
                if (ta.substring(0, 4) == "Rp. ") {
                    ta = ta.substring(4)
                    ta = ta.replace(/,/g, '');
                }
                $scope.item.ta = formatRupiah(ta, "");
                document.getElementById("jgtk").focus();
            }
            $scope.CariFilterjgtk = function() {
                var jgtk = $scope.item.jgtk
                if (jgtk.substring(0, 4) == "Rp. ") {
                    jgtk = jgtk.substring(4)
                    jgtk = jgtk.replace(/,/g, '');
                }
                $scope.item.jgtk = formatRupiah(jgtk, "");
                document.getElementById("tpp").focus();
            }
            $scope.CariFiltertpp = function() {
                var tpp = $scope.item.tpp
                if (tpp.substring(0, 4) == "Rp. ") {
                    tpp = tpp.substring(4)
                    tpp = tpp.replace(/,/g, '');
                }
                $scope.item.tpp = formatRupiah(tpp, "");
                document.getElementById("tsf").focus();
            }
            $scope.CariFiltertsf = function() {
                var tsf = $scope.item.tsf
                if (tsf.substring(0, 4) == "Rp. ") {
                    tsf = tsf.substring(4)
                    tsf = tsf.replace(/,/g, '');
                }
                $scope.item.tsf = formatRupiah(tsf, "");
                document.getElementById("tb").focus();
            }
            $scope.CariFiltertb = function() {
                var tb = $scope.item.tb
                if (tb.substring(0, 4) == "Rp. ") {
                    tb = tb.substring(4)
                    tb = tb.replace(/,/g, '');
                }
                $scope.item.tb = formatRupiah(tb, "");
                document.getElementById("tk").focus();
            }
            $scope.CariFiltertk = function() {
                var tk = $scope.item.tk
                if (tk.substring(0, 4) == "Rp. ") {
                    tk = tk.substring(4)
                    tk = tk.replace(/,/g, '');
                }
                $scope.item.tk = formatRupiah(tk, "");
                document.getElementById("tll").focus();
            }
            $scope.CariFiltertll = function() {
                var tll = $scope.item.tll
                if (tll.substring(0, 4) == "Rp. ") {
                    tll = tll.substring(4)
                    tll = tll.replace(/,/g, '');
                }
                $scope.item.tll = formatRupiah(tll, "");
                document.getElementById("pttlyptdpg").focus();
            }
            $scope.CariFilterpttlyptdpg = function() {
                var pttlyptdpg = $scope.item.pttlyptdpg
                if (pttlyptdpg.substring(0, 4) == "Rp. ") {
                    pttlyptdpg = pttlyptdpg.substring(4)
                    pttlyptdpg = pttlyptdpg.replace(/,/g, '');
                }
                $scope.item.pttlyptdpg = formatRupiah(pttlyptdpg, "");
                document.getElementById("jpb").focus();
            }
            $scope.CariFilterjpb = function() {
                var jpb = $scope.item.jpb
                if (jpb.substring(0, 4) == "Rp. ") {
                    jpb = jpb.substring(4)
                    jpb = jpb.replace(/,/g, '');
                }
                $scope.item.jpb = formatRupiah(jpb, "");
                document.getElementById("bjbp").focus();
            }
            $scope.CariFilterbjbp = function() {
                var bjbp = $scope.item.bjbp
                if (bjbp.substring(0, 4) == "Rp. ") {
                    bjbp = bjbp.substring(4)
                    bjbp = bjbp.replace(/,/g, '');
                }
                $scope.item.bjbp = formatRupiah(bjbp, "");
                document.getElementById("ipai").focus();
            }
            $scope.CariFilteripai = function() {
                var ipai = $scope.item.ipai
                if (ipai.substring(0, 4) == "Rp. ") {
                    ipai = ipai.substring(4)
                    ipai = ipai.replace(/,/g, '');
                }
                $scope.item.ipai = formatRupiah(ipai, "");
                document.getElementById("jp").focus();
            }
            $scope.CariFilterjp = function() {
                var jp = $scope.item.jp
                if (jp.substring(0, 4) == "Rp. ") {
                    jp = jp.substring(4)
                    jp = jp.replace(/,/g, '');
                }
                $scope.item.jp = formatRupiah(jp, "");
                document.getElementById("jpn").focus();
            }
            $scope.CariFilterjpn = function() {
                var jpn = $scope.item.jpn
                if (jpn.substring(0, 4) == "Rp. ") {
                    jpn = jpn.substring(4)
                    jpn = jpn.replace(/,/g, '');
                }
                $scope.item.jpn = formatRupiah(jpn, "");
                document.getElementById("jpnms").focus();
            }
            $scope.CariFilterjpnms = function() {
                var jpnms = $scope.item.jpnms
                if (jpnms.substring(0, 4) == "Rp. ") {
                    jpnms = jpnms.substring(4)
                    jpnms = jpnms.replace(/,/g, '');
                }
                $scope.item.jpnms = formatRupiah(jpnms, "");
                document.getElementById("jpnuppp").focus();
            }
            $scope.CariFilterjpnuppp = function() {
                var jpnuppp = $scope.item.jpnuppp
                if (jpnuppp.substring(0, 4) == "Rp. ") {
                    jpnuppp = jpnuppp.substring(4)
                    jpnuppp = jpnuppp.replace(/,/g, '');
                }
                $scope.item.jpnuppp = formatRupiah(jpnuppp, "");
                document.getElementById("ptkp").focus();
            }
            $scope.CariFilterptkp = function() {
                var ptkp = $scope.item.ptkp
                if (ptkp.substring(0, 4) == "Rp. ") {
                    ptkp = ptkp.substring(4)
                    ptkp = ptkp.replace(/,/g, '');
                }
                $scope.item.ptkp = formatRupiah(ptkp, "");
                document.getElementById("pkpsd").focus();
            }
            $scope.CariFilterpkpsd = function() {
                var pkpsd = $scope.item.pkpsd
                if (pkpsd.substring(0, 4) == "Rp. ") {
                    pkpsd = pkpsd.substring(4)
                    pkpsd = pkpsd.replace(/,/g, '');
                }
                $scope.item.pkpsd = formatRupiah(pkpsd, "");
                document.getElementById("ppapkpsd").focus();
            }
            $scope.CariFilterppapkpsd = function() {
                var ppapkpsd = $scope.item.ppapkpsd
                if (ppapkpsd.substring(0, 4) == "Rp. ") {
                    ppapkpsd = ppapkpsd.substring(4)
                    ppapkpsd = ppapkpsd.replace(/,/g, '');
                }
                $scope.item.ppapkpsd = formatRupiah(ppapkpsd, "");
                document.getElementById("ppytdms").focus();
            }
            $scope.CariFilterppytdms = function() {
                var ppytdms = $scope.item.ppytdms
                if (ppytdms.substring(0, 4) == "Rp. ") {
                    ppytdms = ppytdms.substring(4)
                    ppytdms = ppytdms.replace(/,/g, '');
                }
                $scope.item.ppytdms = formatRupiah(ppytdms, "");
                document.getElementById("ppt").focus();
            }
            $scope.CariFilterppt = function() {
                var ppt = $scope.item.ppt
                if (ppt.substring(0, 4) == "Rp. ") {
                    ppt = ppt.substring(4)
                    ppt = ppt.replace(/,/g, '');
                }
                $scope.item.ppt = formatRupiah(ppt, "");
                document.getElementById("ppytdd").focus();
            }
            $scope.CariFilterppytdd = function() {
                var ppytdd = $scope.item.ppytdd
                if (ppytdd.substring(0, 4) == "Rp. ") {
                    ppytdd = ppytdd.substring(4)
                    ppytdd = ppytdd.replace(/,/g, '');
                }
                $scope.item.ppytdd = formatRupiah(ppytdd, "");
                document.getElementById("agt").focus();
            }
            $scope.CariFilteragt = function() {
                var agt = $scope.item.agt
                if (agt.substring(0, 4) == "Rp. ") {
                    agt = agt.substring(4)
                    agt = agt.replace(/,/g, '');
                }
                $scope.item.agt = formatRupiah(agt, "");
                document.getElementById("apttlyptdpg").focus();
            }
            $scope.CariFilterapttlyptdpg = function() {
                    var apttlyptdpg = $scope.item.apttlyptdpg
                    if (apttlyptdpg.substring(0, 4) == "Rp. ") {
                        apttlyptdpg = apttlyptdpg.substring(4)
                        apttlyptdpg = apttlyptdpg.replace(/,/g, '');
                    }
                    $scope.item.apttlyptdpg = formatRupiah(apttlyptdpg, "");
                    // document.getElementById("tpp").focus();
                }
                // $scope.CariFiltertpp = function () {
                // 	var tpp = $scope.item.tpp
                // 	if(tpp.substring(0,4)=="Rp. "){
                // 		tpp = tpp.substring(4)
                // 		tpp = tpp.replace(/,/g, '');
                // 	}
                // 	$scope.item.tpp = formatRupiah(tpp, "");
                // }

            function formatRupiah(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            // $scope.formatRupiah = function (value, currency) {
            // 	// debugger
            //     // return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            // 	if(value != ""){
            // 		$scope.item.gpp = currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            // 	}
            // }

            // // $scope.item.gpp.keypress()
            // // {
            // // 	formatRupiah($scope.item.gpp,'');	
            // // }


            $scope.ubah = function() {
                if ($scope.itemJabatan.jenisJabatan != undefined || $scope.itemJabatan.jenisJabatan != "") {
                    $scope.ListJabatan = $scope.itemJabatan.jenisJabatan.jabatan;
                }
            }
            $scope.$watch('itemSip.unitKerja', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.ListSubUnitKerja = newValue.subunit;
                }
            });
            $scope.$watch('itemStr.unitKerja', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.ListSubUnitKerja = newValue.subunit;
                }
            });

            $scope.$watch('item.test', function(newValue, oldValue) {
                // var res = newValue.substring(4);
                if (newValue.substring(0, 4) == "Rp. ") {
                    newValue = newValue.substring(4)
                    newValue = newValue.replace(/,/g, '');
                    if (oldValue.substring(0, 4) == "Rp. ") {
                        oldValue = oldValue.substring(4)
                        oldValue = oldValue.replace(/,/g, '');
                    }
                }
                if (newValue != oldValue) {
                    $scope.item.gpp = formatRupiah(newValue, "");
                    OldCurStop = $scope.item.gpp
                }
            });

            $scope.getGradeJbtn = function(e) {
                // if (!e.id) return;
                // $scope.item.grade = e.grade;
            }

            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatTahun = function(tanggal) {
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
                        "width": "20%",
                        "template": "<span class='style-left'>{{formatTahun('#: tgllulus #')}}</span>"
                    },
                    {
                        "command": [
                            { text: "Edit", click: EditPendidikan, imageClass: "k-icon k-i-pencil" },
                            { text: "Hapus", click: HapusPendidikan, imageClass: "k-icon k-i-delete" },
                        ],
                        title: "",
                        width: "185px",
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
                        "field": "nomor",
                        "title": "Nomor SIP",
                        "width": "20%"
                    },
                    {
                        "field": "tglberakhir",
                        "title": "Tanggal Berakhir",
                        "width": "20%",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglberakhir #')}}</span>"
                    },
                    {
                        "field": "namafileupload",
                        "title": "File SIP",
                        "width": "30%"
                    },
                    {
                        "command": [
                            // { text: "Edit", click: EditSip, imageClass: "k-icon k-i-pencil" },
                            { text: "Hapus", click: HapusSipNew, imageClass: "k-icon k-i-delete" },
                            { text: "Download", click: downloadSipStr, imageClass: "k-icon k-delete" }
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
                        "field": "nomor",
                        "title": "Nomor STR",
                        "width": "20%"
                    },
                    {
                        "field": "tglberakhir",
                        "title": "Tanggal Berakhir",
                        "width": "20%",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglberakhir #')}}</span>"
                    },
                    {
                        "field": "namafileupload",
                        "title": "File STR",
                        "width": "30%"
                    },
                    {
                        "command": [
                            // { text: "Edit", click: EditStr, imageClass: "k-icon k-i-pencil" },
                            { text: "Hapus", click: HapusStrNew, imageClass: "k-icon k-i-delete" },
                            { text: "Download", click: downloadSipStr, imageClass: "k-icon k-delete" }
                        ],
                        title: "",
                        width: "22%",
                    }
                ]
            }


            $scope.$watch('item.gelarDepan', function(newValue, oldValue) {
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

            $scope.$watch('item.nama', function(newValue, oldValue) {
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

            $scope.$watch('item.gelarBelakang', function(newValue, oldValue) {
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
                $scope.itemKeluarga.hubunganKeluarga = { id: dataItem.hubungankeluargafk, hubungankeluarga: dataItem.hubungankeluarga };
                $scope.itemKeluarga.tglLahir = moment(dataItem.tgllahir).format('YYYY-MM-DD');
                $scope.itemKeluarga.jenisKelaminKl = { id: dataItem.jeniskelaminfk, jeniskelamin: dataItem.jeniskelamin };
                $scope.itemKeluarga.namaAyah = dataItem.namaayah;
                $scope.itemKeluarga.namaIbu = dataItem.namaibu;
                $scope.itemKeluarga.statusPerkawinanPegawaiKL = { id: dataItem.statusperkawinanfk, statusperkawinan: dataItem.statusperkawinan };
                $scope.itemKeluarga.PekerjaanKL = { id: dataItem.pekerjaanfk, pekerjaan: dataItem.pekerjaan };
                $scope.itemKeluarga.nipIstriSuami = dataItem.nipistrisuami;
                $scope.itemKeluarga.statusTanggungan = { id: dataItem.statustanggunganfk, reportdisplay: dataItem.statustanggungan };
                $scope.itemKeluarga.noSuratKuliah = dataItem.noSuratKuliah;
                $scope.itemKeluarga.tglsuratKuliah = moment(dataItem.tglsuratkuliah).format('YYYY-MM-DD');
                $scope.itemKeluarga.alamat = dataItem.alamat;
                $scope.itemKeluarga.keterangan = dataItem.keterangan;
                $scope.itemKeluarga.pendidikan = { id: dataItem.pendidikanfk, pendidikan: dataItem.pendidikan };
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

                medifirstService.post('sdm/delete-data-keluarga-pegawai', itemDelete).then(function(e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
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

                medifirstService.post('sdm/delete-data-pelatihan', itemDelete).then(function(e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }

            function EditJabatan(e) {
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

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function(e) {
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
                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function(e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }

            $scope.createPendNew = function() {
                $scope.item.norecPend = "";
                $scope.item.nomor = undefined;
                $scope.popUpRiwayatPendidikan.center().open();
                var actions = $scope.popUpRiwayatPendidikan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatPendidikan.setOptions({ actions: actions });
            }

            $scope.createPelatihanNew = function() {
                $scope.item.norecPel = "";
                $scope.item.nomor = undefined;
                $scope.popUpRiwayatPelatihan.center().open();
                var actions = $scope.popUpRiwayatPelatihan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatPelatihan.setOptions({ actions: actions });
            }

            $scope.createNew = function() {
                $scope.item.id = "";
                $scope.item.no = undefined;
                $scope.popUpDataKeluarga.center().open();
                var actions = $scope.popUpDataKeluarga.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpDataKeluarga.setOptions({ actions: actions });
            }

            $scope.createJabatanNew = function() {
                $scope.item.norecJab = "";
                $scope.item.nomorId = undefined;
                $scope.popUpRiwayatJabatan.center().open();
                var actions = $scope.popUpRiwayatJabatan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatJabatan.setOptions({ actions: actions });
            }

            $scope.createSip = function() {
                $scope.item.norecSip = "";
                $scope.item.nomorId = undefined;
                $scope.popUpSip.center().open();
                var actions = $scope.popUpSip.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpSip.setOptions({ actions: actions });
            }

            $scope.createStr = function() {
                $scope.item.norecStr = "";
                $scope.item.nomorId = undefined;
                $scope.popUpStr.center().open();
                var actions = $scope.popUpStr.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpStr.setOptions({ actions: actions });
            }

            $scope.batalDataKeluarga = function() {
                ClearDataKeluarga();
                $scope.popUpDataKeluarga.close();
            }

            $scope.batalRiwayatPendidikan = function() {
                ClearDataRiwayatPendidikan();
                $scope.popUpRiwayatPendidikan.close();
            }

            $scope.batalRiwayatPelatihan = function() {
                ClearDataRiwayatPelatihan();
                $scope.popUpRiwayatPelatihan.close();
            }

            $scope.batalRiwayatJabatan = function() {
                ClearDataRiwayatJabatan();
                $scope.popUpRiwayatJabatan.close();
            }

            $scope.batalSip = function() {
                ClearDataSip();
                document.getElementById("coba").reset();
                $scope.popUpSip.close();
            }

            $scope.batalStr = function() {
                ClearDataStr();
                document.getElementById("coba2").reset();
                $scope.popUpStr.close();
            }

            $scope.tambahDataKeluarga = function() {
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

                                dataKeluarga[i] = data;
                                $scope.gridKeluarga = new kendo.data.DataSource({
                                    data: dataKeluarga
                                });
                            }
                        }

                    } else {

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

            $scope.tambahRiwayatPendidikan = function() {
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

                var ipk = 0;
                if ($scope.itemPendidikan.ipk != undefined) {
                    ipk = $scope.itemPendidikan.ipk;
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
                                data.tglmasuk = $scope.itemPendidikan.tglMasukPend != undefined ? moment($scope.itemPendidikan.tglMasukPend).format('YYYY-MM-DD HH:mm') : null,
                                    data.tgllulus = $scope.itemPendidikan.tglLulus != undefined ? moment($scope.itemPendidikan.tglLulus).format('YYYY-MM-DD HH:mm') : null,
                                    data.nilaiipk = ipk
                                data.jurusan = jurusan
                                data.noijazah = noIjasah
                                data.tglijazah = tglIjasah
                                data.norec = $scope.item.norecPend

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

            $scope.cetak = function() {
                var idpegawai = $scope.item.idPegawai;
                var namabendahara = $scope.item.namabendahara;
                var npwpbendahara = "";
                if ($scope.item.npwpbendahara == null || $scope.item.npwpbendahara == "" || $scope.item.npwpbendahara == undefined) {
                    npwpbendahara = "";
                } else {
                    npwpbendahara = $scope.item.npwpbendahara;
                }

                var nipnrpbendahara = $scope.item.nipnrpbendahara;
                var tahunpajak = $scope.item.tahunPajak;
                var data = {
                    "gambarLogo": "kemenkue.jpg",
                    "gambarTtd": "ttdbupuji.jpg",
                    "paramKey": ["gambarTtd", "namaRS", "kemenkeu", "idpegawai", "namabendahara", "npwpbendahara", "nipnrpbendahara", "tahunpajak"],
                    "paramValue": ["ttdbupuji.jpg", "BUKTI PEMOTONGAN PAJAK PENGHASILAN PASA 21 BAGI PEGAWAI NEGARI SIPIL ATAU ANGGOTA TENTARA NASIONAL INDONESIA ATAU ANGGOTA POLISI REPUBLIK INDONESIA ATAU PEJABAT NEGARA ATAU PENSIUNANNYA", "KEMENTRIAN KEUANGAN RI DIREKTORAT JENDRAL PAJAK", idpegawai, namabendahara, npwpbendahara, nipnrpbendahara, tahunpajak],
                    "paramType": ["", "", "", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('192.168.1.116') > -1) {
                    xhr.open('POST', 'http://192.168.1.116:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/pemotonganpajak.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/pemotonganpajak.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
            }

            $scope.tambahRiwayatPelatihan = function() {
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
                            norec: $scope.item.norecPel
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

            $scope.tambahRiwayatJabatan = function() {
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
                    if ($scope.gridRiwayatJabatan == undefined) {
                        nomorId = 1
                    } else {
                        nomorId = dataRiwayatPendidikan.length + 1
                    }
                    var data = {};
                    if ($scope.item.nomorId != undefined) {
                        for (var i = gridRiwayatJabatan.length - 1; i >= 0; i--) {
                            if (gridRiwayatJabatan[i].no == $scope.item.nomorId) {

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

            $scope.tambahSip = function() {
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

            $scope.tambahStr = function() {
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

            $scope.ceklispilihManual = function(bool) {
                if (bool) {
                    $scope.model.kodeop = true
                } else {
                    $scope.model.kodeop = false
                }
            }
            $scope.ceklispilihManual1 = function(bool) {
                if (bool) {
                    $scope.model.kodeop1 = true
                    $scope.model.kodeop = false
                } else {
                    $scope.model.kodeop1 = false
                }
            }
            $scope.ceklispilihManualpt = function(bool) {
                if (bool) {
                    $scope.model.pegawaitersebut = true
                    $scope.model.pegawaitersebut1 = false
                    $scope.model.pegawaitersebut2 = false
                    $scope.model.pegawaitersebut3 = false
                    $scope.model.pegawaitersebut4 = false
                } else {
                    $scope.model.pegawaitersebut = false
                }
            }
            $scope.ceklispilihManualpt1 = function(bool) {
                if (bool) {
                    $scope.model.pegawaitersebut1 = true
                    $scope.model.pegawaitersebut = false
                    $scope.model.pegawaitersebut2 = false
                    $scope.model.pegawaitersebut3 = false
                    $scope.model.pegawaitersebut4 = false
                } else {
                    $scope.model.pegawaitersebut1 = false
                }
            }
            $scope.ceklispilihManualpt2 = function(bool) {
                if (bool) {
                    $scope.model.pegawaitersebut2 = true
                    $scope.model.pegawaitersebut = false
                    $scope.model.pegawaitersebut1 = false
                    $scope.model.pegawaitersebut3 = false
                    $scope.model.pegawaitersebut4 = false
                } else {
                    $scope.model.pegawaitersebut2 = false
                }
            }
            $scope.ceklispilihManualpt3 = function(bool) {
                if (bool) {
                    $scope.model.pegawaitersebut3 = true
                    $scope.model.pegawaitersebut = false
                    $scope.model.pegawaitersebut1 = false
                    $scope.model.pegawaitersebut2 = false
                    $scope.model.pegawaitersebut4 = false
                } else {
                    $scope.model.pegawaitersebut3 = false
                }
            }
            $scope.ceklispilihManualpt4 = function(bool) {
                if (bool) {
                    $scope.model.pegawaitersebut4 = true
                    $scope.model.pegawaitersebut3 = false
                    $scope.model.pegawaitersebut = false
                    $scope.model.pegawaitersebut1 = false
                    $scope.model.pegawaitersebut2 = false
                } else {
                    $scope.model.pegawaitersebut4 = false
                }
            }

            $scope.simpan = function() {
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

                // if($scope.model == null || $scope.model == null){
                // 	$scope.item.pegawaitersebut = "-";
                // }
                if ($scope.model.pegawaitersebut == true) {
                    $scope.item.pegawaitersebut = "Dipindahkan";
                } else if ($scope.model.pegawaitersebut1 == true) {
                    $scope.item.pegawaitersebut = "Pindahan";
                } else if ($scope.model.pegawaitersebut2 == true) {
                    $scope.item.pegawaitersebut = "Baru";
                } else if ($scope.model.pegawaitersebut3 == true) {
                    $scope.item.pegawaitersebut = "Pensiun";
                } else if ($scope.model.pegawaitersebut4 == true) {
                    $scope.item.pegawaitersebut = "-";
                }

                if ($scope.model.kodeop == true) {
                    $scope.item.kodeop = "21-100-01";
                } else if ($scope.model.kodeop1 == true) {
                    $scope.item.kodeop = "21-100-02";
                }

                // kodeop: $scope.item.kodeop,
                // pegawaitersebut: $scope.item.pegawaitersebut,

                var id = ""
                if ($scope.item.idPegawai != undefined) {
                    id = $scope.item.idPegawai
                }

                // var nipPns = "-";
                // if ($scope.item.nipPns != undefined) {
                // 	nipPns = $scope.item.nipPns
                // }

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

                var Noidentitas = "-";
                if ($scope.item.noidentitas != undefined) {
                    Noidentitas = $scope.item.noidentitas;
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
                var Salary = "-"
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

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {

                    // if ($scope.item.idPegawai == "" && $scope.itemLogin.kelompokUser == undefined) {
                    // 	toastr.error('Kelompok User Tidak Boleh Kosong')
                    // 	return;
                    // }

                    dataPemotonganPajak = {
                        // Data Pemotongan Pajak
                        ptpid: $scope.item.ptpid,
                        gpp: $scope.item.gpp,
                        ti: $scope.item.ti,
                        ta: $scope.item.ta,
                        jgtk: $scope.item.jgtk,
                        tpp: $scope.item.tpp,
                        tsf: $scope.item.tsf,
                        tb: $scope.item.tb,
                        tk: $scope.item.tk,
                        tll: $scope.item.tll,
                        pttlyptdpg: $scope.item.pttlyptdpg,
                        jpb: $scope.item.jpb,
                        bjbp: $scope.item.bjbp,
                        ipai: $scope.item.ipai,
                        jp: $scope.item.jp,
                        jpn: $scope.item.jpn,
                        jpnms: $scope.item.jpnms,
                        jpnuppp: $scope.item.jpnuppp,
                        ptkp: $scope.item.ptkp,
                        pkpsd: $scope.item.pkpsd,
                        dpapkpsd: $scope.item.dpapkpsd,
                        ppytdms: $scope.item.ppytdms,
                        ppt: $scope.item.ppt,
                        ppytdd: $scope.item.ppytdd,
                        agt: $scope.item.agt,
                        apttlyptdpg: $scope.item.apttlyptdpg,
                        ppapkpsd: $scope.item.ppapkpsd,
                        nomorsurat: $scope.item.nomorsurat,
                        masapp: $scope.item.masapp,
                        nomor: $scope.item.nomor,
                        sk: $scope.item.sk,
                        skt: $scope.item.skt,
                        shb: $scope.item.shb,
                        kodeop: $scope.item.kodeop != undefined ? $scope.item.kodeop : null,
                        // kodeop: $scope.item.kodeop,
                        pegawaitersebut: $scope.item.pegawaitersebut != undefined ? $scope.item.pegawaitersebut : null,
                        // pegawai3: $scope.item.pegawai3 != undefined ?  $scope.item.pegawai3.id : null,
                        tglttd: moment($scope.item.ttd).format('DD-MM-YYYY'),
                        tahunpajak: $scope.item.tahunPajak,
                    }

                    dataPegawai = {
                        // Data Pegawai
                        id: id,
                        // nippns: nipPns,
                        nip: $scope.item.nip,
                        nrp: $scope.item.nrp,
                        // nomorsurat: $scope.item.nomorsurat,
                        // masapp: $scope.item.masapp,
                        // nomor: $scope.item.nomor,
                        // sk: $scope.item.sk,
                        // skt: $scope.item.skt,
                        // shb: $scope.item.shb,
                        // kodeop: $scope.item.kodeop,
                        // pegawaitersebut: $scope.item.pegawaitersebut,
                        // ttd: $scope.item.ttd,
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
                        noidentitas: Noidentitas,
                        agama: $scope.item.agama.id,
                        tglmeninggal: tglMeninggal,
                        unitkerjafk: $scope.item.unitKerja != undefined ? $scope.item.unitKerja.id : null,
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
                        pangkatpegawai: $scope.item.detailPangkatPegawai != undefined ? $scope.item.detailPangkatPegawai.id : null,
                        eselon: $scope.item.eselon != undefined ? $scope.item.eselon.id : null,
                        idfinger: idFinger, //$scope.item.idFinger,
                        shiftkerja: $scope.item.shiftKerja != undefined ? $scope.item.shiftKerja.id : null,
                        nilaijabatan: NilaiJabatan,
                        grade: Grade,
                        jenispegawai: $scope.item.JenisPegawai.id,
                        petugasdiklat: $scope.item.petugasdiklat.id != undefined ? $scope.item.petugasdiklat.id : null,
                        idruangan: $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null
                            // Data Status Pegawai
                    }

                    // var data ={};
                    // $scope.itemTelp.push($scope.item.provider1);
                    // $scope.itemTelp[0].nomor=$scope.item.nomor1;
                    // $scope.itemTelp.push($scope.item.provider2);
                    // $scope.itemTelp[1].nomor=$scope.item.nomor2;

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

                    objSave = {
                        datapegawai: dataPegawai,
                        datakeluarga: dataKeluarga,
                        datapemotonganpajak: dataPemotonganPajak,
                        riwayatpendidikan: dataRiwayatPendidikan,
                        riwayatpelatihan: dataRiwayatPelatihan,
                        riwayatjabatan: dataRiwayatJabatan,
                        // simpansip:dataSip,
                        // simpanstr:dataStr,
                        simpantelp: dataNoTelp,
                    }
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Apakah Anda Yakin Menyimpan Data?')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function() {
                        RealSave();
                    });
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.kembali = function() {
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

                medifirstService.post('sysadmin/menu/save-new-user', objSaveLogin).then(function(e) {

                    ClearDataUserLogin();
                    LoadCache();
                    // FormLoad();

                }, function(error) {
                    toastr.error(JSON.stringify(error.message), 'Error')
                });
            }

            function RealSave() {
                debugger
                var json = {
                    'nama': $scope.item.nama,
                    'noidentitas': $scope.item.noidentitas,
                    'idPegawai': $scope.item.idPegawai
                }
                medifirstService.post('sdm/save-rekam-data-pajak-penghasilan', objSave).then(function(e) {
                    if (e.status === 201) {
                        medifirstService.post('tatarekening/save-log-pemotongan-pajak', json).then(function(e) {})
                    }
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

            $scope.batal = function() {
                $scope.showEdit = false;
                $scope.item = {};
            }

            $scope.simpanSipNew = function() {
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

                var nR = ""
                if ($scope.itemSip.norec != undefined) {
                    nR = $scope.itemSip.norec
                }

                var tglSipAkhir = moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD 00:00')

                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "nomorSurat": $scope.itemSip.noSip,
                    "tglBerakhir": tglSipAkhir,
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
                formData.append('file', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('nomorSurat', objSave.nomorSurat)
                formData.append('tglBerakhir', objSave.tglBerakhir)
                formData.append('jenismasaberlakufk', objSave.jenismasaberlakufk)
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

            $scope.simpanStrNew = function() {
                // if ($scope.item.idPegawai == "" || $scope.item.idPegawai == undefined) {
                // 	toastr.error('Id Tidak Boleh Kosong')
                // 	return;
                // }
                if ($scope.itemStr.noStr == "" || $scope.itemStr.noStr == undefined) {
                    toastr.error('Nomor STR Tidak Boleh Kosong')
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

                var objSave = {
                    "norec": nR,
                    "idPegawai": $scope.item.idPegawai,
                    "nomorSurat": $scope.itemStr.noStr,
                    "tglBerakhir": tglStrAkhir,
                    "jenismasaberlakufk": 2,
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
                formData.append('file', file)
                formData.append('norec', objSave.norec)
                formData.append('idPegawai', objSave.idPegawai)
                formData.append('nomorSurat', objSave.nomorSurat)
                formData.append('tglBerakhir', objSave.tglBerakhir)
                formData.append('jenismasaberlakufk', objSave.jenismasaberlakufk)
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

            $scope.loadDataSip = function() {
                medifirstService.get("sdm/get-data-sip").then(function(res) {
                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridSip = new kendo.data.DataSource({
                        data: datas
                    });
                }, (err) => {

                });
            }
            $scope.loadDataStr = function() {
                medifirstService.get("sdm/get-data-str").then(function(res) {
                    var datas = res.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.gridStr = new kendo.data.DataSource({
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

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function(e) {
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

                medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function(e) {
                    if (e.status === 201) {
                        $scope.loadDataStr();
                    }
                })
            }

            function downloadSipStr(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                medifirstService.get('sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload).then(function(data) {
                    window.open(baseTransaksi + 'sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload);
                    // var url=baseTransaksi+data;
                    // downloadURI(url);
                })
            }

            $scope.$watch('item.tglMasuk', function(newValue, oldValue) {
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

            $scope.$watch('item.tglkeluar', function(newValue, oldValue) {
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

            $scope.$watch('item.tglPensiun', function(newValue, oldValue) {
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

            //* BATAS SUCI *//			
        }
    ]);
});