define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PurifMandiriCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            var details = [];
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

            $scope.CariLapPasienPulang = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }
            function LoadData() {

                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemen = "";
                var link = "bridging/inacbg/get-daftar-purif-mandiri?"




                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('PurifMandiriCtrl', chacePeriode);

                medifirstService.get(link
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen).then(function (data) {
                        $scope.isRouteLoading = false;
                        // details = data.data;
                        $scope.dataPasienPulang = {
                            // new kendo.data.DataSource({
                            data: data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }, aggregate: [
                                // { field: 'jmlP1', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // });
                    })
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            var yeuh = 0;
            var awal = 0;
            $scope.progres = function () {
                debugger

                var dt1 = {}
                var dt2 = []
                for (var i = $scope.dataPasienPulang.data.length - 1; i >= 0; i--) {
                    dt1 = {
                        "metadata": {
                            "method": "get_claim_data"
                        },
                        "data": {
                            "nomor_sep": $scope.dataPasienPulang.data[i].nosep
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
            var a = 0;
            var myVar = '';
            function startProgres() {
                $scope.sendPurif();
                stopColor();
                myVar = setInterval(setColor, 60000);
            }
            function setColor() {
                startProgres();
            }
            function stopColor() {
                clearInterval(myVar);
            }

            $scope.sendPurif = function () {
                $scope.isRouteLoading = true;
                // debugger
                if (awal == $scope.dataPasienPulang.data.length) {
                    $scope.dataPasienPulang = {
                        // new kendo.data.DataSource({
                        data: $scope.dataPasienPulang.data,
                        pageSize: 10,
                        total: $scope.dataPasienPulang.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }, aggregate: [
                            // { field: 'jmlP1', aggregate: 'sum' },
                        ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    }
                    $scope.isRouteLoading = false;
                }
                yeuh = a;
                awal = a;
                var lengthakhir = $scope.dataPasienPulang.data.length;
                var lop = true;
                for (; a < $scope.dataPasienPulang.data.length; a++) {
                    // $scope.dataPasienPulang.data[i].no = i + 1
                    // if(lop==true){
                    //     lop=false
                    medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.dataPasienPulang.data[a].nosep).then(function (e) {
                        lop = false
                        if (e == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
                            startProgres();
                        } else if (e == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
                            startProgres();
                        } else if (e.status == 500) {
                            startProgres();
                        } else {
                            $scope.dataPasienPulang.data[a].status = e.data.metaData.message
                            $scope.dataPasienPulang.data[a].code = e.data.metaData.code
                            if ($scope.dataPasienPulang.data[a].status == 'Data Tidak Ditemukan') {
                                $scope.dataPasienPulang.data[a].pending = 'Pending'
                            }
                            // continue;
                            // lop=true
                            // i = i + 1
                            yeuh = yeuh + 1;
                            var ini = (yeuh / lengthakhir) * 100;
                            var elem = document.getElementById("myBar");
                            var width = 0;
                            awal = awal + 1;
                            var id = setInterval(frame, 1);
                            function frame() {
                                if (width >= ini) {
                                    clearInterval(id);
                                } else {
                                    width++;
                                    elem.style.width = width + "%";
                                    elem.innerHTML = width + "%";
                                }
                            }
                            if (e.data.metaData.code === "200") {
                                $scope.dataPasienPulang.data[a].tglsep = moment(e.data.response.tglSep).format('DD/MM/YYYY')
                                var d = new Date(e.data.response.tglSep);
                                d.setMonth(d.getMonth() + 6);
                                d = moment(d).format('DD MMMM YYYY')
                                $scope.dataPasienPulang.data[a].tglberakhirsep = d
                                $scope.dataPasienPulang.data[a].jenisrawat = e.data.response.jnsPelayanan
                                $scope.dataPasienPulang.data[a].kelasrawat = e.data.response.kelasRawat
                                toastr.info(e.data.metaData.message + ' ' + e.data.metaData.code);
                                $scope.dataPasienPulang.data[a].nokartu = e.data.response.peserta.noKartu
                                medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + e.data.response.peserta.noKartu + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                                    if (e == "cURL Error #:OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to new-api.bpjs-kesehatan.go.id:8080 ") {
                                        startProgres();
                                    } else if (e == "cURL Error #:Failed to connect to new-api.bpjs-kesehatan.go.id port 8080: Timed out") {
                                        startProgres();
                                    } else if (e.status == 500) {
                                        startProgres();
                                    } else {
                                        $scope.dataPasienPulang.data[a].status_peserta = e.data.response.peserta.statusPeserta.keterangan
                                        $scope.dataPasienPulang.data[a].status_code_peserta = e.data.response.peserta.statusPeserta.kode
                                        $scope.dataPasienPulang.data[a].jeniskelamin = e.data.response.peserta.sex
                                        // a = a +1
                                        // startProgres();
                                        var dt1 = {}
                                        var dt2 = []
                                        dt1 = {
                                            "metadata": {
                                                "method": "get_claim_data"
                                            },
                                            "data": {
                                                "nomor_sep": $scope.dataPasienPulang.data[a].nosep
                                            }
                                        }
                                        dt2.push(dt1)

                                        var objData = {
                                            "data": dt2
                                        }
                                        medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                            if (e.status == 500) {
                                                startProgres();
                                            } else {
                                                $scope.dataPasienPulang.data[a].tglmasukinacbg = e.data.dataresponse[0].dataresponse.response.data.tgl_masuk
                                                if ($scope.dataPasienPulang.data[a].jenisrawat == 'Rawat Jalan' && e.data.dataresponse[0].dataresponse.response.data.jenis_rawat != '2') {
                                                    $scope.dataPasienPulang.data[a].jenisrawat = 'Jenis Rawat Tidak Sama'
                                                    $scope.dataPasienPulang.data[a].pending = 'Pending'
                                                }
                                                if ($scope.dataPasienPulang.data[a].jenisrawat == 'Rawat Inap' && e.data.dataresponse[0].dataresponse.response.data.jenis_rawat != '1') {
                                                    $scope.dataPasienPulang.data[a].jenisrawat = 'Jenis Rawat Tidak Sama'
                                                    $scope.dataPasienPulang.data[a].pending = 'Pending'
                                                }
                                                if ($scope.dataPasienPulang.data[a].jenisrawat == 'Rawat Inap') {
                                                    if ($scope.dataPasienPulang.data[a].kelasrawat != e.data.dataresponse[0].dataresponse.response.data.kelas_rawat) {
                                                        $scope.dataPasienPulang.data[a].kelasrawat = 'Kelas Rawat Tidak Sama'
                                                        $scope.dataPasienPulang.data[a].pending = 'Pending'
                                                    }
                                                    if (e.data.dataresponse[0].dataresponse.response.data.grouper.response.cbg.code == 'P-8-17-I' && e.data.dataresponse[0].dataresponse.response.data.kelas_rawat != '3') {
                                                        $scope.dataPasienPulang.data[a].kelasrawat = 'Kelas Rawat Bayi Caesar Harus Kelas 3'
                                                        $scope.dataPasienPulang.data[a].pending = 'Pending'
                                                    }
                                                }
                                                if (e.data.dataresponse[0].dataresponse.response.data.gender == 2 && $scope.dataPasienPulang.data[a].jeniskelamin != 'P') {
                                                    $scope.dataPasienPulang.data[a].jeniskelamin = 'Jenis Kelamin Berbeda'
                                                    $scope.dataPasienPulang.data[a].pending = 'Pending'
                                                }
                                                if (e.data.dataresponse[0].dataresponse.response.data.gender == 1 && $scope.dataPasienPulang.data[a].jeniskelamin != 'L') {
                                                    $scope.dataPasienPulang.data[a].jeniskelamin = 'Jenis Kelamin Berbeda'
                                                    $scope.dataPasienPulang.data[a].pending = 'Pending'
                                                }
                                                if ($scope.dataPasienPulang.data[a].tglmasukinacbg != $scope.dataPasienPulang.data[a].tglsep) {
                                                    $scope.dataPasienPulang.data[a].tglmasukberbeda = 'Tanggal Masuk Berbeda'
                                                    $scope.dataPasienPulang.data[a].pending = 'Pending'
                                                }
                                                // if(e.data.dataresponse[0].dataresponse.response.data.discharge_status==1){
                                                //     $scope.dataPasienPulang.data[a].statusmeninggalinacbg='Atas persetujuan dokter'
                                                // }
                                                // if(e.data.dataresponse[0].dataresponse.response.data.discharge_status==2){
                                                //     $scope.dataPasienPulang.data[a].statusmeninggalinacbg='Dirujuk'
                                                // }
                                                // if(e.data.dataresponse[0].dataresponse.response.data.discharge_status==3){
                                                //     $scope.dataPasienPulang.data[a].statusmeninggalinacbg='Atas permintaan sendiri'
                                                // }
                                                // if(e.data.dataresponse[0].dataresponse.response.data.discharge_status==4){
                                                //     $scope.dataPasienPulang.data[a].statusmeninggalinacbg='Meninggal'
                                                // }
                                                // if(e.data.dataresponse[0].dataresponse.response.data.discharge_status==5){
                                                //     $scope.dataPasienPulang.data[a].statusmeninggalinacbg='Lain-lain'
                                                // }
                                                // if($scope.dataPasienPulang.data[a].status_code_peserta==2 && e.data.dataresponse[0].dataresponse.response.data.discharge_status!=4){
                                                //     $scope.dataPasienPulang.data[a].statusmeninggalbeda='Status Meninggal Berbeda'
                                                //     $scope.dataPasienPulang.data[a].pending='Pending'
                                                // }
                                                // if($scope.dataPasienPulang.data[a].status_code_peserta!=2 && e.data.dataresponse[0].dataresponse.response.data.discharge_status==4){
                                                //     $scope.dataPasienPulang.data[a].statusmeninggalbeda='Status Meninggal Berbeda'
                                                //     $scope.dataPasienPulang.data[a].pending='Pending'
                                                // }
                                                a = a + 1
                                                startProgres();
                                            }
                                        }, error => {
                                            // debugger
                                            startProgres();
                                        })
                                    }
                                }, function (err) {
                                    debugger
                                    startProgres();
                                    // $scope.isRouteLoading = false;
                                });
                            } else {
                                window.messageContainer.error(e.data.metaData.message + ' ' + e.data.metaData.code);
                                a = a + 1
                                startProgres();
                            }
                        }
                        // $scope.isRouteLoading = false;
                    }, function (err) {
                        debugger
                        startProgres();
                        // $scope.isRouteLoading = false;
                    });
                    if (lop == true) {
                        break;
                    }
                    //     i = i - 1
                    // }else{
                    //     i = i - 1
                    // }
                }
            }

            var onDataBound = function (e) {
                $('td').each(function () {
                    // if ($(this).text() == 'false') { $(this).text('Belum di Coder') }
                    if ($(this).text() == 'Data Tidak Ditemukan') { $(this).addClass('red') }
                    if ($(this).text() == 'NON AKTIF KARNA PREMI') { $(this).addClass('red') }
                    if ($(this).text() == 'MENINGGAL') { $(this).addClass('koneng') }
                    if ($(this).text() == 'Meninggal') { $(this).addClass('koneng') }
                    if ($(this).text() == 'Status Meninggal Berbeda') { $(this).addClass('red') }
                    if ($(this).text() == 'Tanggal Masuk Berbeda') { $(this).addClass('red') }
                    if ($(this).text() == 'Jenis Kelamin Berbeda') { $(this).addClass('red') }
                    if ($(this).text() == 'Kelas Rawat Bayi Caesar Harus Kelas 3') { $(this).addClass('red') }
                    if ($(this).text() == 'Pending') { $(this).addClass('red') }
                    // if ($(this).text() == '1.0') { $(this).text('Belum di Grouping') }
                    // if ($(this).text() == 'Belum di Grouping') { $(this).addClass('koneng') }
                })
            }

            $scope.columnPasienPulang =
            {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "LaporanPurifMandiri.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "LaporanPurifMandiri.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "LAPORAN PURIF MANDIRI",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                dataBound: onDataBound,
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns:
                    [
                        {
                            "field": "nosep",
                            "title": "NOSEP",
                            "width": "180px"
                        },
                        {
                            "field": "nokartu",
                            "title": "NOKARTU",
                            "width": "180px"
                        },
                        {
                            "field": "status",
                            "title": "STATUS SEP",
                            "width": "180px",
                        },
                        {
                            hidden: true,
                            "field": "code",
                            "title": "CODE BPJS",
                            "width": "20px",
                        },
                        {
                            "field": "status_peserta",
                            "title": "STATUS PESERTA",
                            "width": "120px",
                        },
                        {
                            "field": "tglsep",
                            "title": "TGL SEP",
                            "width": "80px",
                        },
                        {
                            "field": "tglberakhirsep",
                            "title": "TGL BERAKHIR SEP",
                            "width": "80px",
                        },
                        {
                            hidden: true,
                            "field": "status_code_peserta",
                            "title": "STATUS CODE PESERTA",
                            "width": "50px",
                        },
                        {
                            "field": "tglmasukinacbg",
                            "title": "TGL MASUK INACBG",
                            "width": "150px",
                        },
                        // {
                        // 	"field": "statusmeninggalinacbg",
                        //     "title": "STATUS Meninggal Inacbg",
                        //     "width": "150px",
                        // },
                        // {
                        // 	"field": "statusmeninggalbeda",
                        //     "title": "STATUS Meninggal Inacbg dan Vclaim Beda",
                        //     "width": "200px",
                        // },
                        {
                            "field": "tglmasukberbeda",
                            "title": "STATUS TGL MASUK",
                            "width": "100px",
                        },
                        {
                            "field": "jeniskelamin",
                            "title": "JK",
                            "width": "60px",
                        },
                        {
                            "field": "jenisrawat",
                            "title": "JENIS RAWAT",
                            "width": "100px",
                        },
                        {
                            "field": "kelasrawat",
                            "title": "KELAS RAWAT",
                            "width": "100px",
                        },
                        {
                            "field": "pending",
                            "title": "Status Pending",
                            "width": "100px",
                        },
                    ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                ,
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };

            $scope.Perbaharui = function () {

                $scope.ClearSearch();

            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPasienPulang();
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
            //sdm service hanya sementara, nanti harus diganti pake service kasir !!

            // ManageSdm.getItem("service/list-generic/?view=Ruangan&select=id,namaRuangan").then(function(dat) {
            // $scope.listRuangan = dat.data;
            // });





            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [
                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }
            ];

        }
    ]);
});