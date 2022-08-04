define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('PengkajianICUCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$parse',
        function($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $parse) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglOperasi = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            var norec_Emr = ''
            $scope.tombolSimpanVis = true
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            $scope.header.DataNoregis = '';
            $scope.cc = {};
            $scope.cc.emrfk = 524
            $scope.diagnosis = true;
            $scope.pengkajian = false;
            var dataLoad = []
            var myVar = 0
            var detail = ''
            var datana = [];
            var datana2 = [];
            var datana3 = [];
            var datana4 = [];
            var datana5 = [];
            var data2 = [];
            var data_head = [];
            var tempnorecsoap = '';

            var norechead = ''
            $scope.istempatLaporan = true
            $scope.user = {};

            var data_Save = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            $scope.SistoleChart = false;
            $scope.NonSistoleChart = false;
            var paramSearch = '';
            var nomorEMR = '-';
            $scope.satu = [
                { "id": 1, "name": "Penumpukan Sekret" },
                { "id": 2, "name": "Corpusalienum" },
                { "id": 3, "name": "Edema Tracheal" },
            ]
            $scope.listkelompok = [
                { "id": 1, "kelompok": "07.00-14.00" },
                { "id": 2, "kelompok": "14.00-20.00" },
                { "id": 3, "kelompok": "20.00-07.00" },
            ]
            FormLoad()


            function FormLoad() {
                $scope.isRouteLoading = false;
                LoadCacheHelper()
                medifirstService.get("emr/get-data-combo-emr", true).then(function(dat) {
                    var dataCombo = dat.data.vitalsign2
                    for (var i = 0; i < dataCombo.length; i++) {
                        if (dataCombo[i].id == 1) {
                            dataCombo[i].simbol = "⋁";
                        } else if (dataCombo[i].id == 2) {
                            dataCombo[i].simbol = "⋀";
                        } else if (dataCombo[i].id == 3) {
                            dataCombo[i].simbol = "⬤";
                        } else if (dataCombo[i].id == 4) {
                            dataCombo[i].simbol = "▲";
                        } else if (dataCombo[i].id == 15) {
                            dataCombo[i].simbol = "";
                        }
                    }
                    $scope.listVitalSigns = dataCombo;
                });

                medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function(e) {
                    $scope.listdokter = e;
                })
                medifirstService.get("emr/get-data-keterangan-pengkajianicu", true).then(function(dat) {
                    var data_gcs = dat.data.gcs;
                    var data_infus = dat.data.infus;
                    var data_jenisvent = dat.data.jenisvent;
                    for (var i = 0; i < data_gcs.length; i++) {
                        data_gcs[i].no = i + 1
                    }
                    for (var i = 0; i < data_jenisvent.length; i++) {
                        data_jenisvent[i].no = i + 1
                    }
                    for (var i = 0; i < data_jenisvent.length; i++) {
                        data_jenisvent[i].no = i + 1
                    }

                    $scope.GridPasien = new kendo.data.DataSource({
                        data: data_gcs,
                        group: $scope.groups,
                        pageSize: 15,
                        total: data_gcs.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                    $scope.dataInfus = new kendo.data.DataSource({
                        data: data_infus,
                        pageSize: 50,
                        total: data_infus.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                    $scope.dataJenisVent = new kendo.data.DataSource({
                        data: data_jenisvent,
                        pageSize: 50,
                        total: data_jenisvent.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });



            }

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }

                    $scope.cc.nocm = chacePeriode[0]
                    $scope.cc.namapasien = chacePeriode[1]
                    $scope.cc.jeniskelamin = chacePeriode[2]
                    $scope.cc.noregistrasi = chacePeriode[3]
                    $scope.cc.umur = chacePeriode[4]
                    $scope.cc.kelompokpasien = chacePeriode[5]
                    $scope.cc.tglregistrasi = chacePeriode[6]
                    $scope.cc.norec = chacePeriode[7]
                    $scope.cc.norec_pd = chacePeriode[8]
                    $scope.cc.objectkelasfk = chacePeriode[9]
                    $scope.cc.namakelas = chacePeriode[10]
                    $scope.cc.objectruanganfk = chacePeriode[11]
                    $scope.cc.namaruangan = chacePeriode[12]
                    $scope.cc.DataNoregis = chacePeriode[13]
                    $scope.cc.norec_emr = '-'
                    $scope.cc.golongandarah = chacePeriode[20]
                        // if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        //     $scope.showTombol = true
                        // }
                        //  medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
                        //     $scope.item.noregistrasi, true).then(function (dat) {
                        //         $scope.item.statusVerif = dat.data.status
                        //     });

                    medifirstService.get("emr/get-data-riwayat-emr-icu?NoRegistrasi=" + norec_pd, true).then(function(dat) {
                        var dataRiwayat = dat.data.data_riwayat
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dataRiwayat.length; i++) {
                            dataRiwayat[i].no = i + 1
                        }
                        $scope.dataDaftar = new kendo.data.DataSource({
                            data: dataRiwayat,
                            total: dataRiwayat,
                        });
                    });
                }
                init()
            }
            $scope.back = function() {
                $scope.myVar = 1
                $scope.visible = false
            }
            $scope.munculperawatan = function() {

                $scope.diagnosis = false;
                $scope.pengkajian = true;
            }
            $scope.munculperawatan2 = function() {

                $scope.popupEtiket2.center().open();
            }
            $scope.munculperawatan3 = function() {

                $scope.popupEtiket3.center().open();
            }
            $scope.visible = false
            $scope.create = function() {
                $scope.visible = true
                $scope.myVar = 2
                norec_Emr = ""
                $scope.dataSelected = ""
                LoadCacheHelper();
                init();
                GridColumnLoad();
                tampildetail(false);
                $scope.item.obj = "";
            }

            $scope.klikGrid = function(dataSelected) {
                if (dataSelected != undefined) {
                    toastr.info('Data Terpilih');
                    $scope.dataSelected = dataSelected
                    nomorEMR = $scope.dataSelected.nomoremr;
                    tampildetail(true);
                }
            }

            $scope.Lihat = function() {
                // $scope.user.poto = "data:image/jpg;base64,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t2slDIkyyPvvvWdH/NIs3lRlKm14aAKXp1LzddM75NijkGGGzlRecOFxAb704ot2RFH8kWcbaDEuH6740I6s45qrrjJp3f/973/tiF/orXXayafYIyVMpQ0PE3GbLba0R/4RZeiwHLvoWOWVWABxW3Erigv26dM3GHn22fbILx+8/76Z288/95wdWcexQ4bWdHX7wvTWOqp+okOVqbThoX8HraDzAq0qLoqwHPsbS94wY2+9+aYd8c8Xn3cYnoUL1PAo/iHYn5fLafXPq83cvvfue+zIOsgqnTTxYnvknzzTyFuNShseisgoOMuLlStXmouCWgJh8dPPmDHfOlZh0KbjNdG2UhTf7LlHTyOAmxe406IForLY8qVIXQtkcxpl2FWZShuem2+8KdesNrShoquxRx5+2IxRy5MX7Lh4TRpiKYpvUC3IqzgaevfsuUHKNG5l5jzK1HkxccIEUxiubEilDU9e4oVhUAxAl02QLJzffvvNjvjn9ddeM6+pWW1KHlCwedH48fbIP7WUoWdMmx5s3mmT3BILgNRuyiSUDam04RF16jwLKaOttm+56eZcd13wxGOPm/dNp0RF8Q31LHnGVkhk6LvX3vaogyLcXmgi5hlDbiUqbXieevJJcwP+9NNP7Yh/cAOMHb3O312Ebtqc22437xvBREXxjen/dMGF9sg/tURwEeE95KCD7VE+YGx37NLVHilhKm148mgIFSUaaJ07Z07uRgD13jyTKpRqw+4DKZu8uPXmDi8CsjWCSW3OuTEbca1aBeNKxQ2PNF+jkj8v0IoKB1qL0E1DL27fvn3tkaL45eABA3ItpHxg/nxzTYXr5fI+BzhnxAjte1WHShueItKKcTtMuHBdoFV00/JMp8bXTTM4RcmDvHcb0gI7rF7Qp/deJs6TJ8cMGZKrFFYrUWnD89VXX5kJ+tijj9oR/+y8407BxRddZI/y102jwymquaSSK0oenDRsWDDo4IH2yD9vvvGmuabCRdnopuWhSh2GLqdnDj/dHilhKm14pMr5vnvutSP+2alrt2DSxZfYo/x105YuXZrr6ynKiDPPCvbr188e+WfJkiUbLOaMUOkp+QiVCtTwUMujbEilDc///M//mAlaryuoD0inDguCrtVNe/wJO+IXild5vZ9++smOKIpfzh83Lui52+72yD+vvfqqmeNhaaq83X3U5ZHg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"

                if ($scope.dataSelected == undefined) {
                    toastr.warning('Pilih Data Yang Akan Dilihat, Peringatan!')
                    return;
                }
                $scope.visible = true

                $scope.cc.norec_emr = $scope.dataSelected.nomoremr;
                norec_Emr = $scope.dataSelected.norec;
                nomorEMR = $scope.dataSelected.nomoremr;
                GridColumnLoad();
                tampildetail(true);
                medifirstService.get("emr/get-masalah?jenis=penunjang&norecemricufk=" + norec_Emr, true).then(function(dat) {
                    $scope.dataGridobat = dat.data.data;
                    $scope.dataGridperawat = dat.data.data1;
                    $scope.dataGridperawat2 = dat.data.data2;
                    $scope.dataGridperawat3 = dat.data.data3;
                    $scope.p1 = dat.data.datax[0].paraf;
                    $scope.p2 = dat.data.datax2[0].paraf;
                    $scope.p3 = dat.data.datax3[0].paraf;

                });
                medifirstService.get("emr/get-soapicu?&norecemricufk=" + norec_Emr + "&noemr=" + nomorEMR, true).then(function(dat) {
                    $scope.dataGridsoap = dat.data.data;
                    $scope.dataGridsoap2 = dat.data.data2;
                    $scope.dataGridsoap3 = dat.data.data3;

                });

                medifirstService.get("emr/get-data-detail-emr-icu?NorecRmi=" + norec_Emr, true).then(function(dat) {
                    var Data = dat.data.Details;


                    for (var i = 0; i < Data.length; i++) {

                        var vital = null;
                        // if (Data.[i].group == '1. VITAL SIGNS') {
                        //     vital = $scope.item.VSigns.id
                        // }
                        var datas = {
                            column: Data[i].jam,
                            desc: Data[i].column,
                            group: Data[i].group,
                            field: Data[i].field,
                            keteranganobservasi: Data[i].nilaiobservasi,
                            vitalsigns: vital
                        }
                        data_Save.push(datas);
                    }

                    var Datas = $scope.data1._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            if (Data[j].group == Datas[i].group) {
                                // if (Data[j].column == Datas[i].desc) {
                                for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                    var Tutu = Object.keys(Datas[i])[k]
                                    if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                                        Datas[i][Tutu] = Data[j].nilaiobservasi
                                        $scope.myVar = 2
                                    }
                                }
                                // }
                            }
                        }
                    }


                    var Datas = $scope.data2._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            if (Data[j].group == Datas[i].group) {
                                // if (Data[j].column == Datas[i].desc) {
                                for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                    var Tutu = Object.keys(Datas[i])[k]
                                    if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                                        Datas[i][Tutu] = Data[j].nilaiobservasi
                                        $scope.myVar = 2
                                    }
                                }
                                // }
                            }
                        }
                    }

                    var Datas = $scope.data3._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            if (Data[j].group == Datas[i].group) {
                                // if (Data[j].column == Datas[i].desc) {
                                for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                    var Tutu = Object.keys(Datas[i])[k]
                                    if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                                        Datas[i][Tutu] = Data[j].nilaiobservasi
                                        $scope.myVar = 2
                                    }
                                }
                                // }
                            }
                        }
                    }
                    var Datas = $scope.data4._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            if (Data[j].group == Datas[i].group) {
                                // if (Data[j].column == Datas[i].desc) {
                                for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                    var Tutu = Object.keys(Datas[i])[k]
                                    if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                                        Datas[i][Tutu] = Data[j].nilaiobservasi
                                        $scope.myVar = 2
                                    }
                                }
                                // }
                            }
                        }
                    }
                    var Datas = $scope.data5._data
                    for (var i = 0; i < Datas.length; i++) {
                        for (var j = 0; j < Data.length; j++) {
                            if (Data[j].group == Datas[i].group) {
                                // if (Data[j].column == Datas[i].desc) {
                                for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                                    var Tutu = Object.keys(Datas[i])[k]
                                    if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                                        Datas[i][Tutu] = Data[j].nilaiobservasi
                                        $scope.myVar = 2
                                    }
                                }
                                // }
                            }
                        }
                    }
                });
            }


            $scope.columnDaftar = {
                // toolbar: [{
                //     name: "create", text: "Input Baru",
                //     template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Konsul</button>'
                // },],
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 40 },
                    { field: "tglemr", title: "Tanggal", width: 120 },
                    { field: "namaruangan", title: "Ruangan", width: 120 },
                    { field: "namalengkap", title: "Dokter", width: 120 },
                    { field: "nomoremr", title: "Nomor EMR", width: 120 },
                    // { field: "", title: "Keterangan", width: 120 },
                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }, { name: "edit", text: "Edit", click: editData }], title: "&nbsp;", width: 120 }
                ],
            };

            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            //  LoadCache();
            //  function LoadCache(){
            //      var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterCtrl');
            //      if(chacePeriode != undefined){
            //          norec_apd = chacePeriode[0]
            //          nocm_str = chacePeriode[1]
            //          // $scope.item.ruanganAsal = namaRuangan;
            //          // manageSarprasPhp.getDataTableTransaksi("logistik/get_detailPD?norec_apd="+norec_apd, true).then(function(data_ih){
            //          //     $scope.item.jenisPenjamin = data_ih.data.detailPD[0].namarekanan
            //          //     $scope.item.kelompokPasien = data_ih.data.detailPD[0].kelompokpasien
            //          //     $scope.item.beratBadan = data_ih.data.detailPD[0].beratbadan
            //          // });
            //          init()
            //     }else{

            //     }

            // }

            $scope.groups = {
                field: "reportdisplay",
                aggregates: [{
                    field: "reportdisplay",
                    aggregate: "count"
                }]
            };

            $scope.aggregate = [{
                field: "reportdisplay",
                aggregate: "count"
            }]

            $scope.ColumnPasien = {
                sortable: true,
                selectable: "row",
                columns: [{
                        "field": "namagcs",
                        "title": "GCS",
                        "width": "150px",
                    },
                    {
                        hidden: true,
                        field: "reportdisplay",
                        title: "Head",
                        // aggregates: ["count"],
                        // groupHeaderTemplate: "Head #= value # (Jumlah: #= count#)"
                    }
                ]
            }

            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }

            $scope.ColumnInfus = {
                sortable: true,
                selectable: "row",
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "45px",
                    // },
                    {
                        "field": "namainfus",
                        "title": "Nama Infus",
                        "width": "180px"
                    }
                ]
            }

            $scope.ColumnJenisVent = {
                sortable: true,
                selectable: "row",
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "45px",
                    // },
                    {
                        "field": "namajenisvent",
                        "title": "Jenis Vent",
                        "width": "80px"
                    }
                ]
            }

            function init() {
                datana = [{
                        'group': '1. VITAL SIGNS',
                        'desc': '220',
                        'desc1': '41',
                        'desc2': '200',
                        'desc3': '100',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '200',
                        'desc1': '40',
                        'desc2': '180',
                        'desc3': '90',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '180',
                        'desc1': '39',
                        'desc2': '160',
                        'desc3': '80',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '160',
                        'desc1': '38',
                        'desc2': '140',
                        'desc3': '70',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '140',
                        'desc1': '37',
                        'desc2': '120',
                        'desc3': '60',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '120',
                        'desc1': '36',
                        'desc2': '100',
                        'desc3': '50',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '100',
                        'desc1': '35',
                        'desc2': '80',
                        'desc3': '40',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '80',
                        'desc1': '34',
                        'desc2': '60',
                        'desc3': '30',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '60',
                        'desc1': '33',
                        'desc2': '40',
                        'desc3': '20',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '40',
                        'desc1': '32',
                        'desc2': '20',
                        'desc3': '10',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '1. VITAL SIGNS',
                        'desc': '20',
                        'desc1': '31',
                        'desc2': '0',
                        'desc3': '0',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    }, {
                        'group': '1. VITAL SIGNS',
                        'desc': 'EKG/NADI',
                        'desc1': '',
                        'desc2': '',
                        'desc3': 'EKG/NADI',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    }, {
                        'group': '1. VITAL SIGNS',
                        'desc': 'CVP',
                        'desc1': '',
                        'desc2': '',
                        'desc3': 'CVP',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    }, {
                        'group': '1. VITAL SIGNS',
                        'desc': 'Sat O2',
                        'desc1': '',
                        'desc2': '',
                        'desc3': 'Sat O2',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },

                ];


                datana2 = [{
                        'group': '2. SSP',
                        'desc': 'KESADARAN',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '2. SSP',
                        'desc': 'RM',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '2. SSP',
                        'desc': 'BM',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '2. SSP',
                        'desc': 'RV',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '2. SSP',
                        'desc': 'Reaksi dan besa Pupil Ka',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '2. SSP',
                        'desc': 'Reaksi dan besa Pupil Ki',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '2. SSP',
                        'desc': 'EXTREMITAS Tka/Tki',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '2. SSP',
                        'desc': 'EXTREMITAS Kka/Kki',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },

                    // ];


                    // datana3 = [


                    {
                        'group': '3. RESPIRASI',
                        'desc': 'Tipe / Ventilasi',
                        'c700': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'PEEP',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'RESP RATE',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'TIDAL VOLUME / M.V',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'FI 02',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'PI Inspirasi',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'Flow / 1 E:Ratio',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'Pressure',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '3. RESPIRASI',
                        'desc': 'Ukuran ETT /  Tekanan Balon',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    }

                ];

                datana3 = [


                    {
                        'group': '4. intake',
                        'desc': 'INFUS :',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'I',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'II',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'III',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'IV',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'V',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'VI',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'VII',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'VIII',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'IX',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'X',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'ORAL/NGT',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'Darah',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'Plasma Expander',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'Albumin',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    },
                    {
                        'group': '4. intake',
                        'desc': 'Jumlah 1 jam kumulatif',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': '',
                        'c700a': '',
                        'c800a': '',
                        'c900a': '',
                        'c1000a': '',
                        'c1100a': '',
                        'c1200a': '',
                        'c1300a': '',
                        'c1400a': '',
                        'c1500a': '',
                        'c1600a': '',
                        'c1700a': '',
                        'c1800a': '',
                        'c1900a': '',
                        'c2000a': '',
                        'c2100a': '',
                        'c2200a': '',
                        'c2300a': '',
                        'c2400a': '',
                        'c100a': '',
                        'c200a': '',
                        'c300a': '',
                        'c400a': '',
                        'c500a': '',
                        'c600a': ''
                    }

                ];
                datana4 = [{
                        'group': '4. OUTPUT',
                        'desc': 'KESADARAN',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'OUTPUT',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'URINE',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'NGT',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'BAB',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'CAIRAN TUBUH LAIN / IWL',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'DRAIN 1',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'DRAIN 2',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'DRAIN 3',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'DRAIN 4',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'JUMLAH KUMULATIF 1',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '4. OUTPUT',
                        'desc': 'JUMLAH KUMULATIF 2',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },

                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'PH',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'PO2',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'PCO2',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'HCO3',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'BE',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'SAT.02',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'K',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Na/Cl',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Ca',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Mg/Fosfor',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'HB /Leukosit',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'HT. / Tromb',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Ureum',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Creatinin',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Glukose',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Protein',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'Alb/ Glob',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'SGOT/SGPT',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'BL.T/CL.T',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': '5. LABORAOTIUM',
                        'desc': 'PT/APTT',
                        'c700x': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },



                ];



                datana5 = [

                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'PARENTAL',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'P.I',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'P.II',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'P.III',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'P.IV',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'P.V',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'P.V1',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'P.VII',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'ORAL',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'O.I',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'O.II',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },

                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'O.III',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },

                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'LAIN-LAIN',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'L.I',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'L.II',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'L.III',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },
                    {
                        'group': 'OBAT-OBATAN',
                        'desc': 'L.IV',
                        'c700': '',
                        'c700x': '',
                        'c700x2': '',
                        'c700x3': '',
                        'c700': '',
                        'c800': '',
                        'c900': '',
                        'c1000': '',
                        'c1100': '',
                        'c1200': '',
                        'c1300': '',
                        'c1400': '',
                        'c1500': '',
                        'c1600': '',
                        'c1700': '',
                        'c1800': '',
                        'c1900': '',
                        'c2000': '',
                        'c2100': '',
                        'c2200': '',
                        'c2300': '',
                        'c2400': '',
                        'c100': '',
                        'c200': '',
                        'c300': '',
                        'c400': '',
                        'c500': '',
                        'c600': ''
                    },


                ];

                // GridColumnLoad();
                $scope.data1 = new kendo.data.DataSource({
                    data: datana,
                    total: datana,
                    group: { field: "group" },
                    schema: {
                        model: {}
                    }
                });
                $scope.data2 = new kendo.data.DataSource({
                    data: datana2,
                    total: datana2,
                    group: { field: "group" },
                    schema: {
                        model: {}
                    }
                });
                $scope.data3 = new kendo.data.DataSource({
                    data: datana3,
                    total: datana3,
                    group: { field: "group" },
                    schema: {
                        model: {}
                    }
                });
                $scope.data4 = new kendo.data.DataSource({
                    data: datana4,
                    total: datana4,
                    group: { field: "group" },
                    schema: {
                        model: {}
                    }
                });
                $scope.data5 = new kendo.data.DataSource({
                    data: datana5,
                    total: datana5,
                    group: { field: "group" },
                    schema: {
                        model: {}
                    }
                });
            }

            function GridColumnLoad() {
                $scope.group = {
                    field: "group"
                };

                $scope.columnData1 = {

                    selectable: 'cell',
                    // pageable: true,
                    dataBound: $scope.onDataBound,
                    columns: [{
                            hidden: true,
                            field: "group",
                            title: "." //,
                                // aggregates: ["count"],
                                // groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                        },
                        {
                            "field": "desc",
                            "title": "BP",
                            "width": "50px",
                            "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "desc1",
                            "title": "T",
                            "width": "50px",
                            "template": "<span class='style-rigth'>#: desc1 #</span>"
                        },
                        {
                            "field": "desc2",
                            "title": "HR",
                            "width": "50px",
                            "template": "<span class='style-rigth'>#: desc2 #</span>"
                        },
                        {
                            "field": "desc3",
                            "title": "RR",
                            "width": "50px",
                            "template": "<span class='style-rigth'>#: desc3 #</span>"
                        },
                        {
                            "field": "c700",
                            "title": "7:00",
                            "width": "50px"
                        },
                        {
                            "field": "c800",
                            "title": "8:00",
                            "width": "50px"
                        },
                        {
                            "field": "c900",
                            "title": "9:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1000",
                            "title": "10:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1100",
                            "title": "11:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1200",
                            "title": "12:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1300",
                            "title": "13:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1400",
                            "title": "14:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1500",
                            "title": "15:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1600",
                            "title": "16:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1700",
                            "title": "17:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1800",
                            "title": "18:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1900",
                            "title": "19:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2000",
                            "title": "20:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2100",
                            "title": "21:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2200",
                            "title": "22:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2300",
                            "title": "23:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2400",
                            "title": "24:00",
                            "width": "50px"
                        },
                        {
                            "field": "c100",
                            "title": "1:00",
                            "width": "50px"
                        },
                        {
                            "field": "c200",
                            "title": "2:00",
                            "width": "50px"
                        },
                        {
                            "field": "c300",
                            "title": "3:00",
                            "width": "50px"
                        },
                        {
                            "field": "c400",
                            "title": "4:00",
                            "width": "50px"
                        },
                        {
                            "field": "c500",
                            "title": "5:00",
                            "width": "50px"
                        },
                        {
                            "field": "c600",
                            "title": "6:00",
                            "width": "50px"
                        }
                    ]
                };

                $scope.columnData2 = {

                    selectable: 'cell',
                    // pageable: true,
                    dataBound: $scope.onDataBound2,
                    columns: [{
                            hidden: true,
                            field: "group",
                            title: "." //,
                                // aggregates: ["count"],
                                // groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                        },
                        {
                            "field": "desc",
                            "title": "Description",
                            "width": "200px",
                            "template": "<span class='style-rigth'>#: desc #</span>",
                            // "columns":[
                            //     {
                            //         "field": "c700",
                            //         "title": "7:00",
                            //         "width": "50px"
                            //     },
                            // ]
                        },
                        {
                            "field": "c700",
                            "title": "7:00",
                            "width": "50px"
                        },

                        {
                            "field": "c800",
                            "title": "8:00",
                            "width": "50px"
                        },
                        {
                            "field": "c900",
                            "title": "9:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1000",
                            "title": "10:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1100",
                            "title": "11:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1200",
                            "title": "12:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1300",
                            "title": "13:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1400",
                            "title": "14:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1500",
                            "title": "15:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1600",
                            "title": "16:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1700",
                            "title": "17:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1800",
                            "title": "18:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1900",
                            "title": "19:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2000",
                            "title": "20:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2100",
                            "title": "21:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2200",
                            "title": "22:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2300",
                            "title": "23:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2400",
                            "title": "24:00",
                            "width": "50px"
                        },
                        {
                            "field": "c100",
                            "title": "1:00",
                            "width": "50px"
                        },
                        {
                            "field": "c200",
                            "title": "2:00",
                            "width": "50px"
                        },
                        {
                            "field": "c300",
                            "title": "3:00",
                            "width": "50px"
                        },
                        {
                            "field": "c400",
                            "title": "4:00",
                            "width": "50px"
                        },
                        {
                            "field": "c500",
                            "title": "5:00",
                            "width": "50px"
                        },
                        {
                            "field": "c600",
                            "title": "6:00",
                            "width": "50px"
                        }
                    ]
                };
                $scope.columnData3 = {

                    selectable: 'cell',
                    // pageable: true,
                    dataBound: $scope.onDataBound3,
                    columns: [{
                            hidden: true,
                            field: "group",
                            title: "." //,
                                // aggregates: ["count"],
                                // groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                        },
                        {
                            "field": "desc",
                            "title": "Description",
                            "width": "130px",
                            "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "c700x",
                            "title": "INFUS",
                            "width": "70px",
                            // "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "c700",
                            "title": "CM7:00",
                            "width": "75px"
                        },
                        {
                            "field": "c800",
                            "title": "CA7:00",
                            "width": "75px"
                        },
                        {
                            "field": "c900",
                            "title": "CM8:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1000",
                            "title": "CA8:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1100",
                            "title": "CM9:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1200",
                            "title": "CA9:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1300",
                            "title": "CM10:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1400",
                            "title": "CA10:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1500",
                            "title": "CM11:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1600",
                            "title": "CA11:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1700",
                            "title": "CM12:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1800",
                            "title": "CA12:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1900",
                            "title": "CM13:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2000",
                            "title": "CA13:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2100",
                            "title": "CM14:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2200",
                            "title": "CA14:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2300",
                            "title": "CM15:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2400",
                            "title": "CA15:00",
                            "width": "75px"
                        },
                        {
                            "field": "c100",
                            "title": "CM16:00",
                            "width": "75px"
                        },
                        {
                            "field": "c200",
                            "title": "CA16:00",
                            "width": "75px"
                        },
                        {
                            "field": "c300",
                            "title": "CM17:00",
                            "width": "75px"
                        },
                        {
                            "field": "c400",
                            "title": "CA17:00",
                            "width": "75px"
                        },
                        {
                            "field": "c500",
                            "title": "CM18:00",
                            "width": "75px"
                        },
                        {
                            "field": "c600",
                            "title": "CA18:00",
                            "width": "75px"
                        },
                        {
                            "field": "c700a",
                            "title": "CM19:00",
                            "width": "75px"
                        },
                        {
                            "field": "c800a",
                            "title": "CA19:00",
                            "width": "75px"
                        },
                        {
                            "field": "c900a",
                            "title": "CM20:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1000a",
                            "title": "CA20:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1100a",
                            "title": "CM21:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1200a",
                            "title": "CA21:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1300a",
                            "title": "CM22:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1400a",
                            "title": "CA22:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1500a",
                            "title": "CM23:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1600a",
                            "title": "CA23:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1700a",
                            "title": "CM24:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1800a",
                            "title": "CA24:00",
                            "width": "75px"
                        },
                        {
                            "field": "c1900a",
                            "title": "CM1:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2000a",
                            "title": "CA1:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2100a",
                            "title": "CM2:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2200a",
                            "title": "CA2:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2300a",
                            "title": "CM3:00",
                            "width": "75px"
                        },
                        {
                            "field": "c2400a",
                            "title": "CA3:00",
                            "width": "75px"
                        },
                        {
                            "field": "c100a",
                            "title": "CM4:00",
                            "width": "75px"
                        },
                        {
                            "field": "c200a",
                            "title": "CA4:00",
                            "width": "75px"
                        },
                        {
                            "field": "c300a",
                            "title": "CM5:00",
                            "width": "75px"
                        },
                        {
                            "field": "c400a",
                            "title": "CA5:00",
                            "width": "75px"
                        },
                        {
                            "field": "c500a",
                            "title": "CM6:00",
                            "width": "75px"
                        },
                        {
                            "field": "c600a",
                            "title": "CA6:00",
                            "width": "75px"
                        }
                    ]
                };
                $scope.columnData5 = {

                    selectable: 'cell',
                    // pageable: true,
                    dataBound: $scope.onDataBound5,
                    columns: [{
                            hidden: true,
                            field: "group",
                            title: "." //,
                                // aggregates: ["count"],
                                // groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                        },
                        {
                            "field": "desc",
                            "title": "Description",
                            "width": "130px",
                            "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "c700x",
                            "title": "OBAT",
                            "width": "70px",
                            // "template": "<span class='style-rigth'>#: desc #</span>"
                        }, {
                            "field": "c700x2",
                            "title": "DOSIS",
                            "width": "70px",
                            // "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "c700x3",
                            "title": "DOKTER",
                            "width": "70px",
                            // "template": "<span class='style-rigth'>#: desc #</span>"
                        },
                        {
                            "field": "c700",
                            "title": "7:00",
                            "width": "50px"
                        },

                        {
                            "field": "c800",
                            "title": "8:00",
                            "width": "50px"
                        },
                        {
                            "field": "c900",
                            "title": "9:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1000",
                            "title": "10:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1100",
                            "title": "11:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1200",
                            "title": "12:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1300",
                            "title": "13:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1400",
                            "title": "14:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1500",
                            "title": "15:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1600",
                            "title": "16:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1700",
                            "title": "17:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1800",
                            "title": "18:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1900",
                            "title": "19:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2000",
                            "title": "20:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2100",
                            "title": "21:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2200",
                            "title": "22:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2300",
                            "title": "23:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2400",
                            "title": "24:00",
                            "width": "50px"
                        },
                        {
                            "field": "c100",
                            "title": "1:00",
                            "width": "50px"
                        },
                        {
                            "field": "c200",
                            "title": "2:00",
                            "width": "50px"
                        },
                        {
                            "field": "c300",
                            "title": "3:00",
                            "width": "50px"
                        },
                        {
                            "field": "c400",
                            "title": "4:00",
                            "width": "50px"
                        },
                        {
                            "field": "c500",
                            "title": "5:00",
                            "width": "50px"
                        },
                        {
                            "field": "c600",
                            "title": "6:00",
                            "width": "50px"
                        }
                    ]
                };
                $scope.columnData4 = {

                    selectable: 'cell',
                    // pageable: true,
                    dataBound: $scope.onDataBound4,
                    columns: [{
                            hidden: true,
                            field: "group",
                            title: "." //,
                                // aggregates: ["count"],
                                // groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                        },
                        {
                            "field": "desc",
                            "title": "Description",
                            "width": "150px",
                            "template": "<span class='style-rigth'>#: desc #</span>",
                            // "columns":[
                            //     {
                            //         "field": "c700",
                            //         "title": "7:00",
                            //         "width": "50px"
                            //     },
                            // ]
                        },
                        {
                            "field": "c700x",
                            "title": ".",
                            "width": "50px"
                        },
                        {
                            "field": "c700",
                            "title": "7:00",
                            "width": "50px"
                        },

                        {
                            "field": "c800",
                            "title": "8:00",
                            "width": "50px"
                        },
                        {
                            "field": "c900",
                            "title": "9:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1000",
                            "title": "10:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1100",
                            "title": "11:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1200",
                            "title": "12:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1300",
                            "title": "13:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1400",
                            "title": "14:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1500",
                            "title": "15:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1600",
                            "title": "16:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1700",
                            "title": "17:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1800",
                            "title": "18:00",
                            "width": "50px"
                        },
                        {
                            "field": "c1900",
                            "title": "19:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2000",
                            "title": "20:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2100",
                            "title": "21:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2200",
                            "title": "22:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2300",
                            "title": "23:00",
                            "width": "50px"
                        },
                        {
                            "field": "c2400",
                            "title": "24:00",
                            "width": "50px"
                        },
                        {
                            "field": "c100",
                            "title": "1:00",
                            "width": "50px"
                        },
                        {
                            "field": "c200",
                            "title": "2:00",
                            "width": "50px"
                        },
                        {
                            "field": "c300",
                            "title": "3:00",
                            "width": "50px"
                        },
                        {
                            "field": "c400",
                            "title": "4:00",
                            "width": "50px"
                        },
                        {
                            "field": "c500",
                            "title": "5:00",
                            "width": "50px"
                        },
                        {
                            "field": "c600",
                            "title": "6:00",
                            "width": "50px"
                        }
                    ]
                };

            }

            $scope.onDataBound = function(e) {
                var grid = $("#kGrid").data("kendoGrid");
                $(grid.tbody).on("click", "td", function(e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx >= 1) {
                        var colDateIdx = colIdx - 1;
                        var columns = grid.options.columns[colDateIdx].title;
                        var field = grid.options.columns[colDateIdx].field;
                        var datas = {
                            judulatas: columns,
                            judulsamping: $scope.selectedData.desc,
                            group: $scope.selectedData.group,
                            field: field
                        };
                        data_head.push(datas);

                        if ($scope.selectedData.group == "1. VITAL SIGNS") {
                            $scope.vitalSigns = true;
                        } else {
                            $scope.vitalSigns = false;
                        }
                        $scope.showDetail(data_head, $scope.selectedData);
                    }
                });
            }
            $scope.onDataBound2 = function(e) {
                var grid = $("#kGrid2").data("kendoGrid");
                $(grid.tbody).on("click", "td", function(e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx >= 1) {
                        var colDateIdx = colIdx - 1;
                        var columns = grid.options.columns[colDateIdx].title;
                        var field = grid.options.columns[colDateIdx].field;
                        var datas = {
                            judulatas: columns,
                            judulsamping: $scope.selectedData.desc,
                            group: $scope.selectedData.group,
                            field: field
                        };
                        data_head.push(datas);

                        if ($scope.selectedData.group == "1. VITAL SIGNS") {
                            $scope.vitalSigns = true;
                        } else {
                            $scope.vitalSigns = false;
                        }
                        $scope.showDetail(data_head, $scope.selectedData);
                    }
                });
            }
            $scope.onDataBound3 = function(e) {
                var grid = $("#kGrid3").data("kendoGrid");
                $(grid.tbody).on("click", "td", function(e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx >= 1) {
                        var colDateIdx = colIdx - 1;
                        var columns = grid.options.columns[colDateIdx].title;
                        var field = grid.options.columns[colDateIdx].field;
                        var datas = {
                            judulatas: columns,
                            judulsamping: $scope.selectedData.desc,
                            group: $scope.selectedData.group,
                            field: field
                        };
                        data_head.push(datas);

                        if ($scope.selectedData.group == "1. VITAL SIGNS") {
                            $scope.vitalSigns = true;
                        } else {
                            $scope.vitalSigns = false;
                        }
                        $scope.showDetail(data_head, $scope.selectedData);
                    }
                });
            }
            $scope.onDataBound4 = function(e) {
                var grid = $("#kGrid4").data("kendoGrid");
                $(grid.tbody).on("click", "td", function(e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx >= 1) {
                        var colDateIdx = colIdx - 1;
                        var columns = grid.options.columns[colDateIdx].title;
                        var field = grid.options.columns[colDateIdx].field;
                        var datas = {
                            judulatas: columns,
                            judulsamping: $scope.selectedData.desc,
                            group: $scope.selectedData.group,
                            field: field
                        };
                        data_head.push(datas);

                        if ($scope.selectedData.group == "1. VITAL SIGNS") {
                            $scope.vitalSigns = true;
                        } else {
                            $scope.vitalSigns = false;
                        }
                        $scope.showDetail(data_head, $scope.selectedData);
                    }
                });
            }
            $scope.onDataBound5 = function(e) {
                var grid = $("#kGrid5").data("kendoGrid");
                $(grid.tbody).on("click", "td", function(e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx >= 1) {
                        var colDateIdx = colIdx - 1;
                        var columns = grid.options.columns[colDateIdx].title;
                        var field = grid.options.columns[colDateIdx].field;
                        var datas = {
                            judulatas: columns,
                            judulsamping: $scope.selectedData.desc,
                            group: $scope.selectedData.group,
                            field: field
                        };
                        data_head.push(datas);

                        if ($scope.selectedData.group == "1. VITAL SIGNS") {
                            $scope.vitalSigns = true;
                        } else {
                            $scope.vitalSigns = false;
                        }
                        $scope.showDetail(data_head, $scope.selectedData);
                    }
                });
            }

            $scope.showDetail = function(data_head, selectedData) {
                // 
                if (data_head.length > 0) {

                    $scope.item.GroupHeader = data_head[0].group;
                    $scope.item.Deskripsi = data_head[0].judulsamping;
                    $scope.item.JamInput = data_head[0].judulatas;
                    for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
                        for (var j = 0; j < data_head.length; j++) {
                            if (data_head[0].group == "1. VITAL SIGNS") {
                                $scope.SistoleChart = true;
                                $scope.NonSistoleChart = false;
                                if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                    if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
                                        var isi = $scope.selectedData[Object.keys($scope.selectedData)[i]].split(" ");
                                        // var isiCombo = isi[1].split(" ");
                                        medifirstService.get("emr/get-data-riwayat-emr-icu-detail?NoRegistrasi=" + norec_pd, true).then(function(dat) {
                                            var datas = dat.data.data_riwayat;
                                            for (var i = 0; i < datas.length; i++) {
                                                if (datas[i].objectvitalsigns != undefined || datas[i].objectvitalsigns != null) {
                                                    if (datas[i].objectvitalsigns == 1) {
                                                        datas[i].simbol = "⋁";
                                                    } else if (datas[i].objectvitalsigns == 2) {
                                                        datas[i].simbol = "⋀";
                                                    } else if (datas[i].objectvitalsigns == 3) {
                                                        datas[i].simbol = "⬤";
                                                    } else if (datas[i].objectvitalsigns == 4) {
                                                        datas[i].simbol = "▲";
                                                    }
                                                    $scope.item.VSigns = { id: datas[i].objectvitalsigns, vitalsigns: datas[i].vitalsigns, simbol: datas[i].simbol }
                                                }
                                            }
                                            $scope.item.Isian = isi[1]
                                        });
                                    }
                                }
                            } else {
                                $scope.SistoleChart = false;
                                $scope.NonSistoleChart = true;
                                if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                    if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
                                        $scope.item.Isian = $scope.selectedData[Object.keys($scope.selectedData)[i]]
                                    }
                                }
                            }
                        }
                    }
                    $scope.PopUpDetailPeserta.center().open();
                } else {
                    $scope.PopUpDetailPeserta.center().open();
                }

            }

            $scope.tambah = function() {
                if (data_head.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head[0].group == "1. VITAL SIGNS" && $scope.item.VSigns == undefined) {
                    toastr.warning('Vital Signs harus diisi, Peringatan!')
                    return;
                }

                var vital = null;
                if ($scope.item.VSigns != undefined) {
                    vital = $scope.item.VSigns.id
                }

                for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
                    for (var j = 0; j < data_head.length; j++) {
                        if (data_head[0].group == "1. VITAL SIGNS") {
                            if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.VSigns.simbol + " " + $scope.item.Isian
                                var datas = {
                                    column: data_head[0].judulatas,
                                    desc: data_head[0].judulsamping,
                                    group: data_head[0].group,
                                    field: data_head[0].field,
                                    keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
                                    vitalsigns: vital
                                }
                                data_Save.push(datas);
                            }
                        } else {
                            if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.Isian
                                var datas = {
                                    column: data_head[0].judulatas,
                                    desc: data_head[0].judulsamping,
                                    group: data_head[0].group,
                                    field: data_head[0].field,
                                    keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
                                    vitalsigns: vital
                                }
                                data_Save.push(datas);
                            }
                        }
                    }
                }
                kosongkeun()
                $scope.PopUpDetailPeserta.close();
            }

            $scope.batal = function() {
                kosongkeun()

                $scope.PopUpDetailPeserta.close();
            }
            $scope.Batal = function() {
                $scope.diagnosis = true;
                $scope.pengkajian = false;

            }

            function kosongkeun() {
                $scope.selectedData = undefined;
                data_head = [];
                $scope.item.Isian = undefined;
                $scope.item.VSigns = undefined;
            }

            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            function tampildetail(status) {
                // paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                // medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=dinamis", true).then(function (dat) {
                //     debugger
                //     $scope.isRouteLoading = false
                //     var nomorEMRSS = ''
                //     cacheHelper.set('cacheEmrLaporanOperasi', undefined)
                //     if (dat.data.data.length > 0) {
                //         for (var i = 0; i < dat.data.data.length; i++) {
                //             const element = dat.data.data[i];
                //             element.no = i + 1
                //         }
                //         nomorEMRSS = nomorEMR
                //         nomorEMR = nomorEMRSS 
                //         $scope.cc.emrfk = '516'
                //         setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                //     } else {
                //         nomorEMRSS = '-'
                //         nomorEMR = nomorEMRSS 
                //         $scope.cc.emrfk = '516'
                //         setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                //     }
                // });
                var nomorEMRSS = ''
                if (status == true) {
                    nomorEMRSS = nomorEMR
                        // nomorEMR = nomorEMRSS 
                    $scope.cc.emrfk = '524'
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                } else {
                    nomorEMRSS = '-'
                        // nomorEMR = nomorEMRSS 
                    $scope.cc.emrfk = '524'
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                }
                //     function setobjectToModel(nomorEMRSS, emrfk) {
                //         if (nomorEMRSS == '-') {
                //             medifirstService.get("emr/get-rekam-medis-dynamic-polri?emrid=" + emrfk).then(function (e) {
                //                 $scope.listData = e.data
                //                 $scope.item.title = e.data.title
                //                 $scope.item.classgrid = e.data.classgrid

                //                 $scope.cc.emrfk = emrfk
                //                 $scope.item.objcbo = []
                //                 for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom1[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom1[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }

                //                 for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom2[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom2[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }
                //                 for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom3[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom3.child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom3[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }

                //             })
                //         } else {
                //             var chekedd = false
                //             medifirstService.get("emr/get-rekam-medis-dynamic-polri?emrid=" + emrfk).then(function (e) {
                //                 $scope.listData = e.data
                //                 $scope.item.title = e.data.title
                //                 $scope.item.classgrid = e.data.classgrid

                //                 $scope.cc.emrfk = emrfk

                //                 $scope.item.objcbo = []
                //                 for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom1[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom1[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }
                //                 for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom2[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom2[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }
                //                 for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom3[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom3[i].child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom3[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }
                //                 medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                //                     $scope.item.obj = []
                //                     $scope.item.obj2 = []
                //                     dataLoad = dat.data.data
                //                     for (var i = 0; i <= dataLoad.length - 1; i++) {
                //                         if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                //                             if (dataLoad[i].type == "textbox") {
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                //                             }
                //                             if (dataLoad[i].type == "textbox2") {
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                //                             }
                //                             if (dataLoad[i].type == "checkbox") {
                //                                 chekedd = false
                //                                 if (dataLoad[i].value == '1') {
                //                                     chekedd = true
                //                                 }
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                //                             }

                //                             if (dataLoad[i].type == "datetime") {
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('YYYY-MM-DD HH:mm:ss');//new Date(dataLoad[i].value)
                //                             }
                //                             if (dataLoad[i].type == "time") {
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('HH:mm');//new Date(dataLoad[i].value)
                //                             }
                //                             if (dataLoad[i].type == "date") {
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('YYYY-MM-DD');//new Date(dataLoad[i].value)
                //                             }

                //                             if (dataLoad[i].type == "checkboxtextbox") {
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                //                                 $scope.item.obj2[dataLoad[i].emrdfk] = true
                //                             }
                //                             if (dataLoad[i].type == "textarea") {
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                //                             }
                //                             if (dataLoad[i].type == "combobox") {
                //                                 var str = dataLoad[i].value
                //                                 var res = str.split("~");
                //                                 // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                //                                 $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                //                             }
                //                         }

                //                     }
                //                 })




                //             });
                //         }
                //     }
                // }
                $scope.user.poto = "data:image/jpg;base64,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t2slDIkyyPvvvWdH/NIs3lRlKm14aAKXp1LzddM75NijkGGGzlRecOFxAb704ot2RFH8kWcbaDEuH6740I6s45qrrjJp3f/973/tiF/orXXayafYIyVMpQ0PE3GbLba0R/4RZeiwHLvoWOWVWABxW3Erigv26dM3GHn22fbILx+8/76Z288/95wdWcexQ4bWdHX7wvTWOqp+okOVqbThoX8HraDzAq0qLoqwHPsbS94wY2+9+aYd8c8Xn3cYnoUL1PAo/iHYn5fLafXPq83cvvfue+zIOsgqnTTxYnvknzzTyFuNShseisgoOMuLlStXmouCWgJh8dPPmDHfOlZh0KbjNdG2UhTf7LlHTyOAmxe406IForLY8qVIXQtkcxpl2FWZShuem2+8KdesNrShoquxRx5+2IxRy5MX7Lh4TRpiKYpvUC3IqzgaevfsuUHKNG5l5jzK1HkxccIEUxiubEilDU9e4oVhUAxAl02QLJzffvvNjvjn9ddeM6+pWW1KHlCwedH48fbIP7WUoWdMmx5s3mmT3BILgNRuyiSUDam04RF16jwLKaOttm+56eZcd13wxGOPm/dNp0RF8Q31LHnGVkhk6LvX3vaogyLcXmgi5hlDbiUqbXieevJJcwP+9NNP7Yh/cAOMHb3O312Ebtqc22437xvBREXxjen/dMGF9sg/tURwEeE95KCD7VE+YGx37NLVHilhKm148mgIFSUaaJ07Z07uRgD13jyTKpRqw+4DKZu8uPXmDi8CsjWCSW3OuTEbca1aBeNKxQ2PNF+jkj8v0IoKB1qL0E1DL27fvn3tkaL45eABA3ItpHxg/nxzTYXr5fI+BzhnxAjte1WHShueItKKcTtMuHBdoFV00/JMp8bXTTM4RcmDvHcb0gI7rF7Qp/deJs6TJ8cMGZKrFFYrUWnD89VXX5kJ+tijj9oR/+y8407BxRddZI/y102jwymquaSSK0oenDRsWDDo4IH2yD9vvvGmuabCRdnopuWhSh2GLqdnDj/dHilhKm14pMr5vnvutSP+2alrt2DSxZfYo/x105YuXZrr6ynKiDPPCvbr188e+WfJkiUbLOaMUOkp+QiVCtTwUMujbEilDc///M//mAlaryuoD0inDguCrtVNe/wJO+IXild5vZ9++smOKIpfzh83Lui52+72yD+vvfqqmeNhaaq83X3U5ZHg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"
                    //         if (nomorEMRSS == '-') {
                    //             medifirstService.get("emr/get-rekam-medis-dynamic-polri?emrid=" + emrfk).then(function (e) {
                    //                 $scope.listData = e.data
                    //                 $scope.item.title = e.data.title
                    //                 $scope.item.classgrid = e.data.classgrid

                //                 $scope.cc.emrfk = emrfk
                //                 $scope.item.objcbo = []
                //                 for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom1[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom1[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }

                //                 for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom2[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom2[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }
                //                 for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                //                     if (e.data.kolom3[i].cbotable != null) {
                //                         medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function (data) {
                //                             $scope.item.objcbo[data.options.idididid] = data
                //                         })
                //                     }
                //                     for (var ii = e.data.kolom3.child.length - 1; ii >= 0; ii--) {
                //                         if (e.data.kolom3[i].child[ii].cbotable != null) {
                //                             medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function (data) {
                //                                 $scope.item.objcbo[data.options.idididid] = data
                //                             })
                //                         }
                //                     }
                //                 }

                //             })
                //         } else {
                function setobjectToModel(nomorEMRSS, emrfk) {
                    if (nomorEMRSS == '-') {
                        medifirstService.get("emr/get-rekam-medis-dynamic-polri?emrid=" + emrfk).then(function(e) {
                            $scope.listData = e.data
                            $scope.item.title = e.data.title
                            $scope.item.classgrid = e.data.classgrid

                            $scope.cc.emrfk = emrfk
                            $scope.item.objcbo = []
                            for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                                if (e.data.kolom1[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function(data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom1[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }

                            for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                                if (e.data.kolom2[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function(data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom2[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }
                            for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                                if (e.data.kolom3[i].cbotable != null) {
                                    medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function(data) {
                                        $scope.item.objcbo[data.options.idididid] = data
                                    })
                                }
                                for (var ii = e.data.kolom3.child.length - 1; ii >= 0; ii--) {
                                    if (e.data.kolom3[i].child[ii].cbotable != null) {
                                        medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function(data) {
                                            $scope.item.objcbo[data.options.idididid] = data
                                        })
                                    }
                                }
                            }

                        })
                    } else {
                        medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function(dat) {
                            debugger
                            $scope.isLoading = false
                            var chekedd = false
                            $scope.item.obj = []
                            $scope.item.obj2 = []
                                // $scope.item.obj[68] = $scope.now
                            dataLoad = dat.data.data
                            for (var i = 0; i <= dataLoad.length - 1; i++) {
                                if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                                    if (dataLoad[i].type == "textbox") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    }
                                    if (dataLoad[i].type == "checkbox") {
                                        chekedd = false
                                        if (dataLoad[i].value == '1') {
                                            chekedd = true
                                        }
                                        $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                        if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                                            $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                                        }
                                        if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                            var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                            $scope.getSkor2(datass)
                                        }
                                        if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                            var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                            $scope.getSkorNutrisi(datass)
                                        }


                                    }

                                    if (dataLoad[i].type == "datetime") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                    }
                                    if (dataLoad[i].type == "time") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                    }
                                    if (dataLoad[i].type == "date") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                    }

                                    if (dataLoad[i].type == "checkboxtextbox") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                        $scope.item.obj2[dataLoad[i].emrdfk] = true
                                    }
                                    if (dataLoad[i].type == "textarea") {
                                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                    }
                                    if (dataLoad[i].type == "photo") {
                                        $scope.user.poto = dataLoad[i].value
                                    }
                                }

                            }

                        })
                    }
                }
            }

            $scope.simpanERM = function() {

                    if (data_Save.length == 0) {
                        toastr.warning('Data Belum Terambil, Peringatan!')
                        return;
                    }

                    var objSave = {
                        norec: norec_Emr,
                        norec_apd: norec_apd,
                        tglinput: moment($scope.now).format('YYYY-MM-DD hh:mm'),
                        details: data_Save //$scope.data1._data
                    }
                    console.log(objSave);
                    medifirstService.post('emr/save-data-emr-icu', objSave).then(function(e) {
                        norec_Emr = e.data.data_emr.norec;
                        if ($scope.dataSelected.norec == '') {
                            $scope.dataSelected.norec = norec_Emr;
                            norec_Emr = $scope.dataSelected.norec;
                        }

                        save2();
                        // init();
                        // $scope.BatalOrder();
                        // managePhp.postLogging('Simpan EMR ICU', 'Norec strukorder_t',e.data.strukorder.norec, 'Menu Dokter').then(function (res) {
                        // })
                        // LoadCacheHelper();
                        medifirstService.get("emr/get-data-riwayat-emr-icu?NoRegistrasi=" + norec_pd, true).then(function(dat) {
                            var dataRiwayat = dat.data.data_riwayat
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dataRiwayat.length; i++) {
                                dataRiwayat[i].no = i + 1
                            }
                            $scope.dataDaftar = new kendo.data.DataSource({
                                data: dataRiwayat,
                                total: dataRiwayat,
                            });
                        });
                        $scope.myVar = 1;
                    })
                }
                // $scope.Save = function () {
                //     var arrobj = Object.keys($scope.item.obj)
                //     var arrSave = []
                //     for (var i = arrobj.length - 1; i >= 0; i--) {
                //         arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                //     }
                //     $scope.cc.jenisemr = 'dinamis'
                //     var jsonSave = {
                //         head: $scope.cc,
                //         data: arrSave//$scope.item.obj
                //     }
                //     
                //     medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                //         var jsonSave = {
                //             norec: norec_Emr,
                //             nomorEMR: e.data.data.noemr//$scope.item.obj
                //         }
                //         
                //         medifirstService.post('emr/update-noemr', jsonSave).then(function (e) {                        

            //         });

            //         var arrStr = {
            //             0: e.data.data.noemr
            //         }
            //         cacheHelper.set('cacheNomorEMR', arrStr);
            //     });


            // }

            $scope.Save = function() {
                var photo = ""
                if (norec_Emr == "" || norec_Emr == "-") {
                    alert("Simpan Data Vital Dulu!")
                    return;
                }
                kendo.drawing.drawDOM($(".surface"))
                    .then(function(group) {

                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group);
                    }).done(function(data) {
                        photo = data

                    })
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []

                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                arrSave.push({ id: "861", values: photo })
                    // $scope.cc.jenisemr = 'emrigd'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }

                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function(e) {
                    nomorEMR = e.data.data.noemr
                    var jsonSave = {
                            norec: norec_Emr,
                            nomorEMR: e.data.data.noemr //$scope.item.obj
                        }
                        //         
                    medifirstService.post('emr/update-noemr', jsonSave).then(function(e) {

                    });
                    // init()
                    location.reload();
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            function save2() {
                var photo = ""


                kendo.drawing.drawDOM($(".surface"))
                    .then(function(group) {

                        // Render the result as a SVG document
                        return kendo.drawing.exportImage(group);
                    }).done(function(data) {
                        photo = data

                    })
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []

                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == 887) {
                        arrSave.push({ id: arrobj[i], values: moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm') })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    }
                }
                arrSave.push({ id: "861", values: photo })
                    // $scope.cc.jenisemr = 'emrigd'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }

                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function(e) {
                    nomorEMR = e.data.data.noemr
                    var jsonSave = {
                            norec: norec_Emr,
                            nomorEMR: e.data.data.noemr //$scope.item.obj
                        }
                        //         
                    medifirstService.post('emr/update-noemr', jsonSave).then(function(e) {
                        // init()
                        medifirstService.get("emr/get-data-riwayat-emr-icu?NoRegistrasi=" + norec_pd, true).then(function(dat) {
                            var dataRiwayat = dat.data.data_riwayat
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dataRiwayat.length; i++) {
                                dataRiwayat[i].no = i + 1
                            }
                            $scope.dataDaftar = new kendo.data.DataSource({
                                data: dataRiwayat,
                                total: dataRiwayat,
                            });
                        });
                        //  location.reload();
                    });

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            $scope.cetakPdf = function() {
                $scope.isRouteLoading = true;

                norec_Emr = $scope.dataSelected.norec;

                medifirstService.get("emr/get-temp-emricu?norecicufk=" + norec_Emr, true).then(function(dat) {
                    if (nomorEMR == '') return

                    var user = medifirstService.getPegawaiLogin();
                    var arrPush = []
                    for (var i = 712; i <= 779 - 1; i++) {
                        arrPush.push({ emrdfk: i.toString(), value: "" })
                    }
                    for (var i = 857; i <= 888 - 1; i++) {
                        arrPush.push({ emrdfk: i.toString(), value: "" })
                    }
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            for (var x = 0; x <= arrPush.length - 1; x++) {
                                if (arrPush[x].emrdfk == dataLoad[i].emrdfk) {
                                    arrPush[x].value = dataLoad[i].value
                                }
                            }
                        }


                    }
                    debugger;
                    var base64 = $scope.user.poto.substring(22);
                    // var base64 = "data:image/jpg;base64,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t2slDIkyyPvvvWdH/NIs3lRlKm14aAKXp1LzddM75NijkGGGzlRecOFxAb704ot2RFH8kWcbaDEuH6740I6s45qrrjJp3f/973/tiF/orXXayafYIyVMpQ0PE3GbLba0R/4RZeiwHLvoWOWVWABxW3Erigv26dM3GHn22fbILx+8/76Z288/95wdWcexQ4bWdHX7wvTWOqp+okOVqbThoX8HraDzAq0qLoqwHPsbS94wY2+9+aYd8c8Xn3cYnoUL1PAo/iHYn5fLafXPq83cvvfue+zIOsgqnTTxYnvknzzTyFuNShseisgoOMuLlStXmouCWgJh8dPPmDHfOlZh0KbjNdG2UhTf7LlHTyOAmxe406IForLY8qVIXQtkcxpl2FWZShuem2+8KdesNrShoquxRx5+2IxRy5MX7Lh4TRpiKYpvUC3IqzgaevfsuUHKNG5l5jzK1HkxccIEUxiubEilDU9e4oVhUAxAl02QLJzffvvNjvjn9ddeM6+pWW1KHlCwedH48fbIP7WUoWdMmx5s3mmT3BILgNRuyiSUDam04RF16jwLKaOttm+56eZcd13wxGOPm/dNp0RF8Q31LHnGVkhk6LvX3vaogyLcXmgi5hlDbiUqbXieevJJcwP+9NNP7Yh/cAOMHb3O312Ebtqc22437xvBREXxjen/dMGF9sg/tURwEeE95KCD7VE+YGx37NLVHilhKm148mgIFSUaaJ07Z07uRgD13jyTKpRqw+4DKZu8uPXmDi8CsjWCSW3OuTEbca1aBeNKxQ2PNF+jkj8v0IoKB1qL0E1DL27fvn3tkaL45eABA3ItpHxg/nxzTYXr5fI+BzhnxAjte1WHShueItKKcTtMuHBdoFV00/JMp8bXTTM4RcmDvHcb0gI7rF7Qp/deJs6TJ8cMGZKrFFYrUWnD89VXX5kJ+tijj9oR/+y8407BxRddZI/y102jwymquaSSK0oenDRsWDDo4IH2yD9vvvGmuabCRdnopuWhSh2GLqdnDj/dHilhKm14pMr5vnvutSP+2alrt2DSxZfYo/x105YuXZrr6ynKiDPPCvbr188e+WfJkiUbLOaMUOkp+QiVCtTwUMujbEilDc///M//mAlaryuoD0inDguCrtVNe/wJO+IXild5vZ9++smOKIpfzh83Lui52+72yD+vvfqqmeNhaaq83X3U5ZHg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"

                    var namapasien = $scope.cc.namapasien
                    var noregistrasi = $scope.cc.noregistrasi
                    var umur = $scope.cc.umur
                    var sex = $scope.cc.jeniskelamin
                    var jaminan = $scope.cc.kelompokpasien
                    var kelas = $scope.cc.namakelas
                    var nocm = $scope.cc.nocm
                    var golongandarah = $scope.cc.golongandarah
                    var tglAwal = '';
                    var tglAkhir = '';
                    var jenisPasien = "";

                    var data = {
                        "gambarLogo": "logo_rs.jpg",
                        "paramKey": ["namaRS", "alamatRS", "norecemricu", "dataLoad", "namapasien", "noregistrasi", "umur", "sex", "jaminan", "kelas", "nocm", "golongandarah", "test"],
                        "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", norec_Emr, arrPush,
                            namapasien, noregistrasi, umur, sex, jaminan, kelas, nocm, golongandarah, base64
                        ],
                        "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                    };

                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
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
                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/report2.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:1002/generic/report/report2.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:1002/generic/report/report2.pdf');
                    } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
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
                    $scope.isRouteLoading = false;
                });

            }

            $scope.simpanmasalah = function() {
                norec_Emr = $scope.dataSelected.norec;
                var objSave = {
                    "norecemricufk": norec_Emr,
                    "jam": $scope.item.jam,
                    "masalah": $scope.item.masalah,
                    "intruksi": $scope.item.intruksi,
                    "paraf": $scope.item.dokter.namalengkap,
                    "kelompok": "-",
                    "jenis": "m1"
                }
                medifirstService.post('emr/save-masalah', objSave).then(function(e) {
                    norec_Emr = $scope.dataSelected.norec;
                    $scope.item.jam = "";
                    $scope.item.masalah = "";
                    $scope.item.intruksi = "";
                    $scope.item.dokter = "";
                    $scope.popupEtiket.close();
                    medifirstService.get("emr/get-masalah?jenis=penunjang&norecemricufk=" + norec_Emr, true).then(function(dat) {
                        $scope.dataGridobat = dat.data.data;
                        $scope.dataGridperawat = dat.data.data1;
                        $scope.dataGridperawat2 = dat.data.data2;
                        $scope.dataGridperawat3 = dat.data.data3;

                        $scope.p1 = dat.data.datax[0].paraf;
                        $scope.p2 = dat.data.datax2[0].paraf;
                        $scope.p3 = dat.data.datax3[0].paraf;
                    });
                })
            }
            $scope.simpanmasalah2 = function() {
                norec_Emr = $scope.dataSelected.norec;

                var objSave = {
                    "norecemricufk": norec_Emr,
                    "norechead": norechead,
                    "jam": $scope.item.jam2,
                    "masalah": $scope.item.masalah2,
                    "paraf": $scope.item.dokter2.namalengkap,
                    "kelompok": $scope.item.kelompok.id,
                    "jenis": "m2"
                }
                medifirstService.post('emr/save-masalah', objSave).then(function(e) {
                    norec_Emr = $scope.dataSelected.norec;
                    $scope.item.kelompok = "";
                    $scope.item.dokter2 = "";
                    $scope.item.jam2 = "";
                    $scope.item.masalah2 = "";
                    $scope.popupEtiket2.close();
                    medifirstService.get("emr/get-masalah?jenis=penunjang&norecemricufk=" + norec_Emr, true).then(function(dat) {
                        $scope.dataGridobat = dat.data.data;
                        $scope.dataGridperawat = dat.data.data1;
                        $scope.dataGridperawat2 = dat.data.data2;
                        $scope.dataGridperawat3 = dat.data.data3;

                        $scope.p1 = dat.data.datax[0].paraf;
                        $scope.p2 = dat.data.datax2[0].paraf;
                        $scope.p3 = dat.data.datax3[0].paraf;
                    });
                })
            }

            $scope.simpansoap = function() {
                if (nomorEMR == null) {
                    alert("Simpan Data Pengkajian Dulu!")
                    return;
                }
                norec_Emr = $scope.dataSelected.norec;

                var objSave = {
                    "norecemricufk": norec_Emr,
                    "norec": tempnorecsoap,
                    "S": $scope.item.S,
                    "O": $scope.item.O,
                    "A": $scope.item.A,
                    "P": $scope.item.P,
                    "noemr": nomorEMR,
                    "kelompok": $scope.item.kelompok3.id,

                }
                medifirstService.post('emr/save-soap', objSave).then(function(e) {
                    norec_Emr = $scope.dataSelected.norec;
                    $scope.item.kelompok3 = "";
                    $scope.item.S = "";
                    $scope.item.O = "";
                    $scope.item.A = "";
                    $scope.item.p = "";
                    $scope.popupEtiket3.close();
                    medifirstService.get("emr/get-soapicu?&norecemricufk=" + norec_Emr + "&noemr=" + nomorEMR, true).then(function(dat) {
                        $scope.dataGridsoap = dat.data.data;
                        $scope.dataGridsoap2 = dat.data.data2;
                        $scope.dataGridsoap3 = dat.data.data3;

                    });
                })
            }
            $scope.munculetiket = function() {

                medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.cc.noregistrasi + "&ruanganfk=481", true).then(function(dat) {
                    $scope.dataGrid = dat.data;
                    medifirstService.get("emr/get-masalah?jenis=obat&noReg=" + $scope.cc.noregistrasi, true).then(function(dat) {
                        $scope.isRouteLoading = false;

                        for (var i = 0; i < $scope.dataGrid.length; i++) {
                            for (var x = 0; x < dat.data.data.length; x++) {
                                const element = $scope.dataGrid[i];
                                if (element.norecpp == dat.data.data[x].norecpp) {
                                    element.x = true
                                }


                            }
                        }

                        $scope.dataPopUpetiket = $scope.dataGrid;
                    });
                });

                $scope.popupEtiket.center().open();

            }
            $scope.tataobat = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="munculetiket()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Obat Atau Cairan</button>'
                }, ],
                selectable: "row",
                pageable: true,
                scrollable: true,
                // editable:"popup",
                editable: "incell",
                //tanda
                columns: [
                    // { field: "jam", title: "jam", width: 150 ,editor: $scope.dropDownJam,
                    // template: "<span class='style-left'>{{formatTanggal('#: waktuintruksi #')}}</span>"},
                    { field: "jam", title: "JAM", width: 150 },
                    { field: "masalah", title: "Masalah", width: 150 },
                    { field: "intruksi", title: "Intruksi", width: 150 },
                    { field: "paraf", title: "paraf", width: 150 },
                    // { field: "paraf", title: "TTD Dokter", width: 100  ,editor: $scope.dropDownPegawai,template: "#=ttddokter.text#"},
                    // { field: "waktupemberian", title: "Waktu Pemberian", width: 150  ,editor: $scope.dropDownJam,
                    // template: "<span class='style-left'>{{formatTanggal('#: waktupemberian #')}}</span>"},
                    // { field: "ttdperawat", title: "TTD Perawat", width: 100 ,editor: $scope.dropDownPegawai,template: "#=ttdperawat.text#"},
                    // { field: "status",title: ".",width: "90px",template: "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\" > Simpan </button> "},

                ],

            };

            $scope.tataperawat = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="munculetiket()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Obat Atau Cairan</button>'
                // },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                editable: "incell",
                //tanda
                columns: [
                    { field: "jam", title: "JAM", width: 50 },
                    { field: "masalah", title: "Masalah", width: 150 },
                    // { field: "paraf", title: "perawat", width: 150 },
                    // { field: "paraf", title: "paraf", width: 150 },
                ],

            };

            $scope.tatasoap = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="munculetiket()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Obat Atau Cairan</button>'
                // },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                editable: "incell",
                //tanda
                columns: [
                    { field: "S", title: "S", width: 50 },
                    { field: "O", title: "O", width: 50 },
                    { field: "A", title: "A", width: 50 },
                    { field: "P", title: "P", width: 50 },
                ],

            };


            $scope.$watch('item.kelompok', function(e) {
                // 
                if (e === undefined) return;

                medifirstService.get("emr/get-masalahhead?norecemricufk=" + norec_Emr + "&kelompok=" + e.id, true).then(function(dat) {

                    if (dat.data.data.length > 0) {

                        norechead = dat.data.data[0].norec;
                        // $scope.item.dokter2.namalengkap = dat.data.data[0].paraf;
                        $scope.item.dokter2 = { id: dat.data.data[0].id, namalengkap: dat.data.data[0].paraf }
                    } else {
                        norechead = "";
                    }
                });

            })
            $scope.$watch('item.kelompok3', function(e) {
                // 
                if (e === undefined) return;

                medifirstService.get("emr/get-soapkelompok?norecemricufk=" + norec_Emr + "&kelompok=" + e.id + "&noemr=" + nomorEMR, true).then(function(dat) {

                    if (dat.data.data.length > 0) {

                        $scope.item.S = dat.data.data[0].S;
                        $scope.item.O = dat.data.data[0].O;
                        $scope.item.A = dat.data.data[0].A;
                        $scope.item.P = dat.data.data[0].P;
                        tempnorecsoap = dat.data.data[0].norec
                            // $scope.item.dokter2.namalengkap = dat.data.data[0].paraf;
                            // $scope.item.dokter2  = { id:dat.data.data[0].id , namalengkap: dat.data.data[0].paraf }
                    } else {
                        tempnorecsoap = '';

                    }
                });

            })


        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1