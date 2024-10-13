define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RegistrasiPasienLamaCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem', '$mdDialog',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem, $mdDialog) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.istempatLaporan = true;
            $scope.isFaskes = "1";
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.item.tglDokumen = $scope.now;
            $scope.tglMeninggal = '';
            $scope.nocmKirim = '';
            $scope.dataSelectedUpload = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var data2 = [];
            var kelompokUserLogin = ModelItem.getStatusUser()
            if (kelompokUserLogin == 'radiologi' || kelompokUserLogin == 'laborat') {
                $scope.isPenunjang = true
            }
            $scope.listJenisKontrol = [
                { "id": "1", "name": "Rencana Kontrol" },
                { "id": "2", "name": "SPRI" },
                { "id": "3", "name": "Rujuk Ke Luar Rumah Sakit Lain" },
                { "id": "4", "name": "Rujuk Balik" }
            ];
            $scope.listJenisPelayananRujukan = [
                { "id": "1", "name": "Rawat Inap" },
                { "id": "2", "name": "Rawat Jalan" }
            ];
            $scope.listTypeRujukan = [
                { "id": "0", "name": "Penuh" },
                { "id": "1", "name": "Partial" },
            ];
            $scope.pegawai = ModelItem.getPegawai();
            loadFirst()

            function loadFirst() {
                cacheHelper.set('cacheStatusPasien', undefined);
                var chacePeriode = cacheHelper.get('RegistrasiPasienLamaRevCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                }
            }
            loadData()
            $scope.SearchData = function () {
                loadData()
            }
            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.SearchNoRm = function () {
                loadData()
            }
            $scope.SearchTglLahir = function () {
                loadData()
            }

            function loadData() {

                $scope.isRouteLoading = true;

                medifirstService.getPart("bridging/bpjs2/get-poli-part", true, true, 10).then(function (data) {
                    $scope.listpoliKontrol = data;
                });


                var rm = ""
                if ($scope.item.noRM != undefined) {
                    rm = "&norm=" + $scope.item.noRM
                }

                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.item.namaPasien
                }
                var ayah = ""
                if ($scope.item.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.item.namaAyah
                }
                var almat = ""
                if ($scope.item.alamat != undefined) {
                    almat = "&alamat=" + $scope.item.alamat
                }
                var ibu = ""
                if ($scope.item.namaIbu != undefined) {
                    ibu = "&namaIbu=" + $scope.item.namaIbu
                }
                var tglLahirs = ""
                if ($scope.item.tglLahir != undefined) {
                    tglLahirs = "&tglLahir=" + DateHelper.formatDate($scope.item.tglLahir, 'YYYY-MM-DD');
                }

                var nobpjs = ""
                if ($scope.item.noBpjs != undefined) {
                    nobpjs = "&nobpjs=" + $scope.item.noBpjs
                    // if(nobpjstemp.length==13){
                    //     nobpjs=""
                    // }
                }

                var filterkelompok = "&kelompokUserLogin=" + kelompokUserLogin

                medifirstService.get("registrasi/get-pasien?" +

                    filterkelompok +
                    tglLahirs +
                    rm +
                    pasien +
                    ayah +
                    almat +
                    nobpjs +
                    ibu)
                    .then(function (data) {
                        $scope.isRouteLoading = false;

                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.daftar,
                            pageSize: 10,
                            total: data.data.daftar.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }

                        });
                    });

            };



            $scope.columnGrid = {
                pageable: true,
                columns: [{
                    "field": "nocm",
                    "title": "No Rekam Medis",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                    // "template": "<span class='style-center'>#: namapasien #</span>"
                },
                {
                    "field": "noidentitas",
                    "title": "NIK",
                    "width": "150px",
                    // "template": "<span class='style-center'>#: namapasien #</span>"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                },
                {
                    "field": "namaayah",
                    "title": "Nama Ayah Kandung",
                    "width": "100px",
                    "template": '# if( namaayah==null) {# - # } else {# #= namaayah # #} #'
                    // "template": "<span class='style-center'>#: namaayah #</span>"
                },
                {
                    "field": "namaibu",
                    "title": "Nama Ibu Kandung",
                    "width": "100px",
                    "template": '# if( namaibu==null) {# - # } else {# #= namaibu # #} #'
                    // "template": "<span class='style-center'>#: namaayah #</span>"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "80px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                // {
                //     "field": "umurzz",
                //     "title": "Umur",
                //     "width":240

                // },
                {
                    "field": "alamatlengkap",
                    "title": "Alamat",
                    "width": "200px",

                },
                {
                    "field": "notelepon",
                    "title": "No Telepon",
                    "width": "80px",
                    "template": '# if( notelepon==null) {# - # } else {# #= notelepon # #} #'
                },
                {
                    "field": "nohp",
                    "title": "No HP",
                    "width": "80px",
                    "template": '# if( nohp==null) {# - # } else {# #= nohp # #} #'
                },
                {
                    // "field": "photo",
                    // "title": "Photo",
                    // "width": "40px",
                    // "template": '# if( photo!=null ) {# ✔ # } else {# - #} #'
                    // "template": "# if (photo) { #" +
                    //     "<i class='fa fa-user' style='color:grey' />" +
                    //     "# } else { # - # } #",
                    // "template": "<div class='photo-pasien'"+
                    // "style='background:url(#:data.photo#);'></div>"
                    "field": "foto",
                    "title": "FOTO",
                    "width": "80px",
                    "template": " <img style=\"margin-left: 5px;margin-top: 5px; width: 70px;height: 50px; object-fit: contain;\" src=\" #:  foto # \" >"
                },
                // {
                //     "field": "iskompleks",
                //     "title": "Kompleks",
                //     "width": "50px",
                //     "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                // },
                {
                    "title": "Upload Dokumen",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setLihatDokumen(dataItem)\"  style=\"margin:0 0 5px\">#:  'lihat' #</button> ",
                },
                {
                    "field": "nobpjs",
                    "title": "NO BPJS",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setCekKepesertaan(dataItem)\"  style=\"margin:0 0 5px\">#:  nobpjs #</button> ",
                },
                {
                    "title": "Cek History Surat Kontrol/Spri",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setCekHistorySurat(dataItem)\"  style=\"margin:0 0 5px\">#:  'klik' #</button> ",
                },
                {
                    "title": "Cek Rujukan Faskes 1",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setCekRujukan1(dataItem)\"  style=\"margin:0 0 5px\">#:  'klik' #</button> ",
                },
                {
                    "title": "Cek Rujukan Faskes 2",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setCekRujukan2(dataItem)\"  style=\"margin:0 0 5px\">#:  'klik' #</button> ",
                },
                {
                    "title": "Cek History SEP",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setCekHistorySEP(dataItem)\"  style=\"margin:0 0 5px\">#:  'klik' #</button> ",
                },
                {
                    "field": "pekerjaan",
                    "title": "Pekerjaan",
                    "width": "80px",
                },
                {
                    "field": "jeniskelompokpasien",
                    "title": "Jenis Kelompok Pasien",
                    "width": "80px",
                },
                {
                    "field": "kesatuanpasien",
                    "title": "Kesatuan Pasien",
                    "width": "80px",
                },
                {
                    "field": "statusIsoman",
                    "title": "Status Isoman",
                    "width": "80px",
                }
                ]
            };

            $scope.setLihatDokumen = function (dataPasienSelected) {
                medifirstService.get("registrasi/get-data-combo-dokumen?jenisdokumen=norm")
                    .then(function (dat) {
                        $scope.listDokumen = dat.data.listcombodokumen;
                    });
                $scope.dataSelectedUpload = dataPasienSelected;
                medifirstService.get("registrasi/get-data-list-dokumen?nocmfk=" + dataPasienSelected.nocmfk)
                    .then(function (dat) {
                        $scope.sourceDataListDokumen = new kendo.data.DataSource({
                            data: dat.data.data,
                            pageSize: 10,
                            total: dat.data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });
                $scope.popupDokumen.center().open()
            }
            $scope.upload = function () {
                var a = document.getElementById("base64textarea").value
                var b = document.getElementById("base64textarea").name

                var objData = {
                    nocmfk: $scope.dataSelectedUpload.nocmfk,
                    namafile: b,
                    base64File: a,
                    objectjenisdokumencasemix: $scope.item.namadokumen.id,
                    tglDokumen: $scope.item.tglDokumen
                }

                medifirstService.post('registrasi/upload-dokumen', objData).then(function (e) {
                    $scope.sourceDataListDokumen = new kendo.data.DataSource({
                        data: e.data.data,
                        pageSize: 10,
                        total: e.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
            }
            var handleFileSelect = function (evt) {
                var files = evt.target.files;
                var file = files[0];
                var a = evt.target.files[0].name;

                if (file.size > 2000000) {
                    toastr.error('Maaf. File Terlalu Besar ! Maksimal Upload 2 MB.', {
                        "showDuration": "300",
                    })
                    return
                }

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
            $scope.setCekKepesertaan = function (dataPasienSelected) {
                if (!/^[a-zA-Z0-9]+$/.test(dataPasienSelected.nobpjs)) {
                    toastr.error('No BPJS Salah')
                    return
                } else if (dataPasienSelected.nobpjs.length != 13) {
                    toastr.error('No BPJS Salah')
                    return
                }
                typeof dataPasienSelected.nobpjs;
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs2/get-no-peserta?nokartu=" + dataPasienSelected.nobpjs + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                        toastr.info(e.data.response.peserta.provUmum.nmProvider, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isRouteLoading = false;
                }, function (err) {
                    $scope.isRouteLoading = false;
                });
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
            $scope.columnListDokumen = {

                selectable: 'cell',
                pageable: true,
                columns: [

                    {
                        "field": "reportdisplay",
                        "title": "Jenis Dokumen",
                        "width": "150px",

                    },
                    {
                        "title": "Dokumen",
                        "width": "120px",
                        "template": " <img style=\"margin-left: 5px;margin-top: 5px; width: 70px;height: 50px; object-fit: contain;\" src=\" #:  uploadfile # \" >"
                    },
                    {
                        "title": "Cetak",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"printListDokumen('cetaklistDokumen')\"  style=\"margin:0 0 5px\">#:  'Lihat Dokumen' #</button> ",
                    },
                    // {
                    //     "command": [
                    //         { text: "Lihat File", click: LihatFile },
                    //         // { text: "Download File", click: DownloadFile },
                    //     ],
                    //     title: "",
                    //     width: "100px",
                    // }


                ]
            };


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

                    "template": "<button class=\"k-button custom-button\" ng-click=\"setSep(dataItem)\"  style=\"margin:0 0 5px\">#:  noSep #</button> ",

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

            $scope.printListDokumen = function (x) {
                debugger
                var printdata = document.getElementById(x);
                printdata = printdata.innerHTML;
                let gambar = $scope.dataListDokumen.uploadfile;
                // var editor = $("#editor").data("kendoEditor");
                // editor.value(printdata);
                debugger
                // var tampung = ''
                // for (let i =0; i < $scope.gambar.length; i++) {
                //     if ($scope.gambar[i].gambar == true) {
                //         tampung = tampung + '<img ng-src=' + $scope.gambar[i].gambar + '/>'
                //     }
                // }
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
                    '<embed width="100%" style="position: fixed;top: 0;" height="100%" src="' + gambar + '" /> ';
                // '<img ng-src=' + gambar + 'height="80%" width="80%" />' +
                // tampung
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
            }
            $scope.setRujukan = function (dataPasienSelected) {
                $scope.popupRujukan.close();
                debugger
                var user = medifirstService.getMapLoginUserToRuangan();

                cacheHelper.set('cacheStatusPasien', 'LAMA');
                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocmKirim,
                        bpJS: true,
                        norujukan: dataPasienSelected.noKunjungan,
                        faskes: $scope.isFaskes
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }
            $scope.setSep = function (dataPasienSelected) {
                $scope.popUpHistoriPelayananPeserta.close();
                debugger
                var user = medifirstService.getMapLoginUserToRuangan();


                cacheHelper.set('cacheStatusPasien', 'LAMA');
                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocmKirim,
                        bpJS: true,
                        norujukan: dataPasienSelected.noSep,
                        faskes: 3
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }

            $scope.setCekHistorySurat = function (dataPasienSelected) {
                $scope.isRouteLoading = true;
                $scope.nocmKirim = dataPasienSelected.nocm;
                medifirstService.get("bridging/bpjs2/listsuratkontrol-berdasarkan/NoKartu/" + dataPasienSelected.nobpjs).then(function (data) {
                    $scope.isRouteLoading = false
                    if (data.data.metaData.code == 201) {
                        toastr.info(data.data.metaData.message, 'Info')
                        return
                    }
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

                    // "template": "<button class=\"k-button custom-button\" ng-click=\"setSuratKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  noSuratKontrol #</button> ",

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
                            $("#nokartu").text(x.noKartu);
                            $("#namapeserta").text(x.nama);
                            $("#tgllahir").text(moment(e.data.response.peserta.tglLahir).format('YYYY-MM-DD'));
                            $("#diagnosa").text('');
                            $("#rencanainap").text(x.tglRencanaKontrol);
                            $("#tglcetak").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));

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
            $scope.setCetakSurat = function (v) {
                if ($scope.item.jenisKontrol.id == 3 || $scope.item.jenisKontrol.id == 4) {
                    medifirstService.get("bridging/bpjs2/get-cari-nomor-rujukan-keluar?noRujukan=" + v).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            debugger
                            var jns = "Rawat Jalan";
                            if (e.data.response.rujukan.jnsPelayanan == '1') {
                                jns = "Rawat Inap"
                            }
                            $("#faskesTujuan").text(e.data.response.rujukan.namaPpkDirujuk);
                            $("#noRujukanKeluar").text(e.data.response.rujukan.noRujukan);
                            $("#nokartuRujukanKeluar").text(e.data.response.rujukan.noKartu);
                            $("#namapesertaRujukanKeluar").text(e.data.response.rujukan.nama);
                            $("#tgllahirRujukanKeluar").text(moment(e.data.response.rujukan.tglLahir).format('YYYY-MM-DD'));
                            $("#diagnosaRujukanKeluar").text(e.data.response.rujukan.diagRujukan);
                            $("#keteranganRujukanKeluar").text(e.data.response.catatan);
                            $("#tglcetakRujukanKeluar").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));
                            $("#tglrencanakunjunganRujukanKeluar").text(moment(e.data.response.rujukan.tglRencanaKunjungan).format('YYYY-MM-DD'));
                            $("#typeRujukanKeluar").text(e.data.response.rujukan.namaTipeRujukan);
                            $("#jnsPelayananRujukanKeluar").text(jns);

                            var printdata = document.getElementById('rujukanKeluar');
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
                            var printdata = document.getElementById('rujukanKeluar');
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
                    }, function (err) {

                    });
                } else {
                    medifirstService.get("bridging/bpjs2/cari-rencana-kontrol-v2?noRujukanKontrol=" + v).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            debugger
                            if (e.data.response.namaJnsKontrol == 'Inap') {
                                $("#noSPRIx").text(e.data.response.noSuratKontrol);
                                $("#nokartu").text($scope.dataPasienSelected.nobpjs);
                                $("#namapeserta").text($scope.dataPasienSelected.namapasien);
                                $("#tgllahir").text(moment($scope.dataPasienSelected.tgllahir).format('YYYY-MM-DD'));
                                $("#diagnosa").text('');
                                $("#rencanainap").text(e.data.response.tglRencanaKontrol);
                                $("#tglcetak").text(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'));

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
                                $("#nokartuKontrol").text($scope.dataPasienSelected.nobpjs);
                                $("#namapesertaKontrol").text($scope.dataPasienSelected.namapasien);
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
            }

            $scope.setCekRujukan1 = function (dataPasienSelected) {
                $scope.isRouteLoading = true;
                $scope.nocmKirim = dataPasienSelected.nocm;
                medifirstService.get("bridging/bpjs2/get-rujukan-pcare-nokartu-multi?nokartu=" + dataPasienSelected.nobpjs).then(function (e) {
                    if (e.data.length == 0 || e.data.length != undefined) {
                        toastr.error('Rujukan Tidak Ada');
                    } else {
                        if (e.data.metaData.code === "200") {
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
                            // $scope.sourceNoRujukanMulti =  e.data.response.rujukan;
                            $scope.isFaskes = "1"
                            $scope.popupRujukan.center().open();

                        } else {
                            toastr.error(e.data.metaData.message, 'Info');
                            // window.messageContainer.error(e.data.metaData.message);
                        }
                    }
                    $scope.isRouteLoading = false;
                }, function (err) {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.setCekHistorySEP = function (dataPasienSelected) {
                $scope.isRouteLoading = true;
                $scope.nocmKirim = dataPasienSelected.nocm;
                medifirstService.get("bridging/bpjs2/monitoring/HistoriPelayanan-duabulan/NoKartu/" + dataPasienSelected.nobpjs).then(function (data) {
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
                        $scope.isRouteLoading = false;
                    }
                    $scope.isRouteLoading = false;
                }, function (err) {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.setCekRujukan2 = function (dataPasienSelected) {
                $scope.isRouteLoading = true;
                $scope.nocmKirim = dataPasienSelected.nocm;
                medifirstService.get("bridging/bpjs2/get-rujukan-rs-nokartu-multi?nokartu=" + dataPasienSelected.nobpjs).then(function (e) {
                    if (e.data.metaData.code === "200") {
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
                        // $scope.sourceNoRujukanMulti =  e.data.response.rujukan;
                        $scope.isFaskes = "2"
                        $scope.popupRujukan.center().open();

                    } else {
                        toastr.error(e.data.metaData.message, 'Info');
                        // window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isRouteLoading = false;
                }, function (err) {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.idPasien = dataPasienSelected.nocmfk;
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                    $scope.objectagamafk = dataPasienSelected.objectagamafk;
                    $scope.objectpendidikanfk = dataPasienSelected.objectpendidikanfk;
                    $scope.objectpekerjaanfk = dataPasienSelected.objectpekerjaanfk;
                    $scope.objectdesakelurahanfk = dataPasienSelected.objectdesakelurahanfk;
                    $scope.objectkesatuanfk = dataPasienSelected.objectkesatuanfk;
                    $scope.objectsatuankerjafk = dataPasienSelected.objectsatuankerjafk;
                    $scope.nohp = dataPasienSelected.nohp;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }
            $scope.klikdua = function (dataPasienSelected) {
                if (dataPasienSelected == undefined) return;
                medifirstService.get('registrasi/get-foto-by-id/' + dataPasienSelected.nocmfk).then(function (e) {
                    $scope.item.image = e.data.foto
                    debugger
                    $scope.popUpPhoto.center().open()
                })
            }
            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.formatTanggaljam = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })


            $scope.RegistrasiPasien = function () {

                debugger
                // var departement = $scope.$resolve.$stateParams.departemen;
                var user = medifirstService.getMapLoginUserToRuangan();
                // var user = medifirstService.getPegawaiLogin();
                debugger
                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }
                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }

                // if (user.length != 0) {
                //     if (user[0].objectdepartemenfk == 3) {
                //         // if ($scope.nohp === undefined || $scope.nohp === '-') {
                //         //     toastr.error('No HandPhone Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                //         //     return
                //         // }
                //         if ($scope.objectagamafk === undefined || $scope.objectagamafk === '0' || $scope.objectagamafk === null) {
                //             toastr.error('Agama Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                //             return
                //         }
                //     } else { 
                //         if ($scope.dataPasienSelected.noidentitas.length == 16) {
                //             toastr.error('NIK Harus 16 Karakter!!!')
                //             return
                //         }
                //         if ($scope.objectagamafk === undefined || $scope.objectagamafk === '0' || $scope.objectagamafk === null) {
                //             toastr.error('Agama Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                //             return
                //         }
                //         if ($scope.objectpendidikanfk === undefined || $scope.objectpendidikanfk === '13' || $scope.objectpendidikanfk === null) {
                //             toastr.error('Pendidikan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                //             return
                //         }
                //         if ($scope.objectpekerjaanfk === undefined || $scope.objectpekerjaanfk === null) {
                //             toastr.error('Pekerjaan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                //             return
                //         }
                //         if ($scope.objectdesakelurahanfk === undefined || $scope.objectdesakelurahanfk === null) {
                //             toastr.error('Kelurahan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                //             return
                //         }
                //         if ($scope.nohp === undefined || $scope.nohp === '-') {
                //             toastr.error('No HandPhone Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                //             return
                //         }

                //         if ($scope.objectpekerjaanfk === '6') {
                //             if ($scope.objectkesatuanfk === undefined || $scope.objectkesatuanfk === null || $scope.objectkesatuanfk === '3' || $scope.objectkesatuanfk === '7') {
                //                 toastr.error('Kesatuan Tidak Boleh Lain Nya, Silahkan Edit Data Pasien, Peringatan !')
                //                 return
                //             }
                //             if ($scope.objectsatuankerjafk === undefined || $scope.objectsatuankerjafk === null) {
                //                 toastr.error('Satuan Kerja Tidak Kosong, Silahkan Edit Data Pasien, Peringatan !')
                //                 return
                //             }
                //         }
                //     }
                // } else {

                if ($scope.dataPasienSelected.objectnegarafk == undefined && $scope.dataPasienSelected.objectnegarafk == null && $scope.dataPasienSelected.objectnegarafk == '') {
                    toastr.error('Negara Belum diisi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                } else if ($scope.dataPasienSelected.objectnegarafk == 0) {
                    if ($scope.dataPasienSelected.noidentitas == undefined || $scope.dataPasienSelected.noidentitas == null || $scope.dataPasienSelected.noidentitas == '') {
                        toastr.error('NIK Harus 16 Karakter, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                    if ($scope.dataPasienSelected.noidentitas.length != 16) {
                        toastr.error('NIK Harus 16 Karakter, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                    if ($scope.dataPasienSelected.noidentitas == '0000000000000000') {
                        toastr.error('NIK Salah, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                } else {
                    if ($scope.dataPasienSelected.noidentitas == undefined || $scope.dataPasienSelected.noidentitas == null || $scope.dataPasienSelected.noidentitas == '') {
                        toastr.error('NIK Harus 16 Karakter, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                }
                // if ($scope.dataPasienSelected.noidentitas == undefined || $scope.dataPasienSelected.noidentitas == null || $scope.dataPasienSelected.noidentitas == '') {
                //     toastr.error('NIK Harus 16 Karakter, Silahkan Edit Data Pasien, Peringatan !')
                //     return
                // }
                // if ($scope.dataPasienSelected.noidentitas.length != 16) {
                //     toastr.error('NIK Harus 16 Karakter, Silahkan Edit Data Pasien, Peringatan !')
                //     return
                // }
                if ($scope.objectagamafk === undefined || $scope.objectagamafk === '0' || $scope.objectagamafk === null) {
                    toastr.error('Agama Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectpendidikanfk === undefined || $scope.objectpendidikanfk === '13' || $scope.objectpendidikanfk === null) {
                    toastr.error('Pendidikan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectpekerjaanfk === undefined || $scope.objectpekerjaanfk === null) {
                    toastr.error('Pekerjaan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectdesakelurahanfk === undefined || $scope.objectdesakelurahanfk === null) {
                    toastr.error('Kelurahan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.nohp === undefined || $scope.nohp === '-') {
                    toastr.error('No HandPhone Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }

                if ($scope.nohp.length == 10 || $scope.nohp.length == 11 || $scope.nohp.length == 12 || $scope.nohp.length == 13) {

                } else {
                    toastr.error('No HandPhone Belum Di Isi Dengan Baik, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }

                if ($scope.objectpekerjaanfk === '6') {
                    if ($scope.objectkesatuanfk === undefined || $scope.objectkesatuanfk === null || $scope.objectkesatuanfk === '3' || $scope.objectkesatuanfk === '7') {
                        toastr.error('Kesatuan Tidak Boleh Lain Nya, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                    if ($scope.objectsatuankerjafk === undefined || $scope.objectsatuankerjafk === null) {
                        toastr.error('Satuan Kerja Tidak Kosong, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                }
                // }

                cacheHelper.set('cacheStatusPasien', 'LAMA');
                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }
            $scope.RegistrasiPasienPegawai = function () {

                debugger;
                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }

                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }
                if ($scope.objectagamafk === undefined || $scope.objectagamafk === '0' || $scope.objectagamafk === null) {
                    toastr.error('Agama Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectpendidikanfk === undefined || $scope.objectpendidikanfk === '13' || $scope.objectpendidikanfk === null) {
                    toastr.error('Pendidikan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectpekerjaanfk === undefined || $scope.objectpekerjaanfk === null) {
                    toastr.error('Pekerjaan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectdesakelurahanfk === undefined || $scope.objectdesakelurahanfk === null) {
                    toastr.error('Kelurahan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.nohp === undefined || $scope.nohp === '-') {
                    toastr.error('No HandPhone Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }

                if ($scope.objectpekerjaanfk === '6') {
                    if ($scope.objectkesatuanfk === undefined || $scope.objectkesatuanfk === null || $scope.objectkesatuanfk === '3' || $scope.objectkesatuanfk === '7') {
                        toastr.error('Kesatuan Tidak Boleh Lain Nya, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                    if ($scope.objectsatuankerjafk === undefined || $scope.objectsatuankerjafk === null) {
                        toastr.error('Satuan Kerja Tidak Kosong, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                }

                cacheHelper.set('cacheStatusPasien', 'LAMA');
                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("RegistrasiPegawaiToPasienCtrl", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("RegistrasiPegawaiToPasienCtrl", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }
            $scope.HapusRegistrasiPasienPegawai = function () {

                debugger;
                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin mau menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    if ($scope.idPasien != undefined) {
                        var item = {
                            idpasien: $scope.idPasien
                        }

                        medifirstService.post('registrasi/hapus-pasienisoman', item).then(function (e) {
                            loadData();
                        })

                    } else {
                        messageContainer.error("Pilih data dulu!")
                    }
                })



            }
            $scope.EditPasien = function () {
                if ($scope.nocm != undefined) {

                    cacheHelper.set('CacheRegisBayi', undefined);
                    $state.go('RegistrasiPasienBaru', {
                        noRec: 0,
                        idPasien: $scope.idPasien
                    })


                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }
            $scope.HapusPasien = function () {
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin mau menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    if ($scope.idPasien != undefined) {
                        var item = {
                            idpasien: $scope.idPasien
                        }

                        medifirstService.post('registrasi/update-false-pasien', item).then(function (e) {
                            loadData();
                        })

                    } else {
                        messageContainer.error("Pilih data dulu!")
                    }
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
            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.labelpasien = function () {
                // if($scope.item != undefined){
                //     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
                //     window.open(fixUrlLaporan, '', 'width=800,height=600')
                // }
                $scope.dats = {
                    qty: 0
                }
                $scope.dialogCetakLabel.center().open();
            }
            $scope.pilihQty = function (data) {
                debugger;
                var listRawRequired = [
                    "dats.qty|k-ng-model|kuantiti"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var qty = data.qty;
                    var qtyhasil = data.qty * 2;
                    if (qty !== undefined) {
                        // var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
                        // window.open(fixUrlLaporan, '', 'width=800,height=600')
                        //cetakan langsung service VB6 by grh

                        //##save identifikasi label pasien
                        medifirstService.get("registrasi/identifikasi-label?norec_pd=" +
                            $scope.dataPasienSelected.nocm + '&islabel=' + qtyhasil
                        ).then(function (data) {
                            var datas = data.data;
                        })
                        //##end

                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataPasienSelected.nocm + '&view=false&qty=' + qty, function (response) {
                            // do something with response
                        });

                    }
                    $scope.dialogCetakLabel.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            };
            $scope.kartupasien = function () {
                debugger
                var qrcode = $scope.dataPasienSelected.nocm
                // var qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.dataPasienSelected.noregistrasi
                var norec = $scope.dataPasienSelected.nocmfk
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norec", "qrcode"],
                    "paramValue": [norec, $scope.dataPasienSelected.nocm], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                debugger
                medifirstService.get("registrasi/identifikasi-kartu-pasien?nocmfk=" +
                    $scope.dataPasienSelected.nocmfk
                ).then(function (data) {
                    var datas = data.data;
                    debugger
                })
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
                    xhr.open('POST', 'http://192.168.0.62:1000/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:1000/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1000/generic/report/kartupasien2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kartupasien2.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.pasienBaru = function () {
                var user = medifirstService.getMapLoginUserToRuangan();
                debugger
                // body...
                if (user.length != 0) {
                    if (user[0].objectdepartemenfk == 3) {
                        toastr.error('ANDA TIDAK BISA MENGGUNAKAN TOMBOL INI, Peringatan !')
                        return
                    } else {
                        $state.go("RegistrasiPasienBaru", {
                            noRec: 0,
                            idPasien: 0
                        })
                    }
                } else {
                    $state.go("RegistrasiPasienBaru", {
                        noRec: 0,
                        idPasien: 0
                    })
                }
            }


            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatRegistrasi.xlsx",
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
                    "template": "<span class='style-left'>{{formatTanggaljam('#: tglregistrasi #')}}</span>"
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

            $scope.RiwayatRegistrasi = function () {
                debugger;
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
            }

            $scope.TutupPopUp = function () {
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
                    .then(function (data) {
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

            $scope.SearchEnterDetail = function () {
                loadDataRiwayat();
            }

            function saveBase64AsFile(base64, fileName) {

                var link = document.createElement("a");

                link.setAttribute("href", base64);
                link.setAttribute("download", fileName);
                link.click();
            }
            $scope.saveImage = function () {
                saveBase64AsFile($scope.item.image, 'asa.jpg')
                // var img = document.getElementById('embedImage');
                // img.src = $scope.item.image
                // window.location.href = img.src.replace('image/png', 'image/octet-stream');
            }
            window.addEventListener('DOMContentLoaded', () => {

                var img = document.getElementById('embedImage');
                img.src = $scope.item.image

                img.addEventListener('load', () => button.removeAttribute('disabled'));

                const button = document.getElementById('saveImage');
                button.addEventListener('click', () => {
                    window.location.href = img.src.replace('image/jpg', 'image/octet-stream');
                });
            });
            $scope.inputRMManual = function () {
                $scope.popUpManual.center().open()
            }
            $scope.saveNormManual = function () {
                if ($scope.item.normManual.length < 7) {
                    toastr.warning('Nomor Rekam Medis Harus 7 Digit')
                    return
                }
                var rm = ""
                if ($scope.item.normManual != undefined) {
                    rm = "&norm=" + $scope.item.normManual
                }
                medifirstService.get("registrasi/get-pasien?" + rm)
                    .then(function (data) {
                        debugger;
                        if (data.data.daftar.length != 0) {
                            toastr.warning('Nomor Rekam Medis Sudah Di Pakai')
                            return
                        } else {
                            var post = {
                                normmanual: $scope.item.normManual
                            }
                            medifirstService.post('registrasi/save-mr-manual', post).then(function (e) {
                                debugger;
                                if (e.data.data == "false") {
                                    toastr.warning('Nomor Rekam Medis Lebih Besar Dari Nomor RM Terakhir')
                                    return
                                } else {
                                    $scope.saveLogging('NoRM Manual', 'Id Pasien', e.data.data.kodeexternal, 'Input NoRM Manual ')
                                    cacheHelper.set('CacheRegisBayi', undefined);
                                    $state.go('RegistrasiPasienBaru', {
                                        noRec: 0,
                                        idPasien: e.data.data.kodeexternal
                                    })
                                }
                            })
                        }
                    });
            }

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.gabungkanNoRM = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error("Pilih data dulu!")
                }
                $scope.item.idRmAsal = $scope.dataPasienSelected.nocmfk
                $scope.item.rmAsal = $scope.dataPasienSelected.nocm
                $scope.item.namaPasienAsal = $scope.dataPasienSelected.namapasien
                $scope.popUpGabungkan.center().open()
            }
            $scope.saveGabungkan = function () {
                if ($scope.item.rmTujukan == undefined) return;
                if ($scope.item.idRmAsal == undefined) return;
                if ($scope.item.password != "cuankiserayu") {
                    toastr.error("Password Salah!")
                    return;
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda yakin menggabungkan No RM ' + $scope.item.rmAsal + ' Ke ' + $scope.item.rmTujukan + ' ?!')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var data = {
                        idasal: $scope.item.idRmAsal,
                        nocmasal: $scope.item.rmAsal.trim(),
                        nocmtujuan: $scope.item.rmTujukan.trim(),
                    }
                    medifirstService.post('registrasi/merge-nomor-rm', data).then(function (e) {
                        if (e.status === 201) {
                            debugger;
                            medifirstService.post('registrasi/save-log-mergenocm', data).then(function (e) { })
                        }
                        $scope.popUpGabungkan.close()
                        $scope.item.idRmAsal = undefined
                        loadData()

                    })
                })
            }
            $scope.tambahData = function (item) {
                debugger
                if (item == undefined) {
                    $scope.statEdit = false;
                    if ($scope.dataPasienSelected == undefined) {
                        messageContainer.error("Pilih data dulu!")
                    }
                    $scope.item.jenisKontrol = { "id": "2", "name": "SPRI" }
                    $scope.item.tanggalRencakaKontrol = $scope.now;
                    $scope.isControl = false
                    $scope.isSPRI = true

                    $scope.item.noPenunjang = $scope.dataPasienSelected.nobpjs
                    $scope.item.noBPJS = $scope.dataPasienSelected.nobpjs;
                    delete $scope.item.noSuratKontrol
                    delete $scope.item.poliKontrol
                    delete $scope.item.kodeDokter
                } else {
                    $scope.statEdit = true;
                    let jkon = {};
                    if (item.jnsKontrol == 1) {
                        jkon = { "id": "2", "name": "SPRI" }
                        $scope.item.noPenunjang = item.noKartu
                        $scope.item.noBPJS = item.noKartu
                        $scope.isControl = false
                        $scope.isSPRI = true
                    } else {
                        jkon = { "id": "1", "name": "Rencana Kontrol" }
                        $scope.item.noPenunjang = item.noSepAsalKontrol
                        $scope.isControl = true
                        $scope.isSPRI = false
                    }
                    $scope.item.jenisKontrol = jkon;
                    $scope.item.tanggalRencakaKontrol = item.tglRencanaKontrol;
                    $scope.item.noSuratKontrol = item.noSuratKontrol;
                    $scope.item.poliKontrol = { "kode": item.poliTujuan, "nama": item.namaPoliTujuan };
                    $scope.item.kodeDokter = { "kode": item.kodeDokter, "nama": item.namaDokter };
                }

                $scope.popUpTambah.center().open();
            }

            $scope.changeJenisPelayanan = function (e) {
                delete $scope.item.noPenunjang
                delete $scope.item.noSuratKontrol
                delete $scope.item.poliKontrol
                delete $scope.item.kodeDokter
                if ($scope.item.jenisKontrol.id == 2) {
                    $scope.item.noPenunjang = $scope.item.noBPJS
                    $scope.isControl = false
                    $scope.isSPRI = true
                    $scope.isRujukan = false
                    $scope.isRujukanBalik = false
                } else if ($scope.item.jenisKontrol.id == 1) {
                    $scope.RiwayatRegistrasiforKonSpri()
                    $scope.isControl = true
                    $scope.isSPRI = false
                    $scope.isRujukan = false
                    $scope.isRujukanBalik = false
                } else if ($scope.item.jenisKontrol.id == 3) {
                    medifirstService.getPart("bridging/bpjs2/get-ref-faskes-part?jenisFaskes=" +
                        2, true, 10, 10)
                        .then(function (x) {
                            $scope.listFaskess = x;
                        })
                    medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function (data) {
                        $scope.sourceDiagnosa = data;
                    });
                    $scope.RiwayatRegistrasiforKonSpri()
                    $scope.isControl = false
                    $scope.isSPRI = false
                    $scope.isRujukan = true
                    $scope.isRujukanBalik = false
                } else if ($scope.item.jenisKontrol.id = 4) {
                    $scope.RiwayatRegistrasiforKonSpri()
                    $scope.item.noKartu = $scope.dataPasienSelected.nobpjs
                    $scope.isControl = false
                    $scope.isSPRI = false
                    $scope.isRujukan = false
                    $scope.isRujukanBalik = true
                    medifirstService.get("bridging/bpjs2/get-programPRB").then(function (data) {
                        $scope.listprogramPRB = data.data.response.list;
                    });
                    medifirstService.getPart("bridging/bpjs2/get-obatprb", true, true, 10).then(function (data) {
                        $scope.listObat = data;
                    });
                }
            }
            var onChange = function (e) {
                var grid = $(this).data("mainGridOptions");

            }
            $scope.mainGridOptions = {
                sortable: true,
                autoSync: true,
                change: onChange,
                batch: true,
                selectable: 'row',
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [
                    {
                        "field": "Obat",
                        "title": "<h3 align=center>Obat</h3>",
                        "width": "300px"
                    },
                    {
                        "field": "signa1",
                        "title": "<h3 align=center>Signa 1</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "signa2",
                        "title": "<h3 align=center>Signa 2</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        "field": "qty",
                        "title": "<h3 align=center>Qty</h3>",
                        "width": "70px",
                        "attributes": { align: "center" }
                    },
                    {
                        command: {
                            text: "Hapus",
                            width: "50px",
                            align: "center",
                            attributes: { align: "center" },
                            click: removeRowTindakan,
                            imageClass: "k-icon k-delete"
                        },
                        title: "",
                        width: "80px",
                    }
                ],

            };
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: {
                        data: $scope.gridPetugasPelaksana._data,
                        filter: { field: "idParent", operator: "eq", value: dataItem.rowNumber }
                    },
                    columns: [
                        {
                            field: "jenisPetugas.jenisPelaksana",
                            title: "Jenis Pelaksana",
                            width: "100px",
                            template: "#= jenisPetugas.jenisPelaksana #"
                        },
                        {
                            field: "listPetugas[0].namalengkap",
                            title: "Nama Pegawai",
                            width: "200px",
                            template: multiSelectArrayToString
                        }
                    ]
                };
            };
            function removeRowTindakan(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                if (!dataItem) return

                // grid.removeRow(row);
                $scope.dataTindakan.remove(dataItem);
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].rowNumber == dataItem.rowNumber) {

                        data2.splice(i, 1);
                        // var subTotal = 0;
                        for (var j = data2.length - 1; j >= 0; j--) {
                            // subTotal = subTotal + parseFloat(data2[j].subTotal)
                            // data2[j].rowNumber = j + 1
                        }
                        // $scope.dataTindakan = new kendo.data.DataSource({
                        //   data: data2
                        // });
                        for (var j = bacot.length - 1; j >= 0; j--) {
                            if (bacot[j].id_indikator == dataItem.id_indikator) {
                                bacot.splice(j, 1);
                            }
                        }

                    }
                }


                var subTotal = 0;
                for (var i = data2.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat(data2[i].subTotal)
                }
                $scope.item.totalAlls = $scope.formatRupiah(subTotal, 'Rp.')

                var gridPetugas = $scope.gridPetugasPelaksana._data;
                if (gridPetugas.length != 0) {
                    for (var i = gridPetugas.length - 1; i >= 0; i--) {
                        if (gridPetugas[i].idParent == dataItem.rowNumber) {
                            gridPetugas.splice(i, 1);
                            $scope.gridPetugasPelaksana.add(gridPetugas);
                        }
                    }
                }
            }
            $scope.tambahTindakan = function () {
                $scope.tambahTindakans(false);
            }
            $scope.tambahTindakans = function () {
                var nomor = 0
                if ($scope.dataTindakan == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};

                data = {
                    rowNumber: nomor,
                    Obat: $scope.item.obat.nama,
                    kdObat: $scope.item.obat.kode,
                    signa1: $scope.item.signa1,
                    signa2: $scope.item.signa2,
                    qty: $scope.item.jumlahObat
                }
                data2.push(data)

                $scope.dataTindakan = new kendo.data.DataSource({
                    data: data2
                });

                $scope.show = true;
                kosongkan();
            }
            $scope.RiwayatRegistrasiforKonSpri = function () {
                debugger;
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                $scope.setCekHistorySEP($scope.dataPasienSelected, true);
                // $scope.popUpRiwayatRegistrasiforKonSpri.center().open();
                // var actions = $scope.popUpRiwayatRegistrasiforKonSpri.options.actions;
                // actions.splice(actions.indexOf("Close"), 1);
                // $scope.popUpRiwayatRegistrasiforKonSpri.setOptions({ actions: actions });
            }
            $scope.setCekHistorySEP = function (dataPasienSelected, stat) {
                debugger
                $scope.item.forSukon = stat;
                $scope.isRouteLoading = true;
                $scope.nocmKirim = dataPasienSelected.nocm;
                medifirstService.get("bridging/bpjs2/monitoring/HistoriPelayanan-duabulan/NoKartu/" + dataPasienSelected.nobpjs).then(function (data) {
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
                                    fields: {
                                    }
                                }
                            }
                        });
                    } else {
                        $scope.popUpHistoriPelayananPeserta.center().open()
                        toastr.info(data.data.metaData.message, 'Status Peserta');
                        $scope.isRouteLoading = false;
                    }
                    $scope.isRouteLoading = false;
                }, function (err) {
                    $scope.isRouteLoading = false;
                });
            }
            var onDataBound = function (e) {
                $('td').each(function () {
                    // if ($(this).text() == '1') { $(this).text('Belum di Coder') }
                    // if ($(this).text() == 'Belum di Coder') { $(this).addClass('koneng') }
                    // if ($(this).text() == 'BELUM') { $(this).text('Belum di Grouping') }
                    // if ($(this).text() == 'Belum di Grouping') { $(this).addClass('koneng') }
                    if ($(this).text() == 'INSTALASI GAWAT DARURAT') { $(this).addClass('koneng') }
                })
            }
            $scope.columnHistoriPeserta = {

                selectable: 'cell',
                // dataBound: onDataBound,
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "noSep",
                        "title": "No SEP",
                        "width": "130px",

                        "template": "<button class=\"k-button custom-button\" ng-click=\"setSep(dataItem)\"  style=\"margin:0 0 5px\">#:  noSep #</button> ",
                        attributes: {
                            class: "#=jnsPelayanan == 1 ? 'koneng' : 'yellow' #"
                        },

                    },
                    {
                        "field": "tglSep",
                        "title": "Tgl SEP",
                        "width": "80px"
                    },
                    {
                        "field": "noRujukan",
                        "title": "No Rujukan",
                        "width": "110px"
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
                        "width": "70px"
                    },
                    {
                        "field": "poli",
                        "title": "Poli",
                        "width": "90px",
                        attributes: {
                            class: "#=poli == 'INSTALASI GAWAT DARURAT' ? 'red' : 'yellow' #"
                        },
                    },
                    {
                        "field": "diagnosa",
                        "title": "Diagnosa",
                        "width": "150px"
                    },
                    {
                        "field": "ppkPelayanan",
                        "title": "Asal SEP",
                        "width": "110px"
                    },

                ]
            };
            $scope.setSep = function (dataPasienSelected) {
                $scope.popUpHistoriPelayananPeserta.close();
                var user = medifirstService.getMapLoginUserToRuangan();

                if ($scope.item.forSukon == true) {
                    $scope.setNoSEP(dataPasienSelected)
                } else {
                    cacheHelper.set('cacheStatusPasien', 'LAMA');
                    if (!$scope.isPenunjang) {
                        cacheHelper.set('isPenunjang', undefined);
                        $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                            noCm: $scope.nocmKirim,
                            bpJS: true,
                            norujukan: dataPasienSelected.noSep,
                            faskes: 3
                        })
                        var cacheSet = undefined;
                        cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                        var cacheSetss = undefined;
                        cacheHelper.set('CacheRegisOnline', cacheSetss);

                    } else {
                        cacheHelper.set('isPenunjang', true);
                        $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                            noCm: $scope.nocm
                        })
                        var cacheSet = undefined;
                        cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                        var cacheSetss = undefined;
                        cacheHelper.set('CacheRegisOnline', cacheSetss);
                    }
                }
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
                } else if ($scope.item.jenisKontrol.id == 2) {
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
                } else if ($scope.item.jenisKontrol.id == 3) {
                    var dataSend = {
                        nosep: $scope.item.noPenunjang,
                        tglrujukan: new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                        tglRencanaKunjungan: new moment($scope.now).format('YYYY-MM-DD'),
                        jenispelayanan: $scope.item.jenisPelayananRujukan.id,
                        ppkdirujuk: $scope.item.diRujukKe,
                        catatan: $scope.item.alasanRujuk,
                        diagnosarujukan: $scope.item.diagnosa.kddiagnosa,
                        polirujukan: $scope.item.poliRujukan.kode,
                        tiperujukan: $scope.item.typeRujukan.id,
                        user: $scope.pegawai.namaLengkap

                    };
                    $scope.isRouteLoading = true;
                    medifirstService.postNonMessage("bridging/bpjs2/insert-rujukan-v2", dataSend).then(function (e) {
                        if (e.data.response) {
                            debugger
                            $scope.saveLogging('Input Rujukan', 'No Surat Rujukan', e.data.response.rujukan.noRujukan, 'Input Rujukan ' + e.data.response.rujukan.noRujukan + ' Ke Faskes ' + $scope.item.diRujukKe.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRujukan).format('YYYY-MM-DD'))
                            $scope.isRouteLoading = false;
                            $scope.item.noSuratKontrol = e.data.response.rujukan.noRujukan
                            toastr.success('Generate Rujukan Success. No Rujukan : ' + e.data.response.rujukan.noRujukan, 'Status');
                            $scope.synchronizeKontrolAndSPRI();
                        } else {
                            $scope.isRouteLoading = false;
                            window.messageContainer.error(e.data.metaData.message)
                        }
                    }, function (err) {
                        $scope.isRouteLoading = false;
                    });
                } else if ($scope.item.jenisKontrol.id == 4) {
                    $scope.isRouteLoading = true;
                    var x = [];
                    data2.forEach(function (e) {
                        if (e.value == data) {
                            e.isChecked = true
                            var dataid = {
                                "kdObat": e.kdObat,
                                "signa1": e.signa1,
                                "signa2": e.signa2,
                                "jmlObat": e.qty
                            }
                            x.push(dataid)
                        }
                    })
                    var dataSend = {
                        "data": {
                            "request": {
                                "t_prb":
                                {
                                    "noSep": $scope.item.noPenunjang,
                                    "noKartu": $scope.item.noKartu,
                                    "alamat": $scope.item.alamatPeserta,
                                    "email": $scope.item.email,
                                    "programPRB": $scope.item.programPRB.kode,
                                    "kodeDPJP": $scope.item.kodeDokter.kode,
                                    "keterangan": $scope.item.keterangan,
                                    "saran": $scope.item.saran,
                                    "user": $scope.pegawai.namaLengkap,
                                    "obat":

                                        x

                                }
                            }
                        }
                    };
                    medifirstService.postNonMessage('bridging/bpjs2/insert-prb', dataSend).then(function (e) {
                        if (e.data.response) {
                            debugger
                            $scope.saveLogging('Input Rujukan', 'No Surat Rujukan', e.data.response.rujukan.noRujukan, 'Input Rujukan ' + e.data.response.rujukan.noRujukan + ' Ke Faskes ' + $scope.item.diRujukKe.nama + 'Untuk Tanggal ' + moment($scope.item.tanggalRujukan).format('YYYY-MM-DD'))
                            $scope.isRouteLoading = false;
                            $scope.item.noSuratKontrol = e.data.response.rujukan.noRujukan
                            toastr.success('Generate Rujukan Success. No Rujukan : ' + e.data.response.rujukan.noRujukan, 'Status');
                            $scope.synchronizeKontrolAndSPRI();
                        } else {
                            $scope.isRouteLoading = false;
                            window.messageContainer.error(e.data.metaData.message)
                        }
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    });
                }
            }
            $scope.setNoSEP = function (data) {
                debugger
                if (data.noSep == '') {
                    messageContainer.error("SEP tidak ditemukan di sistem Transmedic!")
                    return
                } else if (data.poli == 'INSTALASI GAWAT DARURAT') {
                    messageContainer.error("SEP IGD Tidak Bisa Di Buatkan Surat Kontrol!, Pilih SEP Yang Lain!")
                    return
                }
                $scope.item.noRujukan = undefined;
                $scope.item.tanggalRujukan = undefined;
                $scope.item.poliRujukan = undefined;
                $scope.item.tglRujukanSecond = 0;
                $scope.cekNoRujukan(data.noRujukan, data.noSep, data.poli)
                // let stat = $scope.cekNoRujukan(data.noRujukan);
                // if ($scope.cekNoRujukan(data.noRujukan) == false) {
                //     // let stats = $scope.cekNoKartu(data.noRujukan);
                //     if ($scope.cekNoKartu(data.noRujukan) == false) {
                //         finalSet(undefined);
                //     } else {
                //         finalSet(data.noSep)
                //     }
                // } else {
                //     finalSet(data.noSep)
                // }


                // $scope.item.noPenunjang = data.noSep
                // $scope.itemD.noRM = undefined;
                // $scope.itemD.namaPasien = undefined;
                // $scope.itemD.tglLahir = undefined;
                // $scope.itemD.noRegistrasi = undefined;
                // $scope.itemD.JumlahRawat = undefined;
                // $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                //     data: []
                // });
                // $scope.popUpRiwayatRegistrasiforKonSpri.close();
            }
            $scope.cekNoRujukan = function (noKartu, noSep, poli) {
                debugger
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs2/get-rujukan-pcare?norujukan=" + noKartu).then(function (e) {
                    debugger
                    if (e.data.metaData.code == 201) {
                        // $scope.isRouteLoading = false;
                        // toastr.info(e.data.metaData.message, 'Info')
                        medifirstService.get("bridging/bpjs2/get-rujukan-rs?norujukan=" + noKartu).then(function (e) {
                            debugger
                            if (e.data.metaData.code == 201) {
                                $scope.isRouteLoading = false;
                                toastr.info(e.data.metaData.message, 'Info')
                                // $scope.cekNoKartu(noKartu, noSep, poli)
                            } else {
                                $scope.item.noRujukan = e.data.response.rujukan.noKunjungan;
                                $scope.item.poliRujukan = e.data.response.rujukan.poliRujukan.nama;
                                $scope.item.tanggalRujukan = e.data.response.rujukan.tglKunjungan;
                                let dateSce = new Date(e.data.response.rujukan.tglKunjungan);
                                $scope.item.tglRujukanSecond = dateSce.getTime() / 1000 + 7689600;
                                finalSet(noSep)
                            }
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        });
                    } else {
                        $scope.item.noRujukan = e.data.response.rujukan.noKunjungan;
                        $scope.item.poliRujukan = e.data.response.rujukan.poliRujukan.nama;
                        $scope.item.tanggalRujukan = e.data.response.rujukan.tglKunjungan;
                        let dateSce = new Date(e.data.response.rujukan.tglKunjungan);
                        $scope.item.tglRujukanSecond = dateSce.getTime() / 1000 + 7689600;
                        finalSet(noSep)
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            function finalSet(noSep) {
                $scope.item.noPenunjang = noSep
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
            }
            $scope.checkDPJP = function () {
                medifirstService.get("bridging/bpjs2/get-ref-dokter-dpjp?jenisPelayanan=" + 2
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis="
                    + $scope.item.poliKontrol.kode).then(function (z) {
                        if (z.data.metaData.code == 200) {
                            $scope.listkodeDokter = z.data.response.list;
                        }
                        else
                            toastr.info('Dokter DPJP tidak ada', 'Info')
                    });
            }
            $scope.synchronizeKontrolAndSPRI = function () {
                $scope.isRouteLoading = true;
                medifirstService.get(`bridging/bpjs2/cari-rencana-kontrol-v2-all?tglAwal=${moment($scope.now).format('YYYY-MM-DD')}&tglAkhir=${moment($scope.now).format('YYYY-MM-DD')}&filter=${2}`).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        let post = {
                            data: e.data.response
                        }
                        medifirstService.post('registrasi/save-list-no-control-n-spri-from-bpjs', post).then(function (e) {
                            $scope.isRouteLoading = false;
                            if (e.data.status == 201) {
                                $scope.saveLogging('Get List Control dan SPRI', 'tanggal', moment($scope.now).format('YYYY-MM-DD'), `Get List Data Kontrol dan SPRI pada tanggal ${moment($scope.now).format('YYYY-MM-DD')}, dengan filter Tanggal Rencana Kontrol`)
                                cacheHelper.set('CacheRegisBayi', undefined);
                                $state.go('RegistrasiPasienBaru', {
                                    noRec: 0,
                                    idPasien: e.data.data.kodeexternal
                                })
                            }
                        })
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                }, function (err) {
                    $scope.isRouteLoading = false;
                });
            }

            ///////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});