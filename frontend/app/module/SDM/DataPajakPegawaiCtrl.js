define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DataPajakPegawaiCtrl', ['CacheHelper', '$scope', 'ModelItem', '$state', 'DateHelper', '$timeout', 'CetakHelper', 'MedifirstService',
        function(cacheHelper, $scope, ModelItem, $state, dateHelper, $timeout, cetakHelper, medifirstService) {
            $scope.title = "Data Pegawai";
            $scope.now = new Date();
            $scope.item = {
                qstatusPegawai: []
            };
            $scope.itemF = {};
            $scope.username = "Show";
            $scope.dialogPopup;
            $scope.dataSelected = {};
            $scope.popupHistory;
            $scope.isRouteLoading = false;
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

                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function(dat) {
                    var dataCombo = dat.data
                        // var dataLogin = dat.datalogin[0];
                    $scope.listUnitKerja = dataCombo.dataunitkerja;
                    $scope.ListKedudukanPegawai = dataCombo.statuspegawai;
                    $scope.ListStatusPegawai = dataCombo.kategorypegawai;
                    $scope.ListKelompokProdukBpjs = dataCombo.kelompokprodukbpjs;
                    $scope.ListJenisPetugasPelaksana = dataCombo.jenispetugaspelaksana;
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

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function(data) {
                    $scope.dropDownPegawai = data;
                    LoadDataGrid();
                });
            }

            function LoadDataGrid() {
                debugger
                $scope.isRouteLoading = true;
                var user = medifirstService.getPegawaiLogin();
                medifirstService.get("sdm/get-data-pegawai-all-sdm?idPegawai=" + user.id, true).then(function(dat) {
                    var dataForGrid = dat.data
                    $scope.daftarPegawai = new kendo.data.DataSource({
                        data: dataForGrid,
                        pageSize: 10,
                        total: dataForGrid.length,
                        serverPaging: false
                    });
                    $scope.isRouteLoading = false
                });
            }

            $scope.getIsiComboSubUnit = function() {
                if ($scope.item.qunitKerja != undefined || $scope.item.qunitKerja != "") {
                    $scope.listSubUnit = $scope.item.qunitKerja.subunit
                }
            }

            $scope.exportDetail = function(e) {
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
                tempDataExport.fetch(function() {
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

            $scope.formatTanggal = function(tanggal) {
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
                excelExport: function(e) {
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
                    { field: "nippns", title: "NIP", width: "15%" },
                    { field: "namalengkap", title: "Nama Lengkap", width: "25%" },
                    // {
                    //   field: "NamaUser",
                    //   title: "Username", 
                    //   width: "20%", 
                    //   hidden: true ,
                    //   // template: "# for(var i=0; i < usernames.length;i++){# usernames.usernames.namaUser #}"
                    // },
                    { field: "agama", title: "Agama", width: "10%" },
                    { field: "npwp", title: "NPWP", width: "15%" },
                    // { field: "nippns", title: "NIP", width: "15%" },
                    { field: "nrp", title: "NRP", width: "15%" },
                    // { field: "jbfungsional", title: "Jabatan Fungsional", width: "20%" },
                    // { field: "golongan", title: "Golongan", width: "20%" },
                    // { field: "pendidikan", title: "Pendidikan", width: "20%" },
                    // { field: "petugasdiklat", title: "Diklat", width: "20%" },
                    // { field: "jbstruktural", title: "Jabatan Internal", width: "20%", hidden: "true" },
                    // { field: "statuspegawai", title: "Status", width: "10%" },
                    // { field: "namakategorypegawai", title: "Kategory", width: "10%" },
                    // { field: "detailkelompokjabatan", title: "Kelompok Jabatan", width: "20%" },

                    // { field: "tglmasuk", title: "TglMasuk", width: "10%", template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>" }
                ],
                // set column width to auto
                excelExport: function(e) {
                    var columns = e.workbook.sheets[0].columns;
                    columns.forEach(function(column) {
                        delete column.width;
                        column.autoWidth = true;
                    });
                },
                change: function(e) {
                    // debugger;
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

            $scope.klik = function(data) {
                $scope.dataItem = data;
            }

            $scope.ubah = function() {
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

            $scope.pajakPenghasilan = function() {
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
                    cacheHelper.set('PajakPenghasilanPegawaiCtrl', chacePeriode);
                    $state.go('PajakPenghasilanPegawai')
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }
            $scope.InputBaru = function() {
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

            $scope.idFinger = function() {
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

            $scope.pajakPenghasilanTahun = function(item, data) {
                // $scope.item.tahunPajak = '';
                debugger
                var idPegawai = $scope.dataItem.id;
                medifirstService.get("registrasi/daftar-registrasi/get-daftar-tahun-pajak?idPegawai=" + idPegawai).then(function(dat) {
                    var dataList = dat.data
                    $scope.ListTahunPajak = dataList.data;
                });
                $scope.winDialogss.center().open();
            }

            $scope.cetak = function() {

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
                // var tgltt = $scope.undefined.tglttd;
                var tahunpajak = $scope.item.tahunpajak.tahunpajak;
                // var tgltt = moment($scope.undefined.tglttd).format('DD-MM-YYYY');
                debugger;

                var data = {
                    "gambarLogo": "kemenkue.jpg",
                    "gambarTtd": "ttd_bu_puji.png",
                    "paramKey": ["namaRS", "kemenkeu", "idpegawai", "namabendahara", "npwpbendahara", "nipnrpbendahara", "tahunpajak"],
                    "paramValue": ["BUKTI PEMOTONGAN PAJAK PENGHASILAN PASA 21 BAGI PEGAWAI NEGARI SIPIL ATAU ANGGOTA TENTARA NASIONAL INDONESIA ATAU ANGGOTA POLISI REPUBLIK INDONESIA ATAU PEJABAT NEGARA ATAU PENSIUNANNYA", "KEMENTRIAN KEUANGAN RI DIREKTORAT JENDRAL PAJAK", idpegawai, namabendahara, npwpbendahara, nipnrpbendahara, tahunpajak],
                    "paramType": ["", "", "", "", "", "", ""]
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
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
                $scope.winDialogss.close();
                // })
                // })
            }

            $scope.listPetugasPelaksana = function() {
                medifirstService.get("sdm/get-data-pegawai-all-pp?idPegawai=" + $scope.dataItem.id, true).then(function(dat) {
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

            $scope.petugasPelaksana = function() {
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
            $scope.petugasPelaksanaHapus = function() {
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
            $scope.petugasPelaksanaTam = function() {
                $scope.dataSelected.id = undefined;
                $scope.flag = true;
                $scope.statusenabled = true
                $scope.item.namakpbs = { idkpb: 0, kelompokprodukbpjs: 0 }
                $scope.item.namajpps = { idjpp: 0, jenispetugaspe: 0 }
                $scope.popUpPelP.center().open()
            }

            $scope.simpanPetugas = function() {
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
                    medifirstService.post('tatarekening/save-petugas-pelaksana', json).then(function(e) {})
                } else {
                    medifirstService.post('tatarekening/update-petugas-pelaksana', json).then(function(e) {})
                }
                $scope.popUpPelP.close()
                $scope.popUpPp.close()
            }

            $scope.TutupPopUpPp = function() {
                $scope.popUpPp.center().close();
            }

            $scope.simpanIdFinger = function() {
                if ($scope.itemF.idFinger == undefined) {
                    alert("Id Finger Tidak Boleh Kosong!")
                    return;
                }

                var objSave = {
                    idpegawai: $scope.itemF.idPegawai,
                    tglinput: $scope.itemF.tglInput,
                    idfinger: $scope.itemF.idFinger
                }

                medifirstService.post('sdm/update-idfinger-pegawai', objSave).then(function(e) {
                    $scope.itemF.idFinger = undefined;
                    $scope.itemF.tglInput = undefined;
                    $scope.itemF.idPegawai = undefined
                    $scope.itemF.namaLengkap = undefined;
                    $scope.itemF.JenisKelamin = undefined;
                    $scope.itemF.namaJabatan = undefined;
                    $scope.popUpIdFinger.close();
                    formLoad();
                }, function(error) {
                    toastr.error(JSON.stringify(error.message), 'Error')
                });
            }

            $scope.batalFinger = function() {
                $scope.itemF.idFinger = undefined;
                $scope.itemF.tglInput = undefined;
                $scope.itemF.idPegawai = undefined
                $scope.itemF.namaLengkap = undefined;
                $scope.itemF.JenisKelamin = undefined;
                $scope.itemF.namaJabatan = undefined;
                // $scope.popUpIdFinger.close();
            }

            $scope.mutasi = function() {
                if ($scope.dataItem) {
                    $state.go("MutasiPegawai", { idPegawai: $scope.dataItem.id });
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.keluarga = function() {
                if ($scope.dataItem) {
                    $state.go("DataKeluarga", { idPegawai: $scope.dataItem.id });
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.mappingAtasan = function(e) {
                if ($scope.dataItem) {
                    $state.go("MappingAtasanPegawai", {
                        idPegawai: $scope.dataItem.id,
                        namaLengkap: $scope.dataItem.namakengkap
                    })
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            };

            $scope.riwayatPendidikan = function(e) {
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
            $scope.riwayatJabatan = function(e) {
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
            $scope.goToUrl = function() {
                $scope.dialogPopup.close();
                $state.go('MasaBerlakuSipStr');
            };
            $scope.goToUrlReport = function(data) {
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
            $scope.goToUrlReportAll = function() {
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
            $scope.$watch('item.qnamaPegawai', function(newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.qkedudukanPegawai', function(newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("statuspegawai", newVal)
                }
            });
            $scope.$watch('item.qjabatanInternal', function(newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("objectjabatanstrukturalfk", newVal)
                }
            });
            $scope.$watch('item.qunitKerja', function(newVal, oldVal) {
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

            $scope.$watch('item.qstatusPegawai', function(newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("namakategorypegawai", newVal)
                }
            }, true);

            $scope.$watch('item.tglMasuk', function(newVal, oldVal) {
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
                        operator: function(namakategorypegawai, value) {
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
                        operator: function(namakategorypegawai, value) {
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
            $scope.cekisNotPNS = function(bool) {
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

            }
            $scope.resetFilters = function() {
                var gridData = $("#gridDataPegawai").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item = {};
                $scope.filteredData = [];
            };
            $scope.riwayat = function(data) {
                if (!data) {
                    messageContainer.error('Pegawai belum di pilih');
                    return;
                }
            }

            function showDetail(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            }

            $scope.closeHistory = function() {
                $scope.title = "Data Pegawai";
                $scope.klikRiwayat = false;
            }



            $scope.simpanAtasan = function(data) {
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
                    ManageSdmNew.saveData(dataModel, "sdm/save-mapping-pegawai-to-atasan").then(function(e) {
                        // grid.dataSource.add($scope.item);
                        init();
                    });
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            $scope.cetakReport = function() {
                $scope.report = {};
                $scope.dialogReport.setOptions({
                    width: 400,
                    title: 'Report Pegawai RSABHK'
                })
                $scope.dialogReport.center();
                $scope.dialogReport.open();
            }

            $scope.toogleClick = function() {
                    var grid = $("#gridDataPegawai").data("kendoGrid");
                    if ($scope.username == "Show") {
                        grid.showColumn(2);
                        $scope.username = "Hide"
                    } else if ($scope.username == "Hide") {
                        grid.hideColumn(2);
                        $scope.username = "Show"
                    }

                }
                // * BATAS SUCI *//
        }
    ]);
});