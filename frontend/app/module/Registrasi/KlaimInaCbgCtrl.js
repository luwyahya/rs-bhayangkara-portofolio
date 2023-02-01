// const { forEach } = require("underscore");

define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('KlaimInaCbgCtrl', ['$state', '$q', '$scope', '$mdDialog', 'CacheHelper', 'DateHelper', '$timeout', 'MedifirstService',
        function ($state, $q, $scope, $mdDialog, cacheHelper, DateHelper, $timeout, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = $scope.now
            $scope.item.periodeAkhir = new Date();
            $scope.isRouteLoading = false;
            $scope.formCari = true
            $scope.formGrid = false
            $scope.formGridDetail = false
            $scope.formGridHistory = false
            $scope.formGridDetailKembali = false
            $scope.istempatLaporan = true;
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
            $scope.item.tglMeninggal = $scope.now;
            $scope.item.tglKeluar = $scope.now;
            var set = "";
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            var responData = ''
            var timeoutPromise;
            $scope.cardsEklaim = []
            $scope.cardsEklaim2 = []
            var noantrianLoket = 0;

            $scope.formatRupiah = function (value, currency) {
                if (value == 'null')
                    value = 0
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                $scope.sourceDiagnosisPrimer = data;
            });
            medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                $scope.sourceDiagnosisPrimer1 = data;
            });


            // $scope.cards = [
            //     {
            //         nama: 'opet',
            //         norm: '00000012',
            //         nokartu: 'NoKartu:0000000000000',
            //         lahir: 1231234123
            //     }
            // ];
            $scope.cardView = false;
            $scope.cardViewEklaim = false;
            $scope.cardViewEklaim2 = false;

            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.findData = function () {
                loadData()
            }
            $scope.SearchData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                medifirstService.get("bridging/inacbg/get-cari-daftar-pasien-sendClaim?" + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir).then(function (e) {
                        $scope.isRouteLoading = false;
                        var data2 = e.data
                        $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                            data: data2,
                            // group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {}
                            }
                        });
                    })
            }

            $scope.$watch('item.diagnosisPrimerEklaim', function (newVal, oldVal) {
                if (newVal.length > 2) {
                    $timeout.cancel(timeoutPromise);
                    timeoutPromise = $timeout(function () {
                        if (newVal != oldVal) {
                            var dt1 = {}
                            var dt2 = []
                            dt1 = {
                                "metadata": {
                                    "method": "search_diagnosis_inagrouper"
                                },
                                "data": {
                                    "keyword": newVal
                                }
                            }
                            dt2.push(dt1)


                            var objData = {
                                "data": dt2
                            }
                            medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                debugger
                                var responDiagnosa = e.data.dataresponse;
                                if (responDiagnosa[0].dataresponse.metadata.code == "200") {
                                    $scope.cardsEklaim = []
                                    var diagnosaInacbg = responDiagnosa[0].dataresponse.response.data
                                    for (var x = diagnosaInacbg.length - 1; x >= 0; x--) {
                                        let resDokter = { description: diagnosaInacbg[x].description, code: diagnosaInacbg[x].code }
                                        $scope.cardsEklaim.push(resDokter);
                                    }
                                    $scope.cardViewEklaim = true;
                                } else {
                                    $scope.cardViewEklaim = false;
                                }
                            })
                        }
                    }, 500)
                }
            })
            $scope.$watch('item.diagnosisPrimerEklaim2', function (newVal, oldVal) {
                if (newVal.length > 2) {
                    $timeout.cancel(timeoutPromise);
                    timeoutPromise = $timeout(function () {
                        if (newVal != oldVal) {
                            var dt1 = {}
                            var dt2 = []
                            dt1 = {
                                "metadata": {
                                    "method": "search_procedures_inagrouper"
                                },
                                "data": {
                                    "keyword": newVal
                                }
                            }
                            dt2.push(dt1)


                            var objData = {
                                "data": dt2
                            }
                            medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                debugger
                                var responDiagnosa = e.data.dataresponse;
                                if (responDiagnosa[0].dataresponse.metadata.code == "200") {
                                    $scope.cardsEklaim2 = []
                                    var diagnosaInacbg = responDiagnosa[0].dataresponse.response.data
                                    for (var x = diagnosaInacbg.length - 1; x >= 0; x--) {
                                        let resDokter = { description: diagnosaInacbg[x].description, code: diagnosaInacbg[x].code }
                                        $scope.cardsEklaim2.push(resDokter);
                                    }
                                    $scope.cardViewEklaim2 = true;
                                } else {
                                    $scope.cardViewEklaim2 = false;
                                }
                            })
                        }
                    }, 500)
                }
            })
            function loadData() {
                if ($scope.item.nocari.length > 17) {
                    $scope.isRouteLoading = true;
                    medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.item.nocari).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.isRouteLoading = false;
                            $scope.cards = [
                                {
                                    nama: e.data.response.peserta.nama,
                                    norm: e.data.response.peserta.noMr,
                                    nokartu: 'KARTU : ' + e.data.response.peserta.noKartu,
                                    lahir: 'LAHIR : ' + e.data.response.peserta.tglLahir
                                }
                            ];
                            $scope.cardView = true;
                        } else {
                            $scope.isRouteLoading = false;
                        }
                    })
                } else {
                    $scope.isRouteLoading = true;
                    medifirstService.get("bridging/inacbg/get-cari-daftar-pasien?nosep=" + $scope.item.nocari).then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.cards = e.data
                        $scope.cardView = true;
                    })
                }
            }
            $scope.show = function () {
                $scope.gridRoom = true;
                $scope.gridLab = false;
                $scope.gridResep = false;
                $scope.gridRad = false;

                if ($scope.dataSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }

                if ($scope.dataSelected.cpt != '') {
                    $scope.isCPT = true;
                } else {
                    $scope.isCPT = false;
                }

                if ($scope.dataSelected.cppt != '') {
                    $scope.isCPPT = true;
                } else {
                    $scope.isCPPT = false;
                }

                if ($scope.dataSelected.emrigd != '' &&$scope.dataSelected.emrigd != undefined) {
                    debugger
                    $scope.isEMRIGD = true;
                    $scope.emrIgd.nomorEMR = $scope.dataSelected.emrigd;
                    medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + $scope.dataSelected.emrigd + "&emrfk=515", true).then(function (dat) {
                        $scope.emrIgd = dat.data.data;
                    })
                } else {
                    $scope.isEMRIGD = false;
                }
                var ruangan = "";

                medifirstService.get("registrasi/daftar-registrasi/get-hasil-lab-inacbg?noregistrasi=" +
                    $scope.dataSelected.noregistrasi +
                    "&objectruanganlastfk=" + ruangan
                ).then(function (dat) {
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

                loadClaimPd()
                $scope.popUpShow.center().open();

            }
            function loadClaimPd() {
                medifirstService.get("registrasi/daftar-registrasi/get-status-claim-pd?noregistrasi=" + $scope.dataSelected.noregistrasi).then(function (claimpd) {
                    $scope.statusSelesaiPeriksaPd = claimpd.data.isclaim;
                });
                debugger
            }
            $scope.cetakSEP = function (x) {
                debugger;
                if ($scope.dataSelected.noregistrasi != undefined && $scope.dataSelected.kelompokpasien !== "Umum/Pribadi") {

                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                        '&norec=' + $scope.dataSelected.noregistrasi
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
            $scope.Cetakv2 = function () {
                $scope.popupCetak2.center().open();
            }
            $scope.Cetak = function () {

                var user = medifirstService.getPegawaiLogin();
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    var billing = "Rp " + parseFloat(dat.data.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var deposit = "Rp " + parseFloat(dat.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var totalDiskon = "Rp " + parseFloat(dat.data.totalDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    if (totalDiskon == "Rp NaN")
                        totalDiskon = "Rp 0,00";
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
                            x = " nokwitansi is not null and noregistrasi= '" + $scope.dataSelected.noregistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        } else if ($scope.item.cetakx == "belum") {
                            x = " nokwitansi is null and noregistrasi= '" + $scope.dataSelected.noregistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        } else {
                            x = " noregistrasi='" + $scope.dataSelected.noregistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep", "where", "totalDiskon"],
                            "paramValue": ["RS Bhayangkara TK. II Sartika Asih Bandung", "1980-12-25 00:00:00", "Jl. Moh. Toha No.369, Ciseureuh, Kec. Regol, Kota Bandung, Jawa Barat 40256", user.namaLengkap.toString(), $scope.dataSelected.noregistrasi,
                                dat.data.noCm, dat.data.namaPasien, dat.data.lastRuangan, dat.data.namakamar, kelas, billing, deposit, sisa, dat.data.isi, dat.data.terbilang, bayar, nosep, x, totalDiskon
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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

                        if (window.location.hostname.indexOf('localhost') > -1) {
                            xhr.open('POST', 'http://localhost:8797/generic/report/rincianbilling.pdf');
                        } else {
                            xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
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


            }
            $scope.CetakRekap = function () {
                var user = medifirstService.getPegawaiLogin();
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    var billing = "Rp " + parseFloat(dat.data.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var deposit = "Rp " + parseFloat(dat.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var totalharusdibayar = "Rp " + parseFloat(dat.data.lastharusbayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    if (totalharusdibayar == "Rp NaN")
                    totalharusdibayar = "Rp 0,00";
                    var tglayeuna = ''
                    var tglpulang = moment($scope.dataSelected.tglpulang).format('YYYY-MM-DD');
                    medifirstService.get("registrasi/git-tinggil-hirif?tanggal=" + tglpulang).then(function (datRes) {
                        debugger
                        tglayeuna = datRes.data.tglayeuna;
                        var x = " noregistrasi='" + $scope.dataSelected.noregistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai')and norec_pp is not null group by  noregistrasi,jenisproduk,tglregistrasi,tglpulang,namarekanan,tipepasien, dokterpj ,totalharusdibayar,dokter"
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
                                "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep", "tglayeuna", "jmlbiaya2", "where","totalharusbayar"],
                                "paramValue": ["RS Bhayangkara TK. II Sartika Asih Bandung", "1980-12-25 00:00:00", "Jl. Moh. Toha No.369, Ciseureuh, Kec. Regol, Kota Bandung, Jawa Barat 40256", user.namaLengkap, dat.data.noRegistrasi,
                                    dat.data.noCm, dat.data.namaPasien, dat.data.lastRuangan, dat.data.namakamar, kelas, billing, deposit, sisa, dat.data.isi, dat.data.terbilang, bayar, nosep, tglayeuna, sisa, x, totalharusdibayar
                                ],
                                "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                                if (window.location.hostname.indexOf('localhost') > -1) {
                                    xhr.open('POST', 'http://localhost:8797/generic/report/rekapbillingv2.pdf');
                                } else {
                                    xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                                }
                            } else if (dat.data.jenisPasien == "Umum/Pribadi") {
                                if (window.location.hostname.indexOf('localhost') > -1) {
                                    xhr.open('POST', 'http://localhost:8797/generic/report/rekapbillingv2.pdf');
                                } else {
                                    xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                                }
                            } else {
                                if (window.location.hostname.indexOf('localhost') > -1) {
                                    xhr.open('POST', 'http://localhost:8797/generic/report/rekapbillingv2.pdf');
                                } else {
                                    xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
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
                })


            }
            $scope.setdetail = function (x) {
                set = x
                $scope.isRouteLoading = true;
                $scope.showGrouping = true
                $scope.tabelTopup = false
                $scope.specialDrug = false
                $scope.specialProsthesis = false
                $scope.specialProsthesis = false
                $scope.specialInvestigation = false
                $scope.showUnrelated = false
                if (set.nosep == '') {
                    $scope.isRouteLoading = false;
                    toastr.error('SEP belum di input, silahkan input dulu NOSEP nya...')
                    return
                }
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + set.nosep).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        if (e.data.response.jnsPelayanan == "Rawat Jalan" && set.tipe != 'RJ') {
                            $scope.isRouteLoading = false;
                            toastr.error('SEP ini untuk Rawat Jalan')
                            return
                        } else if (e.data.response.jnsPelayanan == "Rawat Inap" && set.tipe != 'RI') {
                            $scope.isRouteLoading = false;
                            toastr.error('SEP ini untuk Rawat Inap')
                            return
                        }
                        if (moment(set.tglmasuk).format('YYYY-MM-DD') != e.data.response.tglSep) {
                            toastr.error('Tanggal SEP ' + e.data.response.tglSep + ' Berbeda Dengan Tanggal Registrasi ' + moment(set.tglmasuk).format('YYYY-MM-DD'))
                            return
                        }
                        medifirstService.get("bridging/inacbg/get-cari-set-form-inacbg?nosep=" + set.noregistrasi).then(function (e) {
                            $scope.isRouteLoading = false;
                            $scope.formGridHistory = false
                            $scope.formGridDetail = true
                            $scope.item = e.data
                            $scope.item.sistoleinacbg = $scope.item.data[0].sistoleinacbg
                            $scope.item.diastoleinacbg = $scope.item.data[0].diastoleinacbg
                            $scope.judulPasienKlaim = set.nosep + ' / ' + set.tipe
                            $scope.item.jaminan = set.jaminan
                            $scope.item.nokartu = set.nokepesertaan
                            $scope.item.nosep = set.nosep
                            $scope.item.cob = '-'
                            if (set.tipe == 'RJ') {
                                $scope.paramInacbg = 'Rawat Jalan'
                                $scope.targetkelas_rawat = e.data.data[0].namakelas
                                $scope.target_statusnaikkelas = 'Tidak Naik Kelas'
                                $scope.target_kelaspelayanan = '-'
                                $scope.target_upgrade_class_payor = 'Tidak Naik Kelas'
                            } else {
                                $scope.paramInacbg = 'Rawat Inap'
                                $scope.targetkelas_rawat = e.data.data[0].namakelas
                                $scope.target_kelaspelayanan = e.data.datanaikkelas[0].kelastertinggi
                                if (e.data.datanaikkelas[0].statusnaikkelas == '1'){
                                    $scope.target_statusnaikkelas = 'Naik Kelas'
                                    if(e.data.datanaikkelas[0].namanaikkelas!=null)
                                        $scope.target_upgrade_class_payor = $scope.item.data[0].namanaikkelas
                                    else
                                        $scope.target_upgrade_class_payor = 'Belum Diisi'
                                }
                                else{
                                    $scope.target_statusnaikkelas = 'Tidak Naik Kelas'
                                    $scope.target_upgrade_class_payor = 'Tidak Naik Kelas'
                                }
                            }
                            $scope.targettgl_masuk = e.data.data[0].tglregistrasi
                            $scope.targettgl_pulang = e.data.data[0].tglpulang
                            $scope.targetnama_dokter = e.data.data[0].namadokter
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(e.data.data[0].tgllahir);
                            var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                            $scope.targetumur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            if (e.data.data[0].objectstatuspulangfk == 1 || e.data.data[0].objectstatuspulangfk == 13) {
                                $scope.targetdischarge_status = 'Atas persetujuan dokter'
                            } else if (e.data.data[0].objectstatuspulangfk == 4 || e.data.data[0].objectstatuspulangfk == 5 || e.data.data[0].objectstatuspulangfk == 10 ||
                                e.data.data[0].objectstatuspulangfk == 11 || e.data.data[0].objectstatuspulangfk == 7 || e.data.data[0].objectstatuspulangfk == 16) {
                                $scope.targetdischarge_status = 'Dirujuk'
                            } else if (e.data.data[0].objectstatuspulangfk == 2 || e.data.data[0].objectstatuspulangfk == 3 ||
                                e.data.data[0].objectstatuspulangfk == 12) {
                                $scope.targetdischarge_status = 'Atas permintaan sendiri'
                            } else if (e.data.data[0].objectstatuspulangfk == 9 || e.data.data[0].objectstatuspulangfk == 18) {
                                $scope.targetdischarge_status = 'Meninggal'
                            } else {
                                $scope.targetdischarge_status = 'Lain-lain'
                            }
                            $scope.target_cara_masuk = 'Belum Diisi'
                            if (e.data.data[0].caramasuk != null)
                                $scope.target_cara_masuk = e.data.data[0].caramasuk

                           
                            $scope.listTarifRS = [
                                { namatarif: 'Prosedur Non Bedah', tarif: e.data.dataTarif.prosedur_non_bedah, tarifx: $scope.formatRupiah(e.data.dataTarif.prosedur_non_bedah, 'Rp. ') },
                                { namatarif: 'Tenaga Ahli', tarif: e.data.dataTarif.tenaga_ahli, tarifx: $scope.formatRupiah(e.data.dataTarif.tenaga_ahli, 'Rp. ') },
                                { namatarif: 'Radiologi', tarif: e.data.dataTarif.radiologi, tarifx: $scope.formatRupiah(e.data.dataTarif.radiologi, 'Rp. ') },
                                { namatarif: 'Rehabilitasi', tarif: e.data.dataTarif.rehabilitasi, tarifx: $scope.formatRupiah(e.data.dataTarif.rehabilitasi, 'Rp. ') },
                                { namatarif: 'Obat', tarif: e.data.dataTarif.obat, tarifx: $scope.formatRupiah(e.data.dataTarif.obat, 'Rp. ') },
                                { namatarif: 'Alkes', tarif: e.data.dataTarif.alkes, tarifx: $scope.formatRupiah(e.data.dataTarif.alkes, 'Rp. ') },
                                { namatarif: 'Prosedur Bedah', tarif: e.data.dataTarif.prosedur_bedah, tarifx: $scope.formatRupiah(e.data.dataTarif.prosedur_bedah, 'Rp. ') },
                                { namatarif: 'Keperawatan', tarif: e.data.dataTarif.keperawatan, tarifx: $scope.formatRupiah(e.data.dataTarif.keperawatan, 'Rp. ') },
                                { namatarif: 'Laboratorium', tarif: e.data.dataTarif.laboratorium, tarifx: $scope.formatRupiah(e.data.dataTarif.laboratorium, 'Rp. ') },
                                { namatarif: 'Kamar/Akomodasi', tarif: e.data.dataTarif.kamar, tarifx: $scope.formatRupiah(e.data.dataTarif.kamar, 'Rp. ') },
                                { namatarif: 'Prosedur Non Bedah', tarif: e.data.dataTarif.obat_kronis, tarifx: $scope.formatRupiah(e.data.dataTarif.obat_kronis, 'Rp. ') },
                                { namatarif: 'BMHP', tarif: e.data.dataTarif.bmhp, tarifx: $scope.formatRupiah(e.data.dataTarif.bmhp, 'Rp. ') },
                                { namatarif: 'Konsultasi', tarif: e.data.dataTarif.konsultasi, tarifx: $scope.formatRupiah(e.data.dataTarif.konsultasi, 'Rp. ') },
                                { namatarif: 'Penunjang', tarif: e.data.dataTarif.penunjang, tarifx: $scope.formatRupiah(e.data.dataTarif.penunjang, 'Rp. ') },
                                { namatarif: 'Pelayanan Darah', tarif: e.data.dataTarif.pelayanan_darah, tarifx: $scope.formatRupiah(e.data.dataTarif.pelayanan_darah, 'Rp. ') },
                                { namatarif: 'Rawat Intensif', tarif: e.data.dataTarif.rawat_intensif, tarifx: $scope.formatRupiah(e.data.dataTarif.rawat_intensif, 'Rp. ') },
                                { namatarif: 'Obat Kemoterapi', tarif: e.data.dataTarif.obat_kemoterapi, tarifx: $scope.formatRupiah(e.data.dataTarif.obat_kemoterapi, 'Rp. ') },
                                { namatarif: 'Sewa Alat', tarif: e.data.dataTarif.sewa_alat, tarifx: $scope.formatRupiah(e.data.dataTarif.sewa_alat, 'Rp. ') },
                            ]
                            $scope.totalTarifRS = 0
                            for (var i = 0; i < $scope.listTarifRS.length; i++) {
                                $scope.totalTarifRS = parseFloat($scope.listTarifRS[i].tarif) + $scope.totalTarifRS
                            }
                            $scope.totalTarifRS = $scope.formatRupiah($scope.totalTarifRS, 'Rp. ')
                            $scope.totalInacbg = $scope.formatRupiah($scope.item.data[0].totalpiutangpenjamin, 'Rp. ')
                            $scope.totalTarifNaikKelas = $scope.formatRupiah($scope.item.data[0].biayanaikkelas !== null ? $scope.item.data[0].biayanaikkelas : 0, 'Rp. ')
                            $scope.item.beratBadan = $scope.item.data[0].beratbadan
                            $scope.cbgcode = $scope.item.data[0].cbgcode
                            $scope.cbgdescription = $scope.item.data[0].cbgdescription
                            var dataTea = $scope.item.dataDiagnosa10;
                            $scope.listDiagnosa10 = $scope.item.dataDiagnosa10;
                            $scope.listDiagnosa9 = $scope.item.dataDiagnosa9;
                            $scope.listDiagnosa10Inacbg = $scope.item.dataDiagnosaInacbg10;
                            $scope.listDiagnosa9Inacbg = $scope.item.dataDiagnosaInacbg9;

                        })
                    } else {
                        $scope.isRouteLoading = false;
                        toastr.error(e.data.metaData.message + ' ' + e.data.metaData.code)
                        return
                    }
                })

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
                dataBound: onDataBound,
                pageable: true,
                // sortable: true,
                // resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglmasuk",
                    "title": "Tgl Registrasi",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: tglregistrasi #</span>"
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "NoReg",
                    "width": "90px"
                },
                {
                    "field": "nocm",
                    "title": "NoRM",
                    "width": "70px",
                    "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                    "template": "<span class='style-left'>#: namapasien #</span>",
                },
                {
                    "field": "namadpjp",
                    "title": "Nama DPJP",
                    "width": "70px",
                    "template": "<span class='style-center'>#: namadpjp #</span>"
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: tglpulang #</span>"
                    // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                },
                {
                    "field": "nosep",
                    "title": "No SEP",
                    "width": "150px",
                    "template": '# if( nosep==null || nosep=="") {# - # } else {# #= nosep # #} #'
                },
                {
                    "field": "statusgrouping",
                    "title": "Status Grouping",
                    "width": "150px",
                    "template": '# if( statusgrouping==null || statusgrouping=="") {# - # } else {# #= statusgrouping # #} #'
                },
                {
                    "field": "totalbiayars",
                    "title": "Biaya RS",
                    "width": "150px",
                    "template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalbiayars #', 'Rp. ')}}</span>",
                },
                {
                    "field": "totalpiutangpenjamin",
                    "title": "Klaim Inacbg",
                    "width": "150px",
                    "template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalpiutangpenjamin #', 'Rp. ')}}</span>",
                },
                {
                    "field": "biayanaikkelas",
                    "title": "Biaya Naik Kelas",
                    "width": "150px",
                    "template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: biayanaikkelas #', 'Rp. ')}}</span>",
                },
                {
                    "field": "cbgcode",
                    "title": "Kode CBG",
                    "width": "70px",
                    "template": "<span class='style-center'>#: cbgcode #</span>"
                },
                {
                    "field": "cbgdescription",
                    "title": "Description",
                    "width": "150px"
                },
                {
                    "field": "kddiagnosa",
                    "title": "Kode Diagnosa",
                    "width": "70px",
                    "template": "<span class='style-center'>#: kddiagnosa #</span>"
                },
                {
                    "field": "isdiagnosis",
                    "title": "Diagnosa",
                    "width": "150px"
                },
                ]
            };

            $scope.clickKembali = function () {
                if ($scope.formGridHistory == true) {
                    $scope.formGrid = false
                    $scope.formGridHistory = false
                    $scope.formCari = true
                } else if ($scope.formGridDetail == true) {
                    $scope.formGridHistory = true
                    $scope.formGridDetail = false
                }
            }
            $scope.clickCardEklaim = function (x) {
                debugger
                $scope.cardViewEklaim = false;
                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: '',
                    noregistrasifk: $scope.item.data[0].noregistrasi,
                    code: x.code,
                    description: x.description,
                    jenisdiagnosainacbgfk: '10'
                }
                var objSave = {
                    detaildiagnosapasien: detaildiagnosapasien,
                }
                debugger;
                medifirstService.post('registrasi/save-diagnosa-inacbg', objSave).then(function (e) {
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelectedDiagnosa = {};
                    $scope.isRouteLoading = false;
                    $scope.setdetail(set)
                })
            }

            $scope.clickCardEklaim2 = function (x) {
                debugger
                $scope.cardViewEklaim2 = false;
                var x2 = x;
                var confirm = $mdDialog.prompt()
                    .title('Silahkan Masukan Jumlah Tindakan Dalam 1x Operasi?')
                    .placeholder('Jumlah Tindakan')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .initialValue('')
                    .ok('Okay!')
                    .cancel('Tidak');
                $mdDialog.show(confirm).then(function (result) {
                    noantrianLoket = result
                    $scope.now = new Date();
                    var detaildiagnosapasien = {
                        norec_dp: '',
                        noregistrasifk: $scope.item.data[0].noregistrasi,
                        code: x2.code,
                        description: x2.description,
                        jenisdiagnosainacbgfk: '9',
                        jumlah: noantrianLoket
                    }
                    var objSave = {
                        detaildiagnosapasien: detaildiagnosapasien,
                    }
                    debugger;
                    medifirstService.post('registrasi/save-diagnosa-inacbg9', objSave).then(function (e) {
                        delete $scope.item.diagnosisPrimer;
                        $scope.dataSelectedDiagnosa = {};
                        $scope.isRouteLoading = false;
                        $scope.setdetail(set)
                    })
                }, function () {
                    return
                });

            }
            $scope.clickCard = function (x) {
                $scope.formCari = false
                $scope.formGrid = true
                $scope.formGridHistory = true
                $scope.formGridDetailKembali = true
                $scope.judulPasien = x.nama + '-' + x.norm
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/inacbg/get-cari-history-daftar-pasien?nosep=" + x.norm).then(function (e) {
                    $scope.isRouteLoading = false;
                    var data2 = e.data
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2,
                        // group: $scope.group,
                        pageSize: 100,
                        total: data2.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        }
                    });
                })


            }

            $scope.columnGrid = {
                selectable: 'row',
                pageable: true,
                // dataBound: onDataBound,
                // columns: $scope.columnGrid
                columns: [
                    {
                        "title": "Detail",
                        "width": "90px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setdetail(dataItem)\"  style=\"margin:0 0 5px\">#:  'Detail' #</button> ",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi",
                        "width": "35px",
                    },
                    {
                        "field": "tglmasuk",
                        "title": "Tanggal Masuk",
                        "width": "35px",
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tanggal Pulang",
                        "width": "35px",
                    },
                    {
                        "field": "jaminan",
                        "title": "Jaminan",
                        "width": "35px",
                    },
                    {
                        "field": "nosep",
                        "title": "No. SEP",
                        "width": "35px",
                    },
                    {
                        "field": "tipe",
                        "title": "Tipe",
                        "width": "35px",
                    },
                    {
                        "field": "cbgcode",
                        "title": "CBG",
                        "width": "35px",
                    },
                    {
                        "field": "statusgrouping",
                        "title": "Status",
                        "width": "35px",
                    },
                ]
            };

            $scope.clickStatusPulang = function () {
                getdataCombo();
                $scope.popupEditStatusPulang.center().open();
            }
            $scope.clickCaraMasuk = function () {
                medifirstService.get('registrasi/daftar-antrian-pasien/get-combo-caramasukinacbg').then(function (e) {
                    $scope.listCaraMasuk = e.data.dataCaraMasuk
                })
                $scope.popupEditCaraMasuk.center().open();
            }
            $scope.clickCaraNaikKelas = function () {
                medifirstService.get('registrasi/daftar-antrian-pasien/get-combo-caramasukinacbg').then(function (e) {
                    $scope.listNaikKelas = e.data.dataCaraNaikKelas
                })
                $scope.popupEditCaraNaikKelas.center().open();
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
                    noregistrasi: $scope.item.data[0].noregistrasi,
                    objectruanganlastfk: $scope.item.data[0].objectruanganlastfk,
                    objectkondisipasienfk: kondisiKeluarId,
                    objectpenyebabkematianfk: penyebabkematianId,
                    objectstatuskeluarfk: statusKeluarId,
                    objectstatuspulangfk: statusPulangId,
                    tglmeninggal: moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm:ss'),
                    tglpulang: moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss'),
                    norec_pd: $scope.item.data[0].noregistrasifk,
                    objectstatuskeluarrencanafk: statusKeluarId,
                    nocmfk: $scope.item.data[0].nocmfk,
                    keteranganpulang: "Pulang dengan kondisi : " + kondisiKeluar,
                    keterangankematian: PenyebabKematianText,

                }
                var antrianpasiendiperiksa = {
                    objectruanganlastfk: $scope.item.data[0].objectruanganlastfk,
                    tglpulangseblumnya: $scope.item.data[0].tglpulang,
                }
                var objSave = {
                    pasiendaftar: pasiendaftar,
                    antrianpasiendiperiksa: antrianpasiendiperiksa
                }
                debugger
                medifirstService.post('rawatinap/save-pulang-pasien-eklaim', objSave).then(function (e) {
                    $scope.setdetail(set);
                    $scope.popupEditStatusPulang.close();
                })
            }
            $scope.saveCaraMasuk = function () {
                debugger
                var caraMasuk = null;
                if ($scope.item.statusMasuk != undefined) {
                    caraMasuk = $scope.item.statusMasuk.id;
                }
                
                var pasiendaftar = {
                    noregistrasi: $scope.item.data[0].noregistrasi,
                    caraMasuk: caraMasuk,
                }
               
                var objSave = {
                    pasiendaftar: pasiendaftar,
                }
                debugger
                medifirstService.post('rawatinap/save-cara-masuk-eklaim', objSave).then(function (e) {
                    $scope.setdetail(set);
                    $scope.popupEditStatusPulang.close();
                })
            }
            $scope.saveNaikKelas = function () {
                debugger
                var caraNaikKelas = null;
                if ($scope.item.caraNaikKelas != undefined) {
                    caraNaikKelas = $scope.item.caraNaikKelas.id;
                }
                
                var pasiendaftar = {
                    noregistrasi: $scope.item.data[0].noregistrasi,
                    caraNaikKelas: caraNaikKelas,
                }
               
                var objSave = {
                    pasiendaftar: pasiendaftar,
                }
                debugger
                medifirstService.post('rawatinap/save-cara-naikkelas-eklaim', objSave).then(function (e) {
                    $scope.setdetail(set);
                    $scope.popupEditStatusPulang.close();
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
            var onDataBound = function (e) {
                $('td').each(function () {
                    if ($(this).text() == 'false') { $(this).text('Belum di Coder') }
                    if ($(this).text() == 'Belum di Coder') { $(this).addClass('koneng') }
                    if ($(this).text() == 'BELUM') { $(this).text('Belum di Grouping') }
                    if ($(this).text() == 'Belum di Grouping') { $(this).addClass('koneng') }
                    if ($(this).text() == 'Edit') { $(this).addClass('koneng') }
                })
            }
            $scope.gridDiagnosa = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [
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
            $scope.simpanBeratBadanBayi = function () {
                if ($scope.item.beratBadan == undefined) {
                    alert("Berat Badan Belum Di isi!!")
                    return
                }
                debugger;
                var objSave = {
                    beratbadan: $scope.item.beratBadan,
                    noregistrasifk: $scope.item.data[0].noregistrasifk
                }
                medifirstService.post('bridging/inacbg/save-beratbadanbayi', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.setdetail(set)
                    // window.history.back();
                })
            }
            $scope.simpanTekananDarah = function () {
                if ($scope.item.sistoleinacbg == undefined) {
                    alert("Tekanan Darah Belum Di isi!!")
                    return
                }
                if ($scope.item.diastoleinacbg == undefined) {
                    alert("Tekanan Darah mmhg Belum Di isi!!")
                    return
                }
                debugger;
                var objSave = {
                    sistole: $scope.item.sistoleinacbg,
                    diastole: $scope.item.diastoleinacbg,
                    noregistrasifk: $scope.item.data[0].noregistrasifk
                }
                medifirstService.post('bridging/inacbg/save-tekananDarah', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.setdetail(set)
                })
            }

            $scope.simpanDiagnosaTarget = function () {
                debugger
                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.dataSelectedDiagnosa == undefined) {
                    alert("Silahkan Klik Ruangan Di List Diagnosa!!")
                    return
                }
                var norecDiagnosaPasien = "";
                if ($scope.dataSelectedDiagnosa.norec_diagnosapasien != undefined) {
                    norecDiagnosaPasien = $scope.dataSelectedDiagnosa.norec_diagnosapasien
                }
                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: norecDiagnosaPasien,
                    noregistrasifk: $scope.item.data[0].noregistrasi,
                    tglregistrasi: $scope.item.data[0].tglregistrasi,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: '-'
                }
                var objSave = {
                    detaildiagnosapasien: detaildiagnosapasien,
                }
                debugger;
                medifirstService.post('registrasi/save-diagnosa-pasien-target', objSave).then(function (e) {
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelectedDiagnosa = {};
                    $scope.isRouteLoading = false;
                    $scope.setdetail(set)
                })

            }
            $scope.simpanDiagnosaTarget1 = function () {
                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }

                var norecDiagnosaTindakanPasien = "";
                if ($scope.dataSelected1 != undefined) {
                    norecDiagnosaTindakanPasien = $scope.dataSelected1.norec_diagnosapasien
                }
                var keteranganTindakan = "-";
                if ($scope.item.keteranganTindakan != undefined) {
                    keteranganTindakan = $scope.item.keteranganTindakan
                }
                $scope.now = new Date();
                var confirm = $mdDialog.prompt()
                    .title('Silahkan Masukan Jumlah Tindakan Dalam 1x Operasi?')
                    .placeholder('Jumlah Tindakan')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .initialValue('')
                    .ok('Okay!')
                    .cancel('Tidak');
                $mdDialog.show(confirm).then(function (result) {
                    noantrianLoket = result
                    var detaildiagnosatindakanpasien = {
                        norec_dp: norecDiagnosaTindakanPasien,
                        noregistrasifk: $scope.item.data[0].noregistrasi,
                        tglpendaftaran: $scope.item.data[0].tglregistrasi,
                        objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
                        keterangantindakan: keteranganTindakan,
                        jumlah: noantrianLoket
                    }
                    var objSave = {
                        detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
                    }

                    medifirstService.post('registrasi/save-diagnosa-tindakan-pasien-target', objSave).then(function (e) {
                        delete $scope.item.diagnosisPrimer1;
                        $scope.isRouteLoading = false;
                        $scope.setdetail(set)
                    })
                }, function () {
                    return
                });
            }



            $scope.go = function (ai) {
                debugger
                $scope.dataSelectedDiagnosa = ai
                //...
            };
            $scope.go9 = function (x) {
                debugger
                $scope.dataSelected1 = x
                //...
            };
            $scope.clickHapus10DiagnosaInacbg = function (ai) {
                debugger
                var diagnosa = {
                    norec_dp: ai.norec_diagnosapasien,
                    noregistrasi: ai.noregistrasi
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-inacbg10', objDelete).then(function (e) {
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelectedDiagnosa = {};
                    $scope.setdetail(set)
                })
                // $scope.dataSelected1 = ai
                //...
            };
            $scope.clickHapus9DiagnosaInacbg = function (ai) {
                debugger
                var diagnosa = {
                    norec_dp: ai.norec_diagnosapasien,
                    noregistrasi: ai.noregistrasi
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-inacbg9', objDelete).then(function (e) {
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelectedDiagnosa = {};
                    $scope.setdetail(set)
                })
                // $scope.dataSelected1 = ai
                //...
            };
            $scope.clickHapus = function (ai) {
                debugger
                var diagnosa = {
                    norec_dp: ai.norec_diagnosapasien,
                    noregistrasi: ai.noregistrasi
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien-target', objDelete).then(function (e) {
                    delete $scope.item.diagnosisPrimer;
                    $scope.dataSelectedDiagnosa = {};
                    $scope.setdetail(set)
                })
                // $scope.dataSelected1 = ai
                //...
            };
            $scope.clickHapus9 = function (x) {
                debugger
                var diagnosa = {
                    norec_dp: x.norec_diagnosapasien,
                    noregistrasi: x.noregistrasi
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    delete $scope.item.diagnosisPrimer1;
                    $scope.dataSelected1 = {};
                    $scope.setdetail(set)
                })
            }
            $scope.clickGrouping = function () {
                debugger
                if ($scope.item.data[0].nosep == "" || $scope.item.data[0].nosep == null || $scope.item.data[0].nosep == undefined) {
                    toastr.error('NOSEP PASIEN BELUM TERISI', 'INACBG');
                    return;
                }
                var discharge_status = 0
                if ($scope.item.data[0].objectstatuspulangfk == 1 || $scope.item.data[0].objectstatuspulangfk == 6 || $scope.item.data[0].objectstatuspulangfk == 13) {
                    discharge_status = 1
                } else if ($scope.item.data[0].objectstatuspulangfk == 4 || $scope.item.data[0].objectstatuspulangfk == 5 || $scope.item.data[0].objectstatuspulangfk == 10 ||
                    $scope.item.data[0].objectstatuspulangfk == 11 || $scope.item.data[0].objectstatuspulangfk == 7 || $scope.item.data[0].objectstatuspulangfk == 16) {
                    discharge_status = 2
                } else if ($scope.item.data[0].objectstatuspulangfk == 2 || $scope.item.data[0].objectstatuspulangfk == 8 || $scope.item.data[0].objectstatuspulangfk == 3 ||
                    $scope.item.data[0].objectstatuspulangfk == 12) {
                    discharge_status = 3
                } else if ($scope.item.data[0].objectstatuspulangfk == 9 || $scope.item.data[0].objectstatuspulangfk == 18) {
                    discharge_status = 4
                } else {
                    discharge_status = 5
                }
                $scope.isRouteLoading = true;
                if (set.tipe == "RJ") {
                    var dt1 = {}
                    var dt2 = []
                    dt1 = {
                        "metadata": {
                            "method": "new_claim"
                        },
                        "data": {
                            "nomor_kartu": set.nokepesertaan,
                            "nomor_sep": set.nosep,
                            "nomor_rm": $scope.item.data[0].nocm,
                            "nama_pasien": $scope.item.data[0].namapasien,
                            "tgl_lahir": $scope.item.data[0].tgllahir,
                            "gender": $scope.item.data[0].objectjeniskelaminfk
                        }
                    }
                    dt2.push(dt1)
                    var objData = {
                        "data": dt2
                    }
                    dt1 = {
                        "metadata": {
                            "method": "set_claim_data",
                            "nomor_sep": set.nosep
                        },
                        "data": {
                            "nomor_sep": set.nosep, //"0901R001TEST0001",    
                            "nomor_kartu": set.nokepesertaan, //"233333",    
                            "tgl_masuk": $scope.item.data[0].tglregistrasi, //"2017-11-20 12:55:00",    
                            "tgl_pulang": $scope.item.data[0].tglregistrasi, //"2017-12-01 09:55:00",    
                            "cara_masuk": $scope.item.data[0].kodecaramasuk,
                            "jenis_rawat": parseInt($scope.item.data[0].jenisrawat), //"1",    
                            "kelas_rawat": "3", //"1",    
                            "adl_sub_acute": "",
                            "adl_chronic": "",
                            "icu_indikator": "",
                            "icu_los": "",
                            "ventilator_hour": "",
                            "upgrade_class_ind": "0",
                            "upgrade_class_class": "Non Kelas",
                            "upgrade_class_los": "",
                            "add_payment_pct": "75",
                            "birth_weight": $scope.item.data[0].beratbadan,
                            "sistole": $scope.item.sistoleinacbg,
                            "diastole": $scope.item.diastoleinacbg,
                            "discharge_status": discharge_status,
                            "diagnosa": $scope.item.dataDiagnosa10Inacbg,
                            "procedure": $scope.item.dataDiagnosa9Inacbg,
                            "diagnosa_inagrouper": $scope.item.dataDiagnosa10Inacbg,// $scope.item.dataDiagnosaInacbg10Inacbg,
                            "procedure_inagrouper": $scope.item.dataDiagnosa9InacbgImport, //$scope.item.dataDiagnosaInacbg9Inacbg,
                            "tarif_rs": {
                                "prosedur_non_bedah": $scope.item.dataTarif.prosedur_non_bedah,
                                "prosedur_bedah": $scope.item.dataTarif.prosedur_bedah, //"20000000",      
                                "konsultasi": $scope.item.dataTarif.konsultasi, //"300000",      
                                "tenaga_ahli": $scope.item.dataTarif.tenaga_ahli, //"200000",      
                                "keperawatan": $scope.item.dataTarif.keperawatan, // "80000",      
                                "penunjang": $scope.item.dataTarif.penunjang, //"1000000",      
                                "radiologi": $scope.item.dataTarif.radiologi, //"500000",      
                                "laboratorium": $scope.item.dataTarif.laboratorium, //"600000",      
                                "pelayanan_darah": $scope.item.dataTarif.pelayanan_darah, //"150000",      
                                "rehabilitasi": $scope.item.dataTarif.rehabilitasi, //"100000",      
                                "kamar": $scope.item.dataTarif.kamar, //"6000000",      
                                "rawat_intensif": $scope.item.dataTarif.rawat_intensif, //"2500000",      
                                "obat": $scope.item.dataTarif.obat, //"2000000",  
                                "obat_kronis": $scope.item.dataTarif.obat_kronis,
                                "obat_kemoterapi": $scope.item.dataTarif.obat_kemoterapi,
                                "alkes": $scope.item.dataTarif.alkes, //"500000",      
                                "bmhp": $scope.item.dataTarif.bmhp, //"400000",      
                                "sewa_alat": $scope.item.dataTarif.sewa_alat, //"210000"    
                            },
                            "pemulasaraan_jenazah": 0,
                            "kantong_jenazah": 0,
                            "peti_jenazah": 0,
                            "plastik_erat": 0,
                            "desinfektan_jenazah": 0,
                            "mobil_jenazah": 0,
                            "desinfektan_mobil_jenazah": 0,
                            "covid19_status_cd": "0",
                            "nomor_kartu_t": $scope.item.data[0].noidentitas,
                            "episodes": null,
                            "covid19_cc_ind": "",
                            "tarif_poli_eks": 0,
                            "nama_dokter": $scope.item.data[0].namadokter, //"RUDY, DR",    
                            "kode_tarif": "DP",
                            "payor_id": $scope.item.data[0].kodejaminan, //"3",    
                            "payor_cd": $scope.item.data[0].jaminan,
                            "cob_cd": "#",
                            // "coder_nik": '123123123123' //"123123123123"
                            "coder_nik": $scope.dataLogin.noIdentitas,
                        }
                    }
                    dt2.push(dt1)
                    var objData = {
                        "data": dt2
                    }
                    medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                        var dt1 = {}
                        var dt2 = []
                        dt1 = {
                            "metadata": {
                                "method": "grouper",
                                "stage": "1"
                            },
                            "data": {
                                // "nomor_sep": dataSave[i].nomor_sep 
                                "nomor_sep": set.nosep
                            }
                        }
                        dt2.push(dt1)
                        var objData = {
                            "data": dt2
                        }
                        var totaldijamin = "";
                        var hakkelas = "";
                        var biayanaikkelas = "0";
                        medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                            $scope.isRouteLoading = false;
                            responData = e.data.dataresponse;
                            toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                            toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
                            if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
                                toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
                                return;
                            }
                            // totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
                            totaldijamin = responData[0].dataresponse.response.cbg.tariff
                            $scope.cbgcode = responData[0].dataresponse.response.cbg.code
                            $scope.cbgdescription = responData[0].dataresponse.response.cbg.description
                            $scope.totalInacbg = $scope.formatRupiah(totaldijamin, 'Rp. ')
                            $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, 'Rp. ')
                            var dataproposi = {
                                "noregistrasifk": $scope.item.data[0].noregistrasifk,
                                "totalDijamin": totaldijamin,
                                "biayaNaikkelas": biayanaikkelas,
                                "cbgcode": $scope.cbgcode,
                                "cbgdescription": $scope.cbgdescription
                            }
                            medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
                                //ini untuk proposional kan utang per tindakan
                            })
                            $scope.isRouteLoading = false;
                            // setdetail(set);
                            if (responData[0].dataresponse.special_cmg_option.length > 0) {
                                toastr.info('Terdeteksi Top-up CMG Options')
                                // dataSEPCMG = responData[0].datarequest.data.nomor_sep
                                var responOptions = responData[0].dataresponse.special_cmg_option
                                var spesialDrugx = []
                                var specialProcedurex = []
                                var specialProsthesisx = []
                                var specialInvestigationx = []
                                $scope.tabelTopup = true
                                $scope.showGrouping = false
                                for (let i = 0; i < responOptions.length; i++) {
                                    const element = responOptions[i];
                                    if (element.type == 'Special Drug') {
                                        spesialDrugx.push(element)
                                        $scope.specialDrug = true
                                    }
                                    if (element.type == 'Special Procedure') {
                                        specialProcedurex.push(element)
                                        $scope.specialProcedure = true
                                    }
                                    if (element.type == 'Special Prosthesis') {
                                        specialProsthesisx.push(element)
                                        $scope.specialProsthesis = true
                                    }
                                    if (element.type == 'Special Investigation') {
                                        specialInvestigationx.push(element)
                                        $scope.specialInvestigation = true
                                    }
                                }
                                $scope.listspecialdrug = spesialDrugx
                                $scope.listspecialprocedure = specialProcedurex
                                $scope.listspecialprosthesis = specialProsthesisx
                                $scope.listspecialinvestigation = specialInvestigationx
                            }
                            $scope.isRouteLoading = false;
                            $scope.setdetail(set);
                        })
                    })
                } else {
                    // toastr.error('Grouping Rawat Inap Memakai Menu Klaim InacbgV2', 'INACBG');
                    // return;
                    var dt1 = {}
                    var dt2 = []
                    dt1 = {
                        "metadata": {
                            "method": "new_claim"
                        },
                        "data": {
                            "nomor_kartu": set.nokepesertaan,
                            "nomor_sep": set.nosep,
                            "nomor_rm": $scope.item.data[0].nocm,
                            "nama_pasien": $scope.item.data[0].namapasien,
                            "tgl_lahir": $scope.item.data[0].tgllahir,
                            "gender": $scope.item.data[0].objectjeniskelaminfk
                        }
                    }
                    dt2.push(dt1)
                    var objData = {
                        "data": dt2
                    }
                    dt1 = {
                        "metadata": {
                            "method": "set_claim_data",
                            "nomor_sep": set.nosep
                        },
                        "data": {
                            "nomor_sep": set.nosep, //"0901R001TEST0001",    
                            "nomor_kartu": set.nokepesertaan, //"233333",    
                            "tgl_masuk": $scope.item.data[0].tglregistrasi, //"2017-11-20 12:55:00",    
                            "tgl_pulang": $scope.item.data[0].tglpulang, //"2017-12-01 09:55:00",   
                            "cara_masuk": $scope.item.data[0].kodecaramasuk, 
                            "jenis_rawat": parseInt($scope.item.data[0].jenisrawat), //"1",     
                            "kelas_rawat": $scope.item.data[0].nokelasdijamin,
                            "adl_sub_acute": "",
                            "adl_chronic": "",
                            "icu_indikator": $scope.item.datanaikkelas[0].statusrawatintensiv,
                            "icu_los": $scope.item.datanaikkelas[0].lamarawatintensiv,
                            "ventilator_hour": "",
                            "upgrade_class_ind": $scope.item.datanaikkelas[0].statusnaikkelas,
                            "upgrade_class_class": $scope.item.datanaikkelas[0].kelastertinggi,
                            "upgrade_class_los": $scope.item.datanaikkelas[0].lamarawatnaikkelas,
                            "upgrade_class_payor": $scope.target_upgrade_class_payor,
                            "add_payment_pct": "75",
                            "birth_weight": $scope.item.data[0].beratbadan,
                            "sistole": $scope.item.sistoleinacbg,
                            "diastole": $scope.item.diastoleinacbg,
                            "discharge_status": discharge_status,
                            "diagnosa": $scope.item.dataDiagnosa10Inacbg,
                            "procedure": $scope.item.dataDiagnosa9Inacbg,
                            "diagnosa_inagrouper": $scope.item.dataDiagnosa10Inacbg,// $scope.item.dataDiagnosaInacbg10Inacbg,
                            "procedure_inagrouper": $scope.item.dataDiagnosa9InacbgImport, //$scope.item.dataDiagnosaInacbg9Inacbg,
                            "tarif_rs": {
                                "prosedur_non_bedah": $scope.item.dataTarif.prosedur_non_bedah,
                                "prosedur_bedah": $scope.item.dataTarif.prosedur_bedah, //"20000000",      
                                "konsultasi": $scope.item.dataTarif.konsultasi, //"300000",      
                                "tenaga_ahli": $scope.item.dataTarif.tenaga_ahli, //"200000",      
                                "keperawatan": $scope.item.dataTarif.keperawatan, // "80000",      
                                "penunjang": $scope.item.dataTarif.penunjang, //"1000000",      
                                "radiologi": $scope.item.dataTarif.radiologi, //"500000",      
                                "laboratorium": $scope.item.dataTarif.laboratorium, //"600000",      
                                "pelayanan_darah": $scope.item.dataTarif.pelayanan_darah, //"150000",      
                                "rehabilitasi": $scope.item.dataTarif.rehabilitasi, //"100000",      
                                "kamar": $scope.item.dataTarif.kamar, //"6000000",      
                                "rawat_intensif": $scope.item.dataTarif.rawat_intensif, //"2500000",      
                                "obat": $scope.item.dataTarif.obat, //"2000000",  
                                "obat_kronis": $scope.item.dataTarif.obat_kronis,
                                "obat_kemoterapi": $scope.item.dataTarif.obat_kemoterapi,
                                "alkes": $scope.item.dataTarif.alkes, //"500000",      
                                "bmhp": $scope.item.dataTarif.bmhp, //"400000",      
                                "sewa_alat": $scope.item.dataTarif.sewa_alat, //"210000"    
                            },
                            "pemulasaraan_jenazah": 0,
                            "kantong_jenazah": 0,
                            "peti_jenazah": 0,
                            "plastik_erat": 0,
                            "desinfektan_jenazah": 0,
                            "mobil_jenazah": 0,
                            "desinfektan_mobil_jenazah": 0,
                            "covid19_status_cd": "0",
                            "nomor_kartu_t": $scope.item.data[0].noidentitas,
                            "episodes": null,
                            "covid19_cc_ind": "",
                            "tarif_poli_eks": "",
                            "nama_dokter": $scope.item.data[0].namadokter, //"RUDY, DR",    
                            "kode_tarif": "DP",
                            "payor_id": $scope.item.data[0].kodejaminan, //"3",    
                            "payor_cd": $scope.item.data[0].jaminan,
                            "cob_cd": "#",
                            // "coder_nik": '123123123123' //"123123123123"
                            "coder_nik": $scope.dataLogin.noIdentitas,
                        }
                    }
                    dt2.push(dt1)
                    var objData = {
                        "data": dt2
                    }
                    medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                        var dt1 = {}
                        var dt2 = []
                        dt1 = {
                            "metadata": {
                                "method": "grouper",
                                "stage": "1"
                            },
                            "data": {
                                // "nomor_sep": dataSave[i].nomor_sep 
                                "nomor_sep": set.nosep
                            }
                        }
                        dt2.push(dt1)
                        var objData = {
                            "data": dt2
                        }
                        var totaldijamin = "";
                        var hakkelas = "";
                        var biayanaikkelas = "0";
                        medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                            responData = e.data.dataresponse;
                            if (responData[0].dataresponse.response_inagrouper != undefined) {
                                if (responData[0].dataresponse.response_inagrouper.drg_code == 3600019) {
                                    toastr.info(responData[0].dataresponse.response_inagrouper.drg_description, 'INACBG');
                                    $scope.isRouteLoading = false;
                                    $scope.showUnrelated = true
                                    return
                                }
                            }
                            toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                            toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
                            if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
                                toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
                            }

                            hakkelas = responData[0].dataresponse.response.kelas
                            if (hakkelas == "kelas_1") {
                                totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
                            } else if (hakkelas == "kelas_2") {
                                totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
                            } else if (hakkelas == "kelas_3") {
                                totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
                            }
                            // if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
                            if ($scope.item.datanaikkelas[0].statusnaikkelas != '0') {
                                biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
                                if (biayanaikkelas < 0) {
                                    biayanaikkelas = 0
                                }
                            }
                            $scope.totalInacbg = $scope.formatRupiah(totaldijamin, 'Rp. ')
                            $scope.totalTarifNaikKelas = $scope.formatRupiah(biayanaikkelas, 'Rp. ')
                            $scope.cbgcode = responData[0].dataresponse.response.cbg.code
                            $scope.cbgdescription = responData[0].dataresponse.response.cbg.description
                            var dataproposi = {
                                "noregistrasifk": $scope.item.data[0].noregistrasifk,
                                "totalDijamin": totaldijamin,
                                "biayaNaikkelas": biayanaikkelas,
                                "cbgcode": $scope.cbgcode,
                                "cbgdescription": $scope.cbgdescription
                            }
                            medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
                                //ini untuk proposional kan utang per tindakan
                            })
                            $scope.isRouteLoading = false;
                            // setdetail(set);
                            if (responData[0].dataresponse.special_cmg_option.length > 0) {
                                toastr.info('Terdeteksi Top-up CMG Options')
                                // dataSEPCMG = responData[0].datarequest.data.nomor_sep
                                var responOptions = responData[0].dataresponse.special_cmg_option
                                var spesialDrugx = []
                                var specialProcedurex = []
                                var specialProsthesisx = []
                                var specialInvestigationx = []
                                $scope.tabelTopup = true
                                $scope.showGrouping = false
                                for (let i = 0; i < responOptions.length; i++) {
                                    const element = responOptions[i];
                                    if (element.type == 'Special Drug') {
                                        spesialDrugx.push(element)
                                        $scope.specialDrug = true
                                    }
                                    if (element.type == 'Special Procedure') {
                                        specialProcedurex.push(element)
                                        $scope.specialProcedure = true
                                    }
                                    if (element.type == 'Special Prosthesis') {
                                        specialProsthesisx.push(element)
                                        $scope.specialProsthesis = true
                                    }
                                    if (element.type == 'Special Investigation') {
                                        specialInvestigationx.push(element)
                                        $scope.specialInvestigation = true
                                    }
                                }
                                $scope.listspecialdrug = spesialDrugx
                                $scope.listspecialprocedure = specialProcedurex
                                $scope.listspecialprosthesis = specialProsthesisx
                                $scope.listspecialinvestigation = specialInvestigationx
                            }
                            $scope.isRouteLoading = false;
                            $scope.setdetail(set);
                        })
                    })

                }
            }
            $scope.clickTopup = function () {
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
                        "nomor_sep": set.nosep,
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
                    if (set.tipe == "RJ") {
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

                        biayanaikkelas = Number($scope.item.data[0].biayanaikkelas)
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
                        "noregistrasifk": $scope.item.data[0].noregistrasifk,
                        "totalDijamin": totaldijamin,
                        "biayaNaikkelas": biayanaikkelas,
                        "cbgcode": $scope.cbgcode,
                        "cbgdescription": $scope.cbgdescription
                    }
                    medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
                        // ini untuk proposional kan utang penjamin per tindakan
                    })
                })
            }
            $scope.clickSendClaim = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "send_claim_individual"
                    },
                    "data": {
                        "nomor_sep": set.nosep
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
                        "noregistrasifk": $scope.item.data[0].noregistrasifk,
                        "status": "SEND CLAIM"
                    }
                    if (responData[0].dataresponse.metadata.code == "200") {
                        medifirstService.post('bridging/inacbg/update-status-bridging-inacbg', datasend).then(function (e) {
                            //ini untuk proposional kan utang per tindakan
                        })
                    }
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                })
            }
            $scope.clickFinal = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "claim_final"
                    },
                    "data": {
                        "nomor_sep": set.nosep, //dataSave[i].nomor_sep,      
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
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                })
            }
            $scope.clickCetakClaim = function () {
                var dt1 = {}
                var dt2 = []
                // for (var i = dataSave.length - 1; i >= 0; i--) {
                dt1 = {
                    "metadata": {
                        "method": "claim_print"
                    },
                    "data": {
                        "nomor_sep": set.nosep
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
            $scope.clickEditClaim = function () {
                var dt1 = {}
                var dt2 = []
                dt1 = {
                    "metadata": {
                        "method": "reedit_claim"
                    },
                    "data": {
                        "nomor_sep": set.nosep, //dataSave[i].nomor_sep,      
                    }
                }
                dt2.push(dt1)


                var objData = {
                    "data": dt2
                }
                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                    // response oke saja
                    responData = e.data.dataresponse;
                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                    responData = e.data.dataresponse;
                    var datasend = {
                        "noregistrasifk": $scope.item.data[0].noregistrasifk,
                        "status": "EDIT CLAIM"
                    }
                    if (responData[0].dataresponse.metadata.code == "200") {
                        medifirstService.post('bridging/inacbg/update-status-bridging-inacbg', datasend).then(function (e) {
                            //ini untuk proposional kan utang per tindakan
                        })
                    }
                })
            }

        }
    ]);
});