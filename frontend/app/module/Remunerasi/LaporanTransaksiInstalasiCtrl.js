define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanTransaksiInstalasiCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.jenis=''
            var judul = "Detail Remunerasi.xlsx";
            LoadCombo();
            FormLoad();


            function LoadCombo() {
                // modelItemAkuntansi.getDataTableTransaksi("laporan/get-data-combo-laporan", true).then(function (dat) {                
                //     $scope.listDataFormat = [{"id": 1, "format": "pdf"},{"id": 2, "format": "xls"}];
                //     $scope.listDokter = dat.dokter;
                //     $scope.listDepartemen = dat.departemen;                   
                //     $scope.listPasien = dat.kelompokpasien;                    
                // });

                var chacePeriode = cacheHelper.get('DaftarJasaPelayananSatuCtrl');
                if (chacePeriode != undefined) {
                    if (chacePeriode != '') {
                        var arrPeriode = chacePeriode.split('~');
                        $scope.item.tglawal = new Date(arrPeriode[0]);
                        $scope.item.tglakhir = new Date(arrPeriode[1]);
                        $scope.listDokter = [{ id: arrPeriode[2], namalengkap: arrPeriode[3] }]
                        $scope.item.NamaDokter = { id: arrPeriode[2], namalengkap: arrPeriode[3] };
                        $scope.item.noclosing = arrPeriode[4];
                        $scope.item.nmnmpegawai = arrPeriode[2] + ', ' + arrPeriode[3]
                        $scope.item.jenis = arrPeriode[5] 
                        cacheHelper.set('DaftarJasaPelayananSatuCtrl', '');
                        // $scope.item.ruanganfk = arrPeriode[5];    
                        LoadData()
                    } else {
                        medifirstService.get("remunerasi/get-daftar-closing", true).then(function (datss) {
                            var dat = datss.data
                            $scope.item.datalogin = dat.datalogin
                            $scope.listClosing = dat.data2
                            // $scope.item.noclosing = dat.data2[0].noclosing//arrPeriode[4];       
                            $scope.item.cbonoclosing = { norec: dat.data2[0].norec, namaclosing: dat.data2[0].namaclosing, noclosing: dat.data2[0].noclosing }
                            $scope.item.noclosing = dat.data2[0].noclosing

                            $scope.item.tglawal = ''//new Date(arrPeriode[0]);
                            $scope.item.tglakhir = ''//new Date(arrPeriode[1]);  
                            $scope.listDokter = [{ id: dat.data[0].id, namalengkap: dat.data[0].namalengkap }]
                            $scope.item.NamaDokter = { id: dat.data[0].id, namalengkap: dat.data[0].namalengkap };
                            $scope.item.nmnmpegawai = dat.data[0].id + ', ' + dat.data[0].namalengkap

                            LoadData()
                        });
                    }
                } else {
                    medifirstService.get("remunerasi/get-daftar-closing", true).then(function (datss) {
                        var dat = datss.data
                        $scope.item.datalogin = dat.datalogin
                        $scope.listClosing = dat.data2
                        // $scope.item.noclosing = dat.data2[0].noclosing//arrPeriode[4];       
                        $scope.item.cbonoclosing = { norec: dat.data2[0].norec, namaclosing: dat.data2[0].namaclosing, noclosing: dat.data2[0].noclosing }
                        $scope.item.noclosing = dat.data2[0].noclosing
                        $scope.item.tglawal = ''//new Date(arrPeriode[0]);
                        $scope.item.tglakhir = ''//new Date(arrPeriode[1]);  
                        $scope.listDokter = [{ id: dat.data[0].id, namalengkap: dat.data[0].namalengkap }]
                        $scope.item.NamaDokter = { id: dat.data[0].id, namalengkap: dat.data[0].namalengkap };
                        $scope.item.nmnmpegawai = dat.data[0].id + ', ' + dat.data[0].namalengkap

                        LoadData()
                    });
                }
            }

            $scope.$watch('item.cbonoclosing', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.noclosing = $scope.item.cbonoclosing.noclosing
                }
            });

            function FormLoad() {
                var tanggals = DateHelper.getDateTimeFormatted3($scope.date);
                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.pegawai = medifirstService.getPegawai();
                $scope.dokter = $scope.item.namaPegawai;
                var chacePeriode = cacheHelper.get('LaporanTransaksiInstalasiCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode;
                    $scope.item.tglawal = new Date(arrPeriode[0]);
                    $scope.item.tglakhir = new Date(arrPeriode[1]);
                    $scope.item.departement = { id: arrPeriode[2], departemen: arrPeriode[3] };
                    // $scope.item.NamaDokter = {id:arrPeriode[4],namalengkap:arrPeriode[5]}; 
                    // $scope.item.ruangan = {id:arrPeriode[6],namaruangan:arrPeriode[7]};               
                } else {
                    $scope.item.tglawal = tanggals + " 00:00";
                    $scope.item.tglakhir = tanggals + " 23:59";
                }



            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                LoadData()
            }
            $scope.SearchEnter = function () {
                cariaing()
            }
            $scope.SearchDatadetailrc = function () {

                $scope.popupdetail.center().open();

                cariaing()
            }
            function cariaing(jenispaguid, detailjenispaguid) {
                var nmpasienx = ''
                if ($scope.item.nmpasienx != undefined) {
                    nmpasienx = '&namapasien=' + $scope.item.nmpasienx
                }
                $scope.dataHitung = new kendo.data.DataSource({
                    data: []
                });
                medifirstService.get('remunerasi/get-detail-remun_rc?' +
                    'noclosing=' + $scope.item.noclosing
                    + '&pegawaiid=' + $scope.item.NamaDokter.id
                    + nmpasienx
                    + '&jenispaguid=' + jenispaguid
                    + '&detailjenispaguid=' + detailjenispaguid
                    , true).then(function (dat) {
                        var totalttl = 0
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1;
                            if (dat.data[i].isparamedis == "1") {
                                dat.data[i].statusparamedis = "✔"
                            } else {
                                dat.data[i].statusparamedis = ""
                            }
                            if (dat.data[i].iscito == "1") {
                                dat.data[i].statuscito = "✔"
                            } else {
                                dat.data[i].statuscito = ""
                            }
                            totalttl = totalttl + parseFloat(dat.data[i].jenispagunilai)
                        }
                        $scope.item.totalremundetailRC = parseFloat(totalttl).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.dataHitung = new kendo.data.DataSource({
                            data: dat.data
                        });
                        $scope.item.idpegawairc = $scope.item.NamaDokter.id
                        $scope.item.pegawairc = $scope.item.NamaDokter.namalengkap
                        $scope.item.nmruanganrc = dat.data2[0].namaruangan
                        $scope.item.detailjenis = dat.data2[0].detailjenispagu
                        $scope.item.prosentase = (parseFloat(dat.data2[0].persen) - parseFloat(dat.data2[0].potpersen)).toFixed(0) + ' %'
                        // $scope.item.totalperpoint =  parseFloat( dat.data2[0].jumlahorg) *  parseFloat( dat.data2[0].point) 
                        // $scope.item.totalperpoint  = $scope.item.totalperpoint  + '/' + parseFloat( dat.data2[0].point) 
                        var pointpegawai = (parseFloat(dat.data2[0].point) / 100) * (100 - parseFloat(dat.data2[0].potpersen))
                        $scope.item.totalperpoint = parseFloat(dat.data3[0].pointtotal) + '/' + parseFloat(pointpegawai).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.ttlremunerasi = (totalttl / parseFloat(dat.data3[0].pointtotal)) * parseFloat(pointpegawai)
                        $scope.item.ttlremunerasi = parseFloat($scope.item.ttlremunerasi).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    });
            }
            $scope.detailPelayanan = function () {
                $scope.popupKomponen.center().open();
                medifirstService.get("remunerasi/get-komponenharga-pelayanan?norec_pp=" + $scope.dataPasienSelected.norec_pp).
                    then(function (data) {
                        $scope.sourceKomponens = data.data;
                        $scope.item.tglPelayanans = moment(new Date($scope.dataPasienSelected.tglpelayanan)).format('DD-MM-YYYY HH:mm')
                        $scope.item.namaPelayanans = $scope.dataPasienSelected.namaproduk;

                    });
            }
            function detailfromgrid(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                if (dataItem.jpid == 16) {
                    $scope.popupKomponen.center().open();
                    $scope.sourceKomponens = [];
                    medifirstService.get("remunerasi/get-komponenharga-pelayanan?norec_pp=" + dataItem.norec_pp).
                        then(function (data) {
                            $scope.sourceKomponens = data.data.data;
                            $scope.item.tglPelayanans = moment(new Date(dataItem.tglpelayanan)).format('DD-MM-YYYY HH:mm')
                            $scope.item.namaPelayanans = dataItem.namaproduk;

                        });
                }
                // if (dataItem.jpid == 7) {
                //     $scope.popupdetail.center().open();
                //     $scope.item.title = "REVENUE CENTER"
                //     cariaing(7,dataItem.djpid)
                // }
                if (dataItem.jpid == 8) {
                    $scope.popupKomponen.center().open();
                    $scope.sourceKomponens = [];
                    medifirstService.get("remunerasi/get-komponenharga-pelayanan?norec_pp=" + dataItem.norec_pp).
                        then(function (data) {
                            $scope.sourceKomponens = data.data;
                            $scope.item.tglPelayanans = moment(new Date(dataItem.tglpelayanan)).format('DD-MM-YYYY HH:mm')
                            $scope.item.namaPelayanans = dataItem.namaproduk;

                        });
                }
                // if (dataItem.jpid == 11) {
                //     $scope.popupdetail.center().open();
                //     $scope.item.title = "REVENUE CENTER"
                //     cariaing(11,dataItem.djpid)
                // }
                // if (dataItem.jpid == 10) {
                //     $scope.popupdetail.center().open();
                //     $scope.item.title = "REVENUE CENTER"
                //     cariaing(10,dataItem.djpid)
                // }
                // if (dataItem.jpid == 12) {
                //     $scope.popupdetail.center().open();
                //     $scope.item.title = "REVENUE CENTER"
                //     cariaing(11,dataItem.djpid)
                // }
            }
            // $scope.detaildetail = function(){
            //     $scope.popupdetail.center().open();
            //     $scope.item.title = "REVENUE CENTER"
            //     cariaing(8)
            // }
            // $scope.detaildetailCC = function(){
            //     $scope.popupdetail.center().open();
            //     $scope.item.title = "COST CENTER"
            //     cariaing(11)
            // }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                //debugger;

                var tempDepartemenId = "";
                var tempDepartemenNm = "";
                judul = "Detail Remunerasi.xlsx";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.item.NamaDokter != undefined) {
                    tempDokter = "&IdDokter=" + $scope.item.NamaDokter.id;
                    judul = "Detail Remunerasi " + $scope.item.NamaDokter.namalengkap;
                }
                var tempNoClosing = "";
                if ($scope.item.noclosing != undefined) {
                    tempNoClosing = "&noclosing=" + $scope.item.noclosing;
                }
                var jenis = "";
                if ($scope.item.jenis != undefined) {
                    jenis = "&jenis=" + $scope.item.jenis
                }
                

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: $scope.item.NamaDokter.id,
                    5: $scope.item.NamaDokter.namalengkap,
                    6: $scope.item.jenis,
                    // 7: $scope.item.ruangan.ruangan               
                }
                cacheHelper.set('LaporanTransaksiInstalasiCtrl', chacePeriode);

                medifirstService.get("remunerasi/get-detail-remun-pegawai?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDokter + tempNoClosing
                    +jenis).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].isparamedis == "1") {
                                datas[i].statusparamedis = "✔"
                            } else {
                                datas[i].statusparamedis = ""
                            }
                            if (datas[i].iscito == "1") {
                                datas[i].statuscito = "✔"
                            } else {
                                datas[i].statuscito = ""
                            }
                            if(  datas[i].jumlah == null)
                            datas[i].jumlah =''
                            datas[i].Ruangan = datas[i].namaruangan
                        }
                        datas.sort(function (a, b) {
                            if(a.noregistrasi =='-')return 0;
                            if (a.noregistrasi < b.noregistrasi) { return -1; }
                            if (a.noregistrasi > b.noregistrasi) { return 1; }
                            return 0;
                        })
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        hargasatuan: { type: "number" },
                                        jenispagunilai: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'hargasatuan', aggregate: 'sum' },
                                { field: 'jenispagunilai', aggregate: 'sum' },
                            ]
                        });
                    })
            }



            $scope.group = {
                field: "Ruangan"
            };
            $scope.aggregate = [
                {
                    field: "dokter",
                    aggregate: "count"
                },
                {
                    field: "hargasatuan",
                    aggregate: "sum"
                },
                {
                    field: "jenispagunilai",
                    aggregate: "sum"
                }
            ]
            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: judul + ".xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: judul,
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    // { field: "no", title: "No", width: "30px" },
                    {
                        field: "tglpelayanan",
                        title: "Tanggal ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "NoRM",
                        width: "50px",
                        template: "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "70px",
                        template: "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",

                    },
                    {
                        field: "namaproduk",
                        title: "Nama Layanan",
                        width: "240px",
                        footerTemplate: "Total"
                    },
                    {
                        field: "jumlah",
                        title: "Qty",
                        width: "40px",
                        template: "<span class='style-center'>#: jumlah #</span>"
                    },
                    // {
                    //     field: "statusparamedis",
                    //     title: "P",
                    //     width: "20px"
                    // },
                    {
                        field: "statuscito",
                        title: "Cito",
                        width: "30px"
                    },
                    {
                        field: "hargasatuan",
                        title: "Tarif Layanan",
                        width: "80px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>",
                        attributes: { style: "text-align:right;" },
                        // footerTemplate: "#: data.hargasatuan.sum #",//"<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #','')}}</span>",
                        // aggregates: ["sum"],
                        // footerTemplate: "#: data.hargasatuan.sum #",
                        // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.hargasatuan.sum #', '')}}</span>",
                        // footerAttributes: {style: "text-align: right;"}

                    },
                    {
                        field: "jenispagunilai",
                        title: "Jasa Remun",
                        width: "100px",
                        template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>",
                        attributes: { style: "text-align:right;" },
                        // footerTemplate: "#: data.jenispagunilai.sum #",//"<span >Rp. {{formatRupiah('#:data.jenispagunilai.sum  #', '')}}</span>",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jenispagunilai.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jenispagunilai.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    {
                        field: "detailjenispagu",
                        title: "Pagu",
                        width: "100px"
                    },
                    {
                        hidden: true,
                        field: "dokter",
                        title: "Nama Dokter",
                        aggregates: ["count"],
                        groupHeaderTemplate: "Nama Dokter #= value #"
                    },
                    {
                        "command": [
                            {
                                text: "Detail",
                                click: detailfromgrid,
                                imageClass: "k-icon k-i-pencil"
                            }
                        ],
                        title: "",
                        width: "60px",
                    }

                ]
            }
            $scope.columndataHitung = {
                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     field: "tglpelayanan",
                    //     title: "Tanggal ",
                    //     width: "80px",
                    //     template: "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    // },
                    // {
                    //     field: "nocm",
                    //     title: "NoRM",
                    //     width: "50px",
                    //     template: "<span class='style-center'>#: nocm #</span>"
                    // },
                    // {
                    //     field: "noregistrasi",
                    //     title: "Noregistrasi",
                    //     width: "70px",
                    //     template: "<span class='style-center'>#: noregistrasi #</span>"
                    // },
                    // {
                    //     field: "namapasien",
                    //     title: "Nama Pasien",
                    //     width: "120px",

                    // },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "240px"
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Layanan",
                        width: "240px"
                    },
                    {
                        field: "jumlah",
                        title: "Qty",
                        width: "40px",
                        template: "<span class='style-center'>#: jumlah #</span>"
                    },
                    {
                        field: "statusparamedis",
                        title: "P",
                        width: "20px"
                    },
                    {
                        field: "statuscito",
                        title: "Cito",
                        width: "30px"
                    },
                    {
                        field: "hargasatuan",
                        title: "Tarif Layanan",
                        width: "80px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #','')}}</span>"

                    },
                    {
                        field: "jenispagunilai",
                        title: "Jasa Remun",
                        width: "100px",
                        template: "<span class='style-right'>{{formatRupiah('#: jenispagunilai #','')}}</span>"
                    }
                ]
            };
            $scope.columnKomponens = [
                {
                    "field": "komponenharga",
                    "title": "Komponen",
                    "width": "100px",
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                    "width": "50px"
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "jasa",
                    "title": "Jasa Cito",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
                }

            ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD HH:mm');
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

            $scope.Cetak = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var tempDokter = "";
                if ($scope.item.NamaDokter != undefined) {
                    tempDokter = $scope.item.NamaDokter.id;
                }

                var tempNoClosing = "";
                if ($scope.item.noclosing != undefined) {
                    tempNoClosing = $scope.item.noclosing;
                }

                var stt = 'false'
                if (confirm('View Laporan Remunerasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/remun?cetak-laporan-remunerasi=1&idRuangan=' + tempRuanganId + '&idDept=' + tempDepartemenId + '&noclosing=' + tempNoClosing + '&IdDokter=' + tempDokter + '&view=' + stt, function (response) {
                    // do something with response
                });

            }
            /////////////////////////////////////////
        }
    ]);
});