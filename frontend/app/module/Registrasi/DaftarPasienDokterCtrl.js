define(['initialize', 'Configuration'], function(initialize, config) {
    'use strict';
    initialize.controller('DaftarPasienDokterCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function(medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataPasienSelected = {};
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.istempatLaporan = true;
            $scope.itemD = {};
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
            $scope.isRouteLoading = false;

            var user = medifirstService.getMapLoginUserToRuangan();
            LoadData();

            $scope.CariPasien = function() {
                $scope.isRouteLoading = true;
                LoadData()
            }

            function LoadData() {
                if ($scope.item.noRm == undefined) {
                    var rm = ""
                    var tempRM = ""
                } else {
                    var rm = "&noRm=" + $scope.item.noRm
                    var tempRM = $scope.item.noRm
                }
                if ($scope.item.nama == undefined) {
                    var nm = ""
                } else {
                    var nm = "namaPasien=" + $scope.item.nama
                }
                var idPegawai = "&idPegawai=" + "";

                $scope.isRouteLoading = true;

                medifirstService.get("registrasi/daftar-registrasi/get-daftar-pasien-rawat?" +
                    nm + rm + idPegawai).then(function(data) {
                    var data = data.data
                    for (var i = 0; i < data.data.length; i++) {
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(data.data[i].tgllahir);
                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                        data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'

                    }
                    $scope.isRouteLoading = true;
                    $scope.dataPasienRawat = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 10,
                        total: data.data.length,
                        serverPaging: false,

                    });
                })
            }
            medifirstService.get("bridging/inacbg/get-combo", false).then(function(data) {
                $scope.listDepartemen = data.data.departemen;
                $scope.listKelompokPasien = data.data.kelompokpasien;
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

            $scope.formatTanggal = function(tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function(value, currency) {
                    return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                }
                // $("#kGrid").kendoGrid({
            $scope.columnPasienRawat = {
                    scrollable: true,
                    selectable: false,
                    pageable: true,
                    columns: [{
                            // "field": "tglregistrasi",
                            "title": " ",
                            "width": "130px",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"klikaku(dataItem)\" style=\"margin:0 0 5px\">Klik Aku</button>",
                        },
                        {
                            // "field": "tglregistrasi",
                            "title": "EMR",
                            "width": "130px",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"rekamMedisElektronik(dataItem)\" style=\"margin:0 0 5px\">EMR</button>",
                        },
                        {
                            "field": "tglregistrasi",
                            "title": "Tgl Registrasi",
                            "width": "130px",
                            "template": "<span class='style-left'>#: tglregistrasi #</span>"
                        },

                        {
                            "field": "tglpulang",
                            "title": "Tgl Pulang",
                            "width": "100px",
                            attributes: {
                                class: "#=tglpulang == 'Masih Dirawat' ? 'ijo' : 'green' #"
                            },
                        },

                        {
                            "field": "nocm",
                            "title": "No RM",
                            "width": "80px",
                            "template": "<span class='style-center'>#: nocm #</span>"
                        },
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "100px",
                            "template": "<span class='style-center'>#: noregistrasi #</span>"
                                // "template": "<button class=\"k-button custom-button\" ng-click=\"noregistrasi(dataItem)\" style=\"margin:0 0 5px\">#: noregistrasi #</button>",
                        },
                        {
                            "field": "namapasien",
                            "title": "Nama Pasien",
                            "width": "200px",
                            "template": "<span class='style-left'>#: namapasien #</span>"
                        },
                        {
                            "field": "alamatlengkap",
                            "title": "Alamat",
                            "width": "150px",
                            "template": "<span class='style-center'>#: alamatlengkap #</span>"
                        },
                        {
                            "field": "umur",
                            "title": "Umur",
                            "width": "150px",
                            "template": "<span class='style-left'>#: umur #</span>"
                        },
                        {
                            "field": "namadokter",
                            "title": "Dokter",
                            "width": "150px",
                            // "template": "<span class='style-left'>#: namadokter #</span>"
                            "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                        },
                        {
                            "field": "isdiagnosis",
                            "title": "Diagnosa",
                            "width": "150px",
                            // "template": "<span class='style-left'>#: isdiagnosis #</span>"
                            "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
                        },
                        {
                            "field": "jeniskelamin",
                            "title": "JK",
                            "width": "80px",
                            "template": "<span class='style-left'>#: jeniskelamin #</span>"
                        },
                        {
                            "field": "namaruangan",
                            "title": "Ruangan",
                            "width": "150px",
                            "template": "<span class='style-left'>#: namaruangan #</span>"
                        },
                        {
                            "field": "namaruanganasal",
                            "title": "Ruangan Asal",
                            "width": "150px",
                            "template": "<span class='style-left'>#: namaruanganasal #</span>"
                        },
                        {
                            "field": "namakamar",
                            "title": "Kamar",
                            "width": "100px",
                            "template": '# if( namakamar==null) {# - # } else {# #= namakamar # #} #'
                        },
                        {
                            "field": "namabed",
                            "title": "Bed",
                            "width": "80px",
                            "template": '# if( namabed==null) {# - # } else {# #= namabed # #} #'
                        },
                        {
                            "field": "namakelas",
                            "title": "Kelas",
                            "width": "80px",
                            "template": "<span class='style-left'>#:  namakelas #</span>"
                        },
                        {
                            "field": "kelompokpasien",
                            "title": "Tipe Pembayaran",
                            "width": "150px",
                            "template": "<span class='style-center'>#: kelompokpasien #</span>"
                        },
                        {
                            "field": "namarekanan",
                            "title": "Rekanan",
                            "width": "150px",
                            "template": "<span class='style-center'>#: namarekanan #</span>"
                        },
                        {
                            "field": "nobpjs",
                            "title": "No BPJS",
                            "width": "150px",
                            "template": "<span class='style-center'>#: nobpjs #</span>"
                        }
                    ]
                }
                // });
                // $scope.click = function (dataPasienSelected) {
                // 	debugger;
                // 	if (dataPasienSelected == undefined) {
                // 		$scope.nocm = dataPasienSelected.nocm;
                // 		$scope.idPasien = dataPasienSelected.nocmfk;
                // 		$scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                // 		$scope.dataPasienSelected = dataPasienSelected;
                // 	}
                // }

            $scope.rekamMedisElektronik = function(dataItem) {

                if (dataItem == undefined) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi=" +
                    dataItem.noregistrasi +
                    "&objectruanganlastfk=" + dataItem.objectruanganlastfk
                ).then(function(data) {




                    // debugger;
                    var arrStr = {
                        0: dataItem.nocm,
                        1: dataItem.namapasien,
                        2: dataItem.jeniskelamin,
                        3: dataItem.noregistrasi,
                        4: dataItem.umur,
                        5: dataItem.kelompokpasien,
                        6: dataItem.tglregistrasi,
                        7: data.data.ruangan[0].norec_apd,
                        8: dataItem.norec,
                        9: dataItem.objectkelasfk,
                        10: dataItem.namakelas,
                        11: dataItem.objectruanganlastfk,
                        12: dataItem.namaruangan + '`'
                    }
                    cacheHelper.set('cacheRMelektronik', arrStr);
                    $state.go('RekamMedis.HistoryEMR', {
                        noRec: data.data.ruangan[0].norec_apd
                    })
                })
            }

            $scope.klikaku = function(dataItem) {
                debugger
                // $scope.anjaybisa = dataItem
                medifirstService.get('registrasi/daftar-registrasi/get-daftar-pasien-rawat-dua?norec=' + dataItem.norec_pd).then(function(dat) {
                    debugger;
                    $scope.anjaybisa = dat.data.data[0]
                    $scope.popUpGrid.center().open()
                })


            }
            $scope.closeGrid = function() {
                $scope.popUpGrid.close()
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
            $scope.hasillab = function() {
                debugger;
                if ($scope.anjaybisa.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }
                medifirstService.get("registrasi/get-status-close/" + $scope.anjaybisa.noregistrasi, false).then(function(rese) {

                    var ruangan = "";
                    medifirstService.get("registrasi/daftar-registrasi/get-hasil-lab-rawat?noregistrasi=" +
                        $scope.anjaybisa.noregistrasi +
                        "&objectruanganlastfk=" + ruangan
                    ).then(function(dat) {
                        debugger;
                        if (dat.data.ruangan.length == 0) {
                            toastr.info("Pasien ini tidak memiliki riwayat laboratorium", "Info !")
                            return
                        }
                        $scope.listRuanganApd = dat.data.ruangan;
                        $scope.item.ruanganAntrian = {
                            id: $scope.listRuanganApd[0].id,
                            namaruangan: $scope.listRuanganApd[0].namaruangan,
                            norec_apd: $scope.listRuanganApd[0].norec_apd,
                            objectdepartemenfk: $scope.listRuanganApd[0].objectdepartemenfk
                        }
                        debugger;
                        $scope.isLoading = true;
                    })
                    $scope.popUpShow.center().open();
                });

            }
            $scope.detailreg = function() {
                if ($scope.anjaybisa.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien Dulu !', 'Info')
                    return;
                }
                medifirstService.get("tatarekening/get-detail_apd?noregistrasi=" +
                    $scope.anjaybisa.noregistrasi
                ).then(function(data) {
                    debugger;
                    $scope.item.noregistrasi = data.data[0].noRegistrasi
                    $scope.item.nocm = data.data[0].noCm
                    $scope.item.namapasien = data.data[0].namaPasien
                    $scope.item.jeniskelamin = data.data[0].jenisKelamin
                    $scope.item.tglmasuk = data.data[0].tglMasuk
                    $scope.item.tglpulang = data.data[0].tglPulang
                    $scope.item.ruanganterakhir = data.data[0].lastRuangan
                    $scope.item.kelas = data.data[0].kelasRawat
                    $scope.item.status = data.data[0].StatusPasien
                    $scope.item.kelompokpasien = data.data[0].jenisPasien
                    $scope.item.penjamin = data.data[0].namaPenjamin
                    $scope.isLoading = true;
                })
                medifirstService.get("tatarekening/get-detail-pasien?noregistrasi=" +
                    $scope.anjaybisa.noregistrasi
                ).then(function(dat) {
                    $scope.dataDetailReg = dat.data
                })
                $scope.popUpDetailReg.center().open();
            };
            $scope.popUpDetailReg = function() {
                // debugger;



            }
            $scope.closeDetailReg = function() {
                $scope.popUpDetailReg.close();
            }

            $scope.columnDetailReg = {
                selectable: 'row',
                pageable: true,
                columns: [{
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
                    }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
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
            $scope.closeShow = function() {
                $scope.popUpShow.close();
            }
            $scope.closeDetailLab = function() {
                $scope.popUpDetailLab.close();
            }
            $scope.hasilLab = function(dataItem) {
                debugger;
                $scope.isLoading = true;


                // var noregistrasi = ''
                // noregistrasi = dataItem.norec_apd

                if (dataItem.ruid === '575') {
                    medifirstService.get('registrasi/daftar-registrasi/get-pd-from-apd?' + '&norec_pd=' + dataItem.norec_pd + '&ruid=' + dataItem.ruid).then(function(dat) {
                        debugger;
                        for (var b = 0; b < dat.data.ruangan.length; b++) {



                            medifirstService.get("radiologi/get-rincian-pelayanan-lab-inacbg?noregistrasifk=" + dat.data.ruangan[b].norec_apd
                                // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                                , true).then(function(dat) {
                                    debugger;
                                    if (dat.data.data.length > 0) {
                                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                                    }
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

                                        for (var j = 0; j < dat.data.data[i].pp.data.length; j++) {
                                            debugger;
                                            if (dat.data.data[i].pp.data[j].hasil) {
                                                // dat.data.data[i].flag = dat.data.data[i].pp.data[j].flag
                                                let HasilInput = dat.data.data[i].pp.data[j].hasil
                                                if (dat.data.data[i].flag != "Y") {
                                                    if (HasilInput.indexOf("+/") >= 0) {
                                                        let hssl = "positif"
                                                        let nilaistring = dat.data.data[i].pp.data[j].nilaitext
                                                        nilaistring = nilaistring.toUpperCase();
                                                        hssl = hssl.toUpperCase();
                                                        if (hssl == nilaistring) {
                                                            dat.data.data[i].flag = "N"
                                                        } else {
                                                            dat.data.data[i].flag = "Y"
                                                        }
                                                    } else if (HasilInput.indexOf("-/") >= 0) {
                                                        let hssl = "negatif"
                                                        let nilaistring = dat.data.data[i].pp.data[j].nilaitext
                                                        nilaistring = nilaistring.toUpperCase();
                                                        hssl = hssl.toUpperCase();
                                                        if (hssl == nilaistring) {
                                                            dat.data.data[i].flag = "N"
                                                        } else {
                                                            dat.data.data[i].flag = "Y"
                                                        }
                                                    } else if (HasilInput.indexOf("<") >= 0) {
                                                        let a = parseFloat(dat.data.data[i].pp.data[j].nilaimin)
                                                        let b = parseFloat(dat.data.data[i].pp.data[j].nilaimax)
                                                        let hsslARr = HasilInput.split("<");
                                                        let hssl = parseFloat(hsslARr[1])

                                                        if (hssl >= a && hssl <= b) {
                                                            dat.data.data[i].flag = "N"
                                                        } else {
                                                            dat.data.data[i].flag = "Y"
                                                        }
                                                    } else if (HasilInput.indexOf(">") >= 0) {
                                                        let a = parseFloat(dat.data.data[i].pp.data[j].nilaimin)
                                                        let b = parseFloat(dat.data.data[i].pp.data[j].nilaimax)
                                                        let hsslARr = HasilInput.split(">");
                                                        let hssl = parseFloat(hsslARr[1])

                                                        if (hssl >= a && hssl <= b) {
                                                            dat.data.data[i].flag = "N"
                                                        } else {
                                                            dat.data.data[i].flag = "Y"
                                                        }
                                                    } else if (HasilInput.indexOf("-") >= 0) {
                                                        let a = parseFloat(dat.data.data[i].pp.data[j].nilaimin)
                                                        let b = parseFloat(dat.data.data[i].pp.data[j].nilaimax)
                                                        let hsslARr = HasilInput.split("-");
                                                        let hssl0 = parseFloat(hsslARr[0])
                                                        let hssl = parseFloat(hsslARr[1])

                                                        if (hssl0 >= a && hssl <= b) {
                                                            dat.data.data[i].flag = "N"
                                                        } else {
                                                            dat.data.data[i].flag = "Y"
                                                        }
                                                    } else if (dat.data.data[i].pp.data[j].nilaimin == null) {
                                                        let hssl = dat.data.data[i].pp.data[j].hasil
                                                        let nilaistring = dat.data.data[i].pp.data[j].nilaitext
                                                        nilaistring = nilaistring.toUpperCase();
                                                        hssl = hssl.toUpperCase();

                                                        dat.data.data[i].flag = "N"

                                                    } else if (dat.data.data[i].pp.data[j].nilaimin == "") {
                                                        let hssl = dat.data.data[i].pp.data[j].hasil
                                                        let nilaistring = dat.data.data[i].pp.data[j].nilaitext
                                                        nilaistring = nilaistring.toUpperCase();
                                                        hssl = hssl.toUpperCase();

                                                        dat.data.data[i].flag = "N"

                                                    } else {
                                                        if (dat.data.data[i].pp.data[j].nilaimin != null) {
                                                            if (dat.data.data[i].pp.data[j].tipedata == 2) {
                                                                let a = (dat.data.data[i].pp.data[j].nilaimin).toUpperCase()
                                                                let b = (dat.data.data[i].pp.data[j].nilaimax).toUpperCase()
                                                                let hssl = ((dat.data.data[i].pp.data[j].hasil).trim()).toUpperCase()
                                                                if (hssl >= a && hssl <= b) {
                                                                    dat.data.data[i].flag = "N"
                                                                } else {
                                                                    dat.data.data[i].flag = "Y"
                                                                }
                                                            } else {
                                                                let a = parseFloat(dat.data.data[i].pp.data[j].nilaimin)
                                                                let b = parseFloat(dat.data.data[i].pp.data[j].nilaimax)
                                                                let hssl = parseFloat(dat.data.data[i].pp.data[j].hasil)
                                                                if (hssl >= a && hssl <= b) {
                                                                    dat.data.data[i].flag = "N"
                                                                } else {
                                                                    dat.data.data[i].flag = "Y"
                                                                }
                                                            }

                                                        } else {
                                                            let hssl = (dat.data.data[i].pp.data[j].hasil).trim()
                                                            let nilaistring = dat.data.data[i].pp.data[j].nilaitext
                                                            nilaistring = nilaistring.toUpperCase();
                                                            hssl = hssl.toUpperCase();
                                                            if (hssl == nilaistring) {
                                                                dat.data.data[i].flag = "N"
                                                            } else {
                                                                dat.data.data[i].flag = "Y"
                                                            }
                                                        }
                                                    }

                                                }
                                            } else if (dat.data.data[i].pp.data[j].hasil_s || dat.data.data[i].pp.data[j].hasil_i) {
                                                dat.data.data[i].flag = "N"
                                            }
                                            // dat.data.data[i].flag = dat.data.data[i].pp.data[0].flag
                                        }
                                    }
                                    if (dat.data.data.length > 0) {
                                        if (dat.data.data[0].objectdepartemenfk == 3)
                                            $scope.disableRad = true
                                        if (dat.data.data[0].objectdepartemenfk == 27)
                                            $scope.disableLab = true
                                    }
                                    $scope.isLoading = false;

                                    $scope.dataGrid = {
                                        data: dat.data.data,
                                        _data: dat.data.data,
                                        // pageSize: 10,
                                        selectable: true,
                                        refresh: true,
                                        total: dat.data.data.length,
                                        serverPaging: false,
                                        aggregate: [
                                            { field: 'total', aggregate: 'sum' },
                                        ]
                                    };

                                    $scope.popUpPelayanan.center().open();

                                },
                                function(error) {
                                    $scope.isLoading = false;
                                });
                        }
                    })
                }
                // loadEditor()
                debugger;
                if (dataItem.ruid === '576') {
                    medifirstService.get('registrasi/daftar-registrasi/get-pd-from-apd?' + '&norec_pd=' + dataItem.norec_pd + '&ruid=' + dataItem.ruid).then(function(dat) {
                        debugger;
                        for (var a = 0; a < dat.data.ruangan.length; a++) {



                            debugger;
                            $scope.isLoading = true;

                            // medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                            // 	$scope.listruangan = dat.data.ruangan;
                            // 	// $scope.listLayanan = dat.data.produk;
                            // 	$scope.listDokter = dat.data.dokter;
                            // })
                            // if (norec_apd != null) {

                            medifirstService.get("radiologi/get-rincian-pelayanan-rad?noregistrasifk=" + dat.data.ruangan[a].norec_apd
                                // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                                , true).then(function(dat) {
                                    debugger
                                    if (dat.data.data.length > 0) {
                                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                                    }
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


                                    $scope.dataGridRadio = {
                                        data: dat.data.data,
                                        _data: dat.data.data,
                                        // pageSize: 10,
                                        selectable: true,
                                        refresh: true,
                                        total: dat.data.data.length,
                                        serverPaging: false,
                                        aggregate: [
                                            { field: 'total', aggregate: 'sum' },
                                        ]

                                    };

                                    // $scope.popUpPelayananRadio.center().open();

                                },
                                function(error) {
                                    $scope.isLoading = false;
                                });
                        }
                    })
                }
                $scope.popUpPelayananRadio.center().open();
            }
            $scope.columnGrid = {
                columns: [{
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: "30px"
                    },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        },
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
            $scope.closeShowPel = function() {
                $scope.popUpPelayanan.close();
            }
            $scope.closeShowRad = function() {
                $scope.popUpPelayananRadio.close();
            }
            $scope.detailHasilLab = function(dataItem) {
                debugger;
                $scope.resultGridsHasilLab = new kendo.data.DataSource({
                    data: []
                })

                $scope.isRouteLoading = true
                debugger;
                var norec_pp = ''
                    // norec_pp = dataItem.norec_pp;
                norec_pp = "'" + dataItem.norec_pp + "'"
                medifirstService.get("laboratorium/get-hasil-lab-manual?norec_apd=" + dataItem.norec_apd +
                    '&objectjeniskelaminfk=' + dataItem.objectjeniskelaminfk + '&umur=' + dataItem.umur + '&norec=' + norec_pp + '&tgl=' + Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'))).then(function(data) {
                    // var sourceGrid = []
                    $scope.isRouteLoading = false;
                    if (data.statResponse == true && data.data.data.length > 0) {
                        // sourceGrid = data.data.data
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
                            change: function(e) {
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
                excelExport: function(e) {

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
            $scope.hasilrad = function() {
                debugger;
                if ($scope.anjaybisa.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien Dulu', 'Info')
                    return
                }
                medifirstService.get("registrasi/get-status-close/" + $scope.anjaybisa.noregistrasi, false).then(function(rese) {

                    var ruangan = "";
                    medifirstService.get("registrasi/daftar-registrasi/get-hasil-rad-rawat?noregistrasi=" +
                        $scope.anjaybisa.noregistrasi
                    ).then(function(dat) {
                        debugger;
                        if (dat.data.ruangan.length == 0) {
                            toastr.info("Pasien ini tidak memiliki riwayat radiologi", "Info !")
                            return;
                        }
                        $scope.listRuanganApd = dat.data.ruangan;
                        $scope.item.ruanganAntrian = {
                            id: $scope.listRuanganApd[0].id,
                            namaruangan: $scope.listRuanganApd[0].namaruangan,
                            norec_apd: $scope.listRuanganApd[0].norec_apd,
                            objectdepartemenfk: $scope.listRuanganApd[0].objectdepartemenfk
                        }
                        debugger;
                        $scope.isLoading = true;
                    })
                    $scope.popUpShow.center().open();
                });
            }
            $scope.columnGridRadio = {
                columns: [{
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: "30px",
                        attributes: {
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
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
            $scope.LihatEkpertise = function() {
                debugger;
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Data Dulu!");
                    return;
                }
                $scope.hideExper = false
                $scope.norecHasilRadiologi = ''
                $scope.item.namaPelayanan = $scope.dataSelected.namaproduk
                    // $scope.item.dokters = $scope.dataSelected.dokter
                if ($scope.dataSelected.iddokterpengirim != undefined && $scope.dataSelected.iddokterpengirim != "" && $scope.dataSelected.iddokterpengirim != 0) {
                    $scope.item.dokterperujuk = { id: $scope.dataSelected.iddokterpengirim, namalengkap: $scope.dataSelected.dokterpengirim }
                }
                // $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                $scope.item.dokter = { id: $scope.dataSelected.dokterid, namalengkap: $scope.dataSelected.dokter }
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + $scope.dataSelected.norec_pp + '&idproduk=' + $scope.dataSelected.produkfk).then(function(e) {
                    if (e.data.length > 0) {
                        debugger;
                        // if(e.data[0].keterangan == undefined || e.data[0].keterangan == null || e.data[0].keterangan == '')
                        // {
                        //     medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
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

                        // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                        //     if (res.data.data.length == 0) 
                        //         var objSave = {
                        //             id :"",
                        //             produkfk: $scope.dataSelected.produkfk,
                        //             keterangan: e.data[0].keterangan,
                        //             objectpegawaifk: $scope.dataSelected.dokterid,
                        //             "method": 'save'
                        //         }   
                        //         // medifirstService.post('sysadmin/general/save-template-hasil', objSave).then(function (e) { 
                        //         // }, function (error) {
                        //         //     $scope.hideExper = false
                        //         // })
                        //     })
                        $scope.norecHasilRadiologi = e.data[0].norec
                        $scope.item.nofoto = e.data[0].nofoto
                        $scope.item.tglInput = new Date(e.data[0].tanggal)
                        $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                        $scope.item.keterangan = e.data[0].keterangan; //.replace(/~/g, "\n")

                        $scope.item.dokterperujuk = { id: e.data[0].dokterperujuk, namalengkap: e.data[0].namadokterperujuk }
                        $scope.item.ruanganperujuk = e.data[0].namaruangan
                            // }
                    } else {
                        // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                        //     if (res.data.data.length > 0) 
                        //              $scope.item.keterangan = res.data.data[0].keterangan;//.replace(/~/g, "\n")
                        //              $scope.item.tglInput = new Date()
                        //              $scope.item.dokter = { id:  $scope.dataSelected.dokterid, namalengkap:  $scope.dataSelected.dokter}
                        //     })
                    }

                    $scope.popUpEkpertise.center().open();

                })

                // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                //         if (res.data.data.length > 0) 
                //                  $scope.item.keterangan = e.data[0].keterangan;//.replace(/~/g, "\n")
                //                  $scope.popUpEkpertise.center().open();
                //         })




            }
            $scope.closeShowEks = function() {
                $scope.popUpEkpertise.close();
            }

            $scope.riwayatreg = function() {
                debugger;
                if ($scope.anjaybisa == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.anjaybisa.nocm;
                $scope.itemD.namaPasien = $scope.anjaybisa.namapasien;
                $scope.itemD.tglLahir = $scope.anjaybisa.tgllahir
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
            }
            $scope.TutupPopUp = function() {
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpRiwayatRegistrasi.close();
            }

            function loadDataRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemD.noRM != undefined) {
                    rm = "&norm=" + $scope.itemD.noRM
                }

                var pasien = ""
                if ($scope.itemD.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemD.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemD.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemD.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                        tglLahirs + rm + noReg + pasien)
                    .then(function(data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                } else {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            }
                        }
                        dRiwayatReg.sort((d1, d2) => new Date(d2.tglregistrasi).getTime() - new Date(d1.tglregistrasi).getTime());
                        for (var x = 0; x < dRiwayatReg.length; x++) {
                            dRiwayatReg[x].newno = x + 1
                        }

                        $scope.itemD.JumlahRawat = jumlahRawat;
                        $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });
            }
            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatRegistrasi.xlsx",
                    allPages: true,
                },
                excelExport: function(e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
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
                pageable: true,
                columns: [{
                        "field": "newno",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruanganan Layanan Asal",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruanganasal #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Kelompok Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namarekanan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                            // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "statuspulang",
                        "title": "Status Pulang",
                        "width": "100px"
                            // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "isdiagnosis",
                        "title": "Diagnosis",
                        "width": "300px",
                        "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
                    },
                    {
                        "field": "kesatuanpasien",
                        "title": "Kesatuan Pasien",
                        "width": "100px",
                        "template": '# if( kesatuanpasien==false) {# - # } else {# #= kesatuanpasien # #} #'
                    },
                ]
            };
            $scope.cetakShowEks = function() {
                debugger
                var tgltindakanwaktu = moment($scope.dataSelected.tglpelayanan).format('YYYY-MM-DD');
                tgltindakanwaktu = tgltindakanwaktu + ' 14:00:00';
                var tglInput = moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm:ss');
                var tglInputCetak = moment($scope.item.tglInputCetak).format('YYYY-MM-DD HH:mm:ss');
                var tglMasuk = moment($scope.item.tglmasuk).format('YYYY-MM-DD HH:mm:ss');
                var tglKeluar = moment($scope.item.tglkeluar).format('YYYY-MM-DD HH:mm:ss');
                var tgltindakanwaktuSec = Date.parse(tgltindakanwaktu) / 1000;
                var tglMasukSec = Date.parse(tglMasuk) / 1000;
                var tglKeluarSec = Date.parse(tglKeluar) / 1000;
                var tglInputSec = Date.parse(tglInput) / 1000;
                var tglInputCetakSec = Date.parse(tglInputCetak) / 1000;
                if ($scope.item.objectdepartemenfk == '18' && $scope.item.ruanganperujuk.id != '569') {
                    if (tgltindakanwaktuSec < tglInputSec || tgltindakanwaktuSec < tglInputCetakSec) {
                        alert("Tanggal Transaksi dan Tanggal Cetak Tidak Boleh Melebihi Waktu " + tgltindakanwaktu)
                        return
                    }
                }
                if ($scope.item.objectdepartemenfk == '16' || $scope.item.ruanganperujuk.id == '569') {
                    if (tglMasukSec != tglKeluarSec) {
                        if (tglInputCetakSec < tglMasukSec || tglInputCetakSec > tglKeluarSec || tglInputSec < tglMasukSec || tglInputSec > tglKeluarSec) {
                            alert("Tanggal Transaksi dan Tanggal Cetak Harus diAntara Waktu " + tglMasuk + " Sampai Dengan " + tglKeluar + ".")
                            return
                        }
                    }
                }
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
            $scope.CetakLabKlinikLangsung = function(dataItem) {
                debugger;
                $scope.anjaybisa
                var user = medifirstService.getPegawaiLogin();

                // debugger;
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

                    // debugger
                    // var a = dataItem
                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    var catatan = "-";
                    debugger;
                    var jeniskelaminfk = dataItem.objectjeniskelaminfk
                        // if ($scope.item.catatan != undefined) {
                        // 	catatan = $scope.item.catatan;
                        // }
                    debugger;
                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.anjaybisa.noregistrasi
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "dokterPeriksa", "catatan"],
                        "paramValue": ["", "RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177", user.namaLengkap,
                            x, umurDay, jeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('10.8.8.8') > -1) {
                        xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:8797/generic/report/hasillabKlinik.pdf');
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
                //        LoadData()
                //    });
            }
        }
    ]);
});