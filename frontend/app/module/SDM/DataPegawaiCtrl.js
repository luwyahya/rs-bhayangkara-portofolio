define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DataPegawaiCtrl', ['CacheHelper', '$scope', 'ModelItem', '$state', 'DateHelper', '$timeout', 'CetakHelper', 'MedifirstService',
        function (cacheHelper, $scope, ModelItem, $state, dateHelper, $timeout, cetakHelper, medifirstService) {
            $scope.title = "Data Pegawai";
            $scope.now = new Date();
            $scope.item = {
                qstatusPegawai: []
            };
            $scope.itemF = {};
            $scope.username = "Show";
            $scope.dialogPopup;
            $scope.dataSelected = {};
            $scope.dataSelectedRikesla = {};
            $scope.popupHistory;
            $scope.isRouteLoading = false;
            $scope.hilang = true;
            formLoad();

            function formLoad() {
                $scope.monthSelectorOptions = {
                    start: "year",
                    depth: "year"
                };

                var data = cacheHelper.get('listPegawai');
                $scope.filteredData = [];

                if (data === undefined) {
                    data = [];
                }

                $scope.daftarPegawai = new kendo.data.DataSource({
                    data: data,
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                    serverFiltering: false
                });

                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listUnitKerja = dataCombo.dataunitkerja;
                    $scope.ListKedudukanPegawai = dataCombo.statuspegawai;
                    $scope.ListStatusPegawai = dataCombo.kategorypegawai;
                    $scope.ListTahunPajak = dataCombo.tahunpajak;
                    $scope.ListKelompokProdukBpjs = dataCombo.kelompokprodukbpjs;
                    $scope.ListJenisPetugasPelaksana = dataCombo.jenispetugaspelaksana;
                    $scope.listNamaRuangan = dataCombo.ruangan;
                    $scope.optStatus = {
                        placeholder: "Pilih Kategory...",
                        dataTextField: "kategorypegawai",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: true,

                    };

                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.dropDownPegawai = data;
                    LoadDataGrid();
                });
            }


            $scope.pajakPenghasilanTahun = function (item, data) {
                var user = medifirstService.getPegawaiLogin();
                if (user.id == '25001' || user.id == '25248' || user.id == '1') {
                    $scope.winDialogss.center().open();
                } else {
                    messageContainer.error('Anda Tidak Bisa Mengakses Menu Tersebut!!');
                    return;
                }
            }

            function LoadDataGrid() {
                $scope.isRouteLoading = true;
                var user = medifirstService.getPegawaiLogin();
                //cek vic
                if (user.id == 1) {
                    medifirstService.get("sdm/get-data-pegawai-all-sdm", true).then(function (dat) {
                        debugger
                        var dataForGrid = dat.data
                        for (var i = 0; i < dataForGrid.length; i++) {
                            if (dataForGrid[i].tglmasuk != null) {
                                var masakerja = dateHelper.CountAge(new Date(dataForGrid[i].tglmasuk), $scope.now);
                                dataForGrid[i].masakerja = masakerja.year + ' th, ' + masakerja.month + ' bln, ' + masakerja.day + ' hr';
                            } else {
                                dataForGrid[i].masakerja = ''
                            }
                        }
                        $scope.daftarPegawai = new kendo.data.DataSource({
                            data: dataForGrid,
                            pageSize: 10,
                            total: dataForGrid.length,
                            serverPaging: false
                        });
                        $scope.isRouteLoading = false
                    });
                    return
                }
                medifirstService.get("sdm/get-vic-to-data-pegawai").then(function (dat) {
                    debugger
                    var vic = dat.data
                    if (vic.length > 0) {
                        for (var i = 0; i < vic.length; i++) {
                            if (user.id == vic[i].objectpegawaifk) {
                                medifirstService.get("sdm/get-data-pegawai-all-sdm?", true).then(function (dat) {
                                    var dataForGrid = dat.data
                                    for (var i = 0; i < dataForGrid.length; i++) {
                                        var masakerja = dateHelper.CountAge(new Date(dataForGrid[i].tglmasuk), $scope.now);
                                        dataForGrid[i].masakerja = masakerja.year + ' th, ' + masakerja.month + ' bln, ' + masakerja.day + ' hr';
                                    }
                                    $scope.daftarPegawai = new kendo.data.DataSource({
                                        data: dataForGrid,
                                        pageSize: 10,
                                        total: dataForGrid.length,
                                        serverPaging: false
                                    });
                                    $scope.isRouteLoading = false
                                });
                                return
                            }
                        }
                        $scope.isRouteLoading = false
                    }
                    //cekkalak
                    medifirstService.get("sdm/get-anggota?idKalak=" + user.id).then(function (dat) {
                        debugger
                        var anggota = dat.data
                        if (dat.data.length > 0) {
                            var tampungansesungguhnya = "";
                            var tampungcoy = "";
                            var idPegawai = "";
                            for (var i = anggota.length - 1; i >= 0; i--) {
                                var c = anggota[i].idpegawai
                                idPegawai = "," + c
                                tampungcoy = tampungcoy + idPegawai
                            }
                            tampungansesungguhnya = tampungcoy.slice(1, tampungcoy.length)
                            tampungansesungguhnya = tampungansesungguhnya + "," + user.id
                            medifirstService.get("sdm/get-data-pegawai-all-sdm?idPegawai=" + tampungansesungguhnya, true).then(function (dat) {
                                debugger
                                var dataForGrid = dat.data
                                for (var i = 0; i < dataForGrid.length; i++) {
                                    var masakerja = dateHelper.CountAge(new Date(dataForGrid[i].tglmasuk), $scope.now);
                                    dataForGrid[i].masakerja = masakerja.year + ' th, ' + masakerja.month + ' bln, ' + masakerja.day + ' hr';
                                }
                                $scope.daftarPegawai = new kendo.data.DataSource({
                                    data: dataForGrid,
                                    pageSize: 10,
                                    total: dataForGrid.length,
                                    serverPaging: false
                                });
                                $scope.isRouteLoading = false
                                $scope.hilang = false;
                            });
                            return
                        } else {
                            medifirstService.get("sdm/get-data-pegawai-all-sdm?idPegawai2=" + user.id, true).then(function (dat) {
                                debugger
                                var dataForGrid = dat.data
                                for (var i = 0; i < dataForGrid.length; i++) {
                                    var masakerja = dateHelper.CountAge(new Date(dataForGrid[i].tglmasuk), $scope.now);
                                    dataForGrid[i].masakerja = masakerja.year + ' th, ' + masakerja.month + ' bln, ' + masakerja.day + ' hr';
                                }
                                $scope.daftarPegawai = new kendo.data.DataSource({
                                    data: dataForGrid,
                                    pageSize: 10,
                                    total: dataForGrid.length,
                                    serverPaging: false
                                });
                                $scope.isRouteLoading = false
                                $scope.hilang = false;
                                return
                            });
                        }
                    })
                    //pegawai

                })
                // medifirstService.get("sdm/get-data-pegawai-all-sdm?", true).then(function(dat) {
                //     var dataForGrid = dat.data
                //     $scope.daftarPegawai = new kendo.data.DataSource({
                //         data: dataForGrid,
                //         pageSize: 10,
                //         total: dataForGrid.length,
                //         serverPaging: false
                //     });
                //     $scope.isRouteLoading = false
                // });
            }

            $scope.getIsiComboSubUnit = function () {
                if ($scope.item.qunitKerja != undefined || $scope.item.qunitKerja != "") {
                    $scope.listSubUnit = $scope.item.qunitKerja.subunit
                }
            }

            $scope.exportDetail = function (e) {
                var tempDataExport = [];
                var rows = [{
                    cells: [
                        { value: "idFinger" },
                        { value: "NIP" },
                        { value: "Nama" },
                        { value: "Gelar(Dpn)" },
                        { value: "Gelar(Blkng)" },
                        { value: "Nama Lengkap" },
                        { value: "Tempat Lahir" },
                        { value: "Tanggal Lahir" },
                        { value: "Jenis Kelamin" },
                        { value: "Status Pegawai" },
                        { value: "Kedudukan Pegawai" },
                        { value: "Tanggal Masuk" },
                        { value: "Tanggal Keluar" },
                        { value: "Golongan" },
                        { value: "Jabatan Struktural/Fungsional" },
                        { value: "Pendidikan" },
                        { value: "Jabatan Internal" },
                        { value: "Kelompok Jabatan" },
                        { value: "Status Kawin" },
                        { value: "No Rekening" },
                        { value: "Nama Rekening" },
                        { value: "Kode Bank" },
                        { value: "NPWP" },
                        { value: "Alamat" },
                        { value: "Kodepos" },
                        { value: "Agama" },
                        { value: "Unit Kerja" },
                        { value: "Sub Unit Kerja" },
                        { value: "Eselon" },
                        { value: "Pola Kerja" },
                        { value: "Nilai Jabatan" },
                        { value: "Grade" },
                        { value: "SIP" },
                        { value: "Tgl Terbit SIP" },
                        { value: "Tgl Berakhir SIP" },
                        { value: "STR" },
                        { value: "Tgl Terbit STR" },
                        { value: "Tgl Berakhir STR" }
                    ]
                }];
                if ($scope.filteredData.length > 0) {
                    tempDataExport = new kendo.data.DataSource({
                        data: $scope.filteredData
                    });
                } else {
                    tempDataExport = $scope.daftarPegawai;
                }
                tempDataExport.fetch(function () {
                    var data = this.data();
                    for (var i = 0; i < data.length; i++) {
                        //push single row for every record
                        rows.push({
                            cells: [
                                { value: data[i].idFinger },
                                { value: data[i].nipPns },
                                { value: data[i].nama },
                                { value: data[i].gelarDepan },
                                { value: data[i].gelarBelakang },
                                { value: data[i].namaLengkap },
                                { value: data[i].tempatLahir },
                                { value: data[i].tglLahir, format: "dd MM yyyy" },
                                { value: data[i].jenisKelamin },
                                { value: data[i].kategoriPegawai },
                                { value: data[i].kedudukan },
                                { value: data[i].tglMasuk },
                                { value: data[i].tglKeluar },
                                { value: data[i].namaGolongan },
                                { value: data[i].namaJabatan },
                                { value: data[i].namaPendidikan },
                                { value: data[i].jabatanInternal },
                                { value: data[i].kelompokJabatan },
                                { value: data[i].statusPerkawinanPegawai },
                                { value: data[i].bankRekeningNomor },
                                { value: data[i].bankRekeningAtasNama },
                                { value: data[i].bankRekeningNama },
                                { value: data[i].npwp },
                                { value: data[i].alamat },
                                { value: data[i].kodePos },
                                { value: data[i].agama },
                                { value: data[i].unitKerja },
                                { value: data[i].subUnitKerja },
                                { value: data[i].eselon },
                                { value: data[i].shiftKerja },
                                { value: data[i].nilaiJabatan },
                                { value: data[i].grade },
                                { value: data[i].noSip },
                                { value: data[i].tglTerbitSip },
                                { value: data[i].tglBerakhirSip },
                                { value: data[i].noStr },
                                { value: data[i].tglTerbitStr },
                                { value: data[i].tglBerakhirStr }
                            ]
                        })
                    }
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: [{
                            freezePane: {
                                rowSplit: 1
                            },
                            columns: [
                                // Column settings (width)
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                                { autoWidth: true },
                            ],
                            // Title of the sheet
                            title: "Employees",
                            // Rows of the sheet
                            rows: rows
                        }]
                    });
                    //save the file as Excel file with extension xlsx
                    // kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "RSAB HK Export Data Pegawai Detail-" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY HH:mm:ss') + ".xlsx" });
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.daftarpegawaiOpt = {
                // toolbar: [
                // "excel",
                // {text: "export", name:"Export detail", template: '<button ng-click="exportDetail()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export All to Excel</button>'},
                // {name: "username", text:"Show username", template: '<button ng-click="toogleClick()" class="k-button k-button-icontext k-grid-upload pull-right"><span class="k-icon k-i-refresh"></span>{{username}} Username</button>'}
                // ],
                // excel: {
                //     allPages: true,
                //     fileName: "RSAB HK Export Data Pegawai-" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY HH:mm:ss') +".xlsx"
                // },
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Pegawai.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:L1"];
                    sheet.name = "Pegawai";

                    var myHeaders = [{
                        value: "Pegawai",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                pageSize: 10, //page size
                selectable: 'row',
                scrollable: true,
                columns: [
                    // { field: "nippns", title: "Nip", width: "10%" },
                    { field: "namalengkap", title: "Nama Lengkap", width: "25%" },
                    { field: "jeniskelamin", title: "Jenis Kelamin", width: "25%" },
                    // {
                    //   field: "NamaUser",
                    //   title: "Username", 
                    //   width: "20%", 
                    //   hidden: true ,
                    //   // template: "# for(var i=0; i < usernames.length;i++){# usernames.usernames.namaUser #}"
                    // },
                    { field: "tgllahir", title: "Tgl Lahir", width: "10%", template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>" },
                    { field: "namakategorypegawai", title: "Kategory Pegawai", width: "25%" },
                    { field: "namaruangan", title: "Ruangan", width: "25%" },
                    { field: "jbfungsional", title: "Jabatan Fungsional", width: "20%" },
                    // { field: "golongan", title: "Golongan", width: "20%" },
                    { field: "pendidikan", title: "Pendidikan", width: "20%" },
                    { field: "tglmasuk", title: "Tgl Masuk", width: "10%", template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>" },
                    { field: "masakerja", title: "Masa Kerja", width: "10%" },
                    { field: "tglberakhirsip", title: "Tgl SIP", width: "10%", template: "<span class='style-left'>{{formatTanggal('#: tglberakhirsip #')}}</span>" },
                    { field: "tglberakhirstr", title: "Tgl STR", width: "10%", template: "<span class='style-left'>{{formatTanggal('#: tglberakhirstr #')}}</span>" },
                    { field: "idhafis", title: "ID Hafis", width: "20%" },
                    { field: "namahafis", title: "Nama Hafis", width: "20%" },
                    // { field: "petugasdiklat", title: "Diklat", width: "20%" },
                    // { field: "jbstruktural", title: "Jabatan Internal", width: "20%", hidden: "true" },
                    // { field: "statuspegawai", title: "Status", width: "10%" },
                    // { field: "namakategorypegawai", title: "Kategory", width: "10%" },
                    // { field: "detailkelompokjabatan", title: "Kelompok Jabatan", width: "20%" },

                ],
                // set column width to auto
                excelExport: function (e) {
                    var columns = e.workbook.sheets[0].columns;
                    columns.forEach(function (column) {
                        delete column.width;
                        column.autoWidth = true;
                    });
                },
                change: function (e) {
                    var grid = $("#gridDataPegawai").data("kendoGrid");
                    var selectedRows = grid.dataItem(grid.select());
                    // for(var i=0; i < $scope.arrayMapAtasan.length; i++){
                    //     if(selectedRows.idPegawai == $scope.arrayMapAtasan[i].pegawai.id){
                    //         if($scope.arrayMapAtasan[i].atasanLangsung) selectedRows.atasanLangsung = $scope.arrayMapAtasan[i].atasanLangsung;
                    //         if($scope.arrayMapAtasan[i].atasanPejabatPenilai) selectedRows.atasanPejabatPenilai = $scope.arrayMapAtasan[i].atasanPejabatPenilai;
                    //         break;
                    //     }
                    // }
                    $scope.dataItem = selectedRows;
                }
            };

            $scope.klik = function (data) {
                $scope.dataItem = data;
            }

            $scope.ubah = function () {
                if ($scope.dataItem) {
                    var chacePeriode = {
                        0: $scope.dataItem.id,
                        1: 'EditPegawai',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('MasterPegawaiCtrl', chacePeriode);
                    $state.go('MasterPegawai')
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.pajakPenghasilan = function () {
                if ($scope.dataItem) {
                    var chacePeriode = {
                        0: $scope.dataItem.id,
                        1: 'EditPegawai',
                        2: $scope.item.tahunPajak.tahun,
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('PajakPenghasilanPegawaiCtrl', chacePeriode);
                    $state.go('PajakPenghasilanPegawai')
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }
            $scope.InputBaru = function () {
                var chacePeriode = {
                    0: '',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('MasterPegawaiCtrl', chacePeriode);
                $state.go('MasterPegawai')
            }

            $scope.idFinger = function () {
                if ($scope.dataItem) {
                    $scope.itemF.idFinger = $scope.dataItem.fingerprintid;
                    $scope.itemF.tglInput = moment($scope.now).format('YYYY-MM-DD HH:mm');
                    $scope.itemF.idPegawai = $scope.dataItem.id;
                    $scope.itemF.namaLengkap = $scope.dataItem.namalengkap;
                    $scope.itemF.JenisKelamin = $scope.dataItem.jeniskelamin;
                    $scope.itemF.namaJabatan = $scope.dataItem.jbfungsional;
                    $scope.popUpIdFinger.center().open();
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };

            }

            $scope.cetak = function () {

                var user = medifirstService.getPegawaiLogin();

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
                debugger
                if ($scope.undefined == undefined) {
                    messageContainer.error('Pegawai belum di pilih');
                    return;
                }
                if (user.id != $scope.undefined.id) {
                    messageContainer.error('Akun dan Data Pegawai Tidak Sesuai!!');
                    return;
                }

                var idpegawai = $scope.undefined.id;
                var namabendahara = "SRIE PUJI ASTUTI, AMK";
                var npwpbendahara = "48.700.463.2-005.000";
                // if($scope.item.npwpbendahara == null || $scope.item.npwpbendahara =="" || $scope.item.npwpbendahara == undefined)
                // {
                // 	npwpbendahara = "";
                // }else{
                // 	npwpbendahara = $scope.item.npwpbendahara ;
                // }

                var nipnrpbendahara = "74070764";
                var tgltt = $scope.undefined.tglttd;
                // var tgltt = moment($scope.undefined.tglttd).format('DD-MM-YYYY');
                debugger;

                var data = {
                    "gambarLogo": "kemenkue.jpg",
                    "paramKey": ["namaRS", "kemenkeu", "idpegawai", "namabendahara", "npwpbendahara", "nipnrpbendahara", "tgltt"],
                    "paramValue": ["BUKTI PEMOTONGAN PAJAK PENGHASILAN PASA 21 BAGI PEGAWAI NEGARI SIPIL ATAU ANGGOTA TENTARA NASIONAL INDONESIA ATAU ANGGOTA POLISI REPUBLIK INDONESIA ATAU PEJABAT NEGARA ATAU PENSIUNANNYA", "KEMENTRIAN KEUANGAN RI DIREKTORAT JENDRAL PAJAK", idpegawai, namabendahara, npwpbendahara, nipnrpbendahara, tgltt],
                    "paramType": ["", "", "", "", "", "", ""]
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
                if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                    xhr.open('POST', 'http://192.168.1.7:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('192.168.1.116') > -1) {
                    xhr.open('POST', 'http://192.168.1.116:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/pemotonganpajak.pdf');
                } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                    xhr.open('POST', 'http://10.5.1.2:8797/generic/report/pemotonganpajak.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/pemotonganpajak.pdf');
                }
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

            $scope.listPetugasPelaksana = function () {
                medifirstService.get("sdm/get-data-pegawai-all-pp?idPegawai=" + $scope.dataItem.id, true).then(function (dat) {
                    var dataForGrid = dat.data
                    $scope.daftarPegawaiPp = new kendo.data.DataSource({
                        data: dataForGrid,
                        pageSize: 10,
                        total: dataForGrid.length,
                        serverPaging: false
                    });
                    $scope.isRouteLoading = false
                });
                $scope.popUpPp.center().open()
            }
            $scope.ColumnPetugasPelaksana = {
                columns: [
                    // {
                    //     "field": "namaruangan",
                    //     "title": "No",
                    //     "width": "30px",
                    // },
                    {
                        'field': "namakpb",
                        'title': "Nama InaCbg",
                        "width": "160px",
                    },
                    {
                        'field': "namajpp",
                        'title': "Nama Pelaksana",
                        "width": "160px",
                    }
                    // {
                    //     "field": "namaproduk",
                    //     "title": "Layanan",
                    //     "width": "160px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>"
                    // }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }

            $scope.petugasPelaksana = function () {
                $scope.statusenabled = true
                $scope.flag = false;
                if ($scope.dataSelected.idkpb != undefined) {
                    $scope.item.namakpbs = { idkpb: $scope.dataSelected.idkpb, kelompokprodukbpjs: $scope.dataSelected.namakpb }
                    $scope.item.namajpps = { idjpp: $scope.dataSelected.idjpp, jenispetugaspe: $scope.dataSelected.namajpp }
                    $scope.popUpPelP.center().open()
                } else {
                    messageContainer.error('Data belum di pilih')
                };

            }
            $scope.petugasPelaksanaHapus = function () {
                if ($scope.dataSelected.idkpb != undefined) {
                    var stt = 'false'
                    if (confirm('Hapus Data? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    if (stt === 'true') {
                        $scope.statusenabled = false
                        $scope.flag = false;
                        $scope.simpanPetugas();
                    }
                } else {
                    messageContainer.error('Data belum di pilih')
                };

                // $scope.statusenabled = false
                // $scope.flag = false;
                // if ($scope.dataSelected.idkpb != undefined) {
                //     $scope.item.namakpbs = { idkpb:  $scope.dataSelected.idkpb, kelompokprodukbpjs: $scope.dataSelected.namakpb}
                //     $scope.item.namajpps = { idjpp:  $scope.dataSelected.idjpp, jenispetugaspe: $scope.dataSelected.namajpp}
                //     $scope.popUpPelP.center().open()
                // } else {
                //     messageContainer.error('Data belum di pilih')
                // };

            }
            $scope.petugasPelaksanaTam = function () {
                $scope.dataSelected.id = undefined;
                $scope.flag = true;
                $scope.statusenabled = true
                $scope.item.namakpbs = { idkpb: 0, kelompokprodukbpjs: 0 }
                $scope.item.namajpps = { idjpp: 0, jenispetugaspe: 0 }
                $scope.popUpPelP.center().open()
            }

            $scope.simpanPetugas = function () {
                debugger;
                // $flag = false 
                // if($scope.item.namakpbs.idkpb === $scope.item.namakpbs.id && $scope.item.namajpps.idjpp === $scope.item.namajpps.id)
                if ($scope.statusenabled === false) {
                    var json = {
                        'id': $scope.dataSelected.id,
                        'statusenabled': $scope.statusenabled,
                        'objectpegawaifk': $scope.dataItem.id,
                        'objectkelompokprodukbpjsfk': $scope.dataSelected.idkpb,
                        'objectpetugaspelaksanafk': $scope.dataSelected.idjpp,
                    }
                } else {
                    if ($scope.item.namakpbs.idkpb === undefined) {
                        $scope.item.namakpbs.idkpb = $scope.item.namakpbs.id
                        // $flag = true
                    }
                    if ($scope.item.namajpps.idjpp === undefined) {
                        $scope.item.namajpps.idjpp = $scope.item.namajpps.id
                        // $flag = true
                    }
                    if ($scope.dataSelected.id === undefined) {
                        $scope.dataSelected.id = null
                    }
                    var json = {
                        'id': $scope.dataSelected.id,
                        'statusenabled': $scope.statusenabled,
                        'objectpegawaifk': $scope.dataItem.id,
                        'objectkelompokprodukbpjsfk': $scope.item.namakpbs.idkpb,
                        'objectpetugaspelaksanafk': $scope.item.namajpps.idjpp,
                    }
                }
                if ($scope.flag === true) {
                    medifirstService.post('tatarekening/save-petugas-pelaksana', json).then(function (e) { })
                } else {
                    medifirstService.post('tatarekening/update-petugas-pelaksana', json).then(function (e) { })
                }
                $scope.popUpPelP.close()
                $scope.popUpPp.close()
            }

            $scope.TutupPopUpPp = function () {
                $scope.popUpPp.center().close();
            }

            $scope.simpanIdFinger = function () {
                if ($scope.itemF.idFinger == undefined) {
                    alert("Id Finger Tidak Boleh Kosong!")
                    return;
                }

                var objSave = {
                    idpegawai: $scope.itemF.idPegawai,
                    tglinput: $scope.itemF.tglInput,
                    idfinger: $scope.itemF.idFinger
                }

                medifirstService.post('sdm/update-idfinger-pegawai', objSave).then(function (e) {
                    $scope.itemF.idFinger = undefined;
                    $scope.itemF.tglInput = undefined;
                    $scope.itemF.idPegawai = undefined
                    $scope.itemF.namaLengkap = undefined;
                    $scope.itemF.JenisKelamin = undefined;
                    $scope.itemF.namaJabatan = undefined;
                    $scope.popUpIdFinger.close();
                    formLoad();
                }, function (error) {
                    toastr.error(JSON.stringify(error.message), 'Error')
                });
            }

            $scope.batalFinger = function () {
                $scope.itemF.idFinger = undefined;
                $scope.itemF.tglInput = undefined;
                $scope.itemF.idPegawai = undefined
                $scope.itemF.namaLengkap = undefined;
                $scope.itemF.JenisKelamin = undefined;
                $scope.itemF.namaJabatan = undefined;
                // $scope.popUpIdFinger.close();
            }

            $scope.mutasi = function () {
                if ($scope.dataItem) {
                    $state.go("MutasiPegawai", { idPegawai: $scope.dataItem.id });
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.keluarga = function () {
                if ($scope.dataItem) {
                    $state.go("DataKeluarga", { idPegawai: $scope.dataItem.id });
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.mappingAtasan = function (e) {
                if ($scope.dataItem) {
                    $state.go("MappingAtasanPegawai", {
                        idPegawai: $scope.dataItem.id,
                        namaLengkap: $scope.dataItem.namakengkap
                    })
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            };

            $scope.riwayatPendidikan = function (e) {
                if ($scope.dataItem) {
                    $state.go("RiwayatPendidikan", {
                        idPegawai: $scope.dataItem.id,
                        namaLengkap: $scope.dataItem.namalengkap,
                        nip: $scope.dataItem.nippns,
                    })
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            };
            $scope.riwayatJabatan = function (e) {
                if ($scope.dataItem) {
                    $state.go("RiwayatJabatan", {
                        idPegawai: $scope.dataItem.id,
                        namaLengkap: $scope.dataItem.namalengkap,
                        nip: $scope.dataItem.nippns,
                    })
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            };
            $scope.goToUrl = function () {
                $scope.dialogPopup.close();
                $state.go('MasaBerlakuSipStr');
            };
            $scope.goToUrlReport = function (data) {
                var listRawRequired = [
                    "report.statusPegawai|k-ng-model|Status pegawai"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.dialogReport.close();
                    var fixUrlLaporan = cetakHelper.openURLReporting("reporting/data-pegawai-berdasarkan-kategori-pegawai?kategoryPegawaiId=" + data.statusPegawai.id);
                    window.open(fixUrlLaporan, "Report Pegawai (" + data.statusPegawai.kategoryPegawai + ") RSABHK", "width=800, height=600");
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            };
            $scope.goToUrlReportAll = function () {
                $scope.dialogReport.close();
                var fixUrlLaporan = cetakHelper.openURLReporting("reporting/data-pegawai-berdasarkan-kategori-pegawai?kategoryPegawaiId=");
                window.open(fixUrlLaporan, "Report Pegawai RSABHK", "width=800, height=600");
            }

            function filterSubunit(subUnit) {
                if (!$scope.item.qunitKerja) return;
                if (subUnit.id === $scope.item.qunitKerja.id) {
                    return true;
                }
                return false;
            }
            var timeoutPromise;
            $scope.$watch('item.qnamaPegawai', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.qkedudukanPegawai', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("statuspegawai", newVal)
                }
            });
            $scope.$watch('item.qjabatanInternal', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("objectjabatanstrukturalfk", newVal)
                }
            });
            $scope.$watch('item.qunitKerja', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    // var filteredSubUnit = $scope.listUnitKerja.filter(filterSubunit);
                    // if ($scope.item.qsubUnitKerja && $scope.item.qsubUnitKerja.id !== newVal.id) delete $scope.item.qsubUnitKerja;
                    // if (filteredSubUnit.length > 0) {
                    //     $scope.listSubUnit = filteredSubUnit;
                    // } else {
                    //     $scope.listUnitKerja = $scope.listUnitKerja;
                    // }
                    applyFilter("objectunitkerjapegawaifk", newVal)
                }
            });

            $scope.$watch('item.qstatusPegawai', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("namakategorypegawai", newVal)
                }
            }, true);

            $scope.$watch('item.namaRuangan', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("objectruangankerjafk", newVal)
                }
            }, true);

            $scope.$watch('item.tglMasuk', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("tglmasuk", newVal)
                }
            });

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridDataPegawai").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterField === "namalengkap") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                } else if (filterField === "namaexternaldl") {

                    currentFilters.push({
                        field: "dl",
                        operator: "eq",
                        value: "dl"
                    });

                } else if (filterField === "namaexternalnull") {

                    currentFilters.push({
                        field: "dl",
                        operator: "contains",
                        value: "gakada"
                    });

                } else if (filterField === "statuspegawai") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.statuspegawai
                    });
                } else if (filterField === "objectjabatanstrukturalfk" || filterField === "objectunitkerjafk") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else if (filterField === "kategorypegawai") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.kategorypegawai
                    });
                } else if (filterField === "objectunitkerjapegawaifk") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.objectunitkerjapegawaifk
                    });
                } else if (filterField === "objectruangankerjafk") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                }
                // else if (filterField === "namakategorypegawai") {
                //     currentFilters.push({
                //         field: filterField,
                //         operator: "contains",
                //         value: filterValue.kategorypegawai
                //     });

                // } 
                else if (filterField === "namakategorypegawai") {
                    currentFilters.push({
                        // field: filterField,
                        // operator: "contains",
                        // value: filterValue,
                        field: "namakategorypegawai",
                        operator: function (namakategorypegawai, value) {
                            // debugger
                            for (var i = 0; i < $scope.item.qstatusPegawai.length; i++) {
                                var tag = $scope.item.qstatusPegawai[i].kategorypegawai;
                                if (tag === namakategorypegawai)
                                    return true;
                            }

                            return false;
                        }
                    });


                } else if (filterField === "namakategorypegawainot") {
                    currentFilters.push({
                        // field: filterField,
                        // operator: "contains",
                        // value: filterValue,
                        field: "namakategorypegawai",
                        operator: function (namakategorypegawai, value) {
                            // debugger
                            // for (var i = 0; i < $scope.item.qstatusPegawaiNot.length; i++) {
                            //     var tag = $scope.item.qstatusPegawaiNot[i].kategorypegawai;
                            if (namakategorypegawai != 'PNS' && namakategorypegawai != 'BLUD') {
                                return true;
                            }
                            // }

                            return false;
                        }
                    });


                } else if (filterField === "tglmasuk") {

                    var date = new Date($scope.item.tglMasuk),
                        y = date.getFullYear(),
                        m = date.getMonth() + 1;

                    if (m < 10) {
                        m = '0' + m;
                    }

                    var filter = y + '-' + m;

                    // var filter = moment( new Date($scope.item.tglMasuk)).format('MMM-YYYY')

                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filter
                    });
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });

                var allData = dataGrid.dataSource.data();
                var params = dataGrid.dataSource.filter();
                var query = new kendo.data.Query(allData);
                $scope.filteredData = query.filter(params).data;
            }
            $scope.item.qstatusPegawaiNot = []
            $scope.cekisNotPNS = function (bool) {
                var gridData = $("#gridDataPegawai").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item.qstatusPegawaiNot = []
                if (bool) {
                    for (var i = 0; i < $scope.ListStatusPegawai.length; i++) {
                        const elem = $scope.ListStatusPegawai[i]
                        if (elem.kategorypegawai == 'PNS') {
                            $scope.item.qstatusPegawaiNot.push(elem)
                        }
                        if (elem.kategorypegawai == 'BLUD') {
                            $scope.item.qstatusPegawaiNot.push(elem)
                        }
                    }
                    // $scope.item.qstatusPegawaiNot =
                    applyFilter("namakategorypegawainot", $scope.item.qstatusPegawaiNot)
                } else {
                    $scope.resetFilters()
                }
                $scope.item.isNX = false;
                $scope.item.isDL = false;

            }
            $scope.cekisisDL = function (bool) {
                var gridData = $("#gridDataPegawai").data("kendoGrid");
                gridData.dataSource.filter({});
                // $scope.item = {};
                // $scope.filteredData = [];
                $scope.item.isNotPNS = false;
                $scope.item.isNX = false;
                $scope.item.qstatusPegawaiNot = []
                if (bool) {
                    // $scope.resetFilters()
                    applyFilter("namaexternaldl", "dl")
                } else {
                    $scope.resetFilters()
                }

            }
            $scope.cekisisNX = function (bool) {
                var gridData = $("#gridDataPegawai").data("kendoGrid");
                gridData.dataSource.filter({});

                $scope.item.isNotPNS = false;
                $scope.item.isDL = false;
                $scope.item.qstatusPegawaiNot = []
                if (bool) {
                    // $scope.resetFilters()
                    applyFilter("namaexternalnull", "")
                } else {
                    $scope.resetFilters()
                }

            }
            $scope.resetFilters = function () {
                var gridData = $("#gridDataPegawai").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item = {};
                $scope.filteredData = [];
            };
            $scope.riwayat = function (data) {
                if (!data) {
                    messageContainer.error('Pegawai belum di pilih');
                    return;
                }
            }

            function showDetail(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            }

            $scope.closeHistory = function () {
                $scope.title = "Data Pegawai";
                $scope.klikRiwayat = false;
            }



            $scope.simpanAtasan = function (data) {
                var listRawRequired = [
                    "dataItem.atasanPejabatPenilai|k-ng-model|Atasan pejabat penilai",
                    "dataItem.atasanLangsung|k-ng-model|Atasan langsung",
                    "dataItem.idPegawai|ng-model|Pegawai",
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var dataModel = [],
                        itemSend;
                    if (!$scope.dataItem.atasanPejabatPenilai.id || $scope.dataItem.atasanPejabatPenilai.id === "") {
                        itemSend = {
                            pegawai: { id: $scope.dataItem.idPegawai },
                            atasanLangsung: $scope.dataItem.atasanLangsung,
                            statusEnabled: $scope.dataItem.action ? false : true
                        }
                    } else {
                        itemSend = {
                            pegawai: { id: $scope.dataItem.idPegawai },
                            atasanLangsung: $scope.dataItem.atasanLangsung,
                            atasanPejabatPenilai: $scope.dataItem.atasanPejabatPenilai,
                            statusEnabled: true
                        }
                    }
                    dataModel.push(itemSend);
                    ManageSdmNew.saveData(dataModel, "sdm/save-mapping-pegawai-to-atasan").then(function (e) {
                        // grid.dataSource.add($scope.item);
                        init();
                    });
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            $scope.cetakReport = function () {
                $scope.report = {};
                $scope.dialogReport.setOptions({
                    width: 400,
                    title: 'Report Pegawai RSABHK'
                })
                $scope.dialogReport.center();
                $scope.dialogReport.open();
            }

            $scope.toogleClick = function () {
                var grid = $("#gridDataPegawai").data("kendoGrid");
                if ($scope.username == "Show") {
                    grid.showColumn(2);
                    $scope.username = "Hide"
                } else if ($scope.username == "Hide") {
                    grid.hideColumn(2);
                    $scope.username = "Show"
                }

            }
            $scope.cetakRiwayat = function () {
                debugger
                var jenis = 'Nama Suami / Istri'
                var nama = ''
                var jumlahanak = 0
                var namaanak = ''
                var ttl = ''
                var pendidikan = ''
                var tahunlulus = ''
                var notelp = ''
                var dikjur = ''
                var tahundikjur = ''
                var nonformal = ''
                var jabatan = ''
                var jasa = ''
                var asing = ''
                var daerah = ''
                var tglsekarang = ''
                var qrcode = ''
                var foto = ''

                var yanglogin = medifirstService.getPegawaiLogin().namaLengkap
                if ($scope.dataItem.id == undefined) {
                    toastr.error('Data Belum Dipilih !')
                    return
                }
                medifirstService.get("sdm/get-istri-suami?idPegawai=" + $scope.dataItem.id).then(function (dat) {
                    if (dat.data.length > 0) {
                        jenis = dat.data[0].jenis
                        nama = dat.data[0].namalengkap
                    } else {

                    }
                    medifirstService.get("sdm/get-jumlah-anak?idPegawai=" + $scope.dataItem.id).then(function (dat2) {
                        if (dat2.data.length > 0) {
                            jumlahanak = dat2.data[0].jumlahanak
                        }

                        medifirstService.get("sdm/get-anak?idPegawai=" + $scope.dataItem.id).then(function (dat3) {
                            // if (dat3.data.length > 0) {
                            namaanak = dat3.data.namalengkap
                            // }
                            medifirstService.get("sdm/get-ttl-indo?idPegawai=" + $scope.dataItem.id).then(function (dat4) {
                                ttl = dat4.data.ttl
                                tglsekarang = dat4.data.tglsekarang
                                medifirstService.get("sdm/get-pendidikan?idPegawai=" + $scope.dataItem.id).then(function (dat5) {
                                    if (dat5.data.length > 0) {
                                        pendidikan = dat5.data[0].pendidikan
                                        tahunlulus = dat5.data[0].tahunlulus
                                    }
                                    medifirstService.get("sdm/get-telp?idPegawai=" + $scope.dataItem.id).then(function (dat6) {
                                        if (dat6.data.length > 0) {
                                            notelp = dat6.data[0].notelp
                                        }

                                        medifirstService.get("sdm/get-dikjur?idPegawai=" + $scope.dataItem.id).then(function (dat7) {
                                            debugger
                                            if (dat7.data.length > 0) {
                                                dikjur = dat7.data[0].dikjur
                                                tahundikjur = dat7.data[0].tahun
                                            }
                                            medifirstService.get("sdm/get-sisanya?idPegawai=" + $scope.dataItem.id).then(function (dat8) {
                                                debugger
                                                nonformal = dat8.data[0].pelatihan
                                                jabatan = dat8.data[0].jabatan
                                                jasa = dat8.data[0].jasa
                                                asing = dat8.data[0].asing
                                                daerah = dat8.data[0].daerah
                                                foto = dat8.data[0].foto[0].foto

                                                qrcode = "Daftar Riwayat Hidup Ini di Cetak Tanggal " + dat4.data.tglsekarang + " Oleh " + yanglogin


                                                debugger;
                                                $scope.isRouteLoading = true;
                                                var data = {
                                                    "gambarLogo": "logodokkes.jpg",
                                                    "paramKey": ["idPegawai", "jenis", "nama", "jumlahanak", "namaanak", "ttl", "pendidikan", "tahunlulus", "notelp", "dikjur", "nonformal", "jabatan", "jasa", "asing", "daerah", "tglsekarang", "qrcode", "tahundikjur", "foto"],
                                                    "paramValue": [$scope.dataItem.id, jenis, nama, jumlahanak, namaanak, ttl, pendidikan, tahunlulus, notelp, dikjur, nonformal, jabatan, jasa, asing, daerah, tglsekarang, qrcode, tahundikjur, foto],
                                                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                                                if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                                    xhr.open('POST', 'http://192.168.100.254:8797/generic/report/riwayathidup.pdf');
                                                } else if (window.location.hostname.indexOf('appsimrs.rsp.unand.ac.id') > -1) {
                                                    xhr.open('POST', 'http://appsimrs.rsp.unand.ac.id:8797/generic/report/riwayathidup.pdf');
                                                } else {
                                                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/riwayathidup.pdf');
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
                                })
                            })
                        })
                    })
                })
            }
            $scope.riwayatRikesla = function () {
                debugger
                if ($scope.dataItem == undefined) {
                    toastr.error('Pilih Data Terlebih Dahulu')
                    return
                }
                if ($scope.dataItem.nocm == null) {
                    toastr.error('No CM Pegawai Belum Diinput, Tidak Dapat Buka Rikesla !')
                    return
                }
                medifirstService.get('sdm/get-riwayat-rikesla?noCm=' + $scope.dataItem.nocm).then(function (data) {
                    if (data.data.length > 0) {
                        $scope.isRouteLoading = false;
                        var rikesla = data.data
                        for (var i = 0; i < rikesla.length; i++) {
                            rikesla[i].no = i + 1;
                            var tanggal = $scope.now
                            var tanggalLahir = new Date(rikesla[i].tgllahir)
                            var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                            rikesla[i].umur = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        }
                        $scope.sourceRikesla = new kendo.data.DataSource({
                            data: rikesla,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                        $scope.popUpRikesla.center().open()
                    } else {
                        toastr.error('Riwayat Rikesla Tidak Ditemukan !')
                        return
                    }
                })
                $scope.columnRikesla = {
                    scrollable: true,
                    selectable: "row",
                    pageable: true,
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "2%",
                        },
                        {
                            "field": "tglregistrasi",
                            "title": "Tanggal Registrasi",
                            "width": "49%",
                        },
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "49%",
                        },
                    ]
                }
            }
            $scope.cetakRikesla = function () {
                if ($scope.dataSelectedRikesla.norechpm == undefined) {
                    toastr.error('Pilih Data Terlebih Dahulu !')
                    return
                }

                $scope.isRouteLoading = true
                var kesimpulan = $scope.dataSelectedRikesla.kesimpulan
                var nama = $scope.dataSelectedRikesla.namapasien
                var jeniskelamin = $scope.dataSelectedRikesla.jeniskelamin
                var alamat = $scope.dataSelectedRikesla.alamatlengkap
                var umur = $scope.dataSelectedRikesla.umur
                var norechpm = $scope.dataSelectedRikesla.norechpm
                var tanggal = moment($scope.now).format('DD MMM YYYY');
                var tahun = moment($scope.dataSelectedRikesla.tglregistrasi).format('YYYY');
                medifirstService.get('registrasi/laporan/get-hasil-lab-surat?noregistrasi=' + $scope.dataSelectedRikesla.noregistrasi).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = false
                    if (dat.data != undefined) {
                        $scope.hasillab = kesimpulan + ". " + dat.data
                    } else {
                        $scope.hasillab = kesimpulan + ". " + "-"
                    }
                    debugger;
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaPasien", "jenisKelamin", "alamat", "umur", "norechpm", "tglcetak", "tahun", "hasillab1"],
                        "paramValue": [nama, jeniskelamin, alamat, umur, norechpm, tanggal, tahun, $scope.hasillab],
                        "paramType": ["", "", "", "", "", "", "", ""]
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
                    if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                        xhr.open('POST', 'http://192.168.1.7:8797/generic/report/suratketeranganmedis2.pdf');
                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                        xhr.open('POST', 'http://192.168.88.56:8797/generic/report/suratketeranganmedis2.pdf');
                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                        xhr.open('POST', 'http://10.10.20.167:8797/generic/report/suratketeranganmedis2.pdf');
                    } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                        xhr.open('POST', 'http://10.5.1.2:8797/generic/report/suratketeranganmedis2.pdf');
                    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                        xhr.open('POST', 'http://202.51.105.98:8797/generic/report/suratketeranganmedis2.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratketeranganmedis2.pdf');
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                })
            }
            $scope.tutupRikesla = function () {
                $scope.popUpRikesla.close()
            }
            $scope.dokumen = function () {
                if ($scope.dataItem == undefined) {
                    toastr.error('Data Belum Dipilih !', 'Peringatan !')
                    return
                }
                medifirstService.get("sdm/get-dokumen-pegawai-all?idPegawai=" + $scope.dataItem.id).then(function (dat) {
                    debugger
                    var blah = dat.data
                    blah.no = 1;
                    blah.dokumen = []
                    if (blah.dataKeluarga.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Data Keluarga",
                            objectpegawaifk: blah.dataKeluarga[0].objectpegawaifk
                            // objectpegawaifk : blah.
                        })
                    }
                    if (blah.riwayatPendidikan.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Riwayat Pendidikan",
                            objectpegawaifk: blah.riwayatPendidikan[0].objectpegawaifk
                        })
                    }
                    if (blah.riwayatPelatihan.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Riwayat Pelatihan",
                            objectpegawaifk: blah.riwayatPelatihan[0].objectpegawaifk
                        })
                    }
                    if (blah.riwayatJabatan.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Riwayat Jabatan",
                            objectpegawaifk: blah.riwayatJabatan[0].objectpegawaifk
                        })
                    }
                    if (blah.sip.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "SIP",
                            objectpegawaifk: blah.sip[0].objectpegawaifk
                        })
                    }
                    if (blah.str.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "STR",
                            objectpegawaifk: blah.str[0].objectpegawaifk
                        })
                    }
                    if (blah.spkk.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "SPKK",
                            objectpegawaifk: blah.spkk[0].objectpegawaifk
                        })
                    }
                    if (blah.seminar.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Riwayat Seminar",
                            objectpegawaifk: blah.seminar[0].objectpegawaifk
                        })
                    }
                    if (blah.dikjur.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Riwayat Pendidikan Dik / Jur",
                            objectpegawaifk: blah.dikjur[0].objectpegawaifk
                        })
                    }
                    if (blah.bahasa.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Kecakapan Bahasa",
                            objectpegawaifk: blah.bahasa[0].objectpegawaifk
                        })
                    }
                    if (blah.profesi.length > 0) {
                        blah.dokumen.push({
                            Dokumen: "Organisasi Profesi",
                            objectpegawaifk: blah.profesi[0].objectpegawaifk
                        })
                    }
                    var halah = []
                    halah.push(blah)
                    var blahblah = dat.data.dokumen
                    debugger
                    $scope.sourceDokumen = new kendo.data.DataSource({
                        data: halah,
                        pageSize: 50,
                        total: halah.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }
                    });
                    $scope.popUpDokumen.center().open()
                    $scope.columnDokumen = {
                        scrollable: true,
                        selectable: "row",
                        pageable: true,
                        columns: [
                            // {
                            //     field: "no",
                            //     title: "No",
                            //     width: "5%"
                            // },
                            {
                                field: "dokumen",
                                title: "DOKUMEN",
                                width: "10%",
                                "template": "# for(var i=0; i < dokumen.length;i++){# <span class=\"button-details\" )\" >#= dokumen[i].Dokumen #  <em class=\"k-button k-button-icon k-primary\"" +
                                    " style=\" margin: 3px;padding-left: .4em;padding-right: .4em;\"  ng-click=\"blah('#=dokumen[i].objectpegawaifk#','#=dokumen[i].Dokumen#') \" > <span class=\"k-sprite k-icon k-i-search\"  style=\"float: left;margin-top: 0.3em;padding-bottom: 2px;\" >Dokumen</span></em></span> #}#",

                                //     "template": "# for(var i=0; i < details.length;i++){# <span class=\"button-details custom-button='dark-green' \" )\" >#= details[i].name #  <em class=\"k-button k-button-icon k-cancle\"" +
                                // " style=\" margin: 3px;padding-left: .4em;padding-right: .4em;\"  ng-click=\"asupKaForm('#=details[i].path#', '#=data.nocm#', '#=data.namapasien#', '#=data.jeniskelamin#', '#=data.umur#', '#=data.kelompokpasien#', '#=data.tglregistrasi#', '#=data.norec#', '#=data.norec_pd#', '#=data.objectkelasfk#', '#=data.namakelas#', '#=data.objectruanganfk#', '#=data.namaruangan#', '#=data.noregistrasi#', '#=data.alamatlengkap#', '#=data.dokterdpjp#', '#=data.iddpjp#', '#=data.tgllahir#', '#=data.objectkelompokpasienlastfk#', '#=data.kelaspasien#', '#=data.kelaspenjamin#',
                                // '#=data.namakamar#') \" > <span class=\"k-sprite k-icon k-i-search\"  style=\"float: left;margin-top: 0.3em;padding-bottom: 2px;\" >Details</span></em></span> #}#",
                            }
                        ]

                    }
                })

            }
            $scope.kembaliDokumen = function () {
                $scope.sourceDokumen = new kendo.data.DataSource({
                    data: [],
                });
                $scope.popUpDokumen.close();
            }
            $scope.blah = function (objectpegawaifk, Dokumen) {
                debugger
                if (Dokumen == "Data Keluarga") {
                    medifirstService.get('sdm/get-data-detail-pegawai?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var keluarga = dat.data.datakeluarga
                        $scope.sourceKeluarga = new kendo.data.DataSource({
                            data: keluarga,
                            pageSize: 50,
                            total: keluarga.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpKeluarga.center().open()
                    $scope.columnKeluarga = {
                        scrollable: true,
                        selectable: "row",
                        pageable: true,
                        columns: [
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
                                    { text: "Lihat Kartu Keluarga", click: LihatKartuKeluarga, imageClass: "k-icon k-i-delete" },
                                    { text: "Lihat KTP", click: LihatKTP, imageClass: "k-icon k-i-delete" },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
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
                    $scope.kembaliKeluarga = function () {
                        $scope.sourceKeluarga = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpKeluarga.close();
                    }
                }
                if (Dokumen == "Riwayat Pendidikan") {
                    medifirstService.get('sdm/get-data-detail-pegawai?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var pendidikan = dat.data.datapendidikan
                        $scope.sourcePendidikan = new kendo.data.DataSource({
                            data: pendidikan,
                            pageSize: 50,
                            total: pendidikan.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpPendidikan.center().open()
                    $scope.columnPendidikan = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat Ijazah", click: LihatIjazahPendidikan, imageClass: "k-icon k-i-read" },
                                    { text: "Lihat Surat Dikti", click: LihatDiktiPendidikan, imageClass: "k-icon k-i-read" },
                                    { text: "Lihat Surat Akreditasi", click: LihatAkreditasiPendidikan, imageClass: "k-icon k-i-read" },
                                ],
                                title: "",
                                width: "685px",
                            }
                        ]
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
                    $scope.kembaliPendidikan = function () {
                        $scope.sourcePendidikan = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpPendidikan.close();
                    }
                }
                if (Dokumen == "Riwayat Pelatihan") {
                    medifirstService.get('sdm/get-data-detail-pegawai?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var pelatihan = dat.data.datapelatihan
                        $scope.sourcePelatihan = new kendo.data.DataSource({
                            data: pelatihan,
                            pageSize: 50,
                            total: pelatihan.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpPelatihan.center().open()
                    $scope.columnPelatihan = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat Sertifikat", click: LihatSertifikatPelatihan, imageClass: "k-icon k-i-delete" },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
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
                    $scope.kembaliPelatihan = function () {
                        $scope.sourcePelatihan = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpPelatihan.close();
                    }
                }
                if (Dokumen == "Riwayat Jabatan") {
                    medifirstService.get('sdm/get-data-detail-pegawai?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var jabatan = dat.data.datajabatan
                        $scope.sourceJabatan = new kendo.data.DataSource({
                            data: jabatan,
                            pageSize: 50,
                            total: jabatan.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpJabatan.center().open()
                    $scope.columnJabatan = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat Sprint", click: LihatSprint, imageClass: "k-icon k-i-delete" },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
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
                    $scope.kembaliJabatan = function () {
                        $scope.sourceJabatan = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpJabatan.close();
                    }
                }
                if (Dokumen == "SIP") {
                    medifirstService.get('sdm/get-data-sip-pegawai?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var sip = dat.data.data
                        $scope.sourceSip = new kendo.data.DataSource({
                            data: sip,
                            pageSize: 50,
                            total: sip.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpSip.center().open()
                    $scope.columnSip = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat", click: downloadSipStr, imageClass: "k-icon k-delete" }
                                ],
                                title: "",
                                width: "22%",
                            }
                        ]
                    }
                    function downloadSipStr(e) {
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
                    $scope.kembaliSip = function () {
                        $scope.sourceSip = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpSip.close();
                    }
                }
                if (Dokumen == "STR") {
                    medifirstService.get('sdm/get-data-str-pegawai?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var str = dat.data.data
                        $scope.sourceStr = new kendo.data.DataSource({
                            data: str,
                            pageSize: 50,
                            total: str.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpStr.center().open()
                    $scope.columnStr = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat", click: downloadSipStr2, imageClass: "k-icon k-delete" }
                                ],
                                title: "",
                                width: "22%",
                            }
                        ]
                    }
                    function downloadSipStr2(e) {
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
                    $scope.kembaliStr = function () {
                        $scope.sourceStr = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpStr.close();
                    }
                }
                if (Dokumen == "SPKK") {
                    medifirstService.get('sdm/get-data-spkk?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var spkk = dat.data.data
                        $scope.sourceSpkk = new kendo.data.DataSource({
                            data: spkk,
                            pageSize: 50,
                            total: spkk.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpSpkk.center().open()
                    $scope.columnSpkk = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat", click: lihatSpkk, imageClass: "k-icon k-delete" }
                                ],
                                title: "",
                                width: "22%",
                            }
                        ]
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
                    $scope.kembaliSpkk = function () {
                        $scope.sourceSpkk = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpSpkk.close();
                    }
                }
                if (Dokumen == "Riwayat Seminar") {
                    medifirstService.get('sdm/get-data-seminar?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var seminar = dat.data.data
                        $scope.sourceSeminar = new kendo.data.DataSource({
                            data: seminar,
                            pageSize: 50,
                            total: seminar.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpSeminar.center().open()
                    $scope.columnSeminar = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat Sertifikat", click: LihatSertifikatSeminar, imageClass: "k-icon k-i-delete" },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
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
                    $scope.kembaliSeminar = function () {
                        $scope.sourceSeminar = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpSeminar.close();
                    }
                }
                if (Dokumen == "Riwayat Pendidikan Dik / Jur") {
                    medifirstService.get('sdm/get-data-dikjur?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var dikjur = dat.data.data
                        $scope.sourceDikjur = new kendo.data.DataSource({
                            data: dikjur,
                            pageSize: 50,
                            total: dikjur.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpDikjur.center().open()
                    $scope.columnDikjur = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat", click: LihatSertifikatDikjur, imageClass: "k-icon k-i-delete" },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
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
                    $scope.kembaliDikjur = function () {
                        $scope.sourceDikjur = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpDikjur.close();
                    }
                }
                if (Dokumen == "Kecakapan Bahasa") {
                    medifirstService.get('sdm/get-data-kecakapan-bahasa?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var bahasa = dat.data.data
                        $scope.sourceBahasa = new kendo.data.DataSource({
                            data: bahasa,
                            pageSize: 50,
                            total: bahasa.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpBahasa.center().open()
                    $scope.columnBahasa = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
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
                                    { text: "Lihat", click: LihatSertifikatBahasa, imageClass: "k-icon k-i-delete" },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
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
                    $scope.kembaliBahasa = function () {
                        $scope.sourceBahasa = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpBahasa.close();
                    }
                }
                if (Dokumen == "Organisasi Profesi") {
                    medifirstService.get('sdm/get-data-organisasi-profesi?idPegawai=' + objectpegawaifk).then(function (dat) {
                        debugger
                        var profesi = dat.data.data
                        $scope.sourceProfesi = new kendo.data.DataSource({
                            data: profesi,
                            pageSize: 50,
                            total: profesi.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {

                                    }
                                }
                            }
                        });
                    })
                    $scope.popUpProfesi.center().open()
                    $scope.columnProfesi = {
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [
                            {
                                "field": "nokta",
                                "title": "No KTA",
                                "width": "25%"
                            },
                            {
                                "command": [
                                    { text: "Lihat", click: LihatOrganisasiProfesi, imageClass: "k-icon k-i-delete" },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
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
                    $scope.kembaliProfesi = function () {
                        $scope.sourceProfesi = new kendo.data.DataSource({
                            data: [],
                        });
                        $scope.popUpProfesi.close();
                    }
                }
            }
            // * BATAS SUCI *//
        }
    ]);
});