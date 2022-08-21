define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RegistrasiPasienMutasiCtrl', ['$scope', 'ModelItem', '$state', '$rootScope', 'CacheHelper', 'DateHelper', 'CetakHelper', 'ModelItem', 'MedifirstService',
        function ($scope, modelItem, $state, $rootScope, cacheHelper, dateHelper, cetakHelper, ModelItem, medifirstService) {
            $scope.now = new Date();
            $scope.currentNoCm = $state.params.noCm;
            $scope.currentNorec = $state.params.noRec;
            $scope.currentNorecAntrian = $state.params.noRecAntrian;
            var responData = '';
            var norecPD = '';
            var noRegistrasis = '';
            var norecAPD = '';
            var noCM = '';
            $scope.isSimpanAsuransi = true;
            $scope.isNext = true;
            $scope.item = {};
            $scope.item.tglRegistrasi = $scope.now;
            $scope.model = {};
            $scope.model.tglSEP = $scope.now;
            $scope.model.tglRujukan = $scope.now;
            var sensus = null;
            $scope.model.tglPelayanan = $scope.now;
            $scope.isPasienBpjs = false
            $scope.isBpjsRJ = false
            $scope.isBpjsRJsep = false
            var ppkRumahSakit = "0119R004"
            var namappkRumahSakit = "RS BHAYANGKARA TK IV CIANJUR"
            $scope.istempatLaporan = true;
            var dirawat = 0;
            var kunjungan = 0;
            $scope.listLakaLantas = [
                { "id": "0", "name": "Tidak Lakalantas" },
                { "id": "1", "name": "Ya Lakalantas" }
            ];
            $scope.listJenisKontrol = [
                { "id": "1", "name": "Rencana Kontrol" },
                { "id": "2", "name": "SPRI" }
            ];
            loadCache()


            function getDataDPJP() {
                medifirstService.get('registrasi/get-jumlahpasien-dokterdpjp').then(function (e) {
                    var array = e.data.data
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        element.no = i + 1
                    }
                    $scope.dataGridResepExist = new kendo.data.DataSource({
                        data: array,
                        pageSize: 10
                    });
                });
            }

            function loadCache() {
                var noregistrasiCache = cacheHelper.get('cacheNoRegMutasi')
                if (noregistrasiCache != undefined) {
                    noRegistrasis = noregistrasiCache
                    getPemakaianAsuransiByNoReg(noRegistrasis)
                } else {
                    cacheHelper.set('cacheNoRegMutasi', undefined)
                    noRegistrasis = ''
                }
                getDataDPJP();
            }
            $scope.cekpenanggungJawab = function (data) {
                if (data === true) {

                } else if (data === false || data === undefined) {

                } else {
                    return;
                }
            }

            // $scope.model.rawatInap = true;
            // $scope.cekRawatInap($scope.model.rawatInap);

            medifirstService.get("registrasi/get-data-combo-new", true)
                .then(function (dat) {
                    $scope.listJenisPelayanan = dat.data.jenispelayanan;
                    $scope.listKelas = dat.data.kelas;

                    $scope.listAsalRujukan = dat.data.asalrujukan;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    // $scope.listDokter = dat.data.dokter;
                    $scope.listRuangan = dat.data.ruanganranap;

                    $scope.sourceHubunganPasien = dat.data.hubunganpeserta;
                    $scope.sourceKelompokPasien = dat.data.kelompokpasien;
                    // $scope.sourceRekanan= dat.data.rekanan;
                    $scope.sourceKelasDitanggung = dat.data.kelas;
                    $scope.sourceAsalRujukan = dat.data.asalrujukan;
                    $scope.model.namaPenjamin = { id: dat.data.kelompokpasien[1].id, kelompokpasien: dat.data.kelompokpasien[1].kelompokpasien }
                    // $scope.model.institusiAsalPasien={id:dat.data.rekanan[689].id,namarekanan:dat.data.rekanan[689].namarekanan}
                    $scope.model.hubunganPeserta = { id: dat.data.hubunganpeserta[2].id, hubunganpeserta: dat.data.hubunganpeserta[2].hubunganpeserta }
                    $scope.model.asalRujukan = { id: dat.data.asalrujukan[3].id, asalrujukan: dat.data.asalrujukan[3].asalrujukan }
                });
            medifirstService.getPart('registrasi/get-dokter-part', true, 10).then(function (e) {
                $scope.listDokter = e;
            })

            loadPertama();

            function loadPertama() {

                var cachePasienDaftar = cacheHelper.get('CacheRegistrasiPasien');
                if (cachePasienDaftar != undefined) {
                    var arrPasienDaftar = cachePasienDaftar.split('~');
                    norecPD = arrPasienDaftar[0];
                    noRegistrasis = arrPasienDaftar[1];
                    norecAPD = arrPasienDaftar[2];

                    $scope.cacheNorecPD = norecPD;
                    $scope.cacheNorecAPD = norecAPD;
                    $scope.cacheNoRegistrasi = noRegistrasis;
                    medifirstService.get("registrasi/get-pasienbynorec-pd?norecPD=" + $scope.cacheNorecPD + "&norecAPD="
                        // manageServicePhp.getDataTableTransaksi("registrasipasien/get-pasien-bynorec/"+ $scope.cacheNorecPD+"/"
                        +
                        $scope.cacheNorecAPD)
                        .then(function (his) {
                            var his = his.data
                            // $scope.item.tglRegistrasi = his.data.data[0].tglregistrasi,
                            $scope.item.ruangan = {
                                id: his.data[0].objectruanganlastfk,
                                namaruangan: his.data[0].namaruangan,
                            }
                            $scope.item.kelas = { id: his.data[0].objectkelasfk, namakelas: his.data[0].namakelas }
                            $scope.listKamar = ([{ id: his.data[0].objectkamarfk, namakamar: his.data[0].namakamar }])
                            $scope.item.kamar = { id: his.data[0].objectkamarfk, namakamar: his.data[0].namakamar }
                            $scope.listNoBed = ([{ id: his.data[0].objecttempattidurfk, reportdisplay: his.data[0].reportdisplay }])
                            $scope.item.nomorTempatTidur = { id: his.data[0].objecttempattidurfk, reportdisplay: his.data[0].reportdisplay }
                            $scope.item.asalRujukan = { id: his.data[0].objectasalrujukanfk, asalrujukan: his.data[0].asalrujukan }
                            $scope.item.kelompokPasien = { id: his.data[0].objectkelompokpasienlastfk, kelompokpasien: his.data[0].kelompokpasien }
                            $scope.item.rekanan = { id: his.data[0].objectrekananfk, namarekanan: his.data[0].namarekanan }
                            // $scope.listJenisPelayanan =([ {id:parseInt(his.data[0].objectjenispelayananfk),jenispelayanan:his.data[0].jenispelayanan}])
                            // $scope.item.jenisPasien = {id:parseInt(his.data[0].objectjenispelayananfk),jenispelayanan:his.data[0].jenispelayanan}      
                            $scope.item.dokter = { id: his.data[0].objectpegawaifk, namalengkap: his.data[0].dokter }
                            $scope.item.jaminankhusus = { id: his.data.data[0].objectjaminankhusus, namaexternal: his.data.data[0].namaexternal }
                            $scope.item.tglcsr = his.data.data[0].tglcsr

                            $scope.isInputAsuransi = true;
                            $scope.isNext = false;
                            $scope.isBatal = true;
                            $scope.isReport = true;
                            $scope.isReportPendaftaran = true;

                            $scope.isReportRawatInap = true;

                            $scope.isSimpan = true;
                            $scope.isAsuransi = true;
                        });

                } else
                    getPasienByNorecPD();


                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/get-pasienbynocm?noCm=" + $scope.currentNoCm)
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasien = e.data.data[0];
                        dirawat = e.data.data[0].dirawat;
                        kunjungan = e.data.data[0].kunjungan;
                        if (e.data.data[0].foto == null)
                            $scope.item.pasien.foto = "../app/images/avatar.jpg"
                        var now = new Date();
                        var umur = dateHelper.CountAge(new Date($scope.item.pasien.tgllahir), now);
                        $scope.item.pasien.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        $scope.item.nocmfk = e.data.data[0].nocmfk;
                        $scope.model.noKepesertaan = e.data.data[0].nobpjs;
                        $scope.model.noTelpons = e.data.data[0].notelepon;
                    });


            };
            $scope.cariRujukanMulti = function () {
                $scope.isRouteLoading = true;
                var jenisFaskes = "rs"
                if ($scope.item.asalRujukan.id != undefined) {
                    if ($scope.item.asalRujukan.id == 1)
                        jenisFaskes = "pcare"
                    if ($scope.item.asalRujukan.id == 2)
                        jenisFaskes = "rs"
                }
                var loskanBayi = false;
                if ($scope.model.noKepesertaan != undefined) {
                    if ($scope.item.pasien.namatitle == 'By') {
                        if ($scope.model.noKepesertaan != "")
                            loskanBayi = true
                    }
                } else {
                    if ($scope.item.pasien.namatitle == 'By')
                        loskanBayi = false
                }
                if (loskanBayi == true) {
                    medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.isBpjsRJsep = true
                            $scope.model.noRujukan = $scope.model.skdp
                            var tglLahir = new Date(e.data.response.peserta.tglLahir);
                            $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                            $scope.model.namaPeserta = e.data.response.peserta.nama;
                            $scope.model.tglLahir = tglLahir;
                            $scope.model.noIdentitas = e.data.response.peserta.nik;
                            $scope.model.kelasBridg = {
                                id: parseInt(e.data.response.peserta.hakKelas.kode),
                                kdKelas: e.data.response.peserta.hakKelas.kode,
                                nmKelas: e.data.response.peserta.hakKelas.keterangan,
                                namakelas: e.data.response.peserta.hakKelas.keterangan,
                            };
                            if ($scope.model.kelasBridg.id == 1) {
                                $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                            } else if ($scope.model.kelasBridg.id == 2) {
                                $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                            } else if ($scope.model.kelasBridg.id == 3) {
                                $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                            }
                            $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                            $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                            $scope.model.faskesRujukan = false;
                            $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                            $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                            toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                            if (e.data.response.peserta.statusPeserta.kode == 6) {
                                $scope.penjagaanTidakDitanggung = true
                            }

                            $scope.isPemberiSurat = true
                            $scope.model.lakalantas = $scope.listLakaLantas[0]
                            $scope.isCheckSEP = true;
                            $scope.model.lakalantas = false;
                            $scope.model.generateNoSEP = true

                            medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                                "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=INT").then(function (data) {
                                    $scope.isRouteLoading = false;
                                    if (data.data.metaData.code == 200) {
                                        $scope.listDPJP = data.data.response.list;
                                        $scope.listDPJP2 = data.data.response.list;
                                    } else
                                        toastr.info('Dokter DPJP tidak ada', 'Info')
                                });
                            // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                            medifirstService.get("bridging/bpjs2/get-rujukan-" + jenisFaskes + "-nokartu-multi?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                                if (e.data.metaData.code === "200") {
                                    e.data.response.rujukan.sort((a, b) => new Date(b.tglKunjungan).getTime() - new Date(a.tglKunjungan).getTime());
                                    for (var i = 0; i < e.data.response.rujukan.length; i++) {
                                        e.data.response.rujukan[i].no = i + 1;
                                    };
                                    $scope.sourceNoRujukanMulti = new kendo.data.DataSource({
                                        data: e.data.response.rujukan,
                                        pageSize: 10,
                                        total: e.data.response.rujukan.length,
                                        serverPaging: false,
                                        schema: {
                                            model: {
                                                fields: {}
                                            }
                                        }
                                    });
                                    $scope.popupRujukan.center().open();
                                    $scope.showPilihNomor = true;

                                } else {
                                    toastr.error(e.data.metaData.message, 'Info');
                                    // window.messageContainer.error(e.data.metaData.message);
                                }
                                $scope.isLoadingNoKartu = false;
                            }, function (err) {
                                $scope.isLoadingNoKartu = false;
                                $scope.isRouteLoading = false;
                            });
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isRouteLoading = false;
                    }, function (err) {
                        $scope.isRouteLoading = false;
                    });
                } else {
                    $scope.isRouteLoading = false;
                    $scope.isBpjsRJsep = true
                    $scope.isPemberiSurat = true
                    $scope.model.lakalantas = $scope.listLakaLantas[0]
                    $scope.isCheckSEP = true;
                    $scope.model.lakalantas = false;
                    $scope.model.generateNoSEP = false
                    // $scope.model.noKepesertaan = "0000000000000";
                }
            }
            $scope.ringkasanInOut = function () {
                $scope.cetakJasper();
            }
            $scope.cetakJasper = function () {
                debugger
                var pegawai = medifirstService.getPegawai();
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "noregistrasi", "pegawai"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", noRegistrasis, pegawai.namaLengkap], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/lembarmasukranapunand.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/lembarmasukranapunand.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.columnNoRujukanMulti = {

                selectable: 'cell',
                pageable: true,
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "noKunjungan",
                        "title": "Nomor Rujukan",
                        "width": "150px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setRujukan(dataItem)\"  style=\"margin:0 0 5px\">#:  noKunjungan #</button> ",

                    },
                    {
                        "field": "poliRujukan.nama",
                        "title": "Nama Poli",
                        "width": "120px",
                    },
                    {
                        "field": "tglKunjungan",
                        "title": "Tanggal Dirujuk",
                        "width": "100px"
                    },
                    {
                        "field": "provPerujuk.kode",
                        "title": "Kode Asal Rujukan",
                        "width": "100px"
                    },
                    {
                        "field": "provPerujuk.nama",
                        "title": "Kode Asal Rujukan",
                        "width": "200px"
                    },

                ]
            };
            $scope.setRujukan = function (data) {
                if (data != undefined) {
                    $scope.model.noRujukan = data.noKunjungan;
                    $scope.popupRujukan.close()
                }
            }
            $scope.cekSuratKontrol = function (data) {
                if (data === true) {
                    $scope.model.cekNosuratKontrol = true
                    medifirstService.get("bridging/bpjs2/listsuratkontrol-berdasarkan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
                        debugger
                        $scope.popUpHistoriSuratKontrol.center().open()
                        $scope.dataSourceHistoriSuratKontrol = new kendo.data.DataSource({
                            data: data.data.response.list,
                            pageSize: 10,
                            total: data.data.response.list.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });

                    })
                } else {
                    delete $scope.model.skdp
                    delete $scope.model.dokterDPJP
                }
            }
            $scope.columnHistoriSuratKontrol = {

                selectable: 'cell',
                pageable: true,
                columns: [{
                    "field": "tglRencanaKontrol",
                    "title": "Tanggal Rencana Kontrol",
                    "width": "130px",
                },
                {
                    "field": "noSuratKontrol",
                    "title": "No Surat Kontrol",
                    "width": "130px",

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setSuratKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  noSuratKontrol #</button> ",

                },
                {
                    "field": "namaJnsKontrol",
                    "title": "Jenis Kontrol",
                    "width": "100px"
                },
                {
                    "field": "namaPoliAsal",
                    "title": "Poli Asal",
                    "width": "100px"
                },
                {
                    "field": "namaPoliTujuan",
                    "title": "Poli Tujuan",
                    "width": "90px"
                },
                {
                    "field": "namaDokter",
                    "title": "Dokter Tujuan",
                    "width": "90px"
                },
                {
                    "field": "terbitSEP",
                    "title": "Sudah Dipakai",
                    "width": "90px"
                },
                {
                    "title": "Edit Tanggal Surat Kontrol",
                    "width": "90px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setEditSuratKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  'Edit' #</button> ",
                },
                {
                    "title": "Cetak",
                    "width": "90px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"cetakKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  'Cetak' #</button> ",
                },
                ]
            };
            $scope.cetakKontrol = function (x) {
                debugger
                if (x.jnsKontrol == '1') {
                    medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + x.noKartu + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $("#noSPRIx").text(x.noSuratKontrol);
                            $("#nokartuSPRI").text(x.noKartu);
                            $("#namapesertaSPRI").text(x.nama);
                            $("#tgllahirSPRI").text(moment(e.data.response.peserta.tglLahir).format('YYYY-MM-DD'));
                            $("#diagnosa").text('');
                            $("#rencanainapSPRI").text(x.tglRencanaKontrol);
                            $("#tglcetakSPRI").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));

                            var printdata = document.getElementById('spri');
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
                            var printdata = document.getElementById('spri');
                            printdata = printdata.innerHTML;
                            printdata = htmlStart + printdata + htmlEnd;
                            // var editor = $("#editor").data("kendoEditor");
                            // editor.value(printdata);

                            // var cetakan=htmlStart + printableContent + htmlEnd;
                            var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                            WindowObject.document.writeln(printdata);
                            WindowObject.document.close();
                            WindowObject.focus();
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isRouteLoading = false;
                    }, function (err) {
                        $scope.isRouteLoading = false;
                    });
                } else {
                    medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + x.noSuratKontrol).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $("#noKontrolx").text(e.data.response.noSuratKontrol);
                            $("#nokartuKontrol").text(e.data.response.sep.peserta.noKartu);
                            $("#namapesertaKontrol").text(e.data.response.sep.peserta.nama);
                            $("#tgllahirKontrol").text(e.data.response.sep.peserta.tglLahir);
                            $("#diagnosaKontrol").text(e.data.response.sep.diagnosa);
                            $("#rencanakontrol").text(e.data.response.tglRencanaKontrol);
                            $("#tglcetakKontrol").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));
                            $("#dpjptujKontrol").text(e.data.response.namaDokter);
                            $("#subspetujKontrol").text('Sp./Sub.' + e.data.response.namaPoliTujuan);
                            if (e.data.response.namaDokterPembuat == null) {
                                $("#dpjppemberiSurat").text(e.data.response.namaDokter);
                            } else {
                                $("#dpjppemberiSurat").text(e.data.response.namaDokterPembuat);
                            }


                            var printdata = document.getElementById("kontrol");
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
                            var printdata = document.getElementById("kontrol");
                            printdata = printdata.innerHTML;
                            printdata = htmlStart + printdata + htmlEnd;
                            // var editor = $("#editor").data("kendoEditor");
                            // editor.value(printdata);

                            // var cetakan=htmlStart + printableContent + htmlEnd;
                            var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                            WindowObject.document.writeln(printdata);
                            WindowObject.document.close();
                            WindowObject.focus();
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingNoKartu = false;
                    }, function (err) {
                        $scope.isLoadingNoKartu = false;
                    });
                }

            }
            $scope.simpanEditSuratKontrol = function () {
                debugger
                var dataSend = {
                    data: {
                        request: {
                            noSuratKontrol: $scope.item.noSuratKontrolEdit,
                            noSEP: $scope.item.noSepEdit,
                            kodeDokter: $scope.item.dokterTujuanEdit.kode,
                            poliKontrol: $scope.item.kodepoliTujuanEdit,
                            tglRencanaKontrol: moment($scope.item.tanggalRencanaKontrol).format('YYYY-MM-DD'),
                            user: "Coba Ws"
                        }
                    }
                };

                medifirstService.putNonMessage("bridging/bpjs2/update-rencana-kontrol-v2", dataSend).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        window.messageContainer.info(e.data.metaData.message)
                        // document.getElementById("jsonUpdateRencanaKontrol").innerHTML = JSON.stringify(e.data, undefined, 4);
                    } else {
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }
            $scope.setEditSuratKontrol = function (x) {
                if (x.terbitSEP == 'Sudah') {
                    window.messageContainer.error('Surat Kontrol Ini Sudah Terpakai, Tidak Bisa Di Edit');
                    return
                }

                $scope.popUpHistoriSuratKontrol.close()
                $scope.popUpEditSuratKontrol.center().open()
                $scope.item.noSuratKontrolEdit = x.noSuratKontrol
                $scope.item.noSepEdit = x.noSepAsalKontrol
                // $scope.item.dokterTujuanEdit = x.namaDokter
                // $scope.item.kodedokterTujuanEdit = x.kodeDokter
                $scope.item.poliTujuanEdit = x.namaPoliTujuan
                $scope.item.kodepoliTujuanEdit = x.poliTujuan
                $scope.item.tanggalRencanaKontrol = x.tglRencanaKontrol

                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2 +
                    "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + $scope.item.kodepoliTujuanEdit).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            $scope.listDPJPTujuanEdit = data.data.response.list;
                            $scope.item.dokterTujuanEdit = { kode: x.kodeDokter, nama: x.namaDokter }
                        } else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
            }
            $scope.setSuratKontrol = function (dataHistorySuratKontrolSelect) {
                $scope.popUpHistoriSuratKontrol.close()
                if (dataHistorySuratKontrolSelect.jnsKontrol == 1) {
                    $scope.model.skdp = dataHistorySuratKontrolSelect.noSuratKontrol
                    $scope.model.noRujukan = dataHistorySuratKontrolSelect.noSuratKontrol
                    $scope.model.dokterDPJP = { kode: dataHistorySuratKontrolSelect.kodeDokter, nama: dataHistorySuratKontrolSelect.namaDokter }
                } else {
                    medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + dataHistorySuratKontrolSelect.noSuratKontrol).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            $scope.model.skdp = e.data.response.noSuratKontrol
                            $scope.model.dokterDPJP = { kode: e.data.response.kodeDokterPembuat, nama: e.data.response.namaDokterPembuat }
                            $scope.insert.poli = { kode: e.data.response.poliTujuan, nama: e.data.response.namaPoliTujuan }
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                        $scope.isLoadingNoKartu = false;
                    }, function (err) {
                        $scope.isLoadingNoKartu = false;
                    });
                }
            }

            function getPasienByNorecPD() {
                medifirstService.get("registrasi/get-pasienbynorec-pd?norecPD=" + $scope.currentNorec + "&norecAPD=" + $scope.currentNorecAntrian)
                    .then(function (his) {
                        $scope.item.historyPasien = his.data.data[0];


                    });
            }

            $scope.$watch('model.rawatInap', function (data) {
                if (!data) return;
                $scope.cekRawatInap(data);
            })

            $scope.pilihRuangan = function (id) {
                // get ruangan with condition (rawat jalan or rawat inap)
                // if ($scope.model.rawatInap === true) {
                var ruanganId = id;
                $scope.item.kelas = ""
                $scope.item.kamar = ""
                $scope.item.nomorTempatTidur = ""
                debugger;
                medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function (dat) {
                        $scope.listKelas = dat.data.kelas;

                    });
                // }
            }
            $scope.$watch('item.kelas', function (e) {
                if (e === undefined) return;
                var kelasId = "idKelas=" + $scope.item.kelas.id;
                var ruanganId = "&idRuangan=" + $scope.item.ruangan.id;
                $scope.item.kamar = ""
                $scope.item.nomorTempatTidur = ""
                medifirstService.get("registrasi/get-kamarbyruangankelas?" + kelasId + ruanganId)
                    .then(function (b) {

                        if ($scope.model.rawatGabung) {
                            $scope.listKamar = b.data.kamar;
                        } else {
                            $scope.listKamar = _.filter(b.data.kamar, function (v) {
                                return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
                            })
                        }
                    });
            });
            $scope.$watch('item.kamar', function (e) {
                if (e === undefined) return;
                var kamarId = $scope.item.kamar.id;
                $scope.item.nomorTempatTidur = ""
                medifirstService.get("registrasi/get-nobedbykamar?idKamar=" + kamarId)
                    .then(function (a) {
                        if ($scope.model.rawatGabung) {
                            $scope.listNoBed = a.data.bed;
                        } else {
                            $scope.listNoBed = _.filter(a.data.bed, function (v) {
                                return v.statusbed === "KOSONG";
                            })
                        }
                    })
            });



            $scope.$watch('item.kelompokPasien', function (e) {
                if (e === undefined) return;
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (z) {
                        $scope.listRekanan = z.data.rekanan;
                        if (e.kelompokpasien == 'Umum/Pribadi') {
                            $scope.item.rekanan = '';
                            $scope.nonUmum = false;
                            $scope.isPasienBpjs = false
                            $scope.isBpjsRJ = false
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }
                        } else if (e.kelompokpasien == 'BPJS') {
                            $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            $scope.nonUmum = true;
                            $scope.isPasienBpjs = true
                            $scope.isBpjsRJ = true
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }

                        } else {
                            $scope.nonUmum = true;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }
                            // $scope.item.rekanan='';

                        }

                    })
            });

            $scope.ListAsuransi = [
                { "id": "1", "name": "No. SEP Otomatis" }
            ];


            $scope.noCm = $state.params.noCm;
            $scope.cekRawatGabung = function (data) {
                // opsi untuk pasien bayi
                // apakah pasien bayi satu ruangan dengan ibunya (true/false) ?
                $scope.model.rawatGabung = data;
            }
            $scope.cekRawatTitipan = function (data) {
                $scope.model.rawatTitipan = data;
            }
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm", //set drop down time format to 24 hours
            };
            // $scope.jenisPasiens = [{
            //     id: 1, name: "Reguler"
            // }, {
            //     id: 2, name: "Eksekutif"
            // }]
            $scope.pegawai = modelItem.getPegawai();

            $scope.listPasien = [];
            $scope.doneLoad = $rootScope.doneLoad;
            $scope.showFind = true;
            $scope.showTindakan = false;
            $scope.dataModelGrid = [];
            $scope.item.kp = 1
            // $scope.Save = function(){
            //     $scope.popUpKasusPenyakit.center().open()
            // }
            $scope.pegawaiLogin = medifirstService.getPegawaiLogin();

            function getPemakaianAsuransiByNoReg(noreg) {
                medifirstService.get("registrasi/get-history-pemakaianasuransi-new?noregistrasi="
                    // +$scope.item.pasien.noregistrasi
                    +
                    noreg
                )
                    .then(function (x) {
                        if (x.data.data.length > 0) {
                            $scope.cacheIdAP = x.data.data[0].norec_ap;
                            $scope.cacheNorecPA = x.data.data[0].norec;
                            if (x.data.data[0].objectkelompokpasienlastfk == 2) {
                                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + x.data.data[0].nosep).then(function (e) {
                                    if (e.data.metaData.code === "200") {
                                        $scope.insert.poli = { kode: x.data.data[0].polirujukankode, nama: e.data.response.poli }
                                        medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 1 +
                                            "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" +
                                            $scope.insert.poli.kode).then(function (z) {
                                                if (z.data.metaData.code == 200) {
                                                    $scope.listDPJP2 = z.data.response.list;
                                                    $scope.listDPJP = z.data.response.list;
                                                } else
                                                    toastr.info('Dokter DPJP tidak ada', 'Info')
                                            });
                                    } else {
                                        window.messageContainer.error(e.data.metaData.message);
                                    }
                                    $scope.isLoadingSEP = false;
                                }, function (err) {
                                    $scope.isLoadingSEP = false;
                                });
                            }
                            $scope.model.noKepesertaan = x.data.data[0].nokepesertaan
                            $scope.model.namaPeserta = x.data.data[0].namapeserta
                            $scope.model.noIdentitas = x.data.data[0].noidentitas
                            $scope.model.jenisPeserta = x.data.data[0].jenisPeserta
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');
                            $scope.model.hubunganPeserta = { id: x.data.data[0].objecthubunganpesertafk, hubunganpeserta: x.data.data[0].hubunganpeserta }
                            $scope.model.noSep = x.data.data[0].nosep
                            $scope.model.tglSEP = x.data.data[0].tanggalsep
                            $scope.model.kelasDitanggung = { id: x.data.data[0].objectkelasdijaminfk, namakelas: x.data.data[0].namakelas }
                            $scope.model.catatan = x.data.data[0].catatan
                            $scope.model.noRujukan = x.data.data[0].norujukan

                            // $scope.item.asalRujukan ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            if ($scope.model.rawatInap == true) {
                                if (x.data.data[0].norujukan != null && x.data.data[0].norujukan != '') {
                                    $scope.model.noRujukan = x.data.data[0].norujukan
                                } else {
                                    $scope.model.noRujukan = $scope.model.skdp
                                }
                                $scope.model.namaAsalRujukan = ppkRumahSakit + " - " + namappkRumahSakit
                            } else {
                                $scope.model.namaAsalRujukan = x.data.data[0].kdprovider + " - " + x.data.data[0].nmprovider
                            }
                            $scope.model.tglRujukan = x.data.data[0].tglrujukan
                            if (x.data.data[0].objectdiagnosafk)
                                $scope.model.diagnosa = { id: x.data.data[0].objectdiagnosafk, kddiagnosa: x.data.data[0].kddiagnosa, nama: x.data.data[0].kddiagnosa + ' - ' + x.data.data[0].namadiagnosa }
                            $scope.model.tglLahir = x.data.data[0].tgllahir
                            $scope.item.kelompokPasien = { id: x.data.data[0].objectkelompokpasienlastfk, kelompokpasien: x.data.data[0].kelompokpasien }
                            // $scope.model.institusiAsalPasien ={id:x.data.data[0].kdpenjaminpasien,namarekanan:x.data.data[0].namarekanan}
                            $scope.model.institusiAsalPasien = { id: x.data.data[0].objectrekananfk, namarekanan: x.data.data[0].namarekananpd }
                            $scope.model.lokasiLakaLantas = x.data.data[0].lokasilakalantas
                            $scope.model.jenisPeserta = x.data.data[0].jenispeserta
                            toastr.info($scope.model.jenisPeserta, 'Jenis Peserta Peserta');


                            if (x.data.data[0].lakalantas == 1) {
                                $scope.model.lakalantas = true
                                $scope.model.tglLakalantas = x.data.data[0].tglkejadian
                                if (x.data.data[0].kdpropinsi != null) {
                                    $scope.listPropinsi.add({ kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi });
                                    $scope.model.propinsi = { kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi }
                                }
                                dataKabupaten = { kode: x.data.data[0].kdkabupaten, nama: x.data.data[0].namakabupaten }
                                dataKecamatan = { kode: x.data.data[0].kdkecamatan, nama: x.data.data[0].namakecamatan }
                                $scope.model.keteranganLaka = x.data.data[0].keteranganlaka
                                if (x.data.data[0].suplesi == true) {
                                    $scope.model.suplesi = true
                                    $scope.model.nomorSepSuplesi = x.data.data[0].nosepsuplesi
                                }
                            }

                            if (x.data.data[0].penjaminlaka != '' && x.data.data[0].penjaminlaka != null) {
                                var penjaminsLaka = x.data.data[0].penjaminlaka.split(',')
                                penjaminsLaka.forEach(function (data) {
                                    $scope.listPenjaminLaka.forEach(function (e) {
                                        if (e.value == data) {
                                            e.isChecked = true
                                            var dataid = {
                                                "id": e.id,
                                                "name": e.name,
                                                "value": data
                                            }
                                            $scope.currentListPenjaminLaka.push(dataid)
                                        }
                                    })
                                })
                            }
                            $scope.model.skdp = x.data.data[0].nosuratskdp
                            // $scope.model.DPJPMelayani = x.data.data[0].cob
                            $scope.model.cob = x.data.data[0].cob
                            $scope.model.katarak = x.data.data[0].katarak
                        }
                    });
            }
            $scope.tambahData = function () {
                debugger
                // if (item == undefined) {
                $scope.statEdit = false;
                if ($scope.model.noKepesertaan == undefined) {
                    messageContainer.error("Isi Nomor Kartu BPJS!")
                }
                $scope.item.jenisKontrol = { "id": "2", "name": "SPRI" }
                $scope.item.tanggalRencakaKontrol = $scope.now;
                $scope.isControl = false
                $scope.isSPRI = true

                $scope.item.noPenunjang = $scope.model.noKepesertaan
                $scope.item.noBPJS = $scope.model.noKepesertaan
                delete $scope.item.noSuratKontrol
                delete $scope.item.poliKontrol
                delete $scope.item.kodeDokter
                $scope.popUpTambah.center().open();
            }
            $scope.setCetakSurat = function (v) {
                medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + v).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        debugger
                        if (e.data.response.namaJnsKontrol == 'Inap') {
                            $("#noSPRIx").text(e.data.response.noSuratKontrol);
                            $("#nokartuSPRI").text($scope.model.noKepesertaan);
                            $("#namapesertaSPRI").text($scope.item.pasien.namapasien);
                            $("#tgllahirSPRI").text(moment($scope.item.pasien.tgllahir).format('YYYY-MM-DD'));
                            $("#diagnosa").text('');
                            $("#rencanainapSPRI").text(e.data.response.tglRencanaKontrol);
                            $("#tglcetakSPRI").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));

                            var printdata = document.getElementById('spri');
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
                            var printdata = document.getElementById('spri');
                            printdata = printdata.innerHTML;
                            printdata = htmlStart + printdata + htmlEnd;
                            // var editor = $("#editor").data("kendoEditor");
                            // editor.value(printdata);

                            // var cetakan=htmlStart + printableContent + htmlEnd;
                            var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                            WindowObject.document.writeln(printdata);
                            WindowObject.document.close();
                            WindowObject.focus();
                        } else {
                            $("#noKontrolx").text(e.data.response.noSuratKontrol);
                            $("#nokartuKontrol").text(e.data.response.sep.peserta.noKartu);
                            $("#namapesertaKontrol").text(e.data.response.sep.peserta.nama);
                            $("#tgllahirKontrol").text(e.data.response.sep.peserta.tglLahir);
                            $("#diagnosaKontrol").text(e.data.response.sep.diagnosa);
                            $("#rencanakontrol").text(e.data.response.tglRencanaKontrol);
                            $("#tglcetakKontrol").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));
                            $("#dpjptujKontrol").text(e.data.response.namaDokter);
                            $("#subspetujKontrol").text('Sp./Sub.' + e.data.response.namaPoliTujuan);
                            $("#dpjppemberiSurat").text(e.data.response.namaDokterPembuat);

                            var printdata = document.getElementById('kontrol');
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
                            var printdata = document.getElementById('kontrol');
                            printdata = printdata.innerHTML;
                            printdata = htmlStart + printdata + htmlEnd;
                            // var editor = $("#editor").data("kendoEditor");
                            // editor.value(printdata);

                            // var cetakan=htmlStart + printableContent + htmlEnd;
                            var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                            WindowObject.document.writeln(printdata);
                            WindowObject.document.close();
                            WindowObject.focus();
                        }
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });
            }
            $scope.simpanTambah = function () {
                debugger
                if ($scope.item.jenisKontrol.id == 1) {
                    let tglSec = new Date($scope.item.tanggalRencakaKontrol);
                    let tglSecd = tglSec.getTime() / 1000;
                    if (tglSecd > $scope.item.tglRujukanSecond) {
                        toastr.error('No Surat Rujukan Sudah Tidak Aktif Pada Tanggal ' + moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'), 'Info');
                        return;
                    }
                }
                if ($scope.statEdit == true) {
                    $scope.simpanEdit();
                    return;
                }
                if ($scope.item.noPenunjang == undefined || $scope.item.noPenunjang == null || $scope.item.noPenunjang == '') {
                    toastr.error('no SEP Perujuk Kosong', 'Info');
                    return;
                }
                if ($scope.item.poliKontrol == undefined || $scope.item.poliKontrol == null || $scope.item.poliKontrol == '') {
                    toastr.error('Isi Poli', 'Info');
                    return;
                }
                if ($scope.item.kodeDokter == undefined || $scope.item.kodeDokter == null || $scope.item.kodeDokter == '') {
                    toastr.error('Isi Dokter', 'Info');
                    return;
                }
                $scope.isRouteLoading = true;

                if ($scope.item.jenisKontrol.id == 1) {
                    let dataSend = {
                        "data": {
                            "request": {
                                "noSEP": $scope.item.noPenunjang,
                                "kodeDokter": $scope.item.kodeDokter.kode,
                                "poliKontrol": $scope.item.poliKontrol.kode,
                                "tglRencanaKontrol": moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'),
                                "user": $scope.pegawai.namaLengkap
                                // "user": $scope.pegawai.tempatLahir
                            }
                        }
                    }
                    $scope.isRouteLoading = true;
                    medifirstService.postNonMessage("bridging/bpjs2/insert-rencana-kontrol-v2", dataSend).then(function (e) {
                        if (e.data.response) {
                            debugger
                            $scope.saveLogging('Input Rencana Kontrol', 'No Surat Rencana Kontrol', e.data.response.noSuratKontrol, 'Input Rencana Kontrol ' + e.data.response.noSuratKontrol + ' Ke Ruangan ' + $scope.item.poliKontrol.nama + ' Dengan Dokter ' + $scope.item.kodeDokter.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'))
                            $scope.isRouteLoading = false;
                            $scope.item.noSuratKontrol = e.data.response.noSuratKontrol
                            toastr.success('Generate Rencana Kontrol Success. No Rencana Kontrol : ' + e.data.response.noSuratKontrol, 'Status');
                            $scope.synchronizeKontrolAndSPRI();
                        } else {
                            $scope.isRouteLoading = false;
                            window.messageContainer.error(e.data.metaData.message)
                        }
                    }, function (err) {
                        $scope.isRouteLoading = false;
                    });
                } else {
                    let dataSend = {
                        "data": {
                            "request": {
                                "noKartu": $scope.item.noPenunjang,
                                "kodeDokter": $scope.item.kodeDokter.kode,
                                "poliKontrol": $scope.item.poliKontrol.kode,
                                "tglRencanaKontrol": moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'),
                                "user": $scope.pegawai.namaLengkap
                                // "user": $scope.pegawai.tempatLahir
                            }
                        }
                    }
                    $scope.isRouteLoading = true;
                    medifirstService.postNonMessage("bridging/bpjs2/insert-spri-v2", dataSend).then(function (e) {
                        if (e.data.response) {
                            debugger
                            $scope.saveLogging('Input SPRI', 'No Surat SPRI', e.data.response.noSPRI, 'Input SPRI ' + e.data.response.noSPRI + ' Ke Ruangan ' + $scope.item.poliKontrol.nama + ' Dengan Dokter ' + $scope.item.kodeDokter.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRencakaKontrol).format('YYYY-MM-DD'))
                            $scope.isRouteLoading = false;
                            $scope.item.noSuratKontrol = e.data.response.noSPRI
                            toastr.success('Generate SPRI Success. No SPRI : ' + e.data.response.noSPRI, 'Status');
                            $scope.synchronizeKontrolAndSPRI();
                        } else {
                            $scope.isRouteLoading = false;
                            window.messageContainer.error(e.data.metaData.message)
                        }
                    }, function (err) {
                        $scope.isRouteLoading = false;
                    });
                }
            }
            $scope.Save = function () {
                sensus = true;
                // $scope.popupPilihan.close();
                if ($scope.item.pasien.objecttitlefk != 4 && $scope.model.rawatGabung == true) {
                    alert('RAWAT GABUNG HANYA UNTUK PASIEN BAYI !')
                    return
                }
                if ($scope.item.kelas == undefined) {
                    toastr.error('Kelas harus di isi')
                    return
                }

                var kelasId = "";
                if ($scope.item.kelas == undefined) {
                    kelasId = null;
                } else
                    kelasId = $scope.item.kelas.id;

                var rekananId = null;
                if ($scope.item.rekanan != undefined)
                    rekananId = $scope.item.rekanan.id;
                if (rekananId == "581669" && $scope.item.kelas.id != 9 && $scope.item.kelas.id != 7 && $scope.item.kelas.id != 5) {
                    if (kelasId != "1" && kelasId != null) {
                        window.messageContainer.error("PASIEN PBI HANYA UNTUK KELAS III")
                        // $scope.hideBtnSimpan = false;
                        return
                    }
                }

                var dokterId = null;
                if ($scope.item.dokter != undefined)
                    dokterId = $scope.item.dokter.id;



                var kamarIds = "";
                if ($scope.item.kamar == undefined) {
                    kamarIds = null;
                } else
                    kamarIds = $scope.item.kamar.id;


                var nomorTempatTidurs = "";
                if ($scope.model.rawatGabung == true) {
                    nomorTempatTidurs = null;
                } else if ($scope.item.nomorTempatTidur == undefined || $scope.item.nomorTempatTidur == "") {
                    messageContainer.error("Nomor Tempat Tidur Harus Di isi / Bed Penuh")
                    return
                } else
                    nomorTempatTidurs = $scope.item.nomorTempatTidur.id;


                var tglcsr = null;
                var jaminankhusus = "";
                if ($scope.item.jaminankhusus == undefined || $scope.item.jaminankhusus == "") {
                    jaminankhusus = null
                } else {
                    jaminankhusus = $scope.item.jaminankhusus.id
                    tglcsr = moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss')
                }

                var jenisPel = "";
                if ($scope.item.jenisPasien != undefined)
                    jenisPel = $scope.item.jenisPasien.id
                else {
                    messageContainer.error("Jenis Pelayanan Harus Di isi")
                    return
                }
                debugger
                if ($scope.item.kelompokPasien.kelompokpasien.indexOf('BPJS') > -1) {
                    if ($scope.model.kelasDitanggung == undefined || $scope.model.kelasDitanggung == null || $scope.model.kelasDitanggung.id == undefined || $scope.model.kelasDitanggung.id == null || $scope.model.kelasDitanggung === '') {
                        toastr.error('Kelas Ditanggung Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                    if ($scope.model.generateNoSEP == false) {
                        $scope.SimpanNonGenerate();
                    } else {
                        $scope.generateSEP();
                    }
                } else {
                    $scope.SimpanRegistrasi();
                }
            }
            $scope.generateSEP = function () {
                if (!$scope.model.generateNoSEP) return;
                var listRawRequired = [
                    "item.pasien.namaruangan|k-ng-model|Ruangan",
                    // "item.asalRujukan|ng-model|Asal Rujukan",
                    "item.kelompokPasien|ng-model|Kelompok Pasien",
                    // "item.pegawai|ng-model|Dokter Tidak ada jadwal hari ini",
                    // "model.namaPenjamin|k-ng-model|Nama Penjamin",
                    "item.rekanan|ng-model|Institusi Asal Pasien",
                    "model.noKepesertaan|ng-model|No Kepesertaan",
                    "item.asalRujukan|k-ng-model|Asal Rujukan",
                    // "model.noRujukan|ng-model|No Rujukan",
                    "model.tglRujukan|ng-model|Tgl Rujukan",
                    "model.diagnosa|k-ng-model|Diagnosa",
                    "model.kelasDitanggung|k-ng-model|Kelas ditanggung"
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var kelasJaminan;
                    if ($scope.model.kelasDitanggung != undefined) {
                        if ($scope.model.kelasDitanggung.id == "1")
                            kelasJaminan = "3"
                        if ($scope.model.kelasDitanggung.id == "2")
                            kelasJaminan = "2"
                        if ($scope.model.kelasDitanggung.id == "3")
                            kelasJaminan = "1"
                    } else
                        kelasJaminan = "3"

                    var noKartu = "";
                    if ($scope.model.noKepesertaan != undefined) {
                        var noKartu = $scope.model.noKepesertaan;
                    } else {
                        var noKartu = '';
                    }

                    var kdPpkRujukan = "0119R004";
                    var kdJenisPelayanan = "1";
                    var poliTujuans = "";

                    var kddiagnosaawal = "";
                    if ($scope.model.diagnosa != undefined)
                        kddiagnosaawal = $scope.model.diagnosa.kddiagnosa;
                    else
                        kddiagnosaawal = "";

                    var catatan = "";
                    if ($scope.model.catatan != undefined)
                        catatan = $scope.model.catatan;
                    else
                        catatan = "";

                    var polisEksekutif = "";
                    if ($scope.model.poliEksekutif)
                        polisEksekutif = "1"
                    else
                        polisEksekutif = "0"

                    var lokasiLakaLantas = "";
                    if ($scope.model.lokasiLakaLantas != undefined)
                        lokasiLakaLantas = $scope.model.lokasiLakaLantas;
                    else
                        lokasiLakaLantas = "";


                    var noTelp = "";
                    if ($scope.model.noTelpons != undefined)
                        noTelp = $scope.model.noTelpons;
                    else
                        noTelp = "";

                    var KdAsalRujukan = "2";
                    // if ($scope.item.asalRujukan != undefined) {
                    //     if ($scope.item.asalRujukan.asalrujukan === "Puskesmas / Klinik") {
                    //         KdAsalRujukan = "1"
                    //     } else {
                    //         KdAsalRujukan = "2"
                    //     }
                    // }

                    var listPenjaminLakas = ""
                    if ($scope.model.lakalantas) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                            var c = $scope.currentListPenjaminLaka[i].value
                            b = "," + c
                            a = a + b
                        }
                        listPenjaminLakas = a.slice(1, a.length)
                    }
                    var kdPropinsi = ""
                    if ($scope.model.propinsi != undefined)
                        kdPropinsi = $scope.model.propinsi.kode

                    var kdKabupaten = ""
                    if ($scope.model.kabupaten != undefined)
                        kdKabupaten = $scope.model.kabupaten.kode

                    var kdKecamatan = ""
                    if ($scope.model.kecamatan != undefined)
                        kdKecamatan = $scope.model.kecamatan.kode

                    var dataSend = {
                        "data": {
                            "request": {
                                "t_sep": {
                                    "noKartu": noKartu,
                                    "tglSep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                                    "ppkPelayanan": ppkRumahSakit.trim(),
                                    "jnsPelayanan": kdJenisPelayanan,
                                    "klsRawat": {
                                        "klsRawatHak": kelasJaminan,
                                        "klsRawatNaik": "",
                                        "pembiayaan": "",
                                        "penanggungJawab": ""
                                    },
                                    "noMR": $scope.item.pasien.nocm,
                                    "rujukan": {
                                        "asalRujukan": KdAsalRujukan,
                                        "tglRujukan": new moment($scope.model.tglRujukan).format('YYYY-MM-DD'),
                                        "noRujukan": $scope.model.noRujukan === undefined ? "" : $scope.model.noRujukan,
                                        "ppkRujukan": kdPpkRujukan
                                    },
                                    "catatan": catatan,
                                    "diagAwal": kddiagnosaawal,
                                    "poli": {
                                        "tujuan": poliTujuans,
                                        "eksekutif": polisEksekutif
                                    },
                                    "cob": {
                                        "cob": $scope.model.cob === true ? "1" : "0"
                                    },
                                    "katarak": {
                                        "katarak": $scope.model.katarak === true ? "1" : "0"
                                    },
                                    "jaminan": {
                                        "lakaLantas": $scope.model.lakalantas === true ? "1" : "0",
                                        "penjamin": {
                                            "penjamin": listPenjaminLakas,
                                            "tglKejadian": new moment($scope.model.tglKejadian).format('YYYY-MM-DD'),
                                            "keterangan": $scope.model.keteranganLaka != undefined ? $scope.model.keteranganLaka : "",
                                            "suplesi": {
                                                "suplesi": $scope.model.suplesi === true ? "1" : "0",
                                                "noSepSuplesi": $scope.model.nomorSepSuplesi != undefined ? $scope.model.nomorSepSuplesi : "",
                                                "lokasiLaka": {
                                                    "kdPropinsi": kdPropinsi,
                                                    "kdKabupaten": kdKabupaten,
                                                    "kdKecamatan": kdKecamatan
                                                }
                                            }
                                        }
                                    },
                                    "tujuanKunj": "0",
                                    "flagProcedure": "",
                                    "kdPenunjang": "",
                                    "assesmentPel": "",
                                    "skdp": {
                                        "noSurat": $scope.model.skdp != undefined ? $scope.model.skdp : "",
                                        "kodeDPJP": $scope.model.dokterDPJP != undefined ? $scope.model.dokterDPJP.kode : ""
                                    },
                                    "dpjpLayan": "",
                                    "noTelp": noTelp,
                                    "user": $scope.pegawaiLogin.namaLengkap //"Ramdanegie"
                                }
                            }
                        }
                    };

                    $scope.isSimpan = true;
                    //##Generate SEP
                    if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                        // medifirstService.postNonMessage("bridging/bpjs2/insert-sep-v1.1", dataSend).then(function (e) {
                        medifirstService.postNonMessage("bridging/bpjs2/insert-sep-v2", dataSend).then(function (e) {
                            if (e.data.response) {
                                $scope.successGenerateSep = e.data.metaData.code;
                                if (e.data.response.sep == null) {
                                    toastr.error(e.data.metaData.message);
                                    $scope.isSimpan = false;
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                if (e.data.response.sep.peserta.noKartu != $scope.model.noKepesertaan) {
                                    toastr.error('Generate SEP Gagal, Nosep Dari BPJS Salah ');
                                    $scope.isSimpan = false;
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                $scope.model.noSep = e.data.response.sep.noSep;
                                $scope.model.generateNoSEP = false;
                                $scope.disableSEP = true;
                                // $scope.isHapusSep = true;
                                $scope.isAsuransi = true;
                                toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                                $scope.SimpanNonGenerate();
                                // $scope.isSimpan = false;
                            } else {
                                $scope.isSimpan = false;
                                $scope.hideBtnSimpan = false;
                                // $scope.isNext = false;
                                window.messageContainer.error(e.data.metaData.message)
                            }
                            $scope.isLoadingRujukan = false;
                        }, function (err) {
                            $scope.isLoadingRujukan = false;
                        });
                    } else if ($scope.model.noSep != undefined) {
                        $scope.SimpanRegistrasi();
                        $scope.isSimpan = false;
                    }

                } else {
                    $scope.hideBtnSimpan = false;
                }
            }

            $scope.SimpanNonGenerate = function () {
                $scope.hideBtnSimpan = true
                var noasuransi = "";
                if ($scope.model.noKepesertaan == undefined) {
                    noasuransi = '';
                } else
                    noasuransi = $scope.model.noKepesertaan;

                var noidentitas = "";
                if ($scope.model.noIdentitas == undefined) {
                    noidentitas = '';
                } else
                    noidentitas = $scope.model.noIdentitas;

                var diagnosisfk = null;
                if ($scope.model.diagnosa == undefined) {
                    diagnosisfk = null;
                } else
                    diagnosisfk = $scope.model.diagnosa.id;

                var norujukan = "";
                if ($scope.model.noRujukan == undefined) {
                    norujukan = '';
                } else
                    norujukan = $scope.model.noRujukan;

                var noKepesertaans = "";
                if ($scope.model.noKepesertaan == undefined) {
                    noKepesertaans = '';
                } else
                    noKepesertaans = $scope.model.noKepesertaan;

                var nosep = "";
                if ($scope.model.noSep == undefined) {
                    nosep = '';
                } else
                    nosep = $scope.model.noSep;

                var tanggalsep = "";
                if ($scope.model.tglSEP == undefined) {
                    tanggalsep = null;
                } else
                    tanggalsep = new moment($scope.model.tglSEP).format('YYYY-MM-DD HH:mm:ss');;

                var tglRujukan = "";
                if ($scope.model.tglRujukan == undefined) {
                    tglRujukan = '';
                } else
                    tglRujukan = new moment($scope.model.tglRujukan).format('YYYY-MM-DD HH:mm:ss');


                var noCM = "";
                if ($scope.item.pasien.nocm == undefined)
                    noCM = ''
                else
                    noCM = $scope.item.pasien.nocm

                var catatans = "";
                if ($scope.model.catatan == undefined) {
                    catatans = '';
                } else
                    catatans = $scope.model.catatan;

                var kdProviders = "-";
                var namaProviders = "-";
                if ($scope.model.faskesRujukan == true) {
                    if ($scope.model.namaAsalRujukanBrid != undefined) {
                        kdProviders = $scope.model.namaAsalRujukanBrid.kode
                        namaProviders = $scope.model.namaAsalRujukanBrid.nama
                    }
                } else {
                    if ($scope.model.namaAsalRujukan != undefined) {
                        var arrKdPpkRUjukan = $scope.model.namaAsalRujukan.split(' - ');
                        kdProviders = arrKdPpkRUjukan[0];
                        namaProviders = arrKdPpkRUjukan[1];
                    }
                }

                if (namaProviders == undefined) {
                    namaProviders = "-";
                }

                medifirstService.get("registrasi/get-asuransipasienbynocm?nocm=" +
                    $scope.item.pasien.nocm)
                    .then(function (f) {
                        $scope.cekTableAsuransiPas = f.data.data[0];
                    });

                // debugger
                var id_AsPasien = "";
                if ($scope.cacheIdAP != undefined) {
                    id_AsPasien = $scope.cacheIdAP;
                }
                if (id_AsPasien == "null") {
                    id_AsPasien = ""
                }

                var norec_PA = "";

                if ($scope.cacheNorecPA != undefined) {
                    norec_PA = $scope.cacheNorecPA;
                }
                if (norec_PA == "null") {
                    norec_PA = ""
                }


                var alamatPesertas = "";
                if ($scope.model.alamatPeserta != undefined)
                    alamatPesertas = $scope.model.alamatPeserta;

                var kelasDitanggungs = null;
                if ($scope.model.kelasDitanggung != undefined)
                    kelasDitanggungs = $scope.model.kelasDitanggung.id;


                if ($scope.item.rekanan == undefined) {
                    window.messageContainer.error("Institusi Asal Pasien harus di isi")
                    return
                }
                if ($scope.item.rekanan.id == "581669") {
                    if ($scope.model.kelasDitanggung.id != "1" && $scope.model.kelasDitanggung.id != "6" && $scope.item.kelas.id != 7 && $scope.item.kelas.id != 5) {
                        window.messageContainer.error("PASIEN PBI HANYA UNTUK KELAS III")
                        $scope.hideBtnSimpan = false;
                        return
                    }

                }


                var namaPesertas = "";
                if ($scope.model.namaPeserta != undefined)
                    namaPesertas = $scope.model.namaPeserta;

                var jenisPesertas = "";
                if ($scope.model.jenisPeserta != undefined)
                    jenisPesertas = $scope.model.jenisPeserta;
                var lokasiLakaLantas = "";
                if ($scope.model.lokasiLakaLantas != undefined)
                    lokasiLakaLantas = $scope.model.lokasiLakaLantas;
                else
                    lokasiLakaLantas = "";

                var listPenjaminLakas = ""
                if ($scope.model.lakalantas) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjaminLaka[i].value
                        b = "," + c
                        a = a + b
                    }
                    listPenjaminLakas = a.slice(1, a.length)
                }

                var noTelp = "";
                if ($scope.model.noTelpons != undefined)
                    noTelp = $scope.model.noTelpons;
                var jenisPeserta = ""
                if ($scope.model.jenisPeserta != undefined)
                    jenisPeserta = $scope.model.jenisPeserta

                var asuransipasien = {
                    id_ap: id_AsPasien,
                    noregistrasi: noRegistrasis, //$scope.item.pasien.noregistrasi,
                    nocm: noCM,
                    alamatlengkap: alamatPesertas,
                    objecthubunganpesertafk: $scope.model.hubunganPeserta.id,
                    objectjeniskelaminfk: $scope.item.pasien.objectjeniskelaminfk,
                    kdinstitusiasal: $scope.item.rekanan.id,
                    kdpenjaminpasien: $scope.item.rekanan.id,
                    objectkelasdijaminfk: kelasDitanggungs,
                    namapeserta: namaPesertas,
                    nikinstitusiasal: $scope.item.rekanan.id,
                    noasuransi: noasuransi,
                    alamat: $scope.item.pasien.alamatlengkap,
                    nocmfkpasien: $scope.item.pasien.nocmfk,
                    noidentitas: noidentitas,
                    qasuransi: $scope.item.kelompokPasien.id,
                    kelompokpasien: $scope.item.kelompokPasien.id,
                    tgllahir: $scope.model.tglLahir != undefined ? moment($scope.model.tglLahir).format('YYYY-MM-DD') : null,
                    jenispeserta: jenisPesertas,
                    kdprovider: kdProviders,
                    nmprovider: namaProviders,
                    notelpmobile: noTelp,
                    jenispeserta: jenisPeserta,
                }

                var polikode = '';
                var polinama = '';

                debugger;
                var pemakaianasuransi = {
                    norec_pa: norec_PA,
                    noregistrasifk: $scope.currentNorec, //$scope.currentNorecPD,
                    tglregistrasi: moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    diagnosisfk: diagnosisfk,
                    lakalantas: $scope.model.lakalantas === true ? 1 : 0,
                    nokepesertaan: noKepesertaans,
                    norujukan: norujukan,
                    nosep: nosep,
                    tglrujukan: tglRujukan,
                    // objectasuransipasienfk: $scope.model.noKepesertaan,
                    objectdiagnosafk: diagnosisfk,
                    tanggalsep: tanggalsep,
                    catatan: catatans,
                    lokasilaka: lokasiLakaLantas,
                    penjaminlaka: listPenjaminLakas,
                    cob: $scope.model.cob != undefined ? $scope.model.cob : false,
                    katarak: $scope.model.katarak != undefined ? $scope.model.katarak : false,
                    keteranganlaka: $scope.model.keteranganLaka != undefined ? $scope.model.keteranganLaka : "",
                    tglkejadian: $scope.model.lakalantas === true && $scope.model.tglLakalantas !== undefined ? moment($scope.model.tglLakalantas).format("YYYY-MM-DD") : null,
                    suplesi: $scope.model.suplesi != undefined ? $scope.model.suplesi : false,
                    nosepsuplesi: $scope.model.nomorSepSuplesi !== undefined ? $scope.model.nomorSepSuplesi : "",
                    kdpropinsi: $scope.model.propinsi !== undefined ? $scope.model.propinsi.kode : null,
                    namapropinsi: $scope.model.propinsi !== undefined ? $scope.model.propinsi.nama : null,
                    kdkabupaten: $scope.model.kabupaten !== undefined ? $scope.model.kabupaten.kode : null,
                    namakabupaten: $scope.model.kabupaten !== undefined ? $scope.model.kabupaten.nama : null,
                    kdkecamatan: $scope.model.kecamatan !== undefined ? $scope.model.kecamatan.kode : null,
                    namakecamatan: $scope.model.kecamatan !== undefined ? $scope.model.kecamatan.nama : null,
                    nosuratskdp: $scope.model.skdp !== undefined ? $scope.model.skdp : "",
                    kodedpjp: null,
                    namadpjp: null,
                    prolanisprb: $scope.model.prolanis !== undefined && $scope.model.prolanis !== null ? $scope.model.prolanis : null,
                    asalrujukanfk: $scope.item.asalRujukan != undefined ? $scope.item.asalRujukan.id : null,
                    polirujukankode: polikode, //$scope.item.pasien.kdinternal,
                    polirujukannama: polinama, //$scope.item.pasien.namaruangan,/// $scope.item.pasien.namaexternal
                    // polirujukankode: $scope.insert.poli.kode,//$scope.item.pasien.kdinternal,
                    // polirujukannama: $scope.insert.poli.nama,//$scope.item.pasien.namaruangan,/// $scope.item.pasien.namaexternal
                    kodedpjpmelayani: null,
                    namadjpjpmelayanni: null,
                    user: $scope.pegawaiLogin.id,

                }
                var objSave = {
                    kdProvider: $scope.kodeProvider,
                    asuransipasien: asuransipasien,
                    pemakaianasuransi: pemakaianasuransi
                }
                medifirstService.post("registrasi/save-asuransipasien", objSave).then(function (e) {

                    responData = e.data;
                    $scope.SimpanRegistrasi();

                }, function (error) {
                    $scope.hideBtnSimpan = false
                })
            }

            $scope.SimpanRegistrasi = function () {
                debugger
                sensus = true;
                // $scope.popupPilihan.close();
                if ($scope.item.pasien.objecttitlefk != 4 && $scope.model.rawatGabung == true) {
                    alert('RAWAT GABUNG HANYA UNTUK PASIEN BAYI !')
                    return
                }
                if ($scope.item.kelas == undefined) {
                    toastr.error('Kelas harus di isi')
                    return
                }

                var kelasId = "";
                if ($scope.item.kelas == undefined) {
                    kelasId = null;
                } else
                    kelasId = $scope.item.kelas.id;

                var rekananId = null;
                if ($scope.item.rekanan != undefined)
                    rekananId = $scope.item.rekanan.id;
                if (rekananId == "581669" && $scope.item.kelas.id != 9 && $scope.item.kelas.id != 7 && $scope.item.kelas.id != 5) {
                    if (kelasId != "1" && kelasId != null) {
                        window.messageContainer.error("PASIEN PBI HANYA UNTUK KELAS III")
                        // $scope.hideBtnSimpan = false;
                        return
                    }
                }

                var dokterId = null;
                if ($scope.item.dokter != undefined)
                    dokterId = $scope.item.dokter.id;



                var kamarIds = "";
                if ($scope.item.kamar == undefined) {
                    kamarIds = null;
                } else
                    kamarIds = $scope.item.kamar.id;


                var nomorTempatTidurs = "";
                if ($scope.model.rawatGabung == true) {
                    nomorTempatTidurs = null;
                } else if ($scope.item.nomorTempatTidur == undefined || $scope.item.nomorTempatTidur == "") {
                    messageContainer.error("Nomor Tempat Tidur Harus Di isi / Bed Penuh")
                    return
                } else
                    nomorTempatTidurs = $scope.item.nomorTempatTidur.id;


                var tglcsr = null;
                var jaminankhusus = "";
                if ($scope.item.jaminankhusus == undefined || $scope.item.jaminankhusus == "") {
                    jaminankhusus = null
                } else {
                    jaminankhusus = $scope.item.jaminankhusus.id
                    tglcsr = moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss')
                }

                var jenisPel = "";
                if ($scope.item.jenisPasien != undefined)
                    jenisPel = $scope.item.jenisPasien.id
                else {
                    messageContainer.error("Jenis Pelayanan Harus Di isi")
                    return
                }
                var isPenanggungJawab = ""
                if ($scope.model.penanggungJawab == undefined)
                    isPenanggungJawab = "false"
                else if ($scope.model.penanggungJawab)
                    isPenanggungJawab = "true"
                else
                    isPenanggungJawab = "false"
                debugger
                var tmpData = {
                    "pegawai": {
                        "id": dokterId
                    },
                    // "isRegistrasiLengkap": item.isRegistrasiLengkap,
                    // "isOnSiteService": item.isOnSiteService,
                    "tglRegistrasi": new moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    "jenisPelayanan": jenisPel,
                    "kelompokPasien": {
                        "id": $scope.item.kelompokPasien.id
                    },
                    "ruangan": {
                        "id": $scope.item.ruangan.id
                        // "departemenId": item.ruangan.departemenId
                    },
                    "pasien": {
                        "id": $scope.item.nocmfk,
                        "pasienDaftar": {
                            "noRec": $scope.currentNorec
                        },
                        "noCm": $scope.item.pasien.nocm
                    },

                    // "noRecAntrianPasien": $scope.dataAdmisi.registrasiPelayananPasien.noRec,
                    "noRecAntrianPasien": $scope.currentNorecAntrian,
                    // "tglRegistrasi":  $scope.item.pasien.tglDaftar,
                    "tglRegisDateOnly": new moment($scope.item.tglRegistrasi).format('YYYY-MM-DD'),
                    "objectruanganasalfk": $scope.item.historyPasien.objectruanganlastfk,
                    "objectrekananfk": rekananId,
                    "asalRujukan": {
                        "id": $scope.item.historyPasien.objectasalrujukanfk
                    },
                    "kelas": {
                        "id": kelasId
                    },
                    "kamar": {
                        "id": kamarIds
                    },
                    "nomorTempatTidur": {
                        "id": nomorTempatTidurs
                    },
                    "status": "pindah Kamar",
                    "noRecPasienDaftar": $scope.currentNorec,
                    "statusPasien": $scope.item.historyPasien.statuspasien,
                    "objectkasuspenyakitlastfk": $scope.item.kp,
                    "sensus": sensus,
                    "tglcsr": tglcsr,
                    "pegawaimutasi": $scope.pegawaiLogin.id,
                    "israwattitipan": $scope.model.rawatTitipan,
                    "israwatgabung": $scope.model.rawatGabung,
                    "penanggungjawab": $scope.item.PenanggungJawab != undefined ? $scope.item.PenanggungJawab : null,
                    "hubungankeluargapj": $scope.item.Hubungan != undefined ? $scope.item.Hubungan : null,
                    "teleponpenanggungjawab": $scope.item.TeleponP != undefined ? $scope.item.TeleponP : null,
                    "isPenanggungJawab": isPenanggungJawab
                }
                $scope.isSimpan = true;
                medifirstService.post('registrasi/simpan-mutasi-pasien', tmpData).then(function (e) {
                    $scope.resultAPD = e.data.data;
                    responData = e.data;
                    $scope.resultPD = e.data.data;
                    $scope.model.noRegistrasi = e.data.data.noregistrasi;
                    $scope.model.norec_apd = e.data.data.norec;
                    $scope.cacheNoRegistrasi = e.data.data.noregistrasi;


                    //##log Pasien Daftar
                    // medifirstService.get("sysadmin/logging/save-log-pendaftaran-pasien?norec_pd="
                    //     +   $scope.resultAPD.norec ).then(function (x) {
                    //     })
                    medifirstService.postLogging('Mutasi Rawat Inap', 'norec pasiendaftar_t', $scope.currentNorec,
                        'Mutasi Rawat Inap ' + ' dengan No Registrasi - ' + noRegistrasis + ' ke Ruangan ' +
                        $scope.item.ruangan.namaruangan).then(function (res) { })

                    //## end log    

                    var cachePasienDaftar = $scope.currentNorec +
                        "~" + $scope.item.historyPasien.noregistrasi +
                        "~" + $scope.resultAPD.norec;
                    // + "~" + $scope.currentNoCm;
                    cacheHelper.set('CacheRegistrasiPasien', cachePasienDaftar);
                    if ($scope.item.asalRujukan != undefined) {
                        var asalRujukan = { id: "2", asalrujukan: "Rumah sakit" }
                        cacheHelper.set('cacheAsalRujukan', asalRujukan);
                    }


                    if (e.data.status == 201) {
                        $scope.isSimpan = true;
                        $scope.isNext = false;
                        $scope.isBatal = true;
                        $scope.isReport = true;
                        $scope.isReportPendaftaran = true;
                        $scope.isReportRawatInap = true;
                        $scope.isInputAsuransi = true;
                        $scope.isAsuransi = false;
                        $scope.model.generateNoSEP = false;
                    }
                    if ($scope.item.kelompokPasien.kelompokpasien != ('BPJS')) {
                        if ($scope.item.kelompokPasien.kelompokpasien != ('Umum/Pribadi')) {
                            if (norecPD == '') {
                                $scope.inputPemakaianAsuransi();
                            }
                        }
                    }
                    // else {
                    //     window.history.back();
                    // }

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

            $scope.cetakSEP = function (x) {
                if (noRegistrasis != undefined && $scope.item.kelompokPasien.kelompokpasien !== "Umum/Pribadi") {

                    if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                        toastr.warning("Nosep Tidak ada!");
                        return;
                    }
                    medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.model.noSep).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                                '&norec=' + noRegistrasis
                            ).then(function (data) {
                                debugger;
                                var data = data.data.data;
                                if (data[0].nokepesertaan != e.data.response.peserta.noKartu) {
                                    toastr.error('Generate SEP Gagal, Nosep Dari BPJS Salah ');
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                if (data[0].jenisrawat == 'R. Jalan') {
                                    if (e.data.response.jnsPelayanan == 'Rawat Inap') {
                                        toastr.error('SEP INI ADALAH SEP RAWAT INAP YANG DI COPY PASTE KE RAWAT JALAN, SEGERA TERBITKAN SEP RAWAT JALANNYA!.');
                                        $scope.hideBtnSimpan = false;
                                        return
                                    }
                                } else if (data[0].jenisrawat == 'R. Inap') {
                                    if (e.data.response.jnsPelayanan == 'Rawat Jalan') {
                                        toastr.error('SEP INI ADALAH SEP RAWAT JALAN YANG DI COPY PASTE KE RAWAT INAP, SEGERA TERBITKAN SEP RAWAT INAPNYA!.');
                                        $scope.hideBtnSimpan = false;
                                        return
                                    }
                                }
                                if (new moment(data[0].tanggalsep).format('YYYY-MM-DD') != e.data.response.tglSep) {
                                    toastr.error('TANGGAL SEP DI VCLAIM BERBEDA DENGAN DANGAN TANGGAL REGISTRASI DI RS.');
                                    $scope.hideBtnSimpan = false;
                                    return
                                }
                                $("#nosepx").text(data[0].nosep);
                                $("#nopendaftaran").text(data[0].noregistrasi);
                                $("#tglsep").text(data[0].tanggalsep);
                                $("#peserta").text(data[0].jenispeserta);
                                $("#nokartu").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                                // $("#cob").text(data[0].penjaminlaka);
                                // $("#namapeserta").text(data[0].namapeserta);
                                $("#namapeserta").text(e.data.response.peserta.nama);
                                $("#jenisrawat").text(data[0].jenisrawat);
                                // $("#tgllahir").text((moment(data[0].tgllahir).format('YYYY-MM-DD')));
                                $("#tgllahir").text(e.data.response.peserta.tglLahir);
                                $("#kelasrawathak").text(data[0].namakelashak);
                                $("#kelasrawat").text(data[0].namakelas);
                                $("#notelepon").text(data[0].notelpmobile);
                                $("#penjamin").text(data[0].penjaminlakalantas);
                                $("#politujuan").text(e.data.response.poli);
                                $("#prolanis").text(data[0].prolanisprb);
                                $("#faskesperujuk").text(data[0].nmprovider);
                                $("#diagnosaawal").text(data[0].namadiagnosa);
                                $("#catatan").text(data[0].catatan);
                                $("#cetakanke").text(1);
                                $("#namadjpjmelayani").text(data[0].namadjpjpmelayani != null ? data[0].namadjpjpmelayani : "");

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
                            toastr.warning("Nosep Tidak ada!");
                            return;
                        }
                        $scope.isLoadingSEP = false;
                    }, function (err) {
                        toastr.warning("Nosep Tidak ada!");
                        return;
                        $scope.isLoadingSEP = false;
                    });


                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Sep!");
                    return;
                }
            }

            $scope.model.generateNoSEP = false;



            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.cetakLabel = function (tempNoCm) {
                $scope.dats = {
                    qty: 0
                }
                $scope.winDialog.center().open();
            }
            $scope.pilihQty = function (data) {
                let query = "";
                loopCetakan(data, query)

            };

            function loopCetakan(data, query) {
                debugger
                let queryjadi = ""
                for (let i = 1; data.qty >= i; i++) {

                    // for (const item of data) {
                    // query = ``
                    if (queryjadi == "") {
                        queryjadi = `SELECT * from V_labelPasien where noregistrasi = ${$scope.cacheNoRegistrasi}`;
                    } else {
                        queryjadi = `${queryjadi} UNION ALL SELECT * from V_labelPasien where noregistrasi = ${$scope.cacheNoRegistrasi}`;
                    }
                }
                Labelpasienjasper(queryjadi)
            }
            $scope.pilihQty2 = function () {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMMonth-YYYY HH12:MIPM'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))" +
                    'where noregistrasi = ' + "'" + noRegistrasis + "'"
                Labelpasienjaspera4(sintak)
            }

            function Labelpasienjaspera4(datas) {
                var qrcode = noRegistrasis
                // var norec = $scope.dataPasienSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.cacheNoRegistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }


                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasienA4.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/labelPasienA4.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
            }

            function Labelpasienjasper(datas) {
                debugger

                var qrcode = $scope.cacheNoRegistrasi
                // var qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.dataPasienSelected.noregistrasi
                var norec = $scope.cacheNorecPD
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.cacheNoRegistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasien.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/labelPasien.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.cetak = function () {
                if ($scope.model.rawatInap == true) {
                    messageContainer.error("Cetak Antrian hanya untuk rawat jalan")
                    return
                }
                // cetak antrian
                // window.location = configuration.urlPrinting + "registrasi-pelayanan/antrianPasienDiperiksa?noRec=" + tempNoRec + "&X-AUTH-TOKEN=" + modelItem.getAuthorize()
                // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/antrianPasienDiperiksa?noRec=" + tempNoRec);
                //     window.open(fixUrlLaporan, '', 'width=800,height=600')

                //cetakan langsung service VB 6 by grh   
                var client = new HttpClient();

                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                    // do something with response
                });

            }
            $scope.suratpernyataaan = function () {
                debugger
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "nocms", "noregistrasi", "jk", "norecapd", "umur", "dirawat", "kunjungan"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR",
                        "1980-12-25 00:00:00",
                        "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.item.pasien.nocm, noRegistrasis, $scope.item.pasien.jeniskelamin, $scope.model.norec_apd, $scope.item.pasien.umur, dirawat.toString(), kunjungan.toString()
                    ], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1000/generic/report/suratpernyataanfix.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/suratpernyataanfix.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratpernyataanfix.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.cetakGelang = function () {
                if ($scope.item != undefined) {
                    var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/gelangPasien?id=" + $scope.item.pasien.nocmfk);
                    window.open(fixUrlLaporan, '_blank')
                }
            }
            $scope.cetakBuktiLayanan = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapBuktiPelayanan?noRegistrasi=" + $scope.item.pasien.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=' + $scope.cacheNoRegistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.CetakSumList = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + tempNoCm + "&tglRegistrasi=" + new moment(new Date()).format('DD-MM-YYYY'));
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.currentNoCm + '&view=false', function (response) {
                        // do something with response
                    });

                }

            }

            $scope.tracerBon = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $state.params.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.cetakKartu = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')
                    //cetakan langsung service VB 6 by grh   
                    var client = new HttpClient();
                    // debugger;             
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.item.pasien.nocmfk + '&view=false', function (response) {
                        // do something with response
                    });

                }
            }
            $scope.sourceJenisDiagnosisPrimer = [{
                "statusEnabled": true,
                "namaExternal": "Diagnosa Awal",
                "kdProfile": 0,
                "qJenisDiagnosa": 5,
                "reportDisplay": "Diagnosa Pasca Bedah",
                "jenisDiagnosa": "Diagnosa Awal",
                "id": 5,
                "kodeExternal": "05",
                "kdJenisDiagnosa": 5,
                "noRec": "5                               "
            }]

            $scope.cetakBro = function () {
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.currentNorec + '&view=false', function (response) { });
            }
            $scope.cetakRMK = function () {
                var norReg = ""
                if ($scope != undefined) {
                    norReg = "noReg=" + $scope.cacheNoRegistrasi;
                }
                // manageServicePhp.getDataTableTransaksi("operator/get-data-diagnosa-pasien?"
                //     + norReg
                // ).then(function (data) {
                // var dataDiagnosa = data.data.datas[0]

                if ($scope.item.jenisDiagnosis == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }

                var keterangan = "";
                if ($scope.item.keteranganDiagnosis == undefined) {
                    keterangan = "-"
                } else {
                    keterangan = $scope.item.keteranganDiagnosis;
                }


                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: "",
                    noregistrasifk: $scope.cacheNorecAPD,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglpendaftaran: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
                }
                medifirstService.post('registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
                    $scope.item.keteranganDiagnosis = "";
                    $scope.item.diagnosisPrimer = "";
                    // loadData()
                    $scope.icd10.close();

                    $scope.cetakBro();
                })
                // });
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
            medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function (data) {
                $scope.sourceDiagnosa = data;

            });

            $scope.inputPemakaianAsuransi = function () {
                medifirstService.post('registrasi/update-sep-igd', { 'norec': $scope.currentNorec }).then(function (e) {
                    if ($scope.resultPD != undefined) {
                        $state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
                            norecPD: $scope.currentNorec,
                            norecAPD: $scope.resultAPD.norec,
                        });
                        var cacheSet = undefined;
                        cacheHelper.set('CachePemakaianAsuransi', cacheSet);
                    } else {
                        $state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
                            norecPD: $scope.currentNorec,
                            norecAPD: $scope.cacheNorecAPD,
                        });
                        var cacheSet = undefined;
                        cacheHelper.set('CachePemakaianAsuransi', cacheSet);
                    }
                })

            }

            $scope.inputTindakan = function () {
                if ($scope.resultPD != undefined) {
                    $state.go('InputTindakanPendaftaran', {
                        norecPD: $scope.currentNorec,
                        norecAPD: $scope.model.norec_apd

                    });
                } else {
                    $state.go('InputTindakanPendaftaran', {
                        norecPD: $scope.cacheNorecPD,
                        norecAPD: $scope.cacheNorecAPD

                    });
                }
            }


            $scope.find = function () {
                $state.go('RegistrasiPasienLama');
            }


            $scope.columnGridResepExist = [{
                "field": "no",
                "title": "No",
                "width": "40px",
            },
            {
                "field": "namadokter",
                "title": "Nama Dokter",
                "width": "210px",
            },
            {
                "field": "jumlahpasien",
                "title": "Jml Pasien",
                "width": "85px",
            }

            ];

            //** BATAS */
        }
    ]);
});