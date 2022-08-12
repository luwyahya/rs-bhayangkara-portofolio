define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRegistrasiPasienOperatorCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
        function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = $scope.now
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.item.tglDokumen = $scope.now
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.istempatLaporan = true;
            $scope.cboUbahSEP = true;
            $scope.cboSep = false;
            $scope.item.jmlRows = 50
            $scope.dataSelectedUpload = '';
            loadCombo();
            loadData();
            // postIKTvisite()

            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienOperatorCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    // if(arrPeriode[2]!= "")
                    // 	$scope.item.noReg = arrPeriode[2];	
                    // if(arrPeriode[3]!= "")	
                    // 	$scope.item.noRm = arrPeriode[3];	
                    // if(arrPeriode[4]!= "")
                    // 	$scope.item.nama = arrPeriode[4];			
                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59')); //$scope.now;
                    // $scope.item.tglpulang = $scope.now;					
                }
                medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listjaminanKhusus = data.data.jaminankhusus;
                    $scope.listDokter = data.data.dokter;
                    $scope.listDokter2 = data.data.dokter;
                    $scope.listRuanganBatal = data.data.ruanganall;
                    $scope.item.PegawaiLogin = data.data.pegawaiLogin;
                    // $scope.listRuanganApd = data.data.ruanganall;
                    $scope.listPembatalan = data.data.pembatalan;
                    $scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
                    $scope.item.jenisDiagnosis = { id: data.data.jenisdiagnosa[0].id, jenisdiagnosa: data.data.jenisdiagnosa[0].jenisdiagnosa };

                });
                medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
                    //  debugger;
                    $scope.sourceDiagnosisPrimer = data;
                });
                medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
                    $scope.listDataPegawai = e;
                })
                $scope.listJenis = [{ "id": 1, "name": "Hapus Semua" }, { "id": 2, "name": "Batal Rawat Inap" }]
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            // function getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk){
            //              if (unitBpjs == "BPJS" && (unitSep==null || unitSep==undefined || unitSep=="")) {
            //                  return "red";
            //              }else if(unitBpjs=="BPJS" && unitDept=="16" && unitPpk !="0240R008"){
            //                  return "koneng";
            //              }
            //          }

            var onDataBound = function (e) {
                var columns = e.sender.columns;
                var rows = e.sender.tbody.children();

                for (var j = 0; j < rows.length; j++) {
                    // sisa sekarang
                    var row = $(rows[j]);
                    var dataItem = e.sender.dataItem(row);

                    var unitBpjs = dataItem.get("kelompokpasien");
                    var unitDept = dataItem.get("deptid");
                    var unitPpk = dataItem.get("ppkrujukan");
                    var unitSep = dataItem.get("nosep");

                    var cellSEP = row.children().eq(12);
                    cellSEP.addClass(getNotifSEP(unitBpjs, unitSep, unitDept, unitPpk));

                    var isdiag = dataItem.get("isdiagnosis");
                    var cellDiag = row.children().eq(13);
                    cellDiag.addClass(getNotifDiag(isdiag));

                }
            }
            // $("#kGrid").kendoGrid({
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
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: tglregistrasi #</span>"
                    "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
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
                    attributes: {
                        class: "#=noreservasi != null ? 'hejo' : 'green' #"
                    },
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "150px",
                    "template": "<span class='style-left'>#: namaruangan #</span>"
                },
                {
                    "field": "namakelas",
                    "title": "Kelas ",
                    "width": "80px",
                    // "template": '# if( kelasditanggung==null) {# - # } else {# #= kelasditanggung # #} #'
                },
                {
                    "field": "namadokter",
                    "title": "Nama Dokter",
                    "width": "150px",
                    "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width": "100px",
                    "template": "<span class='style-left'>#: kelompokpasien #</span>"
                },
                {
                    "field": "namarekanan",
                    "title": "Penjamin",
                    "width": "100px",
                    "template": '# if( namarekanan==null) {# - # } else {# #= namarekanan # #} #'
                },
                {
                    "field": "jaminankhusus",
                    "title": "Jaminan Khusus",
                    "width": "100px",
                    "template": '# if( jaminankhusus==null) {# - # } else {# #= jaminankhusus # #} #'
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "80px",
                    // "template": "<span class='style-center'>#: tglpulang #</span>"
                    "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                },
                {
                    "field": "kelasditanggung",
                    "title": "Kelas Ditanggung",
                    "width": "80px",
                    "template": '# if( kelasditanggung==null) {# - # } else {# #= kelasditanggung # #} #'
                },
                {
                    "field": "nosep",
                    "title": "No SEP",
                    "width": "150px",
                    "template": '# if( nosep==null || nosep=="") {# - # } else {# #= nosep # #} #'
                },
                {
                    "title": "Upload Dokumen",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setLihatDokumen(dataItem)\"  style=\"margin:0 0 5px\">#:  'lihat' #</button> ",
                },
                {
                    "field": "isdiagnosis",
                    "title": "Diagnosis",
                    "width": "300px",
                    "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
                },
                {
                    hidden: true,
                    "field": "ppkrujukan",
                    "title": "PPK",
                    "width": "150px",
                },
                {
                    hidden: true,
                    "field": "deptid",
                    "title": "DeptId",
                    "width": "150px",
                },

                    // {
                    // 	"field": "statuspasien",
                    // 	"title": "Status Pasien",
                    // 	"width":"100px",
                    // }				
                ]
            };
            // });


            $scope.setLihatDokumen = function (dataPasienSelected) {
                debugger
                medifirstService.get("registrasi/get-data-combo-dokumen?jenisdokumen=noregistrasi")
                    .then(function (dat) {
                        $scope.listDokumen = dat.data.listcombodokumen;
                    });
                $scope.dataSelectedUpload = dataPasienSelected;

                medifirstService.get("registrasi/get-data-list-dokumen-registrasi?noregistrasi=" + dataPasienSelected.noregistrasi)
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
            // $scope.gambar = data.uploadfile;

            // $scope.gambar = "data:image/png;base64,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"


            $scope.upload = function () {
                var a = document.getElementById("base64textarea").value
                var b = document.getElementById("base64textarea").name

                var objData = {
                    noregistrasi: $scope.dataSelectedUpload.noregistrasi,
                    namafile: b,
                    base64File: a,
                    objectjenisdokumencasemix: $scope.item.namadokumen.id,
                    tglDokumen: $scope.item.tglDokumen
                }

                medifirstService.post('registrasi/upload-dokumen-registrasi', objData).then(function (e) {
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

            $scope.SearchData = function () {
                loadData()
            }

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
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }
                var cacheNoreg = ""
                if ($scope.item.noReg != undefined) {
                    cacheNoreg = $scope.item.noReg
                }
                var cacheNoRm = ""
                if ($scope.item.noRm != undefined) {
                    cacheNoRm = $scope.item.noRm
                }
                var cacheNama = ""
                if ($scope.item.nama != undefined) {
                    cacheNama = $scope.item.nama
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                var isBlmInputSep = ""
                if ($scope.item.blmInputSep != undefined) {
                    var isBlmInputSep = "&isBlmInputSep=" + $scope.item.blmInputSep
                }
                var isSepTdkSesuai = ""
                if ($scope.item.sepTdkSesuai != undefined) {
                    var isSepTdkSesuai = "&isSepTdkSesuai=" + $scope.item.sepTdkSesuai
                }
                var blmInputDiag = ""
                if ($scope.item.blmInputDiag != undefined) {
                    var blmInputDiag = "&isnotdiagnosis=" + $scope.item.blmInputDiag
                }
                var jaminankhusus = ""
                if ($scope.item.jaminankhusus != undefined) {
                    var jaminankhusus = "&jaminankhusus=" + $scope.item.jaminankhusus.namaexternal
                }


                $q.all([
                    medifirstService.get("registrasi/daftar-registrasi/get-daftar-registrasi-pasien?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk +
                        '&jmlRows=' + jmlRows +
                        isBlmInputSep + isSepTdkSesuai + blmInputDiag + jaminankhusus),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data[0].data.length; i++) {
                        data[0].data[i].no = i + 1
                        var umur = dateHelper.CountAge(new Date(data[0].data[i].tgllahir), new Date(data[0].data[i].tglregistrasi));
                        data[0].data[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr';

                        if (data[0].data[i].istelemedicine == '1') {
                            data[0].data[i].kelompokpasien = 'Telemedicine'
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


                    var chacePeriode = tglAwal + "~" + tglAkhir
                    // + "~" +cacheNoreg + "~" +cacheNoRm
                    // + "~" +cacheNama
                    // + "~" +$scope.item.instalasi 
                    // + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
                    // + "~" +$scope.item.dokter;
                    cacheHelper.set('DaftarRegistrasiPasienOperatorCtrl', chacePeriode);
                });

            };
            $scope.rekamMedisElektronik = function () {

                if ($scope.dataPasienSelected == undefined) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi=" +
                    $scope.dataPasienSelected.noregistrasi +
                    "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
                ).then(function (data) {

                    // debugger;
                    var arrStr = {
                        0: $scope.dataPasienSelected.nocm,
                        1: $scope.dataPasienSelected.namapasien,
                        2: $scope.dataPasienSelected.jeniskelamin,
                        3: $scope.dataPasienSelected.noregistrasi,
                        4: $scope.dataPasienSelected.umur,
                        5: $scope.dataPasienSelected.kelompokpasien,
                        6: $scope.dataPasienSelected.tglregistrasi,
                        7: data.data.ruangan[0].norec_apd,
                        8: $scope.dataPasienSelected.norec,
                        9: $scope.dataPasienSelected.objectkelasfk,
                        10: $scope.dataPasienSelected.namakelas,
                        11: $scope.dataPasienSelected.objectruanganlastfk,
                        12: $scope.dataPasienSelected.namaruangan + '`'
                    }
                    cacheHelper.set('cacheRMelektronik', arrStr);
                    $state.go('RekamMedis.VitalSign', {
                        noRec: data.data.ruangan[0].norec_apd
                    })
                })
            }

            function getNotifSEP(unitBpjs, unitSep, unitDept, unitPpk) {
                if (unitBpjs.indexOf("BPJS") > -1 && (unitSep == null || unitSep == undefined || unitSep == "")) {
                    return "red";
                } else if (unitBpjs.indexOf("BPJS") > -1 && unitDept == "16" && unitPpk != "1124R004") {
                    return "koneng";
                }
                // else if(unitBpjs.indexOf("BPJS") > -1 &&  (unitSep!=null && unitSep!=undefined && unitSep!="") ){
                // 	return "hejo";
                // }
            }

            function getNotifDiag(isdiag) {
                if (isdiag == false) {
                    return "red";
                }
            }

            // var onDataBound = function (e) {
            //              var columns = e.sender.columns;
            //              var rows = e.sender.tbody.children();

            //              for (var j = 0; j < rows.length; j++) {
            //                // sisa sekarang
            //                var row = $(rows[j]);
            //                var dataItem = e.sender.dataItem(row);

            //                var unitBpjs = dataItem.get("kelompokpasien");
            //                var unitDept = dataItem.get("deptid");
            //                var unitPpk = dataItem.get("ppkrujukan");
            //                var unitSep = dataItem.get("nosep");
            //                var cellSEP= row.children().eq(12);       
            //                cellSEP.addClass(getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk));

            //              }
            //            }
            $scope.UbahDokter = function () {
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');

                    return
                }
                $scope.popupDokter.center().open();
                // $scope.cboDokter = true
                // $scope.cboUbahDokter=false
                // $scope.cboUbahSEP=false
            }
            $scope.EditSEP = function () {
                $scope.item.noPeserta = "";
                $scope.item.noSep = "";

                if ($scope.dataPasienSelected.norec == null) {
                    messageContainer.error("Pasien Belum Dipilih!!")
                    return;
                }
                if ($scope.dataPasienSelected.kelompokpasien == "Umum/Pribadi") {
                    messageContainer.error("Tipe Pasien Umum!!")
                    return;
                }
                if ($scope.dataPasienSelected.norec_pa == null) {
                    messageContainer.error("Pemakaian Asuransi tidak ada")
                    return;
                }

                if ($scope.dataPasienSelected.nokepesertaan != undefined) {
                    $scope.item.noPeserta = $scope.dataPasienSelected.nokepesertaan;
                }

                if ($scope.dataPasienSelected.nokepesertaan != undefined) {
                    $scope.item.noSep = $scope.dataPasienSelected.nosep;
                }


                $scope.cboSep = true
                $scope.cboUbahSEP = false
                $scope.cboDokter = false
                $scope.cboUbahDokter = false
            }
            $scope.batal = function () {
                $scope.cboDokter = false
                $scope.cboSep = false
                $scope.cboUbahDokter = true
                $scope.cboUbahSEP = true
            }
            $scope.PasienPulang = function () {
                var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
                $scope.cbopasienpulang = true
                $scope.cboUbahDokter = false
                if ($scope.dataPasienSelected.tglpulang != null) {
                    $scope.item.tanggalPulang = $scope.dataPasienSelected.tglpulang
                } else {
                    $scope.item.tanggalPulang = tglpulang
                }
            }
            $scope.batalsimpantglpulang = function () {
                $scope.cbopasienpulang = false
                $scope.cboUbahDokter = true
            }
            //debugger
            $scope.simpantglpulang = function () {
                //debugger
                var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
                var updateTanggal = {
                    "noregistrasi": $scope.dataPasienSelected.noregistrasi,
                    "tglpulang": tglpulang
                }
                medifirstService.post('registrasi/daftar-registrasi/update-tgl-pulang', updateTanggal).then(function (e) {
                    loadData();
                })
                $scope.cbopasienpulang = false;
                $scope.cboUbahDokter = true;
            }
            // $scope.kartupasien = function () {

            // 	if ($scope.dataPasienSelected != undefined) {

            // 		//##save identifikasi kartu pasien
            // 		medifirstService.get("registrasi/identifikasi-kartu-pasien?norec_pd="
            // 			+ $scope.dataPasienSelected.norec
            // 		).then(function (data) {
            // 			var datas = data.data;
            // 		})
            // 		//##end 

            // 		// var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
            // 		// window.open(fixUrlLaporan, '', 'width=800,height=600')

            // 		//cetakan langsung service VB 6 by grh   
            // 		var client = new HttpClient();
            // 		client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.dataPasienSelected.nocmfk + '&view=false', function (response) {
            // 			// do something with response
            // 		});
            // 	}
            // }
            $scope.kartupasien = function () {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/kartupasien2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
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
            $scope.simpanSep = function () {
                if ($scope.dataPasienSelected.kelompokpasien == "BPJS") {
                    var updateSep = {
                        "norec": $scope.dataPasienSelected.norec,
                        "nokepesertaan": $scope.item.noPeserta,
                        "nosep": $scope.item.noSep
                    }
                } else {
                    var updateSep = {
                        "norec": $scope.dataPasienSelected.norec,
                        "nokepesertaan": $scope.item.noPeserta,
                        "nosep": null
                    }
                }

                medifirstService.post('registrasi/daftar-registrasi/update-nosep', updateSep).then(function (e) {
                    loadData();
                    $scope.saveLogInputSep()
                })

                $scope.cboSep = false
                $scope.cboUbahSEP = true
                $scope.cboDokter = false
                $scope.cboUbahDokter = true
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
            $scope.batalSep = function () {
                $scope.item.noPeserta = "";
                $scope.item.noSep = "";
                $scope.cboSep = false
                $scope.cboUbahSEP = true
                $scope.cboDokter = false
                $scope.cboUbahDokter = true
            }

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
                    // $scope.item.ruanganAntrian = {id:dataPasienSelected.objectruanganlastfk,namaruangan:dataPasienSelected.namaruangan}
                }
            }
            $scope.simpan = function () {
                var objSave = {
                    norec: $scope.dataPasienSelected.norec,
                    objectpegawaifk: $scope.item.namaDokter.id,
                    objectruanganlastfk: $scope.dataPasienSelected.objectruanganlastfk
                }
                medifirstService.post('registrasi/daftar-registrasi/update-dokter', objSave).then(function (e) {
                    $scope.popupDokter.close();
                    loadData();

                    $scope.cboDokter = false
                    $scope.cboSep = false
                    $scope.cboUbahDokter = true
                    $scope.cboUbahSEP = true
                })
            }
            $scope.Detail = function () {
                let user = medifirstService.getPegawai();
                if ($scope.dataPasienSelected.norec_br == "Pasien Batal") {
                    // window.messageContainer.error('Pasien Sudah Batal');
                    alert("Pasien Sudah Batal!!!")
                    return;
                }
                debugger
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    if ($scope.dataPasienSelected.tglpulang == null) {
                        if (user.id != 320263) {
                            if ($scope.dataPasienSelected.objectruanganlastfk == 720 || $scope.dataPasienSelected.objectruanganlastfk == 777 || $scope.dataPasienSelected.objectruanganlastfk == 778 || $scope.dataPasienSelected.objectruanganlastfk == 779 || $scope.dataPasienSelected.objectruanganlastfk == 753 || $scope.dataPasienSelected.objectruanganlastfk == 754 || $scope.dataPasienSelected.objectruanganlastfk == 755 || $scope.dataPasienSelected.objectruanganlastfk == 747 || $scope.dataPasienSelected.objectruanganlastfk == 748 || $scope.dataPasienSelected.objectruanganlastfk == 769 || $scope.dataPasienSelected.objectruanganlastfk == 770 || $scope.dataPasienSelected.objectruanganlastfk == 731) {
                                medifirstService.get("emr/get-emr-transaksi?nocm=" + $scope.dataPasienSelected.nocm + "&jenisEmr=askepnew&noregistrasi=" + $scope.dataPasienSelected.noregistrasi, true).then(function (dat) {
                                    debugger
                                    if (dat.data.data.length == 0) {
                                        toastr.error('Harus Mengisi SIDOPAK Terlebih Dahulu', 'Info');
                                    } else {
                                        medifirstService.get("emr/get-combolistaskep?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function (dat) {
                                            if (dat.data.askep.length == 0) {
                                                toastr.error('Harus Mengisi SIDOPAK Terlebih Dahulu', 'Info');
                                            } else {
                                                RincianTagihan();
                                            }
                                        });
                                    }
                                });
                            } else {
                                RincianTagihan();
                            }
                        } else {
                            RincianTagihan();
                        }
                    } else {
                        RincianTagihan();
                    }

                    // var objSave = {
                    // 	noregistrasi: $scope.dataPasienSelected.noregistrasi
                    // }
                    // manageTataRekening.postJurnalAkuntansi(objSave).then(function (data) {

                    // });
                    function RincianTagihan() {
                        var obj = {
                            noRegistrasi: $scope.dataPasienSelected.noregistrasi
                        }
                        var statusOtomatis = "YA"
                        cacheHelper.set('statusOtomatis', statusOtomatis);
                        $state.go('RincianTagihan', {
                            dataPasien: JSON.stringify(obj)
                        });
                    }
                }
            }
            $scope.rekapTagihan = function () {

                if ($scope.dataPasienSelected.noregistrasi != undefined) {

                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    $state.go('RekapTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
            }
            $scope.DaftarRuangan = function () {
                if ($scope.dataPasienSelected.norec_br == "Pasien Batal") {
                    // window.messageContainer.error('Pasien Sudah Batal');
                    alert("Pasien Sudah Batal!!!")
                    return;
                }

                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }


                    cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
                    // cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
                    $state.go('DetailRegistrasi', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
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
                let query = "";
                loopCetakan(data, query)
                // var listRawRequired = [
                // 	"dats.qty|k-ng-model|kuantiti"
                // ];
                // var isValid = ModelItem.setValidation($scope, listRawRequired);
                // debugger

                // if (isValid.status) {
                // 	var qty = data.qty;
                // 	var qtyhasil = data.qty * 2;
                // 	if (qty !== undefined) {
                // 		// var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
                // 		// window.open(fixUrlLaporan, '', 'width=800,height=600')
                // 		//cetakan langsung service VB6 by grh

                // 		//##save identifikasi label pasien
                // 		medifirstService.get("registrasi/identifikasi-label?norec_pd="
                // 			+ $scope.dataPasienSelected.norec + '&islabel=' + qtyhasil
                // 		).then(function (data) {
                // 			var datas = data.data;
                // 			loopCetakan(datas, query)
                // 		})

                // 		// loopCetakan(dats.qty, query)
                // 		//##end

                // 		// var client = new HttpClient();
                // 		// client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false&qty=' + qty, function (response) {
                // 		// 	// do something with response
                // 		// });

                // 	}
                // 	$scope.dialogCetakLabel.close();
                // } else {
                // 	ModelItem.showMessages(isValid.messages);
                // }
            };

            function loopCetakan(data, query) {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMmon-YYYY'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))"
                for (let i = 1; data.qty >= i; i++) {

                    // for (const item of data) {
                    // query = ``
                    if (queryjadi == "") {
                        // queryjadi = 'SELECT * from "V_labelPasien" where noregistrasi = ' + $scope.dataPasienSelected.noregistrasi;
                        queryjadi = sintak + 'where noregistrasi = ' + "'" + $scope.dataPasienSelected.noregistrasi + "'";
                    } else {
                        // queryjadi = $queryjadi + " UNION ALL SELECT * from V_labelPasien where noregistrasi = " + $scope.dataPasienSelected.noregistrasi;
                        queryjadi = queryjadi + " UNION ALL " + sintak + 'where noregistrasi = ' + "'" + $scope.dataPasienSelected.noregistrasi + "'";
                    }
                }
                Labelpasienjasper(queryjadi)
            }

            function Labelpasienjasper(datas) {
                var qrcode = $scope.dataPasienSelected.noregistrasi
                // var qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.dataPasienSelected.noregistrasi
                var norec = $scope.dataPasienSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.dataPasienSelected.noregistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
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

            $scope.pilihQty2 = function () {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMMonth-YYYY HH12:MIPM'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))" +
                    'where noregistrasi = ' + "'" + $scope.dataPasienSelected.noregistrasi + "'"
                Labelpasienjaspera4(sintak)
            }

            function Labelpasienjaspera4(datas) {
                var qrcode = $scope.dataPasienSelected.noregistrasi
                var norec = $scope.dataPasienSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.dataPasienSelected.noregistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
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


            $scope.SummaryList = function () {
                if ($scope.dataPasienSelected.nocm != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + $scope.item.pasien.noCm + "&tglRegistrasi=" + new moment($scope.item.pasienDaftar.tglRegistrasi).format('DD-MM-YYYY'));
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //##save identifikasi summary list
                    medifirstService.get("registrasi/identifikasi-sum-list?norec_pd=" +
                        $scope.dataPasienSelected.norec
                    ).then(function (data) {
                        var datas = data.data;
                    })

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.dataPasienSelected.nocm + '&view=false', function (response) {
                        // do something with response
                    });


                }
            }
            $scope.cetakMCU = function () {
                debugger
                var norec = $scope.dataPasienSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["norec"],
                    "paramValue": [norec,], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakmcu2registrasi.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakmcu2registrasi.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakmcu2registrasi.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1generic/report/cetakmcu2registrasi.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakmcu2registrasi.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakmcu2registrasi.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }
            $scope.GelangPasien = function () {
                $scope.popUpGelang.center().open();
            }
            $scope.cetakGelang = function () {
                debugger;
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelang=1&nocm=' + $scope.dataPasienSelected.nocm + '&kelamin=' + $scope.itemCetakGelang.jenis, function (response) {
                        // do something with response
                    });
                }
            }

            $scope.Tracer = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $scope.item.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //##save identifikasi tracer
                    medifirstService.get("registrasi/identifikasi-tracer?norec_pd=" +
                        $scope.dataPasienSelected.norec
                    ).then(function (data) {
                        var datas = data.data;
                    })
                    //##end

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false', function (response) {
                        // do something with response
                    });


                }
            }

            $scope.CetakSEP = function (x) {
                if ($scope.dataPasienSelected.noregistrasi != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {
                    if ($scope.dataPasienSelected.nosep == '' || $scope.dataPasienSelected.nosep == undefined || $scope.dataPasienSelected.nosep == '-') {
                        toastr.warning("Nosep Tidak ada!");
                        return;
                    }
                    medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + $scope.dataPasienSelected.nosep).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                                '&norec=' + $scope.dataPasienSelected.noregistrasi
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
                                    data[0].namadjpjpmelayani = e.data.response.kontrol.nmDokter
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
                                // $("#politujuan").text(data[0].namaruanganfix);
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
                            toastr.warning("Nosep Tidak Ditemukan di Vclaim, SILAHKAN TERBITKAN ULANG SEP!");
                            return;
                        }
                        $scope.isLoadingSEP = false;
                    }, function (err) {
                        $scope.isLoadingSEP = false;
                    });


                }
            }

            //operator/get-data-pasien-mau-batal
            $scope.RMK = function () {
                var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?" +
                        norReg
                    ).then(function (data) {

                        var datas = data.data.datas[0];
                        if (datas != undefined && datas != null) {
                            if (datas.jenisdiagnosa != null) {
                                $scope.sourceDiagnosisPrimer.add({
                                    id: datas.id,
                                    jenisdiagnosa: datas.jenisdiagnosa,
                                    kddiagnosa: datas.kddiagnosa,
                                    ketdiagnosis: datas.ketdiagnosis,
                                    keterangan: datas.keterangan,
                                    namadiagnosa: datas.namadiagnosa,
                                    norec_apd: datas.norec_apd,
                                    norec_detaildpasien: datas.norec_detaildpasien,
                                    norec_diagnosapasien: datas.norec_diagnosapasien,
                                    noregistrasi: datas.noregistrasi
                                })
                            }

                            $scope.item.norec_apd = datas.norec_apd;
                            $scope.item.keteranganDiagnosis = datas.keterangan;
                            $scope.item.diagnosisPrimer = {
                                id: datas.id,
                                kddiagnosa: datas.kddiagnosa,
                                namadiagnosa: datas.namadiagnosa
                            }
                            var paramNOrec = $scope.item.norec_apd
                            var pegawai = medifirstService.getPegawai();
                            // if (paramNOrec == '') {
                            // 	paramNOrec = $scope.item.norec_apd
                            // }
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + paramNOrec + '&caraBayar=' + $scope.dataPasienSelected.kelompokpasien + '&umur=' + $scope.dataPasienSelected.umur + '&petugas=' + pegawai.namaLengkap + '&view=false', function (response) { });

                        } else {
                            $scope.icd10.center().open();
                        }
                    });
                    //     findPasien.getDiagnosaNyNoRec($scope.item.noRec).then(function(e){
                    //         if (e.data.data.DiagnosaPasien.length > 0) {
                    //             $scope.cetakBro();
                    //         } else {
                    //             $scope.item.jenisDiagnosis = $scope.sourceJenisDiagnosisPrimer[4];
                    //             ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function(data) {
                    //                 $scope.sourceDiagnosisPrimer = data;
                    //             });
                    //             $scope.icd10.center().open();
                    // 
                    //         }
                    //     })
                    // }
                }
            }

            $scope.cetakRMK = function () {
                var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?" +
                    norReg
                ).then(function (data) {
                    var norecAPD = ''
                    for (var i = 0; i < data.data.datas.length; i++) {
                        const elem = data.data.datas[i]
                        if (elem.tglkeluar == null) {
                            norecAPD = elem.norec_apd
                            break
                        }
                    }
                    var dataDiagnosa = data.data.datas[0]

                    if ($scope.item.jenisDiagnosis == undefined) {
                        alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                        return
                    }
                    if ($scope.item.diagnosisPrimer == undefined) {
                        alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                        return
                    }

                    var norecDiagnosaPasien = "";
                    if (dataDiagnosa != undefined) {
                        norecDiagnosaPasien = dataDiagnosa.norec_diagnosapasien;
                    }

                    var keterangan = "";
                    if ($scope.item.keteranganDiagnosis == undefined) {
                        keterangan = "-"
                    } else {
                        keterangan = $scope.item.keteranganDiagnosis;
                    }


                    $scope.now = new Date();
                    var detaildiagnosapasien = {
                        norec_dp: norecDiagnosaPasien,
                        noregistrasifk: dataDiagnosa.norec_apd,
                        objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglpendaftaran: moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                        keterangan: keterangan
                    }
                    medifirstService.post('registrasi/daftar-registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
                        $scope.item.keteranganDiagnosis = "";
                        $scope.item.diagnosisPrimer = "";
                        loadData()
                        $scope.icd10.close();

                        //##save identifikasi rmk
                        medifirstService.get("registrasi/identifikasi-rmk?norec_pd=" +
                            $scope.dataPasienSelected.norec
                        ).then(function (data) {
                            var datas = data.data;
                        })
                        //##end 
                        var paramNOrec = norecAPD
                        if (paramNOrec == '') {
                            paramNOrec = dataDiagnosa.norec_apd
                        }
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + paramNOrec + '&umur=' + $scope.dataPasienSelected.umur + '&view=false', function (response) { });
                        // $scope.cetakBro();
                    })
                });

                // var listRawRequired = [
                //     "item.diagnosisPrimer|k-ng-model|Diagnosa awal"
                // ]
                // var isValid = ModelItem.setValidation($scope, listRawRequired);

                // if(isValid.status){
                //     if($scope.item != undefined){
                //         var saveData = {
                //             pasien: {
                //                 id: $scope.item.pasien.id
                //             },
                //             tanggalPendaftaran: $scope.item.pasienDaftar.tglRegistrasi,
                //             diagnosis: [{
                //                 diagnosa: {
                //                     id: $scope.item.diagnosisPrimer.id
                //                 },
                //                 jenisDiagnosa: $scope.item.jenisDiagnosis,
                //                 keterangan: $scope.item.keteranganDiagnosis
                //             }],
                //             noRecPasienDaftar: $scope.item.noRec
                //         }
                //         managePasien.postSaveDiagnosaRMK(saveData).then(function(e){
                //             $scope.item.keteranganDiagnosis="";
                // $scope.item.diagnosisPrimer="";
                //             $scope.icd10.close();
                //             $scope.cetakBro();
                //         })
                //     }
                // } else {
                //     ModelItem.showMessages(isValid.messages);
                // }

            }
            $scope.batalCetakRMK = function () {
                $scope.item.keteranganDiagnosis = "";
                $scope.item.diagnosisPrimer = "";
                $scope.icd10.close();
            }


            $scope.cetakBro = function () {

            }

            $scope.BatalPeriksa = function () {
                var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
                medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-batal?" +
                    norReg
                ).then(function (data) {
                    var datas = data.data
                    if (datas.length > 0)
                        window.messageContainer.error('Pasien sudah Mendapatkan Pelayanan');
                    else {
                        $scope.item.ruanganBatal = { id: $scope.dataPasienSelected.objectruanganlastfk, namaruangan: $scope.dataPasienSelected.namaruangan }
                        $scope.item.tglbatal = $scope.now;
                        medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-bataludahkso?" +
                            norReg
                        ).then(function (data) {
                            var datasx = data.data
                            if (datasx.length > 0)
                                window.messageContainer.error('Pasien sudah Verif KSO TIDAK BISA DIBATALAKAN');
                            else {
                                $scope.winDialog.center().open();
                            }
                        })

                    }
                });
            }

            $scope.lanjutBatal = function () {
                if ($scope.item.alasanBatal == undefined) {
                    toastr.error('Alasan Wajib Diisi Ya')
                    return
                }
                var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
                medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-batal?" +
                    norReg
                ).then(function (data) {
                    var BatalPeriksa = {
                        "norec": $scope.dataPasienSelected.norec,
                        "tanggalpembatalan": moment($scope.item.tglbatal).format('YYYY-MM-DD hh:mm:ss'),
                        "pembatalanfk": $scope.item.pembatalan.id,
                        "alasanpembatalan": $scope.item.alasanBatal != undefined ? $scope.item.alasanBatal : '',
                        "noreservasi": $scope.dataPasienSelected.noreservasi

                    }
                    medifirstService.post('registrasi/daftar-registrasi/save-batal-registrasi', BatalPeriksa).then(function (e) {
                        var data = {
                            kodebooking: $scope.dataPasienSelected.statusschedule,
                            keterangan: $scope.item.alasanBatal != undefined ? $scope.item.alasanBatal : 'Batal'
                        }
                        var objSave = {
                            data: data
                        }
                        medifirstService.post('bridging/bpjs2/mjkn/antrian/batalantrian', objSave).then(function (e) {
                            debugger
                            // body...
                        })
                        loadData();
                        $scope.item.pembatalan = "";
                        $scope.item.alasanBatal = "";
                        $scope.item.ruanganBatal = "";
                    })
                });
                $scope.winDialog.close();
            }

            $scope.batalBatal = function () {
                $scope.item.pembatalan = "";
                $scope.item.alasanBatal = "";
                $scope.item.ruanganBatal = "";
                $scope.winDialog.close();
            }

            $scope.InputDiagnosa = function () {
                $state.go('RiwayatRegistrasi', {
                    nocm: $scope.dataPasienSelected.nocm,
                    noregistrasi: $scope.dataPasienSelected.noregistrasi
                });
            }
            // $scope.hasillab = function () {
            // 	$state.go('RincianTagihanPenunjang', {
            // 		nocm: $scope.dataPasienSelected.nocm,
            // 		noregistrasi: $scope.dataPasienSelected.noregistrasi
            // 	});
            // }
            // $scope.hasillab = function () {

            // 	medifirstService.get("radiologi/get-rincian-pelayanan?", true
            // 		).then(function (dat) {
            // 			if (dat.data.data.length > 0) {
            //                 if (dat.data.data[0].objectdepartemenfk == 3)
            //                     $scope.disableRad = true
            //                 if (dat.data.data[0].objectdepartemenfk == 27)
            //                     $scope.disableLab = true
            //             }


            // 				var arrrStr = {
            // 					0: $scope.dataPasienSelected.nocm,
            // 					1: $scope.dataPasienSelected.namapasien,
            // 					2: $scope.dataPasienSelected.jeniskelamin,
            // 					3: $scope.dataPasienSelected.noregistrasi,
            // 					4: $scope.dataPasienSelected.umur,
            // 					5: $scope.dataPasienSelected.klid,
            // 					6: $scope.dataPasienSelected.namakelas,
            // 					7: $scope.dataPasienSelected.tglregistrasi,
            // 					8: $scope.dataPasienSelected.norec,
            // 					// 8: dat.data.data[0].norec,
            // 					9: $scope.dataPasienSelected.namaruangan,
            // 					10: $scope.dataPasienSelected.ruid,
            // 					11: $scope.dataPasienSelected.norec_pd,
            // 					13: $scope.dataPasienSelected.kelompokpasien,
            // 					16: $scope.dataPasienSelected.objectdepartemenfk,                    
            // 					18: $scope.dataPasienSelected.nostruklastfk,
            // 					19: $scope.dataPasienSelected.golongandarah,
            // 					20: $scope.dataPasienSelected.tglpulang
            // 				}
            // 				cacheHelper.set('RincianTagihanPenunjang', arrrStr);
            // 					$state.go('RincianTagihanPenunjang');


            // 		})

            // }
            $scope.popuphasillab = function () {
                debugger;
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }

                // medifirstService.get("registrasi/get-status-close/" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {

                // 	var ruangan = "";
                // 	medifirstService.get("registrasi/daftar-registrasi/get-hasil-lab?noregistrasi="
                // 		+ $scope.dataPasienSelected.noregistrasi
                // 		+ "&objectruanganlastfk=" + ruangan
                // 	).then(function (dat) {
                // 		debugger;
                // 		$scope.listRuanganApd = dat.data.ruangan;
                // 		$scope.item.ruanganAntrian = {
                // 			id: $scope.listRuanganApd[0].id,
                // 			namaruangan: $scope.listRuanganApd[0].namaruangan,
                // 			norec_apd: $scope.listRuanganApd[0].norec_apd,
                // 			objectdepartemenfk: $scope.listRuanganApd[0].objectdepartemenfk
                // 		}
                // 	})
                // 	$scope.popupAntrians.center().open();
                // 	$scope.showHasilLab = true;
                // 	$scope.showBuktiLayanan = false;
                // });
                medifirstService.get("registrasi/get-status-close/" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {

                    var ruangan = "";
                    medifirstService.get("registrasi/daftar-registrasi/get-hasil-lab-rawat?noregistrasi=" +
                        $scope.dataPasienSelected.noregistrasi +
                        "&objectruanganlastfk=" + ruangan
                    ).then(function (dat) {
                        debugger;
                        if (dat.data.ruangan.length == 0) {
                            toastr.info("Pasien ini tidak memiliki riwayat laboratorium", "Info !")
                            return
                        }
                        $scope.listRuanganApd = dat.data.ruangan;
                        debugger;
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
            $scope.closeShow = function () {
                $scope.popUpShow.close();
            }

            $scope.hasilLab = function (dataItem) {
                debugger;
                $scope.isLoading = true;


                // var noregistrasi = ''
                // noregistrasi = dataItem.norec_apd

                if (dataItem.ruid === '575') {
                    medifirstService.get('registrasi/daftar-registrasi/get-pd-from-apd?' + '&norec_pd=' + dataItem.norec_pd + '&ruid=' + dataItem.ruid).then(function (dat) {
                        debugger;
                        for (var b = 0; b < dat.data.ruangan.length; b++) {

                            medifirstService.get("radiologi/get-rincian-pelayanan-lab-inacbg?noregistrasifk=" + dat.data.ruangan[b].norec_apd
                                // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                                , true).then(function (dat) {
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
                                    function (error) {
                                        $scope.isLoading = false;
                                    });
                        }
                    })
                }
                // loadEditor()
                if (dataItem.ruid === '576') {
                    medifirstService.get('registrasi/daftar-registrasi/get-pd-from-apd?' + '&norec_pd=' + dataItem.norec_pd + '&ruid=' + dataItem.ruid).then(function (dat) {
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
                                , true).then(function (dat) {
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
                                    function (error) {
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
                    "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
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
            $scope.closeShowPel = function () {
                $scope.popUpPelayanan.close();
            }
            $scope.detailHasilLab = function (dataItem) {
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
                    '&objectjeniskelaminfk=' + dataItem.objectjeniskelaminfk + '&umur=' + dataItem.umur + '&norec=' + norec_pp + '&tgl=' + Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'))).then(function (data) {
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
            $scope.closeDetailLab = function () {
                $scope.popUpDetailLab.close();
            }
            // $scope.hasilLab = function () {
            // 	debugger;
            // 	// if ( $scope.item.ruanganAntrian.id != 575) {
            // 		// window.messageContainer.error("Ruangan Harus Laboratorium !");
            // 		// return;
            // 	// }
            // 	// cacheHelper.set('RincianTagihanPenunjang')
            // 	// if ($scope.item.ruanganAntrian.objectdepartemenfk == 3){
            // 		var arrStr = {
            // 			0: $scope.dataPasienSelected.nocm,
            // 			1: $scope.dataPasienSelected.namapasien,
            // 			2: $scope.dataPasienSelected.jeniskelamin,
            // 			3: $scope.dataPasienSelected.noregistrasi,
            // 			4: $scope.dataPasienSelected.umur,
            // 			5: $scope.dataPasienSelected.klsid,
            // 			6: $scope.dataPasienSelected.namakelas,
            // 			7: $scope.dataPasienSelected.tglregistrasi,
            // 			8: $scope.item.ruanganAntrian.norec_apd,
            // 			9: $scope.dataPasienSelected.namaruangan,
            // 			10: $scope.dataPasienSelected.ruid,
            // 			11: $scope.dataPasienSelected.norec,
            // 			12: "",//nor
            // 			13: $scope.dataPasienSelected.kelompokpasien,
            // 			16: $scope.item.ruanganAntrian.objectdepartemenfk,                    
            // 			18: $scope.dataPasienSelected.nostruklastfk,
            // 			19: $scope.dataPasienSelected.golongandarah,
            // 			20: $scope.dataPasienSelected.tglpulang
            // 		}

            // 		cacheHelper.set('RincianLabRegistrasi', arrStr);		
            // 	$state.go('RincianLabRegistrasi', {
            // 		norecPD: $scope.dataPasienSelected .norec,
            // 		norecAPD: $scope.item.ruanganAntrian.norec_apd,

            // 	});
            // // }
            // }
            $scope.popuphasilrad = function () {
                debugger;
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }

                // medifirstService.get("registrasi/get-status-close/" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {

                // 	var ruangan = "";
                // 	medifirstService.get("registrasi/daftar-registrasi/get-hasil-lab?noregistrasi="
                // 		+ $scope.dataPasienSelected.noregistrasi
                // 		+ "&objectruanganlastfk=" + ruangan
                // 	).then(function (dat) {
                // 		debugger;
                // 		$scope.listRuanganApd = dat.data.ruangan;
                // 		$scope.item.ruanganAntrian = {
                // 			id: $scope.listRuanganApd[0].id,
                // 			namaruangan: $scope.listRuanganApd[0].namaruangan,
                // 			norec_apd: $scope.listRuanganApd[0].norec_apd,
                // 			objectdepartemenfk: $scope.listRuanganApd[0].objectdepartemenfk
                // 		}
                // 	})
                // 	$scope.popupAntrians.center().open();
                // 	$scope.showHasilRad = true;
                // 	$scope.showBuktiLayanan = false;
                // });
                medifirstService.get("registrasi/get-status-close/" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {

                    var ruangan = "";
                    medifirstService.get("registrasi/daftar-registrasi/get-hasil-rad-rawat?noregistrasi=" +
                        $scope.dataPasienSelected.noregistrasi +
                        "&objectruanganlastfk=" + ruangan
                    ).then(function (dat) {
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
            $scope.LihatEkpertise = function () {
                // debugger;
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
                $scope.item.dokter22 = { id: $scope.dataSelected.dokterid, namalengkap: $scope.dataSelected.dokter }
                debugger;
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + $scope.dataSelected.norec_pp + '&idproduk=' + $scope.dataSelected.produkfk).then(function (e) {
                    debugger;
                    if (e.data.length > 0) {

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
                        $scope.item.keterangan = ""
                    }

                    $scope.popUpEkpertise.center().open();

                })

                // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                //         if (res.data.data.length > 0) 
                //                  $scope.item.keterangan = e.data[0].keterangan;//.replace(/~/g, "\n")
                //                  $scope.popUpEkpertise.center().open();
                //         })




            }
            $scope.closeShowEks = function () {
                $scope.popUpEkpertise.close();
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
            $scope.closeShowRad = function () {
                $scope.popUpPelayananRadio.close();
            }
            // $scope.hasilRad = function () {
            // 	debugger;
            // 	// if ( $scope.item.ruanganAntrian.id != 575) {
            // 		// window.messageContainer.error("Ruangan Harus Laboratorium !");
            // 		// return;
            // 	// }
            // 	// cacheHelper.set('RincianTagihanPenunjang')
            // 	// if ($scope.item.ruanganAntrian.objectdepartemenfk == 3){
            // 		var arrStr = {
            // 			0: $scope.dataPasienSelected.nocm,
            // 			1: $scope.dataPasienSelected.namapasien,
            // 			2: $scope.dataPasienSelected.jeniskelamin,
            // 			3: $scope.dataPasienSelected.noregistrasi,
            // 			4: $scope.dataPasienSelected.umur,
            // 			5: $scope.dataPasienSelected.klsid,
            // 			6: $scope.dataPasienSelected.namakelas,
            // 			7: $scope.dataPasienSelected.tglregistrasi,
            // 			8: $scope.item.ruanganAntrian.norec_apd,
            // 			9: $scope.dataPasienSelected.namaruangan,
            // 			10: $scope.dataPasienSelected.ruid,
            // 			11: $scope.dataPasienSelected.norec,
            // 			12: "",//nor
            // 			13: $scope.dataPasienSelected.kelompokpasien,
            // 			16: $scope.item.ruanganAntrian.objectdepartemenfk,                    
            // 			18: $scope.dataPasienSelected.nostruklastfk,
            // 			19: $scope.dataPasienSelected.golongandarah,
            // 			20: $scope.dataPasienSelected.tglpulang
            // 		}

            // 		cacheHelper.set('RincianRadRegistrasi', arrStr);		
            // 	$state.go('RincianRadRegistrasi', {
            // 		norecPD: $scope.dataPasienSelected .norec,
            // 		norecAPD: $scope.item.ruanganAntrian.norec_apd,

            // 	});
            // // }
            // }
            // $scope.hasillab = function() {
            // 	debugger;
            // 	medifirstService.get('registrasi/get-apd?noregistrasi=' + $scope.dataPasienSelected.noregistrasi
            // 		+ '&objectruanganlastfk=' + $scope.dataPasienSelected.objectruanganlastfk).then(function (e) {
            // 			if (e.data.data.length > 0) {

            // 				var arrrStr = {
            // 					0: $scope.dataPasienSelected.nocm,
            // 					1: $scope.dataPasienSelected.namapasien,
            // 					2: $scope.dataPasienSelected.jeniskelamin,
            // 					3: $scope.dataPasienSelected.noregistrasi,
            // 					4: $scope.dataPasienSelected.umur,
            // 					5: $scope.dataPasienSelected.klid,
            // 					6: $scope.dataPasienSelected.namakelas,
            // 					7: $scope.dataPasienSelected.tglregistrasi,
            // 					8: e.data.data[0].norec_apd,
            // 					// 8: dat.data.data[0].norec,
            // 					9: $scope.dataPasienSelected.namaruangan,
            // 					10: $scope.dataPasienSelected.ruid,
            // 					11: $scope.dataPasienSelected.norec_pd,
            // 					13: $scope.dataPasienSelected.kelompokpasien,
            // 					16: $scope.dataPasienSelected.objectdepartemenfk,                    
            // 					18: $scope.dataPasienSelected.nostruklastfk,
            // 					19: $scope.dataPasienSelected.golongandarah,
            // 					20: $scope.dataPasienSelected.tglpulang
            // 				}
            // 				cacheHelper.set('RincianTagihanPenunjang', arrrStr);

            // 					$state.go('RincianTagihanPenunjang', {
            // 						noRec: e.data.data[0].norec_apd
            // 					})

            // 			}
            // 		})
            // }

            $scope.formatJam24 = {
                value: new Date(), //set default value
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm", //set drop down time format to 24 hours
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
            }
            $scope.cetakJasperLembarMasukRanap = function () {
                debugger
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    messageContainer.error("Pilih data dulu")
                    return
                } else {
                    var pegawai = medifirstService.getPegawai();
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "alamatRS", "noregistrasi", "pegawai"],
                        "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.dataPasienSelected.noregistrasi, pegawai.namaLengkap], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
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
            }

            $scope.EditRegistrasi = function () {
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu")
                    return
                } else {
                    var ruangan = "";
                    medifirstService.get("registrasi/get-apd?noregistrasi=" +
                        $scope.dataPasienSelected.noregistrasi +
                        "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
                    ).then(function (data) {
                        var dataAntrian = data.data.data[0];

                        $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                            noCm: $scope.dataPasienSelected.nocm
                        });
                        var cacheSet = $scope.dataPasienSelected.norec +
                            "~" + $scope.dataPasienSelected.noregistrasi +
                            "~" + dataAntrian.norec_apd;
                        cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    })
                }
            }
            $scope.EditPemakaianAsuransi = function () {
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu")
                    return
                } else {

                    medifirstService.get("registrasi/get-apd?noregistrasi=" +
                        $scope.dataPasienSelected.noregistrasi +
                        "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
                    ).then(function (data) {
                        var dataAntrian = data.data.data[0];
                        debugger;
                        if (dataAntrian != undefined) {
                            $state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
                                // $state.go('PemakaianAsuransi',{
                                norecPD: $scope.dataPasienSelected.norec,
                                norecAPD: dataAntrian.norec_apd,
                            });

                            var cacheSet = $scope.dataPasienSelected.objectasuransipasienfk +
                                "~" + $scope.dataPasienSelected.norec_pa +
                                "~" + $scope.dataPasienSelected.noregistrasi;

                            cacheHelper.set('CachePemakaianAsuransi', cacheSet);
                        }
                    })
                }
            }

            $scope.popUpBL = function () {

                if ($scope.item != undefined) {
                    //cetakan langsung service VB6 by grh
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=' +
                        $scope.dataPasienSelected.noregistrasi + '&strIdPegawai=' +
                        $scope.pegawai.id +
                        '&view=false',
                        function (response) {

                        });

                    //##save identifikasibuktiLayanan
                    medifirstService.get("registrasi/identifikasi-buktiLayanan?norec_pd=" +
                        $scope.dataPasienSelected.norec
                    ).then(function (data) {
                        var datas = data.data;
                    })
                    //##end 

                }

            }
            var status = '';
            $scope.popUpInputTindakan = function () {
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }

                medifirstService.get("registrasi/get-status-close/" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {
                    if (rese.data.status == true) {
                        toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                        return;

                    }
                    var ruangan = "";
                    medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi=" +
                        $scope.dataPasienSelected.noregistrasi +
                        "&objectruanganlastfk=" + ruangan
                    ).then(function (data) {
                        $scope.listRuanganApd = data.data.ruangan;
                        $scope.item.ruanganAntrian = {
                            id: $scope.listRuanganApd[0].id,
                            namaruangan: $scope.listRuanganApd[0].namaruangan,
                            norec_apd: $scope.listRuanganApd[0].norec_apd
                        }
                    })
                    $scope.popupAntrians.center().open();
                    $scope.showInputTindakan = true;
                    $scope.showBuktiLayanan = false;
                });


            }

            $scope.inputTindakan = function () {

                $state.go('InputTindakan', {
                    norecPD: $scope.dataPasienSelected.norec,
                    norecAPD: $scope.item.ruanganAntrian.norec_apd,

                });
            }
            $scope.pegawai = ModelItem.getPegawai();
            $scope.buktiLayanan = function () {
                if ($scope.item != undefined) {
                    //cetakan langsung service VB6 by grh
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=' +
                        $scope.dataPasienSelected.noregistrasi + '&strIdPegawai=' +
                        $scope.pegawai.id +
                        '&view=false',
                        function (response) {

                        });

                }
            }
            $scope.cetakNoAntrian = function () {
                if ($scope.item != undefined) {
                    //cetakan langsung service VB 6 by grh   
                    var client = new HttpClient();

                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=' +
                        $scope.dataPasienSelected.noregistrasi + '&petugas=' + $scope.item.PegawaiLogin + '&view=false',
                        function (response) {
                            // do something with response
                        });


                }
            }
            $scope.batalRawat = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.item.ruanganBatal = { id: $scope.dataPasienSelected.objectruanganlastfk, namaruangan: $scope.dataPasienSelected.namaruangan }
                $scope.item.tglbatal = $scope.now;
                $scope.popUpHapusRegis.center().open();
            }

            $scope.saveHapusRegis = function () {
                if ($scope.item.pembatalan == undefined) {
                    toastr.error('Pembatalan belum dipilih!')
                    return
                }
                if ($scope.item.alasanBatal == undefined) {
                    toastr.error('Alasan harus diisi!')
                    return
                }
                if ($scope.item.jenis == undefined) {
                    toastr.error('Jenis belum dipilih!')
                    return
                }
                $scope.popUpHapusRegis.close();
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Semua PELAYANAN akan dihapus! Lanjut Simpan? ')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.masukanPassword();
                })

            }
            $scope.password = '|';
            $scope.masukanPassword = function () {
                $scope.popUpPassword.center().open()
                //var person = prompt("Masukan tgl libur", "");
            }
            $scope.nextSave = function () {
                if ($scope.item.password != undefined && $scope.item.password == $scope.password) {
                    var BatalPeriksa = {
                        "norec": $scope.dataPasienSelected.norec,
                        "tanggalpembatalan": moment($scope.item.tglbatal).format('YYYY-MM-DD HH:mm:ss'),
                        "pembatalanfk": $scope.item.pembatalan.id,
                        "alasanpembatalan": $scope.item.alasanBatal,
                        "jenishapus": $scope.item.jenis.id == 1 ? "hapusregis" : "batalranap",
                    }
                    managePhp.postData2('registrasipasien/batal-periksa-delete', BatalPeriksa).then(function (e) {
                        clearHapusRegis()
                        $scope.popUpPassword.close()
                        loadData();
                    })
                } else {
                    toastr.error('Password Salah!', 'Error')
                }
            }
            $scope.batalHapusRegis = function () {
                $scope.popUpHapusRegis.close();
                clearHapusRegis()
            }

            function clearHapusRegis() {
                delete $scope.item.pembatalan
                delete $scope.item.alasanBatal
                delete $scope.item.ruanganBatal
                delete $scope.item.password
                delete $scope.item.jenis
            }

            $scope.resumeMedis = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.get('registrasi/get-apd?noregistrasi=' + $scope.dataPasienSelected.noregistrasi +
                    '&objectruanganlastfk=' + $scope.dataPasienSelected.objectruanganlastfk).then(function (e) {
                        if (e.data.data.length > 0) {

                            var arrrStr = {
                                0: $scope.dataPasienSelected.nocm,
                                1: $scope.dataPasienSelected.namapasien,
                                2: $scope.dataPasienSelected.jeniskelamin,
                                3: $scope.dataPasienSelected.noregistrasi,
                                // 4: $scope.dataPasienSelected.umur,
                                5: $scope.dataPasienSelected.kelompokpasien,
                                6: $scope.dataPasienSelected.tglregistrasi,
                                7: e.data.data[0].norec_apd,
                                8: $scope.dataPasienSelected.norec,
                                // 9: $scope.dataPasienSelected.objectkelasfk,
                                // 10: $scope.dataPasienSelected.namakelas,
                                11: $scope.dataPasienSelected.ruanganid,
                                12: $scope.dataPasienSelected.namaruangan
                            }
                            cacheHelper.set('cacheRekamMedis', arrrStr);
                            if ($scope.dataPasienSelected.objectdepartemenfk == 16 || $scope.dataPasienSelected.objectdepartemenfk == 25) {
                                $state.go('RekamMedis.ResumeRI', {
                                    noRec: e.data.data[0].norec_apd
                                })
                            } else {
                                $state.go('RekamMedis.ResumeRJ', {
                                    noRec: e.data.data[0].norec_apd
                                })
                            }
                        }
                    })

            }
            // hasil hasil
            $scope.hasil = function (criteria) {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                // $scope.isRouteLoading = true
                $scope.sourceHasilRad = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });
                if (criteria == 1) {
                    $scope.showRadiologi = false
                    $scope.ruanganMana = 'lab'
                } else {
                    $scope.ruanganMana = 'rad'
                    $scope.showRadiologi = true
                }


                var tanggal = $scope.now;
                var tanggalLahir = new Date($scope.dataPasienSelected.tgllahir);
                var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                $scope.dataPasienSelected.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';
                $scope.popupRad = $scope.dataPasienSelected
                //  managePhp.getData('laporan/get-order-' + $scope.ruanganMana + '?noregistrasi='
                medifirstService.get('registrasi/daftar-registrasi/get-daftar-order-hasil-' + $scope.ruanganMana + '?noregistrasi=' +
                    $scope.dataPasienSelected.noregistrasi).then(function (e) {
                        for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                            e.data.daftar[i].no = i + 1
                        }
                        $scope.isRouteLoading = false
                        $scope.sourceHasilRad = new kendo.data.DataSource({
                            data: e.data.daftar,
                            pageSize: 10
                        });
                    });
                $scope.popUpHasilRad.center().open()
            }
            $scope.columnHasilRad = [{
                "field": "no",
                "title": "No",
                "width": "20px",
            },
            {
                "field": "tglorder",
                "title": "Tgl Order",
                "width": "50px",
            },
            {
                "field": "noorder",
                "title": "No Order",
                "width": "60px",
            },
            {
                "field": "dokter",
                "title": "Dokter",
                "width": "100px"
            },
            {
                "field": "namaruangantujuan",
                "title": "Ruangan",
                "width": "100px",
            },
            {
                "field": "statusorder",
                "title": "Keterangan",
                "width": "80px",
            }
            ];
            $scope.detailHasilRad = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        field: "namaproduk",
                        title: "Deskripsi",
                        width: "300px"
                    },
                    {
                        field: "qtyproduk",
                        title: "Qty",
                        width: "100px"
                    }
                    ]
                };
            };

            $scope.klikHasilRad = function (data, ruang) {
                if (data != undefined) {
                    if (ruang == 'rad') {
                        $scope.noOrder = data.noorder;

                        medifirstService.get("registrasi/daftar-registrasi/get-acc-number-radiologi?noOrder=" + $scope.noOrder)
                            .then(function (e) {
                                $scope.dataRisOrder = e.data.data[0]
                            })
                    }
                    if (ruang == 'lab') {

                        medifirstService.get("registrasi/get-apd-detail/" +
                            $scope.dataPasienSelected.noregistrasi +
                            "/" + $scope.dataPasienSelected.objectruanganlastfk)
                            .then(function (e) {
                                $scope.resDataAPD = e.data.data
                            })
                    }

                }
            }

            $scope.lihatHasilRad = function () {
                if ($scope.dataHasilRad == undefined) {
                    toastr.error('Pilih data dulu', 'Info')
                }

                if ($scope.dataRisOrder != undefined) {
                    // 192.168.12.11:8080
                    $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" +
                        $scope.popupRad.nocm +
                        '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                } else {
                    toastr.info('Hasil tidak ada', 'Info')

                }

            }
            $scope.tutup = function () {
                $scope.popUpHasilRad.close()
            }

            $scope.lihatHasilLab = function () {
                if ($scope.dataHasilRad == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                var arrStr = {
                    0: $scope.dataPasienSelected.nocm,
                    1: $scope.dataPasienSelected.namapasien,
                    2: $scope.resDataAPD.jeniskelamin,
                    3: $scope.dataPasienSelected.noregistrasi,
                    4: $scope.dataPasienSelected.umur,
                    5: $scope.dataPasienSelected.kelompokpasien,
                    6: $scope.dataPasienSelected.tglregistrasi,
                    7: $scope.resDataAPD.norec_apd,
                    8: $scope.dataPasienSelected.norec_pd,
                    9: $scope.resDataAPD.idkelas,
                    10: $scope.resDataAPD.namakelas,
                    11: $scope.resDataAPD.objectruanganfk,
                    12: $scope.resDataAPD.namaruangan + '`'
                }

                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('HasilLaboratorium', {
                    norecPd: $scope.dataHasilRad.norecpd,
                    noOrder: $scope.dataHasilRad.noorder,
                    norecApd: $scope.resDataAPD.norec_apd,
                })

            }

            $scope.cetakIdentifikasiPasien = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.popUpIdentitas.center().open();
            }

            $scope.BatalCetak = function () {
                // HapusPenanggungJawab();
                $scope.popUpIdentitas.close();
            }
            var datas = [];
            $scope.CetakAh = function () {
                $scope.NocmTea = null;
                medifirstService.get("registrasi/get-data-detail-pasien?nocm=" +
                    $scope.dataPasienSelected.nocm)
                    .then(function (dat) {
                        datas = dat.data.data;
                        var umur = dateHelper.CountAge(new Date(datas.tgllahir), $scope.now);
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day
                        var usia = (umur.year * 12) + umur.month;
                        $scope.umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                        $scope.NocmTea = datas.nocm;
                        if ($scope.dataItem != undefined && datas != undefined) {
                            CetakWeh();
                        } else {
                            toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
                            return;
                        }

                    })
            }

            function CetakWeh() {

                var NomorRm = ""
                if ($scope.dataPasienSelected.nocm != undefined || $scope.dataPasienSelected.nocm != "") {
                    NomorRm = $scope.dataPasienSelected.nocm;
                }
                var kelompokPasien = ""
                if ($scope.dataPasienSelected.kelompokpasien != undefined || $scope.dataPasienSelected.kelompokpasien != "") {
                    kelompokPasien = $scope.dataPasienSelected.kelompokpasien;
                }
                var stt = 'false'
                if (confirm('View Lembar Identitas Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-identitas=1&noCm=' + NomorRm + '&noregis=' + $scope.dataPasienSelected.noregistrasi + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.umur + '&petugas=' + $scope.dataItem.pegawai.namalengkap + '&view=' + stt, function (response) {
                    //aadc=response; 
                });
                $scope.NocmTea = null;
                $scope.dataItem = {}
                $scope.popUpIdentitas.close();
                // if ($scope.dataItem != undefined && datas != undefined) {                       
                //         CetakIdentitas()
                // }else{
                //     toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
                //     return;
                // }
            }
            $scope.dataItem = {}
            $scope.cetakBlangkoBpjs = function () {
                if ($scope.dataPasienSelected != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {
                    // var PegawaiLogin = medifirstService.getPegawaiLogin();
                    //##save identifikasi sep
                    medifirstService.get('registrasi/get-daftar-combo-pegawai-all?pgid=2025', true, 10).then(function (e) {
                        $scope.listDataPegawai.add(e.data[0])
                        $scope.dataItem.pegawaiBlanko = e.data[0]

                        $scope.popUpBlanko.center().open()
                    })

                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Blangko!");
                    return;
                }
            }
            $scope.cetakBlanko = function () {
                if ($scope.dataItem.pegawaiBlanko != undefined) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-blangko-bpjs=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&Petugas=' + $scope.dataItem.pegawaiBlanko.id + '&view=false', function (response) {
                        // do something with response
                    });
                    $scope.popUpBlanko.close()
                }

            }
            $scope.batalBlanko = function () {
                // delete $scope.dataItem.pegawaiBlanko
                $scope.popUpBlanko.close()
            }

            $scope.cetakLembarRanap = function (x) {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sjp" +
                        '&norec=' + $scope.dataPasienSelected.noregistrasi
                    ).then(function (data) {
                        debugger;
                        var data = data.data.data;

                        var noCm = data[0].nocm.substring(0, 1) + "-";
                        noCm = noCm + data[0].nocm.substring(1, 3) + "-";
                        noCm = noCm + data[0].nocm.substring(3, 5) + "-";
                        noCm = noCm + data[0].nocm.substring(5, 7);
                        if (data[0].judul == 'BPJS KESEHATAN') {
                            $("#judul").text(data[0].namaexternal);
                            $("#nosep").text(data[0].nosep);
                            $("#namapasienx").text(data[0].titlepasien + '. ' + data[0].namapeserta);
                            $("#tanggalsep").text(data[0].tanggalsep);
                            $("#kartupasien").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                            $("#norujukan").text(data[0].norujukan);
                            $("#nocmx").text(noCm);
                            $("#tglrujukan").text(moment(data[0].tglrujukan).format('YYYY-MM-DD'));
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#asalrujukan").text(data[0].nmprovider);
                            $("#tanggallahirx").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                            // moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                            $("#diagnosa").text(data[0].namadiagnosa);
                            $("#tujuanrujukan").text(data[0].namapolibpjs + '/' + data[0].namaruangan);

                            $("#petugas").text($scope.item.PegawaiLogin);
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#noregistrasi").text(data[0].noregistrasi);
                            $("#agama").text(data[0].agama);
                            $("#tglregistrasi").text(data[0].tglregistrasi);
                        } else {
                            if (data[0].namaexternal != null) {
                                $("#judul").text(data[0].namaexternal);
                            } else {

                                $("#judul").text(data[0].judul);
                            }
                            $("#nosep").text('');
                            $("#namapasienx").text(data[0].titlepasien + '. ' + data[0].namapasien);
                            $("#tanggalsep").text(data[0].tglregistrasi);
                            $("#kartupasien").text('');
                            $("#norujukan").text('');
                            $("#nocmx").text(noCm);
                            $("#tglrujukan").text('');
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#asalrujukan").text('');
                            $("#tanggallahirx").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                            // moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                            $("#diagnosa").text();
                            $("#tujuanrujukan").text(data[0].namapolibpjs + '/' + data[0].namaruangan);
                            $("#petugas").text($scope.item.PegawaiLogin);
                            $("#noregistrasi").text(data[0].noregistrasi);
                            $("#agama").text(data[0].agama);
                            $("#tglregistrasi").text(data[0].tglregistrasi);
                        }
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
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        // var cetakan=htmlStart + printableContent + htmlEnd;
                        var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                        WindowObject.document.writeln(printdata);
                        WindowObject.document.close();
                        WindowObject.focus();

                    })
                }
            }

            $scope.BatalCetakDua = function () {
                $scope.dataItem.pegawaiDua = {};
                $scope.popUpDua.close();
            }

            $scope.CetakRanap = function () {
                var NomorRm = ""
                if ($scope.dataPasienSelected.nocm != undefined || $scope.dataPasienSelected.nocm != "") {
                    NomorRm = $scope.dataPasienSelected.nocm;
                }
                var kelompokPasien = ""
                if ($scope.dataPasienSelected.kelompokpasien != undefined || $scope.dataPasienSelected.kelompokpasien != "") {
                    kelompokPasien = $scope.dataPasienSelected.kelompokpasien;
                }
                var stt = 'false'
                if (confirm('View Lembar Rawat Inap? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-ranap=1&noCm=' + NomorRm + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.dataPasienSelected.umur + '&petugas=' + $scope.dataItem.pegawaiDua.namalengkap + '&noRegis=' + $scope.dataPasienSelected.noregistrasi + '&view=' + stt, function (response) {
                    //aadc=response; 
                });
                $scope.NocmTea = null;
                $scope.dataItem.pegawaiDua = undefined;
                $scope.popUpDua.close();
            }
            $scope.popUpPasswordHapusAsuransi = function () {
                $scope.popUpPassword2.center().open();
            }
            $scope.hapusPemakaianAsuransi = function () {
                if ($scope.dataPasienSelected == undefined) return;
                if ($scope.item.password2 != "donatelo") {
                    toastr.error('Password Salah !', 'Peringatan !')
                    return;
                }
                $scope.popUpPassword2.close();
                $scope.item.password2 = undefined
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin mau menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('registrasi/hapus-pemakaian-asuransi', { norec: $scope.dataPasienSelected.norec_pa }).then(function (e) {
                        loadData()
                    })
                })

            }
            $scope.showPopUpEMR = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var nocm = $scope.dataPasienSelected.nocm
                $scope.listCetakan = [
                    { id: 1, nama: 'RM1.IRJ (Ringkasan Riwayat Kliink)', url: 'rm1' },
                    { id: 1, nama: 'SJP', url: 'SJP' },
                    // { id: 2, nama: 'Pemberian Informasi', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-pemberian-informasi&id=' + nocm + '&view=true' },
                    // { id: 3, nama: 'Surat Pernyatakan Penolakan', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-pernyataan-penolakan&id=' + nocm + '&view=true' },
                    // { id: 4, nama: 'Tindakan ECT', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-ECT&id=' + nocm + '&view=true' },
                    // { id: 5, nama: 'Tindakan Injeksi', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-injeksi&id=' + nocm + '&view=true' },
                    // { id: 6, nama: 'Tindakan Fiksasi Mekanik', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-fiksasi-mekanik&id=' + nocm + '&view=true' },
                    // { id: 7, nama: 'Tindakan Anastesi Umum', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-anastersi-Umum&id=' + nocm + '&view=true' },
                    // { id: 8, nama: 'Kebutuhan Rencana Pulang', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-kebutuhan-rencana-pulang&id=' + nocm + '&view=true' },
                    // { id: 9, nama: 'Tindakan Infus', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-infus&id=' + nocm + '&view=true' },
                    // { id: 10, nama: 'Tindakan Kateter', url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-kateter&id=' + nocm + '&view=true' },
                ]
                $scope.popUpCetakanEMR.center().open()
            }
            $scope.cetakEMR = function (params) {
                if (!params) return
                if (params.url == 'rm1') {
                    rm1();
                } else if (params.url == 'SJP' && $scope.dataPasienSelected.kelompokpasien == 'Umum/Pribadi') {
                    sjprjumum();
                } else if (params.url == 'SJP' && $scope.dataPasienSelected.kelompokpasien != 'Umum/Pribadi') {
                    sjprjpenjamin();
                }

                // var client = new HttpClient();
                // client.get(params.url, function(response) {
                //     //aadc=response; 
                // });
            }

            function rm1() {

                debugger
                var qrcode = $scope.dataPasienSelected.nocm
                var norec = $scope.dataPasienSelected.nocmfk
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec", "nocm", "ruangan", "tglregistrasi"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norec, $scope.dataPasienSelected.nocm, $scope.dataPasienSelected.namaruangan, $scope.dataPasienSelected.tglregistrasi], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
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
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rmales.pdf');

                } else {
                    xhr.open('POST', '/jasper1/generic/report/rmales.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            function sjprjumum() {

                debugger
                var qrcode = $scope.dataPasienSelected.nocm
                var norec = $scope.dataPasienSelected.nocm
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec", "noregistrasi", "pegawai"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norec, $scope.dataPasienSelected.noregistrasi, $scope.item.PegawaiLogin], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/sjprjumum.pdf');
                } else if (window.location.hostname.indexOf('http://appsimrs.rsp.unand.ac.id') > -1) {
                    xhr.open('POST', 'http://appsimrs.rsp.unand.ac.id:8797/generic/report/sjprjumum.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/sjprjumum.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            function sjprjpenjamin() {

                debugger
                var qrcode = $scope.dataPasienSelected.nocm
                var norec = $scope.dataPasienSelected.nocmfk
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec", "noregistrasi", "pegawai"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norec, $scope.dataPasienSelected.noregistrasi, $scope.item.PegawaiLogin], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
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
                if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/sjprjpenjamin.pdf');
                } else if (window.location.hostname.indexOf('http://appsimrs.rsp.unand.ac.id') > -1) {
                    xhr.open('POST', 'http://appsimrs.rsp.unand.ac.id:8797/generic/report/sjprjpenjamin.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/sjprjpenjamin.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.InsidenInternal = function () {
                if ($scope.dataPasienSelected.norec == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'InputInsidenInternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'InputInsidenInternal'
                });
            }

            $scope.CetakCSR = function (x) {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    // $scope.popUpReport.center().open()

                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sjp" +
                        '&norec=' + $scope.dataPasienSelected.noregistrasi
                    ).then(function (data) {
                        debugger;
                        var data = data.data.data;

                        var noCm = data[0].nocm.substring(0, 1) + "-";
                        noCm = noCm + data[0].nocm.substring(1, 3) + "-";
                        noCm = noCm + data[0].nocm.substring(3, 5) + "-";
                        noCm = noCm + data[0].nocm.substring(5, 7);
                        if (data[0].judul == 'BPJS KESEHATAN') {
                            $("#judul").text(data[0].namaexternal);
                            $("#nosep").text(data[0].nosep);
                            $("#namapasien").text(data[0].titlepasien + '. ' + data[0].namapeserta);
                            $("#tanggalsep").text(data[0].tanggalsep);
                            $("#kartupasien").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                            $("#norujukan").text(data[0].norujukan);
                            $("#nocm").text(noCm);
                            $("#tglrujukan").text(moment(data[0].tglrujukan).format('YYYY-MM-DD'));
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#asalrujukan").text(data[0].nmprovider);
                            $("#tanggallahir").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                            // moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                            $("#diagnosa").text(data[0].namadiagnosa);
                            $("#tujuanrujukan").text(data[0].namapolibpjs + '/' + data[0].namaruangan);

                            $("#petugas").text($scope.item.PegawaiLogin);
                        } else {
                            if (data[0].namaexternal != null) {
                                $("#judul").text(data[0].namaexternal);
                            } else {

                                $("#judul").text(data[0].judul);
                            }
                            $("#nosep").text('');
                            $("#namapasien").text(data[0].titlepasien + '. ' + data[0].namapasien);
                            $("#tanggalsep").text(data[0].tglregistrasi);
                            $("#kartupasien").text('');
                            $("#norujukan").text('');
                            $("#nocm").text(noCm);
                            $("#tglrujukan").text('');
                            $("#jeniskelamin").text(data[0].jeniskelamin);
                            $("#asalrujukan").text('');
                            $("#tanggallahir").text(moment(data[0].tgllahir).format('YYYY-MM-DD'));
                            // moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                            $("#diagnosa").text();
                            $("#tujuanrujukan").text(data[0].namapolibpjs + '/' + data[0].namaruangan);
                            $("#petugas").text($scope.item.PegawaiLogin);
                        }
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

            //emd
        }
    ]);
});