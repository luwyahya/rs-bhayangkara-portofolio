// const { forEach } = require("underscore");

define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('KlaimInaCbgV2Ctrl', ['$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, DateHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.model = {};
            $scope.itemPA = {};
            $scope.emrIgd = {};
            $scope.itemdok = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.dataSelected2 = {};
            $scope.dataSelected = {};
            $scope.istempatLaporan = true;
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.isRouteLoading = false;
            $scope.item.norec_apd = '';
            $scope.item.norec_pp = '';
            $scope.item.umurDay = '';
            $scope.item.jmlRows = 50
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0
            $scope.cboGrouping = true;
            $scope.gridRoom = true;
            $scope.gridLab = false;
            $scope.gridResep = false;
            $scope.gridRad = false;
            $scope.showLab = false;
            $scope.showRad = false;
            $scope.showLabAna = false;
            $scope.labAna = '';
            $scope.lab = '';
            $scope.rad = '';
            $scope.isCPT = false;
            $scope.isCPPT = false;
            $scope.isEMRIGD = false;
            $scope.dataSelected = {};
            $scope.dataSelected1 = {};
            $scope.isPeriodeCari = false;
            $scope.item.tglMeninggal = $scope.now;
            $scope.item.tglKeluar = $scope.now;
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm", //set drop down time format to 24 hours
            };
            var dataTea = '';
            var dataTea2 = '';
            var datalab = []
            var objectruanganfkp
            var datalabstat = []
            var popc = true;
            var data2 = []
            var dataSave = []
            var dataSEPCMG = []
            var datalabs = []
            var dataRow = {}
            var umurDay = '';
            var tglpelayanan = ''
            var norecAPD = ''
            var norecPP = ''
            var tglhasil = ''
            var tglcetak = ''
            var ruangan = ''
            var ruanganasal = ''
            var dokterpemeriksa = ''
            var dokterpengirim = ''
            var responData = ''
            var tglregistrasidiagnosa = ''
            $scope.show_btn = true
            $scope.statusSelesaiPeriksaPd = false
            $scope.statusSelesaiPeriksaPp = false
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.statusSelesaiPeriksa = false
            medifirstService.get("registrasi/get-combo-riwayat-regis", false).then(function (data) {
                $scope.listDepartemen = data.data.deptrirj;
                if ($state.params.noregistrasi == '-')
                    $scope.item.departement = { id: $scope.listDepartemen[0].id, namadepartemen: $scope.listDepartemen[0].namadepartemen }
                $scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
                $scope.sourceJenisDiagnosisPrimer1 = data.data.jenisdiagnosa;
            })
            loadCombo();
            // loadClaimPd();
            function loadClaimPd() {
                medifirstService.get("registrasi/daftar-registrasi/get-status-claim-pd?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (claimpd) {
                    $scope.statusSelesaiPeriksaPd = claimpd.data.isclaim;
                });
                debugger
            }
            $scope.onTabChanges = function (value) {
                // if (value === 0) {
                //     $scope.SearchData();
                // }
            };

            function loadClaimPp(norec_pp) {
                medifirstService.get("registrasi/daftar-registrasi/get-status-claim-pp?norec_pp=" + norec_pp).then(function (claimpp) {
                    $scope.statusSelesaiPeriksaPp = claimpp.data.isclaim;
                });
                debugger
            }
            $scope.loadClaimPpLuar = function (dataItem) {
                // function loadClaimPpLuar(dataItem) {
                // var noregistrasi = dataItem.noregistrasi
                var norec_pp = dataItem.norec_pp;
                var noregistrasifk = dataItem.noregistrasifk;
                var objectruanganfk = dataItem.objectruanganfk;
                var claimstat
                if (dataItem.claim == "UnClaim") {
                    claimstat = false
                } else {
                    claimstat = true
                }
                // var norec_ppc = ''
                // norec_ppc = $scope.item.norec_pp
                var json = {
                    'norec': norec_pp,
                    'claim': claimstat
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-claim-pp', json).then(function (e) {
                    if (e.status === 201) {
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                        // 	})
                        // loadClaimPp(norec_ppc)
                        medifirstService.get("registrasi/daftar-registrasi/get-status-claim-pp?norec_pp=" + norec_pp).then(function (claimpp) {
                            $scope.statusSelesaiPeriksaPp = claimpp.data.isclaim;
                            loadClaimGridPp(noregistrasifk, objectruanganfk);
                        });
                    }
                })
                debugger
            }

            function loadClaimGridPp(noregistrasifk, objectruanganfk) {
                medifirstService.get("radiologi/get-lab-inacbg-grid-claim?noregistrasifk=" + noregistrasifk + "&objectruanganfk=" + objectruanganfk, true).then(function (dat) {
                    debugger
                    // if (dat.data.data.length > 0) {
                    // }
                    datalabstat = dat.data.data;
                    popUps();

                    // $scope.dataGrid = {
                    // 	data: dat.data.data,
                    // 	_data: dat.data.data,
                    // 	// pageSize: 10,
                    // 	selectable: true,
                    // 	refresh: true,
                    // 	total: dat.data.data.length,
                    // 	serverPaging: false,
                    // 	aggregate: [
                    // 		{ field: 'total', aggregate: 'sum' },
                    // 	]
                    // };
                });
            }

            function popUps(datalab) {
                // var datafin = []
                // datalab.forEach()
                if (datalab != undefined || datalab != null) {
                    debugger
                    datalabs = datalab
                }
                if (datalabs.length != 0) {
                    for (var i = 0; i < datalabs.length; i++) {
                        datalabs[i].claim = datalabstat[i].claim;
                        datalabs[i].rm = datalabstat[i].rm;
                        // datalabs[i].splice(0, 1, datalabstat[i])
                    }
                    // $scope.dataGrid = {
                    // 	data: datalabs,
                    // 	_data: datalabs,
                    // 	// pageSize: 10,
                    // 	selectable: true,
                    // 	refresh: true,
                    // 	total: datalabs.length,
                    // 	serverPaging: false,
                    // 	aggregate: [
                    // 		{ field: 'total', aggregate: 'sum' },
                    // 	]
                    // };
                    if (popc == true) {
                        if (datalabs[0].objectruanganfk == 576 || datalabs[0].objectruanganfk == 453) {
                            $scope.dataGridRadio = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            // $scope.popUpPelayananRadio.center().open();
                            popc == false;
                        } else if (datalabs[0].objectruanganfk == 575) {
                            $scope.dataGrid = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            // $scope.popUpPelayanan.center().open();
                            popc == false;
                        }
                    }
                }
            }


            function loadCombo() {
                $scope.item.tahun = $scope.now.getFullYear();
                var bulanNow = $scope.now.getMonth();
                $scope.listbulan = [
                    { id: 0, mm: '01', name: 'Januari' },
                    { id: 1, mm: '02', name: 'Februari' },
                    { id: 2, mm: '03', name: 'Maret' },
                    { id: 3, mm: '04', name: 'April' },
                    { id: 4, mm: '05', name: 'Mei' },
                    { id: 5, mm: '06', name: 'Juni' },
                    { id: 6, mm: '07', name: 'Juli' },
                    { id: 7, mm: '08', name: 'Agustus' },
                    { id: 8, mm: '09', name: 'September' },
                    { id: 9, mm: '10', name: 'Oktober' },
                    { id: 10, mm: '11', name: 'November' },
                    { id: 11, mm: '12', name: 'Desember' }
                ]

                $scope.listbulan.forEach(function (e) {
                    if (e.id == bulanNow) {
                        $scope.item.bulan = {
                            id: e.id,
                            mm: e.mm,
                            name: e.name
                        }
                    }
                })
                var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    // $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    // $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                    $scope.item.tglpulang = new Date(arrPeriode[2]);
                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59')); //$scope.now;
                    $scope.item.tglpulang = $scope.now;
                }
                medifirstService.get("bridging/inacbg/get-combo", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listdataJenisPasien = data.data.dataJenisPasien;
                    $scope.selectOptionsKelompok = {
                        placeholder: "Pilih Kelompok...",
                        dataTextField: "kelompokpasien",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,

                    };
                    var kelompok = []
                    for (let i = 0; i < $scope.listKelompokPasien.length; i++) {
                        const element = $scope.listKelompokPasien[i];
                        if (element.kelompokpasien.indexOf('BPJS') > -1)
                            kelompok.push(element)
                    }
                    $scope.item.kelompokpasien = kelompok
                    // $scope.item.kelompokpasien = {
                    // 	id: 2,
                    // 	kelompokpasien: "BPJS"
                    // }
                    $scope.listDokter = data.data.dokter;
                    $scope.listDokter2 = data.data.dokter;
                })
                // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }
            $scope.merge = function () {
                $scope.item.noRegTujuan = undefined
                $scope.item.noRegSalah = undefined
                $scope.popupMergePendaftaran.center().open();
            }
            $scope.mergePendafataran = function () {
                debugger;
                if ($scope.item.noRegTujuan == undefined || $scope.item.noRegTujuan == "") {
                    toastr.error('NoRegistrasi Tujuan Belum di ISI', 'Caution');
                    return;
                }
                if ($scope.item.noRegSalah == undefined || $scope.item.noRegSalah == "") {
                    toastr.error('NoRegistrasi Salah Belum di ISI', 'Caution');
                    return;
                }
                if ($scope.item.password != "donatelo") {
                    toastr.error("Password Salah!")
                    return;
                }
                var stt = 'false'
                if (confirm('Merge NoPendaftaran? Pastikan Data Merge Sudah Benar..!')) {
                    stt = 'true';
                    var objSave = {
                        noRegTujuan: $scope.item.noRegTujuan,
                        noRegSalah: $scope.item.noRegSalah
                        // catatanMerge:$scope.item.catatanMerge
                    }
                    medifirstService.post('registrasi/save-Merge', objSave).then(function (e) {

                        //ini untuk proposional kan utang per tindakan
                    })
                } else {
                    stt = 'false';
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            var onDataBound = function (e) {
                $('td').each(function () {
                    if ($(this).text() == 'false') { $(this).text('Belum di Coder') }
                    if ($(this).text() == 'Belum di Coder') { $(this).addClass('koneng') }
                    if ($(this).text() == 'BELUM') { $(this).text('Belum di Grouping') }
                    if ($(this).text() == 'Belum di Grouping') { $(this).addClass('koneng') }
                    if ($(this).text() == 'Edit') { $(this).addClass('koneng') }
                })
                // var columns = e.sender.columns;
                // var rows = e.sender.tbody.children();

                // for (var j = 0; j < rows.length; j++) {
                // 	// sisa sekarang
                // 	var row = $(rows[j]);
                // 	var dataItem = e.sender.dataItem(row);

                // 	var noverifikasi = dataItem.get("noverifikasi");

                // 	var cellSEP2 = row.children().eq(8);
                // 	cellSEP2.addClass(getNotifStruk( dataItem.get("nostruk")));

                // 	var cellSEP = row.children().eq(9);
                // 	cellSEP.addClass(getNotifSEP(noverifikasi));

                // }
            }

            function getNotifSEP(noverifikasi) {
                if (noverifikasi == null) {
                    return "red";
                }
                // if (noverifikasi != null) {
                // 	return "red";
                // }

            }

            function getNotifStruk(noverifikasi) {
                if (noverifikasi == null) {
                    return "red";
                }
                // if (noverifikasi != null) {
                // 	return "hejo";
                // }

            }

            $scope.columnDaftarPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRegistrasiPasien.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                dataBound: onDataBound,
                pageable: true,
                columns: [{
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "7%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "NoReg",
                    "width": "7%"
                },
                {
                    "field": "nocm",
                    "title": "NoRM",
                    "width": "7%",
                    "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "20%",
                    "template": "<span class='style-left'>#: namapasien #</span>"
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "150px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                {
                    "field": "namadokter",
                    "title": "Nama Dokter",
                    "width": "15%",
                    "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                },
                // {
                // 	"field": "kelompokpasien",
                // 	"title": "Kelompok Pasien",
                // 	"width":"100px",
                // 	"template": "<span class='style-left'>#: kelompokpasien #</span>"
                // },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "10%",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                },
                // {
                // 	"field": "statuspasien",
                // 	"title": "Status",
                // 	"width":"80px",
                // 	"template": "<span class='style-center'>#: statuspasien #</span>"
                // },
                // {
                // 	"field": "nostruk",
                // 	"title": "NoStrukVerif",
                // 	"width":"100px",
                // 	"template": '# if( nostruk==null) {# - # } else {# #= nostruk # #} #'
                // },
                // {
                // 	"field": "nosbm",
                // 	"title": "NoSBM",
                // 	"width":"100px",
                // 	"template": '# if( nosbm==null) {# - # } else {# #= nosbm # #} #'
                // },
                // {
                // 	"field": "kasir",
                // 	"title": "Kasir",
                // 	"width":"100px",
                // 	"template": '# if( kasir==null) {# - # } else {# #= kasir # #} #'
                // },
                {
                    "field": "nosep",
                    "title": "No SEP",
                    "width": "25%",
                    // "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setSep(dataItem)\"  style=\"margin:0 0 5px\">#:  nosep #</button> ",
                },

                {
                    "field": "namakelas",
                    "title": "Kelas Dijamin",
                    "width": "9%",
                    "template": '# if( namakelas==null) {# - # } else {# #= namakelas # #} #'
                },
                {
                    "field": "namakelasdaftar",
                    "title": "Kelas Terakhir",
                    "width": "10%"
                },
                {
                    "field": "icd10",
                    "title": "Diagnosa Utama dan Sekunder",
                    "width": "10%"
                },
                {
                    "field": "tarif_rs.billing",
                    "title": "Total Tarif RS",
                    "width": "10%",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: tarif_rs.billing #', '')}}</span>"
                },
                {
                    "field": "totalpiutangpenjamin",
                    "title": "Total Grouping",
                    "width": "10%",
                    "template": "<span class='style-right'>Rp {{formatRupiah('#: totalpiutangpenjamin #', '')}}</span>"
                },
                {
                    "field": "statusgrouping",
                    "title": "Status Grouping",
                    "width": "10%"
                }, {
                    "field": " jenispasien",
                    "title": "Kondisi Khusus",
                    "width": "10%"
                },
                    // {
                    // 	"field": "nostruk",
                    // 	"title": "Verif Kasir",
                    // 	"width": "10%"
                    // },
                    // {
                    // 	"field": "noverifikasi",
                    // 	"title": "Verif Piutang",
                    // 	"width": "10%"
                    // },
                    // {
                    // 	"field": "claim",
                    // 	"title": "Claim",
                    // 	"width": "10%",
                    // 	attributes: {
                    // 		class: "#=isclaim == 'ReView' ? 'green' : 'red' #"
                    // 	},
                    // 	"template": "<button class=\"k-button custom-button\" ng-click=\"reView(dataItem)\" style=\"margin:0 0 5px\">#: isclaim #</button>",
                    // // 	attributes: {
                    // // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    // //    },
                    // }
                ]
            };

            $scope.reView = function (dataItem) {
                debugger
                if (dataItem.isclaim == 'ReView') {
                    $scope.popUpReView.center().open();
                } else {
                    messageContainer.error('Pasien belum Claim')
                }
            }

            $scope.dbklik = function (data) {
                $scope.popupDetail.center().open();
                $scope.item.beratBadan = data.beratbadan
                var jenis_rawat = 1 //ranap
                if (data.deptid != 16) {
                    jenis_rawat = 2
                }
                var upgrade_class_ind = 0
                var upgrade_class_class = ''
                var add_payment_pct = 0
                if (data.nokelasdijamin != data.nokelasdaftar) {
                    upgrade_class_ind = 1
                    upgrade_class_class = data.namakelas
                    add_payment_pct = 0
                }
                var discharge_status = 0
                if (data.objectstatuspulangfk == 1 || data.objectstatuspulangfk == 6 || data.objectstatuspulangfk == 13) {
                    discharge_status = 1
                } else if (data.objectstatuspulangfk == 4 || data.objectstatuspulangfk == 5 || data.objectstatuspulangfk == 10 ||
                    data.objectstatuspulangfk == 11 || data.objectstatuspulangfk == 7 || data.objectstatuspulangfk == 16) {
                    discharge_status = 2
                } else if (data.objectstatuspulangfk == 2 || data.objectstatuspulangfk == 8 || data.objectstatuspulangfk == 3 ||
                    data.objectstatuspulangfk == 12) {
                    discharge_status = 3
                } else if (data.objectstatuspulangfk == 9 || data.objectstatuspulangfk == 18) {
                    discharge_status = 4
                } else {
                    discharge_status = 5
                }


                $scope.item.detail =
                    'nomor_sep = ' + data.nosep + '\n' +
                    'nomor_kartu = ' + data.nokepesertaan + '\n' +
                    'tgl_masuk = ' + data.tglregistrasi + '\n' +
                    'tgl_pulang = ' + data.tglpulang + '\n' +
                    'jenis_rawat = ' + jenis_rawat + '\n' +
                    'kelas_rawat = ' + data.nokelasdaftar + '\n' +
                    'adl_sub_acute = null \n' +
                    'adl_chronic = null \n' +
                    'icu_indikator = null \n' +
                    'icu_los = null \n' +
                    'ventilator_hour = null \n' +
                    'upgrade_class_ind = ' + upgrade_class_ind + '\n' +
                    'upgrade_class_class = ' + upgrade_class_class + '\n' +
                    'upgrade_class_los = ' + null + '\n' +
                    'add_payment_pct = ' + add_payment_pct + '\n' +
                    'birth_weight = ' + 0 + '\n' +
                    'discharge_status = ' + discharge_status + '\n' +
                    'diagnosa = ' + data.icd10 + '\n' +
                    'procedure = ' + data.icd9 + '\n' +
                    'tarif_rs = ' + data.tarif_rs + '\n' + +
                    'tarif_poli_eks = ' + 0 + "\n" +
                    'nama_dokter = ' + data.namadokter + "\n" +
                    'kode_tarif = ' + data.kodetarif + "\n" +
                    'payor_id = ' + '3' + "\n" +
                    'payor_cd = ' + 'JKN' + "\n" +
                    'cob_cd = ' + '#' + "\n" +
                    'coder_nik = ' + data.codernik

                $scope.listTarifRS = [
                    { namatarif: 'Prosedur Non Bedah', tarif: data.tarif_rs.prosedur_non_bedah, tarifx: $scope.formatRupiah(data.tarif_rs.prosedur_non_bedah, 'Rp. ') },
                    { namatarif: 'Tenaga Ahli', tarif: data.tarif_rs.tenaga_ahli, tarifx: $scope.formatRupiah(data.tarif_rs.tenaga_ahli, 'Rp. ') },
                    { namatarif: 'Radiologi', tarif: data.tarif_rs.radiologi, tarifx: $scope.formatRupiah(data.tarif_rs.radiologi, 'Rp. ') },
                    { namatarif: 'Rehabilitasi', tarif: data.tarif_rs.rehabilitasi, tarifx: $scope.formatRupiah(data.tarif_rs.rehabilitasi, 'Rp. ') },
                    { namatarif: 'Obat', tarif: data.tarif_rs.obat, tarifx: $scope.formatRupiah(data.tarif_rs.obat, 'Rp. ') },
                    { namatarif: 'Alkes', tarif: data.tarif_rs.alkes, tarifx: $scope.formatRupiah(data.tarif_rs.alkes, 'Rp. ') },
                    { namatarif: 'Prosedur Bedah', tarif: data.tarif_rs.prosedur_bedah, tarifx: $scope.formatRupiah(data.tarif_rs.prosedur_bedah, 'Rp. ') },
                    { namatarif: 'Keperawatan', tarif: data.tarif_rs.keperawatan, tarifx: $scope.formatRupiah(data.tarif_rs.keperawatan, 'Rp. ') },
                    { namatarif: 'Laboratorium', tarif: data.tarif_rs.laboratorium, tarifx: $scope.formatRupiah(data.tarif_rs.laboratorium, 'Rp. ') },
                    { namatarif: 'Kamar/Akomodasi', tarif: data.tarif_rs.kamar, tarifx: $scope.formatRupiah(data.tarif_rs.kamar, 'Rp. ') },
                    { namatarif: 'Prosedur Non Bedah', tarif: data.tarif_rs.obat_kronis, tarifx: $scope.formatRupiah(data.tarif_rs.obat_kronis, 'Rp. ') },
                    { namatarif: 'BMHP', tarif: data.tarif_rs.bmhp, tarifx: $scope.formatRupiah(data.tarif_rs.bmhp, 'Rp. ') },
                    { namatarif: 'Konsultasi', tarif: data.tarif_rs.konsultasi, tarifx: $scope.formatRupiah(data.tarif_rs.konsultasi, 'Rp. ') },
                    { namatarif: 'Penunjang', tarif: data.tarif_rs.penunjang, tarifx: $scope.formatRupiah(data.tarif_rs.penunjang, 'Rp. ') },
                    { namatarif: 'Pelayanan Darah', tarif: data.tarif_rs.pelayanan_darah, tarifx: $scope.formatRupiah(data.tarif_rs.pelayanan_darah, 'Rp. ') },
                    { namatarif: 'Rawat Intensif', tarif: data.tarif_rs.rawat_intensif, tarifx: $scope.formatRupiah(data.tarif_rs.rawat_intensif, 'Rp. ') },
                    { namatarif: 'Obat Kemoterapi', tarif: data.tarif_rs.obat_kemoterapi, tarifx: $scope.formatRupiah(data.tarif_rs.obat_kemoterapi, 'Rp. ') },
                    { namatarif: 'Sewa Alat', tarif: data.tarif_rs.sewa_alat, tarifx: $scope.formatRupiah(data.tarif_rs.sewa_alat, 'Rp. ') },
                ]
                $scope.totalTarifRS = 0
                for (var i = 0; i < $scope.listTarifRS.length; i++) {
                    $scope.totalTarifRS = parseFloat($scope.listTarifRS[i].tarif) + $scope.totalTarifRS
                }
                $scope.totalTarifRS = $scope.formatRupiah($scope.totalTarifRS, 'Rp. ')
                $scope.totalInacbg = $scope.formatRupiah(data.totalpiutangpenjamin, 'Rp. ')
                $scope.totalTarifNaikKelas = $scope.formatRupiah(data.biayanaikkelas, 'Rp. ')
                $scope.cbgcode = data.cbgcode
                $scope.cbgdescription = data.cbgdescription
            }
            $scope.tutup = function () {
                $scope.popupDetail.center().close();
            }


            $scope.SearchData = function () {
                loadData()
            }

            $scope.SearchDataNosep = function () {
                loadDataNosep()
            }

            $scope.calenderNgCLick = function () {
                if ($scope.isPeriodeCari == false)
                    $scope.isPeriodeCari = true
                else if ($scope.isPeriodeCari == true)
                    $scope.isPeriodeCari = false
            }

            function loadDataNosep() {
                $scope.isRouteLoading = true;


                var noSep = ""
                if ($scope.item.noSep != undefined) {
                    var noSep = "&noSep=" + $scope.item.noSep
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                var tglAwal = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-' + '01';
                var tglAkhir = $scope.item.tahun + '-' + $scope.item.bulan.mm + '-' + '31';
                if ($scope.item.noSep.length > 17) {
                    medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.item.noSep).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            noSep = "&noSep=" + $scope.item.noSep//e.data.response.peserta.noKartu
                            $q.all([
                                medifirstService.get("bridging/inacbg/get-daftar-pasien-inacbgV2?" +
                                    "tglAwal=" + tglAwal +
                                    "&tglAkhir=" + tglAkhir +
                                    noSep +
                                    '&jmlRows=' + jmlRows),
                            ]).then(function (data) {
                                $scope.isRouteLoading = false;
                                data2 = data[0].data;

                                //Transpose
                                dataSave = []
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    var tanggal = $scope.now;
                                    var tanggalLahir = new Date(data2[i].tgllahir);
                                    var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                                    data2[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                                    $scope.statusSelesaiPeriksa = data2[i].isclaim

                                    var jenis_rawat = 1 //ranap
                                    if (data2[i].deptid != 16) {
                                        jenis_rawat = 2
                                    }
                                    if (data2[i].statuskemo != 1) {
                                        jenis_rawat = 2
                                    }
                                    var upgrade_class_ind = 0
                                    var upgrade_class_class = ''
                                    var add_payment_pct = 0
                                    if (data2[i].nokelasdijamin != data2[i].nokelasdaftar) {
                                        upgrade_class_ind = 1
                                        upgrade_class_class = data2[i].namakelasdaftar
                                        add_payment_pct = 0
                                    }
                                    var discharge_status = 0
                                    var pemulasaraan_covid = 0
                                    if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6 || data2[i].objectstatuspulangfk == 13) {
                                        discharge_status = 1
                                    } else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
                                        data2[i].objectstatuspulangfk == 11 || data2[i].objectstatuspulangfk == 7 || data2[i].objectstatuspulangfk == 16) {
                                        discharge_status = 2
                                    } else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3 ||
                                        data2[i].objectstatuspulangfk == 12) {
                                        discharge_status = 3
                                    } else if (data2[i].objectstatuspulangfk == 9 || data2[i].objectstatuspulangfk == 18) {
                                        discharge_status = 4
                                        pemulasaraan_covid = 1
                                    } else {
                                        discharge_status = 5
                                    }
                                    if (jenis_rawat == 2) {
                                        data2[i].nokelasdijamin = ''
                                        data2[i].tglpulang = data2[i].tglregistrasi
                                    }
                                    var payor_id = '3'
                                    var payor_cd = 'JKN'
                                    if (data2[i].statuscovid == '1') {
                                        payor_id = '71'
                                        payor_cd = 'COVID-19'
                                    } else if (data2[i].idrekanan == '2552') {
                                        payor_id = '3'
                                        payor_cd = 'JKN'
                                    } else if (data2[i].idrekanan == '581164') {
                                        payor_id = '5'
                                        payor_cd = 'JAMKESDA'
                                        data2[i].nosep = data2[i].nokepesertaan
                                    }
                                    dataRow = {
                                        "nomor_sep": data2[i].nosep, //"0901R001TEST0001",    
                                        "nomor_kartu": data2[i].nokepesertaan, //"233333",    
                                        "tgl_masuk": data2[i].tglregistrasi, //"2017-11-20 12:55:00",    
                                        "tgl_pulang": data2[i].tglpulang, //"2017-12-01 09:55:00",    
                                        "jenis_rawat": jenis_rawat, //"1",    
                                        "kelas_rawat": data2[i].nokelasdijamin, //"1",    
                                        "adl_sub_acute": '', //"15",    
                                        "adl_chronic": '', //"12",    
                                        "icu_indikator": '', //"1",    
                                        "icu_los": '', //"2",    
                                        "ventilator_hour": '', //"5",    
                                        "upgrade_class_ind": "0", //upgrade_class_ind,    //"1",    
                                        "upgrade_class_class": upgrade_class_class, //"vip",    
                                        "upgrade_class_los": '', //"5",    
                                        "add_payment_pct": '', //"35",    
                                        "birth_weight": '', //"0",    
                                        "discharge_status": discharge_status, //"1",    
                                        "diagnosa": data2[i].icd10, //"S71.0#A00.1",    
                                        "procedure": data2[i].icd9, //"81.52#88.38",    
                                        "tarif_rs": {
                                            "prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah, //"300000",      
                                            "prosedur_bedah": data2[i].tarif_rs.prosedur_bedah, //"20000000",      
                                            "konsultasi": data2[i].tarif_rs.konsultasi, //"300000",      
                                            "tenaga_ahli": data2[i].tarif_rs.tenaga_ahli, //"200000",      
                                            "keperawatan": data2[i].tarif_rs.keperawatan, // "80000",      
                                            "penunjang": data2[i].tarif_rs.penunjang, //"1000000",      
                                            "radiologi": data2[i].tarif_rs.radiologi, //"500000",      
                                            "laboratorium": data2[i].tarif_rs.laboratorium, //"600000",      
                                            "pelayanan_darah": data2[i].tarif_rs.pelayanan_darah, //"150000",      
                                            "rehabilitasi": data2[i].tarif_rs.rehabilitasi, //"100000",      
                                            "kamar": data2[i].tarif_rs.kamar, //"6000000",      
                                            "rawat_intensif": data2[i].tarif_rs.rawat_intensif, //"2500000",      
                                            "obat": data2[i].tarif_rs.obat, //"2000000",      
                                            "obat_kronis": data2[i].tarif_rs.obat_kronis, //"2000000",      
                                            "obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi, //"2000000",      
                                            "alkes": data2[i].tarif_rs.alkes, //"500000",      
                                            "bmhp": data2[i].tarif_rs.bmhp, //"400000",      
                                            "sewa_alat": data2[i].tarif_rs.sewa_alat, //"210000"    
                                        },
                                        "pemulasaraan_jenazah": pemulasaraan_covid,
                                        "kantong_jenazah": pemulasaraan_covid,
                                        "peti_jenazah": pemulasaraan_covid,
                                        "plastik_erat": pemulasaraan_covid,
                                        "desinfektan_jenazah": pemulasaraan_covid,
                                        "mobil_jenazah": pemulasaraan_covid,
                                        "desinfektan_mobil_jenazah": pemulasaraan_covid,
                                        "covid19_status_cd": data2[i].covid19_status_cd,
                                        "nomor_kartu_t": data2[i].noidentitas,
                                        "episodes": data2[i].loscovid,
                                        "covid19_cc_ind": data2[i].covid19_cc_ind,
                                        "tarif_poli_eks": 0,
                                        "nama_dokter": data2[i].namadokter,
                                        "kode_tarif": data2[i].kodetarif, //'RSAB',    //"AP",    
                                        "payor_id": payor_id,
                                        "payor_cd": payor_cd,
                                        "cob_cd": '#',
                                        "coder_nik": $scope.dataLogin.noIdentitas,
                                        "nomor_rm": data2[i].nocm,
                                        "nama_pasien": data2[i].namapasien,
                                        "tgl_lahir": data2[i].tgllahir,
                                        "gender": data2[i].objectjeniskelaminfk,
                                        "isclaim": data2[i].isclaim
                                    }
                                    dataSave.push(dataRow)
                                }
                                $scope.show_btn = true
                                for (var i = dataSave.length - 1; i >= 0; i--) {
                                    if (dataSave[i].nosep == '') {
                                        $scope.show_btn = false
                                        break;
                                    }
                                }
                                $scope.dataPasienSelected = data[0].data[0];
                                $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                                    data: data[0].data,
                                    pageSize: 10,
                                    total: data[0].data,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {}
                                        }
                                    }
                                });
                                // }) 
                                // }
                                //end //check data klaim


                                //end Transpose
                                var chacePeriode = tglAwal + "~" + tglAkhir;
                                cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
                            });
                        } else {
                            window.messageContainer.error(e.data.metaData.message + ' ' + e.data.metaData.code);
                        }
                        $scope.isLoadingSEP = false;
                    }, function (err) {
                        $scope.isLoadingSEP = false;
                    });
                } else {
                    $q.all([
                        medifirstService.get("bridging/inacbg/get-daftar-pasien-inacbgV2?" +
                            "tglAwal=" + tglAwal +
                            "&tglAkhir=" + tglAkhir +
                            noSep +
                            '&jmlRows=' + jmlRows),
                    ]).then(function (data) {
                        $scope.isRouteLoading = false;
                        data2 = data[0].data;

                        //Transpose
                        dataSave = []
                        for (var i = data2.length - 1; i >= 0; i--) {
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(data2[i].tgllahir);
                            var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                            data2[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            $scope.statusSelesaiPeriksa = data2[i].isclaim

                            var jenis_rawat = 1 //ranap
                            if (data2[i].deptid != 16) {
                                jenis_rawat = 2
                            }
                            if (data2[i].statuskemo != 1) {
                                jenis_rawat = 2
                            }
                            var upgrade_class_ind = 0
                            var upgrade_class_class = ''
                            var add_payment_pct = 0
                            if (data2[i].nokelasdijamin != data2[i].nokelasdaftar) {
                                upgrade_class_ind = 1
                                upgrade_class_class = data2[i].namakelasdaftar
                                add_payment_pct = 0
                            }
                            var discharge_status = 0
                            var pemulasaraan_covid = 0
                            if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6 || data2[i].objectstatuspulangfk == 13) {
                                discharge_status = 1
                            } else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
                                data2[i].objectstatuspulangfk == 11 || data2[i].objectstatuspulangfk == 7 || data2[i].objectstatuspulangfk == 16) {
                                discharge_status = 2
                            } else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3 ||
                                data2[i].objectstatuspulangfk == 12) {
                                discharge_status = 3
                            } else if (data2[i].objectstatuspulangfk == 9 || data2[i].objectstatuspulangfk == 18) {
                                discharge_status = 4
                                pemulasaraan_covid = 1
                            } else {
                                discharge_status = 5
                            }
                            if (jenis_rawat == 2) {
                                data2[i].nokelasdijamin = ''
                                data2[i].tglpulang = data2[i].tglregistrasi
                            }
                            var payor_id = '3'
                            var payor_cd = 'JKN'
                            if (data2[i].statuscovid == '1') {
                                payor_id = '71'
                                payor_cd = 'COVID-19'
                            } else if (data2[i].idrekanan == '2552') {
                                payor_id = '3'
                                payor_cd = 'JKN'
                            } else if (data2[i].idrekanan == '581164') {
                                payor_id = '5'
                                payor_cd = 'JAMKESDA'
                                data2[i].nosep = data2[i].nokepesertaan
                            }
                            dataRow = {
                                "nomor_sep": data2[i].nosep, //"0901R001TEST0001",    
                                "nomor_kartu": data2[i].nokepesertaan, //"233333",    
                                "tgl_masuk": data2[i].tglregistrasi, //"2017-11-20 12:55:00",    
                                "tgl_pulang": data2[i].tglpulang, //"2017-12-01 09:55:00",    
                                "jenis_rawat": jenis_rawat, //"1",    
                                "kelas_rawat": data2[i].nokelasdijamin, //"1",    
                                "adl_sub_acute": '', //"15",    
                                "adl_chronic": '', //"12",    
                                "icu_indikator": '', //"1",    
                                "icu_los": '', //"2",    
                                "ventilator_hour": '', //"5",    
                                "upgrade_class_ind": "0", //upgrade_class_ind,    //"1",    
                                "upgrade_class_class": upgrade_class_class, //"vip",    
                                "upgrade_class_los": '', //"5",    
                                "add_payment_pct": '', //"35",    
                                "birth_weight": '', //"0",    
                                "discharge_status": discharge_status, //"1",    
                                "diagnosa": data2[i].icd10, //"S71.0#A00.1",    
                                "procedure": data2[i].icd9, //"81.52#88.38",    
                                "tarif_rs": {
                                    "prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah, //"300000",      
                                    "prosedur_bedah": data2[i].tarif_rs.prosedur_bedah, //"20000000",      
                                    "konsultasi": data2[i].tarif_rs.konsultasi, //"300000",      
                                    "tenaga_ahli": data2[i].tarif_rs.tenaga_ahli, //"200000",      
                                    "keperawatan": data2[i].tarif_rs.keperawatan, // "80000",      
                                    "penunjang": data2[i].tarif_rs.penunjang, //"1000000",      
                                    "radiologi": data2[i].tarif_rs.radiologi, //"500000",      
                                    "laboratorium": data2[i].tarif_rs.laboratorium, //"600000",      
                                    "pelayanan_darah": data2[i].tarif_rs.pelayanan_darah, //"150000",      
                                    "rehabilitasi": data2[i].tarif_rs.rehabilitasi, //"100000",      
                                    "kamar": data2[i].tarif_rs.kamar, //"6000000",      
                                    "rawat_intensif": data2[i].tarif_rs.rawat_intensif, //"2500000",      
                                    "obat": data2[i].tarif_rs.obat, //"2000000",      
                                    "obat_kronis": data2[i].tarif_rs.obat_kronis, //"2000000",      
                                    "obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi, //"2000000",      
                                    "alkes": data2[i].tarif_rs.alkes, //"500000",      
                                    "bmhp": data2[i].tarif_rs.bmhp, //"400000",      
                                    "sewa_alat": data2[i].tarif_rs.sewa_alat, //"210000"    
                                },
                                "pemulasaraan_jenazah": pemulasaraan_covid,
                                "kantong_jenazah": pemulasaraan_covid,
                                "peti_jenazah": pemulasaraan_covid,
                                "plastik_erat": pemulasaraan_covid,
                                "desinfektan_jenazah": pemulasaraan_covid,
                                "mobil_jenazah": pemulasaraan_covid,
                                "desinfektan_mobil_jenazah": pemulasaraan_covid,
                                "covid19_status_cd": data2[i].covid19_status_cd,
                                "nomor_kartu_t": data2[i].noidentitas,
                                "episodes": data2[i].loscovid,
                                "covid19_cc_ind": data2[i].covid19_cc_ind,
                                "tarif_poli_eks": 0,
                                "nama_dokter": data2[i].namadokter,
                                "kode_tarif": data2[i].kodetarif, //'RSAB',    //"AP",    
                                "payor_id": payor_id,
                                "payor_cd": payor_cd,
                                "cob_cd": '#',
                                "coder_nik": $scope.dataLogin.noIdentitas,
                                "nomor_rm": data2[i].nocm,
                                "nama_pasien": data2[i].namapasien,
                                "tgl_lahir": data2[i].tgllahir,
                                "gender": data2[i].objectjeniskelaminfk,
                                "isclaim": data2[i].isclaim
                            }
                            dataSave.push(dataRow)
                        }
                        $scope.show_btn = true
                        for (var i = dataSave.length - 1; i >= 0; i--) {
                            if (dataSave[i].nosep == '') {
                                $scope.show_btn = false
                                break;
                            }
                        }
                        $scope.dataPasienSelected = data[0].data[0];
                        $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                            data: data[0].data,
                            pageSize: 10,
                            total: data[0].data,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                        // }) 
                        // }
                        //end //check data klaim


                        //end Transpose
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
                    });
                }
            };

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                // var kp = ""
                // if ($scope.item.kelompokpasien != undefined) {
                // 	var kp = "&kelId=" + $scope.item.kelompokpasien.id
                // }
                var kp = ""

                if ($scope.item.kelompokpasien != undefined && $scope.item.kelompokpasien.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.kelompokpasien.length - 1; i >= 0; i--) {
                        var c = $scope.item.kelompokpasien[i].id
                        b = "," + c
                        a = a + b
                    }
                    kp = a.slice(1, a.length)
                }
                if (kp != "") {
                    kp = "&kelId=" + kp
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                var grouping = "";
                if ($scope.model.cekpilihManual == true) {
                    grouping = "&grouping=" + true
                }
                $q.all([
                    medifirstService.get("bridging/inacbg/get-daftar-pasien-inacbg?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk +
                        '&jmlRows=' + jmlRows + grouping),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    data2 = data[0].data;

                    //Transpose
                    dataSave = []
                    for (var i = data2.length - 1; i >= 0; i--) {
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(data2[i].tgllahir);
                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                        data2[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        $scope.statusSelesaiPeriksa = data2[i].isclaim

                        var jenis_rawat = 1 //ranap
                        if (data2[i].deptid != 16) {
                            jenis_rawat = 2
                        }
                        if (data2[i].statuskemo != 1) {
                            jenis_rawat = 2
                        }
                        var upgrade_class_ind = 0
                        var upgrade_class_class = ''
                        var add_payment_pct = 0
                        if (data2[i].nokelasdijamin != data2[i].nokelasdaftar) {
                            upgrade_class_ind = 1
                            upgrade_class_class = data2[i].namakelasdaftar
                            add_payment_pct = 0
                        }
                        var discharge_status = 0
                        var pemulasaraan_covid = 0
                        if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6 || data2[i].objectstatuspulangfk == 13) {
                            discharge_status = 1
                        } else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
                            data2[i].objectstatuspulangfk == 11 || data2[i].objectstatuspulangfk == 7 || data2[i].objectstatuspulangfk == 16) {
                            discharge_status = 2
                        } else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3 ||
                            data2[i].objectstatuspulangfk == 12) {
                            discharge_status = 3
                        } else if (data2[i].objectstatuspulangfk == 9 || data2[i].objectstatuspulangfk == 18) {
                            discharge_status = 4
                            pemulasaraan_covid = 1
                        } else {
                            discharge_status = 5
                        }
                        if (jenis_rawat == 2) {
                            data2[i].nokelasdijamin = ''
                            data2[i].tglpulang = data2[i].tglregistrasi
                        }
                        var payor_id = '3'
                        var payor_cd = 'JKN'
                        if (data2[i].statuscovid == '1') {
                            payor_id = '71'
                            payor_cd = 'COVID-19'
                        } else if (data2[i].idrekanan == '2552') {
                            payor_id = '3'
                            payor_cd = 'JKN'
                        } else if (data2[i].idrekanan == '581164') {
                            payor_id = '5'
                            payor_cd = 'JAMKESDA'
                            data2[i].nosep = data2[i].nokepesertaan
                        }
                        dataRow = {
                            "nomor_sep": data2[i].nosep, //"0901R001TEST0001",    
                            "nomor_kartu": data2[i].nokepesertaan, //"233333",    
                            "tgl_masuk": data2[i].tglregistrasi, //"2017-11-20 12:55:00",    
                            "tgl_pulang": data2[i].tglpulang, //"2017-12-01 09:55:00",    
                            "jenis_rawat": jenis_rawat, //"1",    
                            "kelas_rawat": data2[i].nokelasdijamin, //"1",    
                            "adl_sub_acute": '', //"15",    
                            "adl_chronic": '', //"12",    
                            "icu_indikator": '', //"1",    
                            "icu_los": '', //"2",    
                            "ventilator_hour": '', //"5",    
                            "upgrade_class_ind": "0", //upgrade_class_ind,    //"1",    
                            "upgrade_class_class": upgrade_class_class, //"vip",    
                            "upgrade_class_los": '', //"5",    
                            "add_payment_pct": '', //"35",    
                            "birth_weight": '', //"0",    
                            "discharge_status": discharge_status, //"1",    
                            "diagnosa": data2[i].icd10, //"S71.0#A00.1",    
                            "procedure": data2[i].icd9, //"81.52#88.38",    
                            "tarif_rs": {
                                "prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah, //"300000",      
                                "prosedur_bedah": data2[i].tarif_rs.prosedur_bedah, //"20000000",      
                                "konsultasi": data2[i].tarif_rs.konsultasi, //"300000",      
                                "tenaga_ahli": data2[i].tarif_rs.tenaga_ahli, //"200000",      
                                "keperawatan": data2[i].tarif_rs.keperawatan, // "80000",      
                                "penunjang": data2[i].tarif_rs.penunjang, //"1000000",      
                                "radiologi": data2[i].tarif_rs.radiologi, //"500000",      
                                "laboratorium": data2[i].tarif_rs.laboratorium, //"600000",      
                                "pelayanan_darah": data2[i].tarif_rs.pelayanan_darah, //"150000",      
                                "rehabilitasi": data2[i].tarif_rs.rehabilitasi, //"100000",      
                                "kamar": data2[i].tarif_rs.kamar, //"6000000",      
                                "rawat_intensif": data2[i].tarif_rs.rawat_intensif, //"2500000",      
                                "obat": data2[i].tarif_rs.obat, //"2000000",      
                                "obat_kronis": data2[i].tarif_rs.obat_kronis, //"2000000",      
                                "obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi, //"2000000",      
                                "alkes": data2[i].tarif_rs.alkes, //"500000",      
                                "bmhp": data2[i].tarif_rs.bmhp, //"400000",      
                                "sewa_alat": data2[i].tarif_rs.sewa_alat, //"210000"    
                            },
                            "pemulasaraan_jenazah": pemulasaraan_covid,
                            "kantong_jenazah": pemulasaraan_covid,
                            "peti_jenazah": pemulasaraan_covid,
                            "plastik_erat": pemulasaraan_covid,
                            "desinfektan_jenazah": pemulasaraan_covid,
                            "mobil_jenazah": pemulasaraan_covid,
                            "desinfektan_mobil_jenazah": pemulasaraan_covid,
                            "covid19_status_cd": data2[i].covid19_status_cd,
                            "nomor_kartu_t": data2[i].noidentitas,
                            "episodes": data2[i].loscovid,
                            "covid19_cc_ind": data2[i].covid19_cc_ind,
                            "tarif_poli_eks": 0,
                            "nama_dokter": data2[i].namadokter,
                            "kode_tarif": data2[i].kodetarif, //'RSAB',    //"AP",    
                            "payor_id": payor_id,
                            "payor_cd": payor_cd,
                            "cob_cd": '#',
                            "coder_nik": $scope.dataLogin.id,
                            "nomor_rm": data2[i].nocm,
                            "nama_pasien": data2[i].namapasien,
                            "tgl_lahir": data2[i].tgllahir,
                            "gender": data2[i].objectjeniskelaminfk,
                            "isclaim": data2[i].isclaim
                        }
                        dataSave.push(dataRow)
                    }
                    $scope.show_btn = true
                    for (var i = dataSave.length - 1; i >= 0; i--) {
                        if (dataSave[i].nosep == '') {
                            $scope.show_btn = false
                            break;
                        }
                    }

                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                        data: data[0].data,
                        pageSize: 10,
                        total: data[0].data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    // }) 
                    // }
                    //end //check data klaim


                    //end Transpose
                    var chacePeriode = tglAwal + "~" + tglAkhir;
                    cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
                });

            };


            $scope.TutupPopUpPel = function () {
                $scope.popUpShow.center().close();
            }
            $scope.TutupPopUpPelayanan = function () {
                $scope.popUpPelayanan.center().close();
            }
            $scope.TutupPopUpPelayananRadio = function () {
                $scope.popUpPelayananRadio.center().close();
            }
            $scope.TutupPopUpDetail = function () {
                $scope.popUpDetailLab.center().close();
            }
            $scope.TutupPopUpResumeMedis = function () {
                $scope.popUpResumeMedis.center().close();
            }

            $scope.show = function () {
                $scope.gridRoom = true;
                $scope.gridLab = false;
                $scope.gridResep = false;
                $scope.gridRad = false;
                // $scope.statusSelesaiPeriksaPd = false
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }

                if ($scope.dataPasienSelected.cpt != '') {
                    $scope.isCPT = true;
                } else {
                    $scope.isCPT = false;
                }

                if ($scope.dataPasienSelected.cppt != '') {
                    $scope.isCPPT = true;
                } else {
                    $scope.isCPPT = false;
                }

                if ($scope.dataPasienSelected.emrigd != '') {
                    debugger
                    $scope.isEMRIGD = true;
                    $scope.emrIgd.nomorEMR = $scope.dataPasienSelected.emrigd;
                    medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + $scope.dataPasienSelected.emrigd + "&emrfk=515", true).then(function (dat) {
                        $scope.emrIgd = dat.data.data;
                    })
                } else {
                    $scope.isEMRIGD = false;
                }

                // medifirstService.get("registrasi/get-status-close/" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {

                var ruangan = "";


                medifirstService.get("registrasi/daftar-registrasi/get-hasil-lab-inacbg?noregistrasi=" +
                    $scope.dataPasienSelected.noregistrasi +
                    "&objectruanganlastfk=" + ruangan
                ).then(function (dat) {
                    debugger;
                    $scope.listRuanganApd = dat.data.ruangan;
                    const lab = $scope.listRuanganApd.filter(room => room.ruid == 575);
                    const rad = $scope.listRuanganApd.filter(room => room.ruid == 576);
                    const ana = $scope.listRuanganApd.filter(room => room.ruid == 453);
                    if (lab.length > 0) {
                        $scope.lab = lab[0];
                        $scope.showLab = true;
                    } else {
                        $scope.lab = '';
                        $scope.showLab = false;
                    }
                    if (rad.length > 0) {
                        $scope.rad = rad[0];
                        $scope.showRad = true;
                    } else {
                        $scope.rad = '';
                        $scope.showRad = false;
                    }
                    if (ana.length > 0) {
                        $scope.labAna = ana[0];
                        $scope.showLabAna = true;
                    } else {
                        $scope.labAna = '';
                        $scope.showLabAna = false;
                    }
                    $scope.item.ruanganAntrian = {
                        id: $scope.listRuanganApd[0].id,
                        namaruangan: $scope.listRuanganApd[0].namaruangan,
                        norec_apd: $scope.listRuanganApd[0].norec_apd,
                        objectdepartemenfk: $scope.listRuanganApd[0].objectdepartemenfk
                    }
                });


                // $scope.statusSelesaiPeriksa = $scope.dataPasienSelected.isclaim


                // medifirstService.get("registrasi/daftar-registrasi/get-status-claim-pd?noregistrasi=" + $scope.dataPasienSelected.noregistrasi, true).then(function (claimpd) {
                // 	$scope.statusSelesaiPeriksaPd = claimpd.data.isclaim;
                // });
                loadClaimPd()

                // function loadClaimPd() {
                // 	medifirstService.get("registrasi/daftar-registrasi/get-status-claim-pd?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (claimpd) {
                // 		$scope.statusSelesaiPeriksaPd = claimpd.isclaim;
                // 	});
                // }


                $scope.popUpShow.center().open();
                // });
            }
            // function loadClaimPd() {
            // 	medifirstService.get("registrasi/daftar-registrasi/get-status-claim-pd?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (claimpd) {
            // 		$scope.statusSelesaiPeriksaPd = claimpd.data.isclaim;
            // 	});
            // }
            $scope.columnGridRuangan = {
                columns: [
                    // {
                    //     "field": "namaruangan",
                    //     "title": "No",
                    //     "width": "30px",
                    // },
                    {
                        "field": "namaruangan",
                        "title": "namaruangan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"hasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaruangan #</button>",
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }

            $scope.columnGridResep = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                    "template": "<span class='style-center'>#: cekreseppulang #</span>"
                },
                {
                    "field": "",
                    "title": "",
                    "width": "90px",
                    "template": "<button  class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" >Cetak</button> ",

                }
            ];

            $scope.columnGridResepExist = [{
                "field": "no",
                "title": "No",
                "width": "20px",
            },
            {
                "field": "namaproduk",
                "title": "Nama Produk",
                "width": "100px",
            },

            ];
            $scope.verifikasigrid = function (dataPasienSelected) {

                debugger;
                $scope.isRouteLoading = true;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", dataPasienSelected.norec_resep],
                    "paramType": ["", "date", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/eresep.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/eresep.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }

            $scope.data2 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "15px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Deskripsi",
                        "width": "200px",
                    },
                    {
                        "field": "aturanpakai",
                        "title": "Aturan Pakai",
                        "width": "80px",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "80px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "40px",
                    },
                    {
                        "field": "kekuatan",
                        "title": "Kekuatan",
                        "width": "80px",
                    }

                    ]
                }
            };

            $scope.resepElektronik = function () {
                debugger

                $scope.gridRoom = false;
                $scope.gridLab = false;
                $scope.gridResep = true;
                $scope.gridRad = false;
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-transaksi-pelayanan?nocm=" + $scope.dataPasienSelected.nocm, true).then(function (dat) {
                    let group = [];
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if (dat.data[i].reseppulang == '1') {
                                dat.data[i].cekreseppulang = '✔'
                            } else {
                                dat.data[i].cekreseppulang = '-'
                            }
                        }
                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    norec_resep: array[i].norec_resep,
                                    tglorder: array[i].tglorder,
                                    noresep: array[i].noresep,
                                    count: array[i].count,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    cekreseppulang: array[i].cekreseppulang,
                                    details: dataDetail0
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridResep = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                });
            }

            $scope.klikExist = function (dataSelectedResepExist) {
                var dataProduk = []
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelectedResepExist.id) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk
                $scope.getSatuan()
            }

            $scope.hasilLab = function (dataItem) {
                debugger;
                $scope.isLoading = true;


                // var noregistrasi = ''
                // noregistrasi = dataItem.norec_apd
                var noregistrasifk = $scope.dataPasienSelected.norec
                var objectruanganfk = dataItem.ruid
                // noregistrasifk = $scope.dataPasienSelected.norec;
                // objectruanganfk = dataItem.ruid;
                objectruanganfkp = objectruanganfk

                if (dataItem.ruid == '575') {
                    $scope.gridRoom = false;
                    $scope.gridLab = true;
                    $scope.gridResep = false;
                    $scope.gridRad = false;
                    datalabs = []
                    loadClaimGridPp(noregistrasifk, objectruanganfk);
                    medifirstService.get("radiologi/get-rincian-pelayanan-lab-inacbg?noregistrasifk=" + dataItem.norec_apd + "&ruid=" + dataItem.ruid, true).then(function (dat) {
                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }
                        $scope.statusSelesaiPeriksa = dat.data.data[0].isclaim
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            dat.data.data[i].statCheckbox = false;
                            if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                                dat.data.data[i].statusbridging = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statusbridging = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].iscito == "1") {
                                dat.data.data[i].statuscito = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statuscito = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].statusperiksa == 1) {
                                dat.data.data[i].statusperiksa = "✔";
                            } else {
                                dat.data.data[i].statusperiksa = "✘";
                            }

                        }
                        if (dat.data.data.length > 0) {
                            if (dat.data.data[0].objectdepartemenfk == 3)
                                $scope.disableRad = true
                            if (dat.data.data[0].objectdepartemenfk == 27)
                                $scope.disableLab = true
                        }
                        $scope.isLoading = false;

                        datalab = dat.data.data;
                        popUps(datalab)
                        // $scope.dataGrid = {
                        // 	data: dat.data.data,
                        // 	_data: dat.data.data,
                        // 	// pageSize: 10,
                        // 	selectable: true,
                        // 	refresh: true,
                        // 	total: dat.data.data.length,
                        // 	serverPaging: false,
                        // 	aggregate: [
                        // 		{ field: 'total', aggregate: 'sum' },
                        // 	]
                        // };

                        // $scope.popUpPelayanan.center().open();

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
                }
                // loadEditor()

                if (dataItem.ruid === '576' || dataItem.ruid == '453') {
                    $scope.gridRoom = false;
                    $scope.gridLab = false;
                    $scope.gridResep = false;
                    $scope.gridRad = true;
                    $scope.isLoading = true;

                    // medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                    // 	$scope.listruangan = dat.data.ruangan;
                    // 	// $scope.listLayanan = dat.data.produk;
                    // 	$scope.listDokter = dat.data.dokter;
                    // })
                    // if (norec_apd != null) {

                    datalabs = []
                    loadClaimGridPp(noregistrasifk, objectruanganfk);
                    let path;
                    if (objectruanganfk == '576') {
                        path = 'get-rincian-pelayanan-rad-inacbg';
                    } else if (objectruanganfk == '453') {
                        path = 'get-rincian-pelayanan-lab-ana-inacbg';
                    }
                    medifirstService.get("radiologi/" + path + "?noregistrasifk=" + dataItem.norec_apd + "&ruid=" + dataItem.ruid
                        // medifirstService.get("radiologi/get-rincian-pelayanan-rad-inacbg?noregistrasifk=" + dataItem.norec_apd + "&ruid=" + dataItem.ruid
                        // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                        , true).then(function (dat) {
                            if (dat.data.data.length > 0) {
                                $scope.item.tgllahir = dat.data.data[0].tgllahir
                                $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                            }
                            $scope.statusSelesaiPeriksa = dat.data.data[0].isclaim
                            for (var i = 0; i < dat.data.data.length; i++) {
                                dat.data.data[i].no = i + 1
                                dat.data.data[i].statCheckbox = false;
                                if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                                    dat.data.data[i].statusbridging = "✔";
                                    // ✅
                                    // ✔
                                } else {
                                    dat.data.data[i].statusbridging = "✘";
                                    // ✘
                                    // ❎
                                }
                                if (dat.data.data[i].iscito == "1") {
                                    dat.data.data[i].statuscito = "✔";
                                    // ✅
                                    // ✔
                                } else {
                                    dat.data.data[i].statuscito = "✘";
                                    // ✘
                                    // ❎
                                }
                                if (dat.data.data[i].statusperiksa == 1) {
                                    dat.data.data[i].statusperiksa = "✔";
                                } else {
                                    dat.data.data[i].statusperiksa = "✘";
                                }

                            }
                            if (dat.data.data.length > 0) {
                                if (dat.data.data[0].objectdepartemenfk == 3)
                                    $scope.disableRad = true
                                if (dat.data.data[0].objectdepartemenfk == 27)
                                    $scope.disableLab = true
                            }
                            $scope.isLoading = false;


                            datalab = dat.data.data;
                            popUps(datalab)
                            // $scope.dataGridRadio = {
                            // 	data: dat.data.data,
                            // 	_data: dat.data.data,
                            // 	// pageSize: 10,
                            // 	selectable: true,
                            // 	refresh: true,
                            // 	total: dat.data.data.length,
                            // 	serverPaging: false,
                            // 	aggregate: [
                            // 		{ field: 'total', aggregate: 'sum' },
                            // 	]

                            // };


                            // $scope.popUpPelayananRadio.center().open();

                        },
                            function (error) {
                                $scope.isLoading = false;
                            });
                }
            }

            $scope.columnGrid = {
                columns: [
                    // {
                    // 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // 	template: "# if (statCheckbox) { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    // 		"# } else { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    // 		"# } #",
                    // 	width: "30px",
                    // 	attributes: {
                    // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //    },
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    // {
                    // 	// "field": "claim",
                    // 	"title": "Cetak",
                    // 	"width": "100px",
                    // 	"template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: 'Cetak' #</button>",
                    // 	attributes: {
                    // 		class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    // 	},
                    // },
                    {
                        // "field": "claim",
                        "title": "Claim",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: claim #</button>",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "rm",
                        "title": "Resume Medis",
                        "width": "80px",
                        attributes: {
                            class: "#=rm != 'NO' ? 'hejo' : 'koneng' #"
                        },
                    },
                    {
                        "field": "tglhasil",
                        "title": "Tgl Hasil",
                        "width": "90px",
                    },
                    {
                        "field": "tglcetak",
                        "title": "Tgl Cetak",
                        "width": "90px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "40px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Diskon",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                        // footerTemplate: "<span class='style-center'>Total</span>",
                    },
                    {
                        "field": "jasa",
                        "title": "Jasa Cito",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                        footerTemplate: "<span class='style-center'>Total</span>",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                        footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
                    },
                    {
                        "field": "noorder",
                        "title": "No Order",
                        "width": "100px",
                    },
                    {
                        "field": "nostruk",
                        "title": "No Struk",
                        "width": "80px"
                    },
                    {
                        "field": "statusbridging",
                        "title": "Status Kirim",
                        "width": "50px",
                    },
                    {
                        "field": "statusperiksa",
                        "title": "Status Periksa",
                        "width": "100px",

                    },
                    {
                        "field": "statuscito",
                        "title": "Status Cito",
                        "width": "100px",
                    },
                    {
                        "field": "nofoto",
                        "title": "No Foto",
                        "width": "100px",
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }


            $scope.columnGridRadio = {
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                    attributes: {
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                    attributes: {
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "ruangan",
                    "title": "Ruangan",
                    "width": "120px",
                    attributes: {
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                // {
                //     "field": "produkfk",
                //     "title": "Kode",
                //     "width" : "70px",
                // },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"LihatEkpertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    attributes: {
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "dokter",
                    "title": "Dokter Pemeriksa",
                    "width": "140px",
                    attributes: {
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "dokterpengirim",
                    "title": "Dokter Pengririm",
                    "width": "140px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    // "field": "claim",
                    "title": "Claim",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: claim #</button>",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                    // footerTemplate: "<span class='style-center'>Total</span>",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "jasa",
                    "title": "Jasa Cito",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                    footerTemplate: "<span class='style-center'>Total</span>",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                    aggregates: ["sum"],
                    groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                    footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "100px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "80px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "statusbridging",
                    "title": "Status Kirim",
                    "width": "50px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "statusperiksa",
                    "title": "Status Periksa",
                    "width": "100px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },

                },
                {
                    "field": "statuscito",
                    "title": "Status Cito",
                    "width": "100px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "nofoto",
                    "title": "No Foto",
                    "width": "100px",
                    attributes: {
                        class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                // ,
                // pageable:{
                //     messages: {
                //         display: "Menampilkan {0} - {1} data dari {2} data"
                //     },
                //     refresh: true,
                //     pageSizes: true,
                //     buttonCount: 5

                // }
            }


            medifirstService.getPart("laboratorium/get-combo-dokter-lab").then(function (data) {
                $scope.ListDataPegawai = data;
            });
            medifirstService.get("rawatinap/get-data-combo-dokter", false).then(function (data) {
                $scope.ListRuangan = data.data.ruanganall;
                medifirstService.get("tatarekening/get-detail_apd?noregistrasi=" + $scope.item.noregistrasi).then(function (data) {
                    // debugger
                    $scope.item.Ruangan = { namaruangan: data.data[0].lastRuangan, id: data.data[0].idlasrRuangan }
                });
            });

            $scope.cetak = function () {
                var dokter = "";
                if ($scope.item.DataPegawai == undefined || $scope.item.DataPegawai.id == null) {
                    alert("Pilih terlebih dahulu dookter nya!!")
                    return;
                } else {
                    dokter = $scope.item.DataPegawai
                }
                var ruangan = "";
                if ($scope.item.Ruangan == undefined || $scope.item.Ruangan.id == null) {
                    alert("Pilih terlebih dahulu Ruangan Pengirim nya!!")
                    return;
                } else {
                    ruangan = $scope.item.Ruangan
                }
                var dokterPeriksa = "";
                if ($scope.item.DataPegawaiPemeriksa != undefined || $scope.item.DataPegawaiPemeriksa != null) {
                    dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap
                } else {
                    alert("Pilih terlebih dahulu Dokter Pemeriksa nya!!")
                    return;
                }

                // medifirstService.get("laboratorium/get-riwayat-bayar?norec=" + $scope.norecAPD ).then(function (data) {
                //     if(data.data.data[0].nostruklastfk == null )
                //     {
                //          alert("Passien Umum Wajib Bayar Terlebih Dahulu!!")
                //          return;
                //     }
                //  });
                $scope.popUpCetak.center().open();
                // var client = new HttpClient();
                //  client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab-polri=1&norec=' + $scope.norecAPD 
                //             + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //             + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view='+ stt + '&doketr=' + dokter.namalengkap +'&catatan=' + $scope.item.catatan, function (response) {

                // }); 
                // var dokter = "";
                // var user = medifirstService.getPegawaiLogin();
                // var stt = 'false'
                // if (confirm('View Hasil Laboratorium? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                // if ($scope.item.DataPegawai == undefined) {
                //     alert("Pilih terlebih dahulu dookter nya!!")
                //     return;
                // } else {
                //     dokter = $scope.item.DataPegawai
                // }


                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan, function (response) {

                //     });
            }

            $scope.cetakCPT = function () {
                var namapasien = $scope.dataPasienSelected.namapasien
                var norm = $scope.dataPasienSelected.nocm
                var jeniskelamin = $scope.dataPasienSelected.jeniskelamin
                var noemr = $scope.dataPasienSelected.cpt
                var noemrcppt = $scope.dataPasienSelected.cppt
                var umur = $scope.dataPasienSelected.umur
                let ruangan = $scope.dataPasienSelected.namaruangan
                let noregistrasi = $scope.dataPasienSelected.noregistrasi

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur", "ruangan", "noregistrasi", "noemrcppt"],
                    "paramValue": [namapasien, noemr, norm, jeniskelamin, umur, ruangan, noregistrasi, noemrcppt],
                    "paramType": ["", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});

                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {

                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/catatankeperawatan.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatankeperawatan.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/catatankeperawatan.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/catatankeperawatan.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                    xhr.open('POST', 'http://36.92.186.59:1002/generic/report/catatankeperawatan.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatankeperawatan.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.cetakAll = function () {
                debugger
                let namaPasien = $scope.dataPasienSelected.namapasien
                let norm = $scope.dataPasienSelected.nocm
                let jenisKelamin = $scope.dataPasienSelected.jeniskelamin
                let noemr_cpt = $scope.dataPasienSelected.cpt
                let noemr_cppt = $scope.dataPasienSelected.cppt
                let noemr_igd = $scope.dataPasienSelected.emrigd
                let umur = $scope.dataPasienSelected.umur
                let ruangan = $scope.dataPasienSelected.namaruangan
                let noregistrasi = $scope.dataPasienSelected.noregistrasi

                let photo = $scope.emrIgd.filter(photo => photo.type == "photo");
                let base64_emrIgd = photo[0].value.substring(22);
                let user = medifirstService.getPegawaiLogin();
                let arrPush_emrIgd = []
                for (let i = 0; i <= 150 - 1; i++) {
                    arrPush_emrIgd.push({ emrdfk: i.toString(), value: "" })
                }
                for (let i = 888; i <= 892 - 1; i++) {
                    arrPush_emrIgd.push({ emrdfk: i.toString(), value: "" })
                }
                for (let i = 0; i <= $scope.emrIgd.length - 1; i++) {
                    if ('515' == $scope.emrIgd[i].emrfk) {
                        for (let x = 0; x <= arrPush_emrIgd.length - 1; x++) {
                            if (arrPush_emrIgd[x].emrdfk == $scope.emrIgd[i].emrdfk) {
                                arrPush_emrIgd[x].value = $scope.emrIgd[i].value
                            }
                        }
                    }

                }
                // let data = {
                //     "gambarLogo": "logodokkes.jpg",

                //     "paramKey": ["namaRS","tgllahir","alamatRS","printedBy","nocm","test","nomorEMR","dataLoad"],
                //     "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",user.namaLengkap,$scope.dataPasienSelected.noregistrasi,base64,$scope.dataPasienSelected.emrigd,arrPush],
                //     "paramType" : ["","","","","","","",""] // "paramType" : ["","date"] selain date, isinya kosong saja
                // };

                let data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printBy", "namaPasien", "noemr_cpt", "norm", "jenisKelamin", "umur", "ruangan", "noregistrasi", "noemr_cppt", "noemr_igd", "base64_emrIgd", "arrPush_emrIgd"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, namaPasien, noemr_cpt, norm, jenisKelamin, umur, ruangan, noregistrasi, noemr_cppt, noemr_igd, base64_emrIgd, arrPush_emrIgd],
                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});

                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {

                    xhr.open('POST', 'http://192.168.0.62:1006/generic/report/cetakAll.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1006/generic/report/cetakAll.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://10.16.0.119:1006/generic/report/cetakAll.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1006/generic/report/cetakAll.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                    xhr.open('POST', 'http://36.92.186.59:1006/generic/report/cetakAll.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:1006/generic/report/cetakAll.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.cetakCPPT = function () {
                var namapasien = $scope.dataPasienSelected.namapasien
                var norm = $scope.dataPasienSelected.nocm
                var jeniskelamin = $scope.dataPasienSelected.jeniskelamin
                var noemr = $scope.dataPasienSelected.cppt
                var umur = $scope.dataPasienSelected.umur

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur"],
                    "paramValue": [namapasien, noemr, norm, jeniskelamin, umur],
                    "paramType": ["", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                    xhr.open('POST', 'http://36.92.186.59:1002/generic/report/catatandoktericu.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatandoktericu.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
            }

            $scope.cetakEMRIGD = function () {

            }

            $scope.cetakCPPT = function () {
                var namapasien = $scope.dataPasienSelected.namapasien
                var norm = $scope.dataPasienSelected.nocm
                var jeniskelamin = $scope.dataPasienSelected.jeniskelamin
                var noemr = $scope.dataPasienSelected.cppt
                var umur = $scope.dataPasienSelected.umur

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaPasien", "noemr", "norm", "jeniskelamin", "umur"],
                    "paramValue": [namapasien, noemr, norm, jeniskelamin, umur],
                    "paramType": ["", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/catatandoktericu.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                    xhr.open('POST', 'http://36.92.186.59:1002/generic/report/catatandoktericu.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/catatandoktericu.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
            }

            $scope.cetakEMRIGD = function () {
                debugger
                // if (nomorEMR == '') return
                let photo = $scope.emrIgd.filter(photo => photo.type == "photo");
                let base64 = photo[0].value.substring(22);
                var user = medifirstService.getPegawaiLogin();
                var arrPush = []
                for (var i = 0; i <= 150 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 888; i <= 892 - 1; i++) {
                    arrPush.push({ emrdfk: i.toString(), value: "" })
                }
                for (var i = 0; i <= $scope.emrIgd.length - 1; i++) {
                    if ('515' == $scope.emrIgd[i].emrfk) {
                        for (var x = 0; x <= arrPush.length - 1; x++) {
                            if (arrPush[x].emrdfk == $scope.emrIgd[i].emrdfk) {
                                arrPush[x].value = $scope.emrIgd[i].value
                            }
                        }
                    }

                }
                var data = {
                    "gambarLogo": "logodokkes.jpg",

                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "nocm", "test", "nomorEMR", "dataLoad"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, $scope.dataPasienSelected.noregistrasi, base64, $scope.dataPasienSelected.emrigd, arrPush],
                    "paramType": ["", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                    xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/report2.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/report2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/report2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.detailHasilLab = function (dataItem) {
                debugger;
                $scope.resultGridsHasilLab = new kendo.data.DataSource({
                    data: []
                })

                $scope.isRouteLoading = true
                debugger;

                umurDay = dataItem.umur
                tglpelayanan = dataItem.tglpelayanan
                tglhasil = dataItem.tglhasil
                tglcetak = dataItem.tglcetak
                norecPP = "'" + dataItem.norec_pp + "'"
                norecAPD = dataItem.norec_apd
                ruangan = dataItem.ruangan
                ruanganasal = dataItem.namaruanganasal
                dokterpemeriksa = dataItem.dokterpemeriksa
                dokterpengirim = dataItem.dokterpengirim
                var norec_pp = ''
                $scope.item.norec_pp = dataItem.norec_pp;
                loadClaimPp($scope.item.norec_pp)
                norec_pp = "'" + dataItem.norec_pp + "'"
                medifirstService.get("laboratorium/get-hasil-lab-manual?norec_apd=" + dataItem.norec_apd +
                    '&objectjeniskelaminfk=' + dataItem.objectjeniskelaminfk + '&umur=' + dataItem.umur + '&norec=' + norec_pp + '&tgl=' + Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'))).then(function (data) {
                        // var sourceGrid = []
                        $scope.isRouteLoading = false;
                        if (data.statResponse == true && data.data.data.length > 0) {
                            // sourceGrid = data.data.data
                            if (data.data.data[0].isclaim == null) {
                                $scope.statusSelesaiPeriksa = '0'
                            } else {
                                $scope.statusSelesaiPeriksa = data.data.data[0].isclaim
                            }
                            debugger
                            $scope.item.tglpelayanan = new Date(moment(data.data.data[0].tglpelayanan).format('YYYY-MM-DD HH:mm'));
                            $scope.item.tglhasil = new Date(moment(data.data.data[0].tglhasil).format('YYYY-MM-DD HH:mm'));
                            $scope.item.DataPegawai = { namalengkap: data.data.data[0].namalengkap, id: data.data.data[0].id };
                            $scope.item.catatan = data.data.data[0].catatancetak;
                            for (let i = 0; i < data.data.data.length; i++) {
                                const element = data.data.data[i];
                                $scope.item.catatan = data.data.data[i].catatancetak;
                            }
                            $scope.resultGridsHasilLab = new kendo.data.DataSource({
                                data: data.data.data,
                                group: [
                                    { field: "detailjenisproduk" },
                                    // { field: "namaproduk" }
                                ],
                                sort: { field: "nourutdetail", dir: "asc" },
                                schema: {
                                    model: {
                                        id: "id",
                                        fields: {
                                            detailjenisproduk: { editable: false, type: "string" },
                                            detailpemeriksaan: { editable: false, type: "string" },
                                            memohasil: { editable: false, type: "string" },
                                            namaproduk: { editable: false, type: "string" },
                                            satuanstandar: { editable: false, type: "string" },
                                            // detailpemeriksaan: { editable: false, type: "string" },
                                            nilaimax: { editable: false, type: "string" },
                                            nilaimin: { editable: false, type: "string" },
                                            hasil: { editable: false, type: "string" },
                                            nourutdetail: { editable: false, type: "number" },
                                            nilaitext: { editable: false, type: "string" }
                                        }
                                    }
                                },
                                change: function (e) {
                                    console.log("change :" + e.action);
                                    if (e.field && e.action === "itemchange") {
                                        if (e.items[0].hasil) {
                                            // $scope.item.nilaistr = e.items[0].nilaimin + '-' + e.items[0].nilaimax
                                            let HasilInput = e.items[0].hasil
                                            if (HasilInput.indexOf("+/") >= 0) {
                                                let hssl = "positif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if (hssl == nilaistring) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("-/") >= 0) {
                                                let hssl = "negatif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if (hssl == nilaistring) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("<") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("<");
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf(">") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split(">");
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("-") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("-");
                                                let hssl0 = parseFloat(hsslARr[0])
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl0 >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (e.items[0].nilaimin == null) {
                                                let hssl = e.items[0].hasil
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();

                                                e.items[0].flag = "N"

                                            } else if (e.items[0].nilaimin == "") {
                                                let hssl = e.items[0].hasil
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();

                                                e.items[0].flag = "N"

                                            } else {
                                                if (e.items[0].nilaimin != null) {
                                                    if (e.items[0].tipedata == 2) {
                                                        let a = (e.items[0].nilaimin).toUpperCase()
                                                        let b = (e.items[0].nilaimax).toUpperCase()
                                                        let hssl = ((e.items[0].hasil).trim()).toUpperCase()
                                                        if (hssl >= a && hssl <= b) {
                                                            e.items[0].flag = "N"
                                                        } else {
                                                            e.items[0].flag = "Y"
                                                        }
                                                    } else {
                                                        let a = parseFloat(e.items[0].nilaimin)
                                                        let b = parseFloat(e.items[0].nilaimax)
                                                        let hssl = parseFloat(e.items[0].hasil)
                                                        if (hssl >= a && hssl <= b) {
                                                            e.items[0].flag = "N"
                                                        } else {
                                                            e.items[0].flag = "Y"
                                                        }
                                                    }

                                                } else {
                                                    let hssl = (e.items[0].hasil).trim()
                                                    let nilaistring = e.items[0].nilaitext
                                                    nilaistring = nilaistring.toUpperCase();
                                                    hssl = hssl.toUpperCase();
                                                    if (hssl == nilaistring) {
                                                        e.items[0].flag = "N"
                                                    } else {
                                                        e.items[0].flag = "Y"
                                                    }
                                                }
                                            }
                                            //                                             alert('hasilna :'+e.items[0].hasil)
                                            e.items.state = "edit"
                                            //                                         } else {
                                            //                                             e.items.state = "add"
                                        } else if (e.items[0].hasil_s || e.items[0].hasil_i) {
                                            e.items[0].flag = "N"
                                        }
                                        // $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                        $scope.resultGridsHasilLab.fetch();
                                    }
                                }
                            });

                            $scope.popUpDetailLab.center().open();
                        } else {
                            toastr.info('Data Hasil tidak ada', 'Info')
                        }
                    });

            }


            // $scope.detailHasilLab = function (dataItem) {
            // 	debugger;
            // 	$scope.isRouteLoading = true
            // 	var norec_pp = ''
            // 	var norec_ppc = ''
            // 	// norec_pp = dataItem.norec_pp;
            // 	norec_pp = "'" + dataItem.norec_pp + "'"
            // 	norec_ppc = dataItem.norec_pp
            // 	medifirstService.get("laboratorium/get-hasil-lab-manual?norec_apd=" + dataItem.norec_apd +
            // 		'&objectjeniskelaminfk=' + dataItem.objectjeniskelaminfk + '&umur=' + dataItem.umur + '&norec=' + norec_pp + '&tgl=' + Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'))).then(function (data) {
            // 			// var sourceGrid = []
            // 			$scope.isRouteLoading = false;
            // 			if (data.statResponse == true && data.data.data.length > 0) {
            // 				// sourceGrid = data.data.data
            // 				$scope.statusSelesaiPeriksa = data.data.data[0].isclaim
            // 				$scope.item.umurDay = dataItem.umur;
            // 				$scope.item.norec_apd = dataItem.norec_apd;
            // 				$scope.item.norec_pp = dataItem.norec_pp;
            // 				$scope.item.tglpelayanan = new Date(moment(data.data.data[0].tglpelayanan).format('YYYY-MM-DD HH:mm'));
            // 				$scope.item.tglhasil = new Date(moment(data.data.data[0].tglhasil).format('YYYY-MM-DD HH:mm'));
            // 				$scope.item.DataPegawai = {namalengkap:data.data.data[0].namalengkap,id:data.data.data[0].id};
            // 				$scope.item.catatan = data.data.data[0].catatancetak;
            // 				for (let i = 0; i < data.data.data.length; i++) {
            // 					const element = data.data.data[i];
            // 					$scope.item.catatan = data.data.data[i].catatancetak;
            // 				}
            // 				$scope.resultGridsHasilLab = new kendo.data.DataSource({
            // 					data: data.data.data,
            // 					group: [
            // 						{ field: "detailjenisproduk" },
            // 						// { field: "namaproduk" }
            // 					],
            // 					sort: { field: "nourutdetail", dir: "asc" },
            // 					schema: {
            // 						model: {
            // 							id: "id",
            // 							fields: {
            // 								detailjenisproduk: { editable: false, type: "string" },
            // 								detailpemeriksaan: { editable: false, type: "string" },
            // 								memohasil: { editable: false, type: "string" },
            // 								namaproduk: { editable: false, type: "string" },
            // 								satuanstandar: { editable: false, type: "string" },
            // 								// detailpemeriksaan: { editable: false, type: "string" },
            // 								nilaimax: { editable: false, type: "string" },
            // 								nilaimin: { editable: false, type: "string" },
            // 								hasil: { editable: false, type: "string" },
            // 								nourutdetail: { editable: false, type: "number" },
            // 								nilaitext: { editable: false, type: "string" }
            // 							}
            // 						}
            // 					},
            // 					change: function (e) {
            // 						console.log("change :" + e.action);
            // 						if (e.field && e.action === "itemchange") {
            // 							if (e.items[0].hasil) {
            // 								// $scope.item.nilaistr = e.items[0].nilaimin + '-' + e.items[0].nilaimax
            // 								let HasilInput = e.items[0].hasil
            // 								if (HasilInput.indexOf("+/") >= 0) {
            // 									let hssl = "positif"
            // 									let nilaistring = e.items[0].nilaitext
            // 									nilaistring = nilaistring.toUpperCase();
            // 									hssl = hssl.toUpperCase();
            // 									if (hssl == nilaistring) {
            // 										e.items[0].flag = "N"
            // 									} else {
            // 										e.items[0].flag = "Y"
            // 									}
            // 								} else if (HasilInput.indexOf("-/") >= 0) {
            // 									let hssl = "negatif"
            // 									let nilaistring = e.items[0].nilaitext
            // 									nilaistring = nilaistring.toUpperCase();
            // 									hssl = hssl.toUpperCase();
            // 									if (hssl == nilaistring) {
            // 										e.items[0].flag = "N"
            // 									} else {
            // 										e.items[0].flag = "Y"
            // 									}
            // 								} else if (HasilInput.indexOf("<") >= 0) {
            // 									let a = parseFloat(e.items[0].nilaimin)
            // 									let b = parseFloat(e.items[0].nilaimax)
            // 									let hsslARr = HasilInput.split("<");
            // 									let hssl = parseFloat(hsslARr[1])

            // 									if (hssl >= a && hssl <= b) {
            // 										e.items[0].flag = "N"
            // 									} else {
            // 										e.items[0].flag = "Y"
            // 									}
            // 								} else if (HasilInput.indexOf(">") >= 0) {
            // 									let a = parseFloat(e.items[0].nilaimin)
            // 									let b = parseFloat(e.items[0].nilaimax)
            // 									let hsslARr = HasilInput.split(">");
            // 									let hssl = parseFloat(hsslARr[1])

            // 									if (hssl >= a && hssl <= b) {
            // 										e.items[0].flag = "N"
            // 									} else {
            // 										e.items[0].flag = "Y"
            // 									}
            // 								} else if (HasilInput.indexOf("-") >= 0) {
            // 									let a = parseFloat(e.items[0].nilaimin)
            // 									let b = parseFloat(e.items[0].nilaimax)
            // 									let hsslARr = HasilInput.split("-");
            // 									let hssl0 = parseFloat(hsslARr[0])
            // 									let hssl = parseFloat(hsslARr[1])

            // 									if (hssl0 >= a && hssl <= b) {
            // 										e.items[0].flag = "N"
            // 									} else {
            // 										e.items[0].flag = "Y"
            // 									}
            // 								} else if (e.items[0].nilaimin == null) {
            // 									let hssl = e.items[0].hasil
            // 									let nilaistring = e.items[0].nilaitext
            // 									nilaistring = nilaistring.toUpperCase();
            // 									hssl = hssl.toUpperCase();

            // 									e.items[0].flag = "N"

            // 								} else if (e.items[0].nilaimin == "") {
            // 									let hssl = e.items[0].hasil
            // 									let nilaistring = e.items[0].nilaitext
            // 									nilaistring = nilaistring.toUpperCase();
            // 									hssl = hssl.toUpperCase();

            // 									e.items[0].flag = "N"

            // 								}
            // 								else {
            // 									if (e.items[0].nilaimin != null) {
            // 										if (e.items[0].tipedata == 2) {
            // 											let a = (e.items[0].nilaimin).toUpperCase()
            // 											let b = (e.items[0].nilaimax).toUpperCase()
            // 											let hssl = ((e.items[0].hasil).trim()).toUpperCase()
            // 											if (hssl >= a && hssl <= b) {
            // 												e.items[0].flag = "N"
            // 											} else {
            // 												e.items[0].flag = "Y"
            // 											}
            // 										} else {
            // 											let a = parseFloat(e.items[0].nilaimin)
            // 											let b = parseFloat(e.items[0].nilaimax)
            // 											let hssl = parseFloat(e.items[0].hasil)
            // 											if (hssl >= a && hssl <= b) {
            // 												e.items[0].flag = "N"
            // 											} else {
            // 												e.items[0].flag = "Y"
            // 											}
            // 										}

            // 									} else {
            // 										let hssl = (e.items[0].hasil).trim()
            // 										let nilaistring = e.items[0].nilaitext
            // 										nilaistring = nilaistring.toUpperCase();
            // 										hssl = hssl.toUpperCase();
            // 										if (hssl == nilaistring) {
            // 											e.items[0].flag = "N"
            // 										} else {
            // 											e.items[0].flag = "Y"
            // 										}
            // 									}
            // 								}
            // 								//                                             alert('hasilna :'+e.items[0].hasil)
            // 								e.items.state = "edit"
            // 								//                                         } else {
            // 								//                                             e.items.state = "add"
            // 							}else if (e.items[0].hasil_s || e.items[0].hasil_i) {
            // 								e.items[0].flag = "N"
            // 							}
            // 							// $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
            // 							$scope.resultGridsHasilLab.fetch();
            // 						}
            // 					}
            // 				});
            // 				loadClaimPp(norec_ppc)
            // 				$scope.popUpDetailLab.center().open();
            // 			} else {
            // 				toastr.info('Data Hasil tidak ada', 'Info')
            // 			}
            // 		});
            // 	}

            $scope.LihatEkpertise = function (dataItem) {
                // debugger;
                // if ($scope.dataItem == undefined) {
                // 	window.messageContainer.error("Pilih Data Dulu!");
                // 	return;
                // }
                debugger;
                $scope.hideExper = false
                $scope.norecHasilRadiologi = ''
                $scope.item.namaPelayanan = dataItem.namaproduk
                $scope.item.norec_pp = dataItem.norec_pp
                // $scope.item.dokters = dataItem.dokter
                $scope.item.dokter = { id: dataItem.dokterid, namalengkap: dataItem.dokter }
                if (dataItem.iddokterpengirim != undefined && dataItem.iddokterpengirim != "" && dataItem.iddokterpengirim != 0) {
                    $scope.item.dokterperujuk = { id: dataItem.iddokterpengirim, namalengkap: dataItem.dokterpengirim }
                }
                // $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                // $scope.item.dokter = { id: dataItem.dokterid, namalengkap: dataItem.dokter }
                if (dataItem.objectruanganfk == 576) {
                    medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + dataItem.norec_pp + '&idproduk=' + dataItem.produkfk).then(function (e) {
                        if (e.data.length > 0) {
                            // if(e.data[0].keterangan == undefined || e.data[0].keterangan == null || e.data[0].keterangan == '')
                            // {
                            //     medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataItem.produkfk + '&objectpegawaifk=' + $scope.dataItem.dokterid).then(function (res) {
                            //         if (res.data.data.length > 0) 
                            //                  $scope.item.keterangan = res.data.data[0].keterangan;//.replace(/~/g, "\n")

                            //         })
                            //     $scope.norecHasilRadiologi = e.data[0].norec
                            //     $scope.item.nofoto = e.data[0].nofoto
                            //     $scope.item.tglInput = new Date(e.data[0].tanggal)
                            //     $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }


                            //     $scope.item.dokterperujuk = { id: e.data[0].dokterperujuk, namalengkap: e.data[0].namadokterperujuk }
                            //     $scope.item.ruanganperujuk = { id: e.data[0].ruanganperujukfk, namaruangan: e.data[0].namaruangan }

                            // }else
                            // {

                            // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataItem.produkfk + '&objectpegawaifk=' + $scope.dataItem.dokterid).then(function (res) {
                            //     if (res.data.data.length == 0) 
                            //         var objSave = {
                            //             id :"",
                            //             produkfk: $scope.dataItem.produkfk,
                            //             keterangan: e.data[0].keterangan,
                            //             objectpegawaifk: $scope.dataItem.dokterid,
                            //             "method": 'save'
                            //         }   
                            //         // medifirstService.post('sysadmin/general/save-template-hasil', objSave).then(function (e) { 
                            //         // }, function (error) {
                            //         //     $scope.hideExper = false
                            //         // })
                            //     })
                            debugger
                            $scope.statusSelesaiPeriksa = e.data[0].isclaim
                            $scope.norecHasilRadiologi = e.data[0].norec
                            $scope.item.nofoto = e.data[0].nofoto
                            $scope.item.tglInput = new Date(e.data[0].tanggal)
                            $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                            $scope.item.keterangan = e.data[0].keterangan; //.replace(/~/g, "\n")

                            $scope.item.dokterperujuk = { id: e.data[0].dokterperujuk, namalengkap: e.data[0].namadokterperujuk }
                            $scope.item.ruanganperujuk = { id: e.data[0].ruanganperujukfk, namaruangan: e.data[0].namaruangan }
                        } else { }

                        if ($scope.norecHasilRadiologi != '') {
                            var local = JSON.parse(localStorage.getItem('profile'))
                            var nama = medifirstService.getPegawaiLogin().namaLengkap
                            if (local != null) {
                                var profile = local.id;
                                window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile +
                                    '&nama=' + nama, '_blank');
                            }
                        }
                    })
                } else if (dataItem.objectruanganfk == 453) {
                    $scope.norecPA = ''

                    $scope.itemPA.namaPelayanan = dataItem.namaproduk
                    $scope.itemPA.dokters = dataItem.dokter
                    // $scope.itemPA.tglInput = new Date()
                    $scope.itemPA.hasilPA = ''

                    // $scope.findBy = 1
                    debugger;
                    medifirstService.get('laboratorium/get-hasil-lab-pa?norec_pp=' + dataItem.norec_pp + '&idproduk=' + dataItem.produkfk).then(function (e) {
                        debugger;
                        if (e.data.length > 0) {
                            let res = e.data[0]
                            $scope.itemdok.NoPa = res.nomorpa,
                                $scope.norecPA = res.norec,
                                $scope.itemPA.hasilPA = res.expertise,
                                $scope.item.nopa = res.nomorpa,
                                $scope.item.tgljawab = res.tanggal_jawab,
                                $scope.item.tglterima = res.tanggal_terima,
                                $scope.item.tgltransaksi = res.tanggal,
                                $scope.itemPA.dokterperujukpa = { id: res.iddokterperujuk, namalengkap: res.dokterperujuk },
                                $scope.item.topografi = { kddiagnosa: res.topologi },
                                $scope.item.morfologi = { kddiagnosa: res.morfologi }
                            $scope.itemPA.dokterluar = res.dokterperujukluar
                        } else {
                            medifirstService.get('sysadmin/general/get-daftar-template?id=1').then(function (res) {
                                if (res.data.data.length > 0)
                                    $scope.itemPA.hasilPA = res.data.data[0].template
                            });
                        };
                        medifirstService.get('laboratorium/get-combo-diagnosa?').then(function (data) {
                            $scope.listDiagnosa = data.data.diagnosa;
                        })

                        let norecPA = $scope.norecPA
                        let tanggal = $scope.now;
                        let tanggalLahir = new Date($scope.item.tgllahir);
                        let umurs = DateHelper.CountAge(tanggalLahir, tanggal);
                        let umur = umurs.year + ' thn ' + umurs.month + ' bln ' + umurs.day + ' hari'
                        // let umur = $scope.item.umur
                        let nopa = $scope.item.nopa
                        let dokLu = "-"
                        let top = "-"
                        let mof = "-"

                        if ($scope.itemPA.dokterluar != null) {
                            dokLu = $scope.itemPA.dokterluar
                        }

                        if ($scope.item.topografi != undefined) {
                            top = $scope.item.topografi.kddiagnosa
                        }
                        if ($scope.item.morfologi != undefined) {
                            mof = $scope.item.morfologi.kddiagnosa
                        }
                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "umur", "norec", "nopa", "dokLu", "top", "mof"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "RS BHAYANGKARA TK IV CIANJUR", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", umur,
                                norecPA, nopa, dokLu, top, mof
                            ],
                            "paramType": ["", "", "", "date", "", "", "", "", "", "", ""]
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
                            xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakLabPA.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:1003/generic/report/cetakLabPA.pdf');
                        } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/cetakLabPA.pdf');
                        } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/cetakLabPA.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:1003/generic/report/cetakLabPA.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakLabPA.pdf');
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                    })

                }

                // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                //         if (res.data.data.length > 0) 
                //                  $scope.item.keterangan = e.data[0].keterangan;//.replace(/~/g, "\n")
                //                  $scope.popUpEkpertise.center().open();
                //         })




            }

            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"
                ],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };

            function loadEditor() {

            }

            $scope.cetakEks = function () {
                debugger;

                if ($scope.norecHasilRadiologi != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile +
                            '&nama=' + nama, '_blank');
                    }
                }
            }
            $scope.BatalEkpertise = function () {

                $scope.norecHasilRadiologi = ''
                $scope.item.nofoto = undefined
                $scope.item.tglInput = new Date()
                $scope.item.dokter = undefined
                $scope.item.keterangan = undefined
                $scope.popUpEkpertise.close();
            }

            $scope.ColumnResultHasilLab = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "HasilLab.xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: true,

                // dataBound: onDataBound,
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Hasil";

                    var myHeaders = [

                        {
                            value: "Hasil Laboratorium",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                columns: [{
                    field: "namaproduk",
                    title: "Nama Pemeriksaan",
                    width: "20%"
                },
                {
                    field: "detailpemeriksaan",
                    title: "Detail Pemeriksaan",
                    width: "20%"
                }, {
                    field: "hasil",
                    title: "Hasil Pemeriksaan",
                    width: "15%",
                    attributes: {
                        class: "#=flag != 'N' ? 'red' : 'green' #"
                    },
                }, {
                    field: "nilaitext",
                    title: "Nilai Normal",
                    width: "15%"
                },
                // {
                //     field: "tipedata",
                //     title: "tipedata",
                //     width: "0%"

                // },
                {
                    field: "satuanstandar",
                    title: "Satuan Hasil",
                    width: "20%"
                },
                {
                    field: "Metode",
                    title: "Metode",
                    width: "20%"
                },
                {
                    field: "hasil_s",
                    title: "S",
                    width: "5%"
                },
                {
                    field: "hasil_i",
                    title: "I",
                    width: "5%"
                },
                {
                    field: "catatan",
                    title: "Catatan",
                    width: "5%"
                },
                {
                    hidden: true,
                    field: "detailjenisproduk",
                    title: "Jenis Pemeriksaan"
                },

                {
                    hidden: true,
                    field: "nourutdetail"

                }
                ]
            };


            // $scope.rincian = function () {

            // 	var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
            // 	var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
            // 	var tempRuangan = "";
            // 	if ($scope.item.statRuangan != undefined) {
            // 		tempRuangan = "&statRuangan=" + $scope.item.statRuangan.id;
            // 	}

            // 	debugger;
            // 	var chacePeriode = {
            // 		0: tglAwal,
            // 		1: tglAkhir
            // 	}
            // 	cacheHelper.set('LaporanCovCtrl', chacePeriode);

            // 	medifirstService.get("registrasi/get-laporan-covid?"
            // 		// + "tglAwal=" + tglAwal
            // 		// + "&tglAkhir=" + tglAkhir
            // 		+ tempRuangan
            // 	).then(function (data) {
            // 		var data = data.data
            // 		$scope.isRouteLoading = false;

            // 		//   debugger
            // 		$scope.ambildataexcel = data.data;
            // 		// $scope.panggil($scope.ambildataexcel);
            // 		$scope.dataLaporanCovid = new kendo.data.DataSource({
            // 			data: data.data,
            // 			pageSize: 10,
            // 			total: data.length,
            // 			serverPaging: false,
            // 			schema: {
            // 				model: {
            // 					fields: {
            // 					}
            // 				}
            // 			}
            // 		});
            // 	})
            // }


            $scope.cetakSEP = function (x) {
                debugger;
                if ($scope.dataPasienSelected.noregistrasi != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {

                    // //##save identifikasi sep
                    // medifirstService.get("registrasi/identifikasi-sep?norec_pd="
                    //     + $scope.cacheNorecPD
                    // ).then(function (data) {
                    //     var datas = data.data;
                    // })
                    // //##end

                    // // var noSep = e.data.data === null ? "2423432" : e.data.data;
                    // // var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
                    // // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    // //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=1708000087&view=true   
                    // //cetakan langsung service VB6 by grh    
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                    //     // do something with response
                    // });
                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                        '&norec=' + $scope.dataPasienSelected.noregistrasi
                    ).then(function (data) {
                        debugger;
                        var data = data.data.data;
                        $("#nosepx").text(data[0].nosep);
                        $("#nopendaftaran").text(data[0].noregistrasi);
                        $("#tglsep").text(data[0].tanggalsep);
                        $("#peserta").text(data[0].jenispeserta);
                        $("#nokartu").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                        // $("#cob").text(data[0].penjaminlaka);
                        $("#namapeserta").text(data[0].namapeserta);
                        $("#jenisrawat").text(data[0].jenisrawat);
                        $("#tgllahir").text((moment(data[0].tgllahir).format('YYYY-MM-DD')));
                        $("#kelasrawat").text(data[0].namakelas);
                        $("#notelepon").text(data[0].notelpmobile);
                        $("#penjamin").text(data[0].penjaminlakalantas);
                        $("#politujuan").text(data[0].namaruanganfix);
                        $("#prolanis").text(data[0].prolanisprb);
                        $("#faskesperujuk").text(data[0].nmprovider);
                        $("#diagnosaawal").text(data[0].namadiagnosa);
                        $("#catatan").text(data[0].catatan);
                        $("#cetakanke").text(1);
                        $("#namadjpjmelayani").text(data[0].namadjpjpmelayani);

                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        var htmlStart =
                            '<!DOCTYPE html>' +
                            '<html style="border:none;border-color: white">' +
                            '<head style="border:none;border-color: white">' +
                            // '<div class="header" style="position: fixed;top: 0;">'+
                            // header +
                            '<style>' +
                            'html { font: 11pt sans-serif; }' +
                            '.k-grid { border-top-width: 0; }' +
                            '.k-grid, .k-grid-content { height: auto !important; }' +
                            '.k-grid-content { overflow: visible !important; }' +
                            '.k-grid .k-grid-header th { border-top: none; }' +
                            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                            '</style>' +
                            '</div>' +
                            '</head>' +
                            '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                            '<table  style="border:none; border-color: white">' +
                            '<thead style="border:none;border-color: white">' +
                            '<tr style="border:none;border-color: white">' +
                            '<td style="border:none;border-color: white">' +
                            // '<div class="page-header-space"></div>' +
                            '<div style="border:none;border-color: white">' +
                            // header +                                
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>'
                        var htmlEnd =
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</body>' +
                            '</div>' +


                            '</html>';
                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        printdata = htmlStart + printdata + htmlEnd;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        // var cetakan=htmlStart + printableContent + htmlEnd;
                        var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                        WindowObject.document.writeln(printdata);
                        WindowObject.document.close();
                        WindowObject.focus();

                    })
                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Sep!");
                    return;
                }
            }

            $scope.claim = function () {
                $scope.popUpClaim.center().open()
            }

            $scope.batalClaim = function () {
                $scope.popUpbatalClaim.center().open()
            }

            $scope.selectUnselectAllRow = function () {
                debugger
                var tempData = $scope.dataGrid._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }

                reloadDataGrid(tempData);
            }
            $scope.selectRow = function (dataItem) {
                debugger
                var dataSelect = _.find($scope.dataGrid._data, function (data) {
                    return data.norec_pp == dataItem.norec_pp;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                } else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.dataGrid._data);

            }
            $scope.simpanClaim = function () {
                if ($scope.item.password != "claim") {
                    toastr.error("Password Salah!")
                    return;
                }
                var json = {
                    'noregistrasi': $scope.dataPasienSelected.noregistrasi,
                    'claim': true
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-claim', json).then(function (e) {
                    if (e.status === 201) {
                        medifirstService.post('tatarekening/save-log-claim', json).then(function (e) { })
                    }
                })
                loadClaimPd()
                $scope.popUpClaim.close()
            }

            $scope.saveUnclaim = function () {
                if ($scope.item.password != "unclaim") {
                    toastr.error("Password Salah!")
                    return;
                }
                if ($scope.item.alasanBatalClaim == undefined || $scope.item.alasanBatalClaim == " ") {
                    toastr.error("Alasan Batal Claim Harus Diisi !")
                    return;
                }
                var json = {
                    'alasanbatalclaim': $scope.item.alasanBatalClaim,
                    'noregistrasi': $scope.dataPasienSelected.noregistrasi,
                    'claim': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-claim', json).then(function (e) {
                    if (e.status === 201) {
                        medifirstService.post('tatarekening/save-log-unclaim', json).then(function (e) { })
                    }
                })
                loadClaimPd()
                $scope.popUpbatalClaim.close()
            }

            $scope.simpanClaimPP = function () {
                debugger
                // if ($scope.item.password != "diclaim") {
                // 	toastr.error("Password Salah!")
                // 	return;
                // }
                var noregistrasifk = $scope.dataPasienSelected.norec
                var objectruanganfk = objectruanganfkp
                var norec_ppc = $scope.item.norec_pp
                var json = {
                    'norec': $scope.item.norec_pp,
                    'claim': true
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-claim-pp', json).then(function (e) {
                    if (e.status === 201) {
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                        // 	})
                        loadClaimPp(norec_ppc)
                        loadClaimGridPp(noregistrasifk, objectruanganfk)
                    }
                })
                // loadClaimPp(norec_ppc)
                $scope.popUpClaim.close()
            }

            $scope.simpanBatalClaimPP = function () {
                debugger
                // if ($scope.item.password != "diclaim") {
                // 	toastr.error("Password Salah!")
                // 	return;
                // }
                var noregistrasifk = $scope.dataPasienSelected.norec
                var objectruanganfk = objectruanganfkp
                var norec_ppc = $scope.item.norec_pp
                // norec_ppc = $scope.item.norec_pp
                var json = {
                    'norec': $scope.item.norec_pp,
                    'claim': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-claim-pp', json).then(function (e) {
                    if (e.status === 201) {
                        loadClaimPp(norec_ppc)
                        loadClaimGridPp(noregistrasifk, objectruanganfk)
                        // debugger;
                        // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                        // 	})
                    }
                })
                // loadClaimPp(norec_ppc)
                $scope.popUpClaim.close()
            }
            // $scope.Cetakv2 = function () {
            // 	$scope.popupCetak2.center().open();
            // }

            $scope.CetakLabKlinik = function () {
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noReg).then(function (data) {
                    debugger
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }

                    }
                });

                debugger
                // var a = dataItem
                // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var dokter = $scope.item.DataPegawai
                // var ruangan = $scope.item.Ruangan.namaruangan;
                // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                var catatan = "-";
                if ($scope.item.catatan != undefined) {
                    catatan = $scope.item.catatan;
                }

                var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noReg
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "RS BHAYANGKARA TK IV CIANJUR", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap,
                        x, umurDay, $scope.item.objectjeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                    ],
                    "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                //     tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                //     var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                //     var statusUpdate =1;
                //     if($scope.item.cekUpdate == true)
                //     {
                //        statusUpdate = 2
                //     }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        loadDataNosep()
                //    });
            }


            $scope.CetakLabKlinikLangsung = function (dataItem) {
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noReg).then(function (data) {
                    debugger
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }

                    }
                });

                if (dataItem.tglhasil == null) {
                    alert("Hasil Tidak Ditersedia.");
                    return;
                } else {
                    umurDay = dataItem.umur
                    tglpelayanan = dataItem.tglpelayanan
                    tglhasil = dataItem.tglhasil
                    tglcetak = dataItem.tglcetak
                    norecPP = "'" + dataItem.norec_pp + "'"
                    norecAPD = dataItem.norec_apd
                    ruangan = dataItem.ruangan
                    ruanganasal = dataItem.namaruanganasal
                    dokterpemeriksa = dataItem.dokterpemeriksa
                    dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    // loadClaimPp($scope.item.norec_pp)
                    norec_pp = "'" + dataItem.norec_pp + "'"

                    debugger
                    // var a = dataItem
                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        catatan = $scope.item.catatan;
                    }

                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.item.noReg
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "RS BHAYANGKARA TK IV CIANJUR", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap,
                            x, umurDay, $scope.item.objectjeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                //     tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                //     var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                //     var statusUpdate =1;
                //     if($scope.item.cekUpdate == true)
                //     {
                //        statusUpdate = 2
                //     }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        loadDataNosep()
                //    });
            }

            // $scope.CetakLabKlinik = function () {
            // 	debugger
            //     var dokter = "";
            //     if ($scope.item.DataPegawai == undefined || $scope.item.DataPegawai.id == null) {
            //         alert("Pilih terlebih dahulu dookter nya!!")
            //         return;
            //     } else {
            //         dokter = $scope.item.DataPegawai
            //     }
            //     var ruangan = "";
            //     if ($scope.item.Ruangan == undefined || $scope.item.Ruangan.id == null) {
            //         alert("Pilih terlebih dahulu Ruangan Pengirim nya!!")
            //         return;
            //     } else {
            //         ruangan = $scope.item.Ruangan
            //     }
            //     var dokterPeriksa = "";
            //     if ($scope.item.DataPegawaiPemeriksa != undefined || $scope.item.DataPegawaiPemeriksa != null) {
            //              dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap
            //     }else{
            //         alert("Pilih terlebih dahulu Dokter Pemeriksa nya!!")
            //         return;
            //     }
            //     $scope.popUpCetakLabo.center().open();
            // }
            $scope.PopUpCetakFormat = function () {
                debugger
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var apd = $scope.item.norec_apd
                var pp = "'" + $scope.item.norec_pp + "'"
                var umur = $scope.item.umurDay
                var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                var dokter = $scope.item.DataPegawai
                var ruangan = $scope.item.Ruangan.namaruangan;
                var dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap;
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + apd +
                    '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + umur +
                    '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + pp + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan +
                    '&tglpelayanan=' + tgl + '&tglhasil=' + tglhasil + '&ruangan=' + ruangan + '&dokterperiksa=' + dokterPeriksa,
                    function (response) {

                    });
            }

            // $scope.CetakRekap = function () {
            // 	// $mdDialog.show(confirm).then(function() {
            // 	debugger
            // 	var NoStruk = $scope.dataRincianTagihan;
            // 	var struk = "";
            // 	var kwitansi = "";
            // 	var stt = 'false'
            // 	var noreg = $scope.dataPasienSelected.noregistrasi
            // 	var user = medifirstService.getPegawaiLogin();
            // 	if (confirm('View Rekap Biaya? ')) {
            // 		// Save it!
            // 		stt = 'true';
            // 	} else {
            // 		// Do nothing!
            // 		stt = 'false'
            // 	}	
            // 	medifirstService.get("tatarekening/detail-tagihan/" + noreg + '?jenisdata=bill').then(function (dat) {
            // 		medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
            // 			var client = new HttpClient();
            // 			client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiayaPelayanan=1&strNoregistrasi=' + noreg + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + user.namaLengkap + '&view=' + stt, function (response) {
            // 				// do something with response
            // 			});
            // 		})
            // 	})

            // }

            $scope.CetakRekap = function () {
                debugger

                var user = medifirstService.getPegawaiLogin();
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.dataPasienSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    var billing = "Rp " + parseFloat(dat.data.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var deposit = "Rp " + parseFloat(dat.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = dat.data.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat(dat.data.bayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if (dat.data.jenisPasien != "Umum/Pribadi") {
                            kelas = dat.data.kelasPenjamin
                            // bayar = "0"
                        }

                        if (dat.data.deposit > 0) {
                            sisa = dat.data.deposit - parseFloat(dat.data.bayar)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if (dat.data.nosep != "" && dat.data.nosep != null) {
                            nosep = dat.data.nosep
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, dat.data.noRegistrasi,
                                dat.data.noCm, dat.data.namaPasien, dat.data.lastRuangan, dat.data.namakamar, kelas, billing, deposit, sisa, dat.data.isi, dat.data.terbilang, bayar, nosep
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        if (dat.data.jenisPasien == "BPJS") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.jenisPasien == "Umum/Pribadi") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.jenisPasien == "KEMENKES RI") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.namaPenjamin == "JASA RAHARJA, PT (BPJS KESEHATAN)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.namaPenjamin == "JASA RAHARJA, PT (UMUM)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                            }
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })
                })

                // debugger
                // var billing = "Rp. " + parseFloat($scope.dataPasienSelected.tarif_rs.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var deposit = "Rp 0,00";
                // $scope.isRouteLoading = true;
                // medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
                // 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                // 		var kelas =$scope.dataPasienSelected.namakelasini;
                // 		var sisa ="0";
                // 		// var bayar = "0";
                // 		// var bayar = "Rp " + parseFloat($scope.item.sudahbayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // 		var bayar = "Rp. " + parseFloat($scope.dataPasienSelected.tarif_rs.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // 		if(bayar=="Rp NaN"){
                // 			bayar="Rp 0,00";
                // 		}
                // 		if($scope.dataPasienSelected.kelompokpasien=="BPJS"){
                // 			kelas = $scope.dataPasienSelected.namakelasini
                // 			// bayar = "0"
                // 		}
                // 		if($scope.dataPasienSelected.tarif_rs.deposit>0){
                // 			sisa = $scope.dataPasienSelected.tarif_rs.deposit - parseFloat($scope.dataPasienSelected.tarif_rs.billing)
                // 			if(sisa>0){
                // 				sisa = "Rp. " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // 			}else{
                // 				sisa ="Rp 0,00";
                // 			}
                // 		}
                // 		var nosep = "-";
                // 		if($scope.dataPasienSelected.nosep!="" && $scope.dataPasienSelected.nosep!=null){
                // 			nosep=$scope.dataPasienSelected.nosep
                // 		}
                // 		debugger;

                // 			var data = {
                // 				"gambarLogo": "logodokkes.jpg",
                // 				"paramKey": ["namaRS", "tgllahir","alamatRS","printedBy","noregistrasi","nocm","namapasien","lastruangan","namakamar","kelas","jmlbiaya","deposit","sisa","isi","terbilang","bayar","nosep"],
                // 				"paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",e.data[0].namalengkap,$scope.dataPasienSelected.noregistrasi,
                // 						$scope.dataPasienSelected.nocm,$scope.dataPasienSelected.namapasien,$scope.dataPasienSelected.namaruangan,$scope.dataPasienSelected.tarif_rs.namakamar,kelas,billing,deposit,sisa,$scope.dataPasienSelected.tarif_rs.isi,$scope.dataPasienSelected.tarif_rs.terbilang,bayar,nosep],
                // 				"paramType" : ["","date","","","","","","","","","","","","","","",""]
                // 			};

                // 		var xhr = new XMLHttpRequest();
                // 		xhr.onreadystatechange = function(){
                // 			if (this.readyState == 4 && this.status == 200){
                // 				//this.response is what you're looking for
                // 				// handler(this.response);
                // 				console.log(this.response, typeof this.response);
                // 				//var res = this.response
                // 				//var file = new Blob( [res], {type: 'application/pdf'});
                // 				debugger;
                // 				var url = window.URL.createObjectURL(this.response)
                // 				var pdf = document.getElementById('tempatLaporan');
                // 				// pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                // 				var win = window.open(url, '_blank');
                // 				// win.focus();
                // 			}
                // 		}
                // 		if($scope.item.jenisPasien=="BPJS" ){
                // 				if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 					xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbilling.pdf');
                // 				}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 					xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbilling.pdf');
                // 				}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 					xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbilling.pdf');
                // 				}else{
                // 					xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbilling.pdf');
                // 				}
                // 		}
                // 		else if($scope.item.jenisPasien=="Umum/Pribadi" ){
                // 			if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 				xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbilling.pdf');
                // 			}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 				xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbilling.pdf');
                // 			}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 				xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbilling.pdf');
                // 			}else{
                // 				xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbilling.pdf');
                // 			}
                // 		}
                // 		else
                // 		{
                // 			if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 				xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingaSURANSI.pdf');
                // 			}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 				xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingaSURANSI.pdf');
                // 			}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 				xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingaSURANSI.pdf');
                // 			}else{
                // 				xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingaSURANSI.pdf');
                // 			}
                // 		}
                // 		// set `Content-Type` header
                // 		xhr.setRequestHeader('Content-Type', 'application/json');
                // 		xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                // 		xhr.responseType = 'blob';
                // 		// send rquest with JSON payload
                // 		xhr.send(JSON.stringify(data));	
                // 		$scope.isRouteLoading = false;
                // 	})
                // })
            }


            $scope.ResumeMedis = function () {

                $q.all([
                    medifirstService.get("emr/get-resume-medis-inap/" + $scope.dataPasienSelected.nocm)
                ]).then(function (res) {
                    if (res[0].statResponse) {
                        var result = res[0].data.data
                        if (result.length > 0) {
                            for (let index = 0; index < result.length; index++) {
                                result[index].no = index + 1
                            }
                        }

                        $scope.sourceResumeHead = new kendo.data.DataSource({
                            data: result,
                            pageSize: 20,

                        });
                    }

                    $scope.popUpResumeMedis.center().open();

                    $scope.isRouteLoading = false;
                }, (error) => {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }

            $scope.resumeOptHead = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="showInput()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                // },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tglresume", title: "Tgl Resume", width: 150 },
                    {
                        field: "koderesume",
                        title: "Kode Resume",
                        width: 150,
                        template: "<button class=\"k-button custom-button\" ng-click=\"cetakResumeMedis(dataItem)\" style=\"margin:0 0 5px\">#: koderesume #</button>",
                    },
                    { field: "noregistrasi", title: "No Registrasi", width: 150 },
                    { field: "namaruangan", title: "Ruangan", width: 150 },
                    { field: "namadokter", title: "Pegawai", width: 150 },
                    { field: "ringkasanriwayatpenyakit", title: "Ringkasan Riwayat Penyakit", width: 250 },
                    { field: "pemeriksaanfisik", title: "Pemerisaan Fisik", width: 250 },
                    { field: "pemeriksaanpenunjang", title: "Pemerisaan Penunjang", width: 250 },
                    { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 250 },
                    { field: "diagnosisawal", title: "Diagnosi Awal", width: 150 },
                    { field: "diagnosissekunder", title: "Diagnosis Sekunder", width: 150 },
                    { field: "diet", title: "Diet", width: 150 },
                    { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 150 },
                    { field: "hasillab", title: "Hasil Lab", width: 150 },
                    { field: "instruksianjuran", title: "Intruksi", width: 150 },
                    { field: "kondisiwaktukeluar", title: "Kondisi Keluar", width: 150 },
                    { field: "pengobatandilanjutkan", title: "Pengobatan Dilanjutkan", width: 150 },
                    { field: "tindakanprosedur", title: "Tindakan Prosedur", width: 150 },
                    { field: "terapi", title: "Terapi", width: 120 },

                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusHead }, { name: "edit", text: "Edit", click: editHead }], title: "&nbsp;", width: 120 }
                ],

            };


            $scope.cetakResumeMedis = function (dataItem) {

                debugger
                // if ($scope.modelGrid == undefined) {
                //     toastr.error('Pilih data dulu')
                //     return
                // }
                // var user = medifirstService.getPegawaiLogin();

                // var billing = "Rp " + parseFloat($scope.item.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // var deposit = "Rp " + parseFloat($scope.item.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                // $scope.isRouteLoading = true;
                // medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {

                // 	for (var i = 0; i < dat.data.details.length; i++)
                // 	{	
                // 		if(dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter=="-" )
                // 		{
                // 			if(dat.data.details[i].norec != null){
                // 				alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' +  dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' +  dat.data.details[i].tglPelayanan)
                // 				return
                // 			}
                // 		}
                // 	}
                // medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                // var qrcodedokter = dataItem.namadokter;
                // var qrcodedokter = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-dokter?reg="+$scope.modelGrid.noregistrasi;
                // var qrcodepasien = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-pasien?reg="+$scope.modelGrid.noregistrasi;
                // debugger;

                // 	var data = {
                // 		"gambarLogo": "logodokkes.jpg",
                // 		"paramKey": ["namaRS", "tgllahirRS","alamatRS","noregistrasi","nocm","namapasien","namaruangan","jeniskelamin","tgllahir","tglregistrasi","tglpulang","kelompokpasien","diagnosisawal","alergi","hasillab","diet","instruksianjuran","kondisiwaktukeluar","pengobatandilanjutkan","tglkontrolpoli","ringkasanriwayatpenyakit","pemeriksaanfisik","pemeriksaanpenunjang","alasanrawat","kondisiklinis","terapi","hasilkonsultasi","norec","namadiagnosaprimary","kddiagnosaprimary","namadiagnosasecondary","kddiagnosasecondary","namadiagnosatindakan","kddiagnosatindakan","qrcodedokter","qrcodepasien"],
                // 		"paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",$scope.dataPasienSelected.noregistrasi,
                // 				$scope.dataPasienSelected.nocm,$scope.dataPasienSelected.namapasien,$scope.dataPasienSelected.namaruangan,dataItem.jeniskelamin,dataItem.tgllahir,dataItem.tglregistrasi,dataItem.tglpulang,dataItem.kelompokpasien,dataItem.diagnosisawal,dataItem.alergi,dataItem.hasillab,dataItem.diet,dataItem.instruksianjuran,dataItem.kondisiwaktukeluar,dataItem.pengobatandilanjutkan,dataItem.tglkontrolpoli,dataItem.ringkasanriwayatpenyakit,dataItem.pemeriksaanfisik,dataItem.pemeriksaanpenunjang,dataItem.alasanrawat,dataItem.kondisiklinis,dataItem.terapi,dataItem.hasilkonsultasi,dataItem.norec,dataItem.namadiagnosaprimary,dataItem.kddiagnosaprimary,dataItem.namadiagnosasecondary,dataItem.kddiagnosasecondary,dataItem.namadiagnosatindakan,dataItem.kddiagnosatindakan,qrcodedokter,qrcodepasien],
                // 		"paramType" : ["","date","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]
                // 	};


                var tglresume = '';
                tglresume = moment(dataItem.tglresume).format('DD-MM-YYYY')
                var namadokter = dataItem.namadokter;
                var noresep = dataItem.noresep;
                var qrcodedokter = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-dokter?reg=" + dataItem.noregistrasi;
                var qrcodepasien = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-pasien?reg=" + dataItem.noregistrasi;

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahirRS", "alamatRS", "noregistrasi", "nocm", "namapasien", "namaruangan", "jeniskelamin", "tgllahir", "tglregistrasi", "tglpulang", "kelompokpasien", "diagnosisawal", "alergi", "hasillab", "diet", "instruksianjuran", "kondisiwaktukeluar", "pengobatandilanjutkan", "tglkontrolpoli", "ringkasanriwayatpenyakit", "pemeriksaanfisik", "pemeriksaanpenunjang", "alasanrawat", "kondisiklinis", "terapi", "hasilkonsultasi", "norec", "namadiagnosaprimary", "kddiagnosaprimary", "namadiagnosasecondary", "kddiagnosasecondary", "namadiagnosatindakan", "kddiagnosatindakan", "qrcodedokter", "qrcodepasien", "namadokter", "obatobat", "tglresume", "noresep"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", dataItem.noregistrasi,
                        dataItem.nocm, dataItem.namapasien, dataItem.namaruangan, dataItem.jeniskelamin, dataItem.tgllahir, dataItem.tglregistrasi, dataItem.tglpulang, dataItem.kelompokpasien, dataItem.diagnosisawal, dataItem.alergi, dataItem.hasillab, dataItem.diet, dataItem.instruksianjuran, dataItem.kondisiwaktukeluar, dataItem.pengobatandilanjutkan, dataItem.tglkontrolpoli, dataItem.ringkasanriwayatpenyakit, dataItem.pemeriksaanfisik, dataItem.pemeriksaanpenunjangaddlab, dataItem.alasanrawat, dataItem.kondisiklinis, dataItem.terapi, dataItem.hasillab, dataItem.norec, dataItem.namadiagnosaprimary, dataItem.kddiagnosaprimary, dataItem.namadiagnosasecondary, dataItem.kddiagnosasecondary, dataItem.namadiagnosatindakan, dataItem.kddiagnosatindakan, qrcodedokter, qrcodepasien, namadokter, dataItem.obatobat, tglresume, noresep
                    ],
                    "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('192.168.1.116') > -1) {
                    xhr.open('POST', 'http://192.168.1.116:8797/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/resumemedis.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/resumemedis.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/resumemedis.pdf');
                }
                // if($scope.item.jenisPasien=="BPJS" ){
                // 		if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 			xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 			xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 			xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 			xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 		}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 			xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 		}else{
                // 			xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 		}
                // }
                // else if($scope.item.jenisPasien=="Umum/Pribadi" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }else if($scope.item.jenisPasien=="KEMENKES RI" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }
                // else if($scope.item.namaPenjamin =="JASA RAHARJA, PT (BPJS KESEHATAN)" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }
                // else if($scope.item.namaPenjamin =="JASA RAHARJA, PT (UMUM)" ){
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                // 	}
                // }

                // else
                // {
                // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                // 		xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                // 		xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                // 		xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                // 		xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}else{
                // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                // 	}
                // }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
                // })
                // })
            }

            $scope.PopUpCetakKlinik = function () {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                // if (confirm('View Hasil Laboratorium? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                stt = 'true';
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.dataPasienSelected.noReg).then(function (data) {
                    debugger
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }

                    }
                });


                var apd = $scope.item.norec_apd
                var pp = "'" + $scope.item.norec_pp + "'"
                var umur = $scope.item.umurDay
                var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                var dokter = $scope.item.DataPegawai
                var ruangan = $scope.item.Ruangan.namaruangan;
                var dokterPeriksa = $scope.item.DataPegawaiPemeriksa.namalengkap;
                // var client = new HttpClient();

                // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var dokter = $scope.item.DataPegawai
                // var ruangan = $scope.item.Ruangan.namaruangan;
                // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                var catatan = "-";
                if ($scope.item.catatan != undefined) {
                    catatan = $scope.item.catatan;
                }

                var x = "WHERE (pp.noregistrasifk = '" + apd + "')and (pp.norec in (" + pp + ')) and hh.flag is not null'
                var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.dataPasienSelected.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "RS BHAYANGKARA TK IV CIANJUR", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap,
                        x, umur, $scope.dataPasienSelected.objectjeniskelaminfk, tgl, tglhasil, dokter.namalengkap, ruangan, y, diagnosa.toString(), dokterPeriksa.toString(), catatan
                    ],
                    "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        // pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        // win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });

                var objSave = {
                    norec_pp: editkenNorecPP,
                    tanggalPelayanan: tgl
                }

                medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                    $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    loadDataNosep()
                });
            }

            $scope.RincianObat = function () {
                // if ($scope.selectedData2.length != 0) {

                var stt = 'false'
                if (confirm('View Label resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var Produkfk = ''

                var noreg = $scope.item.noReg

                var user = medifirstService.getPegawaiLogin();

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresepceklis=1&nores=' + noreg + '&view=' + stt + '&user=' + user.namaLengkap + '&produkfk=' + Produkfk, function (response) { });
            }

            // $scope.RincianObatApt = function () {
            // 	debugger
            // 	$scope.isRouteLoading = true;
            // 	medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
            // 		$scope.isRouteLoading = false;
            // 		var struk = "";
            // 		var kwitansi = "";
            // 		var stt = 'false'
            // 		var kdruangan=""
            // 		var noreg = $scope.dataPasienSelected.noregistrasi
            // 		var user = medifirstService.getPegawaiLogin();
            // 		debugger
            // 		if ($scope.item.ruangan != undefined){
            // 			kdruangan = $scope.item.ruangan.namaruangan;
            // 		} 
            // 		if (confirm('View Rincian Obat & Alkes? ')) {
            // 			// Save it!
            // 			stt = 'true';
            // 		} else {
            // 			// Do nothing!
            // 			stt = 'false'
            // 		}
            // 		// if ($scope.item.jenisPasien != "BPJS") {
            // 		medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
            // 			var client = new HttpClient();
            // 			medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
            // 				var client = new HttpClient();
            // 				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkesApt=1&strNoregistrasi=' + noreg + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + user.namaLengkap + '&kdruangan=' + "" + '&view=' + stt + '&apt=1', function (response) {
            // 					// do something with response
            // 				});
            // 			})
            // 		})
            // 	});
            // }

            $scope.RincianObatApt = function () {
                debugger

                $scope.isRouteLoading = true;

                var ruanganLast = "";
                var total = "";
                var namauser = "";
                var noreg = $scope.dataPasienSelected.noregistrasi
                var kelas = $scope.dataPasienSelected.namakelasini
                var namakamar = $scope.dataPasienSelected.tarif_rs.namakamar
                var user = medifirstService.getPegawaiLogin();
                namauser = user.namaLengkap
                // if ($scope.dataSelected == undefined || $scope.dataSelected == "")
                // {
                //     alert("Klik Salah Sutu Data!!")
                //     return;
                // }else
                // {
                //      namauser = $scope.dataSelected.detail.userData.namauser;
                // }
                // medifirstService.get("tatarekening/detail-tagihan/" + noreg + '?jenisdata=bill').then(function (dat) {
                medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + noreg, true).then(function (dat) {
                    ruanganLast = dat.data[0].namaruangan;
                    medifirstService.get("tatarekening/get-data-login-cetakan?noregistrasi=" + noreg, true).then(function (dat) {
                        total = "Rp." + " " + parseFloat(dat.data[0].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var data = {
                            "gambarLogo": "logo_rs.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "lastruangan", "total", "kelas", "namakamar"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", namauser, noreg,
                                ruanganLast, total, kelas, namakamar
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", ""]
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
                            xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingApotik.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:1002/generic/report/rekapbillingApotik.pdf');
                        } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/rekapbillingApotik.pdf');
                        } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                            xhr.open('POST', '/jasper1generic/report/rekapbillingApotik.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:1002/generic/report/rekapbillingApotik.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingApotik.pdf');
                        }

                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    });

                });
                // });
            }

            $scope.Cetak = function () {

                var user = medifirstService.getPegawaiLogin();
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.dataPasienSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    var billing = "Rp " + parseFloat(dat.data.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var deposit = "Rp " + parseFloat(dat.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = dat.data.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat(dat.data.bayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if (dat.data.jenisPasien != "Umum/Pribadi") {
                            kelas = dat.data.kelasPenjamin
                            // bayar = "0"
                        }

                        if (dat.data.deposit > 0) {
                            sisa = dat.data.deposit - parseFloat(dat.data.bayar)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if (dat.data.nosep != "" && dat.data.nosep != null) {
                            nosep = dat.data.nosep
                        }
                        debugger;
                        var x = "";
                        if ($scope.item.cetakx == "sudah") {
                            x = " nokwitansi is not null and noregistrasi= '" + $scope.dataPasienSelected.noregistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        } else if ($scope.item.cetakx == "belum") {
                            x = " nokwitansi is null and noregistrasi= '" + $scope.dataPasienSelected.noregistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        } else {
                            x = " noregistrasi='" + $scope.dataPasienSelected.noregistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep", "where"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap.toString(), $scope.dataPasienSelected.noregistrasi,
                                dat.data.noCm, dat.data.namaPasien, dat.data.lastRuangan, dat.data.namakamar, kelas, billing, deposit, sisa, dat.data.isi, dat.data.terbilang, bayar, nosep, x
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        if ($scope.item.jenisPasien == "BPJS") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rincianbilling.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "Umum/Pribadi") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rincianbilling.pdf');
                            }
                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rincianbilling.pdf');
                            }
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })
                })

                // $mdDialog.show(confirm).then(function() {
                // debugger
                // var noreg = $scope.dataPasienSelected.noregistrasi
                // $scope.isRouteLoading = true;
                // medifirstService.get("tatarekening/detail-tagihan/" + noreg + '?jenisdata=bill').then(function (dat) {
                // 	$scope.isRouteLoading = false;
                // 	var NoStruk = $scope.dataRincianTagihan;
                // 	var user = medifirstService.getPegawaiLogin();
                // 	var struk = "";
                // 	var kwitansi = "";
                // 	var stt = 'false'
                // 	if (confirm('View Rincian Biaya? ')) {
                // 		// Save it!
                // 		stt = 'true';
                // 	} else {
                // 		// Do nothing!
                // 		stt = 'false'
                // 	}
                // 	// if ($scope.item.jenisPasien != "BPJS") {
                // 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                // 		var client = new HttpClient();
                // 		debugger;
                // 		client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + noreg + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + user.namaLengkap + '&cetakan=' + $scope.item.cetakx +'&view=' + stt, function (response) {
                // 			// do something with response
                // 		});
                // 	})
                // 	// }else{
                // 	// 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                // 	//              	var client = new HttpClient(); 
                // 	//               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
                // 	//                   // do something with response
                // 	//               });
                // 	//           	})
                // 	// }
                // });
            }
            $scope.Cetakv2 = function () {
                $scope.popupCetak2.center().open();
            }

            $scope.UbahDokter = function () {
                $scope.cboDokter = true
                $scope.cboUbahDokter = false
            }
            $scope.batal = function () {
                $scope.cboDokter = false
                $scope.cboUbahDokter = true
            }
            $scope.batald = function () {
                // $scope.cboDiagnosa = false
                // $scope.cboDiagnosa1 = false
                // $scope.cboInputDiagnosa = true
                $scope.dataSelected = {};
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosisPrimer;
                delete $scope.item.namaRuangan;
                loaaaaaaad();
            }

            $scope.batal1d = function () {
                // $scope.cboDiagnosa = false
                // $scope.cboDiagnosa1 = false
                // $scope.cboInputDiagnosa = true
                // delete $scope.item.jenisDiagnosis;
                $scope.dataSelected1 = {};
                delete $scope.item.diagnosisPrimer1;
                delete $scope.item.namaRuangan1;
                loaaaaaaad();
            }
            $scope.PasienPulang = function () {
                if ($scope.dataPasienSelected.tglpulang != undefined) {
                    window.messageContainer.error("Pasien Sudah Dipulangkan!!!");
                    return;
                }
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih Data Pasien dulu', 'Caution');
                } else {
                    medifirstService.get('registrasi/get-norec-apd?noreg=' + $scope.dataPasienSelected.noregistrasi +
                        '&ruangId=' + $scope.dataPasienSelected.ruanganid).then(function (e) {
                            if (e.data.length > 0) {
                                $state.go('PindahPulangPasien', {
                                    norecPD: $scope.dataPasienSelected.norec,
                                    norecAPD: e.data[0].norec_apd
                                });
                                var CachePindah = $scope.dataPasienSelected.ruanganid
                                cacheHelper.set('CachePindah', CachePindah);
                            }

                        })

                }
                // var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
                // $scope.cbopasienpulang = true
                // $scope.cboUbahDokter=false
                // if ($scope.dataPasienSelected.tglpulang != null){
                // 	$scope.item.tanggalPulang=$scope.dataPasienSelected.tglpulang
                // }else{
                // 	$scope.item.tanggalPulang=tglpulang
                // }				
            }

            $scope.batalsimpantglpulang = function () {
                $scope.cbopasienpulang = false
                $scope.cboUbahDokter = true
            }


            $scope.new_claim = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "new_claim"
                        },
                        "data": {
                            "nomor_kartu": dataSave[i].nomor_kartu,
                            "nomor_sep": dataSave[i].nomor_sep,
                            "nomor_rm": dataSave[i].nomor_rm,
                            "nama_pasien": dataSave[i].nama_pasien,
                            "tgl_lahir": dataSave[i].tgl_lahir,
                            "gender": dataSave[i].gender
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // loadDataNosep();				
                })
            }
            $scope.new_claim2 = function () {
                var status = true
                for (var i = 0; i < $scope.dataDaftarPasienPulang._data.length; i++) {
                    const elem = $scope.dataDaftarPasienPulang._data[i]
                    if (elem.noverifikasi == null) {
                        status = false
                        break
                    }
                }
                if (!status) {
                    toastr.error('Harus Verifikasi Piutang Dulu')
                    return
                }

                $scope.isRouteLoading = true;
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "new_claim"
                        },
                        "data": {
                            "nomor_kartu": dataSave[i].nomor_kartu,
                            "nomor_sep": dataSave[i].nomor_sep,
                            "nomor_rm": dataSave[i].nomor_rm,
                            "nama_pasien": dataSave[i].nama_pasien,
                            "tgl_lahir": dataSave[i].tgl_lahir,
                            "gender": dataSave[i].gender
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                // 	medifirstService.post('bridging/inacbg/save-bridging-inacbg',objData).then(function(e){
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "set_claim_data",
                            "nomor_sep": dataSave[i].nomor_sep
                        },
                        "data": {
                            "nomor_sep": dataSave[i].nomor_sep, //"0901R001TEST0001",    
                            "nomor_kartu": dataSave[i].nomor_kartu, //"233333",    
                            "tgl_masuk": dataSave[i].tgl_masuk, //"2017-11-20 12:55:00",    
                            "tgl_pulang": dataSave[i].tgl_pulang, //"2017-12-01 09:55:00",    
                            "jenis_rawat": dataSave[i].jenis_rawat, //"1",    
                            "kelas_rawat": dataSave[i].kelas_rawat, //"1",    
                            "adl_sub_acute": dataSave[i].adl_sub_acute, //"15",    
                            "adl_chronic": dataSave[i].adl_chronic, //"12",    
                            "icu_indikator": dataSave[i].icu_indikator, //"1",    
                            "icu_los": dataSave[i].icu_los, //"2",    
                            "ventilator_hour": dataSave[i].ventilator_hour, //"5",    
                            "upgrade_class_ind": dataSave[i].upgrade_class_ind, //"1",    
                            "upgrade_class_class": dataSave[i].upgrade_class_class, //"vip",    
                            "upgrade_class_los": dataSave[i].upgrade_class_los, //"5",    
                            "add_payment_pct": dataSave[i].add_payment_pct, //"35",    
                            "birth_weight": dataSave[i].birth_weight, //"0",    
                            "discharge_status": dataSave[i].discharge_status, //"1",    
                            "diagnosa": dataSave[i].diagnosa, //"S71.0#A00.1",    
                            "procedure": dataSave[i].procedure, //"81.52#88.38",    
                            "tarif_rs": {
                                "prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah, //"300000",      
                                "prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah, //"20000000",      
                                "konsultasi": dataSave[i].tarif_rs.konsultasi, //"300000",      
                                "tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli, //"200000",      
                                "keperawatan": dataSave[i].tarif_rs.keperawatan, // "80000",      
                                "penunjang": dataSave[i].tarif_rs.penunjang, //"1000000",      
                                "radiologi": dataSave[i].tarif_rs.radiologi, //"500000",      
                                "laboratorium": dataSave[i].tarif_rs.laboratorium, //"600000",      
                                "pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah, //"150000",      
                                "rehabilitasi": dataSave[i].tarif_rs.rehabilitasi, //"100000",      
                                "kamar": dataSave[i].tarif_rs.kamar, //"6000000",      
                                "rawat_intensif": dataSave[i].tarif_rs.rawat_intensif, //"2500000",      
                                "obat": dataSave[i].tarif_rs.obat, //"2000000",  
                                "obat_kronis": dataSave[i].tarif_rs.obat_kronis,
                                "obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
                                "alkes": dataSave[i].tarif_rs.alkes, //"500000",      
                                "bmhp": dataSave[i].tarif_rs.bmhp, //"400000",      
                                "sewa_alat": dataSave[i].tarif_rs.sewa_alat, //"210000"    
                            },
                            "tarif_poli_eks": dataSave[i].tarif_poli_eks, //"100000",    
                            "nama_dokter": dataSave[i].nama_dokter, //"RUDY, DR",    
                            "kode_tarif": dataSave[i].kode_tarif, //"AP",    
                            "payor_id": dataSave[i].payor_id, //"3",    
                            "payor_cd": dataSave[i].payor_cd, //"JKN",    
                            "cob_cd": dataSave[i].cob_cd, //"0001",
                            // "coder_nik": '123123123123' //"123123123123" 
                            "coder_nik": $scope.dataLogin.noIdentitas,
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // loadDataNosep();	

                    $scope.isRouteLoading = false;
                }, function (error) {
                    $scope.isRouteLoading = false;
                })
                // })
            }
            $scope.grouping = function () {
                if ($scope.dataPasienSelected.status == 'unverifikasi') {
                    toastr.info('Status Bilingan belum di Verifikasi!!!')
                    return;
                }
                var stt = 'false'
                var covid19_status_cd = ''
                var covid19_cc_ind = '0'
                if ($scope.dataPasienSelected.statuscovid == 1) {
                    if ($scope.dataPasienSelected.noidentitas == "") {
                        toastr.info('NO IDENTITAS KOSONG!!!')
                        return;
                    }

                    if (confirm('Positif Covid-19 ? ')) {
                        // Save it!
                        stt = 'true';
                        covid19_status_cd = 3
                    } else {
                        // Do nothing!
                        stt = 'false'
                        if (confirm('PDP Covid-19 ? ')) {
                            // Save it!
                            stt = 'true';
                            covid19_status_cd = 2
                        } else {
                            // Do nothing!
                            stt = 'false'
                            if (confirm('ODP Covid-19 ? ')) {
                                // Save it!
                                stt = 'true';
                                covid19_status_cd = 1
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }
                        }
                    }
                    if (covid19_status_cd == 0) {
                        toastr.error('JENIS PASIEN COVID BELUM DITENTUKAN', 'COVID-19');
                        return;
                    }

                    if (confirm('comorbidity/complexity ? ')) {
                        stt = 'true';
                        covid19_cc_ind = '1'
                    } else {
                        stt = 'false';
                    }

                } else {
                    if ($scope.dataPasienSelected.nosep == "") {
                        toastr.error('NOSEP PASIEN BELUM TERISI', 'INACBG');
                        return;
                    } else if ($scope.dataPasienSelected.nosep == null) {
                        toastr.error('NOSEP PASIEN BELUM TERISI', 'INACBG');
                        return;
                    } else if ($scope.dataPasienSelected.nosep == undefined) {
                        toastr.error('NOSEP PASIEN BELUM TERISI', 'INACBG');
                        return;
                    }
                }

                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.dataPasienSelected.nosep).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        if (moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD') != e.data.response.tglSep) {
                            toastr.error('Tanggal SEP ' + e.data.response.tglSep + ' Berbeda Dengan Tanggal Registrasi ' + moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'))
                            return
                        }
                        if ($scope.dataPasienSelected.deptid != 16) {
                            var dt1 = {}
                            var dt2 = []
                            for (var i = dataSave.length - 1; i >= 0; i--) {
                                if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
                                    dt1 = {
                                        "metadata": {
                                            "method": "new_claim"
                                        },
                                        "data": {
                                            "nomor_kartu": dataSave[i].nomor_kartu,
                                            "nomor_sep": dataSave[i].nomor_sep,
                                            "nomor_rm": dataSave[i].nomor_rm,
                                            "nama_pasien": dataSave[i].nama_pasien,
                                            "tgl_lahir": dataSave[i].tgl_lahir,
                                            "gender": dataSave[i].gender
                                        }
                                    }
                                    dt2.push(dt1)
                                }
                            }

                            var objData = {
                                "data": dt2
                            }
                            for (var i = dataSave.length - 1; i >= 0; i--) {
                                if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
                                    dt1 = {
                                        "metadata": {
                                            "method": "set_claim_data",
                                            "nomor_sep": dataSave[i].nomor_sep
                                        },
                                        "data": {
                                            "nomor_sep": dataSave[i].nomor_sep, //"0901R001TEST0001",    
                                            "nomor_kartu": dataSave[i].nomor_kartu, //"233333",    
                                            "tgl_masuk": dataSave[i].tgl_masuk, //"2017-11-20 12:55:00",    
                                            "tgl_pulang": dataSave[i].tgl_pulang, //"2017-12-01 09:55:00",    
                                            "jenis_rawat": dataSave[i].jenis_rawat, //"1",    
                                            "kelas_rawat": dataSave[i].kelas_rawat, //"1",    
                                            "adl_sub_acute": dataSave[i].adl_sub_acute, //"15",    
                                            "adl_chronic": dataSave[i].adl_chronic, //"12",    
                                            "icu_indikator": dataSave[i].icu_indikator, //"1",    
                                            "icu_los": dataSave[i].icu_los, //"2",    
                                            "ventilator_hour": dataSave[i].ventilator_hour, //"5",    
                                            "upgrade_class_ind": "0", //dataSave[i].upgrade_class_ind,    //"1",    
                                            "upgrade_class_class": dataSave[i].upgrade_class_class, //"vip",    
                                            "upgrade_class_los": dataSave[i].upgrade_class_los, //"5",    
                                            "add_payment_pct": "75", //dataSave[i].add_payment_pct ,    //"35",    
                                            "birth_weight": $scope.dataPasienSelected.beratbadan, //dataSave[i].birth_weight ,    //"0",    
                                            "discharge_status": dataSave[i].discharge_status, //"1",    
                                            "diagnosa": dataSave[i].diagnosa, //"S71.0#A00.1",    
                                            "procedure": dataSave[i].procedure, //"81.52#88.38", 
                                            "diagnosa_inagrouper": dataSave[i].diagnosa, //"S71.0#A00.1",    
                                            "procedure_inagrouper": dataSave[i].procedure, //"81.52#88.38", 
                                            "tarif_rs": {
                                                "prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah, //"300000",      
                                                "prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah, //"20000000",      
                                                "konsultasi": dataSave[i].tarif_rs.konsultasi, //"300000",      
                                                "tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli, //"200000",      
                                                "keperawatan": dataSave[i].tarif_rs.keperawatan, // "80000",      
                                                "penunjang": dataSave[i].tarif_rs.penunjang, //"1000000",      
                                                "radiologi": dataSave[i].tarif_rs.radiologi, //"500000",      
                                                "laboratorium": dataSave[i].tarif_rs.laboratorium, //"600000",      
                                                "pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah, //"150000",      
                                                "rehabilitasi": dataSave[i].tarif_rs.rehabilitasi, //"100000",      
                                                "kamar": dataSave[i].tarif_rs.kamar, //"6000000",      
                                                "rawat_intensif": dataSave[i].tarif_rs.rawat_intensif, //"2500000",      
                                                "obat": dataSave[i].tarif_rs.obat, //"2000000",  
                                                "obat_kronis": dataSave[i].tarif_rs.obat_kronis,
                                                "obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
                                                "alkes": dataSave[i].tarif_rs.alkes, //"500000",      
                                                "bmhp": dataSave[i].tarif_rs.bmhp, //"400000",      
                                                "sewa_alat": dataSave[i].tarif_rs.sewa_alat, //"210000"    
                                            },
                                            "pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah, //dataSave[i].pemulasaraan_jenazah,
                                            "kantong_jenazah": dataSave[i].kantong_jenazah, //dataSave[i].kantong_jenazah,
                                            "peti_jenazah": dataSave[i].peti_jenazah, //dataSave[i].peti_jenazah,
                                            "plastik_erat": dataSave[i].plastik_erat, //dataSave[i].plastik_erat,
                                            "desinfektan_jenazah": dataSave[i].desinfektan_jenazah, //dataSave[i].desinfektan_jenazah,
                                            "mobil_jenazah": dataSave[i].mobil_jenazah, //dataSave[i].mobil_jenazah,
                                            "desinfektan_mobil_jenazah": dataSave[i].desinfektan_mobil_jenazah, //dataSave[i].desinfektan_mobil_jenazah,
                                            "covid19_status_cd": covid19_status_cd, //dataSave[i].covid19_status_cd,
                                            "nomor_kartu_t": dataSave[i].nomor_kartu_t, //dataSave[i].nomor_kartu_t,
                                            "episodes": dataSave[i].episodes, //dataSave[i].episodes,//"1;12#2;3#6;5",
                                            "covid19_cc_ind": covid19_cc_ind, //dataSave[i].covid19_cc_ind,
                                            "tarif_poli_eks": dataSave[i].tarif_poli_eks, //"100000",    
                                            "nama_dokter": dataSave[i].nama_dokter, //"RUDY, DR",    
                                            "kode_tarif": dataSave[i].kode_tarif, //"AP",    
                                            "payor_id": dataSave[i].payor_id, //"3",    
                                            "payor_cd": dataSave[i].payor_cd, //"JKN",    
                                            "cob_cd": dataSave[i].cob_cd, //"0001",
                                            // "coder_nik": '123123123123' //"123123123123"
                                            "coder_nik": $scope.dataLogin.noIdentitas,
                                        }
                                    }
                                    dt2.push(dt1)
                                }
                            }

                            var objData = {
                                "data": dt2
                            }
                            medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                var dt1 = {}
                                var dt2 = []

                                // for (var i = dataSave.length - 1; i >= 0; i--) {
                                dt1 = {
                                    "metadata": {
                                        "method": "grouper",
                                        "stage": "1"
                                    },
                                    "data": {
                                        // "nomor_sep": dataSave[i].nomor_sep 
                                        "nomor_sep": $scope.dataPasienSelected.nosep
                                    }
                                }
                                dt2.push(dt1)
                                // }


                                var objData = {
                                    "data": dt2
                                }
                                var totaldijamin = "";
                                var hakkelas = "";
                                var biayanaikkelas = "0";
                                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                    // simpan response ke database
                                    responData = e.data.dataresponse;
                                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                                    toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
                                    if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
                                        toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
                                        return;
                                    }
                                    // if(dataSave[0].jenis_rawat==2){
                                    if ($scope.dataPasienSelected.deptid != 16) {
                                        totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
                                    } else {
                                        hakkelas = responData[0].dataresponse.response.kelas
                                        if (hakkelas == "kelas_1") {
                                            totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
                                        } else if (hakkelas == "kelas_2") {
                                            totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
                                        } else if (hakkelas == "kelas_3") {
                                            totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
                                        }
                                        if ($scope.dataPasienSelected.namakelas != $scope.dataPasienSelected.namakelasdaftar) {
                                            biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
                                            if (biayanaikkelas < 0) {
                                                biayanaikkelas = 0
                                            }
                                        }
                                    }
                                    $scope.cbgcode = responData[0].dataresponse.response.cbg.code
                                    $scope.cbgdescription = responData[0].dataresponse.response.cbg.description
                                    $scope.totalInacbg = $scope.formatRupiah(totaldijamin, 'Rp. ')
                                    $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, 'Rp. ')
                                    var dataproposi = {
                                        "noregistrasifk": $scope.dataPasienSelected.norec,
                                        "totalDijamin": totaldijamin,
                                        "biayaNaikkelas": biayanaikkelas,
                                        "cbgcode": $scope.cbgcode,
                                        "cbgdescription": $scope.cbgdescription
                                    }
                                    medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
                                        //ini untuk proposional kan utang per tindakan
                                    })
                                    loadDataNosep()
                                    if (responData[0].dataresponse.special_cmg_option.length > 0) {
                                        toastr.info('Terdeteksi Top-up CMG Options')
                                        dataSEPCMG = responData[0].datarequest.data.nomor_sep
                                        var responOptions = responData[0].dataresponse.special_cmg_option
                                        var spesialDrug = []
                                        var specialProcedure = []
                                        var specialProsthesis = []
                                        var specialInvestigation = []
                                        for (let i = 0; i < responOptions.length; i++) {
                                            const element = responOptions[i];
                                            if (element.type == 'Special Drug') {
                                                spesialDrug.push(element)
                                            }
                                            if (element.type == 'Special Procedure') {
                                                specialProcedure.push(element)
                                            }
                                            if (element.type == 'Special Prosthesis') {
                                                specialProsthesis.push(element)
                                            }
                                            if (element.type == 'Special Investigation') {
                                                specialInvestigation.push(element)
                                            }
                                        }
                                        $scope.listspecialdrug = spesialDrug
                                        $scope.listspecialprocedure = specialProcedure
                                        $scope.listspecialprosthesis = specialProsthesis
                                        $scope.listspecialinvestigation = specialInvestigation
                                    }
                                })

                                $scope.isRouteLoading = false;
                            })
                        } else {
                            medifirstService.get('bridging/inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.dataPasienSelected.norec +
                                '&namakelas=' + $scope.dataPasienSelected.namakelas).then(function (e) {
                                    var resp = e.data
                                    var dt1 = {}
                                    var dt2 = []
                                    for (var i = dataSave.length - 1; i >= 0; i--) {
                                        if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
                                            dt1 = {
                                                "metadata": {
                                                    "method": "new_claim"
                                                },
                                                "data": {
                                                    "nomor_kartu": dataSave[i].nomor_kartu,
                                                    "nomor_sep": dataSave[i].nomor_sep,
                                                    "nomor_rm": dataSave[i].nomor_rm,
                                                    "nama_pasien": dataSave[i].nama_pasien,
                                                    "tgl_lahir": dataSave[i].tgl_lahir,
                                                    "gender": dataSave[i].gender
                                                }
                                            }
                                            dt2.push(dt1)
                                        }
                                    }

                                    var objData = {
                                        "data": dt2
                                    }
                                    // manageTataRekening.savebridginginacbg(objData).then(function(e){
                                    for (var i = dataSave.length - 1; i >= 0; i--) {
                                        if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
                                            dt1 = {
                                                "metadata": {
                                                    "method": "set_claim_data",
                                                    "nomor_sep": dataSave[i].nomor_sep
                                                },
                                                "data": {
                                                    "nomor_sep": dataSave[i].nomor_sep, //"0901R001TEST0001",    
                                                    "nomor_kartu": dataSave[i].nomor_kartu, //"233333",    
                                                    "tgl_masuk": dataSave[i].tgl_masuk, //"2017-11-20 12:55:00",    
                                                    "tgl_pulang": dataSave[i].tgl_pulang, //"2017-12-01 09:55:00",    
                                                    "jenis_rawat": dataSave[i].jenis_rawat, //"1",    
                                                    "kelas_rawat": dataSave[i].kelas_rawat, //"1",    
                                                    "adl_sub_acute": dataSave[i].adl_sub_acute, //"15",    
                                                    "adl_chronic": dataSave[i].adl_chronic, //"12",    
                                                    "icu_indikator": resp[0].statusrawatintensiv, //dataSave[i].icu_indikator ,    //"1",    
                                                    "icu_los": resp[0].lamarawatintensiv, //dataSave[i].icu_los ,    //"2",    
                                                    "ventilator_hour": dataSave[i].ventilator_hour, //"5",    
                                                    "upgrade_class_ind": resp[0].statusnaikkelas,    //"1",    dataSave[i].upgrade_class_ind ,
                                                    "upgrade_class_class": resp[0].kelastertinggi, //dataSave[i].upgrade_class_class ,    //"vip",    
                                                    "upgrade_class_los": resp[0].lamarawatnaikkelas, //dataSave[i].upgrade_class_los ,    //"5",    
                                                    "add_payment_pct": "75", //dataSave[i].add_payment_pct ,    //"35",    
                                                    "birth_weight": $scope.dataPasienSelected.beratbadan, //dataSave[i].birth_weight ,    //"0",    
                                                    "discharge_status": dataSave[i].discharge_status, //"1",    
                                                    "diagnosa": dataSave[i].diagnosa, //"S71.0#A00.1",    
                                                    "procedure": dataSave[i].procedure, //"81.52#88.38",   
                                                    "diagnosa_inagrouper": dataSave[i].diagnosa, //"S71.0#A00.1",    
                                                    "procedure_inagrouper": dataSave[i].procedure, //"81.52#88.38", 
                                                    "tarif_rs": {
                                                        "prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah, //"300000",      
                                                        "prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah, //"20000000",      
                                                        "konsultasi": dataSave[i].tarif_rs.konsultasi, //"300000",      
                                                        "tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli, //"200000",      
                                                        "keperawatan": dataSave[i].tarif_rs.keperawatan, // "80000",      
                                                        "penunjang": dataSave[i].tarif_rs.penunjang, //"1000000",      
                                                        "radiologi": dataSave[i].tarif_rs.radiologi, //"500000",      
                                                        "laboratorium": dataSave[i].tarif_rs.laboratorium, //"600000",      
                                                        "pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah, //"150000",      
                                                        "rehabilitasi": dataSave[i].tarif_rs.rehabilitasi, //"100000",      
                                                        "kamar": dataSave[i].tarif_rs.kamar, //"6000000",      
                                                        "rawat_intensif": dataSave[i].tarif_rs.rawat_intensif, //"2500000",      
                                                        "obat": dataSave[i].tarif_rs.obat, //"2000000",  
                                                        "obat_kronis": dataSave[i].tarif_rs.obat_kronis,
                                                        "obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
                                                        "alkes": dataSave[i].tarif_rs.alkes, //"500000",      
                                                        "bmhp": dataSave[i].tarif_rs.bmhp, //"400000",      
                                                        "sewa_alat": dataSave[i].tarif_rs.sewa_alat, //"210000"    
                                                    },
                                                    "pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah, //dataSave[i].pemulasaraan_jenazah,
                                                    "kantong_jenazah": dataSave[i].kantong_jenazah, //dataSave[i].kantong_jenazah,
                                                    "peti_jenazah": dataSave[i].peti_jenazah, //dataSave[i].peti_jenazah,
                                                    "plastik_erat": dataSave[i].plastik_erat, //dataSave[i].plastik_erat,
                                                    "desinfektan_jenazah": dataSave[i].desinfektan_jenazah, //dataSave[i].desinfektan_jenazah,
                                                    "mobil_jenazah": dataSave[i].mobil_jenazah, //dataSave[i].mobil_jenazah,
                                                    "desinfektan_mobil_jenazah": dataSave[i].desinfektan_mobil_jenazah, //dataSave[i].desinfektan_mobil_jenazah,
                                                    "covid19_status_cd": covid19_status_cd, //dataSave[i].covid19_status_cd,
                                                    "nomor_kartu_t": dataSave[i].nomor_kartu_t, //dataSave[i].nomor_kartu_t,
                                                    "episodes": dataSave[i].episodes, //dataSave[i].episodes,//"1;12#2;3#6;5",
                                                    "covid19_cc_ind": covid19_cc_ind, //dataSave[i].covid19_cc_ind,
                                                    "tarif_poli_eks": dataSave[i].tarif_poli_eks, //"100000",    
                                                    "nama_dokter": dataSave[i].nama_dokter, //"RUDY, DR",    
                                                    "kode_tarif": dataSave[i].kode_tarif, //"AP",    
                                                    "payor_id": dataSave[i].payor_id, //"3",    
                                                    "payor_cd": dataSave[i].payor_cd, //"JKN",    
                                                    "cob_cd": dataSave[i].cob_cd, //"0001",
                                                    // "coder_nik": '123123123123'
                                                    "coder_nik": $scope.dataLogin.noIdentitas,
                                                }
                                            }
                                            dt2.push(dt1)
                                        }
                                    }

                                    var objData = {
                                        "data": dt2
                                    }
                                    medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                        var dt1 = {}
                                        var dt2 = []

                                        // for (var i = dataSave.length - 1; i >= 0; i--) {
                                        dt1 = {
                                            "metadata": {
                                                "method": "grouper",
                                                "stage": "1"
                                            },
                                            "data": {
                                                // "nomor_sep": dataSave[i].nomor_sep 
                                                "nomor_sep": $scope.dataPasienSelected.nosep
                                            }
                                        }
                                        dt2.push(dt1)
                                        // }


                                        var objData = {
                                            "data": dt2
                                        }
                                        var totaldijamin = "";
                                        var hakkelas = "";
                                        var biayanaikkelas = "0";
                                        var top_up_jenazah = "";
                                        medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                            // simpan response ke database
                                            responData = e.data.dataresponse;
                                            toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                                            toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
                                            if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
                                                toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
                                            }
                                            // if(dataSave[0].jenis_rawat==2){
                                            if ($scope.dataPasienSelected.deptid != 16) {
                                                totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
                                            } else if ($scope.dataPasienSelected.statuscovid == 1) {
                                                if (responData[0].dataresponse.response.covid19_data.top_up_jenazah != 0) {
                                                    top_up_jenazah = "";
                                                }
                                                totaldijamin = top_up_jenazah + responData[0].dataresponse.response.covid19_data.top_up_rawat + responData[0].dataresponse.response.covid19_data.top_up_rawat_factor + responData[0].dataresponse.response.covid19_data.top_up_rawat_gross
                                            } else {
                                                hakkelas = responData[0].dataresponse.response.kelas
                                                if (hakkelas == "kelas_1") {
                                                    totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
                                                } else if (hakkelas == "kelas_2") {
                                                    totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
                                                } else if (hakkelas == "kelas_3") {
                                                    totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
                                                }
                                                // if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
                                                if (resp.statusnaikkelas != '0') {
                                                    biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
                                                    if (biayanaikkelas < 0) {
                                                        biayanaikkelas = 0
                                                    }
                                                }
                                            }
                                            $scope.totalInacbg = $scope.formatRupiah(totaldijamin, 'Rp. ')
                                            $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, 'Rp. ')
                                            $scope.cbgcode = responData[0].dataresponse.response.cbg.code
                                            $scope.cbgdescription = responData[0].dataresponse.response.cbg.description
                                            var dataproposi = {
                                                "noregistrasifk": $scope.dataPasienSelected.norec,
                                                "totalDijamin": totaldijamin,
                                                "biayaNaikkelas": biayanaikkelas,
                                                "cbgcode": $scope.cbgcode,
                                                "cbgdescription": $scope.cbgdescription
                                            }
                                            medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
                                                //ini untuk proposional kan utang per tindakan
                                            })
                                            loadDataNosep()
                                            if (responData[0].dataresponse.special_cmg_option.length > 0) {
                                                toastr.info('Terdeteksi Top-up CMG Options')
                                                dataSEPCMG = responData[0].datarequest.data.nomor_sep
                                                var responOptions = responData[0].dataresponse.special_cmg_option
                                                var spesialDrug = []
                                                var specialProcedure = []
                                                var specialProsthesis = []
                                                var specialInvestigation = []
                                                for (let i = 0; i < responOptions.length; i++) {
                                                    const element = responOptions[i];
                                                    if (element.type == 'Special Drug') {
                                                        spesialDrug.push(element)
                                                    }
                                                    if (element.type == 'Special Procedure') {
                                                        specialProcedure.push(element)
                                                    }
                                                    if (element.type == 'Special Prosthesis') {
                                                        specialProsthesis.push(element)
                                                    }
                                                    if (element.type == 'Special Investigation') {
                                                        specialInvestigation.push(element)
                                                    }
                                                }
                                                $scope.listspecialdrug = spesialDrug
                                                $scope.listspecialprocedure = specialProcedure
                                                $scope.listspecialprosthesis = specialProsthesis
                                                $scope.listspecialinvestigation = specialInvestigation
                                            }
                                        })

                                        $scope.isRouteLoading = false;
                                    })

                                })
                        }
                    } else {
                        window.messageContainer.error(e.data.metaData.message + ' ' + e.data.metaData.code);
                    }
                    $scope.isLoadingSEP = false;
                }, function (err) {
                    $scope.isLoadingSEP = false;
                });
            }
            $scope.update_patient = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "update_patient",
                            "nomor_rm": dataSave[i].nomor_rm
                        },
                        "data": {
                            "nomor_kartu": dataSave[i].nomor_kartu,
                            "nomor_rm": dataSave[i].nomor_rm,
                            "nama_pasien": dataSave[i].nama_pasien,
                            "tgl_lahir": dataSave[i].tgl_lahir,
                            "gender": dataSave[i].gender
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // loadDataNosep();				
                })
            }
            $scope.set_claim_data = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "set_claim_data",
                            "nomor_sep": dataSave[i].nomor_sep
                        },
                        "data": {
                            "nomor_sep": dataSave[i].nomor_sep, //"0901R001TEST0001",    
                            "nomor_kartu": dataSave[i].nomor_kartu, //"233333",    
                            "tgl_masuk": dataSave[i].tgl_masuk, //"2017-11-20 12:55:00",    
                            "tgl_pulang": dataSave[i].tgl_pulang, //"2017-12-01 09:55:00",    
                            "jenis_rawat": dataSave[i].jenis_rawat, //"1",    
                            "kelas_rawat": dataSave[i].kelas_rawat, //"1",    
                            "adl_sub_acute": dataSave[i].adl_sub_acute, //"15",    
                            "adl_chronic": dataSave[i].adl_chronic, //"12",    
                            "icu_indikator": dataSave[i].icu_indikator, //"1",    
                            "icu_los": dataSave[i].icu_los, //"2",    
                            "ventilator_hour": dataSave[i].ventilator_hour, //"5",    
                            "upgrade_class_ind": "0", //dataSave[i].upgrade_class_ind,    //"1",    
                            "upgrade_class_class": dataSave[i].upgrade_class_class, //"vip",    
                            "upgrade_class_los": dataSave[i].upgrade_class_los, //"5",    
                            "add_payment_pct": dataSave[i].add_payment_pct, //"35",    
                            "birth_weight": dataSave[i].birth_weight, //"0",    
                            "discharge_status": dataSave[i].discharge_status, //"1",    
                            "diagnosa": dataSave[i].diagnosa, //"S71.0#A00.1",    
                            "procedure": dataSave[i].procedure, //"81.52#88.38",    
                            "tarif_rs": {
                                "prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah, //"300000",      
                                "prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah, //"20000000",      
                                "konsultasi": dataSave[i].tarif_rs.konsultasi, //"300000",      
                                "tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli, //"200000",      
                                "keperawatan": dataSave[i].tarif_rs.keperawatan, // "80000",      
                                "penunjang": dataSave[i].tarif_rs.penunjang, //"1000000",      
                                "radiologi": dataSave[i].tarif_rs.radiologi, //"500000",      
                                "laboratorium": dataSave[i].tarif_rs.laboratorium, //"600000",      
                                "pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah, //"150000",      
                                "rehabilitasi": dataSave[i].tarif_rs.rehabilitasi, //"100000",      
                                "kamar": dataSave[i].tarif_rs.kamar, //"6000000",      
                                "rawat_intensif": dataSave[i].tarif_rs.rawat_intensif, //"2500000",      
                                "obat": dataSave[i].tarif_rs.obat, //"2000000",  
                                "obat_kronis": "0",
                                "obat_kemoterapi": "0",
                                "alkes": dataSave[i].tarif_rs.alkes, //"500000",      
                                "bmhp": dataSave[i].tarif_rs.bmhp, //"400000",      
                                "sewa_alat": dataSave[i].tarif_rs.sewa_alat, //"210000"    
                            },
                            "tarif_poli_eks": dataSave[i].tarif_poli_eks, //"100000",    
                            "nama_dokter": dataSave[i].nama_dokter, //"RUDY, DR",    
                            "kode_tarif": dataSave[i].kode_tarif, //"AP",    
                            "payor_id": dataSave[i].payor_id, //"3",    
                            "payor_cd": dataSave[i].payor_cd, //"JKN",    
                            "cob_cd": dataSave[i].cob_cd, //"0001",
                            // "coder_nik": '123123123123' //"123123123123"  
                            "coder_nik": $scope.dataLogin.noIdentitas,
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // loadDataNosep();				
                })
            }

            $scope.grouper_1 = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "grouper",
                            "stage": "1"
                        },
                        "data": {
                            "nomor_sep": dataSave[i].nomor_sep
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // simpan response ke database		
                })
            }
            $scope.grouper_2 = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "grouper",
                            "stage": "2"
                        },
                        "data": {
                            "nomor_sep": dataSave[i].nomor_sep,
                            "special_cmg": "ambil dari table hasil grouper 1"
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // simpan response ke database	
                })
            }
            $scope.claim_final = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "claim_final"
                    },
                    "data": {
                        "nomor_sep": $scope.dataPasienSelected.nosep, //dataSave[i].nomor_sep,      
                        "coder_nik": $scope.dataLogin.noIdentitas,
                    }
                }
                dt2.push(dt1)
                // }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // response oke saja
                    responData = e.data.dataresponse;
                    // medifirstService.post('tatarekening/simpan-verifikasi-tagihan/', $scope.dataPasienSelected)
                    //     .then(function (e) {
                    loadDataNosep();

                    // });
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                })
            }
            $scope.send_claim = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "send_claim"
                        },
                        "data": {
                            "start_dt": "", //"2016-01-07",      
                            "stop_dt": "", //"2016-01-07",      
                            "jenis_rawat": "", //"1",      
                            "date_type": "", //"2"   
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // response simpan ke database			
                })
            }
            $scope.send_claim_individual = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "send_claim_individual"
                    },
                    "data": {
                        "nomor_sep": $scope.dataPasienSelected.nosep
                    }
                }
                dt2.push(dt1)
                // }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // response simpan ke database	
                    responData = e.data.dataresponse;
                    var datasend = {
                        "noregistrasifk": $scope.dataPasienSelected.norec,
                        "status": "SEND CLAIM"
                    }
                    if (responData[0].dataresponse.metadata.code == "200") {
                        medifirstService.post('bridging/inacbg/update-status-bridging-inacbg', datasend).then(function (e) {
                            //ini untuk proposional kan utang per tindakan
                            loadDataNosep();
                        })
                    }
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                })
            }
            $scope.claim_print = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "claim_print"
                    },
                    "data": {
                        "nomor_sep": $scope.dataPasienSelected.nosep
                    }
                }
                dt2.push(dt1)
                // }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // response simpan ke database	
                    responData = e.data.dataresponse;
                    if (responData[0].dataresponse.metadata.code == 200) {
                        const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
                        const downloadLink = document.createElement("a");
                        var tglprint = moment($scope.now).format('YYYY-MM-DD');
                        // const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";
                        var a = responData[0].datarequest.data.nomor_sep
                        var nama = a.substr(15);
                        const fileName = nama + ".pdf";

                        downloadLink.href = linkSource;
                        downloadLink.download = fileName;
                        downloadLink.click();
                    }
                    // window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                })
            }
            $scope.TopUp = function () {
                if (dataSEPCMG == $scope.dataPasienSelected.nosep) {
                    $scope.item.specialprocedure = ""
                    $scope.item.specialprosthesis = ""
                    $scope.item.specialinvestigation = ""
                    $scope.item.specialdrug = ""
                    $scope.popupCMG.center().open();
                } else {
                    toastr.error('Pasien ini Bukan Top-up CMG Options!')
                }
            }
            $scope.simpangrouper2 = function () {
                var cmg = "";
                if ($scope.item.specialprocedure != undefined) {
                    if (cmg != "") {
                        cmg = cmg + '#' + $scope.item.specialprocedure.code
                    } else {
                        cmg = $scope.item.specialprocedure.code
                    }
                }
                if ($scope.item.specialprosthesis != undefined) {
                    if (cmg != "") {
                        cmg = cmg + '#' + $scope.item.specialprosthesis.code
                    } else {
                        cmg = $scope.item.specialprosthesis.code
                    }
                }
                if ($scope.item.specialinvestigation != undefined) {
                    if (cmg != "") {
                        cmg = cmg + '#' + $scope.item.specialinvestigation.code
                    } else {
                        cmg = $scope.item.specialinvestigation.code
                    }
                }
                if ($scope.item.specialdrug != undefined) {
                    if (cmg != "") {
                        cmg = cmg + '#' + $scope.item.specialdrug.code
                    } else {
                        cmg = $scope.item.specialdrug.code
                    }
                }
                var dt1 = {}
                var dt2 = []

                dt1 = {
                    "metadata": {
                        "method": "grouper",
                        "stage": "2"
                    },
                    "data": {
                        "nomor_sep": $scope.item.targetnoSEP,
                        "special_cmg": cmg //"ambil dari table hasil grouper 1"   
                    }
                }
                dt2.push(dt1)




                var objData = {
                    "data": dt2
                }
                var totaldijamin = "";
                var totaldijamina = "";
                var biayanaikkelas = "0";
                var hakkelas = "";
                var cmglength = "";
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // simpan response ke database
                    responData = e.data.dataresponse;
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                    toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
                    cmglength = responData[0].dataresponse.response.special_cmg
                    // if(dataSave[0].jenis_rawat==2){
                    if ($scope.dataPasienSelected.deptid != 16) {
                        totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
                        for (let i = 0; i < cmglength.length; i++) {
                            const element = cmglength[i];
                            if (element.type == 'Special Drug') {
                                if (totaldijamina != "") {
                                    totaldijamina = totaldijamina + element.tariff
                                } else {
                                    totaldijamina = element.tariff
                                }
                            }
                            if (element.type == 'Special Procedure') {
                                if (totaldijamina != "") {
                                    totaldijamina = totaldijamina + element.tariff
                                } else {
                                    totaldijamina = element.tariff
                                }
                            }
                            if (element.type == 'Special Prosthesis') {
                                if (totaldijamina != "") {
                                    totaldijamina = totaldijamina + element.tariff
                                } else {
                                    totaldijamina = element.tariff
                                }
                            }
                            if (element.type == 'Special Investigation') {
                                if (totaldijamina != "") {
                                    totaldijamina = totaldijamina + element.tariff
                                } else {
                                    totaldijamina = element.tariff
                                }
                            }
                        }
                        totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[0].tarif_inacbg)
                        totaldijamin = totaldijamin + totaldijamina
                        $scope.totalInacbg = $scope.formatRupiah(totaldijamin, 'Rp. ')
                    } else {
                        hakkelas = responData[0].dataresponse.response.kelas
                        // if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
                        // 	biayanaikkelas=responData[0].dataresponse.response.add_payment_amt
                        // }

                        biayanaikkelas = Number($scope.dataPasienSelected.biayanaikkelas)
                        // biayanaikkelas=biayanaikkelas.toFixed(0);
                        if (hakkelas == "kelas_1") {
                            for (let i = 0; i < cmglength.length; i++) {
                                const element = cmglength[i];
                                if (element.type == 'Special Drug') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Procedure') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Prosthesis') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Investigation') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                            }
                            totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[0].tarif_inacbg)
                            totaldijamin = totaldijamin + totaldijamina
                        } else if (hakkelas == "kelas_2") {
                            for (let i = 0; i < cmglength.length; i++) {
                                const element = cmglength[i];
                                if (element.type == 'Special Drug') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Procedure') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Prosthesis') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Investigation') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                            }
                            totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[1].tarif_inacbg)
                            totaldijamin = totaldijamin + totaldijamina
                        } else if (hakkelas == "kelas_3") {
                            for (let i = 0; i < cmglength.length; i++) {
                                const element = cmglength[i];
                                if (element.type == 'Special Drug') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Procedure') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Prosthesis') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                                if (element.type == 'Special Investigation') {
                                    if (totaldijamina != "") {
                                        totaldijamina = totaldijamina + element.tariff
                                    } else {
                                        totaldijamina = element.tariff
                                    }
                                }
                            }
                            totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
                            totaldijamin = totaldijamin + totaldijamina
                        }
                    }
                    $scope.cbgcode = responData[0].dataresponse.response.cbg.code
                    $scope.cbgdescription = responData[0].dataresponse.response.cbg.description
                    $scope.totalInacbg = $scope.formatRupiah(totaldijamin, 'Rp. ')
                    $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, 'Rp. ')
                    var dataproposi = {
                        "noregistrasifk": $scope.dataPasienSelected.norec,
                        "totalDijamin": totaldijamin,
                        "biayaNaikkelas": biayanaikkelas,
                        "cbgcode": $scope.cbgcode,
                        "cbgdescription": $scope.cbgdescription
                    }
                    medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
                        // ini untuk proposional kan utang penjamin per tindakan
                    })
                    loadDataNosep()
                })
            }
            $scope.popupHapus = function () {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                // if($scope.dataLogin.id!=320263){
                // 	window.messageContainer.error("Anda tidak punya akses Hapus klaim!!!");
                //      	return;
                // }
                if ($scope.dataPasienSelected.norec == undefined) {
                    toastr.error('Pilih Data Pasien dulu', 'Caution');
                    return;
                }
                $scope.popupHapusKlaim.center().open();
            }
            $scope.edit_claim = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "reedit_claim"
                    },
                    "data": {
                        "nomor_sep": $scope.dataPasienSelected.nosep, //dataSave[i].nomor_sep,      
                    }
                }
                dt2.push(dt1)
                // }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // response oke saja
                    responData = e.data.dataresponse;
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                    responData = e.data.dataresponse;
                    var datasend = {
                        "noregistrasifk": $scope.dataPasienSelected.norec,
                        "status": "EDIT CLAIM"
                    }
                    if (responData[0].dataresponse.metadata.code == "200") {
                        medifirstService.post('bridging/inacbg/update-status-bridging-inacbg', datasend).then(function (e) {
                            //ini untuk proposional kan utang per tindakan
                            loadDataNosep();
                        })
                    }
                })
            }
            $scope.popupEdit = function () {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                // if($scope.dataLogin.id!=320263){
                // 	window.messageContainer.error("Anda tidak punya akses edit klaim!!!");
                //      	return;
                // }
                if ($scope.dataPasienSelected.norec == undefined) {
                    toastr.error('Pilih Data Pasien dulu', 'Caution');
                    return;
                }
                $scope.popupEditKlaim.center().open();
            }
            $scope.genPengajuan = function () {
                if ($scope.dataPasienSelected.nosep == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.item.icusatu = undefined
                $scope.item.icudua = undefined
                $scope.item.isosatu = undefined
                $scope.item.isodua = undefined
                $scope.item.isotiga = undefined
                $scope.item.isoempat = undefined
                $scope.popupPengajuanKlaim.center().open();
            }
            $scope.push_pengajuan = function () {
                var stt = 'false'
                if (confirm('Generete Pengajuan Klaim Pasien Covid-19? ')) {
                    // Save it!
                    stt = 'true';
                    var dt1 = {}
                    var dt2 = []
                    // for (var i = dataSave.length - 1; i >= 0; i--) {

                    dt1 = {
                        "metadata": {
                            "method": "generate_claim_number"
                        },
                        "data": {
                            "payor_id": "71"
                        }
                    }
                    dt2.push(dt1)
                    // }

                    var objData = {
                        "data": dt2
                    }
                    var Los = "";
                    medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                        responData = e.data.dataresponse[0].dataresponse.response.claim_number;
                        toastr.info(responData, 'Claim Number');
                        if ($scope.item.icusatu != undefined) {
                            Los = '1;' + $scope.item.icusatu
                        }
                        if ($scope.item.icudua != undefined) {
                            if (Los != "") {
                                Los = Los + '#2;' + $scope.item.icudua
                            } else {
                                Los = '2;' + $scope.item.icudua
                            }
                        }
                        if ($scope.item.isosatu != undefined) {
                            if (Los != "") {
                                Los = Los + '#3;' + $scope.item.isosatu
                            } else {
                                Los = '3;' + $scope.item.isosatu
                            }
                        }
                        if ($scope.item.isodua != undefined) {
                            if (Los != "") {
                                Los = Los + '#4;' + $scope.item.isodua
                            } else {
                                Los = '4;' + $scope.item.isodua
                            }
                        }
                        if ($scope.item.isotiga != undefined) {
                            if (Los != "") {
                                Los = Los + '#5;' + $scope.item.isotiga
                            } else {
                                Los = '5;' + $scope.item.isotiga
                            }
                        }
                        if ($scope.item.isoempat != undefined) {
                            if (Los != "") {
                                Los = Los + '#6;' + $scope.item.isoempat
                            } else {
                                Los = '6;' + $scope.item.isoempat
                            }
                        }
                        var postData = {
                            "norec_pa": $scope.dataPasienSelected.norec_pa,
                            "claim_number": responData,
                            "loscovid": Los
                        }
                        medifirstService.post('bridging/inacbg/save-pengajuan-klaim', postData).then(function (e) {
                            $scope.popupPengajuanKlaim.center().close();
                            loadDataNosep();
                        })
                    })
                } else {
                    // Do nothing!
                    stt = 'false'
                }
            }
            $scope.upload = function () {
                var a = document.getElementById("base64textarea").value
                var b = document.getElementById("base64textarea").name
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {

                dt1 = {
                    "metadata": {
                        "method": "file_upload",
                        "nomor_sep": $scope.dataPasienSelected.nosep,
                        "file_class": $scope.item.jenisfaskes,
                        "file_name": b,
                    },
                    "data": a
                }
                dt2.push(dt1)
                // }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    responData = e.data.dataresponse[0].dataresponse.metadata.message;
                    toastr.info(responData, 'file_upload');
                    document.getElementById("base64textarea").value = responData
                })
            }

            var handleFileSelect = function (evt) {
                var files = evt.target.files;
                var file = files[0];
                var a = evt.target.files[0].name;

                if (files && file) {
                    var reader = new FileReader();

                    reader.onload = function (readerEvt) {
                        var binaryString = readerEvt.target.result;
                        document.getElementById("base64textarea").value = btoa(binaryString);
                        document.getElementById("base64textarea").name = a;
                    };

                    reader.readAsBinaryString(file);
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
            $scope.uploadFile = function () {
                if ($scope.dataPasienSelected.nosep == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.popupUploadFile.center().open();
                $scope.item.jenisfaskes = "resumse_medis"
            }
            $scope.listFaskes = [{ id: 1, name: 'resumse_medis' }, { id: 2, name: 'ruang_rawat' }, { id: 3, name: 'laboratorium' }, { id: 4, name: 'radiologi' }, { id: 5, name: 'penunjang_lain' }, { id: 6, name: 'resep_obat' }, { id: 7, name: 'tagihan' }, { id: 8, name: 'kartu_identitas' }, { id: 9, name: 'lain_lain' }]
            $scope.delete_claim = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "delete_claim"
                        },
                        "data": {
                            "nomor_sep": dataSave[i].nomor_sep,
                            // "coder_nik": '123123123123'
                            "coder_nik": $scope.dataLogin.noIdentitas,
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    responData = e.data.dataresponse;
                    var datasend = {
                        "noregistrasifk": $scope.dataPasienSelected.norec,
                        "status": "DELETE CLAIM"
                    }
                    if (responData[0].dataresponse.metadata.code == "200") {
                        medifirstService.post('bridging/inacbg/update-status-bridging-inacbg', datasend).then(function (e) {
                            //ini untuk proposional kan utang per tindakan
                            loadDataNosep();
                        })
                    }
                })
            }
            $scope.cetakPostKlaim = function (x) {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    // $scope.popUpReport.center().open()

                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=postklaim" +
                        '&norec=' + $scope.dataPasienSelected.noregistrasi
                    ).then(function (data) {
                        var data = data.data.data;
                        var totalpostklaim = "";
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (data[i].namaexternal == "kamar")
                                $("#kamar").text(data[i].ttl);
                            if (data[i].namaexternal == "prosedur_non_bedah")
                                $("#prosedur_non_bedah").text(data[i].ttl);
                            if (data[i].namaexternal == "prosedur_bedah")
                                $("#prosedur_bedah").text(data[i].ttl);
                            if (data[i].namaexternal == "konsultasi")
                                $("#konsultasi").text(data[i].ttl);
                            if (data[i].namaexternal == "tenaga_ahli")
                                $("#tenaga_ahli").text(data[i].ttl);
                            if (data[i].namaexternal == "keperawatan")
                                $("#keperawatan").text(data[i].ttl);
                            if (data[i].namaexternal == "penunjang")
                                $("#penunjang").text(data[i].ttl);
                            if (data[i].namaexternal == "radiologi")
                                $("#radiologi").text(data[i].ttl);
                            if (data[i].namaexternal == "laboratorium")
                                $("#laboratorium").text(data[i].ttl);
                            if (data[i].namaexternal == "pelayanan_darah")
                                $("#pelayanan_darah").text(data[i].ttl);
                            if (data[i].namaexternal == "rehabilitasi")
                                $("#rehabilitasi").text(data[i].ttl);
                            if (data[i].namaexternal == "rawat_intensif")
                                $("#rawat_intensif").text(data[i].ttl);
                            if (data[i].namaexternal == "obat")
                                $("#obat").text(data[i].ttl);
                            if (data[i].namaexternal == "obat_kronis")
                                $("#obat_kronis").text(data[i].ttl);
                            if (data[i].namaexternal == "obat_kemoterapi")
                                $("#obat_kemoterapi").text(data[i].ttl);
                            if (data[i].namaexternal == "alkes")
                                $("#alkes").text(data[i].ttl);
                            if (data[i].namaexternal == "bmhp")
                                $("#bmhp").text(data[i].ttl);
                            if (data[i].namaexternal == "sewa_alat")
                                $("#sewa_alat").text(data[i].ttl);
                            totalpostklaim = Number(totalpostklaim) + Number(data[i].ttl)
                        }
                        $("#totalpostklaim").text(totalpostklaim);
                        $("#namapasien").text($scope.dataPasienSelected.namapasien);
                        $("#noregistrasi").text($scope.dataPasienSelected.noregistrasi + '/' + $scope.dataPasienSelected.nocm);
                        $("#tglpulang").text(moment($scope.dataPasienSelected.tglpulang).format('YYYY-MM-DD'));
                        $("#kelompokpasien").text($scope.dataPasienSelected.kelompokpasien);
                        // var gridElement = namagrid,
                        //               printableContent = '';
                        // win = window.open('', '', 'width=800, height=500'),
                        // doc = win.document.open();
                        var htmlStart =
                            '<!DOCTYPE html>' +
                            '<html style="border:none;border-color: white">' +
                            '<head style="border:none;border-color: white">' +
                            // '<div class="header" style="position: fixed;top: 0;">'+
                            // header +
                            '<style>' +
                            'html { font: 11pt sans-serif; }' +
                            '.k-grid { border-top-width: 0; }' +
                            '.k-grid, .k-grid-content { height: auto !important; }' +
                            '.k-grid-content { overflow: visible !important; }' +
                            '.k-grid .k-grid-header th { border-top: none; }' +
                            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                            '</style>' +
                            '</div>' +
                            '</head>' +
                            '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                            '<table  style="border:none; border-color: white">' +
                            '<thead style="border:none;border-color: white">' +
                            '<tr style="border:none;border-color: white">' +
                            '<td style="border:none;border-color: white">' +
                            // '<div class="page-header-space"></div>' +
                            '<div style="border:none;border-color: white">' +
                            // header +	                             
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>'
                        var htmlEnd =
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</body>' +
                            '</div>' +


                            '</html>';
                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        printdata = htmlStart + printdata + htmlEnd;
                        var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                        WindowObject.document.writeln(printdata);
                        WindowObject.document.close();
                        WindowObject.focus();

                    })
                }
            }
            $scope.delete_patient = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "delete_patient"
                        },
                        "data": {
                            "nomor_rm": dataSave[i].nomor_rm,
                            // "coder_nik": '123123123123'
                            "coder_nik": $scope.dataLogin.noIdentitas,
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // 			
                })
            }
            $scope.get_claim_status = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "get_claim_status"
                        },
                        "data": {
                            "nomor_sep": dataSave[i].nomor_sep
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // 			
                })
            }
            $scope.get_claim_data = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "get_claim_data"
                    },
                    "data": {
                        "nomor_sep": $scope.dataPasienSelected.nosep //dataSave[i].nomor_sep
                    }
                }
                dt2.push(dt1)
                // }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // 	
                    var x = e.data.dataresponse;
                    if (x[0].dataresponse.metadata.code == 200) {
                        toastr.info(x[0].dataresponse.metadata.message, 'INACBG');
                    }
                })
            }
            $scope.pull_claim = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "pull_claim"
                        },
                        "data": {
                            "start_dt": "", //"2016-01-07",      
                            "stop_dt": "", //"2016-01-07",      
                            "jenis_rawat": "" //"1"   
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // 			
                })
            }
            $scope.search_diagnosis = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "search_diagnosis"
                        },
                        "data": {
                            "keyword": ""
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // 			
                })
            }
            $scope.search_procedures = function () {
                var dt1 = {}
                var dt2 = []
                for (var i = dataSave.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "search_procedures"
                        },
                        "data": {
                            "keyword": ""
                        }
                    }
                    dt2.push(dt1)
                }

                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // 			
                })
            }
            //debugger
            // $scope.simpantglpulang = function(){
            // 	//debugger
            // 	var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
            // 	var updateTanggal = {
            // 		"noregistrasi": $scope.dataPasienSelected.noregistrasi,
            // 		"tglpulang": tglpulang
            // 	}
            // 	manageTataRekening.saveupdatetglpulang(updateTanggal).then(function(e){
            // 		loadDataNosep();				
            // 	})	
            // 		$scope.cbopasienpulang=false;
            // 		$scope.cboUbahDokter=true;
            // }

            // $scope.klikGrid = function(dataPasienSelected){
            // 	if (dataPasienSelected != undefined) {
            // 		$scope.item.namaDokter = {id:dataPasienSelected.pgid,namalengkap:dataPasienSelected.namadokter}
            // 	}
            // }
            $scope.simpan = function () {
                var objSave = {
                    norec: $scope.dataPasienSelected.norec,
                    objectpegawaifk: $scope.item.namaDokter.id
                }

                manageTataRekening.postSaveDokter(objSave).then(function (e) {
                    loadDataNosep();
                    $scope.cboDokter = false
                    $scope.cboUbahDokter = true
                })

                manageTataRekening.saveUpdateDokter(objSave).then(function (e) {
                    loadDataNosep();
                    $scope.cboDokter = false
                    $scope.cboUbahDokter = true
                })

                /* update dokter pelayanan pasien yang kosong dokternya */
                var objPost = {
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                    "objectpegawaifk": $scope.item.namaDokter.id
                }
                manageTataRekening.updateDokterPelPasien(objPost).then(function (e) {

                })
                manageTataRekening.updateDokterPelPasienNew(objPost).then(function (e) {

                })



            }
            $scope.Detail = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var objSave = {
                        noregistrasi: $scope.dataPasienSelected.noregistrasi
                    }
                    manageTataRekening.postJurnalAkuntansi(objSave).then(function (data) {

                    });
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
            }
            $scope.DaftarRuangan = function () {
                if ($scope.dataPasienSelected.norec == undefined) {
                    toastr.error('Pilih Data Pasien dulu', 'Caution');
                    return;
                }
                $scope.popupKondisiKhusus.center().open();
            }
            $scope.editStatusPulang = function () {
                if ($scope.dataPasienSelected.norec == undefined) {
                    toastr.error('Pilih Data Pasien dulu', 'Caution');
                    return;
                }
                getdataCombo();
                $scope.popupEditStatusPulang.center().open();
            }
            $scope.saveStatusPulang = function () {
                debugger
                var statusKeluarId = null;
                if ($scope.item.statusKeluar != undefined) {
                    statusKeluarId = $scope.item.statusKeluar.id;
                }
                var kondisiKeluarId = null;
                var kondisiKeluar = null;
                if ($scope.item.kondisiKeluar != undefined) {
                    kondisiKeluarId = $scope.item.kondisiKeluar.id;
                    kondisiKeluar = $scope.item.kondisiKeluar.kondisipasien
                }
                var PenyebabKematianText = ""
                if ($scope.item.PenyebabKematianText != undefined) {
                    PenyebabKematianText = $scope.item.PenyebabKematianText
                }
                var penyebabkematianId = null;
                if ($scope.item.penyebabKematian != undefined) {
                    penyebabkematianId = $scope.item.penyebabKematian.id;
                }
                var statusPulangId = null;
                if ($scope.item.statusPulang != undefined) {
                    statusPulangId = $scope.item.statusPulang.id;
                }
                var pasiendaftar = {
                    noregistrasi: $scope.dataPasienSelected.noregistrasi,
                    objectruanganlastfk: $scope.dataPasienSelected.idruangan,
                    objectkondisipasienfk: kondisiKeluarId,
                    objectpenyebabkematianfk: penyebabkematianId,
                    objectstatuskeluarfk: statusKeluarId,
                    objectstatuspulangfk: statusPulangId,
                    tglmeninggal: moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm:ss'),
                    tglpulang: moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss'),
                    norec_pd: $scope.dataPasienSelected.norec,
                    objectstatuskeluarrencanafk: statusKeluarId,
                    nocmfk: $scope.dataPasienSelected.nocmfk,
                    keteranganpulang: "Pulang dengan kondisi : " + kondisiKeluar,
                    keterangankematian: PenyebabKematianText,

                }
                var antrianpasiendiperiksa = {
                    objectruanganlastfk: $scope.dataPasienSelected.idruangan,
                    tglpulangseblumnya: $scope.dataPasienSelected.tglpulang
                }
                var objSave = {
                    pasiendaftar: pasiendaftar,
                    antrianpasiendiperiksa: antrianpasiendiperiksa
                }
                debugger
                medifirstService.post('rawatinap/save-pulang-pasien-eklaim', objSave).then(function (e) {


                })
            }
            function getdataCombo() {

                medifirstService.get("rawatinap/get-combo-pindahpasien")
                    .then(function (e) {
                        for (var i = 0; i < e.data.statuskeluar.length; i++) {
                            e.data.statuskeluar[i].id = parseInt(e.data.statuskeluar[i].id)
                        }

                        $scope.listStatusKeluar = e.data.statuskeluar;
                        $scope.listKondisiPasien = e.data.kondisipasien;
                        $scope.listStatusPulang = e.data.statuspulang;
                        $scope.listPenyebabKematian = e.data.penyebabkematian;
                    })
            }
            $scope.SimpanDaftarRuangan = function () {
                var datasend = {
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                    "jenispasien": $scope.item.kondisiKhusus.id,
                }
                medifirstService.post('bridging/inacbg/update-status-kondisi-khusus', datasend).then(function (e) {
                    loadDataNosep();
                })
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
            $scope.SuratKontrol = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                }

                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataPasienSelected.noregistrasi == undefined)
                    var noregistrasi = "";
                else

                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                $state.go('PerjanjianPasien', {
                    dataPasien: JSON.stringify(obj)
                });
                // var stt = 'false'
                // if (confirm('View Surat Kontrol? ')){
                //     // Save it!
                //     stt='true';
                // }else {
                //     // Do nothing!
                //     stt='false'
                // }
                // var client = new HttpClient();        
                // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-suratPerjanjianbynocm=1&nocm='+nocm+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
                //     // do something with response
                // });
            }
            $scope.EditSEP = function () {
                $scope.item.noPeserta = "";
                $scope.item.noSep = "";

                if ($scope.dataPasienSelected.norec == null) {
                    messageContainer.error("Pasien Belum Dipilih!!")
                    return;
                }
                if ($scope.dataPasienSelected.kelompokpasien != "BPJS") {
                    messageContainer.error("Input SEP hanya untuk pasien BPJS")
                    return;
                }
                // if($scope.dataPasienSelected.norec_pa ==null){
                // 	messageContainer.error("Pemakaian Asuransi tidak ada")
                // 	return;
                // }
                if ($scope.dataPasienSelected.nokepesertaan == undefined) {
                    messageContainer.error("No Kartu BPJS Belum Diisi!!")
                    return;
                }

                if ($scope.dataPasienSelected.nokepesertaan == null) {
                    messageContainer.error("No Kartu BPJS Belum Diisi!!")
                    return;
                }

                if ($scope.dataPasienSelected.nokepesertaan == '-') {
                    messageContainer.error("No Kartu BPJS Belum Diisi!!")
                    return;
                }

                if ($scope.dataPasienSelected.nokepesertaan != undefined) {
                    $scope.item.noSep = $scope.dataPasienSelected.nosep;
                }

                if ($scope.dataPasienSelected.nosep != "" && $scope.dataPasienSelected.nosep != null) {


                    var dt1 = {}
                    var dt2 = []
                    dt1 = {
                        "metadata": {
                            "method": "get_claim_data"
                        },
                        "data": {
                            "nomor_sep": $scope.dataPasienSelected.nosep //dataSave[i].nomor_sep
                        }
                    }
                    dt2.push(dt1)

                    var objData = {
                        "data": dt2
                    }
                    medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                        // 	
                        var x = e.data.dataresponse;
                        if (x[0].dataresponse.metadata.code == 200) {
                            toastr.info('NOMOR SEP INI SUDAH ADA DI INACBG, SILAHKAN HAPUS KLAIM DULU BARU GANTI SEP');
                        } else {
                            $scope.cboSep = true
                            $scope.cboGrouping = false
                        }
                    })
                } else {
                    $scope.cboSep = true
                    $scope.cboGrouping = false
                }
            }
            $scope.setSepx = function (dataHistorySelect) {
                // $scope.item.noSep = dataHistorySelect.noSep
                $scope.popUpHistoriPelayananPeserta.close()
            }
            $scope.columnHistoriPeserta = {

                selectable: 'cell',
                pageable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "noSep",
                    "title": "No SEP",
                    "width": "130px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setSepx(dataItem)\"  style=\"margin:0 0 5px\">#:  noSep #</button> ",

                },
                {
                    "field": "ppkPelayanan",
                    "title": "Rumah Sakit",
                    "width": "100px"
                },
                {
                    "field": "tglSep",
                    "title": "Tgl SEP",
                    "width": "100px"
                },
                {
                    "field": "noRujukan",
                    "title": "No Rujukan",
                    "width": "90px"
                },
                {
                    "field": "noKartu",
                    "title": "No Kartu",
                    "width": "90px"
                },
                {
                    "field": "namaPeserta",
                    "title": "Nama Pasien",
                    "width": "90px"
                },
                {
                    "field": "kelasRawat",
                    "title": "Kelas",
                    "width": "90px"
                },
                {
                    "field": "poli",
                    "title": "Poli",
                    "width": "90px"
                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "150px"
                },

                ]
            };
            $scope.cekHistory = function () {
                $scope.isLoadingNoKartu = true;
                medifirstService.get("bridging/bpjs2/monitoring/HistoriPelayanan/NoKartu/" + $scope.dataPasienSelected.nokepesertaan).then(function (data) {
                    $scope.isLoadingNoKartu = false;
                    if (data.data.metaData.code == 200) {
                        for (let i = 0; i < data.data.response.histori.length; i++) {
                            const element = data.data.response.histori[i];
                            element.no = i + 1
                        }
                        $scope.popUpHistoriPelayananPeserta.center().open()
                        $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                            data: data.data.response.histori,
                            pageSize: 10,
                            total: data.data.response.histori.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    } else {
                        toastr.info(data.data.metaData.message, 'Status Peserta');
                        $scope.isLoadingNoKartu = false;
                    }
                })
            }
            $scope.simpanSep = function () {
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.item.noSep).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        if (moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD') != e.data.response.tglSep) {
                            toastr.error('Tanggal SEP ' + e.data.response.tglSep + ' Berbeda Dengan Tanggal Registrasi ' + moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'))
                            return
                        }
                        if ($scope.dataPasienSelected.kelompokpasien == "BPJS") {
                            var updateSep = {
                                "norec": $scope.dataPasienSelected.norec,
                                "nokepesertaan": e.data.response.peserta.noKartu,
                                "nosep": e.data.response.noSep
                            }
                        } else {
                            var updateSep = {
                                "norec": $scope.dataPasienSelected.norec,
                                "nokepesertaan": $scope.item.noPeserta,
                                "nosep": null
                            }
                        }
                        medifirstService.post('registrasi/daftar-registrasi/update-nosep', updateSep).then(function (e) {
                            loadDataNosep();
                            $scope.saveLogInputSep()
                        })

                        $scope.cboSep = false
                        // $scope.cboUbahSEP = true
                        // $scope.cboDokter = false
                        // $scope.cboUbahDokter = true
                        $scope.cboGrouping = true
                    } else {
                        window.messageContainer.error(e.data.metaData.message + ' ' + e.data.metaData.code);
                    }
                    $scope.isLoadingSEP = false;
                }, function (err) {
                    $scope.isLoadingSEP = false;
                });
            }
            $scope.saveLogInputSep = function () {
                var jenisLog = 'Input SEP'
                var referensi = 'Norec Pemakaian Asuransi'
                var keterangan = 'Input Sep - ' + $scope.item.noSep + ' No Registrasi ' + $scope.dataPasienSelected.noregistrasi
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" +
                    jenisLog + "&referensi=" + referensi +
                    "&noreff=" + $scope.dataPasienSelected.norec_pa +
                    "&keterangan=" + keterangan
                ).then(function (data) {
                    $scope.item.noPeserta = "";
                    $scope.item.noSep = "";
                })
            }
            //end log
            $scope.batalSep = function () {
                $scope.item.noSep = "";
                $scope.cboSep = false
                $scope.cboGrouping = true
            }

            $scope.resumeMedis = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var arrrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.dataPasienSelected.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    // 4: $scope.dataPasienSelected.umur,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    // 7: $scope.dataPasienSelected.norec,
                    8: $scope.dataPasienSelected.norec,
                    // 9: $scope.dataPasienSelected.objectkelasfk,
                    // 10: $scope.dataPasienSelected.namakelas,
                    11: $scope.dataPasienSelected.ruanganid,
                    12: $scope.dataPasienSelected.namaruangan
                }
                cacheHelper.set('cacheRekamMedis', arrrStr);
                $state.go('ResumeMedisRI')
            }
            $scope.showInputDiagnosa = function () {

                // if ($scope.currentAntrian == undefined) {
                // 	alert("Pilih data Pasien terlebih dahulu !")
                // 	return;
                // }

                $scope.cboDiagnosa = true
                $scope.cboDiagnosa1 = true
                $scope.cboInputDiagnosa = false
                $scope.findBy = "0";
                $scope.findBy1 = "0";
                loaaaaaaad();
            }
            $scope.findByRegistrasi = function () {

                loadDatas()
                $scope.showInputDiagnosa();
                var norReg = ""
                norReg = "noReg=" + $scope.item.noRegistrasi;

                medifirstService.get("registrasi/get-antrian-pasien-diperiksa-by-noreg?" +
                    norReg
                ).then(function (dat) {
                    debugger;

                    $scope.listRuanganx = dat.data.data
                    // $scope.item.namaRuanganx = { id: $scope.listRuanganx[0].objectruanganfk, namaruangan: $scope.listRuanganx[0].namaruangan }
                    $scope.listRuangan1 = dat.data.data
                    // $scope.item.namaRuangan1 = { id: $scope.listRuangan1[0].objectruanganfk, namaruangan: $scope.listRuangan1[0].namaruangan }


                });

            }

            function loadDatas() {

                var noReg = ""
                if ($scope.item.noRegistrasi != undefined) {
                    var noReg = "&noReg=" + $scope.item.noRegistrasi
                }

                var noCm = ""
                if ($scope.item.noCm != undefined) {
                    var noCm = "&noCm=" + $scope.item.noCm
                }

                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }

                var tempRuangan = "";
                if ($scope.item.namaRuanganfilter != undefined) {
                    tempRuangan = "&idRuangan=" + $scope.item.namaRuanganfilter.id;
                }
                debugger;

                $q.all([
                    medifirstService.get("registrasi/get-antrian-by-nocm-rev?" +
                        noReg +
                        noCm +
                        tempDepartemen +
                        tempRuangan),
                ]).then(function (data) {
                    debugger;
                    $scope.isRouteLoading = false;
                    var dot = data[0].data.datas;
                    tglregistrasidiagnosa = dot[0].tglregistrasi;
                    for (var i = 0; i < dot.length; i++) {
                        dot[i].no = i + 1
                        if (dot[i].details.length > 0) {
                            for (let x = 0; x < dot[i].details.length; x++) {
                                const element = dot[i].details[x];
                                if (element.kddiagnosa == '-') {
                                    dot[i].status = '✔ '
                                    break
                                } else {
                                    dot[i].status = '✔';
                                    break
                                }
                            }

                        } else {
                            dot[i].status = '✖';
                        }

                    }
                    $scope.listRegistrasi = new kendo.data.DataSource({
                        data: dot,
                        pageSize: 5,
                        total: dot.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    // $scope.isRouteLoading=false;
                    // $scope.listRegistrasi = dot;
                });
            };
            $scope.gridRegistrasi = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [{
                    field: "no",
                    title: "No",
                    width: 35
                },
                {
                    field: "noregistrasi",
                    title: "No. Registrasi",
                    aggregates: ["count"],
                    width: 120
                },
                {
                    field: "nocm",
                    title: "No. CM",
                    // aggregates: ["count"],
                    width: 120
                },
                {
                    field: "tglregistrasi",
                    title: "Tgl Registrasi",
                    template: "#if (tglregistrasi) {# #= new moment(tglregistrasi).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                    width: 130
                },
                {
                    field: "namaruangan",
                    title: "Ruangan Pelayanan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)",
                    width: 250
                },
                {
                    field: "namalengkap",
                    title: "Dokter"
                },
                {
                    field: "tglpulang",
                    title: "Tgl Pulang",
                    template: "#if (tglpulang) {# #= new moment(tglpulang).format(\'DD-MM-YYYY HH:mm\')# #} else {# - #} #",
                    width: 130
                },
                {
                    field: "status",
                    title: "Status",
                    width: 85
                }
                ]
            }
            // $scope.gridDiagnosa =
            //     // {
            //     // columns: 
            //     [{
            //             "title": "#",
            //             "template": "{{listGridDiagnosa.indexOf(dataItem) + 1}}",
            //             "width": 35
            //         },
            //         {
            //             "field": "tglinputdiagnosa",
            //             "title": "Tgl. Input",
            //             "width": "85px",
            //         },
            //         {
            //             "field": "jenisdiagnosa",
            //             "title": "Jenis Diagnosis",
            //             "width": 150
            //         }, {
            //             "field": "kddiagnosa",
            //             "title": "Kode Diagnosa",
            //             "width": 150
            //         }, {
            //             "field": "namadiagnosa",
            //             "title": "Nama Diagnosa"
            //         }, {
            //             "field": "namaruangan",
            //             "title": "Ruangan",
            //             "width": 150
            //         },
            //         {
            //             "field": "keterangan",
            //             "title": "Keterangan",
            //             "width": 150
            //         },
            //         {
            //             "field": "namalengkap",
            //             "title": "Petugas",
            //             "width": "150px",
            //         }

            //     ];
            $scope.gridDiagnosa = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [
                    //     {
                    //     "title": "edit",
                    //     "field": "edit",
                    //     // "template": "{{listGridDiagnosa.indexOf(dataItem) + 1}}",
                    //     "width": 50
                    // },
                    {
                        "title": "#",
                        "template": "{{listGridDiagnosa.indexOf(dataItem) + 1}}",
                        "width": 35
                    },
                    {
                        "field": "tglinputdiagnosa",
                        "title": "Tgl. Input",
                        "width": "85px",
                    },
                    {
                        "field": "jenisdiagnosa",
                        "title": "Jenis Diagnosis",
                        "width": 150
                    }, {
                        "field": "kddiagnosa",
                        "title": "Kode Diagnosa",
                        "width": 150
                    }, {
                        "field": "namadiagnosa",
                        "title": "Nama Diagnosa"
                    }, {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": 150
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": 150
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas",
                        "width": "150px",
                    },
                    {
                        "title": "",
                        "width": "150px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setHapus(dataItem)\"  style=\"margin:0 0 5px\">HAPUS</button> ",
                    },

                ]
            }
            $scope.gridDiagnosa1 = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [
                    // {
                    //     "title": "edit",
                    //     "field": "edit",
                    //     // "template": "{{listGridDiagnosa.indexOf(dataItem) + 1}}",
                    //     "width": 50
                    // },
                    {
                        "title": "#",
                        "template": "{{listGridDiagnosa1.indexOf(dataItem) + 1}}",
                        "width": 35
                    },
                    {
                        "field": "tglinputdiagnosa",
                        "title": "Tgl. Input",
                        "width": "85px",
                    },
                    {
                        "field": "kddiagnosatindakan",
                        "title": "Kode Diagnosa",
                        "width": 150
                    }, {
                        "field": "namadiagnosatindakan",
                        "title": "Nama Diagnosa"
                    }, {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": 150
                    },
                    {
                        "field": "keterangantindakan",
                        "title": "Keterangan",
                        "width": "100px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas",
                        "width": "150px",
                    },
                    {
                        "title": "",
                        "width": "150px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setHapus1(dataItem)\"  style=\"margin:0 0 5px\">HAPUS</button> ",
                    },

                ]
            }

            function loaaaaaaad() {
                var norReg = ""
                // if ($scope.currentAntrian.noregistrasi != undefined) {
                // 	norReg = "noReg=" + $scope.currentAntrian.noregistrasi;
                // }
                norReg = "noReg=" + $scope.item.noRegistrasi;
                // manageSarprasPhp.getDataTableTransaksi("pasien/get-pasienbynoreg?"
                //     + norReg
                // ).then(function (dat) {
                //     $scope.listRuangan = dat.data.data;
                // });

                medifirstService.get("registrasi/get-diagnosa-10-by-noregrirj?" +
                    norReg
                ).then(function (data) {
                    dataTea = data.data.datas;
                    for (var i = 0; i < dataTea.length; i++) {
                        dataTea[i].edit = '';
                    }
                    $scope.listGridDiagnosa = new kendo.data.DataSource({
                        data: dataTea,
                        //pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });

                // $scope.dataSelected = data.data.datas;
                medifirstService.get("registrasi/get-diagnosa-9-by-noreg?" +
                    norReg
                ).then(function (data) {
                    dataTea2 = data.data.datas;
                    for (var i = 0; i < dataTea2.length; i++) {
                        dataTea2[i].edit = '';
                    }
                    $scope.listGridDiagnosa1 = new kendo.data.DataSource({
                        data: dataTea2,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                    // $scope.dataSelected = data.data.datas;
                });


            }

            // medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {

            //     $scope.sourceDiagnosisPrimer = data;
            // });
            medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                $scope.sourceDiagnosisPrimer = data;
            });


            // get diagnosa icd9
            // ModelItem.getDataDummyGeneric("DiagnosaTindakan", true, true, 50).then(function(data) {
            //     $scope.sourceDiagnosisTindakan = data;
            // }); 
            medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                $scope.sourceDiagnosisPrimer1 = data;
            });
            // medifirstService.getPart("registrasi/get-icd-9", true, true, 10).then(function (data) {
            //     $scope.sourceDiagnosisPrimer1 = data;

            // });
            $scope.simpanDiagnosa = function () {
                var norReg = ""
                if ($scope.item.noRegistrasi != undefined) {
                    norReg = "noReg=" + $scope.item.noRegistrasi;
                }
                var kddiagnosa = ""
                if ($scope.item.diagnosisPrimer != undefined) {
                    kddiagnosa = "&kddiagnosa=" + $scope.item.diagnosisPrimer.kdDiagnosa;
                }
                $scope.SaveDiagnosa();

            }
            $scope.simpanBeratBadanBayi = function () {
                if ($scope.item.beratBadan == undefined) {
                    alert("Berat Badan Belum Di isi!!")
                    return
                }
                debugger;
                var objSave = {
                    beratbadan: $scope.item.beratBadan,
                    noregistrasifk: $scope.dataPasienSelected.norec
                }
                medifirstService.post('bridging/inacbg/save-beratbadanbayi', objSave).then(function (e) {
                    $scope.dataSelected = {};
                    loaaaaaaad()
                    $scope.item.noSep = $scope.dataPasienSelected.nosep
                    loadDataNosep()
                    $scope.isRouteLoading = false;
                    // window.history.back();
                })
            }
            $scope.simpanDiagnosaTarget = function () {

                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                var norecDiagnosaPasien = "";
                if ($scope.dataSelected.norec_diagnosapasien != undefined) {
                    norecDiagnosaPasien = $scope.dataSelected.norec_diagnosapasien
                }
                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: norecDiagnosaPasien,
                    noregistrasifk: $scope.item.noRegistrasi,
                    tglregistrasi: tglregistrasidiagnosa,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: '-'
                }
                var objSave = {
                    detaildiagnosapasien: detaildiagnosapasien,
                }
                debugger;
                medifirstService.post('registrasi/save-diagnosa-pasien-target', objSave).then(function (e) {
                    // if ($scope.item.jenisDiagnosis.id == 1) {
                    //     medifirstService.post('tatarekening/sync-trandata-new', { noregistrasi: $scope.item.noRegistrasi }).then(function (e) { }, function (err) { })
                    // }
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelected = {};
                    loaaaaaaad()
                    $scope.item.noSep = $scope.dataPasienSelected.nosep
                    loadDataNosep()
                    $scope.isRouteLoading = false;
                    // window.history.back();
                })

            }
            $scope.simpanDiagnosaTarget1 = function () {
                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                // if ($scope.item.namaRuangan1.objectruanganfk == undefined) {
                //     alert("Pilih Nama Ruangan ulang!!")
                //     return
                // }
                var norecDiagnosaTindakanPasien = "";
                if ($scope.dataSelected1.norec_diagnosapasien != undefined) {
                    norecDiagnosaTindakanPasien = $scope.dataSelected1.norec_diagnosapasien
                }
                var keteranganTindakan = "-";
                if ($scope.item.keteranganTindakan != undefined) {
                    keteranganTindakan = $scope.item.keteranganTindakan
                }
                var norec_apd
                // if ($scope.item.namaRuangan1.norec_apd == undefined) {
                //     norec_apd = $scope.item.namaRuangan1.details[0].norec_apd
                // } else {
                //     norec_apd = $scope.item.namaRuangan1.norec_apd
                // }
                $scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    norec_dp: norecDiagnosaTindakanPasien,
                    noregistrasifk: $scope.item.noRegistrasi,
                    objectpasienfk: $scope.item.noRegistrasi,
                    tglpendaftaran: tglregistrasidiagnosa,
                    objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
                    keterangantindakan: keteranganTindakan,
                }
                var objSave = {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
                }

                medifirstService.post('registrasi/save-diagnosa-tindakan-pasien-target', objSave).then(function (e) {
                    // delete $scope.item.jenisDiagnosis1;
                    delete $scope.item.diagnosisPrimer1;
                    // delete $scope.item.diagnosisPrimer22;
                    // delete $scope.item.keterangan1;
                    // delete $scope.item.KodeDiagnosa;
                    // delete $scope.item.namaRuangan;
                    $scope.dataSelected1 = {};
                    loaaaaaaad()
                    $scope.item.noSep = $scope.dataPasienSelected.nosep
                    loadDataNosep()
                    // window.history.back();
                })

            }
            $scope.SaveDiagnosa = function () {

                if ($scope.item.jenisDiagnosis == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.namaRuanganx.objectruanganfk == undefined) {
                    alert("Pilih Nama Ruangan ulang!!")
                    return
                }
                // if ($scope.item.NamaDiagnosa == undefined) {
                //     alert("Pilih  Nama Diagnosa terlebih dahulu!!")
                //     return
                // }
                var norecDiagnosaPasien = "";
                if ($scope.dataSelected.norec_diagnosapasien != undefined) {
                    norecDiagnosaPasien = $scope.dataSelected.norec_diagnosapasien
                }

                var keterangan = "";
                if ($scope.item.keterangan == undefined) {
                    keterangan = "-"
                } else {
                    keterangan = $scope.item.keterangan
                }
                $scope.now = new Date();
                var norec_apd
                if ($scope.item.namaRuanganx.norec_apd == undefined) {
                    norec_apd = $scope.item.namaRuanganx.details[0].norec_apd
                } else {
                    norec_apd = $scope.item.namaRuanganx.norec_apd
                }
                norec_apd
                var detaildiagnosapasien = {
                    norec_dp: norecDiagnosaPasien,
                    // noregistrasifk: $scope.item.namaRuanganx.details.norec_apd,
                    noregistrasifk: $scope.item.namaRuanganx.details != undefined ? $scope.item.namaRuanganx.details[0].norec_apd : norec_apd,
                    tglregistrasi: tglregistrasidiagnosa,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
                }
                var objSave = {
                    detaildiagnosapasien: detaildiagnosapasien,
                }
                debugger;
                medifirstService.post('registrasi/save-diagnosa-pasien', objSave).then(function (e) {
                    if ($scope.item.jenisDiagnosis.id == 1) {
                        medifirstService.post('tatarekening/sync-trandata-new', { noregistrasi: $scope.item.noRegistrasi }).then(function (e) { }, function (err) { })
                    }
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.keterangan;
                    // delete $scope.item.KodeDiagnosa;
                    // delete $scope.item.namaRuangan;
                    $scope.dataSelected = {};
                    loaaaaaaad()
                    loadDatas()
                    $scope.isRouteLoading = false;
                    // window.history.back();
                })

            }
            $scope.setHapus = function (data) {
                debugger
                var diagnosa = {
                    norec_dp: data.norec_diagnosapasien,
                    noregistrasi: data.noregistrasi
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien-target', objDelete).then(function (e) {
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelected = {};
                    loaaaaaaad()
                })
            }
            $scope.setHapus1 = function (data) {
                debugger
                var diagnosa = {
                    norec_dp: data.norec_diagnosapasien,
                    noregistrasi: data.noregistrasi
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelected = {};
                    loaaaaaaad()
                })
            }
            $scope.setSep = function (data) {
                if (data != undefined) {
                    $scope.dataPasienSelected = data;
                    $scope.item.noRegistrasi = data.noregistrasi
                    $scope.item.beratBadan = data.beratbadan
                    // $scope.item.noSep = $scope.dataPasienSelected.nosep
                    tglregistrasidiagnosa = $scope.dataPasienSelected.tglregistrasi
                    loaaaaaaad()
                    $scope.popupDetail.center().open();
                    var jenis_rawat = 1 //ranap
                    if (data.deptid != 16) {
                        jenis_rawat = 2
                    }
                    if (data.statuskemo != 1) {
                        jenis_rawat = 2
                    }
                    var upgrade_class_ind = 0
                    var upgrade_class_class = ''
                    var add_payment_pct = 0
                    if (data.nokelasdijamin != data.nokelasdaftar) {
                        upgrade_class_ind = 1
                        upgrade_class_class = data.namakelas
                        add_payment_pct = 0
                    }
                    var discharge_status = 0
                    if (data.objectstatuspulangfk == 1 || data.objectstatuspulangfk == 13) {
                        discharge_status = 1
                    } else if (data.objectstatuspulangfk == 4 || data.objectstatuspulangfk == 5 || data.objectstatuspulangfk == 10 ||
                        data.objectstatuspulangfk == 11 || data.objectstatuspulangfk == 7 || data.objectstatuspulangfk == 16) {
                        discharge_status = 2
                    } else if (data.objectstatuspulangfk == 2 || data.objectstatuspulangfk == 3 ||
                        data.objectstatuspulangfk == 12) {
                        discharge_status = 3
                    } else if (data.objectstatuspulangfk == 9 || data.objectstatuspulangfk == 18) {
                        discharge_status = 4
                    } else {
                        discharge_status = 5
                    }


                    $scope.item.detail =
                        'nomor_sep = ' + data.nosep + '\n' +
                        'nomor_kartu = ' + data.nokepesertaan + '\n' +
                        'tgl_masuk = ' + data.tglregistrasi + '\n' +
                        'tgl_pulang = ' + data.tglpulang + '\n' +
                        'jenis_rawat = ' + jenis_rawat + '\n' +
                        'kelas_rawat = ' + data.nokelasdaftar + '\n' +
                        'adl_sub_acute = null \n' +
                        'adl_chronic = null \n' +
                        'icu_indikator = null \n' +
                        'icu_los = null \n' +
                        'ventilator_hour = null \n' +
                        'upgrade_class_ind = ' + upgrade_class_ind + '\n' +
                        'upgrade_class_class = ' + upgrade_class_class + '\n' +
                        'upgrade_class_los = ' + null + '\n' +
                        'add_payment_pct = ' + add_payment_pct + '\n' +
                        'birth_weight = ' + 0 + '\n' +
                        'discharge_status = ' + discharge_status + '\n' +
                        'diagnosa = ' + data.icd10 + '\n' +
                        'procedure = ' + data.icd9 + '\n' +
                        'tarif_rs = ' + data.tarif_rs + '\n' + +
                        'tarif_poli_eks = ' + 0 + "\n" +
                        'nama_dokter = ' + data.namadokter + "\n" +
                        'kode_tarif = ' + data.kodetarif + "\n" +
                        'payor_id = ' + '3' + "\n" +
                        'payor_cd = ' + 'JKN' + "\n" +
                        'cob_cd = ' + '#' + "\n" +
                        'coder_nik = ' + data.codernik
                    $scope.item.targetjaminan = 'JKN'
                    $scope.item.targetnoPeserta = data.nokepesertaan
                    $scope.item.targetnoSEP = data.nosep
                    if (jenis_rawat == 2) {
                        $scope.paramInacbg = 'Rawat Jalan'
                        $scope.targetkelas_rawat = '-'
                    } else {
                        $scope.paramInacbg = 'Rawat Inap'
                        $scope.targetkelas_rawat = data.namakelas
                    }
                    // if (data.nokelasdaftar == 6) {
                    //     $scope.targetkelas_rawat = '-'
                    // } else {
                    //     $scope.targetkelas_rawat = data.namakelas
                    // }
                    $scope.targetumur = data.umur
                    $scope.targettgl_masuk = data.tglregistrasi
                    $scope.targettgl_pulang = data.tglpulang
                    if (discharge_status == 1)
                        $scope.targetdischarge_status = 'Atas persetujuan dokter'
                    else if (discharge_status == 2)
                        $scope.targetdischarge_status = 'Dirujuk'
                    else if (discharge_status == 3)
                        $scope.targetdischarge_status = 'Atas permintaan sendiri'
                    else if (discharge_status == 4)
                        $scope.targetdischarge_status = 'Meninggal'
                    else if (discharge_status == 5)
                        $scope.targetdischarge_status = 'Lain-lain'
                    $scope.targetnama_dokter = data.namadokter
                    $scope.listTarifRS = [
                        { namatarif: 'Prosedur Non Bedah', tarif: data.tarif_rs.prosedur_non_bedah, tarifx: $scope.formatRupiah(data.tarif_rs.prosedur_non_bedah, 'Rp. ') },
                        { namatarif: 'Tenaga Ahli', tarif: data.tarif_rs.tenaga_ahli, tarifx: $scope.formatRupiah(data.tarif_rs.tenaga_ahli, 'Rp. ') },
                        { namatarif: 'Radiologi', tarif: data.tarif_rs.radiologi, tarifx: $scope.formatRupiah(data.tarif_rs.radiologi, 'Rp. ') },
                        { namatarif: 'Rehabilitasi', tarif: data.tarif_rs.rehabilitasi, tarifx: $scope.formatRupiah(data.tarif_rs.rehabilitasi, 'Rp. ') },
                        { namatarif: 'Obat', tarif: data.tarif_rs.obat, tarifx: $scope.formatRupiah(data.tarif_rs.obat, 'Rp. ') },
                        { namatarif: 'Alkes', tarif: data.tarif_rs.alkes, tarifx: $scope.formatRupiah(data.tarif_rs.alkes, 'Rp. ') },
                        { namatarif: 'Prosedur Bedah', tarif: data.tarif_rs.prosedur_bedah, tarifx: $scope.formatRupiah(data.tarif_rs.prosedur_bedah, 'Rp. ') },
                        { namatarif: 'Keperawatan', tarif: data.tarif_rs.keperawatan, tarifx: $scope.formatRupiah(data.tarif_rs.keperawatan, 'Rp. ') },
                        { namatarif: 'Laboratorium', tarif: data.tarif_rs.laboratorium, tarifx: $scope.formatRupiah(data.tarif_rs.laboratorium, 'Rp. ') },
                        { namatarif: 'Kamar/Akomodasi', tarif: data.tarif_rs.kamar, tarifx: $scope.formatRupiah(data.tarif_rs.kamar, 'Rp. ') },
                        { namatarif: 'Prosedur Non Bedah', tarif: data.tarif_rs.obat_kronis, tarifx: $scope.formatRupiah(data.tarif_rs.obat_kronis, 'Rp. ') },
                        { namatarif: 'BMHP', tarif: data.tarif_rs.bmhp, tarifx: $scope.formatRupiah(data.tarif_rs.bmhp, 'Rp. ') },
                        { namatarif: 'Konsultasi', tarif: data.tarif_rs.konsultasi, tarifx: $scope.formatRupiah(data.tarif_rs.konsultasi, 'Rp. ') },
                        { namatarif: 'Penunjang', tarif: data.tarif_rs.penunjang, tarifx: $scope.formatRupiah(data.tarif_rs.penunjang, 'Rp. ') },
                        { namatarif: 'Pelayanan Darah', tarif: data.tarif_rs.pelayanan_darah, tarifx: $scope.formatRupiah(data.tarif_rs.pelayanan_darah, 'Rp. ') },
                        { namatarif: 'Rawat Intensif', tarif: data.tarif_rs.rawat_intensif, tarifx: $scope.formatRupiah(data.tarif_rs.rawat_intensif, 'Rp. ') },
                        { namatarif: 'Obat Kemoterapi', tarif: data.tarif_rs.obat_kemoterapi, tarifx: $scope.formatRupiah(data.tarif_rs.obat_kemoterapi, 'Rp. ') },
                        { namatarif: 'Sewa Alat', tarif: data.tarif_rs.sewa_alat, tarifx: $scope.formatRupiah(data.tarif_rs.sewa_alat, 'Rp. ') },
                    ]
                    $scope.totalTarifRS = 0
                    for (var i = 0; i < $scope.listTarifRS.length; i++) {
                        $scope.totalTarifRS = parseFloat($scope.listTarifRS[i].tarif) + $scope.totalTarifRS
                    }
                    $scope.totalTarifRS = $scope.formatRupiah($scope.totalTarifRS, 'Rp. ')
                    $scope.totalInacbg = $scope.formatRupiah(data.totalpiutangpenjamin, 'Rp. ')
                    $scope.totalTarifNaikKelas = $scope.formatRupiah(data.biayanaikkelas, 'Rp. ')
                    $scope.cbgcode = data.cbgcode
                    $scope.cbgdescription = data.cbgdescription
                }
            }
            $scope.klikGrid = function (dataSelected) {
                debugger;
                for (var i = 0; i < dataTea.length; i++) {
                    if (dataSelected.norec_detaildpasien == dataTea[i].norec_detaildpasien) {
                        dataTea[i].edit = 'Edit';

                    } else {
                        dataTea[i].edit = '';

                    }
                }
                $scope.listGridDiagnosa = new kendo.data.DataSource({
                    data: dataTea,
                    //pageSize: 10,
                    total: dataTea.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
                if (dataSelected != undefined) {
                    $scope.sourceDiagnosisPrimer.add({
                        id: dataSelected.objectdiagnosafk,
                        kdDiagnosa: dataSelected.kddiagnosa,
                        namaDiagnosa: dataSelected.namadiagnosa,
                        noregistrasi: dataSelected.noregistrasi,
                        tglregistrasi: dataSelected.tglregistrasi,
                        objectruanganfk: dataSelected.objectruanganfk,
                        namaruangan: dataSelected.namaruangan,
                        norec_apd: dataSelected.norec_apd,
                        objectdiagnosafk: dataSelected.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected.norec_detaildpasien,
                        id: dataSelected.id,
                        kdprofile: dataSelected.kdprofile,
                        statusenabled: dataSelected.statusenabled,
                        kodeexternal: dataSelected.kodeexternal,
                        namaexternal: dataSelected.namaexternal,
                        norec: dataSelected.norec,
                        reportdisplay: dataSelected.reportdisplay,
                        objectjeniskelaminfk: dataSelected.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected.qdiagnosa
                    })
                    $scope.item.jenisDiagnosis = { id: dataSelected.objectjenisdiagnosafk, jenisDiagnosa: dataSelected.jenisdiagnosa }
                    $scope.item.diagnosisPrimer = {
                        id: dataSelected.objectdiagnosafk,
                        kdDiagnosa: dataSelected.kddiagnosa,
                        namaDiagnosa: dataSelected.namadiagnosa,
                        noregistrasi: dataSelected.noregistrasi,
                        tglregistrasi: dataSelected.tglregistrasi,
                        objectruanganfk: dataSelected.objectruanganfk,
                        namaruangan: dataSelected.namaruangan,
                        norec_apd: dataSelected.norec_apd,
                        objectdiagnosafk: dataSelected.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected.norec_detaildpasien,
                        id: dataSelected.id,
                        kdprofile: dataSelected.kdprofile,
                        statusenabled: dataSelected.statusenabled,
                        kodeexternal: dataSelected.kodeexternal,
                        namaexternal: dataSelected.namaexternal,
                        norec: dataSelected.norec,
                        reportdisplay: dataSelected.reportdisplay,
                        objectjeniskelaminfk: dataSelected.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected.qdiagnosa
                    }
                    $scope.item.diagnosisPrimer2 = { id: dataSelected.objectdiagnosafk, namaDiagnosa: dataSelected.namadiagnosa }
                    $scope.item.namaRuangan = ''
                    $scope.item.namaRuangan = {
                        noregistrasi: dataSelected.noregistrasi,
                        objectruanganfk: dataSelected.objectruanganfk,
                        namaruangan: dataSelected.namaruangan,
                        norec_apd: dataSelected.norec_apd,
                        keterangan: dataSelected.keterangan
                    } //  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                }

            }

            $scope.klikGrid1 = function (dataSelected1) {
                for (var i = 0; i < dataTea2.length; i++) {
                    if (dataSelected1.norec_detaildpasien == dataTea2[i].norec_detaildpasien) {
                        dataTea2[i].edit = 'Edit';

                    } else {
                        dataTea2[i].edit = '';

                    }
                }
                $scope.listGridDiagnosa1 = new kendo.data.DataSource({
                    data: dataTea2,
                    //pageSize: 10,
                    total: dataTea2.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
                if (dataSelected1 != undefined) {
                    $scope.sourceDiagnosisPrimer1.add({
                        id: dataSelected1.objectdiagnosafk,
                        kdDiagnosaTindakan: dataSelected1.kddiagnosatindakan,
                        namaDiagnosaTindakan: dataSelected1.namadiagnosatindakan,
                        noregistrasi: dataSelected1.noregistrasi,
                        tglregistrasi: dataSelected1.tglregistrasi,
                        objectruanganfk: dataSelected1.objectruanganfk,
                        namaruangan: dataSelected1.namaruangan,
                        norec_apd: dataSelected1.norec_apd,
                        objectdiagnosafk: dataSelected1.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected1.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected1.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected1.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected1.norec_detaildpasien,
                        id: dataSelected1.id,
                        kdprofile: dataSelected1.kdprofile,
                        statusenabled: dataSelected1.statusenabled,
                        kodeexternal: dataSelected1.kodeexternal,
                        namaexternal: dataSelected1.namaexternal,
                        norec: dataSelected1.norec,
                        reportdisplay: dataSelected1.reportdisplay,
                        objectjeniskelaminfk: dataSelected1.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected1.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected1.qdiagnosa,
                        keterangantindakan: dataSelected1.keterangantindakan
                    })

                    $scope.item.jenisDiagnosis1 = { id: dataSelected1.objectjenisdiagnosafk, jenisDiagnosa: dataSelected1.jenisdiagnosa }
                    $scope.item.diagnosisPrimer1 = {
                        id: dataSelected1.objectdiagnosafk,
                        kdDiagnosaTindakan: dataSelected1.kdDiagnosaTindakan,
                        namaDiagnosaTindakan: dataSelected1.namaDiagnosaTindakan,
                        noregistrasi: dataSelected1.noregistrasi,
                        tglregistrasi: dataSelected1.tglregistrasi,
                        objectruanganfk: dataSelected1.objectruanganfk,
                        namaruangan: dataSelected1.namaruangan,
                        norec_apd: dataSelected1.norec_apd,
                        objectdiagnosafk: dataSelected1.objectdiagnosafk,
                        objectjenisdiagnosafk: dataSelected1.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected1.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected1.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected1.norec_detaildpasien,
                        id: dataSelected1.id,
                        kdprofile: dataSelected1.kdprofile,
                        statusenabled: dataSelected1.statusenabled,
                        kodeexternal: dataSelected1.kodeexternal,
                        namaexternal: dataSelected1.namaexternal,
                        norec: dataSelected1.norec,
                        reportdisplay: dataSelected1.reportdisplay,
                        objectjeniskelaminfk: dataSelected1.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected1.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected1.qdiagnosa,
                        keterangantindakan: dataSelected1.keterangantindakan
                    }

                    $scope.item.diagnosisPrimer2 = { id: dataSelected1.objectdiagnosafk, namaDiagnosaTindakan: dataSelected1.namaDiagnosaTindakan }
                    $scope.item.namaRuangan1 = ''
                    $scope.item.namaRuangan1 = {
                        noregistrasi: dataSelected1.noregistrasi,
                        objectruanganfk: dataSelected1.objectruanganfk,
                        namaruangan: dataSelected1.namaruangan,
                        norec_apd: dataSelected1.norec_apd
                    } //  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                    $scope.item.keteranganTindakan = dataSelected1.keterangantindakan
                }

            }

            function postKunjunganYankes() {
                let status = false
                var tanggal = moment(new Date()).format('YYYY-MM-DD')
                medifirstService.get('yankes/get-kunjungan?tgl=' + tanggal)
                    .then(function (a) {
                        var result = a
                        if (result.data.list != undefined && result.data.list.length > 0) {
                            for (var i = 0; i < result.data.list.length; i++) {
                                if (moment(new Date()).format('YYYY-MM-DD') == result.data.list[i].tanggal) {
                                    status = true
                                    medifirstService.get('yankes/count-kunjungan-pasien')
                                        .then(function (d) {
                                            let datt = d.data
                                            var jsonSave = {
                                                "data": {
                                                    "kode_kirim": result.data.list[i].kode,
                                                    "tanggal": moment(new Date()).format('YYYY-MM-DD'),
                                                    "kunjungan_rj": datt.data.rawat_jalan,
                                                    "kunjungan_igd": datt.data.igd,
                                                    "pasien_ri": datt.masihDirawat // result.data.rawat_inap,
                                                }
                                            }

                                            manageTataRekening.postData('yankes/update-kunjungan', jsonSave)
                                                .then(function (c) {
                                                    var resp = c.data
                                                    if (resp.kode == 200) {
                                                        toastr.success('Post Bridging Yankes')
                                                    }

                                                }, error => {
                                                    toastr.error('Post Bridging Yankes Gagal')
                                                });
                                        })
                                    break
                                }
                            }
                        }
                        if (status == false) {
                            medifirstService.get('yankes/count-kunjungan-pasien')
                                .then(function (b) {
                                    let result = b.data
                                    var jsonSave = {
                                        "data": {
                                            "kode_kirim": null,
                                            "tanggal": moment(new Date()).format('YYYY-MM-DD'),
                                            "kunjungan_rj": result.data.rawat_jalan,
                                            "kunjungan_igd": result.data.igd,
                                            "pasien_ri": result.masihDirawat // result.data.rawat_inap,
                                        }
                                    }

                                    manageTataRekening.postData('yankes/insert-kunjungan', jsonSave)
                                        .then(function (c) {
                                            var resp = c.data
                                            if (resp.kode == 200) {
                                                toastr.success('Post Bridging Yankes')
                                            }

                                        }, error => {
                                            toastr.error('Post Bridging Yankes Gagal')
                                        });
                                })
                        }
                    })

            }
            $scope.hapusDiagnosa = function () {

                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataSelected.norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien', objDelete).then(function (e) {
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.keterangan;
                    // delete $scope.item.KodeDiagnosa;
                    delete $scope.item.namaRuangan;
                    // window.history.back();
                    $scope.dataSelected = {};
                    loaaaaaaad()
                })
                // loaaaaaaad();
            }

            $scope.hapusDiagnosa1 = function () {

                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataSelected1.norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    // delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer1;
                    // delete $scope.item.keterangan1;
                    // delete $scope.item.KodeDiagnosa;
                    delete $scope.item.namaRuangan1;
                    // window.history.back();
                    $scope.dataSelected1 = {};
                    loaaaaaaad()
                })
                // loaaaaaaad();
            }
            $scope.diagnosa = function () {
                $scope.item.noRegistrasi = $scope.dataPasienSelected.noregistrasi;
                $scope.findByRegistrasi();
                debugger;
                $scope.myVar = 2

            }

            $scope.SaveDiagnosa1 = function () {
                // if ($scope.item.jenisDiagnosis1 == undefined) {
                //     alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                //     return
                // }
                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.namaRuangan1.objectruanganfk == undefined) {
                    alert("Pilih Nama Ruangan ulang!!")
                    return
                }
                // if ($scope.item.NamaDiagnosa == undefined) {
                //     alert("Pilih  Nama Diagnosa terlebih dahulu!!")
                //     return
                // }
                var norecDiagnosaTindakanPasien = "";
                if ($scope.dataSelected1.norec_diagnosapasien != undefined) {
                    norecDiagnosaTindakanPasien = $scope.dataSelected1.norec_diagnosapasien
                }
                var keteranganTindakan = "-";
                if ($scope.item.keteranganTindakan != undefined) {
                    keteranganTindakan = $scope.item.keteranganTindakan
                }
                var norec_apd
                if ($scope.item.namaRuangan1.norec_apd == undefined) {
                    norec_apd = $scope.item.namaRuangan1.details[0].norec_apd
                } else {
                    norec_apd = $scope.item.namaRuangan1.norec_apd
                }
                $scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    norec_dp: norecDiagnosaTindakanPasien,
                    noregistrasifk: $scope.item.namaRuangan1.details != undefined ? $scope.item.namaRuangan1.details[0].norec_apd : norec_apd,
                    objectpasienfk: $scope.item.namaRuangan1.details != undefined ? $scope.item.namaRuangan1.details[0].norec_apd : norec_apd, //$scope.listRuangan1[0].details[0].norec_apd,
                    tglpendaftaran: tglregistrasidiagnosa,
                    objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
                    keterangantindakan: keteranganTindakan,
                    // objectjenisdiagnosafk: $scope.item.jenisDiagnosis1.id,
                    // tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    // keterangan: $scope.item.keterangan
                }
                var objSave = {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
                }

                medifirstService.post('registrasi/save-diagnosa-tindakan-pasien', objSave).then(function (e) {
                    // delete $scope.item.jenisDiagnosis1;
                    delete $scope.item.diagnosisPrimer1;
                    // delete $scope.item.diagnosisPrimer22;
                    // delete $scope.item.keterangan1;
                    // delete $scope.item.KodeDiagnosa;
                    // delete $scope.item.namaRuangan;
                    $scope.dataSelected1 = {};
                    loaaaaaaad()
                    // window.history.back();
                })

            }
            $scope.simpanDiagnosa1 = function () {
                var norReg = ""
                if ($scope.item.noRegistrasi != undefined) {
                    norReg = "noReg=" + $scope.item.noRegistrasi;
                }
                var kddiagnosa = ""
                if ($scope.item.diagnosisPrimer1 != undefined) {
                    kddiagnosa = "&kddiagnosatindakan=" + $scope.item.diagnosisPrimer1.kdDiagnosaTindakan;
                }
                $scope.SaveDiagnosa1();

            }
            // postRujukanYankes()


            // END ################

        }
    ]);
});